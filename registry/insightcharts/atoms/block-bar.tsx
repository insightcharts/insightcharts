"use client";

import { CustomChart } from "echarts/charts";
import { inkOn, mix, defineChart, type LegendItem, makeFormatter, type Formatter, measureText, truncateText, wrapText, morph, tooltipHtml, describeExtremes, shapeSeries } from "insightcharts/core";

export interface BlockBarProps {
  /** Category field: one bar (or one pair of bars) per value. */
  name: string;
  /** Value field, or two fields for paired bars. */
  value: string | string[];
  /** Field that splits long-format rows into paired series. */
  series?: string;
  /** Field holding a short secondary label printed above each bar, e.g. "3.5% of GDP". */
  detail?: string;
  /** A dotted line between two categories marking an event: `{ after: "2021", label: "New terminal opened" }`. */
  marker?: { after: string; label?: string };
  /** `"auto"` draws columns and switches to horizontal bars when the columns would be too narrow for their numbers. */
  orientation?: "auto" | "vertical" | "horizontal";
  /** Display names for series keys. */
  names?: Record<string, string>;
}

// The `height` hook lays out with the measured plot width but has no theme, so it measures text
// in a generic face; `build` lays out again with the theme's faces and scales the drawing down
// in the rare case where that comes out taller. Before the first layout the width is unknown.
type Seen = { font: string; display: string };
const HOOK_FONTS: Seen = { font: "sans-serif", display: "sans-serif" };
const hookWidth = (width?: number) => width ?? (typeof window === "undefined" ? 720 : Math.max(280, Math.min(window.innerWidth - 48, 812)));

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const CAT = 12.5;
const CAT_LH = 16;
const MAX_BARS = 16;

interface Bar {
  ci: number;
  si: number;
  value: number;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
  inside: boolean;
}

interface Cat {
  label: string;
  lines: string[];
  x: number;
  y: number;
  w: number;
  detail?: string;
  /** Where the detail label is anchored. */
  dx: number;
  dy: number;
}

interface Layout {
  horizontal: boolean;
  bars: Bar[];
  cats: Cat[];
  height: number;
  marker?: { points: number[][]; label?: string; lx: number; ly: number; align: "left" | "right" };
}

function prepare(p: BlockBarProps, rows: Record<string, unknown>[], fmt: Formatter) {
  const shaped = shapeSeries(rows, { x: p.name, y: p.value, series: p.series }, p.names);
  const count = Math.max(1, Math.floor(MAX_BARS / Math.max(1, shaped.series.length)));
  const labels = shaped.labels.slice(0, count);
  const series = shaped.series.slice(0, 2);
  const values = series.map((s) => labels.map((_, i) => Math.max(0, s.values[i] ?? 0)));
  const details = labels.map((l) => {
    if (!p.detail) return undefined;
    const row = rows.find((r) => String(r[p.name]) === l && r[p.detail!] != null && r[p.detail!] !== "");
    return row ? String(row[p.detail]) : undefined;
  });
  return { labels, series, values, texts: values.map((v) => v.map((x) => fmt(x))), details, max: Math.max(1e-9, ...values.flat()) };
}

type Prepared = ReturnType<typeof prepare>;

