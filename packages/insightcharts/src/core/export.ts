import { toCsv } from "../data/csv";
import type { Row } from "../data/types";
import { echarts, type EChartsOption } from "./echarts";
import type { ExportFormat } from "./provider";
import type { ResolvedTokens } from "./theme";

export interface ExportOptions {
  format?: ExportFormat;
  /** File name without extension. Defaults to a slug of the title. */
  filename?: string;
  /** Raster scale. Default 2 (retina). */
  pixelRatio?: number;
  /** Include the title, subtitle and source line in image exports. Default true. */
  chrome?: boolean;
  /** Background colour. Defaults to the theme surface, so exports are never transparent-on-black. */
  background?: string;
  /** Return the Blob instead of triggering a download. */
  download?: boolean;
}

export interface ExportContext {
  option: EChartsOption;
  width: number;
  height: number;
  tokens: ResolvedTokens;
  title?: string;
  subtitle?: string;
  source?: string;
  rows?: Row[];
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "chart";

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrapText(measure: (s: string) => number, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next) > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

interface Layout {
  pad: number;
  blocks: { lines: string[]; size: number; weight: number; color: string; y: number; family: string }[];
  chartY: number;
  total: number;
}

function layout(ctx: ExportContext, chrome: boolean, measure: (s: string, font: string) => number): Layout {
  const pad = chrome ? 24 : 0;
  const t = ctx.tokens;
  const blocks: Layout["blocks"] = [];
  let y = pad;
  const add = (text: string | undefined, size: number, weight: number, color: string, family: string, gapAfter: number) => {
    if (!text || !chrome) return;
    const lines = wrapText((s) => measure(s, `${weight} ${size}px ${family}`), text, ctx.width);
    blocks.push({ lines, size, weight, color, y, family });
    y += lines.length * size * 1.3 + gapAfter;
  };
  add(ctx.title, 20, 650, t.ink, t.displayFamily, 4);
  add(ctx.subtitle, 14, 400, t.inkSecondary, t.fontFamily, 4);
  if (blocks.length) y += 10;
  const chartY = y;
  y += ctx.height;
  if (ctx.source && chrome) y += 10;
  add(ctx.source, 12, 400, t.muted, t.fontFamily, 0);
  return { pad, blocks, chartY, total: y + pad };
}

/** Render the option off-screen with a specific renderer, so export never depends on the on-screen one. */
function renderOffscreen<T>(ctx: ExportContext, renderer: "svg" | "canvas", pixelRatio: number, read: (chart: echarts.ECharts) => T): T {
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${ctx.width}px;height:${ctx.height}px;pointer-events:none;`;
  document.body.appendChild(host);
  const chart = echarts.init(host, null, { renderer, width: ctx.width, height: ctx.height, devicePixelRatio: pixelRatio });
  try {
    chart.setOption({ ...ctx.option, animation: false }, { notMerge: true });
    return read(chart);
  } finally {
    chart.dispose();
    host.remove();
  }
}

export function toSvgString(ctx: ExportContext, opts: ExportOptions = {}): string {
  const chrome = opts.chrome !== false;
  const inner = renderOffscreen(ctx, "svg", 1, (c) => c.renderToSVGString());
  let measureCtx: CanvasRenderingContext2D | null = null;
  try {
    measureCtx = document.createElement("canvas").getContext("2d");
  } catch {
    /* no canvas */
  }
  const l = layout(ctx, chrome, (s, font) => {
    if (!measureCtx) return s.length * 7;
    measureCtx.font = font;
    return measureCtx.measureText(s).width;
  });
  const W = ctx.width + l.pad * 2;
  const text = l.blocks
    .map((b) => b.lines.map((line, i) => `<text x="${l.pad}" y="${b.y + b.size + i * b.size * 1.3}" font-family="${escapeXml(b.family)}" font-size="${b.size}" font-weight="${b.weight}" fill="${b.color}">${escapeXml(line)}</text>`).join(""))
    .join("");
  const nested = inner.replace(/^<svg /, `<svg x="${l.pad}" y="${l.chartY}" `);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${l.total}" viewBox="0 0 ${W} ${l.total}"><rect width="100%" height="100%" fill="${opts.background ?? ctx.tokens.surface}"/>${text}${nested}</svg>`;
}

export async function toCanvas(ctx: ExportContext, opts: ExportOptions = {}): Promise<HTMLCanvasElement> {
  const chrome = opts.chrome !== false;
  const ratio = opts.pixelRatio ?? 2;
  const chartCanvas = renderOffscreen(ctx, "canvas", ratio, (c) => c.renderToCanvas({ pixelRatio: ratio, backgroundColor: "transparent" }));
  const canvas = document.createElement("canvas");
  const g = canvas.getContext("2d")!;
  const l = layout(ctx, chrome, (s, font) => {
    g.font = font;
    return g.measureText(s).width;
  });
  canvas.width = (ctx.width + l.pad * 2) * ratio;
  canvas.height = l.total * ratio;
  g.scale(ratio, ratio);
  g.fillStyle = opts.background ?? ctx.tokens.surface;
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.textBaseline = "alphabetic";
  for (const b of l.blocks) {
    g.font = `${b.weight} ${b.size}px ${b.family}`;
    g.fillStyle = b.color;
    b.lines.forEach((line, i) => g.fillText(line, l.pad, b.y + b.size + i * b.size * 1.3));
  }
  g.drawImage(chartCanvas, l.pad, l.chartY, ctx.width, ctx.height);
  return canvas;
}

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("InsightCharts: canvas export failed"))), type, quality));

