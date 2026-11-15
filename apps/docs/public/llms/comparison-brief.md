# Comparison brief (`comparison-brief`)

> A compared with B on one page. It has a headline that states the result, the headline figures mirrored either side of their labels, one hero exhibit that shows both sides, paired exhibits on a shared scale, a verdict callout and a source note.

- Component: `ComparisonBrief` (import from `insightcharts`)
- Spec type: `"comparison-brief"`
- Level: template. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for two things a reader has to choose between or compare, such as two countries, two products or a before and an after. Write the result with its number in the headline. Put the four or five most important measures in `figures`. Use a two-series line, dumbbell, slope or `before-after` as the hero. In each pair, use the same chart form and the same scale for both sides. The `subject` side takes the accent colour everywhere and the other side stays grey.

## Avoid

Three or more things (use a `comparison-table` or `small-multiple-grid` inside a `report-page`). One thing over time with nothing to compare it with (use `timeline-story`). Paired charts on different scales, because readers compare bar lengths across the pair.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/comparison-brief
```

The file lands at `components/insightcharts/templates/comparison-brief.tsx`. `@insightcharts/comparison-brief-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, ComparisonBrief, LineChart, SegmentedBar } from "insightcharts";

<ComparisonBrief
  kicker="Home heating"
  title="With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years"
  deck="After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980."
  a={{ name: "Heat pump", detail: "Air source, 7 kW" }}
  b={{ name: "Gas boiler", detail: "Condensing combi, 30 kW" }}
  figures={[
    {
      label: "Cost to buy and fit, after grant",
      a: 3500,
      b: 3000,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    { label: "Running cost per year", a: 855, b: 980, format: "currency:GBP", better: "lower" },
    { label: "CO2 per year, tonnes", a: 0.6, b: 2.3, format: "decimal:1", better: "lower" },
    {
      label: "Heat out per unit of energy in",
      a: 3.2,
      b: 0.9,
      format: "decimal:1",
      better: "higher",
    },
    { label: "Expected life, years", a: 20, b: 15, better: "higher" },
  ]}
  hero={<LineChart
    data={[
      { year: "0", saving: -500 },
      { year: "1", saving: -375 },
      { year: "2", saving: -250 },
      { year: "3", saving: -125 },
      { year: "4", saving: 0 },
      { year: "5", saving: 125 },
      { year: "6", saving: 250 },
      { year: "7", saving: 375 },
      { year: "8", saving: 500 },
      { year: "9", saving: 625 },
      { year: "10", saving: 750 },
      { year: "11", saving: 875 },
      { year: "12", saving: 1000 },
      { year: "13", saving: 1125 },
      { year: "14", saving: 1250 },
      { year: "15", saving: 1375 },
    ]}
    x="year"
    y="saving"
    format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0, signDisplay: "exceptZero" }}
    area
    title="After 15 years the heat pump has cost £1,375 less than the boiler"
    subtitle="Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing"
    annotations={[
      {
        type: "line",
        axis: "y",
        value: 0,
        label: "Same cost as the boiler",
        dashed: false,
        emphasis: true,
      },
      { type: "point", x: "4", y: 0, label: "Break-even", position: "top" },
    ]}
  />}
  heroText="Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it."
  pairs={[
    {
      title: "The January energy bill is £142 for the heat pump and £158 for the boiler",
      text: "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      a: <BarChart
        data={[
          { month: "Jan", cost: 142 },
          { month: "Feb", cost: 128 },
          { month: "Mar", cost: 102 },
          { month: "Apr", cost: 68 },
          { month: "May", cost: 40 },
          { month: "Jun", cost: 28 },
          { month: "Jul", cost: 25 },
          { month: "Aug", cost: 26 },
          { month: "Sep", cost: 38 },
          { month: "Oct", cost: 66 },
          { month: "Nov", cost: 98 },
          { month: "Dec", cost: 134 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        option={{ yAxis: { max: 160 } }}
      />,
      b: <BarChart
        data={[
          { month: "Jan", cost: 158 },
          { month: "Feb", cost: 141 },
          { month: "Mar", cost: 115 },
          { month: "Apr", cost: 78 },
          { month: "May", cost: 49 },
          { month: "Jun", cost: 37 },
          { month: "Jul", cost: 34 },
          { month: "Aug", cost: 35 },
          { month: "Sep", cost: 46 },
          { month: "Oct", cost: 74 },
          { month: "Nov", cost: 107 },
          { month: "Dec", cost: 146 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        highlight="none"
        option={{ yAxis: { max: 160 } }}
      />,
    },
    {
      title: "Cost over 15 years by part",
      text: "Energy is £12,075 of the heat pump's cost. It is £13,500 of the boiler's.",
      a: <SegmentedBar
        data={[
          { part: "Purchase and fitting", gbp: 3500 },
          { part: "Energy", gbp: 12075 },
          { part: "Servicing", gbp: 1500 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
      b: <SegmentedBar
        data={[
          { part: "Purchase and fitting", gbp: 3000 },
          { part: "Energy", gbp: 13500 },
          { part: "Servicing", gbp: 1200 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
    },
  ]}
  verdict={{
    lead: "Choose the heat pump if you get the grant and will stay at least 5 years",
    body: "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels.",
  }}
  sources={["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"]}
  method="A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms."
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "comparison-brief",
  "kicker": "Home heating",
  "title": "With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years",
  "deck": "After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980.",
  "a": { "name": "Heat pump", "detail": "Air source, 7 kW" },
  "b": { "name": "Gas boiler", "detail": "Condensing combi, 30 kW" },
  "figures": [
    {
      "label": "Cost to buy and fit, after grant",
      "a": 3500,
      "b": 3000,
      "format": { "style": "currency", "currency": "GBP", "maximumFractionDigits": 0 },
      "better": "lower"
    },
    {
      "label": "Running cost per year",
      "a": 855,
      "b": 980,
      "format": "currency:GBP",
      "better": "lower"
    },
    {
      "label": "CO2 per year, tonnes",
      "a": 0.6,
      "b": 2.3,
      "format": "decimal:1",
      "better": "lower"
    },
    {
      "label": "Heat out per unit of energy in",
      "a": 3.2,
      "b": 0.9,
      "format": "decimal:1",
      "better": "higher"
    },
    { "label": "Expected life, years", "a": 20, "b": 15, "better": "higher" }
  ],
  "hero": {
    "type": "line-chart",
    "data": [
      { "year": "0", "saving": -500 },
      { "year": "1", "saving": -375 },
      { "year": "2", "saving": -250 },
      { "year": "3", "saving": -125 },
      { "year": "4", "saving": 0 },
      { "year": "5", "saving": 125 },
      { "year": "6", "saving": 250 },
      { "year": "7", "saving": 375 },
      { "year": "8", "saving": 500 },
      { "year": "9", "saving": 625 },
      { "year": "10", "saving": 750 },
      { "year": "11", "saving": 875 },
      { "year": "12", "saving": 1000 },
      { "year": "13", "saving": 1125 },
      { "year": "14", "saving": 1250 },
      { "year": "15", "saving": 1375 }
    ],
    "x": "year",
    "y": "saving",
    "format": {
      "style": "currency",
      "currency": "GBP",
      "maximumFractionDigits": 0,
      "signDisplay": "exceptZero"
    },
    "area": true,
    "title": "After 15 years the heat pump has cost £1,375 less than the boiler",
    "subtitle": "Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing",
    "annotations": [
      {
        "type": "line",
        "axis": "y",
        "value": 0,
        "label": "Same cost as the boiler",
        "dashed": false,
        "emphasis": true
      },
      { "type": "point", "x": "4", "y": 0, "label": "Break-even", "position": "top" }
    ]
  },
  "heroText": "Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it.",
  "pairs": [
    {
      "title": "The January energy bill is £142 for the heat pump and £158 for the boiler",
      "text": "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      "a": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 142 },
          { "month": "Feb", "cost": 128 },
          { "month": "Mar", "cost": 102 },
          { "month": "Apr", "cost": 68 },
          { "month": "May", "cost": 40 },
          { "month": "Jun", "cost": 28 },
          { "month": "Jul", "cost": 25 },
          { "month": "Aug", "cost": 26 },
          { "month": "Sep", "cost": 38 },
          { "month": "Oct", "cost": 66 },
          { "month": "Nov", "cost": 98 },
          { "month": "Dec", "cost": 134 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "option": { "yAxis": { "max": 160 } }
      },
      "b": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 158 },
          { "month": "Feb", "cost": 141 },
          { "month": "Mar", "cost": 115 },
          { "month": "Apr", "cost": 78 },
          { "month": "May", "cost": 49 },
          { "month": "Jun", "cost": 37 },
          { "month": "Jul", "cost": 34 },
          { "month": "Aug", "cost": 35 },
          { "month": "Sep", "cost": 46 },
          { "month": "Oct", "cost": 74 },
          { "month": "Nov", "cost": 107 },
          { "month": "Dec", "cost": 146 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "highlight": "none",
        "option": { "yAxis": { "max": 160 } }
      }
    },
    {
      "title": "Cost over 15 years by part",
      "text": "Energy is £12,075 of the heat pump's cost. It is £13,500 of the boiler's.",
      "a": {
        "type": "segmented-bar",
        "data": [
          { "part": "Purchase and fitting", "gbp": 3500 },
          { "part": "Energy", "gbp": 12075 },
          { "part": "Servicing", "gbp": 1500 }
        ],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      },
      "b": {
        "type": "segmented-bar",
        "data": [
          { "part": "Purchase and fitting", "gbp": 3000 },
          { "part": "Energy", "gbp": 13500 },
          { "part": "Servicing", "gbp": 1200 }
        ],
        "name": "part",
        "value": "gbp",
        "format": "currency:GBP"
      }
    }
  ],
  "verdict": {
    "lead": "Choose the heat pump if you get the grant and will stay at least 5 years",
    "body": "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels."
  },
  "sources": ["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"],
  "method": "A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms.",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The result of the comparison, as one plain sentence with the number in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `a` (required) | `string \| { name, detail? }` |  | Side A, shown on the left. |
| `b` (required) | `string \| { name, detail? }` |  | Side B, shown on the right. |
| `subject` | `"a" \| "b" \| "none"` | `"a"` | The side the piece is about. It takes the accent colour; the other stays grey. Match it with `highlight` in the charts. |
| `figures` | `{ label, a, b, format?, better?: "higher" \| "lower" }[]` |  | Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder. |
| `hero` | `Slot` |  | The exhibit that shows both sides at once. Default height 360px. |
| `heroText` | `string` |  | One or two sentences under the hero. |
| `pairs` | `{ title, text?, a: Slot, b: Slot }[]` |  | Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both. |
| `verdict` | `{ lead?, body?, label?, tone? }` |  | The closing recommendation, shown as a callout. |
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

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [callout](https://insightcharts.dev/llms/callout.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md)
- Used by: no molecule or template yet

## More examples

### Transport: a stacked hero, no pairs

```tsx
import { BarChart, ComparisonBrief } from "insightcharts";

<ComparisonBrief
  kicker="London to Edinburgh"
  title="Flying from London to Edinburgh is 35 minutes faster than the train, door to door"
  deck="The plane takes 275 minutes and the train 310. The flight itself lasts 80 minutes. The plane emits 140 kg of CO2 per passenger. The train emits 13 kg."
  a="Train"
  b="Plane"
  figures={[
    { label: "Door to door, minutes", a: 310, b: 275, better: "lower" },
    { label: "CO2 per passenger, kg", a: 13, b: 140, better: "lower" },
    {
      label: "Typical fare booked two weeks ahead",
      a: 78,
      b: 92,
      format: "currency:GBP",
      better: "lower",
    },
    { label: "Minutes you can spend working", a: 240, b: 50, better: "higher" },
  ]}
  hero={<BarChart
    data={[
      {
        mode: "Train",
        "Getting there": 25,
        "Waiting and boarding": 15,
        "In transit": 260,
        Onward: 10,
      },
      {
        mode: "Plane",
        "Getting there": 55,
        "Waiting and boarding": 95,
        "In transit": 80,
        Onward: 45,
      },
    ]}
    x="mode"
    y={["Getting there", "Waiting and boarding", "In transit", "Onward"]}
    stack
    orientation="horizontal"
    sort="none"
    format="{value} min"
    title="80 of the plane's 275 minutes are spent in the air"
    subtitle="Minutes per stage, city centre to city centre"
    source="Timetables and airport guidance, weekday morning departures"
  />}
  verdict={{
    lead: "Take the train unless you need the 35 minutes",
    body: "The train fare is £78 and the plane fare is £92. The train gives 240 minutes of working time. The plane gives 50.",
    tone: "positive",
  }}
  sources={["Operator timetables", "Government greenhouse gas conversion factors"]}
  note="Illustrative fares and times"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/comparison-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/comparison-brief.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
