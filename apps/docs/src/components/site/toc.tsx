"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  depth: number;
}

/** "On this page" with scroll-spy: the last heading above the upper third of the viewport is active. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  useEffect(() => {
    if (!items.length) return;
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = items[0].id;
        for (const item of items) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= 120) current = item.id;
        }
        setActive(current);
      });
    };
    read();
    addEventListener("scroll", read, { passive: true });
    return () => {
      removeEventListener("scroll", read);
      cancelAnimationFrame(frame);
    };
  }, [items]);
  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="mb-2.5 font-medium text-foreground">On this page</p>
      <ul className="grid gap-1.5 border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={cn("-ml-px block border-l border-transparent py-0.5 leading-5 text-muted-foreground transition-colors hover:text-foreground", item.depth > 2 ? "pl-6" : "pl-3", active === item.id && "border-foreground text-foreground")}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
