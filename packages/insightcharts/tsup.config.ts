import { readFile } from "node:fs/promises";
import { defineConfig } from "tsup";
import ts from "typescript";

// Components are created by top-level calls (`defineChart(...)`, `withMeta(...)`), and
// files compute example data at the top level too. Bundlers must assume such calls have
// side effects, so an app importing one chart would keep all seventy. Wrapping each
// top-level computed constant in a pure-annotated IIFE lets unused ones be dropped,
// along with the ECharts modules only they use. Evaluation order is unchanged.
const pureDefinitions = {
  name: "pure-definitions",
  setup(build: { onLoad: (opts: { filter: RegExp }, cb: (args: { path: string }) => Promise<{ contents: string; loader: "tsx" | "ts" } | undefined>) => void }) {
    build.onLoad({ filter: /src\/(atoms|molecules|templates)\/[^/]+\.tsx?$/ }, async (args) => {
      const source = await readFile(args.path, "utf8");
      const file = ts.createSourceFile(args.path, source, ts.ScriptTarget.Latest, true, args.path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const edits: [number, number][] = [];
      const impure = (node: ts.Node): boolean => ts.isCallExpression(node) || ts.isNewExpression(node) || ts.isSpreadElement(node) || ts.isSpreadAssignment(node) || ts.isTemplateExpression(node) || ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || (!ts.isFunctionLike(node) && ts.forEachChild(node, impure) === true);
      for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const decl of statement.declarationList.declarations) {
          const init = decl.initializer;
          if (!init || ts.isFunctionLike(init) || !impure(init)) continue;
          edits.push([init.getStart(file), init.getEnd()]);
        }
      }
      let contents = source;
      for (const [start, end] of edits.reverse()) contents = `${contents.slice(0, start)}/* @__PURE__ */ (() => (${contents.slice(start, end)}))()${contents.slice(end)}`;
      return { contents, loader: args.path.endsWith(".tsx") ? "tsx" : "ts" };
    });
  },
};

// One output module per source file (no bundling). With `"sideEffects": false`, every
// bundler, including Turbopack and webpack, can then leave out the components an app
// does not import; a single bundled file defeats that in several of them.
const modules = {
  format: ["esm"] as const,
  bundle: false,
  dts: false,
  sourcemap: true,
};

export default defineConfig([
  // Server-safe: pure data loading and transforms. No "use client", usable in RSC and Node.
  { ...modules, entry: ["src/data/**/*.ts"], outDir: "dist/data" },
  // Everything else: components, engine, stories, themes.
  {
    ...modules,
    entry: ["src/**/*.{ts,tsx}", "!src/data/**"],
    outDir: "dist",
    esbuildPlugins: [pureDefinitions],
    // "use client" is added per file by scripts/fix-esm-extensions.mjs, only to modules that
    // use React. Barrel files must stay directive-free: a "use client" barrel is a single
    // client boundary, so a Server Component importing one chart from it would ship them all.
  },
  // Type declarations, one bundle per public entry point.
  {
    entry: { index: "src/index.ts", core: "src/core/index.ts", data: "src/data/index.ts", story: "src/story/index.ts", themes: "src/themes/index.ts" },
    format: ["esm"] as const,
    dts: { only: true },
    outDir: "dist",
  },
]);
