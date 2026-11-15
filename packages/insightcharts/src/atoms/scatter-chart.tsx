import { LineChart as ELine, ScatterChart as EScatter } from "echarts/charts";
import { alpha } from "../core/color";
import { fitAnnotations } from "./_annotations";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import type { FormatSpec } from "../core/format";
import { labelStyle, morph, tooltipHtml, valueAxis } from "../core/parts";
import { toNumber } from "../data/transform";

export interface ScatterChartProps {
  /** Numeric field on the horizontal axis. */
  x: string;
  /** Numeric field on the vertical axis. */
  y: string;
  /** Numeric field for bubble size. Area, not radius, is proportional to the value. */
  size?: string;
  /** Field that colours points by group. More than 4 groups fold into a grey "Other". */
  series?: string;
  /** Field naming each point: used for tooltips, direct labels and `highlight`. */
  label?: string;
  /** Which points get a text label. `"auto"` labels highlighted points, or the outliers when nothing is highlighted. An array labels those names. */
  labels?: "auto" | "all" | "none" | string[];
  /** Draw the least-squares line of best fit through all points. */
  trend?: boolean;
  /** Logarithmic x axis. State it in the subtitle. */
  logX?: boolean;
  /** Logarithmic y axis. State it in the subtitle. */
  logY?: boolean;
  /** Axis titles. Default to the field names. */
  xLabel?: string;
  yLabel?: string;
  /** Format for x values. `format` applies to y. */
  xFormat?: FormatSpec;
  /** Point opacity, 0 to 1. Default falls as the point count rises so dense regions read as darker. */
  opacity?: number;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

const MAX_HUES = 4;

/**
 * Dots on two value axes. Names a handful of points instead of all of them, handles
 * overplotting with translucency, and keeps colour to a few groups.
 */
export const ScatterChart = defineChart<ScatterChartProps>({
  name: "scatter-chart",
  title: "Scatter chart",
  category: "relationship",
  description: "Plots two numeric measures against each other, one dot per row, with optional bubble size, group colour, selective labels and a trend line.",
  whenToUse: "Showing whether and how two measures move together, spotting clusters and outliers, and placing named entities in a two-dimensional space (with quadrant lines via `annotations`).",
  avoid: "A measure over time (use line-chart); one numeric measure by category (use beeswarm-chart or strip-plot); fewer than about 8 points (use bar-chart or a table); more than 4 colour groups (facet with small-multiples).",
  use: [EScatter, ELine],
  defaults: { labels: "auto" },
  selectField: (p) => p.series,
  selectValue: (params) => params.seriesId,
  props: [
    { name: "x", type: "string", required: true, description: "Numeric field on the horizontal axis." },
    { name: "y", type: "string", required: true, description: "Numeric field on the vertical axis." },
    { name: "size", type: "string", description: "Numeric field for bubble size; area is proportional to the value." },
    { name: "series", type: "string", description: "Field that colours points by group. Beyond 4 groups the smallest fold into a grey Other." },
    { name: "label", type: "string", description: "Field naming each point, for tooltips, direct labels and `highlight`." },
    { name: "labels", type: '"auto" | "all" | "none" | string[]', default: '"auto"', description: "Which points are labelled. `auto`: highlighted points, or the outliers when nothing is highlighted. Overlapping labels are hidden." },
    { name: "trend", type: "boolean", default: "false", description: "Least-squares line of best fit through all points." },
    { name: "logX", type: "boolean", default: "false", description: "Logarithmic x axis." },
    { name: "logY", type: "boolean", default: "false", description: "Logarithmic y axis." },
    { name: "xLabel", type: "string", description: "x axis title. Defaults to the field name." },
    { name: "yLabel", type: "string", description: "y axis title. Defaults to the field name." },
    { name: "xFormat", type: "FormatSpec", description: "Format for x values; `format` applies to y." },
    { name: "opacity", type: "number", description: "Point opacity. Default falls as the point count rises." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "scatter-chart",
    data: [
      { country: "United States", spend: 12555, life: 77.5 },
      { country: "Switzerland", spend: 8049, life: 83.9 },
      { country: "Germany", spend: 8011, life: 80.8 },
      { country: "Norway", spend: 7771, life: 83.2 },
      { country: "Netherlands", spend: 6729, life: 81.4 },
      { country: "France", spend: 6630, life: 82.4 },
      { country: "Canada", spend: 6319, life: 81.6 },
      { country: "Sweden", spend: 6438, life: 83.1 },
      { country: "Australia", spend: 6372, life: 83.3 },
      { country: "United Kingdom", spend: 5493, life: 80.7 },
      { country: "Japan", spend: 5251, life: 84.5 },
      { country: "Italy", spend: 4291, life: 82.7 },
      { country: "Spain", spend: 4432, life: 83.3 },
      { country: "South Korea", spend: 4570, life: 83.6 },
      { country: "Portugal", spend: 4162, life: 81.5 },
      { country: "Israel", spend: 3444, life: 82.6 },
      { country: "Poland", spend: 2973, life: 76.5 },
      { country: "Chile", spend: 2699, life: 81.0 },
      { country: "Mexico", spend: 1181, life: 75.4 },
    ],
    x: "spend",
    y: "life",
    label: "country",
    highlight: "United States",
    labels: ["United States", "Japan", "Mexico", "Switzerland", "Poland"],
    xFormat: "currency:USD",
    xLabel: "Health spending per person",
    yLabel: "Life expectancy, years",
    title: "The United States spent $12,555 per person on health in 2022",
    subtitle: "Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years.",
    source: "OECD Health Statistics (rounded)",
    note: "Figures are approximate, for illustration",
  },
  markCount: (rows) => rows.length,
  build(p, ctx) {
    const t = ctx.tokens;
    const fx = ctx.formatter(p.xFormat);
    const fy = ctx.fmt;
    const xName = p.xLabel ?? p.x;
    const yName = p.yLabel ?? p.y;

    interface Pt {
      x: number;
      y: number;
      size: number | null;
      name: string;
      key: string;
    }
    const pts: Pt[] = [];
    for (const r of ctx.rows) {
      const x = toNumber(r[p.x]);
      const y = toNumber(r[p.y]);
      // A log axis cannot place zero or negative values; they are dropped rather than faked.
      if (Number.isNaN(x) || Number.isNaN(y) || (p.logX && x <= 0) || (p.logY && y <= 0)) continue;
      const s = p.size ? toNumber(r[p.size]) : NaN;
      pts.push({ x, y, size: Number.isNaN(s) ? null : Math.max(0, s), name: p.label ? String(r[p.label] ?? "") : "", key: p.series ? String(r[p.series] ?? "") : "" });
    }
    const n = pts.length;

    // Groups in first-seen order, so colours are stable; beyond the cap, keep the largest.
    const counts = new Map<string, number>();
    for (const d of pts) counts.set(d.key, (counts.get(d.key) ?? 0) + 1);
    let keys = [...counts.keys()];
    let other = false;
    if (p.series && keys.length > MAX_HUES) {
      const keep = new Set([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_HUES - 1).map((e) => e[0]));
      keys = keys.filter((k) => keep.has(k));
      other = true;
    }
    const keyIndex = new Map(keys.map((k, i) => [k, i]));
    const grouped = !!p.series && keys.length + (other ? 1 : 0) > 1;

    // Point-level highlight: `highlight` may name a point (by `label`) or a whole series.
    const pointLit = (d: Pt) => !!p.label && !ctx.dimmed(d.name);
    const colorOf = (d: Pt) => {
      if (pointLit(d) && ctx.dimmed(d.key)) return ctx.color(d.name);
      if (!grouped) return ctx.color(p.series ? d.key : undefined);
      const i = keyIndex.get(d.key);
      return i == null ? t.context : ctx.color(d.key, i);
    };
    const anyHighlight = ctx.dimmed("\u0000");
    const isDim = (d: Pt) => anyHighlight && ctx.dimmed(d.key) && !pointLit(d);

    const maxSize = Math.max(0, ...pts.map((d) => d.size ?? 0));
    const maxDiameter = ctx.compact ? 30 : 44;
    const dot = n <= 60 ? 9 : n <= 400 ? 7 : n <= 1500 ? 5 : 4;
    const diameter = (d: Pt) => (p.size && maxSize > 0 ? Math.max(4, Math.sqrt((d.size ?? 0) / maxSize) * maxDiameter) : dot);
    // Translucent marks lose more contrast on a dark surface, so dark mode gets a lift.
    const lift = ctx.mode === "dark" ? 1.5 : 1;
    const opacity = p.opacity ?? Math.min(1, (p.size ? 0.7 : n <= 60 ? 0.95 : n <= 250 ? 0.75 : n <= 1000 ? 0.5 : 0.32) * lift);

    // Least squares, fitted in the space the axes show (log when the axis is log).
    const tx = (v: number) => (p.logX ? Math.log10(v) : v);
    const ty = (v: number) => (p.logY ? Math.log10(v) : v);
    let fit: { slope: number; intercept: number; r2: number } | null = null;
    if (n >= 3) {
      let sx = 0;
      let sy = 0;
      for (const d of pts) {
        sx += tx(d.x);
        sy += ty(d.y);
      }
      const mx = sx / n;
      const my = sy / n;
      let sxx = 0;
      let sxy = 0;
      let syy = 0;
      for (const d of pts) {
        const dx = tx(d.x) - mx;
        const dy = ty(d.y) - my;
        sxx += dx * dx;
        sxy += dx * dy;
        syy += dy * dy;
      }
      if (sxx > 0 && syy > 0) fit = { slope: sxy / sxx, intercept: my - (sxy / sxx) * mx, r2: (sxy * sxy) / (sxx * syy) };
    }

    // Which points get named.
    const labelSet = new Set<number>();
    const mode = p.label ? p.labels ?? "auto" : "none";
    if (Array.isArray(mode)) pts.forEach((d, i) => mode.includes(d.name) && labelSet.add(i));
    else if (mode === "all") pts.forEach((_, i) => labelSet.add(i));
    else if (mode === "auto") {
      if (anyHighlight) pts.forEach((d, i) => pointLit(d) && labelSet.add(i));
      if (labelSet.size === 0 && !anyHighlight && n > 0) {
        // Outliers: farthest from the centre of the cloud (and from the trend, when drawn), in standard units.
        const sd = (f: (d: Pt) => number) => {
          const m = pts.reduce((s, d) => s + f(d), 0) / n;
          return [m, Math.sqrt(pts.reduce((s, d) => s + (f(d) - m) ** 2, 0) / n) || 1] as const;
        };
        const [mx, sdx] = sd((d) => tx(d.x));
        const [my, sdy] = sd((d) => ty(d.y));
        const resid = (d: Pt) => (fit ? ty(d.y) - (fit.intercept + fit.slope * tx(d.x)) : 0);
        const [, sdr] = sd(resid);
        const scored = pts.map((d, i) => ({ i, score: Math.max(Math.hypot((tx(d.x) - mx) / sdx, (ty(d.y) - my) / sdy), p.trend && fit ? (Math.abs(resid(d)) / sdr) * 1.2 : 0, p.size && maxSize ? ((d.size ?? 0) / maxSize) * 2.5 : 0) }));
        scored.sort((a, b) => b.score - a.score);
        const k = Math.min(n <= 12 ? n : ctx.compact ? 4 : 7, n);
        scored.slice(0, k).forEach((s) => labelSet.add(s.i));
      }
    }

    const groups = grouped ? [...keys, ...(other ? ["__other"] : [])] : ["__points"];
    const groupOf = (d: Pt) => (!grouped ? "__points" : keyIndex.has(d.key) ? d.key : "__other");
    const nameOf = (g: string) => (g === "__other" ? "Other" : g === "__points" ? yName : p.names?.[g] ?? g);
    const indexed = pts.map((d, i) => ({ d, i }));
    const fewPoints = n <= 60;

    const series: Record<string, any>[] = groups.map((g) => {
      const mine = indexed.filter(({ d }) => groupOf(d) === g);
      // Large bubbles first so small ones stay reachable; highlighted points last so they sit on top.
      mine.sort((a, b) => Number(!isDim(a.d)) - Number(!isDim(b.d)) || diameter(b.d) - diameter(a.d));
      const active = ctx.selected(g);
      return {
        id: g,
        name: nameOf(g),
        type: "scatter" as const,
        ...morph,
        z: mine.some(({ d }) => !isDim(d)) ? 3 : 2,
        large: false,
        // With `select` on, a click rebuilds the option under the pointer, which would leave the
        // hover blur stuck on the other series; selection does the fading instead.
        emphasis: { focus: grouped && !p.select ? ("series" as const) : ("none" as const), scale: 1.15 },
        labelLayout: { hideOverlap: true },
        data: mine.map(({ d, i }) => {
          const color = colorOf(d);
          const dim = isDim(d);
          // Context points stay solid when there are few of them, or the grey disappears into the page.
          const full = dim ? (fewPoints ? 1 : Math.min(opacity, 0.55)) : anyHighlight ? 1 : opacity;
          // Unselected points fade but must still read as present, even when already translucent.
          const a = active ? full : Math.max(0.22, full * 0.25);
          return {
            name: d.name,
            value: [d.x, d.y, d.size],
            symbolSize: diameter(d),
            itemStyle: { color: alpha(color, a), borderColor: p.size || fewPoints ? t.surface : "transparent", borderWidth: p.size ? 1 : fewPoints ? 1.5 : 0 },
            label: labelSet.has(i)
              ? { show: true, formatter: d.name, position: "top" as const, distance: 4, ...labelStyle(ctx, { color: dim ? t.inkSecondary : t.ink, fontWeight: !dim && anyHighlight ? 600 : 400 }), textBorderColor: t.surface, textBorderWidth: 2.5 }
              : { show: false },
          };
        }),
      };
    });

    if (p.trend && fit && n) {
      const xs = pts.map((d) => tx(d.x));
      const x0 = Math.min(...xs);
      const x1 = Math.max(...xs);
      const steps = p.logX !== p.logY ? 24 : 1;
      const back = (v: number, log?: boolean) => (log ? 10 ** v : v);
      series.push({
        id: "__trend",
        name: "Trend",
        type: "line",
        ...morph,
        silent: true,
        showSymbol: false,
        z: 4,
        lineStyle: { color: t.inkSecondary, width: 1.5, type: "solid", cap: "round" },
        tooltip: { show: false },
        data: Array.from({ length: steps + 1 }, (_, i) => {
          const v = x0 + ((x1 - x0) * i) / steps;
          return [back(v, p.logX), back(fit!.intercept + fit!.slope * v, p.logY)];
        }),
      });
    }

    // When every point shares one value (a crossfilter left a single year, say) the axis has
    // no extent to scale to; give it a small symmetric window around that value.
    const pad = (values: number[], log: boolean | undefined) => {
      if (!values.length) return {};
      const lo = Math.min(...values);
      const hi = Math.max(...values);
      if (lo !== hi) return {};
      if (log) return { min: lo / 2, max: lo * 2 };
      const d = Number.isInteger(lo) ? Math.max(1, Math.abs(lo) >= 10000 ? Math.abs(lo) * 0.05 : 1) : Math.abs(lo) * 0.1 || 1;
      return { min: lo - d, max: lo + d, minInterval: Number.isInteger(lo) ? 1 : undefined };
    };
    const axis = (log: boolean | undefined, f: (v: unknown) => string, values: number[]) => valueAxis(ctx, { type: log ? "log" : "value", scale: true, ...pad(values, log), axisLabel: { formatter: (v: number) => f(v), hideOverlap: true }, splitNumber: ctx.compact ? 3 : 5 });
    const title = { fill: t.muted, font: `${t.fontSize}px ${t.fontFamily}` };

    const legend: LegendItem[] = grouped ? groups.map((g) => ({ name: nameOf(g), color: g === "__other" ? t.context : ctx.color(g, keyIndex.get(g)), shape: "dot", muted: g === "__other" || ctx.dimmed(g) })) : [];

    const strength = fit ? (fit.r2 >= 0.6 ? "strong" : fit.r2 >= 0.25 ? "moderate" : fit.r2 >= 0.06 ? "weak" : "no clear") : "";
    const direction = fit && fit.r2 >= 0.06 ? (fit.slope > 0 ? " positive" : " negative") : "";
    const top = n ? pts.reduce((a, b) => (b.y > a.y ? b : a)) : null;
    const right = n ? pts.reduce((a, b) => (b.x > a.x ? b : a)) : null;
    const named = (d: Pt) => (d.name ? `${d.name} (${fx(d.x)}, ${fy(d.y)})` : `${fx(d.x)}, ${fy(d.y)}`);
    const alt = `${p.size ? "Bubble" : "Scatter"} chart of ${yName} against ${xName}, ${n} points${p.size ? `, sized by ${p.size}` : ""}${grouped ? `, coloured by ${p.series}` : ""}.${fit ? ` There is a ${strength}${direction} relationship (R² ${fit.r2.toFixed(2)}).` : ""}${top && right ? ` Highest ${yName}: ${named(top)}. Highest ${xName}: ${named(right)}.` : ""}`;

    // Fractions of the plot width, for keeping annotation labels inside the frame and off the points.
    const xsAll = pts.map((d) => (p.logX ? Math.log10(d.x) : d.x)).filter(Number.isFinite);
    const xLo = Math.min(...xsAll);
    const xHi = Math.max(...xsAll);
    const fracX = (v: number) => (xHi > xLo ? ((p.logX ? Math.log10(v) : v) - xLo) / (xHi - xLo) : 0.5);
    const place = (option: Record<string, any>) =>
      n === 0
        ? option
        : fitAnnotations(option, p.annotations, ctx, {
            sink: "scatter",
            // On a log axis distances are not linear in the value, so labels are padded but not moved.
            marks: p.logY ? [] : pts.map((d) => ({ fx: fracX(d.x), y: d.y })),
            fx: (x) => (typeof x === "number" ? fracX(x) : undefined),
            yMin: Math.min(...pts.map((d) => d.y)),
            yMax: Math.max(...pts.map((d) => d.y)),
            left: 44,
          });

    return {
      legend,
      alt,
      option: place({
        // Room above for the y-axis title and below for the x-axis title.
        grid: { top: 30, right: 20, bottom: 24 },
        xAxis: axis(p.logX, fx, pts.map((d) => d.x)),
        yAxis: axis(p.logY, fy, pts.map((d) => d.y)),
        graphic: [
          { type: "text", left: 4, top: 2, silent: true, style: { ...title, text: `${yName}${p.logY ? " (log scale)" : ""}` } },
          { type: "text", right: 20, bottom: 2, silent: true, style: { ...title, text: `${xName}${p.logX ? " (log scale)" : ""} →` } },
        ],
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (!Array.isArray(d.value)) return "";
            const rows = [
              { name: xName, value: fx(d.value[0]) },
              { name: yName, value: fy(d.value[1]) },
            ];
            if (p.size && d.value[2] != null) rows.push({ name: p.size, value: ctx.formatter("auto")(d.value[2]) });
            return tooltipHtml(ctx, d.name || (grouped ? d.seriesName : undefined), grouped && d.name ? [{ name: p.series!, value: d.seriesName }, ...rows] : rows);
          },
        },
        series,
      }),
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
const normal = (rnd: () => number) => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());

const countries = (() => {
  const rnd = seeded(7);
  const regions = ["Africa", "Asia", "Europe", "Americas"];
  const centre: Record<string, [number, number]> = { Africa: [3.35, 63], Asia: [3.95, 73], Europe: [4.5, 80], Americas: [4.1, 75.5] };
  const rows: { country: string; region: string; gdp: number; life: number; pop: number }[] = [];
  regions.forEach((region) => {
    for (let i = 0; i < 26; i++) {
      const g = centre[region][0] + normal(rnd) * 0.33;
      const life = centre[region][1] + (g - centre[region][0]) * 9 + normal(rnd) * 2.4;
      rows.push({ country: `${region} ${i + 1}`, region, gdp: Math.round(10 ** g), life: Math.round(life * 10) / 10, pop: Math.round(10 ** (0.4 + rnd() * 1.9 + (i === 3 ? 0.9 : 0)) * 10) / 10 });
    }
  });
  return rows;
})();

const dense = (() => {
  const rnd = seeded(42);
  return Array.from({ length: 2400 }, (_, i) => {
    const size = Math.max(30 + rnd() * 12, 95 + normal(rnd) * 38 + (rnd() < 0.08 ? 120 * rnd() : 0));
    const price = Math.max(60 + rnd() * 40, size * 3.1 + normal(rnd) * 70 + (rnd() < 0.03 ? 400 * rnd() : 0));
    return { id: `Sale ${i + 1}`, sqm: Math.round(size), price: Math.round(price) };
  });
})();

const quadrant = [
  { feature: "Search", usage: 82, satisfaction: 4.4 },
  { feature: "Dashboards", usage: 74, satisfaction: 3.1 },
  { feature: "Exports", usage: 61, satisfaction: 2.6 },
  { feature: "Alerts", usage: 48, satisfaction: 4.1 },
  { feature: "API", usage: 22, satisfaction: 4.5 },
  { feature: "Comments", usage: 31, satisfaction: 3.4 },
  { feature: "Mobile app", usage: 39, satisfaction: 2.2 },
  { feature: "SSO", usage: 18, satisfaction: 3.9 },
  { feature: "Templates", usage: 55, satisfaction: 3.8 },
  { feature: "Audit log", usage: 9, satisfaction: 3.0 },
];

export const examples = {
  "Bubbles, colour groups, log axis": {
    theme: "science",
    data: countries,
    x: "gdp",
    y: "life",
    size: "pop",
    series: "region",
    label: "country",
    logX: true,
    xFormat: "currency:USD",
    xLabel: "GDP per person",
    yLabel: "Life expectancy, years",
    title: "GDP per person and life expectancy, 104 countries",
    subtitle: "GDP per person (US$, log scale) against life expectancy. Bubble area is population.",
    note: "Illustrative data",
  },
  "Quadrants via annotations": {
    theme: "poster",
    data: quadrant,
    x: "usage",
    y: "satisfaction",
    label: "feature",
    labels: "all",
    highlight: ["Exports", "Dashboards"],
    xFormat: "{value}%",
    xLabel: "Weekly active users who use it",
    yLabel: "Satisfaction, 1 to 5",
    annotations: [
      { type: "line", axis: "x", value: 50, label: "Widely used" },
      { type: "line", axis: "y", value: 3.5, label: "Liked" },
    ],
    title: "Exports is used by 61% of weekly users and rated 2.6 out of 5",
    subtitle: "Share of weekly users against mean satisfaction, by feature. Dashboards is used by 74% and rated 3.1.",
    note: "Illustrative data",
  },
  "Stress: 2,400 points with a trend": {
    theme: "noir",
    data: dense,
    x: "sqm",
    y: "price",
    label: "id",
    labels: "none",
    trend: true,
    xFormat: "{value} m²",
    format: "{value}k",
    xLabel: "Floor area",
    yLabel: "Sale price, thousands",
    title: "Floor area and sale price, 2,400 home sales",
    subtitle: "Floor area in m² against sale price in thousands, with a least-squares trend line",
    note: "Illustrative data",
  },
};
