import { LineChart as ELine } from "echarts/charts";
import { alpha, inkOn } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { formatDate } from "../core/format";
import { measureText } from "../core/layout";
import { categoryAxis, hiddenAxis, labelStyle, morph, timeAxis, tooltipHtml, valueAxis } from "../core/parts";
import { shapeSeries } from "../core/shape";
import { fitAnnotations } from "./_annotations";
import { niceStep } from "../data/transform";

export interface AreaChartProps {
  /** Time or ordered category field. */
  x: string;
  /** Value field, or several (one area each). */
  y: string | string[];
  /** Field that splits rows into areas, for long-format data. */
  series?: string;
  /** Stack the areas so the top edge is the total. `"percent"` normalises every x position to 100%. */
  stack?: boolean | "percent";
  /** Streamgraph: stack around a centred baseline. Shows how the mix ebbs and flows; totals are not readable. */
  stream?: boolean;
  /** Edge shape. Default `"linear"`, or `"smooth"` for a streamgraph. */
  curve?: "linear" | "smooth" | "step";
  /** Name each band inside itself where it is thick enough. Default: on when stacked. Bands that cannot hold a label fall back to the legend. */
  labels?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

/**
 * Filled areas from a zero baseline. A single series is a line over a light wash; stacks
 * are solid bands separated by a surface-coloured seam and named inside the band.
 */
export const AreaChart = defineChart<AreaChartProps>({
  name: "area-chart",
  title: "Area chart",
  category: "trend",
  description: "Shows a quantity over time as a filled area from zero: one series, stacked series, shares of 100%, or a streamgraph.",
  whenToUse: "A volume or cumulative quantity over time where the filled magnitude matters; stacked when the total and its composition both matter; percent when only the mix matters; stream for the changing mix of many series over a long period.",
  avoid: "Comparing the trajectories of several series against each other (use line-chart: only the bottom band of a stack has a flat baseline); a few time points (use bar-chart with stack); more than about 6 bands.",
  use: [ELine],
  defaults: {},
  selectField: (p) => p.series,
  selectValue: (params) => params.seriesId ?? params.seriesName,
  props: [
    { name: "x", type: "string", required: true, description: "Time or ordered category field. ISO dates are placed on a true time axis." },
    { name: "y", type: "string | string[]", required: true, description: "Value field, or several (one area each)." },
    { name: "series", type: "string", description: "Field that splits rows into areas (long data)." },
    { name: "stack", type: 'boolean | "percent"', default: "false", description: "Stack the areas; `percent` normalises every x position to 100%." },
    { name: "stream", type: "boolean", default: "false", description: "Streamgraph: stack around a centred baseline. The value axis is dropped because only band thickness is readable." },
    { name: "curve", type: '"linear" | "smooth" | "step"', default: '"linear"', description: "Edge shape. A streamgraph defaults to smooth." },
    { name: "labels", type: "boolean", description: "Name each band inside itself where it fits; the rest go to the legend. Default: on when stacked." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "area-chart",
    data: [
      { year: "2014", gw: 180 },
      { year: "2015", gw: 229 },
      { year: "2016", gw: 306 },
      { year: "2017", gw: 405 },
      { year: "2018", gw: 512 },
      { year: "2019", gw: 633 },
      { year: "2020", gw: 774 },
      { year: "2021", gw: 945 },
      { year: "2022", gw: 1177 },
      { year: "2023", gw: 1610 },
    ],
    x: "year",
    y: "gw",
    names: { gw: "Installed solar capacity" },
    format: "{value} GW",
    title: "World solar capacity rose from 180 GW in 2014 to 1,610 GW in 2023",
    subtitle: "Cumulative installed solar PV capacity, gigawatts",
    source: "IRENA, Renewable Capacity Statistics (rounded)",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const n = shaped.labels.length;
    const count = shaped.series.length;
    const single = count === 1;
    const stream = !!p.stream && !single;
    const stacked = (!!p.stack || stream) && !single;
    const percent = p.stack === "percent" && stacked && !stream;
    const curve = p.curve ?? (stream ? "smooth" : "linear");
    const fmt = ctx.fmt;
    const pct = ctx.formatter("percent");

    // Stacking needs a number at every position; a missing value contributes nothing.
    const totals = shaped.labels.map((_, j) => shaped.series.reduce((s, sr) => s + Math.max(0, sr.values[j] ?? 0), 0));
    const maxTotal = Math.max(0, ...totals);
    const plotted = (si: number, j: number): number | null => {
      const raw = shaped.series[si].values[j];
      if (!stacked) return raw;
      const v = Math.max(0, raw ?? 0);
      return percent ? (totals[j] ? v / totals[j] : 0) : v;
    };
    const base = (j: number) => (stream ? -totals[j] / 2 : 0);

    // The value axis is pinned for stacks so the label-fitting below knows the pixel scale.
    const step = niceStep(maxTotal / (ctx.compact ? 3 : 5));
    const axisMax = percent ? 1 : stream ? (maxTotal / 2) * 1.04 : Math.ceil(maxTotal / step - 1e-9) * step || 1;
    const axisMin = stream ? -axisMax : 0;
    // Fractional x position to an axis coordinate: interpolated time, or a category index.
    const xAt = (pos: number) => {
      if (!shaped.temporal) return pos;
      const i = Math.min(n - 2, Math.max(0, Math.floor(pos)));
      const a = +new Date(shaped.x[i] as string);
      const b = +new Date(shaped.x[i + 1] as string);
      return a + (b - a) * (pos - i);
    };

    // Direct labels: for each band, find the widest slot where a text box fits entirely
    // inside it (between the highest lower edge and the lowest upper edge across the
    // label's width). Bands with no such slot are named in the legend instead.
    const wantLabels = (p.labels ?? stacked) && stacked && n > 2;
    const placed = new Map<string, { pos: number; y: number }>();
    if (wantLabels) {
      const plotH = Math.max(40, ctx.height - (stream ? 40 : 48));
      const plotW = Math.max(40, ctx.width - (stream ? 20 : 60));
      const pxPerUnit = plotH / (axisMax - axisMin);
      const colW = plotW / (n - 1);
      const lower = shaped.labels.map((_, j) => base(j));
      for (let si = 0; si < count; si++) {
        const s = shaped.series[si];
        const upper = lower.map((lo, j) => lo + (plotted(si, j) ?? 0));
        // Half the label width in column units; edges are interpolated between data points.
        const half = (measureText(s.name, t.fontSize, t.fontFamily, 600) + 16) / 2 / colW;
        const edge = (arr: number[], pos: number) => {
          const i = Math.min(n - 2, Math.max(0, Math.floor(pos)));
          return arr[i] + (arr[i + 1] - arr[i]) * (pos - i);
        };
        let best = { fit: 0, pos: -1, y: 0 };
        // A category axis only resolves whole positions; a time axis can centre a label between points.
        const inc = shaped.temporal ? 0.25 : 1;
        for (let pos = shaped.temporal ? half : Math.ceil(half); pos <= n - 1 - half + 1e-9; pos += inc) {
          let lo = Math.max(edge(lower, pos - half), edge(lower, pos + half));
          let hi = Math.min(edge(upper, pos - half), edge(upper, pos + half));
          for (let k = Math.ceil(pos - half); k <= Math.floor(pos + half); k++) {
            if (lower[k] > lo) lo = lower[k];
            if (upper[k] < hi) hi = upper[k];
          }
          const fit = (hi - lo) * pxPerUnit;
          if (fit > best.fit) best = { fit, pos, y: (lo + hi) / 2 };
        }
        if (best.fit >= t.fontSize + 8) placed.set(s.key, { pos: best.pos, y: best.y });
        for (let j = 0; j < n; j++) lower[j] = upper[j];
      }
    }

    const series: Record<string, any>[] = shaped.series.map((s, si) => {
      const dimmed = ctx.dimmed(s.key);
      const color = ctx.color(single ? undefined : s.key, single ? undefined : si);
      const active = ctx.selected(s.key);
      const at = placed.get(s.key);
      return {
        id: s.key,
        name: s.name,
        type: "line" as const,
        ...morph,
        stack: stacked ? "total" : undefined,
        stackStrategy: stacked ? ("all" as const) : undefined,
        smooth: curve === "smooth" ? 0.35 : false,
        smoothMonotone: curve === "smooth" ? ("x" as const) : undefined,
        step: curve === "step" ? ("end" as const) : undefined,
        connectNulls: false,
        // Lines and fills carry no data index, so ECharts only reports clicks on them when asked.
        triggerEvent: !!p.select,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 8,
        z: stacked ? 2 : dimmed ? 1 : 3,
        // Stacked bands are solid and separated by a surface seam; unstacked areas are a
        // wash under a full-strength line, so overlapping series stay readable.
        lineStyle: stacked ? { color: t.surface, width: 1 } : { color, width: dimmed ? 1.25 : t.lineWidth, opacity: active ? 1 : 0.25, cap: "round" as const, join: "round" as const },
        itemStyle: { color, borderColor: t.surface, borderWidth: 2 },
        areaStyle: stacked ? { color, opacity: active ? 1 : 0.25 } : { color: alpha(color, single ? 0.14 : dimmed ? 0.06 : 0.1), origin: "start" as const, opacity: active ? 1 : 0.4 },
        // No hover focus while `select` is on: the click rebuild would leave the blur stuck.
        emphasis: { focus: single || p.select ? ("none" as const) : ("series" as const), disabled: single },
        markPoint: at
          ? {
              silent: true,
              animation: false,
              data: [{ coord: [xAt(at.pos), at.y], symbol: "rect", symbolSize: 1, itemStyle: { color: "transparent" }, label: { show: true, position: "inside", formatter: s.name, ...labelStyle(ctx, { color: inkOn(color), fontWeight: 600, opacity: active ? 1 : 0.4 }) } }],
            }
          : undefined,
        data: shaped.labels.map((_, j) => (shaped.temporal ? [shaped.x[j], plotted(si, j)] : plotted(si, j))),
      };
    });

    // A streamgraph is an ordinary stack riding on an invisible series of minus half the total.
    if (stream) {
      series.unshift({
        id: "__baseline",
        name: "",
        type: "line",
        stack: "total",
        stackStrategy: "all",
        smooth: curve === "smooth" ? 0.35 : false,
        smoothMonotone: curve === "smooth" ? "x" : undefined,
        step: curve === "step" ? "end" : undefined,
        showSymbol: false,
        silent: true,
        lineStyle: { opacity: 0, width: 0 },
        itemStyle: { opacity: 0 },
        tooltip: { show: false },
        data: shaped.labels.map((_, j) => (shaped.temporal ? [shaped.x[j], base(j)] : base(j))),
      });
    }

    const xAxis = shaped.temporal ? timeAxis(ctx, stream ? { axisLine: { show: false } } : {}) : categoryAxis(ctx, { data: shaped.labels, boundaryGap: false, ...(stream ? { axisLine: { show: false } } : null) });
    const yAxis = stream
      ? hiddenAxis("value", { min: axisMin, max: axisMax })
      : valueAxis(ctx, { min: 0, max: stacked ? axisMax : undefined, interval: percent ? (ctx.compact ? 0.5 : 0.25) : stacked ? step : undefined, axisLabel: { formatter: (v: number) => (percent ? pct(v) : fmt(v)) } });

    const allLabelled = stacked && shaped.series.every((s) => placed.has(s.key));
    const legend: LegendItem[] = single || allLabelled ? [] : shaped.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), shape: stacked ? "square" : "line", muted: ctx.dimmed(s.key) }));

    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;
    const firstIdx = totals.findIndex((v, j) => (single ? shaped.series[0].values[j] != null : v > 0));
    let lastIdx = n - 1;
    while (lastIdx > 0 && (single ? shaped.series[0].values[lastIdx] == null : totals[lastIdx] === 0)) lastIdx--;
    const kind = stream ? "Streamgraph" : percent ? "100% stacked area chart" : stacked ? "Stacked area chart" : "Area chart";
    let pattern = "";
    if (n && firstIdx >= 0) {
      if (single) {
        const v = shaped.series[0].values;
        pattern = `It moves from ${fmt(v[firstIdx])} to ${fmt(v[lastIdx])}.`;
      } else {
        const lead = (j: number) => shaped.series.reduce((b, s) => ((s.values[j] ?? 0) > (b.values[j] ?? 0) ? s : b), shaped.series[0]);
        const share = (s: (typeof shaped.series)[number], j: number) => (totals[j] ? pct(Math.max(0, s.values[j] ?? 0) / totals[j]) : "0%");
        const a = lead(firstIdx);
        const b = lead(lastIdx);
        pattern = `${count} series: ${shaped.series.map((s) => s.name).slice(0, 8).join(", ")}. ${stacked && !percent ? `The total moves from ${fmt(totals[firstIdx])} to ${fmt(totals[lastIdx])}. ` : ""}Largest at the start: ${a.name} (${share(a, firstIdx)}); at the end: ${b.name} (${share(b, lastIdx)}).`;
      }
    }

