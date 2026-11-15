"use client";

import { type Annotation, type ChartContext, alpha, measureText, hiddenAxis } from "insightcharts/core";

// Room for annotation labels, shared by the cartesian chart atoms. Core draws annotations
// after `build` with fixed label positions and no knowledge of the marks, so the atoms
// (which do know where their marks are) reserve padding for labels that would clip and move
// a reference-line label that would sit on a bar or point. The leading underscore keeps this
// file out of the generated index. All of it belongs in core/annotations.ts.

type Obj = Record<string, any>;

export interface PlotMark {
  /** Horizontal position as a fraction of the plot width, 0 (left) to 1 (right). */
  fx: number;
  /** Value on the vertical axis. */
  y: number;
  /** Bars occupy everything between the baseline and `y`; other marks only their own spot. */
  bar?: boolean;
}

export interface PlotInfo {
  /** Where the marks are. Only those near the left and right edges matter. */
  marks: PlotMark[];
  /** Fraction of the plot width at which an annotation's `x` falls, or undefined when unknown. */
  fx(x: string | number): number | undefined;
  /** Extent of the vertical axis, estimated from the data. */
  yMin: number;
  yMax: number;
  /** Estimated px taken by the value-axis labels left of the plot. Default 40. */
  left?: number;
  /** Half the width of a mark in px. Default 6. */
  halfMark?: number;
  /** The series type of the placeholder that absorbs core's own copies: one the chart has registered. */
  sink: "bar" | "line" | "scatter";
}

type LinePosition = "insideEndTop" | "insideEndBottom" | "insideStartTop" | "insideStartBottom";

/**
 * Adjust a built option so its annotations fit: more right padding and headroom for labels
 * that would be cut off, and reference-line labels moved to a free corner when the default
 * (right end, above the line) is occupied by a mark. Returns the option unchanged when
 * nothing needs to move.
 */
