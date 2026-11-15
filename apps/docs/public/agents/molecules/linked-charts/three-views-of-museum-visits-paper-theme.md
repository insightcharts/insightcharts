# Reproduce the "Three views of museum visits, paper theme" example of the InsightCharts Linked charts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Three views of museum visits, paper theme" example of `linked-charts` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Two to four charts over one shared dataset in a responsive grid: clicking a mark in one filters the others, with the active filters shown as removable chips.

Use it when: Exploration of one table along several dimensions: by region, by category and over time. Pass row-level data once; each chart aggregates it with its own `transform`, sets `select: true` and omits `data`.

Pick something else when: A report that states one fixed fact (use `chart-callout` or `scrolly-chart`); charts over unrelated datasets (they cannot filter each other); more than four charts.

Instructions for the alternatives: `chart-callout` https://insightcharts.dev/agents/molecules/chart-callout.md, `scrolly-chart` https://insightcharts.dev/agents/molecules/scrolly-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/linked-charts
```

The file lands at `components/insightcharts/molecules/linked-charts.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { LinkedCharts } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "museum": "Natural History", "quarter": "Q1", "visitor": "Local", "visits": 120 },
  { "museum": "Natural History", "quarter": "Q1", "visitor": "Domestic", "visits": 80 },
  { "museum": "Natural History", "quarter": "Q1", "visitor": "International", "visits": 60 }
]
```

## 5. The "Three views of museum visits, paper theme" example

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { AreaChart, DonutChart, LinkedCharts, LollipopChart } from "insightcharts";

const data = [
  { museum: "Natural History", quarter: "Q1", visitor: "Local", visits: 120 },
  { museum: "Natural History", quarter: "Q1", visitor: "Domestic", visits: 80 },
  { museum: "Natural History", quarter: "Q1", visitor: "International", visits: 60 },
  { museum: "Natural History", quarter: "Q2", visitor: "Local", visits: 130 },
  { museum: "Natural History", quarter: "Q2", visitor: "Domestic", visits: 110 },
  { museum: "Natural History", quarter: "Q2", visitor: "International", visits: 95 },
  { museum: "Natural History", quarter: "Q3", visitor: "Local", visits: 125 },
  { museum: "Natural History", quarter: "Q3", visitor: "Domestic", visits: 150 },
  { museum: "Natural History", quarter: "Q3", visitor: "International", visits: 160 },
  { museum: "Natural History", quarter: "Q4", visitor: "Local", visits: 115 },
  { museum: "Natural History", quarter: "Q4", visitor: "Domestic", visits: 90 },
  { museum: "Natural History", quarter: "Q4", visitor: "International", visits: 70 },
  { museum: "Modern Art", quarter: "Q1", visitor: "Local", visits: 70 },
  { museum: "Modern Art", quarter: "Q1", visitor: "Domestic", visits: 45 },
  { museum: "Modern Art", quarter: "Q1", visitor: "International", visits: 50 },
  { museum: "Modern Art", quarter: "Q2", visitor: "Local", visits: 75 },
  { museum: "Modern Art", quarter: "Q2", visitor: "Domestic", visits: 60 },
  { museum: "Modern Art", quarter: "Q2", visitor: "International", visits: 70 },
  { museum: "Modern Art", quarter: "Q3", visitor: "Local", visits: 70 },
  { museum: "Modern Art", quarter: "Q3", visitor: "Domestic", visits: 80 },
  { museum: "Modern Art", quarter: "Q3", visitor: "International", visits: 110 },
  { museum: "Modern Art", quarter: "Q4", visitor: "Local", visits: 80 },
  { museum: "Modern Art", quarter: "Q4", visitor: "Domestic", visits: 55 },
  { museum: "Modern Art", quarter: "Q4", visitor: "International", visits: 60 },
  { museum: "Maritime", quarter: "Q1", visitor: "Local", visits: 40 },
  { museum: "Maritime", quarter: "Q1", visitor: "Domestic", visits: 25 },
  { museum: "Maritime", quarter: "Q1", visitor: "International", visits: 10 },
  { museum: "Maritime", quarter: "Q2", visitor: "Local", visits: 45 },
  { museum: "Maritime", quarter: "Q2", visitor: "Domestic", visits: 40 },
  { museum: "Maritime", quarter: "Q2", visitor: "International", visits: 20 },
  { museum: "Maritime", quarter: "Q3", visitor: "Local", visits: 50 },
  { museum: "Maritime", quarter: "Q3", visitor: "Domestic", visits: 60 },
  { museum: "Maritime", quarter: "Q3", visitor: "International", visits: 35 },
  { museum: "Maritime", quarter: "Q4", visitor: "Local", visits: 38 },
  { museum: "Maritime", quarter: "Q4", visitor: "Domestic", visits: 28 },
  { museum: "Maritime", quarter: "Q4", visitor: "International", visits: 12 },
];

<LinkedCharts
  theme="paper"
  title="The Natural History Museum had 1.3 million of the 2.5 million visits in 2024"
  subtitle="Visits to three city museums, thousands, by visitor origin and quarter, 2024"
  data={data}
  labels={{ museum: "Museum", visitor: "Visitor", quarter: "Quarter" }}
  hint="Click a mark to filter the other charts"
  unit="rows"
  charts={[
    <LollipopChart
      id="v-museum"
      x="museum"
      y="visits"
      select
      format="integer"
      height={180}
      title="By museum"
      transform={{ type: "aggregate", groupBy: "museum", measures: { visits: { op: "sum", field: "visits" } } }}
    />,
    <DonutChart
      id="v-visitor"
      name="visitor"
      value="visits"
      select
      format="integer"
      centerLabel="thousand visits"
      height={200}
      title="By visitor origin"
      transform={{
        type: "aggregate",
        groupBy: "visitor",
        measures: { visits: { op: "sum", field: "visits" } },
      }}
    />,
    <AreaChart
      id="v-quarter"
      x="quarter"
      y="visits"
      series="visitor"
      stack
      format="integer"
      height={240}
      title="By quarter"
      transform={{
        type: "aggregate",
        groupBy: ["quarter", "visitor"],
        measures: { visits: { op: "sum", field: "visits" } },
      }}
    />,
  ]}
  source="City museums service"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "title": "The Natural History Museum had 1.3 million of the 2.5 million visits in 2024",
  "subtitle": "Visits to three city museums, thousands, by visitor origin and quarter, 2024",
  "data": [
    { "museum": "Natural History", "quarter": "Q1", "visitor": "Local", "visits": 120 },
    { "museum": "Natural History", "quarter": "Q1", "visitor": "Domestic", "visits": 80 },
    { "museum": "Natural History", "quarter": "Q1", "visitor": "International", "visits": 60 },
    { "museum": "Natural History", "quarter": "Q2", "visitor": "Local", "visits": 130 },
    { "museum": "Natural History", "quarter": "Q2", "visitor": "Domestic", "visits": 110 },
    { "museum": "Natural History", "quarter": "Q2", "visitor": "International", "visits": 95 },
    { "museum": "Natural History", "quarter": "Q3", "visitor": "Local", "visits": 125 },
    { "museum": "Natural History", "quarter": "Q3", "visitor": "Domestic", "visits": 150 },
    { "museum": "Natural History", "quarter": "Q3", "visitor": "International", "visits": 160 },
    { "museum": "Natural History", "quarter": "Q4", "visitor": "Local", "visits": 115 },
    { "museum": "Natural History", "quarter": "Q4", "visitor": "Domestic", "visits": 90 },
    { "museum": "Natural History", "quarter": "Q4", "visitor": "International", "visits": 70 },
    { "museum": "Modern Art", "quarter": "Q1", "visitor": "Local", "visits": 70 },
    { "museum": "Modern Art", "quarter": "Q1", "visitor": "Domestic", "visits": 45 },
    { "museum": "Modern Art", "quarter": "Q1", "visitor": "International", "visits": 50 },
    { "museum": "Modern Art", "quarter": "Q2", "visitor": "Local", "visits": 75 },
    { "museum": "Modern Art", "quarter": "Q2", "visitor": "Domestic", "visits": 60 },
    { "museum": "Modern Art", "quarter": "Q2", "visitor": "International", "visits": 70 },
    { "museum": "Modern Art", "quarter": "Q3", "visitor": "Local", "visits": 70 },
    { "museum": "Modern Art", "quarter": "Q3", "visitor": "Domestic", "visits": 80 },
    { "museum": "Modern Art", "quarter": "Q3", "visitor": "International", "visits": 110 },
    { "museum": "Modern Art", "quarter": "Q4", "visitor": "Local", "visits": 80 },
    { "museum": "Modern Art", "quarter": "Q4", "visitor": "Domestic", "visits": 55 },
    { "museum": "Modern Art", "quarter": "Q4", "visitor": "International", "visits": 60 },
    { "museum": "Maritime", "quarter": "Q1", "visitor": "Local", "visits": 40 },
    { "museum": "Maritime", "quarter": "Q1", "visitor": "Domestic", "visits": 25 },
    { "museum": "Maritime", "quarter": "Q1", "visitor": "International", "visits": 10 },
    { "museum": "Maritime", "quarter": "Q2", "visitor": "Local", "visits": 45 },
    { "museum": "Maritime", "quarter": "Q2", "visitor": "Domestic", "visits": 40 },
    { "museum": "Maritime", "quarter": "Q2", "visitor": "International", "visits": 20 },
    { "museum": "Maritime", "quarter": "Q3", "visitor": "Local", "visits": 50 },
    { "museum": "Maritime", "quarter": "Q3", "visitor": "Domestic", "visits": 60 },
    { "museum": "Maritime", "quarter": "Q3", "visitor": "International", "visits": 35 },
    { "museum": "Maritime", "quarter": "Q4", "visitor": "Local", "visits": 38 },
    { "museum": "Maritime", "quarter": "Q4", "visitor": "Domestic", "visits": 28 },
    { "museum": "Maritime", "quarter": "Q4", "visitor": "International", "visits": 12 }
  ],
  "labels": { "museum": "Museum", "visitor": "Visitor", "quarter": "Quarter" },
  "hint": "Click a mark to filter the other charts",
  "unit": "rows",
  "charts": [
    {
      "type": "lollipop-chart",
      "id": "v-museum",
      "x": "museum",
      "y": "visits",
      "select": true,
      "format": "integer",
      "height": 180,
      "title": "By museum",
      "transform": {
        "type": "aggregate",
        "groupBy": "museum",
        "measures": { "visits": { "op": "sum", "field": "visits" } }
      }
    },
    {
      "type": "donut-chart",
      "id": "v-visitor",
      "name": "visitor",
      "value": "visits",
      "select": true,
      "format": "integer",
      "centerLabel": "thousand visits",
      "height": 200,
      "title": "By visitor origin",
      "transform": {
        "type": "aggregate",
        "groupBy": "visitor",
        "measures": { "visits": { "op": "sum", "field": "visits" } }
      }
    },
    {
      "type": "area-chart",
      "id": "v-quarter",
      "x": "quarter",
      "y": "visits",
      "series": "visitor",
      "stack": true,
      "format": "integer",
      "height": 240,
      "title": "By quarter",
      "transform": {
        "type": "aggregate",
        "groupBy": ["quarter", "visitor"],
        "measures": { "visits": { "op": "sum", "field": "visits" } }
      }
    }
  ],
  "source": "City museums service",
  "note": "Illustrative data",
  "type": "linked-charts"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `charts`, `Slot[]`: Two to four chart specs or elements. Give each `select: true` (or a field name) and a stable `id`, and leave out `data`. In the example: 3 items: a `lollipop-chart` spec; a `donut-chart` spec; a `area-chart` spec.
- `children`, `ReactNode`: JSX alternative to `charts`. Not used in the example.
- `before`, `Slot | Slot[]`: Content rendered inside the shared store above the grid: figures, text, a custom component that calls `useInsightData()`, or a spec that omits `data` (e.g. `stat-row`, `data-table`). It sees the same filtered rows as the charts. Not used in the example.
- `after`, `Slot | Slot[]`: Content rendered inside the shared store below the grid, e.g. a detail table of the filtered rows. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` (required) | `DataInput` |  | The shared, row-level dataset. |
| `transform` | `Transform \| Transform[]` |  | Applied once to the shared data. |
| `charts` | `Slot[]` |  | Two to four chart specs or elements. Give each `select: true` (or a field name) and a stable `id`, and leave out `data`. |
| `columns` | `number` |  | Preferred columns. Default two; fewer when charts would be narrower than `minChartWidth`. |
| `minChartWidth` | `number` | `260` | Narrowest a chart may get before the grid drops a column. |
| `filters` | `boolean` | `true` | Show the filter line (`filter-chips`). |
| `hint` | `string` | `"Click a mark to filter the other charts"` | Shown in the filter line while nothing is selected. |
| `labels` | `Record<string, string>` |  | Display names for the fields in the chips. |
| `count` | `boolean` | `false` | Show the filtered row count at the end of the filter line. |
| `unit` | `string` | `"rows"` | Noun for the count. |
| `selections` | `Record<string, Selection>` |  | Controlled selections, keyed by chart id. |
| `onSelectionsChange` | `(selections) => void` |  | Called when the selections change. |
| `title` | `string` |  | Heading for the group. |
| `subtitle` | `string` |  | Measure, population and period shared by the charts. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `children` | `ReactNode` |  | JSX alternative to `charts`. |
| `before` | `Slot \| Slot[]` |  | Content rendered inside the shared store above the grid: figures, text, a custom component that calls `useInsightData()`, or a spec that omits `data` (e.g. `stat-row`, `data-table`). It sees the same filtered rows as the charts. |
| `after` | `Slot \| Slot[]` |  | Content rendered inside the shared store below the grid, e.g. a detail table of the filtered rows. |
| `gap` | `number` | `24` | Space in px between the `before` slot, the grid and the `after` slot. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every chart. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `filter-chips` (molecule), `bar-chart` (atom), `line-chart` (atom)
- Used by: `data-explorer` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/linked-charts.md
- Component reference with every example: https://insightcharts.dev/llms/linked-charts.md
- Registry item: https://insightcharts.dev/r/linked-charts.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/linked-charts.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/linked-charts#example-three-views-of-museum-visits-paper-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/linked-charts/three-views-of-museum-visits-paper-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
