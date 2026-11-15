import { CustomChart } from "echarts/charts";
import { alpha, inkOn, mix } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface TreemapProps {
  /** Leaf name field: one tile per row. */
  name: string;
  /** Value field: tile area. */
  value: string;
  /** Optional parent field. Rows sharing a group are drawn together under a heading and share a colour. */
  group?: string;
  /** Print the value under the name where the tile is big enough. Default true. */
  labels?: boolean;
  /** Show a heading strip above each group. Default: on when `group` is set and the chart is not compact. */
  groupLabels?: boolean;
  /** Display names for group keys. */
  names?: Record<string, string>;
}

const MAX_COLOURS = 8;

/**
 * Part-to-whole by area, for when there are too many parts for a bar to stay readable.
 * It never zooms, pans or drills on its own: a treemap inside a scrolling page must not
 * capture the wheel.
 */
export const Treemap = defineChart<TreemapProps>({
  name: "treemap",
  title: "Treemap",
  category: "part-to-whole",
  description: "Shows parts of a whole as nested rectangles sized by value, optionally grouped into categories.",
  whenToUse: "Many parts (10 to 100) of very different sizes, or a two-level hierarchy, where the reader needs the largest parts rather than exact comparison: budgets, market capitalisation, export baskets.",
  avoid: "Fewer than about 6 parts or values that need precise comparison (use bar-chart); 2 to 5 parts (use donut-chart or segmented-bar); values that can be negative (use bar-chart); change over time (use line-chart).",
  use: [CustomChart],
  defaults: { labels: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.data?.leaf ? params.name : null),
  markCount: (rows) => rows.length,
  props: [
    { name: "name", type: "string", required: true, description: "Leaf name field: one tile per row." },
    { name: "value", type: "string", required: true, description: "Value field: tile area. Non-positive values are dropped." },
    { name: "group", type: "string", description: "Parent field. Rows sharing a group are drawn together and share a colour." },
    { name: "labels", type: "boolean", default: "true", description: "Print the value under the name where the tile is big enough." },
    { name: "groupLabels", type: "boolean", description: "Heading strip above each group. Default: on when `group` is set and not compact." },
    { name: "names", type: "Record<string, string>", description: "Display names for group keys." },
  ],
  example: {
    theme: "paper",
    type: "treemap",
    data: [
      { sector: "Energy", source: "Electricity and heat", gt: 15.8 },
      { sector: "Energy", source: "Transport", gt: 8.4 },
      { sector: "Energy", source: "Manufacturing and construction", gt: 6.3 },
      { sector: "Energy", source: "Buildings", gt: 3.0 },
      { sector: "Energy", source: "Fugitive emissions", gt: 3.3 },
      { sector: "Agriculture", source: "Livestock and manure", gt: 3.5 },
      { sector: "Agriculture", source: "Soils and rice", gt: 2.4 },
      { sector: "Industry", source: "Cement", gt: 1.6 },
      { sector: "Industry", source: "Chemicals and other", gt: 1.6 },
      { sector: "Waste", source: "Landfill and wastewater", gt: 1.7 },
      { sector: "Land use", source: "Deforestation and land-use change", gt: 1.4 },
    ],
    group: "sector",
    name: "source",
    value: "gt",
    format: "{value} Gt",
    title: "Energy produced 75% of global greenhouse gas emissions in 2021",
    subtitle: "Global emissions by sector and source, billion tonnes of CO2 equivalent, 2021",
    source: "Climate Watch, World Resources Institute",
    note: "Rounded, approximate figures for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    type Leaf = { key: string; group: string; value: number };
    const leaves: Leaf[] = [];
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v) && v > 0) leaves.push({ key: String(r[p.name] ?? ""), group: p.group ? String(r[p.group] ?? "") : "", value: v });
    }
    const total = leaves.reduce((s, l) => s + l.value, 0);
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });
    const groups: string[] = [];
    for (const l of leaves) if (!groups.includes(l.group)) groups.push(l.group);
    const grouped = !!p.group;
    const groupName = (g: string) => p.names?.[g] ?? g;
    const groupTotal = (g: string) => leaves.filter((l) => l.group === g).reduce((s, l) => s + l.value, 0);
    // Identity colour belongs to the group; ungrouped tiles share the accent so area alone carries the comparison.
    // Groups past the palette (poster themes have four or five colours) turn neutral instead of repeating a colour.
    const maxColours = Math.min(MAX_COLOURS, t.categorical.length);
    const baseOf = (l: Leaf) => {
      if (!grouped) return ctx.color(l.key);
      const gi = groups.indexOf(l.group);
      if (ctx.highlight.length === 0) return gi < maxColours ? ctx.color(l.group, gi) : t.context;
      if (!ctx.dimmed(l.key)) return ctx.color(l.key, gi);
      return gi < maxColours || ctx.dimmed(l.group) ? ctx.color(l.group, gi) : t.context;
    };
    const showValues = p.labels !== false;
    const showHeads = grouped && (p.groupLabels ?? !ctx.compact);

    // Layout is computed here rather than left to ECharts, so every label can be tested
    // against the tile it will actually sit in before anything is drawn.
    type Tile = Leaf & { x: number; y: number; w: number; h: number; color: string; lines: string[]; valueText: string };
    const W = ctx.width;
    const H = ctx.height;
    const headH = showHeads ? 22 : 0;
    const groupGap = grouped ? (showHeads ? 10 : 4) : 0;
    const gap = 2;
    const nameSize = ctx.compact ? 12 : 13;
    const padX = 8;
    const tiles: Tile[] = [];
    const heads: { key: string; x: number; y: number; w: number; text: string }[] = [];
    const place = (cell: _Cell<Leaf>) => {
      const l = cell.d;
      const base = baseOf(l);
      const color = ctx.selected(l.key) ? base : mix(t.surface, base, 0.3);
      const x = cell.x + gap / 2;
      const y = cell.y + gap / 2;
      const w = Math.max(0, cell.w - gap);
      const h = Math.max(0, cell.h - gap);
      // Fit test: the name wraps onto as many lines as the tile has room for; the last line may be cut,
      // but a name that would be reduced to a stub is left to the tooltip instead.
      const availW = w - padX * 2;
      const valueText = ctx.fmt(l.value);
      let lines: string[] = [];
      let showValue = false;
      if (availW >= 24 && h >= 26) {
        const maxLines = Math.min(3, Math.floor((h - 10) / 17));
        const wrapped = wrapText(l.key, availW, nameSize, t.fontFamily, 600);
        const kept = wrapped.slice(0, maxLines);
        if (wrapped.length > maxLines) kept[kept.length - 1] = wrapped.slice(maxLines - 1).join(" ");
        const cut = kept.map((line) => truncateText(line, availW, nameSize, t.fontFamily, 600));
        // A cut line must still show its first word whole, or nearly so: "Chemi…" says less than no label.
        const lost = cut.some((line, i) => {
          if (line === kept[i]) return false;
          const shown = line.replace("…", "").trimEnd().length;
          const word = kept[i].split(" ")[0].length;
          return shown < word && (shown < 5 || shown < word * 0.7);
        });
        if (!lost) {
          lines = cut;
          showValue = showValues && h - 10 - lines.length * 17 >= 15 && measureText(valueText, 12, t.fontFamily) <= availW;
        }
      }
      tiles.push({ ...l, x, y, w, h, color, lines, valueText: showValue ? valueText : "" });
    };
    const desc = (a: { value: number }, b: { value: number }) => b.value - a.value;
    if (grouped) {
      const cells = _squarify(groups.map((g) => ({ v: groupTotal(g), d: g })).sort((a, b) => b.v - a.v), -groupGap / 2, -groupGap / 2, W + groupGap, H + groupGap);
      for (const c of cells) {
        const gx = c.x + groupGap / 2;
        const gy = c.y + groupGap / 2;
        const gw = Math.max(0, c.w - groupGap);
        const gh = Math.max(0, c.h - groupGap);
        const head = gh > headH + 12 ? headH : 0;
        if (head) {
          // The share is dropped before the group name is cut.
          const full = `${groupName(c.d)}  ${pct(c.v / total)}`;
          const text = measureText(full, 12, t.fontFamily, 600) <= gw ? full : truncateText(groupName(c.d), gw, 12, t.fontFamily, 600);
          heads.push({ key: c.d, x: gx, y: gy, w: gw, text: text !== full && text !== groupName(c.d) && text.replace("…", "").length < 4 ? "" : text });
        }
        _squarify(leaves.filter((l) => l.group === c.d).sort(desc).map((l) => ({ v: l.value, d: l })), gx - gap / 2, gy + head - gap / 2, gw + gap, gh - head + gap).forEach(place);
      }
    } else {
      _squarify([...leaves].sort(desc).map((l) => ({ v: l.value, d: l })), -gap / 2, -gap / 2, W + gap, H + gap).forEach(place);
    }

    const renderItem = (params: any) => {
      const tile = tiles[params.dataIndex];
      if (!tile) return null;
      const ink = inkOn(tile.color);
      const children: any[] = [
        {
          type: "rect",
          shape: { x: tile.x, y: tile.y, width: tile.w, height: tile.h },
          style: { fill: tile.color },
          emphasis: { style: { fill: mix(tile.color, ink, 0.1) } },
          transition: ["shape", "style"],
        },
      ];
      if (tile.lines.length) {
        children.push({
          type: "text",
          silent: true,
          x: tile.x + padX,
          y: tile.y + 6,
          style: {
            text: `${tile.lines.map((line) => `{n|${line}}`).join("\n")}${tile.valueText ? `\n{v|${tile.valueText}}` : ""}`,
            rich: { n: { fill: ink, fontSize: nameSize, fontWeight: 600, lineHeight: 17, fontFamily: t.fontFamily }, v: { fill: alpha(ink, 0.78), fontSize: 12, lineHeight: 16, fontFamily: t.fontFamily } },
          },
        });
      }
      return { type: "group", children };
    };
    const renderHead = (params: any) => {
      const head = heads[params.dataIndex];
      if (!head || !head.text) return null;
      return { type: "text", silent: true, x: head.x, y: head.y + 10, style: { text: head.text, fill: t.ink, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "middle" } };
    };

    const top = [...leaves].sort(desc)[0];
    const legend: LegendItem[] =
      grouped && !showHeads ? groups.slice(0, maxColours).map((g, gi) => ({ name: groupName(g), color: ctx.color(g, gi), muted: ctx.dimmed(g) && leaves.filter((l) => l.group === g).every((l) => ctx.dimmed(l.key)) })) : [];

    return {
      legend,
      alt: `Treemap of ${p.value} by ${grouped ? `${p.group} and ` : ""}${p.name}, ${leaves.length} parts totalling ${ctx.fmt(total)}. ${top ? `Largest: ${top.key} with ${ctx.fmt(top.value)} (${pct(top.value / total)}).` : ""}${grouped ? ` Groups: ${groups.map((g) => `${groupName(g)} ${pct(groupTotal(g) / total)}`).join(", ")}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const tile = tiles[d.dataIndex];
            if (!tile || d.seriesId !== "treemap") return "";
            const rows = [{ name: p.value, value: ctx.fmt(tile.value), color: tile.color }, { name: "Share of total", value: pct(tile.value / total) }];
            if (grouped) rows.push({ name: `Share of ${groupName(tile.group)}`, value: pct(tile.value / groupTotal(tile.group)) });
            return tooltipHtml(ctx, tile.key, rows);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "treemap",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            animationDurationUpdate: 600,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            renderItem: renderItem as any,
            data: tiles.map((tile) => ({ id: tile.key, name: tile.key, value: [tile.value], leaf: true, group: tile.group })),
          },
          ...(heads.length ? [{ id: "heads", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderHead as any, data: heads.map((h) => ({ id: h.key, value: [0] })) }] : []),
        ],
      },
    };
  },
});

