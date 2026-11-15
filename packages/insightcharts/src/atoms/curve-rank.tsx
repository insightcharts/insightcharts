import { CustomChart } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import type { FormatSpec } from "../core/format";
import { dodge, measureText, truncateText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";
import { _posterPalette } from "./_poster-colors";

export interface CurveRankProps {
  /** Entity field: one curve per row. */
  name: string;
  /** Field for the left-hand measure. */
  left: string;
  /** Field for the right-hand measure. */
  right: string;
  /** Heading over the left rule: the measure and its unit. Defaults to the field name. */
  leftLabel?: string;
  /** Heading over the right rule. Defaults to the field name. */
  rightLabel?: string;
  /** Scale of the left measure. A log scale is stated in the heading. */
  leftScale?: "linear" | "log";
  /** Scale of the right measure. */
  rightScale?: "linear" | "log";
  /** Which end of the left measure sits at the top. Default `"high"`. */
  leftTop?: "high" | "low";
  /** Which end of the right measure sits at the top. Default `"high"`. */
  rightTop?: "high" | "low";
  /** How to print left values. Defaults to `format`. */
  leftFormat?: FormatSpec;
  /** How to print right values. Defaults to `format`. */
  rightFormat?: FormatSpec;
  /** Entity names in the order that assigns colours. Entities not listed follow in data order. Give glyph-table the same list to match colours. */
  order?: string[];
  /** `"series"`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (glyph-table derives the same ones). `"none"`: every curve in the accent. Default: series while the entities fit the palette (at most 8), none beyond. */
  colorBy?: "series" | "none";
  /** Display names for entity keys. */
  names?: Record<string, string>;
}

type _CurveItem = { key: string; name: string; l: number; r: number; index: number };

/**
 * Two different measures of the same entities, each on its own vertical scale, joined by one
 * S-curve per entity. A steep curve is an entity that sits high on one measure and low on the other.
 */
export const CurveRank = defineChart<CurveRankProps>({
  name: "curve-rank",
  title: "Curve rank",
  category: "poster",
  description: "Places each entity on two parallel scales, one per measure, and joins its two positions with a smooth S-curve labelled with the name and both values.",
  whenToUse: "Two different measures of the same 4 to about 15 entities, when the point is how standing on one relates to standing on the other: price against sales, staff against output, cost against usage. Each side has its own scale, stated in its heading.",
  avoid: "The same measure at two moments (use slope-chart); ranks across many periods (use bump-chart); more than about 15 entities or a statistical relationship (use scatter-chart); exact comparison on one measure (use bar-chart).",
  use: [CustomChart],
  defaults: { leftScale: "linear", rightScale: "linear" },
  selectField: (p) => p.name,
  height: (_p, rows) => Math.max(340, rows.length * 34 + 60),
  props: [
    { name: "name", type: "string", required: true, description: "Entity field: one curve per row." },
    { name: "left", type: "string", required: true, description: "Field for the left-hand measure." },
    { name: "right", type: "string", required: true, description: "Field for the right-hand measure." },
    { name: "leftLabel", type: "string", description: "Heading over the left rule: the measure and its unit. Defaults to the field name." },
    { name: "rightLabel", type: "string", description: "Heading over the right rule. Defaults to the field name." },
    { name: "leftScale", type: '"linear" | "log"', default: '"linear"', description: "Scale of the left measure. A log scale is stated in the heading." },
    { name: "rightScale", type: '"linear" | "log"', default: '"linear"', description: "Scale of the right measure." },
    { name: "leftTop", type: '"high" | "low"', default: '"high"', description: "Which end of the left measure sits at the top." },
    { name: "rightTop", type: '"high" | "low"', default: '"high"', description: "Which end of the right measure sits at the top." },
    { name: "leftFormat", type: "FormatSpec", description: "How to print left values. Defaults to `format`." },
    { name: "rightFormat", type: "FormatSpec", description: "How to print right values. Defaults to `format`." },
    { name: "order", type: "string[]", description: "Entity names in the order that assigns colours. Pass the same list to glyph-table to match its row colours." },
    { name: "colorBy", type: '"series" | "none"', description: "`series`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (glyph-table derives the same ones). `none`: every curve in the accent. Default: series while the entities fit the palette (at most 8), none beyond." },
    { name: "names", type: "Record<string, string>", description: "Display names for entity keys." },
  ],
  example: {
    type: "curve-rank",
    theme: "blueprint",
    data: [
      { drink: "Filter coffee", price: 2.4, cups: 310 },
      { drink: "Espresso", price: 2.6, cups: 145 },
      { drink: "Flat white", price: 3.6, cups: 260 },
      { drink: "Iced latte", price: 4.2, cups: 180 },
      { drink: "Matcha latte", price: 4.8, cups: 75 },
      { drink: "Hot chocolate", price: 3.9, cups: 40 },
    ],
    name: "drink",
    left: "price",
    right: "cups",
    leftLabel: "Price per cup",
    rightLabel: "Cups sold a day",
    leftFormat: { style: "currency", currency: "GBP" },
    leftTop: "low",
    title: "Filter coffee sold 310 cups a day at £2.40 a cup",
    subtitle: "Price per cup and cups sold per day for six drinks at one café, cheapest at the top",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const logL = p.leftScale === "log";
    const logR = p.rightScale === "log";
    const raw: _CurveItem[] = [];
    for (const row of ctx.rows) {
      const l = toNumber(row[p.left]);
      const r = toNumber(row[p.right]);
      if (Number.isNaN(l) || Number.isNaN(r) || (logL && l <= 0) || (logR && r <= 0)) continue;
      const key = String(row[p.name] ?? "");
      raw.push({ key, name: p.names?.[key] ?? key, l, r, index: 0 });
    }
    // Colour follows the entity's place in `order`, so a table beside this chart can use the same list.
    const rankIn = (key: string) => {
      const at = p.order ? p.order.indexOf(key) : -1;
      return at === -1 ? Infinity : at;
    };
    const ordered = raw.map((it, i) => ({ it, i })).sort((a, b) => rankIn(a.it.key) - rankIn(b.it.key) || a.i - b.i).map((d) => d.it);
    ordered.forEach((it, i) => (it.index = i));
    const items = ordered;
    const n = items.length;
    // Identity colours are never cycled: a small poster palette may hold only 4 or 5.
    const hues = Math.min(8, t.categorical.length);
    // An explicit `colorBy: "series"` past the palette size takes further steps derived from the theme's own colours.
    const derived = p.colorBy === "series" && n > hues ? _posterPalette(t, n) : null;
    const bySeries = derived != null || (p.colorBy ?? (n <= hues ? "series" : "none")) === "series";
    const colorOf = (it: _CurveItem) => {
      const base = ctx.highlight.length ? ctx.color(it.key, it.index) : derived ? derived[it.index] : bySeries ? ctx.color(it.key, it.index) : ctx.color(it.key);
      return ctx.selected(it.key) ? base : alpha(base, 0.25);
    };

    const fmtL = p.leftFormat ? ctx.formatter(p.leftFormat) : ctx.fmt;
    const fmtR = p.rightFormat ? ctx.formatter(p.rightFormat) : ctx.fmt;
    const W = ctx.width;
    const H = ctx.height;
    const compact = ctx.compact;
    const size = 13;
    const headH = 34;
    const top = headH + 10;
    const bottom = H - 12;
    const plotH = Math.max(40, bottom - top);

    const scaleOf = (values: number[], log: boolean, topEnd: "high" | "low" | undefined) => {
      const f = (v: number) => (log ? Math.log10(v) : v);
      const lo = Math.min(...values.map(f));
      const hi = Math.max(...values.map(f));
      const span = hi - lo || 1;
      return (v: number) => {
        const u = (f(v) - lo) / span;
        return top + (topEnd === "low" ? u : 1 - u) * plotH;
      };
    };
    const yL = scaleOf(items.map((it) => it.l), logL, p.leftTop);
    const yR = scaleOf(items.map((it) => it.r), logR, p.rightTop);
    const atL = items.map((it) => yL(it.l));
    const atR = items.map((it) => yR(it.r));

    // Core `dodge` clamps each cluster to the range after merging, so a cluster pushed back in from an
    // edge can land on its neighbour; feeding the result back in merges them.
    const gap = 19;
    const spread = (at: number[]) => {
      let ys = dodge(at, gap, top, bottom);
      for (let pass = 0; pass < 6; pass++) {
        const sorted = [...ys].sort((a, b) => a - b);
        if (!sorted.some((v, i) => i > 0 && v - sorted[i - 1] < gap - 0.5)) break;
        ys = dodge(ys, gap, top, bottom);
      }
      return ys;
    };
    const labL = spread(atL);
    const labR = spread(atR);
    const moved = (at: number[], ys: number[], i: number) => Math.abs(ys[i] - at[i]) > 4;
    const distL = items.some((_, i) => moved(atL, labL, i)) ? 26 : 13;
    const distR = items.some((_, i) => moved(atR, labR, i)) ? 26 : 13;

    const textL = items.map((it) => fmtL(it.l));
    const textR = items.map((it) => fmtR(it.r));
    const valLW = Math.ceil(Math.max(0, ...textL.map((s) => measureText(s, size, t.displayFamily, 600))));
    const valRW = Math.ceil(Math.max(0, ...textR.map((s) => measureText(s, size, t.displayFamily, 600))));
    const minCurve = compact ? 80 : 180;
    const fullNameW = Math.ceil(Math.max(0, ...items.map((it) => measureText(it.name, size, t.fontFamily, 600))));
    const nameW = Math.max(40, Math.min(fullNameW, Math.round(W * (compact ? 0.36 : 0.3)), W - minCurve - valLW - valRW - distL - distR - 12));
    const xL = Math.round(nameW + 10 + valLW + distL);
    const xR = Math.round(W - valRW - distR);
    const mid = (xL + xR) / 2;
    const names = items.map((it) => truncateText(it.name, nameW, size, t.fontFamily, 600));
    // Poster weight for a handful of curves, lighter once they crowd.
    const lineW = n <= 8 ? Math.max(4, t.lineWidth + 1.5) : Math.max(3, t.lineWidth + 0.5);

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const dim = ctx.dimmed(it.key);
      const color = colorOf(it);
      const live = ctx.selected(it.key);
      const opacity = live ? 1 : 0.4;
      const width = dim ? 1.5 : lineW;
      const children: any[] = [
        {
          type: "bezierCurve",
          shape: { x1: xL, y1: atL[i], x2: xR, y2: atR[i], cpx1: mid, cpy1: atL[i], cpx2: mid, cpy2: atR[i], percent: 1 },
          style: { stroke: color, lineWidth: width, fill: "none", lineCap: "round" },
          enterFrom: { shape: { percent: 0 } },
          enterAnimation: { duration: 700, delay: i * 60, easing: "cubicOut" },
          emphasis: { style: { lineWidth: width + 1.5 } },
          transition: ["shape", "style"],
        },
      ];
      // Every item returns the same children in the same order, so a data change tweens each one to its new place
      // instead of redrawing: a leader that is not needed is kept, hidden.
      const leader = { stroke: t.axis, lineWidth: 1, fill: "none", opacity };
      children.push({ type: "polyline", silent: true, invisible: !moved(atL, labL, i), shape: { points: [[xL - 8, atL[i]], [xL - 15, labL[i]], [xL - distL + 4, labL[i]]] }, style: leader, transition: ["shape"] });
      children.push({ type: "polyline", silent: true, invisible: !moved(atR, labR, i), shape: { points: [[xR + 8, atR[i]], [xR + 15, labR[i]], [xR + distR - 4, labR[i]]] }, style: leader, transition: ["shape"] });
      const r = dim ? 3.5 : n <= 8 ? 6 : 5;
      for (const [cx, cy] of [[xL, atL[i]], [xR, atR[i]]]) children.push({ type: "circle", shape: { cx, cy, r }, style: { fill: color, stroke: t.surface, lineWidth: dim ? 1 : 2 }, transition: ["shape", "style"] });
      const nameStyle = { fill: dim ? t.muted : t.ink, fontSize: size, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily, verticalAlign: "middle", opacity };
      const valueStyle = { fill: dim ? t.muted : t.ink, fontSize: size, fontWeight: dim ? 400 : 600, fontFamily: t.displayFamily, verticalAlign: "middle", opacity };
      children.push({ type: "text", silent: true, style: { ...nameStyle, x: xL - distL - valLW - 10, y: labL[i] + 0.5, text: names[i], align: "right" }, transition: ["style"] });
      children.push({ type: "text", silent: true, style: { ...valueStyle, x: xL - distL, y: labL[i] + 0.5, text: textL[i], align: "right" }, transition: ["style"] });
      children.push({ type: "text", silent: true, style: { ...valueStyle, x: xR + distR, y: labR[i] + 0.5, text: textR[i], align: "left" }, transition: ["style"] });
      // The curves are thin, so the printed labels take the hover and the click as well: one unpainted box per side.
      const nameTextW = measureText(names[i], size, t.fontFamily, 600);
      children.push({ type: "rect", shape: { x: xL - distL - valLW - 10 - nameTextW - 2, y: labL[i] - 9, width: nameTextW + 10 + valLW + 4, height: 18 }, style: { fill: "rgba(0,0,0,0)" }, blur: { style: { opacity: 1 } } });
      children.push({ type: "rect", shape: { x: xR + distR - 2, y: labR[i] - 9, width: valRW + 4, height: 18 }, style: { fill: "rgba(0,0,0,0)" }, blur: { style: { opacity: 1 } } });
      // Stacking order is set on each shape (groups carry none): highlighted curves over the context ones, labels over both.
      children.forEach((c) => (c.z2 = c.type === "text" ? 10 : dim ? 1 : 3));
      // Custom shapes have no built-in blur: state it, so hovering one mark dims the rest.
      for (const c of children) c.blur ??= { style: { opacity: c.type === "text" ? 0.35 : 0.2 } };
      // In a custom series the hover focus is declared on the returned element. It stays on with `select`: core
      // downplays before it pushes the rebuilt option, so a click leaves no mark stuck in its blur state.
      return { type: "group", focus: "self", children };
    };

    // The scales are drawn as nothing more than a dotted rule under a heading: positions are read from the printed values.
    const headL = `${p.leftLabel ?? p.left}${logL ? " (log scale)" : ""}`;
    const headR = `${p.rightLabel ?? p.right}${logR ? " (log scale)" : ""}`;
    const renderRules = () => {
      const children: any[] = [];
      const half = W / 2 - 8;
      const head = (text: string, x: number, side: "left" | "right") => {
        const w = measureText(text, 12, t.fontFamily, 600);
        // The heading ends at its rule when it fits there, and otherwise starts from the outer edge.
        const room = side === "left" ? x : W - x;
        const fitsAtRule = w <= room;
        const shown = truncateText(text, half, 12, t.fontFamily, 600);
        children.push({
          type: "text",
          style: { x: fitsAtRule ? x : side === "left" ? 0 : W, y: 8, text: shown, fill: t.ink, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, align: fitsAtRule ? (side === "left" ? "right" : "left") : side, verticalAlign: "middle" },
        });
        children.push({ type: "line", shape: { x1: x, y1: 22, x2: x, y2: H - 2 }, style: { stroke: t.axis, lineWidth: 1.5, lineDash: [0.5, 4], lineCap: "round" } });
      };
      head(headL, xL, "left");
      head(headR, xR, "right");
      return { type: "group", silent: true, children };
    };

    const byL = [...items].sort((a, b) => b.l - a.l);
    const byR = [...items].sort((a, b) => b.r - a.r);
    const say = (it: _CurveItem) => `${it.name} (${fmtL(it.l)}, ${fmtR(it.r)})`;
    const focus = ctx.highlight.length ? items.filter((it) => !ctx.dimmed(it.key)) : [];
    return {
      legend: [],
      alt: `Curve rank chart joining ${p.leftLabel ?? p.left}${logL ? " (log scale)" : ""} on the left to ${p.rightLabel ?? p.right}${logR ? " (log scale)" : ""} on the right for ${n} ${p.name} values.${focus.length ? ` Highlighted: ${focus.map(say).join("; ")}.` : ""}${n ? ` Highest on the left: ${say(byL[0])}; lowest: ${say(byL[n - 1])}. Highest on the right: ${say(byR[0])}; lowest: ${say(byR[n - 1])}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; an empty off-canvas cartesian series takes them instead.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            if (!it || d.seriesId !== "curves") return "";
            return tooltipHtml(ctx, it.name, [{ name: p.leftLabel ?? p.left, value: textL[d.dataIndex], color: colorOf(it) }, { name: p.rightLabel ?? p.right, value: textR[d.dataIndex] }]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "rules", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderRules as any, data: [0], z: 1 },
          {
            id: "curves",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            // ECharts rebuilds every element of a custom series when universal transition is on, and its path morph
            // scrambles a group of strokes and labels. With it off the elements are kept and each one tweens through
            // its own `transition`, which is what a data change needs here.
            universalTransition: { enabled: false },
            z: 2,
            dimensions: ["left", "right"],
            encode: { tooltip: [0, 1] },
            emphasis: { focus: "self" as const },
            renderItem: renderItem as any,
            data: items.map((it) => ({ id: it.key, name: it.key, value: [it.l, it.r] })),
          },
        ],
      },
    };
  },
});

