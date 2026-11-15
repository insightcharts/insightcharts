# Build a whole page from a template

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: A complete page in the user's project rendered by one report-style template, with the user's titles, figures and charts in its props.

Build a page with one of the report-style templates. A template is one component that takes the whole page as props: a title, key figures, chart specs and sources. If the user has not given you the data and the main fact the page should state, ask for both.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Choose the template from the table below. Use an infographic template instead when the piece is one image with little text that is shared as a picture: see https://insightcharts.dev/agents/docs/infographics.md.
2. Read the chosen template's props and full example at `https://insightcharts.dev/agents/templates/<name>.md`.
3. Write the masthead. `title` is one plain statement of the main fact with its number and period.
4. Fill the figures, the slots and the closing source note as described under "Anatomy".
5. Render it. From JSON use `<Insight spec={spec} />`. From JSX import the template by name.
6. Validate a JSON spec against https://insightcharts.dev/schema/insight-spec.json before rendering.

## Choosing a template

| Component | Use it when | Pick something else when |
|---|---|---|
| [comparison-brief](https://insightcharts.dev/agents/templates/comparison-brief.md) | Use it for two things a reader has to choose between or compare, such as two countries, two products or a before and an after. Write the result with its number in the headline. Put the four or five most important measures in `figures`. Use a two-series line, dumbbell, slope or `before-after` as the hero. In each pair, use the same chart form and the same scale for both sides. The `subject` side takes the accent colour everywhere and the other side stays grey. | Three or more things (use a `comparison-table` or `small-multiple-grid` inside a `report-page`). One thing over time with nothing to compare it with (use `timeline-story`). Paired charts on different scales, because readers compare bar lengths across the pair. |
| [data-explorer](https://insightcharts.dev/agents/templates/data-explorer.md) | Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size. | A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures. |
| [executive-brief](https://insightcharts.dev/agents/templates/executive-brief.md) | Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page. | More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`). |
| [explainer](https://insightcharts.dev/agents/templates/explainer.md) | Use it to explain one subject to a general audience in a single narrow column. The column also works as a tall image or on a phone screen. State the main finding with its number in the headline and repeat the main number in `hook`. Make the hero exhibit the largest thing on the page. Give each numbered section one heading, one exhibit and one sentence with its main number. Write each section so it can be read without the others. Keep one accent colour on the subject (`highlight`) throughout. | Findings that need caveats and separate interpretation (use `report-page`). A chart that has to change step by step (use `visual-essay` with a scrolly block). More than five sections, because readers stop before the end. |
| [report-page](https://insightcharts.dev/agents/templates/report-page.md) | Use it for readers who will check the reasoning, as in evaluations, research notes, audits and experiment write-ups. State the main finding with its number in the title. Put all the main findings and the recommendation in the summary. Write each finding title as one fact with its number, and give it an exhibit that shows that fact. Put what the data shows in `observation` and what you infer from it in `interpretation`. End with method, limitations and sources. | A decision-maker who wants only the result (use `executive-brief`). A general audience (use `explainer` or `visual-essay`). Findings without an exhibit. Put those in the summary. |
| [scorecard](https://insightcharts.dev/agents/templates/scorecard.md) | Use it for weekly or monthly numbers. Keep the layout the same in every edition so readers know where each number is. Change the headline each edition to state the main change with its number. The headline and the KPI row should be enough for a reader who stops there. The ranking, trends and notes add detail. Highlight the one row or series the headline is about and leave the rest grey. | A one-off finding (use `executive-brief`). Readers who need to filter the data themselves (use `data-explorer`). More than six KPIs. |
| [social-card](https://insightcharts.dev/agents/templates/social-card.md) | Use it for one finding that will be shared in a feed, a slide or a chat thread with no text around it. State the fact with its number in the headline. Use one simple exhibit, such as one highlighted bar, one line or one number. Put the source and your name on the card, because it will be shared without the page. Use 1:1 or 4:5 for feeds, 16:9 for slides and link previews, 9:16 for stories. | More than one fact or more than one exhibit (use `story-deck` for a sequence, `executive-brief` for a page). Charts that need a legend, small labels or hovering to read, because a shared image is not interactive. An exhibit with its own `title`, because the card's headline is the title. |
| [story-deck](https://insightcharts.dev/agents/templates/story-deck.md) | Use it for a short sequence read on a phone, such as a “year in review”. Each card should be readable in a couple of seconds. State the main fact with its number on the title card. Put one fact on each later card, as a number or as one chart with one highlighted mark under a headline that states the fact. Use five to ten cards. End with a closing card and the sources. Charts in cards should have few data points and direct labels, with no legend. | Findings that need two exhibits in view at once (use `executive-brief`). A single shareable image (use `social-card`). Dense charts or long paragraphs, because a card has little room. One chart that changes step by step (use `scrolly-chart` in `steps` mode). |
| [timeline-story](https://insightcharts.dev/agents/templates/timeline-story.md) | Use it when the reader needs the events in date order to understand a change. State the change over the whole period in the headline, with the numbers and dates. Mark the main events on the overview exhibit as annotations. Give each chapter one event. Add a small figure to a chapter only when it has a number to show. Mark the two or three most important events with `emphasis`. | Events with no measure that runs through the period (use a plain `annotated-timeline`). A comparison of two states with nothing in between (use `comparison-brief`). More than eight chapters. Merge minor events into the text of the chapter before or after. |
| [visual-essay](https://insightcharts.dev/agents/templates/visual-essay.md) | Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart. | A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps. |

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

## Reference

- This page: https://insightcharts.dev/docs/templates
- These instructions as plain text: https://insightcharts.dev/agents/docs/templates.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
