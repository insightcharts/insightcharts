# Reproduce the "Ten destinations, one colour each" example of the InsightCharts Fan flow

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Ten destinations, one colour each" example of `fan-flow` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

One solid block that splits into curved ribbons, each as thick as its value, ending at an aligned column of names, values and shares.

Use it when: One total divided among 4 to about 14 destinations (or collected from that many origins, with `direction: "in"`) when the picture of the split is the point: where a budget goes, what a day's water is used for, which sources feed one total.

Pick something else when: Flows with more than one stage or several sources (use sankey-chart); precise comparison of the parts (use bar-chart); 2 to 4 parts (use segmented-bar or donut-chart); values that can be negative (use bar-chart).

Instructions for the alternatives: `segmented-bar` https://insightcharts.dev/agents/atoms/segmented-bar.md, `sankey-chart` https://insightcharts.dev/agents/atoms/sankey-chart.md, `donut-chart` https://insightcharts.dev/agents/atoms/donut-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/fan-flow
```

The file lands at `components/insightcharts/atoms/fan-flow.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { FanFlow } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "service": "Schools", "spend": 212 },
  { "service": "Social care", "spend": 164 },
  { "service": "Transport", "spend": 121 }
]
```

How the example maps columns to props:

- `name` = `"service"`. Destination field: one ribbon per distinct value.
- `value` = `"spend"`. Value field: ribbon thickness. Rows sharing a name are summed; non-positive values are dropped.

With the user's data, keep the props and change the column names.

## 5. The "Ten destinations, one colour each" example

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { service: "Schools", spend: 212 },
  { service: "Social care", spend: 164 },
  { service: "Transport", spend: 121 },
  { service: "Housing", spend: 96 },
  { service: "Waste", spend: 71 },
  { service: "Police", spend: 64 },
  { service: "Parks", spend: 42 },
  { service: "Fire service", spend: 38 },
  { service: "Libraries", spend: 23 },
  { service: "Culture", spend: 19 },
];

<FanFlow
  theme="paper"
  data={data}
  name="service"
  value="spend"
  colorBy="series"
  trunk="City budget"
  format="€{value}m"
  title="Schools took €212m of one city's €850m budget"
  subtitle="Annual spending of one city council by service, millions of euros"
  note="Illustrative figures for an invented city."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "data": [
    { "service": "Schools", "spend": 212 },
    { "service": "Social care", "spend": 164 },
    { "service": "Transport", "spend": 121 },
    { "service": "Housing", "spend": 96 },
    { "service": "Waste", "spend": 71 },
    { "service": "Police", "spend": 64 },
    { "service": "Parks", "spend": 42 },
    { "service": "Fire service", "spend": 38 },
    { "service": "Libraries", "spend": 23 },
    { "service": "Culture", "spend": 19 }
  ],
  "name": "service",
  "value": "spend",
  "colorBy": "series",
  "trunk": "City budget",
  "format": "€{value}m",
  "title": "Schools took €212m of one city's €850m budget",
  "subtitle": "Annual spending of one city council by service, millions of euros",
  "note": "Illustrative figures for an invented city.",
  "type": "fan-flow"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Destination field: one ribbon per distinct value. |
| `value` (required) | `string` |  | Value field: ribbon thickness. Rows sharing a name are summed; non-positive values are dropped. |
| `trunk` | `string` |  | Label printed in the single block, with the total. |
| `direction` | `"out" \| "in"` | `"out"` | `out`: one block fans out to many labels on the right. `in`: many labels on the left flow into one block. |
| `maxItems` | `number` | `12` | Ribbons to keep; the rest are summed into the remainder ribbon. |
| `otherLabel` | `string` | `"Other"` | Name of the remainder ribbon, drawn in the context colour. A row with this name is treated as the remainder. |
| `tagged` | `string[]` |  | Destinations marked with a dotted outline around the name. |
| `tagLabel` | `string` |  | What the dotted outline means, printed in the key. Needed for `tagged` to be drawn. |
| `share` | `boolean` | `true` | Print each ribbon's share of the total. Dropped on narrow screens. |
| `colorBy` | `"series" \| "none"` |  | `series`: one colour per destination; past the size of the theme's palette the extra colours are derived from the theme's own. `none`: every ribbon in the accent. Default: series while the destinations fit the palette (at most 8), none beyond. |
| `sort` | `"value" \| "none"` | `"value"` | Largest first, or the data order. |

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/fan-flow.md
- Component reference with every example: https://insightcharts.dev/llms/fan-flow.md
- Registry item: https://insightcharts.dev/r/fan-flow.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/fan-flow.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/fan-flow#example-ten-destinations-one-colour-each
- These instructions as plain text: https://insightcharts.dev/agents/atoms/fan-flow/ten-destinations-one-colour-each.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
