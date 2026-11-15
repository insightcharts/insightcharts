# Build a Section with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Section (`section`, a molecule) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A story section: a numbered step marker or a headline, introductory prose, then one or more exhibits in a responsive one- to three-column grid.

Use it when: The building block of a longer piece. Each section states one fact with its number in the title, explains it in a paragraph and shows it in one to three exhibits. Use `step` when the sections are read in order.

Pick something else when: The opening of a piece (use `hero-figure`); a single chart with one callout (use `chart-callout` directly); more than three exhibits in one section (split it).

Instructions for the alternatives: `chart-callout` https://insightcharts.dev/agents/molecules/chart-callout.md, `hero-figure` https://insightcharts.dev/agents/molecules/hero-figure.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/section
```

The file lands at `components/insightcharts/molecules/section.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Section } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { BarChart, LineChart, Section } from "insightcharts";

<Section
  theme="ocean"
  step={2}
  total={4}
  title="First-quarter churn was 2.0% for customers who joined after March"
  intro="Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%."
  columns={2}
  body={[
    <LineChart
      data={[
        { month: "2024-01-01", rate: 4.2 },
        { month: "2024-02-01", rate: 4.3 },
        { month: "2024-03-01", rate: 4.1 },
        { month: "2024-04-01", rate: 3.6 },
        { month: "2024-05-01", rate: 3.1 },
        { month: "2024-06-01", rate: 2.9 },
        { month: "2024-07-01", rate: 2.6 },
        { month: "2024-08-01", rate: 2.4 },
        { month: "2024-09-01", rate: 2.3 },
        { month: "2024-10-01", rate: 2.2 },
        { month: "2024-11-01", rate: 2.1 },
        { month: "2024-12-01", rate: 2.1 },
      ]}
      x="month"
      y="rate"
      format="{value}%"
      zero
      height={240}
      title="Monthly churn fell from 4.2% to 2.1% in 2024"
      subtitle="Monthly customer churn, 2024"
      annotations={[{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }]}
    />,
    <BarChart
      data={[{ cohort: "Before March", churn: 4.1 }, { cohort: "After March", churn: 2 }]}
      x="cohort"
      y="churn"
      format="{value}%"
      height={240}
      highlight="After March"
      title="First-quarter churn was 4.1% for customers who joined before March"
      subtitle="First-quarter churn by sign-up cohort, 2024"
    />,
  ]}
  outro="The next section covers the first 90 days after sign-up."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "section",
  "theme": "ocean",
  "step": 2,
  "total": 4,
  "title": "First-quarter churn was 2.0% for customers who joined after March",
  "intro": "Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%.",
  "columns": 2,
  "body": [
    {
      "type": "line-chart",
      "data": [
        { "month": "2024-01-01", "rate": 4.2 },
        { "month": "2024-02-01", "rate": 4.3 },
        { "month": "2024-03-01", "rate": 4.1 },
        { "month": "2024-04-01", "rate": 3.6 },
        { "month": "2024-05-01", "rate": 3.1 },
        { "month": "2024-06-01", "rate": 2.9 },
        { "month": "2024-07-01", "rate": 2.6 },
        { "month": "2024-08-01", "rate": 2.4 },
        { "month": "2024-09-01", "rate": 2.3 },
        { "month": "2024-10-01", "rate": 2.2 },
        { "month": "2024-11-01", "rate": 2.1 },
        { "month": "2024-12-01", "rate": 2.1 }
      ],
      "x": "month",
      "y": "rate",
      "format": "{value}%",
      "zero": true,
      "height": 240,
      "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
      "subtitle": "Monthly customer churn, 2024",
      "annotations": [{ "type": "line", "axis": "x", "value": "2024-03-01", "label": "New onboarding" }]
    },
    {
      "type": "bar-chart",
      "data": [{ "cohort": "Before March", "churn": 4.1 }, { "cohort": "After March", "churn": 2 }],
      "x": "cohort",
      "y": "churn",
      "format": "{value}%",
      "height": 240,
      "highlight": "After March",
      "title": "First-quarter churn was 4.1% for customers who joined before March",
      "subtitle": "First-quarter churn by sign-up cohort, 2024"
    }
  ],
  "outro": "The next section covers the first 90 days after sign-up."
}
```

This example sets `theme="ocean"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `intro`, `string | string[]`: Introductory narration. Supports `**bold**`, `*italic*` and links. In the example: text.
- `body`, `Slot | Slot[]`: The exhibits: one slot or several, each a spec or a React element. In the example: 2 items: a `line-chart` spec with 12 rows; a `bar-chart` spec with 2 rows.
- `outro`, `string | string[]`: Closing narration under the body. In the example: `"The next section covers the first 90 days after sign-up."`.
- `children`, `ReactNode`: JSX alternative to `body`; each child becomes a grid item. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` |  | The section's main fact, as one plain sentence with its number. |
| `step` | `number \| string` |  | Step number: turns the heading into a numbered chapter marker ("02 — ..."). |
| `total` | `number` |  | Total steps, shown as "02 / 05". |
| `kicker` | `string` |  | Small label above an unnumbered heading. |
| `deck` | `string` |  | One plain sentence under the heading that adds a second fact. |
| `intro` | `string \| string[]` |  | Introductory narration. Supports `**bold**`, `*italic*` and links. |
| `body` | `Slot \| Slot[]` |  | The exhibits: one slot or several, each a spec or a React element. |
| `columns` | `1 \| 2 \| 3` | `1` | Columns for the body at full width; reduced under 720px and 520px. |
| `outro` | `string \| string[]` |  | Closing narration under the body. |
| `rule` | `boolean` | `false` | Hairline above the section. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level. |
| `id` | `string` |  | Anchor id for deep links. |
| `spacing` | `"compact" \| "comfortable"` | `"comfortable"` | Vertical rhythm between heading, intro and body. |
| `children` | `ReactNode` |  | JSX alternative to `body`; each child becomes a grid item. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `step-marker` (atom), `headline` (atom), `prose` (atom), `line-chart` (atom), `bar-chart` (atom), `area-chart` (atom), `stat-tile` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/section.md
- Registry item: https://insightcharts.dev/r/section.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/section.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/section
- These instructions as plain text: https://insightcharts.dev/agents/molecules/section.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
