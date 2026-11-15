# Legend key (`legend-key`)

> A standalone colour key: categorical swatches, or a sequential/diverging ramp with end labels.

- Component: `LegendKey` (import from `insightcharts`)
- Spec type: `"legend-key"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

When several charts (small multiples, a map and a bar chart, a dashboard row) share one colour encoding, show the key once above them and turn their own legends off.

## Avoid

A single chart: its built-in legend or, better, direct labels already do this. Do not list more than eight categories.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/legend-key
```

The file lands at `components/insightcharts/atoms/legend-key.tsx`. `@insightcharts/legend-key-demo` adds a ready-made example next to it.

## Usage

```tsx
import { LegendKey } from "insightcharts";

<LegendKey
  title="Source of electricity"
  items={["Solar", "Wind", "Hydro", "Gas", { label: "Other", muted: true }]}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "legend-key",
  "title": "Source of electricity",
  "items": ["Solar", "Wind", "Hydro", "Gas", { "label": "Other", "muted": true }]
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `scale` | `"categorical" \| "sequential" \| "diverging"` |  | Defaults to `categorical` when `items` is given, otherwise `sequential`. |
| `items` | `(string \| { label, color?, index?, shape?, muted? })[]` |  | Categorical entries. Colours come from the theme's categorical order by position (or `index`) unless given. |
| `labels` | `string[]` |  | Ramp end labels: `[low, high]` or `[low, middle, high]`. |
| `colors` | `string[]` |  | Ramp colours, low to high. Defaults to the theme's sequential or diverging ramp. |
| `stepped` | `boolean` | `false` | Discrete steps instead of a continuous gradient, for binned scales. |
| `title` | `string` |  | What the key encodes. |
| `shape` | `"square" \| "line" \| "dot"` | `"square"` | Default swatch shape: match the marks. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Categorical layout. |
| `width` | `number` | `240` | Ramp width in px, capped at the container. |
| `align` | `"left" \| "center"` | `"left"` | Alignment within the container. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md)

## More examples

### Sequential ramp

```tsx
import { LegendKey } from "insightcharts";

<LegendKey
  scale="sequential"
  title="Share of electricity from renewables"
  labels={["0%", "100%"]}
/>
```

### Diverging, stepped

```tsx
import { LegendKey } from "insightcharts";

<LegendKey
  scale="diverging"
  stepped
  title="Change in house prices, 2019 to 2024"
  labels={["−20%", "No change", "+20%"]}
  width={300}
/>
```

### Lines, vertical, explicit order

```tsx
import { LegendKey } from "insightcharts";

<LegendKey
  orientation="vertical"
  shape="line"
  items={[
    { label: "Germany", index: 0 },
    { label: "Spain", index: 3 },
    { label: "EU average", muted: true },
  ]}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/legend-key.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/legend-key.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
