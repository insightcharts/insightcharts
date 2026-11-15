# Reproduce the "Highlight one circle, click to select" example of the InsightCharts Bubble scale

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Highlight one circle, click to select" example of `bubble-scale` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Places circles sized by one measure along a single value scale set by another, spread sideways so none overlap, with boxed scale marks instead of an axis.

Use it when: A poster answer to "where does each one sit on this scale, and how big is it": 5 to about 40 named things with a rate or score (the scale) and a magnitude (the area), such as import dependency against share of demand.

Pick something else when: Two measures that should be read against each other on two axes (use scatter-chart); one measure only (use beeswarm-chart or strip-plot); precise comparison of the sizes (use bar-chart); more than about 60 rows (use beeswarm-chart).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `scatter-chart` https://insightcharts.dev/agents/atoms/scatter-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bubble-scale
```

The file lands at `components/insightcharts/atoms/bubble-scale.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BubbleScale } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "district": "Harbourside", "ring": "Inner", "carFree": 71, "thousand": 18 },
  { "district": "Old Town", "ring": "Inner", "carFree": 64, "thousand": 31 },
  { "district": "Canal Quarter", "ring": "Inner", "carFree": 58, "thousand": 22 }
]
```

How the example maps columns to props:

- `name` = `"district"`. Name field: one circle per row.
- `value` = `"carFree"`. Numeric field that positions each circle along the scale. Printed with `format`.
- `size` = `"thousand"`. Numeric field for circle area. Printed inside or beside each circle with `sizeFormat`.

With the user's data, keep the props and change the column names.

## 5. The "Highlight one circle, click to select" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BubbleScale } from "insightcharts";

const data = [
  { district: "Harbourside", ring: "Inner", carFree: 71, thousand: 18 },
  { district: "Old Town", ring: "Inner", carFree: 64, thousand: 31 },
  { district: "Canal Quarter", ring: "Inner", carFree: 58, thousand: 22 },
  { district: "Station Fields", ring: "Inner", carFree: 49, thousand: 12 },
  { district: "Marketgate", ring: "Inner", carFree: 44, thousand: 27 },
  { district: "Northmoor", ring: "Outer", carFree: 37, thousand: 46 },
  { district: "Eastcliff", ring: "Outer", carFree: 33, thousand: 39 },
  { district: "Larkhill", ring: "Outer", carFree: 29, thousand: 52 },
  { district: "Westbrook", ring: "Outer", carFree: 26, thousand: 34 },
  { district: "Fenside", ring: "Outer", carFree: 22, thousand: 61 },
  { district: "Quarry Hill", ring: "Outer", carFree: 19, thousand: 28 },
  { district: "Ashby Green", ring: "Suburb", carFree: 14, thousand: 44 },
  { district: "Thornley", ring: "Suburb", carFree: 12, thousand: 57 },
  { district: "Upper Wold", ring: "Suburb", carFree: 9, thousand: 36 },
  { district: "Millbank", ring: "Suburb", carFree: 8, thousand: 49 },
  { district: "St Agnes", ring: "Suburb", carFree: 6, thousand: 23 },
  { district: "Coldharbour", ring: "Suburb", carFree: 5, thousand: 15 },
];

<BubbleScale
  theme="blueprint"
  data={data}
  name="district"
  value="carFree"
  size="thousand"
  highlight="Fenside"
  select
  format="{value}%"
  sizeFormat="{value}k"
  scaleLabel="Without a car"
  title="22% of Fenside's households have no car"
  subtitle="Share of households without a car (position) and population in thousands (area), 17 districts"
  note="Illustrative figures for an invented city"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "data": [
    { "district": "Harbourside", "ring": "Inner", "carFree": 71, "thousand": 18 },
    { "district": "Old Town", "ring": "Inner", "carFree": 64, "thousand": 31 },
    { "district": "Canal Quarter", "ring": "Inner", "carFree": 58, "thousand": 22 },
    { "district": "Station Fields", "ring": "Inner", "carFree": 49, "thousand": 12 },
    { "district": "Marketgate", "ring": "Inner", "carFree": 44, "thousand": 27 },
    { "district": "Northmoor", "ring": "Outer", "carFree": 37, "thousand": 46 },
    { "district": "Eastcliff", "ring": "Outer", "carFree": 33, "thousand": 39 },
    { "district": "Larkhill", "ring": "Outer", "carFree": 29, "thousand": 52 },
    { "district": "Westbrook", "ring": "Outer", "carFree": 26, "thousand": 34 },
    { "district": "Fenside", "ring": "Outer", "carFree": 22, "thousand": 61 },
    { "district": "Quarry Hill", "ring": "Outer", "carFree": 19, "thousand": 28 },
    { "district": "Ashby Green", "ring": "Suburb", "carFree": 14, "thousand": 44 },
    { "district": "Thornley", "ring": "Suburb", "carFree": 12, "thousand": 57 },
    { "district": "Upper Wold", "ring": "Suburb", "carFree": 9, "thousand": 36 },
    { "district": "Millbank", "ring": "Suburb", "carFree": 8, "thousand": 49 },
    { "district": "St Agnes", "ring": "Suburb", "carFree": 6, "thousand": 23 },
    { "district": "Coldharbour", "ring": "Suburb", "carFree": 5, "thousand": 15 }
  ],
  "name": "district",
  "value": "carFree",
  "size": "thousand",
  "highlight": "Fenside",
  "select": true,
  "format": "{value}%",
  "sizeFormat": "{value}k",
  "scaleLabel": "Without a car",
  "title": "22% of Fenside's households have no car",
  "subtitle": "Share of households without a car (position) and population in thousands (area), 17 districts",
  "note": "Illustrative figures for an invented city",
  "type": "bubble-scale"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one circle per row. |
| `value` (required) | `string` |  | Numeric field that positions each circle along the scale. Printed with `format`. |
| `size` (required) | `string` |  | Numeric field for circle area. Printed inside or beside each circle with `sizeFormat`. |
| `series` | `string` |  | Field that colours circles by category. Default: circles are shaded along the scale with the sequential ramp. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Direction of the scale. Narrow containers always use vertical. |
| `domain` | `[number, number]` |  | Scale range. Default: the data extent rounded out to the tick step. |
| `ticks` | `number[]` |  | Values to mark on the scale. Default: about five round values. |
| `scaleLabel` | `string` |  | Short name of the scale measure, printed at the head of the scale. |
| `sizeFormat` | `FormatSpec` |  | How to print the size measure. |
| `guides` | `boolean` | `true` | Thin dotted guide line at each scale mark. |
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
- Used by: `flow-poster` (template)

## Rules for this form

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/bubble-scale.md
- Component reference with every example: https://insightcharts.dev/llms/bubble-scale.md
- Registry item: https://insightcharts.dev/r/bubble-scale.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bubble-scale.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/bubble-scale#example-highlight-one-circle-click-to-select
- These instructions as plain text: https://insightcharts.dev/agents/atoms/bubble-scale/highlight-one-circle-click-to-select.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
