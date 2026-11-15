---
name: insightcharts
description: Build charts, infographic posters and data stories in React with the InsightCharts library (Apache ECharts 6). Use when the user has data and wants a chart, a single statistic, an annotated figure, a dashboard of linked charts, a scroll-driven visual essay, an infographic or data poster, or a JSON chart spec, or when the project already imports "insightcharts" or has components under components/insightcharts.
license: Apache-2.0
---

# InsightCharts

InsightCharts is a React library of charts, figures and page layouts. A finished figure has a title that states one fact with its number, one highlighted series, direct labels and a source line. Components come in three levels: atoms (one chart or figure), molecules (a few atoms combined) and templates (a whole page). Every component can be written as JSX or as a JSON spec.

The Infographics set is the templates with category `infographic`. Each one draws a designed poster: a painted background, a large title, little other text and large graphics. Posters are composed on the `poster` molecule from the poster primitives (atoms with category `poster`). See "Infographics" below.

Use only component names and props that appear in `references/components.md`. Do not invent components. If no form fits, see "When nothing fits".

## Workflow

### 1. Find the fact

Before choosing a chart, look at the data and write down the one fact the chart should show, with its number and its period: "Solar's share rose from 2.7% to 5.5% between 2019 and 2023". This becomes `title`. Work the number out from the rows. Never invent one. If the data has no single fact to state, use a plain label: "Solar and wind share of electricity, 2019 to 2023". If you do not know what the user wants to show, ask.

### 2. Pick the form

Match what the data has to show to a component using the decision table at the top of `references/components.md`. Read the candidate's "use it when" and "pick something else when" columns. Defaults that are usually right:

- one figure: `big-number` (never a gauge or a one-slice donut)
- ranking or comparing categories: `bar-chart`
- change over time with five or more points: `line-chart`

Check whether a molecule or template already covers what you need before composing atoms by hand. When the user asks for an infographic, a poster or one shareable image, go to "Infographics" below.

### 3. Load the data

Pass `data` and name fields as strings (`x`, `y`, `series`). Accepted: row objects, column arrays, CSV text, a URL, `{ url, path, format }`, `{ csv }`, `{ json }`, an Arrow-style table, or an async function. Wide data uses `y={["a", "b"]}`. Long data uses `y="value" series="group"`.

Reshape with `transform` (JSON, applied in order): `filter`, `aggregate`, `sort`, `limit`, `top`, `fold`, `pivot`, `bin`, `derive`, `rename`, `select`, `parse`. Details and every option: `references/data.md`.

Format numbers with `format`: `"compact"`, `"percent"` (0.42 becomes 42%), `"percent-raw"` (42 becomes 42%), `"currency:USD"`, `"integer"`, `"decimal:2"`, `"signed"`, `"year"`, or a template such as `"{value} kg"`.

### 4. Write the text

On every chart:

- `title`: one plain statement of what the data shows, with the number and the period. See "Writing titles and text" below.
- `subtitle`: the measure, unit, population and period ("Share of electricity generation, 2023").
- `source`: where the data is from. Always set it. Use `note` for caveats, and say so if data is illustrative.

### 5. Highlight

Set `highlight` to the one or two entities the title is about. The other series are drawn in grey. The key is the series key (a field name in wide data, a `series` value in long data) or, for a single-series bar chart, the category label. Do not set colours per series. Colour comes from the theme.

### 6. Annotate

`annotations` mark a date, a threshold or a single value on the chart. They are JSON in data coordinates:

```tsx
annotations={[
  { type: "line", axis: "x", value: "2020", label: "Pandemic" },
  { type: "band", axis: "y", from: 40, to: 60, label: "Target range" },
  { type: "point", x: "2023", y: 5.5, label: "5.5% in 2023" },
]}
```

Use two or three at most. Values must match the data's x values. Labels are plain: name the event or give the value.

### 7. Compose

- Several figures on one subject: use a molecule or template from the catalogue if one fits. Otherwise lay atoms out with CSS grid (`minmax(0, 1fr)` columns so charts can shrink).
- Linked charts: wrap in `<InsightData data={rows}>`, omit `data` on the charts, add `select` to the chart readers click. A click filters the other charts.
- A sequence of steps: `<Scrolly steps={[{ content, ...state }]}>{({ step }) => <Chart .../>}</Scrolly>`. Keep the same chart mounted and change one prop per step.

### 8. Verify

1. Typecheck. Props are typed, so a misspelt prop is an error in JSX.
2. For specs, validate against the JSON Schema (`https://insightcharts.dev/schema/insight-spec.json`).
3. Look at it rendered if you can: at desktop width, at about 380px wide, and in dark mode. Check for clipped or overlapping labels.
4. Run the checklist under "Review" below.

## Writing titles and text

These rules apply to every `title`, `subtitle`, deck, callout, annotation label and story step you write. They are hard requirements.

Write one plain statement of fact, the way a person would say it out loud, with the real numbers and the period in it.

