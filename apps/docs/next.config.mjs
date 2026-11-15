import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const lib = "../../packages/insightcharts/src";

/**
 * The library is consumed straight from workspace source (no package build), so a new
 * component file shows up as soon as `scripts/generate.ts` has seen it.
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  agentRules: false,
  transpilePackages: ["insightcharts"],
  outputFileTracingRoot: root,
  turbopack: {
    root,
    resolveAlias: {
      insightcharts: `${lib}/index.ts`,
      "insightcharts/core": `${lib}/core/index.ts`,
      "insightcharts/data": `${lib}/data/index.ts`,
      "insightcharts/story": `${lib}/story/index.ts`,
      "insightcharts/themes": `${lib}/themes/index.ts`,
    },
  },
};

export default createMDX()(config);
