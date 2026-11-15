---
title: Reference endpoints
description: Every machine-readable URL that InsightCharts publishes for agents, with what each one contains.
order: 8
---

Every URL on this page is a static file on this site. The files are generated from the library source and the component metadata, and rebuilt on every release. Read these files instead of the HTML pages. They have the same content without the page layout.

## Endpoints

{{ENDPOINTS}}

## Choose an endpoint

| You need | Fetch |
|---|---|
| To start a task with no context | `{{SITE_URL}}/agents/index.md` |
| A list of everything | `{{SITE_URL}}/llms.txt` |
| Everything in one request | `{{SITE_URL}}/llms-full.txt` |
| Instructions for one component | `{{SITE_URL}}/agents/<level>/<name>.md`, where `<level>` is `atoms`, `molecules` or `templates` |
| Instructions that reproduce one example | `{{SITE_URL}}/agents/<level>/<name>/<example-slug>.md` |
| The reference page of one component | `{{SITE_URL}}/llms/<name>.md` |
| To choose among the components of a level | `{{SITE_URL}}/agents/atoms.md`, `/agents/molecules.md`, `/agents/templates.md`, `/agents/infographics.md` |
| To validate a spec or constrain a model | `{{SITE_URL}}/schema/insight-spec.json` |
| Every component's metadata as data | `{{SITE_URL}}/schema/manifest.json` |
| The source of one component | `{{SITE_URL}}/r/<name>.json` |

## Find the instructions for a page

Every page of this site has a "Copy agent instructions" button. The same text is at a URL built from the page's path.

| Page | Instructions |
|---|---|
| `/` | `/agents/index.md` |
| `/docs/<slug>` | `/agents/docs/<slug>.md` |
| `/atoms`, `/molecules`, `/templates`, `/infographics`, `/stories` | `/agents/atoms.md` and so on |
| `/atoms/<name>`, `/molecules/<name>`, `/templates/<name>` | `/agents/<level>/<name>.md` |
| One example on a component page | `/agents/<level>/<name>/<example-slug>.md` |
| A prompt in the [prompt library](/docs/agents/prompts) | `/agents/prompts/<id>.md` |

Each component page also declares its `/llms/<name>.md` file as a `text/markdown` alternate in its `<head>`.

## Component metadata

Each component carries a `meta` object. Every file on this page is generated from it.

```ts
BarChart.meta = {
  name: "bar-chart",              // the spec type and registry id
  component: "BarChart",          // the React export
  title: "Bar chart",
  level: "atom",                  // atom | molecule | template
  category: "comparison",         // "poster" marks a poster primitive, "infographic" an infographic template
  description: "Compares a value across categories with bars from a zero baseline.",
  whenToUse: "Ranking or comparing up to about 20 categories ...",
  avoid: "Change over many time points (use line-chart) ...",
  props: [{ name: "x", type: "string", required: true, description: "Category field." }],
  composes: [],                   // what it is built from
  example: { type: "bar-chart", data: [...], x: "country", y: "share" },
};
```

| Field | Use it for |
|---|---|
| `name` | The `type` of a spec and the registry item name. |
| `component` | The named import from `insightcharts`. |
| `level`, `category` | Finding the component in the catalogue. |
| `whenToUse`, `avoid` | Choosing a form. `avoid` names the component to use instead. |
| `props` | Each prop's `name`, `type`, `description`, `default` and `required`. |
| `composes` | The components it is built from. |
| `example` | A complete working spec. |

The same metadata for every component is in `{{SITE_URL}}/schema/manifest.json`, under `components`.

## Read the metadata at runtime

`listComponents()` returns the metadata of every registered component. Call `registerAll()` first, or render an `Insight` once, so that every component is registered.

```ts
import { listComponents, registerAll } from "insightcharts";

registerAll();
const charts = listComponents().filter((meta) => meta.category === "comparison");
```

`getComponent(type)` returns the registered component for a name. A component's own metadata is on the component: `BarChart.meta`.

## The registry

The components are published as a shadcn registry under the `@insightcharts` namespace.

| URL | Contents |
|---|---|
| `{{SITE_URL}}/r/registry.json` | The catalogue of every installable item. |
| `{{SITE_URL}}/r/<name>.json` | The source of one component, as the shadcn CLI installs it. |
| `{{SITE_URL}}/r/<name>-demo.json` | The same component with a ready-made example. |
| `{{SITE_URL}}/r/theme.json` | The `--ic-*` CSS variables for light and dark. |
| `{{SITE_URL}}/r/insight.json` | A local `Insight` spec renderer. |
| `{{SITE_URL}}/r/agent-skill.json` | The agent skill, installed in `.claude/skills/insightcharts`. |
| `{{SITE_URL}}/r/agent-skill-agents.json` | The agent skill, installed in `.agents/skills/insightcharts`. |

The `components.json` entry and the install commands are on [Set up your agent](/docs/agents/setup).

## The repository

- Source: `{{GITHUB_URL}}`
- The skill: `{{GITHUB_URL}}/tree/main/skills/insightcharts`
- The contributor guide: `AGENTS.md` at the root of the repository. Read it before you write a new component or make a non-trivial edit to one.
