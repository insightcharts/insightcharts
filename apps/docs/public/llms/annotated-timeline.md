# Annotated timeline (`annotated-timeline`)

> A vertical sequence of dated events along a rail, each with a short explanation and, optionally, a small chart or figure.

- Component: `AnnotatedTimeline` (import from `insightcharts`)
- Spec type: `"annotated-timeline"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Telling how something unfolded when the events matter more than a continuous measure: a policy history, an incident, a product's milestones. Four to eight events; give a figure only to the ones where a number changed.

## Avoid

Events that should be read against a time scale, with gaps and overlaps to scale (use `timeline-chart`); a continuous series with a few annotated moments (use `line-chart` with `annotations`); ordered steps that are not dated (use `section` with `step`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/annotated-timeline
```

The file lands at `components/insightcharts/molecules/annotated-timeline.tsx`. `@insightcharts/annotated-timeline-demo` adds a ready-made example next to it.

## Usage

```tsx
import { AnnotatedTimeline, BigNumber, Sparkline } from "insightcharts";

<AnnotatedTimeline
  theme="paper"
  title="The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023"
  subtitle="Euro area deposit facility rate and annual inflation, 2021 to 2024"
  events={[
    {
      date: "July 2021",
      title: "Inflation reaches 2.2%",
      text: "The ECB's target is 2%. The bank kept its deposit rate at −0.5%.",
    },
    {
      date: "July 2022",
      title: "The deposit rate rises from −0.5% to 0%",
      emphasis: true,
      text: "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.",
      figure: <BigNumber value="8.9%" label="Annual inflation, July 2022" context="The target is 2%" />,
    },
    {
      date: "October 2022",
      title: "Inflation reaches 10.6%",
      text: "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.",
      figure: <Sparkline
        data={[
          { month: "2022-01", rate: 5.1 },
          { month: "2022-02", rate: 5.9 },
          { month: "2022-03", rate: 7.4 },
          { month: "2022-04", rate: 7.4 },
          { month: "2022-05", rate: 8.1 },
          { month: "2022-06", rate: 8.6 },
          { month: "2022-07", rate: 8.9 },
          { month: "2022-08", rate: 9.1 },
          { month: "2022-09", rate: 9.9 },
          { month: "2022-10", rate: 10.6 },
          { month: "2022-11", rate: 10.1 },
          { month: "2022-12", rate: 9.2 },
        ]}
        x="month"
        y="rate"
        format="{value}%"
        extremes
        showValue
        style={{ maxWidth: 260 }}
      />,
    },
    {
      date: "September 2023",
      title: "The deposit rate reaches 4%",
      text: "This was the tenth rise in a row. Inflation was 4.3%.",
    },
    {
      date: "June 2024",
      title: "The deposit rate is cut to 3.75%",
      emphasis: true,
      text: "The cut was 0.25 points. Inflation was 2.5%.",
    },
  ]}
  source="European Central Bank; Eurostat"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "annotated-timeline",
  "theme": "paper",
  "title": "The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023",
  "subtitle": "Euro area deposit facility rate and annual inflation, 2021 to 2024",
  "events": [
    {
      "date": "July 2021",
      "title": "Inflation reaches 2.2%",
      "text": "The ECB's target is 2%. The bank kept its deposit rate at −0.5%."
    },
    {
      "date": "July 2022",
      "title": "The deposit rate rises from −0.5% to 0%",
      "emphasis": true,
      "text": "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.",
      "figure": {
        "type": "big-number",
        "value": "8.9%",
        "label": "Annual inflation, July 2022",
        "context": "The target is 2%"
      }
    },
    {
      "date": "October 2022",
      "title": "Inflation reaches 10.6%",
      "text": "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.",
      "figure": {
        "type": "sparkline",
        "data": [
          { "month": "2022-01", "rate": 5.1 },
          { "month": "2022-02", "rate": 5.9 },
          { "month": "2022-03", "rate": 7.4 },
          { "month": "2022-04", "rate": 7.4 },
          { "month": "2022-05", "rate": 8.1 },
          { "month": "2022-06", "rate": 8.6 },
          { "month": "2022-07", "rate": 8.9 },
          { "month": "2022-08", "rate": 9.1 },
          { "month": "2022-09", "rate": 9.9 },
          { "month": "2022-10", "rate": 10.6 },
          { "month": "2022-11", "rate": 10.1 },
          { "month": "2022-12", "rate": 9.2 }
        ],
        "x": "month",
        "y": "rate",
        "format": "{value}%",
        "extremes": true,
        "showValue": true,
        "style": { "maxWidth": 260 }
      }
    },
    {
      "date": "September 2023",
      "title": "The deposit rate reaches 4%",
      "text": "This was the tenth rise in a row. Inflation was 4.3%."
    },
    {
      "date": "June 2024",
      "title": "The deposit rate is cut to 3.75%",
      "emphasis": true,
      "text": "The cut was 0.25 points. Inflation was 2.5%."
    }
  ],
  "source": "European Central Bank; Eurostat",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `events` (required) | `{ date, title, text?, figure?, emphasis? }[]` |  | The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events. |
| `figurePosition` | `"below" \| "side"` | `"below"` | Where an event's figure sits; `side` falls back to `below` under 640px. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level of the event titles. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Scope and period. |
| `source` | `string` |  | Shown under the timeline as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every event. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [step-marker](https://insightcharts.dev/llms/step-marker.md), [prose](https://insightcharts.dev/llms/prose.md), [sparkline](https://insightcharts.dev/llms/sparkline.md), [big-number](https://insightcharts.dev/llms/big-number.md)
- Used by: [timeline-story](https://insightcharts.dev/llms/timeline-story.md)

## More examples

### Figures at the side

```tsx
import { AnnotatedTimeline, BigNumber } from "insightcharts";

