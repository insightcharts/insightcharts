import { CustomChart as ECustom, LineChart as ELine } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { formatDate } from "../core/format";
import { dodge, measureText, truncateText } from "../core/layout";
import { categoryAxis, morph, timeAxis, tooltipHtml, valueAxis } from "../core/parts";
import { shapeSeries } from "../core/shape";
import { fitAnnotations } from "./_annotations";

export interface LineChartProps {
  /** Time or ordered category field. */
  x: string;
  /** Value field, or several (one line each). */
  y: string | string[];
  /** Field that splits rows into lines, for long-format data. */
  series?: string;
  /** Line shape. Smoothing can suggest values that are not in the data, so linear is the default. */
  curve?: "linear" | "smooth" | "step";
  /** Fill under the line with a light wash. Forces a zero baseline. */
  area?: boolean;
  /** Name each line at its right-hand end instead of relying on the legend. Default: on for up to 6 lines. */
  endLabels?: boolean;
  /** Draw a marker on every point. Default: only when there are 12 points or fewer. */
  points?: boolean;
  /** Start the value axis at zero. Default false: lines encode position, not length. */
  zero?: boolean;
  /** Logarithmic value axis, for multiplicative growth. */
  log?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
  /**
   * With `highlight`: how the grey context lines are named. `true` gives each a muted end
   * label when they all fit after spreading; a string (e.g. `"Other cities"`) adds one muted
   * legend entry with that text. Default: context lines are not named.
   */
  contextLabels?: boolean | string;
}

/**
 * Lines for change over an ordered dimension. Pair with `highlight` to draw one saturated
 * line through a sea of grey, and with `annotations` to mark the events that explain it.
 */
