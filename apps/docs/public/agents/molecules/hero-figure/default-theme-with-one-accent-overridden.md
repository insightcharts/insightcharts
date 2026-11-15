# Reproduce the "Default theme with one accent overridden" example of the InsightCharts Hero figure

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Default theme with one accent overridden" example of `hero-figure` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

The opening exhibit of a piece: kicker, headline and deck above one large chart, with a source line underneath.

Use it when: At the very top of a data story or a one-page report. The headline states the main fact with its number. The chart shows that fact.

Pick something else when: Giving the chart its own `title` (the headline is the title; use the chart's `subtitle` for the measure). A second hero on the same page: later sections use `section` or `chart-callout`.

Instructions for the alternatives: `chart-callout` https://insightcharts.dev/agents/molecules/chart-callout.md, `section` https://insightcharts.dev/agents/molecules/section.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/hero-figure
```

The file lands at `components/insightcharts/molecules/hero-figure.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { HeroFigure } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Default theme with one accent overridden" example

This example overrides theme tokens with an object (`accent`). Keep the object to reproduce the look, or replace its values with the user's brand colours.

```tsx
import { DumbbellChart, HeroFigure } from "insightcharts";

<HeroFigure
  theme={{ accent: "#b4237a" }}
  kicker="Representation"
  title="Women held 27.0% of seats in national parliaments in 2024"
  deck="The share was 13.1% in 2000."
  chart={<DumbbellChart
    data={[
      { region: "Americas", y2000: 15.3, y2024: 35.1 },
      { region: "Europe", y2000: 16, y2024: 31.8 },
      { region: "Sub-Saharan Africa", y2000: 11.3, y2024: 27.3 },
      { region: "Pacific", y2000: 13, y2024: 22.9 },
      { region: "Asia", y2000: 14.6, y2024: 22.1 },
      { region: "Middle East and North Africa", y2000: 3.8, y2024: 16.5 },
    ]}
    category="region"
    from="y2000"
    to="y2024"
    names={{ y2000: "2000", y2024: "2024" }}
    format="{value}%"
    sort="to"
    highlight="Americas"
    subtitle="Share of seats in national parliaments held by women, by region, 2000 and 2024"
  />}
  source="Inter-Parliamentary Union"
  note="Figures are approximate, for illustration"
  period="2000 and 2024"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": { "accent": "#b4237a" },
  "kicker": "Representation",
  "title": "Women held 27.0% of seats in national parliaments in 2024",
  "deck": "The share was 13.1% in 2000.",
  "chart": {
    "type": "dumbbell-chart",
    "data": [
      { "region": "Americas", "y2000": 15.3, "y2024": 35.1 },
      { "region": "Europe", "y2000": 16, "y2024": 31.8 },
      { "region": "Sub-Saharan Africa", "y2000": 11.3, "y2024": 27.3 },
      { "region": "Pacific", "y2000": 13, "y2024": 22.9 },
      { "region": "Asia", "y2000": 14.6, "y2024": 22.1 },
      { "region": "Middle East and North Africa", "y2000": 3.8, "y2024": 16.5 }
    ],
    "category": "region",
    "from": "y2000",
    "to": "y2024",
    "names": { "y2000": "2000", "y2024": "2024" },
    "format": "{value}%",
    "sort": "to",
    "highlight": "Americas",
    "subtitle": "Share of seats in national parliaments held by women, by region, 2000 and 2024"
  },
  "source": "Inter-Parliamentary Union",
  "note": "Figures are approximate, for illustration",
  "period": "2000 and 2024",
  "type": "hero-figure"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `chart` (required), `Slot`: The hero chart: a spec or a React element, without its own title. In the example: a `dumbbell-chart` spec with 6 rows.
- `children`, `ReactNode`: JSX alternative to `chart`. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main fact, as one plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the series or topic. |
| `deck` | `string` |  | One plain sentence under the title that adds a second fact. |
| `byline` | `string` |  | Author line, e.g. "By Ana Ruiz". |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `chart` (required) | `Slot` |  | The hero chart: a spec or a React element, without its own title. |
| `source` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `note` | `string` |  | Caveats the reader should know. |
| `align` | `"left" \| "center"` | `"left"` | Headline alignment. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title. |
| `children` | `ReactNode` |  | JSX alternative to `chart`. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the headline, chart and source note. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `headline` (atom), `source-note` (atom), `line-chart` (atom), `big-number` (atom), `dumbbell-chart` (atom), `waffle-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/hero-figure.md
- Component reference with every example: https://insightcharts.dev/llms/hero-figure.md
- Registry item: https://insightcharts.dev/r/hero-figure.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/hero-figure.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/hero-figure#example-default-theme-with-one-accent-overridden
- These instructions as plain text: https://insightcharts.dev/agents/molecules/hero-figure/default-theme-with-one-accent-overridden.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
