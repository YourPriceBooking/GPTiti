import DOMPurify from "dompurify";
import { marked } from "marked";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? "").trim().split(/\s+/)[0] || "text";
      return (
        `<div class="code-block">` +
        `<div class="code-surface">` +
        `<div class="code-header">` +
        `<span class="code-lang">${escapeHtml(language)}</span>` +
        `</div>` +
        `<pre><code class="language-${escapeHtml(language)}">${escapeHtml(text)}</code></pre>` +
        `</div>` +
        `<button type="button" class="code-copy-btn" aria-label="Copy code">` +
        `<span class="code-copy-icon"></span>` +
        `<span class="code-copy-label">Copied</span>` +
        `</button>` +
        `</div>`
      );
    },
  },
});

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "span",
  "div",
  "strong",
  "em",
  "b",
  "i",
  "del",
  "s",
  "sup",
  "sub",
  "blockquote",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "a",
  "img",
  "button",
];

const ALLOWED_ATTR = [
  "href",
  "title",
  "alt",
  "src",
  "lang",
  "class",
  "type",
  "aria-label",
  "start",
  "align",
  "colspan",
  "rowspan",
  "target",
  "rel",
];

const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|#)/i;

let linkHookRegistered = false;

const registerLinkHook = () => {
  if (linkHookRegistered) return;
  linkHookRegistered = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName !== "A") return;
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer nofollow");
  });
};

export const renderAssistantMarkdown = (markdown: string): string => {
  const raw = marked.parse(markdown, { async: false });
  if (!DOMPurify.isSupported) return escapeHtml(raw);

  registerLinkHook();

  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    FORBID_TAGS: ["style", "form", "input", "textarea", "select", "iframe"],
    FORBID_ATTR: ["style"],
  });
};
