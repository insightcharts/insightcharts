# Box plot (`box-plot`)

> Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.

- Component: `BoxPlot` (import from `insightcharts`)
- Spec type: `"box-plot"`
- Level: atom. Category: distribution.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Comparing the centre and spread of a numeric value across several groups, especially with many rows per group and an audience comfortable with quartiles.

## Avoid

A general audience or fewer than about 20 rows per group (use strip-plot or beeswarm-chart, which show the observations themselves); one group whose shape matters, such as two peaks, which a box hides (use histogram).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/box-plot
```

The file lands at `components/insightcharts/atoms/box-plot.tsx`. `@insightcharts/box-plot-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { department: "Emergency", minutes: 12 },
  { department: "Emergency", minutes: 18 },
  { department: "Emergency", minutes: 22 },
  { department: "Emergency", minutes: 25 },
  { department: "Emergency", minutes: 27 },
  { department: "Emergency", minutes: 31 },
  { department: "Emergency", minutes: 34 },
  { department: "Emergency", minutes: 38 },
  { department: "Emergency", minutes: 41 },
  { department: "Emergency", minutes: 44 },
  { department: "Emergency", minutes: 47 },
  { department: "Emergency", minutes: 52 },
  { department: "Emergency", minutes: 58 },
  { department: "Emergency", minutes: 63 },
  { department: "Emergency", minutes: 71 },
  { department: "Emergency", minutes: 84 },
  { department: "Emergency", minutes: 96 },
  { department: "Emergency", minutes: 131 },
  { department: "Emergency", minutes: 188 },
  { department: "Orthopaedics", minutes: 9 },
  { department: "Orthopaedics", minutes: 11 },
  { department: "Orthopaedics", minutes: 14 },
  { department: "Orthopaedics", minutes: 15 },
  { department: "Orthopaedics", minutes: 17 },
  { department: "Orthopaedics", minutes: 19 },
  { department: "Orthopaedics", minutes: 20 },
  { department: "Orthopaedics", minutes: 22 },
  { department: "Orthopaedics", minutes: 24 },
  { department: "Orthopaedics", minutes: 25 },
  { department: "Orthopaedics", minutes: 27 },
  { department: "Orthopaedics", minutes: 29 },
  { department: "Orthopaedics", minutes: 31 },
  { department: "Orthopaedics", minutes: 34 },
  { department: "Orthopaedics", minutes: 38 },
  { department: "Orthopaedics", minutes: 43 },
  { department: "Orthopaedics", minutes: 55 },
  { department: "Cardiology", minutes: 6 },
  { department: "Cardiology", minutes: 8 },
  { department: "Cardiology", minutes: 9 },
  { department: "Cardiology", minutes: 11 },
  { department: "Cardiology", minutes: 12 },
  { department: "Cardiology", minutes: 13 },
  { department: "Cardiology", minutes: 15 },
  { department: "Cardiology", minutes: 16 },
  { department: "Cardiology", minutes: 17 },
  { department: "Cardiology", minutes: 18 },
  { department: "Cardiology", minutes: 20 },
  { department: "Cardiology", minutes: 21 },
  { department: "Cardiology", minutes: 23 },
  { department: "Cardiology", minutes: 26 },
  { department: "Cardiology", minutes: 28 },
  { department: "Cardiology", minutes: 33 },
  { department: "Cardiology", minutes: 61 },
  { department: "Paediatrics", minutes: 4 },
  { department: "Paediatrics", minutes: 5 },
  { department: "Paediatrics", minutes: 7 },
  { department: "Paediatrics", minutes: 8 },
  { department: "Paediatrics", minutes: 9 },
  { department: "Paediatrics", minutes: 10 },
  { department: "Paediatrics", minutes: 11 },
  { department: "Paediatrics", minutes: 12 },
  { department: "Paediatrics", minutes: 12 },
  { department: "Paediatrics", minutes: 13 },
  { department: "Paediatrics", minutes: 14 },
  { department: "Paediatrics", minutes: 16 },
  { department: "Paediatrics", minutes: 17 },
  { department: "Paediatrics", minutes: 19 },
  { department: "Paediatrics", minutes: 22 },
  { department: "Paediatrics", minutes: 24 },
  { department: "Dermatology", minutes: 3 },
  { department: "Dermatology", minutes: 4 },
  { department: "Dermatology", minutes: 5 },
  { department: "Dermatology", minutes: 6 },
  { department: "Dermatology", minutes: 6 },
  { department: "Dermatology", minutes: 7 },
  { department: "Dermatology", minutes: 8 },
  { department: "Dermatology", minutes: 9 },
  { department: "Dermatology", minutes: 9 },
  { department: "Dermatology", minutes: 10 },
  { department: "Dermatology", minutes: 11 },
  { department: "Dermatology", minutes: 12 },
  { department: "Dermatology", minutes: 13 },
  { department: "Dermatology", minutes: 15 },
  { department: "Dermatology", minutes: 18 },
  { department: "Dermatology", minutes: 35 },
];

