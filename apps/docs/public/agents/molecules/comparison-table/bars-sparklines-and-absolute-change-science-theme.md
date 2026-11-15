# Reproduce the "Bars, sparklines and absolute change, science theme" example of the InsightCharts Comparison table

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Bars, sparklines and absolute change, science theme" example of `comparison-table` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A table whose rows carry inline sparklines, deltas and in-cell bars beside their exact values, from rows and a column config.

Use it when: Comparing five to twenty entities on a level, a trend and a change at once: countries, products, teams. Readers look up their row. The sparkline and delta show how the value changed.

Pick something else when: Plain lookups with no series (use `data-table`); one measure ranked (use `ranked-list` or `bar-chart`); trends the reader must compare precisely (use `small-multiples`). Each sparkline has its own scale, so it shows the direction of change and cannot be used to compare levels between rows.

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `ranked-list` https://insightcharts.dev/agents/molecules/ranked-list.md, `data-table` https://insightcharts.dev/agents/atoms/data-table.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/comparison-table
```

The file lands at `components/insightcharts/molecules/comparison-table.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ComparisonTable } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  {
    "2019": 0.62,
    "2020": 0.71,
    "2021": 0.68,
    "2022": 0.74,
    "2023": 1.12,
    "2024": 1.21,
    "basin": "North Atlantic",
    "anomaly": 1.21,
    "area": 41
  },
  {
    "2019": 0.58,
    "2020": 0.66,
    "2021": 0.63,
    "2022": 0.72,
    "2023": 0.89,
    "2024": 0.94,
    "basin": "North Pacific",
    "anomaly": 0.94,
    "area": 77
  },
  {
    "2019": 0.49,
    "2020": 0.52,
    "2021": 0.47,
    "2022": 0.5,
    "2023": 0.71,
    "2024": 0.83,
    "basin": "Indian",
    "anomaly": 0.83,
    "area": 71
  }
]
```

## 5. The "Bars, sparklines and absolute change, science theme" example

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  {
    "2019": 0.62,
    "2020": 0.71,
    "2021": 0.68,
    "2022": 0.74,
    "2023": 1.12,
    "2024": 1.21,
    basin: "North Atlantic",
    anomaly: 1.21,
    area: 41,
  },
  {
    "2019": 0.58,
    "2020": 0.66,
    "2021": 0.63,
    "2022": 0.72,
    "2023": 0.89,
    "2024": 0.94,
    basin: "North Pacific",
    anomaly: 0.94,
    area: 77,
  },
  {
    "2019": 0.49,
    "2020": 0.52,
    "2021": 0.47,
    "2022": 0.5,
    "2023": 0.71,
    "2024": 0.83,
    basin: "Indian",
    anomaly: 0.83,
    area: 71,
  },
  {
    "2019": 0.31,
    "2020": 0.36,
    "2021": 0.34,
    "2022": 0.38,
    "2023": 0.55,
    "2024": 0.61,
    basin: "South Atlantic",
    anomaly: 0.61,
    area: 40,
  },
  {
    "2019": 0.28,
    "2020": 0.3,
    "2021": 0.25,
    "2022": 0.27,
    "2023": 0.52,
    "2024": 0.56,
    basin: "South Pacific",
    anomaly: 0.56,
    area: 85,
  },
  {
    "2019": 0.05,
    "2020": 0.08,
    "2021": 0.02,
    "2022": 0.06,
    "2023": 0.14,
    "2024": 0.11,
    basin: "Southern",
    anomaly: 0.11,
    area: 22,
  },
];

<ComparisonTable
  theme="science"
  title="The North Atlantic surface was 1.21°C above its 1991 to 2020 average in 2024"
  subtitle="Annual mean sea surface temperature anomaly by ocean basin, °C, 2019 to 2024"
  data={data}
  columns={[
    { key: "basin", label: "Basin" },
    { key: "area", label: "Area, million km²", kind: "bar", format: "integer", hideBelow: 560 },
    { key: "anomaly", label: "Anomaly, 2024", format: "{value}°C" },
    {
      key: "trend",
      label: "2019 to 2024",
      kind: "sparkline",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      format: "{value}°C",
    },
    {
      key: "change",
      label: "Change",
      kind: "delta",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      change: "absolute",
      format: "{value}°C",
      upIsGood: false,
    },
  ]}
  sort={{ key: "anomaly" }}
  highlight="North Atlantic"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "science",
  "title": "The North Atlantic surface was 1.21°C above its 1991 to 2020 average in 2024",
  "subtitle": "Annual mean sea surface temperature anomaly by ocean basin, °C, 2019 to 2024",
  "data": [
    {
      "2019": 0.62,
      "2020": 0.71,
      "2021": 0.68,
      "2022": 0.74,
      "2023": 1.12,
      "2024": 1.21,
      "basin": "North Atlantic",
      "anomaly": 1.21,
      "area": 41
    },
    {
      "2019": 0.58,
      "2020": 0.66,
      "2021": 0.63,
      "2022": 0.72,
      "2023": 0.89,
      "2024": 0.94,
      "basin": "North Pacific",
      "anomaly": 0.94,
      "area": 77
    },
    {
      "2019": 0.49,
      "2020": 0.52,
      "2021": 0.47,
      "2022": 0.5,
      "2023": 0.71,
      "2024": 0.83,
      "basin": "Indian",
      "anomaly": 0.83,
      "area": 71
    },
    {
      "2019": 0.31,
      "2020": 0.36,
      "2021": 0.34,
      "2022": 0.38,
      "2023": 0.55,
      "2024": 0.61,
      "basin": "South Atlantic",
      "anomaly": 0.61,
      "area": 40
    },
    {
      "2019": 0.28,
      "2020": 0.3,
      "2021": 0.25,
      "2022": 0.27,
      "2023": 0.52,
      "2024": 0.56,
      "basin": "South Pacific",
      "anomaly": 0.56,
      "area": 85
    },
    {
      "2019": 0.05,
      "2020": 0.08,
      "2021": 0.02,
      "2022": 0.06,
      "2023": 0.14,
      "2024": 0.11,
      "basin": "Southern",
      "anomaly": 0.11,
      "area": 22
    }
  ],
  "columns": [
    { "key": "basin", "label": "Basin" },
    {
      "key": "area",
      "label": "Area, million km²",
      "kind": "bar",
      "format": "integer",
      "hideBelow": 560
    },
    { "key": "anomaly", "label": "Anomaly, 2024", "format": "{value}°C" },
    {
      "key": "trend",
      "label": "2019 to 2024",
      "kind": "sparkline",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "format": "{value}°C"
    },
    {
      "key": "change",
      "label": "Change",
      "kind": "delta",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "change": "absolute",
      "format": "{value}°C",
      "upIsGood": false
    }
  ],
  "sort": { "key": "anomaly" },
  "highlight": "North Atlantic",
  "note": "Illustrative data",
  "type": "comparison-table"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `columns` (required), `(string | { key, label?, kind?, fields?, agg?, change?, format?, upIsGood?, mark?, align?, width?, hideBelow?, sortable? })[]`: Columns in order; the first is the row header. `kind` is `text`, `number`, `sparkline`, `delta` or `bar`. For wide data give a sparkline or computed delta its series with `fields`; for long data they use the group's rows. In the example: 5 items: an object with `key`, `label`; an object with `key`, `label`, `kind`, `format`, `hideBelow`; an object with `key`, `label`, `format`; ....
- `sort`, `{ key, direction?: "asc" | "desc" }`: Order rows by a column's value. Default direction: descending. With `sortable` this is the opening order. In the example: an object with `key`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | Wide data: one row per entity. Long data: one row per entity and period, with `groupBy`. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before rows are grouped. |
| `columns` (required) | `(string \| { key, label?, kind?, fields?, agg?, change?, format?, upIsGood?, mark?, align?, width?, hideBelow?, sortable? })[]` |  | Columns in order; the first is the row header. `kind` is `text`, `number`, `sparkline`, `delta` or `bar`. For wide data give a sparkline or computed delta its series with `fields`; for long data they use the group's rows. |
| `groupBy` | `string` |  | Long data: the entity field. Rows sharing a value become one table row, in data order. |
| `highlight` | `string \| string[]` |  | Entities to emphasise, matched on the first column. |
| `sort` | `{ key, direction?: "asc" \| "desc" }` |  | Order rows by a column's value. Default direction: descending. With `sortable` this is the opening order. |
| `sortable` | `boolean` | `true` | Click or press Enter on a column header to sort by it (numbers largest first, text A to Z); a second press reverses and a third restores the original order. Sparkline columns do not sort; set `sortable: false` on a column to exclude it. |
| `limit` | `number` |  | Show only the first N rows. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding. |
| `title` | `string` |  | The main fact with its number, or a plain label. Set as the table's `<caption>`. |
| `subtitle` | `string` |  | Units and period. |
| `source` | `string` |  | Shown under the table as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the sparklines and deltas. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `sparkline` (atom), `delta` (atom)
- Used by: `scorecard` (template)

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/comparison-table.md
- Component reference with every example: https://insightcharts.dev/llms/comparison-table.md
- Registry item: https://insightcharts.dev/r/comparison-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/comparison-table.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/comparison-table#example-bars-sparklines-and-absolute-change-science-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/comparison-table/bars-sparklines-and-absolute-change-science-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
