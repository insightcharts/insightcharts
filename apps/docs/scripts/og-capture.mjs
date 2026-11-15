// Photographs every component, and a few pages, for the social cards.
//
//   pnpm --filter docs og                      capture everything
//   pnpm --filter docs og bar-chart home       capture only these (component names or page keys)
//   pnpm --filter docs og --list               print every target and exit
//   OG_BASE_URL=http://localhost:3000 pnpm --filter docs og
//
// It needs a running docs server (default http://localhost:3100, set OG_BASE_URL or --base to
// change it). Each component is opened at its bare preview route, /<level>/<name>/preview,
// and saved as a 792 by 550 JPEG in public/og/shots/<level>/<name>.jpg. Pages listed in PAGES
// below (the landing page's hero, the demos of some guides, the scroll stories) are saved in
// public/og/shots/pages/<key>.jpg. The files are committed. `src/app/og/[...path]/route.tsx`
// reads them and draws the 1200 by 630 cards, so a build does not need a browser.
//
// The browser: this script has no dependencies. It starts a headless Chromium and drives it
// over the Chrome DevTools Protocol with Node's built-in WebSocket (Node 22 or later). It
// looks for the browser in this order: the OG_CHROME environment variable, the newest
// Playwright download in ~/Library/Caches/ms-playwright or ~/.cache/ms-playwright
// (`npx playwright install chromium` creates one), then an installed Google Chrome.
//
// Framing. Atoms and molecules are centred on the ground of the theme they were authored in.
// The script tries viewport widths from narrow to wide and keeps the first at which the whole
// component fits, then moves in on what is drawn, so a small figure is photographed large.
// Most templates and all posters are taller than the frame, so the top of the page is
// photographed at a width where its text can be read.
//
// Every capture is logged. The run exits with code 1 and lists the failures when a component
// shows an error or empty state, has no drawing, is not found, or comes out as one flat colour.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "..");
const OUT = join(app, "public/og/shots");

/** The size of every saved picture, in pixels. The card's picture panel has the same shape. */
const SHOT = { width: 792, height: 550 };
const RATIO = SHOT.height / SHOT.width;
const QUALITY = 0.8;
/** Viewport widths tried for atoms and molecules, narrow to wide. */
const WIDTHS = [400, 480, 560, 660, 760, 880, 1000, 1140, 1280];
/** The width used for an atom or molecule that fits at none of them. Its top is shown. */
const TALL_WIDTH = 880;
/** Charts are not tried narrower than this. */
const CHART_MIN_WIDTH = 660;
/** The narrowest region photographed, so a small figure is enlarged 2.4 times at most. */
const MIN_CLIP = 324;
/** The width used for a template that is not a poster. */
const PAGE_WIDTH = 1040;
const PARALLEL = 3;
/** Viewport widths for components that the rules above frame badly. */
const WIDTH_OVERRIDES = {
  // A phone-sized deck in the middle of a wide ground: a narrower page makes the deck larger.
  "story-deck": 860,
};

/**
 * Pictures that are not a component's preview. `selector` is the element photographed, with
 * the rest of the page hidden (several selectors separated by commas are tried in order);
 * `width` is the viewport width; `pad` adds space round the element; `settle` is a wait in
 * milliseconds for a graphic that never stops moving. Add an entry here and name it in
 * src/lib/og.ts.
 */
const PAGES = [
  { key: "home", url: "/", selector: "[data-hero-story]", width: 1180, settle: 2500 },
  { key: "guide-theming", url: "/docs/theming", selector: "[data-preview-root] [role=tabpanel]", width: 1120 },
  { key: "guide-crossfiltering", url: "/docs/crossfiltering", selector: "[data-preview-root] [role=tabpanel]", width: 1120 },
  { key: "guide-icons", url: "/docs/icons", selector: "main div.not-prose.grid", width: 1120, pad: 32 },
  { key: "guide-dark-mode", url: "/docs/dark-mode", selector: "[data-preview-root] [role=tabpanel]", width: 1120 },
  { key: "guide-export", url: "/docs/export", selector: "[data-preview-root] [role=tabpanel]", width: 1120 },
  { key: "story-dots", url: "/stories", selector: "#dots [data-preview], #dots > div:last-child", width: 1000 },
  { key: "story-line", url: "/stories", selector: "#line [data-preview], #line > div:last-child", width: 1000 },
  { key: "story-bars", url: "/stories", selector: "#bars [data-preview], #bars > div:last-child", width: 1000 },
  { key: "story-treemap", url: "/stories", selector: "#treemap [data-preview], #treemap > div:last-child", width: 1000 },
  { key: "story-ribbon", url: "/stories", selector: "#ribbon [data-preview], #ribbon > div:last-child", width: 1000 },
];

