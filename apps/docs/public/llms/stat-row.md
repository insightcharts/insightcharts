# Stat row (`stat-row`)

> Two to five key figures in one row separated by hairlines, collapsing to two columns and then one as the container narrows.

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
| `items` (required) | `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend? }[]` |  | Two to five figures, most important first. Each takes the props of `big-number` (or `stat-tile` when `variant` is `tiles`). |
| `variant` | `"plain" \| "tiles"` | `"plain"` | Open figures divided by hairlines, or bordered tiles that can carry a `trend`. |
| `format` | `FormatSpec` | `"auto"` | Number format for every figure that does not set its own. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Population and period the figures share. |
| `source` | `string` |  | Shown under the row as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to every figure. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to every figure. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md)
- Used by: [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

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
