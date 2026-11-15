import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section heading with a self-link, used by catalogue pages (MDX headings get the same treatment). */
export function Heading({ as: Tag = "h2", id, children, className }: { as?: "h2" | "h3"; id: string; children: ReactNode; className?: string }) {
  return (
    <Tag id={id} className={cn("group/h scroll-mt-20 font-semibold tracking-tight text-foreground", Tag === "h2" ? "mt-14 mb-4 text-xl" : "mt-9 mb-3 text-base", className)}>
      <a href={`#${id}`} className="rounded-sm no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        {children}
        <span aria-hidden className="ml-2 font-normal text-muted-foreground/0 transition-colors group-hover/h:text-muted-foreground/60">
          #
        </span>
      </a>
    </Tag>
  );
}
