# Build a Radial poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Radial poster (`radial-poster`, an infographic template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A poster with one subject in the middle of the sheet: a wheel of spokes round an icon (`radial-spokes`), two to four large figures standing either side of it, and a bottom row with the same subject's surroundings on concentric rings (`orbit-chart`) and a ranking as centred pills (`pill-rank`).

Use it when: Use it when the poster is about the 4 to 12 parts, causes, effects or scores of one thing: what a household's water goes on, the species one tree supports, where one home's energy goes. Give `hero` the spokes and an `icon` for the centre, state the total in the title, and use `figures` for the two to four numbers a reader should take away.

Pick something else when: Parts of a whole that must be compared precisely (use `bar-chart` in a `poster`). Positions on one scale (use `scale-poster`). Change over time (use `timeline-poster`). Connections between many things (use `network-poster`). Large counts shown as crowds (use `count-poster`).

Instructions for the alternatives: `timeline-poster` https://insightcharts.dev/agents/templates/timeline-poster.md, `network-poster` https://insightcharts.dev/agents/templates/network-poster.md, `count-poster` https://insightcharts.dev/agents/templates/count-poster.md, `scale-poster` https://insightcharts.dev/agents/templates/scale-poster.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/radial-poster
```

The file lands at `components/insightcharts/templates/radial-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { RadialPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. Working example

```tsx
import { RadialPoster } from "insightcharts";

<RadialPoster
  theme="magenta"
  kicker="Water"
  title="A person on Verne Street used 142 litres of water a day in 2025"
  subtitle="Litres of mains water per person per day by use, 212 metered homes, 2025."
  hero={{
    data: [
      { use: "Shower", litres: 44 },
      { use: "Toilet", litres: 31 },
      { use: "Washing machine", litres: 19 },
      { use: "Kitchen tap", litres: 17 },
      { use: "Garden", litres: 12 },
      { use: "Dishwasher", litres: 9 },
      { use: "Bath", litres: 6 },
      { use: "Other", litres: 4 },
    ],
    name: "use",
    value: "litres",
    icon: "drop",
    format: "{value} L",
    highlight: "Shower",
  }}
  figures={[
    { value: "44 L", label: "went on showers", context: "31% of the daily total" },
    { value: "9 min", label: "was the average length of a shower" },
    { value: "6 L", label: "went on baths" },
    { value: "€1.12", label: "was the cost of one person's water for a day" },
  ]}
  rings={{
    data: [
      { fixture: "Bath", room: "Bathroom", litres: 80 },
      { fixture: "Shower, 8 min", room: "Bathroom", litres: 64 },
      { fixture: "Toilet flush", room: "Bathroom", litres: 6 },
      { fixture: "Washing machine", room: "Kitchen", litres: 50 },
      { fixture: "Dishwasher", room: "Kitchen", litres: 12 },
      { fixture: "Washing-up bowl", room: "Kitchen", litres: 8 },
      { fixture: "Hose, 10 min", room: "Garden", litres: 150 },
      { fixture: "Watering can", room: "Garden", litres: 10 },
    ],
    name: "fixture",
    ring: "room",
    value: "litres",
    format: "{value} L",
    icon: "house",
    ringLabel: "One ring per room",
    sizeLabel: "litres per use",
    highlight: "Hose, 10 min",
    title: "Ten minutes with a hose used 150 litres",
    height: 460,
  }}
  rank={{
    data: [
      { district: "Harbour", litres: 168 },
      { district: "Old Town", litres: 155 },
      { district: "Verne Street", litres: 142 },
      { district: "Northgate", litres: 136 },
      { district: "Riverside", litres: 129 },
      { district: "Mill Lane", litres: 117 },
    ],
    name: "district",
    value: "litres",
    format: "{value} L",
    highlight: "Verne Street",
    title: "Verne Street ranked third of six districts",
  }}
  sources="Verne Street metering study 2025"
  note="Verne Street and its figures are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "radial-poster",
  "theme": "magenta",
  "kicker": "Water",
  "title": "A person on Verne Street used 142 litres of water a day in 2025",
  "subtitle": "Litres of mains water per person per day by use, 212 metered homes, 2025.",
  "hero": {
    "data": [
      { "use": "Shower", "litres": 44 },
      { "use": "Toilet", "litres": 31 },
      { "use": "Washing machine", "litres": 19 },
      { "use": "Kitchen tap", "litres": 17 },
      { "use": "Garden", "litres": 12 },
      { "use": "Dishwasher", "litres": 9 },
      { "use": "Bath", "litres": 6 },
      { "use": "Other", "litres": 4 }
    ],
    "name": "use",
    "value": "litres",
    "icon": "drop",
    "format": "{value} L",
    "highlight": "Shower"
  },
  "figures": [
    { "value": "44 L", "label": "went on showers", "context": "31% of the daily total" },
    { "value": "9 min", "label": "was the average length of a shower" },
    { "value": "6 L", "label": "went on baths" },
    { "value": "€1.12", "label": "was the cost of one person's water for a day" }
  ],
  "rings": {
    "data": [
      { "fixture": "Bath", "room": "Bathroom", "litres": 80 },
      { "fixture": "Shower, 8 min", "room": "Bathroom", "litres": 64 },
      { "fixture": "Toilet flush", "room": "Bathroom", "litres": 6 },
      { "fixture": "Washing machine", "room": "Kitchen", "litres": 50 },
      { "fixture": "Dishwasher", "room": "Kitchen", "litres": 12 },
      { "fixture": "Washing-up bowl", "room": "Kitchen", "litres": 8 },
      { "fixture": "Hose, 10 min", "room": "Garden", "litres": 150 },
      { "fixture": "Watering can", "room": "Garden", "litres": 10 }
    ],
    "name": "fixture",
    "ring": "room",
    "value": "litres",
    "format": "{value} L",
    "icon": "house",
    "ringLabel": "One ring per room",
    "sizeLabel": "litres per use",
    "highlight": "Hose, 10 min",
    "title": "Ten minutes with a hose used 150 litres",
    "height": 460
  },
  "rank": {
    "data": [
      { "district": "Harbour", "litres": 168 },
      { "district": "Old Town", "litres": 155 },
      { "district": "Verne Street", "litres": 142 },
      { "district": "Northgate", "litres": 136 },
      { "district": "Riverside", "litres": 129 },
      { "district": "Mill Lane", "litres": 117 }
    ],
    "name": "district",
    "value": "litres",
    "format": "{value} L",
    "highlight": "Verne Street",
    "title": "Verne Street ranked third of six districts"
  },
  "sources": "Verne Street metering study 2025",
  "note": "Verne Street and its figures are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

This example sets `theme="magenta"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `hero` (required), `{ data, name, value, icon?, centerLabel?, shape?, sweep?, max?, highlight?, format?, title?, ... } | Slot`: The hero: one spoke per row round a centre disc, drawn by `radial-spokes`. A full spec or element replaces it. In the example: a config with 8 rows of `data` and the fields `name: "use"`, `value: "litres"`.
- `figures`, `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]`: Two to four large figures. On a sheet at least 960px wide they stand in two columns either side of the hero; on a narrower one they run in a row under it. In the example: 4 items: an object with `value`, `label`, `context`; an object with `value`, `label`.
- `rings`, `{ data, name, ring, value?, rings?, ringLabel?, sizeLabel?, icon?, centerLabel?, title?, ... } | Slot`: Bottom left: named things on concentric rings, one ring per category, level or period (`orbit-chart`). In the example: a config with 8 rows of `data` and the fields `name: "fixture"`, `ring: "room"`, `value: "litres"`.
- `rank`, `{ data, name, value, highlight?, compare?, format?, title?, ... } | Slot`: Bottom right: a ranking as centred pills (`pill-rank`). With only one of `rings` and `rank`, that one takes the full width. In the example: a config with 6 rows of `data` and the fields `name: "district"`, `value: "litres"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, name, value, icon?, centerLabel?, shape?, sweep?, max?, highlight?, format?, title?, ... } \| Slot` |  | The hero: one spoke per row round a centre disc, drawn by `radial-spokes`. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures. On a sheet at least 960px wide they stand in two columns either side of the hero; on a narrower one they run in a row under it. |
| `rings` | `{ data, name, ring, value?, rings?, ringLabel?, sizeLabel?, icon?, centerLabel?, title?, ... } \| Slot` |  | Bottom left: named things on concentric rings, one ring per category, level or period (`orbit-chart`). |
| `rank` | `{ data, name, value, highlight?, compare?, format?, title?, ... } \| Slot` |  | Bottom right: a ranking as centred pills (`pill-rank`). With only one of `rings` and `rank`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"magenta"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Built from: `poster` (molecule), `radial-spokes` (atom), `orbit-chart` (atom), `pill-rank` (atom)
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

- Component reference with every example: https://insightcharts.dev/llms/radial-poster.md
- Registry item: https://insightcharts.dev/r/radial-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/radial-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/radial-poster
- These instructions as plain text: https://insightcharts.dev/agents/templates/radial-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
