"use client";

import { createElement, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { downloadBlob, useInsightStyles, withMeta, useColorMode, type ModeInput, InsightProvider, useTheme, canvasToBlob, rasterize, renderSlot, type Slot, chromeVars, type ThemeInput, useContainerWidth } from "insightcharts/core";
import { themes, posterBackgrounds, posterThemes, type PosterThemeName } from "insightcharts/themes";

/** One block of a poster: an optional small heading, the content, and an optional source line. */
export interface PosterPanel {
  /** Small heading above the content: one plain fact with its number, or a plain label. */
  title?: string;
  /** One line under the heading: the measure, unit, population and period. */
  subtitle?: string;
  /** What the panel shows: a component spec (`{ type: "treemap", ... }`) or rendered content. */
  content: Slot;
  /** Columns the panel covers, out of the poster's `columns`. Default: the full width. */
  span?: number;
  /** Rows the panel covers. Ignored when the poster reflows to fewer columns. Default 1. */
  rowSpan?: number;
  /** Where this panel's data comes from, shown under it as "Source: ...". */
  source?: string;
  /** Caveat shown after the source, e.g. "Illustrative data". */
  note?: string;
  /** Alignment of the heading, source line and any text content. Default `"left"`. */
  align?: "left" | "center" | "right";
  /** Where the content sits when the panel is taller than it needs (a neighbour is taller, or `rowSpan`). Default `"start"`. */
  valign?: "start" | "center" | "end";
  /** Let the content run to the poster's left and right edges where the panel touches them, ignoring the poster's padding. */
  bleed?: boolean;
  /** Stable id for the panel, set as `data-panel` so it can be targeted and linked. */
  id?: string;
}

export interface PosterProps {
  /** Small label above the title: the topic or series. */
  kicker?: string;
  /** The poster's one fact, as a plain sentence with its number. Set large and light. */
  title?: string;
  /** One or two lines under the title: the measure, population and period. */
  subtitle?: string;
  /** The poster's blocks, in reading order. */
  panels: PosterPanel[];
  /** Columns of the layout grid: a 12-unit grid (default) or a simple count such as 2 or 3. */
  columns?: number;
  /** Space between panels in px. Default 40 (28 on a phone). */
  gap?: number;
  /** Space between the poster's edge and its content in px. Default 56 (36 under 900px, 20 under 600px). */
  padding?: number;
  /** Widest the poster is drawn, as a CSS length. It is centred in wider containers. Default 1200. */
  maxWidth?: number | string;
  /** Fixed shape of the poster as width / height (`0.75`, `"3:4"`, `"16:9"`). The poster grows taller when its content needs more, and the ratio is dropped when it reflows to one column. */
  aspect?: number | string;
  /** A poster theme name (`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`), any other theme name, or a theme object. Default `"noir"`. */
  theme?: PosterThemeName | (string & {}) | ThemeInput;
  /** Colour mode of the poster and everything in it. Default `"light"`: a poster is one painted design and does not follow the page. Only `paper` has a different `"dark"` variant. */
  mode?: ModeInput;
  /** CSS background of the poster: a colour or a gradient. Default: the poster theme's ground. */
  background?: string;
  /** Lines between the masthead, the rows of panels and the footer. Default `"dotted"`. */
  rules?: "none" | "solid" | "dotted";
  /** Where the data comes from, shown in the footer. */
  sources?: string | string[];
  /** Caveat shown in the footer, e.g. "Illustrative data". */
  note?: string;
  /** Who made the poster, shown at the right of the footer. */
  credit?: string;
  /** Alignment of the masthead. Default `"left"`. */
  titleAlign?: "left" | "center";
  /** Heading level of the title; panel headings are one level down. Default 2. */
  level?: 1 | 2 | 3 | 4 | 5;
  /** Show a "Download PNG" control under the poster that saves the whole poster as one image. Default false. */
  download?: boolean;
  /** Width of the downloaded image in pixels. Default 2400. */
  exportWidth?: number;
  /** File name without extension. Defaults to a slug of the title. */
  filename?: string;
  /** Label of the download control. */
  downloadLabel?: string;
  /** Called with the PNG after a download. */
  onExport?: (blob: Blob) => void;
  className?: string;
  style?: CSSProperties;
}

const STYLE_ID = "insightcharts-poster-styles";
// Hover and focus states cannot be written inline. The control sits on the host page, outside the painted sheet.
const CSS = `
[data-slot=ic-poster-download]{transition:background-color .15s,opacity .15s}
[data-slot=ic-poster-download]:hover:not(:disabled){background:color-mix(in srgb,currentColor 9%,transparent)}
[data-slot=ic-poster-download]:focus-visible{outline:2px solid currentColor;outline-offset:2px}
[data-slot=ic-poster-download]:disabled{opacity:.5;cursor:default}
@media print{[data-slot=ic-poster-controls]{display:none!important}[data-slot=ic-poster]{break-inside:avoid}}
`;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "poster";

function ratioOf(aspect: number | string | undefined): number | undefined {
  if (aspect == null) return undefined;
  if (typeof aspect === "number") return aspect > 0 ? aspect : undefined;
  const [w, h] = aspect.split(/[:/]/).map(Number);
  const r = h ? w / h : w;
  return Number.isFinite(r) && r > 0 ? r : undefined;
}

interface Placed {
  row: number;
  col: number;
  span: number;
  rowSpan: number;
}

/**
 * Place panels the way CSS grid's sparse auto-flow does, so each panel's row and edges are
 * known: rules are drawn between rows, and a bleeding panel needs to know which poster edges
 * it touches. The result is written back as explicit grid lines, so the browser cannot disagree.
 */
function place(spans: { span: number; rowSpan: number }[], cols: number): Placed[] {
  const taken = new Set<string>();
  const free = (row: number, col: number, span: number, rowSpan: number) => {
    for (let r = row; r < row + rowSpan; r++) for (let c = col; c < col + span; c++) if (taken.has(`${r}:${c}`)) return false;
    return true;
  };
  let row = 0;
  let col = 0;
  return spans.map(({ span, rowSpan }) => {
    while (col + span > cols || !free(row, col, span, rowSpan)) {
      col += 1;
      if (col + span > cols) {
        col = 0;
        row += 1;
      }
    }
    for (let r = row; r < row + rowSpan; r++) for (let c = col; c < col + span; c++) taken.add(`${r}:${c}`);
    const at = { row, col, span, rowSpan };
    col += span;
    return at;
  });
}

/**
 * The sheet every infographic is composed on. It paints the ground, gives the poster theme
 * and one forced colour mode to everything inside, and lays out a masthead, a grid of panels
 * and a footer. Layout follows the poster's own width, so a multi-column poster becomes one
 * column on a phone with the panels in reading order.
 */
function PosterImpl({ kicker, title, subtitle, panels, columns = 12, gap, padding, maxWidth = 1200, aspect, theme = "noir", mode: modeInput = "light", background, rules = "dotted", sources, note, credit, titleAlign = "left", level = 2, download = false, exportWidth = 2400, filename, downloadLabel = "Download PNG", onExport, className, style }: PosterProps) {
  useInsightStyles();
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  // The sheet's outer width: the container, capped by `maxWidth`. Layout follows this, not the viewport.
  const [fit, w] = useContainerWidth<HTMLDivElement>();
  const sheet = useRef<HTMLElement>(null);
  const named = typeof theme === "string" ? theme : undefined;
  // A name picks a registered theme; an object is merged over the surrounding provider's theme.
  const resolved = useTheme(named ? (themes[named] ?? posterThemes.noir) : (theme as ThemeInput));
  const { mode } = useColorMode(ref, modeInput);
  const tokens = resolved[mode];
  const ground = background ?? (named && named in posterBackgrounds ? posterBackgrounds[named as PosterThemeName][mode] : tokens.surface);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const uid = useId();

  const phone = w < 600;
  const tablet = !phone && w < 760;
  const pad = padding ?? (phone ? 20 : w < 900 ? 36 : 56);
  const space = gap ?? (phone ? 28 : 40);
  const unitGrid = columns > 4;
  // Under 600px every panel takes the full width. From 600 to 760px a unit grid becomes two
  // columns (a panel of up to half the grid takes one of them) and a simple count is capped at two.
  const cols = phone ? 1 : tablet ? (unitGrid ? 2 : Math.min(2, columns)) : Math.max(1, Math.round(columns));
  const spans = panels.map((p) => {
    const asked = Math.max(1, Math.min(columns, Math.round(p.span ?? columns)));
    const span = phone ? 1 : tablet ? (unitGrid ? (asked <= columns / 2 ? 1 : 2) : Math.min(asked, cols)) : asked;
    return { span, rowSpan: cols === Math.max(1, Math.round(columns)) ? Math.max(1, Math.round(p.rowSpan ?? 1)) : 1 };
  });
  // In a reflowed layout a panel left alone at the end of a row takes the rest of it.
  if (tablet) {
    let used = 0;
    spans.forEach((s, i) => {
      if (used + s.span > cols) {
        spans[i - 1].span += cols - used;
        used = 0;
      }
      used = (used + s.span) % cols;
      if (i === spans.length - 1 && used) s.span += cols - used;
    });
  }
  const placed = place(spans, cols);
  // A rule runs above each row, across the columns where a panel starts in that row; it stops
  // at a panel that spans down from the row above.
  const rowCount = placed.reduce((n, at) => Math.max(n, at.row + at.rowSpan), 0);
  const ruleRuns: { row: number; from: number; to: number }[] = [];
  for (let r = 1; r < rowCount; r++) {
    let from = -1;
    for (let c = 0; c <= cols; c++) {
      const crossed = c === cols || placed.some((at) => at.row < r && at.row + at.rowSpan > r && c >= at.col && c < at.col + at.span);
      if (!crossed && from < 0) from = c;
      if (crossed && from >= 0) {
        ruleRuns.push({ row: r, from, to: c });
        from = -1;
      }
    }
  }
  const ratio = phone ? undefined : ratioOf(aspect);

  const rule = rules === "none" ? undefined : rules === "solid" ? "1px solid var(--_ic-axis)" : "2px dotted var(--_ic-axis)";
  const titleSize = phone ? Math.max(30, Math.min(40, w * 0.098)) : Math.max(40, Math.min(76, w * 0.058));
  const hasMasthead = !!(kicker || title || subtitle);
  const sourceList = sources == null ? [] : Array.isArray(sources) ? sources : [sources];
  const hasFooter = sourceList.length > 0 || !!note || !!credit;
  const text: CSSProperties = { margin: 0, overflowWrap: "break-word" };
  const small: CSSProperties = { ...text, fontSize: 12, lineHeight: 1.45, color: "var(--_ic-muted)" };

  const save = async () => {
    const node = sheet.current;
    if (!node || state === "busy") return;
    setState("busy");
    try {
      const blob = await canvasToBlob(await rasterize(node, exportWidth));
      downloadBlob(blob, `${filename ?? slug(title ?? "poster")}.png`);
      onExport?.(blob);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div ref={ref} data-slot="ic-poster-frame" className={className} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", justifyItems: "center", gap: 12, width: "100%", minWidth: 0, ...style }}>
      {/* Charts mount at once when the poster can be downloaded, so the image is never missing one below the fold. */}
      <InsightProvider theme={resolved} mode={mode} lazy={download ? false : undefined}>
        <div ref={fit} data-slot="ic-poster-fit" style={{ width: "100%", maxWidth, minWidth: 0 }}>
        <article
          ref={sheet}
          data-slot="ic-poster"
          data-theme-name={resolved.name}
          data-ic-mode={mode}
          data-layout={phone ? "phone" : tablet ? "tablet" : "wide"}
          // The class tells anything inside that detects the page's mode which one this sheet is.
          className={mode}
          aria-labelledby={title ? `${uid}-title` : undefined}
          style={{
            ...(chromeVars(tokens) as CSSProperties),
            boxSizing: "border-box",
            width: "100%",
            minWidth: 0,
            aspectRatio: ratio,
            padding: pad,
            display: "flex",
            flexDirection: "column",
            gap: space,
            background: ground,
            color: "var(--_ic-ink)",
            fontFamily: "var(--_ic-font)",
            fontSize: 14,
            lineHeight: 1.45,
            textAlign: "left",
            borderRadius: phone ? 10 : 14,
            // `clip`, not `hidden`: with a fixed aspect the sheet must still grow to fit its content.
            overflow: "clip",
            colorScheme: mode,
          }}
        >
          {hasMasthead ? (
            <header data-slot="ic-poster-masthead" style={{ flex: "none", minWidth: 0, textAlign: titleAlign, display: "grid", justifyItems: titleAlign === "center" ? "center" : "start", gap: phone ? 12 : 16 }}>
              {kicker ? (
                <p data-slot="ic-poster-kicker" style={{ ...text, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--_ic-ink-2)" }}>
                  <span aria-hidden data-slot="ic-poster-kicker-mark" style={{ display: "block", flex: "none", width: 22, height: 4, borderRadius: 2, background: "var(--_ic-accent)" }} />
                  {kicker}
                </p>
              ) : null}
              {title ? createElement(`h${level}`, { id: `${uid}-title`, "data-slot": "ic-poster-title", style: { ...text, fontFamily: "var(--_ic-font-display)", fontSize: titleSize, lineHeight: 1.04, fontWeight: 300, letterSpacing: "-0.022em", color: "var(--_ic-ink)", maxWidth: "19em", textWrap: "balance" } }, title) : null}
              {subtitle ? (
                <p data-slot="ic-poster-subtitle" style={{ ...text, fontSize: phone ? 15 : 17, lineHeight: 1.45, color: "var(--_ic-ink-2)", maxWidth: "62ch", textWrap: "pretty" }}>
                  {subtitle}
                </p>
              ) : null}
            </header>
          ) : null}

          <div data-slot="ic-poster-grid" data-columns={cols} style={{ flex: "1 1 auto", minWidth: 0, display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: space, borderTop: hasMasthead ? rule : undefined, paddingTop: hasMasthead && rule ? space : 0 }}>
            {/* Rules are zero-height grid items lifted into the middle of the row gap. */}
            {rule ? ruleRuns.map((run) => <span key={`${run.row}:${run.from}`} aria-hidden data-slot="ic-poster-rule" style={{ gridColumn: `${run.from + 1} / ${run.to + 1}`, gridRow: run.row + 1, alignSelf: "start", height: 0, marginTop: -space / 2 - 1, borderTop: rule, pointerEvents: "none" }} />) : null}
            {panels.map((panel, i) => {
              const at = placed[i];
              const left = at.col === 0;
              const right = at.col + at.span === cols;
              const titleId = panel.title ? `${uid}-p${i}` : undefined;
              const align = panel.align ?? "left";
              return (
                <figure
                  key={panel.id ?? i}
                  data-slot="ic-poster-panel"
                  data-panel={panel.id}
                  data-bleed={panel.bleed ? "" : undefined}
                  aria-labelledby={titleId}
                  style={{ margin: 0, minWidth: 0, gridColumn: `${at.col + 1} / span ${at.span}`, gridRow: `${at.row + 1} / span ${at.rowSpan}`, display: "flex", flexDirection: "column", gap: 14, textAlign: align }}
                >
                  {panel.title || panel.subtitle ? (
                    <div data-slot="ic-poster-panel-header" style={{ flex: "none", minWidth: 0, display: "grid", gap: 4 }}>
                      {panel.title ? createElement(`h${Math.min(6, level + 1)}`, { id: titleId, "data-slot": "ic-poster-panel-title", style: { ...text, fontFamily: "var(--_ic-font-display)", fontSize: phone ? 19 : 21, lineHeight: 1.2, fontWeight: 400, letterSpacing: "-0.012em", color: "var(--_ic-ink)", textWrap: "balance" } }, panel.title) : null}
                      {panel.subtitle ? (
                        <p data-slot="ic-poster-panel-subtitle" style={{ ...text, fontSize: 13, lineHeight: 1.45, color: "var(--_ic-ink-2)", textWrap: "pretty" }}>
                          {panel.subtitle}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <div data-slot="ic-poster-panel-content" style={{ flex: "1 1 auto", minWidth: 0, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", alignContent: panel.valign ?? "start", marginLeft: panel.bleed && left ? -pad : undefined, marginRight: panel.bleed && right ? -pad : undefined }}>
                    {renderSlot(panel.content)}
                  </div>
                  {panel.source || panel.note ? (
                    <figcaption data-slot="ic-poster-panel-source" style={{ ...small, flex: "none" }}>
                      {panel.source ? `Source: ${panel.source}` : null}
                      {panel.source && panel.note ? " · " : null}
                      {panel.note}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>

          {hasFooter ? (
            <footer data-slot="ic-poster-footer" style={{ flex: "none", minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "6px 24px", borderTop: rule, paddingTop: rule ? Math.round(space / 2) : 0 }}>
              <p data-slot="ic-poster-sources" style={{ ...small, flex: "1 1 18rem", minWidth: 0 }}>
                {sourceList.length ? `${sourceList.length > 1 ? "Sources" : "Source"}: ${sourceList.join("; ")}` : null}
                {sourceList.length && note ? " · " : null}
                {note}
              </p>
              {credit ? (
                <p data-slot="ic-poster-credit" style={{ ...small, flex: "none", fontWeight: 600, letterSpacing: "0.04em", color: "var(--_ic-ink-2)" }}>
                  {credit}
                </p>
              ) : null}
            </footer>
          ) : null}
        </article>
        </div>
      </InsightProvider>
      {download ? (
        <div data-slot="ic-poster-controls" data-ic-export-ignore="" style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 32, font: "inherit", fontSize: 13 }}>
          <button type="button" data-slot="ic-poster-download" onClick={save} disabled={state === "busy"} style={{ appearance: "none", font: "inherit", cursor: "pointer", margin: 0, display: "inline-flex", alignItems: "center", gap: 6, minHeight: 32, padding: "0 12px", borderRadius: 8, border: "1px solid color-mix(in srgb, currentColor 30%, transparent)", background: "transparent", color: "inherit" }}>
            <svg aria-hidden viewBox="0 0 16 16" width={14} height={14} style={{ display: "block" }}>
              <path d="M8 2.5v7.5m0 0L5 7m3 3 3-3M3 12.5h10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {downloadLabel}
          </button>
          <span role="status" aria-live="polite" data-slot="ic-poster-status" style={{ opacity: 0.7 }}>
            {state === "busy" ? "Preparing image…" : state === "done" ? "Saved" : state === "error" ? "Could not create the image" : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
}

// Example data. Riverton, Norland, Port Alba and Hollin Valley are invented places; every figure is illustrative.
const districts = [
  { district: "Old Town", bikes: 1150 },
  { district: "Harbour", bikes: 820 },
  { district: "University", bikes: 640 },
  { district: "Northside", bikes: 390 },
];
const weekdays = [
  { day: "Mon", trips: 610 },
  { day: "Tue", trips: 655 },
  { day: "Wed", trips: 670 },
  { day: "Thu", trips: 662 },
  { day: "Fri", trips: 640 },
  { day: "Sat", trips: 520 },
  { day: "Sun", trips: 443 },
];
const purposes = [
  { purpose: "Commuting", share: 46 },
  { purpose: "Leisure", share: 27 },
  { purpose: "Errands", share: 18 },
  { purpose: "Other", share: 9 },
];
export const Poster = withMeta(PosterImpl, {
  name: "poster",
  component: "Poster",
  title: "Poster",
  level: "molecule",
  category: "poster",
  description: "The sheet an infographic is composed on. It paints a full-bleed ground from a poster theme, forces one theme and colour mode on everything inside, and lays out a masthead, a grid of panels and a footer. It can save the whole sheet as one PNG.",
  whenToUse: "Use it as the outer frame of any infographic: one dominant graphic with a few supporting panels, on a painted ground. Give it a poster theme (`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`) and put a chart or figure spec in each panel. Put the one fact in `title` and keep panel headings short. It reflows to one column under 600px.",
  avoid: "Long reading text or more than about six panels (use `report-page` or `visual-essay`). A single fact at a fixed social size (use `social-card`). Charts that need axes, gridlines and dense labels to be read, because a poster ground suits large flat marks with their values printed on them.",
  composes: ["big-number", "pictogram-chart", "bar-chart", "donut-chart", "treemap", "waffle-chart", "segmented-bar", "icon-stat"],
  props: [
    { name: "title", type: "string", description: "The poster's one fact, as a plain sentence with its number. Set large and light in the theme's display face." },
    { name: "kicker", type: "string", description: "Small label above the title: the topic or series." },
    { name: "subtitle", type: "string", description: "One or two lines under the title: the measure, population and period." },
    { name: "panels", type: "PosterPanel[]", required: true, description: "The blocks, in reading order. Each is `{ content, title?, subtitle?, span?, rowSpan?, source?, note?, align?, valign?, bleed?, id? }`. `content` is a component spec or rendered content. `span` is in units of `columns` (default: full width). `bleed` runs the content to the poster's left and right edges." },
    { name: "columns", type: "number", default: "12", description: "Columns of the layout grid: a 12-unit grid, or a simple count such as 2 or 3. Under 600px every panel is full width; from 600 to 760px the grid has two columns." },
    { name: "gap", type: "number", description: "Space between panels in px. Default 40 (28 under 600px)." },
    { name: "padding", type: "number", description: "Space between the poster's edge and its content in px. Default 56 (36 under 900px, 20 under 600px)." },
    { name: "maxWidth", type: "number | string", default: "1200", description: "Widest the poster is drawn. It is centred in wider containers." },
    { name: "aspect", type: 'number | string', description: 'Fixed shape as width / height: `0.75`, `"3:4"`, `"16:9"`. The poster still grows when its content needs more height, and the ratio is dropped under 600px.' },
    { name: "theme", type: "PosterThemeName | string | ThemeInput", default: '"noir"', description: "A poster theme name, any other theme name, or a theme object. It is passed on to everything inside." },
    { name: "mode", type: '"light" | "dark" | "auto" | "system"', default: '"light"', description: "Colour mode of the poster and everything in it. A poster does not follow the page unless you set `auto`. Only `paper` has a different dark variant." },
    { name: "background", type: "string", description: "CSS background of the sheet, a colour or a gradient. Default: the poster theme's ground. Keep it close to the theme's `surface`, which charts use for the gaps between marks." },
    { name: "rules", type: '"none" | "solid" | "dotted"', default: '"dotted"', description: "Lines under the masthead, between rows of panels and above the footer." },
    { name: "sources", type: "string | string[]", description: "Where the data comes from, shown in the footer." },
    { name: "note", type: "string", description: 'Caveat shown in the footer, e.g. "Illustrative data".' },
    { name: "credit", type: "string", description: "Who made the poster, shown at the right of the footer." },
    { name: "titleAlign", type: '"left" | "center"', default: '"left"', description: "Alignment of the masthead." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5", default: "2", description: "Heading level of the title. Panel headings are one level down." },
    { name: "download", type: "boolean", default: "false", description: 'Show a "Download PNG" control under the poster. The image is the whole sheet, drawn from the DOM onto a canvas, without the control.' },
    { name: "exportWidth", type: "number", default: "2400", description: "Width of the downloaded PNG in pixels." },
    { name: "filename", type: "string", description: "File name without extension. Defaults to a slug of the title." },
    { name: "downloadLabel", type: "string", default: '"Download PNG"', description: "Label of the download control." },
    { name: "onExport", type: "(blob: Blob) => void", description: "Called with the PNG after a download." },
  ],
  example: {
    type: "poster",
    theme: "noir",
    kicker: "Transport",
    title: "Riverton's bike-share scheme carried 4.2 million trips in 2025",
    subtitle: "Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025.",
    panels: [
      { span: 4, valign: "center", content: { type: "big-number", size: "hero", value: "4.2 million", label: "Trips in 2025", context: "3.4 million in 2024" } },
      {
        span: 8,
        title: "Old Town had 1,150 of the scheme's 3,000 bikes",
        content: { type: "pictogram-chart", data: districts, name: "district", value: "bikes", unit: 50, unitLabel: "50 bikes", icon: "bike", highlight: "Old Town" },
        source: "Riverton Transport Office",
      },
      {
        span: 7,
        title: "670,000 trips were made on Wednesdays in 2025",
        subtitle: "Trips by day of the week, thousands, 2025",
        content: { type: "bar-chart", data: weekdays, x: "day", y: "trips", orientation: "vertical", sort: "none", highlight: "Wed", format: "{value}k", height: 260 },
      },
      {
        span: 5,
        title: "46% of trips were commutes",
        subtitle: "Share of trips by stated purpose, rider survey, 2025",
        content: { type: "donut-chart", data: purposes, name: "purpose", value: "share", format: "{value}%", centerValue: "46%", centerLabel: "Commuting", height: 260 },
      },
    ],
    sources: ["Riverton Transport Office", "Riverton rider survey 2025"],
    note: "Riverton is an invented city. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
