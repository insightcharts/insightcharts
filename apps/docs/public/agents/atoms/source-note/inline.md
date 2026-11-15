# Reproduce the "Inline" example of the InsightCharts Source note

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Inline" example of `source-note` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A sourcing footer for a whole piece: sources with optional links, the period covered, method, caveats and credit.

Use it when: Once, at the end of a story or dashboard, to say where every number came from and how it was produced.

Pick something else when: Sourcing a single chart: use that chart's own `source` and `note` props so the citation travels with its export.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/source-note
```

The file lands at `components/insightcharts/atoms/source-note.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SourceNote } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. The "Inline" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { SourceNote } from "insightcharts";

<SourceNote
  layout="inline"
  sources={["Office for National Statistics", "Ofgem price cap tables"]}
  note="Figures are approximate, for illustration"
  period="Q1 2019 to Q4 2024"
  method="Bills are for a typical dual-fuel household paying by direct debit, in 2024 prices"
  credit="Chart design: A. Ruiz"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "layout": "inline",
  "sources": ["Office for National Statistics", "Ofgem price cap tables"],
  "note": "Figures are approximate, for illustration",
  "period": "Q1 2019 to Q4 2024",
  "method": "Bills are for a typical dual-fuel household paying by direct debit, in 2024 prices",
  "credit": "Chart design: A. Ruiz",
  "type": "source-note"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers, e.g. "2015 to 2024". Shown as "Data". |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know. |
| `credit` | `string` |  | Who made the piece. |
| `layout` | `"list" \| "inline"` | `"list"` | Labelled list, or one running paragraph. |
| `rule` | `boolean` | `true` | Hairline above the note. |
| `children` | `ReactNode` |  | Extra content after the rows. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `hero-figure` (molecule), `comparison-brief` (template), `data-explorer` (template), `executive-brief` (template), `explainer` (template), `report-page` (template), `scorecard` (template), `social-card` (template), `story-deck` (template), `timeline-story` (template), `visual-essay` (template)

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
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/source-note.md
- Component reference with every example: https://insightcharts.dev/llms/source-note.md
- Registry item: https://insightcharts.dev/r/source-note.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/source-note.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/source-note#example-inline
- These instructions as plain text: https://insightcharts.dev/agents/atoms/source-note/inline.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