// ---------------------------------------------------------------- arguments and targets

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const BASE = (flag("--base") ?? process.env.OG_BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const listOnly = args.includes("--list");
const wanted = args.filter((a) => !a.startsWith("--"));

const catalogPath = join(app, "src/generated/catalog.json");
if (!existsSync(catalogPath)) {
  console.error("src/generated/catalog.json is missing. Run `pnpm --filter docs generate` first.");
  process.exit(1);
}
const catalog = JSON.parse(readFileSync(catalogPath, "utf8")).components;
const SLUG = { atom: "atoms", molecule: "molecules", template: "templates" };
const unquote = (v) => v?.replace(/^["'`]|["'`]$/g, "");

const targets = [
  ...catalog.map((c) => {
    const poster = c.category === "infographic" || (c.level === "molecule" && c.category === "poster");
    const given = c.example?.maxWidth;
    const fallback = Number(unquote(c.props.find((p) => p.name === "maxWidth")?.default));
    const sheet = typeof given === "number" ? given : Number.isFinite(fallback) && fallback > 0 ? fallback : 1100;
    return {
      key: c.name,
      kind: poster ? "poster" : c.level === "template" ? "page" : "fit",
      url: `/${SLUG[c.level]}/${c.name}/preview`,
      file: join(OUT, SLUG[c.level], `${c.name}.jpg`),
      chart: c.chart,
      width: WIDTH_OVERRIDES[c.name] ?? (poster ? Math.max(720, Math.min(1200, sheet)) : PAGE_WIDTH),
    };
  }),
  ...PAGES.map((p) => ({ ...p, kind: "element", file: join(OUT, "pages", `${p.key}.jpg`) })),
];

if (listOnly) {
  for (const t of targets) console.log(`${t.key.padEnd(34)} ${t.kind.padEnd(8)} ${t.url}`);
  process.exit(0);
}

const unknown = wanted.filter((w) => !targets.some((t) => t.key === w));
if (unknown.length) {
  console.error(`Unknown target${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}. Run with --list to see every name.`);
  process.exit(1);
}
const queue = wanted.length ? targets.filter((t) => wanted.includes(t.key)) : targets;

// ---------------------------------------------------------------- browser

function findBrowser() {
  if (process.env.OG_CHROME) return process.env.OG_CHROME;
  for (const cache of [join(homedir(), "Library/Caches/ms-playwright"), join(homedir(), ".cache/ms-playwright")]) {
    if (!existsSync(cache)) continue;
    const builds = readdirSync(cache)
      .filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d))
      .sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop()) || (a.includes("headless") ? -1 : 1));
    for (const build of builds) {
      for (const sub of readdirSync(join(cache, build))) {
        for (const bin of ["chrome-headless-shell", "headless_shell", "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing", "Chromium.app/Contents/MacOS/Chromium", "chrome"]) {
          const path = join(cache, build, sub, bin);
          if (existsSync(path)) return path;
        }
      }
    }
  }
  for (const path of ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"]) if (existsSync(path)) return path;
  return undefined;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A minimal DevTools Protocol client: one socket to the browser, one session per tab. */
class Browser {
  static async launch() {
    const path = findBrowser();
    if (!path) throw new Error("No Chromium found. Set OG_CHROME to a Chrome or Chromium binary, or run `npx playwright install chromium`.");
    const profile = mkdtempSync(join(tmpdir(), "ic-og-"));
    const child = spawn(path, ["--headless", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
    const endpoint = await new Promise((resolve, reject) => {
      let text = "";
      const timer = setTimeout(() => reject(new Error(`The browser did not start: ${path}`)), 20000);
      child.stderr.on("data", (chunk) => {
        text += chunk;
        const m = text.match(/DevTools listening on (ws:\/\/\S+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      child.on("exit", (code) => reject(new Error(`The browser exited with code ${code}: ${path}`)));
    });
    const socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("Could not connect to the browser.")), { once: true });
    });
    return new Browser(path, child, profile, socket);
  }

  constructor(path, child, profile, socket) {
    Object.assign(this, { path, child, profile, socket });
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (p) msg.error ? p.reject(new Error(`${p.method}: ${msg.error.message}`)) : p.resolve(msg.result);
      } else if (msg.sessionId) {
        this.listeners.get(msg.sessionId)?.(msg.method, msg.params);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  async tab() {
    const { targetId } = await this.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await this.send("Target.attachToTarget", { targetId, flatten: true });
    return new Tab(this, sessionId);
  }

  close() {
    try {
      this.socket.close();
    } catch {}
    this.child.once("exit", () => {
      try {
        rmSync(this.profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      } catch {}
    });
    this.child.kill("SIGKILL");
  }
}

class Tab {
  constructor(browser, sessionId) {
    this.browser = browser;
    this.sessionId = sessionId;
    this.inflight = new Set();
    this.lastActivity = Date.now();
    this.loaded = false;
    this.errors = [];
    browser.listeners.set(sessionId, (method, params) => {
      if (method === "Network.requestWillBeSent") {
        this.inflight.add(params.requestId);
        this.lastActivity = Date.now();
      } else if (method === "Network.loadingFinished" || method === "Network.loadingFailed") {
        this.inflight.delete(params.requestId);
        this.lastActivity = Date.now();
      } else if (method === "Page.loadEventFired") {
        this.loaded = true;
      } else if (method === "Runtime.exceptionThrown") {
        this.errors.push(params.exceptionDetails?.exception?.description?.split("\n")[0] ?? params.exceptionDetails?.text ?? "Uncaught exception");
      }
    });
  }

  send(method, params) {
    return this.browser.send(method, params, this.sessionId);
  }

  async init() {
    await this.send("Page.enable");
    await this.send("Network.enable");
    await this.send("Runtime.enable");
    // Charts skip their entrance animation when the reader prefers reduced motion.
    await this.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }, { name: "prefers-color-scheme", value: "light" }] });
  }

  viewport(width, height, scale) {
    return this.send("Emulation.setDeviceMetricsOverride", { width: Math.round(width), height: Math.round(height), deviceScaleFactor: scale, mobile: false });
  }

  /** Evaluates an expression (it may be a promise) and returns its JSON value. */
  async eval(expression) {
    const { result, exceptionDetails } = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  }

  /** Navigates and waits for the load event, then for 500 ms with no request in flight. */
  async goto(url) {
    this.loaded = false;
    this.inflight.clear();
    this.errors = [];
    const { errorText } = await this.send("Page.navigate", { url });
    if (errorText) throw new Error(`${errorText}. Is the docs server running at ${BASE}?`);
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
      if (this.loaded && this.inflight.size === 0 && Date.now() - this.lastActivity > 500) return;
      await sleep(100);
    }
    if (!this.loaded) throw new Error("The page did not finish loading in 90 seconds.");
  }

  /** A PNG of one region of the page, as base64. */
  async shot(clip) {
    const { data } = await this.send("Page.captureScreenshot", { format: "png", clip: { ...clip, scale: 1 }, captureBeyondViewport: false });
    return data;
  }
}

