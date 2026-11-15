// Text measurement and label placement shared by chart builders.

let ctx: CanvasRenderingContext2D | null | undefined;
const widths = new Map<string, number>();

/**
 * Width of a string in CSS px. Measured on a canvas when one is available (cached), with
 * a character-count estimate as the fallback for SSR and tests.
 */
export function measureText(text: string, fontSize = 12, fontFamily = "sans-serif", fontWeight: number | string = 400): number {
  const key = `${fontWeight}|${fontSize}|${fontFamily}|${text}`;
  const hit = widths.get(key);
  if (hit !== undefined) return hit;
  if (ctx === undefined) {
    try {
      ctx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
    } catch {
      ctx = null;
    }
  }
  let width: number;
  if (ctx && typeof ctx.measureText === "function") {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    width = ctx.measureText(text).width;
  } else width = text.length * fontSize * 0.56;
  if (widths.size > 5000) widths.clear();
  widths.set(key, width);
  return width;
}

/** Shorten a string with an ellipsis so it fits `maxWidth` px. Returns it unchanged when it already fits. */
export function truncateText(text: string, maxWidth: number, fontSize = 12, fontFamily = "sans-serif", fontWeight: number | string = 400): string {
  if (measureText(text, fontSize, fontFamily, fontWeight) <= maxWidth) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (measureText(`${text.slice(0, mid).trimEnd()}…`, fontSize, fontFamily, fontWeight) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo === 0 ? "…" : `${text.slice(0, lo).trimEnd()}…`;
}

/** Break a string into lines no wider than `maxWidth` px, on word boundaries. */
export function wrapText(text: string, maxWidth: number, fontSize = 12, fontFamily = "sans-serif", fontWeight: number | string = 400): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measureText(next, fontSize, fontFamily, fontWeight) > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Spread label positions apart so none are closer than `gap`, moving each as little as
 * possible and keeping them inside `[min, max]`. Input order is preserved in the output.
 * Use for end-of-line labels that converge; draw a leader line when a label moves far.
 */
export function dodge(positions: number[], gap: number, min = -Infinity, max = Infinity): number[] {
  const order = positions.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  // Merge overlapping labels into clusters and centre each cluster on its members' mean.
  const clusters: { start: number; count: number; sum: number }[] = [];
  for (const { p } of order) {
    clusters.push({ start: p, count: 1, sum: p });
    while (clusters.length > 1) {
      const b = clusters[clusters.length - 1];
      const a = clusters[clusters.length - 2];
      if (a.start + a.count * gap <= b.start) break;
      const count = a.count + b.count;
      const sum = a.sum + b.sum;
      clusters.splice(-2, 2, { start: sum / count - ((count - 1) * gap) / 2, count, sum });
    }
  }
  // Clamp to the bounds, then push clusters apart again where clamping made them touch:
  // forward from the low edge, then back from the high edge.
  const starts = clusters.map((c) => Math.max(min, c.start));
  for (let i = 1; i < clusters.length; i++) starts[i] = Math.max(starts[i], starts[i - 1] + clusters[i - 1].count * gap);
  for (let i = clusters.length - 1; i >= 0; i--) {
    const limit = i === clusters.length - 1 ? max - (clusters[i].count - 1) * gap : starts[i + 1] - clusters[i].count * gap;
    starts[i] = Math.min(starts[i], limit);
  }
  const out = new Array<number>(positions.length);
  let k = 0;
  clusters.forEach((c, ci) => {
    for (let j = 0; j < c.count; j++) out[order[k++].i] = starts[ci] + j * gap;
  });
  return out;
}
