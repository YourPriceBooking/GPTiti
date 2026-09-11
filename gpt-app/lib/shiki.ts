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

export const detectLanguage = (code: string): string => {
  const sample = code.slice(0, 2000);

  if (/^\s*[{[]/.test(sample) && /"[\w-]+"\s*:/.test(sample)) return "json";

  if (/className=|=\{\{|<\/?[A-Z][\w.]*/.test(sample)) return "tsx";

  if (/^\s*<(!doctype|html|head|body|div|section|main|script)\b/i.test(sample))
    return "html";

  if (
    /(^|\n)\s*(interface|type)\s+\w+\s*[={]|:\s*(string|number|boolean)\b/.test(
      sample,
    )
  )
    return "typescript";

  if (
    /(^|\n)\s*(import\s.+from\s|export\s+(default|const|function|class)|const\s+\w+\s*=|let\s+\w+\s*=|function\s+\w+\s*\(|=>)/.test(
      sample,
    )
  )
    return "javascript";

  if (/(^|\n)\s*(def|class)\s+\w+|(^|\n)\s*print\(/.test(sample))
    return "python";

  if (
    /(^|\n)\s*(select|insert into|update|delete from|create table)\s/i.test(
      sample,
    )
  )
    return "sql";

  if (
    /(^|\n)\s*(npm|npx|yarn|pnpm|git|cd|sudo|docker|curl|mkdir)\s/.test(sample)
  )
    return "bash";

  if (/[.#]?[\w-]+\s*\{[^}]*[\w-]+\s*:[^}]*;/.test(sample)) return "css";

  return "text";
};

const CODE_LINE =
  /^\s{2,}\S|[;{}()[\]>,]\s*$|^\s*(import|export|const|let|var|function|class|def|return|if|for|while|<\/?\w|\w+\s*[:=])/;

const hasCodeShape = (block: string): boolean => {
  const lines = block.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return false;

  const codeLines = lines.filter((line) => CODE_LINE.test(line)).length;
  return codeLines / lines.length >= 0.8;
};

export const fenceBareCodeBlocks = (text: string): string => {
  if (text.includes("```")) return text;

  const blocks = text.split(/\n[ \t]*\n/);
  const shaped = blocks.map(hasCodeShape);
  const flags = blocks.map(
    (block, index) => shaped[index] && detectLanguage(block) !== "text",
  );
  if (!flags.includes(true)) return text;

  for (let i = blocks.length - 2; i >= 0; i -= 1) {
    if (shaped[i] && flags[i + 1]) flags[i] = true;
  }
  for (let i = 1; i < blocks.length; i += 1) {
    if (shaped[i] && flags[i - 1]) flags[i] = true;
  }

  const result: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    const code = buffer.join("\n\n");
    result.push(`\`\`\`${detectLanguage(code)}\n${code}\n\`\`\``);
    buffer = [];
  };

  blocks.forEach((block, index) => {
    if (flags[index]) {
      buffer.push(block);
      return;
    }
    flush();
    result.push(block);
  });

  flush();

  return result.join("\n\n");
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
        (language) => !highlighter.getLoadedLanguages().includes(language),
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
