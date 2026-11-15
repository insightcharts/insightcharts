import { CustomChart } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { echarts } from "../core/echarts";
import type { LegendItem } from "../core/figure";
import { makeFormatter, type Formatter } from "../core/format";
import { resolveIcon, type IconInput, type IconShape } from "../core/icons";
import { measureText, truncateText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface UnitBlocksProps {
  /** Group field: one block of icons per row of data. */
  name: string;
  /** Value field: the quantity each block counts out. */
  value: string;
  /** How many units one icon stands for. Default: a round number that gives about 2,000 icons in total. */
  unit?: number;
  /** What one icon stands for, printed in the key line: "10 finishers". Default: the unit and the value field name. */
  unitLabel?: string;
  /** A built-in icon name, or a custom single SVG path as `path://M0 0...`. */
  icon?: IconInput;
  /** Field that colours the blocks (several groups may share a colour). Default: one colour per group, up to eight groups. */
  series?: string;
  /** `"packed"`: blocks share one height and their widths follow the counts. `"columns"`: blocks share one width and grow upwards from a common baseline. */
  layout?: "packed" | "columns";
  /** Blocks per line in the `"columns"` layout. Default: all of them, two on a phone. */
  columns?: number;
  /** Icon height in px. Default: the largest that fits the layout, which differs from chart to chart. Give two charts the same `unit` and `iconSize` and one icon is the same size and worth the same in both, so their blocks compare directly. */
  iconSize?: number;
  /** Order of the blocks. Default: data order. */
  sort?: "none" | "asc" | "desc";
}

// The `height` hook lays out with the measured plot width but has no theme, so it measures text
// in a generic face; `build` lays out again with the theme's faces and scales the drawing down
// in the rare case where that comes out taller. Before the first layout the width is unknown.
type Seen = { font: string; display: string };
const HOOK_FONTS: Seen = { font: "sans-serif", display: "sans-serif" };
const hookWidth = (width?: number) => width ?? (typeof window === "undefined" ? 720 : Math.max(280, Math.min(window.innerWidth - 48, 812)));

const boxes = new Map<string, { x: number; y: number; width: number; height: number }>();
function pathBox(d: string) {
  let b = boxes.get(d);
  if (!b) {
    try {
      // No target rect: the path keeps its own coordinates, which is what is being measured.
      const r = (echarts.graphic.makePath as unknown as (d: string, o: object) => { getBoundingRect(): { x: number; y: number; width: number; height: number } })(d, {}).getBoundingRect();
      b = { x: r.x, y: r.y, width: r.width || 1, height: r.height || 1 };
    } catch {
      b = { x: 0, y: 0, width: 24, height: 24 };
    }
    boxes.set(d, b);
  }
  return b;
}

/**
 * One icon as a repeating image fill. A block of thousands of icons is then two rectangles
 * (the full rows and the partial last row) instead of thousands of paths. The image is an
 * SVG data URI, so the builder stays pure and needs no DOM; it is rasterised at 4x and scaled
 * back so it stays sharp on dense screens. The pattern has no offset of its own (the SVG
 * renderer drops a pattern transform that has one); the rectangle is positioned instead.
 */
function iconPattern(icon: IconShape, cellW: number, cellH: number, iconW: number, iconH: number, fill: string) {
  const K = 4;
  const b = pathBox(icon.d);
  const s = Math.min(iconW / b.width, iconH / b.height);
  const tx = (iconW - b.width * s) / 2;
  const ty = (iconH - b.height * s) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellW * K}" height="${cellH * K}" viewBox="0 0 ${cellW} ${cellH}"><path transform="translate(${tx} ${ty}) scale(${s}) translate(${-b.x} ${-b.y})" d="${icon.d}" fill="${fill}"/></svg>`;
  return { image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, repeat: "repeat" as const, imageWidth: cellW * K, imageHeight: cellH * K, scaleX: 1 / K, scaleY: 1 / K };
}

interface Group {
  key: string;
  value: number;
  n: number;
  series?: string;
  valueText: string;
}

