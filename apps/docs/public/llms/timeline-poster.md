# Timeline poster (`timeline-poster`)

> A poster of change over a run of periods: a full-width ribbon of bands whose thickness is each entity's value and whose order is its rank (`ribbon-chart`), a strip of two to four dated figures under it, and a bottom row with one measure per period as thick bars (`block-bar`) and one share at several dates as nested outlines (`nested-shares`).

- Component: `TimelinePoster` (import from `insightcharts`)
- Spec type: `"timeline-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the subject is how 4 to 8 named things grew, shrank and changed places over 4 to 10 periods: electricity by source, library loans by format, commuters by mode. Give `hero` the periods and entities, `milestones` the dated numbers a reader should take away, `bars` one measure of the whole at each period and `shares` one share at a few dates. State the latest value in the title.

## Avoid

A single series over time (use `line-chart` or `area-chart` in a `poster`). Events with start and end dates (use `timeline-chart` or the `timeline-story` template). More than 8 entities or 10 periods, because the bands get too thin to label. Positions on one scale (use `scale-poster`). Parts of one subject at one date (use `radial-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-poster
```

The file lands at `components/insightcharts/templates/timeline-poster.tsx`. `@insightcharts/timeline-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { TimelinePoster } from "insightcharts";

<TimelinePoster
  theme="sunrise"
  kicker="Electricity"
  title="Wind supplied 8.6 TWh of Orrin Island's electricity in 2025"
  subtitle="Electricity generated on Orrin Island by source, terawatt-hours, every second year from 2015 to 2025."
  hero={{
    data: [
      { year: "2015", Coal: 9.2, Gas: 6.1, Hydro: 2.2, Wind: 1.4, Solar: 0.3 },
      { year: "2017", Coal: 8, Gas: 6.4, Hydro: 2.3, Wind: 2.6, Solar: 0.6 },
      { year: "2019", Coal: 6.1, Gas: 6, Hydro: 2.1, Wind: 4.3, Solar: 1.3 },
      { year: "2021", Coal: 4, Gas: 5.4, Hydro: 2.4, Wind: 5.9, Solar: 2.4 },
      { year: "2023", Coal: 2.3, Gas: 4.7, Hydro: 2.2, Wind: 7.4, Solar: 3.7 },
      { year: "2025", Coal: 1.1, Gas: 4, Hydro: 2.3, Wind: 8.6, Solar: 4.9 },
    ],
    x: "year",
    y: ["Coal", "Gas", "Hydro", "Wind", "Solar"],
    colorBy: "series",
    title: "Coal supplied 9.2 TWh in 2015",
  }}
  milestones={[
    { at: "2017", value: "62", label: "turbines started at the Skerry wind farm" },
    { at: "2021", value: "5.9 TWh", label: "came from wind", context: "Gas supplied 5.4 TWh" },
    { at: "2025", value: "1.1 TWh", label: "came from coal", context: "9.2 TWh in 2015" },
  ]}
  bars={{
    data: [
      { year: "2015", g: 520 },
      { year: "2017", g: 455 },
      { year: "2019", g: 370 },
      { year: "2021", g: 290 },
      { year: "2023", g: 215 },
      { year: "2025", g: 160 },
    ],
    name: "year",
    value: "g",
    format: "{value} g",
    marker: { after: "2017", label: "Skerry wind farm opened" },
    title: "A kilowatt-hour emitted 160 g of CO2 in 2025",
    subtitle: "Grams of CO2 per kilowatt-hour generated.",
  }}
  shares={{
    data: [
      { year: "2015", share: 9 },
      { year: "2019", share: 28 },
      { year: "2021", share: 41 },
      { year: "2025", share: 65 },
    ],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All electricity generated",
    title: "Wind and solar supplied 65% of electricity in 2025",
  }}
  sources="Orrin Island Grid Office, annual generation statistics"
  note="Orrin Island is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "timeline-poster",
  "theme": "sunrise",
  "kicker": "Electricity",
  "title": "Wind supplied 8.6 TWh of Orrin Island's electricity in 2025",
  "subtitle": "Electricity generated on Orrin Island by source, terawatt-hours, every second year from 2015 to 2025.",
  "hero": {
    "data": [
      { "year": "2015", "Coal": 9.2, "Gas": 6.1, "Hydro": 2.2, "Wind": 1.4, "Solar": 0.3 },
      { "year": "2017", "Coal": 8, "Gas": 6.4, "Hydro": 2.3, "Wind": 2.6, "Solar": 0.6 },
      { "year": "2019", "Coal": 6.1, "Gas": 6, "Hydro": 2.1, "Wind": 4.3, "Solar": 1.3 },
      { "year": "2021", "Coal": 4, "Gas": 5.4, "Hydro": 2.4, "Wind": 5.9, "Solar": 2.4 },
      { "year": "2023", "Coal": 2.3, "Gas": 4.7, "Hydro": 2.2, "Wind": 7.4, "Solar": 3.7 },
      { "year": "2025", "Coal": 1.1, "Gas": 4, "Hydro": 2.3, "Wind": 8.6, "Solar": 4.9 }
    ],
    "x": "year",
    "y": ["Coal", "Gas", "Hydro", "Wind", "Solar"],
    "colorBy": "series",
    "title": "Coal supplied 9.2 TWh in 2015"
  },
  "milestones": [
    { "at": "2017", "value": "62", "label": "turbines started at the Skerry wind farm" },
    {
      "at": "2021",
      "value": "5.9 TWh",
      "label": "came from wind",
      "context": "Gas supplied 5.4 TWh"
    },
    { "at": "2025", "value": "1.1 TWh", "label": "came from coal", "context": "9.2 TWh in 2015" }
  ],
  "bars": {
    "data": [
      { "year": "2015", "g": 520 },
      { "year": "2017", "g": 455 },
      { "year": "2019", "g": 370 },
      { "year": "2021", "g": 290 },
      { "year": "2023", "g": 215 },
      { "year": "2025", "g": 160 }
    ],
    "name": "year",
    "value": "g",
    "format": "{value} g",
    "marker": { "after": "2017", "label": "Skerry wind farm opened" },
    "title": "A kilowatt-hour emitted 160 g of CO2 in 2025",
    "subtitle": "Grams of CO2 per kilowatt-hour generated."
  },
  "shares": {
    "data": [
      { "year": "2015", "share": 9 },
      { "year": "2019", "share": 28 },
      { "year": "2021", "share": 41 },
      { "year": "2025", "share": 65 }
    ],
    "name": "year",
    "value": "share",
    "highlight": "2025",
    "wholeLabel": "All electricity generated",
    "title": "Wind and solar supplied 65% of electricity in 2025"
  },
  "sources": "Orrin Island Grid Office, annual generation statistics",
  "note": "Orrin Island is an invented place. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, x, y, series?, values?, labels?, colorBy?, format?, highlight?, title?, ... } \| Slot` |  | The hero: one band per entity across the periods, drawn by `ribbon-chart`. Wide rows take `y` as a list of columns; long rows take `y` and `series`. A full spec or element replaces it. |
