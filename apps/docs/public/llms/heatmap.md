# Heatmap (`heatmap`)

> Colours a category-by-category (or time-by-category) grid by a numeric value, using a sequential or diverging scale.

- Component: `Heatmap` (import from `insightcharts`)
- Spec type: `"heatmap"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Finding patterns across two dimensions at once: hour by weekday, cohort by month, product by region. Good when there are too many series for lines or bars and the overall pattern matters more than exact values.

## Avoid

Precise comparison of a few values (use bar-chart); a single series over time (use line-chart); a daily value across a year (use calendar-heatmap).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/heatmap
```

The file lands at `components/insightcharts/atoms/heatmap.tsx`. `@insightcharts/heatmap-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { day: "Mon", slot: "6am", orders: 12 },
  { day: "Mon", slot: "9am", orders: 48 },
  { day: "Mon", slot: "12pm", orders: 61 },
  { day: "Mon", slot: "3pm", orders: 55 },
  { day: "Mon", slot: "6pm", orders: 38 },
  { day: "Mon", slot: "9pm", orders: 14 },
  { day: "Tue", slot: "6am", orders: 11 },
  { day: "Tue", slot: "9am", orders: 52 },
  { day: "Tue", slot: "12pm", orders: 66 },
  { day: "Tue", slot: "3pm", orders: 58 },
  { day: "Tue", slot: "6pm", orders: 41 },
  { day: "Tue", slot: "9pm", orders: 15 },
  { day: "Wed", slot: "6am", orders: 13 },
  { day: "Wed", slot: "9am", orders: 55 },
  { day: "Wed", slot: "12pm", orders: 70 },
  { day: "Wed", slot: "3pm", orders: 63 },
  { day: "Wed", slot: "6pm", orders: 44 },
  { day: "Wed", slot: "9pm", orders: 17 },
  { day: "Thu", slot: "6am", orders: 12 },
  { day: "Thu", slot: "9am", orders: 51 },
  { day: "Thu", slot: "12pm", orders: 68 },
  { day: "Thu", slot: "3pm", orders: 60 },
  { day: "Thu", slot: "6pm", orders: 47 },
  { day: "Thu", slot: "9pm", orders: 22 },
  { day: "Fri", slot: "6am", orders: 10 },
  { day: "Fri", slot: "9am", orders: 44 },
  { day: "Fri", slot: "12pm", orders: 59 },
  { day: "Fri", slot: "3pm", orders: 49 },
  { day: "Fri", slot: "6pm", orders: 52 },
  { day: "Fri", slot: "9pm", orders: 35 },
  { day: "Sat", slot: "6am", orders: 6 },
  { day: "Sat", slot: "9am", orders: 18 },
  { day: "Sat", slot: "12pm", orders: 31 },
  { day: "Sat", slot: "3pm", orders: 36 },
  { day: "Sat", slot: "6pm", orders: 40 },
  { day: "Sat", slot: "9pm", orders: 38 },
  { day: "Sun", slot: "6am", orders: 5 },
  { day: "Sun", slot: "9am", orders: 14 },
  { day: "Sun", slot: "12pm", orders: 26 },
  { day: "Sun", slot: "3pm", orders: 30 },
  { day: "Sun", slot: "6pm", orders: 28 },
  { day: "Sun", slot: "9pm", orders: 19 },
];

<Heatmap
  theme="dusk"
  data={data}
  x="slot"
  y="day"
  value="orders"
  title="Orders peak at 70 per hour at 12pm on Wednesdays"
  subtitle="Average orders per hour by weekday and time of day"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "heatmap",
  "theme": "dusk",
  "data": [
    { "day": "Mon", "slot": "6am", "orders": 12 },
    { "day": "Mon", "slot": "9am", "orders": 48 },
    { "day": "Mon", "slot": "12pm", "orders": 61 },
    { "day": "Mon", "slot": "3pm", "orders": 55 },
    { "day": "Mon", "slot": "6pm", "orders": 38 },
    { "day": "Mon", "slot": "9pm", "orders": 14 },
    { "day": "Tue", "slot": "6am", "orders": 11 },
    { "day": "Tue", "slot": "9am", "orders": 52 },
    { "day": "Tue", "slot": "12pm", "orders": 66 },
    { "day": "Tue", "slot": "3pm", "orders": 58 },
    { "day": "Tue", "slot": "6pm", "orders": 41 },
    { "day": "Tue", "slot": "9pm", "orders": 15 },
    { "day": "Wed", "slot": "6am", "orders": 13 },
    { "day": "Wed", "slot": "9am", "orders": 55 },
    { "day": "Wed", "slot": "12pm", "orders": 70 },
    { "day": "Wed", "slot": "3pm", "orders": 63 },
    { "day": "Wed", "slot": "6pm", "orders": 44 },
    { "day": "Wed", "slot": "9pm", "orders": 17 },
    { "day": "Thu", "slot": "6am", "orders": 12 },
    { "day": "Thu", "slot": "9am", "orders": 51 },
    { "day": "Thu", "slot": "12pm", "orders": 68 },
    { "day": "Thu", "slot": "3pm", "orders": 60 },
    { "day": "Thu", "slot": "6pm", "orders": 47 },
    { "day": "Thu", "slot": "9pm", "orders": 22 },
    { "day": "Fri", "slot": "6am", "orders": 10 },
    { "day": "Fri", "slot": "9am", "orders": 44 },
    { "day": "Fri", "slot": "12pm", "orders": 59 },
    { "day": "Fri", "slot": "3pm", "orders": 49 },
    { "day": "Fri", "slot": "6pm", "orders": 52 },
    { "day": "Fri", "slot": "9pm", "orders": 35 },
    { "day": "Sat", "slot": "6am", "orders": 6 },
    { "day": "Sat", "slot": "9am", "orders": 18 },
    { "day": "Sat", "slot": "12pm", "orders": 31 },
    { "day": "Sat", "slot": "3pm", "orders": 36 },
    { "day": "Sat", "slot": "6pm", "orders": 40 },
    { "day": "Sat", "slot": "9pm", "orders": 38 },
    { "day": "Sun", "slot": "6am", "orders": 5 },
    { "day": "Sun", "slot": "9am", "orders": 14 },
    { "day": "Sun", "slot": "12pm", "orders": 26 },
    { "day": "Sun", "slot": "3pm", "orders": 30 },
    { "day": "Sun", "slot": "6pm", "orders": 28 },
    { "day": "Sun", "slot": "9pm", "orders": 19 }
  ],
  "x": "slot",
  "y": "day",
  "value": "orders",
  "title": "Orders peak at 70 per hour at 12pm on Wednesdays",
  "subtitle": "Average orders per hour by weekday and time of day",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Column field: a category or a date. |
| `y` (required) | `string` |  | Row field. |
| `value` (required) | `string` |  | Numeric field that colours each cell. One data row per cell. |
| `diverging` | `boolean` | `false` | Diverging palette centred on `midpoint`, for values with a meaningful middle. |
| `midpoint` | `number` | `0` | Centre of the diverging scale. |
| `labels` | `boolean` |  | Print the value in each cell. Default: on when cells are large enough. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order rows by their total. |
| `domain` | `[number, number]` |  | Fix the ends of the colour scale. |

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
- Used by: [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Missing cells (cohort triangle)

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { cohort: "Jan cohort", month: "M0", retained: 1 },
  { cohort: "Jan cohort", month: "M1", retained: 0.64 },
  { cohort: "Jan cohort", month: "M2", retained: 0.58 },
  { cohort: "Jan cohort", month: "M3", retained: 0.49 },
  { cohort: "Jan cohort", month: "M4", retained: 0.46 },
  { cohort: "Jan cohort", month: "M5", retained: 0.41 },
  { cohort: "Jan cohort", month: "M6", retained: 0.36 },
  { cohort: "Jan cohort", month: "M7", retained: 0.31 },
  // ... 28 more rows
];

<Heatmap
  theme="forest"
  data={data}
  x="month"
  y="cohort"
  value="retained"
  format="percent"
  title="Share of each signup cohort still active"
  subtitle="By months since signup, January to August cohorts"
  note="Illustrative data. Hatched cells have not happened yet."
/>
```

