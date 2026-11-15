# Build a Comparison table with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Comparison table (`comparison-table`, a molecule) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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
    "2019": 40.1,
    "2020": 44.2,
    "2021": 40.9,
    "2022": 44.5,
    "2023": 52.6,
    "2024": 58.9,
    "country": "Germany",
    "share": 58.9,
    "twh": 498
  },
  {
    "2019": 37.5,
    "2020": 44.1,
    "2021": 46.7,
    "2022": 42.2,
    "2023": 50.3,
    "2024": 56.8,
    "country": "Spain",
    "share": 56.8,
    "twh": 264
  },
  {
    "2019": 18.2,
    "2020": 26.1,
    "2021": 33,
    "2022": 40.1,
    "2023": 47.7,
    "2024": 52.4,
    "country": "Netherlands",
    "share": 52.4,
    "twh": 121
  }
]
```

## 5. Working example

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  {
    "2019": 40.1,
    "2020": 44.2,
    "2021": 40.9,
    "2022": 44.5,
    "2023": 52.6,
    "2024": 58.9,
    country: "Germany",
    share: 58.9,
    twh: 498,
  },
  {
    "2019": 37.5,
    "2020": 44.1,
    "2021": 46.7,
    "2022": 42.2,
    "2023": 50.3,
    "2024": 56.8,
    country: "Spain",
    share: 56.8,
    twh: 264,
  },
  {
    "2019": 18.2,
    "2020": 26.1,
    "2021": 33,
    "2022": 40.1,
    "2023": 47.7,
    "2024": 52.4,
    country: "Netherlands",
    share: 52.4,
    twh: 121,
  },
  {
    "2019": 39.9,
    "2020": 41.7,
    "2021": 40.3,
    "2022": 35.6,
    "2023": 43.8,
    "2024": 49,
    country: "Italy",
    share: 49,
    twh: 264,
  },
  {
    "2019": 20.9,
    "2020": 24.2,
    "2021": 22.5,
    "2022": 24.4,
    "2023": 27,
    "2024": 28.3,
    country: "France",
    share: 28.3,
    twh: 536,
  },
  {
    "2019": 14.1,
    "2020": 17.2,
    "2021": 16.9,
    "2022": 20.6,
    "2023": 26.4,
    "2024": 29.5,
    country: "Poland",
    share: 29.5,
    twh: 167,
  },
];

<ComparisonTable
  title="The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024"
  subtitle="Renewable share of electricity generation, selected EU countries, 2019 to 2024"
  data={data}
  columns={[
    { key: "country", label: "Country" },
    { key: "twh", label: "Generation, TWh", kind: "bar", format: "integer", hideBelow: 560 },
    { key: "share", label: "Share, 2024", format: "{value}%" },
    {
      key: "trend",
      label: "2019 to 2024",
      kind: "sparkline",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      format: "{value}%",
    },
    {
      key: "change",
      label: "Change",
      kind: "delta",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      change: "absolute",
      format: "{value} pts",
    },
  ]}
  sort={{ key: "share" }}
  highlight="Netherlands"
  source="Ember, European Electricity Review 2025"
  note="Rounded, illustrative"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "comparison-table",
  "title": "The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024",
  "subtitle": "Renewable share of electricity generation, selected EU countries, 2019 to 2024",
  "data": [
    {
      "2019": 40.1,
      "2020": 44.2,
      "2021": 40.9,
      "2022": 44.5,
      "2023": 52.6,
      "2024": 58.9,
      "country": "Germany",
      "share": 58.9,
      "twh": 498
    },
    {
      "2019": 37.5,
      "2020": 44.1,
      "2021": 46.7,
      "2022": 42.2,
      "2023": 50.3,
      "2024": 56.8,
      "country": "Spain",
      "share": 56.8,
      "twh": 264
    },
    {
      "2019": 18.2,
      "2020": 26.1,
      "2021": 33,
      "2022": 40.1,
      "2023": 47.7,
      "2024": 52.4,
      "country": "Netherlands",
      "share": 52.4,
      "twh": 121
    },
    {
      "2019": 39.9,
      "2020": 41.7,
      "2021": 40.3,
      "2022": 35.6,
      "2023": 43.8,
      "2024": 49,
      "country": "Italy",
      "share": 49,
      "twh": 264
    },
    {
      "2019": 20.9,
      "2020": 24.2,
      "2021": 22.5,
      "2022": 24.4,
      "2023": 27,
      "2024": 28.3,
      "country": "France",
      "share": 28.3,
      "twh": 536
    },
    {
      "2019": 14.1,
      "2020": 17.2,
      "2021": 16.9,
      "2022": 20.6,
      "2023": 26.4,
      "2024": 29.5,
      "country": "Poland",
      "share": 29.5,
      "twh": 167
    }
  ],
  "columns": [
    { "key": "country", "label": "Country" },
    {
      "key": "twh",
      "label": "Generation, TWh",
      "kind": "bar",
      "format": "integer",
      "hideBelow": 560
    },
    { "key": "share", "label": "Share, 2024", "format": "{value}%" },
    {
      "key": "trend",
      "label": "2019 to 2024",
      "kind": "sparkline",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "format": "{value}%"
    },
    {
      "key": "change",
      "label": "Change",
      "kind": "delta",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "change": "absolute",
      "format": "{value} pts"
    }
  ],
  "sort": { "key": "share" },
  "highlight": "Netherlands",
  "source": "Ember, European Electricity Review 2025",
  "note": "Rounded, illustrative"
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

- Component reference with every example: https://insightcharts.dev/llms/comparison-table.md
- Registry item: https://insightcharts.dev/r/comparison-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/comparison-table.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/comparison-table
- These instructions as plain text: https://insightcharts.dev/agents/molecules/comparison-table.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
