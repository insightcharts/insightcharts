# Slope chart (`slope-chart`)

> Connects each entity's value at two (or a few) points with a straight line, labelled with name and value at both ends.

- Component: `SlopeChart` (import from `insightcharts`)
- Spec type: `"slope-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Before / after for 3 to about 15 entities when the change in level and in ordering both matter; pair with `highlight` to emphasise one line.

## Avoid

Five or more time points (use line-chart); when only the ordering matters (use bump-chart); when only the size of each gap matters (use dumbbell-chart or arrow-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/slope-chart
```

The file lands at `components/insightcharts/atoms/slope-chart.tsx`. `@insightcharts/slope-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { SlopeChart } from "insightcharts";

const data = [
  { country: "United Kingdom", y2012: 39, y2023: 1 },
  { country: "Germany", y2012: 44, y2023: 26 },
  { country: "United States", y2012: 37, y2023: 16 },
  { country: "Poland", y2012: 84, y2023: 61 },
  { country: "India", y2012: 71, y2023: 75 },
  { country: "Japan", y2012: 29, y2023: 32 },
];

<SlopeChart
  data={data}
  series="country"
  y={["y2012", "y2023"]}
  names={{ y2012: "2012", y2023: "2023" }}
  highlight="United Kingdom"
  format="{value}%"
  title="The UK's coal share of electricity fell from 39% to 1% between 2012 and 2023"
  subtitle="Share of electricity generated from coal, 2012 and 2023"
  source="Ember (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "slope-chart",
  "data": [
    { "country": "United Kingdom", "y2012": 39, "y2023": 1 },
    { "country": "Germany", "y2012": 44, "y2023": 26 },
    { "country": "United States", "y2012": 37, "y2023": 16 },
    { "country": "Poland", "y2012": 84, "y2023": 61 },
    { "country": "India", "y2012": 71, "y2023": 75 },
    { "country": "Japan", "y2012": 29, "y2023": 32 }
  ],
  "series": "country",
  "y": ["y2012", "y2023"],
  "names": { "y2012": "2012", "y2023": "2023" },
  "highlight": "United Kingdom",
  "format": "{value}%",
  "title": "The UK's coal share of electricity fell from 39% to 1% between 2012 and 2023",
  "subtitle": "Share of electricity generated from coal, 2012 and 2023",
  "source": "Ember (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `series` (required) | `string` |  | Entity field: one line each. |
| `x` | `string` |  | Period field for long data. Omit when each row is an entity with one column per period. |
| `y` (required) | `string \| string[]` |  | Value field (long data), or the period columns in order (one row per entity). |
| `colorBy` | `"none" \| "direction" \| "series"` | `"none"` | Accent for all lines, positive / negative by direction, or one hue per entity (up to 8). |
| `good` | `"up" \| "down"` | `"up"` | Direction that takes the positive colour when colouring by direction. |
| `labels` | `"both" \| "end"` |  | Entity names at both ends or only the end. Default: both; end only on narrow screens. |
| `names` | `Record<string, string>` |  | Display names for entity keys and period columns. |

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
- Used by: [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md)

## More examples

### Coloured by direction

```tsx
import { SlopeChart } from "insightcharts";

const data = [
  { region: "North East", before: 71.2, after: 68.4 },
  { region: "London", before: 68.9, after: 75.1 },
  { region: "South West", before: 76, after: 77.8 },
  { region: "Wales", before: 69.5, after: 72.6 },
  { region: "Scotland", before: 73.4, after: 73.1 },
  { region: "West Midlands", before: 70.1, after: 73.9 },
];

<SlopeChart
  theme="editorial"
  data={data}
  series="region"
  y={["before", "after"]}
  names={{ before: "2014", after: "2024" }}
  colorBy="direction"
  format="{value}%"
  title="London's employment rate rose from 68.9% to 75.1% between 2014 and 2024"
  subtitle="Employment rate, ages 16 to 64, 2014 and 2024"
  note="Illustrative figures."
/>
```

### Long format, three periods

```tsx
import { SlopeChart } from "insightcharts";

const data = [
  { format: "Streaming", year: "2012", share: 9 },
  { format: "Streaming", year: "2016", share: 34 },
  { format: "Streaming", year: "2023", share: 67 },
  { format: "Physical", year: "2012", share: 52 },
  { format: "Physical", year: "2016", share: 31 },
  { format: "Physical", year: "2023", share: 11 },
  { format: "Downloads", year: "2012", share: 31 },
  { format: "Downloads", year: "2016", share: 24 },
  // ... 4 more rows
];

<SlopeChart
  theme="forest"
  data={data}
  series="format"
  x="year"
  y="share"
  colorBy="series"
  format="{value}%"
  height={320}
  title="Streaming's share of recorded music revenue rose from 9% to 67% between 2012 and 2023"
  subtitle="Share of recorded music revenue by format, 2012, 2016 and 2023"
  note="Illustrative figures."
/>
```

### Stress: 20 entities with close values and long names

```tsx
import { SlopeChart } from "insightcharts";

const data = [
  { country: "Democratic Republic of the Congo", y2000: 41, y2022: 62 },
  { country: "United Republic of Tanzania", y2000: 44, y2022: 58 },
  { country: "Central African Republic", y2000: 40, y2022: 43 },
  { country: "Papua New Guinea", y2000: 47, y2022: 49 },
  { country: "Bosnia and Herzegovina", y2000: 71, y2022: 70 },
  { country: "Saint Vincent and the Grenadines", y2000: 69, y2022: 71 },
  { country: "Trinidad and Tobago", y2000: 68, y2022: 66 },
  { country: "Lao People's Democratic Republic", y2000: 52, y2022: 66 },
  // ... 12 more rows
];

<SlopeChart
  theme="mono"
  data={data}
  series="country"
  y={["y2000", "y2022"]}
  names={{ y2000: "2000", y2022: "2022" }}
  highlight={["Ethiopia", "Bangladesh"]}
  height={520}
  title="Life expectancy in Ethiopia rose from 39 to 65 years between 2000 and 2022"
  subtitle="Life expectancy at birth, years, 2000 and 2022. Bangladesh rose from 49 to 73."
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/slope-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/slope-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
