# Bar chart (`bar-chart`)

> Compares a value across categories with bars from a zero baseline.

- Component: `BarChart` (import from `insightcharts`)
- Spec type: `"bar-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Ranking or comparing up to about 20 categories; grouped for a few series, stacked when the total and its composition both matter.

## Avoid

Change over many time points (use line-chart); two values per category (use dumbbell-chart); more than about 5 stacked segments.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bar-chart
```

The file lands at `components/insightcharts/atoms/bar-chart.tsx`. `@insightcharts/bar-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
];

<BarChart
  data={data}
  x="country"
  y="share"
  format="{value}%"
  title="Renewables supplied 98% of Norway's electricity in 2023"
  theme="ledger"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "bar-chart",
  "data": [
    { "country": "Norway", "share": 98 },
    { "country": "Brazil", "share": 89 },
    { "country": "Canada", "share": 68 }
  ],
  "x": "country",
  "y": "share",
  "format": "{value}%",
  "title": "Renewables supplied 98% of Norway's electricity in 2023",
  "theme": "ledger"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Category field. |
| `y` (required) | `string \| string[]` |  | Value field, or several for grouped / stacked bars. |
| `series` | `string` |  | Field that splits rows into series (long data). |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Horizontal for rankings and long labels, vertical for time. |
| `sort` | `"none" \| "asc" \| "desc"` |  | Bar order. Default: descending for rankings, data order for time. |
| `stack` | `boolean \| "percent"` | `false` | Stack series; `percent` normalises to 100%. |
| `labels` | `boolean` |  | Value labels at bar ends. Default: on for one series of up to 12 bars. |
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
- Used by: [before-after](https://insightcharts.dev/llms/before-after.md), [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [chart-tabs](https://insightcharts.dev/llms/chart-tabs.md), [linked-charts](https://insightcharts.dev/llms/linked-charts.md), [poster](https://insightcharts.dev/llms/poster.md), [scrolly-chart](https://insightcharts.dev/llms/scrolly-chart.md), [section](https://insightcharts.dev/llms/section.md), [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md), [report-page](https://insightcharts.dev/llms/report-page.md), [scorecard](https://insightcharts.dev/llms/scorecard.md), [social-card](https://insightcharts.dev/llms/social-card.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Two bars, horizontal

```tsx
import { BarChart } from "insightcharts";

const data = [{ group: "Renters under 35", share: 46 }, { group: "Owners under 35", share: 21 }];

<BarChart
  data={data}
  x="group"
  y="share"
  format="{value}%"
  title="46% of renters under 35 moved home in the past year"
  subtitle="Share who moved home in the past 12 months"
  note="Illustrative figures."
/>
```

### Vertical over time with a target line

```tsx
import { BarChart } from "insightcharts";

const data = [
  { year: "2019", gw: 98 },
  { year: "2020", gw: 127 },
  { year: "2021", gw: 168 },
  { year: "2022", gw: 239 },
  { year: "2023", gw: 407 },
  { year: "2024", gw: 452 },
];

<BarChart
  theme={{ accent: "#b4237a" }}
  data={data}
  x="year"
  y="gw"
  sort="none"
  orientation="vertical"
  format="{value} GW"
  annotations={[
    { type: "line", axis: "y", value: 300, label: "Forecast" },
    { type: "band", axis: "x", from: "2020", to: "2021", label: "Pandemic" },
  ]}
  title="The world added 452 GW of solar capacity in 2024"
  subtitle="New solar capacity added worldwide per year, gigawatts"
  note="Illustrative figures."
/>
```

### Grouped, horizontal, highlighted

```tsx
import { BarChart } from "insightcharts";

const data = [
  { region: "Sub-Saharan Africa", y2000: 26, y2023: 51 },
  { region: "South Asia", y2000: 58, y2023: 99 },
  { region: "Latin America", y2000: 92, y2023: 98 },
  { region: "East Asia and Pacific", y2000: 88, y2023: 99 },
];

<BarChart
  theme="editorial"
  data={data}
  x="region"
  y={["y2000", "y2023"]}
  names={{ y2000: "2000", y2023: "2023" }}
  highlight="y2023"
  format="{value}%"
  title="Electricity access in South Asia rose from 58% in 2000 to 99% in 2023"
  subtitle="Share of population with access to electricity"
  source="World Bank (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Stacked to 100%

```tsx
import { BarChart } from "insightcharts";

const data = [
  { age: "18 to 29", Daily: 71, Weekly: 19, Rarely: 10 },
  { age: "30 to 49", Daily: 58, Weekly: 25, Rarely: 17 },
  { age: "50 to 64", Daily: 39, Weekly: 28, Rarely: 33 },
  { age: "65 and over", Daily: 22, Weekly: 24, Rarely: 54 },
];

<BarChart
  theme="sunrise"
  data={data}
  x="age"
  y={["Daily", "Weekly", "Rarely"]}
  stack="percent"
  orientation="horizontal"
  title="71% of adults aged 18 to 29 watch short-form video daily"
  subtitle="How often adults watch short-form video, by age group"
  note="Illustrative figures."
/>
```

### Forced vertical with names too long for their bands

```tsx
import { BarChart } from "insightcharts";

const data = [
  { mode: "Private car", share: 46 },
  { mode: "Public transport", share: 24 },
  { mode: "Walking", share: 15 },
  { mode: "Cycling and scooters", share: 9 },
  { mode: "Taxi and ride-hailing", share: 4 },
  { mode: "Other", share: 2 },
];

<BarChart
  theme="earth"
  data={data}
  x="mode"
  y="share"
  orientation="vertical"
  format="{value}%"
  height={260}
  title="46% of commuters travel to work by private car"
  subtitle="Main mode of travel to work, share of commuters"
  note="Illustrative figures. Long category labels wrap, then rotate."
/>
```

### Stress: 18 long category names

```tsx
import { BarChart } from "insightcharts";

const data = [
  { sector: "Professional, scientific and technical services", share: 64 },
  { sector: "Information and communication", share: 63 },
  { sector: "Financial and insurance activities", share: 62 },
  { sector: "Public administration and defence", share: 55 },
  { sector: "Education", share: 54 },
  { sector: "Real estate activities", share: 48 },
  { sector: "Administrative and support services", share: 47 },
  { sector: "Arts, entertainment and recreation", share: 46 },
  // ... 10 more rows
];

<BarChart
  theme="mono"
  data={data}
  x="sector"
  y="share"
  labels
  format="{value}%"
  title="64% of professional, scientific and technical staff work from home at least one day a week"
  subtitle="Share of employees working from home at least one day a week, by sector"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/bar-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bar-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
