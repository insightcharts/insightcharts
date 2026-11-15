import type { FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { BigNumber } from "../atoms/big-number";
import { Delta } from "../atoms/delta";
import { StatTile, type StatTileProps, type StatTileSurface, type StatTileTone, type StatTileVariant } from "../atoms/stat-tile";
import { frameStyle } from "../core/provider";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface BeforeAfterState extends Partial<Pick<StatTileProps, "series" | "target" | "targetLabel" | "max" | "parts" | "icon" | "unitValue" | "rank" | "rankOf" | "orientation">> {
  /** Tiles only: this state's display, overriding `variant`. */
  variant?: StatTileVariant;
  /** Tiles only: this state's ground. */
  surface?: StatTileSurface;
  /** Tiles only: this state's tone. Default: neutral before, accent after. */
  tone?: StatTileTone;
  /** Names the state: a year, "Before the change", "Control". */
  heading?: string;
  /** The figure for this state. Omit to show only a chart. */
  value?: number | string;
  /** What the figure measures. */
  label?: string;
  /** A line that qualifies the figure. */
  context?: string;
  format?: FormatSpec;
  /** A small chart or figure for this state: a spec or a React element. */
  chart?: Slot;
}

export interface BeforeAfterProps extends MoleculeProps {
  before: BeforeAfterState;
  after: BeforeAfterState;
  /** The change, stated between the two. Default: the relative change when both values are numbers. */
  delta?: number | string;
  /** Words under the change, e.g. "in five years". */
  deltaLabel?: string;
  /** Number format for a numeric `delta`. Default: signed percent. */
  deltaFormat?: FormatSpec;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Number format shared by both values. */
  format?: FormatSpec;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
  /**
   * `"plain"` (default): open figures under a ruled heading. `"tiles"`: each state is a bordered `stat-tile`.
   * Any other `stat-tile` variant (`"progress"`, `"ring"`, `"sparkline"`, `"unit"`, `"filled"`...) draws both states as that tile.
   */
  variant?: "plain" | "tiles" | StatTileVariant;
  /** Tiles only: the ground of both tiles. */
  surface?: StatTileSurface;
  /** Tiles only: `"after"` (default) draws the first state in neutral ink and the second in the accent; `"none"` draws both in the accent. */
  emphasis?: "after" | "none";
  /** `"auto"` (default) sets the states side by side from 520px; or force one arrangement. */
  layout?: "auto" | "side" | "stacked";
  /** How the change is set between the states. Default `"pill"`. */
  deltaVariant?: "text" | "pill" | "solid";
  /** The arrow between the states. Default true. */
  arrow?: boolean;
  /** Spacing and tile scale. */
  density?: "dense" | "default" | "roomy";
  /** Paint a named theme's own background. Default true when `theme` is a theme name. */
  frame?: boolean;
}

function Arrow({ down }: { down: boolean }) {
  return (
    <svg data-slot="ic-before-after-arrow" aria-hidden viewBox="0 0 40 12" width={40} height={12} style={{ display: "block", color: "var(--_ic-axis)", transform: down ? "rotate(90deg)" : undefined, margin: down ? "10px 0" : 0 }}>
      <path d="M1 6h37m-5-4.5L38 6l-5 4.5" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Two states of one measure with the change stated between them, so the reader does
 * not have to work it out.
 */
function BeforeAfterImpl({ before, after, delta, deltaLabel, deltaFormat, upIsGood = true, format, title, subtitle, source, note, variant = "plain", surface, emphasis = "after", layout = "auto", deltaVariant = "pill", arrow = true, density = "default", frame, className, style, ...rest }: BeforeAfterProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const painter = frameStyle(rest.theme, mode, frame);
  const inner = Math.max(0, width - (painter ? 40 : 0));
  const stacked = layout === "stacked" || (layout === "auto" && inner < 520);
  const tiles = variant !== "plain" || before?.variant != null || after?.variant != null;
  const tileVariant: StatTileVariant | undefined = variant === "plain" || variant === "tiles" ? undefined : variant;
  const size = density === "dense" ? "sm" : density === "roomy" ? "lg" : "md";
  const a = before?.value;
  const b = after?.value;
  const change = delta ?? (typeof a === "number" && typeof b === "number" && a !== 0 ? (b - a) / Math.abs(a) : undefined);

  const panel = (state: BeforeAfterState, which: "before" | "after") => (
    <div data-slot="ic-before-after-state" data-state={which} style={{ minWidth: 0 }}>
      {state.heading ? (
        <div data-slot="ic-before-after-heading" style={{ fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: 600, color: "var(--_ic-ink)", ...(tiles ? { marginBottom: 8 } : { paddingBottom: 8, marginBottom: 12, borderBottom: "1px solid var(--_ic-grid)" }) }}>
          {state.heading}
        </div>
      ) : null}
      {state.value == null ? null : tiles ? (
        <StatTile value={state.value} label={state.label ?? ""} context={state.context} format={state.format ?? format} variant={state.variant ?? tileVariant} surface={state.surface ?? surface} tone={state.tone ?? (emphasis === "after" && which === "before" ? "neutral" : undefined)} size={size} series={state.series} target={state.target} targetLabel={state.targetLabel} max={state.max} parts={state.parts} icon={state.icon} unitValue={state.unitValue} rank={state.rank} rankOf={state.rankOf} orientation={state.orientation} />
      ) : (
        <BigNumber value={state.value} label={state.label ?? ""} context={state.context} format={state.format ?? format} />
      )}
      {state.chart != null ? (
        <div data-slot="ic-before-after-chart" style={{ minWidth: 0, marginTop: state.value != null ? 12 : 0 }}>
          {renderSlot(state.chart)}
        </div>
      ) : null}
    </div>
  );

  return (
    <div ref={ref} data-slot="ic-before-after" data-ic-mode={mode} data-layout={stacked ? "stacked" : "side"} className={className} style={{ ...root, ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <div data-slot="ic-before-after-states" style={{ display: "grid", gridTemplateColumns: stacked ? "minmax(0, 1fr)" : "minmax(0, 1fr) auto minmax(0, 1fr)", columnGap: density === "dense" ? 16 : inner < 720 ? 20 : density === "roomy" ? 40 : 32, rowGap: 8, alignItems: tiles ? "end" : "center" }}>
          {panel(before ?? {}, "before")}
          <div data-slot="ic-before-after-change" style={{ display: "flex", flexDirection: stacked ? "row" : "column", alignItems: "center", justifyContent: stacked ? "flex-start" : "center", gap: stacked ? 12 : 6, textAlign: stacked ? "left" : "center", minWidth: 0, maxWidth: stacked ? undefined : 132, padding: stacked ? "4px 0" : 0, alignSelf: "center" }}>
            {stacked && arrow ? <Arrow down /> : null}
            <div style={{ minWidth: 0 }}>
              {change != null ? <Delta value={change} format={deltaFormat} upIsGood={upIsGood} size={density === "roomy" ? "xl" : "lg"} variant={deltaVariant} /> : null}
              {deltaLabel ? (
                <div data-slot="ic-before-after-change-label" style={{ fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-muted)", marginTop: change != null ? 6 : 0, textWrap: "balance" }}>
                  {deltaLabel}
                </div>
              ) : null}
            </div>
            {stacked || !arrow ? null : <Arrow down={false} />}
          </div>
          {panel(after ?? {}, "after")}
        </div>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const BeforeAfter = withMeta(BeforeAfterImpl, {
  name: "before-after",
  component: "BeforeAfter",
  title: "Before and after",
  level: "molecule",
  category: "layout",
  description: "Two states of one measure side by side, as figures, stat tiles of any variant or small charts, with the change between them stated in the middle.",
  whenToUse: "A single measure at two moments or under two conditions: before and after a policy, control and treatment, last year and this. The change is computed from the two values unless you state it.",
  avoid: "More than two states (use `line-chart` or `slope-chart`); many entities each with a before and after (use `dumbbell-chart` or `arrow-chart`); two unrelated figures (use `stat-row`).",
  composes: ["big-number", "stat-tile", "delta", "bar-chart", "sparkline"],
  props: [
    { name: "before", type: "{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }", required: true, description: "The first state: a figure, a chart slot, or both. The fields after `chart` apply when the states are tiles and are passed to `stat-tile`." },
    { name: "after", type: "{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }", required: true, description: "The second state." },
    { name: "variant", type: '"plain" | "tiles" | StatTileVariant', default: '"plain"', description: "`plain`: open `big-number` figures under a ruled heading. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`progress`, `ring`, `sparkline`, `area`, `bars`, `unit`, `breakdown`, `rank`, `icon`, `filled`, `tinted`, `hero`...) draws both states as that tile; a state's own `variant` overrides it." },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "Tiles only: the ground of both tiles." },
    { name: "emphasis", type: '"after" | "none"', default: '"after"', description: "Tiles only: `after` draws the first state in neutral ink and the second in the accent; `none` draws both in the accent. A state's own `tone` overrides it." },
    { name: "layout", type: '"auto" | "side" | "stacked"', default: '"auto"', description: "Side by side from 520px, or force one arrangement." },
    { name: "deltaVariant", type: '"text" | "pill" | "solid"', default: '"pill"', description: "How the change between the states is set: passed to `delta`." },
    { name: "arrow", type: "boolean", default: "true", description: "The arrow between the states." },
    { name: "density", type: '"dense" | "default" | "roomy"', default: '"default"', description: "Spacing and tile scale (`sm`, `md`, `lg`)." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "delta", type: "number | string", description: "The change stated between the two. Default: the relative change when both values are numbers." },
    { name: "deltaLabel", type: "string", description: 'Words under the change, e.g. "in five years".' },
    { name: "deltaFormat", type: "FormatSpec", default: "signed percent", description: "Number format for a numeric `delta`." },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news; decides the colour of the change." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format shared by both values." },
    { name: "title", type: "string", description: "The change stated plainly, with both values and the period." },
    { name: "subtitle", type: "string", description: "Measure and population." },
    { name: "source", type: "string", description: 'Shown underneath as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"editorial"`, or token overrides, passed on to both states. A named theme paints its own ground.' },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "before-after",
    title: "Solar module prices fell from $0.74 to $0.15 per watt between 2013 and 2023",
    subtitle: "Average price of crystalline silicon modules, US dollars per watt",
    format: { style: "currency", currency: "USD" },
    before: { heading: "2013", value: 0.74, label: "Per watt", context: "2013 average" },
    after: { heading: "2023", value: 0.15, label: "Per watt", context: "2023 average" },
    deltaLabel: "in ten years",
    upIsGood: false,
    source: "IRENA Renewable Power Generation Costs 2023",
    note: "Rounded, approximate figures for illustration",
  },
});

const hours = (values: number[]) => values.map((v, i) => ({ hour: `${String(i * 3).padStart(2, "0")}:00`, price: v }));

export const examples = {
  "Tiles, the second state in the accent": {
    title: "Monthly churn fell from 4.2% to 2.1% in 2024",
    variant: "tiles",
    before: { heading: "January 2024", value: 0.042, format: "percent", label: "Monthly churn", context: "Before the onboarding redesign" },
    after: { heading: "December 2024", value: 0.021, format: "percent", label: "Monthly churn", context: "Nine months after the redesign" },
    delta: "−2.1 pts",
    deltaLabel: "in eleven months",
    upIsGood: false,
    note: "Illustrative data",
  },
  "Progress toward the same target, science": {
    theme: "science",
    title: "Measles vaccination coverage rose from 86% to 91% between 2021 and 2024",
    subtitle: "Children receiving a first dose, against the 95% WHO target",
    variant: "progress",
    before: { heading: "2021", value: 0.86, format: "percent", label: "Coverage", target: 0.95, max: 1 },
    after: { heading: "2024", value: 0.91, format: "percent", label: "Coverage", target: 0.95, max: 1 },
    delta: "+5 pts",
    deltaLabel: "in three years",
    note: "Illustrative data",
  },
  "Rings, forest": {
    theme: "forest",
    title: "Native woodland replanted rose from 620 to 1,240 hectares in 2024",
    variant: "ring",
    before: { heading: "End of 2023", value: 620, format: "{value} ha", label: "Replanted", max: 2000, context: "Goal: 2,000 hectares" },
    after: { heading: "End of 2024", value: 1240, format: "{value} ha", label: "Replanted", max: 2000, context: "Goal: 2,000 hectares" },
    deltaLabel: "in one year",
    deltaVariant: "solid",
    note: "Illustrative data",
  },
  "Unit counts, ocean": {
    theme: "ocean",
    title: "Offshore wind farms connected rose from 31 to 45 in 2024",
    variant: "unit",
    before: { heading: "2023", value: 31, label: "Wind farms connected", icon: "wind-turbine", max: 60 },
    after: { heading: "2024", value: 45, label: "Wind farms connected", icon: "wind-turbine", max: 60 },
    deltaLabel: "60 are planned by 2026",
    note: "Illustrative data",
  },
  "Filled tiles, stacked, noir": {
    theme: "noir",
    variant: "filled",
    layout: "stacked",
    density: "roomy",
    before: { heading: "Last season, after 30 matches", value: "51 points", label: "League points", context: "8th of 20" },
    after: { heading: "This season, after 30 matches", value: "61 points", label: "League points", context: "4th of 20" },
    delta: 0.196,
    deltaLabel: "more points",
    deltaVariant: "solid",
    note: "Illustrative data",
    style: { maxWidth: 420 },
  },
  "Trends within each period, ledger": {
    theme: "ledger",
    title: "Recurring revenue rose from $412,000 to $589,000 in 2024",
    variant: "sparkline",
    emphasis: "none",
    before: { heading: "First half", value: 476000, format: "currency:USD", label: "Recurring revenue, June", series: [412, 428, 431, 455, 470, 476], tone: 2 },
    after: { heading: "Second half", value: 589000, format: "currency:USD", label: "Recurring revenue, December", series: [498, 511, 524, 548, 566, 589] },
    deltaLabel: "June to December",
    note: "Illustrative data",
  },
  "Breakdown of each state, earth": {
    theme: "earth",
    title: "The recycled share of household waste rose from 39% to 48% between 2019 and 2024",
    variant: "breakdown",
    emphasis: "none",
    before: { heading: "2019", value: 104000, format: "{value} t", label: "Household waste collected", parts: [{ label: "Recycled", value: 40600 }, { label: "Composted", value: 12500 }, { label: "Incinerated", value: 27000 }, { label: "Landfilled", value: 23900 }] },
    after: { heading: "2024", value: 100400, format: "{value} t", label: "Household waste collected", parts: [{ label: "Recycled", value: 48200 }, { label: "Composted", value: 17100 }, { label: "Incinerated", value: 24300 }, { label: "Landfilled", value: 10800 }] },
    upIsGood: false,
    deltaLabel: "total waste",
    note: "Illustrative data",
  },
  "Dense, text change without an arrow, mono": {
    theme: "mono",
    variant: "tiles",
    density: "dense",
    deltaVariant: "text",
    arrow: false,
    before: { heading: "Control", value: 0.031, format: "percent", label: "Checkout conversion", context: "12,400 sessions" },
    after: { heading: "New checkout", value: 0.038, format: "percent", label: "Checkout conversion", context: "12,380 sessions" },
    delta: "+0.7 pts",
    deltaLabel: "over 14 days",
    note: "Illustrative data",
    layout: "side",
    style: { maxWidth: 640 },
  },
  "Roomy plain figures, editorial": {
    theme: "editorial",
    title: "The unemployment rate rose from 3.9% to 4.3% in 2024",
    density: "roomy",
    deltaVariant: "solid",
    before: { heading: "January 2024", value: 0.039, format: "percent", label: "Unemployment rate" },
    after: { heading: "December 2024", value: 0.043, format: "percent", label: "Unemployment rate" },
    delta: "+0.4 pts",
    deltaLabel: "in eleven months",
    upIsGood: false,
    note: "Illustrative data",
  },
  "Two charts, change stated in words": {
    title: "The median midday price fell from €44 to €12 per MWh between summer 2019 and summer 2024",
    subtitle: "Median day-ahead price by hour, euros per MWh, same scale",
    before: { heading: "Summer 2019", chart: { type: "bar-chart", data: hours([38, 34, 41, 47, 44, 43, 52, 45]), x: "hour", y: "price", orientation: "vertical", sort: "none", height: 150, labels: false, option: { yAxis: { max: 100 } } } },
    after: { heading: "Summer 2024", chart: { type: "bar-chart", data: hours([71, 64, 69, 48, 12, 21, 96, 84]), x: "hour", y: "price", orientation: "vertical", sort: "none", height: 150, labels: false, option: { yAxis: { max: 100 } } } },
    delta: "−€32",
    deltaLabel: "at midday",
    upIsGood: false,
    note: "Illustrative data",
  },
  "Figures with sparklines": {
    before: { heading: "Before the redesign", value: 0.042, format: "percent", label: "Monthly churn", chart: { type: "sparkline", data: [4.4, 4.1, 4.3, 4.2, 4.3, 4.2].map((v) => ({ v })), y: "v" } },
    after: { heading: "After", value: 0.021, format: "percent", label: "Monthly churn", chart: { type: "sparkline", data: [3.6, 3.1, 2.6, 2.4, 2.2, 2.1].map((v) => ({ v })), y: "v" } },
    upIsGood: false,
    deltaLabel: "after six months",
  },
};
