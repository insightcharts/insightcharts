---
title: Build a whole page from a template
goal: A complete page in the user's project rendered by one report-style template, with the user's titles, figures and charts in its props.
---
Build a page with one of the report-style templates. A template is one component that takes the whole page as props: a title, key figures, chart specs and sources. If the user has not given you the data and the main fact the page should state, ask for both.

## Before you start

{{DETECT}}

## Steps

1. Choose the template from the table below. Use an infographic template instead when the piece is one image with little text that is shared as a picture: see {{SITE_URL}}/agents/docs/infographics.md.
2. Read the chosen template's props and full example at `{{SITE_URL}}/agents/templates/<name>.md`.
3. Write the masthead. `title` is one plain statement of the main fact with its number and period.
4. Fill the figures, the slots and the closing source note as described under "Anatomy".
5. Render it. From JSON use `<Insight spec={spec} />`. From JSX import the template by name.
6. Validate a JSON spec against {{SITE_URL}}/schema/insight-spec.json before rendering.

## Choosing a template

{{TEMPLATE_TABLE}}

## Anatomy of a template spec

Most report-style templates use these prop names for the same content.

- `type`: the template name.
- `title` (required), `kicker`, `deck`, `byline`, `date`: the masthead.
- `figures`: plain data, not a slot. On `executive-brief` and `report-page` it is three or four objects `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`.
- Slots such as `hero`, `supporting`, `exhibit` and `timeline`: each takes a chart spec with its own `type`, or a React element. The template sets a height when the spec has none.
- `takeaway` on `executive-brief`: `{ lead, body }`, the callout beside the hero.
- `sources`, `period`, `method`, `note`, `credit`: the closing source note. `sources` is a string, `{ name, url? }` or an array of either.
- `theme`, `mode`: passed on to everything inside. `maxWidth` limits the width and centres the page.

Layout follows the width of the template's container, not the viewport.

## Slot or InsightSpec

- A prop typed `Slot` takes a spec object or a React element.
- A prop typed `InsightSpec` takes a spec object only, because the component merges props into it. These are `chart` on `chart-tabs`, `scrolly-chart` and `small-multiple-grid`.
- When you render a template with a named import and pass spec objects into its slots, call `registerAll()` once first, or `registerComponents({ LineChart, BarChart })` with only the components the specs name. `<Insight>` does this for you. Elements in slots need no registration.

## Data inside a template

Each chart spec in a slot takes its own `data`: inline rows, CSV text or a URL. Replace the example rows with the user's rows and point the field props (`x`, `y`, `series`, `name`, `value`) at the user's column names. Then rewrite every title and figure from the new numbers.

`data-explorer` is different. It takes one `data` prop and shares it with its `charts`. Those chart specs leave `data` out.

## Templates for sequences

- `visual-essay`: `blocks` is an ordered array. Each block has a `kind`: `prose` `{ text, lead? }`, `figure` `{ chart, caption? }`, `callout` `{ chart, lead, body }`, `scrolly` `{ chart, steps }`, `quote` `{ quote, attribution?, role? }`, `stats` `{ items }`, `multiples` `{ facet, ... }` or `break` `{ title, text? }`. A bare chart spec counts as a figure.
- `timeline-story`: `chapters` is an array of `{ date, title, text?, exhibit?, emphasis? }`, oldest first.
- `story-deck`: `cards` is an array. Each card has a `kind`: `title`, `stat`, `chart`, `quote` or `closing`.

A `scrolly` block pins its chart with `position: sticky`. No ancestor of the template may set `overflow: hidden`, `auto` or `scroll`.

## Minimal example

```tsx
import { Insight } from "insightcharts";

const spec = {
  type: "executive-brief",
  kicker: "Support review · Q3",
  title: "Median first reply time fell from 4.1 hours in June to 1.8 hours in September 2025",
  deck: "The triage rota began in July.",
  figures: [
    { value: "1.8 h", label: "Median first reply, September", delta: "−2.3 h", deltaLabel: "vs June", upIsGood: false },
    { value: 0.92, format: "percent", label: "Tickets answered within a day" },
    { value: 4.6, label: "Satisfaction, out of 5", context: "4.1 in June" },
  ],
  hero: {
    type: "line-chart",
    data: [
      { month: "Jun", hours: 4.1 },
      { month: "Jul", hours: 2.9 },
      { month: "Aug", hours: 2.1 },
      { month: "Sep", hours: 1.8 },
    ],
    x: "month",
    y: "hours",
    format: "{value} h",
    zero: true,
    title: "Median first reply time fell from 4.1 hours in June to 1.8 hours in September",
    subtitle: "Median hours to first reply, by month, 2025",
  },
  takeaway: { lead: "The median fell 2.3 hours in three months", body: "The median was 4.1 hours in June." },
  supporting: [
    {
      type: "bar-chart",
      data: [{ day: "Weekdays", hours: 1.4 }, { day: "Weekends", hours: 6.2 }],
      x: "day",
      y: "hours",
      format: "{value} h",
      highlight: "Weekends",
      title: "Weekend median first reply was 6.2 hours in September",
      subtitle: "Median hours to first reply, September 2025",
    },
  ],
  actions: [{ title: "Extend the rota to weekends", text: "The weekend median was 6.2 hours in September." }],
  sources: ["Helpdesk export"],
  period: "June to September 2025",
};

export function Brief() {
  return <Insight spec={spec} />;
}
```

The same template from JSX, with elements in the slots:

```tsx
import { ExecutiveBrief, LineChart } from "insightcharts";

<ExecutiveBrief
  title="Median first reply time fell from 4.1 hours in June to 1.8 hours in September 2025"
  figures={[{ value: "1.8 h", label: "Median first reply, September" }]}
  hero={<LineChart data={monthly} x="month" y="hours" title="Median hours to first reply, by month, 2025" />}
  sources={["Helpdesk export"]}
/>
```

## Verify

1. Typecheck JSX. Validate a JSON spec against the schema: unknown props fail.
2. Render the page. An unknown `type` anywhere in the tree shows an inline alert that lists the valid names. Fix the name it reports.
3. Check at desktop width and at about 380px. Figures and supporting charts must stack without clipped text.
4. Check dark mode.
5. Check that every number in `title`, `deck`, `figures`, `takeaway` and `actions` can be computed from the data in the charts.

## Common mistakes

- Putting a chart spec in `figures`. `figures` is data for big numbers.
- Passing a React element to a prop typed `InsightSpec`.
- Passing spec objects to a named-import template without `registerAll()` or `registerComponents()`.
- Keeping the example's titles after replacing the data.
- Giving a template a prop from another template. Check the props table of the one you chose.
- Passing functions in a spec that is stored or sent over the network.
