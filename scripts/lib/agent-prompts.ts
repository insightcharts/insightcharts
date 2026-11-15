// Agent instructions: one self-contained prompt per page of the docs site, written to an AI
// coding agent. Called by build-llms.ts.
//
// Writes:
//   apps/docs/public/agents/index.md                         home (strategic)
//   apps/docs/public/agents/docs.md, docs/<guide>.md         guides (operational)
//   apps/docs/public/agents/docs/agents.md, docs/agents/*.md the "For agents" pages
//   apps/docs/public/agents/<level>.md, infographics.md, stories.md   index pages (selection)
//   apps/docs/public/agents/<level>/<name>.md                components (tactical)
//   apps/docs/public/agents/<level>/<name>/<example>.md      one example of a component
//   apps/docs/public/agents/prompts/<id>.md                  the prompt library
//   apps/docs/public/agents/index.json                       every prompt: path, title, kind
//   apps/docs/content/docs/agents/*.mdx + meta.json          the "For agents" pages themselves
//
// The path of a prompt is the path of its page plus `.md`, under /agents. Component, example
// and index prompts are generated from the manifest. Home, guide and library prompts are
// hand-written in apps/docs/content/agent-prompts and checked against the source here.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { compactJson, levelDir, PKG, PUBLIC, ROOT, SRC, type Component, type ComponentMeta, type Output } from "./shared";

const PROMPTS_DIR = join(ROOT, "apps/docs/content/agent-prompts");
const PAGES_DIR = join(ROOT, "apps/docs/content/docs/agents");
const OUT_DIR = join(PUBLIC, "agents");

export interface AgentHelpers {
  jsxExample(spec: Record<string, unknown>): string;
  propsTable(props: ComponentMeta["props"]): string;
  commonPropsTable: string;
  themeVarsTable: string;
  /** Names of the transforms, annotation kinds and guide slugs, for the checks. */
  transformTypes: string[];
  annotationTypes: string[];
  guideSlugs: string[];
}

export interface AgentInput {
  components: Component[];
  usedBy: Map<string, string[]>;
  extras: Map<string, Record<string, Record<string, unknown>>>;
  siteUrl: string;
  repo: string;
  helpers: AgentHelpers;
}

export interface AgentPromptEntry {
  /** URL path under the site, e.g. /agents/atoms/bar-chart.md */
  path: string;
  title: string;
  kind: "home" | "guide" | "agents" | "index" | "component" | "example" | "library";
  description?: string;
}

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n+/g, " ");
const code = (s: string) => `\`${s}\``;
const list = (items: string[]) => items.map(code).join(", ");

/** The same slug the component page uses for an example's anchor. */
export const exampleSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const JOBS: [category: string, job: string][] = [
  ["figure", "State one number or one fact"],
  ["comparison", "Compare values across categories"],
  ["trend", "Show change over time"],
  ["distribution", "Show how values are spread"],
  ["part-to-whole", "Show how a total divides"],
  ["relationship", "Show how two measures relate"],
  ["flow", "Show movement between stages or groups"],
  ["geo", "Show values by place"],
  ["poster", "Draw a poster graphic"],
  ["infographic", "Lay out a whole poster"],
  ["text", "State something in words"],
  ["layout", "Arrange several pieces"],
  ["story", "Show a sequence of steps"],
];

// ---------------------------------------------------------------------------------------
// Rules by form. Every rule that names a prop is emitted only when the component has it.
// ---------------------------------------------------------------------------------------

const CATEGORY_RULES: Record<string, string[]> = {
  comparison: ["Anything drawn as a bar encodes its value by length, so it starts at zero. Do not cut its axis.", "Sort by value unless the categories have an order of their own (time, age bands, a scale).", "Keep the categories to the number the reader can compare. Fold the rest into \"Other\" with the `top` transform (`{ type: \"top\", n, by, other: \"Other\", label }`)."],
  trend: ["Keep the periods in chronological order.", "A line encodes by position and may use an axis that does not start at zero. A filled area encodes by area and starts at zero.", "If you rebase to an index or use a log scale, say so in `subtitle`."],
  distribution: ["Name the measure and its unit in `subtitle`.", "State how many observations the chart draws when the number is small."],
  "part-to-whole": ["The parts must add up to a whole that means something. State the whole in `subtitle`.", "Keep to about five parts. Fold the rest into \"Other\" with the `top` transform (`{ type: \"top\", n, by, other: \"Other\", label }`)."],
  relationship: ["Label only the points the title is about.", "If an axis uses a log scale, say so in `subtitle`."],
  flow: ["Order the stages in the direction of the flow.", "Use the same unit for every value, and name it in `subtitle`."],
  geo: ["Shade regions by a rate or a share. Use raw counts only when the count is the fact.", "Name the place and the period in `subtitle`."],
  poster: ["The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.", "Area and count encodings are allowed here because the value is always printed.", "The component sets its own height from its content. Do not force a `height` unless the layout needs one."],
  figure: ["Give every number its unit and its period in the label.", "A single number needs a comparison, a denominator or a period beside it."],
  text: ["The text follows the writing rules: plain statements, real numbers, no figures of speech."],
  layout: ["Each chart inside follows the rules of its own component.", "Every chart inside needs its own `title` that states one fact, or a plain label."],
  story: ["Each step or section states one fact. Change one thing per step.", "Each chart inside follows the rules of its own component."],
  infographic: ["`title` is the poster's one fact with its number. Keep other text short.", "Do not set colours. Pick a poster theme with `theme`. A poster keeps its own colours in dark mode.", "Set `sources`. Say in `note` when figures are illustrative.", "A poster becomes one column under 600px wide, in the order of its regions. Order them for that reading."],
};

/** Rules for single components. `needs` lists the props the rule mentions: it is dropped (and reported) when one is missing. */
const NAME_RULES: Record<string, { rule: string; needs?: string[] }[]> = {
  "bar-chart": [{ rule: "With `stack`, keep to about five segments per bar.", needs: ["stack"] }],
  "line-chart": [{ rule: "The value axis does not start at zero unless `zero` or `area` is set. Set `zero` when the reader should compare against zero.", needs: ["zero", "area"] }],
  "donut-chart": [{ rule: "Use at most five slices. With more, use `bar-chart`." }],
  "big-number": [{ rule: "A numeric `delta` is a fraction shown as a signed percentage: `0.12` prints as +12%. Pass a string to print it as written.", needs: ["delta"] }],
  "area-chart": [{ rule: "Areas start at zero. With `stack: \"percent\"` the areas are shares of 100%.", needs: ["stack"] }],
};

