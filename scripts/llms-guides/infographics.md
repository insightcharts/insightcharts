---
title: Infographics
description: When to choose a poster over a report-style template, how to write an infographic spec, the poster frame and its panels, the eight poster themes, the poster primitives, icons, PNG download and the phone layout.
order: 6.5
---
An infographic is a template with `category: "infographic"`. It draws one designed sheet, called a poster: a painted background, a large title, little other text, and one large graphic or several graphics laid out together. Every infographic is composed on the `poster` molecule from atoms with `category: "poster"`, called poster primitives.

## When to choose a poster

| The piece is | Use |
|---|---|
| One image that is read in a few seconds and shared as a picture | An infographic template |
| One image with a layout no infographic template has | The `poster` molecule with your own panels |
| One fact at a fixed social size (1:1, 4:5, 16:9, 9:16) | `social-card` |
| A page with paragraphs, a method note, recommendations or charts with axes | A report-style template such as `executive-brief`, `report-page` or `visual-essay` |
| A dashboard the reader filters | `data-explorer` |

A poster suits large counts, rankings, shares, flows and scales that read from the size of the marks. It does not suit dense time series or anything that needs axes and gridlines to be read.

## The infographic templates

Pick the template from the decision table in "Choosing a form" (rows with the job "Lay out a whole poster"). Each template's page lists its regions and has a complete example.

## Writing an infographic spec

```json
{
  "type": "count-poster",
  "theme": "noir",
  "kicker": "Education",
  "title": "Norland's schools taught 1.84 million pupils in 2025",
  "subtitle": "Pupils enrolled in state schools by stage, autumn term 2025.",
  "unit": 1000,
  "unitLabel": "1,000 people",
  "hero": {
    "data": [
      { "stage": "Primary", "pupils": 820000 },
      { "stage": "Lower secondary", "pupils": 480000 },
      { "stage": "Upper secondary", "pupils": 390000 },
      { "stage": "Vocational", "pupils": 170000 }
    ],
    "name": "stage",
    "value": "pupils",
    "title": "820,000 pupils were in primary school"
  },
  "sources": "Norland Ministry of Education, school census 2025",
  "note": "Norland is an invented country. All figures are illustrative."
}
```

Render it with `<Insight spec={spec} />`.

- `title` is required. It is the poster's one fact, as a plain sentence with its number. `kicker` is a short topic label and `subtitle` names the measure, population and period.
- `theme` is a poster theme name. Each template has its own default.
- Each template has named region props (`hero`, `reference`, `area`, `bars` and `shares` on `count-poster`; `scale`, `figures` and `side` on `scale-poster`). Read the template's page for its regions.
- A region takes a compact config: `data` rows, the field names, and any other prop of the primitive that draws the region. A `title`, `subtitle`, `source` or `note` in the config becomes the heading and source line of that panel.
- A region also takes a full spec with its own `type`. That replaces the primitive the template would have drawn.
- `sources`, `note` and `credit` are the footer. Always set `sources`. Say in `note` when data is illustrative.
- `linked: true` makes marks clickable. A click highlights the same name in every other graphic that has it and filters graphics that read the shared `data` prop.
- `download: true` adds a "Download PNG" control under the poster.
- `maxWidth` limits the width. `mode` is `"light"` by default and a poster does not follow the page's colour mode.

Keep names identical across regions (the same spelling of each entity) so `linked` can join them.

## Composing a poster with the poster frame

Use `poster` when no template has the layout.

```json
{
  "type": "poster",
  "theme": "forest",
  "kicker": "Transport",
  "title": "Tarn Valley buses carried 9.6 million passengers in 2025",
  "subtitle": "Passengers on the valley's seven bus routes, January to December 2025.",
  "panels": [
    { "span": 5, "valign": "center", "content": { "type": "big-number", "size": "hero", "value": "9.6 million", "label": "Passengers in 2025", "context": "8.9 million in 2024" } },
    {
      "span": 7,
      "title": "Route 4 carried 2.3 million passengers",
      "subtitle": "Passengers by route, thousands, 2025",
      "content": { "type": "pill-rank", "data": [{ "route": "Route 4", "k": 2300 }, { "route": "Route 1", "k": 1900 }, { "route": "Route 7", "k": 1500 }], "name": "route", "value": "k", "format": "{value}k", "highlight": "Route 4" }
    },
    {
      "title": "Passenger numbers were 6.1 million in 2021",
      "content": { "type": "block-bar", "data": [{ "year": "2021", "m": 6.1 }, { "year": "2023", "m": 8.2 }, { "year": "2025", "m": 9.6 }], "name": "year", "value": "m", "format": "{value}m" }
    }
  ],
  "sources": "Tarn Valley Transport Authority",
  "note": "Tarn Valley is an invented place. All figures are illustrative."
}
```

- `panels` is required. Each panel is `{ content, title?, subtitle?, span?, rowSpan?, source?, note?, align?, valign?, bleed?, id? }`.
- `content` is a component spec. Put the panel's heading in the panel's `title`, not in the chart's `title`. Every panel heading is then set in the same type.
- `columns` is 12 by default. `span` is in those units and defaults to the full width. `span: 5` beside `span: 7` makes one row. `columns: 2` or `columns: 3` gives a simple grid.
- `aspect` fixes the shape (`"4:5"`, `"16:9"`, `0.75`). The poster still grows when its content needs more height.
- `rules` is `"dotted"` (default), `"solid"` or `"none"`.
- The frame passes its theme and colour mode to everything inside. Do not set `theme` or `mode` on a chart in a panel.
- Use at most about six panels. Give charts in panels a `height` when they do not size themselves (`bar-chart`, `donut-chart`, `treemap`). Poster primitives size themselves.

