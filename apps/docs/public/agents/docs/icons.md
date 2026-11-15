# Use icons in charts and figures

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: Every icon prop in the user's charts holds a built-in icon name or a valid custom path, and unit charts state what one icon stands for.

Set icons on InsightCharts components in the user's project. If the user has not said what one icon should stand for in a unit chart, ask.

## Steps

1. Find the component's icon prop in its props table at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`. The prop is named `icon`, `icons` or `iconField`.
2. Pick a built-in name from the list below. Spell it exactly.
3. If no built-in icon fits, write a custom icon as `"path://"` followed by the `d` attribute of one SVG path. Draw it on a 24 by 24 grid as a single filled shape with no strokes.
4. In a unit chart (`pictogram-chart`, `unit-blocks`), set `unit` to the number one icon stands for and `unitLabel` to the words for it, such as `"10 finishers"`.
5. To draw one icon in your own markup, use the `Icon` component.

## Built-in icon names

- People: `person`, `woman`, `child`, `baby`, `group`
- Home and buildings: `house`, `building`, `factory`, `hospital`, `school`, `shop`
- Transport: `car`, `bus`, `train`, `bike`, `plane`, `ship`, `truck`, `rocket`
- Nature and energy: `tree`, `leaf`, `sun`, `cloud`, `rain`, `drop`, `snow`, `wind-turbine`, `solar-panel`, `flame`, `bolt`, `battery`, `barrel`, `plug`, `mountain`, `wave`, `globe`
- Food and farming: `wheat`, `bread`, `apple`, `carrot`, `fish`, `cow`, `chicken`, `milk-bottle`, `cup`, `bottle`, `fork-knife`
- Money and shopping: `coin`, `banknote`, `cart`, `bag`, `bin`
- Objects: `phone`, `laptop`, `book`, `lightbulb`, `heart`, `cross`, `pill`, `syringe`, `clock`, `calendar`, `flag`, `star`, `pin`, `lock`, `satellite`
- Shapes: `circle`, `square`

A name that is not built in falls back to another icon without an error. The default fallback is `circle`.

## Components with an icon prop

- `icon`: `big-number`, `stat-tile`, `icon-stat`, `metric-breakdown`, `trend-card`, `proportion-statement`, `pictogram-chart`, `unit-blocks`, `icon-array-grid`, `shape-fill`, `stat-circles`, `circle-pack`, `orbit-chart`, `radial-spokes`, `scale-ladder`, `count-poster`.
- `icons` (a record from a category to an icon): `pictogram-chart`, `shape-fill`.
- `iconField` (a column that holds an icon per row): `scale-ladder`.

Check the props table of the component for the accepted values. `proportion-statement` takes only `"circle"`, `"person"` or `"square"`.

## The Icon component

```tsx
import { Icon } from "insightcharts";

<Icon name="bike" />
<Icon name="wind-turbine" size={32} color="#0f766e" title="Wind turbine" />
```

| Prop | Default | Purpose |
|---|---|---|
| `name` | required | A built-in name or a `path://` string. |
| `size` | `"1em"` | Width and height of the icon's square box, in px or any CSS length. |
| `color` | `currentColor` | Fill colour. |
| `title` | none | Accessible name. Without it the icon is hidden from assistive technology. |
| `fallback` | `"circle"` | The icon drawn when `name` is not built in. |

## Icon data

Exported from `insightcharts` and `insightcharts/core`:

- `icons`: a record of every icon by name, each `{ d, aspect }`.
- `iconNames`: every built-in name as an array.
- `iconGroups`: the names by subject.
- `resolveIcon(icon, fallback?)`: the `{ d, aspect }` shape for a name or a `path://` string.
- `iconSymbol(icon, fallback?)`: the `path://` string ECharts takes as a series `symbol`.

## Minimal example

```tsx
import { ShapeFill } from "insightcharts";

const levels = [
  { reservoir: "Carrow", level: 63 },
  { reservoir: "Upper Fen", level: 41 },
  { reservoir: "Stonebeck", level: 88 },
];

export function Reservoirs() {
  return (
    <ShapeFill
      data={levels}
      name="reservoir"
      value="level"
      icon="drop"
      format="{value}%"
      title="Carrow Reservoir was 63% full on 1 September 2025"
      subtitle="Water stored as a share of capacity, three reservoirs, 1 September 2025"
      source="Regional water board"
    />
  );
}
```

A custom path in a spec:

```json
{ "type": "pictogram-chart", "data": [{ "peak": "North", "tents": 12 }, { "peak": "South", "tents": 7 }], "name": "peak", "value": "tents", "icon": "path://M12 2 22 22H2Z" }
```

## Verify

1. Render the chart and confirm the icon drawn is the one you named. A circle where another icon was expected means the name is not built in.
2. Check the name against `iconNames` in a script if in doubt: `iconNames.includes("wind-turbine")`.
3. In a unit chart, confirm the key states what one icon stands for and that the count of icons matches the value divided by `unit`.
4. Check at about 380px wide and in dark mode.

## Common mistakes

- An icon name from another icon library, such as `user` or `home`. Use `person` and `house`.
- A custom path with strokes, several paths or a viewBox other than 24 by 24.
- Scaling an icon's size by a value. Icons are repeated by count.
- An `Icon` that carries meaning with no `title`.

## Reference

- This page: https://insightcharts.dev/docs/icons
- These instructions as plain text: https://insightcharts.dev/agents/docs/icons.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
