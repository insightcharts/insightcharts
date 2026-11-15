# Reproduce the "Scrolling, sticky header, compact" example of the InsightCharts Data table

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Scrolling, sticky header, compact" example of `data-table` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A restrained editorial table from rows and a column config: aligned tabular numbers, an optional in-cell bar, row highlight and click-to-sort headers.

Use it when: When readers need to look up exact values, or compare a handful of entities across several measures with different units. Sort it by the column the caption refers to and highlight the row it names.

Pick something else when: Showing a trend or a single comparison (use `line-chart` or `bar-chart`); more than about 7 columns or 30 rows without `maxHeight`.

Instructions for the alternatives: `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/data-table
```

The file lands at `components/insightcharts/atoms/data-table.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { DataTable } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `rows` (`Row[]`): One object per row. Example: 12 items: an object with `city`, `population`, `startYear`, `score`, `cycling`.

## 5. The "Scrolling, sticky header, compact" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { DataTable } from "insightcharts";

<DataTable
  caption="Twelve cities with a low-traffic centre"
  subtitle="Population in millions, liveability score out of 100, share of trips by bike"
  density="compact"
  maxHeight={260}
  columns={[
    { key: "city", label: "City" },
    { key: "population", label: "Population, m", format: "decimal:2" },
    { key: "startYear", label: "Scheme began" },
    { key: "score", label: "Score", format: "decimal:1" },
    { key: "cycling", label: "Cycling share", format: "percent" },
  ]}
  rows={[
    { city: "Vienna", population: 1.98, startYear: 2015, score: 71.2, cycling: 0.31 },
    { city: "Copenhagen", population: 0.66, startYear: 2012, score: 78.5, cycling: 0.49 },
    { city: "Amsterdam", population: 0.93, startYear: 2014, score: 75.1, cycling: 0.38 },
    { city: "Zurich", population: 0.44, startYear: 2011, score: 80.3, cycling: 0.27 },
    { city: "Helsinki", population: 0.67, startYear: 2016, score: 69.8, cycling: 0.22 },
    { city: "Munich", population: 1.51, startYear: 2018, score: 66.4, cycling: 0.19 },
    { city: "Oslo", population: 0.72, startYear: 2010, score: 82.6, cycling: 0.41 },
    { city: "Stockholm", population: 0.98, startYear: 2013, score: 77, cycling: 0.35 },
    { city: "Lyon", population: 0.52, startYear: 2019, score: 61.3, cycling: null },
    { city: "Ghent", population: 0.27, startYear: 2017, score: 64.9, cycling: 0.3 },
    { city: "Bologna", population: 0.39, startYear: 2020, score: 58.7, cycling: 0.12 },
    { city: "Ljubljana", population: 0.3, startYear: 2009, score: 73.4, cycling: 0.16 },
  ]}
  source="Illustrative data for the gallery"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "caption": "Twelve cities with a low-traffic centre",
  "subtitle": "Population in millions, liveability score out of 100, share of trips by bike",
  "density": "compact",
  "maxHeight": 260,
  "columns": [
    { "key": "city", "label": "City" },
    { "key": "population", "label": "Population, m", "format": "decimal:2" },
    { "key": "startYear", "label": "Scheme began" },
    { "key": "score", "label": "Score", "format": "decimal:1" },
    { "key": "cycling", "label": "Cycling share", "format": "percent" }
  ],
  "rows": [
    { "city": "Vienna", "population": 1.98, "startYear": 2015, "score": 71.2, "cycling": 0.31 },
    { "city": "Copenhagen", "population": 0.66, "startYear": 2012, "score": 78.5, "cycling": 0.49 },
    { "city": "Amsterdam", "population": 0.93, "startYear": 2014, "score": 75.1, "cycling": 0.38 },
    { "city": "Zurich", "population": 0.44, "startYear": 2011, "score": 80.3, "cycling": 0.27 },
    { "city": "Helsinki", "population": 0.67, "startYear": 2016, "score": 69.8, "cycling": 0.22 },
    { "city": "Munich", "population": 1.51, "startYear": 2018, "score": 66.4, "cycling": 0.19 },
    { "city": "Oslo", "population": 0.72, "startYear": 2010, "score": 82.6, "cycling": 0.41 },
    { "city": "Stockholm", "population": 0.98, "startYear": 2013, "score": 77, "cycling": 0.35 },
    { "city": "Lyon", "population": 0.52, "startYear": 2019, "score": 61.3, "cycling": null },
    { "city": "Ghent", "population": 0.27, "startYear": 2017, "score": 64.9, "cycling": 0.3 },
    { "city": "Bologna", "population": 0.39, "startYear": 2020, "score": 58.7, "cycling": 0.12 },
    { "city": "Ljubljana", "population": 0.3, "startYear": 2009, "score": 73.4, "cycling": 0.16 }
  ],
  "source": "Illustrative data for the gallery",
  "type": "data-table"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` (required) | `Row[]` |  | One object per row. |
| `columns` | `(string \| { key, label?, format?, align?, bar?, sortable?, width? })[]` |  | Columns in order. Defaults to every key of the first row. Numeric columns are right-aligned. |
| `caption` | `string` |  | The table's title, as a real `<caption>`. |
| `subtitle` | `string` |  | Units and period, under the caption. |
| `source` | `string` |  | Shown under the table as "Source: ...". |
| `highlight` | `string \| number \| (string \| number)[]` |  | Rows to emphasise, matched on the first column (or `highlightKey`). |
| `highlightKey` | `string` |  | Field `highlight` matches against. |
| `sort` | `{ key, direction?: "asc" \| "desc" }` |  | Initial sort. |
| `sortable` | `boolean` | `true` | Click or press Enter on a header to sort; a third press restores the original order. |
| `maxHeight` | `number \| string` |  | Height before the body scrolls under the sticky header. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding. |
| `frame` | `boolean` |  | Paint a named theme's background behind the table, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `data-explorer` (template)

## Rules for this form

- Give every number its unit and its period in the label.
- A single number needs a comparison, a denominator or a period beside it.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/data-table.md
- Component reference with every example: https://insightcharts.dev/llms/data-table.md
- Registry item: https://insightcharts.dev/r/data-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/data-table.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/data-table#example-scrolling-sticky-header-compact
- These instructions as plain text: https://insightcharts.dev/agents/atoms/data-table/scrolling-sticky-header-compact.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
