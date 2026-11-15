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
  theme="earth"
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
      title: "The January energy bill is £120 for the heat pump and £139 for the boiler",
      text: "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      a: <BarChart
        data={[
          { month: "Jan", cost: 120 },
          { month: "Feb", cost: 108 },
          { month: "Mar", cost: 86 },
          { month: "Apr", cost: 57 },
          { month: "May", cost: 34 },
          { month: "Jun", cost: 24 },
          { month: "Jul", cost: 21 },
          { month: "Aug", cost: 22 },
          { month: "Sep", cost: 32 },
          { month: "Oct", cost: 56 },
          { month: "Nov", cost: 83 },
          { month: "Dec", cost: 112 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        option={{ yAxis: { max: 140 } }}
      />,
      b: <BarChart
        data={[
          { month: "Jan", cost: 139 },
          { month: "Feb", cost: 124 },
          { month: "Mar", cost: 101 },
          { month: "Apr", cost: 69 },
          { month: "May", cost: 43 },
          { month: "Jun", cost: 33 },
          { month: "Jul", cost: 30 },
          { month: "Aug", cost: 31 },
          { month: "Sep", cost: 41 },
          { month: "Oct", cost: 65 },
          { month: "Nov", cost: 94 },
          { month: "Dec", cost: 130 },
        ]}
        x="month"
        y="cost"
        orientation="vertical"
        sort="none"
        labels={false}
        format="currency:GBP"
        height={200}
        highlight="none"
        option={{ yAxis: { max: 140 } }}
      />,
    },
    {
      title: "Cost over 15 years by part",
      text: "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
      a: <SegmentedBar
        data={[
          { part: "Purchase and fitting", gbp: 3500 },
          { part: "Energy", gbp: 11325 },
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
  "theme": "earth",
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
      "title": "The January energy bill is £120 for the heat pump and £139 for the boiler",
      "text": "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
      "a": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 120 },
          { "month": "Feb", "cost": 108 },
          { "month": "Mar", "cost": 86 },
          { "month": "Apr", "cost": 57 },
          { "month": "May", "cost": 34 },
          { "month": "Jun", "cost": 24 },
          { "month": "Jul", "cost": 21 },
          { "month": "Aug", "cost": 22 },
          { "month": "Sep", "cost": 32 },
          { "month": "Oct", "cost": 56 },
          { "month": "Nov", "cost": 83 },
          { "month": "Dec", "cost": 112 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "option": { "yAxis": { "max": 140 } }
      },
      "b": {
        "type": "bar-chart",
        "data": [
          { "month": "Jan", "cost": 139 },
          { "month": "Feb", "cost": 124 },
          { "month": "Mar", "cost": 101 },
          { "month": "Apr", "cost": 69 },
          { "month": "May", "cost": 43 },
          { "month": "Jun", "cost": 33 },
          { "month": "Jul", "cost": 30 },
          { "month": "Aug", "cost": 31 },
          { "month": "Sep", "cost": 41 },
          { "month": "Oct", "cost": 65 },
          { "month": "Nov", "cost": 94 },
          { "month": "Dec", "cost": 130 }
        ],
        "x": "month",
        "y": "cost",
        "orientation": "vertical",
        "sort": "none",
        "labels": false,
        "format": "currency:GBP",
        "height": 200,
        "highlight": "none",
        "option": { "yAxis": { "max": 140 } }
      }
    },
    {
      "title": "Cost over 15 years by part",
      "text": "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
      "a": {
        "type": "segmented-bar",
        "data": [
          { "part": "Purchase and fitting", "gbp": 3500 },
          { "part": "Energy", "gbp": 11325 },
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
| `theme` | `ThemeInput` |  | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece. |
| `frame` | `boolean` |  | Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [callout](https://insightcharts.dev/llms/callout.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md)
- Used by: no molecule or template yet

## More examples

### Transport: a stacked hero and a pair of waffles

```tsx
import { BarChart, ComparisonBrief, WaffleChart } from "insightcharts";

<ComparisonBrief
  theme="poster"
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
  pairs={[
    {
      title: "240 of the train's 310 minutes can be spent working",
      text: "On the plane it is 50 of 275 minutes. Each square is 1% of the journey.",
      a: <WaffleChart
        data={[{ part: "Working time", minutes: 240 }]}
        name="part"
        value="minutes"
        total={310}
        restLabel="Other time"
        format="{value} min"
        aspect={1.6}
      />,
      b: <WaffleChart
        data={[{ part: "Working time", minutes: 50 }]}
        name="part"
        value="minutes"
        total={275}
        restLabel="Other time"
        format="{value} min"
        aspect={1.6}
        highlight="none"
      />,
    },
  ]}
  verdict={{
    lead: "Take the train unless you need the 35 minutes",
    body: "The train fare is £78 and the plane fare is £92. The train gives 240 minutes of working time. The plane gives 50.",
    tone: "positive",
  }}
  sources={["Operator timetables", "Government greenhouse gas conversion factors"]}
  note="Illustrative fares and times"
/>
```

### Housing: buying against renting, two pairs

```tsx
import { BarChart, ComparisonBrief, LineChart, SegmentedBar } from "insightcharts";

<ComparisonBrief
  theme="ledger"
  kicker="Housing costs"
  title="Buying a £300,000 flat costs £56,100 less than renting it over 10 years"
  deck="The buyer pays out £218,000 and gains £107,300 in wealth. The renter pays out £185,700 and gains £18,900."
  a={{ name: "Buying", detail: "£30,000 deposit, 4% mortgage" }}
  b={{ name: "Renting", detail: "£1,350 a month, rising 2.5% a year" }}
  figures={[
    {
      label: "Net cost over 10 years",
      a: 110700,
      b: 166800,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Paid out over 10 years",
      a: 218000,
      b: 185700,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Wealth gained over 10 years",
      a: 107300,
      b: 18900,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "higher",
    },
    {
      label: "Monthly outgoing in year 1",
      a: 1725,
      b: 1385,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
    {
      label: "Cash needed at the start",
      a: 41000,
      b: 1950,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      better: "lower",
    },
  ]}
  hero={<LineChart
    data={[
      { year: "0", Buying: 0, Renting: 0 },
      { year: "1", Buying: 20970, Renting: 16680 },
      { year: "2", Buying: 30940, Renting: 33360 },
      { year: "3", Buying: 40910, Renting: 50040 },
      { year: "4", Buying: 50880, Renting: 66720 },
      { year: "5", Buying: 60850, Renting: 83400 },
      { year: "6", Buying: 70820, Renting: 100080 },
      { year: "7", Buying: 80790, Renting: 116760 },
      { year: "8", Buying: 90760, Renting: 133440 },
      { year: "9", Buying: 100730, Renting: 150120 },
      { year: "10", Buying: 110700, Renting: 166800 },
    ]}
    x="year"
    y={["Buying", "Renting"]}
    highlight="Buying"
    contextLabels
    zero
    format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
    title="Buying has a lower net cost than renting from year 2"
    subtitle="Cumulative net cost in pounds by years since moving in. Net cost is payments minus wealth gained"
  />}
  heroText="The buyer pays £11,000 in tax and fees in year 1. After 2 years buying has a net cost of £30,940 and renting £33,360."
  pairs={[
    {
      title: "Mortgage interest is £93,700 of the buyer's £218,000",
      text: "Payments over 10 years by part. Rent is £181,500 of the renter's £185,700.",
      a: <SegmentedBar
        data={[
          { part: "Mortgage interest", gbp: 93700 },
          { part: "Capital repaid", gbp: 77300 },
          { part: "Upkeep and insurance", gbp: 36000 },
          { part: "Tax and fees", gbp: 11000 },
        ]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
      b: <SegmentedBar
        data={[{ part: "Rent", gbp: 181500 }, { part: "Fees and insurance", gbp: 4200 }]}
        name="part"
        value="gbp"
        format="currency:GBP"
      />,
    },
    {
      title: "The buyer gains £107,300 in wealth and the renter £18,900",
      text: "Wealth gained over 10 years by source. Both charts use the same scale.",
      a: <BarChart
        data={[{ part: "Capital repaid", gbp: 77300 }, { part: "Rise in the flat's price", gbp: 30000 }]}
        x="part"
        y="gbp"
        sort="none"
        orientation="horizontal"
        format="currency:GBP"
        option={{ xAxis: { max: 90000 } }}
      />,
      b: <BarChart
        data={[{ part: "Growth on the invested deposit", gbp: 18900 }]}
        x="part"
        y="gbp"
        sort="none"
        orientation="horizontal"
        format="currency:GBP"
        highlight="none"
        option={{ xAxis: { max: 90000 } }}
      />,
    },
  ]}
  verdict={{
    lead: "Buy if you will stay 2 years or more",
    body: "The figures assume a 4% mortgage rate, a flat price that rises 1% a year and a 5% annual return on the renter's invested deposit.",
    tone: "positive",
  }}
  sources={["Lender mortgage calculator", "Letting agent listings collected by the author"]}
  method="A £270,000 repayment mortgage over 25 years at 4%. The renter invests the £30,000 deposit. Net cost is payments minus capital repaid and growth."
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/comparison-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/comparison-brief.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
