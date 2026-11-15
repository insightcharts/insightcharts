# Stat tile (`stat-tile`)

> A compact, bordered KPI tile: label, value, change against a baseline and an optional trend graphic.

- Component: `StatTile` (import from `insightcharts`)
- Spec type: `"stat-tile"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Dashboard grids and KPI rows of three to six figures, each needing its own change indicator or sparkline. Give every tile a delta or a context line.

## Avoid

The single number a story leads with (use `big-number` with `size: "hero"`). Do not put a full chart with axes in the trend slot.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-tile
```

The file lands at `components/insightcharts/atoms/stat-tile.tsx`. `@insightcharts/stat-tile-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  format="compact"
  delta={0.083}
  deltaLabel="vs September"
  trend={[38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2]}
  style={{ maxWidth: 300 }}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "stat-tile",
  "label": "Monthly active users",
  "value": 48210,
  "format": "compact",
  "delta": 0.083,
  "deltaLabel": "vs September",
  "trend": [38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2],
  "style": { "maxWidth": 300 }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What it measures, sentence case. |
| `value` (required) | `number \| string` |  | The figure. Numbers are formatted with `format`. |
| `delta` | `number \| string` |  | Change against a baseline. Numbers render as signed percentages (0.12 is +12%). |
| `deltaLabel` | `string` |  | What the delta is against, e.g. "vs last month". |
| `upIsGood` | `boolean` | `true` | Whether an increase is an improvement. Sets the delta colour. |
| `context` | `string` |  | A line that states a comparison or reference for the number. |
| `trend` | `Slot \| number[]` |  | A chart spec, a React element, or an array of numbers drawn as a sparkline. |
| `trendPosition` | `"bottom" \| "right"` | `"bottom"` | Where the trend sits; `right` falls back to `bottom` under 280px. |
| `format` | `FormatSpec` | `"auto"` | Number format for `value`. |
| `children` | `ReactNode` |  | Extra content at the bottom of the tile. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [section](https://insightcharts.dev/llms/section.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [trend-card](https://insightcharts.dev/llms/trend-card.md)

## More examples

### Down is good, trend on the right

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Median first-response time"
  value="2 h 14 min"
  delta={-0.18}
  deltaLabel="vs last quarter"
  upIsGood={false}
  trend={[4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2]}
  trendPosition="right"
  style={{ maxWidth: 420 }}
/>
```

### Context only

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Net revenue retention"
  value={1.12}
  format="percent"
  context="Top quartile for the sector is 110%."
  style={{ maxWidth: 260 }}
/>
```

### Chart spec in the trend slot

```tsx
import { BigNumber, StatTile } from "insightcharts";

<StatTile
  label="Solar share of generation"
  value={0.113}
  format="percent"
  delta="+1.9 pts"
  deltaLabel="vs 2023"
  trend={<BigNumber
    label="Peak hour, 14 July"
    value={0.52}
    format="percent"
    context="Any registered component can sit here."
  />}
  style={{ maxWidth: 300 }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/stat-tile.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/stat-tile.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
