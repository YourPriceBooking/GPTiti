import type { BundledLanguage, Highlighter } from "shiki";

const THEME = "github-light-default";

const SUPPORTED_LANGUAGES = new Set<string>([
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "json",
  "html",
  "css",
  "scss",
  "python",
  "csharp",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
  "sql",
  "bash",
  "yaml",
  "markdown",
]);

const isSupportedLanguage = (language: string): language is BundledLanguage =>
  SUPPORTED_LANGUAGES.has(language);

const LANGUAGE_ALIASES: Record<string, string> = {
  cs: "csharp",
  "c#": "csharp",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  yml: "yaml",
  "c++": "cpp",
  golang: "go",
  md: "markdown",
  htm: "html",
  postgres: "sql",
  postgresql: "sql",
  mysql: "sql",
};

let highlighterPromise: Promise<Highlighter> | null = null;

const createInstance = async (): Promise<Highlighter> => {
  const shiki = await import("shiki");

  try {
    return await shiki.createHighlighter({
      themes: [THEME],
      langs: [],
      engine: shiki.createJavaScriptRegexEngine({ forgiving: true }),
    });
  } catch {
    return shiki.createHighlighter({ themes: [THEME], langs: [] });
  }
};

const getHighlighter = () => {
  highlighterPromise ??= createInstance();
  return highlighterPromise;
};

export const normalizeLanguage = (lang?: string | null): string => {
  const value = (lang ?? "").toLowerCase().trim();
  if (!value) return "text";
  return LANGUAGE_ALIASES[value] ?? value;
};

export const highlightCodeBlocks = async (root: ParentNode): Promise<void> => {
  const targets = Array.from(
    root.querySelectorAll<HTMLPreElement>(".code-block pre:not(.shiki)"),
  );
  if (targets.length === 0) return;

  const highlighter = await getHighlighter();
  const requestedLanguages = new Set(
    targets.map((pre) => {
      const code = pre.querySelector("code");
      return normalizeLanguage(
        code?.className.match(/language-([\w#+-]+)/)?.[1],
      );
    }),
  );

  await Promise.all(
    [...requestedLanguages]
      .filter(isSupportedLanguage)
      .filter(
        (language) =>
          !highlighter.getLoadedLanguages().includes(language),
      )
      .map((language) => highlighter.loadLanguage(language)),
  );

  const loaded = new Set(highlighter.getLoadedLanguages());

  for (const pre of targets) {
    const code = pre.querySelector("code");
    if (!code) continue;
    const source = code.textContent ?? "";

    const requested = normalizeLanguage(
      code.className.match(/language-([\w#+-]+)/)?.[1],
    );
    const lang = loaded.has(requested) ? requested : "text";

    pre.outerHTML = highlighter.codeToHtml(source, { lang, theme: THEME });
  }
};

export const highlightCodeHtml = async (html: string): Promise<string> => {
  if (typeof document === "undefined") return html;

  const root = document.createElement("div");
  root.innerHTML = html;
  await highlightCodeBlocks(root);
  return root.innerHTML;
};
