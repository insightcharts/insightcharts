import { Check, ChevronDown, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentPreview } from "@/components/catalog/component-preview";
import { InstallTabs } from "@/components/catalog/install";
import { PageActions } from "@/components/catalog/page-actions";
import { InlineMd, PropsTable } from "@/components/catalog/props-table";
import { CodeBlock } from "@/components/site/code-block";
import { DocsPage } from "@/components/site/docs-shell";
import { Heading } from "@/components/site/heading";
import { Pager } from "@/components/site/pager";
import type { TocItem } from "@/components/site/toc";
import { Composition, compositionToc } from "@/components/catalog/composition";
import { byLevel, categoryTitle, commonProps, components, getComponent, hrefOf, infographics, INFOGRAPHICS, isInfographic, isPoster, levelBySlug, levelInfo, LEVELS, neighbours, sectionOf, type CatalogEntry } from "@/lib/catalog";
import { abs, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamicParams = false;
export const generateStaticParams = () => components.map((c) => ({ level: levelInfo(c.level).slug, name: c.name }));

type Params = Promise<{ level: string; name: string }>;

async function resolve(params: Params): Promise<CatalogEntry | undefined> {
  const { level, name } = await params;
  const entry = getComponent(name);
  return entry && levelBySlug(level)?.level === entry.level ? entry : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = await resolve(params);
  if (!c) return {};
  const title = `${c.title} (${sectionOf(c).singular.toLowerCase()})`;
  return { title, description: c.description, alternates: { canonical: hrefOf(c), types: { "text/markdown": `/llms/${c.name}.md` } }, openGraph: { title: `${c.title} - InsightCharts`, description: c.description, url: hrefOf(c), type: "article" } };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Where this component sits in atom -> molecule -> template, with how many links run each way. */
function Ladder({ entry }: { entry: CatalogEntry }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[13px]" aria-label="Composition levels">
      {LEVELS.map((l, i) => {
        const current = l.level === entry.level;
        return (
          <li key={l.level} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span aria-hidden className="text-muted-foreground/50">
                →
              </span>
            ) : null}
            <Link href={`/${l.slug}`} aria-current={current ? "true" : undefined} className={cn("inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 transition-colors hover:border-foreground/30", current ? "border-foreground bg-foreground font-medium text-background" : "text-muted-foreground hover:text-foreground")}>
              {l.title}
              <span className={cn("tabular-nums", current ? "text-background/70" : "text-muted-foreground/70")}>{byLevel(l.level).length}</span>
            </Link>
          </li>
        );
      })}
      {isInfographic(entry) ? (
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="text-muted-foreground/50">
            /
          </span>
          <Link href={`/${INFOGRAPHICS.slug}`} className="inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
            {INFOGRAPHICS.title}
            <span className="tabular-nums text-muted-foreground/70">{infographics().length}</span>
          </Link>
        </li>
      ) : null}
    </ol>
  );
}

