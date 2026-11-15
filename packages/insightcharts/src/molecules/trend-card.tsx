import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { frameStyle } from "../core/provider";
import { toNumber } from "../data/transform";
import type { DataInput, Transform } from "../data/types";
import { Sparkline } from "../atoms/sparkline";
import { StatTile, type StatTileProps, type StatTileVariant } from "../atoms/stat-tile";
import { dataState, periodLabel, Provide, useMolecule, useRows, type MoleculeProps } from "./_shared";

export interface TrendCardProps extends MoleculeProps, Partial<Pick<StatTileProps, "surface" | "tone" | "size" | "align" | "orientation" | "edge" | "icon" | "target" | "targetLabel" | "max" | "parts" | "rank" | "rankOf" | "unitValue">> {
  /**
   * The tile display: any `stat-tile` variant. The series, the comparison value and its labels are
   * filled in from the rows. Omit for the original card with an interactive `sparkline`.
   */
  variant?: StatTileVariant;
  /** Set false to leave the trend line off variants that do not draw the series themselves. Default true. */
  showTrend?: boolean;
  /** Paint a named theme's own background behind the card. Default true when `theme` is a theme name. */
  frame?: boolean;
  /** What the figure measures, sentence case. */
  label: string;
  /** Rows in time order, one per period. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Value field: the series drawn, and the source of the figure and its change. */
  y: string;
  /** Period field, used to name the baseline ("since Jan 2024") and in the sparkline tooltip. */
  x?: string;
  /** The figure shown. Default: the last row's `y`. */
  value?: number | string;
  /** The change shown. Default: computed from the series according to `compare`. */
  delta?: number | string;
  /** Baseline for the computed change: the first row, the previous row, or a number of rows back. */
  compare?: "first" | "previous" | number;
  /** `"percent"` (relative change) or `"absolute"` (difference in the value's own units, e.g. for rates). */
  change?: "percent" | "absolute";
  /**
   * Format for a computed `"absolute"` change. Default: percentage points ("+1.9 pts") when
   * `format` is a percentage, otherwise the value's own format.
   */
  deltaFormat?: FormatSpec;
  /** What the change is against. Default: "since {first period}" when `x` is given. */
  deltaLabel?: string;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** A line under the figure that gives it meaning. */
  context?: string;
  format?: FormatSpec;
  /** Sparkline form: a line for a trend, bars for discrete counts. */
  kind?: "line" | "bar";
  /** Light fill under the line; the scale then includes zero. */
  area?: boolean;
  /** Where the sparkline sits. `"right"` falls back to `"bottom"` in narrow cards. */
  trendPosition?: "bottom" | "right";
}

// A difference between two percentages is in percentage points, not percent: 4.2% to 2.1% is
// "−2.1 pts". Returns the factor that turns a difference into points, or null for other formats.
function pointScale(format: FormatSpec | undefined): number | null {
  if (format === "percent") return 100;
  if (format === "percent-raw") return 1;
  if (typeof format === "string") return /\{value\}\s*%\s*$/.test(format) ? 1 : null;
  if (typeof format === "object" && format !== null) return format.style === "percent" ? 100 : null;
  return null;
}

/** A signed difference as text: explicit `deltaFormat`, else points for percentages, else the value's format. */
function absoluteChange(diff: number, format: FormatSpec | undefined, deltaFormat: FormatSpec | undefined, locale?: string): string {
  const scale = deltaFormat === undefined ? pointScale(format) : null;
  let text: string;
  if (scale !== null) {
    const points = diff * scale;
    text = `${makeFormatter({ maximumFractionDigits: Math.abs(points) < 0.1 ? 2 : 1 }, locale)(points)} pts`;
  } else text = makeFormatter(deltaFormat ?? format, locale)(diff);
  return diff > 0 && !/^\s*\+/.test(text) ? `+${text}` : text;
}

/**
 * A KPI card derived from a series: the latest value, its change against a baseline in
 * the same series, and a sparkline of the whole run. One dataset, no hand-computed numbers.
 */
