# Reproduce the "Noir, eight seabirds, linked" example of the InsightCharts Matrix poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Noir, eight seabirds, linked" example of `matrix-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

One wide landscape graphic that compares 4 to 12 entities on five to seven measures: two measures as S-curves between parallel scales on the left, joined to a table on the right in which every other number is drawn as dots, squares, icons, a ring, a circle or a bar. Both halves share one row order and one colour per entity.

Use it when: Use it for profiles of a handful of comparable things with measures in different units: cities, species, products, stations, teams. Pass one row per entity with every measure in it. Put the two measures whose relationship matters in `curve` and the rest in `columns`, choosing a counted glyph (`dots`, `blocks`, `icons`) for small whole numbers, `ring` for shares, `bar` or `circle` for magnitudes. Leave `highlight` out to give every entity its own colour, derived from the theme when its palette is smaller than the number of entities; set it to draw one or two entities in colour and the rest in grey.

Pick something else when: One measure across entities (use `pill-rank` or `bar-chart`). More than 12 entities (use `data-table` or `heatmap`). A subject with a total and its parts (use `ranking-poster` or `flow-poster`). A phone-first piece: the table stacks into cards under 600px and the poster becomes long.

Instructions for the alternatives: `ranking-poster` https://insightcharts.dev/agents/templates/ranking-poster.md, `flow-poster` https://insightcharts.dev/agents/templates/flow-poster.md, `data-table` https://insightcharts.dev/agents/atoms/data-table.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md, `pill-rank` https://insightcharts.dev/agents/atoms/pill-rank.md, `heatmap` https://insightcharts.dev/agents/atoms/heatmap.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/matrix-poster
```

The file lands at `components/insightcharts/templates/matrix-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { MatrixPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them.

## 5. The "Noir, eight seabirds, linked" example

This example sets `theme="noir"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

```tsx
import { MatrixPoster } from "insightcharts";

<MatrixPoster
  theme="noir"
  linked
  kicker="Wildlife"
  title="21,400 pairs of guillemots bred on the Skerry Isles in 2025"
  subtitle="Eight seabird species compared on wingspan, breeding pairs and four other measures."
  rows={[
    { bird: "Gannet", wingspan: 180, pairs: 5200, eggs: 1, dive: 22, years: 17, mass: 3000 },
    { bird: "Fulmar", wingspan: 107, pairs: 8900, eggs: 1, dive: 3, years: 30, mass: 800 },
    { bird: "Kittiwake", wingspan: 105, pairs: 14600, eggs: 2, dive: 1, years: 12, mass: 400 },
    { bird: "Shag", wingspan: 100, pairs: 1900, eggs: 3, dive: 45, years: 12, mass: 1900 },
    { bird: "Arctic tern", wingspan: 80, pairs: 3100, eggs: 2, dive: 1, years: 13, mass: 110 },
    { bird: "Guillemot", wingspan: 67, pairs: 21400, eggs: 1, dive: 60, years: 23, mass: 950 },
    { bird: "Razorbill", wingspan: 65, pairs: 6700, eggs: 1, dive: 35, years: 13, mass: 620 },
    { bird: "Puffin", wingspan: 55, pairs: 11800, eggs: 1, dive: 40, years: 18, mass: 400 },
  ]}
  name="bird"
  nameLabel="Species"
  curve={{
    left: "wingspan",
    right: "pairs",
    leftLabel: "Wingspan, cm",
    rightLabel: "Breeding pairs",
    format: "integer",
    title: "The gannet's wingspan is 180 cm",
  }}
  columns={[
    { field: "eggs", label: "Eggs in a clutch", glyph: "dots" },
    { field: "dive", label: "Deepest dive, m", glyph: "bar", format: "{value} m" },
    { field: "years", label: "Typical lifespan, years", glyph: "blocks" },
    { field: "mass", label: "Body mass, g", glyph: "circle", format: "integer" },
  ]}
  table={{ title: "Guillemots dive to 60 metres" }}
  sources="Skerry Isles seabird census 2025"
  note="The Skerry Isles and the colony counts are invented. Species measurements are rounded typical values."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "noir",
  "linked": true,
  "kicker": "Wildlife",
  "title": "21,400 pairs of guillemots bred on the Skerry Isles in 2025",
  "subtitle": "Eight seabird species compared on wingspan, breeding pairs and four other measures.",
  "rows": [
    {
      "bird": "Gannet",
      "wingspan": 180,
      "pairs": 5200,
      "eggs": 1,
      "dive": 22,
      "years": 17,
      "mass": 3000
    },
    {
      "bird": "Fulmar",
      "wingspan": 107,
      "pairs": 8900,
      "eggs": 1,
      "dive": 3,
      "years": 30,
      "mass": 800
    },
    {
      "bird": "Kittiwake",
      "wingspan": 105,
      "pairs": 14600,
      "eggs": 2,
      "dive": 1,
      "years": 12,
      "mass": 400
    },
    {
      "bird": "Shag",
      "wingspan": 100,
      "pairs": 1900,
      "eggs": 3,
      "dive": 45,
      "years": 12,
      "mass": 1900
    },
    {
      "bird": "Arctic tern",
      "wingspan": 80,
      "pairs": 3100,
      "eggs": 2,
      "dive": 1,
      "years": 13,
      "mass": 110
    },
    {
      "bird": "Guillemot",
      "wingspan": 67,
      "pairs": 21400,
      "eggs": 1,
      "dive": 60,
      "years": 23,
      "mass": 950
    },
    {
      "bird": "Razorbill",
      "wingspan": 65,
      "pairs": 6700,
      "eggs": 1,
      "dive": 35,
      "years": 13,
      "mass": 620
    },
    {
      "bird": "Puffin",
      "wingspan": 55,
      "pairs": 11800,
      "eggs": 1,
      "dive": 40,
      "years": 18,
      "mass": 400
    }
  ],
  "name": "bird",
  "nameLabel": "Species",
  "curve": {
    "left": "wingspan",
    "right": "pairs",
    "leftLabel": "Wingspan, cm",
    "rightLabel": "Breeding pairs",
    "format": "integer",
    "title": "The gannet's wingspan is 180 cm"
  },
  "columns": [
    { "field": "eggs", "label": "Eggs in a clutch", "glyph": "dots" },
    { "field": "dive", "label": "Deepest dive, m", "glyph": "bar", "format": "{value} m" },
    { "field": "years", "label": "Typical lifespan, years", "glyph": "blocks" },
    { "field": "mass", "label": "Body mass, g", "glyph": "circle", "format": "integer" }
  ],
  "table": { "title": "Guillemots dive to 60 metres" },
  "sources": "Skerry Isles seabird census 2025",
  "note": "The Skerry Isles and the colony counts are invented. Species measurements are rounded typical values.",
  "credit": "InsightCharts",
  "type": "matrix-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `rows` (required), `Row[]`: One object per entity, holding the name and every measure. In the example: 8 items: an object with `bird`, `wingspan`, `pairs`, `eggs`, `dive`, `years`, `mass`.
- `curve` (required), `{ left, right, leftLabel?, rightLabel?, leftFormat?, rightFormat?, leftTop?, rightTop?, title?, subtitle?, source?, ...curve-rank props }`: Left graphic: the two measures joined by one S-curve per entity (`curve-rank`). The poster's rows are ordered by `left`, largest first. In the example: an object with `left`, `right`, `leftLabel`, `rightLabel`, `format`, `title`.
- `columns` (required), `{ field, label?, glyph?, unit?, format?, max?, icon? }[]`: Right graphic: the glyph columns of the table, in order (`glyph-table`). Three to five read well beside the curves. In the example: 4 items: an object with `field`, `label`, `glyph`; an object with `field`, `label`, `glyph`, `format`.
- `table`, `{ title?, subtitle?, source?, note? }`: Short heading and source line over and under the table. In the example: an object with `title`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` (required) | `Row[]` |  | One object per entity, holding the name and every measure. |
| `name` | `string` |  | Field holding the entity name. Default: the first key of the first row. |
| `nameLabel` | `string` |  | Heading of the table's name column. |
| `curve` (required) | `{ left, right, leftLabel?, rightLabel?, leftFormat?, rightFormat?, leftTop?, rightTop?, title?, subtitle?, source?, ...curve-rank props }` |  | Left graphic: the two measures joined by one S-curve per entity (`curve-rank`). The poster's rows are ordered by `left`, largest first. |
| `columns` (required) | `{ field, label?, glyph?, unit?, format?, max?, icon? }[]` |  | Right graphic: the glyph columns of the table, in order (`glyph-table`). Three to five read well beside the curves. |
| `table` | `{ title?, subtitle?, source?, note? }` |  | Short heading and source line over and under the table. |
| `order` | `string[]` |  | Entity names in display order, for both graphics. Default: largest first on the curve's left measure. |
| `highlight` | `string \| string[]` |  | Entities drawn in colour while every other one turns grey. Without it each entity has its own colour in both graphics. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"paper"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1400` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `curve-rank` (atom), `glyph-table` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/matrix-poster.md
- Component reference with every example: https://insightcharts.dev/llms/matrix-poster.md
- Registry item: https://insightcharts.dev/r/matrix-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/matrix-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/matrix-poster#example-noir-eight-seabirds-linked
- These instructions as plain text: https://insightcharts.dev/agents/templates/matrix-poster/noir-eight-seabirds-linked.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
