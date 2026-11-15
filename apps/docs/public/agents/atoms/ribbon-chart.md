# Build a Ribbon chart with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Ribbon chart (`ribbon-chart`, a poster primitive (atom)) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

One filled band per entity across periods: its thickness is its value in each period and its vertical position is its rank, so bands cross as the order changes.

Use it when: 4 to 8 entities over 4 to 10 periods when both the size of each and the changing order matter, and the graphic should read as one flowing form: market shares, harvests, medal tables, budget lines.

Pick something else when: Totals that matter more than order, or a smooth centred stream of many periods (use area-chart, which has stacked and stream modes); rank alone (use bump-chart); more than 8 entities or 10 periods (use line-chart or small-multiples); values that can be negative (use line-chart).

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `area-chart` https://insightcharts.dev/agents/atoms/area-chart.md, `bump-chart` https://insightcharts.dev/agents/atoms/bump-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ribbon-chart
```

The file lands at `components/insightcharts/atoms/ribbon-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { RibbonChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "year": "2019", "Potatoes": 7.4, "Carrots": 5.1, "Onions": 4.2, "Beans": 2.6, "Squash": 1.2 },
  { "year": "2020", "Potatoes": 6.9, "Carrots": 5.6, "Onions": 3.8, "Beans": 3.1, "Squash": 2.3 },
  { "year": "2021", "Potatoes": 6.1, "Carrots": 5.9, "Onions": 3.1, "Beans": 3.4, "Squash": 3.9 }
]
```

How the example maps columns to props:

- `x` = `"year"`. Period field: one column of the ribbon per distinct value, in data order.
- `y` = `["Potatoes","Carrots","Onions","Beans","Squash"]`. Value field (long data), or one column per entity (wide data). Band thickness; negative values are drawn as zero.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { RibbonChart } from "insightcharts";

const data = [
  { year: "2019", Potatoes: 7.4, Carrots: 5.1, Onions: 4.2, Beans: 2.6, Squash: 1.2 },
  { year: "2020", Potatoes: 6.9, Carrots: 5.6, Onions: 3.8, Beans: 3.1, Squash: 2.3 },
  { year: "2021", Potatoes: 6.1, Carrots: 5.9, Onions: 3.1, Beans: 3.4, Squash: 3.9 },
  { year: "2022", Potatoes: 5.2, Carrots: 6.3, Onions: 2.9, Beans: 3.2, Squash: 5 },
  { year: "2023", Potatoes: 4.8, Carrots: 6, Onions: 2.4, Beans: 3.6, Squash: 6.1 },
  { year: "2024", Potatoes: 4.1, Carrots: 6.2, Onions: 2.2, Beans: 3.5, Squash: 6.8 },
];

<RibbonChart
  theme="sunrise"
  data={data}
  x="year"
  y={["Potatoes", "Carrots", "Onions", "Beans", "Squash"]}
  format="{value} t"
  title="The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024"
  subtitle="Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year"
  note="Illustrative figures."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "sunrise",
  "type": "ribbon-chart",
  "data": [
    { "year": "2019", "Potatoes": 7.4, "Carrots": 5.1, "Onions": 4.2, "Beans": 2.6, "Squash": 1.2 },
    { "year": "2020", "Potatoes": 6.9, "Carrots": 5.6, "Onions": 3.8, "Beans": 3.1, "Squash": 2.3 },
    { "year": "2021", "Potatoes": 6.1, "Carrots": 5.9, "Onions": 3.1, "Beans": 3.4, "Squash": 3.9 },
    { "year": "2022", "Potatoes": 5.2, "Carrots": 6.3, "Onions": 2.9, "Beans": 3.2, "Squash": 5 },
    { "year": "2023", "Potatoes": 4.8, "Carrots": 6, "Onions": 2.4, "Beans": 3.6, "Squash": 6.1 },
    { "year": "2024", "Potatoes": 4.1, "Carrots": 6.2, "Onions": 2.2, "Beans": 3.5, "Squash": 6.8 }
  ],
  "x": "year",
  "y": ["Potatoes", "Carrots", "Onions", "Beans", "Squash"],
  "format": "{value} t",
  "title": "The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024",
  "subtitle": "Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year",
  "note": "Illustrative figures."
}
```

This example sets `theme="sunrise"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Period field: one column of the ribbon per distinct value, in data order. |
| `y` (required) | `string \| string[]` |  | Value field (long data), or one column per entity (wide data). Band thickness; negative values are drawn as zero. |
| `series` | `string` |  | Entity field, for long data. |
| `values` | `boolean` | `true` | Print each value inside its band at every period where it fits. |
| `labels` | `"both" \| "end"` |  | Entity names at both ends, or only at the end. Default: both, end only on narrow screens. |
| `names` | `Record<string, string>` |  | Display names for entity keys. |
| `colorBy` | `"auto" \| "series" \| "none"` | `"auto"` | `auto`: the largest entities take the theme's colours and any past the palette size (at most 8) are grey. `series`: every band gets its own colour, the extra ones derived from the theme's own. `none`: every band in the accent. |

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
- Used by: `timeline-poster` (template)

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

- Component reference with every example: https://insightcharts.dev/llms/ribbon-chart.md
- Registry item: https://insightcharts.dev/r/ribbon-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/ribbon-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/ribbon-chart
- These instructions as plain text: https://insightcharts.dev/agents/atoms/ribbon-chart.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
