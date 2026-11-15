"use client";

import { type CSSProperties, type ReactNode, type RefObject, Fragment, useEffect, useRef, useState } from "react";
import { useInsightStyles, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface SourceRef {
  name: string;
  url?: string;
}

export interface SourceNoteProps {
  /** Where the data comes from: names, or `{ name, url }` to link them. */
  sources?: string | SourceRef | (string | SourceRef)[];
  /** The period the data covers, e.g. "January 2015 to December 2024". */
  period?: string;
  /** How the numbers were produced: definitions, adjustments, exclusions. */
  method?: string;
  /** Caveats the reader should know. */
  note?: string;
  /** Who made the piece: analysis, design, editing. */
  credit?: string;
  /** JSX appended after the listed rows. */
  children?: ReactNode;
  /** `"list"` is a labelled list; `"inline"` runs everything into one paragraph. */
  layout?: "list" | "inline";
  /** Draw a hairline above, separating the footer from the piece. Default true. */
  rule?: boolean;
  /** A built-in theme name or a theme object. A named theme paints its own background behind the block. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the block. Default: on for a named theme with its own surface. */
  frame?: boolean;
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
const LINK: CSSProperties = { color: "inherit", textDecorationLine: "underline", textDecorationColor: "var(--_ic-muted)", textUnderlineOffset: "0.18em" };

/**
 * The sourcing footer for a whole piece: sources, the period covered, method and credit.
 * A chart's own `source` prop covers a single chart; this covers the story.
 */
function SourceNoteImpl({ sources, period, method, note, credit, children, layout = "list", rule = true, className, style, ...rest }: SourceNoteProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);
  const stacked = width > 0 && width < 440;

  const list = (sources == null ? [] : Array.isArray(sources) ? sources : [sources]).map((s) => (typeof s === "string" ? { name: s } : s)).filter((s) => s?.name);
  const sourceNodes = list.map((s, i) => (
    <Fragment key={i}>
      {i > 0 ? "; " : null}
      {s.url && SAFE_HREF.test(s.url) ? (
        <a data-slot="ic-source-note-link" href={s.url} style={LINK}>
          {s.name}
        </a>
      ) : (
        s.name
      )}
    </Fragment>
  ));
  const rows: [key: string, label: string, value: ReactNode][] = [];
  if (list.length) rows.push(["sources", list.length > 1 ? "Sources" : "Source", sourceNodes]);
  if (period) rows.push(["period", "Data", period]);
  if (method) rows.push(["method", "Method", method]);
  if (note) rows.push(["note", "Note", note]);
  if (credit) rows.push(["credit", "Credit", credit]);

  const label: CSSProperties = { fontWeight: 600, color: "var(--_ic-ink-2)" };
  const framed = frameStyle(rest.theme, mode, rest.frame);
  return (
    <footer
      ref={ref}
      data-slot="ic-source-note"
      data-ic-mode={mode}
      className={className}
      style={{
        ...(chromeVars(theme[mode]) as CSSProperties),
        fontFamily: "var(--_ic-font)",
        fontSize: "0.8125rem",
        lineHeight: 1.55,
        color: "var(--_ic-ink-2)",
        minWidth: 0,
        // On a painted ground the hairline is drawn inside the padding, not as a border on the rounded box.
        ...(framed ?? (rule ? { borderTop: "1px solid var(--_ic-grid)", paddingTop: 14 } : null)),
        ...style,
      }}
    >
      {framed && rule ? <div data-slot="ic-source-note-rule" aria-hidden style={{ height: 1, background: "var(--_ic-axis)", marginBottom: 14 }} /> : null}
      {layout === "inline" ? (
        <p data-slot="ic-source-note-text" style={{ margin: 0, maxWidth: "80ch", textWrap: "pretty" }}>
          {rows.map(([key, name, value], i) => (
            <span key={key} data-slot={`ic-source-note-${key}`}>
              {i > 0 ? " " : null}
              <span style={label}>{name}:</span> {value}
              {typeof value === "string" && /[.!?]$/.test(value) ? null : "."}
            </span>
          ))}
        </p>
      ) : (
        <dl data-slot="ic-source-note-list" style={{ margin: 0, display: "grid", gridTemplateColumns: stacked ? "minmax(0, 1fr)" : "max-content minmax(0, 1fr)", columnGap: 20, rowGap: stacked ? 0 : 6, maxWidth: "84ch" }}>
          {rows.map(([key, name, value], i) => (
            <Fragment key={key}>
              <dt data-slot="ic-source-note-label" style={{ ...label, marginTop: stacked && i > 0 ? 10 : 0 }}>
                {name}
              </dt>
              <dd data-slot={`ic-source-note-${key}`} style={{ margin: 0, minWidth: 0, textWrap: "pretty", overflowWrap: "anywhere" }}>
                {value}
              </dd>
            </Fragment>
          ))}
        </dl>
      )}
      {children ? (
        <div data-slot="ic-source-note-extra" style={{ marginTop: rows.length ? 10 : 0 }}>
          {children}
        </div>
      ) : null}
    </footer>
  );
}

export const SourceNote = withMeta(SourceNoteImpl, {
  name: "source-note",
  component: "SourceNote",
  title: "Source note",
  level: "atom",
  category: "text",
  description: "A sourcing footer for a whole piece: sources with optional links, the period covered, method, caveats and credit.",
  whenToUse: "Once, at the end of a story or dashboard, to say where every number came from and how it was produced.",
  avoid: "Sourcing a single chart: use that chart's own `source` and `note` props so the citation travels with its export.",
  props: [
    { name: "sources", type: "string | { name, url? } | (string | { name, url? })[]", description: "Where the data comes from. Entries with a `url` are linked." },
    { name: "period", type: "string", description: 'The period the data covers, e.g. "2015 to 2024". Shown as "Data".' },
    { name: "method", type: "string", description: "How the numbers were produced: definitions, adjustments, exclusions." },
    { name: "note", type: "string", description: "Caveats the reader should know." },
    { name: "credit", type: "string", description: "Who made the piece." },
    { name: "layout", type: '"list" | "inline"', default: '"list"', description: "Labelled list, or one running paragraph." },
    { name: "rule", type: "boolean", default: "true", description: "Hairline above the note." },
    { name: "children", type: "ReactNode", description: "Extra content after the rows." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: {
    type: "source-note",
    theme: "earth",
    sources: [
      { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
      { name: "ENTSO-E Transparency Platform", url: "https://transparency.entsoe.eu" },
    ],
    note: "Figures are approximate, for illustration",
    period: "January 2015 to December 2024, monthly",
    method: "Generation shares are net of pumped-storage consumption. Figures for 2024 are provisional and exclude Malta and Cyprus.",
    credit: "Analysis and charts by the data desk",
  },
});
