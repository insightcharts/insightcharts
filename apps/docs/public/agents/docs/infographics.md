# Build an infographic poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: One designed poster in the user's project, drawn by an infographic template or the poster frame, with the user's data, a poster theme and a source line.

Build an infographic: one sheet with a painted background, a large title, little other text and one large graphic or several graphics laid out together. If the user has not given you the data and the one fact the poster should state, ask for both.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Choose the form

- Use an infographic when the piece is one image that is read in a few seconds and shared as a picture.
- Use a report-style template (`executive-brief`, `report-page`, `visual-essay`, `scorecard`) when the reader needs paragraphs, a method note, recommendations or charts with axes. See https://insightcharts.dev/agents/docs/templates.md.
- Use `social-card` for one fact at a fixed social image size.

## Steps

1. Pick the infographic template whose "use it when" matches the subject, from the table below. If none has the layout, compose one with the `poster` frame (see "The poster frame").
2. Read the template's regions and full example at `https://insightcharts.dev/agents/templates/<name>.md`.
3. Write `title` (required) as the poster's one fact with its number. Add `kicker` and `subtitle`.
4. Fill each region prop with a compact config: `data` rows, the field names and a `title` for that panel.
5. Set `theme` to a poster theme. Do not set colours.
6. Set `sources`. Put caveats such as "Illustrative data" in `note`.
7. Set `download: true` if the user wants a PNG. Set `linked: true` to make the marks clickable.
8. Render with `<Insight spec={spec} />`, or import the template by name.

## Infographic templates

