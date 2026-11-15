# Bubble network (`bubble-network`)

> Draws a small set of circles sized by value and joined by thin lines, with one circle highlighted and tagged.

- Component: `BubbleNetwork` (import from `insightcharts`)
- Spec type: `"bubble-network"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Showing which of up to about 12 named things are connected, and how big each is: trade blocs, route maps between hubs, partnerships, shared ownership. Give `x` and `y` to place the circles by hand, for example roughly geographically.

## Avoid

Flows with magnitudes between stages (use sankey-chart); more than about 12 circles or a dense web of links (use heatmap as a matrix, or data-table); comparison of the sizes alone (use bar-chart or circle-pack).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bubble-network
```

The file lands at `components/insightcharts/atoms/bubble-network.tsx`. `@insightcharts/bubble-network-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BubbleNetwork } from "insightcharts";

const data = [
  { airport: "Lisbon", m: 34 },
  { airport: "Madrid", m: 60 },
  { airport: "Paris", m: 67 },
  { airport: "Frankfurt", m: 59 },
  { airport: "Rome", m: 41 },
  { airport: "Athens", m: 28 },
  { airport: "Istanbul", m: 76 },
];

<BubbleNetwork
  data={data}
  name="airport"
  value="m"
  links={[
    { from: "Istanbul", to: "Frankfurt" },
    { from: "Istanbul", to: "Paris" },
    { from: "Istanbul", to: "Rome" },
    { from: "Istanbul", to: "Athens" },
    { from: "Istanbul", to: "Madrid" },
    { from: "Istanbul", to: "Lisbon" },
    { from: "Madrid", to: "Lisbon" },
    { from: "Paris", to: "Frankfurt" },
    { from: "Rome", to: "Athens" },
  ]}
  highlight="Istanbul"
  tag="Busiest"
  format="{value}m"
  title="Istanbul handled 76 million passengers in 2023"
  subtitle="Passengers at seven airports, millions, 2023. Lines show the routes in this example."
  note="Rounded passenger figures; the routes drawn are illustrative"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "bubble-network",
  "data": [
    { "airport": "Lisbon", "m": 34 },
    { "airport": "Madrid", "m": 60 },
    { "airport": "Paris", "m": 67 },
    { "airport": "Frankfurt", "m": 59 },
    { "airport": "Rome", "m": 41 },
    { "airport": "Athens", "m": 28 },
    { "airport": "Istanbul", "m": 76 }
  ],
  "name": "airport",
  "value": "m",
  "links": [
    { "from": "Istanbul", "to": "Frankfurt" },
    { "from": "Istanbul", "to": "Paris" },
    { "from": "Istanbul", "to": "Rome" },
    { "from": "Istanbul", "to": "Athens" },
    { "from": "Istanbul", "to": "Madrid" },
    { "from": "Istanbul", "to": "Lisbon" },
    { "from": "Madrid", "to": "Lisbon" },
    { "from": "Paris", "to": "Frankfurt" },
    { "from": "Rome", "to": "Athens" }
  ],
  "highlight": "Istanbul",
  "tag": "Busiest",
  "format": "{value}m",
  "title": "Istanbul handled 76 million passengers in 2023",
  "subtitle": "Passengers at seven airports, millions, 2023. Lines show the routes in this example.",
  "note": "Rounded passenger figures; the routes drawn are illustrative"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one circle per row. |
| `value` (required) | `string` |  | Value field: circle area. |
| `x` | `string` |  | Horizontal position field, 0 (left) to 100 (right). With `y`, places the circles by hand. |
| `y` | `string` |  | Vertical position field, 0 (top) to 100 (bottom). |
| `links` | `{ from: string; to: string; value?: number }[]` |  | Lines between circles, by name. `value` sets the line width and is printed on the line. |
| `tag` | `string` |  | Short tag attached to the highlighted circle, e.g. "Joined 2024". |
| `linkFormat` | `FormatSpec` |  | How to print link values. |
| `linkLabels` | `boolean` |  | Print link values on the lines. Default: on when any link has a value. |
| `layout` | `"ring" \| "hub"` |  | Without `x` and `y`: "ring" spaces the circles round an ellipse in data order, "hub" also moves the most-connected circle to the middle. Default: "hub" when one circle links to most of the others. |

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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [network-poster](https://insightcharts.dev/llms/network-poster.md)

## More examples

### Placed by hand, link values, click to select

```tsx
import { BubbleNetwork } from "insightcharts";

