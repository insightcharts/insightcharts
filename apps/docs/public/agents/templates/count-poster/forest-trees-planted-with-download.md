# Reproduce the "Forest, trees planted, with download" example of the InsightCharts Count poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Forest, trees planted, with download" example of `count-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A poster that counts at scale. Blocks of thousands of unit icons fill most of the sheet, a second band counts reference groups with the same icon at the same size in a muted colour, and a bottom row holds three small graphics: squares sized by area with a ratio bracket, thick bars with the numbers inside, and shares as nested outlines or filled silhouettes.

Use it when: Use it when the subject is a large count of people or things in 2 to 6 groups and the reader should see the crowd: pupils by stage, trees planted by species, vehicles built by model. Give `hero` the groups and `reference` one to three quantities to compare them with. Both bands use the same `unit`, `icon` and icon size, so their areas compare. State the total in the title.

Pick something else when: Counts under a few hundred (use `pictogram-chart` in a `poster`). Shares of one whole as the main point (use `waffle-chart` or `treemap`). A ranking of many named things (use `ranking-poster`). A flow from sources to destinations (use `flow-poster`).

Instructions for the alternatives: `pictogram-chart` https://insightcharts.dev/agents/atoms/pictogram-chart.md, `ranking-poster` https://insightcharts.dev/agents/templates/ranking-poster.md, `waffle-chart` https://insightcharts.dev/agents/atoms/waffle-chart.md, `flow-poster` https://insightcharts.dev/agents/templates/flow-poster.md, `treemap` https://insightcharts.dev/agents/atoms/treemap.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/count-poster
```

The file lands at `components/insightcharts/templates/count-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { CountPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. The "Forest, trees planted, with download" example

This example sets `theme="forest"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

```tsx
import { CountPoster } from "insightcharts";

<CountPoster
  theme="forest"
  download
  kicker="Forestry"
  title="Foresters planted 2.4 million trees in the Aldern Valley from 2016 to 2025"
  subtitle="Trees planted by species, and trees lost over the same ten years."
  unit={1000}
  unitLabel="1,000 trees"
  icon="tree"
  hero={{
    data: [
      { species: "Oak", trees: 780000 },
      { species: "Birch", trees: 640000 },
      { species: "Scots pine", trees: 560000 },
      { species: "Alder", trees: 420000 },
    ],
    name: "species",
    value: "trees",
    title: "Oak was 780,000 of the 2.4 million trees",
  }}
  reference={{
    data: [
      { cause: "Felled for timber", trees: 310000 },
      { cause: "Lost to storms", trees: 95000 },
      { cause: "Lost to disease", trees: 64000 },
    ],
    name: "cause",
    value: "trees",
    title: "The valley lost 469,000 trees in the same years",
  }}
  area={{
    data: [{ year: "Woodland in 2025", ha: 18600 }, { year: "Planted in 2025", ha: 930 }],
    name: "year",
    value: "ha",
    format: "{value} ha",
    ratio: "{ratio}x the area",
    title: "Woodland covered 18,600 hectares in 2025",
  }}
  bars={{
    data: [
      { year: "2020", k: 180 },
      { year: "2021", k: 215 },
      { year: "2022", k: 240 },
      { year: "2023", k: 265 },
      { year: "2024", k: 290 },
      { year: "2025", k: 310 },
    ],
    name: "year",
    value: "k",
    format: "{value}k",
    title: "310,000 trees were planted in 2025",
  }}
  shares={{
    data: [{ species: "Birch", share: 92 }, { species: "Scots pine", share: 74 }],
    name: "species",
    value: "share",
    icon: "tree",
    title: "92% of birches were alive after five years",
  }}
  sources="Aldern Valley Forest Trust planting register"
  note="The Aldern Valley is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "forest",
  "download": true,
  "kicker": "Forestry",
  "title": "Foresters planted 2.4 million trees in the Aldern Valley from 2016 to 2025",
  "subtitle": "Trees planted by species, and trees lost over the same ten years.",
  "unit": 1000,
  "unitLabel": "1,000 trees",
  "icon": "tree",
  "hero": {
    "data": [
      { "species": "Oak", "trees": 780000 },
      { "species": "Birch", "trees": 640000 },
      { "species": "Scots pine", "trees": 560000 },
      { "species": "Alder", "trees": 420000 }
    ],
    "name": "species",
    "value": "trees",
    "title": "Oak was 780,000 of the 2.4 million trees"
  },
  "reference": {
    "data": [
      { "cause": "Felled for timber", "trees": 310000 },
      { "cause": "Lost to storms", "trees": 95000 },
      { "cause": "Lost to disease", "trees": 64000 }
    ],
    "name": "cause",
    "value": "trees",
    "title": "The valley lost 469,000 trees in the same years"
  },
  "area": {
    "data": [{ "year": "Woodland in 2025", "ha": 18600 }, { "year": "Planted in 2025", "ha": 930 }],
    "name": "year",
    "value": "ha",
    "format": "{value} ha",
    "ratio": "{ratio}x the area",
    "title": "Woodland covered 18,600 hectares in 2025"
  },
  "bars": {
    "data": [
      { "year": "2020", "k": 180 },
      { "year": "2021", "k": 215 },
      { "year": "2022", "k": 240 },
      { "year": "2023", "k": 265 },
      { "year": "2024", "k": 290 },
      { "year": "2025", "k": 310 }
    ],
    "name": "year",
    "value": "k",
    "format": "{value}k",
    "title": "310,000 trees were planted in 2025"
  },
  "shares": {
    "data": [{ "species": "Birch", "share": 92 }, { "species": "Scots pine", "share": 74 }],
    "name": "species",
    "value": "share",
    "icon": "tree",
    "title": "92% of birches were alive after five years"
  },
  "sources": "Aldern Valley Forest Trust planting register",
  "note": "The Aldern Valley is an invented place. All figures are illustrative.",
  "credit": "InsightCharts",
  "type": "count-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `hero` (required), `{ data, name, value, title?, subtitle?, source?, ...unit-blocks props } | Slot`: The hero band: one block of unit icons per row, drawn by `unit-blocks`. A full spec or element replaces it. In the example: a config with 4 rows of `data` and the fields `name: "species"`, `value: "trees"`.
- `reference`, `{ data, name, value, title?, ... } | Slot`: The second band: reference groups counted with the same icon at the same size, painted in the theme's context grey (`unit-blocks`). In the example: a config with 3 rows of `data` and the fields `name: "cause"`, `value: "trees"`.
- `area`, `{ data, name, value, ratio?, title?, ... } | Slot`: Bottom left: two to four values as squares sized by area, with a bracket stating how many times the largest is the smallest (`proportional-area`). `ratio` defaults to `"{ratio}x larger"`. In the example: a config with 2 rows of `data` and the fields `name: "year"`, `value: "ha"`.
- `bars`, `{ data, name, value, title?, ... } | Slot`: Bottom middle: 3 to 8 values as thick rounded bars with the numbers inside (`block-bar`). In the example: a config with 6 rows of `data` and the fields `name: "year"`, `value: "k"`.
- `shares`, `{ data, name, value, icon?, title?, ... } | Slot`: Bottom right: shares of one whole. With `icon` each share is a silhouette filled to its level (`shape-fill`); without, the shares are outlines nested in one square (`nested-shares`). In the example: a config with 2 rows of `data` and the fields `name: "species"`, `value: "share"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, name, value, title?, subtitle?, source?, ...unit-blocks props } \| Slot` |  | The hero band: one block of unit icons per row, drawn by `unit-blocks`. A full spec or element replaces it. |
| `unit` | `number` |  | Units one icon stands for, in both bands. Default: a round number that gives the hero about 2,000 icons. |
| `unitLabel` | `string` |  | What one icon stands for, e.g. "1,000 pupils". Printed as the key of both bands. |
| `icon` | `IconName \| "path://..."` | `"person"` | Icon of both bands. |
| `format` | `FormatSpec` | `"integer"` | How to print the counts. |
| `reference` | `{ data, name, value, title?, ... } \| Slot` |  | The second band: reference groups counted with the same icon at the same size, painted in the theme's context grey (`unit-blocks`). |
| `area` | `{ data, name, value, ratio?, title?, ... } \| Slot` |  | Bottom left: two to four values as squares sized by area, with a bracket stating how many times the largest is the smallest (`proportional-area`). `ratio` defaults to `"{ratio}x larger"`. |
| `bars` | `{ data, name, value, title?, ... } \| Slot` |  | Bottom middle: 3 to 8 values as thick rounded bars with the numbers inside (`block-bar`). |
| `shares` | `{ data, name, value, icon?, title?, ... } \| Slot` |  | Bottom right: shares of one whole. With `icon` each share is a silhouette filled to its level (`shape-fill`); without, the shares are outlines nested in one square (`nested-shares`). |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"noir"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Built from: `poster` (molecule), `unit-blocks` (atom), `proportional-area` (atom), `block-bar` (atom), `nested-shares` (atom), `shape-fill` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- `title` is the poster's one fact with its number. Keep other text short.
- Do not set colours. Pick a poster theme with `theme`. A poster keeps its own colours in dark mode.
- Set `sources`. Say in `note` when figures are illustrative.
- A poster becomes one column under 600px wide, in the order of its regions. Order them for that reading.
- One icon stands for a fixed count (`unit`). Say what one icon is worth in `unitLabel` or `subtitle`. Icons are counted. Never scale an icon by area.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Set `download` when the user wants the whole piece as one PNG. It adds a "Download PNG" control under the piece.
- Set `linked` to make a click on a mark filter the other regions.
- Poster themes: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.
- An icon is decoration. The label beside it must carry the meaning.

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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/count-poster.md
- Component reference with every example: https://insightcharts.dev/llms/count-poster.md
- Registry item: https://insightcharts.dev/r/count-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/count-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/count-poster#example-forest-trees-planted-with-download
- These instructions as plain text: https://insightcharts.dev/agents/templates/count-poster/forest-trees-planted-with-download.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
