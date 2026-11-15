# Write an executive brief

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Data: <paths to the data files, or paste the tables here>
Main finding: <one sentence, or leave blank and propose one from the data>
Reader: <who will read the brief and what they will decide>
Actions to recommend: <a list, or leave blank and propose two to four>
Source of the data: <name of the source and the period it covers>
Where to put it: <the route or component file, or leave blank and ask>
```

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Fetch the instructions for the template: `https://insightcharts.dev/agents/templates/executive-brief.md`. Use only the props it lists.
3. Read the data. If "Main finding" is blank, compute two or three candidate findings with their numbers and periods and ask the user to pick one.
4. Write the masthead.
   - `title`: the main finding, in one clause, with the number and the period.
   - `kicker`: the report series or team.
   - `deck`: one to three short sentences. Each states one more fact.
   - `byline` and `date`.
5. Write `figures`: three or four objects, most important first, each `{ value, label, delta, deltaLabel }` or `{ value, label, context }`. Set `upIsGood: false` where a fall is good.
6. Write `hero`: one chart spec whose `title` states one fact with its number. A trend is a `line-chart`. A ranking is a `bar-chart`. Set `highlight` to the subject. Mark the cause as one annotation when the user gave you the event.
7. Write `takeaway`: `{ lead, body }`. `lead` is one short sentence with the main fact. `body` gives the supporting numbers. Do not repeat the hero title.
8. Write `supporting`: two chart specs, three at most. Each shows one more fact.
9. Write `actions`: two to four entries, each a string or `{ title, text, owner }`.
10. Write `sources`, `period`, and `note` for caveats.
11. Render it. From JSON, pass the whole object to `Insight`. From JSX, import `ExecutiveBrief` and pass chart elements into `hero` and `supporting`.

```tsx
import { Insight } from "insightcharts";
import type { InsightSpec } from "insightcharts";

export function Brief({ spec }: { spec: InsightSpec }) {
  return <Insight spec={spec} />;
}
```

The spec has this shape:

```json
{
  "type": "executive-brief",
  "title": "Median first reply time fell from 4.1 hours in June to 1.8 hours in September 2025",
  "figures": [{ "value": "1.8 h", "label": "Median first reply, September", "delta": "−2.3 h", "deltaLabel": "vs June", "upIsGood": false }],
  "hero": { "type": "line-chart", "data": "/data/replies.csv", "x": "month", "y": "hours", "title": "Median first reply time fell from 4.3 hours in April to 1.8 hours in September" },
  "takeaway": { "lead": "The median fell 2.3 hours in three months", "body": "The median was 4.1 hours in June." },
  "supporting": [{ "type": "bar-chart", "data": "/data/by-day.csv", "x": "day", "y": "hours", "title": "Weekend median first reply was 6.2 hours in September" }],
  "actions": [{ "title": "Extend the rota to weekends", "text": "The weekend median was 6.2 hours in September." }],
  "sources": ["Helpdesk export"],
  "period": "April to September 2025"
}
```

## Verify

- The spec validates against `https://insightcharts.dev/schema/insight-spec.json`.
- The headline and the hero chart state the finding without the rest of the page.
- Every number in the text matches the data. No sentence states a cause the data does not show.
- One subject is highlighted in every chart. The rest is grey.
- The page reads in order in a container about 380 pixels wide.
- `sources` is set.

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/executive-brief.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
