import { CustomChart } from "echarts/charts";
import { alpha, mix } from "../core/color";
import { defineChart } from "../core/define";
import { resolveIcon as sharedIcon, type IconName } from "../core/icons";
import { measureText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";

/** Any built-in icon name from `core/icons.ts`. */
export type PictogramIcon = IconName;

export interface PictogramChartProps {
  /** Category field: one row of icons per category. */
  name: string;
  /** Value field. */
  value: string;
  /** How many units one icon stands for. Default: a round number that gives the largest row about ten icons. */
  unit?: number;
  /** What one icon stands for, printed in the key line: "1 million people". Default: the unit and the value field name. */
  unitLabel?: string;
  /** A built-in icon name, or a custom SVG path as `path://M0 0...`. */
  icon?: PictogramIcon | (string & {});
  /** A different icon per category key. Falls back to `icon`. */
  icons?: Record<string, string>;
  /** Wrap long rows after this many icons. Default: as many as fit, in multiples of five. */
  perRow?: number;
  /** Print the value after each row. Default true. */
  labels?: boolean;
  /** Order of the rows. Default: data order. */
  sort?: "none" | "asc" | "desc";
}

// Icons come from the shared registry in core/icons.ts; an unknown name draws a person.
const resolveIcon = (icon: string | undefined) => sharedIcon(icon, "person");

/**
 * An ISOTYPE unit chart: quantity is shown by repeating an icon, never by enlarging it.
 * Each icon stands for a stated number of units and the last one in a row is clipped to
 * the remainder, so rows can be compared by length and by count.
 */
export const PictogramChart = defineChart<PictogramChartProps>({
  name: "pictogram-chart",
  title: "Pictogram chart",
  category: "comparison",
  description: "Compares quantities with rows of repeated icons, each icon standing for a fixed number of units.",
  whenToUse: "A few categories (2 to 6) of countable things, people, homes, vehicles, where making the quantity concrete matters more than reading precise values.",
  avoid: "More than about 8 categories or values that need precise comparison (use bar-chart); a share of one whole (use waffle-chart); values that would need more than about 60 icons in a row (raise `unit`, or use bar-chart).",
  use: [CustomChart],
  defaults: { icon: "person", labels: true, sort: "none" },
  // A band per category plus the key line: five rows give 280px, two do not leave the plot half empty.
  height: (_p, rows) => 30 + rows.length * (rows.length <= 3 ? 62 : 50),
  selectField: (p) => p.name,
  props: [
    { name: "name", type: "string", required: true, description: "Category field: one row of icons per category." },
    { name: "value", type: "string", required: true, description: "Value field." },
    { name: "unit", type: "number", description: "Units per icon. Default: a round number giving the largest row about ten icons." },
    { name: "unitLabel", type: "string", description: 'What one icon stands for, for the key line, e.g. "1 million people".' },
    { name: "icon", type: 'IconName | "path://..."', default: '"person"', description: 'Built-in icon name from `core/icons.ts` ("person", "house", "car", "tree", "coin", "drop", "bolt", "wind-turbine", "wheat" and about 60 more) or a custom single SVG path.' },
    { name: "icons", type: "Record<string, string>", description: "Icon per category key; falls back to `icon`." },
    { name: "perRow", type: "number", description: "Wrap rows after this many icons. Default: as many as fit." },
    { name: "labels", type: "boolean", default: "true", description: "Print the value after each row." },
    { name: "sort", type: '"none" | "asc" | "desc"', default: '"none"', description: "Row order." },
  ],
  example: {
    type: "pictogram-chart",
    data: [
      { city: "Tokyo", people: 37.1 },
      { city: "Delhi", people: 33.8 },
      { city: "Shanghai", people: 29.9 },
      { city: "São Paulo", people: 22.8 },
      { city: "Mexico City", people: 22.5 },
    ],
    name: "city",
    value: "people",
    unit: 2,
    unitLabel: "2 million people",
    format: "{value}m",
    highlight: "Delhi",
    title: "Delhi had 33.8 million people in 2024, 3.3 million fewer than Tokyo",
    subtitle: "Population of the five largest urban agglomerations, 2024",
    source: "UN World Urbanization Prospects",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const rows = ctx.rows.map((r) => ({ key: String(r[p.name] ?? ""), value: Math.max(0, toNumber(r[p.value]) || 0) }));
    if (p.sort === "asc") rows.sort((a, b) => a.value - b.value);
    else if (p.sort === "desc") rows.sort((a, b) => b.value - a.value);
    const max = Math.max(0, ...rows.map((r) => r.value));
    const unit = p.unit && p.unit > 0 ? p.unit : niceStep(max / 10) || 1;
    const counts = rows.map((r) => r.value / unit);
    const maxIcons = Math.max(1, Math.ceil(Math.max(0, ...counts) - 1e-9));
    const showValues = p.labels !== false;
    const valueTexts = rows.map((r) => ctx.fmt(r.value));

    // Layout. Wide: names in a left column. Compact: names on their own line above the icons.
    const stacked = ctx.compact;
    const nameW = stacked ? 0 : Math.min(Math.max(120, ctx.width * 0.3), Math.max(...rows.map((r) => measureText(r.key, 13, t.fontFamily, 600)), 30) + 22);
    const valueW = showValues && !stacked ? Math.max(...valueTexts.map((s) => measureText(s, 13, t.fontFamily, 600))) + 14 : 0;
    const keyH = 30;
    const availW = Math.max(40, ctx.width - nameW - valueW);
    const availH = Math.max(40, ctx.height - keyH);
    const headH = stacked ? 20 : 0;
    const icons = rows.map((r) => resolveIcon(p.icons?.[r.key] ?? p.icon));
    const maxAspect = Math.max(...icons.map((i) => i.aspect), 0.3);

    // Find the largest icon height that fits both ways; wrap rows in fives when they cannot fit on one line.
    let h = 12;
    let perRow = maxIcons;
    for (let size = 44; size >= 10; size -= 1) {
      const pitch = size * maxAspect + Math.max(3, size * 0.18);
      let fit = Math.floor(availW / pitch);
      if (p.perRow) fit = Math.min(fit, p.perRow);
      if (fit < 1) continue;
      if (fit < maxIcons && fit >= 5) fit -= fit % 5;
      const per = Math.min(fit, maxIcons);
      const lines = counts.reduce((s, c) => s + Math.max(1, Math.ceil(Math.ceil(c - 1e-9) / per)), 0);
      const total = lines * (size + 4) + rows.length * (headH + Math.max(8, size * 0.35));
      h = size;
      perRow = per;
      if (total <= availH) break;
    }
    const w = h * maxAspect;
    const pitchX = w + Math.max(3, h * 0.18);
    const pitchY = h + 4;
    const laneGap = Math.max(8, h * 0.35);
    const lanes: { top: number; lines: number }[] = [];
    let y = keyH;
    counts.forEach((c) => {
      const lines = Math.max(1, Math.ceil(Math.ceil(c - 1e-9) / perRow));
      lanes.push({ top: y + headH, lines });
      y += headH + lines * pitchY + laneGap;
    });

    const colorOf = (key: string) => {
      const base = ctx.color(key);
      return ctx.selected(key) ? base : alpha(base, 0.25);
    };
    const path = (icon: { d: string; aspect: number }, x: number, yy: number, fill: string, extra: object = {}) => ({ type: "path", shape: { pathData: icon.d, x, y: yy, width: w, height: h, layout: "center" }, style: { fill, opacity: 1 }, ...extra });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const r = rows[i];
      if (!r) return null;
      const lane = lanes[i];
      const icon = icons[i];
      const fill = colorOf(r.key);
      const count = counts[i];
      const full = Math.floor(count + 1e-9);
      const frac = count - full;
      const children: any[] = [];
      const pos = (k: number) => ({ x: nameW + (k % perRow) * pitchX, y: lane.top + Math.floor(k / perRow) * pitchY });
      for (let k = 0; k < full; k++) {
        const at = pos(k);
        children.push(path(icon, at.x, at.y, fill, { style: { fill, opacity: 1, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 220, delay: k * 35 } }));
      }
      let endX = full ? pos(full - 1).x + w : nameW;
      let endLine = full ? Math.floor((full - 1) / perRow) : 0;
      if (frac > 0.02) {
        const at = pos(full);
        // The remainder: a ghost of the whole icon with the counted part clipped from the left, so the fraction is legible.
        children.push(path(icon, at.x, at.y, mix(t.surface, fill, 0.28)));
        children.push({ type: "group", clipPath: { type: "rect", shape: { x: at.x, y: at.y, width: w * frac, height: h } }, children: [path(icon, at.x, at.y, fill)] });
        endX = at.x + w;
        endLine = Math.floor(full / perRow);
      }
      const dim = ctx.dimmed(r.key);
      if (stacked) {
        children.push({
          type: "text",
          style: { x: 0, y: lane.top - 6, verticalAlign: "bottom", width: ctx.width, overflow: "truncate", text: `{n|${r.key}}${showValues ? `  {v|${valueTexts[i]}}` : ""}`, rich: { n: { fill: dim ? t.inkSecondary : t.ink, fontSize: 13, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily }, v: { fill: t.inkSecondary, fontSize: 13, fontFamily: t.fontFamily } } },
        });
      } else {
        children.push({ type: "text", style: { x: nameW - 16, y: lane.top + h / 2, align: "right", verticalAlign: "middle", width: nameW - 16, overflow: "truncate", text: r.key, fill: dim ? t.inkSecondary : t.ink, fontSize: 13, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily } });
        if (showValues) children.push({ type: "text", style: { x: endX + 10, y: lane.top + endLine * pitchY + h / 2, verticalAlign: "middle", text: valueTexts[i], fill: dim ? t.inkSecondary : t.ink, fontSize: 13, fontWeight: 600, fontFamily: t.fontFamily } });
      }
      return { type: "group", children };
    };

    // The key line is what makes a pictogram honest: it says what one icon is worth.
    const keyIcon = resolveIcon(p.icon);
    const keyText = p.unitLabel ?? `${ctx.fmt(unit)} ${p.value}`;
    const kh = 16;
    const kw = kh * keyIcon.aspect;
    const renderKey = () => ({
      type: "group",
      silent: true,
      children: [
        { type: "path", shape: { pathData: keyIcon.d, x: nameW, y: 0, width: kw, height: kh, layout: "center" }, style: { fill: t.muted } },
        { type: "text", style: { x: nameW + kw + 8, y: kh / 2 + 1, verticalAlign: "middle", text: `= ${keyText}`, fill: t.muted, fontSize: 12, fontFamily: t.fontFamily, width: ctx.width - nameW - kw - 8, overflow: "truncate" } },
      ],
    });

    const hi = rows.reduce((a, r, i) => (r.value > rows[a].value ? i : a), 0);
    const lo = rows.reduce((a, r, i) => (r.value < rows[a].value ? i : a), 0);
    return {
      alt: `Pictogram chart of ${p.value} by ${p.name}; each icon stands for ${keyText}. ${rows.length ? `Largest: ${rows[hi].key} (${valueTexts[hi]}). Smallest: ${rows[lo].key} (${valueTexts[lo]}).` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const r = rows[d.dataIndex];
            return r && d.seriesId === "pictogram" ? tooltipHtml(ctx, r.key, [{ name: p.value, value: valueTexts[d.dataIndex], color: colorOf(r.key) }, { name: "Icons", value: `${Math.round(counts[d.dataIndex] * 10) / 10} × ${keyText}` }]) : "";
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "pictogram",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "icons"],
            encode: { tooltip: [0, 1] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: rows.map((r, i) => ({ name: r.key, value: [r.value, counts[i]] })),
          },
          { id: "key", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderKey as any, data: [0] },
        ],
      },
    };
  },
});

export const examples = {
  "Houses, sorted": {
    data: [
      { decade: "1970s", homes: 3.1 },
      { decade: "1980s", homes: 2.2 },
      { decade: "1990s", homes: 1.6 },
      { decade: "2000s", homes: 1.9 },
      { decade: "2010s", homes: 1.5 },
    ],
    name: "decade",
    value: "homes",
    unit: 0.25,
    unitLabel: "250,000 homes",
    icon: "house",
    format: "{value}m",
    title: "The UK completed 3.1 million homes in the 1970s and 1.5 million in the 2010s",
    subtitle: "New dwellings completed per decade, United Kingdom",
    source: "ONS house building data",
    note: "Rounded for illustration",
  },
  "Shares as drops": {
    data: [
      { use: "Agriculture", litres: 70 },
      { use: "Industry", litres: 19 },
      { use: "Households", litres: 11 },
    ],
    name: "use",
    value: "litres",
    unit: 5,
    unitLabel: "5 of every 100 litres",
    icon: "drop",
    format: "{value}%",
    height: 200,
    title: "Agriculture accounts for 70% of global freshwater withdrawals",
    subtitle: "Share of global freshwater withdrawals by sector",
    source: "FAO AQUASTAT",
    note: "Figures are approximate, for illustration",
  },
  "Stress: many icons wrap, long names": {
    data: [
      { fleet: "Battery electric passenger cars", cars: 28.4 },
      { fleet: "Plug-in hybrids", cars: 12.1 },
      { fleet: "Hydrogen fuel cell", cars: 0.3 },
    ],
    name: "fleet",
    value: "cars",
    unit: 0.5,
    unitLabel: "500,000 cars",
    icon: "car",
    format: "{value}m",
    height: 300,
    title: "There were 28.4 million battery electric cars on the road in 2023",
    subtitle: "Electric cars on the road worldwide, 2023",
    source: "IEA Global EV Outlook 2024",
    note: "Figures are approximate, for illustration",
  },
};
