import type { ReactNode } from "react";
import { getNav } from "@/lib/nav";
import { SidebarNav } from "./sidebar-nav";
import { Toc, type TocItem } from "./toc";

/** Sidebar + content frame shared by guides and the catalogue. */
export function DocsFrame({ children }: { children: ReactNode }) {
  return (
    <div className="container-page lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-10">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] lg:block">
        <div className="scroll-quiet -ml-2 h-full overflow-y-auto py-8 pr-3">
          <SidebarNav nav={getNav()} />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** A content column with an optional "On this page" rail. */
export function DocsPage({ children, toc, wide }: { children: ReactNode; toc?: TocItem[]; wide?: boolean }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_208px] xl:gap-10">
      <main id="content" className={`min-w-0 pb-24 pt-8 lg:pt-10 ${wide ? "max-w-[920px]" : "max-w-[760px]"}`}>
        {children}
      </main>
      <aside className="hidden xl:block">
        <div className="scroll-quiet sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto py-10">{toc ? <Toc items={toc} /> : null}</div>
      </aside>
    </div>
  );
}
