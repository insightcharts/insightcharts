# Reproduce the "Lead paragraph, large" example of the InsightCharts Prose

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Lead paragraph, large" example of `prose` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Lead paragraph, large" example

This example sets `theme="editorial"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { Prose } from "insightcharts";

<Prose
  theme="editorial"
  size="lg"
  lead
  text={[
    "The typical household energy bill almost doubled between the winter of 2020 and the winter of 2022.",
    "Wholesale prices have fallen since then. Standing charges and network costs have not fallen. The average bill is still about a third higher than it was in 2020.",
  ]}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "editorial",
  "size": "lg",
  "lead": true,
  "text": [
    "The typical household energy bill almost doubled between the winter of 2020 and the winter of 2022.",
    "Wholesale prices have fallen since then. Standing charges and network costs have not fallen. The average bill is still about a third higher than it was in 2020."
  ],
  "type": "prose"
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/prose.md
- Component reference with every example: https://insightcharts.dev/llms/prose.md
- Registry item: https://insightcharts.dev/r/prose.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/prose.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/prose#example-lead-paragraph-large
- These instructions as plain text: https://insightcharts.dev/agents/atoms/prose/lead-paragraph-large.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