function TrendCardImpl({ label, data, transform, x, y, value, delta, compare = "first", change = "percent", deltaFormat, deltaLabel, upIsGood = true, context, format, kind = "line", area, trendPosition = "bottom", variant, showTrend = true, surface, tone, size, align, orientation, edge, icon, target, targetLabel, max, parts, rank, rankOf, unitValue, frame, className, style, ...rest }: TrendCardProps) {
  const { ref, mode, root, locale } = useMolecule(rest);
  const state = useRows(data, transform);
  const points = state.rows.filter((r) => !Number.isNaN(toNumber(r[y])));
  const n = points.length;
  const last = n ? toNumber(points[n - 1][y]) : undefined;
  const baseIndex = Math.max(0, compare === "first" ? 0 : compare === "previous" ? n - 2 : n - 1 - compare);
  const base = n > 1 ? toNumber(points[baseIndex][y]) : undefined;

  let shownDelta = delta;
  if (shownDelta === undefined && last !== undefined && base !== undefined && baseIndex < n - 1) {
    if (change === "absolute") shownDelta = absoluteChange(last - base, format, deltaFormat, locale);
    else if (base !== 0) shownDelta = (last - base) / Math.abs(base);
  }
  const against = deltaLabel ?? (delta === undefined && x && n > 1 ? `${compare === "first" ? "since" : "vs"} ${periodLabel(points[baseIndex][x], locale)}` : undefined);
  const placeholder = dataState(state, 132);
  const values = points.map((r) => toNumber(r[y]));
  // Variants with their own graphic (a meter, a ring, a key) do not also get a trend line.
  const ownGraphic = variant != null && ["sparkline", "area", "bars", "dots", "split", "compact", "progress", "ring", "comparison", "breakdown", "rank", "unit"].includes(variant);
  // The card is one tile, so a named theme's ground is painted by the tile itself rather than
  // as a second panel around it. A placeholder has no tile and takes the frame directly.
  const painter = placeholder ? frameStyle(rest.theme, mode, frame) : undefined;

  return (
    <div ref={ref} data-slot="ic-trend-card" data-ic-mode={mode} className={className} style={{ ...root, display: "grid", ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        {placeholder ?? (
          <StatTile
            label={label}
            value={value ?? last ?? "–"}
            format={format}
            delta={shownDelta}
            deltaLabel={shownDelta === undefined ? undefined : against}
            upIsGood={upIsGood}
            context={context}
            trendPosition={trendPosition}
            theme={typeof rest.theme === "string" ? rest.theme : undefined}
            frame={frame}
            variant={variant}
            surface={surface}
            tone={tone}
            size={size}
            align={align}
            orientation={orientation}
            edge={edge}
            icon={icon}
            target={target}
            targetLabel={targetLabel}
            max={max}
            parts={parts}
            rank={rank}
            rankOf={rankOf}
            unitValue={unitValue}
            series={variant != null && n > 1 ? values : undefined}
            comparison={variant === "comparison" ? base : undefined}
            comparisonLabel={variant === "comparison" && x && n > 1 ? periodLabel(points[baseIndex][x], locale) : undefined}
            valueLabel={variant === "comparison" && x && n > 1 ? periodLabel(points[n - 1][x], locale) : undefined}
            trend={variant != null ? (n > 1 && showTrend && !ownGraphic ? values : undefined) : n > 1 ? <Sparkline data={points} x={x} y={y} mark={kind} area={area} format={format} height={trendPosition === "right" ? 44 : 36} lazy={false} /> : undefined}
          />
        )}
      </Provide>
    </div>
  );
}

const months = (values: number[], field: string, start = "2024-01") => {
  const [y0, m0] = start.split("-").map(Number);
  return values.map((v, i) => ({ month: new Date(Date.UTC(y0, m0 - 1 + i, 1)).toISOString().slice(0, 10), [field]: v }));
};

export const TrendCard = withMeta(TrendCardImpl, {
  name: "trend-card",
  component: "TrendCard",
  title: "Trend card",
  level: "molecule",
  category: "layout",
  description: "A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a trend graphic, in any `stat-tile` variant.",
  whenToUse: "A metric whose recent history matters as much as its level: users, revenue, response time. Pass the series and field names; the figure, the change and the sparkline all come from the same rows, so they cannot disagree.",
  avoid: "A number with no history (use `big-number` or `stat-tile`); several metrics from one dataset (use `kpi-grid`); a series the reader must read values from (use `line-chart`).",
  composes: ["stat-tile", "sparkline"],
  props: [
    { name: "label", type: "string", required: true, description: "What the figure measures, sentence case." },
    { name: "data", type: "DataInput", description: "Rows in time order, one per period. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied to the rows before anything is computed." },
    { name: "y", type: "string", required: true, description: "Value field: the series drawn and the source of the figure and its change." },
    { name: "x", type: "string", description: "Period field, used to name the baseline and in the sparkline tooltip." },
    { name: "value", type: "number | string", description: "The figure shown. Default: the last row's `y`." },
    { name: "delta", type: "number | string", description: "The change shown. Default: computed from the series according to `compare`." },
    { name: "compare", type: '"first" | "previous" | number', default: '"first"', description: "Baseline for the computed change: first row, previous row, or a number of rows back (12 for year-on-year in monthly data)." },
    { name: "change", type: '"percent" | "absolute"', default: '"percent"', description: "Relative change, or the difference between the two values (use for rates and shares). An absolute change of a percentage is shown in percentage points." },
    { name: "deltaFormat", type: "FormatSpec", description: 'Format for a computed absolute change, e.g. `"{value} pp"` or `"signed"`. Default: points ("+1.9 pts") when `format` is a percentage, otherwise `format`.' },
    { name: "deltaLabel", type: "string", description: 'What the change is against. Default: "since {first period}" when `x` is given.' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news; decides the delta colour." },
    { name: "context", type: "string", description: "A line under the figure that gives it meaning." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for the figure and the sparkline tooltip." },
    { name: "kind", type: '"line" | "bar"', default: '"line"', description: "Sparkline form: a line for a trend, bars for discrete counts." },
    { name: "area", type: "boolean", default: "false", description: "Light fill under the line; the scale then includes zero." },
    { name: "trendPosition", type: '"bottom" | "right"', default: '"bottom"', description: "Where the sparkline sits; `right` falls back to `bottom` in narrow cards." },
    { name: "variant", type: "StatTileVariant", description: "The tile display: any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `split`, `compact`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `breakdown`, `rank`, `unit`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`, `plain`). The series is passed as the tile's `series`; `comparison` takes the baseline value and both period names from the rows. Omit for the original card with an interactive `sparkline` atom (tooltip on hover)." },
    { name: "showTrend", type: "boolean", default: "true", description: "With a `variant` that does not draw the series itself (`filled`, `icon`, `hero`, `delta-first`...), a line is drawn at the bottom; set false to leave it off." },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "The tile's ground, with any `variant`." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number', description: "Colour of the tile's graphic or ground; a number picks a categorical colour, 0-based." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Tile scale." },
    { name: "align", type: '"left" | "center" | "right"', description: "Text alignment." },
    { name: "orientation", type: '"vertical" | "horizontal"', description: "Graphic under or beside the figure, as in `stat-tile`." },
    { name: "icon", type: "IconInput", description: "Icon for the `icon` and `unit` variants." },
    { name: "target", type: "number", description: "Goal for the `progress` and `ring` variants." },
    { name: "targetLabel", type: "string", default: '"Target"', description: "Name for the target." },
    { name: "max", type: "number", description: "End of the scale for `progress` and `ring`; total count for `unit`." },
    { name: "parts", type: "{ label: string; value: number }[]", description: "Composition of the latest value, for `breakdown`." },
    { name: "rank", type: "number", description: "Position for the `rank` variant." },
    { name: "rankOf", type: "number", description: "Entries ranked." },
    { name: "unitValue", type: "number", description: "What one icon stands for in `unit`." },
    { name: "edge", type: '"left" | "top"', description: "Edge of the rule on an `outline-accent` surface." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides, passed on to the tile. A named theme paints its own ground.' },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "trend-card",
    label: "Monthly active users",
    data: months([38100, 39400, 39000, 40800, 42200, 41900, 43500, 44100, 44500, 46000, 47200, 48210], "users"),
    x: "month",
    y: "users",
    format: "compact",
    style: { maxWidth: 300 },
  },
});

// Monthly active users, 2024: 21,400 in January to 48,210 in December. Illustrative.
const usersRows = months([21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210], "users");
const usersCard = { label: "Monthly active users", data: usersRows, x: "month", y: "users", format: "integer" };

export const examples = {
  "Area along the bottom edge": { ...usersCard, variant: "area", style: { maxWidth: 300 } },
  "Split, figure left and line right, ledger": { ...usersCard, theme: "ledger", variant: "split", style: { maxWidth: 440 } },
  "Filled ground with a line": { ...usersCard, variant: "filled", tone: 4, style: { maxWidth: 300 } },
  "Comparison with the first period, editorial": { ...usersCard, theme: "editorial", variant: "comparison", style: { maxWidth: 320 } },
  "Progress toward a target, science": { ...usersCard, theme: "science", variant: "progress", target: 50000, targetLabel: "Q4 target", compare: 3, style: { maxWidth: 320 } },
  "Ring, forest": {
    theme: "forest",
    label: "Native woodland replanted, hectares",
    data: [2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), ha: [80, 190, 330, 480, 620, 1240][i] })),
    x: "year",
    y: "ha",
    format: "integer",
    variant: "ring",
    max: 2000,
    context: "The 2026 goal is 2,000 hectares.",
    compare: "previous",
    style: { maxWidth: 360 },
  },
  "Bars for weekly counts, blueprint": {
    theme: "blueprint",
    label: "Units assembled per shift",
    data: [212, 240, 198, 265, 281, 254, 302, 318].map((units, i) => ({ week: `week ${i + 1}`, units })),
    x: "week",
    y: "units",
    variant: "bars",
    style: { maxWidth: 300 },
  },
  "Change first on a tinted ground, sunrise": { theme: "sunrise", label: "Store visits per week", data: [15400, 15900, 16200, 16000, 17100, 17800, 18640].map((visits, i) => ({ week: `week ${44 + i}`, visits })), x: "week", y: "visits", format: "integer", variant: "delta-first", surface: "tinted", tone: 1, style: { maxWidth: 300 } },
  "Dots, large, noir": {
    theme: "noir",
    label: "Points after each block of five matches",
    data: [9, 19, 28, 40, 49, 61].map((points, i) => ({ matchday: `matchday ${(i + 1) * 5}`, points })),
    x: "matchday",
    y: "points",
    variant: "dots",
    size: "lg",
    compare: "previous",
    style: { maxWidth: 360 },
  },
  "Compact row, mono": { ...usersCard, theme: "mono", variant: "compact", compare: "previous", style: { maxWidth: 440 } },
  "Hero with an outline rule, paper": { theme: "paper", label: "Average annual energy bill", data: [2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), bill: [1138, 1042, 1277, 2100, 1960, 1717][i] })), x: "year", y: "bill", format: "currency:GBP", compare: "previous", upIsGood: false, variant: "hero", surface: "outline-accent", style: { maxWidth: 420 } },
  "Down is good, trend on the right": {
    label: "Median first-response time",
    data: months([4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2], "hours"),
    x: "month",
    y: "hours",
    format: "{value} h",
    upIsGood: false,
    trendPosition: "right",
    style: { maxWidth: 440 },
  },
  "Absolute change against the previous period, bars": {
    label: "Unemployment rate",
    data: months([3.9, 3.8, 3.8, 3.6, 3.5, 3.6, 3.4, 3.7, 3.8, 3.9, 4.1, 4.3], "rate"),
    x: "month",
    y: "rate",
    format: "{value}%",
    compare: "previous",
    change: "absolute",
    upIsGood: false,
    kind: "bar",
    context: "Highest month of 2024",
    style: { maxWidth: 300 },
  },
};
