---
title: Render a first InsightCharts chart
goal: One chart of the user's data renders with a title that states one fact, a subtitle, a source and a highlight.
llms: quickstart
---
Draw the user's data as one chart. If the user has not given you the data and the one fact the chart should show, ask for both before writing code.

## Before you start

{{DETECT}}

## Steps

1. Install the package if it is not in `package.json`:

{{INSTALL}}

2. Read the data. Work out the fact to state, with its number and period, from the rows. Never invent a number.
3. Pick the form: `BarChart` to rank or compare categories, `LineChart` for change over five or more periods, `BigNumber` for one statistic. For anything else read `{{SITE_URL}}/agents/atoms.md`.
4. Write the chart with the four groups of props below.
5. Render it and run the checks under "Verify".

## The four groups of props on every chart

1. Data: `data` is rows, CSV text, a URL or a function. `transform` reshapes it first.
2. Fields: `x`, `y`, `series` and similar props are field names as strings. There are no accessor functions.
3. Text: `title` is one plain statement of what the data shows, with the number and the period, or a plain label such as "Monthly churn, 2024". `subtitle` names the measure, unit, population and period. `source` names where the data is from. `note` holds caveats.
4. Emphasis: `highlight` names the entity the title is about. The other series are drawn in grey. `annotations` mark a date, a threshold or one value.

The chart fills the width of its container. `height` defaults to 360 pixels, except on charts that grow with their rows. Pass `height` to fix it, or `aspect` (width divided by height). Wide data uses `y={["a", "b"]}`. Long data uses `y="value" series="group"`.

## Number formats

`format` sets how values print on labels, axes and tooltips.

| `format` | 1234.5 prints as |
|---|---|
| `"auto"` (default) | 1,234.5 (compact from 10,000) |
| `"compact"` | 1.2K |
| `"integer"` | 1,235 |
| `"decimal:2"` | 1,234.50 |
| `"signed"` | +1,234.5 |
| `"currency:USD"` | $1.2K |
| `"percent"` | expects a ratio: 0.42 prints as 42% |
| `"percent-raw"` | expects a percentage: 42 prints as 42% |
| `"year"` | 1235, with no thousands separator |
| `"{value} kg"` | 1,234.5 kg |

`format` also takes `Intl.NumberFormat` options, or a function in a client file.

## One statistic

```tsx
import { BigNumber } from "insightcharts";

<BigNumber value={0.317} format="percent" label="Share of global electricity from renewables" delta={0.021} deltaLabel="vs 2023" context="Up from 19% in 2010" size="hero" />
```

A numeric `delta` is a fraction shown as a signed percentage: `0.021` prints as +2.1%. `BigNumber` is an HTML component. It does not take `data`, `title` or the other chart props.

## Defaults for a whole section

Charts work with no provider. `InsightProvider` sets defaults for everything inside it, and providers nest.

| Prop | Default | Purpose |
|---|---|---|
| `theme` | the default theme | A theme name, a theme, or partial tokens merged over the parent theme. |
| `mode` | `"auto"` | `"auto"`, `"system"`, `"light"` or `"dark"`. |
| `renderer` | `"auto"` | `"svg"`, `"canvas"` or `"auto"`. |
| `locale` | `"en-US"` | BCP 47 locale for numbers and dates. Do not read it from `navigator.language` during render. |
| `animate` | `true` | Set false to disable animation. Reduced-motion preferences are always respected. |
| `exportable` | `false` | Show the export menu on every figure. |
| `lazy` | `true` | Create each chart when it scrolls near the viewport. |

## Minimal example

```tsx
import { BarChart, InsightProvider } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
  { country: "Germany", share: 52 },
  { country: "United States", share: 23 },
];

export function Renewables() {
  return (
    <InsightProvider locale="en-GB">
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
    </InsightProvider>
  );
}
```

## Verify

1. The project's typecheck passes.
2. The chart renders with its title, subtitle, value labels and source line.
3. The number in the title matches the data.
4. At about 380px wide and in dark mode no label is clipped or overlapping.

## Common mistakes

- Passing an accessor function such as `x={(d) => d.country}`. Pass the field name.
- Using `"percent"` on whole numbers. 42 prints as 4,200%. Use `"percent-raw"` or `"{value}%"`.
- Writing a title with two clauses or without a number.
- Setting a colour for each bar or line. Use `highlight`.
- Giving `BigNumber` chart props such as `title` or `data`.
- Using a gauge or a one-slice donut for one number. Use `BigNumber`.
