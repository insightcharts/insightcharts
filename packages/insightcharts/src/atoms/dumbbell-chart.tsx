import { CustomChart as ECustom, ScatterChart as EScatter } from "echarts/charts";
import { alpha, mix } from "../core/color";
import { defineChart } from "../core/define";
import { measureText, truncateText } from "../core/layout";
import type { LegendItem } from "../core/figure";
import { categoryAxis, hiddenAxis, labelStyle, morph, tooltipHtml, valueAxis } from "../core/parts";
import { toNumber } from "../data/transform";

export interface DumbbellChartProps {
  /** Category field (one row of the chart each). */
  category: string;
  /** Field holding the first value (wide data), or the `series` value that marks it (long data). */
  from: string;
  /** Field holding the second value (wide data), or the `series` value that marks it (long data). */
  to: string;
  /** Long data: the field whose values are `from` and `to`. */
  series?: string;
  /** Long data: the measure field. Default `"value"`. */
  value?: string;
  /** `"change"`: before and after, a tint and the full accent. `"groups"`: two peers (men / women) in two hues. */
  kind?: "change" | "groups";
  /** Row order. Default `"gap"`: widest gap on top. */
  sort?: "gap" | "from" | "to" | "none";
  /** Sort direction. Default `"desc"`. */
  order?: "desc" | "asc";
  /** Print both values next to their dots. Default: on for up to 14 rows. */
  labels?: boolean;
  /** Print the gap in a column on the right. `true`, or a string to use as the column header. */
  gapLabel?: boolean | string;
  /** Start the value axis at zero. Default false: dots encode position, not length. */
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
 * Two values per category joined by a line. The eye reads the gap, then the two positions;
 * sorting by gap makes the ranking of gaps the first thing seen.
 */
export const DumbbellChart = defineChart<DumbbellChartProps>({
  name: "dumbbell-chart",
  title: "Dumbbell chart",
  category: "comparison",
  description: "Shows two values per category as dots joined by a line, so the length of the line shows the difference.",
  whenToUse: "Before / after or group A / group B across up to about 20 categories, when the size of the difference is what the reader needs.",
  avoid: "A single value per category (use lollipop-chart or bar-chart); when the direction of change matters more than the two levels (use arrow-chart); more than two points in time (use slope-chart or line-chart).",
  use: [ECustom, EScatter],
  defaults: { kind: "change", sort: "gap", order: "desc" },
  selectField: (p) => p.category,
  // One row per category: many rows grow the chart, a handful stay compact.
  height: (p, rows) => Math.max(120, new Set(rows.map((r) => String(r[p.category]))).size * 34 + (p.gapLabel ? 32 : 16) + (p.labels === false || rows.length > 14 * (p.series ? 2 : 1) ? 28 : 0)),
  props: [
    { name: "category", type: "string", required: true, description: "Category field: one row of the chart each." },
    { name: "from", type: "string", required: true, description: "Field with the first value, or (long data) the `series` value that marks it." },
    { name: "to", type: "string", required: true, description: "Field with the second value, or (long data) the `series` value that marks it." },
    { name: "series", type: "string", description: "Long data: the field whose values are `from` and `to`." },
    { name: "value", type: "string", default: '"value"', description: "Long data: the measure field." },
    { name: "kind", type: '"change" | "groups"', default: '"change"', description: "`change` draws a tint then the accent (before / after); `groups` uses two hues (two peers)." },
    { name: "sort", type: '"gap" | "from" | "to" | "none"', default: '"gap"', description: "Row order." },
    { name: "order", type: '"desc" | "asc"', default: '"desc"', description: "Sort direction." },
    { name: "labels", type: "boolean", description: "Value labels beside both dots. Default: on for up to 14 rows; otherwise a value axis is drawn." },
    { name: "gapLabel", type: "boolean | string", default: "false", description: "Print the gap in a right-hand column; a string sets the column header." },
    { name: "zero", type: "boolean", default: "false", description: "Start the value axis at zero." },
    { name: "names", type: "Record<string, string>", description: "Display names for the `from` and `to` keys." },
  ],
  example: {
    type: "dumbbell-chart",
    theme: "science",
    data: [
      { country: "South Korea", y2000: 76.0, y2023: 83.6 },
      { country: "Turkey", y2000: 71.1, y2023: 77.3 },
      { country: "Poland", y2000: 73.8, y2023: 78.6 },
      { country: "Japan", y2000: 81.2, y2023: 84.1 },
      { country: "Germany", y2000: 78.2, y2023: 81.2 },
      { country: "United States", y2000: 76.7, y2023: 78.4 },
    ],
    category: "country",
    from: "y2000",
    to: "y2023",
    names: { y2000: "2000", y2023: "2023" },
    gapLabel: "Gain",
    format: "decimal:1",
    height: 280,
    title: "Life expectancy in South Korea rose from 76.0 years in 2000 to 83.6 in 2023",
    subtitle: "Life expectancy at birth, years, 2000 and 2023",
    source: "OECD Health Statistics (rounded)",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const tw = (s: string, size = t.fontSize, weight = 400) => measureText(s, size, t.fontFamily, weight);
    const num = (v: unknown) => toNumber(v);
    let items: Item[];
    if (p.series) {
      const field = p.value ?? "value";
      const by = new Map<string, Item>();
      for (const r of ctx.rows) {
        const name = String(r[p.category]);
        const it = by.get(name) ?? { name, a: NaN, b: NaN };
        const key = String(r[p.series]);
        if (key === p.from) it.a = num(r[field]);
        else if (key === p.to) it.b = num(r[field]);
        by.set(name, it);
      }
      items = [...by.values()];
    } else items = ctx.rows.map((r) => ({ name: String(r[p.category]), a: num(r[p.from]), b: num(r[p.to]) }));
    items = items.filter((d) => Number.isFinite(d.a) && Number.isFinite(d.b));

    const groups = p.kind === "groups";
    const gap = (d: Item) => (groups ? Math.abs(d.b - d.a) : d.b - d.a);
    if (p.sort !== "none") {
      const key = p.sort === "from" ? (d: Item) => d.a : p.sort === "to" ? (d: Item) => d.b : gap;
      items.sort((x, y) => (p.order === "asc" ? key(x) - key(y) : key(y) - key(x)));
    }

    const fromName = p.names?.[p.from] ?? p.from;
    const toName = p.names?.[p.to] ?? p.to;
    const fmt = ctx.fmt;
    const gapText = (d: Item) => (groups || gap(d) <= 0 ? "" : "+") + fmt(gap(d));
    const showLabels = p.labels ?? items.length <= 14;
    const showGap = !!p.gapLabel;
    const gapHeader = typeof p.gapLabel === "string" ? p.gapLabel : groups ? "Gap" : "Change";
    const gapW = showGap ? Math.max(tw(gapHeader), ...items.map((d) => tw(gapText(d), t.fontSize, 600))) + 14 : 0;

    const base = t.accent;
    // The "before" dot is a tint of the accent; keep more of the hue on dark surfaces so it stays visible.
    const tint = mix(base, t.surface, ctx.mode === "dark" ? 0.42 : 0.55);
    const colors = (name: string) => {
      const dim = ctx.dimmed(name);
      const to = dim ? t.context : base;
      const from = dim ? mix(t.context, t.surface, 0.45) : groups ? t.categorical[1] : tint;
      const fade = ctx.selected(name) ? 1 : 0.25;
      return { to: alpha(to, fade), from: alpha(from, fade), bar: alpha(dim ? mix(t.context, t.surface, 0.6) : groups ? mix(t.context, t.surface, 0.35) : mix(base, t.surface, 0.72), fade) };
    };

    // With direct labels the axis disappears, so pad the scale by the width of the widest label.
    const all = items.flatMap((d) => [d.a, d.b]);
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const span = hi - lo || Math.abs(hi) || 1;
    const nameCap = ctx.compact ? 110 : Math.min(260, Math.round(ctx.width * 0.32));
    const longest = Math.max(0, ...items.map((d) => tw(d.name)));
    // On a narrow screen long category names go above their row instead of being cut to a stub beside it.
    const above = ctx.compact && longest > nameCap && (ctx.height - 30) / Math.max(1, items.length) >= 30;
    const shift = above ? 5 : 0;
    const nameW = above ? 0 : Math.min(nameCap, longest);
    const plotW = Math.max(80, ctx.width - nameW - 26 - gapW);
    const padPx = Math.max(0, ...all.map((v) => tw(fmt(v), t.fontSize, 600))) + 14;
    const f = padPx / Math.max(40, plotW - 2 * padPx);
    const min = p.zero && lo >= 0 ? Math.min(0, lo - span * f * (lo / (span + lo))) : lo - span * f;
    const max = hi + span * f;

    const dot = (side: "a" | "b") => ({
      id: side === "a" ? "from" : "to",
      name: side === "a" ? fromName : toName,
      type: "scatter" as const,
      ...morph,
      z: side === "a" ? 3 : 4,
      symbol: "circle",
      symbolSize: above ? 10 : 12,
      symbolOffset: [0, shift],
      emphasis: { scale: 1.15 },
      data: items.map((d) => {
        const c = colors(d.name);
        const low = side === "a" ? d.a <= d.b : d.b < d.a;
        const strong = side === "b" && !ctx.dimmed(d.name);
        return {
          name: d.name,
          value: [d[side], d.name],
          itemStyle: { color: side === "a" ? c.from : c.to, borderColor: t.surface, borderWidth: 2, opacity: 1 },
          label: {
            show: showLabels,
            position: low ? ("left" as const) : ("right" as const),
            distance: 5,
            formatter: fmt(d[side]),
            ...labelStyle(ctx, { color: strong ? t.ink : ctx.dimmed(d.name) ? t.muted : t.inkSecondary, fontWeight: strong ? 600 : 400, opacity: ctx.selected(d.name) ? 1 : 0.4 }),
          },
        };
      }),
    });

    const connector = {
      id: "connector",
      name: "gap",
      type: "custom" as const,
      ...morph,
      z: 2,
      dimensions: [p.from, p.to, p.category],
      encode: { x: [0, 1], y: 2, tooltip: [0, 1] },
      data: items.map((d) => ({ name: d.name, value: [d.a, d.b, d.name] })),
      renderItem: (params: any, api: any) => {
        const d = items[params.dataIndex];
        if (!d) return null;
        const [x0, mid] = api.coord([d.a, d.name]);
        const [x1] = api.coord([d.b, d.name]);
        const y = mid + shift;
        const c = colors(d.name);
        const children: any[] = [{ type: "line", shape: { x1: x0, y1: y, x2: x1, y2: y }, style: { stroke: c.bar, lineWidth: 4, lineCap: "round" } }];
        if (showGap) {
          const cs = params.coordSys;
          children.push({
            type: "text",
            x: cs.x + cs.width + gapW - 2,
            y,
            silent: true,
            style: { text: gapText(d), fill: ctx.dimmed(d.name) ? t.muted : t.ink, opacity: ctx.selected(d.name) ? 1 : 0.4, fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: 600, align: "right", verticalAlign: "middle" },
          });
        }
        return { type: "group", children };
      },
    };

    const sorted = [...items].sort((x, y) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a));
    const widest = sorted[0];
    const narrowest = sorted[sorted.length - 1];
    const legend: LegendItem[] = [
      { name: fromName, color: groups ? t.categorical[1] : tint, shape: "dot" },
      { name: toName, color: base, shape: "dot" },
    ];

    return {
      legend,
      alt: `Dumbbell chart comparing ${fromName} and ${toName} for ${items.length} ${p.category} values.${widest ? ` Widest gap: ${widest.name} (${fmt(widest.a)} and ${fmt(widest.b)}).` : ""}${narrowest && narrowest !== widest ? ` Narrowest: ${narrowest.name} (${fmt(narrowest.a)} and ${fmt(narrowest.b)}).` : ""}`,
      option: {
        grid: { right: showGap ? gapW + 4 : showLabels ? 8 : 16, top: showGap ? 24 : showLabels ? 4 : 12 },
        xAxis: showLabels ? hiddenAxis("value", { min, max }) : valueAxis(ctx, { scale: !p.zero, axisLabel: { formatter: (v: number) => fmt(v) } }),
        yAxis: categoryAxis(ctx, {
          data: items.map((d) => d.name),
          inverse: true,
          axisLine: { show: false },
          axisLabel: above
            ? { color: t.inkSecondary, hideOverlap: false, inside: true, margin: 0, align: "left", verticalAlign: "bottom", padding: [1, 6, 3, 0], backgroundColor: t.surface, formatter: (v: string) => truncateText(v, ctx.width - gapW - 16, t.fontSize, t.fontFamily) }
            : { color: t.inkSecondary, hideOverlap: false, width: nameCap, overflow: "truncate" },
        }),
        graphic: showGap ? [{ type: "text", right: 6, top: 2, silent: true, style: { text: gapHeader, fill: t.muted, font: `${t.fontSize}px ${t.fontFamily}` } }] : undefined,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow", shadowStyle: { color: alpha(t.muted, 0.1) } },
          formatter: (list: any) => {
            const first = Array.isArray(list) ? list[0] : list;
            const d = items.find((it) => it.name === first?.name);
            if (!d) return "";
            const c = colors(d.name);
            return tooltipHtml(ctx, d.name, [
              { name: fromName, value: fmt(d.a), color: c.from },
              { name: toName, value: fmt(d.b), color: c.to },
              { name: groups ? "Gap" : "Change", value: gapText(d) },
            ]);
          },
        },
        series: [connector, dot("a"), dot("b")] as any[],
      },
    };
  },
});

