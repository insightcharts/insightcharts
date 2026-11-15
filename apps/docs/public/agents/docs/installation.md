# Install InsightCharts in this project

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: The package (or the copied component source) is installed, a chart imports and renders, and the project typechecks.

Install InsightCharts in the user's React project and confirm that one chart renders. Use the npm package unless the user asks to own and edit the component source. In that case use the shadcn registry.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Requirements

- React 18 or later, with `react-dom`.
- ECharts 6 or later (`echarts` is a peer dependency).
- A bundler that understands ES modules. The package is ESM only. It has no CommonJS build.
- No stylesheet import and no Tailwind setup. The CSS for the figure chrome is injected at runtime.

## Steps

1. Check `package.json`. If `insightcharts` is already a dependency, skip to step 3.
2. Install:

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bar-chart
```

The file lands at `components/insightcharts/atoms/bar-chart.tsx`. Import the component from there when you install it this way.

3. For the registry path, the project needs a `components.json` (run `npx shadcn@latest init` if the user wants shadcn and it is missing). The `registry add` command writes this entry. You can also add it by hand:

```json
{
  "registries": {
    "@insightcharts": "https://insightcharts.dev/r/{name}.json"
  }
}
```

4. Registry files land in `components/insightcharts/<atoms|molecules|templates>/<name>.tsx` (under `src/` when the project uses it). The CLI also installs `insightcharts` and `echarts`, because the engine comes from the package. `@insightcharts/<name>-demo` adds a ready-made example. If the project already has `components/insightcharts/`, import components from there. The user may have edited them.
5. Import a chart and render it (see the minimal example).

## Entry points

| Import | Contents |
|---|---|
| `insightcharts` | Everything: every component, `Insight`, `registerAll`, `registerComponents`, the engine, the data helpers, `Scrolly`, the theme presets. |
| `insightcharts/core` | The engine: `Chart`, `Figure`, `defineChart`, `withMeta`, `InsightProvider`, `InsightData`, `useInsightData`, `createTheme`, `useColorMode`, `exportChart`, `rasterize`, `echarts`, `Icon`, and the layout helpers `useContainerWidth`, `measureText`, `truncateText`, `wrapText`, `dodge`. |
| `insightcharts/data` | `loadData`, `resolveSync`, `transformRows`, `applyTransform`, `parseCsv`, `toCsv` and the row helpers. Server-safe. |
| `insightcharts/story` | `Scrolly`. |
| `insightcharts/themes` | `themes`, `presetThemes`, `themeSurfaces`, `posterThemes`, `posterBackgrounds`, each theme by name (`editorialTheme`, `ledgerTheme`, `noirTheme`, ...), `shadcnTheme`, `defaultTheme`, `createTheme`. |

`insightcharts/manifest.json` is the component metadata as JSON.

## Next.js and server components

- Every built module that uses React starts with `"use client"`, so the components are client components. Import a chart into a server component and pass serialisable props.
- `insightcharts/data` has no client directive. Use it in server components, route handlers and scripts.
- Function props cannot cross the server and client boundary: `onSelect`, `onEvents`, `onReady`, and the function forms of `option`, `format`, `transform` and `data`. Put the chart in a file that starts with `"use client"` when you need one.
- A relative URL cannot be fetched on the server. Pass an absolute URL to `loadData`, or read the file and pass its text.

## Minimal example

```tsx
// Next.js App Router: app/page.tsx (a server component)
import { LineChart } from "insightcharts";
import { loadData } from "insightcharts/data";

export default async function Page() {
  const rows = await loadData("https://example.com/energy.csv");
  return <LineChart data={rows} x="year" y="solar" title="Solar generation by year" source="Name the source here" />;
}
```

In a client-only project (Vite), pass the rows or the URL straight to `data` in any component.

## Verify

1. `insightcharts` and `echarts` are in `dependencies` in `package.json`.
2. The project's typecheck passes.
3. Start the dev server and open the page. The chart draws with its title and source line. The browser console has no module resolution error.

## Common mistakes

- Installing `insightcharts` without `echarts`.
- Using `require("insightcharts")`. The package is ESM only.
- Importing a stylesheet. There is none.
- Passing a function prop from a server component.
- Adding a registry item before the `@insightcharts` entry is in `components.json`.
- Importing from the package when the project has an edited copy in `components/insightcharts/`.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/quickstart.md
- This page: https://insightcharts.dev/docs/installation
- These instructions as plain text: https://insightcharts.dev/agents/docs/installation.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
