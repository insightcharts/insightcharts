export type Rgba = [r: number, g: number, b: number, a: number];

const cache = new Map<string, Rgba | null>();
let ctx: CanvasRenderingContext2D | null | undefined;

function parseSimple(css: string): Rgba | null {
  const s = css.trim().toLowerCase();
  if (s === "transparent") return [0, 0, 0, 0];
  let m = /^#([0-9a-f]{3,8})$/.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(s);
  if (m) {
    const a = m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3]), a];
  }
  return null;
}

/**
 * Normalise any CSS colour (hex, rgb, hsl, oklch, named, color-mix) to RGBA.
 * ECharts' canvas renderer cannot read CSS variables or modern colour functions, so
 * everything is resolved through a 1x1 canvas read-back. Returns null when unparsable.
 */
export function toRgba(css: string): Rgba | null {
  const hit = cache.get(css);
  if (hit !== undefined) return hit;
  let out = parseSimple(css);
  if (!out && typeof document !== "undefined") {
    if (ctx === undefined) {
      try {
        ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      } catch {
        ctx = null;
      }
    }
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      // Un-premultiply is handled by the browser; alpha comes back 0-255.
      out = [d[0], d[1], d[2], Math.round((d[3] / 255) * 1000) / 1000];
    }
  }
  cache.set(css, out);
  return out;
}

export function rgbaString([r, g, b, a]: Rgba): string {
  return a >= 1 ? `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}` : `rgba(${r},${g},${b},${a})`;
}

/** Multiply a colour's alpha. `alpha("#2a78d6", 0.1)` gives the 10% area wash. */
export function alpha(color: string, amount: number): string {
  const c = toRgba(color);
  return c ? rgbaString([c[0], c[1], c[2], Math.round(c[3] * amount * 1000) / 1000]) : color;
}

/** Linear mix of two colours in sRGB. `t = 0` returns `a`. */
export function mix(a: string, b: string, t: number): string {
  const x = toRgba(a);
  const y = toRgba(b);
  if (!x || !y) return a;
  return rgbaString([0, 1, 2].map((i) => Math.round(x[i] + (y[i] - x[i]) * t)).concat(x[3] + (y[3] - x[3]) * t) as Rgba);
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(color: string): number {
  const c = toRgba(color);
  if (!c) return 1;
  const [r, g, b] = [c[0], c[1], c[2]].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ink for a label printed inside a filled mark: white or near-black, by the fill's luminance. */
export function inkOn(fill: string): string {
  // White holds 3:1 only up to luminance 0.30; past that near-black is the readable one.
  return luminance(fill) > 0.3 ? "#0b0b0b" : "#ffffff";
}

/** Interpolate along a ramp of colours. `t` in 0..1. */
export function ramp(colors: string[], t: number): string {
  if (colors.length === 1) return colors[0];
  const x = Math.min(1, Math.max(0, t)) * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(x));
  return mix(colors[i], colors[i + 1], x - i);
}

/** The fallback literal inside `var(--x, fallback)`, used when no DOM is available. */
export function cssFallback(value: string): string {
  let v = value.trim();
  while (v.startsWith("var(")) {
    const comma = v.indexOf(",");
    if (comma === -1) return "";
    v = v.slice(comma + 1, v.lastIndexOf(")")).trim();
  }
  return v;
}
