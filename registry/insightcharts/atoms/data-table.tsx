"use client";

import { type CSSProperties, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import type { Row } from "insightcharts/data";
import { useInsightStyles, makeFormatter, type FormatSpec, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface DataTableColumn {
  /** Field name in the rows. */
  key: string;
  /** Header text. Defaults to the key. */
  label?: string;
  /** How to print numbers in this column. */
  format?: FormatSpec;
  /** Defaults to right for numeric columns, left otherwise. */
  align?: "left" | "right";
  /** Draw an in-cell bar scaled to the column's largest value. Use on one column. */
  bar?: boolean;
  /** Set false to stop this column being sortable. */
  sortable?: boolean;
  /** CSS width, e.g. `"40%"` or `120`. */
  width?: number | string;
}

export interface DataTableProps {
  /** One object per row. */
  rows: Row[];
  /** Columns to show, in order: field names or config objects. Defaults to every key of the first row. */
  columns?: (string | DataTableColumn)[];
  /** The table's title. A plain label, or one fact with its number. Rendered as a real `<caption>`. */
  caption?: string;
  /** A line under the caption: units, period. */
  subtitle?: string;
  /** Where the data comes from, shown under the table as "Source: ...". */
  source?: string;
  /** Rows to emphasise, matched against the first column's value (or `highlightKey`). */
  highlight?: string | number | (string | number)[];
  /** Field that `highlight` matches against. Defaults to the first column. */
  highlightKey?: string;
  /** Initial sort. */
  sort?: { key: string; direction?: "asc" | "desc" };
  /** Let readers sort by clicking a header. Default true. */
  sortable?: boolean;
  /** Maximum height before the body scrolls under a sticky header, e.g. `320`. */
  maxHeight?: number | string;
  /** Row padding. */
  density?: "comfortable" | "compact";
  /** A built-in theme name or a theme object. A named theme paints its own background behind the table. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the table. Default: on for a named theme with its own surface. */
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

type SortState = { key: string; direction: "asc" | "desc" } | null;

function SortGlyph({ state }: { state: "asc" | "desc" | null }) {
  // Two chevrons; the active one is full strength. Present but faint when unsorted, so the header reads as sortable.
  return (
    <svg data-slot="ic-data-table-sort-icon" aria-hidden viewBox="0 0 8 12" width={8} height={12} style={{ flex: "none", marginBottom: 3, marginTop: 3 }}>
      <path d="M1 4.5 4 1.5l3 3" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={state === "asc" ? 1 : state ? 0.25 : 0.45} />
      <path d="M1 7.5 4 10.5l3-3" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={state === "desc" ? 1 : state ? 0.25 : 0.45} />
    </svg>
  );
}

/**
 * A restrained editorial table: horizontal hairlines only, numbers right-aligned in tabular
 * figures, one optional in-cell bar column, sortable from the keyboard.
 */
function DataTableImpl({ rows, columns, caption, subtitle, source, highlight, highlightKey, sort, sortable = true, maxHeight, density = "comfortable", className, style, ...rest }: DataTableProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);
  const narrow = width > 0 && width < 480;
  const tokens = theme[mode];
  const data = Array.isArray(rows) ? rows : [];

  const columnsKey = JSON.stringify(columns ?? null);
  const cols = useMemo(() => {
    const input: (string | DataTableColumn)[] = columns ?? Object.keys(data[0] ?? {});
    return input.map((c) => {
      const col = typeof c === "string" ? { key: c } : c;
      const values = data.map((r) => r[col.key]).filter((v) => v != null && v !== "");
      const numeric = values.length > 0 && values.every((v) => typeof v === "number");
      // Year-like integers read wrong with thousands separators.
      const format = col.format ?? (numeric && /year/i.test(col.key) ? "year" : "auto");
      const max = numeric ? Math.max(0, ...values.map((v) => Math.abs(v as number))) : 0;
      return { ...col, label: col.label ?? col.key, numeric, align: col.align ?? (numeric ? "right" : "left"), fmt: makeFormatter(format, config.locale), max };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKey, data, config.locale]);

  const [order, setOrder] = useState<SortState>(sort ? { key: sort.key, direction: sort.direction ?? "desc" } : null);
  const sorted = useMemo(() => {
    if (!order) return data;
    const col = cols.find((c) => c.key === order.key);
    const sign = order.direction === "asc" ? 1 : -1;
    const collator = new Intl.Collator(config.locale, { numeric: true, sensitivity: "base" });
    return [...data].sort((a, b) => {
      const x = a[order.key];
      const y = b[order.key];
      // Missing values sink to the bottom in either direction.
      if (x == null || x === "") return y == null || y === "" ? 0 : 1;
      if (y == null || y === "") return -1;
      if (col?.numeric) return ((x as number) - (y as number)) * sign;
      return collator.compare(String(x), String(y)) * sign;
    });
  }, [data, order, cols, config.locale]);

  const cycle = (key: string, numeric: boolean) =>
    setOrder((o) => {
      // Numbers start largest-first, text A to Z; a third click restores the authored order.
      const first = numeric ? "desc" : "asc";
      if (!o || o.key !== key) return { key, direction: first };
      if (o.direction === first) return { key, direction: first === "desc" ? "asc" : "desc" };
      return null;
    });

  const marked = new Set((highlight == null ? [] : Array.isArray(highlight) ? highlight : [highlight]).map(String));
  const markKey = highlightKey ?? cols[0]?.key;
  const [focused, setFocused] = useState<string | null>(null);
  const [live, setLive] = useState("");

  const padY = density === "compact" ? 6 : 10;
  const padX = narrow ? 14 : 24;
  const inset = marked.size ? 10 : 0;
  // Longhand padding only: React does not re-apply a longhand when a shorthand beside it changes.
  const cell = (i: number): CSSProperties => ({ paddingTop: padY, paddingBottom: padY, paddingRight: i === cols.length - 1 ? 0 : padX, paddingLeft: i === 0 ? inset : 0, borderBottom: "1px solid var(--_ic-grid)", verticalAlign: "baseline" });
  const scrolls = maxHeight != null;

  return (
    <div ref={ref} data-slot="ic-data-table" data-ic-mode={mode} className={className} style={{ ...(chromeVars(tokens) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, ...frameStyle(rest.theme, mode, rest.frame), ...style }}>
      <div
        data-slot="ic-data-table-scroll"
        // A scrolling region must be reachable from the keyboard.
        {...(scrolls ? { tabIndex: 0, role: "region", "aria-label": caption ?? "Data table" } : null)}
        style={{ overflowX: "auto", overflowY: scrolls ? "auto" : undefined, maxHeight, WebkitOverflowScrolling: "touch" }}
      >
        {/* `separate` borders, because collapsed borders do not travel with a sticky header. */}
        <table data-slot="ic-data-table-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "0.875rem", lineHeight: 1.4 }}>
          {caption || subtitle ? (
            <caption data-slot="ic-data-table-caption" style={{ captionSide: "top", textAlign: "left", paddingBottom: 10 }}>
              {/* Pinned to the visible width, so a table that scrolls sideways does not drag its title out of view. */}
              <span style={{ display: "block", position: "sticky", left: 0, maxWidth: width || undefined }}>
              {caption ? <span style={{ display: "block", fontFamily: "var(--_ic-font-display)", fontSize: "1.125rem", lineHeight: 1.3, fontWeight: 650, letterSpacing: "-0.01em", color: "var(--_ic-ink)", textWrap: "balance" }}>{caption}</span> : null}
              {subtitle ? (
                <span data-slot="ic-data-table-subtitle" style={{ display: "block", marginTop: caption ? 4 : 0, fontSize: "0.875rem", lineHeight: 1.45, color: "var(--_ic-ink-2)" }}>
                  {subtitle}
                </span>
              ) : null}
              </span>
            </caption>
          ) : null}
          <thead data-slot="ic-data-table-head">
            <tr>
              {cols.map((c, i) => {
                const state = order?.key === c.key ? order.direction : null;
                const canSort = sortable && c.sortable !== false;
                const th: CSSProperties = {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background: "var(--_ic-surface)",
                  // The first header shares its cells' inset, which makes room for the highlight marker.
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: i === cols.length - 1 ? 0 : padX,
                  paddingLeft: i === 0 ? inset : 0,
                  // The one heavier rule in the table: it separates labels from data.
                  borderBottom: `1px solid ${tokens.axis}`,
                  textAlign: c.align,
                  verticalAlign: "bottom",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--_ic-ink-2)",
                  whiteSpace: narrow ? "normal" : "nowrap",
                  width: c.width,
                };
                const inner: CSSProperties = { display: "inline-flex", alignItems: narrow ? "flex-end" : "center", gap: 6, flexDirection: c.align === "right" ? "row-reverse" : "row", padding: "0 0 8px", textAlign: c.align };
                return (
                  <th key={c.key} scope="col" data-slot="ic-data-table-header" data-num={c.numeric ? "" : undefined} aria-sort={canSort ? (state === "asc" ? "ascending" : state === "desc" ? "descending" : "none") : undefined} style={th}>
                    {canSort ? (
                      <button
                        type="button"
                        data-slot="ic-data-table-sort"
                        title={`Sort by ${c.label}`}
                        onClick={() => {
                          cycle(c.key, c.numeric);
                          const first = c.numeric ? "desc" : "asc";
                          const next = state == null ? first : state === first ? (first === "desc" ? "asc" : "desc") : null;
                          setLive(next ? `Sorted by ${c.label}, ${next === "asc" ? "ascending" : "descending"}` : "Original order restored");
                        }}
                        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible") ? c.key : null)}
                        onBlur={() => setFocused(null)}
                        style={{
                          ...inner,
                          appearance: "none",
                          background: "none",
                          border: 0,
                          // Padding inside the button and the gap to the rule outside it, so the focus ring hugs the label.
                          padding: "2px 4px",
                          margin: "0 -4px 6px",
                          font: "inherit",
                          letterSpacing: "inherit",
                          color: state ? "var(--_ic-ink)" : "inherit",
                          cursor: "pointer",
                          borderRadius: 4,
                          outline: focused === c.key ? "2px solid var(--_ic-accent)" : "none",
                          outlineOffset: 2,
                        }}
                      >
                        <span>{c.label}</span>
                        <SortGlyph state={state} />
                      </button>
                    ) : (
                      <span style={inner}>{c.label}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody data-slot="ic-data-table-body">
            {sorted.map((row, r) => {
              const on = markKey != null && marked.has(String(row[markKey]));
              const last = r === sorted.length - 1;
              return (
                <tr key={r} data-slot="ic-data-table-row" data-highlight={on ? "" : undefined} style={on ? { background: "color-mix(in srgb, var(--_ic-accent) 9%, transparent)" } : undefined}>
                  {cols.map((c, i) => {
                    const raw = row[c.key];
                    const text = raw == null || raw === "" ? "–" : c.fmt(raw);
                    const base: CSSProperties = {
                      ...cell(i),
                      ...(last ? { borderBottom: 0 } : null),
                      textAlign: c.align,
                      // Highlight is weight as well as tint, so it survives greyscale and forced colours.
                      fontWeight: on ? 650 : i === 0 ? 500 : 400,
                      color: i === 0 || on ? "var(--_ic-ink)" : "var(--_ic-ink-2)",
                      fontVariantNumeric: c.numeric ? "tabular-nums" : undefined,
                      whiteSpace: c.numeric ? "nowrap" : undefined,
                      ...(on && i === 0 ? { boxShadow: "inset 2px 0 0 var(--_ic-accent)" } : null),
                    };
                    const showBar = c.bar && c.numeric && !narrow && typeof raw === "number";
                    const content = showBar ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
                        <span data-slot="ic-data-table-bar" aria-hidden style={{ flex: "1 1 0", minWidth: 48, height: 8, display: "flex" }}>
                          {/* Zero baseline, square at the baseline, rounded at the data end. */}
                          <span style={{ width: `${c.max ? (Math.abs(raw) / c.max) * 100 : 0}%`, minWidth: raw ? 1 : 0, background: raw < 0 ? "var(--_ic-negative)" : on ? "var(--_ic-accent)" : marked.size ? tokens.context : "var(--_ic-accent)", borderRadius: `0 ${tokens.radius / 2}px ${tokens.radius / 2}px 0` }} />
                        </span>
                        <span style={{ flex: "none", minWidth: `${Math.max(4, String(c.fmt(c.max)).length + 1)}ch`, textAlign: "right" }}>{text}</span>
                      </span>
                    ) : (
                      text
                    );
                    return i === 0 ? (
                      <th key={c.key} scope="row" data-slot="ic-data-table-cell" style={base}>
                        {content}
                      </th>
                    ) : (
                      <td key={c.key} data-slot="ic-data-table-cell" data-num={c.numeric ? "" : undefined} style={base}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, cols.length)} data-slot="ic-data-table-empty" style={{ padding: "20px 0", textAlign: "center", color: "var(--_ic-muted)" }}>
                  No rows to show.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {source ? (
        <div data-slot="ic-data-table-source" style={{ marginTop: 10, fontSize: "0.75rem", lineHeight: 1.5, color: "var(--_ic-muted)" }}>
          Source: {source}
        </div>
      ) : null}
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
        {live}
      </span>
    </div>
  );
}

export const DataTable = withMeta(DataTableImpl, {
  name: "data-table",
  component: "DataTable",
  title: "Data table",
  level: "atom",
  category: "figure",
  description: "A restrained editorial table from rows and a column config: aligned tabular numbers, an optional in-cell bar, row highlight and click-to-sort headers.",
  whenToUse: "When readers need to look up exact values, or compare a handful of entities across several measures with different units. Sort it by the column the caption refers to and highlight the row it names.",
  avoid: "Showing a trend or a single comparison (use `line-chart` or `bar-chart`); more than about 7 columns or 30 rows without `maxHeight`.",
  props: [
    { name: "rows", type: "Row[]", required: true, description: "One object per row." },
    { name: "columns", type: "(string | { key, label?, format?, align?, bar?, sortable?, width? })[]", description: "Columns in order. Defaults to every key of the first row. Numeric columns are right-aligned." },
    { name: "caption", type: "string", description: "The table's title, as a real `<caption>`." },
    { name: "subtitle", type: "string", description: "Units and period, under the caption." },
    { name: "source", type: "string", description: 'Shown under the table as "Source: ...".' },
    { name: "highlight", type: "string | number | (string | number)[]", description: "Rows to emphasise, matched on the first column (or `highlightKey`)." },
    { name: "highlightKey", type: "string", description: "Field `highlight` matches against." },
    { name: "sort", type: '{ key, direction?: "asc" | "desc" }', description: "Initial sort." },
    { name: "sortable", type: "boolean", default: "true", description: "Click or press Enter on a header to sort; a third press restores the original order." },
    { name: "maxHeight", type: "number | string", description: "Height before the body scrolls under the sticky header." },
    { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Row padding." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the table, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: {
    type: "data-table",
    theme: "editorial",
    caption: "Wind and solar supplied 67% of Denmark's electricity in 2024",
    subtitle: "Electricity generation by country, 2024",
    source: "Ember (illustrative figures)",
    highlight: "Denmark",
    sort: { key: "share", direction: "desc" },
    columns: [
      { key: "country", label: "Country" },
      { key: "share", label: "Wind and solar share", format: "percent", bar: true, width: "38%" },
      { key: "twh", label: "Generation, TWh", format: "decimal:1" },
      { key: "change", label: "Change vs 2023", format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 } },
    ],
    rows: [
      { country: "Germany", share: 0.43, twh: 209.4, change: 0.031 },
      { country: "Spain", share: 0.42, twh: 112.8, change: 0.044 },
      { country: "Denmark", share: 0.67, twh: 23.1, change: 0.012 },
      { country: "Netherlands", share: 0.41, twh: 49.6, change: 0.058 },
      { country: "Portugal", share: 0.46, twh: 22.9, change: 0.027 },
      { country: "France", share: 0.14, twh: 73.5, change: 0.009 },
      { country: "Poland", share: 0.24, twh: 40.2, change: -0.004 },
    ],
  },
});
