# Ranked list (`ranked-list`)

> A ranking as a list: position, name, value and a thin in-row bar, with an optional change indicator and highlighted rows.

- Component: `RankedList` (import from `insightcharts`)
- Spec type: `"ranked-list"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A top-N list where the names matter as much as the values: league tables, best and worst performers, leaderboards with a movement column. It keeps long names readable and works in a narrow column.

## Avoid

Precise visual comparison of many values or more than about 15 rows (use `bar-chart`); several measures per entity (use `data-table` or `comparison-table`); rank changing over time (use `bump-chart`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ranked-list
```

The file lands at `components/insightcharts/molecules/ranked-list.tsx`. `@insightcharts/ranked-list-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RankedList } from "insightcharts";

const data = [
  { city: "Copenhagen", country: "Denmark", share: 49, change: 0.04 },
  { city: "Amsterdam", country: "Netherlands", share: 35, change: 0.01 },
  { city: "Utrecht", country: "Netherlands", share: 34, change: 0.02 },
  { city: "Münster", country: "Germany", share: 31, change: 0 },
  { city: "Antwerp", country: "Belgium", share: 26, change: 0.05 },
  { city: "Malmö", country: "Sweden", share: 25, change: -0.01 },
  { city: "Bordeaux", country: "France", share: 13, change: 0.06 },
  { city: "Paris", country: "France", share: 11, change: 0.07 },
];

<RankedList
  title="11% of commuting trips in Paris are made by bicycle"
  subtitle="Share of commuting trips made by bicycle, selected European cities, with change since 2019"
  data={data}
  name="city"
  detail="country"
  value="share"
  format="{value}%"
  change="change"
  highlight="Paris"
  source="City mobility surveys"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "ranked-list",
  "title": "11% of commuting trips in Paris are made by bicycle",
  "subtitle": "Share of commuting trips made by bicycle, selected European cities, with change since 2019",
  "data": [
    { "city": "Copenhagen", "country": "Denmark", "share": 49, "change": 0.04 },
    { "city": "Amsterdam", "country": "Netherlands", "share": 35, "change": 0.01 },
    { "city": "Utrecht", "country": "Netherlands", "share": 34, "change": 0.02 },
    { "city": "Münster", "country": "Germany", "share": 31, "change": 0 },
    { "city": "Antwerp", "country": "Belgium", "share": 26, "change": 0.05 },
    { "city": "Malmö", "country": "Sweden", "share": 25, "change": -0.01 },
    { "city": "Bordeaux", "country": "France", "share": 13, "change": 0.06 },
    { "city": "Paris", "country": "France", "share": 11, "change": 0.07 }
  ],
  "name": "city",
  "detail": "country",
  "value": "share",
  "format": "{value}%",
  "change": "change",
  "highlight": "Paris",
  "source": "City mobility surveys",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | One row per entity. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before ranking. |
| `name` (required) | `string` |  | Field naming each entity. |
| `value` (required) | `string` |  | Field with the value that ranks them. Bars start at zero. |
| `change` | `string` |  | Field with a change shown at the end of each row: a number (0.12 is +12%) or a string. |
| `changeFormat` | `FormatSpec` | `signed percent` | Format for numeric changes, e.g. `"signed"` for places moved. |
| `upIsGood` | `boolean` | `true` | Whether a positive change is good news. |
| `detail` | `string` |  | Field with a short secondary line under each name. |
| `sort` | `"desc" \| "asc" \| "none"` | `"desc"` | Order by value; `none` keeps the data order. |
| `limit` | `number` |  | Show only the first N rows after sorting. |
| `highlight` | `string \| string[]` |  | Entity names to emphasise. The other bars are drawn in grey. |
| `bar` | `boolean` | `true` | Draw the in-row bar. |
| `max` | `number` |  | Value at which a bar is full. Default: the largest value shown. |
| `format` | `FormatSpec` | `"auto"` | Number format for the values. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Measure, population and period. |
| `source` | `string` |  | Shown under the list as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [delta](https://insightcharts.dev/llms/delta.md)
- Used by: [scorecard](https://insightcharts.dev/llms/scorecard.md)

## More examples

### Top five, no highlight

```tsx
import { RankedList } from "insightcharts";

const data = [
  { city: "Copenhagen", country: "Denmark", share: 49, change: 0.04 },
  { city: "Amsterdam", country: "Netherlands", share: 35, change: 0.01 },
  { city: "Utrecht", country: "Netherlands", share: 34, change: 0.02 },
  { city: "Münster", country: "Germany", share: 31, change: 0 },
  { city: "Antwerp", country: "Belgium", share: 26, change: 0.05 },
  { city: "Malmö", country: "Sweden", share: 25, change: -0.01 },
  { city: "Bordeaux", country: "France", share: 13, change: 0.06 },
  { city: "Paris", country: "France", share: 11, change: 0.07 },
];

<RankedList
  data={data}
  name="city"
  value="share"
  format="{value}%"
  limit={5}
  title="49% of commuting trips in Copenhagen are made by bicycle"
/>
```

### Places moved, long names, no bar

```tsx
import { RankedList } from "insightcharts";

const data = [
  { name: "Erasmus University Medical Center Rotterdam", score: 94.1, moved: 2 },
  { name: "Karolinska University Hospital", score: 93.6, moved: -1 },
  { name: "Amsterdam University Medical Centers", score: 92.8, moved: 0 },
  { name: "Charité – Universitätsmedizin Berlin", score: 91.9, moved: -1 },
  { name: "University Medical Center Utrecht", score: 90.4, moved: 3 },
];

<RankedList
  title="Three of the top five hospitals are in the Netherlands"
  data={data}
  name="name"
  value="score"
  change="moved"
  changeFormat="signed"
  bar={false}
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/ranked-list.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/ranked-list.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