// ---------------------------------------------------------------- what runs in the page

// Hides the preview bar and the dev overlay, ends CSS transitions at once and, for atoms and
// molecules, centres the example on its ground.
const css = (kind, pad) => `
  [data-preview-root] > header, nextjs-portal, [data-nextjs-toast] { display: none !important; }
  html { scrollbar-width: none; scroll-behavior: auto !important; }
  *, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; caret-color: transparent !important; }
  ${kind === "fit" ? `#content > div { min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; padding: ${pad}px !important; } #content > div > div { width: 100%; }` : ""}
  ${kind === "element" ? `header.sticky { display: none !important; } body * { visibility: hidden !important; } [data-og-target], [data-og-target] * { visibility: visible !important; }` : ""}
`;

const inject = (kind, pad) => `(() => {
  let style = document.getElementById("og-capture");
  if (!style) { style = document.createElement("style"); style.id = "og-capture"; document.head.append(style); }
  style.textContent = ${JSON.stringify(css(kind, pad))};
  return new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(true))));
})()`;

/** The state of a preview page: what is drawn, how tall it is, and any error it shows. */
const inspect = `(async () => {
  await document.fonts.ready;
  const text = (el) => (el?.textContent ?? "").replace(/\\s+/g, " ").trim().slice(0, 160);
  const main = document.getElementById("content");
  if (!main) return { error: "The page has no #content element: " + text(document.body) };
  const states = [...main.querySelectorAll('[data-slot="ic-state"]')];
  const alert = states.find((s) => s.getAttribute("role") === "alert") ?? [...main.querySelectorAll('[role="alert"]')].find((a) => /could not render/.test(a.textContent ?? ""));
  if (alert) return { error: "Error state: " + text(alert) };
  if (/No live preview for/.test(main.textContent ?? "")) return { error: "No live preview" };
  const canvas = main.querySelector("[data-poster-canvas]") ?? main.querySelector(":scope > div");
  const inner = canvas?.firstElementChild;
  const box = inner?.getBoundingClientRect();
  const drawings = [...main.querySelectorAll("svg, canvas")].filter((n) => { const r = n.getBoundingClientRect(); return r.width > 24 && r.height > 24; }).length;
  return { pending: states.length, pendingText: text(states[0]), height: box?.height ?? 0, width: box?.width ?? 0, drawings, textLength: (main.innerText ?? "").trim().length };
})()`;

/** Finds an element, hides the rest of the page, scrolls to it and returns its box in page coordinates. */
const locate = (selector) => `(async () => {
  await document.fonts.ready;
  let el = null;
  for (const s of ${JSON.stringify(selector)}.split(",")) { el = document.querySelector(s.trim()); if (el) break; }
  if (!el) return { error: "Nothing matches ${selector.replace(/"/g, "'")}" };
  document.querySelector("[data-og-target]")?.removeAttribute("data-og-target");
  el.setAttribute("data-og-target", "");
  // Not scrollIntoView: the site sets a scroll padding for its sticky header, which is hidden here.
  window.scrollTo(0, el.getBoundingClientRect().top + scrollY);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(true))));
  const r = el.getBoundingClientRect();
  const alert = el.querySelector('[data-slot="ic-state"][role="alert"]');
  return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height, error: alert ? "Error state: " + alert.textContent : undefined };
})()`;

/**
 * The box round everything drawn inside an element and visible in the viewport: text, SVG,
 * canvas, images and boxes with a background, border or shadow. Viewport coordinates.
 */
const tight = (root) => `(() => {
  const root = ${root};
  if (!root) return null;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (r) => {
    if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
    x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
  };
  const alpha = (c) => {
    if (!c || c === "transparent") return 0;
    if (c.includes("/")) { const a = c.split("/")[1]; return a.includes("%") ? parseFloat(a) / 100 : parseFloat(a); }
    const parts = c.match(/^rgba\\(([^)]+)\\)/)?.[1].split(",");
    return parts?.length === 4 ? parseFloat(parts[3]) : 1;
  };
  const painted = (cs) => alpha(cs.backgroundColor) > 0.03 || cs.backgroundImage !== "none" || cs.boxShadow !== "none" || ["Top", "Right", "Bottom", "Left"].some((side) => parseFloat(cs["border" + side + "Width"]) > 0 && cs["border" + side + "Style"] !== "none" && alpha(cs["border" + side + "Color"]) > 0.03);
  const walk = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "svg" || tag === "canvas" || tag === "img") return add(el.getBoundingClientRect());
    if (painted(cs)) add(el.getBoundingClientRect());
    for (const node of el.childNodes) {
      if (node.nodeType === 1) walk(node);
      else if (node.nodeType === 3 && node.textContent.trim()) { const range = document.createRange(); range.selectNodeContents(node); add(range.getBoundingClientRect()); }
    }
  };
  for (const child of root.children) walk(child);
  return x0 === Infinity ? null : { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
})()`;

/**
 * Turns the final PNG into the saved JPEG, at exactly the saved size, and measures the share
 * of it that is not its most common colour. A flat picture scores 0.
 */
const finish = (png) => `(async () => {
  const img = new Image();
  img.src = "data:image/png;base64,${png}";
  await img.decode();
  const out = document.createElement("canvas");
  out.width = ${SHOT.width}; out.height = ${SHOT.height};
  const o = out.getContext("2d");
  o.imageSmoothingQuality = "high";
  o.drawImage(img, 0, 0, out.width, out.height);
  const c = document.createElement("canvas");
  c.width = 132; c.height = 92;
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const counts = new Map();
  for (let i = 0; i < d.length; i += 4) { const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3); counts.set(k, (counts.get(k) ?? 0) + 1); }
  return { ink: 1 - Math.max(...counts.values()) / (d.length / 4), width: img.naturalWidth, height: img.naturalHeight, jpeg: out.toDataURL("image/jpeg", ${QUALITY}).split(",")[1] };
})()`;

// ---------------------------------------------------------------- capture

/** Waits until two pictures taken 400 ms apart are identical. Returns false if that never happens. */
async function settle(tab, clip, limit = 12000) {
  const deadline = Date.now() + limit;
  let previous = null;
  while (Date.now() < deadline) {
    await sleep(400);
    const now = await tab.shot(clip);
    if (now === previous) return true;
    previous = now;
  }
  return false;
}

async function waitForCharts(tab) {
  const deadline = Date.now() + 20000;
  let state;
  do {
    state = await tab.eval(inspect);
    if (state.error || (!state.pending && state.height > 0)) return state;
    await sleep(300);
  } while (Date.now() < deadline);
  return state.pending ? { ...state, error: `Still in a loading or empty state after 20 seconds: ${state.pendingText}` } : state;
}

const INNER = `(document.querySelector("#content [data-poster-canvas]") ?? document.querySelector("#content > div"))?.firstElementChild`;
/** Rounds a clip width up to a multiple of 36, so the clip's height is a whole number too. */
const snap = (width) => Math.ceil(width / 36) * 36;

/** An atom, a molecule or a template's preview. Returns the clip to photograph. */
async function framePreview(tab, t, notes) {
  const fit = t.kind === "fit";
  // A chart squeezed into a phone-sized frame is not how it is meant to be read.
  const widths = fit ? WIDTHS.filter((w) => !t.chart || w >= CHART_MIN_WIDTH) : WIDTH_OVERRIDES[t.key] ? [t.width] : [t.width, 1160, 1300];
  await tab.viewport(widths[0], Math.round(widths[0] * RATIO), SHOT.width / widths[0]);
  await tab.goto(BASE + t.url);

  let state;
  let frame;
  if (t.kind !== "poster") {
    for (const width of widths) {
      const height = Math.round(width * RATIO);
      const pad = Math.round(width * 0.045);
      await tab.viewport(width, height, SHOT.width / width);
      await tab.eval(inject("fit", pad));
      await sleep(250);
      state = await waitForCharts(tab);
      if (state.error) throw new Error(state.error);
      if (state.height + pad * 2 > height + 1) continue;
      // Some components are wider than a narrow container. Try the next width when this one spills past the padding.
      const ink = await tab.eval(tight(INNER));
      if (ink && (ink.x < pad / 2 || ink.x + ink.width > width - pad / 2) && width !== widths.at(-1)) continue;
      frame = { width, height };
      break;
    }
  }

  if (!frame) {
    // Taller than the frame at every width tried: photograph the top of it.
    const width = fit ? TALL_WIDTH : t.width;
    const height = Math.round(width * RATIO);
    await tab.viewport(width, height, SHOT.width / width);
    await tab.eval(inject(fit ? "fit" : t.kind, Math.round(width * 0.045)));
    await sleep(250);
    state = await waitForCharts(tab);
    if (state.error) throw new Error(state.error);
    check(t, state);
    notes.push(`${Math.round(state.height)}px tall at ${width}px: top shown`);
    return { x: 0, y: 0, width, height };
  }

  check(t, state);
  // The whole component fits. Centre what it draws, and move in when that is much smaller than the frame.
  await settle(tab, { x: 0, y: 0, ...frame }, 6000);
  const ink = await tab.eval(tight(INNER));
  if (!ink) throw new Error("Nothing is drawn: no SVG, no canvas, no text and no painted box.");
  const dx = frame.width / 2 - (ink.x + ink.width / 2);
  const dy = frame.height / 2 - (ink.y + ink.height / 2);
  await tab.eval(`(${INNER}).style.transform = "translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)"`);
  const wanted = snap(Math.max(ink.width * 1.1, (ink.height * 1.12) / RATIO, MIN_CLIP));
  if (wanted >= frame.width * 0.97) {
    notes.push(`fits at ${frame.width}px, drawing ${Math.round(ink.width)}x${Math.round(ink.height)}`);
    return { x: 0, y: 0, ...frame };
  }
  const clip = { width: wanted, height: wanted * RATIO };
  await tab.viewport(frame.width, frame.height, SHOT.width / clip.width);
  notes.push(`fits at ${frame.width}px, drawing ${Math.round(ink.width)}x${Math.round(ink.height)}: moved in to ${clip.width}px`);
  return { x: (frame.width - clip.width) / 2, y: (frame.height - clip.height) / 2, ...clip };
}

function check(t, state) {
  if (!state.drawings && state.textLength < 2) throw new Error("Nothing is drawn: no SVG, no canvas and no text.");
  if (t.chart && !state.drawings) throw new Error("A chart component drew no SVG or canvas.");
}

/** One element of a page, with the rest of the page hidden. Returns the clip to photograph. */
async function frameElement(tab, t, notes) {
  const pad = t.pad ?? 0;
  await tab.viewport(t.width, 800, 1);
  await tab.goto(BASE + t.url);
  await tab.eval(inject("element", 0));
  let box = await tab.eval(locate(t.selector));
  if (box.error) throw new Error(box.error);
  // Photograph the element at its own width, plus the padding asked for.
  const width = box.width + pad * 2;
  const height = Math.round(width * RATIO);
  // The viewport is as tall as the frame, so a graphic that sticks to the middle of the screen is in the middle of the picture.
  await tab.viewport(t.width, height, SHOT.width / width);
  await sleep(t.settle ?? 600);
  box = await tab.eval(locate(t.selector));
  if (box.error) throw new Error(box.error);
  const short = box.height + pad * 2 < height;
  // A short element is centred in the frame. A tall one is photographed from its top.
  const y = Math.max(0, short ? box.y - (height - box.height) / 2 : box.y - pad);
  await tab.eval(`window.scrollTo(0, ${y})`);
  notes.push(`element ${Math.round(box.width)}x${Math.round(box.height)}${short ? ", centred" : ": top shown"}`);
  return { x: box.x - pad, y, width, height };
}

async function capture(tab, t) {
  const notes = [];
  const clip = t.kind === "element" ? await frameElement(tab, t, notes) : await framePreview(tab, t, notes);
  if (!(await settle(tab, clip, t.settle ? 4000 : 12000))) notes.push("still changing after the wait");
  const { ink, jpeg, width, height } = await tab.eval(finish(await tab.shot(clip)));
  if (ink < 0.004) throw new Error(`The picture is one flat colour (${(ink * 100).toFixed(2)}% of it differs).`);
  if (Math.abs(width - SHOT.width) > 2 || Math.abs(height - SHOT.height) > 2) throw new Error(`The picture came out ${width}x${height}, not ${SHOT.width}x${SHOT.height}.`);
  const bytes = Buffer.from(jpeg, "base64");
  mkdirSync(dirname(t.file), { recursive: true });
  writeFileSync(t.file, bytes);
  if (tab.errors.length) notes.push(`page error: ${tab.errors[0]}`);
  return { bytes: bytes.length, notes };
}

// ---------------------------------------------------------------- run

try {
  const res = await fetch(BASE, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`status ${res.status}`);
} catch (error) {
  console.error(`No docs server answered at ${BASE} (${error.message}). Start one with \`pnpm --filter docs dev\` or \`pnpm --filter docs start\`.`);
  process.exit(1);
}

