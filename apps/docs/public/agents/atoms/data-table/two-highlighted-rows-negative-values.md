# Reproduce the "Two highlighted rows, negative values" example of the InsightCharts Data table

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Two highlighted rows, negative values" example of `data-table` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

- `rows` (`Row[]`): One object per row. Example: 5 items: an object with `region`, `revenue`, `growth`.

## 5. The "Two highlighted rows, negative values" example

This example sets `theme="forest"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { DataTable } from "insightcharts";

<DataTable
  theme="forest"
  caption="Revenue grew in 2 of 5 regions in the fourth quarter"
  highlight={["North", "Islands"]}
  columns={[
    { key: "region", label: "Region" },
    { key: "revenue", label: "Revenue", format: "currency:EUR" },
    {
      key: "growth",
      label: "Quarterly growth",
      format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 },
      bar: true,
      width: "40%",
    },
  ]}
  rows={[
    { region: "North", revenue: 4820000, growth: 0.064 },
    { region: "South", revenue: 3950000, growth: -0.021 },
    { region: "East", revenue: 2210000, growth: -0.048 },
    { region: "West", revenue: 5130000, growth: -0.007 },
    { region: "Islands", revenue: 640000, growth: 0.112 },
  ]}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "forest",
  "caption": "Revenue grew in 2 of 5 regions in the fourth quarter",
  "highlight": ["North", "Islands"],
  "columns": [
    { "key": "region", "label": "Region" },
    { "key": "revenue", "label": "Revenue", "format": "currency:EUR" },
    {
      "key": "growth",
      "label": "Quarterly growth",
      "format": { "style": "percent", "signDisplay": "exceptZero", "maximumFractionDigits": 1 },
      "bar": true,
      "width": "40%"
    }
  ],
  "rows": [
    { "region": "North", "revenue": 4820000, "growth": 0.064 },
    { "region": "South", "revenue": 3950000, "growth": -0.021 },
    { "region": "East", "revenue": 2210000, "growth": -0.048 },
    { "region": "West", "revenue": 5130000, "growth": -0.007 },
    { "region": "Islands", "revenue": 640000, "growth": 0.112 }
  ],
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
- This page: https://insightcharts.dev/atoms/data-table#example-two-highlighted-rows-negative-values
- These instructions as plain text: https://insightcharts.dev/agents/atoms/data-table/two-highlighted-rows-negative-values.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
