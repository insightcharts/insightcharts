# Reproduce the "Categorical tone with a detail, ledger" example of the InsightCharts Progress meter

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Categorical tone with a detail, ledger" example of `progress-meter` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A labelled horizontal meter of one value against a maximum or target, with the target marked and the value printed.

Use it when: Progress toward a goal, a quota or a capacity: funds raised, budget spent, share of a target reached. Stack several with `size: "sm"` to compare progress across a few items.

Pick something else when: Comparing more than a handful of items (use `bar-chart`), anything without a meaningful end point (use `big-number`), or a gauge dial.

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/progress-meter
```

The file lands at `components/insightcharts/atoms/progress-meter.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ProgressMeter } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `value` (`number`): The current value. Example: `318000`.
- `label` (`string`): What is measured, sentence case. Example: `"Enterprise plan revenue"`.

## 5. The "Categorical tone with a detail, ledger" example

This example sets `theme="ledger"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { ProgressMeter } from "insightcharts";

<ProgressMeter
  theme="ledger"
  label="Enterprise plan revenue"
  value={318000}
  max={589000}
  showMax={false}
  format="currency:USD"
  tone={1}
  detail="54%"
  context="Share of $589,000 monthly recurring revenue."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ledger",
  "label": "Enterprise plan revenue",
  "value": 318000,
  "max": 589000,
  "showMax": false,
  "format": "currency:USD",
  "tone": 1,
  "detail": "54%",
  "context": "Share of $589,000 monthly recurring revenue.",
  "type": "progress-meter"
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
| `tone` | `"accent" \| "positive" \| "negative" \| "neutral" \| number` | `"accent"` | Fill colour by meaning. A number picks from the theme's categorical palette, 0-based, for a stack of meters that name different entities. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Track of 6, 8 or 12px. `sm` for dense stacks, `lg` for a single featured meter. |
| `detail` | `string` |  | A short muted note after the value, e.g. a share of the total ("26%"). |
| `theme` | `ThemeInput` |  | A theme name such as `"science"`, or token overrides. A named theme paints its own ground. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `metric-breakdown` (molecule), `quote-figure` (molecule), `report-page` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/progress-meter.md
- Component reference with every example: https://insightcharts.dev/llms/progress-meter.md
- Registry item: https://insightcharts.dev/r/progress-meter.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/progress-meter.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/progress-meter#example-categorical-tone-with-a-detail-ledger
- These instructions as plain text: https://insightcharts.dev/agents/atoms/progress-meter/categorical-tone-with-a-detail-ledger.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