const browser = await Browser.launch();
console.log(`Capturing ${queue.length} of ${targets.length} targets from ${BASE} with ${browser.path}`);
const failures = [];
let total = 0;
let done = 0;
const pending = [...queue];

async function worker() {
  const tab = await browser.tab();
  await tab.init();
  for (let t = pending.shift(); t; t = pending.shift()) {
    let result;
    let message;
    // One retry: a route the dev server is compiling for the first time can time out.
    for (let attempt = 0; attempt < 2 && !result; attempt++) {
      try {
        result = await capture(tab, t);
      } catch (error) {
        message = error.message;
      }
    }
    done++;
    const n = `[${String(done).padStart(3)}/${queue.length}]`;
    if (result) {
      total += result.bytes;
      console.log(`${n} ok    ${t.key.padEnd(30)} ${String(Math.round(result.bytes / 1024)).padStart(4)} KB  ${result.notes.join("; ")}`);
    } else {
      failures.push({ key: t.key, message });
      console.log(`${n} FAIL  ${t.key.padEnd(30)} ${message}`);
    }
  }
}

try {
  await Promise.all(Array.from({ length: Math.min(PARALLEL, queue.length) }, worker));
} finally {
  browser.close();
}

console.log(`\nSaved ${queue.length - failures.length} pictures, ${(total / 1024 / 1024).toFixed(2)} MB, in ${OUT}`);
if (failures.length) {
  console.error(`\n${failures.length} failed:`);
  for (const f of failures) console.error(`  ${f.key}: ${f.message}`);
  process.exit(1);
}
