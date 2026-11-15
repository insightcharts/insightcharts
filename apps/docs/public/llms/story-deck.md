# Story deck (`story-deck`)

> A sequence of full-frame cards (title, stat, chart, quote, closing) that the reader swipes or steps through. Each card states one fact. It has an optional fixed aspect ratio, a keyboard-accessible pager and a stacked layout for print.

- Component: `StoryDeck` (import from `insightcharts`)
- Spec type: `"story-deck"`
- Level: template. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for a short sequence read on a phone, such as a “year in review”. Each card should be readable in a couple of seconds. State the main fact with its number on the title card. Put one fact on each later card, as a number or as one chart with one highlighted mark under a headline that states the fact. Use five to ten cards. End with a closing card and the sources. Charts in cards should have few data points and direct labels, with no legend.

## Avoid

Findings that need two exhibits in view at once (use `executive-brief`). A single shareable image (use `social-card`). Dense charts or long paragraphs, because a card has little room. One chart that changes step by step (use `scrolly-chart` in `steps` mode).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/story-deck
```

The file lands at `components/insightcharts/templates/story-deck.tsx`. `@insightcharts/story-deck-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, LineChart, RadialBarChart, StoryDeck } from "insightcharts";

<StoryDeck
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
      value: 1842,
      format: "integer",
      label: "Kilometres run in 2024",
      delta: 0.23,
      deltaLabel: "vs 2023",
      context: "An average of 154 km a month",
      text: "You ran in 46 of the year's 52 weeks.",
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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "story-deck",
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
      "value": 1842,
      "format": "integer",
      "label": "Kilometres run in 2024",
      "delta": 0.23,
      "deltaLabel": "vs 2023",
      "context": "An average of 154 km a month",
      "text": "You ran in 46 of the year's 52 weeks."
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

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `cards` (required) | `Card[]` |  | The cards in order. Each has a `kind`: `title` `{ title, deck?, byline? }`; `stat` `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, text? }`; `chart` `{ title, chart, text? }`; `quote` `{ quote, attribution?, role? }`; `closing` `{ title, text?, points?, action?: { label, href } }`. Any card takes `kicker`, `tone: "surface" \| "inverse" \| "accent"` and `id`. |
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
| `theme` | `ThemeInput` |  | Theme override, passed on to everything inside. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [prose](https://insightcharts.dev/llms/prose.md), [pull-quote](https://insightcharts.dev/llms/pull-quote.md), [source-note](https://insightcharts.dev/llms/source-note.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [radial-bar-chart](https://insightcharts.dev/llms/radial-bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Education: landscape cards

```tsx
import { BarChart, LineChart, StoryDeck } from "insightcharts";

<StoryDeck
  aspect="16:9"
  cards={[
    {
      kind: "title",
      kicker: "City libraries · 2024 in review",
      title: "Digital loans were higher than print loans in 2024 for the first time",
      deck: "The five branches had 908,000 visits. That is 91% of the 2019 total.",
    },
    {
      kind: "chart",
      kicker: "Lending",
      title: "Digital loans were 1.33 million in 2024 against 1.24 million for print",
      chart: <LineChart
        data={[
          { year: "2020", Print: 1.42, Digital: 0.61 },
          { year: "2021", Print: 1.18, Digital: 0.83 },
          { year: "2022", Print: 1.31, Digital: 0.92 },
          { year: "2023", Print: 1.29, Digital: 1.08 },
          { year: "2024", Print: 1.24, Digital: 1.33 },
        ]}
        x="year"
        y={["Digital", "Print"]}
        highlight="Digital"
        format="{value}m"
        zero
        height={220}
      />,
    },
    {
      kind: "stat",
      kicker: "Visits",
      value: 908000,
      format: "compact",
      label: "Visits to the five branches",
      delta: 0.07,
      deltaLabel: "vs 2023",
      context: "91% of the 2019 total",
    },
    {
      kind: "chart",
      kicker: "Branches",
      title: "Central had 412,000 of the 908,000 visits",
      chart: <BarChart
        data={[
          { branch: "Central", visits: 412 },
          { branch: "Eastgate", visits: 188 },
          { branch: "Millbrook", visits: 141 },
          { branch: "Harbour", visits: 96 },
          { branch: "Hillside", visits: 71 },
        ]}
        x="branch"
        y="visits"
        orientation="horizontal"
        sort="none"
        highlight="Central"
        format="{value}k"
      />,
    },
    {
      kind: "closing",
      tone: "inverse",
      title: "Eastgate will open for longer hours in 2025",
      text: "The e-book budget will also increase.",
      action: { label: "Read the annual report", href: "#report" },
    },
  ]}
  sources="City library service annual return"
  note="Illustrative data"
/>
```

### Stacked, auto height

```tsx
import { StoryDeck } from "insightcharts";

<StoryDeck
  layout="stack"
  aspect="auto"
  cards={[
    {
      kind: "stat",
      kicker: "Distance",
      value: 1842,
      format: "integer",
      label: "Kilometres run in 2024",
      delta: 0.23,
      deltaLabel: "vs 2023",
    },
    {
      kind: "quote",
      quote: "I started running before work in the spring.",
      attribution: "Club member",
    },
  ]}
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/story-deck.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/story-deck.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
