# Reproduce the "Three chart forms, editorial theme" example of the InsightCharts Chart tabs

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Three chart forms, editorial theme" example of `chart-tabs` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

One chart frame with a segmented control that switches between several views of the same data, morphing between views that share a chart type.

Use it when: The same entities under two to five measures or scalings where each view changes the reading: total / per capita / change, absolute / share, linear / log. Give the frame a plain label as its title. Each view's `subtitle` names its measure.

Pick something else when: Hiding the most important view behind a tab (show it first, or show both with `small-multiple-grid`); unrelated charts (give each its own figure); more than five views.

Instructions for the alternatives: `small-multiple-grid` https://insightcharts.dev/agents/molecules/small-multiple-grid.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/chart-tabs
```

The file lands at `components/insightcharts/molecules/chart-tabs.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ChartTabs } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Three chart forms, editorial theme" example

This example sets `theme="editorial"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, ChartTabs, DumbbellChart, LineChart } from "insightcharts";

<ChartTabs
  theme="editorial"
  title="Median rent in Lisbon was €16.20 per square metre in 2024"
  views={[
    {
      label: "Trend",
      chart: <LineChart
        data={[
          { year: "2019", Lisbon: 11.2, Porto: 8.1, Braga: 5 },
          { year: "2020", Lisbon: 11.6, Porto: 8.5, Braga: 5.3 },
          { year: "2021", Lisbon: 11.4, Porto: 8.4, Braga: 5.5 },
          { year: "2022", Lisbon: 12.9, Porto: 9.6, Braga: 6.2 },
          { year: "2023", Lisbon: 14.8, Porto: 11, Braga: 7.1 },
          { year: "2024", Lisbon: 16.2, Porto: 12.1, Braga: 7.8 },
        ]}
        x="year"
        y={["Lisbon", "Porto", "Braga"]}
        highlight="Lisbon"
        contextLabels
        format="€{value}"
        zero
        height={280}
        subtitle="Median monthly rent of new leases, € per square metre, 2019 to 2024"
      />,
    },
    {
      label: "2019 and 2024",
      chart: <DumbbellChart
        data={[
          { city: "Lisbon", y2019: 11.2, y2024: 16.2, burden: 46 },
          { city: "Porto", y2019: 8.1, y2024: 12.1, burden: 39 },
          { city: "Braga", y2019: 5, y2024: 7.8, burden: 31 },
        ]}
        category="city"
        from="y2019"
        to="y2024"
        names={{ y2019: "2019", y2024: "2024" }}
        format="€{value}"
        sort="to"
        highlight="Lisbon"
        subtitle="Median monthly rent of new leases, € per square metre, 2019 and 2024"
      />,
    },
    {
      label: "Share of income",
      chart: <BarChart
        data={[
          { city: "Lisbon", y2019: 11.2, y2024: 16.2, burden: 46 },
          { city: "Porto", y2019: 8.1, y2024: 12.1, burden: 39 },
          { city: "Braga", y2019: 5, y2024: 7.8, burden: 31 },
        ]}
        x="city"
        y="burden"
        sort="desc"
        orientation="horizontal"
        format="{value}%"
        highlight="Lisbon"
        subtitle="Median rent for 70 square metres as a share of median household income, 2024"
      />,
    },
  ]}
  source="National statistics office"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "editorial",
  "title": "Median rent in Lisbon was €16.20 per square metre in 2024",
  "views": [
    {
      "label": "Trend",
      "chart": {
        "type": "line-chart",
        "data": [
          { "year": "2019", "Lisbon": 11.2, "Porto": 8.1, "Braga": 5 },
          { "year": "2020", "Lisbon": 11.6, "Porto": 8.5, "Braga": 5.3 },
          { "year": "2021", "Lisbon": 11.4, "Porto": 8.4, "Braga": 5.5 },
          { "year": "2022", "Lisbon": 12.9, "Porto": 9.6, "Braga": 6.2 },
          { "year": "2023", "Lisbon": 14.8, "Porto": 11, "Braga": 7.1 },
          { "year": "2024", "Lisbon": 16.2, "Porto": 12.1, "Braga": 7.8 }
        ],
        "x": "year",
        "y": ["Lisbon", "Porto", "Braga"],
        "highlight": "Lisbon",
        "contextLabels": true,
        "format": "€{value}",
        "zero": true,
        "height": 280,
        "subtitle": "Median monthly rent of new leases, € per square metre, 2019 to 2024"
      }
    },
    {
      "label": "2019 and 2024",
      "chart": {
        "type": "dumbbell-chart",
        "data": [
          { "city": "Lisbon", "y2019": 11.2, "y2024": 16.2, "burden": 46 },
          { "city": "Porto", "y2019": 8.1, "y2024": 12.1, "burden": 39 },
          { "city": "Braga", "y2019": 5, "y2024": 7.8, "burden": 31 }
        ],
        "category": "city",
        "from": "y2019",
        "to": "y2024",
        "names": { "y2019": "2019", "y2024": "2024" },
        "format": "€{value}",
        "sort": "to",
        "highlight": "Lisbon",
        "subtitle": "Median monthly rent of new leases, € per square metre, 2019 and 2024"
      }
    },
    {
      "label": "Share of income",
      "chart": {
        "type": "bar-chart",
        "data": [
          { "city": "Lisbon", "y2019": 11.2, "y2024": 16.2, "burden": 46 },
          { "city": "Porto", "y2019": 8.1, "y2024": 12.1, "burden": 39 },
          { "city": "Braga", "y2019": 5, "y2024": 7.8, "burden": 31 }
        ],
        "x": "city",
        "y": "burden",
        "sort": "desc",
        "orientation": "horizontal",
        "format": "{value}%",
        "highlight": "Lisbon",
        "subtitle": "Median rent for 70 square metres as a share of median household income, 2024"
      }
    }
  ],
  "source": "National statistics office",
  "note": "Illustrative data",
  "type": "chart-tabs"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `chart`, `InsightSpec`: The base chart spec every view starts from: `{ type, data, ... }`. Not used in the example.
- `views` (required), `{ label, id?, props?, chart? }[]`: Two to five views. `props` are merged over `chart`; or give a view its own complete `chart` slot. In the example: 3 items: an object with `label`, `chart`.
- `children`, `ReactNode`: Extra content under the chart. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` | `InsightSpec` |  | The base chart spec every view starts from: `{ type, data, ... }`. |
| `views` (required) | `{ label, id?, props?, chart? }[]` |  | Two to five views. `props` are merged over `chart`; or give a view its own complete `chart` slot. |
| `defaultView` | `string \| number` |  | The view shown first: an id, a label or an index. |
| `view` | `string \| number` |  | Controlled active view. |
| `onViewChange` | `(id, index) => void` |  | Called when the reader switches view. |
| `tabsLabel` | `string` | `"Chart view"` | Accessible name of the tab list. |
| `tabsPosition` | `"right" \| "below"` | `"right"` | Tabs beside the title or under it. Under 560px they always go underneath. |
| `title` | `string` |  | A plain label or fact that is true of every view. |
| `subtitle` | `string` |  | What the views share; each view's own `subtitle` names its measure. |
| `source` | `string` |  | Shown under the chart as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `children` | `ReactNode` |  | Extra content under the chart. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `bar-chart` (atom), `line-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/chart-tabs.md
- Component reference with every example: https://insightcharts.dev/llms/chart-tabs.md
- Registry item: https://insightcharts.dev/r/chart-tabs.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/chart-tabs.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/chart-tabs#example-three-chart-forms-editorial-theme
- These instructions as plain text: https://insightcharts.dev/agents/molecules/chart-tabs/three-chart-forms-editorial-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
