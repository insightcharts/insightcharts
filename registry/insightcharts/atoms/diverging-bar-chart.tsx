"use client";

import { BarChart as EBar, CustomChart as ECustom } from "echarts/charts";
import { alpha, inkOn, mix, ramp, defineChart, measureText, truncateText, type LegendItem, formatDate, isTemporal, categoryAxis, hiddenAxis, labelStyle, morph, tooltipHtml, valueAxis, shapeSeries } from "insightcharts/core";

export interface DivergingBarChartProps {
  /** Category field (what each bar is). */
  x: string;
  /**
   * One value field with positive and negative numbers, or several fields ordered from the
   * most negative response to the most positive (a Likert scale, or two opposed groups).
   */
  y: string | string[];
  /** Field that splits rows into ordered series, for long-format data. */
  series?: string;
  /** Series centred on the midline, half on each side. Default: the middle series when there is an odd number of 3 or more; `false` for none. */
  neutral?: string | false;
  /** Normalise each row to 100% (stacked series only). */
  percent?: boolean;
  /** Single series: `"polarity"` uses the two poles of the diverging ramp; `"sentiment"` uses the positive / negative colours, for good and bad. */
  colors?: "polarity" | "sentiment";
  /** Order of the rows. Default: by value (single) or by the positive side (stacked); data order for dates. */
  sort?: "none" | "asc" | "desc";
  /** `"auto"` is horizontal, except vertical for a single series over dates. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** Print values: at the bar ends (single), inside the segments (stacked). Default: on when there is room. */
  labels?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

/**
 * Bars that grow in opposite directions from a shared midline. One series shows values above
 * and below zero; several ordered series show a Likert scale with disagreement to the left
 * and agreement to the right, so the balance of opinion is read from the position of the bar.
 */
export const DivergingBarChart = defineChart<DivergingBarChartProps>({
  name: "diverging-bar-chart",
  title: "Diverging bar chart",
  category: "comparison",
  description: "Draws bars either side of a centre line: positive against negative values, or stacked agree / disagree responses around a neutral midpoint.",
  whenToUse: "Values that can be above or below zero (net change, balance, deviation from average); survey scales where the split between the two sides matters; two opposed groups back to back.",
  avoid: "Values that are all positive (use bar-chart); parts that do not have a natural two-sided order (use a stacked bar-chart); change between two dates (use arrow-chart or dumbbell-chart).",
  use: [EBar, ECustom],
  defaults: { orientation: "auto", colors: "polarity" },
  selectField: (p) => p.x,
  // Horizontal layouts get one row per category: many rows grow the chart, a handful stay compact.
  height: (p, rows) => {
    const single = !p.series && (!Array.isArray(p.y) || p.y.length === 1);
    if (p.orientation === "vertical" || (p.orientation !== "horizontal" && single && rows.length > 0 && isTemporal(rows[0][p.x]))) return undefined;
    return Math.max(120, new Set(rows.map((r) => String(r[p.x]))).size * 38 + (single && p.labels !== false ? 12 : 36));
  },
  props: [
    { name: "x", type: "string", required: true, description: "Category field." },
    { name: "y", type: "string | string[]", required: true, description: "One signed value field, or several fields ordered from most negative to most positive." },
    { name: "series", type: "string", description: "Field that splits rows into ordered series (long data)." },
    { name: "neutral", type: "string | false", description: "Series centred on the midline. Default: the middle one of an odd number of series." },
    { name: "percent", type: "boolean", default: "false", description: "Normalise each row to 100% (stacked series)." },
    { name: "colors", type: '"polarity" | "sentiment"', default: '"polarity"', description: "Single series: diverging poles, or the positive / negative colours when one side is good and the other bad." },
    { name: "sort", type: '"none" | "asc" | "desc"', description: "Row order. Default: descending by value or by the positive side; data order for dates." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Horizontal, except vertical for a single series over dates." },
    { name: "labels", type: "boolean", description: "Values at bar ends (single) or inside segments (stacked). Default: on when there is room." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "diverging-bar-chart",
    data: [
      { city: "Austin", change: 21.3 },
      { city: "Phoenix", change: 11.2 },
      { city: "Seattle", change: 8.1 },
      { city: "Chicago", change: -2.9 },
      { city: "San Francisco", change: -7.4 },
      { city: "St. Louis", change: -11.6 },
    ],
    x: "city",
    y: "change",
    format: "{value}%",
    height: 260,
    title: "Austin's population grew 21.3% between 2010 and 2020",
    subtitle: "Population change, 2010 to 2020",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const tw = (s: string) => measureText(s, t.fontSize, t.fontFamily);
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const count = shaped.series.length;
    const single = count === 1;
    const horizontal = p.orientation === "horizontal" || (p.orientation !== "vertical" && !(single && shaped.temporal));
    const percent = !!p.percent && !single;
    const fmt = percent && !p.format ? ctx.formatter("percent") : ctx.fmt;
    const r = t.radius;
    const nameCap = ctx.compact ? 110 : Math.min(240, Math.round(ctx.width * 0.3));
    const longest = Math.max(0, ...shaped.labels.map((l) => tw(l)));
    // On a narrow screen long category names go above their bar instead of being cut to a stub beside it.
    const above = horizontal && ctx.compact && longest > nameCap;
    const nameW = !horizontal || above ? 0 : Math.min(nameCap, longest);
    const barMax = above ? 14 : 24;
    const plotW = Math.max(80, ctx.width - nameW - 30);

    const monthly = (v: string) => /^\d{4}-\d{2}$/.test(v);
    const tick = (v: string) => (shaped.temporal ? formatDate(monthly(v) ? `${v}-01T00:00:00` : v, ctx.locale, monthly(v) ? { month: "short", year: "2-digit" } : { month: "short", day: "numeric" }) : v);
    const catAxis = (labels: string[]) =>
      horizontal
        ? categoryAxis(ctx, {
            data: labels,
            inverse: true,
            axisLine: { show: false },
            axisLabel: above
              ? {
                  hideOverlap: false,
                  inside: true,
                  margin: 0,
                  align: "left",
                  // A blank second line pushes the name above the bar.
                  formatter: (v: string) => `{a|${truncateText(v, ctx.width - 8, t.fontSize, t.fontFamily)}}\n{b| }`,
                  rich: { a: { color: t.inkSecondary, fontSize: t.fontSize, lineHeight: 14 }, b: { fontSize: 1, lineHeight: barMax + 18 } },
                }
              : { color: t.inkSecondary, hideOverlap: false, width: nameCap, overflow: "truncate" },
          })
        : categoryAxis(ctx, { data: labels, axisLine: { show: false }, axisLabel: { formatter: tick } });
    const zeroLine = { silent: true, symbol: "none", animation: false, label: { show: false }, lineStyle: { color: t.inkSecondary, width: 1, type: "solid" as const }, data: [horizontal ? { xAxis: 0 } : { yAxis: 0 }] };
    // With names above the bars a full-height centre line would strike through the text, so it is drawn per row instead.
    const zeroTicks = (labels: string[]) => ({
      id: "zero",
      type: "custom" as const,
      silent: true,
      z: 4,
      tooltip: { show: false },
      data: labels.map((name) => [0, name]),
      renderItem: (_params: any, api: any) => {
        const [x, y] = api.coord([0, api.value(1)]);
        return { type: "line", shape: { x1: x, y1: y - barMax / 2 - 1, x2: x, y2: y + barMax / 2 + 2 }, style: { stroke: t.inkSecondary, lineWidth: 1 } };
      },
    });
    const pointer = { trigger: "axis" as const, axisPointer: { type: "shadow" as const, shadowStyle: { color: alpha(t.muted, 0.1) } } };

    if (single) {
      const s = shaped.series[0];
      const sort = p.sort ?? (shaped.temporal ? "none" : "desc");
      const order = shaped.labels.map((_, i) => i).filter((i) => s.values[i] != null);
      if (sort !== "none") order.sort((a, b) => (sort === "desc" ? s.values[b]! - s.values[a]! : s.values[a]! - s.values[b]!));
      const labels = order.map((i) => shaped.labels[i]);
      const values = order.map((i) => s.values[i]!);
      const pos = p.colors === "sentiment" ? t.positive : t.diverging[t.diverging.length - 1];
      const neg = p.colors === "sentiment" ? t.negative : t.diverging[0];
      const text = (v: number) => (v > 0 ? "+" : "") + fmt(v);
      const showLabels = p.labels ?? labels.length <= (horizontal ? 16 : ctx.compact ? 8 : 14);

      // Labels sit beyond the bar ends, so widen the hidden scale by the widest label on each side.
      const lo = Math.min(0, ...values);
      const hi = Math.max(0, ...values);
      const span = hi - lo || 1;
      const extent = horizontal ? plotW : Math.max(80, ctx.height - 40);
      const pad = (side: number[]) => (side.length ? (horizontal ? Math.max(...side.map((v) => tw(text(v)))) + 10 : 20) : 4);
      const padLo = pad(values.filter((v) => v < 0));
      const padHi = pad(values.filter((v) => v >= 0));
      const unit = span / Math.max(40, extent - padLo - padHi);
      const value = showLabels
        ? hiddenAxis("value", { min: lo - padLo * unit, max: hi + padHi * unit })
        : valueAxis(ctx, { splitLine: { show: !above }, axisLabel: { formatter: (v: number) => fmt(v) } });

      const bars = {
        id: s.key,
        name: s.name,
        type: "bar" as const,
        barMaxWidth: barMax,
        ...morph,
        markLine: above ? undefined : zeroLine,
        data: order.map((i, k) => {
          const name = shaped.labels[i];
          const v = values[k];
          const up = v >= 0;
          const fill = ctx.dimmed(name) ? t.context : up ? pos : neg;
          return {
            name,
            value: v,
            itemStyle: { color: ctx.selected(name) ? fill : alpha(fill, 0.25), borderRadius: horizontal ? (up ? [0, r, r, 0] : [r, 0, 0, r]) : up ? [r, r, 0, 0] : [0, 0, r, r] },
            label: {
              show: showLabels,
              position: horizontal ? (up ? ("right" as const) : ("left" as const)) : up ? ("top" as const) : ("bottom" as const),
              distance: 5,
              formatter: text(v),
              ...labelStyle(ctx, { color: ctx.dimmed(name) ? t.muted : t.ink }),
            },
          };
        }),
      };
      const top = order.length ? shaped.labels[order.reduce((a, b) => (s.values[b]! > s.values[a]! ? b : a))] : "";
      const low = order.length ? shaped.labels[order.reduce((a, b) => (s.values[b]! < s.values[a]! ? b : a))] : "";
      const ups = values.filter((v) => v > 0).length;
      return {
        legend: [],
        alt: `Diverging bar chart of ${s.name} by ${p.x}: ${ups} above zero, ${values.filter((v) => v < 0).length} below.${order.length ? ` Highest: ${top} (${text(Math.max(...values))}). Lowest: ${low} (${text(Math.min(...values))}).` : ""}`,
        option: {
          grid: { right: 8, top: horizontal ? 4 : 8 },
          xAxis: horizontal ? value : catAxis(labels),
          yAxis: horizontal ? catAxis(labels) : value,
          tooltip: { ...pointer, formatter: (items: any) => { const d = Array.isArray(items) ? items[0] : items; return d ? tooltipHtml(ctx, tick(d.name), [{ name: s.name, value: text(d.value), color: d.data?.itemStyle?.color }]) : ""; } },
          series: [bars, ...(above ? [zeroTicks(labels)] : [])] as any[],
        },
      };
    }

    // Stacked: series are ordered from the negative pole to the positive pole.
    const mid = p.neutral === false ? -1 : p.neutral ? shaped.series.findIndex((s) => s.key === p.neutral) : count % 2 === 1 && count >= 3 ? (count - 1) / 2 : -1;
    const split = mid >= 0 ? mid : Math.floor(count / 2);
    const negIdx = shaped.series.map((_, i) => i).filter((i) => i < split);
    const posIdx = shaped.series.map((_, i) => i).filter((i) => (mid >= 0 ? i > mid : i >= split));
    const n = shaped.labels.length;
    const raw = (si: number, i: number) => Math.abs(shaped.series[si].values[i] ?? 0);
    const totals = shaped.labels.map((_, i) => shaped.series.reduce((sum, _s, si) => sum + raw(si, i), 0));
    const val = (si: number, i: number) => (percent ? (totals[i] ? raw(si, i) / totals[i] : 0) : raw(si, i));
    const side = (idx: number[], i: number) => idx.reduce((sum, si) => sum + val(si, i), 0) + (mid >= 0 ? val(mid, i) / 2 : 0);

    const sort = p.sort ?? (shaped.temporal ? "none" : "desc");
    const order = Array.from({ length: n }, (_, i) => i);
    // Rank on the positive side without the neutral half, so "most agreement" leads.
    const score = (i: number) => posIdx.reduce((sum, si) => sum + val(si, i), 0);
    if (sort !== "none") order.sort((a, b) => (sort === "desc" ? score(b) - score(a) : score(a) - score(b)));
    const labels = order.map((i) => shaped.labels[i]);

    const maxNeg = Math.max(0, ...order.map((i) => side(negIdx, i)));
    const maxPos = Math.max(0, ...order.map((i) => side(posIdx, i)));
    const extent = (maxNeg + maxPos) * 1.02 || 1;
    const pxPer = (horizontal ? plotW : Math.max(80, ctx.height - 40)) / extent;
    const showLabels = p.labels ?? true;
    const fillOf = (si: number) => (si === mid ? mix(t.diverging[Math.floor(t.diverging.length / 2)], t.context, 0.35) : ramp(t.diverging, count === 1 ? 1 : si / (count - 1)));

    const segment = (si: number, sign: 1 | -1, share: number, id: string) => {
      const s = shaped.series[si];
      const fill = fillOf(si);
      return {
        id,
        name: s.name,
        type: "bar" as const,
        stack: "total",
        barMaxWidth: barMax,
        ...morph,
        emphasis: { focus: "none" as const },
        itemStyle: { borderColor: t.surface, borderWidth: 1 },
        label: {
          show: showLabels && share === 1,
          position: "inside" as const,
          formatter: (d: any) => {
            const v = Math.abs(d.value);
            const need = horizontal ? tw(fmt(v)) + 8 : 16;
            return v * pxPer < need ? "" : fmt(v);
          },
          ...labelStyle(ctx, { color: inkOn(fill) }),
        },
        data: order.map((i) => {
          const name = shaped.labels[i];
          const on = ctx.selected(name) && !ctx.dimmed(name);
          return { name, value: sign * val(si, i) * share, itemStyle: { color: !ctx.selected(name) ? alpha(fill, 0.25) : ctx.dimmed(name) ? mix(fill, t.surface, 0.62) : fill }, label: on ? undefined : { color: t.inkSecondary } };
        }),
      };
    };
    // ECharts stacks outward from zero in series order, so each side lists its innermost series first.
    const series: any[] = [];
    if (mid >= 0) series.push(segment(mid, -1, 0.5, `${shaped.series[mid].key}:left`));
    [...negIdx].reverse().forEach((si) => series.push(segment(si, -1, 1, shaped.series[si].key)));
    if (mid >= 0) series.push(segment(mid, 1, 0.5, `${shaped.series[mid].key}:right`));
    posIdx.forEach((si) => series.push(segment(si, 1, 1, shaped.series[si].key)));
    if (above) series.push(zeroTicks(labels));
    else if (series[0]) series[0].markLine = zeroLine;

    const value = valueAxis(ctx, { min: -maxNeg * 1.02, max: maxPos * 1.02, splitLine: { show: !above }, axisLabel: { formatter: (v: number) => fmt(Math.abs(v)), hideOverlap: true, showMinLabel: false, showMaxLabel: false } });
    const legend: LegendItem[] = shaped.series.map((s, si) => ({ name: s.name, color: fillOf(si) }));
    const lead = order[0];
    const names = (idx: number[]) => idx.map((si) => shaped.series[si].name).join(" and ");

    return {
      legend,
      alt: `Diverging stacked bar chart by ${p.x}: ${names(negIdx)} to the left of the centre line, ${names(posIdx)} to the right${mid >= 0 ? `, ${shaped.series[mid].name} centred on it` : ""}.${lead != null ? ` ${shaped.labels[lead]} has the largest right-hand side (${fmt(score(lead))}); ${shaped.labels[order[order.length - 1]]} the smallest (${fmt(score(order[order.length - 1]))}).` : ""}`,
      option: {
        grid: { right: 12, top: horizontal ? 4 : 8 },
        xAxis: horizontal ? value : catAxis(labels),
        yAxis: horizontal ? catAxis(labels) : value,
        tooltip: {
          ...pointer,
          formatter: (items: any) => {
            const first = Array.isArray(items) ? items[0] : items;
            const i = shaped.labels.indexOf(first?.name);
            if (i < 0) return "";
            return tooltipHtml(ctx, tick(shaped.labels[i]), shaped.series.map((s, si) => ({ name: s.name, value: fmt(val(si, i)), color: fillOf(si) })));
          },
        },
        series,
      },
    };
  },
});
