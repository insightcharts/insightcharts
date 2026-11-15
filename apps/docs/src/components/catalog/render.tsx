"use client";

import { Component, type ReactNode } from "react";
import { registerAll } from "insightcharts";
import { registry } from "@/generated/components";
import { usePreviewSettings } from "./preview-settings";

// Examples pass JSON specs in slot props (every molecule and template does). Those resolve
// through the spec registry, which <Insight> fills lazily; rendering components directly, as
// this file does, has to fill it first. Runs on the server too, so SSR output matches.
registerAll();

class Boundary extends Component<{ children: ReactNode; label: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{this.props.label} could not render.</p>
        <p className="mt-1 font-mono text-xs">{this.state.error.message}</p>
      </div>
    );
  }
}

export interface RenderProps {
  /** Component name, e.g. `bar-chart`. */
  name: string;
  /** Serialised props. Used when `example` is not given or not found; defaults to the component's `meta.example`. */
  props?: Record<string, unknown>;
  /** Title of an entry in the source file's `examples` export; its real (unserialised) props are used. */
  example?: string;
  /** Props merged over the example, e.g. a smaller `height` for cards. */
  overrides?: Record<string, unknown>;
  /** Repaint the example in the theme picked in the preview toolbar, when one is picked. Off for thumbnails. */
  followTheme?: boolean;
}

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && Object.getPrototypeOf(v) === Object.prototype;

/** Replaces every theme name in the props, at any depth, so nested specs are repainted too. */
function retheme(value: unknown, theme: string): unknown {
  if (Array.isArray(value)) return value.map((v) => retheme(v, theme));
  if (!isPlain(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "theme" && typeof v === "string" ? theme : retheme(v, theme)]));
}

/** Render a library component by name from the generated registry. */
export function Render({ name, props, example, overrides, followTheme }: RenderProps) {
  const settings = usePreviewSettings();
  const forced = followTheme ? settings.theme : null;
  const entry = registry[name];
  if (!entry?.Component) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No live preview for <code className="font-mono text-xs">{name}</code> yet. Its source file could not be loaded when the catalogue was generated.
      </div>
    );
  }
  const authored = { ...((example && entry.examples[example]) || props || (entry.Component as { meta?: { example?: Record<string, unknown> } }).meta?.example || {}), ...overrides } as Record<string, unknown>;
  // A forced theme replaces the example's own, and its own `mode` with it: that belongs to the theme it was authored in.
  const { type: _type, ...rest } = forced ? { ...(retheme(authored, forced) as Record<string, unknown>), theme: forced, mode: undefined } : authored;
  return (
    <Boundary label={name}>
      <entry.Component {...rest} />
    </Boundary>
  );
}