export const LineChart = defineChart<LineChartProps>({
  name: "line-chart",
  title: "Line chart",
  category: "trend",
  description: "Shows how one or more values change over time or another ordered dimension.",
  whenToUse: "Trends over time with roughly 5 or more points; comparing the trajectories of a few series; one highlighted series against many context series.",
  avoid: "Unordered categories (use bar-chart); only two time points (use slope-chart); more than about 6 equally important lines (use small-multiples).",
  use: [ELine, ECustom],
  defaults: { curve: "linear" },
  selectField: (p) => p.series,
  selectValue: (params) => params.seriesId ?? params.seriesName,
  props: [
    { name: "x", type: "string", required: true, description: "Time or ordered category field. ISO dates are placed on a true time axis." },
    { name: "y", type: "string | string[]", required: true, description: "Value field, or several (one line each)." },
    { name: "series", type: "string", description: "Field that splits rows into lines (long data)." },
    { name: "curve", type: '"linear" | "smooth" | "step"', default: '"linear"', description: "Line shape." },
    { name: "area", type: "boolean", default: "false", description: "Light fill under the line; forces a zero baseline." },
    { name: "endLabels", type: "boolean", description: "Name each line at its end. Default: on for up to 6 lines." },
    { name: "points", type: "boolean", description: "Marker on every point. Default: on for 12 points or fewer." },
    { name: "zero", type: "boolean", default: "false", description: "Start the value axis at zero." },
    { name: "log", type: "boolean", default: "false", description: "Logarithmic value axis." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
    { name: "contextLabels", type: "boolean | string", default: "false", description: 'With `highlight`: name the grey context lines. `true` adds a muted end label to each when they all fit; a string such as `"Other cities"` adds one muted legend entry instead. On narrow charts the legend already lists every line.' },
  ],
  example: {
    type: "line-chart",
    data: [
      { year: "2019", solar: 2.7, wind: 5.3 },
      { year: "2020", solar: 3.2, wind: 5.9 },
      { year: "2021", solar: 3.7, wind: 6.5 },
      { year: "2022", solar: 4.6, wind: 7.3 },
      { year: "2023", solar: 5.5, wind: 7.8 },
    ],
    x: "year",
    y: ["solar", "wind"],
    format: "{value}%",
    title: "Solar's share rose from 2.7% to 5.5% between 2019 and 2023",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const single = shaped.series.length === 1;
    const n = shaped.labels.length;
    const showPoints = p.points ?? n <= 12;
    const visible = shaped.series.filter((s) => !ctx.dimmed(s.key));
    // End labels need one text line each: when the lines outnumber the room, the legend takes over.
    const lineHeight = Math.round(t.fontSize * 1.3);
    const fits = visible.length * lineHeight <= ctx.height - 48;
    const endLabels = (p.endLabels ?? (!single && visible.length <= 6)) && !ctx.compact && visible.length > 0 && fits;
    // Context lines can be named too, in muted regular type so the accent keeps the emphasis,
    // but only when every label still gets its own text line.
    const context = shaped.series.filter((s) => ctx.dimmed(s.key));
    const contextEnds = endLabels && p.contextLabels === true && context.length > 0 && (visible.length + context.length) * lineHeight <= ctx.height - 48;
    const labelled = contextEnds ? [...visible, ...context] : visible;
    const maxLabel = 150;
    const weight = (key: string) => (ctx.dimmed(key) ? 400 : 600);
    const endNames = new Map(labelled.map((s) => [s.key, truncateText(s.name, maxLabel, t.fontSize, t.fontFamily, weight(s.key))]));
    const longest = endLabels ? Math.max(...labelled.map((s) => measureText(endNames.get(s.key)!, t.fontSize, t.fontFamily, weight(s.key)))) : 0;
    // Room for the leader line a label gets when it is moved off its line's end.
    const leader = labelled.length > 1 ? 16 : 0;

    const series = shaped.series.map((s, i) => {
      const dimmed = ctx.dimmed(s.key);
      const color = ctx.color(single ? undefined : s.key, single ? undefined : i);
      const active = ctx.selected(s.key);
      return {
        id: s.key,
        name: s.name,
        type: "line" as const,
        ...morph,
        smooth: p.curve === "smooth" ? 0.3 : false,
        step: p.curve === "step" ? ("end" as const) : undefined,
        connectNulls: false,
        // Lines and fills carry no data index, so ECharts only reports clicks on them when asked.
        triggerEvent: !!p.select,
        // Highlighted lines draw above the context lines.
        z: dimmed ? 1 : 3,
        showSymbol: showPoints && !dimmed,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: dimmed ? 1.25 : t.lineWidth, color, opacity: active ? 1 : 0.25, cap: "round" as const, join: "round" as const },
        // The 2px surface ring keeps markers legible where they cross lines.
        itemStyle: { color, borderColor: t.surface, borderWidth: 2, opacity: active ? 1 : 0.25 },
        areaStyle: p.area ? { color: alpha(color, single ? 0.12 : 0.08), origin: "start" as const } : undefined,
        // No hover focus while `select` is on: the click rebuild would leave the blur stuck.
        emphasis: { focus: p.select ? ("none" as const) : ("series" as const), lineStyle: { width: dimmed ? 1.5 : t.lineWidth + 0.5 } },
        data: shaped.temporal ? shaped.x.map((x, j) => [x, s.values[j]]) : s.values,
      };
    });

    // End labels are drawn by a custom series so they can be placed in pixels: labels of lines
    // that converge are spread apart (`dodge`) and joined to their line by a short leader.
    const ends = labelled
      .map((s) => {
        let j = s.values.length - 1;
        while (j >= 0 && s.values[j] == null) j--;
        return j < 0 ? null : { key: s.key, color: ctx.color(single ? undefined : s.key, single ? undefined : shaped.series.indexOf(s)), name: endNames.get(s.key) ?? s.name, muted: ctx.dimmed(s.key), x: shaped.temporal ? shaped.x[j] : shaped.labels[j], y: s.values[j] as number };
      })
      .filter((e): e is NonNullable<typeof e> => e != null);
    const labelSeries = {
      id: "__end-labels",
      type: "custom" as const,
      silent: true,
      clip: false,
      z: 4,
      tooltip: { show: false },
      animation: false,
      encode: { x: 0, y: 1 },
      data: ends.map((e) => [e.x, e.y]),
      renderItem: (params: any, api: any) => {
        const pts = ends.map((e) => api.coord([e.x, e.y]) as number[]);
        const box = params.coordSys as { y: number; height: number };
        const ys = dodge(pts.map((q) => q[1]), lineHeight, box.y + lineHeight / 2 - 4, box.y + box.height + 4);
        const i = params.dataIndex as number;
        const [x, y] = pts[i];
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        // Once any label has moved, every label gets a leader and a colour key, so the column
        // of names stays aligned and each can be traced to its line even where ends coincide.
        const moved = ys.some((v, k) => Math.abs(v - pts[k][1]) > 3);
        const fade = ctx.selected(ends[i].key) ? 1 : 0.35;
        const style = { text: ends[i].name, fill: ends[i].muted ? t.muted : t.ink, opacity: fade, fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: ends[i].muted ? 400 : 600, verticalAlign: "middle" as const };
        if (!moved) return { type: "text", x: x + 8, y: ys[i], style };
        const lx = x + leader;
        return {
          type: "group",
          children: [
            { type: "polyline", shape: { points: [[x + 6, y], [x + 9, y], [lx - 3, ys[i]], [lx, ys[i]]] }, style: { stroke: t.axis, lineWidth: 1, fill: "none", opacity: fade } },
            { type: "circle", shape: { cx: lx + 5, cy: ys[i], r: 3 }, style: { fill: ends[i].color, opacity: fade } },
            { type: "text", x: lx + 12, y: ys[i], style },
          ],
        };
      },
    };

    const xAxis = shaped.temporal ? timeAxis(ctx) : categoryAxis(ctx, { data: shaped.labels, boundaryGap: false });
    const yAxis = valueAxis(ctx, { type: p.log ? "log" : "value", scale: !(p.zero || p.area), axisLabel: { formatter: (v: number) => ctx.fmt(v) } });

    // With end labels the legend is normally empty; one muted entry can stand for all the context
    // lines. The highlighted lines are listed with it, because the figure chrome only draws a legend of two or more.
    const others: LegendItem[] =
      typeof p.contextLabels === "string" && p.contextLabels && context.length
        ? [...visible.map((s) => ({ name: s.name, color: ctx.color(s.key, shaped.series.indexOf(s)), shape: "line" as const })), { name: p.contextLabels, color: t.context, shape: "line", muted: true }]
        : [];
    const legend: LegendItem[] = single ? [] : endLabels ? others : shaped.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), shape: "line", muted: ctx.dimmed(s.key) }));
    const first = shaped.series[0]?.values.find((v) => v != null);
    const last = [...(shaped.series[0]?.values ?? [])].reverse().find((v) => v != null);
    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;

    const values = shaped.series.flatMap((s) => s.values.filter((v): v is number => v != null));
    // Time is placed by date, categories by position.
    const times = shaped.temporal ? shaped.x.map((x) => new Date(x as string | number | Date).getTime()) : [];
    const fxAt = (j: number) => (n < 2 ? 0.5 : shaped.temporal ? (times[j] - times[0]) / (times[n - 1] - times[0] || 1) : j / (n - 1));
    const fit = (option: Record<string, any>) =>
      fitAnnotations(option, p.annotations, ctx, {
        sink: "line",
        marks: shaped.series.flatMap((s) => s.values.flatMap((v, j) => (v == null ? [] : [{ fx: fxAt(j), y: v }]))),
        fx: (x) => {
          if (shaped.temporal) {
            const at = new Date(x).getTime();
            return Number.isNaN(at) ? undefined : (at - times[0]) / (times[n - 1] - times[0] || 1);
          }
          const j = shaped.labels.indexOf(String(x));
          return j < 0 ? undefined : fxAt(j);
        },
        yMin: p.zero || p.area ? Math.min(0, ...values) : Math.min(...values),
        yMax: Math.max(...values),
      });

    return {
      legend,
      alt: `Line chart of ${yName} by ${p.x}, ${shaped.labels[0]} to ${shaped.labels[n - 1]}. ${single && first != null && last != null ? `It moves from ${ctx.fmt(first)} to ${ctx.fmt(last)}.` : `${shaped.series.length} lines: ${shaped.series.map((s) => s.name).slice(0, 8).join(", ")}.`}`,
      option: fit({
        grid: { right: endLabels ? Math.ceil(longest) + 16 + leader : 16, top: 16 },
        xAxis,
        yAxis,
        tooltip: {
          trigger: "axis",
          formatter: (items: any) => {
            const list = (Array.isArray(items) ? items : [items]).filter((d: any) => d.seriesType === "line" && (Array.isArray(d.value) ? d.value[1] : d.value) != null);
            if (!list.length) return "";
            const value = (d: any) => (Array.isArray(d.value) ? d.value[1] : d.value);
            // Sort by value so the tooltip order matches the lines' vertical order.
            list.sort((a: any, b: any) => value(b) - value(a));
            const title = shaped.temporal ? formatDate(list[0].value[0], ctx.locale, n > 60 ? undefined : { year: "numeric", month: "short" }) : list[0].name;
            return tooltipHtml(ctx, title, list.slice(0, 12).map((d: any) => ({ name: single ? yName : d.seriesName, value: ctx.fmt(value(d)), color: d.color, muted: ctx.dimmed(d.seriesId) })));
          },
        },
        series: endLabels && ends.length ? [...series, labelSeries] : series,
      }),
    };
  },
});

