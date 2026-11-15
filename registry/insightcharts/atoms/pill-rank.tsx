"use client";

import { CustomChart } from "echarts/charts";
import { alpha, inkOn, luminance, mix, defineChart, measureText, truncateText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface PillRankProps {
  /** Name field: one row per data row. */
  name: string;
  /** Value field: pill width. Non-positive values are dropped. */
  value: string;
  /** Sort rows largest first. Default true. Set false to keep the data order. */
  sort?: boolean;
  /** Names of rows that are not ranked: they are drawn below a dotted rule, without a rank number. */
  compare?: string[];
  /** Short heading over the comparison rows, e.g. "For comparison". */
  compareLabel?: string;
  /** Value that fills the full pill width. Default: the largest value. */
  max?: number;
  /** Show the rank number at the right edge. Default true. */
  ranks?: boolean;
}

const ROW = 42;
const RULE = 30;

/**
 * A ranking as a column of centred pills. Centring trades the shared baseline for a
 * symmetric silhouette, so every value is printed beside its pill.
 */
export const PillRank = defineChart<PillRankProps>({
  name: "pill-rank",
  title: "Pill rank",
  category: "poster",
  description: "Shows a ranked list as horizontally centred rounded bars, with each name in capitals on its pill, the value at the left edge and the rank at the right.",
  whenToUse: "A poster ranking of 4 to about 20 named things where the order and the overall silhouette matter more than fine differences: top cities, largest employers, league tables, with one row highlighted and optional reference rows set apart below.",
  avoid: "Precise comparison of values (use bar-chart, where bars share a baseline); negative values (use diverging-bar-chart); change in rank over time (use bump-chart); more than about 25 rows (use data-table).",
  use: [CustomChart],
  defaults: { sort: true, ranks: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "pills" ? params.name : null),
  height: (p, rows, width) => {
    // Only rows that are drawn count. On a phone each row also holds its name above the pill, so it is a little taller.
    const drawn = rows.filter((r) => toNumber(r[p.value]) > 0);
    const extra = (p.compare ?? []).filter((c) => drawn.some((r) => String(r[p.name] ?? "") === c)).length;
    return drawn.length * (width != null && width < 480 ? ROW + 4 : ROW) + (extra ? RULE : 0) + 4;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one row per data row." },
    { name: "value", type: "string", required: true, description: "Value field: pill width. Non-positive values are dropped." },
    { name: "sort", type: "boolean", default: "true", description: "Sort rows largest first. Set false to keep the data order." },
    { name: "compare", type: "string[]", description: "Names of rows that are not ranked: drawn below a dotted rule, without a rank number." },
    { name: "compareLabel", type: "string", description: 'Short heading over the comparison rows, e.g. "For comparison".' },
    { name: "max", type: "number", description: "Value that fills the full pill width. Default: the largest value." },
    { name: "ranks", type: "boolean", default: "true", description: "Show the rank number at the right edge." },
  ],
  example: {
    type: "pill-rank",
    theme: "paper",
    data: [
      { river: "Nile", km: 6650 },
      { river: "Amazon", km: 6400 },
      { river: "Yangtze", km: 6300 },
      { river: "Mississippi-Missouri", km: 6275 },
      { river: "Yenisei", km: 5539 },
      { river: "Yellow River", km: 5464 },
      { river: "Ob-Irtysh", km: 5410 },
      { river: "Congo", km: 4700 },
      { river: "Danube", km: 2850 },
      { river: "Rhine", km: 1230 },
    ],
    name: "river",
    value: "km",
    format: "{value} km",
    highlight: "Congo",
    compare: ["Danube", "Rhine"],
    compareLabel: "Europe, for comparison",
    title: "The Congo is 4,700 km long",
    subtitle: "Length of eight major river systems and two European rivers, kilometres",
    source: "Encyclopaedia Britannica",
    note: "Lengths of river systems are approximate and vary by source",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    // Judged by the surface, not the page mode: a poster theme paints a dark ground on a light page.
    const onDark = /^(#|rgb)/.test(t.surface) ? luminance(t.surface) < 0.2 : ctx.mode === "dark";
    const W = ctx.width;
    type Row = { key: string; value: number; rank: number | null };
    const all: Row[] = [];
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v) && v > 0) all.push({ key: String(r[p.name] ?? ""), value: v, rank: null });
    }
    const cmp = new Set(p.compare ?? []);
    const ranked = all.filter((r) => !cmp.has(r.key));
    const others = all.filter((r) => cmp.has(r.key));
    if (p.sort !== false) {
      ranked.sort((a, b) => b.value - a.value);
      others.sort((a, b) => b.value - a.value);
    }
    // Rank is by value whatever the drawing order; ties share a rank.
    const desc = [...ranked].sort((a, b) => b.value - a.value);
    desc.forEach((r, i) => (r.rank = i > 0 && desc[i - 1].value === r.value ? desc[i - 1].rank : i + 1));
    const rows = [...ranked, ...others];
    const n = rows.length;
    const max = Math.max(p.max ?? 0, ...rows.map((r) => r.value), 0) || 1;
    const showRanks = p.ranks !== false;

    const rule = others.length ? RULE : 0;
    const rowH = Math.max(26, Math.min(56, (ctx.height - rule - 4) / Math.max(1, n)));
    // On a phone the name moves to its own line above a thinner pill.
    const stacked = ctx.compact;
    const nameSize = stacked ? 11 : rowH >= 38 ? 12 : 11;
    const pillH = stacked ? Math.max(12, Math.min(18, rowH - 20)) : Math.max(18, Math.min(30, rowH - 12));
    const valueSize = stacked ? 13 : Math.max(13, Math.min(17, rowH * 0.4));
    const rankSize = stacked ? 12 : 13;
    const texts = rows.map((r) => ctx.fmt(r.value));
    const valueW = Math.max(0, ...texts.map((s) => measureText(s, valueSize, t.displayFamily, 600)));
    const rankW = showRanks ? measureText(String(ranked.length), rankSize, t.fontFamily, 600) : 0;
    // Equal gutters keep the pills centred on the frame; the pill never reaches the numbers.
    const gutter = Math.ceil(Math.max(valueW, rankW) + (stacked ? 20 : 30));
    const trackX = 0;
    const trackW = W;
    const full = Math.max(20, trackW - 2 * gutter);
    const cx = trackX + trackW / 2;
    const upper = (s: string) => s.toLocaleUpperCase(ctx.locale);
    const yOf = (i: number) => i * rowH + (i >= ranked.length ? rule : 0);

    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (r: Row) => (cmp.has(r.key) && !(anyHighlight && !ctx.dimmed(r.key)) ? t.context : ctx.color(r.key));
    const fillOf = (r: Row) => (ctx.selected(r.key) ? baseOf(r) : mix(t.surface, baseOf(r), 0.3));
    const track = alpha(t.ink, onDark ? 0.09 : 0.055);

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const r = rows[i];
      if (!r) return null;
      const y = yOf(i);
      const fill = fillOf(r);
      const ink = inkOn(fill);
      // Small values keep their true width down to a sliver, so the last rows do not all look alike.
      const w = Math.max(4, (full * r.value) / max);
      const trackH = pillH + (stacked ? 0 : 8);
      const trackY = stacked ? y + rowH - pillH - 5 : y + (rowH - trackH) / 2;
      const pillY = trackY + (trackH - pillH) / 2;
      const mid = trackY + trackH / 2;
      const lit = anyHighlight && !ctx.dimmed(r.key);
      const strong = ctx.selected(r.key);
      const delay = Math.min(500, i * 45);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 250 };
      const children: any[] = [
        { type: "rect", shape: { x: trackX, y: trackY, width: trackW, height: trackH, r: trackH / 2 }, style: { fill: track }, blur: { style: { opacity: 0.5 } } },
        {
          type: "rect",
          shape: { x: cx - w / 2, y: pillY, width: w, height: pillH, r: Math.min(pillH, w) / 2, enterFrom: { x: cx - 2, width: 4 } },
          style: { fill },
          emphasis: { style: { fill: mix(fill, ink, 0.12) } },
          blur: fade,
          transition: ["shape", "style"],
          enterAnimation: { duration: 560, delay, easing: "cubicOut" },
        },
        { type: "text", silent: true, style: { text: texts[i], x: trackX + (stacked ? 8 : 14), y: mid, fill: strong ? t.ink : t.muted, fontSize: valueSize, fontWeight: lit ? 700 : 600, fontFamily: t.displayFamily, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear },
      ];
      if (showRanks && r.rank != null) children.push({ type: "text", silent: true, style: { text: String(r.rank), x: trackX + trackW - (stacked ? 8 : 14), y: mid, fill: lit ? t.ink : t.muted, fontSize: rankSize, fontWeight: lit ? 700 : 600, fontFamily: t.fontFamily, align: "right", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      const name = upper(r.key);
      if (stacked) {
        children.push({ type: "text", silent: true, style: { text: truncateText(name, trackW - 8, nameSize, t.fontFamily, 700), x: cx, y: trackY - 9, fill: strong ? (lit || !anyHighlight ? t.ink : t.inkSecondary) : t.muted, fontSize: nameSize, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      } else {
        const nameW = measureText(name, nameSize, t.fontFamily, 700);
        const beside = (trackW - w) / 2 - gutter - 12;
        if (nameW <= w - pillH * 0.9 && w > pillH) children.push({ type: "text", silent: true, style: { text: name, x: cx, y: mid + 0.5, fill: ink, fontSize: nameSize, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        else if (nameW <= beside + gutter * 0.4 || beside > w - pillH || w <= pillH * 2) children.push({ type: "text", silent: true, style: { text: truncateText(name, Math.max(20, beside + gutter * 0.4), nameSize, t.fontFamily, 700), x: cx + w / 2 + 10, y: mid + 0.5, fill: strong ? t.ink : t.muted, fontSize: nameSize, fontWeight: 700, fontFamily: t.fontFamily, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        else children.push({ type: "text", silent: true, style: { text: truncateText(name, w - pillH * 0.9, nameSize, t.fontFamily, 700), x: cx, y: mid + 0.5, fill: ink, fontSize: nameSize, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const renderDeco = () => {
      if (!others.length) return null;
      const y = ranked.length * rowH + rule / 2;
      const label = p.compareLabel ? p.compareLabel.toLocaleUpperCase(ctx.locale) : "";
      const lw = label ? measureText(label, 10.5, t.fontFamily, 600) + 20 : 0;
      const line = (x1: number, x2: number) => ({ type: "line", shape: { x1, y1: y, x2, y2: y }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round" } });
      const children: any[] = lw && lw < W - 40 ? [line(4, cx - lw / 2), line(cx + lw / 2, W - 4), { type: "text", style: { text: label, x: cx, y, fill: t.muted, fontSize: 10.5, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } }] : [line(4, W - 4)];
      return { type: "group", silent: true, children };
    };

    const lit = ranked.filter((r) => anyHighlight && !ctx.dimmed(r.key));
    return {
      alt: n
        ? `Ranked list of ${p.value} by ${p.name}, drawn as centred bars: ${ranked.length} ranked rows. ${desc.slice(0, 3).map((r) => `${r.rank}. ${r.key} ${ctx.fmt(r.value)}`).join("; ")}${desc.length > 3 ? `; last, ${desc[desc.length - 1].key} ${ctx.fmt(desc[desc.length - 1].value)}` : ""}.${lit.length ? ` Highlighted: ${lit.map((r) => `${r.key}, rank ${r.rank}, ${ctx.fmt(r.value)}`).join("; ")}.` : ""}${others.length ? ` Not ranked, for comparison: ${others.map((r) => `${r.key} ${ctx.fmt(r.value)}`).join(", ")}.` : ""}`
        : `Ranked list of ${p.value}: no positive values.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const r = rows[d.dataIndex];
            if (!r || d.seriesId !== "pills") return "";
            return tooltipHtml(ctx, r.key, [{ name: p.value, value: ctx.fmt(r.value), color: fillOf(r) }, ...(r.rank != null ? [{ name: "Rank", value: `${r.rank} of ${ranked.length}` }] : []), { name: "Share of the largest", value: ctx.formatter({ style: "percent", maximumFractionDigits: 0 })(r.value / max) }]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderDeco as any, data: [0] },
          {
            id: "pills",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "rank"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: rows.map((r) => ({ id: r.key, name: r.key, value: [r.value, r.rank ?? 0] })),
          },
        ],
      },
    };
  },
});
