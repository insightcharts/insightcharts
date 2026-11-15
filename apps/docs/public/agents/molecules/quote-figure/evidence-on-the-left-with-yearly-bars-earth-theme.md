# Reproduce the "Evidence on the left with yearly bars, earth theme" example of the InsightCharts Quote with figure

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Evidence on the left with yearly bars, earth theme" example of `quote-figure` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A pull-quote paired with the statistic or small chart that backs it up, side by side and stacking in narrow containers.

Use it when: A quotation shown next to the number it refers to: an interview finding with its survey figure, an executive's statement with the metric. One per section.

Pick something else when: A quote with no evidence (use `pull-quote`); a figure that needs axes to read (use `chart-callout` and put the quote in prose); unattributed quotations.

Instructions for the alternatives: `chart-callout` https://insightcharts.dev/agents/molecules/chart-callout.md, `pull-quote` https://insightcharts.dev/agents/atoms/pull-quote.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/quote-figure
```

The file lands at `components/insightcharts/molecules/quote-figure.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { QuoteFigure } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Evidence on the left with yearly bars, earth theme" example

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { QuoteFigure, Sparkline } from "insightcharts";

<QuoteFigure
  theme="earth"
  side="left"
  quote="In the 2023 drought we harvested 2.1 tonnes of wheat per hectare. The five years before that averaged 3.4."
  attribution="Tomás Ferreira"
  role="Wheat farmer, Alentejo"
  stat={{
    value: "2.1 t/ha",
    label: "Wheat yield, 2023",
    delta: "−38%",
    deltaLabel: "vs the 2018 to 2022 average",
  }}
  figure={<Sparkline
    data={[
      { year: "2018", tonnes: 3.5 },
      { year: "2019", tonnes: 3.3 },
      { year: "2020", tonnes: 3.6 },
      { year: "2021", tonnes: 3.2 },
      { year: "2022", tonnes: 3.4 },
      { year: "2023", tonnes: 2.1 },
    ]}
    x="year"
    y="tonnes"
    mark="bar"
    format="{value} t/ha"
  />}
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "earth",
  "side": "left",
  "quote": "In the 2023 drought we harvested 2.1 tonnes of wheat per hectare. The five years before that averaged 3.4.",
  "attribution": "Tomás Ferreira",
  "role": "Wheat farmer, Alentejo",
  "stat": {
    "value": "2.1 t/ha",
    "label": "Wheat yield, 2023",
    "delta": "−38%",
    "deltaLabel": "vs the 2018 to 2022 average"
  },
  "figure": {
    "type": "sparkline",
    "data": [
      { "year": "2018", "tonnes": 3.5 },
      { "year": "2019", "tonnes": 3.3 },
      { "year": "2020", "tonnes": 3.6 },
      { "year": "2021", "tonnes": 3.2 },
      { "year": "2022", "tonnes": 3.4 },
      { "year": "2023", "tonnes": 2.1 }
    ],
    "x": "year",
    "y": "tonnes",
    "mark": "bar",
    "format": "{value} t/ha"
  },
  "note": "Illustrative data",
  "type": "quote-figure"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `stat`, `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`: The statistic that backs the quote up; takes the props of `big-number`. In the example: an object with `value`, `label`, `delta`, `deltaLabel`.
- `figure`, `Slot`: A small chart or figure instead of, or under, the statistic: a spec or a React element. In the example: a `sparkline` spec with 6 rows.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` (required) | `string` |  | The words quoted, without quotation marks. |
| `attribution` | `string` |  | Who said it. |
| `role` | `string` |  | Their role, or where it was said. |
| `cite` | `string` |  | Source URL, linked from the attribution. |
| `stat` | `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }` |  | The statistic that backs the quote up; takes the props of `big-number`. |
| `figure` | `Slot` |  | A small chart or figure instead of, or under, the statistic: a spec or a React element. |
| `side` | `"left" \| "right"` | `"right"` | Side the evidence sits on; under 640px it goes underneath. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the quote and the figure. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `pull-quote` (atom), `big-number` (atom), `sparkline` (atom), `progress-meter` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/quote-figure.md
- Component reference with every example: https://insightcharts.dev/llms/quote-figure.md
- Registry item: https://insightcharts.dev/r/quote-figure.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/quote-figure.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/quote-figure#example-evidence-on-the-left-with-yearly-bars-earth-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/quote-figure/evidence-on-the-left-with-yearly-bars-earth-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
