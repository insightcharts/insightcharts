# Reproduce the "Progress toward the same target, science" example of the InsightCharts Before and after

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Progress toward the same target, science" example of `before-after` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Two states of one measure side by side, as figures, stat tiles of any variant or small charts, with the change between them stated in the middle.

Use it when: A single measure at two moments or under two conditions: before and after a policy, control and treatment, last year and this. The change is computed from the two values unless you state it.

Pick something else when: More than two states (use `line-chart` or `slope-chart`); many entities each with a before and after (use `dumbbell-chart` or `arrow-chart`); two unrelated figures (use `stat-row`).

Instructions for the alternatives: `dumbbell-chart` https://insightcharts.dev/agents/atoms/dumbbell-chart.md, `arrow-chart` https://insightcharts.dev/agents/atoms/arrow-chart.md, `slope-chart` https://insightcharts.dev/agents/atoms/slope-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `stat-row` https://insightcharts.dev/agents/molecules/stat-row.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/before-after
```

The file lands at `components/insightcharts/molecules/before-after.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BeforeAfter } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Progress toward the same target, science" example

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BeforeAfter } from "insightcharts";

<BeforeAfter
  theme="science"
  title="Measles vaccination coverage rose from 86% to 91% between 2021 and 2024"
  subtitle="Children receiving a first dose, against the 95% WHO target"
  variant="progress"
  before={{ heading: "2021", value: 0.86, format: "percent", label: "Coverage", target: 0.95, max: 1 }}
  after={{ heading: "2024", value: 0.91, format: "percent", label: "Coverage", target: 0.95, max: 1 }}
  delta="+5 pts"
  deltaLabel="in three years"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "science",
  "title": "Measles vaccination coverage rose from 86% to 91% between 2021 and 2024",
  "subtitle": "Children receiving a first dose, against the 95% WHO target",
  "variant": "progress",
  "before": {
    "heading": "2021",
    "value": 0.86,
    "format": "percent",
    "label": "Coverage",
    "target": 0.95,
    "max": 1
  },
  "after": {
    "heading": "2024",
    "value": 0.91,
    "format": "percent",
    "label": "Coverage",
    "target": 0.95,
    "max": 1
  },
  "delta": "+5 pts",
  "deltaLabel": "in three years",
  "note": "Illustrative data",
  "type": "before-after"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `before` (required), `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }`: The first state: a figure, a chart slot, or both. The fields after `chart` apply when the states are tiles and are passed to `stat-tile`. In the example: an object with `heading`, `value`, `format`, `label`, `target`, `max`.
- `after` (required), `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }`: The second state. In the example: an object with `heading`, `value`, `format`, `label`, `target`, `max`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `before` (required) | `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }` |  | The first state: a figure, a chart slot, or both. The fields after `chart` apply when the states are tiles and are passed to `stat-tile`. |
| `after` (required) | `{ heading?, value?, label?, context?, format?, chart?, variant?, surface?, tone?, series?, target?, targetLabel?, max?, parts?, icon?, unitValue?, rank?, rankOf?, orientation? }` |  | The second state. |
| `variant` | `"plain" \| "tiles" \| StatTileVariant` | `"plain"` | `plain`: open `big-number` figures under a ruled heading. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`progress`, `ring`, `sparkline`, `area`, `bars`, `unit`, `breakdown`, `rank`, `icon`, `filled`, `tinted`, `hero`...) draws both states as that tile; a state's own `variant` overrides it. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | Tiles only: the ground of both tiles. |
| `emphasis` | `"after" \| "none"` | `"after"` | Tiles only: `after` draws the first state in neutral ink and the second in the accent; `none` draws both in the accent. A state's own `tone` overrides it. |
| `layout` | `"auto" \| "side" \| "stacked"` | `"auto"` | Side by side from 520px, or force one arrangement. |
| `deltaVariant` | `"text" \| "pill" \| "solid"` | `"pill"` | How the change between the states is set: passed to `delta`. |
| `arrow` | `boolean` | `true` | The arrow between the states. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing and tile scale (`sm`, `md`, `lg`). |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `delta` | `number \| string` |  | The change stated between the two. Default: the relative change when both values are numbers. |
| `deltaLabel` | `string` |  | Words under the change, e.g. "in five years". |
| `deltaFormat` | `FormatSpec` | `signed percent` | Number format for a numeric `delta`. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the colour of the change. |
| `format` | `FormatSpec` | `"auto"` | Number format shared by both values. |
| `title` | `string` |  | The change stated plainly, with both values and the period. |
| `subtitle` | `string` |  | Measure and population. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A theme name such as `"editorial"`, or token overrides, passed on to both states. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `big-number` (atom), `stat-tile` (atom), `delta` (atom), `bar-chart` (atom), `sparkline` (atom)
- Used by: no molecule or template yet.

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
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/before-after.md
- Component reference with every example: https://insightcharts.dev/llms/before-after.md
- Registry item: https://insightcharts.dev/r/before-after.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/before-after.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/before-after#example-progress-toward-the-same-target-science
- These instructions as plain text: https://insightcharts.dev/agents/molecules/before-after/progress-toward-the-same-target-science.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
