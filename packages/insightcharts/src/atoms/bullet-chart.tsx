import { CustomChart as ECustom } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { measureText } from "../core/layout";
import type { LegendItem } from "../core/figure";
import type { FormatSpec } from "../core/format";
import { hiddenAxis, morph, tooltipHtml, valueAxis } from "../core/parts";
import { toNumber } from "../data/transform";

export interface BulletChartProps {
  /** Field naming each row (one measure per row). */
  category: string;
  /** Field with the measured value. */
  value: string;
  /** Field with the target, drawn as a tick across the bar. */
  target?: string;
  /**
   * Upper bounds of the qualitative bands, ascending (`[50, 75, 100]`), or the names of fields
   * holding them per row. Only pass real thresholds; without them no bands are drawn.
   */
  bands?: number[] | string[];
  /** Names of the bands, lowest first (`["Poor", "Fair", "Good"]`), for the legend and tooltip. */
  bandNames?: string[];
  /** End of the scale: a number, or a field holding it per row. Default: just past the largest of value, target and bands. */
  max?: number | string;
  /** `"shared"`: one axis for all rows. `"independent"`: each row fills its own scale, for measures in different units. */
  scale?: "shared" | "independent";
  /** Field holding a format spec per row (`"currency:USD"`, `"{value}%"`), for measures in different units. */
  formatField?: string;
  /** Display names for the value and target fields. */
  names?: Record<string, string>;
}

interface Item {
  name: string;
  v: number;
  target: number | null;
  bands: number[];
  max: number;
  fmt: (v: unknown) => string;
}

/**
 * Stephen Few's bullet graph: a bar for the measure, a tick for the target and, when the
 * thresholds are real, grey bands for the qualitative ranges. It replaces a gauge in a
 * fraction of the space and stacks into a compact scorecard.
 */
