# Reproduce the "Sea ice minimums, ocean theme" example of the InsightCharts Annotated timeline

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Sea ice minimums, ocean theme" example of `annotated-timeline` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Sea ice minimums, ocean theme" example

This example sets `theme="ocean"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { AnnotatedTimeline, BigNumber, Sparkline } from "insightcharts";

<AnnotatedTimeline
  theme="ocean"
  title="Arctic sea ice reached a record low of 3.4 million km² in September 2012"
  subtitle="Annual minimum extent of Arctic sea ice, million km², 1979 to 2024"
  events={[
    {
      date: "1979",
      title: "The satellite record begins",
      text: "The September minimum was 6.9 million km².",
      figure: <BigNumber value="6.9m km²" label="Minimum sea ice extent, 1979" />,
    },
    {
      date: "2007",
      title: "The minimum falls to 4.2 million km²",
      text: "It was 5.8 million km² in 2006.",
    },
    {
      date: "2012",
      title: "The minimum reaches 3.4 million km²",
      emphasis: true,
      text: "This is the lowest minimum in the satellite record.",
      figure: <Sparkline
        data={[
          { year: "2003", extent: 6.1 },
          { year: "2004", extent: 6 },
          { year: "2005", extent: 5.5 },
          { year: "2006", extent: 5.8 },
          { year: "2007", extent: 4.2 },
          { year: "2008", extent: 4.7 },
          { year: "2009", extent: 5.1 },
          { year: "2010", extent: 4.9 },
          { year: "2011", extent: 4.6 },
          { year: "2012", extent: 3.4 },
        ]}
        x="year"
        y="extent"
        format="{value}m km²"
        extremes
        showValue
        style={{ maxWidth: 260 }}
      />,
    },
    {
      date: "2020",
      title: "The minimum is 3.8 million km²",
      text: "This is the second lowest minimum in the record.",
    },
    {
      date: "2024",
      title: "The minimum is 4.3 million km²",
      emphasis: true,
      text: "The 2024 minimum was 38% below the 1979 minimum.",
      figure: <BigNumber
        value="4.3m km²"
        label="Minimum sea ice extent, 2024"
        delta={-0.38}
        deltaLabel="vs 1979"
      />,
    },
  ]}
  source="National Snow and Ice Data Center"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ocean",
  "title": "Arctic sea ice reached a record low of 3.4 million km² in September 2012",
  "subtitle": "Annual minimum extent of Arctic sea ice, million km², 1979 to 2024",
  "events": [
    {
      "date": "1979",
      "title": "The satellite record begins",
      "text": "The September minimum was 6.9 million km².",
      "figure": { "type": "big-number", "value": "6.9m km²", "label": "Minimum sea ice extent, 1979" }
    },
    {
      "date": "2007",
      "title": "The minimum falls to 4.2 million km²",
      "text": "It was 5.8 million km² in 2006."
    },
    {
      "date": "2012",
      "title": "The minimum reaches 3.4 million km²",
      "emphasis": true,
      "text": "This is the lowest minimum in the satellite record.",
      "figure": {
        "type": "sparkline",
        "data": [
          { "year": "2003", "extent": 6.1 },
          { "year": "2004", "extent": 6 },
          { "year": "2005", "extent": 5.5 },
          { "year": "2006", "extent": 5.8 },
          { "year": "2007", "extent": 4.2 },
          { "year": "2008", "extent": 4.7 },
          { "year": "2009", "extent": 5.1 },
          { "year": "2010", "extent": 4.9 },
          { "year": "2011", "extent": 4.6 },
          { "year": "2012", "extent": 3.4 }
        ],
        "x": "year",
        "y": "extent",
        "format": "{value}m km²",
        "extremes": true,
        "showValue": true,
        "style": { "maxWidth": 260 }
      }
    },
    {
      "date": "2020",
      "title": "The minimum is 3.8 million km²",
      "text": "This is the second lowest minimum in the record."
    },
    {
      "date": "2024",
      "title": "The minimum is 4.3 million km²",
      "emphasis": true,
      "text": "The 2024 minimum was 38% below the 1979 minimum.",
      "figure": {
        "type": "big-number",
        "value": "4.3m km²",
        "label": "Minimum sea ice extent, 2024",
        "delta": -0.38,
        "deltaLabel": "vs 1979"
      }
    }
  ],
  "source": "National Snow and Ice Data Center",
  "note": "Figures are approximate, for illustration",
  "type": "annotated-timeline"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `events` (required), `{ date, title, text?, figure?, emphasis? }[]`: The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events. In the example: 5 items: an object with `date`, `title`, `text`, `figure`; an object with `date`, `title`, `text`; an object with `date`, `title`, `emphasis`, `text`, `figure`.

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
- This page: https://insightcharts.dev/molecules/annotated-timeline#example-sea-ice-minimums-ocean-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/annotated-timeline/sea-ice-minimums-ocean-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
