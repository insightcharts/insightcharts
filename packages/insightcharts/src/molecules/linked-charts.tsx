import type { ReactNode } from "react";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { InsightData, type Selection } from "../core/store";
import type { DataInput, Transform } from "../data/types";
import { FilterChips } from "./filter-chips";
import { fitColumns, MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface LinkedChartsProps extends MoleculeProps {
  /** The shared dataset: row-level data that every chart aggregates with its own `transform`. */
  data: DataInput;
  /** Applied once to the shared data, before any chart reads it. */
  transform?: Transform | Transform[];
  /** Two to four charts. Give each `select: true` (or a field name) and a stable `id`, and leave out `data`. */
  charts?: Slot[];
  /** Preferred columns. Default: two (three for three charts in a wide container). */
  columns?: number;
  /** Narrowest a chart may get before the grid drops a column. */
  minChartWidth?: number;
  /** Show the filter line. Default true. */
  filters?: boolean;
  /** Shown in the filter line while nothing is selected. */
  hint?: string;
  /** Display names for the fields in the chips. */
  labels?: Record<string, string>;
  /** Show the filtered row count at the end of the filter line. */
  count?: boolean;
  /** Noun for the count. */
  unit?: string;
  /** Controlled selections, keyed by chart id. */
  selections?: Record<string, Selection>;
  onSelectionsChange?: (selections: Record<string, Selection>) => void;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
  /** JSX alternative to `charts`. */
  children?: ReactNode;
  /**
   * Content rendered inside the shared store, above the chart grid: figures, text or anything
   * else that reads the filtered rows with `useInsightData()` (or a spec that omits `data`).
   */
  before?: Slot | Slot[];
  /** Content rendered inside the shared store, below the chart grid: a detail table, a note. */
  after?: Slot | Slot[];
  /** Space in px between the `before` slot, the grid and the `after` slot. Default 24. */
  gap?: number;
}

const slotList = (slot: Slot | Slot[] | undefined): Slot[] => (slot == null || slot === false ? [] : Array.isArray(slot) ? (slot as Slot[]) : [slot]);

/**
 * Charts that filter each other. One dataset is loaded once and shared. Clicking a mark
 * in any chart filters the rest. The chips above show what is selected.
 */
function LinkedChartsImpl({ data, transform, charts, columns, minChartWidth = 260, filters = true, hint = "Click a mark to filter the other charts", labels, count, unit, selections, onSelectionsChange, title, subtitle, source, note, children, before, after, gap = 24, className, style, ...rest }: LinkedChartsProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = charts ?? [];
  const n = list.length || 2;
  const above = slotList(before);
  const below = slotList(after);
  const cols = fitColumns(width, n, columns ?? (n === 3 && width >= 900 ? 3 : Math.min(2, n)), minChartWidth, 24);
  return (
    <div ref={ref} data-slot="ic-linked-charts" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <InsightData data={data} transform={transform} selections={selections} onSelectionsChange={onSelectionsChange}>
          <MoleculeHeader title={title} subtitle={subtitle} />
          {filters ? <FilterChips hint={hint} labels={labels} count={count} unit={unit} style={{ marginBottom: 16 }} /> : null}
          {above.length ? (
            <div data-slot="ic-linked-charts-before" style={{ minWidth: 0, display: "grid", gap, marginBottom: gap }}>
              {above.map((slot, i) => renderSlot(slot, i))}
            </div>
          ) : null}
          <div data-slot="ic-linked-charts-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: width < 560 ? "24px 16px" : "32px 24px", alignItems: "start" }}>
            {children ??
              list.map((chart, i) => (
                // A lone chart in the last row spans it rather than sitting beside a hole.
                <div key={i} data-slot="ic-linked-charts-item" style={{ minWidth: 0, gridColumn: cols > 1 && i === list.length - 1 && i % cols === 0 ? "1 / -1" : undefined }}>
                  {renderSlot(chart)}
                </div>
              ))}
          </div>
          {below.length ? (
            <div data-slot="ic-linked-charts-after" style={{ minWidth: 0, display: "grid", gap, marginTop: gap }}>
              {below.map((slot, i) => renderSlot(slot, i))}
            </div>
          ) : null}
          <MoleculeFooter source={source} note={note} />
        </InsightData>
      </Provide>
    </div>
  );
}

const SOURCES = ["Hydro", "Wind", "Solar"] as const;
const REGIONS: Record<string, number[][]> = {
  Asia: [[1810, 480, 420], [1790, 590, 560], [1830, 700, 730], [1800, 880, 980], [1860, 1010, 1290]],
  Europe: [[640, 510, 190], [620, 540, 220], [560, 580, 270], [610, 640, 330], [650, 690, 390]],
  "North America": [[690, 400, 150], [680, 450, 190], [700, 500, 240], [660, 520, 290], [670, 560, 360]],
  "Latin America": [[720, 120, 40], [690, 140, 60], [740, 170, 90], [760, 200, 120], [730, 230, 160]],
};
const energy = Object.entries(REGIONS).flatMap(([region, years]) => years.flatMap((row, y) => row.map((twh, s) => ({ region, year: String(2020 + y), source: SOURCES[s], twh }))));
const sum = (groupBy: string | string[], field = "twh") => ({ type: "aggregate", groupBy, measures: { [field]: { op: "sum", field } } });

const cube = (rows: Record<string, number[][]>, a: string, b: string, bs: string[], c: string, cs: string[], field: string) => Object.entries(rows).flatMap(([key, groups]) => groups.flatMap((row, i) => row.map((v, j) => ({ [a]: key, [b]: bs[i], [c]: cs[j], [field]: v }))));
const visits = cube(
  {
    "Natural History": [[120, 80, 60], [130, 110, 95], [125, 150, 160], [115, 90, 70]],
    "Modern Art": [[70, 45, 50], [75, 60, 70], [70, 80, 110], [80, 55, 60]],
    Maritime: [[40, 25, 10], [45, 40, 20], [50, 60, 35], [38, 28, 12]],
  },
  "museum",
  "quarter",
  ["Q1", "Q2", "Q3", "Q4"],
  "visitor",
  ["Local", "Domestic", "International"],
  "visits",
);
const trips = cube(
  {
    Centre: [[310, 40], [180, 150], [290, 120], [60, 45]],
    University: [[220, 20], [160, 40], [190, 35], [45, 20]],
    Harbour: [[90, 30], [70, 160], [100, 140], [25, 40]],
    Suburbs: [[80, 10], [40, 25], [75, 20], [10, 5]],
  },
  "area",
  "time",
  ["Morning", "Midday", "Evening", "Night"],
  "rider",
  ["Member", "Casual"],
  "trips",
);

export const LinkedCharts = withMeta(LinkedChartsImpl, {
  name: "linked-charts",
  component: "LinkedCharts",
  title: "Linked charts",
  level: "molecule",
  category: "layout",
  description: "Two to four charts over one shared dataset in a responsive grid: clicking a mark in one filters the others, with the active filters shown as removable chips.",
  whenToUse: "Exploration of one table along several dimensions: by region, by category and over time. Pass row-level data once; each chart aggregates it with its own `transform`, sets `select: true` and omits `data`.",
  avoid: "A report that states one fixed fact (use `chart-callout` or `scrolly-chart`); charts over unrelated datasets (they cannot filter each other); more than four charts.",
  composes: ["filter-chips", "bar-chart", "line-chart"],
  props: [
    { name: "data", type: "DataInput", required: true, description: "The shared, row-level dataset." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied once to the shared data." },
    { name: "charts", type: "Slot[]", description: "Two to four chart specs or elements. Give each `select: true` (or a field name) and a stable `id`, and leave out `data`." },
    { name: "columns", type: "number", description: "Preferred columns. Default two; fewer when charts would be narrower than `minChartWidth`." },
    { name: "minChartWidth", type: "number", default: "260", description: "Narrowest a chart may get before the grid drops a column." },
    { name: "filters", type: "boolean", default: "true", description: "Show the filter line (`filter-chips`)." },
    { name: "hint", type: "string", default: '"Click a mark to filter the other charts"', description: "Shown in the filter line while nothing is selected." },
    { name: "labels", type: "Record<string, string>", description: "Display names for the fields in the chips." },
    { name: "count", type: "boolean", default: "false", description: "Show the filtered row count at the end of the filter line." },
    { name: "unit", type: "string", default: '"rows"', description: "Noun for the count." },
    { name: "selections", type: "Record<string, Selection>", description: "Controlled selections, keyed by chart id." },
    { name: "onSelectionsChange", type: "(selections) => void", description: "Called when the selections change." },
    { name: "title", type: "string", description: "Heading for the group." },
    { name: "subtitle", type: "string", description: "Measure, population and period shared by the charts." },
    { name: "source", type: "string", description: 'Shown under the grid as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `charts`." },
    { name: "before", type: "Slot | Slot[]", description: "Content rendered inside the shared store above the grid: figures, text, a custom component that calls `useInsightData()`, or a spec that omits `data` (e.g. `stat-row`, `data-table`). It sees the same filtered rows as the charts." },
    { name: "after", type: "Slot | Slot[]", description: "Content rendered inside the shared store below the grid, e.g. a detail table of the filtered rows." },
    { name: "gap", type: "number", default: "24", description: "Space in px between the `before` slot, the grid and the `after` slot." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every chart. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "linked-charts",
    theme: "science",
    title: "Asia generated 46% of the renewable electricity in these four regions from 2020 to 2024",
    subtitle: "Electricity generation from hydro, wind and solar, TWh, four regions, 2020 to 2024",
    data: energy,
    labels: { region: "Region", source: "Source", year: "Year" },
    hint: "Click a bar or a slice to filter the other charts",
    count: true,
    charts: [
      { type: "bar-chart", id: "by-region", x: "region", y: "twh", select: true, format: "compact", height: 200, title: "By region", transform: sum("region") },
      { type: "donut-chart", id: "by-source", name: "source", value: "twh", select: true, format: "compact", centerLabel: "TWh", height: 200, title: "By source", transform: sum("source") },
      { type: "bar-chart", id: "by-year", x: "year", y: "twh", series: "source", stack: true, orientation: "vertical", sort: "none", select: "year", format: "compact", height: 240, title: "By year", transform: sum(["year", "source"]) },
    ],
    source: "Ember, Global Electricity Review 2025",
    note: "Regional figures rounded, illustrative",
  },
});

export const examples = {
  "Two charts, no row count": {
    data: energy,
    labels: { region: "Region", year: "Year" },
    charts: [
      { type: "bar-chart", id: "pair-region", x: "region", y: "twh", select: true, format: "compact", height: 200, title: "Generation by region", transform: sum("region") },
      { type: "line-chart", id: "pair-year", x: "year", y: "twh", series: "source", format: "compact", height: 200, title: "Generation by source over time", transform: sum(["year", "source"]) },
    ],
  },
  "Three views of museum visits, paper theme": {
    theme: "paper",
    title: "The Natural History Museum had 1.3 million of the 2.5 million visits in 2024",
    subtitle: "Visits to three city museums, thousands, by visitor origin and quarter, 2024",
    data: visits,
    labels: { museum: "Museum", visitor: "Visitor", quarter: "Quarter" },
    hint: "Click a mark to filter the other charts",
    unit: "rows",
    charts: [
      { type: "lollipop-chart", id: "v-museum", x: "museum", y: "visits", select: true, format: "integer", height: 180, title: "By museum", transform: sum("museum", "visits") },
      { type: "donut-chart", id: "v-visitor", name: "visitor", value: "visits", select: true, format: "integer", centerLabel: "thousand visits", height: 200, title: "By visitor origin", transform: sum("visitor", "visits") },
      { type: "area-chart", id: "v-quarter", x: "quarter", y: "visits", series: "visitor", stack: true, format: "integer", height: 240, title: "By quarter", transform: sum(["quarter", "visitor"], "visits") },
    ],
    source: "City museums service",
    note: "Illustrative data",
  },
  "Bike-share trips, noir theme": {
    theme: "noir",
    title: "Members made 1.9 million of the 2.8 million bike-share trips in 2024",
    subtitle: "Bike-share trips, thousands, by area, rider type and time of day, 2024",
    data: trips,
    labels: { area: "Area", rider: "Rider", time: "Time of day" },
    hint: "Click a bar to filter the other chart",
    count: true,
    charts: [
      { type: "bar-chart", id: "t-area", x: "area", y: "trips", select: true, format: "integer", height: 220, title: "By area", transform: sum("area", "trips") },
      { type: "bar-chart", id: "t-time", x: "time", y: "trips", series: "rider", stack: true, orientation: "vertical", sort: "none", select: "time", format: "integer", height: 220, title: "By time of day and rider type", transform: sum(["time", "rider"], "trips") },
    ],
    source: "City bike-share operator",
    note: "Illustrative data",
  },
};
