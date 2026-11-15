import type { CSSProperties } from "react";
import type { FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { frameStyle } from "../core/provider";
import type { Slot } from "../core/spec";
import { BigNumber } from "../atoms/big-number";
import { StatTile, type StatTileProps, type StatTileSurface, type StatTileTone, type StatTileVariant } from "../atoms/stat-tile";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface StatRowItem extends Partial<Pick<StatTileProps, "series" | "target" | "targetLabel" | "max" | "comparison" | "comparisonLabel" | "valueLabel" | "parts" | "icon" | "unitValue" | "rank" | "rankOf" | "orientation" | "edge" | "size" | "align">> {
  /** The figure. Numbers are formatted with `format`; strings are shown as written. */
  value: number | string;
  /** What the figure measures, sentence case. */
  label: string;
  /** The comparison, denominator or period that gives the number meaning. */
  context?: string;
  /** Change against a baseline. Numbers render as signed percentages (0.12 is +12%). */
  delta?: number | string;
  deltaLabel?: string;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Overrides the row's `format` for this figure. */
  format?: FormatSpec;
  /** Tiles only: an array of numbers drawn as a sparkline, or a chart spec. */
  trend?: Slot | number[];
  /** Tiles only: this tile's display, overriding the row's. Any `stat-tile` variant. */
  variant?: StatTileVariant;
  /** Tiles only: this tile's ground, overriding the row's. */
  surface?: StatTileSurface;
  /** This figure's tone, overriding the row's. */
  tone?: StatTileTone;
}

export interface StatRowProps extends MoleculeProps {
  /** Two to five figures, most important first. */
  items: StatRowItem[];
  /**
   * `"plain"`: open figures separated by hairlines. `"tiles"`: bordered tiles that can carry a trend.
   * Any other `stat-tile` variant (`"sparkline"`, `"progress"`, `"filled"`...) draws every item as a tile of that kind.
   */
  variant?: "plain" | "tiles" | StatTileVariant;
  /** Tiles only: the ground of every tile. */
  surface?: StatTileSurface;
  /** Tone of every tile's graphic or ground. `"series"` gives each tile the next categorical colour. */
  tone?: StatTileTone | "series";
  /** Tiles only: `"cards"` (default) separates tiles with a gap, `"dividers"` sets them open with hairlines between. */
  layout?: "cards" | "dividers";
  /** Preferred number of columns. Default: all in one row when each has room. */
  columns?: number;
  /** The first figure spans two columns and is set one size larger. */
  featured?: boolean;
  /** Spacing and type scale: `"dense"` for sidebars and tables, `"roomy"` for a page opener. */
  density?: "dense" | "default" | "roomy";
  /** Text alignment of every figure. */
  align?: "left" | "center";
  /** Number format shared by every figure that does not set its own. */
  format?: FormatSpec;
  /** The main fact with its number, or a plain label. */
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
  /** Paint a named theme's own background behind the row. Default true when `theme` is a theme name. */
  frame?: boolean;
}

/** Places items on a grid of `cols` columns where the first may span two; returns each item's column, row and span. */
function place(n: number, cols: number, featured: boolean) {
  const cells: { col: number; row: number; span: number }[] = [];
  let col = 0;
  let row = 0;
  for (let i = 0; i < n; i++) {
    const span = featured && i === 0 ? Math.min(2, cols) : 1;
    if (col + span > cols) {
      col = 0;
      row += 1;
    }
    cells.push({ col, row, span });
    col += span;
  }
  // A lone figure in the last row spans it, so nothing is orphaned beside empty cells.
  const last = cells[n - 1];
  if (last && cols > 1 && last.col === 0 && n > 1) last.span = cols;
  return { cells, rows: row + 1 };
}

const SIZE_UP = { sm: "md", md: "lg", lg: "lg" } as const;

/**
 * A row of key figures. The columns follow the container: all in one row when each has
 * room, then two columns, then a single stack, with hairlines between cells.
 */
function StatRowImpl({ items, variant = "plain", surface, tone, layout = "cards", columns, featured = false, density = "default", align, format, title, subtitle, source, note, frame, className, style, ...rest }: StatRowProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = (items ?? []).slice(0, 5);
  const n = list.length;
  const tiles = variant !== "plain" || list.some((item) => item.variant != null);
  const tileVariant: StatTileVariant | undefined = variant === "plain" || variant === "tiles" ? undefined : variant;
  const dividers = !tiles || layout === "dividers";
  const size = density === "dense" ? "sm" : density === "roomy" ? "lg" : "md";
  const painter = frameStyle(rest.theme, mode, frame);
  const inner = Math.max(0, width - (painter ? 40 : 0));
  const wide = tileVariant === "compact" || tileVariant === "split";
  const min = (wide ? 240 : tiles ? 172 : 148) - (density === "dense" ? 24 : 0);
  const gap = dividers ? 0 : density === "dense" ? 8 : density === "roomy" ? 16 : 12;
  const units = n + (featured && n > 1 ? 1 : 0);
  const fit = Math.max(1, Math.floor((inner + gap) / (min + gap)));
  const auto = fit >= units ? units : units > 4 && fit >= 3 ? 3 : fit >= 2 ? 2 : 1;
  const cols = Math.max(1, Math.min(columns ?? auto, fit, units));
  const { cells, rows } = place(n, cols, featured && n > 1);
  const pad = density === "dense" ? 12 : inner < 480 ? 16 : density === "roomy" ? 32 : 24;
  const padY = density === "dense" ? 12 : density === "roomy" ? 24 : 16;
  return (
    <div ref={ref} data-slot="ic-stat-row" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <div data-slot="ic-stat-row-items" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
          {list.map((item, i) => {
            const { col, row, span } = cells[i];
            const lead = featured && i === 0 && n > 1;
            const cell: CSSProperties = { minWidth: 0, gridColumn: span > 1 ? `span ${span}` : undefined };
            if (dividers)
              Object.assign(cell, {
                paddingLeft: col > 0 ? pad : 0,
                paddingRight: col + span < cols ? pad : 0,
                paddingTop: row > 0 ? padY : 0,
                paddingBottom: row < rows - 1 ? padY : 0,
                borderLeft: col > 0 ? "1px solid var(--_ic-grid)" : undefined,
                borderTop: row > 0 ? "1px solid var(--_ic-grid)" : undefined,
              });
            const itemTone = item.tone ?? (tone === "series" ? i : tone);
            const itemSize = item.size ?? (lead ? SIZE_UP[size] : size);
            if (!tiles) {
              return (
                <div key={i} role="listitem" data-slot="ic-stat-row-item" data-featured={lead || undefined} style={cell}>
                  <BigNumber value={item.value} label={item.label} context={item.context} delta={item.delta} deltaLabel={item.deltaLabel} upIsGood={item.upIsGood} format={item.format ?? format} size={lead && density === "roomy" ? "hero" : "stat"} align={item.align === "center" || align === "center" ? "center" : "left"} />
                </div>
              );
            }
            return (
              <div key={i} role="listitem" data-slot="ic-stat-row-item" data-featured={lead || undefined} style={{ ...cell, display: "grid" }}>
                <StatTile {...item} variant={item.variant ?? tileVariant} surface={item.surface ?? surface ?? (layout === "dividers" ? "borderless" : undefined)} tone={itemTone} size={itemSize} align={item.align ?? align} format={item.format ?? format} />
              </div>
            );
          })}
        </div>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const StatRow = withMeta(StatRowImpl, {
  name: "stat-row",
  component: "StatRow",
  title: "Stat row",
  level: "molecule",
  category: "layout",
  description: "Two to five key figures in one row, as open numbers separated by hairlines or as stat tiles of any variant, collapsing to two columns and then one as the container narrows.",
  whenToUse: "The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance.",
  avoid: "More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: \"hero\"`), or figures that need their history shown (use `kpi-grid`, or `variant: \"tiles\"` with a `trend`).",
  composes: ["big-number", "stat-tile"],
  props: [
    { name: "items", type: "{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend?, variant?, surface?, tone?, size?, align?, series?, target?, targetLabel?, max?, comparison?, comparisonLabel?, valueLabel?, parts?, icon?, unitValue?, rank?, rankOf?, orientation?, edge? }[]", required: true, description: "Two to five figures, most important first. In `plain` each takes the props of `big-number`; otherwise each takes the props of `stat-tile`, and an item's own `variant`, `surface`, `tone` and `size` override the row's." },
    { name: "variant", type: '"plain" | "tiles" | StatTileVariant', default: '"plain"', description: "`plain`: open `big-number` figures divided by hairlines. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `unit`, `breakdown`, `rank`, `split`, `compact`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`) draws every item as that tile. Setting `variant` on any item also switches the row to tiles." },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "Tiles only: the ground of every tile." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number | "series"', description: "Tone of every tile. `series` gives each tile the next categorical colour, for figures that name different entities." },
    { name: "layout", type: '"cards" | "dividers"', default: '"cards"', description: "Tiles only: separate cards, or open tiles with hairlines between them." },
    { name: "columns", type: "number", description: "Preferred number of columns. Default: one row when every figure has room." },
    { name: "featured", type: "boolean", default: "false", description: "The first figure spans two columns and is set one size larger." },
    { name: "density", type: '"dense" | "default" | "roomy"', default: '"default"', description: "Spacing and type scale: tiles are `sm`, `md` or `lg`." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Text alignment of every figure." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for every figure that does not set its own." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Population and period the figures share." },
    { name: "source", type: "string", description: 'Shown under the row as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides, passed on to every figure. A named theme paints its own ground.' },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode, passed on to every figure." },
  ],
  example: {
    type: "stat-row",
    title: "Renewables supplied 31.7% of the world's electricity in 2024",
    subtitle: "Global electricity generation, 2024",
    items: [
      { value: 0.317, format: "percent", label: "Share from renewables", delta: "+1.9 pts", deltaLabel: "vs 2023" },
      { value: 2131, label: "Solar generation, TWh", delta: 0.29, deltaLabel: "vs 2023" },
      { value: 2494, label: "Wind generation, TWh", delta: 0.079, deltaLabel: "vs 2023" },
      { value: 0.409, format: "percent", label: "Share from all clean sources", context: "Above 40% for the first time since the 1940s" },
    ],
    source: "Ember, Global Electricity Review 2025",
    note: "Figures are approximate, for illustration",
  },
});

// One product, December 2024. Users rose from 21,400 in January to 48,210, 8.3% above
// September's 44,500. Illustrative.
const users = [21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210];
const revenue = [412, 428, 431, 455, 470, 476, 498, 511, 524, 548, 566, 589].map((v) => v * 1000);
const churn = [4.2, 4.0, 3.9, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1];
const product: StatRowItem[] = [
  { label: "Monthly active users", value: 48210, delta: 0.083, deltaLabel: "vs September", series: users, target: 50000, icon: "group", comparison: 44500, comparisonLabel: "September", valueLabel: "December" },
  { label: "Recurring revenue", value: 589000, format: "currency:USD", delta: 0.124, deltaLabel: "vs September", series: revenue, target: 600000, icon: "banknote", comparison: 524000, comparisonLabel: "September", valueLabel: "December" },
  { label: "Monthly churn", value: 2.1, format: "{value}%", delta: "−0.2 pts", deltaLabel: "vs September", upIsGood: false, series: churn, icon: "heart", comparison: 2.3, comparisonLabel: "September", valueLabel: "December" },
];

export const examples = {
  "Tiles with trends": {
    variant: "tiles",
    items: [
      { label: "Monthly active users", value: 48210, format: "compact", delta: 0.083, deltaLabel: "vs September", trend: [38.1, 39.4, 39.0, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46.0, 47.2, 48.2] },
      { label: "Median first-response time", value: "2 h 14 min", delta: -0.18, deltaLabel: "vs September", upIsGood: false, trend: [4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2] },
      { label: "Net revenue retention", value: 1.12, format: "percent", context: "Top quartile for the sector is 110%" },
    ],
    note: "Illustrative data",
  },
  "Area tiles, one colour per metric": { title: "Recurring revenue reached $589,000 in December 2024", subtitle: "Three product metrics by month, 2024", variant: "area", tone: "series", items: product, note: "Illustrative data" },
  "Featured filled tile with sparklines, ledger": {
    theme: "ledger",
    title: "Monthly active users reached 48,210 in December 2024",
    featured: true,
    variant: "sparkline",
    items: [{ ...product[0], surface: "filled", variant: "split" }, product[1], product[2]],
    note: "Illustrative data",
  },
  "Progress toward targets, science": {
    theme: "science",
    title: "Measles vaccination coverage was 91% in 2024",
    subtitle: "Childhood vaccination coverage against the 95% WHO target, 2024",
    variant: "progress",
    items: [
      { label: "Measles, first dose", value: 0.91, format: "percent", target: 0.95, max: 1, targetLabel: "Target", delta: "+2 pts", deltaLabel: "vs 2021" },
      { label: "Polio, third dose", value: 0.93, format: "percent", target: 0.95, max: 1, targetLabel: "Target", delta: "+1 pt", deltaLabel: "vs 2021", tone: 1 },
      { label: "HPV, girls aged 15", value: 0.64, format: "percent", target: 0.9, max: 1, targetLabel: "Target", delta: "+9 pts", deltaLabel: "vs 2021", tone: 2 },
    ],
    note: "Illustrative data",
  },
  "Rings with dividers, forest": {
    theme: "forest",
    title: "Native woodland replanting reached 62% of the 2026 goal",
    variant: "ring",
    layout: "dividers",
    items: [
      { label: "Native woodland replanted", value: 1240, format: "{value} ha", max: 2000, context: "Goal: 2,000 hectares" },
      { label: "Peatland restored", value: 430, format: "{value} ha", max: 1000, context: "Goal: 1,000 hectares" },
      { label: "Hedgerow planted", value: 86, format: "{value} km", max: 100, context: "Goal: 100 kilometres" },
    ],
    note: "Illustrative data",
  },
  "Icons on tinted tiles, earth": {
    theme: "earth",
    variant: "icon",
    surface: "tinted",
    tone: "series",
    items: [
      { label: "Bottles returned for refill", value: 0.72, format: "percent", icon: "bottle", delta: "+9 pts", deltaLabel: "vs 2022" },
      { label: "Household waste recycled", value: 0.48, format: "percent", icon: "bin", delta: "+3 pts", deltaLabel: "vs 2022" },
      { label: "Journeys made by bike", value: 0.19, format: "percent", icon: "bike", delta: "+4 pts", deltaLabel: "vs 2022" },
      { label: "Homes with solar panels", value: 0.11, format: "percent", icon: "solar-panel", delta: "+5 pts", deltaLabel: "vs 2022" },
    ],
    note: "Illustrative data",
  },
  "Change first, noir": {
    theme: "noir",
    title: "The club scored 68 goals in 30 matches",
    variant: "delta-first",
    layout: "dividers",
    items: [
      { label: "Goals scored", value: "68 goals", delta: 0.214, deltaLabel: "vs 56 last season" },
      { label: "Goals conceded", value: "31 goals", delta: -0.184, deltaLabel: "vs 38 last season", upIsGood: false },
      { label: "Average attendance", value: "41,200", delta: 0.062, deltaLabel: "vs 38,800 last season" },
      { label: "Points", value: "61 points", delta: 0.196, deltaLabel: "vs 51 last season" },
    ],
    note: "Illustrative data",
  },
  "Comparison with the same week last year, sunrise": {
    theme: "sunrise",
    title: "Store visits were 18,640 in week 50 of 2024",
    variant: "comparison",
    items: [
      { label: "Store visits", value: 18640, comparison: 16200, valueLabel: "2024", comparisonLabel: "2023" },
      { label: "Orders", value: 6120, comparison: 5480, valueLabel: "2024", comparisonLabel: "2023" },
      { label: "Average basket", value: 42.6, format: "currency:EUR", comparison: 44.1, valueLabel: "2024", comparisonLabel: "2023" },
    ],
    note: "Illustrative data",
  },
  "Compact rows in one column, mono": { theme: "mono", variant: "compact", columns: 1, density: "dense", items: product, note: "Illustrative data", style: { maxWidth: 460 } },
  "Mixed displays in one row, blueprint": {
    theme: "blueprint",
    title: "The plant assembled 318 units per shift in week 8",
    items: [
      { label: "Units assembled per shift", value: 318, variant: "bars", series: [212, 240, 198, 265, 281, 254, 302, 318], delta: 0.5, deltaLabel: "vs week 1" },
      { label: "Line uptime", value: 0.962, format: "percent", variant: "ring", max: 1, context: "Target is 95%" },
      { label: "Defect rate rank", value: "0.8%", context: "of units", variant: "rank", rank: 2, rankOf: 9 },
    ],
    note: "Illustrative data",
  },
  "Breakdown tiles, dusk": {
    theme: "dusk",
    variant: "breakdown",
    columns: 2,
    items: [
      { label: "Night train passengers, 2024", value: 1840000, format: "compact", parts: [{ label: "Sleeper", value: 644000 }, { label: "Couchette", value: 736000 }, { label: "Seat", value: 460000 }] },
      { label: "Night train revenue, 2024", value: 212000000, format: "currency:EUR", parts: [{ label: "Sleeper", value: 116600000 }, { label: "Couchette", value: 69960000 }, { label: "Seat", value: 25440000 }] },
    ],
    note: "Illustrative data",
  },
  "Roomy, featured plain figures, editorial": {
    theme: "editorial",
    featured: true,
    density: "roomy",
    items: [
      { value: 0.043, format: "percent", label: "Unemployment rate, December 2024", delta: "+0.4 pts", deltaLabel: "vs January", upIsGood: false },
      { value: 0.031, format: "percent", label: "Annual inflation", delta: "−0.9 pts", deltaLabel: "vs January", upIsGood: false },
      { value: 0.045, format: "percent", label: "Policy interest rate", context: "Cut from 5.25% in August" },
    ],
    note: "Illustrative data",
  },
  "Unit counts, ocean": {
    theme: "ocean",
    variant: "unit",
    items: [
      { label: "Offshore wind farms connected in 2024", value: 14, max: 20, icon: "wind-turbine", context: "14 of the 20 planned" },
      { label: "Survey ships at sea", value: 6, max: 8, icon: "ship", context: "6 of a fleet of 8" },
      { label: "Marine reserves designated", value: 9, icon: "fish", context: "3 more than in 2023" },
    ],
    note: "Illustrative data",
  },
  "Filled tiles in categorical colours, poster": { theme: "poster", variant: "filled", tone: "series", density: "roomy", align: "center", items: product.map(({ label, value, format, delta, deltaLabel, upIsGood }) => ({ label, value, format, delta, deltaLabel, upIsGood })), note: "Illustrative data" },
  "Outline rule with dots, paper": { theme: "paper", variant: "dots", surface: "outline-accent", tone: "series", items: product, note: "Illustrative data" },
  "Two figures": {
    items: [
      { value: "1 in 4", label: "Households that could not cover a €500 bill", context: "Without borrowing or selling something" },
      { value: 0.068, format: "percent", label: "Households in arrears on utility bills", delta: "+0.4 pts", deltaLabel: "vs 2022", upIsGood: false },
    ],
    source: "Eurostat, EU-SILC 2023",
    note: "Figures are approximate, for illustration",
  },
  "Five figures": {
    format: "compact",
    items: [
      { value: 1284000, label: "Visits", delta: 0.12, deltaLabel: "vs last month" },
      { value: 412000, label: "Unique visitors", delta: 0.09, deltaLabel: "vs last month" },
      { value: 38200, label: "Sign-ups", delta: 0.031, deltaLabel: "vs last month" },
      { value: 5140, label: "Paid conversions", delta: -0.024, deltaLabel: "vs last month" },
      { value: 0.134, format: "percent", label: "Sign-up to paid", delta: "−0.7 pts", deltaLabel: "vs last month" },
    ],
    note: "Illustrative data",
  },
};
