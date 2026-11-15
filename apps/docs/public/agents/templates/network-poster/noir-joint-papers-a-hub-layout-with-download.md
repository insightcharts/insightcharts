# Reproduce the "Noir, joint papers, a hub layout, with download" example of the InsightCharts Network poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Noir, joint papers, a hub layout, with download" example of `network-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A poster of who is connected to whom: a full-width arc diagram with one arc per connection, as thick as its value (`arc-diagram`), a strip of two to four large figures, and a bottom row where the same entities return as circles joined by lines (`bubble-network`) and as a ranking of centred pills (`pill-rank`).

Use it when: Use it when the connections between 5 to about 20 named things are the subject: ferry crossings between harbours, joint papers between institutes, freight between rail yards. Give `hero` one row per connection and the `order` the entities sit in, `map` the entities with a size and optional hand-placed `x` and `y`, and `rank` one measure of each entity. With `linked`, a click on an entity in any of the three highlights it in the other two.

Pick something else when: A flow from sources to destinations in one direction (use `flow-poster` or `sankey-chart`). More than about 20 entities or 40 connections, because the arcs cover each other. Entities with no meaningful order and few links (use `bubble-network` in a `poster`). Parts of one subject (use `radial-poster`).

Instructions for the alternatives: `bubble-network` https://insightcharts.dev/agents/atoms/bubble-network.md, `radial-poster` https://insightcharts.dev/agents/templates/radial-poster.md, `sankey-chart` https://insightcharts.dev/agents/atoms/sankey-chart.md, `flow-poster` https://insightcharts.dev/agents/templates/flow-poster.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/network-poster
```

The file lands at `components/insightcharts/templates/network-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { NetworkPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. The "Noir, joint papers, a hub layout, with download" example

This example sets `theme="noir"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

```tsx
import { NetworkPoster } from "insightcharts";

<NetworkPoster
  theme="noir"
  download
  kicker="Research"
  title="Six Norland institutes published 369 joint papers in 2025"
  subtitle="Papers with authors at two of the six institutes, by pair, 2025."
  hero={{
    data: [
      { a: "Marlow", b: "Halden", papers: 84 },
      { a: "Marlow", b: "Orrin", papers: 61 },
      { a: "Marlow", b: "Carrow", papers: 37 },
      { a: "Halden", b: "Orrin", papers: 52 },
      { a: "Halden", b: "Kestrel", papers: 29 },
      { a: "Orrin", b: "Carrow", papers: 44 },
      { a: "Orrin", b: "Aldern", papers: 18 },
      { a: "Carrow", b: "Kestrel", papers: 23 },
      { a: "Kestrel", b: "Aldern", papers: 12 },
      { a: "Marlow", b: "Aldern", papers: 9 },
    ],
    from: "a",
    to: "b",
    value: "papers",
    order: ["Marlow", "Halden", "Orrin", "Carrow", "Kestrel", "Aldern"],
    colorBy: "none",
    highlight: "Marlow",
    title: "Marlow and Halden shared 84 papers",
  }}
  figures={[
    { value: "191", label: "of the 369 papers had a Marlow author" },
    { value: "84", label: "papers were shared by Marlow and Halden" },
    { value: "39", label: "papers had an Aldern author" },
  ]}
  map={{
    data: [
      { institute: "Marlow", staff: 640 },
      { institute: "Halden", staff: 510 },
      { institute: "Orrin", staff: 470 },
      { institute: "Carrow", staff: 290 },
      { institute: "Kestrel", staff: 180 },
      { institute: "Aldern", staff: 95 },
    ],
    name: "institute",
    value: "staff",
    layout: "hub",
    links: [
      { from: "Marlow", to: "Halden", value: 84 },
      { from: "Marlow", to: "Orrin", value: 61 },
      { from: "Marlow", to: "Carrow", value: 37 },
      { from: "Halden", to: "Orrin", value: 52 },
      { from: "Halden", to: "Kestrel", value: 29 },
      { from: "Orrin", to: "Carrow", value: 44 },
      { from: "Orrin", to: "Aldern", value: 18 },
      { from: "Carrow", to: "Kestrel", value: 23 },
      { from: "Kestrel", to: "Aldern", value: 12 },
      { from: "Marlow", to: "Aldern", value: 9 },
    ],
    highlight: "Marlow",
    tag: "640 researchers",
    linkLabels: false,
    title: "Marlow employed 640 researchers",
    subtitle: "Research staff at each institute. Line width is the number of joint papers.",
  }}
  rank={{
    data: [
      { institute: "Marlow", staff: 640 },
      { institute: "Halden", staff: 510 },
      { institute: "Orrin", staff: 470 },
      { institute: "Carrow", staff: 290 },
      { institute: "Kestrel", staff: 180 },
      { institute: "Aldern", staff: 95 },
    ],
    name: "institute",
    value: "staff",
    highlight: "Marlow",
    title: "Aldern employed 95 researchers",
  }}
  sources="Norland Research Council, publication register 2025"
  note="The institutes are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "noir",
  "download": true,
  "kicker": "Research",
  "title": "Six Norland institutes published 369 joint papers in 2025",
  "subtitle": "Papers with authors at two of the six institutes, by pair, 2025.",
  "hero": {
    "data": [
      { "a": "Marlow", "b": "Halden", "papers": 84 },
      { "a": "Marlow", "b": "Orrin", "papers": 61 },
      { "a": "Marlow", "b": "Carrow", "papers": 37 },
      { "a": "Halden", "b": "Orrin", "papers": 52 },
      { "a": "Halden", "b": "Kestrel", "papers": 29 },
      { "a": "Orrin", "b": "Carrow", "papers": 44 },
      { "a": "Orrin", "b": "Aldern", "papers": 18 },
      { "a": "Carrow", "b": "Kestrel", "papers": 23 },
      { "a": "Kestrel", "b": "Aldern", "papers": 12 },
      { "a": "Marlow", "b": "Aldern", "papers": 9 }
    ],
    "from": "a",
    "to": "b",
    "value": "papers",
    "order": ["Marlow", "Halden", "Orrin", "Carrow", "Kestrel", "Aldern"],
    "colorBy": "none",
    "highlight": "Marlow",
    "title": "Marlow and Halden shared 84 papers"
  },
  "figures": [
    { "value": "191", "label": "of the 369 papers had a Marlow author" },
    { "value": "84", "label": "papers were shared by Marlow and Halden" },
    { "value": "39", "label": "papers had an Aldern author" }
  ],
  "map": {
    "data": [
      { "institute": "Marlow", "staff": 640 },
      { "institute": "Halden", "staff": 510 },
      { "institute": "Orrin", "staff": 470 },
      { "institute": "Carrow", "staff": 290 },
      { "institute": "Kestrel", "staff": 180 },
      { "institute": "Aldern", "staff": 95 }
    ],
    "name": "institute",
    "value": "staff",
    "layout": "hub",
    "links": [
      { "from": "Marlow", "to": "Halden", "value": 84 },
      { "from": "Marlow", "to": "Orrin", "value": 61 },
      { "from": "Marlow", "to": "Carrow", "value": 37 },
      { "from": "Halden", "to": "Orrin", "value": 52 },
      { "from": "Halden", "to": "Kestrel", "value": 29 },
      { "from": "Orrin", "to": "Carrow", "value": 44 },
      { "from": "Orrin", "to": "Aldern", "value": 18 },
      { "from": "Carrow", "to": "Kestrel", "value": 23 },
      { "from": "Kestrel", "to": "Aldern", "value": 12 },
      { "from": "Marlow", "to": "Aldern", "value": 9 }
    ],
    "highlight": "Marlow",
    "tag": "640 researchers",
    "linkLabels": false,
    "title": "Marlow employed 640 researchers",
    "subtitle": "Research staff at each institute. Line width is the number of joint papers."
  },
  "rank": {
    "data": [
      { "institute": "Marlow", "staff": 640 },
      { "institute": "Halden", "staff": 510 },
      { "institute": "Orrin", "staff": 470 },
      { "institute": "Carrow", "staff": 290 },
      { "institute": "Kestrel", "staff": 180 },
      { "institute": "Aldern", "staff": 95 }
    ],
    "name": "institute",
    "value": "staff",
    "highlight": "Marlow",
    "title": "Aldern employed 95 researchers"
  },
  "sources": "Norland Research Council, publication register 2025",
  "note": "The institutes are invented. All figures are illustrative.",
  "credit": "InsightCharts",
  "type": "network-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `hero` (required), `{ data, from, to, value?, order?, colorBy?, arcLabels?, orientation?, format?, highlight?, title?, ... } | Slot`: The hero: one arc per pair of connected entities, drawn by `arc-diagram`. Rows joining the same pair are summed. A full spec or element replaces it. In the example: a config with 10 rows of `data` and the fields `from: "a"`, `to: "b"`, `value: "papers"`.
- `figures`, `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]`: Two to four large figures in a strip under the hero. In the example: 3 items: an object with `value`, `label`.
- `map`, `{ data, name, value, links?, x?, y?, layout?, tag?, highlight?, format?, title?, ... } | Slot`: Bottom left: the entities as circles sized by `value` and joined by `links: { from, to, value? }[]` (`bubble-network`). `x` and `y` (0 to 100) place the circles by hand. In the example: a config with 6 rows of `data` and the fields `name: "institute"`, `value: "staff"`.
- `rank`, `{ data, name, value, highlight?, compare?, format?, title?, ... } | Slot`: Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). With only one of `map` and `rank`, that one takes the full width. In the example: a config with 6 rows of `data` and the fields `name: "institute"`, `value: "staff"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, from, to, value?, order?, colorBy?, arcLabels?, orientation?, format?, highlight?, title?, ... } \| Slot` |  | The hero: one arc per pair of connected entities, drawn by `arc-diagram`. Rows joining the same pair are summed. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures in a strip under the hero. |
| `map` | `{ data, name, value, links?, x?, y?, layout?, tag?, highlight?, format?, title?, ... } \| Slot` |  | Bottom left: the entities as circles sized by `value` and joined by `links: { from, to, value? }[]` (`bubble-network`). `x` and `y` (0 to 100) place the circles by hand. |
| `rank` | `{ data, name, value, highlight?, compare?, format?, title?, ... } \| Slot` |  | Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). With only one of `map` and `rank`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"dusk"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Built from: `poster` (molecule), `arc-diagram` (atom), `bubble-network` (atom), `pill-rank` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/network-poster.md
- Component reference with every example: https://insightcharts.dev/llms/network-poster.md
- Registry item: https://insightcharts.dev/r/network-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/network-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/network-poster#example-noir-joint-papers-a-hub-layout-with-download
- These instructions as plain text: https://insightcharts.dev/agents/templates/network-poster/noir-joint-papers-a-hub-layout-with-download.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
