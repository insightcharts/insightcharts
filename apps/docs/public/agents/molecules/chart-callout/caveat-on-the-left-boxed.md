# Reproduce the "Caveat on the left, boxed" example of the InsightCharts Chart with callout

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Caveat on the left, boxed" example of `chart-callout` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A chart with a callout beside it that states the main fact. In narrow containers the callout goes underneath.

Use it when: Whenever a chart needs its meaning stated in words next to it: the standard chart-plus-interpretation unit of a report. The chart's title states the main fact with its number. The callout adds a second fact, a cause or a caveat in plain words.

Pick something else when: Repeating the chart title in the callout; long narration (put `prose` before the chart instead); a chart that is already a small tile (the callout would outweigh it).

Instructions for the alternatives: `prose` https://insightcharts.dev/agents/atoms/prose.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/chart-callout
```

The file lands at `components/insightcharts/molecules/chart-callout.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ChartCallout } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Caveat on the left, boxed" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, ChartCallout } from "insightcharts";

<ChartCallout
  side="left"
  variant="soft"
  tone="negative"
  label="Caveat"
  lead="The new onboarding launched on 11 March"
  body="The March figure includes customers who joined before the launch. April is the first full month on the new onboarding."
  chart={<BarChart
    data={[
      { month: "Jan", rate: 4.2 },
      { month: "Feb", rate: 4.3 },
      { month: "Mar", rate: 4.1 },
      { month: "Apr", rate: 3.6 },
      { month: "May", rate: 3.1 },
      { month: "Jun", rate: 2.9 },
    ]}
    x="month"
    sort="none"
    y="rate"
    format="{value}%"
    orientation="vertical"
    highlight="Mar"
    height={260}
    title="Monthly churn fell from 4.1% in March to 2.9% in June 2024"
    subtitle="Monthly customer churn, January to June 2024"
  />}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "side": "left",
  "variant": "soft",
  "tone": "negative",
  "label": "Caveat",
  "lead": "The new onboarding launched on 11 March",
  "body": "The March figure includes customers who joined before the launch. April is the first full month on the new onboarding.",
  "chart": {
    "type": "bar-chart",
    "data": [
      { "month": "Jan", "rate": 4.2 },
      { "month": "Feb", "rate": 4.3 },
      { "month": "Mar", "rate": 4.1 },
      { "month": "Apr", "rate": 3.6 },
      { "month": "May", "rate": 3.1 },
      { "month": "Jun", "rate": 2.9 }
    ],
    "x": "month",
    "sort": "none",
    "y": "rate",
    "format": "{value}%",
    "orientation": "vertical",
    "highlight": "Mar",
    "height": 260,
    "title": "Monthly churn fell from 4.1% in March to 2.9% in June 2024",
    "subtitle": "Monthly customer churn, January to June 2024"
  },
  "type": "chart-callout"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `chart` (required), `Slot`: The chart: a spec or a React element. In the example: a `bar-chart` spec with 6 rows.
- `children`, `ReactNode`: JSX alternative to `chart`. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` (required) | `Slot` |  | The chart: a spec or a React element. |
| `lead` | `string` |  | The main fact in a few words, with its number. Shown in bold. |
| `body` | `string` |  | One or two plain sentences that say what the fact means. |
| `tone` | `"neutral" \| "positive" \| "negative" \| "accent"` | `"accent"` | Sets the callout's icon and tint together. |
| `label` | `string` |  | Small label above the lead, e.g. "Takeaway" or "Caveat". |
| `side` | `"left" \| "right"` | `"right"` | Side of the chart the callout sits on. Under 640px it always goes underneath. |
| `variant` | `"plain" \| "soft" \| "outline"` | `"plain"` | `plain` separates the callout with a hairline; the others box it. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Vertical position of the callout beside the chart. |
| `children` | `ReactNode` |  | JSX alternative to `chart`. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and callout. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `callout` (atom), `line-chart` (atom), `bar-chart` (atom), `dumbbell-chart` (atom), `slope-chart` (atom)
- Used by: `executive-brief` (template), `visual-essay` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/chart-callout.md
- Component reference with every example: https://insightcharts.dev/llms/chart-callout.md
- Registry item: https://insightcharts.dev/r/chart-callout.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/chart-callout.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/chart-callout#example-caveat-on-the-left-boxed
- These instructions as plain text: https://insightcharts.dev/agents/molecules/chart-callout/caveat-on-the-left-boxed.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
