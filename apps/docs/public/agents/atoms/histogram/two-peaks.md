# Reproduce the "Two peaks" example of the InsightCharts Histogram

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Two peaks" example of `histogram` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Bins a numeric field and shows how many rows fall in each bin, as touching bars on a continuous axis.

Use it when: Showing the shape of a distribution for one numeric variable with roughly 50 rows or more: its centre, spread, skew, gaps and multiple peaks.

Pick something else when: Comparing distributions across several groups (use box-plot or beeswarm-chart); under about 50 rows, where every observation can be shown (use strip-plot or beeswarm-chart); counts by category (use bar-chart).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md, `box-plot` https://insightcharts.dev/agents/atoms/box-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/histogram
```

The file lands at `components/insightcharts/atoms/histogram.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Histogram } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[{ "wait": 51 }, { "wait": 72 }, { "wait": 76 }]
```

How the example maps columns to props:

- `value` = `"wait"`. Numeric field to bin.

With the user's data, keep the props and change the column names.

## 5. The "Two peaks" example

This example sets `theme="magenta"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { Histogram } from "insightcharts";

const data = [
  { wait: 51 },
  { wait: 72 },
  { wait: 76 },
  { wait: 60 },
  { wait: 82 },
  { wait: 88 },
  { wait: 52 },
  { wait: 82 },
  { wait: 50 },
  { wait: 75 },
  { wait: 49 },
  { wait: 67 },
  { wait: 74 },
  { wait: 58 },
  { wait: 31 },
  { wait: 78 },
  { wait: 80 },
  { wait: 78 },
  { wait: 77 },
  { wait: 57 },
  { wait: 84 },
  { wait: 82 },
  { wait: 86 },
  { wait: 79 },
  { wait: 47 },
  { wait: 67 },
  { wait: 76 },
  { wait: 84 },
  { wait: 77 },
  { wait: 75 },
  { wait: 45 },
  { wait: 70 },
  { wait: 73 },
  { wait: 69 },
  { wait: 50 },
  { wait: 79 },
  { wait: 61 },
  { wait: 54 },
  { wait: 77 },
  { wait: 79 },
  { wait: 53 },
  { wait: 56 },
  { wait: 83 },
  { wait: 78 },
  { wait: 73 },
  { wait: 83 },
  { wait: 86 },
  { wait: 57 },
  { wait: 76 },
  { wait: 51 },
  { wait: 82 },
  { wait: 53 },
  { wait: 81 },
  { wait: 55 },
  { wait: 66 },
  { wait: 46 },
  { wait: 93 },
  { wait: 53 },
  { wait: 80 },
  { wait: 57 },
  { wait: 51 },
  { wait: 74 },
  { wait: 86 },
  { wait: 68 },
  { wait: 50 },
  { wait: 85 },
  { wait: 76 },
  { wait: 81 },
  { wait: 89 },
  { wait: 61 },
  { wait: 50 },
  { wait: 75 },
  { wait: 47 },
  { wait: 78 },
  { wait: 86 },
  { wait: 57 },
  { wait: 56 },
  { wait: 52 },
  { wait: 78 },
  { wait: 85 },
  { wait: 79 },
  { wait: 53 },
  { wait: 57 },
  { wait: 55 },
  { wait: 90 },
  { wait: 78 },
  { wait: 83 },
  { wait: 79 },
  { wait: 48 },
  { wait: 56 },
  { wait: 69 },
  { wait: 74 },
  { wait: 84 },
  { wait: 48 },
  { wait: 67 },
  { wait: 81 },
  { wait: 54 },
  { wait: 50 },
  { wait: 82 },
  { wait: 52 },
  { wait: 80 },
  { wait: 50 },
  { wait: 61 },
  { wait: 88 },
  { wait: 82 },
  { wait: 37 },
  { wait: 64 },
  { wait: 77 },
  { wait: 83 },
  { wait: 67 },
  { wait: 69 },
  { wait: 79 },
  { wait: 61 },
  { wait: 72 },
  { wait: 69 },
  { wait: 56 },
  { wait: 86 },
  { wait: 85 },
  { wait: 87 },
  { wait: 53 },
  { wait: 59 },
  { wait: 58 },
  { wait: 80 },
  { wait: 58 },
  { wait: 85 },
  { wait: 86 },
  { wait: 77 },
  { wait: 87 },
  { wait: 84 },
  { wait: 77 },
  { wait: 74 },
  { wait: 87 },
  { wait: 61 },
  { wait: 76 },
  { wait: 63 },
  { wait: 86 },
  { wait: 55 },
  { wait: 72 },
  { wait: 77 },
  { wait: 61 },
  { wait: 59 },
  { wait: 58 },
  { wait: 77 },
  { wait: 79 },
  { wait: 83 },
  { wait: 46 },
  { wait: 84 },
  { wait: 47 },
  { wait: 74 },
  { wait: 84 },
  { wait: 77 },
  { wait: 80 },
  { wait: 59 },
  { wait: 66 },
  { wait: 47 },
  { wait: 85 },
  { wait: 75 },
  { wait: 80 },
  { wait: 73 },
  { wait: 42 },
  { wait: 85 },
  { wait: 82 },
  { wait: 58 },
  { wait: 53 },
  { wait: 83 },
  { wait: 71 },
  { wait: 85 },
  { wait: 47 },
  { wait: 82 },
  { wait: 79 },
  { wait: 74 },
  { wait: 78 },
  { wait: 59 },
  { wait: 75 },
  { wait: 45 },
  { wait: 87 },
  { wait: 87 },
  { wait: 71 },
  { wait: 45 },
  { wait: 92 },
  { wait: 57 },
  { wait: 54 },
  { wait: 81 },
  { wait: 76 },
  { wait: 61 },
  { wait: 56 },
  { wait: 74 },
  { wait: 53 },
  { wait: 67 },
  { wait: 78 },
  { wait: 56 },
  { wait: 85 },
  { wait: 79 },
  { wait: 88 },
  { wait: 80 },
  { wait: 57 },
  { wait: 75 },
  { wait: 80 },
  { wait: 61 },
  { wait: 74 },
  { wait: 83 },
  { wait: 80 },
  { wait: 79 },
  { wait: 84 },
  { wait: 72 },
  { wait: 79 },
  { wait: 94 },
  { wait: 84 },
  { wait: 81 },
  { wait: 85 },
  { wait: 92 },
  { wait: 72 },
  { wait: 55 },
  { wait: 81 },
  { wait: 87 },
  { wait: 77 },
  { wait: 83 },
  { wait: 81 },
  { wait: 79 },
  { wait: 38 },
  { wait: 78 },
  { wait: 41 },
  { wait: 70 },
  { wait: 85 },
  { wait: 73 },
  { wait: 90 },
  { wait: 82 },
  { wait: 56 },
  { wait: 82 },
  { wait: 78 },
  { wait: 93 },
  { wait: 72 },
  { wait: 69 },
  { wait: 52 },
  { wait: 80 },
  { wait: 56 },
  { wait: 56 },
  { wait: 83 },
  { wait: 76 },
  { wait: 87 },
  { wait: 68 },
  { wait: 82 },
  { wait: 84 },
  { wait: 58 },
  { wait: 89 },
  { wait: 89 },
  { wait: 88 },
  { wait: 75 },
  { wait: 80 },
  { wait: 91 },
  { wait: 71 },
  { wait: 46 },
  { wait: 88 },
  { wait: 64 },
  { wait: 59 },
  { wait: 53 },
  { wait: 51 },
  { wait: 75 },
  { wait: 79 },
  { wait: 54 },
  { wait: 76 },
  { wait: 70 },
  { wait: 50 },
  { wait: 68 },
  { wait: 58 },
  { wait: 49 },
  { wait: 76 },
  { wait: 81 },
  { wait: 81 },
  { wait: 87 },
  { wait: 85 },
  { wait: 73 },
];

