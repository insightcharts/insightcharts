# Bump chart (`bump-chart`)

> Shows how the ranking of entities changes over time, with rank 1 at the top and each line named at its end.

- Component: `BumpChart` (import from `insightcharts`)
- Spec type: `"bump-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

League tables over 3 to about 15 periods for up to about 12 entities, when the order and the changes in rank are what matter and the underlying values differ too much (or too little) to share an axis.

## Avoid

When the size of the values matters (use line-chart); only two periods (use slope-chart); a single ranking (use bar-chart or lollipop-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bump-chart
```

The file lands at `components/insightcharts/atoms/bump-chart.tsx`. `@insightcharts/bump-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BumpChart } from "insightcharts";

const data = [
  { year: "2019", Tesla: 0.37, BYD: 0.23, SAIC: 0.16, Volkswagen: 0.14, Hyundai: 0.13, Geely: 0.12 },
  { year: "2020", Tesla: 0.5, BYD: 0.18, SAIC: 0.27, Volkswagen: 0.42, Hyundai: 0.2, Geely: 0.1 },
  { year: "2021", Tesla: 0.94, BYD: 0.6, SAIC: 0.68, Volkswagen: 0.76, Hyundai: 0.35, Geely: 0.2 },
  { year: "2022", Tesla: 1.31, BYD: 1.86, SAIC: 0.72, Volkswagen: 0.83, Hyundai: 0.51, Geely: 0.65 },
  { year: "2023", Tesla: 1.81, BYD: 3.02, SAIC: 0.79, Volkswagen: 1, Hyundai: 0.57, Geely: 0.93 },
  { year: "2024", Tesla: 1.79, BYD: 4.27, SAIC: 0.9, Volkswagen: 1.04, Hyundai: 0.56, Geely: 1.39 },
];

<BumpChart
  data={data}
  x="year"
  y={["Tesla", "BYD", "SAIC", "Volkswagen", "Hyundai", "Geely"]}
  highlight="BYD"
  format="{value}m"
  height={300}
  title="BYD rose from fifth in 2020 to first in 2022"
  subtitle="Rank among six carmakers by plug-in vehicles sold worldwide, 2019 to 2024"
  source="Company reports"
  note="Approximate figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "bump-chart",
  "data": [
    {
      "year": "2019",
      "Tesla": 0.37,
      "BYD": 0.23,
      "SAIC": 0.16,
      "Volkswagen": 0.14,
      "Hyundai": 0.13,
      "Geely": 0.12
    },
    {
      "year": "2020",
      "Tesla": 0.5,
      "BYD": 0.18,
      "SAIC": 0.27,
      "Volkswagen": 0.42,
      "Hyundai": 0.2,
      "Geely": 0.1
    },
    {
      "year": "2021",
      "Tesla": 0.94,
      "BYD": 0.6,
      "SAIC": 0.68,
      "Volkswagen": 0.76,
      "Hyundai": 0.35,
      "Geely": 0.2
    },
    {
      "year": "2022",
      "Tesla": 1.31,
      "BYD": 1.86,
      "SAIC": 0.72,
      "Volkswagen": 0.83,
      "Hyundai": 0.51,
      "Geely": 0.65
    },
    {
      "year": "2023",
      "Tesla": 1.81,
      "BYD": 3.02,
      "SAIC": 0.79,
      "Volkswagen": 1,
      "Hyundai": 0.57,
      "Geely": 0.93
    },
    {
      "year": "2024",
      "Tesla": 1.79,
      "BYD": 4.27,
      "SAIC": 0.9,
      "Volkswagen": 1.04,
      "Hyundai": 0.56,
      "Geely": 1.39
    }
  ],
  "x": "year",
  "y": ["Tesla", "BYD", "SAIC", "Volkswagen", "Hyundai", "Geely"],
  "highlight": "BYD",
  "format": "{value}m",
  "height": 300,
  "title": "BYD rose from fifth in 2020 to first in 2022",
  "subtitle": "Rank among six carmakers by plug-in vehicles sold worldwide, 2019 to 2024",
  "source": "Company reports",
  "note": "Approximate figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Time or ordered category field. |
| `y` (required) | `string \| string[]` |  | Value field to rank by, or several (one line each). |
| `series` | `string` |  | Field that splits rows into entities (long data). |
| `ranked` | `boolean` | `false` | The values are already ranks (1 = best) and are plotted as given. |
| `order` | `"desc" \| "asc"` | `"desc"` | Which values rank first when ranks are computed: largest (`desc`) or smallest (`asc`). |
| `startLabels` | `boolean` |  | Name lines at the start as well as the end. Default: on when the chart is wide enough. |
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

### Every line coloured

```tsx
import { BumpChart } from "insightcharts";