    // Keep annotation labels inside the frame and off the marks near the plot's edges.
    const times = shaped.temporal ? shaped.x.map((x) => new Date(x as string | number | Date).getTime()) : [];
    const fxAt = (j: number) => (n < 2 ? 0.5 : shaped.temporal ? (times[j] - times[0]) / (times[n - 1] - times[0] || 1) : j / (n - 1));
    const tops = stream ? [] : stacked ? totals.map((v, j) => ({ fx: fxAt(j), y: percent ? 1 : v, bar: true })) : shaped.series.flatMap((s) => s.values.flatMap((v, j) => (v == null ? [] : [{ fx: fxAt(j), y: v }])));
    const fit = (option: Record<string, any>) =>
      fitAnnotations(option, p.annotations, ctx, {
        sink: "line",
        marks: tops,
        fx: (x) => {
          if (shaped.temporal) {
            const at = new Date(x).getTime();
            return Number.isNaN(at) ? undefined : (at - times[0]) / (times[n - 1] - times[0] || 1);
          }
          const j = shaped.labels.indexOf(String(x));
          return j < 0 ? undefined : fxAt(j);
        },
        yMin: axisMin,
        yMax: stacked ? axisMax : Math.max(0, ...tops.map((m) => m.y)),
        left: stream ? 4 : 40,
      });