export default async function ComponentPage({ params }: { params: Params }) {
  const c = await resolve(params);
  if (!c) notFound();
  const section = sectionOf(c);
  const infographic = isInfographic(c);
  const poster = isPoster(c);
  // Whole pages and posters are taller than a screen, so their preview scrolls inside its frame.
  const tall = c.level === "template" || poster;
  const frameHeight = poster ? 880 : 760;
  const { previous, next } = neighbours(c);
  const importLine = `import { ${c.component} } from "insightcharts";`;

  const toc: TocItem[] = [
    { id: "preview", title: "Preview", depth: 2 },
    { id: "composition", title: "Composition", depth: 2 },
    ...compositionToc(c),
    { id: "installation", title: "Installation", depth: 2 },
    ...(c.examples.length ? [{ id: "examples", title: "Examples", depth: 2 }, ...c.examples.map((e) => ({ id: `example-${slug(e.title)}`, title: e.title, depth: 3 }))] : []),
    { id: "props", title: "Props", depth: 2 },
  ];

  return (
    <DocsPage wide toc={toc}>
      <header>
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          {infographic ? (
            <>
              <Link href="/templates" className="transition-colors hover:text-foreground">
                Templates
              </Link>
              <span aria-hidden>/</span>
              <Link href={section.href} className="transition-colors hover:text-foreground">
                {section.title}
              </Link>
            </>
          ) : (
            <>
              <Link href={section.href} className="transition-colors hover:text-foreground">
                {section.title}
              </Link>
              <span aria-hidden>/</span>
              <Link href={`${section.href}#${c.category}`} className="transition-colors hover:text-foreground">
                {categoryTitle(c.category, c.level)}
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
          <PageActions markdownHref={`/llms/${c.name}.md`} markdownUrl={abs(`/llms/${c.name}.md`)} title={c.title} />
        </div>
        <p className="mt-3 max-w-[66ch] text-[17px] leading-7 text-muted-foreground text-pretty">{c.description}</p>
      </header>

      {c.whenToUse || c.avoid ? (
        <dl className="mt-7 grid overflow-hidden rounded-xl border text-sm sm:grid-cols-2">
          {c.whenToUse ? (
            <div className="p-4 sm:p-5">
              <dt className="mb-1.5 flex items-center gap-2 font-medium">
                <Check className="size-3.5" aria-hidden /> Use when
              </dt>
              <dd className="leading-6 text-muted-foreground text-pretty">
                <RichText text={c.whenToUse} />
              </dd>
            </div>
          ) : null}
          {c.avoid ? (
            <div className={cn("p-4 sm:p-5", c.whenToUse && "border-t sm:border-l sm:border-t-0")}>
              <dt className="mb-1.5 flex items-center gap-2 font-medium">
                <X className="size-3.5" aria-hidden /> Avoid when
              </dt>
              <dd className="leading-6 text-muted-foreground text-pretty">
                <RichText text={c.avoid} />
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <section aria-labelledby="preview">
        <Heading id="preview" className="mt-10">
          Preview
        </Heading>
        {poster ? (
          <p className="-mt-1 mb-4 max-w-[66ch] text-sm leading-6 text-muted-foreground">
            The preview scrolls inside its frame. A poster has the same colours in the site&apos;s light and dark modes. The toolbar has the poster themes and a PNG download.{" "}
            {c.level === "template" ? (
              <>
                Expand it to see it in place, or{" "}
                <Link href={`${hrefOf(c)}/preview`} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                  open it full screen
                </Link>
                .
              </>
            ) : null}
          </p>
        ) : c.level === "template" ? (
          <p className="-mt-1 mb-4 max-w-[66ch] text-sm leading-6 text-muted-foreground">
            A template is a whole page, so the preview scrolls inside its frame. Expand it to read it in place, or{" "}
            <Link href={`${hrefOf(c)}/preview`} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
              open it full screen
            </Link>
            .
          </p>
        ) : null}
        {c.example ? <ComponentPreview spec={c.example} {...(tall ? { maxHeight: frameHeight } : null)} {...(c.level === "template" ? { fullHref: `${hrefOf(c)}/preview` } : null)} /> : <p className="text-sm text-muted-foreground">This component has no example in its metadata yet.</p>}
      </section>

      <section aria-labelledby="composition">
        <Heading id="composition">Composition</Heading>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Ladder entry={c} />
        </div>
        <Composition entry={c} />
      </section>

      <section aria-labelledby="installation">
        <Heading id="installation">Installation</Heading>
        <InstallTabs item={`${site.registryNamespace}/${c.name}`} />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The CLI copies the source into your project and needs the <code className="font-mono text-[12.5px] text-foreground">{site.registryNamespace}</code> registry in <code className="font-mono text-[12.5px] text-foreground">components.json</code>; see{" "}
          <Link href="/docs/installation" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            installation
          </Link>
          . With the package, import it by name:
        </p>
        <CodeBlock code={importLine} lang="tsx" className="mt-3" />
      </section>

      {c.examples.length ? (
        <section aria-labelledby="examples">
          <Heading id="examples">Examples</Heading>
          {c.examples.map((ex) => (
            <div key={ex.title} className="mt-10 first:mt-0">
              <Heading as="h3" id={`example-${slug(ex.title)}`} className="first:mt-0">
                {ex.title}
              </Heading>
              <ComponentPreview spec={{ type: c.name, ...ex.props }} example={ex.title} lazy={poster} {...(tall ? { maxHeight: frameHeight } : null)} />
            </div>
          ))}
        </section>
      ) : null}

      <section aria-labelledby="props">
        <Heading id="props">Props</Heading>
        <PropsTable props={c.props} />
        {c.chart ? (
          <details className="group mt-4 rounded-xl border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
              <span>
                Common chart props <span className="ml-1 font-normal tabular-nums text-muted-foreground">{commonProps.length}</span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t p-3">
              <p className="mb-3 px-1 text-[13px] leading-5 text-muted-foreground">Every chart built with defineChart accepts these on top of its own props.</p>
              <PropsTable props={commonProps} />
            </div>
          </details>
        ) : null}
      </section>

      <Pager previous={previous ? { title: previous.title, href: hrefOf(previous), label: sectionOf(previous).singular } : undefined} next={next ? { title: next.title, href: hrefOf(next), label: sectionOf(next).singular } : undefined} />
    </DocsPage>
  );
}

const proseLink = "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground";

/**
 * Guidance text names other components, as `report-page` or bare (use line-chart). Both
 * become links. Bare names link only when hyphenated: "section", "delta" and "prose" are
 * also ordinary words.
 */
function RichText({ text }: { text: string }) {
  const hyphenated = components.map((x) => x.name).filter((n) => n.includes("-")).sort((a, b) => b.length - a.length);
  const bare = hyphenated.length ? new RegExp(`(?<![\\w-])(${hyphenated.join("|")})(?![\\w-])`, "g") : null;
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          const hit = getComponent(part.slice(1, -1));
          return hit ? (
            <Link key={i} href={hrefOf(hit)} className={proseLink}>
              {hit.title.toLowerCase()}
            </Link>
          ) : (
            <InlineMd key={i} text={part} />
          );
        }
        if (!bare) return part;
        return part.split(bare).map((piece, j) => {
          const hit = j % 2 === 1 ? getComponent(piece) : undefined;
          return hit ? (
            <Link key={`${i}-${j}`} href={hrefOf(hit)} className={proseLink}>
              {hit.title.toLowerCase()}
            </Link>
          ) : (
            piece
          );
        });
      })}
    </>
  );
}
