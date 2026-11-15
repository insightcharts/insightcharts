# Reproduce the "Customer support: default theme, three chart forms and a table" example of the InsightCharts Data explorer

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Customer support: default theme, three chart forms and a table" example of `data-explorer` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A set of linked charts over one shared dataset that filter each other. It has a headline, a sentence of instructions with filter chips, a row of figures that recompute from the filtered rows, two to four charts and an optional detail table. It opens on selections the author chooses.

Use it when: Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size.

Pick something else when: A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/data-explorer
```

The file lands at `components/insightcharts/templates/data-explorer.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { DataExplorer } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "channel": "Email", "plan": "Free", "area": "Billing", "tickets": 310, "hours": 4340 },
  { "channel": "Email", "plan": "Free", "area": "Login", "tickets": 420, "hours": 5880 },
  { "channel": "Email", "plan": "Free", "area": "Sync", "tickets": 150, "hours": 3150 }
]
```

How the example maps columns to props:

- `unit` = `"tickets"`. Noun for what the figures total, used in figure context ("3,650 across all trips").

With the user's data, keep the props and change the column names.

## 5. The "Customer support: default theme, three chart forms and a table" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, DataExplorer, DonutChart, SegmentedBar } from "insightcharts";

const data = [
  { channel: "Email", plan: "Free", area: "Billing", tickets: 310, hours: 4340 },
  { channel: "Email", plan: "Free", area: "Login", tickets: 420, hours: 5880 },
  { channel: "Email", plan: "Free", area: "Sync", tickets: 150, hours: 3150 },
  { channel: "Email", plan: "Free", area: "Reports", tickets: 60, hours: 840 },
  { channel: "Email", plan: "Paid", area: "Billing", tickets: 260, hours: 3640 },
  { channel: "Email", plan: "Paid", area: "Login", tickets: 140, hours: 1960 },
  { channel: "Email", plan: "Paid", area: "Sync", tickets: 330, hours: 6930 },
  { channel: "Email", plan: "Paid", area: "Reports", tickets: 170, hours: 2380 },
  { channel: "Chat", plan: "Free", area: "Billing", tickets: 120, hours: 360 },
  { channel: "Chat", plan: "Free", area: "Login", tickets: 380, hours: 1140 },
  { channel: "Chat", plan: "Free", area: "Sync", tickets: 90, hours: 405 },
  { channel: "Chat", plan: "Free", area: "Reports", tickets: 30, hours: 90 },
  { channel: "Chat", plan: "Paid", area: "Billing", tickets: 240, hours: 720 },
  { channel: "Chat", plan: "Paid", area: "Login", tickets: 160, hours: 480 },
  { channel: "Chat", plan: "Paid", area: "Sync", tickets: 410, hours: 1845 },
  { channel: "Chat", plan: "Paid", area: "Reports", tickets: 120, hours: 360 },
  { channel: "Phone", plan: "Paid", area: "Billing", tickets: 90, hours: 540 },
  { channel: "Phone", plan: "Paid", area: "Login", tickets: 40, hours: 240 },
  { channel: "Phone", plan: "Paid", area: "Sync", tickets: 130, hours: 1170 },
  { channel: "Phone", plan: "Paid", area: "Reports", tickets: 40, hours: 240 },
];

<DataExplorer
  kicker="Support desk · Q3 2024"
  title="Sync tickets took 12.2 hours to resolve on average in Q3, against 9.9 for all tickets"
  deck="78% of sync tickets came from paid plans. Sync tickets sent by email took 21.0 hours. The view below is filtered to sync tickets."
  instructions="Click a mark to filter the other charts, the figures and the table. Click it again to clear."
  finding={{
    lead: "Sync was 1,110 of the 3,690 tickets in Q3",
    body: "480 of them arrived by email and took 21.0 hours on average. The 500 that arrived by chat took 4.5 hours.",
  }}
  data={data}
  unit="tickets"
  figuresVariant="tinted"
  labels={{ area: "Product area", channel: "Channel", plan: "Plan" }}
  initialSelections={{ "by-area": { field: "area", values: ["Sync"] } }}
  figures={[
    { label: "Tickets", field: "tickets", format: "integer" },
    { label: "Average hours to resolve", field: "hours", per: "tickets", format: "decimal:1" },
    {
      label: "Share from paid plans",
      field: "tickets",
      where: { field: "plan", value: "Paid" },
      per: "tickets",
      format: "percent",
    },
    {
      label: "Share sent by email",
      field: "tickets",
      where: { field: "channel", value: "Email" },
      per: "tickets",
      format: "percent",
    },
  ]}
  charts={[
    <BarChart
      id="by-area"
      x="area"
      y="tickets"
      select
      sort="desc"
      orientation="horizontal"
      format="integer"
      title="Product area"
      subtitle="Tickets"
      transform={{ type: "aggregate", groupBy: "area", measures: { tickets: { op: "sum", field: "tickets" } } }}
    />,
    <DonutChart
      id="by-channel"
      name="channel"
      value="tickets"
      select
      format="integer"
      height={220}
      title="Channel"
      subtitle="Tickets"
      transform={{
        type: "aggregate",
        groupBy: "channel",
        measures: { tickets: { op: "sum", field: "tickets" } },
      }}
    />,
    <SegmentedBar
      id="by-plan"
      name="plan"
      value="tickets"
      select
      format="integer"
      title="Plan"
      subtitle="Tickets"
      transform={{ type: "aggregate", groupBy: "plan", measures: { tickets: { op: "sum", field: "tickets" } } }}
    />,
  ]}
  table={{
    caption: "Selected tickets by channel and plan",
    transform: [
      {
        type: "aggregate",
        groupBy: ["channel", "plan"],
        measures: { tickets: { op: "sum", field: "tickets" }, hours: { op: "sum", field: "hours" } },
      },
      { type: "derive", as: "each", op: "divide", fields: ["hours", "tickets"] },
      { type: "sort", by: "tickets", order: "desc" },
    ],
    columns: [
      { key: "channel", label: "Channel" },
      { key: "plan", label: "Plan" },
      { key: "tickets", label: "Tickets", format: "integer", bar: true, width: "34%" },
      { key: "each", label: "Average hours", format: "decimal:1" },
    ],
  }}
  sources="Support desk ticket export"
  period="July to September 2024"
  method="Hours to resolve run from the first message to the ticket being closed, including nights and weekends."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Support desk · Q3 2024",
  "title": "Sync tickets took 12.2 hours to resolve on average in Q3, against 9.9 for all tickets",
  "deck": "78% of sync tickets came from paid plans. Sync tickets sent by email took 21.0 hours. The view below is filtered to sync tickets.",
  "instructions": "Click a mark to filter the other charts, the figures and the table. Click it again to clear.",
  "finding": {
    "lead": "Sync was 1,110 of the 3,690 tickets in Q3",
    "body": "480 of them arrived by email and took 21.0 hours on average. The 500 that arrived by chat took 4.5 hours."
  },
  "data": [
    { "channel": "Email", "plan": "Free", "area": "Billing", "tickets": 310, "hours": 4340 },
    { "channel": "Email", "plan": "Free", "area": "Login", "tickets": 420, "hours": 5880 },
    { "channel": "Email", "plan": "Free", "area": "Sync", "tickets": 150, "hours": 3150 },
    { "channel": "Email", "plan": "Free", "area": "Reports", "tickets": 60, "hours": 840 },
    { "channel": "Email", "plan": "Paid", "area": "Billing", "tickets": 260, "hours": 3640 },
    { "channel": "Email", "plan": "Paid", "area": "Login", "tickets": 140, "hours": 1960 },
    { "channel": "Email", "plan": "Paid", "area": "Sync", "tickets": 330, "hours": 6930 },
    { "channel": "Email", "plan": "Paid", "area": "Reports", "tickets": 170, "hours": 2380 },
    { "channel": "Chat", "plan": "Free", "area": "Billing", "tickets": 120, "hours": 360 },
    { "channel": "Chat", "plan": "Free", "area": "Login", "tickets": 380, "hours": 1140 },
    { "channel": "Chat", "plan": "Free", "area": "Sync", "tickets": 90, "hours": 405 },
    { "channel": "Chat", "plan": "Free", "area": "Reports", "tickets": 30, "hours": 90 },
    { "channel": "Chat", "plan": "Paid", "area": "Billing", "tickets": 240, "hours": 720 },
    { "channel": "Chat", "plan": "Paid", "area": "Login", "tickets": 160, "hours": 480 },
    { "channel": "Chat", "plan": "Paid", "area": "Sync", "tickets": 410, "hours": 1845 },
    { "channel": "Chat", "plan": "Paid", "area": "Reports", "tickets": 120, "hours": 360 },
    { "channel": "Phone", "plan": "Paid", "area": "Billing", "tickets": 90, "hours": 540 },
    { "channel": "Phone", "plan": "Paid", "area": "Login", "tickets": 40, "hours": 240 },
    { "channel": "Phone", "plan": "Paid", "area": "Sync", "tickets": 130, "hours": 1170 },
    { "channel": "Phone", "plan": "Paid", "area": "Reports", "tickets": 40, "hours": 240 }
  ],
  "unit": "tickets",
  "figuresVariant": "tinted",
  "labels": { "area": "Product area", "channel": "Channel", "plan": "Plan" },
  "initialSelections": { "by-area": { "field": "area", "values": ["Sync"] } },
  "figures": [
    { "label": "Tickets", "field": "tickets", "format": "integer" },
    {
      "label": "Average hours to resolve",
      "field": "hours",
      "per": "tickets",
      "format": "decimal:1"
    },
    {
      "label": "Share from paid plans",
      "field": "tickets",
      "where": { "field": "plan", "value": "Paid" },
      "per": "tickets",
      "format": "percent"
    },
    {
      "label": "Share sent by email",
      "field": "tickets",
      "where": { "field": "channel", "value": "Email" },
      "per": "tickets",
      "format": "percent"
    }
  ],
  "charts": [
    {
      "type": "bar-chart",
      "id": "by-area",
      "x": "area",
      "y": "tickets",
      "select": true,
      "sort": "desc",
      "orientation": "horizontal",
      "format": "integer",
      "title": "Product area",
      "subtitle": "Tickets",
      "transform": {
        "type": "aggregate",
        "groupBy": "area",
        "measures": { "tickets": { "op": "sum", "field": "tickets" } }
      }
    },
    {
      "type": "donut-chart",
      "id": "by-channel",
      "name": "channel",
      "value": "tickets",
      "select": true,
      "format": "integer",
      "height": 220,
      "title": "Channel",
      "subtitle": "Tickets",
      "transform": {
        "type": "aggregate",
        "groupBy": "channel",
        "measures": { "tickets": { "op": "sum", "field": "tickets" } }
      }
    },
    {
      "type": "segmented-bar",
      "id": "by-plan",
      "name": "plan",
      "value": "tickets",
      "select": true,
      "format": "integer",
      "title": "Plan",
      "subtitle": "Tickets",
      "transform": {
        "type": "aggregate",
        "groupBy": "plan",
        "measures": { "tickets": { "op": "sum", "field": "tickets" } }
      }
    }
  ],
  "table": {
    "caption": "Selected tickets by channel and plan",
    "transform": [
      {
        "type": "aggregate",
        "groupBy": ["channel", "plan"],
        "measures": {
          "tickets": { "op": "sum", "field": "tickets" },
          "hours": { "op": "sum", "field": "hours" }
        }
      },
      { "type": "derive", "as": "each", "op": "divide", "fields": ["hours", "tickets"] },
      { "type": "sort", "by": "tickets", "order": "desc" }
    ],
    "columns": [
      { "key": "channel", "label": "Channel" },
      { "key": "plan", "label": "Plan" },
      { "key": "tickets", "label": "Tickets", "format": "integer", "bar": true, "width": "34%" },
      { "key": "each", "label": "Average hours", "format": "decimal:1" }
    ]
  },
  "sources": "Support desk ticket export",
  "period": "July to September 2024",
  "method": "Hours to resolve run from the first message to the ticket being closed, including nights and weekends.",
  "note": "Illustrative data",
  "type": "data-explorer"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `finding`, `{ lead?, body?, label? }`: A callout saying what to look for in the starting view. In the example: an object with `lead`, `body`.
- `charts` (required), `Slot[]`: Two to four chart specs. Give each a stable `id`, `select: true` (or a field name) and its own aggregating `transform`; leave out `data`. In the example: 3 items: a `bar-chart` spec; a `donut-chart` spec; a `segmented-bar` spec.
- `figures`, `{ label, field?, op?, where?: { field, value }, per?, format?, context? }[]`: Figures recomputed from the filtered rows: `op` over `field` (default sum; count without a field), optionally restricted by `where` and divided by the sum of `per` for a rate or share. While a filter is active each shows the all-rows value as context. In the example: 4 items: an object with `label`, `field`, `format`; an object with `label`, `field`, `per`, `format`; an object with `label`, `field`, `where`, `per`, `format`.
- `figuresVariant`, `StatRowProps["variant"]`: How the figures are displayed: any `variant` of `stat-row`, e.g. `tiles`, `tinted` or `outline-accent`. Extra fields on a figure (`tone`, `surface`, `icon`...) are passed to its `stat-row` item. In the example: `"tinted"`.
- `table`, `{ transform?, columns?, caption?, sort?, highlight?, ... }`: A detail table of the filtered rows: the props of `data-table` without `rows`, plus a `transform` applied first. In the example: an object with `caption`, `transform`, `columns`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | What the starting view shows, as one plain sentence with the number in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `instructions` | `string` |  | One sentence saying what can be clicked and what happens. Shown in the filter line. |
| `finding` | `{ lead?, body?, label? }` |  | A callout saying what to look for in the starting view. |
| `data` (required) | `DataInput` |  | The shared, row-level dataset: rows, CSV text, a URL or a loader. |
| `transform` | `Transform \| Transform[]` |  | Applied once to the shared data. |
| `charts` (required) | `Slot[]` |  | Two to four chart specs. Give each a stable `id`, `select: true` (or a field name) and its own aggregating `transform`; leave out `data`. |
| `initialSelections` | `Record<string, { field, values?, range? }>` |  | Selections the piece opens with, keyed by chart `id`. A button restores them after the reader changes the filter. |
| `figures` | `{ label, field?, op?, where?: { field, value }, per?, format?, context? }[]` |  | Figures recomputed from the filtered rows: `op` over `field` (default sum; count without a field), optionally restricted by `where` and divided by the sum of `per` for a rate or share. While a filter is active each shows the all-rows value as context. |
| `figuresVariant` | `StatRowProps["variant"]` | `"plain"` | How the figures are displayed: any `variant` of `stat-row`, e.g. `tiles`, `tinted` or `outline-accent`. Extra fields on a figure (`tone`, `surface`, `icon`...) are passed to its `stat-row` item. |
| `table` | `{ transform?, columns?, caption?, sort?, highlight?, ... }` |  | A detail table of the filtered rows: the props of `data-table` without `rows`, plus a `transform` applied first. |
| `labels` | `Record<string, string>` |  | Display names for fields in the filter chips. |
| `unit` | `string` | `"rows"` | Noun for what the figures total, used in figure context ("3,650 across all trips"). |
| `count` | `boolean` | `false` | Show the filtered row count beside the chips. |
| `rowUnit` | `string` | `"rows"` | Noun for one row of `data` in that count. |
| `columns` | `number` |  | Preferred chart columns. |
| `restoreLabel` | `string` | `"Back to the starting view"` | Label of the button that restores `initialSelections`. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `maxWidth` | `number \| string` |  | Widest the piece may get. It is centred in wider containers. |
| `theme` | `ThemeInput` |  | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece. |
| `frame` | `boolean` |  | Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `headline` (atom), `callout` (atom), `filter-chips` (molecule), `stat-row` (molecule), `linked-charts` (molecule), `data-table` (atom), `source-note` (atom), `bar-chart` (atom), `donut-chart` (atom), `lollipop-chart` (atom), `segmented-bar` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/data-explorer.md
- Component reference with every example: https://insightcharts.dev/llms/data-explorer.md
- Registry item: https://insightcharts.dev/r/data-explorer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/data-explorer.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/data-explorer#example-customer-support-default-theme-three-chart-forms-and-a-table
- These instructions as plain text: https://insightcharts.dev/agents/templates/data-explorer/customer-support-default-theme-three-chart-forms-and-a-table.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
