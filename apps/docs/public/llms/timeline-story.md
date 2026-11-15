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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

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

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [timeline-chart](https://insightcharts.dev/llms/timeline-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [big-number](https://insightcharts.dev/llms/big-number.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md)
- Used by: no molecule or template yet

## More examples

### Sport: a timeline chart as the overview, exhibits below

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

### Cities: a stacked overview and a waffle in a chapter

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

## Links

- Registry item: https://insightcharts.dev/r/timeline-story.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-story.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