export const BulletChart = defineChart<BulletChartProps>({
  name: "bullet-chart",
  title: "Bullet chart",
  category: "comparison",
  description: "Compares one measure per row with its target, optionally against qualitative bands such as poor / fair / good.",
  whenToUse: "Progress against a target or budget for one to about 10 measures, including measures in different units (`scale: \"independent\"`); a compact scorecard instead of a row of gauges.",
  avoid: "No target or thresholds to compare with (use bar-chart); a single share of a whole (use progress-meter); change over time (use line-chart).",
  use: [ECustom],
  defaults: { scale: "shared" },
  selectField: (p) => p.category,
  // One row per measure: a long scorecard grows, a short one stays compact.
  height: (p, rows) => Math.max(96, rows.length * 46 + (p.scale === "independent" ? 4 : 28)),
  props: [
    { name: "category", type: "string", required: true, description: "Field naming each row." },
    { name: "value", type: "string", required: true, description: "Field with the measured value. Values below zero are not supported." },
    { name: "target", type: "string", description: "Field with the target, drawn as a tick across the bar." },
    { name: "bands", type: "number[] | string[]", description: "Ascending upper bounds of qualitative bands, or the fields holding them per row. Omit unless the thresholds are real." },
    { name: "bandNames", type: "string[]", description: "Band names, lowest first, for the legend and tooltip." },
    { name: "max", type: "number | string", description: "End of the scale: a number or a per-row field. Default: just past the largest value, target or band." },
    { name: "scale", type: '"shared" | "independent"', default: '"shared"', description: "One axis for all rows, or each row on its own scale (different units)." },
    { name: "formatField", type: "string", description: "Field holding a format spec per row, for mixed units." },
    { name: "names", type: "Record<string, string>", description: "Display names for the value and target fields." },
  ],
  example: {
    type: "bullet-chart",
    data: [
      { region: "North America", sales: 94, target: 80 },
      { region: "Europe", sales: 71, target: 85 },
      { region: "Asia Pacific", sales: 63, target: 60 },
      { region: "Latin America", sales: 38, target: 55 },
    ],
    category: "region",
    value: "sales",
    target: "target",
    bands: [50, 75, 110],
    bandNames: ["Below plan", "On plan", "Stretch"],
    names: { sales: "Sales", target: "Target" },
    format: "currency:USD",
    height: 240,
    title: "Europe sold $71 million against a target of $85 million in 2024",
    subtitle: "Sales against target by region, $ millions, 2024",
    source: "Company accounts",
    note: "Illustrative figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const tw = (s: string, size = t.fontSize, weight = 400) => measureText(s, size, t.fontFamily, weight);
    const independent = p.scale === "independent";
    const num = (v: unknown) => {
      const n = toNumber(v);
      return Number.isNaN(n) ? null : n;
    };
    const items: Item[] = [];
    for (const r of ctx.rows) {
      const v = num(r[p.value]);
      if (v == null) continue;
      const target = p.target ? num(r[p.target]) : null;
      const bands = (p.bands ?? []).map((b) => (typeof b === "number" ? b : num(r[b]))).filter((b): b is number => b != null).sort((a, b) => a - b);
      const given = typeof p.max === "number" ? p.max : p.max ? num(r[p.max]) : null;
      const top = Math.max(v, target ?? 0, ...bands);
      const spec = p.formatField ? (r[p.formatField] as FormatSpec | undefined) : undefined;
      items.push({ name: String(r[p.category]), v, target, bands, max: (given ?? (bands.length && bands[bands.length - 1] >= top ? top : top * 1.08)) || 1, fmt: spec ? ctx.formatter(spec) : ctx.fmt });
    }
    const sharedMax = Math.max(1, ...items.map((d) => d.max));
    const hasBands = items.some((d) => d.bands.length > 0);
    const bandCount = Math.max(0, ...items.map((d) => d.bands.length));
    const valueName = p.names?.[p.value] ?? p.value;
    const targetName = p.target ? p.names?.[p.target] ?? p.target : "Target";

    // Everything, labels included, is drawn by the custom series inside a rectangle fixed in pixels.
    const stacked = ctx.compact;
    const valueText = (d: Item) => d.fmt(d.v);
    const targetText = (d: Item) => (d.target == null ? "" : `/ ${d.fmt(d.target)}`);
    const labelW = stacked ? 0 : Math.min(Math.round(ctx.width * 0.3), Math.max(0, ...items.map((d) => Math.ceil(tw(d.name)) + 4))) + 14;
    const valueW = stacked ? 0 : Math.max(0, ...items.map((d) => tw(valueText(d), t.fontSize + 1, 600) + (targetText(d) ? tw(targetText(d)) + 5 : 0))) + 14;
    const axisH = independent ? 0 : 24;
    const rowH = Math.max(24, (ctx.height - axisH - 4) / Math.max(1, items.length));
    const thick = Math.max(10, Math.min(24, stacked ? rowH - 30 : rowH * 0.5));
    const bandFill = (k: number, of: number) => alpha(t.ink, of <= 1 ? 0.1 : 0.24 - (0.17 * k) / (of - 1));
    const bandOf = (d: Item) => d.bands.findIndex((b) => d.v <= b);

    const rows = {
      id: "bullets",
      name: valueName,
      type: "custom" as const,
      ...morph,
      dimensions: [p.value, p.category, p.target ?? "target"],
      encode: { x: 0, y: 1, tooltip: [0, 2] },
      data: items.map((d) => ({ name: d.name, value: [independent ? d.v / d.max : d.v, d.name, d.target] })),
      renderItem: (params: any, api: any) => {
        const d = items[params.dataIndex];
        if (!d) return null;
        const k = independent ? 1 / d.max : 1;
        const x = (v: number) => api.coord([Math.max(0, v) * k, d.name])[0];
        const mid = api.coord([0, d.name])[1];
        const framed = d.bands.length > 0 || independent;
        const bar = framed ? Math.max(6, Math.round(thick * 0.36)) : Math.min(thick, stacked ? 12 : 16);
        // Tallest thing in the row: the band, or the target tick when there is no band.
        const th = framed ? thick * 0.78 : bar + (stacked ? 6 : 10);
        const half = (framed ? thick : th) / 2;
        const cy = stacked ? mid + 9 : mid;
        const x0 = x(0);
        const dim = ctx.dimmed(d.name);
        const fade = ctx.selected(d.name) ? 1 : 0.3;
        const children: any[] = [];
        // Bands, or in independent mode a single neutral track so the row has a visible extent.
        let from = 0;
        d.bands.forEach((b, i) => {
          const to = Math.min(b, d.max);
          if (to > from) children.push({ type: "rect", shape: { x: x(from), y: cy - thick / 2, width: Math.max(0, x(to) - x(from) - (i < d.bands.length - 1 ? 1 : 0)), height: thick }, style: { fill: bandFill(i, d.bands.length), opacity: fade } });
          from = Math.max(from, to);
        });
        if (!d.bands.length && independent) children.push({ type: "rect", shape: { x: x0, y: cy - thick / 2, width: x(d.max) - x0, height: thick }, style: { fill: alpha(t.ink, 0.08), opacity: fade } });
        const w = Math.max(1, x(Math.min(d.v, independent ? d.max : sharedMax)) - x0);
        const r = Math.min(t.radius, bar / 2, w);
        children.push({ type: "rect", shape: { x: x0, y: cy - bar / 2, width: w, height: bar, r: [0, r, r, 0] }, style: { fill: dim ? t.context : ctx.color(d.name), opacity: fade } });
        if (d.target != null) {
          const tx = x(d.target);
          // A surface-coloured halo keeps the tick visible where it crosses the bar.
          children.push({ type: "rect", shape: { x: tx - 2.5, y: cy - th / 2 - 1, width: 5, height: th + 2 }, style: { fill: t.surface, opacity: fade } });
          children.push({ type: "rect", shape: { x: tx - 1.25, y: cy - th / 2, width: 2.5, height: th }, style: { fill: dim ? t.muted : t.ink, opacity: fade } });
        }
        const cs = params.coordSys;
        const ty = stacked ? cy - half - 11 : cy;
        children.push({
          type: "text",
          x: stacked ? cs.x : cs.x - 12,
          y: ty,
          style: { text: d.name, fill: dim ? t.muted : t.inkSecondary, opacity: fade, fontFamily: t.fontFamily, fontSize: t.fontSize, align: stacked ? "left" : "right", verticalAlign: "middle", width: stacked ? cs.width * 0.58 : labelW - 14, overflow: "truncate" },
        });
        children.push({
          type: "text",
          x: stacked ? cs.x + cs.width : cs.x + cs.width + valueW,
          y: ty,
          style: {
            text: `{v|${valueText(d)}}${targetText(d) ? ` {t|${targetText(d)}}` : ""}`,
            rich: { v: { fill: dim ? t.muted : t.ink, fontWeight: 600, fontFamily: t.fontFamily, fontSize: t.fontSize + 1 }, t: { fill: t.muted, fontFamily: t.fontFamily, fontSize: t.fontSize } },
            opacity: fade,
            align: "right",
            verticalAlign: "middle",
          },
        });
        return { type: "group", children };
      },
    };

    const legend: LegendItem[] = [{ name: valueName, color: t.accent }];
    if (p.target) legend.push({ name: targetName, color: t.ink, shape: "line" });
    if (hasBands && p.bandNames?.length) p.bandNames.slice(0, bandCount).forEach((name, i) => legend.push({ name, color: bandFill(i, bandCount) }));

    const withTarget = items.filter((d) => d.target != null);
    const met = withTarget.filter((d) => d.v >= d.target!);
    const describe = (d: Item) => `${d.name}: ${d.fmt(d.v)}${d.target != null ? ` against a target of ${d.fmt(d.target)}` : ""}`;

    return {
      legend,
      alt: `Bullet chart of ${valueName}${p.target ? ` against ${targetName}` : ""} for ${items.length} ${p.category} values.${withTarget.length ? ` ${met.length} of ${withTarget.length} meet the target.` : ""} ${items.slice(0, 6).map(describe).join("; ")}.`,
      option: {
        grid: { left: stacked ? 2 : labelW, right: stacked ? 2 : valueW + 2, top: 2, bottom: axisH + 2, outerBoundsMode: "none" },
        xAxis: independent ? hiddenAxis("value", { min: 0, max: 1 }) : valueAxis(ctx, { min: 0, max: sharedMax, splitLine: { show: !hasBands && !stacked }, axisLabel: { formatter: (v: number) => ctx.fmt(v), hideOverlap: true, showMaxLabel: false, alignMinLabel: stacked ? "left" : undefined } }),
        yAxis: hiddenAxis("category", { data: items.map((d) => d.name), inverse: true }),
        tooltip: {
          trigger: "item",
          formatter: (e: any) => {
            const d = items[e.dataIndex];
            if (!d) return "";
            const b = bandOf(d);
            return tooltipHtml(ctx, d.name, [
              { name: valueName, value: d.fmt(d.v), color: ctx.color(d.name) },
              ...(d.target != null ? [{ name: targetName, value: d.fmt(d.target) }, { name: "Difference", value: (d.v - d.target > 0 ? "+" : "") + d.fmt(d.v - d.target) }] : []),
              ...(b >= 0 && p.bandNames?.[b] ? [{ name: "Band", value: p.bandNames[b] }] : []),
            ]);
          },
        },
        series: [rows] as any[],
      },
    };
  },
});

