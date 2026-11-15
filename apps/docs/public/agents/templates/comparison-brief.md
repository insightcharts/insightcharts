# Build a Comparison brief with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Comparison brief (`comparison-brief`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A compared with B on one page. It has a headline that states the result, the headline figures mirrored either side of their labels, one hero exhibit that shows both sides, paired exhibits on a shared scale, a verdict callout and a source note.

Use it when: Use it for two things a reader has to choose between or compare, such as two countries, two products or a before and an after. Write the result with its number in the headline. Put the four or five most important measures in `figures`. Use a two-series line, dumbbell, slope or `before-after` as the hero. In each pair, use the same chart form and the same scale for both sides. The `subject` side takes the accent colour everywhere and the other side stays grey.

Pick something else when: Three or more things (use a `comparison-table` or `small-multiple-grid` inside a `report-page`). One thing over time with nothing to compare it with (use `timeline-story`). Paired charts on different scales, because readers compare bar lengths across the pair.

Instructions for the alternatives: `small-multiple-grid` https://insightcharts.dev/agents/molecules/small-multiple-grid.md, `comparison-table` https://insightcharts.dev/agents/molecules/comparison-table.md, `timeline-story` https://insightcharts.dev/agents/templates/timeline-story.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/comparison-brief
```

The file lands at `components/insightcharts/templates/comparison-brief.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ComparisonBrief } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { BarChart, ComparisonBrief, LineChart, SegmentedBar } from "insightcharts";

