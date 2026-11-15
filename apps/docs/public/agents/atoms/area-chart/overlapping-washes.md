# Reproduce the "Overlapping washes" example of the InsightCharts Area chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Overlapping washes" example of `area-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Shows a quantity over time as a filled area from zero: one series, stacked series, shares of 100%, or a streamgraph.

Use it when: A volume or cumulative quantity over time where the filled magnitude matters; stacked when the total and its composition both matter; percent when only the mix matters; stream for the changing mix of many series over a long period.

Pick something else when: Comparing the trajectories of several series against each other (use line-chart: only the bottom band of a stack has a flat baseline); a few time points (use bar-chart with stack); more than about 6 bands.

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
npx shadcn@latest add @insightcharts/area-chart
```

The file lands at `components/insightcharts/atoms/area-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { AreaChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "2023": 41, "2024": 52, "month": "Jan" },
  { "2023": 44, "2024": 55, "month": "Feb" },
  { "2023": 58, "2024": 71, "month": "Mar" }
]
```

How the example maps columns to props:

- `x` = `"month"`. Time or ordered category field. ISO dates are placed on a true time axis.
- `y` = `["2023","2024"]`. Value field, or several (one area each).

With the user's data, keep the props and change the column names.

## 5. The "Overlapping washes" example

This example sets `theme="noir"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { "2023": 41, "2024": 52, month: "Jan" },
  { "2023": 44, "2024": 55, month: "Feb" },
  { "2023": 58, "2024": 71, month: "Mar" },
  { "2023": 73, "2024": 80, month: "Apr" },
  { "2023": 96, "2024": 104, month: "May" },
  { "2023": 118, "2024": 131, month: "Jun" },
  { "2023": 134, "2024": 152, month: "Jul" },
  { "2023": 129, "2024": 147, month: "Aug" },
  { "2023": 98, "2024": 117, month: "Sep" },
  { "2023": 70, "2024": 84, month: "Oct" },
  { "2023": 49, "2024": 58, month: "Nov" },
  { "2023": 43, "2024": 50, month: "Dec" },
];

<AreaChart
  theme="noir"
  data={data}
  x="month"
  y={["2023", "2024"]}
  curve="smooth"
  format="{value}k"
  title="July bike-share trips rose from 134,000 in 2023 to 152,000 in 2024"
  subtitle="Bike-share trips per month, thousands"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "noir",
  "data": [
    { "2023": 41, "2024": 52, "month": "Jan" },
    { "2023": 44, "2024": 55, "month": "Feb" },
    { "2023": 58, "2024": 71, "month": "Mar" },
    { "2023": 73, "2024": 80, "month": "Apr" },
    { "2023": 96, "2024": 104, "month": "May" },
    { "2023": 118, "2024": 131, "month": "Jun" },
    { "2023": 134, "2024": 152, "month": "Jul" },
    { "2023": 129, "2024": 147, "month": "Aug" },
    { "2023": 98, "2024": 117, "month": "Sep" },
    { "2023": 70, "2024": 84, "month": "Oct" },
    { "2023": 49, "2024": 58, "month": "Nov" },
    { "2023": 43, "2024": 50, "month": "Dec" }
  ],
  "x": "month",
  "y": ["2023", "2024"],
  "curve": "smooth",
  "format": "{value}k",
  "title": "July bike-share trips rose from 134,000 in 2023 to 152,000 in 2024",
  "subtitle": "Bike-share trips per month, thousands",
  "note": "Illustrative data",
  "type": "area-chart"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Time or ordered category field. ISO dates are placed on a true time axis. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one area each). |
| `series` | `string` |  | Field that splits rows into areas (long data). |
| `stack` | `boolean \| "percent"` | `false` | Stack the areas; `percent` normalises every x position to 100%. |
| `stream` | `boolean` | `false` | Streamgraph: stack around a centred baseline. The value axis is dropped because only band thickness is readable. |
| `curve` | `"linear" \| "smooth" \| "step"` | `"linear"` | Edge shape. A streamgraph defaults to smooth. |
| `labels` | `boolean` |  | Name each band inside itself where it fits; the rest go to the legend. Default: on when stacked. |
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
- Used by: `section` (molecule), `atlas-poster` (template), `social-card` (template)

## Rules for this form

- Areas start at zero. With `stack: "percent"` the areas are shares of 100%.
- Keep the periods in chronological order.
- A line encodes by position and may use an axis that does not start at zero. A filled area encodes by area and starts at zero.
- If you rebase to an index or use a log scale, say so in `subtitle`.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/area-chart.md
- Component reference with every example: https://insightcharts.dev/llms/area-chart.md
- Registry item: https://insightcharts.dev/r/area-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/area-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/area-chart#example-overlapping-washes
- These instructions as plain text: https://insightcharts.dev/agents/atoms/area-chart/overlapping-washes.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
