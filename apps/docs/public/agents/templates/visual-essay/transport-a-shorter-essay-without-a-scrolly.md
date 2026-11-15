# Reproduce the "Transport: a shorter essay without a scrolly" example of the InsightCharts Visual essay

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Transport: a shorter essay without a scrolly" example of `visual-essay` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A long article read by scrolling. It has a headline, then an ordered list of blocks in a reading column, then a source note. The blocks are prose, figures, charts with a callout, scrolly sequences, pull quotes, stat rows, small multiples and chapter breaks. Exhibits can be wider than the column.

Use it when: Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart.

Pick something else when: A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/visual-essay
```

The file lands at `components/insightcharts/templates/visual-essay.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { VisualEssay } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Transport: a shorter essay without a scrolly" example

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { LineChart, VisualEssay, WaffleChart } from "insightcharts";

<VisualEssay
  theme="earth"
  kicker="Cities"
  title="Cycling accounts for 11.2% of trips in Paris and cars for 4.3%"
  deck="Bicycle counts in 2024 were 3.2 times the 2015 level. The city made 50 km of temporary pandemic cycle lanes permanent."
  byline="By the transport desk"
  date="2025-04-02"
  textSize="md"
  blocks={[
    {
      kind: "prose",
      lead: true,
      text: "Permanent counters in Paris recorded 3.2 times as many bicycles in 2024 as in 2015. The count rose 47% between 2019 and 2020.",
    },
    {
      kind: "figure",
      chart: <LineChart
        data={[
          { year: "2015", index: 100 },
          { year: "2016", index: 104 },
          { year: "2017", index: 108 },
          { year: "2018", index: 118 },
          { year: "2019", index: 154 },
          { year: "2020", index: 226 },
          { year: "2021", index: 241 },
          { year: "2022", index: 262 },
          { year: "2023", index: 288 },
          { year: "2024", index: 317 },
        ]}
        x="year"
        y="index"
        zero
        title="Bicycle counts in Paris in 2024 were 3.2 times the 2015 level"
        subtitle="Bicycle counts at permanent counters, index (2015 = 100)"
        annotations={[
          { type: "line", axis: "x", value: "2020", label: "Temporary lanes open" },
          { type: "point", x: "2024", y: 317, label: "3.2 times\nthe 2015 level", position: "left" },
        ]}
        source="City of Paris counter data (rounded, illustrative)"
      />,
    },
    {
      kind: "prose",
      text: "The index rose from 154 in 2019 to 226 in 2020, when the city opened 50 km of temporary lanes. The city kept those lanes and built 130 km more. The index reached 317 in 2024.",
    },
    {
      kind: "quote",
      quote: "Counts went up on the streets where we built protected lanes. They stayed up after the lockdowns ended.",
      attribution: "A city transport planner",
    },
    {
      kind: "callout",
      chart: <WaffleChart
        data={[
          { mode: "Walking", share: 53.5 },
          { mode: "Public transport", share: 30 },
          { mode: "Cycling", share: 11.2 },
          { mode: "Car", share: 4.3 },
          { mode: "Other", share: 1 },
        ]}
        name="mode"
        value="share"
        total={100}
        format="{value}%"
        title="Cycling's share of trips within Paris is 2.6 times the car's"
        subtitle="Share of trips within Paris by main mode, 2023"
        source="Institut Paris Region mobility survey"
      />,
      lead: "Walking accounts for 53.5% of trips within Paris",
      body: "Public transport accounts for 30.0%. Cycling accounts for 11.2% and cars for 4.3%.",
      tone: "neutral",
    },
    {
      kind: "prose",
      text: "These shares are for trips within the city. In the suburbs the car accounts for one trip in three.",
    },
  ]}
  sources={["City of Paris open data", "Institut Paris Region"]}
  period="2015 to 2024"
  note="Counter index is illustrative. Mode shares are approximate, for illustration."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "earth",
  "kicker": "Cities",
  "title": "Cycling accounts for 11.2% of trips in Paris and cars for 4.3%",
  "deck": "Bicycle counts in 2024 were 3.2 times the 2015 level. The city made 50 km of temporary pandemic cycle lanes permanent.",
  "byline": "By the transport desk",
  "date": "2025-04-02",
  "textSize": "md",
  "blocks": [
    {
      "kind": "prose",
      "lead": true,
      "text": "Permanent counters in Paris recorded 3.2 times as many bicycles in 2024 as in 2015. The count rose 47% between 2019 and 2020."
    },
    {
      "kind": "figure",
      "chart": {
        "type": "line-chart",
        "data": [
          { "year": "2015", "index": 100 },
          { "year": "2016", "index": 104 },
          { "year": "2017", "index": 108 },
          { "year": "2018", "index": 118 },
          { "year": "2019", "index": 154 },
          { "year": "2020", "index": 226 },
          { "year": "2021", "index": 241 },
          { "year": "2022", "index": 262 },
          { "year": "2023", "index": 288 },
          { "year": "2024", "index": 317 }
        ],
        "x": "year",
        "y": "index",
        "zero": true,
        "title": "Bicycle counts in Paris in 2024 were 3.2 times the 2015 level",
        "subtitle": "Bicycle counts at permanent counters, index (2015 = 100)",
        "annotations": [
          { "type": "line", "axis": "x", "value": "2020", "label": "Temporary lanes open" },
          {
            "type": "point",
            "x": "2024",
            "y": 317,
            "label": "3.2 times\nthe 2015 level",
            "position": "left"
          }
        ],
        "source": "City of Paris counter data (rounded, illustrative)"
      }
    },
    {
      "kind": "prose",
      "text": "The index rose from 154 in 2019 to 226 in 2020, when the city opened 50 km of temporary lanes. The city kept those lanes and built 130 km more. The index reached 317 in 2024."
    },
    {
      "kind": "quote",
      "quote": "Counts went up on the streets where we built protected lanes. They stayed up after the lockdowns ended.",
      "attribution": "A city transport planner"
    },
    {
      "kind": "callout",
      "chart": {
        "type": "waffle-chart",
        "data": [
          { "mode": "Walking", "share": 53.5 },
          { "mode": "Public transport", "share": 30 },
          { "mode": "Cycling", "share": 11.2 },
          { "mode": "Car", "share": 4.3 },
          { "mode": "Other", "share": 1 }
        ],
        "name": "mode",
        "value": "share",
        "total": 100,
        "format": "{value}%",
        "title": "Cycling's share of trips within Paris is 2.6 times the car's",
        "subtitle": "Share of trips within Paris by main mode, 2023",
        "source": "Institut Paris Region mobility survey"
      },
      "lead": "Walking accounts for 53.5% of trips within Paris",
      "body": "Public transport accounts for 30.0%. Cycling accounts for 11.2% and cars for 4.3%.",
      "tone": "neutral"
    },
    {
      "kind": "prose",
      "text": "These shares are for trips within the city. In the suburbs the car accounts for one trip in three."
    }
  ],
  "sources": ["City of Paris open data", "Institut Paris Region"],
  "period": "2015 to 2024",
  "note": "Counter index is illustrative. Mode shares are approximate, for illustration.",
  "type": "visual-essay"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `blocks` (required), `(Block | Slot)[]`: The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, variant?, title? }` (the props of `stat-row`); `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" | "wide" | "full"` and an `id`. A bare chart spec is treated as a wide figure. In the example: 6 items: an object with `kind`, `lead`, `text`; an object with `kind`, `chart`; an object with `kind`, `text`; ....

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The essay's main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `blocks` (required) | `(Block \| Slot)[]` |  | The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, variant?, title? }` (the props of `stat-row`); `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" \| "wide" \| "full"` and an `id`. A bare chart spec is treated as a wide figure. |
| `measure` | `number` | `680` | Width of the reading column in px. |
| `textSize` | `"md" \| "lg"` |  | Body text size. Default 18px, 16px in narrow containers. |
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

- Built from: `headline` (atom), `prose` (atom), `pull-quote` (atom), `step-marker` (atom), `small-multiples` (atom), `chart-callout` (molecule), `scrolly-chart` (molecule), `small-multiple-grid` (molecule), `stat-row` (molecule), `source-note` (atom), `line-chart` (atom), `bar-chart` (atom), `waffle-chart` (atom), `dumbbell-chart` (atom), `heatmap` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/visual-essay.md
- Component reference with every example: https://insightcharts.dev/llms/visual-essay.md
- Registry item: https://insightcharts.dev/r/visual-essay.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/visual-essay.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/visual-essay#example-transport-a-shorter-essay-without-a-scrolly
- These instructions as plain text: https://insightcharts.dev/agents/templates/visual-essay/transport-a-shorter-essay-without-a-scrolly.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
