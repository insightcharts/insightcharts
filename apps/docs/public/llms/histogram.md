# Histogram (`histogram`)

> Bins a numeric field and shows how many rows fall in each bin, as touching bars on a continuous axis.

- Component: `Histogram` (import from `insightcharts`)
- Spec type: `"histogram"`
- Level: atom. Category: distribution.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Showing the shape of a distribution for one numeric variable with roughly 50 rows or more: its centre, spread, skew, gaps and multiple peaks.

## Avoid

Comparing distributions across several groups (use box-plot or beeswarm-chart); under about 50 rows, where every observation can be shown (use strip-plot or beeswarm-chart); counts by category (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/histogram
```

The file lands at `components/insightcharts/atoms/histogram.tsx`. `@insightcharts/histogram-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Histogram } from "insightcharts";

const data = [
  { minutes: 14 },
  { minutes: 18 },
  { minutes: 18 },
  { minutes: 19 },
  { minutes: 20 },
  { minutes: 21 },
  { minutes: 21 },
  { minutes: 22 },
  { minutes: 23 },
  { minutes: 23 },
  { minutes: 23 },
  { minutes: 23 },
  { minutes: 24 },
  { minutes: 25 },
  { minutes: 25 },
  { minutes: 27 },
  { minutes: 27 },
  { minutes: 27 },
  { minutes: 27 },
  { minutes: 27 },
  { minutes: 28 },
  { minutes: 28 },
  { minutes: 28 },
  { minutes: 28 },
  { minutes: 29 },
  { minutes: 29 },
  { minutes: 29 },
  { minutes: 29 },
  { minutes: 30 },
  { minutes: 31 },
  { minutes: 31 },
  { minutes: 31 },
  { minutes: 31 },
  { minutes: 32 },
  { minutes: 32 },
  { minutes: 32 },
  { minutes: 32 },
  { minutes: 32 },
  { minutes: 33 },
  { minutes: 33 },
  { minutes: 33 },
  { minutes: 34 },
  { minutes: 34 },
  { minutes: 34 },
  { minutes: 34 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 35 },
  { minutes: 36 },
  { minutes: 36 },
  { minutes: 36 },
  { minutes: 37 },
  { minutes: 37 },
  { minutes: 37 },
  { minutes: 38 },
  { minutes: 38 },
  { minutes: 40 },
  { minutes: 40 },
  { minutes: 40 },
  { minutes: 40 },
  { minutes: 41 },
  { minutes: 41 },
  { minutes: 42 },
  { minutes: 42 },
  { minutes: 42 },
  { minutes: 43 },
  { minutes: 45 },
  { minutes: 45 },
  { minutes: 46 },
  { minutes: 47 },
  { minutes: 47 },
  { minutes: 48 },
  { minutes: 48 },
  { minutes: 49 },
  { minutes: 49 },
  { minutes: 51 },
  { minutes: 51 },
  { minutes: 54 },
  { minutes: 54 },
  { minutes: 55 },
  { minutes: 57 },
  { minutes: 57 },
  { minutes: 59 },
  { minutes: 59 },
  { minutes: 61 },
  { minutes: 66 },
];

