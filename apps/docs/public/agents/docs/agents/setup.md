# Set up your agent

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

An agent works with InsightCharts from three things: the skill, the shadcn registry and the reference files on this site. Set up the ones your tool supports. Run every command from the root of the project.

| Tool | Skill | Registry and MCP |
|---|---|---|
| Claude Code | `@insightcharts/agent-skill` | `--client claude` |
| Cursor | `@insightcharts/agent-skill-agents` and a rule | `--client cursor` |
| Codex | `@insightcharts/agent-skill-agents` and `AGENTS.md` | `--client codex` |
| Any other agent | `llms.txt` and the home prompt | `components.json` |

## Add the registry to components.json

Do this first. The skill and every component are installed from the `@insightcharts` registry with the shadcn CLI. The project needs a `components.json` file. Create one with `npx shadcn@latest init` if it has none.

Add the registry with one command:

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json
```

Or add the entry to `components.json` by hand:

```json
{
  "registries": {
    "@insightcharts": "https://insightcharts.dev/r/{name}.json"
  }
}
```

After that, any item is installed by name:

```bash
npx shadcn@latest add @insightcharts/line-chart
```

A component file lands at `components/insightcharts/<level>s/<name>.tsx`. It imports the engine from the `insightcharts` package, which the CLI installs with `echarts`. The registry also has these items.

| Item | What it adds |
|---|---|
| `@insightcharts/<name>` | The source of one component. |
| `@insightcharts/<name>-demo` | The same component with a ready-made example. |
| `@insightcharts/theme` | The `--ic-*` CSS variables, light and dark, in the project's stylesheet. |
| `@insightcharts/insight` | A local `Insight` spec renderer with a place to register customised copies. |
| `@insightcharts/agent-skill` | The agent skill in `.claude/skills/insightcharts`. |
| `@insightcharts/agent-skill-agents` | The agent skill in `.agents/skills/insightcharts`. |

The full catalogue is at [`/r/registry.json`](https://insightcharts.dev/r/registry.json).

## Install the skill in Claude Code

1. Install the skill into the project:

```bash
npx shadcn@latest add @insightcharts/agent-skill
```

The files land in `.claude/skills/insightcharts`: `SKILL.md` and four reference files under `references/`. Claude Code reads skills from `.claude/skills`.

2. Or install it with the skills CLI:

```bash
npx skills add insightcharts/insightcharts
```

3. Start a new Claude Code session in the project and ask for a chart. The skill loads when the request is about a chart, a statistic, a dashboard, a scroll story, an infographic or a JSON chart spec, or when the project already imports `insightcharts`.

4. Connect the shadcn MCP server so Claude Code can search and install registry items:

```bash
npx shadcn@latest mcp init --client claude
```

## Install the skill in Cursor

1. Install the skill into `.agents/skills/insightcharts`:

```bash
npx shadcn@latest add @insightcharts/agent-skill-agents
```

2. Add a project rule that points Cursor at the skill. Create `.cursor/rules/insightcharts.mdc`:

```md
---
description: Build charts, data stories and infographics with InsightCharts
alwaysApply: false
---

When the task is a chart, a statistic, a dashboard, a scroll story or an infographic, use the InsightCharts library.
Read .agents/skills/insightcharts/SKILL.md first and follow its workflow.
Use only the component names and props listed in .agents/skills/insightcharts/references/components.md.
The online index is https://insightcharts.dev/llms.txt.
```

3. Connect the shadcn MCP server:

```bash
npx shadcn@latest mcp init --client cursor
```

## Install the skill in Codex

1. Install the skill into `.agents/skills/insightcharts`:

```bash
npx shadcn@latest add @insightcharts/agent-skill-agents
```

2. Add this block to the `AGENTS.md` file at the root of the project. Create the file if the project has none.

```md
## Charts and infographics

Use the InsightCharts library (`insightcharts` on npm) for charts, statistics, dashboards, scroll stories and infographics.
Read .agents/skills/insightcharts/SKILL.md first and follow its workflow.
Use only the component names and props listed in .agents/skills/insightcharts/references/components.md.
The online index is https://insightcharts.dev/llms.txt.
```

3. Connect the shadcn MCP server:

```bash
npx shadcn@latest mcp init --client codex
```

The `AGENTS.md` block works in any tool that reads `AGENTS.md`. The `.agents/skills` folder is the cross-tool convention for skills.

## Set up any other agent

An agent with no skill support needs only URLs.

1. Give the agent the home prompt. Paste the text of [`/agents/index.md`](https://insightcharts.dev/agents/index.md), or tell the agent to fetch `https://insightcharts.dev/agents/index.md` and follow it.
2. Point the agent at the index of every guide and component: `https://insightcharts.dev/llms.txt`. An agent with a large context window can read `https://insightcharts.dev/llms-full.txt` instead.
3. For one component, give the agent `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`. Every page of this site has a "Copy agent instructions" button that copies the same text.
4. If the agent reads a rules file, add the `AGENTS.md` block from the Codex section to it.
5. Or copy the `skills/insightcharts` folder from the [repository](https://github.com/insightcharts/insightcharts/tree/main/skills/insightcharts) into the agent's skills directory.

## Use the shadcn MCP server

The shadcn MCP server reads the `registries` entry in `components.json`. An assistant connected to it can search, inspect and install InsightCharts components from a request in plain language.

```bash
npx shadcn@latest mcp init --client claude
```

The `--client` option takes `claude`, `cursor`, `vscode`, `codex` or `opencode`.

Then ask, for example, for "the InsightCharts component for comparing two values per category". The assistant can find `dumbbell-chart` in the registry and install it.

## What the skill contains

| File | Contents |
|---|---|
| `SKILL.md` | The workflow for building a figure from data, the rules for writing titles, the infographics steps and a review checklist. |
| `references/components.md` | The decision table, every component with its props and an example spec, and the common chart props. |
| `references/data.md` | Every shape the `data` prop accepts and every transform. |
| `references/story-design.md` | The writing rules and the design rules in full. |
| `references/recipes.md` | Complete patterns for common jobs. |

The reference files are generated from the component metadata on every release.

## Check the setup

1. Confirm the skill folder exists: `.claude/skills/insightcharts/SKILL.md` or `.agents/skills/insightcharts/SKILL.md`.
2. Confirm `components.json` has the `@insightcharts` entry under `registries`.
3. Ask the agent which InsightCharts component compares two values per category. The answer is `dumbbell-chart`.
4. Ask the agent for a first chart and follow [Getting started for agents](https://insightcharts.dev/docs/agents).

## Reference

- This page: https://insightcharts.dev/docs/agents/setup
- These instructions as plain text: https://insightcharts.dev/agents/docs/agents/setup.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
