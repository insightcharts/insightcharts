---
title: Getting started for agents
description: The steps an AI coding agent follows to install InsightCharts and render a first chart in a React project.
order: 1
---

This page is written for an AI coding agent. Copy the prompt below into Claude Code, Cursor, Codex or another agent, or give the agent this page's URL.

{{PROMPT:self}}

## Render a first chart

Follow the steps in order. Stop and ask the user when a step says to.

### 1. Check the project

{{DETECT}}

The project must use React 18 or later. If it does not use React, tell the user and stop.

### 2. Install the package

{{INSTALL}}

There is no stylesheet to import and no Tailwind setup.

### 3. Ask for the data and the fact

Ask the user for the data and the one fact the chart should show. If the user wants a first chart only to check the install, use the example in step 4 unchanged.

### 4. Write the component file

Create a component file where the project keeps its components, for example `components/renewables-chart.tsx` or `src/components/renewables-chart.tsx`.

```tsx
import { BarChart } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
  { country: "Germany", share: 52 },
  { country: "United States", share: 23 },
];

export function RenewablesChart() {
  return (
    <BarChart
      data={data}
      x="country"
      y="share"
      format="{value}%"
      highlight="Norway"
      title="Renewables supplied 98% of Norway's electricity in 2023"
      subtitle="Share of electricity generation from renewables, 2023"
      source="Ember"
      note="Illustrative figures"
    />
  );
}
```

Every chart has the same four groups of props.

| Group | Props | What to pass |
|---|---|---|
| Data | `data`, `transform` | Row objects, CSV text, a URL or an async function. `transform` reshapes the rows first. |
| Fields | `x`, `y`, `series` and others | Column names as strings. There are no accessor functions. |
| Text | `title`, `subtitle`, `source`, `note` | One plain fact with its number, then the measure and period, then the source. |
| Emphasis | `highlight`, `annotations` | The entity the title is about, and up to three marks on a date, a threshold or a value. |

### 5. Render it on a page

Import the component into an existing page or route and render it inside a container with a width. The chart fills the width of its container. The height defaults to 360 pixels, and a horizontal bar chart grows with its rows.

```tsx
import { RenewablesChart } from "@/components/renewables-chart";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <RenewablesChart />
    </main>
  );
}
```

Adjust the import path to the project's alias or use a relative path.

In Next.js the chart can be imported into a server component, because every prop above is serialisable. Add `"use client"` at the top of the component file when the chart takes a function prop such as `onSelect`, `onEvents`, `onReady`, or a function `format`, `transform`, `data` or `option`.

### 6. Verify

1. Run the project's typecheck. A misspelt prop is a type error.
2. Start the dev server and open the page.
3. Check that the title, the bars with their value labels and the source line are all drawn.
4. Check the page at about 380 pixels wide. No label may be clipped or overlap another.
5. Switch the page to dark mode if it has one. The chart follows the page.
6. Check the browser console for errors.

### 7. Replace the example with the user's data

1. Replace `data` with the user's rows, CSV text or URL.
2. Point `x` and `y` at the user's column names.
3. Work out the fact from the rows and write it as `title`, with its number and period.
4. Set `highlight` to the entity the title names.
5. Set `source` to where the data comes from.

## Go further

| Next job | Page |
|---|---|
| Install the skill or the registry for your agent | [Set up your agent](/docs/agents/setup) |
| Follow the full method for a figure | [The agent workflow](/docs/agents/workflow) |
| Pick the right component | [Choosing a component](/docs/agents/choosing) |
| Write titles and text | [Writing rules for agents](/docs/agents/writing) |
| Produce a chart as JSON | [JSON specs](/docs/agents/json-specs) |
| Copy a prompt for a common job | [Prompt library](/docs/agents/prompts) |
| Find a machine-readable file | [Reference endpoints](/docs/agents/endpoints) |

Every page of this site has a "Copy agent instructions" button. The instructions for one component are at `{{SITE_URL}}/agents/<atoms|molecules|templates>/<name>.md`, for example `{{SITE_URL}}/agents/atoms/line-chart.md`.
