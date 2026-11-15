// A small DOM-to-canvas painter, so a whole designed piece (a social card, a poster) can be
// saved as one PNG without a dependency. It paints what the library's HTML chrome uses: box
// backgrounds (solid colours, and linear / radial gradients), borders (solid, dotted and
// dashed) and radii, clipping for `overflow: hidden` boxes, text (positioned word by word
// from the browser's own layout, so wrapping matches exactly), inline SVG (ECharts' SVG
// renderer, icons) and canvases (ECharts' canvas renderer), and hard-edged inset box-shadows
// (the underline and edge-marker idiom: `inset 0 -0.14em 0 colour`). It does not paint outer
// or blurred shadows, transforms, conic or repeating gradients, or `url()` background images.

const VARS = ["--_ic-surface", "--_ic-ink", "--_ic-ink-2", "--_ic-muted", "--_ic-grid", "--_ic-axis", "--_ic-context", "--_ic-accent", "--_ic-positive", "--_ic-negative", "--_ic-font", "--_ic-font-display"];
const CLEAR = /^(transparent|rgba\(0, 0, 0, 0\))$/;

const px = (value: string) => parseFloat(value) || 0;

function roundedPath(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radii: number[]) {
  g.beginPath();
  if (typeof g.roundRect === "function") g.roundRect(x, y, w, h, radii.map((r) => Math.max(0, Math.min(r, w / 2, h / 2))));
  else g.rect(x, y, w, h);
}

interface InsetShadow {
  color: string;
  x: number;
  y: number;
  spread: number;
}

