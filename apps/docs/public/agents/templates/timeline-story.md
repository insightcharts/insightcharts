# Build a Timeline story with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Timeline story (`timeline-story`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

```tsx
import { BarChart, LineChart, StatTile, TimelineStory } from "insightcharts";

<TimelineStory
  theme="forest"
  kicker="Energy"
  title="Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024"
  deck="The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024."
  byline="By the data desk"
  date="2024-10-01"
  timeline={<LineChart
    data={[
      { year: "1990-01-01", share: 65, wind: 0 },
      { year: "1994-01-01", share: 50, wind: 0 },
      { year: "1998-01-01", share: 35, wind: 0.2 },
      { year: "2002-01-01", share: 32, wind: 0.4 },
      { year: "2006-01-01", share: 38, wind: 1 },
      { year: "2010-01-01", share: 28, wind: 3 },
      { year: "2012-01-01", share: 39, wind: 6 },
      { year: "2013-01-01", share: 36, wind: 8 },
      { year: "2014-01-01", share: 30, wind: 9 },
      { year: "2015-01-01", share: 22, wind: 12 },
      { year: "2016-01-01", share: 9, wind: 11 },
      { year: "2017-01-01", share: 7, wind: 15 },
      { year: "2018-01-01", share: 5, wind: 17 },
      { year: "2019-01-01", share: 2, wind: 20 },
      { year: "2020-01-01", share: 2, wind: 24 },
      { year: "2021-01-01", share: 2, wind: 21 },
      { year: "2022-01-01", share: 1.5, wind: 27 },
      { year: "2023-01-01", share: 1, wind: 29 },
      { year: "2024-01-01", share: 0.6, wind: 30 },
    ]}
    x="year"
    y={["share", "wind"]}
    names={{ share: "Coal", wind: "Wind" }}
    format="{value}%"
    zero
    title="Coal's share of generation fell from 65% in 1990 to 0.6% in 2024"
    subtitle="Share of Great Britain's electricity generated from coal and from wind, 1990 to 2024"
    annotations={[
      { type: "band", axis: "x", from: "1990-01-01", to: "1998-01-01", label: "Gas plants built" },
      { type: "line", axis: "x", value: "2013-01-01", label: "Carbon price floor" },
      { type: "point", x: "2012-01-01", y: 39, label: "39% in 2012", position: "top" },
    ]}
    source="Department for Energy Security and Net Zero and National Grid ESO (rounded)"
    note="Figures are approximate, for illustration"
  />}
  intro="Coal's share fell in two periods. It fell from 65% to 35% between 1990 and 1998, when generators built gas plants. It fell from 39% to 9% between 2012 and 2016, after the carbon price floor was introduced."
  chapters={[
    {
      date: "1882",
      title: "The first public coal power station opens in London",
      text: "Thomas Edison's company built the plant at Holborn Viaduct. It supplied street lamps and nearby buildings.",
    },
    {
      date: "1990s",
      title: "Coal's share falls from 65% to 35% between 1990 and 1998",
      text: "Privatised generators built gas plants, which were cheaper and quicker to build than coal plants. Coal's share was between 28% and 39% from 1998 to 2013.",
    },
    {
      date: "April 2013",
      title: "The carbon price floor takes effect",
      emphasis: true,
      text: "The floor set a minimum price on power-station emissions. The rate doubled in 2015. Coal's share fell from 22% in 2015 to 9% in 2016.",
      exhibit: <BarChart
        data={[
          { year: "2012", share: 39 },
          { year: "2013", share: 36 },
          { year: "2014", share: 30 },
          { year: "2015", share: 22 },
          { year: "2016", share: 9 },
        ]}
        x="year"
        y="share"
        orientation="vertical"
        sort="none"
        highlight="2016"
        format="{value}%"
        height={170}
        subtitle="Coal share of generation, 2012 to 2016"
      />,
    },
    {
      date: "21 April 2017",
      title: "The first full day without coal since 1882",
      text: "Britain had 1 coal-free day in 2017. It had 180 in 2020.",
      exhibit: <BarChart
        data={[
          { year: "2017", days: 1 },
          { year: "2018", days: 21 },
          { year: "2019", days: 83 },
          { year: "2020", days: 180 },
        ]}
        x="year"
        y="days"
        orientation="vertical"
        sort="none"
        highlight="2020"
        height={170}
        subtitle="Coal-free days per year"
      />,
    },
    {
      date: "30 September 2024",
      title: "Ratcliffe-on-Soar, the last coal plant, shuts down",
      emphasis: true,
      text: "The plant had run since 1968. In 2024 wind generated 30% of the country's electricity and gas generated 26%.",
      exhibit: <StatTile
        variant="comparison"
        surface="borderless"
        upIsGood={false}
        value={0.6}
        comparison={39}
        valueLabel="2024"
        comparisonLabel="2012"
        format="{value}%"
        label="Coal share of generation"
        context="Britain was the first G7 country to end coal power"
      />,
    },
  ]}
  closing="Coal generated 0.6% of Britain's electricity in 2024, all of it before 30 September. Gas generated 26%."
  sources={["Digest of UK Energy Statistics", "National Grid ESO"]}
  period="1990 to 2024"
  note="Annual shares are rounded. Intermediate years before 2012 are interpolated for the chart. Figures are approximate, for illustration."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "timeline-story",
  "theme": "forest",
  "kicker": "Energy",
  "title": "Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024",
  "deck": "The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024.",
  "byline": "By the data desk",
  "date": "2024-10-01",
  "timeline": {
    "type": "line-chart",
    "data": [
      { "year": "1990-01-01", "share": 65, "wind": 0 },
      { "year": "1994-01-01", "share": 50, "wind": 0 },
      { "year": "1998-01-01", "share": 35, "wind": 0.2 },
      { "year": "2002-01-01", "share": 32, "wind": 0.4 },
      { "year": "2006-01-01", "share": 38, "wind": 1 },
      { "year": "2010-01-01", "share": 28, "wind": 3 },
      { "year": "2012-01-01", "share": 39, "wind": 6 },
      { "year": "2013-01-01", "share": 36, "wind": 8 },
      { "year": "2014-01-01", "share": 30, "wind": 9 },
      { "year": "2015-01-01", "share": 22, "wind": 12 },
      { "year": "2016-01-01", "share": 9, "wind": 11 },
      { "year": "2017-01-01", "share": 7, "wind": 15 },
      { "year": "2018-01-01", "share": 5, "wind": 17 },
      { "year": "2019-01-01", "share": 2, "wind": 20 },
      { "year": "2020-01-01", "share": 2, "wind": 24 },
      { "year": "2021-01-01", "share": 2, "wind": 21 },
      { "year": "2022-01-01", "share": 1.5, "wind": 27 },
      { "year": "2023-01-01", "share": 1, "wind": 29 },
      { "year": "2024-01-01", "share": 0.6, "wind": 30 }
    ],
    "x": "year",
    "y": ["share", "wind"],
    "names": { "share": "Coal", "wind": "Wind" },
    "format": "{value}%",
    "zero": true,
    "title": "Coal's share of generation fell from 65% in 1990 to 0.6% in 2024",
    "subtitle": "Share of Great Britain's electricity generated from coal and from wind, 1990 to 2024",
    "annotations": [
      {
        "type": "band",
        "axis": "x",
        "from": "1990-01-01",
        "to": "1998-01-01",
        "label": "Gas plants built"
      },
      { "type": "line", "axis": "x", "value": "2013-01-01", "label": "Carbon price floor" },
      { "type": "point", "x": "2012-01-01", "y": 39, "label": "39% in 2012", "position": "top" }
    ],
    "source": "Department for Energy Security and Net Zero and National Grid ESO (rounded)",
    "note": "Figures are approximate, for illustration"
  },
  "intro": "Coal's share fell in two periods. It fell from 65% to 35% between 1990 and 1998, when generators built gas plants. It fell from 39% to 9% between 2012 and 2016, after the carbon price floor was introduced.",
  "chapters": [
    {
      "date": "1882",
      "title": "The first public coal power station opens in London",
      "text": "Thomas Edison's company built the plant at Holborn Viaduct. It supplied street lamps and nearby buildings."
    },
    {
      "date": "1990s",
      "title": "Coal's share falls from 65% to 35% between 1990 and 1998",
      "text": "Privatised generators built gas plants, which were cheaper and quicker to build than coal plants. Coal's share was between 28% and 39% from 1998 to 2013."
    },
    {
      "date": "April 2013",
      "title": "The carbon price floor takes effect",
      "emphasis": true,
      "text": "The floor set a minimum price on power-station emissions. The rate doubled in 2015. Coal's share fell from 22% in 2015 to 9% in 2016.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "year": "2012", "share": 39 },
          { "year": "2013", "share": 36 },
          { "year": "2014", "share": 30 },
          { "year": "2015", "share": 22 },
          { "year": "2016", "share": 9 }
        ],
        "x": "year",
        "y": "share",
        "orientation": "vertical",
        "sort": "none",
        "highlight": "2016",
        "format": "{value}%",
        "height": 170,
        "subtitle": "Coal share of generation, 2012 to 2016"
      }
    },
    {
      "date": "21 April 2017",
      "title": "The first full day without coal since 1882",
      "text": "Britain had 1 coal-free day in 2017. It had 180 in 2020.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "year": "2017", "days": 1 },
          { "year": "2018", "days": 21 },
          { "year": "2019", "days": 83 },
          { "year": "2020", "days": 180 }
        ],
        "x": "year",
        "y": "days",
        "orientation": "vertical",
        "sort": "none",
        "highlight": "2020",
        "height": 170,
        "subtitle": "Coal-free days per year"
      }
    },
    {
      "date": "30 September 2024",
      "title": "Ratcliffe-on-Soar, the last coal plant, shuts down",
      "emphasis": true,
      "text": "The plant had run since 1968. In 2024 wind generated 30% of the country's electricity and gas generated 26%.",
      "exhibit": {
        "type": "stat-tile",
        "variant": "comparison",
        "surface": "borderless",
        "upIsGood": false,
        "value": 0.6,
        "comparison": 39,
        "valueLabel": "2024",
        "comparisonLabel": "2012",
        "format": "{value}%",
        "label": "Coal share of generation",
        "context": "Britain was the first G7 country to end coal power"
      }
    }
  ],
  "closing": "Coal generated 0.6% of Britain's electricity in 2024, all of it before 30 September. Gas generated 26%.",
  "sources": ["Digest of UK Energy Statistics", "National Grid ESO"],
  "period": "1990 to 2024",
  "note": "Annual shares are rounded. Intermediate years before 2012 are interpolated for the chart. Figures are approximate, for illustration."
}
```

This example sets `theme="forest"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `timeline`, `Slot`: The overview exhibit: a `timeline-chart` spec, or a `line-chart` with the events as `annotations`. Default height 360px for line charts. In the example: a `line-chart` spec with 19 rows.
- `intro`, `string | string[]`: A paragraph between the overview and the chapters. In the example: text.
- `chapters` (required), `{ date, title, text?, exhibit?, emphasis? }[]`: The dated chapters, oldest first. `date` is shown as written; `exhibit` is a small chart or figure; `emphasis` fills the marker for a major event. In the example: 5 items: an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`, `exhibit`; an object with `date`, `title`, `text`, `exhibit`.
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

- Component reference with every example: https://insightcharts.dev/llms/timeline-story.md
- Registry item: https://insightcharts.dev/r/timeline-story.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-story.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/timeline-story
- These instructions as plain text: https://insightcharts.dev/agents/templates/timeline-story.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
