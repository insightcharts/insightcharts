# Small multiples (`small-multiples`)

> Repeats one small line, area or bar chart per value of a facet field on a shared scale, each panel titled.

- Component: `SmallMultiples` (import from `insightcharts`)
- Spec type: `"small-multiples"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

The same measure for 4 to about 24 entities when one chart would have too many overlapping lines; pair with `highlight` to pick out one panel, or `context` to show every other line faintly behind each.

## Avoid

Three or fewer series (use line-chart with direct labels); when exact comparison between two entities matters most (use line-chart with `highlight`); a single value per entity (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/small-multiples
```

The file lands at `components/insightcharts/atoms/small-multiples.tsx`. `@insightcharts/small-multiples-demo` adds a ready-made example next to it.

## Usage

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { country: "Germany", year: "2010", rate: 6.8 },
  { country: "Germany", year: "2013", rate: 5 },
  { country: "Germany", year: "2015", rate: 4.6 },
  { country: "Germany", year: "2017", rate: 3.8 },
  { country: "Germany", year: "2019", rate: 3.1 },
  { country: "Germany", year: "2021", rate: 3.6 },
  { country: "Germany", year: "2023", rate: 3 },
  { country: "Germany", year: "2024", rate: 3.4 },
  { country: "Spain", year: "2010", rate: 19.9 },
  { country: "Spain", year: "2013", rate: 26.1 },
  { country: "Spain", year: "2015", rate: 22.1 },
  { country: "Spain", year: "2017", rate: 17.2 },
  { country: "Spain", year: "2019", rate: 14.1 },
  { country: "Spain", year: "2021", rate: 14.8 },
  { country: "Spain", year: "2023", rate: 12.2 },
  { country: "Spain", year: "2024", rate: 11.4 },
  { country: "Italy", year: "2010", rate: 8.4 },
  { country: "Italy", year: "2013", rate: 12.1 },
  { country: "Italy", year: "2015", rate: 11.9 },
  { country: "Italy", year: "2017", rate: 11.2 },
  { country: "Italy", year: "2019", rate: 9.9 },
  { country: "Italy", year: "2021", rate: 9.5 },
  { country: "Italy", year: "2023", rate: 7.7 },
  { country: "Italy", year: "2024", rate: 6.5 },
  { country: "France", year: "2010", rate: 9.3 },
  { country: "France", year: "2013", rate: 10.3 },
  { country: "France", year: "2015", rate: 10.4 },
  { country: "France", year: "2017", rate: 9.4 },
  { country: "France", year: "2019", rate: 8.4 },
  { country: "France", year: "2021", rate: 7.9 },
  { country: "France", year: "2023", rate: 7.3 },
  { country: "France", year: "2024", rate: 7.4 },
  { country: "Greece", year: "2010", rate: 12.7 },
  { country: "Greece", year: "2013", rate: 27.5 },
  { country: "Greece", year: "2015", rate: 24.9 },
  { country: "Greece", year: "2017", rate: 21.5 },
  { country: "Greece", year: "2019", rate: 17.3 },
  { country: "Greece", year: "2021", rate: 14.7 },
  { country: "Greece", year: "2023", rate: 11.1 },
  { country: "Greece", year: "2024", rate: 10.1 },
  { country: "Poland", year: "2010", rate: 9.7 },
  { country: "Poland", year: "2013", rate: 10.3 },
  { country: "Poland", year: "2015", rate: 7.5 },
  { country: "Poland", year: "2017", rate: 4.9 },
  { country: "Poland", year: "2019", rate: 3.3 },
  { country: "Poland", year: "2021", rate: 3.4 },
  { country: "Poland", year: "2023", rate: 2.8 },
  { country: "Poland", year: "2024", rate: 2.9 },
];

