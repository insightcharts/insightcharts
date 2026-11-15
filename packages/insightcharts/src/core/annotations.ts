import type { ChartContext } from "./chart";
import { alpha } from "./color";
import type { EChartsOption } from "./echarts";

/**
 * Annotations mark a date, a threshold or a single value on a chart. Use two or three at
 * most. They are plain JSON and are positioned in data coordinates, so they stay in place
 * when the chart is resized.
 */
export type Annotation =
  /** A reference line at a value on one axis: a target, an average, the date something happened. */
  | { type: "line"; axis: "x" | "y"; value: string | number; label?: string; dashed?: boolean; emphasis?: boolean }
  /** A shaded range on one axis: a recession, a lockdown, a target zone. */
  | { type: "band"; axis: "x" | "y"; from: string | number; to: string | number; label?: string }
  /** A callout anchored to a data point. `label` supports line breaks with `\n`. */
  | { type: "point"; x: string | number; y: number; label: string; position?: "top" | "bottom" | "left" | "right"; dot?: boolean };

type Obj = Record<string, any>;

const toX = (v: unknown): number => (typeof v === "number" ? v : v instanceof Date ? v.getTime() : Date.parse(String(v)));

/** Where along the x axis (0 = left edge, 1 = right edge) a value sits, or null when unknown. */
function xFraction(option: EChartsOption, series: Obj[], x: string | number): number | null {
  const axis = (Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis) as Obj | undefined;
  if (!axis) return null;
  const flip = (f: number) => (axis.inverse ? 1 - f : f);
  if (Array.isArray(axis.data) && axis.data.length > 1) {
    const i = axis.data.findIndex((d: unknown) => String(typeof d === "object" && d !== null ? (d as Obj).value : d) === String(x));
    return i === -1 ? null : flip(i / (axis.data.length - 1));
  }
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    if (!Array.isArray(s.data)) continue;
    for (const d of s.data) {
      const v = toX(Array.isArray(d) ? d[0] : Array.isArray(d?.value) ? d.value[0] : NaN);
      if (Number.isNaN(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const at = toX(x);
  return max > min && !Number.isNaN(at) ? flip((at - min) / (max - min)) : null;
}

const NON_CARTESIAN = new Set(["pie", "sankey", "treemap", "sunburst", "map", "funnel", "gauge", "graph", "tree", "radar", "chord", "parallel", "themeRiver"]);

/** Attach annotations to the first cartesian series of an option as markLine / markArea / markPoint. */
export function applyAnnotations(option: EChartsOption, annotations: Annotation[] | undefined, ctx: ChartContext): EChartsOption {
  if (!annotations?.length) return option;
  const series = (Array.isArray(option.series) ? option.series : option.series ? [option.series] : []) as Obj[];
  if (!series.length) return option;
  // Marks are positioned on cartesian axes; charts without them ignore annotations.
  const kind = String(series[0].type ?? "");
  const system = series[0].coordinateSystem;
  if (NON_CARTESIAN.has(kind) || (system !== undefined && system !== "cartesian2d")) return option;
  const t = ctx.tokens;
  const text = { color: t.inkSecondary, fontSize: t.fontSize, fontFamily: t.fontFamily, lineHeight: Math.round(t.fontSize * 1.35) };
  const lines: Obj[] = [];
  const bands: Obj[][] = [];
  const points: Obj[] = [];
  // A callout near either edge opens inward, so its text is never clipped by the plot.
  const autoPosition = (x: string | number) => {
    const f = xFraction(option, series, x);
    return f == null ? "top" : f > 0.82 ? "left" : f < 0.18 ? "right" : "top";
  };
  for (const a of annotations) {
    if (a.type === "line") {
      lines.push({
        [a.axis === "x" ? "xAxis" : "yAxis"]: a.value,
        lineStyle: { color: a.emphasis ? t.ink : t.muted, width: 1, type: a.dashed === false ? "solid" : "dashed" },
        label: { show: !!a.label, formatter: a.label ?? "", position: a.axis === "x" ? "end" : "insideEndTop", ...text },
      });
    } else if (a.type === "band") {
      const key = a.axis === "x" ? "xAxis" : "yAxis";
      bands.push([{ [key]: a.from, name: a.label ?? "", label: { show: !!a.label, position: a.axis === "x" ? "insideTop" : "insideTopLeft", ...text } }, { [key]: a.to }]);
    } else {
      points.push({
        coord: [a.x, a.y],
        // A symbol of "none" also drops the label, so a hidden dot is a transparent 1px one.
        symbol: "circle",
        symbolSize: a.dot === false ? 1 : 9,
        itemStyle: a.dot === false ? { color: "transparent", borderWidth: 0 } : { color: t.surface, borderColor: t.ink, borderWidth: 1.5 },
        label: { show: true, formatter: a.label, position: a.position ?? autoPosition(a.x), distance: 8, ...text, color: t.ink, textBorderColor: t.surface, textBorderWidth: 3 },
      });
    }
  }
  const first: Obj = { ...series[0] };
  if (lines.length) first.markLine = { silent: true, symbol: "none", animation: ctx.animate, data: [...(first.markLine?.data ?? []), ...lines] };
  if (bands.length) first.markArea = { silent: true, itemStyle: { color: alpha(t.muted, 0.12) }, data: [...(first.markArea?.data ?? []), ...bands] };
  if (points.length) first.markPoint = { silent: true, animation: ctx.animate, data: [...(first.markPoint?.data ?? []), ...points] };
  return { ...option, series: [first, ...series.slice(1)] as EChartsOption["series"] };
}
