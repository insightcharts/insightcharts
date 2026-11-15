# Block bars (`block-bar`)

> Compares 3 to 12 values as thick rounded bars from a zero baseline, with each value printed inside the end of its bar and the category beneath.

- Component: `BlockBar` (import from `insightcharts`)
- Spec type: `"block-bar"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A short series or ranking that should read as a bold graphic with no axis: ticket sales in each of six years, two paired measures in five regions. Add `detail` for a second small figure above each bar and `marker` for an event between two bars.

## Avoid

More than 12 bars, more than two series or stacked parts (use bar-chart); negative values (use diverging-bar-chart); a long time series (use line-chart); values that differ by more than about 50 times, where the short bars vanish (use proportional-area).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/block-bar
```

The file lands at `components/insightcharts/atoms/block-bar.tsx`. `@insightcharts/block-bar-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BlockBar } from "insightcharts";

const data = [
  { year: "2020", tickets: 18400, seats: "41% of seats" },
  { year: "2021", tickets: 22900, seats: "49% of seats" },
  { year: "2022", tickets: 31200, seats: "58% of seats" },
  { year: "2023", tickets: 36800, seats: "64% of seats" },
  { year: "2024", tickets: 41500, seats: "69% of seats" },
  { year: "2025", tickets: 48200, seats: "74% of seats" },
];

<BlockBar
  theme="noir"
  data={data}
  name="year"
  value="tickets"
  detail="seats"
  format="integer"
  marker={{ after: "2021", label: "Second screen opened" }}
  title="The Portholm Film Festival sold 48,200 tickets in 2025"
  subtitle="Tickets sold per year and share of available seats filled, 2020 to 2025"
  source="Illustrative data"
  note="Invented figures for a fictional festival"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "block-bar",
  "theme": "noir",
  "data": [
    { "year": "2020", "tickets": 18400, "seats": "41% of seats" },
    { "year": "2021", "tickets": 22900, "seats": "49% of seats" },
    { "year": "2022", "tickets": 31200, "seats": "58% of seats" },
    { "year": "2023", "tickets": 36800, "seats": "64% of seats" },
    { "year": "2024", "tickets": 41500, "seats": "69% of seats" },
    { "year": "2025", "tickets": 48200, "seats": "74% of seats" }
  ],
  "name": "year",
  "value": "tickets",
  "detail": "seats",
  "format": "integer",
  "marker": { "after": "2021", "label": "Second screen opened" },
  "title": "The Portholm Film Festival sold 48,200 tickets in 2025",
  "subtitle": "Tickets sold per year and share of available seats filled, 2020 to 2025",
  "source": "Illustrative data",
  "note": "Invented figures for a fictional festival"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one bar (or one pair of bars) per value. |
| `value` (required) | `string \| string[]` |  | Value field, or two fields for paired bars. |
| `series` | `string` |  | Field that splits long-format rows into paired series. |
| `detail` | `string` |  | Field holding a short secondary label printed above each bar, e.g. "3.5% of GDP". |
| `marker` | `{ after: string; label?: string }` |  | A dotted line after the named category, marking an event, with an optional label. |
| `orientation` | `"auto" \| "vertical" \| "horizontal"` | `"auto"` | `auto` draws columns and switches to horizontal bars on narrow widths. |
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
- Used by: [count-poster](https://insightcharts.dev/llms/count-poster.md), [timeline-poster](https://insightcharts.dev/llms/timeline-poster.md)

## More examples

### Paired series

```tsx
import { BlockBar } from "insightcharts";

const data = [
  { line: "Coast line", weekday: 41200, weekend: 26800 },
  { line: "Valley line", weekday: 33500, weekend: 12900 },
  { line: "Airport link", weekday: 27100, weekend: 29400 },
  { line: "Harbour loop", weekday: 15800, weekend: 9200 },
];

<BlockBar
  theme="magenta"
  data={data}
  name="line"
  value={["weekday", "weekend"]}
  names={{ weekday: "Weekday", weekend: "Weekend day" }}
  format="compact"
  title="The Airport link carried 29,400 passengers on a weekend day"
  subtitle="Average daily passengers by rail line, weekdays and weekend days, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional network"
/>
```

### Highlight, click to select

```tsx
import { BlockBar } from "insightcharts";

const data = [
  { country: "Norway", share: 89 },
  { country: "Sweden", share: 58 },
  { country: "Netherlands", share: 35 },
  { country: "Germany", share: 19 },
  { country: "Spain", share: 9 },
];

<BlockBar
  data={data}
  name="country"
  value="share"
  format="{value}%"
  highlight="Germany"
  select
  title="Battery electric cars were 19% of new cars sold in Germany in 2025"
  subtitle="Battery electric share of new passenger car sales, five countries, 2025"
  source="Illustrative data"
  note="Rounded, invented for illustration"
/>
```

### Stress: twelve bars, long labels, uneven values

```tsx
import { BlockBar } from "insightcharts";

const data = [
  { port: "Greater Northern Container Terminal", teu: 9400, d: "31% of total" },
  { port: "Southport", teu: 6100, d: "20%" },
  { port: "Marlow Quay", teu: 4300, d: "14%" },
  { port: "Eastern Approaches Deepwater Port", teu: 3900, d: "13%" },
  { port: "Whitby Sands", teu: 2200, d: "7%" },
  { port: "Fenwick", teu: 1500, d: "5%" },
  { port: "Old Harbour", teu: 1100, d: "4%" },
  { port: "Tidewater", teu: 800, d: "3%" },
  // ... 4 more rows
];

<BlockBar
  theme="sunrise"
  data={data}
  name="port"
  value="teu"
  detail="d"
  format="integer"
  title="Greater Northern handled 9,400 thousand containers in 2025"
  subtitle="Container throughput by port, thousand TEU, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional country"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/block-bar.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/block-bar.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