<SmallMultiples
  data={data}
  facet="country"
  x="year"
  y="rate"
  highlight="Greece"
  format="{value}%"
  title="Greek unemployment fell from 27.5% in 2013 to 10.1% in 2024"
  subtitle="Unemployment rate, 2010 to 2024, same scale in every panel"
  source="Eurostat (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "small-multiples",
  "data": [
    { "country": "Germany", "year": "2010", "rate": 6.8 },
    { "country": "Germany", "year": "2013", "rate": 5 },
    { "country": "Germany", "year": "2015", "rate": 4.6 },
    { "country": "Germany", "year": "2017", "rate": 3.8 },
    { "country": "Germany", "year": "2019", "rate": 3.1 },
    { "country": "Germany", "year": "2021", "rate": 3.6 },
    { "country": "Germany", "year": "2023", "rate": 3 },
    { "country": "Germany", "year": "2024", "rate": 3.4 },
    { "country": "Spain", "year": "2010", "rate": 19.9 },
    { "country": "Spain", "year": "2013", "rate": 26.1 },
    { "country": "Spain", "year": "2015", "rate": 22.1 },
    { "country": "Spain", "year": "2017", "rate": 17.2 },
    { "country": "Spain", "year": "2019", "rate": 14.1 },
    { "country": "Spain", "year": "2021", "rate": 14.8 },
    { "country": "Spain", "year": "2023", "rate": 12.2 },
    { "country": "Spain", "year": "2024", "rate": 11.4 },
    { "country": "Italy", "year": "2010", "rate": 8.4 },
    { "country": "Italy", "year": "2013", "rate": 12.1 },
    { "country": "Italy", "year": "2015", "rate": 11.9 },
    { "country": "Italy", "year": "2017", "rate": 11.2 },
    { "country": "Italy", "year": "2019", "rate": 9.9 },
    { "country": "Italy", "year": "2021", "rate": 9.5 },
    { "country": "Italy", "year": "2023", "rate": 7.7 },
    { "country": "Italy", "year": "2024", "rate": 6.5 },
    { "country": "France", "year": "2010", "rate": 9.3 },
    { "country": "France", "year": "2013", "rate": 10.3 },
    { "country": "France", "year": "2015", "rate": 10.4 },
    { "country": "France", "year": "2017", "rate": 9.4 },
    { "country": "France", "year": "2019", "rate": 8.4 },
    { "country": "France", "year": "2021", "rate": 7.9 },
    { "country": "France", "year": "2023", "rate": 7.3 },
    { "country": "France", "year": "2024", "rate": 7.4 },
    { "country": "Greece", "year": "2010", "rate": 12.7 },
    { "country": "Greece", "year": "2013", "rate": 27.5 },
    { "country": "Greece", "year": "2015", "rate": 24.9 },
    { "country": "Greece", "year": "2017", "rate": 21.5 },
    { "country": "Greece", "year": "2019", "rate": 17.3 },
    { "country": "Greece", "year": "2021", "rate": 14.7 },
    { "country": "Greece", "year": "2023", "rate": 11.1 },
    { "country": "Greece", "year": "2024", "rate": 10.1 },
    { "country": "Poland", "year": "2010", "rate": 9.7 },
    { "country": "Poland", "year": "2013", "rate": 10.3 },
    { "country": "Poland", "year": "2015", "rate": 7.5 },
    { "country": "Poland", "year": "2017", "rate": 4.9 },
    { "country": "Poland", "year": "2019", "rate": 3.3 },
    { "country": "Poland", "year": "2021", "rate": 3.4 },
    { "country": "Poland", "year": "2023", "rate": 2.8 },
    { "country": "Poland", "year": "2024", "rate": 2.9 }
  ],
  "facet": "country",
  "x": "year",
  "y": "rate",
  "highlight": "Greece",
  "format": "{value}%",
  "title": "Greek unemployment fell from 27.5% in 2013 to 10.1% in 2024",
  "subtitle": "Unemployment rate, 2010 to 2024, same scale in every panel",
  "source": "Eurostat (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `facet` (required) | `string` |  | Field whose values each get a panel. |
| `x` (required) | `string` |  | Time or ordered category field, shared by every panel. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one series each in every panel). |
| `series` | `string` |  | Field that splits rows into series inside each panel (long data). |
| `kind` | `"line" \| "area" \| "bar"` | `"line"` | What each panel draws. Area and bar panels start at zero. |
| `columns` | `number` |  | Preferred number of columns; reduced automatically on narrow containers. |
| `scales` | `"shared" \| "free"` | `"shared"` | Shared value scale across panels, or each panel on its own (say so in the subtitle). |
| `context` | `boolean` | `false` | Draw every other panel's line faintly behind each panel's own. |
| `latest` | `boolean` |  | Print the latest value beside each panel title. Default: on for a single series. |
| `names` | `Record<string, string>` |  | Display names for facet values and series keys. |

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
- Used by: [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Every other line as context

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { city: "Phoenix", month: "Jan", temp: 12.4 },
  { city: "Phoenix", month: "Feb", temp: 14.1 },
  { city: "Phoenix", month: "Mar", temp: 17.6 },
  { city: "Phoenix", month: "Apr", temp: 22.8 },
  { city: "Phoenix", month: "May", temp: 27.9 },
  { city: "Phoenix", month: "Jun", temp: 31.2 },
  { city: "Phoenix", month: "Jul", temp: 33 },
  { city: "Phoenix", month: "Aug", temp: 31.8 },
  // ... 88 more rows
];

<SmallMultiples
  data={data}
  facet="city"
  x="month"
  y="temp"
  context
  format="{value}°"
  height={380}
  title="Chicago's average monthly temperature ranges from -3.2°C to 24.3°C"
  subtitle="Average monthly temperature, °C. Honolulu ranges from 23.0 to 27.9. Grey lines show the other cities."
  source="NOAA climate normals (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Bars, two series per panel (wide data)

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { region: "North", quarter: "Q1", store: 42, online: 31 },
  { region: "North", quarter: "Q2", store: 48, online: 36 },
  { region: "North", quarter: "Q3", store: 55, online: 39 },
  { region: "North", quarter: "Q4", store: 61, online: 44 },
  { region: "South", quarter: "Q1", store: 28, online: 30 },
  { region: "South", quarter: "Q2", store: 31, online: 34 },
  { region: "South", quarter: "Q3", store: 33, online: 39 },
  { region: "South", quarter: "Q4", store: 36, online: 45 },
  // ... 8 more rows
];

<SmallMultiples
  data={data}
  facet="region"
  x="quarter"
  y={["store", "online"]}
  names={{ store: "In store", online: "Online" }}
  kind="bar"
  format="currency:USD"
  height={300}
  title="The South sold $45 million online and $36 million in store in Q4"
  subtitle="Quarterly sales by channel, $ millions"
  note="Illustrative figures."
/>
```

### Stress: 20 panels with long titles

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { country: "United States of America", year: "2013", index: 100 },
  { country: "United States of America", year: "2014", index: 101 },
  { country: "United States of America", year: "2015", index: 96 },
  { country: "United States of America", year: "2016", index: 91 },
  { country: "United States of America", year: "2017", index: 92 },
  { country: "United States of America", year: "2018", index: 87 },
  { country: "United States of America", year: "2019", index: 82 },
  { country: "United States of America", year: "2020", index: 71 },
  // ... 232 more rows
];

<SmallMultiples
  data={data}
  facet="country"
  x="year"
  y="index"
  kind="area"
  highlight={["India", "Indonesia"]}
  height={560}
  title="Illustrative index for 20 countries, 2013 to 2024"
  subtitle="Index, 2013 = 100. All panels share the same axes."
  note="Synthetic data for layout testing."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/small-multiples.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/small-multiples.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
