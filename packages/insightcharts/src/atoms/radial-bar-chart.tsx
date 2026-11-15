import { BarChart as EBar, CustomChart as ECustom } from "echarts/charts";
import { PolarComponent } from "echarts/components";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { measureText } from "../core/layout";
import type { LegendItem } from "../core/figure";
import { hiddenAxis, morph, tooltipHtml } from "../core/parts";
import { describeExtremes, shapeSeries } from "../core/shape";

export interface RadialBarChartProps {
  /** The cyclical category field, in cycle order: hours of the day, weekdays, months. */
  x: string;
  /** Value field, or several to stack. */
  y: string | string[];
  /** Field that splits rows into stacked series, for long-format data. */
  series?: string;
  /** Label every nth category around the rim. Default: chosen so labels do not crowd (every 3rd hour for 24 hours). */
  labelEvery?: number;
  /** Print the value on the tallest bar. Default true for a single series. */
  labels?: boolean;
  /** Centre the first category on 12 o'clock instead of starting its band there. Right for compass directions; wrong for hours, where 00:00 begins at the top. */
  centerFirst?: boolean;
  /** Text in the centre of the ring, e.g. "24 hours". */
  centerLabel?: string;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

/**
 * Bars around a clock face. The first category sits at 12 o'clock and the cycle runs
 * clockwise, so the end of the data meets its beginning, which a straight bar
 * chart cannot show. The hole keeps the innermost bars from collapsing into slivers.
 */
export const RadialBarChart = defineChart<RadialBarChartProps>({
  name: "radial-bar-chart",
  title: "Radial bar chart",
  category: "trend",
  description: "Draws bars around a circle for data that repeats in a cycle, such as hours of the day or months of the year.",
  whenToUse: "Only when the dimension is cyclical and the wrap-around matters: activity by hour of day, seasonality by month, wind by compass direction. The first category is placed at 12 o'clock.",
  avoid: "Any dimension that does not wrap around: categories, rankings, years (use bar-chart); precise comparison of values, since bars further out look bigger (use bar-chart or line-chart); more than about 3 stacked series.",
  use: [EBar, ECustom, PolarComponent],
  defaults: { height: 380 },
  selectField: (p) => p.x,
  props: [
    { name: "x", type: "string", required: true, description: "The cyclical category field, in cycle order." },
    { name: "y", type: "string | string[]", required: true, description: "Value field, or several to stack." },
    { name: "series", type: "string", description: "Field that splits rows into stacked series (long data)." },
    { name: "labelEvery", type: "number", description: "Label every nth category around the rim. Default: chosen to avoid crowding." },
    { name: "labels", type: "boolean", description: "Print the value on the tallest bar. Default: on for a single series." },
    { name: "centerFirst", type: "boolean", default: "false", description: "Centre the first category on 12 o'clock (compass directions) instead of starting its band there (hours)." },
    { name: "centerLabel", type: "string", description: 'Text in the centre of the ring, e.g. "24 hours".' },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    theme: "dusk",
    type: "radial-bar-chart",
    data: [2.1, 1.2, 0.8, 0.6, 0.7, 1.4, 3.6, 6.9, 8.8, 6.4, 5.1, 5.3, 5.9, 5.6, 5.4, 6.0, 7.4, 9.2, 8.1, 6.0, 4.6, 3.9, 3.3, 2.7].map((trips, h) => ({ hour: `${String(h).padStart(2, "0")}:00`, trips })),
    x: "hour",
    y: "trips",
    format: "{value}%",
    centerLabel: "24 hours",
    highlight: ["08:00", "17:00"],
    title: "Weekday bike-share trips peak at 9.2% in the 5pm hour and 8.8% in the 8am hour",
    subtitle: "Share of daily bike-share trips starting in each hour, weekdays",
    source: "Illustrative bike-share data",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const single = shaped.series.length === 1;
    const n = shaped.labels.length;
    const totals = shaped.labels.map((_, i) => shaped.series.reduce((s, sr) => s + Math.max(0, sr.values[i] ?? 0), 0));
    const peak = totals.reduce((a, v, i) => (v > totals[a] ? i : a), 0);
    const showPeak = p.labels ?? single;

    // Rim labels: thin them so neighbours never touch. Short labels can sit closer together.
    const longest = Math.max(...shaped.labels.map((l) => measureText(l, t.fontSize, t.fontFamily)), 6);
    // Long rim labels are trimmed rather than allowed to squeeze the ring.
    const rim = Math.min(longest, ctx.compact ? 58 : 130);
    const outer = Math.max(40, Math.min(ctx.width / 2 - (rim + 14), ctx.height / 2 - 24));
    const arc = (2 * Math.PI * (outer + 12)) / Math.max(1, n);
    const every = Math.max(1, p.labelEvery ?? [1, 2, 3, 4, 6, 12].find((k) => n % k === 0 && arc * k >= Math.min(longest, 44) + 26) ?? Math.ceil((longest + 10) / arc));
    const inner = outer * 0.3;
    const cx = ctx.width / 2;
    const cy = ctx.height / 2;
    // Leave a ring of air beyond the tallest bar when it is labelled, so the label never meets the rim.
    const top = Math.max(...totals, 0) || 1;
    const axisMax = showPeak ? top * 1.14 : top;
    // The peak label is drawn upright at the tip of its bar. ECharts would rotate it along the bar.
    const offset = p.centerFirst ? 0 : 0.5;
    const theta = Math.PI / 2 - ((peak + offset) / Math.max(1, n)) * 2 * Math.PI;
    const tip = inner + (outer - inner) * (top / axisMax) + 11;
    const peakLabel = showPeak && n ? { type: "text", silent: true, z: 10, style: { x: cx + Math.cos(theta) * tip, y: cy - Math.sin(theta) * tip, text: ctx.fmt(totals[peak]), align: "center", verticalAlign: "middle", fill: t.ink, fontSize: 12, fontWeight: 700, fontFamily: t.fontFamily, stroke: t.surface, lineWidth: 3 } } : null;

    const series = shaped.series.map((s, si) => {
      const color = single ? undefined : ctx.color(s.key, si);
      return {
        id: s.key,
        name: s.name,
        type: "bar" as const,
        coordinateSystem: "polar" as const,
        stack: single ? undefined : "total",
        ...morph,
        barCategoryGap: n > 16 ? "14%" : "10%",
        // With `select` on, a click rebuilds the option under the pointer and series focus would leave the others blurred.
        emphasis: { focus: single || p.select ? ("none" as const) : ("series" as const) },
        // The surface-coloured gap that separates stacked wedges.
        itemStyle: { borderRadius: single ? [0, Math.min(t.radius, 3)] : 0, ...(single ? null : { borderColor: t.surface, borderWidth: 1 }) },
        data: shaped.labels.map((label, i) => {
          const fill = color ?? ctx.color(label);
          return { name: label, value: Math.max(0, s.values[i] ?? 0), itemStyle: { color: ctx.selected(label) ? fill : alpha(fill, 0.25) } };
        }),
      };
    });

    const sink = !!p.annotations?.length;
    const legend: LegendItem[] = single ? [] : shaped.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), muted: ctx.dimmed(s.key) }));
    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;

    return {
      legend,
      alt: `Radial bar chart of ${yName} around the cycle of ${p.x}, ${shaped.labels[0]} to ${shaped.labels[n - 1]}, starting at 12 o'clock and running clockwise. ${describeExtremes(shaped.labels, totals, ctx.fmt)}`,
      option: {
        polar: { center: [cx, cy], radius: [inner, outer] },
        angleAxis: {
          type: "category" as const,
          data: shaped.labels,
          startAngle: 90 + (p.centerFirst ? 180 / Math.max(1, n) : 0),
          clockwise: true,
          axisLine: { show: true, lineStyle: { color: t.axis, width: 1 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { color: t.muted, fontSize: t.fontSize, fontFamily: t.fontFamily, margin: 8, width: Math.max(48, rim + 14), overflow: "truncate" as const, interval: (i: number) => i % every === 0 },
        },
        radiusAxis: {
          type: "value" as const,
          min: 0,
          max: axisMax,
          splitNumber: 3,
          axisLine: { show: false },
          axisTick: { show: false },
          // Ring values would collide with the first bars; the peak label and tooltip carry the scale instead.
          axisLabel: { show: !showPeak, color: t.muted, fontSize: 11, fontFamily: t.fontFamily, formatter: (v: number) => (v === 0 || v >= top ? "" : ctx.fmt(v)) },
          splitLine: { show: true, lineStyle: { color: t.grid, width: 1 } },
          z: 0,
        },
        graphic: [...(peakLabel ? [peakLabel] : []), ...(p.centerLabel ? [{ type: "text", silent: true, style: { x: cx, y: cy, text: p.centerLabel, align: "center", verticalAlign: "middle", fill: t.muted, fontSize: Math.max(10, Math.min(12, inner / 3.2)), fontFamily: t.fontFamily, width: inner * 1.7, overflow: "break" } }] : [])],
        tooltip: {
          trigger: "item",
          formatter: (d: any) => tooltipHtml(ctx, d.name, single ? [{ name: yName, value: ctx.fmt(d.value), color: d.color }] : [{ name: d.seriesName, value: ctx.fmt(d.value), color: d.color }, { name: "Total", value: ctx.fmt(totals[d.dataIndex]) }]),
        },
        // Annotations are cartesian and core attaches them to the first series; on a polar series
        // ECharts throws. An empty series on a 1px grid parked off-canvas takes them instead.
        ...(sink ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" }, xAxis: hiddenAxis("value"), yAxis: hiddenAxis("value") } : null),
        series: sink ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }, ...series] : series,
      },
    };
  },
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const examples = {
  "Months": {
    theme: { accent: "#0f766e" },
    data: [48, 41, 38, 52, 71, 96, 118, 112, 84, 63, 55, 51].map((mm, i) => ({ month: MONTHS[i], mm })),
    x: "month",
    y: "mm",
    format: "{value} mm",
    centerLabel: "Year",
    title: "Munich averages 118 mm of rain in July and 38 mm in March",
    subtitle: "Average monthly rainfall, Munich, 1991-2020",
    source: "Deutscher Wetterdienst",
    note: "Rounded, approximate figures for illustration",
  },
  "Stacked series": {
    theme: "earth",
    data: [38, 26, 18, 14, 17, 34, 82, 141, 163, 128, 117, 124, 133, 126, 121, 132, 151, 172, 149, 118, 96, 81, 66, 51].map((weekday, h) => ({ hour: String(h), weekday, weekend: Math.round(18 + 70 * Math.exp(-((h - 14) ** 2) / 22)) })),
    x: "hour",
    y: ["weekday", "weekend"],
    names: { weekday: "Weekdays", weekend: "Weekends" },
    centerLabel: "Hour of day",
    title: "Weekday emergency calls peak at 172 per hour at 5pm",
    subtitle: "Average emergency calls per hour by hour of day, weekdays and weekends",
    source: "Illustrative data",
  },
  "Stress: long labels, compass": {
    theme: "science",
    data: [
      ["North", 6], ["North-north-east", 4], ["North-east", 5], ["East-north-east", 3], ["East", 4], ["East-south-east", 3], ["South-east", 5], ["South-south-east", 6],
      ["South", 9], ["South-south-west", 13], ["South-west", 16], ["West-south-west", 11], ["West", 7], ["West-north-west", 4], ["North-west", 2], ["North-north-west", 2],
    ].map(([direction, share]) => ({ direction, share })),
    x: "direction",
    y: "share",
    format: "{value}%",
    centerFirst: true,
    height: 420,
    title: "The wind at Heathrow blows from the south-west 16% of the time",
    subtitle: "Share of hours by wind direction, Heathrow, annual average",
    source: "Illustrative data based on Met Office wind roses",
  },
};
