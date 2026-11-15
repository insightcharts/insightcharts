# Build a Callout with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Callout (`callout`, an atom) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A boxed statement of fact with a short bold lead and a sentence of explanation. The tone is marked by icon and tint.

Use it when: Beside or under a chart, to state its main fact in words, with the number. Also for a caveat the reader must not miss (`negative`).

Pick something else when: Long narration (use `prose`), a featured number (use `big-number` or `stat-tile`), or more than one callout per chart.

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `stat-tile` https://insightcharts.dev/agents/atoms/stat-tile.md, `prose` https://insightcharts.dev/agents/atoms/prose.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/callout
```

The file lands at `components/insightcharts/atoms/callout.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Callout } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. Working example

```tsx
import { Callout } from "insightcharts";

<Callout
  tone="accent"
  label="Summary"
  lead="Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024"
  text="Wholesale prices were below zero on those afternoons."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "callout",
  "tone": "accent",
  "label": "Summary",
  "lead": "Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024",
  "text": "Wholesale prices were below zero on those afternoons."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `lead` | `string` |  | The fact in a few bold words. State it with its number. |
| `text` | `string` |  | One sentence of explanation or evidence. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `tone` | `"neutral" \| "positive" \| "negative" \| "accent"` | `"neutral"` | Sets the icon shape and the tint together. |
| `label` | `string` |  | Small label above the lead, e.g. "Summary". |
| `variant` | `"soft" \| "outline" \| "plain"` | `"soft"` | Tinted box, bordered box, or no box. |
| `frame` | `boolean` |  | Paint a named theme's background behind the callout, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `chart-callout` (molecule), `comparison-brief` (template), `data-explorer` (template), `explainer` (template)

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

- Component reference with every example: https://insightcharts.dev/llms/callout.md
- Registry item: https://insightcharts.dev/r/callout.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/callout.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/callout
- These instructions as plain text: https://insightcharts.dev/agents/atoms/callout.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
