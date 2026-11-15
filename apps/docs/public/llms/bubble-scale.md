# Bubble scale (`bubble-scale`)

> Places circles sized by one measure along a single value scale set by another, spread sideways so none overlap, with boxed scale marks instead of an axis.

- Component: `BubbleScale` (import from `insightcharts`)
- Spec type: `"bubble-scale"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A poster answer to "where does each one sit on this scale, and how big is it": 5 to about 40 named things with a rate or score (the scale) and a magnitude (the area), such as import dependency against share of demand.

## Avoid

Two measures that should be read against each other on two axes (use scatter-chart); one measure only (use beeswarm-chart or strip-plot); precise comparison of the sizes (use bar-chart); more than about 60 rows (use beeswarm-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bubble-scale
```

The file lands at `components/insightcharts/atoms/bubble-scale.tsx`. `@insightcharts/bubble-scale-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BubbleScale } from "insightcharts";

const data = [
  { material: "Lithium", imported: 100, kt: 38 },
  { material: "Cobalt", imported: 86, kt: 21 },
  { material: "Graphite", imported: 98, kt: 96 },
  { material: "Nickel", imported: 71, kt: 164 },
  { material: "Manganese", imported: 96, kt: 52 },
  { material: "Copper", imported: 48, kt: 410 },
  { material: "Aluminium", imported: 59, kt: 290 },
  { material: "Rare earths", imported: 100, kt: 9 },
  { material: "Silicon metal", imported: 64, kt: 73 },
  { material: "Zinc", imported: 22, kt: 118 },
  { material: "Steel scrap", imported: 4, kt: 520 },
  { material: "Tin", imported: 78, kt: 14 },
];

<BubbleScale
  theme="sunrise"
  data={data}
  name="material"
  value="imported"
  size="kt"
  format="{value}%"
  sizeFormat="{value} kt"
  domain={[0, 100]}
  ticks={[0, 20, 40, 60, 80, 100]}
  scaleLabel="Imported"
  title="Imports supply between 4% and 100% of the region's demand for 12 materials"
  subtitle="Share of each material imported (position) and annual demand in thousand tonnes (area), 12 battery and grid materials"
  note="Illustrative figures for an invented region"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "bubble-scale",
  "theme": "sunrise",
  "data": [
    { "material": "Lithium", "imported": 100, "kt": 38 },
    { "material": "Cobalt", "imported": 86, "kt": 21 },
    { "material": "Graphite", "imported": 98, "kt": 96 },
    { "material": "Nickel", "imported": 71, "kt": 164 },
    { "material": "Manganese", "imported": 96, "kt": 52 },
    { "material": "Copper", "imported": 48, "kt": 410 },
    { "material": "Aluminium", "imported": 59, "kt": 290 },
    { "material": "Rare earths", "imported": 100, "kt": 9 },
    { "material": "Silicon metal", "imported": 64, "kt": 73 },
    { "material": "Zinc", "imported": 22, "kt": 118 },
    { "material": "Steel scrap", "imported": 4, "kt": 520 },
    { "material": "Tin", "imported": 78, "kt": 14 }
  ],
  "name": "material",
  "value": "imported",
  "size": "kt",
  "format": "{value}%",
  "sizeFormat": "{value} kt",
  "domain": [0, 100],
  "ticks": [0, 20, 40, 60, 80, 100],
  "scaleLabel": "Imported",
  "title": "Imports supply between 4% and 100% of the region's demand for 12 materials",
  "subtitle": "Share of each material imported (position) and annual demand in thousand tonnes (area), 12 battery and grid materials",
  "note": "Illustrative figures for an invented region"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one circle per row. |
| `value` (required) | `string` |  | Numeric field that positions each circle along the scale. Printed with `format`. |
| `size` (required) | `string` |  | Numeric field for circle area. Printed inside or beside each circle with `sizeFormat`. |
| `series` | `string` |  | Field that colours circles by category. Default: circles are shaded along the scale with the sequential ramp. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Direction of the scale. Narrow containers always use vertical. |
| `domain` | `[number, number]` |  | Scale range. Default: the data extent rounded out to the tick step. |
| `ticks` | `number[]` |  | Values to mark on the scale. Default: about five round values. |
| `scaleLabel` | `string` |  | Short name of the scale measure, printed at the head of the scale. |
| `sizeFormat` | `FormatSpec` |  | How to print the size measure. |
| `guides` | `boolean` | `true` | Thin dotted guide line at each scale mark. |
| `names` | `Record<string, string>` |  | Display names for series keys. |

## Common props

Every chart also accepts these (shared by all charts; also at https://insightcharts.dev/llms/guides/common-props.md):

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

- Composes: nothing (it is a primitive)
- Used by: [flow-poster](https://insightcharts.dev/llms/flow-poster.md)

## More examples

### Colour by series, horizontal

```tsx
import { BubbleScale } from "insightcharts";