function prepare(p: UnitBlocksProps, rows: Record<string, unknown>[], fmt: Formatter) {
  const raw = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: Math.max(0, toNumber(r[p.value]) || 0), series: p.series ? String(r[p.series] ?? "") : undefined }));
  if (p.sort === "asc") raw.sort((a, b) => a.value - b.value);
  else if (p.sort === "desc") raw.sort((a, b) => b.value - a.value);
  const total = raw.reduce((s, r) => s + r.value, 0);
  let unit = p.unit && p.unit > 0 ? p.unit : 1;
  if (!(p.unit && p.unit > 0)) {
    // A round unit (1, 2, 5 times a power of ten) that brings the total to about 2,000 icons.
    const target = total / 2000;
    if (target > 1) {
      const pow = 10 ** Math.floor(Math.log10(target));
      unit = [1, 2, 5, 10].map((m) => m * pow).find((u) => u >= target) ?? 10 * pow;
    }
  }
  const groups: Group[] = raw.map((r) => ({ ...r, n: r.value > 0 ? Math.max(1, Math.round(r.value / unit)) : 0, valueText: fmt(r.value) }));
  return { groups, unit, total };
}

interface Placed {
  x: number;
  /** Top of the label. */
  y: number;
  /** Top of the icons. */
  top: number;
  cols: number;
  full: number;
  rem: number;
  slot: number;
}

interface Layout {
  h: number;
  iconW: number;
  cellW: number;
  cellH: number;
  gapX: number;
  gapY: number;
  valueSize: number;
  labelH: number;
  keyH: number;
  placed: Placed[];
  height: number;
  lines: number;
}

function layoutBlocks(p: UnitBlocksProps, groups: Group[], width: number, fonts: Seen, aspect: number, fitHeight?: number): Layout {
  const compact = width < 480;
  const mode = p.layout ?? "packed";
  const W = Math.max(120, width);
  const valueSize = groups.length > 8 ? (compact ? 18 : 20) : compact ? 22 : 28;
  const nameSize = 12.5;
  const labelH = Math.round(valueSize * 1.12 + nameSize * 1.35 + 9);
  const keyH = 34;
  const gap = compact ? 16 : groups.length > 8 ? 20 : 28;
  const bandGap = compact ? 22 : 26;
  const total = groups.reduce((s, g) => s + g.n, 0);
  const target = fitHeight ?? (compact ? W * (total > 6000 ? 2.6 : 1.9) : Math.max(300, Math.min(480, W * 0.56)));
  const labelW = groups.map((g) => Math.max(measureText(g.valueText, valueSize, fonts.display, 300), Math.min(measureText(g.key, nameSize, fonts.font, 600), compact ? 96 : 132)) + 2);
  const columns = Math.max(1, Math.min(groups.length, Math.round(p.columns ?? (compact ? (groups.length <= 3 ? groups.length : 2) : Math.min(groups.length, 6)))));
  const nMax = Math.max(1, ...groups.map((g) => g.n));

  const at = (h: number): Layout => {
    const half = (v: number) => Math.max(0.5, Math.round(v * 2) / 2);
    const iconW = half(h * aspect);
    const gapX = half(Math.max(1, h * 0.2));
    const gapY = half(Math.max(1, h * 0.24));
    const cellW = iconW + gapX;
    const cellH = h + gapY;
    const base = { h, iconW, cellW, cellH, gapX, gapY, valueSize, labelH, keyH };
    if (mode === "columns") {
      const colW = (W - (columns - 1) * gap) / columns;
      const cols = Math.max(1, Math.floor((colW + gapX) / cellW));
      const placed: Placed[] = [];
      let y = keyH;
      for (let start = 0; start < groups.length; start += columns) {
        const band = groups.slice(start, start + columns);
        const tall = Math.max(...band.map((g) => Math.ceil(g.n / cols))) * cellH - gapY;
        band.forEach((g, j) => {
          const lines = Math.ceil(g.n / cols);
          const blockH = Math.max(0, lines * cellH - gapY);
          const top = y + labelH + tall - blockH;
          placed.push({ x: j * (colW + gap), y: top - labelH, top, cols, full: Math.floor(g.n / cols), rem: g.n % cols, slot: colW });
        });
        y += labelH + tall + bandGap;
      }
      return { ...base, placed, height: Math.ceil(y - bandGap + 4), lines: Math.ceil(groups.length / columns) };
    }
    // Packed: every block has the same number of rows, so widths compare directly. Try each
    // row count and keep the one that gives the shortest layout.
    const maxCols = Math.max(1, Math.floor((W + gapX) / cellW));
    const rMin = Math.max(1, Math.ceil(nMax / maxCols));
    let best: { height: number; placed: Placed[]; lines: number } | null = null;
    for (let R = rMin; R <= rMin + 160; R++) {
      const placed: Placed[] = [];
      let x = 0;
      let y = keyH;
      let lines = 1;
      let tall = 0;
      const close = () => {
        // Blocks in a band sit on its common top edge; the band is as tall as its tallest block.
        y += labelH + tall + bandGap;
      };
      groups.forEach((g, i) => {
        const cols = Math.max(1, Math.ceil(g.n / R));
        const blockW = cols * cellW - gapX;
        const slot = Math.max(blockW, labelW[i]);
        if (x > 0 && x + slot > W + 0.5) {
          close();
          x = 0;
          tall = 0;
          lines++;
        }
        const rowsUsed = Math.ceil(g.n / cols);
        tall = Math.max(tall, rowsUsed * cellH - gapY);
        placed.push({ x, y, top: y + labelH, cols, full: Math.floor(g.n / cols), rem: g.n % cols, slot });
        x += slot + gap;
      });
      const height = Math.ceil(y + labelH + tall + 4);
      if (!best || height < best.height - 0.5) best = { height, placed, lines };
      if (lines === 1) break; // More rows only make a single band taller.
    }
    return { ...base, ...best! };
  };

  if (p.iconSize && p.iconSize > 0 && fitHeight == null) return at(Math.max(2, p.iconSize));
  const hMax = Math.max(3, p.iconSize ?? (aspect < 0.7 ? 18 : 12));
  let out = at(hMax);
  for (let h = hMax; h >= 3; h -= 0.5) {
    out = at(h);
    if (out.height <= target) break;
  }
  return out;
}

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const MAX_COLOURS = 8;

