import { CustomChart, ScatterChart as EScatter } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { categoryAxis, morph, tooltipHtml, valueAxis } from "../core/parts";
import { toNumber } from "../data/transform";

export interface BoxPlotProps {
  /** Numeric field to summarise. Pass raw rows; quartiles are computed here. */
  value: string;
  /** Category field: one box per distinct value. Omit for a single box. */
  group?: string;
  /** Field naming each row, shown when hovering an outlier. */
  label?: string;
  /** Horizontal boxes (default) leave room for long category names; vertical suits ordered categories such as years. */
  orientation?: "horizontal" | "vertical";
  /** Whisker rule: `"tukey"` reaches the furthest point within 1.5 times the interquartile range and draws the rest as outlier dots; `"minmax"` reaches the extremes. */
  whiskers?: "tukey" | "minmax";
  /** Order boxes by median. Default: data order. */
  sort?: "none" | "asc" | "desc";
}

interface Stats {
  group: string;
  n: number;
  low: number;
  q1: number;
  median: number;
  q3: number;
  high: number;
  outliers: { v: number; name: string }[];
}

// Linear-interpolated quantile of sorted values (the common "type 7" definition).
function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const i = Math.floor(pos);
  const next = sorted[Math.min(sorted.length - 1, i + 1)];
  return sorted[i] + (next - sorted[i]) * (pos - i);
}

/**
 * Five-number summaries side by side. The box is the middle half of the data, the gap in
 * it is the median, the whiskers reach the bulk of the rest and stray points are dots.
 */
