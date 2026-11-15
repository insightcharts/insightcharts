# Line chart (`line-chart`)

> Shows how one or more values change over time or another ordered dimension.

- Component: `LineChart` (import from `insightcharts`)
- Spec type: `"line-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Trends over time with roughly 5 or more points; comparing the trajectories of a few series; one highlighted series against many context series.

## Avoid

Unordered categories (use bar-chart); only two time points (use slope-chart); more than about 6 equally important lines (use small-multiples).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/line-chart
```

The file lands at `components/insightcharts/atoms/line-chart.tsx`. `@insightcharts/line-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2019", solar: 2.7, wind: 5.3 },
  { year: "2020", solar: 3.2, wind: 5.9 },
  { year: "2021", solar: 3.7, wind: 6.5 },
  { year: "2022", solar: 4.6, wind: 7.3 },
  { year: "2023", solar: 5.5, wind: 7.8 },
];

<LineChart
  data={data}
  x="year"
  y={["solar", "wind"]}
  format="{value}%"
  title="Solar's share rose from 2.7% to 5.5% between 2019 and 2023"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "line-chart",
  "data": [
    { "year": "2019", "solar": 2.7, "wind": 5.3 },
    { "year": "2020", "solar": 3.2, "wind": 5.9 },
    { "year": "2021", "solar": 3.7, "wind": 6.5 },
    { "year": "2022", "solar": 4.6, "wind": 7.3 },
    { "year": "2023", "solar": 5.5, "wind": 7.8 }
  ],
  "x": "year",
  "y": ["solar", "wind"],
  "format": "{value}%",
  "title": "Solar's share rose from 2.7% to 5.5% between 2019 and 2023"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Time or ordered category field. ISO dates are placed on a true time axis. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one line each). |
| `series` | `string` |  | Field that splits rows into lines (long data). |
| `curve` | `"linear" \| "smooth" \| "step"` | `"linear"` | Line shape. |
| `area` | `boolean` | `false` | Light fill under the line; forces a zero baseline. |
| `endLabels` | `boolean` |  | Name each line at its end. Default: on for up to 6 lines. |
| `points` | `boolean` |  | Marker on every point. Default: on for 12 points or fewer. |
| `zero` | `boolean` | `false` | Start the value axis at zero. |
| `log` | `boolean` | `false` | Logarithmic value axis. |
| `names` | `Record<string, string>` |  | Display names for series keys. |
| `contextLabels` | `boolean \| string` | `false` | With `highlight`: name the grey context lines. `true` adds a muted end label to each when they all fit; a string such as `"Other cities"` adds one muted legend entry instead. On narrow charts the legend already lists every line. |

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
- Used by: [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [chart-tabs](https://insightcharts.dev/llms/chart-tabs.md), [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [linked-charts](https://insightcharts.dev/llms/linked-charts.md), [scrolly-chart](https://insightcharts.dev/llms/scrolly-chart.md), [section](https://insightcharts.dev/llms/section.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md), [report-page](https://insightcharts.dev/llms/report-page.md), [scorecard](https://insightcharts.dev/llms/scorecard.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Highlight with named context lines

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2015", city: "Lagos", share: 20.6 },
  { year: "2015", city: "Nairobi", share: 36 },
  { year: "2015", city: "Kampala", share: 13 },
  { year: "2015", city: "Addis", share: 6.6 },
  { year: "2016", city: "Lagos", share: 26.9 },
  { year: "2016", city: "Nairobi", share: 38.7 },
  { year: "2016", city: "Kampala", share: 16.6 },
  { year: "2016", city: "Addis", share: 14.5 },
  // ... 32 more rows
];

<LineChart
  theme="editorial"
  data={data}
  x="year"
  y="share"
  series="city"
  highlight="Addis"
  contextLabels
  format="{value}%"
  title="Mobile money use in Addis rose from 6.6% in 2015 to 60.8% in 2024"
  subtitle="Share of households with a mobile money account. `contextLabels: true` names the grey lines in muted type."
  note="Illustrative data"
/>
```

