# Build a Prose with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Prose (`prose`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A readable block of narration at a 45-75 character measure, for the text between charts.

Use it when: To say what a chart showed and introduce the next one. Use two or three short paragraphs at a time.

Pick something else when: A single statement of fact (use `callout`), a quotation (use `pull-quote`), or sourcing and method notes (use `source-note`).

Instructions for the alternatives: `source-note` https://insightcharts.dev/agents/atoms/source-note.md, `pull-quote` https://insightcharts.dev/agents/atoms/pull-quote.md, `callout` https://insightcharts.dev/agents/atoms/callout.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/prose
```

The file lands at `components/insightcharts/atoms/prose.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Prose } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. Working example

```tsx
import { Prose } from "insightcharts";

<Prose
  text={"In 2015 solar supplied **3% of Europe's electricity**. Hydro supplied more than three times as much.\n\nPanel prices fell by about 80% in the years that followed. In 2024 solar generated more electricity than coal across the EU, according to [Ember's annual review](https://ember-energy.org).\n\nSolar's share differs by country. The next chart shows it for each EU member state."}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "prose",
  "text": "In 2015 solar supplied **3% of Europe's electricity**. Hydro supplied more than three times as much.\n\nPanel prices fell by about 80% in the years that followed. In 2024 solar generated more electricity than coal across the EU, according to [Ember's annual review](https://ember-energy.org).\n\nSolar's share differs by country. The next chart shows it for each EU member state."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string \| string[]` |  | Narration. Blank lines separate paragraphs. Supports `**bold**`, `*italic*` and `[link](url)`. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Body size: 14, 16 or 18px. |
| `measure` | `number` | `65` | Line length in characters, clamped to 45-75. |
| `lead` | `boolean` | `false` | Set the first paragraph a step larger. |
| `tone` | `"default" \| "muted"` | `"default"` | `muted` for secondary narration. |
| `align` | `"left" \| "center"` | `"left"` | Centres the block (text stays left-aligned). |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `annotated-timeline` (molecule), `scrolly-chart` (molecule), `section` (molecule), `comparison-brief` (template), `executive-brief` (template), `explainer` (template), `report-page` (template), `scorecard` (template), `story-deck` (template), `timeline-story` (template), `visual-essay` (template)

## Rules for this form

- The text follows the writing rules: plain statements, real numbers, no figures of speech.
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

- Component reference with every example: https://insightcharts.dev/llms/prose.md
- Registry item: https://insightcharts.dev/r/prose.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/prose.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/prose
- These instructions as plain text: https://insightcharts.dev/agents/atoms/prose.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
