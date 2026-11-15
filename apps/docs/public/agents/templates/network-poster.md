# Build a Network poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Network poster (`network-poster`, an infographic template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

```tsx
import { NetworkPoster } from "insightcharts";

<NetworkPoster
  theme="dusk"
  linked
  kicker="Ferries"
  title="Skerry Isles ferries carried 1.66 million passengers on 12 routes in 2025"
  subtitle="Passengers carried between pairs of harbours, thousands, both directions, 2025."
  hero={{
    data: [
      { a: "Port Aven", b: "Brae", k: 412 },
      { a: "Port Aven", b: "Storholm", k: 268 },
      { a: "Port Aven", b: "Little Skerry", k: 96 },
      { a: "Brae", b: "Storholm", k: 187 },
      { a: "Brae", b: "Tarn Head", k: 74 },
      { a: "Storholm", b: "Tarn Head", k: 153 },
      { a: "Storholm", b: "Ness", k: 121 },
      { a: "Tarn Head", b: "Ness", k: 88 },
      { a: "Ness", b: "Outer Holm", k: 43 },
      { a: "Little Skerry", b: "Brae", k: 52 },
      { a: "Port Aven", b: "Ness", k: 139 },
      { a: "Storholm", b: "Outer Holm", k: 31 },
    ],
    from: "a",
    to: "b",
    value: "k",
    order: ["Port Aven", "Little Skerry", "Brae", "Storholm", "Tarn Head", "Ness", "Outer Holm"],
    colorBy: "series",
    format: "{value}k",
    title: "412,000 passengers crossed between Port Aven and Brae",
  }}
  figures={[
    { value: "412k", label: "passengers on the busiest route", context: "Port Aven to Brae" },
    { value: "31k", label: "passengers on the quietest route", context: "Storholm to Outer Holm" },
    { value: "4", label: "of the 12 routes call at Port Aven" },
  ]}
  map={{
    data: [
      { harbour: "Port Aven", k: 915, x: 12, y: 62 },
      { harbour: "Little Skerry", k: 148, x: 22, y: 18 },
      { harbour: "Brae", k: 725, x: 38, y: 40 },
      { harbour: "Storholm", k: 760, x: 56, y: 80 },
      { harbour: "Tarn Head", k: 315, x: 66, y: 22 },
      { harbour: "Ness", k: 391, x: 84, y: 46 },
      { harbour: "Outer Holm", k: 74, x: 93, y: 82 },
    ],
    name: "harbour",
    value: "k",
    x: "x",
    y: "y",
    links: [
      { from: "Port Aven", to: "Brae" },
      { from: "Port Aven", to: "Storholm" },
      { from: "Port Aven", to: "Little Skerry" },
      { from: "Brae", to: "Storholm" },
      { from: "Brae", to: "Tarn Head" },
      { from: "Storholm", to: "Tarn Head" },
      { from: "Storholm", to: "Ness" },
      { from: "Tarn Head", to: "Ness" },
      { from: "Ness", to: "Outer Holm" },
      { from: "Little Skerry", to: "Brae" },
      { from: "Port Aven", to: "Ness" },
      { from: "Storholm", to: "Outer Holm" },
    ],
    format: "{value}k",
    highlight: "Port Aven",
    tag: "Busiest harbour",
    title: "915,000 passengers used Port Aven",
    subtitle: "Passengers through each harbour, thousands. Positions are approximate.",
  }}
  rank={{
    data: [
      { harbour: "Port Aven", sailings: 46 },
      { harbour: "Storholm", sailings: 38 },
      { harbour: "Brae", sailings: 33 },
      { harbour: "Ness", sailings: 21 },
      { harbour: "Tarn Head", sailings: 16 },
      { harbour: "Little Skerry", sailings: 8 },
      { harbour: "Outer Holm", sailings: 4 },
    ],
    name: "harbour",
    value: "sailings",
    title: "Port Aven had 46 sailings a day",
    subtitle: "Scheduled departures per day, summer 2025.",
  }}
  sources="Skerry Isles Ferries, annual traffic return 2025"
  note="The Skerry Isles are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "network-poster",
  "theme": "dusk",
  "linked": true,
  "kicker": "Ferries",
  "title": "Skerry Isles ferries carried 1.66 million passengers on 12 routes in 2025",
  "subtitle": "Passengers carried between pairs of harbours, thousands, both directions, 2025.",
  "hero": {
    "data": [
      { "a": "Port Aven", "b": "Brae", "k": 412 },
      { "a": "Port Aven", "b": "Storholm", "k": 268 },
      { "a": "Port Aven", "b": "Little Skerry", "k": 96 },
      { "a": "Brae", "b": "Storholm", "k": 187 },
      { "a": "Brae", "b": "Tarn Head", "k": 74 },
      { "a": "Storholm", "b": "Tarn Head", "k": 153 },
      { "a": "Storholm", "b": "Ness", "k": 121 },
      { "a": "Tarn Head", "b": "Ness", "k": 88 },
      { "a": "Ness", "b": "Outer Holm", "k": 43 },
      { "a": "Little Skerry", "b": "Brae", "k": 52 },
      { "a": "Port Aven", "b": "Ness", "k": 139 },
      { "a": "Storholm", "b": "Outer Holm", "k": 31 }
    ],
    "from": "a",
    "to": "b",
    "value": "k",
    "order": ["Port Aven", "Little Skerry", "Brae", "Storholm", "Tarn Head", "Ness", "Outer Holm"],
    "colorBy": "series",
    "format": "{value}k",
    "title": "412,000 passengers crossed between Port Aven and Brae"
  },
  "figures": [
    { "value": "412k", "label": "passengers on the busiest route", "context": "Port Aven to Brae" },
    {
      "value": "31k",
      "label": "passengers on the quietest route",
      "context": "Storholm to Outer Holm"
    },
    { "value": "4", "label": "of the 12 routes call at Port Aven" }
  ],
  "map": {
    "data": [
      { "harbour": "Port Aven", "k": 915, "x": 12, "y": 62 },
      { "harbour": "Little Skerry", "k": 148, "x": 22, "y": 18 },
      { "harbour": "Brae", "k": 725, "x": 38, "y": 40 },
      { "harbour": "Storholm", "k": 760, "x": 56, "y": 80 },
      { "harbour": "Tarn Head", "k": 315, "x": 66, "y": 22 },
      { "harbour": "Ness", "k": 391, "x": 84, "y": 46 },
      { "harbour": "Outer Holm", "k": 74, "x": 93, "y": 82 }
    ],
    "name": "harbour",
    "value": "k",
    "x": "x",
    "y": "y",
    "links": [
      { "from": "Port Aven", "to": "Brae" },
      { "from": "Port Aven", "to": "Storholm" },
      { "from": "Port Aven", "to": "Little Skerry" },
      { "from": "Brae", "to": "Storholm" },
      { "from": "Brae", "to": "Tarn Head" },
      { "from": "Storholm", "to": "Tarn Head" },
      { "from": "Storholm", "to": "Ness" },
      { "from": "Tarn Head", "to": "Ness" },
      { "from": "Ness", "to": "Outer Holm" },
      { "from": "Little Skerry", "to": "Brae" },
      { "from": "Port Aven", "to": "Ness" },
      { "from": "Storholm", "to": "Outer Holm" }
    ],
    "format": "{value}k",
    "highlight": "Port Aven",
    "tag": "Busiest harbour",
    "title": "915,000 passengers used Port Aven",
    "subtitle": "Passengers through each harbour, thousands. Positions are approximate."
  },
  "rank": {
    "data": [
      { "harbour": "Port Aven", "sailings": 46 },
      { "harbour": "Storholm", "sailings": 38 },
      { "harbour": "Brae", "sailings": 33 },
      { "harbour": "Ness", "sailings": 21 },
      { "harbour": "Tarn Head", "sailings": 16 },
      { "harbour": "Little Skerry", "sailings": 8 },
      { "harbour": "Outer Holm", "sailings": 4 }
    ],
    "name": "harbour",
    "value": "sailings",
    "title": "Port Aven had 46 sailings a day",
    "subtitle": "Scheduled departures per day, summer 2025."
  },
  "sources": "Skerry Isles Ferries, annual traffic return 2025",
  "note": "The Skerry Isles are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

This example sets `theme="dusk"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `hero` (required), `{ data, from, to, value?, order?, colorBy?, arcLabels?, orientation?, format?, highlight?, title?, ... } | Slot`: The hero: one arc per pair of connected entities, drawn by `arc-diagram`. Rows joining the same pair are summed. A full spec or element replaces it. In the example: a config with 12 rows of `data` and the fields `from: "a"`, `to: "b"`, `value: "k"`.
- `figures`, `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]`: Two to four large figures in a strip under the hero. In the example: 3 items: an object with `value`, `label`, `context`; an object with `value`, `label`.
- `map`, `{ data, name, value, links?, x?, y?, layout?, tag?, highlight?, format?, title?, ... } | Slot`: Bottom left: the entities as circles sized by `value` and joined by `links: { from, to, value? }[]` (`bubble-network`). `x` and `y` (0 to 100) place the circles by hand. In the example: a config with 7 rows of `data` and the fields `name: "harbour"`, `value: "k"`, `x: "x"`, `y: "y"`.
- `rank`, `{ data, name, value, highlight?, compare?, format?, title?, ... } | Slot`: Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). With only one of `map` and `rank`, that one takes the full width. In the example: a config with 7 rows of `data` and the fields `name: "harbour"`, `value: "sailings"`.

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

- Component reference with every example: https://insightcharts.dev/llms/network-poster.md
- Registry item: https://insightcharts.dev/r/network-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/network-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/network-poster
- These instructions as plain text: https://insightcharts.dev/agents/templates/network-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
