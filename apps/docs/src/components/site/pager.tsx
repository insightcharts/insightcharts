import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PagerLink {
  title: string;
  href: string;
  label?: string;
}

export function Pager({ previous, next }: { previous?: PagerLink; next?: PagerLink }) {
  if (!previous && !next) return null;
  const base = "group flex min-w-0 flex-1 flex-col gap-1 rounded-xl border px-4 py-3 transition-colors hover:border-foreground/25 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
  return (
    <nav aria-label="Previous and next" className="mt-16 flex flex-col gap-3 sm:flex-row">
      {previous ? (
        <Link href={previous.href} className={base}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="size-3" /> {previous.label ?? "Previous"}
          </span>
          <span className="truncate text-sm font-medium">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={next.href} className={`${base} sm:items-end sm:text-right`}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {next.label ?? "Next"} <ArrowRight className="size-3" />
          </span>
          <span className="truncate text-sm font-medium">{next.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
