---
title: Prompt library
description: Ready-to-copy prompts that tell an agent how to do eight common jobs with InsightCharts.
order: 7
---

Each prompt below is complete. Copy one, fill in the lines at the top with your data and the fact to show, and paste it into your agent. Each prompt is also published as plain text at `{{SITE_URL}}/agents/prompts/<id>.md`, so you can give an agent the URL instead.

## Use a prompt

1. Copy the prompt for the job.
2. Replace each fill-in line with your input. Leave a line blank where the prompt says the agent may propose a value.
3. Paste the prompt into the agent in the root of your React project.
4. Check the result with the verify list at the end of the prompt.

## Prompts

{{LIBRARY}}

## Write your own prompt

A prompt for a chart needs four things.

1. The data, or the path to it.
2. The one fact the chart should show, or an instruction to propose one from the data.
3. The component name, or an instruction to choose one with [Choosing a component](/docs/agents/choosing).
4. The [writing rules](/docs/agents/writing) for the title, or the URL of the component's instructions: `{{SITE_URL}}/agents/<atoms|molecules|templates>/<name>.md`.

Every page of this site has a "Copy agent instructions" button. Use the button on a component page to get a prompt for that component, and the button on one example to get a prompt that reproduces that example.
