import { Info, TriangleAlert } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ComponentCard } from "@/components/catalog/component-card";
import { ComponentPreview } from "@/components/catalog/component-preview";
import { InstallTabs } from "@/components/catalog/install";
import { Heading } from "@/components/site/heading";
import { builtFrom, byLevel, components, getComponent, hrefOf, infographics, isPoster, pageTemplates, posterPrimitives, type CatalogEntry } from "@/lib/catalog";
import { site } from "@/lib/site";
import { BareDemo, Demo, DemoSource } from "./demo";
import { IconCount, IconGallery } from "./icon-gallery";
import { PosterThemes } from "./poster-themes";
import { Pre } from "./pre";
import { ThemePresets } from "./theme-presets";

function A({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") && !/^\/(llms|r|schema)/.test(href)) return <Link href={href}>{children}</Link>;
  const external = /^https?:/.test(href);
  return (
    <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

function Callout({ type = "note", title, children }: { type?: "note" | "warning"; title?: string; children: ReactNode }) {
  const Icon = type === "warning" ? TriangleAlert : Info;
  return (
    <aside className="not-prose my-6 flex gap-3 rounded-lg border bg-muted/30 px-4 py-3.5 text-sm leading-6">
      <Icon className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 text-foreground/90 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.86em]">
        {title ? <p className="font-medium text-foreground">{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}

/** Live example from a JSON spec, with generated JSX and the spec itself under tabs. */
function Spec({ spec, maxHeight }: { spec: Record<string, unknown>; maxHeight?: number }) {
  const entry = getComponent(String(spec.type));
  return (
    <div className="not-prose my-6">
      <ComponentPreview spec={spec} maxHeight={maxHeight ?? (entry?.level === "template" || (entry && isPoster(entry)) ? 640 : undefined)} />
    </div>
  );
}

/** A level's components. Templates are the report-style ones unless the infographics are asked for. */
const scoped = (level: "atom" | "molecule" | "template", set?: "infographic"): CatalogEntry[] => (set === "infographic" ? infographics() : level === "template" ? pageTemplates() : byLevel(level));

// One line per poster primitive: the data job it does. A primitive added to the library shows
// with the first sentence of its description until it is given a line here.
const USE_FOR: Record<string, string> = {
  "unit-blocks": "Large counts in 2 to 12 groups, drawn as blocks of one icon per fixed number of units.",
  "icon-array-grid": "Counts of up to about 150 in 4 to 24 categories, as one tile of icons per category.",
  "proportional-area": "Two to eight quantities that differ by 2 to 100 times, as squares or circles sized by area.",
  "stat-circles": "Two to six related magnitudes, as circles sized by area with the number set large.",
  "circle-pack": "5 to about 60 parts of very different sizes, as packed circles with one level of grouping.",
  "nested-shares": "The share of one whole at 2 to 8 dates or in 2 to 8 categories, as outlines nested in a square.",
  "shape-fill": "One to six percentages, each as an icon silhouette filled to its level.",
  "block-bar": "A short series or ranking of 3 to 12 values, as thick bars with the value printed inside.",
  "pill-rank": "A ranking of 4 to about 20 named things, as centred rounded bars with name, value and rank.",
  "curve-rank": "Two measures of the same 4 to about 15 entities, as one curve per entity between two scales.",
  "ribbon-chart": "4 to 8 entities over 4 to 10 periods, as bands whose thickness is the value and whose position is the rank.",
  "scale-ladder": "4 to about 20 things on one shared scale such as depth, height, temperature or age.",
  "bubble-scale": "5 to about 40 things with a position on one scale and a magnitude shown as area.",
  "radial-spokes": "4 to 12 attributes of one subject, as spokes round a centre disc.",
  "orbit-chart": "6 to about 40 named things grouped by level or period, as dots on rings round one centre.",
  "fan-flow": "One total split among 4 to about 14 destinations, or collected from that many origins.",
  "arc-diagram": "Connections among up to about 20 entities that have a meaningful order.",
  "bubble-network": "Which of up to about 12 named things are connected, with each sized by value.",
  "glyph-table": "3 to about 12 entities across 2 to 5 measures with different units, as a table of small graphics.",
};

const firstSentence = (text: string) => (text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text).trim();

/** Every poster primitive in the catalogue with the data job it does. */
function PosterPrimitives() {
  return (
    <div className="not-prose scroll-quiet my-6 overflow-x-auto rounded-xl border">
      <table className="docs-table">
        <thead>
          <tr>
            <th>type</th>
            <th>Use it for</th>
            <th>Used in</th>
          </tr>
        </thead>
        <tbody>
          {posterPrimitives().map((c) => (
            <tr key={c.name}>
              <td>
                <Link href={hrefOf(c)} className="font-mono text-[12px] font-medium underline decoration-border underline-offset-4 hover:decoration-foreground">
                  {c.name}
                </Link>
              </td>
              <td>{USE_FOR[c.name] ?? firstSentence(c.description)}</td>
              <td className="text-muted-foreground">
                {infographics()
                  .filter((t) => t.composes?.includes(c.name))
                  .map((t) => t.title)
                  .join(", ") || "none yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A component's own catalogue example, live, with its Code and JSON tabs. */
function Example({ name, maxHeight }: { name: string; maxHeight?: number }) {
  const entry = getComponent(name);
  if (!entry?.example) return null;
  return (
    <div className="not-prose my-6">
      <ComponentPreview spec={entry.example} maxHeight={maxHeight ?? (entry.level === "template" ? 640 : undefined)} lazy />
    </div>
  );
}

/** Components that take an icon: any with a prop named `icon`, `icons` or `iconField`. */
function IconUsers() {
  const users = components.filter((c) => c.props.some((p) => /^(icon|icons|iconField)$/.test(p.name)));
  return (
    <p>
      {users.map((c, i) => (
        <span key={c.name}>
          {i ? ", " : ""}
          <Link href={hrefOf(c)}>{c.title.toLowerCase()}</Link>
        </span>
      ))}
      .
    </p>
  );
}

/** Counts read from the catalogue, for prose. */
function Count({ of }: { of: "infographics" | "poster-primitives" | "templates" | "page-templates" | "atoms" | "molecules" }) {
  const n = of === "infographics" ? infographics().length : of === "poster-primitives" ? posterPrimitives().length : of === "page-templates" ? pageTemplates().length : byLevel(of === "atoms" ? "atom" : of === "molecules" ? "molecule" : "template").length;
  return <>{n}</>;
}

/** The props shared by every component at a level (present on all of them), read from the catalogue. */
function SharedProps({ level, set, skip = [] }: { level: "atom" | "molecule" | "template"; /** For templates: the report-style ones (default) or the infographics. */ set?: "infographic"; skip?: string[] }) {
  const all = scoped(level, set);
  const first = all[0]?.props ?? [];
  const shared = first.filter((p) => !skip.includes(p.name) && all.filter((c) => c.props.some((q) => q.name === p.name)).length >= all.length - 2);
  return (
    <div className="not-prose scroll-quiet my-6 overflow-x-auto rounded-xl border">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {shared.map((p) => (
            <tr key={p.name}>
              <td>
                <code>{p.name}</code>
              </td>
              <td>{p.description.replace(/`/g, "")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Every component of a level as a table: name, what it is, when to use it. */
function LevelTable({ level, set }: { level: "atom" | "molecule" | "template"; set?: "infographic" }) {
  return (
    <div className="not-prose scroll-quiet my-6 overflow-x-auto rounded-xl border">
      <table className="docs-table">
        <thead>
          <tr>
            <th>type</th>
            <th>What it is</th>
            <th>Built from</th>
          </tr>
        </thead>
        <tbody>
          {scoped(level, set).map((c) => (
            <tr key={c.name}>
              <td>
                <Link href={hrefOf(c)} className="font-mono text-[12px] font-medium underline decoration-border underline-offset-4 hover:decoration-foreground">
                  {c.name}
                </Link>
              </td>
              <td>{c.description.replace(/`/g, "")}</td>
              <td className="text-muted-foreground">
                {builtFrom(c)
                  .filter((x) => x.level !== "atom" || level === "molecule" || set === "infographic")
                  .map((x) => x.title)
                  .join(", ") || "atoms only"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Cards for named components, skipping any that do not exist (yet). */
function Components({ names }: { names: string[] }) {
  const entries = names.map(getComponent).filter((c) => !!c);
  if (!entries.length) return null;
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 md:grid-cols-3">
      {entries.map((c) => (
        <ComponentCard key={c.name} entry={c} size="sm" showLevel />
      ))}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  a: A,
  pre: Pre as MDXComponents["pre"],
  h2: ({ id, children }) => <Heading id={id ?? ""}>{children}</Heading>,
  h3: ({ id, children }) => (
    <Heading as="h3" id={id ?? ""}>
      {children}
    </Heading>
  ),
  table: (props) => (
    <div className="not-prose scroll-quiet my-6 overflow-x-auto rounded-xl border">
      <table {...props} className="docs-table" />
    </div>
  ),
  Callout,
  ThemePresets,
  PosterThemes,
  PosterPrimitives,
  IconGallery,
  IconCount,
  IconUsers,
  Example,
  Count,
  Spec,
  SharedProps,
  LevelTable,
  Components,
  Demo: (props: ComponentProps<typeof Demo>) => (
    <div className="my-6">
      <Demo {...props} />
    </div>
  ),
  // No overflow clipping here: a sticky graphic needs the page as its scroll container.
  StickyDemo: ({ name, props }: { name: string; props?: Record<string, unknown> }) => (
    <div className="not-prose my-6">
      <BareDemo name={name} props={props} />
    </div>
  ),
  DemoSource: ({ name }: { name: string }) => (
    <div className="not-prose my-5">
      <DemoSource name={name} />
    </div>
  ),
  Install: (props: ComponentProps<typeof InstallTabs>) => (
    <div className="my-5">
      <InstallTabs {...props} />
    </div>
  ),
  SiteUrl: () => <>{site.url}</>,
};