/**
 * Counting at scale: every group is a solid block of small unit icons, one icon per stated
 * number of units. All blocks share one icon size and pitch, so their areas compare honestly
 * and each one can, in principle, be counted.
 */
export const UnitBlocks = defineChart<UnitBlocksProps>({
  name: "unit-blocks",
  title: "Unit blocks",
  category: "poster",
  description: "Shows the size of each group as a solid block of small icons, one icon per fixed number of units.",
  whenToUse: "Large counts of people or things in 2 to 12 groups, where the reader should see the crowd itself: 20,350 marathon finishers by age group, one figure per 10 runners.",
  avoid: "Precise comparison of close values (use block-bar or bar-chart); fewer than about 30 icons per group (use pictogram-chart or icon-array-grid); shares of one whole (use waffle-chart).",
  use: [CustomChart],
  defaults: { icon: "person", layout: "packed", sort: "none" },
  selectField: (p) => p.name,
  markCount: (rows, p) => prepare(p, rows, String).groups.reduce((s, g) => s + g.n, 0) + 1501,
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    return layoutBlocks(p, prepare(p, rows, makeFormatter(p.format)).groups, hookWidth(width), fonts, resolveIcon(p.icon, "person").aspect).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Group field: one block of icons per row of data." },
    { name: "value", type: "string", required: true, description: "Value field: the quantity each block counts out." },
    { name: "unit", type: "number", description: "Units per icon. Default: a round number that gives about 2,000 icons in total." },
    { name: "unitLabel", type: "string", description: 'What one icon stands for, for the key line, e.g. "10 finishers".' },
    { name: "icon", type: "IconName | \"path://...\"", default: '"person"', description: "Built-in icon name or a custom single SVG path." },
    { name: "series", type: "string", description: "Field that colours the blocks. Default: one colour per group, up to eight groups." },
    { name: "layout", type: '"packed" | "columns"', default: '"packed"', description: "`packed`: equal block heights, widths follow the counts. `columns`: equal widths, blocks grow upwards from a baseline." },
    { name: "columns", type: "number", description: "Blocks per line in the `columns` layout. Default: all, two on a phone." },
    { name: "iconSize", type: "number", description: "Icon height in px. Default: the largest that fits, chosen per chart. To put two charts on one scale, give both the same `unit` and `iconSize`: the icon size, the gaps and the worth of an icon are then identical and the chart takes the height it needs." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order of the blocks." },
  ],
  example: {
    type: "unit-blocks",
    data: [
      { age: "Under 30", finishers: 4180 },
      { age: "30 to 39", finishers: 6920 },
      { age: "40 to 49", finishers: 5340 },
      { age: "50 to 59", finishers: 2760 },
      { age: "60 and over", finishers: 1150 },
    ],
    name: "age",
    value: "finishers",
    unit: 10,
    unitLabel: "10 finishers",
    format: "integer",
    title: "6,920 of the 20,350 finishers were aged 30 to 39",
    subtitle: "Finishers of the Lakeshore Marathon by age group, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional race",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const { groups, unit } = prepare(p, ctx.rows, ctx.fmt);
    const icon = resolveIcon(p.icon, "person");
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    const natural = layoutBlocks(p, groups, ctx.width, fonts, icon.aspect);
    // A box shorter than the layout (an explicit `height` or `aspect`, or wider type than the height hook assumed): shrink the icons to fit it instead of clipping.
    // An explicit `iconSize` with no explicit box is a promise of scale (two charts set to the same `unit` and `iconSize` compare directly), so it is never shrunk.
    const pinned = !!(p.iconSize && p.iconSize > 0) && p.height == null && p.aspect == null;
    const L = natural.height > ctx.height + 1 && !pinned ? layoutBlocks(p, groups, ctx.width, fonts, icon.aspect, ctx.height) : natural;

    const seriesKeys = p.series ? [...new Set(groups.map((g) => g.series ?? ""))] : [];
    const byGroup = !p.series && groups.length <= Math.max(MAX_COLOURS, 0);
    const colours = groups.map((g, i) => {
      const base = p.series ? ctx.color(g.series, seriesKeys.indexOf(g.series ?? "")) : byGroup || ctx.highlight.length ? ctx.color(g.key, i) : ctx.color();
      return ctx.selected(g.key) ? base : alpha(base, 0.25);
    });
    const keyText = p.unitLabel ?? `${ctx.fmt(unit)} ${p.value}`;
    const nameSize = 12.5;

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const g = groups[i];
      const b = L.placed[i];
      if (!g || !b) return null;
      const fill = colours[i];
      const columns = (p.layout ?? "packed") === "columns";
      const children: any[] = [];
      const fullH = b.full * L.cellH - (b.rem ? 0 : L.gapY);
      const blockW = b.cols * L.cellW - L.gapX;
      // In columns the block is filled from the baseline, so the partial row is the top one.
      const remTop = columns ? b.top : b.top + b.full * L.cellH;
      const fullTop = columns && b.rem ? b.top + L.cellH : b.top;
      const delay = i * 90;
      if (b.full > 0) {
        children.push({
          type: "rect",
          x: b.x,
          y: fullTop,
          shape: { x: 0, y: 0, width: blockW, height: Math.max(0, fullH) },
          style: { fill: iconPattern(icon, L.cellW, L.cellH, L.iconW, L.h, fill), opacity: 1, enterFrom: { opacity: 0 } },
          enterAnimation: { duration: 500, delay },
          transition: ["shape"],
        });
      }
      if (b.rem > 0) {
        children.push({
          type: "rect",
          x: b.x,
          y: remTop,
          shape: { x: 0, y: 0, width: b.rem * L.cellW - L.gapX, height: L.h },
          style: { fill: iconPattern(icon, L.cellW, L.cellH, L.iconW, L.h, fill), opacity: 1, enterFrom: { opacity: 0 } },
          enterAnimation: { duration: 500, delay },
          transition: ["shape"],
        });
      }
      const dim = ctx.dimmed(g.key) || !ctx.selected(g.key);
      children.push({ type: "text", x: b.x, y: b.y, style: { text: g.valueText, fill: dim ? t.inkSecondary : t.ink, fontSize: L.valueSize, fontWeight: 300, fontFamily: t.displayFamily, verticalAlign: "top", lineHeight: L.valueSize * 1.12 } });
      children.push({ type: "text", x: b.x, y: b.y + L.valueSize * 1.12, style: { text: truncateText(g.key, b.slot, nameSize, t.fontFamily, 600), fill: dim ? t.muted : t.inkSecondary, fontSize: nameSize, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "top" } });
      return { type: "group", focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    // The key line is what makes a unit chart honest: it says what one icon is worth.
    const kh = 15;
    const kb = pathBox(icon.d);
    const kw = (kh * kb.width) / kb.height;
    const renderKey = () => ({
      type: "group",
      silent: true,
      children: [
        { type: "path", shape: { pathData: icon.d, x: 0, y: 1, width: kw, height: kh, layout: "center" }, style: { fill: t.inkSecondary }, blur: { style: { opacity: 1 } } },
        { type: "text", x: kw + 8, y: 1 + kh / 2, style: { text: truncateText(`= ${keyText}`, ctx.width - kw - 8, 12, t.fontFamily), fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "middle" }, blur: { style: { opacity: 1 } } },
      ],
    });

    const legend: LegendItem[] = p.series ? seriesKeys.map((k, i) => ({ name: k, color: ctx.color(k, i), shape: "square" as const, muted: ctx.dimmed(k) })) : [];
    const ranked = [...groups].sort((a, b) => b.value - a.value);
    const count = new Intl.NumberFormat(ctx.locale);
    return {
      legend,
      alt: `Unit blocks of ${p.value} by ${p.name}: ${groups.length} blocks of icons, each icon standing for ${keyText}. ${ranked.length ? `Largest: ${ranked[0].key} (${ranked[0].valueText}). Smallest: ${ranked[ranked.length - 1].key} (${ranked[ranked.length - 1].valueText}).` : ""}`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const g = groups[d.dataIndex];
            return g && d.seriesId === "unit-blocks" ? tooltipHtml(ctx, g.key, [{ name: p.value, value: g.valueText, color: colours[d.dataIndex] }, { name: "Icons", value: `${count.format(g.n)} × ${keyText}` }]) : "";
          },
        },
        series: [
          {
            id: "unit-blocks",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "icons"],
            encode: { tooltip: [0, 1], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: groups.map((g) => ({ name: g.key, value: [g.value, g.n] })),
          },
          { id: "key", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderKey as any, data: [0] },
        ],
      },
    };
  },
});

