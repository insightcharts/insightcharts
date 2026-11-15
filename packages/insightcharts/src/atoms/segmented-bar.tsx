import { forwardRef } from "react";
import { CustomChart } from "echarts/charts";
import type { ChartHandle } from "../core/chart";
import { alpha, inkOn } from "../core/color";
import { defineChart, type ChartComponent, type CommonChartProps } from "../core/define";
import type { LegendItem } from "../core/figure";
import { measureText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface SegmentedBarProps {
  /** Category field: one segment per distinct value. */
  name: string;
  /** Value field. */
  value: string;
  /** `"tall"` is a 28px bar with shares printed inside where they fit; `"thin"` is an 8px unlabelled bar for dense cards. */
  size?: "tall" | "thin";
  /** Segment order. Default: data order, which the legend follows. */
  sort?: "none" | "desc";
  /** Display names for category keys. */
  names?: Record<string, string>;
}

const MAX_SEGMENTS = 8;
const HEIGHT = { tall: 28, thin: 8 };

const Inner = defineChart<SegmentedBarProps>({
  name: "segmented-bar",
  title: "Segmented bar",
  category: "part-to-whole",
  description: "Splits one whole into proportional segments along a single horizontal bar.",
  whenToUse: "A compact part-to-whole for cards, table cells and stat rows: budget split, device mix, vote share. The legend carries names in block order.",
  avoid: "Comparing compositions across several groups (use bar-chart with stack \"percent\"); more than about 6 parts or many slivers (use bar-chart); when the reader should count units (use waffle-chart).",
  use: [CustomChart],
  defaults: { size: "tall", sort: "none" },
  selectField: (p) => p.name,
  selectValue: (params) => (params.data?.other ? null : params.data?.key ?? params.name),
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one segment per distinct value." },
    { name: "value", type: "string", required: true, description: "Value field." },
    { name: "size", type: '"tall" | "thin"', default: '"tall"', description: "28px with shares printed inside where they fit, or 8px unlabelled." },
    { name: "sort", type: '"none" | "desc"', default: '"none"', description: "Segment order; the legend follows it." },
    { name: "names", type: "Record<string, string>", description: "Display names for category keys." },
  ],
  example: {
    theme: "ledger",
    type: "segmented-bar",
    data: [
      { party: "Labour", seats: 411 },
      { party: "Conservative", seats: 121 },
      { party: "Liberal Democrat", seats: 72 },
      { party: "SNP", seats: 9 },
      { party: "Others", seats: 37 },
    ],
    name: "party",
    value: "seats",
    title: "Labour won 411 of 650 seats in the 2024 general election",
    subtitle: "Seats in the House of Commons by party after the 2024 general election",
    source: "House of Commons Library",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const thin = p.size === "thin";
    const byKey = new Map<string, number>();
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v) && v > 0) byKey.set(String(r[p.name] ?? ""), (byKey.get(String(r[p.name] ?? "")) ?? 0) + v);
    }
    let parts = [...byKey].map(([key, value], index) => ({ key, name: p.names?.[key] ?? key, value, index, other: false }));
    if (p.sort === "desc") parts.sort((a, b) => b.value - a.value);
    // Never more identity colours than the theme has (poster themes have four or five): the smallest parts fold into a neutral "Other".
    // With a highlight only the named entities take a colour, so the palette is not the limit.
    const palette = ctx.highlight.length ? MAX_SEGMENTS : t.categorical.length;
    if (parts.length > Math.min(MAX_SEGMENTS, palette)) {
      const keep = new Set([...parts].sort((a, b) => b.value - a.value).slice(0, Math.min(MAX_SEGMENTS - 1, palette)).map((x) => x.key));
      const folded = parts.filter((x) => !keep.has(x.key));
      // A single folded part keeps its own name; it only loses its colour.
      const rest = folded.length === 1 ? { ...folded[0], index: -1, other: true } : { key: "__other", name: `Other (${folded.length})`, value: folded.reduce((s, x) => s + x.value, 0), index: -1, other: true };
      parts = [...parts.filter((x) => keep.has(x.key)).map((x, index) => ({ ...x, index })), rest];
    }
    const total = parts.reduce((s, x) => s + x.value, 0);
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 0 });
    const share = (v: number) => (total ? (v / total < 0.005 ? "<1%" : pct(v / total)) : "");
    const fill = (x: (typeof parts)[number]) => {
      const base = x.other ? t.context : ctx.color(x.key, x.index);
      return x.other || ctx.selected(x.key) ? base : alpha(base, 0.25);
    };

    const h = Math.min(ctx.height, thin ? HEIGHT.thin : HEIGHT.tall);
    const gap = parts.length > 1 ? 2 : 0;
    const usable = Math.max(0, ctx.width - gap * (parts.length - 1));
    const r = Math.min(t.radius, h / 2);
    let x = 0;
    const boxes = parts.map((part, i) => {
      const w = total ? (part.value / total) * usable : 0;
      const text = share(part.value);
      const box = { x, w, text, fits: !thin && w >= measureText(text, 12, t.fontFamily, 600) + 14, first: i === 0, last: i === parts.length - 1 };
      x += w + gap;
      return box;
    });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const b = boxes[i];
      if (!b) return null;
      const color = fill(parts[i]);
      const children: any[] = [
        {
          type: "rect",
          shape: { x: b.x, y: 0, width: Math.max(0, b.w), height: h, r: [b.first ? r : 0, b.last ? r : 0, b.last ? r : 0, b.first ? r : 0] },
          style: { fill: color, opacity: 1, enterFrom: { opacity: 0 } },
          enterAnimation: { duration: 300, delay: i * 70 },
        },
      ];
      if (b.fits) children.push({ type: "text", silent: true, style: { x: b.x + 8, y: h / 2 + 1, verticalAlign: "middle", text: b.text, fill: inkOn(color), fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily } });
      return { type: "group", children };
    };

    // The legend is this chart's labelling: block order, with the share wherever it is not printed in the bar.
    const legend: LegendItem[] = parts.map((part, i) => ({ name: boxes[i].fits ? part.name : `${part.name} ${boxes[i].text}`, color: fill(part), muted: !part.other && ctx.dimmed(part.key) }));
    const lead = [...parts].sort((a, b) => b.value - a.value)[0];

    return {
      legend,
      alt: `Segmented bar of ${p.value} by ${p.name}, total ${ctx.fmt(total)}. ${lead ? `Largest part: ${lead.name} with ${share(lead.value)}. ` : ""}In order: ${parts.map((x) => `${x.name} ${share(x.value)}`).join(", ")}.`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        // The plot is only as tall as the bar, so the tooltip must be free to leave it.
        tooltip: {
          trigger: "item",
          confine: false,
          appendToBody: true,
          formatter: (d: any) => {
            const part = parts[d.dataIndex];
            return part ? tooltipHtml(ctx, part.name, [{ name: p.value, value: ctx.fmt(part.value), color: fill(part) }, { name: "Share", value: share(part.value) }]) : "";
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "segments",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            renderItem: renderItem as any,
            data: parts.map((part) => ({ name: part.name, key: part.key, value: [part.value], other: part.other })),
          },
        ],
      },
    };
  },
});

