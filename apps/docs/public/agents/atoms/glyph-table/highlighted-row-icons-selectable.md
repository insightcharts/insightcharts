# Reproduce the "Highlighted row, icons, selectable" example of the InsightCharts Glyph table

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Highlighted row, icons, selectable" example of `glyph-table` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A table with one row per entity in which every number is drawn as a small form chosen per column (counted dots, squares or icons, a ring, a sized circle, a bar) with the value printed beside it.

Use it when: Comparing 3 to about 12 entities across 2 to 5 measures with different units, when the table should read as a graphic: profiles of products, cities, teams or species. Pair it with curve-rank by passing both the same `order`.

Pick something else when: Looking up many exact values, sorting, or more than about 12 rows (use data-table); one measure across entities (use bar-chart or pictogram-chart); a trend over time (use line-chart or small-multiples).

Instructions for the alternatives: `pictogram-chart` https://insightcharts.dev/agents/atoms/pictogram-chart.md, `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `data-table` https://insightcharts.dev/agents/atoms/data-table.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/glyph-table
```

The file lands at `components/insightcharts/atoms/glyph-table.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { GlyphTable } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `rows` (`Row[]`): One object per entity. Example: 3 items: an object with `shift`, `nurses`, `beds`, `answered`, `handover`.
- `columns` (`{ field, label?, glyph?: "dots" | "blocks" | "ring" | "circle" | "bar" | "icons" | "text", unit?, format?, max?, icon? }[]`): Glyph columns in order. `dots`, `blocks` and `icons` draw one mark per `unit` (default 1, raised to a round number when the largest value would not fit, and stated in the heading). `ring` fills to `max` (default 100, or 1 for fractions). `circle` is sized by area and `bar` by length against `max` (default: the column's largest value). `text` prints the value alone. Example: 4 items: an object with `field`, `label`, `glyph`, `icon`; an object with `field`, `label`, `glyph`; an object with `field`, `label`, `glyph`, `format`, `max`.

## 5. The "Highlighted row, icons, selectable" example

This example sets no theme, so it follows the host page and its light or dark mode.

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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "caption": "The night shift had 4 nurses for 28 beds",
  "subtitle": "Three shifts on one hospital ward: nurses on duty, occupied beds, share of call bells answered within 2 minutes",
  "note": "Illustrative figures.",
  "name": "shift",
  "nameLabel": "Shift",
  "highlight": "Night",
  "select": true,
  "columns": [
    { "field": "nurses", "label": "Nurses on duty", "glyph": "icons", "icon": "person" },
    { "field": "beds", "label": "Occupied beds", "glyph": "blocks" },
    {
      "field": "answered",
      "label": "Bells answered in 2 minutes",
      "glyph": "ring",
      "format": "percent",
      "max": 1
    },
    { "field": "handover", "label": "Handover, minutes", "glyph": "text" }
  ],
  "rows": [
    { "shift": "Morning", "nurses": 9, "beds": 30, "answered": 0.91, "handover": 25 },
    { "shift": "Evening", "nurses": 7, "beds": 29, "answered": 0.84, "handover": 20 },
    { "shift": "Night", "nurses": 4, "beds": 28, "answered": 0.62, "handover": 15 }
  ],
  "type": "glyph-table"
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

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `matrix-poster` (template), `profile-poster` (template)

## Rules for this form

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/glyph-table.md
- Component reference with every example: https://insightcharts.dev/llms/glyph-table.md
- Registry item: https://insightcharts.dev/r/glyph-table.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/glyph-table.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/glyph-table#example-highlighted-row-icons-selectable
- These instructions as plain text: https://insightcharts.dev/agents/atoms/glyph-table/highlighted-row-icons-selectable.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
