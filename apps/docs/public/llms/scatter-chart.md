# Scatter chart (`scatter-chart`)

> Plots two numeric measures against each other, one dot per row, with optional bubble size, group colour, selective labels and a trend line.

- Component: `ScatterChart` (import from `insightcharts`)
- Spec type: `"scatter-chart"`
- Level: atom. Category: relationship.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Showing whether and how two measures move together, spotting clusters and outliers, and placing named entities in a two-dimensional space (with quadrant lines via `annotations`).

## Avoid

A measure over time (use line-chart); one numeric measure by category (use beeswarm-chart or strip-plot); fewer than about 8 points (use bar-chart or a table); more than 4 colour groups (facet with small-multiples).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scatter-chart
```

The file lands at `components/insightcharts/atoms/scatter-chart.tsx`. `@insightcharts/scatter-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { country: "United States", spend: 12555, life: 77.5 },
  { country: "Switzerland", spend: 8049, life: 83.9 },
  { country: "Germany", spend: 8011, life: 80.8 },
  { country: "Norway", spend: 7771, life: 83.2 },
  { country: "Netherlands", spend: 6729, life: 81.4 },
  { country: "France", spend: 6630, life: 82.4 },
  { country: "Canada", spend: 6319, life: 81.6 },
  { country: "Sweden", spend: 6438, life: 83.1 },
  { country: "Australia", spend: 6372, life: 83.3 },
  { country: "United Kingdom", spend: 5493, life: 80.7 },
  { country: "Japan", spend: 5251, life: 84.5 },
  { country: "Italy", spend: 4291, life: 82.7 },
  { country: "Spain", spend: 4432, life: 83.3 },
  { country: "South Korea", spend: 4570, life: 83.6 },
  { country: "Portugal", spend: 4162, life: 81.5 },
  { country: "Israel", spend: 3444, life: 82.6 },
  { country: "Poland", spend: 2973, life: 76.5 },
  { country: "Chile", spend: 2699, life: 81 },
  { country: "Mexico", spend: 1181, life: 75.4 },
];

<ScatterChart
  data={data}
  x="spend"
  y="life"
  label="country"
  highlight="United States"
  labels={["United States", "Japan", "Mexico", "Switzerland", "Poland"]}
  xFormat="currency:USD"
  xLabel="Health spending per person"
  yLabel="Life expectancy, years"
  title="The United States spent $12,555 per person on health in 2022"
  subtitle="Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years."
  source="OECD Health Statistics (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "scatter-chart",
  "data": [
    { "country": "United States", "spend": 12555, "life": 77.5 },
    { "country": "Switzerland", "spend": 8049, "life": 83.9 },
    { "country": "Germany", "spend": 8011, "life": 80.8 },
    { "country": "Norway", "spend": 7771, "life": 83.2 },
    { "country": "Netherlands", "spend": 6729, "life": 81.4 },
    { "country": "France", "spend": 6630, "life": 82.4 },
    { "country": "Canada", "spend": 6319, "life": 81.6 },
    { "country": "Sweden", "spend": 6438, "life": 83.1 },
    { "country": "Australia", "spend": 6372, "life": 83.3 },
    { "country": "United Kingdom", "spend": 5493, "life": 80.7 },
    { "country": "Japan", "spend": 5251, "life": 84.5 },
    { "country": "Italy", "spend": 4291, "life": 82.7 },
    { "country": "Spain", "spend": 4432, "life": 83.3 },
    { "country": "South Korea", "spend": 4570, "life": 83.6 },
    { "country": "Portugal", "spend": 4162, "life": 81.5 },
    { "country": "Israel", "spend": 3444, "life": 82.6 },
    { "country": "Poland", "spend": 2973, "life": 76.5 },
    { "country": "Chile", "spend": 2699, "life": 81 },
    { "country": "Mexico", "spend": 1181, "life": 75.4 }
  ],
  "x": "spend",
  "y": "life",
  "label": "country",
  "highlight": "United States",
  "labels": ["United States", "Japan", "Mexico", "Switzerland", "Poland"],
  "xFormat": "currency:USD",
  "xLabel": "Health spending per person",
  "yLabel": "Life expectancy, years",
  "title": "The United States spent $12,555 per person on health in 2022",
  "subtitle": "Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years.",
  "source": "OECD Health Statistics (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Numeric field on the horizontal axis. |
