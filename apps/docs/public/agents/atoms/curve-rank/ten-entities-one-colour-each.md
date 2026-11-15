# Reproduce the "Ten entities, one colour each" example of the InsightCharts Curve rank

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Ten entities, one colour each" example of `curve-rank` (a poster primitive (atom)) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Places each entity on two parallel scales, one per measure, and joins its two positions with a smooth S-curve labelled with the name and both values.

Use it when: Two different measures of the same 4 to about 15 entities, when the point is how standing on one relates to standing on the other: price against sales, staff against output, cost against usage. Each side has its own scale, stated in its heading.

Pick something else when: The same measure at two moments (use slope-chart); ranks across many periods (use bump-chart); more than about 15 entities or a statistical relationship (use scatter-chart); exact comparison on one measure (use bar-chart).

Instructions for the alternatives: `scatter-chart` https://insightcharts.dev/agents/atoms/scatter-chart.md, `slope-chart` https://insightcharts.dev/agents/atoms/slope-chart.md, `bump-chart` https://insightcharts.dev/agents/atoms/bump-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/curve-rank
```

The file lands at `components/insightcharts/atoms/curve-rank.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { CurveRank } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "district": "Old Town", "rent": 1480, "commute": 12 },
  { "district": "Harbour", "rent": 1390, "commute": 15 },
  { "district": "Riverside", "rent": 1310, "commute": 18 }
]
```

How the example maps columns to props:

- `name` = `"district"`. Entity field: one curve per row.
- `left` = `"rent"`. Field for the left-hand measure.
- `right` = `"commute"`. Field for the right-hand measure.

With the user's data, keep the props and change the column names.

## 5. The "Ten entities, one colour each" example

This example sets `theme="ledger"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

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
  { district: "Mill Quarter", rent: 820, commute: 29 },
  { district: "Lakeside", rent: 760, commute: 41 },
];

<CurveRank
  theme="ledger"
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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ledger",
  "data": [
    { "district": "Old Town", "rent": 1480, "commute": 12 },
    { "district": "Harbour", "rent": 1390, "commute": 15 },
    { "district": "Riverside", "rent": 1310, "commute": 18 },
    { "district": "University", "rent": 1180, "commute": 14 },
    { "district": "Market", "rent": 1120, "commute": 20 },
    { "district": "Hillcrest", "rent": 1040, "commute": 26 },
    { "district": "Northgate", "rent": 960, "commute": 31 },
    { "district": "Eastfield", "rent": 890, "commute": 34 },
    { "district": "Mill Quarter", "rent": 820, "commute": 29 },
    { "district": "Lakeside", "rent": 760, "commute": 41 }
  ],
  "name": "district",
  "left": "rent",
  "right": "commute",
  "leftLabel": "Median rent a month",
  "rightLabel": "Commute to the centre, minutes",
  "leftFormat": { "style": "currency", "currency": "EUR", "maximumFractionDigits": 0 },
  "rightFormat": "{value} min",
  "rightTop": "low",
  "colorBy": "series",
  "title": "Old Town had a 12-minute commute at a median rent of €1,480 a month",
  "subtitle": "Median monthly rent and commute time to the centre for ten districts of one city, shortest commute at the top",
  "note": "Illustrative figures for an invented city.",
  "type": "curve-rank"
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

Every chart also accepts these common props:

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

- Built from: nothing. It is a primitive.
- Used by: `matrix-poster` (template)

## Rules for this form

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
- Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.
- Use at most three `annotations`. Their values must match values in the data.
- No dual axes and no 3D. The chart must read without hovering.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The chart is exposed as an image (`role="img"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.
- Set `table` to add a collapsible "View data" table under the chart, for readers who need exact values or use a screen reader.
- The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] One entity is highlighted and the others are grey, or the chart has one series.
- [ ] The chart can be read without hovering.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/curve-rank.md
- Component reference with every example: https://insightcharts.dev/llms/curve-rank.md
- Registry item: https://insightcharts.dev/r/curve-rank.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/curve-rank.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/curve-rank#example-ten-entities-one-colour-each
- These instructions as plain text: https://insightcharts.dev/agents/atoms/curve-rank/ten-entities-one-colour-each.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
