# Build a Flow poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Flow poster (`flow-poster`, an infographic template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A portrait poster of where something comes from and where it goes, in three stacked bands painted in one colour: the producers as large labelled tiles, the leading producer's output fanning out as ribbons to an aligned column of destinations, and the destinations as bubbles on a scale of how much each depends on that producer.

Use it when: Use it when one producer leads and the reader should follow its output: ports and the buyers of one port's catch, regions and the users of one region's electricity, terminals and the routes out of the largest. Give `producers` 4 to 10 rows, `flow` 4 to 12 destinations of the leading producer, and `scale` the same destinations with a share (position) and a size. Keep the destination names identical in `flow` and `scale` so `linked` can join them.

Pick something else when: Flows through more than one stage or between many sources and many destinations (use `sankey-chart` in a `poster`). A count of people or things (use `count-poster`). Many measures of the same entities (use `matrix-poster`).

Instructions for the alternatives: `matrix-poster` https://insightcharts.dev/agents/templates/matrix-poster.md, `sankey-chart` https://insightcharts.dev/agents/atoms/sankey-chart.md, `count-poster` https://insightcharts.dev/agents/templates/count-poster.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/flow-poster
```

The file lands at `components/insightcharts/templates/flow-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { FlowPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. Working example

```tsx
import { FlowPoster } from "insightcharts";

<FlowPoster
  theme="magenta"
  kicker="Fishing"
  title="Six ports on the Verran Coast landed 412,000 tonnes of fish in 2025"
  subtitle="Landings by port, the buyers of Port Alda's catch, and how much each buyer relies on Port Alda. Thousand tonnes (kt)."
  format="{value} kt"
  producers={{
    data: [
      { port: "Port Alda", kt: 148 },
      { port: "Skerry", kt: 96 },
      { port: "Marrow Bay", kt: 71 },
      { port: "Tolven", kt: 52 },
      { port: "Hask", kt: 28 },
      { port: "Lund", kt: 17 },
    ],
    name: "port",
    value: "kt",
    title: "Port Alda landed 148,000 of the 412,000 tonnes",
  }}
  flow={{
    data: [
      { buyer: "Canneries", kt: 46 },
      { buyer: "Fresh markets", kt: 34 },
      { buyer: "Frozen export", kt: 29 },
      { buyer: "Fishmeal plants", kt: 21 },
      { buyer: "Restaurants", kt: 11 },
      { buyer: "Smokehouses", kt: 7 },
    ],
    name: "buyer",
    value: "kt",
    trunk: "Port Alda",
    title: "Canneries bought 46,000 tonnes of Port Alda's catch",
  }}
  scale={{
    data: [
      { buyer: "Canneries", fromAlda: 56, kt: 82 },
      { buyer: "Fresh markets", fromAlda: 35, kt: 96 },
      { buyer: "Frozen export", fromAlda: 23, kt: 124 },
      { buyer: "Fishmeal plants", fromAlda: 34, kt: 61 },
      { buyer: "Restaurants", fromAlda: 29, kt: 38 },
      { buyer: "Smokehouses", fromAlda: 64, kt: 11 },
    ],
    name: "buyer",
    value: "fromAlda",
    size: "kt",
    sizeFormat: "{value} kt",
    scaleLabel: "From Port Alda",
    title: "Smokehouses bought 64% of their fish from Port Alda",
    subtitle: "Share of each buyer's fish landed at Port Alda (position) and all the fish it bought (area)",
  }}
  sources="Verran Coast Fisheries Board landing returns"
  note="The Verran Coast is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "flow-poster",
  "theme": "magenta",
  "kicker": "Fishing",
  "title": "Six ports on the Verran Coast landed 412,000 tonnes of fish in 2025",
  "subtitle": "Landings by port, the buyers of Port Alda's catch, and how much each buyer relies on Port Alda. Thousand tonnes (kt).",
  "format": "{value} kt",
  "producers": {
    "data": [
      { "port": "Port Alda", "kt": 148 },
      { "port": "Skerry", "kt": 96 },
      { "port": "Marrow Bay", "kt": 71 },
      { "port": "Tolven", "kt": 52 },
      { "port": "Hask", "kt": 28 },
      { "port": "Lund", "kt": 17 }
    ],
    "name": "port",
    "value": "kt",
    "title": "Port Alda landed 148,000 of the 412,000 tonnes"
  },
  "flow": {
    "data": [
      { "buyer": "Canneries", "kt": 46 },
      { "buyer": "Fresh markets", "kt": 34 },
      { "buyer": "Frozen export", "kt": 29 },
      { "buyer": "Fishmeal plants", "kt": 21 },
      { "buyer": "Restaurants", "kt": 11 },
      { "buyer": "Smokehouses", "kt": 7 }
    ],
    "name": "buyer",
    "value": "kt",
    "trunk": "Port Alda",
    "title": "Canneries bought 46,000 tonnes of Port Alda's catch"
  },
  "scale": {
    "data": [
      { "buyer": "Canneries", "fromAlda": 56, "kt": 82 },
      { "buyer": "Fresh markets", "fromAlda": 35, "kt": 96 },
      { "buyer": "Frozen export", "fromAlda": 23, "kt": 124 },
      { "buyer": "Fishmeal plants", "fromAlda": 34, "kt": 61 },
      { "buyer": "Restaurants", "fromAlda": 29, "kt": 38 },
      { "buyer": "Smokehouses", "fromAlda": 64, "kt": 11 }
    ],
    "name": "buyer",
    "value": "fromAlda",
    "size": "kt",
    "sizeFormat": "{value} kt",
    "scaleLabel": "From Port Alda",
    "title": "Smokehouses bought 64% of their fish from Port Alda",
    "subtitle": "Share of each buyer's fish landed at Port Alda (position) and all the fish it bought (area)"
  },
  "sources": "Verran Coast Fisheries Board landing returns",
  "note": "The Verran Coast is an invented place. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

This example sets `theme="magenta"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `producers` (required), `{ data, name, value, title?, subtitle?, source?, ...treemap props } | Slot`: Top band: the producers as tiles sized by output (`treemap`). The leading one is painted in the accent. In the example: a config with 6 rows of `data` and the fields `name: "port"`, `value: "kt"`.
- `flow` (required), `{ data, name, value, trunk?, tagged?, tagLabel?, title?, ...fan-flow props } | Slot`: Middle band: one ribbon per destination, as thick as its value, ending at a column of names, values and shares (`fan-flow`). In the example: a config with 6 rows of `data` and the fields `name: "buyer"`, `value: "kt"`.
- `scale`, `{ data, name, value, size, scaleLabel?, sizeFormat?, title?, ...bubble-scale props } | Slot`: Bottom band: one bubble per destination, placed by `value` on a 0 to 100 scale and sized by `size` (`bubble-scale`). Set `domain` and `ticks` for a scale that is not a percentage. In the example: a config with 6 rows of `data` and the fields `name: "buyer"`, `value: "fromAlda"`, `size: "kt"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `producers` (required) | `{ data, name, value, title?, subtitle?, source?, ...treemap props } \| Slot` |  | Top band: the producers as tiles sized by output (`treemap`). The leading one is painted in the accent. |
| `lead` | `string` |  | The producer the flow starts from. Default: the largest row of `producers`. It names the block the ribbons leave. |
| `flow` (required) | `{ data, name, value, trunk?, tagged?, tagLabel?, title?, ...fan-flow props } \| Slot` |  | Middle band: one ribbon per destination, as thick as its value, ending at a column of names, values and shares (`fan-flow`). |
| `scale` | `{ data, name, value, size, scaleLabel?, sizeFormat?, title?, ...bubble-scale props } \| Slot` |  | Bottom band: one bubble per destination, placed by `value` on a 0 to 100 scale and sized by `size` (`bubble-scale`). Set `domain` and `ticks` for a scale that is not a percentage. |
| `format` | `FormatSpec` |  | How to print the quantities of the top and middle bands, e.g. `"{value} kt"`. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"magenta"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `920` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `treemap` (atom), `fan-flow` (atom), `bubble-scale` (atom)
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

- Component reference with every example: https://insightcharts.dev/llms/flow-poster.md
- Registry item: https://insightcharts.dev/r/flow-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/flow-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/flow-poster
- These instructions as plain text: https://insightcharts.dev/agents/templates/flow-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
