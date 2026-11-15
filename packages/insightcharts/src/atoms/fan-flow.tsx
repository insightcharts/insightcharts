import { CustomChart } from "echarts/charts";
import { inkOn, mix } from "../core/color";
import { defineChart } from "../core/define";
import { dodge, measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";
import { _posterPalette } from "./_poster-colors";

export interface FanFlowProps {
  /** Destination field: one ribbon per distinct value. */
  name: string;
  /** Value field: ribbon thickness. Rows sharing a name are summed. */
  value: string;
  /** Label printed in the single block, e.g. "Household water". The total is printed with it. */
  trunk?: string;
  /** `"out"`: one block on the left fans out to many labels on the right. `"in"`: many labels on the left flow into one block on the right. */
  direction?: "out" | "in";
  /** Keep this many ribbons; the rest are summed into the "other" ribbon. Default 12. */
  maxItems?: number;
  /** Name of the remainder ribbon, drawn in the context colour. A row with this name is treated as the remainder. Default "Other". */
  otherLabel?: string;
  /** Destinations to mark with a dotted outline around the name. */
  tagged?: string[];
  /** What the dotted outline means, printed in the key. Required for `tagged` to be drawn. */
  tagLabel?: string;
  /** Print each ribbon's share of the total. Default true (dropped on narrow screens). */
  share?: boolean;
  /** `"series"`: one colour per destination; past the size of the theme's palette the extra colours are derived from the theme's own. `"none"`: every ribbon in the accent. Default: series while the destinations fit the palette (at most 8), none beyond. */
  colorBy?: "series" | "none";
  /** `"value"` (default) orders ribbons largest first; `"none"` keeps the data order. */
  sort?: "value" | "none";
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// One edge of a ribbon: an S-curve from (x0, y0) to (x1, y1) with level ends, sampled into a fixed number of
// points so the outline is a polygon that can tween from one state of the data to the next.
const STEPS = 24;
function _fanEdge(x0: number, y0: number, x1: number, y1: number): number[][] {
  const mx = (x0 + x1) / 2;
  const pts: number[][] = [];
  for (let s = 0; s <= STEPS; s++) {
    const u = s / STEPS;
    const v = 1 - u;
    pts.push([v * v * v * x0 + 3 * v * v * u * mx + 3 * v * u * u * mx + u * u * u * x1, v * v * v * y0 + 3 * v * v * u * y0 + 3 * v * u * u * y1 + u * u * u * y1]);
  }
  return pts;
}

type _FanItem = { key: string; value: number; other: boolean };

function _fanItems(rows: Record<string, unknown>[], p: Pick<FanFlowProps, "name" | "value" | "maxItems" | "otherLabel" | "sort">): { items: _FanItem[]; folded: number } {
  const otherName = p.otherLabel ?? "Other";
  const sums = new Map<string, number>();
  for (const r of rows) {
    const v = toNumber(r[p.value]);
    if (Number.isNaN(v) || v <= 0) continue;
    const key = String(r[p.name] ?? "");
    sums.set(key, (sums.get(key) ?? 0) + v);
  }
  let rest = sums.get(otherName) ?? 0;
  sums.delete(otherName);
  let items: _FanItem[] = [...sums].map(([key, value]) => ({ key, value, other: false }));
  if (p.sort !== "none") items.sort((a, b) => b.value - a.value);
  const cap = Math.max(1, p.maxItems ?? 12);
  const folded = Math.max(0, items.length - cap);
  if (folded) {
    rest += items.slice(cap).reduce((s, it) => s + it.value, 0);
    items = items.slice(0, cap);
  }
  if (rest > 0) items.push({ key: otherName, value: rest, other: true });
  return { items, folded };
}

/**
 * One quantity split into its parts as a fan of ribbons. The block is the total, each ribbon's
 * thickness is its share of that block, and the ribbons arrive at an evenly spaced column of
 * names and values, so small parts stay readable next to large ones.
 */
export const FanFlow = defineChart<FanFlowProps>({
  name: "fan-flow",
  title: "Fan flow",
  category: "poster",
  description: "One solid block that splits into curved ribbons, each as thick as its value, ending at an aligned column of names, values and shares.",
  whenToUse: "One total divided among 4 to about 14 destinations (or collected from that many origins, with `direction: \"in\"`) when the picture of the split is the point: where a budget goes, what a day's water is used for, which sources feed one total.",
  avoid: "Flows with more than one stage or several sources (use sankey-chart); precise comparison of the parts (use bar-chart); 2 to 4 parts (use segmented-bar or donut-chart); values that can be negative (use bar-chart).",
  use: [CustomChart],
  defaults: { direction: "out", share: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.data?.other ? null : params.name),
  height: (p, rows) => {
    const n = Math.min(new Set(rows.map((r) => String(r[p.name] ?? ""))).size, (p.maxItems ?? 12) + 1);
    return Math.max(300, n * 38 + 16 + (p.tagged?.length && p.tagLabel ? 30 : 0));
  },
  props: [
    { name: "name", type: "string", required: true, description: "Destination field: one ribbon per distinct value." },
    { name: "value", type: "string", required: true, description: "Value field: ribbon thickness. Rows sharing a name are summed; non-positive values are dropped." },
    { name: "trunk", type: "string", description: "Label printed in the single block, with the total." },
    { name: "direction", type: '"out" | "in"', default: '"out"', description: "`out`: one block fans out to many labels on the right. `in`: many labels on the left flow into one block." },
    { name: "maxItems", type: "number", default: "12", description: "Ribbons to keep; the rest are summed into the remainder ribbon." },
    { name: "otherLabel", type: "string", default: '"Other"', description: "Name of the remainder ribbon, drawn in the context colour. A row with this name is treated as the remainder." },
    { name: "tagged", type: "string[]", description: "Destinations marked with a dotted outline around the name." },
    { name: "tagLabel", type: "string", description: "What the dotted outline means, printed in the key. Needed for `tagged` to be drawn." },
    { name: "share", type: "boolean", default: "true", description: "Print each ribbon's share of the total. Dropped on narrow screens." },
    { name: "colorBy", type: '"series" | "none"', description: "`series`: one colour per destination; past the size of the theme's palette the extra colours are derived from the theme's own. `none`: every ribbon in the accent. Default: series while the destinations fit the palette (at most 8), none beyond." },
    { name: "sort", type: '"value" | "none"', default: '"value"', description: "Largest first, or the data order." },
  ],
  example: {
    type: "fan-flow",
    data: [
      { use: "Shower", litres: 128 },
      { use: "Toilet", litres: 97 },
      { use: "Washing machine", litres: 62 },
      { use: "Kitchen tap", litres: 45 },
      { use: "Dishwasher", litres: 24 },
      { use: "Garden", litres: 21 },
      { use: "Bathroom tap", litres: 19 },
      { use: "Leaks", litres: 16 },
    ],
    name: "use",
    value: "litres",
    trunk: "Litres a day",
    tagged: ["Shower", "Washing machine", "Dishwasher"],
    tagLabel: "Uses heated water",
    title: "Showers used 128 of a household's 412 litres of water a day",
    subtitle: "Daily water use of one four-person household by use, litres",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const { items, folded } = _fanItems(ctx.rows, p);
    const n = items.length;
    const total = items.reduce((s, it) => s + it.value, 0) || 1;
    // Shares keep one decimal throughout when any part is under 10%, so the column aligns.
    const digits = items.some((it) => it.value / total < 0.1) ? 1 : 0;
    const pct = ctx.formatter({ style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits });
    const real = items.filter((it) => !it.other);
    // Identity colours are never cycled: a small poster palette may hold only 4 or 5.
    const hues = Math.min(8, t.categorical.length);
    // An explicit `colorBy: "series"` past the palette size takes further steps derived from the theme's own colours.
    const derived = p.colorBy === "series" && real.length > hues ? _posterPalette(t, real.length) : null;
    const bySeries = derived != null || (p.colorBy ?? (real.length <= hues ? "series" : "none")) === "series";
    const baseOf = (it: _FanItem, i: number) => (it.other ? t.context : ctx.highlight.length ? ctx.color(it.key, i) : derived ? derived[i] : bySeries ? ctx.color(it.key, i) : ctx.color(it.key));
    const colorOf = (it: _FanItem, i: number) => (ctx.selected(it.key) ? baseOf(it, i) : mix(t.surface, baseOf(it, i), 0.3));
    // One hue everywhere makes block and ribbons a single form; otherwise the block stays neutral so no destination seems to own it.
    const blockFill = bySeries || ctx.highlight.length ? t.ink : t.accent;
    const tags = p.tagLabel ? new Set(p.tagged ?? []) : new Set<string>();
    const anyTag = items.some((it) => tags.has(it.key));

    const W = ctx.width;
    const H = ctx.height;
    const compact = ctx.compact;
    const out = p.direction !== "in";
    const keyH = anyTag ? 30 : 0;
    const top = 2;
    const avail = Math.max(40, H - keyH - top - 2);

    // Rows: every ribbon ends in a slot at least `minRow` tall, so the label column stays evenly
    // readable however uneven the values are. The value scale is whatever makes the slots fill the height.
    const gap = 4;
    const minRow = Math.min(compact ? 22 : 24, (avail - gap * (n - 1)) / Math.max(1, n));
    const used = (k: number) => items.reduce((s, it) => s + Math.max(minRow, it.value * k), 0) + gap * (n - 1);
    let lo = 0;
    let hi = avail / total;
    for (let pass = 0; pass < 40; pass++) {
      const mid = (lo + hi) / 2;
      if (used(mid) > avail) hi = mid;
      else lo = mid;
    }
    const k = lo;
    const thick = items.map((it) => Math.max(1.5, it.value * k));
    const slotH = items.map((it) => Math.max(minRow, it.value * k));
    const centre: number[] = [];
    let y = top + Math.max(0, (avail - used(k)) / 2);
    for (let i = 0; i < n; i++) {
      centre.push(y + slotH[i] / 2);
      y += slotH[i] + gap;
    }
    // At the block the ribbons touch, so its height is the total at the same scale.
    const stackH = thick.reduce((s, v) => s + v, 0);
    const blockTop = top + (avail - stackH) / 2;
    const from: number[] = [];
    let sy = blockTop;
    for (let i = 0; i < n; i++) {
      from.push(sy);
      sy += thick[i];
    }
    const labelY = dodge(centre, 17, top + 9, top + avail - 9);

    // Columns. Numerals grow with their ribbon, so the largest parts read first.
    const showShare = p.share !== false && !compact;
    const nameSize = 13;
    const valueSize = thick.map((th) => Math.round(clamp(th * 0.42, 13, compact ? 20 : 28)));
    const valueWeight = (size: number) => (size >= 18 ? 300 : 600);
    const valueText = items.map((it) => ctx.fmt(it.value));
    const shareText = items.map((it) => pct(it.value / total));
    const valW = Math.ceil(Math.max(0, ...valueText.map((s, i) => measureText(s, valueSize[i], t.displayFamily, valueWeight(valueSize[i])))));
    const shareW = showShare ? Math.ceil(Math.max(0, ...shareText.map((s) => measureText(s, 12, t.fontFamily)))) + 12 : 0;
    const blockW = Math.round(clamp(W * 0.17, compact ? 44 : 88, 150));
    const tagPad = anyTag ? 7 : 0;
    const colGap = 14;
    const joint = 10;
    const fullNameW = Math.ceil(Math.max(0, ...items.map((it) => measureText(it.key, nameSize, t.fontFamily, 600))));
    const minRibbon = compact ? 64 : 120;
    const nameW = Math.max(48, Math.min(fullNameW, Math.round(W * (compact ? 0.4 : 0.32)), W - blockW - minRibbon - joint - tagPad * 2 - colGap - valW - shareW));
    const labelW = tagPad * 2 + nameW + colGap + valW + shareW;
    // Label column on the right for "out", on the left for "in"; the columns keep their reading order either way.
    const labelX = out ? W - labelW : 0;
    const nameX = labelX + tagPad;
    const valueRight = nameX + nameW + tagPad + colGap + valW;
    const blockX = out ? 0 : W - blockW;
    const xBlock = out ? blockW : W - blockW;
    const xLabel = out ? labelX - joint : labelW + joint;
    const midX = (xBlock + xLabel) / 2;

    const names = items.map((it) => truncateText(it.key, nameW, nameSize, t.fontFamily, 600));

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const fill = colorOf(it, i);
      const dim = it.other || ctx.dimmed(it.key);
      const live = ctx.selected(it.key);
      const e0 = centre[i] - thick[i] / 2;
      const e1 = centre[i] + thick[i] / 2;
      const s0 = from[i];
      const s1 = from[i] + thick[i];
      const ly = labelY[i];
      const moved = Math.abs(ly - centre[i]) > 3;
      const nameTextW = measureText(names[i], nameSize, t.fontFamily, dim ? 500 : 600);
      const vSize = valueSize[i];
      const vW = measureText(valueText[i], vSize, t.displayFamily, valueWeight(vSize));
      const children: any[] = [
        {
          type: "polygon",
          shape: { points: [..._fanEdge(xBlock, s0, xLabel, e0), ..._fanEdge(xBlock, s1, xLabel, e1).reverse()] },
          // A hairline in the ribbon's own colour closes the anti-aliased seam where ribbons touch at the block.
          style: { fill, stroke: fill, lineWidth: 0.75, opacity: 1, enterFrom: { opacity: 0 } },
          enterAnimation: { duration: 420, delay: i * 45 },
          emphasis: { style: { fill: mix(fill, inkOn(fill), 0.12), stroke: mix(fill, inkOn(fill), 0.12) } },
          transition: ["shape", "style"],
        },
      ];
      // Every item returns the same children in the same order, so a data change tweens each one to its new place
      // instead of redrawing: a part that is not needed is kept, hidden.
      const a = out ? xLabel + 2 : xLabel - 2;
      const b = out ? nameX - tagPad - 2 : valueRight + shareW + 2;
      children.push({ type: "polyline", silent: true, invisible: !moved, shape: { points: [[a, centre[i]], [(a + b) / 2, ly], [b, ly]] }, style: { stroke: t.axis, lineWidth: 1, fill: "none" }, transition: ["shape"] });
      const opacity = live ? 1 : 0.4;
      children.push({ type: "text", silent: true, style: { x: nameX, y: ly + 0.5, text: names[i], fill: dim ? t.inkSecondary : t.ink, fontSize: nameSize, fontWeight: dim ? 500 : 600, fontFamily: t.fontFamily, verticalAlign: "middle", opacity }, transition: ["style"] });
      // A dotted rule carries the eye from the name to its number, as in a printed table.
      const ruleFrom = nameX + nameTextW + tagPad + 6;
      const ruleTo = valueRight - vW - 6;
      children.push({ type: "line", silent: true, invisible: ruleTo - ruleFrom < 10, shape: { x1: ruleFrom, y1: ly + 5, x2: ruleTo, y2: ly + 5 }, style: { stroke: t.axis, lineWidth: 1, lineDash: [1, 3], opacity }, transition: ["shape"] });
      children.push({ type: "text", silent: true, style: { x: valueRight, y: ly + 0.5, text: valueText[i], fill: dim ? t.inkSecondary : t.ink, fontSize: vSize, fontWeight: valueWeight(vSize), fontFamily: t.displayFamily, align: "right", verticalAlign: "middle", opacity }, transition: ["style"] });
      children.push({ type: "text", silent: true, invisible: !showShare, style: { x: valueRight + shareW, y: ly + 0.5, text: shareText[i], fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, align: "right", verticalAlign: "middle", opacity }, transition: ["style"] });
      children.push({ type: "rect", silent: true, invisible: !tags.has(it.key), shape: { x: nameX - tagPad, y: ly - 10.5, width: nameTextW + tagPad * 2, height: 21, r: 5 }, style: { fill: "none", stroke: t.inkSecondary, lineWidth: 1, lineDash: [2, 2.5], opacity }, transition: ["shape"] });
      // Custom shapes have no built-in blur: state it, so hovering one mark dims the rest.
      for (const c of children) c.blur ??= { style: { opacity: c.type === "text" ? 0.35 : 0.2 } };
      // In a custom series the hover focus is declared on the returned element. It stays on with `select`: core
      // downplays before it pushes the rebuilt option, so a click leaves no mark stuck in its blur state.
      return { type: "group", focus: "self", children };
    };

    const totalText = ctx.fmt(total);
    const blockInk = inkOn(blockFill);
    const renderTrunk = () => {
      const children: any[] = [{ type: "rect", shape: { x: blockX, y: blockTop, width: blockW, height: stackH }, style: { fill: blockFill, opacity: 1, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 300 } }];
      const pad = 10;
      const inner = blockW - pad * 2;
      let big = 38;
      while (big > 16 && measureText(totalText, big, t.displayFamily, 300) > inner) big -= 2;
      const lines = p.trunk ? wrapText(p.trunk, inner, 12, t.fontFamily, 600).slice(0, 3) : [];
      const fits = measureText(totalText, big, t.displayFamily, 300) <= inner && lines.every((l) => measureText(l, 12, t.fontFamily, 600) <= inner) && stackH >= big + lines.length * 15 + 18;
      if (fits) {
        const blockH = big + (lines.length ? 4 + lines.length * 15 : 0);
        const y0 = blockTop + (stackH - blockH) / 2;
        children.push({ type: "text", style: { x: blockX + pad, y: y0, text: totalText, fill: blockInk, fontSize: big, fontWeight: 300, fontFamily: t.displayFamily, lineHeight: big, verticalAlign: "top" } });
        lines.forEach((line, j) => children.push({ type: "text", style: { x: blockX + pad, y: y0 + big + 4 + j * 15, text: line, fill: blockInk, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "top" } }));
      } else if (stackH >= 40) {
        // A narrow block carries its label up its length instead.
        const size = blockW >= 40 ? 13 : 12;
        const full = p.trunk ? `${totalText}  ${p.trunk}` : totalText;
        const text = truncateText(full, stackH - 14, size, t.fontFamily, 600);
        children.push({ type: "text", x: blockX + blockW / 2, y: blockTop + stackH / 2, rotation: Math.PI / 2, style: { text, fill: blockInk, fontSize: size, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      }
      if (anyTag) {
        const kw = 22;
        const text = truncateText(p.tagLabel!, labelW - kw - 8, 12, t.fontFamily);
        const ky = H - 11;
        children.push({ type: "rect", shape: { x: nameX - tagPad, y: ky - 7, width: kw, height: 14, r: 4 }, style: { fill: "none", stroke: t.inkSecondary, lineWidth: 1, lineDash: [2, 2.5] } });
        children.push({ type: "text", style: { x: nameX - tagPad + kw + 8, y: ky + 0.5, text, fill: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "middle" } });
      }
      return { type: "group", silent: true, children };
    };

    const top3 = [...real].sort((a, b) => b.value - a.value).slice(0, 3);
    const rest = items.find((it) => it.other);
    return {
      legend: [],
      alt: `Fan flow of ${p.value} ${out ? "from" : "into"} ${p.trunk ?? "one total"} ${out ? "to" : "from"} ${real.length} ${p.name} values, total ${totalText}. Largest: ${top3.map((it) => `${it.key} ${ctx.fmt(it.value)} (${pct(it.value / total)})`).join(", ")}.${rest ? ` ${rest.key}${folded ? ` (${folded} smaller ones)` : ""}: ${ctx.fmt(rest.value)}.` : ""}${anyTag ? ` ${p.tagLabel}: ${items.filter((it) => tags.has(it.key)).map((it) => it.key).join(", ")}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; an empty off-canvas cartesian series takes them instead.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            if (!it || d.seriesId !== "fan") return "";
            const rows = [{ name: p.value, value: valueText[d.dataIndex], color: colorOf(it, d.dataIndex) }, { name: `Share of ${totalText}`, value: shareText[d.dataIndex] }];
            if (it.other && folded) rows.push({ name: "Smaller items summed", value: String(folded) });
            if (tags.has(it.key)) rows.push({ name: p.tagLabel!, value: "Yes" });
            return tooltipHtml(ctx, it.key, rows);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "trunk", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderTrunk as any, data: [0], z: 1 },
          {
            id: "fan",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            // ECharts rebuilds every element of a custom series when universal transition is on, and its path morph
            // scrambles a group of strokes and labels. With it off the elements are kept and each one tweens through
            // its own `transition`, which is what a data change needs here.
            universalTransition: { enabled: false },
            z: 2,
            dimensions: ["value", "share"],
            encode: { tooltip: [0, 1] },
            emphasis: { focus: "self" as const },
            renderItem: renderItem as any,
            data: items.map((it) => ({ id: it.key, name: it.key, value: [it.value, it.value / total], other: it.other })),
          },
        ],
      },
    };
  },
});

export const examples = {
  "Many into one, with highlight": {
    data: [
      { district: "Riverside", riders: 2600 },
      { district: "Old Town", riders: 2150 },
      { district: "Hillcrest", riders: 1700 },
      { district: "Northgate", riders: 1250 },
      { district: "Mill Quarter", riders: 900 },
      { district: "Eastfield", riders: 520 },
      { district: "Lakeside", riders: 280 },
    ],
    name: "district",
    value: "riders",
    direction: "in",
    trunk: "Riders arriving at Central Station",
    highlight: "Riverside",
    format: "integer",
    title: "Riverside sent 2,600 of the 9,400 daily riders arriving at Central Station",
    subtitle: "Riders arriving at Central Station on a weekday by home district",
    note: "Illustrative figures for an invented city.",
  },
  "One colour": {
    data: [
      { item: "Rent", amount: 1180 },
      { item: "Food", amount: 520 },
      { item: "Transport", amount: 240 },
      { item: "Energy", amount: 190 },
      { item: "Savings", amount: 150 },
      { item: "Other", amount: 120 },
    ],
    name: "item",
    value: "amount",
    colorBy: "none",
    trunk: "Monthly take-home pay",
    format: "€{value}",
    title: "Rent took €1,180 of a €2,400 monthly pay packet",
    subtitle: "Monthly spending of one renter by category, euros",
    note: "Illustrative figures.",
  },
  "Ten destinations, one colour each": {
    data: [
      { service: "Schools", spend: 212 },
      { service: "Social care", spend: 164 },
      { service: "Transport", spend: 121 },
      { service: "Housing", spend: 96 },
      { service: "Waste", spend: 71 },
      { service: "Police", spend: 64 },
      { service: "Parks", spend: 42 },
      { service: "Fire service", spend: 38 },
      { service: "Libraries", spend: 23 },
      { service: "Culture", spend: 19 },
    ],
    name: "service",
    value: "spend",
    colorBy: "series",
    trunk: "City budget",
    format: "€{value}m",
    title: "Schools took €212m of one city's €850m budget",
    subtitle: "Annual spending of one city council by service, millions of euros",
    note: "Illustrative figures for an invented city.",
  },
  "Stress: 18 destinations, long names, very uneven values": {
    data: [
      ["Salaries and employer contributions for teaching staff", 48200],
      ["Building maintenance, heating and electricity", 9100],
      ["Special educational needs support", 7400],
      ["Catering", 3900],
      ["Administration and office staff", 3600],
      ["Books, software licences and classroom equipment", 2100],
      ["School trips", 640],
      ["Sports hall hire", 410],
      ["Library", 380],
      ["Music lessons", 300],
      ["Staff training", 290],
      ["Insurance", 260],
      ["Cleaning supplies", 150],
      ["Printing", 120],
      ["Garden club", 45],
      ["First-aid supplies", 30],
      ["Lost property", 12],
      ["Chess club", 8],
    ].map(([line, k]) => ({ line, pounds: (k as number) * 1000 })),
    name: "line",
    value: "pounds",
    maxItems: 10,
    otherLabel: "8 smaller lines",
    trunk: "Annual budget",
    tagged: ["Catering", "School trips", "Music lessons"],
    tagLabel: "Partly paid by parents",
    format: "currency:GBP",
    title: "Teaching salaries took £48.2m of one school's £76.9m budget",
    subtitle: "Annual spending of one secondary school by budget line, pounds",
    note: "Illustrative figures.",
  },
};
