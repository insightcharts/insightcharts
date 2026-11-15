"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ExampleItem {
  id: string;
  title: string;
  /** The full preview with its code tabs, rendered on the server. Mounted only while the row is open. */
  preview: ReactNode;
}

/**
 * The full previews of a component with many examples, as rows that open one at a time, so
 * a page with dozens of examples mounts only the previews the reader asks for. A link to a
 * row's id (from the gallery above, or from another page) opens that row and scrolls to it.
 */
export function ExampleList({ items }: { items: ExampleItem[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const follow = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!items.some((i) => i.id === id)) return;
      setOpen((prev) => new Set(prev).add(id));
      // After the row has opened, so the preview is not laid out under the header.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    follow();
    addEventListener("hashchange", follow);
    return () => removeEventListener("hashchange", follow);
  }, [items]);
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const all = open.size === items.length;
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={() => setOpen(all ? new Set() : new Set(items.map((i) => i.id)))} className="inline-flex h-7 items-center rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          {all ? "Close all" : `Open all ${items.length}`}
        </button>
      </div>
      <ul className="divide-y rounded-xl border">
        {items.map((item) => {
          const shown = open.has(item.id);
          return (
            <li key={item.id} id={item.id} className="scroll-mt-20">
              <h3>
                <button type="button" aria-expanded={shown} aria-controls={`${item.id}-panel`} onClick={() => toggle(item.id)} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset">
                  {item.title}
                  <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", shown && "rotate-180")} aria-hidden />
                </button>
              </h3>
              {shown ? (
                <div id={`${item.id}-panel`} className="px-3 pb-3">
                  {item.preview}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
