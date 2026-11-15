# Choose and build the right InsightCharts component

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: The user's data is drawn with the component level that fits the job, with a title that states one fact, a highlight and a source.

Decide which kind of component the user's request needs, then build it. If the user has not given you the data and the one fact the graphic should show, ask for both before writing code.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Choose the level

The library has 100 components in three levels. Each one can be written as JSX or as a JSON spec `{ "type": "<name>", ...props }`.

| The user wants | Use | Where to choose |
|---|---|---|
| One chart or one number | An atom (61): `bar-chart`, `line-chart`, `big-number` | `https://insightcharts.dev/agents/atoms.md` |
| One point made with a few parts: a row of statistics, a chart with a callout, linked charts | A molecule (19): `stat-row`, `chart-callout`, `linked-charts` | `https://insightcharts.dev/agents/molecules.md` |
| A whole page with paragraphs, several charts, a method note or recommendations | A report-style template (10): `executive-brief`, `report-page`, `visual-essay`, `scorecard` | `https://insightcharts.dev/agents/templates.md` |
| One image with little text that is shared as a picture | An infographic template (10), drawn on the `poster` molecule from 19 poster primitives | `https://insightcharts.dev/agents/infographics.md` |

Rules for choosing:

1. Use the smallest level that does the job. Do not use a template for one chart.
2. Check for a molecule or template before you lay out atoms by hand.
3. Defaults that are usually right: one figure is `big-number`, a ranking is `bar-chart`, change over five or more periods is `line-chart`.
4. Use only component names that exist. The full list with "use when" and "avoid when" is at `https://insightcharts.dev/llms.txt`.

## Features on every chart

Every chart atom takes these without extra code:

- `data` as rows, columns, CSV text, a URL, an async function or an Arrow-style table, and JSON `transform` objects.
- `title`, `subtitle`, `source` and `note` drawn as HTML, with loading, empty and error states.
- `highlight` (the entity the title is about) and `annotations` (a date, a threshold or one value).
- `theme` and `mode`. Dark mode follows the page by default.
- `select` for click filtering, shared between charts inside `InsightData`.
- `exportable` for PNG, JPEG, SVG, PDF, CSV and JSON export, and `table` for a "View data" table.
- `option` to merge any ECharts setting over the generated option.

## Steps

1. Read the data. Write down the one fact to show, with its number and period. This is the `title`.
2. Choose the level and the component with the table above.
3. Install the package:

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bar-chart
```

The file lands at `components/insightcharts/atoms/bar-chart.tsx`. Import the component from there when you install it this way.

4. Write the component with field names as strings. Set `title`, `subtitle`, `source` and `highlight`.
5. Render it and check it.

## Minimal example

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2019", Solar: 705, Wind: 1420 },
  { year: "2020", Solar: 855, Wind: 1590 },
  { year: "2021", Solar: 1050, Wind: 1860 },
  { year: "2022", Solar: 1320, Wind: 2110 },
  { year: "2023", Solar: 1640, Wind: 2310 },
  { year: "2024", Solar: 2130, Wind: 2500 },
];

export function SolarAndWind() {
  return (
    <LineChart
      data={data}
      x="year"
      y={["Solar", "Wind"]}
      highlight="Solar"
      title="Solar generation rose from 705 TWh in 2019 to 2,130 TWh in 2024"
      subtitle="Global electricity generation from solar and wind, TWh"
      source="Name the source of the user's data here"
    />
  );
}
```

The same chart as JSON: `<Insight spec={{ type: "line-chart", data, x: "year", y: ["Solar", "Wind"], highlight: "Solar", title: "..." }} />` with `import { Insight } from "insightcharts"`.

## Instructions for the next job

| Job | Instructions |
|---|---|
| Install and entry points | `https://insightcharts.dev/agents/docs/installation.md` |
| First chart, formats, provider | `https://insightcharts.dev/agents/docs/quickstart.md` |
| Connect a data source, reshape rows | `https://insightcharts.dev/agents/docs/data.md` |
| Titles, highlight, annotations | `https://insightcharts.dev/agents/docs/highlighting-and-annotations.md` |
| Brand colours and themes | `https://insightcharts.dev/agents/docs/theming.md` |
| Charts that filter each other | `https://insightcharts.dev/agents/docs/crossfiltering.md` |
| One component | `https://insightcharts.dev/agents/<level>/<name>.md`, where `<level>` is `atoms`, `molecules` or `templates` |

## Verify

1. Run the project's typecheck. A misspelt prop is a type error.
2. Render the page. The title, the chart, the direct labels and the source line are visible without hovering.
3. Check at desktop width, at about 380px wide and in dark mode. No label is clipped or overlapping.
4. Every number in the title can be found in or computed from the data.

## Common mistakes

- Choosing the chart before finding the fact. Find the fact first.
- Inventing a component name or a prop. Use only names from the catalogue.
- Setting colours per series. Use `highlight` and a theme.
- Building a page from atoms and CSS when a template already has that layout.
- Leaving out `source`.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/choosing-a-form.md
- This page: https://insightcharts.dev/docs
- These instructions as plain text: https://insightcharts.dev/agents/docs.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