export const BoxPlot = defineChart<BoxPlotProps>({
  name: "box-plot",
  title: "Box plot",
  category: "distribution",
  description: "Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.",
  whenToUse: "Comparing the centre and spread of a numeric value across several groups, especially with many rows per group and an audience comfortable with quartiles.",
  avoid: "A general audience or fewer than about 20 rows per group (use strip-plot or beeswarm-chart, which show the observations themselves); one group whose shape matters, such as two peaks, which a box hides (use histogram).",
  use: [CustomChart, EScatter],
  defaults: { orientation: "horizontal", whiskers: "tukey" },
  selectField: (p) => p.group,
  selectValue: (params) => params.name,
  props: [
    { name: "value", type: "string", required: true, description: "Numeric field to summarise. Pass raw rows; quartiles are computed in the chart." },
    { name: "group", type: "string", description: "Category field: one box per distinct value. Omit for a single box." },
    { name: "label", type: "string", description: "Field naming each row, shown when hovering an outlier." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Horizontal leaves room for long names; vertical suits ordered categories." },
    { name: "whiskers", type: '"tukey" | "minmax"', default: '"tukey"', description: "`tukey`: furthest point within 1.5 × IQR, the rest drawn as outliers. `minmax`: the extremes." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order boxes by median." },
  ],
  example: {
    type: "box-plot",
    data: [
      ["Emergency", [12, 18, 22, 25, 27, 31, 34, 38, 41, 44, 47, 52, 58, 63, 71, 84, 96, 131, 188]],
      ["Orthopaedics", [9, 11, 14, 15, 17, 19, 20, 22, 24, 25, 27, 29, 31, 34, 38, 43, 55]],
      ["Cardiology", [6, 8, 9, 11, 12, 13, 15, 16, 17, 18, 20, 21, 23, 26, 28, 33, 61]],
      ["Paediatrics", [4, 5, 7, 8, 9, 10, 11, 12, 12, 13, 14, 16, 17, 19, 22, 24]],
      ["Dermatology", [3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 13, 15, 18, 35]],
    ].flatMap(([department, waits]) => (waits as number[]).map((minutes) => ({ department, minutes }))),
    value: "minutes",
    group: "department",
    highlight: "Emergency",
    format: "{value} min",
    title: "The median emergency wait was 44 minutes",
    subtitle: "Minutes from arrival to being seen, sampled visits by department",
    note: "Illustrative data. Box: middle half of visits; line: median; whiskers: within 1.5 × IQR; dots: outliers.",
  },
  markCount: () => 200,
  // Horizontal boxes are rows: a few sit together, many grow the chart.
  height: (p, rows) => {
    if (p.orientation === "vertical") return undefined;
    const n = p.group ? new Set(rows.map((r) => String(r[p.group!] ?? ""))).size : 1;
    return Math.max(120, n * (n <= 8 ? 44 : 34) + 48);
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const horizontal = p.orientation !== "vertical";
    const single = "All";

    const byGroup = new Map<string, { v: number; name: string }[]>();
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (Number.isNaN(v)) continue;
      const g = p.group ? String(r[p.group] ?? "") : single;
      let list = byGroup.get(g);
      if (!list) byGroup.set(g, (list = []));
      list.push({ v, name: p.label ? String(r[p.label] ?? "") : "" });
    }
    let stats: Stats[] = [...byGroup.entries()].map(([group, list]) => {
      const s = [...list].sort((a, b) => a.v - b.v);
      const vals = s.map((d) => d.v);
      const q1 = quantile(vals, 0.25);
      const q3 = quantile(vals, 0.75);
      const fence = p.whiskers === "minmax" ? Infinity : 1.5 * (q3 - q1);
      const inside = s.filter((d) => d.v >= q1 - fence && d.v <= q3 + fence);
      return { group, n: s.length, q1, q3, median: quantile(vals, 0.5), low: Math.min(q1, inside[0].v), high: Math.max(q3, inside[inside.length - 1].v), outliers: s.filter((d) => d.v < q1 - fence || d.v > q3 + fence) };
    });
    if (p.sort === "asc" || p.sort === "desc") stats = [...stats].sort((a, b) => (p.sort === "asc" ? a.median - b.median : b.median - a.median));
    const names = stats.map((s) => s.group);
    const index = new Map(names.map((g, i) => [g, i]));

    const anyHighlight = ctx.dimmed("\u0000");
    const colorOf = (g: string) => (anyHighlight ? ctx.color(g) : ctx.color());
    const fade = (g: string) => (ctx.selected(g) ? 1 : 0.25);
    const whisker = (g: string) => alpha(anyHighlight && ctx.dimmed(g) ? t.context : t.inkSecondary, fade(g));

    const box = {
      id: "boxes",
      name: p.value,
      type: "custom" as const,
      ...morph,
      dimensions: ["i", "low", "q1", "median", "q3", "high"],
      encode: horizontal ? { y: 0, x: [1, 2, 3, 4, 5], tooltip: [1, 2, 3, 4, 5] } : { x: 0, y: [1, 2, 3, 4, 5], tooltip: [1, 2, 3, 4, 5] },
      z: 2,
      renderItem: (_params: any, api: any) => {
        const i = api.value(0) as number;
        const g = names[i];
        // Position along the value axis, and the centre of this box's band on the other.
        const along = (v: number) => (horizontal ? api.coord([v, i])[0] : api.coord([i, v])[1]);
        const centre = horizontal ? api.coord([0, i])[1] : api.coord([i, 0])[0];
        const band = horizontal ? api.size([0, 1])[1] : api.size([1, 0])[0];
        const w = Math.max(6, Math.min(24, band * 0.55));
        const [low, q1, med, q3, high] = [1, 2, 3, 4, 5].map((d) => along(api.value(d) as number));
        const fill = alpha(colorOf(g), fade(g));
        const stroke = whisker(g);
        const line = (a: number, a2: number, b: number, b2: number, style: Record<string, unknown>) => ({ type: "line", shape: horizontal ? { x1: a, x2: a2, y1: b, y2: b2 } : { x1: b, x2: b2, y1: a, y2: a2 }, style });
        const lo = Math.min(q1, q3);
        const len = Math.abs(q3 - q1);
        const cap = w * 0.5;
        return {
          type: "group",
          children: [
            line(low, high, centre, centre, { stroke, lineWidth: 1.5 }),
            line(low, low, centre - cap / 2, centre + cap / 2, { stroke, lineWidth: 1.5 }),
            line(high, high, centre - cap / 2, centre + cap / 2, { stroke, lineWidth: 1.5 }),
            { type: "rect", shape: horizontal ? { x: lo, y: centre - w / 2, width: Math.max(1, len), height: w, r: 2 } : { x: centre - w / 2, y: lo, width: w, height: Math.max(1, len), r: 2 }, style: { fill } },
            // The median is a surface-coloured cut through the box, so it reads on any fill.
            line(med, med, centre - w / 2, centre + w / 2, { stroke: t.surface, lineWidth: 2.5 }),
          ],
        };
      },
      data: stats.map((s, i) => ({ name: s.group, value: [i, s.low, s.q1, s.median, s.q3, s.high] })),
    };

    const outliers = {
      id: "outliers",
      name: "Outliers",
      type: "scatter" as const,
      ...morph,
      z: 3,
      symbolSize: 6,
      emphasis: { scale: 1.4 },
      data: stats.flatMap((s) => {
        const i = index.get(s.group)!;
        const c = anyHighlight && ctx.dimmed(s.group) ? t.context : colorOf(s.group);
        return s.outliers.map((o) => ({ name: s.group, label: o.name, value: horizontal ? [o.v, i] : [i, o.v], itemStyle: { color: t.surface, borderColor: alpha(c, fade(s.group)), borderWidth: 1.5 } }));
      }),
    };

    const valueAx = valueAxis(ctx, { scale: true, splitNumber: ctx.compact ? 2 : 5, axisLabel: { formatter: (v: number) => fmt(v), hideOverlap: true } });
    const catAx = horizontal
      ? categoryAxis(ctx, { data: names, inverse: true, show: !!p.group, axisLine: { show: false }, axisLabel: { color: t.inkSecondary, hideOverlap: false, width: ctx.compact ? 96 : 180, overflow: "truncate" } })
      : categoryAxis(ctx, { data: names, show: !!p.group });

    const round = (v: number) => fmt(Math.round(v * 10) / 10);
    const ranked = [...stats].sort((a, b) => b.median - a.median);
    const widest = [...stats].sort((a, b) => b.q3 - b.q1 - (a.q3 - a.q1))[0];
    const alt = stats.length
      ? `Box plot of ${p.value}${p.group ? ` by ${p.group}, ${stats.length} groups` : ""}. ${
          stats.length > 1
            ? `Highest median: ${ranked[0].group} (${round(ranked[0].median)}). Lowest: ${ranked[ranked.length - 1].group} (${round(ranked[ranked.length - 1].median)}). Widest middle half: ${widest.group} (${round(widest.q1)} to ${round(widest.q3)}).`
            : `Median ${round(stats[0].median)}; the middle half spans ${round(stats[0].q1)} to ${round(stats[0].q3)}; whiskers ${round(stats[0].low)} to ${round(stats[0].high)}.`
        }`
      : `Box plot of ${p.value}: no numeric values.`;

    return {
      alt,
      option: {
        grid: { top: 10, right: 18 },
        xAxis: horizontal ? valueAx : catAx,
        yAxis: horizontal ? catAx : valueAx,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (d.seriesId === "outliers") return tooltipHtml(ctx, d.data?.label || d.name, [{ name: p.value, value: fmt(d.value[horizontal ? 0 : 1]) }, ...(d.data?.label ? [{ name: p.group ?? "Group", value: d.name }] : [])]);
            const s = stats[d.dataIndex];
            if (!s) return "";
            return tooltipHtml(ctx, p.group ? s.group : p.value, [
              { name: "Upper whisker", value: round(s.high) },
              { name: "Upper quartile", value: round(s.q3) },
              { name: "Median", value: round(s.median), color: colorOf(s.group) },
              { name: "Lower quartile", value: round(s.q1) },
              { name: "Lower whisker", value: round(s.low) },
              { name: "Rows", value: String(s.n), muted: true },
            ]);
          },
        },
        series: [box, outliers],
      },
    };
  },
});

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(rnd: () => number) {
  return Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
}