| Write this | Not this |
|---|---|
| Monthly churn fell from 4.2% to 2.1% in 2024 | Churn halved after the March onboarding revamp, and the gain has held for six months |
| Renewables supplied 98% of Norway's electricity in 2023 | Norway runs almost entirely on renewable electricity |
| Acme had 266 active teams in December 2024, 2.4 times Globex | Acme pulled away from the pack in late 2023 |
| Solar's share rose from 2.7% to 5.5% between 2019 and 2023 | Solar is closing the gap with wind |
| Households wasted 631 million tonnes of food in 2022 | It is not a rich-country habit |

- One clause. Do not add a second half joined with a comma, "and", "but", "while", "yet", a semicolon, a colon or a dash that adds a twist, a consequence or a follow-up. If there are two facts, write two sentences or put the second in the subtitle.
- Put the number in. Write "fell from 4.2% to 2.1%", not "halved". Write "98%", not "almost entirely". Write "3 of 12", not "a handful".
- Take every number from the data. Never invent a figure, a cause or an event that the data does not show.
- No metaphor, idiom or figure of speech. Do not write "pulled away from the pack", "closing the gap", "tells the story", "the long tail" or "did the work".
- No teasing. Do not point at something the reader has to work out, such as "one hospital explains most of it" or "here is where it goes".
- No dramatic verbs (soared, plunged, surged, skyrocketed, slashed). No staged contrast ("not X, but Y").
- No rhetorical questions, no groups of three for rhythm, no sign-off lines.
- A plain label is always acceptable when there is no single fact to state: "Monthly churn, 2024".
- Subtitles name the measure, unit, population and period. Sources name the source.

## Infographics

Choose a poster when the piece is one image that is read in a few seconds and shared as a picture. Choose a report-style template (`executive-brief`, `report-page`, `visual-essay`, `scorecard`) when the reader needs paragraphs, a method note, recommendations or charts with axes. Choose `social-card` for one fact at a fixed social size.

To build a poster from JSON:

1. Pick the infographic template whose "use it when" matches the subject. They are the rows with the job "Lay out a whole poster" in the decision table of `references/components.md`.
2. Write `title` (required) as the poster's one fact with its number. Add `kicker`, `subtitle`, `sources` and `note`.
3. Fill each region prop with a compact config: `data` rows, the field names (`name`, `value`) and a `title` for that panel. The template's entry in `references/components.md` lists its regions and has a complete example. A region also takes a full spec with its own `type`.
4. Pick a poster theme with `theme`: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint` or `sunrise`. Do not set colours. A poster keeps its own colours in dark mode.
5. Set `download: true` when the user wants a PNG. Set `linked: true` to make the marks clickable.

```tsx
import { Insight } from "insightcharts";

<Insight
  spec={{
    type: "count-poster",
    theme: "noir",
    title: "Norland's schools taught 1.84 million pupils in 2025",
    subtitle: "Pupils enrolled in state schools by stage, autumn term 2025.",
    unit: 1000,
    unitLabel: "1,000 people",
    hero: { data: pupils, name: "stage", value: "pupils", title: "820,000 pupils were in primary school" },
    sources: "Norland Ministry of Education, school census 2025",
    download: true,
  }}
/>
```

When no template has the layout, compose one with the `poster` molecule: `{ type: "poster", theme, title, panels: [{ span, title, content: { type: "pill-rank", ... } }], sources }`. `span` is out of 12 columns. Put each panel's heading in the panel's `title`. Use at most about six panels. Prefer poster primitives in panels (the rows with the job "Draw a poster graphic"). They print names and values on the marks and set their own height.

Icon props take a built-in name (`person`, `house`, `car`, `bus`, `bike`, `tree`, `drop`, `bolt`, `wind-turbine`, `solar-panel`, `fish`, `coin`, `book`, `heart` and others) or `"path://..."`. The full list of names and everything else about posters is in the infographics guide: `https://insightcharts.dev/llms/guides/infographics.md`.

A poster becomes one column under 600px wide, in the order of its panels. Order the panels for that reading.

## Minimal example

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

The same as a spec, for when the chart is chosen at runtime:

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "bar-chart", data, x: "country", y: "share", highlight: "Norway", title: "Renewables supplied 98% of Norway's electricity in 2023" }} />
```

## Setup

```bash
npm install insightcharts echarts
```

Peer dependencies: `react` 18+, `react-dom`, `echarts` 6+. No CSS import. To copy component source into the project instead (shadcn registry), add the registry once and then add items. Files land in `components/insightcharts/<level>s/<name>.tsx` and still import the engine from the `insightcharts` package:

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json
npx shadcn@latest add @insightcharts/bar-chart
```

If the project already has `components/insightcharts/`, import from there (the user may have customised them). Otherwise import from `insightcharts`.

## API facts

