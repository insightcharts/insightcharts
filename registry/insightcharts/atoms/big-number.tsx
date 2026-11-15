"use client";

import { type CSSProperties, useRef } from "react";
import { useInsightStyles, makeFormatter, type FormatSpec, withMeta, useColorMode, type ModeInput, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

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
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

/**
 * A featured statistic: numeral, label and the context that makes it mean something.
 * Use this instead of a one-bar chart, a gauge or a donut with a number in the middle.
 */
function BigNumberImpl({ value, label, context, delta, deltaLabel, upIsGood = true, format, size = "stat", align = "left", className, style, ...rest }: BigNumberProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const text = typeof value === "number" ? makeFormatter(format, config.locale)(value) : value;
  const d = typeof delta === "number" ? delta : undefined;
  const deltaText = typeof delta === "number" ? makeFormatter({ style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 }, config.locale)(delta) : delta?.replace(/^-/, "\u2212");
  const direction = d == null ? (typeof delta === "string" ? (/^[-−]/.test(delta) ? -1 : 1) : 0) : Math.sign(d);
  const good = direction === 0 ? null : direction > 0 === upIsGood;
  const hero = size === "hero";
  return (
    <div ref={ref} data-slot="ic-big-number" data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", textAlign: align, minWidth: 0, containerType: "inline-size", ...style }}>
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
  ],
  example: { type: "big-number", value: 0.317, format: "percent", label: "Share of global electricity from renewables", delta: 0.021, deltaLabel: "vs 2023", context: "Up from 19% in 2010" },
});
