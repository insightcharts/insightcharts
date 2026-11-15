---
title: Build an infographic poster
goal: One designed poster in the user's project, drawn by an infographic template or the poster frame, with the user's data, a poster theme and a source line.
llms: infographics
---
Build an infographic: one sheet with a painted background, a large title, little other text and one large graphic or several graphics laid out together. If the user has not given you the data and the one fact the poster should state, ask for both.

## Before you start

{{DETECT}}

## Choose the form

- Use an infographic when the piece is one image that is read in a few seconds and shared as a picture.
- Use a report-style template (`executive-brief`, `report-page`, `visual-essay`, `scorecard`) when the reader needs paragraphs, a method note, recommendations or charts with axes. See {{SITE_URL}}/agents/docs/templates.md.
- Use `social-card` for one fact at a fixed social image size.

## Steps

1. Pick the infographic template whose "use it when" matches the subject, from the table below. If none has the layout, compose one with the `poster` frame (see "The poster frame").
2. Read the template's regions and full example at `{{SITE_URL}}/agents/templates/<name>.md`.
3. Write `title` (required) as the poster's one fact with its number. Add `kicker` and `subtitle`.
4. Fill each region prop with a compact config: `data` rows, the field names and a `title` for that panel.
5. Set `theme` to a poster theme. Do not set colours.
6. Set `sources`. Put caveats such as "Illustrative data" in `note`.
7. Set `download: true` if the user wants a PNG. Set `linked: true` to make the marks clickable.
8. Render with `<Insight spec={spec} />`, or import the template by name.

## Infographic templates

{{INFOGRAPHIC_TABLE}}

## Region configs

Each template names its own regions, for example `hero`, `reference`, `area`, `bars` and `shares` on `count-poster`, or `scale` and `side` on `scale-poster`. A region takes one of three things.

- A compact config: `{ data, <field names>, title?, subtitle?, source?, note?, ...other props of the primitive that draws the region }`. The `title`, `subtitle`, `source` and `note` become the panel's heading and source line.
- A full spec with its own `type`. It replaces the primitive the template would have drawn.
- A React element.

To swap in the user's data, replace `data` in each region and point the field names at the user's columns. A region that leaves out `data` reads the template's shared `data` prop.

Props shared by the infographic templates: `title` (required), `kicker`, `subtitle`, `theme`, `mode`, `download`, `maxWidth`, `linked`, `sources`, `note`, `credit`, `level`. All but `matrix-poster` also take a shared `data` prop.

## Poster themes

The eight poster themes are {{POSTER_THEMES}}. Pass the name as `theme`. Each template has a default.

- `mode` is `"light"` by default. A poster keeps its colours on a dark page unless you set `mode: "auto"`.
- Only `paper` has a different dark variant. Get it with `mode: "dark"`.
- A poster theme has four or five categorical colours. Fold further entities into "Other".
- `posterThemes` and `posterBackgrounds` are exported from `insightcharts/themes`.

## The poster frame

Use the `poster` molecule when no template fits: `{ type: "poster", theme, title, panels: [...], sources }`.

| Panel field | Default | Purpose |
|---|---|---|
| `content` | required | A component spec such as `{ type: "pill-rank", ... }`, or a React element. |
| `title`, `subtitle` | none | Heading over the content and one line under it. |
| `span` | full width | Columns the panel covers, out of the poster's `columns` (12 by default). `span: 5` beside `span: 7` makes one row. |
| `rowSpan` | `1` | Rows the panel covers. Ignored when the poster reflows. |
| `source`, `note` | none | Source line and caveat under the panel. |
| `align` | `"left"` | `"left"`, `"center"` or `"right"`. |
| `valign` | `"start"` | `"start"`, `"center"` or `"end"`. |
| `bleed` | `false` | Runs the content to the poster's left and right edges. |
| `id` | none | Set as `data-panel`. |

Frame props: `columns` (12), `gap` (40), `padding` (56), `maxWidth` (1200), `aspect` (such as `"4:5"` or `0.75`), `background` (a CSS colour or gradient that replaces the ground), `rules` (`"dotted"`, `"solid"` or `"none"`), `titleAlign`, `credit`. Use at most about six panels. A chart in a panel takes the frame's theme and needs no `theme` or `mode`.

## Poster primitives

Prefer these atoms in panels. They print names and values on the marks, have no axes by default and set their own height. Each is a chart, so it takes `data`, `title`, `highlight`, `format` and the other common chart props. Any other atom also fits a panel.

{{POSTER_PRIMITIVE_TABLE}}

## Icons

An icon prop takes a built-in name such as `"person"`, `"bus"` or `"wind-turbine"`, or a custom path written as `"path://M0 0..."`. Unit charts repeat an icon by count. One icon stands for a fixed number of units, set with `unit` and stated with `unitLabel`. The full list of names is at {{SITE_URL}}/agents/docs/icons.md.

## Saving a PNG

`download: true` on the frame or on any infographic adds a "Download PNG" control under the poster. The image is the whole sheet without the control. The `poster` frame also takes `exportWidth` (default 2400), `filename`, `downloadLabel` and `onExport`. The infographic templates take `download` only.

## Phone layout

A poster lays out from its own width. At 760px and wider it uses the grid as written. From 600 to 759px it has two columns. Under 600px it has one column in panel order, so order the panels for that reading.

## Minimal example

```tsx
import { Insight } from "insightcharts";

const pupils = [
  { stage: "Primary", pupils: 820000 },
  { stage: "Lower secondary", pupils: 480000 },
  { stage: "Upper secondary", pupils: 540000 },
];

export function SchoolsPoster() {
  return (
    <Insight
      spec={{
        type: "count-poster",
        theme: "noir",
        kicker: "Education",
        title: "Norland's schools taught 1.84 million pupils in 2025",
        subtitle: "Pupils enrolled in state schools by stage, autumn term 2025.",
        unit: 1000,
        unitLabel: "1,000 pupils",
        hero: { data: pupils, name: "stage", value: "pupils", title: "820,000 pupils were in primary school" },
        sources: "Norland Ministry of Education, school census 2025",
        note: "Illustrative data",
        download: true,
      }}
    />
  );
}
```

## Verify

1. Validate the spec against {{SITE_URL}}/schema/insight-spec.json.
2. Render it at desktop width and in a container about 380px wide. No label may overflow its mark or overlap another.
3. Confirm the title states one fact with its number and that the number matches the data.
4. Confirm there is a `sources` line and a poster theme, and that every icon name is built in.
5. With `download` set, save the PNG and check that every panel is in the image.

## Common mistakes

- Setting colours on marks. Colour comes from the poster theme.
- Expecting the poster to switch with the page's dark mode. Set `mode: "auto"` for that.
- Passing `exportWidth` or `filename` to an infographic template. Only the `poster` frame takes them.
- Using `source` on a template. The footer prop is `sources`. `source` belongs to a region config or a panel.
- More than about six panels, or panels ordered for the desktop grid only.
- An icon name that is not built in. It falls back to another icon without an error.
- Scaling an icon by a value. Icons are repeated by count.
