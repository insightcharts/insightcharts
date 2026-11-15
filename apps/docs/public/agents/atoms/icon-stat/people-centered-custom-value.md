# Reproduce the "People, centered, custom value" example of the InsightCharts Icon stat

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "People, centered, custom value" example of `icon-stat` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A "1 in 4"-style statement: a row or grid of simple glyphs with some filled, and the sentence they illustrate.

Use it when: A single proportion that is easier to read as people or units than as a percentage: 1 in 4, 3 in 10, 37 of 100. Round to a small denominator first.

Pick something else when: Comparing several proportions (use `bar-chart`), precise percentages (use `big-number`), or fractions that need more than 100 units.

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
npx shadcn@latest add @insightcharts/icon-stat
```

The file lands at `components/insightcharts/atoms/icon-stat.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { IconStat } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `count` (`number`): How many glyphs are filled. Example: `7`.

## 5. The "People, centered, custom value" example

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { IconStat } from "insightcharts";

<IconStat
  theme="paper"
  icon="person"
  count={7}
  total={10}
  align="center"
  value="Seven in ten"
  text="renters say they have delayed switching the heating on."
  tone="neutral"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "icon": "person",
  "count": 7,
  "total": 10,
  "align": "center",
  "value": "Seven in ten",
  "text": "renters say they have delayed switching the heating on.",
  "tone": "neutral",
  "type": "icon-stat"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` (required) | `number` |  | How many glyphs are filled. |
| `total` | `number` | `10` | How many glyphs are drawn. Capped at 100. |
| `text` | `string` |  | The sentence completing the figure. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `value` | `string \| false` |  | The figure as words. Defaults to "{count} in {total}"; `false` hides it. |
| `icon` | `"circle" \| "person" \| "square" \| IconName` | `"circle"` | Glyph per unit. Filled units are solid, the rest outlined. Any other icon name from `core/icons.ts` also works; its unfilled units are faded instead of outlined. |
| `columns` | `number` |  | Glyphs per row. Defaults to `total`, at most 10. |
| `size` | `number` |  | Glyph height in px; shrinks to fit narrow containers. |
| `tone` | `"accent" \| "positive" \| "negative" \| "neutral"` | `"accent"` | Fill colour by meaning. |
| `align` | `"left" \| "center"` | `"left"` | Alignment. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `poster` (molecule), `proportion-statement` (molecule), `atlas-poster` (template), `explainer` (template)

## Rules for this form

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/icon-stat.md
- Component reference with every example: https://insightcharts.dev/llms/icon-stat.md
- Registry item: https://insightcharts.dev/r/icon-stat.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/icon-stat.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/icon-stat#example-people-centered-custom-value
- These instructions as plain text: https://insightcharts.dev/agents/atoms/icon-stat/people-centered-custom-value.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
