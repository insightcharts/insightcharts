# Reproduce the "Cities: a stacked overview and a waffle in a chapter" example of the InsightCharts Timeline story

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Cities: a stacked overview and a waffle in a chapter" example of `timeline-story` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A story told in date order. It has a headline, one overview exhibit of the whole period (a timeline chart or an annotated line), dated chapters along a rail, a closing paragraph and a source note. Each chapter has a short text and an optional small exhibit.

Use it when: Use it when the reader needs the events in date order to understand a change. State the change over the whole period in the headline, with the numbers and dates. Mark the main events on the overview exhibit as annotations. Give each chapter one event. Add a small figure to a chapter only when it has a number to show. Mark the two or three most important events with `emphasis`.

Pick something else when: Events with no measure that runs through the period (use a plain `annotated-timeline`). A comparison of two states with nothing in between (use `comparison-brief`). More than eight chapters. Merge minor events into the text of the chapter before or after.

Instructions for the alternatives: `annotated-timeline` https://insightcharts.dev/agents/molecules/annotated-timeline.md, `comparison-brief` https://insightcharts.dev/agents/templates/comparison-brief.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-story
```

The file lands at `components/insightcharts/templates/timeline-story.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { TimelineStory } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Cities: a stacked overview and a waffle in a chapter" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, StatTile, TimelineStory, WaffleChart } from "insightcharts";

<TimelineStory
  kicker="Transport"
  title="Riverton's bike-share scheme grew from 400 bikes in 2015 to 6,200 in 2024"
  deck="Riders made 9.4 million trips in 2024. E-bikes joined the fleet in 2021."
  date="2025-01-28"
  timeline={<BarChart
    data={[
      { year: "2015", classic: 0.3, ebike: 0 },
      { year: "2016", classic: 0.7, ebike: 0 },
      { year: "2017", classic: 1.2, ebike: 0 },
      { year: "2018", classic: 1.8, ebike: 0 },
      { year: "2019", classic: 2.4, ebike: 0 },
      { year: "2020", classic: 1.9, ebike: 0 },
      { year: "2021", classic: 2.6, ebike: 1.1 },
      { year: "2022", classic: 2.9, ebike: 2.7 },
      { year: "2023", classic: 3.1, ebike: 4.6 },
      { year: "2024", classic: 3.2, ebike: 6.2 },
    ]}
    x="year"
    y={["classic", "ebike"]}
    names={{ classic: "Classic bikes", ebike: "E-bikes" }}
    stack
    sort="none"
    orientation="vertical"
    format="{value}m"
    height={320}
    title="E-bikes carried 6.2 million of the 9.4 million trips in 2024"
    subtitle="Bike-share trips per year by type of bike, millions, 2015 to 2024"
    source="Riverton transport authority"
  />}
  intro="Trips rose every year except 2020. They rose from 1.9 million in 2020 to 9.4 million in 2024."
  chapters={[
    {
      date: "June 2015",
      title: "The scheme opens with 400 bikes at 40 docks",
      text: "All 40 docks were in the city centre. Riders made 0.3 million trips in the first year.",
    },
    {
      date: "2018",
      title: "The network reaches 150 docks",
      text: "The city added docks in 11 residential districts. Trips rose from 0.3 million in 2015 to 1.8 million in 2018.",
    },
    {
      date: "March 2020",
      title: "Trips fall 21% in the first pandemic year",
      text: "Riders made 1.9 million trips in 2020. They made 2.4 million in 2019.",
    },
    {
      date: "May 2021",
      title: "1,500 e-bikes join the fleet",
      emphasis: true,
      text: "E-bikes made 1.1 million trips in 2021. They made 6.2 million in 2024.",
      exhibit: <WaffleChart
        data={[{ kind: "E-bike trips", share: 66 }]}
        name="kind"
        value="share"
        total={100}
        rows={5}
        columns={20}
        restLabel="Classic bike trips"
        format="{value}%"
        subtitle="Share of trips by type of bike, 2024"
      />,
    },
    {
      date: "December 2024",
      title: "The fleet reaches 6,200 bikes",
      emphasis: true,
      text: "The scheme has 410 docks in 23 districts.",
      exhibit: <StatTile
        variant="breakdown"
        value={6200}
        format="integer"
        label="Bikes in the fleet, December 2024"
        parts={[{ label: "E-bikes", value: 3400 }, { label: "Classic bikes", value: 2800 }]}
      />,
    },
  ]}
  closing="Riders made 9.4 million trips in 2024. The scheme had 6,200 bikes at 410 docks."
  sources="Riverton transport authority annual reports"
  period="2015 to 2024"
  note="Illustrative data. The city is fictional."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Transport",
  "title": "Riverton's bike-share scheme grew from 400 bikes in 2015 to 6,200 in 2024",
  "deck": "Riders made 9.4 million trips in 2024. E-bikes joined the fleet in 2021.",
  "date": "2025-01-28",
  "timeline": {
    "type": "bar-chart",
    "data": [
      { "year": "2015", "classic": 0.3, "ebike": 0 },
      { "year": "2016", "classic": 0.7, "ebike": 0 },
      { "year": "2017", "classic": 1.2, "ebike": 0 },
      { "year": "2018", "classic": 1.8, "ebike": 0 },
      { "year": "2019", "classic": 2.4, "ebike": 0 },
      { "year": "2020", "classic": 1.9, "ebike": 0 },
      { "year": "2021", "classic": 2.6, "ebike": 1.1 },
      { "year": "2022", "classic": 2.9, "ebike": 2.7 },
      { "year": "2023", "classic": 3.1, "ebike": 4.6 },
      { "year": "2024", "classic": 3.2, "ebike": 6.2 }
    ],
    "x": "year",
    "y": ["classic", "ebike"],
    "names": { "classic": "Classic bikes", "ebike": "E-bikes" },
    "stack": true,
    "sort": "none",
    "orientation": "vertical",
    "format": "{value}m",
    "height": 320,
    "title": "E-bikes carried 6.2 million of the 9.4 million trips in 2024",
    "subtitle": "Bike-share trips per year by type of bike, millions, 2015 to 2024",
    "source": "Riverton transport authority"
  },
  "intro": "Trips rose every year except 2020. They rose from 1.9 million in 2020 to 9.4 million in 2024.",
  "chapters": [
    {
      "date": "June 2015",
      "title": "The scheme opens with 400 bikes at 40 docks",
      "text": "All 40 docks were in the city centre. Riders made 0.3 million trips in the first year."
    },
    {
      "date": "2018",
      "title": "The network reaches 150 docks",
      "text": "The city added docks in 11 residential districts. Trips rose from 0.3 million in 2015 to 1.8 million in 2018."
    },
    {
      "date": "March 2020",
      "title": "Trips fall 21% in the first pandemic year",
      "text": "Riders made 1.9 million trips in 2020. They made 2.4 million in 2019."
    },
    {
      "date": "May 2021",
      "title": "1,500 e-bikes join the fleet",
      "emphasis": true,
      "text": "E-bikes made 1.1 million trips in 2021. They made 6.2 million in 2024.",
      "exhibit": {
        "type": "waffle-chart",
        "data": [{ "kind": "E-bike trips", "share": 66 }],
        "name": "kind",
        "value": "share",
        "total": 100,
        "rows": 5,
        "columns": 20,
        "restLabel": "Classic bike trips",
        "format": "{value}%",
        "subtitle": "Share of trips by type of bike, 2024"
      }
    },
    {
      "date": "December 2024",
      "title": "The fleet reaches 6,200 bikes",
      "emphasis": true,
      "text": "The scheme has 410 docks in 23 districts.",
      "exhibit": {
        "type": "stat-tile",
        "variant": "breakdown",
        "value": 6200,
        "format": "integer",
        "label": "Bikes in the fleet, December 2024",
        "parts": [{ "label": "E-bikes", "value": 3400 }, { "label": "Classic bikes", "value": 2800 }]
      }
    }
  ],
  "closing": "Riders made 9.4 million trips in 2024. The scheme had 6,200 bikes at 410 docks.",
  "sources": "Riverton transport authority annual reports",
  "period": "2015 to 2024",
  "note": "Illustrative data. The city is fictional.",
  "type": "timeline-story"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `timeline`, `Slot`: The overview exhibit: a `timeline-chart` spec, or a `line-chart` with the events as `annotations`. Default height 360px for line charts. In the example: a `bar-chart` spec with 10 rows.
