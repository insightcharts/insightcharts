"use client";

import { makeFormatter, type FormatSpec, withMeta } from "insightcharts/core";
import { toNumber, type DataInput, type Transform } from "insightcharts/data";
import { Delta } from "@/components/insightcharts/atoms/delta";
import { dataState, MoleculeFooter, MoleculeHeader, Provide, useMolecule, useRows, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface RankedListProps extends MoleculeProps {
  /** One row per entity. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Field naming each entity. */
  name: string;
  /** Field with the value that ranks them. */
  value: string;
  /** Field with a change to show at the end of each row: a number (0.12 is +12%) or a string. */
  change?: string;
  /** Format for numeric changes. Default: signed percent. Use `"signed"` for places moved. */
  changeFormat?: FormatSpec;
  /** Whether a positive change is good news. Default true. */
  upIsGood?: boolean;
  /** Field with a short secondary line under each name. */
  detail?: string;
  /** Order by value. `"none"` keeps the data order (already ranked). */
  sort?: "desc" | "asc" | "none";
  /** Show only the first N rows after sorting. */
  limit?: number;
  /** Entity names to emphasise. The other bars are drawn in grey. */
  highlight?: string | string[];
  /** Draw the in-row bar. Default true. */
  bar?: boolean;
  /** Value at which a bar is full. Default: the largest value shown. */
  max?: number;
  format?: FormatSpec;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * A ranking set as a list: position, name, value and a thin bar in every row. The bars
 * allow values to be compared by length. Long names are shown in full.
 */
function RankedListImpl({ data, transform, name, value, change, changeFormat, upIsGood = true, detail, sort = "desc", limit, highlight, bar = true, max, format, title, subtitle, source, note, className, style, ...rest }: RankedListProps) {
  const { ref, width, mode, root, locale } = useMolecule(rest);
  const state = useRows(data, transform);
  const fmt = makeFormatter(format, locale);
  const marked = highlight == null ? [] : Array.isArray(highlight) ? highlight : [highlight];

  let items = state.rows.map((r) => ({ key: String(r[name] ?? ""), value: toNumber(r[value]), change: change ? (r[change] as number | string | null | undefined) : undefined, detail: detail ? r[detail] : undefined })).filter((r) => !Number.isNaN(r.value));
  if (sort !== "none") items = [...items].sort((a, b) => (sort === "asc" ? a.value - b.value : b.value - a.value));
  if (limit) items = items.slice(0, limit);
  const top = max ?? Math.max(0, ...items.map((r) => r.value));
  const narrow = width < 480;
  const digits = String(items.length).length;
  const hasChange = !!change && items.some((r) => r.change != null && r.change !== "");
  // Wide: rank | name | bar | value | change. Narrow: the bar drops under the name.
  // Every row is its own grid, so the value and change columns get fixed widths to keep the bars aligned down the list.
  const valueWidth = `${Math.max(3, ...items.map((r) => fmt(r.value).length)) + 0.5}ch`;
  const columns = [`${digits + 0.5}ch`, narrow || !bar ? "minmax(0, 1fr)" : "minmax(0, 1.1fr)", !narrow && bar ? "minmax(0, 1fr)" : null, valueWidth, hasChange ? "7ch" : null].filter(Boolean).join(" ");
  const placeholder = dataState(state, 160);

  const track = (v: number, on: boolean) => (
    <div data-slot="ic-ranked-list-track" aria-hidden style={{ height: 6, borderRadius: 3, background: "color-mix(in srgb, var(--_ic-grid) 70%, transparent)", minWidth: 0, overflow: "hidden" }}>
      <div data-slot="ic-ranked-list-bar" style={{ height: "100%", width: `${top > 0 ? Math.max(0, Math.min(1, v / top)) * 100 : 0}%`, minWidth: v > 0 ? 2 : 0, borderRadius: "0 3px 3px 0", background: on ? "var(--_ic-accent)" : "var(--_ic-context)", transition: "width .4s ease" }} />
    </div>
  );

  return (
    <div ref={ref} data-slot="ic-ranked-list" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        {placeholder ?? (
          <ol data-slot="ic-ranked-list-items" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {items.map((item, i) => {
              const on = marked.length === 0 || marked.includes(item.key);
              const strong = marked.length > 0 && on;
              return (
                <li
                  key={item.key + i}
                  data-slot="ic-ranked-list-item"
                  data-highlighted={strong || undefined}
                  style={{ display: "grid", gridTemplateColumns: columns, alignItems: "center", columnGap: narrow ? 12 : 16, rowGap: 6, padding: "10px 0", borderTop: i ? "1px solid var(--_ic-grid)" : undefined, fontSize: "0.875rem", lineHeight: 1.4 }}
                >
                  <span data-slot="ic-ranked-list-rank" style={{ color: "var(--_ic-muted)", fontVariantNumeric: "tabular-nums", fontSize: "0.8125rem", alignSelf: narrow && bar ? "start" : undefined }}>
                    <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>Rank </span>
                    {i + 1}
                  </span>
                  <span data-slot="ic-ranked-list-name" style={{ minWidth: 0, fontWeight: strong ? 650 : 500, color: "var(--_ic-ink)", overflowWrap: "anywhere" }}>
                    {item.key}
                    {item.detail != null && item.detail !== "" ? (
                      <span data-slot="ic-ranked-list-detail" style={{ display: "block", fontWeight: 400, fontSize: "0.8125rem", color: "var(--_ic-muted)" }}>
                        {String(item.detail)}
                      </span>
                    ) : null}
                  </span>
                  {!narrow && bar ? track(item.value, on) : null}
                  <span data-slot="ic-ranked-list-value" style={{ fontVariantNumeric: "tabular-nums", fontWeight: strong ? 650 : 500, color: "var(--_ic-ink)", textAlign: "right", whiteSpace: "nowrap" }}>
                    {fmt(item.value)}
                  </span>
                  {hasChange ? (
                    <span data-slot="ic-ranked-list-change" style={{ fontSize: "0.8125rem", display: "flex", justifyContent: "flex-end", minWidth: 0 }}>
                      {item.change != null && item.change !== "" ? <Delta value={typeof item.change === "number" ? item.change : String(item.change)} format={changeFormat} upIsGood={upIsGood} /> : null}
                    </span>
                  ) : null}
                  {narrow && bar ? <div style={{ gridColumn: "2 / -1", minWidth: 0 }}>{track(item.value, on)}</div> : null}
                </li>
              );
            })}
          </ol>
        )}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const cities = [
  { city: "Copenhagen", country: "Denmark", share: 49, change: 0.04 },
  { city: "Amsterdam", country: "Netherlands", share: 35, change: 0.01 },
  { city: "Utrecht", country: "Netherlands", share: 34, change: 0.02 },
  { city: "Münster", country: "Germany", share: 31, change: 0.0 },
  { city: "Antwerp", country: "Belgium", share: 26, change: 0.05 },
  { city: "Malmö", country: "Sweden", share: 25, change: -0.01 },
  { city: "Bordeaux", country: "France", share: 13, change: 0.06 },
  { city: "Paris", country: "France", share: 11, change: 0.07 },
];

export const RankedList = withMeta(RankedListImpl, {
  name: "ranked-list",
  component: "RankedList",
  title: "Ranked list",
  level: "molecule",
  category: "layout",
  description: "A ranking as a list: position, name, value and a thin in-row bar, with an optional change indicator and highlighted rows.",
  whenToUse: "A top-N list where the names matter as much as the values: league tables, best and worst performers, leaderboards with a movement column. It keeps long names readable and works in a narrow column.",
  avoid: "Precise visual comparison of many values or more than about 15 rows (use `bar-chart`); several measures per entity (use `data-table` or `comparison-table`); rank changing over time (use `bump-chart`).",
  composes: ["delta"],
  props: [
    { name: "data", type: "DataInput", description: "One row per entity. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied before ranking." },
    { name: "name", type: "string", required: true, description: "Field naming each entity." },
    { name: "value", type: "string", required: true, description: "Field with the value that ranks them. Bars start at zero." },
    { name: "change", type: "string", description: "Field with a change shown at the end of each row: a number (0.12 is +12%) or a string." },
    { name: "changeFormat", type: "FormatSpec", default: "signed percent", description: 'Format for numeric changes, e.g. `"signed"` for places moved.' },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether a positive change is good news." },
    { name: "detail", type: "string", description: "Field with a short secondary line under each name." },
    { name: "sort", type: '"desc" | "asc" | "none"', default: '"desc"', description: "Order by value; `none` keeps the data order." },
    { name: "limit", type: "number", description: "Show only the first N rows after sorting." },
    { name: "highlight", type: "string | string[]", description: "Entity names to emphasise. The other bars are drawn in grey." },
    { name: "bar", type: "boolean", default: "true", description: "Draw the in-row bar." },
    { name: "max", type: "number", description: "Value at which a bar is full. Default: the largest value shown." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for the values." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Measure, population and period." },
    { name: "source", type: "string", description: 'Shown under the list as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "ranked-list",
    title: "11% of commuting trips in Paris are made by bicycle",
    subtitle: "Share of commuting trips made by bicycle, selected European cities, with change since 2019",
    data: cities,
    name: "city",
    detail: "country",
    value: "share",
    format: "{value}%",
    change: "change",
    highlight: "Paris",
    source: "City mobility surveys",
    note: "Illustrative data",
  },
});
