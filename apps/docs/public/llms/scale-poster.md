# Scale poster (`scale-poster`)

> A tall poster that is one illustrated scale: a full-height `scale-ladder` with icons, leader-labelled items and named zones, and a narrow side column of large figures and one small graphic, each set level with the part of the scale it describes.

- Component: `ScalePoster` (import from `insightcharts`)
- Spec type: `"scale-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the positions of 6 to about 16 named things on one scale are the whole subject: depths, altitudes, temperatures, distances, ages. Give the scale's rows and zones in `scale`, up to five `figures` with the scale position each belongs to, and optionally a `side` graphic of two to four magnitudes. Beside the scale the figures line up with their positions; under 760px they move below it.

## Avoid

Comparing sizes rather than positions (use `ranking-poster` or `count-poster`); change over time (use `timeline-poster`); more than about 16 items, because the labels run together; several unrelated graphics (use `poster` and lay the panels out yourself).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scale-poster
```

The file lands at `components/insightcharts/templates/scale-poster.tsx`. `@insightcharts/scale-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ScalePoster } from "insightcharts";

<ScalePoster
  theme="ocean"
  kicker="Oceans"
  title="The Meridian Deep survey logged 12 sightings between 8 m and 3,750 m"
  subtitle="Depth of each sighting on one research dive, metres below the surface."
  scale={{
    data: [
      { sighting: "Survey ship hull", m: 8, icon: "ship" },
      { sighting: "Kelp canopy", m: 120, icon: "leaf" },
      { sighting: "Sardine shoal", m: 310, icon: "fish" },
      { sighting: "Lanternfish layer", m: 560, icon: "fish" },
      { sighting: "Swordfish", m: 820, icon: "fish" },
      { sighting: "Coral mound", m: 1150, icon: "tree" },
      { sighting: "Sperm whale", m: 1480, icon: "wave" },
      { sighting: "Anglerfish", m: 1900, icon: "fish" },
      { sighting: "Sensor array", m: 2300, icon: "satellite" },
      { sighting: "Dumbo octopus", m: 2750, icon: "star" },
      { sighting: "Sea cucumbers", m: 3200, icon: "circle" },
      { sighting: "Seabed lander", m: 3750, icon: "pin" },
    ],
    name: "sighting",
    value: "m",
    iconField: "icon",
    direction: "down",
    min: 0,
    max: 4000,
    format: "{value} m",
    scaleLabel: "Depth, metres",
    zones: [
      { from: 0, to: 200, label: "Sunlit" },
      { from: 200, to: 1000, label: "Twilight zone" },
      { from: 1000, to: 4000, label: "Dark zone" },
    ],
  }}
  figures={[
    { at: 200, value: "1%", label: "of surface light is left" },
    { at: 1000, value: "4°C", label: "water temperature" },
    { at: 3000, value: "376 atm", label: "pressure at the lander, 3,750 m down" },
  ]}
  side={{
    data: [
      { zone: "species in the sunlit zone", species: 148 },
      { zone: "species in the twilight zone", species: 61 },
      { zone: "species in the dark zone", species: 23 },
    ],
    name: "zone",
    value: "species",
    title: "Species logged",
    height: 250,
  }}
  sideAt={1900}
  sources="Meridian Deep survey log"
  note="The Meridian Deep survey is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "scale-poster",
  "theme": "ocean",
  "kicker": "Oceans",
  "title": "The Meridian Deep survey logged 12 sightings between 8 m and 3,750 m",
  "subtitle": "Depth of each sighting on one research dive, metres below the surface.",
  "scale": {
    "data": [
      { "sighting": "Survey ship hull", "m": 8, "icon": "ship" },
      { "sighting": "Kelp canopy", "m": 120, "icon": "leaf" },
      { "sighting": "Sardine shoal", "m": 310, "icon": "fish" },
      { "sighting": "Lanternfish layer", "m": 560, "icon": "fish" },
      { "sighting": "Swordfish", "m": 820, "icon": "fish" },
      { "sighting": "Coral mound", "m": 1150, "icon": "tree" },
      { "sighting": "Sperm whale", "m": 1480, "icon": "wave" },
      { "sighting": "Anglerfish", "m": 1900, "icon": "fish" },
      { "sighting": "Sensor array", "m": 2300, "icon": "satellite" },
      { "sighting": "Dumbo octopus", "m": 2750, "icon": "star" },
      { "sighting": "Sea cucumbers", "m": 3200, "icon": "circle" },
      { "sighting": "Seabed lander", "m": 3750, "icon": "pin" }
    ],
    "name": "sighting",
    "value": "m",
    "iconField": "icon",
    "direction": "down",
    "min": 0,
    "max": 4000,
    "format": "{value} m",
    "scaleLabel": "Depth, metres",
    "zones": [
      { "from": 0, "to": 200, "label": "Sunlit" },
      { "from": 200, "to": 1000, "label": "Twilight zone" },
      { "from": 1000, "to": 4000, "label": "Dark zone" }
    ]
  },
  "figures": [
    { "at": 200, "value": "1%", "label": "of surface light is left" },
    { "at": 1000, "value": "4°C", "label": "water temperature" },
    { "at": 3000, "value": "376 atm", "label": "pressure at the lander, 3,750 m down" }
  ],
  "side": {
    "data": [
      { "zone": "species in the sunlit zone", "species": 148 },
      { "zone": "species in the twilight zone", "species": 61 },
      { "zone": "species in the dark zone", "species": 23 }
    ],
    "name": "zone",
    "value": "species",
    "title": "Species logged",
    "height": 250
  },
  "sideAt": 1900,
  "sources": "Meridian Deep survey log",
  "note": "The Meridian Deep survey is invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

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

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [scale-ladder](https://insightcharts.dev/llms/scale-ladder.md), [stat-circles](https://insightcharts.dev/llms/stat-circles.md)
- Used by: no molecule or template yet

## More examples

### Forest, a climb read upwards, linked

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

### Noir, a log scale, with download

```tsx
import { ScalePoster } from "insightcharts";

