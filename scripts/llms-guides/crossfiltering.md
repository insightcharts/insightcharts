---
title: Crossfiltering with InsightData
description: Share one dataset between charts and let a click on one filter the others.
order: 5
---
`InsightData` loads data once and shares it. Charts inside it that do not pass their own `data` read the shared rows, and any chart with `select` filters all the others when the reader clicks a mark.

```tsx
"use client";
import { BarChart, InsightData, LineChart } from "insightcharts";

export function Sales({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <InsightData data={rows}>
      <BarChart
        id="by-region"
        select
        transform={{ type: "aggregate", groupBy: "region", measures: { revenue: { op: "sum", field: "revenue" } } }}
        x="region"
        y="revenue"
        title="Revenue by region"
      />
      <LineChart
        transform={{ type: "aggregate", groupBy: "month", measures: { revenue: { op: "sum", field: "revenue" } } }}
        x="month"
        y="revenue"
        title="Revenue by month"
        subtitle="Click a region above to filter"
      />
    </InsightData>
  );
}
```

## How it behaves

- `select` makes marks clickable. `select={true}` uses the chart's own category field (for `bar-chart` that is `x`; for `line-chart` it is `series`). `select="field"` names the field explicitly.
- A click toggles that value in the chart's selection; several values can be selected. A click on empty plot area clears it.
- A selection filters every other chart, never the chart that made it. The selecting chart keeps its full domain and fades the unselected marks.
- Each chart's own `transform` runs after the shared filter, so charts can aggregate the filtered rows differently.
- A chart that passes its own `data` inside `InsightData` is not filtered, but its selection still filters the others.
- Without an `InsightData` ancestor, `select` still works locally: the chart fades unselected marks and calls `onSelect`.

## Props

`InsightData`:

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Shared data, any accepted shape. |
| `transform` | `Transform \| Transform[]` | Applied once to the shared rows, before filtering. |
| `selections` | `Record<string, Selection>` | Controlled selections, keyed by chart id. |
| `onSelectionsChange` | `(selections) => void` | Called on every change. |

On charts: `select`, `onSelect(values, field)`, and `id` (a stable key for the chart's selection; set it when you control or persist selections, otherwise a generated id is used).

A `Selection` is `{ field, values?: string[], range?: [min, max] }`. Clicks produce `values`; `range` can be set programmatically and filters with an inclusive between.

## Reading or driving the store

```tsx
import { useInsightData } from "insightcharts";

function ClearFilters() {
  const store = useInsightData(); // null outside <InsightData>
  if (!store || Object.keys(store.selections).length === 0) return null;
  return <button onClick={() => store.clear()}>Clear filters</button>;
}
```

The store exposes `all` (unfiltered rows), `rows`, `status`, `error`, `selections`, `select(owner, selection | null)`, `clear()` and `rowsFor(owner?)` (rows filtered by every selection except `owner`'s).

## Linked tooltips

Separately from filtering, charts that share a `group` id link their tooltips and axis pointers: `group="sales"` on each.

## Design notes

- Tell the reader the charts are linked, with a subtitle such as "Click a bar to filter".
- The charts must show their main fact before the reader clicks anything.
