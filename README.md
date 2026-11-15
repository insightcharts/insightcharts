<img src="apps/docs/public/logo.svg" width="72" height="72" alt="The InsightCharts logo: a red-orange circle with a lower-case i cut into it.">

# InsightCharts

InsightCharts is an open-source React library of charts, figures, page layouts and infographic posters built on Apache ECharts 6. It has 100 components: 61 atoms, 19 molecules and 20 templates. 10 of the templates are infographics.

It is designed to be written by AI agents and read by people. To make a chart you pass data, name the columns for `x` and `y`, write a title that states one fact with its number, and name the series to highlight. The library handles data loading and reshaping, a zero baseline for bars and areas, direct labels, a legend when one is needed, light and dark mode, a source line, alt text, loading and error states, and export.

> Status: early. The package is version 0.1.0 and is not yet published to npm. The site URL (`https://insightcharts.dev`) and the GitHub path (`insightcharts/insightcharts`) used in this README and in generated files are placeholders.

## Atoms, molecules, templates

Components come in three levels, each a single file:

- **Atoms** are one chart form or one figure primitive: a bar chart, a line chart, a big number, a callout.
- **Molecules** combine a few atoms: a row of statistics, a chart with a callout beside it.
- **Templates** are a complete page built from molecules and atoms. They take their content as props.

## Infographics

10 of the 20 templates are infographics (`category: "infographic"`). An infographic draws one designed poster: a painted background, a large title, little other text and one large graphic or several graphics laid out together.

- **Infographic templates**: `atlas-poster`, `count-poster`, `flow-poster`, `matrix-poster`, `network-poster`, `profile-poster`, `radial-poster`, `ranking-poster`, `scale-poster` and `timeline-poster`.
- **The poster frame**: the `poster` molecule paints the ground and lays out a masthead, a grid of panels and a footer. `download` saves the whole poster as one PNG.
- **Poster primitives**: 19 of the 61 atoms (`category: "poster"`) are drawn for a poster ground, with large flat marks, values printed on the marks and no axes by default.
- **Poster themes**: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint` and `sunrise`, exported as `posterThemes` and `posterBackgrounds` from `insightcharts/themes`.
- **Icons**: 69 built-in icons, the `Icon` component and `icons`, `iconNames`, `iconGroups`, `resolveIcon` and `iconSymbol`.

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "count-poster", theme: "noir", title: "Norland's schools taught 1.84 million pupils in 2025", hero: { data: pupils, name: "stage", value: "pupils" }, sources: "Norland Ministry of Education" }} />
```

Every component carries metadata: what it shows, when to use it, when to pick something else, its props and a working example. That metadata is collected into `packages/insightcharts/manifest.json`, and the documentation, the agent docs, the JSON schema and the registry are all generated from it. The manifest is the authoritative list of components.

## Install

From npm:

```bash
npm install insightcharts echarts
```

`react` (18 or later), `react-dom` and `echarts` (6 or later) are peer dependencies. There is no CSS file to import.

Or copy component source into your project with the shadcn CLI, so you can edit it. The engine (`insightcharts/core`, `/data`, `/story`, `/themes`) still comes from the npm package; only the component file is copied.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json
npx shadcn@latest add @insightcharts/bar-chart        # components/insightcharts/atoms/bar-chart.tsx
npx shadcn@latest add @insightcharts/bar-chart-demo   # the component plus an example
npx shadcn@latest add @insightcharts/theme            # the --ic-* CSS variables, light and dark
```

## Example

```tsx
import { LineChart } from "insightcharts";

const data = [
  { year: "2019", solar: 2.7, wind: 5.3 },
  { year: "2021", solar: 3.7, wind: 6.5 },
  { year: "2023", solar: 5.5, wind: 7.8 },
];