function layoutBars(p: BlockBarProps, d: Prepared, width: number, fonts: Seen): Layout {
  const W = Math.max(160, width);
  const compact = W < 480;
  const n = d.labels.length;
  const m = d.series.length;
  const inner = 3;
  const gapC = n > 8 ? 8 : n > 5 ? 12 : 18;
  const slotW = (W - gapC * (n - 1)) / Math.max(1, n);
  const bw = Math.min((slotW - inner * (m - 1)) / m, m > 1 ? 80 : 150);
  const widest = (size: number, weight: number) => Math.max(0, ...d.texts.flat().map((s) => measureText(s, size, fonts.display, weight)));
  // The value is set as large as the bar is wide, down to 12px.
  let size = Math.round(Math.max(12, Math.min(34, bw * 0.3)));
  while (size > 12 && widest(size, size >= 22 ? 300 : 600) > bw - 10) size -= 1;
  const fitsVertical = widest(size, size >= 22 ? 300 : 600) <= bw - 6;
  const horizontal = p.orientation === "horizontal" || (p.orientation !== "vertical" && (compact || !fitsVertical));
  const hasDetail = d.details.some(Boolean);
  const markerAt = p.marker ? d.labels.indexOf(String(p.marker.after)) : -1;
  const bars: Bar[] = [];
  const cats: Cat[] = [];

  if (!horizontal) {
    const markerH = markerAt >= 0 && p.marker?.label ? 26 : 0;
    const detailH = hasDetail ? 22 : 0;
    const BH = n <= 3 ? 320 : 290;
    const top = markerH + detailH;
    const base = top + BH;
    const groupW = m * bw + inner * (m - 1);
    let catLines = 1;
    d.labels.forEach((label, ci) => {
      const x0 = ci * (slotW + gapC) + (slotW - groupW) / 2;
      let highest = base;
      d.series.forEach((_, si) => {
        const v = d.values[si][ci];
        const h = (v / d.max) * BH;
        const inside = h >= size * 1.15 + 12;
        const y = base - h;
        highest = Math.min(highest, inside ? y : y - size * 1.2 - 4);
        bars.push({ ci, si, value: v, text: d.texts[si][ci], x: x0 + si * (bw + inner), y, w: bw, h, size, inside });
      });
      const wrapped = wrapText(label, slotW + gapC - 6, CAT, fonts.font, 600);
      const lines = (wrapped.length > 2 ? [wrapped[0], wrapped.slice(1).join(" ")] : wrapped).map((l) => truncateText(l, slotW + gapC - 6, CAT, fonts.font, 600));
      catLines = Math.max(catLines, lines.length);
      const detail = d.details[ci] ? truncateText(d.details[ci]!, slotW + gapC - 4, 12, fonts.font) : undefined;
      cats.push({ label, lines, x: ci * (slotW + gapC) + slotW / 2, y: base + 9, w: slotW, detail, dx: ci * (slotW + gapC) + slotW / 2, dy: highest - 7 });
    });
    const height = Math.ceil(base + 9 + catLines * CAT_LH + 4);
    let marker: Layout["marker"];
    if (markerAt >= 0 && markerAt < n - 1) {
      const x = (markerAt + 1) * (slotW + gapC) - gapC / 2;
      const lw = p.marker?.label ? measureText(p.marker.label, 12, fonts.font, 600) : 0;
      const right = x + 8 + lw <= W;
      marker = { points: [[x, markerH ? 4 : 0], [x, base + 6]], label: p.marker?.label, lx: right ? x + 8 : x - 8, ly: 9, align: right ? "left" : "right" };
    }
    return { horizontal, bars, cats, height, marker };
  }

  const bt = m > 1 ? 28 : compact ? 40 : 44;
  const hSize = m > 1 ? 15 : 20;
  const weight = hSize >= 20 ? 300 : 600;
  let y = 0;
  let marker: Layout["marker"];
  d.labels.forEach((label, ci) => {
    const detail = d.details[ci];
    const detailW = detail ? measureText(detail, 12, fonts.font) + 14 : 0;
    const labelText = truncateText(label, Math.max(60, W - Math.min(detailW, W * 0.5)), 13, fonts.font, 600);
    cats.push({ label, lines: [labelText], x: 0, y, w: W, detail: detail ? truncateText(detail, W * 0.5, 12, fonts.font) : undefined, dx: W, dy: y + 9 });
    y += 24;
    d.series.forEach((_, si) => {
      const v = d.values[si][ci];
      const len = (v / d.max) * W;
      const tw = measureText(d.texts[si][ci], hSize, fonts.display, weight);
      bars.push({ ci, si, value: v, text: d.texts[si][ci], x: 0, y, w: len, h: bt, size: hSize, inside: len >= tw + 24 });
      y += bt + inner;
    });
    y += 18 - inner;
    if (ci === markerAt && ci < n - 1) {
      const lw = p.marker?.label ? measureText(p.marker.label, 12, fonts.font, 600) : 0;
      marker = { points: [[0, y + 2], [W - (lw ? lw + 10 : 0), y + 2]], label: p.marker?.label, lx: W, ly: y + 2, align: "right" };
      y += 22;
    }
  });
  return { horizontal, bars, cats, height: Math.ceil(y - 14), marker };
}

/**
 * The poster column chart: a few thick blocks with their numbers printed inside. The same
 * zero-based length encoding as a bar chart, with the axis replaced by direct labels.
 */
