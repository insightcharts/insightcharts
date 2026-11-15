# Emit, validate and render a JSON spec

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: A JSON spec that passes the schema and renders through Insight in the user's project.

Write a component as a JSON spec, validate it and render it with `Insight`. Use a spec when the chart is chosen at runtime, stored as data or produced by a model. Use JSX with named imports when the chart is known at build time. If the user has not given you the data and the fact to show, ask for both.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Choose the component. The decision table is at https://insightcharts.dev/agents/docs/agents/choosing.md and each component's props are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.
2. Write the spec: an object with `type` set to the component's kebab-case name, plus that component's props.
3. Validate it against the schema (see "Validate").
4. Render it with `<Insight spec={spec} />`.
5. Look at the result. Fix anything the inline alert reports.

## What goes in a spec

- `type`: a component name from the manifest, such as `"bar-chart"`. Use only names that exist.
- Fields are names, not functions: `"x": "month"`.
- `data`: inline rows, CSV text, a URL string, or `{ "url", "format"?, "path"? }`.
- `transform`: one transform object or an array, for example `{ "type": "filter", "field": "year", "op": ">=", "value": 2015 }`.
- `format`: a string such as `"compact"`, `"percent"` (0.42 prints as 42%), `"percent-raw"` (42 prints as 42%), `"integer"`, `"decimal:2"`, `"signed"`, `"year"`, `"currency:USD"`, a template such as `"{value} kg"`, or `Intl.NumberFormat` options.
- `annotations`: objects in data coordinates. `{ "type": "line", "axis", "value", "label"? }`, `{ "type": "band", "axis", "from", "to", "label"? }` or `{ "type": "point", "x", "y", "label" }`.
- `title`, `subtitle`, `source`, `note`, `highlight`: as in JSX.

These cannot be in JSON: the callbacks `onSelect`, `onEvents` and `onReady`, and the function forms of `data`, `transform`, `format` and `option`. Use the object form of `option` for ECharts overrides.

## Nested specs

Molecules and templates take content through slot props. A slot takes another spec, so one document can be a whole page.

```json
{
  "type": "chart-callout",
  "chart": { "type": "line-chart", "data": [{ "month": "Jan", "churn": 4.2 }, { "month": "Nov", "churn": 2.1 }], "x": "month", "y": "churn", "format": "{value}%", "title": "Monthly churn fell from 4.2% in January to 2.1% in November 2024" },
  "lead": "Churn was 2.1% in November"
}
```

`Insight` resolves nested specs by name. If you render the outer component with a named import and pass spec objects into its slots, register the components first: `registerAll()` for everything, or `registerComponents({ LineChart })` for only what the specs name.

## Validate

The schema is at https://insightcharts.dev/schema/insight-spec.json. It is JSON Schema draft-07, a `oneOf` over every component. Each component sets `additionalProperties: false`, so a misspelt or invented prop fails. Use any draft-07 validator. With `ajv`:

```ts
// validate-spec.mjs: node validate-spec.mjs spec.json
import { readFileSync } from "node:fs";
import Ajv from "ajv";

const schema = await (await fetch("https://insightcharts.dev/schema/insight-spec.json")).json();
const spec = JSON.parse(readFileSync(process.argv[2], "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false }).addSchema(schema);

// Validate against the definition of the spec's own type, so the errors name that component's props.
const validate = ajv.getSchema(`${schema.$id}#/definitions/components/${spec.type}`);
if (!validate) throw new Error(`Unknown component type "${spec.type}"`);
if (!validate(spec)) {
  console.error(validate.errors.map((e) => `${e.instancePath || "(root)"} ${e.message} ${JSON.stringify(e.params)}`).join("\n"));
  process.exit(1);
}
```

An invented prop reports `must NOT have additional properties {"additionalProperty":"<name>"}`. When the errors point at a slot such as `/chart`, validate that nested spec alone the same way to get a short list.

When a model produces the spec, pass the schema as its structured-output or tool schema. The component manifest, with every component's props and example, is at https://insightcharts.dev/schema/manifest.json and ships in the package as `insightcharts/manifest.json`.

## Minimal example

```tsx
import { Insight } from "insightcharts";

const spec = {
  type: "bar-chart",
  data: [
    { country: "Norway", share: 98 },
    { country: "Brazil", share: 89 },
    { country: "Canada", share: 68 },
  ],
  x: "country",
  y: "share",
  format: "{value}%",
  highlight: "Norway",
  title: "Renewables supplied 98% of Norway's electricity in 2023",
  subtitle: "Share of electricity generation from renewables, 2023",
  source: "Ember",
};

export function Answer() {
  return <Insight spec={spec} />;
}
```

## Helpers

All are exported from `insightcharts`.

| Export | Purpose |
|---|---|
| `Insight` | Renders a spec. Registers every component on first render. |
| `registerAll()` | Registers every built-in component, for slot specs rendered outside `Insight`. |
| `registerComponents(record)` | Registers the named components by their `meta.name`. |
| `renderSlot(slot)` | Renders a slot that may be React content or a spec. |
| `isSpec(value)` | True for a plain object with a string `type`. |
| `listComponents()` | The metadata of every registered component. |
| `getComponent(type)` | The registered component for a name. |

## Verify

1. The validator reports no errors.
2. The spec survives `JSON.parse(JSON.stringify(spec))` unchanged.
3. The page renders the chart and no inline alert. An unknown `type` renders an alert that lists the valid names.
4. Check at desktop width, at about 380px and in dark mode.
5. Every number in `title` can be computed from `data`.

## Common mistakes

- A `type` in PascalCase or with a different name. It is the kebab-case name: `"bar-chart"`, not `"BarChart"`.
- A prop that belongs to another component, or a common chart prop such as `highlight` on an HTML component that does not list it.
- A function anywhere in the spec.
- A `{ "type": "line" }` annotation mistaken for a component. Annotation and transform objects also use `type`, and they are not specs.
- Using `Insight` for one chart known at build time. `Insight` bundles every component. Import the chart by name.
- Passing slot specs to a named-import component without registering the components they name.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/json-spec.md
- This page: https://insightcharts.dev/docs/json-spec
- These instructions as plain text: https://insightcharts.dev/agents/docs/json-spec.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
