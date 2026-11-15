# Reproduce the "Colour by series, long format" example of the InsightCharts Beeswarm chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Colour by series, long format" example of `beeswarm-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Shows a distribution as one dot per row along a value axis, with dots stacked sideways where they would collide.

Use it when: Showing a distribution while keeping every individual visible: 30 to about 2,000 named things (countries, players, schools), optionally in a few rows by group, with one or two highlighted.

Pick something else when: More than about 2,000 rows or when only the summary matters (use histogram or box-plot); many groups with few rows each (use strip-plot); two numeric measures (use scatter-chart).

Instructions for the alternatives: `scatter-chart` https://insightcharts.dev/agents/atoms/scatter-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `box-plot` https://insightcharts.dev/agents/atoms/box-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/beeswarm-chart
```

The file lands at `components/insightcharts/atoms/beeswarm-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BeeswarmChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "person": "Engineering 1", "team": "Engineering", "level": "Junior", "salary": 112 },
  { "person": "Engineering 2", "team": "Engineering", "level": "Junior", "salary": 109 },
  { "person": "Engineering 3", "team": "Engineering", "level": "Junior", "salary": 114 }
]
```

How the example maps columns to props:

- `value` = `"salary"`. Numeric field that positions each dot along the axis.
- `group` = `"team"`. Field that splits the dots into rows, one swarm per group.
- `series` = `"level"`. Field that colours dots by category. Beyond 6 categories the rest turn grey.
- `label` = `"person"`. Field naming each dot, for tooltips, `highlight` and labels on highlighted dots.

With the user's data, keep the props and change the column names.

## 5. The "Colour by series, long format" example

This example sets `theme="poster"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { person: "Engineering 1", team: "Engineering", level: "Junior", salary: 112 },
  { person: "Engineering 2", team: "Engineering", level: "Junior", salary: 109 },
  { person: "Engineering 3", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 4", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 5", team: "Engineering", level: "Senior", salary: 154 },
  { person: "Engineering 6", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 7", team: "Engineering", level: "Lead", salary: 170 },
  { person: "Engineering 8", team: "Engineering", level: "Junior", salary: 124 },
  { person: "Engineering 9", team: "Engineering", level: "Junior", salary: 117 },
  { person: "Engineering 10", team: "Engineering", level: "Senior", salary: 136 },
  { person: "Engineering 11", team: "Engineering", level: "Junior", salary: 108 },
  { person: "Engineering 12", team: "Engineering", level: "Junior", salary: 113 },
  { person: "Engineering 13", team: "Engineering", level: "Senior", salary: 144 },
  { person: "Engineering 14", team: "Engineering", level: "Senior", salary: 154 },
  { person: "Engineering 15", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 16", team: "Engineering", level: "Junior", salary: 100 },
  { person: "Engineering 17", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 18", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 19", team: "Engineering", level: "Senior", salary: 140 },
  { person: "Engineering 20", team: "Engineering", level: "Senior", salary: 130 },
  { person: "Engineering 21", team: "Engineering", level: "Junior", salary: 126 },
  { person: "Engineering 22", team: "Engineering", level: "Lead", salary: 175 },
  { person: "Engineering 23", team: "Engineering", level: "Junior", salary: 124 },
  { person: "Engineering 24", team: "Engineering", level: "Junior", salary: 105 },
  { person: "Engineering 25", team: "Engineering", level: "Lead", salary: 163 },
  { person: "Engineering 26", team: "Engineering", level: "Junior", salary: 121 },
  { person: "Engineering 27", team: "Engineering", level: "Lead", salary: 162 },
  { person: "Engineering 28", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 29", team: "Engineering", level: "Senior", salary: 131 },
  { person: "Engineering 30", team: "Engineering", level: "Junior", salary: 120 },
  { person: "Engineering 31", team: "Engineering", level: "Senior", salary: 137 },
  { person: "Engineering 32", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 33", team: "Engineering", level: "Senior", salary: 150 },
  { person: "Engineering 34", team: "Engineering", level: "Junior", salary: 123 },
  { person: "Engineering 35", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 36", team: "Engineering", level: "Senior", salary: 144 },
  { person: "Engineering 37", team: "Engineering", level: "Senior", salary: 123 },
  { person: "Engineering 38", team: "Engineering", level: "Junior", salary: 107 },
  { person: "Engineering 39", team: "Engineering", level: "Junior", salary: 116 },
  { person: "Engineering 40", team: "Engineering", level: "Junior", salary: 120 },
  { person: "Engineering 41", team: "Engineering", level: "Senior", salary: 147 },
  { person: "Engineering 42", team: "Engineering", level: "Senior", salary: 136 },
  { person: "Engineering 43", team: "Engineering", level: "Junior", salary: 104 },
  { person: "Engineering 44", team: "Engineering", level: "Junior", salary: 98 },
  { person: "Engineering 45", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 46", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 47", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 48", team: "Engineering", level: "Senior", salary: 149 },
  { person: "Engineering 49", team: "Engineering", level: "Lead", salary: 163 },
  { person: "Engineering 50", team: "Engineering", level: "Senior", salary: 141 },
  { person: "Engineering 51", team: "Engineering", level: "Junior", salary: 111 },
  { person: "Engineering 52", team: "Engineering", level: "Lead", salary: 171 },
  { person: "Engineering 53", team: "Engineering", level: "Lead", salary: 155 },
  { person: "Engineering 54", team: "Engineering", level: "Senior", salary: 138 },
  { person: "Engineering 55", team: "Engineering", level: "Senior", salary: 133 },
  { person: "Engineering 56", team: "Engineering", level: "Lead", salary: 179 },
  { person: "Engineering 57", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 58", team: "Engineering", level: "Junior", salary: 112 },
  { person: "Engineering 59", team: "Engineering", level: "Junior", salary: 113 },
  { person: "Engineering 60", team: "Engineering", level: "Lead", salary: 178 },
  { person: "Engineering 61", team: "Engineering", level: "Junior", salary: 121 },
  { person: "Engineering 62", team: "Engineering", level: "Senior", salary: 123 },
  { person: "Engineering 63", team: "Engineering", level: "Junior", salary: 104 },
  { person: "Engineering 64", team: "Engineering", level: "Lead", salary: 178 },
  { person: "Engineering 65", team: "Engineering", level: "Lead", salary: 181 },
  { person: "Engineering 66", team: "Engineering", level: "Junior", salary: 111 },
  { person: "Engineering 67", team: "Engineering", level: "Junior", salary: 117 },
  { person: "Engineering 68", team: "Engineering", level: "Junior", salary: 116 },
  { person: "Engineering 69", team: "Engineering", level: "Lead", salary: 161 },
  { person: "Engineering 70", team: "Engineering", level: "Junior", salary: 124 },
  { person: "Engineering 71", team: "Engineering", level: "Lead", salary: 176 },
  { person: "Engineering 72", team: "Engineering", level: "Junior", salary: 125 },
  { person: "Engineering 73", team: "Engineering", level: "Junior", salary: 105 },
  { person: "Engineering 74", team: "Engineering", level: "Junior", salary: 121 },
  { person: "Engineering 75", team: "Engineering", level: "Lead", salary: 179 },
  { person: "Engineering 76", team: "Engineering", level: "Junior", salary: 105 },
  { person: "Engineering 77", team: "Engineering", level: "Junior", salary: 107 },
  { person: "Engineering 78", team: "Engineering", level: "Senior", salary: 138 },
  { person: "Engineering 79", team: "Engineering", level: "Senior", salary: 134 },
  { person: "Engineering 80", team: "Engineering", level: "Junior", salary: 87 },
  { person: "Engineering 81", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 82", team: "Engineering", level: "Junior", salary: 120 },
  { person: "Engineering 83", team: "Engineering", level: "Junior", salary: 120 },
  { person: "Engineering 84", team: "Engineering", level: "Junior", salary: 116 },
  { person: "Engineering 85", team: "Engineering", level: "Junior", salary: 110 },
  { person: "Engineering 86", team: "Engineering", level: "Junior", salary: 98 },
  { person: "Engineering 87", team: "Engineering", level: "Junior", salary: 108 },
  { person: "Engineering 88", team: "Engineering", level: "Senior", salary: 139 },
  { person: "Engineering 89", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 90", team: "Engineering", level: "Junior", salary: 125 },
  { person: "Sales 1", team: "Sales", level: "Junior", salary: 65 },
  { person: "Sales 2", team: "Sales", level: "Senior", salary: 84 },
  { person: "Sales 3", team: "Sales", level: "Senior", salary: 86 },
  { person: "Sales 4", team: "Sales", level: "Junior", salary: 73 },
  { person: "Sales 5", team: "Sales", level: "Junior", salary: 76 },
  { person: "Sales 6", team: "Sales", level: "Junior", salary: 87 },
  { person: "Sales 7", team: "Sales", level: "Lead", salary: 148 },
  { person: "Sales 8", team: "Sales", level: "Lead", salary: 141 },
  { person: "Sales 9", team: "Sales", level: "Junior", salary: 81 },
  { person: "Sales 10", team: "Sales", level: "Junior", salary: 75 },
  { person: "Sales 11", team: "Sales", level: "Junior", salary: 68 },
  { person: "Sales 12", team: "Sales", level: "Senior", salary: 89 },
  { person: "Sales 13", team: "Sales", level: "Junior", salary: 77 },
  { person: "Sales 14", team: "Sales", level: "Senior", salary: 90 },
  { person: "Sales 15", team: "Sales", level: "Junior", salary: 74 },
  { person: "Sales 16", team: "Sales", level: "Senior", salary: 87 },
  { person: "Sales 17", team: "Sales", level: "Junior", salary: 88 },
  { person: "Sales 18", team: "Sales", level: "Junior", salary: 90 },
  { person: "Sales 19", team: "Sales", level: "Junior", salary: 84 },
  { person: "Sales 20", team: "Sales", level: "Junior", salary: 81 },
  { person: "Sales 21", team: "Sales", level: "Junior", salary: 66 },
  { person: "Sales 22", team: "Sales", level: "Junior", salary: 88 },
  { person: "Sales 23", team: "Sales", level: "Junior", salary: 82 },
  { person: "Sales 24", team: "Sales", level: "Lead", salary: 143 },
  { person: "Sales 25", team: "Sales", level: "Lead", salary: 135 },
  { person: "Sales 26", team: "Sales", level: "Lead", salary: 140 },
  { person: "Sales 27", team: "Sales", level: "Lead", salary: 120 },
  { person: "Sales 28", team: "Sales", level: "Lead", salary: 136 },
  { person: "Sales 29", team: "Sales", level: "Senior", salary: 117 },
  { person: "Sales 30", team: "Sales", level: "Senior", salary: 105 },
  { person: "Sales 31", team: "Sales", level: "Junior", salary: 67 },
  { person: "Sales 32", team: "Sales", level: "Senior", salary: 98 },
  { person: "Sales 33", team: "Sales", level: "Lead", salary: 123 },
  { person: "Sales 34", team: "Sales", level: "Junior", salary: 82 },
  { person: "Sales 35", team: "Sales", level: "Junior", salary: 86 },
  { person: "Sales 36", team: "Sales", level: "Senior", salary: 126 },
  { person: "Sales 37", team: "Sales", level: "Senior", salary: 106 },
  { person: "Sales 38", team: "Sales", level: "Senior", salary: 92 },
  { person: "Sales 39", team: "Sales", level: "Senior", salary: 100 },
  { person: "Sales 40", team: "Sales", level: "Lead", salary: 147 },
  { person: "Sales 41", team: "Sales", level: "Lead", salary: 141 },
  { person: "Sales 42", team: "Sales", level: "Junior", salary: 75 },
  { person: "Sales 43", team: "Sales", level: "Lead", salary: 133 },
  { person: "Sales 44", team: "Sales", level: "Senior", salary: 100 },
  { person: "Sales 45", team: "Sales", level: "Junior", salary: 82 },
  { person: "Sales 46", team: "Sales", level: "Lead", salary: 137 },
  { person: "Sales 47", team: "Sales", level: "Senior", salary: 111 },
  { person: "Sales 48", team: "Sales", level: "Junior", salary: 84 },
  { person: "Sales 49", team: "Sales", level: "Junior", salary: 76 },
  { person: "Sales 50", team: "Sales", level: "Junior", salary: 74 },
  { person: "Sales 51", team: "Sales", level: "Junior", salary: 75 },
  { person: "Sales 52", team: "Sales", level: "Senior", salary: 108 },
  { person: "Sales 53", team: "Sales", level: "Junior", salary: 76 },
  { person: "Sales 54", team: "Sales", level: "Senior", salary: 109 },
  { person: "Sales 55", team: "Sales", level: "Junior", salary: 91 },
  { person: "Sales 56", team: "Sales", level: "Junior", salary: 70 },
  { person: "Sales 57", team: "Sales", level: "Junior", salary: 81 },
  { person: "Sales 58", team: "Sales", level: "Senior", salary: 106 },
  { person: "Sales 59", team: "Sales", level: "Senior", salary: 103 },
  { person: "Sales 60", team: "Sales", level: "Lead", salary: 138 },
  { person: "Design 1", team: "Design", level: "Junior", salary: 93 },
  { person: "Design 2", team: "Design", level: "Lead", salary: 132 },
  { person: "Design 3", team: "Design", level: "Junior", salary: 98 },
  { person: "Design 4", team: "Design", level: "Senior", salary: 111 },
  { person: "Design 5", team: "Design", level: "Senior", salary: 114 },
  { person: "Design 6", team: "Design", level: "Senior", salary: 107 },
  { person: "Design 7", team: "Design", level: "Lead", salary: 160 },
  { person: "Design 8", team: "Design", level: "Senior", salary: 114 },
  { person: "Design 9", team: "Design", level: "Junior", salary: 70 },
  { person: "Design 10", team: "Design", level: "Junior", salary: 87 },
  { person: "Design 11", team: "Design", level: "Senior", salary: 129 },
  { person: "Design 12", team: "Design", level: "Junior", salary: 77 },
  { person: "Design 13", team: "Design", level: "Junior", salary: 103 },
  { person: "Design 14", team: "Design", level: "Junior", salary: 89 },
  { person: "Design 15", team: "Design", level: "Junior", salary: 83 },
  { person: "Design 16", team: "Design", level: "Junior", salary: 82 },
  { person: "Design 17", team: "Design", level: "Junior", salary: 83 },
  { person: "Design 18", team: "Design", level: "Junior", salary: 97 },
  { person: "Design 19", team: "Design", level: "Junior", salary: 94 },
  { person: "Design 20", team: "Design", level: "Junior", salary: 102 },
  { person: "Design 21", team: "Design", level: "Senior", salary: 127 },
  { person: "Design 22", team: "Design", level: "Junior", salary: 88 },
  { person: "Design 23", team: "Design", level: "Senior", salary: 111 },
  { person: "Design 24", team: "Design", level: "Junior", salary: 90 },
  { person: "Design 25", team: "Design", level: "Lead", salary: 150 },
  { person: "Design 26", team: "Design", level: "Junior", salary: 87 },
  { person: "Design 27", team: "Design", level: "Senior", salary: 115 },
  { person: "Design 28", team: "Design", level: "Lead", salary: 148 },
  { person: "Design 29", team: "Design", level: "Junior", salary: 88 },
  { person: "Design 30", team: "Design", level: "Senior", salary: 119 },
  { person: "Support 1", team: "Support", level: "Junior", salary: 29 },
  { person: "Support 2", team: "Support", level: "Senior", salary: 59 },
  { person: "Support 3", team: "Support", level: "Senior", salary: 61 },
  { person: "Support 4", team: "Support", level: "Senior", salary: 65 },
  { person: "Support 5", team: "Support", level: "Junior", salary: 37 },
  { person: "Support 6", team: "Support", level: "Junior", salary: 34 },
  { person: "Support 7", team: "Support", level: "Junior", salary: 37 },
  { person: "Support 8", team: "Support", level: "Lead", salary: 95 },
  { person: "Support 9", team: "Support", level: "Senior", salary: 69 },
  { person: "Support 10", team: "Support", level: "Senior", salary: 69 },
  { person: "Support 11", team: "Support", level: "Junior", salary: 42 },
  { person: "Support 12", team: "Support", level: "Junior", salary: 54 },
  { person: "Support 13", team: "Support", level: "Junior", salary: 39 },
  { person: "Support 14", team: "Support", level: "Lead", salary: 105 },
  { person: "Support 15", team: "Support", level: "Junior", salary: 47 },
  { person: "Support 16", team: "Support", level: "Lead", salary: 110 },
  { person: "Support 17", team: "Support", level: "Senior", salary: 76 },
  { person: "Support 18", team: "Support", level: "Junior", salary: 38 },
  { person: "Support 19", team: "Support", level: "Junior", salary: 48 },
  { person: "Support 20", team: "Support", level: "Senior", salary: 65 },
  { person: "Support 21", team: "Support", level: "Junior", salary: 44 },
  { person: "Support 22", team: "Support", level: "Junior", salary: 37 },
  { person: "Support 23", team: "Support", level: "Senior", salary: 83 },
  { person: "Support 24", team: "Support", level: "Junior", salary: 48 },
  { person: "Support 25", team: "Support", level: "Junior", salary: 51 },
  { person: "Support 26", team: "Support", level: "Senior", salary: 87 },
  { person: "Support 27", team: "Support", level: "Junior", salary: 41 },
  { person: "Support 28", team: "Support", level: "Senior", salary: 58 },
  { person: "Support 29", team: "Support", level: "Lead", salary: 88 },
  { person: "Support 30", team: "Support", level: "Junior", salary: 44 },
];

<BeeswarmChart
  theme="poster"
  data={data}
  value="salary"
  group="team"
  series="level"
  label="person"
  format="${value}k"
  height={420}
  title="Base salary by team and level"
  subtitle="Thousands of dollars, 210 employees"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "poster",
  "data": [
    { "person": "Engineering 1", "team": "Engineering", "level": "Junior", "salary": 112 },
    { "person": "Engineering 2", "team": "Engineering", "level": "Junior", "salary": 109 },
    { "person": "Engineering 3", "team": "Engineering", "level": "Junior", "salary": 114 },
    { "person": "Engineering 4", "team": "Engineering", "level": "Junior", "salary": 127 },
    { "person": "Engineering 5", "team": "Engineering", "level": "Senior", "salary": 154 },
    { "person": "Engineering 6", "team": "Engineering", "level": "Junior", "salary": 127 },
    { "person": "Engineering 7", "team": "Engineering", "level": "Lead", "salary": 170 },
    { "person": "Engineering 8", "team": "Engineering", "level": "Junior", "salary": 124 },
    { "person": "Engineering 9", "team": "Engineering", "level": "Junior", "salary": 117 },
    { "person": "Engineering 10", "team": "Engineering", "level": "Senior", "salary": 136 },
    { "person": "Engineering 11", "team": "Engineering", "level": "Junior", "salary": 108 },
    { "person": "Engineering 12", "team": "Engineering", "level": "Junior", "salary": 113 },
    { "person": "Engineering 13", "team": "Engineering", "level": "Senior", "salary": 144 },
    { "person": "Engineering 14", "team": "Engineering", "level": "Senior", "salary": 154 },
    { "person": "Engineering 15", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 16", "team": "Engineering", "level": "Junior", "salary": 100 },
    { "person": "Engineering 17", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 18", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 19", "team": "Engineering", "level": "Senior", "salary": 140 },
    { "person": "Engineering 20", "team": "Engineering", "level": "Senior", "salary": 130 },
    { "person": "Engineering 21", "team": "Engineering", "level": "Junior", "salary": 126 },
    { "person": "Engineering 22", "team": "Engineering", "level": "Lead", "salary": 175 },
    { "person": "Engineering 23", "team": "Engineering", "level": "Junior", "salary": 124 },
    { "person": "Engineering 24", "team": "Engineering", "level": "Junior", "salary": 105 },
    { "person": "Engineering 25", "team": "Engineering", "level": "Lead", "salary": 163 },
    { "person": "Engineering 26", "team": "Engineering", "level": "Junior", "salary": 121 },
    { "person": "Engineering 27", "team": "Engineering", "level": "Lead", "salary": 162 },
    { "person": "Engineering 28", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 29", "team": "Engineering", "level": "Senior", "salary": 131 },
    { "person": "Engineering 30", "team": "Engineering", "level": "Junior", "salary": 120 },
    { "person": "Engineering 31", "team": "Engineering", "level": "Senior", "salary": 137 },
    { "person": "Engineering 32", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 33", "team": "Engineering", "level": "Senior", "salary": 150 },
    { "person": "Engineering 34", "team": "Engineering", "level": "Junior", "salary": 123 },
    { "person": "Engineering 35", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 36", "team": "Engineering", "level": "Senior", "salary": 144 },
    { "person": "Engineering 37", "team": "Engineering", "level": "Senior", "salary": 123 },
    { "person": "Engineering 38", "team": "Engineering", "level": "Junior", "salary": 107 },
    { "person": "Engineering 39", "team": "Engineering", "level": "Junior", "salary": 116 },
    { "person": "Engineering 40", "team": "Engineering", "level": "Junior", "salary": 120 },
    { "person": "Engineering 41", "team": "Engineering", "level": "Senior", "salary": 147 },
    { "person": "Engineering 42", "team": "Engineering", "level": "Senior", "salary": 136 },
    { "person": "Engineering 43", "team": "Engineering", "level": "Junior", "salary": 104 },
    { "person": "Engineering 44", "team": "Engineering", "level": "Junior", "salary": 98 },
    { "person": "Engineering 45", "team": "Engineering", "level": "Junior", "salary": 114 },
    { "person": "Engineering 46", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 47", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 48", "team": "Engineering", "level": "Senior", "salary": 149 },
    { "person": "Engineering 49", "team": "Engineering", "level": "Lead", "salary": 163 },
    { "person": "Engineering 50", "team": "Engineering", "level": "Senior", "salary": 141 },
    { "person": "Engineering 51", "team": "Engineering", "level": "Junior", "salary": 111 },
    { "person": "Engineering 52", "team": "Engineering", "level": "Lead", "salary": 171 },
    { "person": "Engineering 53", "team": "Engineering", "level": "Lead", "salary": 155 },
    { "person": "Engineering 54", "team": "Engineering", "level": "Senior", "salary": 138 },
    { "person": "Engineering 55", "team": "Engineering", "level": "Senior", "salary": 133 },
    { "person": "Engineering 56", "team": "Engineering", "level": "Lead", "salary": 179 },
    { "person": "Engineering 57", "team": "Engineering", "level": "Junior", "salary": 127 },
    { "person": "Engineering 58", "team": "Engineering", "level": "Junior", "salary": 112 },
    { "person": "Engineering 59", "team": "Engineering", "level": "Junior", "salary": 113 },
    { "person": "Engineering 60", "team": "Engineering", "level": "Lead", "salary": 178 },
    { "person": "Engineering 61", "team": "Engineering", "level": "Junior", "salary": 121 },
    { "person": "Engineering 62", "team": "Engineering", "level": "Senior", "salary": 123 },
    { "person": "Engineering 63", "team": "Engineering", "level": "Junior", "salary": 104 },
    { "person": "Engineering 64", "team": "Engineering", "level": "Lead", "salary": 178 },
    { "person": "Engineering 65", "team": "Engineering", "level": "Lead", "salary": 181 },
    { "person": "Engineering 66", "team": "Engineering", "level": "Junior", "salary": 111 },
    { "person": "Engineering 67", "team": "Engineering", "level": "Junior", "salary": 117 },
    { "person": "Engineering 68", "team": "Engineering", "level": "Junior", "salary": 116 },
    { "person": "Engineering 69", "team": "Engineering", "level": "Lead", "salary": 161 },
    { "person": "Engineering 70", "team": "Engineering", "level": "Junior", "salary": 124 },
    { "person": "Engineering 71", "team": "Engineering", "level": "Lead", "salary": 176 },
    { "person": "Engineering 72", "team": "Engineering", "level": "Junior", "salary": 125 },
    { "person": "Engineering 73", "team": "Engineering", "level": "Junior", "salary": 105 },
    { "person": "Engineering 74", "team": "Engineering", "level": "Junior", "salary": 121 },
    { "person": "Engineering 75", "team": "Engineering", "level": "Lead", "salary": 179 },
    { "person": "Engineering 76", "team": "Engineering", "level": "Junior", "salary": 105 },
    { "person": "Engineering 77", "team": "Engineering", "level": "Junior", "salary": 107 },
    { "person": "Engineering 78", "team": "Engineering", "level": "Senior", "salary": 138 },
    { "person": "Engineering 79", "team": "Engineering", "level": "Senior", "salary": 134 },
    { "person": "Engineering 80", "team": "Engineering", "level": "Junior", "salary": 87 },
    { "person": "Engineering 81", "team": "Engineering", "level": "Junior", "salary": 114 },
    { "person": "Engineering 82", "team": "Engineering", "level": "Junior", "salary": 120 },
    { "person": "Engineering 83", "team": "Engineering", "level": "Junior", "salary": 120 },
    { "person": "Engineering 84", "team": "Engineering", "level": "Junior", "salary": 116 },
    { "person": "Engineering 85", "team": "Engineering", "level": "Junior", "salary": 110 },
    { "person": "Engineering 86", "team": "Engineering", "level": "Junior", "salary": 98 },
    { "person": "Engineering 87", "team": "Engineering", "level": "Junior", "salary": 108 },
    { "person": "Engineering 88", "team": "Engineering", "level": "Senior", "salary": 139 },
    { "person": "Engineering 89", "team": "Engineering", "level": "Junior", "salary": 114 },
    { "person": "Engineering 90", "team": "Engineering", "level": "Junior", "salary": 125 },
    { "person": "Sales 1", "team": "Sales", "level": "Junior", "salary": 65 },
    { "person": "Sales 2", "team": "Sales", "level": "Senior", "salary": 84 },
    { "person": "Sales 3", "team": "Sales", "level": "Senior", "salary": 86 },
    { "person": "Sales 4", "team": "Sales", "level": "Junior", "salary": 73 },
    { "person": "Sales 5", "team": "Sales", "level": "Junior", "salary": 76 },
    { "person": "Sales 6", "team": "Sales", "level": "Junior", "salary": 87 },
    { "person": "Sales 7", "team": "Sales", "level": "Lead", "salary": 148 },
    { "person": "Sales 8", "team": "Sales", "level": "Lead", "salary": 141 },
    { "person": "Sales 9", "team": "Sales", "level": "Junior", "salary": 81 },
    { "person": "Sales 10", "team": "Sales", "level": "Junior", "salary": 75 },
    { "person": "Sales 11", "team": "Sales", "level": "Junior", "salary": 68 },
    { "person": "Sales 12", "team": "Sales", "level": "Senior", "salary": 89 },
    { "person": "Sales 13", "team": "Sales", "level": "Junior", "salary": 77 },
    { "person": "Sales 14", "team": "Sales", "level": "Senior", "salary": 90 },
    { "person": "Sales 15", "team": "Sales", "level": "Junior", "salary": 74 },
    { "person": "Sales 16", "team": "Sales", "level": "Senior", "salary": 87 },
    { "person": "Sales 17", "team": "Sales", "level": "Junior", "salary": 88 },
    { "person": "Sales 18", "team": "Sales", "level": "Junior", "salary": 90 },
    { "person": "Sales 19", "team": "Sales", "level": "Junior", "salary": 84 },
    { "person": "Sales 20", "team": "Sales", "level": "Junior", "salary": 81 },
    { "person": "Sales 21", "team": "Sales", "level": "Junior", "salary": 66 },
    { "person": "Sales 22", "team": "Sales", "level": "Junior", "salary": 88 },
    { "person": "Sales 23", "team": "Sales", "level": "Junior", "salary": 82 },
    { "person": "Sales 24", "team": "Sales", "level": "Lead", "salary": 143 },
    { "person": "Sales 25", "team": "Sales", "level": "Lead", "salary": 135 },
    { "person": "Sales 26", "team": "Sales", "level": "Lead", "salary": 140 },
    { "person": "Sales 27", "team": "Sales", "level": "Lead", "salary": 120 },
    { "person": "Sales 28", "team": "Sales", "level": "Lead", "salary": 136 },
    { "person": "Sales 29", "team": "Sales", "level": "Senior", "salary": 117 },
    { "person": "Sales 30", "team": "Sales", "level": "Senior", "salary": 105 },
    { "person": "Sales 31", "team": "Sales", "level": "Junior", "salary": 67 },
    { "person": "Sales 32", "team": "Sales", "level": "Senior", "salary": 98 },
    { "person": "Sales 33", "team": "Sales", "level": "Lead", "salary": 123 },
    { "person": "Sales 34", "team": "Sales", "level": "Junior", "salary": 82 },
    { "person": "Sales 35", "team": "Sales", "level": "Junior", "salary": 86 },
    { "person": "Sales 36", "team": "Sales", "level": "Senior", "salary": 126 },
    { "person": "Sales 37", "team": "Sales", "level": "Senior", "salary": 106 },
    { "person": "Sales 38", "team": "Sales", "level": "Senior", "salary": 92 },
    { "person": "Sales 39", "team": "Sales", "level": "Senior", "salary": 100 },
    { "person": "Sales 40", "team": "Sales", "level": "Lead", "salary": 147 },
    { "person": "Sales 41", "team": "Sales", "level": "Lead", "salary": 141 },
    { "person": "Sales 42", "team": "Sales", "level": "Junior", "salary": 75 },
    { "person": "Sales 43", "team": "Sales", "level": "Lead", "salary": 133 },
    { "person": "Sales 44", "team": "Sales", "level": "Senior", "salary": 100 },
    { "person": "Sales 45", "team": "Sales", "level": "Junior", "salary": 82 },
    { "person": "Sales 46", "team": "Sales", "level": "Lead", "salary": 137 },
    { "person": "Sales 47", "team": "Sales", "level": "Senior", "salary": 111 },
    { "person": "Sales 48", "team": "Sales", "level": "Junior", "salary": 84 },
    { "person": "Sales 49", "team": "Sales", "level": "Junior", "salary": 76 },
    { "person": "Sales 50", "team": "Sales", "level": "Junior", "salary": 74 },
    { "person": "Sales 51", "team": "Sales", "level": "Junior", "salary": 75 },
    { "person": "Sales 52", "team": "Sales", "level": "Senior", "salary": 108 },
    { "person": "Sales 53", "team": "Sales", "level": "Junior", "salary": 76 },
    { "person": "Sales 54", "team": "Sales", "level": "Senior", "salary": 109 },
    { "person": "Sales 55", "team": "Sales", "level": "Junior", "salary": 91 },
    { "person": "Sales 56", "team": "Sales", "level": "Junior", "salary": 70 },
    { "person": "Sales 57", "team": "Sales", "level": "Junior", "salary": 81 },
    { "person": "Sales 58", "team": "Sales", "level": "Senior", "salary": 106 },
    { "person": "Sales 59", "team": "Sales", "level": "Senior", "salary": 103 },
    { "person": "Sales 60", "team": "Sales", "level": "Lead", "salary": 138 },
    { "person": "Design 1", "team": "Design", "level": "Junior", "salary": 93 },
    { "person": "Design 2", "team": "Design", "level": "Lead", "salary": 132 },
    { "person": "Design 3", "team": "Design", "level": "Junior", "salary": 98 },
    { "person": "Design 4", "team": "Design", "level": "Senior", "salary": 111 },
    { "person": "Design 5", "team": "Design", "level": "Senior", "salary": 114 },
    { "person": "Design 6", "team": "Design", "level": "Senior", "salary": 107 },
    { "person": "Design 7", "team": "Design", "level": "Lead", "salary": 160 },
    { "person": "Design 8", "team": "Design", "level": "Senior", "salary": 114 },
    { "person": "Design 9", "team": "Design", "level": "Junior", "salary": 70 },
    { "person": "Design 10", "team": "Design", "level": "Junior", "salary": 87 },
    { "person": "Design 11", "team": "Design", "level": "Senior", "salary": 129 },
    { "person": "Design 12", "team": "Design", "level": "Junior", "salary": 77 },
    { "person": "Design 13", "team": "Design", "level": "Junior", "salary": 103 },
    { "person": "Design 14", "team": "Design", "level": "Junior", "salary": 89 },
    { "person": "Design 15", "team": "Design", "level": "Junior", "salary": 83 },
    { "person": "Design 16", "team": "Design", "level": "Junior", "salary": 82 },
    { "person": "Design 17", "team": "Design", "level": "Junior", "salary": 83 },
    { "person": "Design 18", "team": "Design", "level": "Junior", "salary": 97 },
    { "person": "Design 19", "team": "Design", "level": "Junior", "salary": 94 },
    { "person": "Design 20", "team": "Design", "level": "Junior", "salary": 102 },
    { "person": "Design 21", "team": "Design", "level": "Senior", "salary": 127 },
    { "person": "Design 22", "team": "Design", "level": "Junior", "salary": 88 },
    { "person": "Design 23", "team": "Design", "level": "Senior", "salary": 111 },
    { "person": "Design 24", "team": "Design", "level": "Junior", "salary": 90 },
    { "person": "Design 25", "team": "Design", "level": "Lead", "salary": 150 },
    { "person": "Design 26", "team": "Design", "level": "Junior", "salary": 87 },
    { "person": "Design 27", "team": "Design", "level": "Senior", "salary": 115 },
    { "person": "Design 28", "team": "Design", "level": "Lead", "salary": 148 },
    { "person": "Design 29", "team": "Design", "level": "Junior", "salary": 88 },
    { "person": "Design 30", "team": "Design", "level": "Senior", "salary": 119 },
    { "person": "Support 1", "team": "Support", "level": "Junior", "salary": 29 },
    { "person": "Support 2", "team": "Support", "level": "Senior", "salary": 59 },
    { "person": "Support 3", "team": "Support", "level": "Senior", "salary": 61 },
    { "person": "Support 4", "team": "Support", "level": "Senior", "salary": 65 },
    { "person": "Support 5", "team": "Support", "level": "Junior", "salary": 37 },
    { "person": "Support 6", "team": "Support", "level": "Junior", "salary": 34 },
    { "person": "Support 7", "team": "Support", "level": "Junior", "salary": 37 },
    { "person": "Support 8", "team": "Support", "level": "Lead", "salary": 95 },
    { "person": "Support 9", "team": "Support", "level": "Senior", "salary": 69 },
    { "person": "Support 10", "team": "Support", "level": "Senior", "salary": 69 },
    { "person": "Support 11", "team": "Support", "level": "Junior", "salary": 42 },
    { "person": "Support 12", "team": "Support", "level": "Junior", "salary": 54 },
    { "person": "Support 13", "team": "Support", "level": "Junior", "salary": 39 },
    { "person": "Support 14", "team": "Support", "level": "Lead", "salary": 105 },
    { "person": "Support 15", "team": "Support", "level": "Junior", "salary": 47 },
    { "person": "Support 16", "team": "Support", "level": "Lead", "salary": 110 },
    { "person": "Support 17", "team": "Support", "level": "Senior", "salary": 76 },
    { "person": "Support 18", "team": "Support", "level": "Junior", "salary": 38 },
    { "person": "Support 19", "team": "Support", "level": "Junior", "salary": 48 },
    { "person": "Support 20", "team": "Support", "level": "Senior", "salary": 65 },
    { "person": "Support 21", "team": "Support", "level": "Junior", "salary": 44 },
    { "person": "Support 22", "team": "Support", "level": "Junior", "salary": 37 },
    { "person": "Support 23", "team": "Support", "level": "Senior", "salary": 83 },
    { "person": "Support 24", "team": "Support", "level": "Junior", "salary": 48 },
    { "person": "Support 25", "team": "Support", "level": "Junior", "salary": 51 },
    { "person": "Support 26", "team": "Support", "level": "Senior", "salary": 87 },
    { "person": "Support 27", "team": "Support", "level": "Junior", "salary": 41 },
    { "person": "Support 28", "team": "Support", "level": "Senior", "salary": 58 },
    { "person": "Support 29", "team": "Support", "level": "Lead", "salary": 88 },
    { "person": "Support 30", "team": "Support", "level": "Junior", "salary": 44 }
  ],
  "value": "salary",
  "group": "team",
  "series": "level",
  "label": "person",
  "format": "${value}k",
  "height": 420,
  "title": "Base salary by team and level",
  "subtitle": "Thousands of dollars, 210 employees",
  "note": "Illustrative data",
  "type": "beeswarm-chart"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field that positions each dot along the axis. |
| `group` | `string` |  | Field that splits the dots into rows, one swarm per group. |
| `series` | `string` |  | Field that colours dots by category. Beyond 6 categories the rest turn grey. |
| `label` | `string` |  | Field naming each dot, for tooltips, `highlight` and labels on highlighted dots. |
| `radius` | `number` |  | Dot radius in px. Default 5 down to 3 by row count; shrinks if a swarm would overflow its row. |
| `median` | `boolean` | `false` | Mark each row's median with a vertical tick. |
| `names` | `Record<string, string>` |  | Display names for series keys. |

Every chart also accepts these common props:

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` | A pipeline of transforms applied before drawing. |
| `title` | `string` | The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. |
| `subtitle` | `string` | Measure, unit, population, period. |
| `source` | `string` | Data source, shown as "Source: ...". |
| `note` | `string` | Method notes or caveats. |
| `height` | `number \| string` | CSS height of the plot. Default 360. |
| `aspect` | `number` | Width / height. Overrides `height`. |
| `highlight` | `string \| string[]` | The entity (or entities) the title is about. Every other series is drawn in grey. |
| `annotations` | `Annotation[]` | Reference lines, shaded bands and callouts, in data coordinates. |
| `format` | `FormatSpec` | How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. |
| `legend` | `boolean` | Show the legend. Default: shown when there are two or more series. |
| `select` | `boolean \| string` | Make marks clickable to filter. Inside `<InsightData>` the selection filters every other chart. Pass a field name, or `true` to use the chart's category field. |
| `onSelect` | `(values: string[], field: string) => void` | Called with the selected values whenever the selection changes. |
| `option` | `EChartsOption \| ((option: EChartsOption, ctx: BuildContext) => EChartsOption)` | Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. |
| `theme` | `ThemeInput` | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...), or a theme object. A named theme paints its own background behind the chart. |
| `frame` | `boolean` | Paint the theme's background behind the chart. Default: on for a named theme with its own surface. |
| `mode` | `ModeInput` | `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. |
| `renderer` | `RendererInput` | `"auto"` (default) uses SVG for light charts and canvas for heavy ones. |
| `animate` | `boolean` | Set false to disable animation for this chart. Reduced-motion preferences are always respected. |
| `lazy` | `boolean` | Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`). |
| `group` | `string` | Link tooltips with other charts sharing this group id. |
| `exportable` | `boolean \| ExportFormat[]` | Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. |
| `table` | `boolean` | Show a collapsible "View data" table under the chart. |
| `alt` | `string` | Accessible description: the chart type and measures, then the main pattern and the notable values. |
| `id` | `string` | Stable id for this chart's selection in the shared store. |
| `onEvents` | `Record<string, ChartEventHandler>` | ECharts event handlers: `{ click: (params, chart) => {} }`. |
| `onReady` | `(chart: EChartsInstance) => void` | Called with the ECharts instance once it is initialised. |
| `className` | `string` | Class on the figure element. |
| `style` | `CSSProperties` | Inline style on the figure element. |

## Composition

- Built from: nothing. It is a primitive.
- Used by: no molecule or template yet.

## Rules for this form

- Name the measure and its unit in `subtitle`.
- State how many observations the chart draws when the number is small.
- Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.
- Use at most three `annotations`. Their values must match values in the data.
- No dual axes and no 3D. The chart must read without hovering.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The chart is exposed as an image (`role="img"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.
- Set `table` to add a collapsible "View data" table under the chart, for readers who need exact values or use a screen reader.
- The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] One entity is highlighted and the others are grey, or the chart has one series.
- [ ] The chart can be read without hovering.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/beeswarm-chart.md
- Component reference with every example: https://insightcharts.dev/llms/beeswarm-chart.md
- Registry item: https://insightcharts.dev/r/beeswarm-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/beeswarm-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/beeswarm-chart#example-colour-by-series-long-format
- These instructions as plain text: https://insightcharts.dev/agents/atoms/beeswarm-chart/colour-by-series-long-format.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
