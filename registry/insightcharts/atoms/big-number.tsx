"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { cssFallback, inkOn, toRgba, useInsightStyles, makeFormatter, type FormatSpec, Icon, type IconInput, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput, useContainerWidth } from "insightcharts/core";

/** How a big number is dressed: on a ground, or with one supporting graphic. */
export type BigNumberVariant = "plain" | "filled" | "tinted" | "with-icon" | "with-ring" | "with-trend";

export interface BigNumberProps {
  /** The figure. Numbers are formatted with `format`; strings are shown as written. */
  value: number | string;
  /** What the figure measures, in sentence case. */
  label: string;
  /** The line that gives the number meaning: a comparison, a denominator, a period. */
  context?: string;
  /** Change against a named baseline. Numbers are formatted as signed percentages (0.12 is +12%). */
  delta?: number | string;
  /** What the delta is measured against, e.g. "vs last quarter". */
  deltaLabel?: string;
  /** Whether an increase is good news. Decides the delta's colour. Default true. */
  upIsGood?: boolean;
  format?: FormatSpec;
  /** `"hero"` for the single number a piece leads with; `"stat"` for a row of several. */
  size?: "hero" | "stat";
  align?: "left" | "center";
  /** The display. Default `"plain"`. A variant whose data is missing renders as `"plain"`. */
  variant?: BigNumberVariant;
  /** Colour of the ground or graphic. Default `"accent"`. A number picks a categorical colour (0-based). */
  tone?: "neutral" | "accent" | "positive" | "negative" | number;
  /** An icon name from the built-in set, or `path://...`, for `with-icon`. */
  icon?: IconInput;
  /** Past values in time order, oldest first, for `with-trend`. */
  series?: number[];
  /** A goal for `value`, for `with-ring`. */
  target?: number;
  /** End of the ring's scale. Default: the target, or 1 for a share. */
  max?: number;
  /** Paint a named theme's own background behind the figure. Default true when `theme` is a theme name. */
  frame?: boolean;
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const ACCENT = "var(--_ic-accent)";
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * A featured statistic: numeral, label and the context that makes it mean something.
 * Use this instead of a one-bar chart, a gauge or a donut with a number in the middle.
 */
function BigNumberImpl({ value, label, context, delta, deltaLabel, upIsGood = true, format, size = "stat", align = "left", variant = "plain", tone, icon, series, target, max, frame, className, style, ...rest }: BigNumberProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const [ref, measured] = useContainerWidth<HTMLDivElement>(0);
  const theme = useTheme(rest.theme);
  // A filled figure paints its own ground, so the colour mode is read from its parent.
  const outside = useMemo(() => ({ get current() { return ref.current?.parentElement ?? null; } }), [ref]);
  const { mode } = useColorMode(variant === "filled" ? outside : ref, rest.mode ?? config.mode);
  const tokens = theme[mode];
  const text = typeof value === "number" ? makeFormatter(format, config.locale)(value) : value;
  const d = typeof delta === "number" ? delta : undefined;
  const deltaText = typeof delta === "number" ? makeFormatter({ style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 }, config.locale)(delta) : delta?.replace(/^-/, "\u2212");
  const direction = d == null ? (typeof delta === "string" ? (/^[-−]/.test(delta) ? -1 : 1) : 0) : Math.sign(d);
  const good = direction === 0 ? null : direction > 0 === upIsGood;
  const hero = size === "hero";

  const palette = tokens.categorical;
  const toneColor = typeof tone === "number" ? palette[((Math.round(tone) % palette.length) + palette.length) % palette.length] : tone === "positive" ? tokens.positive : tone === "negative" ? tokens.negative : tone === "neutral" ? tokens.inkSecondary : tokens.accent;
  const fill = tone === "neutral" ? tokens.ink : toneColor;
  const filled = variant === "filled";
  const tinted = variant === "tinted";
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
  if (filled) Object.assign(vars, { "--_ic-surface": fill, "--_ic-ink": onFill, "--_ic-ink-2": `color-mix(in srgb, ${onFill} 88%, ${fill})`, "--_ic-muted": `color-mix(in srgb, ${onFill} 78%, ${fill})`, "--_ic-grid": `color-mix(in srgb, ${onFill} 22%, ${fill})`, "--_ic-accent": onFill, "--_ic-positive": onFill, "--_ic-negative": onFill });
  const painter = frameStyle(rest.theme, mode, frame);
  const ground: CSSProperties = filled ? { background: fill, padding: hero ? 24 : 16, borderRadius: 12 } : tinted ? { background: `color-mix(in srgb, ${toneColor} 10%, ${tokens.surface})`, padding: hero ? 24 : 16, borderRadius: 12 } : {};

  const numeric = typeof value === "number" && Number.isFinite(value);
  const points = Array.isArray(series) && series.length > 1 && series.every((n) => typeof n === "number" && Number.isFinite(n)) ? series : null;
  const ringOk = variant === "with-ring" && numeric && (target != null || max != null || ((value as number) >= 0 && (value as number) <= 1));
  const inner = measured > 0 ? measured : 320;

  let ring = null;
  if (ringOk) {
    const v = value as number;
    const goal = target ?? max ?? 1;
    const end = max ?? Math.max(goal, v);
    const fraction = end > 0 ? Math.min(1, Math.max(0, v / end)) : 0;
    const side = hero ? Math.min(112, Math.max(72, Math.round(inner * 0.24))) : 64;
    const stroke = Math.round(side / 9);
    const r = (side - stroke) / 2;
    const length = 2 * Math.PI * r;
    const arc = fraction * length;
    const capped = fraction < 1 && arc > stroke;
    const reading = makeFormatter({ style: "percent", maximumFractionDigits: 0 }, config.locale)(fraction);
    const fmt = makeFormatter(format, config.locale);
    ring = (
      <div data-slot="ic-big-number-ring" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={end} aria-valuenow={Math.min(end, Math.max(0, v))} aria-valuetext={`${text}${target != null ? `, target ${fmt(target)}` : max != null ? ` of ${fmt(max)}` : ""}`} style={{ position: "relative", flex: "none", width: side, height: side }}>
        <svg aria-hidden focusable="false" width={side} height={side} viewBox={`0 0 ${side} ${side}`} style={{ display: "block" }}>
          <circle cx={side / 2} cy={side / 2} r={r} fill="none" stroke={ACCENT} strokeOpacity={0.18} strokeWidth={stroke} />
          {fraction > 0 ? <circle cx={side / 2} cy={side / 2} r={r} fill="none" stroke={ACCENT} strokeWidth={stroke} strokeLinecap={capped ? "round" : "butt"} strokeDasharray={`${round(capped ? arc - stroke : arc)} ${round(length)}`} transform={`rotate(${round(-90 + (capped ? (stroke / 2 / r) * (180 / Math.PI) : 0))} ${side / 2} ${side / 2})`} /> : null}
        </svg>
        {reading !== text && Math.abs(fraction - v) > 1e-9 ? <span aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: side >= 88 ? "1.125rem" : "0.8125rem", lineHeight: 1, fontWeight: 650, fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)" }}>{reading}</span> : null}
      </div>
    );
  }

  let trend = null;
  if (variant === "with-trend" && points) {
    const width = hero ? inner : Math.min(inner, 240);
    const height = hero ? 56 : 36;
    const lo = Math.min(...points);
    const span = Math.max(...points) - lo;
    const x = (i: number) => round((i / (points.length - 1)) * (width - 4));
    const y = (n: number) => round(4 + (1 - (span === 0 ? 0.5 : (n - lo) / span)) * (height - 8));
    const auto = makeFormatter(format, config.locale);
    trend = (
      <div data-slot="ic-big-number-trend" role="img" aria-label={`Trend over ${points.length} points, from ${auto(points[0])} to ${auto(points[points.length - 1])}`} style={{ width: hero ? undefined : width, maxWidth: "100%", marginTop: hero ? 16 : 12, marginLeft: align === "center" ? "auto" : undefined, marginRight: align === "center" ? "auto" : undefined }}>
        <svg aria-hidden focusable="false" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
          <polyline points={points.map((n, i) => `${x(i)},${y(n)}`).join(" ")} fill="none" stroke={ACCENT} strokeWidth={hero ? 2.5 : 2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r={4} fill={ACCENT} stroke="var(--_ic-surface)" strokeWidth={2} />
        </svg>
      </div>
    );
  }

  const badge =
    variant === "with-icon" && icon ? (
      <div data-slot="ic-big-number-icon" style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", marginBottom: hero ? 16 : 12 }}>
        <span style={{ display: "grid", placeItems: "center", width: hero ? 56 : 40, height: hero ? 56 : 40, borderRadius: hero ? 12 : 8, background: `color-mix(in srgb, ${ACCENT} 14%, transparent)`, color: ACCENT }}>
          <Icon name={icon} size={hero ? 32 : 22} />
        </span>
      </div>
    ) : null;

  const body = (
    <>
      <div data-slot="ic-big-number-label" style={{ fontSize: hero ? "0.9375rem" : "0.8125rem", lineHeight: 1.4, color: "var(--_ic-ink-2)" }}>
        {label}
      </div>
      <div data-slot="ic-big-number-value" style={{ fontFamily: "var(--_ic-font-display)", fontSize: hero ? "clamp(3rem, 16cqi, 5.5rem)" : "clamp(1.75rem, 12cqi, 2.5rem)", lineHeight: 1.05, fontWeight: 650, letterSpacing: "-0.025em", color: "var(--_ic-ink)", margin: "0.15em 0" }}>
        {text}
      </div>
      {deltaText ? (
        <div data-slot="ic-big-number-delta" style={{ fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--_ic-ink-2)" }}>
          {/* The arrow carries direction, so colour is never the only signal. */}
          <span style={{ fontWeight: 600, color: good == null ? "var(--_ic-ink-2)" : good ? "var(--_ic-positive)" : "var(--_ic-negative)" }}>
            <span aria-hidden>{direction > 0 ? "▲ " : direction < 0 ? "▼ " : ""}</span>
            {deltaText}
          </span>
          {deltaLabel ? ` ${deltaLabel}` : null}
        </div>
      ) : null}
      {context ? (
        <div data-slot="ic-big-number-context" style={{ fontSize: hero ? "1rem" : "0.8125rem", lineHeight: 1.45, color: "var(--_ic-muted)", marginTop: "0.25em", textWrap: "pretty" }}>
          {context}
        </div>
      ) : null}
    </>
  );

  return (
    <div ref={ref} data-slot="ic-big-number" data-ic-mode={mode} data-variant={variant} className={className} style={{ ...(vars as CSSProperties), fontFamily: "var(--_ic-font)", textAlign: align, minWidth: 0, boxSizing: "border-box", containerType: "inline-size", ...(filled || tinted ? null : painter), ...ground, ...style }}>
      {badge}
      {ring ? (
        // The ring sits beside the figure, never around it: the number stays the largest thing.
        <div style={{ display: "flex", flexDirection: align === "center" || inner < 240 ? "column" : "row", alignItems: align === "center" ? "center" : inner < 240 ? "flex-start" : "center", gap: hero ? 24 : 16 }}>
          {ring}
          <div style={{ minWidth: 0, containerType: "inline-size", flex: "1 1 auto", alignSelf: "stretch" }}>{body}</div>
        </div>
      ) : (
        body
      )}
      {trend}
    </div>
  );
}

export const BigNumber = withMeta(BigNumberImpl, {
  name: "big-number",
  component: "BigNumber",
  title: "Big number",
  level: "atom",
  category: "figure",
  description: "A featured statistic with its label, change and the context that gives it meaning.",
  whenToUse: "A single headline figure, or a row of three or four key numbers. Always give it context: a comparison, a denominator or a period.",
  avoid: "Showing a number with no comparison; using a gauge or a one-slice donut for the same job.",
  props: [
    { name: "value", type: "number | string", required: true, description: "The figure. Numbers are formatted with `format`." },
    { name: "label", type: "string", required: true, description: "What it measures, sentence case." },
    { name: "context", type: "string", description: "The comparison, denominator or period that gives it meaning." },
    { name: "delta", type: "number | string", description: "Change against a baseline. Numbers render as signed percentages (0.12 is +12%)." },
    { name: "deltaLabel", type: "string", description: 'What the delta is against, e.g. "vs last quarter".' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news; decides the delta colour." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format." },
    { name: "size", type: '"hero" | "stat"', default: '"stat"', description: "`hero` for the one number a piece leads with." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Text alignment." },
    { name: "variant", type: '"plain" | "filled" | "tinted" | "with-icon" | "with-ring" | "with-trend"', default: '"plain"', description: "The display: `filled` (a solid ground in the tone with contrasting ink), `tinted` (a 10% wash), `with-icon` (needs `icon`: a tinted badge above the label), `with-ring` (needs `target` or `max`, or a share from 0 to 1: a progress ring beside the figure), `with-trend` (needs `series`: a line under the figure). A variant whose data is missing renders as `plain`." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number', default: '"accent"', description: "Colour of the ground or graphic. A number picks from the theme's categorical palette, 0-based." },
    { name: "icon", type: "IconInput", description: "A built-in icon name or `path://...`, for `with-icon`." },
    { name: "series", type: "number[]", description: "Past values in time order, oldest first, ending with the current value, for `with-trend`." },
    { name: "target", type: "number", description: "The goal for `value`, for `with-ring`." },
    { name: "max", type: "number", description: "End of the ring's scale. Default: the target, or 1 for a share." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"editorial"`, or token overrides. A named theme paints its own ground.' },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
  ],
  example: { type: "big-number", value: 0.317, format: "percent", label: "Share of global electricity from renewables", delta: 0.021, deltaLabel: "vs 2023", context: "Up from 19% in 2010" },
});
