# Fan flow (`fan-flow`)

> One solid block that splits into curved ribbons, each as thick as its value, ending at an aligned column of names, values and shares.

- Component: `FanFlow` (import from `insightcharts`)
- Spec type: `"fan-flow"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

One total divided among 4 to about 14 destinations (or collected from that many origins, with `direction: "in"`) when the picture of the split is the point: where a budget goes, what a day's water is used for, which sources feed one total.

## Avoid

Flows with more than one stage or several sources (use sankey-chart); precise comparison of the parts (use bar-chart); 2 to 4 parts (use segmented-bar or donut-chart); values that can be negative (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/fan-flow
```

The file lands at `components/insightcharts/atoms/fan-flow.tsx`. `@insightcharts/fan-flow-demo` adds a ready-made example next to it.

## Usage

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { use: "Shower", litres: 128 },
  { use: "Toilet", litres: 97 },
  { use: "Washing machine", litres: 62 },
  { use: "Kitchen tap", litres: 45 },
  { use: "Dishwasher", litres: 24 },
  { use: "Garden", litres: 21 },
  { use: "Bathroom tap", litres: 19 },
  { use: "Leaks", litres: 16 },
];

<FanFlow
  theme="forest"
  data={data}
  name="use"
  value="litres"
  trunk="Litres a day"
  tagged={["Shower", "Washing machine", "Dishwasher"]}
  tagLabel="Uses heated water"
  title="Showers used 128 of a household's 412 litres of water a day"
  subtitle="Daily water use of one four-person household by use, litres"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "fan-flow",
  "theme": "forest",
  "data": [
    { "use": "Shower", "litres": 128 },
    { "use": "Toilet", "litres": 97 },
    { "use": "Washing machine", "litres": 62 },
    { "use": "Kitchen tap", "litres": 45 },
    { "use": "Dishwasher", "litres": 24 },
    { "use": "Garden", "litres": 21 },
    { "use": "Bathroom tap", "litres": 19 },
    { "use": "Leaks", "litres": 16 }
  ],
  "name": "use",
  "value": "litres",
  "trunk": "Litres a day",
  "tagged": ["Shower", "Washing machine", "Dishwasher"],
  "tagLabel": "Uses heated water",
  "title": "Showers used 128 of a household's 412 litres of water a day",
  "subtitle": "Daily water use of one four-person household by use, litres",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Destination field: one ribbon per distinct value. |
| `value` (required) | `string` |  | Value field: ribbon thickness. Rows sharing a name are summed; non-positive values are dropped. |
| `trunk` | `string` |  | Label printed in the single block, with the total. |
| `direction` | `"out" \| "in"` | `"out"` | `out`: one block fans out to many labels on the right. `in`: many labels on the left flow into one block. |
| `maxItems` | `number` | `12` | Ribbons to keep; the rest are summed into the remainder ribbon. |
| `otherLabel` | `string` | `"Other"` | Name of the remainder ribbon, drawn in the context colour. A row with this name is treated as the remainder. |
| `tagged` | `string[]` |  | Destinations marked with a dotted outline around the name. |
| `tagLabel` | `string` |  | What the dotted outline means, printed in the key. Needed for `tagged` to be drawn. |
| `share` | `boolean` | `true` | Print each ribbon's share of the total. Dropped on narrow screens. |
| `colorBy` | `"series" \| "none"` |  | `series`: one colour per destination; past the size of the theme's palette the extra colours are derived from the theme's own. `none`: every ribbon in the accent. Default: series while the destinations fit the palette (at most 8), none beyond. |
| `sort` | `"value" \| "none"` | `"value"` | Largest first, or the data order. |

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
- Used by: [flow-poster](https://insightcharts.dev/llms/flow-poster.md)

## More examples

### Many into one, with highlight

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { district: "Riverside", riders: 2600 },
  { district: "Old Town", riders: 2150 },
  { district: "Hillcrest", riders: 1700 },
  { district: "Northgate", riders: 1250 },
  { district: "Mill Quarter", riders: 900 },
  { district: "Eastfield", riders: 520 },
  { district: "Lakeside", riders: 280 },
];

<FanFlow
  data={data}
  name="district"
  value="riders"
  direction="in"
  trunk="Riders arriving at Central Station"
  highlight="Riverside"
  format="integer"
  title="Riverside sent 2,600 of the 9,400 daily riders arriving at Central Station"
  subtitle="Riders arriving at Central Station on a weekday by home district"
  note="Illustrative figures for an invented city."
/>
```

### One colour

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { item: "Rent", amount: 1180 },
  { item: "Food", amount: 520 },
  { item: "Transport", amount: 240 },
  { item: "Energy", amount: 190 },
  { item: "Savings", amount: 150 },
  { item: "Other", amount: 120 },
];

<FanFlow
  theme="dusk"
  data={data}
  name="item"
  value="amount"
  colorBy="none"
  trunk="Monthly take-home pay"
  format="€{value}"
  title="Rent took €1,180 of a €2,400 monthly pay packet"
  subtitle="Monthly spending of one renter by category, euros"
  note="Illustrative figures."
/>
```

### Ten destinations, one colour each

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { service: "Schools", spend: 212 },
  { service: "Social care", spend: 164 },
  { service: "Transport", spend: 121 },
  { service: "Housing", spend: 96 },
  { service: "Waste", spend: 71 },
  { service: "Police", spend: 64 },
  { service: "Parks", spend: 42 },
  { service: "Fire service", spend: 38 },
  // ... 2 more rows
];

<FanFlow
  theme="paper"
  data={data}
  name="service"
  value="spend"
  colorBy="series"
  trunk="City budget"
  format="€{value}m"
  title="Schools took €212m of one city's €850m budget"
  subtitle="Annual spending of one city council by service, millions of euros"
  note="Illustrative figures for an invented city."
/>
```

### Stress: 18 destinations, long names, very uneven values

```tsx
import { FanFlow } from "insightcharts";

const data = [
  { line: "Salaries and employer contributions for teaching staff", pounds: 48200000 },
  { line: "Building maintenance, heating and electricity", pounds: 9100000 },
  { line: "Special educational needs support", pounds: 7400000 },
  { line: "Catering", pounds: 3900000 },
  { line: "Administration and office staff", pounds: 3600000 },
  { line: "Books, software licences and classroom equipment", pounds: 2100000 },
  { line: "School trips", pounds: 640000 },
  { line: "Sports hall hire", pounds: 410000 },
  // ... 10 more rows
];

<FanFlow
  theme="magenta"
  data={data}
  name="line"
  value="pounds"
  maxItems={10}
  otherLabel="8 smaller lines"
  trunk="Annual budget"
  tagged={["Catering", "School trips", "Music lessons"]}
  tagLabel="Partly paid by parents"
  format="currency:GBP"
  title="Teaching salaries took £48.2m of one school's £76.9m budget"
  subtitle="Annual spending of one secondary school by budget line, pounds"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/fan-flow.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/fan-flow.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
