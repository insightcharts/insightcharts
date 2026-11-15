# Render a first InsightCharts chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: One chart of the user's data renders with a title that states one fact, a subtitle, a source and a highlight.

Draw the user's data as one chart. If the user has not given you the data and the one fact the chart should show, ask for both before writing code.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Install the package if it is not in `package.json`:

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

2. Read the data. Work out the fact to state, with its number and period, from the rows. Never invent a number.
3. Pick the form: `BarChart` to rank or compare categories, `LineChart` for change over five or more periods, `BigNumber` for one statistic. For anything else read `https://insightcharts.dev/agents/atoms.md`.
4. Write the chart with the four groups of props below.
5. Render it and run the checks under "Verify".

## The four groups of props on every chart

1. Data: `data` is rows, CSV text, a URL or a function. `transform` reshapes it first.
2. Fields: `x`, `y`, `series` and similar props are field names as strings. There are no accessor functions.
3. Text: `title` is one plain statement of what the data shows, with the number and the period, or a plain label such as "Monthly churn, 2024". `subtitle` names the measure, unit, population and period. `source` names where the data is from. `note` holds caveats.
4. Emphasis: `highlight` names the entity the title is about. The other series are drawn in grey. `annotations` mark a date, a threshold or one value.

The chart fills the width of its container. `height` defaults to 360 pixels, except on charts that grow with their rows. Pass `height` to fix it, or `aspect` (width divided by height). Wide data uses `y={["a", "b"]}`. Long data uses `y="value" series="group"`.

## Number formats

`format` sets how values print on labels, axes and tooltips.

| `format` | 1234.5 prints as |
|---|---|
| `"auto"` (default) | 1,234.5 (compact from 10,000) |
| `"compact"` | 1.2K |
| `"integer"` | 1,235 |
| `"decimal:2"` | 1,234.50 |
| `"signed"` | +1,234.5 |
| `"currency:USD"` | $1.2K |
| `"percent"` | expects a ratio: 0.42 prints as 42% |
| `"percent-raw"` | expects a percentage: 42 prints as 42% |
| `"year"` | 1235, with no thousands separator |
| `"{value} kg"` | 1,234.5 kg |

`format` also takes `Intl.NumberFormat` options, or a function in a client file.

## One statistic

```tsx
import { BigNumber } from "insightcharts";

<BigNumber value={0.317} format="percent" label="Share of global electricity from renewables" delta={0.021} deltaLabel="vs 2023" context="Up from 19% in 2010" size="hero" />
```

A numeric `delta` is a fraction shown as a signed percentage: `0.021` prints as +2.1%. `BigNumber` is an HTML component. It does not take `data`, `title` or the other chart props.

## Defaults for a whole section

Charts work with no provider. `InsightProvider` sets defaults for everything inside it, and providers nest.

| Prop | Default | Purpose |
|---|---|---|
| `theme` | the default theme | A theme name, a theme, or partial tokens merged over the parent theme. |
| `mode` | `"auto"` | `"auto"`, `"system"`, `"light"` or `"dark"`. |
| `renderer` | `"auto"` | `"svg"`, `"canvas"` or `"auto"`. |
| `locale` | `"en-US"` | BCP 47 locale for numbers and dates. Do not read it from `navigator.language` during render. |
| `animate` | `true` | Set false to disable animation. Reduced-motion preferences are always respected. |
| `exportable` | `false` | Show the export menu on every figure. |
| `lazy` | `true` | Create each chart when it scrolls near the viewport. |

## Minimal example

```tsx
import { BarChart, InsightProvider } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
  { country: "Germany", share: 52 },
  { country: "United States", share: 23 },
];

export function Renewables() {
  return (
    <InsightProvider locale="en-GB">
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
    </InsightProvider>
  );
}
```

## Verify

1. The project's typecheck passes.
2. The chart renders with its title, subtitle, value labels and source line.
3. The number in the title matches the data.
4. At about 380px wide and in dark mode no label is clipped or overlapping.

## Common mistakes

- Passing an accessor function such as `x={(d) => d.country}`. Pass the field name.
- Using `"percent"` on whole numbers. 42 prints as 4,200%. Use `"percent-raw"` or `"{value}%"`.
- Writing a title with two clauses or without a number.
- Setting a colour for each bar or line. Use `highlight`.
- Giving `BigNumber` chart props such as `title` or `data`.
- Using a gauge or a one-slice donut for one number. Use `BigNumber`.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/quickstart.md
- This page: https://insightcharts.dev/docs/quickstart
- These instructions as plain text: https://insightcharts.dev/agents/docs/quickstart.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