export function Energy() {
  return (
    <LineChart
      data={data}
      x="year"
      y={["solar", "wind"]}
      format="{value}%"
      highlight="solar"
      annotations={[{ type: "point", x: "2023", y: 5.5, label: "5.5% in 2023" }]}
      title="Solar's share rose from 2.7% to 5.5% between 2019 and 2023"
      subtitle="Share of global electricity generation"
      source="Ember"
    />
  );
}
```

`data` can be row objects, column arrays, CSV text, a URL, `{ url, path }`, an Arrow-style table or an async function. `transform` takes JSON steps (`filter`, `aggregate`, `sort`, `top`, `fold`, `pivot`, `bin`, `derive` and others), so data can be reshaped without code.

Other features:

- `InsightData` shares one dataset between charts; a click on a chart with `select` filters the others.
- `Scrolly` pins a graphic and changes its state as the reader scrolls, swipes or steps through the text.
- `exportable` adds PNG, SVG, PDF and CSV export (JPEG and JSON on request); a ref exposes `export()` and the ECharts instance.
- `download` on a poster or an infographic saves the whole sheet as one PNG. `rasterize` from `insightcharts/core` paints any element to a canvas.
- `option` deep-merges a raw ECharts option over the generated one when a prop does not cover something.

## Files for AI agents

These files are generated from the manifest and the source, so they match the code.

| What | Where | For |
|---|---|---|
| `llms.txt` | `/llms.txt`, `/llms-full.txt`, `/llms/<component>.md`, `/llms/guides/*.md` | An index in llmstxt.org format, a markdown page per component (when to use, props, JSX and JSON examples) and guides on data, theming, crossfiltering, stories, infographics, export and choosing a form. |
| JSON spec | `<Insight spec={{ type: "bar-chart", ... }} />` | Any component as plain JSON, for charts chosen at runtime. Specs nest. |
| Spec schema | `/schema/insight-spec.json` | A JSON Schema (a `oneOf` over component types) to validate a spec before rendering. |
| Manifest | `/schema/manifest.json`, `insightcharts/manifest.json` | Component metadata as JSON. |
| Agent skill | `skills/insightcharts/` | A skill in agentskills.io format with a workflow for building a figure from data and the rules for writing titles. Install with `npx skills add insightcharts/insightcharts` or `npx shadcn@latest add @insightcharts/agent-skill`. |
| shadcn registry | `/r/registry.json`, `/r/<item>.json`, root `registry.json` | One item per component, a `-demo` block for each, `theme`, `insight` and `agent-skill`. |

Paths are relative to the docs site. In this repository the generated files are written to `apps/docs/public/`.

## Repository layout

```
packages/insightcharts/   the library (src/core, data, story, themes, atoms, molecules, templates)
apps/gallery/             Vite gallery that renders every component from its metadata
apps/docs/                documentation site; public/ holds the generated llms files, schema and registry
skills/insightcharts/     the agent skill (references/ is generated)
registry/                 generated: component sources with imports rewritten for the registry
scripts/                  build-index, build-manifest, build-llms, build-registry, llms-guides/
```

## Development

Requires Node and pnpm.

```bash
pnpm install
pnpm manifest                           # regenerate the level indexes and manifest.json
pnpm --filter insightcharts typecheck
pnpm --filter insightcharts test
pnpm --filter insightcharts build
pnpm gallery                            # http://localhost:5199

pnpm llms                               # llms.txt, per-component markdown, guides, spec schema, skill references
pnpm registry                           # shadcn registry items, validated against the official schemas
pnpm agent-docs                         # manifest, llms and registry in order
```

`pnpm llms` and `pnpm registry` read `INSIGHTCHARTS_URL` for the site address (default `https://insightcharts.dev`); `pnpm llms` also reads `INSIGHTCHARTS_REPO` for the GitHub `owner/repo`.

`pnpm registry` fails if a component imports something that the package entry points (`insightcharts/core`, `/data`, `/story`, `/themes`) do not export, because the copied source would not compile in a consumer's project. The message names the component, the import and the fix.

To add or change a component, read [AGENTS.md](./AGENTS.md).

## License

Apache-2.0. See [LICENSE](./LICENSE).
