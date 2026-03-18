import type { BlockToken, RefLinkMap } from "./types";

// ─── Reference link definition regex ────────────────────────────────
// [id]: url "optional title"
const REF_LINK_RE = /^\[([^\]]+)\]:\s+<?(\S+?)>?(?:\s+["'(](.+?)["')])?$/;

// ─── HTML block detection ───────────────────────────────────────────
const HTML_BLOCK_OPEN = /^<(address|article|aside|base|blockquote|body|caption|col|colgroup|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|head|header|hgroup|hr|html|legend|li|link|main|menu|meta|nav|ol|optgroup|option|p|param|pre|script|section|select|source|style|summary|table|tbody|td|template|tfoot|th|thead|title|tr|track|ul)[\s/>]/i;

export type TokenizeResult = {
  tokens: BlockToken[];
  refLinks: RefLinkMap;
};

export function tokenize(src: string): BlockToken[] {
  return tokenizeWithRefs(src).tokens;
}

export function tokenizeWithRefs(src: string): TokenizeResult {
  const lines = src.split("\n");
  const tokens: BlockToken[] = [];
  const refLinks: RefLinkMap = new Map();
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Reference link definition ─────────────────────────────────
    const refMatch = line.match(REF_LINK_RE);
    if (refMatch) {
      refLinks.set(refMatch[1].toLowerCase(), {
        href: refMatch[2],
        title: refMatch[3] ?? "",
      });
      i++;
      continue;
    }

    // ── Fenced code block ─────────────────────────────────────────
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      tokens.push({ kind: "code-block", lang, code: codeLines.join("\n") });
      i++;
      continue;
    }

    // ── Indented code block (4 spaces or 1 tab) ──────────────────
    if (/^( {4}|\t)/.test(line) && !isInList(tokens)) {
      const codeLines: string[] = [];
      while (i < lines.length && (/^( {4}|\t)/.test(lines[i]) || lines[i].trim() === "")) {
        codeLines.push(lines[i].replace(/^( {4}|\t)/, ""));
        i++;
      }
      // Trim trailing empty lines
      while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === "") {
        codeLines.pop();
      }
      if (codeLines.length > 0) {
        tokens.push({ kind: "code-block", lang: "", code: codeLines.join("\n") });
        continue;
      }
    }

    // ── HTML block ────────────────────────────────────────────────
    if (HTML_BLOCK_OPEN.test(line)) {
      const htmlLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim() !== "") {
        htmlLines.push(lines[i]);
        i++;
      }
      tokens.push({ kind: "html-block", content: htmlLines.join("\n") });
      continue;
    }

    // ── Horizontal rule (---, ***, ___) ───────────────────────────
    if (/^[-*_]{3,}\s*$/.test(line.trim()) && !/^[-*]\s+/.test(line)) {
      tokens.push({ kind: "hr" });
      i++;
      continue;
    }

    // ── ATX heading (#) ──────────────────────────────────────────
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?$/);
    if (headingMatch) {
      tokens.push({
        kind: "heading",
        level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        content: headingMatch[2],
      });
      i++;
      continue;
    }

    // ── Setext heading (underline with === or ---) ───────────────
    if (
      i + 1 < lines.length &&
      line.trim() !== "" &&
      /^[=-]+\s*$/.test(lines[i + 1])
    ) {
      const level = lines[i + 1].trim().startsWith("=") ? 1 : 2;
      tokens.push({
        kind: "heading",
        level: level as 1 | 2,
        content: line.trim(),
      });
      i += 2;
      continue;
    }

    // ── Table ────────────────────────────────────────────────────
    if (i + 1 < lines.length && isTableSeparator(lines[i + 1]) && line.includes("|")) {
      const headerLine = line;
      const separatorLine = lines[i + 1];
      const bodyLines: string[] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        bodyLines.push(lines[i]);
        i++;
      }
      tokens.push({ kind: "table", headerLine, separatorLine, bodyLines });
      continue;
    }

    // ── Blockquote ───────────────────────────────────────────────
    if (/^>\s?/.test(line)) {
      const bqLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        bqLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      tokens.push({ kind: "blockquote", lines: bqLines });
      continue;
    }

    // ── Unordered list item ──────────────────────────────────────
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
    if (ulMatch) {
      tokens.push({ kind: "list-item", indent: ulMatch[1].length, ordered: false, content: ulMatch[3] });
      i++;
      continue;
    }

    // ── Ordered list item ────────────────────────────────────────
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      tokens.push({ kind: "list-item", indent: olMatch[1].length, ordered: true, content: olMatch[2] });
      i++;
      continue;
    }

    // ── Empty line ───────────────────────────────────────────────
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ── Paragraph ────────────────────────────────────────────────
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !/^>\s?/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^[-*_]{3,}\s*$/.test(lines[i].trim()) &&
      !HTML_BLOCK_OPEN.test(lines[i]) &&
      !REF_LINK_RE.test(lines[i]) &&
      !(i + 1 < lines.length && isTableSeparator(lines[i + 1]) && lines[i].includes("|")) &&
      !(i + 1 < lines.length && /^[=-]+\s*$/.test(lines[i + 1]))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    tokens.push({ kind: "paragraph", content: paraLines.join(" ") });
  }

  return { tokens, refLinks };
}

function isTableSeparator(line: string): boolean {
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(line.trim());
}

function isInList(tokens: BlockToken[]): boolean {
  return tokens.length > 0 && tokens[tokens.length - 1].kind === "list-item";
}
