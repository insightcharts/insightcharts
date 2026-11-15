import { LOGO_COLOR, LOGO_PATH, LOGO_VIEWBOX } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The mark: a circle with a lower-case "i" cut into it. It keeps its own colour in both site modes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} fill={LOGO_COLOR} aria-hidden className={cn("size-5 shrink-0", className)}>
      <path d={LOGO_PATH} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>InsightCharts</span>
    </span>
  );
}
