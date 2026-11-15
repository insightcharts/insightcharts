import { agentPrompt, agentPromptText } from "@/lib/agent";
import { cn } from "@/lib/utils";
import { AgentActions } from "./agent-actions";

/**
 * A prompt shown in the page: its text in a scrolling box, with the copy button and its menu
 * above. `path` is the page the prompt belongs to ("/", "/docs/data", "/prompts/kpi-row").
 */
export function AgentPrompt({ path, title, maxHeight = 320, className }: { path: string; title?: string; maxHeight?: number; className?: string }) {
  const ref = agentPrompt(path);
  const text = agentPromptText(path) ?? "";
  return (
    <div className={cn("not-prose my-6 overflow-hidden rounded-xl border bg-background", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-3 py-2">
        <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">{title ?? ref.href}</p>
        <AgentActions href={ref.href} prefill={ref.prefill} />
      </div>
      {/* A scrolling region has to be reachable from the keyboard. */}
      <pre tabIndex={0} aria-label="Agent instructions" className="scroll-quiet overflow-auto whitespace-pre-wrap break-words bg-muted/30 px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-foreground/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset dark:bg-muted/10" style={{ maxHeight }}>
        {text}
      </pre>
    </div>
  );
}
