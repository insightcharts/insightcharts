# Build a Profile poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Profile poster (`profile-poster`, an infographic template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A poster that describes one subject from four sides: the subject as one large silhouette filled to a share (`shape-fill`), two to four large figures, its place among other things on one scale (`scale-ladder`), and a table that sets it beside its peers with every number drawn as a small form (`glyph-table`).

Use it when: Use it for a fact sheet about one named thing: a vehicle, a reservoir, a building, a machine, a species. Give `portrait` one row with the share that defines the subject and the `icon` that stands for it, `figures` the numbers a reader should take away, `scale` the subject among 4 to 10 reference points, and `table` the subject beside 2 to 6 peers. Highlight the subject in `scale` and `table`. On a sheet at least 960px wide the silhouette, the figures and the scale stand in three columns.

Pick something else when: Several subjects of equal weight (use `glyph-table` in a `poster`, or `ranking-poster`). A subject whose parts are the point (use `radial-poster`). A subject with no defining share: leave `portrait` to a full spec such as `stat-circles`, or use `scale-poster` when the scale is the whole subject. Change over time (use `timeline-poster`).

Instructions for the alternatives: `timeline-poster` https://insightcharts.dev/agents/templates/timeline-poster.md, `ranking-poster` https://insightcharts.dev/agents/templates/ranking-poster.md, `radial-poster` https://insightcharts.dev/agents/templates/radial-poster.md, `stat-circles` https://insightcharts.dev/agents/atoms/stat-circles.md, `scale-poster` https://insightcharts.dev/agents/templates/scale-poster.md, `glyph-table` https://insightcharts.dev/agents/atoms/glyph-table.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/profile-poster
```

The file lands at `components/insightcharts/templates/profile-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ProfilePoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. Working example