<ComparisonBrief
  theme="earth"
  kicker="Home heating"
  title="With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years"
  deck="After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980."
  a={{ name: "Heat pump", detail: "Air source, 7 kW" }}
  b={{ name: "Gas boiler", detail: "Condensing combi, 30 kW" }}
  figures={[
    {
      label: "Cost to buy and fit, after grant",
      a: 3500,
      b: 3000,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    { label: "Running cost per year", a: 855, b: 980, format: "currency:GBP", better: "lower" },
    { label: "CO2 per year, tonnes", a: 0.6, b: 2.3, format: "decimal:1", better: "lower" },
    {
      label: "Heat out per unit of energy in",
      a: 3.2,
      b: 0.9,
      format: "decimal:1",
      better: "higher",
    },
    { label: "Expected life, years", a: 20, b: 15, better: "higher" },
  ]}
  hero={<LineChart
    data={[
      { year: "0", saving: -500 },
      { year: "1", saving: -375 },
      { year: "2", saving: -250 },
      { year: "3", saving: -125 },
      { year: "4", saving: 0 },
      { year: "5", saving: 125 },
      { year: "6", saving: 250 },
      { year: "7", saving: 375 },
      { year: "8", saving: 500 },
      { year: "9", saving: 625 },
      { year: "10", saving: 750 },
      { year: "11", saving: 875 },
      { year: "12", saving: 1000 },
      { year: "13", saving: 1125 },
      { year: "14", saving: 1250 },
      { year: "15", saving: 1375 },
    ]}
    x="year"
    y="saving"
    format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0, signDisplay: "exceptZero" }}
    area
    title="After 15 years the heat pump has cost £1,375 less than the boiler"
    subtitle="Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing"
    annotations={[
      {
        type: "line",
        axis: "y",
        value: 0,
        label: "Same cost as the boiler",
        dashed: false,
        emphasis: true,
      },
      { type: "point", x: "4", y: 0, label: "Break-even", position: "top" },
    ]}
  />}
  heroText="Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it."
  pairs={[
    {
      title: "The January energy bill is £120 for the heat pump and £139 for the boiler",
      text: "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      a: <BarChart
        data={[
          { month: "Jan", cost: 120 },
          { month: "Feb", cost: 108 },
          { month: "Mar", cost: 86 },
          { month: "Apr", cost: 57 },
          { month: "May", cost: 34 },
          { month: "Jun", cost: 24 },
          { month: "Jul", cost: 21 },
          { month: "Aug", cost: 22 },
          { month: "Sep", cost: 32 },
          { month: "Oct", cost: 56 },
          { month: "Nov", cost: 83 },
          { month: "Dec", cost: 112 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        option={{ yAxis: { max: 140 } }}
      />,
      b: <BarChart
        data={[
          { month: "Jan", cost: 139 },
          { month: "Feb", cost: 124 },
          { month: "Mar", cost: 101 },
          { month: "Apr", cost: 69 },
          { month: "May", cost: 43 },
          { month: "Jun", cost: 33 },
          { month: "Jul", cost: 30 },
          { month: "Aug", cost: 31 },
          { month: "Sep", cost: 41 },
          { month: "Oct", cost: 65 },
          { month: "Nov", cost: 94 },
          { month: "Dec", cost: 130 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        highlight="none"
        option={{ yAxis: { max: 140 } }}
      />,
    },
    {
      title: "Cost over 15 years by part",
      text: "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
      a: <SegmentedBar
        data={[
          { part: "Purchase and fitting", gbp: 3500 },
          { part: "Energy", gbp: 11325 },
          { part: "Servicing", gbp: 1500 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
      b: <SegmentedBar
        data={[
          { part: "Purchase and fitting", gbp: 3000 },
          { part: "Energy", gbp: 13500 },
          { part: "Servicing", gbp: 1200 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
    },
  ]}
  verdict={{
    lead: "Choose the heat pump if you get the grant and will stay at least 5 years",
    body: "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels.",
  }}
  sources={["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"]}
  method="A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "comparison-brief",
  "theme": "earth",
  "kicker": "Home heating",
  "title": "With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years",
  "deck": "After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980.",
  "a": { "name": "Heat pump", "detail": "Air source, 7 kW" },
  "b": { "name": "Gas boiler", "detail": "Condensing combi, 30 kW" },
  "figures": [
    {
      "label": "Cost to buy and fit, after grant",
      "a": 3500,
      "b": 3000,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    },
    {
      "label": "Running cost per year",
      "a": 855,
      "b": 980,
      "format": "currency:GBP",
      "better": "lower"
    },
    {
      "label": "CO2 per year, tonnes",
      "a": 0.6,
      "b": 2.3,
      "format": "decimal:1",
      "better": "lower"
    },
    {
      "label": "Heat out per unit of energy in",
      "a": 3.2,
      "b": 0.9,
      "format": "decimal:1",
      "better": "higher"
    },
    { "label": "Expected life, years", "a": 20, "b": 15, "better": "higher" }
  ],
  "hero": {
    "type": "line-chart",
    "data": [
      { "year": "0", "saving": -500 },
      { "year": "1", "saving": -375 },
      { "year": "2", "saving": -250 },
      { "year": "3", "saving": -125 },
      { "year": "4", "saving": 0 },
      { "year": "5", "saving": 125 },
      { "year": "6", "saving": 250 },
      { "year": "7", "saving": 375 },
      { "year": "8", "saving": 500 },
      { "year": "9", "saving": 625 },
      { "year": "10", "saving": 750 },
      { "year": "11", "saving": 875 },
      { "year": "12", "saving": 1000 },
      { "year": "13", "saving": 1125 },
      { "year": "14", "saving": 1250 },
      { "year": "15", "saving": 1375 }
    ],
    "x": "year",
    "y": "saving",
    "format": {
      "style": "currency",
      "currency": "GBP",
      "maximumFractionDigits": 0,
      "signDisplay": "exceptZero"
    },
    "area": true,
    "title": "After 15 years the heat pump has cost £1,375 less than the boiler",
    "subtitle": "Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing",
    "annotations": [
      {
        "type": "line",
        "axis": "y",
        "value": 0,
        "label": "Same cost as the boiler",
        "dashed": false,
        "emphasis": true
      },
      { "type": "point", "x": "4", "y": 0, "label": "Break-even", "position": "top" }
    ]
  },
  "heroText": "Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it.",
  "pairs": [
    {
      "title": "The January energy bill is £120 for the heat pump and £139 for the boiler",
      "text": "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      "a": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 120 },
          { "month": "Feb", "cost": 108 },
          { "month": "Mar", "cost": 86 },
          { "month": "Apr", "cost": 57 },
          { "month": "May", "cost": 34 },
          { "month": "Jun", "cost": 24 },
          { "month": "Jul", "cost": 21 },
          { "month": "Aug", "cost": 22 },
          { "month": "Sep", "cost": 32 },
          { "month": "Oct", "cost": 56 },
          { "month": "Nov", "cost": 83 },
          { "month": "Dec", "cost": 112 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "option": { "yAxis": { "max": 140 } }
      },
      "b": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 139 },
          { "month": "Feb", "cost": 124 },
          { "month": "Mar", "cost": 101 },
          { "month": "Apr", "cost": 69 },
          { "month": "May", "cost": 43 },
          { "month": "Jun", "cost": 33 },
          { "month": "Jul", "cost": 30 },
          { "month": "Aug", "cost": 31 },
          { "month": "Sep", "cost": 41 },
          { "month": "Oct", "cost": 65 },
          { "month": "Nov", "cost": 94 },
          { "month": "Dec", "cost": 130 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "highlight": "none",
        "option": { "yAxis": { "max": 140 } }
      }
    },
    {
      "title": "Cost over 15 years by part",
      "text": "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
      "a": {
        "type": "segmented-bar",
        "data": [
          { "part": "Purchase and fitting", "gbp": 3500 },
          { "part": "Energy", "gbp": 11325 },
          { "part": "Servicing", "gbp": 1500 }
        ],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      },
      "b": {
        "type": "segmented-bar",
        "data": [
          { "part": "Purchase and fitting", "gbp": 3000 },
          { "part": "Energy", "gbp": 13500 },
          { "part": "Servicing", "gbp": 1200 }
        ],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      }
    }
  ],
  "verdict": {
    "lead": "Choose the heat pump if you get the grant and will stay at least 5 years",
    "body": "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels."
  },
  "sources": ["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"],
  "method": "A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms.",
  "note": "Illustrative data"
}
```

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `{ label, a, b, format?, better?: "higher" | "lower" }[]`: Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder. In the example: 5 items: an object with `label`, `a`, `b`, `format`, `better`; an object with `label`, `a`, `b`, `better`.
- `hero`, `Slot`: The exhibit that shows both sides at once. Default height 360px. In the example: a `line-chart` spec with 16 rows.
- `pairs`, `{ title, text?, a: Slot, b: Slot }[]`: Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both. In the example: 2 items: an object with `title`, `text`, `a`, `b`.
- `verdict`, `{ lead?, body?, label?, tone? }`: The closing recommendation, shown as a callout. In the example: an object with `lead`, `body`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The result of the comparison, as one plain sentence with the number in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `a` (required) | `string \| { name, detail? }` |  | Side A, shown on the left. |
| `b` (required) | `string \| { name, detail? }` |  | Side B, shown on the right. |
| `subject` | `"a" \| "b" \| "none"` | `"a"` | The side the piece is about. It takes the accent colour; the other stays grey. Match it with `highlight` in the charts. |
| `figures` | `{ label, a, b, format?, better?: "higher" \| "lower" }[]` |  | Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder. |
| `hero` | `Slot` |  | The exhibit that shows both sides at once. Default height 360px. |
| `heroText` | `string` |  | One or two sentences under the hero. |
| `pairs` | `{ title, text?, a: Slot, b: Slot }[]` |  | Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both. |
| `verdict` | `{ lead?, body?, label?, tone? }` |  | The closing recommendation, shown as a callout. |
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

- Built from: `headline` (atom), `prose` (atom), `callout` (atom), `source-note` (atom), `line-chart` (atom), `bar-chart` (atom), `segmented-bar` (atom), `waffle-chart` (atom)
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

- Component reference with every example: https://insightcharts.dev/llms/comparison-brief.md
- Registry item: https://insightcharts.dev/r/comparison-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/comparison-brief.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/comparison-brief
- These instructions as plain text: https://insightcharts.dev/agents/templates/comparison-brief.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
