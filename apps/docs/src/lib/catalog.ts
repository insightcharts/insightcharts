import generated from "@/generated/catalog.json";

export type Level = "atom" | "molecule" | "template";

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
}

export interface CatalogEntry {
  name: string;
  component: string;
  title: string;
  level: Level;
  category: string;
  description: string;
  whenToUse?: string;
  avoid?: string;
  props: PropDoc[];
  composes?: string[];
  example?: Record<string, unknown>;
  file: string;
  chart: boolean;
  live: boolean;
  examples: { title: string; props: Record<string, unknown> }[];
}

const data = generated as unknown as { components: CatalogEntry[]; commonProps: PropDoc[] };

export const components = data.components;

// A few common props carry no JSDoc in the source; describe them here rather than leave gaps.
const COMMON_FALLBACK: Record<string, string> = {
  theme: "A theme, or a partial set of tokens merged over the surrounding theme, for this chart only.",
  animate: "Set false to disable animation. Reduced-motion preferences are always respected.",
  lazy: "Mount the chart only when it scrolls near the viewport. Default true.",
  onEvents: "ECharts event handlers, e.g. `{ click: (params, chart) => {} }`. Prefix a name with `zr:` to bind to the canvas itself.",
  onReady: "Called with the ECharts instance once it is created.",
  className: "Class name for the outer `<figure>`.",
  style: "Inline style for the outer `<figure>`.",
};

export const commonProps: PropDoc[] = data.commonProps.map((p) => ({ ...p, description: p.description || COMMON_FALLBACK[p.name] || "" }));

export const LEVELS = [
  {
    level: "atom" as const,
    slug: "atoms",
    title: "Atoms",
    singular: "Atom",
    summary: "An atom is one chart form or one figure primitive: a bar chart, a big number, a pull quote. Each takes data and a title. An atom never depends on another atom.",
    short: "One chart form or one figure primitive.",
  },
  {
    level: "molecule" as const,
    slug: "molecules",
    title: "Molecules",
    singular: "Molecule",
    summary: "A molecule is a combination of atoms that is used often: a row of statistics, a chart with a callout beside it, two linked charts. Use one when you need that arrangement.",
    short: "A combination of atoms that is used often.",
  },
  {
    level: "template" as const,
    slug: "templates",
    title: "Templates",
    singular: "Template",
    summary: "A template is a complete page built from molecules and atoms: a one-page executive brief, a scroll-driven essay. It takes all of its content as props, so a whole page can be written as JSON.",
    short: "A complete page built from molecules and atoms.",
  },
];

export type LevelInfo = (typeof LEVELS)[number];

export const levelBySlug = (slug: string) => LEVELS.find((l) => l.slug === slug);
export const levelInfo = (level: Level) => LEVELS.find((l) => l.level === level)!;
export const byLevel = (level: Level) => components.filter((c) => c.level === level);
export const getComponent = (name: string) => components.find((c) => c.name === name);
export const hrefOf = (c: Pick<CatalogEntry, "level" | "name">) => `/${levelInfo(c.level).slug}/${c.name}`;

// The order categories are presented in. Unknown categories follow, alphabetically.
const CATEGORY_ORDER = ["comparison", "trend", "distribution", "part-to-whole", "relationship", "flow", "geo", "poster", "figure", "text", "layout", "story", "infographic"];

/** The category of the Infographics set: templates that compose one designed poster. */
export const INFOGRAPHIC = "infographic";
/** The category of the poster primitives (atoms) and of the poster frame (a molecule). */
export const POSTER = "poster";

export const categoryTitle = (category: string, level?: Level) => {
  const words = category.replace(/-/g, " ");
  if (category === POSTER) return level === "molecule" ? "Poster frame" : "Poster primitives";
  if (category === INFOGRAPHIC) return "Infographics";
  return category === "geo" ? "Maps" : category === "part-to-whole" ? "Part to whole" : words.charAt(0).toUpperCase() + words.slice(1);
};

/** A template of the Infographics set. Its page stays at /templates/<name>; it is listed at /infographics. */
export const isInfographic = (c: Pick<CatalogEntry, "level" | "category">) => c.level === "template" && c.category === INFOGRAPHIC;
/** An atom drawn for a poster ground. */
export const isPosterPrimitive = (c: Pick<CatalogEntry, "level" | "category">) => c.level === "atom" && c.category === POSTER;
/** A molecule that is a poster sheet: it paints its own ground and forces one theme inside. */
export const isPosterFrame = (c: Pick<CatalogEntry, "level" | "category">) => c.level === "molecule" && c.category === POSTER;
/** Renders as a whole painted poster, so previews give it the poster treatment. */
export const isPoster = (c: Pick<CatalogEntry, "level" | "category">) => isInfographic(c) || isPosterFrame(c);

export const infographics = () => components.filter(isInfographic);
export const posterPrimitives = () => components.filter(isPosterPrimitive);
/** Templates that are not infographics: the report-style page layouts. */
export const pageTemplates = () => components.filter((c) => c.level === "template" && !isInfographic(c));

