"use client";

import { CustomChart } from "echarts/charts";
import { inkOn, mix, defineChart, makeFormatter, resolveIcon, dodge, measureText, truncateText, wrapText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface OrbitChartProps {
  /** Name field: one dot per row. */
  name: string;
  /** Field naming the ring each dot sits on: a category, level or period. */
  ring: string;
  /** Ring order from the centre outward. Default: first appearance in the data. */
  rings?: string[];
  /** Optional value field: dot area. Without it every dot is the same size. */
  value?: string;
  /** Optional numeric field that sets the angle round the ring. Without it dots are spaced evenly. */
  angle?: string;
  /** Values of `angle` that map to a full turn, as `[start, end]`, clockwise from 12 o'clock. Default `[0, 360]`. */
  angleDomain?: [number, number];
  /** What the rings mean, for the key. Default: the `ring` field name. */
  ringLabel?: string;
  /** What the angle means, for the key, e.g. "Clockwise from the top: month of launch". */
  angleLabel?: string;
  /** What dot area means, for the key. Default: the `value` field name. */
  sizeLabel?: string;
  /** Icon in the centre disc: a built-in name or `path://`. */
  icon?: string;
  /** Short text in the centre disc, used when there is no `icon`. */
  centerLabel?: string;
  /** `"ring"` gives each ring its own colour, `"single"` uses the accent for every dot. Default `"ring"`. */
  colorBy?: "ring" | "single";
  /** Show the key that explains rings, angle and dot area. Default true. */
  showKey?: boolean;
}

type _Box = { x: number; y: number; w: number; h: number };
const MAX_COLOURS = 8;

type _Item = { key: string; ring: string; ri: number; value: number | null; angle: number | null };
type _Out = { x: number; y: number; align: "left" | "right" | "center"; name: string; value: string; num?: boolean; inside?: boolean };
type _KeyLine = { glyph: "ring" | "angle" | "dot" | null; text: string; x: number; row: number };
type _ListRow = { kind: "head"; text: string } | { kind: "item"; i: number; num: number; name: string; value: string } | { kind: "gap" };
interface _OrbitEnv {
  font: string;
  fmt: (v: number) => string;
  upper: (s: string) => string;
  highlight: string[];
}
const NARROW = 480;
const LIST_LH = 17;

/**
 * All geometry, shared by the `height` hook and `build`. `H` undefined asks for the natural
 * height. Under 480px every name moves to a numbered list under the rings, which then take
 * the full width; at any width a dot whose label found no free spot is numbered and listed
 * too, so no name or value is left to the tooltip.
 */
function _orbitLayout(p: OrbitChartProps & { showKey?: boolean }, rows: Record<string, unknown>[], W: number, H: number | undefined, env: _OrbitEnv) {
  const font = env.font;
  const order: string[] = [...(p.rings ?? [])];
  const items: _Item[] = [];
  for (const r of rows) {
    const ring = String(r[p.ring] ?? "");
    if (!order.includes(ring)) order.push(ring);
    const v = p.value ? toNumber(r[p.value]) : NaN;
    const a = p.angle ? toNumber(r[p.angle]) : NaN;
    items.push({ key: String(r[p.name] ?? ""), ring, ri: 0, value: Number.isNaN(v) ? null : Math.max(0, v), angle: Number.isNaN(a) ? null : a });
  }
  const ringNames = order.filter((g) => items.some((d) => d.ring === g));
  for (const d of items) d.ri = ringNames.indexOf(d.ring);
  const n = items.length;
  const K = Math.max(1, ringNames.length);
  const sized = !!p.value && items.some((d) => d.value != null);
  const vmax = Math.max(0, ...items.map((d) => d.value ?? 0)) || 1;
  const narrow = W < NARROW;
  const lit = (d: _Item) => env.highlight.length > 0 && env.highlight.includes(d.key);

  // Key: flowed under the rings, wrapped to the width.
  const keyParts: { glyph: "ring" | "angle" | "dot"; text: string }[] = [];
  if (p.showKey !== false && n) {
    keyParts.push({ glyph: "ring", text: p.ringLabel ?? `Ring: ${p.ring}, ${ringNames[0]} innermost` });
    keyParts.push({ glyph: "angle", text: p.angleLabel ?? (p.angle ? `Angle: ${p.angle}, clockwise from the top` : "Position round a ring has no meaning") });
    if (sized) keyParts.push({ glyph: "dot", text: `Dot area: ${p.sizeLabel ?? p.value}` });
  }
  const keySize = 11;
  const keyLines: _KeyLine[] = [];
  {
    let x = 0;
    let row = 0;
    for (const part of keyParts) {
      const lines = wrapText(part.text, W - 22, keySize, font);
      const w = 18 + measureText(lines[0], keySize, font);
      if (lines.length > 1 || (x > 0 && x + w > W)) {
        if (x > 0) row++;
        lines.forEach((line, li) => keyLines.push({ glyph: li === 0 ? part.glyph : null, text: line, x: 0, row: row + li }));
        row += lines.length;
        x = 0;
      } else {
        keyLines.push({ glyph: part.glyph, text: lines[0], x, row });
        x += w + 22;
      }
    }
  }
  const keyRows = keyLines.length ? Math.max(...keyLines.map((l) => l.row)) + 1 : 0;
  const keyH = keyRows ? keyRows * 17 + 10 : 0;

  const labelText = (d: _Item) => ({ name: d.key, value: sized && d.value != null ? env.fmt(d.value) : "" });
  const labelW = (d: _Item) => {
    const s = labelText(d);
    return measureText(s.name, 11.5, font, 600) + (s.value ? 5 + measureText(s.value, 11.5, font) : 0);
  };
  const outerLabels = items.filter((d) => d.ri === K - 1).map(labelW);
  const sideRoom = narrow ? 14 : Math.min(140, Math.max(40, ...outerLabels) + 22);
  const numW = measureText("88", 10, font, 700) + 2;

  const place = (areaH: number) => {
    const Rmax = Math.max(40, Math.min(W / 2 - sideRoom, areaH / 2 - 20));
    const cx = W / 2;
    const cy = areaH / 2;
    const r0 = p.icon || p.centerLabel ? Math.max(18, Math.min(46, Rmax * 0.17)) : 7;
    const rInner = K === 1 ? Rmax : Math.max(r0 + 30, Rmax / (K + 0.35));
    const ringR = (j: number) => (K === 1 ? Rmax : rInner + ((Rmax - rInner) * j) / (K - 1));
    const stepR = K === 1 ? Rmax - r0 : (Rmax - rInner) / (K - 1);
    const dotMax = Math.max(5, Math.min(24, stepR * 0.4, (rInner - r0) * 0.7));
    const dotR = (d: _Item) => (sized ? Math.max(2.5, Math.sqrt((d.value ?? 0) / vmax) * dotMax) : Math.min(7, dotMax));

    // Angles, in radians clockwise from 12 o'clock. Dots that would touch are nudged apart round the ring.
    const [d0, d1] = p.angleDomain ?? [0, 360];
    const theta: number[] = items.map(() => 0);
    const ringGap: number[] = [];
    for (let j = 0; j < K; j++) {
      const mine = items.map((d, i) => ({ d, i })).filter((o) => o.d.ri === j);
      const m = mine.length;
      const R = ringR(j);
      const given = !!p.angle && mine.every((o) => o.d.angle != null);
      const raw = mine.map((o, k) => (given ? (((o.d.angle! - d0) / (d1 - d0 || 1)) * 2 * Math.PI) % (2 * Math.PI) : ((k + 0.5) / m) * 2 * Math.PI + j * 0.55));
      const need = Math.max(0, ...mine.map((o) => dotR(o.d))) * 2 + 3;
      const spread = given && m > 1 ? dodge(raw, Math.min((2 * Math.PI) / m, need / R)) : raw;
      mine.forEach((o, k) => (theta[o.i] = spread[k]));
      // The ring's name goes in the widest gap between its dots, as near the top as ties allow.
      const sorted = spread.map((a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b);
      let best = 0;
      let bestGap = -1;
      sorted.forEach((a, k) => {
        const next = k === sorted.length - 1 ? sorted[0] + 2 * Math.PI : sorted[k + 1];
        const gap = next - a;
        const mid = (a + gap / 2) % (2 * Math.PI);
        const fromTop = Math.min(mid, 2 * Math.PI - mid);
        if (gap > bestGap + 0.05 || (Math.abs(gap - bestGap) <= 0.05 && fromTop < Math.min(best, 2 * Math.PI - best))) {
          bestGap = gap;
          best = mid;
        }
      });
      ringGap.push(m ? best : 0);
    }
    const pos = (R: number, a: number) => ({ x: cx + Math.sin(a) * R, y: cy - Math.cos(a) * R });
    const dots = items.map((d, i) => ({ ...pos(ringR(d.ri), theta[i]), r: dotR(d) }));

    // Ring names: small boxed labels sitting on their ring.
    const taken: _Box[] = [];
    const ringTags = ringNames.map((name, j) => {
      const R = ringR(j);
      const text = truncateText(env.upper(name), Math.max(40, R * 1.2), 10, font, 700);
      const w = measureText(text, 10, font, 700) + 12;
      const at = pos(R, ringGap[j]);
      const b = { x: Math.max(1, Math.min(W - w - 1, at.x - w / 2)), y: at.y - 9, w, h: 18 };
      taken.push(b);
      return { ...b, text };
    });

    // Dot labels: the side facing away from the centre first, then the others. A label with
    // no free spot becomes a number beside the dot and a line in the list under the rings.
    const hitsDot = (b: _Box, skip: number) =>
      [...dots, { x: cx, y: cy, r: r0 + 2 }].some((c, j) => {
        if (j === skip) return false;
        const nx = Math.max(b.x, Math.min(c.x, b.x + b.w));
        const ny = Math.max(b.y, Math.min(c.y, b.y + b.h));
        return (c.x - nx) ** 2 + (c.y - ny) ** 2 < (c.r + 2) ** 2;
      });
    const hitsBox = (b: _Box) => taken.some((q) => q.x < b.x + b.w + 3 && b.x < q.x + q.w + 3 && q.y < b.y + b.h + 1 && b.y < q.y + q.h + 1);
    const outs: (_Out | null)[] = items.map(() => null);
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: 1, dy: 1 },
      { dx: -1, dy: -1 },
      { dx: -1, dy: 1 },
    ];
    items
      .map((_, i) => i)
      .sort((a, b) => Number(lit(items[b])) - Number(lit(items[a])) || items[b].ri - items[a].ri || (items[b].value ?? 0) - (items[a].value ?? 0) || a - b)
      .forEach((i) => {
        const c = dots[i];
        const d = items[i];
        const s = labelText(d);
        const ox = c.x - cx;
        const oy = c.y - cy;
        const along = (u: { dx: number; dy: number }) => (u.dx * ox + u.dy * oy) / Math.hypot(u.dx, u.dy);
        const sortedDirs = [...dirs].sort((u, v) => along(v) - along(u));
        const tryAt = (w: number, h: number, pad: number, strict: boolean) => {
          for (const s2 of sortedDirs) {
            // Diagonal spots tuck the label against the dot's shoulder.
            const diag = s2.dx !== 0 && s2.dy !== 0;
            const g = diag ? c.r * 0.7 + pad - 2 : c.r + pad;
            const b: _Box = { x: s2.dx > 0 ? c.x + g : s2.dx < 0 ? c.x - g - w : c.x - w / 2, y: s2.dy > 0 ? c.y + g : s2.dy < 0 ? c.y - g - h : c.y - h / 2, w, h };
            if (strict && (b.x < 1 || b.x + b.w > W - 1 || b.y < 0 || b.y + b.h > areaH || hitsDot(b, i) || hitsBox(b))) continue;
            taken.push(b);
            return { x: s2.dx > 0 ? b.x : s2.dx < 0 ? b.x + w : c.x, y: b.y + h / 2, align: (s2.dx > 0 ? "left" : s2.dx < 0 ? "right" : "center") as _Out["align"] };
          }
          return null;
        };
        if (!narrow) {
          const name = truncateText(s.name, 170 - (s.value ? measureText(s.value, 11.5, font) + 5 : 0), 11.5, font, 600);
          const w = measureText(name, 11.5, font, 600) + (s.value ? 5 + measureText(s.value, 11.5, font) : 0);
          const at = tryAt(w, 15, 5, true);
          if (at) {
            outs[i] = { ...at, name, value: s.value };
            return;
          }
        }
        // The number sits inside a dot big enough to hold it, otherwise beside it.
        if (c.r >= 9) outs[i] = { x: c.x, y: c.y, align: "center", name: s.name, value: s.value, num: true, inside: true };
        else outs[i] = { ...(tryAt(numW, 12, 3, true) ?? tryAt(numW, 12, 3, false)!), name: s.name, value: s.value, num: true };
      });
    return { cx, cy, r0, ringR, dots, ringTags, outs };
  };

  // The list: numbered dots grouped by ring, flowed into as many columns as fit.
  const listOf = (outs: (_Out | null)[]) => {
    const idx = items.map((_, i) => i).filter((i) => outs[i]?.num).sort((a, b) => items[a].ri - items[b].ri || a - b);
    if (!idx.length) return { rows: [] as _ListRow[], cols: 1, perCol: 0, colW: W, h: 0, numOf: new Map<number, number>() };
    const numOf = new Map<number, number>();
    const flat: _ListRow[] = [];
    let entryW = 0;
    idx.forEach((i, k) => {
      const d = items[i];
      if (narrow && K > 1 && (k === 0 || items[idx[k - 1]].ri !== d.ri)) flat.push({ kind: "head", text: env.upper(d.ring) });
      const s = labelText(d);
      numOf.set(i, k + 1);
      flat.push({ kind: "item", i, num: k + 1, name: s.name, value: s.value });
      entryW = Math.max(entryW, 34 + measureText(s.name, 11.5, font, 600) + (s.value ? 6 + measureText(s.value, 11.5, font) : 0));
    });
    const gap = 18;
    let cols = Math.max(1, Math.min(narrow ? 2 : 4, Math.floor((W + gap) / (Math.min(entryW, 200) + gap))));
    // Two short columns read better than one long one on a phone, even if names are cut.
    if (narrow && cols === 1 && flat.length > 6 && W >= 300) cols = 2;
    const colW = (W - (cols - 1) * gap) / cols;
    const perCol = Math.ceil(flat.length / cols);
    // A ring heading never ends a column: push it to the next one.
    const out: _ListRow[] = [];
    for (const row of flat) {
      if (row.kind === "head" && out.length % perCol === perCol - 1 && perCol > 1) out.push({ kind: "gap" });
      out.push(row);
    }
    const rowsPerCol = Math.max(perCol, Math.ceil(out.length / cols));
    return { rows: out, cols, perCol: rowsPerCol, colW, h: rowsPerCol * LIST_LH + 14, numOf };
  };

  let areaH: number;
  let placed: ReturnType<typeof place>;
  let list: ReturnType<typeof listOf>;
  if (H == null) {
    // Natural height: the rings take the width on a phone, the long-standing 460/540 otherwise.
    areaH = narrow ? Math.max(200, W - 2 * sideRoom + 40) : (K >= 5 || n > 24 ? 640 : n <= 10 ? 460 : 540) - keyH;
    placed = place(areaH);
    list = listOf(placed.outs);
  } else {
    areaH = Math.max(120, H - keyH);
    placed = place(areaH);
    list = listOf(placed.outs);
    // Making room for the list shrinks the rings, which can push more labels into it.
    for (let pass = 0; pass < 3 && list.h > 0 && areaH !== Math.max(120, H - keyH - list.h); pass++) {
      areaH = Math.max(120, H - keyH - list.h);
      placed = place(areaH);
      const next = listOf(placed.outs);
      const grew = next.h > list.h;
      list = next;
      if (!grew) break;
    }
  }
  return { items, ringNames, n, K, sized, keyLines, keyH, keySize, areaH, list, natural: areaH + list.h + keyH, ...placed };
}

