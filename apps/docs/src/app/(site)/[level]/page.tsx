import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentCard } from "@/components/catalog/component-card";
import { DocsPage } from "@/components/site/docs-shell";
import { Heading } from "@/components/site/heading";
import { ArrowRight } from "lucide-react";
import { byLevel, groupByCategory, infographics, INFOGRAPHICS, isInfographic, levelBySlug, LEVELS, POSTER } from "@/lib/catalog";

// A line under a group heading, where the group needs one.
const GROUP_NOTE: Record<string, Record<string, string>> = {
  atom: { [POSTER]: "These atoms are drawn for a poster ground. They use large flat marks, print names and values on or beside the marks and have no axes by default. The infographic templates are built from them." },
  molecule: { [POSTER]: "The poster frame is the sheet every infographic is composed on." },
};

export const dynamicParams = false;
export const generateStaticParams = () => LEVELS.map((l) => ({ level: l.slug }));

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const info = levelBySlug((await params).level);
  if (!info) return {};
  return { title: info.title, description: info.summary, alternates: { canonical: `/${info.slug}` }, openGraph: { title: `${info.title} - InsightCharts`, description: info.summary, url: `/${info.slug}` } };
}

export default async function LevelIndex({ params }: { params: Promise<{ level: string }> }) {
  const info = levelBySlug((await params).level);
  if (!info) notFound();
  // Infographics are templates with an index of their own; this page links across to it.
  const groups = groupByCategory(byLevel(info.level).filter((c) => !isInfographic(c)));
  const posters = info.level === "template" ? infographics() : [];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const i = LEVELS.indexOf(info);
  return (
    <DocsPage wide toc={groups.map((g) => ({ id: g.category, title: g.title, depth: 2 }))}>
      <header>
        <p className="mb-2 text-sm text-muted-foreground">
          Level {i + 1} of 3{total ? <span className="tabular-nums"> · {total} {total === 1 ? "component" : "components"}</span> : null}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{info.title}</h1>
        <p className="mt-3 max-w-[66ch] text-[17px] leading-7 text-muted-foreground text-pretty">{info.summary}</p>
      </header>

      {total === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed px-6 py-14 text-center">
          <p className="text-sm font-medium">No {info.title.toLowerCase()} yet</p>
          <p className="mx-auto mt-1.5 max-w-[46ch] text-sm leading-6 text-muted-foreground text-pretty">
            {info.title} are being built on top of the {LEVELS[i - 1]?.title.toLowerCase() ?? "engine"}. This page fills in by itself as soon as a component file lands in <code className="font-mono text-[12.5px]">src/{info.slug}/</code>.
          </p>
          {i > 0 ? (
            <Link href={`/${LEVELS[i - 1].slug}`} className="mt-5 inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium transition-colors hover:bg-accent">
              Browse {LEVELS[i - 1].title.toLowerCase()}
            </Link>
          ) : null}
        </div>
      ) : null}

      {posters.length ? (
        <Link href={`/${INFOGRAPHICS.slug}`} className="group mt-8 flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors hover:border-foreground/25 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <span className="min-w-0">
            <span className="block text-sm font-medium">
              {INFOGRAPHICS.title} <span className="ml-1 font-normal tabular-nums text-muted-foreground">{posters.length}</span>
            </span>
            <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">
              {posters.length === 1 ? "1 more template draws a poster" : `${posters.length} more templates draw posters`}. They are listed on the Infographics page.
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      ) : null}

      {groups.map((group) => (
        <section key={group.category} aria-labelledby={group.category}>
          <Heading id={group.category} className="mt-12">
            {group.title}
            <span className="ml-2 text-sm font-normal tabular-nums text-muted-foreground">{group.items.length}</span>
          </Heading>
          {GROUP_NOTE[info.level]?.[group.category] ? <p className="-mt-1 mb-5 max-w-[66ch] text-sm leading-6 text-muted-foreground">{GROUP_NOTE[info.level][group.category]}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((entry) => (
              <ComponentCard key={entry.name} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </DocsPage>
  );
}
