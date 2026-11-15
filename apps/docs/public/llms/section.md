# Section (`section`)

> A story section: a numbered step marker or a headline, introductory prose, then one or more exhibits in a responsive one- to three-column grid.

- Component: `Section` (import from `insightcharts`)
- Spec type: `"section"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

The building block of a longer piece. Each section states one fact with its number in the title, explains it in a paragraph and shows it in one to three exhibits. Use `step` when the sections are read in order.

## Avoid

The opening of a piece (use `hero-figure`); a single chart with one callout (use `chart-callout` directly); more than three exhibits in one section (split it).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/section
```

The file lands at `components/insightcharts/molecules/section.tsx`. `@insightcharts/section-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, LineChart, Section } from "insightcharts";

<Section
  theme="ocean"
  step={2}
  total={4}
  title="First-quarter churn was 2.0% for customers who joined after March"
  intro="Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%."
  columns={2}
  body={[
    <LineChart
      data={[
        { month: "2024-01-01", rate: 4.2 },
        { month: "2024-02-01", rate: 4.3 },
        { month: "2024-03-01", rate: 4.1 },
        { month: "2024-04-01", rate: 3.6 },
        { month: "2024-05-01", rate: 3.1 },
        { month: "2024-06-01", rate: 2.9 },
        { month: "2024-07-01", rate: 2.6 },
        { month: "2024-08-01", rate: 2.4 },
        { month: "2024-09-01", rate: 2.3 },
        { month: "2024-10-01", rate: 2.2 },
        { month: "2024-11-01", rate: 2.1 },
        { month: "2024-12-01", rate: 2.1 },
      ]}
      x="month"
      y="rate"
      format="{value}%"
      zero
      height={240}
      title="Monthly churn fell from 4.2% to 2.1% in 2024"
      subtitle="Monthly customer churn, 2024"
      annotations={[{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }]}
    />,
    <BarChart
      data={[{ cohort: "Before March", churn: 4.1 }, { cohort: "After March", churn: 2 }]}
      x="cohort"
      y="churn"
      format="{value}%"
      height={240}
      highlight="After March"
      title="First-quarter churn was 4.1% for customers who joined before March"
      subtitle="First-quarter churn by sign-up cohort, 2024"
    />,
  ]}
  outro="The next section covers the first 90 days after sign-up."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "section",
  "theme": "ocean",
  "step": 2,
  "total": 4,
  "title": "First-quarter churn was 2.0% for customers who joined after March",
  "intro": "Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%.",
  "columns": 2,
  "body": [
    {
      "type": "line-chart",
      "data": [
        { "month": "2024-01-01", "rate": 4.2 },
        { "month": "2024-02-01", "rate": 4.3 },
        { "month": "2024-03-01", "rate": 4.1 },
        { "month": "2024-04-01", "rate": 3.6 },
        { "month": "2024-05-01", "rate": 3.1 },
        { "month": "2024-06-01", "rate": 2.9 },
        { "month": "2024-07-01", "rate": 2.6 },
        { "month": "2024-08-01", "rate": 2.4 },
        { "month": "2024-09-01", "rate": 2.3 },
        { "month": "2024-10-01", "rate": 2.2 },
        { "month": "2024-11-01", "rate": 2.1 },
        { "month": "2024-12-01", "rate": 2.1 }
      ],
      "x": "month",
      "y": "rate",
      "format": "{value}%",
      "zero": true,
      "height": 240,
      "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
      "subtitle": "Monthly customer churn, 2024",
      "annotations": [{ "type": "line", "axis": "x", "value": "2024-03-01", "label": "New onboarding" }]
    },
    {
      "type": "bar-chart",
      "data": [{ "cohort": "Before March", "churn": 4.1 }, { "cohort": "After March", "churn": 2 }],
      "x": "cohort",
      "y": "churn",
      "format": "{value}%",
      "height": 240,
      "highlight": "After March",
      "title": "First-quarter churn was 4.1% for customers who joined before March",
      "subtitle": "First-quarter churn by sign-up cohort, 2024"
    }
  ],
  "outro": "The next section covers the first 90 days after sign-up."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` |  | The section's main fact, as one plain sentence with its number. |
