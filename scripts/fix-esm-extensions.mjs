// Unbundled ESM needs full file names in relative imports ("./chart" -> "./chart.js",
// "./core" -> "./core/index.js") to run in Node and in strict bundlers. TypeScript source
// omits them, so this adds them to the built files. It also marks React modules as client
// modules. Usage: node fix-esm-extensions.mjs dist
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)(["'])(\.{1,2}\/[^"']*|\.{1,2})\2/g;
let files = 0;
let rewritten = 0;
let client = 0;
const missing = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".js")) fix(path);
  }
}

function fix(path) {
  const source = readFileSync(path, "utf8");
  const out = source.replace(SPECIFIER, (match, lead, quote, spec) => {
    if (/\.(js|json|css)$/.test(spec)) return match;
    const target = resolve(dirname(path), spec);
    const next = existsSync(`${target}.js`) ? `${spec}.js` : existsSync(join(target, "index.js")) ? `${spec.replace(/\/$/, "")}/index.js` : null;
    if (!next) {
      missing.push(`${path}: ${spec}`);
      return match;
    }
    rewritten++;
    return `${lead}${quote}${next}${quote}`;
  });
  files++;
  // Modules that use React run on the client. Pure modules (formatting, colour, data,
  // themes) and barrels carry no directive, so they also work in Server Components.
  // Component files are client modules even when they never import React themselves
  // (a chart is just a defineChart call, and defineChart is client code).
  const isComponent = /[\\/](atoms|molecules|templates)[\\/](?!index\.js$)[^\\/]+\.js$/.test(path) || /components\.generated\.js$/.test(path);
  const usesReact = isComponent || /from\s*["']react(\/jsx-runtime)?["']/.test(out);
  const final = usesReact && !out.startsWith('"use client"') ? `"use client";\n${out}` : out;
  if (usesReact) client++;
  if (final !== source) writeFileSync(path, final);
}

walk(root);
if (missing.length) {
  console.error(`Unresolved relative imports:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`esm extensions: ${rewritten} imports in ${files} files; "use client" on ${client}`);
