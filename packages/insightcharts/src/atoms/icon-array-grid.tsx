import { CustomChart } from "echarts/charts";
import { mix } from "../core/color";
import { defineChart } from "../core/define";
import { echarts } from "../core/echarts";
import { makeFormatter, type Formatter } from "../core/format";
import { resolveIcon, type IconInput, type IconShape } from "../core/icons";
import { measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface IconArrayGridProps {
  /** Category field: one tile per row. */
  name: string;
  /** Value field: the count each tile shows. */
  value: string;
  /** How many units one icon stands for. Default 1. */
  unit?: number;
  /** What one icon stands for, printed in the key line: "1 car". Default: the unit and the value field name. */
  unitLabel?: string;
  /** Draw every tile out of this many units, with the uncounted icons as ghosts: 100 for "per 100 households". */
  total?: number;
  /** A built-in icon name, or a custom single SVG path as `path://M0 0...`. */
  icon?: IconInput;
  /** Icons per line inside a tile. Default 10. */
  perRow?: number;
  /** Most tiles per line. Default: as many as fit at a readable size. Narrow containers use fewer. */
  columns?: number;
  /** Order of the tiles. Default: data order. */
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
 * One icon as a repeating image fill, so a tile of a hundred icons is at most four rectangles
 * rather than a hundred paths. The image is an SVG data URI (pure, no DOM), rasterised at 4x
 * and scaled back so it stays sharp on dense screens. The pattern has no offset of its own (the
 * SVG renderer drops a pattern transform that has one); the rectangle is positioned instead.
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

// Hovering one mark puts every other mark in ECharts' blur state; this is what that state looks like.
const dimRest = (els: any[]): any[] => els.map((e) => (e.type === "group" ? { ...e, children: dimRest(e.children) } : { blur: { style: { opacity: 0.28 } }, ...e }));

const NAME = 12.5;
const NAME_LH = 16;
const KEY_H = 32;
const MAX_TILES = 36;

interface Item {
  key: string;
  value: number;
  n: number;
  valueText: string;
}

function prepare(p: IconArrayGridProps, rows: Record<string, unknown>[], fmt: Formatter) {
  const unit = p.unit && p.unit > 0 ? p.unit : 1;
  const raw = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: Math.max(0, toNumber(r[p.value]) || 0) })).slice(0, MAX_TILES);
  if (p.sort === "asc") raw.sort((a, b) => a.value - b.value);
  else if (p.sort === "desc") raw.sort((a, b) => b.value - a.value);
  // Whole icons only: a count is rounded to the nearest icon and its exact value is printed.
  const items: Item[] = raw.map((r) => ({ ...r, n: Math.round(r.value / unit), valueText: fmt(r.value) }));
  // With `total`, every tile is drawn out of this many icons.
  const ghostSlots = p.total && p.total > 0 ? Math.round(p.total / unit) : 0;
  return { items, unit, ghostSlots };
}

interface Layout {
  cols: number;
  tileW: number;
  gap: number;
  perRow: number;
  iconW: number;
  iconH: number;
  cellW: number;
  cellH: number;
  gapX: number;
  gapY: number;
  valueSize: number;
  /** Height of the value and name above the icons, per line of tiles. */
  headH: number[];
  names: string[][];
  rowTop: number[];
  height: number;
}

