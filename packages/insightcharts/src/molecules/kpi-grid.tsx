import type { FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import type { DataInput, Transform } from "../data/types";
import type { CSSProperties } from "react";
import { frameStyle } from "../core/provider";
import type { StatTileProps, StatTileSurface, StatTileTone, StatTileVariant } from "../atoms/stat-tile";
import { TrendCard } from "./trend-card";
import { dataState, MoleculeFooter, MoleculeHeader, Provide, useMolecule, useRows, type MoleculeProps } from "./_shared";

export interface KpiMetric extends Partial<Pick<StatTileProps, "size" | "align" | "orientation" | "edge" | "icon" | "target" | "targetLabel" | "max" | "parts" | "rank" | "rankOf" | "unitValue">> {
  /** This card's display, overriding the grid's `variant` and `variants`. Any `stat-tile` variant. */
  variant?: StatTileVariant;
  /** This card's ground, overriding the grid's. */
  surface?: StatTileSurface;
  /** This card's tone, overriding the grid's. */
  tone?: StatTileTone;
  /** Set false to leave the trend line off a variant that does not draw the series itself. */
  showTrend?: boolean;
  /** Value field for this metric. */
  y: string;
  /** What it measures, sentence case. */
  label: string;
  format?: FormatSpec;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Overrides the grid's `compare`. */
  compare?: "first" | "previous" | number;
  /** Overrides the grid's `change`. */
  change?: "percent" | "absolute";
  /** Format for this metric's absolute change, e.g. `"{value} pp"`. Overrides the grid's `deltaFormat`. */
  deltaFormat?: FormatSpec;
  deltaLabel?: string;
  context?: string;
  /** Override the computed figure. */
  value?: number | string;
  /** Override the computed change. */
  delta?: number | string;
  kind?: "line" | "bar";
}

export interface KpiGridProps extends MoleculeProps {
  /** One dataset in time order, one row per period, one column per metric. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Period field shared by every metric. */
  x?: string;
  /** One card per metric. */
  metrics: KpiMetric[];
  /** Baseline for every card's change. */
  compare?: "first" | "previous" | number;
  change?: "percent" | "absolute";
  /** Format for absolute changes. Default: percentage points for percentage metrics, otherwise each metric's own format. */
  deltaFormat?: FormatSpec;
  /** Preferred columns. Default: up to four, fewer when the container is narrow. */
  columns?: number;
  /** The display of every card: any `stat-tile` variant. Omit for the original cards with an interactive sparkline. */
  variant?: StatTileVariant;
  /** A display per card, by position, so one grid can mix them. A metric's own `variant` wins; cards past the end use `variant`. */
  variants?: StatTileVariant[];
  /** The ground of every card. */
  surface?: StatTileSurface;
  /** Tone of every card. `"series"` gives each card the next categorical colour. */
  tone?: StatTileTone | "series";
  /** `"cards"` (default) separates cards with a gap, `"dividers"` sets them open with hairlines between. */
  layout?: "cards" | "dividers";
  /** The first card spans two columns and is set one size larger. */
  featured?: boolean;
  /** Spacing and type scale: `"dense"` for many small cards, `"roomy"` for a page opener. */
  density?: "dense" | "default" | "roomy";
  /** Paint a named theme's own background behind the grid. Default true when `theme` is a theme name. */
  frame?: boolean;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * A grid of trend cards that share one dataset: load the series once, name the columns,
 * and every card derives its figure, change and sparkline from the same rows.
 */
function KpiGridImpl({ data, transform, x, metrics, compare = "first", change = "percent", deltaFormat, columns, variant, variants, surface, tone, layout = "cards", featured = false, density = "default", frame, title, subtitle, source, note, className, style, ...rest }: KpiGridProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const state = useRows(data, transform);
  const list = metrics ?? [];
  const n = list.length;
  const painter = frameStyle(rest.theme, mode, frame);
  const inner = Math.max(0, width - (painter ? 40 : 0));
  const dividers = layout === "dividers";
  const gap = dividers ? 0 : density === "dense" ? 8 : density === "roomy" ? 16 : 12;
  const size = density === "dense" ? "sm" : density === "roomy" ? "lg" : "md";
  const kinds = list.map((m, i) => m.variant ?? variants?.[i] ?? variant);
  const lead = featured && n > 1;
  // The featured card has two columns to itself, so it does not set the minimum.
  const wide = kinds.some((k, i) => !(lead && i === 0) && (k === "compact" || k === "split"));
  const min = wide ? 260 : density === "dense" ? 160 : 200;
  const units = n + (lead ? 1 : 0);
  const fit = Math.max(1, Math.floor((inner + gap) / (min + gap)));
  let cols = Math.max(1, Math.min(columns ?? (units <= 4 ? units : units <= 6 ? 3 : 4), fit, units));
  // Never leave a single card alone in the last row.
  while (cols > 2 && units % cols === 1) cols -= 1;

  // Each card's column, row and span, so dividers know which edges are inside the grid.
  const cells: { col: number; row: number; span: number }[] = [];
  let col = 0;
  let row = 0;
  for (let i = 0; i < n; i++) {
    const span = lead && i === 0 ? Math.min(2, cols) : 1;
    if (col + span > cols) {
      col = 0;
      row += 1;
    }
    cells.push({ col, row, span });
    col += span;
  }
  const rows = row + 1;
  // A card left alone in the last row takes the whole row.
  if (lead && cols > 1 && n > 1 && cells[n - 1].col === 0) cells[n - 1].span = cols;
  const pad = density === "dense" ? 12 : inner < 480 ? 16 : density === "roomy" ? 28 : 20;
  const placeholder = dataState(state, 132);
  return (
    <div ref={ref} data-slot="ic-kpi-grid" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        {placeholder ?? (
          <div data-slot="ic-kpi-grid-items" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
            {list.map((m, i) => {
              const cell = cells[i];
              const first = lead && i === 0;
              const box: CSSProperties = { minWidth: 0, display: "grid", gridColumn: cell.span > 1 ? `span ${cell.span}` : undefined };
              if (dividers)
                Object.assign(box, {
                  paddingLeft: cell.col > 0 ? pad : 0,
                  paddingRight: cell.col + cell.span < cols ? pad : 0,
                  paddingTop: cell.row > 0 ? pad : 0,
                  paddingBottom: cell.row < rows - 1 ? pad : 0,
                  borderLeft: cell.col > 0 ? "1px solid var(--_ic-grid)" : undefined,
                  borderTop: cell.row > 0 ? "1px solid var(--_ic-grid)" : undefined,
                });
              const kind = kinds[i] ?? (dividers || surface || tone != null || density !== "default" || first ? "sparkline" : undefined);
              return (
                <div key={m.y + m.label} role="listitem" data-slot="ic-kpi-grid-item" data-featured={first || undefined} style={box}>
                  <TrendCard data={state.rows} x={x} compare={compare} change={change} deltaFormat={deltaFormat} {...m} variant={kind} surface={m.surface ?? surface ?? (dividers ? "borderless" : undefined)} tone={m.tone ?? (tone === "series" ? i : tone)} size={m.size ?? (first ? (size === "sm" ? "md" : "lg") : kind ? size : undefined)} />
                </div>
              );
            })}
          </div>
        )}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const month = (i: number) => new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10);
const saas = [
  [38.1, 412, 4.2, 4.1],
  [39.4, 428, 4.0, 3.9],
  [39.0, 431, 3.9, 3.8],
  [40.8, 455, 3.6, 3.2],
  [42.2, 470, 3.1, 3.4],
  [41.9, 476, 2.9, 2.9],
  [43.5, 498, 2.6, 2.7],
  [44.1, 511, 2.4, 2.6],
  [44.5, 524, 2.3, 2.4],
  [46.0, 548, 2.2, 2.3],
  [47.2, 566, 2.1, 2.2],
  [48.2, 589, 2.1, 2.2],
].map(([users, mrr, churn, response], i) => ({ month: month(i), users: users * 1000, mrr: mrr * 1000, churn, response }));

export const KpiGrid = withMeta(KpiGridImpl, {
  name: "kpi-grid",
  component: "KpiGrid",
  title: "KPI grid",
  level: "molecule",
  category: "layout",
  description: "A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a graphic, in one `stat-tile` variant or a deliberate mix of them.",
  whenToUse: "The top of a dashboard or a monthly report: three to eight metrics tracked over the same periods. Pass one table with a column per metric.",
  avoid: "Figures without a series behind them (use `stat-row`); comparing the metrics with each other on one scale (use `line-chart` or `small-multiples`); more than eight cards.",
  composes: ["trend-card", "stat-tile"],
  props: [
    { name: "data", type: "DataInput", description: "One dataset in time order: a row per period, a column per metric. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied once, before the cards read the rows." },
    { name: "x", type: "string", description: "Period field shared by every metric." },
    { name: "metrics", type: "{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind?, variant?, surface?, tone?, size?, align?, orientation?, icon?, target?, targetLabel?, max?, parts?, rank?, rankOf?, unitValue?, showTrend? }[]", required: true, description: "One card per metric; each takes the props of `trend-card`, including its own `variant`, `surface`, `tone` and `size`." },
    { name: "variant", type: "StatTileVariant", description: "The display of every card: any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `split`, `compact`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `breakdown`, `rank`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`). Omit for the original cards with an interactive sparkline." },
    { name: "variants", type: "StatTileVariant[]", description: "A display per card, by position, so one grid mixes them on purpose: `[\"split\", \"area\", \"bars\", \"progress\"]`. A metric's own `variant` wins; cards past the end use `variant`." },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "The ground of every card." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number | "series"', description: "Tone of every card. `series` gives each card the next categorical colour." },
    { name: "layout", type: '"cards" | "dividers"', default: '"cards"', description: "Separate cards, or open tiles with hairlines between them." },
    { name: "featured", type: "boolean", default: "false", description: "The first card spans two columns and is set one size larger." },
    { name: "density", type: '"dense" | "default" | "roomy"', default: '"default"', description: "Spacing and type scale: cards are `sm`, `md` or `lg`, with 8, 12 or 16px between them." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "compare", type: '"first" | "previous" | number', default: '"first"', description: "Baseline for every card's change; a metric can override it." },
    { name: "change", type: '"percent" | "absolute"', default: '"percent"', description: "Relative change, or the difference between the two values; a metric can override it. An absolute change of a percentage metric is shown in percentage points (\"−2.1 pts\")." },
    { name: "deltaFormat", type: "FormatSpec", description: 'Format for absolute changes, e.g. `"{value} pp"` or `"signed"`; a metric can override it. Default: points for percentage formats, otherwise the metric\'s own `format`.' },
    { name: "columns", type: "number", description: "Preferred columns. Default: up to four, reduced to fit cards of at least 200px." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Population and period." },
    { name: "source", type: "string", description: 'Shown under the grid as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides, passed on to every card. A named theme paints its own ground.' },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "kpi-grid",
    title: "Monthly active users rose from 38,100 to 48,200 in 2024",
    subtitle: "Four product metrics by month, 2024. Change is measured against January.",
    data: saas,
    x: "month",
    metrics: [
      { y: "users", label: "Monthly active users", format: "compact" },
      { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
      { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false },
      { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
    ],
    source: "Internal analytics",
    note: "Illustrative data",
  },
});

const growth = [21.4, 23.9, 25.1, 28.8, 31.6, 33.2, 36.9, 39.8, 44.5, 45.3, 46.9, 48.21];
// The same twelve months for every example below; users follow the faster series used by stat-tile.
const product = saas.map((r, i) => ({ ...r, users: Math.round(growth[i] * 1000), nps: 31 + Math.round(i * 1.4), tickets: 1840 - i * 62 }));
const four: KpiMetric[] = [
  { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
  { y: "mrr", label: "Recurring revenue", format: "currency:USD", icon: "banknote", target: 600000 },
  { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false, icon: "heart" },
  { y: "response", label: "Median first response", format: "{value} h", upIsGood: false, icon: "clock" },
];
const energy = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), solar: [1.9, 2.4, 2.9, 3.6, 4.4, 5.6, 7.1, 9.2][i], wind: [5.6, 6.1, 6.9, 7.8, 8.4, 9.3, 10.1, 10.9][i], coal: [38.2, 37.9, 36.4, 35.1, 36.0, 35.6, 34.9, 33.8][i], gas: [22.9, 23.0, 23.5, 23.4, 22.8, 22.2, 22.4, 22.1][i] }));
const club = [5, 10, 15, 20, 25, 30].map((m, i) => ({ matchday: `matchday ${m}`, points: [9, 19, 28, 40, 49, 61][i], scored: [10, 22, 31, 45, 55, 68][i], conceded: [7, 12, 18, 22, 27, 31][i], attendance: [38900, 39600, 40100, 40800, 41000, 41200][i] }));

export const examples = {
  "Area cards, one colour per metric": { title: "Recurring revenue rose from $412,000 to $589,000 in 2024", data: product, x: "month", variant: "area", tone: "series", metrics: four, note: "Illustrative data" },
  "Featured split card with a mix of displays, ledger": {
    theme: "ledger",
    title: "Monthly active users rose from 21,400 to 48,210 in 2024",
    subtitle: "Five product metrics by month, 2024. Change is measured against January.",
    data: product,
    x: "month",
    featured: true,
    columns: 3,
    variants: ["split", "progress", "bars", "dots", "area"],
    metrics: [{ ...four[0], surface: "filled" }, { ...four[1], targetLabel: "Plan" }, four[2], four[3], { y: "nps", label: "Net promoter score", change: "absolute" }],
    note: "Illustrative data",
  },
  "Dividers instead of cards, editorial": { theme: "editorial", title: "Solar supplied 9.2% of electricity in 2024", subtitle: "Share of generation by source, 2017 to 2024, with the change since 2017", data: energy, x: "year", layout: "dividers", variant: "sparkline", change: "absolute", deltaFormat: "{value} pts", metrics: [{ y: "solar", label: "Solar", format: "{value}%" }, { y: "wind", label: "Wind", format: "{value}%", tone: 1 }, { y: "gas", label: "Gas", format: "{value}%", tone: "neutral", upIsGood: false }, { y: "coal", label: "Coal", format: "{value}%", tone: "neutral", upIsGood: false }], note: "Illustrative data" },
  "Dense compact rows in two columns, mono": {
    theme: "mono",
    data: product,
    x: "month",
    variant: "compact",
    density: "dense",
    columns: 2,
    compare: "previous",
    metrics: [...four, { y: "nps", label: "Net promoter score", change: "absolute" }, { y: "tickets", label: "Support tickets", upIsGood: false }],
    note: "Illustrative data",
  },
  "Icons on tinted cards, earth": { theme: "earth", data: product, x: "month", variant: "icon", surface: "tinted", tone: "series", metrics: four, note: "Illustrative data" },
  "Filled cards, roomy, poster": { theme: "poster", data: product, x: "month", variant: "filled", tone: "series", density: "roomy", columns: 2, metrics: four, note: "Illustrative data" },
  "Progress toward targets, science": {
    theme: "science",
    title: "Measles vaccination coverage reached 91% in 2024",
    subtitle: "Coverage by vaccine, 2019 to 2024, against the WHO target",
    data: [2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), measles: [0.9, 0.87, 0.86, 0.88, 0.9, 0.91][i], polio: [0.93, 0.91, 0.9, 0.91, 0.92, 0.93][i], hpv: [0.52, 0.5, 0.55, 0.58, 0.61, 0.64][i] })),
    x: "year",
    variant: "progress",
    change: "absolute",
    tone: "series",
    metrics: [
      { y: "measles", label: "Measles, first dose", format: "percent", target: 0.95, max: 1 },
      { y: "polio", label: "Polio, third dose", format: "percent", target: 0.95, max: 1 },
      { y: "hpv", label: "HPV, girls aged 15", format: "percent", target: 0.9, max: 1 },
    ],
    note: "Illustrative data",
  },
  "Change first, noir": {
    theme: "noir",
    title: "The club had 61 points after 30 matches",
    subtitle: "Season totals after each block of five matches. Change is against matchday 25.",
    data: club,
    x: "matchday",
    compare: "previous",
    variant: "delta-first",
    layout: "dividers",
    metrics: [
      { y: "points", label: "Points" },
      { y: "scored", label: "Goals scored", tone: 1 },
      { y: "conceded", label: "Goals conceded", upIsGood: false, tone: 2 },
      { y: "attendance", label: "Average attendance", format: "integer", tone: 1 },
    ],
    note: "Illustrative data",
  },
  "Comparison with the first week, sunrise": {
    theme: "sunrise",
    data: [44, 45, 46, 47, 48, 49, 50].map((w, i) => ({ week: `Week ${w}`, visits: [15400, 15900, 16200, 16000, 17100, 17800, 18640][i], orders: [5010, 5180, 5260, 5230, 5640, 5890, 6120][i], basket: [41.2, 41.6, 41.9, 42.4, 42.0, 42.3, 42.6][i] })),
    x: "week",
    variant: "comparison",
    metrics: [
      { y: "visits", label: "Store visits", format: "integer" },
      { y: "orders", label: "Orders", format: "integer" },
      { y: "basket", label: "Average basket", format: "currency:EUR" },
    ],
    note: "Illustrative data",
  },
  "Bars on a poster ground, blueprint": {
    theme: "blueprint",
    data: [212, 240, 198, 265, 281, 254, 302, 318].map((units, i) => ({ week: `week ${i + 1}`, units, scrap: [31, 28, 33, 24, 22, 25, 19, 17][i], overtime: [46, 52, 40, 58, 61, 49, 66, 70][i] })),
    x: "week",
    variant: "bars",
    metrics: [
      { y: "units", label: "Units assembled per shift" },
      { y: "scrap", label: "Units scrapped per shift", upIsGood: false },
      { y: "overtime", label: "Overtime hours per week", upIsGood: false },
    ],
    note: "Illustrative data",
  },
  "Outline rule with dots, six metrics, paper": {
    theme: "paper",
    data: product,
    x: "month",
    variant: "dots",
    surface: "outline-accent",
    columns: 3,
    metrics: [...four, { y: "nps", label: "Net promoter score", change: "absolute" }, { y: "tickets", label: "Support tickets", upIsGood: false }],
    note: "Illustrative data",
  },
  "Rings and a hero card, ocean": {
    theme: "ocean",
    title: "Offshore wind capacity reached 26.3 GW in 2024",
    data: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), gw: [2.1, 3.4, 5.0, 7.9, 11.2, 14.8, 19.6, 26.3][i], farms: [3, 5, 8, 12, 17, 23, 31, 45][i], protectedShare: [0.031, 0.038, 0.044, 0.052, 0.061, 0.069, 0.076, 0.083][i] })),
    x: "year",
    compare: "previous",
    featured: true,
    variants: ["area", "ring", "ring"],
    metrics: [
      { y: "gw", label: "Offshore wind capacity", format: "{value} GW" },
      { y: "farms", label: "Wind farms connected", max: 60, context: "60 are planned by 2026" },
      { y: "protectedShare", label: "Sea area protected", format: "percent", change: "absolute", max: 0.3, context: "The 2030 target is 30%" },
    ],
    note: "Illustrative data",
  },
  "Two columns, change against the previous month": {
    data: saas,
    x: "month",
    compare: "previous",
    columns: 2,
    metrics: [
      { y: "users", label: "Monthly active users", format: "compact" },
      { y: "mrr", label: "Recurring revenue", format: "currency:USD", kind: "bar" },
    ],
  },
  "Six metrics": {
    data: saas.map((r, i) => ({ ...r, nps: 31 + Math.round(i * 1.4), tickets: 1840 - i * 62 })),
    x: "month",
    metrics: [
      { y: "users", label: "Monthly active users", format: "compact" },
      { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
      { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false },
      { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
      { y: "nps", label: "Net promoter score", change: "absolute" },
      { y: "tickets", label: "Support tickets", upIsGood: false },
    ],
    note: "Illustrative data",
  },
};
