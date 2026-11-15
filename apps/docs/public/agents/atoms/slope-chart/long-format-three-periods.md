# Reproduce the "Long format, three periods" example of the InsightCharts Slope chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Long format, three periods" example of `slope-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Connects each entity's value at two (or a few) points with a straight line, labelled with name and value at both ends.

Use it when: Before / after for 3 to about 15 entities when the change in level and in ordering both matter; pair with `highlight` to emphasise one line.

Pick something else when: Five or more time points (use line-chart); when only the ordering matters (use bump-chart); when only the size of each gap matters (use dumbbell-chart or arrow-chart).

Instructions for the alternatives: `dumbbell-chart` https://insightcharts.dev/agents/atoms/dumbbell-chart.md, `arrow-chart` https://insightcharts.dev/agents/atoms/arrow-chart.md, `bump-chart` https://insightcharts.dev/agents/atoms/bump-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/slope-chart
```

The file lands at `components/insightcharts/atoms/slope-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SlopeChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "format": "Streaming", "year": "2012", "share": 9 },
  { "format": "Streaming", "year": "2016", "share": 34 },
  { "format": "Streaming", "year": "2023", "share": 67 }
]
```

How the example maps columns to props:

- `series` = `"format"`. Entity field: one line each.
- `x` = `"year"`. Period field for long data. Omit when each row is an entity with one column per period.
- `y` = `"share"`. Value field (long data), or the period columns in order (one row per entity).

With the user's data, keep the props and change the column names.

## 5. The "Long format, three periods" example

This example sets `theme="forest"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { SlopeChart } from "insightcharts";

const data = [
  { format: "Streaming", year: "2012", share: 9 },
  { format: "Streaming", year: "2016", share: 34 },
  { format: "Streaming", year: "2023", share: 67 },
  { format: "Physical", year: "2012", share: 52 },
  { format: "Physical", year: "2016", share: 31 },
  { format: "Physical", year: "2023", share: 11 },
  { format: "Downloads", year: "2012", share: 31 },
  { format: "Downloads", year: "2016", share: 24 },
  { format: "Downloads", year: "2023", share: 4 },
  { format: "Sync and other", year: "2012", share: 8 },
  { format: "Sync and other", year: "2016", share: 11 },
  { format: "Sync and other", year: "2023", share: 18 },
];

<SlopeChart
  theme="forest"
  data={data}
  series="format"
  x="year"
  y="share"
  colorBy="series"
  format="{value}%"
  height={320}
  title="Streaming's share of recorded music revenue rose from 9% to 67% between 2012 and 2023"
  subtitle="Share of recorded music revenue by format, 2012, 2016 and 2023"
  note="Illustrative figures."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "forest",
  "data": [
    { "format": "Streaming", "year": "2012", "share": 9 },
    { "format": "Streaming", "year": "2016", "share": 34 },
    { "format": "Streaming", "year": "2023", "share": 67 },
    { "format": "Physical", "year": "2012", "share": 52 },
    { "format": "Physical", "year": "2016", "share": 31 },
    { "format": "Physical", "year": "2023", "share": 11 },
    { "format": "Downloads", "year": "2012", "share": 31 },
    { "format": "Downloads", "year": "2016", "share": 24 },
    { "format": "Downloads", "year": "2023", "share": 4 },
    { "format": "Sync and other", "year": "2012", "share": 8 },
    { "format": "Sync and other", "year": "2016", "share": 11 },
    { "format": "Sync and other", "year": "2023", "share": 18 }
  ],
  "series": "format",
  "x": "year",
  "y": "share",
  "colorBy": "series",
  "format": "{value}%",
  "height": 320,
  "title": "Streaming's share of recorded music revenue rose from 9% to 67% between 2012 and 2023",
  "subtitle": "Share of recorded music revenue by format, 2012, 2016 and 2023",
  "note": "Illustrative figures.",
  "type": "slope-chart"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `series` (required) | `string` |  | Entity field: one line each. |
| `x` | `string` |  | Period field for long data. Omit when each row is an entity with one column per period. |
| `y` (required) | `string \| string[]` |  | Value field (long data), or the period columns in order (one row per entity). |
| `colorBy` | `"none" \| "direction" \| "series"` | `"none"` | Accent for all lines, positive / negative by direction, or one hue per entity (up to 8). |
| `good` | `"up" \| "down"` | `"up"` | Direction that takes the positive colour when colouring by direction. |
| `labels` | `"both" \| "end"` |  | Entity names at both ends or only the end. Default: both; end only on narrow screens. |
| `names` | `Record<string, string>` |  | Display names for entity keys and period columns. |

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
- Used by: `chart-callout` (molecule), `atlas-poster` (template), `executive-brief` (template)

## Rules for this form

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/slope-chart.md
- Component reference with every example: https://insightcharts.dev/llms/slope-chart.md
- Registry item: https://insightcharts.dev/r/slope-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/slope-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/slope-chart#example-long-format-three-periods
- These instructions as plain text: https://insightcharts.dev/agents/atoms/slope-chart/long-format-three-periods.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
