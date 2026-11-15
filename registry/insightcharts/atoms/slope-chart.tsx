"use client";

import { LineChart as ELine, ScatterChart as EScatter } from "echarts/charts";
import { defineChart, dodge, measureText, truncateText, categoryAxis, hiddenAxis, morph, tooltipHtml, shapeSeries, type ShapedSeries } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface SlopeChartProps {
  /** Entity field: one line each. Required for long data and for one-row-per-entity data. */
  series?: string;
  /** Period field, for long data (`{ country, year, value }`). Omit when each row is an entity with one column per period. */
  x?: string;
  /** Value field (long data), or the period columns in order (one row per entity). */
  y: string | string[];
  /** `"none"`: every line in the accent. `"direction"`: rises and falls in the positive / negative colours. `"series"`: one hue per entity, up to 8. */
  colorBy?: "none" | "direction" | "series";
  /** Which direction takes the positive colour when `colorBy` is `"direction"`. */
  good?: "up" | "down";
  /** Print entity names. `"both"` ends, or only the `"end"`. Default: both, end only on narrow screens. */
  labels?: "both" | "end";
  /** Display names for entity keys and period columns. */
  names?: Record<string, string>;
}

/**
 * Lines between two (or a few) moments, labelled at both ends. The slope of each line
 * shows the direction and size of the change.
 */
