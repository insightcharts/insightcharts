# Curve rank (`curve-rank`)

> Places each entity on two parallel scales, one per measure, and joins its two positions with a smooth S-curve labelled with the name and both values.

- Component: `CurveRank` (import from `insightcharts`)
- Spec type: `"curve-rank"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Two different measures of the same 4 to about 15 entities, when the point is how standing on one relates to standing on the other: price against sales, staff against output, cost against usage. Each side has its own scale, stated in its heading.

## Avoid

The same measure at two moments (use slope-chart); ranks across many periods (use bump-chart); more than about 15 entities or a statistical relationship (use scatter-chart); exact comparison on one measure (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/curve-rank
```

The file lands at `components/insightcharts/atoms/curve-rank.tsx`. `@insightcharts/curve-rank-demo` adds a ready-made example next to it.

## Usage

```tsx
import { CurveRank } from "insightcharts";

const data = [
  { drink: "Filter coffee", price: 2.4, cups: 310 },
  { drink: "Espresso", price: 2.6, cups: 145 },
  { drink: "Flat white", price: 3.6, cups: 260 },
  { drink: "Iced latte", price: 4.2, cups: 180 },
  { drink: "Matcha latte", price: 4.8, cups: 75 },
  { drink: "Hot chocolate", price: 3.9, cups: 40 },
];

<CurveRank
  data={data}
  name="drink"
  left="price"
  right="cups"
  leftLabel="Price per cup"
  rightLabel="Cups sold a day"
  leftFormat={{ style: "currency", currency: "GBP" }}
  leftTop="low"
  title="Filter coffee sold 310 cups a day at £2.40 a cup"
  subtitle="Price per cup and cups sold per day for six drinks at one café, cheapest at the top"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "curve-rank",
  "data": [
    { "drink": "Filter coffee", "price": 2.4, "cups": 310 },
    { "drink": "Espresso", "price": 2.6, "cups": 145 },
    { "drink": "Flat white", "price": 3.6, "cups": 260 },
    { "drink": "Iced latte", "price": 4.2, "cups": 180 },
    { "drink": "Matcha latte", "price": 4.8, "cups": 75 },
    { "drink": "Hot chocolate", "price": 3.9, "cups": 40 }
  ],
  "name": "drink",
  "left": "price",
  "right": "cups",
  "leftLabel": "Price per cup",
  "rightLabel": "Cups sold a day",
  "leftFormat": { "style": "currency", "currency": "GBP" },
  "leftTop": "low",
  "title": "Filter coffee sold 310 cups a day at £2.40 a cup",
  "subtitle": "Price per cup and cups sold per day for six drinks at one café, cheapest at the top",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Entity field: one curve per row. |
| `left` (required) | `string` |  | Field for the left-hand measure. |
| `right` (required) | `string` |  | Field for the right-hand measure. |
| `leftLabel` | `string` |  | Heading over the left rule: the measure and its unit. Defaults to the field name. |
| `rightLabel` | `string` |  | Heading over the right rule. Defaults to the field name. |
| `leftScale` | `"linear" \| "log"` | `"linear"` | Scale of the left measure. A log scale is stated in the heading. |
| `rightScale` | `"linear" \| "log"` | `"linear"` | Scale of the right measure. |
| `leftTop` | `"high" \| "low"` | `"high"` | Which end of the left measure sits at the top. |
| `rightTop` | `"high" \| "low"` | `"high"` | Which end of the right measure sits at the top. |
| `leftFormat` | `FormatSpec` |  | How to print left values. Defaults to `format`. |
| `rightFormat` | `FormatSpec` |  | How to print right values. Defaults to `format`. |
| `order` | `string[]` |  | Entity names in the order that assigns colours. Pass the same list to glyph-table to match its row colours. |
| `colorBy` | `"series" \| "none"` |  | `series`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (glyph-table derives the same ones). `none`: every curve in the accent. Default: series while the entities fit the palette (at most 8), none beyond. |
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
- Used by: [matrix-poster](https://insightcharts.dev/llms/matrix-poster.md)

## More examples

### One highlighted, log scale on the right

```tsx
import { CurveRank } from "insightcharts";

const data = [
  { venue: "Corner bakery", staff: 4, visits: 380 },
  { venue: "Riverside café", staff: 7, visits: 910 },
  { venue: "Station kiosk", staff: 2, visits: 2400 },
  { venue: "Market hall", staff: 18, visits: 5200 },
  { venue: "Museum restaurant", staff: 22, visits: 640 },
  { venue: "Food truck", staff: 3, visits: 720 },
  { venue: "Hotel bar", staff: 9, visits: 210 },
];

<CurveRank
  data={data}
  name="venue"
  left="staff"
  right="visits"
  leftLabel="Staff"
  rightLabel="Customers a day"
  rightScale="log"
  highlight="Station kiosk"
  title="The station kiosk served 2,400 customers a day with 2 staff"
  subtitle="Staff and daily customers at seven food venues in one town"
  note="Illustrative figures."
/>
```

### Ten entities, one colour each

```tsx
import { CurveRank } from "insightcharts";

const data = [
  { district: "Old Town", rent: 1480, commute: 12 },
  { district: "Harbour", rent: 1390, commute: 15 },
  { district: "Riverside", rent: 1310, commute: 18 },
  { district: "University", rent: 1180, commute: 14 },
  { district: "Market", rent: 1120, commute: 20 },
  { district: "Hillcrest", rent: 1040, commute: 26 },
  { district: "Northgate", rent: 960, commute: 31 },
  { district: "Eastfield", rent: 890, commute: 34 },
  // ... 2 more rows
];

<CurveRank
  data={data}
  name="district"
  left="rent"
  right="commute"
  leftLabel="Median rent a month"
  rightLabel="Commute to the centre, minutes"
  leftFormat={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
  rightFormat="{value} min"
  rightTop="low"
  colorBy="series"
  title="Old Town had a 12-minute commute at a median rent of €1,480 a month"
  subtitle="Median monthly rent and commute time to the centre for ten districts of one city, shortest commute at the top"
  note="Illustrative figures for an invented city."
/>
```

### Stress: 14 entities, close values, long names

```tsx
import { CurveRank } from "insightcharts";

const data = [
  { service: "Northern Line Extension to the Harbour", satisfaction: 41, cost: 12.4 },
  { service: "Ring Road Bus Rapid Transit", satisfaction: 39, cost: 11.9 },
  { service: "Airport Express", satisfaction: 38, cost: 31 },
  { service: "Old Town Tram", satisfaction: 37, cost: 9.8 },
  { service: "University Shuttle", satisfaction: 22, cost: 3.1 },
  { service: "Riverside Ferry", satisfaction: 21, cost: 6.4 },
  { service: "Hillcrest Funicular", satisfaction: 20, cost: 6.2 },
  { service: "Night Bus Network", satisfaction: 19, cost: 6 },
  // ... 6 more rows
];

<CurveRank
  data={data}
  name="service"
  left="satisfaction"
  right="cost"
  leftLabel="Riders satisfied, %"
  rightLabel="Cost per trip, €"
  leftFormat="{value}%"
  rightFormat={{ style: "currency", currency: "EUR" }}
  highlight={["Demand-Responsive Minibus", "East-West Metro"]}
  title="The minibus cost €14.80 a trip with 7% of riders satisfied"
  subtitle="Share of riders satisfied and operating cost per trip for 14 transport services in one city"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/curve-rank.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/curve-rank.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
