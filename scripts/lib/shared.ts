// Shared by build-registry.ts and build-llms.ts: manifest loading, JSX generation from a
// JSON spec, a small JSON Schema validator and idempotent file output. No dependencies
// beyond Node and TypeScript.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const PKG = join(ROOT, "packages/insightcharts");
export const SRC = join(PKG, "src");
export const PUBLIC = join(ROOT, "apps/docs/public");

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
}

export interface ComponentMeta {
  name: string;
  component: string;
  title: string;
  level: "atom" | "molecule" | "template";
  category: string;
  description: string;
  whenToUse?: string;
  avoid?: string;
  props: PropDoc[];
  composes?: string[];
  example?: Record<string, unknown>;
}

export interface Component extends ComponentMeta {
  /** Absolute path of the source file. */
  file: string;
  source: string;
  /** Built with `defineChart`, so it accepts every `CommonChartProps`. */
  isChart: boolean;
}

export const levelDir = (level: ComponentMeta["level"]) => `${level}s`;

/** Read manifest.json and pair every entry with its source file. Fails with a clear message when they disagree. */
export function loadComponents(): Component[] {
  const manifestPath = join(PKG, "manifest.json");
  if (!existsSync(manifestPath)) throw new Error("packages/insightcharts/manifest.json is missing. Run `pnpm manifest` first.");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { components: ComponentMeta[] };
  const problems: string[] = [];
  const out: Component[] = [];
  for (const meta of manifest.components) {
    const base = join(SRC, levelDir(meta.level), meta.name);
    const file = [`${base}.tsx`, `${base}.ts`].find((f) => existsSync(f));
    if (!file) {
      problems.push(`${meta.name}: manifest lists it as a ${meta.level} but ${relative(ROOT, base)}.tsx does not exist. Run \`pnpm manifest\`.`);
      continue;
    }
    const source = readFileSync(file, "utf8");
    out.push({ ...meta, file, source, isChart: /\bdefineChart\s*[<(]/.test(source) });
  }
  if (problems.length) throw new Error(problems.join("\n"));
  return out;
}

// ---------------------------------------------------------------------------------------
// JSON spec -> JSX
// ---------------------------------------------------------------------------------------

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const WIDTH = 100;

export interface JsxResult {
  code: string;
  /** Names (kebab-case) of every component the JSX references, outermost first. */
  used: string[];
  /**
   * Components that appear only inside spec objects (props typed `InsightSpec`, which the
   * parent merges or patches and so must stay data). They are resolved at runtime, so the
   * caller must emit `registerComponents({ ... })` for them.
   */
  registered: string[];
}

/**
 * Turn `{ type: "bar-chart", ...props }` into `<BarChart ... />`. Nested specs (a molecule's
 * slots, a template's sections) become nested JSX, so the output never depends on the
 * runtime spec registry. Objects whose `type` is not a component (annotations, transforms)
 * stay plain objects.
 */
export function specToJsx(spec: Record<string, unknown>, byName: Map<string, ComponentMeta>, options: { indent?: number; replace?: Record<string, string> } = {}): JsxResult {
  const used: string[] = [];
  const registered: string[] = [];
  // Above zero while printing a prop that must stay a spec object.
  let raw = 0;
  const isSpec = (v: unknown): v is Record<string, unknown> => {
    const hit = typeof v === "object" && v !== null && !Array.isArray(v) && typeof (v as { type?: unknown }).type === "string" && byName.has((v as { type: string }).type);
    if (hit && raw > 0) {
      const name = (v as { type: string }).type;
      if (!registered.includes(name)) registered.push(name);
      return false;
    }
    return hit;
  };
  /** A prop documented as taking specs but not rendered content keeps its value as data. */
  const specOnly = (meta: ComponentMeta, prop: string) => {
    const doc = meta.props.find((p) => p.name === prop);
    return !!doc && /InsightSpec|Spec\b/.test(doc.type) && !/Slot|ReactNode/.test(doc.type);
  };
  const pad = (n: number) => "  ".repeat(n);

  const inline = (v: unknown): string => {
    if (isSpec(v)) return element(v, 0, true);
    if (Array.isArray(v)) return `[${v.map(inline).join(", ")}]`;
    if (v && typeof v === "object") {
      const entries = Object.entries(v);
      return entries.length ? `{ ${entries.map(([k, val]) => `${IDENT.test(k) ? k : JSON.stringify(k)}: ${inline(val)}`).join(", ")} }` : "{}";
    }
    return v === undefined ? "undefined" : JSON.stringify(v);
  };

  const value = (v: unknown, level: number): string => {
    const flat = inline(v);
    if (!flat.includes("\n") && flat.length + level * 2 <= WIDTH) return flat;
    if (isSpec(v)) return element(v, level, false);
    if (Array.isArray(v)) return `[\n${v.map((item) => `${pad(level + 1)}${value(item, level + 1)},`).join("\n")}\n${pad(level)}]`;
    if (v && typeof v === "object") {
      return `{\n${Object.entries(v)
        .map(([k, val]) => `${pad(level + 1)}${IDENT.test(k) ? k : JSON.stringify(k)}: ${value(val, level + 1)},`)
        .join("\n")}\n${pad(level)}}`;
    }
    return flat;
  };

  const attr = (name: string, v: unknown, level: number, top: boolean): string => {
    if (top && options.replace?.[name]) return `${name}={${options.replace[name]}}`;
    if (!/^[A-Za-z_$][A-Za-z0-9_$-]*$/.test(name)) return `{...{ ${JSON.stringify(name)}: ${value(v, level)} }}`;
    if (v === true) return name;
    if (typeof v === "string" && !/["&\\\n\r]/.test(v)) return `${name}="${v}"`;
    return `${name}={${value(v, level)}}`;
  };

  function element(node: Record<string, unknown>, level: number, forceInline: boolean, top = false): string {
    const { type, ...props } = node;
    const meta = byName.get(type as string)!;
    if (!used.includes(meta.name)) used.push(meta.name);
    const entries = Object.entries(props).filter(([, v]) => v !== undefined);
    const print = (k: string, v: unknown, at: number) => {
      const keep = specOnly(meta, k);
      if (keep) raw++;
      try {
        return attr(k, v, at, top);
      } finally {
        if (keep) raw--;
      }
    };
    const flat = `<${meta.component}${entries.map(([k, v]) => ` ${print(k, v, level)}`).join("")} />`;
    if (forceInline || (!flat.includes("\n") && flat.length + level * 2 <= WIDTH)) return flat;
    return `<${meta.component}\n${entries.map(([k, v]) => `${pad(level + 1)}${print(k, v, level + 1)}`).join("\n")}\n${pad(level)}/>`;
  }

  const level = options.indent ?? 0;
  return { code: element(spec, level, false, true), used, registered: registered.filter((n) => !used.includes(n)).concat(registered.filter((n) => used.includes(n))) };
}

/** A JS literal for hoisted constants (`const data = ...`), formatted like the JSX values. */
export function jsLiteral(v: unknown, level = 0): string {
  const pad = (n: number) => "  ".repeat(n);
  const inline = (x: unknown): string => {
    if (Array.isArray(x)) return `[${x.map(inline).join(", ")}]`;
    if (x && typeof x === "object") {
      const entries = Object.entries(x);
      return entries.length ? `{ ${entries.map(([k, val]) => `${IDENT.test(k) ? k : JSON.stringify(k)}: ${inline(val)}`).join(", ")} }` : "{}";
    }
    return JSON.stringify(x);
  };
  const flat = inline(v);
  if (flat.length + level * 2 <= WIDTH) return flat;
  if (Array.isArray(v)) return `[\n${v.map((item) => `${pad(level + 1)}${jsLiteral(item, level + 1)},`).join("\n")}\n${pad(level)}]`;
  if (v && typeof v === "object") {
    return `{\n${Object.entries(v)
      .map(([k, val]) => `${pad(level + 1)}${IDENT.test(k) ? k : JSON.stringify(k)}: ${jsLiteral(val, level + 1)},`)
      .join("\n")}\n${pad(level)}}`;
  }
  return flat;
}

/** JSON.stringify with short arrays and objects kept on one line, so rows read as rows. */
export function compactJson(v: unknown, level = 0): string {
  const pad = (n: number) => "  ".repeat(n);
  const flat = JSON.stringify(v, null, 1)?.replace(/\n\s*/g, " ").replace(/\[ /g, "[").replace(/ \]/g, "]") ?? "null";
  if (flat.length + level * 2 <= WIDTH || v === null || typeof v !== "object") return flat;
  if (Array.isArray(v)) return `[\n${v.map((item) => `${pad(level + 1)}${compactJson(item, level + 1)}`).join(",\n")}\n${pad(level)}]`;
  return `{\n${Object.entries(v)
    .filter(([, val]) => val !== undefined)
    .map(([k, val]) => `${pad(level + 1)}${JSON.stringify(k)}: ${compactJson(val, level + 1)}`)
    .join(",\n")}\n${pad(level)}}`;
}

/** Whether a top-level `data` prop is worth hoisting into a `const data`. */
export const hoistableData = (spec: Record<string, unknown>) => (Array.isArray(spec.data) || (typeof spec.data === "object" && spec.data !== null)) && JSON.stringify(spec.data).length > 60;

// ---------------------------------------------------------------------------------------
// A small JSON Schema (draft-07 subset) validator: enough for the shadcn registry schemas
// and for our own insight-spec schema. Supports type, enum, const, properties, required,
// additionalProperties, items, anyOf/oneOf/allOf/not, if/then/else and $ref.
// ---------------------------------------------------------------------------------------

type Schema = Record<string, any> | boolean;

export interface SchemaStore {
  /** Schemas by absolute id, for cross-file `$ref`. */
  [id: string]: Schema;
}

const typeOf = (v: unknown) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "number" && Number.isInteger(v) ? "integer" : typeof v);

export function validate(value: unknown, schema: Schema, store: SchemaStore = {}, root: Schema = schema, path = "$"): string[] {
  if (schema === true) return [];
  if (schema === false) return [`${path}: not allowed`];
  const errors: string[] = [];
  if (typeof schema.$ref === "string") {
    const ref = schema.$ref as string;
    let target: Schema | undefined;
    let nextRoot = root;
    if (ref.startsWith("#")) {
      target = ref
        .slice(1)
        .split("/")
        .filter(Boolean)
        .reduce<any>((s, key) => s?.[decodeURIComponent(key.replace(/~1/g, "/").replace(/~0/g, "~"))], root);
      if (ref === "#") target = root;
    } else {
      target = store[ref.split("#")[0]];
      if (target !== undefined) nextRoot = target;
    }
    if (target === undefined) return [`${path}: unresolved $ref ${ref}`];
    return validate(value, target, store, nextRoot, path);
  }
  const t = typeOf(value);
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((want: string) => want === t || (want === "number" && t === "integer"))) errors.push(`${path}: expected ${types.join(" | ")}, got ${t}`);
  }
  if (schema.enum && !schema.enum.some((e: unknown) => JSON.stringify(e) === JSON.stringify(value))) errors.push(`${path}: ${JSON.stringify(value)} is not one of ${JSON.stringify(schema.enum)}`);
  if ("const" in schema && JSON.stringify(schema.const) !== JSON.stringify(value)) errors.push(`${path}: expected ${JSON.stringify(schema.const)}`);
  if (typeof schema.pattern === "string" && typeof value === "string" && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: does not match ${schema.pattern}`);
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of schema.required ?? []) if (!(key in obj)) errors.push(`${path}: missing required "${key}"`);
    const props = schema.properties ?? {};
    for (const [key, val] of Object.entries(obj)) {
      if (key in props) errors.push(...validate(val, props[key], store, root, `${path}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unknown property "${key}"`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") errors.push(...validate(val, schema.additionalProperties, store, root, `${path}.${key}`));
    }
  }
  if (t === "array" && schema.items) (value as unknown[]).forEach((item, i) => errors.push(...validate(item, schema.items, store, root, `${path}[${i}]`)));
  for (const sub of schema.allOf ?? []) errors.push(...validate(value, sub, store, root, path));
  if (schema.anyOf) {
    const results = (schema.anyOf as Schema[]).map((s) => validate(value, s, store, root, path));
    if (!results.some((r) => r.length === 0)) errors.push(`${path}: matches none of anyOf (${results.map((r) => r[0]).join("; ")})`);
  }
  if (schema.oneOf) {
    const results = (schema.oneOf as Schema[]).map((s) => validate(value, s, store, root, path));
    const ok = results.filter((r) => r.length === 0).length;
    if (ok !== 1) {
      // For a discriminated union, report the branch whose `type` matched: far more useful.
      const disc = typeof (value as any)?.type === "string" ? (schema.oneOf as any[]).findIndex((s) => (typeof s?.$ref === "string" && s.$ref.startsWith("#/") ? s.$ref.slice(2).split("/").reduce((node: any, key: string) => node?.[key], root) : s)?.properties?.type?.const === (value as any).type) : -1;
      errors.push(...(ok === 0 && disc >= 0 ? results[disc] : [`${path}: matches ${ok} of oneOf, expected exactly 1${ok === 0 ? ` (${results.map((r) => r[0]).slice(0, 3).join("; ")})` : ""}`]));
    }
  }
  if (schema.not && validate(value, schema.not, store, root, path).length === 0) errors.push(`${path}: matches a schema it must not`);
  if (schema.if) {
    const branch = validate(value, schema.if, store, root, path).length === 0 ? schema.then : schema.else;
    if (branch) errors.push(...validate(value, branch, store, root, path));
  }
  return errors;
}

// ---------------------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------------------

/** Collects generated files, writes only what changed and removes stale files from the directories it owns. */
export class Output {
  private files = new Map<string, string>();
  private owned: { dir: string; keep?: (path: string) => boolean }[] = [];

  /** Declare a directory as fully generated: anything in it that is not written this run is deleted. */
  own(dir: string, keep?: (path: string) => boolean) {
    this.owned.push({ dir, keep });
  }

  add(path: string, content: string) {
    this.files.set(path, content.endsWith("\n") ? content : `${content}\n`);
  }

  json(path: string, value: unknown) {
    this.add(path, JSON.stringify(value, null, 2));
  }

  flush(): { written: number; unchanged: number; removed: number } {
    let written = 0;
    let unchanged = 0;
    let removed = 0;
    for (const [path, content] of this.files) {
      if (existsSync(path) && readFileSync(path, "utf8") === content) {
        unchanged++;
        continue;
      }
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
      written++;
    }
    const walk = (dir: string): string[] => (existsSync(dir) ? readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)])) : []);
    for (const { dir, keep } of this.owned) {
      for (const file of walk(dir)) {
        if (this.files.has(file) || keep?.(file)) continue;
        rmSync(file);
        removed++;
      }
    }
    return { written, unchanged, removed };
  }
}
