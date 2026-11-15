# Filter chips (`filter-chips`)

> The active crossfilter selections of the surrounding `InsightData`, shown as removable chips with a reset control.

- Component: `FilterChips` (import from `insightcharts`)
- Spec type: `"filter-chips"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Inside any `<InsightData>` whose charts use `select`: put it above the charts so readers can see what is filtered, drop one value, or clear everything. `linked-charts` already includes it.

## Avoid

Outside `<InsightData>` it renders nothing unless you pass `selections` yourself. It is not a filter builder: selections are made by clicking marks in the charts.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/filter-chips
```

The file lands at `components/insightcharts/molecules/filter-chips.tsx`. `@insightcharts/filter-chips-demo` adds a ready-made example next to it.

## Usage

```tsx
import { FilterChips } from "insightcharts";

<FilterChips
  labels={{ region: "Region", source: "Source", year: "Year" }}
  selections={{
    "by-region": { field: "region", values: ["Asia", "Europe"] },
    "by-source": { field: "source", values: ["Solar"] },
    "by-year": { field: "year", range: [2020, 2024] },
  }}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "filter-chips",
  "labels": { "region": "Region", "source": "Source", "year": "Year" },
  "selections": {
    "by-region": { "field": "region", "values": ["Asia", "Europe"] },
    "by-source": { "field": "source", "values": ["Solar"] },
    "by-year": { "field": "year", "range": [2020, 2024] }
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `selections` | `Record<string, { field, values?, range? }>` |  | Selections to show when there is no surrounding `<InsightData>` (or to override it), keyed by owner. Uncontrolled unless `onSelectionsChange` is given. |
| `onSelectionsChange` | `(selections) => void` |  | Called when a chip is removed or the reset is pressed; makes `selections` controlled. |
| `labels` | `Record<string, string>` |  | Display names for field names, e.g. `{ region: "Region" }`. |
| `hint` | `string` |  | Shown while nothing is selected, e.g. "Click a bar to filter". |
| `resetLabel` | `string` | `"Reset"` | Text of the clear-all control. |
| `count` | `boolean` | `false` | Show "1,204 of 5,000 rows" at the end of the line. |
| `unit` | `string` | `"rows"` | Noun for the count, e.g. "orders". |
| `theme` | `ThemeInput` |  | Theme override. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [linked-charts](https://insightcharts.dev/llms/linked-charts.md), [data-explorer](https://insightcharts.dev/llms/data-explorer.md)

## More examples

### Nothing selected, with a hint

```tsx
import { FilterChips } from "insightcharts";

<FilterChips selections={{}} hint="Click a bar to filter" />
```

## Links

- Registry item: https://insightcharts.dev/r/filter-chips.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/filter-chips.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
