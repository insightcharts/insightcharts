"use client";

import { CustomChart } from "echarts/charts";
import { alpha, inkOn, luminance, defineChart, makeFormatter, type Formatter, dodge, measureText, truncateText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface NestedSharesProps {
  /** Field naming each share: a period ("2025") or a category. */
  name: string;
  /** Value field: each row's share of the whole. */
  value: string;
  /** The whole the values are a share of. Default: 1 when every value is at most 1, otherwise 100. */
  total?: number;
  /** What the outer square stands for, printed under it: "All trips". */
  wholeLabel?: string;
  /** The corner every outline grows from. */
  corner?: "bottom-left" | "top-left";
}

// The `height` hook lays out with the measured plot width but has no theme, so it measures text
// in a generic face; `build` lays out again with the theme's faces and scales the drawing down
// in the rare case where that comes out taller. Before the first layout the width is unknown.
type Seen = { font: string; display: string };
const HOOK_FONTS: Seen = { font: "sans-serif", display: "sans-serif" };
const hookWidth = (width?: number) => width ?? (typeof window === "undefined" ? 720 : Math.max(280, Math.min(window.innerWidth - 48, 812)));

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const NAME = 12.5;
const MAX_ITEMS = 8;

interface Item {
  key: string;
  value: number;
  share: number;
  valueText: string;
}

function prepare(p: NestedSharesProps, rows: Record<string, unknown>[], fmt: Formatter) {
  const raw = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: toNumber(r[p.value]) })).filter((r) => r.value > 0).slice(0, MAX_ITEMS);
  const total = p.total && p.total > 0 ? p.total : raw.every((r) => r.value <= 1) ? 1 : 100;
  // Largest first: it is drawn first, so smaller outlines sit on top and stay hoverable.
  const items: Item[] = raw.map((r) => ({ ...r, share: Math.min(1, r.value / total), valueText: fmt(r.value) })).sort((a, b) => b.share - a.share);
  return { items, total, last: raw.length ? raw[raw.length - 1].key : undefined };
}

interface Layout {
  S: number;
  valueSize: number;
  block: number;
  colX: number;
  sides: number[];
  labelY: number[];
  /** Leader from each outline's free corner to its label. */
  leaders: number[][][];
  height: number;
}

function layoutShares(p: NestedSharesProps, items: Item[], width: number, fonts: Seen): Layout {
  const W = Math.max(200, width);
  const compact = W < 480;
  const valueSize = compact ? 20 : items.length > 6 ? 24 : 30;
  const block = Math.round(valueSize * 1.1 + NAME * 1.3);
  const labelW = Math.max(60, ...items.map((it) => Math.max(measureText(it.valueText, valueSize, fonts.display, 300), Math.min(measureText(it.key, NAME, fonts.font, 600), 150))));
  const gap = block + (compact ? 8 : 12);
  const place = (lead: number) => {
    const S = Math.round(Math.max(120, Math.min(compact ? W - lead - Math.min(labelW, 120) : W * 0.52, 400)));
    const sides = items.map((it) => S * Math.sqrt(it.share));
    const cy = sides.map((side) => (p.corner === "top-left" ? side : S - side));
    const span = Math.max(S, items.length * gap - (gap - block));
    const labelY = dodge(cy.map((y) => y - block / 2), gap, 0, span - block);
    // Labels pushed away from their corner need a bend in the leader. The ones that go up and
    // the ones that go down each take their own lane, ordered so that no two leaders cross.
    const mid = labelY.map((y) => y + block / 2);
    const all = items.map((_, i) => i);
    const up = all.filter((i) => mid[i] < cy[i] - 1).sort((a, b) => cy[a] - cy[b]);
    const down = all.filter((i) => mid[i] > cy[i] + 1).sort((a, b) => cy[b] - cy[a]);
    return { S, sides, cy, span, labelY, mid, up, down };
  };
  const base = compact ? 26 : 40;
  const first = place(base);
  const lanes = Math.max(first.up.length, first.down.length);
  const lead = Math.max(base, 26 + (lanes - 1) * (compact ? 4 : 6));
  const L = lead === base ? first : place(lead);
  const colX = L.S + lead;
  const leaders: number[][][] = items.map((_, i) => [[L.sides[i], L.cy[i]], [colX - 8, L.cy[i]]]);
  for (const group of [L.up, L.down]) {
    const step = Math.min(compact ? 4 : 6, (lead - 26) / Math.max(1, group.length - 1));
    group.forEach((i, j) => {
      const x = L.S + 11 + j * step;
      leaders[i] = [[L.sides[i], L.cy[i]], [x - 2.5, L.cy[i]], [x + 2.5, L.mid[i]], [colX - 8, L.mid[i]]];
    });
  }
  return { S: L.S, valueSize, block, colX, sides: L.sides, labelY: L.labelY, leaders, height: Math.ceil(Math.max(L.S + (p.wholeLabel ? 28 : 0), L.span) + 4) };
}

