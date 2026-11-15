import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { cssFallback, inkOn, toRgba } from "../core/color";
import { useInsightStyles } from "../core/figure";
import { makeFormatter, type FormatSpec } from "../core/format";
import { Icon } from "../core/icon";
import type { IconInput } from "../core/icons";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { frameStyle, useInsightConfig, useTheme } from "../core/provider";
import { renderSlot, type Slot } from "../core/spec";
import { chromeVars, type ThemeInput } from "../core/theme";
import { useContainerWidth } from "../core/use-container-width";

/** How a stat tile displays its data. Every variant reads the same props; each uses the ones it needs. */
export type StatTileVariant =
  | "plain"
  | "borderless"
  | "filled"
  | "tinted"
  | "outline-accent"
  | "sparkline"
  | "area"
  | "bars"
  | "dots"
  | "progress"
  | "ring"
  | "comparison"
  | "delta-first"
  | "icon"
  | "unit"
  | "breakdown"
  | "rank"
  | "split"
  | "compact"
  | "hero";

/** The ground a tile sits on, independent of what it draws. */
export type StatTileSurface = "plain" | "borderless" | "filled" | "tinted" | "outline-accent";

/** Colour by meaning, or a 0-based index into the theme's categorical palette. */
export type StatTileTone = "neutral" | "accent" | "positive" | "negative" | number;

export interface StatTilePart {
  /** Name of the part. */
  label: string;
  /** Size of the part, in the units of `value`. */
  value: number;
}

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
  /** How the tile displays its data. Default `"plain"`. A variant whose data is missing renders as `"plain"`. */
  variant?: StatTileVariant;
  /** The ground the tile sits on. Default: the variant's own (`"filled"` for the filled variant, otherwise a bordered card). */
  surface?: StatTileSurface;
  /** Colour of the graphic and of a filled or tinted ground. Default `"accent"`. A number picks a categorical colour (0-based). */
  tone?: StatTileTone;
  /** Type and padding scale. Default `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Text alignment. Default `"left"`. */
  align?: "left" | "center" | "right";
  /** Whether the graphic sits under the figure or beside it. Default `"vertical"` (`"horizontal"` for `ring`). Falls back to vertical in narrow tiles. */
  orientation?: "vertical" | "horizontal";
  /** Past values in time order, oldest first, in the units of `value`. Drawn by `sparkline`, `area`, `bars`, `dots`, `split` and `compact`. */
  series?: number[];
  /** A goal for `value`. Drawn by `progress` and `ring`. */
  target?: number;
  /** Name for the target. Default "Target". */
  targetLabel?: string;
  /** End of the scale for `progress` and `ring`, and the total count for `unit`. Default: the target, or 1. */
  max?: number;
  /** The value this one is compared with, for `comparison`: a previous period or a peer. */
  comparison?: number | string;
  /** Names the comparison value, e.g. "September". */
  comparisonLabel?: string;
  /** Names the current value in `comparison`, e.g. "December". */
  valueLabel?: string;
  /** What the value is made of, for `breakdown`. The parts should sum to `value`. */
  parts?: StatTilePart[];
  /** An icon name from the built-in set, or `path://...`. Drawn by `icon` and `unit`. */
  icon?: IconInput;
  /** What one icon stands for in `unit`. Default 1. */
  unitValue?: number;
  /** Position in a ranking, 1 is first. Drawn by `rank`. */
  rank?: number;
  /** Number of entries ranked. */
  rankOf?: number;
  /** Which edge carries the rule on an `outline-accent` surface. Default `"left"`. */
  edge?: "left" | "top";
  /** Paint a named theme's own background behind the tile. Default true when `theme` is a theme name. */
  frame?: boolean;
  /** JSX rendered at the bottom of the tile. */
  children?: ReactNode;
  format?: FormatSpec;
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const isSeries = (v: unknown): v is number[] => Array.isArray(v) && v.length > 1 && v.every((n) => typeof n === "number" && Number.isFinite(n));

const SURFACES: readonly string[] = ["plain", "borderless", "filled", "tinted", "outline-accent"];
const ACCENT = "var(--_ic-accent)";
const DIMS = {
  sm: { pad: 12, label: "0.75rem", value: 22, meta: "0.75rem", step: 4, spark: 32, ring: 48, stroke: 5, track: 6, badge: 32, glyph: 16, unit: 14 },
  md: { pad: 16, label: "0.8125rem", value: 28, meta: "0.8125rem", step: 6, spark: 40, ring: 56, stroke: 6, track: 8, badge: 36, glyph: 20, unit: 18 },
  lg: { pad: 20, label: "0.875rem", value: 36, meta: "0.875rem", step: 8, spark: 52, ring: 72, stroke: 8, track: 10, badge: 44, glyph: 24, unit: 22 },
} as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number) => Math.round(n * 100) / 100;

/** Maps values to 0..1. Lengths and areas start at zero; positions may float. */
function unitScale(values: number[], zero: boolean): (v: number) => number {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (zero) {
    lo = Math.min(0, lo);
    hi = Math.max(0, hi);
  }
  const span = hi - lo;
  return span === 0 ? () => 0.5 : (v) => (v - lo) / span;
}

// The three trend graphics are drawn in px on a viewBox as wide as the measured tile, so
// circles stay round and strokes stay 2px; `width: 100%` only absorbs a pending measure.
function LineGraphic({ values, width, height, area = false, dot = true }: { values: number[]; width: number; height: number; area?: boolean; dot?: boolean }) {
  const n = values.length;
  const t = unitScale(values, area);
  const inset = dot ? 4 : 0;
  const x = (i: number) => round((i / (n - 1)) * (width - inset));
  const y = (v: number) => round(4 + (1 - t(v)) * (height - (area ? 4 : 8)));
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg aria-hidden focusable="false" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      {area ? <polygon points={`0,${height} ${points} ${x(n - 1)},${height}`} fill={ACCENT} fillOpacity={0.16} /> : null}
      <polyline points={points} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {dot ? <circle cx={x(n - 1)} cy={y(values[n - 1])} r={4} fill={ACCENT} stroke="var(--_ic-surface)" strokeWidth={2} /> : null}
    </svg>
  );
}

