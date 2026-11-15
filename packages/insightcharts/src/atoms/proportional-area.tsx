import { CustomChart } from "echarts/charts";
import { alpha, inkOn, mix } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { makeFormatter, type Formatter } from "../core/format";
import { dodge, measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";
import { _posterPalette } from "./_poster-colors";

export interface ProportionalAreaProps {
  /** Category field: one shape per row. */
  name: string;
  /** Value field. Each shape's area is proportional to it. */
  value: string;
  /** Squares or circles. */
  shape?: "square" | "circle";
  /** `"row"`: side by side on a common baseline. `"nested"`: drawn inside one another from a shared corner (squares) or a shared lowest point (circles). `"packed"`: clustered together. */
  layout?: "row" | "nested" | "packed";
  /** Print how many times the largest value is the smallest. `true` for "{largest} is {ratio} times {smallest}", or your own template with those placeholders. */
  ratio?: boolean | string;
  /** Order of the shapes. Nested and packed layouts always draw largest first. */
  sort?: "none" | "asc" | "desc";
}

// The `height` hook lays out with the measured plot width but has no theme, so it measures text
// in a generic face; `build` lays out again with the theme's faces and scales the drawing down
// in the rare case where that comes out taller. Before the first layout the width is unknown.
type Seen = { font: string; display: string };
const HOOK_FONTS: Seen = { font: "sans-serif", display: "sans-serif" };
const hookWidth = (width?: number) => width ?? (typeof window === "undefined" ? 720 : Math.max(280, Math.min(window.innerWidth - 48, 812)));

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const NAME = 12.5;
const NAME_LH = 16;
const MAX_ITEMS = 8;

interface Item {
  key: string;
  value: number;
  valueText: string;
}

/** A label that fits a box: the value as large as it goes, the name on up to two lines under it. */
interface Fit {
  size: number;
  lines: string[];
  /** Value and name share one line (thin bands in the nested layout). */
  inline?: boolean;
  width: number;
  height: number;
}

function fitLabel(it: Item, w: number, h: number, fonts: Seen, max: number, allowInline = false): Fit | null {
  for (let size = Math.round(Math.max(15, max)); size >= 15; size -= size > 30 ? 3 : 1) {
    const vw = measureText(it.valueText, size, fonts.display, 300);
    if (vw > w) continue;
    const lines = wrapText(it.key, w, NAME, fonts.font, 600);
    const fits = lines.length <= 2 && lines.every((l) => measureText(l, NAME, fonts.font, 600) <= w);
    const names = fits ? lines : [truncateText(it.key, w, NAME, fonts.font, 600)];
    if (!fits && names[0].replace("…", "").length < 5) continue;
    const height = size * 1.08 + names.length * NAME_LH;
    if (height > h) continue;
    return { size, lines: names, width: Math.max(vw, ...names.map((l) => measureText(l, NAME, fonts.font, 600))), height };
  }
  if (allowInline && h >= 20) {
    const vw = measureText(it.valueText, 15, fonts.display, 600);
    const nw = measureText(it.key, NAME, fonts.font, 600);
    if (vw + 8 + nw <= w) return { size: 15, lines: [it.key], inline: true, width: vw + 8 + nw, height: 20 };
  }
  return null;
}

interface Shape {
  /** Left and top of the bounding square, and its side (or the circle's diameter). */
  x: number;
  y: number;
  s: number;
  fit: Fit | null;
  /** Where the label is anchored when it is inside. */
  lx: number;
  ly: number;
  /** An outside label: its anchor and how it is set. */
  out?: { x: number; y: number; align: "left" | "center"; leader: number[][] };
}

interface Layout {
  shapes: Shape[];
  order: number[];
  height: number;
  /** Ratio note: a dotted bracket between two x positions, or a plain line of text. */
  note?: { text: string; y: number; from?: number; to?: number };
  unnamed: number[];
}

const OUT_VALUE = 20;
const OUT_H = OUT_VALUE * 1.1 + NAME_LH;

function ratioText(p: ProportionalAreaProps, items: Item[], locale?: string): string | undefined {
  if (!p.ratio || items.length < 2) return undefined;
  const hi = items.reduce((a, b) => (b.value > a.value ? b : a));
  const lo = items.reduce((a, b) => (b.value < a.value ? b : a));
  if (lo.value <= 0) return undefined;
  const r = hi.value / lo.value;
  const text = new Intl.NumberFormat(locale, { maximumFractionDigits: r >= 100 ? 0 : 1 }).format(r);
  const template = typeof p.ratio === "string" ? p.ratio : "{largest} is {ratio} times {smallest}";
  return template.replace("{ratio}", text).replace("{largest}", hi.key).replace("{smallest}", lo.key);
}

function prepare(p: ProportionalAreaProps, rows: Record<string, unknown>[], fmt: Formatter): Item[] {
  const items = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: Math.max(0, toNumber(r[p.value]) || 0) })).filter((r) => r.value > 0);
  const layout = p.layout ?? "row";
  if (p.sort === "desc" || layout !== "row") items.sort((a, b) => b.value - a.value);
  else if (p.sort === "asc") items.sort((a, b) => a.value - b.value);
  return items.slice(0, MAX_ITEMS).map((r) => ({ ...r, valueText: fmt(r.value) }));
}

