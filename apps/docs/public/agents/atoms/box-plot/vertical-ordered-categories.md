# Reproduce the "Vertical, ordered categories" example of the InsightCharts Box plot

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Vertical, ordered categories" example of `box-plot` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.

Use it when: Comparing the centre and spread of a numeric value across several groups, especially with many rows per group and an audience comfortable with quartiles.

Pick something else when: A general audience or fewer than about 20 rows per group (use strip-plot or beeswarm-chart, which show the observations themselves); one group whose shape matters, such as two peaks, which a box hides (use histogram).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/box-plot
```

The file lands at `components/insightcharts/atoms/box-plot.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BoxPlot } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[{ "month": "Jan", "temp": 4.8 }, { "month": "Jan", "temp": 7.4 }, { "month": "Jan", "temp": 0.4 }]
```

How the example maps columns to props:

- `value` = `"temp"`. Numeric field to summarise. Pass raw rows; quartiles are computed in the chart.
- `group` = `"month"`. Category field: one box per distinct value. Omit for a single box.

With the user's data, keep the props and change the column names.

## 5. The "Vertical, ordered categories" example

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { month: "Jan", temp: 4.8 },
  { month: "Jan", temp: 7.4 },
  { month: "Jan", temp: 0.4 },
  { month: "Jan", temp: 3.5 },
  { month: "Jan", temp: -0.7 },
  { month: "Jan", temp: 2 },
  { month: "Jan", temp: -1.4 },
  { month: "Jan", temp: 7.2 },
  { month: "Jan", temp: 2.7 },
  { month: "Jan", temp: 1 },
  { month: "Jan", temp: 5.6 },
  { month: "Jan", temp: 4.2 },
  { month: "Jan", temp: -2.2 },
  { month: "Jan", temp: 6.8 },
  { month: "Jan", temp: 3.2 },
  { month: "Jan", temp: 1.4 },
  { month: "Jan", temp: 1.1 },
  { month: "Jan", temp: 6.9 },
  { month: "Jan", temp: 5.3 },
  { month: "Jan", temp: -0.9 },
  { month: "Jan", temp: 0.1 },
  { month: "Jan", temp: 2.9 },
  { month: "Jan", temp: 2 },
  { month: "Jan", temp: 1.4 },
  { month: "Jan", temp: 8.9 },
  { month: "Jan", temp: 4.2 },
  { month: "Jan", temp: -0.7 },
  { month: "Jan", temp: 4.1 },
  { month: "Jan", temp: 7.3 },
  { month: "Jan", temp: 1.6 },
  { month: "Feb", temp: -2.5 },
  { month: "Feb", temp: 4.2 },
  { month: "Feb", temp: -4.8 },
  { month: "Feb", temp: 4.4 },
  { month: "Feb", temp: 2.7 },
  { month: "Feb", temp: 3.5 },
  { month: "Feb", temp: 3.7 },
  { month: "Feb", temp: 3.3 },
  { month: "Feb", temp: 5.9 },
  { month: "Feb", temp: -1.3 },
  { month: "Feb", temp: 0.5 },
  { month: "Feb", temp: 1 },
  { month: "Feb", temp: -1.2 },
  { month: "Feb", temp: -1.1 },
  { month: "Feb", temp: 0.3 },
  { month: "Feb", temp: -4 },
  { month: "Feb", temp: 3.4 },
  { month: "Feb", temp: 5.5 },
  { month: "Feb", temp: 3.5 },
  { month: "Feb", temp: -2.4 },
  { month: "Feb", temp: 1.9 },
  { month: "Feb", temp: -1.7 },
  { month: "Feb", temp: 4.9 },
  { month: "Feb", temp: 2 },
  { month: "Feb", temp: -1 },
  { month: "Feb", temp: -0.4 },
  { month: "Feb", temp: -3.4 },
  { month: "Feb", temp: 0.2 },
  { month: "Feb", temp: -0.7 },
  { month: "Feb", temp: 2.2 },
  { month: "Mar", temp: 5.9 },
  { month: "Mar", temp: 3.9 },
  { month: "Mar", temp: 4.4 },
  { month: "Mar", temp: 3.1 },
  { month: "Mar", temp: 5.9 },
  { month: "Mar", temp: 1.3 },
  { month: "Mar", temp: 6.5 },
  { month: "Mar", temp: -0.6 },
  { month: "Mar", temp: 5.3 },
  { month: "Mar", temp: 4.7 },
  { month: "Mar", temp: 6.1 },
  { month: "Mar", temp: 11.6 },
  { month: "Mar", temp: 2.9 },
  { month: "Mar", temp: 8.4 },
  { month: "Mar", temp: 3 },
  { month: "Mar", temp: 2.3 },
  { month: "Mar", temp: 4.7 },
  { month: "Mar", temp: 7.2 },
  { month: "Mar", temp: 7.2 },
  { month: "Mar", temp: 6.5 },
  { month: "Mar", temp: 9.4 },
  { month: "Mar", temp: 4.6 },
  { month: "Mar", temp: 6.9 },
  { month: "Mar", temp: 5.1 },
  { month: "Mar", temp: 7.7 },
  { month: "Mar", temp: 0.4 },
  { month: "Mar", temp: -1.3 },
  { month: "Mar", temp: 3.2 },
  { month: "Mar", temp: 3.8 },
  { month: "Mar", temp: 2 },
  { month: "Apr", temp: 11.8 },
  { month: "Apr", temp: 7.5 },
  { month: "Apr", temp: 8.4 },
  { month: "Apr", temp: 8.7 },
  { month: "Apr", temp: 11.4 },
  { month: "Apr", temp: 9.5 },
  { month: "Apr", temp: 9.3 },
  { month: "Apr", temp: 8.4 },
  { month: "Apr", temp: 6.5 },
  { month: "Apr", temp: 10.2 },
  { month: "Apr", temp: 12 },
  { month: "Apr", temp: 5.8 },
  { month: "Apr", temp: 8.6 },
  { month: "Apr", temp: 5.1 },
  { month: "Apr", temp: 10 },
  { month: "Apr", temp: 3.4 },
  { month: "Apr", temp: 7.1 },
  { month: "Apr", temp: 9.2 },
  { month: "Apr", temp: 3 },
  { month: "Apr", temp: 10.5 },
  { month: "Apr", temp: 8.5 },
  { month: "Apr", temp: 7.6 },
  { month: "Apr", temp: 15.7 },
  { month: "Apr", temp: 7 },
  { month: "Apr", temp: 6.3 },
  { month: "Apr", temp: 3.7 },
  { month: "Apr", temp: 9.9 },
  { month: "Apr", temp: 9.4 },
  { month: "Apr", temp: 9.2 },
  { month: "Apr", temp: 10.4 },
  { month: "May", temp: 17.7 },
  { month: "May", temp: 12.1 },
  { month: "May", temp: 13.1 },
  { month: "May", temp: 12.9 },
  { month: "May", temp: 12 },
  { month: "May", temp: 14.8 },
  { month: "May", temp: 12.8 },
  { month: "May", temp: 14.9 },
  { month: "May", temp: 7.6 },
  { month: "May", temp: 15.4 },
  { month: "May", temp: 13.2 },
  { month: "May", temp: 15.7 },
  { month: "May", temp: 11.8 },
  { month: "May", temp: 18.8 },
  { month: "May", temp: 14.9 },
  { month: "May", temp: 14 },
  { month: "May", temp: 11.6 },
  { month: "May", temp: 13.5 },
  { month: "May", temp: 20 },
  { month: "May", temp: 20.7 },
  { month: "May", temp: 9.1 },
  { month: "May", temp: 18.5 },
  { month: "May", temp: 13.5 },
  { month: "May", temp: 7.8 },
  { month: "May", temp: 17.1 },
  { month: "May", temp: 15.8 },
  { month: "May", temp: 11 },
  { month: "May", temp: 10.1 },
  { month: "May", temp: 13.4 },
  { month: "May", temp: 11.7 },
  { month: "Jun", temp: 19.4 },
  { month: "Jun", temp: 17 },
  { month: "Jun", temp: 21.7 },
  { month: "Jun", temp: 20.9 },
  { month: "Jun", temp: 19.9 },
  { month: "Jun", temp: 20.9 },
  { month: "Jun", temp: 19.1 },
  { month: "Jun", temp: 15.5 },
  { month: "Jun", temp: 15.2 },
  { month: "Jun", temp: 16.1 },
  { month: "Jun", temp: 18.7 },
  { month: "Jun", temp: 13.3 },
  { month: "Jun", temp: 19.4 },
  { month: "Jun", temp: 15.3 },
  { month: "Jun", temp: 16.1 },
  { month: "Jun", temp: 17.8 },
  { month: "Jun", temp: 20.4 },
  { month: "Jun", temp: 16.7 },
  { month: "Jun", temp: 15.8 },
  { month: "Jun", temp: 17.8 },
  { month: "Jun", temp: 19.2 },
  { month: "Jun", temp: 18.2 },
  { month: "Jun", temp: 18.9 },
  { month: "Jun", temp: 16.7 },
  { month: "Jun", temp: 14.1 },
  { month: "Jun", temp: 19 },
  { month: "Jun", temp: 20.7 },
  { month: "Jun", temp: 17.5 },
  { month: "Jun", temp: 18.4 },
  { month: "Jun", temp: 19.2 },
  { month: "Jul", temp: 20.7 },
  { month: "Jul", temp: 21.8 },
  { month: "Jul", temp: 25 },
  { month: "Jul", temp: 17.2 },
  { month: "Jul", temp: 19.6 },
  { month: "Jul", temp: 15 },
  { month: "Jul", temp: 19.4 },
  { month: "Jul", temp: 22.4 },
  { month: "Jul", temp: 22.3 },
  { month: "Jul", temp: 24.7 },
  { month: "Jul", temp: 23.7 },
  { month: "Jul", temp: 18.2 },
  { month: "Jul", temp: 21.1 },
  { month: "Jul", temp: 20.1 },
  { month: "Jul", temp: 21.8 },
  { month: "Jul", temp: 20.7 },
  { month: "Jul", temp: 17.8 },
  { month: "Jul", temp: 21.5 },
  { month: "Jul", temp: 21.8 },
  { month: "Jul", temp: 19.2 },
  { month: "Jul", temp: 15.1 },
  { month: "Jul", temp: 22.6 },
  { month: "Jul", temp: 11.8 },
  { month: "Jul", temp: 24.5 },
  { month: "Jul", temp: 18.2 },
  { month: "Jul", temp: 22.1 },
  { month: "Jul", temp: 22.8 },
  { month: "Jul", temp: 18.1 },
  { month: "Jul", temp: 21.1 },
  { month: "Jul", temp: 23.8 },
  { month: "Aug", temp: 17.2 },
  { month: "Aug", temp: 23.6 },
  { month: "Aug", temp: 19 },
  { month: "Aug", temp: 21.7 },
  { month: "Aug", temp: 20.2 },
  { month: "Aug", temp: 16.6 },
  { month: "Aug", temp: 20.8 },
  { month: "Aug", temp: 22.4 },
  { month: "Aug", temp: 19 },
  { month: "Aug", temp: 19.5 },
  { month: "Aug", temp: 15.4 },
  { month: "Aug", temp: 22.6 },
  { month: "Aug", temp: 20.4 },
  { month: "Aug", temp: 24 },
  { month: "Aug", temp: 20.8 },
  { month: "Aug", temp: 18.6 },
  { month: "Aug", temp: 19.6 },
  { month: "Aug", temp: 16.5 },
  { month: "Aug", temp: 28.4 },
  { month: "Aug", temp: 15.4 },
  { month: "Aug", temp: 26.7 },
  { month: "Aug", temp: 25.1 },
  { month: "Aug", temp: 22.6 },
  { month: "Aug", temp: 22 },
  { month: "Aug", temp: 17.2 },
  { month: "Aug", temp: 23.3 },
  { month: "Aug", temp: 21.1 },
  { month: "Aug", temp: 17.8 },
  { month: "Aug", temp: 18.3 },
  { month: "Aug", temp: 20.3 },
  { month: "Sep", temp: 14.7 },
  { month: "Sep", temp: 19.6 },
  { month: "Sep", temp: 16.6 },
  { month: "Sep", temp: 13.2 },
  { month: "Sep", temp: 13.4 },
  { month: "Sep", temp: 15.8 },
  { month: "Sep", temp: 17.5 },
  { month: "Sep", temp: 16.7 },
  { month: "Sep", temp: 16.9 },
  { month: "Sep", temp: 19.4 },
  { month: "Sep", temp: 21 },
  { month: "Sep", temp: 20.8 },
  { month: "Sep", temp: 10.9 },
  { month: "Sep", temp: 13.7 },
  { month: "Sep", temp: 22.3 },
  { month: "Sep", temp: 22.6 },
  { month: "Sep", temp: 23.3 },
  { month: "Sep", temp: 23.3 },
  { month: "Sep", temp: 21.4 },
  { month: "Sep", temp: 19.8 },
  { month: "Sep", temp: 22 },
  { month: "Sep", temp: 20.5 },
  { month: "Sep", temp: 21.2 },
  { month: "Sep", temp: 18.4 },
  { month: "Sep", temp: 12.8 },
  { month: "Sep", temp: 10.6 },
  { month: "Sep", temp: 21.2 },
  { month: "Sep", temp: 12.2 },
  { month: "Sep", temp: 17.1 },
  { month: "Sep", temp: 16.8 },
  { month: "Oct", temp: 13.3 },
  { month: "Oct", temp: 16.5 },
  { month: "Oct", temp: 9.8 },
  { month: "Oct", temp: 10.3 },
  { month: "Oct", temp: 10.6 },
  { month: "Oct", temp: 12.8 },
  { month: "Oct", temp: 10.2 },
  { month: "Oct", temp: 17.7 },
  { month: "Oct", temp: 14 },
  { month: "Oct", temp: 15.1 },
  { month: "Oct", temp: 15.1 },
  { month: "Oct", temp: 14.4 },
  { month: "Oct", temp: 18.1 },
  { month: "Oct", temp: 17.6 },
  { month: "Oct", temp: 10 },
  { month: "Oct", temp: 8.4 },
  { month: "Oct", temp: 11.4 },
  { month: "Oct", temp: 17.2 },
  { month: "Oct", temp: 17.1 },
  { month: "Oct", temp: 15.7 },
  { month: "Oct", temp: 10 },
  { month: "Oct", temp: 14.3 },
  { month: "Oct", temp: 10 },
  { month: "Oct", temp: 14 },
  { month: "Oct", temp: 11.2 },
  { month: "Oct", temp: 16 },
  { month: "Oct", temp: 14.2 },
  { month: "Oct", temp: 12.9 },
  { month: "Oct", temp: 12.4 },
  { month: "Oct", temp: 11.4 },
  { month: "Nov", temp: 10.9 },
  { month: "Nov", temp: 11.5 },
  { month: "Nov", temp: 12.1 },
  { month: "Nov", temp: 10.2 },
  { month: "Nov", temp: 4.7 },
  { month: "Nov", temp: 11.6 },
  { month: "Nov", temp: 13 },
  { month: "Nov", temp: 7.7 },
  { month: "Nov", temp: 7.2 },
  { month: "Nov", temp: 9.6 },
  { month: "Nov", temp: 17.7 },
  { month: "Nov", temp: 7.7 },
  { month: "Nov", temp: 4.8 },
  { month: "Nov", temp: 8.5 },
  { month: "Nov", temp: 9 },
  { month: "Nov", temp: 5.4 },
  { month: "Nov", temp: 8.2 },
  { month: "Nov", temp: 10.1 },
  { month: "Nov", temp: 9 },
  { month: "Nov", temp: 5.3 },
  { month: "Nov", temp: 1.5 },
  { month: "Nov", temp: 7.8 },
  { month: "Nov", temp: 10.2 },
  { month: "Nov", temp: 7.6 },
  { month: "Nov", temp: 8.1 },
  { month: "Nov", temp: 9.4 },
  { month: "Nov", temp: 11.4 },
  { month: "Nov", temp: 13.4 },
  { month: "Nov", temp: 16 },
  { month: "Nov", temp: 4.2 },
  { month: "Dec", temp: 3.8 },
  { month: "Dec", temp: 9.8 },
  { month: "Dec", temp: 3.4 },
  { month: "Dec", temp: 7.3 },
  { month: "Dec", temp: 7.9 },
  { month: "Dec", temp: 7.3 },
  { month: "Dec", temp: 3.4 },
  { month: "Dec", temp: 1.7 },
  { month: "Dec", temp: 4.2 },
  { month: "Dec", temp: -0.9 },
  { month: "Dec", temp: 3.5 },
  { month: "Dec", temp: -2.6 },
  { month: "Dec", temp: 6.7 },
  { month: "Dec", temp: 5.9 },
  { month: "Dec", temp: 0.5 },
  { month: "Dec", temp: 4.4 },
  { month: "Dec", temp: 8.6 },
  { month: "Dec", temp: 3.7 },
  { month: "Dec", temp: -0.1 },
  { month: "Dec", temp: 0.7 },
  { month: "Dec", temp: 8.4 },
  { month: "Dec", temp: 11.8 },
  { month: "Dec", temp: 6.7 },
  { month: "Dec", temp: 5.1 },
  { month: "Dec", temp: 7.2 },
  { month: "Dec", temp: 3.5 },
  { month: "Dec", temp: 1.7 },
  { month: "Dec", temp: 14.6 },
  { month: "Dec", temp: 2.7 },
  { month: "Dec", temp: 4.4 },
];

<BoxPlot
  theme="paper"
  data={data}
  value="temp"
  group="month"
  orientation="vertical"
  highlight={["Jul", "Aug"]}
  format="{value}°"
  title="Daily mean temperature by month"
  subtitle="°C, 30 readings per month. July and August are highlighted."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "data": [
    { "month": "Jan", "temp": 4.8 },
    { "month": "Jan", "temp": 7.4 },
    { "month": "Jan", "temp": 0.4 },
    { "month": "Jan", "temp": 3.5 },
    { "month": "Jan", "temp": -0.7 },
    { "month": "Jan", "temp": 2 },
    { "month": "Jan", "temp": -1.4 },
    { "month": "Jan", "temp": 7.2 },
    { "month": "Jan", "temp": 2.7 },
    { "month": "Jan", "temp": 1 },
    { "month": "Jan", "temp": 5.6 },
    { "month": "Jan", "temp": 4.2 },
    { "month": "Jan", "temp": -2.2 },
    { "month": "Jan", "temp": 6.8 },
    { "month": "Jan", "temp": 3.2 },
    { "month": "Jan", "temp": 1.4 },
    { "month": "Jan", "temp": 1.1 },
    { "month": "Jan", "temp": 6.9 },
    { "month": "Jan", "temp": 5.3 },
    { "month": "Jan", "temp": -0.9 },
    { "month": "Jan", "temp": 0.1 },
    { "month": "Jan", "temp": 2.9 },
    { "month": "Jan", "temp": 2 },
    { "month": "Jan", "temp": 1.4 },
    { "month": "Jan", "temp": 8.9 },
    { "month": "Jan", "temp": 4.2 },
    { "month": "Jan", "temp": -0.7 },
    { "month": "Jan", "temp": 4.1 },
    { "month": "Jan", "temp": 7.3 },
    { "month": "Jan", "temp": 1.6 },
    { "month": "Feb", "temp": -2.5 },
    { "month": "Feb", "temp": 4.2 },
    { "month": "Feb", "temp": -4.8 },
    { "month": "Feb", "temp": 4.4 },
    { "month": "Feb", "temp": 2.7 },
    { "month": "Feb", "temp": 3.5 },
    { "month": "Feb", "temp": 3.7 },
    { "month": "Feb", "temp": 3.3 },
    { "month": "Feb", "temp": 5.9 },
    { "month": "Feb", "temp": -1.3 },
    { "month": "Feb", "temp": 0.5 },
    { "month": "Feb", "temp": 1 },
    { "month": "Feb", "temp": -1.2 },
    { "month": "Feb", "temp": -1.1 },
    { "month": "Feb", "temp": 0.3 },
    { "month": "Feb", "temp": -4 },
    { "month": "Feb", "temp": 3.4 },
    { "month": "Feb", "temp": 5.5 },
    { "month": "Feb", "temp": 3.5 },
    { "month": "Feb", "temp": -2.4 },
    { "month": "Feb", "temp": 1.9 },
    { "month": "Feb", "temp": -1.7 },
    { "month": "Feb", "temp": 4.9 },
    { "month": "Feb", "temp": 2 },
    { "month": "Feb", "temp": -1 },
    { "month": "Feb", "temp": -0.4 },
    { "month": "Feb", "temp": -3.4 },
    { "month": "Feb", "temp": 0.2 },
    { "month": "Feb", "temp": -0.7 },
    { "month": "Feb", "temp": 2.2 },
    { "month": "Mar", "temp": 5.9 },
    { "month": "Mar", "temp": 3.9 },
    { "month": "Mar", "temp": 4.4 },
    { "month": "Mar", "temp": 3.1 },
    { "month": "Mar", "temp": 5.9 },
    { "month": "Mar", "temp": 1.3 },
    { "month": "Mar", "temp": 6.5 },
    { "month": "Mar", "temp": -0.6 },
    { "month": "Mar", "temp": 5.3 },
    { "month": "Mar", "temp": 4.7 },
    { "month": "Mar", "temp": 6.1 },
    { "month": "Mar", "temp": 11.6 },
    { "month": "Mar", "temp": 2.9 },
    { "month": "Mar", "temp": 8.4 },
    { "month": "Mar", "temp": 3 },
    { "month": "Mar", "temp": 2.3 },
    { "month": "Mar", "temp": 4.7 },
    { "month": "Mar", "temp": 7.2 },
    { "month": "Mar", "temp": 7.2 },
    { "month": "Mar", "temp": 6.5 },
    { "month": "Mar", "temp": 9.4 },
    { "month": "Mar", "temp": 4.6 },
    { "month": "Mar", "temp": 6.9 },
    { "month": "Mar", "temp": 5.1 },
    { "month": "Mar", "temp": 7.7 },
    { "month": "Mar", "temp": 0.4 },
    { "month": "Mar", "temp": -1.3 },
    { "month": "Mar", "temp": 3.2 },
    { "month": "Mar", "temp": 3.8 },
    { "month": "Mar", "temp": 2 },
    { "month": "Apr", "temp": 11.8 },
    { "month": "Apr", "temp": 7.5 },
    { "month": "Apr", "temp": 8.4 },
    { "month": "Apr", "temp": 8.7 },
    { "month": "Apr", "temp": 11.4 },
    { "month": "Apr", "temp": 9.5 },
    { "month": "Apr", "temp": 9.3 },
    { "month": "Apr", "temp": 8.4 },
    { "month": "Apr", "temp": 6.5 },
    { "month": "Apr", "temp": 10.2 },
    { "month": "Apr", "temp": 12 },
    { "month": "Apr", "temp": 5.8 },
    { "month": "Apr", "temp": 8.6 },
    { "month": "Apr", "temp": 5.1 },
    { "month": "Apr", "temp": 10 },
    { "month": "Apr", "temp": 3.4 },
    { "month": "Apr", "temp": 7.1 },
    { "month": "Apr", "temp": 9.2 },
    { "month": "Apr", "temp": 3 },
    { "month": "Apr", "temp": 10.5 },
    { "month": "Apr", "temp": 8.5 },
    { "month": "Apr", "temp": 7.6 },
    { "month": "Apr", "temp": 15.7 },
    { "month": "Apr", "temp": 7 },
    { "month": "Apr", "temp": 6.3 },
    { "month": "Apr", "temp": 3.7 },
    { "month": "Apr", "temp": 9.9 },
    { "month": "Apr", "temp": 9.4 },
    { "month": "Apr", "temp": 9.2 },
    { "month": "Apr", "temp": 10.4 },
    { "month": "May", "temp": 17.7 },
    { "month": "May", "temp": 12.1 },
    { "month": "May", "temp": 13.1 },
    { "month": "May", "temp": 12.9 },
    { "month": "May", "temp": 12 },
    { "month": "May", "temp": 14.8 },
    { "month": "May", "temp": 12.8 },
    { "month": "May", "temp": 14.9 },
    { "month": "May", "temp": 7.6 },
    { "month": "May", "temp": 15.4 },
    { "month": "May", "temp": 13.2 },
    { "month": "May", "temp": 15.7 },
    { "month": "May", "temp": 11.8 },
    { "month": "May", "temp": 18.8 },
    { "month": "May", "temp": 14.9 },
    { "month": "May", "temp": 14 },
    { "month": "May", "temp": 11.6 },
    { "month": "May", "temp": 13.5 },
    { "month": "May", "temp": 20 },
    { "month": "May", "temp": 20.7 },
    { "month": "May", "temp": 9.1 },
    { "month": "May", "temp": 18.5 },
    { "month": "May", "temp": 13.5 },
    { "month": "May", "temp": 7.8 },
    { "month": "May", "temp": 17.1 },
    { "month": "May", "temp": 15.8 },
    { "month": "May", "temp": 11 },
    { "month": "May", "temp": 10.1 },
    { "month": "May", "temp": 13.4 },
    { "month": "May", "temp": 11.7 },
    { "month": "Jun", "temp": 19.4 },
    { "month": "Jun", "temp": 17 },
    { "month": "Jun", "temp": 21.7 },
    { "month": "Jun", "temp": 20.9 },
    { "month": "Jun", "temp": 19.9 },
    { "month": "Jun", "temp": 20.9 },
    { "month": "Jun", "temp": 19.1 },
    { "month": "Jun", "temp": 15.5 },
    { "month": "Jun", "temp": 15.2 },
    { "month": "Jun", "temp": 16.1 },
    { "month": "Jun", "temp": 18.7 },
    { "month": "Jun", "temp": 13.3 },
    { "month": "Jun", "temp": 19.4 },
    { "month": "Jun", "temp": 15.3 },
    { "month": "Jun", "temp": 16.1 },
    { "month": "Jun", "temp": 17.8 },
    { "month": "Jun", "temp": 20.4 },
    { "month": "Jun", "temp": 16.7 },
    { "month": "Jun", "temp": 15.8 },
    { "month": "Jun", "temp": 17.8 },
    { "month": "Jun", "temp": 19.2 },
    { "month": "Jun", "temp": 18.2 },
    { "month": "Jun", "temp": 18.9 },
    { "month": "Jun", "temp": 16.7 },
    { "month": "Jun", "temp": 14.1 },
    { "month": "Jun", "temp": 19 },
    { "month": "Jun", "temp": 20.7 },
    { "month": "Jun", "temp": 17.5 },
    { "month": "Jun", "temp": 18.4 },
    { "month": "Jun", "temp": 19.2 },
    { "month": "Jul", "temp": 20.7 },
    { "month": "Jul", "temp": 21.8 },
    { "month": "Jul", "temp": 25 },
    { "month": "Jul", "temp": 17.2 },
    { "month": "Jul", "temp": 19.6 },
    { "month": "Jul", "temp": 15 },
    { "month": "Jul", "temp": 19.4 },
    { "month": "Jul", "temp": 22.4 },
    { "month": "Jul", "temp": 22.3 },
    { "month": "Jul", "temp": 24.7 },
    { "month": "Jul", "temp": 23.7 },
    { "month": "Jul", "temp": 18.2 },
    { "month": "Jul", "temp": 21.1 },
    { "month": "Jul", "temp": 20.1 },
    { "month": "Jul", "temp": 21.8 },
    { "month": "Jul", "temp": 20.7 },
    { "month": "Jul", "temp": 17.8 },
    { "month": "Jul", "temp": 21.5 },
    { "month": "Jul", "temp": 21.8 },
    { "month": "Jul", "temp": 19.2 },
    { "month": "Jul", "temp": 15.1 },
    { "month": "Jul", "temp": 22.6 },
    { "month": "Jul", "temp": 11.8 },
    { "month": "Jul", "temp": 24.5 },
    { "month": "Jul", "temp": 18.2 },
    { "month": "Jul", "temp": 22.1 },
    { "month": "Jul", "temp": 22.8 },
    { "month": "Jul", "temp": 18.1 },
    { "month": "Jul", "temp": 21.1 },
    { "month": "Jul", "temp": 23.8 },
    { "month": "Aug", "temp": 17.2 },
    { "month": "Aug", "temp": 23.6 },
    { "month": "Aug", "temp": 19 },
    { "month": "Aug", "temp": 21.7 },
    { "month": "Aug", "temp": 20.2 },
    { "month": "Aug", "temp": 16.6 },
    { "month": "Aug", "temp": 20.8 },
    { "month": "Aug", "temp": 22.4 },
    { "month": "Aug", "temp": 19 },
    { "month": "Aug", "temp": 19.5 },
    { "month": "Aug", "temp": 15.4 },
    { "month": "Aug", "temp": 22.6 },
    { "month": "Aug", "temp": 20.4 },
    { "month": "Aug", "temp": 24 },
    { "month": "Aug", "temp": 20.8 },
    { "month": "Aug", "temp": 18.6 },
    { "month": "Aug", "temp": 19.6 },
    { "month": "Aug", "temp": 16.5 },
    { "month": "Aug", "temp": 28.4 },
    { "month": "Aug", "temp": 15.4 },
    { "month": "Aug", "temp": 26.7 },
    { "month": "Aug", "temp": 25.1 },
    { "month": "Aug", "temp": 22.6 },
    { "month": "Aug", "temp": 22 },
    { "month": "Aug", "temp": 17.2 },
    { "month": "Aug", "temp": 23.3 },
    { "month": "Aug", "temp": 21.1 },
    { "month": "Aug", "temp": 17.8 },
    { "month": "Aug", "temp": 18.3 },
    { "month": "Aug", "temp": 20.3 },
    { "month": "Sep", "temp": 14.7 },
    { "month": "Sep", "temp": 19.6 },
    { "month": "Sep", "temp": 16.6 },
    { "month": "Sep", "temp": 13.2 },
    { "month": "Sep", "temp": 13.4 },
    { "month": "Sep", "temp": 15.8 },
    { "month": "Sep", "temp": 17.5 },
    { "month": "Sep", "temp": 16.7 },
    { "month": "Sep", "temp": 16.9 },
    { "month": "Sep", "temp": 19.4 },
    { "month": "Sep", "temp": 21 },
    { "month": "Sep", "temp": 20.8 },
    { "month": "Sep", "temp": 10.9 },
    { "month": "Sep", "temp": 13.7 },
    { "month": "Sep", "temp": 22.3 },
    { "month": "Sep", "temp": 22.6 },
    { "month": "Sep", "temp": 23.3 },
    { "month": "Sep", "temp": 23.3 },
    { "month": "Sep", "temp": 21.4 },
    { "month": "Sep", "temp": 19.8 },
    { "month": "Sep", "temp": 22 },
    { "month": "Sep", "temp": 20.5 },
    { "month": "Sep", "temp": 21.2 },
    { "month": "Sep", "temp": 18.4 },
    { "month": "Sep", "temp": 12.8 },
    { "month": "Sep", "temp": 10.6 },
    { "month": "Sep", "temp": 21.2 },
    { "month": "Sep", "temp": 12.2 },
    { "month": "Sep", "temp": 17.1 },
    { "month": "Sep", "temp": 16.8 },
    { "month": "Oct", "temp": 13.3 },
    { "month": "Oct", "temp": 16.5 },
    { "month": "Oct", "temp": 9.8 },
    { "month": "Oct", "temp": 10.3 },
    { "month": "Oct", "temp": 10.6 },
    { "month": "Oct", "temp": 12.8 },
    { "month": "Oct", "temp": 10.2 },
    { "month": "Oct", "temp": 17.7 },
    { "month": "Oct", "temp": 14 },
    { "month": "Oct", "temp": 15.1 },
    { "month": "Oct", "temp": 15.1 },
    { "month": "Oct", "temp": 14.4 },
    { "month": "Oct", "temp": 18.1 },
    { "month": "Oct", "temp": 17.6 },
    { "month": "Oct", "temp": 10 },
    { "month": "Oct", "temp": 8.4 },
    { "month": "Oct", "temp": 11.4 },
    { "month": "Oct", "temp": 17.2 },
    { "month": "Oct", "temp": 17.1 },
    { "month": "Oct", "temp": 15.7 },
    { "month": "Oct", "temp": 10 },
    { "month": "Oct", "temp": 14.3 },
    { "month": "Oct", "temp": 10 },
    { "month": "Oct", "temp": 14 },
    { "month": "Oct", "temp": 11.2 },
    { "month": "Oct", "temp": 16 },
    { "month": "Oct", "temp": 14.2 },
    { "month": "Oct", "temp": 12.9 },
    { "month": "Oct", "temp": 12.4 },
    { "month": "Oct", "temp": 11.4 },
    { "month": "Nov", "temp": 10.9 },
    { "month": "Nov", "temp": 11.5 },
    { "month": "Nov", "temp": 12.1 },
    { "month": "Nov", "temp": 10.2 },
    { "month": "Nov", "temp": 4.7 },
    { "month": "Nov", "temp": 11.6 },
    { "month": "Nov", "temp": 13 },
    { "month": "Nov", "temp": 7.7 },
    { "month": "Nov", "temp": 7.2 },
    { "month": "Nov", "temp": 9.6 },
    { "month": "Nov", "temp": 17.7 },
    { "month": "Nov", "temp": 7.7 },
    { "month": "Nov", "temp": 4.8 },
    { "month": "Nov", "temp": 8.5 },
    { "month": "Nov", "temp": 9 },
    { "month": "Nov", "temp": 5.4 },
    { "month": "Nov", "temp": 8.2 },
    { "month": "Nov", "temp": 10.1 },
    { "month": "Nov", "temp": 9 },
    { "month": "Nov", "temp": 5.3 },
    { "month": "Nov", "temp": 1.5 },
    { "month": "Nov", "temp": 7.8 },
    { "month": "Nov", "temp": 10.2 },
    { "month": "Nov", "temp": 7.6 },
    { "month": "Nov", "temp": 8.1 },
    { "month": "Nov", "temp": 9.4 },
    { "month": "Nov", "temp": 11.4 },
    { "month": "Nov", "temp": 13.4 },
    { "month": "Nov", "temp": 16 },
    { "month": "Nov", "temp": 4.2 },
    { "month": "Dec", "temp": 3.8 },
    { "month": "Dec", "temp": 9.8 },
    { "month": "Dec", "temp": 3.4 },
    { "month": "Dec", "temp": 7.3 },
    { "month": "Dec", "temp": 7.9 },
    { "month": "Dec", "temp": 7.3 },
    { "month": "Dec", "temp": 3.4 },
    { "month": "Dec", "temp": 1.7 },
    { "month": "Dec", "temp": 4.2 },
    { "month": "Dec", "temp": -0.9 },
    { "month": "Dec", "temp": 3.5 },
    { "month": "Dec", "temp": -2.6 },
    { "month": "Dec", "temp": 6.7 },
    { "month": "Dec", "temp": 5.9 },
    { "month": "Dec", "temp": 0.5 },
    { "month": "Dec", "temp": 4.4 },
    { "month": "Dec", "temp": 8.6 },
    { "month": "Dec", "temp": 3.7 },
    { "month": "Dec", "temp": -0.1 },
    { "month": "Dec", "temp": 0.7 },
    { "month": "Dec", "temp": 8.4 },
    { "month": "Dec", "temp": 11.8 },
    { "month": "Dec", "temp": 6.7 },
    { "month": "Dec", "temp": 5.1 },
    { "month": "Dec", "temp": 7.2 },
    { "month": "Dec", "temp": 3.5 },
    { "month": "Dec", "temp": 1.7 },
    { "month": "Dec", "temp": 14.6 },
    { "month": "Dec", "temp": 2.7 },
    { "month": "Dec", "temp": 4.4 }
  ],
  "value": "temp",
  "group": "month",
  "orientation": "vertical",
  "highlight": ["Jul", "Aug"],
  "format": "{value}°",
  "title": "Daily mean temperature by month",
  "subtitle": "°C, 30 readings per month. July and August are highlighted.",
  "note": "Illustrative data",
  "type": "box-plot"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to summarise. Pass raw rows; quartiles are computed in the chart. |
| `group` | `string` |  | Category field: one box per distinct value. Omit for a single box. |
| `label` | `string` |  | Field naming each row, shown when hovering an outlier. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal leaves room for long names; vertical suits ordered categories. |
| `whiskers` | `"tukey" \| "minmax"` | `"tukey"` | `tukey`: furthest point within 1.5 × IQR, the rest drawn as outliers. `minmax`: the extremes. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order boxes by median. |

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/box-plot.md
- Component reference with every example: https://insightcharts.dev/llms/box-plot.md
- Registry item: https://insightcharts.dev/r/box-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/box-plot.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/box-plot#example-vertical-ordered-categories
- These instructions as plain text: https://insightcharts.dev/agents/atoms/box-plot/vertical-ordered-categories.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
