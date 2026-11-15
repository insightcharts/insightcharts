# Reproduce the "Hero with a trend, editorial" example of the InsightCharts Big number

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Hero with a trend, editorial" example of `big-number` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A featured statistic with its label, change and the context that gives it meaning.

Use it when: A single headline figure, or a row of three or four key numbers. Always give it context: a comparison, a denominator or a period.

Pick something else when: Showing a number with no comparison; using a gauge or a one-slice donut for the same job.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/big-number
```

The file lands at `components/insightcharts/atoms/big-number.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BigNumber } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `value` (`number | string`): The figure. Numbers are formatted with `format`. Example: `0.317`.
- `label` (`string`): What it measures, sentence case. Example: `"Share of global electricity from renewables"`.

## 5. The "Hero with a trend, editorial" example

This example sets `theme="editorial"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BigNumber } from "insightcharts";

<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  theme="editorial"
  size="hero"
  variant="with-trend"
  series={[0.19, 0.2, 0.205, 0.21, 0.214, 0.223, 0.233, 0.24, 0.252, 0.262, 0.28, 0.283, 0.297, 0.31, 0.317]}
  context="Annual share, 2010 to 2024"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "value": 0.317,
  "format": "percent",
  "label": "Share of global electricity from renewables",
  "delta": 0.021,
  "deltaLabel": "vs 2023",
  "theme": "editorial",
  "size": "hero",
  "variant": "with-trend",
  "series": [0.19, 0.2, 0.205, 0.21, 0.214, 0.223, 0.233, 0.24, 0.252, 0.262, 0.28, 0.283, 0.297, 0.31, 0.317],
  "context": "Annual share, 2010 to 2024",
  "type": "big-number"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number \| string` |  | The figure. Numbers are formatted with `format`. |
| `label` (required) | `string` |  | What it measures, sentence case. |
| `context` | `string` |  | The comparison, denominator or period that gives it meaning. |
| `delta` | `number \| string` |  | Change against a baseline. Numbers render as signed percentages (0.12 is +12%). |
| `deltaLabel` | `string` |  | What the delta is against, e.g. "vs last quarter". |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the delta colour. |
| `format` | `FormatSpec` | `"auto"` | Number format. |
| `size` | `"hero" \| "stat"` | `"stat"` | `hero` for the one number a piece leads with. |
| `align` | `"left" \| "center"` | `"left"` | Text alignment. |
| `variant` | `"plain" \| "filled" \| "tinted" \| "with-icon" \| "with-ring" \| "with-trend"` | `"plain"` | The display: `filled` (a solid ground in the tone with contrasting ink), `tinted` (a 10% wash), `with-icon` (needs `icon`: a tinted badge above the label), `with-ring` (needs `target` or `max`, or a share from 0 to 1: a progress ring beside the figure), `with-trend` (needs `series`: a line under the figure). A variant whose data is missing renders as `plain`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` | `"accent"` | Colour of the ground or graphic. A number picks from the theme's categorical palette, 0-based. |
| `icon` | `IconInput` |  | A built-in icon name or `path://...`, for `with-icon`. |
| `series` | `number[]` |  | Past values in time order, oldest first, ending with the current value, for `with-trend`. |
| `target` | `number` |  | The goal for `value`, for `with-ring`. |
| `max` | `number` |  | End of the ring's scale. Default: the target, or 1 for a share. |
| `theme` | `ThemeInput` |  | A theme name such as `"editorial"`, or token overrides. A named theme paints its own ground. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `annotated-timeline` (molecule), `before-after` (molecule), `hero-figure` (molecule), `metric-breakdown` (molecule), `poster` (molecule), `quote-figure` (molecule), `stat-row` (molecule), `explainer` (template), `social-card` (template), `story-deck` (template), `timeline-story` (template)

## Rules for this form

- A numeric `delta` is a fraction shown as a signed percentage: `0.12` prints as +12%. Pass a string to print it as written.
- Give every number its unit and its period in the label.
- A single number needs a comparison, a denominator or a period beside it.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- An icon is decoration. The label beside it must carry the meaning.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/big-number.md
- Component reference with every example: https://insightcharts.dev/llms/big-number.md
- Registry item: https://insightcharts.dev/r/big-number.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/big-number.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/big-number#example-hero-with-a-trend-editorial
- These instructions as plain text: https://insightcharts.dev/agents/atoms/big-number/hero-with-a-trend-editorial.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
