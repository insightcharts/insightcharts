import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useInsightStyles } from "../core/figure";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface PullQuoteProps {
  /** The words quoted, without quotation marks (they are added). */
  quote?: string;
  /** JSX alternative to `quote`. */
  children?: ReactNode;
  /** Who said it. */
  attribution?: string;
  /** Their role or where it was said, e.g. "Grid operations lead, TenneT". */
  role?: string;
  /** URL of the source, set as the blockquote's `cite` and linked from the attribution. */
  cite?: string;
  /** `lg` for a quote that anchors a section, `md` inside a column. */
  size?: "md" | "lg";
  align?: "left" | "center";
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

const SAFE_HREF = /^(https?:|\/|#|\.)/i;

/** A quotation set large, with its attribution. */
function PullQuoteImpl({ quote, children, attribution, role, cite, size = "lg", align = "left", className, style, ...rest }: PullQuoteProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);
  const narrow = width > 0 && width < 520;
  const px = size === "lg" ? (narrow ? 22 : 28) : narrow ? 18 : 20;
  const center = align === "center";
  const href = cite && SAFE_HREF.test(cite) ? cite : undefined;
  return (
    <figure
      ref={ref}
      data-slot="ic-pull-quote"
      data-ic-mode={mode}
      className={className}
      style={{
        ...(chromeVars(theme[mode]) as CSSProperties),
        fontFamily: "var(--_ic-font)",
        color: "var(--_ic-ink)",
        margin: 0,
        minWidth: 0,
        textAlign: align,
        // A rule down the side marks a left-aligned quote; a centred one stands on its marks and size.
        ...(center ? null : { borderLeft: "2px solid var(--_ic-accent)", paddingLeft: narrow ? 16 : 24 }),
        ...style,
      }}
    >
      <blockquote
        data-slot="ic-pull-quote-text"
        cite={href}
        style={{ margin: center ? "0 auto" : 0, maxWidth: "26em", fontFamily: "var(--_ic-font-display)", fontSize: px, lineHeight: 1.3, fontWeight: 500, letterSpacing: "-0.015em", textWrap: "balance", quotes: '"“" "”" "‘" "’"' }}
      >
        {quote != null ? (
          <p style={{ margin: 0 }}>
            {"“"}
            {quote}
            {"”"}
          </p>
        ) : (
          children
        )}
      </blockquote>
      {attribution || role ? (
        <figcaption data-slot="ic-pull-quote-attribution" style={{ marginTop: size === "lg" ? 16 : 12, fontSize: "0.875rem", lineHeight: 1.45, color: "var(--_ic-ink-2)" }}>
          {attribution ? (
            <span data-slot="ic-pull-quote-name" style={{ fontWeight: 600, color: "var(--_ic-ink)" }}>
              {href ? (
                <a href={href} style={{ color: "inherit", textDecorationColor: "var(--_ic-muted)", textUnderlineOffset: "0.18em" }}>
                  {attribution}
                </a>
              ) : (
                attribution
              )}
            </span>
          ) : null}
          {attribution && role ? <span aria-hidden>{narrow ? "" : " · "}</span> : null}
          {role ? (
            <span data-slot="ic-pull-quote-role" style={narrow ? { display: "block" } : undefined}>
              {role}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const PullQuote = withMeta(PullQuoteImpl, {
  name: "pull-quote",
  component: "PullQuote",
  title: "Pull quote",
  level: "atom",
  category: "text",
  description: "A large quotation with its attribution.",
  whenToUse: "To quote a person on a finding the charts have already shown, or to break up a long run of charts. One per section at most.",
  avoid: "Restating a number (use `big-number`) or the main fact of a chart (use `callout`). Never quote without attribution.",
  props: [
    { name: "quote", type: "string", description: "The words quoted, without quotation marks." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `quote`." },
    { name: "attribution", type: "string", description: "Who said it." },
    { name: "role", type: "string", description: "Their role, or where it was said." },
    { name: "cite", type: "string", description: "Source URL: set as the blockquote `cite` and linked from the attribution." },
    { name: "size", type: '"md" | "lg"', default: '"lg"', description: "`lg` anchors a section; `md` sits inside a column." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Left-aligned quotes carry a side rule; centred ones do not." },
  ],
  example: {
    type: "pull-quote",
    quote: "Solar set the midday wholesale price on most days in 2023. Our plans had assumed that would happen in the 2030s.",
    attribution: "Marit de Vries",
    role: "Head of system operations, Dutch grid operator",
  },
});

export const examples = {
  Centered: { align: "center", quote: "Rooftop solar is now the cheapest source of new electricity in our market.", attribution: "Luis Ortega", role: "Energy economist" },
  "Medium, with source link": {
    size: "md",
    quote: "Solar underbid coal in the afternoon power auctions for three years. The coal plants that could not reduce their output quickly enough in those hours were closed because they no longer covered their costs.",
    attribution: "European Electricity Review 2025",
    cite: "https://ember-energy.org",
  },
};
