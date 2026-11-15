# Build a Data table with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Data table (`data-table`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

- `rows` (`Row[]`): One object per row. Example: 7 items: an object with `country`, `share`, `twh`, `change`.

## 5. Working example

```tsx
import { DataTable } from "insightcharts";

<DataTable
  theme="editorial"
  caption="Wind and solar supplied 67% of Denmark's electricity in 2024"
  subtitle="Electricity generation by country, 2024"
  source="Ember (illustrative figures)"
  highlight="Denmark"
  sort={{ key: "share", direction: "desc" }}
  columns={[
    { key: "country", label: "Country" },
    { key: "share", label: "Wind and solar share", format: "percent", bar: true, width: "38%" },
    { key: "twh", label: "Generation, TWh", format: "decimal:1" },
    {
      key: "change",
      label: "Change vs 2023",
      format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 },
    },
  ]}
  rows={[
    { country: "Germany", share: 0.43, twh: 209.4, change: 0.031 },
    { country: "Spain", share: 0.42, twh: 112.8, change: 0.044 },
    { country: "Denmark", share: 0.67, twh: 23.1, change: 0.012 },
    { country: "Netherlands", share: 0.41, twh: 49.6, change: 0.058 },
    { country: "Portugal", share: 0.46, twh: 22.9, change: 0.027 },
    { country: "France", share: 0.14, twh: 73.5, change: 0.009 },
    { country: "Poland", share: 0.24, twh: 40.2, change: -0.004 },
  ]}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "data-table",
  "theme": "editorial",
  "caption": "Wind and solar supplied 67% of Denmark's electricity in 2024",
  "subtitle": "Electricity generation by country, 2024",
  "source": "Ember (illustrative figures)",
  "highlight": "Denmark",
  "sort": { "key": "share", "direction": "desc" },
  "columns": [
    { "key": "country", "label": "Country" },
    {
      "key": "share",
      "label": "Wind and solar share",
      "format": "percent",
      "bar": true,
      "width": "38%"
    },
    { "key": "twh", "label": "Generation, TWh", "format": "decimal:1" },
    {
      "key": "change",
      "label": "Change vs 2023",
      "format": { "style": "percent", "signDisplay": "exceptZero", "maximumFractionDigits": 1 }
    }
  ],
  "rows": [
    { "country": "Germany", "share": 0.43, "twh": 209.4, "change": 0.031 },
    { "country": "Spain", "share": 0.42, "twh": 112.8, "change": 0.044 },
    { "country": "Denmark", "share": 0.67, "twh": 23.1, "change": 0.012 },
    { "country": "Netherlands", "share": 0.41, "twh": 49.6, "change": 0.058 },
    { "country": "Portugal", "share": 0.46, "twh": 22.9, "change": 0.027 },
    { "country": "France", "share": 0.14, "twh": 73.5, "change": 0.009 },
    { "country": "Poland", "share": 0.24, "twh": 40.2, "change": -0.004 }
  ]
}
```

This example sets `theme="editorial"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

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

- Component reference with every example: https://insightcharts.dev/llms/data-table.md
- Registry item: https://insightcharts.dev/r/data-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/data-table.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/data-table
- These instructions as plain text: https://insightcharts.dev/agents/atoms/data-table.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
