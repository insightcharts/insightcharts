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
| `variant` | `"plain" \| "filled" \| "tinted" \| "with-icon" \| "with-ring" \| "with-trend"` | `"plain"` | The display: `filled` (a solid ground in the tone with contrasting ink), `tinted` (a 10% wash), `with-icon` (needs `icon`: a tinted badge above the label), `with-ring` (needs `target` or `max`, or a share from 0 to 1: a progress ring beside the figure), `with-trend` (needs `series`: a line under the figure). A variant whose data is missing renders as `plain`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` | `"accent"` | Colour of the ground or graphic. A number picks from the theme's categorical palette, 0-based. |
| `icon` | `IconInput` |  | A built-in icon name or `path://...`, for `with-icon`. |
| `series` | `number[]` |  | Past values in time order, oldest first, ending with the current value, for `with-trend`. |
| `target` | `number` |  | The goal for `value`, for `with-ring`. |
| `max` | `number` |  | End of the ring's scale. Default: the target, or 1 for a share. |
| `theme` | `ThemeInput` |  | A theme name such as `"editorial"`, or token overrides. A named theme paints its own ground. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [before-after](https://insightcharts.dev/llms/before-after.md), [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [metric-breakdown](https://insightcharts.dev/llms/metric-breakdown.md), [poster](https://insightcharts.dev/llms/poster.md), [quote-figure](https://insightcharts.dev/llms/quote-figure.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [explainer](https://insightcharts.dev/llms/explainer.md), [social-card](https://insightcharts.dev/llms/social-card.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md)

## More examples

### Hero

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  size="hero"
  context="Up from 19% in 2010"
/>
```

### Hero with a trend, editorial

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  theme="editorial"
  size="hero"
  variant="with-trend"
  series={[0.19, 0.2, 0.205, 0.21, 0.214, 0.223, 0.233, 0.24, 0.252, 0.262, 0.28, 0.283, 0.297, 0.31, 0.317]}
  context="Annual share, 2010 to 2024"
/>
```

### Filled

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  variant="filled"
  context="Up from 19% in 2010"
  style={{ maxWidth: 360 }}
/>
```

### Tinted, positive tone

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  variant="tinted"
  tone="positive"
  context="Up from 19% in 2010"
  style={{ maxWidth: 360 }}
/>
```

### With an icon

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  variant="with-icon"
  icon="wind-turbine"
  context="Up from 19% in 2010"
  style={{ maxWidth: 360 }}
/>
```

### With a ring toward a target

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  variant="with-ring"
  target={0.6}
  max={1}
  context="The 2030 goal is 60%."
  style={{ maxWidth: 420 }}
/>
```

### Hero ring, ocean

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  theme="ocean"
  size="hero"
  variant="with-ring"
  value={0.083}
  format="percent"
  max={0.3}
  label="Ocean area inside marine protected areas, 2024"
  context="The 2030 target is 30%."
/>
```

### Hero filled, magenta, centred

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  theme="magenta"
  size="hero"
  variant="filled"
  align="center"
  value="597 GW"
  label="Solar capacity added worldwide in 2024"
  delta={0.33}
  deltaLabel="vs 2023"
/>
```

### Hero icon, forest

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  theme="forest"
  size="hero"
  variant="with-icon"
  icon="tree"
  value={12400}
  format="integer"
  label="Hectares of tree cover surveyed in 2024"
  context="6,820 hectares are on state land."
/>
```

### Trend, ledger

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  theme="ledger"
  variant="with-trend"
  value={589000}
  format="currency:USD"
  label="Monthly recurring revenue, December 2024"
  delta={0.43}
  deltaLabel="vs January"
  series={[412, 428, 431, 455, 470, 476, 498, 511, 524, 548, 566, 589]}
  style={{ maxWidth: 360 }}
/>
```

### Filled, categorical tone, noir

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  theme="noir"
  variant="filled"
  tone={1}
  value="4th"
  label="League position after 30 matches"
  context="61 points from 30 matches"
  style={{ maxWidth: 320 }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/big-number.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/big-number.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
