# Reproduce the "Dots with jitter, long labels" example of the InsightCharts Strip plot

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Dots with jitter, long labels" example of `strip-plot` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Shows every observation as a tick or dot along a value axis, one row per category.

Use it when: Comparing the spread and clustering of a numeric value across 2 to about 15 categories when there are few enough observations to show each one; many rows with few to a few hundred observations each.

Pick something else when: A single group where the shape matters (use histogram or beeswarm-chart); when individual points must be identifiable or coloured (use beeswarm-chart); when only quartiles matter (use box-plot).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `box-plot` https://insightcharts.dev/agents/atoms/box-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/strip-plot
```

The file lands at `components/insightcharts/atoms/strip-plot.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { StripPlot } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "pupil": "Pupil 1", "school": "Northside Academy for Science and Technology", "score": 67 },
  { "pupil": "Pupil 2", "school": "Northside Academy for Science and Technology", "score": 44 },
  { "pupil": "Pupil 3", "school": "Northside Academy for Science and Technology", "score": 60 }
]
```

How the example maps columns to props:

- `value` = `"score"`. Numeric field positioning each mark.
- `group` = `"school"`. Category field: one row per distinct value.
- `label` = `"pupil"`. Field naming each observation, for the tooltip.

With the user's data, keep the props and change the column names.

## 5. The "Dots with jitter, long labels" example

This example sets `theme="sunrise"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { StripPlot } from "insightcharts";

