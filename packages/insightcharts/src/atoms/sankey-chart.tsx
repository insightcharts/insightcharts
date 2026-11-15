import { SankeyChart as ESankey } from "echarts/charts";
import { alpha } from "../core/color";
import { defineChart } from "../core/define";
import { measureText, truncateText } from "../core/layout";
import { tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface SankeyChartProps {
  /** Field naming where each flow starts. Default `"source"`. (Named `from` because `source` is the figure's source line.) */
  from?: string;
  /** Field naming where each flow ends. Default `"target"`. */
  to?: string;
  /** Flow size field. Default `"value"`. */
  value?: string;
  /** `"auto"` and `"horizontal"` flow left to right; `"vertical"` flows top to bottom, which suits narrow columns with short names. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** Print each node's total after its name. Default true. */
  labels?: boolean;
  /** Display names for node keys. */
  names?: Record<string, string>;
}

const MAX_COLOURS = 8;

/**
 * Flows between stages. Node heights and link widths share one scale, every node is
 * named where it sits, and each link is a wash of the colour of the node it leaves.
 */
export const SankeyChart = defineChart<SankeyChartProps>({
  name: "sankey-chart",
  title: "Sankey chart",
  category: "flow",
  description: "Shows how a quantity flows from sources through stages to destinations, with link width proportional to the flow.",
  whenToUse: "Where things come from and where they go: energy from fuel to end use, budget from revenue to spending, users from channel to outcome. Works best with 2 to 4 stages and up to about 20 nodes.",
  avoid: "A single sequence of steps with drop-off (use funnel-chart); comparing a few totals (use bar-chart); flows that loop back (cycles cannot be drawn and are dropped); more than about 40 links.",
  use: [ESankey],
  defaults: { from: "source", to: "target", value: "value", orientation: "auto", labels: true },
  selectField: (p) => p.from,
  // A link selects the node it leaves. A node that nothing leaves is not a `from` value, so clicking it clears.
  selectValue: (params) => (params.dataType === "edge" ? params.data?.source : params.data?.origin ? params.name : null),
  // Many nodes in one column grow the chart instead of thinning every flow to a hairline.
  height: (p, rows) => {
    if (p.orientation === "vertical") return undefined;
    const from = new Set(rows.map((r) => String(r[p.from ?? "source"] ?? "")));
    const to = new Set(rows.map((r) => String(r[p.to ?? "target"] ?? "")));
    const origins = [...from].filter((k) => !to.has(k)).length;
    const ends = [...to].filter((k) => !from.has(k)).length;
    const column = Math.max(origins, ends, [...from].filter((k) => to.has(k)).length);
    return column > 7 ? Math.min(900, column * 48) : undefined;
  },
  props: [
    { name: "from", type: "string", default: '"source"', description: "Field naming where each flow starts. Not called `source` because that is the figure's source line." },
    { name: "to", type: "string", default: '"target"', description: "Field naming where each flow ends." },
    { name: "value", type: "string", default: '"value"', description: "Flow size field. Non-positive flows are dropped." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Left to right, or top to bottom for narrow columns with short names." },
    { name: "labels", type: "boolean", default: "true", description: "Print each node's total after its name." },
    { name: "names", type: "Record<string, string>", description: "Display names for node keys." },
  ],
  example: {
    theme: "noir",
    type: "sankey-chart",
    data: [
      { from: "Coal", to: "Electricity", twh: 290 },
      { from: "Gas", to: "Electricity", twh: 210 },
      { from: "Gas", to: "Heat", twh: 330 },
      { from: "Wind and solar", to: "Electricity", twh: 240 },
      { from: "Nuclear", to: "Electricity", twh: 120 },
      { from: "Oil", to: "Transport", twh: 560 },
      { from: "Oil", to: "Heat", twh: 90 },
      { from: "Electricity", to: "Homes", twh: 280 },
      { from: "Electricity", to: "Industry", twh: 330 },
      { from: "Electricity", to: "Transport", twh: 30 },
      { from: "Electricity", to: "Losses", twh: 220 },
      { from: "Heat", to: "Homes", twh: 270 },
      { from: "Heat", to: "Industry", twh: 150 },
    ],
    from: "from",
    to: "to",
    value: "twh",
    format: "{value} TWh",
    title: "220 TWh of the 860 TWh used to generate electricity was lost",
    subtitle: "Energy flows from fuel to end use, terawatt-hours per year",
    source: "Illustrative national energy balance",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fromField = p.from ?? "source";
    const toField = p.to ?? "target";
    const valueField = p.value ?? "value";
    type Link = { source: string; target: string; value: number };
    const merged = new Map<string, Link>();
    for (const r of ctx.rows) {
      const v = toNumber(r[valueField]);
      const s = String(r[fromField] ?? "");
      const g = String(r[toField] ?? "");
      if (Number.isNaN(v) || v <= 0 || !s || !g || s === g) continue;
      const k = `${s}\u0000${g}`;
      const hit = merged.get(k);
      if (hit) hit.value += v;
      else merged.set(k, { source: s, target: g, value: v });
    }
    // A Sankey is a directed acyclic graph. Drop any link that would close a loop rather than let the layout throw.
    const out = new Map<string, string[]>();
    const reaches = (from: string, to: string, seen = new Set<string>()): boolean => {
      if (from === to) return true;
      if (seen.has(from)) return false;
      seen.add(from);
      return (out.get(from) ?? []).some((n) => reaches(n, to, seen));
    };
    const links: Link[] = [];
    let dropped = 0;
    for (const l of merged.values()) {
      if (reaches(l.target, l.source)) {
        dropped++;
        continue;
      }
      links.push(l);
      out.set(l.source, [...(out.get(l.source) ?? []), l.target]);
    }

    const keys: string[] = [];
    for (const l of links) for (const k of [l.source, l.target]) if (!keys.includes(k)) keys.push(k);
    const inflow = new Map<string, number>();
    const outflow = new Map<string, number>();
    for (const l of links) {
      outflow.set(l.source, (outflow.get(l.source) ?? 0) + l.value);
      inflow.set(l.target, (inflow.get(l.target) ?? 0) + l.value);
    }
    const totalOf = (k: string) => Math.max(inflow.get(k) ?? 0, outflow.get(k) ?? 0);
    const roots = keys.filter((k) => !inflow.has(k));
    const sinks = new Set(keys.filter((k) => !outflow.has(k)));
    const display = (k: string) => p.names?.[k] ?? k;

    // Identity colour for every node when there are few; otherwise only the origins carry colour and the rest stay neutral.
    // A theme with a short palette (poster themes have four or five colours) lowers the limit, so no two nodes share a colour.
    const maxColours = Math.min(MAX_COLOURS, t.categorical.length);
    const few = keys.length <= maxColours;
    const baseOf = (k: string) => {
      const i = few ? keys.indexOf(k) : roots.indexOf(k);
      if (i === -1 || i >= maxColours) return ctx.dimmed(k) ? t.context : ctx.color(k) === t.accent ? t.context : ctx.color(k);
      return ctx.color(k, i);
    };
    // With a selection, the chosen origins and the nodes they feed directly stay saturated.
    const selecting = !ctx.selected("\u0000");
    const lit = (k: string) => !selecting || ctx.selected(k) || links.some((l) => l.target === k && ctx.selected(l.source));
    const colorOf = (k: string) => (lit(k) ? baseOf(k) : alpha(baseOf(k), 0.25));

    const vertical = p.orientation === "vertical";
    const showTotals = p.labels !== false && !(ctx.compact && !vertical);
    const stages = Math.max(2, depth(roots, out));
    const nodeWidth = ctx.compact ? 8 : 12;
    const room = vertical ? ctx.width / Math.max(1, keys.length / stages) : (ctx.width - stages * nodeWidth) / (stages - 1);
    // A label reads into the gap beside its node. Sinks read back into the last gap, so they share it with the column before.
    const level = new Map<string, number>();
    const settle = (k: string, d: number) => {
      if ((level.get(k) ?? -1) >= d) return;
      level.set(k, d);
      for (const n of out.get(k) ?? []) settle(n, d + 1);
    };
    for (const k of roots) settle(k, 0);
    const widthOf = (k: string) => Math.max(40, Math.min(220, sinks.has(k) || (level.get(k) ?? 0) >= stages - 2 ? (room - 20) / 2 : room - 14));
    const grand = roots.reduce((s, k) => s + totalOf(k), 0);
    // In a vertical layout a label can only be as wide as its own node, which is proportional to its total.
    const breadth = (k: string) => (grand ? (totalOf(k) / grand) * (ctx.width - 8) : 0) + 6;

    return {
      alt: `Sankey chart of ${valueField} flowing from ${fromField} to ${toField}: ${keys.length} nodes and ${links.length} flows, ${ctx.fmt(grand)} entering in total. ${[...links].sort((a, b) => b.value - a.value).slice(0, 3).map((l) => `${display(l.source)} to ${display(l.target)}: ${ctx.fmt(l.value)}`).join("; ")}.${dropped ? ` ${dropped} circular flow${dropped > 1 ? "s were" : " was"} left out.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) =>
            d.dataType === "edge"
              ? tooltipHtml(ctx, `${display(d.data.source)} → ${display(d.data.target)}`, [{ name: valueField, value: ctx.fmt(d.data.value), color: baseOf(d.data.source) }, { name: `Share of ${display(d.data.source)}`, value: ctx.formatter({ style: "percent", maximumFractionDigits: 0 })(d.data.value / totalOf(d.data.source)) }])
              : tooltipHtml(ctx, display(d.name), [{ name: "Total", value: ctx.fmt(totalOf(d.name)), color: baseOf(d.name) }, ...(inflow.has(d.name) && outflow.has(d.name) ? [{ name: "In", value: ctx.fmt(inflow.get(d.name)!) }, { name: "Out", value: ctx.fmt(outflow.get(d.name)!) }] : [])]),
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "sankey",
            type: "sankey" as const,
            orient: vertical ? ("vertical" as const) : ("horizontal" as const),
            left: vertical ? 4 : 0,
            right: vertical ? 4 : 0,
            top: vertical ? 40 : 6,
            bottom: vertical ? 40 : 6,
            nodeWidth,
            nodeGap: vertical ? 10 : ctx.compact ? 12 : 16,
            nodeAlign: "justify" as const,
            draggable: false,
            layoutIterations: 32,
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("adjacency" as const), lineStyle: { opacity: 0.55 } },
            blur: { lineStyle: { opacity: 0.06 }, itemStyle: { opacity: 0.25 }, label: { opacity: 0.35 } },
            itemStyle: { borderWidth: 0, borderRadius: 2 },
            lineStyle: { color: "source" as const, opacity: ctx.mode === "dark" ? 0.38 : 0.3, curveness: 0.5 },
            label: {
              show: true,
              fontFamily: t.fontFamily,
              // Names are cut here, against measured widths; a total is dropped before a name is cut,
              // and a name that would shrink to a stub is left to the tooltip.
              formatter: (d: any) => {
                const name = display(d.name);
                const total = ctx.fmt(totalOf(d.name));
                const width = vertical ? breadth(d.name) - 6 : widthOf(d.name);
                const nameW = measureText(name, 12, t.fontFamily, 600);
                if (showTotals && !vertical && nameW + measureText(`  ${total}`, 12, t.fontFamily) <= width) return `{n|${name}}  {v|${total}}`;
                const cut = truncateText(name, width, 12, t.fontFamily, 600);
                if (cut !== name && cut.replace("…", "").length < Math.min(4, name.length)) return "";
                return showTotals && vertical && measureText(total, 12, t.fontFamily) <= width ? `{n|${cut}}\n{v|${total}}` : `{n|${cut}}`;
              },
              rich: { n: { color: t.ink, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, lineHeight: 16 }, v: { color: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily, lineHeight: 16 } },
            },
            data: keys.map((k) => ({
              name: k,
              origin: outflow.has(k),
              itemStyle: { color: colorOf(k) },
              // Labels read inward from the outer columns so nothing is clipped at the edges.
              label: vertical ? { position: sinks.has(k) ? ("bottom" as const) : ("top" as const), align: "center" as const } : { position: sinks.has(k) ? ("left" as const) : ("right" as const) },
            })),
            links: links.map((l) => ({ ...l, lineStyle: ctx.selected(l.source) ? undefined : { opacity: 0.07 } })),
          },
        ],
      },
    };
  },
});

