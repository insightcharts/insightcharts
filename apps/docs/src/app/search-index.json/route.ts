import type { SearchRecord } from "@/components/site/search";
import { components, hrefOf, sectionOf } from "@/lib/catalog";
import { source } from "@/lib/source";

export const dynamic = "force-static";

/** The command palette's index: every guide, every guide heading and every component. */
export function GET() {
  const records: SearchRecord[] = [];
  for (const page of source.getPages()) {
    records.push({ title: page.data.title, href: page.url, group: "Guides", kind: "guide", detail: page.data.description, keywords: page.data.structuredData?.contents.map((c) => c.content).join(" ").slice(0, 2000) });
  }
  for (const c of components) {
    records.push({ title: c.title, href: hrefOf(c), group: sectionOf(c).title, kind: c.level, detail: c.description, keywords: [c.name, c.component, c.category, c.whenToUse].filter(Boolean).join(" ") });
  }
  for (const page of source.getPages()) {
    for (const h of page.data.structuredData?.headings ?? []) records.push({ title: h.content, href: `${page.url}#${h.id}`, group: "Sections", kind: "heading", detail: page.data.title });
  }
  return Response.json(records);
}
