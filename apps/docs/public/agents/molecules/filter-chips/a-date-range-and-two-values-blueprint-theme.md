# Reproduce the "A date range and two values, blueprint theme" example of the InsightCharts Filter chips

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "A date range and two values, blueprint theme" example of `filter-chips` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

The active crossfilter selections of the surrounding `InsightData`, shown as removable chips with a reset control.

Use it when: Inside any `<InsightData>` whose charts use `select`: put it above the charts so readers can see what is filtered, drop one value, or clear everything. `linked-charts` already includes it.

Pick something else when: Outside `<InsightData>` it renders nothing unless you pass `selections` yourself. It is not a filter builder: selections are made by clicking marks in the charts.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/filter-chips
```

The file lands at `components/insightcharts/molecules/filter-chips.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { FilterChips } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

## 5. The "A date range and two values, blueprint theme" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { FilterChips } from "insightcharts";

<FilterChips
  theme="blueprint"
  labels={{ month: "Month", line: "Line" }}
  resetLabel="Clear all"
  selections={{
    "by-month": { field: "month", range: ["2024-03-01", "2024-09-01"] },
    "by-line": { field: "line", values: ["Northern", "Circle"] },
  }}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "labels": { "month": "Month", "line": "Line" },
  "resetLabel": "Clear all",
  "selections": {
    "by-month": { "field": "month", "range": ["2024-03-01", "2024-09-01"] },
    "by-line": { "field": "line", "values": ["Northern", "Circle"] }
  },
  "type": "filter-chips"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `selections` | `Record<string, { field, values?, range? }>` |  | Selections to show when there is no surrounding `<InsightData>` (or to override it), keyed by owner. Uncontrolled unless `onSelectionsChange` is given. |
| `onSelectionsChange` | `(selections) => void` |  | Called when a chip is removed or the reset is pressed; makes `selections` controlled. |
| `labels` | `Record<string, string>` |  | Display names for field names, e.g. `{ region: "Region" }`. |
| `hint` | `string` |  | Shown while nothing is selected, e.g. "Click a bar to filter". |
| `resetLabel` | `string` | `"Reset"` | Text of the clear-all control. |
| `count` | `boolean` | `false` | Show "1,204 of 5,000 rows" at the end of the line. |
| `unit` | `string` | `"rows"` | Noun for the count, e.g. "orders". |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `linked-charts` (molecule), `data-explorer` (template)

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/filter-chips.md
- Component reference with every example: https://insightcharts.dev/llms/filter-chips.md
- Registry item: https://insightcharts.dev/r/filter-chips.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/filter-chips.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/filter-chips#example-a-date-range-and-two-values-blueprint-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/filter-chips/a-date-range-and-two-values-blueprint-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