export const BlockBar = defineChart<BlockBarProps>({
  name: "block-bar",
  title: "Block bars",
  category: "poster",
  description: "Compares 3 to 12 values as thick rounded bars from a zero baseline, with each value printed inside the end of its bar and the category beneath.",
  whenToUse: "A short series or ranking that should read as a bold graphic with no axis: ticket sales in each of six years, two paired measures in five regions. Add `detail` for a second small figure above each bar and `marker` for an event between two bars.",
  avoid: "More than 12 bars, more than two series or stacked parts (use bar-chart); negative values (use diverging-bar-chart); a long time series (use line-chart); values that differ by more than about 50 times, where the short bars vanish (use proportional-area).",
  use: [CustomChart],
  defaults: { orientation: "auto" },
  selectField: (p) => p.name,
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    return layoutBars(p, prepare(p, rows, makeFormatter(p.format)), hookWidth(width), fonts).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one bar (or one pair of bars) per value." },
    { name: "value", type: "string | string[]", required: true, description: "Value field, or two fields for paired bars." },
    { name: "series", type: "string", description: "Field that splits long-format rows into paired series." },
    { name: "detail", type: "string", description: 'Field holding a short secondary label printed above each bar, e.g. "3.5% of GDP".' },
    { name: "marker", type: "{ after: string; label?: string }", description: "A dotted line after the named category, marking an event, with an optional label." },
    { name: "orientation", type: '"auto" | "vertical" | "horizontal"', default: '"auto"', description: "`auto` draws columns and switches to horizontal bars on narrow widths." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "block-bar",
    data: [
      { year: "2020", tickets: 18400, seats: "41% of seats" },
      { year: "2021", tickets: 22900, seats: "49% of seats" },
      { year: "2022", tickets: 31200, seats: "58% of seats" },
      { year: "2023", tickets: 36800, seats: "64% of seats" },
      { year: "2024", tickets: 41500, seats: "69% of seats" },
      { year: "2025", tickets: 48200, seats: "74% of seats" },
    ],
    name: "year",
    value: "tickets",
    detail: "seats",
    format: "integer",
    marker: { after: "2021", label: "Second screen opened" },
    title: "The Portholm Film Festival sold 48,200 tickets in 2025",
    subtitle: "Tickets sold per year and share of available seats filled, 2020 to 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional festival",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const d = prepare(p, ctx.rows, ctx.fmt);
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    const L = layoutBars(p, d, ctx.width, fonts);
    const k = L.height > ctx.height + 1 ? ctx.height / L.height : 1;
    const multi = d.series.length > 1;
    const colourOf = (b: Bar) => {
      const base = multi ? ctx.color(d.series[b.si].key, b.si) : ctx.highlight.length ? ctx.color(d.labels[b.ci]) : ctx.color();
      // Faded by mixing towards the surface, not by transparency, so the printed value keeps a readable ink.
      return ctx.selected(d.labels[b.ci]) ? base : mix(t.surface, base, 0.3);
    };
    const dotted = { stroke: t.inkSecondary, lineWidth: 1.25, lineDash: [0.1, 4], lineCap: "round" as const, fill: "none" };

    const renderItem = (params: any) => {
      const b = L.bars[params.dataIndex];
      if (!b) return null;
      const cat = L.cats[b.ci];
      const fill = colourOf(b);
      const ink = inkOn(fill);
      const live = ctx.selected(cat.label);
      const strong = !multi && !ctx.dimmed(cat.label) && live;
      const weight = b.size >= 20 ? 300 : 600;
      const children: any[] = [];
      const delay = b.ci * 70;
      if (L.horizontal) {
        const r = Math.min(Math.max(t.radius, 8), b.h / 2, b.w);
        children.push({ type: "rect", shape: { x: b.x, y: b.y, width: Math.max(b.w, b.value > 0 ? 2 : 0), height: b.h, r: [0, r, r, 0], enterFrom: { width: 0 } }, style: { fill }, enterAnimation: { duration: 600, delay }, transition: ["shape", "style"] });
        children.push(
          b.inside
            ? { type: "text", silent: true, x: b.x + b.w - 12, y: b.y + b.h / 2 + 1, style: { text: b.text, fill: ink, fontSize: b.size, fontWeight: weight, fontFamily: t.displayFamily, align: "right", verticalAlign: "middle" } }
            : { type: "text", silent: true, x: b.x + b.w + 8, y: b.y + b.h / 2 + 1, style: { text: b.text, fill: live ? t.ink : t.muted, fontSize: b.size, fontWeight: weight, fontFamily: t.displayFamily, verticalAlign: "middle" } },
        );
        if (b.si === 0) {
          children.push({ type: "text", x: cat.x, y: cat.y + 9, style: { text: cat.lines[0], fill: strong || multi ? t.ink : t.inkSecondary, fontSize: 13, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "middle" } });
          if (cat.detail) children.push({ type: "text", x: cat.dx, y: cat.dy, style: { text: cat.detail, fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, align: "right", verticalAlign: "middle" } });
        }
      } else {
        const r = Math.min(Math.max(t.radius, b.w * 0.14), 16, b.h);
        children.push({ type: "rect", shape: { x: b.x, y: b.y, width: b.w, height: Math.max(b.h, b.value > 0 ? 2 : 0), r: [r, r, 0, 0], enterFrom: { y: b.y + b.h, height: 0 } }, style: { fill }, enterAnimation: { duration: 600, delay }, transition: ["shape", "style"] });
        children.push(
          b.inside
            ? { type: "text", silent: true, x: b.x + b.w / 2, y: b.y + 9, style: { text: b.text, fill: ink, fontSize: b.size, fontWeight: weight, fontFamily: t.displayFamily, align: "center", verticalAlign: "top" } }
            : { type: "text", silent: true, x: b.x + b.w / 2, y: b.y - 5, style: { text: b.text, fill: live ? t.ink : t.muted, fontSize: b.size, fontWeight: weight, fontFamily: t.displayFamily, align: "center", verticalAlign: "bottom" } },
        );
        if (b.si === 0) {
          children.push({ type: "text", x: cat.x, y: cat.y, style: { text: cat.lines.join("\n"), fill: strong || multi ? t.ink : t.inkSecondary, fontSize: CAT, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "top", lineHeight: CAT_LH } });
          if (cat.detail) children.push({ type: "text", x: cat.dx, y: cat.dy, style: { text: cat.detail, fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, align: "center", verticalAlign: "bottom" } });
        }
      }
      return { type: "group", scaleX: k, scaleY: k, focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    const renderMarker = () => {
      const mk = L.marker;
      if (!mk) return null;
      const keep = { blur: { style: { opacity: 1 } } };
      return {
        type: "group",
        silent: true,
        scaleX: k,
        scaleY: k,
        children: [
          { type: "polyline", shape: { points: mk.points }, style: dotted, ...keep },
          ...(mk.label ? [{ type: "text", x: mk.lx, y: mk.ly, style: { text: mk.label, fill: t.inkSecondary, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, align: mk.align, verticalAlign: "middle" }, ...keep }] : []),
        ],
      };
    };

    const legend: LegendItem[] = multi ? d.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), shape: "square" as const, muted: ctx.dimmed(s.key) })) : [];
    const measure = Array.isArray(p.value) ? p.value.join(" and ") : p.value;
    return {
      legend,
      alt: `Block bars of ${measure} by ${p.name}, ${L.horizontal ? "horizontal" : "vertical"}, from a zero baseline. ${d.series.map((s, si) => `${multi ? `${s.name}: ` : ""}${describeExtremes(d.labels, d.values[si], ctx.fmt)}`).join(" ")}${p.marker?.label ? ` Marked after ${p.marker.after}: ${p.marker.label}.` : ""}`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (x: any) => {
            const b = L.bars[x.dataIndex];
            if (!b || x.seriesId !== "block-bar") return "";
            const detail = d.details[b.ci];
            return tooltipHtml(ctx, d.labels[b.ci], [...d.series.map((s, si) => ({ name: s.name, value: d.texts[si][b.ci], color: colourOf({ ...b, si }), muted: multi && si !== b.si })), ...(detail ? [{ name: p.detail!, value: detail }] : [])]);
          },
        },
        series: [
          {
            id: "block-bar",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: L.bars.map((b) => ({ name: d.labels[b.ci], value: [b.value] })),
          },
          { id: "marker", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderMarker as any, data: [0] },
        ],
      },
    };
  },
});
