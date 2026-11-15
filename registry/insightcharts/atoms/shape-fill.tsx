"use client";

import { CustomChart } from "echarts/charts";
import { alpha, mix, defineChart, makeFormatter, type Formatter, resolveIcon, type IconInput, type IconShape, measureText, truncateText, wrapText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface ShapeFillProps {
  /** Label field: one silhouette per row. */
  name: string;
  /** Value field: how full each silhouette is, against `max`. */
  value: string;
  /** The value that fills a silhouette completely. Default: 1 when every value is at most 1, otherwise 100. */
  max?: number;
  /** A built-in icon name, or a custom single SVG path as `path://M0 0...`. */
  icon?: IconInput;
  /** A different icon per label. Falls back to `icon`. */
  icons?: Record<string, string>;
  /** Silhouettes per line. Default: up to four, two on a phone. */
  columns?: number;
  /** `"single"`: every silhouette in the accent colour. `"item"`: one colour per row. */
  colorBy?: "single" | "item";
  /** Silhouette height in px. Default: sized to the width, or to the `height` prop when one is given. */
  iconSize?: number;
}

// The `height` hook lays out with the measured plot width but has no theme, so it measures text
// in a generic face; `build` lays out again with the theme's faces and scales the drawing down
// in the rare case where that comes out taller. Before the first layout the width is unknown.
type Seen = { font: string; display: string };
const HOOK_FONTS: Seen = { font: "sans-serif", display: "sans-serif" };
const hookWidth = (width?: number) => width ?? (typeof window === "undefined" ? 720 : Math.max(280, Math.min(window.innerWidth - 48, 812)));

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const NAME = 13;
const NAME_LH = 17;
const LEAD = 36;
const MAX_ITEMS = 12;

interface Item {
  key: string;
  value: number;
  frac: number;
  valueText: string;
  icon: IconShape;
}

function prepare(p: ShapeFillProps, rows: Record<string, unknown>[], fmt: Formatter) {
  const raw = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: toNumber(r[p.value]) })).filter((r) => !Number.isNaN(r.value)).slice(0, MAX_ITEMS);
  const max = p.max && p.max > 0 ? p.max : raw.every((r) => r.value <= 1) ? 1 : 100;
  const items: Item[] = raw.map((r) => ({ ...r, frac: Math.max(0, Math.min(1, r.value / max)), valueText: fmt(r.value), icon: resolveIcon(p.icons?.[r.key] ?? p.icon, "drop") }));
  return { items, max };
}

interface Layout {
  cols: number;
  slotW: number;
  /** Icon box. */
  boxW: number;
  ih: number;
  beside: boolean;
  valueSize: number;
  names: string[][];
  rowTop: number[];
  textW: number;
  gap: number;
  /** Left offset of the whole drawing: a single silhouette and its number are centred in the width. */
  offset: number;
  height: number;
}

function layoutFill(p: ShapeFillProps, items: Item[], width: number, fonts: Seen, fitHeight?: number): Layout {
  if (fitHeight != null && !(p.iconSize && p.iconSize > 0)) {
    // An explicit box (the `height` prop or `aspect`): the largest silhouette that fills it, so
    // one figure can be the hero of a poster and a short box never clips.
    let lo = 24;
    let hi = 1200;
    while (hi - lo > 1) {
      const mid = (lo + hi) / 2;
      if (layoutAt(p, items, width, fonts, mid).height <= fitHeight) lo = mid;
      else hi = mid;
    }
    return layoutAt(p, items, width, fonts, lo);
  }
  return layoutAt(p, items, width, fonts, p.iconSize && p.iconSize > 0 ? p.iconSize : undefined);
}

