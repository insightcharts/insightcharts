# Build a Scatter chart with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Scatter chart (`scatter-chart`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

Plots two numeric measures against each other, one dot per row, with optional bubble size, group colour, selective labels and a trend line.

Use it when: Showing whether and how two measures move together, spotting clusters and outliers, and placing named entities in a two-dimensional space (with quadrant lines via `annotations`).

Pick something else when: A measure over time (use line-chart); one numeric measure by category (use beeswarm-chart or strip-plot); fewer than about 8 points (use bar-chart or a table); more than 4 colour groups (facet with small-multiples).

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scatter-chart
```

The file lands at `components/insightcharts/atoms/scatter-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ScatterChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "United States", "spend": 12555, "life": 77.5 },
  { "country": "Switzerland", "spend": 8049, "life": 83.9 },
  { "country": "Germany", "spend": 8011, "life": 80.8 }
]
```

How the example maps columns to props:

- `x` = `"spend"`. Numeric field on the horizontal axis.
- `y` = `"life"`. Numeric field on the vertical axis.
- `label` = `"country"`. Field naming each point, for tooltips, direct labels and `highlight`.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { country: "United States", spend: 12555, life: 77.5 },
  { country: "Switzerland", spend: 8049, life: 83.9 },
  { country: "Germany", spend: 8011, life: 80.8 },
  { country: "Norway", spend: 7771, life: 83.2 },
  { country: "Netherlands", spend: 6729, life: 81.4 },
  { country: "France", spend: 6630, life: 82.4 },
  { country: "Canada", spend: 6319, life: 81.6 },
  { country: "Sweden", spend: 6438, life: 83.1 },
  { country: "Australia", spend: 6372, life: 83.3 },
  { country: "United Kingdom", spend: 5493, life: 80.7 },
  { country: "Japan", spend: 5251, life: 84.5 },
  { country: "Italy", spend: 4291, life: 82.7 },
  { country: "Spain", spend: 4432, life: 83.3 },
  { country: "South Korea", spend: 4570, life: 83.6 },
  { country: "Portugal", spend: 4162, life: 81.5 },
  { country: "Israel", spend: 3444, life: 82.6 },
  { country: "Poland", spend: 2973, life: 76.5 },
  { country: "Chile", spend: 2699, life: 81 },
  { country: "Mexico", spend: 1181, life: 75.4 },
];

<ScatterChart
  data={data}
  x="spend"
  y="life"
  label="country"
  highlight="United States"
  labels={["United States", "Japan", "Mexico", "Switzerland", "Poland"]}
  xFormat="currency:USD"
  xLabel="Health spending per person"
  yLabel="Life expectancy, years"
  title="The United States spent $12,555 per person on health in 2022"
  subtitle="Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years."
  source="OECD Health Statistics (rounded)"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "scatter-chart",
  "data": [
    { "country": "United States", "spend": 12555, "life": 77.5 },
    { "country": "Switzerland", "spend": 8049, "life": 83.9 },
    { "country": "Germany", "spend": 8011, "life": 80.8 },
    { "country": "Norway", "spend": 7771, "life": 83.2 },
    { "country": "Netherlands", "spend": 6729, "life": 81.4 },
    { "country": "France", "spend": 6630, "life": 82.4 },
    { "country": "Canada", "spend": 6319, "life": 81.6 },
    { "country": "Sweden", "spend": 6438, "life": 83.1 },
    { "country": "Australia", "spend": 6372, "life": 83.3 },
    { "country": "United Kingdom", "spend": 5493, "life": 80.7 },
    { "country": "Japan", "spend": 5251, "life": 84.5 },
    { "country": "Italy", "spend": 4291, "life": 82.7 },
    { "country": "Spain", "spend": 4432, "life": 83.3 },
    { "country": "South Korea", "spend": 4570, "life": 83.6 },
    { "country": "Portugal", "spend": 4162, "life": 81.5 },
    { "country": "Israel", "spend": 3444, "life": 82.6 },
    { "country": "Poland", "spend": 2973, "life": 76.5 },
    { "country": "Chile", "spend": 2699, "life": 81 },
    { "country": "Mexico", "spend": 1181, "life": 75.4 }
  ],
  "x": "spend",
  "y": "life",
  "label": "country",
  "highlight": "United States",
  "labels": ["United States", "Japan", "Mexico", "Switzerland", "Poland"],
  "xFormat": "currency:USD",
  "xLabel": "Health spending per person",
  "yLabel": "Life expectancy, years",
  "title": "The United States spent $12,555 per person on health in 2022",
  "subtitle": "Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years.",
  "source": "OECD Health Statistics (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Numeric field on the horizontal axis. |
| `y` (required) | `string` |  | Numeric field on the vertical axis. |
| `size` | `string` |  | Numeric field for bubble size; area is proportional to the value. |
| `series` | `string` |  | Field that colours points by group. Beyond 4 groups the smallest fold into a grey Other. |
| `label` | `string` |  | Field naming each point, for tooltips, direct labels and `highlight`. |
| `labels` | `"auto" \| "all" \| "none" \| string[]` | `"auto"` | Which points are labelled. `auto`: highlighted points, or the outliers when nothing is highlighted. Overlapping labels are hidden. |
| `trend` | `boolean` | `false` | Least-squares line of best fit through all points. |
| `logX` | `boolean` | `false` | Logarithmic x axis. |
| `logY` | `boolean` | `false` | Logarithmic y axis. |
| `xLabel` | `string` |  | x axis title. Defaults to the field name. |
| `yLabel` | `string` |  | y axis title. Defaults to the field name. |
| `xFormat` | `FormatSpec` |  | Format for x values; `format` applies to y. |
| `opacity` | `number` |  | Point opacity. Default falls as the point count rises. |
| `names` | `Record<string, string>` |  | Display names for series keys. |

Every chart also accepts these common props:

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` | A pipeline of transforms applied before drawing. |
| `title` | `string` | The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. |
| `subtitle` | `string` | Measure, unit, population, period. |
| `source` | `string` | Data source, shown as "Source: ...". |
| `note` | `string` | Method notes or caveats. |
| `height` | `number \| string` | CSS height of the plot. Default 360. |
| `aspect` | `number` | Width / height. Overrides `height`. |
| `highlight` | `string \| string[]` | The entity (or entities) the title is about. Every other series is drawn in grey. |
| `annotations` | `Annotation[]` | Reference lines, shaded bands and callouts, in data coordinates. |
| `format` | `FormatSpec` | How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. |
| `legend` | `boolean` | Show the legend. Default: shown when there are two or more series. |
| `select` | `boolean \| string` | Make marks clickable to filter. Inside `<InsightData>` the selection filters every other chart. Pass a field name, or `true` to use the chart's category field. |
| `onSelect` | `(values: string[], field: string) => void` | Called with the selected values whenever the selection changes. |
| `option` | `EChartsOption \| ((option: EChartsOption, ctx: BuildContext) => EChartsOption)` | Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. |
| `theme` | `ThemeInput` | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...), or a theme object. A named theme paints its own background behind the chart. |
| `frame` | `boolean` | Paint the theme's background behind the chart. Default: on for a named theme with its own surface. |
| `mode` | `ModeInput` | `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. |
| `renderer` | `RendererInput` | `"auto"` (default) uses SVG for light charts and canvas for heavy ones. |
| `animate` | `boolean` | Set false to disable animation for this chart. Reduced-motion preferences are always respected. |
| `lazy` | `boolean` | Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`). |
| `group` | `string` | Link tooltips with other charts sharing this group id. |
| `exportable` | `boolean \| ExportFormat[]` | Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. |
| `table` | `boolean` | Show a collapsible "View data" table under the chart. |
| `alt` | `string` | Accessible description: the chart type and measures, then the main pattern and the notable values. |
| `id` | `string` | Stable id for this chart's selection in the shared store. |
| `onEvents` | `Record<string, ChartEventHandler>` | ECharts event handlers: `{ click: (params, chart) => {} }`. |
| `onReady` | `(chart: EChartsInstance) => void` | Called with the ECharts instance once it is initialised. |
| `className` | `string` | Class on the figure element. |
| `style` | `CSSProperties` | Inline style on the figure element. |

## Composition

- Built from: nothing. It is a primitive.
- Used by: no molecule or template yet.

## Rules for this form

- Label only the points the title is about.
- If an axis uses a log scale, say so in `subtitle`.
- Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.
- Use at most three `annotations`. Their values must match values in the data.
- No dual axes and no 3D. The chart must read without hovering.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The chart is exposed as an image (`role="img"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.
- Set `table` to add a collapsible "View data" table under the chart, for readers who need exact values or use a screen reader.
- The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] One entity is highlighted and the others are grey, or the chart has one series.
- [ ] The chart can be read without hovering.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/scatter-chart.md
- Registry item: https://insightcharts.dev/r/scatter-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/scatter-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/scatter-chart
- These instructions as plain text: https://insightcharts.dev/agents/atoms/scatter-chart.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
