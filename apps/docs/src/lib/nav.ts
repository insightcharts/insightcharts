import { byLevel, groupByCategory, hrefOf, infographics, INFOGRAPHICS, isInfographic, LEVELS } from "./catalog";
import { source } from "./source";
import { STORIES } from "./stories";

export interface NavItem {
  title: string;
  href: string;
  /** Pages under another URL that belong to this destination. */
  paths?: string[];
}

export interface NavGroup {
  title: string;
  /** Index page for the group, when it has one. */
  href?: string;
  blocks: { label?: string; items: NavItem[] }[];
  /** Shown instead of items when the group has none yet. */
  empty?: string;
}

/** The sidebar: guides from the MDX page tree, then one group per level built from the catalogue. */
export function getNav(): NavGroup[] {
  const guides: NavGroup[] = [];
  let current: NavGroup | undefined;
  for (const node of source.pageTree.children) {
    if (node.type === "separator") {
      current = { title: String(node.name ?? ""), blocks: [{ items: [] }] };
      guides.push(current);
    } else if (node.type === "page") {
      if (!current) guides.push((current = { title: "Guides", blocks: [{ items: [] }] }));
      current.blocks[0].items.push({ title: String(node.name), href: node.url });
    } else if (node.type === "folder") {
      // A folder of guides is a group of its own: "For agents".
      const items = [...(node.index ? [node.index] : []), ...node.children.filter((child) => child.type === "page")].map((page) => ({ title: String(page.name), href: page.url }));
      guides.push({ title: String(node.name), blocks: [{ items }] });
      current = undefined;
    }
  }
  const levels: NavGroup[] = LEVELS.map((l) => {
    // Infographics are templates with a group of their own, below.
    const groups = groupByCategory(byLevel(l.level).filter((c) => !isInfographic(c)));
    return {
      title: l.title,
      href: `/${l.slug}`,
      blocks: groups.map((g) => ({ label: g.title, items: g.items.map((c) => ({ title: c.title, href: hrefOf(c) })) })),
      empty: groups.length ? undefined : "Coming soon",
    };
  });
  const posters = infographics();
  const set: NavGroup = { title: INFOGRAPHICS.title, href: `/${INFOGRAPHICS.slug}`, blocks: [{ items: posters.map((c) => ({ title: c.title, href: hrefOf(c) })) }], empty: posters.length ? undefined : "Coming soon" };
  // Story entries are anchors on one page, so only the group heading can be the current page.
  const stories: NavGroup = { title: "Stories", href: "/stories", blocks: [{ items: STORIES.map((s) => ({ title: s.title, href: `/stories#${s.id}` })) }] };
  return [...guides, ...levels, set, stories];
}

/** Guide pages in reading order, for previous / next. */
export function guideOrder(): NavItem[] {
  return getNav()
    .filter((g) => !g.href)
    .flatMap((g) => g.blocks.flatMap((b) => b.items));
}

/** The "For agents" pages, a folder of the guides with a top-level entry of its own. */
export const AGENTS_HREF = "/docs/agents";
const agentPages = () => source.getPages().map((p) => p.url).filter((url) => url === AGENTS_HREF || url.startsWith(`${AGENTS_HREF}/`));

export const topNav: NavItem[] = [{ title: "Docs", href: "/docs" }, { title: "For agents", href: AGENTS_HREF, paths: agentPages() }, ...LEVELS.map((l) => ({ title: l.title, href: `/${l.slug}` })), { title: INFOGRAPHICS.title, href: `/${INFOGRAPHICS.slug}`, paths: infographics().map(hrefOf) }, { title: "Stories", href: "/stories" }];
