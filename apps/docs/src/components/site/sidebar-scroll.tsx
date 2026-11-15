"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Each section of the site mounts its own sidebar, so the scroll offset is kept outside
// React: moving between Docs, Atoms and Infographics keeps the list where it was.
let saved = 0;

/**
 * The sidebar's scroll area. It keeps its position across navigations and, when the page
 * you arrive on is not in view (a jump from the top navigation, search, or a link in the
 * page), scrolls just far enough to show the active item about a third of the way down.
 */
export function SidebarScroll({ children, className, persist = true }: { children: ReactNode; className?: string; persist?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (persist) el.scrollTop = saved;
    const active = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (active) {
      const box = el.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      const margin = 64;
      if (item.top < box.top + margin || item.bottom > box.bottom - margin) el.scrollTop += item.top - box.top - box.height * 0.3;
    }
    if (persist) saved = el.scrollTop;
  }, [pathname, persist]);

  return (
    <div
      ref={ref}
      className={className}
      onScroll={(e) => {
        if (persist) saved = e.currentTarget.scrollTop;
      }}
    >
      {children}
    </div>
  );
}
