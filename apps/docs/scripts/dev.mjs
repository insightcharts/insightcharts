// `pnpm dev`: next dev on :3100, plus a watcher that regenerates the catalogue whenever a
// component file is added, removed or edited in the library.
import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "..");
const src = join(here, "../../../packages/insightcharts/src");
const bin = (name) => join(app, "node_modules/.bin", name);

let running = false;
let again = false;
function generate() {
  if (running) return void (again = true);
  running = true;
  spawn(bin("tsx"), [join(here, "generate.ts")], { cwd: app, stdio: "inherit" }).on("exit", () => {
    running = false;
    if (again) {
      again = false;
      generate();
    }
  });
}

let timer;
for (const dir of ["atoms", "molecules", "templates"]) {
  const path = join(src, dir);
  if (!existsSync(path)) continue;
  watch(path, (_event, file) => {
    if (!file || !file.endsWith(".tsx")) return;
    clearTimeout(timer);
    timer = setTimeout(generate, 400);
  });
}

const next = spawn(bin("next"), ["dev", "--port", "3100", ...process.argv.slice(2)], { cwd: app, stdio: "inherit" });
const stop = () => next.kill("SIGTERM");
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => process.exit(code ?? 0));
