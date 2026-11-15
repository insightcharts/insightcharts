# Build an infographic poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Subject: <what the poster is about>
Data: <paths to the data, or paste the tables here>
Main fact: <one sentence with its number, or leave blank and propose one from the data>
Theme: <`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`; leave blank for noir>
Download as PNG: <yes or no>
Source of the data: <name of the source>
Where to put it: <the route or component file, or leave blank and ask>
```

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Check a poster is the right form. A poster is one image with little text that is read in a few seconds. If the reader needs paragraphs, a method note or charts with axes, tell the user and propose a report-style template instead.
3. Choose the infographic template. Read the decision table at `https://insightcharts.dev/agents/infographics.md` and pick the template whose "use it when" matches the subject.

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

4. Fetch the instructions for the template: `https://insightcharts.dev/agents/templates/<name>.md`. It lists the regions and has a complete example. Use only the props it lists.
5. Write `title` as the poster's one fact, in one clause, with its number. Add `kicker` for the topic and `subtitle` for the measure, population and period.
6. Fill each region prop with a compact config: `data` rows, the field names such as `name` and `value`, and a `title` for that panel. Leave out a region you have no data for, unless it is required.
7. Set `theme` to a poster theme name. Do not set colours. A poster keeps its own colours in dark mode.
8. Icon props take a built-in icon name or a `path://` string. Use only names from the [icons](https://insightcharts.dev/docs/icons) page.
9. Set `sources`. Set `note` when the data is illustrative.
10. Set `download: true` when the user wants a PNG. Set `linked: true` to make the marks clickable.
11. Render the spec with `Insight`.
12. If no template has the layout, compose the poster on the `poster` molecule: `{ type: "poster", theme, title, panels: [{ span, title, content: { type: "pill-rank", ... } }], sources }`. `span` is out of 12 columns. Use at most about six panels and prefer poster primitives in them. Fetch `https://insightcharts.dev/agents/molecules/poster.md`.

## Example of the result

```tsx
import { Insight } from "insightcharts";

const pupils = [
  { stage: "Primary", pupils: 820000 },
  { stage: "Lower secondary", pupils: 480000 },
  { stage: "Upper secondary", pupils: 390000 },
  { stage: "Special schools", pupils: 150000 },
];

export function SchoolsPoster() {
  return (
    <Insight
      spec={{
        type: "count-poster",
        theme: "noir",
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

- The spec validates against `https://insightcharts.dev/schema/insight-spec.json`.
- The title states one fact with its number, and the number matches the data.
- Every mark has its name and value printed on or beside it. No text overflows or overlaps.
- The poster becomes one column under 600 pixels wide, and the panels read in a sensible order there.
- The theme name is one of the poster themes and is spelt exactly.
- `sources` is set.
- With `download: true`, the "Download PNG" control saves the whole poster.

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/infographic-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