    return {
      legend,
      alt: `${kind} of ${yName} by ${p.x}${n ? `, ${shaped.labels[0]} to ${shaped.labels[n - 1]}` : ""}. ${pattern}`,
      option: fit({
        grid: { right: 16, top: stream ? 8 : 16 },
        xAxis,
        yAxis,
        tooltip: {
          trigger: "axis",
          formatter: (items: any) => {
            const list = (Array.isArray(items) ? items : [items]).filter((d: any) => d.seriesId !== "__baseline" && d.seriesId !== "__annotations");
            if (!list.length) return "";
            const j = list[0].dataIndex as number;
            const byKey = new Map(shaped.series.map((s) => [s.key, s]));
            const rows = list
              .map((d: any) => ({ d, raw: byKey.get(d.seriesId)?.values[j] ?? null }))
              .filter((r: any) => r.raw != null);
            // Stacks list top band first, matching what is drawn; overlapping areas list by value.
            if (stacked) rows.reverse();
            else rows.sort((a: any, b: any) => b.raw - a.raw);
            const title = shaped.temporal ? formatDate(shaped.x[j], ctx.locale, n > 60 ? undefined : { year: "numeric", month: "short" }) : shaped.labels[j];
            const out = rows.slice(0, 12).map((r: any) => ({
              name: single ? shaped.series[0].name : r.d.seriesName,
              value: percent ? `${pct(totals[j] ? Math.max(0, r.raw) / totals[j] : 0)} · ${fmt(r.raw)}` : fmt(r.raw),
              color: ctx.color(single ? undefined : r.d.seriesId, single ? undefined : shaped.series.findIndex((s) => s.key === r.d.seriesId)),
              muted: ctx.dimmed(r.d.seriesId),
            }));
            if (stacked) out.push({ name: "Total", value: fmt(totals[j]), color: undefined as unknown as string, muted: true });
            return tooltipHtml(ctx, title, out);
          },
        },
        // Shaded bands default to drawing beneath the series, which a solid stack would hide.
        ...(stacked && p.annotations?.length ? { markArea: { z: 5 } } : null),
        // Annotations attach to the first series. In a stack that is the bottom band, whose marks
        // the bands above would cover, so an empty series drawn on top carries them instead.
        series: stacked && p.annotations?.length ? [{ id: "__annotations", name: "", type: "line", silent: true, z: 5, showSymbol: false, tooltip: { show: false }, data: [] }, ...series] : series,
      }),
    };
  },
});