| `step` | `number \| string` |  | Step number: turns the heading into a numbered chapter marker ("02 — ..."). |
| `total` | `number` |  | Total steps, shown as "02 / 05". |
| `kicker` | `string` |  | Small label above an unnumbered heading. |
| `deck` | `string` |  | One plain sentence under the heading that adds a second fact. |
| `intro` | `string \| string[]` |  | Introductory narration. Supports `**bold**`, `*italic*` and links. |
| `body` | `Slot \| Slot[]` |  | The exhibits: one slot or several, each a spec or a React element. |
| `columns` | `1 \| 2 \| 3` | `1` | Columns for the body at full width; reduced under 720px and 520px. |
| `outro` | `string \| string[]` |  | Closing narration under the body. |
| `rule` | `boolean` | `false` | Hairline above the section. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level. |
| `id` | `string` |  | Anchor id for deep links. |
| `spacing` | `"compact" \| "comfortable"` | `"comfortable"` | Vertical rhythm between heading, intro and body. |
| `children` | `ReactNode` |  | JSX alternative to `body`; each child becomes a grid item. |
| `theme` | `ThemeInput` |  | A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the component. |
| `frame` | `boolean` |  | Paint the theme's surface behind the component. Default: on for a named theme with its own surface. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [step-marker](https://insightcharts.dev/llms/step-marker.md), [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [area-chart](https://insightcharts.dev/llms/area-chart.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md)
- Used by: no molecule or template yet

## More examples

### Unnumbered, one exhibit, with a rule and one accent overridden

```tsx
import { LineChart, Section } from "insightcharts";

<Section
  theme={{ accent: "#0f766e" }}
  rule
  kicker="Retention"
  title="Monthly churn was between 2.1% and 2.4% from August to December 2024"
  deck="It was 4.2% in January."
  body={<LineChart
    data={[
      { month: "2024-01-01", rate: 4.2 },
      { month: "2024-02-01", rate: 4.3 },
      { month: "2024-03-01", rate: 4.1 },
      { month: "2024-04-01", rate: 3.6 },
      { month: "2024-05-01", rate: 3.1 },
      { month: "2024-06-01", rate: 2.9 },
      { month: "2024-07-01", rate: 2.6 },
      { month: "2024-08-01", rate: 2.4 },
      { month: "2024-09-01", rate: 2.3 },
      { month: "2024-10-01", rate: 2.2 },
      { month: "2024-11-01", rate: 2.1 },
      { month: "2024-12-01", rate: 2.1 },
    ]}
    x="month"
    y="rate"
    format="{value}%"
    zero
    height={260}
  />}
/>
```

### Three columns of figures, mono theme

```tsx
import { Section, StatTile } from "insightcharts";

<Section
  theme="mono"
  title="Product metrics, December 2024"
  columns={3}
  spacing="compact"
  body={[
    <StatTile
      label="Monthly churn"
      value="2.1%"
      delta="−2.1 pts"
      deltaLabel="vs January"
      upIsGood={false}
    />,
    <StatTile
      label="Monthly active users"
      value={48210}
      format="compact"
      delta={0.265}
      deltaLabel="vs January"
    />,
    <StatTile
      label="Net revenue retention"
      value={1.12}
      format="percent"
      context="Top quartile is 110%"
    />,
  ]}
/>
```

### First step with two chart forms, sunrise theme

```tsx
import { AreaChart, BarChart, Section } from "insightcharts";

<Section
  theme="sunrise"
  step={1}
  total={3}
  kicker="Cycling in Seville"
  title="Bicycle trips rose from 0.5% to 6.0% of all trips between 2006 and 2011"
  intro="Seville had 12 km of protected cycle lanes in 2006. It had 152 km in 2011. The city built **65 km** of them in 2007."
  columns={2}
  body={[
    <AreaChart
      data={[
        { year: "2006", share: 0.5 },
        { year: "2007", share: 1.9 },
        { year: "2008", share: 3.2 },
        { year: "2009", share: 4.6 },
        { year: "2010", share: 5.6 },
        { year: "2011", share: 6 },
      ]}
      x="year"
      y="share"
      format="{value}%"
      height={240}
      title="The bicycle share of trips was 6.0% in 2011"
      subtitle="Share of all trips made by bicycle, Seville, 2006 to 2011"
    />,
    <BarChart
      data={[
        { year: "2006", km: 12 },
        { year: "2007", km: 77 },
        { year: "2008", km: 98 },
        { year: "2009", km: 120 },
        { year: "2010", km: 140 },
        { year: "2011", km: 152 },
      ]}
      x="year"
      y="km"
      sort="none"
      orientation="vertical"
      format="{value} km"
      highlight="2007"
      height={240}
      title="The network grew from 12 km to 77 km in 2007"
      subtitle="Protected cycle lanes in Seville, km at year end, 2006 to 2011"
    />,
  ]}
  outro="Figures are approximate, for illustration."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/section.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/section.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
