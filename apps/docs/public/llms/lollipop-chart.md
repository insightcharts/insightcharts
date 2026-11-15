# Lollipop chart (`lollipop-chart`)

> Ranks categories with a dot on a thin stem from zero, or as a stemless dot plot on a free scale.

- Component: `LollipopChart` (import from `insightcharts`)
- Spec type: `"lollipop-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Rankings of 8 to 30 categories where bars would be too heavy; dot plot mode when the values sit far from zero and the differences between them matter, or to compare a few series per row.

## Avoid

Fewer than about 6 categories or part-to-whole stacks (use bar-chart); exactly two values per row where the difference between them matters (use dumbbell-chart); change over time (use line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/lollipop-chart
```

The file lands at `components/insightcharts/atoms/lollipop-chart.tsx`. `@insightcharts/lollipop-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { LollipopChart } from "insightcharts";

const data = [
  { country: "Netherlands", share: 27 },
  { country: "Denmark", share: 19 },
  { country: "Germany", share: 10 },
  { country: "Sweden", share: 9 },
  { country: "Japan", share: 8 },
  { country: "France", share: 4 },
  { country: "United Kingdom", share: 2 },
  { country: "United States", share: 1 },
];

<LollipopChart
  theme="mono"
  data={data}
  x="country"
  y="share"
  format="{value}%"
  height={300}
  title="27% of trips in the Netherlands are made by bike"
  subtitle="Share of all trips made by bicycle"
  source="National travel surveys, latest available year (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "lollipop-chart",
  "theme": "mono",
  "data": [
    { "country": "Netherlands", "share": 27 },
    { "country": "Denmark", "share": 19 },
    { "country": "Germany", "share": 10 },
    { "country": "Sweden", "share": 9 },
    { "country": "Japan", "share": 8 },
    { "country": "France", "share": 4 },
    { "country": "United Kingdom", "share": 2 },
    { "country": "United States", "share": 1 }
  ],
  "x": "country",
  "y": "share",
  "format": "{value}%",
  "height": 300,
  "title": "27% of trips in the Netherlands are made by bike",
  "subtitle": "Share of all trips made by bicycle",
  "source": "National travel surveys, latest available year (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Category field. |
| `y` (required) | `string \| string[]` |  | Value field. Several fields draw several dots per row (dot plot). |
| `series` | `string` |  | Field that splits rows into series (long data). Forces the dot plot. |
| `stem` | `boolean` | `true` | Stem from zero. `false` draws a dot plot whose scale need not start at zero. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Horizontal for rankings, vertical for dates. |
| `sort` | `"none" \| "asc" \| "desc"` |  | Row order. Default: descending for rankings, data order for dates. |
| `labels` | `boolean` |  | Value beside each dot. Default: on for one series of up to 16 rows. |
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
- Used by: [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Dot plot on a non-zero scale, highlighted

```tsx
import { LollipopChart } from "insightcharts";

const data = [
  { country: "Japan", years: 84.1 },
  { country: "Switzerland", years: 83.9 },
  { country: "Spain", years: 83.3 },
  { country: "Italy", years: 83 },
  { country: "Sweden", years: 83.1 },
  { country: "France", years: 82.5 },
  { country: "Canada", years: 81.6 },
  { country: "Germany", years: 81.2 },
  // ... 2 more rows
];

<LollipopChart
  data={data}
  x="country"
  y="years"
  stem={false}
  highlight="United States"
  format="decimal:1"
  title="Life expectancy in the United States was 78.4 years in 2023"
  subtitle="Life expectancy at birth, years, 2023. The scale does not start at zero."
  source="OECD Health Statistics (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Long format, three dots per row

```tsx
import { LollipopChart } from "insightcharts";

const data = [
  { job: "Nurses", age: "Over 55", trust: 82 },
  { job: "Nurses", age: "35 to 54", trust: 71 },
  { job: "Nurses", age: "Under 35", trust: 64 },
  { job: "Teachers", age: "Over 55", trust: 74 },
  { job: "Teachers", age: "35 to 54", trust: 66 },
  { job: "Teachers", age: "Under 35", trust: 58 },
  { job: "Police officers", age: "Over 55", trust: 61 },
  { job: "Police officers", age: "35 to 54", trust: 55 },
  // ... 10 more rows
];

<LollipopChart
  theme="earth"
  data={data}
  x="job"
  y="trust"
  series="age"
  format="{value}%"
  height={300}
  title="82% of people over 55 trust nurses"
  subtitle="Share who say they trust each profession, by age group"
  note="Illustrative figures."
/>
```

### Vertical, over time

```tsx
import { LollipopChart } from "insightcharts";

const data = [
  { month: "2024-01", launches: 18 },
  { month: "2024-02", launches: 15 },
  { month: "2024-03", launches: 22 },
  { month: "2024-04", launches: 21 },
  { month: "2024-05", launches: 24 },
  { month: "2024-06", launches: 19 },
  { month: "2024-07", launches: 17 },
  { month: "2024-08", launches: 23 },
  // ... 4 more rows
];

<LollipopChart
  theme="blueprint"
  data={data}
  x="month"
  y="launches"
  height={280}
  title="There were 28 orbital launch attempts in December 2024"
  subtitle="Orbital launch attempts worldwide per month, 2024"
  note="Illustrative figures."
/>
```

### Stress: 26 rows with long names

```tsx
import { LollipopChart } from "insightcharts";

const data = [
  { occupation: "Community and social service occupations", openings: 960 },
  { occupation: "Healthcare practitioners and technical occupations", openings: 1013 },
  { occupation: "Education, training and library occupations", openings: 928 },
  { occupation: "Computer and mathematical occupations", openings: 981 },
  { occupation: "Architecture and engineering occupations", openings: 896 },
  { occupation: "Life, physical and social science occupations", openings: 811 },
  { occupation: "Legal occupations", openings: 864 },
  { occupation: "Business and financial operations", openings: 779 },
  // ... 18 more rows
];

<LollipopChart
  theme="poster"
  data={data}
  x="occupation"
  y="openings"
  labels={false}
  format="compact"
  title="Community and social service occupations have 960,000 projected openings a year"
  subtitle="Projected annual job openings, thousands"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/lollipop-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/lollipop-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
