"use client";

import { CustomChart, HeatmapChart } from "echarts/charts";
import { VisualMapComponent } from "echarts/components";
import { alpha, inkOn, ramp, defineChart, measureText, formatDate, isTemporal, categoryAxis, labelStyle, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface HeatmapProps {
  /** Column field: a category or a date. */
  x: string;
  /** Row field: a category. */
  y: string;
  /** Numeric field that colours each cell. One row of data per cell; aggregate first if there are several. */
  value: string;
  /** Use the diverging palette, centred on `midpoint`, for values with a meaningful middle (change, deviation from target). */
  diverging?: boolean;
  /** Centre of the diverging scale. Default 0. */
  midpoint?: number;
  /** Print the value in each cell. Default: on when the cells are large enough to hold it. */
  labels?: boolean;
  /** Order of rows: data order, or by row total. */
  sort?: "none" | "asc" | "desc";
  /** Fix the ends of the colour scale `[min, max]`, e.g. to share a scale between charts. */
  domain?: [number, number];
}

/**
 * A matrix of coloured cells: position names the pair, colour carries the magnitude.
 * Combinations that are absent from the data are drawn hatched, never as the lowest colour.
 */
export const Heatmap = defineChart<HeatmapProps>({
  name: "heatmap",
  title: "Heatmap",
  category: "comparison",
  description: "Colours a category-by-category (or time-by-category) grid by a numeric value, using a sequential or diverging scale.",
  whenToUse: "Finding patterns across two dimensions at once: hour by weekday, cohort by month, product by region. Good when there are too many series for lines or bars and the overall pattern matters more than exact values.",
  avoid: "Precise comparison of a few values (use bar-chart); a single series over time (use line-chart); a daily value across a year (use calendar-heatmap).",
  use: [HeatmapChart, CustomChart, VisualMapComponent],
  defaults: {},
  selectField: (p) => p.y,
  selectValue: (params) => params.data?.row ?? params.name,
  props: [
    { name: "x", type: "string", required: true, description: "Column field: a category or a date." },
    { name: "y", type: "string", required: true, description: "Row field." },
    { name: "value", type: "string", required: true, description: "Numeric field that colours each cell. One data row per cell." },
    { name: "diverging", type: "boolean", default: "false", description: "Diverging palette centred on `midpoint`, for values with a meaningful middle." },
    { name: "midpoint", type: "number", default: "0", description: "Centre of the diverging scale." },
    { name: "labels", type: "boolean", description: "Print the value in each cell. Default: on when cells are large enough." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order rows by their total." },
    { name: "domain", type: "[number, number]", description: "Fix the ends of the colour scale." },
  ],
  example: {
    type: "heatmap",
    theme: "dusk",
    data: [
      ["Mon", [12, 48, 61, 55, 38, 14]],
      ["Tue", [11, 52, 66, 58, 41, 15]],
      ["Wed", [13, 55, 70, 63, 44, 17]],
      ["Thu", [12, 51, 68, 60, 47, 22]],
      ["Fri", [10, 44, 59, 49, 52, 35]],
      ["Sat", [6, 18, 31, 36, 40, 38]],
      ["Sun", [5, 14, 26, 30, 28, 19]],
    ].flatMap(([day, counts]) => (counts as number[]).map((orders, i) => ({ day, slot: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"][i], orders }))),
    x: "slot",
    y: "day",
    value: "orders",
    title: "Orders peak at 70 per hour at 12pm on Wednesdays",
    subtitle: "Average orders per hour by weekday and time of day",
    note: "Illustrative data",
  },
  markCount: (rows) => rows.length,
  // Few rows should not stretch into tall slabs, and many rows need room to stay legible.
  height: (p, rows) => {
    const n = new Set(rows.map((r) => String(r[p.y] ?? ""))).size;
    return n <= 5 ? Math.max(150, n * 44 + 62) : n > 12 ? Math.min(900, n * 24 + 62) : undefined;
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;

    const xs: string[] = [];
    const ys: string[] = [];
    const xSeen = new Set<string>();
    const ySeen = new Set<string>();
    const cells = new Map<string, number>();
    let temporal = false;
    for (const r of ctx.rows) {
      if (r[p.x] == null || r[p.y] == null) continue;
      const rawX = r[p.x];
      const x = rawX instanceof Date ? rawX.toISOString().slice(0, 10) : String(rawX);
      const y = String(r[p.y]);
      if (!xSeen.has(x)) {
        if (!xs.length) temporal = isTemporal(rawX);
        xSeen.add(x);
        xs.push(x);
      }
      if (!ySeen.has(y)) {
        ySeen.add(y);
        ys.push(y);
      }
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v)) cells.set(`${x}\u0000${y}`, v);
    }
    if (temporal) xs.sort();
    if (p.sort === "asc" || p.sort === "desc") {
      const total = (y: string) => xs.reduce((s, x) => s + (cells.get(`${x}\u0000${y}`) ?? 0), 0);
      const totals = new Map(ys.map((y) => [y, total(y)]));
      ys.sort((a, b) => (p.sort === "asc" ? totals.get(a)! - totals.get(b)! : totals.get(b)! - totals.get(a)!));
    }

    let lo = Infinity;
    let hi = -Infinity;
    let loKey = "";
    let hiKey = "";
    for (const [k, v] of cells) {
      if (v < lo) [lo, loKey] = [v, k];
      if (v > hi) [hi, hiKey] = [v, k];
    }
    if (!cells.size) [lo, hi] = [0, 1];
    const mid = p.midpoint ?? 0;
    let min = lo;
    let max = hi;
    if (p.domain) [min, max] = p.domain;
    else if (p.diverging) {
      // Symmetric around the midpoint, so equal distances either side get equal colour.
      const span = Math.max(Math.abs(hi - mid), Math.abs(lo - mid)) || 1;
      [min, max] = [mid - span, mid + span];
    }
    if (min === max) max = min + 1;
    const colors = p.diverging ? t.diverging : t.sequential;
    // Mirrors the visualMap's own linear interpolation, to pick a readable ink per cell.
    const colorAt = (v: number) => ramp(colors, (v - min) / (max - min));

    const yLabelW = Math.min(ctx.compact ? 96 : 170, Math.max(...ys.map((y) => measureText(y, t.fontSize, t.fontFamily)), 8) + 14);
    const cellW = (ctx.width - yLabelW - 12) / Math.max(1, xs.length);
    const cellH = (ctx.height - 62) / Math.max(1, ys.length);
    const sample = [fmt(hi), fmt(lo)].reduce((a, b) => (b.length > a.length ? b : a), "");
    const showLabels = p.labels ?? (cellW >= measureText(sample, t.fontSize, t.fontFamily) + 10 && cellH >= 18);
    const gap = cellW >= 14 && cellH >= 14 ? 2 : cellW >= 6 && cellH >= 6 ? 1 : 0;

    const anyHighlight = ctx.dimmed("\u0000");
    const lit = (x: string, y: string) => !anyHighlight || !ctx.dimmed(y) || !ctx.dimmed(x);
    const xLabel = (x: string) => (temporal ? formatDate(x, ctx.locale, xs.length > 24 ? { month: "short", year: "2-digit" } : { month: "short", day: /^\d{4}-\d{2}$/.test(x) ? undefined : "numeric", year: /^\d{4}-\d{2}$/.test(x) ? "2-digit" : undefined }) : x);

    const data: Record<string, any>[] = [];
    const missing: Record<string, any>[] = [];
    for (const y of ys) {
      for (const x of xs) {
        const v = cells.get(`${x}\u0000${y}`);
        if (v == null) {
          missing.push({ name: y, row: y, value: [x, y] });
          continue;
        }
        const opacity = (ctx.selected(y) ? 1 : 0.25) * (lit(x, y) ? 1 : 0.3);
        data.push({
          name: y,
          row: y,
          value: [x, y, v],
          itemStyle: { opacity },
          label: { color: inkOn(colorAt(v)), opacity: opacity < 1 ? 0.5 : 1 },
        });
      }
    }

    const series: Record<string, any>[] = [
      {
        id: "cells",
        name: p.value,
        type: "heatmap" as const,
        ...morph,
        data,
        label: { show: showLabels, formatter: (d: any) => fmt(d.value[2]), ...labelStyle(ctx), fontVariantNumeric: "tabular-nums" },
        // Cells are separated by a gap of surface, not by drawn lines.
        itemStyle: { borderColor: t.surface, borderWidth: gap, borderRadius: gap ? 2 : 0 },
        emphasis: { itemStyle: { borderColor: t.ink, borderWidth: 1.5 } },
      },
    ];
    if (missing.length) {
      series.push({
        id: "missing",
        name: "No data",
        type: "custom" as const,
        silent: false,
        dimensions: [p.x, p.y],
        encode: { x: 0, y: 1 },
        renderItem: (_params: any, api: any) => {
          const c = api.coord([api.value(0), api.value(1)]);
          const size = api.size([1, 1]);
          const w = size[0] - gap;
          const h = size[1] - gap;
          const x0 = c[0] - w / 2;
          const y0 = c[1] - h / 2;
          // A pale cell struck through: unmistakably "nothing here" rather than "low".
          return {
            type: "group",
            children: [
              { type: "rect", shape: { x: x0, y: y0, width: w, height: h, r: gap ? 2 : 0 }, style: { fill: alpha(t.muted, 0.1) } },
              { type: "line", shape: { x1: x0 + 3, y1: y0 + h - 3, x2: x0 + w - 3, y2: y0 + 3 }, style: { stroke: alpha(t.muted, 0.55), lineWidth: 1 } },
            ],
          };
        },
        data: missing,
      });
    }

    const [hx, hy] = hiKey.split("\u0000");
    const [lx, ly] = loKey.split("\u0000");
    const alt = cells.size
      ? `Heatmap of ${p.value} by ${p.y} (${ys.length} rows) and ${p.x} (${xs.length} columns)${p.diverging ? `, diverging around ${fmt(mid)}` : ""}. Highest: ${hy}, ${xLabel(hx)} (${fmt(hi)}). Lowest: ${ly}, ${xLabel(lx)} (${fmt(lo)}).${missing.length ? ` ${missing.length} cells have no data.` : ""}`
      : `Heatmap of ${p.value}: no values.`;

    const barW = ctx.compact ? 90 : 120;
    const font = `${t.fontSize}px ${t.fontFamily}`;

    return {
      alt,
      option: {
        grid: { top: 34, right: 8, bottom: 2 },
        xAxis: categoryAxis(ctx, { data: xs, axisLine: { show: false }, axisLabel: { formatter: (v: string) => xLabel(v), margin: 8 }, splitArea: { show: false } }),
        yAxis: categoryAxis(ctx, { data: ys, inverse: true, axisLine: { show: false }, axisLabel: { color: t.inkSecondary, hideOverlap: ys.length > 30, width: yLabelW, overflow: "truncate", margin: 8 } }),
        visualMap: {
          type: "continuous",
          seriesIndex: 0,
          dimension: 2,
          min,
          max,
          calculable: false,
          hoverLink: false,
          orient: "horizontal",
          left: 0,
          top: 0,
          padding: [2, 0, 0, 4],
          itemWidth: 8,
          itemHeight: barW,
          text: [fmt(max), fmt(min)],
          textGap: 8,
          textStyle: { color: t.muted, fontSize: t.fontSize, fontFamily: t.fontFamily },
          inRange: { color: colors },
        },
        graphic: missing.length
          ? [
              { type: "rect", right: 58, top: 3, silent: true, shape: { width: 12, height: 12, r: 2 }, style: { fill: alpha(t.muted, 0.1) } },
              { type: "line", right: 60, top: 5, silent: true, shape: { x1: 0, y1: 8, x2: 8, y2: 0 }, style: { stroke: alpha(t.muted, 0.55), lineWidth: 1 } },
              { type: "text", right: 8, top: 3, silent: true, style: { text: "No data", fill: t.muted, font } },
            ]
          : [],
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (!Array.isArray(d.value)) return "";
            const has = d.seriesId === "cells";
            // Category dimensions arrive as labels on the heatmap series and may arrive as ordinals on the custom one.
            const x = typeof d.value[0] === "number" ? xs[d.value[0]] : d.value[0];
            const y = typeof d.value[1] === "number" ? ys[d.value[1]] : d.value[1];
            return tooltipHtml(ctx, `${y} · ${xLabel(x)}`, [{ name: p.value, value: has ? fmt(d.value[2]) : "No data", color: has ? colorAt(d.value[2]) : undefined, muted: !has }]);
          },
        },
        series,
      },
    };
  },
});
