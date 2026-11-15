import { CustomChart } from "echarts/charts";
import { alpha, luminance, mix } from "../core/color";
import { defineChart } from "../core/define";
import { categoryAxis, morph, tooltipHtml, valueAxis } from "../core/parts";
import { toNumber } from "../data/transform";

export interface StripPlotProps {
  /** Numeric field: where each mark sits along the axis. */
  value: string;
  /** Category field: one row of marks per distinct value. */
  group: string;
  /** Field naming each observation, for the tooltip. */
  label?: string;
  /** `"tick"` draws a thin vertical line per observation (a barcode); `"dot"` draws a translucent circle. */
  mark?: "tick" | "dot";
  /** Mark each row's median with a heavier tick and print its value. */
  median?: boolean;
  /** Order rows by their median. Default: data order. */
  sort?: "none" | "asc" | "desc";
  /** Spread dots across the row height (deterministic) to relieve overplotting. Only for `mark: "dot"`. */
  jitter?: boolean;
}

/**
 * One mark per observation along a shared axis, one row per category. Translucent marks
 * pile into darker bands where values cluster, so density reads without any binning.
 */
export const StripPlot = defineChart<StripPlotProps>({
  name: "strip-plot",
  title: "Strip plot",
  category: "distribution",
  description: "Shows every observation as a tick or dot along a value axis, one row per category.",
  whenToUse: "Comparing the spread and clustering of a numeric value across 2 to about 15 categories when there are few enough observations to show each one; many rows with few to a few hundred observations each.",
  avoid: "A single group where the shape matters (use histogram or beeswarm-chart); when individual points must be identifiable or coloured (use beeswarm-chart); when only quartiles matter (use box-plot).",
  use: [CustomChart],
  defaults: { mark: "tick" },
  selectField: (p) => p.group,
  selectValue: (params) => params.data?.group ?? params.value?.[1],
  props: [
    { name: "value", type: "string", required: true, description: "Numeric field positioning each mark." },
    { name: "group", type: "string", required: true, description: "Category field: one row per distinct value." },
    { name: "label", type: "string", description: "Field naming each observation, for the tooltip." },
    { name: "mark", type: '"tick" | "dot"', default: '"tick"', description: "Thin vertical ticks (a barcode) or translucent dots." },
    { name: "median", type: "boolean", default: "false", description: "Heavier tick at each row's median, with its value printed." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order rows by median." },
    { name: "jitter", type: "boolean", default: "false", description: "Deterministic vertical spread for dots, to relieve overplotting." },
  ],
  example: {
    type: "strip-plot",
    data: [
      ["Mon", [42, 44, 45, 47, 47, 48, 49, 51, 52, 55, 58, 63]],
      ["Tue", [40, 41, 43, 43, 44, 45, 46, 46, 48, 49, 53, 57]],
      ["Wed", [39, 41, 42, 44, 44, 45, 45, 47, 48, 50, 52, 61]],
      ["Thu", [41, 43, 44, 46, 47, 47, 49, 50, 52, 54, 59, 66]],
      ["Fri", [36, 37, 38, 39, 40, 40, 41, 42, 43, 44, 46, 49]],
    ].flatMap(([day, times]) => (times as number[]).map((minutes) => ({ day, minutes }))),
    value: "minutes",
    group: "day",
    median: true,
    highlight: "Fri",
    format: "{value} min",
    title: "The median Friday commute took 40.5 minutes",
    subtitle: "Door-to-door commute time, 12 weeks of trips by weekday. The heavy tick is the median.",
    note: "Illustrative data",
  },
  markCount: (rows) => rows.length,
  // A row needs about 46px to carry its marks and median label; many rows tighten a little.
  height: (p, rows) => {
    const n = new Set(rows.filter((r) => r[p.group] != null).map((r) => String(r[p.group]))).size;
    return Math.max(140, n * (n <= 8 ? 50 : 34) + 50);
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const dot = p.mark === "dot";

    const byGroup = new Map<string, { v: number; name: string }[]>();
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (Number.isNaN(v) || r[p.group] == null) continue;
      const g = String(r[p.group]);
      let list = byGroup.get(g);
      if (!list) byGroup.set(g, (list = []));
      list.push({ v, name: p.label ? String(r[p.label] ?? "") : "" });
    }
    const med = (list: { v: number }[]) => {
      const s = list.map((d) => d.v).sort((a, b) => a - b);
      const m = s.length >> 1;
      return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    };
    let groups = [...byGroup.keys()].map((g) => ({ g, list: byGroup.get(g)!, median: med(byGroup.get(g)!) }));
    if (p.sort === "asc" || p.sort === "desc") groups = [...groups].sort((a, b) => (p.sort === "asc" ? a.median - b.median : b.median - a.median));
    const names = groups.map((g) => g.g);
    const n = groups.reduce((s, g) => s + g.list.length, 0);
    const biggest = Math.max(1, ...groups.map((g) => g.list.length));

    // Opacity falls with crowding so overlaps add up to a readable density.
    const lift = ctx.mode === "dark" ? 1.35 : 1;
    const opacity = Math.min(1, (biggest <= 15 ? 0.85 : biggest <= 60 ? 0.6 : biggest <= 250 ? 0.4 : 0.25) * lift);
    const anyHighlight = ctx.dimmed("\u0000");
    // Context marks are small: on a ground the theme's context colour barely separates from
    // (under 1.5:1, e.g. a pale painted sheet) they are pulled towards the muted ink.
    const ls = luminance(t.surface);
    const lc = luminance(t.context);
    const faint = (Math.max(ls, lc) + 0.05) / (Math.min(ls, lc) + 0.05) < 1.5;
    const contextMark = faint ? mix(t.context, t.muted, 0.45) : t.context;
    const colorOf = (g: string) => (anyHighlight ? (ctx.dimmed(g) ? contextMark : ctx.color(g)) : ctx.color());
    const rowH = Math.max(12, (ctx.height - 40) / Math.max(1, names.length));
    const markH = Math.max(8, Math.min(26, rowH * 0.5));
    const showMedianValue = !!p.median && rowH >= 30;
    // Deterministic pseudo-random spread: same row order, same picture.
    const spread = (i: number) => {
      const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x) - 0.5;
    };

    let k = 0;
    const data = groups.flatMap(({ g, list }) => list.map((d) => ({ name: d.name, group: g, value: [d.v, g, k++] })));

    const series: Record<string, any>[] = [
      {
        id: "marks",
        name: p.value,
        type: "custom" as const,
        ...morph,
        dimensions: [p.value, p.group, "i"],
        encode: { x: 0, y: 1, tooltip: [0] },
        z: 2,
        renderItem: (_params: any, api: any) => {
          // Inside renderItem a category dimension arrives as its ordinal position on the axis.
          const row = api.value(1) as number;
          const g = names[row];
          const c = api.coord([api.value(0), row]);
          const fill = alpha(colorOf(g), (ctx.selected(g) ? 1 : 0.25) * (anyHighlight && ctx.dimmed(g) ? Math.min(1, opacity * 1.3) : opacity));
          if (dot) {
            const dy = p.jitter ? spread(api.value(2) as number) * markH : 0;
            return { type: "circle", shape: { cx: c[0], cy: c[1] + dy, r: 4 }, style: { fill }, emphasis: { style: { fill: colorOf(g), stroke: t.surface, lineWidth: 1 } } };
          }
          return { type: "line", shape: { x1: c[0], y1: c[1] - markH / 2, x2: c[0], y2: c[1] + markH / 2 }, style: { stroke: fill, lineWidth: 2 }, emphasis: { style: { stroke: t.ink, lineWidth: 2 } } };
        },
        data,
      },
    ];

    if (p.median) {
      series.push({
        id: "median",
        name: "Median",
        type: "custom" as const,
        ...morph,
        dimensions: ["median", p.group],
        encode: { x: 0, y: 1, tooltip: [0] },
        z: 3,
        renderItem: (_params: any, api: any) => {
          // Inside renderItem a category dimension arrives as its ordinal position on the axis.
          const row = api.value(1) as number;
          const g = names[row];
          const c = api.coord([api.value(0), row]);
          const h = markH + 10;
          const dim = anyHighlight && ctx.dimmed(g);
          const children: Record<string, any>[] = [
            // A surface halo lifts the median tick off the marks behind it.
            { type: "line", shape: { x1: c[0], y1: c[1] - h / 2, x2: c[0], y2: c[1] + h / 2 }, style: { stroke: t.surface, lineWidth: 5 } },
            { type: "line", shape: { x1: c[0], y1: c[1] - h / 2, x2: c[0], y2: c[1] + h / 2 }, style: { stroke: dim ? t.inkSecondary : t.ink, lineWidth: 2.5, opacity: ctx.selected(g) ? 1 : 0.3 } },
          ];
          if (showMedianValue) children.push({ type: "text", x: c[0], y: c[1] - h / 2 - 3, style: { text: fmt(Math.round((api.value(0) as number) * 10) / 10), fill: dim ? t.inkSecondary : t.ink, font: `600 ${t.fontSize}px ${t.fontFamily}`, align: "center", verticalAlign: "bottom", stroke: t.surface, lineWidth: 3, opacity: ctx.selected(g) ? 1 : 0.3 } });
          return { type: "group", children };
        },
        data: groups.map(({ g, median }) => ({ name: `${g} median`, group: g, value: [median, g] })),
      });
    }

    const ranked = [...groups].sort((a, b) => b.median - a.median);
    const alt = n
      ? `Strip plot of ${p.value} by ${p.group}: ${n} observations in ${names.length} rows.${ranked.length > 1 ? ` Highest median: ${ranked[0].g} (${fmt(Math.round(ranked[0].median * 10) / 10)}). Lowest: ${ranked[ranked.length - 1].g} (${fmt(Math.round(ranked[ranked.length - 1].median * 10) / 10)}).` : ranked.length ? ` Median ${fmt(ranked[0].median)}.` : ""}`
      : `Strip plot of ${p.value} by ${p.group}: no numeric values.`;

    return {
      alt,
      option: {
        grid: { top: showMedianValue ? 14 : 8, right: 18 },
        xAxis: valueAxis(ctx, { scale: true, splitNumber: ctx.compact ? 3 : 5, axisLabel: { formatter: (v: number) => fmt(v), hideOverlap: true } }),
        yAxis: categoryAxis(ctx, { data: names, inverse: true, axisLine: { show: false }, axisLabel: { color: t.inkSecondary, hideOverlap: false, width: ctx.compact ? 90 : 170, overflow: "truncate" } }),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (!Array.isArray(d.value)) return "";
            const isMedian = d.seriesId === "median";
            return tooltipHtml(ctx, isMedian ? String(d.value[1]) : d.name || String(d.value[1]), [
              ...(d.name && !isMedian ? [{ name: p.group, value: String(d.value[1]) }] : []),
              { name: isMedian ? `Median ${p.value}` : p.value, value: fmt(d.value[0]) },
            ]);
          },
        },
        series,
      },
    };
  },
});

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(rnd: () => number) {
  return Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
}

