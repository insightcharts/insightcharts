# Chart with callout (`chart-callout`)

> A chart with a callout beside it that states the main fact. In narrow containers the callout goes underneath.

- Component: `ChartCallout` (import from `insightcharts`)
- Spec type: `"chart-callout"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Whenever a chart needs its meaning stated in words next to it: the standard chart-plus-interpretation unit of a report. The chart's title states the main fact with its number. The callout adds a second fact, a cause or a caveat in plain words.

## Avoid

Repeating the chart title in the callout; long narration (put `prose` before the chart instead); a chart that is already a small tile (the callout would outweigh it).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/chart-callout
```

The file lands at `components/insightcharts/molecules/chart-callout.tsx`. `@insightcharts/chart-callout-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ChartCallout, LineChart } from "insightcharts";

<ChartCallout
  chart={<LineChart
    data={[
      { month: "2024-01-01", rate: 4.2 },
      { month: "2024-02-01", rate: 4.3 },
      { month: "2024-03-01", rate: 4.1 },
      { month: "2024-04-01", rate: 3.6 },
      { month: "2024-05-01", rate: 3.1 },
      { month: "2024-06-01", rate: 2.9 },
      { month: "2024-07-01", rate: 2.6 },
      { month: "2024-08-01", rate: 2.4 },
      { month: "2024-09-01", rate: 2.3 },
      { month: "2024-10-01", rate: 2.2 },
      { month: "2024-11-01", rate: 2.1 },
      { month: "2024-12-01", rate: 2.1 },
    ]}
    x="month"
    y="rate"
    format="{value}%"
    zero
    height={280}
    title="Monthly churn fell from 4.2% to 2.1% in 2024"
    subtitle="Monthly customer churn, 2024"
    source="Internal analytics"
    note="Illustrative data"
    annotations={[{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }]}
  />}
  label="Takeaway"
  lead="Churn fell 2 points after March"
  body="Churn was 4.1% in March, when the new onboarding launched. It fell every month from April to November. It was 2.1% in December."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "chart-callout",
  "chart": {
    "type": "line-chart",
    "data": [
      { "month": "2024-01-01", "rate": 4.2 },
      { "month": "2024-02-01", "rate": 4.3 },
      { "month": "2024-03-01", "rate": 4.1 },
      { "month": "2024-04-01", "rate": 3.6 },
      { "month": "2024-05-01", "rate": 3.1 },
      { "month": "2024-06-01", "rate": 2.9 },
      { "month": "2024-07-01", "rate": 2.6 },
      { "month": "2024-08-01", "rate": 2.4 },
      { "month": "2024-09-01", "rate": 2.3 },
      { "month": "2024-10-01", "rate": 2.2 },
      { "month": "2024-11-01", "rate": 2.1 },
      { "month": "2024-12-01", "rate": 2.1 }
    ],
    "x": "month",
    "y": "rate",
    "format": "{value}%",
    "zero": true,
    "height": 280,
    "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
    "subtitle": "Monthly customer churn, 2024",
    "source": "Internal analytics",
    "note": "Illustrative data",
    "annotations": [{ "type": "line", "axis": "x", "value": "2024-03-01", "label": "New onboarding" }]
  },
  "label": "Takeaway",
  "lead": "Churn fell 2 points after March",
  "body": "Churn was 4.1% in March, when the new onboarding launched. It fell every month from April to November. It was 2.1% in December."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` (required) | `Slot` |  | The chart: a spec or a React element. |
| `lead` | `string` |  | The main fact in a few words, with its number. Shown in bold. |
| `body` | `string` |  | One or two plain sentences that say what the fact means. |
| `tone` | `"neutral" \| "positive" \| "negative" \| "accent"` | `"accent"` | Sets the callout's icon and tint together. |
| `label` | `string` |  | Small label above the lead, e.g. "Takeaway" or "Caveat". |
| `side` | `"left" \| "right"` | `"right"` | Side of the chart the callout sits on. Under 640px it always goes underneath. |
| `variant` | `"plain" \| "soft" \| "outline"` | `"plain"` | `plain` separates the callout with a hairline; the others box it. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Vertical position of the callout beside the chart. |
| `children` | `ReactNode` |  | JSX alternative to `chart`. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the chart and callout. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [callout](https://insightcharts.dev/llms/callout.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md)
- Used by: [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Caveat on the left, boxed

```tsx
import { BarChart, ChartCallout } from "insightcharts";

<ChartCallout
  side="left"
  variant="soft"
  tone="negative"
  label="Caveat"
  lead="The new onboarding launched on 11 March"
  body="The March figure includes customers who joined before the launch. April is the first full month on the new onboarding."
  chart={<BarChart
    data={[
      { month: "Jan", rate: 4.2 },
      { month: "Feb", rate: 4.3 },
      { month: "Mar", rate: 4.1 },
      { month: "Apr", rate: 3.6 },
      { month: "May", rate: 3.1 },
      { month: "Jun", rate: 2.9 },
    ]}
    x="month"
    sort="none"
    y="rate"
    format="{value}%"
    orientation="vertical"
    height={260}
    title="Monthly churn fell from 4.1% in March to 2.9% in June 2024"
    subtitle="Monthly customer churn, January to June 2024"
  />}
/>
```

### Positive, aligned to the top

```tsx
import { ChartCallout, LineChart } from "insightcharts";

<ChartCallout
  tone="positive"
  align="start"
  lead="Churn stayed below 2.5% from August"
  body="Monthly churn was between 2.1% and 2.4% from August to December 2024."
  chart={<LineChart
    data={[
      { month: "2024-01-01", rate: 4.2 },
      { month: "2024-02-01", rate: 4.3 },
      { month: "2024-03-01", rate: 4.1 },
      { month: "2024-04-01", rate: 3.6 },
      { month: "2024-05-01", rate: 3.1 },
      { month: "2024-06-01", rate: 2.9 },
      { month: "2024-07-01", rate: 2.6 },
      { month: "2024-08-01", rate: 2.4 },
      { month: "2024-09-01", rate: 2.3 },
      { month: "2024-10-01", rate: 2.2 },
      { month: "2024-11-01", rate: 2.1 },
      { month: "2024-12-01", rate: 2.1 },
    ]}
    x="month"
    y="rate"
    format="{value}%"
    zero
    height={240}
    title="Monthly churn was 2.1% in December 2024"
    subtitle="Monthly customer churn, 2024"
  />}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/chart-callout.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/chart-callout.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
