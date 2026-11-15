"use client";

import { usePreviewSettings } from "./preview-settings";
import { Render, type RenderProps } from "./render";

/**
 * Renders a poster, repainted in the poster theme picked in the preview toolbar when one is.
 * A forced theme also clears the example's own `background` and `mode`, which belong to the
 * theme it was designed in.
 */
export function PosterRender({ overrides, ...props }: RenderProps) {
  const { posterTheme } = usePreviewSettings();
  return <Render {...props} overrides={posterTheme ? { ...overrides, theme: posterTheme, background: undefined, mode: undefined } : overrides} />;
}
