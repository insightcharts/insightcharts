# Build a Beeswarm chart with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Beeswarm chart (`beeswarm-chart`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

Shows a distribution as one dot per row along a value axis, with dots stacked sideways where they would collide.

Use it when: Showing a distribution while keeping every individual visible: 30 to about 2,000 named things (countries, players, schools), optionally in a few rows by group, with one or two highlighted.

Pick something else when: More than about 2,000 rows or when only the summary matters (use histogram or box-plot); many groups with few rows each (use strip-plot); two numeric measures (use scatter-chart).

Instructions for the alternatives: `scatter-chart` https://insightcharts.dev/agents/atoms/scatter-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `box-plot` https://insightcharts.dev/agents/atoms/box-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/beeswarm-chart
```

The file lands at `components/insightcharts/atoms/beeswarm-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BeeswarmChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "Qatar", "rate": 0.4 },
  { "country": "Kuwait", "rate": 0.6 },
  { "country": "UAE", "rate": 0.9 }
]
```

How the example maps columns to props:

- `value` = `"rate"`. Numeric field that positions each dot along the axis.
- `label` = `"country"`. Field naming each dot, for tooltips, `highlight` and labels on highlighted dots.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { country: "Qatar", rate: 0.4 },
  { country: "Kuwait", rate: 0.6 },
  { country: "UAE", rate: 0.9 },
  { country: "Saudi Arabia", rate: 1.2 },
  { country: "Japan", rate: 2.5 },
  { country: "Italy", rate: 2.9 },
  { country: "Germany", rate: 3 },
  { country: "United States", rate: 3.6 },
  { country: "France", rate: 3.1 },
  { country: "Spain", rate: 3.3 },
  { country: "United Kingdom", rate: 3.4 },
  { country: "Canada", rate: 3.2 },
  { country: "Australia", rate: 3.1 },
  { country: "South Korea", rate: 2.4 },
  { country: "Netherlands", rate: 2.8 },
  { country: "Sweden", rate: 2.6 },
  { country: "Norway", rate: 2.5 },
  { country: "Switzerland", rate: 2.3 },
  { country: "Poland", rate: 4.2 },
  { country: "Portugal", rate: 3.1 },
  { country: "Greece", rate: 3.9 },
  { country: "Ireland", rate: 2.7 },
  { country: "Denmark", rate: 2.4 },
  { country: "Finland", rate: 2.9 },
  { country: "Austria", rate: 2.7 },
  { country: "Belgium", rate: 2.9 },
  { country: "Czechia", rate: 3.4 },
  { country: "Hungary", rate: 4.4 },
  { country: "Romania", rate: 5.6 },
  { country: "Bulgaria", rate: 5.9 },
  { country: "Mexico", rate: 12.4 },
  { country: "Brazil", rate: 14.2 },
  { country: "Argentina", rate: 9.8 },
  { country: "Chile", rate: 7.9 },
  { country: "Colombia", rate: 13.1 },
  { country: "Peru", rate: 11.6 },
  { country: "China", rate: 6.3 },
  { country: "India", rate: 26.6 },
  { country: "Indonesia", rate: 21 },
  { country: "Vietnam", rate: 19.8 },
  { country: "Thailand", rate: 8.1 },
  { country: "Malaysia", rate: 7.4 },
  { country: "Philippines", rate: 24.3 },
  { country: "Pakistan", rate: 55.8 },
  { country: "Bangladesh", rate: 28.9 },
  { country: "Turkey", rate: 9.1 },
  { country: "Iran", rate: 12 },
  { country: "Egypt", rate: 19.2 },
  { country: "South Africa", rate: 33.5 },
  { country: "Kenya", rate: 37.2 },
  { country: "Ghana", rate: 42.1 },
  { country: "Ethiopia", rate: 46.8 },
  { country: "Tanzania", rate: 44.3 },
  { country: "Uganda", rate: 41 },
  { country: "Nigeria", rate: 107.2 },
  { country: "Niger", rate: 115.2 },
  { country: "Chad", rate: 101.1 },
  { country: "Mali", rate: 94 },
  { country: "Somalia", rate: 106.1 },
  { country: "Sierra Leone", rate: 100.8 },
  { country: "DR Congo", rate: 76 },
  { country: "Angola", rate: 66.5 },
  { country: "Mozambique", rate: 67.2 },
  { country: "Cameroon", rate: 69.8 },
  { country: "Senegal", rate: 37.4 },
  { country: "Rwanda", rate: 38.3 },
  { country: "Zambia", rate: 56.2 },
  { country: "Sudan", rate: 52.9 },
  { country: "Afghanistan", rate: 55.5 },
  { country: "Yemen", rate: 39.9 },
  { country: "Haiti", rate: 56.3 },
  { country: "Bolivia", rate: 23.7 },
  { country: "Guatemala", rate: 22.1 },
  { country: "Nepal", rate: 26.2 },
  { country: "Myanmar", rate: 40.1 },
  { country: "Cambodia", rate: 23.6 },
  { country: "Morocco", rate: 16.7 },
  { country: "Algeria", rate: 21.5 },
  { country: "Iraq", rate: 23.4 },
  { country: "Ukraine", rate: 7.8 },
  { country: "Russia", rate: 4.8 },
  { country: "Kazakhstan", rate: 9.7 },
  { country: "Uzbekistan", rate: 13.6 },
  { country: "Sri Lanka", rate: 6.4 },
];

<BeeswarmChart
  theme="science"
  data={data}
  value="rate"
  label="country"
  highlight={["Nigeria", "India", "United States"]}
  title="Nigeria had 107.2 under-five deaths per 1,000 live births in 2022"
  subtitle="Deaths before age five per 1,000 live births, 84 countries, 2022"
  source="UN IGME (rounded)"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "beeswarm-chart",
  "theme": "science",
  "data": [
    { "country": "Qatar", "rate": 0.4 },
    { "country": "Kuwait", "rate": 0.6 },
    { "country": "UAE", "rate": 0.9 },
    { "country": "Saudi Arabia", "rate": 1.2 },
    { "country": "Japan", "rate": 2.5 },
    { "country": "Italy", "rate": 2.9 },
    { "country": "Germany", "rate": 3 },
    { "country": "United States", "rate": 3.6 },
    { "country": "France", "rate": 3.1 },
    { "country": "Spain", "rate": 3.3 },
    { "country": "United Kingdom", "rate": 3.4 },
    { "country": "Canada", "rate": 3.2 },
    { "country": "Australia", "rate": 3.1 },
    { "country": "South Korea", "rate": 2.4 },
    { "country": "Netherlands", "rate": 2.8 },
    { "country": "Sweden", "rate": 2.6 },
    { "country": "Norway", "rate": 2.5 },
    { "country": "Switzerland", "rate": 2.3 },
    { "country": "Poland", "rate": 4.2 },
    { "country": "Portugal", "rate": 3.1 },
    { "country": "Greece", "rate": 3.9 },
    { "country": "Ireland", "rate": 2.7 },
    { "country": "Denmark", "rate": 2.4 },
    { "country": "Finland", "rate": 2.9 },
    { "country": "Austria", "rate": 2.7 },
    { "country": "Belgium", "rate": 2.9 },
    { "country": "Czechia", "rate": 3.4 },
    { "country": "Hungary", "rate": 4.4 },
    { "country": "Romania", "rate": 5.6 },
    { "country": "Bulgaria", "rate": 5.9 },
    { "country": "Mexico", "rate": 12.4 },
    { "country": "Brazil", "rate": 14.2 },
    { "country": "Argentina", "rate": 9.8 },
    { "country": "Chile", "rate": 7.9 },
    { "country": "Colombia", "rate": 13.1 },
    { "country": "Peru", "rate": 11.6 },
    { "country": "China", "rate": 6.3 },
    { "country": "India", "rate": 26.6 },
    { "country": "Indonesia", "rate": 21 },
    { "country": "Vietnam", "rate": 19.8 },
    { "country": "Thailand", "rate": 8.1 },
    { "country": "Malaysia", "rate": 7.4 },
    { "country": "Philippines", "rate": 24.3 },
    { "country": "Pakistan", "rate": 55.8 },
    { "country": "Bangladesh", "rate": 28.9 },
    { "country": "Turkey", "rate": 9.1 },
    { "country": "Iran", "rate": 12 },
    { "country": "Egypt", "rate": 19.2 },
    { "country": "South Africa", "rate": 33.5 },
    { "country": "Kenya", "rate": 37.2 },
    { "country": "Ghana", "rate": 42.1 },
    { "country": "Ethiopia", "rate": 46.8 },
    { "country": "Tanzania", "rate": 44.3 },
    { "country": "Uganda", "rate": 41 },
    { "country": "Nigeria", "rate": 107.2 },
    { "country": "Niger", "rate": 115.2 },
    { "country": "Chad", "rate": 101.1 },
    { "country": "Mali", "rate": 94 },
    { "country": "Somalia", "rate": 106.1 },
    { "country": "Sierra Leone", "rate": 100.8 },
    { "country": "DR Congo", "rate": 76 },
    { "country": "Angola", "rate": 66.5 },
    { "country": "Mozambique", "rate": 67.2 },
    { "country": "Cameroon", "rate": 69.8 },
    { "country": "Senegal", "rate": 37.4 },
    { "country": "Rwanda", "rate": 38.3 },
    { "country": "Zambia", "rate": 56.2 },
    { "country": "Sudan", "rate": 52.9 },
    { "country": "Afghanistan", "rate": 55.5 },
    { "country": "Yemen", "rate": 39.9 },
    { "country": "Haiti", "rate": 56.3 },
    { "country": "Bolivia", "rate": 23.7 },
    { "country": "Guatemala", "rate": 22.1 },
    { "country": "Nepal", "rate": 26.2 },
    { "country": "Myanmar", "rate": 40.1 },
    { "country": "Cambodia", "rate": 23.6 },
    { "country": "Morocco", "rate": 16.7 },
    { "country": "Algeria", "rate": 21.5 },
    { "country": "Iraq", "rate": 23.4 },
    { "country": "Ukraine", "rate": 7.8 },
    { "country": "Russia", "rate": 4.8 },
    { "country": "Kazakhstan", "rate": 9.7 },
    { "country": "Uzbekistan", "rate": 13.6 },
    { "country": "Sri Lanka", "rate": 6.4 }
  ],
  "value": "rate",
  "label": "country",
  "highlight": ["Nigeria", "India", "United States"],
  "title": "Nigeria had 107.2 under-five deaths per 1,000 live births in 2022",
  "subtitle": "Deaths before age five per 1,000 live births, 84 countries, 2022",
  "source": "UN IGME (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field that positions each dot along the axis. |
| `group` | `string` |  | Field that splits the dots into rows, one swarm per group. |
| `series` | `string` |  | Field that colours dots by category. Beyond 6 categories the rest turn grey. |
| `label` | `string` |  | Field naming each dot, for tooltips, `highlight` and labels on highlighted dots. |
| `radius` | `number` |  | Dot radius in px. Default 5 down to 3 by row count; shrinks if a swarm would overflow its row. |
| `median` | `boolean` | `false` | Mark each row's median with a vertical tick. |
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

- Component reference with every example: https://insightcharts.dev/llms/beeswarm-chart.md
- Registry item: https://insightcharts.dev/r/beeswarm-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/beeswarm-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/beeswarm-chart
- These instructions as plain text: https://insightcharts.dev/agents/atoms/beeswarm-chart.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
