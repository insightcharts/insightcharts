# Draw one chart from a CSV file

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Data: <path or URL of the CSV file, or paste the CSV text here>
Fact to show: <one sentence, or leave blank and propose one from the data>
Where to put it: <the page or component file, or leave blank and ask>
Source of the data: <name of the source>
```

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Read the CSV. List the columns, their units, the period covered and the number of rows. If a column you need is missing, stop and tell the user.
3. Decide the fact. If "Fact to show" is blank, compute two or three candidate facts from the rows, each with its number and period, and ask the user to pick one.
4. Choose the form from the job of the data.
   - A ranking or a comparison of categories: `bar-chart`.
   - A change over time with five or more points: `line-chart`.
   - Two time points for several entities: `slope-chart`.
   - One share of a whole: `waffle-chart`.
   - A relationship between two measures: `scatter-chart`.
   - One number: `big-number`.
   For any other job, read `https://insightcharts.dev/agents/atoms.md` and choose from its decision table.
5. Fetch the instructions for the chosen component at `https://insightcharts.dev/agents/atoms/<name>.md` and use only the props it lists.
6. Load the data. Use one of these.
   - A file the browser can fetch: put it in the project's public folder and pass its URL, `data="/data/file.csv"`.
   - Next.js server component: `const rows = await loadData(url)` with `loadData` from `insightcharts/data`, then `data={rows}`.
   - A small file: paste the CSV text as a string into `data`.
7. Reshape with `transform` when the rows are not ready to draw. Use `filter` to keep a subset, `aggregate` with `groupBy` and `measures` to sum by category, `sort` to order, `top` with `n`, `by`, `other` and `label` to keep the largest and fold the rest into one row, and `parse` to coerce text columns to numbers or dates.
8. Name the fields as strings: `x`, `y`, and `series` for long data. For wide data pass several columns as `y`.
9. Set `format` so values print with their unit: `"compact"`, `"percent"` for ratios, `"percent-raw"` for whole percentages, `"currency:USD"`, or a template such as `"{value} kg"`.
10. Write the text.
    - `title`: the fact, in one clause, with its number and period. No metaphor, no dramatic verb, no second half after a comma or a dash.
    - `subtitle`: the measure, the unit, the population and the period.
    - `source`: the source named above.
11. Set `highlight` to the entity the title names. Do not set a colour per series.
12. Add at most three `annotations` when a date, a threshold or one value needs a mark.
13. Render the chart where the user asked. In Next.js add `"use client"` to the file only when the chart takes a function prop.

## Example of the result

```tsx
import { BarChart } from "insightcharts";

export function GenerationBySource() {
  return (
    <BarChart
      data="/data/energy.csv"
      transform={[
        { type: "filter", field: "year", value: 2024 },
        { type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } },
        { type: "sort", by: "twh", order: "desc" },
      ]}
      x="source"
      y="twh"
      format="compact"
      highlight="Hydro"
      title="Hydro generated 3,900 TWh in 2024"
      subtitle="Renewable electricity generation by source, TWh, 2024"
      source="Ember"
    />
  );
}
```

## Verify

- The typecheck passes.
- The chart renders with no console error and no "No data to show." message.
- The number in the title matches the rows.
- No label is clipped or overlapping at desktop width and at about 380 pixels wide.
- The chart is legible in dark mode.
- `source` is set.

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/single-chart-from-csv.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
