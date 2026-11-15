"use client";

import { useRef, type ComponentProps } from "react";
import { CopyButton } from "@/components/site/copy-button";
import { useCopied } from "@/components/site/copy-button";
import { Check, Copy } from "lucide-react";

/** Fenced code in MDX: shiki output from fumadocs-mdx, framed, with a copy button and optional title. */
export function Pre({ title, children, className: _c, style: _s, ...rest }: ComponentProps<"pre"> & { title?: string; icon?: unknown }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, copy] = useCopied();
  const { icon: _icon, ...props } = rest as typeof rest & { icon?: unknown };
  return (
    <div className="code-block not-prose group/code relative my-5 min-w-0 overflow-hidden rounded-lg border bg-muted/40 dark:bg-muted/20">
      {title ? <div className="flex h-9 items-center border-b px-4 font-mono text-xs text-muted-foreground">{title}</div> : null}
      <pre ref={ref} {...props} className="shiki scroll-quiet max-h-[520px]">
        {children}
      </pre>
      <button
        type="button"
        onClick={() => copy(ref.current?.textContent ?? "")}
        aria-label={copied ? "Copied" : "Copy code"}
        className={`absolute right-2 ${title ? "top-1" : "top-2"} inline-flex size-7 items-center justify-center rounded-md bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

export { CopyButton };
