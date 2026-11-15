// Builds the shadcn registry from manifest.json and the component sources. Run: pnpm registry
//
// The engine (insightcharts/core, /data, /story, /themes) stays in the npm package. Registry
// items copy each component's *source* into the consumer's project, with imports rewritten
// to the package entry points, so the consumer owns and can edit the component.
//
// Writes:
//   apps/docs/public/r/<item>.json    one built item per file, source inlined (what the CLI fetches)
//   apps/docs/public/r/registry.json  the catalogue (no file content)
//   registry.json                     root catalogue, for `npx shadcn add <owner>/<repo>/<item>`
//   registry/insightcharts/**         the rewritten sources the root catalogue points at
//
// Set REGISTRY_SKIP_INVALID=1 to skip (rather than fail on) components that import
// something the package entry points do not export.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import ts from "typescript";
import { hoistableData, jsLiteral, levelDir, loadComponents, Output, PUBLIC, ROOT, SITE_URL, specToJsx, SRC, validate, type Component, type ComponentMeta, type SchemaStore } from "./lib/shared";


const NAMESPACE = "@insightcharts";
const TARGET_ROOT = "components/insightcharts";
const ALIAS_ROOT = `@/${TARGET_ROOT}`;
const GENERATED_SRC = "registry/insightcharts";
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
const RESERVED = ["theme", "insight", "agent-skill", "agent-skill-agents", "registry"];

/** Source directory -> the package entry point that re-exports it. */
const ENTRY_POINTS: { dir: string; module: string; entry: string }[] = [
  { dir: "core", module: "insightcharts/core", entry: "core/index.ts" },
  { dir: "data", module: "insightcharts/data", entry: "data/index.ts" },
  { dir: "story", module: "insightcharts/story", entry: "story/index.ts" },
  { dir: "themes", module: "insightcharts/themes", entry: "themes/index.ts" },
];
const ROOT_ENTRY = { module: "insightcharts", entry: "index.ts" };
const LEVEL_DIRS = ["atoms", "molecules", "templates"];

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  $schema?: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> };
  css?: Record<string, unknown>;
  docs?: string;
  categories?: string[];
  meta?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------------------
// What each package entry point exports, read with the TypeScript checker.
// ---------------------------------------------------------------------------------------

function readEntryExports(): Map<string, Set<string>> {
  const entries = [...ENTRY_POINTS, ROOT_ENTRY];
  const program = ts.createProgram(
    entries.map((e) => join(SRC, e.entry)),
    { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022, skipLibCheck: true, noEmit: true, allowImportingTsExtensions: false },
  );
  const checker = program.getTypeChecker();
  const out = new Map<string, Set<string>>();
  for (const e of entries) {
    const sf = program.getSourceFile(join(SRC, e.entry));
    const symbol = sf && checker.getSymbolAtLocation(sf);
    if (!symbol) throw new Error(`Could not read exports of ${e.entry}`);
    out.set(e.module, new Set(checker.getExportsOfModule(symbol).map((s) => s.getName())));
  }
  return out;
}

// ---------------------------------------------------------------------------------------
// Source rewriting
// ---------------------------------------------------------------------------------------

interface ImportGroup {
  module: string;
  sideEffect: boolean;
  defaultName?: { name: string; typeOnly: boolean };
  namespace?: { name: string; typeOnly: boolean };
  named: Map<string, { imported: string; local: string; typeOnly: boolean }>;
  /** `export ... from` statements that pointed at this module, re-emitted verbatim with the new specifier. */
  reexports: string[];
}

interface Rewritten {
  content: string;
  /** Registry names of sibling components this file imports. */
  dependsOn: string[];
  /** Absolute paths of non-component helper files (e.g. `atoms/_shared.ts`) that must ship with the item. */
  helpers: string[];
  problems: string[];
}

const resolveSource = (from: string, specifier: string): string | undefined => {
  const base = resolve(dirname(from), specifier);
  return [`${base}.tsx`, `${base}.ts`, join(base, "index.ts"), join(base, "index.tsx"), base].find((f) => existsSync(f) && /\.tsx?$/.test(f));
};