const data = [
  { depot: "Northgate", vans: 120, x: 22, y: 12 },
  { depot: "Riverside", vans: 310, x: 50, y: 46 },
  { depot: "Eastfield", vans: 85, x: 88, y: 30 },
  { depot: "Southwell", vans: 160, x: 62, y: 92 },
  { depot: "Westmere", vans: 44, x: 8, y: 70 },
  { depot: "Airport", vans: 205, x: 86, y: 78 },
];

<BubbleNetwork
  data={data}
  name="depot"
  value="vans"
  x="x"
  y="y"
  links={[
    { from: "Riverside", to: "Northgate", value: 42 },
    { from: "Riverside", to: "Eastfield", value: 18 },
    { from: "Riverside", to: "Southwell", value: 55 },
    { from: "Riverside", to: "Westmere", value: 9 },
    { from: "Riverside", to: "Airport", value: 71 },
    { from: "Southwell", to: "Airport", value: 26 },
  ]}
  highlight="Riverside"
  tag="Main depot"
  select
  linkFormat="{value} trips"
  title="Riverside runs 310 of the fleet's 924 vans"
  subtitle="Vans based at each depot (area) and daily transfer trips between depots (line width)"
  note="Illustrative figures for an invented courier"
/>
```

### Ring layout, no hub

```tsx
import { BubbleNetwork } from "insightcharts";

const data = [
  { course: "Algebra", students: 48 },
  { course: "Geometry", students: 31 },
  { course: "Statistics", students: 64 },
  { course: "Calculus", students: 22 },
  { course: "Logic", students: 12 },
  { course: "Number theory", students: 9 },
  { course: "Probability", students: 37 },
  { course: "Topology", students: 5 },
];

<BubbleNetwork
  data={data}
  name="course"
  value="students"
  layout="ring"
  links={[
    { from: "Algebra", to: "Geometry" },
    { from: "Algebra", to: "Calculus" },
    { from: "Statistics", to: "Probability" },
    { from: "Calculus", to: "Topology" },
    { from: "Logic", to: "Number theory" },
    { from: "Algebra", to: "Number theory" },
    { from: "Probability", to: "Calculus" },
    { from: "Geometry", to: "Topology" },
  ]}
  title="Statistics has 64 students"
  subtitle="Students enrolled in eight maths courses. Lines join courses where one is required for the other."
  note="Illustrative figures"
/>
```

### Stress: 12 circles, long names, values from 1 to 480

```tsx
import { BubbleNetwork } from "insightcharts";

const data = [
  { member: "Central Co-operative Wholesale Society", m: 480 },
  { member: "Dairy", m: 210 },
  { member: "Northern Grain and Seed Merchants", m: 96 },
  { member: "Bakery", m: 150 },
  { member: "Orchards", m: 33 },
  { member: "Fishery", m: 61 },
  { member: "Upland Sheep Farmers' Association", m: 18 },
  { member: "Brewery", m: 74 },
  // ... 4 more rows
];

<BubbleNetwork
  data={data}
  name="member"
  value="m"
  format="£{value}m"
  highlight="Central Co-operative Wholesale Society"
  tag="Buys from all eleven"
  links={[
    { from: "Central Co-operative Wholesale Society", to: "Dairy" },
    { from: "Central Co-operative Wholesale Society", to: "Northern Grain and Seed Merchants" },
    { from: "Central Co-operative Wholesale Society", to: "Bakery" },
    { from: "Central Co-operative Wholesale Society", to: "Orchards" },
    { from: "Central Co-operative Wholesale Society", to: "Fishery" },
    { from: "Central Co-operative Wholesale Society", to: "Upland Sheep Farmers' Association" },
    { from: "Central Co-operative Wholesale Society", to: "Brewery" },
    { from: "Central Co-operative Wholesale Society", to: "Market garden" },
    { from: "Central Co-operative Wholesale Society", to: "Apiary" },
    { from: "Central Co-operative Wholesale Society", to: "Mill" },
    { from: "Central Co-operative Wholesale Society", to: "Smokehouse" },
    { from: "Mill", to: "Bakery" },
    { from: "Northern Grain and Seed Merchants", to: "Mill" },
    { from: "Northern Grain and Seed Merchants", to: "Brewery" },
    { from: "Fishery", to: "Smokehouse" },
  ]}
  height={560}
  title="The wholesale society turns over £480 million a year"
  subtitle="Annual turnover of 12 co-operative members, £ million. Lines show who supplies whom."
  note="Illustrative figures for an invented co-operative"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/bubble-network.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bubble-network.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
