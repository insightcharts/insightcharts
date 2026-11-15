# Build a Step marker with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Step marker (`step-marker`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A numbered chapter or step heading ("01 — Electricity sources in 2015") for sequencing the sections of a story.

Use it when: When a piece has three to seven ordered chapters or steps. Open each one with a marker so the reader can see the position in the sequence.

Pick something else when: Unordered sections (use `headline` with `size: "section"`), or numbering a list of items inside a paragraph.

Instructions for the alternatives: `headline` https://insightcharts.dev/agents/atoms/headline.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/step-marker
```

The file lands at `components/insightcharts/atoms/step-marker.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { StepMarker } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `step` (`number | string`): Step number, zero-padded to two digits. Strings are shown as written. Example: `1`.
- `title` (`string`): The chapter or step title. Example: `"Electricity sources in 2015"`.

## 5. Working example

```tsx
import { StepMarker } from "insightcharts";

<StepMarker
  theme="mono"
  step={1}
  title="Electricity sources in 2015"
  text="Europe's electricity generation by source in 2015."
  size="lg"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "step-marker",
  "theme": "mono",
  "step": 1,
  "title": "Electricity sources in 2015",
  "text": "Europe's electricity generation by source in 2015.",
  "size": "lg"
}
```

This example sets `theme="mono"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `step` (required) | `number \| string` |  | Step number, zero-padded to two digits. Strings are shown as written. |
| `title` (required) | `string` |  | The chapter or step title. |
| `total` | `number` |  | Total steps; the marker then reads "02 / 05". |
| `text` | `string` |  | A sentence under the title. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level. |
| `size` | `"md" \| "lg"` | `"md"` | `lg` for chapter openers. |
| `layout` | `"inline" \| "stacked"` | `"inline"` | Number beside or above the title. Narrow containers always stack. |
| `rule` | `boolean` | `false` | Hairline above the marker. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `annotated-timeline` (molecule), `section` (molecule), `explainer` (template), `visual-essay` (template)

## Rules for this form

- The text follows the writing rules: plain statements, real numbers, no figures of speech.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/step-marker.md
- Registry item: https://insightcharts.dev/r/step-marker.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/step-marker.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/step-marker
- These instructions as plain text: https://insightcharts.dev/agents/atoms/step-marker.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
