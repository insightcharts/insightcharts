# JSON specs

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

A spec is a JSON object with a `type`, which is a component's kebab-case name, plus that component's props. Use a spec when the chart is chosen at runtime, stored in a database, returned by an API or produced by a model.

```json
{ "type": "bar-chart", "data": [{ "month": "May", "tickets": 51 }], "x": "month", "y": "tickets" }
```

## Emit a spec

1. Choose the component with [Choosing a component](https://insightcharts.dev/docs/agents/choosing). Its name is the `type`.
2. Read the component's props at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`. Each page has a complete example spec.
3. Write one JSON object. Use only the props the page lists. The schema rejects unknown keys.
4. Write field props as column names: `"x": "month"`.
5. Write data as inline rows, CSV text, a URL or `{ "url": "...", "path": "..." }`.
6. Write reshaping as `transform` objects, formats as strings and annotations as objects in data coordinates.
7. Write `title`, `subtitle` and `source` to the [writing rules](https://insightcharts.dev/docs/agents/writing).

```json
{
  "type": "line-chart",
  "data": [
    { "month": "Jan", "churn": 4.2 },
    { "month": "May", "churn": 3.1 },
    { "month": "Sep", "churn": 2.3 },
    { "month": "Nov", "churn": 2.1 }
  ],
  "x": "month",
  "y": "churn",
  "format": "{value}%",
  "zero": true,
  "title": "Monthly churn fell from 4.2% in January to 2.1% in November 2024",
  "subtitle": "Monthly customer churn, 2024",
  "source": "Billing database",
  "annotations": [{ "type": "point", "x": "Nov", "y": 2.1, "label": "2.1% in November" }]
}
```

## Leave out what cannot be JSON

These cannot appear in a spec.

| Not expressible | Use instead |
|---|---|
| Callbacks: `onSelect`, `onEvents`, `onReady` | Render the component from JSX in a `"use client"` file |
| A function `format` | A format string such as `"compact"` or `"{value} kg"` |
| A function `transform` | A list of transform objects |
| A function `data` | Inline rows, a URL or `{ "url", "path" }` |
| A function `option` | An `option` object, which is deep-merged over the generated ECharts option |
| A prop named `type` | No component has one. `type` is always the component name. |

## Validate a spec against the schema

The schema is at `https://insightcharts.dev/schema/insight-spec.json`. It is JSON Schema draft-07, generated from the component metadata. It rejects unknown component names, unknown props and missing required props.

1. Fetch the schema once and cache it.
2. Validate the spec with any draft-07 validator before you render it.
3. When validation fails, fix the spec from the error message and validate again.

```ts
import Ajv from "ajv";

const schema = await fetch("https://insightcharts.dev/schema/insight-spec.json").then((r) => r.json());
const validate = new Ajv({ strict: false }).compile(schema);

if (!validate(spec)) {
  console.error(validate.errors);
}
```

To constrain a model, pass the schema as its structured-output or tool schema. The model can then name only components and props that exist.

## Render a spec with Insight

```tsx
import { Insight } from "insightcharts";
import type { InsightSpec } from "insightcharts";

export function Answer({ spec }: { spec: InsightSpec }) {
  return <Insight spec={spec} />;
}
```

- `Insight` renders any atom, molecule or template. It registers every component the first time it renders.
- A spec is serialisable, so a Next.js server component can load it and pass it to `Insight`.
- When `type` is not a known component, `Insight` renders an inline alert that lists the valid names. It does not throw. Send that message back to the model so it can correct the spec.
- When the chart is known at build time and bundle size matters, import the component by name instead: `BarChart`, not `Insight`.

## Nest specs in slots

Molecules and templates take content through slot props. A slot accepts another spec, so one document can be a whole page or a whole poster.

```json
{
  "type": "chart-callout",
  "chart": {
    "type": "line-chart",
    "data": [{ "month": "Jan", "churn": 4.2 }, { "month": "Nov", "churn": 2.1 }],
    "x": "month",
    "y": "churn",
    "title": "Monthly churn fell from 4.2% in January to 2.1% in November 2024"
  },
  "lead": "Churn was 2.1% in November",
  "body": "The reading in January was 4.2%."
}
```

`Insight` resolves nested specs by name. When you render the outer component from JSX and pass specs into its slots, register the components first.

```tsx
import { ChartCallout, LineChart, registerAll, registerComponents } from "insightcharts";

registerAll();
// or, to keep the bundle small:
registerComponents({ LineChart });

<ChartCallout chart={{ type: "line-chart", data, x: "month", y: "churn" }} lead="Churn was 2.1% in November" />
```

A slot spec that names an unregistered component renders an inline alert in place of the chart.

## Write a whole page or poster as one spec

A template has already fixed the layout, so the spec holds only titles, figures and chart specs.

1. Pick the template. Read its page: `https://insightcharts.dev/agents/templates/<name>.md`.
2. Fill the text props and each slot or region.
3. Validate the whole document against the schema.
4. Render it with `Insight`.

A poster spec names an infographic template, a poster theme and a compact config for each region.

```json
{
  "type": "count-poster",
  "theme": "noir",
  "title": "Norland's schools taught 1.84 million pupils in 2025",
  "unit": 1000,
  "unitLabel": "1,000 people",
  "hero": {
    "data": [
      { "stage": "Primary", "pupils": 820000 },
      { "stage": "Lower secondary", "pupils": 480000 }
    ],
    "name": "stage",
    "value": "pupils"
  },
  "sources": "Norland Ministry of Education, school census 2025"
}
```

## Use the spec helpers

All are exported from `insightcharts`.

| Export | Purpose |
|---|---|
| `Insight` | Render a spec. Registers every component on first render. |
| `registerAll()` | Register every built-in component, for slot specs rendered outside `Insight`. |
| `registerComponents(record)` | Make the named components available to specs. |
| `renderSlot(slot)` | Render a slot that may be React content or a spec. |
| `isSpec(value)` | True for a plain object with a string `type`. |
| `listComponents()` | The metadata of every registered component. |
| `getComponent(type)` | The registered component for a name. |

## Check a spec before you return it

1. `type` is a name from the catalogue.
2. Every key is a prop of that component.
3. Every field prop names a column in `data`.
4. There are no functions.
5. The title follows the writing rules and `source` is set.
6. The spec validates against the schema.

## Reference

- This page: https://insightcharts.dev/docs/agents/json-specs
- These instructions as plain text: https://insightcharts.dev/agents/docs/agents/json-specs.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