/** A single-page PDF wrapping a JPEG, written by hand so export needs no PDF dependency. */
async function toPdf(canvas: HTMLCanvasElement, ratio: number): Promise<Blob> {
  const jpeg = new Uint8Array(await (await canvasBlob(canvas, "image/jpeg", 0.95)).arrayBuffer());
  // CSS px to PDF points.
  const w = (canvas.width / ratio) * 0.75;
  const h = (canvas.height / ratio) * 0.75;
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? enc.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const obj = (body: string | (() => void)) => {
    offsets.push(length);
    push(`${offsets.length} 0 obj\n`);
    if (typeof body === "string") push(body);
    else body();
    push("\nendobj\n");
  };
  const content = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} 0 0 cm /Im0 Do Q`;
  push("%PDF-1.4\n");
  obj("<< /Type /Catalog /Pages 2 0 R >>");
  obj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(2)} ${h.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  obj(() => {
    push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg);
    push("\nendstream");
  });
  obj(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  const xref = length;
  push(`xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`);
  push(`trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export a chart as PNG, JPEG, SVG, PDF, CSV or JSON. Downloads by default; always resolves to the Blob. */
export async function exportChart(ctx: ExportContext, opts: ExportOptions = {}): Promise<Blob> {
  const format = opts.format ?? "png";
  const ratio = opts.pixelRatio ?? 2;
  let blob: Blob;
  if (format === "csv") blob = new Blob([toCsv(ctx.rows ?? [])], { type: "text/csv;charset=utf-8" });
  else if (format === "json") blob = new Blob([JSON.stringify(ctx.rows ?? [], null, 2)], { type: "application/json" });
  else if (format === "svg") blob = new Blob([toSvgString(ctx, opts)], { type: "image/svg+xml" });
  else {
    const canvas = await toCanvas(ctx, opts);
    blob = format === "pdf" ? await toPdf(canvas, ratio) : await canvasBlob(canvas, format === "jpeg" ? "image/jpeg" : "image/png", 0.95);
  }
  if (opts.download !== false) downloadBlob(blob, `${opts.filename ?? slug(ctx.title ?? "chart")}.${format === "jpeg" ? "jpg" : format}`);
  return blob;
}
