# Area chart (`area-chart`)

> Shows a quantity over time as a filled area from zero: one series, stacked series, shares of 100%, or a streamgraph.

- Component: `AreaChart` (import from `insightcharts`)
- Spec type: `"area-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A volume or cumulative quantity over time where the filled magnitude matters; stacked when the total and its composition both matter; percent when only the mix matters; stream for the changing mix of many series over a long period.

## Avoid

Comparing the trajectories of several series against each other (use line-chart: only the bottom band of a stack has a flat baseline); a few time points (use bar-chart with stack); more than about 6 bands.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/area-chart
```

The file lands at `components/insightcharts/atoms/area-chart.tsx`. `@insightcharts/area-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { year: "2014", gw: 180 },
  { year: "2015", gw: 229 },
  { year: "2016", gw: 306 },
  { year: "2017", gw: 405 },
  { year: "2018", gw: 512 },
  { year: "2019", gw: 633 },
  { year: "2020", gw: 774 },
  { year: "2021", gw: 945 },
  { year: "2022", gw: 1177 },
  { year: "2023", gw: 1610 },
];

<AreaChart
  data={data}
  x="year"
  y="gw"
  names={{ gw: "Installed solar capacity" }}
  format="{value} GW"
  title="World solar capacity rose from 180 GW in 2014 to 1,610 GW in 2023"
  subtitle="Cumulative installed solar PV capacity, gigawatts"
  source="IRENA, Renewable Capacity Statistics (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "area-chart",
  "data": [
    { "year": "2014", "gw": 180 },
    { "year": "2015", "gw": 229 },
    { "year": "2016", "gw": 306 },
    { "year": "2017", "gw": 405 },
    { "year": "2018", "gw": 512 },
    { "year": "2019", "gw": 633 },
    { "year": "2020", "gw": 774 },
    { "year": "2021", "gw": 945 },
    { "year": "2022", "gw": 1177 },
    { "year": "2023", "gw": 1610 }
  ],
  "x": "year",
  "y": "gw",
  "names": { "gw": "Installed solar capacity" },
  "format": "{value} GW",
  "title": "World solar capacity rose from 180 GW in 2014 to 1,610 GW in 2023",
  "subtitle": "Cumulative installed solar PV capacity, gigawatts",
  "source": "IRENA, Renewable Capacity Statistics (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Time or ordered category field. ISO dates are placed on a true time axis. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one area each). |
| `series` | `string` |  | Field that splits rows into areas (long data). |
| `stack` | `boolean \| "percent"` | `false` | Stack the areas; `percent` normalises every x position to 100%. |
| `stream` | `boolean` | `false` | Streamgraph: stack around a centred baseline. The value axis is dropped because only band thickness is readable. |
| `curve` | `"linear" \| "smooth" \| "step"` | `"linear"` | Edge shape. A streamgraph defaults to smooth. |
| `labels` | `boolean` |  | Name each band inside itself where it fits; the rest go to the legend. Default: on when stacked. |
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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md)

## More examples

### Stacked, labelled in the bands

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { year: "2000", Coal: 5990, Gas: 2770, Nuclear: 2540, Hydro: 2620, "Wind and solar": 32 },
  { year: "2004", Coal: 6940, Gas: 3450, Nuclear: 2700, Hydro: 2810, "Wind and solar": 88 },
  { year: "2008", Coal: 8260, Gas: 4300, Nuclear: 2660, Hydro: 3250, "Wind and solar": 233 },
  { year: "2012", Coal: 9170, Gas: 5100, Nuclear: 2400, Hydro: 3650, "Wind and solar": 630 },
  { year: "2016", Coal: 9450, Gas: 5800, Nuclear: 2540, Hydro: 4020, "Wind and solar": 1290 },
  { year: "2020", Coal: 9440, Gas: 6370, Nuclear: 2640, Hydro: 4350, "Wind and solar": 2440 },
  { year: "2024", Coal: 10590, Gas: 6790, Nuclear: 2770, Hydro: 4410, "Wind and solar": 4620 },
];

<AreaChart
  data={data}
  x="year"
  y={["Coal", "Gas", "Hydro", "Nuclear", "Wind and solar"]}
  stack
  format="compact"
  title="Wind and solar generated 4,620 TWh of electricity in 2024"
  subtitle="World electricity generation by source, terawatt-hours"
  source="Ember, Global Electricity Review (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### 100% stacked with highlight

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { year: "2000", Coal: 5990, Gas: 2770, Nuclear: 2540, Hydro: 2620, "Wind and solar": 32 },
  { year: "2004", Coal: 6940, Gas: 3450, Nuclear: 2700, Hydro: 2810, "Wind and solar": 88 },
  { year: "2008", Coal: 8260, Gas: 4300, Nuclear: 2660, Hydro: 3250, "Wind and solar": 233 },
  { year: "2012", Coal: 9170, Gas: 5100, Nuclear: 2400, Hydro: 3650, "Wind and solar": 630 },
  { year: "2016", Coal: 9450, Gas: 5800, Nuclear: 2540, Hydro: 4020, "Wind and solar": 1290 },
  { year: "2020", Coal: 9440, Gas: 6370, Nuclear: 2640, Hydro: 4350, "Wind and solar": 2440 },
  { year: "2024", Coal: 10590, Gas: 6790, Nuclear: 2770, Hydro: 4410, "Wind and solar": 4620 },
];

<AreaChart
  data={data}
  x="year"
  y={["Coal", "Gas", "Hydro", "Nuclear", "Wind and solar"]}
  stack="percent"
  highlight="Wind and solar"
  title="Wind and solar's share of electricity rose from 0.2% in 2000 to 15.8% in 2024"
  subtitle="Share of world electricity generation"
  source="Ember, Global Electricity Review (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Streamgraph, long format

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { month: "2021-01-01", genre: "Drama", hours: 58 },
  { month: "2021-02-01", genre: "Drama", hours: 58 },
  { month: "2021-03-01", genre: "Drama", hours: 58 },
  { month: "2021-04-01", genre: "Drama", hours: 55 },
  { month: "2021-05-01", genre: "Drama", hours: 50 },
  { month: "2021-06-01", genre: "Drama", hours: 45 },
  { month: "2021-07-01", genre: "Drama", hours: 38 },
  { month: "2021-08-01", genre: "Drama", hours: 31 },
  // ... 280 more rows
];

<AreaChart
  data={data}
  x="month"
  y="hours"
  series="genre"
  stream
  format="{value}m hours"
  title="Monthly hours watched by genre, 2021 to 2024"
  subtitle="Millions of hours per month, six genres"
  note="Illustrative data"
/>
```

### Overlapping washes

```tsx
import { AreaChart } from "insightcharts";

const data = [
  { "2023": 41, "2024": 52, month: "Jan" },
  { "2023": 44, "2024": 55, month: "Feb" },
  { "2023": 58, "2024": 71, month: "Mar" },
  { "2023": 73, "2024": 80, month: "Apr" },
  { "2023": 96, "2024": 104, month: "May" },
  { "2023": 118, "2024": 131, month: "Jun" },
  { "2023": 134, "2024": 152, month: "Jul" },
  { "2023": 129, "2024": 147, month: "Aug" },
  // ... 4 more rows
];

<AreaChart
  data={data}
  x="month"
  y={["2023", "2024"]}
  curve="smooth"
  format="{value}k"
  title="July bike-share trips rose from 134,000 in 2023 to 152,000 in 2024"
  subtitle="Bike-share trips per month, thousands"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/area-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/area-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
