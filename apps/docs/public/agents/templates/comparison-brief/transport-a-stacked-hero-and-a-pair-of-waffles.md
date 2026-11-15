# Reproduce the "Transport: a stacked hero and a pair of waffles" example of the InsightCharts Comparison brief

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Transport: a stacked hero and a pair of waffles" example of `comparison-brief` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Transport: a stacked hero and a pair of waffles" example

This example sets `theme="poster"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, ComparisonBrief, WaffleChart } from "insightcharts";

<ComparisonBrief
  theme="poster"
  kicker="London to Edinburgh"
  title="Flying from London to Edinburgh is 35 minutes faster than the train, door to door"
  deck="The plane takes 275 minutes and the train 310. The flight itself lasts 80 minutes. The plane emits 140 kg of CO2 per passenger. The train emits 13 kg."
  a="Train"
  b="Plane"
  figures={[
    { label: "Door to door, minutes", a: 310, b: 275, better: "lower" },
    { label: "CO2 per passenger, kg", a: 13, b: 140, better: "lower" },
    {
      label: "Typical fare booked two weeks ahead",
      a: 78,
      b: 92,
      format: "currency:GBP",
      better: "lower",
    },
    { label: "Minutes you can spend working", a: 240, b: 50, better: "higher" },
  ]}
  hero={<BarChart
    data={[
      {
        mode: "Train",
        "Getting there": 25,
        "Waiting and boarding": 15,
        "In transit": 260,
        Onward: 10,
      },
      {
        mode: "Plane",
        "Getting there": 55,
        "Waiting and boarding": 95,
        "In transit": 80,
        Onward: 45,
      },
    ]}
    x="mode"
    y={["Getting there", "Waiting and boarding", "In transit", "Onward"]}
    stack
    orientation="horizontal"
    sort="none"
    format="{value} min"
    title="80 of the plane's 275 minutes are spent in the air"
    subtitle="Minutes per stage, city centre to city centre"
    source="Timetables and airport guidance, weekday morning departures"
  />}
  pairs={[
    {
      title: "240 of the train's 310 minutes can be spent working",
      text: "On the plane it is 50 of 275 minutes. Each square is 1% of the journey.",
      a: <WaffleChart
        data={[{ part: "Working time", minutes: 240 }]}
        name="part"
        value="minutes"
        total={310}
        restLabel="Other time"
        format="{value} min"
        aspect={1.6}
      />,
      b: <WaffleChart
        data={[{ part: "Working time", minutes: 50 }]}
        name="part"
        value="minutes"
        total={275}
        restLabel="Other time"
        format="{value} min"
        aspect={1.6}
        highlight="none"
      />,
    },
  ]}
  verdict={{
    lead: "Take the train unless you need the 35 minutes",
    body: "The train fare is £78 and the plane fare is £92. The train gives 240 minutes of working time. The plane gives 50.",
    tone: "positive",
  }}
  sources={["Operator timetables", "Government greenhouse gas conversion factors"]}
  note="Illustrative fares and times"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "poster",
  "kicker": "London to Edinburgh",
  "title": "Flying from London to Edinburgh is 35 minutes faster than the train, door to door",
  "deck": "The plane takes 275 minutes and the train 310. The flight itself lasts 80 minutes. The plane emits 140 kg of CO2 per passenger. The train emits 13 kg.",
  "a": "Train",
  "b": "Plane",
  "figures": [
    { "label": "Door to door, minutes", "a": 310, "b": 275, "better": "lower" },
    { "label": "CO2 per passenger, kg", "a": 13, "b": 140, "better": "lower" },
    {
      "label": "Typical fare booked two weeks ahead",
      "a": 78,
      "b": 92,
      "format": "currency:GBP",
      "better": "lower"
    },
    { "label": "Minutes you can spend working", "a": 240, "b": 50, "better": "higher" }
  ],
  "hero": {
    "type": "bar-chart",
    "data": [
      {
        "mode": "Train",
        "Getting there": 25,
        "Waiting and boarding": 15,
        "In transit": 260,
        "Onward": 10
      },
      {
        "mode": "Plane",
        "Getting there": 55,
        "Waiting and boarding": 95,
        "In transit": 80,
        "Onward": 45
      }
    ],
    "x": "mode",
    "y": ["Getting there", "Waiting and boarding", "In transit", "Onward"],
    "stack": true,
    "orientation": "horizontal",
    "sort": "none",
    "format": "{value} min",
    "title": "80 of the plane's 275 minutes are spent in the air",
    "subtitle": "Minutes per stage, city centre to city centre",
    "source": "Timetables and airport guidance, weekday morning departures"
  },
  "pairs": [
    {
      "title": "240 of the train's 310 minutes can be spent working",
      "text": "On the plane it is 50 of 275 minutes. Each square is 1% of the journey.",
      "a": {
        "type": "waffle-chart",
        "data": [{ "part": "Working time", "minutes": 240 }],
        "name": "part",
        "value": "minutes",
        "total": 310,
        "restLabel": "Other time",
        "format": "{value} min",
        "aspect": 1.6
      },
      "b": {
        "type": "waffle-chart",
        "data": [{ "part": "Working time", "minutes": 50 }],
        "name": "part",
        "value": "minutes",
        "total": 275,
        "restLabel": "Other time",
        "format": "{value} min",
        "aspect": 1.6,
        "highlight": "none"
      }
    }
  ],
  "verdict": {
    "lead": "Take the train unless you need the 35 minutes",
    "body": "The train fare is £78 and the plane fare is £92. The train gives 240 minutes of working time. The plane gives 50.",
    "tone": "positive"
  },
  "sources": ["Operator timetables", "Government greenhouse gas conversion factors"],
  "note": "Illustrative fares and times",
  "type": "comparison-brief"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `{ label, a, b, format?, better?: "higher" | "lower" }[]`: Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder. In the example: 4 items: an object with `label`, `a`, `b`, `better`; an object with `label`, `a`, `b`, `format`, `better`.
- `hero`, `Slot`: The exhibit that shows both sides at once. Default height 360px. In the example: a `bar-chart` spec with 2 rows.
- `pairs`, `{ title, text?, a: Slot, b: Slot }[]`: Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both. In the example: 1 item: an object with `title`, `text`, `a`, `b`.
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
- This page: https://insightcharts.dev/templates/comparison-brief#example-transport-a-stacked-hero-and-a-pair-of-waffles
- These instructions as plain text: https://insightcharts.dev/agents/templates/comparison-brief/transport-a-stacked-hero-and-a-pair-of-waffles.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
