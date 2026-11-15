# Before and after (`before-after`)

> Two states of one measure side by side, as figures or small charts, with the change between them stated in the middle.

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
| `before` (required) | `{ heading?, value?, label?, context?, format?, chart? }` |  | The first state: a figure, a chart slot, or both. |
| `after` (required) | `{ heading?, value?, label?, context?, format?, chart? }` |  | The second state. |
| `delta` | `number \| string` |  | The change stated between the two. Default: the relative change when both values are numbers. |
| `deltaLabel` | `string` |  | Words under the change, e.g. "in five years". |
| `deltaFormat` | `FormatSpec` | `signed percent` | Number format for a numeric `delta`. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the colour of the change. |
| `format` | `FormatSpec` | `"auto"` | Number format shared by both values. |
| `title` | `string` |  | The change stated plainly, with both values and the period. |
| `subtitle` | `string` |  | Measure and population. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to both states. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [delta](https://insightcharts.dev/llms/delta.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [sparkline](https://insightcharts.dev/llms/sparkline.md)
- Used by: no molecule or template yet

## More examples

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