function layoutGrid(p: IconArrayGridProps, items: Item[], ghostSlots: number, width: number, fonts: Seen, aspect: number): Layout {
  const W = Math.max(160, width);
  const compact = W < 480;
  const n = Math.max(1, items.length);
  const perRow = Math.max(1, Math.round(p.perRow ?? 10));
  const gap = compact ? 20 : 32;
  const auto = compact ? 2 : Math.max(2, Math.min(6, Math.floor((W + gap) / (150 + gap))));
  // `columns` is a ceiling: tiles are never squeezed under 120px, so a phone gets two per line whatever was asked for.
  const fit = Math.max(1, Math.min(n, Math.round(p.columns ?? auto), Math.max(1, Math.floor((W + gap) / (120 + gap)))));
  // Even lines: six tiles that fit five to a line are set three and three, not five and one.
  const cols = Math.ceil(n / Math.ceil(n / fit));
  const tileW = (W - gap * (cols - 1)) / cols;
  // Icons fill the tile's width, up to a size where they still read as units and not as pictures.
  const half = (v: number) => Math.max(0.5, Math.floor(v * 2) / 2);
  let cellW = half(Math.min(tileW / perRow, aspect >= 0.9 ? 22 : 18));
  let gapX = half(Math.max(1.5, cellW * 0.2));
  let iconW = cellW - gapX;
  let iconH = half(iconW / aspect);
  if (iconH > 30) {
    iconH = 30;
    iconW = half(iconH * aspect);
    gapX = half(Math.max(1.5, iconW * 0.25));
    cellW = iconW + gapX;
  }
  const gapY = half(Math.max(2, iconH * 0.2));
  const cellH = iconH + gapY;
  const valueSize = compact ? 24 : cols >= 5 ? 26 : 30;
  const names = items.map((i) => {
    const lines = wrapText(i.key, tileW, NAME, fonts.font, 600).slice(0, 2);
    return lines.map((l, k) => (k === 1 || measureText(l, NAME, fonts.font, 600) > tileW ? truncateText(l, tileW, NAME, fonts.font, 600) : l));
  });
  const rowTop: number[] = [];
  const headH: number[] = [];
  let y = KEY_H;
  const rowGap = compact ? 26 : 34;
  for (let start = 0; start < items.length; start += cols) {
    rowTop.push(y);
    const nameLines = Math.max(1, ...names.slice(start, start + cols).map((l) => l.length));
    const head = valueSize * 1.1 + nameLines * NAME_LH + 10;
    headH.push(head);
    // A line of tiles is as tall as its own fullest tile, so a line of small counts leaves no hole.
    const lines = Math.max(1, Math.ceil(Math.max(ghostSlots, ...items.slice(start, start + cols).map((i) => i.n)) / perRow));
    y += head + lines * cellH - gapY + rowGap;
  }
  return { cols, tileW, gap, perRow, iconW, iconH, cellW, cellH, gapX, gapY, valueSize, headH, names, rowTop, height: Math.ceil(y - rowGap + 4) };
}

/**
 * Small multiples of icon arrays: one tidy tile per category, each a counted array of the
 * same icon at the same size, so many counts can be compared at a glance and still counted.
 */