/** The inset, unblurred shadows of a computed `box-shadow`: the ones that are really strips of colour along an edge. */
function insetShadows(value: string): InsetShadow[] {
  if (!value || value === "none") return [];
  // Split on the commas between shadows, not the ones inside rgb().
  return value.split(/,(?![^(]*\))/).flatMap((part) => {
    if (!/\binset\b/.test(part)) return [];
    const rest = part.replace(/\binset\b/, "").trim();
    // Computed values put the colour first: "rgba(37, 99, 235, 0.55) 0px -2.8px 0px 0px".
    const color = rest.match(/(?:[a-z-]+\([^)]*\)|#[0-9a-f]{3,8})/i)?.[0];
    const [x = 0, y = 0, blur = 0, spread = 0] = (color ? rest.replace(color, "") : rest).trim().split(/\s+/).map(px);
    return color && blur === 0 ? [{ color, x, y, spread }] : [];
  });
}

function paintInsetShadows(g: CanvasRenderingContext2D, shadows: InsetShadow[], rects: DOMRect[]) {
  for (const s of shadows) {
    // With no blur an inset shadow is a band along each edge: the spread, pushed by the offset.
    const top = Math.max(0, s.spread + s.y);
    const bottom = Math.max(0, s.spread - s.y);
    const left = Math.max(0, s.spread + s.x);
    const right = Math.max(0, s.spread - s.x);
    g.fillStyle = s.color;
    for (const r of rects) {
      if (r.width <= 0 || r.height <= 0) continue;
      if (top) g.fillRect(r.left, r.top, r.width, Math.min(top, r.height));
      if (bottom) g.fillRect(r.left, r.bottom - Math.min(bottom, r.height), r.width, Math.min(bottom, r.height));
      const inner = Math.max(0, r.height - top - bottom);
      if (left) g.fillRect(r.left, r.top + top, Math.min(left, r.width), inner);
      if (right) g.fillRect(r.right - Math.min(right, r.width), r.top + top, Math.min(right, r.width), inner);
    }
  }
}

/** Split on the commas that separate arguments, not the ones inside `rgb()`. */
const splitArgs = (value: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      out.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(value.slice(start).trim());
  return out.filter(Boolean);
};

const COLOR = /^((?:[a-z-]+\((?:[^()]|\([^()]*\))*\))|#[0-9a-f]{3,8}|[a-z]+)\s*(.*)$/i;
const SIDES: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 };

/** Colour stops of a gradient's arguments, with missing positions spread evenly the way CSS does. */
function colorStops(args: string[], length: number): { color: string; at: number }[] {
  const raw = args.flatMap((arg) => {
    const m = arg.match(COLOR);
    if (!m) return [];
    const pos = m[2].trim().split(/\s+/)[0];
    return [{ color: m[1], at: !pos ? NaN : pos.endsWith("%") ? parseFloat(pos) / 100 : length > 0 ? px(pos) / length : NaN }];
  });
  if (!raw.length) return [];
  if (Number.isNaN(raw[0].at)) raw[0].at = 0;
  if (Number.isNaN(raw[raw.length - 1].at)) raw[raw.length - 1].at = 1;
  for (let i = 1; i < raw.length - 1; i++) {
    if (!Number.isNaN(raw[i].at)) continue;
    let j = i;
    while (Number.isNaN(raw[j].at)) j++;
    for (let k = i; k < j; k++) raw[k].at = raw[i - 1].at + ((raw[j].at - raw[i - 1].at) * (k - i + 1)) / (j - i + 1);
  }
  return raw.map((s) => ({ color: s.color, at: Math.max(0, Math.min(1, s.at)) }));
}

/**
 * Canvas gradients for a computed `background-image`: every `linear-gradient()` and
 * `radial-gradient()` layer, bottom layer first. Other images (url, conic, repeating) are skipped.
 */
export function backgroundGradients(g: CanvasRenderingContext2D, image: string, rect: { left: number; top: number; width: number; height: number }): CanvasGradient[] {
  if (!image || image === "none") return [];
  const out: CanvasGradient[] = [];
  for (const layer of splitArgs(image).reverse()) {
    const m = layer.match(/^(linear|radial)-gradient\((.*)\)$/s);
    if (!m) continue;
    const args = splitArgs(m[2]);
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let gradient: CanvasGradient;
    let length: number;
    if (m[1] === "linear") {
      let angle = 180;
      const first = args[0] ?? "";
      if (/^-?[\d.]+(deg|turn|rad|grad)$/.test(first)) {
        const n = parseFloat(first);
        angle = first.endsWith("turn") ? n * 360 : first.endsWith("grad") ? n * 0.9 : first.endsWith("rad") ? (n * 180) / Math.PI : n;
        args.shift();
      } else if (first.startsWith("to ")) {
        const words = first.slice(3).split(/\s+/);
        // A corner keyword points at that corner, so the angle depends on the box's shape.
        if (words.length === 2) {
          const dx = words.includes("right") ? 1 : -1;
          const dy = words.includes("bottom") ? 1 : -1;
          angle = (Math.atan2(dx * rect.height, -dy * rect.width) * 180) / Math.PI;
        } else angle = SIDES[words[0]] ?? 180;
        args.shift();
      }
      const a = (angle * Math.PI) / 180;
      length = Math.abs(rect.width * Math.sin(a)) + Math.abs(rect.height * Math.cos(a));
      const dx = (Math.sin(a) * length) / 2;
      const dy = (-Math.cos(a) * length) / 2;
      gradient = g.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    } else {
      // Shape and position: "circle at 20% 0%", "ellipse farthest-corner at center". The
      // gradient is drawn as a circle reaching the farthest corner, which is what posters use.
      let ox = cx;
      let oy = cy;
      const first = args[0] ?? "";
      if (!COLOR.test(first) || /^(circle|ellipse|closest|farthest|at)\b/.test(first)) {
        const at = first.match(/\bat\s+(\S+)(?:\s+(\S+))?/);
        const coord = (token: string | undefined, start: number, size: number) => (!token || token === "center" ? start + size / 2 : token === "left" || token === "top" ? start : token === "right" || token === "bottom" ? start + size : token.endsWith("%") ? start + (size * parseFloat(token)) / 100 : start + px(token));
        if (at) {
          ox = coord(at[1], rect.left, rect.width);
          oy = coord(at[2], rect.top, rect.height);
        }
        args.shift();
      }
      length = Math.max(Math.hypot(ox - rect.left, oy - rect.top), Math.hypot(rect.left + rect.width - ox, oy - rect.top), Math.hypot(ox - rect.left, rect.top + rect.height - oy), Math.hypot(rect.left + rect.width - ox, rect.top + rect.height - oy));
      gradient = g.createRadialGradient(ox, oy, 0, ox, oy, length);
    }
    const stops = colorStops(args, length);
    if (stops.length < 2) continue;
    try {
      for (const s of stops) gradient.addColorStop(s.at, s.color);
      out.push(gradient);
    } catch {
      // A colour canvas cannot parse: leave this layer out; the background colour still paints.
    }
  }
  return out;
}

/** Dash pattern for a CSS border style at a line width. Dotted borders are round dots one width apart. */
function dashFor(g: CanvasRenderingContext2D, style: string, width: number) {
  if (style === "dotted") {
    g.setLineDash([0, width * 2]);
    g.lineCap = "round";
  } else if (style === "dashed") {
    g.setLineDash([width * 3, width * 3]);
    g.lineCap = "butt";
  } else {
    g.setLineDash([]);
    g.lineCap = "butt";
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("InsightCharts: could not rasterise an SVG in the card"));
    img.src = src;
  });
}

