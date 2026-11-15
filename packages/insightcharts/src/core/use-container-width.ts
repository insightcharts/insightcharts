import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

// Measure before paint in the browser, so a client-side mount never flashes the fallback layout.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Width of an element in CSS px, kept current with a ResizeObserver. Components lay out
 * by the width of their own container, not the viewport, because they live inside
 * arbitrary columns. Returns `fallback` until measured (and on the server).
 */
export function useContainerWidth<T extends HTMLElement = HTMLDivElement>(fallback = 1024): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    setWidth(Math.round(node.getBoundingClientRect().width));
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      setWidth((prev) => (prev === next ? prev : next));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}
