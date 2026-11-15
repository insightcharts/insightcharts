/** The one place the public URL is defined. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://insightcharts.dev").replace(/\/$/, "");

export const site = {
  name: "InsightCharts",
  url: SITE_URL,
  description: "InsightCharts is a React library of charts, figures and page layouts built on Apache ECharts 6. Every component can be written as JSX or as a JSON spec.",
  github: "https://github.com/insightcharts/insightcharts",
  npm: "https://www.npmjs.com/package/insightcharts",
  /** shadcn registry namespace and its URL template, as it goes in components.json. */
  registryNamespace: "@insightcharts",
  registryUrl: `${SITE_URL}/r/{name}.json`,
};

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
