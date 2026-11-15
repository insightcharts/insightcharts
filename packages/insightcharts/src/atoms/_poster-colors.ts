import { luminance, mix, toRgba } from "../core/color";

/*
 * One distinct colour per entity from a small poster palette. Shared by every poster atom
 * that colours by entity, so the same entity index gets the same colour in each of them.
 *
 * The first `categorical.length` entities take the theme's own colours unchanged. After that
 * each further entity takes a step derived from the theme: a categorical hue mixed toward
 * `ink` or toward `surface`, or the midpoint of two hues. Of the candidates that keep 3:1
 * against `surface`, the one furthest (in OKLab) from every colour already handed out wins,
 * so the result is deterministic and stays inside the theme's family.
 */

interface PaletteTokens {
  surface: string;
  ink: string;
  categorical: string[];
}

type Lab = [number, number, number];

function oklab(color: string): Lab {
  const c = toRgba(color) ?? [0, 0, 0, 1];
  const [r, g, b] = [c[0], c[1], c[2]].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

const distance = (a: Lab, b: Lab) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** WCAG contrast ratio of two colours. */
export function _contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const cache = new Map<string, string[]>();

/**
 * `count` distinct colours for entities in stable order. Index `i` below the palette size is
 * `tokens.categorical[i]`, so charts with few entities look exactly as they did.
 */
export function _posterPalette(tokens: PaletteTokens, count: number): string[] {
  const base = tokens.categorical;
  if (count <= base.length || base.length === 0) return base.slice(0, Math.max(0, count));
  const key = `${tokens.surface}|${tokens.ink}|${base.join(",")}`;
  let out = cache.get(key);
  if (!out) {
    if (cache.size > 40) cache.clear();
    out = base.slice();
    cache.set(key, out);
  }
  if (out.length < count) {
    const labs = out.map(oklab);
    while (out.length < count) {
      const n = base.length;
      // Every hue offers steps toward ink and toward the ground, and every pair of hues its midpoints.
      const candidates: string[] = [];
      for (let h = 0; h < n; h++) {
        for (const t of [0.25, 0.4, 0.55, 0.7]) candidates.push(mix(base[h], tokens.ink, t), mix(base[h], tokens.surface, t));
        for (let g = h + 1; g < n; g++) {
          const between = mix(base[h], base[g], 0.5);
          candidates.push(between, mix(between, tokens.surface, 0.35), mix(between, tokens.ink, 0.35));
        }
      }
      let best = candidates[0];
      let bestScore = -1;
      for (const c of candidates) {
        if (_contrast(c, tokens.surface) < 3) continue;
        const lab = oklab(c);
        let d = Infinity;
        for (const other of labs) d = Math.min(d, distance(lab, other));
        if (d > bestScore) {
          bestScore = d;
          best = c;
        }
      }
      // Nothing passed 3:1 (cannot happen while the theme's own colours do): fall back to cycling.
      if (bestScore < 0) best = base[out.length % n];
      out.push(best);
      labs.push(oklab(best));
    }
  }
  return out.slice(0, count);
}

/** Colour of entity `index` among `count`, from `_posterPalette`. */
export function _entityColor(tokens: PaletteTokens, index: number, count: number): string {
  const palette = _posterPalette(tokens, Math.max(count, index + 1));
  return palette[index] ?? tokens.categorical[0];
}
