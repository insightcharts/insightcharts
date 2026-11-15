import { createElement, useEffect, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { SourceNote, type SourceRef } from "../atoms/source-note";
import { isSpec, type InsightSpec, type Slot } from "../core/spec";
import { useMolecule, type MoleculeProps } from "../molecules/_shared";

// Shared plumbing for the templates. The leading underscore keeps this file out of the
// generated index. Root, theme and colour mode come from the molecules' `useMolecule`, so a
// template and everything nested in it resolve the same tokens.

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Props every template accepts. */
export interface TemplateProps extends MoleculeProps {
  /** Heading level of the piece's title. Section headings follow one level down. Default 1. */
  level?: HeadingLevel;
  /** Widest the piece may get, as a CSS length. It is centred in wider containers. */
  maxWidth?: number | string;
}

/** The sourcing footer every template ends with. */
export interface TemplateSourcing {
  /** Where the data comes from: names, or `{ name, url }` to link them. */
  sources?: string | SourceRef | (string | SourceRef)[];
  /** The period the data covers. */
  period?: string;
  /** How the numbers were produced. */
  method?: string;
  /** Caveats, e.g. "Illustrative data". */
  note?: string;
  /** Who made the piece. */
  credit?: string;
}

/** PropDoc rows shared by every template's meta. */
export const SOURCING_DOCS = [
  { name: "sources", type: "string | { name, url? } | (string | { name, url? })[]", description: "Where the data comes from, shown in the closing source note. Entries with a `url` are linked." },
  { name: "period", type: "string", description: "The period the data covers." },
  { name: "method", type: "string", description: "How the numbers were produced: definitions, adjustments, exclusions." },
  { name: "note", type: "string", description: 'Caveats the reader should know, e.g. "Illustrative data".' },
  { name: "credit", type: "string", description: "Who made the piece." },
];
export const FRAME_DOCS = [
  { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "1", description: "Heading level of the title; section headings follow one level down." },
  { name: "maxWidth", type: "number | string", description: "Widest the piece may get. It is centred in wider containers." },
  { name: "theme", type: "ThemeInput", description: 'A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece.' },
  { name: "frame", type: "boolean", description: "Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it." },
  { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode, passed on to everything inside." },
];

const STYLE_ID = "insightcharts-template-styles";
// Hover and focus states cannot be written inline.
const CSS = `
[data-slot=ic-button]{transition:background-color .15s,color .15s,border-color .15s,opacity .15s}
[data-slot=ic-button]:hover:not(:disabled){background:color-mix(in srgb,var(--_ic-ink) 7%,transparent)}
[data-slot=ic-button]:focus-visible,[data-slot=ic-deck-dot]:focus-visible,[data-slot=ic-deck-strip]:focus-visible,[data-slot=ic-link]:focus-visible{outline:2px solid var(--_ic-accent);outline-offset:2px}
[data-slot=ic-button]:disabled{opacity:.4;cursor:default}
[data-slot=ic-deck-strip]{scrollbar-width:none}
[data-slot=ic-deck-strip]::-webkit-scrollbar{display:none}
@media (prefers-reduced-motion:reduce){[data-slot=ic-deck-strip]{scroll-behavior:auto!important}}
@media print{[data-ic-print=hide]{display:none!important}[data-slot=ic-template-block]{break-inside:avoid}}
`;

/** Root plumbing for a template: container width, colour mode, chrome variables and the spacing scale. */
export function useTemplate(props: MoleculeProps) {
  const m = useMolecule<HTMLElement>(props);
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
  const phone = m.width < 560;
  // Space between the major blocks of a piece, on the 4px rhythm.
  const gap = phone ? 32 : m.width < 900 ? 40 : 48;
  // A painted piece is a page, not a chart card: it gets page margins that scale with its width.
  const root: CSSProperties = m.painted ? { ...m.root, padding: phone ? "28px 20px" : m.width < 900 ? "40px 36px" : "56px 56px", borderRadius: phone ? 12 : 16 } : m.root;
  return { ...m, root, phone, gap };
}

/** Style for a template's root `<article>`. */
export function frame(root: CSSProperties, maxWidth: number | string | undefined, gap: number): CSSProperties {
  return { ...root, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap, width: "100%", maxWidth, marginLeft: "auto", marginRight: "auto" };
}

export const below = (level: HeadingLevel | undefined, by = 1): HeadingLevel => Math.min(6, (level ?? 1) + by) as HeadingLevel;

export const RULE = "1px solid var(--_ic-grid)";

/** A hairline between blocks. */
export function Rule({ style }: { style?: CSSProperties }) {
  return <hr data-slot="ic-rule" style={{ border: 0, borderTop: RULE, margin: 0, width: "100%", ...style }} />;
}

/** The small label that names a block ("What to do", "Method"). */
export function Label({ children, as = "p", id, style }: { children: ReactNode; as?: string; id?: string; style?: CSSProperties }): ReactElement {
  return createElement(as, { "data-slot": "ic-label", id, style: { margin: 0, fontFamily: "var(--_ic-font)", fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: 600, letterSpacing: "0.01em", color: "var(--_ic-muted)", ...style } }, children);
}

/** A heading in the display face at the size of a chart title or one step up. */
export function Heading({ level, size = "md", children, id, style }: { level: HeadingLevel; size?: "md" | "lg"; children: ReactNode; id?: string; style?: CSSProperties }): ReactElement {
  return createElement(
    `h${level}`,
    { "data-slot": "ic-heading", id, style: { margin: 0, fontFamily: "var(--_ic-font-display)", fontSize: size === "lg" ? "1.375rem" : "1.125rem", lineHeight: 1.25, fontWeight: 650, letterSpacing: "-0.012em", color: "var(--_ic-ink)", textWrap: "balance", ...style } },
    children,
  );
}

/** The closing source note, or nothing when no sourcing was given. */
export function Sourcing({ sources, period, method, note, credit, layout, style }: TemplateSourcing & { layout?: "list" | "inline"; style?: CSSProperties }) {
  if (!sources && !period && !method && !note && !credit) return null;
  return <SourceNote sources={sources} period={period} method={method} note={note} credit={credit} layout={layout} style={style} />;
}

export const asList = <T,>(value: T | T[] | undefined | null): T[] => (value == null ? [] : Array.isArray(value) ? value : [value]);

// Charts whose height is free. Row-based charts (bars, dumbbells, timelines) size themselves
// from their data, and a forced height would leave them floating in empty space.
const FREE_HEIGHT = new Set(["line-chart", "area-chart", "scatter-chart", "histogram", "slope-chart", "bump-chart", "donut-chart", "radial-bar-chart", "treemap", "small-multiples"]);

/** Give a free-height chart spec a height when the author left it to the template. Everything else passes through. */
export function withHeight(slot: Slot, height: number): Slot {
  if (!isSpec(slot)) return slot;
  const spec = slot as InsightSpec;
  return FREE_HEIGHT.has(spec.type) && spec.height == null && spec.aspect == null ? { ...spec, height } : spec;
}

/** Merge defaults under a spec's own props. React elements pass through. */
export function withDefaults(slot: Slot, defaults: Record<string, unknown>): Slot {
  return isSpec(slot) ? ({ ...defaults, ...(slot as InsightSpec) } as InsightSpec) : slot;
}

export const button: CSSProperties = {
  appearance: "none",
  font: "inherit",
  cursor: "pointer",
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  minHeight: 32,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid var(--_ic-grid)",
  background: "transparent",
  color: "var(--_ic-ink)",
  fontSize: "0.8125rem",
  lineHeight: 1,
  fontWeight: 500,
};

/**
 * For a block painted in the opposite colour mode. The default theme reads the host page's
 * `--background` / `--foreground`, which describe the page's mode, not the block's; resetting
 * them makes the tokens fall back to the library's own palette for that mode.
 */
export const INVERSE_HOST = { "--background": "initial", "--foreground": "initial", "--muted-foreground": "initial", "--border": "initial" } as CSSProperties;