## Poster themes

Eight themes, passed by name as `theme`.

| Name | Ground | Marks |
|---|---|---|
| `noir` | Near-black `#0d0d0f` | Yellow, sky blue, coral, off-white, green. White type. |
| `magenta` | Magenta `#c2006b` | Pale pink, near-black, cyan, yellow. White type. |
| `dusk` | Violet gradient, `#24104f` to `#5e2067` | Orange, pale yellow, pink, lilac, mint. White type. |
| `paper` | Off-white `#f3ecdf` | Red, ink black, warm grey, blue. Black type. `mode: "dark"` gives the same design on charcoal `#1d1b18`. |
| `ocean` | Navy to teal gradient, `#041c3a` to `#084c5c` | Aqua, coral, sand, blue. White type. |
| `forest` | Dark green `#0f3d2a` | Lime, orange, cream, light blue. Cream type. |
| `blueprint` | Cobalt `#1447c8` | Yellow, white, salmon, pale blue. White type. Monospace display face. |
| `sunrise` | Cream to peach gradient, `#fff1e0` to `#ffdfc6` | Plum, tangerine, teal, blue. Plum type. |

- Seven themes have one look: the same tokens in light and dark. Only `paper` has a different dark variant.
- A poster theme has 4 or 5 categorical colours. Fold further entities into "Other" or shade by value.
- `posterThemes` and `posterBackgrounds` are exported from `insightcharts/themes`. `posterBackgrounds[name].light` is the CSS background, which is a gradient for `dusk`, `ocean` and `sunrise`.
- Do not hard-code colours in a spec. Pick a theme.

## Poster primitives

The data job to primitive table is in "Choosing a form" under "Poster primitives". A primitive is a chart built with `defineChart` and accepts the common chart props (`data`, `transform`, `title`, `highlight`, `format`, `select`, ...). It prints names and values on or beside its marks, has no axes by default and sets its own height. It works in any theme and outside a poster.

Any other atom also fits a panel. `big-number` (with `size: "hero"`), `pictogram-chart`, `treemap`, `waffle-chart`, `segmented-bar`, `donut-chart`, `bar-chart` and `icon-stat` are used in the `poster` examples.

## Icons

An icon prop (`icon`, `icons`, `iconField` values) takes a built-in name or a custom single path written as `"path://M0 0..."` on a 24 by 24 grid. Use only these names:

- People: `person`, `woman`, `child`, `baby`, `group`
- Home and buildings: `house`, `building`, `factory`, `hospital`, `school`, `shop`
- Transport: `car`, `bus`, `train`, `bike`, `plane`, `ship`, `truck`, `rocket`
- Nature and energy: `tree`, `leaf`, `sun`, `cloud`, `rain`, `drop`, `snow`, `wind-turbine`, `solar-panel`, `flame`, `bolt`, `battery`, `barrel`, `plug`, `mountain`, `wave`, `globe`
- Food and farming: `wheat`, `bread`, `apple`, `carrot`, `fish`, `cow`, `chicken`, `milk-bottle`, `cup`, `bottle`, `fork-knife`
- Money and shopping: `coin`, `banknote`, `cart`, `bag`, `bin`
- Objects: `phone`, `laptop`, `book`, `lightbulb`, `heart`, `cross`, `pill`, `syringe`, `clock`, `calendar`, `flag`, `star`, `pin`, `lock`, `satellite`
- Shapes: `circle`, `square`

An unknown name falls back to another icon without an error. Check every icon name against this list. `icons`, `iconNames`, `iconGroups`, `resolveIcon` and `iconSymbol` are exported from `insightcharts` and `insightcharts/core`. The `Icon` component draws one icon as inline SVG and takes `name`, `size`, `color`, `title` and `fallback`.

## PNG download

- `download: true` on `poster` or on any infographic adds a "Download PNG" control under the sheet. The image is the whole sheet without the control.
- On `poster`, `exportWidth` sets the image width (default 2400), `filename` the file name (default: a slug of the title), `downloadLabel` the label and `onExport` receives the `Blob`. The infographic templates take `download` only.
- With `download` set, every chart in the poster mounts at once instead of lazily.
- From code: `rasterize(element, pixelWidth)` and `canvasToBlob(canvas)` from `insightcharts/core` paint any element to a PNG, and `downloadBlob(blob, name)` saves it. The poster sheet is the element with `data-slot="ic-poster"`.
- The painter draws backgrounds including linear and radial gradients, borders, radii, clipping, text, inline SVG and canvases. It does not draw outer or blurred shadows, CSS transforms, conic or repeating gradients or `url()` backgrounds.

## Phone layout

A poster lays out from its own width, not the viewport.

| Poster width | Layout |
|---|---|
| 760px and wider | The grid as written. |
| 600 to 759px | Two columns. On a 12-unit grid a panel with `span` up to 6 takes one column and a wider panel takes both. |
| Under 600px | One column, every panel full width, in the order of `panels`. |

Under 600px the padding is 20px, the gap is 28px and a fixed `aspect` is dropped. Order `panels` so the poster reads correctly as one column. Poster primitives lay themselves out again for the narrow width.

## Checklist

- The `title` is one clause with its number and period.
- Every panel heading is one fact about that panel or a plain label.
- `sources` is set.
- Every icon name is in the list above.
- Entity names are spelt the same in every region.
- There are at most about six panels.
- No chart in a panel sets its own `theme` or `mode`.