const data = [
  { district: "Harbourside", ring: "Inner", carFree: 71, thousand: 18 },
  { district: "Old Town", ring: "Inner", carFree: 64, thousand: 31 },
  { district: "Canal Quarter", ring: "Inner", carFree: 58, thousand: 22 },
  { district: "Station Fields", ring: "Inner", carFree: 49, thousand: 12 },
  { district: "Marketgate", ring: "Inner", carFree: 44, thousand: 27 },
  { district: "Northmoor", ring: "Outer", carFree: 37, thousand: 46 },
  { district: "Eastcliff", ring: "Outer", carFree: 33, thousand: 39 },
  { district: "Larkhill", ring: "Outer", carFree: 29, thousand: 52 },
  // ... 9 more rows
];

<BubbleScale
  data={data}
  name="district"
  value="carFree"
  size="thousand"
  series="ring"
  orientation="horizontal"
  format="{value}%"
  sizeFormat="{value}k"
  scaleLabel="Households without a car"
  title="71% of Harbourside households have no car"
  subtitle="Share of households without a car (position) and population in thousands (area), 17 districts"
  note="Illustrative figures for an invented city"
/>
```

### Highlight one circle, click to select

```tsx
import { BubbleScale } from "insightcharts";

const data = [
  { district: "Harbourside", ring: "Inner", carFree: 71, thousand: 18 },
  { district: "Old Town", ring: "Inner", carFree: 64, thousand: 31 },
  { district: "Canal Quarter", ring: "Inner", carFree: 58, thousand: 22 },
  { district: "Station Fields", ring: "Inner", carFree: 49, thousand: 12 },
  { district: "Marketgate", ring: "Inner", carFree: 44, thousand: 27 },
  { district: "Northmoor", ring: "Outer", carFree: 37, thousand: 46 },
  { district: "Eastcliff", ring: "Outer", carFree: 33, thousand: 39 },
  { district: "Larkhill", ring: "Outer", carFree: 29, thousand: 52 },
  // ... 9 more rows
];

<BubbleScale
  theme="blueprint"
  data={data}
  name="district"
  value="carFree"
  size="thousand"
  highlight="Fenside"
  select
  format="{value}%"
  sizeFormat="{value}k"
  scaleLabel="Without a car"
  title="22% of Fenside's households have no car"
  subtitle="Share of households without a car (position) and population in thousands (area), 17 districts"
  note="Illustrative figures for an invented city"
/>
```

### Stress: 40 circles crowded at one end, sizes from 1 to 900

```tsx
import { BubbleScale } from "insightcharts";

const data = [
  { fund: "Fund A", fee: 1.15, bn: 900 },
  { fund: "Fund B", fee: 0.22, bn: 413 },
  { fund: "Fund C", fee: 0.11, bn: 226 },
  { fund: "Fund D", fee: 0.28, bn: 139 },
  { fund: "Fund E", fee: 0.17, bn: 87 },
  { fund: "Fund F", fee: 0.66, bn: 48 },
  { fund: "Fund G", fee: 0.23, bn: 33 },
  { fund: "Fund H", fee: 0.12, bn: 24 },
  // ... 32 more rows
];

<BubbleScale
  theme="forest"
  data={data}
  name="fund"
  value="fee"
  size="bn"
  format="{value}%"
  sizeFormat="${value}bn"
  scaleLabel="Annual fee"
  title="40 funds charge between 0.05% and 2.01% a year"
  subtitle="Annual fee (position) and assets in $ billion (area), 40 index and active funds"
  note="Illustrative figures for invented funds"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/bubble-scale.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bubble-scale.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