| `milestones` | `{ at: string; value: string; label: string; context?: string; icon?: string }[]` |  | Two to four dated figures in a strip under the hero, in time order. `at` is the period, printed in small capitals over the figure. |
| `bars` | `{ data, name, value, marker?, detail?, format?, title?, ... } \| Slot` |  | Bottom left: one measure at each period as thick bars with the numbers inside (`block-bar`). `marker: { after, label }` draws a dotted line after one period to mark an event. |
| `shares` | `{ data, name, value, wholeLabel?, highlight?, format?, title?, ... } \| Slot` |  | Bottom right: one share at 2 to 8 dates as outlines nested in one square (`nested-shares`). `format` defaults to `"{value}%"`. With only one of `bars` and `shares`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"sunrise"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1100` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [ribbon-chart](https://insightcharts.dev/llms/ribbon-chart.md), [block-bar](https://insightcharts.dev/llms/block-bar.md), [nested-shares](https://insightcharts.dev/llms/nested-shares.md)
- Used by: no molecule or template yet

## More examples

### Paper, library loans, with download

```tsx
import { TimelinePoster } from "insightcharts";

<TimelinePoster
  theme="paper"
  download
  kicker="Libraries"
  title="Marlow's libraries lent 226,000 audiobooks in 2025"
  subtitle="Items lent by the Marlow library service by format, thousands, every third year from 2013 to 2025."
  hero={{
    data: [
      {
        year: "2013",
        "Printed books": 412,
        "E-books": 38,
        Audiobooks: 21,
        Films: 96,
        Magazines: 64,
      },
      {
        year: "2016",
        "Printed books": 371,
        "E-books": 84,
        Audiobooks: 47,
        Films: 71,
        Magazines: 52,
      },
      {
        year: "2019",
        "Printed books": 338,
        "E-books": 131,
        Audiobooks: 92,
        Films: 44,
        Magazines: 39,
      },
      {
        year: "2022",
        "Printed books": 296,
        "E-books": 187,
        Audiobooks: 158,
        Films: 23,
        Magazines: 31,
      },
      {
        year: "2025",
        "Printed books": 281,
        "E-books": 204,
        Audiobooks: 226,
        Films: 12,
        Magazines: 24,
      },
    ],
    x: "year",
    y: ["Printed books", "E-books", "Audiobooks", "Films", "Magazines"],
    colorBy: "series",
    format: "{value}k",
    title: "Printed-book loans fell from 412,000 to 281,000",
  }}
  milestones={[
    { at: "2013", value: "21k", label: "audiobooks were lent" },
    { at: "2022", value: "187k", label: "e-books were lent", context: "38,000 in 2013" },
    {
      at: "2025",
      value: "747k",
      label: "items were lent in all formats",
      context: "631,000 in 2013",
    },
  ]}
  bars={{
    data: [
      { year: "2013", k: 58 },
      { year: "2016", k: 61 },
      { year: "2019", k: 67 },
      { year: "2022", k: 74 },
      { year: "2025", k: 83 },
    ],
    name: "year",
    value: "k",
    format: "{value}k",
    title: "The service had 83,000 members in 2025",
  }}
  shares={{
    data: [{ year: "2013", share: 9 }, { year: "2019", share: 35 }, { year: "2025", share: 58 }],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All loans",
    title: "E-books and audiobooks were 58% of loans in 2025",
  }}
  sources="Marlow library service, annual lending returns"
  note="The Marlow library service is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Dusk, long-format rows, bars linked to the ribbon