/** Rules triggered by a prop the component has. */
const PROP_RULES: { has: (names: Set<string>) => boolean; rule: string }[] = [
  { has: (n) => n.has("unit") && (n.has("icon") || n.has("icons") || n.has("iconField")), rule: "One icon stands for a fixed count (`unit`). Say what one icon is worth in `unitLabel` or `subtitle`. Icons are counted. Never scale an icon by area." },
  { has: (n) => n.has("icon") || n.has("icons") || n.has("iconField"), rule: "An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide." },
  { has: (n) => n.has("log"), rule: "If you set `log`, say that the scale is logarithmic in `subtitle`." },
  { has: (n) => n.has("download"), rule: "Set `download` when the user wants the whole piece as one PNG. It adds a \"Download PNG\" control under the piece." },
  { has: (n) => n.has("linked"), rule: "Set `linked` to make a click on a mark filter the other regions." },
];

const LEVEL_TEXT: Record<ComponentMeta["level"], { slug: string; title: string; one: string; what: string; up: string }> = {
  atom: {
    slug: "atoms",
    title: "Atoms",
    one: "atom",
    what: "An atom is one chart form or one figure primitive: a bar chart, a line chart, a big number, a pull quote. It takes data and a title and depends on no other component.",
    up: "Use one atom when the user wants one chart or one figure. When they want a row of statistics, a chart with a takeaway beside it or two linked charts, use a molecule (`{{SITE_URL}}/agents/molecules.md`). When they want a whole page or a poster, use a template (`{{SITE_URL}}/agents/templates.md`, `{{SITE_URL}}/agents/infographics.md`).",
  },
  molecule: {
    slug: "molecules",
    title: "Molecules",
    one: "molecule",
    what: "A molecule is a combination of atoms that makes one point: a row of statistics, a chart with a callout beside it, a set of linked charts. It takes the content of its parts as props, and nested charts as specs or elements.",
    up: "Use a molecule when the arrangement the user wants is in the table below. When they want a single chart, use an atom (`{{SITE_URL}}/agents/atoms.md`). When they want a whole page or a poster, use a template (`{{SITE_URL}}/agents/templates.md`, `{{SITE_URL}}/agents/infographics.md`).",
  },
  template: {
    slug: "templates",
    title: "Templates",
    one: "template",
    what: "A template is a complete page built from molecules and atoms: an executive brief, a report page, a scroll-driven essay, a filterable explorer. It takes all of its content as props, so a whole page can be one JSON document.",
    up: "Use a report-style template when the reader needs paragraphs, a method note, recommendations or charts with axes. When the piece is one image with little text, use an infographic (`{{SITE_URL}}/agents/infographics.md`). When the user wants one chart or one arrangement, use an atom or a molecule (`{{SITE_URL}}/agents/atoms.md`, `{{SITE_URL}}/agents/molecules.md`).",
  },
};

// ---------------------------------------------------------------------------------------

interface Front {
  [key: string]: string;
}

function readSource(file: string): { front: Front; body: string } {
  const raw = readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${relative(ROOT, file)}: missing frontmatter`);
  const front: Front = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) front[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  if (!front.title) throw new Error(`${relative(ROOT, file)}: frontmatter needs a title`);
  return { front, body: m[2].trim() };
}

const mdFiles = (dir: string) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .sort()
    : [];

/** Apply `fn` to the text outside fenced code blocks only. */
function outsideFences(md: string, fn: (text: string) => string): string {
  return md
    .split(/(^```[\s\S]*?^```[^\n]*$)/m)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join("");
}

/** Escape what MDX would read as JSX or an expression, outside code fences and inline code. */
function escapeMdx(md: string): string {
  return outsideFences(md, (text) =>
    text
      .split(/(`[^`\n]*`)/)
      .map((part, i) => (i % 2 ? part : part.replace(/[{}<]/g, (ch) => `\\${ch}`)))
      .join(""),
  );
}

