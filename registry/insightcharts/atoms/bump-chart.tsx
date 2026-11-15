"use client";

import { LineChart as ELine, ScatterChart as EScatter } from "echarts/charts";
import { defineChart, measureText, truncateText, formatDate, categoryAxis, labelStyle, morph, tooltipHtml, valueAxis, shapeSeries } from "insightcharts/core";

export interface BumpChartProps {
  /** Time or ordered category field. */
  x: string;
  /** Value field to rank by, or several (one line each). */
  y: string | string[];
  /** Field that splits rows into entities, for long-format data. */
  series?: string;
  /** The values are already ranks (1 = best). Default false: ranks are computed from the values at each x. */
  ranked?: boolean;
  /** Which values rank first when ranks are computed. Default `"desc"`: the largest value is rank 1. */
  order?: "desc" | "asc";
  /** Name each line at its start as well as its end. Default: on when there is room. */
  startLabels?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

/**
 * Rank over time, first place on top. Position encodes rank only, so the chart shows who
 * overtook whom and hides by how much; say so in the subtitle when the margins matter.
 */
export const BumpChart = defineChart<BumpChartProps>({
  name: "bump-chart",
  title: "Bump chart",
  category: "trend",
  description: "Shows how the ranking of entities changes over time, with rank 1 at the top and each line named at its end.",
  whenToUse: "League tables over 3 to about 15 periods for up to about 12 entities, when the order and the changes in rank are what matter and the underlying values differ too much (or too little) to share an axis.",
  avoid: "When the size of the values matters (use line-chart); only two periods (use slope-chart); a single ranking (use bar-chart or lollipop-chart).",
  use: [ELine, EScatter],
  defaults: { order: "desc" },
  selectField: (p) => p.series,
  selectValue: (params) => params.seriesId,
  props: [
    { name: "x", type: "string", required: true, description: "Time or ordered category field." },
    { name: "y", type: "string | string[]", required: true, description: "Value field to rank by, or several (one line each)." },
    { name: "series", type: "string", description: "Field that splits rows into entities (long data)." },
    { name: "ranked", type: "boolean", default: "false", description: "The values are already ranks (1 = best) and are plotted as given." },
    { name: "order", type: '"desc" | "asc"', default: '"desc"', description: "Which values rank first when ranks are computed: largest (`desc`) or smallest (`asc`)." },
    { name: "startLabels", type: "boolean", description: "Name lines at the start as well as the end. Default: on when the chart is wide enough." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "bump-chart",
    theme: "poster",
    data: [
      { year: "2019", Tesla: 0.37, BYD: 0.23, SAIC: 0.16, Volkswagen: 0.14, Hyundai: 0.13, Geely: 0.12 },
      { year: "2020", Tesla: 0.5, BYD: 0.18, SAIC: 0.27, Volkswagen: 0.42, Hyundai: 0.2, Geely: 0.1 },
      { year: "2021", Tesla: 0.94, BYD: 0.6, SAIC: 0.68, Volkswagen: 0.76, Hyundai: 0.35, Geely: 0.2 },
      { year: "2022", Tesla: 1.31, BYD: 1.86, SAIC: 0.72, Volkswagen: 0.83, Hyundai: 0.51, Geely: 0.65 },
      { year: "2023", Tesla: 1.81, BYD: 3.02, SAIC: 0.79, Volkswagen: 1.0, Hyundai: 0.57, Geely: 0.93 },
      { year: "2024", Tesla: 1.79, BYD: 4.27, SAIC: 0.9, Volkswagen: 1.04, Hyundai: 0.56, Geely: 1.39 },
    ],
    x: "year",
    y: ["Tesla", "BYD", "SAIC", "Volkswagen", "Hyundai", "Geely"],
    highlight: "BYD",
    format: "{value}m",
    height: 300,
    title: "BYD rose from fifth in 2020 to first in 2022",
    subtitle: "Rank among six carmakers by plug-in vehicles sold worldwide, 2019 to 2024",
    source: "Company reports",
    note: "Approximate figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const n = shaped.labels.length;
    const count = shaped.series.length;

    // ranks[s][j]: rank of series s at position j, or null where it has no value.
    const ranks: (number | null)[][] = shaped.series.map((s) => s.values.map((v) => (p.ranked ? v : null)));
    if (!p.ranked) {
      for (let j = 0; j < n; j++) {
        const present = shaped.series.map((s, i) => ({ i, v: s.values[j] })).filter((d): d is { i: number; v: number } => d.v != null);
        present.sort((a, b) => (p.order === "asc" ? a.v - b.v : b.v - a.v) || a.i - b.i);
        present.forEach((d, k) => (ranks[d.i][j] = k + 1));
      }
    }
    const lastAt = ranks.map((r) => r.reduce<number>((at, v, j) => (v != null ? j : at), -1));
    const firstAt = ranks.map((r) => r.findIndex((v) => v != null));
    const maxRank = Math.max(1, ...ranks.flat().map((v) => v ?? 0));

    // Identity colours stop at 8: beyond that the 8 best-placed finishers keep a hue and the rest are context.
    const finish = shaped.series.map((_, i) => i).sort((a, b) => (ranks[a][lastAt[a]] ?? 99) - (ranks[b][lastAt[b]] ?? 99));
    const slot = new Map(finish.map((i, k) => [i, k]));
    const grey = (i: number) => ctx.dimmed(shaped.series[i].key) || (!p.highlight && count > 8 && slot.get(i)! >= 8);
    const colorOf = (i: number) => (grey(i) ? t.context : ctx.color(shaped.series[i].key, count > 8 ? slot.get(i)! : i));

    const nameCap = Math.round(ctx.width * (ctx.compact ? 0.3 : 0.22));
    const shown = shaped.series.filter((_, i) => lastAt[i] >= 0);
    const nameW = Math.min(nameCap, Math.max(0, ...shown.map((s) => Math.ceil(measureText(s.name, t.fontSize, t.fontFamily, 600)))));
    const startLabels = (p.startLabels ?? (!ctx.compact && ctx.width - 2 * nameW > 320)) && !ctx.compact;
    const dense = n > 12;

    const lines = shaped.series.map((s, i) => {
      const dim = grey(i);
      const color = colorOf(i);
      const opacity = ctx.selected(s.key) ? 1 : 0.25;
      return {
        id: s.key,
        name: s.name,
        type: "line" as const,
        ...morph,
        z: dim ? 1 : 3,
        smooth: 0.3,
        smoothMonotone: "x" as const,
        connectNulls: false,
        symbol: "circle",
        symbolSize: dim ? 6 : 9,
        showSymbol: !dense,
        lineStyle: { width: dim ? 1.5 : t.lineWidth + 0.5, color, opacity, cap: "round" as const },
        itemStyle: { color, borderColor: t.surface, borderWidth: dim ? 1 : 2, opacity },
        emphasis: { focus: p.select ? ("none" as const) : ("series" as const) },
        data: ranks[i],
      };
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
      data: shaped.series.flatMap((s, i) => {
        const at = side === "left" ? firstAt[i] : lastAt[i];
        // Only label a start that is on the left edge; a line that enters later is named at its end.
        if (at < 0 || (side === "left" && at !== 0)) return [];
        const dim = grey(i);
        return [{
          name: s.key,
          value: [shaped.labels[at], ranks[i][at]],
          label: {
            show: true,
            position: side,
            distance: 10,
            formatter: truncateText(s.name, nameW, t.fontSize, t.fontFamily, 600),
            opacity: ctx.selected(s.key) ? 1 : 0.35,
            ...labelStyle(ctx, { color: dim ? t.muted : t.ink, fontWeight: dim || side === "left" ? 400 : 600 }),
            // A line that ends early is labelled mid-plot; the halo keeps it readable over other lines.
            textBorderColor: t.surface,
            textBorderWidth: at === n - 1 || side === "left" ? 0 : 3,
          },
        }];
      }),
    });

    const monthly = (v: string) => /^\d{4}-\d{2}$/.test(v);
    const tick = (v: string) => (shaped.temporal ? formatDate(monthly(v) ? `${v}-01T00:00:00` : v, ctx.locale, monthly(v) ? { month: "short", year: "2-digit" } : { month: "short", day: "numeric" }) : v);

    const leader = finish[0];
    const moves = shaped.series.map((s, i) => ({ s, from: ranks[i][firstAt[i]], to: ranks[i][lastAt[i]] })).filter((d) => d.from != null && d.to != null);
    const climber = [...moves].sort((a, b) => b.from! - b.to! - (a.from! - a.to!))[0];
    const focus = p.highlight ? moves.filter((d) => !ctx.dimmed(d.s.key)) : [];
    const yName = Array.isArray(p.y) ? "value" : p.y;

    return {
      legend: [],
      alt: `Bump chart ranking ${count} ${p.series ?? "series"} by ${yName} from ${shaped.labels[0]} to ${shaped.labels[n - 1]}.${leader != null ? ` ${shaped.series[leader].name} finishes first.` : ""}${focus.length ? ` ${focus.map((d) => `${d.s.name} moves from rank ${d.from} to ${d.to}`).join("; ")}.` : climber && climber.from! > climber.to! ? ` Biggest climber: ${climber.s.name}, from rank ${climber.from} to ${climber.to}.` : ""}`,
      option: {
        grid: { left: startLabels ? nameW + 34 : 6, right: nameW + 22, top: 14, bottom: 6 },
        xAxis: categoryAxis(ctx, { data: shaped.labels, boundaryGap: false, axisLine: { show: false }, axisLabel: { formatter: tick, margin: 16 } }),
        yAxis: valueAxis(ctx, {
          inverse: true,
          min: 1,
          max: maxRank,
          interval: 1,
          splitLine: { show: false },
          axisLabel: { formatter: (v: number) => (Number.isInteger(v) ? String(v) : ""), margin: startLabels ? nameW + 22 : 14, hideOverlap: true },
        }),
        tooltip: {
          trigger: "axis",
          formatter: (items: any) => {
            const list = (Array.isArray(items) ? items : [items]).filter((d: any) => d.seriesType === "line" && d.value != null);
            if (!list.length) return "";
            list.sort((a: any, b: any) => a.value - b.value);
            const j = list[0].dataIndex;
            return tooltipHtml(ctx, tick(shaped.labels[j]), list.slice(0, 14).map((d: any) => {
              const s = shaped.series[d.seriesIndex];
              return { name: `${d.value}. ${d.seriesName}`, value: p.ranked ? "" : ctx.fmt(s?.values[j]), color: d.color, muted: s ? grey(d.seriesIndex) : false };
            }));
          },
        },
        series: [...lines, ...(startLabels ? [labelSeries("left")] : []), labelSeries("right")] as any[],
      },
    };
  },
});
