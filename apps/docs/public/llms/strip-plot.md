# Strip plot (`strip-plot`)

> Shows every observation as a tick or dot along a value axis, one row per category.

- Component: `StripPlot` (import from `insightcharts`)
- Spec type: `"strip-plot"`
- Level: atom. Category: distribution.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Comparing the spread and clustering of a numeric value across 2 to about 15 categories when there are few enough observations to show each one; many rows with few to a few hundred observations each.

## Avoid

A single group where the shape matters (use histogram or beeswarm-chart); when individual points must be identifiable or coloured (use beeswarm-chart); when only quartiles matter (use box-plot).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/strip-plot
```

The file lands at `components/insightcharts/atoms/strip-plot.tsx`. `@insightcharts/strip-plot-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StripPlot } from "insightcharts";

const data = [
  { day: "Mon", minutes: 42 },
  { day: "Mon", minutes: 44 },
  { day: "Mon", minutes: 45 },
  { day: "Mon", minutes: 47 },
  { day: "Mon", minutes: 47 },
  { day: "Mon", minutes: 48 },
  { day: "Mon", minutes: 49 },
  { day: "Mon", minutes: 51 },
  { day: "Mon", minutes: 52 },
  { day: "Mon", minutes: 55 },
  { day: "Mon", minutes: 58 },
  { day: "Mon", minutes: 63 },
  { day: "Tue", minutes: 40 },
  { day: "Tue", minutes: 41 },
  { day: "Tue", minutes: 43 },
  { day: "Tue", minutes: 43 },
  { day: "Tue", minutes: 44 },
  { day: "Tue", minutes: 45 },
  { day: "Tue", minutes: 46 },
  { day: "Tue", minutes: 46 },
  { day: "Tue", minutes: 48 },
  { day: "Tue", minutes: 49 },
  { day: "Tue", minutes: 53 },
  { day: "Tue", minutes: 57 },
  { day: "Wed", minutes: 39 },
  { day: "Wed", minutes: 41 },
  { day: "Wed", minutes: 42 },
  { day: "Wed", minutes: 44 },
  { day: "Wed", minutes: 44 },
  { day: "Wed", minutes: 45 },
  { day: "Wed", minutes: 45 },
  { day: "Wed", minutes: 47 },
  { day: "Wed", minutes: 48 },
  { day: "Wed", minutes: 50 },
  { day: "Wed", minutes: 52 },
  { day: "Wed", minutes: 61 },
  { day: "Thu", minutes: 41 },
  { day: "Thu", minutes: 43 },
  { day: "Thu", minutes: 44 },
  { day: "Thu", minutes: 46 },
  { day: "Thu", minutes: 47 },
  { day: "Thu", minutes: 47 },
  { day: "Thu", minutes: 49 },
  { day: "Thu", minutes: 50 },
  { day: "Thu", minutes: 52 },
  { day: "Thu", minutes: 54 },
  { day: "Thu", minutes: 59 },
  { day: "Thu", minutes: 66 },
  { day: "Fri", minutes: 36 },
  { day: "Fri", minutes: 37 },
  { day: "Fri", minutes: 38 },
  { day: "Fri", minutes: 39 },
  { day: "Fri", minutes: 40 },
  { day: "Fri", minutes: 40 },
  { day: "Fri", minutes: 41 },
  { day: "Fri", minutes: 42 },
  { day: "Fri", minutes: 43 },
  { day: "Fri", minutes: 44 },
  { day: "Fri", minutes: 46 },
  { day: "Fri", minutes: 49 },
];

<StripPlot
  data={data}
  value="minutes"
  group="day"
  median
  highlight="Fri"
  format="{value} min"
  title="The median Friday commute took 40.5 minutes"
  subtitle="Door-to-door commute time, 12 weeks of trips by weekday. The heavy tick is the median."
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "strip-plot",
  "data": [
    { "day": "Mon", "minutes": 42 },
    { "day": "Mon", "minutes": 44 },
    { "day": "Mon", "minutes": 45 },
    { "day": "Mon", "minutes": 47 },
    { "day": "Mon", "minutes": 47 },
    { "day": "Mon", "minutes": 48 },
    { "day": "Mon", "minutes": 49 },
    { "day": "Mon", "minutes": 51 },
    { "day": "Mon", "minutes": 52 },
    { "day": "Mon", "minutes": 55 },
    { "day": "Mon", "minutes": 58 },
    { "day": "Mon", "minutes": 63 },
    { "day": "Tue", "minutes": 40 },
    { "day": "Tue", "minutes": 41 },
    { "day": "Tue", "minutes": 43 },
    { "day": "Tue", "minutes": 43 },
    { "day": "Tue", "minutes": 44 },
    { "day": "Tue", "minutes": 45 },
    { "day": "Tue", "minutes": 46 },
    { "day": "Tue", "minutes": 46 },
    { "day": "Tue", "minutes": 48 },
    { "day": "Tue", "minutes": 49 },
    { "day": "Tue", "minutes": 53 },
    { "day": "Tue", "minutes": 57 },
    { "day": "Wed", "minutes": 39 },
    { "day": "Wed", "minutes": 41 },
    { "day": "Wed", "minutes": 42 },
    { "day": "Wed", "minutes": 44 },
    { "day": "Wed", "minutes": 44 },
    { "day": "Wed", "minutes": 45 },
    { "day": "Wed", "minutes": 45 },
    { "day": "Wed", "minutes": 47 },
    { "day": "Wed", "minutes": 48 },
    { "day": "Wed", "minutes": 50 },
    { "day": "Wed", "minutes": 52 },
    { "day": "Wed", "minutes": 61 },
    { "day": "Thu", "minutes": 41 },
    { "day": "Thu", "minutes": 43 },
    { "day": "Thu", "minutes": 44 },
    { "day": "Thu", "minutes": 46 },
    { "day": "Thu", "minutes": 47 },
    { "day": "Thu", "minutes": 47 },
    { "day": "Thu", "minutes": 49 },
    { "day": "Thu", "minutes": 50 },
    { "day": "Thu", "minutes": 52 },
    { "day": "Thu", "minutes": 54 },
    { "day": "Thu", "minutes": 59 },
    { "day": "Thu", "minutes": 66 },
    { "day": "Fri", "minutes": 36 },
    { "day": "Fri", "minutes": 37 },
    { "day": "Fri", "minutes": 38 },
    { "day": "Fri", "minutes": 39 },
    { "day": "Fri", "minutes": 40 },
    { "day": "Fri", "minutes": 40 },
    { "day": "Fri", "minutes": 41 },
    { "day": "Fri", "minutes": 42 },
    { "day": "Fri", "minutes": 43 },
    { "day": "Fri", "minutes": 44 },
    { "day": "Fri", "minutes": 46 },
    { "day": "Fri", "minutes": 49 }
  ],
  "value": "minutes",
  "group": "day",
  "median": true,
  "highlight": "Fri",
  "format": "{value} min",
  "title": "The median Friday commute took 40.5 minutes",
  "subtitle": "Door-to-door commute time, 12 weeks of trips by weekday. The heavy tick is the median.",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field positioning each mark. |
