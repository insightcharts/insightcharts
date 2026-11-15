/**
 * The computable palette checks from the dataviz palette validator (validate_palette.js),
 * ported so the presets stay validated in CI: OKLCH lightness band, chroma floor,
 * adjacent-pair OKLab dE under Machado-Oliveira-Fernandes (2009) severity-1.0 protan and
 * deutan simulation, the unsimulated adjacent floor, and WCAG contrast against the surface.
 * Thresholds and matrices are the validator's; do not tune them to make a palette pass.
 */
export const BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;
export const CHROMA_FLOOR = 0.1;
export const CVD_TARGET = 8;
export const CVD_FLOOR = 6;
export const NORMAL_FLOOR = 15;
export const CONTRAST_MIN = 3;

const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;

type V3 = [number, number, number];
const s2lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin = (hex: string): V3 => [1, 3, 5].map((i) => s2lin(parseInt(hex.slice(i, i + 2), 16) / 255)) as V3;

function oklabFromLin([r, g, b]: V3): V3 {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

function simulate(hex: string, kind: keyof typeof MACHADO): V3 {
  const [r, g, b] = lin(hex);
  return MACHADO[kind].map((row) => Math.max(0, Math.min(1, row[0] * r + row[1] * g + row[2] * b))) as V3;
}

/** OKLab distance x100. With `kind`, both colours are first passed through the CVD simulation. */
export function deltaE(a: string, b: string, kind?: keyof typeof MACHADO): number {
  const x = oklabFromLin(kind ? simulate(a, kind) : lin(a));
  const y = oklabFromLin(kind ? simulate(b, kind) : lin(b));
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/** OKLCH lightness, chroma and hue (degrees). */
export function oklch(hex: string): { L: number; C: number; H: number } {
  const [L, a, b] = oklabFromLin(lin(hex));
  return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = lin(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export interface PaletteReport {
  offBand: string[];
  lowChroma: string[];
  /** Worst adjacent pair under protan/deutan simulation. */
  cvd: number;
  /** Worst adjacent pair, unsimulated. */
  normal: number;
  lowContrast: string[];
}

export function checkPalette(palette: string[], mode: "light" | "dark", surface: string): PaletteReport {
  const [lo, hi] = BAND[mode];
  let cvd = Infinity;
  let normal = Infinity;
  for (let i = 0; i < palette.length - 1; i++) {
    cvd = Math.min(cvd, deltaE(palette[i], palette[i + 1], "protan"), deltaE(palette[i], palette[i + 1], "deutan"));
    normal = Math.min(normal, deltaE(palette[i], palette[i + 1]));
  }
  return {
    offBand: palette.filter((c) => oklch(c).L < lo || oklch(c).L > hi),
    lowChroma: palette.filter((c) => oklch(c).C < CHROMA_FLOOR),
    cvd,
    normal,
    lowContrast: palette.filter((c) => contrast(c, surface) < CONTRAST_MIN),
  };
}
