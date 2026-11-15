# Reproduce the "Housing: buying against renting, two pairs" example of the InsightCharts Comparison brief

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Housing: buying against renting, two pairs" example of `comparison-brief` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Housing: buying against renting, two pairs" example

This example sets `theme="ledger"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, ComparisonBrief, LineChart, SegmentedBar } from "insightcharts";

<ComparisonBrief
  theme="ledger"
  kicker="Housing costs"
  title="Buying a £300,000 flat costs £56,100 less than renting it over 10 years"
  deck="The buyer pays out £218,000 and gains £107,300 in wealth. The renter pays out £185,700 and gains £18,900."
  a={{ name: "Buying", detail: "£30,000 deposit, 4% mortgage" }}
  b={{ name: "Renting", detail: "£1,350 a month, rising 2.5% a year" }}
  figures={[
    {
      label: "Net cost over 10 years",
      a: 110700,
      b: 166800,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Paid out over 10 years",
      a: 218000,
      b: 185700,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Wealth gained over 10 years",
      a: 107300,
      b: 18900,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "higher",
    },
    {
      label: "Monthly outgoing in year 1",
      a: 1725,
      b: 1385,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Cash needed at the start",
      a: 41000,
      b: 1950,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
  ]}
  hero={<LineChart
    data={[
      { year: "0", Buying: 0, Renting: 0 },
      { year: "1", Buying: 20970, Renting: 16680 },
      { year: "2", Buying: 30940, Renting: 33360 },
      { year: "3", Buying: 40910, Renting: 50040 },
      { year: "4", Buying: 50880, Renting: 66720 },
      { year: "5", Buying: 60850, Renting: 83400 },
      { year: "6", Buying: 70820, Renting: 100080 },
      { year: "7", Buying: 80790, Renting: 116760 },
      { year: "8", Buying: 90760, Renting: 133440 },
      { year: "9", Buying: 100730, Renting: 150120 },
      { year: "10", Buying: 110700, Renting: 166800 },
    ]}
    x="year"
    y={["Buying", "Renting"]}
    highlight="Buying"
    contextLabels
    zero
    format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
    title="Buying has a lower net cost than renting from year 2"
    subtitle="Cumulative net cost in pounds by years since moving in. Net cost is payments minus wealth gained"
  />}
  heroText="The buyer pays £11,000 in tax and fees in year 1. After 2 years buying has a net cost of £30,940 and renting £33,360."
  pairs={[
    {
      title: "Mortgage interest is £93,700 of the buyer's £218,000",
      text: "Payments over 10 years by part. Rent is £181,500 of the renter's £185,700.",
      a: <SegmentedBar
        data={[
          { part: "Mortgage interest", gbp: 93700 },
          { part: "Capital repaid", gbp: 77300 },
          { part: "Upkeep and insurance", gbp: 36000 },
          { part: "Tax and fees", gbp: 11000 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
      b: <SegmentedBar
        data={[{ part: "Rent", gbp: 181500 }, { part: "Fees and insurance", gbp: 4200 }]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
    },
    {
      title: "The buyer gains £107,300 in wealth and the renter £18,900",
      text: "Wealth gained over 10 years by source. Both charts use the same scale.",
      a: <BarChart
        data={[{ part: "Capital repaid", gbp: 77300 }, { part: "Rise in the flat's price", gbp: 30000 }]}
        x="part"
        y="gbp"
        sort="none"
        orientation="horizontal"
        format="currency:GBP"
        option={{ xAxis: { max: 90000 } }}
      />,
      b: <BarChart
        data={[{ part: "Growth on the invested deposit", gbp: 18900 }]}
        x="part"
        y="gbp"
        sort="none"
        orientation="horizontal"
        format="currency:GBP"
        highlight="none"
        option={{ xAxis: { max: 90000 } }}
      />,
    },
  ]}
  verdict={{
    lead: "Buy if you will stay 2 years or more",
    body: "The figures assume a 4% mortgage rate, a flat price that rises 1% a year and a 5% annual return on the renter's invested deposit.",
    tone: "positive",
  }}
  sources={["Lender mortgage calculator", "Letting agent listings collected by the author"]}
  method="A £270,000 repayment mortgage over 25 years at 4%. The renter invests the £30,000 deposit. Net cost is payments minus capital repaid and growth."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ledger",
  "kicker": "Housing costs",
  "title": "Buying a £300,000 flat costs £56,100 less than renting it over 10 years",
  "deck": "The buyer pays out £218,000 and gains £107,300 in wealth. The renter pays out £185,700 and gains £18,900.",
  "a": { "name": "Buying", "detail": "£30,000 deposit, 4% mortgage" },
  "b": { "name": "Renting", "detail": "£1,350 a month, rising 2.5% a year" },
  "figures": [
    {
      "label": "Net cost over 10 years",
      "a": 110700,
      "b": 166800,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    },
    {
      "label": "Paid out over 10 years",
      "a": 218000,
      "b": 185700,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    },
    {
      "label": "Wealth gained over 10 years",
      "a": 107300,
      "b": 18900,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "higher"
    },
    {
      "label": "Monthly outgoing in year 1",
      "a": 1725,
      "b": 1385,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    },
    {
      "label": "Cash needed at the start",
      "a": 41000,
      "b": 1950,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    }
  ],
  "hero": {
    "type": "line-chart",
    "data": [
      { "year": "0", "Buying": 0, "Renting": 0 },
      { "year": "1", "Buying": 20970, "Renting": 16680 },
      { "year": "2", "Buying": 30940, "Renting": 33360 },
      { "year": "3", "Buying": 40910, "Renting": 50040 },
      { "year": "4", "Buying": 50880, "Renting": 66720 },
      { "year": "5", "Buying": 60850, "Renting": 83400 },
      { "year": "6", "Buying": 70820, "Renting": 100080 },
      { "year": "7", "Buying": 80790, "Renting": 116760 },
      { "year": "8", "Buying": 90760, "Renting": 133440 },
      { "year": "9", "Buying": 100730, "Renting": 150120 },
      { "year": "10", "Buying": 110700, "Renting": 166800 }
    ],
    "x": "year",
    "y": ["Buying", "Renting"],
    "highlight": "Buying",
    "contextLabels": true,
    "zero": true,
    "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
    "title": "Buying has a lower net cost than renting from year 2",
    "subtitle": "Cumulative net cost in pounds by years since moving in. Net cost is payments minus wealth gained"
  },
  "heroText": "The buyer pays £11,000 in tax and fees in year 1. After 2 years buying has a net cost of £30,940 and renting £33,360.",
  "pairs": [
    {
      "title": "Mortgage interest is £93,700 of the buyer's £218,000",
      "text": "Payments over 10 years by part. Rent is £181,500 of the renter's £185,700.",
      "a": {
        "type": "segmented-bar",
        "data": [
          { "part": "Mortgage interest", "gbp": 93700 },
          { "part": "Capital repaid", "gbp": 77300 },
          { "part": "Upkeep and insurance", "gbp": 36000 },
          { "part": "Tax and fees", "gbp": 11000 }
        ],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      },
      "b": {
        "type": "segmented-bar",
        "data": [{ "part": "Rent", "gbp": 181500 }, { "part": "Fees and insurance", "gbp": 4200 }],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      }
    },
    {
      "title": "The buyer gains £107,300 in wealth and the renter £18,900",
      "text": "Wealth gained over 10 years by source. Both charts use the same scale.",
      "a": {
        "type": "bar-chart",
        "data": [
          { "part": "Capital repaid", "gbp": 77300 },
          { "part": "Rise in the flat's price", "gbp": 30000 }
        ],
        "x": "part",
        "y": "gbp",
        "sort": "none",
        "orientation": "horizontal",
        "format": "currency:GBP",
        "option": { "xAxis": { "max": 90000 } }
      },
      "b": {
        "type": "bar-chart",
        "data": [{ "part": "Growth on the invested deposit", "gbp": 18900 }],
        "x": "part",
        "y": "gbp",
        "sort": "none",
        "orientation": "horizontal",
        "format": "currency:GBP",
        "highlight": "none",
        "option": { "xAxis": { "max": 90000 } }
      }
    }
  ],
  "verdict": {
    "lead": "Buy if you will stay 2 years or more",
    "body": "The figures assume a 4% mortgage rate, a flat price that rises 1% a year and a 5% annual return on the renter's invested deposit.",
    "tone": "positive"
  },
  "sources": ["Lender mortgage calculator", "Letting agent listings collected by the author"],
  "method": "A £270,000 repayment mortgage over 25 years at 4%. The renter invests the £30,000 deposit. Net cost is payments minus capital repaid and growth.",
  "note": "Illustrative data",
  "type": "comparison-brief"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `{ label, a, b, format?, better?: "higher" | "lower" }[]`: Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder. In the example: 5 items: an object with `label`, `a`, `b`, `format`, `better`.
- `hero`, `Slot`: The exhibit that shows both sides at once. Default height 360px. In the example: a `line-chart` spec with 11 rows.
- `pairs`, `{ title, text?, a: Slot, b: Slot }[]`: Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both. In the example: 2 items: an object with `title`, `text`, `a`, `b`.
- `verdict`, `{ lead?, body?, label?, tone? }`: The closing recommendation, shown as a callout. In the example: an object with `lead`, `body`, `tone`.

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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/comparison-brief.md
- Component reference with every example: https://insightcharts.dev/llms/comparison-brief.md
- Registry item: https://insightcharts.dev/r/comparison-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/comparison-brief.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/comparison-brief#example-housing-buying-against-renting-two-pairs
- These instructions as plain text: https://insightcharts.dev/agents/templates/comparison-brief/housing-buying-against-renting-two-pairs.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
