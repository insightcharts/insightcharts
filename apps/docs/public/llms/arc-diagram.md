# Arc diagram (`arc-diagram`)

> Places entities in order on a line and joins each related pair with a semicircular arc whose thickness is the value of the connection; dots are sized by each entity's total.

- Component: `ArcDiagram` (import from `insightcharts`)
- Spec type: `"arc-diagram"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Connections among up to about 20 entities that have a meaningful order (stops on a line, chapters, age groups, teams by size): trips between stations, trade between neighbours, characters sharing scenes.

## Avoid

Flows with a direction through stages (use sankey-chart); one source splitting into parts (use fan-flow); a full matrix of every pair where exact values matter (use heatmap); more than about 20 entities or 60 connections (use heatmap).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/arc-diagram
```

The file lands at `components/insightcharts/atoms/arc-diagram.tsx`. `@insightcharts/arc-diagram-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ArcDiagram } from "insightcharts";

const data = [
  { a: "Harbour", b: "Market", trips: 4200 },
  { a: "Harbour", b: "Quay", trips: 900 },
  { a: "Quay", b: "Market", trips: 1300 },
  { a: "Market", b: "Town Hall", trips: 2600 },
  { a: "Market", b: "University", trips: 3100 },
  { a: "Town Hall", b: "University", trips: 1500 },
  { a: "Town Hall", b: "Hospital", trips: 1100 },
  { a: "University", b: "Park", trips: 800 },
  { a: "University", b: "Airport", trips: 1900 },
  { a: "Park", b: "Hospital", trips: 600 },
  { a: "Hospital", b: "Stadium", trips: 700 },
  { a: "Stadium", b: "Airport", trips: 1200 },
  { a: "Harbour", b: "Airport", trips: 2300 },
  { a: "Market", b: "Stadium", trips: 1700 },
  { a: "Quay", b: "University", trips: 500 },
];

<ArcDiagram
  data={data}
  from="a"
  to="b"
  value="trips"
  order={["Harbour", "Quay", "Market", "Town Hall", "University", "Park", "Hospital", "Stadium", "Airport"]}
  colorBy="none"
  format="integer"
  title="Harbour and Market stations exchanged 4,200 trips a day"
  subtitle="Daily trips between pairs of stations on one tram line, both directions; dots show each station's total"
  note="Illustrative figures for an invented line."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "arc-diagram",
  "data": [
    { "a": "Harbour", "b": "Market", "trips": 4200 },
    { "a": "Harbour", "b": "Quay", "trips": 900 },
    { "a": "Quay", "b": "Market", "trips": 1300 },
    { "a": "Market", "b": "Town Hall", "trips": 2600 },
    { "a": "Market", "b": "University", "trips": 3100 },
    { "a": "Town Hall", "b": "University", "trips": 1500 },
    { "a": "Town Hall", "b": "Hospital", "trips": 1100 },
    { "a": "University", "b": "Park", "trips": 800 },
    { "a": "University", "b": "Airport", "trips": 1900 },
    { "a": "Park", "b": "Hospital", "trips": 600 },
    { "a": "Hospital", "b": "Stadium", "trips": 700 },
    { "a": "Stadium", "b": "Airport", "trips": 1200 },
    { "a": "Harbour", "b": "Airport", "trips": 2300 },
    { "a": "Market", "b": "Stadium", "trips": 1700 },
    { "a": "Quay", "b": "University", "trips": 500 }
  ],
  "from": "a",
  "to": "b",
  "value": "trips",
  "order": ["Harbour", "Quay", "Market", "Town Hall", "University", "Park", "Hospital", "Stadium", "Airport"],
  "colorBy": "none",
  "format": "integer",
  "title": "Harbour and Market stations exchanged 4,200 trips a day",
  "subtitle": "Daily trips between pairs of stations on one tram line, both directions; dots show each station's total",
  "note": "Illustrative figures for an invented line."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `from` (required) | `string` |  | Field naming one end of each connection. With `select: true` a click selects the entity under this field name, so inside `<InsightData>` other charts are filtered on `from`; pass `select: "<field>"` to link on the field that holds the entity in the shared rows. |
| `to` (required) | `string` |  | Field naming the other end. |
| `value` | `string` |  | Value field: arc thickness. Omit to count rows. Rows joining the same pair are summed, in either direction. |
| `order` | `string[]` |  | Entity names in the order they sit on the line. Entities not listed follow in data order. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Line along the bottom with arcs above, or down the left with arcs to the right. Auto turns vertical on narrow screens. |
| `colorBy` | `"series" \| "none"` |  | `series`: each arc in the colour of its first entity; past the size of the theme's palette the extra colours are derived from the theme's own. `none`: every arc in the accent. Default: series while the entities fit the palette (at most 8), none beyond. |
| `arcLabels` | `boolean` | `true` | Print values at the top of the arcs, largest first, wherever they do not collide. The values that do not fit are printed while their entity is hovered or selected, and every value is in the tooltip. |
| `names` | `Record<string, string>` |  | Display names for entity keys. |

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
- Used by: [network-poster](https://insightcharts.dev/llms/network-poster.md)

## More examples

### One entity highlighted

```tsx
import { ArcDiagram } from "insightcharts";

