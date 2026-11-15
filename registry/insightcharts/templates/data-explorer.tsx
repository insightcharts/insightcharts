"use client";

import { useMemo, useState } from "react";
import { Callout } from "@/components/insightcharts/atoms/callout";
import { DataTable, type DataTableProps } from "@/components/insightcharts/atoms/data-table";
import { Headline } from "@/components/insightcharts/atoms/headline";
import { makeFormatter, type FormatSpec, withMeta, type Slot, stableKey, useInsightData, type Selection } from "insightcharts/core";
import { aggregateValues, toNumber, transformRows, type AggregateOp, type DataInput, type Row, type Transform } from "insightcharts/data";
import { FilterChips } from "@/components/insightcharts/molecules/filter-chips";
import { LinkedCharts } from "@/components/insightcharts/molecules/linked-charts";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { StatRow } from "@/components/insightcharts/molecules/stat-row";
import { button, frame, FRAME_DOCS, RULE, Sourcing, SOURCING_DOCS, useTemplate, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

export interface DataExplorerFigure {
  /** What the figure measures. */
  label: string;
  /** Field to aggregate. Not needed for `op: "count"`. */
  field?: string;
  /** How to aggregate the filtered rows. Default `"sum"`. */
  op?: AggregateOp;
  /** Count only rows where this field has this value (the numerator of a share). */
  where?: { field: string; value: unknown };
  /** Divide by the sum of this field over the filtered rows: a rate, an average or a share. */
  per?: string;
  format?: FormatSpec;
  /** Shown under the value while no filter is active. */
  context?: string;
}

export interface DataExplorerTable extends Omit<DataTableProps, "rows"> {
  /** Applied to the filtered rows before they are listed, e.g. an aggregate and a sort. */
  transform?: Transform | Transform[];
}

export interface DataExplorerProps extends TemplateProps, TemplateSourcing {
  /** What the starting view shows, as one plain sentence with the number in it. */
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** One sentence telling the reader what they can click and what will happen. */
  instructions?: string;
  /** What to look for in the starting view. */
  finding?: { lead?: string; body?: string; label?: string };
  /** The shared, row-level dataset. */
  data: DataInput;
  /** Applied once, before any chart reads the data. */
  transform?: Transform | Transform[];
  /** Two to four charts. Give each a stable `id` and `select: true`, and leave out `data`. */
  charts: Slot[];
  /** Selections the piece opens with, keyed by chart `id`: `{ "by-rider": { field: "rider", values: ["Casual"] } }`. */
  initialSelections?: Record<string, Selection>;
  /** Figures recomputed from the filtered rows. */
  figures?: DataExplorerFigure[];
  /** A detail table of the filtered rows. */
  table?: DataExplorerTable;
  /** Display names for fields, used in the filter chips. */
  labels?: Record<string, string>;
  /** Noun for what the figures total, e.g. "trips". Used in figure context ("3,650 across all trips"). */
  unit?: string;
  /** Show the filtered row count beside the chips. */
  count?: boolean;
  /** Noun for one row of `data` in that count, e.g. "stations". Default "rows". */
  rowUnit?: string;
  /** Preferred chart columns. */
  columns?: number;
  /** Label of the button that restores the starting selections. */
  restoreLabel?: string;
}

function compute(figure: DataExplorerFigure, rows: Row[]): number {
  const op = figure.op ?? (figure.field ? "sum" : "count");
  const subset = figure.where ? rows.filter((r) => String(r[figure.where!.field]) === String(figure.where!.value)) : rows;
  // Nothing matched: a sum or count of no rows is zero, not "no value".
  const top = subset.length === 0 && rows.length > 0 && (op === "sum" || op === "count") ? 0 : toNumber(aggregateValues(figure.field ? subset.map((r) => r[figure.field!]) : subset, op));
  if (!figure.per) return top;
  const bottom = toNumber(aggregateValues(rows.map((r) => r[figure.per!]), "sum"));
  return bottom ? top / bottom : NaN;
}

function Figures({ figures, unit, locale }: { figures: DataExplorerFigure[]; unit: string; locale?: string }) {
  const store = useInsightData();
  const rows = store?.rowsFor() ?? [];
  const all = store?.all ?? [];
  const filtered = !!store && Object.keys(store.selections).length > 0;
  const items = figures.slice(0, 5).map((f) => {
    const fmt = makeFormatter(f.format, locale);
    const value = compute(f, rows);
    return { label: f.label, value: Number.isFinite(value) ? fmt(value) : "–", context: filtered ? `${fmt(compute(f, all))} across all ${unit}` : f.context };
  });
  return <StatRow items={items} />;
}

function Detail({ table }: { table: DataExplorerTable }) {
  const store = useInsightData();
  const { transform, ...props } = table;
  const source = store?.rowsFor();
  const key = stableKey(transform);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useMemo(() => transformRows(source ?? [], transform), [source, key]);
  return <DataTable density="compact" {...props} rows={rows} />;
}

/**
 * A guided crossfilter. It opens on the author's selection, so the first thing the reader
 * sees is the finding; every click after that is their own question.
 */
function DataExplorerImpl({ title, kicker, deck, byline, date, instructions, finding, data, transform, charts, initialSelections, figures, table, labels, unit = "rows", count = false, rowUnit = "rows", columns, restoreLabel = "Back to the starting view", sources, period, method, note, credit, level = 1, maxWidth = 1080, className, style, ...rest }: DataExplorerProps) {
  const { ref, mode, root, phone, gap, locale } = useTemplate(rest);
  const [selections, setSelections] = useState<Record<string, Selection>>(initialSelections ?? {});
  const atStart = stableKey(selections) === stableKey(initialSelections ?? {});
  return (
    <article ref={ref} data-slot="ic-data-explorer" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {/* One store: the controls, figures and table are slots of the linked charts, so the data loads once. */}
        <LinkedCharts
          data={data}
          transform={transform}
          charts={charts}
          columns={columns}
          filters={false}
          selections={selections}
          onSelectionsChange={setSelections}
          gap={gap}
          before={
            <div data-slot="ic-data-explorer-panel" style={{ minWidth: 0, display: "grid", gap: phone ? 20 : 24, marginTop: -gap / 4 }}>
              {finding?.lead || finding?.body ? <Callout variant="soft" tone="accent" label={finding.label ?? "What to look for"} lead={finding.lead} text={finding.body} /> : null}
              <div data-slot="ic-data-explorer-controls" style={{ minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 16px", borderTop: RULE, paddingTop: 16 }}>
                <FilterChips hint={instructions ?? "Click a mark to filter everything else"} labels={labels} count={count} unit={rowUnit} style={{ flex: "1 1 18rem" }} />
                {initialSelections && !atStart ? (
                  <button type="button" data-slot="ic-button" onClick={() => setSelections(initialSelections)} style={button}>
                    {restoreLabel}
                  </button>
                ) : null}
              </div>
              {instructions && Object.keys(selections).length ? <p data-slot="ic-data-explorer-instructions" style={{ margin: "-12px 0 0", fontSize: "0.8125rem", lineHeight: 1.5, color: "var(--_ic-muted)" }}>{instructions}</p> : null}
              {figures?.length ? (
                <section data-slot="ic-data-explorer-figures" aria-label="Figures for the current selection" aria-live="polite" style={{ minWidth: 0, borderTop: RULE, borderBottom: RULE, padding: phone ? "20px 0" : "24px 0" }}>
                  <Figures figures={figures} unit={unit} locale={locale} />
                </section>
              ) : null}
            </div>
          }
          after={
            table ? (
              <section data-slot="ic-data-explorer-table" aria-label="Detail" style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 }}>
                <Detail table={table} />
              </section>
            ) : undefined
          }
        />
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

// Bike-share trips for one month, in thousands, by rider type, day type, time of day and district.
const DAYPARTS = ["Morning", "Midday", "Evening", "Night"];
const DISTRICTS: [string, number, number][] = [
  ["Centre", 0.38, 0.3],
  ["Riverside", 0.22, 0.4],
  ["University", 0.24, 0.16],
  ["Docklands", 0.16, 0.14],
];
const VOLUME: Record<string, number[]> = { "Member|Weekday": [520, 260, 560, 120], "Member|Weekend": [150, 300, 220, 90], "Casual|Weekday": [60, 180, 140, 50], "Casual|Weekend": [90, 520, 310, 80] };
const trips = Object.entries(VOLUME).flatMap(([key, volumes]) => {
  const [rider, day] = key.split("|");
  const minutesEach = rider === "Member" ? 12 : day === "Weekend" ? 27 : 19;
  return volumes.flatMap((volume, i) =>
    DISTRICTS.map(([district, member, casual]) => {
      const n = Math.round(volume * (rider === "Member" ? member : casual));
      return { rider, day, daypart: DAYPARTS[i], district, trips: n, minutes: n * minutesEach };
    }),
  );
});
const sumTrips = (groupBy: string | string[]) => ({ type: "aggregate", groupBy, measures: { trips: { op: "sum", field: "trips" } } });
export const DataExplorer = withMeta(DataExplorerImpl, {
  name: "data-explorer",
  component: "DataExplorer",
  title: "Data explorer",
  level: "template",
  category: "story",
  description: "A set of linked charts over one shared dataset that filter each other. It has a headline, a sentence of instructions with filter chips, a row of figures that recompute from the filtered rows, two to four charts and an optional detail table. It opens on selections the author chooses.",
  whenToUse: "Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size.",
  avoid: "A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures.",
  composes: ["headline", "callout", "filter-chips", "stat-row", "linked-charts", "data-table", "source-note", "bar-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "What the starting view shows, as one plain sentence with the number in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "instructions", type: "string", description: "One sentence saying what can be clicked and what happens. Shown in the filter line." },
    { name: "finding", type: "{ lead?, body?, label? }", description: "A callout saying what to look for in the starting view." },
    { name: "data", type: "DataInput", required: true, description: "The shared, row-level dataset: rows, CSV text, a URL or a loader." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied once to the shared data." },
    { name: "charts", type: "Slot[]", required: true, description: "Two to four chart specs. Give each a stable `id`, `select: true` (or a field name) and its own aggregating `transform`; leave out `data`." },
    { name: "initialSelections", type: "Record<string, { field, values?, range? }>", description: "Selections the piece opens with, keyed by chart `id`. A button restores them after the reader changes the filter." },
    { name: "figures", type: "{ label, field?, op?, where?: { field, value }, per?, format?, context? }[]", description: "Figures recomputed from the filtered rows: `op` over `field` (default sum; count without a field), optionally restricted by `where` and divided by the sum of `per` for a rate or share. While a filter is active each shows the all-rows value as context." },
    { name: "table", type: "{ transform?, columns?, caption?, sort?, highlight?, ... }", description: "A detail table of the filtered rows: the props of `data-table` without `rows`, plus a `transform` applied first." },
    { name: "labels", type: "Record<string, string>", description: "Display names for fields in the filter chips." },
    { name: "unit", type: "string", default: '"rows"', description: 'Noun for what the figures total, used in figure context ("3,650 across all trips").' },
    { name: "count", type: "boolean", default: "false", description: "Show the filtered row count beside the chips." },
    { name: "rowUnit", type: "string", default: '"rows"', description: "Noun for one row of `data` in that count." },
    { name: "columns", type: "number", description: "Preferred chart columns." },
    { name: "restoreLabel", type: "string", default: '"Back to the starting view"', description: "Label of the button that restores `initialSelections`." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "data-explorer",
    kicker: "City bike share · June",
    title: "Casual riders' trips averaged 24.6 minutes in June, against 12.0 for members",
    deck: "70% of casual trips were at weekends. 40% started in Riverside. The view below is filtered to casual riders.",
    instructions: "Click a bar to filter the other charts and the figures. Click it again to clear.",
    finding: { lead: "Casual riders made 1.43 million of the 3.65 million trips in June", body: "520,000 of them were at weekend middays. Members made 34% of their trips at weekends." },
    data: trips,
    unit: "trips",
    labels: { rider: "Rider", daypart: "Time of day", district: "District", day: "Day" },
    initialSelections: { "by-rider": { field: "rider", values: ["Casual"] } },
    figures: [
      { label: "Trips, thousands", field: "trips", format: "integer" },
      { label: "Average trip length, minutes", field: "minutes", per: "trips", format: "decimal:1" },
      { label: "Share taken at weekends", field: "trips", where: { field: "day", value: "Weekend" }, per: "trips", format: "percent" },
      { label: "Share starting in Riverside", field: "trips", where: { field: "district", value: "Riverside" }, per: "trips", format: "percent" },
    ],
    charts: [
      { type: "bar-chart", id: "by-rider", x: "rider", y: "trips", select: true, sort: "none", orientation: "horizontal", format: "integer", title: "Rider", subtitle: "Trips, thousands", transform: sumTrips("rider") },
      { type: "bar-chart", id: "by-day", x: "day", y: "trips", select: true, sort: "none", orientation: "horizontal", format: "integer", title: "Day", subtitle: "Trips, thousands", transform: sumTrips("day") },
      { type: "bar-chart", id: "by-daypart", x: "daypart", y: "trips", select: true, sort: "none", orientation: "vertical", format: "integer", height: 220, title: "Time of day", subtitle: "Trips, thousands", transform: sumTrips("daypart") },
      { type: "bar-chart", id: "by-district", x: "district", y: "trips", select: true, sort: "desc", orientation: "horizontal", format: "integer", title: "Start district", subtitle: "Trips, thousands", transform: sumTrips("district") },
    ],
    table: {
      caption: "Selected trips by start district and time of day",
      transform: [{ type: "aggregate", groupBy: ["district", "daypart"], measures: { trips: { op: "sum", field: "trips" }, minutes: { op: "sum", field: "minutes" } } }, { type: "derive", as: "length", op: "divide", fields: ["minutes", "trips"] }, { type: "sort", by: "trips", order: "desc" }, { type: "limit", n: 6 }],
      columns: [
        { key: "district", label: "District" },
        { key: "daypart", label: "Time of day" },
        { key: "trips", label: "Trips, thousands", format: "integer", bar: true, width: "34%" },
        { key: "length", label: "Average minutes", format: "decimal:1" },
      ],
    },
    sources: "City bike-share operator, trip records",
    period: "June 2024",
    method: "A trip is a hire of more than one minute. Morning is 6 to 10am, evening 4 to 8pm.",
    note: "Illustrative data",
  },
});
