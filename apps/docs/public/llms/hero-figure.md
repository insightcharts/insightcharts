# Hero figure (`hero-figure`)

> The opening exhibit of a piece: kicker, headline and deck above one large chart, with a source line underneath.

- Component: `HeroFigure` (import from `insightcharts`)
- Spec type: `"hero-figure"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

At the very top of a data story or a one-page report. The headline states the main fact with its number. The chart shows that fact.

## Avoid

Giving the chart its own `title` (the headline is the title; use the chart's `subtitle` for the measure). A second hero on the same page: later sections use `section` or `chart-callout`.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/hero-figure
```

The file lands at `components/insightcharts/molecules/hero-figure.tsx`. `@insightcharts/hero-figure-demo` adds a ready-made example next to it.

## Usage

```tsx
import { HeroFigure, LineChart } from "insightcharts";

<HeroFigure
  theme="editorial"
  kicker="Energy transition"
  title="Solar supplied 11.1% of EU electricity in 2024"
  deck="Coal's share fell from 24.6% in 2015 to 9.8% in 2024."
  byline="By Ana Ruiz"
  date="2025-01-23"
  chart={<LineChart
    data={[
      { year: "2015", Solar: 2.9, Coal: 24.6, Wind: 9.2, Gas: 15.6 },
      { year: "2016", Solar: 3, Coal: 22, Wind: 9.5, Gas: 18.4 },
      { year: "2017", Solar: 3.4, Coal: 20.6, Wind: 11, Gas: 19.7 },
      { year: "2018", Solar: 3.7, Coal: 19.2, Wind: 11.4, Gas: 18.3 },
      { year: "2019", Solar: 4.2, Coal: 15, Wind: 13, Gas: 21 },
      { year: "2020", Solar: 5, Coal: 13, Wind: 14.4, Gas: 20.1 },
      { year: "2021", Solar: 5.4, Coal: 14.7, Wind: 13.3, Gas: 18.8 },
      { year: "2022", Solar: 7, Coal: 15.8, Wind: 15.1, Gas: 19.6 },
      { year: "2023", Solar: 9.1, Coal: 12.3, Wind: 17.5, Gas: 16.8 },
      { year: "2024", Solar: 11.1, Coal: 9.8, Wind: 17.4, Gas: 15.7 },
    ]}
    x="year"
    y={["Solar", "Coal", "Wind", "Gas"]}
    highlight={["Solar", "Coal"]}
    contextLabels
    format="{value}%"
    zero
    height={380}
    subtitle="Share of EU electricity generation by source, 2015 to 2024"
  />}
  source={{ name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" }}
  note="Figures are approximate, for illustration"
  period="2015 to 2024"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "hero-figure",
  "theme": "editorial",
  "kicker": "Energy transition",
  "title": "Solar supplied 11.1% of EU electricity in 2024",
  "deck": "Coal's share fell from 24.6% in 2015 to 9.8% in 2024.",
  "byline": "By Ana Ruiz",
  "date": "2025-01-23",
  "chart": {
    "type": "line-chart",
    "data": [
      { "year": "2015", "Solar": 2.9, "Coal": 24.6, "Wind": 9.2, "Gas": 15.6 },
      { "year": "2016", "Solar": 3, "Coal": 22, "Wind": 9.5, "Gas": 18.4 },
      { "year": "2017", "Solar": 3.4, "Coal": 20.6, "Wind": 11, "Gas": 19.7 },
      { "year": "2018", "Solar": 3.7, "Coal": 19.2, "Wind": 11.4, "Gas": 18.3 },
      { "year": "2019", "Solar": 4.2, "Coal": 15, "Wind": 13, "Gas": 21 },
      { "year": "2020", "Solar": 5, "Coal": 13, "Wind": 14.4, "Gas": 20.1 },
      { "year": "2021", "Solar": 5.4, "Coal": 14.7, "Wind": 13.3, "Gas": 18.8 },
      { "year": "2022", "Solar": 7, "Coal": 15.8, "Wind": 15.1, "Gas": 19.6 },
      { "year": "2023", "Solar": 9.1, "Coal": 12.3, "Wind": 17.5, "Gas": 16.8 },
      { "year": "2024", "Solar": 11.1, "Coal": 9.8, "Wind": 17.4, "Gas": 15.7 }
    ],
    "x": "year",
    "y": ["Solar", "Coal", "Wind", "Gas"],
    "highlight": ["Solar", "Coal"],
    "contextLabels": true,
    "format": "{value}%",
    "zero": true,
    "height": 380,
    "subtitle": "Share of EU electricity generation by source, 2015 to 2024"
  },
  "source": { "name": "Ember, European Electricity Review 2025", "url": "https://ember-energy.org" },
  "note": "Figures are approximate, for illustration",
  "period": "2015 to 2024"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main fact, as one plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the series or topic. |
| `deck` | `string` |  | One plain sentence under the title that adds a second fact. |
| `byline` | `string` |  | Author line, e.g. "By Ana Ruiz". |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `chart` (required) | `Slot` |  | The hero chart: a spec or a React element, without its own title. |
| `source` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `note` | `string` |  | Caveats the reader should know. |
| `align` | `"left" \| "center"` | `"left"` | Headline alignment. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title. |
| `children` | `ReactNode` |  | JSX alternative to `chart`. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the headline, chart and source note. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [big-number](https://insightcharts.dev/llms/big-number.md), [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md)
- Used by: no molecule or template yet

## More examples

### Centered, big number as the exhibit, dusk theme

```tsx
import { BigNumber, HeroFigure } from "insightcharts";