const rents = (() => {
  const rnd = seeded(13);
  const cities: [string, number, number][] = [
    ["San Francisco", 3300, 620],
    ["New York", 3600, 900],
    ["Boston", 2900, 520],
    ["Seattle", 2200, 380],
    ["Denver", 1850, 300],
    ["Austin", 1650, 280],
    ["Chicago", 1900, 430],
    ["Minneapolis", 1450, 230],
  ];
  return cities.flatMap(([city, mean, sd]) => Array.from({ length: 140 }, (_, i) => ({ listing: `${city} #${i + 1}`, city, rent: Math.round(Math.max(650, mean + normal(rnd) * sd + (rnd() < 0.05 ? sd * 2.5 * rnd() : 0)) / 10) * 10 })));
})();

const scores = (() => {
  const rnd = seeded(77);
  const schools = ["Northside Academy for Science and Technology", "Riverside", "St Mary's", "Hillcrest Community College", "Oakfield", "Westbrook"];
  return schools.flatMap((school, s) => Array.from({ length: 28 }, (_, i) => ({ pupil: `Pupil ${s * 28 + i + 1}`, school, score: Math.round(Math.max(20, Math.min(100, 58 + s * 3.5 + normal(rnd) * (9 + s)))) })));
})();

export const examples = {
  "Barcode: 1,120 listings, sorted by median": {
    theme: "science",
    data: rents,
    value: "rent",
    group: "city",
    label: "listing",
    median: true,
    sort: "desc",
    format: "currency:USD",
    height: 400,
    title: "Monthly rent of one-bedroom listings in 8 US cities",
    subtitle: "US$ per month, 140 listings per city. The heavy tick is the median.",
    note: "Illustrative data",
  },
  "Dots with jitter, long labels": {
    theme: "sunrise",
    data: scores,
    value: "score",
    group: "school",
    label: "pupil",
    mark: "dot",
    jitter: true,
    median: true,
    highlight: "Westbrook",
    title: "Exam scores at 6 schools",
    subtitle: "Exam scores out of 100, 28 pupils per school",
    note: "Illustrative data",
  },
  "Stress: 20 rows": {
    theme: "editorial",
    data: (() => {
      const rnd = seeded(5);
      return Array.from({ length: 20 }, (_, g) => Array.from({ length: 40 }, () => ({ team: `Team ${String.fromCharCode(65 + g)}`, days: Math.round(Math.exp(1.2 + g * 0.04 + normal(rnd) * 0.6) * 10) / 10 }))).flat();
    })(),
    value: "days",
    group: "team",
    format: "{value}d",
    height: 520,
    title: "Days to close a ticket, 20 teams",
    subtitle: "Days to close, 40 tickets per team",
    note: "Illustrative data",
  },
};
