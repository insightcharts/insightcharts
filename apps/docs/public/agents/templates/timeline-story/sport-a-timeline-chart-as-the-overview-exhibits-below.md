# Reproduce the "Sport: a timeline chart as the overview, exhibits below" example of the InsightCharts Timeline story

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Sport: a timeline chart as the overview, exhibits below" example of `timeline-story` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Sport: a timeline chart as the overview, exhibits below" example

This example sets `theme="ocean"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BigNumber, TimelineChart, TimelineStory } from "insightcharts";

<TimelineStory
  theme="ocean"
  kicker="Athletics"
  title="The men's marathon record fell from 2:04:55 to 2:00:35 between 2003 and 2023"
  deck="Seven men held the record in that time. Carbon-plated shoes went on sale in 2017. The last two record-holders ran in them."
  exhibitPosition="below"
  timeline={<TimelineChart
    data={[
      { holder: "Paul Tergat, 2:04:55", from: "2003-09", to: "2007-09", lane: "Record" },
      { holder: "Haile Gebrselassie, 2:03:59", from: "2007-09", to: "2011-09", lane: "Record" },
      { holder: "Makau, Kipsang", from: "2011-09", to: "2014-09", lane: "Record" },
      { holder: "Dennis Kimetto, 2:02:57", from: "2014-09", to: "2018-09", lane: "Record" },
      { holder: "Eliud Kipchoge, 2:01:09", from: "2018-09", to: "2023-10", lane: "Record" },
      { holder: "Kelvin Kiptum, 2:00:35", from: "2023-10", to: "2025-06", lane: "Record" },
      { holder: "Carbon-plated shoes", from: "2017-05", to: "2025-06", lane: "Technology" },
      { holder: "Breaking2", from: "2017-05", lane: "Exhibition" },
      { holder: "1:59:40 in Vienna", from: "2019-10", lane: "Exhibition" },
    ]}
    name="holder"
    start="from"
    end="to"
    lane="lane"
    highlight={["Carbon-plated shoes", "Eliud Kipchoge, 2:01:09", "Kelvin Kiptum, 2:00:35"]}
    precision="month"
    title="The record fell by 142 seconds between 2014 and 2023"
    subtitle="Men's marathon world record holders and related events, 2003 to 2025"
    source="World Athletics"
  />}
  chapters={[
    {
      date: "September 2003",
      title: "Paul Tergat runs 2:04:55 in Berlin",
      text: "He was the first man to run a marathon in under 2:05.",
    },
    {
      date: "September 2008",
      title: "Haile Gebrselassie runs 2:03:59 in Berlin",
      text: "It was his second record in 12 months. He was 35.",
    },
    {
      date: "September 2014",
      title: "Dennis Kimetto runs 2:02:57 in Berlin",
      text: "The record stood for four years.",
    },
    {
      date: "May 2017",
      title: "Eliud Kipchoge runs 2:00:25 at the Breaking2 exhibition",
      emphasis: true,
      text: "The run used rotating pacemakers on a racing circuit, so it did not count as a record. Kipchoge wore prototype carbon-plated shoes. The shoes went on sale that summer.",
    },
    {
      date: "September 2018",
      title: "Eliud Kipchoge lowers the record by 78 seconds to 2:01:39",
      emphasis: true,
      text: "It was the largest single improvement since 1967. He ran 2:01:09 in 2022.",
      exhibit: <BigNumber
        value="−78 s"
        label="Improvement on Kimetto's record"
        context="The previous four records improved by 29 seconds on average"
      />,
    },
    {
      date: "October 2023",
      title: "Kelvin Kiptum runs 2:00:35 in Chicago",
      text: "It was his third marathon. He was 23. He died in a road accident four months later.",
    },
  ]}
  closing="No one has run under two hours in a record-eligible race. Kiptum's 2:00:35 is 35 seconds slower than two hours."
  sources="World Athletics record progression"
  note="Figures are approximate, for illustration"
  period="2003 to 2025"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ocean",
  "kicker": "Athletics",
  "title": "The men's marathon record fell from 2:04:55 to 2:00:35 between 2003 and 2023",
  "deck": "Seven men held the record in that time. Carbon-plated shoes went on sale in 2017. The last two record-holders ran in them.",
  "exhibitPosition": "below",
  "timeline": {
    "type": "timeline-chart",
    "data": [
      { "holder": "Paul Tergat, 2:04:55", "from": "2003-09", "to": "2007-09", "lane": "Record" },
      {
        "holder": "Haile Gebrselassie, 2:03:59",
        "from": "2007-09",
        "to": "2011-09",
        "lane": "Record"
      },
      { "holder": "Makau, Kipsang", "from": "2011-09", "to": "2014-09", "lane": "Record" },
      { "holder": "Dennis Kimetto, 2:02:57", "from": "2014-09", "to": "2018-09", "lane": "Record" },
      { "holder": "Eliud Kipchoge, 2:01:09", "from": "2018-09", "to": "2023-10", "lane": "Record" },
      { "holder": "Kelvin Kiptum, 2:00:35", "from": "2023-10", "to": "2025-06", "lane": "Record" },
      { "holder": "Carbon-plated shoes", "from": "2017-05", "to": "2025-06", "lane": "Technology" },
      { "holder": "Breaking2", "from": "2017-05", "lane": "Exhibition" },
      { "holder": "1:59:40 in Vienna", "from": "2019-10", "lane": "Exhibition" }
    ],
    "name": "holder",
    "start": "from",
    "end": "to",
    "lane": "lane",
    "highlight": ["Carbon-plated shoes", "Eliud Kipchoge, 2:01:09", "Kelvin Kiptum, 2:00:35"],
    "precision": "month",
    "title": "The record fell by 142 seconds between 2014 and 2023",
    "subtitle": "Men's marathon world record holders and related events, 2003 to 2025",
    "source": "World Athletics"
  },
  "chapters": [
    {
      "date": "September 2003",
      "title": "Paul Tergat runs 2:04:55 in Berlin",
      "text": "He was the first man to run a marathon in under 2:05."
    },
    {
      "date": "September 2008",
      "title": "Haile Gebrselassie runs 2:03:59 in Berlin",
      "text": "It was his second record in 12 months. He was 35."
    },
    {
      "date": "September 2014",
      "title": "Dennis Kimetto runs 2:02:57 in Berlin",
      "text": "The record stood for four years."
    },
    {
      "date": "May 2017",
      "title": "Eliud Kipchoge runs 2:00:25 at the Breaking2 exhibition",
      "emphasis": true,
      "text": "The run used rotating pacemakers on a racing circuit, so it did not count as a record. Kipchoge wore prototype carbon-plated shoes. The shoes went on sale that summer."
    },
    {
      "date": "September 2018",
      "title": "Eliud Kipchoge lowers the record by 78 seconds to 2:01:39",
      "emphasis": true,
      "text": "It was the largest single improvement since 1967. He ran 2:01:09 in 2022.",
      "exhibit": {
        "type": "big-number",
        "value": "−78 s",
        "label": "Improvement on Kimetto's record",
        "context": "The previous four records improved by 29 seconds on average"
      }
    },
    {
      "date": "October 2023",
      "title": "Kelvin Kiptum runs 2:00:35 in Chicago",
      "text": "It was his third marathon. He was 23. He died in a road accident four months later."
    }
  ],
  "closing": "No one has run under two hours in a record-eligible race. Kiptum's 2:00:35 is 35 seconds slower than two hours.",
  "sources": "World Athletics record progression",
  "note": "Figures are approximate, for illustration",
  "period": "2003 to 2025",
  "type": "timeline-story"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `timeline`, `Slot`: The overview exhibit: a `timeline-chart` spec, or a `line-chart` with the events as `annotations`. Default height 360px for line charts. In the example: a `timeline-chart` spec with 9 rows.
- `intro`, `string | string[]`: A paragraph between the overview and the chapters. Not used in the example.
- `chapters` (required), `{ date, title, text?, exhibit?, emphasis? }[]`: The dated chapters, oldest first. `date` is shown as written; `exhibit` is a small chart or figure; `emphasis` fills the marker for a major event. In the example: 6 items: an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`; an object with `date`, `title`, `emphasis`, `text`, `exhibit`.
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
- This page: https://insightcharts.dev/templates/timeline-story#example-sport-a-timeline-chart-as-the-overview-exhibits-below
- These instructions as plain text: https://insightcharts.dev/agents/templates/timeline-story/sport-a-timeline-chart-as-the-overview-exhibits-below.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
