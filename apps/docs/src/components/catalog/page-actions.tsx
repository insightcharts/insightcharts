"use client";

import { Check, ChevronDown, Copy, ExternalLink, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { copyText } from "@/components/site/copy-button";

/**
 * Copy the Markdown at `href` (the generated /llms/<name>.md, the same file agents read).
 * The fetch is handed to the clipboard as a promise where that is supported, so the copy
 * still counts as part of the click in Safari.
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

/** Copy the page as Markdown, or hand its Markdown URL to an assistant. */
export function PageActions({ markdownHref, markdownUrl, title }: { markdownHref: string; markdownUrl: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 1800);
    return () => clearTimeout(t);
  }, [state]);
  const copied = state === "copied";
  const prompt = encodeURIComponent(`Read ${markdownUrl} so I can ask questions about the InsightCharts ${title} component.`);
  const item = "gap-2 text-[13px]";
  return (
    <div className="inline-flex shrink-0 items-stretch rounded-md border bg-background text-[13px] font-medium shadow-xs">
      <button type="button" onClick={() => void copyFrom(markdownHref).then((ok) => setState(ok ? "copied" : "failed"))} className="inline-flex h-8 items-center gap-1.5 rounded-l-md px-2.5 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        <span aria-live="polite">{copied ? "Copied" : state === "failed" ? "Could not copy" : "Copy as Markdown"}</span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="More page actions" className="inline-flex w-8 items-center justify-center rounded-r-md border-l transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <DropdownMenuItem asChild className={item}>
            <a href={markdownHref} target="_blank" rel="noreferrer">
              <FileText className="size-3.5" /> View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={item}>
            <a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" /> Open in ChatGPT
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={item}>
            <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" /> Open in Claude
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
