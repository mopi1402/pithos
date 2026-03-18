/**
 * Markdown Interpreter — evaluator (the Interpreter pattern).
 *
 * This file IS the pattern: a recursive fold over a discriminated union AST.
 * No library needed — just a switch on the discriminant + recursion.
 */

import { tokenizeWithRefs, parse, type MdNode } from "./parsing-pipeline";
import { escape as escapeHtml } from "@pithos/core/arkhe/string/escape";
import { evalChildren, evalListItem, evalTable } from "./evalHelpers";

export type { MdNode } from "./parsing-pipeline";

// ─── Evaluator (AST → HTML) — the Interpreter pattern ──────────────

type EvalContext = { indent: number };

function evalNode(node: MdNode, ctx: EvalContext): string {
  switch (node.type) {
    case "document":
      return node.children.map((c) => evalNode(c, ctx)).join("\n");
    case "heading":
      return `<h${node.level}>${evalChildren(node.children, ctx, evalNode)}</h${node.level}>`;
    case "paragraph":
      return `<p>${evalChildren(node.children, ctx, evalNode)}</p>`;
    case "blockquote":
      return `<blockquote>${node.children.map((c) => evalNode(c, ctx)).join("\n")}</blockquote>`;
    case "code-block":
      return `<pre><code class="language-${escapeHtml(node.lang)}">${escapeHtml(node.code)}</code></pre>`;
    case "hr":
      return "<hr />";
    case "unordered-list":
      return `<ul>${node.items.map((item) => evalListItem(item, ctx, evalNode)).join("")}</ul>`;
    case "ordered-list":
      return `<ol>${node.items.map((item) => evalListItem(item, ctx, evalNode)).join("")}</ol>`;
    case "table":
      return evalTable(node, ctx, evalNode);
    case "text":
      return escapeHtml(node.value);
    case "bold":
      return `<strong>${evalChildren(node.children, ctx, evalNode)}</strong>`;
    case "italic":
      return `<em>${evalChildren(node.children, ctx, evalNode)}</em>`;
    case "bold-italic":
      return `<strong><em>${evalChildren(node.children, ctx, evalNode)}</em></strong>`;
    case "strikethrough":
      return `<del>${evalChildren(node.children, ctx, evalNode)}</del>`;
    case "inline-code":
      return `<code>${escapeHtml(node.value)}</code>`;
    case "link":
      return `<a href="${escapeHtml(node.href)}" target="_blank" rel="noopener noreferrer">${evalChildren(node.children, ctx, evalNode)}</a>`;
    case "autolink":
      return `<a href="${escapeHtml(node.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(node.href)}</a>`;
    case "image":
      return `<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}" />`;
    case "checkbox":
      return node.checked
        ? `<input type="checkbox" checked disabled /> `
        : `<input type="checkbox" disabled /> `;
    case "line-break":
      return "<br />";
    case "html-block":
      return node.content;
    case "inline-html":
      return node.content;
  }
}

// ─── Public API ─────────────────────────────────────────────────────

/** Full pipeline: source → tokens → AST → HTML */
export function renderMarkdown(source: string): { ast: MdNode; html: string } {
  const { tokens, refLinks } = tokenizeWithRefs(source);
  const ast = parse(tokens, refLinks);
  const html = evalNode(ast, { indent: 0 });
  return { ast, html };
}


























