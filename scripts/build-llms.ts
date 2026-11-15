// Builds the agent-facing docs from manifest.json, the component sources and the
// hand-written guides in scripts/llms-guides. Run: pnpm llms
//
// Writes:
//   apps/docs/public/llms.txt                    index (llmstxt.org format)
//   apps/docs/public/llms-full.txt               everything in one file
//   apps/docs/public/llms/<component>.md         one page per component
//   apps/docs/public/llms/guides/<guide>.md      guides, plus the generated common-props page
//   apps/docs/public/schema/insight-spec.json    JSON Schema for <Insight spec>
//   apps/docs/public/schema/manifest.json        copy of the component manifest
//   skills/insightcharts/references/*.md         the skill's reference files
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { compactJson, hoistableData, jsLiteral, levelDir, loadComponents, Output, PKG, PUBLIC, ROOT, specToJsx, SRC, validate, type Component, type ComponentMeta } from "./lib/shared";

const SITE_URL = (process.env.INSIGHTCHARTS_URL ?? "https://insightcharts.dev").replace(/\/+$/, "");
/** GitHub `owner/repo`. A placeholder until the project has a public home. */
const REPO = process.env.INSIGHTCHARTS_REPO ?? "insightcharts/insightcharts";

const GUIDES_DIR = join(ROOT, "scripts/llms-guides");
const SKILL_REFS = join(ROOT, "skills/insightcharts/references");
const SUMMARY = "InsightCharts is an open-source React library of charts, figures, page layouts and infographic posters built on Apache ECharts 6. Components are organised as atoms, molecules and templates. The Infographics set is the templates that draw one designed poster, built from the poster primitives. Every component can be written as JSX or as a JSON spec. Each one carries machine-readable metadata that says when to use it.";

/**
 * Component pages show examples in full: an agent copies the JSON and renders it, so a
 * silently shortened dataset is a broken example. Only the one-file skill catalogue cuts
 * rows, and says so.
 */
const MAIN_ROWS = Number.POSITIVE_INFINITY;
const EXTRA_ROWS = 8;

const pageUrl = (name: string) => `${SITE_URL}/llms/${name}.md`;
const guideUrl = (slug: string) => `${SITE_URL}/llms/guides/${slug}.md`;
const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n+/g, " ");
const code = (s: string) => `\`${s.replace(/\|/g, "\\|")}\``;

// ---------------------------------------------------------------------------------------
// CommonChartProps, read from core/define.tsx so the docs cannot drift from the source.
// ---------------------------------------------------------------------------------------

interface CommonProp {
  name: string;
  type: string;
  description: string;
}

/** Descriptions for the members that have no JSDoc in the source. Checked against the source below. */
const COMMON_FALLBACK: Record<string, string> = {
  theme: "A full theme, `{ light, dark }` partial tokens, or flat tokens applied to both modes. Merged over the surrounding `InsightProvider` theme.",
  animate: "Set false to disable animation for this chart. Reduced-motion preferences are always respected.",
  lazy: "Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`).",
  onEvents: "ECharts event handlers: `{ click: (params, chart) => {} }`.",
  onReady: "Called with the ECharts instance once it is initialised.",
  className: "Class on the figure element.",
  style: "Inline style on the figure element.",
};

function readCommonProps(): CommonProp[] {
  const file = join(SRC, "core/define.tsx");
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const decl = sf.statements.find((s): s is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(s) && s.name.text === "CommonChartProps");
  if (!decl) throw new Error("CommonChartProps not found in core/define.tsx");
  const out: CommonProp[] = [];
  for (const m of decl.members) {
    if (!ts.isPropertySignature(m) || !m.name || !m.type) continue;
    const name = m.name.getText(sf);
    const doc = ts
      .getJSDocCommentsAndTags(m)
      .filter(ts.isJSDoc)
      .map((d) => ts.getTextOfJSDocComment(d.comment) ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const description = doc || COMMON_FALLBACK[name];
    if (!description) throw new Error(`CommonChartProps.${name} has no JSDoc and no fallback description in scripts/build-llms.ts (COMMON_FALLBACK). Add one.`);
    out.push({ name, type: m.type.getText(sf).replace(/\s+/g, " "), description });
  }
  return out;
}

const commonPropsTable = (props: CommonProp[]) => ["| Prop | Type | Description |", "|---|---|---|", ...props.map((p) => `| ${code(p.name)} | ${code(p.type)} | ${cell(p.description)} |`)].join("\n");

// ---------------------------------------------------------------------------------------
// JSON Schema for <Insight spec>
// ---------------------------------------------------------------------------------------

type Schema = Record<string, any>;

function splitTop(input: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote = "";
  let current = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote && input[i - 1] !== "\\") quote = "";
    } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if ("<([{".includes(ch)) depth++;
    else if (">)]}".includes(ch) && !(ch === ">" && input[i - 1] === "=")) depth--;
    else if (ch === sep && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}

