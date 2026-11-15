# Choose and add an InsightCharts molecule

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: choose the molecule that fits the user's data, then follow that component's own instructions. If the user has not given you the data and the one fact they want to show, ask for both before you choose.

## What a molecule is

A molecule is a combination of atoms that makes one point: a row of statistics, a chart with a callout beside it, a set of linked charts. It takes the content of its parts as props, and nested charts as specs or elements.

Use a molecule when the arrangement the user wants is in the table below. When they want a single chart, use an atom (`https://insightcharts.dev/agents/atoms.md`). When they want a whole page or a poster, use a template (`https://insightcharts.dev/agents/templates.md`, `https://insightcharts.dev/agents/infographics.md`).

## Choose

1. Write down what the data has to show, in one sentence with its number.
2. Find that job in the first column of the table. There are 19 components.
3. Read "Use it when" for each candidate. If "Pick something else when" describes the user's data, take the component it names.
4. Open the instructions for the component you chose: `https://insightcharts.dev/agents/molecules/<name>.md`, for example https://insightcharts.dev/agents/molecules/stat-row.md.

| The data's job | Component | Use it when | Pick something else when |
|---|---|---|---|
| Draw a poster graphic | `poster` | Use it as the outer frame of any infographic: one dominant graphic with a few supporting panels, on a painted ground. Give it a poster theme (`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`) and put a chart or figure spec in each panel. Put the one fact in `title` and keep panel headings short. It reflows to one column under 600px. | Long reading text or more than about six panels (use `report-page` or `visual-essay`). A single fact at a fixed social size (use `social-card`). Charts that need axes, gridlines and dense labels to be read, because a poster ground suits large flat marks with their values printed on them. |
| Arrange several pieces | `before-after` | A single measure at two moments or under two conditions: before and after a policy, control and treatment, last year and this. The change is computed from the two values unless you state it. | More than two states (use `line-chart` or `slope-chart`); many entities each with a before and after (use `dumbbell-chart` or `arrow-chart`); two unrelated figures (use `stat-row`). |
| Arrange several pieces | `chart-callout` | Whenever a chart needs its meaning stated in words next to it: the standard chart-plus-interpretation unit of a report. The chart's title states the main fact with its number. The callout adds a second fact, a cause or a caveat in plain words. | Repeating the chart title in the callout; long narration (put `prose` before the chart instead); a chart that is already a small tile (the callout would outweigh it). |
| Arrange several pieces | `chart-tabs` | The same entities under two to five measures or scalings where each view changes the reading: total / per capita / change, absolute / share, linear / log. Give the frame a plain label as its title. Each view's `subtitle` names its measure. | Hiding the most important view behind a tab (show it first, or show both with `small-multiple-grid`); unrelated charts (give each its own figure); more than five views. |
| Arrange several pieces | `comparison-table` | Comparing five to twenty entities on a level, a trend and a change at once: countries, products, teams. Readers look up their row. The sparkline and delta show how the value changed. | Plain lookups with no series (use `data-table`); one measure ranked (use `ranked-list` or `bar-chart`); trends the reader must compare precisely (use `small-multiples`). Each sparkline has its own scale, so it shows the direction of change and cannot be used to compare levels between rows. |
| Arrange several pieces | `filter-chips` | Inside any `<InsightData>` whose charts use `select`: put it above the charts so readers can see what is filtered, drop one value, or clear everything. `linked-charts` already includes it. | Outside `<InsightData>` it renders nothing unless you pass `selections` yourself. It is not a filter builder: selections are made by clicking marks in the charts. |
| Arrange several pieces | `kpi-grid` | The top of a dashboard or a monthly report: three to eight metrics tracked over the same periods. Pass one table with a column per metric. | Figures without a series behind them (use `stat-row`); comparing the metrics with each other on one scale (use `line-chart` or `small-multiples`); more than eight cards. |
| Arrange several pieces | `linked-charts` | Exploration of one table along several dimensions: by region, by category and over time. Pass row-level data once; each chart aggregates it with its own `transform`, sets `select: true` and omits `data`. | A report that states one fixed fact (use `chart-callout` or `scrolly-chart`); charts over unrelated datasets (they cannot filter each other); more than four charts. |
| Arrange several pieces | `metric-breakdown` | A total that the reader will immediately want split: a budget by department, revenue by product line, emissions by sector. Two to six parts that add up to the number above them. | Parts that do not sum to the headline; more than about six parts (use `bar-chart`); composition compared across groups or over time (use `bar-chart` with `stack: "percent"` or `area-chart`). |
| Arrange several pieces | `ranked-list` | A top-N list where the names matter as much as the values: league tables, best and worst performers, leaderboards with a movement column. It keeps long names readable and works in a narrow column. | Precise visual comparison of many values or more than about 15 rows (use `bar-chart`); several measures per entity (use `data-table` or `comparison-table`); rank changing over time (use `bump-chart`). |
| Arrange several pieces | `small-multiple-grid` | Faceting a chart form the `small-multiples` atom does not draw: stacked bars, scatter plots, donuts, waffles, dumbbells, histograms. Also when each panel should be a full chart with its own tooltip and axis. | Line, area or bar facets that must share one value scale: use the `small-multiples` atom, which draws every panel in one chart on a common axis. Here each panel scales to its own rows unless the spec fixes the axis (for example `option: { xAxis: { max: 70 } }`), so say so in the subtitle or fix it. More than about twelve panels. |
| Arrange several pieces | `stat-row` | The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance. | More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: "hero"`), or figures that need their history shown (use `kpi-grid`, or `variant: "tiles"` with a `trend`). |
| Arrange several pieces | `trend-card` | A metric whose recent history matters as much as its level: users, revenue, response time. Pass the series and field names; the figure, the change and the sparkline all come from the same rows, so they cannot disagree. | A number with no history (use `big-number` or `stat-tile`); several metrics from one dataset (use `kpi-grid`); a series the reader must read values from (use `line-chart`). |
| Show a sequence of steps | `annotated-timeline` | Telling how something unfolded when the events matter more than a continuous measure: a policy history, an incident, a product's milestones. Four to eight events; give a figure only to the ones where a number changed. | Events that should be read against a time scale, with gaps and overlaps to scale (use `timeline-chart`); a continuous series with a few annotated moments (use `line-chart` with `annotations`); ordered steps that are not dated (use `section` with `step`). |
| Show a sequence of steps | `hero-figure` | At the very top of a data story or a one-page report. The headline states the main fact with its number. The chart shows that fact. | Giving the chart its own `title` (the headline is the title; use the chart's `subtitle` for the measure). A second hero on the same page: later sections use `section` or `chart-callout`. |
| Show a sequence of steps | `proportion-statement` | One proportion that is easier to read as a count of people or units than as a percentage. Round to a small whole first: 1 in 4 with icons, 37 in every 100 with a waffle. | Several shares side by side (use `bar-chart`, or `waffle-chart` with categories); a precise percentage where the decimals matter (use `big-number`); totals above 100. |
| Show a sequence of steps | `quote-figure` | A quotation shown next to the number it refers to: an interview finding with its survey figure, an executive's statement with the metric. One per section. | A quote with no evidence (use `pull-quote`); a figure that needs axes to read (use `chart-callout` and put the quote in prose); unattributed quotations. |
| Show a sequence of steps | `scrolly-chart` | Walking a reader through one chart in stages: show everything, highlight the subject, change the measure, add the annotation. Make ONE change per step (the highlight, the data or the encoding) so the reader can see what changed. | Steps that change several things at once, or that swap to an unrelated chart (start a new `section` instead). More than about seven steps. A fact that one view can show (use `chart-callout`). In documents that will be printed or embedded in a short frame, set `scrollMode: "steps"`. |
| Show a sequence of steps | `section` | The building block of a longer piece. Each section states one fact with its number in the title, explains it in a paragraph and shows it in one to three exhibits. Use `step` when the sections are read in order. | The opening of a piece (use `hero-figure`); a single chart with one callout (use `chart-callout` directly); more than three exhibits in one section (split it). |

## Install and import

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-row
```

The file lands at `components/insightcharts/molecules/stat-row.tsx`. Import the component from there when you install it this way.

Import by the component's React name, which is the kebab-case name in PascalCase:

```tsx
import { StatRow } from "insightcharts";
```

Or write it as a JSON spec and render it with `Insight`: `<Insight spec={{ type: "stat-row", ...props }} />`. Use only the names in the table. Any other name does not render.

## Rules for every component

- Write `title` as one plain statement of fact with its number and its period, in one clause: "Monthly churn fell from 4.2% to 2.1% in 2024". A plain label is acceptable when there is no single fact: "Monthly churn, 2024".
- Set `subtitle` to the measure, unit, population and period, and `source` to where the data is from.
- Do not set colours. Colour comes from the theme. Set `highlight` to the entity the title is about.
- Bars start at zero. No dual axes. No 3D. Label marks directly.

## Reference

- How to choose across all levels: https://insightcharts.dev/agents/docs/agents/choosing.md
- This page: https://insightcharts.dev/molecules
- These instructions as plain text: https://insightcharts.dev/agents/molecules.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
