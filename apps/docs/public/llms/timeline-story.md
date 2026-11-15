# Timeline story (`timeline-story`)

> A story told in date order. It has a headline, one overview exhibit of the whole period (a timeline chart or an annotated line), dated chapters along a rail, a closing paragraph and a source note. Each chapter has a short text and an optional small exhibit.

- Component: `TimelineStory` (import from `insightcharts`)
- Spec type: `"timeline-story"`
- Level: template. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the reader needs the events in date order to understand a change. State the change over the whole period in the headline, with the numbers and dates. Mark the main events on the overview exhibit as annotations. Give each chapter one event. Add a small figure to a chapter only when it has a number to show. Mark the two or three most important events with `emphasis`.

## Avoid

Events with no measure that runs through the period (use a plain `annotated-timeline`). A comparison of two states with nothing in between (use `comparison-brief`). More than eight chapters. Merge minor events into the text of the chapter before or after.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-story
```

The file lands at `components/insightcharts/templates/timeline-story.tsx`. `@insightcharts/timeline-story-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, BigNumber, LineChart, TimelineStory } from "insightcharts";

<TimelineStory
  kicker="Energy"
  title="Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024"
  deck="The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024."
  byline="By the data desk"
  date="2024-10-01"
  timeline={<LineChart
    data={[
      { year: "1990-01-01", share: 65 },
      { year: "1994-01-01", share: 50 },
      { year: "1998-01-01", share: 35 },
      { year: "2002-01-01", share: 32 },
      { year: "2006-01-01", share: 38 },
      { year: "2010-01-01", share: 28 },
      { year: "2012-01-01", share: 39 },
      { year: "2013-01-01", share: 36 },
      { year: "2014-01-01", share: 30 },
      { year: "2015-01-01", share: 22 },
      { year: "2016-01-01", share: 9 },
      { year: "2017-01-01", share: 7 },
      { year: "2018-01-01", share: 5 },
      { year: "2019-01-01", share: 2 },
      { year: "2020-01-01", share: 2 },
      { year: "2021-01-01", share: 2 },
      { year: "2022-01-01", share: 1.5 },
      { year: "2023-01-01", share: 1 },
      { year: "2024-01-01", share: 0.6 },
    ]}
    x="year"
    y="share"
    format="{value}%"
    zero
    area
    title="Coal's share of generation fell from 65% in 1990 to 0.6% in 2024"
    subtitle="Share of Great Britain's electricity generated from coal, 1990 to 2024"
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
      exhibit: <BigNumber
        value="0%"
        label="Coal share of generation since October 2024"
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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "timeline-story",
  "kicker": "Energy",
  "title": "Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024",
  "deck": "The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024.",
  "byline": "By the data desk",
  "date": "2024-10-01",
  "timeline": {
    "type": "line-chart",
    "data": [
      { "year": "1990-01-01", "share": 65 },
      { "year": "1994-01-01", "share": 50 },
      { "year": "1998-01-01", "share": 35 },
      { "year": "2002-01-01", "share": 32 },
      { "year": "2006-01-01", "share": 38 },
      { "year": "2010-01-01", "share": 28 },
      { "year": "2012-01-01", "share": 39 },
      { "year": "2013-01-01", "share": 36 },
      { "year": "2014-01-01", "share": 30 },
      { "year": "2015-01-01", "share": 22 },
      { "year": "2016-01-01", "share": 9 },
      { "year": "2017-01-01", "share": 7 },
      { "year": "2018-01-01", "share": 5 },
      { "year": "2019-01-01", "share": 2 },
      { "year": "2020-01-01", "share": 2 },
      { "year": "2021-01-01", "share": 2 },
      { "year": "2022-01-01", "share": 1.5 },
      { "year": "2023-01-01", "share": 1 },
      { "year": "2024-01-01", "share": 0.6 }
    ],
    "x": "year",
    "y": "share",
    "format": "{value}%",
    "zero": true,
    "area": true,
    "title": "Coal's share of generation fell from 65% in 1990 to 0.6% in 2024",
    "subtitle": "Share of Great Britain's electricity generated from coal, 1990 to 2024",
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
        "type": "big-number",
        "value": "0%",
        "label": "Coal share of generation since October 2024",
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
| `theme` | `ThemeInput` |  | Theme override, passed on to everything inside. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [timeline-chart](https://insightcharts.dev/llms/timeline-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [big-number](https://insightcharts.dev/llms/big-number.md)
- Used by: no molecule or template yet

## More examples

### Sport: a timeline chart as the overview, exhibits below

```tsx
import { BigNumber, TimelineChart, TimelineStory } from "insightcharts";

<TimelineStory
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

## Links

- Registry item: https://insightcharts.dev/r/timeline-story.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-story.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
