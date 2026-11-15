# Build a Heatmap with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Heatmap (`heatmap`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

Colours a category-by-category (or time-by-category) grid by a numeric value, using a sequential or diverging scale.

Use it when: Finding patterns across two dimensions at once: hour by weekday, cohort by month, product by region. Good when there are too many series for lines or bars and the overall pattern matters more than exact values.

Pick something else when: Precise comparison of a few values (use bar-chart); a single series over time (use line-chart); a daily value across a year (use calendar-heatmap).

Instructions for the alternatives: `calendar-heatmap` https://insightcharts.dev/agents/atoms/calendar-heatmap.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/heatmap
```

The file lands at `components/insightcharts/atoms/heatmap.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Heatmap } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "day": "Mon", "slot": "6am", "orders": 12 },
  { "day": "Mon", "slot": "9am", "orders": 48 },
  { "day": "Mon", "slot": "12pm", "orders": 61 }
]
```

How the example maps columns to props:

- `x` = `"slot"`. Column field: a category or a date.
- `y` = `"day"`. Row field.
- `value` = `"orders"`. Numeric field that colours each cell. One data row per cell.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { day: "Mon", slot: "6am", orders: 12 },
  { day: "Mon", slot: "9am", orders: 48 },
  { day: "Mon", slot: "12pm", orders: 61 },
  { day: "Mon", slot: "3pm", orders: 55 },
  { day: "Mon", slot: "6pm", orders: 38 },
  { day: "Mon", slot: "9pm", orders: 14 },
  { day: "Tue", slot: "6am", orders: 11 },
  { day: "Tue", slot: "9am", orders: 52 },
  { day: "Tue", slot: "12pm", orders: 66 },
  { day: "Tue", slot: "3pm", orders: 58 },
  { day: "Tue", slot: "6pm", orders: 41 },
  { day: "Tue", slot: "9pm", orders: 15 },
  { day: "Wed", slot: "6am", orders: 13 },
  { day: "Wed", slot: "9am", orders: 55 },
  { day: "Wed", slot: "12pm", orders: 70 },
  { day: "Wed", slot: "3pm", orders: 63 },
  { day: "Wed", slot: "6pm", orders: 44 },
  { day: "Wed", slot: "9pm", orders: 17 },
  { day: "Thu", slot: "6am", orders: 12 },
  { day: "Thu", slot: "9am", orders: 51 },
  { day: "Thu", slot: "12pm", orders: 68 },
  { day: "Thu", slot: "3pm", orders: 60 },
  { day: "Thu", slot: "6pm", orders: 47 },
  { day: "Thu", slot: "9pm", orders: 22 },
  { day: "Fri", slot: "6am", orders: 10 },
  { day: "Fri", slot: "9am", orders: 44 },
  { day: "Fri", slot: "12pm", orders: 59 },
  { day: "Fri", slot: "3pm", orders: 49 },
  { day: "Fri", slot: "6pm", orders: 52 },
  { day: "Fri", slot: "9pm", orders: 35 },
  { day: "Sat", slot: "6am", orders: 6 },
  { day: "Sat", slot: "9am", orders: 18 },
  { day: "Sat", slot: "12pm", orders: 31 },
  { day: "Sat", slot: "3pm", orders: 36 },
  { day: "Sat", slot: "6pm", orders: 40 },
  { day: "Sat", slot: "9pm", orders: 38 },
  { day: "Sun", slot: "6am", orders: 5 },
  { day: "Sun", slot: "9am", orders: 14 },
  { day: "Sun", slot: "12pm", orders: 26 },
  { day: "Sun", slot: "3pm", orders: 30 },
  { day: "Sun", slot: "6pm", orders: 28 },
  { day: "Sun", slot: "9pm", orders: 19 },
];

<Heatmap
  theme="dusk"
  data={data}
  x="slot"
  y="day"
  value="orders"
  title="Orders peak at 70 per hour at 12pm on Wednesdays"
  subtitle="Average orders per hour by weekday and time of day"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "heatmap",
  "theme": "dusk",
  "data": [
    { "day": "Mon", "slot": "6am", "orders": 12 },
    { "day": "Mon", "slot": "9am", "orders": 48 },
    { "day": "Mon", "slot": "12pm", "orders": 61 },
    { "day": "Mon", "slot": "3pm", "orders": 55 },
    { "day": "Mon", "slot": "6pm", "orders": 38 },
    { "day": "Mon", "slot": "9pm", "orders": 14 },
    { "day": "Tue", "slot": "6am", "orders": 11 },
    { "day": "Tue", "slot": "9am", "orders": 52 },
    { "day": "Tue", "slot": "12pm", "orders": 66 },
    { "day": "Tue", "slot": "3pm", "orders": 58 },
    { "day": "Tue", "slot": "6pm", "orders": 41 },
    { "day": "Tue", "slot": "9pm", "orders": 15 },
    { "day": "Wed", "slot": "6am", "orders": 13 },
    { "day": "Wed", "slot": "9am", "orders": 55 },
    { "day": "Wed", "slot": "12pm", "orders": 70 },
    { "day": "Wed", "slot": "3pm", "orders": 63 },
    { "day": "Wed", "slot": "6pm", "orders": 44 },
    { "day": "Wed", "slot": "9pm", "orders": 17 },
    { "day": "Thu", "slot": "6am", "orders": 12 },
    { "day": "Thu", "slot": "9am", "orders": 51 },
    { "day": "Thu", "slot": "12pm", "orders": 68 },
    { "day": "Thu", "slot": "3pm", "orders": 60 },
    { "day": "Thu", "slot": "6pm", "orders": 47 },
    { "day": "Thu", "slot": "9pm", "orders": 22 },
    { "day": "Fri", "slot": "6am", "orders": 10 },
    { "day": "Fri", "slot": "9am", "orders": 44 },
    { "day": "Fri", "slot": "12pm", "orders": 59 },
    { "day": "Fri", "slot": "3pm", "orders": 49 },
    { "day": "Fri", "slot": "6pm", "orders": 52 },
    { "day": "Fri", "slot": "9pm", "orders": 35 },
    { "day": "Sat", "slot": "6am", "orders": 6 },
    { "day": "Sat", "slot": "9am", "orders": 18 },
    { "day": "Sat", "slot": "12pm", "orders": 31 },
    { "day": "Sat", "slot": "3pm", "orders": 36 },
    { "day": "Sat", "slot": "6pm", "orders": 40 },
    { "day": "Sat", "slot": "9pm", "orders": 38 },
    { "day": "Sun", "slot": "6am", "orders": 5 },
    { "day": "Sun", "slot": "9am", "orders": 14 },
    { "day": "Sun", "slot": "12pm", "orders": 26 },
    { "day": "Sun", "slot": "3pm", "orders": 30 },
    { "day": "Sun", "slot": "6pm", "orders": 28 },
    { "day": "Sun", "slot": "9pm", "orders": 19 }
  ],
  "x": "slot",
  "y": "day",
  "value": "orders",
  "title": "Orders peak at 70 per hour at 12pm on Wednesdays",
  "subtitle": "Average orders per hour by weekday and time of day",
  "note": "Illustrative data"
}
```

This example sets `theme="dusk"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Column field: a category or a date. |
| `y` (required) | `string` |  | Row field. |
| `value` (required) | `string` |  | Numeric field that colours each cell. One data row per cell. |
| `diverging` | `boolean` | `false` | Diverging palette centred on `midpoint`, for values with a meaningful middle. |
| `midpoint` | `number` | `0` | Centre of the diverging scale. |
| `labels` | `boolean` |  | Print the value in each cell. Default: on when cells are large enough. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order rows by their total. |
| `domain` | `[number, number]` |  | Fix the ends of the colour scale. |

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
- Used by: `executive-brief` (template), `visual-essay` (template)

## Rules for this form

- Anything drawn as a bar encodes its value by length, so it starts at zero. Do not cut its axis.
- Sort by value unless the categories have an order of their own (time, age bands, a scale).
- Keep the categories to the number the reader can compare. Fold the rest into "Other" with the `top` transform (`{ type: "top", n, by, other: "Other", label }`).
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

- Component reference with every example: https://insightcharts.dev/llms/heatmap.md
- Registry item: https://insightcharts.dev/r/heatmap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/heatmap.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/heatmap
- These instructions as plain text: https://insightcharts.dev/agents/atoms/heatmap.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