async function paintSvg(g: CanvasRenderingContext2D, svg: SVGSVGElement, rect: DOMRect, style: CSSStyleDeclaration) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(rect.width));
  clone.setAttribute("height", String(rect.height));
  // A standalone SVG cannot see the page's custom properties or inherited colour.
  for (const name of VARS) {
    const value = style.getPropertyValue(name);
    if (value) clone.style.setProperty(name, value);
  }
  clone.style.color = style.color;
  clone.style.fontFamily = style.fontFamily;
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`);
  g.drawImage(img, rect.left, rect.top, rect.width, rect.height);
}

function paintText(g: CanvasRenderingContext2D, node: Text, style: CSSStyleDeclaration) {
  const text = node.data;
  if (!text.trim()) return;
  const range = document.createRange();
  g.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  g.fillStyle = style.color;
  g.textBaseline = "alphabetic";
  if ("letterSpacing" in g) (g as unknown as { letterSpacing: string }).letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  const upper = style.textTransform === "uppercase";
  for (const match of text.matchAll(/\S+/g)) {
    const start = match.index ?? 0;
    range.setStart(node, start);
    range.setEnd(node, start + match[0].length);
    const rect = range.getClientRects()[0];
    if (!rect || rect.width === 0) continue;
    const word = upper ? match[0].toUpperCase() : match[0];
    const m = g.measureText(word);
    const ascent = m.fontBoundingBoxAscent ?? px(style.fontSize) * 0.8;
    const descent = m.fontBoundingBoxDescent ?? px(style.fontSize) * 0.2;
    g.fillText(word, rect.left, rect.top + (rect.height - ascent - descent) / 2 + ascent);
  }
}

async function paint(g: CanvasRenderingContext2D, el: Element, alpha: number, isRoot = false): Promise<void> {
  if (el.hasAttribute("data-ic-export-ignore")) return;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return;
  const opacity = alpha * (parseFloat(style.opacity) || (style.opacity === "0" ? 0 : 1));
  if (opacity <= 0) return;
  const rect = el.getBoundingClientRect();
  g.globalAlpha = opacity;
  if (el instanceof SVGSVGElement) return paintSvg(g, el, rect, style);
  if (el instanceof HTMLCanvasElement) {
    if (el.width && el.height) g.drawImage(el, rect.left, rect.top, rect.width, rect.height);
    return;
  }
  if (el instanceof HTMLImageElement) {
    if (el.complete && el.naturalWidth) g.drawImage(el, rect.left, rect.top, rect.width, rect.height);
    return;
  }
  // The root's frame (border, radius) belongs to the page, not the image.
  if (!isRoot && rect.width > 0 && rect.height > 0) {
    const radii = [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(px);
    if (!CLEAR.test(style.backgroundColor)) {
      g.fillStyle = style.backgroundColor;
      roundedPath(g, rect.left, rect.top, rect.width, rect.height, radii);
      g.fill();
    }
    for (const gradient of backgroundGradients(g, style.backgroundImage, rect)) {
      g.fillStyle = gradient;
      roundedPath(g, rect.left, rect.top, rect.width, rect.height, radii);
      g.fill();
    }
    // Above the background, below the content. An inline element that wraps has one box per line.
    const shadows = insetShadows(style.boxShadow);
    if (shadows.length) paintInsetShadows(g, shadows, style.display === "inline" ? Array.from(el.getClientRects()) : [rect]);
    const sides = (["Top", "Right", "Bottom", "Left"] as const).map((s) => ({ width: style[`border${s}Style`] === "none" ? 0 : px(style[`border${s}Width`]), color: style[`border${s}Color`], style: style[`border${s}Style`] }));
    const uniform = sides.every((s) => s.width === sides[0].width && s.color === sides[0].color && s.style === sides[0].style);
    if (uniform && sides[0].width > 0) {
      const w = sides[0].width;
      g.strokeStyle = sides[0].color;
      g.lineWidth = w;
      dashFor(g, sides[0].style, w);
      roundedPath(g, rect.left + w / 2, rect.top + w / 2, rect.width - w, rect.height - w, radii.map((r) => r - w / 2));
      g.stroke();
      g.setLineDash([]);
    } else if (!uniform) {
      const [top, right, bottom, left] = sides;
      // Each side is one stroked line down the middle of its border box, so dots and dashes work.
      const edge = (s: { width: number; color: string; style: string }, x1: number, y1: number, x2: number, y2: number) => {
        if (s.width <= 0 || CLEAR.test(s.color)) return;
        g.strokeStyle = s.color;
        g.lineWidth = s.width;
        dashFor(g, s.style, s.width);
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.setLineDash([]);
      };
      edge(top, rect.left, rect.top + top.width / 2, rect.right, rect.top + top.width / 2);
      edge(bottom, rect.left, rect.bottom - bottom.width / 2, rect.right, rect.bottom - bottom.width / 2);
      edge(left, rect.left + left.width / 2, rect.top, rect.left + left.width / 2, rect.bottom);
      edge(right, rect.right - right.width / 2, rect.top, rect.right - right.width / 2, rect.bottom);
    }
  }
  // A box that hides its overflow clips its children to its (rounded) padding box.
  const clips = !isRoot && rect.width > 0 && rect.height > 0 && (style.overflowX !== "visible" || style.overflowY !== "visible") && style.display !== "inline";
  if (clips) {
    g.save();
    roundedPath(g, rect.left, rect.top, rect.width, rect.height, [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(px));
    g.clip();
  }
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3) {
      g.globalAlpha = opacity;
      paintText(g, child as Text, style);
    } else if (child.nodeType === 1) await paint(g, child as Element, opacity);
  }
  if (clips) g.restore();
}

/** Paint an element and its subtree to a canvas `pixelWidth` wide. Elements with `data-ic-export-ignore` are skipped. */
export async function rasterize(root: HTMLElement, pixelWidth: number): Promise<HTMLCanvasElement> {
  const box = root.getBoundingClientRect();
  const scale = pixelWidth / box.width;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(box.width * scale);
  canvas.height = Math.round(box.height * scale);
  const g = canvas.getContext("2d");
  if (!g) throw new Error("InsightCharts: canvas is not available");
  if (typeof document !== "undefined" && document.fonts?.ready) await document.fonts.ready;
  g.scale(scale, scale);
  g.translate(-box.left, -box.top);
  // The image is a full rectangle: the root's own background runs into the corners its radius would cut.
  const rootStyle = getComputedStyle(root);
  if (!CLEAR.test(rootStyle.backgroundColor)) {
    g.fillStyle = rootStyle.backgroundColor;
    g.fillRect(box.left, box.top, box.width, box.height);
  }
  for (const gradient of backgroundGradients(g, rootStyle.backgroundImage, box)) {
    g.fillStyle = gradient;
    g.fillRect(box.left, box.top, box.width, box.height);
  }
  await paint(g, root, 1, true);
  return canvas;
}

export const canvasToBlob = (canvas: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("InsightCharts: image export failed"))), "image/png"));
