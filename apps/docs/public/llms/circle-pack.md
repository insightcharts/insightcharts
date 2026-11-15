# Circle pack (`circle-pack`)

> Shows parts as tightly packed circles sized by value, optionally clustered into groups, with the value and name printed inside each circle.

- Component: `CirclePack` (import from `insightcharts`)
- Spec type: `"circle-pack"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A poster view of 5 to about 60 parts of very different sizes where the reader should see the largest ones and their rough proportions at once: budgets by programme, emissions by source, users by product. One level of grouping is supported.

## Avoid

Values that need precise comparison (use bar-chart, where bars share a baseline); parts that must visibly add up to a whole (use treemap or waffle-chart); more than about 80 parts (use treemap); negative values (use diverging-bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/circle-pack
```

The file lands at `components/insightcharts/atoms/circle-pack.tsx`. `@insightcharts/circle-pack-demo` adds a ready-made example next to it.

## Usage

```tsx
import { CirclePack } from "insightcharts";

const data = [
  { crop: "Maize", group: "Cereals", mt: 1160 },
  { crop: "Wheat", group: "Cereals", mt: 780 },
  { crop: "Rice", group: "Cereals", mt: 790 },
  { crop: "Barley", group: "Cereals", mt: 150 },
  { crop: "Sorghum", group: "Cereals", mt: 60 },
  { crop: "Potatoes", group: "Roots", mt: 375 },
  { crop: "Cassava", group: "Roots", mt: 330 },
  { crop: "Sweet potatoes", group: "Roots", mt: 90 },
  { crop: "Yams", group: "Roots", mt: 85 },
  { crop: "Soybeans", group: "Oil crops", mt: 350 },
  { crop: "Oil palm fruit", group: "Oil crops", mt: 420 },
  { crop: "Rapeseed", group: "Oil crops", mt: 87 },
  { crop: "Sunflower seed", group: "Oil crops", mt: 54 },
];

<CirclePack
  data={data}
  name="crop"
  value="mt"
  group="group"
  format="{value} Mt"
  title="The world harvested 1,160 million tonnes of maize in 2022"
  subtitle="Harvest of 13 major crops by group, million tonnes, 2022"
  source="FAOSTAT"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "circle-pack",
  "data": [
    { "crop": "Maize", "group": "Cereals", "mt": 1160 },
    { "crop": "Wheat", "group": "Cereals", "mt": 780 },
    { "crop": "Rice", "group": "Cereals", "mt": 790 },
    { "crop": "Barley", "group": "Cereals", "mt": 150 },
    { "crop": "Sorghum", "group": "Cereals", "mt": 60 },
    { "crop": "Potatoes", "group": "Roots", "mt": 375 },
    { "crop": "Cassava", "group": "Roots", "mt": 330 },
    { "crop": "Sweet potatoes", "group": "Roots", "mt": 90 },
    { "crop": "Yams", "group": "Roots", "mt": 85 },
    { "crop": "Soybeans", "group": "Oil crops", "mt": 350 },
    { "crop": "Oil palm fruit", "group": "Oil crops", "mt": 420 },
    { "crop": "Rapeseed", "group": "Oil crops", "mt": 87 },
    { "crop": "Sunflower seed", "group": "Oil crops", "mt": 54 }
  ],
  "name": "crop",
  "value": "mt",
  "group": "group",
  "format": "{value} Mt",
  "title": "The world harvested 1,160 million tonnes of maize in 2022",
  "subtitle": "Harvest of 13 major crops by group, million tonnes, 2022",
  "source": "FAOSTAT",
  "note": "Rounded, approximate figures for illustration"
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
| `theme` | `ThemeInput` | A full theme, `{ light, dark }` partial tokens, or flat tokens applied to both modes. Merged over the surrounding `InsightProvider` theme. |
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
- Used by: [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md)

## More examples

### Flat, with highlight, icons and a size key

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
  // ... 10 more rows
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

### Shaded by value inside one ring

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
  // ... 1 more rows
];

<CirclePack
  data={data}
  name="service"
  value="m"
  format="${value}m"
  colorBy="value"
  ring="all"
  title="Nine services cost $1,366 million a year"
  subtitle="Annual spending by service, $ million"
  note="Illustrative figures for an invented city"
/>
```

### Stress: 27 circles in 5 groups, long names, values from 2 to 1,280

```tsx
import { CirclePack } from "insightcharts";

const data = [
  { category: "Messaging", app: "Chatter", users: 940 },
  { category: "Messaging", app: "Paperplane", users: 310 },
  { category: "Messaging", app: "Hello Neighbour Community Boards", users: 42 },
  { category: "Messaging", app: "Ping", users: 18 },
  { category: "Messaging", app: "Semaphore", users: 6 },
  { category: "Video", app: "Loop", users: 1280 },
  { category: "Video", app: "Screening Room", users: 260 },
  { category: "Video", app: "Clipboard", users: 95 },
  // ... 19 more rows
];

<CirclePack
  data={data}
  name="app"
  value="users"
  group="category"
  format="{value}k"
  sizeLegend
  height={620}
  title="Loop has 1,280 thousand monthly users"
  subtitle="Monthly active users of 27 apps by category, thousands"
  note="Illustrative figures for an invented app catalogue"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/circle-pack.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/circle-pack.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