```tsx
import { TimelinePoster } from "insightcharts";

<TimelinePoster
  theme="dusk"
  linked
  kicker="Commuting"
  title="24% of Kestrel Bay's commuters cycled to work in 2025"
  subtitle="Share of commuters by main mode of travel, per cent, 2010 to 2025."
  hero={{
    data: [
      { year: "2010", mode: "Car", share: 61 },
      { year: "2010", mode: "Bus", share: 17 },
      { year: "2010", mode: "Walking", share: 11 },
      { year: "2010", mode: "Train", share: 7 },
      { year: "2010", mode: "Bicycle", share: 4 },
      { year: "2015", mode: "Car", share: 54 },
      { year: "2015", mode: "Bus", share: 16 },
      { year: "2015", mode: "Walking", share: 11 },
      { year: "2015", mode: "Train", share: 10 },
      { year: "2015", mode: "Bicycle", share: 9 },
      { year: "2020", mode: "Car", share: 45 },
      { year: "2020", mode: "Bus", share: 13 },
      { year: "2020", mode: "Walking", share: 12 },
      { year: "2020", mode: "Train", share: 13 },
      { year: "2020", mode: "Bicycle", share: 17 },
      { year: "2025", mode: "Car", share: 37 },
      { year: "2025", mode: "Bus", share: 12 },
      { year: "2025", mode: "Walking", share: 12 },
      { year: "2025", mode: "Train", share: 15 },
      { year: "2025", mode: "Bicycle", share: 24 },
    ],
    x: "year",
    y: "share",
    series: "mode",
    colorBy: "series",
    format: "{value}%",
    title: "The car's share fell from 61% to 37%",
  }}
  milestones={[
    { at: "2010", value: "4%", label: "of commuters cycled" },
    { at: "2025", value: "24%", label: "of commuters cycled" },
  ]}
  bars={{
    data: [
      { mode: "Train", minutes: 41 },
      { mode: "Bus", minutes: 34 },
      { mode: "Car", minutes: 27 },
      { mode: "Bicycle", minutes: 19 },
      { mode: "Walking", minutes: 14 },
    ],
    name: "mode",
    value: "minutes",
    format: "{value} min",
    title: "The average train commute took 41 minutes in 2025",
    subtitle: "Average one-way commute by mode, minutes, 2025.",
  }}
  shares={{
    data: [
      { year: "2010", share: 15 },
      { year: "2015", share: 20 },
      { year: "2020", share: 29 },
      { year: "2025", share: 36 },
    ],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All commuters",
    title: "36% of commuters walked or cycled in 2025",
  }}
  sources="Kestrel Bay travel-to-work survey"
  note="Kestrel Bay is an invented town. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/timeline-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
