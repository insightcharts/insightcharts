# Reproduce the "Paper, library loans, with download" example of the InsightCharts Timeline poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Paper, library loans, with download" example of `timeline-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A poster of change over a run of periods: a full-width ribbon of bands whose thickness is each entity's value and whose order is its rank (`ribbon-chart`), a strip of two to four dated figures under it, and a bottom row with one measure per period as thick bars (`block-bar`) and one share at several dates as nested outlines (`nested-shares`).

Use it when: Use it when the subject is how 4 to 8 named things grew, shrank and changed places over 4 to 10 periods: electricity by source, library loans by format, commuters by mode. Give `hero` the periods and entities, `milestones` the dated numbers a reader should take away, `bars` one measure of the whole at each period and `shares` one share at a few dates. State the latest value in the title.

Pick something else when: A single series over time (use `line-chart` or `area-chart` in a `poster`). Events with start and end dates (use `timeline-chart` or the `timeline-story` template). More than 8 entities or 10 periods, because the bands get too thin to label. Positions on one scale (use `scale-poster`). Parts of one subject at one date (use `radial-poster`).

Instructions for the alternatives: `timeline-chart` https://insightcharts.dev/agents/atoms/timeline-chart.md, `timeline-story` https://insightcharts.dev/agents/templates/timeline-story.md, `radial-poster` https://insightcharts.dev/agents/templates/radial-poster.md, `scale-poster` https://insightcharts.dev/agents/templates/scale-poster.md, `area-chart` https://insightcharts.dev/agents/atoms/area-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-poster
```

The file lands at `components/insightcharts/templates/timeline-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { TimelinePoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. The "Paper, library loans, with download" example

This example sets `theme="paper"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

```tsx
import { TimelinePoster } from "insightcharts";

<TimelinePoster
  theme="paper"
  download
  kicker="Libraries"
  title="Marlow's libraries lent 226,000 audiobooks in 2025"
  subtitle="Items lent by the Marlow library service by format, thousands, every third year from 2013 to 2025."
  hero={{
    data: [
      {
        year: "2013",
        "Printed books": 412,
        "E-books": 38,
        Audiobooks: 21,
        Films: 96,
        Magazines: 64,
      },
      {
        year: "2016",
        "Printed books": 371,
        "E-books": 84,
        Audiobooks: 47,
        Films: 71,
        Magazines: 52,
      },
      {
        year: "2019",
        "Printed books": 338,
        "E-books": 131,
        Audiobooks: 92,
        Films: 44,
        Magazines: 39,
      },
      {
        year: "2022",
        "Printed books": 296,
        "E-books": 187,
        Audiobooks: 158,
        Films: 23,
        Magazines: 31,
      },
      {
        year: "2025",
        "Printed books": 281,
        "E-books": 204,
        Audiobooks: 226,
        Films: 12,
        Magazines: 24,
      },
    ],
    x: "year",
    y: ["Printed books", "E-books", "Audiobooks", "Films", "Magazines"],
    colorBy: "series",
    format: "{value}k",
    title: "Printed-book loans fell from 412,000 to 281,000",
  }}
  milestones={[
    { at: "2013", value: "21k", label: "audiobooks were lent" },
    { at: "2022", value: "187k", label: "e-books were lent", context: "38,000 in 2013" },
    {
      at: "2025",
      value: "747k",
      label: "items were lent in all formats",
      context: "631,000 in 2013",
    },
  ]}
  bars={{
    data: [
      { year: "2013", k: 58 },
      { year: "2016", k: 61 },
      { year: "2019", k: 67 },
      { year: "2022", k: 74 },
      { year: "2025", k: 83 },
    ],
    name: "year",
    value: "k",
    format: "{value}k",
    title: "The service had 83,000 members in 2025",
  }}
  shares={{
    data: [{ year: "2013", share: 9 }, { year: "2019", share: 35 }, { year: "2025", share: 58 }],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All loans",
    title: "E-books and audiobooks were 58% of loans in 2025",
  }}
  sources="Marlow library service, annual lending returns"
  note="The Marlow library service is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "download": true,
  "kicker": "Libraries",
  "title": "Marlow's libraries lent 226,000 audiobooks in 2025",
  "subtitle": "Items lent by the Marlow library service by format, thousands, every third year from 2013 to 2025.",
  "hero": {
    "data": [
      {
        "year": "2013",
        "Printed books": 412,
        "E-books": 38,
        "Audiobooks": 21,
        "Films": 96,
        "Magazines": 64
      },
      {
        "year": "2016",
        "Printed books": 371,
        "E-books": 84,
        "Audiobooks": 47,
        "Films": 71,
        "Magazines": 52
      },
      {
        "year": "2019",
        "Printed books": 338,
        "E-books": 131,
        "Audiobooks": 92,
        "Films": 44,
        "Magazines": 39
      },
      {
        "year": "2022",
        "Printed books": 296,
        "E-books": 187,
        "Audiobooks": 158,
        "Films": 23,
        "Magazines": 31
      },
      {
        "year": "2025",
        "Printed books": 281,
        "E-books": 204,
        "Audiobooks": 226,
        "Films": 12,
        "Magazines": 24
      }
    ],
    "x": "year",
    "y": ["Printed books", "E-books", "Audiobooks", "Films", "Magazines"],
    "colorBy": "series",
    "format": "{value}k",
    "title": "Printed-book loans fell from 412,000 to 281,000"
  },
  "milestones": [
    { "at": "2013", "value": "21k", "label": "audiobooks were lent" },
    { "at": "2022", "value": "187k", "label": "e-books were lent", "context": "38,000 in 2013" },
    {
      "at": "2025",
      "value": "747k",
      "label": "items were lent in all formats",
      "context": "631,000 in 2013"
    }
  ],
  "bars": {
    "data": [
      { "year": "2013", "k": 58 },
      { "year": "2016", "k": 61 },
      { "year": "2019", "k": 67 },
      { "year": "2022", "k": 74 },
      { "year": "2025", "k": 83 }
    ],
    "name": "year",
    "value": "k",
    "format": "{value}k",
    "title": "The service had 83,000 members in 2025"
  },
  "shares": {
    "data": [
      { "year": "2013", "share": 9 },
      { "year": "2019", "share": 35 },
      { "year": "2025", "share": 58 }
    ],
    "name": "year",
    "value": "share",
    "highlight": "2025",
    "wholeLabel": "All loans",
    "title": "E-books and audiobooks were 58% of loans in 2025"
  },
  "sources": "Marlow library service, annual lending returns",
  "note": "The Marlow library service is invented. All figures are illustrative.",
  "credit": "InsightCharts",
  "type": "timeline-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `hero` (required), `{ data, x, y, series?, values?, labels?, colorBy?, format?, highlight?, title?, ... } | Slot`: The hero: one band per entity across the periods, drawn by `ribbon-chart`. Wide rows take `y` as a list of columns; long rows take `y` and `series`. A full spec or element replaces it. In the example: a config with 5 rows of `data` and the fields `x: "year"`.
- `milestones`, `{ at: string; value: string; label: string; context?: string; icon?: string }[]`: Two to four dated figures in a strip under the hero, in time order. `at` is the period, printed in small capitals over the figure. In the example: 3 items: an object with `at`, `value`, `label`; an object with `at`, `value`, `label`, `context`.
- `bars`, `{ data, name, value, marker?, detail?, format?, title?, ... } | Slot`: Bottom left: one measure at each period as thick bars with the numbers inside (`block-bar`). `marker: { after, label }` draws a dotted line after one period to mark an event. In the example: a config with 5 rows of `data` and the fields `name: "year"`, `value: "k"`.
- `shares`, `{ data, name, value, wholeLabel?, highlight?, format?, title?, ... } | Slot`: Bottom right: one share at 2 to 8 dates as outlines nested in one square (`nested-shares`). `format` defaults to `"{value}%"`. With only one of `bars` and `shares`, that one takes the full width. In the example: a config with 3 rows of `data` and the fields `name: "year"`, `value: "share"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, x, y, series?, values?, labels?, colorBy?, format?, highlight?, title?, ... } \| Slot` |  | The hero: one band per entity across the periods, drawn by `ribbon-chart`. Wide rows take `y` as a list of columns; long rows take `y` and `series`. A full spec or element replaces it. |
| `milestones` | `{ at: string; value: string; label: string; context?: string; icon?: string }[]` |  | Two to four dated figures in a strip under the hero, in time order. `at` is the period, printed in small capitals over the figure. |
| `bars` | `{ data, name, value, marker?, detail?, format?, title?, ... } \| Slot` |  | Bottom left: one measure at each period as thick bars with the numbers inside (`block-bar`). `marker: { after, label }` draws a dotted line after one period to mark an event. |
| `shares` | `{ data, name, value, wholeLabel?, highlight?, format?, title?, ... } \| Slot` |  | Bottom right: one share at 2 to 8 dates as outlines nested in one square (`nested-shares`). `format` defaults to `"{value}%"`. With only one of `bars` and `shares`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"sunrise"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1100` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `ribbon-chart` (atom), `block-bar` (atom), `nested-shares` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- `title` is the poster's one fact with its number. Keep other text short.
- Do not set colours. Pick a poster theme with `theme`. A poster keeps its own colours in dark mode.
- Set `sources`. Say in `note` when figures are illustrative.
- A poster becomes one column under 600px wide, in the order of its regions. Order them for that reading.
- Set `download` when the user wants the whole piece as one PNG. It adds a "Download PNG" control under the piece.
- Set `linked` to make a click on a mark filter the other regions.
- Poster themes: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] The poster keeps its own colours on a dark page.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/timeline-poster.md
- Component reference with every example: https://insightcharts.dev/llms/timeline-poster.md
- Registry item: https://insightcharts.dev/r/timeline-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/timeline-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/timeline-poster#example-paper-library-loans-with-download
- These instructions as plain text: https://insightcharts.dev/agents/templates/timeline-poster/paper-library-loans-with-download.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