<BoxPlot
  data={data}
  value="minutes"
  group="department"
  highlight="Emergency"
  format="{value} min"
  title="The median emergency wait was 44 minutes"
  subtitle="Minutes from arrival to being seen, sampled visits by department"
  note="Illustrative data. Box: middle half of visits; line: median; whiskers: within 1.5 × IQR; dots: outliers."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "box-plot",
  "data": [
    { "department": "Emergency", "minutes": 12 },
    { "department": "Emergency", "minutes": 18 },
    { "department": "Emergency", "minutes": 22 },
    { "department": "Emergency", "minutes": 25 },
    { "department": "Emergency", "minutes": 27 },
    { "department": "Emergency", "minutes": 31 },
    { "department": "Emergency", "minutes": 34 },
    { "department": "Emergency", "minutes": 38 },
    { "department": "Emergency", "minutes": 41 },
    { "department": "Emergency", "minutes": 44 },
    { "department": "Emergency", "minutes": 47 },
    { "department": "Emergency", "minutes": 52 },
    { "department": "Emergency", "minutes": 58 },
    { "department": "Emergency", "minutes": 63 },
    { "department": "Emergency", "minutes": 71 },
    { "department": "Emergency", "minutes": 84 },
    { "department": "Emergency", "minutes": 96 },
    { "department": "Emergency", "minutes": 131 },
    { "department": "Emergency", "minutes": 188 },
    { "department": "Orthopaedics", "minutes": 9 },
    { "department": "Orthopaedics", "minutes": 11 },
    { "department": "Orthopaedics", "minutes": 14 },
    { "department": "Orthopaedics", "minutes": 15 },
    { "department": "Orthopaedics", "minutes": 17 },
    { "department": "Orthopaedics", "minutes": 19 },
    { "department": "Orthopaedics", "minutes": 20 },
    { "department": "Orthopaedics", "minutes": 22 },
    { "department": "Orthopaedics", "minutes": 24 },
    { "department": "Orthopaedics", "minutes": 25 },
    { "department": "Orthopaedics", "minutes": 27 },
    { "department": "Orthopaedics", "minutes": 29 },
    { "department": "Orthopaedics", "minutes": 31 },
    { "department": "Orthopaedics", "minutes": 34 },
    { "department": "Orthopaedics", "minutes": 38 },
    { "department": "Orthopaedics", "minutes": 43 },
    { "department": "Orthopaedics", "minutes": 55 },
    { "department": "Cardiology", "minutes": 6 },
    { "department": "Cardiology", "minutes": 8 },
    { "department": "Cardiology", "minutes": 9 },
    { "department": "Cardiology", "minutes": 11 },
    { "department": "Cardiology", "minutes": 12 },
    { "department": "Cardiology", "minutes": 13 },
    { "department": "Cardiology", "minutes": 15 },
    { "department": "Cardiology", "minutes": 16 },
    { "department": "Cardiology", "minutes": 17 },
    { "department": "Cardiology", "minutes": 18 },
    { "department": "Cardiology", "minutes": 20 },
    { "department": "Cardiology", "minutes": 21 },
    { "department": "Cardiology", "minutes": 23 },
    { "department": "Cardiology", "minutes": 26 },
    { "department": "Cardiology", "minutes": 28 },
    { "department": "Cardiology", "minutes": 33 },
    { "department": "Cardiology", "minutes": 61 },
    { "department": "Paediatrics", "minutes": 4 },
    { "department": "Paediatrics", "minutes": 5 },
    { "department": "Paediatrics", "minutes": 7 },
    { "department": "Paediatrics", "minutes": 8 },
    { "department": "Paediatrics", "minutes": 9 },
    { "department": "Paediatrics", "minutes": 10 },
    { "department": "Paediatrics", "minutes": 11 },
    { "department": "Paediatrics", "minutes": 12 },
    { "department": "Paediatrics", "minutes": 12 },
    { "department": "Paediatrics", "minutes": 13 },
    { "department": "Paediatrics", "minutes": 14 },
    { "department": "Paediatrics", "minutes": 16 },
    { "department": "Paediatrics", "minutes": 17 },
    { "department": "Paediatrics", "minutes": 19 },
    { "department": "Paediatrics", "minutes": 22 },
    { "department": "Paediatrics", "minutes": 24 },
    { "department": "Dermatology", "minutes": 3 },
    { "department": "Dermatology", "minutes": 4 },
    { "department": "Dermatology", "minutes": 5 },
    { "department": "Dermatology", "minutes": 6 },
    { "department": "Dermatology", "minutes": 6 },
    { "department": "Dermatology", "minutes": 7 },
    { "department": "Dermatology", "minutes": 8 },
    { "department": "Dermatology", "minutes": 9 },
    { "department": "Dermatology", "minutes": 9 },
    { "department": "Dermatology", "minutes": 10 },
    { "department": "Dermatology", "minutes": 11 },
    { "department": "Dermatology", "minutes": 12 },
    { "department": "Dermatology", "minutes": 13 },
    { "department": "Dermatology", "minutes": 15 },
    { "department": "Dermatology", "minutes": 18 },
    { "department": "Dermatology", "minutes": 35 }
  ],
  "value": "minutes",
  "group": "department",
  "highlight": "Emergency",
  "format": "{value} min",
  "title": "The median emergency wait was 44 minutes",
  "subtitle": "Minutes from arrival to being seen, sampled visits by department",
  "note": "Illustrative data. Box: middle half of visits; line: median; whiskers: within 1.5 × IQR; dots: outliers."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to summarise. Pass raw rows; quartiles are computed in the chart. |
