"use client";

import { type CSSProperties, type ReactNode, type RefObject, createElement, useEffect, useRef, useState } from "react";
import { useInsightStyles, formatDate, withMeta, useColorMode, type ModeInput, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface HeadlineProps {
  /** The main fact of the piece, as one plain sentence with its number. */
  title: string;
  /** Small label above the title: the section, series or topic. Sentence case. */
  kicker?: string;
  /** One-sentence standfirst that says what the reader will learn. */
  deck?: string;
  /** Who made it, e.g. "By Ana Ruiz and Tom Okafor". Shown as written. */
  byline?: string;
  /** Publication or data date. ISO dates (`2025-03-14`) are formatted for the locale; other strings are shown as written. */
  date?: string;
  /** `"page"` opens a whole piece, `"section"` opens a chapter, `"card"` sits inside a tile. */
  size?: "page" | "section" | "card";
  /** Heading level of the title. Defaults to 1 for page, 2 for section, 3 for card. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "left" | "center";
  /** Extra content under the byline, e.g. share links. */
  children?: ReactNode;
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

// [title px wide, title px narrow, deck px wide, deck px narrow, title line-height, tracking]
const SCALE = {
  page: { title: [40, 28], deck: [20, 17], leading: 1.1, tracking: "-0.025em", gap: 14 },
  section: { title: [28, 22], deck: [18, 16], leading: 1.18, tracking: "-0.02em", gap: 10 },
  card: { title: [20, 18], deck: [15, 14], leading: 1.25, tracking: "-0.012em", gap: 6 },
} as const;

const ISO = /^\d{4}-\d{2}-\d{2}/;

/**
 * The opening block of a piece or section: kicker, title, standfirst and byline.
 * The title is a real heading, so the document outline follows the piece.
 */
function HeadlineImpl({ title, kicker, deck, byline, date, size = "section", level, align = "left", children, className, style, ...rest }: HeadlineProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);
  // Unmeasured (SSR, first paint) counts as wide.
  const narrow = width > 0 && width < 560;
  const s = SCALE[size];
  const i = narrow ? 1 : 0;
  const heading = level ?? (size === "page" ? 1 : size === "section" ? 2 : 3);
  const center = align === "center";
  // Longhand margins throughout: mixing them with the `margin` shorthand breaks on re-render.
  const block: CSSProperties = center ? { marginLeft: "auto", marginRight: "auto" } : { marginLeft: 0, marginRight: 0 };
  const iso = date && ISO.test(date);
  const dateText = date ? (iso ? formatDate(date.length === 10 ? `${date}T00:00:00` : date, config.locale, { year: "numeric", month: "long", day: "numeric" }) : date) : null;

  return (
    <header ref={ref} data-slot="ic-headline" data-size={size} data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", textAlign: align, minWidth: 0, ...style }}>
      {kicker ? (
        <p data-slot="ic-headline-kicker" style={{ margin: `0 0 ${size === "card" ? 4 : 8}px`, fontSize: size === "page" ? "0.875rem" : "0.8125rem", lineHeight: 1.4, fontWeight: 600, letterSpacing: "0.01em", color: "color-mix(in srgb, var(--_ic-accent) 82%, var(--_ic-ink))" }}>
          {kicker}
        </p>
      ) : null}
      {createElement(
        `h${heading}`,
        {
          "data-slot": "ic-headline-title",
          style: { marginTop: 0, marginBottom: 0, fontFamily: "var(--_ic-font-display)", fontSize: s.title[i], lineHeight: s.leading, fontWeight: 680, letterSpacing: s.tracking, color: "var(--_ic-ink)", textWrap: "balance", maxWidth: "24em", overflowWrap: "break-word", ...block } as CSSProperties,
        },
        title,
      )}
      {deck ? (
        <p data-slot="ic-headline-deck" style={{ marginTop: s.gap, marginBottom: 0, fontSize: s.deck[i], lineHeight: 1.45, color: "var(--_ic-ink-2)", textWrap: "pretty", maxWidth: "38em", ...block }}>
          {deck}
        </p>
      ) : null}
      {byline || dateText ? (
        <p data-slot="ic-headline-meta" style={{ margin: `${s.gap + 2}px 0 0`, fontSize: size === "page" ? "0.875rem" : "0.8125rem", lineHeight: 1.45, color: "var(--_ic-muted)" }}>
          {byline ? (
            <span data-slot="ic-headline-byline" style={{ color: "var(--_ic-ink-2)", fontWeight: 500 }}>
              {byline}
            </span>
          ) : null}
          {byline && dateText ? <span aria-hidden> · </span> : null}
          {dateText ? (
            <time data-slot="ic-headline-date" dateTime={iso ? date : undefined}>
              {dateText}
            </time>
          ) : null}
        </p>
      ) : null}
      {children ? (
        <div data-slot="ic-headline-extra" style={{ marginTop: s.gap + 2 }}>
          {children}
        </div>
      ) : null}
    </header>
  );
}

export const Headline = withMeta(HeadlineImpl, {
  name: "headline",
  component: "Headline",
  title: "Headline",
  level: "atom",
  category: "text",
  description: "The opening block of a piece or section: kicker, title, one-sentence deck and a byline/date line.",
  whenToUse: "At the top of a data story (`page`), at the start of each chapter (`section`), or as the heading of a tile (`card`). Write the title as one plain fact with its number. Write the deck as a second plain sentence.",
  avoid: "Titling a single chart: charts carry their own `title` and `subtitle`. For numbered chapters use `step-marker`.",
  props: [
    { name: "title", type: "string", required: true, description: "One fact with its number, as a plain sentence. Wraps balanced." },
    { name: "kicker", type: "string", description: "Small label above the title: section, series or topic. Sentence case." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: 'Author line, shown as written, e.g. "By Ana Ruiz".' },
    { name: "date", type: "string", description: "ISO dates are formatted for the locale and wrapped in `<time>`; other strings are shown as written." },
    { name: "size", type: '"page" | "section" | "card"', default: '"section"', description: "Type scale. Titles step down automatically in narrow containers." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", description: "Heading level. Defaults to 1 (page), 2 (section), 3 (card)." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Text alignment." },
    { name: "children", type: "ReactNode", description: "Extra content under the byline." },
  ],
  example: {
    type: "headline",
    size: "page",
    kicker: "Energy transition",
    title: "Solar generated more electricity than coal in Europe in 2024",
    deck: "Solar was the continent's second-largest source of electricity that year.",
    byline: "By Ana Ruiz and Tom Okafor",
    date: "2025-03-14",
  },
});
