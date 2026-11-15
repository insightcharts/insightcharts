import { isPoster, type CatalogEntry } from "@/lib/catalog";
import { groundClass, groundVars } from "@/lib/ground";
import { authoredGround } from "@/lib/posters";
import { cn } from "@/lib/utils";
import { LazyMount } from "./lazy";
import { Render } from "./render";
import { Scaled } from "./scaled";

export const exampleId = (title: string) =>
  `example-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

/**
 * How a component's examples are laid out together, from their natural size:
 * `tile` for figure and text atoms, drawn at full size several to a row; `thumb` for charts
 * and molecules, scaled down two or three to a row; null for whole pages and posters, which
 * are too large to compare in a grid.
 */
// Molecules that are one small card, so they are drawn at full size like the figure atoms.
const SMALL = new Set(["trend-card"]);

export function galleryKind(entry: CatalogEntry): "tile" | "thumb" | null {
  if (entry.level === "template" || isPoster(entry)) return null;
  if (SMALL.has(entry.name)) return "tile";
  return entry.level === "atom" && !entry.chart ? "tile" : "thumb";
}

/** A gallery is shown when the examples are small, or when there are more than six of them. */
export function hasGallery(entry: CatalogEntry): boolean {
  const kind = galleryKind(entry);
  return kind === "tile" ? entry.examples.length >= 3 : kind === "thumb" ? entry.examples.length > 6 : false;
}

const QUIET = { exportable: false, table: false };

/**
 * Every example of a component as one grid of live cards, each on the ground its own theme
 * paints, with its name underneath. A card links to that example's full preview and code
 * further down the page.
 */
export function ExampleGallery({ entry }: { entry: CatalogEntry }) {
  const kind = galleryKind(entry);
  if (!kind) return null;
  const tile = kind === "tile";
  const virtual = entry.level === "atom" ? 440 : 680;
  return (
    <ul aria-label={`${entry.title} examples`} className={cn("grid gap-3", tile ? (entry.level === "atom" ? "grid-cols-[repeat(auto-fill,minmax(210px,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]") : entry.level === "atom" ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>
      {entry.examples.map((ex) => {
        const ground = authoredGround(ex.props);
        const pad = ground ? (ground.light.includes("gradient") ? 0 : 8) : 16;
        return (
          <li key={ex.title} className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25">
            <div aria-hidden inert className={cn("pointer-events-none flex flex-1 select-none flex-col justify-center", groundClass(ground))} style={groundVars(ground)}>
              {tile ? (
                <LazyMount className="min-h-24 min-w-0" margin={600}>
                  <div style={{ padding: pad }}>
                    <Render name={entry.name} example={ex.title} />
                  </div>
                </LazyMount>
              ) : (
                <LazyMount className="w-full" margin={600}>
                  <Scaled virtualWidth={virtual} aspect={entry.level === "atom" ? 4 / 3 : 16 / 10} padding={pad} center={!entry.chart} fade={!ground}>
                    <Render name={entry.name} example={ex.title} overrides={entry.chart ? { ...QUIET, height: 220 } : undefined} />
                  </Scaled>
                </LazyMount>
              )}
            </div>
            <a href={`#${exampleId(ex.title)}`} className="block truncate border-t px-3 py-2 text-[12.5px] font-medium outline-none after:absolute after:inset-0 after:content-['']">
              {ex.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
