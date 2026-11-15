# Diverging bar chart (`diverging-bar-chart`)

> Draws bars either side of a centre line: positive against negative values, or stacked agree / disagree responses around a neutral midpoint.

- Component: `DivergingBarChart` (import from `insightcharts`)
- Spec type: `"diverging-bar-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Values that can be above or below zero (net change, balance, deviation from average); survey scales where the split between the two sides matters; two opposed groups back to back.

## Avoid

Values that are all positive (use bar-chart); parts that do not have a natural two-sided order (use a stacked bar-chart); change between two dates (use arrow-chart or dumbbell-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/diverging-bar-chart
```

The file lands at `components/insightcharts/atoms/diverging-bar-chart.tsx`. `@insightcharts/diverging-bar-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { DivergingBarChart } from "insightcharts";

const data = [
  { city: "Austin", change: 21.3 },
  { city: "Phoenix", change: 11.2 },
  { city: "Seattle", change: 8.1 },
  { city: "Chicago", change: -2.9 },
  { city: "San Francisco", change: -7.4 },
  { city: "St. Louis", change: -11.6 },
];

<DivergingBarChart
  data={data}
  x="city"
  y="change"
  format="{value}%"
  height={260}
  title="Austin's population grew 21.3% between 2010 and 2020"
  subtitle="Population change, 2010 to 2020"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "diverging-bar-chart",
  "data": [
    { "city": "Austin", "change": 21.3 },
    { "city": "Phoenix", "change": 11.2 },
    { "city": "Seattle", "change": 8.1 },
    { "city": "Chicago", "change": -2.9 },
    { "city": "San Francisco", "change": -7.4 },
    { "city": "St. Louis", "change": -11.6 }
  ],
  "x": "city",
  "y": "change",
  "format": "{value}%",
  "height": 260,
  "title": "Austin's population grew 21.3% between 2010 and 2020",
  "subtitle": "Population change, 2010 to 2020",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Category field. |
| `y` (required) | `string \| string[]` |  | One signed value field, or several fields ordered from most negative to most positive. |
| `series` | `string` |  | Field that splits rows into ordered series (long data). |
| `neutral` | `string \| false` |  | Series centred on the midline. Default: the middle one of an odd number of series. |
| `percent` | `boolean` | `false` | Normalise each row to 100% (stacked series). |
| `colors` | `"polarity" \| "sentiment"` | `"polarity"` | Single series: diverging poles, or the positive / negative colours when one side is good and the other bad. |
| `sort` | `"none" \| "asc" \| "desc"` |  | Row order. Default: descending by value or by the positive side; data order for dates. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Horizontal, except vertical for a single series over dates. |
| `labels` | `boolean` |  | Values at bar ends (single) or inside segments (stacked). Default: on when there is room. |
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
- Used by: no molecule or template yet

## More examples

### Likert scale around a neutral midpoint

```tsx
import { DivergingBarChart } from "insightcharts";

const data = [
  { statement: "My manager gives me useful feedback", sd: 4, d: 9, n: 14, a: 45, sa: 28 },
  { statement: "I have the tools I need to do my job", sd: 6, d: 15, n: 17, a: 42, sa: 20 },
  { statement: "I see a path to advance here", sd: 14, d: 24, n: 22, a: 28, sa: 12 },
  { statement: "My workload is manageable", sd: 19, d: 30, n: 16, a: 27, sa: 8 },
  { statement: "Pay is fair for the work I do", sd: 23, d: 31, n: 18, a: 21, sa: 7 },
];

<DivergingBarChart
  data={data}
  x="statement"
  y={["sd", "d", "n", "a", "sa"]}
  names={{ sd: "Strongly disagree", d: "Disagree", n: "Neither", a: "Agree", sa: "Strongly agree" }}
  format="{value}%"
  height={300}
  title="73% of staff agree their manager gives useful feedback"
  subtitle="Share of employees responding to each statement"
  note="Illustrative figures."
/>
```

### Two opposed groups, long format

```tsx
import { DivergingBarChart } from "insightcharts";

const data = [
  { age: "75+", sex: "Men", share: 3.1 },
  { age: "75+", sex: "Women", share: 4.6 },
  { age: "60 to 74", sex: "Men", share: 7.9 },
  { age: "60 to 74", sex: "Women", share: 8.6 },
  { age: "45 to 59", sex: "Men", share: 10.2 },
  { age: "45 to 59", sex: "Women", share: 10.4 },
  { age: "30 to 44", sex: "Men", share: 10.1 },
  { age: "30 to 44", sex: "Women", share: 9.9 },
  // ... 4 more rows
];

<DivergingBarChart
  data={data}
  x="age"
  y="share"
  series="sex"
  sort="none"
  format="{value}%"
  height={280}
  title="Women aged 75 and over make up 4.6% of the population"
  subtitle="Share of total population by age group and sex"
  note="Illustrative figures."
/>
```

### Vertical over time, good and bad

```tsx
import { DivergingBarChart } from "insightcharts";

const data = [
  { month: "2024-01", jobs: 119 },
  { month: "2024-02", jobs: 222 },
  { month: "2024-03", jobs: 246 },
  { month: "2024-04", jobs: 118 },
  { month: "2024-05", jobs: 193 },
  { month: "2024-06", jobs: 87 },
  { month: "2024-07", jobs: -32 },
  { month: "2024-08", jobs: -71 },
  // ... 4 more rows
];

<DivergingBarChart
  data={data}
  x="month"
  y="jobs"
  colors="sentiment"
  height={280}
  title="Payroll employment fell by 71,000 in August 2024"
  subtitle="Monthly change in payroll employment, thousands"
  note="Illustrative figures."
/>
```

### Stress: 14 long statements, one highlighted, normalised

```tsx
import { DivergingBarChart } from "insightcharts";

const data = [
  {
    statement: "The government should raise taxes on the highest earners",
    oppose: 420,
    unsure: 90,
    support: 180,
  },
  {
    statement: "Public transport should be free for people under 25",
    oppose: 367,
    unsure: 107,
    support: 251,
  },
  {
    statement: "The retirement age should rise in line with life expectancy",
    oppose: 314,
    unsure: 124,
    support: 322,
  },
  {
    statement: "New housing should be allowed on protected countryside",
    oppose: 261,
    unsure: 141,
    support: 393,
  },
  {
    statement: "Private cars should be banned from the city centre",
    oppose: 208,
    unsure: 158,
    support: 464,
  },
  {
    statement: "University tuition should be paid entirely by the state",
    oppose: 155,
    unsure: 95,
    support: 205,
  },
  {
    statement: "The country should build new nuclear power stations",
    oppose: 402,
    unsure: 112,
    support: 276,
  },
  {
    statement: "Immigration quotas should be set by regional governments",
    oppose: 349,
    unsure: 129,
    support: 347,
  },
  // ... 6 more rows
];

<DivergingBarChart
  data={data}
  x="statement"
  y={["oppose", "unsure", "support"]}
  names={{ oppose: "Oppose", unsure: "Not sure", support: "Support" }}
  percent
  highlight="Rents should be capped by law"
  title="42% of respondents support capping rents by law"
  subtitle="Share of respondents, normalised to 100% per statement"
  note="Synthetic data for layout testing."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/diverging-bar-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/diverging-bar-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
