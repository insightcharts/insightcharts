# Choose and add an InsightCharts template

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: choose the template that fits the user's data, then follow that component's own instructions. If the user has not given you the data and the one fact they want to show, ask for both before you choose.

## What a template is

A template is a complete page built from molecules and atoms: an executive brief, a report page, a scroll-driven essay, a filterable explorer. It takes all of its content as props, so a whole page can be one JSON document.

Use a report-style template when the reader needs paragraphs, a method note, recommendations or charts with axes. When the piece is one image with little text, use an infographic (`https://insightcharts.dev/agents/infographics.md`). When the user wants one chart or one arrangement, use an atom or a molecule (`https://insightcharts.dev/agents/atoms.md`, `https://insightcharts.dev/agents/molecules.md`).

## Choose

1. Write down what the data has to show, in one sentence with its number.
2. Find that job in the first column of the table. There are 10 components.
3. Read "Use it when" for each candidate. If "Pick something else when" describes the user's data, take the component it names.
4. Open the instructions for the component you chose: `https://insightcharts.dev/agents/templates/<name>.md`, for example https://insightcharts.dev/agents/templates/executive-brief.md.

| The data's job | Component | Use it when | Pick something else when |
|---|---|---|---|
| Arrange several pieces | `comparison-brief` | Use it for two things a reader has to choose between or compare, such as two countries, two products or a before and an after. Write the result with its number in the headline. Put the four or five most important measures in `figures`. Use a two-series line, dumbbell, slope or `before-after` as the hero. In each pair, use the same chart form and the same scale for both sides. The `subject` side takes the accent colour everywhere and the other side stays grey. | Three or more things (use a `comparison-table` or `small-multiple-grid` inside a `report-page`). One thing over time with nothing to compare it with (use `timeline-story`). Paired charts on different scales, because readers compare bar lengths across the pair. |
| Arrange several pieces | `executive-brief` | Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page. | More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`). |
| Arrange several pieces | `report-page` | Use it for readers who will check the reasoning, as in evaluations, research notes, audits and experiment write-ups. State the main finding with its number in the title. Put all the main findings and the recommendation in the summary. Write each finding title as one fact with its number, and give it an exhibit that shows that fact. Put what the data shows in `observation` and what you infer from it in `interpretation`. End with method, limitations and sources. | A decision-maker who wants only the result (use `executive-brief`). A general audience (use `explainer` or `visual-essay`). Findings without an exhibit. Put those in the summary. |
| Arrange several pieces | `scorecard` | Use it for weekly or monthly numbers. Keep the layout the same in every edition so readers know where each number is. Change the headline each edition to state the main change with its number. The headline and the KPI row should be enough for a reader who stops there. The ranking, trends and notes add detail. Highlight the one row or series the headline is about and leave the rest grey. | A one-off finding (use `executive-brief`). Readers who need to filter the data themselves (use `data-explorer`). More than six KPIs. |
| Arrange several pieces | `social-card` | Use it for one finding that will be shared in a feed, a slide or a chat thread with no text around it. State the fact with its number in the headline. Use one simple exhibit, such as one highlighted bar, one line or one number. Put the source and your name on the card, because it will be shared without the page. Use 1:1 or 4:5 for feeds, 16:9 for slides and link previews, 9:16 for stories. | More than one fact or more than one exhibit (use `story-deck` for a sequence, `executive-brief` for a page). Charts that need a legend, small labels or hovering to read, because a shared image is not interactive. An exhibit with its own `title`, because the card's headline is the title. |
| Show a sequence of steps | `data-explorer` | Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size. | A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures. |
| Show a sequence of steps | `explainer` | Use it to explain one subject to a general audience in a single narrow column. The column also works as a tall image or on a phone screen. State the main finding with its number in the headline and repeat the main number in `hook`. Make the hero exhibit the largest thing on the page. Give each numbered section one heading, one exhibit and one sentence with its main number. Write each section so it can be read without the others. Keep one accent colour on the subject (`highlight`) throughout. | Findings that need caveats and separate interpretation (use `report-page`). A chart that has to change step by step (use `visual-essay` with a scrolly block). More than five sections, because readers stop before the end. |
| Show a sequence of steps | `story-deck` | Use it for a short sequence read on a phone, such as a “year in review”. Each card should be readable in a couple of seconds. State the main fact with its number on the title card. Put one fact on each later card, as a number or as one chart with one highlighted mark under a headline that states the fact. Use five to ten cards. End with a closing card and the sources. Charts in cards should have few data points and direct labels, with no legend. | Findings that need two exhibits in view at once (use `executive-brief`). A single shareable image (use `social-card`). Dense charts or long paragraphs, because a card has little room. One chart that changes step by step (use `scrolly-chart` in `steps` mode). |
| Show a sequence of steps | `timeline-story` | Use it when the reader needs the events in date order to understand a change. State the change over the whole period in the headline, with the numbers and dates. Mark the main events on the overview exhibit as annotations. Give each chapter one event. Add a small figure to a chapter only when it has a number to show. Mark the two or three most important events with `emphasis`. | Events with no measure that runs through the period (use a plain `annotated-timeline`). A comparison of two states with nothing in between (use `comparison-brief`). More than eight chapters. Merge minor events into the text of the chapter before or after. |
| Show a sequence of steps | `visual-essay` | Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart. | A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps. |

The 10 infographic templates are not in this table. They are in https://insightcharts.dev/agents/infographics.md.

## Install and import

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/executive-brief
```

The file lands at `components/insightcharts/templates/executive-brief.tsx`. Import the component from there when you install it this way.

Import by the component's React name, which is the kebab-case name in PascalCase:

```tsx
import { ExecutiveBrief } from "insightcharts";
```

Or write it as a JSON spec and render it with `Insight`: `<Insight spec={{ type: "executive-brief", ...props }} />`. Use only the names in the table. Any other name does not render.

## Rules for every component

- Write `title` as one plain statement of fact with its number and its period, in one clause: "Monthly churn fell from 4.2% to 2.1% in 2024". A plain label is acceptable when there is no single fact: "Monthly churn, 2024".
- Set `subtitle` to the measure, unit, population and period, and `source` to where the data is from.
- Do not set colours. Colour comes from the theme. Set `highlight` to the entity the title is about.
- Bars start at zero. No dual axes. No 3D. Label marks directly.

## Reference

- How to choose across all levels: https://insightcharts.dev/agents/docs/agents/choosing.md
- This page: https://insightcharts.dev/templates
- These instructions as plain text: https://insightcharts.dev/agents/templates.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
