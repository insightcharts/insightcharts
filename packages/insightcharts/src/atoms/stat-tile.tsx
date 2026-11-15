import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useInsightStyles } from "../core/figure";
import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { useInsightConfig, useTheme } from "../core/provider";
import { renderSlot, type Slot } from "../core/spec";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface StatTileProps {
  /** What the figure measures, sentence case. */
  label: string;
  /** The figure. Numbers are formatted with `format`; strings are shown as written. */
  value: number | string;
  /** Change against a named baseline. Numbers are formatted as signed percentages (0.12 is +12%). */
  delta?: number | string;
  /** What the delta is measured against, e.g. "vs last month". */
  deltaLabel?: string;
  /** Whether an increase is an improvement. Decides the delta's colour. Default true. */
  upIsGood?: boolean;
  /** A short line that gives the number meaning when there is no delta. */
  context?: string;
  /**
   * A small trend graphic: a chart spec (`{ type: "line-chart", ... }`), a React element,
   * or simply an array of numbers, which is drawn as a sparkline.
   */
  trend?: Slot | number[];
  /** Where the trend sits. `"right"` falls back to `"bottom"` in narrow tiles. */
  trendPosition?: "bottom" | "right";
  /** JSX rendered at the bottom of the tile. */
  children?: ReactNode;
  format?: FormatSpec;
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

function useWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

const isSeries = (v: unknown): v is number[] => Array.isArray(v) && v.length > 1 && v.every((n) => typeof n === "number");

// A bare line with its last point marked: shape of the trend only, no axes. Position, not length, so it floats.
function Spark({ values, height }: { values: number[]; height: number }) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const pad = 4;
  const x = (i: number) => (i / (values.length - 1)) * 100;
  const y = (v: number) => pad + (1 - (v - lo) / span) * (height - pad * 2);
  const last = values[values.length - 1];
  return (
    <div data-slot="ic-stat-tile-spark" role="img" aria-label={`Trend over ${values.length} points, from ${makeFormatter()(values[0])} to ${makeFormatter()(last)}`} style={{ position: "relative", height, marginRight: 4 }}>
      <svg aria-hidden viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: "block", overflow: "visible" }}>
        <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke="var(--_ic-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* HTML, not SVG: the stretched viewBox would squash a circle. */}
      <span aria-hidden style={{ position: "absolute", left: "100%", top: y(last), width: 8, height: 8, margin: "-4px 0 0 -4px", boxSizing: "border-box", borderRadius: 999, background: "var(--_ic-accent)", border: "2px solid var(--_ic-surface)", boxShadow: "0 0 0 0.5px var(--_ic-accent)" }} />
    </div>
  );
}

/**
 * A compact KPI card: label, value, change and an optional trend. Sized for dashboard grids,
 * where `big-number` would be too large.
 */
