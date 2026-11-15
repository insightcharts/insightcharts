# Ribbon chart (`ribbon-chart`)

> One filled band per entity across periods: its thickness is its value in each period and its vertical position is its rank, so bands cross as the order changes.

- Component: `RibbonChart` (import from `insightcharts`)
- Spec type: `"ribbon-chart"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

4 to 8 entities over 4 to 10 periods when both the size of each and the changing order matter, and the graphic should read as one flowing form: market shares, harvests, medal tables, budget lines.

## Avoid

Totals that matter more than order, or a smooth centred stream of many periods (use area-chart, which has stacked and stream modes); rank alone (use bump-chart); more than 8 entities or 10 periods (use line-chart or small-multiples); values that can be negative (use line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ribbon-chart
```

The file lands at `components/insightcharts/atoms/ribbon-chart.tsx`. `@insightcharts/ribbon-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RibbonChart } from "insightcharts";

const data = [
  { year: "2019", Potatoes: 7.4, Carrots: 5.1, Onions: 4.2, Beans: 2.6, Squash: 1.2 },
  { year: "2020", Potatoes: 6.9, Carrots: 5.6, Onions: 3.8, Beans: 3.1, Squash: 2.3 },
  { year: "2021", Potatoes: 6.1, Carrots: 5.9, Onions: 3.1, Beans: 3.4, Squash: 3.9 },
  { year: "2022", Potatoes: 5.2, Carrots: 6.3, Onions: 2.9, Beans: 3.2, Squash: 5 },
  { year: "2023", Potatoes: 4.8, Carrots: 6, Onions: 2.4, Beans: 3.6, Squash: 6.1 },
  { year: "2024", Potatoes: 4.1, Carrots: 6.2, Onions: 2.2, Beans: 3.5, Squash: 6.8 },
];

<RibbonChart
  data={data}
  x="year"
  y={["Potatoes", "Carrots", "Onions", "Beans", "Squash"]}
  format="{value} t"
  title="The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024"
  subtitle="Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "ribbon-chart",
  "data": [
    { "year": "2019", "Potatoes": 7.4, "Carrots": 5.1, "Onions": 4.2, "Beans": 2.6, "Squash": 1.2 },
    { "year": "2020", "Potatoes": 6.9, "Carrots": 5.6, "Onions": 3.8, "Beans": 3.1, "Squash": 2.3 },
    { "year": "2021", "Potatoes": 6.1, "Carrots": 5.9, "Onions": 3.1, "Beans": 3.4, "Squash": 3.9 },
    { "year": "2022", "Potatoes": 5.2, "Carrots": 6.3, "Onions": 2.9, "Beans": 3.2, "Squash": 5 },
    { "year": "2023", "Potatoes": 4.8, "Carrots": 6, "Onions": 2.4, "Beans": 3.6, "Squash": 6.1 },
    { "year": "2024", "Potatoes": 4.1, "Carrots": 6.2, "Onions": 2.2, "Beans": 3.5, "Squash": 6.8 }
  ],
  "x": "year",
  "y": ["Potatoes", "Carrots", "Onions", "Beans", "Squash"],
  "format": "{value} t",
  "title": "The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024",
  "subtitle": "Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Period field: one column of the ribbon per distinct value, in data order. |
| `y` (required) | `string \| string[]` |  | Value field (long data), or one column per entity (wide data). Band thickness; negative values are drawn as zero. |
| `series` | `string` |  | Entity field, for long data. |
| `values` | `boolean` | `true` | Print each value inside its band at every period where it fits. |
| `labels` | `"both" \| "end"` |  | Entity names at both ends, or only at the end. Default: both, end only on narrow screens. |
| `names` | `Record<string, string>` |  | Display names for entity keys. |
| `colorBy` | `"auto" \| "series" \| "none"` | `"auto"` | `auto`: the largest entities take the theme's colours and any past the palette size (at most 8) are grey. `series`: every band gets its own colour, the extra ones derived from the theme's own. `none`: every band in the accent. |

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
- Used by: [timeline-poster](https://insightcharts.dev/llms/timeline-poster.md)

## More examples

### Long data, one highlighted

```tsx
import { RibbonChart } from "insightcharts";

const data = [
  { method: "Cash", year: "2016", share: 46 },
  { method: "Cash", year: "2018", share: 38 },
  { method: "Cash", year: "2020", share: 27 },
  { method: "Cash", year: "2022", share: 19 },
  { method: "Cash", year: "2024", share: 12 },
  { method: "Debit card", year: "2016", share: 31 },
  { method: "Debit card", year: "2018", share: 34 },
  { method: "Debit card", year: "2020", share: 37 },
  // ... 17 more rows
];

<RibbonChart
  data={data}
  series="method"
  x="year"
  y="share"
  highlight="Phone or watch"
  format="{value}%"
  title="Phone and watch payments rose from 2% to 36% of till sales between 2016 and 2024"
  subtitle="Share of till transactions by payment method at one grocery chain, 2016 to 2024"
  note="Illustrative figures."
/>
```

### Ten entities, one colour each

```tsx
import { RibbonChart } from "insightcharts";

const data = [
  { tea: "Assam", year: "2020", sold: 40 },
  { tea: "Assam", year: "2021", sold: 38 },
  { tea: "Assam", year: "2022", sold: 36 },
  { tea: "Assam", year: "2023", sold: 33 },
  { tea: "Assam", year: "2024", sold: 30 },
  { tea: "Earl Grey", year: "2020", sold: 34 },
  { tea: "Earl Grey", year: "2021", sold: 35 },
  { tea: "Earl Grey", year: "2022", sold: 33 },
  // ... 42 more rows
];

<RibbonChart
  data={data}
  series="tea"
  x="year"
  y="sold"
  colorBy="series"
  format="{value} kg"
  title="Sencha sales rose from 12 kg to 41 kg between 2020 and 2024"
  subtitle="Loose tea sold per year by one shop, ten teas, kilograms, 2020 to 2024, largest at the top each year"
  note="Illustrative figures."
/>
```

### Stress: 7 entities, 8 periods, thin bands

```tsx
import { RibbonChart } from "insightcharts";

const data = [
  { club: "Rowing club", season: "2017", medals: 14 },
  { club: "Rowing club", season: "2018", medals: 12 },
  { club: "Rowing club", season: "2019", medals: 15 },
  { club: "Rowing club", season: "2020", medals: 11 },
  { club: "Rowing club", season: "2021", medals: 9 },
  { club: "Rowing club", season: "2022", medals: 8 },
  { club: "Rowing club", season: "2023", medals: 7 },
  { club: "Rowing club", season: "2024", medals: 6 },
  // ... 48 more rows
];

<RibbonChart
  data={data}
  series="club"
  x="season"
  y="medals"
  title="The athletics club's medals rose from 9 in 2017 to 21 in 2024"
  subtitle="Medals won per season by seven clubs in one regional league, 2017 to 2024"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/ribbon-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/ribbon-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