function layoutArea(p: ProportionalAreaProps, items: Item[], width: number, fonts: Seen, locale?: string): Layout {
  const W = Math.max(160, width);
  const compact = W < 480;
  const circle = p.shape === "circle";
  const layout = p.layout ?? "row";
  const vmax = Math.max(1e-9, ...items.map((i) => i.value));
  const rel = items.map((i) => Math.sqrt(i.value / vmax));
  const note = ratioText(p, items, locale);
  const pad = (s: number) => Math.max(8, Math.min(18, s * 0.09));
  // The box a label may use inside a shape: a square minus its padding, or the square inscribed in a circle.
  const inside = (it: Item, s: number): Fit | null => (circle ? fitLabel(it, s * 0.74, s * 0.6, fonts, s * 0.24) : fitLabel(it, s - 2 * pad(s), s - 2 * pad(s), fonts, s * 0.24));
  const outW = (it: Item) => Math.max(measureText(it.valueText, OUT_VALUE, fonts.display, 300), Math.min(measureText(it.key, NAME, fonts.font, 600), 120)) + 2;
  const unnamed: number[] = [];
  const order = items.map((_, i) => i);

  if (layout === "nested") {
    const colMin = compact ? 112 : 170;
    const S = Math.round(Math.min(compact ? W - colMin - 24 : W * 0.48, 360));
    const sizes = rel.map((r) => r * S);
    const shapes: Shape[] = [];
    const outside: number[] = [];
    items.forEach((it, i) => {
      const s = sizes[i];
      const next = sizes[i + 1] ?? 0;
      const x = circle ? (S - s) / 2 : 0;
      const y = S - s;
      const band = s - next;
      let fit: Fit | null;
      let lx: number;
      let ly: number;
      if (circle) {
        // The cap between this circle's top and the next one's: the label must fit the chord at its outer line.
        const r = s / 2;
        fit = null;
        for (const tryInline of [false, true]) {
          const hBox = next ? band - 10 : s * 0.6;
          const probe = fitLabel(it, s, hBox, fonts, Math.min(band * 0.5, s * 0.2), tryInline);
          if (!probe || probe.inline !== (tryInline || undefined)) continue;
          const top = next ? y + (band - probe.height) / 2 : y + (s - probe.height) / 2;
          const far = Math.max(Math.abs(top - (y + r)), Math.abs(top + probe.height - (y + r)));
          const chord = far < r ? 2 * Math.sqrt(r * r - far * far) : 0;
          if (probe.width <= chord - 12) {
            fit = probe;
            break;
          }
        }
        lx = S / 2;
        ly = fit ? (next ? y + (band - fit.height) / 2 : y + (s - fit.height) / 2) : 0;
      } else {
        const pd = Math.max(7, Math.min(16, band * 0.18));
        fit = fitLabel(it, s - 2 * pd, next ? band - pd * 1.5 : s - 2 * pd, fonts, Math.min(band * 0.5, s * 0.2), true);
        lx = pd;
        ly = y + pd;
      }
      if (!fit) outside.push(i);
      shapes.push({ x, y, s, fit, lx, ly });
    });
    // Outside labels: a column to the right, each joined to the top of its shape by a leader.
    const colX = S + 34;
    const want = outside.map((i) => shapes[i].y + 2);
    const ys = dodge(want, OUT_H + 10, 0, Math.max(S - OUT_H, (outside.length - 1) * (OUT_H + 10)));
    outside.forEach((i, k) => {
      const sh = shapes[i];
      const startX = circle ? S / 2 : sh.s;
      const y0 = sh.y + (circle ? 0 : 0.5);
      const ly = ys[k] + OUT_H / 2;
      sh.out = { x: colX, y: ys[k], align: "left", leader: [[startX, y0], [S + 10, y0], [S + 22, ly], [colX - 6, ly]] };
    });
    let height = Math.max(S, outside.length ? ys[ys.length - 1] + OUT_H : 0) + 4;
    let noteOut: Layout["note"];
    if (note) {
      noteOut = { text: note, y: height + 22 };
      height += 40;
    }
    return { shapes, order, height: Math.ceil(height), note: noteOut, unnamed };
  }

  if (layout === "packed") {
    const gapU = 0.035;
    const maxH = compact ? W * 1.25 : Math.min(420, W * 0.52);
    const target = W / maxH;
    let pos: { x: number; y: number }[] = [];
    // Squares go on shelves: columns that stand on one baseline, the largest square at the foot
    // of each and smaller ones stacked on it while they fit under the shelf's first square.
    const shelves = (limit: number) => {
      const out: { x: number; y: number }[] = new Array(rel.length);
      const used = rel.map(() => false);
      let top = 0;
      let wide = 0;
      for (let next = 0; next < rel.length; ) {
        const H = rel[next];
        let x = 0;
        while (next < rel.length && (x === 0 || x + rel[next] <= limit + 1e-6)) {
          const w = rel[next];
          let stack = 0;
          for (let j = next; j < rel.length; j++) {
            if (used[j] || (stack > 0 && stack + gapU + rel[j] > H + 1e-6)) continue;
            if (stack > 0) stack += gapU;
            out[j] = { x, y: top + H - stack - rel[j] };
            stack += rel[j];
            used[j] = true;
          }
          x += w + gapU;
          while (next < rel.length && used[next]) next++;
        }
        wide = Math.max(wide, x - gapU);
        top += H + gapU;
      }
      return { pos: out, bw: wide, bh: top - gapU };
    };
    const score = (x: number, y: number, s: number) => {
      let x0 = x, y0 = y, x1 = x + s, y1 = y + s;
      pos.forEach((q, j) => {
        x0 = Math.min(x0, q.x);
        y0 = Math.min(y0, q.y);
        x1 = Math.max(x1, q.x + rel[j]);
        y1 = Math.max(y1, q.y + rel[j]);
      });
      return Math.max((x1 - x0) / target, y1 - y0) + 0.001 * Math.hypot(x + s / 2, y + s / 2);
    };
    const clear = (x: number, y: number, s: number) =>
      pos.every((q, j) => {
        const t = rel[j];
        if (circle) return Math.hypot(x + s / 2 - q.x - t / 2, y + s / 2 - q.y - t / 2) >= s / 2 + t / 2 + gapU - 1e-6;
        return x >= q.x + t + gapU - 1e-6 || q.x >= x + s + gapU - 1e-6 || y >= q.y + t + gapU - 1e-6 || q.y >= y + s + gapU - 1e-6;
      });
    if (!circle) {
      const total = rel.reduce((a, b) => a + b + gapU, 0);
      let bestK = -1;
      for (let step = 0; step <= 24; step++) {
        const trial = shelves(rel[0] + ((total - rel[0]) * step) / 24);
        const kk = Math.min(W / trial.bw, maxH / trial.bh, compact ? 240 : 320);
        // Among equal scales the wider arrangement wins: it uses the line.
        if (kk > bestK + 1e-6 || (Math.abs(kk - bestK) <= 1e-6 && trial.bw > 0)) {
          bestK = kk;
          pos = trial.pos;
        }
      }
    }
    rel.forEach((s, i) => {
      if (!circle) return;
      if (i === 0) return void pos.push({ x: -s / 2, y: -s / 2 });
      const cands: { x: number; y: number }[] = [];
      if (circle) {
        const r = s / 2 + gapU;
        if (pos.length === 1) cands.push({ x: pos[0].x + rel[0] + gapU, y: pos[0].y + rel[0] / 2 - s / 2 }, { x: pos[0].x + rel[0] / 2 - s / 2, y: pos[0].y + rel[0] + gapU });
        for (let a = 0; a < pos.length; a++)
          for (let b = a + 1; b < pos.length; b++) {
            // Centres at distance ra + r from a and rb + r from b: the two intersections of those circles.
            const ax = pos[a].x + rel[a] / 2, ay = pos[a].y + rel[a] / 2, bx = pos[b].x + rel[b] / 2, by = pos[b].y + rel[b] / 2;
            const da = rel[a] / 2 + r - gapU / 2 + gapU / 2, db = rel[b] / 2 + r;
            const d = Math.hypot(bx - ax, by - ay);
            if (d > da + db || d < Math.abs(da - db) || d === 0) continue;
            const k = (da * da - db * db + d * d) / (2 * d);
            const hgt = Math.sqrt(Math.max(0, da * da - k * k));
            const mx = ax + ((bx - ax) * k) / d, my = ay + ((by - ay) * k) / d;
            for (const sign of [1, -1]) cands.push({ x: mx + (sign * hgt * (by - ay)) / d - s / 2, y: my - (sign * hgt * (bx - ax)) / d - s / 2 });
          }
      } else {
        pos.forEach((q, j) => {
          const t = rel[j];
          for (const yy of [q.y, q.y + t - s]) cands.push({ x: q.x + t + gapU, y: yy }, { x: q.x - s - gapU, y: yy });
          for (const xx of [q.x, q.x + t - s]) cands.push({ x: xx, y: q.y + t + gapU }, { x: xx, y: q.y - s - gapU });
        });
      }
      let best = { x: pos[0].x + rel[0] + gapU + i, y: pos[0].y };
      let bestScore = Infinity;
      for (const c of cands) {
        if (!clear(c.x, c.y, s)) continue;
        const sc = score(c.x, c.y, s);
        if (sc < bestScore) {
          bestScore = sc;
          best = c;
        }
      }
      pos.push(best);
    });
    const x0 = Math.min(...pos.map((q) => q.x));
    const y0 = Math.min(...pos.map((q) => q.y));
    const bw = Math.max(...pos.map((q, j) => q.x + rel[j])) - x0;
    const bh = Math.max(...pos.map((q, j) => q.y + rel[j])) - y0;
    const k = Math.min(W / bw, maxH / bh, compact ? 240 : 320);
    const shapes: Shape[] = items.map((it, i) => {
      const s = rel[i] * k;
      const x = (pos[i].x - x0) * k;
      const y = (pos[i].y - y0) * k;
      let fit = inside(it, s);
      // No room for the name: print the value alone and name the shape in the legend.
      if (!fit) {
        const box = circle ? s * 0.8 : s - 10;
        const size = [20, 17, 15, 13, 12].find((z) => measureText(it.valueText, z, fonts.display, 400) <= box && z * 1.2 <= box);
        if (size) fit = { size, lines: [], width: 0, height: size * 1.1 };
        unnamed.push(i);
      }
      return { x, y, s, fit, lx: circle ? x + s / 2 : x + pad(s), ly: circle ? y + s / 2 - (fit?.height ?? 0) / 2 : y + pad(s) };
    });
    let height = bh * k + 4;
    let noteOut: Layout["note"];
    if (note) {
      noteOut = { text: note, y: height + 22 };
      height += 40;
    }
    return { shapes, order, height: Math.ceil(height), note: noteOut, unnamed };
  }

  // Row: every shape stands on one baseline. Use the largest size at which they all fit on
  // one line; when even small ones do not, wrap onto more lines.
  const gap = compact ? 14 : 22;
  const place = (smax: number) => {
    const fits = items.map((it, i) => inside(it, rel[i] * smax));
    const slots = items.map((it, i) => Math.max(rel[i] * smax, fits[i] ? 0 : outW(it)));
    const lines: number[][] = [[]];
    let x = 0;
    slots.forEach((w, i) => {
      if (x > 0 && x + w > W + 0.5) {
        lines.push([]);
        x = 0;
      }
      lines[lines.length - 1].push(i);
      x += w + gap;
    });
    return { fits, slots, lines };
  };
  const hi = Math.round(compact ? Math.min(W * 0.62, 230) : Math.min(300, W * 0.42));
  let smax = hi;
  let placed = place(smax);
  while (placed.lines.length > 1 && smax > (compact ? 150 : 110)) {
    smax -= 4;
    placed = place(smax);
  }
  if (placed.lines.length > 1 && compact) {
    // A narrow column needs more than one line. Take the size whose lines are fullest, so a
    // line never holds one stranded shape beside empty space; among equals the larger wins.
    let bestScore = Infinity;
    for (let s = hi; s >= 84; s -= 2) {
      const trial = place(s);
      const waste = trial.lines.reduce((sum, line) => sum + Math.max(0, W - line.reduce((x, i) => x + trial.slots[i] + gap, -gap)) / W, 0) / trial.lines.length;
      const score = waste + ((hi - s) / hi) * 0.25 + (trial.lines.length - 1) * 0.04;
      if (score < bestScore - 1e-9) {
        bestScore = score;
        smax = s;
        placed = trial;
      }
    }
  } else if (placed.lines.length > 1) {
    smax = 200;
    placed = place(smax);
  }
  const shapes: Shape[] = new Array(items.length);
  let y = 0;
  let noteOut: Layout["note"];
  const hiI = items.reduce((a, b, i) => (b.value > items[a].value ? i : a), 0);
  const loI = items.reduce((a, b, i) => (b.value < items[a].value ? i : a), 0);
  placed.lines.forEach((line) => {
    const tall = Math.max(...line.map((i) => rel[i] * smax + (placed.fits[i] ? 0 : OUT_H + 16)));
    const base = y + tall;
    let x = 0;
    line.forEach((i) => {
      const s = rel[i] * smax;
      const slot = placed.slots[i];
      const sx = x + (slot - s) / 2;
      const sy = base - s;
      const fit = placed.fits[i];
      const sh: Shape = { x: sx, y: sy, s, fit, lx: circle ? sx + s / 2 : sx + pad(s), ly: circle ? sy + s / 2 - (fit?.height ?? 0) / 2 : sy + pad(s) };
      if (!fit) sh.out = { x: x + slot / 2, y: sy - 16 - OUT_H, align: "center", leader: [[x + slot / 2, sy - 12], [x + slot / 2, sy - 3]] };
      shapes[i] = sh;
      x += slot + gap;
    });
    y = base + (compact ? 20 : 24);
    if (note && line.includes(hiI) && line.includes(loI) && Math.abs(shapes[hiI].x + shapes[hiI].s / 2 - shapes[loI].x - shapes[loI].s / 2) > measureText(note, 12.5, fonts.font, 600) + 28) {
      noteOut = { text: note, y: base + 16, from: shapes[hiI].x + shapes[hiI].s / 2, to: shapes[loI].x + shapes[loI].s / 2 };
      y = base + 46;
    }
  });
  let height = y - (noteOut?.from != null && placed.lines.length === 1 ? 0 : compact ? 20 : 24) + 4;
  if (note && !noteOut) {
    noteOut = { text: note, y: height + 20 };
    height += 38;
  }
  return { shapes, order, height: Math.ceil(height), note: noteOut, unnamed };
}

