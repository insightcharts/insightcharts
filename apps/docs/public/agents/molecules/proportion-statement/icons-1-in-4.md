# Reproduce the "Icons, 1 in 4" example of the InsightCharts Proportion statement

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Icons, 1 in 4" example of `proportion-statement` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A share stated as a countable sentence ("37 in every 100…"): a waffle grid or a row of icons beside the statement in large type, with the number emphasised.

Use it when: One proportion that is easier to read as a count of people or units than as a percentage. Round to a small whole first: 1 in 4 with icons, 37 in every 100 with a waffle.

Pick something else when: Several shares side by side (use `bar-chart`, or `waffle-chart` with categories); a precise percentage where the decimals matter (use `big-number`); totals above 100.

Instructions for the alternatives: `waffle-chart` https://insightcharts.dev/agents/atoms/waffle-chart.md, `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/proportion-statement
```

The file lands at `components/insightcharts/molecules/proportion-statement.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ProportionStatement } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `value` (`number`): How many of the whole are counted. Example: `1`.
- `text` (`string`): The rest of the sentence, read straight after the figure. Example: text.

## 5. The "Icons, 1 in 4" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { ProportionStatement } from "insightcharts";

<ProportionStatement
  value={1}
  total={4}
  text="households could not cover an unexpected bill of €500 without borrowing."
  source="Eurostat, EU-SILC 2023"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "value": 1,
  "total": 4,
  "text": "households could not cover an unexpected bill of €500 without borrowing.",
  "source": "Eurostat, EU-SILC 2023",
  "note": "Figures are approximate, for illustration",
  "type": "proportion-statement"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number` |  | How many of the whole are counted. |
| `total` | `number` | `100` | The whole. |
| `figure` | `string` |  | The emphasised words. Default: "{value} in every {total}", or "{value} in {total}" up to 20. |
| `text` (required) | `string` |  | The rest of the sentence, read straight after the figure. |
| `visual` | `"waffle" \| "icons"` |  | Grid of cells or row of glyphs. Default: icons up to a total of 20, waffle above. |
| `icon` | `"circle" \| "person" \| "square"` | `"person"` | Glyph for the `icons` visual. |
| `shape` | `"square" \| "circle"` | `"square"` | Cell shape for the `waffle` visual. |
| `side` | `"left" \| "right"` | `"left"` | Side the visual sits on; under 520px it goes on top. |
| `detail` | `string` |  | A second, quieter sentence under the statement. |
| `source` | `string` |  | Shown under the statement as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the visual. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `waffle-chart` (atom), `icon-stat` (atom)
- Used by: `explainer` (template)

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.
- An icon is decoration. The label beside it must carry the meaning.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/proportion-statement.md
- Component reference with every example: https://insightcharts.dev/llms/proportion-statement.md
- Registry item: https://insightcharts.dev/r/proportion-statement.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/proportion-statement.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/proportion-statement#example-icons-1-in-4
- These instructions as plain text: https://insightcharts.dev/agents/molecules/proportion-statement/icons-1-in-4.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
