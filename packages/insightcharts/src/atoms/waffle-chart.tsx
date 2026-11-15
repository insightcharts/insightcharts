import { CustomChart } from "echarts/charts";
import { alpha, mix } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface WaffleChartProps {
  /** Value field. Each category's cells are its share of the whole. */
  value: string;
  /** Category field. Omit for a single share (one row, or all rows summed). */
  name?: string;
  /** The whole the values are a share of. Default: the sum of the values. Set it (for example 100) to show one share against an empty remainder. */
  total?: number;
  /** Grid rows. Default 10. */
  rows?: number;
  /** Grid columns. Default 10. */
  columns?: number;
  /** Cell shape. */
  shape?: "square" | "circle";
  /** Name for the unfilled remainder when `total` exceeds the sum, e.g. "Everything else". Unlabelled when omitted. */
  restLabel?: string;
  /** Display names for category keys. */
  names?: Record<string, string>;
}

/** Hamilton / largest-remainder apportionment: integer counts that always total exactly `seats`. */
function largestRemainder(values: number[], seats: number): number[] {
  const sum = values.reduce((s, v) => s + v, 0);
  if (sum <= 0) return values.map(() => 0);
  const exact = values.map((v) => (v / sum) * seats);
  const out = exact.map(Math.floor);
  let left = seats - out.reduce((s, v) => s + v, 0);
  const order = exact.map((v, i) => [v - Math.floor(v), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; left > 0 && k < order.length; k++, left--) out[order[k][1]]++;
  return out;
}

const MAX_CATEGORIES = 8;

/**
 * A grid of unit cells, each standing for one part in (by default) a hundred. People read
 * "37 in every 100" far more accurately from counted units than from an angle, which is
 * why the waffle is the infographic form for a share of a whole.
 */
export const WaffleChart = defineChart<WaffleChartProps>({
  name: "waffle-chart",
  title: "Waffle chart",
  category: "part-to-whole",
  description: "Shows shares of a whole as counted cells in a grid, such as 37 in every 100.",
  whenToUse: "One share (\"37 in every 100\") or a handful of categories that add up to a whole, where the reader should be able to count the units.",
  avoid: "Comparing shares across several groups (use bar-chart with stack \"percent\"); more than about 6 categories or shares under 1% (use bar-chart); a compact inline part-to-whole (use segmented-bar).",
  use: [CustomChart],
  defaults: { rows: 10, columns: 10, shape: "square" },
  // A square grid gets the usual 300px; a wide, shallow grid only needs room for its rows and its labels.
  height: (p, rows) => {
    const shape = Math.max(1, p.rows ?? 10) / Math.max(1, p.columns ?? 10);
    if (shape >= 0.6) return 300;
    const cats = p.name ? Math.min(MAX_CATEGORIES, new Set(rows.map((r) => String(r[p.name!] ?? ""))).size) + (p.restLabel ? 1 : 0) : 1;
    return Math.round(Math.max(120, Math.min(300, 600 * shape), Math.min(300, cats * 32 + 8)));
  },
  selectField: (p) => p.name,
  props: [
    { name: "value", type: "string", required: true, description: "Value field. Each category's cells are its share of the whole." },
    { name: "name", type: "string", description: "Category field. Omit for a single share." },
    { name: "total", type: "number", description: "The whole. Default: the sum of the values. Set to 100 with one value to show a single share against an empty remainder." },
    { name: "rows", type: "number", default: "10", description: "Grid rows." },
    { name: "columns", type: "number", default: "10", description: "Grid columns." },
    { name: "shape", type: '"square" | "circle"', default: '"square"', description: "Cell shape." },
    { name: "restLabel", type: "string", description: "Label for the unfilled remainder when `total` exceeds the sum." },
    { name: "names", type: "Record<string, string>", description: "Display names for category keys." },
  ],
  example: {
    theme: "poster",
    type: "waffle-chart",
    data: [{ group: "Have never been online", share: 33 }],
    name: "group",
    value: "share",
    total: 100,
    restLabel: "Use the internet",
    title: "33% of the world's population had never used the internet in 2023",
    subtitle: "Share of the global population, 2023. Each square is 1% of people",
    source: "ITU Facts and Figures 2023",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const cols = Math.max(1, Math.round(p.columns ?? 10));
    const rws = Math.max(1, Math.round(p.rows ?? 10));
    const n = cols * rws;

    // Sum by category, in first-seen order: the fill order is the author's order.
    const byKey = new Map<string, number>();
    for (const r of ctx.rows) {
      const key = p.name ? String(r[p.name] ?? "") : p.value;
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v) && v > 0) byKey.set(key, (byKey.get(key) ?? 0) + v);
    }
    let cats = [...byKey].map(([key, value]) => ({ key, name: p.names?.[key] ?? key, value, other: false }));
    // Never more identity colours than the theme has (poster themes have four or five): the smallest categories fold into a neutral "Other".
    // With a highlight only the named entities take a colour, so the palette is not the limit.
    const palette = ctx.highlight.length ? MAX_CATEGORIES : t.categorical.length;
    if (cats.length > Math.min(MAX_CATEGORIES, palette)) {
      const ranked = [...cats].sort((a, b) => b.value - a.value);
      const keep = new Set(ranked.slice(0, Math.min(MAX_CATEGORIES - 1, palette)).map((c) => c.key));
      const folded = cats.filter((c) => !keep.has(c.key));
      // A single folded category keeps its own name; it only loses its colour.
      const rest = folded.length === 1 ? { ...folded[0], other: true } : { key: "Other", name: `Other (${folded.length})`, value: folded.reduce((s, c) => s + c.value, 0), other: true };
      cats = [...cats.filter((c) => keep.has(c.key)), rest];
    }
    const sum = cats.reduce((s, c) => s + c.value, 0);
    const total = p.total != null && p.total > sum ? p.total : sum;
    const rest = total - sum;
    const counts = largestRemainder([...cats.map((c) => c.value), rest], n);
    const single = cats.length === 1;
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: n > 100 ? 1 : 0 });
    const share = (cells: number, value: number) => (cells === 0 && value > 0 ? `<${pct(1 / n)}` : pct(cells / n));

    const empty = mix(t.grid, t.context, 0.3);
    type Item = { key: string; name: string; value: number; cells: number; start: number; color: string; rest: boolean; label: string };
    const items: Item[] = [];
    let cursor = 0;
    cats.forEach((c, i) => {
      const base = c.other ? t.context : single ? ctx.color(c.key) : ctx.color(c.key, i);
      items.push({ key: c.key, name: c.name, value: c.value, cells: counts[i], start: cursor, color: ctx.selected(c.key) ? base : alpha(base, 0.25), rest: false, label: share(counts[i], c.value) });
      cursor += counts[i];
    });
    if (rest > 0) items.push({ key: "", name: p.restLabel ?? "Remainder", value: rest, cells: counts[cats.length], start: cursor, color: empty, rest: true, label: share(counts[cats.length], rest) });

    // Geometry. Wide: grid on the left, direct labels beside it. Compact: grid fills the width, shares move to the legend.
    const direct = !ctx.compact;
    const cell = Math.max(2, Math.floor(Math.min((direct ? Math.min(ctx.width * 0.5, ctx.height * (cols / rws)) : ctx.width) / cols, ctx.height / rws)));
    const gap = Math.max(1, Math.round(cell * 0.12));
    const gridW = cell * cols - gap;
    const gridH = cell * rws - gap;
    // Top-aligned, so the grid sits directly under the subtitle whatever the plot height.
    const top = 0;
    const labelled = items.filter((it) => !it.rest || p.restLabel);
    const labelX = gridW + Math.max(24, Math.min(48, ctx.width * 0.05));
    const big = single ? 44 : labelled.length <= 4 ? 24 : 16;
    const lineH = single ? 0 : Math.max(big + 6, Math.min(big + 22, gridH / Math.max(1, labelled.length)));
    const labelW = Math.max(60, ctx.width - labelX - 22);

    const renderItem = (params: any) => {
      const it = items[params.dataIndex];
      if (!it) return null;
      const children: any[] = [];
      for (let k = 0; k < it.cells; k++) {
        const idx = it.start + k;
        const x = (idx % cols) * cell;
        const y = top + Math.floor(idx / cols) * cell;
        const size = cell - gap;
        // Cells appear one by one, in reading order.
        const anim = { enterAnimation: { duration: 260, delay: Math.round((idx / n) * 700) } };
        const style = { fill: it.color, opacity: 1, enterFrom: { opacity: 0 } };
        children.push(
          p.shape === "circle"
            ? { type: "circle", shape: { cx: x + size / 2, cy: y + size / 2, r: size / 2 }, style, ...anim }
            : { type: "rect", shape: { x, y, width: size, height: size, r: Math.min(t.radius, size / 5) }, style, ...anim },
        );
      }
      const li = labelled.indexOf(it);
      if (direct && li !== -1) {
        if (single && !it.rest) {
          children.push({ type: "text", style: { x: labelX, y: top + gridH / 2 - 8, text: it.label, fill: t.ink, fontSize: big, fontWeight: 700, fontFamily: t.fontFamily, verticalAlign: "bottom" } });
          children.push({ type: "text", style: { x: labelX, y: top + gridH / 2 - 2, text: it.name, fill: t.inkSecondary, fontSize: 14, fontFamily: t.fontFamily, verticalAlign: "top", width: labelW + 22, overflow: "break", lineHeight: 19 } });
        } else if (single) {
          // The remainder of a single share: a quiet line at the foot of the grid.
          children.push({ type: "text", style: { x: labelX, y: top + gridH, text: `${it.label} ${it.name}`, fill: t.muted, fontSize: 13, fontFamily: t.fontFamily, verticalAlign: "bottom", width: labelW + 22, overflow: "truncate" } });
        } else {
          // Centred on the grid, unless the list is taller than the grid: then it starts at the top instead of running off it.
          const cy = top + Math.max(gridH, labelled.length * lineH) / 2 + (li - (labelled.length - 1) / 2) * lineH;
          const sw = 12;
          children.push(p.shape === "circle" ? { type: "circle", shape: { cx: labelX + sw / 2, cy, r: sw / 2 }, style: { fill: it.color } } : { type: "rect", shape: { x: labelX, y: cy - sw / 2, width: sw, height: sw, r: 2 }, style: { fill: it.color } });
          children.push({
            type: "text",
            style: {
              x: labelX + sw + 10,
              y: cy,
              verticalAlign: "middle",
              width: labelW,
              overflow: "truncate",
              text: `{v|${it.label}}  {n|${it.name}}`,
              rich: {
                v: { fill: it.rest ? t.muted : t.ink, fontSize: big, fontWeight: 700, fontFamily: t.fontFamily },
                n: { fill: it.rest ? t.muted : t.inkSecondary, fontSize: labelled.length <= 4 ? 14 : 13, fontFamily: t.fontFamily },
              },
            },
          });
        }
      }
      return { type: "group", silent: it.rest, children };
    };

    const legend: LegendItem[] = direct ? [] : labelled.map((it) => ({ name: `${it.name} ${it.label}`, color: it.color, shape: p.shape === "circle" ? "dot" : "square", muted: it.rest || ctx.dimmed(it.key) }));
    const described = items.filter((it) => !it.rest).map((it) => `${it.name}: ${it.cells} of ${n} cells (${ctx.fmt(it.value)})`);

    return {
      legend,
      alt: `Waffle chart, a ${cols} by ${rws} grid where each cell is ${pct(1 / n)} of the whole. ${described.join("; ")}.${rest > 0 ? ` ${items[items.length - 1].cells} cells are ${p.restLabel ?? "unfilled"}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            return it ? tooltipHtml(ctx, it.name, [{ name: p.value, value: ctx.fmt(it.value), color: it.color }, { name: "Share", value: pct(it.value / total) }, { name: "Cells", value: `${it.cells} of ${n}` }]) : "";
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "waffle",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "cells"],
            encode: { tooltip: [0, 1], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.rest ? "" : it.key, value: [it.value, it.cells] })),
          },
        ],
      },
    };
  },
});

