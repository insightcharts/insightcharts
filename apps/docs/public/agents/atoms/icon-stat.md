# Build an Icon stat with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add an Icon stat (`icon-stat`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

- `count` (`number`): How many glyphs are filled. Example: `1`.

## 5. Working example

```tsx
import { IconStat } from "insightcharts";

<IconStat
  icon="person"
  count={1}
  total={4}
  text="households could not cover an unexpected bill of €500 without borrowing."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "icon-stat",
  "icon": "person",
  "count": 1,
  "total": 4,
  "text": "households could not cover an unexpected bill of €500 without borrowing."
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

- Component reference with every example: https://insightcharts.dev/llms/icon-stat.md
- Registry item: https://insightcharts.dev/r/icon-stat.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/icon-stat.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/icon-stat
- These instructions as plain text: https://insightcharts.dev/agents/atoms/icon-stat.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
