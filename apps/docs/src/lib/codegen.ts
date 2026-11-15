import { components, getComponent } from "./catalog";

const WIDTH = 88;
const isIdent = (k: string) => /^[A-Za-z_$][\w$]*$/.test(k);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const pad = (n: number) => "  ".repeat(n);

/** A nested `{ type: "<component>" }` object is a slot spec; `{ type: "line" }` (an annotation) is not. */
const isNestedSpec = (v: unknown): v is Record<string, unknown> & { type: string } => isObj(v) && typeof v.type === "string" && !!getComponent(v.type);

/** Pretty-print a value as a JS literal (or strict JSON), keeping short structures on one line. */
function literal(value: unknown, depth: number, json: boolean): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  const key = (k: string) => (json || !isIdent(k) ? JSON.stringify(k) : k);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    const parts = value.map((v) => literal(v, depth + 1, json));
    const flat = `[${parts.join(", ")}]`;
    if (!flat.includes("\n") && flat.length + depth * 2 <= WIDTH && !value.some(isObj)) return flat;
    return `[\n${parts.map((p) => pad(depth + 1) + p).join(",\n")}${json ? "" : ","}\n${pad(depth)}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
  if (!entries.length) return "{}";
  const parts = entries.map(([k, v]) => `${key(k)}: ${literal(v, depth + 1, json)}`);
  const flat = `{ ${parts.join(", ")} }`;
  if (!flat.includes("\n") && flat.length + depth * 2 <= WIDTH) return flat;
  return `{\n${parts.map((p) => pad(depth + 1) + p).join(",\n")}${json ? "" : ","}\n${pad(depth)}}`;
}

/** The spec as JSON for `<Insight spec={...} />`, with rows kept one per line. */
export function specToJson(spec: Record<string, unknown>): string {
  return literal(spec, 0, true);
}

const componentName = (type: string) => getComponent(type)?.component ?? type;

/** True when any prop holds a `{ type: "<component>" }` spec, at any depth. */
export function hasNestedSpec(value: unknown, top = true): boolean {
  if (Array.isArray(value)) return value.some((v) => hasNestedSpec(v, false));
  if (!isObj(value)) return false;
  if (!top && isNestedSpec(value)) return true;
  return Object.entries(value).some(([k, v]) => !(top && k === "type") && hasNestedSpec(v, false));
}

function element(spec: Record<string, unknown> & { type: string }, depth: number, hoisted?: Map<string, string>): string {
  const { type, ...props } = spec;
  const tag = componentName(type);
  const attrs = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (hoisted?.has(k)) return `${k}={${hoisted.get(k)}}`;
      if (v === true) return k;
      if (typeof v === "string" && !/["\n\\{}]/.test(v)) return `${k}="${v}"`;
      return `${k}={${literal(v, depth + 1, false)}}`;
    });
  if (!attrs.length) return `<${tag} />`;
  const flat = `<${tag} ${attrs.join(" ")} />`;
  if (!flat.includes("\n") && flat.length + depth * 2 <= WIDTH) return flat;
  return `<${tag}\n${attrs.map((a) => pad(depth + 1) + a).join("\n")}\n${pad(depth)}/>`;
}

/**
 * Turn a spec (`{ type, ...props }`) into the JSX a person would write: the outer component
 * as an element with a named import, inline rows hoisted into a `data` constant.
 *
 * Nested slot specs stay as `{ type: ... }` objects. That is always correct, where turning
 * them into elements is not: several components merge props into a nested spec before
 * rendering it (chart-tabs, scrolly-chart, small-multiple-grid), which only
 * works on a plain object. Specs resolve by name, so the code calls `registerAll()` first.
 */
export function specToJsx(spec: Record<string, unknown>): string {
  const type = String(spec.type);
  const nested = hasNestedSpec(spec);
  const names = [componentName(type), ...(nested ? ["registerAll"] : [])];
  const hoisted = new Map<string, string>();
  const consts: string[] = [];
  if (Array.isArray(spec.data) && spec.data.length > 1) {
    hoisted.set("data", "data");
    consts.push(`const data = ${literal(spec.data, 0, false)};`);
  }
  const body = element(spec as Record<string, unknown> & { type: string }, 2, hoisted);
  const register = nested ? ["// The slot props below are JSON specs. This makes their `type` names resolvable.", "registerAll();", ""] : [];
  return [`import { ${names.join(", ")} } from "insightcharts";`, "", ...register, ...(consts.length ? [...consts, ""] : []), "export function Example() {", "  return (", `    ${body}`, "  );", "}"].join("\n");
}

/** Usage through the JSON renderer, shown under the JSON tab. */
export const insightUsage = `import { Insight } from "insightcharts";\n\n<Insight spec={spec} />`;

export const allComponentNames = () => components.map((c) => c.name);
