"use client";

import { Code2, Eye, FileText } from "lucide-react";
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
  /** Site-relative address of the prompt as a Markdown file. */
  href: string;
  prefill: string;
  /** The prompt as raw Markdown: what the copy button copies. */
  text: string;
  /** The same prompt rendered to HTML on the server, for the preview. */
  html: string;
}

const ring = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * The three depths of agent instructions in a document viewer: the levels down the left,
 * the selected prompt on the right. The preview shows the Markdown rendered; the copy button
 * always copies the raw Markdown, which is what an agent should receive.
 */
export function AgentLevels({ levels }: { levels: AgentLevel[] }) {
  const [active, setActive] = useState(levels[0].key);
  const [view, setView] = useState<"preview" | "raw">("preview");
  const id = useId();
  const current = levels.find((l) => l.key === active) ?? levels[0];

  return (
    <div className="overflow-hidden rounded-xl border bg-background md:grid md:grid-cols-[264px_minmax(0,1fr)]">
      <div role="tablist" aria-label="Depth of the agent instructions" aria-orientation="vertical" className="flex gap-1 overflow-x-auto border-b bg-muted/30 p-2 md:flex-col md:overflow-visible md:border-b-0 md:border-r dark:bg-muted/10">
        {levels.map((l, i) => {
          const selected = l.key === active;
          return (
            <button
              key={l.key}
              type="button"
              role="tab"
              id={`${id}-${l.key}-tab`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(l.key)}
              onKeyDown={(e) => {
                const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? levels[(i + 1) % levels.length] : e.key === "ArrowUp" || e.key === "ArrowLeft" ? levels[(i - 1 + levels.length) % levels.length] : e.key === "Home" ? levels[0] : e.key === "End" ? levels[levels.length - 1] : null;
                if (!next) return;
                e.preventDefault();
                setActive(next.key);
                document.getElementById(`${id}-${next.key}-tab`)?.focus();
              }}
              className={cn(
                "relative min-w-[200px] shrink-0 rounded-lg px-3 py-2.5 text-left transition-colors md:min-w-0",
                selected ? "bg-background shadow-xs ring-1 ring-border" : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                ring,
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn("font-mono text-[11px] tabular-nums", selected ? "text-foreground" : "text-muted-foreground")}>0{i + 1}</span>
                <span className="text-sm font-medium text-foreground">{l.label}</span>
              </span>
              <span className="mt-0.5 block pl-[26px] text-xs text-muted-foreground">{l.page}</span>
              <span className={cn("mt-1.5 hidden pl-[26px] text-[12.5px] leading-[1.5] text-muted-foreground md:block", !selected && "md:hidden")}>{l.summary}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${current.key}-tab`} className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2">
          <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <a href={current.href} target="_blank" rel="noreferrer" className={cn("min-w-0 truncate rounded font-mono text-xs text-muted-foreground hover:text-foreground", ring)}>
            {current.href}
          </a>
          <Link href={current.pageHref} className={cn("rounded text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground", ring)}>
            Open the page
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div role="group" aria-label="How to show the instructions" className="inline-flex h-7 items-center rounded-md border p-0.5 text-xs">
              {(
                [
                  ["preview", "Preview", Eye],
                  ["raw", "Markdown", Code2],
                ] as const
              ).map(([key, label, Icon]) => (
                <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={cn("inline-flex h-full items-center gap-1.5 rounded px-2 transition-colors", view === key ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground", ring)}>
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <AgentActions size="compact" href={current.href} prefill={current.prefill} />
          </div>
        </div>
        {/* A scrolling region has to be reachable from the keyboard. Keyed so it starts at the top of each prompt. */}
        <div key={`${current.key}-${view}`} tabIndex={0} aria-label={`${current.label} agent instructions`} className={cn("scroll-quiet h-[520px] overflow-auto px-5 py-5 sm:px-7 sm:py-6", ring, "focus-visible:ring-inset")}>
          {view === "preview" ? (
            <div className="md-preview mx-auto max-w-[72ch]" dangerouslySetInnerHTML={{ __html: current.html }} />
          ) : (
            <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.65] text-foreground/90">{current.text}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
