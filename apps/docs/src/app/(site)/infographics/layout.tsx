import type { ReactNode } from "react";
import { DocsFrame } from "@/components/site/docs-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsFrame>{children}</DocsFrame>;
}
