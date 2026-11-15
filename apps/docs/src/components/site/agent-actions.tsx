"use client";

import { Check, ChevronDown, Copy, ExternalLink, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AgentIcon } from "./agent-icon";
import { cn } from "@/lib/utils";
import { copyText } from "./copy-button";

/** The one label this control has everywhere on the site. */
export const AGENT_LABEL = "Copy agent instructions";

/**
 * Copy the text at `href`. The fetch is handed to the clipboard as a promise where that is
 * supported, so the copy still counts as part of the click in Safari.
 */
async function copyFrom(href: string): Promise<boolean> {
  const text = fetch(href).then((r) => {
    if (!r.ok) throw new Error(`${href}: ${r.status}`);
    return r.text();
  });
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })) })]);
      return true;
    }
  } catch {
    /* fall through to writeText */
  }
  try {
    return await copyText(await text);
  } catch {
    return false;
  }
}

export interface AgentActionsProps {
  /** Site-relative URL of the page's prompt, e.g. /agents/atoms/bar-chart.md */
  href: string;
  /** What the chat links start with: the prompt itself, or its address when it is too long for a URL. */
  prefill?: string;
  /** The page as Markdown (the /llms file), for "Copy as Markdown". */
  markdownHref?: string;
  /** `hero` matches the landing page's buttons, `compact` sits in a preview's tab bar. */
  size?: "default" | "hero" | "compact";
  /** Show the menu beside the button. Off for the buttons on single examples. */
  menu?: boolean;
  className?: string;
}

type State = "idle" | "copied" | "copied-markdown" | "failed";

/**
 * "Copy agent instructions": copies the prompt written for this page to a coding agent. The
 * menu beside it opens the same text as a file, starts a chat with it, or copies the page's
 * Markdown reference.
 */
export function AgentActions({ href, prefill, markdownHref, size = "default", menu = true, className }: AgentActionsProps) {
  const [state, setState] = useState<State>("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);
  const done = state === "copied" || state === "copied-markdown";
  const label = state === "copied" ? "Copied" : state === "copied-markdown" ? "Copied as Markdown" : state === "failed" ? "Could not copy" : AGENT_LABEL;
  const copy = (from: string, ok: State) => void copyFrom(from).then((worked) => setState(worked ? ok : "failed"));
  const q = encodeURIComponent(prefill ?? "");
  const height = size === "hero" ? "h-9" : size === "compact" ? "h-7" : "h-8";
  const item = "gap-2 text-[13px]";
  const ring = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";
  return (
    <div data-agent-actions className={cn("inline-flex shrink-0 items-stretch rounded-md font-medium shadow-xs", size === "compact" ? "text-xs" : size === "hero" ? "text-sm" : "text-[13px]", className)}>
      <button
        type="button"
        data-agent-copy={href}
        onClick={() => copy(href, "copied")}
        className={cn("inline-flex items-center gap-1.5 border border-input bg-background text-foreground transition-colors hover:bg-accent dark:bg-input/30 dark:hover:bg-input/50", height, size === "hero" ? "px-3.5" : size === "compact" ? "px-2" : "px-3", menu ? "rounded-l-md" : "rounded-md", ring)}
      >
        {done ? <Check className="size-3.5" aria-hidden /> : <AgentIcon className={size === "compact" ? "size-3.5" : "size-4"} />}
        <span aria-live="polite" className="whitespace-nowrap">
          {label}
        </span>
      </button>
      {menu ? (
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="More ways to use the agent instructions" className={cn("-ml-px inline-flex items-center justify-center rounded-r-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50", height, size === "hero" ? "w-9" : "w-8", ring)}>
            <ChevronDown className="size-3.5" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuItem asChild className={item}>
              <a href={href} target="_blank" rel="noreferrer">
                <FileText className="size-3.5" /> View as Markdown
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={item}>
              <a href={`https://claude.ai/new?q=${q}`} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" /> Open in Claude
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={item}>
              <a href={`https://chatgpt.com/?q=${q}`} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" /> Open in ChatGPT
              </a>
            </DropdownMenuItem>
            {markdownHref ? (
              <DropdownMenuItem className={item} onSelect={() => copy(markdownHref, "copied-markdown")}>
                <Copy className="size-3.5" /> Copy as Markdown
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
