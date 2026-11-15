import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PosterRender } from "@/components/catalog/poster-render";
import { PosterCanvas, PreviewCanvas, PreviewToolbar } from "@/components/catalog/preview-frame";
import { Render } from "@/components/catalog/render";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { byLevel, getComponent, hrefOf, isPoster, levelBySlug, sectionOf } from "@/lib/catalog";
import { authoredGround, posterGround } from "@/lib/posters";

// The full-screen view of a template: the example with nothing around it but a thin bar.
export const dynamicParams = false;
export const generateStaticParams = () => byLevel("template").map((c) => ({ level: "templates", name: c.name }));

type Params = Promise<{ level: string; name: string }>;

async function resolve(params: Params) {
  const { level, name } = await params;
  const entry = getComponent(name);
  return entry && entry.level === "template" && levelBySlug(level)?.level === "template" ? entry : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = await resolve(params);
  if (!c) return {};
  // The component page is the canonical one; this is a view of its example.
  return { title: `${c.title} preview`, description: c.description, alternates: { canonical: hrefOf(c) }, robots: { index: false } };
}

export default async function TemplatePreview({ params }: { params: Params }) {
  const c = await resolve(params);
  if (!c) notFound();
  const poster = isPoster(c);
  return (
    <div data-preview-root className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 sm:px-4">
          <Link href={hrefOf(c)} className="inline-flex h-8 min-w-0 items-center gap-2 rounded-md pr-2 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{c.title}</span>
            <span className="hidden shrink-0 rounded-full border px-1.5 py-px text-[10.5px] font-normal leading-4 text-muted-foreground sm:inline">{sectionOf(c).singular}</span>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <PreviewToolbar poster={poster} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="content" className="flex flex-1 flex-col">
        <h1 className="sr-only">{c.title} template, full-screen preview</h1>
        {poster ? (
          // The poster's ground fills the screen; the sheet is centred at its own widest size.
          <PosterCanvas ground={posterGround(c.example, c)} className="flex-1">
            <PosterRender name={c.name} />
          </PosterCanvas>
        ) : (
          <PreviewCanvas ground={authoredGround(c.example)} className="flex-1 sm:px-8 sm:py-12">
            <Render name={c.name} followTheme />
          </PreviewCanvas>
        )}
      </main>
    </div>
  );
}
