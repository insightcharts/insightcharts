# Reproduce the "Diverging around zero" example of the InsightCharts Heatmap

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Diverging around zero" example of `heatmap` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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
  { "region": "Arctic", "decade": "1900s", "anomaly": -1.51 },
  { "region": "Arctic", "decade": "1910s", "anomaly": -1.14 },
  { "region": "Arctic", "decade": "1920s", "anomaly": -0.92 }
]
```

How the example maps columns to props:

- `x` = `"decade"`. Column field: a category or a date.
- `y` = `"region"`. Row field.
- `value` = `"anomaly"`. Numeric field that colours each cell. One data row per cell.

With the user's data, keep the props and change the column names.

## 5. The "Diverging around zero" example

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { region: "Arctic", decade: "1900s", anomaly: -1.51 },
  { region: "Arctic", decade: "1910s", anomaly: -1.14 },
  { region: "Arctic", decade: "1920s", anomaly: -0.92 },
  { region: "Arctic", decade: "1930s", anomaly: -0.94 },
  { region: "Arctic", decade: "1940s", anomaly: -0.45 },
  { region: "Arctic", decade: "1950s", anomaly: 0.02 },
  { region: "Arctic", decade: "1960s", anomaly: 0.02 },
  { region: "Arctic", decade: "1970s", anomaly: 0.47 },
  { region: "Arctic", decade: "1980s", anomaly: 0.85 },
  { region: "Arctic", decade: "1990s", anomaly: 1.46 },
  { region: "Arctic", decade: "2000s", anomaly: 1.67 },
  { region: "Arctic", decade: "2010s", anomaly: 2.44 },
  { region: "Northern Europe", decade: "1900s", anomaly: -1.07 },
  { region: "Northern Europe", decade: "1910s", anomaly: -0.61 },
  { region: "Northern Europe", decade: "1920s", anomaly: -0.42 },
  { region: "Northern Europe", decade: "1930s", anomaly: -0.36 },
  { region: "Northern Europe", decade: "1940s", anomaly: -0.22 },
  { region: "Northern Europe", decade: "1950s", anomaly: -0.27 },
  { region: "Northern Europe", decade: "1960s", anomaly: -0.12 },
  { region: "Northern Europe", decade: "1970s", anomaly: 0.14 },
  { region: "Northern Europe", decade: "1980s", anomaly: 0.59 },
  { region: "Northern Europe", decade: "1990s", anomaly: 0.71 },
  { region: "Northern Europe", decade: "2000s", anomaly: 1.38 },
  { region: "Northern Europe", decade: "2010s", anomaly: 1.72 },
  { region: "Mediterranean", decade: "1900s", anomaly: -0.91 },
  { region: "Mediterranean", decade: "1910s", anomaly: -0.7 },
  { region: "Mediterranean", decade: "1920s", anomaly: -0.43 },
  { region: "Mediterranean", decade: "1930s", anomaly: -0.34 },
  { region: "Mediterranean", decade: "1940s", anomaly: -0.29 },
  { region: "Mediterranean", decade: "1950s", anomaly: 0.01 },
  { region: "Mediterranean", decade: "1960s", anomaly: 0.27 },
  { region: "Mediterranean", decade: "1970s", anomaly: 0.35 },
  { region: "Mediterranean", decade: "1980s", anomaly: 0.35 },
  { region: "Mediterranean", decade: "1990s", anomaly: 1.04 },
  { region: "Mediterranean", decade: "2000s", anomaly: 1.44 },
  { region: "Mediterranean", decade: "2010s", anomaly: 1.71 },
  { region: "Sahel", decade: "1900s", anomaly: -0.62 },
  { region: "Sahel", decade: "1910s", anomaly: -0.73 },
  { region: "Sahel", decade: "1920s", anomaly: -0.47 },
  { region: "Sahel", decade: "1930s", anomaly: -0.43 },
  { region: "Sahel", decade: "1940s", anomaly: -0.17 },
  { region: "Sahel", decade: "1950s", anomaly: 0.11 },
  { region: "Sahel", decade: "1960s", anomaly: -0.11 },
  { region: "Sahel", decade: "1970s", anomaly: 0.39 },
  { region: "Sahel", decade: "1980s", anomaly: 0.49 },
  { region: "Sahel", decade: "1990s", anomaly: 0.88 },
  { region: "Sahel", decade: "2000s", anomaly: 1.09 },
  { region: "Sahel", decade: "2010s", anomaly: 1.6 },
  { region: "Central Asia", decade: "1900s", anomaly: -0.72 },
  { region: "Central Asia", decade: "1910s", anomaly: -0.65 },
  { region: "Central Asia", decade: "1920s", anomaly: -0.63 },
  { region: "Central Asia", decade: "1930s", anomaly: -0.36 },
  { region: "Central Asia", decade: "1940s", anomaly: -0.39 },
  { region: "Central Asia", decade: "1950s", anomaly: 0.01 },
  { region: "Central Asia", decade: "1960s", anomaly: 0.06 },
  { region: "Central Asia", decade: "1970s", anomaly: 0.07 },
  { region: "Central Asia", decade: "1980s", anomaly: 0.26 },
  { region: "Central Asia", decade: "1990s", anomaly: 0.81 },
  { region: "Central Asia", decade: "2000s", anomaly: 1.16 },
  { region: "Central Asia", decade: "2010s", anomaly: 1.6 },
  { region: "South-East Asia", decade: "1900s", anomaly: -0.53 },
  { region: "South-East Asia", decade: "1910s", anomaly: -0.4 },
  { region: "South-East Asia", decade: "1920s", anomaly: -0.25 },
  { region: "South-East Asia", decade: "1930s", anomaly: -0.05 },
  { region: "South-East Asia", decade: "1940s", anomaly: -0.4 },
  { region: "South-East Asia", decade: "1950s", anomaly: -0.03 },
  { region: "South-East Asia", decade: "1960s", anomaly: 0.18 },
  { region: "South-East Asia", decade: "1970s", anomaly: 0.42 },
  { region: "South-East Asia", decade: "1980s", anomaly: 0.49 },
  { region: "South-East Asia", decade: "1990s", anomaly: 0.46 },
  { region: "South-East Asia", decade: "2000s", anomaly: 0.81 },
  { region: "South-East Asia", decade: "2010s", anomaly: 1.17 },
  { region: "Amazon basin", decade: "1900s", anomaly: -0.51 },
  { region: "Amazon basin", decade: "1910s", anomaly: -0.37 },
  { region: "Amazon basin", decade: "1920s", anomaly: -0.32 },
  { region: "Amazon basin", decade: "1930s", anomaly: -0.18 },
  { region: "Amazon basin", decade: "1940s", anomaly: -0.25 },
  { region: "Amazon basin", decade: "1950s", anomaly: 0.17 },
  { region: "Amazon basin", decade: "1960s", anomaly: 0.23 },
  { region: "Amazon basin", decade: "1970s", anomaly: 0.42 },
  { region: "Amazon basin", decade: "1980s", anomaly: 0.16 },
  { region: "Amazon basin", decade: "1990s", anomaly: 0.66 },
  { region: "Amazon basin", decade: "2000s", anomaly: 0.82 },
  { region: "Amazon basin", decade: "2010s", anomaly: 1.42 },
  { region: "Southern Ocean", decade: "1900s", anomaly: -0.67 },
  { region: "Southern Ocean", decade: "1910s", anomaly: -0.37 },
  { region: "Southern Ocean", decade: "1920s", anomaly: -0.48 },
  { region: "Southern Ocean", decade: "1930s", anomaly: -0.3 },
  { region: "Southern Ocean", decade: "1940s", anomaly: 0 },
  { region: "Southern Ocean", decade: "1950s", anomaly: -0.3 },
  { region: "Southern Ocean", decade: "1960s", anomaly: 0.02 },
  { region: "Southern Ocean", decade: "1970s", anomaly: 0.18 },
  { region: "Southern Ocean", decade: "1980s", anomaly: 0.07 },
  { region: "Southern Ocean", decade: "1990s", anomaly: 0.72 },
  { region: "Southern Ocean", decade: "2000s", anomaly: 1.17 },
  { region: "Southern Ocean", decade: "2010s", anomaly: 1.64 },
];

<Heatmap
  theme="science"
  data={data}
  x="decade"
  y="region"
  value="anomaly"
  diverging
  format="signed"
  title="Temperature anomaly by region and decade, 1900s to 2010s"
  subtitle="Difference from the 20th-century mean, °C"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "science",
  "data": [
    { "region": "Arctic", "decade": "1900s", "anomaly": -1.51 },
    { "region": "Arctic", "decade": "1910s", "anomaly": -1.14 },
    { "region": "Arctic", "decade": "1920s", "anomaly": -0.92 },
    { "region": "Arctic", "decade": "1930s", "anomaly": -0.94 },
    { "region": "Arctic", "decade": "1940s", "anomaly": -0.45 },
    { "region": "Arctic", "decade": "1950s", "anomaly": 0.02 },
    { "region": "Arctic", "decade": "1960s", "anomaly": 0.02 },
    { "region": "Arctic", "decade": "1970s", "anomaly": 0.47 },
    { "region": "Arctic", "decade": "1980s", "anomaly": 0.85 },
    { "region": "Arctic", "decade": "1990s", "anomaly": 1.46 },
    { "region": "Arctic", "decade": "2000s", "anomaly": 1.67 },
    { "region": "Arctic", "decade": "2010s", "anomaly": 2.44 },
    { "region": "Northern Europe", "decade": "1900s", "anomaly": -1.07 },
    { "region": "Northern Europe", "decade": "1910s", "anomaly": -0.61 },
    { "region": "Northern Europe", "decade": "1920s", "anomaly": -0.42 },
    { "region": "Northern Europe", "decade": "1930s", "anomaly": -0.36 },
    { "region": "Northern Europe", "decade": "1940s", "anomaly": -0.22 },
    { "region": "Northern Europe", "decade": "1950s", "anomaly": -0.27 },
    { "region": "Northern Europe", "decade": "1960s", "anomaly": -0.12 },
    { "region": "Northern Europe", "decade": "1970s", "anomaly": 0.14 },
    { "region": "Northern Europe", "decade": "1980s", "anomaly": 0.59 },
    { "region": "Northern Europe", "decade": "1990s", "anomaly": 0.71 },
    { "region": "Northern Europe", "decade": "2000s", "anomaly": 1.38 },
    { "region": "Northern Europe", "decade": "2010s", "anomaly": 1.72 },
    { "region": "Mediterranean", "decade": "1900s", "anomaly": -0.91 },
    { "region": "Mediterranean", "decade": "1910s", "anomaly": -0.7 },
    { "region": "Mediterranean", "decade": "1920s", "anomaly": -0.43 },
    { "region": "Mediterranean", "decade": "1930s", "anomaly": -0.34 },
    { "region": "Mediterranean", "decade": "1940s", "anomaly": -0.29 },
    { "region": "Mediterranean", "decade": "1950s", "anomaly": 0.01 },
    { "region": "Mediterranean", "decade": "1960s", "anomaly": 0.27 },
    { "region": "Mediterranean", "decade": "1970s", "anomaly": 0.35 },
    { "region": "Mediterranean", "decade": "1980s", "anomaly": 0.35 },
    { "region": "Mediterranean", "decade": "1990s", "anomaly": 1.04 },
    { "region": "Mediterranean", "decade": "2000s", "anomaly": 1.44 },
    { "region": "Mediterranean", "decade": "2010s", "anomaly": 1.71 },
    { "region": "Sahel", "decade": "1900s", "anomaly": -0.62 },
    { "region": "Sahel", "decade": "1910s", "anomaly": -0.73 },
    { "region": "Sahel", "decade": "1920s", "anomaly": -0.47 },
    { "region": "Sahel", "decade": "1930s", "anomaly": -0.43 },
    { "region": "Sahel", "decade": "1940s", "anomaly": -0.17 },
    { "region": "Sahel", "decade": "1950s", "anomaly": 0.11 },
    { "region": "Sahel", "decade": "1960s", "anomaly": -0.11 },
    { "region": "Sahel", "decade": "1970s", "anomaly": 0.39 },
    { "region": "Sahel", "decade": "1980s", "anomaly": 0.49 },
    { "region": "Sahel", "decade": "1990s", "anomaly": 0.88 },
    { "region": "Sahel", "decade": "2000s", "anomaly": 1.09 },
    { "region": "Sahel", "decade": "2010s", "anomaly": 1.6 },
    { "region": "Central Asia", "decade": "1900s", "anomaly": -0.72 },
    { "region": "Central Asia", "decade": "1910s", "anomaly": -0.65 },
    { "region": "Central Asia", "decade": "1920s", "anomaly": -0.63 },
    { "region": "Central Asia", "decade": "1930s", "anomaly": -0.36 },
    { "region": "Central Asia", "decade": "1940s", "anomaly": -0.39 },
    { "region": "Central Asia", "decade": "1950s", "anomaly": 0.01 },
    { "region": "Central Asia", "decade": "1960s", "anomaly": 0.06 },
    { "region": "Central Asia", "decade": "1970s", "anomaly": 0.07 },
    { "region": "Central Asia", "decade": "1980s", "anomaly": 0.26 },
    { "region": "Central Asia", "decade": "1990s", "anomaly": 0.81 },
    { "region": "Central Asia", "decade": "2000s", "anomaly": 1.16 },
    { "region": "Central Asia", "decade": "2010s", "anomaly": 1.6 },
    { "region": "South-East Asia", "decade": "1900s", "anomaly": -0.53 },
    { "region": "South-East Asia", "decade": "1910s", "anomaly": -0.4 },
    { "region": "South-East Asia", "decade": "1920s", "anomaly": -0.25 },
    { "region": "South-East Asia", "decade": "1930s", "anomaly": -0.05 },
    { "region": "South-East Asia", "decade": "1940s", "anomaly": -0.4 },
    { "region": "South-East Asia", "decade": "1950s", "anomaly": -0.03 },
    { "region": "South-East Asia", "decade": "1960s", "anomaly": 0.18 },
    { "region": "South-East Asia", "decade": "1970s", "anomaly": 0.42 },
    { "region": "South-East Asia", "decade": "1980s", "anomaly": 0.49 },
    { "region": "South-East Asia", "decade": "1990s", "anomaly": 0.46 },
    { "region": "South-East Asia", "decade": "2000s", "anomaly": 0.81 },
    { "region": "South-East Asia", "decade": "2010s", "anomaly": 1.17 },
    { "region": "Amazon basin", "decade": "1900s", "anomaly": -0.51 },
    { "region": "Amazon basin", "decade": "1910s", "anomaly": -0.37 },
    { "region": "Amazon basin", "decade": "1920s", "anomaly": -0.32 },
    { "region": "Amazon basin", "decade": "1930s", "anomaly": -0.18 },
    { "region": "Amazon basin", "decade": "1940s", "anomaly": -0.25 },
    { "region": "Amazon basin", "decade": "1950s", "anomaly": 0.17 },
    { "region": "Amazon basin", "decade": "1960s", "anomaly": 0.23 },
    { "region": "Amazon basin", "decade": "1970s", "anomaly": 0.42 },
    { "region": "Amazon basin", "decade": "1980s", "anomaly": 0.16 },
    { "region": "Amazon basin", "decade": "1990s", "anomaly": 0.66 },
    { "region": "Amazon basin", "decade": "2000s", "anomaly": 0.82 },
    { "region": "Amazon basin", "decade": "2010s", "anomaly": 1.42 },
    { "region": "Southern Ocean", "decade": "1900s", "anomaly": -0.67 },
    { "region": "Southern Ocean", "decade": "1910s", "anomaly": -0.37 },
    { "region": "Southern Ocean", "decade": "1920s", "anomaly": -0.48 },
    { "region": "Southern Ocean", "decade": "1930s", "anomaly": -0.3 },
    { "region": "Southern Ocean", "decade": "1940s", "anomaly": 0 },
    { "region": "Southern Ocean", "decade": "1950s", "anomaly": -0.3 },
    { "region": "Southern Ocean", "decade": "1960s", "anomaly": 0.02 },
    { "region": "Southern Ocean", "decade": "1970s", "anomaly": 0.18 },
    { "region": "Southern Ocean", "decade": "1980s", "anomaly": 0.07 },
    { "region": "Southern Ocean", "decade": "1990s", "anomaly": 0.72 },
    { "region": "Southern Ocean", "decade": "2000s", "anomaly": 1.17 },
    { "region": "Southern Ocean", "decade": "2010s", "anomaly": 1.64 }
  ],
  "x": "decade",
  "y": "region",
  "value": "anomaly",
  "diverging": true,
  "format": "signed",
  "title": "Temperature anomaly by region and decade, 1900s to 2010s",
  "subtitle": "Difference from the 20th-century mean, °C",
  "note": "Illustrative data",
  "type": "heatmap"
}
```

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/heatmap.md
- Component reference with every example: https://insightcharts.dev/llms/heatmap.md
- Registry item: https://insightcharts.dev/r/heatmap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/heatmap.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/heatmap#example-diverging-around-zero
- These instructions as plain text: https://insightcharts.dev/agents/atoms/heatmap/diverging-around-zero.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