| `y` (required) | `string` |  | Numeric field on the vertical axis. |
| `size` | `string` |  | Numeric field for bubble size; area is proportional to the value. |
| `series` | `string` |  | Field that colours points by group. Beyond 4 groups the smallest fold into a grey Other. |
| `label` | `string` |  | Field naming each point, for tooltips, direct labels and `highlight`. |
| `labels` | `"auto" \| "all" \| "none" \| string[]` | `"auto"` | Which points are labelled. `auto`: highlighted points, or the outliers when nothing is highlighted. Overlapping labels are hidden. |
| `trend` | `boolean` | `false` | Least-squares line of best fit through all points. |
| `logX` | `boolean` | `false` | Logarithmic x axis. |
| `logY` | `boolean` | `false` | Logarithmic y axis. |
| `xLabel` | `string` |  | x axis title. Defaults to the field name. |
| `yLabel` | `string` |  | y axis title. Defaults to the field name. |
| `xFormat` | `FormatSpec` |  | Format for x values; `format` applies to y. |
| `opacity` | `number` |  | Point opacity. Default falls as the point count rises. |
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

### Bubbles, colour groups, log axis

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { country: "Africa 1", region: "Africa", gdp: 2494, life: 61.3, pop: 24.6 },
  { country: "Africa 2", region: "Africa", gdp: 1050, life: 58.4, pop: 61.2 },
  { country: "Africa 3", region: "Africa", gdp: 3104, life: 60.2, pop: 6 },
  { country: "Africa 4", region: "Africa", gdp: 1841, life: 61.4, pop: 1439.1 },
  { country: "Africa 5", region: "Africa", gdp: 3381, life: 65.6, pop: 4.9 },
  { country: "Africa 6", region: "Africa", gdp: 1226, life: 64.3, pop: 136.3 },
  { country: "Africa 7", region: "Africa", gdp: 1115, life: 63.8, pop: 38.6 },
  { country: "Africa 8", region: "Africa", gdp: 4996, life: 66.4, pop: 12 },
  // ... 96 more rows
];

<ScatterChart
  data={data}
  x="gdp"
  y="life"
  size="pop"
  series="region"
  label="country"
  logX
  xFormat="currency:USD"
  xLabel="GDP per person"
  yLabel="Life expectancy, years"
  title="GDP per person and life expectancy, 104 countries"
  subtitle="GDP per person (US$, log scale) against life expectancy. Bubble area is population."
  note="Illustrative data"
/>
```

### Quadrants via annotations

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { feature: "Search", usage: 82, satisfaction: 4.4 },
  { feature: "Dashboards", usage: 74, satisfaction: 3.1 },
  { feature: "Exports", usage: 61, satisfaction: 2.6 },
  { feature: "Alerts", usage: 48, satisfaction: 4.1 },
  { feature: "API", usage: 22, satisfaction: 4.5 },
  { feature: "Comments", usage: 31, satisfaction: 3.4 },
  { feature: "Mobile app", usage: 39, satisfaction: 2.2 },
  { feature: "SSO", usage: 18, satisfaction: 3.9 },
  // ... 2 more rows
];

<ScatterChart
  data={data}
  x="usage"
  y="satisfaction"
  label="feature"
  labels="all"
  highlight={["Exports", "Dashboards"]}
  xFormat="{value}%"
  xLabel="Weekly active users who use it"
  yLabel="Satisfaction, 1 to 5"
  annotations={[
    { type: "line", axis: "x", value: 50, label: "Widely used" },
    { type: "line", axis: "y", value: 3.5, label: "Liked" },
  ]}
  title="Exports is used by 61% of weekly users and rated 2.6 out of 5"
  subtitle="Share of weekly users against mean satisfaction, by feature. Dashboards is used by 74% and rated 3.1."
  note="Illustrative data"
/>
```

### Stress: 2,400 points with a trend

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { id: "Sale 1", sqm: 120, price: 359 },
  { id: "Sale 2", sqm: 95, price: 314 },
  { id: "Sale 3", sqm: 147, price: 437 },
  { id: "Sale 4", sqm: 100, price: 319 },
  { id: "Sale 5", sqm: 66, price: 183 },
  { id: "Sale 6", sqm: 109, price: 199 },
  { id: "Sale 7", sqm: 123, price: 479 },
  { id: "Sale 8", sqm: 133, price: 403 },
  // ... 2392 more rows
];

<ScatterChart
  data={data}
  x="sqm"
  y="price"
  label="id"
  labels="none"
  trend
  xFormat="{value} m²"
  format="{value}k"
  xLabel="Floor area"
  yLabel="Sale price, thousands"
  title="Floor area and sale price, 2,400 home sales"
  subtitle="Floor area in m² against sale price in thousands, with a least-squares trend line"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/scatter-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/scatter-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
