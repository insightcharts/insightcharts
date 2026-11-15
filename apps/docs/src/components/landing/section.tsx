import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A landing section: a short labelled introduction beside or above its live example. */
export function Section({ id, label, title, children, intro, aside, className, titleClassName }: { id: string; label: string; title: string; intro: ReactNode; aside?: ReactNode; children?: ReactNode; className?: string; /** Size and measure for a title much longer than a phrase. */ titleClassName?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("border-t", className)}>
      <div className="container-page py-16 sm:py-24">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="mb-3 font-mono text-xs tracking-wide text-muted-foreground">{label}</p>
            <h2 id={`${id}-title`} className={cn("font-semibold tracking-tight text-balance", titleClassName ?? "max-w-[22ch] text-2xl sm:text-[28px] sm:leading-9")}>
              {title}
            </h2>
          </div>
          <div className="max-w-[62ch] text-[15px] leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 hover:[&_a]:decoration-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.86em] [&_code]:text-foreground [&_p+p]:mt-3">
            {intro}
            {aside}
          </div>
        </div>
        {children ? <div className="mt-10 sm:mt-12">{children}</div> : null}
      </div>
    </section>
  );
}
