import { CustomChart } from "echarts/charts";
import { inkOn, mix, ramp } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { makeFormatter, type FormatSpec } from "../core/format";
import { measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";

export interface BubbleScaleProps {
  /** Name field: one circle per row. */
  name: string;
  /** Numeric field that positions each circle along the scale. Printed with `format`. */
  value: string;
  /** Numeric field for circle area. Printed inside or beside each circle with `sizeFormat`. */
  size: string;
  /** Field that colours circles by category. Default: circles are shaded along the scale with the sequential ramp. */
  series?: string;
  /** Direction of the scale. Default `"vertical"`. Narrow containers always use vertical. */
  orientation?: "vertical" | "horizontal";
  /** Scale range as `[min, max]`. Default: the data extent rounded out to the tick step. */
  domain?: [number, number];
  /** Values to mark on the scale. Default: about five round values. */
  ticks?: number[];
  /** Short name of the scale measure, printed at the head of the scale. */
  scaleLabel?: string;
  /** How to print the size measure. */
  sizeFormat?: FormatSpec;
  /** Thin dotted guide line at each scale mark. Default true. */
  guides?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

type _B = { a: number; c: number; r: number };

/**
 * Place circles whose position along the scale (`a`) is fixed, largest first, each at the
 * cross position nearest the centre line that touches nothing already placed. Sorted input
 * and no randomness: the same data always gives the same picture. Returns the half-width used.
 */
function _spread(items: _B[], pad: number): number {
  const order = items.map((_, i) => i).sort((x, y) => items[y].r - items[x].r || x - y);
  const placed: _B[] = [];
  let extent = 0;
  for (const i of order) {
    const b = items[i];
    const cand = [0];
    const near: _B[] = [];
    for (const q of placed) {
      const d = q.r + b.r + pad;
      const da = q.a - b.a;
      if (Math.abs(da) >= d) continue;
      near.push(q);
      const dc = Math.sqrt(d * d - da * da);
      cand.push(q.c + dc, q.c - dc);
    }
    // Ties go right then left, so the swarm stays symmetric about the centre line.
    cand.sort((x, y) => Math.abs(x) - Math.abs(y) || y - x);
    let at = 0;
    for (const c of cand) {
      let free = true;
      for (const q of near) {
        const d = q.r + b.r + pad - 1e-6;
        if ((q.a - b.a) ** 2 + (q.c - c) ** 2 < d * d) {
          free = false;
          break;
        }
      }
      if (free) {
        at = c;
        break;
      }
    }
    b.c = at;
    placed.push(b);
    extent = Math.max(extent, Math.abs(at) + b.r);
  }
  return extent;
}

const MAX_HUES = 6;

type _Node = { key: string; series: string; value: number; size: number };
type _Out = { x: number; y: number; align: "left" | "right" | "center"; name: string; value: string };
type _Inside = { valueSize: number; weight: number; lines: string[]; nameSize: number };
interface _ScaleEnv {
  font: string;
  display: string;
  locale?: string;
  fmt: (v: number) => string;
  fmtSize: (v: number) => string;
}
const KEY_LH = 18;

/** Scale, swarm and labels for a plot `W` by `H` px. Shared by the `height` hook and `build`. */
function _scaleLayout(p: BubbleScaleProps, rows: Record<string, unknown>[], W: number, H: number, env: _ScaleEnv) {
  const compact = W < 480;
  const fmtSize = env.fmtSize;
  const nodes: _Node[] = [];
  for (const r of rows) {
    const v = toNumber(r[p.value]);
    const s = toNumber(r[p.size]);
    if (Number.isNaN(v) || Number.isNaN(s) || s <= 0) continue;
    nodes.push({ key: String(r[p.name] ?? ""), series: p.series ? String(r[p.series] ?? "") : "", value: v, size: s });
  }
  const n = nodes.length;
  const vertical = compact || p.orientation !== "horizontal";

  // Scale and its marks.
  let dmin = Math.min(...nodes.map((d) => d.value));
  let dmax = Math.max(...nodes.map((d) => d.value));
  if (!n) [dmin, dmax] = [0, 1];
  const step = niceStep((dmax - dmin || Math.abs(dmax) || 1) / (compact && !vertical ? 3 : 5));
  const lo = p.domain?.[0] ?? Math.floor(dmin / step + 1e-9) * step;
  const hi = Math.max(lo + 1e-9, p.domain?.[1] ?? Math.max(lo + step, Math.ceil(dmax / step - 1e-9) * step));
  const ticks = (p.ticks ?? Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => Math.round((lo + i * step) * 1e9) / 1e9)).filter((v) => v >= lo - 1e-9 && v <= hi + 1e-9);
  const tickTexts = ticks.map((v) => env.fmt(v));
  const tickW = Math.max(18, ...tickTexts.map((s) => measureText(s, 11, env.font, 600))) + 12;
  const tickH = 18;


  // Frame. `a` runs along the scale in px, `c` across it.
  const strip = vertical ? tickW + 12 : tickH + 10 + (p.scaleLabel ? 16 : 0);
  const headroom = vertical && p.scaleLabel ? 22 : 0;
  const acrossLen = vertical ? W - strip - 6 : H - strip - 6;
  const alongLen = vertical ? H - headroom : W;
  const acrossMid = vertical ? strip + acrossLen / 2 : acrossLen / 2 + 3;
  const smax = Math.max(...nodes.map((d) => d.size), 0) || 1;

  // Shrink the circles until the swarm fits across, and pad the ends so no circle is cut off.
  let rmax = Math.min(130, acrossLen * 0.3, alongLen * 0.26);
  let items: _B[] = [];
  let a0 = 0;
  let a1 = alongLen;
  const posOf = (v: number) => (vertical ? a1 - ((v - lo) / (hi - lo)) * (a1 - a0) : a0 + ((v - lo) / (hi - lo)) * (a1 - a0));
  for (let attempt = 0; attempt < 14; attempt++) {
    const rs = nodes.map((d) => Math.max(1.5, Math.sqrt(d.size / smax) * rmax));
    a0 = (vertical ? headroom : 0) + 12;
    a1 = (vertical ? H : W) - 12;
    for (let pass = 0; pass < 4; pass++) {
      const span = Math.max(40, a1 - a0);
      const needLo = Math.max(12, ...nodes.map((d, i) => rs[i] + 3 - ((d.value - lo) / (hi - lo)) * span));
      const needHi = Math.max(12, ...nodes.map((d, i) => rs[i] + 3 - ((hi - d.value) / (hi - lo)) * span));
      if (vertical) {
        a0 = headroom + needHi;
        a1 = H - needLo;
      } else {
        a0 = needLo;
        a1 = W - needHi;
      }
    }
    items = nodes.map((d, i) => ({ a: posOf(d.value), c: 0, r: rs[i] }));
    _spread(items, 3);
    // The swarm is re-centred afterwards, so what matters is its full width, not its reach to one side.
    const used = Math.max(...items.map((b) => b.c + b.r), 0) - Math.min(...items.map((b) => b.c - b.r), 0);
    if (used <= acrossLen || rmax < 8) break;
    rmax *= Math.max(0.72, Math.min(0.94, acrossLen / used));
  }
  // Centre the swarm on what it actually used rather than on the first circle.
  const cmin = Math.min(...items.map((b) => b.c - b.r), 0);
  const cmax = Math.max(...items.map((b) => b.c + b.r), 0);
  const shift = acrossMid - (cmin + cmax) / 2;
  const circles = items.map((b) => (vertical ? { x: b.c + shift, y: b.a, r: b.r } : { x: b.a, y: b.c + shift, r: b.r }));

  // Labels: inside when the circle holds them, else in the first free spot beside it.
  const upper = (s: string) => s.toLocaleUpperCase(env.locale);
  const inside = (d: _Node, r: number): _Inside | null => {
    if (r < 20) return null;
    const text = fmtSize(d.size);
    const chord = (dy: number) => (Math.abs(dy) >= r ? 0 : 2 * Math.sqrt(r * r - dy * dy) - Math.max(6, r * 0.16));
    let valueSize = Math.max(12, Math.min(48, r * 0.5));
    const nameSize = Math.round(Math.max(10, Math.min(13, r * 0.17)));
    for (let k = 0; k < 6; k++) {
      const weight = valueSize >= 22 ? 300 : 600;
      const valueH = valueSize * 1.08;
      const lines = wrapText(upper(d.key), chord(valueH / 2 + nameSize * 0.6) - 2, nameSize, env.font, 600);
      const block = valueH + 2 + lines.length * nameSize * 1.25;
      const valueY = -block / 2 + valueH / 2;
      if (lines.length <= 2 && block <= r * 1.7 && measureText(text, valueSize, env.display, weight) <= chord(Math.abs(valueY) + valueH * 0.3) && lines.every((line, i) => measureText(line, nameSize, env.font, 600) <= chord(valueY + valueH / 2 + 2 + (i + 1) * nameSize * 1.25))) return { valueSize, weight, lines, nameSize };
      valueSize *= 0.86;
      if (valueSize < 12) break;
    }
    return null;
  };
  const fits = nodes.map((d, i) => inside(d, circles[i].r));
  const outs: (_Out | null)[] = nodes.map(() => null);
  const taken: { x: number; y: number; w: number; h: number }[] = [];
  const bounds = vertical ? { x0: strip, y0: 0, x1: W, y1: H } : { x0: 0, y0: 0, x1: W, y1: H - strip };
  const hitsCircle = (b: { x: number; y: number; w: number; h: number }, skip: number) =>
    circles.some((c, j) => {
      if (j === skip) return false;
      const nx = Math.max(b.x, Math.min(c.x, b.x + b.w));
      const ny = Math.max(b.y, Math.min(c.y, b.y + b.h));
      return (c.x - nx) ** 2 + (c.y - ny) ** 2 < (c.r + 1) ** 2;
    });
  nodes
    .map((_, i) => i)
    .filter((i) => !fits[i])
    .sort((a, b) => circles[b].r - circles[a].r || a - b)
    .forEach((i) => {
      const c = circles[i];
      const d = nodes[i];
      const value = fmtSize(d.size);
      const w = measureText(d.key, 12, env.font, 600) + 6 + measureText(value, 12, env.font);
      const h = 16;
      const g = c.r + 5;
      const spots: _Out[] = [
        { x: c.x + g, y: c.y, align: "left", name: d.key, value },
        { x: c.x - g, y: c.y, align: "right", name: d.key, value },
        { x: c.x, y: c.y - g - h / 2, align: "center", name: d.key, value },
        { x: c.x, y: c.y + g + h / 2, align: "center", name: d.key, value },
        // Diagonals, tucked against the circle's shoulder.
        { x: c.x + g * 0.72, y: c.y - g * 0.72 - h / 2, align: "left", name: d.key, value },
        { x: c.x + g * 0.72, y: c.y + g * 0.72 + h / 2, align: "left", name: d.key, value },
        { x: c.x - g * 0.72, y: c.y - g * 0.72 - h / 2, align: "right", name: d.key, value },
        { x: c.x - g * 0.72, y: c.y + g * 0.72 + h / 2, align: "right", name: d.key, value },
      ];
      for (const s of spots) {
        const box = { x: s.align === "left" ? s.x : s.align === "right" ? s.x - w : s.x - w / 2, y: s.y - h / 2, w, h };
        if (box.x < bounds.x0 + 2 || box.x + box.w > bounds.x1 - 2 || box.y < bounds.y0 || box.y + box.h > bounds.y1) continue;
        if (hitsCircle(box, i) || taken.some((q) => q.x < box.x + box.w + 4 && box.x < q.x + q.w + 4 && q.y < box.y + box.h && box.y < q.y + q.h)) continue;
        outs[i] = s;
        taken.push(box);
        break;
      }
    });
  return { nodes, n, vertical, lo, hi, ticks, tickTexts, tickW, tickH, strip, posOf, circles, fits, outs };
}

/**
 * The plot plus the key under it. A circle that holds no label and found no free spot
 * beside it is listed in the key with both its values, so nothing is left to the tooltip.
 * `H` undefined asks for the natural height.
 */
function _scalePlan(p: BubbleScaleProps, rows: Record<string, unknown>[], W: number, H: number | undefined, env: _ScaleEnv) {
  const base = p.orientation === "horizontal" && W >= 480 ? 420 : rows.length > 24 ? 620 : 540;
  // With a fixed height the key may take at most 45% of it; the smallest circles drop out first.
  const keyMax = H == null ? Infinity : H * 0.45;
  const keyOf = (lay: ReturnType<typeof _scaleLayout>) => {
    let idx = lay.nodes.map((_, i) => i).filter((i) => !lay.fits[i] && !lay.outs[i]).sort((a, b) => lay.nodes[b].value - lay.nodes[a].value || a - b);
    if (!idx.length) return { entries: [] as { i: number; num: number | null; name: string; pos: string; size: string }[], cols: 1, perCol: 0, colW: W, h: 0 };
    const widest0 = Math.max(...idx.map((i) => 30 + measureText(lay.nodes[i].key, 11.5, env.font, 600) + 6 + measureText(`${env.fmt(lay.nodes[i].value)} · ${env.fmtSize(lay.nodes[i].size)}`, 11.5, env.font)));
    const room = Math.max(1, Math.min(4, Math.floor((W + 18) / (Math.min(widest0, 160) + 18)))) * Math.max(1, Math.floor((keyMax - 26) / KEY_LH));
    if (idx.length > room) {
      const keep = new Set([...idx].sort((a, b) => lay.nodes[b].size - lay.nodes[a].size).slice(0, room));
      idx = idx.filter((i) => keep.has(i));
    }
    let k = 0;
    // Circles big enough to hold a number are numbered; the rest are found by their scale value.
    const entries = idx.map((i) => ({ i, num: lay.circles[i].r >= 8 ? ++k : null, name: lay.nodes[i].key, pos: env.fmt(lay.nodes[i].value), size: env.fmtSize(lay.nodes[i].size) }));
    const widest = Math.max(...entries.map((e) => 30 + measureText(e.name, 11.5, env.font, 600) + 6 + measureText(`${e.pos} · ${e.size}`, 11.5, env.font)));
    const gap = 18;
    const cols = Math.max(1, Math.min(4, Math.floor((W + gap) / (Math.min(widest, 160) + gap))));
    const perCol = Math.ceil(entries.length / cols);
    return { entries, cols, perCol, colW: (W - (cols - 1) * gap) / cols, h: perCol * KEY_LH + 26 };
  };
  let plotH = H == null ? base : Math.max(160, H);

  let lay = _scaleLayout(p, rows, W, plotH, env);
  let key = keyOf(lay);
  if (H != null && key.h > 0) {
    // Making room for the key shrinks the plot, which can move more labels into it.
    for (let pass = 0; pass < 3; pass++) {
      plotH = Math.max(160, H - key.h);
      lay = _scaleLayout(p, rows, W, plotH, env);
      const next = keyOf(lay);
      const grew = next.h > key.h;
      key = next;
      if (!grew) break;
    }
  }
  return { ...lay, plotH, key, natural: plotH + key.h };
}

/**
 * Circles on a scale: where each one sits says one thing, how big it is says another.
 * The scale is marked with small boxed values instead of an axis.
 */
export const BubbleScale = defineChart<BubbleScaleProps>({
  name: "bubble-scale",
  title: "Bubble scale",
  category: "poster",
  description: "Places circles sized by one measure along a single value scale set by another, spread sideways so none overlap, with boxed scale marks instead of an axis.",
  whenToUse: "A poster answer to \"where does each one sit on this scale, and how big is it\": 5 to about 40 named things with a rate or score (the scale) and a magnitude (the area), such as import dependency against share of demand.",
  avoid: "Two measures that should be read against each other on two axes (use scatter-chart); one measure only (use beeswarm-chart or strip-plot); precise comparison of the sizes (use bar-chart); more than about 60 rows (use beeswarm-chart).",
  use: [CustomChart],
  defaults: { guides: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "bubbles" ? params.name : null),
  height: (p, rows, width) => {
    if (!width) return p.orientation === "horizontal" ? 420 : 540;
    return _scalePlan(p, rows, width, undefined, { font: "sans-serif", display: "sans-serif", fmt: makeFormatter(p.format), fmtSize: makeFormatter(p.sizeFormat) }).natural;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one circle per row." },
    { name: "value", type: "string", required: true, description: "Numeric field that positions each circle along the scale. Printed with `format`." },
    { name: "size", type: "string", required: true, description: "Numeric field for circle area. Printed inside or beside each circle with `sizeFormat`." },
    { name: "series", type: "string", description: "Field that colours circles by category. Default: circles are shaded along the scale with the sequential ramp." },
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Direction of the scale. Narrow containers always use vertical." },
    { name: "domain", type: "[number, number]", description: "Scale range. Default: the data extent rounded out to the tick step." },
    { name: "ticks", type: "number[]", description: "Values to mark on the scale. Default: about five round values." },
    { name: "scaleLabel", type: "string", description: "Short name of the scale measure, printed at the head of the scale." },
    { name: "sizeFormat", type: "FormatSpec", description: "How to print the size measure." },
    { name: "guides", type: "boolean", default: "true", description: "Thin dotted guide line at each scale mark." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "bubble-scale",
    data: [
      { material: "Lithium", imported: 100, kt: 38 },
      { material: "Cobalt", imported: 86, kt: 21 },
      { material: "Graphite", imported: 98, kt: 96 },
      { material: "Nickel", imported: 71, kt: 164 },
      { material: "Manganese", imported: 96, kt: 52 },
      { material: "Copper", imported: 48, kt: 410 },
      { material: "Aluminium", imported: 59, kt: 290 },
      { material: "Rare earths", imported: 100, kt: 9 },
      { material: "Silicon metal", imported: 64, kt: 73 },
      { material: "Zinc", imported: 22, kt: 118 },
      { material: "Steel scrap", imported: 4, kt: 520 },
      { material: "Tin", imported: 78, kt: 14 },
    ],
    name: "material",
    value: "imported",
    size: "kt",
    format: "{value}%",
    sizeFormat: "{value} kt",
    domain: [0, 100],
    ticks: [0, 20, 40, 60, 80, 100],
    scaleLabel: "Imported",
    title: "Imports supply between 4% and 100% of the region's demand for 12 materials",
    subtitle: "Share of each material imported (position) and annual demand in thousand tonnes (area), 12 battery and grid materials",
    note: "Illustrative figures for an invented region",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const W = ctx.width;
    const fmtSize = ctx.formatter(p.sizeFormat);
    type Node = _Node;
    const { nodes, n, vertical, lo, hi, ticks, tickTexts, tickW, tickH, strip, posOf, circles, fits, outs, plotH: H, key } = _scalePlan(p, ctx.rows, W, ctx.height, { font: t.fontFamily, display: t.displayFamily, locale: ctx.locale, fmt: ctx.fmt, fmtSize });

    // Colour: identity by series, else magnitude along the scale.
    const keys: string[] = [];
    for (const d of nodes) if (!keys.includes(d.series)) keys.push(d.series);
    const coloured = !!p.series && keys.length > 1;
    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (d: Node) => {
      if (anyHighlight) return ctx.color(ctx.highlight.includes(d.key) ? d.key : d.series);
      if (coloured) return keys.indexOf(d.series) < MAX_HUES ? ctx.color(d.series, keys.indexOf(d.series)) : t.context;
      return ramp(t.sequential, 0.12 + 0.88 * ((d.value - lo) / (hi - lo)));
    };
    const fillOf = (d: Node) => (ctx.selected(d.key) ? baseOf(d) : mix(t.surface, baseOf(d), 0.3));

    const keyTop = H + 16;
    const keyAt = new Map(key.entries.map((e, k) => [e.i, { ...e, x: Math.floor(k / key.perCol) * (key.colW + 18), y: keyTop + (k % key.perCol) * KEY_LH + KEY_LH / 2 }]));

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const d = nodes[i];
      const c = circles[i];
      if (!d || !c) return null;
      const fill = fillOf(d);
      const ink = inkOn(fill);
      const delay = Math.min(600, i * 30);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 260 };
      const children: any[] = [
        {
          type: "circle",
          shape: { cx: c.x, cy: c.y, r: c.r, enterFrom: { r: 0 } },
          style: { fill },
          emphasis: { style: { fill: mix(fill, ink, 0.12) } },
          blur: fade,
          transition: ["shape", "style"],
          enterAnimation: { duration: 520, delay, easing: "cubicOut" },
        },
      ];
      const fi = fits[i];
      if (fi) {
        const valueH = fi.valueSize * 1.08;
        const block = valueH + 2 + fi.lines.length * fi.nameSize * 1.25;
        const top = c.y - block / 2;
        children.push({ type: "text", silent: true, style: { text: fmtSize(d.size), x: c.x, y: top + valueH / 2, fill: ink, fontSize: fi.valueSize, fontWeight: fi.weight, fontFamily: t.displayFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        fi.lines.forEach((line, li) => children.push({ type: "text", silent: true, style: { text: line, x: c.x, y: top + valueH + 2 + (li + 0.5) * fi.nameSize * 1.25, fill: ink, fontSize: fi.nameSize, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 0.92, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear }));
      }
      const out = outs[i];
      if (out) {
        children.push({
          type: "text",
          silent: true,
          style: {
            text: out.align === "right" ? `{v|${out.value}}{g|}{n|${out.name}}` : `{n|${out.name}}{g|}{v|${out.value}}`,
            x: out.x,
            y: out.y,
            align: out.align,
            verticalAlign: "middle",
            rich: { n: { fill: ctx.selected(d.key) ? t.ink : t.muted, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily }, g: { width: 6 }, v: { fill: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily } },
            opacity: 1,
            enterFrom: { opacity: 0 },
          },
          blur: fade,
          enterAnimation: appear,
        });
      }
      const entry = keyAt.get(i);
      if (entry) {
        const strong = ctx.selected(d.key);
        if (entry.num != null) children.push({ type: "text", silent: true, style: { text: String(entry.num), x: c.x, y: c.y + 0.5, fill: ink, fontSize: Math.min(11, Math.max(9, c.r * 0.9)), fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        // The key line belongs to the circle's group, so hovering either one lights both.
        const tail = `${entry.pos} · ${entry.size}`;
        const name = truncateText(entry.name, key.colW - 36 - measureText(tail, 11.5, t.fontFamily), 11.5, t.fontFamily, 600);
        children.push({ type: "rect", shape: { x: entry.x, y: entry.y - KEY_LH / 2, width: key.colW, height: KEY_LH }, style: { fill: t.surface, opacity: 0 } });
        children.push({ type: "circle", silent: true, shape: { cx: entry.x + 5, cy: entry.y, r: entry.num != null ? 7 : 4 }, style: { fill }, blur: fade });
        if (entry.num != null) children.push({ type: "text", silent: true, style: { text: String(entry.num), x: entry.x + 5, y: entry.y + 0.5, fill: ink, fontSize: 9, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" }, blur: fade });
        children.push({
          type: "text",
          silent: true,
          style: {
            text: `{n|${name}}{g|}{v|${tail}}`,
            x: entry.x + 18,
            y: entry.y + 0.5,
            verticalAlign: "middle",
            rich: { n: { fill: strong ? t.ink : t.muted, fontSize: 11.5, fontWeight: 600, fontFamily: t.fontFamily }, g: { width: 6 }, v: { fill: t.inkSecondary, fontSize: 11.5, fontFamily: t.fontFamily } },
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
      ticks.forEach((v, i) => {
        const a = posOf(v);
        const bx = vertical ? 0 : Math.max(0, Math.min(W - tickW, a - tickW / 2));
        const by = vertical ? a - tickH / 2 : H - strip + 8;
        if (p.guides !== false) children.push({ type: "line", shape: vertical ? { x1: tickW + 4, y1: a, x2: W - 2, y2: a } : { x1: a, y1: 2, x2: a, y2: H - strip + 6 }, style: { stroke: t.axis, lineWidth: 1, lineDash: [1, 4], lineCap: "round" } });
        children.push({ type: "rect", shape: { x: bx + 0.5, y: by + 0.5, width: tickW - 1, height: tickH - 1, r: 3 }, style: { fill: t.surface, stroke: t.axis, lineWidth: 1 } });
        children.push({ type: "text", style: { text: tickTexts[i], x: bx + tickW / 2, y: by + tickH / 2 + 0.5, fill: t.inkSecondary, fontSize: 11, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      });
      if (p.scaleLabel) children.push({ type: "text", style: { text: p.scaleLabel.toLocaleUpperCase(ctx.locale), x: 0, y: vertical ? 7 : H - 7, fill: t.muted, fontSize: 10.5, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "middle" } });
      return { type: "group", silent: true, children };
    };

    const byValue = [...nodes].sort((a, b) => b.value - a.value);
    const bySize = [...nodes].sort((a, b) => b.size - a.size);
    const legend: LegendItem[] = coloured ? keys.slice(0, MAX_HUES).map((k, i) => ({ name: p.names?.[k] ?? k, color: ctx.color(k, i), shape: "dot" as const, muted: anyHighlight && ctx.dimmed(k) })) : [];

    return {
      legend,
      alt: n
        ? `Bubble scale: ${n} circles placed along a ${vertical ? "vertical" : "horizontal"} scale of ${p.value} from ${ctx.fmt(lo)} to ${ctx.fmt(hi)}, with area showing ${p.size}. Highest on the scale: ${byValue[0].key} at ${ctx.fmt(byValue[0].value)}; lowest: ${byValue[n - 1].key} at ${ctx.fmt(byValue[n - 1].value)}. Largest: ${bySize.slice(0, 3).map((d) => `${d.key} (${fmtSize(d.size)}, at ${ctx.fmt(d.value)})`).join(", ")}.`
        : `Bubble scale of ${p.value} and ${p.size}: no rows to draw.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const node = nodes[d.dataIndex];
            if (!node || d.seriesId !== "bubbles") return "";
            return tooltipHtml(ctx, node.key, [...(coloured ? [{ name: p.series!, value: p.names?.[node.series] ?? node.series }] : []), { name: p.value, value: ctx.fmt(node.value), color: fillOf(node) }, { name: p.size, value: fmtSize(node.size) }]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, z: 1, tooltip: { show: false }, renderItem: renderDeco as any, data: [0] },
          {
            id: "bubbles",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            dimensions: ["value", "size"],
            encode: { tooltip: [0, 1] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: nodes.map((d) => ({ id: d.key, name: d.key, value: [d.value, d.size] })),
          },
        ],
      },
    };
  },
});

// Illustrative: invented neighbourhoods.
const districts = [
  ["Harbourside", "Inner", 71, 18], ["Old Town", "Inner", 64, 31], ["Canal Quarter", "Inner", 58, 22], ["Station Fields", "Inner", 49, 12], ["Marketgate", "Inner", 44, 27],
  ["Northmoor", "Outer", 37, 46], ["Eastcliff", "Outer", 33, 39], ["Larkhill", "Outer", 29, 52], ["Westbrook", "Outer", 26, 34], ["Fenside", "Outer", 22, 61], ["Quarry Hill", "Outer", 19, 28],
  ["Ashby Green", "Suburb", 14, 44], ["Thornley", "Suburb", 12, 57], ["Upper Wold", "Suburb", 9, 36], ["Millbank", "Suburb", 8, 49], ["St Agnes", "Suburb", 6, 23], ["Coldharbour", "Suburb", 5, 15],
].map(([district, ring, carFree, thousand]) => ({ district, ring, carFree, thousand }));

export const examples = {
  "Colour by series, horizontal": {
    data: districts,
    name: "district",
    value: "carFree",
    size: "thousand",
    series: "ring",
    orientation: "horizontal",
    format: "{value}%",
    sizeFormat: "{value}k",
    scaleLabel: "Households without a car",
    title: "71% of Harbourside households have no car",
    subtitle: "Share of households without a car (position) and population in thousands (area), 17 districts",
    note: "Illustrative figures for an invented city",
  },
  "Highlight one circle, click to select": {
    data: districts,
    name: "district",
    value: "carFree",
    size: "thousand",
    highlight: "Fenside",
    select: true,
    format: "{value}%",
    sizeFormat: "{value}k",
    scaleLabel: "Without a car",
    title: "22% of Fenside's households have no car",
    subtitle: "Share of households without a car (position) and population in thousands (area), 17 districts",
    note: "Illustrative figures for an invented city",
  },
  "Stress: 40 circles crowded at one end, sizes from 1 to 900": {
    data: Array.from({ length: 40 }, (_, i) => ({
      fund: `Fund ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? "2" : ""}`,
      fee: Math.round((0.05 + ((i * 37) % 23) * 0.012 + (i % 9 === 0 ? 1.1 : 0) + (i % 13 === 5 ? 0.6 : 0)) * 100) / 100,
      bn: [900, 410, 220, 130, 75, 48, 30, 18, 9, 4, 2, 1][i % 12] + (i % 5) * 3,
    })),
    name: "fund",
    value: "fee",
    size: "bn",
    format: "{value}%",
    sizeFormat: "${value}bn",
    scaleLabel: "Annual fee",
    title: "40 funds charge between 0.05% and 2.01% a year",
    subtitle: "Annual fee (position) and assets in $ billion (area), 40 index and active funds",
    note: "Illustrative figures for invented funds",
  },
};
