---
title: Choose and build the right InsightCharts component
goal: The user's data is drawn with the component level that fits the job, with a title that states one fact, a highlight and a source.
llms: choosing-a-form
---
Decide which kind of component the user's request needs, then build it. If the user has not given you the data and the one fact the graphic should show, ask for both before writing code.

## Before you start

{{DETECT}}

## Choose the level

The library has {{COMPONENT_COUNT}} components in three levels. Each one can be written as JSX or as a JSON spec `{ "type": "<name>", ...props }`.

| The user wants | Use | Where to choose |
|---|---|---|
| One chart or one number | An atom ({{ATOM_COUNT}}): `bar-chart`, `line-chart`, `big-number` | `{{SITE_URL}}/agents/atoms.md` |
| One point made with a few parts: a row of statistics, a chart with a callout, linked charts | A molecule ({{MOLECULE_COUNT}}): `stat-row`, `chart-callout`, `linked-charts` | `{{SITE_URL}}/agents/molecules.md` |
| A whole page with paragraphs, several charts, a method note or recommendations | A report-style template ({{PAGE_TEMPLATE_COUNT}}): `executive-brief`, `report-page`, `visual-essay`, `scorecard` | `{{SITE_URL}}/agents/templates.md` |
| One image with little text that is shared as a picture | An infographic template ({{INFOGRAPHIC_COUNT}}), drawn on the `poster` molecule from {{POSTER_PRIMITIVE_COUNT}} poster primitives | `{{SITE_URL}}/agents/infographics.md` |

Rules for choosing:

1. Use the smallest level that does the job. Do not use a template for one chart.
2. Check for a molecule or template before you lay out atoms by hand.
3. Defaults that are usually right: one figure is `big-number`, a ranking is `bar-chart`, change over five or more periods is `line-chart`.
4. Use only component names that exist. The full list with "use when" and "avoid when" is at `{{SITE_URL}}/llms.txt`.

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

{{INSTALL}}

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
| Install and entry points | `{{SITE_URL}}/agents/docs/installation.md` |
| First chart, formats, provider | `{{SITE_URL}}/agents/docs/quickstart.md` |
| Connect a data source, reshape rows | `{{SITE_URL}}/agents/docs/data.md` |
| Titles, highlight, annotations | `{{SITE_URL}}/agents/docs/highlighting-and-annotations.md` |
| Brand colours and themes | `{{SITE_URL}}/agents/docs/theming.md` |
| Charts that filter each other | `{{SITE_URL}}/agents/docs/crossfiltering.md` |
| One component | `{{SITE_URL}}/agents/<level>/<name>.md`, where `<level>` is `atoms`, `molecules` or `templates` |

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
