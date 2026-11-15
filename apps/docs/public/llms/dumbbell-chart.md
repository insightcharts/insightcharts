# Dumbbell chart (`dumbbell-chart`)

> Shows two values per category as dots joined by a line, so the length of the line shows the difference.

- Component: `DumbbellChart` (import from `insightcharts`)
- Spec type: `"dumbbell-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Before / after or group A / group B across up to about 20 categories, when the size of the difference is what the reader needs.

## Avoid

A single value per category (use lollipop-chart or bar-chart); when the direction of change matters more than the two levels (use arrow-chart); more than two points in time (use slope-chart or line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/dumbbell-chart
```

The file lands at `components/insightcharts/atoms/dumbbell-chart.tsx`. `@insightcharts/dumbbell-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { DumbbellChart } from "insightcharts";

const data = [
  { country: "South Korea", y2000: 76, y2023: 83.6 },
  { country: "Turkey", y2000: 71.1, y2023: 77.3 },
  { country: "Poland", y2000: 73.8, y2023: 78.6 },
  { country: "Japan", y2000: 81.2, y2023: 84.1 },
  { country: "Germany", y2000: 78.2, y2023: 81.2 },
  { country: "United States", y2000: 76.7, y2023: 78.4 },
];

<DumbbellChart
  theme="science"
  data={data}
  category="country"
  from="y2000"
  to="y2023"
  names={{ y2000: "2000", y2023: "2023" }}
  gapLabel="Gain"
  format="decimal:1"
  height={280}
  title="Life expectancy in South Korea rose from 76.0 years in 2000 to 83.6 in 2023"
  subtitle="Life expectancy at birth, years, 2000 and 2023"
  source="OECD Health Statistics (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "dumbbell-chart",
  "theme": "science",
  "data": [
    { "country": "South Korea", "y2000": 76, "y2023": 83.6 },
    { "country": "Turkey", "y2000": 71.1, "y2023": 77.3 },
    { "country": "Poland", "y2000": 73.8, "y2023": 78.6 },
    { "country": "Japan", "y2000": 81.2, "y2023": 84.1 },
    { "country": "Germany", "y2000": 78.2, "y2023": 81.2 },
    { "country": "United States", "y2000": 76.7, "y2023": 78.4 }
  ],
  "category": "country",
  "from": "y2000",
  "to": "y2023",
  "names": { "y2000": "2000", "y2023": "2023" },
  "gapLabel": "Gain",
  "format": "decimal:1",
  "height": 280,
  "title": "Life expectancy in South Korea rose from 76.0 years in 2000 to 83.6 in 2023",
  "subtitle": "Life expectancy at birth, years, 2000 and 2023",
  "source": "OECD Health Statistics (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `category` (required) | `string` |  | Category field: one row of the chart each. |
| `from` (required) | `string` |  | Field with the first value, or (long data) the `series` value that marks it. |
| `to` (required) | `string` |  | Field with the second value, or (long data) the `series` value that marks it. |
| `series` | `string` |  | Long data: the field whose values are `from` and `to`. |
| `value` | `string` | `"value"` | Long data: the measure field. |
| `kind` | `"change" \| "groups"` | `"change"` | `change` draws a tint then the accent (before / after); `groups` uses two hues (two peers). |
| `sort` | `"gap" \| "from" \| "to" \| "none"` | `"gap"` | Row order. |
| `order` | `"desc" \| "asc"` | `"desc"` | Sort direction. |
| `labels` | `boolean` |  | Value labels beside both dots. Default: on for up to 14 rows; otherwise a value axis is drawn. |
| `gapLabel` | `boolean \| string` | `false` | Print the gap in a right-hand column; a string sets the column header. |
| `zero` | `boolean` | `false` | Start the value axis at zero. |
| `names` | `Record<string, string>` |  | Display names for the `from` and `to` keys. |

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
- Used by: [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [report-page](https://insightcharts.dev/llms/report-page.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Two groups, highlighted row

```tsx
import { DumbbellChart } from "insightcharts";

const data = [
  { country: "South Korea", men: 100, women: 68.8 },
  { country: "Japan", men: 100, women: 78.7 },
  { country: "United States", men: 100, women: 83 },
  { country: "United Kingdom", men: 100, women: 85.5 },
  { country: "Germany", men: 100, women: 85.6 },
  { country: "France", men: 100, women: 88.4 },
  { country: "Sweden", men: 100, women: 92.7 },
  { country: "Belgium", men: 100, women: 98.8 },
];

<DumbbellChart
  data={data}
  category="country"
  from="women"
  to="men"
  kind="groups"
  names={{ men: "Men", women: "Women" }}
  highlight="South Korea"
  gapLabel="Gap"
  title="Women in South Korea earned 68.8% of men's median pay in 2022"
  subtitle="Median full-time earnings, men = 100"
  source="OECD gender wage gap, 2022 (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Long format

```tsx
import { DumbbellChart } from "insightcharts";

const data = [
  { city: "Lisbon", period: "2015", value: 860 },
  { city: "Lisbon", period: "2024", value: 1720 },
  { city: "Dublin", period: "2015", value: 1390 },
  { city: "Dublin", period: "2024", value: 2380 },
  { city: "Berlin", period: "2015", value: 780 },
  { city: "Berlin", period: "2024", value: 1310 },
  { city: "Madrid", period: "2015", value: 790 },
  { city: "Madrid", period: "2024", value: 1260 },
  // ... 2 more rows
];

<DumbbellChart
  theme="ledger"
  data={data}
  category="city"
  series="period"
  value="value"
  from="2015"
  to="2024"
  format="currency:EUR"
  height={260}
  title="Rent in Lisbon rose from €860 in 2015 to €1,720 in 2024"
  subtitle="Typical monthly rent for a one-bedroom flat, euros"
  note="Illustrative figures."
/>
```

### Stress: 22 rows, long names, axis instead of labels

```tsx
import { DumbbellChart } from "insightcharts";

const data = [
  { sector: "Professional, scientific and technical services", before: 41, after: 63 },
  { sector: "Information and communication", before: 48, after: 66 },
  { sector: "Financial and insurance activities", before: 39, after: 58 },
  { sector: "Public administration and defence", before: 22, after: 44 },
  { sector: "Education", before: 18, after: 33 },
  { sector: "Real estate activities", before: 21, after: 35 },
  { sector: "Administrative and support services", before: 14, after: 26 },
  { sector: "Arts, entertainment and recreation", before: 11, after: 21 },
  // ... 14 more rows
];

<DumbbellChart
  theme="ocean"
  data={data}
  category="sector"
  from="before"
  to="after"
  names={{ before: "2019", after: "2024" }}
  format="{value}%"
  title="Remote working in information and communication rose from 48% in 2019 to 66% in 2024"
  subtitle="Share of employees working from home at least one day a week, by sector"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/dumbbell-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/dumbbell-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
