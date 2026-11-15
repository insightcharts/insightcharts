# Reproduce the "Forest, a climb read upwards, linked" example of the InsightCharts Scale poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Forest, a climb read upwards, linked" example of `scale-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A tall poster that is one illustrated scale: a full-height `scale-ladder` with icons, leader-labelled items and named zones, and a narrow side column of large figures and one small graphic, each set level with the part of the scale it describes.

Use it when: Use it when the positions of 6 to about 16 named things on one scale are the whole subject: depths, altitudes, temperatures, distances, ages. Give the scale's rows and zones in `scale`, up to five `figures` with the scale position each belongs to, and optionally a `side` graphic of two to four magnitudes. Beside the scale the figures line up with their positions; under 760px they move below it.

Pick something else when: Comparing sizes rather than positions (use `ranking-poster` or `count-poster`); change over time (use `timeline-poster`); more than about 16 items, because the labels run together; several unrelated graphics (use `poster` and lay the panels out yourself).

Instructions for the alternatives: `timeline-poster` https://insightcharts.dev/agents/templates/timeline-poster.md, `ranking-poster` https://insightcharts.dev/agents/templates/ranking-poster.md, `count-poster` https://insightcharts.dev/agents/templates/count-poster.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scale-poster
```

The file lands at `components/insightcharts/templates/scale-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ScalePoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. The "Forest, a climb read upwards, linked" example

This example sets `theme="forest"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

```tsx
import { ScalePoster } from "insightcharts";

<ScalePoster
  theme="forest"
  linked
  kicker="Mountains"
  title="The Mount Aldra trail climbs from 1,240 m to 5,320 m"
  subtitle="Altitude of nine points on the main trail, metres above sea level."
  scale={{
    data: [
      { place: "Trailhead village", m: 1240, icon: "house" },
      { place: "Cedar forest hut", m: 1820, icon: "tree" },
      { place: "Last farm terrace", m: 2150, icon: "wheat" },
      { place: "Treeline", m: 2900, icon: "leaf" },
      { place: "Meadow camp", m: 3350, icon: "flag" },
      { place: "Glacier lake", m: 3800, icon: "drop" },
      { place: "High camp", m: 4400, icon: "flag" },
      { place: "Snow line", m: 4750, icon: "snow" },
      { place: "Aldra summit", m: 5320, icon: "mountain" },
    ],
    name: "place",
    value: "m",
    iconField: "icon",
    min: 1000,
    max: 5500,
    format: "{value} m",
    scaleLabel: "Altitude, metres",
    highlight: "Aldra summit",
    zones: [
      { from: 1000, to: 2900, label: "Forest" },
      { from: 2900, to: 4750, label: "Meadow and rock" },
      { from: 4750, to: 5500, label: "Snow and ice" },
    ],
  }}
  figures={[
    { at: 5320, value: "53%", label: "of sea-level oxygen at the summit" },
    { at: 4400, value: "−9°C", label: "mean July temperature at the snow line, 4,750 m" },
    { at: 2900, value: "4,080 m", label: "of climbing from the trailhead to the summit" },
  ]}
  side={{
    data: [
      { leg: "Meadow camp", hours: 9 },
      { leg: "High camp", hours: 6 },
      { leg: "Aldra summit", hours: 5 },
    ],
    name: "leg",
    value: "hours",
    title: "Hours of walking to reach",
    height: 240,
    colorBy: "single",
  }}
  sideAt={3350}
  sources="Aldra National Park trail guide"
  note="Mount Aldra is an invented mountain. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "forest",
  "linked": true,
  "kicker": "Mountains",
  "title": "The Mount Aldra trail climbs from 1,240 m to 5,320 m",
  "subtitle": "Altitude of nine points on the main trail, metres above sea level.",
  "scale": {
    "data": [
      { "place": "Trailhead village", "m": 1240, "icon": "house" },
      { "place": "Cedar forest hut", "m": 1820, "icon": "tree" },
      { "place": "Last farm terrace", "m": 2150, "icon": "wheat" },
      { "place": "Treeline", "m": 2900, "icon": "leaf" },
      { "place": "Meadow camp", "m": 3350, "icon": "flag" },
      { "place": "Glacier lake", "m": 3800, "icon": "drop" },
      { "place": "High camp", "m": 4400, "icon": "flag" },
      { "place": "Snow line", "m": 4750, "icon": "snow" },
      { "place": "Aldra summit", "m": 5320, "icon": "mountain" }
    ],
    "name": "place",
    "value": "m",
    "iconField": "icon",
    "min": 1000,
    "max": 5500,
    "format": "{value} m",
    "scaleLabel": "Altitude, metres",
    "highlight": "Aldra summit",
    "zones": [
      { "from": 1000, "to": 2900, "label": "Forest" },
      { "from": 2900, "to": 4750, "label": "Meadow and rock" },
      { "from": 4750, "to": 5500, "label": "Snow and ice" }
    ]
  },
  "figures": [
    { "at": 5320, "value": "53%", "label": "of sea-level oxygen at the summit" },
    { "at": 4400, "value": "−9°C", "label": "mean July temperature at the snow line, 4,750 m" },
    { "at": 2900, "value": "4,080 m", "label": "of climbing from the trailhead to the summit" }
  ],
  "side": {
    "data": [
      { "leg": "Meadow camp", "hours": 9 },
      { "leg": "High camp", "hours": 6 },
      { "leg": "Aldra summit", "hours": 5 }
    ],
    "name": "leg",
    "value": "hours",
    "title": "Hours of walking to reach",
    "height": 240,
    "colorBy": "single"
  },
  "sideAt": 3350,
  "sources": "Aldra National Park trail guide",
  "note": "Mount Aldra is an invented mountain. All figures are illustrative.",
  "credit": "InsightCharts",
  "type": "scale-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `scale` (required), `ScaleLadderConfig | Slot`: The scale. A compact `scale-ladder` config: `{ data, name, value, iconField?, icon?, direction?, scale?, min?, max?, ticks?, zones?, scaleLabel?, format?, highlight? }`. Or a full spec, which replaces the ladder. In the example: a config with 9 rows of `data` and the fields `name: "place"`, `value: "m"`, `iconField: "icon"`.
