// Writes packages/insightcharts/manifest.json: the machine-readable catalogue of every
// component (name, level, props, example, what it composes). The docs site, llms.txt,
// the shadcn registry and the agent skill are all generated from it. Run: pnpm manifest
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as atoms from "../packages/insightcharts/src/atoms";
import * as molecules from "../packages/insightcharts/src/molecules";
import * as templates from "../packages/insightcharts/src/templates";
import type { ComponentMeta } from "../packages/insightcharts/src/core/define";

const out = fileURLToPath(new URL("../packages/insightcharts/manifest.json", import.meta.url));
const components: ComponentMeta[] = [];
for (const mod of [atoms, molecules, templates] as Record<string, unknown>[]) {
  for (const value of Object.values(mod)) {
    const meta = (value as { meta?: ComponentMeta } | null)?.meta;
    if (meta?.name) components.push(meta);
  }
}
const order = { atom: 0, molecule: 1, template: 2 };
components.sort((a, b) => order[a.level] - order[b.level] || a.name.localeCompare(b.name));

const names = new Set(components.map((c) => c.name));
const problems: string[] = [];
for (const c of components) {
  for (const dep of c.composes ?? []) if (!names.has(dep)) problems.push(`${c.name} composes unknown "${dep}"`);
  if (!c.example) problems.push(`${c.name} has no example`);
  else if (c.example.type !== c.name) problems.push(`${c.name} example.type is "${String(c.example.type)}"`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
writeFileSync(out, JSON.stringify({ name: "insightcharts", generated: true, components }, null, 2) + "\n");
console.log(`manifest: ${components.length} components (${components.filter((c) => c.level === "atom").length} atoms, ${components.filter((c) => c.level === "molecule").length} molecules, ${components.filter((c) => c.level === "template").length} templates)`);
