import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PosterThumb } from "@/components/catalog/poster-thumb";
import { DocsPage } from "@/components/site/docs-shell";
import { Heading } from "@/components/site/heading";
import { builtFrom, getComponent, hrefOf, infographics, INFOGRAPHICS, isPosterPrimitive, pageTemplates, posterPrimitives, type CatalogEntry } from "@/lib/catalog";
import { infographicsCard, social } from "@/lib/og";
import { posterGround, posterWidth } from "@/lib/posters";

export const metadata: Metadata = {
  title: INFOGRAPHICS.title,
  description: INFOGRAPHICS.summary,
  ...social({ path: `/${INFOGRAPHICS.slug}`, title: INFOGRAPHICS.title, description: INFOGRAPHICS.summary, type: "website", card: infographicsCard(), alt: "Four of the infographic posters in the catalogue." }),
};

const link = "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground";
const chip = "inline-flex h-5 items-center rounded-full border px-1.5 text-[11px] leading-none text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const themeOf = (c: CatalogEntry) => (typeof c.example?.theme === "string" ? c.example.theme : undefined);

/** One poster: the whole sheet as a live thumbnail in its own shape, then its name and what it is built from. */
function PosterCard({ entry }: { entry: CatalogEntry }) {
  const parts = builtFrom(entry).filter(isPosterPrimitive);
  const theme = themeOf(entry);
  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25">
      <PosterThumb name={entry.name} ground={posterGround(entry.example, entry)} virtualWidth={posterWidth(entry)} />
      <div className="flex flex-1 flex-col gap-1 border-t px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-medium text-foreground">
            <Link href={hrefOf(entry)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {entry.title}
            </Link>
          </h3>
          {theme ? <span className="shrink-0 rounded-full border px-1.5 py-px font-mono text-[10.5px] leading-4 text-muted-foreground">{theme}</span> : null}
        </div>
        <p className="line-clamp-3 text-[13px] leading-5 text-muted-foreground">{entry.description.replace(/`/g, "")}</p>
        {parts.length ? (
          <div className="relative z-10 mt-auto flex flex-wrap items-center gap-1 pt-2 text-xs leading-5 text-muted-foreground">
            <span className="mr-0.5">Uses</span>
            {parts.map((x) => (
              <Link key={x.name} href={hrefOf(x)} className={chip}>
                {x.title}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function InfographicsIndex() {
  const list = infographics();
  const frame = getComponent("poster");
  const primitives = posterPrimitives().length;
  const others = pageTemplates().length;
  // Two columns filled in turn, so posters of different heights do not leave holes in rows.
  const columns = [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)];
  return (
    <DocsPage
      wide
      toc={[
        { id: "posters", title: "Posters", depth: 2 },
        { id: "building", title: "Building a poster", depth: 2 },
      ]}
    >
      <header>
        <p className="mb-2 text-sm text-muted-foreground">
          Templates<span className="tabular-nums"> · {list.length} {list.length === 1 ? "infographic" : "infographics"}</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{INFOGRAPHICS.title}</h1>
        <p className="mt-3 max-w-[66ch] text-[17px] leading-7 text-muted-foreground text-pretty">{INFOGRAPHICS.summary}</p>
        <p className="mt-3 max-w-[66ch] text-sm leading-6 text-muted-foreground">
          Every infographic is a template and its page is under <code className="font-mono text-[12.5px] text-foreground">/templates</code>.{" "}
          {others ? (
            <>
              The {others} report-style templates are listed under{" "}
              <Link href="/templates" className={link}>
                Templates
              </Link>
              .
            </>
          ) : null}
        </p>
      </header>

      <section aria-labelledby="posters">
        <Heading id="posters" className="mt-10">
          Posters
          <span className="ml-2 text-sm font-normal tabular-nums text-muted-foreground">{list.length}</span>
        </Heading>
        {list.length ? (
          <>
            <p className="-mt-1 mb-5 max-w-[66ch] text-sm leading-6 text-muted-foreground">Each card is the live poster, scaled down, in the theme its example uses.</p>
            {/* One column on a phone, in catalogue order. */}
            <div className="grid gap-5 sm:hidden">
              {list.map((entry) => (
                <PosterCard key={entry.name} entry={entry} />
              ))}
            </div>
            <div className="hidden items-start gap-5 sm:grid sm:grid-cols-2">
              {columns.map((column, i) => (
                <div key={i} className="grid min-w-0 gap-5">
                  {column.map((entry) => (
                    <PosterCard key={entry.name} entry={entry} />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-14 text-center">
            <p className="text-sm font-medium">No infographics yet</p>
            <p className="mx-auto mt-1.5 max-w-[46ch] text-sm leading-6 text-muted-foreground text-pretty">
              This page lists every template whose category is <code className="font-mono text-[12.5px]">infographic</code>.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="building">
        <Heading id="building">Building a poster</Heading>
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/docs/infographics", title: "Infographics guide", body: "How to use an infographic template from JSON and how to compose a poster from panels." },
            ...(frame ? [{ href: hrefOf(frame), title: `${frame.title} frame`, body: "The molecule every infographic is composed on. It paints the ground and lays out the panels." }] : []),
            { href: "/atoms#poster", title: `${primitives} poster primitives`, body: "The atoms drawn for a poster ground, with large flat marks and direct labels." },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block h-full rounded-xl border p-4 transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                <h3 className="flex items-center gap-1 text-sm font-medium">
                  {item.title} <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{item.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </DocsPage>
  );
}