- Charts (built with `defineChart`) accept the common props: `data`, `transform`, `title`, `subtitle`, `source`, `note`, `height` (default 360), `aspect`, `highlight`, `annotations`, `format`, `legend`, `select`, `onSelect`, `option`, `theme`, `mode`, `renderer`, `animate`, `lazy`, `group`, `exportable`, `table`, `alt`, `id`, `onEvents`, `onReady`, `className`, `style`. HTML components such as `big-number` do not. They take only their own props.
- Field props are strings naming columns. There are no accessor functions.
- Everything is JSON-serialisable except callbacks and the function forms of `data`, `transform`, `format` and `option`.
- Next.js: the main entry is a client module. Importing a chart into a server component and passing plain props works. Function props and `Scrolly` (its child is a function) need a `"use client"` file. `insightcharts/data` (`loadData`, `transformRows`, `parseCsv`) is server-safe.
- Dark mode is automatic (`mode="auto"` reads the page). Do not hard-code colours. Theme with `--ic-*` CSS variables, the `theme` prop, or `shadcnTheme` from `insightcharts/themes`.
- `big-number` numeric `delta` is a fraction shown as a signed percentage (`0.12` is +12%).
- `"percent"` expects fractions. `"percent-raw"` expects whole numbers.
- `exportable` adds an export menu (PNG, SVG, PDF, CSV by default). `table` adds a "View data" table.
- `download: true` on `poster` or an infographic template adds a "Download PNG" control that saves the whole poster as one image.
- Poster themes (`posterThemes`, `posterBackgrounds`) are exported from `insightcharts/themes`. Icons (`Icon`, `icons`, `iconNames`, `iconGroups`) are exported from `insightcharts`.
- `option` deep-merges an ECharts option over the generated one. Use it last.
- Bars always start at zero. Lines do not start at zero unless `zero` or `area` is set on `line-chart`.

## When nothing fits

In order of preference:

1. Use a simpler form. Most unusual chart requests can be drawn as a ranked bar chart, a line chart with a highlight, or a big number with context.
2. Compose atoms with plain layout.
3. Render a raw ECharts option inside the standard figure frame with `Chart` and `Figure` from `insightcharts/core`:

```tsx
"use client";
import { ScatterChart } from "echarts/charts";
import { Chart, Figure, echarts } from "insightcharts/core";

echarts.use([ScatterChart]); // core registers no series types; register the ones you draw

<Figure title="Price and rating of 40 products" subtitle="Price in USD, rating out of 5" source="Source">
  <Chart option={(ctx) => ({ xAxis: { type: "value" }, yAxis: { type: "value" }, series: [{ type: "scatter", data: points, itemStyle: { color: ctx.tokens.accent } }] })} />
</Figure>
```

`ctx` carries the resolved theme tokens (`ctx.tokens.accent`, `ink`, `grid`, `categorical`, ...), the colour mode and the container size. Use the tokens instead of hex values.

Do not use dual axes, gauges, 3D, or pies with more than five slices.

## Review

- The title is one clause that states one fact with its number and period, or it is a plain label.
- The title has no second half, no figure of speech and nothing the reader has to work out.
- Every number in the text can be found in or computed from the data.
- The subtitle names the measure and period. There is a source.
- One series is highlighted. The others are grey.
- No legend where direct labels already identify the series.
- There are at most three annotations.
- A big number has a comparison, denominator or period.
- The chart can be read without hovering.
- In a scroll story, each step changes exactly one thing.
- A poster has a title with its number, a `sources` line, a poster theme and only built-in icon names.

## References

- `references/components.md`: the decision table, every component with props and an example spec, and the common chart props. Generated from the library's manifest.
- `references/data.md`: every `data` shape and every transform.
- `references/story-design.md`: the writing rules and the design rules in full.
- `references/recipes.md`: complete patterns (ranking with a highlight, top-N plus Other, indexed growth, stat row, server loading, specs).

Online: `https://insightcharts.dev/llms.txt` indexes a markdown page per component and guides on theming, crossfiltering, Scrolly, infographics, export and the JSON spec.

Each page of the site also has a self-contained prompt for one job, at the page's path under `/agents` with `.md` added:

- One component, with its props, data shape, a working example, the rules for its form and a checklist: `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`, for example `https://insightcharts.dev/agents/atoms/bar-chart.md`.
- How to choose within a level: `https://insightcharts.dev/agents/atoms.md`, `molecules.md`, `templates.md` and `infographics.md`.
- One guide as executable steps: `https://insightcharts.dev/agents/docs/<guide>.md` (`installation`, `quickstart`, `data`, `theming`, `crossfiltering`, `stories`, `templates`, `infographics`, `export`, `json-spec`).
- Ready-made prompts for common jobs (a chart from a CSV, a KPI row, an executive brief, a scroll story, a cross-filtered explorer, a poster, a brand theme, converting a Recharts or Chart.js chart): `https://insightcharts.dev/agents/docs/agents/prompts.md`.
