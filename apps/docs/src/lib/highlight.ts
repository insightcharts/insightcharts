import { createHighlighter, type Highlighter } from "shiki";

let instance: Promise<Highlighter> | undefined;

const LANGS = ["tsx", "ts", "json", "bash", "css", "html", "md"] as const;
export type Lang = (typeof LANGS)[number];

/** One highlighter for the whole build. Colours are emitted as CSS variables for both modes. */
export async function highlight(code: string, lang: Lang = "tsx"): Promise<string> {
  instance ??= createHighlighter({ themes: ["github-light-default", "github-dark-default"], langs: [...LANGS] });
  const h = await instance;
  return h.codeToHtml(code, { lang, themes: { light: "github-light-default", dark: "github-dark-default" }, defaultColor: false });
}
