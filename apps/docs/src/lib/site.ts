/** The one place the public URL is defined. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://insightcharts.dev").replace(/\/$/, "");

export const site = {
  name: "InsightCharts",
  url: SITE_URL,
  /** The landing page's title and description, also used for metadata and the social card. */
  tagline: "An Infographics, Data Stories, and Data Journalism Chart Framework",
  description: "An open source react library built on Apache Echarts with flexible components to build any data graphic, following data journalism visualization best practices.",
  github: "https://github.com/insightcharts/insightcharts",
  npm: "https://www.npmjs.com/package/insightcharts",
  /** shadcn registry namespace and its URL template, as it goes in components.json. */
  registryNamespace: "@insightcharts",
  registryUrl: `${SITE_URL}/r/{name}.json`,
};

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
