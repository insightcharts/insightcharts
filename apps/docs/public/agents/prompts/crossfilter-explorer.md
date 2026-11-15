# Build a cross-filtered explorer

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

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

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Check the data is one row-level table. Charts over unrelated tables cannot filter each other. If the user has several tables, ask which one to use.
3. Choose the component.
   - A whole page with a headline, figures that recompute and a detail table: the `data-explorer` template. Fetch `https://insightcharts.dev/agents/templates/data-explorer.md`.
   - A group of linked charts inside an existing page: the `linked-charts` molecule. Fetch `https://insightcharts.dev/agents/molecules/linked-charts.md`.
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

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/crossfilter-explorer.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