// Deterministic pseudo-random numbers for the illustrative datasets below.
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const mix = [
  { year: "2000", Coal: 5990, Gas: 2770, Nuclear: 2540, Hydro: 2620, "Wind and solar": 32 },
  { year: "2004", Coal: 6940, Gas: 3450, Nuclear: 2700, Hydro: 2810, "Wind and solar": 88 },
  { year: "2008", Coal: 8260, Gas: 4300, Nuclear: 2660, Hydro: 3250, "Wind and solar": 233 },
  { year: "2012", Coal: 9170, Gas: 5100, Nuclear: 2400, Hydro: 3650, "Wind and solar": 630 },
  { year: "2016", Coal: 9450, Gas: 5800, Nuclear: 2540, Hydro: 4020, "Wind and solar": 1290 },
  { year: "2020", Coal: 9440, Gas: 6370, Nuclear: 2640, Hydro: 4350, "Wind and solar": 2440 },
  { year: "2024", Coal: 10590, Gas: 6790, Nuclear: 2770, Hydro: 4410, "Wind and solar": 4620 },
];

const genres = ["Drama", "Comedy", "Action", "Documentary", "Horror", "Animation"];
const streamRows = (() => {
  const rnd = seeded(11);
  const rows: { month: string; genre: string; hours: number }[] = [];
  genres.forEach((genre, g) => {
    const phase = rnd() * 6;
    const size = 30 + rnd() * 50;
    for (let i = 0; i < 48; i++) {
      const wave = 1 + 0.55 * Math.sin(i / (5 + g) + phase) + 0.25 * Math.sin(i / 2.3 + phase * 2);
      rows.push({ month: new Date(Date.UTC(2021, i, 1)).toISOString().slice(0, 10), genre, hours: Math.round(size * Math.max(0.15, wave) + rnd() * 2) });
    }
  });
  return rows;
})();