export const SlopeChart = defineChart<SlopeChartProps>({
  name: "slope-chart",
  title: "Slope chart",
  category: "trend",
  description: "Connects each entity's value at two (or a few) points with a straight line, labelled with name and value at both ends.",
  whenToUse: "Before / after for 3 to about 15 entities when the change in level and in ordering both matter; pair with `highlight` to emphasise one line.",
  avoid: "Five or more time points (use line-chart); when only the ordering matters (use bump-chart); when only the size of each gap matters (use dumbbell-chart or arrow-chart).",
  use: [ELine, EScatter],
  defaults: { colorBy: "none", good: "up" },
  selectField: (p) => p.series,
  selectValue: (params) => params.seriesId,
  props: [
    { name: "series", type: "string", required: true, description: "Entity field: one line each." },
    { name: "x", type: "string", description: "Period field for long data. Omit when each row is an entity with one column per period." },
    { name: "y", type: "string | string[]", required: true, description: "Value field (long data), or the period columns in order (one row per entity)." },
    { name: "colorBy", type: '"none" | "direction" | "series"', default: '"none"', description: "Accent for all lines, positive / negative by direction, or one hue per entity (up to 8)." },
    { name: "good", type: '"up" | "down"', default: '"up"', description: "Direction that takes the positive colour when colouring by direction." },
    { name: "labels", type: '"both" | "end"', description: "Entity names at both ends or only the end. Default: both; end only on narrow screens." },
    { name: "names", type: "Record<string, string>", description: "Display names for entity keys and period columns." },
  ],
  example: {
    type: "slope-chart",
    data: [
      { country: "United Kingdom", y2012: 39, y2023: 1 },
      { country: "Germany", y2012: 44, y2023: 26 },
      { country: "United States", y2012: 37, y2023: 16 },
      { country: "Poland", y2012: 84, y2023: 61 },
      { country: "India", y2012: 71, y2023: 75 },
      { country: "Japan", y2012: 29, y2023: 32 },
    ],
    series: "country",
    y: ["y2012", "y2023"],
    names: { y2012: "2012", y2023: "2023" },
    highlight: "United Kingdom",
    format: "{value}%",
    title: "The UK's coal share of electricity fell from 39% to 1% between 2012 and 2023",
    subtitle: "Share of electricity generated from coal, 2012 and 2023",
    source: "Ember (rounded)",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const tw = (s: string, weight = 400) => measureText(s, t.fontSize, t.fontFamily, weight);
    let labels: string[];
    let series: ShapedSeries[];
    if (p.x) {
      const shaped = shapeSeries(ctx.rows, { x: p.x, y: p.y, series: p.series }, p.names);
      labels = shaped.labels.map((l) => p.names?.[l] ?? l);
      series = shaped.series;
    } else {
      const cols = Array.isArray(p.y) ? p.y : [p.y];
      labels = cols.map((c) => p.names?.[c] ?? c);
      series = ctx.rows.map((r) => {
        const key = String(r[p.series ?? ""]);
        return { key, name: p.names?.[key] ?? key, values: cols.map((c) => { const v = toNumber(r[c]); return Number.isNaN(v) ? null : v; }) };
      });
    }
    const n = labels.length;
    const last = Math.max(0, n - 1);
    const complete = series.filter((s) => s.values[0] != null && s.values[last] != null);
    const change = (s: ShapedSeries) => (s.values[last] ?? 0) - (s.values[0] ?? 0);

    const all = series.flatMap((s) => s.values.filter((v): v is number => v != null));
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const range = hi - lo || 1;

    const byDirection = p.colorBy === "direction";
    const bySeries = p.colorBy === "series" && series.length <= 8;
    const colorOf = (s: ShapedSeries, i: number) => {
      if (ctx.dimmed(s.key)) return t.context;
      if (byDirection && !p.highlight) {
        const d = change(s);
        return d === 0 ? t.muted : d > 0 === (p.good !== "down") ? t.positive : t.negative;
      }
      return bySeries ? ctx.color(s.key, i) : ctx.color(s.key);
    };

    // The plot rectangle is fixed in pixels so label positions can be worked out here.
    const top = 30;
    const bottom = 10;
    const H = Math.max(40, ctx.height - top - bottom);
    const py = (v: number) => top + ((hi - v) / range) * H;
    const fromPy = (y: number) => hi - ((y - top) / H) * range;
    const gap = 16;

    // When there are more lines than label slots, the highlighted lines and then the biggest movers keep their labels.
    const capacity = Math.floor(H / gap) + 1;
    const ranked = [...complete].sort((a, b) => Number(ctx.dimmed(a.key)) - Number(ctx.dimmed(b.key)) || Math.abs(change(b)) - Math.abs(change(a)));
    const labelled = ranked.slice(0, capacity);

    const both = (p.labels ?? (ctx.compact ? "end" : "both")) === "both";
    const valW = Math.max(0, ...all.map((v) => tw(fmt(v), 600)));
    const nameCap = Math.round(ctx.width * (both ? 0.24 : ctx.compact ? 0.36 : 0.3));
    const nameW = Math.min(nameCap, Math.max(0, ...labelled.map((s) => tw(s.name))));
    const leftAt = labelled.map((s) => py(s.values[0]!));
    const rightAt = labelled.map((s) => py(s.values[last]!));
    // Core `dodge` clamps each cluster to the range after merging, so a cluster pushed back in from an
    // edge can land on its neighbour; feeding the result back in merges them.
    const spread = (at: number[]) => {
      let ys = dodge(at, gap, top, top + H);
      for (let pass = 0; pass < 6; pass++) {
        const sorted = [...ys].sort((x, y) => x - y);
        if (!sorted.some((y, k) => k > 0 && y - sorted[k - 1] < gap - 0.5)) break;
        ys = dodge(ys, gap, top, top + H);
      }
      return ys;
    };
    const leftY = spread(leftAt);
    const rightY = spread(rightAt);
    // A label pushed away from its point gets a leader line, and the labels step outward to make room for it.
    const moved = (at: number[], ys: number[], k: number) => Math.abs(ys[k] - at[k]) > 4;
    const distL = labelled.some((_, k) => moved(leftAt, leftY, k)) ? 22 : 10;
    const distR = labelled.some((_, k) => moved(rightAt, rightY, k)) ? 22 : 10;
    const leftW = Math.round((both ? nameW + 8 : 0) + valW + 6 + distL);
    const rightW = Math.round(nameW + 8 + valW + 6 + distR);
    const leaders = labelled.flatMap((s, k) => {
      const style = { stroke: t.axis, lineWidth: 1, opacity: ctx.selected(s.key) ? 1 : 0.35 };
      const out: any[] = [];
      if (moved(leftAt, leftY, k)) out.push({ type: "polyline", silent: true, z: 2, shape: { points: [[leftW - 7, leftAt[k]], [leftW - 13, leftY[k]], [leftW - distL + 3, leftY[k]]] }, style: { ...style, fill: "none" } });
      if (moved(rightAt, rightY, k)) out.push({ type: "polyline", silent: true, z: 2, shape: { points: [[ctx.width - rightW + 7, rightAt[k]], [ctx.width - rightW + 13, rightY[k]], [ctx.width - rightW + distR - 3, rightY[k]]] }, style: { ...style, fill: "none" } });
      return out;
    });

    const rich = (dim: boolean) => ({
      n: { color: dim ? t.muted : t.inkSecondary, fontSize: t.fontSize, fontFamily: t.fontFamily },
      v: { color: dim ? t.muted : t.ink, fontSize: t.fontSize, fontFamily: t.fontFamily, fontWeight: dim ? 400 : 600 },
    });
    const labelSeries = (side: "left" | "right") => ({
      id: `labels-${side}`,
      type: "scatter" as const,
      silent: true,
      clip: false,
      symbolSize: 1,
      z: 5,
      itemStyle: { color: "transparent" },
      tooltip: { show: false },
      data: labelled.map((s, k) => {
        const dim = ctx.dimmed(s.key);
        const v = fmt(s.values[side === "left" ? 0 : last]);
        const name = truncateText(s.name, nameW, t.fontSize, t.fontFamily);
        return {
          name: s.key,
          value: [labels[side === "left" ? 0 : last], fromPy(side === "left" ? leftY[k] : rightY[k])],
          label: {
            show: true,
            position: side,
            distance: side === "left" ? distL : distR,
            opacity: ctx.selected(s.key) ? 1 : 0.35,
            formatter: side === "left" ? (both ? `{n|${name}}  {v|${v}}` : `{v|${v}}`) : `{v|${v}}  {n|${name}}`,
            rich: rich(dim),
          },
        };
      }),
    });

    const lines = series.map((s, i) => {
      const dim = ctx.dimmed(s.key);
      const color = colorOf(s, i);
      const opacity = ctx.selected(s.key) ? 1 : 0.25;
      return {
        id: s.key,
        name: s.name,
        type: "line" as const,
        ...morph,
        z: dim ? 1 : 3,
        connectNulls: true,
        symbol: "circle",
        symbolSize: dim ? 6 : 8,
        lineStyle: { width: dim ? 1.25 : t.lineWidth, color, opacity, cap: "round" as const },
        itemStyle: { color, borderColor: t.surface, borderWidth: dim ? 1 : 2, opacity },
        emphasis: { focus: p.select ? ("none" as const) : ("series" as const), lineStyle: { width: dim ? 1.5 : t.lineWidth + 0.5 } },
        data: s.values,
      };
    });

    const rises = [...complete].sort((a, b) => change(b) - change(a));
    const up = rises[0];
    const down = rises[rises.length - 1];
    const describe = (s: ShapedSeries) => `${s.name} (${fmt(s.values[0])} to ${fmt(s.values[last])})`;
    const focus = p.highlight ? complete.filter((s) => !ctx.dimmed(s.key)) : [];
    const yName = p.x ? (Array.isArray(p.y) ? p.y[0] : p.y) : "values";

    return {
      legend: [],
      alt: `Slope chart of ${yName} for ${series.length} ${p.series ?? "entities"} from ${labels[0]} to ${labels[last]}. ${focus.length ? `Highlighted: ${focus.map(describe).join("; ")}. ` : ""}${up && change(up) > 0 ? `Largest rise: ${describe(up)}. ` : ""}${down && change(down) < 0 ? `Largest fall: ${describe(down)}.` : ""}`.trim(),
      option: {
        grid: { left: leftW, right: rightW, top, bottom, outerBoundsMode: "none" },
        xAxis: categoryAxis(ctx, {
          data: labels,
          boundaryGap: false,
          position: "top",
          axisLine: { show: false },
          axisLabel: { color: t.ink, fontWeight: 600, hideOverlap: false, margin: 12, interval: 0 },
          splitLine: { show: true, lineStyle: { color: t.grid, width: 1 } },
        }),
        yAxis: hiddenAxis("value", { min: lo, max: hi }),
        graphic: leaders.length ? leaders : undefined,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const s = series.find((it) => it.key === d.seriesId);
            if (!s) return "";
            const rows = labels.map((l, j) => ({ name: l, value: fmt(s.values[j]) })).filter((r) => r.value !== "");
            const c = change(s);
            return tooltipHtml(ctx, s.name, [...rows, { name: "Change", value: (c > 0 ? "+" : "") + fmt(c), color: d.color }]);
          },
        },
        series: [...lines, labelSeries("left"), labelSeries("right")] as any[],
      },
    };
  },
});
