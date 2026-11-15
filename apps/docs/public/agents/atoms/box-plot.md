# Build a Box plot with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Box plot (`box-plot`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.

Use it when: Comparing the centre and spread of a numeric value across several groups, especially with many rows per group and an audience comfortable with quartiles.

Pick something else when: A general audience or fewer than about 20 rows per group (use strip-plot or beeswarm-chart, which show the observations themselves); one group whose shape matters, such as two peaks, which a box hides (use histogram).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/box-plot
```

The file lands at `components/insightcharts/atoms/box-plot.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BoxPlot } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "department": "Emergency", "minutes": 12 },
  { "department": "Emergency", "minutes": 18 },
  { "department": "Emergency", "minutes": 22 }
]
```

How the example maps columns to props:

- `value` = `"minutes"`. Numeric field to summarise. Pass raw rows; quartiles are computed in the chart.
- `group` = `"department"`. Category field: one box per distinct value. Omit for a single box.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { department: "Emergency", minutes: 12 },
  { department: "Emergency", minutes: 18 },
  { department: "Emergency", minutes: 22 },
  { department: "Emergency", minutes: 25 },
  { department: "Emergency", minutes: 27 },
  { department: "Emergency", minutes: 31 },
  { department: "Emergency", minutes: 34 },
  { department: "Emergency", minutes: 38 },
  { department: "Emergency", minutes: 41 },
  { department: "Emergency", minutes: 44 },
  { department: "Emergency", minutes: 47 },
  { department: "Emergency", minutes: 52 },
  { department: "Emergency", minutes: 58 },
  { department: "Emergency", minutes: 63 },
  { department: "Emergency", minutes: 71 },
  { department: "Emergency", minutes: 84 },
  { department: "Emergency", minutes: 96 },
  { department: "Emergency", minutes: 131 },
  { department: "Emergency", minutes: 188 },
  { department: "Orthopaedics", minutes: 9 },
  { department: "Orthopaedics", minutes: 11 },
  { department: "Orthopaedics", minutes: 14 },
  { department: "Orthopaedics", minutes: 15 },
  { department: "Orthopaedics", minutes: 17 },
  { department: "Orthopaedics", minutes: 19 },
  { department: "Orthopaedics", minutes: 20 },
  { department: "Orthopaedics", minutes: 22 },
  { department: "Orthopaedics", minutes: 24 },
  { department: "Orthopaedics", minutes: 25 },
  { department: "Orthopaedics", minutes: 27 },
  { department: "Orthopaedics", minutes: 29 },
  { department: "Orthopaedics", minutes: 31 },
  { department: "Orthopaedics", minutes: 34 },
  { department: "Orthopaedics", minutes: 38 },
  { department: "Orthopaedics", minutes: 43 },
  { department: "Orthopaedics", minutes: 55 },
  { department: "Cardiology", minutes: 6 },
  { department: "Cardiology", minutes: 8 },
  { department: "Cardiology", minutes: 9 },
  { department: "Cardiology", minutes: 11 },
  { department: "Cardiology", minutes: 12 },
  { department: "Cardiology", minutes: 13 },
  { department: "Cardiology", minutes: 15 },
  { department: "Cardiology", minutes: 16 },
  { department: "Cardiology", minutes: 17 },
  { department: "Cardiology", minutes: 18 },
  { department: "Cardiology", minutes: 20 },
  { department: "Cardiology", minutes: 21 },
  { department: "Cardiology", minutes: 23 },
  { department: "Cardiology", minutes: 26 },
  { department: "Cardiology", minutes: 28 },
  { department: "Cardiology", minutes: 33 },
  { department: "Cardiology", minutes: 61 },
  { department: "Paediatrics", minutes: 4 },
  { department: "Paediatrics", minutes: 5 },
  { department: "Paediatrics", minutes: 7 },
  { department: "Paediatrics", minutes: 8 },
  { department: "Paediatrics", minutes: 9 },
  { department: "Paediatrics", minutes: 10 },
  { department: "Paediatrics", minutes: 11 },
  { department: "Paediatrics", minutes: 12 },
  { department: "Paediatrics", minutes: 12 },
  { department: "Paediatrics", minutes: 13 },
  { department: "Paediatrics", minutes: 14 },
  { department: "Paediatrics", minutes: 16 },
  { department: "Paediatrics", minutes: 17 },
  { department: "Paediatrics", minutes: 19 },
  { department: "Paediatrics", minutes: 22 },
  { department: "Paediatrics", minutes: 24 },
  { department: "Dermatology", minutes: 3 },
  { department: "Dermatology", minutes: 4 },
  { department: "Dermatology", minutes: 5 },
  { department: "Dermatology", minutes: 6 },
  { department: "Dermatology", minutes: 6 },
  { department: "Dermatology", minutes: 7 },
  { department: "Dermatology", minutes: 8 },
  { department: "Dermatology", minutes: 9 },
  { department: "Dermatology", minutes: 9 },
  { department: "Dermatology", minutes: 10 },
  { department: "Dermatology", minutes: 11 },
  { department: "Dermatology", minutes: 12 },
  { department: "Dermatology", minutes: 13 },
  { department: "Dermatology", minutes: 15 },
  { department: "Dermatology", minutes: 18 },
  { department: "Dermatology", minutes: 35 },
];

<BoxPlot
  data={data}
  value="minutes"
  group="department"
  highlight="Emergency"
  format="{value} min"
  title="The median emergency wait was 44 minutes"
  subtitle="Minutes from arrival to being seen, sampled visits by department"
  note="Illustrative data. Box: middle half of visits; line: median; whiskers: within 1.5 × IQR; dots: outliers."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "box-plot",
  "data": [
    { "department": "Emergency", "minutes": 12 },
    { "department": "Emergency", "minutes": 18 },
    { "department": "Emergency", "minutes": 22 },
    { "department": "Emergency", "minutes": 25 },
    { "department": "Emergency", "minutes": 27 },
    { "department": "Emergency", "minutes": 31 },
    { "department": "Emergency", "minutes": 34 },
    { "department": "Emergency", "minutes": 38 },
    { "department": "Emergency", "minutes": 41 },
    { "department": "Emergency", "minutes": 44 },
    { "department": "Emergency", "minutes": 47 },
    { "department": "Emergency", "minutes": 52 },
    { "department": "Emergency", "minutes": 58 },
    { "department": "Emergency", "minutes": 63 },
    { "department": "Emergency", "minutes": 71 },
    { "department": "Emergency", "minutes": 84 },
    { "department": "Emergency", "minutes": 96 },
    { "department": "Emergency", "minutes": 131 },
    { "department": "Emergency", "minutes": 188 },
    { "department": "Orthopaedics", "minutes": 9 },
    { "department": "Orthopaedics", "minutes": 11 },
    { "department": "Orthopaedics", "minutes": 14 },
    { "department": "Orthopaedics", "minutes": 15 },
    { "department": "Orthopaedics", "minutes": 17 },
    { "department": "Orthopaedics", "minutes": 19 },
    { "department": "Orthopaedics", "minutes": 20 },
    { "department": "Orthopaedics", "minutes": 22 },
    { "department": "Orthopaedics", "minutes": 24 },
    { "department": "Orthopaedics", "minutes": 25 },
    { "department": "Orthopaedics", "minutes": 27 },
    { "department": "Orthopaedics", "minutes": 29 },
    { "department": "Orthopaedics", "minutes": 31 },
    { "department": "Orthopaedics", "minutes": 34 },
    { "department": "Orthopaedics", "minutes": 38 },
    { "department": "Orthopaedics", "minutes": 43 },
    { "department": "Orthopaedics", "minutes": 55 },
    { "department": "Cardiology", "minutes": 6 },
    { "department": "Cardiology", "minutes": 8 },
    { "department": "Cardiology", "minutes": 9 },
    { "department": "Cardiology", "minutes": 11 },
    { "department": "Cardiology", "minutes": 12 },
    { "department": "Cardiology", "minutes": 13 },
    { "department": "Cardiology", "minutes": 15 },
    { "department": "Cardiology", "minutes": 16 },
    { "department": "Cardiology", "minutes": 17 },
    { "department": "Cardiology", "minutes": 18 },
    { "department": "Cardiology", "minutes": 20 },
    { "department": "Cardiology", "minutes": 21 },
    { "department": "Cardiology", "minutes": 23 },
    { "department": "Cardiology", "minutes": 26 },
    { "department": "Cardiology", "minutes": 28 },
    { "department": "Cardiology", "minutes": 33 },
    { "department": "Cardiology", "minutes": 61 },
    { "department": "Paediatrics", "minutes": 4 },
    { "department": "Paediatrics", "minutes": 5 },
    { "department": "Paediatrics", "minutes": 7 },
    { "department": "Paediatrics", "minutes": 8 },
    { "department": "Paediatrics", "minutes": 9 },
    { "department": "Paediatrics", "minutes": 10 },
    { "department": "Paediatrics", "minutes": 11 },
    { "department": "Paediatrics", "minutes": 12 },
    { "department": "Paediatrics", "minutes": 12 },
    { "department": "Paediatrics", "minutes": 13 },
    { "department": "Paediatrics", "minutes": 14 },
    { "department": "Paediatrics", "minutes": 16 },
    { "department": "Paediatrics", "minutes": 17 },
    { "department": "Paediatrics", "minutes": 19 },
    { "department": "Paediatrics", "minutes": 22 },
    { "department": "Paediatrics", "minutes": 24 },
    { "department": "Dermatology", "minutes": 3 },
    { "department": "Dermatology", "minutes": 4 },
    { "department": "Dermatology", "minutes": 5 },
    { "department": "Dermatology", "minutes": 6 },
    { "department": "Dermatology", "minutes": 6 },
    { "department": "Dermatology", "minutes": 7 },
    { "department": "Dermatology", "minutes": 8 },
    { "department": "Dermatology", "minutes": 9 },
    { "department": "Dermatology", "minutes": 9 },
    { "department": "Dermatology", "minutes": 10 },
    { "department": "Dermatology", "minutes": 11 },
    { "department": "Dermatology", "minutes": 12 },
    { "department": "Dermatology", "minutes": 13 },
    { "department": "Dermatology", "minutes": 15 },
    { "department": "Dermatology", "minutes": 18 },
    { "department": "Dermatology", "minutes": 35 }
  ],
  "value": "minutes",
  "group": "department",
  "highlight": "Emergency",
  "format": "{value} min",
  "title": "The median emergency wait was 44 minutes",
  "subtitle": "Minutes from arrival to being seen, sampled visits by department",
  "note": "Illustrative data. Box: middle half of visits; line: median; whiskers: within 1.5 × IQR; dots: outliers."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to summarise. Pass raw rows; quartiles are computed in the chart. |
| `group` | `string` |  | Category field: one box per distinct value. Omit for a single box. |
| `label` | `string` |  | Field naming each row, shown when hovering an outlier. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal leaves room for long names; vertical suits ordered categories. |
| `whiskers` | `"tukey" \| "minmax"` | `"tukey"` | `tukey`: furthest point within 1.5 × IQR, the rest drawn as outliers. `minmax`: the extremes. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order boxes by median. |

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

- Component reference with every example: https://insightcharts.dev/llms/box-plot.md
- Registry item: https://insightcharts.dev/r/box-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/box-plot.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/box-plot
- These instructions as plain text: https://insightcharts.dev/agents/atoms/box-plot.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
