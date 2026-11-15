# Reproduce the "Forced vertical with a fixed height" example of the InsightCharts Calendar heatmap

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Forced vertical with a fixed height" example of `calendar-heatmap` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Colours every day of one or more years by a value, laid out as a grid of weeks.

Use it when: Daily data over months or years where weekly rhythm, seasonality, streaks and gaps matter: activity, sales, incidents, habits.

Pick something else when: Reading the trend or exact values (use line-chart); fewer than about three months of days (use bar-chart); a non-daily grain such as hour by weekday (use heatmap).

Instructions for the alternatives: `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/calendar-heatmap
```

The file lands at `components/insightcharts/atoms/calendar-heatmap.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { CalendarHeatmap } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "date": "2024-01-01", "commits": 16 },
  { "date": "2024-01-02", "commits": 9 },
  { "date": "2024-01-03", "commits": 8 }
]
```

How the example maps columns to props:

- `date` = `"date"`. Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day.
- `value` = `"commits"`. Numeric field that colours each day. Rows sharing a day are summed.

With the user's data, keep the props and change the column names.

## 5. The "Forced vertical with a fixed height" example

This example sets `theme="magenta"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { CalendarHeatmap } from "insightcharts";

const data = [
  { date: "2024-01-01", commits: 16 },
  { date: "2024-01-02", commits: 9 },
  { date: "2024-01-03", commits: 8 },
  { date: "2024-01-04", commits: 6 },
  { date: "2024-01-05", commits: 8 },
  { date: "2024-01-06", commits: 1 },
  { date: "2024-01-07", commits: 1 },
  { date: "2024-01-08", commits: 17 },
  { date: "2024-01-09", commits: 12 },
  { date: "2024-01-10", commits: 13 },
  { date: "2024-01-11", commits: 14 },
  { date: "2024-01-12", commits: 9 },
  { date: "2024-01-13", commits: 2 },
  { date: "2024-01-14", commits: 2 },
  { date: "2024-01-15", commits: 11 },
  { date: "2024-01-16", commits: 14 },
  { date: "2024-01-17", commits: 10 },
  { date: "2024-01-18", commits: 11 },
  { date: "2024-01-19", commits: 14 },
  { date: "2024-01-20", commits: 2 },
  { date: "2024-01-21", commits: 2 },
  { date: "2024-01-22", commits: 11 },
  { date: "2024-01-23", commits: 9 },
  { date: "2024-01-24", commits: 14 },
  { date: "2024-01-25", commits: 8 },
  { date: "2024-01-26", commits: 14 },
  { date: "2024-01-27", commits: 1 },
  { date: "2024-01-28", commits: 1 },
  { date: "2024-01-29", commits: 10 },
  { date: "2024-01-30", commits: 5 },
  { date: "2024-01-31", commits: 11 },
  { date: "2024-02-01", commits: 12 },
  { date: "2024-02-02", commits: 15 },
  { date: "2024-02-03", commits: 1 },
  { date: "2024-02-04", commits: 2 },
  { date: "2024-02-05", commits: 10 },
  { date: "2024-02-06", commits: 9 },
  { date: "2024-02-07", commits: 12 },
  { date: "2024-02-08", commits: 6 },
  { date: "2024-02-09", commits: 13 },
  { date: "2024-02-10", commits: 1 },
  { date: "2024-02-11", commits: 1 },
  { date: "2024-02-12", commits: 7 },
  { date: "2024-02-13", commits: 17 },
  { date: "2024-02-14", commits: 16 },
  { date: "2024-02-15", commits: 17 },
  { date: "2024-02-16", commits: 10 },
  { date: "2024-02-17", commits: 1 },
  { date: "2024-02-18", commits: 1 },
  { date: "2024-02-19", commits: 11 },
  { date: "2024-02-20", commits: 6 },
  { date: "2024-02-21", commits: 15 },
  { date: "2024-02-22", commits: 17 },
  { date: "2024-02-23", commits: 5 },
  { date: "2024-02-24", commits: 1 },
  { date: "2024-02-25", commits: 2 },
  { date: "2024-02-26", commits: 14 },
  { date: "2024-02-27", commits: 12 },
  { date: "2024-02-28", commits: 18 },
  { date: "2024-02-29", commits: 9 },
  { date: "2024-03-01", commits: 16 },
  { date: "2024-03-02", commits: 1 },
  { date: "2024-03-03", commits: 1 },
  { date: "2024-03-04", commits: 15 },
  { date: "2024-03-05", commits: 5 },
  { date: "2024-03-06", commits: 9 },
  { date: "2024-03-07", commits: 12 },
  { date: "2024-03-08", commits: 16 },
  { date: "2024-03-09", commits: 2 },
  { date: "2024-03-10", commits: 1 },
  { date: "2024-03-11", commits: 11 },
  { date: "2024-03-12", commits: 14 },
  { date: "2024-03-13", commits: 18 },
  { date: "2024-03-14", commits: 14 },
  { date: "2024-03-15", commits: 9 },
  { date: "2024-03-16", commits: 1 },
  { date: "2024-03-17", commits: 2 },
  { date: "2024-03-18", commits: 9 },
  { date: "2024-03-19", commits: 18 },
  { date: "2024-03-20", commits: 16 },
  { date: "2024-03-21", commits: 8 },
  { date: "2024-03-22", commits: 18 },
  { date: "2024-03-23", commits: 1 },
  { date: "2024-03-24", commits: 3 },
  { date: "2024-03-25", commits: 30 },
  { date: "2024-03-26", commits: 19 },
  { date: "2024-03-27", commits: 12 },
  { date: "2024-03-28", commits: 11 },
  { date: "2024-03-29", commits: 9 },
  { date: "2024-03-30", commits: 1 },
  { date: "2024-03-31", commits: 2 },
  { date: "2024-04-01", commits: 7 },
  { date: "2024-04-02", commits: 18 },
  { date: "2024-04-03", commits: 19 },
  { date: "2024-04-04", commits: 15 },
  { date: "2024-04-05", commits: 10 },
  { date: "2024-04-06", commits: 1 },
  { date: "2024-04-07", commits: 1 },
  { date: "2024-04-08", commits: 18 },
  { date: "2024-04-09", commits: 9 },
  { date: "2024-04-10", commits: 14 },
  { date: "2024-04-11", commits: 16 },
  { date: "2024-04-12", commits: 14 },
  { date: "2024-04-13", commits: 2 },
  { date: "2024-04-14", commits: 2 },
  { date: "2024-04-15", commits: 15 },
  { date: "2024-04-16", commits: 7 },
  { date: "2024-04-17", commits: 15 },
  { date: "2024-04-18", commits: 17 },
  { date: "2024-04-19", commits: 8 },
  { date: "2024-04-20", commits: 1 },
  { date: "2024-04-21", commits: 2 },
  { date: "2024-04-22", commits: 11 },
  { date: "2024-04-23", commits: 19 },
  { date: "2024-04-24", commits: 18 },
  { date: "2024-04-25", commits: 6 },
  { date: "2024-04-26", commits: 16 },
  { date: "2024-04-27", commits: 1 },
  { date: "2024-04-28", commits: 2 },
  { date: "2024-04-29", commits: 13 },
  { date: "2024-04-30", commits: 6 },
  { date: "2024-05-01", commits: 16 },
  { date: "2024-05-02", commits: 7 },
  { date: "2024-05-03", commits: 19 },
  { date: "2024-05-04", commits: 1 },
  { date: "2024-05-05", commits: 1 },
  { date: "2024-05-06", commits: 12 },
  { date: "2024-05-07", commits: 17 },
  { date: "2024-05-08", commits: 11 },
  { date: "2024-05-09", commits: 10 },
  { date: "2024-05-10", commits: 19 },
  { date: "2024-05-11", commits: 2 },
  { date: "2024-05-12", commits: 1 },
  { date: "2024-05-13", commits: 7 },
  { date: "2024-05-14", commits: 17 },
  { date: "2024-05-15", commits: 7 },
  { date: "2024-05-16", commits: 18 },
  { date: "2024-05-17", commits: 10 },
  { date: "2024-05-18", commits: 1 },
  { date: "2024-05-19", commits: 1 },
  { date: "2024-05-20", commits: 8 },
  { date: "2024-05-21", commits: 18 },
  { date: "2024-05-22", commits: 12 },
  { date: "2024-05-23", commits: 19 },
  { date: "2024-05-24", commits: 17 },
  { date: "2024-05-25", commits: 2 },
  { date: "2024-05-26", commits: 2 },
  { date: "2024-05-27", commits: 11 },
  { date: "2024-05-28", commits: 13 },
  { date: "2024-05-29", commits: 14 },
  { date: "2024-05-30", commits: 14 },
  { date: "2024-05-31", commits: 12 },
  { date: "2024-06-01", commits: 1 },
  { date: "2024-06-02", commits: 1 },
  { date: "2024-06-03", commits: 15 },
  { date: "2024-06-04", commits: 15 },
  { date: "2024-06-05", commits: 17 },
  { date: "2024-06-06", commits: 8 },
  { date: "2024-06-07", commits: 17 },
  { date: "2024-06-08", commits: 2 },
  { date: "2024-06-09", commits: 1 },
  { date: "2024-06-10", commits: 9 },
  { date: "2024-06-11", commits: 11 },
  { date: "2024-06-12", commits: 16 },
  { date: "2024-06-13", commits: 12 },
  { date: "2024-06-14", commits: 11 },
  { date: "2024-06-15", commits: 1 },
  { date: "2024-06-16", commits: 2 },
  { date: "2024-06-17", commits: 13 },
  { date: "2024-06-18", commits: 16 },
  { date: "2024-06-19", commits: 12 },
  { date: "2024-06-20", commits: 18 },
  { date: "2024-06-21", commits: 9 },
  { date: "2024-06-22", commits: 1 },
  { date: "2024-06-23", commits: 2 },
  { date: "2024-06-24", commits: 12 },
  { date: "2024-06-25", commits: 12 },
  { date: "2024-06-26", commits: 14 },
  { date: "2024-06-27", commits: 14 },
  { date: "2024-06-28", commits: 24 },
  { date: "2024-06-29", commits: 2 },
  { date: "2024-06-30", commits: 2 },
  { date: "2024-07-01", commits: 17 },
  { date: "2024-07-02", commits: 9 },
  { date: "2024-07-03", commits: 18 },
  { date: "2024-07-04", commits: 16 },
  { date: "2024-07-05", commits: 7 },
  { date: "2024-07-06", commits: 1 },
  { date: "2024-07-07", commits: 1 },
  { date: "2024-07-08", commits: 21 },
  { date: "2024-07-09", commits: 15 },
  { date: "2024-07-10", commits: 7 },
  { date: "2024-07-11", commits: 9 },
  { date: "2024-07-12", commits: 21 },
  { date: "2024-07-13", commits: 1 },
  { date: "2024-07-14", commits: 2 },
  { date: "2024-07-15", commits: 20 },
  { date: "2024-07-16", commits: 20 },
  { date: "2024-07-17", commits: 16 },
  { date: "2024-07-18", commits: 22 },
  { date: "2024-07-19", commits: 18 },
  { date: "2024-07-20", commits: 2 },
  { date: "2024-07-21", commits: 2 },
  { date: "2024-07-22", commits: 7 },
  { date: "2024-07-23", commits: 20 },
  { date: "2024-07-24", commits: 22 },
  { date: "2024-07-25", commits: 14 },
  { date: "2024-07-26", commits: 18 },
  { date: "2024-07-27", commits: 1 },
  { date: "2024-07-28", commits: 2 },
  { date: "2024-07-29", commits: 9 },
  { date: "2024-07-30", commits: 17 },
  { date: "2024-07-31", commits: 18 },
  { date: "2024-08-01", commits: 17 },
  { date: "2024-08-02", commits: 19 },
  { date: "2024-08-03", commits: 1 },
  { date: "2024-08-04", commits: 1 },
  { date: "2024-08-05", commits: 2 },
  { date: "2024-08-06", commits: 1 },
  { date: "2024-08-07", commits: 1 },
  { date: "2024-08-08", commits: 2 },
  { date: "2024-08-09", commits: 2 },
  { date: "2024-08-12", commits: 2 },
  { date: "2024-08-13", commits: 1 },
  { date: "2024-08-14", commits: 3 },
  { date: "2024-08-15", commits: 2 },
  { date: "2024-08-16", commits: 2 },
  { date: "2024-08-19", commits: 18 },
  { date: "2024-08-20", commits: 15 },
  { date: "2024-08-21", commits: 19 },
  { date: "2024-08-22", commits: 18 },
  { date: "2024-08-23", commits: 7 },
  { date: "2024-08-24", commits: 2 },
  { date: "2024-08-25", commits: 1 },
  { date: "2024-08-26", commits: 12 },
  { date: "2024-08-27", commits: 14 },
  { date: "2024-08-28", commits: 12 },
  { date: "2024-08-29", commits: 11 },
  { date: "2024-08-30", commits: 11 },
  { date: "2024-08-31", commits: 1 },
  { date: "2024-09-01", commits: 1 },
  { date: "2024-09-02", commits: 20 },
  { date: "2024-09-03", commits: 22 },
  { date: "2024-09-04", commits: 11 },
  { date: "2024-09-05", commits: 19 },
  { date: "2024-09-06", commits: 15 },
  { date: "2024-09-07", commits: 2 },
  { date: "2024-09-08", commits: 1 },
  { date: "2024-09-09", commits: 8 },
  { date: "2024-09-10", commits: 22 },
  { date: "2024-09-11", commits: 23 },
  { date: "2024-09-12", commits: 9 },
  { date: "2024-09-13", commits: 19 },
  { date: "2024-09-14", commits: 1 },
  { date: "2024-09-15", commits: 2 },
  { date: "2024-09-16", commits: 11 },
  { date: "2024-09-17", commits: 13 },
  { date: "2024-09-18", commits: 11 },
  { date: "2024-09-19", commits: 12 },
  { date: "2024-09-20", commits: 18 },
  { date: "2024-09-21", commits: 2 },
  { date: "2024-09-22", commits: 1 },
  { date: "2024-09-23", commits: 15 },
  { date: "2024-09-24", commits: 37 },
  { date: "2024-09-25", commits: 38 },
  { date: "2024-09-26", commits: 30 },
  { date: "2024-09-27", commits: 39 },
  { date: "2024-09-28", commits: 2 },
  { date: "2024-09-29", commits: 2 },
  { date: "2024-09-30", commits: 30 },
  { date: "2024-10-01", commits: 22 },
  { date: "2024-10-02", commits: 19 },
  { date: "2024-10-03", commits: 24 },
  { date: "2024-10-04", commits: 19 },
  { date: "2024-10-05", commits: 1 },
  { date: "2024-10-06", commits: 1 },
  { date: "2024-10-07", commits: 23 },
  { date: "2024-10-08", commits: 9 },
  { date: "2024-10-09", commits: 21 },
  { date: "2024-10-10", commits: 14 },
  { date: "2024-10-11", commits: 12 },
  { date: "2024-10-12", commits: 1 },
  { date: "2024-10-13", commits: 1 },
  { date: "2024-10-14", commits: 8 },
  { date: "2024-10-15", commits: 8 },
  { date: "2024-10-16", commits: 21 },
  { date: "2024-10-17", commits: 13 },
  { date: "2024-10-18", commits: 23 },
  { date: "2024-10-19", commits: 1 },
  { date: "2024-10-20", commits: 1 },
  { date: "2024-10-21", commits: 15 },
  { date: "2024-10-22", commits: 17 },
  { date: "2024-10-23", commits: 19 },
  { date: "2024-10-24", commits: 24 },
  { date: "2024-10-25", commits: 19 },
  { date: "2024-10-26", commits: 1 },
  { date: "2024-10-27", commits: 2 },
  { date: "2024-10-28", commits: 16 },
  { date: "2024-10-29", commits: 22 },
  { date: "2024-10-30", commits: 13 },
  { date: "2024-10-31", commits: 23 },
  { date: "2024-11-01", commits: 16 },
  { date: "2024-11-02", commits: 1 },
  { date: "2024-11-03", commits: 2 },
  { date: "2024-11-04", commits: 20 },
  { date: "2024-11-05", commits: 17 },
  { date: "2024-11-06", commits: 13 },
  { date: "2024-11-07", commits: 14 },
  { date: "2024-11-08", commits: 19 },
  { date: "2024-11-09", commits: 1 },
  { date: "2024-11-10", commits: 1 },
  { date: "2024-11-11", commits: 25 },
  { date: "2024-11-12", commits: 8 },
  { date: "2024-11-13", commits: 24 },
  { date: "2024-11-14", commits: 10 },
  { date: "2024-11-15", commits: 15 },
  { date: "2024-11-16", commits: 2 },
  { date: "2024-11-17", commits: 2 },
  { date: "2024-11-18", commits: 11 },
  { date: "2024-11-19", commits: 7 },
  { date: "2024-11-20", commits: 15 },
  { date: "2024-11-21", commits: 22 },
  { date: "2024-11-22", commits: 8 },
  { date: "2024-11-23", commits: 1 },
  { date: "2024-11-24", commits: 2 },
  { date: "2024-11-25", commits: 19 },
  { date: "2024-11-26", commits: 8 },
  { date: "2024-11-27", commits: 17 },
  { date: "2024-11-28", commits: 9 },
  { date: "2024-11-29", commits: 25 },
  { date: "2024-11-30", commits: 1 },
  { date: "2024-12-01", commits: 1 },
  { date: "2024-12-02", commits: 13 },
  { date: "2024-12-03", commits: 12 },
  { date: "2024-12-04", commits: 10 },
  { date: "2024-12-05", commits: 14 },
  { date: "2024-12-06", commits: 8 },
  { date: "2024-12-07", commits: 1 },
  { date: "2024-12-08", commits: 1 },
  { date: "2024-12-09", commits: 16 },
  { date: "2024-12-10", commits: 8 },
  { date: "2024-12-11", commits: 19 },
  { date: "2024-12-12", commits: 23 },
  { date: "2024-12-13", commits: 22 },
  { date: "2024-12-14", commits: 2 },
  { date: "2024-12-15", commits: 2 },
  { date: "2024-12-16", commits: 9 },
  { date: "2024-12-17", commits: 24 },
  { date: "2024-12-18", commits: 21 },
  { date: "2024-12-19", commits: 18 },
  { date: "2024-12-20", commits: 21 },
  { date: "2024-12-21", commits: 1 },
  { date: "2024-12-22", commits: 1 },
  { date: "2024-12-23", commits: 24 },
  { date: "2024-12-24", commits: 37 },
  { date: "2024-12-25", commits: 17 },
  { date: "2024-12-26", commits: 34 },
  { date: "2024-12-27", commits: 24 },
  { date: "2024-12-28", commits: 2 },
  { date: "2024-12-29", commits: 3 },
  { date: "2024-12-30", commits: 24 },
  { date: "2024-12-31", commits: 33 },
];

<CalendarHeatmap
  theme="magenta"
  data={data}
  date="date"
  value="commits"
  orientation="vertical"
  height={520}
  style={{ maxWidth: 220 }}
  subtitle="Commits per day, 2024"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "magenta",
  "data": [
    { "date": "2024-01-01", "commits": 16 },
    { "date": "2024-01-02", "commits": 9 },
    { "date": "2024-01-03", "commits": 8 },
    { "date": "2024-01-04", "commits": 6 },
    { "date": "2024-01-05", "commits": 8 },
    { "date": "2024-01-06", "commits": 1 },
    { "date": "2024-01-07", "commits": 1 },
    { "date": "2024-01-08", "commits": 17 },
    { "date": "2024-01-09", "commits": 12 },
    { "date": "2024-01-10", "commits": 13 },
    { "date": "2024-01-11", "commits": 14 },
    { "date": "2024-01-12", "commits": 9 },
    { "date": "2024-01-13", "commits": 2 },
    { "date": "2024-01-14", "commits": 2 },
    { "date": "2024-01-15", "commits": 11 },
    { "date": "2024-01-16", "commits": 14 },
    { "date": "2024-01-17", "commits": 10 },
    { "date": "2024-01-18", "commits": 11 },
    { "date": "2024-01-19", "commits": 14 },
    { "date": "2024-01-20", "commits": 2 },
    { "date": "2024-01-21", "commits": 2 },
    { "date": "2024-01-22", "commits": 11 },
    { "date": "2024-01-23", "commits": 9 },
    { "date": "2024-01-24", "commits": 14 },
    { "date": "2024-01-25", "commits": 8 },
    { "date": "2024-01-26", "commits": 14 },
    { "date": "2024-01-27", "commits": 1 },
    { "date": "2024-01-28", "commits": 1 },
    { "date": "2024-01-29", "commits": 10 },
    { "date": "2024-01-30", "commits": 5 },
    { "date": "2024-01-31", "commits": 11 },
    { "date": "2024-02-01", "commits": 12 },
    { "date": "2024-02-02", "commits": 15 },
    { "date": "2024-02-03", "commits": 1 },
    { "date": "2024-02-04", "commits": 2 },
    { "date": "2024-02-05", "commits": 10 },
    { "date": "2024-02-06", "commits": 9 },
    { "date": "2024-02-07", "commits": 12 },
    { "date": "2024-02-08", "commits": 6 },
    { "date": "2024-02-09", "commits": 13 },
    { "date": "2024-02-10", "commits": 1 },
    { "date": "2024-02-11", "commits": 1 },
    { "date": "2024-02-12", "commits": 7 },
    { "date": "2024-02-13", "commits": 17 },
    { "date": "2024-02-14", "commits": 16 },
    { "date": "2024-02-15", "commits": 17 },
    { "date": "2024-02-16", "commits": 10 },
    { "date": "2024-02-17", "commits": 1 },
    { "date": "2024-02-18", "commits": 1 },
    { "date": "2024-02-19", "commits": 11 },
    { "date": "2024-02-20", "commits": 6 },
    { "date": "2024-02-21", "commits": 15 },
    { "date": "2024-02-22", "commits": 17 },
    { "date": "2024-02-23", "commits": 5 },
    { "date": "2024-02-24", "commits": 1 },
    { "date": "2024-02-25", "commits": 2 },
    { "date": "2024-02-26", "commits": 14 },
    { "date": "2024-02-27", "commits": 12 },
    { "date": "2024-02-28", "commits": 18 },
    { "date": "2024-02-29", "commits": 9 },
    { "date": "2024-03-01", "commits": 16 },
    { "date": "2024-03-02", "commits": 1 },
    { "date": "2024-03-03", "commits": 1 },
    { "date": "2024-03-04", "commits": 15 },
    { "date": "2024-03-05", "commits": 5 },
    { "date": "2024-03-06", "commits": 9 },
    { "date": "2024-03-07", "commits": 12 },
    { "date": "2024-03-08", "commits": 16 },
    { "date": "2024-03-09", "commits": 2 },
    { "date": "2024-03-10", "commits": 1 },
    { "date": "2024-03-11", "commits": 11 },
    { "date": "2024-03-12", "commits": 14 },
    { "date": "2024-03-13", "commits": 18 },
    { "date": "2024-03-14", "commits": 14 },
    { "date": "2024-03-15", "commits": 9 },
    { "date": "2024-03-16", "commits": 1 },
    { "date": "2024-03-17", "commits": 2 },
    { "date": "2024-03-18", "commits": 9 },
    { "date": "2024-03-19", "commits": 18 },
    { "date": "2024-03-20", "commits": 16 },
    { "date": "2024-03-21", "commits": 8 },
    { "date": "2024-03-22", "commits": 18 },
    { "date": "2024-03-23", "commits": 1 },
    { "date": "2024-03-24", "commits": 3 },
    { "date": "2024-03-25", "commits": 30 },
    { "date": "2024-03-26", "commits": 19 },
    { "date": "2024-03-27", "commits": 12 },
    { "date": "2024-03-28", "commits": 11 },
    { "date": "2024-03-29", "commits": 9 },
    { "date": "2024-03-30", "commits": 1 },
    { "date": "2024-03-31", "commits": 2 },
    { "date": "2024-04-01", "commits": 7 },
    { "date": "2024-04-02", "commits": 18 },
    { "date": "2024-04-03", "commits": 19 },
    { "date": "2024-04-04", "commits": 15 },
    { "date": "2024-04-05", "commits": 10 },
    { "date": "2024-04-06", "commits": 1 },
    { "date": "2024-04-07", "commits": 1 },
    { "date": "2024-04-08", "commits": 18 },
    { "date": "2024-04-09", "commits": 9 },
    { "date": "2024-04-10", "commits": 14 },
    { "date": "2024-04-11", "commits": 16 },
    { "date": "2024-04-12", "commits": 14 },
    { "date": "2024-04-13", "commits": 2 },
    { "date": "2024-04-14", "commits": 2 },
    { "date": "2024-04-15", "commits": 15 },
    { "date": "2024-04-16", "commits": 7 },
    { "date": "2024-04-17", "commits": 15 },
    { "date": "2024-04-18", "commits": 17 },
    { "date": "2024-04-19", "commits": 8 },
    { "date": "2024-04-20", "commits": 1 },
    { "date": "2024-04-21", "commits": 2 },
    { "date": "2024-04-22", "commits": 11 },
    { "date": "2024-04-23", "commits": 19 },
    { "date": "2024-04-24", "commits": 18 },
    { "date": "2024-04-25", "commits": 6 },
    { "date": "2024-04-26", "commits": 16 },
    { "date": "2024-04-27", "commits": 1 },
    { "date": "2024-04-28", "commits": 2 },
    { "date": "2024-04-29", "commits": 13 },
    { "date": "2024-04-30", "commits": 6 },
    { "date": "2024-05-01", "commits": 16 },
    { "date": "2024-05-02", "commits": 7 },
    { "date": "2024-05-03", "commits": 19 },
    { "date": "2024-05-04", "commits": 1 },
    { "date": "2024-05-05", "commits": 1 },
    { "date": "2024-05-06", "commits": 12 },
    { "date": "2024-05-07", "commits": 17 },
    { "date": "2024-05-08", "commits": 11 },
    { "date": "2024-05-09", "commits": 10 },
    { "date": "2024-05-10", "commits": 19 },
    { "date": "2024-05-11", "commits": 2 },
    { "date": "2024-05-12", "commits": 1 },
    { "date": "2024-05-13", "commits": 7 },
    { "date": "2024-05-14", "commits": 17 },
    { "date": "2024-05-15", "commits": 7 },
    { "date": "2024-05-16", "commits": 18 },
    { "date": "2024-05-17", "commits": 10 },
    { "date": "2024-05-18", "commits": 1 },
    { "date": "2024-05-19", "commits": 1 },
    { "date": "2024-05-20", "commits": 8 },
    { "date": "2024-05-21", "commits": 18 },
    { "date": "2024-05-22", "commits": 12 },
    { "date": "2024-05-23", "commits": 19 },
    { "date": "2024-05-24", "commits": 17 },
    { "date": "2024-05-25", "commits": 2 },
    { "date": "2024-05-26", "commits": 2 },
    { "date": "2024-05-27", "commits": 11 },
    { "date": "2024-05-28", "commits": 13 },
    { "date": "2024-05-29", "commits": 14 },
    { "date": "2024-05-30", "commits": 14 },
    { "date": "2024-05-31", "commits": 12 },
    { "date": "2024-06-01", "commits": 1 },
    { "date": "2024-06-02", "commits": 1 },
    { "date": "2024-06-03", "commits": 15 },
    { "date": "2024-06-04", "commits": 15 },
    { "date": "2024-06-05", "commits": 17 },
    { "date": "2024-06-06", "commits": 8 },
    { "date": "2024-06-07", "commits": 17 },
    { "date": "2024-06-08", "commits": 2 },
    { "date": "2024-06-09", "commits": 1 },
    { "date": "2024-06-10", "commits": 9 },
    { "date": "2024-06-11", "commits": 11 },
    { "date": "2024-06-12", "commits": 16 },
    { "date": "2024-06-13", "commits": 12 },
    { "date": "2024-06-14", "commits": 11 },
    { "date": "2024-06-15", "commits": 1 },
    { "date": "2024-06-16", "commits": 2 },
    { "date": "2024-06-17", "commits": 13 },
    { "date": "2024-06-18", "commits": 16 },
    { "date": "2024-06-19", "commits": 12 },
    { "date": "2024-06-20", "commits": 18 },
    { "date": "2024-06-21", "commits": 9 },
    { "date": "2024-06-22", "commits": 1 },
    { "date": "2024-06-23", "commits": 2 },
    { "date": "2024-06-24", "commits": 12 },
    { "date": "2024-06-25", "commits": 12 },
    { "date": "2024-06-26", "commits": 14 },
    { "date": "2024-06-27", "commits": 14 },
    { "date": "2024-06-28", "commits": 24 },
    { "date": "2024-06-29", "commits": 2 },
    { "date": "2024-06-30", "commits": 2 },
    { "date": "2024-07-01", "commits": 17 },
    { "date": "2024-07-02", "commits": 9 },
    { "date": "2024-07-03", "commits": 18 },
    { "date": "2024-07-04", "commits": 16 },
    { "date": "2024-07-05", "commits": 7 },
    { "date": "2024-07-06", "commits": 1 },
    { "date": "2024-07-07", "commits": 1 },
    { "date": "2024-07-08", "commits": 21 },
    { "date": "2024-07-09", "commits": 15 },
    { "date": "2024-07-10", "commits": 7 },
    { "date": "2024-07-11", "commits": 9 },
    { "date": "2024-07-12", "commits": 21 },
    { "date": "2024-07-13", "commits": 1 },
    { "date": "2024-07-14", "commits": 2 },
    { "date": "2024-07-15", "commits": 20 },
    { "date": "2024-07-16", "commits": 20 },
    { "date": "2024-07-17", "commits": 16 },
    { "date": "2024-07-18", "commits": 22 },
    { "date": "2024-07-19", "commits": 18 },
    { "date": "2024-07-20", "commits": 2 },
    { "date": "2024-07-21", "commits": 2 },
    { "date": "2024-07-22", "commits": 7 },
    { "date": "2024-07-23", "commits": 20 },
    { "date": "2024-07-24", "commits": 22 },
    { "date": "2024-07-25", "commits": 14 },
    { "date": "2024-07-26", "commits": 18 },
    { "date": "2024-07-27", "commits": 1 },
    { "date": "2024-07-28", "commits": 2 },
    { "date": "2024-07-29", "commits": 9 },
    { "date": "2024-07-30", "commits": 17 },
    { "date": "2024-07-31", "commits": 18 },
    { "date": "2024-08-01", "commits": 17 },
    { "date": "2024-08-02", "commits": 19 },
    { "date": "2024-08-03", "commits": 1 },
    { "date": "2024-08-04", "commits": 1 },
    { "date": "2024-08-05", "commits": 2 },
    { "date": "2024-08-06", "commits": 1 },
    { "date": "2024-08-07", "commits": 1 },
    { "date": "2024-08-08", "commits": 2 },
    { "date": "2024-08-09", "commits": 2 },
    { "date": "2024-08-12", "commits": 2 },
    { "date": "2024-08-13", "commits": 1 },
    { "date": "2024-08-14", "commits": 3 },
    { "date": "2024-08-15", "commits": 2 },
    { "date": "2024-08-16", "commits": 2 },
    { "date": "2024-08-19", "commits": 18 },
    { "date": "2024-08-20", "commits": 15 },
    { "date": "2024-08-21", "commits": 19 },
    { "date": "2024-08-22", "commits": 18 },
    { "date": "2024-08-23", "commits": 7 },
    { "date": "2024-08-24", "commits": 2 },
    { "date": "2024-08-25", "commits": 1 },
    { "date": "2024-08-26", "commits": 12 },
    { "date": "2024-08-27", "commits": 14 },
    { "date": "2024-08-28", "commits": 12 },
    { "date": "2024-08-29", "commits": 11 },
    { "date": "2024-08-30", "commits": 11 },
    { "date": "2024-08-31", "commits": 1 },
    { "date": "2024-09-01", "commits": 1 },
    { "date": "2024-09-02", "commits": 20 },
    { "date": "2024-09-03", "commits": 22 },
    { "date": "2024-09-04", "commits": 11 },
    { "date": "2024-09-05", "commits": 19 },
    { "date": "2024-09-06", "commits": 15 },
    { "date": "2024-09-07", "commits": 2 },
    { "date": "2024-09-08", "commits": 1 },
    { "date": "2024-09-09", "commits": 8 },
    { "date": "2024-09-10", "commits": 22 },
    { "date": "2024-09-11", "commits": 23 },
    { "date": "2024-09-12", "commits": 9 },
    { "date": "2024-09-13", "commits": 19 },
    { "date": "2024-09-14", "commits": 1 },
    { "date": "2024-09-15", "commits": 2 },
    { "date": "2024-09-16", "commits": 11 },
    { "date": "2024-09-17", "commits": 13 },
    { "date": "2024-09-18", "commits": 11 },
    { "date": "2024-09-19", "commits": 12 },
    { "date": "2024-09-20", "commits": 18 },
    { "date": "2024-09-21", "commits": 2 },
    { "date": "2024-09-22", "commits": 1 },
    { "date": "2024-09-23", "commits": 15 },
    { "date": "2024-09-24", "commits": 37 },
    { "date": "2024-09-25", "commits": 38 },
    { "date": "2024-09-26", "commits": 30 },
    { "date": "2024-09-27", "commits": 39 },
    { "date": "2024-09-28", "commits": 2 },
    { "date": "2024-09-29", "commits": 2 },
    { "date": "2024-09-30", "commits": 30 },
    { "date": "2024-10-01", "commits": 22 },
    { "date": "2024-10-02", "commits": 19 },
    { "date": "2024-10-03", "commits": 24 },
    { "date": "2024-10-04", "commits": 19 },
    { "date": "2024-10-05", "commits": 1 },
    { "date": "2024-10-06", "commits": 1 },
    { "date": "2024-10-07", "commits": 23 },
    { "date": "2024-10-08", "commits": 9 },
    { "date": "2024-10-09", "commits": 21 },
    { "date": "2024-10-10", "commits": 14 },
    { "date": "2024-10-11", "commits": 12 },
    { "date": "2024-10-12", "commits": 1 },
    { "date": "2024-10-13", "commits": 1 },
    { "date": "2024-10-14", "commits": 8 },
    { "date": "2024-10-15", "commits": 8 },
    { "date": "2024-10-16", "commits": 21 },
    { "date": "2024-10-17", "commits": 13 },
    { "date": "2024-10-18", "commits": 23 },
    { "date": "2024-10-19", "commits": 1 },
    { "date": "2024-10-20", "commits": 1 },
    { "date": "2024-10-21", "commits": 15 },
    { "date": "2024-10-22", "commits": 17 },
    { "date": "2024-10-23", "commits": 19 },
    { "date": "2024-10-24", "commits": 24 },
    { "date": "2024-10-25", "commits": 19 },
    { "date": "2024-10-26", "commits": 1 },
    { "date": "2024-10-27", "commits": 2 },
    { "date": "2024-10-28", "commits": 16 },
    { "date": "2024-10-29", "commits": 22 },
    { "date": "2024-10-30", "commits": 13 },
    { "date": "2024-10-31", "commits": 23 },
    { "date": "2024-11-01", "commits": 16 },
    { "date": "2024-11-02", "commits": 1 },
    { "date": "2024-11-03", "commits": 2 },
    { "date": "2024-11-04", "commits": 20 },
    { "date": "2024-11-05", "commits": 17 },
    { "date": "2024-11-06", "commits": 13 },
    { "date": "2024-11-07", "commits": 14 },
    { "date": "2024-11-08", "commits": 19 },
    { "date": "2024-11-09", "commits": 1 },
    { "date": "2024-11-10", "commits": 1 },
    { "date": "2024-11-11", "commits": 25 },
    { "date": "2024-11-12", "commits": 8 },
    { "date": "2024-11-13", "commits": 24 },
    { "date": "2024-11-14", "commits": 10 },
    { "date": "2024-11-15", "commits": 15 },
    { "date": "2024-11-16", "commits": 2 },
    { "date": "2024-11-17", "commits": 2 },
    { "date": "2024-11-18", "commits": 11 },
    { "date": "2024-11-19", "commits": 7 },
    { "date": "2024-11-20", "commits": 15 },
    { "date": "2024-11-21", "commits": 22 },
    { "date": "2024-11-22", "commits": 8 },
    { "date": "2024-11-23", "commits": 1 },
    { "date": "2024-11-24", "commits": 2 },
    { "date": "2024-11-25", "commits": 19 },
    { "date": "2024-11-26", "commits": 8 },
    { "date": "2024-11-27", "commits": 17 },
    { "date": "2024-11-28", "commits": 9 },
    { "date": "2024-11-29", "commits": 25 },
    { "date": "2024-11-30", "commits": 1 },
    { "date": "2024-12-01", "commits": 1 },
    { "date": "2024-12-02", "commits": 13 },
    { "date": "2024-12-03", "commits": 12 },
    { "date": "2024-12-04", "commits": 10 },
    { "date": "2024-12-05", "commits": 14 },
    { "date": "2024-12-06", "commits": 8 },
    { "date": "2024-12-07", "commits": 1 },
    { "date": "2024-12-08", "commits": 1 },
    { "date": "2024-12-09", "commits": 16 },
    { "date": "2024-12-10", "commits": 8 },
    { "date": "2024-12-11", "commits": 19 },
    { "date": "2024-12-12", "commits": 23 },
    { "date": "2024-12-13", "commits": 22 },
    { "date": "2024-12-14", "commits": 2 },
    { "date": "2024-12-15", "commits": 2 },
    { "date": "2024-12-16", "commits": 9 },
    { "date": "2024-12-17", "commits": 24 },
    { "date": "2024-12-18", "commits": 21 },
    { "date": "2024-12-19", "commits": 18 },
    { "date": "2024-12-20", "commits": 21 },
    { "date": "2024-12-21", "commits": 1 },
    { "date": "2024-12-22", "commits": 1 },
    { "date": "2024-12-23", "commits": 24 },
    { "date": "2024-12-24", "commits": 37 },
    { "date": "2024-12-25", "commits": 17 },
    { "date": "2024-12-26", "commits": 34 },
    { "date": "2024-12-27", "commits": 24 },
    { "date": "2024-12-28", "commits": 2 },
    { "date": "2024-12-29", "commits": 3 },
    { "date": "2024-12-30", "commits": 24 },
    { "date": "2024-12-31", "commits": 33 }
  ],
  "date": "date",
  "value": "commits",
  "orientation": "vertical",
  "height": 520,
  "style": { "maxWidth": 220 },
  "subtitle": "Commits per day, 2024",
  "type": "calendar-heatmap"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` (required) | `string` |  | Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day. |
| `value` (required) | `string` |  | Numeric field that colours each day. Rows sharing a day are summed. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Weeks left to right, or top to bottom. `auto` goes vertical under 480px. |
| `weekStart` | `"monday" \| "sunday"` | `"monday"` | First day of the week. |
| `domain` | `[number, number]` |  | Fix the ends of the colour scale. Default: 0 to the maximum. |
| `height` | `number \| string` |  | Common prop, but note the default: when omitted the height follows the cell size, which follows the width, so cells stay square. |

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

- Keep the periods in chronological order.
- A line encodes by position and may use an axis that does not start at zero. A filled area encodes by area and starts at zero.
- If you rebase to an index or use a log scale, say so in `subtitle`.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/calendar-heatmap.md
- Component reference with every example: https://insightcharts.dev/llms/calendar-heatmap.md
- Registry item: https://insightcharts.dev/r/calendar-heatmap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/calendar-heatmap.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/calendar-heatmap#example-forced-vertical-with-a-fixed-height
- These instructions as plain text: https://insightcharts.dev/agents/atoms/calendar-heatmap/forced-vertical-with-a-fixed-height.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