const data = [
  { pupil: "Pupil 1", school: "Northside Academy for Science and Technology", score: 67 },
  { pupil: "Pupil 2", school: "Northside Academy for Science and Technology", score: 44 },
  { pupil: "Pupil 3", school: "Northside Academy for Science and Technology", score: 60 },
  { pupil: "Pupil 4", school: "Northside Academy for Science and Technology", score: 62 },
  { pupil: "Pupil 5", school: "Northside Academy for Science and Technology", score: 59 },
  { pupil: "Pupil 6", school: "Northside Academy for Science and Technology", score: 41 },
  { pupil: "Pupil 7", school: "Northside Academy for Science and Technology", score: 54 },
  { pupil: "Pupil 8", school: "Northside Academy for Science and Technology", score: 67 },
  { pupil: "Pupil 9", school: "Northside Academy for Science and Technology", score: 62 },
  { pupil: "Pupil 10", school: "Northside Academy for Science and Technology", score: 49 },
  { pupil: "Pupil 11", school: "Northside Academy for Science and Technology", score: 81 },
  { pupil: "Pupil 12", school: "Northside Academy for Science and Technology", score: 58 },
  { pupil: "Pupil 13", school: "Northside Academy for Science and Technology", score: 59 },
  { pupil: "Pupil 14", school: "Northside Academy for Science and Technology", score: 64 },
  { pupil: "Pupil 15", school: "Northside Academy for Science and Technology", score: 42 },
  { pupil: "Pupil 16", school: "Northside Academy for Science and Technology", score: 50 },
  { pupil: "Pupil 17", school: "Northside Academy for Science and Technology", score: 58 },
  { pupil: "Pupil 18", school: "Northside Academy for Science and Technology", score: 56 },
  { pupil: "Pupil 19", school: "Northside Academy for Science and Technology", score: 45 },
  { pupil: "Pupil 20", school: "Northside Academy for Science and Technology", score: 47 },
  { pupil: "Pupil 21", school: "Northside Academy for Science and Technology", score: 65 },
  { pupil: "Pupil 22", school: "Northside Academy for Science and Technology", score: 51 },
  { pupil: "Pupil 23", school: "Northside Academy for Science and Technology", score: 59 },
  { pupil: "Pupil 24", school: "Northside Academy for Science and Technology", score: 62 },
  { pupil: "Pupil 25", school: "Northside Academy for Science and Technology", score: 62 },
  { pupil: "Pupil 26", school: "Northside Academy for Science and Technology", score: 52 },
  { pupil: "Pupil 27", school: "Northside Academy for Science and Technology", score: 54 },
  { pupil: "Pupil 28", school: "Northside Academy for Science and Technology", score: 43 },
  { pupil: "Pupil 29", school: "Riverside", score: 52 },
  { pupil: "Pupil 30", school: "Riverside", score: 62 },
  { pupil: "Pupil 31", school: "Riverside", score: 53 },
  { pupil: "Pupil 32", school: "Riverside", score: 53 },
  { pupil: "Pupil 33", school: "Riverside", score: 48 },
  { pupil: "Pupil 34", school: "Riverside", score: 43 },
  { pupil: "Pupil 35", school: "Riverside", score: 49 },
  { pupil: "Pupil 36", school: "Riverside", score: 52 },
  { pupil: "Pupil 37", school: "Riverside", score: 51 },
  { pupil: "Pupil 38", school: "Riverside", score: 53 },
  { pupil: "Pupil 39", school: "Riverside", score: 64 },
  { pupil: "Pupil 40", school: "Riverside", score: 59 },
  { pupil: "Pupil 41", school: "Riverside", score: 54 },
  { pupil: "Pupil 42", school: "Riverside", score: 59 },
  { pupil: "Pupil 43", school: "Riverside", score: 75 },
  { pupil: "Pupil 44", school: "Riverside", score: 66 },
  { pupil: "Pupil 45", school: "Riverside", score: 47 },
  { pupil: "Pupil 46", school: "Riverside", score: 56 },
  { pupil: "Pupil 47", school: "Riverside", score: 44 },
  { pupil: "Pupil 48", school: "Riverside", score: 54 },
  { pupil: "Pupil 49", school: "Riverside", score: 62 },
  { pupil: "Pupil 50", school: "Riverside", score: 67 },
  { pupil: "Pupil 51", school: "Riverside", score: 72 },
  { pupil: "Pupil 52", school: "Riverside", score: 43 },
  { pupil: "Pupil 53", school: "Riverside", score: 59 },
  { pupil: "Pupil 54", school: "Riverside", score: 69 },
  { pupil: "Pupil 55", school: "Riverside", score: 67 },
  { pupil: "Pupil 56", school: "Riverside", score: 64 },
  { pupil: "Pupil 57", school: "St Mary's", score: 76 },
  { pupil: "Pupil 58", school: "St Mary's", score: 78 },
  { pupil: "Pupil 59", school: "St Mary's", score: 70 },
  { pupil: "Pupil 60", school: "St Mary's", score: 50 },
  { pupil: "Pupil 61", school: "St Mary's", score: 73 },
  { pupil: "Pupil 62", school: "St Mary's", score: 68 },
  { pupil: "Pupil 63", school: "St Mary's", score: 63 },
  { pupil: "Pupil 64", school: "St Mary's", score: 67 },
  { pupil: "Pupil 65", school: "St Mary's", score: 67 },
  { pupil: "Pupil 66", school: "St Mary's", score: 54 },
  { pupil: "Pupil 67", school: "St Mary's", score: 51 },
  { pupil: "Pupil 68", school: "St Mary's", score: 67 },
  { pupil: "Pupil 69", school: "St Mary's", score: 59 },
  { pupil: "Pupil 70", school: "St Mary's", score: 79 },
  { pupil: "Pupil 71", school: "St Mary's", score: 81 },
  { pupil: "Pupil 72", school: "St Mary's", score: 50 },
  { pupil: "Pupil 73", school: "St Mary's", score: 59 },
  { pupil: "Pupil 74", school: "St Mary's", score: 60 },
  { pupil: "Pupil 75", school: "St Mary's", score: 63 },
  { pupil: "Pupil 76", school: "St Mary's", score: 62 },
  { pupil: "Pupil 77", school: "St Mary's", score: 39 },
  { pupil: "Pupil 78", school: "St Mary's", score: 54 },
  { pupil: "Pupil 79", school: "St Mary's", score: 49 },
  { pupil: "Pupil 80", school: "St Mary's", score: 94 },
  { pupil: "Pupil 81", school: "St Mary's", score: 47 },
  { pupil: "Pupil 82", school: "St Mary's", score: 57 },
  { pupil: "Pupil 83", school: "St Mary's", score: 54 },
  { pupil: "Pupil 84", school: "St Mary's", score: 60 },
  { pupil: "Pupil 85", school: "Hillcrest Community College", score: 53 },
  { pupil: "Pupil 86", school: "Hillcrest Community College", score: 66 },
  { pupil: "Pupil 87", school: "Hillcrest Community College", score: 67 },
  { pupil: "Pupil 88", school: "Hillcrest Community College", score: 77 },
  { pupil: "Pupil 89", school: "Hillcrest Community College", score: 75 },
  { pupil: "Pupil 90", school: "Hillcrest Community College", score: 55 },
  { pupil: "Pupil 91", school: "Hillcrest Community College", score: 73 },
  { pupil: "Pupil 92", school: "Hillcrest Community College", score: 56 },
  { pupil: "Pupil 93", school: "Hillcrest Community College", score: 73 },
  { pupil: "Pupil 94", school: "Hillcrest Community College", score: 59 },
  { pupil: "Pupil 95", school: "Hillcrest Community College", score: 80 },
  { pupil: "Pupil 96", school: "Hillcrest Community College", score: 70 },
  { pupil: "Pupil 97", school: "Hillcrest Community College", score: 67 },
  { pupil: "Pupil 98", school: "Hillcrest Community College", score: 65 },
  { pupil: "Pupil 99", school: "Hillcrest Community College", score: 73 },
  { pupil: "Pupil 100", school: "Hillcrest Community College", score: 56 },
  { pupil: "Pupil 101", school: "Hillcrest Community College", score: 76 },
  { pupil: "Pupil 102", school: "Hillcrest Community College", score: 81 },
  { pupil: "Pupil 103", school: "Hillcrest Community College", score: 75 },
  { pupil: "Pupil 104", school: "Hillcrest Community College", score: 68 },
  { pupil: "Pupil 105", school: "Hillcrest Community College", score: 87 },
  { pupil: "Pupil 106", school: "Hillcrest Community College", score: 93 },
  { pupil: "Pupil 107", school: "Hillcrest Community College", score: 74 },
  { pupil: "Pupil 108", school: "Hillcrest Community College", score: 62 },
  { pupil: "Pupil 109", school: "Hillcrest Community College", score: 88 },
  { pupil: "Pupil 110", school: "Hillcrest Community College", score: 73 },
  { pupil: "Pupil 111", school: "Hillcrest Community College", score: 68 },
  { pupil: "Pupil 112", school: "Hillcrest Community College", score: 86 },
  { pupil: "Pupil 113", school: "Oakfield", score: 75 },
  { pupil: "Pupil 114", school: "Oakfield", score: 85 },
  { pupil: "Pupil 115", school: "Oakfield", score: 64 },
  { pupil: "Pupil 116", school: "Oakfield", score: 82 },
  { pupil: "Pupil 117", school: "Oakfield", score: 51 },
  { pupil: "Pupil 118", school: "Oakfield", score: 64 },
  { pupil: "Pupil 119", school: "Oakfield", score: 76 },
  { pupil: "Pupil 120", school: "Oakfield", score: 77 },
  { pupil: "Pupil 121", school: "Oakfield", score: 85 },
  { pupil: "Pupil 122", school: "Oakfield", score: 66 },
  { pupil: "Pupil 123", school: "Oakfield", score: 53 },
  { pupil: "Pupil 124", school: "Oakfield", score: 71 },
  { pupil: "Pupil 125", school: "Oakfield", score: 80 },
  { pupil: "Pupil 126", school: "Oakfield", score: 72 },
  { pupil: "Pupil 127", school: "Oakfield", score: 59 },
  { pupil: "Pupil 128", school: "Oakfield", score: 73 },
  { pupil: "Pupil 129", school: "Oakfield", score: 57 },
  { pupil: "Pupil 130", school: "Oakfield", score: 81 },
  { pupil: "Pupil 131", school: "Oakfield", score: 56 },
  { pupil: "Pupil 132", school: "Oakfield", score: 68 },
  { pupil: "Pupil 133", school: "Oakfield", score: 77 },
  { pupil: "Pupil 134", school: "Oakfield", score: 59 },
  { pupil: "Pupil 135", school: "Oakfield", score: 53 },
  { pupil: "Pupil 136", school: "Oakfield", score: 79 },
  { pupil: "Pupil 137", school: "Oakfield", score: 100 },
  { pupil: "Pupil 138", school: "Oakfield", score: 54 },
  { pupil: "Pupil 139", school: "Oakfield", score: 72 },
  { pupil: "Pupil 140", school: "Oakfield", score: 74 },
  { pupil: "Pupil 141", school: "Westbrook", score: 87 },
  { pupil: "Pupil 142", school: "Westbrook", score: 55 },
  { pupil: "Pupil 143", school: "Westbrook", score: 89 },
  { pupil: "Pupil 144", school: "Westbrook", score: 82 },
  { pupil: "Pupil 145", school: "Westbrook", score: 53 },
  { pupil: "Pupil 146", school: "Westbrook", score: 75 },
  { pupil: "Pupil 147", school: "Westbrook", score: 70 },
  { pupil: "Pupil 148", school: "Westbrook", score: 100 },
  { pupil: "Pupil 149", school: "Westbrook", score: 80 },
  { pupil: "Pupil 150", school: "Westbrook", score: 75 },
  { pupil: "Pupil 151", school: "Westbrook", score: 67 },
  { pupil: "Pupil 152", school: "Westbrook", score: 63 },
  { pupil: "Pupil 153", school: "Westbrook", score: 64 },
  { pupil: "Pupil 154", school: "Westbrook", score: 78 },
  { pupil: "Pupil 155", school: "Westbrook", score: 62 },
  { pupil: "Pupil 156", school: "Westbrook", score: 83 },
  { pupil: "Pupil 157", school: "Westbrook", score: 75 },
  { pupil: "Pupil 158", school: "Westbrook", score: 79 },
  { pupil: "Pupil 159", school: "Westbrook", score: 78 },
  { pupil: "Pupil 160", school: "Westbrook", score: 78 },
  { pupil: "Pupil 161", school: "Westbrook", score: 74 },
  { pupil: "Pupil 162", school: "Westbrook", score: 58 },
  { pupil: "Pupil 163", school: "Westbrook", score: 93 },
  { pupil: "Pupil 164", school: "Westbrook", score: 68 },
  { pupil: "Pupil 165", school: "Westbrook", score: 85 },
  { pupil: "Pupil 166", school: "Westbrook", score: 57 },
  { pupil: "Pupil 167", school: "Westbrook", score: 49 },
  { pupil: "Pupil 168", school: "Westbrook", score: 82 },
];

