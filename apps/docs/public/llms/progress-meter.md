# Progress meter (`progress-meter`)

> A labelled horizontal meter of one value against a maximum or target, with the target marked and the value printed.

- Component: `ProgressMeter` (import from `insightcharts`)
- Spec type: `"progress-meter"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Progress toward a goal, a quota or a capacity: funds raised, budget spent, share of a target reached. Stack several with `size: "sm"` to compare progress across a few items.

## Avoid

Comparing more than a handful of items (use `bar-chart`), anything without a meaningful end point (use `big-number`), or a gauge dial.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/progress-meter
```

The file lands at `components/insightcharts/atoms/progress-meter.tsx`. `@insightcharts/progress-meter-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ProgressMeter } from "insightcharts";

<ProgressMeter
  label="Homes with a heat pump or district heating"
  value={0.46}
  max={1}
  showMax={false}
  target={0.7}
  targetLabel="2030 target"
  context="Up from 31% in 2020. At the current rate the target is reached in 2033."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "progress-meter",
  "label": "Homes with a heat pump or district heating",
  "value": 0.46,
  "max": 1,
  "showMax": false,
  "target": 0.7,
  "targetLabel": "2030 target",
  "context": "Up from 31% in 2020. At the current rate the target is reached in 2033."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number` |  | The current value. |
| `label` (required) | `string` |  | What is measured, sentence case. |
| `max` | `number` |  | End of the track. Defaults to the target, or 1 with no target. |
| `min` | `number` | `0` | Start of the track. |
| `target` | `number` |  | A goal or threshold, drawn as a tick and labelled. |
| `targetLabel` | `string` | `"Target"` | Name for the target tick. |
| `showMax` | `boolean` |  | Print "of {max}" after the value. Default: only when `max` is given. |
| `context` | `string` |  | A line under the meter that gives the number meaning. |
| `format` | `FormatSpec` |  | Number format. Defaults to `"percent"` when the track ends at 1 or less, otherwise `"auto"`. |
| `tone` | `"accent" \| "positive" \| "negative" \| "neutral"` | `"accent"` | Fill colour by meaning. |
| `size` | `"sm" \| "md"` | `"md"` | `sm` for dense stacks. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [report-page](https://insightcharts.dev/llms/report-page.md)

## More examples

### Against a maximum

```tsx
import { ProgressMeter } from "insightcharts";

<ProgressMeter
  label="Annual carbon budget used"
  value={318}
  max={400}
  format="{value} Mt"
  tone="negative"
  context="With ten weeks of the year left."
/>
```

### Target passed

```tsx
import { ProgressMeter } from "insightcharts";

<ProgressMeter
  label="Fundraising round"
  value={2340000}
  target={2000000}
  format="currency:USD"
  tone="positive"
  context="Closed 17% above the goal."
/>
```

### Small, low value

```tsx
import { ProgressMeter } from "insightcharts";

<ProgressMeter
  size="sm"
  label="Rural fibre coverage"
  value={0.08}
  target={0.95}
  targetLabel="Goal"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/progress-meter.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/progress-meter.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
