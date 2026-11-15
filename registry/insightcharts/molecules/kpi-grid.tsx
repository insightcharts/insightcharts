"use client";

import { type FormatSpec, withMeta } from "insightcharts/core";
import type { DataInput, Transform } from "insightcharts/data";
import { TrendCard } from "@/components/insightcharts/molecules/trend-card";
import { dataState, fitColumns, MoleculeFooter, MoleculeHeader, Provide, useMolecule, useRows, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface KpiMetric {
  /** Value field for this metric. */
  y: string;
  /** What it measures, sentence case. */
  label: string;
  format?: FormatSpec;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Overrides the grid's `compare`. */
  compare?: "first" | "previous" | number;
  /** Overrides the grid's `change`. */
  change?: "percent" | "absolute";
  /** Format for this metric's absolute change, e.g. `"{value} pp"`. Overrides the grid's `deltaFormat`. */
  deltaFormat?: FormatSpec;
  deltaLabel?: string;
  context?: string;
  /** Override the computed figure. */
  value?: number | string;
  /** Override the computed change. */
  delta?: number | string;
  kind?: "line" | "bar";
}

export interface KpiGridProps extends MoleculeProps {
  /** One dataset in time order, one row per period, one column per metric. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Period field shared by every metric. */
  x?: string;
  /** One card per metric. */
  metrics: KpiMetric[];
  /** Baseline for every card's change. */
  compare?: "first" | "previous" | number;
  change?: "percent" | "absolute";
  /** Format for absolute changes. Default: percentage points for percentage metrics, otherwise each metric's own format. */
  deltaFormat?: FormatSpec;
  /** Preferred columns. Default: up to four, fewer when the container is narrow. */
  columns?: number;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * A grid of trend cards that share one dataset: load the series once, name the columns,
 * and every card derives its figure, change and sparkline from the same rows.
 */
function KpiGridImpl({ data, transform, x, metrics, compare = "first", change = "percent", deltaFormat, columns, title, subtitle, source, note, className, style, ...rest }: KpiGridProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const state = useRows(data, transform);
  const list = metrics ?? [];
  const n = list.length;
  const cols = fitColumns(width, n, columns ?? (n <= 4 ? n : n <= 6 ? 3 : 4), 200, 12);
  const placeholder = dataState(state, 132);
  return (
    <div ref={ref} data-slot="ic-kpi-grid" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        {placeholder ?? (
          <div data-slot="ic-kpi-grid-items" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 12 }}>
            {list.map((m) => (
              <div key={m.y + m.label} role="listitem" data-slot="ic-kpi-grid-item" style={{ minWidth: 0, display: "grid" }}>
                <TrendCard data={state.rows} x={x} compare={compare} change={change} deltaFormat={deltaFormat} {...m} />
              </div>
            ))}
          </div>
        )}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const month = (i: number) => new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10);
const saas = [
  [38.1, 412, 4.2, 4.1],
  [39.4, 428, 4.0, 3.9],
  [39.0, 431, 3.9, 3.8],
  [40.8, 455, 3.6, 3.2],
  [42.2, 470, 3.1, 3.4],
  [41.9, 476, 2.9, 2.9],
  [43.5, 498, 2.6, 2.7],
  [44.1, 511, 2.4, 2.6],
  [44.5, 524, 2.3, 2.4],
  [46.0, 548, 2.2, 2.3],
  [47.2, 566, 2.1, 2.2],
  [48.2, 589, 2.1, 2.2],
].map(([users, mrr, churn, response], i) => ({ month: month(i), users: users * 1000, mrr: mrr * 1000, churn, response }));

export const KpiGrid = withMeta(KpiGridImpl, {
  name: "kpi-grid",
  component: "KpiGrid",
  title: "KPI grid",
  level: "molecule",
  category: "layout",
  description: "A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a sparkline.",
  whenToUse: "The top of a dashboard or a monthly report: three to eight metrics tracked over the same periods. Pass one table with a column per metric.",
  avoid: "Figures without a series behind them (use `stat-row`); comparing the metrics with each other on one scale (use `line-chart` or `small-multiples`); more than eight cards.",
  composes: ["trend-card"],
  props: [
    { name: "data", type: "DataInput", description: "One dataset in time order: a row per period, a column per metric. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied once, before the cards read the rows." },
    { name: "x", type: "string", description: "Period field shared by every metric." },
    { name: "metrics", type: "{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind? }[]", required: true, description: "One card per metric; each takes the props of `trend-card`." },
    { name: "compare", type: '"first" | "previous" | number', default: '"first"', description: "Baseline for every card's change; a metric can override it." },
    { name: "change", type: '"percent" | "absolute"', default: '"percent"', description: "Relative change, or the difference between the two values; a metric can override it. An absolute change of a percentage metric is shown in percentage points (\"−2.1 pts\")." },
    { name: "deltaFormat", type: "FormatSpec", description: 'Format for absolute changes, e.g. `"{value} pp"` or `"signed"`; a metric can override it. Default: points for percentage formats, otherwise the metric\'s own `format`.' },
    { name: "columns", type: "number", description: "Preferred columns. Default: up to four, reduced to fit cards of at least 200px." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Population and period." },
    { name: "source", type: "string", description: 'Shown under the grid as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to every card." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "kpi-grid",
    title: "Monthly active users rose from 38,100 to 48,200 in 2024",
    subtitle: "Four product metrics by month, 2024. Change is measured against January.",
    data: saas,
    x: "month",
    metrics: [
      { y: "users", label: "Monthly active users", format: "compact" },
      { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
      { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false },
      { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
    ],
    source: "Internal analytics",
    note: "Illustrative data",
  },
});
