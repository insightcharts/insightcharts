"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type PreviewWidth = "mobile" | "tablet" | "full";
export type PreviewRenderer = "auto" | "svg" | "canvas";

export interface PreviewSettings {
  /** Forced colour mode for previews; null follows the page. */
  mode: "light" | "dark" | null;
  /** Theme forced on every preview, a key into `themes` from insightcharts/themes. Null draws each example in the theme it was authored in. */
  theme: string | null;
  /** Poster theme forced on poster previews; null draws each poster in the theme it was designed in. */
  posterTheme: string | null;
  width: PreviewWidth;
  renderer: PreviewRenderer;
  set(patch: Partial<Omit<PreviewSettings, "set">>): void;
}

const Ctx = createContext<PreviewSettings | null>(null);

/** One set of preview settings for the whole site, so every preview on a page stays in step. */
export function PreviewSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<PreviewSettings, "set">>({ mode: null, theme: null, posterTheme: null, width: "full", renderer: "auto" });
  const value = useMemo<PreviewSettings>(() => ({ ...state, set: (patch) => setState((s) => ({ ...s, ...patch })) }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePreviewSettings(): PreviewSettings {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePreviewSettings must be used inside PreviewSettingsProvider");
  return ctx;
}