function rewriteSource(file: string, owner: string, byFile: Map<string, Component>, entryExports: Map<string, Set<string>>, options: { stripExamples: boolean }): Rewritten {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const problems: string[] = [];
  const dependsOn: string[] = [];
  const helpers: string[] = [];
  const groups = new Map<string, ImportGroup>();
  const remove: [number, number][] = [];
  const rel = relative(ROOT, file);

  const group = (module: string): ImportGroup => {
    let g = groups.get(module);
    if (!g) groups.set(module, (g = { module, sideEffect: false, named: new Map(), reexports: [] }));
    return g;
  };

  /** Map a module specifier as written to the one the installed file should use. */
  const mapSpecifier = (specifier: string, names: string[]): string | null => {
    if (!specifier.startsWith(".")) return specifier;
    const target = resolveSource(file, specifier);
    if (!target || !target.startsWith(SRC)) {
      problems.push(`${owner}: ${rel} imports "${specifier}", which does not resolve to a file under packages/insightcharts/src.`);
      return null;
    }
    const [top, ...rest] = relative(SRC, target).split("/");
    const entry = ENTRY_POINTS.find((e) => e.dir === top) ?? (rest.length === 0 && /^(index|insight)\.tsx?$/.test(top) ? ROOT_ENTRY : undefined);
    if (entry) {
      const exported = entryExports.get(entry.module)!;
      for (const name of names) {
        if (!exported.has(name)) {
          problems.push(`${owner}: ${rel} imports \`${name}\` from "${specifier}", but "${entry.module}" does not export it. Fix: export \`${name}\` from packages/insightcharts/src/${entry.entry}, or stop using it in ${basename(file)}.`);
        }
      }
      return entry.module;
    }
    if (LEVEL_DIRS.includes(top) && rest.length === 1) {
      const stem = rest[0].replace(/\.tsx?$/, "");
      if (stem === "index") {
        problems.push(`${owner}: ${rel} imports the generated "${specifier}" index. Fix: import the component file directly (e.g. "../atoms/bar-chart") so the registry knows which item it depends on.`);
        return null;
      }
      const sibling = byFile.get(target);
      if (sibling) {
        if (sibling.name !== owner && !dependsOn.includes(sibling.name)) dependsOn.push(sibling.name);
      } else if (!helpers.includes(target)) helpers.push(target);
      return `${ALIAS_ROOT}/${top}/${stem}`;
    }
    problems.push(`${owner}: ${rel} imports "${specifier}" (${relative(ROOT, target)}), which is not reachable from an installed component. Fix: import from core, data, story, themes or a sibling component file.`);
    return null;
  };

  for (const stmt of sf.statements) {
    if (ts.isExpressionStatement(stmt) && ts.isStringLiteral(stmt.expression) && stmt.expression.text === "use client") {
      remove.push([stmt.getStart(), stmt.end]);
    } else if (ts.isImportDeclaration(stmt)) {
      const specifier = (stmt.moduleSpecifier as ts.StringLiteral).text;
      const clause = stmt.importClause;
      const bindings = clause?.namedBindings;
      const named = bindings && ts.isNamedImports(bindings) ? bindings.elements : [];
      const module = mapSpecifier(specifier, named.map((el) => (el.propertyName ?? el.name).text));
      remove.push([stmt.getStart(), stmt.end]);
      if (!module) continue;
      const g = group(module);
      if (!clause) {
        g.sideEffect = true;
        continue;
      }
      const declTypeOnly = clause.isTypeOnly;
      if (clause.name) {
        if (specifier.startsWith(".")) problems.push(`${owner}: ${rel} uses a default import from "${specifier}". Fix: use a named import.`);
        g.defaultName = { name: clause.name.text, typeOnly: declTypeOnly };
      }
      if (bindings && ts.isNamespaceImport(bindings)) g.namespace = { name: bindings.name.text, typeOnly: declTypeOnly };
      for (const el of named) {
        const local = el.name.text;
        const typeOnly = declTypeOnly || el.isTypeOnly;
        const prev = g.named.get(local);
        g.named.set(local, { imported: (el.propertyName ?? el.name).text, local, typeOnly: prev ? prev.typeOnly && typeOnly : typeOnly });
      }
    } else if (ts.isExportDeclaration(stmt) && stmt.moduleSpecifier) {
      const specifier = (stmt.moduleSpecifier as ts.StringLiteral).text;
      const names = stmt.exportClause && ts.isNamedExports(stmt.exportClause) ? stmt.exportClause.elements.map((el) => (el.propertyName ?? el.name).text) : [];
      const module = mapSpecifier(specifier, names);
      remove.push([stmt.getStart(), stmt.end]);
      if (module) group(module).reexports.push(text.slice(stmt.getStart(), stmt.moduleSpecifier.getStart()) + JSON.stringify(module) + ";");
    }
  }

  // `export const examples = {...}` feeds the gallery and docs; installed code does not need it.
  if (options.stripExamples) {
    const examples = sf.statements.find((s): s is ts.VariableStatement => ts.isVariableStatement(s) && !!s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && s.declarationList.declarations.length === 1 && ts.isIdentifier(s.declarationList.declarations[0].name) && s.declarationList.declarations[0].name.text === "examples");
    if (examples) {
      let references = 0;
      const count = (node: ts.Node) => {
        if (ts.isIdentifier(node) && node.text === "examples") references++;
        node.forEachChild(count);
      };
      sf.statements.filter((s) => s !== examples).forEach(count);
      // Only safe when nothing else in the file reads it.
      if (references === 0) {
        // Also drop the private fixtures (sample rows, generators) that only `examples` used,
        // so the installed file compiles under noUnusedLocals. A declaration goes only if
        // something already removed referenced it and nothing that remains does.
        const identCache = new Map<ts.Node, Set<string>>();
        const idents = (node: ts.Node): Set<string> => {
          let set = identCache.get(node);
          if (!set) {
            set = new Set<string>();
            const walk = (n: ts.Node) => {
              if (ts.isIdentifier(n)) set!.add(n.text);
              n.forEachChild(walk);
            };
            walk(node);
            identCache.set(node, set);
          }
          return set;
        };
        const declared = (stmt: ts.Statement): string[] | null => {
          if (ts.canHaveModifiers(stmt) && ts.getModifiers(stmt)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return null;
          if (ts.isVariableStatement(stmt)) return stmt.declarationList.declarations.every((d) => ts.isIdentifier(d.name)) ? stmt.declarationList.declarations.map((d) => (d.name as ts.Identifier).text) : null;
          if ((ts.isFunctionDeclaration(stmt) || ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) && stmt.name) return [stmt.name.text];
          return null;
        };
        const gone = new Set<ts.Statement>([examples]);
        for (let changed = true; changed; ) {
          changed = false;
          for (const stmt of sf.statements) {
            if (gone.has(stmt)) continue;
            const names = declared(stmt);
            if (!names || !names.some((n) => [...gone].some((g) => idents(g).has(n)))) continue;
            const rest = sf.statements.filter((other) => other !== stmt && !gone.has(other) && !ts.isImportDeclaration(other));
            if (names.some((n) => rest.some((other) => idents(other).has(n)))) continue;
            gone.add(stmt);
            changed = true;
          }
        }
        for (const stmt of gone) remove.push([stmt.getFullStart(), stmt.end]);
      }
    }
  }

  let body = "";
  let cursor = 0;
  for (const [start, end] of remove.sort((a, b) => a[0] - b[0])) {
    body += text.slice(cursor, start);
    cursor = text[end] === "\n" ? end + 1 : end;
  }
  body += text.slice(cursor);

  // Drop imports the remaining code no longer mentions (stripping `examples` can orphan
  // some, and consumers often compile with noUnusedLocals).
  const bodySf = ts.createSourceFile(file, body, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const mentioned = new Set<string>();
  const collect = (node: ts.Node) => {
    if (ts.isIdentifier(node)) mentioned.add(node.text);
    node.forEachChild(collect);
  };
  collect(bodySf);

  const lines: string[] = [];
  for (const g of groups.values()) {
    const named = [...g.named.values()].filter((n) => mentioned.has(n.local));
    const def = g.defaultName && mentioned.has(g.defaultName.name) ? g.defaultName : undefined;
    const ns = g.namespace && mentioned.has(g.namespace.name) ? g.namespace : undefined;
    const from = JSON.stringify(g.module);
    const spec = (n: { imported: string; local: string }) => (n.imported === n.local ? n.local : `${n.imported} as ${n.local}`);
    if (ns) lines.push(`import ${ns.typeOnly ? "type " : ""}* as ${ns.name} from ${from};`);
    if (def || named.length) {
      const allTypes = named.length > 0 && named.every((n) => n.typeOnly) && (!def || def.typeOnly);
      const list = named.map((n) => (n.typeOnly && !allTypes ? `type ${spec(n)}` : spec(n))).join(", ");
      // `import type Default, { Named }` is not valid TypeScript, so a type-only default gets its own statement.
      if (def && allTypes && named.length) {
        lines.push(`import type ${def.name} from ${from};`, `import type { ${list} } from ${from};`);
      } else {
        const parts = [def?.name, named.length ? `{ ${list} }` : undefined].filter(Boolean).join(", ");
        lines.push(`import ${allTypes || (def?.typeOnly && !named.length) ? "type " : ""}${parts} from ${from};`);
      }
    } else if (g.sideEffect) lines.push(`import ${from};`);
    lines.push(...g.reexports);
  }

  const content = `"use client";\n\n${lines.join("\n")}\n\n${body.trim().replace(/\n{3,}/g, "\n\n")}\n`;
  return { content, dependsOn, helpers, problems };
}

// ---------------------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------------------

const address = (name: string) => `${NAMESPACE}/${name}`;
const docsUrl = (name: string) => `${SITE_URL}/llms/${name}.md`;

function componentItem(c: Component, byFile: Map<string, Component>, entryExports: Map<string, Set<string>>): { item: RegistryItem; problems: string[] } {
  const problems: string[] = [];
  const files: RegistryFile[] = [];
  const deps: string[] = [];
  const seen = new Set<string>();
  const queue = [c.file];
  while (queue.length) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const out = rewriteSource(file, c.name, byFile, entryExports, { stripExamples: file === c.file });
    problems.push(...out.problems);
    for (const d of out.dependsOn) if (!deps.includes(d)) deps.push(d);
    queue.push(...out.helpers);
    const within = relative(SRC, file);
    files.push({ path: `${GENERATED_SRC}/${within}`, type: "registry:component", target: `${TARGET_ROOT}/${within}`, content: out.content });
  }
  // `composes` is what the docs cross-link from; it should agree with what the source imports.
  for (const d of deps) if (!(c.composes ?? []).includes(d)) console.warn(`warning: ${c.name} imports ${d} but does not list it in meta.composes`);
  return {
    problems,
    item: {
      name: c.name,
      type: "registry:component",
      title: c.title,
      description: c.description,
      dependencies: ["insightcharts", "echarts"],
      ...(deps.length ? { registryDependencies: deps.map(address) } : null),
      files,
      docs: `${c.title}: ${docsUrl(c.name)}`,
      categories: [c.level, c.category],
      meta: { level: c.level, category: c.category, component: c.component, composes: c.composes ?? [] },
    },
  };
}

function demoSource(c: Component, byName: Map<string, ComponentMeta>): { content: string; used: string[] } {
  const spec = c.example ?? { type: c.name };
  const hoist = hoistableData(spec);
  const { code, used: direct, registered } = specToJsx(spec, byName, { indent: 2, replace: hoist ? { data: "data" } : undefined });
  const used = [...direct, ...registered.filter((n) => !direct.includes(n))];
  const imports = used.map((name) => {
    const meta = byName.get(name)!;
    return `import { ${meta.component} } from "${ALIAS_ROOT}/${levelDir(meta.level)}/${meta.name}";`;
  });
  const content = [
    ...(registered.length ? ['import { registerComponents } from "insightcharts";'] : []),
    ...imports,
    "",
    // Specs that stay data are resolved by name at render time.
    ...(registered.length ? [`registerComponents({ ${registered.map((n) => byName.get(n)!.component).join(", ")} });`, ""] : []),
    ...(hoist ? [`const data = ${jsLiteral(spec.data)};`, ""] : []),
    `export function ${c.component}Demo() {`,
    "  return (",
    `    ${code}`,
    "  );",
    "}",
    "",
  ].join("\n");
  return { content, used };
}

function demoItem(c: Component, byName: Map<string, ComponentMeta>): RegistryItem {
  const { content, used } = demoSource(c, byName);
  const file = `demos/${c.name}-demo.tsx`;
  return {
    name: `${c.name}-demo`,
    type: "registry:block",
    title: `${c.title} demo`,
    description: `${c.title} rendered with its example data, ready to paste into a page.`,
    registryDependencies: (used.includes(c.name) ? used : [c.name, ...used]).map(address),
    files: [{ path: `${GENERATED_SRC}/${file}`, type: "registry:component", target: `${TARGET_ROOT}/${file}`, content }],
    docs: `Render <${c.component}Demo /> from ${ALIAS_ROOT}/${file.replace(/\.tsx$/, "")}.`,
    categories: ["demo", c.level, c.category],
  };
}

/** `--ic-*` variables and their defaults, read from the `var(--ic-x, fallback)` strings in defaultTheme. */
async function themeItem(): Promise<RegistryItem> {
  const { defaultTheme } = (await import("../packages/insightcharts/src/core/theme")) as { defaultTheme: Record<"light" | "dark", Record<string, unknown>> };
  const extract = (tokens: Record<string, unknown>) => {
    const vars: Record<string, string> = {};
    const visit = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (typeof value !== "string") return;
      const m = /^var\(--(ic-[a-z0-9-]+),\s*(.+)\)$/.exec(value);
      if (!m) return;
      if (!(m[1] in vars)) vars[m[1]] = m[2];
      // A fallback may itself reference another --ic-* variable (the display font does).
      visit(m[2]);
    };
    Object.values(tokens).forEach(visit);
    return vars;
  };
  const light = extract(defaultTheme.light);
  const dark = extract(defaultTheme.dark);
  if (!Object.keys(light).length) throw new Error("theme: found no --ic-* variables in defaultTheme; has core/theme.ts changed shape?");
  const prefixed = (vars: Record<string, string>) => Object.fromEntries(Object.entries(vars).map(([k, v]) => [`--${k}`, v]));
  // Only repeat in .dark what actually differs.
  const darkDiff = Object.fromEntries(Object.entries(dark).filter(([k, v]) => light[k] !== v));
  return {
    name: "theme",
    type: "registry:theme",
    title: "InsightCharts theme variables",
    description: "Adds the --ic-* CSS variables (light and dark) to your stylesheet so charts can be restyled from CSS. The values are the library defaults; edit them to re-skin.",
    // Written with `css` rather than `cssVars`: for cssVars the CLI also generates a Tailwind
    // `@theme inline` block that maps each name to itself (`--ic-font: var(--ic-font)`), which
    // is a cyclic custom property and silently cancels the override.
    css: { ":root": prefixed(light), ".dark": prefixed(darkDiff) },
    docs: `Edit the --ic-* variables in your global CSS. Guide: ${SITE_URL}/llms/guides/theming.md`,
    categories: ["theme"],
  };
}

