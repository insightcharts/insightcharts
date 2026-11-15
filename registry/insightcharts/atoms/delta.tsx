"use client";

import { type CSSProperties, useRef } from "react";
import { useInsightStyles, makeFormatter, type FormatSpec, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface DeltaProps {
  /** The change. Numbers are formatted with `format` (default: signed percent, 0.12 is +12%). Strings are shown as written. */
  value: number | string;
  /** What the change is measured against, e.g. "vs last quarter". */
  label?: string;
  /** Whether an increase is good news. Decides the colour; the arrow always shows the direction. Default true. */
  upIsGood?: boolean;
  /** Override the direction inferred from the sign, for string values such as "2 places". */
  direction?: "up" | "down" | "flat";
  format?: FormatSpec;
  /** Text size. Inherits from the surrounding text when omitted. */
  size?: "sm" | "md" | "lg" | "xl";
  /** `"pill"` wraps the value in a tinted capsule, for use in tiles and table cells; `"solid"` fills the capsule. */
  variant?: "text" | "pill" | "solid";
  /**
   * Colour of the value. `"auto"` (default) is positive or negative according to the direction and `upIsGood`.
   * `"inherit"` takes the surrounding text colour, for use on a coloured ground.
   */
  tone?: "auto" | "neutral" | "accent" | "positive" | "negative" | "inherit";
  /** Paint a named theme's own background behind the indicator. Default true when `theme` is a theme name. */
  frame?: boolean;
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const SIZES = { sm: "0.75rem", md: "0.875rem", lg: "1rem", xl: "1.25rem" } as const;
const TONES = { neutral: "var(--_ic-ink-2)", accent: "var(--_ic-accent)", positive: "var(--_ic-positive)", negative: "var(--_ic-negative)", inherit: "currentColor" } as const;
const WORD = { 1: "Up", [-1]: "Down", 0: "No change" } as const;

/**
 * An inline change indicator: arrow, signed value and an optional baseline label.
 * Direction is carried by the arrow and the sign, so colour is never the only signal.
 */
function DeltaImpl({ value, label, upIsGood = true, direction, format, size, variant = "text", tone = "auto", frame, className, style, ...rest }: DeltaProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLSpanElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);

  const numeric = typeof value === "number";
  const text = numeric ? makeFormatter(format ?? { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 }, config.locale)(value) : value.replace(/^-(?=[\d.])/, "−");
  const inferred: 1 | 0 | -1 = numeric ? (value > 0 ? 1 : value < 0 ? -1 : 0) : /^\s*[-−]/.test(value) ? -1 : /^\s*(\+?0+([.,]0+)?\s*(%|pp|pts?)?|[–—]|n\/a)\s*$/i.test(value) ? 0 : 1;
  const dir: 1 | 0 | -1 = direction ? (direction === "up" ? 1 : direction === "down" ? -1 : 0) : inferred;
  const good = dir === 0 ? null : dir > 0 === upIsGood;
  const plain = tone === "auto" ? good == null : tone === "neutral" || tone === "inherit";
  const base = tone !== "auto" ? TONES[tone] : good == null ? "var(--_ic-ink-2)" : good ? "var(--_ic-positive)" : "var(--_ic-negative)";
  // Mixed toward ink so small coloured text clears 4.5:1 on the surface in both modes.
  const color = plain ? base : `color-mix(in srgb, ${base} 76%, var(--_ic-ink))`;
  const pill: CSSProperties =
    variant === "pill"
      ? { padding: "0.14em 0.55em", borderRadius: 999, background: `color-mix(in srgb, ${base} ${plain ? 10 : 13}%, transparent)` }
      : variant === "solid"
        ? { padding: "0.14em 0.6em", borderRadius: 999, background: color, color: "var(--_ic-surface)" }
        : {};

  return (
    <span ref={ref} data-slot="ic-delta" data-direction={dir > 0 ? "up" : dir < 0 ? "down" : "flat"} data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", fontSize: size ? SIZES[size] : undefined, lineHeight: 1.4, display: "inline-flex", alignItems: "baseline", flexWrap: "wrap", columnGap: "0.4em", verticalAlign: "baseline", color: tone === "inherit" ? "inherit" : "var(--_ic-ink-2)", ...frameStyle(rest.theme, mode, frame), ...style }}>
      <span data-slot="ic-delta-value" style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color, ...pill }}>
        {/* No glyph when flat: a dash beside "0%" reads as a minus sign. */}
        {dir !== 0 ? (
          <svg data-slot="ic-delta-arrow" aria-hidden viewBox="0 0 10 10" width="0.68em" height="0.68em" style={{ flex: "none", display: "block" }}>
            <path d={dir > 0 ? "M5 1 9.4 8.6H0.6Z" : "M5 9 0.6 1.4h8.8Z"} fill="currentColor" />
          </svg>
        ) : null}
        {/* The sign is visible, but a screen reader may skip "+" and "−"; the word makes it explicit. */}
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>{WORD[dir]} </span>
        {text}
      </span>
      {label ? <span data-slot="ic-delta-label">{label}</span> : null}
    </span>
  );
}

export const Delta = withMeta(DeltaImpl, {
  name: "delta",
  component: "Delta",
  title: "Delta",
  level: "atom",
  category: "figure",
  description: "An inline change indicator: direction arrow, signed value and an optional baseline label.",
  whenToUse: "Next to a figure, in a sentence, a table cell or a tile, to say how much it changed and against what. Set `upIsGood: false` for measures where a fall is the good news (churn, emissions, wait times).",
  avoid: "Standing alone as the main figure (use `big-number` or `stat-tile`, which include a delta). Do not omit the baseline label unless the surrounding text names it.",
  props: [
    { name: "value", type: "number | string", required: true, description: "The change. Numbers format as signed percentages by default (0.12 is +12%)." },
    { name: "label", type: "string", description: 'The baseline, e.g. "vs last quarter".' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news; decides the colour only." },
    { name: "direction", type: '"up" | "down" | "flat"', description: "Override the direction inferred from the sign." },
    { name: "format", type: "FormatSpec", default: "signed percent", description: 'Number format, e.g. `"signed"` for absolute changes or `"{value} pts"`.' },
    { name: "size", type: '"sm" | "md" | "lg" | "xl"', description: "12, 14, 16 or 20px. Inherits the surrounding size when omitted." },
    { name: "variant", type: '"text" | "pill" | "solid"', default: '"text"', description: "`pill` adds a tinted capsule behind the value; `solid` fills the capsule and sets the value in the surface colour." },
    { name: "tone", type: '"auto" | "neutral" | "accent" | "positive" | "negative" | "inherit"', default: '"auto"', description: "Colour of the value. `auto` follows the direction and `upIsGood`; `inherit` takes the surrounding text colour, for a coloured ground." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides. A named theme paints its own ground.' },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
  ],
  example: { type: "delta", value: 0.124, label: "vs last quarter", size: "md" },
});