- `intro`, `string | string[]`: A paragraph between the overview and the chapters. In the example: text.
- `chapters` (required), `{ date, title, text?, exhibit?, emphasis? }[]`: The dated chapters, oldest first. `date` is shown as written; `exhibit` is a small chart or figure; `emphasis` fills the marker for a major event. In the example: 5 items: an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`, `exhibit`.
- `closing`, `string | string[]`: A closing paragraph that states the latest figures. In the example: text.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The change over the whole period, as one plain sentence with the numbers and dates in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `timeline` | `Slot` |  | The overview exhibit: a `timeline-chart` spec, or a `line-chart` with the events as `annotations`. Default height 360px for line charts. |
| `intro` | `string \| string[]` |  | A paragraph between the overview and the chapters. |
| `chaptersTitle` | `string` |  | Heading over the chapters. |
| `chapters` (required) | `{ date, title, text?, exhibit?, emphasis? }[]` |  | The dated chapters, oldest first. `date` is shown as written; `exhibit` is a small chart or figure; `emphasis` fills the marker for a major event. |
| `exhibitPosition` | `"below" \| "side"` | `"side"` | Where a chapter's exhibit sits; `side` falls back to `below` under 640px. |
| `closing` | `string \| string[]` |  | A closing paragraph that states the latest figures. |
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

- Built from: `headline` (atom), `prose` (atom), `annotated-timeline` (molecule), `source-note` (atom), `line-chart` (atom), `timeline-chart` (atom), `bar-chart` (atom), `big-number` (atom), `stat-tile` (atom), `waffle-chart` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/timeline-story.md
- Component reference with every example: https://insightcharts.dev/llms/timeline-story.md
- Registry item: https://insightcharts.dev/r/timeline-story.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-story.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/timeline-story#example-cities-a-stacked-overview-and-a-waffle-in-a-chapter
- These instructions as plain text: https://insightcharts.dev/agents/templates/timeline-story/cities-a-stacked-overview-and-a-waffle-in-a-chapter.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
