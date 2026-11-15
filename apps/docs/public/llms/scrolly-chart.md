# Scrolly chart (`scrolly-chart`)

> A scroll-driven story from JSON: one base chart spec and a list of steps, each with narration and a patch of chart props applied while that step is active.

- Component: `ScrollyChart` (import from `insightcharts`)
- Spec type: `"scrolly-chart"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Walking a reader through one chart in stages: show everything, highlight the subject, change the measure, add the annotation. Make ONE change per step (the highlight, the data or the encoding) so the reader can see what changed.

## Avoid

Steps that change several things at once, or that swap to an unrelated chart (start a new `section` instead). More than about seven steps. A fact that one view can show (use `chart-callout`). In documents that will be printed or embedded in a short frame, set `scrollMode: "steps"`.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scrolly-chart
```

The file lands at `components/insightcharts/molecules/scrolly-chart.tsx`. `@insightcharts/scrolly-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, ScrollyChart, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<ScrollyChart
  theme="earth"
  chart={{
    type: "bar-chart",
    data: [
      { source: "Coal", y2015: 24.6, y2024: 9.8 },
      { source: "Gas", y2015: 15.8, y2024: 15.7 },
      { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
      { source: "Wind", y2015: 9.2, y2024: 17.4 },
      { source: "Hydro", y2015: 12, y2024: 13.2 },
      { source: "Solar", y2015: 2.9, y2024: 11.1 },
    ],
    x: "source",
    y: "y2015",
    sort: "none",
    orientation: "horizontal",
    format: "{value}%",
    height: 300,
    title: "EU electricity generation by source, 2015",
    subtitle: "Share of EU electricity generation, %",
    source: "Ember, European Electricity Review 2025",
    note: "Rounded, approximate figures for illustration",
  }}
  steps={[
    {
      id: "baseline",
      label: "2015",
      content: "In 2015 **nuclear and coal** together supplied 51.7% of the EU's electricity.",
    },
    {
      id: "coal",
      content: "Coal supplied 24.6% in 2015. Only nuclear supplied more.",
      highlight: "Coal",
    },
    {
      id: "today",
      label: "2024",
      content: "In 2024 coal supplied 9.8%.",
      highlight: "Coal",
      y: "y2024",
      title: "EU electricity generation by source, 2024",
    },
    {
      id: "solar",
      content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015.",
      highlight: "Solar",
      y: "y2024",
      title: "Solar supplied 11.1% of EU electricity in 2024",
    },
  ]}
  stepHeight="70vh"
  stickyTop={16}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "scrolly-chart",
  "theme": "earth",
  "chart": {
    "type": "bar-chart",
    "data": [
      { "source": "Coal", "y2015": 24.6, "y2024": 9.8 },
      { "source": "Gas", "y2015": 15.8, "y2024": 15.7 },
      { "source": "Nuclear", "y2015": 27.1, "y2024": 23.7 },
      { "source": "Wind", "y2015": 9.2, "y2024": 17.4 },
      { "source": "Hydro", "y2015": 12, "y2024": 13.2 },
      { "source": "Solar", "y2015": 2.9, "y2024": 11.1 }
    ],
    "x": "source",
    "y": "y2015",
    "sort": "none",
    "orientation": "horizontal",
    "format": "{value}%",
    "height": 300,
    "title": "EU electricity generation by source, 2015",
    "subtitle": "Share of EU electricity generation, %",
    "source": "Ember, European Electricity Review 2025",
    "note": "Rounded, approximate figures for illustration"
  },
  "steps": [
    {
      "id": "baseline",
      "label": "2015",
      "content": "In 2015 **nuclear and coal** together supplied 51.7% of the EU's electricity."
    },
    {
      "id": "coal",
      "content": "Coal supplied 24.6% in 2015. Only nuclear supplied more.",
      "highlight": "Coal"
    },
    {
      "id": "today",
      "label": "2024",
      "content": "In 2024 coal supplied 9.8%.",
      "highlight": "Coal",
      "y": "y2024",
      "title": "EU electricity generation by source, 2024"
    },
    {
      "id": "solar",
      "content": "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015.",
      "highlight": "Solar",
      "y": "y2024",
      "title": "Solar supplied 11.1% of EU electricity in 2024"
    }
  ],
  "stepHeight": "70vh",
  "stickyTop": 16
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` (required) | `InsightSpec` |  | The base chart spec: `{ type, data, x, y, ... }`. Give it a `title`; steps may replace it. |
| `steps` (required) | `{ content, id?, label?, ...chart props }[]` |  | The steps in order. `content` is a short paragraph that says plainly what the chart now shows (`**bold**` works). Every other key is a chart prop merged over `chart` for that step: `highlight`, `transform`, `annotations`, `x`, `y`, `title`… Use `null` to remove a base prop. Change one thing per step. |
| `cumulative` | `boolean` | `false` | Each step's patch builds on the previous steps instead of on the base spec alone. |
| `scrollMode` | `"auto" \| "scroll" \| "swipe" \| "steps"` | `"auto"` | `scroll` pins the chart while steps scroll past; `swipe` makes steps swipeable cards; `steps` shows previous/next buttons; `auto` uses scroll, or swipe on narrow touch screens. (Named `scrollMode` because `mode` is the colour mode.) |
| `side` | `"left" \| "right"` | `"left"` | Side of the text column in scroll mode. Narrow containers overlay the text on the chart. |
| `stickyTop` | `number \| string` | `0` | Offset from the top of the viewport at which the chart pins; set it to the height of a fixed header. |
| `stepHeight` | `string` | `"80vh"` | Scroll distance per step, as a CSS length. |
| `onStepChange` | `(index) => void` |  | Called when the active step changes. |
| `title` | `string` |  | Heading above the whole story. |
| `subtitle` | `string` |  | Line under the heading. |
| `source` | `string` |  | Shown after the last step as "Source: ...". Prefer the chart's own `source`, which stays visible. |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and the step cards. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [prose](https://insightcharts.dev/llms/prose.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [line-chart](https://insightcharts.dev/llms/line-chart.md)
- Used by: [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Steps mode (buttons), cumulative patches, noir theme

```tsx
import { BarChart, ScrollyChart, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<ScrollyChart
  theme="noir"
  scrollMode="steps"
  cumulative
  chart={{
    type: "bar-chart",
    data: [
      { source: "Coal", y2015: 24.6, y2024: 9.8 },
      { source: "Gas", y2015: 15.8, y2024: 15.7 },
      { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
      { source: "Wind", y2015: 9.2, y2024: 17.4 },
      { source: "Hydro", y2015: 12, y2024: 13.2 },
      { source: "Solar", y2015: 2.9, y2024: 11.1 },
    ],
    x: "source",
    y: "y2015",
    sort: "none",
    orientation: "horizontal",
    format: "{value}%",
    height: 300,
    title: "EU electricity generation by source, 2015",
    subtitle: "Share of EU electricity generation, %",
    source: "Ember, European Electricity Review 2025",
    note: "Rounded, approximate figures for illustration",
  }}
  steps={[
    { content: "The chart shows each source's share in 2015." },
    { content: "**Coal** is highlighted. It supplied 24.6% in 2015.", highlight: "Coal" },
    {
      content: "The chart now shows 2024. Coal is still highlighted because the patches accumulate.",
      y: "y2024",
      title: "EU electricity generation by source, 2024",
    },
    {
      content: "The highlight is removed. The sources are sorted by their 2024 share.",
      highlight: null,
      sort: "desc",
    },
  ]}
/>
```

### Swipe mode

```tsx
import { BarChart, ScrollyChart, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<ScrollyChart
  scrollMode="swipe"
  chart={{
    type: "bar-chart",
    data: [
      { source: "Coal", y2015: 24.6, y2024: 9.8 },
      { source: "Gas", y2015: 15.8, y2024: 15.7 },
      { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
      { source: "Wind", y2015: 9.2, y2024: 17.4 },
      { source: "Hydro", y2015: 12, y2024: 13.2 },
      { source: "Solar", y2015: 2.9, y2024: 11.1 },
    ],
    x: "source",
    y: "y2015",
    sort: "none",
    orientation: "horizontal",
    format: "{value}%",
    height: 300,
    title: "EU electricity generation by source, 2015",
    subtitle: "Share of EU electricity generation, %",
    source: "Ember, European Electricity Review 2025",
    note: "Rounded, approximate figures for illustration",
  }}
  steps={[
    {
      id: "baseline",
      label: "2015",
      content: "In 2015 **nuclear and coal** together supplied 51.7% of the EU's electricity.",
    },
    {
      id: "coal",
      content: "Coal supplied 24.6% in 2015. Only nuclear supplied more.",
      highlight: "Coal",
    },
    {
      id: "today",
      label: "2024",
      content: "In 2024 coal supplied 9.8%.",
      highlight: "Coal",
      y: "y2024",
      title: "EU electricity generation by source, 2024",
    },
    {
      id: "solar",
      content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015.",
      highlight: "Solar",
      y: "y2024",
      title: "Solar supplied 11.1% of EU electricity in 2024",
    },
  ]}
/>
```

### Three lines, one highlighted per step, ledger theme

```tsx
import { LineChart, ScrollyChart, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ LineChart });

<ScrollyChart
  theme="ledger"
  scrollMode="steps"
  title="The average two-year fixed mortgage rate was 5.4% in the last quarter of 2024"
  chart={{
    type: "line-chart",
    data: [
      { quarter: "Q1 2022", "Bank rate": 0.5, "Two-year fixed": 2.2, "Five-year fixed": 2.4 },
      { quarter: "Q2 2022", "Bank rate": 1, "Two-year fixed": 3, "Five-year fixed": 3.1 },
      { quarter: "Q3 2022", "Bank rate": 1.75, "Two-year fixed": 4.2, "Five-year fixed": 4.1 },
      { quarter: "Q4 2022", "Bank rate": 3, "Two-year fixed": 6, "Five-year fixed": 5.7 },
      { quarter: "Q1 2023", "Bank rate": 4, "Two-year fixed": 5.4, "Five-year fixed": 5 },
      { quarter: "Q2 2023", "Bank rate": 4.75, "Two-year fixed": 5.8, "Five-year fixed": 5.3 },
      { quarter: "Q3 2023", "Bank rate": 5.25, "Two-year fixed": 6.6, "Five-year fixed": 6.1 },
      { quarter: "Q4 2023", "Bank rate": 5.25, "Two-year fixed": 6, "Five-year fixed": 5.6 },
      { quarter: "Q1 2024", "Bank rate": 5.25, "Two-year fixed": 5.8, "Five-year fixed": 5.3 },
      { quarter: "Q2 2024", "Bank rate": 5.25, "Two-year fixed": 5.9, "Five-year fixed": 5.5 },
      { quarter: "Q3 2024", "Bank rate": 5, "Two-year fixed": 5.5, "Five-year fixed": 5.2 },
      { quarter: "Q4 2024", "Bank rate": 4.75, "Two-year fixed": 5.4, "Five-year fixed": 5.1 },
    ],
    x: "quarter",
    y: ["Bank rate", "Two-year fixed", "Five-year fixed"],
    format: "{value}%",
    zero: true,
    height: 300,
    subtitle: "Bank rate and average fixed mortgage rates, quarterly, 2022 to 2024",
    note: "Illustrative data",
  }}
  steps={[
    {
      label: "All three rates",
      content: "The chart shows the central bank rate and the average rates of two-year and five-year fixed mortgages.",
    },
    {
      label: "Bank rate",
      content: "The **bank rate** rose from 0.5% in the first quarter of 2022 to 5.25% in the third quarter of 2023.",
      highlight: "Bank rate",
      contextLabels: true,
    },
    {
      label: "Two-year fixed",
      content: "The average **two-year fixed rate** was 6.6% in the third quarter of 2023. It was 5.4% in the last quarter of 2024.",
      highlight: "Two-year fixed",
      contextLabels: true,
    },
    {
      label: "Five-year fixed",
      content: "The average **five-year fixed rate** was 5.1% in the last quarter of 2024. The two-year rate was 0.3 points higher.",
      highlight: "Five-year fixed",
      contextLabels: true,
    },
  ]}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/scrolly-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/scrolly-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