export const examples = {
  "Several categories": {
    data: [
      { source: "Coal", twh: 35.4 },
      { source: "Gas", twh: 22.5 },
      { source: "Hydro", twh: 14.3 },
      { source: "Nuclear", twh: 9.1 },
      { source: "Wind", twh: 7.8 },
      { source: "Solar", twh: 5.5 },
      { source: "Other", twh: 5.4 },
    ],
    name: "source",
    value: "twh",
    format: "{value}%",
    title: "Coal and gas generated 57.9% of the world's electricity in 2023",
    subtitle: "Share of global electricity generation by source, 2023",
    source: "Ember, Global Electricity Review 2024",
    note: "Figures are approximate, for illustration",
  },
  "Highlight, circles": {
    theme: "ocean",
    data: [
      { source: "Coal", twh: 35.4 },
      { source: "Gas", twh: 22.5 },
      { source: "Hydro", twh: 14.3 },
      { source: "Nuclear", twh: 9.1 },
      { source: "Wind", twh: 7.8 },
      { source: "Solar", twh: 5.5 },
      { source: "Other", twh: 5.4 },
    ],
    name: "source",
    value: "twh",
    shape: "circle",
    highlight: ["Wind", "Solar"],
    format: "{value}%",
    title: "Wind and solar generated 13.3% of the world's electricity in 2023",
    subtitle: "Share of global electricity generation by source, 2023",
    source: "Ember, Global Electricity Review 2024",
    note: "Figures are approximate, for illustration",
  },
  "Stress: long names, wide grid, rounding": {
    theme: "earth",
    data: [
      { answer: "Strongly agree that the policy should be extended", n: 333 },
      { answer: "Somewhat agree", n: 333 },
      { answer: "Neither agree nor disagree, or did not answer the question", n: 334 },
      { answer: "Disagree", n: 4 },
    ],
    name: "answer",
    value: "n",
    rows: 5,
    columns: 20,
    height: 130,
    title: "Survey responses on extending the policy, 1,004 adults",
    subtitle: "Each cell is 1% of responses. Largest-remainder rounding keeps the grid total at 100",
    source: "Illustrative data",
  },
};
