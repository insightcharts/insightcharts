# Reproduce the "Placed by hand, link values, click to select" example of the InsightCharts Bubble network

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Placed by hand, link values, click to select" example of `bubble-network` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Draws a small set of circles sized by value and joined by thin lines, with one circle highlighted and tagged.

Use it when: Showing which of up to about 12 named things are connected, and how big each is: trade blocs, route maps between hubs, partnerships, shared ownership. Give `x` and `y` to place the circles by hand, for example roughly geographically.

Pick something else when: Flows with magnitudes between stages (use sankey-chart); more than about 12 circles or a dense web of links (use heatmap as a matrix, or data-table); comparison of the sizes alone (use bar-chart or circle-pack).

Instructions for the alternatives: `sankey-chart` https://insightcharts.dev/agents/atoms/sankey-chart.md, `circle-pack` https://insightcharts.dev/agents/atoms/circle-pack.md, `data-table` https://insightcharts.dev/agents/atoms/data-table.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bubble-network
```

The file lands at `components/insightcharts/atoms/bubble-network.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BubbleNetwork } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "depot": "Northgate", "vans": 120, "x": 22, "y": 12 },
  { "depot": "Riverside", "vans": 310, "x": 50, "y": 46 },
  { "depot": "Eastfield", "vans": 85, "x": 88, "y": 30 }
]
```

How the example maps columns to props:

- `name` = `"depot"`. Name field: one circle per row.
- `value` = `"vans"`. Value field: circle area.
- `x` = `"x"`. Horizontal position field, 0 (left) to 100 (right). With `y`, places the circles by hand.
- `y` = `"y"`. Vertical position field, 0 (top) to 100 (bottom).

With the user's data, keep the props and change the column names.

## 5. The "Placed by hand, link values, click to select" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BubbleNetwork } from "insightcharts";

const data = [
  { depot: "Northgate", vans: 120, x: 22, y: 12 },
  { depot: "Riverside", vans: 310, x: 50, y: 46 },
  { depot: "Eastfield", vans: 85, x: 88, y: 30 },
  { depot: "Southwell", vans: 160, x: 62, y: 92 },
  { depot: "Westmere", vans: 44, x: 8, y: 70 },
  { depot: "Airport", vans: 205, x: 86, y: 78 },
];

<BubbleNetwork
  data={data}
  name="depot"
  value="vans"
  x="x"
  y="y"
  links={[
    { from: "Riverside", to: "Northgate", value: 42 },
    { from: "Riverside", to: "Eastfield", value: 18 },
    { from: "Riverside", to: "Southwell", value: 55 },
    { from: "Riverside", to: "Westmere", value: 9 },
    { from: "Riverside", to: "Airport", value: 71 },
    { from: "Southwell", to: "Airport", value: 26 },
  ]}
  highlight="Riverside"
  tag="Main depot"
  select
  linkFormat="{value} trips"
  title="Riverside runs 310 of the fleet's 924 vans"
  subtitle="Vans based at each depot (area) and daily transfer trips between depots (line width)"
  note="Illustrative figures for an invented courier"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "data": [
    { "depot": "Northgate", "vans": 120, "x": 22, "y": 12 },
    { "depot": "Riverside", "vans": 310, "x": 50, "y": 46 },
    { "depot": "Eastfield", "vans": 85, "x": 88, "y": 30 },
    { "depot": "Southwell", "vans": 160, "x": 62, "y": 92 },
    { "depot": "Westmere", "vans": 44, "x": 8, "y": 70 },
    { "depot": "Airport", "vans": 205, "x": 86, "y": 78 }
  ],
  "name": "depot",
  "value": "vans",
  "x": "x",
  "y": "y",
  "links": [
    { "from": "Riverside", "to": "Northgate", "value": 42 },
    { "from": "Riverside", "to": "Eastfield", "value": 18 },
    { "from": "Riverside", "to": "Southwell", "value": 55 },
    { "from": "Riverside", "to": "Westmere", "value": 9 },
    { "from": "Riverside", "to": "Airport", "value": 71 },
    { "from": "Southwell", "to": "Airport", "value": 26 }
  ],
  "highlight": "Riverside",
  "tag": "Main depot",
  "select": true,
  "linkFormat": "{value} trips",
  "title": "Riverside runs 310 of the fleet's 924 vans",
  "subtitle": "Vans based at each depot (area) and daily transfer trips between depots (line width)",
  "note": "Illustrative figures for an invented courier",
  "type": "bubble-network"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one circle per row. |
| `value` (required) | `string` |  | Value field: circle area. |
| `x` | `string` |  | Horizontal position field, 0 (left) to 100 (right). With `y`, places the circles by hand. |
| `y` | `string` |  | Vertical position field, 0 (top) to 100 (bottom). |
| `links` | `{ from: string; to: string; value?: number }[]` |  | Lines between circles, by name. `value` sets the line width and is printed on the line. |
| `tag` | `string` |  | Short tag attached to the highlighted circle, e.g. "Joined 2024". |
| `linkFormat` | `FormatSpec` |  | How to print link values. |
| `linkLabels` | `boolean` |  | Print link values on the lines. Default: on when any link has a value. |
| `layout` | `"ring" \| "hub"` |  | Without `x` and `y`: "ring" spaces the circles round an ellipse in data order, "hub" also moves the most-connected circle to the middle. Default: "hub" when one circle links to most of the others. |

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
- Used by: `atlas-poster` (template), `network-poster` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/bubble-network.md
- Component reference with every example: https://insightcharts.dev/llms/bubble-network.md
- Registry item: https://insightcharts.dev/r/bubble-network.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bubble-network.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/bubble-network#example-placed-by-hand-link-values-click-to-select
- These instructions as plain text: https://insightcharts.dev/agents/atoms/bubble-network/placed-by-hand-link-values-click-to-select.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