/**
 * Shares of one whole as outlines nested from a corner of a square. The square is the whole;
 * each outline encloses an area equal to its share, so "27% of trips" is 27% of the square.
 */
export const NestedShares = defineChart<NestedSharesProps>({
  name: "nested-shares",
  title: "Nested shares",
  category: "poster",
  description: "Shows several shares of the same whole, such as one share at five dates, as outlines nested from one corner of a square, each enclosing an area equal to its share.",
  whenToUse: "How much of one whole something was at 2 to 8 dates or in 2 to 8 categories, when the growth of a share is the point: bicycles made 4% of trips in 2005 and 27% in 2025.",
  avoid: "Shares that are parts of each other and should add up (use waffle-chart or treemap); more than 8 items or precise reading of a trend (use line-chart); shares within a point or two of each other, where outlines coincide (use block-bar).",
  use: [CustomChart],
  defaults: { corner: "bottom-left" },
  selectField: (p) => p.name,
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    return layoutShares(p, prepare(p, rows, makeFormatter(p.format)).items, hookWidth(width), fonts).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: 'Field naming each share: a period ("2025") or a category.' },
    { name: "value", type: "string", required: true, description: "Value field: each row's share of the whole." },
    { name: "total", type: "number", description: "The whole. Default: 1 when every value is at most 1, otherwise 100." },
    { name: "wholeLabel", type: "string", description: 'What the outer square stands for, printed under it, e.g. "All trips".' },
    { name: "corner", type: '"bottom-left" | "top-left"', default: '"bottom-left"', description: "The corner every outline grows from." },
  ],
  example: {
    type: "nested-shares",
    theme: "ocean",
    data: [
      { year: "2005", share: 4 },
      { year: "2010", share: 7 },
      { year: "2015", share: 12 },
      { year: "2020", share: 19 },
      { year: "2025", share: 27 },
    ],
    name: "year",
    value: "share",
    format: "{value}%",
    highlight: "2025",
    wholeLabel: "All trips in the city",
    title: "Bicycles made 27% of trips in Port Aldwin in 2025",
    subtitle: "Share of all trips made by bicycle, 2005 to 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional city",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    // Judged by the surface, not the page mode: a poster theme paints a dark ground on a light page.
    const onDark = /^(#|rgb)/.test(t.surface) ? luminance(t.surface) < 0.2 : ctx.mode === "dark";
    const { items, total, last } = prepare(p, ctx.rows, ctx.fmt);
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    const L = layoutShares(p, items, ctx.width, fonts);
    const k = L.height > ctx.height + 1 ? ctx.height / L.height : 1;
    const S = L.S;
    const topLeft = p.corner === "top-left";
    const R = Math.min(Math.max(t.radius * 2, 10), S * 0.07);
    // With no `highlight`, the last row of the data (the latest period) is the filled one.
    const filled = (key: string) => (ctx.highlight.length ? ctx.highlight.includes(key) : key === last);
    const fills = items.map((it) => (filled(it.key) ? (ctx.highlight.length ? ctx.color(it.key) : t.accent) : null));
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });
    const labelMax = Math.max(40, ctx.width / k - L.colX);
    const dotted = { stroke: t.inkSecondary, lineWidth: 1.25, lineDash: [0.1, 4], lineCap: "round" as const, fill: "none" };

    const renderWhole = () => ({
      type: "group",
      silent: true,
      scaleX: k,
      scaleY: k,
      children: [
        { type: "rect", shape: { x: 0, y: 0, width: S, height: S, r: R }, style: { fill: alpha(t.ink, onDark ? 0.12 : 0.07) } },
        ...(p.wholeLabel ? [{ type: "text", x: 1, y: S + 10, style: { text: truncateText(`${p.wholeLabel} = ${pct(1)}`, S, 12, t.fontFamily), fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "top" } }] : []),
      ],
    });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const side = L.sides[i];
      const y = topLeft ? 0 : S - side;
      const live = ctx.selected(it.key);
      const fill = fills[i];
      // An outline inside a filled share takes the ink that reads on that fill.
      const holder = fills.slice(0, i).reverse().find((f) => f != null);
      const lineInk = fill ? fill : holder ? inkOn(holder) : t.ink;
      const r = Math.min(R, side * 0.25);
      const inset = fill ? 0 : 0.75;
      const children: any[] = [
        {
          type: "rect",
          shape: { x: inset, y: y + inset, width: Math.max(0, side - 2 * inset), height: Math.max(0, side - 2 * inset), r },
          style: fill ? { fill: live ? fill : alpha(fill, 0.3), opacity: 1, enterFrom: { opacity: 0 } } : { fill: "transparent", stroke: live ? lineInk : alpha(lineInk, 0.3), lineWidth: 1.5, opacity: 1, enterFrom: { opacity: 0 } },
          emphasis: { style: fill ? {} : { fill: alpha(lineInk, 0.14), lineWidth: 2.5 } },
          enterAnimation: { duration: 450, delay: (items.length - 1 - i) * 120 },
          transition: ["shape", "style"],
        },
      ];
      // Leader from the outline's free corner to its label.
      const cx = side;
      const cy = topLeft ? side : S - side;
      children.push({ type: "polyline", silent: true, shape: { points: L.leaders[i] }, style: { ...dotted, opacity: live ? 1 : 0.3 } });
      children.push({ type: "circle", silent: true, shape: { cx, cy, r: 3.5 }, style: { fill: fill ?? t.ink, stroke: t.surface, lineWidth: 1.5, opacity: live ? 1 : 0.3 } });
      const strong = !!fill && live;
      children.push({ type: "text", x: L.colX, y: L.labelY[i], style: { text: it.valueText, fill: live ? t.ink : t.muted, fontSize: L.valueSize, fontWeight: strong ? 600 : 300, fontFamily: t.displayFamily, verticalAlign: "top", lineHeight: L.valueSize * 1.1 } });
      children.push({ type: "text", x: L.colX, y: L.labelY[i] + L.valueSize * 1.1, style: { text: truncateText(it.key, labelMax, NAME, t.fontFamily, 600), fill: live ? t.inkSecondary : t.muted, fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "top" } });
      return { type: "group", scaleX: k, scaleY: k, focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    const sorted = items;
    return {
      alt: `Nested shares: ${items.length} outlines inside a square that stands for ${p.wholeLabel ?? "the whole"}, each enclosing an area equal to its share. ${[...sorted].reverse().map((i) => `${i.key}: ${i.valueText}`).join("; ")}.`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            return it && d.seriesId === "nested-shares" ? tooltipHtml(ctx, it.key, [{ name: p.value, value: it.valueText, color: fills[d.dataIndex] ?? t.ink }, { name: `Of ${p.wholeLabel ?? `the whole (${ctx.fmt(total)})`}`, value: pct(it.share) }]) : "";
          },
        },
        series: [
          { id: "whole", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderWhole as any, data: [0] },
          {
            id: "nested-shares",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "share"],
            encode: { tooltip: [0], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.key, value: [it.value, it.share] })),
          },
        ],
      },
    };
  },
});
