/** The scroll stories shown on /stories, on the landing page and in the Stories guide. `demo` is a key of src/demos. */
export const STORIES = [
  { demo: "story-dots", id: "dots", title: "Regroup and recolour dots", theme: "dusk", form: "Beeswarm chart", href: "/atoms/beeswarm-chart", changes: "A median line, then three rows, then a colour per row, then one row highlighted." },
  { demo: "story-line", id: "line", title: "Build up a line chart", theme: "ledger", form: "Line chart", href: "/atoms/line-chart", changes: "Three more series, then a highlight, then two annotations, then a shorter time axis." },
  { demo: "story-bars", id: "bars", title: "Re-sort and restack bars", theme: "editorial", form: "Bar chart", href: "/atoms/bar-chart", changes: "A sort, then a split into stacked series, then shares of 100%, then one series highlighted." },
  { demo: "story-treemap", id: "treemap", title: "Resize and refocus a treemap", theme: "forest", form: "Treemap", href: "/atoms/treemap", changes: "A later year's values, then one group highlighted, then one block highlighted." },
  { demo: "story-ribbon", id: "ribbon", title: "Grow a ribbon chart by period", theme: "magenta", form: "Ribbon chart", href: "/atoms/ribbon-chart", changes: "One more period at each step." },
] as const;

export type StoryInfo = (typeof STORIES)[number];
