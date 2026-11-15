"use client";

import { type CSSProperties, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { useInsightStyles, icons, type IconName, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput } from "insightcharts/core";

export interface IconStatProps {
  /** How many glyphs are filled: the K in "K in N". */
  count: number;
  /** How many glyphs are drawn: the N. Capped at 100. Default 10. */
  total?: number;
  /** The sentence the glyphs illustrate, completing the figure: "households cannot cover a surprise bill". */
  text?: string;
  /** JSX alternative to `text`. */
  children?: ReactNode;
  /** The figure as words. Defaults to "{count} in {total}". Pass `false` to hide it. */
  value?: string | false;
  /** Glyph drawn for each unit: `"circle"`, `"person"` or `"square"` (outlined when unfilled), or any other icon name from `core/icons.ts` (faded when unfilled). */
  icon?: "circle" | "person" | "square" | IconName;
  /** Glyphs per row. Defaults to `total` up to 10, then 10. */
  columns?: number;
  /** Glyph height in px. Shrinks to fit narrow containers. */
  size?: number;
  /** Fill colour by meaning. Default `"accent"`. */
  tone?: "accent" | "positive" | "negative" | "neutral";
  align?: "left" | "center";
  /** A built-in theme name or a theme object. A named theme paints its own background behind the block. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the block. Default: on for a named theme with its own surface. */
  frame?: boolean;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

function useWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

const FILL = { accent: "var(--_ic-accent)", positive: "var(--_ic-positive)", negative: "var(--_ic-negative)", neutral: "var(--_ic-ink-2)" } as const;
// Glyph boxes: width / height. People are taller than they are wide.
const ASPECT: Record<string, number> = { circle: 1, square: 1, person: 0.62 };
// The three original glyphs keep their own outlined drawings; every other name is a registry icon in its square 24 x 24 box.
const aspectOf = (icon: string) => ASPECT[icon] ?? 1;

// Filled units are solid, the rest are outlines: the count reads without colour.
function Glyph({ icon, on, height, color, off }: { icon: string; on: boolean; height: number; color: string; off: string }) {
  const paint = on ? { fill: color, stroke: color, strokeWidth: 1.5 } : { fill: "none", stroke: off, strokeWidth: 1.5 };
  const common = { "data-slot": "ic-icon-stat-glyph", "data-filled": on ? "" : undefined, "aria-hidden": true, height, style: { display: "block", flex: "none" } as CSSProperties };
  if (!(icon in ASPECT)) {
    // A registry icon is one filled path, so an unfilled unit is the same shape in the receding colour, not an outline.
    return (
      <svg {...common} viewBox="0 0 24 24" width={height}>
        <path d={(icons[icon as IconName] ?? icons.circle).d} fill={on ? color : off} />
      </svg>
    );
  }
  if (icon === "person") {
    return (
      <svg {...common} viewBox="0 0 15 24" width={height * ASPECT.person}>
        <circle cx={7.5} cy={4.6} r={3.6} vectorEffect="non-scaling-stroke" {...paint} />
        <path d="M1.2 22.6v-6.4a6.3 5.6 0 0 1 12.6 0v6.4a.6.6 0 0 1-.6.6H1.8a.6.6 0 0 1-.6-.6Z" strokeLinejoin="round" vectorEffect="non-scaling-stroke" {...paint} />
      </svg>
    );
  }
  return (
    <svg {...common} viewBox="0 0 16 16" width={height}>
      {icon === "square" ? <rect x={1.2} y={1.2} width={13.6} height={13.6} rx={2.5} vectorEffect="non-scaling-stroke" {...paint} /> : <circle cx={8} cy={8} r={6.8} vectorEffect="non-scaling-stroke" {...paint} />}
    </svg>
  );
}

/**
 * A "1 in 4" statement: N simple glyphs with K filled, plus the sentence. Quantity is
 * shown by counting units, never by scaling an icon's area.
 */
function IconStatImpl({ count, total = 10, text, children, value, icon = "circle", columns, size, tone = "accent", align = "left", className, style, ...rest }: IconStatProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const width = useWidth(ref);

  const n = Math.max(1, Math.min(100, Math.round(total)));
  const k = Math.max(0, Math.min(n, Math.round(count)));
  const cols = Math.max(1, Math.min(n, columns ?? Math.min(n, 10)));
  const desired = size ?? (icon === "person" ? (n > 20 ? 26 : 40) : n > 20 ? 14 : 22);
  const gapFor = (h: number) => Math.max(3, Math.round(h * (icon === "person" ? 0.22 : 0.32)));
  // Shrink the glyphs until a full row fits the container; the row count never changes, so the picture stays a grid.
  let h = desired;
  if (width > 0) while (h > 6 && cols * h * aspectOf(icon) + (cols - 1) * gapFor(h) > width) h -= 1;
  const gap = gapFor(h);
  const label = value === false ? null : value ?? `${k} in ${n}`;
  const center = align === "center";

  return (
    <div ref={ref} data-slot="ic-icon-stat" data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", textAlign: align, minWidth: 0, ...frameStyle(rest.theme, mode, rest.frame), ...style }}>
      <div data-slot="ic-icon-stat-glyphs" role="img" aria-label={`${k} of ${n} highlighted`} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${h * aspectOf(icon)}px)`, gap: `${icon === "person" ? Math.round(gap * 1.4) : gap}px ${gap}px`, justifyContent: center ? "center" : "start" }}>
        {Array.from({ length: n }, (_, i) => (
          <Glyph key={i} icon={icon} on={i < k} height={h} color={FILL[tone]} off="color-mix(in srgb, var(--_ic-muted) 60%, var(--_ic-surface))" />
        ))}
      </div>
      {label || text || children ? (
        <p data-slot="ic-icon-stat-statement" style={{ marginTop: 14, marginBottom: 0, fontSize: "1rem", lineHeight: 1.5, color: "var(--_ic-ink-2)", maxWidth: "44ch", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0, textWrap: "pretty" }}>
          {label ? (
            <strong data-slot="ic-icon-stat-value" style={{ display: "block", fontFamily: "var(--_ic-font-display)", fontSize: 28, lineHeight: 1.15, fontWeight: 650, letterSpacing: "-0.02em", color: "var(--_ic-ink)", marginBottom: 4 }}>
              {label}
            </strong>
          ) : null}
          {text}
          {children}
        </p>
      ) : null}
    </div>
  );
}

export const IconStat = withMeta(IconStatImpl, {
  name: "icon-stat",
  component: "IconStat",
  title: "Icon stat",
  level: "atom",
  category: "figure",
  description: 'A "1 in 4"-style statement: a row or grid of simple glyphs with some filled, and the sentence they illustrate.',
  whenToUse: "A single proportion that is easier to read as people or units than as a percentage: 1 in 4, 3 in 10, 37 of 100. Round to a small denominator first.",
  avoid: "Comparing several proportions (use `bar-chart`), precise percentages (use `big-number`), or fractions that need more than 100 units.",
  props: [
    { name: "count", type: "number", required: true, description: "How many glyphs are filled." },
    { name: "total", type: "number", default: "10", description: "How many glyphs are drawn. Capped at 100." },
    { name: "text", type: "string", description: "The sentence completing the figure." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `text`." },
    { name: "value", type: "string | false", description: 'The figure as words. Defaults to "{count} in {total}"; `false` hides it.' },
    { name: "icon", type: '"circle" | "person" | "square" | IconName', default: '"circle"', description: "Glyph per unit. Filled units are solid, the rest outlined. Any other icon name from `core/icons.ts` also works; its unfilled units are faded instead of outlined." },
    { name: "columns", type: "number", description: "Glyphs per row. Defaults to `total`, at most 10." },
    { name: "size", type: "number", description: "Glyph height in px; shrinks to fit narrow containers." },
    { name: "tone", type: '"accent" | "positive" | "negative" | "neutral"', default: '"accent"', description: "Fill colour by meaning." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Alignment." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: { type: "icon-stat", icon: "person", count: 1, total: 4, text: "households could not cover an unexpected bill of €500 without borrowing." },
});
