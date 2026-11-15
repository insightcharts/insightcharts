# Before and after (`before-after`)

> Two states of one measure side by side, as figures, stat tiles of any variant or small charts, with the change between them stated in the middle.

- Component: `BeforeAfter` (import from `insightcharts`)
- Spec type: `"before-after"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A single measure at two moments or under two conditions: before and after a policy, control and treatment, last year and this. The change is computed from the two values unless you state it.

## Avoid

More than two states (use `line-chart` or `slope-chart`); many entities each with a before and after (use `dumbbell-chart` or `arrow-chart`); two unrelated figures (use `stat-row`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/before-after
```

The file lands at `components/insightcharts/molecules/before-after.tsx`. `@insightcharts/before-after-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  title="Solar module prices fell from $0.74 to $0.15 per watt between 2013 and 2023"
  subtitle="Average price of crystalline silicon modules, US dollars per watt"
  format={{ style: "currency", currency: "USD" }}
  before={{ heading: "2013", value: 0.74, label: "Per watt", context: "2013 average" }}
  after={{ heading: "2023", value: 0.15, label: "Per watt", context: "2023 average" }}
  deltaLabel="in ten years"
  upIsGood={false}
  source="IRENA Renewable Power Generation Costs 2023"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "before-after",
  "title": "Solar module prices fell from $0.74 to $0.15 per watt between 2013 and 2023",
  "subtitle": "Average price of crystalline silicon modules, US dollars per watt",
  "format": { "style": "currency", "currency": "USD" },
  "before": { "heading": "2013", "value": 0.74, "label": "Per watt", "context": "2013 average" },
  "after": { "heading": "2023", "value": 0.15, "label": "Per watt", "context": "2023 average" },
  "deltaLabel": "in ten years",
  "upIsGood": false,
  "source": "IRENA Renewable Power Generation Costs 2023",
  "note": "Rounded, approximate figures for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `before` (required) | `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }` |  | The first state: a figure, a chart slot, or both. The fields after `chart` apply when the states are tiles and are passed to `stat-tile`. |
| `after` (required) | `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }` |  | The second state. |
| `variant` | `"plain" \| "tiles" \| StatTileVariant` | `"plain"` | `plain`: open `big-number` figures under a ruled heading. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`progress`, `ring`, `sparkline`, `area`, `bars`, `unit`, `breakdown`, `rank`, `icon`, `filled`, `tinted`, `hero`...) draws both states as that tile; a state's own `variant` overrides it. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | Tiles only: the ground of both tiles. |
| `emphasis` | `"after" \| "none"` | `"after"` | Tiles only: `after` draws the first state in neutral ink and the second in the accent; `none` draws both in the accent. A state's own `tone` overrides it. |
| `layout` | `"auto" \| "side" \| "stacked"` | `"auto"` | Side by side from 520px, or force one arrangement. |
| `deltaVariant` | `"text" \| "pill" \| "solid"` | `"pill"` | How the change between the states is set: passed to `delta`. |
| `arrow` | `boolean` | `true` | The arrow between the states. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing and tile scale (`sm`, `md`, `lg`). |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `delta` | `number \| string` |  | The change stated between the two. Default: the relative change when both values are numbers. |
| `deltaLabel` | `string` |  | Words under the change, e.g. "in five years". |
| `deltaFormat` | `FormatSpec` | `signed percent` | Number format for a numeric `delta`. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the colour of the change. |
| `format` | `FormatSpec` | `"auto"` | Number format shared by both values. |
| `title` | `string` |  | The change stated plainly, with both values and the period. |
| `subtitle` | `string` |  | Measure and population. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A theme name such as `"editorial"`, or token overrides, passed on to both states. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md), [delta](https://insightcharts.dev/llms/delta.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [sparkline](https://insightcharts.dev/llms/sparkline.md)
- Used by: no molecule or template yet

## More examples

### Tiles, the second state in the accent

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  title="Monthly churn fell from 4.2% to 2.1% in 2024"
  variant="tiles"
  before={{
    heading: "January 2024",
    value: 0.042,
    format: "percent",
    label: "Monthly churn",
    context: "Before the onboarding redesign",
  }}
  after={{
    heading: "December 2024",
    value: 0.021,
    format: "percent",
    label: "Monthly churn",
    context: "Nine months after the redesign",
  }}
  delta="−2.1 pts"
  deltaLabel="in eleven months"
  upIsGood={false}
  note="Illustrative data"
/>
```

