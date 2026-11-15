import { cn } from "@/lib/utils";

/** The mark: three bars and a dot that read as a lower-case "i" standing in a small chart. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("size-5", className)}>
      <rect x="3" y="14" width="4" height="7" rx="1" opacity="0.35" />
      <rect x="10" y="9" width="4" height="12" rx="1" />
      <circle cx="12" cy="4.5" r="2.25" />
      <rect x="17" y="11.5" width="4" height="9.5" rx="1" opacity="0.6" />
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
