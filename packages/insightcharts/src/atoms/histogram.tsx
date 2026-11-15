import { CustomChart } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { measureText } from "../core/layout";
import { labelStyle, morph, tooltipHtml, valueAxis } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";

export interface HistogramProps {
  /** Numeric field to bin. */
  value: string;
  /** Approximate number of bins. The width is rounded to a tidy step (1, 2, 2.5, 5 times a power of ten). */
  bins?: number;
  /** Exact bin width in value units. Overrides `bins`. */
  step?: number;
  /** Draw a vertical marker at the median. */
  median?: boolean;
  /** Draw a vertical marker at the mean. */
  mean?: boolean;
  /** Show each bin as a share of all rows instead of a count. */
  normalize?: boolean;
  /** Title for the count axis, e.g. "Runners". Defaults to "Count" or "Share". */
  countLabel?: string;
}

/**
 * The shape of one numeric variable: where values pile up, how wide they spread, whether
 * there is a second hump or a long tail. Bars touch because the axis is continuous.
 */
export const Histogram = defineChart<HistogramProps>({
  name: "histogram",
  title: "Histogram",
  category: "distribution",
  description: "Bins a numeric field and shows how many rows fall in each bin, as touching bars on a continuous axis.",
  whenToUse: "Showing the shape of a distribution for one numeric variable with roughly 50 rows or more: its centre, spread, skew, gaps and multiple peaks.",
  avoid: "Comparing distributions across several groups (use box-plot or beeswarm-chart); under about 50 rows, where every observation can be shown (use strip-plot or beeswarm-chart); counts by category (use bar-chart).",
  use: [CustomChart],
  defaults: {},
  props: [
    { name: "value", type: "string", required: true, description: "Numeric field to bin." },
    { name: "bins", type: "number", description: "Approximate number of bins; the width is rounded to a tidy step. Default: from the row count." },
    { name: "step", type: "number", description: "Exact bin width in value units. Overrides `bins`." },
    { name: "median", type: "boolean", default: "false", description: "Vertical marker at the median." },
    { name: "mean", type: "boolean", default: "false", description: "Vertical marker at the mean." },
    { name: "normalize", type: "boolean", default: "false", description: "Share of rows per bin instead of a count." },
    { name: "countLabel", type: "string", description: 'Title for the count axis, e.g. "Runners".' },
  ],
  example: {
    type: "histogram",
    theme: "earth",
    data: [14, 18, 18, 19, 20, 21, 21, 22, 23, 23, 23, 23, 24, 25, 25, 27, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 31, 31, 31, 31, 32, 32, 32, 32, 32, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 35, 35, 35, 36, 36, 36, 37, 37, 37, 38, 38, 40, 40, 40, 40, 41, 41, 42, 42, 42, 43, 45, 45, 46, 47, 47, 48, 48, 49, 49, 51, 51, 54, 54, 55, 57, 57, 59, 59, 61, 66].map((minutes) => ({ minutes })),
    value: "minutes",
    step: 5,
    median: true,
    countLabel: "Commuters",
    format: "{value} min",
    title: "The median commute of 90 surveyed employees was 34.5 minutes",
    subtitle: "One-way commute time, in 5-minute bins",
    note: "Illustrative data",
  },
  markCount: () => 60,
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const values = ctx.rows.map((r) => toNumber(r[p.value])).filter((v) => !Number.isNaN(v));
    const n = values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const min = n ? sorted[0] : 0;
    const max = n ? sorted[n - 1] : 1;
    const target = p.bins ?? Math.min(40, Math.max(8, Math.ceil(Math.sqrt(n))));
    const step = p.step && p.step > 0 ? p.step : niceStep((max - min || 1) / target);
    const start = Math.floor(min / step + 1e-9) * step;
    // The top edge is closed, so a maximum sitting exactly on an edge joins the last bin.
    const count = Math.max(1, Math.ceil((max - start) / step - 1e-9));
    const counts = new Array<number>(count).fill(0);
    for (const v of values) counts[Math.min(count - 1, Math.max(0, Math.floor((v - start) / step + 1e-9)))]++;
    const end = start + count * step;
    const edge = (i: number) => Math.round((start + i * step) * 1e9) / 1e9;
    const share = ctx.formatter("percent");
    const height = (c: number) => (p.normalize ? (n ? c / n : 0) : c);
    const fy = p.normalize ? share : ctx.formatter("auto");

    const mean = n ? values.reduce((s, v) => s + v, 0) / n : 0;
    const median = n ? (n % 2 ? sorted[n >> 1] : (sorted[(n >> 1) - 1] + sorted[n >> 1]) / 2) : 0;
    const color = ctx.color();

    // Label every k-th edge so ticks stay about 60px apart.
    const plotW = Math.max(120, ctx.width - 56);
    const every = Math.max(1, Math.ceil(count / Math.max(2, Math.floor(plotW / 64))));

    const markers: Record<string, any>[] = [];
    const text = (name: string, v: number) => `${name} ${fmt(Math.round(v * 10) / 10)}`;
    const marker = (name: string, v: number, dashed: boolean, align: "left" | "right" | "center", distance = 6) =>
      markers.push({
        xAxis: v,
        lineStyle: { color: t.ink, width: 1.5, type: dashed ? [4, 3] : "solid" },
        label: { show: true, formatter: text(name, v), position: "end", align, distance, ...labelStyle(ctx, { color: t.ink, fontWeight: 600 }) },
      });
    let stackedLabels = false;
    if (n && p.median && p.mean) {
      // Side by side the two labels would collide, so each hangs away from the other. If the
      // left-hand one would run off the plot, both hang right instead, on two rows.
      const first = median <= mean ? { name: "Median", v: median, dashed: false } : { name: "Mean", v: mean, dashed: true };
      const second = median <= mean ? { name: "Mean", v: mean, dashed: true } : { name: "Median", v: median, dashed: false };
      const room = ((first.v - start) / (end - start)) * plotW + 40;
      stackedLabels = room < measureText(text(first.name, first.v), t.fontSize, t.fontFamily, 600) + 8;
      marker(first.name, first.v, first.dashed, stackedLabels ? "left" : "right", stackedLabels ? 20 : 6);
      marker(second.name, second.v, second.dashed, "left");
    } else if (n && p.median) marker("Median", median, false, "center");
    else if (n && p.mean) marker("Mean", mean, true, "center");

    const peak = counts.reduce((b, c, i) => (c > counts[b] ? i : b), 0);
    const skew = n > 2 && Math.abs(mean - median) > step * 0.4 ? (mean > median ? " The distribution has a longer right tail." : " The distribution has a longer left tail.") : "";
    const alt = n
      ? `Histogram of ${p.value}: ${n} values from ${fmt(min)} to ${fmt(max)} in ${count} bins of ${fmt(step)}. The most common range is ${fmt(edge(peak))} to ${fmt(edge(peak + 1))} (${p.normalize ? share(counts[peak] / n) : counts[peak]}). Median ${fmt(Math.round(median * 10) / 10)}, mean ${fmt(Math.round(mean * 10) / 10)}.${skew}`
      : `Histogram of ${p.value}: no numeric values.`;

    return {
      alt,
      option: {
        // Marker labels sit between the count-axis title and the plot.
        grid: { top: stackedLabels ? 50 : markers.length ? 36 : 26, right: 16 },
        xAxis: valueAxis(ctx, {
          min: start,
          max: end,
          interval: step * every,
          splitLine: { show: false },
          axisLine: { show: true, lineStyle: { color: t.axis, width: 1 } },
          axisLabel: { formatter: (v: number) => fmt(Math.round(v * 1e9) / 1e9), hideOverlap: true, showMinLabel: true, showMaxLabel: count % every === 0 },
        }),
        yAxis: valueAxis(ctx, { min: 0, minInterval: p.normalize ? undefined : 1, axisLabel: { formatter: (v: number) => fy(v) } }),
        graphic: [{ type: "text", left: 4, top: 2, silent: true, style: { text: p.countLabel ?? (p.normalize ? "Share" : "Count"), fill: t.muted, font: `${t.fontSize}px ${t.fontFamily}` } }],
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (!Array.isArray(d.value)) return "";
            const c = counts[d.dataIndex];
            return tooltipHtml(ctx, `${fmt(d.value[0])} to ${fmt(d.value[1])}`, [
              { name: p.countLabel ?? "Count", value: ctx.formatter("auto")(c), color },
              { name: "Share", value: share(n ? c / n : 0) },
            ]);
          },
        },
        series: [
          {
            id: "bins",
            name: p.value,
            type: "custom" as const,
            ...morph,
            dimensions: ["from", "to", "count"],
            encode: { x: [0, 1], y: 2, tooltip: [0, 1, 2] },
            clip: true,
            renderItem: (_params: any, api: any) => {
              const a = api.coord([api.value(0), api.value(2)]);
              const b = api.coord([api.value(1), 0]);
              const w = b[0] - a[0];
              // Bars touch; a hairline of surface keeps neighbouring bins countable.
              const gap = w >= 5 ? 1 : 0;
              const r = w >= 10 ? Math.min(t.radius, 3) : 0;
              return {
                type: "rect",
                shape: { x: a[0] + gap / 2, y: a[1], width: Math.max(0.5, w - gap), height: Math.max(0, b[1] - a[1]), r: [r, r, 0, 0] },
                style: { fill: color },
                emphasis: { style: { fill: alpha(color, 0.8) } },
              };
            },
            markLine: markers.length ? { silent: true, symbol: "none", animation: ctx.animate, data: markers } : undefined,
            data: counts.map((c, i) => ({ name: `${fmt(edge(i))} to ${fmt(edge(i + 1))}`, value: [edge(i), edge(i + 1), height(c)] })),
          },
        ],
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

// Finish times with the familiar pile-up of runners pacing to beat a round-number goal.
function marathon() {
  const rnd = seeded(3);
  return Array.from({ length: 1200 }, () => {
    let m = 262 + normal(rnd) * 38 + (rnd() < 0.2 ? 45 * rnd() : 0);
    if (m > 240 && m < 252 && rnd() < 0.55) m = 240 - rnd() * 9;
    return { minutes: Math.round(Math.max(135, m)) };
  });
}

const incomes = (() => {
  const rnd = seeded(19);
  return Array.from({ length: 3000 }, () => ({ income: Math.round(Math.exp(10.45 + normal(rnd) * 0.62) / 100) * 100 })).filter((r) => r.income < 200000);
})();

const eruptions = (() => {
  const rnd = seeded(8);
  return Array.from({ length: 272 }, () => ({ wait: Math.round(rnd() < 0.36 ? 54 + normal(rnd) * 6 : 80 + normal(rnd) * 6) }));
})();

export const examples = {
  "Large sample, 10-minute bins": {
    data: marathon(),
    value: "minutes",
    step: 10,
    median: true,
    countLabel: "Finishers",
    format: "{value} min",
    title: "Finish times of 1,200 marathon runners",
    subtitle: "Minutes, in 10-minute bins. The line marks the median.",
    note: "Illustrative data",
  },
  "Skewed, with mean and median": {
    theme: "mono",
    data: incomes,
    value: "income",
    step: 10000,
    mean: true,
    median: true,
    normalize: true,
    format: "currency:USD",
    countLabel: "Share of households",
    title: "Household income distribution",
    subtitle: "Share of households in each $10,000 bin, with the mean and the median marked",
    note: "Illustrative data",
  },
  "Two peaks": {
    theme: "magenta",
    data: eruptions,
    value: "wait",
    bins: 20,
    countLabel: "Eruptions",
    format: "{value} min",
    annotations: [{ type: "band", axis: "x", from: 62, to: 70, label: "Rarely" }],
    title: "Waiting time between Old Faithful eruptions",
    subtitle: "Minutes between eruptions, 272 observations",
    note: "Illustrative data modelled on the Old Faithful geyser dataset",
  },
  "Stress: few rows, many bins": {
    theme: "ledger",
    data: [2, 3, 3, 4, 4, 4, 5, 5, 6, 7, 7, 9, 12, 18, 31].map((days) => ({ days })),
    value: "days",
    step: 1,
    median: true,
    countLabel: "Tickets",
    format: "{value}d",
    title: "11 of 15 support tickets closed within 7 days",
    subtitle: "Days to resolution, 15 support tickets",
    note: "Illustrative data",
  },
};