export const IconArrayGrid = defineChart<IconArrayGridProps>({
  name: "icon-array-grid",
  title: "Icon array grid",
  category: "poster",
  description: "Compares many counts as a grid of labelled tiles, each holding an array of N icons with its name and number.",
  whenToUse: "Counts of up to about 150 in 4 to 24 categories, especially rates per 100 or per 1,000: cars per 100 households in 12 districts. Set `total` so every tile shows the same full array with the uncounted icons as ghosts.",
  avoid: "Counts in the thousands (use unit-blocks); two to six categories where one row of icons each is enough (use pictogram-chart); values that need precise comparison or ranking (use block-bar or bar-chart); one share of one whole (use waffle-chart).",
  use: [CustomChart],
  defaults: { icon: "circle", perRow: 10, sort: "none" },
  selectField: (p) => p.name,
  markCount: (rows, p) => rows.length * Math.max(1, p.total ?? 100),
  height: (p, rows, width) => {
    if (!rows.length) return undefined;
    const fonts = HOOK_FONTS;
    const d = prepare(p, rows, makeFormatter(p.format));
    return layoutGrid(p, d.items, d.ghostSlots, hookWidth(width), fonts, resolveIcon(p.icon, "circle").aspect).height;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one tile per row." },
    { name: "value", type: "string", required: true, description: "Value field: the count each tile shows." },
    { name: "unit", type: "number", default: "1", description: "Units per icon." },
    { name: "unitLabel", type: "string", description: 'What one icon stands for, for the key line, e.g. "1 car".' },
    { name: "total", type: "number", description: "Draw every tile out of this many units, with uncounted icons as ghosts: 100 for a rate per 100." },
    { name: "icon", type: 'IconName | "path://..."', default: '"circle"', description: "Built-in icon name or a custom single SVG path." },
    { name: "perRow", type: "number", default: "10", description: "Icons per line inside a tile." },
    { name: "columns", type: "number", description: "Most tiles per line. Default: as many as fit at a readable size. Narrow containers use fewer." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Order of the tiles." },
  ],
  example: {
    type: "icon-array-grid",
    theme: "sunrise",
    data: [
      { district: "Ashby", cars: 118 },
      { district: "Brook End", cars: 104 },
      { district: "Castle Hill", cars: 97 },
      { district: "Dockside", cars: 41 },
      { district: "Eastfield", cars: 88 },
      { district: "Fairmile", cars: 126 },
      { district: "Greenway", cars: 73 },
      { district: "Hollins", cars: 110 },
      { district: "Old Town", cars: 36 },
      { district: "Priory", cars: 92 },
      { district: "Riverside", cars: 58 },
      { district: "Station Quarter", cars: 29 },
    ],
    name: "district",
    value: "cars",
    icon: "car",
    unitLabel: "1 car per 100 households",
    columns: 4,
    title: "Fairmile had 126 cars per 100 households in 2025",
    subtitle: "Cars per 100 households in 12 districts of Port Aldwin, 2025",
    source: "Illustrative data",
    note: "Invented figures for a fictional city",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const { items, unit, ghostSlots } = prepare(p, ctx.rows, ctx.fmt);
    const icon = resolveIcon(p.icon, "circle");
    const fonts: Seen = { font: t.fontFamily, display: t.displayFamily };
    const ghost = mix(t.surface, t.ink, ctx.mode === "dark" ? 0.1 : 0.12);
    const keyText = p.unitLabel ?? `${ctx.fmt(unit)} ${p.value}`;
    const L = layoutGrid(p, items, ghostSlots, ctx.width, fonts, icon.aspect);
    const k = L.height > ctx.height + 1 ? ctx.height / L.height : 1;
    const colours = items.map((it) => {
      const base = ctx.highlight.length ? ctx.color(it.key) : ctx.color();
      return ctx.selected(it.key) ? base : mix(t.surface, base, 0.4);
    });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const x0 = (i % L.cols) * (L.tileW + L.gap);
      const y0 = L.rowTop[Math.floor(i / L.cols)];
      const head = L.headH[Math.floor(i / L.cols)];
      const top = y0 + head;
      const live = ctx.selected(it.key);
      const dim = ctx.dimmed(it.key) || !live;
      const children: any[] = [];
      // Up to four runs: counted full lines, the counted part of the last line, then the same for the ghosts.
      const run = (from: number, to: number, fill: string, delay: number) => {
        if (to <= from) return;
        const firstLine = Math.floor(from / L.perRow);
        const offset = from % L.perRow;
        const pieces: [number, number, number, number][] = [];
        let start = from;
        if (offset) {
          const end = Math.min(to, (firstLine + 1) * L.perRow);
          pieces.push([offset, firstLine, end - from, 1]);
          start = end;
        }
        const fullLines = Math.floor((to - start) / L.perRow);
        if (fullLines > 0) pieces.push([0, start / L.perRow, L.perRow, fullLines]);
        start += fullLines * L.perRow;
        if (to > start) pieces.push([0, start / L.perRow, to - start, 1]);
        for (const [col, line, count, lines] of pieces) {
          const y = top + line * L.cellH;
          children.push({
            type: "rect",
            x: x0 + col * L.cellW,
            y,
            shape: { x: 0, y: 0, width: count * L.cellW - L.gapX, height: lines * L.cellH - L.gapY },
            style: { fill: iconPattern(icon, L.cellW, L.cellH, L.iconW, L.iconH, fill), opacity: 1, enterFrom: { opacity: 0 } },
            enterAnimation: { duration: 400, delay },
            transition: ["shape"],
          });
        }
      };
      run(0, it.n, colours[i], i * 50);
      run(it.n, Math.max(it.n, ghostSlots), live ? ghost : mix(t.surface, ghost, 0.4), i * 50);
      children.push({ type: "text", x: x0, y: y0, style: { text: it.valueText, fill: dim ? t.inkSecondary : t.ink, fontSize: L.valueSize, fontWeight: 300, fontFamily: t.displayFamily, verticalAlign: "top", lineHeight: L.valueSize * 1.1 } });
      children.push({ type: "text", x: x0, y: y0 + L.valueSize * 1.1, style: { text: L.names[i].join("\n"), fill: dim ? t.muted : t.inkSecondary, fontSize: NAME, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "top", lineHeight: NAME_LH } });
      // An invisible plate, so the whole tile answers to the pointer and not only its icons.
      children.push({ type: "rect", shape: { x: x0, y: y0, width: L.tileW, height: head + Math.max(1, Math.ceil(Math.max(it.n, ghostSlots) / L.perRow)) * L.cellH }, style: { fill: "transparent" } });
      return { type: "group", scaleX: k, scaleY: k, focus: p.select ? "none" : "self", children: dimRest(children) };
    };

    const kh = 14;
    const kb = pathBox(icon.d);
    const kw = (kh * kb.width) / kb.height;
    const keep = { blur: { style: { opacity: 1 } } };
    const renderKey = () => ({
      type: "group",
      silent: true,
      scaleX: k,
      scaleY: k,
      children: [
        // The key glyph wears the mark colour, so on a painted ground it reads as the same thing; neutral when a highlight splits the marks.
        { type: "path", shape: { pathData: icon.d, x: 0, y: 1, width: kw, height: kh, layout: "center" }, style: { fill: ctx.highlight.length ? t.inkSecondary : ctx.color() }, ...keep },
        { type: "text", x: kw + 8, y: 1 + kh / 2, style: { text: truncateText(`= ${keyText}`, ctx.width / k - kw - 8, 12, t.fontFamily), fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "middle" }, ...keep },
      ],
    });

    const ranked = [...items].sort((a, b) => b.value - a.value);
    return {
      alt: `Icon array grid of ${p.value} by ${p.name}: ${items.length} tiles, each an array of icons where one icon is ${keyText}${ghostSlots ? `, out of ${ctx.fmt(p.total)}` : ""}. ${ranked.length ? `Highest: ${ranked[0].key} (${ranked[0].valueText}). Lowest: ${ranked[ranked.length - 1].key} (${ranked[ranked.length - 1].valueText}).` : ""}`,
      option: {
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            return it && d.seriesId === "icon-array-grid" ? tooltipHtml(ctx, it.key, [{ name: p.value, value: it.valueText, color: colours[d.dataIndex] }, { name: "Icons", value: `${it.n}${ghostSlots ? ` of ${ghostSlots}` : ""}` }]) : "";
          },
        },
        series: [
          {
            id: "icon-array-grid",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "icons"],
            encode: { tooltip: [0, 1], itemName: "name" },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.key, value: [it.value, it.n] })),
          },
          { id: "key", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderKey as any, data: [0] },
        ],
      },
    };
  },
});