### Progress toward the same target, science

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="science"
  title="Measles vaccination coverage rose from 86% to 91% between 2021 and 2024"
  subtitle="Children receiving a first dose, against the 95% WHO target"
  variant="progress"
  before={{ heading: "2021", value: 0.86, format: "percent", label: "Coverage", target: 0.95, max: 1 }}
  after={{ heading: "2024", value: 0.91, format: "percent", label: "Coverage", target: 0.95, max: 1 }}
  delta="+5 pts"
  deltaLabel="in three years"
  note="Illustrative data"
/>
```

### Rings, forest

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="forest"
  title="Native woodland replanted rose from 620 to 1,240 hectares in 2024"
  variant="ring"
  before={{
    heading: "End of 2023",
    value: 620,
    format: "{value} ha",
    label: "Replanted",
    max: 2000,
    context: "Goal: 2,000 hectares",
  }}
  after={{
    heading: "End of 2024",
    value: 1240,
    format: "{value} ha",
    label: "Replanted",
    max: 2000,
    context: "Goal: 2,000 hectares",
  }}
  deltaLabel="in one year"
  deltaVariant="solid"
  note="Illustrative data"
/>
```

### Unit counts, ocean

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="ocean"
  title="Offshore wind farms connected rose from 31 to 45 in 2024"
  variant="unit"
  before={{ heading: "2023", value: 31, label: "Wind farms connected", icon: "wind-turbine", max: 60 }}
  after={{ heading: "2024", value: 45, label: "Wind farms connected", icon: "wind-turbine", max: 60 }}
  deltaLabel="60 are planned by 2026"
  note="Illustrative data"
/>
```

### Filled tiles, stacked, noir

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="noir"
  variant="filled"
  layout="stacked"
  density="roomy"
  before={{
    heading: "Last season, after 30 matches",
    value: "51 points",
    label: "League points",
    context: "8th of 20",
  }}
  after={{
    heading: "This season, after 30 matches",
    value: "61 points",
    label: "League points",
    context: "4th of 20",
  }}
  delta={0.196}
  deltaLabel="more points"
  deltaVariant="solid"
  note="Illustrative data"
  style={{ maxWidth: 420 }}
/>
```

### Trends within each period, ledger

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="ledger"
  title="Recurring revenue rose from $412,000 to $589,000 in 2024"
  variant="sparkline"
  emphasis="none"
  before={{
    heading: "First half",
    value: 476000,
    format: "currency:USD",
    label: "Recurring revenue, June",
    series: [412, 428, 431, 455, 470, 476],
    tone: 2,
  }}
  after={{
    heading: "Second half",
    value: 589000,
    format: "currency:USD",
    label: "Recurring revenue, December",
    series: [498, 511, 524, 548, 566, 589],
  }}
  deltaLabel="June to December"
  note="Illustrative data"
/>
```

### Breakdown of each state, earth

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="earth"
  title="The recycled share of household waste rose from 39% to 48% between 2019 and 2024"
  variant="breakdown"
  emphasis="none"
  before={{
    heading: "2019",
    value: 104000,
    format: "{value} t",
    label: "Household waste collected",
    parts: [
      { label: "Recycled", value: 40600 },
      { label: "Composted", value: 12500 },
      { label: "Incinerated", value: 27000 },
      { label: "Landfilled", value: 23900 },
    ],
  }}
  after={{
    heading: "2024",
    value: 100400,
    format: "{value} t",
    label: "Household waste collected",
    parts: [
      { label: "Recycled", value: 48200 },
      { label: "Composted", value: 17100 },
      { label: "Incinerated", value: 24300 },
      { label: "Landfilled", value: 10800 },
    ],
  }}
  upIsGood={false}
  deltaLabel="total waste"
  note="Illustrative data"
/>
```

