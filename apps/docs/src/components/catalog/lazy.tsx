"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts its children the first time the box comes near the viewport, and keeps them after.
 * Cross-link grids can hold a dozen live previews; this keeps the page fast and the HTML small.
 * The parent is expected to reserve the space (an aspect-ratio box), so nothing shifts.
 */
export function LazyMount({ children, margin = 400, className }: { children: ReactNode; margin?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true);
      },
      { rootMargin: `${margin}px` },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [margin, shown]);
  return (
    <div ref={ref} className={className}>
      {shown ? children : null}
    </div>
  );
}

/**
 * Renders its children only in the browser, after hydration. Poster primitives size themselves
 * from measured text, which the server can only estimate, so their server HTML would not match
 * the first client render. The parent reserves the space.
 */
export function ClientOnly({ children, className }: { children: ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div className={className}>{mounted ? children : null}</div>;
}