<AnnotatedTimeline
  figurePosition="side"
  events={[
    {
      date: "2015",
      title: "The Paris Agreement is signed",
      text: "Solar supplied 2.9% of EU electricity. Coal supplied 24.6%.",
      figure: <BigNumber value="2.9%" label="Solar share of EU electricity" />,
    },
    {
      date: "2019",
      title: "Solar module prices are half their 2015 level",
      text: "New utility-scale solar costs less than new gas plants in southern Europe.",
    },
    {
      date: "2022",
      title: "The EU adds 41 GW of solar capacity",
      emphasis: true,
      text: "Gas prices rose sharply in 2022. Solar installations were 47% higher than in 2021.",
      figure: <BigNumber
        value="41 GW"
        label="Solar capacity added in the EU"
        delta={0.47}
        deltaLabel="vs 2021"
      />,
    },
    {
      date: "2024",
      title: "Solar supplies 11.1% of EU electricity",
      text: "Coal supplied 9.8%.",
      figure: <BigNumber value="11.1%" label="Solar share of EU electricity" context="Coal supplied 9.8%" />,
    },
  ]}
  source="Ember; SolarPower Europe"
  note="Figures are approximate, for illustration"
/>
```

### Sea ice minimums, ocean theme

```tsx
import { AnnotatedTimeline, BigNumber, Sparkline } from "insightcharts";

<AnnotatedTimeline
  theme="ocean"
  title="Arctic sea ice reached a record low of 3.4 million km² in September 2012"
  subtitle="Annual minimum extent of Arctic sea ice, million km², 1979 to 2024"
  events={[
    {
      date: "1979",
      title: "The satellite record begins",
      text: "The September minimum was 6.9 million km².",
      figure: <BigNumber value="6.9m km²" label="Minimum sea ice extent, 1979" />,
    },
    {
      date: "2007",
      title: "The minimum falls to 4.2 million km²",
      text: "It was 5.8 million km² in 2006.",
    },
    {
      date: "2012",
      title: "The minimum reaches 3.4 million km²",
      emphasis: true,
      text: "This is the lowest minimum in the satellite record.",
      figure: <Sparkline
        data={[
          { year: "2003", extent: 6.1 },
          { year: "2004", extent: 6 },
          { year: "2005", extent: 5.5 },
          { year: "2006", extent: 5.8 },
          { year: "2007", extent: 4.2 },
          { year: "2008", extent: 4.7 },
          { year: "2009", extent: 5.1 },
          { year: "2010", extent: 4.9 },
          { year: "2011", extent: 4.6 },
          { year: "2012", extent: 3.4 },
        ]}
        x="year"
        y="extent"
        format="{value}m km²"
        extremes
        showValue
        style={{ maxWidth: 260 }}
      />,
    },
    {
      date: "2020",
      title: "The minimum is 3.8 million km²",
      text: "This is the second lowest minimum in the record.",
    },
    {
      date: "2024",
      title: "The minimum is 4.3 million km²",
      emphasis: true,
      text: "The 2024 minimum was 38% below the 1979 minimum.",
      figure: <BigNumber
        value="4.3m km²"
        label="Minimum sea ice extent, 2024"
        delta={-0.38}
        deltaLabel="vs 1979"
      />,
    },
  ]}
  source="National Snow and Ice Data Center"
  note="Figures are approximate, for illustration"
/>
```

### Wage rises with figures at the side, editorial theme

```tsx
import { AnnotatedTimeline, BigNumber } from "insightcharts";

<AnnotatedTimeline
  theme="editorial"
  figurePosition="side"
  title="The UK National Living Wage rose from £7.20 in 2016 to £12.21 in 2025"
  subtitle="Hourly National Living Wage, selected April upratings, 2016 to 2025"
  events={[
    {
      date: "April 2016",
      title: "The National Living Wage starts at £7.20",
      text: "It applied to workers aged 25 and over.",
      figure: <BigNumber value="£7.20" label="Hourly rate, April 2016" />,
    },
    { date: "April 2021", title: "The age threshold falls to 23", text: "The rate was £8.91." },
    {
      date: "April 2024",
      title: "The rate rises to £11.44",
      emphasis: true,
      text: "The age threshold fell to 21. The rate was £10.42 in 2023.",
      figure: <BigNumber
        value="£11.44"
        label="Hourly rate, April 2024"
        delta="+9.8%"
        deltaLabel="vs 2023"
      />,
    },
    {
      date: "April 2025",
      title: "The rate rises to £12.21",
      text: "The rise was 6.7%.",
      figure: <BigNumber
        value="£12.21"
        label="Hourly rate, April 2025"
        delta="+6.7%"
        deltaLabel="vs 2024"
      />,
    },
  ]}
  source="Low Pay Commission"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/annotated-timeline.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/annotated-timeline.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
