import { CodeBlock } from "@/components/site/code-block";
import { specToJson, specToJsx } from "@/lib/codegen";
import { getComponent, isPoster, isPosterPrimitive } from "@/lib/catalog";
import { posterGround } from "@/lib/posters";
import { ClientOnly } from "./lazy";
import { PosterRender } from "./poster-render";
import { PreviewFrame } from "./preview-frame";
import { Render } from "./render";

/**
 * A live example with Preview / Code / JSON tabs. The code is generated from the same spec
 * that renders, so the three tabs cannot drift apart.
 */
export function ComponentPreview({ spec, example, toolbar, maxHeight, fullHref, lazy, className }: { spec: Record<string, unknown>; example?: string; toolbar?: boolean; maxHeight?: number; fullHref?: string; /** Mount a poster only when it nears the viewport. */ lazy?: boolean; className?: string }) {
  const name = String(spec.type);
  const entry = getComponent(name);
  // A poster gets its own frame: its painted ground edge to edge, poster themes, PNG download.
  const poster = entry && isPoster(entry) ? { ground: posterGround(spec, entry), lazy } : undefined;
  const hasFunctions = JSON.stringify(spec).includes('"[function]"');
  return (
    <PreviewFrame
      toolbar={toolbar}
      maxHeight={maxHeight}
      fullHref={fullHref}
      poster={poster}
      className={className}
      code={<CodeBlock bare code={specToJsx(spec)} lang="tsx" maxHeight={560} />}
      json={
        <>
          <CodeBlock bare code={specToJson(spec)} lang="json" maxHeight={560} />
          <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
            Render with <code className="font-mono text-foreground">{'import { Insight } from "insightcharts"'}</code> and <code className="font-mono text-foreground">{"<Insight spec={spec} />"}</code>. Nested specs resolve by name; nothing else to import.{hasFunctions ? " Function props are shown as \"[function]\" and cannot be sent as JSON." : ""}
          </p>
        </>
      }
    >
      {poster ? (
        <PosterRender name={name} props={spec} example={example} />
      ) : entry && isPosterPrimitive(entry) ? (
        <ClientOnly className="min-h-[320px]">
          <Render name={name} props={spec} example={example} />
        </ClientOnly>
      ) : (
        <Render name={name} props={spec} example={example} />
      )}
    </PreviewFrame>
  );
}
