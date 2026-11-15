# Link charts so a click on one filters the others

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: Two or more charts share one dataset inside InsightData, and clicking a mark in a selectable chart filters the other charts.

Build a set of charts that filter each other from one dataset. If the user has not said which data to use and which fields readers should filter by, ask.

## How it works

1. `InsightData` resolves `data` (any shape a chart accepts) once and can apply a `transform` to all of it.
2. A chart inside with no `data` prop receives the shared rows, filtered by every active selection except its own. A selectable chart therefore keeps all of its marks when one is clicked.
3. The chart's own `transform` runs after the filter, so each chart can aggregate the same rows a different way.
4. Clicking a mark toggles its value in that chart's selection. Several values can be selected. Clicking the empty plot area clears that chart's selection. Selected marks stay solid and the rest fade.

## Steps

1. Put the data in long format: one row per observation, with one column for each field to filter by.
2. Wrap the charts in `InsightData` and pass the data there. Remove `data` from the charts inside.
3. Add `select` and a stable `id` to each chart readers click.
4. Give each chart a `transform` that aggregates the shared rows for its own view.
5. Lay the charts out with CSS grid. Use `minmax(0, 1fr)` columns so charts can shrink.
6. Add a reset control with `useInsightData().clear()` if the user wants one.

For a ready-made layout use the `linked-charts` molecule or the `data-explorer` template: `https://insightcharts.dev/agents/molecules/linked-charts.md`, `https://insightcharts.dev/agents/templates/data-explorer.md`.

## API

`InsightData` props:

| Prop | Purpose |
|---|---|
| `data` (required) | Shared data for every chart inside that does not pass its own `data`. |
| `transform` | Applied to the shared rows once. |
| `selections` | Controlled selections, keyed by chart id. |
| `onSelectionsChange` | Called with the new selections. |

Chart props:

| Prop | Purpose |
|---|---|
| `select` | `true` selects on the chart's own category field (`x` on a bar chart, `series` on a line chart). A string selects on that field. |
| `id` | Stable key for this chart's selection in the store. |
| `onSelect` | `(values, field) => void`, called when the chart's selection changes. |
| `group` | Charts with the same `group` id share tooltips and axis pointers. It links hover only and does not filter. |

`select` also works on a chart outside `InsightData`. The selection is then local: the chart fades unselected marks and reports through `onSelect`.

`useInsightData()` returns the store of the nearest `InsightData`, or `null` outside one:

| Member | Purpose |
|---|---|
| `rows`, `all` | Every loaded row, unfiltered. |
| `status`, `error` | `"loading"`, `"ready"` or `"error"`, and the error. |
| `selections` | Active selections by chart id: `{ field, values?, range? }`. |
| `select(owner, selection)` | Set one owner's selection, or clear it with `null`. |
| `clear()` | Clear every selection. |
| `rowsFor(owner?)` | Rows filtered by every selection except `owner`'s. |

A selection is a list of `values` (strings) or a `range` of `[min, max]`, matched inclusively. Charts make value selections. Set a range from your own control: `store?.select("date-range", { field: "year", range: [2022, 2024] })`.

## Minimal example

```tsx
"use client";
import { BarChart, InsightData, useInsightData } from "insightcharts";

const sum = { twh: { op: "sum", field: "twh" } } as const;

function Reset() {
  const store = useInsightData();
  return <button onClick={() => store?.clear()}>Reset filters</button>;
}

export function EnergyExplorer() {
  return (
    <InsightData data="/data/energy.csv">
      <Reset />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }}>
        <BarChart id="by-region" select x="region" y="twh" transform={{ type: "aggregate", groupBy: "region", measures: sum }} title="Generation by region, TWh" />
        <BarChart id="by-source" select x="source" y="twh" transform={{ type: "aggregate", groupBy: "source", measures: sum }} title="Generation by source, TWh" />
      </div>
    </InsightData>
  );
}
```

The rows have the columns `year`, `region`, `source` and `twh`. `"use client"` is needed here because `Reset` uses a hook and an event handler. Charts with only serialisable props do not need it.

To keep selections in the URL or in your own state, control them: `<InsightData data={...} selections={selections} onSelectionsChange={setSelections}>`.

## Verify

1. The network tab shows one request for the data.
2. Click a bar in the first chart. The second chart redraws with filtered values, and the first chart keeps all of its bars with the unselected ones faded.
3. Click a second bar. Both values are selected. Click the empty plot area. The selection clears.
4. The reset control clears every selection.
5. At about 380px wide the charts stack or shrink without clipping.

## Common mistakes

- Leaving `data` on a chart inside `InsightData`. That chart ignores the shared rows and the selections.
- Aggregating in the `transform` of `InsightData`. The filter fields are gone before the charts can filter on them. Aggregate in each chart.
- Leaving out `id` on selectable charts when you read or control `selections`.
- Using `group` and expecting it to filter. It links tooltips only.
- Relying on click selection alone. It is pointer-only, so offer the same filters as buttons or a select when filtering matters.
- Wide data with one column per category. Fold it to long format first with a `"fold"` transform.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/crossfiltering.md
- This page: https://insightcharts.dev/docs/crossfiltering
- These instructions as plain text: https://insightcharts.dev/agents/docs/crossfiltering.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
