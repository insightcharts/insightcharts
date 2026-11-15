# Prompt library

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Each prompt below is complete. Copy one, fill in the lines at the top with your data and the fact to show, and paste it into your agent. Each prompt is also published as plain text at `https://insightcharts.dev/agents/prompts/<id>.md`, so you can give an agent the URL instead.

## Use a prompt

1. Copy the prompt for the job.
2. Replace each fill-in line with your input. Leave a line blank where the prompt says the agent may propose a value.
3. Paste the prompt into the agent in the root of your React project.
4. Check the result with the verify list at the end of the prompt.

## Prompts

### Draw one chart from a CSV file

Loads a CSV file, chooses a chart form, and renders one chart with a title that states one fact from the data.

Prompt: https://insightcharts.dev/agents/prompts/single-chart-from-csv.md

### Build a row of key numbers

Renders two to eight key figures with their changes as a stat row or a KPI grid.

Prompt: https://insightcharts.dev/agents/prompts/kpi-row.md

### Write an executive brief

Builds a one-page brief with a headline, key figures, a hero chart, supporting charts and recommended actions.

Prompt: https://insightcharts.dev/agents/prompts/executive-brief.md

### Build a scroll story

Pins one chart and changes one prop at each step as the reader scrolls, swipes or steps through the text.

Prompt: https://insightcharts.dev/agents/prompts/scroll-story.md

### Build a cross-filtered explorer

Draws two to four charts over one dataset so that a click on one chart filters the others.

Prompt: https://insightcharts.dev/agents/prompts/crossfilter-explorer.md

### Build an infographic poster

Draws one designed poster from a JSON spec with an infographic template and a poster theme.

Prompt: https://insightcharts.dev/agents/prompts/infographic-poster.md

### Restyle charts to a brand theme

Applies a brand's colours and fonts to every InsightCharts component in a project, in light and dark mode.

Prompt: https://insightcharts.dev/agents/prompts/brand-theme.md

### Convert a Recharts or Chart.js chart

Replaces an existing Recharts or Chart.js chart with the matching InsightCharts component and a title that states one fact.

Prompt: https://insightcharts.dev/agents/prompts/convert-recharts-chartjs.md

## Write your own prompt

A prompt for a chart needs four things.

1. The data, or the path to it.
2. The one fact the chart should show, or an instruction to propose one from the data.
3. The component name, or an instruction to choose one with [Choosing a component](https://insightcharts.dev/docs/agents/choosing).
4. The [writing rules](https://insightcharts.dev/docs/agents/writing) for the title, or the URL of the component's instructions: `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

Every page of this site has a "Copy agent instructions" button. Use the button on a component page to get a prompt for that component, and the button on one example to get a prompt that reproduces that example.

## Reference

- This page: https://insightcharts.dev/docs/agents/prompts
- These instructions as plain text: https://insightcharts.dev/agents/docs/agents/prompts.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
