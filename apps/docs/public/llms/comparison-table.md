# Comparison table (`comparison-table`)

> A table whose rows carry inline sparklines, deltas and in-cell bars beside their exact values, from rows and a column config.

- Component: `ComparisonTable` (import from `insightcharts`)
- Spec type: `"comparison-table"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Comparing five to twenty entities on a level, a trend and a change at once: countries, products, teams. Readers look up their row. The sparkline and delta show how the value changed.

## Avoid

Plain lookups with no series (use `data-table`); one measure ranked (use `ranked-list` or `bar-chart`); trends the reader must compare precisely (use `small-multiples`). Each sparkline has its own scale, so it shows the direction of change and cannot be used to compare levels between rows.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/comparison-table
```

The file lands at `components/insightcharts/molecules/comparison-table.tsx`. `@insightcharts/comparison-table-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  {
    "2019": 40.1,
    "2020": 44.2,
    "2021": 40.9,
    "2022": 44.5,
    "2023": 52.6,
    "2024": 58.9,
    country: "Germany",
    share: 58.9,
    twh: 498,
  },
  {
    "2019": 37.5,
    "2020": 44.1,
    "2021": 46.7,
    "2022": 42.2,
    "2023": 50.3,
    "2024": 56.8,
    country: "Spain",
    share: 56.8,
    twh: 264,
  },
  {
    "2019": 18.2,
    "2020": 26.1,
    "2021": 33,
    "2022": 40.1,
    "2023": 47.7,
    "2024": 52.4,
    country: "Netherlands",
    share: 52.4,
    twh: 121,
  },
  {
    "2019": 39.9,
    "2020": 41.7,
    "2021": 40.3,
    "2022": 35.6,
    "2023": 43.8,
    "2024": 49,
    country: "Italy",
    share: 49,
    twh: 264,
  },
  {
    "2019": 20.9,
    "2020": 24.2,
    "2021": 22.5,
    "2022": 24.4,
    "2023": 27,
    "2024": 28.3,
    country: "France",
    share: 28.3,
    twh: 536,
  },
  {
    "2019": 14.1,
    "2020": 17.2,
    "2021": 16.9,
    "2022": 20.6,
    "2023": 26.4,
    "2024": 29.5,
    country: "Poland",
    share: 29.5,
    twh: 167,
  },
];

<ComparisonTable
  title="The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024"
  subtitle="Renewable share of electricity generation, selected EU countries, 2019 to 2024"
  data={data}
  columns={[
    { key: "country", label: "Country" },
    { key: "twh", label: "Generation, TWh", kind: "bar", format: "integer", hideBelow: 560 },
    { key: "share", label: "Share, 2024", format: "{value}%" },
    {
      key: "trend",
      label: "2019 to 2024",
      kind: "sparkline",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      format: "{value}%",
    },
    {
      key: "change",
      label: "Change",
      kind: "delta",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      change: "absolute",
      format: "{value} pts",
    },
  ]}
  sort={{ key: "share" }}
  highlight="Netherlands"
  source="Ember, European Electricity Review 2025"
  note="Rounded, illustrative"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "comparison-table",
  "title": "The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024",
  "subtitle": "Renewable share of electricity generation, selected EU countries, 2019 to 2024",
  "data": [
    {
      "2019": 40.1,
      "2020": 44.2,
      "2021": 40.9,
      "2022": 44.5,
      "2023": 52.6,
      "2024": 58.9,
      "country": "Germany",
      "share": 58.9,
      "twh": 498
    },
    {
      "2019": 37.5,
      "2020": 44.1,
      "2021": 46.7,
      "2022": 42.2,
      "2023": 50.3,
      "2024": 56.8,
      "country": "Spain",
      "share": 56.8,
      "twh": 264
    },
    {
      "2019": 18.2,
      "2020": 26.1,
      "2021": 33,
      "2022": 40.1,
      "2023": 47.7,
      "2024": 52.4,
      "country": "Netherlands",
      "share": 52.4,
      "twh": 121
    },
    {
      "2019": 39.9,
      "2020": 41.7,
      "2021": 40.3,
      "2022": 35.6,
      "2023": 43.8,
      "2024": 49,
      "country": "Italy",
      "share": 49,
      "twh": 264
    },
    {
      "2019": 20.9,
      "2020": 24.2,
      "2021": 22.5,
      "2022": 24.4,
      "2023": 27,
      "2024": 28.3,
      "country": "France",
      "share": 28.3,
      "twh": 536
    },
    {
      "2019": 14.1,
      "2020": 17.2,
      "2021": 16.9,
      "2022": 20.6,
      "2023": 26.4,
      "2024": 29.5,
      "country": "Poland",
      "share": 29.5,
      "twh": 167
    }
  ],
  "columns": [
    { "key": "country", "label": "Country" },
    {
      "key": "twh",
      "label": "Generation, TWh",
      "kind": "bar",
      "format": "integer",
      "hideBelow": 560
    },
    { "key": "share", "label": "Share, 2024", "format": "{value}%" },
    {
      "key": "trend",
      "label": "2019 to 2024",
      "kind": "sparkline",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "format": "{value}%"
    },
    {
      "key": "change",
      "label": "Change",
      "kind": "delta",
      "fields": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "change": "absolute",
      "format": "{value} pts"
    }
  ],
  "sort": { "key": "share" },
  "highlight": "Netherlands",
  "source": "Ember, European Electricity Review 2025",
  "note": "Rounded, illustrative"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | Wide data: one row per entity. Long data: one row per entity and period, with `groupBy`. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before rows are grouped. |
| `columns` (required) | `(string \| { key, label?, kind?, fields?, agg?, change?, format?, upIsGood?, mark?, align?, width?, hideBelow?, sortable? })[]` |  | Columns in order; the first is the row header. `kind` is `text`, `number`, `sparkline`, `delta` or `bar`. For wide data give a sparkline or computed delta its series with `fields`; for long data they use the group's rows. |
| `groupBy` | `string` |  | Long data: the entity field. Rows sharing a value become one table row, in data order. |
| `highlight` | `string \| string[]` |  | Entities to emphasise, matched on the first column. |
| `sort` | `{ key, direction?: "asc" \| "desc" }` |  | Order rows by a column's value. Default direction: descending. With `sortable` this is the opening order. |
| `sortable` | `boolean` | `true` | Click or press Enter on a column header to sort by it (numbers largest first, text A to Z); a second press reverses and a third restores the original order. Sparkline columns do not sort; set `sortable: false` on a column to exclude it. |
| `limit` | `number` |  | Show only the first N rows. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding. |
| `title` | `string` |  | The main fact with its number, or a plain label. Set as the table's `<caption>`. |
| `subtitle` | `string` |  | Units and period. |
| `source` | `string` |  | Shown under the table as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the sparklines and deltas. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [sparkline](https://insightcharts.dev/llms/sparkline.md), [delta](https://insightcharts.dev/llms/delta.md)
- Used by: [scorecard](https://insightcharts.dev/llms/scorecard.md)

## More examples

### Long data with groupBy, relative change, compact, ledger theme

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  { country: "Germany", year: "2019", share: 40.1 },
  { country: "Germany", year: "2020", share: 44.2 },
  { country: "Germany", year: "2021", share: 40.9 },
  { country: "Germany", year: "2022", share: 44.5 },
  { country: "Germany", year: "2023", share: 52.6 },
  { country: "Germany", year: "2024", share: 58.9 },
  { country: "Spain", year: "2019", share: 37.5 },
  { country: "Spain", year: "2020", share: 44.1 },
  // ... 28 more rows
];

<ComparisonTable
  theme="ledger"
  title="Germany's renewable share of electricity was 58.9% in 2024"
  highlight="Germany"
  data={data}
  groupBy="country"
  density="compact"
  columns={[
    { key: "country", label: "Country" },
    { key: "share", label: "Latest", format: "{value}%" },
    { key: "share", label: "Peak", agg: "max", format: "{value}%", hideBelow: 420 },
    { key: "share", label: "Trend", kind: "sparkline", mark: "bar", format: "{value}%" },
    { key: "share", label: "Since 2019", kind: "delta" },
  ]}
  note="Illustrative data"
/>
```