type _Cell<T> = { d: T; v: number; x: number; y: number; w: number; h: number };

/**
 * Squarified treemap layout (Bruls, Huizing and van Wijk): fills the rectangle row by row along
 * its shorter side, closing a row when adding the next item would make its tiles less square.
 * `ratio` above 1 prefers tiles wider than tall, which suits horizontal labels. Items must be
 * sorted largest first.
 */
function _squarify<T>(items: { v: number; d: T }[], x: number, y: number, w: number, h: number, ratio = 1.4): _Cell<T>[] {
  const out: _Cell<T>[] = [];
  const total = items.reduce((s, it) => s + it.v, 0);
  if (!(total > 0) || w <= 0 || h <= 0) return out;
  const scale = (w * h) / total;
  let i = 0;
  while (i < items.length) {
    const short = Math.min(w, h);
    const f = short * short * ratio;
    let sum = 0;
    let lo = Infinity;
    let hi = 0;
    let best = Infinity;
    let j = i;
    while (j < items.length) {
      const a = items[j].v * scale;
      const s = sum + a;
      const worst = Math.max((f * Math.max(hi, a)) / (s * s), (s * s) / (f * Math.min(lo, a)));
      if (j > i && worst > best) break;
      best = worst;
      sum = s;
      lo = Math.min(lo, a);
      hi = Math.max(hi, a);
      j++;
    }
    const last = j === items.length;
    const thick = last ? (w >= h ? w : h) : sum / short;
    let off = 0;
    for (let k = i; k < j; k++) {
      const len = thick ? (items[k].v * scale) / thick : 0;
      out.push(w >= h ? { ...items[k], x, y: y + off, w: thick, h: len } : { ...items[k], x: x + off, y, w: len, h: thick });
      off += len;
    }
    if (w >= h) {
      x += thick;
      w -= thick;
    } else {
      y += thick;
      h -= thick;
    }
    i = j;
  }
  return out;
}

