import { highlight, type Lang } from "@/lib/highlight";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

/** Server-highlighted code with a copy button. `bare` drops the border for use inside a framed panel. */
export async function CodeBlock({ code, lang = "tsx", title, bare, maxHeight = 420, className }: { code: string; lang?: Lang; title?: string; bare?: boolean; maxHeight?: number | null; className?: string }) {
  const html = await highlight(code, lang);
  return (
    <div className={cn("code-block group/code relative min-w-0", !bare && "overflow-hidden rounded-lg border bg-muted/40 dark:bg-muted/20", className)}>
      {title ? <div className="flex h-9 items-center border-b px-4 font-mono text-xs text-muted-foreground">{title}</div> : null}
      <div className="scroll-quiet overflow-auto" style={maxHeight ? { maxHeight } : undefined} dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton value={code} label="Copy code" className={cn("absolute right-2 bg-background/80 backdrop-blur-sm", title ? "top-1" : "top-2")} />
    </div>
  );
}
