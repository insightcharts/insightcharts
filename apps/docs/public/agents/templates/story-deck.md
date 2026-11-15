# Build a Story deck with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Story deck (`story-deck`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A sequence of full-frame cards (title, stat, chart, quote, closing) that the reader swipes or steps through. Each card states one fact. It has an optional fixed aspect ratio, a keyboard-accessible pager and a stacked layout for print.

Use it when: Use it for a short sequence read on a phone, such as a “year in review”. Each card should be readable in a couple of seconds. State the main fact with its number on the title card. Put one fact on each later card, as a number or as one chart with one highlighted mark under a headline that states the fact. Use five to ten cards. End with a closing card and the sources. Charts in cards should have few data points and direct labels, with no legend.

Pick something else when: Findings that need two exhibits in view at once (use `executive-brief`). A single shareable image (use `social-card`). Dense charts or long paragraphs, because a card has little room. One chart that changes step by step (use `scrolly-chart` in `steps` mode).

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `scrolly-chart` https://insightcharts.dev/agents/molecules/scrolly-chart.md, `social-card` https://insightcharts.dev/agents/templates/social-card.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/story-deck
```

The file lands at `components/insightcharts/templates/story-deck.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { StoryDeck } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { BarChart, LineChart, RadialBarChart, StoryDeck, WaffleChart } from "insightcharts";