| `group` | `string` |  | Category field: one box per distinct value. Omit for a single box. |
| `label` | `string` |  | Field naming each row, shown when hovering an outlier. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal leaves room for long names; vertical suits ordered categories. |
| `whiskers` | `"tukey" \| "minmax"` | `"tukey"` | `tukey`: furthest point within 1.5 × IQR, the rest drawn as outliers. `minmax`: the extremes. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order boxes by median. |

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
- Used by: no molecule or template yet

## More examples

### Sorted, long labels, many outliers

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { parcel: "Northwind-1000", carrier: "Northwind Express Parcel Service", days: 2.4 },
  { parcel: "Northwind-1001", carrier: "Northwind Express Parcel Service", days: 1.8 },
  { parcel: "Northwind-1002", carrier: "Northwind Express Parcel Service", days: 2.2 },
  { parcel: "Northwind-1003", carrier: "Northwind Express Parcel Service", days: 3.1 },
  { parcel: "Northwind-1004", carrier: "Northwind Express Parcel Service", days: 4 },
  { parcel: "Northwind-1005", carrier: "Northwind Express Parcel Service", days: 2.4 },
  { parcel: "Northwind-1006", carrier: "Northwind Express Parcel Service", days: 2.4 },
  { parcel: "Northwind-1007", carrier: "Northwind Express Parcel Service", days: 1.1 },
  // ... 1072 more rows
];

<BoxPlot
  data={data}
  value="days"
  group="carrier"
  label="parcel"
  sort="asc"
  format="{value}d"
  title="Delivery time by carrier, 180 parcels each"
  subtitle="Days from dispatch to delivery"
  note="Illustrative data"
/>
```

### Vertical, ordered categories

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { month: "Jan", temp: 4.8 },
  { month: "Jan", temp: 7.4 },
  { month: "Jan", temp: 0.4 },
  { month: "Jan", temp: 3.5 },
  { month: "Jan", temp: -0.7 },
  { month: "Jan", temp: 2 },
  { month: "Jan", temp: -1.4 },
  { month: "Jan", temp: 7.2 },
  // ... 352 more rows
];

<BoxPlot
  data={data}
  value="temp"
  group="month"
  orientation="vertical"
  highlight={["Jul", "Aug"]}
  format="{value}°"
  title="Daily mean temperature by month"
  subtitle="°C, 30 readings per month. July and August are highlighted."
  note="Illustrative data"
/>
```

### Single box, min-max whiskers

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { parcel: "Swift-1000", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1001", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1002", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1003", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1004", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1005", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1006", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1007", carrier: "Swift", days: 1.7 },
  // ... 172 more rows
];

<BoxPlot
  data={data}
  value="days"
  whiskers="minmax"
  format="{value}d"
  height={120}
  title="Swift delivery times, 180 parcels"
  subtitle="Days from dispatch to delivery, minimum to maximum"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/box-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/box-plot.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
