# Reproduce the "Shared highlight, two columns, emphasised panel" example of the InsightCharts Small multiple grid

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Shared highlight, two columns, emphasised panel" example of `small-multiple-grid` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Repeats any chart spec once per value of a facet field, each panel with its own filtered rows and a title, in a grid that follows the container width.

Use it when: Faceting a chart form the `small-multiples` atom does not draw: stacked bars, scatter plots, donuts, waffles, dumbbells, histograms. Also when each panel should be a full chart with its own tooltip and axis.

Pick something else when: Line, area or bar facets that must share one value scale: use the `small-multiples` atom, which draws every panel in one chart on a common axis. Here each panel scales to its own rows unless the spec fixes the axis (for example `option: { xAxis: { max: 70 } }`), so say so in the subtitle or fix it. More than about twelve panels.

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/small-multiple-grid
```

The file lands at `components/insightcharts/molecules/small-multiple-grid.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SmallMultipleGrid } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "Netherlands", "age": "16-24", "Usually": 18, "Sometimes": 22 },
  { "country": "Netherlands", "age": "25-34", "Usually": 44, "Sometimes": 21 },
  { "country": "Netherlands", "age": "35-49", "Usually": 41, "Sometimes": 19 }
]
```

How the example maps columns to props:

- `facet` = `"country"`. Field whose values each get a panel.

With the user's data, keep the props and change the column names.

## 5. The "Shared highlight, two columns, emphasised panel" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, SmallMultipleGrid, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

const data = [
  { country: "Netherlands", age: "16-24", Usually: 18, Sometimes: 22 },
  { country: "Netherlands", age: "25-34", Usually: 44, Sometimes: 21 },
  { country: "Netherlands", age: "35-49", Usually: 41, Sometimes: 19 },
  { country: "Netherlands", age: "50-64", Usually: 33, Sometimes: 17 },
  { country: "Netherlands", age: "65+", Usually: 14, Sometimes: 9 },
  { country: "Germany", age: "16-24", Usually: 9, Sometimes: 15 },
  { country: "Germany", age: "25-34", Usually: 24, Sometimes: 18 },
  { country: "Germany", age: "35-49", Usually: 23, Sometimes: 16 },
  { country: "Germany", age: "50-64", Usually: 18, Sometimes: 13 },
  { country: "Germany", age: "65+", Usually: 8, Sometimes: 6 },
  { country: "Spain", age: "16-24", Usually: 5, Sometimes: 9 },
  { country: "Spain", age: "25-34", Usually: 13, Sometimes: 12 },
  { country: "Spain", age: "35-49", Usually: 13, Sometimes: 11 },
  { country: "Spain", age: "50-64", Usually: 10, Sometimes: 8 },
  { country: "Spain", age: "65+", Usually: 4, Sometimes: 4 },
  { country: "Italy", age: "16-24", Usually: 3, Sometimes: 6 },
  { country: "Italy", age: "25-34", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "35-49", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "50-64", Usually: 7, Sometimes: 6 },
  { country: "Italy", age: "65+", Usually: 3, Sometimes: 3 },
];

<SmallMultipleGrid
  title="44% of Dutch workers aged 25 to 34 usually worked from home in 2023"
  subtitle="Share usually working from home, by age group, 2023. Panels are on their own scales"
  data={data}
  facet="country"
  columns={2}
  highlight="25-34"
  emphasis="Netherlands"
  chart={{
    type: "bar-chart",
    x: "age",
    y: "Usually",
    sort: "none",
    orientation: "vertical",
    format: "{value}%",
  }}
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "title": "44% of Dutch workers aged 25 to 34 usually worked from home in 2023",
  "subtitle": "Share usually working from home, by age group, 2023. Panels are on their own scales",
  "data": [
    { "country": "Netherlands", "age": "16-24", "Usually": 18, "Sometimes": 22 },
    { "country": "Netherlands", "age": "25-34", "Usually": 44, "Sometimes": 21 },
    { "country": "Netherlands", "age": "35-49", "Usually": 41, "Sometimes": 19 },
    { "country": "Netherlands", "age": "50-64", "Usually": 33, "Sometimes": 17 },
    { "country": "Netherlands", "age": "65+", "Usually": 14, "Sometimes": 9 },
    { "country": "Germany", "age": "16-24", "Usually": 9, "Sometimes": 15 },
    { "country": "Germany", "age": "25-34", "Usually": 24, "Sometimes": 18 },
    { "country": "Germany", "age": "35-49", "Usually": 23, "Sometimes": 16 },
    { "country": "Germany", "age": "50-64", "Usually": 18, "Sometimes": 13 },
    { "country": "Germany", "age": "65+", "Usually": 8, "Sometimes": 6 },
    { "country": "Spain", "age": "16-24", "Usually": 5, "Sometimes": 9 },
    { "country": "Spain", "age": "25-34", "Usually": 13, "Sometimes": 12 },
    { "country": "Spain", "age": "35-49", "Usually": 13, "Sometimes": 11 },
    { "country": "Spain", "age": "50-64", "Usually": 10, "Sometimes": 8 },
    { "country": "Spain", "age": "65+", "Usually": 4, "Sometimes": 4 },
    { "country": "Italy", "age": "16-24", "Usually": 3, "Sometimes": 6 },
    { "country": "Italy", "age": "25-34", "Usually": 9, "Sometimes": 8 },
    { "country": "Italy", "age": "35-49", "Usually": 9, "Sometimes": 8 },
    { "country": "Italy", "age": "50-64", "Usually": 7, "Sometimes": 6 },
    { "country": "Italy", "age": "65+", "Usually": 3, "Sometimes": 3 }
  ],
  "facet": "country",
  "columns": 2,
  "highlight": "25-34",
  "emphasis": "Netherlands",
  "chart": {
    "type": "bar-chart",
    "x": "age",
    "y": "Usually",
    "sort": "none",
    "orientation": "vertical",
    "format": "{value}%"
  },
  "note": "Illustrative data",
  "type": "small-multiple-grid"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `chart` (required), `InsightSpec | (facet, rows) => ReactNode`: The chart repeated in every panel: a spec without `data` and without a `title`, or a render function from JSX. In the example: a `bar-chart` spec.
- `emphasis`, `string | string[]`: Facet values whose panel titles are emphasised. In the example: `"Netherlands"`.
- `legend`, `(string | { label, color?, index?, shape?, muted? })[]`: One shared colour key above the panels (`legend-key` items, in series order). Set `legend: false` in the chart spec so panels do not repeat it. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | Rows for every panel together. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before the rows are split by `facet`. |
| `facet` (required) | `string` |  | Field whose values each get a panel. |
| `chart` (required) | `InsightSpec \| (facet, rows) => ReactNode` |  | The chart repeated in every panel: a spec without `data` and without a `title`, or a render function from JSX. |
| `columns` | `number` |  | Preferred columns. Default: up to four, reduced to fit `minPanelWidth`. |
| `minPanelWidth` | `number` | `200` | Narrowest a panel may get before the grid drops a column. |
| `order` | `"data" \| "asc" \| "desc" \| string[]` | `"data"` | Panel order: data order, alphabetical, or an explicit list of facet values. |
| `panelHeight` | `number` | `160` | Plot height of each panel when the spec sets none. |
| `highlight` | `string \| string[]` |  | Passed to every panel as its `highlight`, so the same entity is emphasised everywhere. |
| `emphasis` | `string \| string[]` |  | Facet values whose panel titles are emphasised. |
| `legend` | `(string \| { label, color?, index?, shape?, muted? })[]` |  | One shared colour key above the panels (`legend-key` items, in series order). Set `legend: false` in the chart spec so panels do not repeat it. |
| `names` | `Record<string, string>` |  | Display names for facet values. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Heading level of the panel titles. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Measure, population, period, and whether the panels share a scale. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every panel. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `legend-key` (atom), `bar-chart` (atom), `waffle-chart` (atom), `dumbbell-chart` (atom)
- Used by: `visual-essay` (template)

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/small-multiple-grid.md
- Component reference with every example: https://insightcharts.dev/llms/small-multiple-grid.md
- Registry item: https://insightcharts.dev/r/small-multiple-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/small-multiple-grid.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/small-multiple-grid#example-shared-highlight-two-columns-emphasised-panel
- These instructions as plain text: https://insightcharts.dev/agents/molecules/small-multiple-grid/shared-highlight-two-columns-emphasised-panel.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