/**
 * Things grouped by level round one centre. Rings are categories, so their spacing is
 * even and says nothing; the key under the graphic states what rings, angle and dot
 * area mean, because none of the three is self-evident.
 */
export const OrbitChart = defineChart<OrbitChartProps>({
  name: "orbit-chart",
  title: "Orbit chart",
  category: "poster",
  description: "Places items as dots on concentric rings round a centre, one ring per category, level or period, with a key that explains rings, angle and dot area.",
  whenToUse: "A designed alternative to a table for 6 to about 40 named things grouped by distance, level or era from one centre: suppliers by tier, moons by planet-distance band, releases by decade, stakeholders by closeness. One item can be highlighted.",
  avoid: "A numeric distance that must be read exactly (use strip-plot or scatter-chart); comparison of the dot values (use bar-chart); more than about 6 rings or 40 items (use data-table); hierarchy with sizes that add up (use treemap or circle-pack).",
  use: [CustomChart],
  defaults: { colorBy: "ring", showKey: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "dots" ? params.name : null),
  height: (p, rows, width) => {
    if (!width) return rows.length <= 10 ? 460 : 540;
    return _orbitLayout(p, rows, width, undefined, { font: "sans-serif", fmt: makeFormatter(p.format), upper: (s) => s.toLocaleUpperCase(), highlight: p.highlight == null ? [] : Array.isArray(p.highlight) ? p.highlight : [p.highlight] }).natural;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one dot per row." },
    { name: "ring", type: "string", required: true, description: "Field naming the ring each dot sits on: a category, level or period." },
    { name: "rings", type: "string[]", description: "Ring order from the centre outward. Default: first appearance in the data." },
    { name: "value", type: "string", description: "Value field: dot area. Without it every dot is the same size." },
    { name: "angle", type: "string", description: "Numeric field that sets the angle round the ring. Without it dots are spaced evenly." },
    { name: "angleDomain", type: "[number, number]", default: "[0, 360]", description: "Values of `angle` that map to a full turn, clockwise from 12 o'clock." },
    { name: "ringLabel", type: "string", description: "What the rings mean, for the key. Default: the `ring` field name." },
    { name: "angleLabel", type: "string", description: 'What the angle means, for the key, e.g. "Clockwise from the top: month of launch".' },
    { name: "sizeLabel", type: "string", description: "What dot area means, for the key. Default: the `value` field name." },
    { name: "icon", type: "string", description: "Icon in the centre disc: a built-in name or `path://`." },
    { name: "centerLabel", type: "string", description: "Short text in the centre disc, used when there is no `icon`." },
    { name: "colorBy", type: '"ring" | "single"', default: '"ring"', description: "A colour per ring, or the accent for every dot." },
    { name: "showKey", type: "boolean", default: "true", description: "Show the key that explains rings, angle and dot area." },
  ],
  example: {
    type: "orbit-chart",
    data: [
      { supplier: "Halden Cells", tier: "Tier 1", spend: 84 },
      { supplier: "Orrin Motors", tier: "Tier 1", spend: 61 },
      { supplier: "Vale Castings", tier: "Tier 1", spend: 37 },
      { supplier: "Kestrel Wiring", tier: "Tier 2", spend: 22 },
      { supplier: "Brask Cathodes", tier: "Tier 2", spend: 48 },
      { supplier: "Lumen Glass", tier: "Tier 2", spend: 15 },
      { supplier: "Pell Magnets", tier: "Tier 2", spend: 29 },
      { supplier: "Tarn Lithium", tier: "Tier 3", spend: 33 },
      { supplier: "Iver Copper", tier: "Tier 3", spend: 19 },
      { supplier: "Sorrel Graphite", tier: "Tier 3", spend: 12 },
      { supplier: "Moss Resins", tier: "Tier 3", spend: 6 },
      { supplier: "Dunmore Nickel", tier: "Tier 3", spend: 26 },
    ],
    name: "supplier",
    ring: "tier",
    value: "spend",
    format: "${value}m",
    centerLabel: "Car plant",
    highlight: "Brask Cathodes",
    ringLabel: "Tier 1 sells to the plant, each further ring sells to the ring inside it",
    sizeLabel: "annual spend",
    title: "Brask Cathodes is a tier 2 supplier with $48 million of annual spend",
    subtitle: "12 suppliers to one car plant by supply-chain tier, annual spend in $ million",
    note: "Illustrative figures for invented companies",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const W = ctx.width;
    type Item = _Item;
    const upper = (s: string) => s.toLocaleUpperCase(ctx.locale);
    const { items, ringNames, n, K, sized, keyLines, keySize, areaH, list, cx, cy, r0, ringR, dots, outs, ringTags } = _orbitLayout(p, ctx.rows, W, ctx.height, { font: t.fontFamily, fmt: ctx.fmt, upper, highlight: ctx.highlight });

    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (d: Item) => {
      if (anyHighlight) return ctx.color(ctx.highlight.includes(d.key) ? d.key : d.ring);
      if (p.colorBy === "single") return ctx.color();
      return d.ri < MAX_COLOURS ? ctx.color(d.ring, d.ri) : t.context;
    };
    const fillOf = (d: Item) => (ctx.selected(d.key) ? baseOf(d) : mix(t.surface, baseOf(d), 0.3));
    const listTop = areaH + 8;
    const listAt = new Map<number, { x: number; y: number; row: Extract<_ListRow, { kind: "item" }> }>();
    const heads: { x: number; y: number; text: string }[] = [];
    list.rows.forEach((row, k) => {
      const x = Math.floor(k / list.perCol) * (list.colW + 18);
      const y = listTop + (k % list.perCol) * LIST_LH + LIST_LH / 2;
      if (row.kind === "item") listAt.set(row.i, { x, y, row });
      else if (row.kind === "head") heads.push({ x, y, text: row.text });
    });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const d = items[i];
      const c = dots[i];
      if (!d || !c) return null;
      const fill = fillOf(d);
      const lit = anyHighlight && !ctx.dimmed(d.key);
      const strong = ctx.selected(d.key);
      const delay = Math.min(600, i * 35);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 260 };
      const children: any[] = [];
      if (lit) children.push({ type: "circle", silent: true, shape: { cx: c.x, cy: c.y, r: c.r + 4.5 }, style: { stroke: t.ink, lineWidth: 1, fill: "none", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      children.push({ type: "circle", shape: { cx: c.x, cy: c.y, r: c.r, enterFrom: { r: 0 } }, style: { fill, stroke: t.surface, lineWidth: 1.5 }, emphasis: { style: { fill: mix(fill, inkOn(fill), 0.12) } }, blur: fade, transition: ["shape", "style"], enterAnimation: { duration: 480, delay, easing: "cubicOut" } });
      const out = outs[i];
      const halo = { stroke: t.surface, lineWidth: 3 };
      if (out?.num) {
        const entry = listAt.get(i);
        const num = String(entry?.row.num ?? "");
        children.push({
          type: "text",
          silent: true,
          style: { text: num, x: out.x, y: out.y + 0.5, align: out.align, verticalAlign: "middle", fill: out.inside ? inkOn(fill) : strong ? t.ink : t.muted, fontSize: 10, fontWeight: 700, fontFamily: t.fontFamily, ...(out.inside ? null : halo), opacity: 1, enterFrom: { opacity: 0 } },
          blur: fade,
          enterAnimation: appear,
        });
        if (entry) {
          // The list line belongs to the dot's group, so hovering either one lights both.
          const valueW = entry.row.value ? measureText(entry.row.value, 11.5, t.fontFamily) + 6 : 0;
          const name = truncateText(entry.row.name, list.colW - 34 - valueW, 11.5, t.fontFamily, 600);
          children.push({ type: "rect", shape: { x: entry.x, y: entry.y - LIST_LH / 2, width: list.colW, height: LIST_LH }, style: { fill: t.surface, opacity: 0 } });
          children.push({ type: "circle", silent: true, shape: { cx: entry.x + 4, cy: entry.y, r: 3.5 }, style: { fill }, blur: fade });
          children.push({
            type: "text",
            silent: true,
            style: {
              text: `{k|${num}}{n|${name}}${entry.row.value ? `{g|}{v|${entry.row.value}}` : ""}`,
              x: entry.x + 12,
              y: entry.y + 0.5,
              verticalAlign: "middle",
              rich: { k: { width: 16, fill: t.muted, fontSize: 10, fontWeight: 700, fontFamily: t.fontFamily }, n: { fill: strong ? t.ink : t.muted, fontSize: 11.5, fontWeight: lit ? 700 : 600, fontFamily: t.fontFamily }, g: { width: 6 }, v: { fill: t.inkSecondary, fontSize: 11.5, fontFamily: t.fontFamily } },
              opacity: 1,
              enterFrom: { opacity: 0 },
            },
            blur: fade,
            enterAnimation: appear,
          });
        }
      } else if (out) {
        const nameStyle = { fill: strong ? t.ink : t.muted, fontSize: 11.5, fontWeight: lit ? 700 : 600, fontFamily: t.fontFamily };
        children.push({
          type: "text",
          silent: true,
          style: {
            text: out.value ? (out.align === "right" ? `{v|${out.value}}{g|}{n|${out.name}}` : `{n|${out.name}}{g|}{v|${out.value}}`) : `{n|${out.name}}`,
            x: out.x,
            y: out.y,
            align: out.align,
            verticalAlign: "middle",
            // A surface halo keeps the name readable where a ring passes behind it.
            rich: { n: { ...nameStyle, ...halo }, g: { width: 5 }, v: { fill: t.inkSecondary, fontSize: 11.5, fontFamily: t.fontFamily, ...halo } },
            opacity: 1,
            enterFrom: { opacity: 0 },
          },
          blur: fade,
          enterAnimation: appear,
        });
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const renderDeco = () => {
      const children: any[] = [];
      for (let j = 0; j < K; j++) children.push({ type: "circle", shape: { cx, cy, r: ringR(j) }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round", fill: "none" } });
      for (const tag of ringTags) {
        children.push({ type: "rect", shape: { x: tag.x + 0.5, y: tag.y + 0.5, width: tag.w - 1, height: tag.h - 1, r: 3 }, style: { fill: t.surface, stroke: t.axis, lineWidth: 1 } });
        children.push({ type: "text", style: { text: tag.text, x: tag.x + tag.w / 2, y: tag.y + tag.h / 2 + 0.5, fill: t.inkSecondary, fontSize: 10, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      }
      children.push({ type: "circle", shape: { cx, cy, r: r0 }, style: { fill: t.ink } });
      if (p.icon) {
        const icon = resolveIcon(p.icon);
        // ECharts lays a custom path out once and does not redo it when x/y/width/height change, so the shape stays a fixed 100px box and the transform places it.
        const s = (r0 * 1.05) / 100;
        children.push({ type: "path", shape: { pathData: icon.d, x: -50, y: -50, width: 100, height: 100, layout: "center" }, x: cx, y: cy, scaleX: s, scaleY: s, style: { fill: t.surface } });
      } else if (p.centerLabel) {
        const size = Math.max(9, Math.min(12, r0 / 3.2));
        const lines = wrapText(upper(p.centerLabel), r0 * 1.6, size, t.fontFamily, 700).slice(0, 3);
        lines.forEach((line, li) => children.push({ type: "text", style: { text: truncateText(line, r0 * 1.75, size, t.fontFamily, 700), x: cx, y: cy + (li - (lines.length - 1) / 2) * size * 1.25, fill: t.surface, fontSize: size, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } }));
      }
      for (const h of heads) children.push({ type: "text", style: { text: h.text, x: h.x, y: h.y + 1, fill: t.muted, fontSize: 10, fontWeight: 700, fontFamily: t.fontFamily, verticalAlign: "middle" } });
      // Key.
      const ky = areaH + list.h + 12;
      for (const line of keyLines) {
        const y = ky + line.row * 17 + 6;
        const gx = line.x + 6;
        if (line.glyph === "ring") children.push({ type: "circle", shape: { cx: gx, cy: y, r: 5 }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 2.5], lineCap: "round", fill: "none" } });
        if (line.glyph === "angle") {
          children.push({ type: "arc", shape: { cx: gx, cy: y, r: 5, startAngle: -Math.PI / 2, endAngle: Math.PI * 0.75 }, style: { stroke: t.muted, lineWidth: 1.25, fill: "none" } });
          children.push({ type: "circle", shape: { cx: gx, cy: y - 5, r: 1.6 }, style: { fill: t.muted } });
        }
        if (line.glyph === "dot") {
          children.push({ type: "circle", shape: { cx: gx - 2, cy: y + 1, r: 4 }, style: { fill: t.muted } });
          children.push({ type: "circle", shape: { cx: gx + 4.5, cy: y + 3, r: 2 }, style: { fill: t.muted } });
        }
        children.push({ type: "text", style: { text: line.text, x: line.x + 18, y: y + 0.5, fill: t.muted, fontSize: keySize, fontFamily: t.fontFamily, verticalAlign: "middle" } });
      }
      return { type: "group", silent: true, children };
    };

    const lit = items.filter((d) => anyHighlight && !ctx.dimmed(d.key));
    return {
      alt: n
        ? `Orbit chart: ${n} items on ${K} rings round ${p.centerLabel ? `"${p.centerLabel}"` : "a centre"}, one ring per ${p.ring}, from ${ringNames[0]} innermost to ${ringNames[K - 1]} outermost${sized ? `, with dot area showing ${p.sizeLabel ?? p.value}` : ""}. ${ringNames.map((g) => `${g}: ${items.filter((d) => d.ring === g).map((d) => d.key + (sized && d.value != null ? ` ${ctx.fmt(d.value)}` : "")).slice(0, 8).join(", ")}`).join(". ")}.${lit.length ? ` Highlighted: ${lit.map((d) => d.key).join(", ")}.` : ""}`
        : "Orbit chart: no rows to draw.",
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const item = items[d.dataIndex];
            if (!item || d.seriesId !== "dots") return "";
            return tooltipHtml(ctx, item.key, [{ name: p.ring, value: item.ring, color: fillOf(item) }, ...(sized && item.value != null ? [{ name: p.value!, value: ctx.fmt(item.value) }] : []), ...(p.angle && item.angle != null ? [{ name: p.angle, value: String(item.angle) }] : [])]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, z: 1, tooltip: { show: false }, renderItem: renderDeco as any, data: [0] },
          {
            id: "dots",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((d) => ({ id: d.key, name: d.key, value: [d.value ?? 0] })),
          },
        ],
      },
    };
  },
});
