# Delta (`delta`)

> An inline change indicator: direction arrow, signed value and an optional baseline label.

- Component: `Delta` (import from `insightcharts`)
- Spec type: `"delta"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Next to a figure, in a sentence, a table cell or a tile, to say how much it changed and against what. Set `upIsGood: false` for measures where a fall is the good news (churn, emissions, wait times).

## Avoid

Standing alone as the main figure (use `big-number` or `stat-tile`, which include a delta). Do not omit the baseline label unless the surrounding text names it.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/delta
```

The file lands at `components/insightcharts/atoms/delta.tsx`. `@insightcharts/delta-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Delta } from "insightcharts";

<Delta value={0.124} label="vs last quarter" size="md" />
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{ "type": "delta", "value": 0.124, "label": "vs last quarter", "size": "md" }
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number \| string` |  | The change. Numbers format as signed percentages by default (0.12 is +12%). |
| `label` | `string` |  | The baseline, e.g. "vs last quarter". |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the colour only. |
| `direction` | `"up" \| "down" \| "flat"` |  | Override the direction inferred from the sign. |
| `format` | `FormatSpec` | `signed percent` | Number format, e.g. `"signed"` for absolute changes or `"{value} pts"`. |
| `size` | `"sm" \| "md" \| "lg"` |  | 12, 14 or 16px. Inherits the surrounding size when omitted. |
| `variant` | `"text" \| "pill"` | `"text"` | `pill` adds a tinted capsule behind the value. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [before-after](https://insightcharts.dev/llms/before-after.md), [comparison-table](https://insightcharts.dev/llms/comparison-table.md), [ranked-list](https://insightcharts.dev/llms/ranked-list.md)

## More examples

### Down is good (churn)

```tsx
import { Delta } from "insightcharts";

<Delta value={-0.021} label="monthly churn vs January" upIsGood={false} size="md" />
```

### Down is bad, pill

```tsx
import { Delta } from "insightcharts";

<Delta value={-1840} format="signed" label="net subscribers this month" variant="pill" size="md" />
```

### No change

```tsx
import { Delta } from "insightcharts";

<Delta value={0} label="vs 2023" size="md" />
```

### String value, large pill

```tsx
import { Delta } from "insightcharts";

<Delta value="3 places" direction="up" label="in the regional ranking" variant="pill" size="lg" />
```

## Links

- Registry item: https://insightcharts.dev/r/delta.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/delta.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