function insightItem(): RegistryItem {
  const content = `"use client";

import { Insight as PackageInsight, registerComponents, type InsightProps } from "insightcharts";

// <Insight spec={{ type: "bar-chart", ... }} /> renders any InsightCharts component from JSON.
// By default every type resolves to the component shipped in the insightcharts package.
// To make specs render a copy you installed and customised from the registry, import it
// and pass it to registerComponents: the last registration for a name wins.
//
//   import { BarChart } from "${ALIAS_ROOT}/atoms/bar-chart";
//   registerComponents({ BarChart });

export { registerComponents };
export type { InsightProps };

export function Insight(props: InsightProps) {
  return <PackageInsight {...props} />;
}
`;
  return {
    name: "insight",
    type: "registry:component",
    title: "Insight spec renderer",
    description: "Renders any InsightCharts component from a JSON spec ({ type, ...props }), with a place to register customised local copies.",
    dependencies: ["insightcharts", "echarts"],
    files: [{ path: `${GENERATED_SRC}/insight.tsx`, type: "registry:component", target: `${TARGET_ROOT}/insight.tsx`, content }],
    docs: `Spec format: ${SITE_URL}/llms/guides/json-spec.md  JSON Schema: ${SITE_URL}/schema/insight-spec.json`,
    categories: ["spec"],
  };
}