/**
 * Two to eight values as squares or circles sized by area. Area is read less precisely than
 * length, so every shape carries its number; what the form adds is the physical sense of
 * "this much bigger".
 */
export const ProportionalArea = defineChart<ProportionalAreaProps>({
  name: "proportional-area",
  title: "Proportional area",
  category: "poster",
  description: "Compares two to eight values as squares or circles whose areas are proportional to the values, each printed with its name and number.",
  whenToUse: "A few quantities that differ a lot (2 times to 100 times), where the reader should feel the difference in size: lake areas, budgets, market sizes. Nest them to show one quantity inside another.",
  avoid: "Values within about 30% of each other, where areas look the same (use block-bar or bar-chart); more than 8 values (use treemap or bar-chart); parts of one whole (use treemap or waffle-chart); negative values.",
  use: [CustomChart],
  defaults: { shape: "square", layout: "row", sort: "none" },
  selectField: (p) => p.name,
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    return layoutArea(p, prepare(p, rows, makeFormatter(p.format)), hookWidth(width), fonts).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one shape per row." },
    { name: "value", type: "string", required: true, description: "Value field. Each shape's area is proportional to it." },
    { name: "shape", type: '"square" | "circle"', default: '"square"', description: "Squares or circles." },
    { name: "layout", type: '"row" | "nested" | "packed"', default: '"row"', description: "`row`: side by side on a common baseline. `nested`: inside one another from a shared corner (squares) or lowest point (circles). `packed`: clustered together." },
    { name: "ratio", type: "boolean | string", description: 'Print how many times the largest value is the smallest. `true` for "{largest} is {ratio} times {smallest}", or a template with those placeholders.' },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order of the shapes in the row layout. Nested and packed always draw largest first." },
  ],
  example: {
    type: "proportional-area",
    theme: "blueprint",
    data: [
      { lake: "Superior", area: 82100 },
      { lake: "Victoria", area: 68900 },
      { lake: "Tanganyika", area: 32900 },
      { lake: "Erie", area: 25700 },
      { lake: "Titicaca", area: 8370 },
    ],
    name: "lake",
    value: "area",
    format: "integer",
    ratio: true,
    title: "Lake Superior covers 82,100 km², 9.8 times Lake Titicaca",
    subtitle: "Surface area of five lakes, square kilometres",
    source: "Approximate published figures",
    note: "Rounded, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const items = prepare(p, ctx.rows, ctx.fmt);
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    const L = layoutArea(p, items, ctx.width, fonts, ctx.locale);
    const circle = p.shape === "circle";
    const nested = p.layout === "nested";
    // A layout taller than an explicit `height`: scale the whole drawing down rather than clip it.
    const k = L.height > ctx.height + 1 ? ctx.height / L.height : 1;
    // A poster palette may hold only 4 colours: past its size take steps derived from the theme rather than repeat one.
    const derived = !ctx.highlight.length && items.length > t.categorical.length ? _posterPalette(t, items.length) : null;
    const colours = items.map((it, i) => {
      const base = derived ? derived[i] : ctx.color(it.key, i);
      // Faded by mixing towards the surface, not by transparency: nested shapes sit on each other, and the printed label needs a readable ink.
      return ctx.selected(it.key) ? base : mix(t.surface, base, 0.3);
    });
    const dotted = { stroke: t.inkSecondary, lineWidth: 1.25, lineDash: [0.1, 4], lineCap: "round" as const, fill: "none" };
    const total = items.reduce((s, i) => s + i.value, 0);

    // The right edge of shape `j` at height `y`, for colouring a leader by what it crosses.
    const edgeAt = (j: number, y: number) => {
      const sh = L.shapes[j];
      if (!circle) return sh.x + sh.s;
      const r = sh.s / 2;
      const dy = Math.abs(y - (sh.y + r));
      return dy >= r ? sh.x + r : sh.x + r + Math.sqrt(r * r - dy * dy);
    };

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      const sh = L.shapes[i];
      if (!it || !sh) return null;
      const fill = colours[i];
      const ink = inkOn(fill);
      const children: any[] = [];
      const style = { fill, stroke: nested ? t.surface : undefined, lineWidth: nested ? 1.5 : 0, opacity: 1, enterFrom: { opacity: 0 } };
      const anim = { enterAnimation: { duration: 450, delay: i * 110 }, transition: ["shape", "style"] };
      children.push(
        circle
          ? { type: "circle", shape: { cx: sh.x + sh.s / 2, cy: sh.y + sh.s / 2, r: sh.s / 2 }, style, ...anim }
          : { type: "rect", shape: { x: sh.x, y: sh.y, width: sh.s, height: sh.s, r: Math.min(Math.max(t.radius, 6), sh.s * 0.12) }, style, ...anim },
      );
      const fit = sh.fit;
      if (fit) {
        const align = circle ? "center" : "left";
        if (fit.inline) {
          children.push({ type: "text", silent: true, x: circle ? sh.lx - fit.width / 2 : sh.lx, y: sh.ly + 10, style: { text: `{v|${it.valueText}}  {n|${it.key}}`, verticalAlign: "middle", rich: { v: { fill: ink, fontSize: 15, fontWeight: 600, fontFamily: t.displayFamily }, n: { fill: alpha(ink, 0.85), fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily } } } });
        } else {
          children.push({ type: "text", silent: true, x: sh.lx, y: sh.ly, style: { text: it.valueText, fill: ink, fontSize: fit.size, fontWeight: fit.size >= 24 ? 300 : 500, fontFamily: t.displayFamily, align, verticalAlign: "top", lineHeight: fit.size * 1.08 } });
          if (fit.lines.length) children.push({ type: "text", silent: true, x: sh.lx, y: sh.ly + fit.size * 1.08, style: { text: fit.lines.join("\n"), fill: alpha(ink, 0.88), fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily, align, verticalAlign: "top", lineHeight: NAME_LH } });
        }
      }
      if (sh.out) {
        const o = sh.out;
        if (nested) {
          // Over the larger shapes the leader takes the ink that reads on each of them.
          const y0 = o.leader[0][1];
          let x = o.leader[0][0];
          for (let j = i - 1; j >= 0; j--) {
            const end = Math.min(edgeAt(j, y0), o.leader[1][0]);
            if (end > x + 1) children.push({ type: "line", silent: true, shape: { x1: x, y1: y0, x2: end, y2: y0 }, style: { ...dotted, stroke: inkOn(colours[j]) } });
            x = Math.max(x, end);
          }
          children.push({ type: "polyline", silent: true, shape: { points: [[x, y0], ...o.leader.slice(1)] }, style: dotted });
        } else children.push({ type: "polyline", silent: true, shape: { points: o.leader }, style: dotted });
        const dim = ctx.dimmed(it.key) || !ctx.selected(it.key);
        const maxW = nested ? Math.max(40, ctx.width / k - o.x) : 160;
        children.push({ type: "text", x: o.x, y: o.y, style: { text: it.valueText, fill: dim ? t.inkSecondary : t.ink, fontSize: OUT_VALUE, fontWeight: 300, fontFamily: t.displayFamily, align: o.align, verticalAlign: "top", lineHeight: OUT_VALUE * 1.1 } });
        children.push({ type: "text", x: o.x, y: o.y + OUT_VALUE * 1.1, style: { text: truncateText(it.key, nested ? maxW : 124, NAME, t.fontFamily, 600), fill: dim ? t.muted : t.inkSecondary, fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily, align: o.align, verticalAlign: "top" } });
      }
      return { type: "group", scaleX: k, scaleY: k, focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    const renderNote = () => {
      const n = L.note;
      if (!n) return null;
      const size = 12.5;
      const children: any[] = [];
      if (n.from != null && n.to != null) {
        const a = Math.min(n.from, n.to);
        const b = Math.max(n.from, n.to);
        const tw = measureText(n.text, size, t.fontFamily, 600);
        const mid = (a + b) / 2;
        // A bracket under the baseline, broken in the middle for its text.
        children.push({ type: "polyline", shape: { points: [[a, n.y - 8], [a, n.y], [mid - tw / 2 - 10, n.y]] }, style: dotted });
        children.push({ type: "polyline", shape: { points: [[mid + tw / 2 + 10, n.y], [b, n.y], [b, n.y - 8]] }, style: dotted });
        children.push({ type: "text", x: mid, y: n.y, style: { text: n.text, fill: t.inkSecondary, fontSize: size, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      } else {
        children.push({ type: "line", shape: { x1: 1, y1: n.y, x2: 25, y2: n.y }, style: dotted });
        children.push({ type: "text", x: 34, y: n.y, style: { text: truncateText(n.text, ctx.width / k - 36, size, t.fontFamily, 600), fill: t.inkSecondary, fontSize: size, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "middle" } });
      }
      return { type: "group", silent: true, scaleX: k, scaleY: k, children };
    };

    const legend: LegendItem[] = L.unnamed.map((i) => ({ name: `${items[i].key} ${items[i].valueText}`, color: colours[i], shape: circle ? ("dot" as const) : ("square" as const), muted: ctx.dimmed(items[i].key) }));
    const hi = items.reduce((a, b) => (b.value > a.value ? b : a), items[0]);
    const lo = items.reduce((a, b) => (b.value < a.value ? b : a), items[0]);
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });
    return {
      legend,
      alt: `Proportional area chart: ${items.length} ${circle ? "circles" : "squares"} sized by ${p.value}, ${p.layout === "nested" ? "nested inside one another" : p.layout === "packed" ? "packed together" : "side by side"}. ${items.map((i) => `${i.key}: ${i.valueText}`).join("; ")}.${hi && lo && hi !== lo && lo.value > 0 ? ` The largest is ${Math.round((hi.value / lo.value) * 10) / 10} times the smallest.` : ""}`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            return it && d.seriesId === "proportional-area" ? tooltipHtml(ctx, it.key, [{ name: p.value, value: it.valueText, color: colours[d.dataIndex] }, ...(hi && it !== hi ? [{ name: `Of ${hi.key}`, value: pct(it.value / hi.value) }] : []), ...(p.layout === "nested" ? [] : [{ name: "Of the total", value: pct(it.value / total) }])]) : "";
          },
        },
        series: [
          {
            id: "proportional-area",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.key, value: [it.value] })),
          },
          { id: "note", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderNote as any, data: [0] },
        ],
      },
    };
  },
});

