import { CustomChart } from "echarts/charts";
import { inkOn, mix, ramp } from "../core/color";
import { defineChart } from "../core/define";
import { makeFormatter } from "../core/format";
import { resolveIcon } from "../core/icons";
import { measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface RadialSpokesProps {
  /** Name field: one spoke per row, in data order, clockwise. */
  name: string;
  /** Value field: spoke length from the centre disc. */
  value: string;
  /** `"bar"` draws a thick tapered bar with a round head, `"line"` a thin line ending in a dot. Default `"bar"`. */
  shape?: "bar" | "line";
  /** Icon in the centre disc: a built-in name or `path://`. */
  icon?: string;
  /** Short text in the centre disc, used when there is no `icon`. */
  centerLabel?: string;
  /** Dotted outer ring at the scale maximum, where the labels sit. Default true. */
  ring?: boolean;
  /** Value that reaches the outer ring. Default: the largest value. */
  max?: number;
  /** Angle of the first spoke in degrees clockwise from 12 o'clock. Default 0. */
  startAngle?: number;
  /** Arc the spokes are spread over, in degrees. Default 360; 180 makes a fan. */
  sweep?: number;
  /** `"single"` uses the accent for every spoke, `"value"` shades by value along the sequential ramp. Default `"single"`. */
  colorBy?: "single" | "value";
}

type _Box = { x: number; y: number; w: number; h: number };
type _Spoke = { key: string; value: number };
type _SpokeLabel = { lines: string[]; w: number; h: number; ax: -1 | 0 | 1; ay: -1 | 0 | 1; cut: boolean };

const _spokeRows = (p: RadialSpokesProps, data: Record<string, unknown>[]): _Spoke[] => {
  const rows: _Spoke[] = [];
  for (const r of data) {
    const v = toNumber(r[p.value]);
    if (!Number.isNaN(v) && v >= 0) rows.push({ key: String(r[p.name] ?? ""), value: v });
  }
  return rows;
};

/**
 * Geometry shared by the `height` hook and `build`. At 480px and wider the labels sit round
 * the ring. Narrower, they stay there only if every name fits uncut and the ring keeps a
 * useful size; otherwise the ring carries a number per spoke and the names and values are
 * listed under the graphic. `H` undefined asks for the natural height.
 */
function _spokesLayout(p: RadialSpokesProps, rows: _Spoke[], texts: string[], W: number, H: number | undefined, env: { font: string; display: string; upper: (s: string) => string }) {
  const n = rows.length;
  const compact = W < 480;
  const sweep = Math.max(30, Math.min(360, p.sweep ?? 360));
  const full = sweep >= 359.5;
  const start = ((p.startAngle ?? (full ? 0 : -sweep / 2)) * Math.PI) / 180;
  // Clockwise from 12 o'clock; a partial sweep puts a spoke on each end.
  const angles = rows.map((_, i) => start + ((full ? i / Math.max(1, n) : n > 1 ? i / (n - 1) : 0.5) * sweep * Math.PI) / 180);
  const dir = (a: number) => ({ x: Math.sin(a), y: -Math.cos(a) });
  const centre = !!(p.icon || p.centerLabel);
  const valueSize = compact ? 16 : 20;
  const nameSize = 11;
  const nameLH = 14;
  let gap = 10;
  const anchor = (a: number) => {
    const d = dir(a);
    return { ax: (d.x > 0.2 ? 1 : d.x < -0.2 ? -1 : 0) as -1 | 0 | 1, ay: (d.y > 0.85 ? 1 : d.y < -0.85 ? -1 : 0) as -1 | 0 | 1 };
  };
  // Label blocks: the value over the name, anchored just outside the ring.
  const labelsFor = (maxW: number): _SpokeLabel[] =>
    rows.map((r, i) => {
      const wrapped = wrapText(env.upper(r.key), maxW, nameSize, env.font, 700);
      let cut = wrapped.length > 2;
      const lines = wrapped.slice(0, 2).map((s, li) => {
        const out = truncateText(li === 1 && wrapped.length > 2 ? `${s}…` : s, maxW, nameSize, env.font, 700);
        if (out !== s) cut = true;
        return out;
      });
      const w = Math.max(measureText(texts[i], valueSize, env.display, 600), ...lines.map((s) => measureText(s, nameSize, env.font, 700)));
      return { lines, w, h: valueSize * 1.15 + lines.length * nameLH, ...anchor(angles[i]), cut };
    });
  const boxAt = (l: _SpokeLabel, a: number, R: number): _Box => {
    const d = dir(a);
    const px = d.x * (R + gap);
    const py = d.y * (R + gap);
    return { x: l.ax > 0 ? px : l.ax < 0 ? px - l.w : px - l.w / 2, y: l.ay > 0 ? py : l.ay < 0 ? py - l.h : py - l.h / 2, w: l.w, h: l.h };
  };
  // The largest ring whose labels all stay inside the frame, measured from the centre.
  const extentAt = (ls: _SpokeLabel[], R: number) => {
    let x0 = -R;
    let x1 = R;
    let y0 = full ? -R : 0;
    let y1 = full ? R : 0;
    ls.forEach((l, i) => {
      const b = boxAt(l, angles[i], R);
      const d = dir(angles[i]);
      x0 = Math.min(x0, b.x, d.x * R);
      x1 = Math.max(x1, b.x + b.w, d.x * R);
      y0 = Math.min(y0, b.y, d.y * R);
      y1 = Math.max(y1, b.y + b.h, d.y * R);
    });
    return { x0, x1, y0, y1 };
  };
  // A fan needs room below its centre for the disc.
  const discRoomAt = (R: number, y1: number) => (full ? 0 : Math.max(0, (centre ? Math.max(20, Math.min(54, R * 0.2)) : Math.max(6, Math.min(12, R * 0.07))) + 6 - y1));
  const solve = (ls: _SpokeLabel[], h: number, cap: number) => {
    const fits = (R: number) => {
      const e = extentAt(ls, R);
      return e.x1 - e.x0 <= W - 4 && e.y1 - e.y0 + discRoomAt(R, e.y1) <= h - 4;
    };
    let lo = 20;
    let hi = Math.min(cap, Math.max(W, Number.isFinite(h) ? h : 0));
    if (hi <= lo) return lo;
    if (fits(hi)) return hi;
    for (let k = 0; k < 24; k++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    return lo;
  };
  const ringFit = (h: number, cap: number) => {
    let labelW = compact ? 74 : 124;
    let labels = labelsFor(labelW);
    let R = solve(labels, h, cap);
    for (let attempt = 0; attempt < 4; attempt++) {
      const boxes = labels.map((l, i) => boxAt(l, angles[i], R));
      const clash = boxes.some((a, i) => boxes.some((b, j) => j > i && a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 2 && b.y < a.y + a.h + 2));
      if (!clash) break;
      labelW *= 0.82;
      labels = labelsFor(labelW);
      R = solve(labels, h, cap);
    }
    return { labels, R };
  };
  const heightOf = (ls: _SpokeLabel[], R: number) => {
    const e = extentAt(ls, R);
    return Math.ceil(e.y1 - e.y0 + discRoomAt(R, e.y1) + 8);
  };

  let labels: _SpokeLabel[];
  let R: number;
  let natural: number;
  let list: { x: number; top: number; cols: number; rows: number; colW: number; rowH: number; numW: number; valueW: number; names: string[] } | null = null;
  let listSpace = 0;
  if (!compact) {
    natural = full ? 480 : 340;
    ({ labels, R } = ringFit(H ?? natural, Infinity));
  } else {
    const free = ringFit(Infinity, 170);
    if (!free.labels.some((l) => l.cut) && free.R >= 0.27 * W) {
      natural = heightOf(free.labels, free.R);
      ({ labels, R } = H == null || H >= natural ? free : ringFit(H, 170));
    } else {
      // Numbers on the ring, names and values in a list underneath.
      gap = 7;
      labels = rows.map((_, i) => ({ lines: [], w: measureText(String(i + 1), 11, env.font, 700), h: 13, ...anchor(angles[i]), cut: false }));
      const valueW = Math.max(0, ...texts.map((s) => measureText(s, 14, env.display, 600)));
      const numW = Math.max(0, ...labels.map((l) => l.w)) + 8;
      const nameW = Math.max(0, ...rows.map((r) => measureText(env.upper(r.key), 11, env.font, 700)));
      const colGap = 22;
      const twoW = (W - colGap) / 2;
      const cols = n >= 4 && numW + nameW + 10 + valueW <= twoW ? 2 : 1;
      const colW = cols === 2 ? twoW : Math.min(W, Math.max(200, numW + nameW + 24 + valueW));
      const rowH = 24;
      const listRows = Math.ceil(n / cols);
      listSpace = listRows * rowH + 14;
      R = solve(labels, (H ?? Infinity) - listSpace, Math.min(160, W / 2 - 24));
      natural = heightOf(labels, R) + listSpace;
      const maxName = colW - numW - 10 - valueW;
      list = { x: cols === 2 ? 0 : (W - colW) / 2, top: 0, cols, rows: listRows, colW, rowH, numW, valueW, names: rows.map((r) => truncateText(env.upper(r.key), maxName, 11, env.font, 700)) };
    }
  }
  const height = H ?? natural;
  const ext = extentAt(labels, R);
  const r0 = centre ? Math.max(20, Math.min(54, R * 0.2)) : Math.max(6, Math.min(12, R * 0.07));
  const discRoom = full ? 0 : Math.max(0, r0 + 6 - ext.y1);
  // Extra height is shared round the whole block, list included.
  const blockH = ext.y1 - ext.y0 + discRoom + listSpace;
  const top = Math.max(2, (height - blockH) / 2);
  const cx = W / 2 - (ext.x0 + ext.x1) / 2;
  const cy = top - ext.y0;
  if (list) list.top = top + ext.y1 - ext.y0 + discRoom + 14;
  return { n, full, sweep, start, angles, dir, valueSize, nameLH, labels, R, r0, cx, cy, natural, list, boxAt, colGap: 22 };
}

/**
 * Spokes round one subject. Length is measured from the edge of the centre disc, so a
 * value of zero is a spoke of no length; every label sits on the outer ring, joined to
 * its spoke by a dotted line, so short spokes are as easy to read as long ones.
 */
export const RadialSpokes = defineChart<RadialSpokesProps>({
  name: "radial-spokes",
  title: "Radial spokes",
  category: "poster",
  description: "Draws one spoke per row radiating from a centre disc, each as long as its value, with the name and value set on an outer ring.",
  whenToUse: "A poster of 4 to 12 effects, causes or attributes of one subject, which sits in the centre as an icon or a short label: what a household's energy goes on, the side effects of one drug, the scores of one product.",
  avoid: "Precise comparison or a ranking (use bar-chart or pill-rank); a dimension that is a cycle, such as hours or months (use radial-bar-chart); more than 12 rows (use bar-chart); several subjects compared on the same attributes (use small-multiples or heatmap).",
  use: [CustomChart],
  defaults: { shape: "bar", ring: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "spokes" ? params.name : null),
  height: (p, data, width) => {
    const full = (p.sweep ?? 360) >= 359.5;
    if (!width || width >= 480) return full ? 480 : 340;
    const rows = _spokeRows(p, data);
    const fmt = makeFormatter(p.format);
    return _spokesLayout(p, rows, rows.map((r) => fmt(r.value)), width, undefined, { font: "sans-serif", display: "sans-serif", upper: (s) => s.toLocaleUpperCase() }).natural;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one spoke per row, in data order, clockwise." },
    { name: "value", type: "string", required: true, description: "Value field: spoke length from the centre disc." },
    { name: "shape", type: '"bar" | "line"', default: '"bar"', description: "A thick tapered bar with a round head, or a thin line ending in a dot." },
    { name: "icon", type: "string", description: "Icon in the centre disc: a built-in name or `path://`." },
    { name: "centerLabel", type: "string", description: "Short text in the centre disc, used when there is no `icon`." },
    { name: "ring", type: "boolean", default: "true", description: "Dotted outer ring at the scale maximum, where the labels sit." },
    { name: "max", type: "number", description: "Value that reaches the outer ring. Default: the largest value." },
    { name: "startAngle", type: "number", default: "0", description: "Angle of the first spoke in degrees clockwise from 12 o'clock." },
    { name: "sweep", type: "number", default: "360", description: "Arc the spokes are spread over, in degrees. 180 makes a fan." },
    { name: "colorBy", type: '"single" | "value"', default: '"single"', description: "The accent for every spoke, or a shade by value along the sequential ramp." },
  ],
  example: {
    type: "radial-spokes",
    data: [
      { use: "Space heating", share: 42 },
      { use: "Hot water", share: 17 },
      { use: "Cooking", share: 6 },
      { use: "Fridge and freezer", share: 8 },
      { use: "Laundry", share: 7 },
      { use: "Lighting", share: 5 },
      { use: "Screens and computers", share: 9 },
      { use: "Everything else", share: 6 },
    ],
    name: "use",
    value: "share",
    format: "{value}%",
    icon: "house",
    highlight: "Space heating",
    title: "Space heating uses 42% of a home's energy",
    subtitle: "Share of household energy by end use, a typical home in a cool climate",
    note: "Illustrative figures",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const W = ctx.width;
    type Row = _Spoke;
    const rows = _spokeRows(p, ctx.rows);
    const max = Math.max(p.max ?? 0, ...rows.map((r) => r.value), 0) || 1;
    const upper = (s: string) => s.toLocaleUpperCase(ctx.locale);
    const texts = rows.map((r) => ctx.fmt(r.value));
    const nameSize = 11;
    const { n, full, sweep, start, angles, dir, valueSize, nameLH, labels, R, r0, cx, cy, list, boxAt, colGap } = _spokesLayout(p, rows, texts, W, ctx.height, { font: t.fontFamily, display: t.displayFamily, upper });

    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (r: Row) => (anyHighlight || p.colorBy !== "value" ? ctx.color(r.key) : ramp(t.sequential, 0.2 + 0.8 * (r.value / max)));
    const fillOf = (r: Row) => (ctx.selected(r.key) ? baseOf(r) : mix(t.surface, baseOf(r), 0.3));
    const inner = r0 + 7;
    const L = Math.max(10, R - inner - 6);
    const step = ((full ? sweep / Math.max(1, n) : sweep / Math.max(1, n - 1)) * Math.PI) / 180;
    // Head half-width: bold, but never wider than the gap to the next spoke allows.
    const head = p.shape === "line" ? 4.5 : Math.max(4, Math.min(13, (inner + L * 0.5) * Math.tan(Math.min(step, Math.PI / 2) / 2) * 0.7, L * 0.16));
    const tail = p.shape === "line" ? 1 : Math.max(1.5, head * 0.28);

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const r = rows[i];
      if (!r) return null;
      const a = angles[i];
      const d = dir(a);
      const nx = -d.y;
      const ny = d.x;
      const fill = fillOf(r);
      const len = (L * r.value) / max;
      const tip = inner + len;
      const at = (rad: number, off = 0) => [cx + d.x * rad + nx * off, cy + d.y * rad + ny * off];
      const delay = Math.min(500, i * 55);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 300 };
      const lit = anyHighlight && !ctx.dimmed(r.key);
      const strong = ctx.selected(r.key);
      const children: any[] = [];
      // Dotted line from the head of the spoke out to its label on the ring.
      if (R - tip > 6) children.push({ type: "line", silent: true, shape: { x1: at(tip + (p.shape === "line" ? head : 0) + 3)[0], y1: at(tip + (p.shape === "line" ? head : 0) + 3)[1], x2: at(R)[0], y2: at(R)[1] }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      children.push({ type: "circle", silent: true, shape: { cx: at(R)[0], cy: at(R)[1], r: 2 }, style: { fill: strong ? t.inkSecondary : t.muted }, blur: fade });
      const grow = { duration: 560, delay, easing: "cubicOut" };
      const origin = { originX: cx, originY: cy, scaleX: 1, scaleY: 1 };
      const emph = { style: { fill: mix(fill, inkOn(fill), 0.12) } };
      // A bar shorter than about three head-widths would be a blob: draw it as a thin line with a dot, at its true length.
      const thin = p.shape === "line" || len < head * 3;
      if (thin) {
        const dot = p.shape === "line" ? head : Math.min(3.5, len / 2);
        const dotAt = p.shape === "line" ? tip : tip - dot;
        if (len > 0) children.push({ type: "line", shape: { x1: at(inner)[0], y1: at(inner)[1], x2: at(dotAt)[0], y2: at(dotAt)[1], percent: 1, enterFrom: { percent: 0 } }, style: { stroke: fill, lineWidth: 2.5, lineCap: p.shape === "line" ? "round" : "butt" }, blur: fade, transition: ["shape", "style"], enterAnimation: grow });
        if (len > 0 || p.shape === "line") children.push({ type: "circle", shape: { cx: at(dotAt)[0], cy: at(dotAt)[1], r: dot, enterFrom: { r: 0 } }, style: p.shape === "line" ? { fill, stroke: t.surface, lineWidth: 1.5 } : { fill }, emphasis: emph, blur: fade, transition: ["shape", "style"], enterAnimation: { ...grow, delay: delay + 300 } });
        // A wider invisible target so a short spoke can still be hovered and clicked.
        children.push({ type: "line", shape: { x1: at(inner)[0], y1: at(inner)[1], x2: at(Math.max(tip, inner + 10))[0], y2: at(Math.max(tip, inner + 10))[1] }, style: { stroke: fill, lineWidth: 12, opacity: 0 }, blur: { style: { opacity: 0 } } });
      } else {
        // The round head is part of the length: the far edge of the head marks the value.
        const hw = Math.min(head, len / 2);
        const centreR = tip - hw;
        const tw = Math.min(tail, hw);
        const points = [at(inner, -tw), at(centreR, -hw), at(centreR, hw), at(inner, tw)];
        children.push({ type: "polygon", shape: { points }, style: { fill }, emphasis: emph, blur: fade, transition: ["shape", "style"], ...origin, enterFrom: { scaleX: 0.05, scaleY: 0.05 }, enterAnimation: grow });
        children.push({ type: "circle", shape: { cx: at(centreR)[0], cy: at(centreR)[1], r: hw }, style: { fill }, emphasis: emph, blur: fade, transition: ["shape", "style"], ...origin, enterFrom: { scaleX: 0.05, scaleY: 0.05 }, enterAnimation: grow });
      }
      const l = labels[i];
      const b = boxAt(l, a, R);
      const tx = l.ax > 0 ? b.x : l.ax < 0 ? b.x + b.w : b.x + b.w / 2;
      const align = l.ax > 0 ? "left" : l.ax < 0 ? "right" : "center";
      const nameFill = strong ? (lit || !anyHighlight ? t.ink : t.inkSecondary) : t.muted;
      if (list) {
        const num = String(i + 1);
        children.push({ type: "text", silent: true, style: { text: num, x: cx + tx, y: cy + b.y + b.h / 2, fill: strong ? t.inkSecondary : t.muted, fontSize: 11, fontWeight: 700, fontFamily: t.fontFamily, align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        const lx = list.x + Math.floor(i / list.rows) * (list.colW + colGap);
        const ly = list.top + (i % list.rows) * list.rowH + list.rowH / 2;
        const row = { fontFamily: t.fontFamily, verticalAlign: "middle" as const, opacity: 1, enterFrom: { opacity: 0 } };
        children.push({ type: "text", silent: true, style: { ...row, text: num, x: lx, y: ly, fill: t.muted, fontSize: 11, fontWeight: 700 }, blur: fade, enterAnimation: appear });
        children.push({ type: "text", silent: true, style: { ...row, text: list.names[i], x: lx + list.numW, y: ly, fill: nameFill, fontSize: nameSize, fontWeight: 700 }, blur: fade, enterAnimation: appear });
        children.push({ type: "text", silent: true, style: { ...row, text: texts[i], x: lx + list.colW, y: ly, align: "right", fill: strong ? t.ink : t.muted, fontSize: 14, fontWeight: lit ? 700 : 600, fontFamily: t.displayFamily }, blur: fade, enterAnimation: appear });
      } else {
        children.push({ type: "text", silent: true, style: { text: texts[i], x: cx + tx, y: cy + b.y + valueSize * 0.575, fill: strong ? t.ink : t.muted, fontSize: valueSize, fontWeight: lit ? 700 : 400, fontFamily: t.displayFamily, align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        l.lines.forEach((line, li) => children.push({ type: "text", silent: true, style: { text: line, x: cx + tx, y: cy + b.y + valueSize * 1.15 + (li + 0.5) * nameLH, fill: strong ? (lit ? t.ink : t.inkSecondary) : t.muted, fontSize: nameSize, fontWeight: 700, fontFamily: t.fontFamily, align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear }));
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const renderDeco = () => {
      const children: any[] = [];
      if (p.ring !== false) {
        const a0 = full ? 0 : start - Math.PI / 2;
        children.push({ type: "arc", shape: { cx, cy, r: R, startAngle: a0, endAngle: full ? Math.PI * 2 : a0 + (sweep * Math.PI) / 180 }, style: { stroke: t.axis, lineWidth: 1, lineDash: [1, 4], lineCap: "round", fill: "none" } });
      }
      const disc = t.ink;
      children.push({ type: "circle", shape: { cx, cy, r: r0 + 3.5 }, style: { stroke: t.axis, lineWidth: 1, fill: "none" } });
      children.push({ type: "circle", shape: { cx, cy, r: r0 }, style: { fill: disc } });
      if (p.icon) {
        const icon = resolveIcon(p.icon);
        // ECharts lays a custom path out once and does not redo it when x/y/width/height change, so the shape stays a fixed 100px box and the transform places it.
        const s = (r0 * 1.05) / 100;
        children.push({ type: "path", shape: { pathData: icon.d, x: -50, y: -50, width: 100, height: 100, layout: "center" }, x: cx, y: cy, scaleX: s, scaleY: s, style: { fill: t.surface } });
      } else if (p.centerLabel) {
        const size = Math.max(9, Math.min(12, r0 / 3.4));
        const lines = wrapText(upper(p.centerLabel), r0 * 1.6, size, t.fontFamily, 700).slice(0, 3);
        lines.forEach((line, li) => children.push({ type: "text", style: { text: truncateText(line, r0 * 1.75, size, t.fontFamily, 700), x: cx, y: cy + (li - (lines.length - 1) / 2) * size * 1.25, fill: t.surface, fontSize: size, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } }));
      }
      return { type: "group", silent: true, children };
    };

    const sorted = [...rows].sort((a, b) => b.value - a.value);
    return {
      alt: n
        ? `Radial spokes: ${n} spokes round ${p.centerLabel ? `"${p.centerLabel}"` : "a centre disc"}, each as long as its ${p.value}, clockwise from ${rows[0].key}. Longest: ${sorted.slice(0, 3).map((r) => `${r.key} ${ctx.fmt(r.value)}`).join(", ")}. Shortest: ${sorted[n - 1].key} ${ctx.fmt(sorted[n - 1].value)}.`
        : `Radial spokes of ${p.value}: no values.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const r = rows[d.dataIndex];
            if (!r || d.seriesId !== "spokes") return "";
            return tooltipHtml(ctx, r.key, [{ name: p.value, value: ctx.fmt(r.value), color: fillOf(r) }, { name: "Of the longest", value: ctx.formatter({ style: "percent", maximumFractionDigits: 0 })(r.value / max) }]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "spokes",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: rows.map((r) => ({ id: r.key, name: r.key, value: [r.value] })),
          },
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, z: 3, tooltip: { show: false }, renderItem: renderDeco as any, data: [0] },
        ],
      },
    };
  },
});

export const examples = {
  "Thin lines, centre label, click to select": {
    data: [
      ["Battery life", 8.6], ["Camera", 7.1], ["Screen", 9.0], ["Speed", 6.4], ["Build", 7.8], ["Value", 5.2],
    ].map(([aspect, score]) => ({ aspect, score })),
    name: "aspect",
    value: "score",
    shape: "line",
    max: 10,
    format: { minimumFractionDigits: 1 },
    centerLabel: "Model K phone",
    select: true,
    title: "Reviewers scored the Model K's screen 9.0 out of 10",
    subtitle: "Average review score by aspect, out of 10. The ring marks 10.",
    note: "Illustrative scores for an invented phone",
  },
  "Fan over 180 degrees, shaded by value": {
    data: [
      ["Drowsiness", 31], ["Dry mouth", 22], ["Headache", 14], ["Nausea", 9], ["Dizziness", 6], ["Rash", 2],
    ].map(([effect, pct]) => ({ effect, pct })),
    name: "effect",
    value: "pct",
    format: "{value}%",
    sweep: 180,
    colorBy: "value",
    icon: "drop",
    title: "31% of trial patients reported drowsiness",
    subtitle: "Share of 840 patients reporting each side effect in a 12-week trial",
    note: "Illustrative figures for an invented medicine",
  },
  "Stress: 12 spokes, long labels, values from 0 to 96": {
    data: [
      ["Unplanned maintenance and emergency call-outs", 96], ["Fuel", 71], ["Crew wages and overtime", 88], ["Port fees", 34], ["Insurance", 27], ["Training", 0],
      ["Catering", 12], ["Navigation and satellite communications", 19], ["Cleaning", 5], ["Dry-dock inspection", 41], ["Waste disposal", 3], ["Ticketing", 8],
    ].map(([cost, k]) => ({ cost, k })),
    name: "cost",
    value: "k",
    format: "£{value}k",
    centerLabel: "One ferry",
    highlight: ["Unplanned maintenance and emergency call-outs"],
    height: 560,
    title: "Unplanned maintenance cost £96,000 per ferry in 2024",
    subtitle: "Annual running cost of one ferry by item, £ thousand, 2024",
    note: "Illustrative figures for an invented operator",
  },
};