/** Longest path length in nodes, i.e. the number of stages the layout will draw. */
function depth(roots: string[], out: Map<string, string[]>): number {
  const memo = new Map<string, number>();
  const walk = (k: string): number => {
    const hit = memo.get(k);
    if (hit) return hit;
    const d = 1 + Math.max(0, ...(out.get(k) ?? []).map(walk));
    memo.set(k, d);
    return d;
  };
  return Math.max(1, ...roots.map(walk));
}

export const examples = {
  "Two stages, highlight": {
    data: [
      { channel: "Organic search", outcome: "Signed up", users: 4200 },
      { channel: "Organic search", outcome: "Left", users: 9800 },
      { channel: "Paid ads", outcome: "Signed up", users: 1500 },
      { channel: "Paid ads", outcome: "Left", users: 10500 },
      { channel: "Referral", outcome: "Signed up", users: 2600 },
      { channel: "Referral", outcome: "Left", users: 2400 },
    ],
    from: "channel",
    to: "outcome",
    value: "users",
    highlight: "Referral",
    height: 300,
    title: "52% of referred visitors signed up last quarter",
    subtitle: "Visitors by acquisition channel and outcome, last quarter",
    note: "Illustrative data",
  },
  "Vertical": {
    theme: "ocean",
    data: [
      { from: "Taxes", to: "Budget", bn: 820 },
      { from: "Borrowing", to: "Budget", bn: 130 },
      { from: "Other", to: "Budget", bn: 90 },
      { from: "Budget", to: "Health", bn: 250 },
      { from: "Budget", to: "Welfare", bn: 310 },
      { from: "Budget", to: "Schools", bn: 120 },
      { from: "Budget", to: "Defence", bn: 60 },
      { from: "Budget", to: "Interest", bn: 110 },
      { from: "Budget", to: "Rest", bn: 190 },
    ],
    from: "from",
    to: "to",
    value: "bn",
    format: "£{value}bn",
    orientation: "vertical",
    title: "Borrowing funded £130bn of the £1,040bn budget",
    subtitle: "Government revenue by source and spending by area, £ billion",
    note: "Illustrative data",
  },
  "Stress: four stages, many nodes, long names, a loop": {
    theme: "ledger",
    data: [
      ["Domestic crude oil production", "Refineries", 410],
      ["Imported crude oil", "Refineries", 620],
      ["Natural gas fields", "Gas processing plants", 540],
      ["Imported liquefied natural gas", "Gas processing plants", 180],
      ["Coal mines", "Power stations", 260],
      ["Wind farms", "Power stations", 150],
      ["Solar parks", "Power stations", 90],
      ["Hydroelectric dams", "Power stations", 70],
      ["Nuclear reactors", "Power stations", 210],
      ["Refineries", "Road transport", 610],
      ["Refineries", "Aviation and shipping", 240],
      ["Refineries", "Petrochemicals", 180],
      ["Gas processing plants", "Power stations", 280],
      ["Gas processing plants", "Residential heating", 290],
      ["Gas processing plants", "Heavy industry", 150],
      ["Power stations", "Residential heating", 180],
      ["Power stations", "Heavy industry", 260],
      ["Power stations", "Commercial buildings", 220],
      ["Power stations", "Conversion and transmission losses", 400],
      ["Heavy industry", "Exported manufactured goods", 190],
      ["Heavy industry", "Domestic consumption", 220],
      ["Petrochemicals", "Exported manufactured goods", 80],
      ["Petrochemicals", "Domestic consumption", 100],
      ["Domestic consumption", "Refineries", 5],
    ].map(([from, to, pj]) => ({ from, to, pj })),
    from: "from",
    to: "to",
    value: "pj",
    format: "{value} PJ",
    height: 520,
    title: "Power stations lost 400 PJ of the 1,060 PJ they took in",
    subtitle: "National energy balance from primary supply to final use, petajoules",
    note: "Illustrative data. One circular flow in the data is left out",
  },
};
