"use client";

import { CustomChart as ECustom } from "echarts/charts";
import { alpha, defineChart, measureText, truncateText, type LegendItem, categoryAxis, hiddenAxis, morph, tooltipHtml, valueAxis } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface ArrowChartProps {
  /** Category field (one arrow each). */
  category: string;
  /** Field holding the start value (wide data), or the `series` value that marks it (long data). */
  from: string;
  /** Field holding the end value (wide data), or the `series` value that marks it (long data). */
  to: string;
  /** Long data: the field whose values are `from` and `to`. */
  series?: string;
  /** Long data: the measure field. Default `"value"`. */
  value?: string;
  /** Which direction is good news and takes the positive colour. `"none"` draws every arrow in the accent. */
  good?: "up" | "down" | "none";
  /** Row order. Default `"change"`: biggest increase on top. */
  sort?: "change" | "from" | "to" | "none";
  /** Sort direction. Default `"desc"`. */
  order?: "desc" | "asc";
  /** Print the start and end values at the tail and the head. Default: on for up to 14 rows. */
  labels?: boolean;
  /** Print the change in a column on the right. `true`, or a string to use as the column header. */
  changeLabel?: boolean | string;
  /** Start the value axis at zero. Default false: arrows encode position and direction. */
  zero?: boolean;
  /** Display names for the `from` and `to` keys. */
  names?: Record<string, string>;
}

interface Item {
  name: string;
  a: number;
  b: number;
}

/**
 * One arrow per category, from where it was to where it is. Direction is carried twice,
 * by the arrowhead and by colour, so it survives greyscale and colour-vision deficiency.
 */
