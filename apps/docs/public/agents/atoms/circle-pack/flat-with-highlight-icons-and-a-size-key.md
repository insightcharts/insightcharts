# Reproduce the "Flat, with highlight, icons and a size key" example of the InsightCharts Circle pack

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Flat, with highlight, icons and a size key" example of `circle-pack` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Shows parts as tightly packed circles sized by value, optionally clustered into groups, with the value and name printed inside each circle.

Use it when: A poster view of 5 to about 60 parts of very different sizes where the reader should see the largest ones and their rough proportions at once: budgets by programme, emissions by source, users by product. One level of grouping is supported.

Pick something else when: Values that need precise comparison (use bar-chart, where bars share a baseline); parts that must visibly add up to a whole (use treemap or waffle-chart); more than about 80 parts (use treemap); negative values (use diverging-bar-chart).

Instructions for the alternatives: `diverging-bar-chart` https://insightcharts.dev/agents/atoms/diverging-bar-chart.md, `waffle-chart` https://insightcharts.dev/agents/atoms/waffle-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/circle-pack
```

The file lands at `components/insightcharts/atoms/circle-pack.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { CirclePack } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "service": "Schools", "m": 412 },
  { "service": "Public transport", "m": 268 },
  { "service": "Police", "m": 231 }
]
```

How the example maps columns to props:

- `name` = `"service"`. Name field: one circle per row.
- `value` = `"m"`. Value field: circle area. Non-positive values are dropped.

With the user's data, keep the props and change the column names.

## 5. The "Flat, with highlight, icons and a size key" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { CirclePack } from "insightcharts";

const data = [
  { service: "Schools", m: 412 },
  { service: "Public transport", m: 268 },
  { service: "Police", m: 231 },
  { service: "Waste and recycling", m: 96 },
  { service: "Social housing", m: 187 },
  { service: "Parks", m: 44 },
  { service: "Libraries", m: 23 },
  { service: "Street lighting", m: 17 },
  { service: "Fire service", m: 88 },
  { service: "Road repair", m: 121 },
  { service: "Museums", m: 12 },
  { service: "Public health", m: 74 },
  { service: "Animal control", m: 3 },
  { service: "Elections", m: 2 },
  { service: "Flood defences", m: 31 },
  { service: "Youth centres", m: 9 },
  { service: "Tourism office", m: 5 },
  { service: "Cemeteries", m: 4 },
];

<CirclePack
  data={data}
  name="service"
  value="m"
  format="${value}m"
  highlight="Schools"
  icon={{ Schools: "house", "Public transport": "car", Parks: "tree" }}
  sizeLegend
  select
  title="Schools take $412 million of the city's $1,627 million budget"
  subtitle="Annual spending by service, $ million. Click a circle to select it."
  note="Illustrative figures for an invented city"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "data": [
    { "service": "Schools", "m": 412 },
    { "service": "Public transport", "m": 268 },
    { "service": "Police", "m": 231 },
    { "service": "Waste and recycling", "m": 96 },
    { "service": "Social housing", "m": 187 },
    { "service": "Parks", "m": 44 },
    { "service": "Libraries", "m": 23 },
    { "service": "Street lighting", "m": 17 },
    { "service": "Fire service", "m": 88 },
    { "service": "Road repair", "m": 121 },
    { "service": "Museums", "m": 12 },
    { "service": "Public health", "m": 74 },
    { "service": "Animal control", "m": 3 },
    { "service": "Elections", "m": 2 },
    { "service": "Flood defences", "m": 31 },
    { "service": "Youth centres", "m": 9 },
    { "service": "Tourism office", "m": 5 },
    { "service": "Cemeteries", "m": 4 }
  ],
  "name": "service",
  "value": "m",
  "format": "${value}m",
  "highlight": "Schools",
  "icon": { "Schools": "house", "Public transport": "car", "Parks": "tree" },
  "sizeLegend": true,
  "select": true,
  "title": "Schools take $412 million of the city's $1,627 million budget",
  "subtitle": "Annual spending by service, $ million. Click a circle to select it.",
  "note": "Illustrative figures for an invented city",
  "type": "circle-pack"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one circle per row. |
| `value` (required) | `string` |  | Value field: circle area. Non-positive values are dropped. |
| `group` | `string` |  | Parent field. Circles sharing a group sit together and share a colour. |
| `ring` | `"none" \| "group" \| "all"` |  | Thin dotted enclosing ring: one per group with its name and total, or one around the whole pack. Default "group" when `group` is set, else "none". |
| `colorBy` | `"group" \| "value" \| "single"` |  | Colour by group, shade by value along the sequential ramp, or use the accent for every circle. Default "group" when `group` is set, else "single". |
| `icon` | `string \| Record<string, string>` |  | Icon drawn above the number in large circles: one for all, or a map from circle or group name to icon. Built-in name or `path://`. |
| `sizeLegend` | `boolean \| number[]` | `false` | Size key of nested reference circles. `true` picks round values; an array sets them. |
| `labels` | `boolean` | `true` | Print names and values inside circles, and beside the ones too small to hold them. |
| `names` | `Record<string, string>` |  | Display names for group keys. |

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
- Used by: `ranking-poster` (template)

## Rules for this form

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/circle-pack.md
- Component reference with every example: https://insightcharts.dev/llms/circle-pack.md
- Registry item: https://insightcharts.dev/r/circle-pack.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/circle-pack.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/circle-pack#example-flat-with-highlight-icons-and-a-size-key
- These instructions as plain text: https://insightcharts.dev/agents/atoms/circle-pack/flat-with-highlight-icons-and-a-size-key.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
