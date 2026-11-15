import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const src = fileURLToPath(new URL("../../packages/insightcharts/src", import.meta.url));

// The gallery reads the library straight from source, so edits hot-reload without a build.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^insightcharts$/, replacement: `${src}/index.ts` },
      { find: /^insightcharts\/(core|data|story|themes)$/, replacement: `${src}/$1/index.ts` },
    ],
  },
});
