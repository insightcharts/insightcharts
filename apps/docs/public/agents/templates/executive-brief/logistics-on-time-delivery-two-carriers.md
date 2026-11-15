# Reproduce the "Logistics: on-time delivery, two carriers" example of the InsightCharts Executive brief

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Logistics: on-time delivery, two carriers" example of `executive-brief` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A one-page summary. It has a headline that states the main finding with its number, a deck, a row of three or four key figures, one hero chart with a takeaway callout, two smaller supporting exhibits, a short list of actions and a source note.

Use it when: Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page.

Pick something else when: More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`).

Instructions for the alternatives: `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md, `scorecard` https://insightcharts.dev/agents/templates/scorecard.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/executive-brief
```

The file lands at `components/insightcharts/templates/executive-brief.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ExecutiveBrief } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Logistics: on-time delivery, two carriers" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { DivergingBarChart, ExecutiveBrief, Heatmap, LineChart } from "insightcharts";

<ExecutiveBrief
  kicker="Operations review · 2024"
  title="On-time deliveries rose from 86.1% to 93.4% in 2024"
  deck="Route planning software went live in April. Partner carriers delivered 90.6% of parcels on time in December."
  byline="Network operations"
  date="2025-01-21"
  figures={[
    {
      value: "93.4%",
      label: "Parcels delivered on the promised day, December",
      delta: "+7.3 pts",
      deltaLabel: "vs January",
    },
    { value: "1.84m", label: "Parcels delivered in 2024", delta: 0.11, deltaLabel: "vs 2023" },
    {
      value: "€4.10",
      label: "Delivery cost per parcel",
      delta: "−€0.35",
      deltaLabel: "vs 2023",
      upIsGood: false,
    },
  ]}
  hero={<LineChart
    data={[
      { month: "2024-01-01", own: 88, partner: 83.1 },
      { month: "2024-02-01", own: 88.4, partner: 83 },
      { month: "2024-03-01", own: 88.9, partner: 83.6 },
      { month: "2024-04-01", own: 89.6, partner: 84.2 },
      { month: "2024-05-01", own: 90.8, partner: 85 },
      { month: "2024-06-01", own: 91.9, partner: 86.1 },
      { month: "2024-07-01", own: 92.8, partner: 87.3 },
      { month: "2024-08-01", own: 93.6, partner: 88.2 },
      { month: "2024-09-01", own: 94.1, partner: 89 },
      { month: "2024-10-01", own: 94.6, partner: 89.8 },
      { month: "2024-11-01", own: 95, partner: 90.4 },
      { month: "2024-12-01", own: 95.2, partner: 90.6 },
    ]}
    x="month"
    y={["own", "partner"]}
    names={{ own: "Own fleet", partner: "Partner carriers" }}
    format="{value}%"
    title="Own-fleet on-time delivery was 95.2% in December 2024"
    subtitle="Share of parcels delivered on the promised day, by carrier type, monthly, 2024"
    annotations={[
      { type: "line", axis: "x", value: "2024-04-01", label: "Route planning goes live" },
      { type: "line", axis: "y", value: 95, label: "Target, 95%" },
    ]}
  />}
  takeaway={{
    lead: "The own fleet met the 95% target in November and December",
    body: "Partner carriers were at 90.6% in December. That is 4.6 points below the own fleet.",
    tone: "positive",
  }}
  supporting={[
    <Heatmap
      data={[
        { window: "Morning", day: "Mon", share: 4.1 },
        { window: "Morning", day: "Tue", share: 3.8 },
        { window: "Morning", day: "Wed", share: 3.9 },
        { window: "Morning", day: "Thu", share: 4.4 },
        { window: "Morning", day: "Fri", share: 5.2 },
        { window: "Morning", day: "Sat", share: 4.9 },
        { window: "Afternoon", day: "Mon", share: 5.6 },
        { window: "Afternoon", day: "Tue", share: 5.1 },
        { window: "Afternoon", day: "Wed", share: 5.3 },
        { window: "Afternoon", day: "Thu", share: 6 },
        { window: "Afternoon", day: "Fri", share: 8.1 },
        { window: "Afternoon", day: "Sat", share: 6.4 },
        { window: "Evening", day: "Mon", share: 7.9 },
        { window: "Evening", day: "Tue", share: 7.2 },
        { window: "Evening", day: "Wed", share: 7.4 },
        { window: "Evening", day: "Thu", share: 8.8 },
        { window: "Evening", day: "Fri", share: 13.8 },
        { window: "Evening", day: "Sat", share: 9.1 },
      ]}
      x="day"
      y="window"
      value="share"
      format="{value}%"
      labels
      title="13.8% of Friday evening deliveries were late in Q4"
      subtitle="Share of parcels delivered late, by weekday and delivery window, Q4 2024"
    />,
    <DivergingBarChart
      data={[
        { region: "North", change: 9.8 },
        { region: "East", change: 8.4 },
        { region: "Central", change: 7.9 },
        { region: "South", change: 6.1 },
        { region: "Islands", change: -1.7 },
      ]}
      x="region"
      y="change"
      sort="none"
      format="{value} pts"
      title="On-time delivery in the Islands region fell 1.7 points in 2024"
      subtitle="Change in on-time share, January to December 2024, percentage points"
    />,
  ]}
  actions={[
    {
      title: "Add a second evening shift on Fridays",
      text: "13.8% of Friday evening deliveries were late in Q4.",
      owner: "Depot managers · by March",
    },
    {
      title: "Give partner carriers access to the route planner",
      text: "Partner carriers were 4.6 points below the own fleet in December.",
      owner: "Carrier management · Q2",
    },
    {
      title: "Review the ferry schedule for the Islands region",
      text: "It is the only region where on-time delivery fell in 2024.",
      owner: "Network planning",
    },
  ]}
  sources="Delivery management system"
  period="January to December 2024, monthly"
  method="A parcel is on time when it is delivered on the day promised at checkout."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Operations review · 2024",
  "title": "On-time deliveries rose from 86.1% to 93.4% in 2024",
  "deck": "Route planning software went live in April. Partner carriers delivered 90.6% of parcels on time in December.",
  "byline": "Network operations",
  "date": "2025-01-21",
  "figures": [
    {
      "value": "93.4%",
      "label": "Parcels delivered on the promised day, December",
      "delta": "+7.3 pts",
      "deltaLabel": "vs January"
    },
    {
      "value": "1.84m",
      "label": "Parcels delivered in 2024",
      "delta": 0.11,
      "deltaLabel": "vs 2023"
    },
    {
      "value": "€4.10",
      "label": "Delivery cost per parcel",
      "delta": "−€0.35",
      "deltaLabel": "vs 2023",
      "upIsGood": false
    }
  ],
  "hero": {
    "type": "line-chart",
    "data": [
      { "month": "2024-01-01", "own": 88, "partner": 83.1 },
      { "month": "2024-02-01", "own": 88.4, "partner": 83 },
      { "month": "2024-03-01", "own": 88.9, "partner": 83.6 },
      { "month": "2024-04-01", "own": 89.6, "partner": 84.2 },
      { "month": "2024-05-01", "own": 90.8, "partner": 85 },
      { "month": "2024-06-01", "own": 91.9, "partner": 86.1 },
      { "month": "2024-07-01", "own": 92.8, "partner": 87.3 },
      { "month": "2024-08-01", "own": 93.6, "partner": 88.2 },
      { "month": "2024-09-01", "own": 94.1, "partner": 89 },
      { "month": "2024-10-01", "own": 94.6, "partner": 89.8 },
      { "month": "2024-11-01", "own": 95, "partner": 90.4 },
      { "month": "2024-12-01", "own": 95.2, "partner": 90.6 }
    ],
    "x": "month",
    "y": ["own", "partner"],
    "names": { "own": "Own fleet", "partner": "Partner carriers" },
    "format": "{value}%",
    "title": "Own-fleet on-time delivery was 95.2% in December 2024",
    "subtitle": "Share of parcels delivered on the promised day, by carrier type, monthly, 2024",
    "annotations": [
      { "type": "line", "axis": "x", "value": "2024-04-01", "label": "Route planning goes live" },
      { "type": "line", "axis": "y", "value": 95, "label": "Target, 95%" }
    ]
  },
  "takeaway": {
    "lead": "The own fleet met the 95% target in November and December",
    "body": "Partner carriers were at 90.6% in December. That is 4.6 points below the own fleet.",
    "tone": "positive"
  },
  "supporting": [
    {
      "type": "heatmap",
      "data": [
        { "window": "Morning", "day": "Mon", "share": 4.1 },
        { "window": "Morning", "day": "Tue", "share": 3.8 },
        { "window": "Morning", "day": "Wed", "share": 3.9 },
        { "window": "Morning", "day": "Thu", "share": 4.4 },
        { "window": "Morning", "day": "Fri", "share": 5.2 },
        { "window": "Morning", "day": "Sat", "share": 4.9 },
        { "window": "Afternoon", "day": "Mon", "share": 5.6 },
        { "window": "Afternoon", "day": "Tue", "share": 5.1 },
        { "window": "Afternoon", "day": "Wed", "share": 5.3 },
        { "window": "Afternoon", "day": "Thu", "share": 6 },
        { "window": "Afternoon", "day": "Fri", "share": 8.1 },
        { "window": "Afternoon", "day": "Sat", "share": 6.4 },
        { "window": "Evening", "day": "Mon", "share": 7.9 },
        { "window": "Evening", "day": "Tue", "share": 7.2 },
        { "window": "Evening", "day": "Wed", "share": 7.4 },
        { "window": "Evening", "day": "Thu", "share": 8.8 },
        { "window": "Evening", "day": "Fri", "share": 13.8 },
        { "window": "Evening", "day": "Sat", "share": 9.1 }
      ],
      "x": "day",
      "y": "window",
      "value": "share",
      "format": "{value}%",
      "labels": true,
      "title": "13.8% of Friday evening deliveries were late in Q4",
      "subtitle": "Share of parcels delivered late, by weekday and delivery window, Q4 2024"
    },
    {
      "type": "diverging-bar-chart",
      "data": [
        { "region": "North", "change": 9.8 },
        { "region": "East", "change": 8.4 },
        { "region": "Central", "change": 7.9 },
        { "region": "South", "change": 6.1 },
        { "region": "Islands", "change": -1.7 }
      ],
      "x": "region",
      "y": "change",
      "sort": "none",
      "format": "{value} pts",
      "title": "On-time delivery in the Islands region fell 1.7 points in 2024",
      "subtitle": "Change in on-time share, January to December 2024, percentage points"
    }
  ],
  "actions": [
    {
      "title": "Add a second evening shift on Fridays",
      "text": "13.8% of Friday evening deliveries were late in Q4.",
      "owner": "Depot managers · by March"
    },
    {
      "title": "Give partner carriers access to the route planner",
      "text": "Partner carriers were 4.6 points below the own fleet in December.",
      "owner": "Carrier management · Q2"
    },
    {
      "title": "Review the ferry schedule for the Islands region",
      "text": "It is the only region where on-time delivery fell in 2024.",
      "owner": "Network planning"
    }
  ],
  "sources": "Delivery management system",
  "period": "January to December 2024, monthly",
  "method": "A parcel is on time when it is delivered on the day promised at checkout.",
  "note": "Illustrative data",
  "type": "executive-brief"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `StatRowItem[] | StatRowProps`: Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. In the example: 3 items: an object with `value`, `label`, `delta`, `deltaLabel`; an object with `value`, `label`, `delta`, `deltaLabel`, `upIsGood`.
