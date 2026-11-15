# Reproduce the "Stress: 24 tiles, long names, uneven counts" example of the InsightCharts Icon array grid

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Stress: 24 tiles, long names, uneven counts" example of `icon-array-grid` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Compares many counts as a grid of labelled tiles, each holding an array of N icons with its name and number.

Use it when: Counts of up to about 150 in 4 to 24 categories, especially rates per 100 or per 1,000: cars per 100 households in 12 districts. Set `total` so every tile shows the same full array with the uncounted icons as ghosts.

Pick something else when: Counts in the thousands (use unit-blocks); two to six categories where one row of icons each is enough (use pictogram-chart); values that need precise comparison or ranking (use block-bar or bar-chart); one share of one whole (use waffle-chart).

Instructions for the alternatives: `pictogram-chart` https://insightcharts.dev/agents/atoms/pictogram-chart.md, `waffle-chart` https://insightcharts.dev/agents/atoms/waffle-chart.md, `unit-blocks` https://insightcharts.dev/agents/atoms/unit-blocks.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md, `block-bar` https://insightcharts.dev/agents/atoms/block-bar.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/icon-array-grid
```

The file lands at `components/insightcharts/atoms/icon-array-grid.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { IconArrayGrid } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "area": "Aldermoor and the northern villages", "points": 142 },
  { "area": "Barrow", "points": 3 },
  { "area": "Charnwood Forest", "points": 87 }
]
```

How the example maps columns to props:

- `name` = `"area"`. Category field: one tile per row.
- `value` = `"points"`. Value field: the count each tile shows.

With the user's data, keep the props and change the column names.

## 5. The "Stress: 24 tiles, long names, uneven counts" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { IconArrayGrid } from "insightcharts";

const data = [
  { area: "Aldermoor and the northern villages", points: 142 },
  { area: "Barrow", points: 3 },
  { area: "Charnwood Forest", points: 87 },
  { area: "Denby", points: 0 },
  { area: "East Leake and Stanford", points: 61 },
  { area: "Fosse", points: 118 },
  { area: "Great Glen", points: 24 },
  { area: "Hathern", points: 9 },
  { area: "Ibstock", points: 45 },
  { area: "Kegworth", points: 133 },
  { area: "Loughborough Central and University", points: 150 },
  { area: "Markfield", points: 12 },
  { area: "Newbold", points: 78 },
  { area: "Oadby", points: 56 },
  { area: "Quorn", points: 30 },
  { area: "Ratby", points: 99 },
  { area: "Sileby", points: 67 },
  { area: "Thurmaston", points: 41 },
  { area: "Ulverscroft", points: 1 },
  { area: "Wymeswold", points: 15 },
  { area: "Anstey", points: 82 },
  { area: "Birstall", points: 110 },
  { area: "Cossington", points: 6 },
  { area: "Desford", points: 49 },
];

<IconArrayGrid
  theme="blueprint"
  data={data}
  name="area"
  value="points"
  icon="bolt"
  perRow={15}
  unitLabel="1 public charge point"
  title="Loughborough Central had 150 public charge points in 2025"
  subtitle="Public electric vehicle charge points by area, 2025"
  source="Illustrative data"
  note="Invented figures"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "data": [
    { "area": "Aldermoor and the northern villages", "points": 142 },
    { "area": "Barrow", "points": 3 },
    { "area": "Charnwood Forest", "points": 87 },
    { "area": "Denby", "points": 0 },
    { "area": "East Leake and Stanford", "points": 61 },
    { "area": "Fosse", "points": 118 },
    { "area": "Great Glen", "points": 24 },
    { "area": "Hathern", "points": 9 },
    { "area": "Ibstock", "points": 45 },
    { "area": "Kegworth", "points": 133 },
    { "area": "Loughborough Central and University", "points": 150 },
    { "area": "Markfield", "points": 12 },
    { "area": "Newbold", "points": 78 },
    { "area": "Oadby", "points": 56 },
    { "area": "Quorn", "points": 30 },
    { "area": "Ratby", "points": 99 },
    { "area": "Sileby", "points": 67 },
    { "area": "Thurmaston", "points": 41 },
    { "area": "Ulverscroft", "points": 1 },
    { "area": "Wymeswold", "points": 15 },
    { "area": "Anstey", "points": 82 },
    { "area": "Birstall", "points": 110 },
    { "area": "Cossington", "points": 6 },
    { "area": "Desford", "points": 49 }
  ],
  "name": "area",
  "value": "points",
  "icon": "bolt",
  "perRow": 15,
  "unitLabel": "1 public charge point",
  "title": "Loughborough Central had 150 public charge points in 2025",
  "subtitle": "Public electric vehicle charge points by area, 2025",
  "source": "Illustrative data",
  "note": "Invented figures",
  "type": "icon-array-grid"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one tile per row. |
| `value` (required) | `string` |  | Value field: the count each tile shows. |
| `unit` | `number` | `1` | Units per icon. |
| `unitLabel` | `string` |  | What one icon stands for, for the key line, e.g. "1 car". |
| `total` | `number` |  | Draw every tile out of this many units, with uncounted icons as ghosts: 100 for a rate per 100. |
| `icon` | `IconName \| "path://..."` | `"circle"` | Built-in icon name or a custom single SVG path. |
| `perRow` | `number` | `10` | Icons per line inside a tile. |
| `columns` | `number` |  | Most tiles per line. Default: as many as fit at a readable size. Narrow containers use fewer. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order of the tiles. |

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

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
- One icon stands for a fixed count (`unit`). Say what one icon is worth in `unitLabel` or `subtitle`. Icons are counted. Never scale an icon by area.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/icon-array-grid.md
- Component reference with every example: https://insightcharts.dev/llms/icon-array-grid.md
- Registry item: https://insightcharts.dev/r/icon-array-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/icon-array-grid.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/icon-array-grid#example-stress-24-tiles-long-names-uneven-counts
- These instructions as plain text: https://insightcharts.dev/agents/atoms/icon-array-grid/stress-24-tiles-long-names-uneven-counts.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
