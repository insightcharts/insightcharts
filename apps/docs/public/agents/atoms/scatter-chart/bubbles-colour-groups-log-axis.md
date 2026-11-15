# Reproduce the "Bubbles, colour groups, log axis" example of the InsightCharts Scatter chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Bubbles, colour groups, log axis" example of `scatter-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Plots two numeric measures against each other, one dot per row, with optional bubble size, group colour, selective labels and a trend line.

Use it when: Showing whether and how two measures move together, spotting clusters and outliers, and placing named entities in a two-dimensional space (with quadrant lines via `annotations`).

Pick something else when: A measure over time (use line-chart); one numeric measure by category (use beeswarm-chart or strip-plot); fewer than about 8 points (use bar-chart or a table); more than 4 colour groups (facet with small-multiples).

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scatter-chart
```

The file lands at `components/insightcharts/atoms/scatter-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ScatterChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "Africa 1", "region": "Africa", "gdp": 2494, "life": 61.3, "pop": 24.6 },
  { "country": "Africa 2", "region": "Africa", "gdp": 1050, "life": 58.4, "pop": 61.2 },
  { "country": "Africa 3", "region": "Africa", "gdp": 3104, "life": 60.2, "pop": 6 }
]
```

How the example maps columns to props:

- `x` = `"gdp"`. Numeric field on the horizontal axis.
- `y` = `"life"`. Numeric field on the vertical axis.
- `size` = `"pop"`. Numeric field for bubble size; area is proportional to the value.
- `series` = `"region"`. Field that colours points by group. Beyond 4 groups the smallest fold into a grey Other.
- `label` = `"country"`. Field naming each point, for tooltips, direct labels and `highlight`.

With the user's data, keep the props and change the column names.

## 5. The "Bubbles, colour groups, log axis" example

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { ScatterChart } from "insightcharts";

const data = [
  { country: "Africa 1", region: "Africa", gdp: 2494, life: 61.3, pop: 24.6 },
  { country: "Africa 2", region: "Africa", gdp: 1050, life: 58.4, pop: 61.2 },
  { country: "Africa 3", region: "Africa", gdp: 3104, life: 60.2, pop: 6 },
  { country: "Africa 4", region: "Africa", gdp: 1841, life: 61.4, pop: 1439.1 },
  { country: "Africa 5", region: "Africa", gdp: 3381, life: 65.6, pop: 4.9 },
  { country: "Africa 6", region: "Africa", gdp: 1226, life: 64.3, pop: 136.3 },
  { country: "Africa 7", region: "Africa", gdp: 1115, life: 63.8, pop: 38.6 },
  { country: "Africa 8", region: "Africa", gdp: 4996, life: 66.4, pop: 12 },
  { country: "Africa 9", region: "Africa", gdp: 4949, life: 66.2, pop: 12.6 },
  { country: "Africa 10", region: "Africa", gdp: 1020, life: 58.2, pop: 51 },
  { country: "Africa 11", region: "Africa", gdp: 1468, life: 62.2, pop: 136.4 },
  { country: "Africa 12", region: "Africa", gdp: 2861, life: 62.2, pop: 3 },
  { country: "Africa 13", region: "Africa", gdp: 6183, life: 68.4, pop: 44.2 },
  { country: "Africa 14", region: "Africa", gdp: 7940, life: 66.2, pop: 123.9 },
  { country: "Africa 15", region: "Africa", gdp: 6172, life: 70.1, pop: 173.1 },
  { country: "Africa 16", region: "Africa", gdp: 3340, life: 64.3, pop: 10.6 },
  { country: "Africa 17", region: "Africa", gdp: 701, life: 62.4, pop: 28.8 },
  { country: "Africa 18", region: "Africa", gdp: 623, life: 57.8, pop: 28.1 },
  { country: "Africa 19", region: "Africa", gdp: 2364, life: 63.5, pop: 155.8 },
  { country: "Africa 20", region: "Africa", gdp: 840, life: 58.9, pop: 33.9 },
  { country: "Africa 21", region: "Africa", gdp: 7481, life: 69.6, pop: 43.1 },
  { country: "Africa 22", region: "Africa", gdp: 844, life: 62.1, pop: 194.5 },
  { country: "Africa 23", region: "Africa", gdp: 981, life: 58.6, pop: 6.3 },
  { country: "Africa 24", region: "Africa", gdp: 5497, life: 64.4, pop: 191.2 },
  { country: "Africa 25", region: "Africa", gdp: 2049, life: 56.7, pop: 6.9 },
  { country: "Africa 26", region: "Africa", gdp: 2977, life: 65.8, pop: 28.5 },
  { country: "Asia 1", region: "Asia", gdp: 3791, life: 69.7, pop: 17.1 },
  { country: "Asia 2", region: "Asia", gdp: 13471, life: 74.7, pop: 2.8 },
  { country: "Asia 3", region: "Asia", gdp: 11536, life: 80.4, pop: 5.4 },
  { country: "Asia 4", region: "Asia", gdp: 4109, life: 67.3, pop: 96.4 },
  { country: "Asia 5", region: "Asia", gdp: 6416, life: 67.5, pop: 82.6 },
  { country: "Asia 6", region: "Asia", gdp: 4323, life: 68.2, pop: 75 },
  { country: "Asia 7", region: "Asia", gdp: 8874, life: 75.1, pop: 74.5 },
  { country: "Asia 8", region: "Asia", gdp: 5399, life: 71, pop: 12.2 },
  { country: "Asia 9", region: "Asia", gdp: 13540, life: 77, pop: 28 },
  { country: "Asia 10", region: "Asia", gdp: 5799, life: 70.5, pop: 120.2 },
  { country: "Asia 11", region: "Asia", gdp: 23901, life: 72.3, pop: 17 },
  { country: "Asia 12", region: "Asia", gdp: 25900, life: 75.5, pop: 5.1 },
  { country: "Asia 13", region: "Asia", gdp: 3609, life: 71.5, pop: 13.5 },
  { country: "Asia 14", region: "Asia", gdp: 15229, life: 74.7, pop: 170.9 },
  { country: "Asia 15", region: "Asia", gdp: 8561, life: 72.7, pop: 144.5 },
  { country: "Asia 16", region: "Asia", gdp: 16769, life: 76.4, pop: 181.8 },
  { country: "Asia 17", region: "Asia", gdp: 4885, life: 70.1, pop: 69.9 },
  { country: "Asia 18", region: "Asia", gdp: 7574, life: 69.6, pop: 8.3 },
  { country: "Asia 19", region: "Asia", gdp: 2140, life: 67.2, pop: 19.1 },
  { country: "Asia 20", region: "Asia", gdp: 3541, life: 74.2, pop: 4.9 },
  { country: "Asia 21", region: "Asia", gdp: 8220, life: 70.4, pop: 134.6 },
  { country: "Asia 22", region: "Asia", gdp: 2044, life: 66.3, pop: 21.7 },
  { country: "Asia 23", region: "Asia", gdp: 4094, life: 67.8, pop: 134.3 },
  { country: "Asia 24", region: "Asia", gdp: 26932, life: 77.4, pop: 67.6 },
  { country: "Asia 25", region: "Asia", gdp: 12153, life: 73.5, pop: 33.1 },
  { country: "Asia 26", region: "Asia", gdp: 10474, life: 77.2, pop: 17.7 },
  { country: "Europe 1", region: "Europe", gdp: 199369, life: 86.5, pop: 79.3 },
  { country: "Europe 2", region: "Europe", gdp: 26942, life: 81.6, pop: 20.8 },
  { country: "Europe 3", region: "Europe", gdp: 14447, life: 77.1, pop: 9.5 },
  { country: "Europe 4", region: "Europe", gdp: 56337, life: 82.5, pop: 459.9 },
  { country: "Europe 5", region: "Europe", gdp: 22970, life: 75.9, pop: 10.3 },
  { country: "Europe 6", region: "Europe", gdp: 41245, life: 78.5, pop: 7.8 },
  { country: "Europe 7", region: "Europe", gdp: 72420, life: 80.7, pop: 75.9 },
  { country: "Europe 8", region: "Europe", gdp: 30838, life: 80, pop: 6.1 },
  { country: "Europe 9", region: "Europe", gdp: 147021, life: 86.6, pop: 141.3 },
  { country: "Europe 10", region: "Europe", gdp: 14541, life: 78.8, pop: 24.2 },
  { country: "Europe 11", region: "Europe", gdp: 24702, life: 81.2, pop: 3.4 },
  { country: "Europe 12", region: "Europe", gdp: 16057, life: 78.1, pop: 8.3 },
  { country: "Europe 13", region: "Europe", gdp: 28836, life: 80.2, pop: 92.2 },
  { country: "Europe 14", region: "Europe", gdp: 39594, life: 83.4, pop: 40.9 },
  { country: "Europe 15", region: "Europe", gdp: 20189, life: 76.6, pop: 45.1 },
  { country: "Europe 16", region: "Europe", gdp: 32754, life: 77.8, pop: 48.2 },
  { country: "Europe 17", region: "Europe", gdp: 26059, life: 79.1, pop: 24.4 },
  { country: "Europe 18", region: "Europe", gdp: 16739, life: 80.6, pop: 28.3 },
  { country: "Europe 19", region: "Europe", gdp: 18987, life: 81, pop: 15.7 },
  { country: "Europe 20", region: "Europe", gdp: 20580, life: 77.4, pop: 10 },
  { country: "Europe 21", region: "Europe", gdp: 213781, life: 83.6, pop: 6.7 },
  { country: "Europe 22", region: "Europe", gdp: 36229, life: 85.2, pop: 26 },
  { country: "Europe 23", region: "Europe", gdp: 79037, life: 84.8, pop: 3 },
  { country: "Europe 24", region: "Europe", gdp: 34695, life: 82, pop: 20.7 },
  { country: "Europe 25", region: "Europe", gdp: 20643, life: 81.1, pop: 9.1 },
  { country: "Europe 26", region: "Europe", gdp: 22849, life: 80.3, pop: 40.3 },
  { country: "Americas 1", region: "Americas", gdp: 8729, life: 72.8, pop: 90.3 },
  { country: "Americas 2", region: "Americas", gdp: 4136, life: 67.1, pop: 67.6 },
  { country: "Americas 3", region: "Americas", gdp: 5736, life: 71, pop: 71 },
  { country: "Americas 4", region: "Americas", gdp: 29991, life: 76.7, pop: 309.6 },
  { country: "Americas 5", region: "Americas", gdp: 12420, life: 77.7, pop: 132.2 },
  { country: "Americas 6", region: "Americas", gdp: 12542, life: 76.8, pop: 8.2 },
  { country: "Americas 7", region: "Americas", gdp: 10050, life: 72.4, pop: 10.6 },
  { country: "Americas 8", region: "Americas", gdp: 10984, life: 79.7, pop: 4.9 },
  { country: "Americas 9", region: "Americas", gdp: 11827, life: 75.2, pop: 2.6 },
  { country: "Americas 10", region: "Americas", gdp: 1578, life: 62.4, pop: 13.6 },
  { country: "Americas 11", region: "Americas", gdp: 10276, life: 73.5, pop: 71.4 },
  { country: "Americas 12", region: "Americas", gdp: 11760, life: 73.5, pop: 7.4 },
  { country: "Americas 13", region: "Americas", gdp: 10088, life: 74.8, pop: 5.1 },
  { country: "Americas 14", region: "Americas", gdp: 21821, life: 79.6, pop: 122.3 },
  { country: "Americas 15", region: "Americas", gdp: 11083, life: 79.8, pop: 5.9 },
  { country: "Americas 16", region: "Americas", gdp: 8089, life: 75.3, pop: 18.5 },
  { country: "Americas 17", region: "Americas", gdp: 26092, life: 78.2, pop: 16.2 },
  { country: "Americas 18", region: "Americas", gdp: 23401, life: 78.3, pop: 110.6 },
  { country: "Americas 19", region: "Americas", gdp: 10469, life: 81.6, pop: 10.8 },
  { country: "Americas 20", region: "Americas", gdp: 23390, life: 81.9, pop: 52.5 },
  { country: "Americas 21", region: "Americas", gdp: 7546, life: 74.1, pop: 11.2 },
  { country: "Americas 22", region: "Americas", gdp: 41475, life: 77.4, pop: 7.2 },
  { country: "Americas 23", region: "Americas", gdp: 8128, life: 72.2, pop: 2.7 },
  { country: "Americas 24", region: "Americas", gdp: 4693, life: 72.3, pop: 14.6 },
  { country: "Americas 25", region: "Americas", gdp: 10174, life: 75.8, pop: 73.5 },
  { country: "Americas 26", region: "Americas", gdp: 3350, life: 75, pop: 25.3 },
];

<ScatterChart
  theme="science"
  data={data}
  x="gdp"
  y="life"
  size="pop"
  series="region"
  label="country"
  logX
  xFormat="currency:USD"
  xLabel="GDP per person"
  yLabel="Life expectancy, years"
  title="GDP per person and life expectancy, 104 countries"
  subtitle="GDP per person (US$, log scale) against life expectancy. Bubble area is population."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "science",
  "data": [
    { "country": "Africa 1", "region": "Africa", "gdp": 2494, "life": 61.3, "pop": 24.6 },
    { "country": "Africa 2", "region": "Africa", "gdp": 1050, "life": 58.4, "pop": 61.2 },
    { "country": "Africa 3", "region": "Africa", "gdp": 3104, "life": 60.2, "pop": 6 },
    { "country": "Africa 4", "region": "Africa", "gdp": 1841, "life": 61.4, "pop": 1439.1 },
    { "country": "Africa 5", "region": "Africa", "gdp": 3381, "life": 65.6, "pop": 4.9 },
    { "country": "Africa 6", "region": "Africa", "gdp": 1226, "life": 64.3, "pop": 136.3 },
    { "country": "Africa 7", "region": "Africa", "gdp": 1115, "life": 63.8, "pop": 38.6 },
    { "country": "Africa 8", "region": "Africa", "gdp": 4996, "life": 66.4, "pop": 12 },
    { "country": "Africa 9", "region": "Africa", "gdp": 4949, "life": 66.2, "pop": 12.6 },
    { "country": "Africa 10", "region": "Africa", "gdp": 1020, "life": 58.2, "pop": 51 },
    { "country": "Africa 11", "region": "Africa", "gdp": 1468, "life": 62.2, "pop": 136.4 },
    { "country": "Africa 12", "region": "Africa", "gdp": 2861, "life": 62.2, "pop": 3 },
    { "country": "Africa 13", "region": "Africa", "gdp": 6183, "life": 68.4, "pop": 44.2 },
    { "country": "Africa 14", "region": "Africa", "gdp": 7940, "life": 66.2, "pop": 123.9 },
    { "country": "Africa 15", "region": "Africa", "gdp": 6172, "life": 70.1, "pop": 173.1 },
    { "country": "Africa 16", "region": "Africa", "gdp": 3340, "life": 64.3, "pop": 10.6 },
    { "country": "Africa 17", "region": "Africa", "gdp": 701, "life": 62.4, "pop": 28.8 },
    { "country": "Africa 18", "region": "Africa", "gdp": 623, "life": 57.8, "pop": 28.1 },
    { "country": "Africa 19", "region": "Africa", "gdp": 2364, "life": 63.5, "pop": 155.8 },
    { "country": "Africa 20", "region": "Africa", "gdp": 840, "life": 58.9, "pop": 33.9 },
    { "country": "Africa 21", "region": "Africa", "gdp": 7481, "life": 69.6, "pop": 43.1 },
    { "country": "Africa 22", "region": "Africa", "gdp": 844, "life": 62.1, "pop": 194.5 },
    { "country": "Africa 23", "region": "Africa", "gdp": 981, "life": 58.6, "pop": 6.3 },
    { "country": "Africa 24", "region": "Africa", "gdp": 5497, "life": 64.4, "pop": 191.2 },
    { "country": "Africa 25", "region": "Africa", "gdp": 2049, "life": 56.7, "pop": 6.9 },
    { "country": "Africa 26", "region": "Africa", "gdp": 2977, "life": 65.8, "pop": 28.5 },
    { "country": "Asia 1", "region": "Asia", "gdp": 3791, "life": 69.7, "pop": 17.1 },
    { "country": "Asia 2", "region": "Asia", "gdp": 13471, "life": 74.7, "pop": 2.8 },
    { "country": "Asia 3", "region": "Asia", "gdp": 11536, "life": 80.4, "pop": 5.4 },
    { "country": "Asia 4", "region": "Asia", "gdp": 4109, "life": 67.3, "pop": 96.4 },
    { "country": "Asia 5", "region": "Asia", "gdp": 6416, "life": 67.5, "pop": 82.6 },
    { "country": "Asia 6", "region": "Asia", "gdp": 4323, "life": 68.2, "pop": 75 },
    { "country": "Asia 7", "region": "Asia", "gdp": 8874, "life": 75.1, "pop": 74.5 },
    { "country": "Asia 8", "region": "Asia", "gdp": 5399, "life": 71, "pop": 12.2 },
    { "country": "Asia 9", "region": "Asia", "gdp": 13540, "life": 77, "pop": 28 },
    { "country": "Asia 10", "region": "Asia", "gdp": 5799, "life": 70.5, "pop": 120.2 },
    { "country": "Asia 11", "region": "Asia", "gdp": 23901, "life": 72.3, "pop": 17 },
    { "country": "Asia 12", "region": "Asia", "gdp": 25900, "life": 75.5, "pop": 5.1 },
    { "country": "Asia 13", "region": "Asia", "gdp": 3609, "life": 71.5, "pop": 13.5 },
    { "country": "Asia 14", "region": "Asia", "gdp": 15229, "life": 74.7, "pop": 170.9 },
    { "country": "Asia 15", "region": "Asia", "gdp": 8561, "life": 72.7, "pop": 144.5 },
    { "country": "Asia 16", "region": "Asia", "gdp": 16769, "life": 76.4, "pop": 181.8 },
    { "country": "Asia 17", "region": "Asia", "gdp": 4885, "life": 70.1, "pop": 69.9 },
    { "country": "Asia 18", "region": "Asia", "gdp": 7574, "life": 69.6, "pop": 8.3 },
    { "country": "Asia 19", "region": "Asia", "gdp": 2140, "life": 67.2, "pop": 19.1 },
    { "country": "Asia 20", "region": "Asia", "gdp": 3541, "life": 74.2, "pop": 4.9 },
    { "country": "Asia 21", "region": "Asia", "gdp": 8220, "life": 70.4, "pop": 134.6 },
    { "country": "Asia 22", "region": "Asia", "gdp": 2044, "life": 66.3, "pop": 21.7 },
    { "country": "Asia 23", "region": "Asia", "gdp": 4094, "life": 67.8, "pop": 134.3 },
    { "country": "Asia 24", "region": "Asia", "gdp": 26932, "life": 77.4, "pop": 67.6 },
    { "country": "Asia 25", "region": "Asia", "gdp": 12153, "life": 73.5, "pop": 33.1 },
    { "country": "Asia 26", "region": "Asia", "gdp": 10474, "life": 77.2, "pop": 17.7 },
    { "country": "Europe 1", "region": "Europe", "gdp": 199369, "life": 86.5, "pop": 79.3 },
    { "country": "Europe 2", "region": "Europe", "gdp": 26942, "life": 81.6, "pop": 20.8 },
    { "country": "Europe 3", "region": "Europe", "gdp": 14447, "life": 77.1, "pop": 9.5 },
    { "country": "Europe 4", "region": "Europe", "gdp": 56337, "life": 82.5, "pop": 459.9 },
    { "country": "Europe 5", "region": "Europe", "gdp": 22970, "life": 75.9, "pop": 10.3 },
    { "country": "Europe 6", "region": "Europe", "gdp": 41245, "life": 78.5, "pop": 7.8 },
    { "country": "Europe 7", "region": "Europe", "gdp": 72420, "life": 80.7, "pop": 75.9 },
    { "country": "Europe 8", "region": "Europe", "gdp": 30838, "life": 80, "pop": 6.1 },
    { "country": "Europe 9", "region": "Europe", "gdp": 147021, "life": 86.6, "pop": 141.3 },
    { "country": "Europe 10", "region": "Europe", "gdp": 14541, "life": 78.8, "pop": 24.2 },
    { "country": "Europe 11", "region": "Europe", "gdp": 24702, "life": 81.2, "pop": 3.4 },
    { "country": "Europe 12", "region": "Europe", "gdp": 16057, "life": 78.1, "pop": 8.3 },
    { "country": "Europe 13", "region": "Europe", "gdp": 28836, "life": 80.2, "pop": 92.2 },
    { "country": "Europe 14", "region": "Europe", "gdp": 39594, "life": 83.4, "pop": 40.9 },
    { "country": "Europe 15", "region": "Europe", "gdp": 20189, "life": 76.6, "pop": 45.1 },
    { "country": "Europe 16", "region": "Europe", "gdp": 32754, "life": 77.8, "pop": 48.2 },
    { "country": "Europe 17", "region": "Europe", "gdp": 26059, "life": 79.1, "pop": 24.4 },
    { "country": "Europe 18", "region": "Europe", "gdp": 16739, "life": 80.6, "pop": 28.3 },
    { "country": "Europe 19", "region": "Europe", "gdp": 18987, "life": 81, "pop": 15.7 },
    { "country": "Europe 20", "region": "Europe", "gdp": 20580, "life": 77.4, "pop": 10 },
    { "country": "Europe 21", "region": "Europe", "gdp": 213781, "life": 83.6, "pop": 6.7 },
    { "country": "Europe 22", "region": "Europe", "gdp": 36229, "life": 85.2, "pop": 26 },
    { "country": "Europe 23", "region": "Europe", "gdp": 79037, "life": 84.8, "pop": 3 },
    { "country": "Europe 24", "region": "Europe", "gdp": 34695, "life": 82, "pop": 20.7 },
    { "country": "Europe 25", "region": "Europe", "gdp": 20643, "life": 81.1, "pop": 9.1 },
    { "country": "Europe 26", "region": "Europe", "gdp": 22849, "life": 80.3, "pop": 40.3 },
    { "country": "Americas 1", "region": "Americas", "gdp": 8729, "life": 72.8, "pop": 90.3 },
    { "country": "Americas 2", "region": "Americas", "gdp": 4136, "life": 67.1, "pop": 67.6 },
    { "country": "Americas 3", "region": "Americas", "gdp": 5736, "life": 71, "pop": 71 },
    { "country": "Americas 4", "region": "Americas", "gdp": 29991, "life": 76.7, "pop": 309.6 },
    { "country": "Americas 5", "region": "Americas", "gdp": 12420, "life": 77.7, "pop": 132.2 },
    { "country": "Americas 6", "region": "Americas", "gdp": 12542, "life": 76.8, "pop": 8.2 },
    { "country": "Americas 7", "region": "Americas", "gdp": 10050, "life": 72.4, "pop": 10.6 },
    { "country": "Americas 8", "region": "Americas", "gdp": 10984, "life": 79.7, "pop": 4.9 },
    { "country": "Americas 9", "region": "Americas", "gdp": 11827, "life": 75.2, "pop": 2.6 },
    { "country": "Americas 10", "region": "Americas", "gdp": 1578, "life": 62.4, "pop": 13.6 },
    { "country": "Americas 11", "region": "Americas", "gdp": 10276, "life": 73.5, "pop": 71.4 },
    { "country": "Americas 12", "region": "Americas", "gdp": 11760, "life": 73.5, "pop": 7.4 },
    { "country": "Americas 13", "region": "Americas", "gdp": 10088, "life": 74.8, "pop": 5.1 },
    { "country": "Americas 14", "region": "Americas", "gdp": 21821, "life": 79.6, "pop": 122.3 },
    { "country": "Americas 15", "region": "Americas", "gdp": 11083, "life": 79.8, "pop": 5.9 },
    { "country": "Americas 16", "region": "Americas", "gdp": 8089, "life": 75.3, "pop": 18.5 },
    { "country": "Americas 17", "region": "Americas", "gdp": 26092, "life": 78.2, "pop": 16.2 },
    { "country": "Americas 18", "region": "Americas", "gdp": 23401, "life": 78.3, "pop": 110.6 },
    { "country": "Americas 19", "region": "Americas", "gdp": 10469, "life": 81.6, "pop": 10.8 },
    { "country": "Americas 20", "region": "Americas", "gdp": 23390, "life": 81.9, "pop": 52.5 },
    { "country": "Americas 21", "region": "Americas", "gdp": 7546, "life": 74.1, "pop": 11.2 },
    { "country": "Americas 22", "region": "Americas", "gdp": 41475, "life": 77.4, "pop": 7.2 },
    { "country": "Americas 23", "region": "Americas", "gdp": 8128, "life": 72.2, "pop": 2.7 },
    { "country": "Americas 24", "region": "Americas", "gdp": 4693, "life": 72.3, "pop": 14.6 },
    { "country": "Americas 25", "region": "Americas", "gdp": 10174, "life": 75.8, "pop": 73.5 },
    { "country": "Americas 26", "region": "Americas", "gdp": 3350, "life": 75, "pop": 25.3 }
  ],
  "x": "gdp",
  "y": "life",
  "size": "pop",
  "series": "region",
  "label": "country",
  "logX": true,
  "xFormat": "currency:USD",
  "xLabel": "GDP per person",
  "yLabel": "Life expectancy, years",
  "title": "GDP per person and life expectancy, 104 countries",
  "subtitle": "GDP per person (US$, log scale) against life expectancy. Bubble area is population.",
  "note": "Illustrative data",
  "type": "scatter-chart"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `x` (required) | `string` |  | Numeric field on the horizontal axis. |
| `y` (required) | `string` |  | Numeric field on the vertical axis. |
| `size` | `string` |  | Numeric field for bubble size; area is proportional to the value. |
| `series` | `string` |  | Field that colours points by group. Beyond 4 groups the smallest fold into a grey Other. |
| `label` | `string` |  | Field naming each point, for tooltips, direct labels and `highlight`. |
| `labels` | `"auto" \| "all" \| "none" \| string[]` | `"auto"` | Which points are labelled. `auto`: highlighted points, or the outliers when nothing is highlighted. Overlapping labels are hidden. |
| `trend` | `boolean` | `false` | Least-squares line of best fit through all points. |
| `logX` | `boolean` | `false` | Logarithmic x axis. |
| `logY` | `boolean` | `false` | Logarithmic y axis. |
| `xLabel` | `string` |  | x axis title. Defaults to the field name. |
| `yLabel` | `string` |  | y axis title. Defaults to the field name. |
| `xFormat` | `FormatSpec` |  | Format for x values; `format` applies to y. |
| `opacity` | `number` |  | Point opacity. Default falls as the point count rises. |
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

- Label only the points the title is about.
- If an axis uses a log scale, say so in `subtitle`.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/scatter-chart.md
- Component reference with every example: https://insightcharts.dev/llms/scatter-chart.md
- Registry item: https://insightcharts.dev/r/scatter-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/scatter-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/scatter-chart#example-bubbles-colour-groups-log-axis
- These instructions as plain text: https://insightcharts.dev/agents/atoms/scatter-chart/bubbles-colour-groups-log-axis.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
