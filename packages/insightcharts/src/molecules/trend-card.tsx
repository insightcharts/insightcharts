import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { toNumber } from "../data/transform";
import type { DataInput, Transform } from "../data/types";
import { Sparkline } from "../atoms/sparkline";
import { StatTile } from "../atoms/stat-tile";
import { dataState, periodLabel, Provide, useMolecule, useRows, type MoleculeProps } from "./_shared";

export interface TrendCardProps extends MoleculeProps {
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
function TrendCardImpl({ label, data, transform, x, y, value, delta, compare = "first", change = "percent", deltaFormat, deltaLabel, upIsGood = true, context, format, kind = "line", area, trendPosition = "bottom", className, style, ...rest }: TrendCardProps) {
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

  return (
    <div ref={ref} data-slot="ic-trend-card" data-ic-mode={mode} className={className} style={{ ...root, display: "grid", ...style }}>
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
            trend={n > 1 ? <Sparkline data={points} x={x} y={y} mark={kind} area={area} format={format} height={trendPosition === "right" ? 44 : 36} lazy={false} /> : undefined}
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
  description: "A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a sparkline of the series.",
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
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to the tile and sparkline." },
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

export const examples = {
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
