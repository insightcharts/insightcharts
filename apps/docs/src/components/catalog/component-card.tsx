import Link from "next/link";
import type { ReactNode } from "react";
import { hrefOf, isPoster, isPosterPrimitive, sectionOf, type CatalogEntry } from "@/lib/catalog";
import { authoredGround, posterGround, posterWidth } from "@/lib/posters";
import { cn } from "@/lib/utils";
import { LazyMount } from "./lazy";
import { Render } from "./render";
import { PosterThumb } from "./poster-thumb";
import { groundClass, groundVars } from "@/lib/ground";
import { Scaled } from "./scaled";

// Virtual width each level is laid out at before being scaled into a card. Components measure
// their layout width (not their painted width), so a template laid out at 1040px keeps its
// desktop arrangement however small the card is.
const VIRTUAL = { atom: 440, molecule: 680, template: 1040 };
// null rather than undefined: undefined is dropped when props cross from server to client.
const QUIET = { subtitle: null, source: null, note: null, exportable: false, table: false };
const THUMB = { height: 200, ...QUIET };

/**
 * A live, scaled, non-interactive render of a component's example, mounted when it nears the
 * viewport. Templates are taller than any card, so theirs is the top of the page, cropped.
 */
export function Thumbnail({ entry, aspect, eager, className }: { entry: CatalogEntry; aspect?: number; eager?: boolean; className?: string }) {
  const ratio = aspect ?? (entry.level === "molecule" ? 16 / 10 : 4 / 3);
  if (!entry.example || !entry.live) return <div className={cn("grid place-items-center text-xs text-muted-foreground", className)} style={{ aspectRatio: String(ratio) }}>No example</div>;
  // A poster fills the card with its own ground: no padding, no fade into the page's colour.
  if (isPoster(entry)) return <PosterThumb name={entry.name} ground={posterGround(entry.example, entry)} virtualWidth={posterWidth(entry)} aspect={ratio} eager={eager} className={className} />;
  // A poster primitive sets its own height from its layout, so the card does not force one.
  // No props are passed: the client reads the example from the component's own meta, so a
  // page of cards does not carry every spec in its payload.
  // An example with a named theme paints that theme's ground, with its own padding. The card
  // takes the same ground and adds little padding, so the thumbnail is one painted tile. A
  // gradient gets none: two gradients side by side would show a seam.
  const ground = authoredGround(entry.example);
  const body = (
    <Scaled virtualWidth={VIRTUAL[entry.level]} aspect={ratio} padding={ground ? (ground.light.includes("gradient") ? 0 : entry.level === "atom" ? 8 : 12) : entry.level === "atom" ? 20 : 28} center={!entry.chart && entry.level !== "template"} fade={!ground}>
      <Render name={entry.name} overrides={entry.chart ? (isPosterPrimitive(entry) ? QUIET : THUMB) : undefined} />
    </Scaled>
  );
  return (
    <div className={cn("w-full", groundClass(ground), className)} style={{ aspectRatio: String(ratio), ...groundVars(ground) }}>
      {eager ? body : <LazyMount className="size-full">{body}</LazyMount>}
    </div>
  );
}

export interface ComponentCardProps {
  entry: CatalogEntry;
  size?: "default" | "sm";
  showLevel?: boolean;
  /** Thumbnail aspect ratio, when the level default does not suit the grid. */
  aspect?: number;
  /** A line under the description, e.g. "via Stat row". May contain links. */
  meta?: ReactNode;
  className?: string;
}

/** A catalogue card: live thumbnail above, name and one-line description below. The whole card is the link. */
export function ComponentCard({ entry, size = "default", showLevel, aspect, meta, className }: ComponentCardProps) {
  const sm = size === "sm";
  // The link is stretched over the card rather than wrapped around it: examples may contain
  // links of their own, and anchors cannot nest.
  return (
    <article className={cn("group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25", className)}>
      <Thumbnail entry={entry} aspect={aspect} />
      <div className={cn("flex flex-1 flex-col gap-0.5 border-t", sm ? "px-3 py-2.5" : "px-4 py-3.5")}>
        <div className="flex items-center justify-between gap-2">
          <h3 className={cn("truncate font-medium text-foreground", sm ? "text-[13px]" : "text-sm")}>
            <Link href={hrefOf(entry)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {entry.title}
            </Link>
          </h3>
          {!showLevel && entry.examples.length > 6 ? <span className="shrink-0 rounded-full border px-1.5 py-px text-[10.5px] leading-4 tabular-nums text-muted-foreground">{entry.examples.length} examples</span> : null}
          {showLevel ? <span className="shrink-0 rounded-full border px-1.5 py-px text-[10.5px] leading-4 text-muted-foreground">{sectionOf(entry).singular}</span> : null}
        </div>
        <p className={cn("text-muted-foreground", sm ? "line-clamp-2 text-xs leading-[1.45]" : "line-clamp-2 text-[13px] leading-5")}>{entry.description.replace(/`/g, "")}</p>
        {meta ? <div className="relative z-10 mt-auto pt-2 text-xs leading-5 text-muted-foreground">{meta}</div> : null}
      </div>
    </article>
  );
}