### Highlight, one legend entry for the rest, annotations near the right edge

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2015", city: "Lagos", share: 20.6 },
  { year: "2015", city: "Nairobi", share: 36 },
  { year: "2015", city: "Kampala", share: 13 },
  { year: "2015", city: "Addis", share: 6.6 },
  { year: "2016", city: "Lagos", share: 26.9 },
  { year: "2016", city: "Nairobi", share: 38.7 },
  { year: "2016", city: "Kampala", share: 16.6 },
  { year: "2016", city: "Addis", share: 14.5 },
  // ... 32 more rows
];

<LineChart
  theme={{ accent: "#b4237a" }}
  data={data}
  x="year"
  y="share"
  series="city"
  highlight="Addis"
  contextLabels="Other cities"
  annotations={[
    { type: "line", axis: "y", value: 60, label: "National target" },
    { type: "point", x: "2023", y: 49.5, label: "Agent network\nreaches every district" },
  ]}
  format="{value}%"
  title="Addis reached the 60% national target in 2024"
  subtitle="Households with a mobile money account"
  note="Illustrative data"
/>
```

### Stress: six lines converge

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2015", Lagos: 20.6, Nairobi: 36, Accra: 26.6, Dakar: 39.6, Kampala: 13, Addis: 6.6 },
  { year: "2016", Lagos: 26.9, Nairobi: 38.7, Accra: 32.2, Dakar: 43.6, Kampala: 16.6, Addis: 14.5 },
  { year: "2017", Lagos: 31.9, Nairobi: 39.2, Accra: 36.4, Dakar: 46.2, Kampala: 17.9, Addis: 21 },
  { year: "2018", Lagos: 34.1, Nairobi: 42.5, Accra: 37.8, Dakar: 46, Kampala: 22, Addis: 24.7 },
  { year: "2019", Lagos: 38.3, Nairobi: 47.3, Accra: 41.3, Dakar: 47.9, Kampala: 27.6, Addis: 30.4 },
  { year: "2020", Lagos: 44.9, Nairobi: 48.9, Accra: 47.1, Dakar: 52.1, Kampala: 30.1, Addis: 38.5 },
  { year: "2021", Lagos: 48.7, Nairobi: 49.8, Accra: 50.2, Dakar: 53.6, Kampala: 31.8, Addis: 43.9 },
  { year: "2022", Lagos: 50.9, Nairobi: 54.1, Accra: 51.7, Dakar: 53.5, Kampala: 37, Addis: 47.7 },
  // ... 2 more rows
];

<LineChart
  theme="science"
  data={data}
  x="year"
  y={["Lagos", "Nairobi", "Accra", "Dakar", "Kampala", "Addis"]}
  format="{value}%"
  title="Five of six cities had between 58.8% and 61% of households using mobile money in 2024"
  subtitle="Households with a mobile money account"
  note="Illustrative data"
/>
```

### Long format with highlight

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2015", city: "Lagos", share: 20.6 },
  { year: "2015", city: "Nairobi", share: 36 },
  { year: "2015", city: "Kampala", share: 13 },
  { year: "2015", city: "Addis", share: 6.6 },
  { year: "2016", city: "Lagos", share: 26.9 },
  { year: "2016", city: "Nairobi", share: 38.7 },
  { year: "2016", city: "Kampala", share: 16.6 },
  { year: "2016", city: "Addis", share: 14.5 },
  // ... 32 more rows
];

<LineChart
  theme="noir"
  data={data}
  x="year"
  y="share"
  series="city"
  highlight="Addis"
  format="{value}%"
  title="Mobile money use in Addis rose from 6.6% in 2015 to 60.8% in 2024"
  subtitle="Households with a mobile money account"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/line-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/line-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
