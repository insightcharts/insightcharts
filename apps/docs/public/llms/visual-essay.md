# Visual essay (`visual-essay`)

> A long article read by scrolling. It has a headline, then an ordered list of blocks in a reading column, then a source note. The blocks are prose, figures, charts with a callout, scrolly sequences, pull quotes, stat rows, small multiples and chapter breaks. Exhibits can be wider than the column.

- Component: `VisualEssay` (import from `insightcharts`)
- Spec type: `"visual-essay"`
- Level: template. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart.

## Avoid

A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/visual-essay
```

The file lands at `components/insightcharts/templates/visual-essay.tsx`. `@insightcharts/visual-essay-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, LineChart, VisualEssay } from "insightcharts";

<VisualEssay
  kicker="Energy transition"
  title="Solar supplied 11.1% of EU electricity in 2024, more than coal's 9.8%"
  deck="Solar's share was 2.9% in 2015. Coal's share was 24.6% in 2015."
  byline="By the data desk"
  date="2025-03-14"
  blocks={[
    {
      kind: "prose",
      lead: true,
      text: "Solar supplied **2.9% of the EU's electricity** in 2015. Hydro supplied 11.5%.\n\nIn 2024 solar supplied 11.1%. It was the first full year in which solar generated more electricity than coal.",
    },
    {
      kind: "figure",
      chart: <LineChart
        data={[
          { year: "2015", Solar: 2.9, Coal: 24.6 },
          { year: "2016", Solar: 3, Coal: 22 },
          { year: "2017", Solar: 3.4, Coal: 20.6 },
          { year: "2018", Solar: 3.7, Coal: 19.2 },
          { year: "2019", Solar: 4.2, Coal: 15 },
          { year: "2020", Solar: 5, Coal: 13 },
          { year: "2021", Solar: 5.4, Coal: 14.7 },
          { year: "2022", Solar: 7, Coal: 15.8 },
          { year: "2023", Solar: 9.1, Coal: 12.3 },
          { year: "2024", Solar: 11.1, Coal: 9.8 },
        ]}
        x="year"
        y={["Solar", "Coal"]}
        highlight="Solar"
        format="{value}%"
        zero
        title="Solar's share rose from 2.9% to 11.1% between 2015 and 2024"
        subtitle="Share of EU electricity generation, 2015 to 2024"
        annotations={[
          { type: "band", axis: "x", from: "2021", to: "2022", label: "Gas price crisis" },
          { type: "point", x: "2016", y: 22, label: "Coal", position: "top", dot: false },
        ]}
        source="Ember, European Electricity Review 2025"
      />,
    },
    {
      kind: "prose",
      text: "Coal's share was 15.8% in 2022. It fell to 12.3% in 2023 and 9.8% in 2024. Solar's share rose from 7.0% to 11.1% in the same two years.",
    },
    {
      kind: "break",
      step: 1,
      total: 3,
      title: "Solar module prices, 2010 to 2024",
      text: "A module cost $2.00 a watt in 2010. It cost $0.11 a watt in 2024.",
    },
    {
      kind: "callout",
      chart: <LineChart
        data={[
          { year: "2010", usd: 2 },
          { year: "2012", usd: 0.9 },
          { year: "2014", usd: 0.65 },
          { year: "2016", usd: 0.5 },
          { year: "2018", usd: 0.3 },
          { year: "2020", usd: 0.22 },
          { year: "2022", usd: 0.26 },
          { year: "2024", usd: 0.11 },
        ]}
        x="year"
        y="usd"
        format={{ style: "currency", currency: "USD" }}
        zero
        area
        title="Solar module prices fell from $2.00 to $0.11 a watt between 2010 and 2024"
        subtitle="Average price of crystalline silicon solar modules, US dollars per watt"
        source="IRENA and BloombergNEF (rounded)"
      />,
      label: "Rooftop system cost",
      lead: "Modules are now the smaller part of the cost of a rooftop system",
      body: "Mounting, wiring, labour and the grid connection make up most of the cost.",
    },
    {
      kind: "stats",
      items: [
        {
          value: "338 GW",
          label: "Solar capacity installed in the EU, end of 2024",
          delta: "+66 GW",
          deltaLabel: "in 2024",
        },
        { value: "304 TWh", label: "Solar generation, 2024", delta: 0.22, deltaLabel: "vs 2023" },
        {
          value: "269 TWh",
          label: "Coal generation, 2024",
          delta: -0.16,
          deltaLabel: "vs 2023",
          upIsGood: false,
        },
      ],
    },
    {
      kind: "break",
      step: 2,
      total: 3,
      title: "EU electricity generation by source, 2015 and 2024",
      text: "Scroll to see the shares in 2015 and then in 2024.",
    },
    {
      kind: "scrolly",
      chart: <BarChart
        data={[
          { source: "Nuclear", y2015: 26.5, y2024: 23.7 },
          { source: "Coal", y2015: 24.6, y2024: 9.8 },
          { source: "Gas", y2015: 15.8, y2024: 15.7 },
          { source: "Hydro", y2015: 11.5, y2024: 12.5 },
          { source: "Wind", y2015: 9.3, y2024: 17.4 },
          { source: "Solar", y2015: 2.9, y2024: 11.1 },
        ]}
        x="source"
        y="y2015"
        sort="none"
        orientation="horizontal"
        format="{value}%"
        height={320}
        title="EU electricity generation by source, 2015"
        subtitle="Share of electricity generation"
        source="Ember, European Electricity Review 2025"
        option={{ xAxis: { max: 30 } }}
      />,
      stepHeight: "70vh",
      stickyTop: 16,
      steps: [
        {
          id: "baseline",
          label: "2015",
          content: "In 2015 **nuclear and coal** together supplied 51% of the EU's electricity.",
        },
        {
          id: "coal",
          content: "Coal supplied 24.6% in 2015. It was the second-largest source after nuclear.",
          highlight: "Coal",
        },
        {
          id: "coal-now",
          label: "2024",
          content: "Coal supplied 9.8% in 2024. Plants closed in Germany, Spain and Portugal.",
          highlight: "Coal",
          y: "y2024",
          title: "EU electricity generation by source, 2024",
        },
        {
          id: "solar",
          content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015. Wind supplied 17.4% in 2024 and gas 15.7%.",
          highlight: "Solar",
          y: "y2024",
          title: "Solar supplied 11.1% of EU electricity in 2024",
        },
      ],
    },
    {
      kind: "quote",
      quote: "Solar was 1% of Dutch generation in 2015. It was 18% in 2024. We have had to change how we run the grid at midday.",
      attribution: "Marit de Vries",
      role: "Head of system operations at a Dutch grid operator",
    },
    {
      kind: "break",
      step: 3,
      total: 3,
      title: "Solar share by country",
      text: "Greece had the highest share in 2024 at 22.1%. Spain had 21.0%. France had 4.6%.",
    },
    {
      kind: "multiples",
      data: [
        { country: "Greece", year: "2015", share: 7.8 },
        { country: "Greece", year: "2018", share: 8.1 },
        { country: "Greece", year: "2021", share: 10.9 },
        { country: "Greece", year: "2024", share: 22.1 },
        { country: "Spain", year: "2015", share: 4.9 },
        { country: "Spain", year: "2018", share: 4.7 },
        { country: "Spain", year: "2021", share: 9.6 },
        { country: "Spain", year: "2024", share: 21 },
        { country: "Netherlands", year: "2015", share: 1 },
        { country: "Netherlands", year: "2018", share: 3.2 },
        { country: "Netherlands", year: "2021", share: 9.3 },
        { country: "Netherlands", year: "2024", share: 17.9 },
        { country: "Germany", year: "2015", share: 6 },
        { country: "Germany", year: "2018", share: 7.1 },
        { country: "Germany", year: "2021", share: 8.4 },
        { country: "Germany", year: "2024", share: 14.7 },
        { country: "Poland", year: "2015", share: 0 },
        { country: "Poland", year: "2018", share: 0.2 },
        { country: "Poland", year: "2021", share: 2.2 },
        { country: "Poland", year: "2024", share: 10.8 },
        { country: "France", year: "2015", share: 1.3 },
        { country: "France", year: "2018", share: 1.9 },
        { country: "France", year: "2021", share: 2.8 },
        { country: "France", year: "2024", share: 4.6 },
      ],
      facet: "country",
      x: "year",
      y: "share",
      highlight: ["Netherlands", "Poland"],
      format: "{value}%",
      columns: 3,
      title: "Solar's share in the Netherlands rose from 1.0% to 17.9% between 2015 and 2024",
      subtitle: "Solar share of electricity generation, 2015 to 2024, same scale in every panel",
      source: "Ember (country series rounded, illustrative)",
      width: "wide",
    },
    {
      kind: "prose",
      text: "Poland's solar share rose from 0.0% in 2015 to 10.8% in 2024. Retail electricity prices in the Netherlands and Poland rose after 2022. At those prices a rooftop system paid for itself in under seven years without subsidy.\n\nFrance has cheap nuclear power and slow permitting. Its solar share was 4.6% in 2024. Germany's was 14.7%.",
    },
  ]}
  sources={[
    { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
    "IRENA Renewable Power Generation Costs",
    "BloombergNEF",
  ]}
  period="2010 to 2024, annual"
  method="Generation shares are of total net generation in the EU-27. Module prices are annual averages in nominal dollars."
  note="EU totals are approximate, rounded for illustration. Country series and the quotation are illustrative."
  credit="Analysis and charts by the data desk"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "visual-essay",
  "kicker": "Energy transition",
  "title": "Solar supplied 11.1% of EU electricity in 2024, more than coal's 9.8%",
  "deck": "Solar's share was 2.9% in 2015. Coal's share was 24.6% in 2015.",
  "byline": "By the data desk",
  "date": "2025-03-14",
  "blocks": [
    {
      "kind": "prose",
      "lead": true,
      "text": "Solar supplied **2.9% of the EU's electricity** in 2015. Hydro supplied 11.5%.\n\nIn 2024 solar supplied 11.1%. It was the first full year in which solar generated more electricity than coal."
    },
    {
      "kind": "figure",
      "chart": {
        "type": "line-chart",
        "data": [
          { "year": "2015", "Solar": 2.9, "Coal": 24.6 },
          { "year": "2016", "Solar": 3, "Coal": 22 },
          { "year": "2017", "Solar": 3.4, "Coal": 20.6 },
          { "year": "2018", "Solar": 3.7, "Coal": 19.2 },
          { "year": "2019", "Solar": 4.2, "Coal": 15 },
          { "year": "2020", "Solar": 5, "Coal": 13 },
          { "year": "2021", "Solar": 5.4, "Coal": 14.7 },
          { "year": "2022", "Solar": 7, "Coal": 15.8 },
          { "year": "2023", "Solar": 9.1, "Coal": 12.3 },
          { "year": "2024", "Solar": 11.1, "Coal": 9.8 }
        ],
        "x": "year",
        "y": ["Solar", "Coal"],
        "highlight": "Solar",
        "format": "{value}%",
        "zero": true,
        "title": "Solar's share rose from 2.9% to 11.1% between 2015 and 2024",
        "subtitle": "Share of EU electricity generation, 2015 to 2024",
        "annotations": [
          { "type": "band", "axis": "x", "from": "2021", "to": "2022", "label": "Gas price crisis" },
          {
            "type": "point",
            "x": "2016",
            "y": 22,
            "label": "Coal",
            "position": "top",
            "dot": false
          }
        ],
        "source": "Ember, European Electricity Review 2025"
      }
    },
    {
      "kind": "prose",
      "text": "Coal's share was 15.8% in 2022. It fell to 12.3% in 2023 and 9.8% in 2024. Solar's share rose from 7.0% to 11.1% in the same two years."
    },
    {
      "kind": "break",
      "step": 1,
      "total": 3,
      "title": "Solar module prices, 2010 to 2024",
      "text": "A module cost $2.00 a watt in 2010. It cost $0.11 a watt in 2024."
    },
    {
      "kind": "callout",
      "chart": {
        "type": "line-chart",
        "data": [
          { "year": "2010", "usd": 2 },
          { "year": "2012", "usd": 0.9 },
          { "year": "2014", "usd": 0.65 },
          { "year": "2016", "usd": 0.5 },
          { "year": "2018", "usd": 0.3 },
          { "year": "2020", "usd": 0.22 },
          { "year": "2022", "usd": 0.26 },
          { "year": "2024", "usd": 0.11 }
        ],
        "x": "year",
        "y": "usd",
        "format": { "style": "currency", "currency": "USD" },
        "zero": true,
        "area": true,
        "title": "Solar module prices fell from $2.00 to $0.11 a watt between 2010 and 2024",
        "subtitle": "Average price of crystalline silicon solar modules, US dollars per watt",
        "source": "IRENA and BloombergNEF (rounded)"
      },
      "label": "Rooftop system cost",
      "lead": "Modules are now the smaller part of the cost of a rooftop system",
      "body": "Mounting, wiring, labour and the grid connection make up most of the cost."
    },
    {
      "kind": "stats",
      "items": [
        {
          "value": "338 GW",
          "label": "Solar capacity installed in the EU, end of 2024",
          "delta": "+66 GW",
          "deltaLabel": "in 2024"
        },
        {
          "value": "304 TWh",
          "label": "Solar generation, 2024",
          "delta": 0.22,
          "deltaLabel": "vs 2023"
        },
        {
          "value": "269 TWh",
          "label": "Coal generation, 2024",
          "delta": -0.16,
          "deltaLabel": "vs 2023",
          "upIsGood": false
        }
      ]
    },
    {
      "kind": "break",
      "step": 2,
      "total": 3,
      "title": "EU electricity generation by source, 2015 and 2024",
      "text": "Scroll to see the shares in 2015 and then in 2024."
    },
    {
      "kind": "scrolly",
      "chart": {
        "type": "bar-chart",
        "data": [
          { "source": "Nuclear", "y2015": 26.5, "y2024": 23.7 },
          { "source": "Coal", "y2015": 24.6, "y2024": 9.8 },
          { "source": "Gas", "y2015": 15.8, "y2024": 15.7 },
          { "source": "Hydro", "y2015": 11.5, "y2024": 12.5 },
          { "source": "Wind", "y2015": 9.3, "y2024": 17.4 },
          { "source": "Solar", "y2015": 2.9, "y2024": 11.1 }
        ],
        "x": "source",
        "y": "y2015",
        "sort": "none",
        "orientation": "horizontal",
        "format": "{value}%",
        "height": 320,
        "title": "EU electricity generation by source, 2015",
        "subtitle": "Share of electricity generation",
        "source": "Ember, European Electricity Review 2025",
        "option": { "xAxis": { "max": 30 } }
      },
      "stepHeight": "70vh",
      "stickyTop": 16,
      "steps": [
        {
          "id": "baseline",
          "label": "2015",
          "content": "In 2015 **nuclear and coal** together supplied 51% of the EU's electricity."
        },
        {
          "id": "coal",
          "content": "Coal supplied 24.6% in 2015. It was the second-largest source after nuclear.",
          "highlight": "Coal"
        },
        {
          "id": "coal-now",
          "label": "2024",
          "content": "Coal supplied 9.8% in 2024. Plants closed in Germany, Spain and Portugal.",
          "highlight": "Coal",
          "y": "y2024",
          "title": "EU electricity generation by source, 2024"
        },
        {
          "id": "solar",
          "content": "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015. Wind supplied 17.4% in 2024 and gas 15.7%.",
          "highlight": "Solar",
          "y": "y2024",
          "title": "Solar supplied 11.1% of EU electricity in 2024"
        }
      ]
    },
    {
      "kind": "quote",
      "quote": "Solar was 1% of Dutch generation in 2015. It was 18% in 2024. We have had to change how we run the grid at midday.",
      "attribution": "Marit de Vries",
      "role": "Head of system operations at a Dutch grid operator"
    },
    {
      "kind": "break",
      "step": 3,
      "total": 3,
      "title": "Solar share by country",
      "text": "Greece had the highest share in 2024 at 22.1%. Spain had 21.0%. France had 4.6%."
    },
    {
      "kind": "multiples",
      "data": [
        { "country": "Greece", "year": "2015", "share": 7.8 },
        { "country": "Greece", "year": "2018", "share": 8.1 },
        { "country": "Greece", "year": "2021", "share": 10.9 },
        { "country": "Greece", "year": "2024", "share": 22.1 },
        { "country": "Spain", "year": "2015", "share": 4.9 },
        { "country": "Spain", "year": "2018", "share": 4.7 },
        { "country": "Spain", "year": "2021", "share": 9.6 },
        { "country": "Spain", "year": "2024", "share": 21 },
        { "country": "Netherlands", "year": "2015", "share": 1 },
        { "country": "Netherlands", "year": "2018", "share": 3.2 },
        { "country": "Netherlands", "year": "2021", "share": 9.3 },
        { "country": "Netherlands", "year": "2024", "share": 17.9 },
        { "country": "Germany", "year": "2015", "share": 6 },
        { "country": "Germany", "year": "2018", "share": 7.1 },
        { "country": "Germany", "year": "2021", "share": 8.4 },
        { "country": "Germany", "year": "2024", "share": 14.7 },
        { "country": "Poland", "year": "2015", "share": 0 },
        { "country": "Poland", "year": "2018", "share": 0.2 },
        { "country": "Poland", "year": "2021", "share": 2.2 },
        { "country": "Poland", "year": "2024", "share": 10.8 },
        { "country": "France", "year": "2015", "share": 1.3 },
        { "country": "France", "year": "2018", "share": 1.9 },
        { "country": "France", "year": "2021", "share": 2.8 },
        { "country": "France", "year": "2024", "share": 4.6 }
      ],
      "facet": "country",
      "x": "year",
      "y": "share",
      "highlight": ["Netherlands", "Poland"],
      "format": "{value}%",
      "columns": 3,
      "title": "Solar's share in the Netherlands rose from 1.0% to 17.9% between 2015 and 2024",
      "subtitle": "Solar share of electricity generation, 2015 to 2024, same scale in every panel",
      "source": "Ember (country series rounded, illustrative)",
      "width": "wide"
    },
    {
      "kind": "prose",
      "text": "Poland's solar share rose from 0.0% in 2015 to 10.8% in 2024. Retail electricity prices in the Netherlands and Poland rose after 2022. At those prices a rooftop system paid for itself in under seven years without subsidy.\n\nFrance has cheap nuclear power and slow permitting. Its solar share was 4.6% in 2024. Germany's was 14.7%."
    }
  ],
  "sources": [
    { "name": "Ember, European Electricity Review 2025", "url": "https://ember-energy.org" },
    "IRENA Renewable Power Generation Costs",
    "BloombergNEF"
  ],
  "period": "2010 to 2024, annual",
  "method": "Generation shares are of total net generation in the EU-27. Module prices are annual averages in nominal dollars.",
  "note": "EU totals are approximate, rounded for illustration. Country series and the quotation are illustrative.",
  "credit": "Analysis and charts by the data desk"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The essay's main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `blocks` (required) | `(Block \| Slot)[]` |  | The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, title? }`; `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" \| "wide" \| "full"` and an `id`. A bare chart spec is treated as a wide figure. |
| `measure` | `number` | `680` | Width of the reading column in px. |
| `textSize` | `"md" \| "lg"` |  | Body text size. Default 18px, 16px in narrow containers. |
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

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [pull-quote](https://insightcharts.dev/llms/pull-quote.md), [step-marker](https://insightcharts.dev/llms/step-marker.md), [small-multiples](https://insightcharts.dev/llms/small-multiples.md), [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [scrolly-chart](https://insightcharts.dev/llms/scrolly-chart.md), [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Transport: a shorter essay without a scrolly

```tsx
import { BarChart, LineChart, VisualEssay } from "insightcharts";

<VisualEssay
  kicker="Cities"
  title="Cycling accounts for 11.2% of trips in Paris and cars for 4.3%"
  deck="Bicycle counts in 2024 were 3.2 times the 2015 level. The city made 50 km of temporary pandemic cycle lanes permanent."
  byline="By the transport desk"
  date="2025-04-02"
  textSize="md"
  blocks={[
    {
      kind: "prose",
      lead: true,
      text: "Permanent counters in Paris recorded 3.2 times as many bicycles in 2024 as in 2015. The count rose 47% between 2019 and 2020.",
    },
    {
      kind: "figure",
      chart: <LineChart
        data={[
          { year: "2015", index: 100 },
          { year: "2016", index: 104 },
          { year: "2017", index: 108 },
          { year: "2018", index: 118 },
          { year: "2019", index: 154 },
          { year: "2020", index: 226 },
          { year: "2021", index: 241 },
          { year: "2022", index: 262 },
          { year: "2023", index: 288 },
          { year: "2024", index: 317 },
        ]}
        x="year"
        y="index"
        zero
        title="Bicycle counts in Paris in 2024 were 3.2 times the 2015 level"
        subtitle="Bicycle counts at permanent counters, index (2015 = 100)"
        annotations={[
          { type: "line", axis: "x", value: "2020", label: "Temporary lanes open" },
          { type: "point", x: "2024", y: 317, label: "3.2 times\nthe 2015 level", position: "left" },
        ]}
        source="City of Paris counter data (rounded, illustrative)"
      />,
    },
    {
      kind: "prose",
      text: "The index rose from 154 in 2019 to 226 in 2020, when the city opened 50 km of temporary lanes. The city kept those lanes and built 130 km more. The index reached 317 in 2024.",
    },
    {
      kind: "quote",
      quote: "Counts went up on the streets where we built protected lanes. They stayed up after the lockdowns ended.",
      attribution: "A city transport planner",
    },
    {
      kind: "callout",
      chart: <BarChart
        data={[
          { mode: "Walking", share: 53.5 },
          { mode: "Public transport", share: 30 },
          { mode: "Cycling", share: 11.2 },
          { mode: "Car", share: 4.3 },
          { mode: "Other", share: 1 },
        ]}
        x="mode"
        y="share"
        sort="none"
        orientation="horizontal"
        format="{value}%"
        highlight="Cycling"
        title="Cycling's share of trips within Paris is 2.6 times the car's"
        subtitle="Share of trips within Paris by main mode, 2023"
        source="Institut Paris Region mobility survey"
      />,
      lead: "Walking accounts for 53.5% of trips within Paris",
      body: "Public transport accounts for 30.0%. Cycling accounts for 11.2% and cars for 4.3%.",
      tone: "neutral",
    },
    {
      kind: "prose",
      text: "These shares are for trips within the city. In the suburbs the car accounts for one trip in three.",
    },
  ]}
  sources={["City of Paris open data", "Institut Paris Region"]}
  period="2015 to 2024"
  note="Counter index is illustrative. Mode shares are approximate, for illustration."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/visual-essay.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/visual-essay.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