function skillItems(): RegistryItem[] {
  const dir = join(ROOT, "skills/insightcharts");
  if (!existsSync(join(dir, "SKILL.md"))) throw new Error("skills/insightcharts/SKILL.md is missing.");
  const walk = (d: string): string[] =>
    readdirSync(d, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const sources = walk(dir).filter((f) => f.endsWith(".md"));
  const make = (name: string, base: string, title: string): RegistryItem => ({
    name,
    type: "registry:file",
    title,
    description: `Installs the InsightCharts agent skill into ${base}/insightcharts so coding agents know how to build data stories with the library.`,
    // `~/` anchors the target at the project root, also in projects that use a src/ directory.
    files: sources.map((f) => ({ path: relative(ROOT, f), type: "registry:file", target: `~/${base}/insightcharts/${relative(dir, f)}`, content: readFileSync(f, "utf8") })),
    categories: ["agent"],
  });
  return [make("agent-skill", ".claude/skills", "InsightCharts agent skill (Claude Code)"), make("agent-skill-agents", ".agents/skills", "InsightCharts agent skill (.agents)")];
}

// ---------------------------------------------------------------------------------------
// Validation against the official schemas
// ---------------------------------------------------------------------------------------

async function loadSchemas(): Promise<SchemaStore | null> {
  const cacheDir = join(ROOT, "node_modules/.cache/insightcharts");
  const store: SchemaStore = {};
  for (const url of [REGISTRY_SCHEMA, ITEM_SCHEMA]) {
    const cached = join(cacheDir, basename(url));
    if (!existsSync(cached)) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`${res.status}`);
        const body = await res.text();
        JSON.parse(body);
        mkdirSync(cacheDir, { recursive: true });
        writeFileSync(cached, body);
      } catch {
        return null;
      }
    }
    store[url] = JSON.parse(readFileSync(cached, "utf8"));
  }
  return store;
}

