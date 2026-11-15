# Build an Annotated timeline with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add an Annotated timeline (`annotated-timeline`, a molecule) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A vertical sequence of dated events along a rail, each with a short explanation and, optionally, a small chart or figure.

Use it when: Telling how something unfolded when the events matter more than a continuous measure: a policy history, an incident, a product's milestones. Four to eight events; give a figure only to the ones where a number changed.

Pick something else when: Events that should be read against a time scale, with gaps and overlaps to scale (use `timeline-chart`); a continuous series with a few annotated moments (use `line-chart` with `annotations`); ordered steps that are not dated (use `section` with `step`).

Instructions for the alternatives: `timeline-chart` https://insightcharts.dev/agents/atoms/timeline-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `section` https://insightcharts.dev/agents/molecules/section.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/annotated-timeline
```

The file lands at `components/insightcharts/molecules/annotated-timeline.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { AnnotatedTimeline } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { AnnotatedTimeline, BigNumber, Sparkline } from "insightcharts";

<AnnotatedTimeline
  theme="paper"
  title="The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023"
  subtitle="Euro area deposit facility rate and annual inflation, 2021 to 2024"
  events={[
    {
      date: "July 2021",
      title: "Inflation reaches 2.2%",
      text: "The ECB's target is 2%. The bank kept its deposit rate at −0.5%.",
    },
    {
      date: "July 2022",
      title: "The deposit rate rises from −0.5% to 0%",
      emphasis: true,
      text: "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.",
      figure: <BigNumber value="8.9%" label="Annual inflation, July 2022" context="The target is 2%" />,
    },
    {
      date: "October 2022",
      title: "Inflation reaches 10.6%",
      text: "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.",
      figure: <Sparkline
        data={[
          { month: "2022-01", rate: 5.1 },
          { month: "2022-02", rate: 5.9 },
          { month: "2022-03", rate: 7.4 },
          { month: "2022-04", rate: 7.4 },
          { month: "2022-05", rate: 8.1 },
          { month: "2022-06", rate: 8.6 },
          { month: "2022-07", rate: 8.9 },
          { month: "2022-08", rate: 9.1 },
          { month: "2022-09", rate: 9.9 },
          { month: "2022-10", rate: 10.6 },
          { month: "2022-11", rate: 10.1 },
          { month: "2022-12", rate: 9.2 },
        ]}
        x="month"
        y="rate"
        format="{value}%"
        extremes
        showValue
        style={{ maxWidth: 260 }}
      />,
    },
    {
      date: "September 2023",
      title: "The deposit rate reaches 4%",
      text: "This was the tenth rise in a row. Inflation was 4.3%.",
    },
    {
      date: "June 2024",
      title: "The deposit rate is cut to 3.75%",
      emphasis: true,
      text: "The cut was 0.25 points. Inflation was 2.5%.",
    },
  ]}
  source="European Central Bank; Eurostat"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "annotated-timeline",
  "theme": "paper",
  "title": "The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023",
  "subtitle": "Euro area deposit facility rate and annual inflation, 2021 to 2024",
  "events": [
    {
      "date": "July 2021",
      "title": "Inflation reaches 2.2%",
      "text": "The ECB's target is 2%. The bank kept its deposit rate at −0.5%."
    },
    {
      "date": "July 2022",
      "title": "The deposit rate rises from −0.5% to 0%",
      "emphasis": true,
      "text": "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.",
      "figure": {
        "type": "big-number",
        "value": "8.9%",
        "label": "Annual inflation, July 2022",
        "context": "The target is 2%"
      }
    },
    {
      "date": "October 2022",
      "title": "Inflation reaches 10.6%",
      "text": "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.",
      "figure": {
        "type": "sparkline",
        "data": [
          { "month": "2022-01", "rate": 5.1 },
          { "month": "2022-02", "rate": 5.9 },
          { "month": "2022-03", "rate": 7.4 },
          { "month": "2022-04", "rate": 7.4 },
          { "month": "2022-05", "rate": 8.1 },
          { "month": "2022-06", "rate": 8.6 },
          { "month": "2022-07", "rate": 8.9 },
          { "month": "2022-08", "rate": 9.1 },
          { "month": "2022-09", "rate": 9.9 },
          { "month": "2022-10", "rate": 10.6 },
          { "month": "2022-11", "rate": 10.1 },
          { "month": "2022-12", "rate": 9.2 }
        ],
        "x": "month",
        "y": "rate",
        "format": "{value}%",
        "extremes": true,
        "showValue": true,
        "style": { "maxWidth": 260 }
      }
    },
    {
      "date": "September 2023",
      "title": "The deposit rate reaches 4%",
      "text": "This was the tenth rise in a row. Inflation was 4.3%."
    },
    {
      "date": "June 2024",
      "title": "The deposit rate is cut to 3.75%",
      "emphasis": true,
      "text": "The cut was 0.25 points. Inflation was 2.5%."
    }
  ],
  "source": "European Central Bank; Eurostat",
  "note": "Figures are approximate, for illustration"
}
```

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `events` (required), `{ date, title, text?, figure?, emphasis? }[]`: The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events. In the example: 5 items: an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`, `figure`; an object with `date`, `title`, `text`, `figure`; ....

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `events` (required) | `{ date, title, text?, figure?, emphasis? }[]` |  | The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events. |
| `figurePosition` | `"below" \| "side"` | `"below"` | Where an event's figure sits; `side` falls back to `below` under 640px. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level of the event titles. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Scope and period. |
| `source` | `string` |  | Shown under the timeline as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to every event. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `step-marker` (atom), `prose` (atom), `sparkline` (atom), `big-number` (atom)
- Used by: `timeline-story` (template)

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
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/annotated-timeline.md
- Registry item: https://insightcharts.dev/r/annotated-timeline.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/annotated-timeline.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/annotated-timeline
- These instructions as plain text: https://insightcharts.dev/agents/molecules/annotated-timeline.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