function layoutAt(p: ShapeFillProps, items: Item[], width: number, fonts: Seen, wanted?: number): Layout {
  const W = Math.max(160, width);
  const compact = W < 480;
  const n = Math.max(1, items.length);
  const gap = compact ? 16 : 32;
  // Three share a phone line while each keeps about 90px; in a narrower column they stack, figure left and number right.
  const cols = Math.max(1, Math.min(n, Math.round(p.columns ?? (compact ? (n === 3 ? ((W - 2 * gap) / 3 >= 88 ? 3 : 1) : Math.min(n, 2)) : Math.min(n, 4)))));
  const slotW = (W - gap * (cols - 1)) / cols;
  const aspect = Math.max(0.3, ...items.map((i) => i.icon.aspect));
  // One silhouette is the whole graphic and can be tall; several share the line.
  let ih = Math.round(wanted ?? (n === 1 ? (compact ? 190 : W >= 640 ? 300 : 240) : compact ? 130 : cols <= 2 ? 200 : 170));
  ih = Math.min(ih, Math.floor((slotW * 0.9) / aspect));
  let boxW = ih * aspect;
  let valueSize = Math.round(Math.max(ih < 90 ? 18 : 26, Math.min(n === 1 ? (wanted ? 160 : 96) : 64, ih * (n === 1 ? 0.3 : 0.24))));
  const valueW = (size: number) => Math.max(...items.map((i) => measureText(i.valueText, size, fonts.display, 300)), 0);
  let beside = slotW - boxW - LEAD >= Math.max(valueW(valueSize), 84);
  if (!beside && slotW - boxW - LEAD >= Math.max(valueW(26), 84)) {
    // The number is set smaller before it is moved under the silhouette.
    while (valueSize > 26 && slotW - boxW - LEAD < valueW(valueSize)) valueSize -= 2;
    beside = true;
  }
  if (!beside) {
    valueSize = Math.round(Math.max(22, Math.min(40, slotW * 0.2)));
    while (valueSize > 16 && valueW(valueSize) > slotW) valueSize -= 2;
    boxW = Math.min(boxW, slotW);
    ih = Math.min(ih, Math.floor(boxW / aspect));
    boxW = ih * aspect;
  }
  const textW = beside ? slotW - boxW - LEAD : slotW;
  const names = items.map((i) => {
    const wrapped = wrapText(i.key, textW, NAME, fonts.font, 600);
    // Words past the third line stay on it, so the cut shows as an ellipsis and never as a silently missing ending.
    const lines = wrapped.length > 3 ? [wrapped[0], wrapped[1], wrapped.slice(2).join(" ")] : wrapped;
    return lines.map((l) => truncateText(l, textW, NAME, fonts.font, 600));
  });
  const rowTop: number[] = [];
  let y = 0;
  for (let start = 0; start < items.length; start += cols) {
    rowTop.push(y);
    const lines = Math.max(1, ...names.slice(start, start + cols).map((l) => l.length));
    const textH = valueSize * 1.1 + lines * NAME_LH;
    y += (beside ? Math.max(ih, textH) : ih + 12 + textH) + (compact ? 26 : 34);
  }
  // One silhouette: the figure and its text are set as a pair in the middle of the width, not stranded at the left.
  let offset = 0;
  if (n === 1 && beside) {
    const used = boxW + LEAD + Math.max(valueW(valueSize), ...names[0].map((l) => measureText(l, NAME, fonts.font, 600)));
    offset = Math.max(0, (W - used) / 2);
  }
  return { cols, slotW, boxW, ih, beside, valueSize, names, rowTop, textW, gap, offset, height: Math.ceil(y - (compact ? 26 : 34) + 6) };
}

/**
 * An icon silhouette filled from the bottom to a level: a reservoir 63% full. The level is a
 * clip of the whole shape, never a scaled copy, and its number is always printed beside it,
 * because the height of a fill in an irregular shape only approximates the share.
 */