function BarsGraphic({ values, width, height }: { values: number[]; width: number; height: number }) {
  const n = values.length;
  const bar = Math.min(24, Math.max(1, (width - (n > 12 ? 2 : 4) * (n - 1)) / n));
  // Bars stop at 24px; a short series spreads across the tile instead of growing thicker.
  const gap = (width - bar * n) / (n - 1);
  const hi = Math.max(0, ...values);
  const lo = Math.min(0, ...values);
  const span = hi - lo || 1;
  const base = (hi / span) * height;
  return (
    <svg aria-hidden focusable="false" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {values.map((v, i) => {
        if (v === 0) return null;
        const h = Math.max(1, (Math.abs(v) / span) * height);
        const r = Math.min(2, bar / 2, h);
        const x0 = round(i * (bar + gap));
        const x1 = round(x0 + bar);
        const tip = round(v > 0 ? base - h : base + h);
        const bend = round(v > 0 ? tip + r : tip - r);
        // Rounded at the data end, square on the baseline.
        return <path key={i} d={`M${x0} ${round(base)}V${bend}Q${x0} ${tip} ${x0 + r} ${tip}H${x1 - r}Q${x1} ${tip} ${x1} ${bend}V${round(base)}Z`} fill={ACCENT} fillOpacity={i === n - 1 ? 1 : 0.4} />;
      })}
    </svg>
  );
}

function DotsGraphic({ values, width, height }: { values: number[]; width: number; height: number }) {
  const n = values.length;
  const t = unitScale(values, false);
  const r = n * 8 > width ? 2.5 : 3;
  const x = (i: number) => round(4 + (i / (n - 1)) * (width - 8));
  const y = (v: number) => round(5 + (1 - t(v)) * (height - 10));
  return (
    <svg aria-hidden focusable="false" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      {/* The first value's level, so each dot reads as above or below where the series began. */}
      <line x1={0} x2={width} y1={y(values[0])} y2={y(values[0])} stroke="var(--_ic-axis)" strokeWidth={1} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
      {values.map((v, i) => (i === n - 1 ? <circle key={i} cx={x(i)} cy={y(v)} r={4} fill={ACCENT} stroke="var(--_ic-surface)" strokeWidth={2} /> : <circle key={i} cx={x(i)} cy={y(v)} r={r} fill={ACCENT} fillOpacity={0.5} />))}
    </svg>
  );
}

function RingGraphic({ fraction, mark, size, stroke }: { fraction: number; mark: number | null; size: number; stroke: number }) {
  const c = size / 2;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const arc = fraction * length;
  // Round caps add half a stroke at each end; the dash is shortened so the arc still ends on the value.
  const capped = fraction < 1 && arc > stroke;
  const spot = (f: number, radius: number) => `${round(c + radius * Math.sin(f * 2 * Math.PI))} ${round(c - radius * Math.cos(f * 2 * Math.PI))}`;
  return (
    <svg aria-hidden focusable="false" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke={ACCENT} strokeOpacity={0.18} strokeWidth={stroke} />
      {fraction > 0 ? (
        <circle cx={c} cy={c} r={r} fill="none" stroke={ACCENT} strokeWidth={stroke} strokeLinecap={capped ? "round" : "butt"} strokeDasharray={`${round(capped ? arc - stroke : arc)} ${round(length)}`} transform={`rotate(${round(-90 + (capped ? (stroke / 2 / r) * (180 / Math.PI) : 0))} ${c} ${c})`} />
      ) : null}
      {mark != null ? <path d={`M${spot(mark, r - stroke / 2 - 1.5)}L${spot(mark, r + stroke / 2 + 1.5)}`} stroke="var(--_ic-ink)" strokeWidth={2} strokeLinecap="round" /> : null}
    </svg>
  );
}

function ordinal(n: number, locale?: string): string {
  if (locale && !/^en\b/i.test(locale)) return `${n}.`;
  const rule = new Intl.PluralRules("en", { type: "ordinal" }).select(n);
  return `${n}${rule === "one" ? "st" : rule === "two" ? "nd" : rule === "few" ? "rd" : "th"}`;
}

/**
 * A compact KPI card: label, value, change and an optional graphic. One set of data
 * (value, delta, series, target, parts, icon) can be shown in twenty designed ways by
 * changing `variant`. Sized for dashboard grids, where `big-number` would be too large.
 */
