import type { Metadata } from "next";
import { byLevel, components, infographics, INFOGRAPHICS, levelInfo, LEVELS, pageTemplates, sectionOf, type CatalogEntry } from "./catalog";
import { site } from "./site";
import { source } from "./source";
import { STORIES } from "./stories";

/**
 * Social cards. Every page has one 1200 by 630 card at /og/<path>.png, drawn by
 * `src/app/og/[...path]/route.tsx` from the pictures that `scripts/og-capture.mjs` saves in
 * `public/og/shots`. This file says what is on each card and builds the page's metadata.
 */
export interface Card {
  /** The card's URL is /og/<path>.png. */
  path: string;
  /** Small text above the title: the level of a component, or what an index lists. */
  label?: string;
  title: string;
  /** Shown only on a card with no picture. */
  description?: string;
  /** Pictures in public/og/shots, without the extension. One fills the panel; four make a grid. */
  shots: string[];
}

export const OG_SIZE = { width: 1200, height: 630 };

const shotOf = (c: Pick<CatalogEntry, "level" | "name">) => `${levelInfo(c.level).slug}/${c.name}`;
const pick = (names: string[], from: CatalogEntry[]) => {
  const picked = names.map((n) => from.find((c) => c.name === n)).filter((c): c is CatalogEntry => !!c);
  for (const c of from) if (picked.length < 4 && !picked.includes(c)) picked.push(c);
  return picked.slice(0, 4).map(shotOf);
};

// The four components pictured on each index card, chosen so the four grounds differ.
const INDEX_PICKS: Record<string, string[]> = {
  atom: ["bar-chart", "sankey-chart", "circle-pack", "choropleth-map"],
  molecule: ["chart-callout", "quote-figure", "proportion-statement", "stat-row"],
  template: ["executive-brief", "scorecard", "social-card", "visual-essay"],
  infographic: ["count-poster", "flow-poster", "timeline-poster", "profile-poster"],
};

// The picture on a guide's card, for the guides about something visual. Other guides have a card with text only.
const GUIDE_SHOTS: Record<string, string[]> = {
  theming: ["pages/guide-theming"],
  "dark-mode": ["pages/guide-dark-mode"],
  crossfiltering: ["pages/guide-crossfiltering"],
  stories: ["pages/story-line"],
  templates: ["templates/executive-brief"],
  infographics: ["templates/count-poster"],
  export: ["pages/guide-export"],
  icons: ["pages/guide-icons"],
};

const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

export const homeCard = (): Card => ({ path: "home", title: site.tagline, shots: ["pages/home"] });

export const componentCard = (c: CatalogEntry): Card => ({ path: shotOf(c), label: sectionOf(c).singular, title: c.title, description: c.description, shots: [shotOf(c)] });

export function levelCard(level: CatalogEntry["level"]): Card {
  const info = levelInfo(level);
  // The templates index lists the page templates; infographics have an index of their own.
  const listed = level === "template" ? pageTemplates() : byLevel(level);
  return { path: info.slug, label: count(listed.length, "component"), title: info.title, description: info.short, shots: pick(INDEX_PICKS[level], listed) };
}

export const infographicsCard = (): Card => ({ path: INFOGRAPHICS.slug, label: count(infographics().length, "template"), title: INFOGRAPHICS.title, description: INFOGRAPHICS.short, shots: pick(INDEX_PICKS.infographic, infographics()) });

export const storiesCard = (): Card => ({ path: "stories", label: count(STORIES.length, "example"), title: "Scroll stories", shots: ["dots", "line", "treemap", "ribbon"].map((id) => `pages/story-${id}`) });

export function guideCard(page: { slugs: string[]; data: { title: string; description?: string } }): Card {
  const slug = page.slugs.join("/");
  return { path: slug ? `docs/${slug}` : "docs", label: page.slugs[0] === "agents" ? "For agents" : "Guide", title: page.data.title, description: page.data.description, shots: GUIDE_SHOTS[slug] ?? [] };
}

/** Every card the site has. The card route prerenders one image for each. */
export const allCards = (): Card[] => [homeCard(), ...LEVELS.map((l) => levelCard(l.level)), infographicsCard(), storiesCard(), ...source.getPages().map(guideCard), ...components.map(componentCard)];

export const cardUrl = (card: Card) => `/og/${card.path}.png`;

/**
 * The canonical URL, Open Graph tags and Twitter card of one page. Next replaces `openGraph`
 * and `twitter` whole when a page sets them, so each page gets the complete set from here.
 */
export function social({ path, title, description, type, card, alt }: { /** The page's path, e.g. "/atoms/bar-chart". */ path: string; title: string; description: string; type: "website" | "article"; card: Card; /** Describes the card's picture. Defaults to the title. */ alt?: string }): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const images = [{ url: cardUrl(card), ...OG_SIZE, alt: alt ?? title, type: "image/png" }];
  return {
    alternates: { canonical: path },
    openGraph: { type, siteName: site.name, locale: "en_US", url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
