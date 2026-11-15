# The JSON spec

A spec is a component described as plain JSON: `type` is the component's kebab-case name, every other key is a prop.

```json
{
  "type": "line-chart",
  "data": { "url": "/data/energy.csv" },
  "transform": [{ "type": "filter", "field": "year", "op": ">=", "value": 2015 }],
  "x": "year",
  "y": ["solar", "wind"],
  "highlight": "solar",
  "annotations": [{ "type": "line", "axis": "x", "value": "2020", "label": "Pandemic" }],
  "title": "Solar and wind share of electricity since 2015",
  "subtitle": "Share of global electricity generation, %",
  "source": "Ember"
}
```

```tsx
import { Insight } from "insightcharts";

<Insight spec={spec} />
```

## When to use a spec

- The chart is chosen at runtime: by an AI agent, a CMS field, an API response.
- You need to store, diff or validate charts as data.

When you are writing a page by hand, JSX with named imports is the better choice: it is type-checked and only bundles what you import (the package ships one module per component). Rendering `Insight` registers, and therefore bundles, every component.

## Rules

- `type` must be a component name from the manifest. An unknown type renders a visible message listing the available types; it does not throw.
- Props are the same as in JSX. Field names are strings in both.
- Specs nest. Wherever a molecule or template takes content (a slot), it accepts text or another spec.
- Everything is expressible except functions: no callbacks (`onSelect`, `onEvents`, `onReady`), and no function forms of `data`, `transform`, `format` or `option`. Use the string and object forms: URLs and `{ url, path }` for data, transform objects, format strings such as `"percent"` or `"{value} kg"`, and an `option` object for ECharts overrides.

## Validate before rendering

The schema is generated from the component metadata:

- `https://insightcharts.dev/schema/insight-spec.json`

It is a `oneOf` over component types. Each type lists the component's own props (plus the common chart props for charts, or `className`, `style`, `theme` and `mode` for HTML components) and rejects unknown keys, which catches misspelt and invented props. Use any JSON Schema (draft-07) validator. The component manifest, with every component's description, props and example, is at `https://insightcharts.dev/schema/manifest.json` and ships in the package as `insightcharts/manifest.json`.

## Formats and annotations in JSON

`format`: `"auto"`, `"compact"` (12.9K), `"percent"` (0.42 becomes 42%), `"percent-raw"` (42 becomes 42%), `"integer"`, `"signed"`, `"year"`, `"currency:USD"`, `"decimal:2"`, a template containing `{value}` such as `"{value} kg"`, or an `Intl.NumberFormat` options object.

`annotations` (cartesian charts), positioned in data coordinates:

```json
[
  { "type": "line", "axis": "y", "value": 50, "label": "Target", "dashed": true },
  { "type": "band", "axis": "x", "from": "2020", "to": "2021", "label": "Lockdowns" },
  { "type": "point", "x": "2023", "y": 5.5, "label": "5.5% in 2023", "position": "top" }
]
```

`line` also takes `emphasis` (draw in ink rather than muted). `point` takes `dot: false` to hide the marker; its `label` supports `\n` line breaks.

## Registering your own components

`Insight` and nested slots look components up by `meta.name`. To make a spec resolve to your own component, or to a registry copy you have customised, register it:

```tsx
import { registerComponents } from "insightcharts";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

registerComponents({ BarChart }); // the last registration for a name wins
```

`listComponents()` returns the metadata of everything registered, and `getComponent(type)` returns one component.
