# Arrow chart (`arrow-chart`)

> Draws an arrow per category from a start value to an end value, showing the direction and size of each shift.

- Component: `ArrowChart` (import from `insightcharts`)
- Spec type: `"arrow-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Shifts between two moments across up to about 25 categories when some rise and some fall: swings between elections, before / after a policy.

## Avoid

When both levels matter more than the direction (use dumbbell-chart); more than two points in time (use slope-chart or line-chart); a single value per category (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/arrow-chart
```

The file lands at `components/insightcharts/atoms/arrow-chart.tsx`. `@insightcharts/arrow-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ArrowChart } from "insightcharts";

const data = [
  { group: "Under 30", y2019: 62, y2024: 71 },
  { group: "30 to 44", y2019: 58, y2024: 63 },
  { group: "45 to 64", y2019: 49, y2024: 47 },
  { group: "65 and over", y2019: 41, y2024: 34 },
];

<ArrowChart
  theme="editorial"
  data={data}
  category="group"
  from="y2019"
  to="y2024"
  names={{ y2019: "2019", y2024: "2024" }}
  format="{value}%"
  changeLabel="Change"
  height={220}
  title="Support among under-30s rose from 62% in 2019 to 71% in 2024"
  subtitle="Share in favour of the congestion charge, by age group, 2019 to 2024"
  source="City residents survey"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "arrow-chart",
  "theme": "editorial",
  "data": [
    { "group": "Under 30", "y2019": 62, "y2024": 71 },
    { "group": "30 to 44", "y2019": 58, "y2024": 63 },
    { "group": "45 to 64", "y2019": 49, "y2024": 47 },
    { "group": "65 and over", "y2019": 41, "y2024": 34 }
  ],
  "category": "group",
  "from": "y2019",
  "to": "y2024",
  "names": { "y2019": "2019", "y2024": "2024" },
  "format": "{value}%",
  "changeLabel": "Change",
  "height": 220,
  "title": "Support among under-30s rose from 62% in 2019 to 71% in 2024",
  "subtitle": "Share in favour of the congestion charge, by age group, 2019 to 2024",
  "source": "City residents survey",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `category` (required) | `string` |  | Category field: one arrow each. |
| `from` (required) | `string` |  | Field with the start value, or (long data) the `series` value that marks it. |
| `to` (required) | `string` |  | Field with the end value, or (long data) the `series` value that marks it. |
| `series` | `string` |  | Long data: the field whose values are `from` and `to`. |
| `value` | `string` | `"value"` | Long data: the measure field. |
| `good` | `"up" \| "down" \| "none"` | `"up"` | Direction drawn in the positive colour. `none` uses the accent for every arrow. |
| `sort` | `"change" \| "from" \| "to" \| "none"` | `"change"` | Row order. |
| `order` | `"desc" \| "asc"` | `"desc"` | Sort direction. |
| `labels` | `boolean` |  | Start and end values at the tail and head. Default: on for up to 14 rows; otherwise a value axis is drawn. |
| `changeLabel` | `boolean \| string` | `false` | Print the signed change in a right-hand column; a string sets the column header. |
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
- Used by: no molecule or template yet

## More examples

### Lower is better, one row highlighted

```tsx
import { ArrowChart } from "insightcharts";

const data = [
  { country: "Greece", before: 27.5, after: 10.1 },
  { country: "Spain", before: 26.1, after: 11.4 },
  { country: "Portugal", before: 16.2, after: 6.4 },
  { country: "Italy", before: 12.1, after: 6.5 },
  { country: "France", before: 10.3, after: 7.4 },
  { country: "Germany", before: 5.2, after: 3.4 },
  { country: "Austria", before: 5.3, after: 5.2 },
  { country: "Luxembourg", before: 5.9, after: 6.1 },
];

<ArrowChart
  data={data}
  category="country"
  from="before"
  to="after"
  names={{ before: "2013", after: "2024" }}
  good="down"
  highlight="Greece"
  sort="change"
  order="asc"
  format="{value}%"
  title="Greek unemployment fell from 27.5% in 2013 to 10.1% in 2024"
  subtitle="Unemployment rate, 2013 to 2024"
  source="Eurostat (rounded)"
  note="Figures are approximate, for illustration"
/>
```

### Long format

```tsx
import { ArrowChart } from "insightcharts";

const data = [
  { party: "Greens", election: "2019", value: 20.5 },
  { party: "Greens", election: "2024", value: 11.9 },
  { party: "Conservatives", election: "2019", value: 28.9 },
  { party: "Conservatives", election: "2024", value: 30 },
  { party: "Social Democrats", election: "2019", value: 15.8 },
  { party: "Social Democrats", election: "2024", value: 13.9 },
  { party: "Far right", election: "2019", value: 11 },
  { party: "Far right", election: "2024", value: 15.9 },
  // ... 2 more rows
];

<ArrowChart
  theme="forest"
  data={data}
  category="party"
  series="election"
  from="2019"
  to="2024"
  good="none"
  changeLabel="Swing"
  format="{value}%"
  height={250}
  title="The Greens' vote share fell from 20.5% in 2019 to 11.9% in 2024"
  subtitle="Vote share in the European Parliament election, Germany, 2019 to 2024"
  source="Federal Returning Officer"
  note="Figures are approximate, for illustration"
/>
```

### Stress: 24 rows on a value axis

```tsx
import { ArrowChart } from "insightcharts";

const data = [
  { region: "Northumberland and Durham coalfield towns", before: 31, after: 48 },
  { region: "Greater Manchester", before: 44, after: 52 },
  { region: "West Midlands conurbation", before: 41, after: 47 },
  { region: "Merseyside", before: 47, after: 50 },
  { region: "South Yorkshire", before: 36, after: 49 },
  { region: "West Yorkshire", before: 42, after: 48 },
  { region: "Tyne and Wear", before: 45, after: 51 },
  { region: "Inner London", before: 58, after: 49 },
  // ... 16 more rows
];

<ArrowChart
  theme="mono"
  data={data}
  category="region"
  from="before"
  to="after"
  names={{ before: "Last election", after: "This election" }}
  good="none"
  format="{value}%"
  title="The winning party's vote share in Lincolnshire rose from 20% to 38%"
  subtitle="Vote share of the winning party, by region"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/arrow-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/arrow-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
