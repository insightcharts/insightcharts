import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { useInsightStyles } from "../core/figure";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { frameStyle, useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export type CalloutTone = "neutral" | "positive" | "negative" | "accent";

export interface CalloutProps {
  /** The fact in a few bold words, with its number: "Monthly churn fell from 4.2% to 2.1% in 2024". */
  lead?: string;
  /** One sentence of explanation or evidence. */
  text?: string;
  /** JSX alternative to `text`. */
  children?: ReactNode;
  /** What kind of statement this is. Sets the icon and tint together, so it never relies on colour alone. */
  tone?: CalloutTone;
  /** Small label above the lead, e.g. "Summary" or "Caveat". */
  label?: string;
  /** `"soft"` is a tinted box, `"outline"` a bordered one, `"plain"` has no box (for beside a chart). */
  variant?: "soft" | "outline" | "plain";
  /** A built-in theme name or a theme object. A named theme paints its own background behind the callout. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the callout. Default: on for a named theme with its own surface. */
  frame?: boolean;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const TONE: Record<CalloutTone, { color: string; name: string }> = {
  neutral: { color: "var(--_ic-ink-2)", name: "Note" },
  accent: { color: "var(--_ic-accent)", name: "Key point" },
  positive: { color: "var(--_ic-positive)", name: "Good news" },
  negative: { color: "var(--_ic-negative)", name: "Warning" },
};

// Each tone has its own shape, so the tones differ without colour: circle-i, circle-arrow, circle-check, triangle-bang.
function Glyph({ tone }: { tone: CalloutTone }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg data-slot="ic-callout-icon" role="img" aria-label={TONE[tone].name} viewBox="0 0 20 20" width={20} height={20} style={{ flex: "none", display: "block", color: TONE[tone].color, marginTop: 1 }}>
      {tone === "negative" ? (
        <>
          <path d="M10 3.2 17.4 16H2.6L10 3.2Z" {...stroke} />
          <path d="M10 8.2v3.6" {...stroke} />
          <circle cx={10} cy={13.9} r={0.95} fill="currentColor" />
        </>
      ) : (
        <>
          <circle cx={10} cy={10} r={7.2} {...stroke} />
          {tone === "positive" ? <path d="m6.7 10.3 2.3 2.3 4.4-4.9" {...stroke} /> : null}
          {tone === "accent" ? <path d="M6.6 10h6.8m-2.7-2.8 2.8 2.8-2.8 2.8" {...stroke} /> : null}
          {tone === "neutral" ? (
            <>
              <path d="M10 9.4v4.2" {...stroke} />
              <circle cx={10} cy={6.6} r={0.95} fill="currentColor" />
            </>
          ) : null}
        </>
      )}
    </svg>
  );
}

/**
 * A fact box: one fact stated in words, beside or under the chart that shows it.
 */
function CalloutImpl({ lead, text, children, tone = "neutral", label, variant = "soft", className, style, ...rest }: CalloutProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const color = TONE[tone].color;
  const frame = frameStyle(rest.theme, mode, rest.frame);
  // On a painted ground the gridline colour sits too close to the surface to draw a box with.
  const framed = frame !== undefined;
  const box: CSSProperties =
    variant === "plain"
      ? {}
      : {
          padding: "14px 16px",
          borderRadius: 10,
          border: `1px solid ${variant === "soft" ? `color-mix(in srgb, ${color} 22%, var(--_ic-grid))` : framed ? "var(--_ic-axis)" : "var(--_ic-grid)"}`,
          background: variant === "soft" ? `color-mix(in srgb, ${color} ${tone === "neutral" ? 5 : 7}%, transparent)` : undefined,
        };
  const row: CSSProperties = { display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0, ...box };
  const content = (
    <>
      <Glyph tone={tone} />
      <div data-slot="ic-callout-body" style={{ minWidth: 0, flex: 1 }}>
        {label ? (
          <div data-slot="ic-callout-label" style={{ fontSize: "0.75rem", lineHeight: 1.4, fontWeight: 600, letterSpacing: "0.01em", color: "var(--_ic-ink-2)", marginBottom: 2, marginTop: 2 }}>
            {label}
          </div>
        ) : null}
        {lead ? (
          <div data-slot="ic-callout-lead" style={{ fontSize: "1rem", lineHeight: 1.4, fontWeight: 650, letterSpacing: "-0.005em", color: "var(--_ic-ink)", textWrap: "balance" }}>
            {lead}
          </div>
        ) : null}
        {text ? (
          <p data-slot="ic-callout-text" style={{ margin: lead ? "4px 0 0" : "1px 0 0", fontSize: "0.875rem", lineHeight: 1.55, color: "var(--_ic-ink-2)", textWrap: "pretty", maxWidth: "68ch" }}>
            {text}
          </p>
        ) : null}
        {children ? (
          <div data-slot="ic-callout-content" style={{ marginTop: lead || text ? 6 : 0, fontSize: "0.875rem", lineHeight: 1.55, color: "var(--_ic-ink-2)" }}>
            {children}
          </div>
        ) : null}
      </div>
    
    </>
  );
  // The callout already draws a box of its own, so a theme's ground goes on a wrapper around it.
  return (
    <div ref={ref} role="note" data-slot="ic-callout" data-tone={tone} data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, ...(frame ?? row), ...style }}>
      {frame ? (
        <div data-slot="ic-callout-box" style={row}>
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
}

export const Callout = withMeta(CalloutImpl, {
  name: "callout",
  component: "Callout",
  title: "Callout",
  level: "atom",
  category: "text",
  description: "A boxed statement of fact with a short bold lead and a sentence of explanation. The tone is marked by icon and tint.",
  whenToUse: "Beside or under a chart, to state its main fact in words, with the number. Also for a caveat the reader must not miss (`negative`).",
  avoid: "Long narration (use `prose`), a featured number (use `big-number` or `stat-tile`), or more than one callout per chart.",
  props: [
    { name: "lead", type: "string", description: "The fact in a few bold words. State it with its number." },
    { name: "text", type: "string", description: "One sentence of explanation or evidence." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `text`." },
    { name: "tone", type: '"neutral" | "positive" | "negative" | "accent"', default: '"neutral"', description: "Sets the icon shape and the tint together." },
    { name: "label", type: "string", description: 'Small label above the lead, e.g. "Summary".' },
    { name: "variant", type: '"soft" | "outline" | "plain"', default: '"soft"', description: "Tinted box, bordered box, or no box." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the callout, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: {
    type: "callout",
    tone: "accent",
    label: "Summary",
    lead: "Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024",
    text: "Wholesale prices were below zero on those afternoons.",
  },
});

export const examples = {
  Positive: { theme: "editorial", tone: "positive", lead: "Monthly churn fell from 4.2% to 2.1% between January and June", text: "It has stayed at 2.1% for two quarters since." },
  "Negative caveat, outline": { theme: "ledger", tone: "negative", variant: "outline", label: "Caveat", lead: "2020 figures are not comparable", text: "The survey moved online during lockdown. Response rates among over-75s fell by a third. Treat 2020 as a break in the series." },
  "Neutral, plain": { theme: "blueprint", tone: "neutral", variant: "plain", text: "Figures are provisional until the statistical office publishes its annual revision in September." },
  "One token overridden": { theme: { accent: "#b4237a" }, tone: "accent", label: "Key point", lead: "Night buses carried 18% of all weekend journeys in 2024", text: "The share was 11% in 2019. Illustrative figures." },
  "Accent on a painted ground": { theme: "forest", tone: "accent", variant: "outline", lead: "Tree cover in the city rose from 14% to 19% between 2010 and 2024", text: "The target for 2030 is 25%. Illustrative figures." },
};