export const examples = {
  "Out of 100, with ghosts, highlight, click to select": {
    data: [
      { ward: "Abbey", voted: 71 },
      { ward: "Bridge", voted: 64 },
      { ward: "Canal", voted: 38 },
      { ward: "Deanery", voted: 59 },
      { ward: "Elm Park", voted: 67 },
      { ward: "Foundry", voted: 44 },
      { ward: "Grange", voted: 76 },
      { ward: "Haymarket", voted: 52 },
    ],
    name: "ward",
    value: "voted",
    total: 100,
    icon: "person",
    perRow: 20,
    unitLabel: "1 in every 100 registered voters",
    format: "{value}%",
    highlight: "Canal",
    select: true,
    title: "38 in every 100 registered voters in Canal ward voted in 2025",
    subtitle: "Turnout at the 2025 council election by ward, voters per 100 registered",
    source: "Illustrative data",
    note: "Invented figures for a fictional council",
  },
  "Squares, five per line, sorted": {
    theme: "noir",
    data: [
      { club: "Harriers", medals: 23 },
      { club: "Lakeside", medals: 17 },
      { club: "Northgate", medals: 31 },
      { club: "Old Mill", medals: 8 },
      { club: "Quayside", medals: 12 },
      { club: "Westbrook", medals: 4 },
    ],
    name: "club",
    value: "medals",
    icon: "square",
    perRow: 5,
    columns: 6,
    sort: "desc",
    unitLabel: "1 medal",
    title: "Northgate won 31 medals at the 2025 county championships",
    subtitle: "Medals won by club, 2025 county athletics championships",
    source: "Illustrative data",
    note: "Invented figures",
  },
  "Stress: 24 tiles, long names, uneven counts": {
    theme: "blueprint",
    data: [
      ["Aldermoor and the northern villages", 142], ["Barrow", 3], ["Charnwood Forest", 87], ["Denby", 0], ["East Leake and Stanford", 61], ["Fosse", 118],
      ["Great Glen", 24], ["Hathern", 9], ["Ibstock", 45], ["Kegworth", 133], ["Loughborough Central and University", 150], ["Markfield", 12],
      ["Newbold", 78], ["Oadby", 56], ["Quorn", 30], ["Ratby", 99], ["Sileby", 67], ["Thurmaston", 41],
      ["Ulverscroft", 1], ["Wymeswold", 15], ["Anstey", 82], ["Birstall", 110], ["Cossington", 6], ["Desford", 49],
    ].map(([area, points]) => ({ area, points })),
    name: "area",
    value: "points",
    icon: "bolt",
    perRow: 15,
    unitLabel: "1 public charge point",
    title: "Loughborough Central had 150 public charge points in 2025",
    subtitle: "Public electric vehicle charge points by area, 2025",
    source: "Illustrative data",
    note: "Invented figures",
  },
};
