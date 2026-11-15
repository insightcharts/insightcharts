# Sparkline (`sparkline`)

> A word-sized line or bar series without axes, with the latest point marked.

- Component: `Sparkline` (import from `insightcharts`)
- Spec type: `"sparkline"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Showing the recent history of a number inside a stat tile, a table cell or a sentence, where the shape of the trend matters and exact values do not.

## Avoid

Anything the reader must read values from or compare across series (use line-chart); fewer than about 5 points (state the change in words or use big-number with a delta).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/sparkline
```

The file lands at `components/insightcharts/atoms/sparkline.tsx`. `@insightcharts/sparkline-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Sparkline } from "insightcharts";

const data = [
  { month: "2023-07", rate: 3.9 },
  { month: "2023-08", rate: 3.8 },
  { month: "2023-09", rate: 3.8 },
  { month: "2023-10", rate: 3.6 },
  { month: "2023-11", rate: 3.5 },
  { month: "2023-12", rate: 3.6 },
  { month: "2024-01", rate: 3.4 },
  { month: "2024-02", rate: 3.7 },
  { month: "2024-03", rate: 3.8 },
  { month: "2024-04", rate: 3.9 },
  { month: "2024-05", rate: 4.1 },
  { month: "2024-06", rate: 4.3 },
  { month: "2024-07", rate: 4.2 },
  { month: "2024-08", rate: 4.1 },
  { month: "2024-09", rate: 4.2 },
  { month: "2024-10", rate: 4.4 },
];

<Sparkline
  data={data}
  x="month"
  y="rate"
  format="{value}%"
  showValue
  extremes
  style={{ maxWidth: 220 }}
  alt="Sparkline of the unemployment rate over 16 months, July 2023 to October 2024. It started at 3.9%, fell to 3.4% in January 2024 and ended at 4.4%, the highest in the period."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "sparkline",
  "data": [
    { "month": "2023-07", "rate": 3.9 },
    { "month": "2023-08", "rate": 3.8 },
    { "month": "2023-09", "rate": 3.8 },
    { "month": "2023-10", "rate": 3.6 },
    { "month": "2023-11", "rate": 3.5 },
    { "month": "2023-12", "rate": 3.6 },
    { "month": "2024-01", "rate": 3.4 },
    { "month": "2024-02", "rate": 3.7 },
    { "month": "2024-03", "rate": 3.8 },
    { "month": "2024-04", "rate": 3.9 },
    { "month": "2024-05", "rate": 4.1 },
    { "month": "2024-06", "rate": 4.3 },
    { "month": "2024-07", "rate": 4.2 },
    { "month": "2024-08", "rate": 4.1 },
    { "month": "2024-09", "rate": 4.2 },
    { "month": "2024-10", "rate": 4.4 }
  ],
  "x": "month",
  "y": "rate",
  "format": "{value}%",
  "showValue": true,
  "extremes": true,
  "style": { "maxWidth": 220 },
  "alt": "Sparkline of the unemployment rate over 16 months, July 2023 to October 2024. It started at 3.9%, fell to 3.4% in January 2024 and ended at 4.4%, the highest in the period."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `y` (required) | `string` |  | Value field. |
| `x` | `string` |  | Time or label field, used in the tooltip and alt text. Rows are drawn in data order. |
| `mark` | `"line" \| "bar"` | `"line"` | Line for a trend, bars for discrete counts or gains and losses (negative bars take the negative colour). |
| `extremes` | `boolean` | `false` | Mark the lowest and highest points with small dots. |
| `band` | `[number, number]` |  | Shaded reference range in value units, e.g. a normal range. |
| `area` | `boolean` | `false` | Light fill under the line; forces a zero baseline. |
| `showValue` | `boolean` | `false` | Print the last value after the line. |
| `zero` | `boolean` |  | Include zero in the scale. Default: off for lines, always on for bars. |

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
- Used by: [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [before-after](https://insightcharts.dev/llms/before-after.md), [comparison-table](https://insightcharts.dev/llms/comparison-table.md), [quote-figure](https://insightcharts.dev/llms/quote-figure.md), [trend-card](https://insightcharts.dev/llms/trend-card.md)

## More examples

### With a reference band

```tsx
import { Sparkline } from "insightcharts";

const data = [
  { reading: 1, mmol: 5.6 },
  { reading: 2, mmol: 5.8 },
  { reading: 3, mmol: 5.5 },
  { reading: 4, mmol: 5.6 },
  { reading: 5, mmol: 5.2 },
  { reading: 6, mmol: 5.3 },
  { reading: 7, mmol: 5.5 },
  { reading: 8, mmol: 5.5 },
  // ... 40 more rows
];

<Sparkline
  theme={{ accent: "#b4237a" }}
  data={data}
  x="reading"
  y="mmol"
  band={[3.9, 7]}
  extremes
  showValue
  format="decimal:1"
  style={{ maxWidth: 280 }}
  title="Blood glucose over 48 readings"
  subtitle="Blood glucose, mmol/L. The band is the 3.9 to 7.0 target range."
  note="Illustrative data"
/>
```

### Bars: gains and losses

```tsx
import { Sparkline } from "insightcharts";

const data = [
  { week: "W1", net: 4 },
  { week: "W2", net: 7 },
  { week: "W3", net: -3 },
  { week: "W4", net: 5 },
  { week: "W5", net: 9 },
  { week: "W6", net: -6 },
  { week: "W7", net: -2 },
  { week: "W8", net: 8 },
  // ... 6 more rows
];

<Sparkline
  theme="mono"
  data={data}
  x="week"
  y="net"
  mark="bar"
  showValue
  format="signed"
  style={{ maxWidth: 220 }}
/>
```

### Area fill, full width

```tsx
import { Sparkline } from "insightcharts";

const data = [
  { month: 1, signups: 18 },
  { month: 2, signups: 22 },
  { month: 3, signups: 21 },
  { month: 4, signups: 27 },
  { month: 5, signups: 33 },
  { month: 6, signups: 31 },
  { month: 7, signups: 38 },
  { month: 8, signups: 44 },
  // ... 4 more rows
];

<Sparkline theme="ocean" data={data} y="signups" area height={56} />
```

### Stress: 400 points in 160px

```tsx
import { Sparkline } from "insightcharts";

const data = [
  { day: 1, price: 99.86 },
  { day: 2, price: 99.76 },
  { day: 3, price: 99.17 },
  { day: 4, price: 98.87 },
  { day: 5, price: 98.87 },
  { day: 6, price: 100.1 },
  { day: 7, price: 101.27 },
  { day: 8, price: 100.87 },
  // ... 392 more rows
];

<Sparkline
  theme="science"
  data={data}
  x="day"
  y="price"
  extremes
  showValue
  format="decimal:0"
  style={{ maxWidth: 160 }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/sparkline.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/sparkline.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
