"use client";

import { Scrolly, themeGround, useColorMode, type StoryState, type StoryStep } from "insightcharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface StoryOptions {
  /**
   * `"scroll"` pins the graphic while the steps scroll past. `"steps"` shows one step at a time
   * with buttons. `"auto"` (default) is scroll, or swipeable cards on a narrow touch screen.
   */
  mode?: "auto" | "scroll" | "steps";
  /** Height of a sticky header above the story, in px. */
  stickyTop?: number;
  /** Scroll distance per step. */
  stepHeight?: string;
}

interface StoryFrameProps<S extends StoryStep> extends StoryOptions {
  /** Prefix for the step anchors, so two stories on one page never share an id. */
  name: string;
  /** A built-in theme by name. The frame paints that theme's ground behind the whole story. */
  theme: string;
  steps: S[];
  children: (state: StoryState<S>) => ReactNode;
}

/**
 * A scroll story on its theme's own ground, with previous and next buttons. In scroll mode
 * the buttons and the left and right arrow keys scroll the page to the neighbouring step,
 * so the story can be read without a wheel or a touch screen.
 */
export function StoryFrame<S extends StoryStep>({ name, theme, steps, children, mode = "auto", stickyTop = 72, stepHeight = "80vh" }: StoryFrameProps<S>) {
  const root = useRef<HTMLDivElement>(null);
  const { mode: colorMode } = useColorMode(root, "auto");
  const [index, setIndex] = useState(0);
  // The mode Scrolly settled on, read from its root: "auto" depends on the width and the pointer.
  const [resolved, setResolved] = useState(mode === "steps" ? "steps" : "scroll");
  useEffect(() => {
    const node = root.current?.querySelector<HTMLElement>('[data-slot="ic-scrolly"]');
    if (!node) return;
    const read = () => setResolved(node.dataset.mode ?? "scroll");
    read();
    const mo = new MutationObserver(read);
    mo.observe(node, { attributes: true, attributeFilter: ["data-mode"] });
    return () => mo.disconnect();
  }, [mode]);
  const anchored = steps.map((s, i) => ({ ...s, id: `${name}-${s.id ?? i + 1}` }));

  const go = (next: number) => {
    const to = Math.min(steps.length - 1, Math.max(0, next));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(anchored[to].id)?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  };
  const onKey = (e: KeyboardEvent) => {
    if (resolved !== "scroll") return;
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
  };

  const button = "inline-grid size-7 place-items-center rounded-full border border-current/25 transition-opacity hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-30";
  return (
    <div ref={root} data-story={name} onKeyDown={onKey} className="rounded-2xl px-4 sm:px-8" style={{ background: themeGround(theme, colorMode) ?? undefined }}>
      <Scrolly steps={anchored as S[]} mode={mode} theme={theme} stickyTop={stickyTop} stepHeight={stepHeight} onStepChange={setIndex} style={resolved === "scroll" ? undefined : { paddingBlock: 24 }}>
        {(state) => (
          <div className="min-w-0">
            {children(state)}
            {resolved === "scroll" ? (
              <nav aria-label={`Steps of the ${name} story`} className="mt-3 flex items-center gap-2 text-xs" style={{ color: "var(--_ic-ink-2)" }}>
                <button type="button" className={button} aria-label="Previous step" disabled={state.index === 0} onClick={() => go(state.index - 1)}>
                  <ChevronLeft className="size-3.5" aria-hidden />
                </button>
                <button type="button" className={button} aria-label="Next step" disabled={state.index === state.count - 1} onClick={() => go(state.index + 1)}>
                  <ChevronRight className="size-3.5" aria-hidden />
                </button>
                <span className="tabular-nums">
                  Step {state.index + 1} of {state.count}
                </span>
              </nav>
            ) : null}
          </div>
        )}
      </Scrolly>
    </div>
  );
}
