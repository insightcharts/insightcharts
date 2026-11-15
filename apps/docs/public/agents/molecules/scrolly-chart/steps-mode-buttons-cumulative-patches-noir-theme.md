# Reproduce the "Steps mode (buttons), cumulative patches, noir theme" example of the InsightCharts Scrolly chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Steps mode (buttons), cumulative patches, noir theme" example of `scrolly-chart` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A scroll-driven story from JSON: one base chart spec and a list of steps, each with narration and a patch of chart props applied while that step is active.

Use it when: Walking a reader through one chart in stages: show everything, highlight the subject, change the measure, add the annotation. Make ONE change per step (the highlight, the data or the encoding) so the reader can see what changed.

Pick something else when: Steps that change several things at once, or that swap to an unrelated chart (start a new `section` instead). More than about seven steps. A fact that one view can show (use `chart-callout`). In documents that will be printed or embedded in a short frame, set `scrollMode: "steps"`.

Instructions for the alternatives: `chart-callout` https://insightcharts.dev/agents/molecules/chart-callout.md, `section` https://insightcharts.dev/agents/molecules/section.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scrolly-chart
```

The file lands at `components/insightcharts/molecules/scrolly-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ScrollyChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Steps mode (buttons), cumulative patches, noir theme" example

This example sets `theme="noir"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, ScrollyChart, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<ScrollyChart
  theme="noir"
  scrollMode="steps"
  cumulative
  chart={{
    type: "bar-chart",
    data: [
      { source: "Coal", y2015: 24.6, y2024: 9.8 },
      { source: "Gas", y2015: 15.8, y2024: 15.7 },
      { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
      { source: "Wind", y2015: 9.2, y2024: 17.4 },
      { source: "Hydro", y2015: 12, y2024: 13.2 },
      { source: "Solar", y2015: 2.9, y2024: 11.1 },
    ],
    x: "source",
    y: "y2015",
    sort: "none",
    orientation: "horizontal",
    format: "{value}%",
    height: 300,
    title: "EU electricity generation by source, 2015",
    subtitle: "Share of EU electricity generation, %",
    source: "Ember, European Electricity Review 2025",
    note: "Rounded, approximate figures for illustration",
  }}
  steps={[
    { content: "The chart shows each source's share in 2015." },
    { content: "**Coal** is highlighted. It supplied 24.6% in 2015.", highlight: "Coal" },
    {
      content: "The chart now shows 2024. Coal is still highlighted because the patches accumulate.",
      y: "y2024",
      title: "EU electricity generation by source, 2024",
    },
    {
      content: "The highlight is removed. The sources are sorted by their 2024 share.",
      highlight: null,
      sort: "desc",
    },
  ]}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "noir",
  "scrollMode": "steps",
  "cumulative": true,
  "chart": {
    "type": "bar-chart",
    "data": [
      { "source": "Coal", "y2015": 24.6, "y2024": 9.8 },
      { "source": "Gas", "y2015": 15.8, "y2024": 15.7 },
      { "source": "Nuclear", "y2015": 27.1, "y2024": 23.7 },
      { "source": "Wind", "y2015": 9.2, "y2024": 17.4 },
      { "source": "Hydro", "y2015": 12, "y2024": 13.2 },
      { "source": "Solar", "y2015": 2.9, "y2024": 11.1 }
    ],
    "x": "source",
    "y": "y2015",
    "sort": "none",
    "orientation": "horizontal",
    "format": "{value}%",
    "height": 300,
    "title": "EU electricity generation by source, 2015",
    "subtitle": "Share of EU electricity generation, %",
    "source": "Ember, European Electricity Review 2025",
    "note": "Rounded, approximate figures for illustration"
  },
  "steps": [
    { "content": "The chart shows each source's share in 2015." },
    { "content": "**Coal** is highlighted. It supplied 24.6% in 2015.", "highlight": "Coal" },
    {
      "content": "The chart now shows 2024. Coal is still highlighted because the patches accumulate.",
      "y": "y2024",
      "title": "EU electricity generation by source, 2024"
    },
    {
      "content": "The highlight is removed. The sources are sorted by their 2024 share.",
      "highlight": null,
      "sort": "desc"
    }
  ],
  "type": "scrolly-chart"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `chart` (required), `InsightSpec`: The base chart spec: `{ type, data, x, y, ... }`. Give it a `title`; steps may replace it. In the example: a `bar-chart` spec with 6 rows.
- `steps` (required), `{ content, id?, label?, ...chart props }[]`: The steps in order. `content` is a short paragraph that says plainly what the chart now shows (`**bold**` works). Every other key is a chart prop merged over `chart` for that step: `highlight`, `transform`, `annotations`, `x`, `y`, `title`… Use `null` to remove a base prop. Change one thing per step. In the example: 4 items: an object with `content`; an object with `content`, `highlight`; an object with `content`, `y`, `title`; ....

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` (required) | `InsightSpec` |  | The base chart spec: `{ type, data, x, y, ... }`. Give it a `title`; steps may replace it. |
| `steps` (required) | `{ content, id?, label?, ...chart props }[]` |  | The steps in order. `content` is a short paragraph that says plainly what the chart now shows (`**bold**` works). Every other key is a chart prop merged over `chart` for that step: `highlight`, `transform`, `annotations`, `x`, `y`, `title`… Use `null` to remove a base prop. Change one thing per step. |
| `cumulative` | `boolean` | `false` | Each step's patch builds on the previous steps instead of on the base spec alone. |
| `scrollMode` | `"auto" \| "scroll" \| "swipe" \| "steps"` | `"auto"` | `scroll` pins the chart while steps scroll past; `swipe` makes steps swipeable cards; `steps` shows previous/next buttons; `auto` uses scroll, or swipe on narrow touch screens. (Named `scrollMode` because `mode` is the colour mode.) |
| `side` | `"left" \| "right"` | `"left"` | Side of the text column in scroll mode. Narrow containers overlay the text on the chart. |
| `stickyTop` | `number \| string` | `0` | Offset from the top of the viewport at which the chart pins; set it to the height of a fixed header. |
| `stepHeight` | `string` | `"80vh"` | Scroll distance per step, as a CSS length. |
| `onStepChange` | `(index) => void` |  | Called when the active step changes. |
| `title` | `string` |  | Heading above the whole story. |
| `subtitle` | `string` |  | Line under the heading. |
| `source` | `string` |  | Shown after the last step as "Source: ...". Prefer the chart's own `source`, which stays visible. |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and the step cards. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `prose` (atom), `bar-chart` (atom), `line-chart` (atom)
- Used by: `visual-essay` (template)

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/scrolly-chart.md
- Component reference with every example: https://insightcharts.dev/llms/scrolly-chart.md
- Registry item: https://insightcharts.dev/r/scrolly-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/scrolly-chart.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/scrolly-chart#example-steps-mode-buttons-cumulative-patches-noir-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/scrolly-chart/steps-mode-buttons-cumulative-patches-noir-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