const converging = (() => {
  const end: Record<string, number> = { Lagos: 61, Nairobi: 59.5, Accra: 60.2, Dakar: 58.8, Kampala: 44, Addis: 60.8 };
  const start: Record<string, number> = { Lagos: 22, Nairobi: 35, Accra: 28, Dakar: 41, Kampala: 12, Addis: 8 };
  return Array.from({ length: 10 }, (_, i) => {
    const row: Record<string, string | number> = { year: String(2015 + i) };
    for (const city of Object.keys(end)) row[city] = Math.round((start[city] + ((end[city] - start[city]) * i) / 9 + Math.sin(i * 1.7 + city.length) * 1.5 * (i < 9 ? 1 : 0)) * 10) / 10;
    return row;
  });
})();

export const examples = {
  "Highlight with named context lines": {
    theme: "editorial",
    data: converging.flatMap((r) => ["Lagos", "Nairobi", "Kampala", "Addis"].map((city) => ({ year: r.year, city, share: r[city] }))),
    x: "year",
    y: "share",
    series: "city",
    highlight: "Addis",
    contextLabels: true,
    format: "{value}%",
    title: "Mobile money use in Addis rose from 6.6% in 2015 to 60.8% in 2024",
    subtitle: "Share of households with a mobile money account. `contextLabels: true` names the grey lines in muted type.",
    note: "Illustrative data",
  },
  "Highlight, one legend entry for the rest, annotations near the right edge": {
    // One token overridden on the default theme: the accent.
    theme: { accent: "#b4237a" },
    data: converging.flatMap((r) => ["Lagos", "Nairobi", "Kampala", "Addis"].map((city) => ({ year: r.year, city, share: r[city] }))),
    x: "year",
    y: "share",
    series: "city",
    highlight: "Addis",
    contextLabels: "Other cities",
    annotations: [
      { type: "line", axis: "y", value: 60, label: "National target" },
      { type: "point", x: "2023", y: 49.5, label: "Agent network\nreaches every district" },
    ],
    format: "{value}%",
    title: "Addis reached the 60% national target in 2024",
    subtitle: "Households with a mobile money account",
    note: "Illustrative data",
  },
  "Stress: six lines converge": {
    theme: "science",
    data: converging,
    x: "year",
    y: ["Lagos", "Nairobi", "Accra", "Dakar", "Kampala", "Addis"],
    format: "{value}%",
    title: "Five of six cities had between 58.8% and 61% of households using mobile money in 2024",
    subtitle: "Households with a mobile money account",
    note: "Illustrative data",
  },
  "Long format with highlight": {
    theme: "noir",
    data: converging.flatMap((r) => ["Lagos", "Nairobi", "Kampala", "Addis"].map((city) => ({ year: r.year, city, share: r[city] }))),
    x: "year",
    y: "share",
    series: "city",
    highlight: "Addis",
    format: "{value}%",
    title: "Mobile money use in Addis rose from 6.6% in 2015 to 60.8% in 2024",
    subtitle: "Households with a mobile money account",
    note: "Illustrative data",
  },
};
