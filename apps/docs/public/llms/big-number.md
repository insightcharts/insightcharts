# Big number (`big-number`)

> A featured statistic with its label, change and the context that gives it meaning.

- Component: `BigNumber` (import from `insightcharts`)
- Spec type: `"big-number"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A single headline figure, or a row of three or four key numbers. Always give it context: a comparison, a denominator or a period.

## Avoid

Showing a number with no comparison; using a gauge or a one-slice donut for the same job.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/big-number
```

The file lands at `components/insightcharts/atoms/big-number.tsx`. `@insightcharts/big-number-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  context="Up from 19% in 2010"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "big-number",
  "value": 0.317,
  "format": "percent",
  "label": "Share of global electricity from renewables",
  "delta": 0.021,
  "deltaLabel": "vs 2023",
  "context": "Up from 19% in 2010"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number \| string` |  | The figure. Numbers are formatted with `format`. |
| `label` (required) | `string` |  | What it measures, sentence case. |
| `context` | `string` |  | The comparison, denominator or period that gives it meaning. |
| `delta` | `number \| string` |  | Change against a baseline. Numbers render as signed percentages (0.12 is +12%). |
| `deltaLabel` | `string` |  | What the delta is against, e.g. "vs last quarter". |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the delta colour. |
| `format` | `FormatSpec` | `"auto"` | Number format. |
| `size` | `"hero" \| "stat"` | `"stat"` | `hero` for the one number a piece leads with. |
| `align` | `"left" \| "center"` | `"left"` | Text alignment. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [before-after](https://insightcharts.dev/llms/before-after.md), [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [metric-breakdown](https://insightcharts.dev/llms/metric-breakdown.md), [poster](https://insightcharts.dev/llms/poster.md), [quote-figure](https://insightcharts.dev/llms/quote-figure.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [explainer](https://insightcharts.dev/llms/explainer.md), [social-card](https://insightcharts.dev/llms/social-card.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md)

## Links

- Registry item: https://insightcharts.dev/r/big-number.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/big-number.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
