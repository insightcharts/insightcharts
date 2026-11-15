import type { CSSProperties } from "react";
import { useId, useRef } from "react";
import { useInsightStyles } from "../core/figure";
import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface ProgressMeterProps {
  /** The current value. */
  value: number;
  /** What is being measured, sentence case. */
  label: string;
  /** The end of the track. Defaults to the target, or to 1 when there is no target. */
  max?: number;
  /** The start of the track. Default 0. */
  min?: number;
  /** A goal or threshold, drawn as a tick on the track and labelled below it. */
  target?: number;
  /** Name for the target tick. Default "Target". */
  targetLabel?: string;
  /** Print "of {max}" after the value. Default: only when `max` is given. */
  showMax?: boolean;
  /** A line under the meter: what the number means, or by when. */
  context?: string;
  format?: FormatSpec;
  /** Fill colour by meaning. Default `"accent"`. */
  tone?: "accent" | "positive" | "negative" | "neutral";
  /** `"md"` has an 8px track, `"sm"` a 6px track with smaller text for dense lists. */
  size?: "sm" | "md";
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const FILL = { accent: "var(--_ic-accent)", positive: "var(--_ic-positive)", negative: "var(--_ic-negative)", neutral: "var(--_ic-ink-2)" } as const;

/**
 * A labelled horizontal meter: one value against a maximum or a target. The value is always
 * printed, so the bar is never the only way to read it.
 */
function ProgressMeterImpl({ value, label, max, min = 0, target, targetLabel = "Target", showMax, context, format, tone = "accent", size = "md", className, style, ...rest }: ProgressMeterProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const id = useId();

  // With only a target, the track ends at the target unless the value has passed it.
  const end = max ?? (target != null ? Math.max(target, value) : 1);
  const span = end - min || 1;
  const pct = (n: number) => Math.min(100, Math.max(0, ((n - min) / span) * 100));
  const fmt = makeFormatter(format ?? (end <= 1 && min >= 0 ? "percent" : "auto"), config.locale);
  const valuePct = pct(value);
  const targetPct = target != null ? pct(target) : null;
  const fill = FILL[tone];
  const track = size === "sm" ? 6 : 8;
  const small = size === "sm" ? "0.75rem" : "0.8125rem";
  const targetText = target != null ? `${targetLabel} ${fmt(target)}` : "";
  const withMax = showMax ?? max != null;

  return (
    <div ref={ref} data-slot="ic-progress-meter" data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, ...style }}>
      <div data-slot="ic-progress-meter-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, fontSize: size === "sm" ? "0.8125rem" : "0.875rem", lineHeight: 1.4 }}>
        <span id={id} data-slot="ic-progress-meter-label" style={{ minWidth: 0, fontWeight: 500, color: "var(--_ic-ink)" }}>
          {label}
        </span>
        <span data-slot="ic-progress-meter-value" style={{ flex: "none", fontVariantNumeric: "tabular-nums", fontWeight: 650, color: "var(--_ic-ink)" }}>
          {fmt(value)}
          {withMax ? <span style={{ fontWeight: 400, color: "var(--_ic-muted)" }}> of {fmt(end)}</span> : null}
        </span>
      </div>
      <div
        data-slot="ic-progress-meter-track"
        role="meter"
        aria-labelledby={id}
        aria-valuemin={min}
        aria-valuemax={end}
        aria-valuenow={Math.min(end, Math.max(min, value))}
        aria-valuetext={`${fmt(value)}${withMax ? ` of ${fmt(end)}` : ""}${targetText ? `, ${targetText.toLowerCase()}` : ""}`}
        // A lighter step of the fill colour, so track and fill read as one object.
        style={{ position: "relative", height: track, marginTop: 8, borderRadius: 999, background: `color-mix(in srgb, ${fill} 18%, transparent)` }}
      >
        <div data-slot="ic-progress-meter-fill" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${valuePct}%`, minWidth: valuePct > 0 ? track : 0, borderRadius: 999, background: fill }} />
        {targetPct != null ? (
          <div data-slot="ic-progress-meter-target" aria-hidden style={{ position: "absolute", top: -4, bottom: -4, left: `clamp(1px, ${targetPct}%, calc(100% - 1px))`, width: 2, marginLeft: -1, borderRadius: 1, background: "var(--_ic-ink)", boxShadow: "0 0 0 2px var(--_ic-surface)" }} />
        ) : null}
      </div>
      {targetPct != null ? (
        <div data-slot="ic-progress-meter-target-label" style={{ position: "relative", height: "1.4em", marginTop: 7, fontSize: small, lineHeight: 1.4, color: "var(--_ic-ink-2)", fontVariantNumeric: "tabular-nums" }}>
          {/* Anchored to the tick, flipping to the nearer edge so it never leaves the track. */}
          <span style={{ position: "absolute", whiteSpace: "nowrap", ...(targetPct > 78 ? { right: `${100 - targetPct}%`, transform: targetPct > 96 ? undefined : "translateX(min(50%, 1.5em))" } : targetPct < 22 ? { left: `${targetPct}%`, transform: targetPct < 4 ? undefined : "translateX(max(-50%, -1.5em))" } : { left: `${targetPct}%`, transform: "translateX(-50%)" }) }}>{targetText}</span>
        </div>
      ) : null}
      {context ? (
        <div data-slot="ic-progress-meter-context" style={{ marginTop: targetPct != null ? 2 : 8, fontSize: small, lineHeight: 1.45, color: "var(--_ic-muted)", textWrap: "pretty" }}>
          {context}
        </div>
      ) : null}
    </div>
  );
}

export const ProgressMeter = withMeta(ProgressMeterImpl, {
  name: "progress-meter",
  component: "ProgressMeter",
  title: "Progress meter",
  level: "atom",
  category: "figure",
  description: "A labelled horizontal meter of one value against a maximum or target, with the target marked and the value printed.",
  whenToUse: "Progress toward a goal, a quota or a capacity: funds raised, budget spent, share of a target reached. Stack several with `size: \"sm\"` to compare progress across a few items.",
  avoid: "Comparing more than a handful of items (use `bar-chart`), anything without a meaningful end point (use `big-number`), or a gauge dial.",
  props: [
    { name: "value", type: "number", required: true, description: "The current value." },
    { name: "label", type: "string", required: true, description: "What is measured, sentence case." },
    { name: "max", type: "number", description: "End of the track. Defaults to the target, or 1 with no target." },
    { name: "min", type: "number", default: "0", description: "Start of the track." },
    { name: "target", type: "number", description: "A goal or threshold, drawn as a tick and labelled." },
    { name: "targetLabel", type: "string", default: '"Target"', description: "Name for the target tick." },
    { name: "showMax", type: "boolean", description: 'Print "of {max}" after the value. Default: only when `max` is given.' },
    { name: "context", type: "string", description: "A line under the meter that gives the number meaning." },
    { name: "format", type: "FormatSpec", description: 'Number format. Defaults to `"percent"` when the track ends at 1 or less, otherwise `"auto"`.' },
    { name: "tone", type: '"accent" | "positive" | "negative" | "neutral"', default: '"accent"', description: "Fill colour by meaning." },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "`sm` for dense stacks." },
  ],
  example: { type: "progress-meter", label: "Homes with a heat pump or district heating", value: 0.46, max: 1, showMax: false, target: 0.7, targetLabel: "2030 target", context: "Up from 31% in 2020. At the current rate the target is reached in 2033." },
});

export const examples = {
  "Against a maximum": { label: "Annual carbon budget used", value: 318, max: 400, format: "{value} Mt", tone: "negative", context: "With ten weeks of the year left." },
  "Target passed": { label: "Fundraising round", value: 2_340_000, target: 2_000_000, format: "currency:USD", tone: "positive", context: "Closed 17% above the goal." },
  "Small, low value": { size: "sm", label: "Rural fibre coverage", value: 0.08, target: 0.95, targetLabel: "Goal" },
};