const data = [
  { a: "Harbour", b: "Market", trips: 4200 },
  { a: "Harbour", b: "Quay", trips: 900 },
  { a: "Quay", b: "Market", trips: 1300 },
  { a: "Market", b: "Town Hall", trips: 2600 },
  { a: "Market", b: "University", trips: 3100 },
  { a: "Town Hall", b: "University", trips: 1500 },
  { a: "Town Hall", b: "Hospital", trips: 1100 },
  { a: "University", b: "Park", trips: 800 },
  // ... 7 more rows
];

<ArcDiagram
  data={data}
  from="a"
  to="b"
  value="trips"
  order={["Harbour", "Quay", "Market", "Town Hall", "University", "Park", "Hospital", "Stadium", "Airport"]}
  highlight="University"
  format="integer"
  title="University station had 7,800 daily trips to and from 5 other stations"
  subtitle="Daily trips between pairs of stations on one tram line, both directions"
  note="Illustrative figures for an invented line."
/>
```

### Coloured by entity, counting rows

```tsx
import { ArcDiagram } from "insightcharts";

const data = [
  { a: "Ana", b: "Ben" },
  { a: "Ana", b: "Ben" },
  { a: "Ana", b: "Ben" },
  { a: "Ana", b: "Cleo" },
  { a: "Ben", b: "Cleo" },
  { a: "Ben", b: "Cleo" },
  { a: "Cleo", b: "Dev" },
  { a: "Cleo", b: "Dev" },
  // ... 9 more rows
];

<ArcDiagram
  data={data}
  from="a"
  to="b"
  title="Cleo and Dev shared 4 of the play's 17 two-person scenes"
  subtitle="Scenes shared by pairs of six characters in one play, in order of first appearance"
  note="Illustrative figures for an invented play."
/>
```

### Ten entities, one colour each

```tsx
import { ArcDiagram } from "insightcharts";

const data = [
  { a: "Pier", b: "Docks", trips: 1800 },
  { a: "Pier", b: "Forum", trips: 2400 },
  { a: "Docks", b: "Canal", trips: 900 },
  { a: "Canal", b: "Forum", trips: 1500 },
  { a: "Forum", b: "Abbey", trips: 3300 },
  { a: "Forum", b: "Castle", trips: 1300 },
  { a: "Abbey", b: "Castle", trips: 1100 },
  { a: "Abbey", b: "Mills", trips: 700 },
  // ... 7 more rows
];

<ArcDiagram
  data={data}
  from="a"
  to="b"
  value="trips"
  order={["Pier", "Docks", "Canal", "Forum", "Abbey", "Castle", "Garden", "Mills", "Heath", "Depot"]}
  colorBy="series"
  format="integer"
  title="Forum and Abbey stations exchanged 3,300 trips a day"
  subtitle="Daily trips between pairs of ten stations on one tram line, both directions; each arc takes the colour of the station nearer the start of the line"
  note="Illustrative figures for an invented line."
/>
```

### Stress: 18 entities with long names

```tsx
import { ArcDiagram } from "insightcharts";

const data = [
  { a: "Customer support", b: "Marketing", messages: 33 },
  { a: "Customer support", b: "Data platform", messages: 22 },
  { a: "Customer support", b: "Finance", messages: 14 },
  { a: "Customer support", b: "Research", messages: 8 },
  { a: "Billing", b: "Product design", messages: 222 },
  { a: "Billing", b: "Security", messages: 189 },
  { a: "Billing", b: "People team", messages: 158 },
  { a: "Billing", b: "Partnerships", messages: 130 },
  // ... 24 more rows
];

<ArcDiagram
  data={data}
  from="a"
  to="b"
  value="messages"
  order={[
    "Customer support",
    "Billing",
    "Sales, north region",
    "Sales, south region",
    "Marketing",
    "Product design",
    "Web engineering",
    "Mobile engineering",
    "Data platform",
    "Security",
    "Quality assurance",
    "Legal and compliance",
    "Finance",
    "People team",
    "Facilities",
    "Executive office",
    "Research",
    "Partnerships",
  ]}
  title="Messages between 18 teams in one week"
  subtitle="Messages exchanged between pairs of teams at one company, one week; dots show each team's total"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/arc-diagram.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/arc-diagram.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