export const examples = {
  "Scorecard with a separate scale per row": {
    data: [
      { kpi: "Revenue", actual: 4.6, goal: 5.0, low: 3.5, mid: 4.5, high: 6.0, unit: "${value}m" },
      { kpi: "Gross margin", actual: 41, goal: 38, low: 25, mid: 35, high: 50, unit: "{value}%" },
      { kpi: "New customers", actual: 1320, goal: 1500, low: 900, mid: 1300, high: 1800, unit: "integer" },
      { kpi: "Customer satisfaction", actual: 4.4, goal: 4.5, low: 3.5, mid: 4.2, high: 5.0, unit: "decimal:1" },
      { kpi: "Average order value", actual: 58, goal: 52, low: 40, mid: 50, high: 65, unit: "currency:EUR" },
    ],
    category: "kpi",
    value: "actual",
    target: "goal",
    bands: ["low", "mid", "high"],
    bandNames: ["Poor", "Acceptable", "Good"],
    scale: "independent",
    formatField: "unit",
    names: { actual: "Actual", goal: "Target" },
    height: 300,
    title: "Third-quarter revenue was $4.6 million against a target of $5.0 million",
    subtitle: "Third-quarter results against target",
    note: "Illustrative figures.",
  },
  "No thresholds, one row highlighted": {
    data: [
      { team: "Payments", done: 86, plan: 80 },
      { team: "Search", done: 74, plan: 80 },
      { team: "Onboarding", done: 52, plan: 80 },
      { team: "Mobile", done: 91, plan: 80 },
      { team: "Data platform", done: 79, plan: 80 },
    ],
    category: "team",
    value: "done",
    target: "plan",
    highlight: "Onboarding",
    names: { done: "Delivered", plan: "Committed" },
    format: "{value}%",
    height: 260,
    title: "Onboarding delivered 52% of its quarterly roadmap",
    subtitle: "Share of quarterly roadmap delivered, by team. The tick marks the 80% commitment.",
    note: "Illustrative figures.",
  },
  "Stress: 10 rows with long labels": {
    data: [
      ["Percentage of emergency patients seen within four hours", 71, 95], ["Ambulance response to life-threatening calls within target", 64, 90], ["Cancer patients starting treatment within 62 days of referral", 62, 85], ["Planned operations within 18 weeks", 58, 92], ["Diagnostic tests within six weeks", 76, 99],
      ["GP appointments within two weeks", 83, 85], ["Mental health referrals seen within four weeks", 69, 75], ["Beds occupied by patients fit for discharge (inverted)", 88, 95], ["Staff vacancies filled", 91, 95], ["Childhood immunisation coverage", 92, 95],
    ].map(([measure, actual, standard]) => ({ measure, actual, standard })),
    category: "measure",
    value: "actual",
    target: "standard",
    max: 100,
    names: { actual: "Performance", standard: "Standard" },
    format: "{value}%",
    height: 440,
    title: "The health service missed all 10 national standards in the latest month",
    subtitle: "Performance against the national standard, % of cases",
    note: "Illustrative figures.",
  },
};
