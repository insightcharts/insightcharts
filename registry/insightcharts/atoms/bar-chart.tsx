"use client";

import { BarChart as EBar } from "echarts/charts";
import { alpha, inkOn, type Annotation, defineChart, type BuildContext, isTemporal, type LegendItem, measureText, truncateText, wrapText, categoryAxis, hiddenAxis, labelStyle, morph, tooltipHtml, valueAxis, describeExtremes, shapeSeries } from "insightcharts/core";
import { fitAnnotations } from "@/components/insightcharts/atoms/_annotations";

export interface BarChartProps {
  /** Category field (what each bar is). */
  x: string;
  /** Value field, or several for grouped / stacked bars. */
  y: string | string[];
  /** Field that splits rows into series, for long-format data. */
  series?: string;
  /** `"auto"` draws horizontal bars for rankings and long labels, vertical for time. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** Order of the bars. Defaults to descending for rankings, data order for time. */
  sort?: "none" | "asc" | "desc";
  /** Stack series. `"percent"` normalises each bar to 100%. */
  stack?: boolean | "percent";
  /** Print the value at the end of each bar. Default: on for a single series of up to 12 bars. */
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

// Whether `auto` draws the bars sideways. Decided from the labels alone, never from the
// width: the natural height below depends on it, and a layout that flipped with the
// container would leave a tall plot half empty. Short label sets that fit side by side on a
// phone stay vertical; anything longer is a ranking with names to read.
const sideways = (labels: string[]) => labels.length > 8 || labels.some((l) => l.length > 9) || labels.join("").length + labels.length * 2 > 44;

/** At most two lines no wider than `max` px, the second ending in an ellipsis when the text runs on. */
function fitLabel(label: string, max: number, size: number, family: string, maxLines = 2): string {
  if (measureText(label, size, family) <= max) return label;
  const lines = wrapText(label, max, size, family);
  const kept = lines.slice(0, maxLines).map((l) => truncateText(l, max, size, family));
  if (lines.length > maxLines) kept[maxLines - 1] = truncateText(`${lines.slice(maxLines - 1).join(" ")}`, max, size, family);
  return kept.join("\n");
}

/**
 * Bars for comparing categories. The value axis always starts at zero, bars are sorted
 * unless the categories have a natural order, and a single series is labelled directly
 * so the value axis can disappear.
 */
export const BarChart = defineChart<BarChartProps>({
  name: "bar-chart",
  title: "Bar chart",
  category: "comparison",
  description: "Compares a value across categories with bars from a zero baseline.",
  whenToUse: "Ranking or comparing up to about 20 categories; grouped for a few series, stacked when the total and its composition both matter.",
  avoid: "Change over many time points (use line-chart); two values per category (use dumbbell-chart); more than about 5 stacked segments.",
  use: [EBar],
  defaults: { orientation: "auto" },
  selectField: (p) => p.x,
  // Long rankings grow taller instead of squeezing their bars, and a handful of horizontal
  // bars get a compact block instead of being spread over the default height.
  height: (p, rows) => {
    if (p.orientation === "vertical") return undefined;
    const names = [...new Set(rows.map((r) => String(r[p.x])))];
    const n = names.length;
    const groups = p.stack ? 1 : Array.isArray(p.y) ? p.y.length : p.series ? new Set(rows.map((r) => String(r[p.series!]))).size : 1;
    const natural = n * (18 + groups * 14) + 40;
    if (n > 10) return Math.max(360, natural);
    // Only when the layout is certain to be horizontal at every width; otherwise `build` keeps the rows together.
    const horizontal = p.orientation === "horizontal" || (n > 0 && !isTemporal(rows[0][p.x]) && sideways(names));
    return horizontal ? Math.max(96, natural) : undefined;
  },
  props: [
    { name: "x", type: "string", required: true, description: "Category field." },
    { name: "y", type: "string | string[]", required: true, description: "Value field, or several for grouped / stacked bars." },
    { name: "series", type: "string", description: "Field that splits rows into series (long data)." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Horizontal for rankings and long labels, vertical for time." },
    { name: "sort", type: '"none" | "asc" | "desc"', description: "Bar order. Default: descending for rankings, data order for time." },
    { name: "stack", type: 'boolean | "percent"', default: "false", description: "Stack series; `percent` normalises to 100%." },
    { name: "labels", type: "boolean", description: "Value labels at bar ends. Default: on for one series of up to 12 bars." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: { type: "bar-chart", data: [{ country: "Norway", share: 98 }, { country: "Brazil", share: 89 }, { country: "Canada", share: 68 }], x: "country", y: "share", format: "{value}%", title: "Renewables supplied 98% of Norway's electricity in 2023" },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const single = shaped.series.length === 1;
    const percent = p.stack === "percent";
    const stacked = !!p.stack && !single;
    const horizontal = p.orientation === "horizontal" || (p.orientation !== "vertical" && !shaped.temporal && sideways(shaped.labels));
    // Decided from the props, not the data: a multi-series chart filtered down to one series must not start re-sorting.
    const multi = !!p.series || (Array.isArray(p.y) && p.y.length > 1);
    const sort = p.sort ?? (shaped.temporal || multi ? "none" : "desc");

    // Order positions, then read every series through that order.
    let order = shaped.labels.map((_, i) => i);
    if (sort !== "none") {
      const total = (i: number) => shaped.series.reduce((s, sr) => s + (sr.values[i] ?? 0), 0);
      order.sort((a, b) => (sort === "desc" ? total(b) - total(a) : total(a) - total(b)));
    }
    const labels = order.map((i) => shaped.labels[i]);
    const totals = order.map((i) => shaped.series.reduce((s, sr) => s + Math.abs(sr.values[i] ?? 0), 0));
    const fmt = percent && !p.format ? ctx.formatter("percent") : ctx.fmt;
    const showLabels = p.labels ?? (single && labels.length <= 12);
    const r = t.radius;
    // A few horizontal bars in a tall plot: cap the band so the rows sit together at the top
    // instead of being spread over the whole height with large gaps.
    const hideValueAxis = showLabels && single;
    const rowH = 18 + (stacked || single ? 1 : shaped.series.length) * 14;
    const capped = horizontal && labels.length > 0 && (ctx.height - (hideValueAxis ? 16 : 44)) / labels.length > rowH * 1.5;

    const series = shaped.series.map((s, si) => {
      const last = si === shaped.series.length - 1;
      const round = !stacked || last;
      const color = single ? undefined : ctx.color(s.key, si);
      return {
        id: s.key,
        name: s.name,
        type: "bar" as const,
        stack: stacked ? "total" : undefined,
        barMaxWidth: 24,
        barGap: "8%",
        ...morph,
        // With `select` on, a click rebuilds the option under the pointer and series focus would leave the others blurred.
        emphasis: { focus: single || p.select ? ("none" as const) : ("series" as const) },
        itemStyle: {
          borderRadius: round ? (horizontal ? [0, r, r, 0] : [r, r, 0, 0]) : 0,
          // The 2px surface gap that separates stacked segments.
          ...(stacked ? { borderColor: t.surface, borderWidth: 1 } : null),
        },
        label: {
          show: showLabels,
          position: stacked ? ("inside" as const) : horizontal ? ("right" as const) : ("top" as const),
          formatter: (d: any) => (stacked && Math.abs(d.value) / (percent ? 1 : Math.max(...totals)) < 0.08 ? "" : fmt(d.value)),
          ...labelStyle(ctx, stacked ? { color: inkOn(color ?? t.accent) } : { color: t.ink }),
          fontVariantNumeric: "tabular-nums",
        },
        data: order.map((i, pos) => {
          const raw = s.values[i];
          const value = raw == null ? null : percent ? (totals[pos] ? raw / totals[pos] : 0) : raw;
          const fill = color ?? ctx.color(shaped.labels[i]);
          return { name: shaped.labels[i], value, itemStyle: { color: ctx.selected(shaped.labels[i]) ? fill : alpha(fill, 0.25) } };
        }),
      };
    });

    // Category labels are fitted to measured text, never dropped. Sideways: the label column is
    // as wide as its longest name, up to a share of the width, then two lines, then an ellipsis.
    // Upright: one line if every name fits its band, else wrapped, else rotated.
    const size = t.fontSize;
    const lineHeight = Math.round(size * 1.25);
    let categoryLabel: Record<string, unknown> = {};
    if (horizontal) {
      const column = Math.floor(ctx.width * (ctx.compact ? 0.42 : 0.36));
      const fitted = new Map(labels.map((l) => [l, fitLabel(l, column, size, t.fontFamily)]));
      categoryLabel = { color: t.inkSecondary, hideOverlap: false, interval: 0, lineHeight, formatter: (l: string) => fitted.get(l) ?? l };
    } else if (!shaped.temporal && labels.length > 0) {
      const gutter = hideValueAxis ? 16 : 28 + Math.max(...totals.map((v) => measureText(fmt(percent ? 1 : v), size, t.fontFamily)));
      const band = (ctx.width - gutter) / labels.length - 8;
      const widest = Math.max(...labels.map((l) => measureText(l, size, t.fontFamily)));
      if (widest <= band) categoryLabel = { hideOverlap: false, interval: 0 };
      else {
        const wrapped = new Map(labels.map((l) => [l, wrapText(l, band, size, t.fontFamily)]));
        const fits = [...wrapped.values()].every((lines) => lines.length <= 3 && lines.every((line) => measureText(line, size, t.fontFamily) <= band));
        if (fits) categoryLabel = { hideOverlap: false, interval: 0, lineHeight, formatter: (l: string) => wrapped.get(l)?.join("\n") ?? l };
        // Too narrow even for rotated text: only then let ECharts thin the labels.
        else if (band + 8 >= size + 4) categoryLabel = { hideOverlap: false, interval: 0, rotate: 40, formatter: (l: string) => truncateText(l, 120, size, t.fontFamily) };
      }
    }
    const category = shaped.temporal && !horizontal ? categoryAxis(ctx, { data: labels }) : categoryAxis(ctx, { data: labels, inverse: horizontal, axisLine: { show: !horizontal }, axisLabel: categoryLabel });
    const value = hideValueAxis ? hiddenAxis("value", percent ? { max: 1 } : {}) : valueAxis(ctx, { max: percent ? 1 : undefined, axisLabel: { formatter: (v: number) => fmt(v) } });

    const legend: LegendItem[] = single ? [] : shaped.series.map((s, i) => ({ name: s.name, color: ctx.color(s.key, i), muted: ctx.dimmed(s.key) }));
    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;

    const notes = horizontal ? p.annotations ?? [] : [];
    const peak = Math.max(0, ...(stacked ? totals : shaped.series.flatMap((sr) => sr.values.map((v) => v ?? 0))));
    const place = (option: Record<string, any>) => {
      if (notes.length) return transposeAnnotations(option, notes, ctx);
      if (horizontal || !p.annotations?.length) return option;
      // Upright bars: keep annotation labels off the bars and inside the frame.
      const n = labels.length || 1;
      return fitAnnotations(option, p.annotations, ctx, {
        sink: "bar",
        marks: order.map((i, pos) => ({ fx: (pos + 0.5) / n, y: percent ? 1 : stacked ? totals[pos] : Math.max(0, ...shaped.series.map((sr) => sr.values[i] ?? 0)), bar: true })),
        fx: (x) => (labels.indexOf(String(x)) < 0 ? undefined : (labels.indexOf(String(x)) + 0.5) / n),
        yMin: 0,
        yMax: percent ? 1 : peak,
        left: hideValueAxis ? 4 : 44,
        halfMark: 12,
      });
    };
    return {
      legend,
      alt: `Bar chart of ${yName} by ${p.x}. ${single ? describeExtremes(shaped.labels, shaped.series[0].values, fmt) : `${shaped.series.length} series: ${shaped.series.map((s) => s.name).join(", ")}.`}`,
      option: place({
        grid: { right: hideValueAxis && horizontal ? 48 : 12, top: hideValueAxis && !horizontal ? 24 : 12, ...(capped ? { height: Math.round(labels.length * rowH * 1.25), bottom: "auto" } : null) },
        xAxis: horizontal ? value : category,
        yAxis: horizontal ? category : value,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow", shadowStyle: { color: alpha(t.muted, 0.1) } },
          formatter: (items: any) => {
            const list = Array.isArray(items) ? items : [items];
            return tooltipHtml(ctx, list[0]?.name, list.filter((d: any) => d.value != null).map((d: any) => ({ name: single ? yName : d.seriesName, value: fmt(d.value), color: d.data?.itemStyle?.color })));
          },
        },
        series,
      }),
    };
  },
});
