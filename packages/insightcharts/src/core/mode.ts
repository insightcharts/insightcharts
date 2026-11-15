import { useEffect, useState, type RefObject } from "react";
import { luminance, toRgba } from "./color";

export type ColorMode = "light" | "dark";
/** `"system"` follows the OS; `"auto"` (default) follows what the page actually looks like. */
export type ModeInput = ColorMode | "system" | "auto";

const DARK = '.dark,[data-theme="dark"],[data-mode="dark"],[data-color-mode="dark"],[data-color-scheme="dark"]';
const LIGHT = '.light,[data-theme="light"],[data-mode="light"],[data-color-mode="light"],[data-color-scheme="light"]';

export function systemMode(): ColorMode {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Work out the colour mode a chart should render in, from most to least explicit:
 * 1. the nearest ancestor carrying a dark/light class or data attribute (shadcn, next-themes, Tailwind)
 * 2. the luminance of the nearest painted background behind the chart
 * 3. the page's `color-scheme` combined with the OS preference
 */
export function detectMode(el: Element | null): ColorMode {
  if (!el || typeof document === "undefined") return "light";
  const dark = el.closest(DARK);
  const light = el.closest(LIGHT);
  if (dark && light) return dark.contains(light) ? "light" : "dark";
  if (dark) return "dark";
  if (light) return "light";
  for (let node: Element | null = el; node; node = node.parentElement) {
    const bg = toRgba(getComputedStyle(node).backgroundColor);
    if (bg && bg[3] > 0.5) return luminance(`rgb(${bg[0]},${bg[1]},${bg[2]})`) < 0.2 ? "dark" : "light";
  }
  const scheme = getComputedStyle(document.documentElement).colorScheme || "";
  if (scheme.includes("dark") && !scheme.includes("light")) return "dark";
  if (scheme.includes("dark") && systemMode() === "dark") return "dark";
  return "light";
}

/** Which mode the inherited `--foreground` was written for: light ink means a dark theme. Null when the page defines none. */
function hostVarsMode(el: Element | null): ColorMode | null {
  if (!el || typeof getComputedStyle !== "function") return null;
  const ink = getComputedStyle(el).getPropertyValue("--foreground").trim();
  if (!ink) return null;
  const c = toRgba(ink);
  return c ? (luminance(`rgb(${c[0]},${c[1]},${c[2]})`) > 0.4 ? "dark" : "light") : null;
}

const HOST_VARS = ["--foreground", "--background", "--muted-foreground", "--border"];

// One shared observer for the whole page: charts subscribe and re-check when the
// root's theme attributes or the OS preference change.
const listeners = new Set<() => void>();
let started = false;
let epoch = 0;
let scheduled = false;

function notify() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    epoch++;
    listeners.forEach((l) => l());
  });
}

function start() {
  if (started || typeof document === "undefined") return;
  started = true;
  const filter = { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-mode", "data-color-mode", "data-color-scheme"] };
  const mo = new MutationObserver(notify);
  mo.observe(document.documentElement, filter);
  if (document.body) mo.observe(document.body, filter);
  if (typeof matchMedia === "function") matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", notify);
}

export function subscribeAppearance(listener: () => void): () => void {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Resolve the colour mode for an element and keep it current. Also returns an `epoch` that
 * ticks whenever the page's appearance changes, so token resolution can re-run for
 * theme swaps that do not flip dark/light (e.g. switching brand colour).
 */
export function useColorMode(ref: RefObject<Element | null>, input: ModeInput = "auto"): { mode: ColorMode; epoch: number } {
  const [state, setState] = useState<{ mode: ColorMode; epoch: number }>({ mode: input === "dark" ? "dark" : "light", epoch: 0 });
  useEffect(() => {
    const read = () => {
      const mode = input === "light" || input === "dark" ? input : input === "system" ? systemMode() : detectMode(ref.current);
      // When the page's own ink variable belongs to the other mode (forced dark on a light
      // site, or a dark panel on a light page that never set a `.dark` class), inheriting
      // it would draw text in the wrong mode's colours.
      // Resetting them on this element makes every `var(--foreground, fallback)` use its fallback.
      const node = ref.current as HTMLElement | null;
      const isolated = !!node && hostVarsMode(node.parentElement) === (mode === "dark" ? "light" : "dark");
      if (node?.style) {
        for (const name of HOST_VARS) {
          if (isolated) node.style.setProperty(name, "initial");
          else if (node.style.getPropertyValue(name) === "initial") node.style.removeProperty(name);
        }
        if (isolated) node.style.colorScheme = mode;
      }
      // Half-steps let token resolution re-run when only the isolation changed.
      const e = epoch + (isolated ? 0.5 : 0);
      setState((s) => (s.mode === mode && s.epoch === e ? s : { mode, epoch: e }));
    };
    read();
    return subscribeAppearance(read);
  }, [input, ref]);
  return state;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}
