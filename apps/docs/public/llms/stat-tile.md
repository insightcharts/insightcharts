# Stat tile (`stat-tile`)

> A compact KPI tile: label, value, change against a baseline and an optional graphic. Twenty variants display the same data as a card, a trend, progress toward a target, a comparison, a breakdown, a rank or a count of icons.

- Component: `StatTile` (import from `insightcharts`)
- Spec type: `"stat-tile"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Dashboard grids and KPI rows of three to six figures. Pass the data once (`value`, `delta`, `series`, `target`, `parts`, `icon`) and choose the display with `variant`; change `surface`, `tone` and `size` to set emphasis. Give every tile a delta or a context line.

## Avoid

The single number a story leads with (use `big-number` with `size: "hero"`). Do not put a full chart with axes in the trend slot. Use `unit` only for counts up to 60 icons.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-tile
```

The file lands at `components/insightcharts/atoms/stat-tile.tsx`. `@insightcharts/stat-tile-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  format="compact"
  delta={0.083}
  deltaLabel="vs September"
  trend={[38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2]}
  style={{ maxWidth: 300 }}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "stat-tile",
  "label": "Monthly active users",
  "value": 48210,
  "format": "compact",
  "delta": 0.083,
  "deltaLabel": "vs September",
  "trend": [38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2],
  "style": { "maxWidth": 300 }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What it measures, sentence case. |
| `value` (required) | `number \| string` |  | The figure. Numbers are formatted with `format`. `progress`, `ring` and `unit` need a number. |
| `delta` | `number \| string` |  | Change against a baseline. Numbers render as signed percentages (0.12 is +12%). `comparison` computes it from `value` and `comparison` when omitted. |
| `deltaLabel` | `string` |  | What the delta is against, e.g. "vs last month". |
| `upIsGood` | `boolean` | `true` | Whether an increase is an improvement. Sets the delta colour; the arrow and sign always show the direction. |
| `context` | `string` |  | A line that states a comparison or reference for the number. |
| `variant` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent" \| "sparkline" \| "area" \| "bars" \| "dots" \| "progress" \| "ring" \| "comparison" \| "delta-first" \| "icon" \| "unit" \| "breakdown" \| "rank" \| "split" \| "compact" \| "hero"` | `"plain"` | The display. Grounds: `plain` (bordered card), `borderless`, `filled` (solid tone with contrasting ink), `tinted` (10% wash), `outline-accent` (a 2px rule on one edge). Trends, from `series`: `sparkline` (line), `area` (filled, edge to edge along the bottom, zero-based), `bars` (columns, zero-based), `dots`, `split` (figure left, line in a tinted panel right), `compact` (one line: label, small line, value, change). Goals, from `target` or `max`: `progress` (bar with the target marked), `ring`. Others: `comparison` (needs `comparison`: two labelled bars), `delta-first` (the change is the large figure), `icon` (needs `icon`: a tinted badge), `unit` (the count as repeated icons, up to 60), `breakdown` (needs `parts`: a segmented bar with a key), `rank` (needs `rank`: "3rd of 12" with a position strip), `hero` (a numeral of 40 to 96px). A variant whose data is missing renders as `plain`. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground, independent of the display, so any variant can sit on any ground: `variant: "sparkline", surface: "filled"`. Default: the variant's own, otherwise `plain`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` | `"accent"` | Colour of the graphic and of a filled or tinted ground. A number picks from the theme's categorical palette, 0-based. `neutral` is ink. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Type and padding scale: 22, 28 or 36px numerals with 12, 16 or 20px padding. The numeral shrinks to fit a narrow tile. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment. |
| `orientation` | `"vertical" \| "horizontal"` |  | Graphic under the figure or beside it, for `sparkline`, `bars`, `dots`, `ring` and `icon`. Default `vertical`, `horizontal` for `ring`. Falls back to vertical under about 250px (180px for `ring` and `icon`). |
| `series` | `number[]` |  | Past values in time order, oldest first, ending with the current value, in the units of `value`. A numeric `trend` array is used when `series` is omitted. |
| `target` | `number` |  | The goal for `value`, marked on `progress` and `ring`. |
| `targetLabel` | `string` | `"Target"` | Name for the target. |
| `max` | `number` |  | End of the scale for `progress` and `ring`, and the total count drawn by `unit`. Default: the target, or 1 for a share. |
| `comparison` | `number \| string` |  | The value compared with, for `comparison`: a previous period or a peer. |
| `comparisonLabel` | `string` | `"Before"` | Names the comparison value, e.g. "September". |
| `valueLabel` | `string` | `"Now"` | Names the current value in `comparison`, e.g. "December". |
| `parts` | `{ label: string; value: number }[]` |  | What the value is made of, for `breakdown`. Should sum to `value`. Past six parts the smallest fold into Other. |
| `icon` | `IconInput` |  | A built-in icon name or `path://...`, for `icon` and `unit`. `unit` defaults to `circle`. |
| `unitValue` | `number` | `1` | What one icon stands for in `unit`. A caption states it when it is not 1. |
| `rank` | `number` |  | Position in a ranking, 1 is first, for `rank`. |
| `rankOf` | `number` |  | Number of entries ranked. Up to 32 are drawn as one segment each. |
| `edge` | `"left" \| "top"` | `"left"` | Which edge carries the rule on an `outline-accent` surface. |
| `trend` | `Slot \| number[]` |  | A chart spec, a React element, or an array of numbers drawn as a sparkline. Works in every variant that does not draw `series` itself. |
| `trendPosition` | `"bottom" \| "right"` | `"bottom"` | Where the trend slot sits; `right` falls back to `bottom` in narrow tiles. |
| `format` | `FormatSpec` | `"auto"` | Number format for `value`, `target`, `max`, `comparison` and `series`. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides. A named theme paints its own ground behind the tile. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `children` | `ReactNode` |  | Extra content at the bottom of the tile. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [before-after](https://insightcharts.dev/llms/before-after.md), [kpi-grid](https://insightcharts.dev/llms/kpi-grid.md), [metric-breakdown](https://insightcharts.dev/llms/metric-breakdown.md), [section](https://insightcharts.dev/llms/section.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [trend-card](https://insightcharts.dev/llms/trend-card.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md)

## More examples

### Plain

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="plain"
  style={{ maxWidth: 300 }}
/>
```

### Borderless

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="borderless"
  style={{ maxWidth: 300 }}
/>
```

### Filled

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="filled"
  style={{ maxWidth: 300 }}
/>
```

### Tinted

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="tinted"
  style={{ maxWidth: 300 }}
/>
```

### Outline accent

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="outline-accent"
  style={{ maxWidth: 300 }}
/>
```

### Outline accent, rule on the top edge

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="outline-accent"
  edge="top"
  tone={2}
  style={{ maxWidth: 300 }}
/>
```

### Sparkline

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="sparkline"
  style={{ maxWidth: 300 }}
/>
```

### Area

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="area"
  style={{ maxWidth: 300 }}
/>
```

### Bars

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="bars"
  style={{ maxWidth: 300 }}
/>
```

### Dots

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="dots"
  style={{ maxWidth: 300 }}
/>
```

### Split

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="split"
  style={{ maxWidth: 420 }}
/>
```

### Sparkline beside the figure

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="sparkline"
  orientation="horizontal"
  style={{ maxWidth: 420 }}
/>
```

### Progress

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="progress"
  target={50000}
  targetLabel="Q4 target"
  style={{ maxWidth: 300 }}
/>
```

### Ring

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="ring"
  target={50000}
  context="Q4 target is 50,000"
  style={{ maxWidth: 300 }}
/>
```

### Ring above the figure

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="ring"
  orientation="vertical"
  align="center"
  size="lg"
  target={50000}
  context="Q4 target is 50,000"
  style={{ maxWidth: 240 }}
/>
```

### Comparison

```tsx
import { StatTile } from "insightcharts";

<StatTile
  variant="comparison"
  label="Monthly active users"
  value={48210}
  valueLabel="December"
  comparison={44500}
  comparisonLabel="September"
  style={{ maxWidth: 300 }}
/>
```

### Delta first

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="delta-first"
  style={{ maxWidth: 300 }}
/>
```

### Rank

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  context="users in December"
  variant="rank"
  rank={3}
  rankOf={12}
  delta="2 places"
  deltaLabel="since September"
  style={{ maxWidth: 300 }}
/>
```

### Breakdown

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="breakdown"
  parts={[
    { label: "Free", value: 28930 },
    { label: "Team", value: 13500 },
    { label: "Enterprise", value: 5780 },
  ]}
  style={{ maxWidth: 300 }}
/>
```

### Icon

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="icon"
  icon="group"
  style={{ maxWidth: 300 }}
/>
```

### Icon beside the figure

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="icon"
  icon="group"
  orientation="horizontal"
  surface="tinted"
  style={{ maxWidth: 300 }}
/>
```

### Unit

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Offshore wind farms connected in 2024"
  value={14}
  max={20}
  variant="unit"
  icon="wind-turbine"
  context="14 of the 20 planned for the year"
  style={{ maxWidth: 300 }}
/>
```

### Unit, one icon is 1,000 users

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48000}
  format="compact"
  unitValue={1000}
  variant="unit"
  icon="person"
  size="sm"
  delta={0.083}
  deltaLabel="vs September"
  style={{ maxWidth: 300 }}
/>
```

### Compact

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="compact"
  style={{ maxWidth: 420 }}
/>
```

### Hero

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="hero"
  format="compact"
  context="The Q4 target is 50,000."
  style={{ maxWidth: 420 }}
/>
```

### Small, centred

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  size="sm"
  align="center"
  variant="tinted"
  tone={3}
  style={{ maxWidth: 200 }}
/>
```

### Large, dots

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  size="lg"
  variant="dots"
  tone={1}
  style={{ maxWidth: 360 }}
/>
```

### Area on a filled ground

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="area"
  surface="filled"
  style={{ maxWidth: 300 }}
/>
```

### Bars on a tinted ground, positive tone

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="bars"
  surface="tinted"
  tone="positive"
  style={{ maxWidth: 300 }}
/>
```

### Progress on a filled ground, neutral tone

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="progress"
  surface="filled"
  tone="neutral"
  target={50000}
  style={{ maxWidth: 300 }}
/>
```

### Ledger: operating margin against plan

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="ledger"
  label="Operating margin, FY2024"
  value={0.184}
  format="percent"
  variant="progress"
  target={0.2}
  max={0.25}
  targetLabel="Plan"
  delta="+1.6 pts"
  deltaLabel="vs FY2023"
  style={{ maxWidth: 300 }}
/>
```

### Editorial: unemployment rate

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="editorial"
  label="Unemployment rate, December 2024"
  value="4.3%"
  delta="+0.4 pts"
  deltaLabel="vs January"
  upIsGood={false}
  variant="sparkline"
  series={[3.9, 3.8, 3.8, 3.6, 3.5, 3.6, 3.4, 3.7, 3.8, 3.9, 4.1, 4.3]}
  style={{ maxWidth: 300 }}
/>
```

### Forest: tree cover by land owner

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="forest"
  label="Tree cover, hectares"
  value={12400}
  variant="breakdown"
  parts={[
    { label: "State", value: 6820 },
    { label: "Private", value: 4340 },
    { label: "Community", value: 1240 },
  ]}
  context="Surveyed in 2024"
  style={{ maxWidth: 300 }}
/>
```

### Noir: league position

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="noir"
  label="League position after 30 matches"
  value="61 points"
  variant="rank"
  rank={4}
  rankOf={20}
  delta="2 places"
  deltaLabel="since matchday 20"
  style={{ maxWidth: 300 }}
/>
```

### Magenta: ticket sales

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="magenta"
  label="Tickets sold for the final"
  value={68400}
  variant="ring"
  max={72000}
  context="Capacity is 72,000"
  size="lg"
  style={{ maxWidth: 340 }}
/>
```

### Ocean: offshore wind capacity

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="ocean"
  label="Offshore wind capacity, 2024"
  value={26.3}
  format="{value} GW"
  delta={0.342}
  deltaLabel="vs 2023"
  variant="area"
  series={[2.1, 3.4, 5, 7.9, 11.2, 14.8, 19.6, 26.3]}
  style={{ maxWidth: 300 }}
/>
```

### Sunrise: store visits

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="sunrise"
  label="Store visits, week 50"
  value={18640}
  comparison={16200}
  valueLabel="Week 50, 2024"
  comparisonLabel="Week 50, 2023"
  variant="comparison"
  style={{ maxWidth: 300 }}
/>
```

### Blueprint: units assembled

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="blueprint"
  label="Units assembled per shift, week 8"
  value={318}
  variant="bars"
  series={[212, 240, 198, 265, 281, 254, 302, 318]}
  delta={0.5}
  deltaLabel="vs week 1"
  style={{ maxWidth: 300 }}
/>
```

### Science: vaccination coverage

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="science"
  label="Children vaccinated against measles"
  value={0.91}
  format="percent"
  variant="ring"
  target={0.95}
  max={1}
  targetLabel="WHO target"
  context="The WHO target is 95%."
  style={{ maxWidth: 300 }}
/>
```

### Dusk: night trains

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="dusk"
  label="Night train routes opened since 2020"
  value={9}
  variant="unit"
  icon="train"
  context="Across 6 countries"
  style={{ maxWidth: 300 }}
/>
```

### Paper: household energy bill

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="paper"
  label="Average annual energy bill"
  value={1717}
  format="currency:GBP"
  delta={-0.124}
  deltaLabel="vs 2023"
  upIsGood={false}
  variant="delta-first"
  style={{ maxWidth: 300 }}
/>
```

### Earth: bottles returned for refill

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="earth"
  label="Bottles returned for refill"
  value={0.72}
  format="percent"
  variant="icon"
  icon="bottle"
  orientation="horizontal"
  delta="+9 pts"
  deltaLabel="vs 2022"
  style={{ maxWidth: 300 }}
/>
```

### Mono: compact row

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="mono"
  label="Median first-response time"
  value="2 h 14 min"
  delta={-0.18}
  upIsGood={false}
  deltaLabel="vs last quarter"
  variant="compact"
  series={[4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2]}
  style={{ maxWidth: 420 }}
/>
```

### Poster: hero figure

```tsx
import { StatTile } from "insightcharts";

<StatTile
  theme="poster"
  label="Solar capacity added worldwide in 2024"
  value="597 GW"
  delta={0.33}
  deltaLabel="vs 2023"
  variant="hero"
  style={{ maxWidth: 420 }}
/>
```

### Down is good, trend on the right

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Median first-response time"
  value="2 h 14 min"
  delta={-0.18}
  deltaLabel="vs last quarter"
  upIsGood={false}
  trend={[4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2]}
  trendPosition="right"
  style={{ maxWidth: 420 }}
/>
```

### Context only

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Net revenue retention"
  value={1.12}
  format="percent"
  context="Top quartile for the sector is 110%."
  style={{ maxWidth: 260 }}
/>
```

### Chart spec in the trend slot

```tsx
import { BigNumber, StatTile } from "insightcharts";

<StatTile
  label="Solar share of generation"
  value={0.113}
  format="percent"
  delta="+1.9 pts"
  deltaLabel="vs 2023"
  trend={<BigNumber
    label="Peak hour, 14 July"
    value={0.52}
    format="percent"
    context="Any registered component can sit here."
  />}
  style={{ maxWidth: 300 }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/stat-tile.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/stat-tile.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