const districts: [string, number, number, number, number][] = [
  ["Old Town", 1480, 12, 9, 18400],
  ["Harbour", 1390, 15, 6, 12100],
  ["Riverside", 1310, 18, 22, 21700],
  ["University", 1180, 14, 15, 26300],
  ["Market", 1120, 20, 4, 9800],
  ["Hillcrest", 1040, 26, 31, 15200],
  ["Northgate", 960, 31, 12, 30500],
  ["Eastfield", 890, 34, 17, 24900],
  ["Mill Quarter", 820, 29, 8, 7600],
  ["Lakeside", 760, 41, 38, 11300],
];

export const examples = {
  "One highlighted, log scale on the right": {
    data: [
      { venue: "Corner bakery", staff: 4, visits: 380 },
      { venue: "Riverside café", staff: 7, visits: 910 },
      { venue: "Station kiosk", staff: 2, visits: 2400 },
      { venue: "Market hall", staff: 18, visits: 5200 },
      { venue: "Museum restaurant", staff: 22, visits: 640 },
      { venue: "Food truck", staff: 3, visits: 720 },
      { venue: "Hotel bar", staff: 9, visits: 210 },
    ],
    name: "venue",
    left: "staff",
    right: "visits",
    leftLabel: "Staff",
    rightLabel: "Customers a day",
    rightScale: "log",
    highlight: "Station kiosk",
    title: "The station kiosk served 2,400 customers a day with 2 staff",
    subtitle: "Staff and daily customers at seven food venues in one town",
    note: "Illustrative figures.",
  },
  "Ten entities, one colour each": {
    theme: "ledger",
    data: districts.map(([district, rent, commute]) => ({ district, rent, commute })),
    name: "district",
    left: "rent",
    right: "commute",
    leftLabel: "Median rent a month",
    rightLabel: "Commute to the centre, minutes",
    leftFormat: { style: "currency", currency: "EUR", maximumFractionDigits: 0 },
    rightFormat: "{value} min",
    rightTop: "low",
    colorBy: "series",
    title: "Old Town had a 12-minute commute at a median rent of €1,480 a month",
    subtitle: "Median monthly rent and commute time to the centre for ten districts of one city, shortest commute at the top",
    note: "Illustrative figures for an invented city.",
  },
  "Stress: 14 entities, close values, long names": {
    theme: "noir",
    data: [
      ["Northern Line Extension to the Harbour", 41, 12.4], ["Ring Road Bus Rapid Transit", 39, 11.9], ["Airport Express", 38, 31.0], ["Old Town Tram", 37, 9.8],
      ["University Shuttle", 22, 3.1], ["Riverside Ferry", 21, 6.4], ["Hillcrest Funicular", 20, 6.2], ["Night Bus Network", 19, 6.0],
      ["East-West Metro", 64, 30.2], ["Suburban Rail", 58, 29.5], ["Cross-Town Cycle Hire", 9, 1.2], ["Park and Ride", 8, 1.1], ["Demand-Responsive Minibus", 7, 14.8], ["Harbour Cable Car", 6, 13.9],
    ].map(([service, satisfaction, cost]) => ({ service, satisfaction, cost })),
    name: "service",
    left: "satisfaction",
    right: "cost",
    leftLabel: "Riders satisfied, %",
    rightLabel: "Cost per trip, €",
    leftFormat: "{value}%",
    rightFormat: { style: "currency", currency: "EUR" },
    highlight: ["Demand-Responsive Minibus", "East-West Metro"],
    title: "The minibus cost €14.80 a trip with 7% of riders satisfied",
    subtitle: "Share of riders satisfied and operating cost per trip for 14 transport services in one city",
    note: "Illustrative figures.",
  },
};