function StatTileImpl({ label, value, delta, deltaLabel, upIsGood = true, context, trend, trendPosition = "bottom", children, format, className, style, ...rest }: StatTileProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);

  const text = typeof value === "number" ? makeFormatter(format, config.locale)(value) : value;
  const deltaText = typeof delta === "number" ? makeFormatter({ style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 }, config.locale)(delta) : delta?.replace(/^-(?=[\d.])/, "−");
  const direction = typeof delta === "number" ? Math.sign(delta) : typeof delta === "string" ? (/^\s*[-−]/.test(delta) ? -1 : /^\s*\+?0+([.,]0+)?\s*\D*$/.test(delta) ? 0 : 1) : 0;
  const good = direction === 0 ? null : direction > 0 === upIsGood;
  const tone = good == null ? "var(--_ic-ink-2)" : `color-mix(in srgb, ${good ? "var(--_ic-positive)" : "var(--_ic-negative)"} 76%, var(--_ic-ink))`;

  const hasTrend = trend != null && trend !== false;
  const side = hasTrend && trendPosition === "right" && (width === 0 || width >= 280);
  const trendNode = hasTrend ? (
    <div data-slot="ic-stat-tile-trend" style={side ? { flex: "1 1 0", minWidth: 0, maxWidth: 180, alignSelf: "flex-end" } : { minWidth: 0, marginTop: 14 }}>
      {isSeries(trend) ? <Spark values={trend} height={side ? 44 : 36} /> : renderSlot(trend as Slot)}
    </div>
  ) : null;

  const figure = (
    <div data-slot="ic-stat-tile-figure" style={{ minWidth: 0, flex: side ? "0 1 auto" : undefined }}>
      <div data-slot="ic-stat-tile-label" style={{ fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: 500, color: "var(--_ic-ink-2)" }}>
        {label}
      </div>
      <div data-slot="ic-stat-tile-value" style={{ fontFamily: "var(--_ic-font-display)", fontSize: 28, lineHeight: 1.15, fontWeight: 650, letterSpacing: "-0.022em", color: "var(--_ic-ink)", marginTop: 6, overflowWrap: "anywhere" }}>
        {text}
      </div>
      {deltaText ? (
        <div data-slot="ic-stat-tile-delta" style={{ fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--_ic-muted)", marginTop: 6, display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: "0.4em" }}>
          {/* Arrow and sign carry the direction; colour only says whether the change is an improvement. */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: tone }}>
            {direction !== 0 ? (
              <svg aria-hidden viewBox="0 0 10 10" width="0.68em" height="0.68em" style={{ flex: "none" }}>
                <path d={direction > 0 ? "M5 1 9.4 8.6H0.6Z" : "M5 9 0.6 1.4h8.8Z"} fill="currentColor" />
              </svg>
            ) : null}
            {deltaText}
          </span>
          {deltaLabel ? <span style={{ color: "var(--_ic-ink-2)" }}>{deltaLabel}</span> : null}
        </div>
      ) : null}
      {context ? (
        <div data-slot="ic-stat-tile-context" style={{ fontSize: "0.8125rem", lineHeight: 1.45, color: "var(--_ic-ink-2)", marginTop: deltaText ? 2 : 6, textWrap: "pretty" }}>
          {context}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      ref={ref}
      data-slot="ic-stat-tile"
      data-ic-mode={mode}
      className={className}
      style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", boxSizing: "border-box", minWidth: 0, padding: 16, border: "1px solid var(--_ic-grid)", borderRadius: 10, background: "var(--_ic-surface)", ...style }}
    >
      {side ? (
        <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: 20 }}>
          {figure}
          {trendNode}
        </div>
      ) : (
        <>
          {figure}
          {trendNode}
        </>
      )}
      {children ? (
        <div data-slot="ic-stat-tile-extra" style={{ marginTop: 12 }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const StatTile = withMeta(StatTileImpl, {
  name: "stat-tile",
  component: "StatTile",
  title: "Stat tile",
  level: "atom",
  category: "figure",
  description: "A compact, bordered KPI tile: label, value, change against a baseline and an optional trend graphic.",
  whenToUse: "Dashboard grids and KPI rows of three to six figures, each needing its own change indicator or sparkline. Give every tile a delta or a context line.",
  avoid: "The single number a story leads with (use `big-number` with `size: \"hero\"`). Do not put a full chart with axes in the trend slot.",
  props: [
    { name: "label", type: "string", required: true, description: "What it measures, sentence case." },
    { name: "value", type: "number | string", required: true, description: "The figure. Numbers are formatted with `format`." },
    { name: "delta", type: "number | string", description: "Change against a baseline. Numbers render as signed percentages (0.12 is +12%)." },
    { name: "deltaLabel", type: "string", description: 'What the delta is against, e.g. "vs last month".' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is an improvement. Sets the delta colour." },
    { name: "context", type: "string", description: "A line that states a comparison or reference for the number." },
    { name: "trend", type: "Slot | number[]", description: "A chart spec, a React element, or an array of numbers drawn as a sparkline." },
    { name: "trendPosition", type: '"bottom" | "right"', default: '"bottom"', description: "Where the trend sits; `right` falls back to `bottom` under 280px." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for `value`." },
    { name: "children", type: "ReactNode", description: "Extra content at the bottom of the tile." },
  ],
  example: { type: "stat-tile", label: "Monthly active users", value: 48210, format: "compact", delta: 0.083, deltaLabel: "vs September", trend: [38.1, 39.4, 39.0, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46.0, 47.2, 48.2], style: { maxWidth: 300 } },
});

export const examples = {
  "Down is good, trend on the right": { label: "Median first-response time", value: "2 h 14 min", delta: -0.18, deltaLabel: "vs last quarter", upIsGood: false, trend: [4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2], trendPosition: "right", style: { maxWidth: 420 } },
  "Context only": { label: "Net revenue retention", value: 1.12, format: "percent", context: "Top quartile for the sector is 110%.", style: { maxWidth: 260 } },
  "Chart spec in the trend slot": {
    label: "Solar share of generation",
    value: 0.113,
    format: "percent",
    delta: "+1.9 pts",
    deltaLabel: "vs 2023",
    trend: { type: "big-number", label: "Peak hour, 14 July", value: 0.52, format: "percent", context: "Any registered component can sit here." },
    style: { maxWidth: 300 },
  },
};
