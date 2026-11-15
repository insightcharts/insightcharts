# Stat row (`stat-row`)

> Two to five key figures in one row, as open numbers separated by hairlines or as stat tiles of any variant, collapsing to two columns and then one as the container narrows.

- Component: `StatRow` (import from `insightcharts`)
- Spec type: `"stat-row"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance.

## Avoid

More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: "hero"`), or figures that need their history shown (use `kpi-grid`, or `variant: "tiles"` with a `trend`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-row
```

The file lands at `components/insightcharts/molecules/stat-row.tsx`. `@insightcharts/stat-row-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StatRow } from "insightcharts";

<StatRow
  title="Renewables supplied 31.7% of the world's electricity in 2024"
  subtitle="Global electricity generation, 2024"
  items={[
    {
      value: 0.317,
      format: "percent",
      label: "Share from renewables",
      delta: "+1.9 pts",
      deltaLabel: "vs 2023",
    },
    { value: 2131, label: "Solar generation, TWh", delta: 0.29, deltaLabel: "vs 2023" },
    { value: 2494, label: "Wind generation, TWh", delta: 0.079, deltaLabel: "vs 2023" },
    {
      value: 0.409,
      format: "percent",
      label: "Share from all clean sources",
      context: "Above 40% for the first time since the 1940s",
    },
  ]}
  source="Ember, Global Electricity Review 2025"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "stat-row",
  "title": "Renewables supplied 31.7% of the world's electricity in 2024",
  "subtitle": "Global electricity generation, 2024",
  "items": [
    {
      "value": 0.317,
      "format": "percent",
      "label": "Share from renewables",
      "delta": "+1.9 pts",
      "deltaLabel": "vs 2023"
    },
    { "value": 2131, "label": "Solar generation, TWh", "delta": 0.29, "deltaLabel": "vs 2023" },
    { "value": 2494, "label": "Wind generation, TWh", "delta": 0.079, "deltaLabel": "vs 2023" },
    {
      "value": 0.409,
      "format": "percent",
      "label": "Share from all clean sources",
      "context": "Above 40% for the first time since the 1940s"
    }
  ],
  "source": "Ember, Global Electricity Review 2025",
  "note": "Figures are approximate, for illustration"
}
```

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

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md)
- Used by: [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [report-page](https://insightcharts.dev/llms/report-page.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Tiles with trends

```tsx
import { StatRow } from "insightcharts";

<StatRow
  variant="tiles"
  items={[
    {
      label: "Monthly active users",
      value: 48210,
      format: "compact",
      delta: 0.083,
      deltaLabel: "vs September",
      trend: [38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2],
    },
    {
      label: "Median first-response time",
      value: "2 h 14 min",
      delta: -0.18,
      deltaLabel: "vs September",
      upIsGood: false,
      trend: [4.1, 3.9, 3.8, 3.2, 3.4, 2.9, 2.7, 2.4, 2.2],
    },
    {
      label: "Net revenue retention",
      value: 1.12,
      format: "percent",
      context: "Top quartile for the sector is 110%",
    },
  ]}
  note="Illustrative data"
/>
```

### Area tiles, one colour per metric

```tsx
import { StatRow } from "insightcharts";

<StatRow
  title="Recurring revenue reached $589,000 in December 2024"
  subtitle="Three product metrics by month, 2024"
  variant="area"
  tone="series"
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
/>
```

### Featured filled tile with sparklines, ledger

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="ledger"
  title="Monthly active users reached 48,210 in December 2024"
  featured
  variant="sparkline"
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
      surface: "filled",
      variant: "split",
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
/>
```

### Progress toward targets, science

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="science"
  title="Measles vaccination coverage was 91% in 2024"
  subtitle="Childhood vaccination coverage against the 95% WHO target, 2024"
  variant="progress"
  items={[
    {
      label: "Measles, first dose",
      value: 0.91,
      format: "percent",
      target: 0.95,
      max: 1,
      targetLabel: "Target",
      delta: "+2 pts",
      deltaLabel: "vs 2021",
    },
    {
      label: "Polio, third dose",
      value: 0.93,
      format: "percent",
      target: 0.95,
      max: 1,
      targetLabel: "Target",
      delta: "+1 pt",
      deltaLabel: "vs 2021",
      tone: 1,
    },
    {
      label: "HPV, girls aged 15",
      value: 0.64,
      format: "percent",
      target: 0.9,
      max: 1,
      targetLabel: "Target",
      delta: "+9 pts",
      deltaLabel: "vs 2021",
      tone: 2,
    },
  ]}
  note="Illustrative data"
