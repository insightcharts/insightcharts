"use client";

import { type CSSProperties, type ReactNode, useRef } from "react";
import { useInsightStyles, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface ProseProps {
  /**
   * The narration. Blank lines separate paragraphs; an array is one paragraph per entry.
   * Supports `**bold**`, `*italic*` and `[link](https://...)`, nothing else.
   */
  text?: string | string[];
  /** JSX alternative to `text`. Wrap paragraphs in `<p>`. */
  children?: ReactNode;
  /** Body size: `sm` 14px for asides, `md` 16px, `lg` 18px for long reads. */
  size?: "sm" | "md" | "lg";
  /** Line length in characters. Clamped to 45-75. */
  measure?: number;
  /** Set the first paragraph a step larger, as an intro. */
  lead?: boolean;
  /** `"muted"` for secondary narration such as method asides. */
  tone?: "default" | "muted";
  align?: "left" | "center";
  /** A built-in theme name or a theme object. A named theme paints its own background behind the block. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the block. Default: on for a named theme with its own surface. */
  frame?: boolean;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const SIZES = { sm: 14, md: 16, lg: 18 } as const;
const LEAD = { sm: 16, md: 18, lg: 20 } as const;
const INLINE = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
// Only navigable schemes and relative paths; anything else (javascript:, data:) renders as plain text.
const SAFE_HREF = /^(https?:|mailto:|\/|#|\.)/i;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (m[1] != null) out.push(<strong key={key++} style={{ fontWeight: 650, color: "var(--_ic-ink)" }}>{m[1]}</strong>);
    else if (m[2] != null) out.push(<em key={key++}>{m[2]}</em>);
    else if (SAFE_HREF.test(m[4])) {
      out.push(
        <a key={key++} data-slot="ic-prose-link" href={m[4]} style={{ color: "inherit", textDecorationLine: "underline", textDecorationColor: "var(--_ic-accent)", textDecorationThickness: "1.5px", textUnderlineOffset: "0.18em" }}>
          {m[3]}
        </a>,
      );
    } else out.push(m[3]);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Narration between charts, set at a readable measure. Use it to say what the previous
 * chart showed and to introduce the next one.
 */
function ProseImpl({ text, children, size = "md", measure = 65, lead = false, tone = "default", align = "left", className, style, ...rest }: ProseProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const paragraphs = (Array.isArray(text) ? text : text ? text.split(/\n\s*\n/) : []).map((p) => p.trim()).filter(Boolean);
  const px = SIZES[size];
  const ch = Math.min(75, Math.max(45, measure));
  return (
    <div
      ref={ref}
      data-slot="ic-prose"
      data-ic-mode={mode}
      className={className}
      style={{
        ...(chromeVars(theme[mode]) as CSSProperties),
        fontFamily: "var(--_ic-font)",
        fontSize: px,
        lineHeight: size === "sm" ? 1.55 : 1.6,
        color: tone === "muted" ? "var(--_ic-ink-2)" : "var(--_ic-ink)",
        // `ch` is the width of "0", close to the average character, so this is the measure.
        maxWidth: `${ch}ch`,
        marginLeft: align === "center" ? "auto" : undefined,
        marginRight: align === "center" ? "auto" : undefined,
        minWidth: 0,
        textWrap: "pretty",
        overflowWrap: "break-word",
        ...frameStyle(rest.theme, mode, rest.frame),
        ...style,
      }}
    >
      {paragraphs.map((p, i) => (
        <p key={i} data-slot="ic-prose-paragraph" data-lead={lead && i === 0 ? "" : undefined} style={{ margin: i === 0 ? 0 : "1em 0 0", ...(lead && i === 0 ? { fontSize: LEAD[size], lineHeight: 1.5, color: "var(--_ic-ink)" } : null) }}>
          {inline(p)}
        </p>
      ))}
      {children}
    </div>
  );
}

export const Prose = withMeta(ProseImpl, {
  name: "prose",
  component: "Prose",
  title: "Prose",
  level: "atom",
  category: "text",
  description: "A readable block of narration at a 45-75 character measure, for the text between charts.",
  whenToUse: "To say what a chart showed and introduce the next one. Use two or three short paragraphs at a time.",
  avoid: "A single statement of fact (use `callout`), a quotation (use `pull-quote`), or sourcing and method notes (use `source-note`).",
  props: [
    { name: "text", type: "string | string[]", description: "Narration. Blank lines separate paragraphs. Supports `**bold**`, `*italic*` and `[link](url)`." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `text`." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Body size: 14, 16 or 18px." },
    { name: "measure", type: "number", default: "65", description: "Line length in characters, clamped to 45-75." },
    { name: "lead", type: "boolean", default: "false", description: "Set the first paragraph a step larger." },
    { name: "tone", type: '"default" | "muted"', default: '"default"', description: "`muted` for secondary narration." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Centres the block (text stays left-aligned)." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: {
    type: "prose",
    text: "In 2015 solar supplied **3% of Europe's electricity**. Hydro supplied more than three times as much.\n\nPanel prices fell by about 80% in the years that followed. In 2024 solar generated more electricity than coal across the EU, according to [Ember's annual review](https://ember-energy.org).\n\nSolar's share differs by country. The next chart shows it for each EU member state.",
  },
});
