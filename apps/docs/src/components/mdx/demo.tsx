import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PreviewCanvas, PreviewFrame } from "@/components/catalog/preview-frame";
import { CodeBlock } from "@/components/site/code-block";
import { demos } from "@/demos";

async function demoSource(name: string): Promise<string> {
  const text = await readFile(join(process.cwd(), "src/demos", `${name}.tsx`), "utf8");
  return text.replace(/^"use client";\n+/, "");
}

/**
 * A hand-written demo from src/demos with its real source under the Code tab: the file is
 * read at build time, so what you read is exactly what runs.
 */
export async function Demo({ name, toolbar = true, code = true, flush, props }: { name: string; toolbar?: boolean; code?: boolean; /** The demo paints its own background: give it the whole canvas, with no padding round it. */ flush?: boolean; props?: Record<string, unknown> }) {
  const Component = demos[name];
  if (!Component) throw new Error(`Unknown demo "${name}". Add it to src/demos/index.ts.`);
  return (
    <PreviewFrame toolbar={toolbar} flush={flush} code={code ? <CodeBlock bare code={await demoSource(name)} lang="tsx" maxHeight={520} /> : undefined}>
      <Component {...props} />
    </PreviewFrame>
  );
}

/** A demo with no frame, tabs or toolbar: for the landing page, where the page is the frame. */
export function BareDemo({ name, props }: { name: string; props?: Record<string, unknown> }) {
  const Component = demos[name];
  return (
    <PreviewCanvas padded={false}>
      <Component {...props} />
    </PreviewCanvas>
  );
}

export async function DemoSource({ name, maxHeight = 420 }: { name: string; maxHeight?: number }) {
  return <CodeBlock code={await demoSource(name)} lang="tsx" maxHeight={maxHeight} />;
}