<StoryDeck
  theme="dusk"
  aspect="4:5"
  cards={[
    {
      kind: "title",
      tone: "inverse",
      kicker: "Your 2024 on the road",
      title: "You ran 1,842 km in 2024",
      deck: "That was 23% more than in 2023. You ran 187 times.",
      byline: "Riverside Runners · member report",
    },
    {
      kind: "stat",
      kicker: "Distance",
      variant: "with-trend",
      series: [1120, 1310, 1498, 1842],
      value: 1842,
      format: "integer",
      label: "Kilometres run in 2024",
      delta: 0.23,
      deltaLabel: "vs 2023",
      context: "You ran 1,120 km in 2021 and 1,498 km in 2023.",
    },
    {
      kind: "chart",
      kicker: "Weeks",
      title: "You ran in 46 of the year's 52 weeks",
      chart: <WaffleChart
        data={[{ weeks: "Weeks with a run", n: 46 }]}
        name="weeks"
        value="n"
        total={52}
        rows={4}
        columns={13}
        restLabel="Weeks without a run"
        format="integer"
        aspect={2.6}
      />,
      text: "Each square is one week. Four of the six weeks without a run were in July.",
    },
    {
      kind: "chart",
      kicker: "Month by month",
      title: "October was your highest month at 224 km",
      chart: <BarChart
        data={[
          { month: "Jan", km: 96 },
          { month: "Feb", km: 104 },
          { month: "Mar", km: 131 },
          { month: "Apr", km: 148 },
          { month: "May", km: 162 },
          { month: "Jun", km: 171 },
          { month: "Jul", km: 120 },
          { month: "Aug", km: 158 },
          { month: "Sep", km: 196 },
          { month: "Oct", km: 224 },
          { month: "Nov", km: 181 },
          { month: "Dec", km: 151 },
        ]}
        x="month"
        y="km"
        orientation="vertical"
        sort="none"
        highlight="Oct"
        labels={false}
        format="{value} km"
        height={240}
      />,
      text: "You ran 120 km in July while you were injured. You ran 158 km in August.",
    },
    {
      kind: "chart",
      kicker: "Pace",
      title: "Your easy pace fell from 5.52 to 5.04 minutes per kilometre",
      chart: <LineChart
        data={[
          { month: "Jan", pace: 5.52 },
          { month: "Feb", pace: 5.47 },
          { month: "Mar", pace: 5.41 },
          { month: "Apr", pace: 5.36 },
          { month: "May", pace: 5.33 },
          { month: "Jun", pace: 5.28 },
          { month: "Jul", pace: 5.31 },
          { month: "Aug", pace: 5.24 },
          { month: "Sep", pace: 5.16 },
          { month: "Oct", pace: 5.09 },
          { month: "Nov", pace: 5.07 },
          { month: "Dec", pace: 5.04 },
        ]}
        x="month"
        y="pace"
        format="{value} min/km"
        height={240}
      />,
      text: "A lower number is a faster pace. Your pace in August was 5.24.",
    },
    {
      kind: "chart",
      kicker: "Habits",
      tone: "accent",
      title: "41 of your 187 runs started between 6am and 7am",
      chart: <RadialBarChart
        data={[
          { hour: "00", runs: 0 },
          { hour: "01", runs: 0 },
          { hour: "02", runs: 0 },
          { hour: "03", runs: 0 },
          { hour: "04", runs: 0 },
          { hour: "05", runs: 9 },
          { hour: "06", runs: 41 },
          { hour: "07", runs: 38 },
          { hour: "08", runs: 12 },
          { hour: "09", runs: 4 },
          { hour: "10", runs: 2 },
          { hour: "11", runs: 3 },
          { hour: "12", runs: 8 },
          { hour: "13", runs: 6 },
          { hour: "14", runs: 2 },
          { hour: "15", runs: 1 },
          { hour: "16", runs: 3 },
          { hour: "17", runs: 11 },
          { hour: "18", runs: 22 },
          { hour: "19", runs: 17 },
          { hour: "20", runs: 6 },
          { hour: "21", runs: 2 },
          { hour: "22", runs: 0 },
          { hour: "23", runs: 0 },
        ]}
        x="hour"
        y="runs"
        labelEvery={3}
        labels={false}
        height={260}
      />,
      text: "Another 38 started between 7am and 8am. 22 started between 6pm and 7pm.",
    },
    {
      kind: "quote",
      quote: "I started running before work in the spring. I have kept to it since.",
      attribution: "Club member",
      role: "Club newsletter, December 2024",
    },
    {
      kind: "closing",
      kicker: "Next year",
      title: "2,000 km in 2025 needs 167 km a month",
      text: "You averaged 154 km a month in 2024.",
      points: ["You ran 167 km or more in 4 months of 2024.", "July was 51 km below June."],
      action: { label: "Set a 2025 goal", href: "#goal" },
    },
  ]}
  sources="Club activity tracker"
  period="1 January to 31 December 2024"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "story-deck",
  "theme": "dusk",
  "aspect": "4:5",
  "cards": [
    {
      "kind": "title",
      "tone": "inverse",
      "kicker": "Your 2024 on the road",
      "title": "You ran 1,842 km in 2024",
      "deck": "That was 23% more than in 2023. You ran 187 times.",
      "byline": "Riverside Runners · member report"
    },
    {
      "kind": "stat",
      "kicker": "Distance",
      "variant": "with-trend",
      "series": [1120, 1310, 1498, 1842],
      "value": 1842,
      "format": "integer",
      "label": "Kilometres run in 2024",
      "delta": 0.23,
      "deltaLabel": "vs 2023",
      "context": "You ran 1,120 km in 2021 and 1,498 km in 2023."
    },
    {
      "kind": "chart",
      "kicker": "Weeks",
      "title": "You ran in 46 of the year's 52 weeks",
      "chart": {
        "type": "waffle-chart",
        "data": [{ "weeks": "Weeks with a run", "n": 46 }],
        "name": "weeks",
        "value": "n",
        "total": 52,
        "rows": 4,
        "columns": 13,
        "restLabel": "Weeks without a run",
        "format": "integer",
        "aspect": 2.6
      },
      "text": "Each square is one week. Four of the six weeks without a run were in July."
    },
    {
      "kind": "chart",
      "kicker": "Month by month",
      "title": "October was your highest month at 224 km",
      "chart": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "km": 96 },
          { "month": "Feb", "km": 104 },
          { "month": "Mar", "km": 131 },
          { "month": "Apr", "km": 148 },
          { "month": "May", "km": 162 },
          { "month": "Jun", "km": 171 },
          { "month": "Jul", "km": 120 },
          { "month": "Aug", "km": 158 },
          { "month": "Sep", "km": 196 },
          { "month": "Oct", "km": 224 },
          { "month": "Nov", "km": 181 },
          { "month": "Dec", "km": 151 }
        ],
        "x": "month",
        "y": "km",
        "orientation": "vertical",
        "sort": "none",
        "highlight": "Oct",
        "labels": false,
        "format": "{value} km",
        "height": 240
      },
      "text": "You ran 120 km in July while you were injured. You ran 158 km in August."
    },
    {
      "kind": "chart",
      "kicker": "Pace",
      "title": "Your easy pace fell from 5.52 to 5.04 minutes per kilometre",
      "chart": {
        "type": "line-chart",
        "data": [
          { "month": "Jan", "pace": 5.52 },
          { "month": "Feb", "pace": 5.47 },
          { "month": "Mar", "pace": 5.41 },
          { "month": "Apr", "pace": 5.36 },
          { "month": "May", "pace": 5.33 },
          { "month": "Jun", "pace": 5.28 },
          { "month": "Jul", "pace": 5.31 },
          { "month": "Aug", "pace": 5.24 },
          { "month": "Sep", "pace": 5.16 },
          { "month": "Oct", "pace": 5.09 },
          { "month": "Nov", "pace": 5.07 },
          { "month": "Dec", "pace": 5.04 }
        ],
        "x": "month",
        "y": "pace",
        "format": "{value} min/km",
        "height": 240
      },
      "text": "A lower number is a faster pace. Your pace in August was 5.24."
    },
    {
      "kind": "chart",
      "kicker": "Habits",
      "tone": "accent",
      "title": "41 of your 187 runs started between 6am and 7am",
      "chart": {
        "type": "radial-bar-chart",
        "data": [
          { "hour": "00", "runs": 0 },
          { "hour": "01", "runs": 0 },
          { "hour": "02", "runs": 0 },
          { "hour": "03", "runs": 0 },
          { "hour": "04", "runs": 0 },
          { "hour": "05", "runs": 9 },
          { "hour": "06", "runs": 41 },
          { "hour": "07", "runs": 38 },
          { "hour": "08", "runs": 12 },
          { "hour": "09", "runs": 4 },
          { "hour": "10", "runs": 2 },
          { "hour": "11", "runs": 3 },
          { "hour": "12", "runs": 8 },
          { "hour": "13", "runs": 6 },
          { "hour": "14", "runs": 2 },
          { "hour": "15", "runs": 1 },
          { "hour": "16", "runs": 3 },
          { "hour": "17", "runs": 11 },
          { "hour": "18", "runs": 22 },
          { "hour": "19", "runs": 17 },
          { "hour": "20", "runs": 6 },
          { "hour": "21", "runs": 2 },
          { "hour": "22", "runs": 0 },
          { "hour": "23", "runs": 0 }
        ],
        "x": "hour",
        "y": "runs",
        "labelEvery": 3,
        "labels": false,
        "height": 260
      },
      "text": "Another 38 started between 7am and 8am. 22 started between 6pm and 7pm."
    },
    {
      "kind": "quote",
      "quote": "I started running before work in the spring. I have kept to it since.",
      "attribution": "Club member",
      "role": "Club newsletter, December 2024"
    },
    {
      "kind": "closing",
      "kicker": "Next year",
      "title": "2,000 km in 2025 needs 167 km a month",
      "text": "You averaged 154 km a month in 2024.",
      "points": ["You ran 167 km or more in 4 months of 2024.", "July was 51 km below June."],
      "action": { "label": "Set a 2025 goal", "href": "#goal" }
    }
  ],
  "sources": "Club activity tracker",
  "period": "1 January to 31 December 2024",
  "note": "Illustrative data"
}
```

This example sets `theme="dusk"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `cards` (required), `Card[]`: The cards in order. Each has a `kind`: `title` `{ title, deck?, byline? }`; `stat` `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, text?, variant?, icon?, series?, target?, max? }`, where `variant` is any `big-number` display (`with-icon`, `with-ring`, `with-trend`, `filled`, `tinted`); `chart` `{ title, chart, text? }`; `quote` `{ quote, attribution?, role? }`; `closing` `{ title, text?, points?, action?: { label, href } }`. Any card takes `kicker`, `tone: "surface" | "inverse" | "accent"` and `id`. In the example: 8 items: an object with `kind`, `tone`, `kicker`, `title`, `deck`, `byline`; an object with `kind`, `kicker`, `variant`, `series`, `value`, `format`, `label`, `delta`, `deltaLabel`, `context`; an object with `kind`, `kicker`, `title`, `chart`, `text`; ....

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `cards` (required) | `Card[]` |  | The cards in order. Each has a `kind`: `title` `{ title, deck?, byline? }`; `stat` `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, text?, variant?, icon?, series?, target?, max? }`, where `variant` is any `big-number` display (`with-icon`, `with-ring`, `with-trend`, `filled`, `tinted`); `chart` `{ title, chart, text? }`; `quote` `{ quote, attribution?, role? }`; `closing` `{ title, text?, points?, action?: { label, href } }`. Any card takes `kicker`, `tone: "surface" \| "inverse" \| "accent"` and `id`. |
| `label` | `string` |  | Accessible name of the deck. Defaults to the first card's title. |
| `aspect` | `"auto" \| "9:16" \| "4:5" \| "1:1" \| "16:9"` | `"4:5"` | Shape of every card. `auto` lets cards take the height their content needs. `16:9` falls back to `4:5` in containers under 520px. |
| `layout` | `"pager" \| "stack"` | `"pager"` | `pager` shows one card at a time (swipe, buttons, dots, arrow keys, Home/End). `stack` lists every card in a column. |
| `startAt` | `number` | `0` | Card shown first (zero-based). |
| `onCardChange` | `(index: number) => void` |  | Called when the visible card changes. |
| `maxWidth` | `number` |  | Widest a card is drawn, in px. Default 440 (400 for 9:16, 520 for 1:1, 840 for 16:9). Type and spacing scale with the card. |
| `previousLabel` | `string` | `"Previous"` | Label of the previous button. |
| `nextLabel` | `string` | `"Next"` | Label of the next button. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `theme` | `ThemeInput` |  | A built-in theme name (`"dusk"`, `"magenta"`, `"paper"`...) or a theme object, passed on to everything in the cards. A named theme with its own surface paints each card in that surface; the pager and the source note stay in the page's theme. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `big-number` (atom), `prose` (atom), `pull-quote` (atom), `source-note` (atom), `bar-chart` (atom), `line-chart` (atom), `radial-bar-chart` (atom), `waffle-chart` (atom)
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
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/story-deck.md
- Registry item: https://insightcharts.dev/r/story-deck.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/story-deck.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/story-deck
- These instructions as plain text: https://insightcharts.dev/agents/templates/story-deck.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