<Histogram
  data={data}
  value="minutes"
  step={5}
  median
  countLabel="Commuters"
  format="{value} min"
  title="The median commute of 90 surveyed employees was 34.5 minutes"
  subtitle="One-way commute time, in 5-minute bins"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "histogram",
  "data": [
    { "minutes": 14 },
    { "minutes": 18 },
    { "minutes": 18 },
    { "minutes": 19 },
    { "minutes": 20 },
    { "minutes": 21 },
    { "minutes": 21 },
    { "minutes": 22 },
    { "minutes": 23 },
    { "minutes": 23 },
    { "minutes": 23 },
    { "minutes": 23 },
    { "minutes": 24 },
    { "minutes": 25 },
    { "minutes": 25 },
    { "minutes": 27 },
    { "minutes": 27 },
    { "minutes": 27 },
    { "minutes": 27 },
    { "minutes": 27 },
    { "minutes": 28 },
    { "minutes": 28 },
    { "minutes": 28 },
    { "minutes": 28 },
    { "minutes": 29 },
    { "minutes": 29 },
    { "minutes": 29 },
    { "minutes": 29 },
    { "minutes": 30 },
    { "minutes": 31 },
    { "minutes": 31 },
    { "minutes": 31 },
    { "minutes": 31 },
    { "minutes": 32 },
    { "minutes": 32 },
    { "minutes": 32 },
    { "minutes": 32 },
    { "minutes": 32 },
    { "minutes": 33 },
    { "minutes": 33 },
    { "minutes": 33 },
    { "minutes": 34 },
    { "minutes": 34 },
    { "minutes": 34 },
    { "minutes": 34 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 35 },
    { "minutes": 36 },
    { "minutes": 36 },
    { "minutes": 36 },
    { "minutes": 37 },
    { "minutes": 37 },
    { "minutes": 37 },
    { "minutes": 38 },
    { "minutes": 38 },
    { "minutes": 40 },
    { "minutes": 40 },
    { "minutes": 40 },
    { "minutes": 40 },
    { "minutes": 41 },
    { "minutes": 41 },
    { "minutes": 42 },
    { "minutes": 42 },
    { "minutes": 42 },
    { "minutes": 43 },
    { "minutes": 45 },
    { "minutes": 45 },
    { "minutes": 46 },
    { "minutes": 47 },
    { "minutes": 47 },
    { "minutes": 48 },
    { "minutes": 48 },
    { "minutes": 49 },
    { "minutes": 49 },
    { "minutes": 51 },
    { "minutes": 51 },
    { "minutes": 54 },
    { "minutes": 54 },
    { "minutes": 55 },
    { "minutes": 57 },
    { "minutes": 57 },
    { "minutes": 59 },
    { "minutes": 59 },
    { "minutes": 61 },
    { "minutes": 66 }
  ],
  "value": "minutes",
  "step": 5,
  "median": true,
  "countLabel": "Commuters",
  "format": "{value} min",
  "title": "The median commute of 90 surveyed employees was 34.5 minutes",
  "subtitle": "One-way commute time, in 5-minute bins",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to bin. |
| `bins` | `number` |  | Approximate number of bins; the width is rounded to a tidy step. Default: from the row count. |
| `step` | `number` |  | Exact bin width in value units. Overrides `bins`. |
| `median` | `boolean` | `false` | Vertical marker at the median. |
| `mean` | `boolean` | `false` | Vertical marker at the mean. |
| `normalize` | `boolean` | `false` | Share of rows per bin instead of a count. |
| `countLabel` | `string` |  | Title for the count axis, e.g. "Runners". |

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

### Large sample, 10-minute bins

```tsx
import { Histogram } from "insightcharts";

const data = [
  { minutes: 321 },
  { minutes: 263 },
  { minutes: 285 },
  { minutes: 310 },
  { minutes: 274 },
  { minutes: 250 },
  { minutes: 285 },
  { minutes: 266 },
  // ... 1192 more rows
];

<Histogram
  data={data}
  value="minutes"
  step={10}
  median
  countLabel="Finishers"
  format="{value} min"
  title="Finish times of 1,200 marathon runners"
  subtitle="Minutes, in 10-minute bins. The line marks the median."
  note="Illustrative data"
/>
```

### Skewed, with mean and median

```tsx
import { Histogram } from "insightcharts";

const data = [
  { income: 31300 },
  { income: 35600 },
  { income: 15500 },
  { income: 14300 },
  { income: 48200 },
  { income: 25500 },
  { income: 18000 },
  { income: 69600 },
  // ... 2987 more rows
];

<Histogram
  data={data}
  value="income"
  step={10000}
  mean
  median
  normalize
  format="currency:USD"
  countLabel="Share of households"
  title="Household income distribution"
  subtitle="Share of households in each $10,000 bin, with the mean and the median marked"
  note="Illustrative data"
/>
```

### Two peaks

```tsx
import { Histogram } from "insightcharts";

const data = [
  { wait: 51 },
  { wait: 72 },
  { wait: 76 },
  { wait: 60 },
  { wait: 82 },
  { wait: 88 },
  { wait: 52 },
  { wait: 82 },
  // ... 264 more rows
];

<Histogram
  data={data}
  value="wait"
  bins={20}
  countLabel="Eruptions"
  format="{value} min"
  annotations={[{ type: "band", axis: "x", from: 62, to: 70, label: "Rarely" }]}
  title="Waiting time between Old Faithful eruptions"
  subtitle="Minutes between eruptions, 272 observations"
  note="Illustrative data modelled on the Old Faithful geyser dataset"
/>
```

### Stress: few rows, many bins

```tsx
import { Histogram } from "insightcharts";

const data = [
  { days: 2 },
  { days: 3 },
  { days: 3 },
  { days: 4 },
  { days: 4 },
  { days: 4 },
  { days: 5 },
  { days: 5 },
  // ... 7 more rows
];

<Histogram
  data={data}
  value="days"
  step={1}
  median
  countLabel="Tickets"
  format="{value}d"
  title="11 of 15 support tickets closed within 7 days"
  subtitle="Days to resolution, 15 support tickets"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/histogram.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/histogram.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
