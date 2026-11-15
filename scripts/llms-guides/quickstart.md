---
title: Quickstart
description: Install, render a first chart, and the rules for server and client components.
order: 1
---
## Install

```bash
npm install insightcharts echarts
```

`react` (18 or later), `react-dom` and `echarts` (6 or later) are peer dependencies. There is no stylesheet to import: the small amount of CSS the figure chrome needs is injected once at runtime.

To copy component source into your project instead (so you can edit it), use the shadcn registry. The engine still comes from the npm package.

```bash
npx shadcn@latest registry add @insightcharts={{SITE_URL}}/r/{name}.json
npx shadcn@latest add @insightcharts/bar-chart
```

## A first chart

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

Every chart follows the same shape:

1. `data`: rows (or CSV text, a URL, a function; see the data guide).
2. Field names as strings: `x`, `y`, `series`. No accessors, no functions.
3. Text: `title` (one plain statement of what the data shows, with its number and period, or a plain label), `subtitle` (measure, unit, population, period), `source`, `note`. The rules for writing them are in "Choosing a form".
4. Emphasis: `highlight` names the entity the title is about, and the other series are drawn in grey. `annotations` mark a date, a threshold or a single value.

The chart draws its own title, legend, source line, loading skeleton, error message and empty state ("No data to show."). It sizes to its container; `height` defaults to 360, or pass `aspect` (width divided by height).

## The same chart as JSON

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "bar-chart", data, x: "country", y: "share", title: "Renewables supplied 98% of Norway's electricity in 2023" }} />
```

Use JSX when you are writing a page. Use a spec when the chart is chosen at runtime (by an agent, a CMS, an API). See the JSON spec guide.

## Server and client components

- `insightcharts`, `insightcharts/core`, `insightcharts/story` and `insightcharts/themes` are client modules (the built files start with `"use client"`). In Next.js you can import a chart into a server component and pass it serialisable props.
- `insightcharts/data` is server-safe. Load on the server and pass rows down:

```tsx
import { loadData, transformRows } from "insightcharts/data";
import { LineChart } from "insightcharts";

export default async function Page() {
  const rows = await loadData("https://example.com/energy.csv");
  return <LineChart data={rows} x="year" y="solar" title="Solar generation by year" />;
}
```

- Function props (`onSelect`, `onEvents`, `onReady`, a function `option`, a function `format`, a function `transform`, a function `data`) cannot cross the server/client boundary. Put the chart in a file that starts with `"use client"` when you need them.

## Optional provider

Charts work with no provider. `InsightProvider` sets defaults for everything beneath it, and providers nest.

```tsx
import { InsightProvider } from "insightcharts";

<InsightProvider theme={{ accent: "#7c3aed" }} mode="auto" locale="en-GB" exportable>
  {children}
</InsightProvider>
```

Its props: `theme`, `mode` (`"auto"`, `"system"`, `"light"`, `"dark"`), `renderer` (`"auto"`, `"svg"`, `"canvas"`), `locale`, `animate`, `exportable`, `lazy`.

Defaults: `lazy` is true, so a chart mounts when it scrolls within 200px of the viewport. `renderer="auto"` uses SVG up to about 1,500 marks and canvas beyond. Animation is skipped when the reader prefers reduced motion.

## Custom ECharts options

- `option`: an ECharts option deep-merged over the generated one, or a function `(option, ctx) => option`.
- `onReady(chart)` and a ref (`getInstance()`, `getOption()`, `export()`) give you the ECharts instance.
- `Chart` and `Figure` from `insightcharts/core` render a raw ECharts option inside the same figure chrome when no component fits. Core registers no series types itself, so register the ones you draw: `echarts.use([ScatterChart])` with `echarts` from `insightcharts/core` and `ScatterChart` from `echarts/charts`.

## Instructions for one page or one component

Every page of the site has a self-contained prompt written to a coding agent. Its URL is the page's path under `/agents` with `.md` added.

- The whole method and how to choose a form: `{{SITE_URL}}/agents/index.md`
- One guide (install, data, theming and so on): `{{SITE_URL}}/agents/docs/<guide>.md`
- How to choose within a level: `{{SITE_URL}}/agents/atoms.md`, `{{SITE_URL}}/agents/molecules.md`, `{{SITE_URL}}/agents/templates.md`, `{{SITE_URL}}/agents/infographics.md`
- One component, with its props, data shape, example and checklist: `{{SITE_URL}}/agents/<atoms|molecules|templates>/<name>.md`
- Ready-made prompts for common jobs: `{{SITE_URL}}/agents/docs/agents/prompts.md`

## Components

{{COMPONENT_INDEX}}
