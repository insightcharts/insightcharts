"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { makeFormatter, type FormatSpec, withMeta } from "insightcharts/core";
import { aggregateValues, groupRows, toNumber, type DataInput, type Row, type Transform } from "insightcharts/data";
import { Delta } from "@/components/insightcharts/atoms/delta";
import { Sparkline } from "@/components/insightcharts/atoms/sparkline";
import { dataState, MoleculeFooter, Provide, useMolecule, useRows, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface ComparisonTableColumn {
  /** Field the column reads. */
  key: string;
  /** Header text. Defaults to the key. */
  label?: string;
  /**
   * What the cell draws. `"sparkline"`: the series as a small line. `"delta"`: a change with
   * arrow and colour. `"bar"`: the number with an in-cell bar. Default: `"number"` for numeric
   * values, `"text"` otherwise.
   */
  kind?: "text" | "number" | "sparkline" | "delta" | "bar";
  /**
   * Wide data: the columns that make up the series, in order, for a `sparkline` or a computed
   * `delta` (e.g. `["2020", "2021", "2022"]`). Without it a sparkline cell expects an array of numbers in `key`.
   */
  fields?: string[];
  /** Long data (`groupBy`): how a group's rows reduce to the number shown. Default `"last"`. */
  agg?: "last" | "first" | "sum" | "mean" | "min" | "max";
  /** Computed deltas: relative change, or the difference in the value's own units. */
  change?: "percent" | "absolute";
  format?: FormatSpec;
  /** Deltas: whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Sparklines: line or bars. */
  mark?: "line" | "bar";
  align?: "left" | "right";
  /** CSS width of the column. */
  width?: number | string;
  /** Hide the column when the table is narrower than this many px. */
  hideBelow?: number;
  /** Set false to stop readers sorting by this column. Sparkline columns are never sortable. */
  sortable?: boolean;
}

export interface ComparisonTableProps extends MoleculeProps {
  /** Wide data: one row per entity. Long data: one row per entity and period, with `groupBy`. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Columns in order. The first is the row header. */
  columns: (string | ComparisonTableColumn)[];
  /** Long data: the entity field. Rows sharing a value become one table row; their order is the series order. */
  groupBy?: string;
  /** Entities to emphasise, matched on the first column. */
  highlight?: string | string[];
  /** Order rows by a column's value. With `sortable`, this is the order the table opens in. */
  sort?: { key: string; direction?: "asc" | "desc" };
  /** Let readers sort by clicking (or pressing Enter on) a column header. Default true. */
  sortable?: boolean;
  /** Show only the first N rows. */
  limit?: number;
  density?: "comfortable" | "compact";
  /** The table's title, as a real `<caption>`. */
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

type Cell = { text?: string; number?: number; series?: number[]; delta?: number | string };

const numbers = (values: unknown[]) => values.map(toNumber).filter((v) => !Number.isNaN(v));

function changeOf(series: number[], mode: "percent" | "absolute", fmt: (v: unknown) => string): number | string | undefined {
  if (series.length < 2) return undefined;
  const a = series[0];
  const b = series[series.length - 1];
  if (mode === "absolute") return b === a ? fmt(0) : `${b > a ? "+" : "−"}${fmt(Math.abs(b - a))}`;
  return a === 0 ? undefined : (b - a) / Math.abs(a);
}

// A delta written as text ("+18.8 pts", "−2 places") still sorts by its number.
const leadingNumber = (text: string): number | undefined => {
  const n = parseFloat(text.replace(/−/g, "-").replace(/[,\s]/g, ""));
  return Number.isNaN(n) ? undefined : n;
};

// Same glyph as `data-table`: two chevrons, the active one at full strength.
function SortGlyph({ state }: { state: "asc" | "desc" | null }) {
  return (
    <svg data-slot="ic-comparison-table-sort-icon" aria-hidden viewBox="0 0 8 12" width={8} height={12} style={{ flex: "none" }}>
      <path d="M1 4.5 4 1.5l3 3" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={state === "asc" ? 1 : state ? 0.25 : 0.45} />
      <path d="M1 7.5 4 10.5l3-3" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={state === "desc" ? 1 : state ? 0.25 : 0.45} />
    </svg>
  );
}

type Order = { at: number; direction: "asc" | "desc" } | null;

/**
 * A table whose rows carry their own evidence: exact values in aligned columns, the shape
 * of each row's series as a sparkline, and its change as a signed, coloured delta.
 */
function ComparisonTableImpl({ data, transform, columns, groupBy, highlight, sort, sortable = true, limit, density = "comfortable", title, subtitle, source, note, className, style, ...rest }: ComparisonTableProps) {
  const { ref, width, mode, root, locale } = useMolecule(rest);
  const state = useRows(data, transform);
  // `undefined` follows the `sort` prop; a header click takes over (null restores the data's order).
  const [picked, setPicked] = useState<Order | undefined>(undefined);
  const [live, setLive] = useState("");
  const cols = (columns ?? []).map((c) => (typeof c === "string" ? { key: c } : c));
  const marked = highlight == null ? [] : Array.isArray(highlight) ? highlight : [highlight];
  const groups: Row[][] = groupBy ? [...groupRows(state.rows, groupBy).values()] : state.rows.map((r) => [r]);

  const kindOf = (c: ComparisonTableColumn, sample: Row | undefined): NonNullable<ComparisonTableColumn["kind"]> => {
    if (c.kind) return c.kind;
    if (c.fields) return "sparkline";
    const v = sample?.[c.key];
    if (Array.isArray(v)) return "sparkline";
    return typeof v === "number" && c.key !== groupBy ? "number" : "text";
  };
  const kinds = cols.map((c) => kindOf(c, state.rows[0]));

  const cellOf = (c: ComparisonTableColumn, kind: string, rows: Row[]): Cell => {
    const first = rows[0] ?? {};
    const fmt = makeFormatter(c.format, locale);
    // The series behind a sparkline or a computed delta, whichever shape the data has.
    const series = c.fields ? numbers(c.fields.map((f) => first[f])) : groupBy ? numbers(rows.map((r) => r[c.key])) : Array.isArray(first[c.key]) ? numbers(first[c.key] as unknown[]) : [];
    if (kind === "sparkline") return { series };
    if (kind === "delta") {
      const raw = first[c.key];
      const direct = !groupBy && !c.fields && !Array.isArray(raw);
      const delta = direct ? (raw as number | string | undefined) : changeOf(series, c.change ?? "percent", fmt);
      return { delta: delta ?? undefined, number: typeof delta === "number" ? delta : typeof delta === "string" ? leadingNumber(delta) : undefined };
    }
    if (kind === "text") return { text: String(first[c.key] ?? "") };
    const value = groupBy ? toNumber(aggregateValues(rows.map((r) => r[c.key]), c.agg ?? "last")) : toNumber(first[c.key]);
    return { number: Number.isNaN(value) ? undefined : value, text: Number.isNaN(value) ? "" : fmt(value) };
  };

  let body = groups.map((rows) => ({ cells: cols.map((c, i) => cellOf(c, kinds[i], rows)) }));
  const fromProp: Order = sort && cols.some((c) => c.key === sort.key) ? { at: cols.findIndex((c) => c.key === sort.key), direction: sort.direction === "asc" ? "asc" : "desc" } : null;
  const order: Order = picked !== undefined && (picked === null || picked.at < cols.length) ? picked : fromProp;
  if (order) {
    const { at } = order;
    const dir = order.direction === "asc" ? 1 : -1;
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
    body = [...body].sort((a, b) => {
      const x = a.cells[at];
      const y = b.cells[at];
      if (x.number == null && y.number == null) return collator.compare(x.text ?? String(x.delta ?? ""), y.text ?? String(y.delta ?? "")) * dir;
      // Rows without a value sink to the bottom in either direction.
      if (x.number == null) return 1;
      if (y.number == null) return -1;
      return (x.number - y.number) * dir;
    });
  }
  const canSort = (i: number) => sortable && cols[i].sortable !== false && kinds[i] !== "sparkline";
  const cycle = (i: number) => {
    // Numbers start largest-first, text A to Z; a third press restores the data's own order.
    const first = kinds[i] === "text" ? "asc" : "desc";
    const now = order?.at === i ? order.direction : null;
    const next = now == null ? first : now === first ? (first === "desc" ? "asc" : "desc") : null;
    setPicked(next ? { at: i, direction: next } : null);
    setLive(next ? `Sorted by ${cols[i].label ?? cols[i].key}, ${next === "asc" ? "ascending" : "descending"}` : "Original order restored");
  };
  if (limit) body = body.slice(0, limit);

  const visible = cols.map((c, i) => i === 0 || !c.hideBelow || width >= c.hideBelow);
  const maxOf = cols.map((_, i) => (kinds[i] === "bar" ? Math.max(0, ...body.map((r) => r.cells[i].number ?? 0)) : 0));
  const compact = density === "compact";
  const padY = compact ? 6 : 10;
  const narrow = width < 480;
  const padX = narrow ? 12 : 20;
  const right = (c: ComparisonTableColumn, kind: string) => (c.align ? c.align === "right" : kind === "number" || kind === "delta" || kind === "bar");
  const cellStyle = (i: number, c: ComparisonTableColumn, kind: string): CSSProperties => ({ /* Longhands only: mixing them with the shorthand breaks on re-render. */ paddingTop: padY, paddingRight: i === cols.length - 1 ? 0 : padX, paddingBottom: padY, paddingLeft: 0, textAlign: right(c, kind) ? "right" : "left", verticalAlign: "middle", borderBottom: "1px solid var(--_ic-grid)", width: c.width ?? (kind === "sparkline" ? (narrow ? 64 : 112) : undefined) });
  const placeholder = dataState(state, 160);

  const draw = (cell: Cell, c: ComparisonTableColumn, kind: string, i: number, name: string): ReactNode => {
    if (kind === "sparkline") {
      if (!cell.series || cell.series.length < 2) return null;
      const rows = cell.series.map((v, k) => ({ at: c.fields?.[k] ?? String(k + 1), v }));
      return <Sparkline data={rows} x="at" y="v" mark={c.mark} format={c.format} height={compact ? 22 : 28} alt={`${name}, ${c.label ?? c.key}: from ${makeFormatter(c.format, locale)(cell.series[0])} to ${makeFormatter(c.format, locale)(cell.series[cell.series.length - 1])}.`} style={{ width: "100%", minWidth: 56 }} />;
    }
    if (kind === "delta") return cell.delta == null || cell.delta === "" ? <span style={{ color: "var(--_ic-muted)" }}>–</span> : <Delta value={cell.delta} format={typeof cell.delta === "number" && c.change !== "absolute" && !c.fields && !groupBy ? c.format : undefined} upIsGood={c.upIsGood} />;
    if (kind === "bar") {
      const share = maxOf[i] > 0 && cell.number != null ? Math.max(0, cell.number / maxOf[i]) : 0;
      return (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 8, width: "100%" }}>
          <span aria-hidden data-slot="ic-comparison-table-bar" style={{ flex: "1 1 40px", maxWidth: 96, height: 6, borderRadius: 3, background: "color-mix(in srgb, var(--_ic-grid) 70%, transparent)", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${share * 100}%`, borderRadius: "0 3px 3px 0", background: "var(--_ic-accent)" }} />
          </span>
          <span style={{ minWidth: "4ch" }}>{cell.text}</span>
        </span>
      );
    }
    return cell.text;
  };

  return (
    <div ref={ref} data-slot="ic-comparison-table" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        {placeholder ? (
          <>
            {title ? <h3 data-slot="ic-title">{title}</h3> : null}
            {subtitle ? <p data-slot="ic-subtitle">{subtitle}</p> : null}
            <div style={{ marginTop: 12 }}>{placeholder}</div>
          </>
        ) : (
          <div data-slot="ic-comparison-table-scroll" style={{ overflowX: "auto", minWidth: 0 }}>
            <table data-slot="ic-comparison-table-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", lineHeight: 1.4, fontVariantNumeric: "tabular-nums" }}>
              {title || subtitle ? (
                <caption style={{ captionSide: "top", textAlign: "left", paddingBottom: 12 }}>
                  {title ? (
                    <span data-slot="ic-title" style={{ display: "block" }}>
                      {title}
                    </span>
                  ) : null}
                  {subtitle ? (
                    <span data-slot="ic-subtitle" style={{ display: "block" }}>
                      {subtitle}
                    </span>
                  ) : null}
                </caption>
              ) : null}
              <thead>
                <tr>
                  {cols.map((c, i) =>
                    visible[i] ? (
                      <th key={c.key + i} scope="col" data-slot="ic-comparison-table-head" aria-sort={canSort(i) ? (order?.at === i ? (order.direction === "asc" ? "ascending" : "descending") : "none") : undefined} style={{ ...cellStyle(i, c, kinds[i]), paddingTop: 0, paddingBottom: 8, verticalAlign: "bottom", borderBottom: "1px solid var(--_ic-axis)", fontSize: "0.75rem", fontWeight: 500, color: "var(--_ic-muted)", whiteSpace: narrow ? undefined : "nowrap" }}>
                        {canSort(i) ? (
                          // A real button: focusable, and Enter or Space sorts.
                          <button type="button" data-slot="ic-comparison-table-sort" title={`Sort by ${c.label ?? c.key}`} onClick={() => cycle(i)} style={{ appearance: "none", background: "none", border: 0, padding: i === cols.length - 1 ? "2px 0 2px 4px" : i === 0 ? "2px 4px 2px 0" : "2px 4px", margin: i === cols.length - 1 ? "-2px 0 -2px -4px" : i === 0 ? "-2px -4px -2px 0" : "-2px -4px", verticalAlign: "bottom", font: "inherit", letterSpacing: "inherit", textAlign: "inherit", color: order?.at === i ? "var(--_ic-ink)" : "inherit", cursor: "pointer", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 6, flexDirection: right(c, kinds[i]) ? "row-reverse" : "row" }}>
                            <span>{c.label ?? c.key}</span>
                            <SortGlyph state={order?.at === i ? order.direction : null} />
                          </button>
                        ) : (
                          c.label ?? c.key
                        )}
                      </th>
                    ) : null,
                  )}
                </tr>
              </thead>
              <tbody>
                {body.map((row, r) => {
                  const name = row.cells[0]?.text ?? "";
                  const strong = marked.includes(name);
                  return (
                    <tr key={name + r} data-slot="ic-comparison-table-row" data-highlighted={strong || undefined}>
                      {row.cells.map((cell, i) => {
                        if (!visible[i]) return null;
                        const c = cols[i];
                        const base = { ...cellStyle(i, c, kinds[i]), borderBottom: r === body.length - 1 ? "none" : "1px solid var(--_ic-grid)" };
                        return i === 0 ? (
                          <th key={i} scope="row" data-slot="ic-comparison-table-name" style={{ ...base, fontWeight: strong ? 700 : 500, color: "var(--_ic-ink)", overflowWrap: "break-word" }}>
                            {draw(cell, c, kinds[i], i, name)}
                          </th>
                        ) : (
                          <td key={i} data-slot="ic-comparison-table-cell" data-kind={kinds[i]} style={{ ...base, color: "var(--_ic-ink)", fontWeight: strong && kinds[i] !== "delta" ? 600 : 400, whiteSpace: kinds[i] === "text" ? undefined : "nowrap" }}>
                            {draw(cell, c, kinds[i], i, name)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <MoleculeFooter source={source} note={note} />
        <span data-slot="ic-comparison-table-live" role="status" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
          {live}
        </span>
      </Provide>
    </div>
  );
}

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"];
const shares: [string, number[], number][] = [
  ["Germany", [40.1, 44.2, 40.9, 44.5, 52.6, 58.9], 498],
  ["Spain", [37.5, 44.1, 46.7, 42.2, 50.3, 56.8], 264],
  ["Netherlands", [18.2, 26.1, 33.0, 40.1, 47.7, 52.4], 121],
  ["Italy", [39.9, 41.7, 40.3, 35.6, 43.8, 49.0], 264],
  ["France", [20.9, 24.2, 22.5, 24.4, 27.0, 28.3], 536],
  ["Poland", [14.1, 17.2, 16.9, 20.6, 26.4, 29.5], 167],
];
const wide = shares.map(([country, s, twh]) => ({ country, ...Object.fromEntries(YEARS.map((y, i) => [y, s[i]])), share: s[5], twh }));
export const ComparisonTable = withMeta(ComparisonTableImpl, {
  name: "comparison-table",
  component: "ComparisonTable",
  title: "Comparison table",
  level: "molecule",
  category: "layout",
  description: "A table whose rows carry inline sparklines, deltas and in-cell bars beside their exact values, from rows and a column config.",
  whenToUse: "Comparing five to twenty entities on a level, a trend and a change at once: countries, products, teams. Readers look up their row. The sparkline and delta show how the value changed.",
  avoid: "Plain lookups with no series (use `data-table`); one measure ranked (use `ranked-list` or `bar-chart`); trends the reader must compare precisely (use `small-multiples`). Each sparkline has its own scale, so it shows the direction of change and cannot be used to compare levels between rows.",
  composes: ["sparkline", "delta"],
  props: [
    { name: "data", type: "DataInput", description: "Wide data: one row per entity. Long data: one row per entity and period, with `groupBy`. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied before rows are grouped." },
    { name: "columns", type: "(string | { key, label?, kind?, fields?, agg?, change?, format?, upIsGood?, mark?, align?, width?, hideBelow?, sortable? })[]", required: true, description: "Columns in order; the first is the row header. `kind` is `text`, `number`, `sparkline`, `delta` or `bar`. For wide data give a sparkline or computed delta its series with `fields`; for long data they use the group's rows." },
    { name: "groupBy", type: "string", description: "Long data: the entity field. Rows sharing a value become one table row, in data order." },
    { name: "highlight", type: "string | string[]", description: "Entities to emphasise, matched on the first column." },
    { name: "sort", type: '{ key, direction?: "asc" | "desc" }', description: "Order rows by a column's value. Default direction: descending. With `sortable` this is the opening order." },
    { name: "sortable", type: "boolean", default: "true", description: "Click or press Enter on a column header to sort by it (numbers largest first, text A to Z); a second press reverses and a third restores the original order. Sparkline columns do not sort; set `sortable: false` on a column to exclude it." },
    { name: "limit", type: "number", description: "Show only the first N rows." },
    { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Row padding." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label. Set as the table's `<caption>`." },
    { name: "subtitle", type: "string", description: "Units and period." },
    { name: "source", type: "string", description: 'Shown under the table as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to the sparklines and deltas." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "comparison-table",
    title: "The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024",
    subtitle: "Renewable share of electricity generation, selected EU countries, 2019 to 2024",
    data: wide,
    columns: [
      { key: "country", label: "Country" },
      { key: "twh", label: "Generation, TWh", kind: "bar", format: "integer", hideBelow: 560 },
      { key: "share", label: "Share, 2024", format: "{value}%" },
      { key: "trend", label: "2019 to 2024", kind: "sparkline", fields: YEARS, format: "{value}%" },
      { key: "change", label: "Change", kind: "delta", fields: YEARS, change: "absolute", format: "{value} pts" },
    ],
    sort: { key: "share" },
    highlight: "Netherlands",
    source: "Ember, European Electricity Review 2025",
    note: "Rounded, illustrative",
  },
});
