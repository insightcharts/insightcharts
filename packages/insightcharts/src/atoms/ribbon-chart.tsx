import { CustomChart } from "echarts/charts";
import { inkOn, mix } from "../core/color";
import { defineChart } from "../core/define";
import { dodge, measureText, truncateText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { shapeSeries } from "../core/shape";
import { _posterPalette } from "./_poster-colors";

export interface RibbonChartProps {
  /** Period field: one column of the ribbon per distinct value, in data order. */
  x: string;
  /** Value field (long data), or one column per entity (wide data). Band thickness. */
  y: string | string[];
  /** Entity field, for long data (`{ crop, year, tonnes }`). */
  series?: string;
  /** Print each value inside its band at every period where it fits. Default true. */
  values?: boolean;
  /** Entity names at `"both"` ends, or only at the `"end"`. Default: both, end only on narrow screens. */
  labels?: "both" | "end";
  /** Display names for entity keys. */
  names?: Record<string, string>;
  /** `"auto"` (default): the largest entities take the theme's colours and any past the palette size (at most 8) are grey. `"series"`: every band gets its own colour, the extra ones derived from the theme's own. `"none"`: every band in the accent. */
  colorBy?: "auto" | "series" | "none";
}

const STEPS = 14;

/**
 * Ranked bands over time: at every period the entities are stacked largest first, each as
 * thick as its value, and the bands cross where the order changes. Rank and size in one form.
 */
export const RibbonChart = defineChart<RibbonChartProps>({
  name: "ribbon-chart",
  title: "Ribbon chart",
  category: "poster",
  description: "One filled band per entity across periods: its thickness is its value in each period and its vertical position is its rank, so bands cross as the order changes.",
  whenToUse: "4 to 8 entities over 4 to 10 periods when both the size of each and the changing order matter, and the graphic should read as one flowing form: market shares, harvests, medal tables, budget lines.",
  avoid: "Totals that matter more than order, or a smooth centred stream of many periods (use area-chart, which has stacked and stream modes); rank alone (use bump-chart); more than 8 entities or 10 periods (use line-chart or small-multiples); values that can be negative (use line-chart).",
  use: [CustomChart],
  defaults: { values: true },
  selectField: (p) => p.series ?? "series",
  height: (p, rows) => {
    const n = p.series ? new Set(rows.map((r) => String(r[p.series!]))).size : Array.isArray(p.y) ? p.y.length : 1;
    return Math.min(560, Math.max(360, n * 52 + 90));
  },
  props: [
    { name: "x", type: "string", required: true, description: "Period field: one column of the ribbon per distinct value, in data order." },
    { name: "y", type: "string | string[]", required: true, description: "Value field (long data), or one column per entity (wide data). Band thickness; negative values are drawn as zero." },
    { name: "series", type: "string", description: "Entity field, for long data." },
    { name: "values", type: "boolean", default: "true", description: "Print each value inside its band at every period where it fits." },
    { name: "labels", type: '"both" | "end"', description: "Entity names at both ends, or only at the end. Default: both, end only on narrow screens." },
    { name: "names", type: "Record<string, string>", description: "Display names for entity keys." },
    { name: "colorBy", type: '"auto" | "series" | "none"', default: '"auto"', description: "`auto`: the largest entities take the theme's colours and any past the palette size (at most 8) are grey. `series`: every band gets its own colour, the extra ones derived from the theme's own. `none`: every band in the accent." },
  ],
  example: {
    type: "ribbon-chart",
    data: [
      { year: "2019", Potatoes: 7.4, Carrots: 5.1, Onions: 4.2, Beans: 2.6, Squash: 1.2 },
      { year: "2020", Potatoes: 6.9, Carrots: 5.6, Onions: 3.8, Beans: 3.1, Squash: 2.3 },
      { year: "2021", Potatoes: 6.1, Carrots: 5.9, Onions: 3.1, Beans: 3.4, Squash: 3.9 },
      { year: "2022", Potatoes: 5.2, Carrots: 6.3, Onions: 2.9, Beans: 3.2, Squash: 5.0 },
      { year: "2023", Potatoes: 4.8, Carrots: 6.0, Onions: 2.4, Beans: 3.6, Squash: 6.1 },
      { year: "2024", Potatoes: 4.1, Carrots: 6.2, Onions: 2.2, Beans: 3.5, Squash: 6.8 },
    ],
    x: "year",
    y: ["Potatoes", "Carrots", "Onions", "Beans", "Squash"],
    format: "{value} t",
    title: "The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024",
    subtitle: "Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const shaped = shapeSeries(ctx.rows, p, p.names);
    const labels = shaped.labels;
    const n = labels.length;
    const series = shaped.series;
    const m = series.length;
    const val = (i: number, j: number) => Math.max(0, series[i].values[j] ?? 0);
    const has = (i: number, j: number) => series[i].values[j] != null;
    const totals = series.map((_, i) => labels.reduce((s, _l, j) => s + val(i, j), 0));

    // order[j]: series indices from the top of the stack down. Missing values sink to the bottom.
    const order = labels.map((_l, j) => series.map((_, i) => i).sort((a, b) => Number(has(b, j)) - Number(has(a, j)) || val(b, j) - val(a, j) || a - b));
    const rank = series.map((_, i) => order.map((o, j) => (has(i, j) ? o.indexOf(i) + 1 : null)));

    // Identity colours stop at 8, or at the size of a smaller poster palette: beyond that the largest keep a hue and the rest are context.
    const bySize = series.map((_, i) => i).sort((a, b) => totals[b] - totals[a]);
    const slot = new Map(bySize.map((i, k) => [i, k]));
    const hues = Math.min(8, t.categorical.length);
    // `colorBy: "series"` instead gives every band a colour, with steps past the palette derived from the theme's own.
    const derived = p.colorBy === "series" && m > hues ? _posterPalette(t, m) : null;
    const single = p.colorBy === "none";
    const grey = (i: number) => ctx.dimmed(series[i].key) || (!ctx.highlight.length && !derived && !single && m > hues && slot.get(i)! >= hues);
    const baseOf = (i: number) => (grey(i) ? t.context : ctx.highlight.length ? ctx.color(series[i].key, i) : single ? ctx.color() : derived ? derived[i] : ctx.color(series[i].key, m > hues ? slot.get(i)! : i));
    const colorOf = (i: number) => (ctx.selected(series[i].key) ? baseOf(i) : mix(t.surface, baseOf(i), 0.3));

    const W = ctx.width;
    const H = ctx.height;
    const compact = ctx.compact;
    const size = 13;
    const headH = 30;
    const top = headH + 6;
    const bottom = H - 6;
    const plotH = Math.max(40, bottom - top);
    const gap = 3;
    const sums = labels.map((_l, j) => series.reduce((s, _s, i) => s + val(i, j), 0));
    const k = (plotH - gap * (m - 1)) / (Math.max(...sums, 0) || 1);

    // Band edges at every period: stacks are centred so the whole form swells and narrows around one axis.
    const y0: number[][] = series.map(() => new Array<number>(n).fill(0));
    const y1: number[][] = series.map(() => new Array<number>(n).fill(0));
    labels.forEach((_l, j) => {
      const stack = sums[j] * k + gap * (m - 1);
      let y = top + (plotH - stack) / 2;
      for (const i of order[j]) {
        y0[i][j] = y;
        y1[i][j] = y + val(i, j) * k;
        y = y1[i][j] + gap;
      }
    });
    const cy = (i: number, j: number) => (y0[i][j] + y1[i][j]) / 2;

    // End labels.
    const both = (p.labels ?? "both") === "both";
    const last = n - 1;
    const fmt = ctx.fmt;
    const firstText = series.map((_, i) => (has(i, 0) ? fmt(val(i, 0)) : ""));
    const lastText = series.map((_, i) => (has(i, last) ? fmt(val(i, last)) : ""));
    const valW = (texts: string[]) => Math.ceil(Math.max(0, ...texts.map((s) => measureText(s, size, t.displayFamily, 600))));
    const firstW = valW(firstText);
    const lastW = valW(lastText);
    const leftNames = both && !compact;
    const fullNameW = Math.ceil(Math.max(0, ...series.map((s) => measureText(s.name, size, t.fontFamily, 600))));
    const nameW = Math.max(36, Math.min(fullNameW, Math.round(W * (compact ? 0.3 : leftNames ? 0.16 : 0.22))));
    const spread = (at: number[]) => {
      let ys = dodge(at, 17, top + 6, bottom - 6);
      for (let pass = 0; pass < 6; pass++) {
        const sorted = [...ys].sort((a, b) => a - b);
        if (!sorted.some((v, i) => i > 0 && v - sorted[i - 1] < 16.5)) break;
        ys = dodge(ys, 17, top + 6, bottom - 6);
      }
      return ys;
    };
    const atFirst = series.map((_, i) => cy(i, 0));
    const atLast = series.map((_, i) => cy(i, last));
    const labFirst = spread(atFirst);
    const labLast = spread(atLast);
    const moved = (at: number[], ys: number[], i: number) => Math.abs(ys[i] - at[i]) > 4;
    const distL = series.some((_, i) => moved(atFirst, labFirst, i)) ? 22 : 9;
    const distR = series.some((_, i) => moved(atLast, labLast, i)) ? 22 : 9;
    const xA = Math.round((leftNames ? nameW + 8 : 0) + firstW + distL);
    const xB = Math.round(W - nameW - 8 - lastW - distR);
    const span = Math.max(40, xB - xA);
    // Each period gets a flat run, so thickness is read where the band is level; the crossings happen between runs.
    const flat = n > 1 ? Math.min(26, (span / n) * 0.22) : span / 2;
    const xs = labels.map((_l, j) => (n > 1 ? xA + flat + (j * (span - 2 * flat)) / (n - 1) : xA + span / 2));
    const names = series.map((s) => truncateText(s.name, nameW, size, t.fontFamily, 600));

    // The outline is sampled into a polygon with a fixed number of points, so one state can tween into another.
    const edge = (ys: number[]) => {
      const pts: number[][] = [[xs[0] - flat, ys[0]]];
      for (let j = 0; j < n; j++) {
        pts.push([xs[j] + flat, ys[j]]);
        if (j === last) break;
        const ax = xs[j] + flat;
        const bx = xs[j + 1] - flat;
        const mx = (ax + bx) / 2;
        for (let s = 1; s <= STEPS; s++) {
          const u = s / STEPS;
          const v = 1 - u;
          pts.push([v * v * v * ax + 3 * v * v * u * mx + 3 * v * u * u * mx + u * u * u * bx, v * v * v * ys[j] + 3 * v * v * u * ys[j] + 3 * v * u * u * ys[j + 1] + u * u * u * ys[j + 1]]);
        }
      }
      return pts;
    };

    // At a crossing the band that changes rank is drawn over the one that stays level: a level band is easy to
    // follow behind a crossing, a rising one is not. Bands that move equally keep thin over thick. Each band
    // carries a surface-coloured edge, so the one on top is cut out of the one beneath.
    const travel = series.map((_, i) => rank[i].reduce<number>((sum, r, j) => sum + (j > 0 && r != null && rank[i][j - 1] != null ? Math.abs(r - rank[i][j - 1]!) : 0), 0));
    const layer = new Map(series.map((_, i) => i).sort((a, b) => travel[a] - travel[b] || (slot.get(a) ?? 0) - (slot.get(b) ?? 0)).map((i, z) => [i, z]));
    const showValues = p.values !== false;
    const step = n > 1 ? xs[1] - xs[0] : span;
    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const s = series[i];
      if (!s) return null;
      const fill = colorOf(i);
      const dim = grey(i);
      const live = ctx.selected(s.key);
      const opacity = live ? 1 : 0.4;
      const ink = inkOn(fill);
      const children: any[] = [
        {
          type: "polygon",
          shape: { points: [...edge(y0[i]), ...edge(y1[i]).reverse()] },
          style: { fill, stroke: t.surface, lineWidth: 1.5, lineJoin: "round", opacity: 1, enterFrom: { opacity: 0 } },
          enterAnimation: { duration: 500, delay: (slot.get(i) ?? 0) * 70 },
          emphasis: { style: { fill: mix(fill, ink, 0.12) } },
          transition: ["shape", "style"],
        },
      ];
      const leader = { stroke: t.axis, lineWidth: 1, fill: "none", opacity };
      // A part that is not needed is kept, hidden, so the list has the same shape for every band in every state.
      children.push({ type: "polyline", silent: true, invisible: !(has(i, 0) && moved(atFirst, labFirst, i)), shape: { points: [[xA - 3, atFirst[i]], [xA - 11, labFirst[i]], [xA - distL + 4, labFirst[i]]] }, style: leader, transition: ["shape"] });
      children.push({ type: "polyline", silent: true, invisible: !(has(i, last) && moved(atLast, labLast, i)), shape: { points: [[xB + 3, atLast[i]], [xB + 11, labLast[i]], [xB + distR - 4, labLast[i]]] }, style: leader, transition: ["shape"] });
      const nameStyle = { fill: dim ? t.muted : t.ink, fontSize: size, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily, verticalAlign: "middle", opacity };
      const valueStyle = { fill: dim ? t.muted : t.ink, fontSize: size, fontWeight: dim ? 400 : 600, fontFamily: t.displayFamily, verticalAlign: "middle", opacity };
      children.push({ type: "text", silent: true, invisible: !has(i, 0), style: { ...valueStyle, x: xA - distL, y: labFirst[i] + 0.5, text: firstText[i], align: "right" }, transition: ["style"] });
      children.push({ type: "text", silent: true, invisible: !(has(i, 0) && leftNames), style: { ...nameStyle, x: xA - distL - firstW - 8, y: labFirst[i] + 0.5, text: names[i], align: "right" }, transition: ["style"] });
      children.push({ type: "text", silent: true, invisible: !has(i, last), style: { ...valueStyle, x: xB + distR + lastW, y: labLast[i] + 0.5, text: lastText[i], align: "right" }, transition: ["style"] });
      children.push({ type: "text", silent: true, invisible: !has(i, last), style: { ...nameStyle, x: xB + distR + lastW + 8, y: labLast[i] + 0.5, text: names[i], align: "left" }, transition: ["style"] });
      // The values printed inside the band come last: their number changes with the data, and everything before
      // them keeps its place in the list so a data change tweens it.
      if (showValues) {
        for (let j = 1; j < last; j++) {
          if (!has(i, j)) continue;
          const text = fmt(val(i, j));
          const th = y1[i][j] - y0[i][j];
          if (th < 17 || measureText(text, 11.5, t.fontFamily, 600) > Math.min(step - 8, 2 * flat + step * 0.25)) continue;
          children.push({ type: "text", silent: true, invisible: false, style: { x: xs[j], y: cy(i, j) + 0.5, text, fill: ink, fontSize: 11.5, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: dim ? 0.75 : 1 } });
        }
      }
      // Stacking order is set on each shape (groups carry none), with every label above every band.
      children.forEach((c, at) => (c.z2 = at === 0 ? (dim ? 0 : 100) + (layer.get(i) ?? 0) : 1000));
      // Custom shapes have no built-in blur: state it, so hovering one mark dims the rest.
      for (const c of children) c.blur ??= { style: { opacity: c.type === "text" ? 0.35 : 0.2 } };
      // In a custom series the hover focus is declared on the returned element. It stays on with `select`: core
      // downplays before it pushes the rebuilt option, so a click leaves no mark stuck in its blur state.
      return { type: "group", focus: "self", children };
    };

    // Period headings over dotted rules; the bands cover the rules where there is data.
    const renderRules = () => {
      const children: any[] = [];
      // Headings that would touch are thinned, always keeping the first and the last.
      const widths = labels.map((label) => measureText(label, 12, t.fontFamily, 600));
      const at = labels.map((_l, j) => Math.min(W - widths[j] / 2, Math.max(widths[j] / 2, xs[j])));
      const kept: number[] = [];
      labels.forEach((_l, j) => {
        children.push({ type: "line", shape: { x1: xs[j], y1: 22, x2: xs[j], y2: H - 2 }, style: { stroke: t.axis, lineWidth: 1.5, lineDash: [0.5, 4], lineCap: "round" } });
        const prev = kept[kept.length - 1];
        const clear = (a: number, b: number) => at[b] - widths[b] / 2 >= at[a] + widths[a] / 2 + 8;
        if (prev === undefined || clear(prev, j)) kept.push(j);
        else if (j === last) {
          while (kept.length > 1 && !clear(kept[kept.length - 1], j)) kept.pop();
          kept.push(j);
        }
      });
      for (const j of kept) children.push({ type: "text", style: { x: at[j], y: 8, text: labels[j], fill: t.ink, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      return { type: "group", silent: true, children };
    };

    const lead = n ? order[last].filter((i) => has(i, last)) : [];
    const moves = series.map((s, i) => ({ s, from: rank[i][0], to: rank[i][last], i })).filter((d) => d.from != null && d.to != null);
    const climber = [...moves].sort((a, b) => b.from! - b.to! - (a.from! - a.to!))[0];
    const yName = Array.isArray(p.y) ? "values" : p.y;
    return {
      legend: [],
      alt: `Ribbon chart of ${yName} for ${m} ${p.series ?? "series"} over ${n} periods, ${labels[0]} to ${labels[last]}, stacked largest first in each period.${lead.length ? ` In ${labels[last]}: ${lead.slice(0, 3).map((i) => `${series[i].name} ${lastText[i]}`).join(", ")}.` : ""}${climber && climber.from! > climber.to! ? ` ${climber.s.name} moved from rank ${climber.from} to ${climber.to} (${firstText[climber.i]} to ${lastText[climber.i]}).` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; an empty off-canvas cartesian series takes them instead.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const s = series[d.dataIndex];
            if (!s || d.seriesId !== "ribbons") return "";
            const i = d.dataIndex;
            return tooltipHtml(ctx, s.name, labels.map((l, j) => ({ name: l, value: has(i, j) ? `${fmt(val(i, j))}  ·  #${rank[i][j]}` : "no data", color: j === last ? colorOf(i) : undefined })));
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "rules", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderRules as any, data: [0], z: 1 },
          {
            id: "ribbons",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            // ECharts rebuilds every element of a custom series when universal transition is on, and its path morph
            // scrambles a group of strokes and labels. With it off the elements are kept and each one tweens through
            // its own `transition`, which is what a data change needs here.
            universalTransition: { enabled: false },
            z: 2,
            dimensions: ["total"],
            encode: { tooltip: [0] },
            emphasis: { focus: "self" as const },
            renderItem: renderItem as any,
            data: series.map((s, i) => ({ id: s.key, name: s.key, value: [totals[i]] })),
          },
        ],
      },
    };
  },
});

