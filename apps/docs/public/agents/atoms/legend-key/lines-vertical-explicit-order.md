# Reproduce the "Lines, vertical, explicit order" example of the InsightCharts Legend key

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Lines, vertical, explicit order" example of `legend-key` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A standalone colour key: categorical swatches, or a sequential/diverging ramp with end labels.

Use it when: When several charts (small multiples, a map and a bar chart, a dashboard row) share one colour encoding, show the key once above them and turn their own legends off.

Pick something else when: A single chart: its built-in legend or, better, direct labels already do this. Do not list more than eight categories.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/legend-key
```

The file lands at `components/insightcharts/atoms/legend-key.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { LegendKey } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. The "Lines, vertical, explicit order" example

This example sets `theme="ocean"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { LegendKey } from "insightcharts";

<LegendKey
  theme="ocean"
  orientation="vertical"
  shape="line"
  items={[
    { label: "Germany", index: 0 },
    { label: "Spain", index: 3 },
    { label: "EU average", muted: true },
  ]}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ocean",
  "orientation": "vertical",
  "shape": "line",
  "items": [
    { "label": "Germany", "index": 0 },
    { "label": "Spain", "index": 3 },
    { "label": "EU average", "muted": true }
  ],
  "type": "legend-key"
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
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `small-multiple-grid` (molecule)

## Rules for this form

- Give every number its unit and its period in the label.
- A single number needs a comparison, a denominator or a period beside it.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/legend-key.md
- Component reference with every example: https://insightcharts.dev/llms/legend-key.md
- Registry item: https://insightcharts.dev/r/legend-key.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/legend-key.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/legend-key#example-lines-vertical-explicit-order
- These instructions as plain text: https://insightcharts.dev/agents/atoms/legend-key/lines-vertical-explicit-order.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
