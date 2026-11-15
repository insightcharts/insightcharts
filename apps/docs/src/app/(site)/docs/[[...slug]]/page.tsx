import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/components";
import { AgentActions } from "@/components/site/agent-actions";
import { DocsPage } from "@/components/site/docs-shell";
import { Pager } from "@/components/site/pager";
import { agentPrompt, guideMarkdown } from "@/lib/agent";
import { byLevel } from "@/lib/catalog";
import { getNav, guideOrder } from "@/lib/nav";
import { guideCard, social } from "@/lib/og";
import { site } from "@/lib/site";
import { source } from "@/lib/source";

export const dynamicParams = false;
export const generateStaticParams = () => source.generateParams();

type Params = Promise<{ slug?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = source.getPage((await params).slug);
  if (!page) return {};
  const tags = social({ path: page.url, title: page.data.title, description: page.data.description ?? site.description, type: "article", card: guideCard(page) });
  return { title: page.data.title, description: page.data.description, ...tags, alternates: { ...tags.alternates, types: { "text/markdown": [{ url: agentPrompt(page.url).href, title: "Agent instructions" }] } } };
}

const flatten = (node: unknown): string => (typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(flatten).join("") : node && typeof node === "object" && "props" in node ? flatten((node as { props: { children?: unknown } }).props.children) : "");

export default async function GuidePage({ params }: { params: Params }) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  const Body = page.data.body;
  const order = guideOrder();
  const i = order.findIndex((p) => p.href === page.url);
  const section = getNav().find((g) => g.blocks.some((b) => b.items.some((it) => it.href === page.url)))?.title;
  // After the last guide, carry on into the catalogue.
  const agent = agentPrompt(page.url);
  const firstAtom = byLevel("atom").length ? { title: "Atoms", href: "/atoms", label: "Components" } : undefined;
  return (
    <DocsPage toc={page.data.toc.map((t) => ({ id: t.url.slice(1), title: flatten(t.title), depth: t.depth }))}>
      <header className="mb-8">
        {section ? <p className="mb-2 text-sm text-muted-foreground">{section}</p> : null}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{page.data.title}</h1>
          <AgentActions href={agent.href} prefill={agent.prefill} markdownHref={guideMarkdown(page.slugs.join("/"))} />
        </div>
        {page.data.description ? <p className="mt-3 text-[17px] leading-7 text-muted-foreground text-pretty">{page.data.description}</p> : null}
      </header>
      <div className="prose-docs">
        <Body components={mdxComponents} />
      </div>
      <Pager previous={order[i - 1]} next={order[i + 1] ?? firstAtom} />
    </DocsPage>
  );
}
