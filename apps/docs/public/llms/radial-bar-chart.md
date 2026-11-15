# Radial bar chart (`radial-bar-chart`)

> Draws bars around a circle for data that repeats in a cycle, such as hours of the day or months of the year.

- Component: `RadialBarChart` (import from `insightcharts`)
- Spec type: `"radial-bar-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Only when the dimension is cyclical and the wrap-around matters: activity by hour of day, seasonality by month, wind by compass direction. The first category is placed at 12 o'clock.

## Avoid

Any dimension that does not wrap around: categories, rankings, years (use bar-chart); precise comparison of values, since bars further out look bigger (use bar-chart or line-chart); more than about 3 stacked series.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/radial-bar-chart
```

The file lands at `components/insightcharts/atoms/radial-bar-chart.tsx`. `@insightcharts/radial-bar-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RadialBarChart } from "insightcharts";

const data = [
  { hour: "00:00", trips: 2.1 },
  { hour: "01:00", trips: 1.2 },
  { hour: "02:00", trips: 0.8 },
  { hour: "03:00", trips: 0.6 },
  { hour: "04:00", trips: 0.7 },
  { hour: "05:00", trips: 1.4 },
  { hour: "06:00", trips: 3.6 },
  { hour: "07:00", trips: 6.9 },
  { hour: "08:00", trips: 8.8 },
  { hour: "09:00", trips: 6.4 },
  { hour: "10:00", trips: 5.1 },
  { hour: "11:00", trips: 5.3 },
  { hour: "12:00", trips: 5.9 },
  { hour: "13:00", trips: 5.6 },
  { hour: "14:00", trips: 5.4 },
  { hour: "15:00", trips: 6 },
  { hour: "16:00", trips: 7.4 },
  { hour: "17:00", trips: 9.2 },
  { hour: "18:00", trips: 8.1 },
  { hour: "19:00", trips: 6 },
  { hour: "20:00", trips: 4.6 },
  { hour: "21:00", trips: 3.9 },
  { hour: "22:00", trips: 3.3 },
  { hour: "23:00", trips: 2.7 },
];

<RadialBarChart
  theme="dusk"
  data={data}
  x="hour"
  y="trips"
  format="{value}%"
  centerLabel="24 hours"
  highlight={["08:00", "17:00"]}
  title="Weekday bike-share trips peak at 9.2% in the 5pm hour and 8.8% in the 8am hour"
  subtitle="Share of daily bike-share trips starting in each hour, weekdays"
  source="Illustrative bike-share data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "dusk",
  "type": "radial-bar-chart",
  "data": [
    { "hour": "00:00", "trips": 2.1 },
    { "hour": "01:00", "trips": 1.2 },
    { "hour": "02:00", "trips": 0.8 },
    { "hour": "03:00", "trips": 0.6 },
    { "hour": "04:00", "trips": 0.7 },
    { "hour": "05:00", "trips": 1.4 },
    { "hour": "06:00", "trips": 3.6 },
    { "hour": "07:00", "trips": 6.9 },
    { "hour": "08:00", "trips": 8.8 },
    { "hour": "09:00", "trips": 6.4 },
    { "hour": "10:00", "trips": 5.1 },
    { "hour": "11:00", "trips": 5.3 },
    { "hour": "12:00", "trips": 5.9 },
    { "hour": "13:00", "trips": 5.6 },
    { "hour": "14:00", "trips": 5.4 },
    { "hour": "15:00", "trips": 6 },
    { "hour": "16:00", "trips": 7.4 },
    { "hour": "17:00", "trips": 9.2 },
    { "hour": "18:00", "trips": 8.1 },
    { "hour": "19:00", "trips": 6 },
    { "hour": "20:00", "trips": 4.6 },
    { "hour": "21:00", "trips": 3.9 },
    { "hour": "22:00", "trips": 3.3 },
    { "hour": "23:00", "trips": 2.7 }
  ],
  "x": "hour",
  "y": "trips",
  "format": "{value}%",
  "centerLabel": "24 hours",
  "highlight": ["08:00", "17:00"],
  "title": "Weekday bike-share trips peak at 9.2% in the 5pm hour and 8.8% in the 8am hour",
  "subtitle": "Share of daily bike-share trips starting in each hour, weekdays",
  "source": "Illustrative bike-share data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | The cyclical category field, in cycle order. |
| `y` (required) | `string \| string[]` |  | Value field, or several to stack. |
| `series` | `string` |  | Field that splits rows into stacked series (long data). |
| `labelEvery` | `number` |  | Label every nth category around the rim. Default: chosen to avoid crowding. |
| `labels` | `boolean` |  | Print the value on the tallest bar. Default: on for a single series. |
| `centerFirst` | `boolean` | `false` | Centre the first category on 12 o'clock (compass directions) instead of starting its band there (hours). |
| `centerLabel` | `string` |  | Text in the centre of the ring, e.g. "24 hours". |
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
- Used by: [story-deck](https://insightcharts.dev/llms/story-deck.md)

## More examples

### Months

```tsx
import { RadialBarChart } from "insightcharts";

