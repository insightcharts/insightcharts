# Reproduce the "Medium, with source link" example of the InsightCharts Pull quote

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Medium, with source link" example of `pull-quote` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A large quotation with its attribution.

Use it when: To quote a person on a finding the charts have already shown, or to break up a long run of charts. One per section at most.

Pick something else when: Restating a number (use `big-number`) or the main fact of a chart (use `callout`). Never quote without attribution.

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `callout` https://insightcharts.dev/agents/atoms/callout.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/pull-quote
```

The file lands at `components/insightcharts/atoms/pull-quote.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { PullQuote } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. The "Medium, with source link" example

This example sets `theme="magenta"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { PullQuote } from "insightcharts";

<PullQuote
  theme="magenta"
  size="md"
  quote="Solar underbid coal in the afternoon power auctions for three years. The coal plants that could not reduce their output quickly enough in those hours were closed because they no longer covered their costs."
  attribution="European Electricity Review 2025"
  cite="https://ember-energy.org"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "magenta",
  "size": "md",
  "quote": "Solar underbid coal in the afternoon power auctions for three years. The coal plants that could not reduce their output quickly enough in those hours were closed because they no longer covered their costs.",
  "attribution": "European Electricity Review 2025",
  "cite": "https://ember-energy.org",
  "type": "pull-quote"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` | `string` |  | The words quoted, without quotation marks. |
| `children` | `ReactNode` |  | JSX alternative to `quote`. |
| `attribution` | `string` |  | Who said it. |
| `role` | `string` |  | Their role, or where it was said. |
| `cite` | `string` |  | Source URL: set as the blockquote `cite` and linked from the attribution. |
| `size` | `"md" \| "lg"` | `"lg"` | `lg` anchors a section; `md` sits inside a column. |
| `align` | `"left" \| "center"` | `"left"` | Left-aligned quotes carry a side rule; centred ones do not. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `quote-figure` (molecule), `story-deck` (template), `visual-essay` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/pull-quote.md
- Component reference with every example: https://insightcharts.dev/llms/pull-quote.md
- Registry item: https://insightcharts.dev/r/pull-quote.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/pull-quote.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/pull-quote#example-medium-with-source-link
- These instructions as plain text: https://insightcharts.dev/agents/atoms/pull-quote/medium-with-source-link.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
