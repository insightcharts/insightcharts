import type { CSSProperties } from "react";
import { useRef } from "react";
import { useInsightStyles } from "../core/figure";
import { withMeta } from "../core/meta";
import { useColorMode, type ModeInput } from "../core/mode";
import { frameStyle, useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface LegendKeyItem {
  label: string;
  /** Explicit colour. Without it the item takes the theme's categorical colour at `index`, or at its position. */
  color?: string;
  /** Position in the theme's categorical order, when it differs from the item's position in this list. */
  index?: number;
  /** Swatch shape: match the mark it explains. */
  shape?: "square" | "line" | "dot";
  /** A context (de-emphasised) entry, drawn in the theme's context grey. */
  muted?: boolean;
}

export interface LegendKeyProps {
  /** `"categorical"` lists swatches; `"sequential"` and `"diverging"` draw a colour ramp with end labels. */
  scale?: "categorical" | "sequential" | "diverging";
  /** Categorical entries: labels, or objects for explicit colours and shapes. */
  items?: (string | LegendKeyItem)[];
  /** Ramp end labels: `[low, high]`, or `[low, middle, high]`. */
  labels?: string[];
  /** Ramp colours, low to high. Defaults to the theme's sequential or diverging ramp. */
  colors?: string[];
  /** Draw the ramp as discrete steps (for binned scales) instead of a continuous gradient. */
  stepped?: boolean;
  /** What the key encodes, e.g. "Share of electricity from renewables". */
  title?: string;
  /** Default swatch shape for categorical items. */
  shape?: "square" | "line" | "dot";
  /** Lay categorical items out in a wrapping row or a column. */
  orientation?: "horizontal" | "vertical";
  /** Ramp width in px. It never exceeds the container. Default 240. */
  width?: number;
  align?: "left" | "center";
  /** A built-in theme name or a theme object. A named theme paints its own background behind the block. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the block. Default: on for a named theme with its own surface. */
  frame?: boolean;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

// A faint inner edge, so a ramp's lightest (or neutral-midpoint) step does not dissolve into the page.
const EDGE = "inset 0 0 0 1px color-mix(in srgb, var(--_ic-ink) 9%, transparent)";

function Swatch({ color, shape }: { color: string; shape: "square" | "line" | "dot" }) {
  const base: CSSProperties = { background: color, flex: "none", display: "inline-block" };
  if (shape === "line") return <span data-slot="ic-legend-key-swatch" aria-hidden style={{ ...base, width: 16, height: 2, borderRadius: 1 }} />;
  if (shape === "dot") return <span data-slot="ic-legend-key-swatch" aria-hidden style={{ ...base, width: 8, height: 8, borderRadius: 999 }} />;
  return <span data-slot="ic-legend-key-swatch" aria-hidden style={{ ...base, width: 10, height: 10, borderRadius: 2 }} />;
}

/**
 * A standalone colour key, for when several charts share one encoding and repeating the
 * legend on each would be noise.
 */
function LegendKeyImpl({ scale, items, labels, colors, stepped = false, title, shape = "square", orientation = "horizontal", width = 240, align = "left", className, style, ...rest }: LegendKeyProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const tokens = theme[mode];
  const kind = scale ?? (items?.length ? "categorical" : "sequential");
  const center = align === "center";

  let body;
  if (kind === "categorical") {
    const list = (items ?? []).map((it) => (typeof it === "string" ? { label: it } : it));
    body = (
      <ul data-slot="ic-legend-key-items" aria-label={title ? undefined : "Legend"} style={{ display: "flex", flexDirection: orientation === "vertical" ? "column" : "row", flexWrap: "wrap", justifyContent: center && orientation !== "vertical" ? "center" : undefined, alignItems: orientation === "vertical" && center ? "center" : undefined, gap: orientation === "vertical" ? "6px" : "6px 18px", margin: 0, padding: 0, listStyle: "none" }}>
        {list.map((item, i) => {
          // Identity colours are never cycled: past the end of the palette an entry falls back to context grey.
          const color = item.color ?? (item.muted ? tokens.context : tokens.categorical[item.index ?? i] ?? tokens.context);
          return (
            <li key={`${item.label}-${i}`} data-slot="ic-legend-key-item" style={{ display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0, color: item.muted ? "var(--_ic-muted)" : "var(--_ic-ink-2)" }}>
              <Swatch color={color} shape={item.shape ?? shape} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    );
  } else {
    const ramp = colors?.length ? colors : kind === "diverging" ? tokens.diverging : tokens.sequential;
    const ends = labels ?? [];
    const low = ends[0];
    const high = ends.length > 1 ? ends[ends.length - 1] : undefined;
    const mid = ends.length > 2 ? ends[Math.floor(ends.length / 2)] : undefined;
    const description = `${title ? `${title}: ` : ""}${kind} colour scale${low != null && high != null ? ` from ${low} to ${high}` : ""}${mid != null ? `, ${mid} at the midpoint` : ""}`;
    body = (
      <div data-slot="ic-legend-key-ramp" role="img" aria-label={description} style={{ width, maxWidth: "100%", margin: center ? "0 auto" : undefined }}>
        {stepped ? (
          <div data-slot="ic-legend-key-steps" style={{ display: "flex", gap: 2, height: 10 }}>
            {ramp.map((c, i) => (
              <span key={i} style={{ flex: 1, background: c, boxShadow: EDGE, borderRadius: i === 0 ? "2px 0 0 2px" : i === ramp.length - 1 ? "0 2px 2px 0" : 0 }} />
            ))}
          </div>
        ) : (
          <div data-slot="ic-legend-key-gradient" style={{ height: 10, borderRadius: 2, boxShadow: EDGE, background: `linear-gradient(to right, ${ramp.join(", ")})` }} />
        )}
        {ends.length ? (
          <div data-slot="ic-legend-key-labels" aria-hidden style={{ display: "grid", gridTemplateColumns: mid != null ? "1fr auto 1fr" : "1fr 1fr", gap: 8, marginTop: 5, fontSize: "0.75rem", lineHeight: 1.35, color: "var(--_ic-ink-2)", fontVariantNumeric: "tabular-nums" }}>
            <span style={{ textAlign: "left" }}>{low}</span>
            {mid != null ? <span style={{ textAlign: "center" }}>{mid}</span> : null}
            <span style={{ textAlign: "right" }}>{high}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={ref} data-slot="ic-legend-key" data-scale={kind} data-ic-mode={mode} role={title ? "group" : undefined} aria-label={title} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--_ic-ink-2)", textAlign: align, minWidth: 0, ...frameStyle(rest.theme, mode, rest.frame), ...style }}>
      {title ? (
        <div data-slot="ic-legend-key-title" style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--_ic-ink)", marginBottom: kind === "categorical" ? 6 : 7 }}>
          {title}
        </div>
      ) : null}
      {body}
    </div>
  );
}

export const LegendKey = withMeta(LegendKeyImpl, {
  name: "legend-key",
  component: "LegendKey",
  title: "Legend key",
  level: "atom",
  category: "figure",
  description: "A standalone colour key: categorical swatches, or a sequential/diverging ramp with end labels.",
  whenToUse: "When several charts (small multiples, a map and a bar chart, a dashboard row) share one colour encoding, show the key once above them and turn their own legends off.",
  avoid: "A single chart: its built-in legend or, better, direct labels already do this. Do not list more than eight categories.",
  props: [
    { name: "scale", type: '"categorical" | "sequential" | "diverging"', description: "Defaults to `categorical` when `items` is given, otherwise `sequential`." },
    { name: "items", type: "(string | { label, color?, index?, shape?, muted? })[]", description: "Categorical entries. Colours come from the theme's categorical order by position (or `index`) unless given." },
    { name: "labels", type: "string[]", description: "Ramp end labels: `[low, high]` or `[low, middle, high]`." },
    { name: "colors", type: "string[]", description: "Ramp colours, low to high. Defaults to the theme's sequential or diverging ramp." },
    { name: "stepped", type: "boolean", default: "false", description: "Discrete steps instead of a continuous gradient, for binned scales." },
    { name: "title", type: "string", description: "What the key encodes." },
    { name: "shape", type: '"square" | "line" | "dot"', default: '"square"', description: "Default swatch shape: match the marks." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Categorical layout." },
    { name: "width", type: "number", default: "240", description: "Ramp width in px, capped at the container." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Alignment within the container." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: { type: "legend-key", theme: "poster", title: "Source of electricity", items: ["Solar", "Wind", "Hydro", "Gas", { label: "Other", muted: true }] },
});

export const examples = {
  "Sequential ramp": { scale: "sequential", title: "Share of electricity from renewables", labels: ["0%", "100%"] },
  "Diverging, stepped": { theme: "editorial", scale: "diverging", stepped: true, title: "Change in house prices, 2019 to 2024", labels: ["−20%", "No change", "+20%"], width: 300 },
  "Lines, vertical, explicit order": { theme: "ocean", orientation: "vertical", shape: "line", items: [{ label: "Germany", index: 0 }, { label: "Spain", index: 3 }, { label: "EU average", muted: true }] },
};
