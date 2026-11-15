import { vi } from "vitest";
import type { ChartContext } from "../src/core/chart";
import { defaultTheme, resolveTokens, type ThemeTokens } from "../src/core/theme";

/**
 * jsdom has no canvas: `getContext` logs "not implemented" and returns undefined. Colour
 * parsing falls back to its regex path either way; this only keeps the test output quiet.
 */
export function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
}

/** A chart context as `build` functions and option helpers receive it, with no DOM involved. */
export function makeCtx(overrides: Partial<ChartContext> = {}, tokens: ThemeTokens = defaultTheme.light): ChartContext {
  return { tokens: resolveTokens(tokens), mode: "light", width: 640, height: 360, compact: false, locale: "en-US", animate: false, ...overrides };
}
