# Build a Visual essay with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Visual essay (`visual-essay`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A long article read by scrolling. It has a headline, then an ordered list of blocks in a reading column, then a source note. The blocks are prose, figures, charts with a callout, scrolly sequences, pull quotes, stat rows, small multiples and chapter breaks. Exhibits can be wider than the column.

Use it when: Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart.

Pick something else when: A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/visual-essay
```

The file lands at `components/insightcharts/templates/visual-essay.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { VisualEssay } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { BarChart, LineChart, VisualEssay, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<VisualEssay
  theme="editorial"
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
        format="{value}%"
        zero
        title="Solar's share rose from 2.9% to 11.1% between 2015 and 2024"
        subtitle="Share of EU electricity generation, 2015 to 2024"
        annotations={[{ type: "band", axis: "x", from: "2021", to: "2022", label: "Gas price crisis" }]}
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
      variant: "tiles",
      subtitle: "Bars show 2020 to 2024",
      items: [
        {
          variant: "bars",
          series: [137, 165, 205, 272, 338],
          value: 338,
          format: "{value} GW",
          label: "Solar capacity installed in the EU, end of 2024",
          delta: "+66 GW",
          deltaLabel: "in 2024",
        },
        {
          variant: "bars",
          series: [145, 165, 210, 249, 304],
          value: 304,
          format: "{value} TWh",
          label: "Solar generation, 2024",
          delta: 0.22,
          deltaLabel: "vs 2023",
        },
        {
          variant: "bars",
          tone: 1,
          series: [350, 400, 430, 320, 269],
          value: 269,
          format: "{value} TWh",
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
      chart: {
        type: "bar-chart",
        data: [
          { source: "Nuclear", y2015: 26.5, y2024: 23.7 },
          { source: "Coal", y2015: 24.6, y2024: 9.8 },
          { source: "Gas", y2015: 15.8, y2024: 15.7 },
          { source: "Hydro", y2015: 11.5, y2024: 12.5 },
          { source: "Wind", y2015: 9.3, y2024: 17.4 },
          { source: "Solar", y2015: 2.9, y2024: 11.1 },
        ],
        x: "source",
        y: "y2015",
        sort: "none",
        orientation: "horizontal",
        format: "{value}%",
        height: 320,
        title: "EU electricity generation by source, 2015",
        subtitle: "Share of electricity generation",
        source: "Ember, European Electricity Review 2025",
        option: { xAxis: { max: 30 } },
      },
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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "visual-essay",
  "theme": "editorial",
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
        "format": "{value}%",
        "zero": true,
        "title": "Solar's share rose from 2.9% to 11.1% between 2015 and 2024",
        "subtitle": "Share of EU electricity generation, 2015 to 2024",
        "annotations": [{ "type": "band", "axis": "x", "from": "2021", "to": "2022", "label": "Gas price crisis" }],
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
      "variant": "tiles",
      "subtitle": "Bars show 2020 to 2024",
      "items": [
        {
          "variant": "bars",
          "series": [137, 165, 205, 272, 338],
          "value": 338,
          "format": "{value} GW",
          "label": "Solar capacity installed in the EU, end of 2024",
          "delta": "+66 GW",
          "deltaLabel": "in 2024"
        },
        {
          "variant": "bars",
          "series": [145, 165, 210, 249, 304],
          "value": 304,
          "format": "{value} TWh",
          "label": "Solar generation, 2024",
          "delta": 0.22,
          "deltaLabel": "vs 2023"
        },
        {
          "variant": "bars",
          "tone": 1,
          "series": [350, 400, 430, 320, 269],
          "value": 269,
          "format": "{value} TWh",
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

This example sets `theme="editorial"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `blocks` (required), `(Block | Slot)[]`: The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, variant?, title? }` (the props of `stat-row`); `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" | "wide" | "full"` and an `id`. A bare chart spec is treated as a wide figure. In the example: 12 items: an object with `kind`, `lead`, `text`; an object with `kind`, `chart`; an object with `kind`, `text`; ....

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The essay's main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `blocks` (required) | `(Block \| Slot)[]` |  | The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, variant?, title? }` (the props of `stat-row`); `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" \| "wide" \| "full"` and an `id`. A bare chart spec is treated as a wide figure. |
| `measure` | `number` | `680` | Width of the reading column in px. |
| `textSize` | `"md" \| "lg"` |  | Body text size. Default 18px, 16px in narrow containers. |
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

- Built from: `headline` (atom), `prose` (atom), `pull-quote` (atom), `step-marker` (atom), `small-multiples` (atom), `chart-callout` (molecule), `scrolly-chart` (molecule), `small-multiple-grid` (molecule), `stat-row` (molecule), `source-note` (atom), `line-chart` (atom), `bar-chart` (atom), `waffle-chart` (atom), `dumbbell-chart` (atom), `heatmap` (atom)
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

- Component reference with every example: https://insightcharts.dev/llms/visual-essay.md
- Registry item: https://insightcharts.dev/r/visual-essay.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/visual-essay.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/visual-essay
- These instructions as plain text: https://insightcharts.dev/agents/templates/visual-essay.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