const NAMED: Record<string, Schema> = {
  string: { type: "string" },
  number: { type: "number" },
  boolean: { type: "boolean" },
  null: { type: "null" },
  FormatSpec: { $ref: "#/definitions/format" },
  Slot: { $ref: "#/definitions/slot" },
  ReactNode: { $ref: "#/definitions/slot" },
  InsightSpec: { $ref: "#" },
  Annotation: { $ref: "#/definitions/annotation" },
  Transform: { $ref: "#/definitions/transform" },
  TransformSpec: { $ref: "#/definitions/transform" },
  DataInput: { $ref: "#/definitions/data" },
  ThemeInput: { type: "object" },
  ModeInput: { enum: ["auto", "system", "light", "dark"] },
  RendererInput: { enum: ["auto", "svg", "canvas"] },
  ExportFormat: { enum: ["png", "jpeg", "svg", "pdf", "csv", "json"] },
  CSSProperties: { type: "object" },
  EChartsOption: { type: "object" },
  Row: { type: "object" },
  object: { type: "object" },
};

/** Best-effort conversion of a documented TypeScript type to JSON Schema. `null` means "not expressible in JSON" (a function). Unknown names accept anything. */
function typeToSchema(type: string): Schema | null {
  const t = type.trim();
  const union = splitTop(t, "|");
  if (union.length > 1) {
    const parts = union.map(typeToSchema).filter((s): s is Schema => s !== null);
    if (!parts.length) return null;
    if (parts.every((p) => "const" in p)) return { enum: parts.map((p) => p.const) };
    return parts.length === 1 ? parts[0] : { anyOf: parts };
  }
  if (t.includes("=>")) return null;
  if (t.startsWith("(") && t.endsWith(")")) return typeToSchema(t.slice(1, -1));
  if (t.endsWith("[]")) {
    const items = typeToSchema(t.slice(0, -2));
    return items === null ? null : { type: "array", items };
  }
  const literal = /^(["'])(.*)\1$/.exec(t);
  if (literal) return { const: literal[2] };
  if (/^-?\d+(\.\d+)?$/.test(t)) return { const: Number(t) };
  if (t === "true" || t === "false") return { const: t === "true" };
  const generic = /^(\w+)<(.*)>$/.exec(t);
  if (generic) {
    const args = splitTop(generic[2], ",");
    if (generic[1] === "Array" || generic[1] === "ReadonlyArray") return { type: "array", items: typeToSchema(args[0]) ?? {} };
    if (generic[1] === "Record") return { type: "object", additionalProperties: typeToSchema(args[1] ?? "unknown") ?? {} };
    if (generic[1] === "Partial") return { type: "object" };
    return {};
  }
  if (t.startsWith("{")) return { type: "object" };
  if (t.startsWith("[")) return { type: "array" };
  return NAMED[t] ?? {};
}

/** The string literals a discriminated union uses for `type`, read straight from the source file. */
function unionTypes(file: string, typeName: string): string[] {
  const text = readFileSync(join(SRC, file), "utf8");
  const start = text.indexOf(`export type ${typeName} =`);
  if (start === -1) throw new Error(`${typeName} not found in ${file}`);
  const end = text.indexOf("\nexport ", start + 1);
  const body = text.slice(start, end === -1 ? undefined : end);
  return [...new Set([...body.matchAll(/\{\s*(?:\/\*[\s\S]*?\*\/\s*)?type: "([a-z-]+)"/g)].map((m) => m[1]))];
}

function buildSchema(components: Component[], common: CommonProp[], collisions: string[]): Schema {
  const transformTypes = unionTypes("data/types.ts", "TransformSpec");
  const annotationTypes = unionTypes("core/annotations.ts", "Annotation");
  if (annotationTypes.join() !== "line,band,point") throw new Error(`Annotation types changed (${annotationTypes.join(", ")}): update the annotation definition in scripts/build-llms.ts and the guides.`);

  const commonSchema: Record<string, Schema> = {};
  for (const p of common) {
    // Callbacks cannot appear in JSON.
    if (/^on[A-Z]/.test(p.name)) continue;
    const s = p.name === "data" ? { $ref: "#/definitions/data" } : p.name === "transform" ? { anyOf: [{ $ref: "#/definitions/transform" }, { type: "array", items: { $ref: "#/definitions/transform" } }] } : typeToSchema(p.type);
    if (s) commonSchema[p.name] = { ...s, description: p.description };
  }

  const componentDefs: Record<string, Schema> = {};
  for (const c of components) {
    const properties: Record<string, Schema> = { type: { const: c.name } };
    if (c.isChart) Object.assign(properties, commonSchema);
    for (const p of c.props) {
      // `type` is the spec discriminator: a prop with that name can never be set from JSON.
      if (p.name === "type") {
        collisions.push(`${c.name} declares a prop named \`type\`, which collides with the spec discriminator ({ type: "${c.name}" }); it cannot be set through <Insight spec>. Fix: rename the prop (e.g. \`variant\` or \`mark\`) in ${levelDir(c.level)}/${c.name}.tsx.`);
        continue;
      }
      const s = typeToSchema(p.type);
      if (s) properties[p.name] = { ...s, description: p.description, ...(p.default !== undefined ? { $comment: `default: ${p.default}` } : null) };
    }
    if (!c.isChart) {
      // HTML components take these styling props without listing them in their metadata.
      properties.className ??= { type: "string" };
      properties.style ??= { type: "object" };
      properties.theme ??= { type: "object", description: "Theme override: partial tokens, or { light, dark }." };
      properties.mode ??= { enum: ["auto", "system", "light", "dark"], description: "Colour mode." };
    }
    componentDefs[c.name] = {
      title: c.title,
      description: [c.description, c.whenToUse && `Use: ${c.whenToUse}`, c.avoid && `Avoid: ${c.avoid}`].filter(Boolean).join(" "),
      type: "object",
      properties,
      required: ["type", ...c.props.filter((p) => p.required && properties[p.name]).map((p) => p.name)],
      // Unknown keys are rejected everywhere, so typos and invented props are caught.
      additionalProperties: false,
    };
  }

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: `${SITE_URL}/schema/insight-spec.json`,
    title: "InsightCharts spec",
    description: "A component described as JSON: { type, ...props }. Render with <Insight spec={...} />. Generated from the component manifest.",
    oneOf: components.map((c) => ({ $ref: `#/definitions/components/${c.name}` })),
    definitions: {
      components: componentDefs,
      slot: {
        description: "Content for a slot: text, a nested spec, or a list of either.",
        anyOf: [{ type: "string" }, { type: "number" }, { type: "null" }, { $ref: "#" }, { type: "array", items: { $ref: "#/definitions/slot" } }],
      },
      data: {
        description: "Rows, column arrays, CSV text, a URL, { url, format, path }, { csv } or { json, path }.",
        anyOf: [
          { type: "array" },
          { type: "string" },
          { type: "object", required: ["url"], properties: { url: { type: "string" }, format: { enum: ["csv", "tsv", "json", "ndjson"] }, path: { type: "string" }, init: { type: "object" }, refresh: { type: "number" } } },
          { type: "object", required: ["csv"], properties: { csv: { type: "string" }, delimiter: { type: "string" } } },
          { type: "object", required: ["json"], properties: { path: { type: "string" } } },
          { type: "object", description: "Columnar: { field: [values...] }", additionalProperties: { type: "array" } },
        ],
      },
      transform: { type: "object", required: ["type"], properties: { type: { enum: transformTypes } } },
      annotation: {
        oneOf: [
          { type: "object", required: ["type", "axis", "value"], additionalProperties: false, properties: { type: { const: "line" }, axis: { enum: ["x", "y"] }, value: { type: ["string", "number"] }, label: { type: "string" }, dashed: { type: "boolean" }, emphasis: { type: "boolean" } } },
          { type: "object", required: ["type", "axis", "from", "to"], additionalProperties: false, properties: { type: { const: "band" }, axis: { enum: ["x", "y"] }, from: { type: ["string", "number"] }, to: { type: ["string", "number"] }, label: { type: "string" } } },
          { type: "object", required: ["type", "x", "y", "label"], additionalProperties: false, properties: { type: { const: "point" }, x: { type: ["string", "number"] }, y: { type: "number" }, label: { type: "string" }, position: { enum: ["top", "bottom", "left", "right"] }, dot: { type: "boolean" } } },
        ],
      },
      format: {
        description: '"auto", "compact", "percent", "percent-raw", "integer", "signed", "year", "currency:USD", "decimal:2", a "{value} unit" template, or Intl.NumberFormat options.',
        anyOf: [{ type: "string" }, { type: "object" }],
      },
    },
  };
}

// ---------------------------------------------------------------------------------------
// Component pages
// ---------------------------------------------------------------------------------------

/** The optional `examples` export of a component file: extra states keyed by title. */
async function readExtraExamples(c: Component): Promise<Record<string, Record<string, unknown>>> {
  if (!/export const examples\b/.test(c.source)) return {};
  try {
    const mod = (await import(pathToFileURL(c.file).href)) as { examples?: Record<string, Record<string, unknown>> };
    const out: Record<string, Record<string, unknown>> = {};
    for (const [title, props] of Object.entries(mod.examples ?? {})) out[title] = JSON.parse(JSON.stringify({ ...props, type: c.name }));
    return out;
  } catch (error) {
    console.warn(`warning: could not load examples from ${relative(ROOT, c.file)}: ${(error as Error).message}`);
    return {};
  }
}

/** Docs show the shape of the data, not all of it: long inline row arrays are cut to `max` rows. */
function truncateData(spec: Record<string, unknown>, max: number): { spec: Record<string, unknown>; omitted: number } {
  if (!Array.isArray(spec.data) || spec.data.length <= max) return { spec, omitted: 0 };
  return { spec: { ...spec, data: spec.data.slice(0, max) }, omitted: spec.data.length - max };
}

function jsxExample(full: Record<string, unknown>, byName: Map<string, ComponentMeta>, maxRows: number): string {
  const { spec, omitted } = truncateData(full, maxRows);
  const hoist = omitted > 0 || hoistableData(spec);
  const { code: jsx, used, registered } = specToJsx(spec, byName, { replace: hoist ? { data: "data" } : undefined });
  const reg = registered.map((n) => byName.get(n)!.component);
  const names = [...new Set([...used.map((n) => byName.get(n)!.component), ...reg, ...(reg.length ? ["registerComponents"] : [])])].sort();
  let literal = hoist ? jsLiteral(spec.data) : "";
  if (omitted) literal = literal.endsWith("\n]") ? `${literal.slice(0, -1)}  // ... ${omitted} more rows\n]` : `${literal.slice(0, -1)} /* ... ${omitted} more rows */]`;
  return [`import { ${names.join(", ")} } from "insightcharts";`, "", ...(reg.length ? ["// Specs passed as data are resolved by name when rendered.", `registerComponents({ ${reg.join(", ")} });`, ""] : []), ...(hoist ? [`const data = ${literal};`, ""] : []), jsx].join("\n");
}

const propsTable = (props: ComponentMeta["props"]) =>
  ["| Prop | Type | Default | Description |", "|---|---|---|---|", ...props.map((p) => `| ${code(p.name)}${p.required ? " (required)" : ""} | ${code(p.type)} | ${p.default !== undefined ? code(p.default) : ""} | ${cell(p.description)} |`)].join("\n");

interface PageContext {
  byName: Map<string, ComponentMeta>;
  usedBy: Map<string, string[]>;
  common: CommonProp[];
  extras: Map<string, Record<string, Record<string, unknown>>>;
}

/** `inlineCommon: false` is used for llms-full.txt, where the common props appear once. */
function componentPage(c: Component, ctx: PageContext, inlineCommon: boolean): string {
  const link = (name: string) => (ctx.byName.has(name) ? `[${name}](${pageUrl(name)})` : `${name} (not in this release)`);
  const spec = c.example ?? { type: c.name };
  const shortSpec = truncateData(spec, MAIN_ROWS);
  const composes = c.composes ?? [];
  const usedBy = ctx.usedBy.get(c.name) ?? [];
  const extras = Object.entries(ctx.extras.get(c.name) ?? {});
  const lines: string[] = [
    `# ${c.title} (\`${c.name}\`)`,
    "",
    `> ${c.description}`,
    "",
    `- Component: \`${c.component}\` (import from \`insightcharts\`)`,
    `- Spec type: \`"${c.name}"\``,
    `- Level: ${c.level}. Category: ${c.category}.`,
    `- ${c.isChart ? "An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...)." : "An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props."}`,
    "",
  ];
  if (c.whenToUse) lines.push("## When to use", "", c.whenToUse, "");
  if (c.avoid) lines.push("## Avoid", "", c.avoid, "");
  lines.push(
    "## Install",
    "",
    "From npm (the component ships in the package):",
    "",
    "```bash",
    "npm install insightcharts echarts",
    "```",
    "",
    "Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):",
    "",
    "```bash",
    `npx shadcn@latest registry add @insightcharts=${SITE_URL}/r/{name}.json   # once per project`,
    `npx shadcn@latest add @insightcharts/${c.name}`,
    "```",
    "",
    `The file lands at \`components/insightcharts/${levelDir(c.level)}/${c.name}.tsx\`. \`@insightcharts/${c.name}-demo\` adds a ready-made example next to it.`,
    "",
    "## Usage",
    "",
    "```tsx",
    jsxExample(spec, ctx.byName, MAIN_ROWS),
    "```",
    "",
    "## JSON spec",
    "",
    "The same thing as data, rendered with `<Insight spec={spec} />`:",
    "",
    "```json",
    compactJson(shortSpec.spec),
    "```",
    "",
    ...(shortSpec.omitted ? [`The \`data\` array is cut to ${MAIN_ROWS} rows here (${shortSpec.omitted} more in the full example, in ${SITE_URL}/schema/manifest.json).`, ""] : []),
    "## Props",
    "",
    c.props.length ? propsTable(c.props) : "No component-specific props.",
    "",
  );
  if (c.isChart) {
    lines.push("## Common props", "");
    if (inlineCommon) lines.push(`Every chart also accepts these (shared by all charts; also at ${guideUrl("common-props")}):`, "", commonPropsTable(ctx.common), "");
    else lines.push("Also accepts every prop in the \"Common chart props\" section of this file.", "");
  }
  lines.push("## Composition", "", `- Composes: ${composes.length ? composes.map(link).join(", ") : "nothing (it is a primitive)"}`, `- Used by: ${usedBy.length ? usedBy.map(link).join(", ") : "no molecule or template yet"}`, "");
  if (extras.length) {
    lines.push("## More examples", "");
    for (const [title, example] of extras) lines.push(`### ${title}`, "", "```tsx", jsxExample(example, ctx.byName, EXTRA_ROWS), "```", "");
  }
  lines.push(
    "## Links",
    "",
    `- Registry item: ${SITE_URL}/r/${c.name}.json`,
    `- Source: https://github.com/${REPO}/blob/main/packages/insightcharts/src/${levelDir(c.level)}/${c.name}.tsx`,
    `- Spec schema: ${SITE_URL}/schema/insight-spec.json`,
    `- Choosing a form: ${guideUrl("choosing-a-form")}`,
    `- All components: ${SITE_URL}/llms.txt`,
  );
  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------
// Generated fragments used inside the hand-written guides
// ---------------------------------------------------------------------------------------

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

function decisionTable(components: Component[], link: (c: Component) => string): string {
  const known = new Set(JOBS.map(([c]) => c));
  const groups: [string, string][] = [...JOBS, ...[...new Set(components.map((c) => c.category))].filter((c) => !known.has(c)).map((c): [string, string] => [c, c])];
  const rows: string[] = ["| The data's job | Component | Level | Use it when | Pick something else when |", "|---|---|---|---|---|"];
  for (const [category, job] of groups) {
    for (const c of components.filter((x) => x.category === category)) rows.push(`| ${job} | ${link(c)} | ${c.level} | ${cell(c.whenToUse ?? c.description)} | ${cell(c.avoid ?? "")} |`);
  }
  return rows.join("\n");
}

function componentIndex(components: Component[], link: (c: Component) => string): string {
  const out: string[] = [];
  for (const level of ["atom", "molecule", "template"] as const) {
    const list = components.filter((c) => c.level === level);
    out.push(`**${level[0].toUpperCase()}${level.slice(1)}s (${list.length})**`, "");
    out.push(list.length ? list.map((c) => `- ${link(c)}: ${c.description}`).join("\n") : "- None in this release.", "");
  }
  return out.join("\n").trim();
}

async function themeVarsTable(): Promise<string> {
  const { defaultTheme } = (await import("../packages/insightcharts/src/core/theme")) as { defaultTheme: Record<"light" | "dark", Record<string, unknown>> };
  const rows = new Map<string, { token: string; light: string; dark: string }>();
  for (const mode of ["light", "dark"] as const) {
    for (const [token, value] of Object.entries(defaultTheme[mode])) {
      const visit = (v: unknown, label: string) => {
        if (Array.isArray(v)) return v.forEach((item, i) => visit(item, `${token}[${i}]`));
        if (typeof v !== "string") return;
        const m = /^var\(--(ic-[a-z0-9-]+),\s*(.+)\)$/.exec(v);
        if (!m) return;
        const row = rows.get(m[1]) ?? { token: label, light: "", dark: "" };
        row[mode] = m[2];
        rows.set(m[1], row);
        visit(m[2], label);
      };
      visit(value, token);
    }
  }
  return ["| CSS variable | Token | Light default | Dark default |", "|---|---|---|---|", ...[...rows].map(([name, r]) => `| \`--${name}\` | \`${r.token}\` | \`${r.light}\` | \`${r.dark}\` |`)].join("\n");
}

// ---------------------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------------------

interface Guide {
  slug: string;
  title: string;
  description: string;
  order: number;
  /** File name under skills/insightcharts/references this guide is also published as. */
  skill?: string;
  body: string;
}

function readGuides(fragments: Record<string, string>): Guide[] {
  const guides: Guide[] = [];
  for (const file of readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".md")).sort()) {
    const raw = readFileSync(join(GUIDES_DIR, file), "utf8");
    const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
    if (!m) throw new Error(`${file}: missing frontmatter (title, description, order)`);
    const front = Object.fromEntries(m[1].split("\n").map((line) => [line.slice(0, line.indexOf(":")).trim(), line.slice(line.indexOf(":") + 1).trim()]));
    if (!front.title || !front.description) throw new Error(`${file}: frontmatter needs title and description`);
    const body = m[2].replace(/\{\{([A-Z_]+)\}\}/g, (_all, key: string) => {
      if (!(key in fragments)) throw new Error(`${file}: unknown placeholder {{${key}}}`);
      return fragments[key];
    });
    guides.push({ slug: file.replace(/\.md$/, ""), title: front.title, description: front.description, order: Number(front.order ?? 99), skill: front.skill || undefined, body: `# ${front.title}\n\n${body.trim()}\n` });
  }
  return guides.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** Things the guides must mention to stay true to the source. Fails the build when they fall behind. */
function checkGuides(guides: Guide[], componentNames: string[]) {
  const bySlug = new Map(guides.map((g) => [g.slug, g.body]));
  const problems: string[] = [];
  const need = (slug: string, what: string, tokens: string[]) => {
    const body = bySlug.get(slug);
    if (!body) return problems.push(`guide ${slug}.md is missing`);
    for (const t of tokens) if (!body.includes(t)) problems.push(`${slug}.md does not mention ${what} ${t}`);
  };
  need("data", "transform", unionTypes("data/types.ts", "TransformSpec").map((t) => `"${t}"`));
  const types = readFileSync(join(SRC, "data/types.ts"), "utf8");
  const ops = (name: string) => [...(new RegExp(`export type ${name} = ([^;]+);`).exec(types)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => `\`${m[1]}\``);
  need("data", "filter op", ops("FilterOp"));
  need("data", "aggregate op", ops("AggregateOp"));
  const scrolly = readFileSync(join(SRC, "story/scrolly.tsx"), "utf8");
  const scrollyProps = /export interface ScrollyProps[\s\S]*?\n\}/.exec(scrolly)?.[0] ?? "";
  need("stories", "Scrolly prop", [...scrollyProps.matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => `\`${m[1]}\``));
  // Every JSX tag in a guide must be a real export, so examples cannot reference components that do not exist.
  const allowed = new Set([...componentNames, "Insight", "InsightData", "InsightProvider", "Scrolly", "Figure", "Chart"]);
  for (const g of guides) for (const m of g.body.matchAll(/(?<![A-Za-z0-9_])<([A-Z][A-Za-z0-9]+)[\s/>]/g)) if (!allowed.has(m[1])) problems.push(`${g.slug}.md uses <${m[1]}>, which is not a component in the manifest or a core export`);
  if (problems.length) throw new Error(`Guides are out of date with the source:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
}

// ---------------------------------------------------------------------------------------

async function main() {
  const components = loadComponents();
  const byName = new Map<string, ComponentMeta>(components.map((c) => [c.name, c]));
  const usedBy = new Map<string, string[]>();
  for (const c of components) for (const dep of c.composes ?? []) usedBy.set(dep, [...(usedBy.get(dep) ?? []), c.name]);
  const common = readCommonProps();
  const extras = new Map<string, Record<string, Record<string, unknown>>>();
  for (const c of components) extras.set(c.name, await readExtraExamples(c));
  const ctx: PageContext = { byName, usedBy, common, extras };

  // The spec schema, checked against every example we publish.
  const schemaWarnings: string[] = [];
  const schema = buildSchema(components, common, schemaWarnings);
  for (const c of components) {
    const all: [string, Record<string, unknown>][] = [["example", c.example ?? { type: c.name }], ...Object.entries(extras.get(c.name) ?? {})];
    for (const [title, spec] of all) for (const e of validate(JSON.parse(JSON.stringify(spec)), schema)) schemaWarnings.push(`${c.name} (${title}): ${e}`);
  }

  const mdLink = (c: Component) => `[${c.name}](${pageUrl(c.name)})`;
  const fragments: Record<string, string> = {
    SITE_URL,
    REPO,
    COMMON_PROPS: commonPropsTable(common),
    DECISION_TABLE: decisionTable(components, mdLink),
    COMPONENT_INDEX: componentIndex(components, mdLink),
    THEME_VARS: await themeVarsTable(),
    COMPONENT_COUNT: String(components.length),
  };
  const guides = readGuides(fragments);
  checkGuides(guides, components.map((c) => c.component));
  const commonGuide: Guide = {
    slug: "common-props",
    title: "Common chart props",
    description: "The props every chart built with defineChart accepts, generated from CommonChartProps.",
    order: 2.5,
    body: `# Common chart props\n\nEvery chart built with \`defineChart\` accepts these on top of its own props. HTML components (big-number, callout, ...) do not. All are JSON-serialisable except the callbacks (\`onSelect\`, \`onEvents\`, \`onReady\`) and the function forms of \`data\`, \`transform\`, \`format\` and \`option\`. Generated from \`CommonChartProps\` in \`packages/insightcharts/src/core/define.tsx\`.\n\n${commonPropsTable(common)}\n`,
  };
  const allGuides = [...guides, commonGuide].sort((a, b) => a.order - b.order);

  const out = new Output();
  const llmsDir = join(PUBLIC, "llms");
  out.own(llmsDir);
  out.own(join(PUBLIC, "schema"));
  out.own(SKILL_REFS);

  for (const c of components) out.add(join(llmsDir, `${c.name}.md`), componentPage(c, ctx, true));
  for (const g of allGuides) out.add(join(llmsDir, "guides", `${g.slug}.md`), g.body);
  out.json(join(PUBLIC, "schema/insight-spec.json"), schema);
  out.add(join(PUBLIC, "schema/manifest.json"), readFileSync(join(PKG, "manifest.json"), "utf8"));

  // llms.txt
  const levels: [ComponentMeta["level"], string][] = [
    ["atom", "Atoms"],
    ["molecule", "Molecules"],
    ["template", "Templates"],
  ];
  const index: string[] = [
    "# InsightCharts",
    "",
    `> ${SUMMARY}`,
    "",
    "Install with `npm install insightcharts echarts`, or copy component source with the shadcn CLI from the `@insightcharts` registry. Charts take `data` plus field names (`x`, `y`, `series`), a `title`, and optional `highlight` and `annotations`. Write `title` as one plain statement of what the data shows, with the number and the period (\"Monthly churn fell from 4.2% to 2.1% in 2024\"), or as a plain label. The full writing rules are in \"Choosing a form\". Any component can also be a JSON spec `{ \"type\": \"bar-chart\", ... }` rendered by `<Insight spec>`. Templates with the category `infographic` are the Infographics set. Each one draws a designed poster on a painted ground from one spec with a poster theme (see the \"Infographics\" guide). Use only the component names listed here. Start with the quickstart and \"Choosing a form\".",
    "",
    "## Guides",
    "",
    ...allGuides.map((g) => `- [${g.title}](${guideUrl(g.slug)}): ${g.description}`),
    "",
  ];
  for (const [level, heading] of levels) {
    const list = components.filter((c) => c.level === level);
    if (!list.length) continue;
    index.push(`## ${heading}`, "", ...list.map((c) => `- [${c.title}](${pageUrl(c.name)}): ${c.description}`), "");
  }
  index.push(
    "## Machine-readable",
    "",
    `- [Spec JSON Schema](${SITE_URL}/schema/insight-spec.json): validates any \`<Insight spec>\` object`,
    `- [Component manifest](${SITE_URL}/schema/manifest.json): every component's metadata, props and example as JSON`,
    `- [shadcn registry](${SITE_URL}/r/registry.json): installable items; one built item at \`${SITE_URL}/r/<name>.json\``,
    "",
    "## Optional",
    "",
    `- [Everything in one file](${SITE_URL}/llms-full.txt): all guides and component pages concatenated`,
    `- [Agent skill](https://github.com/${REPO}/tree/main/skills/insightcharts): install with \`npx skills add ${REPO}\` or \`npx shadcn@latest add @insightcharts/agent-skill\``,
  );
  out.add(join(PUBLIC, "llms.txt"), index.join("\n"));

  // llms-full.txt: demote each page's headings by one so the file has a single H1.
  const demote = (md: string) =>
    md
      .split("\n")
      .reduce<{ lines: string[]; fenced: boolean }>(
        (acc, line) => {
          if (line.startsWith("```")) acc.fenced = !acc.fenced;
          acc.lines.push(!acc.fenced && /^#{1,5} /.test(line) ? `#${line}` : line);
          return acc;
        },
        { lines: [], fenced: false },
      )
      .lines.join("\n")
      .trim();
  const full: string[] = ["# InsightCharts", "", `> ${SUMMARY}`, "", `This file is the complete agent documentation: ${allGuides.length} guides, then ${components.length} component pages. Index: ${SITE_URL}/llms.txt`, ""];
  for (const g of allGuides) full.push(demote(g.body), "", "---", "");
  for (const c of components) full.push(demote(componentPage(c, ctx, false)), "", "---", "");
  out.add(join(PUBLIC, "llms-full.txt"), full.join("\n").replace(/\n---\n\s*$/, "\n"));

  // Skill references: the catalogue plus the guides marked `skill:` in their frontmatter.
  const note = "<!-- Generated by scripts/build-llms.ts. Do not edit; edit scripts/llms-guides or the component metadata and run `pnpm llms`. -->";
  const catalogue: string[] = [
    note,
    "",
    "# Component catalogue",
    "",
    `${components.length} components. Use only these names; anything else will not render. \"Chart\" components accept the common chart props listed at the end; \"HTML\" components take only their own props.`,
    "",
    "## Choosing",
    "",
    decisionTable(components, (c) => `\`${c.name}\``),
    "",
  ];
  for (const [level, heading] of levels) {
    const list = components.filter((c) => c.level === level);
    if (!list.length) continue;
    catalogue.push(`## ${heading}`, "");
    for (const c of list) {
      catalogue.push(
        `### ${c.name}`,
        "",
        `\`<${c.component}>\`, ${c.isChart ? "chart" : "HTML"}, category ${c.category}. ${c.description}`,
        "",
        ...(c.composes?.length ? [`Composes: ${c.composes.map((n) => `\`${n}\``).join(", ")}.`, ""] : []),
        ...(c.props.length ? ["Props:", "", ...c.props.map((p) => `- \`${p.name}\`${p.required ? " (required)" : ""}: \`${p.type}\`${p.default !== undefined ? `, default \`${p.default}\`` : ""}. ${p.description}`), ""] : []),
        "```json",
        JSON.stringify(truncateData(c.example ?? { type: c.name }, EXTRA_ROWS).spec),
        "```",
        ...(truncateData(c.example ?? { type: c.name }, EXTRA_ROWS).omitted ? ["", `(\`data\` cut to ${EXTRA_ROWS} rows.)`] : []),
        "",
      );
    }
  }
  catalogue.push("## Common chart props", "", commonPropsTable(common), "", `Full pages: ${SITE_URL}/llms.txt`);
  out.add(join(SKILL_REFS, "components.md"), catalogue.join("\n"));
  for (const g of guides) if (g.skill) out.add(join(SKILL_REFS, g.skill), `${note}\n\n${g.body}`);

  const result = out.flush();
  console.log(`llms: ${components.length} component pages, ${allGuides.length} guides, llms.txt, llms-full.txt, schema/insight-spec.json -> ${relative(ROOT, PUBLIC)}/`);
  console.log(`llms: skill references -> ${relative(ROOT, SKILL_REFS)}/ (${["components.md", ...guides.filter((g) => g.skill).map((g) => g.skill)].join(", ")})`);
  console.log(`llms: ${result.written} written, ${result.unchanged} unchanged, ${result.removed} removed; site ${SITE_URL}`);
  if (schemaWarnings.length) {
    console.warn(`\nllms: ${schemaWarnings.length} spec problem(s). An example that does not validate usually means a prop is used but missing from the component's \`props\` metadata, or its documented type is wrong:\n${schemaWarnings.map((w) => `  - ${w}`).join("\n")}\n`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
