"use client";

import { canvasToBlob, downloadBlob, InsightProvider, rasterize } from "insightcharts";
import { posterBackgrounds, posterThemes, themes, themeSurfaces } from "insightcharts/themes";
import { Check, ChevronDown, ChevronsDownUp, ChevronsUpDown, Download, Maximize2, Monitor, Moon, Palette, Smartphone, Sun, Tablet } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ClientOnly, LazyMount } from "./lazy";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { groundClass, groundVars } from "@/lib/ground";
import { cn } from "@/lib/utils";
import { usePreviewSettings, type PreviewWidth } from "./preview-settings";

const WIDTHS: { key: PreviewWidth; label: string; px: number | null; icon: typeof Monitor }[] = [
  { key: "mobile", label: "Mobile, 390px", px: 390, icon: Smartphone },
  { key: "tablet", label: "Tablet, 768px", px: 768, icon: Tablet },
  { key: "full", label: "Full width", px: null, icon: Monitor },
];

const themeLabel = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ");

function Seg({ pressed, label, onClick, children, className }: { pressed: boolean; label: string; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-pressed={pressed}
          aria-label={label}
          onClick={onClick}
          className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-[5px] px-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", pressed && "bg-background text-foreground shadow-xs ring-1 ring-border", className)}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** The mode previews are in: the forced one, else the page's (unknown until mounted). */
function useEffectiveMode(): "light" | "dark" | undefined {
  const s = usePreviewSettings();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return s.mode ?? (mounted ? (resolvedTheme as "light" | "dark" | undefined) : undefined);
}

const group = "inline-flex items-center gap-0.5 rounded-md bg-muted/70 p-0.5";

const POSTER_NAMES = Object.keys(posterThemes);
const PRESET_NAMES = Object.keys(themes).filter((name) => !POSTER_NAMES.includes(name));
const grounds = posterBackgrounds as Record<string, { light: string; dark: string } | undefined>;
const surfaces = themeSurfaces as Record<string, { light: string; dark: string } | undefined>;

const menuTrigger = "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** Four series colours of a theme. Poster themes show them on their own ground. */
function Swatch({ name }: { name: string }) {
  const ground = grounds[name]?.light;
  return (
    <span className={cn("flex gap-0.5", ground && "rounded-full p-[3px] ring-1 ring-foreground/10")} style={{ background: ground }} aria-hidden>
      {themes[name].light.categorical.slice(0, 4).map((c, i) => (
        <span key={i} className="size-2.5 rounded-full" style={{ background: c }} />
      ))}
    </span>
  );
}

const fileSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "poster";

/** Saves the poster in the same preview as one PNG, with the library's own DOM-to-canvas painter. */
function DownloadPoster() {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  async function save(event: MouseEvent<HTMLButtonElement>) {
    const sheet = event.currentTarget.closest("[data-preview-root]")?.querySelector<HTMLElement>('[data-slot="ic-poster"]');
    if (!sheet || state === "busy") return;
    setState("busy");
    try {
      const blob = await canvasToBlob(await rasterize(sheet, 2400));
      downloadBlob(blob, `${fileSlug(sheet.querySelector('[data-slot="ic-poster-title"]')?.textContent ?? "")}.png`);
      setState("idle");
    } catch {
      setState("error");
    }
  }
  return (
    <button type="button" className={menuTrigger} onClick={save} disabled={state === "busy"} aria-label="Download PNG" data-poster-download>
      <Download className="size-3.5" />
      <span className="max-sm:sr-only">{state === "busy" ? "Preparing…" : state === "error" ? "Download failed" : "Download PNG"}</span>
    </button>
  );
}

/**
 * Theme, width, renderer and mode controls. Shared across every preview on the site.
 * A poster paints one design whatever the page's mode is, so the poster variant has no
 * light / dark switch; it offers the poster themes and a PNG download instead.
 */
export function PreviewToolbar({ className, poster }: { className?: string; poster?: boolean }) {
  const s = usePreviewSettings();
  const effective = useEffectiveMode();
  const current = poster ? s.posterTheme : s.theme;
  const label = current ? themeLabel(current) : "As authored";
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-x-1.5 gap-y-1", className)} role="toolbar" aria-label="Preview options">
      <DropdownMenu>
        <DropdownMenuTrigger className={menuTrigger} aria-label={`${poster ? "Poster theme" : "Theme preset"}: ${label}`}>
          <Palette className="size-3.5" />
          <span className="max-w-24 truncate">{label}</span>
          <ChevronDown className="size-3 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-80 min-w-48">
          {poster ? (
            <>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Poster theme</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => s.set({ posterTheme: null })}>
                As authored
                {s.posterTheme === null ? <Check className="ml-auto size-3.5" /> : null}
              </DropdownMenuItem>
              {POSTER_NAMES.map((name) => (
                <DropdownMenuItem key={name} onSelect={() => s.set({ posterTheme: name })}>
                  <Swatch name={name} />
                  {themeLabel(name)}
                  {s.posterTheme === name ? <Check className="ml-auto size-3.5" /> : null}
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <>
              <DropdownMenuItem onSelect={() => s.set({ theme: null })}>
                As authored
                {s.theme === null ? <Check className="ml-auto size-3.5" /> : null}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Theme preset</DropdownMenuLabel>
              {PRESET_NAMES.map((name) => (
                <DropdownMenuItem key={name} onSelect={() => s.set({ theme: name })}>
                  <Swatch name={name} />
                  {themeLabel(name)}
                  {s.theme === name ? <Check className="ml-auto size-3.5" /> : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Poster theme</DropdownMenuLabel>
              {POSTER_NAMES.map((name) => (
                <DropdownMenuItem key={name} onSelect={() => s.set({ theme: name })}>
                  <Swatch name={name} />
                  {themeLabel(name)}
                  {s.theme === name ? <Check className="ml-auto size-3.5" /> : null}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={cn(group, "hidden md:inline-flex")}>
        {WIDTHS.map((w) => (
          <Seg key={w.key} pressed={s.width === w.key} label={w.label} onClick={() => s.set({ width: w.key })}>
            <w.icon className="size-3.5" />
          </Seg>
        ))}
      </div>
      <div className={group}>
        <Seg pressed={s.renderer !== "canvas"} label="Render as SVG" onClick={() => s.set({ renderer: "svg" })} className="font-mono text-[10.5px] tracking-tight">
          SVG
        </Seg>
        <Seg pressed={s.renderer === "canvas"} label="Render on canvas" onClick={() => s.set({ renderer: "canvas" })} className="font-mono text-[10.5px] tracking-tight">
          Canvas
        </Seg>
      </div>
      {poster ? (
        <DownloadPoster />
      ) : (
        <div className={group}>
          <Seg pressed={effective === "light"} label="Light preview" onClick={() => s.set({ mode: "light" })}>
            <Sun className="size-3.5" />
          </Seg>
          <Seg pressed={effective === "dark"} label="Dark preview" onClick={() => s.set({ mode: "dark" })}>
            <Moon className="size-3.5" />
          </Seg>
        </div>
      )}
    </div>
  );
}

/**
 * The surface a preview renders on: applies the shared mode, width and renderer. By default
 * each example keeps the theme it was authored in, and the canvas takes the ground that theme
 * paints (`ground`), so no strip of the page's colour shows round the example. A theme picked
 * in the toolbar replaces both.
 */
export function PreviewCanvas({ children, minHeight, padded = true, ground, className }: { children: ReactNode; minHeight?: number; padded?: boolean; /** The ground the example paints in each mode, when it paints one. */ ground?: { light: string; dark: string }; className?: string }) {
  const s = usePreviewSettings();
  const width = WIDTHS.find((w) => w.key === s.width)!.px;
  const effective = useEffectiveMode();
  // A forced preset other than insight and shadcn paints for its own surface, and a poster
  // theme for its own ground.
  const forced = s.theme ? (grounds[s.theme] ?? surfaces[s.theme]) : undefined;
  const own = s.theme ? forced : ground;
  return (
    <div data-preview={s.mode ?? undefined} className={cn("bg-background text-foreground", width && "preview-canvas", !width && groundClass(own), padded && (width ? "p-4 sm:p-6" : own ? (own.light.includes("gradient") ? "p-0" : "p-3 sm:p-4") : "p-5 sm:p-8"), className)} style={{ minHeight, ...groundVars(own) }}>
      <div className={cn("mx-auto min-w-0", width && "rounded-lg border bg-background shadow-xs", width && (own ? "p-0" : "p-4"), width && groundClass(own))} style={{ maxWidth: width ?? undefined }}>
        <InsightProvider theme={s.theme ? themes[s.theme] : undefined} mode={s.mode ?? "auto"} renderer={s.renderer}>
          {children}
        </InsightProvider>
      </div>
    </div>
  );
}

/**
 * The surface a poster renders on. A poster paints its own ground and forces its own theme
 * and mode, so the canvas adds no padding and no mode: it takes the poster's ground as its
 * own background, which leaves no strip of the page's colour around the sheet. The ground is
 * read from the mounted sheet, so a custom `background` or a theme object is matched too.
 */
export function PosterCanvas({ children, ground, lazy, className }: { children: ReactNode; ground?: string; lazy?: boolean; className?: string }) {
  const s = usePreviewSettings();
  const width = WIDTHS.find((w) => w.key === s.width)!.px;
  const ref = useRef<HTMLDivElement>(null);
  const [painted, setPainted] = useState<string | undefined>(undefined);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const read = () => {
      const sheet = node.querySelector<HTMLElement>('[data-slot="ic-poster"]');
      if (sheet?.style.background) setPainted(sheet.style.background);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: ["style", "data-theme-name"] });
    return () => mo.disconnect();
  }, []);
  const guess = s.posterTheme ? grounds[s.posterTheme]?.light : ground;
  const body = (
    // Charts mount at once, so a downloaded image is never missing one below the fold.
    <InsightProvider renderer={s.renderer} lazy={false}>
      {children}
    </InsightProvider>
  );
  return (
    <div ref={ref} data-poster-canvas className={cn("bg-muted text-foreground", className)} style={{ background: painted ?? guess }}>
      <div className="mx-auto min-w-0" style={{ maxWidth: width ?? undefined }}>
        {lazy ? <LazyMount className="min-h-[560px]">{body}</LazyMount> : <ClientOnly className="min-h-[560px]">{body}</ClientOnly>}
      </div>
    </div>
  );
}

export interface PreviewFrameProps {
  /** The live render. */
  children: ReactNode;
  /** Server-highlighted code panels. */
  code?: ReactNode;
  json?: ReactNode;
  /** Reserved height of the preview canvas, so nothing shifts when charts mount. */
  minHeight?: number;
  toolbar?: boolean;
  /**
   * Cap the preview at this height and scroll inside it, with a control to show it all.
   * For templates, which are whole pages.
   */
  maxHeight?: number;
  /** A route that shows the same example with nothing around it. */
  fullHref?: string;
  /** The example is a whole poster: paint its ground edge to edge and show the poster toolbar. */
  poster?: { ground?: string; lazy?: boolean };
  /** The ground the example paints in each mode, when it paints one. The canvas takes it. */
  ground?: { light: string; dark: string };
  /** No padding round the example: it paints its own background to the edges. */
  flush?: boolean;
  className?: string;
}

const action = "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** Preview / Code / JSON tabs around a live example. */
export function PreviewFrame({ children, code, json, minHeight, toolbar = true, maxHeight, fullHref, poster, ground, flush, className }: PreviewFrameProps) {
  const [tab, setTab] = useState<"preview" | "code" | "json">("preview");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const tabs = [{ key: "preview" as const, label: "Preview" }, ...(code ? [{ key: "code" as const, label: "Code" }] : []), ...(json ? [{ key: "json" as const, label: "JSON" }] : [])];
  return (
    <div data-preview-root className={cn("not-prose min-w-0 overflow-hidden rounded-xl border bg-background", className)}>
      {tabs.length === 1 && !toolbar && !maxHeight && !fullHref ? null : <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b px-2 py-1.5">
        <div role="tablist" aria-label="Example" className="flex items-center gap-0.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${id}-${t.key}-tab`}
              aria-selected={tab === t.key}
              aria-controls={`${id}-${t.key}`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => {
                const i = tabs.findIndex((x) => x.key === tab);
                const next = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
                if (!next) return;
                setTab(next.key);
                document.getElementById(`${id}-${next.key}-tab`)?.focus();
              }}
              className={cn("h-7 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", tab === t.key && "bg-accent text-foreground")}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "preview" && (toolbar || maxHeight || fullHref) ? (
          <div className="flex flex-wrap items-center justify-end gap-x-1.5 gap-y-1">
            {toolbar ? <PreviewToolbar poster={!!poster} /> : null}
            {maxHeight ? (
              <button type="button" className={action} aria-expanded={expanded} aria-controls={`${id}-preview`} onClick={() => setExpanded((v) => !v)}>
                {expanded ? <ChevronsDownUp className="size-3.5" /> : <ChevronsUpDown className="size-3.5" />}
                <span className="max-sm:sr-only">{expanded ? "Collapse" : "Expand"}</span>
              </button>
            ) : null}
            {fullHref ? (
              <Link href={fullHref} className={action}>
                <Maximize2 className="size-3.5" />
                <span className="max-sm:sr-only">Full screen</span>
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>}
      {/* The preview stays mounted while other tabs show, so charts keep their state. */}
      <div
        role="tabpanel"
        id={`${id}-preview`}
        aria-labelledby={`${id}-preview-tab`}
        hidden={tab !== "preview"}
        // A scrolling region has to be reachable from the keyboard.
        tabIndex={maxHeight && !expanded ? 0 : undefined}
        className={cn(maxHeight && !expanded && "scroll-quiet overflow-y-auto overscroll-contain focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset")}
        style={maxHeight && !expanded ? { maxHeight } : undefined}
      >
        {poster ? (
          <PosterCanvas ground={poster.ground} lazy={poster.lazy}>
            {children}
          </PosterCanvas>
        ) : (
          <PreviewCanvas minHeight={minHeight} ground={ground} padded={!flush} className={flush ? "[&_[data-story]]:rounded-none" : undefined}>
            {children}
          </PreviewCanvas>
        )}
      </div>
      {code ? (
        <div role="tabpanel" id={`${id}-code`} aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"} className="bg-muted/30 dark:bg-muted/10">
          {code}
        </div>
      ) : null}
      {json ? (
        <div role="tabpanel" id={`${id}-json`} aria-labelledby={`${id}-json-tab`} hidden={tab !== "json"} className="bg-muted/30 dark:bg-muted/10">
          {json}
        </div>
      ) : null}
    </div>
  );
}
