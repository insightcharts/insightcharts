<img src="https://raw.githubusercontent.com/insightcharts/insightcharts/main/apps/docs/public/logo.svg" width="72" height="72" alt="The InsightCharts logo: a red-orange circle with a lower-case i cut into it.">

# insightcharts

A React library of charts, figures, page layouts and infographic posters built on Apache ECharts 6. It has 100 components: 61 atoms, 19 molecules and 20 templates. 10 of the templates are infographics.

You pass data, name the fields, write a title that states one fact with its number, and name the series to highlight. The component handles loading and reshaping the data, scales, direct labels, the legend, light and dark mode, the source line, alt text, loading and error states, and export.

## Install

```bash
npm install insightcharts echarts
```

Peer dependencies: `react` 18 or later, `react-dom`, `echarts` 6 or later. No CSS import is needed.

## Use

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

The same chart as JSON, for when it is chosen at runtime:

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "bar-chart", data, x: "country", y: "share", title: "Renewables supplied 98% of Norway's electricity in 2023" }} />
```

## What every chart accepts

- `data`: row objects, column arrays, CSV text, a URL, `{ url, path, format }`, `{ csv }`, `{ json }`, an Arrow-style table (anything with `toArray()`), or an async function.
- `transform`: one or more JSON steps: `filter`, `aggregate`, `sort`, `limit`, `top`, `fold`, `pivot`, `bin`, `derive`, `rename`, `select`, `parse`. A function is also accepted.
- `title`, `subtitle`, `source`, `note`: the text around the chart. Write `title` as one plain statement with the number and the period, or as a plain label.
- `highlight`: the entity or entities to emphasise; the rest is drawn in grey.
- `annotations`: reference lines, shaded bands and point callouts in data coordinates.
- `format`: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, `Intl.NumberFormat` options, or a function.
- `select`, `onSelect`: click-to-filter, shared between charts inside `<InsightData>`.
- `theme`, `mode`: tokens and colour mode. `mode="auto"` (the default) follows the page.
- `exportable`, `table`: an export menu and a "View data" table.
- `option`: an ECharts option deep-merged over the generated one.

HTML components such as `BigNumber` take only their own props.

## Infographics

10 templates draw one designed poster each: `atlas-poster`, `count-poster`, `flow-poster`, `matrix-poster`, `network-poster`, `profile-poster`, `radial-poster`, `ranking-poster`, `scale-poster` and `timeline-poster`. They are composed on the `Poster` molecule from 19 poster primitives such as `UnitBlocks`, `PillRank` and `ScaleLadder`.

```tsx
import { Poster } from "insightcharts";

<Poster
  theme="forest"
  title="Tarn Valley buses carried 9.6 million passengers in 2025"
  panels={[{ title: "Route 4 carried 2.3 million passengers", content: { type: "pill-rank", data: routes, name: "route", value: "k", highlight: "Route 4" } }]}
  sources="Tarn Valley Transport Authority"
  download
/>
```

- `theme` takes one of eight poster themes: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. A poster paints its own ground and has the same colours in light and dark mode.
- `download` adds a control that saves the whole poster as one PNG.
- Icon props take one of 69 built-in names or a `path://` string. `Icon` draws one as inline SVG.
- A poster becomes one column when it is under 600px wide.

## Entry points

| Import | Contents |
|---|---|
| `insightcharts` | Everything: components, `Insight`, `InsightData`, `InsightProvider`, `Scrolly`, core and data helpers. |
| `insightcharts/core` | The engine: `defineChart`, `Chart`, `Figure`, theme, colour mode, export, annotations, the spec registry, the icons (`Icon`, `icons`, `iconGroups`) and the DOM-to-canvas painter (`rasterize`). |
| `insightcharts/data` | `loadData`, `transformRows`, `parseCsv` and the other data helpers. No React. Safe in server components and Node. |
| `insightcharts/story` | `Scrolly`. |
| `insightcharts/themes` | `defaultTheme`, `shadcnTheme`, the presets `editorialTheme`, `ledgerTheme`, `monoTheme`, `earthTheme`, `scienceTheme`, `posterTheme`, the `themes` record, `themeSurfaces`, `createTheme`, and the poster themes `posterThemes` and `posterBackgrounds`. |
| `insightcharts/manifest.json` | Metadata for every component: description, when to use it, props, example. |

All entry points except `insightcharts/data` are client modules (they begin with `"use client"`). The package is ESM only.

## Theming

The default theme inherits the page font and reads shadcn/ui's `--background`, `--foreground` and `--muted-foreground` when present. Override any colour token with an `--ic-*` CSS variable (`--ic-accent`, `--ic-series-1` to `--ic-series-8`, `--ic-grid`, ...), pass `theme` to a chart or to `InsightProvider`, or use `shadcnTheme` to take series colours from `--chart-1` to `--chart-5`.

## For AI agents

The component manifest ships in the package. The documentation site publishes `llms.txt`, a markdown page per component, a JSON Schema for specs and a shadcn registry; the repository includes an installable agent skill. See the repository README for locations.

## License

Apache-2.0. Copyright © 2026 [Kyle Ledbetter](https://x.com/kyleledbetter).
