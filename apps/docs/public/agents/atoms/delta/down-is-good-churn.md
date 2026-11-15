# Reproduce the "Down is good (churn)" example of the InsightCharts Delta

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Down is good (churn)" example of `delta` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

An inline change indicator: direction arrow, signed value and an optional baseline label.

Use it when: Next to a figure, in a sentence, a table cell or a tile, to say how much it changed and against what. Set `upIsGood: false` for measures where a fall is the good news (churn, emissions, wait times).

Pick something else when: Standing alone as the main figure (use `big-number` or `stat-tile`, which include a delta). Do not omit the baseline label unless the surrounding text names it.

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `stat-tile` https://insightcharts.dev/agents/atoms/stat-tile.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/delta
```

The file lands at `components/insightcharts/atoms/delta.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Delta } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `value` (`number | string`): The change. Numbers format as signed percentages by default (0.12 is +12%). Example: `-0.021`.

## 5. The "Down is good (churn)" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { Delta } from "insightcharts";

<Delta value={-0.021} label="monthly churn vs January" upIsGood={false} size="md" />
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "value": -0.021,
  "label": "monthly churn vs January",
  "upIsGood": false,
  "size": "md",
  "type": "delta"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number \| string` |  | The change. Numbers format as signed percentages by default (0.12 is +12%). |
| `label` | `string` |  | The baseline, e.g. "vs last quarter". |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the colour only. |
| `direction` | `"up" \| "down" \| "flat"` |  | Override the direction inferred from the sign. |
| `format` | `FormatSpec` | `signed percent` | Number format, e.g. `"signed"` for absolute changes or `"{value} pts"`. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` |  | 12, 14, 16 or 20px. Inherits the surrounding size when omitted. |
| `variant` | `"text" \| "pill" \| "solid"` | `"text"` | `pill` adds a tinted capsule behind the value; `solid` fills the capsule and sets the value in the surface colour. |
| `tone` | `"auto" \| "neutral" \| "accent" \| "positive" \| "negative" \| "inherit"` | `"auto"` | Colour of the value. `auto` follows the direction and `upIsGood`; `inherit` takes the surrounding text colour, for a coloured ground. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides. A named theme paints its own ground. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `before-after` (molecule), `comparison-table` (molecule), `ranked-list` (molecule)

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
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/delta.md
- Component reference with every example: https://insightcharts.dev/llms/delta.md
- Registry item: https://insightcharts.dev/r/delta.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/delta.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/delta#example-down-is-good-churn
- These instructions as plain text: https://insightcharts.dev/agents/atoms/delta/down-is-good-churn.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
