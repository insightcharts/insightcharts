"use client";

import { PieChart as EPie } from "echarts/charts";
import { alpha, measureText, defineChart, type LegendItem, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface DonutChartProps {
  /** Category field: one slice per distinct value. */
  name: string;
  /** Value field. */
  value: string;
  /** Most slices to draw, including "Other". Smaller categories are folded into "Other". Default 5. */
  maxSlices?: number;
  /** Small label in the hole, e.g. "Total". Setting it (or `centerValue`) turns the centre text on. */
  centerLabel?: string;
  /** Big text in the hole. Default: the formatted total, when `centerLabel` is set. */
  centerValue?: string | number;
  /** Name of the folded slice. */
  otherLabel?: string;
  /** Display names for category keys. */
  names?: Record<string, string>;
}

/**
 * The restrained pie. Two to five slices, largest first from 12 o'clock, each labelled
 * with its name and share so no legend lookup is needed, and a hole that can carry the total.
 */
export const DonutChart = defineChart<DonutChartProps>({
  name: "donut-chart",
  title: "Donut chart",
  category: "part-to-whole",
  description: "Shows how 2 to 5 parts make up one whole, with each slice labelled by name and share.",
  whenToUse: "A simple composition with one dominant part, or one part the title is about, where the total itself is worth printing in the centre.",
  avoid: "More than 5 categories or parts of similar size that must be ranked (use bar-chart); a single figure (use big-number); composition compared across groups or time (use bar-chart with stack \"percent\"); a compact card (use segmented-bar).",
  use: [EPie],
  defaults: { maxSlices: 5, otherLabel: "Other", height: 300 },
  selectField: (p) => p.name,
  // The slice carries its row key: `names` may rename what is displayed, but the filter needs the data value.
  selectValue: (params) => (params.data?.other ? null : params.data?.key ?? params.name),
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one slice per distinct value." },
    { name: "value", type: "string", required: true, description: "Value field." },
    { name: "maxSlices", type: "number", default: "5", description: 'Most slices drawn, including "Other"; smaller categories are folded.' },
    { name: "centerLabel", type: "string", description: 'Small label in the hole, e.g. "Total". Turns the centre text on.' },
    { name: "centerValue", type: "string | number", description: "Big text in the hole. Default: the formatted total when `centerLabel` is set." },
    { name: "otherLabel", type: "string", default: '"Other"', description: "Name of the folded slice." },
    { name: "names", type: "Record<string, string>", description: "Display names for category keys." },
  ],
  example: {
    type: "donut-chart",
    theme: "paper",
    data: [
      { tenure: "Own outright", households: 8.8 },
      { tenure: "Own with a mortgage", households: 7.4 },
      { tenure: "Rent privately", households: 4.9 },
      { tenure: "Rent social housing", households: 4.1 },
    ],
    name: "tenure",
    value: "households",
    format: "{value}m",
    centerLabel: "households",
    highlight: "Rent privately",
    title: "4.9 million households in England rented privately in 2022-23",
    subtitle: "Households by tenure, England, 2022-23",
    source: "English Housing Survey",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const byKey = new Map<string, number>();
    for (const r of ctx.rows) {
      const v = toNumber(r[p.name] == null ? NaN : r[p.value]);
      if (!Number.isNaN(v) && v > 0) byKey.set(String(r[p.name]), (byKey.get(String(r[p.name])) ?? 0) + v);
    }
    // Colour follows first-seen order so an entity keeps its colour when the ranking changes.
    const all = [...byKey].map(([key, value], index) => ({ key, name: p.names?.[key] ?? key, value, index, other: false }));
    const sorted = [...all].sort((a, b) => b.value - a.value);
    const max = Math.max(2, Math.round(p.maxSlices ?? 5));
    let slices = sorted;
    if (sorted.length > max) {
      const folded = sorted.slice(max - 1);
      slices = [...sorted.slice(0, max - 1), { key: "__other", name: `${p.otherLabel ?? "Other"} (${folded.length})`, value: folded.reduce((s, c) => s + c.value, 0), index: -1, other: true }];
    }
    const total = slices.reduce((s, c) => s + c.value, 0);
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 0 });
    const share = (v: number) => (total ? (v / total < 0.005 ? "<1%" : pct(v / total)) : "");
    const fill = (s: (typeof slices)[number]) => {
      const base = s.other ? t.context : ctx.color(s.key, s.index);
      return s.other || ctx.selected(s.key) ? base : alpha(base, 0.25);
    };

    // Wide: labels sit outside on short leaders. Compact: no room beside the ring, so shares go to the legend.
    const direct = !ctx.compact;
    const half = Math.min(ctx.height / 2, ctx.width / 2);
    const outer = Math.max(40, direct ? Math.min(ctx.height / 2 - 34, ctx.width / 2 - 150) : half - 4);
    const inner = outer * 0.62;
    const showCentre = p.centerLabel != null || p.centerValue != null;
    const centreValue = p.centerValue != null ? (typeof p.centerValue === "number" ? ctx.fmt(p.centerValue) : p.centerValue) : ctx.fmt(total);
    const cx = ctx.width / 2;
    const cy = ctx.height / 2;
    // The largest size at which the centre value still fits inside the hole.
    const valueSize = Math.max(16, Math.min(34, Math.floor((34 * inner * 1.5) / Math.max(1, measureText(centreValue, 34, t.fontFamily, 700)))));

    const legend: LegendItem[] = direct ? [] : slices.map((s) => ({ name: `${s.name} ${share(s.value)}`, color: fill(s), muted: !s.other && ctx.dimmed(s.key) }));
    const lead = slices[0];

    return {
      legend,
      alt: `Donut chart of ${p.value} by ${p.name}, total ${ctx.fmt(total)}. ${lead ? `Largest: ${lead.name} with ${share(lead.value)}. ` : ""}${slices.slice(1).map((s) => `${s.name} ${share(s.value)}`).join(", ")}.`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          // The share row is dropped when the value already is the share.
          formatter: (d: any) => tooltipHtml(ctx, d.name, [{ name: p.value, value: ctx.fmt(d.value), color: d.color }, ...(ctx.fmt(d.value) === share(d.value) ? [] : [{ name: "Share", value: share(d.value) }])]),
        },
        graphic: showCentre
          ? [
              { type: "text", silent: true, style: { x: cx, y: cy + (p.centerLabel ? 2 : valueSize * 0.45), text: centreValue, align: "center", verticalAlign: "bottom", fill: t.ink, fontSize: valueSize, fontWeight: 700, fontFamily: t.fontFamily } },
              ...(p.centerLabel ? [{ type: "text", silent: true, style: { x: cx, y: cy + 6, text: p.centerLabel, align: "center", verticalAlign: "top", fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, width: inner * 1.6, overflow: "truncate" } }] : []),
            ]
          : undefined,
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "donut",
            type: "pie" as const,
            ...morph,
            center: [cx, cy],
            radius: [inner, outer],
            startAngle: 90,
            clockwise: true,
            // Already ordered: largest first from 12 o'clock, "Other" last.
            sort: false as any,
            avoidLabelOverlap: true,
            // The surface-coloured gap that separates touching slices.
            itemStyle: { borderColor: t.surface, borderWidth: 2, borderRadius: 2 },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { scale: true, scaleSize: 4, focus: p.select ? ("none" as const) : ("self" as const) },
            label: {
              show: direct,
              position: "outside" as const,
              // Share first; the value follows only when it says something the share does not.
              formatter: (d: any) => `{n|${d.name}}\n{s|${share(d.value)}${ctx.fmt(d.value) === share(d.value) ? "" : `  ·  ${ctx.fmt(d.value)}`}}`,
              width: Math.max(80, Math.min(260, ctx.width / 2 - outer - 44)),
              distanceToLabelLine: 6,
              overflow: "truncate" as const,
              lineHeight: 17,
              rich: {
                n: { color: t.ink, fontSize: 13, fontWeight: 600, fontFamily: t.fontFamily, lineHeight: 17 },
                s: { color: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily, lineHeight: 17 },
              },
            },
            labelLine: { show: direct, length: 14, length2: 14, lineStyle: { color: t.axis, width: 1 } },
            labelLayout: { hideOverlap: true },
            data: slices.map((s) => ({ name: s.name, key: s.key, value: s.value, other: s.other, itemStyle: { color: fill(s) }, label: !s.other && ctx.dimmed(s.key) ? { rich: { n: { color: t.inkSecondary, fontWeight: 400 } } } : undefined })),
          },
        ],
      },
    };
  },
});