### Dense, text change without an arrow, mono

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="mono"
  variant="tiles"
  density="dense"
  deltaVariant="text"
  arrow={false}
  before={{
    heading: "Control",
    value: 0.031,
    format: "percent",
    label: "Checkout conversion",
    context: "12,400 sessions",
  }}
  after={{
    heading: "New checkout",
    value: 0.038,
    format: "percent",
    label: "Checkout conversion",
    context: "12,380 sessions",
  }}
  delta="+0.7 pts"
  deltaLabel="over 14 days"
  note="Illustrative data"
  layout="side"
  style={{ maxWidth: 640 }}
/>
```

### Roomy plain figures, editorial

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="editorial"
  title="The unemployment rate rose from 3.9% to 4.3% in 2024"
  density="roomy"
  deltaVariant="solid"
  before={{ heading: "January 2024", value: 0.039, format: "percent", label: "Unemployment rate" }}
  after={{ heading: "December 2024", value: 0.043, format: "percent", label: "Unemployment rate" }}
  delta="+0.4 pts"
  deltaLabel="in eleven months"
  upIsGood={false}
  note="Illustrative data"
/>
```

### Two charts, change stated in words

```tsx
import { BarChart, BeforeAfter } from "insightcharts";

<BeforeAfter
  title="The median midday price fell from €44 to €12 per MWh between summer 2019 and summer 2024"
  subtitle="Median day-ahead price by hour, euros per MWh, same scale"
  before={{
    heading: "Summer 2019",
    chart: <BarChart
      data={[
        { hour: "00:00", price: 38 },
        { hour: "03:00", price: 34 },
        { hour: "06:00", price: 41 },
        { hour: "09:00", price: 47 },
        { hour: "12:00", price: 44 },
        { hour: "15:00", price: 43 },
        { hour: "18:00", price: 52 },
        { hour: "21:00", price: 45 },
      ]}
      x="hour"
      y="price"
      orientation="vertical"
      sort="none"
      height={150}
      labels={false}
      option={{ yAxis: { max: 100 } }}
    />,
  }}
  after={{
    heading: "Summer 2024",
    chart: <BarChart
      data={[
        { hour: "00:00", price: 71 },
        { hour: "03:00", price: 64 },
        { hour: "06:00", price: 69 },
        { hour: "09:00", price: 48 },
        { hour: "12:00", price: 12 },
        { hour: "15:00", price: 21 },
        { hour: "18:00", price: 96 },
        { hour: "21:00", price: 84 },
      ]}
      x="hour"
      y="price"
      orientation="vertical"
      sort="none"
      height={150}
      labels={false}
      option={{ yAxis: { max: 100 } }}
    />,
  }}
  delta="−€32"
  deltaLabel="at midday"
  upIsGood={false}
  note="Illustrative data"
/>
```

### Figures with sparklines

```tsx
import { BeforeAfter, Sparkline } from "insightcharts";

<BeforeAfter
  before={{
    heading: "Before the redesign",
    value: 0.042,
    format: "percent",
    label: "Monthly churn",
    chart: <Sparkline
      data={[{ v: 4.4 }, { v: 4.1 }, { v: 4.3 }, { v: 4.2 }, { v: 4.3 }, { v: 4.2 }]}
      y="v"
    />,
  }}
  after={{
    heading: "After",
    value: 0.021,
    format: "percent",
    label: "Monthly churn",
    chart: <Sparkline
      data={[{ v: 3.6 }, { v: 3.1 }, { v: 2.6 }, { v: 2.4 }, { v: 2.2 }, { v: 2.1 }]}
      y="v"
    />,
  }}
  upIsGood={false}
  deltaLabel="after six months"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/before-after.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/before-after.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