export const ArrowChart = defineChart<ArrowChartProps>({
  name: "arrow-chart",
  title: "Arrow chart",
  category: "comparison",
  description: "Draws an arrow per category from a start value to an end value, showing the direction and size of each shift.",
  whenToUse: "Shifts between two moments across up to about 25 categories when some rise and some fall: swings between elections, before / after a policy.",
  avoid: "When both levels matter more than the direction (use dumbbell-chart); more than two points in time (use slope-chart or line-chart); a single value per category (use bar-chart).",
  use: [ECustom],
  defaults: { good: "up", sort: "change", order: "desc" },
  selectField: (p) => p.category,
  // One row per category: many rows grow the chart, a handful stay compact.
  height: (p, rows) => Math.max(120, new Set(rows.map((r) => String(r[p.category]))).size * 34 + (p.changeLabel ? 32 : 16) + (p.labels === false || rows.length > 14 * (p.series ? 2 : 1) ? 28 : 0)),
  props: [
    { name: "category", type: "string", required: true, description: "Category field: one arrow each." },
    { name: "from", type: "string", required: true, description: "Field with the start value, or (long data) the `series` value that marks it." },
    { name: "to", type: "string", required: true, description: "Field with the end value, or (long data) the `series` value that marks it." },
    { name: "series", type: "string", description: "Long data: the field whose values are `from` and `to`." },
    { name: "value", type: "string", default: '"value"', description: "Long data: the measure field." },
    { name: "good", type: '"up" | "down" | "none"', default: '"up"', description: "Direction drawn in the positive colour. `none` uses the accent for every arrow." },
    { name: "sort", type: '"change" | "from" | "to" | "none"', default: '"change"', description: "Row order." },
    { name: "order", type: '"desc" | "asc"', default: '"desc"', description: "Sort direction." },
    { name: "labels", type: "boolean", description: "Start and end values at the tail and head. Default: on for up to 14 rows; otherwise a value axis is drawn." },
    { name: "changeLabel", type: "boolean | string", default: "false", description: "Print the signed change in a right-hand column; a string sets the column header." },
    { name: "zero", type: "boolean", default: "false", description: "Start the value axis at zero." },
    { name: "names", type: "Record<string, string>", description: "Display names for the `from` and `to` keys." },
  ],
  example: {
    type: "arrow-chart",
    data: [
      { group: "Under 30", y2019: 62, y2024: 71 },
      { group: "30 to 44", y2019: 58, y2024: 63 },
      { group: "45 to 64", y2019: 49, y2024: 47 },
      { group: "65 and over", y2019: 41, y2024: 34 },
    ],
    category: "group",
    from: "y2019",
    to: "y2024",
    names: { y2019: "2019", y2024: "2024" },
    format: "{value}%",
    changeLabel: "Change",
    height: 220,
    title: "Support among under-30s rose from 62% in 2019 to 71% in 2024",
    subtitle: "Share in favour of the congestion charge, by age group, 2019 to 2024",
    source: "City residents survey",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const tw = (s: string, size = t.fontSize, weight = 400) => measureText(s, size, t.fontFamily, weight);
    let items: Item[];
    if (p.series) {
      const field = p.value ?? "value";
      const by = new Map<string, Item>();
      for (const r of ctx.rows) {
        const name = String(r[p.category]);
        const it = by.get(name) ?? { name, a: NaN, b: NaN };
        const key = String(r[p.series]);
        if (key === p.from) it.a = toNumber(r[field]);
        else if (key === p.to) it.b = toNumber(r[field]);
        by.set(name, it);
      }
      items = [...by.values()];
    } else items = ctx.rows.map((r) => ({ name: String(r[p.category]), a: toNumber(r[p.from]), b: toNumber(r[p.to]) }));
    items = items.filter((d) => Number.isFinite(d.a) && Number.isFinite(d.b));
    if (p.sort !== "none") {
      const key = p.sort === "from" ? (d: Item) => d.a : p.sort === "to" ? (d: Item) => d.b : (d: Item) => d.b - d.a;
      items.sort((x, y) => (p.order === "asc" ? key(x) - key(y) : key(y) - key(x)));
    }

    const fromName = p.names?.[p.from] ?? p.from;
    const toName = p.names?.[p.to] ?? p.to;
    const fmt = ctx.fmt;
    const changeText = (d: Item) => (d.b - d.a > 0 ? "+" : "") + fmt(d.b - d.a);
    const showLabels = p.labels ?? items.length <= 14;
    const showChange = !!p.changeLabel;
    const header = typeof p.changeLabel === "string" ? p.changeLabel : "Change";
    const changeW = showChange ? Math.max(tw(header), ...items.map((d) => tw(changeText(d), t.fontSize, 600))) + 14 : 0;

    const upColor = p.good === "none" ? t.accent : p.good === "down" ? t.negative : t.positive;
    const downColor = p.good === "none" ? t.accent : p.good === "down" ? t.positive : t.negative;
    const colorOf = (d: Item) => {
      const c = ctx.dimmed(d.name) ? t.context : d.b === d.a ? t.muted : d.b > d.a ? upColor : downColor;
      return ctx.selected(d.name) ? c : alpha(c, 0.25);
    };

    const all = items.flatMap((d) => [d.a, d.b]);
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const span = hi - lo || Math.abs(hi) || 1;
    const nameCap = ctx.compact ? 110 : Math.min(260, Math.round(ctx.width * 0.32));
    const longest = Math.max(0, ...items.map((d) => tw(d.name)));
    // On a narrow screen long category names go above their arrow instead of being cut to a stub beside it.
    const above = ctx.compact && longest > nameCap && (ctx.height - 30) / Math.max(1, items.length) >= 30;
    const shift = above ? 5 : 0;
    const nameW = above ? 0 : Math.min(nameCap, longest);
    const plotW = Math.max(80, ctx.width - nameW - 26 - changeW);
    const padPx = Math.max(0, ...all.map((v) => tw(fmt(v), t.fontSize, 600))) + 16;
    const f = padPx / Math.max(40, plotW - 2 * padPx);
    const min = lo - span * f;
    const max = hi + span * f;

    const arrows = {
      id: "arrows",
      name: "change",
      type: "custom" as const,
      ...morph,
      dimensions: [p.from, p.to, p.category],
      encode: { x: [0, 1], y: 2, tooltip: [0, 1] },
      data: items.map((d) => ({ name: d.name, value: [d.a, d.b, d.name] })),
      renderItem: (params: any, api: any) => {
        const d = items[params.dataIndex];
        if (!d) return null;
        const [x0, mid] = api.coord([d.a, d.name]);
        const [x1] = api.coord([d.b, d.name]);
        const y = mid + shift;
        const color = colorOf(d);
        const dir = Math.sign(x1 - x0);
        const len = Math.abs(x1 - x0);
        const head = Math.min(10, Math.max(5, len));
        const half = head * 0.55;
        const children: any[] = [];
        if (dir === 0) children.push({ type: "circle", shape: { cx: x0, cy: y, r: 3.5 }, style: { fill: color } });
        else {
          if (len > head) children.push({ type: "line", shape: { x1: x0, y1: y, x2: x1 - dir * head * 0.9, y2: y }, style: { stroke: color, lineWidth: 2.5, lineCap: "butt" } });
          // A short bar marks the start so the tail reads as a position, not just the end of a stroke.
          children.push({ type: "line", shape: { x1: x0, y1: y - 4, x2: x0, y2: y + 4 }, style: { stroke: color, lineWidth: 2, lineCap: "round" } });
          children.push({ type: "polygon", shape: { points: [[x1, y], [x1 - dir * head, y - half], [x1 - dir * head, y + half]] }, style: { fill: color, stroke: color, lineWidth: 1, lineJoin: "round" } });
        }
        const text = (value: string, x: number, align: "left" | "right", strong: boolean) => ({
          type: "text",
          x,
          y,
          silent: true,
          style: { text: value, fill: ctx.dimmed(d.name) ? t.muted : strong ? t.ink : t.inkSecondary, opacity: ctx.selected(d.name) ? 1 : 0.4, fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: strong ? 600 : 400, align, verticalAlign: "middle" },
        });
        if (showLabels) {
          const up = dir >= 0;
          children.push(text(fmt(d.b), x1 + (up ? 7 : -7), up ? "left" : "right", true));
          if (dir !== 0) children.push(text(fmt(d.a), x0 + (up ? -8 : 8), up ? "right" : "left", false));
        }
        if (showChange) {
          const cs = params.coordSys;
          children.push(text(changeText(d), cs.x + cs.width + changeW - 2, "right", true));
        }
        return { type: "group", children };
      },
    };

    const ups = items.filter((d) => d.b > d.a);
    const downs = items.filter((d) => d.b < d.a);
    const biggestUp = [...ups].sort((x, y) => y.b - y.a - (x.b - x.a))[0];
    const biggestDown = [...downs].sort((x, y) => x.b - x.a - (y.b - y.a))[0];
    const legend: LegendItem[] = p.good === "none" || !ups.length || !downs.length ? [] : [
      { name: "Increase", color: upColor, shape: "line" },
      { name: "Decrease", color: downColor, shape: "line" },
    ];

    return {
      legend,
      alt: `Arrow chart of the change from ${fromName} to ${toName} for ${items.length} ${p.category} values: ${ups.length} rose, ${downs.length} fell.${biggestUp ? ` Largest rise: ${biggestUp.name} (${fmt(biggestUp.a)} to ${fmt(biggestUp.b)}).` : ""}${biggestDown ? ` Largest fall: ${biggestDown.name} (${fmt(biggestDown.a)} to ${fmt(biggestDown.b)}).` : ""}`,
      option: {
        grid: { right: showChange ? changeW + 4 : showLabels ? 8 : 16, top: showChange ? 24 : showLabels ? 4 : 12 },
        xAxis: showLabels ? hiddenAxis("value", { min: p.zero && lo >= 0 ? 0 : min, max }) : valueAxis(ctx, { scale: !p.zero, axisLabel: { formatter: (v: number) => fmt(v) } }),
        yAxis: categoryAxis(ctx, {
          data: items.map((d) => d.name),
          inverse: true,
          axisLine: { show: false },
          axisLabel: above
            ? { color: t.inkSecondary, hideOverlap: false, inside: true, margin: 0, align: "left", verticalAlign: "bottom", padding: [1, 6, 3, 0], backgroundColor: t.surface, formatter: (v: string) => truncateText(v, ctx.width - changeW - 16, t.fontSize, t.fontFamily) }
            : { color: t.inkSecondary, hideOverlap: false, width: nameCap, overflow: "truncate" },
        }),
        graphic: showChange ? [{ type: "text", right: 6, top: 2, silent: true, style: { text: header, fill: t.muted, font: `${t.fontSize}px ${t.fontFamily}` } }] : undefined,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow", shadowStyle: { color: alpha(t.muted, 0.1) } },
          formatter: (list: any) => {
            const first = Array.isArray(list) ? list[0] : list;
            const d = items.find((it) => it.name === first?.name);
            if (!d) return "";
            return tooltipHtml(ctx, d.name, [
              { name: fromName, value: fmt(d.a) },
              { name: toName, value: fmt(d.b) },
              { name: "Change", value: changeText(d), color: colorOf(d) },
            ]);
          },
        },
        series: [arrows] as any[],
      },
    };
  },
});