### Deltas given in the data, down is good, noir theme

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  {
    team: "Onboarding",
    median: "1 h 05 min",
    weekly: [2.4, 2.1, 1.9, 1.6, 1.3, 1.1],
    change: -0.54,
  },
  {
    team: "Technical support",
    median: "2 h 14 min",
    weekly: [4.1, 3.8, 3.2, 2.9, 2.4, 2.2],
    change: -0.46,
  },
  { team: "Billing", median: "3 h 40 min", weekly: [3.1, 3, 3.3, 3.4, 3.6, 3.7], change: 0.19 },
];

<ComparisonTable
  theme="noir"
  highlight="Billing"
  title="Billing's first response time rose 19% over six weeks"
  data={data}
  columns={[
    { key: "team", label: "Team" },
    { key: "median", label: "Median first response", align: "right" },
    { key: "weekly", label: "Last six weeks" },
    { key: "change", label: "Change", kind: "delta", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

### Bars, sparklines and absolute change, science theme

```tsx
import { ComparisonTable } from "insightcharts";

const data = [
  {
    "2019": 0.62,
    "2020": 0.71,
    "2021": 0.68,
    "2022": 0.74,
    "2023": 1.12,
    "2024": 1.21,
    basin: "North Atlantic",
    anomaly: 1.21,
    area: 41,
  },
  {
    "2019": 0.58,
    "2020": 0.66,
    "2021": 0.63,
    "2022": 0.72,
    "2023": 0.89,
    "2024": 0.94,
    basin: "North Pacific",
    anomaly: 0.94,
    area: 77,
  },
  {
    "2019": 0.49,
    "2020": 0.52,
    "2021": 0.47,
    "2022": 0.5,
    "2023": 0.71,
    "2024": 0.83,
    basin: "Indian",
    anomaly: 0.83,
    area: 71,
  },
  {
    "2019": 0.31,
    "2020": 0.36,
    "2021": 0.34,
    "2022": 0.38,
    "2023": 0.55,
    "2024": 0.61,
    basin: "South Atlantic",
    anomaly: 0.61,
    area: 40,
  },
  {
    "2019": 0.28,
    "2020": 0.3,
    "2021": 0.25,
    "2022": 0.27,
    "2023": 0.52,
    "2024": 0.56,
    basin: "South Pacific",
    anomaly: 0.56,
    area: 85,
  },
  {
    "2019": 0.05,
    "2020": 0.08,
    "2021": 0.02,
    "2022": 0.06,
    "2023": 0.14,
    "2024": 0.11,
    basin: "Southern",
    anomaly: 0.11,
    area: 22,
  },
];

<ComparisonTable
  theme="science"
  title="The North Atlantic surface was 1.21°C above its 1991 to 2020 average in 2024"
  subtitle="Annual mean sea surface temperature anomaly by ocean basin, °C, 2019 to 2024"
  data={data}
  columns={[
    { key: "basin", label: "Basin" },
    { key: "area", label: "Area, million km²", kind: "bar", format: "integer", hideBelow: 560 },
    { key: "anomaly", label: "Anomaly, 2024", format: "{value}°C" },
    {
      key: "trend",
      label: "2019 to 2024",
      kind: "sparkline",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      format: "{value}°C",
    },
    {
      key: "change",
      label: "Change",
      kind: "delta",
      fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
      change: "absolute",
      format: "{value}°C",
      upIsGood: false,
    },
  ]}
  sort={{ key: "anomaly" }}
  highlight="North Atlantic"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/comparison-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/comparison-table.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
