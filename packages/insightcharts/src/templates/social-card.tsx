import { createElement, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { downloadBlob } from "../core/export";
import { withMeta } from "../core/meta";
import { themeGround } from "../core/named-themes";
import { useTheme } from "../core/provider";
import { renderSlot, type Slot } from "../core/spec";
import { chromeVars } from "../core/theme";
import { Provide } from "../molecules/_shared";
import { canvasToBlob, rasterize } from "../core/raster";
import { button, INVERSE_HOST, useTemplate, withDefaults, type TemplateProps } from "./_shared";

export type SocialCardAspect = "1:1" | "4:5" | "16:9" | "9:16";

export interface SocialCardProps extends Omit<TemplateProps, "maxWidth"> {
  /** The card's one fact, as a plain sentence with the number in it. */
  title: string;
  /** Small label above the title: the topic or series. */
  kicker?: string;
  /** One short line under the title: the measure, or the number in words. */
  deck?: string;
  /** The one exhibit. A chart spec is given the height that is left in the card; do not give it a `title`. */
  exhibit?: Slot;
  /** Where the data comes from, shown as "Source: ...". */
  source?: string;
  /** Who made it: a name, handle or publication. */
  credit?: string;
  /** Caveat shown after the source, e.g. "Illustrative data". */
  note?: string;
  /** Shape of the card. Default `"1:1"`. */
  aspect?: SocialCardAspect;
  /** `"inverse"` paints the card in the opposite colour mode, for a dark card on a light page. */
  tone?: "surface" | "inverse";
  /** Show the "Download PNG" button under the card. Default true. */
  downloadable?: boolean;
  /** Width of the downloaded image in pixels. Default 1080 (1920 for 16:9). */
  exportWidth?: number;
  /** File name without extension. Defaults to a slug of the title. */
  filename?: string;
  /** Label of the download button. */
  downloadLabel?: string;
  /** Widest the card is drawn on screen. Default 540px (720px for 16:9, 400px for 9:16). */
  maxWidth?: number;
  /** Called with the PNG after a download. */
  onExport?: (blob: Blob) => void;
}

const RATIO: Record<SocialCardAspect, number> = { "1:1": 1, "4:5": 4 / 5, "16:9": 16 / 9, "9:16": 9 / 16 };
const WIDTH: Record<SocialCardAspect, number> = { "1:1": 540, "4:5": 520, "16:9": 720, "9:16": 400 };
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "card";

/**
 * One fact at a fixed shape, for sharing: kicker, headline, one exhibit, source and credit,
 * painted on the theme surface. Type and spacing scale with the card, so it looks the same
 * at any size and in the downloaded image.
 */
function SocialCardImpl({ title, kicker, deck, exhibit, source, credit, note, aspect = "1:1", tone = "surface", downloadable = true, exportWidth, filename, downloadLabel = "Download PNG", maxWidth, level = 2, onExport, className, style, ...rest }: SocialCardProps) {
  // A named theme with its own ground paints the card, not the frame around it: the frame and
  // the download control stay in the host page's theme, so they stay legible on the host page.
  const ownGround = typeof rest.theme === "string" && themeGround(rest.theme, "light") !== null;
  const { ref, width, mode, root } = useTemplate(ownGround ? { mode: rest.mode, frame: false } : { ...rest, frame: false });
  const theme = useTheme(rest.theme);
  const cardMode = tone === "inverse" ? (mode === "dark" ? "light" : "dark") : mode;
  const ground = (ownGround ? themeGround(rest.theme, cardMode) : null) ?? "var(--_ic-surface)";
  const card = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [plotHeight, setPlotHeight] = useState(0);
  // Height of the exhibit's own chrome (subtitle, legend, source line) around its plot.
  const [chrome, setChrome] = useState(0);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const ratio = RATIO[aspect] ?? 1;
  // The card is always laid out at its design size and scaled down to fit, like an image:
  // the composition, the line breaks and the chart are the same on a phone as in the download.
  const w = maxWidth ?? WIDTH[aspect] ?? 540;
  const h = w / ratio;
  const scale = Math.min(1, Math.max(0.2, width / w));
  // One unit is 1% of the card's short side: type and spacing are multiples of it.
  const u = Math.min(w, h) / 100;
  const pad = Math.round(u * 6.5);
  const wide = ratio > 1.3;

  useEffect(() => {
    const node = plot.current;
    if (!node) return;
    const read = () => {
      setPlotHeight((prev) => (Math.abs(prev - node.clientHeight) < 1 ? prev : node.clientHeight));
      const chart = inner.current?.querySelector<HTMLElement>("[data-slot=ic-chart],[data-slot=ic-skeleton],[data-slot=ic-state]");
      if (!chart || !inner.current) return;
      const next = Math.max(0, inner.current.offsetHeight - chart.offsetHeight);
      setChrome((prev) => (Math.abs(prev - next) < 1 ? prev : next));
    };
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(node);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  const download = async () => {
    if (!card.current || state === "busy") return;
    setState("busy");
    try {
      // Text is measured from the live layout, so paint it unscaled.
      const node = card.current;
      const transform = node.style.transform;
      node.style.transform = "none";
      let blob: Blob;
      try {
        blob = await canvasToBlob(await rasterize(node, exportWidth ?? (aspect === "16:9" ? 1920 : 1080)));
      } finally {
        node.style.transform = transform;
      }
      downloadBlob(blob, `${filename ?? slug(title)}.png`);
      onExport?.(blob);
      setState("done");
    } catch {
      setState("error");
    }
  };

  const text: CSSProperties = { margin: 0, overflowWrap: "break-word" };
  return (
    <div ref={ref as RefObject<HTMLDivElement>} data-slot="ic-social-card-frame" data-ic-mode={mode} className={className} style={{ ...root, display: "grid", justifyItems: "center", gap: 12, width: "100%", ...style }}>
      <Provide theme={rest.theme} mode={cardMode}>
        <div data-slot="ic-social-card-fit" style={{ width: w * scale, height: h * scale, minWidth: 0 }}>
        <article
          ref={card}
          data-slot="ic-social-card"
          data-aspect={aspect}
          data-ic-mode={cardMode}
          className={tone === "inverse" ? cardMode : undefined}
          style={{
            ...(tone === "inverse" ? INVERSE_HOST : null),
            ...(chromeVars(theme[cardMode]) as CSSProperties),
            boxSizing: "border-box",
            width: w,
            height: h,
            padding: pad,
            display: "flex",
            flexDirection: "column",
            background: ground,
            color: "var(--_ic-ink)",
            fontFamily: "var(--_ic-font)",
            border: "1px solid var(--_ic-grid)",
            borderRadius: 12,
            overflow: "hidden",
            colorScheme: cardMode,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: "0 0",
          }}
        >
          <header data-slot="ic-social-card-header" style={{ flex: "none", minWidth: 0 }}>
            {kicker ? (
              <p data-slot="ic-social-card-kicker" style={{ ...text, fontSize: Math.max(11, u * 2.7), lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.01em", color: "var(--_ic-accent)", marginBottom: u * 1.6 }}>
                {kicker}
              </p>
            ) : null}
            {createElement(`h${level}`, { "data-slot": "ic-social-card-title", style: { ...text, fontFamily: "var(--_ic-font-display)", fontSize: Math.max(18, u * (wide ? 7.4 : 6.6)), lineHeight: 1.1, fontWeight: 680, letterSpacing: "-0.025em", color: "var(--_ic-ink)", maxWidth: wide ? "22em" : undefined } }, title)}
            {deck ? (
              <p data-slot="ic-social-card-deck" style={{ ...text, marginTop: u * 2, fontSize: Math.max(12, u * 3.1), lineHeight: 1.35, color: "var(--_ic-ink-2)" }}>
                {deck}
              </p>
            ) : null}
          </header>
          <div ref={plot} data-slot="ic-social-card-exhibit" style={{ flex: "1 1 0", minHeight: 0, minWidth: 0, margin: `${u * 3.5}px 0 ${u * 3}px`, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
            {/* Charts need a pixel height; they get whatever the header and footer leave. */}
            <div ref={inner} style={{ minWidth: 0 }}>{exhibit != null && plotHeight > 0 ? renderSlot(withDefaults(exhibit, { height: Math.max(80, Math.floor(plotHeight - chrome)), lazy: false })) : null}</div>
          </div>
          {source || credit || note ? (
            <footer data-slot="ic-social-card-footer" style={{ flex: "none", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: u * 3, borderTop: "1px solid var(--_ic-grid)", paddingTop: u * 2.2, fontSize: Math.max(10, u * 2.2), lineHeight: 1.35, color: "var(--_ic-muted)" }}>
              <span data-slot="ic-social-card-source" style={{ minWidth: 0 }}>
                {source ? `Source: ${source}` : null}
                {source && note ? " · " : null}
                {note}
              </span>
              {credit ? (
                <span data-slot="ic-social-card-credit" style={{ flex: "none", fontWeight: 600, color: "var(--_ic-ink-2)" }}>
                  {credit}
                </span>
              ) : null}
            </footer>
          ) : null}
        </article>
        </div>
      </Provide>
      {downloadable ? (
        <div data-ic-print="hide" style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 32 }}>
          <button type="button" data-slot="ic-button" onClick={download} disabled={state === "busy"} style={button}>
            <svg aria-hidden viewBox="0 0 16 16" width={14} height={14} style={{ display: "block" }}>
              <path d="M8 2.5v7.5m0 0L5 7m3 3 3-3M3 12.5h10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {downloadLabel}
          </button>
          <span role="status" aria-live="polite" data-slot="ic-social-card-status" style={{ fontSize: "0.8125rem", color: "var(--_ic-muted)" }}>
            {state === "busy" ? "Preparing image…" : state === "done" ? "Saved" : state === "error" ? "Could not create the image" : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
}

const anomaly = [
  [2015, 1.17],
  [2016, 1.31],
  [2017, 1.22],
  [2018, 1.14],
  [2019, 1.26],
  [2020, 1.31],
  [2021, 1.14],
  [2022, 1.18],
  [2023, 1.48],
  [2024, 1.6],
].map(([year, c]) => ({ year: String(year), c }));
const measles = [
  { year: "2019", cases: 106 },
  { year: "2020", cases: 12 },
  { year: "2021", cases: 0.2 },
  { year: "2022", cases: 0.9 },
  { year: "2023", cases: 61 },
  { year: "2024", cases: 127 },
];

const windSolar = [
  [2015, 3.5, 1.1],
  [2016, 3.8, 1.4],
  [2017, 4.4, 1.8],
  [2018, 4.8, 2.2],
  [2019, 5.3, 2.7],
  [2020, 5.9, 3.2],
  [2021, 6.5, 3.7],
  [2022, 7.3, 4.6],
  [2023, 7.8, 5.5],
  [2024, 8.1, 6.9],
].map(([year, Wind, Solar]) => ({ year: String(year), Wind, Solar }));

export const SocialCard = withMeta(SocialCardImpl, {
  name: "social-card",
  component: "SocialCard",
  title: "Social card",
  level: "template",
  category: "layout",
  description: "A graphic that states one fact, at a fixed aspect ratio (1:1, 4:5, 16:9 or 9:16). It has a kicker, a headline, one exhibit, a source and a credit, painted on the theme surface. A button downloads the whole card as a PNG.",
  whenToUse: "Use it for one finding that will be shared in a feed, a slide or a chat thread with no text around it. State the fact with its number in the headline. Use one simple exhibit, such as one highlighted bar, one line or one number. Put the source and your name on the card, because it will be shared without the page. Use 1:1 or 4:5 for feeds, 16:9 for slides and link previews, 9:16 for stories.",
  avoid: "More than one fact or more than one exhibit (use `story-deck` for a sequence, `executive-brief` for a page). Charts that need a legend, small labels or hovering to read, because a shared image is not interactive. An exhibit with its own `title`, because the card's headline is the title.",
  composes: ["bar-chart", "big-number", "waffle-chart", "area-chart", "source-note"],
  props: [
    { name: "title", type: "string", required: true, description: "The card's one fact, as a plain sentence with the number in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One short line under the title: the measure, or the number in words." },
    { name: "exhibit", type: "Slot", description: "The one exhibit. A chart spec is given the height left in the card (any `height` you set wins); leave out its `title`." },
    { name: "source", type: "string", description: 'Where the data comes from, shown as "Source: ...".' },
    { name: "note", type: "string", description: 'Caveat shown after the source, e.g. "Illustrative data".' },
    { name: "credit", type: "string", description: "Who made it: a name, handle or publication." },
    { name: "aspect", type: '"1:1" | "4:5" | "16:9" | "9:16"', default: '"1:1"', description: "Shape of the card." },
    { name: "tone", type: '"surface" | "inverse"', default: '"surface"', description: "`inverse` paints the card in the opposite colour mode." },
    { name: "downloadable", type: "boolean", default: "true", description: "Show the download button under the card. The image is the whole card, drawn from the DOM onto a canvas." },
    { name: "exportWidth", type: "number", default: "1080", description: "Width of the downloaded PNG in pixels (1920 for 16:9)." },
    { name: "filename", type: "string", description: "File name without extension. Defaults to a slug of the title." },
    { name: "downloadLabel", type: "string", default: '"Download PNG"', description: "Label of the download button." },
    { name: "maxWidth", type: "number", description: "Widest the card is drawn on screen, in px. Default 540 (520 for 4:5, 720 for 16:9, 400 for 9:16). In narrower containers the whole card is scaled down, like an image, so its composition never changes." },
    { name: "onExport", type: "(blob: Blob) => void", description: "Called with the PNG after a download." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", description: "Heading level of the title." },
    { name: "theme", type: "ThemeInput", description: 'A built-in theme name (`"magenta"`, `"noir"`, `"editorial"`...) or a theme object, passed on to the exhibit. A named theme with its own surface paints the card in that surface; the download button stays in the page\'s theme.' },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "social-card",
    theme: "magenta",
    aspect: "1:1",
    kicker: "Climate",
    title: "The world was 1.6°C warmer in 2024 than in 1850 to 1900",
    exhibit: {
      type: "bar-chart",
      data: anomaly,
      x: "year",
      y: "c",
      orientation: "vertical",
      sort: "none",
      highlight: "2024",
      format: "{value}°C",
      labels: false,
      subtitle: "Global average temperature above the 1850 to 1900 level",
      annotations: [{ type: "line", axis: "y", value: 1.5, label: "Paris Agreement limit" }],
    },
    source: "Copernicus Climate Change Service, ERA5 (rounded)",
    note: "Figures are approximate, for illustration",
    credit: "InsightCharts",
  },
});

export const examples = {
  "16:9, public health, noir theme": {
    theme: "noir",
    aspect: "16:9",
    kicker: "Public health",
    title: "Reported measles cases in Europe rose from 61,000 in 2023 to 127,000 in 2024",
    exhibit: { type: "bar-chart", data: measles, x: "year", y: "cases", orientation: "vertical", sort: "none", highlight: "2024", format: "{value}k", subtitle: "Reported measles cases, WHO European Region, thousands" },
    source: "WHO and UNICEF (rounded)",
    note: "Figures are approximate, for illustration",
    credit: "Data desk",
  },
  "9:16, transport, a proportion instead of a chart": {
    theme: "ocean",
    aspect: "9:16",
    kicker: "Transport",
    title: "58% of car journeys in England are under five miles",
    deck: "Each square is 1% of car journeys.",
    exhibit: { type: "waffle-chart", data: [{ group: "Under five miles", share: 58 }], name: "group", value: "share", total: 100, restLabel: "Five miles or more", legend: false, aspect: 1 },
    source: "National Travel Survey",
    note: "Rounded, approximate figures for illustration",
    credit: "@datadesk",
  },
  "1:1, energy, two stacked series": {
    theme: "forest",
    aspect: "1:1",
    kicker: "Energy",
    title: "Wind and solar generated 15% of the world's electricity in 2024",
    exhibit: { type: "area-chart", data: windSolar, x: "year", y: ["Wind", "Solar"], stack: true, format: "{value}%", subtitle: "Share of global electricity generation, %" },
    source: "Ember, Global Electricity Review (rounded)",
    note: "Figures are approximate, for illustration",
    credit: "InsightCharts",
  },
  "4:5, personal finance, a single number, inverse tone": {
    aspect: "4:5",
    tone: "inverse",
    kicker: "Money",
    title: "Starting to save at 35 instead of 25 leaves $296,000 less at 65",
    exhibit: { type: "big-number", size: "hero", variant: "tinted", value: "$296,000", label: "Less at 65 if you start at 35 instead of 25", context: "Saving $300 a month at a 6% real return" },
    source: "Author's calculation",
    note: "Illustrative",
    credit: "InsightCharts",
    downloadable: false,
  },
};