```tsx
import { ProfilePoster } from "insightcharts";

<ProfilePoster
  theme="blueprint"
  kicker="Public transport"
  title="The Line 9 electric bus ended a working day with 34% of its charge"
  subtitle="One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025."
  portrait={{
    data: [{ state: "Charge left at 23:00", charge: 34 }],
    name: "state",
    value: "charge",
    icon: "bus",
    title: "Charge left at the end of the day",
  }}
  figures={[
    { value: "204 km", label: "driven on a working day" },
    { value: "310 km", label: "of range on a full charge" },
    { value: "4 h", label: "to recharge overnight at the depot" },
  ]}
  scale={{
    data: [
      { vehicle: "Electric scooter", km: 35, icon: "bolt" },
      { vehicle: "Electric bike", km: 70, icon: "bike" },
      { vehicle: "Delivery van", km: 210, icon: "truck" },
      { vehicle: "Line 9 bus", km: 310, icon: "bus" },
      { vehicle: "Family car", km: 420, icon: "car" },
      { vehicle: "Long-haul truck", km: 520, icon: "truck" },
    ],
    name: "vehicle",
    value: "km",
    iconField: "icon",
    min: 0,
    max: 600,
    format: "{value} km",
    scaleLabel: "Range, km",
    highlight: "Line 9 bus",
    title: "Range of six electric vehicles",
  }}
  table={{
    rows: [
      { vehicle: "Line 9 bus", seats: 41, cost: 0.21, co2: 14, noise: 62 },
      { vehicle: "Diesel bus", seats: 43, cost: 0.58, co2: 71, noise: 78 },
      { vehicle: "Tram", seats: 64, cost: 0.17, co2: 9, noise: 70 },
    ],
    name: "vehicle",
    nameLabel: "Vehicle",
    highlight: "Line 9 bus",
    title: "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
    columns: [
      { field: "seats", label: "Seats", glyph: "icons", icon: "person", unit: 5 },
      { field: "cost", label: "Energy cost per km", glyph: "bar", format: "€{value}", max: 0.6 },
      { field: "co2", label: "CO2 per passenger-km", glyph: "circle", format: "{value} g" },
      { field: "noise", label: "Noise at 10 m", glyph: "bar", format: "{value} dB", max: 80 },
    ],
  }}
  sources="Marlow Transit depot telemetry, 2025"
  note="Marlow Transit and the Line 9 bus are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "profile-poster",
  "theme": "blueprint",
  "kicker": "Public transport",
  "title": "The Line 9 electric bus ended a working day with 34% of its charge",
  "subtitle": "One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025.",
  "portrait": {
    "data": [{ "state": "Charge left at 23:00", "charge": 34 }],
    "name": "state",
    "value": "charge",
    "icon": "bus",
    "title": "Charge left at the end of the day"
  },
  "figures": [
    { "value": "204 km", "label": "driven on a working day" },
    { "value": "310 km", "label": "of range on a full charge" },
    { "value": "4 h", "label": "to recharge overnight at the depot" }
  ],
  "scale": {
    "data": [
      { "vehicle": "Electric scooter", "km": 35, "icon": "bolt" },
      { "vehicle": "Electric bike", "km": 70, "icon": "bike" },
      { "vehicle": "Delivery van", "km": 210, "icon": "truck" },
      { "vehicle": "Line 9 bus", "km": 310, "icon": "bus" },
      { "vehicle": "Family car", "km": 420, "icon": "car" },
      { "vehicle": "Long-haul truck", "km": 520, "icon": "truck" }
    ],
    "name": "vehicle",
    "value": "km",
    "iconField": "icon",
    "min": 0,
    "max": 600,
    "format": "{value} km",
    "scaleLabel": "Range, km",
    "highlight": "Line 9 bus",
    "title": "Range of six electric vehicles"
  },
  "table": {
    "rows": [
      { "vehicle": "Line 9 bus", "seats": 41, "cost": 0.21, "co2": 14, "noise": 62 },
      { "vehicle": "Diesel bus", "seats": 43, "cost": 0.58, "co2": 71, "noise": 78 },
      { "vehicle": "Tram", "seats": 64, "cost": 0.17, "co2": 9, "noise": 70 }
    ],
    "name": "vehicle",
    "nameLabel": "Vehicle",
    "highlight": "Line 9 bus",
    "title": "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
    "columns": [
      { "field": "seats", "label": "Seats", "glyph": "icons", "icon": "person", "unit": 5 },
      {
        "field": "cost",
        "label": "Energy cost per km",
        "glyph": "bar",
        "format": "€{value}",
        "max": 0.6
      },
      { "field": "co2", "label": "CO2 per passenger-km", "glyph": "circle", "format": "{value} g" },
      {
        "field": "noise",
        "label": "Noise at 10 m",
        "glyph": "bar",
        "format": "{value} dB",
        "max": 80
      }
    ]
  },
  "sources": "Marlow Transit depot telemetry, 2025",
  "note": "Marlow Transit and the Line 9 bus are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

This example sets `theme="blueprint"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `portrait` (required), `{ data, name, value, icon, max?, format?, title?, ... } | Slot`: The portrait: one silhouette filled from the bottom to the share in its row, with the number beside it, drawn by `shape-fill`. `format` defaults to `"{value}%"`. A full spec or element replaces it. In the example: a config with 1 rows of `data` and the fields `name: "state"`, `value: "charge"`.
- `figures`, `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]`: Two to four large figures about the subject. In the three-column layout they stand between the silhouette and the scale; otherwise they run in a strip. In the example: 3 items: an object with `value`, `label`.
- `scale`, `{ data, name, value, iconField?, direction?, scale?, min?, max?, zones?, scaleLabel?, highlight?, format?, title?, ... } | Slot`: The subject among 4 to 10 other things on one scale (`scale-ladder`). It is drawn as tall as the silhouette. In the example: a config with 6 rows of `data` and the fields `name: "vehicle"`, `value: "km"`, `iconField: "icon"`.
- `table`, `{ rows, name, columns, nameLabel?, highlight?, order?, title?, ... } | Slot`: The subject beside its peers, one row each, with a glyph per measure (`glyph-table`). `columns` is `{ field, label?, glyph?, unit?, format?, max?, icon? }[]`. In the example: an object with `rows`, `name`, `nameLabel`, `highlight`, `title`, `columns`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `portrait` (required) | `{ data, name, value, icon, max?, format?, title?, ... } \| Slot` |  | The portrait: one silhouette filled from the bottom to the share in its row, with the number beside it, drawn by `shape-fill`. `format` defaults to `"{value}%"`. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures about the subject. In the three-column layout they stand between the silhouette and the scale; otherwise they run in a strip. |
| `scale` | `{ data, name, value, iconField?, direction?, scale?, min?, max?, zones?, scaleLabel?, highlight?, format?, title?, ... } \| Slot` |  | The subject among 4 to 10 other things on one scale (`scale-ladder`). It is drawn as tall as the silhouette. |
| `table` | `{ rows, name, columns, nameLabel?, highlight?, order?, title?, ... } \| Slot` |  | The subject beside its peers, one row each, with a glyph per measure (`glyph-table`). `columns` is `{ field, label?, glyph?, unit?, format?, max?, icon? }[]`. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"blueprint"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Built from: `poster` (molecule), `shape-fill` (atom), `scale-ladder` (atom), `glyph-table` (atom)
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

- Component reference with every example: https://insightcharts.dev/llms/profile-poster.md
- Registry item: https://insightcharts.dev/r/profile-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/profile-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/profile-poster
- These instructions as plain text: https://insightcharts.dev/agents/templates/profile-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
