# Orbit chart (`orbit-chart`)

> Places items as dots on concentric rings round a centre, one ring per category, level or period, with a key that explains rings, angle and dot area.

- Component: `OrbitChart` (import from `insightcharts`)
- Spec type: `"orbit-chart"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A designed alternative to a table for 6 to about 40 named things grouped by distance, level or era from one centre: suppliers by tier, moons by planet-distance band, releases by decade, stakeholders by closeness. One item can be highlighted.

## Avoid

A numeric distance that must be read exactly (use strip-plot or scatter-chart); comparison of the dot values (use bar-chart); more than about 6 rings or 40 items (use data-table); hierarchy with sizes that add up (use treemap or circle-pack).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/orbit-chart
```

The file lands at `components/insightcharts/atoms/orbit-chart.tsx`. `@insightcharts/orbit-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { OrbitChart } from "insightcharts";

const data = [
  { supplier: "Halden Cells", tier: "Tier 1", spend: 84 },
  { supplier: "Orrin Motors", tier: "Tier 1", spend: 61 },
  { supplier: "Vale Castings", tier: "Tier 1", spend: 37 },
  { supplier: "Kestrel Wiring", tier: "Tier 2", spend: 22 },
  { supplier: "Brask Cathodes", tier: "Tier 2", spend: 48 },
  { supplier: "Lumen Glass", tier: "Tier 2", spend: 15 },
  { supplier: "Pell Magnets", tier: "Tier 2", spend: 29 },
  { supplier: "Tarn Lithium", tier: "Tier 3", spend: 33 },
  { supplier: "Iver Copper", tier: "Tier 3", spend: 19 },
  { supplier: "Sorrel Graphite", tier: "Tier 3", spend: 12 },
  { supplier: "Moss Resins", tier: "Tier 3", spend: 6 },
  { supplier: "Dunmore Nickel", tier: "Tier 3", spend: 26 },
];

<OrbitChart
  theme="noir"
  data={data}
  name="supplier"
  ring="tier"
  value="spend"
  format="${value}m"
  centerLabel="Car plant"
  highlight="Brask Cathodes"
  ringLabel="Tier 1 sells to the plant, each further ring sells to the ring inside it"
  sizeLabel="annual spend"
  title="Brask Cathodes is a tier 2 supplier with $48 million of annual spend"
  subtitle="12 suppliers to one car plant by supply-chain tier, annual spend in $ million"
  note="Illustrative figures for invented companies"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "orbit-chart",
  "theme": "noir",
  "data": [
    { "supplier": "Halden Cells", "tier": "Tier 1", "spend": 84 },
    { "supplier": "Orrin Motors", "tier": "Tier 1", "spend": 61 },
    { "supplier": "Vale Castings", "tier": "Tier 1", "spend": 37 },
    { "supplier": "Kestrel Wiring", "tier": "Tier 2", "spend": 22 },
    { "supplier": "Brask Cathodes", "tier": "Tier 2", "spend": 48 },
    { "supplier": "Lumen Glass", "tier": "Tier 2", "spend": 15 },
    { "supplier": "Pell Magnets", "tier": "Tier 2", "spend": 29 },
    { "supplier": "Tarn Lithium", "tier": "Tier 3", "spend": 33 },
    { "supplier": "Iver Copper", "tier": "Tier 3", "spend": 19 },
    { "supplier": "Sorrel Graphite", "tier": "Tier 3", "spend": 12 },
    { "supplier": "Moss Resins", "tier": "Tier 3", "spend": 6 },
    { "supplier": "Dunmore Nickel", "tier": "Tier 3", "spend": 26 }
  ],
  "name": "supplier",
  "ring": "tier",
  "value": "spend",
  "format": "${value}m",
  "centerLabel": "Car plant",
  "highlight": "Brask Cathodes",
  "ringLabel": "Tier 1 sells to the plant, each further ring sells to the ring inside it",
  "sizeLabel": "annual spend",
  "title": "Brask Cathodes is a tier 2 supplier with $48 million of annual spend",
  "subtitle": "12 suppliers to one car plant by supply-chain tier, annual spend in $ million",
  "note": "Illustrative figures for invented companies"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one dot per row. |
| `ring` (required) | `string` |  | Field naming the ring each dot sits on: a category, level or period. |
| `rings` | `string[]` |  | Ring order from the centre outward. Default: first appearance in the data. |
| `value` | `string` |  | Value field: dot area. Without it every dot is the same size. |
| `angle` | `string` |  | Numeric field that sets the angle round the ring. Without it dots are spaced evenly. |
| `angleDomain` | `[number, number]` | `[0, 360]` | Values of `angle` that map to a full turn, clockwise from 12 o'clock. |
| `ringLabel` | `string` |  | What the rings mean, for the key. Default: the `ring` field name. |
| `angleLabel` | `string` |  | What the angle means, for the key, e.g. "Clockwise from the top: month of launch". |
| `sizeLabel` | `string` |  | What dot area means, for the key. Default: the `value` field name. |
| `icon` | `string` |  | Icon in the centre disc: a built-in name or `path://`. |
| `centerLabel` | `string` |  | Short text in the centre disc, used when there is no `icon`. |
| `colorBy` | `"ring" \| "single"` | `"ring"` | A colour per ring, or the accent for every dot. |
| `showKey` | `boolean` | `true` | Show the key that explains rings, angle and dot area. |

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
- Used by: [radial-poster](https://insightcharts.dev/llms/radial-poster.md)

## More examples

### Angle from the data, equal dots, click to select

```tsx
import { OrbitChart } from "insightcharts";

const data = [
  { event: "Founding charter", decade: "1970s", yearInDecade: 4, year: 1974 },
  { event: "First branch", decade: "1970s", yearInDecade: 8, year: 1978 },
  { event: "Mobile library", decade: "1980s", yearInDecade: 1, year: 1981 },
  { event: "Children's wing", decade: "1980s", yearInDecade: 6, year: 1986 },
  { event: "Card catalogue retired", decade: "1990s", yearInDecade: 3, year: 1993 },
  { event: "Public internet", decade: "1990s", yearInDecade: 6, year: 1996 },
  { event: "Archive fire", decade: "1990s", yearInDecade: 9, year: 1999 },
  { event: "E-book lending", decade: "2000s", yearInDecade: 8, year: 2008 },
  // ... 3 more rows
];

<OrbitChart
  data={data}
  name="event"
  ring="decade"
  angle="yearInDecade"
  angleDomain={[0, 10]}
  angleLabel="Clockwise from the top: year within the decade, 0 to 9"
  ringLabel="One ring per decade, 1970s innermost"
  colorBy="single"
  icon="house"
  highlight="Archive fire"
  select
  title="The city library has 11 milestones between 1974 and 2022"
  subtitle="Milestones of one public library by decade"
  note="Illustrative history of an invented library"
/>
```

### Sized dots, a colour per ring

```tsx
import { OrbitChart } from "insightcharts";

const data = [
  { stop: "Canal Street", band: "Under 10 min", riders: 4200 },
  { stop: "Market Hall", band: "Under 10 min", riders: 3100 },
  { stop: "Old Bridge", band: "Under 10 min", riders: 2600 },
  { stop: "Riverside Park", band: "10 to 20 min", riders: 1900 },
  { stop: "University", band: "10 to 20 min", riders: 3800 },
  { stop: "Hospital", band: "10 to 20 min", riders: 2400 },
  { stop: "Stadium", band: "10 to 20 min", riders: 1200 },
  { stop: "Airport", band: "Over 20 min", riders: 2900 },
  // ... 2 more rows
];

<OrbitChart
  theme="sunrise"
  data={data}
  name="stop"
  ring="band"
  value="riders"
  format="integer"
  ringLabel="Tram time from Central Station"
  sizeLabel="Riders boarding per weekday"
  centerLabel="Central"
  title="Canal Street had 4,200 tram boardings per weekday"
  subtitle="Weekday boardings at 10 tram stops by travel time from Central Station"
  note="Illustrative figures for an invented city"
/>
```

### Stress: 5 rings, 34 items, long names

```tsx
import { OrbitChart } from "insightcharts";

const data = [
  { body: "Tenants' and residents' association 1.1", level: "Household", members: 12 },
  { body: "Allotment society 1.2", level: "Household", members: 230 },
  { body: "Parish council 1.3", level: "Household", members: 55 },
  { body: "Food bank 1.4", level: "Household", members: 40 },
  { body: "Youth football league 1.5", level: "Household", members: 610 },
  { body: "Credit union 1.6", level: "Household", members: 8 },
  { body: "Food bank 2.1", level: "Street", members: 40 },
  { body: "Youth football league 2.2", level: "Street", members: 610 },
  // ... 26 more rows
];

<OrbitChart
  theme="dusk"
  data={data}
  name="body"
  ring="level"
  value="members"
  sizeLabel="members"
  centerLabel="You"
  title="34 local bodies operate at five levels from household to region"
  subtitle="Civic bodies by the level they operate at, with members"
  note="Illustrative figures"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/orbit-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/orbit-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
