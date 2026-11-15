import type { ReactNode } from "react";
import { withMeta } from "../core/meta";
import { renderSlot, type InsightSpec } from "../core/spec";
import { LegendKey, type LegendKeyItem } from "../atoms/legend-key";
import { groupRows } from "../data/transform";
import type { DataInput, Row, Transform } from "../data/types";
import { dataState, fitColumns, MoleculeFooter, MoleculeHeader, Provide, useMolecule, useRows, type MoleculeProps } from "./_shared";

export interface SmallMultipleGridProps extends MoleculeProps {
  /** Rows for every panel together. Omit inside `<InsightData>`. */
  data?: DataInput;
  /** Applied before the rows are split. */
  transform?: Transform | Transform[];
  /** Field whose values each get a panel. */
  facet: string;
  /**
   * The chart repeated in every panel: a spec without `data` (each panel receives its own
   * rows), or a function `(facetValue, rows) => element` from JSX.
   */
  chart: InsightSpec | ((facet: string, rows: Row[]) => ReactNode);
  /** Preferred number of columns. Default: up to four, reduced to fit `minPanelWidth`. */
  columns?: number;
  /** Narrowest a panel may get before the grid drops a column. */
  minPanelWidth?: number;
  /** Panel order: data order, alphabetical, or an explicit list of facet values. */
  order?: "data" | "asc" | "desc" | string[];
  /** Plot height of each panel when the spec does not set one. */
  panelHeight?: number;
  /** Passed to every panel as its `highlight`, so the same entity is emphasised everywhere. */
  highlight?: string | string[];
  /** Facet values whose panel titles are emphasised. */
  emphasis?: string | string[];
  /** One shared colour key above the panels, in series order. Turn the panels' own legends off (`legend: false` in the spec). */
  legend?: (string | LegendKeyItem)[];
  /** Display names for facet values. */
  names?: Record<string, string>;
  /** Heading level of the panel titles. */
  level?: 2 | 3 | 4 | 5 | 6;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * Any chart, repeated once per value of a field. Each panel gets the rows for its value
 * and a small title; the grid picks its columns from the container width.
 */
function SmallMultipleGridImpl({ data, transform, facet, chart, columns, minPanelWidth = 200, order = "data", panelHeight = 160, highlight, emphasis, legend, names, level = 4, title, subtitle, source, note, className, style, ...rest }: SmallMultipleGridProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const state = useRows(data, transform);
  const groups = groupRows(state.rows, facet);
  let keys = [...groups.keys()];
  if (Array.isArray(order)) keys = [...order.filter((k) => groups.has(k)), ...keys.filter((k) => !order.includes(k))];
  else if (order !== "data") keys.sort((a, b) => (order === "asc" ? a.localeCompare(b, undefined, { numeric: true }) : b.localeCompare(a, undefined, { numeric: true })));
  const n = keys.length;
  const cols = fitColumns(width, n, columns ?? Math.min(4, n), minPanelWidth, 24);
  const marked = emphasis == null ? [] : Array.isArray(emphasis) ? emphasis : [emphasis];
  const Heading = `h${level}` as "h4";
  const placeholder = dataState(state, panelHeight);

  return (
    <div ref={ref} data-slot="ic-small-multiple-grid" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        {legend?.length ? <LegendKey items={legend} style={{ marginBottom: 16 }} /> : null}
        {placeholder ?? (
          <div data-slot="ic-small-multiple-grid-panels" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: "24px 24px", alignItems: "start" }}>
            {keys.map((key) => {
              const rows = groups.get(key) ?? [];
              const strong = marked.includes(key);
              return (
                <section key={key} data-slot="ic-small-multiple-grid-panel" data-facet={key} style={{ minWidth: 0 }}>
                  <Heading data-slot="ic-small-multiple-grid-title" style={{ margin: "0 0 8px", paddingTop: 8, borderTop: `1px solid ${strong ? "var(--_ic-ink)" : "var(--_ic-grid)"}`, fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: strong ? 700 : 600, color: marked.length && !strong ? "var(--_ic-ink-2)" : "var(--_ic-ink)", overflowWrap: "anywhere" }}>
                    {names?.[key] ?? key}
                  </Heading>
                  {typeof chart === "function" ? chart(key, rows) : renderSlot({ height: panelHeight, ...(highlight != null ? { highlight } : null), ...chart, data: rows })}
                </section>
              );
            })}
          </div>
        )}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const AGES = ["16-24", "25-34", "35-49", "50-64", "65+"];
const remote: Record<string, number[][]> = {
  Netherlands: [[18, 22], [44, 21], [41, 19], [33, 17], [14, 9]],
  Sweden: [[14, 20], [39, 22], [37, 20], [30, 16], [11, 8]],
  Germany: [[9, 15], [24, 18], [23, 16], [18, 13], [8, 6]],
  France: [[8, 12], [25, 14], [24, 13], [17, 10], [7, 5]],
  Spain: [[5, 9], [13, 12], [13, 11], [10, 8], [4, 4]],
  Italy: [[3, 6], [9, 8], [9, 8], [7, 6], [3, 3]],
};
const work = Object.entries(remote).flatMap(([country, rows]) => rows.map(([usually, sometimes], i) => ({ country, age: AGES[i], Usually: usually, Sometimes: sometimes })));

const pairs = Object.entries({
  "Alder Marsh": [[4, 11], [18, 22], [41, 27]],
  "Birch Fen": [[2, 5], [12, 15], [36, 19]],
  "Cedar Lake": [[6, 9], [25, 24], [22, 18]],
  "Dune Point": [[1, 3], [7, 11], [58, 44]],
} as Record<string, number[][]>).flatMap(([reserve, rows]) => rows.map(([y2014, y2024], i) => ({ reserve, species: ["Osprey", "Kingfisher", "Lapwing"][i], y2014, y2024 })));

export const SmallMultipleGrid = withMeta(SmallMultipleGridImpl, {
  name: "small-multiple-grid",
  component: "SmallMultipleGrid",
  title: "Small multiple grid",
  level: "molecule",
  category: "layout",
  description: "Repeats any chart spec once per value of a facet field, each panel with its own filtered rows and a title, in a grid that follows the container width.",
  whenToUse: "Faceting a chart form the `small-multiples` atom does not draw: stacked bars, scatter plots, donuts, waffles, dumbbells, histograms. Also when each panel should be a full chart with its own tooltip and axis.",
  avoid: "Line, area or bar facets that must share one value scale: use the `small-multiples` atom, which draws every panel in one chart on a common axis. Here each panel scales to its own rows unless the spec fixes the axis (for example `option: { xAxis: { max: 70 } }`), so say so in the subtitle or fix it. More than about twelve panels.",
  composes: ["legend-key", "bar-chart", "waffle-chart", "dumbbell-chart"],
  props: [
    { name: "data", type: "DataInput", description: "Rows for every panel together. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied before the rows are split by `facet`." },
    { name: "facet", type: "string", required: true, description: "Field whose values each get a panel." },
    { name: "chart", type: "InsightSpec | (facet, rows) => ReactNode", required: true, description: "The chart repeated in every panel: a spec without `data` and without a `title`, or a render function from JSX." },
    { name: "columns", type: "number", description: "Preferred columns. Default: up to four, reduced to fit `minPanelWidth`." },
    { name: "minPanelWidth", type: "number", default: "200", description: "Narrowest a panel may get before the grid drops a column." },
    { name: "order", type: '"data" | "asc" | "desc" | string[]', default: '"data"', description: "Panel order: data order, alphabetical, or an explicit list of facet values." },
    { name: "panelHeight", type: "number", default: "160", description: "Plot height of each panel when the spec sets none." },
    { name: "highlight", type: "string | string[]", description: "Passed to every panel as its `highlight`, so the same entity is emphasised everywhere." },
    { name: "emphasis", type: "string | string[]", description: "Facet values whose panel titles are emphasised." },
    { name: "legend", type: "(string | { label, color?, index?, shape?, muted? })[]", description: "One shared colour key above the panels (`legend-key` items, in series order). Set `legend: false` in the chart spec so panels do not repeat it." },
    { name: "names", type: "Record<string, string>", description: "Display names for facet values." },
    { name: "level", type: "2 | 3 | 4 | 5 | 6", default: "4", description: "Heading level of the panel titles." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Measure, population, period, and whether the panels share a scale." },
    { name: "source", type: "string", description: 'Shown under the grid as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every panel. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "small-multiple-grid",
    theme: "poster",
    title: "65% of Dutch workers aged 25 to 34 worked from home usually or sometimes in 2023",
    subtitle: "Share of employed people working from home usually or sometimes, by age group, six EU countries, 2023. All panels run from 0 to 70%",
    data: work,
    facet: "country",
    columns: 3,
    panelHeight: 170,
    legend: ["Usually", "Sometimes"],
    chart: { type: "bar-chart", x: "age", y: ["Usually", "Sometimes"], stack: true, sort: "none", orientation: "horizontal", format: "{value}%", labels: false, legend: false, option: { xAxis: { max: 70 } } },
    source: "Eurostat, Labour Force Survey",
    note: "Rounded, illustrative",
  },
});

export const examples = {
  "Shared highlight, two columns, emphasised panel": {
    title: "44% of Dutch workers aged 25 to 34 usually worked from home in 2023",
    subtitle: "Share usually working from home, by age group, 2023. Panels are on their own scales",
    data: work.filter((r) => ["Netherlands", "Germany", "Spain", "Italy"].includes(r.country)),
    facet: "country",
    columns: 2,
    highlight: "25-34",
    emphasis: "Netherlands",
    chart: { type: "bar-chart", x: "age", y: "Usually", sort: "none", orientation: "vertical", format: "{value}%" },
    note: "Illustrative data",
  },
  "A waffle chart in each panel, science theme": {
    theme: "science",
    data: [
      { region: "Europe", group: "Online", share: 91 },
      { region: "Americas", group: "Online", share: 87 },
      { region: "Asia-Pacific", group: "Online", share: 66 },
      { region: "Africa", group: "Online", share: 37 },
    ],
    facet: "region",
    panelHeight: 150,
    chart: { type: "waffle-chart", name: "group", value: "share", total: 100, legend: false },
    title: "91% of people in Europe used the internet in 2023",
    subtitle: "Share of the population using the internet, by region, 2023",
    source: "ITU Facts and Figures 2023",
    note: "Figures are approximate, for illustration",
  },
  "A dumbbell chart in each panel, forest theme": {
    theme: "forest",
    title: "Osprey pairs at Alder Marsh rose from 4 to 11 between 2014 and 2024",
    subtitle: "Breeding pairs counted in four wetland reserves. The paler dot is 2014. The brighter dot is 2024. Panels are on their own scales",
    data: pairs,
    facet: "reserve",
    columns: 2,
    highlight: "Osprey",
    emphasis: "Alder Marsh",
    chart: { type: "dumbbell-chart", category: "species", from: "y2014", to: "y2024", names: { y2014: "2014", y2024: "2024" }, sort: "none", format: "integer", legend: false },
    source: "Reserve breeding surveys",
    note: "Illustrative data for fictional reserves",
  },
};