- `figures`, `{ at: number; value: string; label: string; context?: string; icon?: string }[]`: Large figures for the side column. `at` is the position on the scale the figure belongs to; beside the scale the figure is set level with it under a dotted rule. In the example: 3 items: an object with `at`, `value`, `label`.
- `side`, `StatCirclesConfig | Slot`: One small graphic in the side column. A compact `stat-circles` config: `{ data, name, value, unit?, format?, title?, subtitle? }`. Or a full spec. In the example: a config with 3 rows of `data` and the fields `name: "leg"`, `value: "hours"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `scale` (required) | `ScaleLadderConfig \| Slot` |  | The scale. A compact `scale-ladder` config: `{ data, name, value, iconField?, icon?, direction?, scale?, min?, max?, ticks?, zones?, scaleLabel?, format?, highlight? }`. Or a full spec, which replaces the ladder. |
| `figures` | `{ at: number; value: string; label: string; context?: string; icon?: string }[]` |  | Large figures for the side column. `at` is the position on the scale the figure belongs to; beside the scale the figure is set level with it under a dotted rule. |
| `side` | `StatCirclesConfig \| Slot` |  | One small graphic in the side column. A compact `stat-circles` config: `{ data, name, value, unit?, format?, title?, subtitle? }`. Or a full spec. |
| `sideAt` | `number` |  | Position on the scale where the `side` graphic starts. Default: under the last figure. |
| `height` | `number` |  | Height of the scale in px. Default: 68px per item, at least 920 (760 when stacked). |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"ocean"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `980` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `scale-ladder` (atom), `stat-circles` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/scale-poster.md
- Component reference with every example: https://insightcharts.dev/llms/scale-poster.md
- Registry item: https://insightcharts.dev/r/scale-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/scale-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/scale-poster#example-forest-a-climb-read-upwards-linked
- These instructions as plain text: https://insightcharts.dev/agents/templates/scale-poster/forest-a-climb-read-upwards-linked.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
