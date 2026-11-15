import type { CSSProperties, ReactNode, RefObject } from "react";
import { createElement, useEffect, useRef, useState } from "react";
import { useInsightStyles } from "../core/figure";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface StepMarkerProps {
  /** The step number. Numbers are zero-padded to two digits; strings ("A", "IV") are shown as written. */
  step: number | string;
  /** The chapter or step title. */
  title: string;
  /** Total number of steps. When given the marker reads "02 / 05". */
  total?: number;
  /** A sentence under the title that says what this step covers. */
  text?: string;
  /** JSX alternative to `text`. */
  children?: ReactNode;
  /** Heading level of the title. Default 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** `lg` for chapter openers, `md` for steps within a section. */
  size?: "md" | "lg";
  /** `"inline"` sets number and title on one line ("01 — Electricity sources in 2015"); `"stacked"` puts the number above. Narrow containers always stack. */
  layout?: "inline" | "stacked";
  /** Draw a hairline above, separating this chapter from the last. */
  rule?: boolean;
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

const pad = (n: number | string) => (typeof n === "number" ? String(n).padStart(2, "0") : n);

/** A numbered chapter heading that sequences the sections of a story. */
function StepMarkerImpl({ step, title, total, text, children, level = 2, size = "md", layout = "inline", rule = false, className, style, ...rest }: StepMarkerProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);
  const narrow = width > 0 && width < 480;
  const stacked = layout === "stacked" || narrow;
  const px = size === "lg" ? (narrow ? 22 : 28) : narrow ? 18 : 20;
  const number = (
    <span data-slot="ic-step-marker-number" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, color: "var(--_ic-muted)", whiteSpace: "nowrap", ...(stacked ? { display: "block", fontFamily: "var(--_ic-font)", fontSize: size === "lg" ? 16 : 14, lineHeight: 1.4, letterSpacing: "0.02em", marginBottom: 4 } : null) }}>
      {/* "Step" is for screen readers; sighted readers get the numeral. */}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>Step </span>
      {pad(step)}
      {total != null ? (
        <>
          <span aria-hidden> / </span>
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}> of </span>
          {pad(total)}
        </>
      ) : null}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>: </span>
    </span>
  );
  return (
    <div ref={ref} data-slot="ic-step-marker" data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), position: "relative", fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, ...(rule ? { borderTop: "1px solid var(--_ic-grid)", paddingTop: size === "lg" ? 20 : 16 } : null), ...style }}>
      {createElement(
        `h${level}`,
        { "data-slot": "ic-step-marker-heading", style: { margin: 0, fontFamily: "var(--_ic-font-display)", fontSize: px, lineHeight: 1.22, fontWeight: 660, letterSpacing: "-0.018em", textWrap: "balance" } as CSSProperties },
        number,
        stacked ? null : (
          <span data-slot="ic-step-marker-dash" aria-hidden style={{ color: "var(--_ic-muted)", fontWeight: 400, margin: "0 0.4em" }}>
            {"—"}
          </span>
        ),
        <span data-slot="ic-step-marker-title">{title}</span>,
      )}
      {text ? (
        <p data-slot="ic-step-marker-text" style={{ margin: "6px 0 0", fontSize: size === "lg" ? "1rem" : "0.9375rem", lineHeight: 1.5, color: "var(--_ic-ink-2)", maxWidth: "62ch", textWrap: "pretty" }}>
          {text}
        </p>
      ) : null}
      {children ? (
        <div data-slot="ic-step-marker-content" style={{ marginTop: 6, fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--_ic-ink-2)" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const StepMarker = withMeta(StepMarkerImpl, {
  name: "step-marker",
  component: "StepMarker",
  title: "Step marker",
  level: "atom",
  category: "text",
  description: 'A numbered chapter or step heading ("01 — Electricity sources in 2015") for sequencing the sections of a story.',
  whenToUse: "When a piece has three to seven ordered chapters or steps. Open each one with a marker so the reader can see the position in the sequence.",
  avoid: "Unordered sections (use `headline` with `size: \"section\"`), or numbering a list of items inside a paragraph.",
  props: [
    { name: "step", type: "number | string", required: true, description: "Step number, zero-padded to two digits. Strings are shown as written." },
    { name: "title", type: "string", required: true, description: "The chapter or step title." },
    { name: "total", type: "number", description: 'Total steps; the marker then reads "02 / 05".' },
    { name: "text", type: "string", description: "A sentence under the title." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `text`." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", description: "Heading level." },
    { name: "size", type: '"md" | "lg"', default: '"md"', description: "`lg` for chapter openers." },
    { name: "layout", type: '"inline" | "stacked"', default: '"inline"', description: "Number beside or above the title. Narrow containers always stack." },
    { name: "rule", type: "boolean", default: "false", description: "Hairline above the marker." },
  ],
  example: { type: "step-marker", step: 1, title: "Electricity sources in 2015", text: "Europe's electricity generation by source in 2015.", size: "lg" },
});

export const examples = {
  "With total and rule": { step: 2, total: 5, title: "Solar module costs fell 82% in eight years", text: "Average module cost per watt in each year.", rule: true },
  Stacked: { step: 3, title: "Hours in which midday solar generation exceeded demand on the grid, by month and country", layout: "stacked", size: "lg" },
  "Letter step, title only": { step: "B", title: "Factors excluded from the forecast", level: 3 },
};
