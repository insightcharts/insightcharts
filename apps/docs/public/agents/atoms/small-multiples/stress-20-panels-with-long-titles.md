# Reproduce the "Stress: 20 panels with long titles" example of the InsightCharts Small multiples

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Stress: 20 panels with long titles" example of `small-multiples` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Repeats one small line, area or bar chart per value of a facet field on a shared scale, each panel titled.

Use it when: The same measure for 4 to about 24 entities when one chart would have too many overlapping lines; pair with `highlight` to pick out one panel, or `context` to show every other line faintly behind each.

Pick something else when: Three or fewer series (use line-chart with direct labels); when exact comparison between two entities matters most (use line-chart with `highlight`); a single value per entity (use bar-chart).

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
npx shadcn@latest add @insightcharts/small-multiples
```

The file lands at `components/insightcharts/atoms/small-multiples.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SmallMultiples } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "country": "United States of America", "year": "2013", "index": 100 },
  { "country": "United States of America", "year": "2014", "index": 101 },
  { "country": "United States of America", "year": "2015", "index": 96 }
]
```

How the example maps columns to props:

- `facet` = `"country"`. Field whose values each get a panel.
- `x` = `"year"`. Time or ordered category field, shared by every panel.
- `y` = `"index"`. Value field, or several (one series each in every panel).

With the user's data, keep the props and change the column names.

## 5. The "Stress: 20 panels with long titles" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { country: "United States of America", year: "2013", index: 100 },
  { country: "United States of America", year: "2014", index: 101 },
  { country: "United States of America", year: "2015", index: 96 },
  { country: "United States of America", year: "2016", index: 91 },
  { country: "United States of America", year: "2017", index: 92 },
  { country: "United States of America", year: "2018", index: 87 },
  { country: "United States of America", year: "2019", index: 82 },
  { country: "United States of America", year: "2020", index: 71 },
  { country: "United States of America", year: "2021", index: 80 },
  { country: "United States of America", year: "2022", index: 75 },
  { country: "United States of America", year: "2023", index: 70 },
  { country: "United States of America", year: "2024", index: 73 },
  { country: "China", year: "2013", index: 106 },
  { country: "China", year: "2014", index: 109 },
  { country: "China", year: "2015", index: 112 },
  { country: "China", year: "2016", index: 115 },
  { country: "China", year: "2017", index: 126 },
  { country: "China", year: "2018", index: 129 },
  { country: "China", year: "2019", index: 133 },
  { country: "China", year: "2020", index: 137 },
  { country: "China", year: "2021", index: 150 },
  { country: "China", year: "2022", index: 154 },
  { country: "China", year: "2023", index: 160 },
  { country: "China", year: "2024", index: 172 },
  { country: "Japan", year: "2013", index: 105 },
  { country: "Japan", year: "2014", index: 103 },
  { country: "Japan", year: "2015", index: 101 },
  { country: "Japan", year: "2016", index: 106 },
  { country: "Japan", year: "2017", index: 104 },
  { country: "Japan", year: "2018", index: 102 },
  { country: "Japan", year: "2019", index: 100 },
  { country: "Japan", year: "2020", index: 95 },
  { country: "Japan", year: "2021", index: 103 },
  { country: "Japan", year: "2022", index: 101 },
  { country: "Japan", year: "2023", index: 106 },
  { country: "Japan", year: "2024", index: 104 },
  { country: "Germany", year: "2013", index: 104 },
  { country: "Germany", year: "2014", index: 110 },
  { country: "Germany", year: "2015", index: 118 },
  { country: "Germany", year: "2016", index: 132 },
  { country: "Germany", year: "2017", index: 141 },
  { country: "Germany", year: "2018", index: 151 },
  { country: "Germany", year: "2019", index: 168 },
  { country: "Germany", year: "2020", index: 168 },
  { country: "Germany", year: "2021", index: 193 },
  { country: "Germany", year: "2022", index: 207 },
  { country: "Germany", year: "2023", index: 229 },
  { country: "Germany", year: "2024", index: 246 },
  { country: "India", year: "2013", index: 103 },
  { country: "India", year: "2014", index: 105 },
  { country: "India", year: "2015", index: 113 },
  { country: "India", year: "2016", index: 115 },
  { country: "India", year: "2017", index: 117 },
  { country: "India", year: "2018", index: 119 },
  { country: "India", year: "2019", index: 129 },
  { country: "India", year: "2020", index: 125 },
  { country: "India", year: "2021", index: 134 },
  { country: "India", year: "2022", index: 143 },
  { country: "India", year: "2023", index: 146 },
  { country: "India", year: "2024", index: 150 },
  { country: "United Kingdom of Great Britain", year: "2013", index: 102 },
  { country: "United Kingdom of Great Britain", year: "2014", index: 99 },
  { country: "United Kingdom of Great Britain", year: "2015", index: 103 },
  { country: "United Kingdom of Great Britain", year: "2016", index: 99 },
  { country: "United Kingdom of Great Britain", year: "2017", index: 96 },
  { country: "United Kingdom of Great Britain", year: "2018", index: 100 },
  { country: "United Kingdom of Great Britain", year: "2019", index: 97 },
  { country: "United Kingdom of Great Britain", year: "2020", index: 86 },
  { country: "United Kingdom of Great Britain", year: "2021", index: 91 },
  { country: "United Kingdom of Great Britain", year: "2022", index: 95 },
  { country: "United Kingdom of Great Britain", year: "2023", index: 92 },
  { country: "United Kingdom of Great Britain", year: "2024", index: 89 },
  { country: "France", year: "2013", index: 101 },
  { country: "France", year: "2014", index: 113 },
  { country: "France", year: "2015", index: 119 },
  { country: "France", year: "2016", index: 125 },
  { country: "France", year: "2017", index: 132 },
  { country: "France", year: "2018", index: 147 },
  { country: "France", year: "2019", index: 155 },
  { country: "France", year: "2020", index: 154 },
  { country: "France", year: "2021", index: 180 },
  { country: "France", year: "2022", index: 191 },
  { country: "France", year: "2023", index: 202 },
  { country: "France", year: "2024", index: 215 },
  { country: "Italy", year: "2013", index: 100 },
  { country: "Italy", year: "2014", index: 107 },
  { country: "Italy", year: "2015", index: 108 },
  { country: "Italy", year: "2016", index: 108 },
  { country: "Italy", year: "2017", index: 116 },
  { country: "Italy", year: "2018", index: 117 },
  { country: "Italy", year: "2019", index: 117 },
  { country: "Italy", year: "2020", index: 106 },
  { country: "Italy", year: "2021", index: 126 },
  { country: "Italy", year: "2022", index: 127 },
  { country: "Italy", year: "2023", index: 128 },
  { country: "Italy", year: "2024", index: 136 },
  { country: "Brazil", year: "2013", index: 106 },
  { country: "Brazil", year: "2014", index: 102 },
  { country: "Brazil", year: "2015", index: 97 },
  { country: "Brazil", year: "2016", index: 93 },
  { country: "Brazil", year: "2017", index: 96 },
  { country: "Brazil", year: "2018", index: 92 },
  { country: "Brazil", year: "2019", index: 87 },
  { country: "Brazil", year: "2020", index: 84 },
  { country: "Brazil", year: "2021", index: 86 },
  { country: "Brazil", year: "2022", index: 82 },
  { country: "Brazil", year: "2023", index: 78 },
  { country: "Brazil", year: "2024", index: 82 },
  { country: "Canada", year: "2013", index: 105 },
  { country: "Canada", year: "2014", index: 109 },
  { country: "Canada", year: "2015", index: 113 },
  { country: "Canada", year: "2016", index: 125 },
  { country: "Canada", year: "2017", index: 130 },
  { country: "Canada", year: "2018", index: 136 },
  { country: "Canada", year: "2019", index: 142 },
  { country: "Canada", year: "2020", index: 147 },
  { country: "Canada", year: "2021", index: 162 },
  { country: "Canada", year: "2022", index: 170 },
  { country: "Canada", year: "2023", index: 185 },
  { country: "Canada", year: "2024", index: 194 },
  { country: "Russian Federation", year: "2013", index: 104 },
  { country: "Russian Federation", year: "2014", index: 103 },
  { country: "Russian Federation", year: "2015", index: 102 },
  { country: "Russian Federation", year: "2016", index: 109 },
  { country: "Russian Federation", year: "2017", index: 108 },
  { country: "Russian Federation", year: "2018", index: 107 },
  { country: "Russian Federation", year: "2019", index: 113 },
  { country: "Russian Federation", year: "2020", index: 103 },
  { country: "Russian Federation", year: "2021", index: 112 },
  { country: "Russian Federation", year: "2022", index: 111 },
  { country: "Russian Federation", year: "2023", index: 118 },
  { country: "Russian Federation", year: "2024", index: 117 },
  { country: "Republic of Korea", year: "2013", index: 103 },
  { country: "Republic of Korea", year: "2014", index: 97 },
  { country: "Republic of Korea", year: "2015", index: 99 },
  { country: "Republic of Korea", year: "2016", index: 94 },
  { country: "Republic of Korea", year: "2017", index: 88 },
  { country: "Republic of Korea", year: "2018", index: 83 },
  { country: "Republic of Korea", year: "2019", index: 85 },
  { country: "Republic of Korea", year: "2020", index: 68 },
  { country: "Republic of Korea", year: "2021", index: 76 },
  { country: "Republic of Korea", year: "2022", index: 78 },
  { country: "Republic of Korea", year: "2023", index: 73 },
  { country: "Republic of Korea", year: "2024", index: 69 },
  { country: "Australia", year: "2013", index: 102 },
  { country: "Australia", year: "2014", index: 105 },
  { country: "Australia", year: "2015", index: 115 },
  { country: "Australia", year: "2016", index: 118 },
  { country: "Australia", year: "2017", index: 122 },
  { country: "Australia", year: "2018", index: 132 },
  { country: "Australia", year: "2019", index: 136 },
  { country: "Australia", year: "2020", index: 135 },
  { country: "Australia", year: "2021", index: 146 },
  { country: "Australia", year: "2022", index: 157 },
  { country: "Australia", year: "2023", index: 163 },
  { country: "Australia", year: "2024", index: 168 },
  { country: "Mexico", year: "2013", index: 101 },
  { country: "Mexico", year: "2014", index: 106 },
  { country: "Mexico", year: "2015", index: 104 },
  { country: "Mexico", year: "2016", index: 102 },
  { country: "Mexico", year: "2017", index: 100 },
  { country: "Mexico", year: "2018", index: 105 },
  { country: "Mexico", year: "2019", index: 103 },
  { country: "Mexico", year: "2020", index: 93 },
  { country: "Mexico", year: "2021", index: 106 },
  { country: "Mexico", year: "2022", index: 104 },
  { country: "Mexico", year: "2023", index: 102 },
  { country: "Mexico", year: "2024", index: 100 },
  { country: "Spain", year: "2013", index: 100 },
  { country: "Spain", year: "2014", index: 113 },
  { country: "Spain", year: "2015", index: 121 },
  { country: "Spain", year: "2016", index: 128 },
  { country: "Spain", year: "2017", index: 144 },
  { country: "Spain", year: "2018", index: 154 },
  { country: "Spain", year: "2019", index: 164 },
  { country: "Spain", year: "2020", index: 166 },
  { country: "Spain", year: "2021", index: 196 },
  { country: "Spain", year: "2022", index: 210 },
  { country: "Spain", year: "2023", index: 225 },
  { country: "Spain", year: "2024", index: 249 },
  { country: "Indonesia", year: "2013", index: 106 },
  { country: "Indonesia", year: "2014", index: 108 },
  { country: "Indonesia", year: "2015", index: 109 },
  { country: "Indonesia", year: "2016", index: 111 },
  { country: "Indonesia", year: "2017", index: 120 },
  { country: "Indonesia", year: "2018", index: 122 },
  { country: "Indonesia", year: "2019", index: 125 },
  { country: "Indonesia", year: "2020", index: 122 },
  { country: "Indonesia", year: "2021", index: 137 },
  { country: "Indonesia", year: "2022", index: 139 },
  { country: "Indonesia", year: "2023", index: 142 },
  { country: "Indonesia", year: "2024", index: 153 },
  { country: "Kingdom of the Netherlands", year: "2013", index: 105 },
  { country: "Kingdom of the Netherlands", year: "2014", index: 102 },
  { country: "Kingdom of the Netherlands", year: "2015", index: 99 },
  { country: "Kingdom of the Netherlands", year: "2016", index: 102 },
  { country: "Kingdom of the Netherlands", year: "2017", index: 99 },
  { country: "Kingdom of the Netherlands", year: "2018", index: 96 },
  { country: "Kingdom of the Netherlands", year: "2019", index: 93 },
  { country: "Kingdom of the Netherlands", year: "2020", index: 91 },
  { country: "Kingdom of the Netherlands", year: "2021", index: 94 },
  { country: "Kingdom of the Netherlands", year: "2022", index: 91 },
  { country: "Kingdom of the Netherlands", year: "2023", index: 95 },
  { country: "Kingdom of the Netherlands", year: "2024", index: 92 },
  { country: "Saudi Arabia", year: "2013", index: 104 },
  { country: "Saudi Arabia", year: "2014", index: 109 },
  { country: "Saudi Arabia", year: "2015", index: 115 },
  { country: "Saudi Arabia", year: "2016", index: 128 },
  { country: "Saudi Arabia", year: "2017", index: 135 },
  { country: "Saudi Arabia", year: "2018", index: 143 },
  { country: "Saudi Arabia", year: "2019", index: 158 },
  { country: "Saudi Arabia", year: "2020", index: 159 },
  { country: "Saudi Arabia", year: "2021", index: 176 },
  { country: "Saudi Arabia", year: "2022", index: 187 },
  { country: "Saudi Arabia", year: "2023", index: 205 },
  { country: "Saudi Arabia", year: "2024", index: 218 },
  { country: "Türkiye", year: "2013", index: 103 },
  { country: "Türkiye", year: "2014", index: 103 },
  { country: "Türkiye", year: "2015", index: 111 },
  { country: "Türkiye", year: "2016", index: 111 },
  { country: "Türkiye", year: "2017", index: 112 },
  { country: "Türkiye", year: "2018", index: 113 },
  { country: "Türkiye", year: "2019", index: 120 },
  { country: "Türkiye", year: "2020", index: 111 },
  { country: "Türkiye", year: "2021", index: 122 },
  { country: "Türkiye", year: "2022", index: 130 },
  { country: "Türkiye", year: "2023", index: 131 },
  { country: "Türkiye", year: "2024", index: 132 },
  { country: "Switzerland", year: "2013", index: 102 },
  { country: "Switzerland", year: "2014", index: 98 },
  { country: "Switzerland", year: "2015", index: 100 },
  { country: "Switzerland", year: "2016", index: 96 },
  { country: "Switzerland", year: "2017", index: 92 },
  { country: "Switzerland", year: "2018", index: 95 },
  { country: "Switzerland", year: "2019", index: 90 },
  { country: "Switzerland", year: "2020", index: 74 },
  { country: "Switzerland", year: "2021", index: 82 },
  { country: "Switzerland", year: "2022", index: 85 },
  { country: "Switzerland", year: "2023", index: 81 },
  { country: "Switzerland", year: "2024", index: 78 },
];

<SmallMultiples
  theme="blueprint"
  data={data}
  facet="country"
  x="year"
  y="index"
  kind="area"
  highlight={["India", "Indonesia"]}
  height={560}
  title="Illustrative index for 20 countries, 2013 to 2024"
  subtitle="Index, 2013 = 100. All panels share the same axes."
  note="Synthetic data for layout testing."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "data": [
    { "country": "United States of America", "year": "2013", "index": 100 },
    { "country": "United States of America", "year": "2014", "index": 101 },
    { "country": "United States of America", "year": "2015", "index": 96 },
    { "country": "United States of America", "year": "2016", "index": 91 },
    { "country": "United States of America", "year": "2017", "index": 92 },
    { "country": "United States of America", "year": "2018", "index": 87 },
    { "country": "United States of America", "year": "2019", "index": 82 },
    { "country": "United States of America", "year": "2020", "index": 71 },
    { "country": "United States of America", "year": "2021", "index": 80 },
    { "country": "United States of America", "year": "2022", "index": 75 },
    { "country": "United States of America", "year": "2023", "index": 70 },
    { "country": "United States of America", "year": "2024", "index": 73 },
    { "country": "China", "year": "2013", "index": 106 },
    { "country": "China", "year": "2014", "index": 109 },
    { "country": "China", "year": "2015", "index": 112 },
    { "country": "China", "year": "2016", "index": 115 },
    { "country": "China", "year": "2017", "index": 126 },
    { "country": "China", "year": "2018", "index": 129 },
    { "country": "China", "year": "2019", "index": 133 },
    { "country": "China", "year": "2020", "index": 137 },
    { "country": "China", "year": "2021", "index": 150 },
    { "country": "China", "year": "2022", "index": 154 },
    { "country": "China", "year": "2023", "index": 160 },
    { "country": "China", "year": "2024", "index": 172 },
    { "country": "Japan", "year": "2013", "index": 105 },
    { "country": "Japan", "year": "2014", "index": 103 },
    { "country": "Japan", "year": "2015", "index": 101 },
    { "country": "Japan", "year": "2016", "index": 106 },
    { "country": "Japan", "year": "2017", "index": 104 },
    { "country": "Japan", "year": "2018", "index": 102 },
    { "country": "Japan", "year": "2019", "index": 100 },
    { "country": "Japan", "year": "2020", "index": 95 },
    { "country": "Japan", "year": "2021", "index": 103 },
    { "country": "Japan", "year": "2022", "index": 101 },
    { "country": "Japan", "year": "2023", "index": 106 },
    { "country": "Japan", "year": "2024", "index": 104 },
    { "country": "Germany", "year": "2013", "index": 104 },
    { "country": "Germany", "year": "2014", "index": 110 },
    { "country": "Germany", "year": "2015", "index": 118 },
    { "country": "Germany", "year": "2016", "index": 132 },
    { "country": "Germany", "year": "2017", "index": 141 },
    { "country": "Germany", "year": "2018", "index": 151 },
    { "country": "Germany", "year": "2019", "index": 168 },
    { "country": "Germany", "year": "2020", "index": 168 },
    { "country": "Germany", "year": "2021", "index": 193 },
    { "country": "Germany", "year": "2022", "index": 207 },
    { "country": "Germany", "year": "2023", "index": 229 },
    { "country": "Germany", "year": "2024", "index": 246 },
    { "country": "India", "year": "2013", "index": 103 },
    { "country": "India", "year": "2014", "index": 105 },
    { "country": "India", "year": "2015", "index": 113 },
    { "country": "India", "year": "2016", "index": 115 },
    { "country": "India", "year": "2017", "index": 117 },
    { "country": "India", "year": "2018", "index": 119 },
    { "country": "India", "year": "2019", "index": 129 },
    { "country": "India", "year": "2020", "index": 125 },
    { "country": "India", "year": "2021", "index": 134 },
    { "country": "India", "year": "2022", "index": 143 },
    { "country": "India", "year": "2023", "index": 146 },
    { "country": "India", "year": "2024", "index": 150 },
    { "country": "United Kingdom of Great Britain", "year": "2013", "index": 102 },
    { "country": "United Kingdom of Great Britain", "year": "2014", "index": 99 },
    { "country": "United Kingdom of Great Britain", "year": "2015", "index": 103 },
    { "country": "United Kingdom of Great Britain", "year": "2016", "index": 99 },
    { "country": "United Kingdom of Great Britain", "year": "2017", "index": 96 },
    { "country": "United Kingdom of Great Britain", "year": "2018", "index": 100 },
    { "country": "United Kingdom of Great Britain", "year": "2019", "index": 97 },
    { "country": "United Kingdom of Great Britain", "year": "2020", "index": 86 },
    { "country": "United Kingdom of Great Britain", "year": "2021", "index": 91 },
    { "country": "United Kingdom of Great Britain", "year": "2022", "index": 95 },
    { "country": "United Kingdom of Great Britain", "year": "2023", "index": 92 },
    { "country": "United Kingdom of Great Britain", "year": "2024", "index": 89 },
    { "country": "France", "year": "2013", "index": 101 },
    { "country": "France", "year": "2014", "index": 113 },
    { "country": "France", "year": "2015", "index": 119 },
    { "country": "France", "year": "2016", "index": 125 },
    { "country": "France", "year": "2017", "index": 132 },
    { "country": "France", "year": "2018", "index": 147 },
    { "country": "France", "year": "2019", "index": 155 },
    { "country": "France", "year": "2020", "index": 154 },
    { "country": "France", "year": "2021", "index": 180 },
    { "country": "France", "year": "2022", "index": 191 },
    { "country": "France", "year": "2023", "index": 202 },
    { "country": "France", "year": "2024", "index": 215 },
    { "country": "Italy", "year": "2013", "index": 100 },
    { "country": "Italy", "year": "2014", "index": 107 },
    { "country": "Italy", "year": "2015", "index": 108 },
    { "country": "Italy", "year": "2016", "index": 108 },
    { "country": "Italy", "year": "2017", "index": 116 },
    { "country": "Italy", "year": "2018", "index": 117 },
    { "country": "Italy", "year": "2019", "index": 117 },
    { "country": "Italy", "year": "2020", "index": 106 },
    { "country": "Italy", "year": "2021", "index": 126 },
    { "country": "Italy", "year": "2022", "index": 127 },
    { "country": "Italy", "year": "2023", "index": 128 },
    { "country": "Italy", "year": "2024", "index": 136 },
    { "country": "Brazil", "year": "2013", "index": 106 },
    { "country": "Brazil", "year": "2014", "index": 102 },
    { "country": "Brazil", "year": "2015", "index": 97 },
    { "country": "Brazil", "year": "2016", "index": 93 },
    { "country": "Brazil", "year": "2017", "index": 96 },
    { "country": "Brazil", "year": "2018", "index": 92 },
    { "country": "Brazil", "year": "2019", "index": 87 },
    { "country": "Brazil", "year": "2020", "index": 84 },
    { "country": "Brazil", "year": "2021", "index": 86 },
    { "country": "Brazil", "year": "2022", "index": 82 },
    { "country": "Brazil", "year": "2023", "index": 78 },
    { "country": "Brazil", "year": "2024", "index": 82 },
    { "country": "Canada", "year": "2013", "index": 105 },
    { "country": "Canada", "year": "2014", "index": 109 },
    { "country": "Canada", "year": "2015", "index": 113 },
    { "country": "Canada", "year": "2016", "index": 125 },
    { "country": "Canada", "year": "2017", "index": 130 },
    { "country": "Canada", "year": "2018", "index": 136 },
    { "country": "Canada", "year": "2019", "index": 142 },
    { "country": "Canada", "year": "2020", "index": 147 },
    { "country": "Canada", "year": "2021", "index": 162 },
    { "country": "Canada", "year": "2022", "index": 170 },
    { "country": "Canada", "year": "2023", "index": 185 },
    { "country": "Canada", "year": "2024", "index": 194 },
    { "country": "Russian Federation", "year": "2013", "index": 104 },
    { "country": "Russian Federation", "year": "2014", "index": 103 },
    { "country": "Russian Federation", "year": "2015", "index": 102 },
    { "country": "Russian Federation", "year": "2016", "index": 109 },
    { "country": "Russian Federation", "year": "2017", "index": 108 },
    { "country": "Russian Federation", "year": "2018", "index": 107 },
    { "country": "Russian Federation", "year": "2019", "index": 113 },
    { "country": "Russian Federation", "year": "2020", "index": 103 },
    { "country": "Russian Federation", "year": "2021", "index": 112 },
    { "country": "Russian Federation", "year": "2022", "index": 111 },
    { "country": "Russian Federation", "year": "2023", "index": 118 },
    { "country": "Russian Federation", "year": "2024", "index": 117 },
    { "country": "Republic of Korea", "year": "2013", "index": 103 },
    { "country": "Republic of Korea", "year": "2014", "index": 97 },
    { "country": "Republic of Korea", "year": "2015", "index": 99 },
    { "country": "Republic of Korea", "year": "2016", "index": 94 },
    { "country": "Republic of Korea", "year": "2017", "index": 88 },
    { "country": "Republic of Korea", "year": "2018", "index": 83 },
    { "country": "Republic of Korea", "year": "2019", "index": 85 },
    { "country": "Republic of Korea", "year": "2020", "index": 68 },
    { "country": "Republic of Korea", "year": "2021", "index": 76 },
    { "country": "Republic of Korea", "year": "2022", "index": 78 },
    { "country": "Republic of Korea", "year": "2023", "index": 73 },
    { "country": "Republic of Korea", "year": "2024", "index": 69 },
    { "country": "Australia", "year": "2013", "index": 102 },
    { "country": "Australia", "year": "2014", "index": 105 },
    { "country": "Australia", "year": "2015", "index": 115 },
    { "country": "Australia", "year": "2016", "index": 118 },
    { "country": "Australia", "year": "2017", "index": 122 },
    { "country": "Australia", "year": "2018", "index": 132 },
    { "country": "Australia", "year": "2019", "index": 136 },
    { "country": "Australia", "year": "2020", "index": 135 },
    { "country": "Australia", "year": "2021", "index": 146 },
    { "country": "Australia", "year": "2022", "index": 157 },
    { "country": "Australia", "year": "2023", "index": 163 },
    { "country": "Australia", "year": "2024", "index": 168 },
    { "country": "Mexico", "year": "2013", "index": 101 },
    { "country": "Mexico", "year": "2014", "index": 106 },
    { "country": "Mexico", "year": "2015", "index": 104 },
    { "country": "Mexico", "year": "2016", "index": 102 },
    { "country": "Mexico", "year": "2017", "index": 100 },
    { "country": "Mexico", "year": "2018", "index": 105 },
    { "country": "Mexico", "year": "2019", "index": 103 },
    { "country": "Mexico", "year": "2020", "index": 93 },
    { "country": "Mexico", "year": "2021", "index": 106 },
    { "country": "Mexico", "year": "2022", "index": 104 },
    { "country": "Mexico", "year": "2023", "index": 102 },
    { "country": "Mexico", "year": "2024", "index": 100 },
    { "country": "Spain", "year": "2013", "index": 100 },
    { "country": "Spain", "year": "2014", "index": 113 },
    { "country": "Spain", "year": "2015", "index": 121 },
    { "country": "Spain", "year": "2016", "index": 128 },
    { "country": "Spain", "year": "2017", "index": 144 },
    { "country": "Spain", "year": "2018", "index": 154 },
    { "country": "Spain", "year": "2019", "index": 164 },
    { "country": "Spain", "year": "2020", "index": 166 },
    { "country": "Spain", "year": "2021", "index": 196 },
    { "country": "Spain", "year": "2022", "index": 210 },
    { "country": "Spain", "year": "2023", "index": 225 },
    { "country": "Spain", "year": "2024", "index": 249 },
    { "country": "Indonesia", "year": "2013", "index": 106 },
    { "country": "Indonesia", "year": "2014", "index": 108 },
    { "country": "Indonesia", "year": "2015", "index": 109 },
    { "country": "Indonesia", "year": "2016", "index": 111 },
    { "country": "Indonesia", "year": "2017", "index": 120 },
    { "country": "Indonesia", "year": "2018", "index": 122 },
    { "country": "Indonesia", "year": "2019", "index": 125 },
    { "country": "Indonesia", "year": "2020", "index": 122 },
    { "country": "Indonesia", "year": "2021", "index": 137 },
    { "country": "Indonesia", "year": "2022", "index": 139 },
    { "country": "Indonesia", "year": "2023", "index": 142 },
    { "country": "Indonesia", "year": "2024", "index": 153 },
    { "country": "Kingdom of the Netherlands", "year": "2013", "index": 105 },
    { "country": "Kingdom of the Netherlands", "year": "2014", "index": 102 },
    { "country": "Kingdom of the Netherlands", "year": "2015", "index": 99 },
    { "country": "Kingdom of the Netherlands", "year": "2016", "index": 102 },
    { "country": "Kingdom of the Netherlands", "year": "2017", "index": 99 },
    { "country": "Kingdom of the Netherlands", "year": "2018", "index": 96 },
    { "country": "Kingdom of the Netherlands", "year": "2019", "index": 93 },
    { "country": "Kingdom of the Netherlands", "year": "2020", "index": 91 },
    { "country": "Kingdom of the Netherlands", "year": "2021", "index": 94 },
    { "country": "Kingdom of the Netherlands", "year": "2022", "index": 91 },
    { "country": "Kingdom of the Netherlands", "year": "2023", "index": 95 },
    { "country": "Kingdom of the Netherlands", "year": "2024", "index": 92 },
    { "country": "Saudi Arabia", "year": "2013", "index": 104 },
    { "country": "Saudi Arabia", "year": "2014", "index": 109 },
    { "country": "Saudi Arabia", "year": "2015", "index": 115 },
    { "country": "Saudi Arabia", "year": "2016", "index": 128 },
    { "country": "Saudi Arabia", "year": "2017", "index": 135 },
    { "country": "Saudi Arabia", "year": "2018", "index": 143 },
    { "country": "Saudi Arabia", "year": "2019", "index": 158 },
    { "country": "Saudi Arabia", "year": "2020", "index": 159 },
    { "country": "Saudi Arabia", "year": "2021", "index": 176 },
    { "country": "Saudi Arabia", "year": "2022", "index": 187 },
    { "country": "Saudi Arabia", "year": "2023", "index": 205 },
    { "country": "Saudi Arabia", "year": "2024", "index": 218 },
    { "country": "Türkiye", "year": "2013", "index": 103 },
    { "country": "Türkiye", "year": "2014", "index": 103 },
    { "country": "Türkiye", "year": "2015", "index": 111 },
    { "country": "Türkiye", "year": "2016", "index": 111 },
    { "country": "Türkiye", "year": "2017", "index": 112 },
    { "country": "Türkiye", "year": "2018", "index": 113 },
    { "country": "Türkiye", "year": "2019", "index": 120 },
    { "country": "Türkiye", "year": "2020", "index": 111 },
    { "country": "Türkiye", "year": "2021", "index": 122 },
    { "country": "Türkiye", "year": "2022", "index": 130 },
    { "country": "Türkiye", "year": "2023", "index": 131 },
    { "country": "Türkiye", "year": "2024", "index": 132 },
    { "country": "Switzerland", "year": "2013", "index": 102 },
    { "country": "Switzerland", "year": "2014", "index": 98 },
    { "country": "Switzerland", "year": "2015", "index": 100 },
    { "country": "Switzerland", "year": "2016", "index": 96 },
    { "country": "Switzerland", "year": "2017", "index": 92 },
    { "country": "Switzerland", "year": "2018", "index": 95 },
    { "country": "Switzerland", "year": "2019", "index": 90 },
    { "country": "Switzerland", "year": "2020", "index": 74 },
    { "country": "Switzerland", "year": "2021", "index": 82 },
    { "country": "Switzerland", "year": "2022", "index": 85 },
    { "country": "Switzerland", "year": "2023", "index": 81 },
    { "country": "Switzerland", "year": "2024", "index": 78 }
  ],
  "facet": "country",
  "x": "year",
  "y": "index",
  "kind": "area",
  "highlight": ["India", "Indonesia"],
  "height": 560,
  "title": "Illustrative index for 20 countries, 2013 to 2024",
  "subtitle": "Index, 2013 = 100. All panels share the same axes.",
  "note": "Synthetic data for layout testing.",
  "type": "small-multiples"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `facet` (required) | `string` |  | Field whose values each get a panel. |
| `x` (required) | `string` |  | Time or ordered category field, shared by every panel. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one series each in every panel). |
| `series` | `string` |  | Field that splits rows into series inside each panel (long data). |
| `kind` | `"line" \| "area" \| "bar"` | `"line"` | What each panel draws. Area and bar panels start at zero. |
| `columns` | `number` |  | Preferred number of columns; reduced automatically on narrow containers. |
| `scales` | `"shared" \| "free"` | `"shared"` | Shared value scale across panels, or each panel on its own (say so in the subtitle). |
| `context` | `boolean` | `false` | Draw every other panel's line faintly behind each panel's own. |
| `latest` | `boolean` |  | Print the latest value beside each panel title. Default: on for a single series. |
| `names` | `Record<string, string>` |  | Display names for facet values and series keys. |

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
- Used by: `visual-essay` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/small-multiples.md
- Component reference with every example: https://insightcharts.dev/llms/small-multiples.md
- Registry item: https://insightcharts.dev/r/small-multiples.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/small-multiples.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/small-multiples#example-stress-20-panels-with-long-titles
- These instructions as plain text: https://insightcharts.dev/agents/atoms/small-multiples/stress-20-panels-with-long-titles.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