const data = [
  { season: "2020", Arsenal: 8, Liverpool: 1, "Manchester City": 2, Chelsea: 4, Tottenham: 6 },
  { season: "2021", Arsenal: 8, Liverpool: 3, "Manchester City": 1, Chelsea: 4, Tottenham: 7 },
  { season: "2022", Arsenal: 5, Liverpool: 2, "Manchester City": 1, Chelsea: 3, Tottenham: 4 },
  { season: "2023", Arsenal: 2, Liverpool: 5, "Manchester City": 1, Chelsea: 12, Tottenham: 8 },
  { season: "2024", Arsenal: 2, Liverpool: 3, "Manchester City": 1, Chelsea: 6, Tottenham: 5 },
];

<BumpChart
  data={data}
  x="season"
  y={["Arsenal", "Liverpool", "Manchester City", "Chelsea", "Tottenham"]}
  ranked
  height={340}
  title="Arsenal rose from eighth in 2020 to second in 2024"
  subtitle="Final Premier League position, seasons ending 2020 to 2024"
  source="Premier League"
  note="Figures are approximate, for illustration"
/>
```

### Long format with a late entrant

```tsx
import { BumpChart } from "insightcharts";

const data = [
  { year: "2021", language: "Python", share: 30 },
  { year: "2021", language: "JavaScript", share: 34 },
  { year: "2021", language: "Java", share: 22 },
  { year: "2021", language: "Go", share: 6 },
  { year: "2022", language: "Python", share: 33 },
  { year: "2022", language: "JavaScript", share: 32 },
  { year: "2022", language: "Java", share: 20 },
  { year: "2022", language: "Go", share: 8 },
  // ... 11 more rows
];

<BumpChart
  data={data}
  x="year"
  y="share"
  series="language"
  highlight="Rust"
  format="{value}%"
  height={300}
  title="Rust ranked third in 2024 with 14% of new repositories"
  subtitle="Rank by share of new repositories, by primary language"
  note="Illustrative figures."
/>
```

### Stress: 12 entities over 10 periods

```tsx
import { BumpChart } from "insightcharts";

const data = [
  {
    year: "2015",
    "United States": 100,
    China: 97,
    Japan: 94,
    Germany: 82,
    India: 79,
    "United Kingdom": 67,
    France: 64,
    Italy: 52,
    Brazil: 49,
    Canada: 37,
    "Republic of Korea": 34,
    "Russian Federation": 31,
  },
  {
    year: "2016",
    "United States": 107,
    China: 111,
    Japan: 101,
    Germany: 83,
    India: 92,
    "United Kingdom": 74,
    France: 66,
    Italy: 59,
    Brazil: 55,
    Canada: 48,
    "Republic of Korea": 33,
    "Russian Federation": 34,
  },
  {
    year: "2017",
    "United States": 105,
    China: 128,
    Japan: 109,
    Germany: 93,
    India: 108,
    "United Kingdom": 91,
    France: 68,
    Italy: 57,
    Brazil: 62,
    Canada: 50,
    "Republic of Korea": 32,
    "Russian Federation": 38,
  },
  {
    year: "2018",
    "United States": 103,
    China: 158,
    Japan: 118,
    Germany: 94,
    India: 129,
    "United Kingdom": 101,
    France: 71,
    Italy: 55,
    Brazil: 79,
    Canada: 53,
    "Republic of Korea": 40,
    "Russian Federation": 43,
  },
  {
    year: "2019",
    "United States": 101,
    China: 182,
    Japan: 128,
    Germany: 95,
    India: 162,
    "United Kingdom": 113,
    France: 83,
    Italy: 53,
    Brazil: 90,
    Canada: 56,
    "Republic of Korea": 39,
    "Russian Federation": 49,
  },
  {
    year: "2020",
    "United States": 108,
    China: 211,
    Japan: 149,
    Germany: 96,
    India: 193,
    "United Kingdom": 126,
    France: 86,
    Italy: 51,
    Brazil: 103,
    Canada: 69,
    "Republic of Korea": 39,
    "Russian Federation": 67,
  },
  {
    year: "2021",
    "United States": 106,
    China: 246,
    Japan: 162,
    Germany: 97,
    India: 230,
    "United Kingdom": 151,
    France: 90,
    Italy: 58,
    Brazil: 118,
    Canada: 73,
    "Republic of Korea": 38,
    "Russian Federation": 77,
  },
  {
    year: "2022",
    "United States": 104,
    China: 296,
    Japan: 176,
    Germany: 108,
    India: 275,
    "United Kingdom": 169,
    France: 94,
    Italy: 56,
    Brazil: 136,
    Canada: 78,
    "Republic of Korea": 46,
    "Russian Federation": 90,
  },
  // ... 2 more rows
];

<BumpChart
  data={data}
  x="year"
  y={[
    "United States",
    "China",
    "Japan",
    "Germany",
    "India",
    "United Kingdom",
    "France",
    "Italy",
    "Brazil",
    "Canada",
    "Republic of Korea",
    "Russian Federation",
  ]}
  height={420}
  title="Rank of 12 countries by an illustrative index, 2015 to 2024"
  subtitle="The eight highest-ranked countries in 2024 are coloured"
  note="Synthetic data for layout testing."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/bump-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bump-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