<HeroFigure
  theme="dusk"
  align="center"
  title="33% of the world's population had never used the internet in 2023"
  deck="The ITU estimates that 2.6 billion people were offline."
  chart={<BigNumber
    size="hero"
    align="center"
    value="2.6 billion"
    label="People who have never used the internet"
    context="33% of the world's population in 2023"
  />}
  source="ITU Facts and Figures 2023"
  note="Figures are approximate, for illustration"
/>
```

### Default theme with one accent overridden

```tsx
import { DumbbellChart, HeroFigure } from "insightcharts";

<HeroFigure
  theme={{ accent: "#b4237a" }}
  kicker="Representation"
  title="Women held 27.0% of seats in national parliaments in 2024"
  deck="The share was 13.1% in 2000."
  chart={<DumbbellChart
    data={[
      { region: "Americas", y2000: 15.3, y2024: 35.1 },
      { region: "Europe", y2000: 16, y2024: 31.8 },
      { region: "Sub-Saharan Africa", y2000: 11.3, y2024: 27.3 },
      { region: "Pacific", y2000: 13, y2024: 22.9 },
      { region: "Asia", y2000: 14.6, y2024: 22.1 },
      { region: "Middle East and North Africa", y2000: 3.8, y2024: 16.5 },
    ]}
    category="region"
    from="y2000"
    to="y2024"
    names={{ y2000: "2000", y2024: "2024" }}
    format="{value}%"
    sort="to"
    highlight="Americas"
    subtitle="Share of seats in national parliaments held by women, by region, 2000 and 2024"
  />}
  source="Inter-Parliamentary Union"
  note="Figures are approximate, for illustration"
  period="2000 and 2024"
/>
```

### Part of a whole as the exhibit, earth theme

```tsx
import { HeroFigure, WaffleChart } from "insightcharts";

<HeroFigure
  theme="earth"
  kicker="Land use"
  title="Forest covered 31% of the world's land in 2020"
  deck="Agriculture used 37% of the world's land."
  chart={<WaffleChart
    data={[
      { use: "Forest", share: 31 },
      { use: "Agriculture", share: 37 },
      { use: "Other land", share: 32 },
    ]}
    name="use"
    value="share"
    total={100}
    highlight="Forest"
    height={300}
    subtitle="Share of the world's land area by use, 2020. One cell is 1%."
  />}
  source="FAO, Global Forest Resources Assessment 2020"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/hero-figure.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/hero-figure.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