/>
```

### Rings with dividers, forest

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="forest"
  title="Native woodland replanting reached 62% of the 2026 goal"
  variant="ring"
  layout="dividers"
  items={[
    {
      label: "Native woodland replanted",
      value: 1240,
      format: "{value} ha",
      max: 2000,
      context: "Goal: 2,000 hectares",
    },
    {
      label: "Peatland restored",
      value: 430,
      format: "{value} ha",
      max: 1000,
      context: "Goal: 1,000 hectares",
    },
    {
      label: "Hedgerow planted",
      value: 86,
      format: "{value} km",
      max: 100,
      context: "Goal: 100 kilometres",
    },
  ]}
  note="Illustrative data"
/>
```

### Icons on tinted tiles, earth

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="earth"
  variant="icon"
  surface="tinted"
  tone="series"
  items={[
    {
      label: "Bottles returned for refill",
      value: 0.72,
      format: "percent",
      icon: "bottle",
      delta: "+9 pts",
      deltaLabel: "vs 2022",
    },
    {
      label: "Household waste recycled",
      value: 0.48,
      format: "percent",
      icon: "bin",
      delta: "+3 pts",
      deltaLabel: "vs 2022",
    },
    {
      label: "Journeys made by bike",
      value: 0.19,
      format: "percent",
      icon: "bike",
      delta: "+4 pts",
      deltaLabel: "vs 2022",
    },
    {
      label: "Homes with solar panels",
      value: 0.11,
      format: "percent",
      icon: "solar-panel",
      delta: "+5 pts",
      deltaLabel: "vs 2022",
    },
  ]}
  note="Illustrative data"
/>
```

### Change first, noir

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="noir"
  title="The club scored 68 goals in 30 matches"
  variant="delta-first"
  layout="dividers"
  items={[
    { label: "Goals scored", value: "68 goals", delta: 0.214, deltaLabel: "vs 56 last season" },
    {
      label: "Goals conceded",
      value: "31 goals",
      delta: -0.184,
      deltaLabel: "vs 38 last season",
      upIsGood: false,
    },
    {
      label: "Average attendance",
      value: "41,200",
      delta: 0.062,
      deltaLabel: "vs 38,800 last season",
    },
    { label: "Points", value: "61 points", delta: 0.196, deltaLabel: "vs 51 last season" },
  ]}
  note="Illustrative data"
/>
```

### Comparison with the same week last year, sunrise

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="sunrise"
  title="Store visits were 18,640 in week 50 of 2024"
  variant="comparison"
  items={[
    {
      label: "Store visits",
      value: 18640,
      comparison: 16200,
      valueLabel: "2024",
      comparisonLabel: "2023",
    },
    { label: "Orders", value: 6120, comparison: 5480, valueLabel: "2024", comparisonLabel: "2023" },
    {
      label: "Average basket",
      value: 42.6,
      format: "currency:EUR",
      comparison: 44.1,
      valueLabel: "2024",
      comparisonLabel: "2023",
    },
  ]}
  note="Illustrative data"
/>
```

### Compact rows in one column, mono

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

### Mixed displays in one row, blueprint

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="blueprint"
  title="The plant assembled 318 units per shift in week 8"
  items={[
    {
      label: "Units assembled per shift",
      value: 318,
      variant: "bars",
      series: [212, 240, 198, 265, 281, 254, 302, 318],
      delta: 0.5,
      deltaLabel: "vs week 1",
    },
    {
      label: "Line uptime",
      value: 0.962,
      format: "percent",
      variant: "ring",
      max: 1,
      context: "Target is 95%",
    },
    {
      label: "Defect rate rank",
      value: "0.8%",
      context: "of units",
      variant: "rank",
      rank: 2,
      rankOf: 9,
    },
  ]}
  note="Illustrative data"
/>
```