const finishers = [
  { age: "Under 30", finishers: 4180 },
  { age: "30 to 39", finishers: 6920 },
  { age: "40 to 49", finishers: 5340 },
  { age: "50 to 59", finishers: 2760 },
  { age: "60 and over", finishers: 1150 },
];

export const examples = {
  "Highlight, click to select": {
    data: finishers.map((r) => ({ ...r })),
    name: "age",
    value: "finishers",
    unit: 10,
    unitLabel: "10 finishers",
    format: "integer",
    highlight: "60 and over",
    select: true,
    title: "1,150 finishers were aged 60 or over",
    subtitle: "Finishers of the Lakeshore Marathon by age group, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional race",
  },
  "Stress: 20,350 icons, one per finisher": {
    data: finishers.map((r) => ({ ...r })),
    name: "age",
    value: "finishers",
    unit: 1,
    unitLabel: "1 finisher",
    format: "integer",
    title: "20,350 people finished the Lakeshore Marathon in 2025",
    subtitle: "Finishers by age group. Every figure is one runner",
    source: "Illustrative data",
    note: "Invented figures for a fictional race",
  },
  "Columns of squares, coloured by a series field": {
    data: [
      { depot: "Northgate", buses: 412, fuel: "Electric" },
      { depot: "Harbour Road", buses: 268, fuel: "Electric" },
      { depot: "Millbrook", buses: 655, fuel: "Diesel" },
      { depot: "Eastfield", buses: 381, fuel: "Diesel" },
      { depot: "Quarry Lane", buses: 97, fuel: "Hydrogen" },
    ],
    name: "depot",
    value: "buses",
    series: "fuel",
    unit: 1,
    unitLabel: "1 bus",
    icon: "square",
    layout: "columns",
    title: "Millbrook depot ran 655 diesel buses in 2025",
    subtitle: "Buses in service by depot and fuel, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional operator",
  },
  "Stress: twelve uneven groups, long names": {
    data: [
      { species: "Common starling", birds: 9840 },
      { species: "House sparrow", birds: 7120 },
      { species: "Wood pigeon", birds: 5310 },
      { species: "Blackbird", birds: 3980 },
      { species: "Blue tit", birds: 3460 },
      { species: "European goldfinch", birds: 2210 },
      { species: "Great spotted woodpecker", birds: 640 },
      { species: "Long-tailed tit", birds: 580 },
      { species: "Eurasian sparrowhawk", birds: 140 },
      { species: "Common kingfisher", birds: 90 },
      { species: "Lesser spotted woodpecker", birds: 40 },
      { species: "Hawfinch", birds: 20 },
    ],
    name: "species",
    value: "birds",
    unit: 20,
    unitLabel: "20 birds",
    icon: "circle",
    format: "integer",
    title: "Volunteers counted 9,840 starlings in one weekend in 2025",
    subtitle: "Birds recorded in one weekend garden count by species, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional survey",
  },
};
