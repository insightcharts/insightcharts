# Recipes

Each recipe uses `bar-chart`, `line-chart` and `big-number`, which are the reference components. Check the component catalogue for more specific forms before settling on these.

Where a recipe shows its rows, the title states a fact from those rows. Where the rows are not shown (`data={rows}`), the title is a plain label. When you have the data, replace the label with one fact and its number, following the writing rules in "Choosing a form".

## Ranked bars with one highlighted

```tsx
const rows = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
  { country: "Germany", share: 52 },
];

<BarChart
  data={rows}
  x="country"
  y="share"
  format="{value}%"
  highlight="Brazil"
  title="Renewables supplied 89% of Brazil's electricity in 2023"
  subtitle="Share of electricity from renewables, 2023"
  source="Ember"
/>
```

A single-series bar chart sorts descending and labels each bar, so there is no value axis to read. `highlight` takes the category label.

## Top five plus Other

```tsx
<BarChart
  data={orders}
  transform={[
    { type: "aggregate", groupBy: "category", measures: { revenue: { op: "sum", field: "amount" } } },
    { type: "top", n: 5, by: "revenue", other: "Other", label: "category" },
  ]}
  x="category"
  y="revenue"
  format="currency:USD"
  title="Revenue by category"
/>
```

## Highlight one line among several

```tsx
<LineChart
  data={long}
  x="year"
  y="share"
  series="country"
  highlight="Denmark"
  format="percent"
  title="Wind share of electricity by country"
  subtitle="Wind as a share of electricity generation"
  source="Ember"
/>
```

Long data: one row per country per year. Every country other than Denmark is drawn in the context grey.

## Annotate a date, a period and a value

```tsx
<LineChart
  data={monthly}
  x="month"
  y="signups"
  annotations={[
    { type: "line", axis: "x", value: "2024-03", label: "Pricing change" },
    { type: "band", axis: "x", from: "2024-07", to: "2024-08", label: "Outage" },
    { type: "point", x: "2024-11", y: 4210, label: "4,210 in November" },
  ]}
  title="Signups reached 4,210 in November 2024"
  subtitle="New accounts per month, 2024"
  source="Internal analytics"
/>
```

Annotation `value`, `from`, `to` and `x` must match the x values in the data.

## Compare growth with an index

```tsx
<LineChart
  data={long}
  transform={{ type: "derive", as: "indexed", op: "index", fields: ["value"], groupBy: "country" }}
  x="year"
  y="indexed"
  series="country"
  title="GDP by country since 2019"
  subtitle="GDP index, 2019 = 100"
/>
```

The rebasing must be stated in the subtitle. Rows must already be in time order within each group.

## A big number with context

```tsx
<BigNumber
  value={0.317}
  format="percent"
  label="Share of global electricity from renewables"
  delta={0.021}
  deltaLabel="vs 2023"
  context="Up from 19% in 2010"
  size="hero"
/>
```

Numeric `delta` values are fractions rendered as signed percentages (`0.021` is +2.1%). Pass `upIsGood={false}` when an increase is bad.

## Stat row above a chart

Until a molecule covers your case, compose atoms with ordinary layout. Use container-friendly CSS (`minmax(0, 1fr)`, `minWidth: 0`) so charts can shrink.

```tsx
<section style={{ display: "grid", gap: "2rem" }}>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem" }}>
    <BigNumber value={1240000} format="compact" label="Active users" delta={0.12} deltaLabel="vs last quarter" />
    <BigNumber value={0.043} format="percent" label="Monthly churn" delta={-0.008} deltaLabel="vs last quarter" upIsGood={false} />
    <BigNumber value={38} format="{value} min" label="Median session" context="Also 38 min in January" />
  </div>
  <LineChart data={weekly} x="week" y="active" title="Weekly active users" source="Product analytics" />
</section>
```

## Load from an API on the server

```tsx
import { loadData } from "insightcharts/data";
import { BarChart } from "insightcharts";

export default async function Page() {
  const rows = await loadData({ url: "https://api.example.com/v1/emissions", path: "data.results" });
  return <BarChart data={rows} x="sector" y="mt_co2" format="{value} Mt" title="CO2 emissions by sector" source="Example API" />;
}
```

In a client-only app, pass the same `{ url, path }` object straight to `data`. The chart shows a skeleton while it loads.

## A JSON spec

```json
{
  "type": "bar-chart",
  "data": [
    { "country": "Norway", "share": 98 },
    { "country": "Brazil", "share": 89 },
    { "country": "Canada", "share": 68 }
  ],
  "x": "country",
  "y": "share",
  "format": "{value}%",
  "highlight": "Norway",
  "title": "Renewables supplied 98% of Norway's electricity in 2023",
  "subtitle": "Share of electricity generation from renewables, 2023",
  "source": "Ember"
}
```

Render with `<Insight spec={spec} />` and validate against `https://insightcharts.dev/schema/insight-spec.json`. `data` can also be a URL with a `transform`:

```json
{
  "type": "bar-chart",
  "data": { "url": "/data/renewables.csv" },
  "transform": [{ "type": "filter", "field": "year", "op": "==", "value": 2023 }],
  "x": "country",
  "y": "share",
  "title": "Renewable share of electricity by country, 2023"
}
```

## Override one ECharts setting

```tsx
<LineChart data={rows} x="date" y="price" option={{ yAxis: { min: 0, max: 200 } }} title="Daily price" />
```

`option` is deep-merged over what the component generates. Use a prop when one exists, and `option` only when none does.