export const examples = {
  "Flat, with highlight": {
    data: [
      { company: "Nvidia", cap: 3.3 },
      { company: "Apple", cap: 3.4 },
      { company: "Microsoft", cap: 3.1 },
      { company: "Alphabet", cap: 2.1 },
      { company: "Amazon", cap: 2.0 },
      { company: "Meta", cap: 1.5 },
      { company: "Tesla", cap: 0.8 },
      { company: "Broadcom", cap: 0.8 },
      { company: "Berkshire Hathaway", cap: 1.0 },
      { company: "Eli Lilly", cap: 0.8 },
      { company: "JPMorgan Chase", cap: 0.6 },
      { company: "Walmart", cap: 0.65 },
      { company: "Visa", cap: 0.55 },
      { company: "ExxonMobil", cap: 0.5 },
      { company: "UnitedHealth", cap: 0.5 },
    ],
    name: "company",
    value: "cap",
    format: "${value}tn",
    highlight: ["Nvidia", "Apple", "Microsoft"],
    title: "Apple, Nvidia and Microsoft were worth $9.8 trillion combined in late 2024",
    subtitle: "Market capitalisation of the 15 largest US-listed companies, late 2024, $ trillion",
    source: "Company filings, exchange data",
    note: "Rounded, illustrative",
  },
  "Stress: many small tiles and long names": {
    theme: "forest",
    data: [
      ["Health", "Hospital and community health services", 168],
      ["Health", "Primary care and prescribing", 38],
      ["Health", "Public health grants to local authorities", 4],
      ["Social protection", "State pension", 124],
      ["Social protection", "Universal credit and legacy benefits", 88],
      ["Social protection", "Disability and incapacity benefits", 66],
      ["Social protection", "Housing benefit", 16],
      ["Social protection", "Child benefit", 12],
      ["Education", "Schools", 64],
      ["Education", "Higher and further education", 28],
      ["Education", "Early years", 8],
      ["Defence", "Armed forces and equipment", 54],
      ["Debt interest", "Interest on government debt", 104],
      ["Transport", "Rail", 22],
      ["Transport", "Roads and local transport", 14],
      ["Public order", "Police", 20],
      ["Public order", "Courts, prisons and probation", 12],
      ["Public order", "Fire and rescue", 3],
      ["Other", "Housing and environment", 31],
      ["Other", "Overseas aid", 13],
      ["Other", "Culture, media and sport", 9],
      ["Other", "Science and research councils", 12],
    ].map(([area, programme, bn]) => ({ area, programme, bn })),
    group: "area",
    name: "programme",
    value: "bn",
    format: "£{value}bn",
    height: 460,
    title: "Social protection was £306bn of £910bn in UK public spending in 2023-24",
    subtitle: "Public spending by area and programme, £ billion, 2023-24",
    source: "HM Treasury Public Expenditure Statistical Analyses",
    note: "Programme split is illustrative",
  },
  "Two levels, four groups": {
    theme: "poster",
    data: [
      { item: "Rent", area: "Housing", gbp: 1150 },
      { item: "Energy", area: "Housing", gbp: 160 },
      { item: "Water", area: "Housing", gbp: 45 },
      { item: "Groceries", area: "Food", gbp: 420 },
      { item: "Eating out", area: "Food", gbp: 140 },
      { item: "Car", area: "Transport", gbp: 260 },
      { item: "Bus and rail", area: "Transport", gbp: 70 },
      { item: "Leisure", area: "Other", gbp: 190 },
      { item: "Phone and internet", area: "Other", gbp: 65 },
    ],
    name: "item",
    value: "gbp",
    group: "area",
    format: "£{value}",
    height: 340,
    title: "Rent was £1,150 of a £2,500 monthly household budget",
    subtitle: "Monthly spending of one household by item, pounds",
    note: "Illustrative figures for an invented household.",
  },
};