### Diverging around zero

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { region: "Arctic", decade: "1900s", anomaly: -1.51 },
  { region: "Arctic", decade: "1910s", anomaly: -1.14 },
  { region: "Arctic", decade: "1920s", anomaly: -0.92 },
  { region: "Arctic", decade: "1930s", anomaly: -0.94 },
  { region: "Arctic", decade: "1940s", anomaly: -0.45 },
  { region: "Arctic", decade: "1950s", anomaly: 0.02 },
  { region: "Arctic", decade: "1960s", anomaly: 0.02 },
  { region: "Arctic", decade: "1970s", anomaly: 0.47 },
  // ... 88 more rows
];

<Heatmap
  theme="science"
  data={data}
  x="decade"
  y="region"
  value="anomaly"
  diverging
  format="signed"
  title="Temperature anomaly by region and decade, 1900s to 2010s"
  subtitle="Difference from the 20th-century mean, °C"
  note="Illustrative data"
/>
```

### Stress: 18 by 24, highlighted row, a gap

```tsx
import { Heatmap } from "insightcharts";

const data = [
  { station: "Station 01", hour: "00:00", trips: 1 },
  { station: "Station 01", hour: "01:00", trips: 0 },
  { station: "Station 01", hour: "02:00", trips: 2 },
  { station: "Station 01", hour: "03:00", trips: 1 },
  { station: "Station 01", hour: "04:00", trips: 2 },
  { station: "Station 01", hour: "05:00", trips: 6 },
  { station: "Station 01", hour: "06:00", trips: 18 },
  { station: "Station 01", hour: "07:00", trips: 35 },
  // ... 420 more rows
];

<Heatmap
  data={data}
  x="hour"
  y="station"
  value="trips"
  highlight="Station 18"
  height={460}
  title="Trips started per hour by station"
  subtitle="Weekday average, 18 stations. Station 18 is highlighted. Station 08 has no data from 10:00 to 13:00."
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/heatmap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/heatmap.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
