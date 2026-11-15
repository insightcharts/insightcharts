import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_COLOR, LOGO_PATH, LOGO_VIEWBOX } from "@/lib/brand";
import { allCards, OG_SIZE, type Card } from "@/lib/og";
import { site } from "@/lib/site";

// The social card of every page, as /og/<path>.png. All of them are drawn at build time.
// The pictures come from public/og/shots, which `pnpm --filter docs og` writes and which is
// committed: the build reads the files and does not start a browser. A card whose picture is
// missing is drawn with its title and description only.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => allCards().map((c) => ({ path: `${c.path}.png`.split("/") }));

const INK = "#fafafa";
const MUTED = "#a3a3a3";
const GROUND = "#0c0c0d";
const LINE = "rgba(255,255,255,0.12)";
/** The picture panel. The pictures are 792 by 550, the same shape. */
const PANEL = { width: 760, height: 528 };
const MARGIN = 48;
const COLUMN = OG_SIZE.width - PANEL.width - MARGIN * 2 - 36;

const font = (file: string) => readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans", file));
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600; style: "normal" }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([font("Geist-Regular.ttf"), font("Geist-Medium.ttf"), font("Geist-SemiBold.ttf")]).then(([regular, medium, semibold]) => [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
  ]));

async function shot(name: string): Promise<string | undefined> {
  const file = join(process.cwd(), "public/og/shots", `${name}.jpg`);
  if (!existsSync(file)) return undefined;
  return `data:image/jpeg;base64,${(await readFile(file)).toString("base64")}`;
}

function Brand({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, fontSize: size, fontWeight: 600, letterSpacing: -0.5 }}>
      <svg width={size * 1.4} height={size * 1.4} viewBox={LOGO_VIEWBOX}>
        <path d={LOGO_PATH} fill={LOGO_COLOR} />
      </svg>
      {site.name}
    </div>
  );
}

/** The largest size, from 30 to 58, at which the title's longest word fits the column and the title takes about four lines or fewer. */
function titleSize(title: string, width: number): number {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const byWord = width / (longest * 0.6);
  const byLength = (width * 4.5) / (title.length * 0.6);
  return Math.round(Math.max(30, Math.min(58, byWord, byLength)));
}

/** One picture with rounded corners and a hairline round it, so a dark picture still has an edge on the dark card. */
function Shot({ src, width, height, radius }: { src: string; width: number; height: number; radius: number }) {
  return (
    <div style={{ display: "flex", borderRadius: radius, boxShadow: `0 0 0 1px ${LINE}` }}>
      <img src={src} width={width} height={height} style={{ borderRadius: radius, objectFit: "cover" }} />
    </div>
  );
}

function Picture({ images }: { images: string[] }) {
  if (images.length < 4) return <Shot src={images[0]} {...PANEL} radius={20} />;
  const gap = 14;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap, width: PANEL.width, height: PANEL.height }}>
      {images.slice(0, 4).map((src, i) => (
        <Shot key={i} src={src} width={(PANEL.width - gap) / 2} height={(PANEL.height - gap) / 2} radius={14} />
      ))}
    </div>
  );
}

function Layout({ card, images }: { card: Card; images: string[] }) {
  const base = { width: "100%", height: "100%", display: "flex", background: GROUND, color: INK, fontFamily: "Geist" } as const;
  if (!images.length) {
    const size = card.title.length > 28 ? 68 : 84;
    return (
      <div style={{ ...base, flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
        <Brand size={34} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          {card.label ? <div style={{ fontSize: 24, fontWeight: 500, color: MUTED, marginBottom: 18 }}>{card.label}</div> : null}
          <div style={{ fontSize: size, fontWeight: 600, letterSpacing: -size * 0.03, lineHeight: 1.05 }}>{card.title}</div>
          {card.description ? <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.4, color: MUTED }}>{card.description}</div> : null}
        </div>
      </div>
    );
  }
  const size = titleSize(card.title, COLUMN);
  return (
    <div style={{ ...base, alignItems: "center", justifyContent: "space-between", padding: `0 ${MARGIN}px` }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: COLUMN, height: PANEL.height, padding: "6px 0" }}>
        <Brand />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {card.label ? <div style={{ display: "flex", fontSize: 20, fontWeight: 500, color: MUTED, border: `1px solid ${LINE}`, borderRadius: 999, padding: "5px 14px", marginBottom: 18 }}>{card.label}</div> : null}
          <div style={{ fontSize: size, fontWeight: 600, letterSpacing: -size * 0.028, lineHeight: 1.08 }}>{card.title}</div>
        </div>
      </div>
      <Picture images={images} />
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/").replace(/\.png$/, "");
  const card = allCards().find((c) => c.path === path);
  if (!card) return new Response("Not found", { status: 404 });
  const found = (await Promise.all(card.shots.map(shot))).filter((s): s is string => !!s);
  // A grid needs all four pictures. With fewer, the first one fills the panel.
  const images = card.shots.length >= 4 && found.length < 4 ? found.slice(0, 1) : found;
  return new ImageResponse(<Layout card={card} images={images} />, { ...OG_SIZE, fonts: await loadFonts() });
}