export const examples = {
  "Stacked, labelled in the bands": {
    data: mix,
    x: "year",
    y: ["Coal", "Gas", "Hydro", "Nuclear", "Wind and solar"],
    stack: true,
    format: "compact",
    title: "Wind and solar generated 4,620 TWh of electricity in 2024",
    subtitle: "World electricity generation by source, terawatt-hours",
    source: "Ember, Global Electricity Review (rounded)",
    note: "Figures are approximate, for illustration",
  },
  "100% stacked with highlight": {
    data: mix,
    x: "year",
    y: ["Coal", "Gas", "Hydro", "Nuclear", "Wind and solar"],
    stack: "percent",
    highlight: "Wind and solar",
    title: "Wind and solar's share of electricity rose from 0.2% in 2000 to 15.8% in 2024",
    subtitle: "Share of world electricity generation",
    source: "Ember, Global Electricity Review (rounded)",
    note: "Figures are approximate, for illustration",
  },
  "Streamgraph, long format": {
    data: streamRows,
    x: "month",
    y: "hours",
    series: "genre",
    stream: true,
    format: "{value}m hours",
    title: "Monthly hours watched by genre, 2021 to 2024",
    subtitle: "Millions of hours per month, six genres",
    note: "Illustrative data",
  },
  "Overlapping washes": {
    data: [
      { month: "Jan", "2023": 41, "2024": 52 },
      { month: "Feb", "2023": 44, "2024": 55 },
      { month: "Mar", "2023": 58, "2024": 71 },
      { month: "Apr", "2023": 73, "2024": 80 },
      { month: "May", "2023": 96, "2024": 104 },
      { month: "Jun", "2023": 118, "2024": 131 },
      { month: "Jul", "2023": 134, "2024": 152 },
      { month: "Aug", "2023": 129, "2024": 147 },
      { month: "Sep", "2023": 98, "2024": 117 },
      { month: "Oct", "2023": 70, "2024": 84 },
      { month: "Nov", "2023": 49, "2024": 58 },
      { month: "Dec", "2023": 43, "2024": 50 },
    ],
    x: "month",
    y: ["2023", "2024"],
    curve: "smooth",
    format: "{value}k",
    title: "July bike-share trips rose from 134,000 in 2023 to 152,000 in 2024",
    subtitle: "Bike-share trips per month, thousands",
    note: "Illustrative data",
  },
};
