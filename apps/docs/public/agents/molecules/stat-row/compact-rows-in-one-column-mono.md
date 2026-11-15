# Reproduce the "Compact rows in one column, mono" example of the InsightCharts Stat row

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Compact rows in one column, mono" example of `stat-row` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Two to five key figures in one row, as open numbers separated by hairlines or as stat tiles of any variant, collapsing to two columns and then one as the container narrows.

Use it when: The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance.

Pick something else when: More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: "hero"`), or figures that need their history shown (use `kpi-grid`, or `variant: "tiles"` with a `trend`).

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `kpi-grid` https://insightcharts.dev/agents/molecules/kpi-grid.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-row
```

The file lands at `components/insightcharts/molecules/stat-row.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { StatRow } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Compact rows in one column, mono" example

This example sets `theme="mono"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="mono"
  variant="compact"
  columns={1}
  density="dense"
  items={[
    {
      label: "Monthly active users",
      value: 48210,
      delta: 0.083,
      deltaLabel: "vs September",
      series: [21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210],
      target: 50000,
      icon: "group",
      comparison: 44500,
      comparisonLabel: "September",
      valueLabel: "December",
    },
    {
      label: "Recurring revenue",
      value: 589000,
      format: "currency:USD",
      delta: 0.124,
      deltaLabel: "vs September",
      series: [
        412000,
        428000,
        431000,
        455000,
        470000,
        476000,
        498000,
        511000,
        524000,
        548000,
        566000,
        589000,
      ],
      target: 600000,
      icon: "banknote",
      comparison: 524000,
      comparisonLabel: "September",
      valueLabel: "December",
    },
    {
      label: "Monthly churn",
      value: 2.1,
      format: "{value}%",
      delta: "−0.2 pts",
      deltaLabel: "vs September",
      upIsGood: false,
      series: [4.2, 4, 3.9, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1],
      icon: "heart",
      comparison: 2.3,
      comparisonLabel: "September",
      valueLabel: "December",
    },
  ]}
  note="Illustrative data"
  style={{ maxWidth: 460 }}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "mono",
  "variant": "compact",
  "columns": 1,
  "density": "dense",
  "items": [
    {
      "label": "Monthly active users",
      "value": 48210,
      "delta": 0.083,
      "deltaLabel": "vs September",
      "series": [21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210],
      "target": 50000,
      "icon": "group",
      "comparison": 44500,
      "comparisonLabel": "September",
      "valueLabel": "December"
    },
    {
      "label": "Recurring revenue",
      "value": 589000,
      "format": "currency:USD",
      "delta": 0.124,
      "deltaLabel": "vs September",
      "series": [
        412000,
        428000,
        431000,
        455000,
        470000,
        476000,
        498000,
        511000,
        524000,
        548000,
        566000,
        589000
      ],
      "target": 600000,
      "icon": "banknote",
      "comparison": 524000,
      "comparisonLabel": "September",
      "valueLabel": "December"
    },
    {
      "label": "Monthly churn",
      "value": 2.1,
      "format": "{value}%",
      "delta": "−0.2 pts",
      "deltaLabel": "vs September",
      "upIsGood": false,
      "series": [4.2, 4, 3.9, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1],
      "icon": "heart",
      "comparison": 2.3,
      "comparisonLabel": "September",
      "valueLabel": "December"
    }
  ],
  "note": "Illustrative data",
  "style": { "maxWidth": 460 },
  "type": "stat-row"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `items` (required), `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend?, variant?, surface?, tone?, size?, align?, series?, target?, targetLabel?, max?, comparison?, comparisonLabel?, valueLabel?, parts?, icon?, unitValue?, rank?, rankOf?, orientation?, edge? }[]`: Two to five figures, most important first. In `plain` each takes the props of `big-number`; otherwise each takes the props of `stat-tile`, and an item's own `variant`, `surface`, `tone` and `size` override the row's. In the example: 3 items: an object with `label`, `value`, `delta`, `deltaLabel`, `series`, `target`, `icon`, `comparison`, `comparisonLabel`, `valueLabel`; an object with `label`, `value`, `format`, `delta`, `deltaLabel`, `series`, `target`, `icon`, `comparison`, `comparisonLabel`, `valueLabel`; an object with `label`, `value`, `format`, `delta`, `deltaLabel`, `upIsGood`, `series`, `icon`, `comparison`, `comparisonLabel`, `valueLabel`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` (required) | `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend?, variant?, surface?, tone?, size?, align?, series?, target?, targetLabel?, max?, comparison?, comparisonLabel?, valueLabel?, parts?, icon?, unitValue?, rank?, rankOf?, orientation?, edge? }[]` |  | Two to five figures, most important first. In `plain` each takes the props of `big-number`; otherwise each takes the props of `stat-tile`, and an item's own `variant`, `surface`, `tone` and `size` override the row's. |
| `variant` | `"plain" \| "tiles" \| StatTileVariant` | `"plain"` | `plain`: open `big-number` figures divided by hairlines. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `unit`, `breakdown`, `rank`, `split`, `compact`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`) draws every item as that tile. Setting `variant` on any item also switches the row to tiles. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | Tiles only: the ground of every tile. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number \| "series"` |  | Tone of every tile. `series` gives each tile the next categorical colour, for figures that name different entities. |
| `layout` | `"cards" \| "dividers"` | `"cards"` | Tiles only: separate cards, or open tiles with hairlines between them. |
| `columns` | `number` |  | Preferred number of columns. Default: one row when every figure has room. |
| `featured` | `boolean` | `false` | The first figure spans two columns and is set one size larger. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing and type scale: tiles are `sm`, `md` or `lg`. |
| `align` | `"left" \| "center"` | `"left"` | Text alignment of every figure. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `format` | `FormatSpec` | `"auto"` | Number format for every figure that does not set its own. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Population and period the figures share. |
| `source` | `string` |  | Shown under the row as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides, passed on to every figure. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to every figure. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `big-number` (atom), `stat-tile` (atom)
- Used by: `data-explorer` (template), `executive-brief` (template), `report-page` (template), `visual-essay` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/stat-row.md
- Component reference with every example: https://insightcharts.dev/llms/stat-row.md
- Registry item: https://insightcharts.dev/r/stat-row.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/stat-row.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/stat-row#example-compact-rows-in-one-column-mono
- These instructions as plain text: https://insightcharts.dev/agents/molecules/stat-row/compact-rows-in-one-column-mono.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
