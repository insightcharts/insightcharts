# Go beyond a component's props with ECharts options

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: The chart has the ECharts setting or custom form the user needs, and it still takes its colours, text and behaviour from InsightCharts.

Use this when no prop of a component covers what the user needs. Try the three methods in order and stop at the first that works. If the user has not said what the chart must do that it does not do now, ask.

## Steps

1. Check the component's props first, at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`. Many requests are a prop.
2. Use the `option` prop to patch the ECharts option the component generated.
3. Use `onReady` or `onEvents` when you need the ECharts instance or an event.
4. Only when no component fits, render a raw ECharts option with `Chart` inside `Figure`.

## The option prop

Every chart accepts `option`.

- As an object it is deep-merged over the generated option. It is JSON-serialisable.
- As a function `(option, ctx) => option` it receives the generated option and the build context and returns the option to draw. A function needs a `"use client"` file in Next.js.
- It is applied last, after `highlight` and `annotations`.

Merge rules for the object form:

- Plain objects merge key by key.
- An array of objects merges item by item. `{ series: [{ smooth: true }] }` patches the first series only.
- A single object given where the option holds an array of objects is applied to every item. `{ series: { smooth: true } }` patches all series.
- Scalars and arrays of values are replaced.

Members of `ctx` in the function form:

| Member | Contents |
|---|---|
| `rows` | The data after loading, crossfilter and `transform`. |
| `tokens` | The resolved theme, with concrete colours: `surface`, `ink`, `inkSecondary`, `muted`, `grid`, `axis`, `accent`, `context`, `positive`, `negative`, `categorical`, `sequential`, `diverging`, and the font and size tokens. |
| `mode` | `"light"` or `"dark"`. |
| `onDark` | True when the surface behind the chart is dark. |
| `width`, `height` | Container size in CSS pixels. |
| `compact` | True under 480 pixels wide. |
| `fmt`, `formatter(spec)` | The formatter from `format`, and a factory for others. |
| `color(key, index)`, `dimmed(key)`, `selected(value)` | The colour, highlight and selection helpers the component used. |
| `highlight` | The `highlight` prop as an array. |
| `locale`, `animate` | The locale, and false when animation is off or the reader prefers reduced motion. |

Read colours from `ctx.tokens`. Do not write hex values.

## The ECharts instance and events

```tsx
<BarChart
  onEvents={{
    click: (params) => console.log(params.name, params.value),
    "zr:click": (event) => !event.target && console.log("blank area"),
  }}
  onReady={(chart) => chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: 1 })}
  ...
/>
```

`onReady(chart)` is called once with the instance. `onEvents` binds ECharts events. A name with the `zr:` prefix listens on the canvas itself, which is how to catch a click on the blank area. A ref typed `ChartHandle` gives `getInstance()`, `getOption()` and `export()`.

## Chart and Figure

`Chart` renders any ECharts option with lazy mounting, resizing, theme tokens, dark mode, reduced motion and export. `Figure` adds the title, subtitle and source line.

Already registered with ECharts: both renderers, grid, tooltip, dataset, transform, mark line, mark area, mark point, graphic, aria, label layout and universal transition. Register every series type and any other component you draw, once, with `echarts.use([...])`. Import `echarts` from `insightcharts` so you register on the instance the library uses.

| `Chart` prop | Purpose |
|---|---|
| `option` | An ECharts option, or `(ctx) => option`. Required. |
| `height`, `aspect` | CSS height (default 360), or width divided by height. |
| `renderer`, `markCount` | `"auto"` picks canvas when `markCount` is over 1,500. |
| `theme`, `mode`, `animate`, `lazy`, `group` | As on every chart. |
| `onEvents`, `onReady`, `onContext` | Events, the instance, and the context each time an option is built. |
| `alt` | Accessible description. Write it yourself: `Chart` does not generate one. |
| `exportMeta` | `{ title, subtitle, source, rows }` used by export. |

`Figure` props: `title`, `subtitle`, `source`, `note`, `legend`, `table` with `tableRows`, `exportable`, `theme`, `mode`, `frame`.

## Minimal example

```tsx
"use client";

import { RadarChart } from "echarts/charts";
import { RadarComponent } from "echarts/components";
import { alpha, Chart, echarts, Figure } from "insightcharts";

echarts.use([RadarChart, RadarComponent]);

const axes = ["Speed", "Reliability", "Docs", "Price", "Support"];

export function PlanScores() {
  return (
    <Figure title="The new plan scores 5 of 5 on reliability" subtitle="Internal scoring of two plans on five criteria, 1 to 5" source="Product team review">
      <Chart
        height={300}
        alt="Radar chart of two plans scored from 1 to 5 on five criteria. The new plan scores 5 on reliability and 2 on price. The current plan scores 3 on reliability and 4 on price."
        option={({ tokens }) => ({
          radar: { indicator: axes.map((name) => ({ name, max: 5 })), axisName: { color: tokens.inkSecondary }, splitLine: { lineStyle: { color: tokens.grid } }, splitArea: { show: false } },
          series: [
            {
              type: "radar",
              data: [
                { name: "Current", value: [4, 3, 4, 4, 2], lineStyle: { color: tokens.context }, itemStyle: { color: tokens.context } },
                { name: "New", value: [4, 5, 4, 2, 4], lineStyle: { color: tokens.accent }, itemStyle: { color: tokens.accent }, areaStyle: { color: alpha(tokens.accent, 0.1) } },
              ],
            },
          ],
        })}
      />
    </Figure>
  );
}
```

## A reusable custom chart

If the same custom chart is needed more than once, define a component with `defineChart` from `insightcharts/core`. It takes a pure `build(props, ctx)` function and returns a component with data loading, crossfilter, highlight, annotations, figure text, export and a JSON spec. The contributor guide is `AGENTS.md` in https://github.com/insightcharts/insightcharts, and `packages/insightcharts/src/atoms/bar-chart.tsx` is the reference implementation.

## Verify

1. Typecheck.
2. Render the chart and confirm the override took effect and nothing else changed.
3. Switch to dark mode. Every colour you set must change with the theme. A colour that stays the same is a hard-coded value.
4. Check at about 380px wide.
5. Confirm the chart still reads without hovering.

## Common mistakes

- Replacing the whole `series` array when one key was meant. Use the object or item-by-item form.
- Hex colours in `option` instead of `ctx.tokens`.
- A series type used with `Chart` and never registered with `echarts.use`.
- Importing `echarts` from the `echarts` package for `use`. Import it from `insightcharts`.
- A function `option` passed from a server component.
- Adding a second y axis, a gauge or 3D through `option`. Do not use dual axes, gauges or 3D.
- Reaching for `Chart` when a simpler existing form would do.

## Reference

- This page: https://insightcharts.dev/docs/escape-hatch
- These instructions as plain text: https://insightcharts.dev/agents/docs/escape-hatch.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
