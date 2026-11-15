# Convert a Recharts or Chart.js chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Chart to convert: <path of the file, and the component name if the file has several charts>
Fact to show: <one sentence, or leave blank and propose one from the data>
Source of the data: <name of the source>
Remove the old library: <yes, no, or only if nothing else uses it>
```

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Read the existing chart. Write down its chart type, where its data comes from, which field is the category or time axis, which fields are the values, and any reference lines or labels.
3. Choose the InsightCharts component.

| Existing chart | Use |
|---|---|
| Recharts `BarChart`, Chart.js `bar` | `bar-chart` |
| Stacked bars | `bar-chart` with `stack` |
| Recharts `LineChart`, Chart.js `line` | `line-chart` |
| Recharts `AreaChart`, Chart.js `line` with `fill` | `area-chart` |
| Recharts `PieChart`, Chart.js `pie` or `doughnut` with up to five slices | `donut-chart` |
| A pie with more than five slices | `bar-chart` sorted by value |
| Recharts `ScatterChart`, Chart.js `scatter` | `scatter-chart` |
| Recharts `Treemap` | `treemap` |
| Recharts `Sankey` | `sankey-chart` |
| Recharts `FunnelChart` | `funnel-chart` |
| A chart with two y axes | Two charts, or one `line-chart` with both series indexed through a `derive` transform |
| A radial gauge | `big-number` with context, or `progress-meter` |

4. Fetch the instructions for the chosen component: `https://insightcharts.dev/agents/atoms/<name>.md`.
5. Map the data to rows.
   - Recharts already takes an array of row objects. Pass the same array as `data`.
   - Chart.js takes `labels` and `datasets`. Build one row per label: `labels.map((label, i) => ({ label, [datasets[0].label]: datasets[0].data[i] }))`, with one column per dataset.
6. Map the fields to props.
   - Recharts `XAxis dataKey="month"` becomes `x="month"`.
   - Each Recharts `Bar`, `Line` or `Area` `dataKey` becomes an entry of `y`. One series: `y="sales"`. Several: `y={["sales", "costs"]}`.
   - The Recharts `name` of a series becomes an entry in `names`, which maps a field to its display name.
   - Recharts `Pie` `dataKey` and `nameKey` become `value` and `name` on `donut-chart`.
   - Recharts `stackId` and Chart.js `stacked: true` become `stack`.
   - Recharts `layout="vertical"` and Chart.js `indexAxis: "y"` become `orientation="horizontal"`.
7. Drop what the library now does itself.
   - Delete every per-series colour: `fill`, `stroke`, `backgroundColor`, `borderColor`. Colour comes from the theme.
   - Delete `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`, `Legend` and `ResponsiveContainer`. The chart draws its own axes, tooltip and legend and fills its container.
   - Delete Chart.js `options.plugins.title`, `legend` and `scales` settings.
   - Replace tick and tooltip formatter functions with a `format` string: `"compact"`, `"currency:USD"`, `"percent"`, or `"{value} kg"`.
8. Carry over what has meaning.
   - A Recharts `ReferenceLine` becomes `{ type: "line", axis: "y", value, label }` in `annotations`.
   - A Recharts `ReferenceArea` becomes `{ type: "band", axis, from, to, label }`.
   - A highlighted series or bar becomes `highlight`.
   - A fixed height becomes `height`. The default is 360 pixels.
9. Write the text. `title` states one fact from the data with its number and period, in one clause. `subtitle` names the measure, the unit and the period. `source` names the source.
10. Replace the old chart in the file. Remove the old imports.
11. If "Remove the old library" is yes, search the project for other imports of `recharts`, `chart.js` and `react-chartjs-2`. Uninstall a package only when nothing else imports it.

## Example of the result

Before, in Recharts:

```tsx
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={rows}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line dataKey="acme" stroke="#8884d8" />
    <Line dataKey="globex" stroke="#82ca9d" />
  </LineChart>
</ResponsiveContainer>
```

After:

```tsx
import { LineChart } from "insightcharts";

<LineChart
  data={rows}
  x="month"
  y={["acme", "globex"]}
  names={{ acme: "Acme", globex: "Globex" }}
  highlight="acme"
  height={300}
  title="Acme had 266 active teams in December 2024"
  subtitle="Monthly active teams, 2024"
  source="Product analytics"
/>
```

## Verify

- The typecheck passes and no import of the old library remains in the file.
- The new chart shows the same values as the old one. Compare three data points.
- No colour is set on a series.
- The number in the title matches the rows.
- No label is clipped or overlapping at desktop width and at about 380 pixels wide.
- The chart is legible in dark mode.

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/convert-recharts-chartjs.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
