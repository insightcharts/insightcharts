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
  theme="ledger"
  chart={<LineChart
    data={[
      { "2023": 4.4, "2024": 4.2, month: "Jan" },
      { "2023": 4.3, "2024": 4.3, month: "Feb" },
      { "2023": 4.4, "2024": 4.1, month: "Mar" },
      { "2023": 4.2, "2024": 3.6, month: "Apr" },
      { "2023": 4.3, "2024": 3.1, month: "May" },
      { "2023": 4.1, "2024": 2.9, month: "Jun" },
      { "2023": 4.2, "2024": 2.6, month: "Jul" },
      { "2023": 4.3, "2024": 2.4, month: "Aug" },
      { "2023": 4.1, "2024": 2.3, month: "Sep" },
      { "2023": 4.2, "2024": 2.2, month: "Oct" },
      { "2023": 4.3, "2024": 2.1, month: "Nov" },
      { "2023": 4.2, "2024": 2.1, month: "Dec" },
    ]}
    x="month"
    y={["2024", "2023"]}
    highlight="2024"
    contextLabels
    format="{value}%"
    zero
    height={280}
    title="Monthly churn fell from 4.2% to 2.1% in 2024"
    subtitle="Monthly customer churn, 2024 and 2023"
    source="Internal analytics"
    note="Illustrative data"
    annotations={[{ type: "line", axis: "x", value: "Mar", label: "New onboarding" }]}
  />}
  label="Takeaway"
  lead="Churn fell 2 points after March"
  body="Churn was 4.1% in March 2024, when the new onboarding launched. It was 2.1% in December 2024. It was 4.2% in December 2023."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "chart-callout",
  "theme": "ledger",
  "chart": {
    "type": "line-chart",
    "data": [
      { "2023": 4.4, "2024": 4.2, "month": "Jan" },
      { "2023": 4.3, "2024": 4.3, "month": "Feb" },
      { "2023": 4.4, "2024": 4.1, "month": "Mar" },
      { "2023": 4.2, "2024": 3.6, "month": "Apr" },
      { "2023": 4.3, "2024": 3.1, "month": "May" },
      { "2023": 4.1, "2024": 2.9, "month": "Jun" },
      { "2023": 4.2, "2024": 2.6, "month": "Jul" },
      { "2023": 4.3, "2024": 2.4, "month": "Aug" },
      { "2023": 4.1, "2024": 2.3, "month": "Sep" },
      { "2023": 4.2, "2024": 2.2, "month": "Oct" },
      { "2023": 4.3, "2024": 2.1, "month": "Nov" },
      { "2023": 4.2, "2024": 2.1, "month": "Dec" }
    ],
    "x": "month",
    "y": ["2024", "2023"],
    "highlight": "2024",
    "contextLabels": true,
    "format": "{value}%",
    "zero": true,
    "height": 280,
    "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
    "subtitle": "Monthly customer churn, 2024 and 2023",
    "source": "Internal analytics",
    "note": "Illustrative data",
    "annotations": [{ "type": "line", "axis": "x", "value": "Mar", "label": "New onboarding" }]
  },
  "label": "Takeaway",
  "lead": "Churn fell 2 points after March",
  "body": "Churn was 4.1% in March 2024, when the new onboarding launched. It was 2.1% in December 2024. It was 4.2% in December 2023."
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
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and callout. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [callout](https://insightcharts.dev/llms/callout.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md), [slope-chart](https://insightcharts.dev/llms/slope-chart.md)
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
    highlight="Mar"
    height={260}
    title="Monthly churn fell from 4.1% in March to 2.9% in June 2024"
    subtitle="Monthly customer churn, January to June 2024"
  />}
/>
```

### Positive, aligned to the top, science theme

```tsx
import { ChartCallout, DumbbellChart } from "insightcharts";

<ChartCallout
  theme="science"
  tone="positive"
  align="start"
  label="Result"
  lead="Kraków's annual PM2.5 fell from 31 to 19 µg/m³"
  body="All five cities recorded a lower annual mean in 2023 than in 2015. All five were above the WHO guideline of 5 µg/m³ in 2023."
  chart={<DumbbellChart
    data={[
      { city: "Kraków", y2015: 31, y2023: 19 },
      { city: "Milan", y2015: 29, y2023: 21 },
      { city: "Sofia", y2015: 26, y2023: 17 },
      { city: "Prague", y2015: 19, y2023: 13 },
      { city: "Vienna", y2015: 16, y2023: 11 },
    ]}
    category="city"
    from="y2015"
    to="y2023"
    names={{ y2015: "2015", y2023: "2023" }}
    format="{value}"
    sort="gap"
    highlight="Kraków"
    title="Annual PM2.5 fell in all five cities between 2015 and 2023"
    subtitle="Annual mean PM2.5 concentration, µg/m³, 2015 and 2023"
    source="European Environment Agency"
    note="Illustrative data"
  />}
/>
```

### Outlined context note, noir theme

```tsx
import { ChartCallout, SlopeChart } from "insightcharts";

<ChartCallout
  theme="noir"
  variant="outline"
  tone="neutral"
  label="Not shown"
  lead="Streaming revenue was $14.9bn in 2024"
  body="Streaming is left off the chart. It was 84% of recorded music revenue in 2024."
  chart={<SlopeChart
    data={[
      { format: "Vinyl", y2014: 0.3, y2024: 1.4 },
      { format: "CD", y2014: 1.9, y2024: 0.5 },
      { format: "Downloads", y2014: 2.6, y2024: 0.3 },
    ]}
    series="format"
    y={["y2014", "y2024"]}
    names={{ y2014: "2014", y2024: "2024" }}
    highlight="Vinyl"
    format="${value}bn"
    height={300}
    title="Vinyl revenue rose from $0.3bn to $1.4bn between 2014 and 2024"
    subtitle="Recorded music revenue by physical and download format, US, 2014 and 2024"
    note="Illustrative data"
  />}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/chart-callout.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/chart-callout.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
