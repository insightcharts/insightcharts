"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AgentActions } from "@/components/site/agent-actions";
import { cn } from "@/lib/utils";

export interface AgentLevel {
  key: string;
  /** "Strategic", "Operational", "Tactical". */
  label: string;
  /** The page the prompt is copied from. */
  page: string;
  pageHref: string;
  /** One sentence on what this prompt holds. */
  summary: string;
  href: string;
  prefill: string;
  text: string;
}

/** The three depths of agent instructions as tabs, each with its full text and its copy button. */
export function AgentLevels({ levels }: { levels: AgentLevel[] }) {
  const [active, setActive] = useState(levels[0].key);
  const id = useId();
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div role="tablist" aria-label="Depth of the agent instructions" className="grid border-b sm:grid-cols-3">
        {levels.map((l, i) => {
          const selected = l.key === active;
          return (
            <button
              key={l.key}
              type="button"
              role="tab"
              id={`${id}-${l.key}-tab`}
              aria-selected={selected}
              aria-controls={`${id}-${l.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(l.key)}
              onKeyDown={(e) => {
                const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? levels[(i + 1) % levels.length] : e.key === "ArrowLeft" || e.key === "ArrowUp" ? levels[(i - 1 + levels.length) % levels.length] : null;
                if (!next) return;
                e.preventDefault();
                setActive(next.key);
                document.getElementById(`${id}-${next.key}-tab`)?.focus();
              }}
              className={cn("relative px-4 py-3 text-left transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset max-sm:border-b max-sm:last:border-b-0 sm:border-l sm:first:border-l-0", selected && "bg-accent/60")}
            >
              <span className="block font-mono text-[11px] tabular-nums tracking-wide text-muted-foreground">
                0{i + 1} · {l.page}
              </span>
              <span className="mt-0.5 block text-sm font-medium">{l.label}</span>
              {selected ? <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground max-sm:inset-y-0 max-sm:left-0 max-sm:h-auto max-sm:w-0.5" /> : null}
            </button>
          );
        })}
      </div>
      {levels.map((l) => (
        <div key={l.key} role="tabpanel" id={`${id}-${l.key}`} aria-labelledby={`${id}-${l.key}-tab`} hidden={l.key !== active}>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-4 py-3">
            <p className="max-w-[64ch] text-[13px] leading-5 text-muted-foreground">
              {l.summary}{" "}
              <Link href={l.pageHref} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                Open the page
              </Link>
              .
            </p>
            <AgentActions href={l.href} prefill={l.prefill} />
          </div>
          {/* A scrolling region has to be reachable from the keyboard. */}
          <pre tabIndex={0} aria-label={`${l.label} agent instructions`} className="scroll-quiet max-h-[440px] overflow-auto whitespace-pre-wrap break-words bg-muted/30 px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-foreground/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset dark:bg-muted/10">
            {l.text}
          </pre>
        </div>
      ))}
    </div>
  );
}
