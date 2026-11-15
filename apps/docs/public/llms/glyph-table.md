# Glyph table (`glyph-table`)

> A table with one row per entity in which every number is drawn as a small form chosen per column (counted dots, squares or icons, a ring, a sized circle, a bar) with the value printed beside it.

- Component: `GlyphTable` (import from `insightcharts`)
- Spec type: `"glyph-table"`
- Level: atom. Category: poster.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Comparing 3 to about 12 entities across 2 to 5 measures with different units, when the table should read as a graphic: profiles of products, cities, teams or species. Pair it with curve-rank by passing both the same `order`.

## Avoid

Looking up many exact values, sorting, or more than about 12 rows (use data-table); one measure across entities (use bar-chart or pictogram-chart); a trend over time (use line-chart or small-multiples).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/glyph-table
```

The file lands at `components/insightcharts/atoms/glyph-table.tsx`. `@insightcharts/glyph-table-demo` adds a ready-made example next to it.

## Usage

```tsx
import { GlyphTable } from "insightcharts";

<GlyphTable
  theme="noir"
  caption="Filter coffee sold 310 cups a day at £2.40 a cup"
  subtitle="Six drinks at one café: price, cups sold per day, share ordered with oat milk, seconds to prepare and caffeine"
  note="Illustrative figures."
  name="drink"
  nameLabel="Drink"
  columns={[
    {
      field: "price",
      label: "Price per cup",
      glyph: "bar",
      format: { style: "currency", currency: "GBP" },
      max: 5,
    },
    { field: "cups", label: "Cups sold a day", glyph: "dots", unit: 10 },
    { field: "oat", label: "With oat milk", glyph: "ring", format: "{value}%" },
    { field: "seconds", label: "Seconds to prepare", glyph: "blocks", unit: 10 },
    { field: "caffeine", label: "Caffeine, mg", glyph: "circle" },
  ]}
  rows={[
    { drink: "Filter coffee", price: 2.4, cups: 310, oat: 8, seconds: 15, caffeine: 140 },
    { drink: "Espresso", price: 2.6, cups: 145, oat: null, seconds: 30, caffeine: 65 },
    { drink: "Flat white", price: 3.6, cups: 260, oat: 34, seconds: 95, caffeine: 130 },
    { drink: "Iced latte", price: 4.2, cups: 180, oat: 41, seconds: 70, caffeine: 130 },
    { drink: "Matcha latte", price: 4.8, cups: 75, oat: 57, seconds: 110, caffeine: 70 },
    { drink: "Hot chocolate", price: 3.9, cups: 40, oat: 22, seconds: 85, caffeine: 10 },
  ]}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "glyph-table",
  "theme": "noir",
  "caption": "Filter coffee sold 310 cups a day at £2.40 a cup",
  "subtitle": "Six drinks at one café: price, cups sold per day, share ordered with oat milk, seconds to prepare and caffeine",
  "note": "Illustrative figures.",
  "name": "drink",
  "nameLabel": "Drink",
  "columns": [
    {
      "field": "price",
      "label": "Price per cup",
      "glyph": "bar",
      "format": { "style": "currency", "currency": "GBP" },
      "max": 5
    },
    { "field": "cups", "label": "Cups sold a day", "glyph": "dots", "unit": 10 },
    { "field": "oat", "label": "With oat milk", "glyph": "ring", "format": "{value}%" },
    { "field": "seconds", "label": "Seconds to prepare", "glyph": "blocks", "unit": 10 },
    { "field": "caffeine", "label": "Caffeine, mg", "glyph": "circle" }
  ],
  "rows": [
    {
      "drink": "Filter coffee",
      "price": 2.4,
      "cups": 310,
      "oat": 8,
      "seconds": 15,
      "caffeine": 140
    },
    { "drink": "Espresso", "price": 2.6, "cups": 145, "oat": null, "seconds": 30, "caffeine": 65 },
    { "drink": "Flat white", "price": 3.6, "cups": 260, "oat": 34, "seconds": 95, "caffeine": 130 },
    { "drink": "Iced latte", "price": 4.2, "cups": 180, "oat": 41, "seconds": 70, "caffeine": 130 },
    { "drink": "Matcha latte", "price": 4.8, "cups": 75, "oat": 57, "seconds": 110, "caffeine": 70 },
    { "drink": "Hot chocolate", "price": 3.9, "cups": 40, "oat": 22, "seconds": 85, "caffeine": 10 }
  ]
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` (required) | `Row[]` |  | One object per entity. |
| `name` | `string` |  | Field holding the entity name. Defaults to the first key of the first row. |
| `nameLabel` | `string` |  | Heading of the name column. |
| `columns` (required) | `{ field, label?, glyph?: "dots" \| "blocks" \| "ring" \| "circle" \| "bar" \| "icons" \| "text", unit?, format?, max?, icon? }[]` |  | Glyph columns in order. `dots`, `blocks` and `icons` draw one mark per `unit` (default 1, raised to a round number when the largest value would not fit, and stated in the heading). `ring` fills to `max` (default 100, or 1 for fractions). `circle` is sized by area and `bar` by length against `max` (default: the column's largest value). `text` prints the value alone. |
| `order` | `string[]` |  | Entity names in display order; also assigns colours. Pass the same list to curve-rank to match its curve colours. |
| `highlight` | `string \| string[]` |  | Entities drawn in colour; every other row turns grey. |
| `colorBy` | `"series" \| "none"` |  | `series`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (curve-rank derives the same ones). `none`: every row in the accent. Default: series while the rows fit the palette (at most 8), none beyond. |
| `caption` | `string` |  | The table's title, as a real `<caption>`. |
| `subtitle` | `string` |  | Measures, units and period, under the caption. |
| `source` | `string` |  | Shown under the table as "Source: ...". |
| `note` | `string` |  | Method notes or caveats, shown under the table. |
| `select` | `boolean` |  | Let readers click a row (or press Enter on it) to select it; the other rows fade. |
| `onSelect` | `(values: string[]) => void` |  | Called with the selected entity names whenever the selection changes. |
| `selected` | `string[]` |  | Controlled selection: the entity names currently selected. When given, the table shows exactly this list and a click only calls `onSelect`. Omit it and the table keeps its own selection. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [matrix-poster](https://insightcharts.dev/llms/matrix-poster.md), [profile-poster](https://insightcharts.dev/llms/profile-poster.md)

## More examples

### Highlighted row, icons, selectable

```tsx
import { GlyphTable } from "insightcharts";