export const ShapeFill = defineChart<ShapeFillProps>({
  name: "shape-fill",
  title: "Shape fill",
  category: "poster",
  description: "Shows one or more percentages as icon silhouettes filled from the bottom to that level, with the number printed large beside each.",
  whenToUse: "One to six shares of a full amount where the object itself says what is measured: how full a reservoir is, how charged a fleet is, what share of homes have a heat pump.",
  avoid: "The fill height only approximates the share, because an irregular silhouette holds less area at its narrow end, so the number must always stay printed; for values to be compared precisely use block-bar or bar-chart, for a counted share use waffle-chart, for a compact inline meter use progress-meter.",
  use: [CustomChart],
  defaults: { icon: "drop", colorBy: "single" },
  selectField: (p) => p.name,
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    return layoutFill(p, prepare(p, rows, makeFormatter(p.format)).items, hookWidth(width), fonts).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Label field: one silhouette per row." },
    { name: "value", type: "string", required: true, description: "Value field: how full each silhouette is, against `max`." },
    { name: "max", type: "number", description: "The value that fills a silhouette completely. Default: 1 when every value is at most 1, otherwise 100." },
    { name: "icon", type: 'IconName | "path://..."', default: '"drop"', description: "Built-in icon name or a custom single SVG path." },
    { name: "icons", type: "Record<string, string>", description: "Icon per label; falls back to `icon`." },
    { name: "columns", type: "number", description: "Silhouettes per line. Default: up to four, two on a phone." },
    { name: "colorBy", type: '"single" | "item"', default: '"single"', description: "`single`: every silhouette in the accent colour. `item`: one colour per row." },
    { name: "iconSize", type: "number", description: "Silhouette height in px. Default: sized to the width, or grown to fill the box when the `height` prop or `aspect` is given, so one silhouette can be the main figure of a poster." },
  ],
  example: {
    theme: "blueprint",
    type: "shape-fill",
    data: [
      { reservoir: "Carrow", level: 63 },
      { reservoir: "Upper Fen", level: 41 },
      { reservoir: "Stonebeck", level: 88 },
    ],
    name: "reservoir",
    value: "level",
    icon: "drop",
    format: "{value}%",
    title: "Carrow Reservoir was 63% full on 1 September 2025",
    subtitle: "Water stored as a share of capacity, three reservoirs, 1 September 2025",
    source: "Illustrative data",
    note: "Invented figures for fictional reservoirs",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const { items, max } = prepare(p, ctx.rows, ctx.fmt);
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    // With an explicit `height` or `aspect` the silhouettes are sized to fill that box.
    const L = layoutFill(p, items, ctx.width, fonts, p.height != null || p.aspect != null ? ctx.height : undefined);
    const k = L.height > ctx.height + 1 ? ctx.height / L.height : 1;
    // Width was the limit, not height: the drawing sits in the middle of the box.
    const dy = (p.height != null || p.aspect != null) && L.height < ctx.height ? (ctx.height - L.height) / 2 : 0;
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });
    const colours = items.map((it, i) => (ctx.highlight.length ? ctx.color(it.key) : p.colorBy === "item" ? (i < t.categorical.length ? ctx.color(it.key, i) : t.context) : ctx.color()));
    const dotted = { stroke: t.inkSecondary, lineWidth: 1.25, lineDash: [0.1, 4], lineCap: "round" as const, fill: "none" };

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const live = ctx.selected(it.key);
      const fill = live ? colours[i] : alpha(colours[i], 0.3);
      const col = i % L.cols;
      const x0 = L.offset + col * (L.slotW + L.gap);
      const y0 = L.rowTop[Math.floor(i / L.cols)];
      const iw = L.ih * it.icon.aspect;
      const ix = L.beside ? x0 + (L.boxW - iw) / 2 : x0 + (L.slotW - iw) / 2;
      const level = y0 + L.ih * (1 - it.frac);
      const path = (colour: string) => ({ type: "path", shape: { pathData: it.icon.d, x: ix, y: y0, width: iw, height: L.ih, layout: "center" }, style: { fill: colour } });
      const children: any[] = [
        // The empty silhouette: a tint of the fill colour, so it reads as the same object.
        { ...path(mix(t.surface, colours[i], live ? 0.3 : 0.12)), style: { fill: mix(t.surface, colours[i], live ? 0.3 : 0.12), opacity: 1, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 300, delay: i * 80 } },
      ];
      if (it.frac > 0) {
        children.push({
          type: "group",
          clipPath: { type: "rect", shape: { x: ix - 1, y: level, width: iw + 2, height: y0 + L.ih - level + 1, enterFrom: { y: y0 + L.ih, height: 0 } }, enterAnimation: { duration: 700, delay: 150 + i * 80 }, transition: ["shape"] },
          children: [path(fill)],
        });
      }
      const lines = L.names[i];
      const textH = L.valueSize * 1.1 + lines.length * NAME_LH;
      const dim = ctx.dimmed(it.key) || !live;
      let tx: number;
      let ty: number;
      let align: "left" | "center" = "left";
      if (L.beside) {
        // The number sits at the fill level, joined to it by a dotted leader.
        tx = x0 + L.boxW + LEAD;
        const mid = L.valueSize * 0.55;
        ty = Math.max(y0, Math.min(y0 + Math.max(L.ih, textH) - textH, level - mid));
        children.push({ type: "polyline", silent: true, shape: { points: [[x0 + L.boxW + 5, level], [tx - 16, level], [tx - 8, ty + mid]] }, style: dotted });
      } else {
        tx = x0 + L.slotW / 2;
        ty = y0 + L.ih + 12;
        align = "center";
      }
      children.push({ type: "text", x: tx, y: ty, style: { text: it.valueText, fill: dim ? t.inkSecondary : t.ink, fontSize: L.valueSize, fontWeight: 300, fontFamily: t.displayFamily, align, verticalAlign: "top", lineHeight: L.valueSize * 1.1 } });
      children.push({ type: "text", x: tx, y: ty + L.valueSize * 1.1, style: { text: lines.join("\n"), fill: dim ? t.muted : t.inkSecondary, fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily, align, verticalAlign: "top", lineHeight: NAME_LH } });
      // An invisible plate over the slot, so the empty part of the silhouette and the label respond too.
      children.push({ type: "rect", shape: { x: x0, y: y0, width: L.slotW - L.offset, height: L.beside ? Math.max(L.ih, textH) : L.ih + 12 + textH }, style: { fill: "transparent" } });
      return { type: "group", y: dy, scaleX: k, scaleY: k, focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    const hi = items.reduce((a, b) => (b.value > a.value ? b : a), items[0]);
    const lo = items.reduce((a, b) => (b.value < a.value ? b : a), items[0]);
    return {
      alt: `Shape fill: ${items.length === 1 ? "one silhouette" : `${items.length} silhouettes`} filled from the bottom to show ${p.value} out of ${ctx.fmt(max)}. ${items.length <= 6 ? items.map((i) => `${i.key}: ${i.valueText}`).join("; ") : `Highest: ${hi.key} (${hi.valueText}). Lowest: ${lo.key} (${lo.valueText})`}.`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            return it ? tooltipHtml(ctx, it.key, [{ name: p.value, value: it.valueText, color: colours[d.dataIndex] }, { name: `Of ${ctx.fmt(max)}`, value: pct(it.frac) }]) : "";
          },
        },
        series: [
          {
            id: "shape-fill",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "fill"],
            encode: { tooltip: [0], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.key, value: [it.value, it.frac] })),
          },
        ],
      },
    };
  },
});