export const examples = {
  "Two groups, highlighted row": {
    data: [
      { country: "South Korea", men: 100, women: 68.8 },
      { country: "Japan", men: 100, women: 78.7 },
      { country: "United States", men: 100, women: 83.0 },
      { country: "United Kingdom", men: 100, women: 85.5 },
      { country: "Germany", men: 100, women: 85.6 },
      { country: "France", men: 100, women: 88.4 },
      { country: "Sweden", men: 100, women: 92.7 },
      { country: "Belgium", men: 100, women: 98.8 },
    ],
    category: "country",
    from: "women",
    to: "men",
    kind: "groups",
    names: { men: "Men", women: "Women" },
    highlight: "South Korea",
    gapLabel: "Gap",
    title: "Women in South Korea earned 68.8% of men's median pay in 2022",
    subtitle: "Median full-time earnings, men = 100",
    source: "OECD gender wage gap, 2022 (rounded)",
    note: "Figures are approximate, for illustration",
  },
  "Long format": {
    theme: "ledger",
    data: [
      { city: "Lisbon", period: "2015", value: 860 },
      { city: "Lisbon", period: "2024", value: 1720 },
      { city: "Dublin", period: "2015", value: 1390 },
      { city: "Dublin", period: "2024", value: 2380 },
      { city: "Berlin", period: "2015", value: 780 },
      { city: "Berlin", period: "2024", value: 1310 },
      { city: "Madrid", period: "2015", value: 790 },
      { city: "Madrid", period: "2024", value: 1260 },
      { city: "Vienna", period: "2015", value: 840 },
      { city: "Vienna", period: "2024", value: 1090 },
    ],
    category: "city",
    series: "period",
    value: "value",
    from: "2015",
    to: "2024",
    format: "currency:EUR",
    height: 260,
    title: "Rent in Lisbon rose from €860 in 2015 to €1,720 in 2024",
    subtitle: "Typical monthly rent for a one-bedroom flat, euros",
    note: "Illustrative figures.",
  },
  "Stress: 22 rows, long names, axis instead of labels": {
    theme: "ocean",
    data: [
      ["Professional, scientific and technical services", 41, 63], ["Information and communication", 48, 66], ["Financial and insurance activities", 39, 58], ["Public administration and defence", 22, 44], ["Education", 18, 33],
      ["Real estate activities", 21, 35], ["Administrative and support services", 14, 26], ["Arts, entertainment and recreation", 11, 21], ["Wholesale and retail trade", 8, 15], ["Manufacturing", 9, 15],
      ["Electricity, gas, steam and air conditioning supply", 19, 31], ["Construction", 6, 11], ["Human health and social work", 7, 13], ["Transportation and storage", 5, 9], ["Mining and quarrying", 8, 11],
      ["Water supply, sewerage and waste management", 7, 10], ["Agriculture, forestry and fishing", 12, 14], ["Accommodation and food services", 3, 4], ["Other service activities", 10, 17], ["Activities of households as employers", 2, 3],
      ["Extraterritorial organisations", 30, 47], ["Repair of motor vehicles", 4, 6],
    ].map(([sector, before, after]) => ({ sector, before, after })),
    category: "sector",
    from: "before",
    to: "after",
    names: { before: "2019", after: "2024" },
    format: "{value}%",
    title: "Remote working in information and communication rose from 48% in 2019 to 66% in 2024",
    subtitle: "Share of employees working from home at least one day a week, by sector",
    note: "Illustrative figures.",
  },
};
