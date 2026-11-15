"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Render } from "./render";

// Thumbnails never show the library's own download control.
const QUIET = { download: false };

/**
 * A live poster scaled down to the width of its box. The poster is laid out at the width it
 * was designed for (`virtualWidth`), so it keeps its wide arrangement, and the box takes the
 * poster's own height: the thumbnail has the poster's real shape. With `aspect` the box is
 * fixed instead and shows the top of the poster. The box is painted in the poster's ground
 * before and around the render. Decorative: inert and hidden from assistive technology.
 */
export function PosterThumb({ name, ground, virtualWidth, aspect, placeholder = 0.72, eager, overrides, className }: { name: string; ground?: string; virtualWidth: number; /** Fixed width / height of the box; the poster is cropped from the top. */ aspect?: number; /** Width / height reserved before the poster has been measured. */ placeholder?: number; eager?: boolean; overrides?: Record<string, unknown>; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [natural, setNatural] = useState(0);
  // Mounted the first time the box comes near the viewport, and kept after.
  const [shown, setShown] = useState(!!eager);
  useEffect(() => {
    const node = box.current;
    if (!node || shown) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setShown(true), { rootMargin: "500px" });
    io.observe(node);
    return () => io.disconnect();
  }, [shown]);
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const read = () => setScale(node.clientWidth / virtualWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(node);
    return () => ro.disconnect();
  }, [virtualWidth]);
  useEffect(() => {
    const node = inner.current;
    if (!node) return;
    const read = () => setNatural(node.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  const measured = !aspect && scale != null && natural > 0;
  const body = <Render name={name} overrides={{ ...QUIET, maxWidth: virtualWidth, ...overrides }} />;
  return (
    <div ref={box} aria-hidden inert className={cn("pointer-events-none relative w-full overflow-hidden select-none", className)} style={{ background: ground, ...(measured ? { height: Math.round(natural * scale) } : { aspectRatio: String(aspect ?? placeholder) }) }}>
      <div ref={inner} className="absolute left-0 top-0 origin-top-left transition-opacity duration-300" style={{ width: virtualWidth, transform: `scale(${scale ?? 1})`, opacity: scale == null ? 0 : 1 }}>
        {shown ? body : null}
      </div>
    </div>
  );
}