const delivery = (() => {
  const rnd = seeded(23);
  const carriers: [string, number, number][] = [
    ["Northwind Express Parcel Service", 2.1, 0.35],
    ["Swift", 1.6, 0.3],
    ["Meridian Freight", 3.4, 0.5],
    ["Local courier", 1.2, 0.55],
    ["PostCo", 2.8, 0.4],
    ["Harbor Line", 4.2, 0.45],
  ];
  return carriers.flatMap(([carrier, mean, sd]) => Array.from({ length: 180 }, (_, i) => ({ parcel: `${carrier.split(" ")[0]}-${1000 + i}`, carrier, days: Math.round(Math.max(0.3, mean * Math.exp(normal(rnd) * sd)) * 10) / 10 })));
})();

const temps = (() => {
  const rnd = seeded(31);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.flatMap((month, m) => Array.from({ length: 30 }, () => ({ month, temp: Math.round((11.5 - 9.5 * Math.cos(((m - 0.5) / 12) * 2 * Math.PI) + normal(rnd) * 3.2) * 10) / 10 })));
})();

export const examples = {
  "Sorted, long labels, many outliers": {
    data: delivery,
    value: "days",
    group: "carrier",
    label: "parcel",
    sort: "asc",
    format: "{value}d",
    title: "Delivery time by carrier, 180 parcels each",
    subtitle: "Days from dispatch to delivery",
    note: "Illustrative data",
  },
  "Vertical, ordered categories": {
    data: temps,
    value: "temp",
    group: "month",
    orientation: "vertical",
    highlight: ["Jul", "Aug"],
    format: "{value}°",
    title: "Daily mean temperature by month",
    subtitle: "°C, 30 readings per month. July and August are highlighted.",
    note: "Illustrative data",
  },
  "Single box, min-max whiskers": {
    data: delivery.filter((d) => d.carrier === "Swift"),
    value: "days",
    whiskers: "minmax",
    format: "{value}d",
    height: 120,
    title: "Swift delivery times, 180 parcels",
    subtitle: "Days from dispatch to delivery, minimum to maximum",
    note: "Illustrative data",
  },
};
