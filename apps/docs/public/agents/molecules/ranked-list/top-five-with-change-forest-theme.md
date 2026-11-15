# Reproduce the "Top five with change, forest theme" example of the InsightCharts Ranked list

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Top five with change, forest theme" example of `ranked-list` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A ranking as a list: position, name, value and a thin in-row bar, with an optional change indicator and highlighted rows.

Use it when: A top-N list where the names matter as much as the values: league tables, best and worst performers, leaderboards with a movement column. It keeps long names readable and works in a narrow column.

Pick something else when: Precise visual comparison of many values or more than about 15 rows (use `bar-chart`); several measures per entity (use `data-table` or `comparison-table`); rank changing over time (use `bump-chart`).

Instructions for the alternatives: `comparison-table` https://insightcharts.dev/agents/molecules/comparison-table.md, `bump-chart` https://insightcharts.dev/agents/atoms/bump-chart.md, `data-table` https://insightcharts.dev/agents/atoms/data-table.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ranked-list
```

The file lands at `components/insightcharts/molecules/ranked-list.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { RankedList } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "Russia", "area": 815, "change": 0 },
  { "country": "Brazil", "area": 497, "change": -0.03 },
  { "country": "Canada", "area": 347, "change": 0 }
]
```

How the example maps columns to props:

- `name` = `"country"`. Field naming each entity.
- `value` = `"area"`. Field with the value that ranks them. Bars start at zero.
- `change` = `"change"`. Field with a change shown at the end of each row: a number (0.12 is +12%) or a string.

With the user's data, keep the props and change the column names.

## 5. The "Top five with change, forest theme" example

This example sets `theme="forest"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { RankedList } from "insightcharts";

const data = [
  { country: "Russia", area: 815, change: 0 },
  { country: "Brazil", area: 497, change: -0.03 },
  { country: "Canada", area: 347, change: 0 },
  { country: "United States", area: 310, change: 0.01 },
  { country: "China", area: 220, change: 0.1 },
];

<RankedList
  theme="forest"
  title="Brazil had 497 million hectares of forest in 2020"
  subtitle="Forest area, million hectares, five largest countries, 2020, with change since 2010"
  data={data}
  name="country"
  value="area"
  change="change"
  highlight="Brazil"
  source="FAO, Global Forest Resources Assessment 2020"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "forest",
  "title": "Brazil had 497 million hectares of forest in 2020",
  "subtitle": "Forest area, million hectares, five largest countries, 2020, with change since 2010",
  "data": [
    { "country": "Russia", "area": 815, "change": 0 },
    { "country": "Brazil", "area": 497, "change": -0.03 },
    { "country": "Canada", "area": 347, "change": 0 },
    { "country": "United States", "area": 310, "change": 0.01 },
    { "country": "China", "area": 220, "change": 0.1 }
  ],
  "name": "country",
  "value": "area",
  "change": "change",
  "highlight": "Brazil",
  "source": "FAO, Global Forest Resources Assessment 2020",
  "note": "Figures are approximate, for illustration",
  "type": "ranked-list"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | One row per entity. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before ranking. |
| `name` (required) | `string` |  | Field naming each entity. |
| `value` (required) | `string` |  | Field with the value that ranks them. Bars start at zero. |
| `change` | `string` |  | Field with a change shown at the end of each row: a number (0.12 is +12%) or a string. |
| `changeFormat` | `FormatSpec` | `signed percent` | Format for numeric changes, e.g. `"signed"` for places moved. |
| `upIsGood` | `boolean` | `true` | Whether a positive change is good news. |
| `detail` | `string` |  | Field with a short secondary line under each name. |
| `sort` | `"desc" \| "asc" \| "none"` | `"desc"` | Order by value; `none` keeps the data order. |
| `limit` | `number` |  | Show only the first N rows after sorting. |
| `highlight` | `string \| string[]` |  | Entity names to emphasise. The other bars are drawn in grey. |
| `bar` | `boolean` | `true` | Draw the in-row bar. |
| `max` | `number` |  | Value at which a bar is full. Default: the largest value shown. |
| `format` | `FormatSpec` | `"auto"` | Number format for the values. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Measure, population and period. |
| `source` | `string` |  | Shown under the list as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `delta` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/ranked-list.md
- Component reference with every example: https://insightcharts.dev/llms/ranked-list.md
- Registry item: https://insightcharts.dev/r/ranked-list.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/ranked-list.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/ranked-list#example-top-five-with-change-forest-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/ranked-list/top-five-with-change-forest-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