/**
 * One whole as a single horizontal bar. The plot is exactly as tall as the bar (28px, or
 * 8px for `size="thin"`), so it drops into a card or a table cell without leaving a hole.
 */
export const SegmentedBar = Object.assign(
  forwardRef<ChartHandle, SegmentedBarProps & CommonChartProps>(function SegmentedBar(props, ref) {
    // The height follows `size`, which a pure option builder cannot decide, hence this thin wrapper.
    return <Inner ref={ref} {...props} height={props.height ?? HEIGHT[props.size === "thin" ? "thin" : "tall"]} />;
  }),
  { meta: Inner.meta, displayName: Inner.meta.component },
) as ChartComponent<SegmentedBarProps>;

export const examples = {
  "Thin, for cards": {
    data: [
      { device: "Mobile", sessions: 58200 },
      { device: "Desktop", sessions: 31400 },
      { device: "Tablet", sessions: 6100 },
    ],
    name: "device",
    value: "sessions",
    size: "thin",
    title: "Mobile accounted for 61% of sessions in the last 30 days",
    subtitle: "Sessions by device, last 30 days",
  },
  "With highlight": {
    theme: "sunrise",
    data: [
      { item: "Housing", spend: 33 },
      { item: "Transport", spend: 17 },
      { item: "Food", spend: 13 },
      { item: "Healthcare", spend: 8 },
      { item: "Everything else", spend: 29 },
    ],
    name: "item",
    value: "spend",
    highlight: "Housing",
    title: "Housing was 33% of US consumer spending in 2023",
    subtitle: "Share of annual consumer spending, United States, 2023",
    source: "BLS Consumer Expenditure Survey",
    note: "Figures are approximate, for illustration",
  },
  "Stress: many parts, long names, slivers": {
    theme: "mono",
    data: [
      { cause: "Cardiovascular diseases", deaths: 19.8 },
      { cause: "Cancers", deaths: 10.0 },
      { cause: "Chronic respiratory diseases", deaths: 4.0 },
      { cause: "Digestive diseases", deaths: 2.6 },
      { cause: "Lower respiratory infections", deaths: 2.2 },
      { cause: "Neonatal disorders", deaths: 1.8 },
      { cause: "Alzheimer's disease and other dementias", deaths: 1.8 },
      { cause: "Diabetes", deaths: 1.6 },
      { cause: "Diarrhoeal diseases", deaths: 1.2 },
      { cause: "Road injuries", deaths: 1.2 },
      { cause: "Malaria", deaths: 0.6 },
    ],
    name: "cause",
    value: "deaths",
    format: "{value}m",
    title: "Cardiovascular diseases cause 19.8 million deaths a year",
    subtitle: "Deaths by cause, world, millions per year",
    source: "IHME Global Burden of Disease",
    note: "Rounded, approximate figures for illustration",
  },
};
