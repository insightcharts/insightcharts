"use client";

import { BarChart as EBar, LineChart as ELine } from "echarts/charts";
import { alpha, defineChart, hiddenAxis, labelStyle, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface SparklineProps {
  /** Value field. */
  y: string;
  /** Optional time or label field; only used in the tooltip and alt text. Rows are drawn in data order. */
  x?: string;
  /** `"line"` for a trend, `"bar"` for discrete counts or wins and losses. */
  mark?: "line" | "bar";
  /** Mark the lowest and highest points with small dots. */
  extremes?: boolean;
  /** A shaded reference range `[from, to]` in value units: a normal range or a target zone. */
  band?: [number, number];
  /** Light fill under the line. Forces the scale to include zero. */
  area?: boolean;
  /** Print the last value after the line. */
  showValue?: boolean;
  /** Include zero in the scale. Default: off for lines (they encode position), always on for bars. */
  zero?: boolean;
}

/**
 * A word-sized chart: no axes, no gridlines, no title needed. The last point is marked
 * because a sparkline usually sits next to the latest value.
 */
export const Sparkline = defineChart<SparklineProps>({
  name: "sparkline",
  title: "Sparkline",
  category: "trend",
  description: "A word-sized line or bar series without axes, with the latest point marked.",
  whenToUse: "Showing the recent history of a number inside a stat tile, a table cell or a sentence, where the shape of the trend matters and exact values do not.",
  avoid: "Anything the reader must read values from or compare across series (use line-chart); fewer than about 5 points (state the change in words or use big-number with a delta).",
  use: [ELine, EBar],
  defaults: { height: 40, mark: "line" },
  props: [
    { name: "y", type: "string", required: true, description: "Value field." },
    { name: "x", type: "string", description: "Time or label field, used in the tooltip and alt text. Rows are drawn in data order." },
    { name: "mark", type: '"line" | "bar"', default: '"line"', description: "Line for a trend, bars for discrete counts or gains and losses (negative bars take the negative colour)." },
    { name: "extremes", type: "boolean", default: "false", description: "Mark the lowest and highest points with small dots." },
    { name: "band", type: "[number, number]", description: "Shaded reference range in value units, e.g. a normal range." },
    { name: "area", type: "boolean", default: "false", description: "Light fill under the line; forces a zero baseline." },
    { name: "showValue", type: "boolean", default: "false", description: "Print the last value after the line." },
    { name: "zero", type: "boolean", description: "Include zero in the scale. Default: off for lines, always on for bars." },
  ],
  example: {
    type: "sparkline",
    data: [3.9, 3.8, 3.8, 3.6, 3.5, 3.6, 3.4, 3.7, 3.8, 3.9, 4.1, 4.3, 4.2, 4.1, 4.2, 4.4].map((rate, i) => ({ month: new Date(Date.UTC(2023, 6 + i, 1)).toISOString().slice(0, 7), rate })),
    x: "month",
    y: "rate",
    format: "{value}%",
    showValue: true,
    extremes: true,
    style: { maxWidth: 220 },
    alt: "Sparkline of the unemployment rate over 16 months, July 2023 to October 2024. It started at 3.9%, fell to 3.4% in January 2024 and ended at 4.4%, the highest in the period.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const values = ctx.rows.map((r) => {
      const v = toNumber(r[p.y]);
      return Number.isNaN(v) ? null : v;
    });
    const names = ctx.rows.map((r, i) => (p.x ? String(r[p.x] ?? "") : String(i + 1)));
    const bar = p.mark === "bar";
    let lo = Infinity;
    let hi = -Infinity;
    let iLo = -1;
    let iHi = -1;
    let iLast = -1;
    let iFirst = -1;
    values.forEach((v, i) => {
      if (v == null) return;
      if (iFirst === -1) iFirst = i;
      iLast = i;
      if (v < lo) [lo, iLo] = [v, i];
      if (v > hi) [hi, iHi] = [v, i];
    });
    if (iLast === -1) [lo, hi] = [0, 1];
    let min = lo;
    let max = hi;
    if (p.band) {
      min = Math.min(min, p.band[0], p.band[1]);
      max = Math.max(max, p.band[0], p.band[1]);
    }
    if (bar || p.area || p.zero) {
      min = Math.min(min, 0);
      max = Math.max(max, 0);
    }
    if (min === max) [min, max] = [min - 1, max + 1];

    const color = ctx.color();
    const lastLabel = iLast >= 0 && p.showValue ? fmt(values[iLast]) : "";
    // Room for the value label; digits are about 0.6em wide.
    const right = lastLabel ? Math.ceil(lastLabel.length * t.fontSize * 0.62) + 12 : 6;
    const valueLabel = { show: true, position: "right" as const, distance: 7, formatter: lastLabel, ...labelStyle(ctx, { color: t.ink, fontWeight: 600 }), fontVariantNumeric: "tabular-nums" };

    const data = values.map((v, i) => {
      const last = i === iLast;
      const extreme = !!p.extremes && (i === iLo || i === iHi) && !last && iLo !== iHi;
      if (bar) {
        const fill = v != null && v < 0 ? t.negative : color;
        return { name: names[i], value: v, itemStyle: { color: last ? fill : alpha(fill, 0.45) }, label: last && lastLabel ? { ...valueLabel, position: (v ?? 0) < 0 ? ("right" as const) : ("right" as const) } : undefined };
      }
      return {
        name: names[i],
        value: v,
        symbol: last || extreme ? "circle" : "none",
        symbolSize: last ? 7 : 5,
        itemStyle: last ? { color, borderColor: t.surface, borderWidth: 1.5 } : { color: t.inkSecondary, borderColor: t.surface, borderWidth: 1 },
        label: last && lastLabel ? valueLabel : undefined,
      };
    });

    const markArea = p.band ? { silent: true, itemStyle: { color: alpha(t.muted, 0.16) }, data: [[{ yAxis: Math.min(...p.band) }, { yAxis: Math.max(...p.band) }]] } : undefined;
    const series = bar
      ? { id: "spark", type: "bar" as const, ...morph, barCategoryGap: "22%", barMaxWidth: 10, itemStyle: { borderRadius: 1 }, emphasis: { disabled: true }, markArea, data }
      : {
          id: "spark",
          type: "line" as const,
          ...morph,
          showSymbol: true,
          showAllSymbol: true,
          connectNulls: false,
          lineStyle: { color, width: 1.5, cap: "round" as const, join: "round" as const },
          areaStyle: p.area ? { color: alpha(color, 0.14), origin: "start" as const } : undefined,
          emphasis: { disabled: true },
          markArea,
          data,
        };

    const what = p.x ? `${p.y} by ${p.x}` : p.y;
    const alt =
      iLast === -1
        ? `Sparkline of ${what}: no values.`
        : `Sparkline of ${what}: from ${fmt(values[iFirst])} to ${fmt(values[iLast])} over ${values.length} points; low ${fmt(lo)}${p.x ? ` (${names[iLo]})` : ""}, high ${fmt(hi)}${p.x ? ` (${names[iHi]})` : ""}.`;

    return {
      alt,
      option: {
        // Fixed margins: a sparkline has no axis labels for the grid to make room for.
        grid: { left: 5, right, top: 5, bottom: 5, outerBoundsMode: "none" },
        xAxis: hiddenAxis("category", { data: names, boundaryGap: bar }),
        yAxis: hiddenAxis("value", { min, max }),
        tooltip: {
          trigger: "axis",
          confine: false,
          appendTo: typeof document === "undefined" ? undefined : () => document.body,
          padding: [5, 8],
          axisPointer: { type: bar ? "shadow" : "line", lineStyle: { color: t.axis, width: 1 }, shadowStyle: { color: alpha(t.muted, 0.12) } },
          position: (point: number[], _params: unknown, _dom: unknown, _rect: unknown, size: { contentSize: number[] }) => [point[0] - size.contentSize[0] / 2, -size.contentSize[1] - 6],
          formatter: (items: any) => {
            const d = (Array.isArray(items) ? items : [items])[0];
            if (!d || d.value == null) return "";
            return tooltipHtml(ctx, undefined, [{ name: d.name, value: fmt(d.value) }]);
          },
        },
        series: [series],
      },
    };
  },
});
