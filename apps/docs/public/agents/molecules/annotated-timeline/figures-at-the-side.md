# Reproduce the "Figures at the side" example of the InsightCharts Annotated timeline

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Figures at the side" example of `annotated-timeline` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Figures at the side" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { AnnotatedTimeline, BigNumber } from "insightcharts";

<AnnotatedTimeline
  figurePosition="side"
  events={[
    {
      date: "2015",
      title: "The Paris Agreement is signed",
      text: "Solar supplied 2.9% of EU electricity. Coal supplied 24.6%.",
      figure: <BigNumber value="2.9%" label="Solar share of EU electricity" />,
    },
    {
      date: "2019",
      title: "Solar module prices are half their 2015 level",
      text: "New utility-scale solar costs less than new gas plants in southern Europe.",
    },
    {
      date: "2022",
      title: "The EU adds 41 GW of solar capacity",
      emphasis: true,
      text: "Gas prices rose sharply in 2022. Solar installations were 47% higher than in 2021.",
      figure: <BigNumber
        value="41 GW"
        label="Solar capacity added in the EU"
        delta={0.47}
        deltaLabel="vs 2021"
      />,
    },
    {
      date: "2024",
      title: "Solar supplies 11.1% of EU electricity",
      text: "Coal supplied 9.8%.",
      figure: <BigNumber value="11.1%" label="Solar share of EU electricity" context="Coal supplied 9.8%" />,
    },
  ]}
  source="Ember; SolarPower Europe"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "figurePosition": "side",
  "events": [
    {
      "date": "2015",
      "title": "The Paris Agreement is signed",
      "text": "Solar supplied 2.9% of EU electricity. Coal supplied 24.6%.",
      "figure": { "type": "big-number", "value": "2.9%", "label": "Solar share of EU electricity" }
    },
    {
      "date": "2019",
      "title": "Solar module prices are half their 2015 level",
      "text": "New utility-scale solar costs less than new gas plants in southern Europe."
    },
    {
      "date": "2022",
      "title": "The EU adds 41 GW of solar capacity",
      "emphasis": true,
      "text": "Gas prices rose sharply in 2022. Solar installations were 47% higher than in 2021.",
      "figure": {
        "type": "big-number",
        "value": "41 GW",
        "label": "Solar capacity added in the EU",
        "delta": 0.47,
        "deltaLabel": "vs 2021"
      }
    },
    {
      "date": "2024",
      "title": "Solar supplies 11.1% of EU electricity",
      "text": "Coal supplied 9.8%.",
      "figure": {
        "type": "big-number",
        "value": "11.1%",
        "label": "Solar share of EU electricity",
        "context": "Coal supplied 9.8%"
      }
    }
  ],
  "source": "Ember; SolarPower Europe",
  "note": "Figures are approximate, for illustration",
  "type": "annotated-timeline"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `events` (required), `{ date, title, text?, figure?, emphasis? }[]`: The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events. In the example: 4 items: an object with `date`, `title`, `text`, `figure`; an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`, `figure`.

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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/annotated-timeline.md
- Component reference with every example: https://insightcharts.dev/llms/annotated-timeline.md
- Registry item: https://insightcharts.dev/r/annotated-timeline.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/annotated-timeline.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/annotated-timeline#example-figures-at-the-side
- These instructions as plain text: https://insightcharts.dev/agents/molecules/annotated-timeline/figures-at-the-side.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
