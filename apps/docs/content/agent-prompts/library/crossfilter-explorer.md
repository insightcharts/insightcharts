---
title: Build a cross-filtered explorer
description: Draws two to four charts over one dataset so that a click on one chart filters the others.
order: 5
---

Fill in these lines, then follow the steps.

```text
Data: <path or URL of one row-level table, or paste it here>
Dimensions to filter by: <two to four columns, for example region, product, month>
Measure: <the column to sum or count>
Main finding: <one sentence, or leave blank and propose one from the data>
Source of the data: <name of the source>
Where to put it: <the route or component file, or leave blank and ask>
```

## Before you start

{{DETECT}}

## Steps

1. Check the project and install the package as described under "Before you start".
2. Check the data is one row-level table. Charts over unrelated tables cannot filter each other. If the user has several tables, ask which one to use.
3. Choose the component.
   - A whole page with a headline, figures that recompute and a detail table: the `data-explorer` template. Fetch `{{SITE_URL}}/agents/templates/data-explorer.md`.
   - A group of linked charts inside an existing page: the `linked-charts` molecule. Fetch `{{SITE_URL}}/agents/molecules/linked-charts.md`.
   - Your own layout in JSX: `InsightData` from `insightcharts` around the charts.
4. Pass the table once, as `data` on the template, the molecule or `InsightData`.
5. Write two to four charts, one per dimension. For each chart:
   - leave `data` out, so it reads the shared rows
   - set a stable `id`
   - set `select: true` to select on the chart's own category field, or `select: "<field>"` to name the field
   - give it its own aggregating `transform`, for example `{ type: "aggregate", groupBy: "region", measures: { total: { op: "sum", field: "amount" } } }`
   - use a plain form: `bar-chart` for categories, `donut-chart` for up to five parts, a vertical `bar-chart` for periods
6. A chart receives the rows filtered by every selection except its own, so its own bars stay visible when the reader clicks one.
7. For `data-explorer`, set `title` to the finding of the starting view, `initialSelections` keyed by chart `id` so the page opens on that view, `figures` for the numbers that recompute, and `instructions` for one sentence saying what can be clicked.
8. For `linked-charts`, set `title`, `subtitle`, `labels` for the field names in the filter chips, and `count: true` to show the filtered row count.
9. Set `source` or `sources`.
10. In Next.js, a spec with no function props renders from a server component through `Insight`. `InsightData` with JSX children that take callbacks needs a `"use client"` file.

## Example of the result

```tsx
import { BarChart, InsightData } from "insightcharts";

const sum = (field: string) => ({ type: "aggregate" as const, groupBy: field, measures: { twh: { op: "sum" as const, field: "twh" } } });

export function EnergyExplorer() {
  return (
    <InsightData data="/data/energy.csv">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }}>
        <BarChart id="by-region" x="region" y="twh" select transform={sum("region")} format="compact" title="Generation by region, TWh" />
        <BarChart id="by-source" x="source" y="twh" select transform={sum("source")} format="compact" title="Generation by source, TWh" />
      </div>
    </InsightData>
  );
}
```

## Verify

- The typecheck passes.
- A click on a bar in one chart changes the other charts. A second click on the same bar clears it.
- The clicked chart keeps all of its bars.
- Every chart has an `id` and `select`, and none passes its own `data`.
- The charts stack in one column at about 380 pixels wide.
- Click selection is pointer-only. Tell the user if filtering must also work from the keyboard, and offer buttons that drive the store through `useInsightData()`.