<Histogram
  theme="magenta"
  data={data}
  value="wait"
  bins={20}
  countLabel="Eruptions"
  format="{value} min"
  annotations={[{ type: "band", axis: "x", from: 62, to: 70, label: "Rarely" }]}
  title="Waiting time between Old Faithful eruptions"
  subtitle="Minutes between eruptions, 272 observations"
  note="Illustrative data modelled on the Old Faithful geyser dataset"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "magenta",
  "data": [
    { "wait": 51 },
    { "wait": 72 },
    { "wait": 76 },
    { "wait": 60 },
    { "wait": 82 },
    { "wait": 88 },
    { "wait": 52 },
    { "wait": 82 },
    { "wait": 50 },
    { "wait": 75 },
    { "wait": 49 },
    { "wait": 67 },
    { "wait": 74 },
    { "wait": 58 },
    { "wait": 31 },
    { "wait": 78 },
    { "wait": 80 },
    { "wait": 78 },
    { "wait": 77 },
    { "wait": 57 },
    { "wait": 84 },
    { "wait": 82 },
    { "wait": 86 },
    { "wait": 79 },
    { "wait": 47 },
    { "wait": 67 },
    { "wait": 76 },
    { "wait": 84 },
    { "wait": 77 },
    { "wait": 75 },
    { "wait": 45 },
    { "wait": 70 },
    { "wait": 73 },
    { "wait": 69 },
    { "wait": 50 },
    { "wait": 79 },
    { "wait": 61 },
    { "wait": 54 },
    { "wait": 77 },
    { "wait": 79 },
    { "wait": 53 },
    { "wait": 56 },
    { "wait": 83 },
    { "wait": 78 },
    { "wait": 73 },
    { "wait": 83 },
    { "wait": 86 },
    { "wait": 57 },
    { "wait": 76 },
    { "wait": 51 },
    { "wait": 82 },
    { "wait": 53 },
    { "wait": 81 },
    { "wait": 55 },
    { "wait": 66 },
    { "wait": 46 },
    { "wait": 93 },
    { "wait": 53 },
    { "wait": 80 },
    { "wait": 57 },
    { "wait": 51 },
    { "wait": 74 },
    { "wait": 86 },
    { "wait": 68 },
    { "wait": 50 },
    { "wait": 85 },
    { "wait": 76 },
    { "wait": 81 },
    { "wait": 89 },
    { "wait": 61 },
    { "wait": 50 },
    { "wait": 75 },
    { "wait": 47 },
    { "wait": 78 },
    { "wait": 86 },
    { "wait": 57 },
    { "wait": 56 },
    { "wait": 52 },
    { "wait": 78 },
    { "wait": 85 },
    { "wait": 79 },
    { "wait": 53 },
    { "wait": 57 },
    { "wait": 55 },
    { "wait": 90 },
    { "wait": 78 },
    { "wait": 83 },
    { "wait": 79 },
    { "wait": 48 },
    { "wait": 56 },
    { "wait": 69 },
    { "wait": 74 },
    { "wait": 84 },
    { "wait": 48 },
    { "wait": 67 },
    { "wait": 81 },
    { "wait": 54 },
    { "wait": 50 },
    { "wait": 82 },
    { "wait": 52 },
    { "wait": 80 },
    { "wait": 50 },
    { "wait": 61 },
    { "wait": 88 },
    { "wait": 82 },
    { "wait": 37 },
    { "wait": 64 },
    { "wait": 77 },
    { "wait": 83 },
    { "wait": 67 },
    { "wait": 69 },
    { "wait": 79 },
    { "wait": 61 },
    { "wait": 72 },
    { "wait": 69 },
    { "wait": 56 },
    { "wait": 86 },
    { "wait": 85 },
    { "wait": 87 },
    { "wait": 53 },
    { "wait": 59 },
    { "wait": 58 },
    { "wait": 80 },
    { "wait": 58 },
    { "wait": 85 },
    { "wait": 86 },
    { "wait": 77 },
    { "wait": 87 },
    { "wait": 84 },
    { "wait": 77 },
    { "wait": 74 },
    { "wait": 87 },
    { "wait": 61 },
    { "wait": 76 },
    { "wait": 63 },
    { "wait": 86 },
    { "wait": 55 },
    { "wait": 72 },
    { "wait": 77 },
    { "wait": 61 },
    { "wait": 59 },
    { "wait": 58 },
    { "wait": 77 },
    { "wait": 79 },
    { "wait": 83 },
    { "wait": 46 },
    { "wait": 84 },
    { "wait": 47 },
    { "wait": 74 },
    { "wait": 84 },
    { "wait": 77 },
    { "wait": 80 },
    { "wait": 59 },
    { "wait": 66 },
    { "wait": 47 },
    { "wait": 85 },
    { "wait": 75 },
    { "wait": 80 },
    { "wait": 73 },
    { "wait": 42 },
    { "wait": 85 },
    { "wait": 82 },
    { "wait": 58 },
    { "wait": 53 },
    { "wait": 83 },
    { "wait": 71 },
    { "wait": 85 },
    { "wait": 47 },
    { "wait": 82 },
    { "wait": 79 },
    { "wait": 74 },
    { "wait": 78 },
    { "wait": 59 },
    { "wait": 75 },
    { "wait": 45 },
    { "wait": 87 },
    { "wait": 87 },
    { "wait": 71 },
    { "wait": 45 },
    { "wait": 92 },
    { "wait": 57 },
    { "wait": 54 },
    { "wait": 81 },
    { "wait": 76 },
    { "wait": 61 },
    { "wait": 56 },
    { "wait": 74 },
    { "wait": 53 },
    { "wait": 67 },
    { "wait": 78 },
    { "wait": 56 },
    { "wait": 85 },
    { "wait": 79 },
    { "wait": 88 },
    { "wait": 80 },
    { "wait": 57 },
    { "wait": 75 },
    { "wait": 80 },
    { "wait": 61 },
    { "wait": 74 },
    { "wait": 83 },
    { "wait": 80 },
    { "wait": 79 },
    { "wait": 84 },
    { "wait": 72 },
    { "wait": 79 },
    { "wait": 94 },
    { "wait": 84 },
    { "wait": 81 },
    { "wait": 85 },
    { "wait": 92 },
    { "wait": 72 },
    { "wait": 55 },
    { "wait": 81 },
    { "wait": 87 },
    { "wait": 77 },
    { "wait": 83 },
    { "wait": 81 },
    { "wait": 79 },
    { "wait": 38 },
    { "wait": 78 },
    { "wait": 41 },
    { "wait": 70 },
    { "wait": 85 },
    { "wait": 73 },
    { "wait": 90 },
    { "wait": 82 },
    { "wait": 56 },
    { "wait": 82 },
    { "wait": 78 },
    { "wait": 93 },
    { "wait": 72 },
    { "wait": 69 },
    { "wait": 52 },
    { "wait": 80 },
    { "wait": 56 },
    { "wait": 56 },
    { "wait": 83 },
    { "wait": 76 },
    { "wait": 87 },
    { "wait": 68 },
    { "wait": 82 },
    { "wait": 84 },
    { "wait": 58 },
    { "wait": 89 },
    { "wait": 89 },
    { "wait": 88 },
    { "wait": 75 },
    { "wait": 80 },
    { "wait": 91 },
    { "wait": 71 },
    { "wait": 46 },
    { "wait": 88 },
    { "wait": 64 },
    { "wait": 59 },
    { "wait": 53 },
    { "wait": 51 },
    { "wait": 75 },
    { "wait": 79 },
    { "wait": 54 },
    { "wait": 76 },
    { "wait": 70 },
    { "wait": 50 },
    { "wait": 68 },
    { "wait": 58 },
    { "wait": 49 },
    { "wait": 76 },
    { "wait": 81 },
    { "wait": 81 },
    { "wait": 87 },
    { "wait": 85 },
    { "wait": 73 }
  ],
  "value": "wait",
  "bins": 20,
  "countLabel": "Eruptions",
  "format": "{value} min",
  "annotations": [{ "type": "band", "axis": "x", "from": 62, "to": 70, "label": "Rarely" }],
  "title": "Waiting time between Old Faithful eruptions",
  "subtitle": "Minutes between eruptions, 272 observations",
  "note": "Illustrative data modelled on the Old Faithful geyser dataset",
  "type": "histogram"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to bin. |
| `bins` | `number` |  | Approximate number of bins; the width is rounded to a tidy step. Default: from the row count. |
| `step` | `number` |  | Exact bin width in value units. Overrides `bins`. |
| `median` | `boolean` | `false` | Vertical marker at the median. |
| `mean` | `boolean` | `false` | Vertical marker at the mean. |
| `normalize` | `boolean` | `false` | Share of rows per bin instead of a count. |
| `countLabel` | `string` |  | Title for the count axis, e.g. "Runners". |

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
- Used by: `report-page` (template)

## Rules for this form

- Name the measure and its unit in `subtitle`.
- State how many observations the chart draws when the number is small.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/histogram.md
- Component reference with every example: https://insightcharts.dev/llms/histogram.md
- Registry item: https://insightcharts.dev/r/histogram.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/histogram.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/histogram#example-two-peaks
- These instructions as plain text: https://insightcharts.dev/agents/atoms/histogram/two-peaks.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