- `hero` (required), `Slot`: The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one. In the example: a `line-chart` spec with 12 rows.
- `takeaway`, `{ lead?, body?, label?, tone? }`: The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers. In the example: an object with `lead`, `body`, `tone`.
- `supporting`, `Slot[]`: Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px. In the example: 2 items: a `heatmap` spec with 18 rows; a `diverging-bar-chart` spec with 5 rows.
- `actions`, `(string | { title, text?, owner? })[]`: Recommended actions, numbered. Two to four. In the example: 3 items: an object with `title`, `text`, `owner`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title: the report series or team. |
| `deck` | `string` |  | One to three short sentences. Each states one more fact. |
| `byline` | `string` |  | Author line, shown as written. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `figures` | `StatRowItem[] \| StatRowProps` |  | Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. |
| `hero` (required) | `Slot` |  | The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one. |
| `takeaway` | `{ lead?, body?, label?, tone? }` |  | The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers. |
| `supporting` | `Slot[]` |  | Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px. |
| `actions` | `(string \| { title, text?, owner? })[]` |  | Recommended actions, numbered. Two to four. |
| `actionsTitle` | `string` | `"What to do"` | Heading of the actions list. |
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

- Built from: `headline` (atom), `stat-row` (molecule), `chart-callout` (molecule), `prose` (atom), `source-note` (atom), `line-chart` (atom), `dumbbell-chart` (atom), `slope-chart` (atom), `bar-chart` (atom), `heatmap` (atom), `diverging-bar-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/executive-brief.md
- Component reference with every example: https://insightcharts.dev/llms/executive-brief.md
- Registry item: https://insightcharts.dev/r/executive-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/executive-brief.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/executive-brief#example-logistics-on-time-delivery-two-carriers
- These instructions as plain text: https://insightcharts.dev/agents/templates/executive-brief/logistics-on-time-delivery-two-carriers.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
