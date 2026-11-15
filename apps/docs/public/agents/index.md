# Build charts, data stories and infographics with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: Choose the right InsightCharts component for the user's data, install the library and build a finished figure in the user's React project.

## What InsightCharts is

InsightCharts is an open-source React library of charts, figures, page layouts and infographic posters built on Apache ECharts 6. Every component takes data, field names and a title, and can be written as JSX or as a JSON spec.

## When to use it

Use it when the user has data and wants any of these in a React project:

- a chart, a single statistic or an annotated figure
- a row of key numbers or a dashboard of linked charts
- a one-page brief, a report or a scroll-driven article
- an infographic poster or a card for social media
- a chart that a model or an API describes as JSON

Do not use it outside React. Do not use it for dual-axis charts, gauges, 3D charts or pies with more than five slices. The library does not draw them.

If the user has not given you the data and the point the figure should make, ask for both before you write code.

## The levels

The library has 100 components in three levels.

- **Atoms** (61): one chart form or one figure primitive. Examples: `bar-chart`, `line-chart`, `big-number`.
- **Molecules** (19): a few atoms combined to make one point. Examples: `stat-row`, `chart-callout`, `linked-charts`.
- **Templates** (20): a whole page that takes its content as props. 10 are report-style layouts. 10 are the Infographics set.
- **Infographics**: the templates that draw one designed poster on a painted background. They are built on the `poster` molecule from 19 poster primitives.

## Choose the smallest thing that does the job

| The user wants | Use |
|---|---|
| One number with its context | `big-number` |
| A ranking or a comparison of categories | `bar-chart` |
| A change over time with five or more points | `line-chart` |
| Two to five key numbers in a row | `stat-row` |
| Three to eight metrics with their history | `kpi-grid` |
| A chart with its meaning stated beside it | `chart-callout` |
| Two to four charts that filter each other | `linked-charts` |
| A one-minute page for a decision-maker | `executive-brief` |
| A report whose reasoning will be checked | `report-page` |
| A long article with several charts and text | `visual-essay` |
| A page the reader filters after the main finding | `data-explorer` |
| A weekly or monthly set of numbers | `scorecard` |
| One fact at a social media size | `social-card` |
| A poster of a large count in 2 to 6 groups | `count-poster` |
| Another poster subject | one of the other infographic templates, or the `poster` molecule with panels |

Choose a poster when the piece is one image with little text that is shared as a picture. Choose a report-style template when the reader needs paragraphs, a method note or charts with axes. Check whether a molecule or a template covers the job before you lay out atoms by hand.

Each component has a `whenToUse` and an `avoid` line. `avoid` names the component to use instead. Read both before you commit to a form. The decision table for one level is at `https://insightcharts.dev/agents/atoms.md`, `https://insightcharts.dev/agents/molecules.md`, `https://insightcharts.dev/agents/templates.md` and `https://insightcharts.dev/agents/infographics.md`.

Use only component names and props that the reference lists. Do not invent any.

## Install

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

## Get the full reference

- Index of every guide and component: `https://insightcharts.dev/llms.txt`
- Everything in one file: `https://insightcharts.dev/llms-full.txt`
- Instructions for one component: `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`, for example `https://insightcharts.dev/agents/atoms/bar-chart.md`
- JSON Schema for a spec: `https://insightcharts.dev/schema/insight-spec.json`
- Registry catalogue: `https://insightcharts.dev/r/registry.json`
- Agent skill for Claude Code: `npx shadcn@latest add @insightcharts/agent-skill`
- Agent skill with the skills CLI: `npx skills add insightcharts/insightcharts`

## Work in this order

1. **Understand the data and the fact.** Read the rows. Write down the one fact the figure should show, with its number and its period. Compute the number from the rows. If you do not know what the user wants to show, ask.
2. **Choose the form.** Use the table above, then the component's `whenToUse` and `avoid`. Fetch the component's instructions before you write its props.
3. **Load the data.** Pass `data` as row objects, CSV text, a URL, `{ url, path }` or an async function. Name fields as strings: `x`, `y`, `series`. Reshape with `transform`, a JSON list of steps such as `filter`, `aggregate`, `sort` and `top`. Print numbers with `format`: `"compact"`, `"percent"` for ratios, `"percent-raw"` for whole percentages, `"currency:USD"`, or a template such as `"{value} kg"`.
4. **Write the text.** `title` states the fact from step 1. `subtitle` names the measure, the unit, the population and the period. `source` names where the data comes from. `note` holds caveats.
5. **Highlight and annotate.** Set `highlight` to the entity the title is about. The other series are drawn in grey. Add `annotations` for a date, a threshold or a single value.
6. **Theme.** With no configuration the charts follow the page, including dark mode. To restyle, set `--ic-*` CSS variables, or pass `theme` a name. The preset names are `insight`, `shadcn`, `editorial`, `ledger`, `mono`, `earth`, `science`, `poster`. The poster theme names are `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`.
7. **Verify in a browser.** Run the typecheck. Open the page at desktop width, at about 380px wide and in dark mode. Check that no label is clipped or overlapping and that the title matches the data.

## Rules that matter most

- The title states one plain fact with its number and its period, in one clause: "Monthly churn fell from 4.2% to 2.1% in 2024". A plain label is acceptable when there is no single fact: "Monthly churn, 2024".
- Take every number from the data. Do not state a cause or an event that the data does not show.
- No metaphors, dramatic verbs, rhetorical questions or teasing in any title, subtitle, callout or annotation label.
- Always set `source`. Say so in `note` when data is illustrative.
- Bars start at zero. The library enforces this. Do not override it through `option`.
- No dual axes and no 3D.
- Label directly. Do not add a legend where the series are already labelled.
- Colour comes from the theme. Do not set a colour per series. Use `highlight`.
- Use at most three annotations.
- A big number needs a comparison, a denominator or a period.
- The chart must be readable without hovering.

## Minimal example

```tsx
import { BarChart } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
];

export function Renewables() {
  return (
    <BarChart
      data={data}
      x="country"
      y="share"
      format="{value}%"
      highlight="Norway"
      title="Renewables supplied 98% of Norway's electricity in 2023"
      subtitle="Share of electricity generation from renewables, 2023"
      source="Ember"
    />
  );
}
```

The same chart as a spec, for when the chart is chosen at runtime:

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "bar-chart", data, x: "country", y: "share", format: "{value}%", highlight: "Norway", title: "Renewables supplied 98% of Norway's electricity in 2023", source: "Ember" }} />
```

In Next.js a chart can be imported into a server component when every prop is serialisable. Put the chart in a file that starts with `"use client"` when it takes a function prop such as `onSelect`.

## Before you finish

Tell the user which component you chose and why, the fact the title states, and anything in the data that did not support what they asked for.

## Reference

- This page: https://insightcharts.dev
- These instructions as plain text: https://insightcharts.dev/agents/index.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