### Breakdown tiles, dusk

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="dusk"
  variant="breakdown"
  columns={2}
  items={[
    {
      label: "Night train passengers, 2024",
      value: 1840000,
      format: "compact",
      parts: [
        { label: "Sleeper", value: 644000 },
        { label: "Couchette", value: 736000 },
        { label: "Seat", value: 460000 },
      ],
    },
    {
      label: "Night train revenue, 2024",
      value: 212000000,
      format: "currency:EUR",
      parts: [
        { label: "Sleeper", value: 116600000 },
        { label: "Couchette", value: 69960000 },
        { label: "Seat", value: 25440000 },
      ],
    },
  ]}
  note="Illustrative data"
/>
```

### Roomy, featured plain figures, editorial

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="editorial"
  featured
  density="roomy"
  items={[
    {
      value: 0.043,
      format: "percent",
      label: "Unemployment rate, December 2024",
      delta: "+0.4 pts",
      deltaLabel: "vs January",
      upIsGood: false,
    },
    {
      value: 0.031,
      format: "percent",
      label: "Annual inflation",
      delta: "−0.9 pts",
      deltaLabel: "vs January",
      upIsGood: false,
    },
    {
      value: 0.045,
      format: "percent",
      label: "Policy interest rate",
      context: "Cut from 5.25% in August",
    },
  ]}
  note="Illustrative data"
/>
```

### Unit counts, ocean

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="ocean"
  variant="unit"
  items={[
    {
      label: "Offshore wind farms connected in 2024",
      value: 14,
      max: 20,
      icon: "wind-turbine",
      context: "14 of the 20 planned",
    },
    { label: "Survey ships at sea", value: 6, max: 8, icon: "ship", context: "6 of a fleet of 8" },
    { label: "Marine reserves designated", value: 9, icon: "fish", context: "3 more than in 2023" },
  ]}
  note="Illustrative data"
/>
```

### Filled tiles in categorical colours, poster

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="poster"
  variant="filled"
  tone="series"
  density="roomy"
  align="center"
  items={[
    { label: "Monthly active users", value: 48210, delta: 0.083, deltaLabel: "vs September" },
    {
      label: "Recurring revenue",
      value: 589000,
      format: "currency:USD",
      delta: 0.124,
      deltaLabel: "vs September",
    },
    {
      label: "Monthly churn",
      value: 2.1,
      format: "{value}%",
      delta: "−0.2 pts",
      deltaLabel: "vs September",
      upIsGood: false,
    },
  ]}
  note="Illustrative data"
/>
```

### Outline rule with dots, paper

```tsx
import { StatRow } from "insightcharts";

<StatRow
  theme="paper"
  variant="dots"
  surface="outline-accent"
  tone="series"
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
/>
```

### Two figures

```tsx
import { StatRow } from "insightcharts";

<StatRow
  items={[
    {
      value: "1 in 4",
      label: "Households that could not cover a €500 bill",
      context: "Without borrowing or selling something",
    },
    {
      value: 0.068,
      format: "percent",
      label: "Households in arrears on utility bills",
      delta: "+0.4 pts",
      deltaLabel: "vs 2022",
      upIsGood: false,
    },
  ]}
  source="Eurostat, EU-SILC 2023"
  note="Figures are approximate, for illustration"
/>
```

### Five figures

```tsx
import { StatRow } from "insightcharts";

<StatRow
  format="compact"
  items={[
    { value: 1284000, label: "Visits", delta: 0.12, deltaLabel: "vs last month" },
    { value: 412000, label: "Unique visitors", delta: 0.09, deltaLabel: "vs last month" },
    { value: 38200, label: "Sign-ups", delta: 0.031, deltaLabel: "vs last month" },
    { value: 5140, label: "Paid conversions", delta: -0.024, deltaLabel: "vs last month" },
    {
      value: 0.134,
      format: "percent",
      label: "Sign-up to paid",
      delta: "−0.7 pts",
      deltaLabel: "vs last month",
    },
  ]}
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/stat-row.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/stat-row.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