export async function buildAgentPrompts(input: AgentInput, out: Output): Promise<AgentPromptEntry[]> {
  const { components, usedBy, extras, siteUrl: SITE, repo: REPO, helpers } = input;
  const byName = new Map(components.map((c) => [c.name, c]));
  const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8")) as { name: string; version: string; peerDependencies: Record<string, string>; exports: Record<string, unknown> };
  const { themes, posterThemes } = (await import(pathToFileURL(join(SRC, "themes/index.ts")).href)) as { themes: Record<string, unknown>; posterThemes: Record<string, unknown> };
  const { iconGroups } = (await import(pathToFileURL(join(SRC, "core/icons.ts")).href)) as { iconGroups: Record<string, string[]> };
  const { STORIES } = (await import(pathToFileURL(join(ROOT, "apps/docs/src/lib/stories.ts")).href)) as { STORIES: readonly { id: string; title: string; theme: string; form: string; href: string; changes: string }[] };
  const posterNames = Object.keys(posterThemes);
  const presetNames = Object.keys(themes).filter((n) => !posterNames.includes(n));

  const isInfographic = (c: ComponentMeta) => c.level === "template" && c.category === "infographic";
  const isPrimitive = (c: ComponentMeta) => c.level === "atom" && c.category === "poster";
  const infographics = components.filter(isInfographic);
  const pageTemplates = components.filter((c) => c.level === "template" && !isInfographic(c));
  const primitives = components.filter(isPrimitive);
  const pagePath = (c: Pick<ComponentMeta, "level" | "name">) => `/${levelDir(c.level)}/${c.name}`;
  const promptUrl = (path: string) => `${SITE}/agents${path === "/" ? "/index" : path}.md`;
  const componentPromptUrl = (c: Pick<ComponentMeta, "level" | "name">) => promptUrl(pagePath(c));

  const PREAMBLE = `These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: \`${pkg.name}\` version ${pkg.version} on npm. Peer dependencies: ${Object.entries(pkg.peerDependencies)
    .map(([k, v]) => `\`${k}\` ${v}`)
    .join(", ")}.`;

  const DETECT = [
    "1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.",
    "2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.",
    `3. Check whether \`${pkg.name}\` is in \`dependencies\`. If it is missing, install it with ECharts: \`npm install ${pkg.name} echarts\` (or \`pnpm add\`, \`yarn add\`, \`bun add\` with the same two names). There is no stylesheet to import.`,
    "4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.",
    "5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `\"use client\"`. A chart with plain props can be imported into a server component.",
  ].join("\n");

  const installBlock = (name = "bar-chart", level: ComponentMeta["level"] = "atom") =>
    [
      "From npm (use the project's package manager):",
      "",
      "```bash",
      `npm install ${pkg.name} echarts      # or: pnpm add / yarn add / bun add`,
      "```",
      "",
      "Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.",
      "",
      "```bash",
      `npx shadcn@latest registry add @insightcharts=${SITE}/r/{name}.json   # once per project`,
      `npx shadcn@latest add @insightcharts/${name}`,
      "```",
      "",
      `The file lands at \`components/insightcharts/${levelDir(level)}/${name}.tsx\`. Import the component from there when you install it this way.`,
    ].join("\n");

  // The writing rules, read from AGENTS.md so every copy stays the same.
  const agentsMd = readFileSync(join(ROOT, "AGENTS.md"), "utf8");
  const rulesMatch = /\n## Writing rules for every title, heading and sentence\n([\s\S]*?)\n## /.exec(agentsMd);
  if (!rulesMatch) throw new Error("AGENTS.md: the section \"Writing rules for every title, heading and sentence\" was not found. scripts/lib/agent-prompts.ts reads the rules from it.");
  const WRITING_RULES = rulesMatch[1].trim();

  type Target = "md" | "mdx";
  const componentLink = (target: Target) => (c: Component) => (target === "md" ? `[${c.name}](${componentPromptUrl(c)})` : `[${c.name}](${pagePath(c)})`);

  function decisionTable(listed: Component[], link: (c: Component) => string, withLevel: boolean): string {
    const known = new Set(JOBS.map(([c]) => c));
    const groups: [string, string][] = [...JOBS, ...[...new Set(listed.map((c) => c.category))].filter((c) => !known.has(c)).map((c): [string, string] => [c, c])];
    const rows = [withLevel ? "| The data's job | Component | Level | Use it when | Pick something else when |" : "| The data's job | Component | Use it when | Pick something else when |", withLevel ? "|---|---|---|---|---|" : "|---|---|---|---|"];
    for (const [category, job] of groups) for (const c of listed.filter((x) => x.category === category)) rows.push(`| ${job} | ${link(c)} |${withLevel ? ` ${c.level} |` : ""} ${cell(c.whenToUse ?? c.description)} | ${cell(c.avoid ?? "")} |`);
    return rows.join("\n");
  }

  const chooseTable = (listed: Component[], link: (c: Component) => string) => ["| Component | Use it when | Pick something else when |", "|---|---|---|", ...listed.map((c) => `| ${link(c)} | ${cell(c.whenToUse ?? c.description)} | ${cell(c.avoid ?? "")} |`)].join("\n");

  const ENDPOINT_ROWS: [string, string, string][] = [
    ["Index", "/llms.txt", "Every guide, component and agent prompt, with one line each."],
    ["Everything", "/llms-full.txt", "All guides and all component reference pages in one file."],
    ["One component reference", "/llms/<name>.md", "Description, when to use and avoid, install, props, example JSX and JSON for one component."],
    ["One guide", "/llms/guides/<slug>.md", `The long guides written for agents: ${helpers.guideSlugs.join(", ")}.`],
    ["Home prompt", "/agents/index.md", "The strategic instructions: what the library is, how to choose a form, how to install, the working method."],
    ["Guide prompt", "/agents/docs/<slug>.md", "Operational instructions for one guide: the steps, the API, an example, how to verify. The introduction is `/agents/docs.md`."],
    ["Index prompt", "/agents/<index>.md", "How to choose among the components of one level, as a decision table. `<index>` is `atoms`, `molecules`, `templates`, `infographics` or `stories`."],
    ["Component prompt", "/agents/<level>/<name>.md", "Tactical instructions for one component: install, import, props, data shape, JSX, JSON spec, rules, checklist. `<level>` is `atoms`, `molecules` or `templates`."],
    ["Example prompt", "/agents/<level>/<name>/<example>.md", "The component prompt with one example's exact code and theme."],
    ["Prompt library", "/agents/prompts/<id>.md", "Ready-to-copy prompts for common jobs."],
    ["Prompt list", "/agents/index.json", "Every prompt as JSON: path, title and kind."],
    ["Spec schema", "/schema/insight-spec.json", "JSON Schema (draft-07) for a spec. Unknown components and props fail validation."],
    ["Manifest", "/schema/manifest.json", "Every component's metadata as data: name, level, category, props, example, what it composes."],
    ["Registry index", "/r/registry.json", "The shadcn registry: every installable item."],
    ["One registry item", "/r/<name>.json", "The source of one component as the shadcn CLI installs it. `/r/<name>-demo.json` adds an example file."],
    ["Theme variables", "/r/theme.json", "Registry item that adds the `--ic-*` CSS variables to the project's stylesheet."],
    ["Spec renderer", "/r/insight.json", "Registry item with an `Insight` wrapper that can register customised local components."],
    ["Agent skill", "/r/agent-skill.json", "The skill as a registry item for `.claude/skills/insightcharts`. `/r/agent-skill-agents.json` installs to `.agents/skills/insightcharts`."],
  ];
  const endpoints = (target: Target) => ["| Resource | URL | Contents |", "|---|---|---|", ...ENDPOINT_ROWS.map(([name, path, text]) => `| ${name} | ${/[<|]/.test(path) ? code(`${SITE}${path}`) : target === "md" ? `${SITE}${path}` : `[\`${path}\`](${path})`} | ${cell(text)} |`)].join("\n");

  // Library prompts are read first: the "Prompt library" page lists them.
  const library = mdFiles(join(PROMPTS_DIR, "library"))
    .map((f) => ({ id: f.replace(/\.md$/, ""), ...readSource(join(PROMPTS_DIR, "library", f)) }))
    .sort((a, b) => Number(a.front.order ?? 99) - Number(b.front.order ?? 99) || a.id.localeCompare(b.id));

  const fragments = (target: Target): Record<string, string> => ({
    SITE_URL: SITE,
    REPO,
    GITHUB_URL: `https://github.com/${REPO}`,
    PACKAGE: pkg.name,
    VERSION: pkg.version,
    DETECT,
    INSTALL: installBlock(),
    COMPONENT_COUNT: String(components.length),
    ATOM_COUNT: String(components.filter((c) => c.level === "atom").length),
    MOLECULE_COUNT: String(components.filter((c) => c.level === "molecule").length),
    TEMPLATE_COUNT: String(components.filter((c) => c.level === "template").length),
    INFOGRAPHIC_COUNT: String(infographics.length),
    PAGE_TEMPLATE_COUNT: String(pageTemplates.length),
    POSTER_PRIMITIVE_COUNT: String(primitives.length),
    PRESET_THEMES: list(presetNames),
    POSTER_THEMES: list(posterNames),
    THEME_VARS: helpers.themeVarsTable,
    COMMON_PROPS: helpers.commonPropsTable,
    DECISION_TABLE: decisionTable(components, componentLink(target), true),
    TEMPLATE_TABLE: chooseTable(pageTemplates, componentLink(target)),
    INFOGRAPHIC_TABLE: chooseTable(infographics, componentLink(target)),
    POSTER_PRIMITIVE_TABLE: chooseTable(primitives, componentLink(target)),
    WRITING_RULES,
    ICON_GROUPS: Object.entries(iconGroups)
      .map(([group, names]) => `- ${group}: ${list(names)}`)
      .join("\n"),
    STORIES: STORIES.map((s) => `- ${s.title}. Form: ${s.form} (${target === "md" ? promptUrl(s.href) : s.href}). Theme: \`${s.theme}\`. Steps: ${s.changes}`).join("\n"),
    ENDPOINTS: endpoints(target),
    LIBRARY: library
      .map((p) =>
        target === "md"
          ? `### ${p.front.title}\n\n${p.front.description ?? ""}\n\nPrompt: ${promptUrl(`/prompts/${p.id}`)}`
          : `### ${p.front.title}\n\n${p.front.description ?? ""}\n\n@@CARD:/prompts/${p.id}@@`,
      )
      .join("\n\n"),
  });

  function expand(body: string, target: Target, file: string, self?: string): string {
    const table = fragments(target);
    // The paragraph before {{PROMPT:self}} tells a person to copy the prompt. It is not part of the prompt.
    return (target === "mdx" && self ? body.replace(/^\{\{PROMPT:self\}\}\n?/gm, `@@CARD:${self}@@\n`) : body.replace(/(?:^[^\n]+\n\n)?^\{\{PROMPT:self\}\}\n*/gm, ""))
      .replace(/\{\{([A-Z_]+)\}\}/g, (_all, key: string) => {
        if (!(key in table)) throw new Error(`${file}: unknown placeholder {{${key}}}`);
        return table[key];
      });
  }

  /** Site-relative links become absolute in plain text, so a pasted prompt has no dead links. */
  const absolutize = (md: string) => outsideFences(md, (text) => text.replace(/\]\((\/[^)\s]*)\)/g, (_all, path: string) => `](${SITE}${path})`));

  const reference = (path: string, extra: string[] = [], options: { page?: string; source?: boolean } = {}) =>
    [
      "## Reference",
      "",
      ...extra,
      ...(path.startsWith("/prompts/") ? [] : [`- This page: ${options.page ?? `${SITE}${path === "/" ? "" : path}`}`]),
      `- These instructions as plain text: ${promptUrl(path)}`,
      `- Instructions for one component: ${SITE}/agents/<atoms|molecules|templates>/<name>.md`,
      `- Every guide, component and prompt: ${SITE}/llms.txt`,
      `- JSON Schema for specs: ${SITE}/schema/insight-spec.json`,
      `- Component manifest: ${SITE}/schema/manifest.json`,
      `- Registry catalogue: ${SITE}/r/registry.json`,
      ...(options.source === false ? [] : [`- Source: https://github.com/${REPO}`]),
    ].join("\n");

  const entries: AgentPromptEntry[] = [];
  const texts = new Map<string, string>();
  const add = (path: string, title: string, kind: AgentPromptEntry["kind"], text: string, description?: string) => {
    const file = join(OUT_DIR, `${path === "/" ? "/index" : path}.md`);
    if (texts.has(file)) throw new Error(`agent prompts: two prompts write ${relative(ROOT, file)}`);
    texts.set(file, text);
    out.add(file, text);
    entries.push({ path: `/agents${path === "/" ? "/index" : path}.md`, title, kind, ...(description ? { description } : null) });
  };

  const handWritten: { file: string; text: string }[] = [];
  function written(file: string, path: string, kind: AgentPromptEntry["kind"]) {
    const { front, body } = readSource(file);
    const rel = relative(ROOT, file);
    const llms = front.llms ? [`- The long guide on this topic: ${SITE}/llms/guides/${front.llms}.md`] : [];
    if (front.llms && !helpers.guideSlugs.includes(front.llms)) throw new Error(`${rel}: llms: ${front.llms} is not a guide in scripts/llms-guides`);
    const text = [`# ${front.title}`, "", PREAMBLE, "", ...(front.goal ? [`Goal: ${front.goal}`, ""] : []), absolutize(expand(body, "md", rel)), "", reference(path, llms)].join("\n");
    handWritten.push({ file: rel, text });
    add(path, front.title, kind, text, front.description ?? front.goal);
    return { front, body, rel };
  }

  // Home, guides, the stories gallery.
  if (!existsSync(join(PROMPTS_DIR, "home.md"))) throw new Error("apps/docs/content/agent-prompts/home.md is missing: it is the prompt copied from the landing page.");
  written(join(PROMPTS_DIR, "home.md"), "/", "home");
  for (const f of mdFiles(join(PROMPTS_DIR, "docs"))) written(join(PROMPTS_DIR, "docs", f), f === "index.md" ? "/docs" : `/docs/${f.replace(/\.md$/, "")}`, "guide");
  if (existsSync(join(PROMPTS_DIR, "stories.md"))) written(join(PROMPTS_DIR, "stories.md"), "/stories", "index");
  for (const p of library) written(join(PROMPTS_DIR, "library", `${p.id}.md`), `/prompts/${p.id}`, "library");

  // The "For agents" pages: one source for the page and for its prompt.
  const pages = mdFiles(join(PROMPTS_DIR, "agents"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), file: join(PROMPTS_DIR, "agents", f) }))
    .map((p) => ({ ...p, ...readSource(p.file) }))
    .sort((a, b) => Number(a.front.order ?? 99) - Number(b.front.order ?? 99) || a.slug.localeCompare(b.slug));
  out.own(PAGES_DIR);
  for (const p of pages) {
    const path = p.slug === "index" ? "/docs/agents" : `/docs/agents/${p.slug}`;
    const rel = relative(ROOT, p.file);
    if (!p.front.description) throw new Error(`${rel}: frontmatter needs a description`);
    written(p.file, path, "agents");
    const mdx = escapeMdx(expand(p.body, "mdx", rel, path)).replace(/@@CARD:([^@]+)@@/g, (_all, target: string) => `<AgentPrompt path="${target}" />`);
    out.add(join(PAGES_DIR, `${p.slug}.mdx`), [`---`, `title: ${JSON.stringify(p.front.title)}`, `description: ${JSON.stringify(p.front.description)}`, `---`, "", `{/* Generated by scripts/build-llms.ts from ${rel}. Edit that file and run \`pnpm llms\`. */}`, "", mdx].join("\n"));
  }
  if (pages.length) out.json(join(PAGES_DIR, "meta.json"), { title: "For agents", pages: pages.map((p) => p.slug) });

  // -------------------------------------------------------------------------------------
  // Index pages
  // -------------------------------------------------------------------------------------

  const nameOnly = (c: Component) => code(c.name);
  const commonRules = ["Write `title` as one plain statement of fact with its number and its period, in one clause: \"Monthly churn fell from 4.2% to 2.1% in 2024\". A plain label is acceptable when there is no single fact: \"Monthly churn, 2024\".", "Set `subtitle` to the measure, unit, population and period, and `source` to where the data is from.", "Do not set colours. Colour comes from the theme. Set `highlight` to the entity the title is about.", "Bars start at zero. No dual axes. No 3D. Label marks directly."];

  function indexPrompt(options: { path: string; title: string; what: string; up: string; listed: Component[]; one: string; sample: Component; extra?: string[] }) {
    const { path, title, what, up, listed, one, sample } = options;
    const text = [
      `# ${title}`,
      "",
      PREAMBLE,
      "",
      `Task: choose the ${one} that fits the user's data, then follow that component's own instructions. If the user has not given you the data and the one fact they want to show, ask for both before you choose.`,
      "",
      `## What ${/^[aeiou]/.test(one) ? "an" : "a"} ${one} is`,
      "",
      what,
      "",
      up.replace(/\{\{SITE_URL\}\}/g, SITE),
      "",
      "## Choose",
      "",
      `1. Write down what the data has to show, in one sentence with its number.`,
      `2. Find that job in the first column of the table. There are ${listed.length} components.`,
      `3. Read "Use it when" for each candidate. If "Pick something else when" describes the user's data, take the component it names.`,
      `4. Open the instructions for the component you chose: \`${SITE}/agents/${levelDir(sample.level)}/<name>.md\`, for example ${componentPromptUrl(sample)}.`,
      "",
      decisionTable(listed, nameOnly, false),
      "",
      ...(options.extra ?? []),
      "## Install and import",
      "",
      installBlock(sample.name, sample.level),
      "",
      "Import by the component's React name, which is the kebab-case name in PascalCase:",
      "",
      "```tsx",
      `import { ${sample.component} } from "${pkg.name}";`,
      "```",
      "",
      `Or write it as a JSON spec and render it with \`Insight\`: \`<Insight spec={{ type: "${sample.name}", ...props }} />\`. Use only the names in the table. Any other name does not render.`,
      "",
      "## Rules for every component",
      "",
      ...commonRules.map((r) => `- ${r}`),
      "",
      reference(path, [`- How to choose across all levels: ${promptUrl("/docs/agents/choosing")}`]),
    ].join("\n");
    add(path, title, "index", text);
  }

  for (const level of ["atom", "molecule", "template"] as const) {
    const info = LEVEL_TEXT[level];
    const listed = level === "template" ? pageTemplates : components.filter((c) => c.level === level);
    if (!listed.length) continue;
    const sample = byName.get(level === "atom" ? "bar-chart" : level === "molecule" ? "stat-row" : "executive-brief") ?? listed[0];
    indexPrompt({ path: `/${info.slug}`, title: `Choose and add an InsightCharts ${info.one}`, what: info.what, up: info.up, listed, one: info.one, sample, extra: level === "template" && infographics.length ? [`The ${infographics.length} infographic templates are not in this table. They are in ${promptUrl("/infographics")}.`, ""] : undefined });
  }
  if (infographics.length) {
    const frame = byName.get("poster");
    indexPrompt({
      path: "/infographics",
      title: "Choose and build an InsightCharts infographic",
      one: "infographic",
      what: "An infographic is a template that draws one designed poster: a painted background, a large title, little other text and one large graphic or several laid out together. It takes its content as props, so a whole poster is one JSON spec. Its page and its instructions are under `/templates/`.",
      up: `Use an infographic when the piece is one image that is read in a few seconds and shared as a picture. When the reader needs paragraphs, a method note or charts with axes, use a report-style template ({{SITE_URL}}/agents/templates.md). For one fact at a fixed social size, use \`social-card\`.`,
      listed: infographics,
      sample: byName.get("count-poster") ?? infographics[0],
      extra: [
        "## Fill the poster",
        "",
        "1. Write `title` (required) as the poster's one fact with its number. Add `kicker`, `subtitle`, `sources` and `note`.",
        "2. Fill each region prop with a compact config: its `data` rows, the field names (`name`, `value`) and a `title` for that panel. The component's instructions list its regions.",
        `3. Pick a poster theme with \`theme\`: ${list(posterNames)}. Do not set colours.`,
        "4. Set `download: true` when the user wants a PNG.",
        "",
        ...(frame ? [`When no template has the layout the user wants, compose one on the \`poster\` molecule from the poster primitives (${componentPromptUrl(frame)}):`, "", chooseTable(primitives, nameOnly), ""] : []),
      ],
    });
  }

  // -------------------------------------------------------------------------------------
  // Components and their examples
  // -------------------------------------------------------------------------------------

  const hyphenated = components
    .map((c) => c.name)
    .sort((a, b) => b.length - a.length);
  const mentioned = (text: string, self: string) => {
    const hits: string[] = [];
    for (const n of hyphenated) if (n !== self && new RegExp(`(?<![\\w-])${n}(?![\\w-])`).test(text) && !hits.includes(n) && (n.includes("-") || text.includes(`\`${n}\``))) hits.push(n);
    return hits;
  };
  const missingRuleProps: string[] = [];

  const isSlotType = (type: string) => /\b(Slot|InsightSpec|ReactNode)\b/.test(type);
  const isRegionType = (type: string) => /^[{(]|\[\]|Config\b|Props\b|\bCard\b|\bBlock\b|PosterPanel|\bRow\b/.test(type);
  const TEXT_PROPS = new Set(["theme", "style", "className", "names", "labels", "format", "deltaFormat", "changeFormat", "selections", "initialSelections", "transform", "highlight", "order", "sources", "source"]);

  function describeValue(v: unknown): string {
    const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
    const one = (x: unknown): string => {
      if (isObj(x) && typeof x.type === "string" && byName.has(x.type)) return `a \`${x.type}\` spec${Array.isArray(x.data) ? ` with ${x.data.length} rows` : ""}`;
      if (isObj(x) && Array.isArray(x.data)) {
        const fields = Object.entries(x).filter(([k, val]) => k !== "data" && typeof val === "string" && isObj((x.data as unknown[])[0]) && (val as string) in ((x.data as Record<string, unknown>[])[0] ?? {}));
        return `a config with ${x.data.length} rows of \`data\`${fields.length ? ` and the fields ${fields.map(([k, val]) => `\`${k}: "${val}"\``).join(", ")}` : ""}`;
      }
      if (isObj(x)) return `an object with ${Object.keys(x).map(code).join(", ")}`;
      if (typeof x === "string") return x.length > 60 ? "text" : `\`"${x}"\``;
      return code(JSON.stringify(x));
    };
    if (Array.isArray(v)) {
      const kinds = [...new Set(v.map(one))];
      return `${v.length} ${v.length === 1 ? "item" : "items"}: ${kinds.slice(0, 3).join("; ")}${kinds.length > 3 ? "; ..." : ""}`;
    }
    return one(v);
  }

  function themeNote(spec: Record<string, unknown>, c: Component): string {
    const t = spec.theme;
    if (typeof t === "string") {
      if (!(t in themes)) throw new Error(`${c.name}: an example uses theme "${t}", which is not a theme in insightcharts/themes`);
      const poster = posterNames.includes(t);
      if (isInfographic(c) || c.name === "poster") return `This example sets \`theme="${t}"\`. Keep it to reproduce the look, or pick another poster theme: ${list(posterNames)}. The poster paints its own background and keeps its colours on a dark page.`;
      return `This example sets \`theme="${t}"\`, a built-in ${poster ? "poster theme" : "theme"}${t === "insight" || t === "shadcn" ? " that follows the host page" : " that paints its own background behind the component"}. Keep it to reproduce the look. Remove \`theme\` to follow the host page instead${c.isChart || c.props.some((p) => p.name === "frame") ? ", or keep the colours and set `frame={false}` to drop the painted background" : ""}.`;
    }
    if (t && typeof t === "object") return `This example overrides theme tokens with an object (${Object.keys(t).map(code).join(", ")}). Keep the object to reproduce the look, or replace its values with the user's brand colours.`;
    return "This example sets no theme, so it follows the host page and its light or dark mode.";
  }

  function dataShape(c: Component, spec: Record<string, unknown>): string[] {
    const lines: string[] = [];
    const data = spec.data;
    const takesData = c.isChart || c.props.some((p) => p.name === "data");
    if (takesData && Array.isArray(data) && data.length && typeof data[0] === "object" && data[0] !== null && !Array.isArray(data[0])) {
      const row0 = data[0] as Record<string, unknown>;
      lines.push("Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:", "", "```json", compactJson(data.slice(0, 3)), "```", "");
      const fields = c.props.filter((p) => {
        const v = spec[p.name];
        return (typeof v === "string" && v in row0) || (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x in row0));
      });
      if (fields.length) lines.push("How the example maps columns to props:", "", ...fields.map((p) => `- \`${p.name}\` = \`${JSON.stringify(spec[p.name])}\`. ${p.description}`), "", "With the user's data, keep the props and change the column names.", "");
    } else if (takesData && data !== undefined) {
      lines.push(`Pass \`data\` as rows, CSV text, a URL, \`{ url, path }\`, an async function or an Arrow-style table. Field props are strings that name columns. The example passes ${typeof data === "string" ? `\`${data.length > 80 ? `${data.slice(0, 80)}...` : data}\`` : "a non-row shape; see the JSON spec below"}.`, "");
    } else if (c.level !== "atom" && !c.isChart && regions(c, spec).length) {
      const shared = c.props.find((p) => p.name === "data");
      lines.push(`This component takes its content as props, listed under "${isInfographic(c) ? "Regions" : "Slots and content props"}" below. ${isInfographic(c) ? "Each region holds its own \`data\` rows and the field names that read them." : "A chart nested in a slot holds its own \`data\` rows and field names."}${shared ? ` It also has a shared \`data\` prop: ${shared.description}` : ""}`, "");
    } else if (takesData) {
      lines.push("Pass `data` as rows, CSV text, a URL, `{ url, path }`, an async function or an Arrow-style table, or leave it out inside `InsightData` to read the shared rows. Field props are strings that name columns.", "");
    } else {
      const required = c.props.filter((p) => p.required);
      lines.push("This component takes its content as props, not as a `data` array.", "");
      if (required.length) lines.push("Required props, with what the example passes:", "", ...required.map((p) => `- \`${p.name}\` (\`${p.type}\`): ${p.description}${spec[p.name] !== undefined ? ` Example: ${describeValue(spec[p.name])}.` : ""}`), "");
    }
    return lines;
  }

  function regions(c: Component, spec: Record<string, unknown>): string[] {
    if (c.level === "atom") return [];
    const slots = c.props.filter((p) => !TEXT_PROPS.has(p.name) && (isSlotType(p.type) || isRegionType(p.type)) && !/=>/.test(p.type.replace(/\(facet, rows\) => ReactNode/, "")));
    if (!slots.length) return [];
    const heading = isInfographic(c) ? "Regions" : "Slots and content props";
    const lines = [
      `## ${heading}`,
      "",
      isInfographic(c) ? "Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`." : "These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.",
      "",
      ...slots.map((p) => `- \`${p.name}\`${p.required ? " (required)" : ""}, \`${p.type}\`: ${p.description}${spec[p.name] !== undefined ? ` In the example: ${describeValue(spec[p.name])}.` : " Not used in the example."}`),
      "",
      "To swap in the user's data:",
      "",
      "1. Keep `type` and the layout props. Replace every `data` array with the user's rows.",
      "2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.",
      "3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.",
      "4. Remove an optional region or slot you have no data for. Do not leave example data in place.",
      `5. A slot takes any component. The instructions for the component you nest are at \`${SITE}/agents/<atoms|molecules|templates>/<name>.md\`.`,
      "",
    ];
    return lines;
  }

  function formRules(c: Component): string[] {
    const names = new Set(c.props.map((p) => p.name));
    const rules: string[] = [];
    for (const r of NAME_RULES[c.name] ?? []) {
      const missing = (r.needs ?? []).filter((n) => !names.has(n));
      if (missing.length) missingRuleProps.push(`${c.name}: a rule in NAME_RULES mentions ${missing.map(code).join(", ")}, which the component no longer has`);
      else rules.push(r.rule);
    }
    rules.push(...(CATEGORY_RULES[c.category] ?? []));
    for (const r of PROP_RULES) if (r.has(names)) rules.push(r.rule);
    if (isInfographic(c) || c.name === "poster") rules.push(`Poster themes: ${list(posterNames)}.`);
    if (c.isChart) rules.push("Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.", "Use at most three `annotations`. Their values must match values in the data.", "No dual axes and no 3D. The chart must read without hovering.");
    return [...new Set(rules)];
  }

  function accessibility(c: Component): string[] {
    const names = new Set(c.props.map((p) => p.name));
    if (c.isChart) return ["The chart is exposed as an image (`role=\"img\"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.", "Set `table` to add a collapsible \"View data\" table under the chart, for readers who need exact values or use a screen reader.", "The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup."];
    return [
      "The component renders as HTML text in reading order, so it needs no alt text of its own.",
      ...(names.has("level") ? ["Set `level` to the heading level that fits the page outline."] : []),
      ...(c.level !== "atom" ? ["Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone."] : []),
      ...(names.has("icon") ? ["An icon is decoration. The label beside it must carry the meaning."] : []),
    ];
  }

  function checklist(c: Component): string[] {
    const names = new Set(c.props.map((p) => p.name));
    const sourceProp = names.has("sources") ? "sources" : c.isChart || names.has("source") ? "source" : undefined;
    return [
      "The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.",
      `A JSON spec validates against ${SITE}/schema/insight-spec.json. Unknown props fail.`,
      "It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.",
      isInfographic(c) || c.name === "poster" ? "The poster keeps its own colours on a dark page." : "It reads in light and in dark mode.",
      ...(c.isChart || names.has("title") ? ["The title is one clause that states one fact with its number and period, or it is a plain label."] : []),
      "Every number in the text can be found in the data or computed from it.",
      ...(sourceProp ? [`\`${sourceProp}\` is set.`] : []),
      ...(c.isChart ? ["One entity is highlighted and the others are grey, or the chart has one series.", "The chart can be read without hovering."] : []),
      "No example data or example text is left in place.",
    ];
  }

  function componentPrompt(c: Component, example?: { title: string; spec: Record<string, unknown> }): string {
    const spec = example?.spec ?? c.example ?? { type: c.name };
    const kind = isInfographic(c) ? "infographic template" : isPrimitive(c) ? "poster primitive (atom)" : c.level;
    const article = /^[aeiou]/.test(kind) ? "an" : "a";
    const alternatives = mentioned(`${c.avoid ?? ""}`, c.name)
      .map((n) => byName.get(n)!)
      .filter(Boolean);
    const composes = (c.composes ?? []).filter((n) => byName.has(n)).map((n) => byName.get(n)!);
    const users = (usedBy.get(c.name) ?? []).map((n) => byName.get(n)!).filter(Boolean);
    const path = example ? `${pagePath(c)}/${exampleSlug(example.title)}` : pagePath(c);
    const title = example ? `Reproduce the "${example.title}" example of the InsightCharts ${c.title}` : `Build ${/^[aeiou]/i.test(c.title) ? "an" : "a"} ${c.title} with InsightCharts`;
    const lines: string[] = [
      `# ${title}`,
      "",
      PREAMBLE,
      "",
      example
        ? `Task: reproduce the "${example.title}" example of \`${c.name}\` (${article} ${kind}) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.`
        : `Task: add ${/^[aeiou]/i.test(c.title) ? "an" : "a"} ${c.title} (\`${c.name}\`, ${article} ${kind}) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.`,
      "",
      "## 1. Check that this is the right component",
      "",
      c.description,
      "",
      ...(c.whenToUse ? [`Use it when: ${c.whenToUse}`, ""] : []),
      ...(c.avoid ? [`Pick something else when: ${c.avoid}`, ""] : []),
      ...(alternatives.length ? [`Instructions for the alternatives: ${alternatives.map((a) => `\`${a.name}\` ${componentPromptUrl(a)}`).join(", ")}.`, ""] : []),
      "## 2. Install",
      "",
      "Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.",
      "",
      installBlock(c.name, c.level),
      "",
      "## 3. Import",
      "",
      "```tsx",
      `import { ${c.component} } from "${pkg.name}";`,
      "```",
      "",
      c.isChart ? "In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `\"use client\"`." : "In Next.js the component can be imported into a server component when every prop is plain data.",
      "",
      "## 4. Data",
      "",
      ...dataShape(c, spec),
      example ? `## 5. The "${example.title}" example` : "## 5. Working example",
      "",
      ...(example ? [themeNote(spec, c), ""] : []),
      "```tsx",
      helpers.jsxExample(spec),
      "```",
      "",
      "Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from \"insightcharts\"`):",
      "",
      "```json",
      compactJson(spec),
      "```",
      "",
      ...(!example && typeof spec.theme === "string" ? [themeNote(spec, c), ""] : []),
      ...regions(c, spec),
      "## Props",
      "",
      c.props.length ? helpers.propsTable(c.props) : "No component-specific props.",
      "",
      ...(c.isChart ? ["Every chart also accepts these common props:", "", helpers.commonPropsTable, ""] : ["This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.", ""]),
      "## Composition",
      "",
      `- Built from: ${composes.length ? composes.map((x) => `\`${x.name}\` (${x.level})`).join(", ") : "nothing. It is a primitive."}`,
      `- Used by: ${users.length ? users.map((x) => `\`${x.name}\` (${x.level})`).join(", ") : "no molecule or template yet."}`,
      "",
      "## Rules for this form",
      "",
      ...formRules(c).map((r) => `- ${r}`),
      "- Write `title` as one plain statement of fact with its number and its period, in one clause (\"Monthly churn fell from 4.2% to 2.1% in 2024\"), or as a plain label (\"Monthly churn, 2024\"). No metaphors, no dramatic verbs, no second half joined with a comma, \"and\" or a dash.",
      "",
      "## Accessibility",
      "",
      ...accessibility(c).map((r) => `- ${r}`),
      "",
      "## Verify",
      "",
      ...checklist(c).map((r) => `- [ ] ${r}`),
      "",
      reference(
        path,
        [
        ...(example ? [`- Instructions for the component without this example: ${componentPromptUrl(c)}`] : []),
        `- Component reference with every example: ${SITE}/llms/${c.name}.md`,
        `- Registry item: ${SITE}/r/${c.name}.json`,
        `- Source: https://github.com/${REPO}/blob/main/packages/insightcharts/src/${levelDir(c.level)}/${c.name}.tsx`,
        `- How to choose a different ${isInfographic(c) ? "infographic" : c.level}: ${promptUrl(isInfographic(c) ? "/infographics" : `/${levelDir(c.level)}`)}`,
      ], { page: `${SITE}${pagePath(c)}${example ? `#example-${exampleSlug(example.title)}` : ""}`, source: false }),
    ];
    return lines.join("\n");
  }

  for (const c of components) {
    add(pagePath(c), `${c.title}`, "component", componentPrompt(c), c.description);
    const seen = new Set<string>();
    for (const [title, spec] of Object.entries(extras.get(c.name) ?? {})) {
      const slug = exampleSlug(title);
      if (!slug || seen.has(slug)) throw new Error(`${c.name}: the example "${title}" has no slug of its own. Example titles of one component must differ in letters or digits.`);
      seen.add(slug);
      add(`${pagePath(c)}/${slug}`, `${c.title}: ${title}`, "example", componentPrompt(c, { title, spec }));
    }
  }
  if (missingRuleProps.length) throw new Error(`Agent prompt rules are out of date with the source:\n${[...new Set(missingRuleProps)].map((p) => `  - ${p}`).join("\n")}`);

  out.json(join(OUT_DIR, "index.json"), { package: pkg.name, version: pkg.version, site: SITE, prompts: entries });
  out.own(OUT_DIR);

  // -------------------------------------------------------------------------------------
  // Checks: nothing in a prompt may name something that does not exist.
  // -------------------------------------------------------------------------------------

  const problems: string[] = [];
  const entryFiles: Record<string, string> = { insightcharts: "index.ts", "insightcharts/core": "core/index.ts", "insightcharts/data": "data/index.ts", "insightcharts/story": "story/index.ts", "insightcharts/themes": "themes/index.ts" };
  for (const key of Object.keys(entryFiles)) if (!((key === "insightcharts" ? "." : `./${key.split("/")[1]}`) in pkg.exports)) throw new Error(`package.json exports no longer has ${key}`);
  const runtime: Record<string, Set<string>> = {};
  for (const [name, file] of Object.entries(entryFiles)) runtime[name] = new Set(Object.keys((await import(pathToFileURL(join(SRC, file)).href)) as Record<string, unknown>));
  // Type names cannot be seen at runtime: accept any exported interface or type in the source.
  const typeNames = new Set<string>();
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []));
  for (const file of walk(SRC)) for (const m of readFileSync(file, "utf8").matchAll(/export (?:interface|type) (\w+)/g)) typeNames.add(m[1]);
  const jsxAllowed = new Set([...components.map((c) => c.component), "Insight", "InsightData", "InsightProvider", "Scrolly", "Figure", "Chart", "Icon"]);
  const specTypes = new Set([...components.map((c) => c.name), ...helpers.transformTypes, ...helpers.annotationTypes]);

  for (const { file, text } of handWritten) {
    const fences = [...text.matchAll(/^```(\w*)\n([\s\S]*?)^```/gm)].map((m) => ({ lang: m[1], body: m[2] }));
    // A fence that shows another library's code (the chart being converted) is not checked.
    const codeText = fences.filter((f) => /^(tsx?|jsx?|json)$/.test(f.lang) && !/from "(recharts|react-chartjs-2|chart\.js[^"]*)"/.test(f.body)).map((f) => f.body).join("\n");
    for (const m of codeText.matchAll(/(?<![A-Za-z0-9_.])<([A-Z][A-Za-z0-9]+)[\s/>]/g)) if (!jsxAllowed.has(m[1]) && !new RegExp(`(?:function|const|class)\\s+${m[1]}\\b`).test(codeText)) problems.push(`${file} uses <${m[1]}>, which is not a component in the manifest or a core export`);
    for (const m of codeText.matchAll(/import\s+(type\s+)?\{([^}]+)\}\s+from\s+"(insightcharts[^"]*)"/g)) {
      if (!(m[3] in runtime)) {
        problems.push(`${file} imports from "${m[3]}", which is not an entry point of the package`);
        continue;
      }
      for (const raw of m[2].split(",").map((s) => s.trim()).filter(Boolean)) {
        const name = raw.replace(/^type\s+/, "").split(/\s+as\s+/)[0];
        const isType = !!m[1] || raw.startsWith("type ");
        if (!(isType ? typeNames.has(name) || runtime[m[3]].has(name) : runtime[m[3]].has(name))) problems.push(`${file} imports ${name} from "${m[3]}", which does not export it`);
      }
    }
    for (const m of text.matchAll(/(?<![-\w])theme(?:=|:\s*)"([a-z-]+)"/g)) if (!(m[1] in themes)) problems.push(`${file} uses theme "${m[1]}", which is not a theme`);
    // Hyphenated names only: an ECharts series type ("scatter") or a prop type ("string") is not a spec type.
    for (const m of codeText.matchAll(/["\s{,]type"?:\s*"([a-z]+-[a-z-]+)"/g)) if (!specTypes.has(m[1])) problems.push(`${file} uses type "${m[1]}", which is not a component, a transform or an annotation`);
    if (/insightcharts\.dev/.test(readFileSync(join(ROOT, file), "utf8"))) problems.push(`${file} writes the site URL as a literal. Use {{SITE_URL}}.`);
  }

  // Every URL on this site that a prompt names must be a page or a file that exists.
  const sitePages = new Set<string>(["", "/docs", "/atoms", "/molecules", "/templates", "/infographics", "/stories", "/llms.txt", "/llms-full.txt", ...mdFiles(join(ROOT, "apps/docs/content/docs")).map((f) => `/docs/${f.replace(/\.md$/, "")}`), ...readdirSync(join(ROOT, "apps/docs/content/docs")).filter((f) => f.endsWith(".mdx") && f !== "index.mdx").map((f) => `/docs/${f.replace(/\.mdx$/, "")}`), ...pages.map((p) => (p.slug === "index" ? "/docs/agents" : `/docs/agents/${p.slug}`)), ...components.map(pagePath), ...components.filter((c) => c.level === "template").map((c) => `${pagePath(c)}/preview`)]);
  const fileExists = (path: string) => out.has(join(PUBLIC, path)) || existsSync(join(PUBLIC, path));
  const escaped = SITE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const [file, text] of texts) {
    for (const m of text.matchAll(new RegExp(`${escaped}(/[^\\s)\`"'<>,;]*)?`, "g"))) {
      const raw = (m[1] ?? "").replace(/[.:]+$/, "");
      if (/[<{|]/.test(m[0] + text.slice(m.index! + m[0].length, m.index! + m[0].length + 1))) continue;
      const path = raw.split("#")[0].replace(/\/$/, "");
      const ok = /^\/(llms|schema|r|agents)\//.test(path) ? fileExists(path) : sitePages.has(path);
      if (!ok) problems.push(`${relative(ROOT, file)} names ${SITE}${raw}, which is not a page or a file of the site`);
    }
  }
  if (problems.length) throw new Error(`Agent prompts are out of date with the source:\n${[...new Set(problems)].slice(0, 60).map((p) => `  - ${p}`).join("\n")}`);

  return entries;
}