function StatTileImpl({
  label,
  value,
  delta,
  deltaLabel,
  upIsGood = true,
  context,
  trend,
  trendPosition = "bottom",
  variant = "plain",
  surface: surfaceProp,
  tone,
  size = "md",
  align = "left",
  orientation,
  series: seriesProp,
  target,
  targetLabel = "Target",
  max,
  comparison,
  comparisonLabel,
  valueLabel,
  parts,
  icon,
  unitValue = 1,
  rank,
  rankOf,
  edge = "left",
  frame,
  children,
  format,
  className,
  style,
  ...rest
}: StatTileProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const [ref, measured] = useContainerWidth<HTMLDivElement>(0);
  const theme = useTheme(rest.theme);
  // A filled tile paints its own ground, which says nothing about the page around it, so the
  // colour mode is read from the parent instead.
  const filledGround = (surfaceProp ?? variant) === "filled";
  const outside = useMemo(() => ({ get current() { return ref.current?.parentElement ?? null; } }), [ref]);
  const { mode } = useColorMode(filledGround ? outside : ref, rest.mode ?? config.mode);
  const id = useId();
  const tokens = theme[mode];
  const dim = DIMS[size] ?? DIMS.md;

  // Ground and tone.
  const surface: StatTileSurface = surfaceProp ?? (SURFACES.includes(variant) ? (variant as StatTileSurface) : "plain");
  const palette = tokens.categorical;
  const toneColor = typeof tone === "number" ? palette[((Math.round(tone) % palette.length) + palette.length) % palette.length] : tone === "positive" ? tokens.positive : tone === "negative" ? tokens.negative : tone === "neutral" ? tokens.inkSecondary : tokens.accent;
  const fill = tone === "neutral" ? tokens.ink : toneColor;
  const filled = surface === "filled";
  // The ink that reads on a filled ground is taken from the painted colour, because a token
  // may be a CSS variable that only the browser can resolve.
  const [painted, setPainted] = useState<{ fill: string; ink: string } | null>(null);
  useEffect(() => {
    if (!filled || !ref.current) return;
    const background = getComputedStyle(ref.current).backgroundColor;
    if (!background || !toRgba(background)) return;
    const ink = inkOn(background);
    setPainted((prev) => (prev && prev.fill === fill && prev.ink === ink ? prev : { fill, ink }));
  }, [filled, fill, mode, ref]);
  const onFill = painted && painted.fill === fill ? painted.ink : inkOn(cssFallback(fill) || "#000");

  const vars: Record<string, string> = { ...chromeVars(tokens) };
  if (tone != null) vars["--_ic-accent"] = toneColor;
  if (filled) {
    // Everything inside is drawn in the contrasting ink: text, graphics and direction arrows.
    Object.assign(vars, {
      "--_ic-surface": fill,
      "--_ic-ink": onFill,
      "--_ic-ink-2": `color-mix(in srgb, ${onFill} 88%, ${fill})`,
      "--_ic-muted": `color-mix(in srgb, ${onFill} 78%, ${fill})`,
      "--_ic-grid": `color-mix(in srgb, ${onFill} 22%, ${fill})`,
      "--_ic-axis": `color-mix(in srgb, ${onFill} 38%, ${fill})`,
      "--_ic-context": `color-mix(in srgb, ${onFill} 38%, ${fill})`,
      "--_ic-accent": onFill,
      "--_ic-positive": onFill,
      "--_ic-negative": onFill,
    });
  } else if (surface === "tinted") {
    vars["--_ic-surface"] = `color-mix(in srgb, ${toneColor} 10%, ${tokens.surface})`;
  }

  // Padding is known in px because the area and split graphics bleed to the tile's edges.
  const painter = frameStyle(rest.theme, mode, frame);
  const open = surface === "borderless" || surface === "outline-accent";
  const compact = variant === "compact";
  const pad = open ? (painter ? 20 : 0) : dim.pad;
  const box = compact && !open ? { t: dim.pad / 2 + 2, r: dim.pad - 4, b: dim.pad / 2 + 2, l: dim.pad - 4 } : { t: pad, r: pad, b: pad, l: pad };
  if (surface === "outline-accent" && !painter) {
    if (edge === "top") box.t = 12;
    else box.l = dim.pad;
  }
  const inner = measured > 0 ? measured : 268;

  // Text.
  const fmt = makeFormatter(format, config.locale);
  const pct = makeFormatter({ style: "percent", maximumFractionDigits: 0 }, config.locale);
  const numeric = typeof value === "number" && Number.isFinite(value);
  const text = typeof value === "number" ? fmt(value) : value;
  const autoDelta = delta === undefined && variant === "comparison" && numeric && typeof comparison === "number" && comparison !== 0 ? ((value as number) - comparison) / Math.abs(comparison) : undefined;
  const shownDelta = delta ?? autoDelta;
  const deltaText = typeof shownDelta === "number" ? makeFormatter({ style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 }, config.locale)(shownDelta) : shownDelta?.replace(/^-(?=[\d.])/, "−");
  const direction = typeof shownDelta === "number" ? Math.sign(shownDelta) : typeof shownDelta === "string" ? (/^\s*[-−]/.test(shownDelta) ? -1 : /^\s*\+?0+([.,]0+)?\s*\D*$/.test(shownDelta) ? 0 : 1) : 0;
  const good = direction === 0 ? null : direction > 0 === upIsGood;
  const deltaColor = good == null ? "var(--_ic-ink-2)" : `color-mix(in srgb, ${good ? "var(--_ic-positive)" : "var(--_ic-negative)"} 76%, var(--_ic-ink))`;
  const against = deltaLabel ?? (autoDelta !== undefined && comparisonLabel ? `vs ${comparisonLabel}` : undefined);

  // Which display the data supports.
  const series = isSeries(seriesProp) ? seriesProp : isSeries(trend) ? trend : undefined;
  const count = numeric ? Math.round((value as number) / (unitValue || 1)) : 0;
  const unitTotal = max != null ? Math.max(count, Math.round(max / (unitValue || 1))) : count;
  const list = (parts ?? []).filter((p) => p && Number.isFinite(p.value) && p.value > 0);
  const ready: Record<StatTileVariant, boolean> = {
    plain: true,
    borderless: true,
    filled: true,
    tinted: true,
    "outline-accent": true,
    hero: true,
    compact: true,
    sparkline: !!series,
    area: !!series,
    bars: !!series,
    dots: !!series,
    split: !!series,
    progress: numeric && (target != null || max != null || ((value as number) >= 0 && (value as number) <= 1)),
    ring: numeric && (target != null || max != null || ((value as number) >= 0 && (value as number) <= 1)),
    comparison: comparison != null,
    "delta-first": !!deltaText,
    icon: !!icon,
    unit: numeric && count >= 0 && unitTotal > 0 && unitTotal <= 60,
    breakdown: list.length > 0,
    rank: rank != null && rank >= 1,
  };
  const shown: StatTileVariant = ready[variant] ? variant : "plain";
  const drawsSeries = shown === "sparkline" || shown === "area" || shown === "bars" || shown === "dots" || shown === "split" || shown === "compact";
  const hero = shown === "hero";

  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  const arrow = (scale = "0.68em") =>
    direction !== 0 ? (
      <svg aria-hidden focusable="false" viewBox="0 0 10 10" width={scale} height={scale} style={{ flex: "none" }}>
        <path d={direction > 0 ? "M5 1 9.4 8.6H0.6Z" : "M5 9 0.6 1.4h8.8Z"} fill="currentColor" />
      </svg>
    ) : null;
  const seriesAlt = series ? `Trend over ${series.length} points, from ${makeFormatter(isSeries(seriesProp) ? format : undefined, config.locale)(series[0])} to ${makeFormatter(isSeries(seriesProp) ? format : undefined, config.locale)(series[series.length - 1])}` : "";

  // Layout: graphics that can sit beside the figure do so when asked and when there is room.
  const sideable = shown === "sparkline" || shown === "bars" || shown === "dots" || shown === "ring" || shown === "icon";
  const wantsSide = orientation ? orientation === "horizontal" : shown === "ring";
  const side = sideable && wantsSide && inner >= (shown === "ring" || shown === "icon" ? 176 : 248);
  const split = shown === "split" && inner >= 264;
  const sideWidth = Math.round(Math.min(184, Math.max(72, inner * 0.42)));
  const panelWidth = Math.round((inner + box.r) * 0.46);
  const textWidth = split ? inner - panelWidth + box.r - 16 : side ? inner - (shown === "ring" ? dim.ring : shown === "icon" ? dim.badge : sideWidth) - 16 : inner;

  // Type scales with the tile: the numeral shrinks to fit rather than breaking mid-figure.
  const fit = (base: number, floor: number, chars: number) => (chars * base * 0.58 > textWidth ? Math.max(Math.min(floor, base), Math.floor(textWidth / (chars * 0.58))) : base);
  const heroBase = Math.round(Math.min(96, Math.max(40, inner * 0.22)) / 4) * 4;
  const rankText = shown === "rank" ? ordinal(Math.round(rank as number), config.locale) : "";
  const headline = shown === "delta-first" ? `▲ ${deltaText}` : shown === "rank" ? `${rankText}${rankOf ? ` of ${rankOf}` : ""}` : String(text);
  const valueSize = fit(hero ? heroBase : dim.value, 18, headline.length);
  const metaSize = hero ? "0.9375rem" : dim.meta;

  const labelNode = (
    <div data-slot="ic-stat-tile-label" id={id} style={{ fontSize: hero ? "0.9375rem" : dim.label, lineHeight: 1.4, fontWeight: 500, color: "var(--_ic-ink-2)" }}>
      {label}
    </div>
  );
  const valueStyle: CSSProperties = { fontFamily: "var(--_ic-font-display)", fontSize: valueSize, lineHeight: hero ? 1.05 : 1.15, fontWeight: 650, letterSpacing: hero ? "-0.03em" : "-0.022em", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", marginTop: hero ? 8 : dim.step, overflowWrap: "anywhere" };
  const deltaNode = deltaText ? (
    <div data-slot="ic-stat-tile-delta" style={{ fontSize: metaSize, lineHeight: 1.4, color: "var(--_ic-muted)", marginTop: hero ? 8 : dim.step, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: justify, columnGap: "0.4em" }}>
      {/* Arrow and sign carry the direction; colour only says whether the change is an improvement. */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: deltaColor }}>
        {arrow()}
        {deltaText}
      </span>
      {against ? <span style={{ color: "var(--_ic-ink-2)" }}>{against}</span> : null}
    </div>
  ) : null;
  const contextNode = context ? (
    <div data-slot="ic-stat-tile-context" style={{ fontSize: metaSize, lineHeight: 1.45, color: "var(--_ic-ink-2)", marginTop: deltaText ? 2 : hero ? 8 : dim.step, textWrap: "pretty" }}>
      {context}
    </div>
  ) : null;

  let figure: ReactNode;
  if (shown === "delta-first") {
    figure = (
      <>
        {labelNode}
        <div data-slot="ic-stat-tile-delta" style={{ ...valueStyle, color: deltaColor, display: "flex", alignItems: "center", justifyContent: justify, gap: "0.22em", whiteSpace: "nowrap" }}>
          {arrow("0.56em")}
          {deltaText}
        </div>
        <div data-slot="ic-stat-tile-value" style={{ fontSize: dim.meta, lineHeight: 1.4, color: "var(--_ic-ink-2)", marginTop: dim.step }}>
          <span style={{ fontWeight: 650, color: "var(--_ic-ink)", fontVariantNumeric: "tabular-nums" }}>{text}</span>
          {against ? ` ${against}` : null}
        </div>
        {context ? (
          <div data-slot="ic-stat-tile-context" style={{ fontSize: dim.meta, lineHeight: 1.45, color: "var(--_ic-ink-2)", marginTop: 2, textWrap: "pretty" }}>
            {context}
          </div>
        ) : null}
      </>
    );
  } else if (shown === "rank") {
    figure = (
      <>
        {labelNode}
        <div data-slot="ic-stat-tile-rank" style={{ ...valueStyle, display: "flex", alignItems: "baseline", justifyContent: justify, gap: "0.28em", whiteSpace: "nowrap" }}>
          {rankText}
          {rankOf ? <span style={{ fontFamily: "var(--_ic-font)", fontSize: "0.5em", fontWeight: 500, letterSpacing: 0, color: "var(--_ic-ink-2)" }}>of {rankOf}</span> : null}
        </div>
        <div data-slot="ic-stat-tile-value" style={{ fontSize: dim.meta, lineHeight: 1.4, color: "var(--_ic-ink-2)", marginTop: dim.step }}>
          <span style={{ fontWeight: 650, color: "var(--_ic-ink)", fontVariantNumeric: "tabular-nums" }}>{text}</span>
          {context ? ` ${context}` : null}
        </div>
        {deltaNode}
      </>
    );
  } else if (shown === "comparison") {
    figure = (
      <>
        {labelNode}
        <div data-slot="ic-stat-tile-value" style={valueStyle}>
          {text}
        </div>
        {deltaNode}
        {contextNode}
      </>
    );
  } else if (compact) {
    figure = (
      <div data-slot="ic-stat-tile-line" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 12, rowGap: 2 }}>
        <div data-slot="ic-stat-tile-label" id={id} style={{ flex: "1 1 96px", minWidth: 0, fontSize: dim.label, lineHeight: 1.4, fontWeight: 500, color: "var(--_ic-ink-2)" }}>
          {label}
        </div>
        {series && inner >= 296 ? (
          <div data-slot="ic-stat-tile-spark" role="img" aria-label={seriesAlt} style={{ flex: "none", width: 56, alignSelf: "center" }}>
            <LineGraphic values={series} width={56} height={16} dot={false} />
          </div>
        ) : null}
        <div data-slot="ic-stat-tile-value" style={{ fontFamily: "var(--_ic-font-display)", fontSize: size === "sm" ? "0.9375rem" : size === "lg" ? "1.25rem" : "1.0625rem", lineHeight: 1.3, fontWeight: 650, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", whiteSpace: "nowrap" }}>{text}</div>
        {deltaText ? (
          <div data-slot="ic-stat-tile-delta" title={against} style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", minWidth: "4.4em", justifyContent: "flex-end", fontSize: dim.meta, lineHeight: 1.4, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: deltaColor }}>
            {arrow()}
            {deltaText}
            {against ? <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}> {against}</span> : null}
          </div>
        ) : null}
      </div>
    );
  } else {
    figure = (
      <>
        {labelNode}
        <div data-slot="ic-stat-tile-value" style={valueStyle}>
          {text}
        </div>
        {deltaNode}
        {contextNode}
      </>
    );
  }

  // The graphic for the variant.
  const gap = hero ? 16 : size === "sm" ? 12 : 16;
  const graphicWidth = side ? sideWidth : inner;
  let graphic: ReactNode = null;
  if (shown === "sparkline" || shown === "bars" || shown === "dots") {
    const G = shown === "bars" ? BarsGraphic : shown === "dots" ? DotsGraphic : LineGraphic;
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic={shown} role="img" aria-label={seriesAlt} style={side ? { flex: "none", width: sideWidth, alignSelf: "flex-end" } : { marginTop: gap }}>
        <G values={series!} width={graphicWidth} height={side ? dim.spark + 8 : dim.spark} />
      </div>
    );
  } else if (shown === "area") {
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="area" role="img" aria-label={seriesAlt} style={{ margin: `${gap}px ${-box.r}px ${-box.b}px ${-box.l}px` }}>
        <LineGraphic values={series!} width={inner + box.l + box.r} height={dim.spark + 16} area dot={false} />
      </div>
    );
  } else if (shown === "split") {
    graphic = split ? (
      <div data-slot="ic-stat-tile-graphic" data-graphic="split" role="img" aria-label={seriesAlt} style={{ flex: "none", width: panelWidth, boxSizing: "border-box", margin: `${-box.t}px ${-box.r}px ${-box.b}px 0`, padding: "12px 16px 12px 12px", display: "flex", alignItems: "center", background: `color-mix(in srgb, ${ACCENT} 9%, transparent)` }}>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <LineGraphic values={series!} width={panelWidth - 28} height={dim.spark + 16} />
        </div>
      </div>
    ) : (
      <div data-slot="ic-stat-tile-graphic" data-graphic="split" role="img" aria-label={seriesAlt} style={{ marginTop: gap }}>
        <LineGraphic values={series!} width={inner} height={dim.spark} />
      </div>
    );
  } else if (shown === "progress" || shown === "ring") {
    const v = value as number;
    const goal = target ?? max ?? 1;
    const end = max ?? Math.max(goal, v);
    const fraction = end > 0 ? clamp01(v / end) : 0;
    const mark = target != null && end > 0 ? clamp01(target / end) : null;
    const ratio = goal !== 0 ? pct(v / goal) : "";
    const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
    const goalText = target != null ? `${targetLabel} ${fmt(target)}` : max != null ? `of ${fmt(max)}` : "";
    const meter = { role: "meter", "aria-labelledby": id, "aria-valuemin": 0, "aria-valuemax": end, "aria-valuenow": Math.min(end, Math.max(0, v)), "aria-valuetext": `${text}${goalText ? `, ${lower(goalText)}` : ""}` } as const;
    if (shown === "progress") {
      const share = ratio === text ? "" : target != null ? `${ratio} of ${/^[A-Z][a-z]/.test(targetLabel) ? lower(targetLabel) : targetLabel}` : max != null ? `${ratio} ${goalText}` : "";
      graphic = (
        <div data-slot="ic-stat-tile-graphic" data-graphic="progress" style={{ marginTop: gap }}>
          <div data-slot="ic-stat-tile-meter" {...meter} style={{ position: "relative", height: dim.track, borderRadius: 999, background: `color-mix(in srgb, ${ACCENT} 18%, transparent)` }}>
            <div data-slot="ic-stat-tile-meter-fill" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${round(fraction * 100)}%`, minWidth: fraction > 0 ? dim.track : 0, borderRadius: 999, background: ACCENT }} />
            {mark != null ? <div data-slot="ic-stat-tile-meter-target" aria-hidden style={{ position: "absolute", top: -4, bottom: -4, left: `clamp(1px, ${round(mark * 100)}%, calc(100% - 1px))`, width: 2, marginLeft: -1, borderRadius: 1, background: "var(--_ic-ink)", boxShadow: "0 0 0 2px var(--_ic-surface)" }} /> : null}
          </div>
          {share || goalText ? (
            <div data-slot="ic-stat-tile-caption" style={{ display: "flex", flexWrap: "wrap", justifyContent: share ? "space-between" : mark != null && mark > 0.5 ? "flex-end" : "flex-start", columnGap: 12, marginTop: 8, fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-ink-2)", fontVariantNumeric: "tabular-nums" }}>
              {share ? <span style={{ fontWeight: 600, color: "var(--_ic-ink)" }}>{share}</span> : null}
              {goalText && (target != null || !share) ? <span>{goalText}</span> : null}
            </div>
          ) : null}
        </div>
      );
    } else {
      // The ring's own reading, printed unless the figure beside it already says the same.
      const reading = pct(fraction);
      const inside = reading !== text && Math.abs(fraction - v) > 1e-9;
      graphic = (
        <div data-slot="ic-stat-tile-graphic" data-graphic="ring" style={side ? { flex: "none", alignSelf: "center" } : { display: "flex", justifyContent: justify, marginBottom: 12 }}>
          <div data-slot="ic-stat-tile-ring" {...meter} style={{ position: "relative", width: dim.ring, height: dim.ring }}>
            <RingGraphic fraction={fraction} mark={mark != null && mark < 1 ? mark : null} size={dim.ring} stroke={dim.stroke} />
            {inside ? (
              <span aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: size === "lg" ? "0.9375rem" : "0.75rem", lineHeight: 1, fontWeight: 650, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)" }}>{reading}</span>
            ) : null}
          </div>
        </div>
      );
    }
  } else if (shown === "comparison") {
    const a = numeric ? (value as number) : null;
    const b = typeof comparison === "number" ? comparison : null;
    const top = a != null && b != null ? Math.max(Math.abs(a), Math.abs(b)) || 1 : null;
    const row = (name: string | undefined, shownValue: ReactNode, share: number | null, current: boolean) => (
      <div data-slot="ic-stat-tile-comparison-row" data-current={current || undefined}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, fontSize: "0.75rem", lineHeight: 1.4, color: current ? "var(--_ic-ink)" : "var(--_ic-ink-2)" }}>
          <span style={{ minWidth: 0, fontWeight: current ? 600 : 400 }}>{name}</span>
          <span style={{ flex: "none", fontVariantNumeric: "tabular-nums", fontWeight: current ? 600 : 400 }}>{shownValue}</span>
        </div>
        {share != null ? (
          <div aria-hidden style={{ height: 6, marginTop: 4, borderRadius: 999, background: "color-mix(in srgb, var(--_ic-ink) 7%, transparent)" }}>
            <div style={{ width: `${round(share * 100)}%`, minWidth: share > 0 ? 6 : 0, height: "100%", borderRadius: 999, background: current ? ACCENT : "var(--_ic-context)" }} />
          </div>
        ) : null}
      </div>
    );
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="comparison" style={{ marginTop: gap, display: "grid", rowGap: 8, textAlign: "left" }}>
        {row(valueLabel ?? "Now", text, top != null ? Math.abs(a!) / top : null, true)}
        {row(comparisonLabel ?? "Before", typeof comparison === "number" ? fmt(comparison) : comparison, top != null ? Math.abs(b!) / top : null, false)}
      </div>
    );
  } else if (shown === "icon") {
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="icon" style={side ? { flex: "none" } : { display: "flex", justifyContent: justify, marginBottom: 12 }}>
        <span data-slot="ic-stat-tile-icon" style={{ display: "grid", placeItems: "center", width: dim.badge, height: dim.badge, borderRadius: 8, background: `color-mix(in srgb, ${ACCENT} ${filled ? 20 : 14}%, transparent)`, color: ACCENT }}>
          <Icon name={icon!} size={dim.glyph} />
        </span>
      </div>
    );
  } else if (shown === "unit") {
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="unit" style={{ marginTop: gap }}>
        <div data-slot="ic-stat-tile-units" role="img" aria-label={unitTotal > count ? `${count} of ${unitTotal}` : `${count}`} style={{ display: "flex", flexWrap: "wrap", justifyContent: justify, gap: 4, color: ACCENT }}>
          {Array.from({ length: unitTotal }, (_, i) => (
            <Icon key={i} name={icon ?? "circle"} size={dim.unit} style={{ opacity: i < count ? 1 : 0.24, verticalAlign: "top" }} />
          ))}
        </div>
        {unitValue !== 1 ? (
          <div data-slot="ic-stat-tile-caption" style={{ marginTop: 8, fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-muted)" }}>
            One icon is {fmt(unitValue)}
          </div>
        ) : null}
      </div>
    );
  } else if (shown === "breakdown") {
    // Past six parts the smallest fold into "Other", as in segmented-bar.
    const sorted = [...list].sort((p, q) => q.value - p.value);
    const kept = list.length > 6 ? list.filter((p) => sorted.indexOf(p) < 5) : list;
    const folded = list.length > 6 ? list.filter((p) => !kept.includes(p)) : [];
    const segments = [...kept.map((p, i) => ({ ...p, color: filled ? `color-mix(in srgb, ${onFill} ${[100, 66, 42, 28, 18, 12][i]}%, ${fill})` : palette[(typeof tone === "number" ? tone + i : i) % palette.length] })), ...(folded.length ? [{ label: `Other (${folded.length})`, value: folded.reduce((s, p) => s + p.value, 0), color: "var(--_ic-context)" }] : [])];
    const sum = segments.reduce((s, p) => s + p.value, 0);
    const share = (v: number) => (v / sum < 0.005 ? "<1%" : pct(v / sum));
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="breakdown" style={{ marginTop: gap }}>
        <div data-slot="ic-stat-tile-parts" role="img" aria-label={segments.map((p) => `${p.label} ${share(p.value)}`).join(", ")} style={{ display: "flex", gap: 2, height: dim.track + 2 }}>
          {segments.map((p, i) => (
            <span key={i} style={{ flex: `${p.value} 1 0`, minWidth: 2, borderRadius: 2, background: p.color }} />
          ))}
        </div>
        <ul data-slot="ic-stat-tile-key" style={{ display: "flex", flexWrap: "wrap", justifyContent: justify, gap: "2px 12px", listStyle: "none", margin: "8px 0 0", padding: 0, fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-ink-2)", textAlign: "left" }}>
          {segments.map((p, i) => (
            <li key={i} style={{ display: "inline-flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
              <span aria-hidden style={{ flex: "none", alignSelf: "center", width: 8, height: 8, borderRadius: 2, background: p.color }} />
              <span style={{ minWidth: 0 }}>{p.label}</span>
              <span style={{ flex: "none", fontWeight: 600, color: "var(--_ic-ink)", fontVariantNumeric: "tabular-nums" }}>{share(p.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (shown === "rank") {
    const place = Math.round(rank as number);
    const total = Math.max(place, Math.round(rankOf ?? place));
    graphic = (
      <div data-slot="ic-stat-tile-graphic" data-graphic="rank" style={{ marginTop: gap }}>
        {total <= 32 ? (
          <div data-slot="ic-stat-tile-strip" aria-hidden style={{ display: "flex", gap: 2, height: 8 }}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} style={{ flex: "1 1 0", minWidth: 0, borderRadius: 2, background: i === place - 1 ? ACCENT : "color-mix(in srgb, var(--_ic-ink) 16%, transparent)" }} />
            ))}
          </div>
        ) : (
          <div data-slot="ic-stat-tile-strip" aria-hidden style={{ position: "relative", height: 8, borderRadius: 999, background: "color-mix(in srgb, var(--_ic-ink) 12%, transparent)" }}>
            <span style={{ position: "absolute", top: -2, left: `${round(((place - 1) / (total - 1)) * 100)}%`, width: 12, height: 12, marginLeft: -6, boxSizing: "border-box", borderRadius: 999, background: ACCENT, border: "2px solid var(--_ic-surface)" }} />
          </div>
        )}
        {total > 1 ? (
          <div data-slot="ic-stat-tile-caption" aria-hidden style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-muted)", fontVariantNumeric: "tabular-nums" }}>
            <span>{ordinal(1, config.locale)}</span>
            <span>{ordinal(total, config.locale)}</span>
          </div>
        ) : null}
      </div>
    );
  }

  // The `trend` slot keeps working in every variant that does not already draw the series.
  const hasTrend = trend != null && trend !== false && !(drawsSeries && isSeries(trend));
  const trendSide = hasTrend && trendPosition === "right" && !side && !split && (measured === 0 || inner >= 248);
  const trendNode = hasTrend ? (
    <div data-slot="ic-stat-tile-trend" style={trendSide ? { flex: "1 1 0", minWidth: 0, maxWidth: 180, alignSelf: "flex-end" } : { minWidth: 0, marginTop: 14 }}>
      {isSeries(trend) ? (
        <div data-slot="ic-stat-tile-spark" role="img" aria-label={`Trend over ${trend.length} points, from ${makeFormatter()(trend[0])} to ${makeFormatter()(trend[trend.length - 1])}`}>
          <LineGraphic values={trend} width={trendSide ? Math.min(180, Math.max(72, Math.round(inner * 0.42))) : inner} height={trendSide ? 44 : 36} />
        </div>
      ) : (
        renderSlot(trend as Slot)
      )}
    </div>
  ) : null;

  const before = (shown === "ring" || shown === "icon") && !side;
  const figureNode = (
    <div data-slot="ic-stat-tile-figure" style={{ minWidth: 0, flex: side || split || trendSide ? "1 1 0" : undefined }}>
      {figure}
      {!side && !split && !before ? graphic : null}
      {(side || split) && !trendSide ? trendNode : null}
    </div>
  );

  const ground: CSSProperties = filled
    ? { background: fill, border: "1px solid transparent" }
    : surface === "tinted"
      ? { background: "var(--_ic-surface)", border: `1px solid color-mix(in srgb, ${toneColor} 24%, ${tokens.surface})` }
      : surface === "borderless"
        ? {}
        : surface === "outline-accent"
          ? edge === "top"
            ? { borderTop: `2px solid ${ACCENT}` }
            : { borderLeft: `2px solid ${ACCENT}` }
          : { background: "var(--_ic-surface)", border: "1px solid var(--_ic-grid)" };
  // A named theme paints its own ground; a filled or tinted tile is already its own ground.
  const framed: CSSProperties = painter ? { ...(filled || surface === "tinted" ? null : { background: painter.background }), borderRadius: painter.borderRadius } : {};

  return (
    <div
      ref={ref}
      data-slot="ic-stat-tile"
      data-ic-mode={mode}
      data-variant={shown}
      data-surface={surface}
      data-size={size}
      className={className}
      style={{
        ...(vars as CSSProperties),
        fontFamily: "var(--_ic-font)",
        color: "var(--_ic-ink)",
        boxSizing: "border-box",
        minWidth: 0,
        textAlign: align,
        borderRadius: open ? 0 : 10,
        ...ground,
        ...framed,
        ...(surface === "outline-accent" ? { borderRadius: 0 } : null),
        padding: `${box.t}px ${box.r}px ${box.b}px ${box.l}px`,
        overflow: shown === "area" || split ? "hidden" : undefined,
        // In a grid row a tile may be stretched taller than its content; the split panel follows.
        ...(split ? { display: "flex", flexDirection: "column" } : null),
        ...style,
      }}
    >
      {side || split || trendSide ? (
        <div data-slot="ic-stat-tile-row" style={{ flex: "1 1 auto", display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: shown === "icon" ? 12 : 16, flexDirection: shown === "icon" ? "row-reverse" : "row" }}>
          {figureNode}
          {side || split ? graphic : trendNode}
        </div>
      ) : (
        <>
          {before ? graphic : null}
          {figureNode}
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

const MAU = [21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210];
// One metric, used by every variant below: 48,210 monthly active users in December,
// 8.3% above September's 44,500, against a target of 50,000. Illustrative.
const users = { label: "Monthly active users", value: 48210, delta: 0.083, deltaLabel: "vs September", series: MAU };
const narrow = { style: { maxWidth: 300 } };

export const StatTile = withMeta(StatTileImpl, {
  name: "stat-tile",
  component: "StatTile",
  title: "Stat tile",
  level: "atom",
  category: "figure",
  description: "A compact KPI tile: label, value, change against a baseline and an optional graphic. Twenty variants display the same data as a card, a trend, progress toward a target, a comparison, a breakdown, a rank or a count of icons.",
  whenToUse: "Dashboard grids and KPI rows of three to six figures. Pass the data once (`value`, `delta`, `series`, `target`, `parts`, `icon`) and choose the display with `variant`; change `surface`, `tone` and `size` to set emphasis. Give every tile a delta or a context line.",
  avoid: "The single number a story leads with (use `big-number` with `size: \"hero\"`). Do not put a full chart with axes in the trend slot. Use `unit` only for counts up to 60 icons.",
  props: [
    { name: "label", type: "string", required: true, description: "What it measures, sentence case." },
    { name: "value", type: "number | string", required: true, description: "The figure. Numbers are formatted with `format`. `progress`, `ring` and `unit` need a number." },
    { name: "delta", type: "number | string", description: "Change against a baseline. Numbers render as signed percentages (0.12 is +12%). `comparison` computes it from `value` and `comparison` when omitted." },
    { name: "deltaLabel", type: "string", description: 'What the delta is against, e.g. "vs last month".' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is an improvement. Sets the delta colour; the arrow and sign always show the direction." },
    { name: "context", type: "string", description: "A line that states a comparison or reference for the number." },
    {
      name: "variant",
      type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent" | "sparkline" | "area" | "bars" | "dots" | "progress" | "ring" | "comparison" | "delta-first" | "icon" | "unit" | "breakdown" | "rank" | "split" | "compact" | "hero"',
      default: '"plain"',
      description:
        "The display. Grounds: `plain` (bordered card), `borderless`, `filled` (solid tone with contrasting ink), `tinted` (10% wash), `outline-accent` (a 2px rule on one edge). Trends, from `series`: `sparkline` (line), `area` (filled, edge to edge along the bottom, zero-based), `bars` (columns, zero-based), `dots`, `split` (figure left, line in a tinted panel right), `compact` (one line: label, small line, value, change). Goals, from `target` or `max`: `progress` (bar with the target marked), `ring`. Others: `comparison` (needs `comparison`: two labelled bars), `delta-first` (the change is the large figure), `icon` (needs `icon`: a tinted badge), `unit` (the count as repeated icons, up to 60), `breakdown` (needs `parts`: a segmented bar with a key), `rank` (needs `rank`: \"3rd of 12\" with a position strip), `hero` (a numeral of 40 to 96px). A variant whose data is missing renders as `plain`.",
    },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "The ground, independent of the display, so any variant can sit on any ground: `variant: \"sparkline\", surface: \"filled\"`. Default: the variant's own, otherwise `plain`." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number', default: '"accent"', description: "Colour of the graphic and of a filled or tinted ground. A number picks from the theme's categorical palette, 0-based. `neutral` is ink." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Type and padding scale: 22, 28 or 36px numerals with 12, 16 or 20px padding. The numeral shrinks to fit a narrow tile." },
    { name: "align", type: '"left" | "center" | "right"', default: '"left"', description: "Text alignment." },
    { name: "orientation", type: '"vertical" | "horizontal"', description: "Graphic under the figure or beside it, for `sparkline`, `bars`, `dots`, `ring` and `icon`. Default `vertical`, `horizontal` for `ring`. Falls back to vertical under about 250px (180px for `ring` and `icon`)." },
    { name: "series", type: "number[]", description: "Past values in time order, oldest first, ending with the current value, in the units of `value`. A numeric `trend` array is used when `series` is omitted." },
    { name: "target", type: "number", description: "The goal for `value`, marked on `progress` and `ring`." },
    { name: "targetLabel", type: "string", default: '"Target"', description: "Name for the target." },
    { name: "max", type: "number", description: "End of the scale for `progress` and `ring`, and the total count drawn by `unit`. Default: the target, or 1 for a share." },
    { name: "comparison", type: "number | string", description: "The value compared with, for `comparison`: a previous period or a peer." },
    { name: "comparisonLabel", type: "string", default: '"Before"', description: 'Names the comparison value, e.g. "September".' },
    { name: "valueLabel", type: "string", default: '"Now"', description: 'Names the current value in `comparison`, e.g. "December".' },
    { name: "parts", type: "{ label: string; value: number }[]", description: "What the value is made of, for `breakdown`. Should sum to `value`. Past six parts the smallest fold into Other." },
    { name: "icon", type: "IconInput", description: "A built-in icon name or `path://...`, for `icon` and `unit`. `unit` defaults to `circle`." },
    { name: "unitValue", type: "number", default: "1", description: "What one icon stands for in `unit`. A caption states it when it is not 1." },
    { name: "rank", type: "number", description: "Position in a ranking, 1 is first, for `rank`." },
    { name: "rankOf", type: "number", description: "Number of entries ranked. Up to 32 are drawn as one segment each." },
    { name: "edge", type: '"left" | "top"', default: '"left"', description: "Which edge carries the rule on an `outline-accent` surface." },
    { name: "trend", type: "Slot | number[]", description: "A chart spec, a React element, or an array of numbers drawn as a sparkline. Works in every variant that does not draw `series` itself." },
    { name: "trendPosition", type: '"bottom" | "right"', default: '"bottom"', description: "Where the trend slot sits; `right` falls back to `bottom` in narrow tiles." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for `value`, `target`, `max`, `comparison` and `series`." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides. A named theme paints its own ground behind the tile.' },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "children", type: "ReactNode", description: "Extra content at the bottom of the tile." },
  ],
  example: { type: "stat-tile", label: "Monthly active users", value: 48210, format: "compact", delta: 0.083, deltaLabel: "vs September", trend: [38.1, 39.4, 39.0, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46.0, 47.2, 48.2], style: { maxWidth: 300 } },
});

export const examples = {
  // Grounds: the same figure on each surface.
  "Plain": { ...users, variant: "plain", ...narrow },
  "Borderless": { ...users, variant: "borderless", ...narrow },
  "Filled": { ...users, variant: "filled", ...narrow },
  "Tinted": { ...users, variant: "tinted", ...narrow },
  "Outline accent": { ...users, variant: "outline-accent", ...narrow },
  "Outline accent, rule on the top edge": { ...users, variant: "outline-accent", edge: "top", tone: 2, ...narrow },
  // Trends: the same twelve months.
  "Sparkline": { ...users, variant: "sparkline", ...narrow },
  "Area": { ...users, variant: "area", ...narrow },
  "Bars": { ...users, variant: "bars", ...narrow },
  "Dots": { ...users, variant: "dots", ...narrow },
  "Split": { ...users, variant: "split", style: { maxWidth: 420 } },
  "Sparkline beside the figure": { ...users, variant: "sparkline", orientation: "horizontal", style: { maxWidth: 420 } },
  // Goals.
  "Progress": { ...users, variant: "progress", target: 50000, targetLabel: "Q4 target", ...narrow },
  "Ring": { ...users, variant: "ring", target: 50000, context: "Q4 target is 50,000", ...narrow },
  "Ring above the figure": { ...users, variant: "ring", orientation: "vertical", align: "center", size: "lg", target: 50000, context: "Q4 target is 50,000", style: { maxWidth: 240 } },
  // Comparisons.
  "Comparison": { variant: "comparison", label: "Monthly active users", value: 48210, valueLabel: "December", comparison: 44500, comparisonLabel: "September", ...narrow },
  "Delta first": { ...users, variant: "delta-first", ...narrow },
  "Rank": { label: "Monthly active users", value: 48210, context: "users in December", variant: "rank", rank: 3, rankOf: 12, delta: "2 places", deltaLabel: "since September", ...narrow },
  // Composition and counts.
  "Breakdown": { ...users, variant: "breakdown", parts: [{ label: "Free", value: 28930 }, { label: "Team", value: 13500 }, { label: "Enterprise", value: 5780 }], ...narrow },
  "Icon": { ...users, variant: "icon", icon: "group", ...narrow },
  "Icon beside the figure": { ...users, variant: "icon", icon: "group", orientation: "horizontal", surface: "tinted", ...narrow },
  "Unit": { label: "Offshore wind farms connected in 2024", value: 14, max: 20, variant: "unit", icon: "wind-turbine", context: "14 of the 20 planned for the year", ...narrow },
  "Unit, one icon is 1,000 users": { label: "Monthly active users", value: 48000, format: "compact", unitValue: 1000, variant: "unit", icon: "person", size: "sm", delta: 0.083, deltaLabel: "vs September", ...narrow },
  // Scale.
  "Compact": { ...users, variant: "compact", style: { maxWidth: 420 } },
  "Hero": { ...users, variant: "hero", format: "compact", context: "The Q4 target is 50,000.", style: { maxWidth: 420 } },
  "Small, centred": { ...users, size: "sm", align: "center", variant: "tinted", tone: 3, style: { maxWidth: 200 } },
  "Large, dots": { ...users, size: "lg", variant: "dots", tone: 1, style: { maxWidth: 360 } },
  // Surface and display combined.
  "Area on a filled ground": { ...users, variant: "area", surface: "filled", ...narrow },
  "Bars on a tinted ground, positive tone": { ...users, variant: "bars", surface: "tinted", tone: "positive", ...narrow },
  "Progress on a filled ground, neutral tone": { ...users, variant: "progress", surface: "filled", tone: "neutral", target: 50000, ...narrow },
  // Themes by name: each paints its own ground.
  "Ledger: operating margin against plan": { theme: "ledger", label: "Operating margin, FY2024", value: 0.184, format: "percent", variant: "progress", target: 0.2, max: 0.25, targetLabel: "Plan", delta: "+1.6 pts", deltaLabel: "vs FY2023", ...narrow },
  "Editorial: unemployment rate": { theme: "editorial", label: "Unemployment rate, December 2024", value: "4.3%", delta: "+0.4 pts", deltaLabel: "vs January", upIsGood: false, variant: "sparkline", series: [3.9, 3.8, 3.8, 3.6, 3.5, 3.6, 3.4, 3.7, 3.8, 3.9, 4.1, 4.3], ...narrow },
  "Forest: tree cover by land owner": { theme: "forest", label: "Tree cover, hectares", value: 12400, variant: "breakdown", parts: [{ label: "State", value: 6820 }, { label: "Private", value: 4340 }, { label: "Community", value: 1240 }], context: "Surveyed in 2024", ...narrow },
  "Noir: league position": { theme: "noir", label: "League position after 30 matches", value: "61 points", variant: "rank", rank: 4, rankOf: 20, delta: "2 places", deltaLabel: "since matchday 20", ...narrow },
  "Magenta: ticket sales": { theme: "magenta", label: "Tickets sold for the final", value: 68400, variant: "ring", max: 72000, context: "Capacity is 72,000", size: "lg", style: { maxWidth: 340 } },
  "Ocean: offshore wind capacity": { theme: "ocean", label: "Offshore wind capacity, 2024", value: 26.3, format: "{value} GW", delta: 0.342, deltaLabel: "vs 2023", variant: "area", series: [2.1, 3.4, 5.0, 7.9, 11.2, 14.8, 19.6, 26.3], ...narrow },
  "Sunrise: store visits": { theme: "sunrise", label: "Store visits, week 50", value: 18640, comparison: 16200, valueLabel: "Week 50, 2024", comparisonLabel: "Week 50, 2023", variant: "comparison", ...narrow },
  "Blueprint: units assembled": { theme: "blueprint", label: "Units assembled per shift, week 8", value: 318, variant: "bars", series: [212, 240, 198, 265, 281, 254, 302, 318], delta: 0.5, deltaLabel: "vs week 1", ...narrow },
  "Science: vaccination coverage": { theme: "science", label: "Children vaccinated against measles", value: 0.91, format: "percent", variant: "ring", target: 0.95, max: 1, targetLabel: "WHO target", context: "The WHO target is 95%.", ...narrow },
  "Dusk: night trains": { theme: "dusk", label: "Night train routes opened since 2020", value: 9, variant: "unit", icon: "train", context: "Across 6 countries", ...narrow },
  "Paper: household energy bill": { theme: "paper", label: "Average annual energy bill", value: 1717, format: "currency:GBP", delta: -0.124, deltaLabel: "vs 2023", upIsGood: false, variant: "delta-first", ...narrow },
  "Earth: bottles returned for refill": { theme: "earth", label: "Bottles returned for refill", value: 0.72, format: "percent", variant: "icon", icon: "bottle", orientation: "horizontal", delta: "+9 pts", deltaLabel: "vs 2022", ...narrow },
  "Mono: compact row": { theme: "mono", label: "Median first-response time", value: "2 h 14 min", delta: -0.18, upIsGood: false, deltaLabel: "vs last quarter", variant: "compact", series: [4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2], style: { maxWidth: 420 } },
  "Poster: hero figure": { theme: "poster", label: "Solar capacity added worldwide in 2024", value: "597 GW", delta: 0.33, deltaLabel: "vs 2023", variant: "hero", style: { maxWidth: 420 } },
  // The original slots still work.
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