export const examples = {
  "Nested squares, highlight, click to select": {
    data: [
      { market: "All groceries", sales: 412 },
      { market: "Fresh produce", sales: 96 },
      { market: "Organic produce", sales: 21 },
      { market: "Organic berries", sales: 3.4 },
    ],
    name: "market",
    value: "sales",
    layout: "nested",
    format: "£{value}m",
    highlight: "Organic produce",
    select: true,
    ratio: "{largest} is {ratio} times {smallest}",
    title: "Organic produce took £21m of £412m grocery sales in 2025",
    subtitle: "Annual sales of one regional grocer by category, £ million, 2025",
    source: "Illustrative data",
    note: "Invented figures",
  },
  "Circles in a row": {
    theme: "sunrise",
    data: [
      { reactor: "Harlow A", output: 1650 },
      { reactor: "Brant Point", output: 1100 },
      { reactor: "Selby 2", output: 470 },
      { reactor: "Test unit", output: 40 },
    ],
    name: "reactor",
    value: "output",
    shape: "circle",
    format: "{value} MW",
    ratio: true,
    title: "Harlow A has a capacity of 1,650 MW",
    subtitle: "Generating capacity of four power stations, megawatts",
    source: "Illustrative data",
    note: "Invented figures",
  },
  "Nested circles": {
    theme: "noir",
    data: [
      { body: "Whole catchment", area: 5200 },
      { body: "Farmland", area: 2900 },
      { body: "Woodland", area: 1150 },
      { body: "Open water", area: 160 },
    ],
    name: "body",
    value: "area",
    shape: "circle",
    layout: "nested",
    format: "{value} km²",
    title: "Farmland covers 2,900 km² of the 5,200 km² catchment",
    subtitle: "Land cover of the River Teme catchment, square kilometres",
    source: "Illustrative data",
    note: "Invented figures",
  },
  "Stress: eight packed circles, very uneven, long names": {
    theme: "forest",
    data: [
      { fund: "State pension and retirement benefits", spend: 124 },
      { fund: "Health services", spend: 88 },
      { fund: "Schools", spend: 52 },
      { fund: "Defence", spend: 31 },
      { fund: "Transport infrastructure", spend: 18 },
      { fund: "Courts and prisons", spend: 7.5 },
      { fund: "Overseas aid", spend: 2.2 },
      { fund: "National parks and heritage sites", spend: 0.6 },
    ],
    name: "fund",
    value: "spend",
    shape: "circle",
    layout: "packed",
    format: "{value}bn",
    ratio: true,
    title: "Pensions took 124bn of the 323.3bn budget",
    subtitle: "Planned public spending by area, billions, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional country",
  },
  "Packed squares": {
    theme: "earth",
    data: [
      { fund: "Pensions", spend: 124 },
      { fund: "Health", spend: 88 },
      { fund: "Schools", spend: 52 },
      { fund: "Defence", spend: 31 },
      { fund: "Transport", spend: 18 },
      { fund: "Courts", spend: 7.5 },
    ],
    name: "fund",
    value: "spend",
    layout: "packed",
    format: "{value}bn",
    title: "Health took 88bn of planned spending in 2025",
    subtitle: "Planned public spending by area, billions, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional country",
  },
};