<StripPlot
  theme="sunrise"
  data={data}
  value="score"
  group="school"
  label="pupil"
  mark="dot"
  jitter
  median
  highlight="Westbrook"
  title="Exam scores at 6 schools"
  subtitle="Exam scores out of 100, 28 pupils per school"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "sunrise",
  "data": [
    { "pupil": "Pupil 1", "school": "Northside Academy for Science and Technology", "score": 67 },
    { "pupil": "Pupil 2", "school": "Northside Academy for Science and Technology", "score": 44 },
    { "pupil": "Pupil 3", "school": "Northside Academy for Science and Technology", "score": 60 },
    { "pupil": "Pupil 4", "school": "Northside Academy for Science and Technology", "score": 62 },
    { "pupil": "Pupil 5", "school": "Northside Academy for Science and Technology", "score": 59 },
    { "pupil": "Pupil 6", "school": "Northside Academy for Science and Technology", "score": 41 },
    { "pupil": "Pupil 7", "school": "Northside Academy for Science and Technology", "score": 54 },
    { "pupil": "Pupil 8", "school": "Northside Academy for Science and Technology", "score": 67 },
    { "pupil": "Pupil 9", "school": "Northside Academy for Science and Technology", "score": 62 },
    { "pupil": "Pupil 10", "school": "Northside Academy for Science and Technology", "score": 49 },
    { "pupil": "Pupil 11", "school": "Northside Academy for Science and Technology", "score": 81 },
    { "pupil": "Pupil 12", "school": "Northside Academy for Science and Technology", "score": 58 },
    { "pupil": "Pupil 13", "school": "Northside Academy for Science and Technology", "score": 59 },
    { "pupil": "Pupil 14", "school": "Northside Academy for Science and Technology", "score": 64 },
    { "pupil": "Pupil 15", "school": "Northside Academy for Science and Technology", "score": 42 },
    { "pupil": "Pupil 16", "school": "Northside Academy for Science and Technology", "score": 50 },
    { "pupil": "Pupil 17", "school": "Northside Academy for Science and Technology", "score": 58 },
    { "pupil": "Pupil 18", "school": "Northside Academy for Science and Technology", "score": 56 },
    { "pupil": "Pupil 19", "school": "Northside Academy for Science and Technology", "score": 45 },
    { "pupil": "Pupil 20", "school": "Northside Academy for Science and Technology", "score": 47 },
    { "pupil": "Pupil 21", "school": "Northside Academy for Science and Technology", "score": 65 },
    { "pupil": "Pupil 22", "school": "Northside Academy for Science and Technology", "score": 51 },
    { "pupil": "Pupil 23", "school": "Northside Academy for Science and Technology", "score": 59 },
    { "pupil": "Pupil 24", "school": "Northside Academy for Science and Technology", "score": 62 },
    { "pupil": "Pupil 25", "school": "Northside Academy for Science and Technology", "score": 62 },
    { "pupil": "Pupil 26", "school": "Northside Academy for Science and Technology", "score": 52 },
    { "pupil": "Pupil 27", "school": "Northside Academy for Science and Technology", "score": 54 },
    { "pupil": "Pupil 28", "school": "Northside Academy for Science and Technology", "score": 43 },
    { "pupil": "Pupil 29", "school": "Riverside", "score": 52 },
    { "pupil": "Pupil 30", "school": "Riverside", "score": 62 },
    { "pupil": "Pupil 31", "school": "Riverside", "score": 53 },
    { "pupil": "Pupil 32", "school": "Riverside", "score": 53 },
    { "pupil": "Pupil 33", "school": "Riverside", "score": 48 },
    { "pupil": "Pupil 34", "school": "Riverside", "score": 43 },
    { "pupil": "Pupil 35", "school": "Riverside", "score": 49 },
    { "pupil": "Pupil 36", "school": "Riverside", "score": 52 },
    { "pupil": "Pupil 37", "school": "Riverside", "score": 51 },
    { "pupil": "Pupil 38", "school": "Riverside", "score": 53 },
    { "pupil": "Pupil 39", "school": "Riverside", "score": 64 },
    { "pupil": "Pupil 40", "school": "Riverside", "score": 59 },
    { "pupil": "Pupil 41", "school": "Riverside", "score": 54 },
    { "pupil": "Pupil 42", "school": "Riverside", "score": 59 },
    { "pupil": "Pupil 43", "school": "Riverside", "score": 75 },
    { "pupil": "Pupil 44", "school": "Riverside", "score": 66 },
    { "pupil": "Pupil 45", "school": "Riverside", "score": 47 },
    { "pupil": "Pupil 46", "school": "Riverside", "score": 56 },
    { "pupil": "Pupil 47", "school": "Riverside", "score": 44 },
    { "pupil": "Pupil 48", "school": "Riverside", "score": 54 },
    { "pupil": "Pupil 49", "school": "Riverside", "score": 62 },
    { "pupil": "Pupil 50", "school": "Riverside", "score": 67 },
    { "pupil": "Pupil 51", "school": "Riverside", "score": 72 },
    { "pupil": "Pupil 52", "school": "Riverside", "score": 43 },
    { "pupil": "Pupil 53", "school": "Riverside", "score": 59 },
    { "pupil": "Pupil 54", "school": "Riverside", "score": 69 },
    { "pupil": "Pupil 55", "school": "Riverside", "score": 67 },
    { "pupil": "Pupil 56", "school": "Riverside", "score": 64 },
    { "pupil": "Pupil 57", "school": "St Mary's", "score": 76 },
    { "pupil": "Pupil 58", "school": "St Mary's", "score": 78 },
    { "pupil": "Pupil 59", "school": "St Mary's", "score": 70 },
    { "pupil": "Pupil 60", "school": "St Mary's", "score": 50 },
    { "pupil": "Pupil 61", "school": "St Mary's", "score": 73 },
    { "pupil": "Pupil 62", "school": "St Mary's", "score": 68 },
    { "pupil": "Pupil 63", "school": "St Mary's", "score": 63 },
    { "pupil": "Pupil 64", "school": "St Mary's", "score": 67 },
    { "pupil": "Pupil 65", "school": "St Mary's", "score": 67 },
    { "pupil": "Pupil 66", "school": "St Mary's", "score": 54 },
    { "pupil": "Pupil 67", "school": "St Mary's", "score": 51 },
    { "pupil": "Pupil 68", "school": "St Mary's", "score": 67 },
    { "pupil": "Pupil 69", "school": "St Mary's", "score": 59 },
    { "pupil": "Pupil 70", "school": "St Mary's", "score": 79 },
    { "pupil": "Pupil 71", "school": "St Mary's", "score": 81 },
    { "pupil": "Pupil 72", "school": "St Mary's", "score": 50 },
    { "pupil": "Pupil 73", "school": "St Mary's", "score": 59 },
    { "pupil": "Pupil 74", "school": "St Mary's", "score": 60 },
    { "pupil": "Pupil 75", "school": "St Mary's", "score": 63 },
    { "pupil": "Pupil 76", "school": "St Mary's", "score": 62 },
    { "pupil": "Pupil 77", "school": "St Mary's", "score": 39 },
    { "pupil": "Pupil 78", "school": "St Mary's", "score": 54 },
    { "pupil": "Pupil 79", "school": "St Mary's", "score": 49 },
    { "pupil": "Pupil 80", "school": "St Mary's", "score": 94 },
    { "pupil": "Pupil 81", "school": "St Mary's", "score": 47 },
    { "pupil": "Pupil 82", "school": "St Mary's", "score": 57 },
    { "pupil": "Pupil 83", "school": "St Mary's", "score": 54 },
    { "pupil": "Pupil 84", "school": "St Mary's", "score": 60 },
    { "pupil": "Pupil 85", "school": "Hillcrest Community College", "score": 53 },
    { "pupil": "Pupil 86", "school": "Hillcrest Community College", "score": 66 },
    { "pupil": "Pupil 87", "school": "Hillcrest Community College", "score": 67 },
    { "pupil": "Pupil 88", "school": "Hillcrest Community College", "score": 77 },
    { "pupil": "Pupil 89", "school": "Hillcrest Community College", "score": 75 },
    { "pupil": "Pupil 90", "school": "Hillcrest Community College", "score": 55 },
    { "pupil": "Pupil 91", "school": "Hillcrest Community College", "score": 73 },
    { "pupil": "Pupil 92", "school": "Hillcrest Community College", "score": 56 },
    { "pupil": "Pupil 93", "school": "Hillcrest Community College", "score": 73 },
    { "pupil": "Pupil 94", "school": "Hillcrest Community College", "score": 59 },
    { "pupil": "Pupil 95", "school": "Hillcrest Community College", "score": 80 },
    { "pupil": "Pupil 96", "school": "Hillcrest Community College", "score": 70 },
    { "pupil": "Pupil 97", "school": "Hillcrest Community College", "score": 67 },
    { "pupil": "Pupil 98", "school": "Hillcrest Community College", "score": 65 },
    { "pupil": "Pupil 99", "school": "Hillcrest Community College", "score": 73 },
    { "pupil": "Pupil 100", "school": "Hillcrest Community College", "score": 56 },
    { "pupil": "Pupil 101", "school": "Hillcrest Community College", "score": 76 },
    { "pupil": "Pupil 102", "school": "Hillcrest Community College", "score": 81 },
    { "pupil": "Pupil 103", "school": "Hillcrest Community College", "score": 75 },
    { "pupil": "Pupil 104", "school": "Hillcrest Community College", "score": 68 },
    { "pupil": "Pupil 105", "school": "Hillcrest Community College", "score": 87 },
    { "pupil": "Pupil 106", "school": "Hillcrest Community College", "score": 93 },
    { "pupil": "Pupil 107", "school": "Hillcrest Community College", "score": 74 },
    { "pupil": "Pupil 108", "school": "Hillcrest Community College", "score": 62 },
    { "pupil": "Pupil 109", "school": "Hillcrest Community College", "score": 88 },
    { "pupil": "Pupil 110", "school": "Hillcrest Community College", "score": 73 },
    { "pupil": "Pupil 111", "school": "Hillcrest Community College", "score": 68 },
    { "pupil": "Pupil 112", "school": "Hillcrest Community College", "score": 86 },
    { "pupil": "Pupil 113", "school": "Oakfield", "score": 75 },
    { "pupil": "Pupil 114", "school": "Oakfield", "score": 85 },
    { "pupil": "Pupil 115", "school": "Oakfield", "score": 64 },
    { "pupil": "Pupil 116", "school": "Oakfield", "score": 82 },
    { "pupil": "Pupil 117", "school": "Oakfield", "score": 51 },
    { "pupil": "Pupil 118", "school": "Oakfield", "score": 64 },
    { "pupil": "Pupil 119", "school": "Oakfield", "score": 76 },
    { "pupil": "Pupil 120", "school": "Oakfield", "score": 77 },
    { "pupil": "Pupil 121", "school": "Oakfield", "score": 85 },
    { "pupil": "Pupil 122", "school": "Oakfield", "score": 66 },
    { "pupil": "Pupil 123", "school": "Oakfield", "score": 53 },
    { "pupil": "Pupil 124", "school": "Oakfield", "score": 71 },
    { "pupil": "Pupil 125", "school": "Oakfield", "score": 80 },
    { "pupil": "Pupil 126", "school": "Oakfield", "score": 72 },
    { "pupil": "Pupil 127", "school": "Oakfield", "score": 59 },
    { "pupil": "Pupil 128", "school": "Oakfield", "score": 73 },
    { "pupil": "Pupil 129", "school": "Oakfield", "score": 57 },
    { "pupil": "Pupil 130", "school": "Oakfield", "score": 81 },
    { "pupil": "Pupil 131", "school": "Oakfield", "score": 56 },
    { "pupil": "Pupil 132", "school": "Oakfield", "score": 68 },
    { "pupil": "Pupil 133", "school": "Oakfield", "score": 77 },
    { "pupil": "Pupil 134", "school": "Oakfield", "score": 59 },
    { "pupil": "Pupil 135", "school": "Oakfield", "score": 53 },
    { "pupil": "Pupil 136", "school": "Oakfield", "score": 79 },
    { "pupil": "Pupil 137", "school": "Oakfield", "score": 100 },
    { "pupil": "Pupil 138", "school": "Oakfield", "score": 54 },
    { "pupil": "Pupil 139", "school": "Oakfield", "score": 72 },
    { "pupil": "Pupil 140", "school": "Oakfield", "score": 74 },
    { "pupil": "Pupil 141", "school": "Westbrook", "score": 87 },
    { "pupil": "Pupil 142", "school": "Westbrook", "score": 55 },
    { "pupil": "Pupil 143", "school": "Westbrook", "score": 89 },
    { "pupil": "Pupil 144", "school": "Westbrook", "score": 82 },
    { "pupil": "Pupil 145", "school": "Westbrook", "score": 53 },
    { "pupil": "Pupil 146", "school": "Westbrook", "score": 75 },
    { "pupil": "Pupil 147", "school": "Westbrook", "score": 70 },
    { "pupil": "Pupil 148", "school": "Westbrook", "score": 100 },
    { "pupil": "Pupil 149", "school": "Westbrook", "score": 80 },
    { "pupil": "Pupil 150", "school": "Westbrook", "score": 75 },
    { "pupil": "Pupil 151", "school": "Westbrook", "score": 67 },
    { "pupil": "Pupil 152", "school": "Westbrook", "score": 63 },
    { "pupil": "Pupil 153", "school": "Westbrook", "score": 64 },
    { "pupil": "Pupil 154", "school": "Westbrook", "score": 78 },
    { "pupil": "Pupil 155", "school": "Westbrook", "score": 62 },
    { "pupil": "Pupil 156", "school": "Westbrook", "score": 83 },
    { "pupil": "Pupil 157", "school": "Westbrook", "score": 75 },
    { "pupil": "Pupil 158", "school": "Westbrook", "score": 79 },
    { "pupil": "Pupil 159", "school": "Westbrook", "score": 78 },
    { "pupil": "Pupil 160", "school": "Westbrook", "score": 78 },
    { "pupil": "Pupil 161", "school": "Westbrook", "score": 74 },
    { "pupil": "Pupil 162", "school": "Westbrook", "score": 58 },
    { "pupil": "Pupil 163", "school": "Westbrook", "score": 93 },
    { "pupil": "Pupil 164", "school": "Westbrook", "score": 68 },
    { "pupil": "Pupil 165", "school": "Westbrook", "score": 85 },
    { "pupil": "Pupil 166", "school": "Westbrook", "score": 57 },
    { "pupil": "Pupil 167", "school": "Westbrook", "score": 49 },
    { "pupil": "Pupil 168", "school": "Westbrook", "score": 82 }
  ],
  "value": "score",
  "group": "school",
  "label": "pupil",
  "mark": "dot",
  "jitter": true,
  "median": true,
  "highlight": "Westbrook",
  "title": "Exam scores at 6 schools",
  "subtitle": "Exam scores out of 100, 28 pupils per school",
  "note": "Illustrative data",
  "type": "strip-plot"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field positioning each mark. |
| `group` (required) | `string` |  | Category field: one row per distinct value. |
| `label` | `string` |  | Field naming each observation, for the tooltip. |
| `mark` | `"tick" \| "dot"` | `"tick"` | Thin vertical ticks (a barcode) or translucent dots. |
| `median` | `boolean` | `false` | Heavier tick at each row's median, with its value printed. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order rows by median. |
| `jitter` | `boolean` | `false` | Deterministic vertical spread for dots, to relieve overplotting. |

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/strip-plot.md
- Component reference with every example: https://insightcharts.dev/llms/strip-plot.md
- Registry item: https://insightcharts.dev/r/strip-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/strip-plot.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/strip-plot#example-dots-with-jitter-long-labels
- These instructions as plain text: https://insightcharts.dev/agents/atoms/strip-plot/dots-with-jitter-long-labels.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