/** Offline fallback: the handful of rules that matter most, checked by hand. */
function structuralProblems(item: RegistryItem, built: boolean): string[] {
  const out: string[] = [];
  if (!item.name || !/^[a-z0-9-]+$/.test(item.name)) out.push(`${item.name}: name must be kebab-case`);
  if (!item.type?.startsWith("registry:")) out.push(`${item.name}: missing type`);
  for (const f of item.files ?? []) {
    if (!f.path || !f.type) out.push(`${item.name}: file needs path and type`);
    if (f.type === "registry:file" && !f.target) out.push(`${item.name}: registry:file needs a target`);
    if (built && typeof f.content !== "string") out.push(`${item.name}: built file ${f.path} has no content`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------

async function main() {
  const components = loadComponents();
  const byName = new Map<string, ComponentMeta>(components.map((c) => [c.name, c]));
  const byFile = new Map(components.map((c) => [c.file, c]));
  const entryExports = readEntryExports();

  const clash = components.filter((c) => RESERVED.includes(c.name) || c.name.endsWith("-demo"));
  if (clash.length) throw new Error(`Component names clash with reserved registry item names: ${clash.map((c) => c.name).join(", ")}`);

  const items: RegistryItem[] = [];
  const problems: string[] = [];
  const skipped = new Set<string>();
  for (const c of components) {
    const built = componentItem(c, byFile, entryExports);
    if (built.problems.length) {
      problems.push(...built.problems);
      skipped.add(c.name);
      continue;
    }
    items.push(built.item);
  }
  if (problems.length) {
    const unique = [...new Set(problems)];
    console.error(`\nregistry: ${unique.length} import problem(s) in ${skipped.size} component(s):\n\n${unique.map((p) => `  - ${p}`).join("\n")}\n`);
    if (!process.env.REGISTRY_SKIP_INVALID) {
      console.error("Nothing was written. Set REGISTRY_SKIP_INVALID=1 to build the registry without these components.\n");
      process.exit(1);
    }
    // Anything that depends on a skipped component cannot be installed either.
    let grew = true;
    while (grew) {
      grew = false;
      for (const item of [...items]) {
        if (item.registryDependencies?.some((d) => skipped.has(d.slice(NAMESPACE.length + 1)))) {
          skipped.add(item.name);
          items.splice(items.indexOf(item), 1);
          grew = true;
        }
      }
    }
    console.error(`Skipped: ${[...skipped].join(", ")}\n`);
  }
  for (const c of components) {
    if (skipped.has(c.name)) continue;
    const demo = demoItem(c, byName);
    if (demo.registryDependencies!.some((d) => skipped.has(d.slice(NAMESPACE.length + 1)))) continue;
    items.push(demo);
  }
  items.push(await themeItem(), insightItem(), ...skillItems());

  const strip = (item: RegistryItem): RegistryItem => ({ ...item, ...(item.files ? { files: item.files.map(({ content: _content, ...file }) => file) } : null) });
  const catalog = { $schema: REGISTRY_SCHEMA, name: "insightcharts", homepage: SITE_URL, items: items.map(strip) };
  const builtItems = items.map((item) => ({ $schema: ITEM_SCHEMA, ...item }));

  const store = await loadSchemas();
  const invalid: string[] = [];
  if (store) {
    invalid.push(...validate(catalog, store[REGISTRY_SCHEMA], store).map((e) => `registry.json ${e}`));
    for (const item of builtItems) invalid.push(...validate(item, store[ITEM_SCHEMA], store).map((e) => `${item.name}.json ${e}`));
  }
  for (const item of builtItems) invalid.push(...structuralProblems(item, true));
  if (new Set(items.map((i) => i.name)).size !== items.length) invalid.push("duplicate item names");
  const names = new Set(items.map((i) => i.name));
  for (const item of items) for (const dep of item.registryDependencies ?? []) if (!names.has(dep.slice(NAMESPACE.length + 1))) invalid.push(`${item.name}: registryDependency ${dep} is not an item in this registry`);
  if (invalid.length) {
    console.error(`registry: output failed validation:\n${invalid.map((p) => `  - ${p}`).join("\n")}`);
    process.exit(1);
  }

  const out = new Output();
  const rDir = join(PUBLIC, "r");
  out.own(rDir);
  out.own(join(ROOT, GENERATED_SRC));
  for (const item of builtItems) out.json(join(rDir, `${item.name}.json`), item);
  out.json(join(rDir, "registry.json"), catalog);
  out.json(join(ROOT, "registry.json"), catalog);
  // The rewritten sources, so the root registry.json resolves when the repo itself is the registry.
  for (const item of items) for (const f of item.files ?? []) if (f.path.startsWith(`${GENERATED_SRC}/`)) out.add(join(ROOT, f.path), f.content!);
  const result = out.flush();

  const n = (type: string) => items.filter((i) => i.type === type).length;
  console.log(`registry: ${items.length} items (${n("registry:component")} components, ${n("registry:block")} demos, ${n("registry:theme")} theme, ${n("registry:file")} files) -> ${relative(ROOT, rDir)}/`);
  console.log(`registry: ${result.written} written, ${result.unchanged} unchanged, ${result.removed} removed; site ${SITE_URL}`);
  console.log(store ? "registry: validated against the shadcn registry and registry-item JSON schemas" : "registry: OFFLINE, schemas could not be fetched; validated structurally only");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
