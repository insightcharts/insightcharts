# Data table (`data-table`)

> A restrained editorial table from rows and a column config: aligned tabular numbers, an optional in-cell bar, row highlight and click-to-sort headers.

- Component: `DataTable` (import from `insightcharts`)
- Spec type: `"data-table"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

When readers need to look up exact values, or compare a handful of entities across several measures with different units. Sort it by the column the caption refers to and highlight the row it names.

## Avoid

Showing a trend or a single comparison (use `line-chart` or `bar-chart`); more than about 7 columns or 30 rows without `maxHeight`.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/data-table
```

The file lands at `components/insightcharts/atoms/data-table.tsx`. `@insightcharts/data-table-demo` adds a ready-made example next to it.

## Usage

```tsx
import { DataTable } from "insightcharts";

<DataTable
  caption="Wind and solar supplied 67% of Denmark's electricity in 2024"
  subtitle="Electricity generation by country, 2024"
  source="Ember (illustrative figures)"
  highlight="Denmark"
  sort={{ key: "share", direction: "desc" }}
  columns={[
    { key: "country", label: "Country" },
    { key: "share", label: "Wind and solar share", format: "percent", bar: true, width: "38%" },
    { key: "twh", label: "Generation, TWh", format: "decimal:1" },
    {
      key: "change",
      label: "Change vs 2023",
      format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 },
    },
  ]}
  rows={[
    { country: "Germany", share: 0.43, twh: 209.4, change: 0.031 },
    { country: "Spain", share: 0.42, twh: 112.8, change: 0.044 },
    { country: "Denmark", share: 0.67, twh: 23.1, change: 0.012 },
    { country: "Netherlands", share: 0.41, twh: 49.6, change: 0.058 },
    { country: "Portugal", share: 0.46, twh: 22.9, change: 0.027 },
    { country: "France", share: 0.14, twh: 73.5, change: 0.009 },
    { country: "Poland", share: 0.24, twh: 40.2, change: -0.004 },
  ]}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "data-table",
  "caption": "Wind and solar supplied 67% of Denmark's electricity in 2024",
  "subtitle": "Electricity generation by country, 2024",
  "source": "Ember (illustrative figures)",
  "highlight": "Denmark",
  "sort": { "key": "share", "direction": "desc" },
  "columns": [
    { "key": "country", "label": "Country" },
    {
      "key": "share",
      "label": "Wind and solar share",
      "format": "percent",
      "bar": true,
      "width": "38%"
    },
    { "key": "twh", "label": "Generation, TWh", "format": "decimal:1" },
    {
      "key": "change",
      "label": "Change vs 2023",
      "format": { "style": "percent", "signDisplay": "exceptZero", "maximumFractionDigits": 1 }
    }
  ],
  "rows": [
    { "country": "Germany", "share": 0.43, "twh": 209.4, "change": 0.031 },
    { "country": "Spain", "share": 0.42, "twh": 112.8, "change": 0.044 },
    { "country": "Denmark", "share": 0.67, "twh": 23.1, "change": 0.012 },
    { "country": "Netherlands", "share": 0.41, "twh": 49.6, "change": 0.058 },
    { "country": "Portugal", "share": 0.46, "twh": 22.9, "change": 0.027 },
    { "country": "France", "share": 0.14, "twh": 73.5, "change": 0.009 },
    { "country": "Poland", "share": 0.24, "twh": 40.2, "change": -0.004 }
  ]
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` (required) | `Row[]` |  | One object per row. |
| `columns` | `(string \| { key, label?, format?, align?, bar?, sortable?, width? })[]` |  | Columns in order. Defaults to every key of the first row. Numeric columns are right-aligned. |
| `caption` | `string` |  | The table's title, as a real `<caption>`. |
| `subtitle` | `string` |  | Units and period, under the caption. |
| `source` | `string` |  | Shown under the table as "Source: ...". |
| `highlight` | `string \| number \| (string \| number)[]` |  | Rows to emphasise, matched on the first column (or `highlightKey`). |
| `highlightKey` | `string` |  | Field `highlight` matches against. |
| `sort` | `{ key, direction?: "asc" \| "desc" }` |  | Initial sort. |
| `sortable` | `boolean` | `true` | Click or press Enter on a header to sort; a third press restores the original order. |
| `maxHeight` | `number \| string` |  | Height before the body scrolls under the sticky header. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [data-explorer](https://insightcharts.dev/llms/data-explorer.md)

## More examples

### Scrolling, sticky header, compact

```tsx
import { DataTable } from "insightcharts";

<DataTable
  caption="Twelve cities with a low-traffic centre"
  subtitle="Population in millions, liveability score out of 100, share of trips by bike"
  density="compact"
  maxHeight={260}
  columns={[
    { key: "city", label: "City" },
    { key: "population", label: "Population, m", format: "decimal:2" },
    { key: "startYear", label: "Scheme began" },
    { key: "score", label: "Score", format: "decimal:1" },
    { key: "cycling", label: "Cycling share", format: "percent" },
  ]}
  rows={[
    { city: "Vienna", population: 1.98, startYear: 2015, score: 71.2, cycling: 0.31 },
    { city: "Copenhagen", population: 0.66, startYear: 2012, score: 78.5, cycling: 0.49 },
    { city: "Amsterdam", population: 0.93, startYear: 2014, score: 75.1, cycling: 0.38 },
    { city: "Zurich", population: 0.44, startYear: 2011, score: 80.3, cycling: 0.27 },
    { city: "Helsinki", population: 0.67, startYear: 2016, score: 69.8, cycling: 0.22 },
    { city: "Munich", population: 1.51, startYear: 2018, score: 66.4, cycling: 0.19 },
    { city: "Oslo", population: 0.72, startYear: 2010, score: 82.6, cycling: 0.41 },
    { city: "Stockholm", population: 0.98, startYear: 2013, score: 77, cycling: 0.35 },
    { city: "Lyon", population: 0.52, startYear: 2019, score: 61.3, cycling: null },
    { city: "Ghent", population: 0.27, startYear: 2017, score: 64.9, cycling: 0.3 },
    { city: "Bologna", population: 0.39, startYear: 2020, score: 58.7, cycling: 0.12 },
    { city: "Ljubljana", population: 0.3, startYear: 2009, score: 73.4, cycling: 0.16 },
  ]}
  source="Illustrative data for the gallery"
/>
```

### Default columns, no sorting

```tsx
import { DataTable } from "insightcharts";

<DataTable
  sortable={false}
  rows={[
    { Plan: "Starter", Seats: 5, "Price per seat": "$8", "Annual discount": "None" },
    { Plan: "Team", Seats: 25, "Price per seat": "$12", "Annual discount": "10%" },
    { Plan: "Enterprise", Seats: 250, "Price per seat": "Custom", "Annual discount": "Negotiated" },
  ]}
/>
```

### Two highlighted rows, negative values

```tsx
import { DataTable } from "insightcharts";

<DataTable
  caption="Revenue grew in 2 of 5 regions in the fourth quarter"
  highlight={["North", "Islands"]}
  columns={[
    { key: "region", label: "Region" },
    { key: "revenue", label: "Revenue", format: "currency:EUR" },
    {
      key: "growth",
      label: "Quarterly growth",
      format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 },
      bar: true,
      width: "40%",
    },
  ]}
  rows={[
    { region: "North", revenue: 4820000, growth: 0.064 },
    { region: "South", revenue: 3950000, growth: -0.021 },
    { region: "East", revenue: 2210000, growth: -0.048 },
    { region: "West", revenue: 5130000, growth: -0.007 },
    { region: "Islands", revenue: 640000, growth: 0.112 },
  ]}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/data-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/data-table.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
