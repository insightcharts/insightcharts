"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders children at a fixed virtual width and scales them down to fit the container: a
 * live thumbnail. The box has a fixed aspect ratio, so it reserves its space before the
 * scale is measured. Decorative only: inert and hidden from assistive tech.
 */
export function Scaled({ children, virtualWidth, aspect = 16 / 10, padding = 24, center, fade = true, className }: { children: ReactNode; virtualWidth: number; aspect?: number; padding?: number; center?: boolean; /** Fade the bottom edge into the page. Off when the content paints its own ground. */ fade?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const read = () => {
      setScale(Math.min(1, node.clientWidth / virtualWidth));
      setHeight(node.clientHeight);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(node);
    return () => ro.disconnect();
  }, [virtualWidth]);
  return (
    <div ref={box} aria-hidden inert className={cn("pointer-events-none relative w-full overflow-hidden select-none", className)} style={{ aspectRatio: String(aspect) }}>
      <div className="absolute left-0 top-0 origin-top-left transition-opacity duration-200" style={{ width: scale != null && scale >= 1 ? "100%" : virtualWidth, padding, transform: `scale(${scale ?? 1})`, opacity: scale == null ? 0 : 1, ...(center && scale ? { minHeight: height / scale, display: "flex", flexDirection: "column", justifyContent: "center" } : null) }}>
        {children}
      </div>
      {fade ? <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-background to-transparent" /> : null}
    </div>
  );
}