const data = [
  { month: "Jan", mm: 48 },
  { month: "Feb", mm: 41 },
  { month: "Mar", mm: 38 },
  { month: "Apr", mm: 52 },
  { month: "May", mm: 71 },
  { month: "Jun", mm: 96 },
  { month: "Jul", mm: 118 },
  { month: "Aug", mm: 112 },
  // ... 4 more rows
];

<RadialBarChart
  theme={{ accent: "#0f766e" }}
  data={data}
  x="month"
  y="mm"
  format="{value} mm"
  centerLabel="Year"
  title="Munich averages 118 mm of rain in July and 38 mm in March"
  subtitle="Average monthly rainfall, Munich, 1991-2020"
  source="Deutscher Wetterdienst"
  note="Rounded, approximate figures for illustration"
/>
```

### Stacked series

```tsx
import { RadialBarChart } from "insightcharts";

const data = [
  { hour: "0", weekday: 38, weekend: 18 },
  { hour: "1", weekday: 26, weekend: 18 },
  { hour: "2", weekday: 18, weekend: 18 },
  { hour: "3", weekday: 14, weekend: 18 },
  { hour: "4", weekday: 17, weekend: 19 },
  { hour: "5", weekday: 34, weekend: 20 },
  { hour: "6", weekday: 82, weekend: 22 },
  { hour: "7", weekday: 141, weekend: 26 },
  // ... 16 more rows
];

<RadialBarChart
  theme="earth"
  data={data}
  x="hour"
  y={["weekday", "weekend"]}
  names={{ weekday: "Weekdays", weekend: "Weekends" }}
  centerLabel="Hour of day"
  title="Weekday emergency calls peak at 172 per hour at 5pm"
  subtitle="Average emergency calls per hour by hour of day, weekdays and weekends"
  source="Illustrative data"
/>
```

### Stress: long labels, compass

```tsx
import { RadialBarChart } from "insightcharts";

const data = [
  { direction: "North", share: 6 },
  { direction: "North-north-east", share: 4 },
  { direction: "North-east", share: 5 },
  { direction: "East-north-east", share: 3 },
  { direction: "East", share: 4 },
  { direction: "East-south-east", share: 3 },
  { direction: "South-east", share: 5 },
  { direction: "South-south-east", share: 6 },
  // ... 8 more rows
];

<RadialBarChart
  theme="science"
  data={data}
  x="direction"
  y="share"
  format="{value}%"
  centerFirst
  height={420}
  title="The wind at Heathrow blows from the south-west 16% of the time"
  subtitle="Share of hours by wind direction, Heathrow, annual average"
  source="Illustrative data based on Met Office wind roses"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/radial-bar-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/radial-bar-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