<GlyphTable
  caption="The night shift had 4 nurses for 28 beds"
  subtitle="Three shifts on one hospital ward: nurses on duty, occupied beds, share of call bells answered within 2 minutes"
  note="Illustrative figures."
  name="shift"
  nameLabel="Shift"
  highlight="Night"
  select
  columns={[
    { field: "nurses", label: "Nurses on duty", glyph: "icons", icon: "person" },
    { field: "beds", label: "Occupied beds", glyph: "blocks" },
    {
      field: "answered",
      label: "Bells answered in 2 minutes",
      glyph: "ring",
      format: "percent",
      max: 1,
    },
    { field: "handover", label: "Handover, minutes", glyph: "text" },
  ]}
  rows={[
    { shift: "Morning", nurses: 9, beds: 30, answered: 0.91, handover: 25 },
    { shift: "Evening", nurses: 7, beds: 29, answered: 0.84, handover: 20 },
    { shift: "Night", nurses: 4, beds: 28, answered: 0.62, handover: 15 },
  ]}
/>
```

### Ten entities, one colour each

```tsx
import { GlyphTable } from "insightcharts";

<GlyphTable
  theme="sunrise"
  caption="Ten districts by rent, commute, green space and population"
  subtitle="Median monthly rent, minutes to the centre, share of land that is park and residents, ten districts of one city"
  note="Illustrative figures for an invented city."
  name="district"
  nameLabel="District"
  colorBy="series"
  columns={[
    {
      field: "rent",
      label: "Median rent a month",
      glyph: "bar",
      format: { style: "currency", currency: "EUR", maximumFractionDigits: 0 },
    },
    { field: "commute", label: "Minutes to the centre", glyph: "dots" },
    { field: "park", label: "Park land", glyph: "ring", format: "{value}%" },
    { field: "residents", label: "Residents", glyph: "circle", format: "integer" },
  ]}
  rows={[
    { district: "Old Town", rent: 1480, commute: 12, park: 9, residents: 18400 },
    { district: "Harbour", rent: 1390, commute: 15, park: 6, residents: 12100 },
    { district: "Riverside", rent: 1310, commute: 18, park: 22, residents: 21700 },
    { district: "University", rent: 1180, commute: 14, park: 15, residents: 26300 },
    { district: "Market", rent: 1120, commute: 20, park: 4, residents: 9800 },
    { district: "Hillcrest", rent: 1040, commute: 26, park: 31, residents: 15200 },
    { district: "Northgate", rent: 960, commute: 31, park: 12, residents: 30500 },
    { district: "Eastfield", rent: 890, commute: 34, park: 17, residents: 24900 },
    { district: "Mill Quarter", rent: 820, commute: 29, park: 8, residents: 7600 },
    { district: "Lakeside", rent: 760, commute: 41, park: 38, residents: 11300 },
  ]}
/>
```

### Stress: 10 rows, long names, very uneven values, missing data

```tsx
import { GlyphTable } from "insightcharts";

<GlyphTable
  theme="ocean"
  caption="Ten library branches by loans, visits and opening hours"
  subtitle="Loans per year, visits per day, hours open per week and share of loans that were e-books, 2024"
  note="Illustrative figures."
  name="branch"
  nameLabel="Branch"
  order={["Central Library and City Archive", "Riverside"]}
  columns={[
    { field: "loans", label: "Loans a year", glyph: "dots", format: "compact" },
    { field: "visits", label: "Visits a day", glyph: "circle", format: "integer" },
    { field: "hours", label: "Hours open a week", glyph: "bar", max: 84 },
    { field: "ebooks", label: "E-book share", glyph: "ring", format: "{value}%" },
  ]}
  rows={[
    { branch: "Riverside", loans: 88000, visits: 640, hours: 54, ebooks: 31 },
    {
      branch: "Central Library and City Archive",
      loans: 412000,
      visits: 3900,
      hours: 84,
      ebooks: 38,
    },
    { branch: "Hillcrest", loans: 61000, visits: 410, hours: 48, ebooks: 22 },
    {
      branch: "Northgate Community Hub and Learning Centre",
      loans: 47500,
      visits: 380,
      hours: 60,
      ebooks: 27,
    },
    { branch: "Old Town", loans: 39000, visits: 290, hours: 40, ebooks: 18 },
    { branch: "Mill Quarter", loans: 22000, visits: 150, hours: 32, ebooks: null },
    { branch: "Eastfield", loans: 18400, visits: 120, hours: 30, ebooks: 12 },
    { branch: "Lakeside", loans: 9600, visits: 70, hours: 24, ebooks: 9 },
    { branch: "Harbour reading room", loans: 2100, visits: 25, hours: 12, ebooks: null },
    { branch: "Mobile library van", loans: 900, visits: 40, hours: 18, ebooks: 3 },
  ]}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/glyph-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/glyph-table.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
