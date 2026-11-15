"use client";

import type { ReactNode } from "react";
import { withMeta, renderSlot, type InsightSpec } from "insightcharts/core";
import { LegendKey, type LegendKeyItem } from "@/components/insightcharts/atoms/legend-key";
import { groupRows, type DataInput, type Row, type Transform } from "insightcharts/data";
import { dataState, fitColumns, MoleculeFooter, MoleculeHeader, Provide, useMolecule, useRows, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

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

export const SmallMultipleGrid = withMeta(SmallMultipleGridImpl, {
  name: "small-multiple-grid",
  component: "SmallMultipleGrid",
  title: "Small multiple grid",
  level: "molecule",
  category: "layout",
  description: "Repeats any chart spec once per value of a facet field, each panel with its own filtered rows and a title, in a grid that follows the container width.",
  whenToUse: "Faceting a chart form the `small-multiples` atom does not draw: stacked bars, scatter plots, donuts, waffles, dumbbells, histograms. Also when each panel should be a full chart with its own tooltip and axis.",
  avoid: "Line, area or bar facets that must share one value scale: use the `small-multiples` atom, which draws every panel in one chart on a common axis. Here each panel scales to its own rows unless the spec fixes the axis (for example `option: { xAxis: { max: 70 } }`), so say so in the subtitle or fix it. More than about twelve panels.",
  composes: ["legend-key", "bar-chart", "waffle-chart"],
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
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to every panel." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "small-multiple-grid",
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