const medals: [string, number[]][] = [
  ["Rowing club", [14, 12, 15, 11, 9, 8, 7, 6]],
  ["Athletics club", [9, 11, 10, 13, 16, 18, 17, 21]],
  ["Swimming club", [11, 10, 12, 12, 11, 13, 15, 14]],
  ["Cycling club", [3, 4, 6, 9, 12, 11, 13, 12]],
  ["Fencing club", [6, 5, 4, 4, 3, 3, 2, 2]],
  ["Judo club", [2, 3, 3, 2, 4, 5, 4, 6]],
  ["Archery club", [1, 1, 2, 1, 1, 2, 1, 1]],
];

export const examples = {
  "Long data, one highlighted": {
    data: [
      ["Cash", 46, 38, 27, 19, 12],
      ["Debit card", 31, 34, 37, 36, 33],
      ["Credit card", 15, 16, 17, 16, 15],
      ["Phone or watch", 2, 6, 14, 24, 36],
      ["Voucher", 6, 6, 5, 5, 4],
    ].flatMap(([method, ...shares]) => (shares as number[]).map((share, j) => ({ method, year: String(2016 + j * 2), share }))),
    series: "method",
    x: "year",
    y: "share",
    highlight: "Phone or watch",
    format: "{value}%",
    title: "Phone and watch payments rose from 2% to 36% of till sales between 2016 and 2024",
    subtitle: "Share of till transactions by payment method at one grocery chain, 2016 to 2024",
    note: "Illustrative figures.",
  },
  "Ten entities, one colour each": {
    data: [
      ["Assam", 40, 38, 36, 33, 30],
      ["Earl Grey", 34, 35, 33, 34, 32],
      ["Darjeeling", 28, 27, 25, 24, 22],
      ["Sencha", 12, 18, 26, 34, 41],
      ["Chai", 20, 22, 25, 27, 29],
      ["Oolong", 16, 16, 17, 18, 19],
      ["Rooibos", 14, 15, 15, 16, 16],
      ["Mint", 10, 12, 13, 15, 18],
      ["Chamomile", 9, 9, 10, 10, 11],
      ["Matcha", 4, 7, 11, 16, 22],
    ].flatMap(([tea, ...kg]) => (kg as number[]).map((sold, j) => ({ tea, year: String(2020 + j), sold }))),
    series: "tea",
    x: "year",
    y: "sold",
    colorBy: "series",
    format: "{value} kg",
    title: "Sencha sales rose from 12 kg to 41 kg between 2020 and 2024",
    subtitle: "Loose tea sold per year by one shop, ten teas, kilograms, 2020 to 2024, largest at the top each year",
    note: "Illustrative figures.",
  },
  "Stress: 7 entities, 8 periods, thin bands": {
    data: medals.flatMap(([club, counts]) => counts.map((medals, j) => ({ club, season: String(2017 + j), medals }))),
    series: "club",
    x: "season",
    y: "medals",
    title: "The athletics club's medals rose from 9 in 2017 to 21 in 2024",
    subtitle: "Medals won per season by seven clubs in one regional league, 2017 to 2024",
    note: "Illustrative figures.",
  },
};
