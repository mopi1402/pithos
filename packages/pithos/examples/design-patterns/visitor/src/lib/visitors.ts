/**
 * Visitor functions for the email block AST.
 *
 * Each visitor traverses the same discriminated union (EmailBlock)
 * but produces a different output: HTML, plain text, or audit results.
 */

import type { EmailBlock, AuditResult } from "./types";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Visitor 1: HTML export */
export function toHtml(block: EmailBlock): string {
  switch (block.type) {
    case "header":
      return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
    case "text":
      return `<p>${escapeHtml(block.content)}</p>`;
    case "image":
      return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" />`;
    case "button":
      return `<a href="${escapeHtml(block.url)}" style="display:inline-block;padding:12px 24px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none">${escapeHtml(block.label)}</a>`;
    case "divider":
      return `<hr />`;
  }
}

/** Visitor 2: Plain text export */
export function toPlainText(block: EmailBlock): string {
  switch (block.type) {
    case "header":
      return block.level === 1
        ? `${"=".repeat(block.text.length)}\n${block.text}\n${"=".repeat(block.text.length)}`
        : `${block.text}\n${"-".repeat(block.text.length)}`;
    case "text":
      return block.content;
    case "image":
      return block.alt ? `[Image: ${block.alt}]` : `[Image]`;
    case "button":
      return `[${block.label}: ${block.url}]`;
    case "divider":
      return "---";
  }
}

/** Visitor 3: Accessibility audit */
export function audit(block: EmailBlock, index: number): AuditResult {
  switch (block.type) {
    case "header":
      if (!block.text.trim()) return { block, index, severity: "error", message: "Empty heading" };
      if (block.text.length > 80) return { block, index, severity: "warning", message: "Heading too long (>80 chars)" };
      return { block, index, severity: "pass", message: "Heading OK" };
    case "text":
      if (!block.content.trim()) return { block, index, severity: "error", message: "Empty text block" };
      return { block, index, severity: "pass", message: "Text OK" };
    case "image":
      if (!block.alt.trim()) return { block, index, severity: "error", message: "Missing alt text on image" };
      return { block, index, severity: "pass", message: `Alt text: "${block.alt}"` };
    case "button":
      if (!block.label.trim()) return { block, index, severity: "error", message: "Button has no label" };
      if (block.label.toLowerCase() === "click here") return { block, index, severity: "warning", message: "Vague button label (\"click here\")" };
      return { block, index, severity: "pass", message: "Button OK" };
    case "divider":
      return { block, index, severity: "pass", message: "Decorative divider" };
  }
}