export function fitAnnotations(option: Obj, notes: Annotation[] | undefined, ctx: ChartContext, info: PlotInfo): Obj {
  if (!notes?.length || Array.isArray(option.grid)) return option;
  const t = ctx.tokens;
  const lh = Math.round(t.fontSize * 1.35);
  const grid: Obj = option.grid ?? {};
  const top0 = typeof grid.top === "number" ? grid.top : 12;
  const right0 = typeof grid.right === "number" ? grid.right : 12;
  const left = info.left ?? 40;
  const plotW = Math.max(40, ctx.width - left - right0);
  const plotH = Math.max(40, ctx.height - top0 - 28);
  const lo = Math.min(info.yMin, ...notes.flatMap((a) => (a.type === "point" ? [a.y] : a.type === "line" && a.axis === "y" && typeof a.value === "number" ? [a.value] : [])));
  const hi = Math.max(info.yMax, ...notes.flatMap((a) => (a.type === "point" ? [a.y] : a.type === "line" && a.axis === "y" && typeof a.value === "number" ? [a.value] : [])));
  const span = hi - lo || 1;
  const size = (label: string) => {
    const lines = label.split("\n");
    return { w: Math.max(...lines.map((l) => measureText(l, t.fontSize, t.fontFamily))), h: lines.length * lh };
  };

  // 1. Padding: labels centred on a point or on a vertical line overflow the plot's right
  // edge and top when their anchor is near it.
  let overRight = 0;
  let overTop = 0;
  // Moving the plot edge in by `e` moves an anchor at fraction f by only `e * f`, hence the division.
  const needRight = (px: number, f: number, extent: number) => {
    const over = px + extent - (ctx.width - 2);
    if (over > 0 && f > 0.05) overRight = Math.max(overRight, over / f);
  };
  for (const a of notes) {
    if (a.type === "point") {
      const f = info.fx(a.x);
      const { w, h } = size(a.label);
      const fy = Math.min(1, Math.max(0, (a.y - lo) / span));
      const position = a.position ?? "top";
      if (f !== undefined) needRight(left + f * plotW, f, position === "right" ? w + 14 : position === "left" ? 6 : w / 2 + 2);
      const above = position === "top" ? h + 14 : position === "bottom" ? 6 : h / 2;
      const over = above - (top0 + (1 - fy) * plotH) + 2;
      if (over > 0 && fy > 0.05) overTop = Math.max(overTop, over / fy);
    } else if (a.type === "line" && a.axis === "x" && a.label) {
      // Core labels a vertical line above the plot ("end"), which needs headroom.
      const { w, h } = size(a.label);
      overTop = Math.max(overTop, h + 8 - top0);
      const f = info.fx(a.value);
      if (f !== undefined) needRight(left + f * plotW, f, w / 2 + 2);
    }
  }
  const addRight = Math.ceil(Math.min(overRight, ctx.width * 0.3));
  const addTop = Math.ceil(Math.min(overTop, 56));

  // 2. Horizontal reference lines: find a corner of the line that no mark occupies.
  const half = info.halfMark ?? 6;
  const delta = ((lh + 6) / plotH) * span;
  const moved = new Map<Annotation, LinePosition>();
  for (const a of notes) {
    if (a.type !== "line" || a.axis !== "y" || !a.label || typeof a.value !== "number") continue;
    const v = a.value;
    const reach = (size(a.label).w + 12 + half) / (plotW - addRight);
    const hit = (end: boolean, above: boolean) =>
      info.marks.some((m) => {
        if (end ? m.fx < 1 - reach : m.fx > reach) return false;
        // A bar (and the value label on its tip) fills everything up to its value.
        if (m.bar) return m.y > v - delta;
        return above ? m.y > v - delta * 0.3 && m.y < v + delta * 1.3 : m.y < v + delta * 0.3 && m.y > v - delta * 1.3;
      });
    const order: [LinePosition, boolean, boolean][] = [["insideEndTop", true, true], ["insideEndBottom", true, false], ["insideStartTop", false, true], ["insideStartBottom", false, false]];
    const free = order.find(([, end, above]) => !hit(end, above));
    if (free && free[0] !== "insideEndTop") moved.set(a, free[0]);
  }

  if (!addRight && !addTop && !moved.size) return option;
  const padded: Obj = { ...option, grid: { ...grid, right: right0 + addRight, top: top0 + addTop } };
  if (!moved.size) return padded;

  // Core attaches its own copies of the marks to the first series. Give it an empty series on
  // an off-canvas grid to draw them on, and attach the repositioned marks to the real one.
  const text = { color: t.inkSecondary, fontSize: t.fontSize, fontFamily: t.fontFamily, lineHeight: lh };
  const lines: Obj[] = [];
  const bands: Obj[][] = [];
  const points: Obj[] = [];
  for (const a of notes) {
    if (a.type === "line") {
      lines.push({ [a.axis === "x" ? "xAxis" : "yAxis"]: a.value, lineStyle: { color: a.emphasis ? t.ink : t.muted, width: 1, type: a.dashed === false ? "solid" : "dashed" }, label: { show: !!a.label, formatter: a.label ?? "", position: a.axis === "x" ? "end" : moved.get(a) ?? "insideEndTop", ...text } });
    } else if (a.type === "band") {
      const key = a.axis === "x" ? "xAxis" : "yAxis";
      bands.push([{ [key]: a.from, name: a.label ?? "", label: { show: !!a.label, position: a.axis === "x" ? "insideTop" : "insideTopLeft", ...text } }, { [key]: a.to }]);
    } else {
      points.push({ coord: [a.x, a.y], symbol: "circle", symbolSize: a.dot === false ? 1 : 9, itemStyle: a.dot === false ? { color: "transparent", borderWidth: 0 } : { color: t.surface, borderColor: t.ink, borderWidth: 1.5 }, label: { show: true, formatter: a.label, position: a.position ?? "top", distance: 8, ...text, color: t.ink, textBorderColor: t.surface, textBorderWidth: 3 } });
    }
  }
  const [first, ...rest] = padded.series as Obj[];
  const marked = {
    ...first,
    ...(lines.length ? { markLine: { silent: true, symbol: "none", animation: ctx.animate, data: [...(first.markLine?.data ?? []), ...lines] } } : null),
    ...(bands.length ? { markArea: { silent: true, itemStyle: { color: alpha(t.muted, 0.12) }, data: [...(first.markArea?.data ?? []), ...bands] } } : null),
    ...(points.length ? { markPoint: { silent: true, animation: ctx.animate, data: [...(first.markPoint?.data ?? []), ...points] } } : null),
  };
  const sink = { id: "__annotations-sink", type: info.sink, xAxisIndex: 1, yAxisIndex: 1, silent: true, tooltip: { show: false }, data: [] };
  return {
    ...padded,
    grid: [{ left: 4, bottom: 4, outerBoundsMode: "same", outerBoundsContain: "axisLabel", ...padded.grid }, { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" }],
    xAxis: [padded.xAxis, hiddenAxis("value", { gridIndex: 1 })],
    yAxis: [padded.yAxis, hiddenAxis("value", { gridIndex: 1 })],
    series: [sink, marked, ...rest],
  };
}