| `group` (required) | `string` |  | Category field: one row per distinct value. |
| `label` | `string` |  | Field naming each observation, for the tooltip. |
| `mark` | `"tick" \| "dot"` | `"tick"` | Thin vertical ticks (a barcode) or translucent dots. |
| `median` | `boolean` | `false` | Heavier tick at each row's median, with its value printed. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order rows by median. |
| `jitter` | `boolean` | `false` | Deterministic vertical spread for dots, to relieve overplotting. |

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

### Barcode: 1,120 listings, sorted by median

```tsx
import { StripPlot } from "insightcharts";

const data = [
  { listing: "San Francisco #1", city: "San Francisco", rent: 2790 },
  { listing: "San Francisco #2", city: "San Francisco", rent: 3630 },
  { listing: "San Francisco #3", city: "San Francisco", rent: 2760 },
  { listing: "San Francisco #4", city: "San Francisco", rent: 3350 },
  { listing: "San Francisco #5", city: "San Francisco", rent: 2950 },
  { listing: "San Francisco #6", city: "San Francisco", rent: 2690 },
  { listing: "San Francisco #7", city: "San Francisco", rent: 2480 },
  { listing: "San Francisco #8", city: "San Francisco", rent: 3750 },
  // ... 1112 more rows
];

<StripPlot
  data={data}
  value="rent"
  group="city"
  label="listing"
  median
  sort="desc"
  format="currency:USD"
  height={400}
  title="Monthly rent of one-bedroom listings in 8 US cities"
  subtitle="US$ per month, 140 listings per city. The heavy tick is the median."
  note="Illustrative data"
/>
```

### Dots with jitter, long labels

```tsx
import { StripPlot } from "insightcharts";

const data = [
  { pupil: "Pupil 1", school: "Northside Academy for Science and Technology", score: 67 },
  { pupil: "Pupil 2", school: "Northside Academy for Science and Technology", score: 44 },
  { pupil: "Pupil 3", school: "Northside Academy for Science and Technology", score: 60 },
  { pupil: "Pupil 4", school: "Northside Academy for Science and Technology", score: 62 },
  { pupil: "Pupil 5", school: "Northside Academy for Science and Technology", score: 59 },
  { pupil: "Pupil 6", school: "Northside Academy for Science and Technology", score: 41 },
  { pupil: "Pupil 7", school: "Northside Academy for Science and Technology", score: 54 },
  { pupil: "Pupil 8", school: "Northside Academy for Science and Technology", score: 67 },
  // ... 160 more rows
];

<StripPlot
  data={data}
  value="score"
  group="school"
  label="pupil"
  mark="dot"
  jitter
  median
  highlight="Westbrook"
  title="Exam scores at 6 schools"
  subtitle="Exam scores out of 100, 28 pupils per school"
  note="Illustrative data"
/>
```

### Stress: 20 rows

```tsx
import { StripPlot } from "insightcharts";

const data = [
  { team: "Team A", days: 3.8 },
  { team: "Team A", days: 2.5 },
  { team: "Team A", days: 2.7 },
  { team: "Team A", days: 1.3 },
  { team: "Team A", days: 3.9 },
  { team: "Team A", days: 3.1 },
  { team: "Team A", days: 8 },
  { team: "Team A", days: 2.7 },
  // ... 792 more rows
];

<StripPlot
  data={data}
  value="days"
  group="team"
  format="{value}d"
  height={520}
  title="Days to close a ticket, 20 teams"
  subtitle="Days to close, 40 tickets per team"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/strip-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/strip-plot.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