| Component | Use it when | Pick something else when |
|---|---|---|
| [atlas-poster](https://insightcharts.dev/agents/templates/atlas-poster.md) | Use it when one subject has many small facts of different kinds (shares, places, a trend, a change, a ranking, a map) and none of them should dominate: a crop, an industry, a service, a country's internet. Fill at least eight regions. Give every panel a short heading that states its one number. Every region is optional, and each band shares its width among the panels that are present. | One dominant fact or graphic (use `count-poster`, `flow-poster` or `ranking-poster`). The same measures across several entities (use `matrix-poster`). Fewer than six panels (use `poster` and place them yourself). A phone-first piece: the spread becomes one long column under 600px. |
| [count-poster](https://insightcharts.dev/agents/templates/count-poster.md) | Use it when the subject is a large count of people or things in 2 to 6 groups and the reader should see the crowd: pupils by stage, trees planted by species, vehicles built by model. Give `hero` the groups and `reference` one to three quantities to compare them with. Both bands use the same `unit`, `icon` and icon size, so their areas compare. State the total in the title. | Counts under a few hundred (use `pictogram-chart` in a `poster`). Shares of one whole as the main point (use `waffle-chart` or `treemap`). A ranking of many named things (use `ranking-poster`). A flow from sources to destinations (use `flow-poster`). |
| [flow-poster](https://insightcharts.dev/agents/templates/flow-poster.md) | Use it when one producer leads and the reader should follow its output: ports and the buyers of one port's catch, regions and the users of one region's electricity, terminals and the routes out of the largest. Give `producers` 4 to 10 rows, `flow` 4 to 12 destinations of the leading producer, and `scale` the same destinations with a share (position) and a size. Keep the destination names identical in `flow` and `scale` so `linked` can join them. | Flows through more than one stage or between many sources and many destinations (use `sankey-chart` in a `poster`). A count of people or things (use `count-poster`). Many measures of the same entities (use `matrix-poster`). |
| [matrix-poster](https://insightcharts.dev/agents/templates/matrix-poster.md) | Use it for profiles of a handful of comparable things with measures in different units: cities, species, products, stations, teams. Pass one row per entity with every measure in it. Put the two measures whose relationship matters in `curve` and the rest in `columns`, choosing a counted glyph (`dots`, `blocks`, `icons`) for small whole numbers, `ring` for shares, `bar` or `circle` for magnitudes. Leave `highlight` out to give every entity its own colour, derived from the theme when its palette is smaller than the number of entities; set it to draw one or two entities in colour and the rest in grey. | One measure across entities (use `pill-rank` or `bar-chart`). More than 12 entities (use `data-table` or `heatmap`). A subject with a total and its parts (use `ranking-poster` or `flow-poster`). A phone-first piece: the table stacks into cards under 600px and the poster becomes long. |
| [network-poster](https://insightcharts.dev/agents/templates/network-poster.md) | Use it when the connections between 5 to about 20 named things are the subject: ferry crossings between harbours, joint papers between institutes, freight between rail yards. Give `hero` one row per connection and the `order` the entities sit in, `map` the entities with a size and optional hand-placed `x` and `y`, and `rank` one measure of each entity. With `linked`, a click on an entity in any of the three highlights it in the other two. | A flow from sources to destinations in one direction (use `flow-poster` or `sankey-chart`). More than about 20 entities or 40 connections, because the arcs cover each other. Entities with no meaningful order and few links (use `bubble-network` in a `poster`). Parts of one subject (use `radial-poster`). |
| [profile-poster](https://insightcharts.dev/agents/templates/profile-poster.md) | Use it for a fact sheet about one named thing: a vehicle, a reservoir, a building, a machine, a species. Give `portrait` one row with the share that defines the subject and the `icon` that stands for it, `figures` the numbers a reader should take away, `scale` the subject among 4 to 10 reference points, and `table` the subject beside 2 to 6 peers. Highlight the subject in `scale` and `table`. On a sheet at least 960px wide the silhouette, the figures and the scale stand in three columns. | Several subjects of equal weight (use `glyph-table` in a `poster`, or `ranking-poster`). A subject whose parts are the point (use `radial-poster`). A subject with no defining share: leave `portrait` to a full spec such as `stat-circles`, or use `scale-poster` when the scale is the whole subject. Change over time (use `timeline-poster`). |
| [radial-poster](https://insightcharts.dev/agents/templates/radial-poster.md) | Use it when the poster is about the 4 to 12 parts, causes, effects or scores of one thing: what a household's water goes on, the species one tree supports, where one home's energy goes. Give `hero` the spokes and an `icon` for the centre, state the total in the title, and use `figures` for the two to four numbers a reader should take away. | Parts of a whole that must be compared precisely (use `bar-chart` in a `poster`). Positions on one scale (use `scale-poster`). Change over time (use `timeline-poster`). Connections between many things (use `network-poster`). Large counts shown as crowds (use `count-poster`). |
| [ranking-poster](https://insightcharts.dev/agents/templates/ranking-poster.md) | Use it for a profile of one event, place or organisation that has a headline total, two ways to split it, a ranking of 6 to 12 named things and a few supporting magnitudes: a festival, a race, a nature reserve, a library service. Put the total in the title and repeat it as the first figure. Highlight the ranking row the heading is about. | A subject whose point is a count of people or things (use `count-poster`). Several entities compared on the same measures (use `matrix-poster`). Eight or more small graphics on one subject (use `atlas-poster`). A ranking alone (use `pill-rank` in a `poster`). |
| [scale-poster](https://insightcharts.dev/agents/templates/scale-poster.md) | Use it when the positions of 6 to about 16 named things on one scale are the whole subject: depths, altitudes, temperatures, distances, ages. Give the scale's rows and zones in `scale`, up to five `figures` with the scale position each belongs to, and optionally a `side` graphic of two to four magnitudes. Beside the scale the figures line up with their positions; under 760px they move below it. | Comparing sizes rather than positions (use `ranking-poster` or `count-poster`); change over time (use `timeline-poster`); more than about 16 items, because the labels run together; several unrelated graphics (use `poster` and lay the panels out yourself). |
| [timeline-poster](https://insightcharts.dev/agents/templates/timeline-poster.md) | Use it when the subject is how 4 to 8 named things grew, shrank and changed places over 4 to 10 periods: electricity by source, library loans by format, commuters by mode. Give `hero` the periods and entities, `milestones` the dated numbers a reader should take away, `bars` one measure of the whole at each period and `shares` one share at a few dates. State the latest value in the title. | A single series over time (use `line-chart` or `area-chart` in a `poster`). Events with start and end dates (use `timeline-chart` or the `timeline-story` template). More than 8 entities or 10 periods, because the bands get too thin to label. Positions on one scale (use `scale-poster`). Parts of one subject at one date (use `radial-poster`). |

## Region configs

Each template names its own regions, for example `hero`, `reference`, `area`, `bars` and `shares` on `count-poster`, or `scale` and `side` on `scale-poster`. A region takes one of three things.

- A compact config: `{ data, <field names>, title?, subtitle?, source?, note?, ...other props of the primitive that draws the region }`. The `title`, `subtitle`, `source` and `note` become the panel's heading and source line.
- A full spec with its own `type`. It replaces the primitive the template would have drawn.
- A React element.

To swap in the user's data, replace `data` in each region and point the field names at the user's columns. A region that leaves out `data` reads the template's shared `data` prop.

Props shared by the infographic templates: `title` (required), `kicker`, `subtitle`, `theme`, `mode`, `download`, `maxWidth`, `linked`, `sources`, `note`, `credit`, `level`. All but `matrix-poster` also take a shared `data` prop.

## Poster themes

The eight poster themes are `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. Pass the name as `theme`. Each template has a default.

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

| Component | Use it when | Pick something else when |
|---|---|---|
| [arc-diagram](https://insightcharts.dev/agents/atoms/arc-diagram.md) | Connections among up to about 20 entities that have a meaningful order (stops on a line, chapters, age groups, teams by size): trips between stations, trade between neighbours, characters sharing scenes. | Flows with a direction through stages (use sankey-chart); one source splitting into parts (use fan-flow); a full matrix of every pair where exact values matter (use heatmap); more than about 20 entities or 60 connections (use heatmap). |
| [block-bar](https://insightcharts.dev/agents/atoms/block-bar.md) | A short series or ranking that should read as a bold graphic with no axis: ticket sales in each of six years, two paired measures in five regions. Add `detail` for a second small figure above each bar and `marker` for an event between two bars. | More than 12 bars, more than two series or stacked parts (use bar-chart); negative values (use diverging-bar-chart); a long time series (use line-chart); values that differ by more than about 50 times, where the short bars vanish (use proportional-area). |
| [bubble-network](https://insightcharts.dev/agents/atoms/bubble-network.md) | Showing which of up to about 12 named things are connected, and how big each is: trade blocs, route maps between hubs, partnerships, shared ownership. Give `x` and `y` to place the circles by hand, for example roughly geographically. | Flows with magnitudes between stages (use sankey-chart); more than about 12 circles or a dense web of links (use heatmap as a matrix, or data-table); comparison of the sizes alone (use bar-chart or circle-pack). |
| [bubble-scale](https://insightcharts.dev/agents/atoms/bubble-scale.md) | A poster answer to "where does each one sit on this scale, and how big is it": 5 to about 40 named things with a rate or score (the scale) and a magnitude (the area), such as import dependency against share of demand. | Two measures that should be read against each other on two axes (use scatter-chart); one measure only (use beeswarm-chart or strip-plot); precise comparison of the sizes (use bar-chart); more than about 60 rows (use beeswarm-chart). |
| [circle-pack](https://insightcharts.dev/agents/atoms/circle-pack.md) | A poster view of 5 to about 60 parts of very different sizes where the reader should see the largest ones and their rough proportions at once: budgets by programme, emissions by source, users by product. One level of grouping is supported. | Values that need precise comparison (use bar-chart, where bars share a baseline); parts that must visibly add up to a whole (use treemap or waffle-chart); more than about 80 parts (use treemap); negative values (use diverging-bar-chart). |
| [curve-rank](https://insightcharts.dev/agents/atoms/curve-rank.md) | Two different measures of the same 4 to about 15 entities, when the point is how standing on one relates to standing on the other: price against sales, staff against output, cost against usage. Each side has its own scale, stated in its heading. | The same measure at two moments (use slope-chart); ranks across many periods (use bump-chart); more than about 15 entities or a statistical relationship (use scatter-chart); exact comparison on one measure (use bar-chart). |
| [fan-flow](https://insightcharts.dev/agents/atoms/fan-flow.md) | One total divided among 4 to about 14 destinations (or collected from that many origins, with `direction: "in"`) when the picture of the split is the point: where a budget goes, what a day's water is used for, which sources feed one total. | Flows with more than one stage or several sources (use sankey-chart); precise comparison of the parts (use bar-chart); 2 to 4 parts (use segmented-bar or donut-chart); values that can be negative (use bar-chart). |
| [glyph-table](https://insightcharts.dev/agents/atoms/glyph-table.md) | Comparing 3 to about 12 entities across 2 to 5 measures with different units, when the table should read as a graphic: profiles of products, cities, teams or species. Pair it with curve-rank by passing both the same `order`. | Looking up many exact values, sorting, or more than about 12 rows (use data-table); one measure across entities (use bar-chart or pictogram-chart); a trend over time (use line-chart or small-multiples). |
| [icon-array-grid](https://insightcharts.dev/agents/atoms/icon-array-grid.md) | Counts of up to about 150 in 4 to 24 categories, especially rates per 100 or per 1,000: cars per 100 households in 12 districts. Set `total` so every tile shows the same full array with the uncounted icons as ghosts. | Counts in the thousands (use unit-blocks); two to six categories where one row of icons each is enough (use pictogram-chart); values that need precise comparison or ranking (use block-bar or bar-chart); one share of one whole (use waffle-chart). |
| [nested-shares](https://insightcharts.dev/agents/atoms/nested-shares.md) | How much of one whole something was at 2 to 8 dates or in 2 to 8 categories, when the growth of a share is the point: bicycles made 4% of trips in 2005 and 27% in 2025. | Shares that are parts of each other and should add up (use waffle-chart or treemap); more than 8 items or precise reading of a trend (use line-chart); shares within a point or two of each other, where outlines coincide (use block-bar). |
| [orbit-chart](https://insightcharts.dev/agents/atoms/orbit-chart.md) | A designed alternative to a table for 6 to about 40 named things grouped by distance, level or era from one centre: suppliers by tier, moons by planet-distance band, releases by decade, stakeholders by closeness. One item can be highlighted. | A numeric distance that must be read exactly (use strip-plot or scatter-chart); comparison of the dot values (use bar-chart); more than about 6 rings or 40 items (use data-table); hierarchy with sizes that add up (use treemap or circle-pack). |
| [pill-rank](https://insightcharts.dev/agents/atoms/pill-rank.md) | A poster ranking of 4 to about 20 named things where the order and the overall silhouette matter more than fine differences: top cities, largest employers, league tables, with one row highlighted and optional reference rows set apart below. | Precise comparison of values (use bar-chart, where bars share a baseline); negative values (use diverging-bar-chart); change in rank over time (use bump-chart); more than about 25 rows (use data-table). |
| [proportional-area](https://insightcharts.dev/agents/atoms/proportional-area.md) | A few quantities that differ a lot (2 times to 100 times), where the reader should feel the difference in size: lake areas, budgets, market sizes. Nest them to show one quantity inside another. | Values within about 30% of each other, where areas look the same (use block-bar or bar-chart); more than 8 values (use treemap or bar-chart); parts of one whole (use treemap or waffle-chart); negative values. |
| [radial-spokes](https://insightcharts.dev/agents/atoms/radial-spokes.md) | A poster of 4 to 12 effects, causes or attributes of one subject, which sits in the centre as an icon or a short label: what a household's energy goes on, the side effects of one drug, the scores of one product. | Precise comparison or a ranking (use bar-chart or pill-rank); a dimension that is a cycle, such as hours or months (use radial-bar-chart); more than 12 rows (use bar-chart); several subjects compared on the same attributes (use small-multiples or heatmap). |
| [ribbon-chart](https://insightcharts.dev/agents/atoms/ribbon-chart.md) | 4 to 8 entities over 4 to 10 periods when both the size of each and the changing order matter, and the graphic should read as one flowing form: market shares, harvests, medal tables, budget lines. | Totals that matter more than order, or a smooth centred stream of many periods (use area-chart, which has stacked and stream modes); rank alone (use bump-chart); more than 8 entities or 10 periods (use line-chart or small-multiples); values that can be negative (use line-chart). |
| [scale-ladder](https://insightcharts.dev/agents/atoms/scale-ladder.md) | Answering how deep, how high, how hot, how old or how far each of 4 to about 20 things is on one shared scale, when the reader needs the positions themselves: depths, altitudes, temperatures, ages, distances. Use `zones` to name ranges along the scale. | Comparing sizes rather than positions (use bar-chart or lollipop-chart); events with start and end dates (use timeline-chart); a distribution of many unnamed values (use strip-plot or histogram). |
| [shape-fill](https://insightcharts.dev/agents/atoms/shape-fill.md) | One to six shares of a full amount where the object itself says what is measured: how full a reservoir is, how charged a fleet is, what share of homes have a heat pump. | The fill height only approximates the share, because an irregular silhouette holds less area at its narrow end, so the number must always stay printed; for values to be compared precisely use block-bar or bar-chart, for a counted share use waffle-chart, for a compact inline meter use progress-meter. |
| [stat-circles](https://insightcharts.dev/agents/atoms/stat-circles.md) | The poster way to show two to six related magnitudes whose rough proportion is the point: kilograms per person in three countries, the same quantity in three years, a total and its parts set side by side. | More than six values or values that need precise comparison (use bar-chart); a single number (use big-number); many circles of one whole (use circle-pack); values close together, where areas look the same (use bar-chart or dumbbell-chart). |
| [unit-blocks](https://insightcharts.dev/agents/atoms/unit-blocks.md) | Large counts of people or things in 2 to 12 groups, where the reader should see the crowd itself: 20,350 marathon finishers by age group, one figure per 10 runners. | Precise comparison of close values (use block-bar or bar-chart); fewer than about 30 icons per group (use pictogram-chart or icon-array-grid); shares of one whole (use waffle-chart). |

## Icons

An icon prop takes a built-in name such as `"person"`, `"bus"` or `"wind-turbine"`, or a custom path written as `"path://M0 0..."`. Unit charts repeat an icon by count. One icon stands for a fixed number of units, set with `unit` and stated with `unitLabel`. The full list of names is at https://insightcharts.dev/agents/docs/icons.md.

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

1. Validate the spec against https://insightcharts.dev/schema/insight-spec.json.
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

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/infographics.md
- This page: https://insightcharts.dev/docs/infographics
- These instructions as plain text: https://insightcharts.dev/agents/docs/infographics.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
