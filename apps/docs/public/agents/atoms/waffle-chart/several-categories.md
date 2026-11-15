# Reproduce the "Several categories" example of the InsightCharts Waffle chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Several categories" example of `waffle-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Shows shares of a whole as counted cells in a grid, such as 37 in every 100.

Use it when: One share ("37 in every 100") or a handful of categories that add up to a whole, where the reader should be able to count the units.

Pick something else when: Comparing shares across several groups (use bar-chart with stack "percent"); more than about 6 categories or shares under 1% (use bar-chart); a compact inline part-to-whole (use segmented-bar).

Instructions for the alternatives: `segmented-bar` https://insightcharts.dev/agents/atoms/segmented-bar.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/waffle-chart
```

The file lands at `components/insightcharts/atoms/waffle-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { WaffleChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "source": "Coal", "twh": 35.4 },
  { "source": "Gas", "twh": 22.5 },
  { "source": "Hydro", "twh": 14.3 }
]
```

How the example maps columns to props:

- `value` = `"twh"`. Value field. Each category's cells are its share of the whole.
- `name` = `"source"`. Category field. Omit for a single share.

With the user's data, keep the props and change the column names.

## 5. The "Several categories" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { WaffleChart } from "insightcharts";

const data = [
  { source: "Coal", twh: 35.4 },
  { source: "Gas", twh: 22.5 },
  { source: "Hydro", twh: 14.3 },
  { source: "Nuclear", twh: 9.1 },
  { source: "Wind", twh: 7.8 },
  { source: "Solar", twh: 5.5 },
  { source: "Other", twh: 5.4 },
];

<WaffleChart
  data={data}
  name="source"
  value="twh"
  format="{value}%"
  title="Coal and gas generated 57.9% of the world's electricity in 2023"
  subtitle="Share of global electricity generation by source, 2023"
  source="Ember, Global Electricity Review 2024"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "data": [
    { "source": "Coal", "twh": 35.4 },
    { "source": "Gas", "twh": 22.5 },
    { "source": "Hydro", "twh": 14.3 },
    { "source": "Nuclear", "twh": 9.1 },
    { "source": "Wind", "twh": 7.8 },
    { "source": "Solar", "twh": 5.5 },
    { "source": "Other", "twh": 5.4 }
  ],
  "name": "source",
  "value": "twh",
  "format": "{value}%",
  "title": "Coal and gas generated 57.9% of the world's electricity in 2023",
  "subtitle": "Share of global electricity generation by source, 2023",
  "source": "Ember, Global Electricity Review 2024",
  "note": "Figures are approximate, for illustration",
  "type": "waffle-chart"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Value field. Each category's cells are its share of the whole. |
| `name` | `string` |  | Category field. Omit for a single share. |
| `total` | `number` |  | The whole. Default: the sum of the values. Set to 100 with one value to show a single share against an empty remainder. |
| `rows` | `number` | `10` | Grid rows. |
| `columns` | `number` | `10` | Grid columns. |
| `shape` | `"square" \| "circle"` | `"square"` | Cell shape. |
| `restLabel` | `string` |  | Label for the unfilled remainder when `total` exceeds the sum. |
| `names` | `Record<string, string>` |  | Display names for category keys. |

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
- Used by: `hero-figure` (molecule), `poster` (molecule), `proportion-statement` (molecule), `small-multiple-grid` (molecule), `comparison-brief` (template), `social-card` (template), `story-deck` (template), `timeline-story` (template), `visual-essay` (template)

## Rules for this form

- The parts must add up to a whole that means something. State the whole in `subtitle`.
- Keep to about five parts. Fold the rest into "Other" with the `top` transform (`{ type: "top", n, by, other: "Other", label }`).
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/waffle-chart.md
- Component reference with every example: https://insightcharts.dev/llms/waffle-chart.md
- Registry item: https://insightcharts.dev/r/waffle-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/waffle-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/waffle-chart#example-several-categories
- These instructions as plain text: https://insightcharts.dev/agents/atoms/waffle-chart/several-categories.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