export const INFOGRAPHICS = {
  slug: "infographics",
  title: "Infographics",
  singular: "Infographic",
  summary: "An infographic is a template that draws one designed poster. It has a painted background, little text and one large graphic or several graphics laid out together. Each takes its content as props, so a whole poster can be written as JSON.",
  short: "A template that draws one designed poster.",
};

/** The section a component is listed under: its level, or Infographics. Drives breadcrumbs, pager labels and search groups. */
export function sectionOf(c: Pick<CatalogEntry, "level" | "category">): { title: string; singular: string; href: string } {
  if (isInfographic(c)) return { title: INFOGRAPHICS.title, singular: INFOGRAPHICS.singular, href: `/${INFOGRAPHICS.slug}` };
  const info = levelInfo(c.level);
  return { title: info.title, singular: info.singular, href: `/${info.slug}` };
}

export function groupByCategory(list: CatalogEntry[]): { category: string; title: string; items: CatalogEntry[] }[] {
  const groups = new Map<string, CatalogEntry[]>();
  for (const c of list) groups.set(c.category, [...(groups.get(c.category) ?? []), c]);
  const rank = (c: string) => (CATEGORY_ORDER.includes(c) ? CATEGORY_ORDER.indexOf(c) : CATEGORY_ORDER.length);
  return [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b)).map(([category, items]) => ({ category, title: categoryTitle(category, items[0]?.level), items }));
}

/** What this component is built from (meta.composes), resolved. */
export const builtFrom = (c: CatalogEntry) => (c.composes ?? []).map(getComponent).filter((x): x is CatalogEntry => !!x);

/** Reverse of `composes`: every component that lists this one. */
export const usedIn = (c: CatalogEntry) => components.filter((other) => other.composes?.includes(c.name));

export interface Linked {
  entry: CatalogEntry;
  /** Components the link runs through, when it is not direct: "via Stat row". */
  via: CatalogEntry[];
  direct: boolean;
}

const sortLinked = (list: Linked[]) => list.sort((a, b) => Number(b.direct) - Number(a.direct) || a.entry.title.localeCompare(b.entry.title));

/**
 * Everything a component is built from, to the bottom of the tree: the molecules it lists,
 * and every atom it reaches, either directly or through one of those molecules.
 */
export function compositionTree(c: CatalogEntry): { molecules: { entry: CatalogEntry; atoms: CatalogEntry[] }[]; atoms: Linked[] } {
  const from = builtFrom(c);
  // A poster frame lists the atoms that suit its panels. A template built on the frame fills
  // those panels itself, so the frame's list is not part of the template.
  const molecules = from.filter((x) => x.level === "molecule").map((entry) => ({ entry, atoms: isPosterFrame(entry) && c.level === "template" ? [] : builtFrom(entry).filter((x) => x.level === "atom") }));
  const atoms = new Map<string, Linked>();
  for (const a of from.filter((x) => x.level === "atom")) atoms.set(a.name, { entry: a, via: [], direct: true });
  for (const m of molecules) {
    for (const a of m.atoms) {
      const hit = atoms.get(a.name) ?? { entry: a, via: [], direct: false };
      hit.via.push(m.entry);
      atoms.set(a.name, hit);
    }
  }
  return { molecules, atoms: sortLinked([...atoms.values()]) };
}

/**
 * Everything that uses a component, to the top of the tree: the components that list it,
 * plus templates that reach it only through a molecule.
 */
export function usedInTree(c: CatalogEntry): { molecules: CatalogEntry[]; templates: Linked[] } {
  const direct = usedIn(c);
  const molecules = direct.filter((x) => x.level === "molecule");
  const templates = new Map<string, Linked>();
  for (const t of direct.filter((x) => x.level === "template")) templates.set(t.name, { entry: t, via: [], direct: true });
  for (const m of molecules) {
    // See compositionTree: templates built on a poster frame do not inherit its panel suggestions.
    if (isPosterFrame(m)) continue;
    for (const t of usedIn(m).filter((x) => x.level === "template")) {
      const hit = templates.get(t.name) ?? { entry: t, via: [], direct: false };
      hit.via.push(m);
      templates.set(t.name, hit);
    }
  }
  return { molecules, templates: sortLinked([...templates.values()]) };
}

/** Reading order within a level: by category group, then name. Drives previous / next. */
export function orderedLevel(level: Level): CatalogEntry[] {
  return groupByCategory(byLevel(level)).flatMap((g) => g.items);
}

export function neighbours(c: CatalogEntry): { previous?: CatalogEntry; next?: CatalogEntry } {
  const all = LEVELS.flatMap((l) => orderedLevel(l.level));
  const i = all.findIndex((x) => x.name === c.name);
  return { previous: all[i - 1], next: all[i + 1] };
}

export const isComponentName = (value: unknown): value is string => typeof value === "string" && components.some((c) => c.name === value);