<ScalePoster
  theme="noir"
  download
  kicker="Space"
  title="The Moon is 384,400 km from Earth"
  subtitle="Height above Earth's surface of eight objects, kilometres, on a log scale."
  scale={{
    data: [
      { object: "Airliner at cruise", km: 11, icon: "plane" },
      { object: "Weather balloon", km: 35, icon: "circle" },
      { object: "Kármán line", km: 100, icon: "flag" },
      { object: "Space Station", km: 400, icon: "satellite" },
      { object: "Hubble telescope", km: 540, icon: "satellite" },
      { object: "GPS satellites", km: 20200, icon: "satellite" },
      { object: "Geostationary orbit", km: 35786, icon: "satellite" },
      { object: "The Moon", km: 384400, icon: "globe" },
    ],
    name: "object",
    value: "km",
    iconField: "icon",
    scale: "log",
    min: 10,
    max: 1000000,
    format: "{value} km",
    scaleLabel: "Height, km",
    zones: [
      { from: 10, to: 100, label: "Atmosphere" },
      { from: 100, to: 2000, label: "Low Earth orbit" },
      { from: 2000, to: 1000000, label: "High orbits and beyond" },
    ],
  }}
  figures={[
    { at: 384400, value: "3 days", label: "flight time of a crewed mission to the Moon" },
    { at: 35786, value: "24 hours", label: "to circle Earth once in geostationary orbit" },
    { at: 400, value: "92 min", label: "to circle Earth once on the space station" },
    { at: 100, value: "100 km", label: "is the usual line for the start of space" },
  ]}
  sources="NASA fact sheets"
  note="Rounded figures. Flight and orbit times are approximate."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/scale-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/scale-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
