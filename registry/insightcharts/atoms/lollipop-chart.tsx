"use client";

import { BarChart as EBar, CustomChart as ECustom, ScatterChart as EScatter } from "echarts/charts";
import { alpha, mix, type Annotation, defineChart, type BuildContext, type LegendItem, formatDate, isTemporal, measureText, truncateText, categoryAxis, hiddenAxis, labelStyle, morph, tooltipHtml, valueAxis, describeExtremes, shapeSeries } from "insightcharts/core";

export interface LollipopChartProps {
  /** Category field (what each lollipop is). */
  x: string;
  /** Value field. Several fields (or `series`) draw several dots per row and switch to a dot plot. */
  y: string | string[];
  /** Field that splits rows into series, for long-format data. Forces the dot plot. */
  series?: string;
  /** Draw the stem from zero. `false` gives a dot plot on a scale that need not start at zero. */
  stem?: boolean;
  /** `"auto"` is horizontal for rankings and vertical for dates. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** Order of the rows. Default: descending for rankings, data order for dates. */
  sort?: "none" | "asc" | "desc";
  /** Print the value beside each dot. Default: on for a single series of up to 16 rows. */
  labels?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

/**
 * Annotations are written against the props: `x` is the category, `y` the value. Core maps
 * them to the screen axes, which is wrong once the chart is drawn sideways, so for horizontal
 * layouts the marks are rebuilt here with the axes swapped and core's own copies are sent to
 * an empty series on an off-canvas grid. Belongs in core/annotations.ts; remove when it moves.
 */
function transposeAnnotations(option: Record<string, any>, notes: Annotation[], ctx: BuildContext): Record<string, any> {
  const t = ctx.tokens;
  const text = { color: t.inkSecondary, fontSize: t.fontSize, fontFamily: t.fontFamily, lineHeight: Math.round(t.fontSize * 1.35) };
  const key = (axis: "x" | "y") => (axis === "x" ? "yAxis" : "xAxis");
  const lines = notes.flatMap((a) => (a.type === "line" ? [{ [key(a.axis)]: a.value, lineStyle: { color: a.emphasis ? t.ink : t.muted, width: 1, type: a.dashed === false ? "solid" : "dashed" }, label: { show: !!a.label, formatter: a.label ?? "", position: a.axis === "y" ? "start" : "insideEndTop", ...text } }] : []));
  const bands = notes.flatMap((a) => (a.type === "band" ? [[{ [key(a.axis)]: a.from, name: a.label ?? "", label: { show: !!a.label, position: a.axis === "y" ? "insideTop" : "insideTopLeft", ...text } }, { [key(a.axis)]: a.to }]] : []));
  const points = notes.flatMap((a) => (a.type === "point" ? [{ coord: [a.y, a.x], symbol: "circle", symbolSize: a.dot === false ? 1 : 9, itemStyle: a.dot === false ? { color: "transparent", borderWidth: 0 } : { color: t.surface, borderColor: t.ink, borderWidth: 1.5 }, label: { show: true, formatter: a.label, position: a.position ?? "top", distance: 8, ...text, color: t.ink, textBorderColor: t.surface, textBorderWidth: 3 } }] : []));
  const [first, ...rest] = option.series as Record<string, any>[];
  const marked = {
    ...first,
    ...(lines.length ? { markLine: { silent: true, symbol: "none", animation: ctx.animate, data: [...(first.markLine?.data ?? []), ...lines] } } : null),
    ...(bands.length ? { markArea: { silent: true, z: 0, itemStyle: { color: alpha(t.muted, 0.12) }, data: bands } } : null),
    ...(points.length ? { markPoint: { silent: true, animation: ctx.animate, data: points } } : null),
  };
  // A vertical line is labelled above the plot, which needs headroom.
  const headroom = notes.some((a) => a.type === "line" && a.axis === "y" && a.label) ? 18 : 0;
  const sink = { id: "annotations-sink", type: "bar", xAxisIndex: 1, yAxisIndex: 1, silent: true, tooltip: { show: false }, data: [] };
  return {
    ...option,
    grid: [{ left: 4, bottom: 4, outerBoundsMode: "same", outerBoundsContain: "axisLabel", ...option.grid, top: (option.grid?.top ?? 12) + headroom }, { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" }],
    xAxis: [option.xAxis, hiddenAxis("value", { gridIndex: 1 })],
    yAxis: [option.yAxis, hiddenAxis("value", { gridIndex: 1 })],
    series: [sink, marked, ...rest],
  };
}

/**
 * A dot on a thin stem: the same reading as a bar chart with far less ink, which matters when
 * there are many rows or the values are all large. Without the stem it is a Cleveland dot
 * plot, and because a dot encodes position rather than length the scale may leave zero.
 */
export const LollipopChart = defineChart<LollipopChartProps>({
  name: "lollipop-chart",
  title: "Lollipop chart",
  category: "comparison",
  description: "Ranks categories with a dot on a thin stem from zero, or as a stemless dot plot on a free scale.",
  whenToUse: "Rankings of 8 to 30 categories where bars would be too heavy; dot plot mode when the values sit far from zero and the differences between them matter, or to compare a few series per row.",
  avoid: "Fewer than about 6 categories or part-to-whole stacks (use bar-chart); exactly two values per row where the difference between them matters (use dumbbell-chart); change over time (use line-chart).",
  use: [EBar, EScatter, ECustom],
  defaults: { orientation: "auto" },
  selectField: (p) => p.x,
  // Horizontal rankings get one row per category: many rows grow the chart, a handful stay compact.
  height: (p, rows) => {
    if (p.orientation === "vertical" || (p.orientation !== "horizontal" && rows.length > 0 && isTemporal(rows[0][p.x]))) return undefined;
    const n = new Set(rows.map((r) => String(r[p.x]))).size;
    const single = !p.series && !Array.isArray(p.y);
    return Math.max(120, n * 34 + ((p.labels ?? (single && n <= 16)) && single ? 12 : 40));
  },
  props: [
    { name: "x", type: "string", required: true, description: "Category field." },
    { name: "y", type: "string | string[]", required: true, description: "Value field. Several fields draw several dots per row (dot plot)." },
    { name: "series", type: "string", description: "Field that splits rows into series (long data). Forces the dot plot." },
    { name: "stem", type: "boolean", default: "true", description: "Stem from zero. `false` draws a dot plot whose scale need not start at zero." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Horizontal for rankings, vertical for dates." },
    { name: "sort", type: '"none" | "asc" | "desc"', description: "Row order. Default: descending for rankings, data order for dates." },
    { name: "labels", type: "boolean", description: "Value beside each dot. Default: on for one series of up to 16 rows." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "lollipop-chart",
    theme: "mono",
    data: [
      { country: "Netherlands", share: 27 },
      { country: "Denmark", share: 19 },
      { country: "Germany", share: 10 },
      { country: "Sweden", share: 9 },
      { country: "Japan", share: 8 },
      { country: "France", share: 4 },
      { country: "United Kingdom", share: 2 },
      { country: "United States", share: 1 },
    ],
    x: "country",
    y: "share",
    format: "{value}%",
    height: 300,
    title: "27% of trips in the Netherlands are made by bike",
    subtitle: "Share of all trips made by bicycle",
    source: "National travel surveys, latest available year (rounded)",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const single = shaped.series.length === 1;
    const stem = (p.stem ?? true) && single;
    const horizontal = p.orientation === "horizontal" || (p.orientation !== "vertical" && !shaped.temporal);
    const sort = p.sort ?? (shaped.temporal ? "none" : "desc");
    const fmt = ctx.fmt;

    const order = shaped.labels.map((_, i) => i);
    if (sort !== "none") {
      // Several series sort by the first one, so one column of dots reads as a ranking.
      const v = (i: number) => shaped.series[0].values[i] ?? -Infinity;
      order.sort((a, b) => (sort === "desc" ? v(b) - v(a) : v(a) - v(b)));
    }
    const labels = order.map((i) => shaped.labels[i]);
    const showLabels = p.labels ?? (single && labels.length <= 16);
    const hideValueAxis = showLabels && single;
    const tw = (s: string) => measureText(s, t.fontSize, t.fontFamily);
    const valueW = Math.max(0, ...shaped.series.flatMap((s) => s.values.map((v) => (v == null ? 0 : tw(fmt(v))))));
    const nameCap = ctx.compact ? 110 : Math.min(260, Math.round(ctx.width * 0.32));
    // On a narrow screen long category names go above their row instead of being cut to a stub beside it.
    const above = horizontal && ctx.compact && Math.max(0, ...labels.map(tw)) > nameCap && (ctx.height - 30) / Math.max(1, labels.length) >= 30;
    const shift = above ? 5 : 0;

    const colorOf = (key: string, si: number, name: string) => {
      const c = single ? ctx.color(name) : ctx.color(key, si);
      return ctx.selected(name) ? c : alpha(c, 0.25);
    };

    const series: any[] = [];
    if (stem && above) {
      // Names sit above the row here, so the stem is drawn below the band centre with the dot.
      series.push({
        id: "stem",
        type: "custom",
        silent: true,
        z: 1,
        tooltip: { show: false },
        data: order.map((i) => [shaped.series[0].values[i] ?? 0, shaped.labels[i]]),
        encode: { x: 0, y: 1 },
        renderItem: (params: any, api: any) => {
          const name = labels[params.dataIndex];
          const [x0, y] = api.coord([0, name]);
          const [x1] = api.coord([api.value(0), name]);
          return { type: "line", shape: { x1: x0, y1: y + shift, x2: x1, y2: y + shift }, style: { stroke: mix(colorOf(shaped.series[0].key, 0, name), t.surface, 0.5), lineWidth: 2 } };
        },
      });
    } else if (stem) {
      series.push({
        id: "stem",
        type: "bar",
        silent: true,
        barWidth: 2,
        z: 1,
        ...morph,
        tooltip: { show: false },
        data: order.map((i) => ({ name: shaped.labels[i], value: shaped.series[0].values[i], itemStyle: { color: mix(colorOf(shaped.series[0].key, 0, shaped.labels[i]), t.surface, 0.5) } })),
      });
    } else {
      // Dot plot: a hairline per row carries the eye from the label to the dot.
      series.push({
        id: "guide",
        type: "custom",
        silent: true,
        z: 1,
        tooltip: { show: false },
        data: labels.map((name) => [name]),
        encode: horizontal ? { y: 0 } : { x: 0 },
        renderItem: (params: any, api: any) => {
          const cs = params.coordSys;
          const name = labels[params.dataIndex];
          const at = horizontal ? api.coord([0, name])[1] + shift : api.coord([name, 0])[0];
          const shape = horizontal ? { x1: cs.x, y1: at, x2: cs.x + cs.width, y2: at } : { x1: at, y1: cs.y, x2: at, y2: cs.y + cs.height };
          return { type: "line", shape, style: { stroke: t.grid, lineWidth: 1 } };
        },
      });
    }
    shaped.series.forEach((s, si) => {
      series.push({
        id: s.key,
        name: s.name,
        type: "scatter",
        ...morph,
        z: 3,
        symbol: "circle",
        symbolSize: above ? 10 : 12,
        symbolOffset: [0, shift],
        emphasis: { scale: 1.15 },
        label: {
          show: showLabels && single,
          position: horizontal ? "right" : "top",
          distance: 5,
          formatter: (d: any) => fmt(d.value[horizontal ? 0 : 1]),
          ...labelStyle(ctx, { color: t.ink }),
        },
        data: order.map((i) => {
          const name = shaped.labels[i];
          const v = s.values[i];
          return { name, value: horizontal ? [v, name] : [name, v], itemStyle: { color: colorOf(s.key, si, name), borderColor: t.surface, borderWidth: 2, opacity: 1 }, label: { color: ctx.dimmed(name) && single ? t.muted : t.ink } };
        }).filter((d) => d.value[horizontal ? 0 : 1] != null),
      });
    });

    // Dates on a category axis: month names, with the year on the first tick and each January.
    const tick = (v: string, i: number) => {
      const monthly = /^\d{4}-\d{2}$/.test(v);
      const d = new Date(monthly ? `${v}-01T00:00:00` : v);
      if (Number.isNaN(d.getTime())) return v;
      const head = formatDate(d, ctx.locale, monthly ? { month: "short" } : { month: "short", day: "numeric" });
      return i === 0 || (d.getMonth() === 0 && (monthly || d.getDate() === 1)) ? `${head}\n${d.getFullYear()}` : head;
    };
    const category = horizontal
      ? categoryAxis(ctx, {
          data: labels,
          inverse: true,
          axisLine: { show: false },
          axisLabel: above
            ? { color: t.inkSecondary, hideOverlap: false, inside: true, margin: 0, align: "left", verticalAlign: "bottom", padding: [1, 6, 3, 0], backgroundColor: t.surface, formatter: (v: string) => truncateText(v, ctx.width - 16, t.fontSize, t.fontFamily) }
            : { color: t.inkSecondary, hideOverlap: false, width: nameCap, overflow: "truncate" },
        })
      : categoryAxis(ctx, { data: labels, axisLabel: shaped.temporal ? { formatter: tick } : {} });
    const valueOpts = { scale: !stem, axisLabel: { formatter: (v: number) => fmt(v) } };
    const value = hideValueAxis ? hiddenAxis("value", stem ? {} : { scale: true, boundaryGap: ["8%", "8%"] }) : valueAxis(ctx, valueOpts);

    const legend: LegendItem[] = single ? [] : shaped.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), shape: "dot", muted: ctx.dimmed(s.key) }));
    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;

    const notes = horizontal ? p.annotations ?? [] : [];
    const place = (option: Record<string, any>) => (notes.length ? transposeAnnotations(option, notes, ctx) : option);
    return {
      legend,
      alt: `${stem ? "Lollipop chart" : "Dot plot"} of ${yName} by ${p.x}. ${single ? describeExtremes(shaped.labels, shaped.series[0].values, fmt) : `${shaped.series.length} series: ${shaped.series.map((s) => s.name).join(", ")}.`}`,
      option: place({
        grid: { right: hideValueAxis && horizontal ? Math.ceil(valueW) + 18 : 16, top: hideValueAxis && !horizontal ? 24 : horizontal ? 4 : 12 },
        xAxis: horizontal ? value : category,
        yAxis: horizontal ? category : value,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow", shadowStyle: { color: alpha(t.muted, 0.1) } },
          formatter: (items: any) => {
            const list = (Array.isArray(items) ? items : [items]).filter((d: any) => d.seriesType === "scatter");
            if (!list.length) return "";
            return tooltipHtml(ctx, list[0].name, list.map((d: any) => ({ name: single ? yName : d.seriesName, value: fmt(d.value[horizontal ? 0 : 1]), color: d.data?.itemStyle?.color ?? d.color })));
          },
        },
        series,
      }),
    };
  },
});
