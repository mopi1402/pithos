import type { MdNode, BlockToken, ListItem, TableAlign, RefLinkMap } from "./types";
import { tokenizeWithRefs } from "./tokenizer";

// ─── Inline scanner (char-by-char) ──────────────────────────────────

function parseInline(src: string, refs: RefLinkMap): MdNode[] {
  const nodes: MdNode[] = [];
  let buf = "";
  let i = 0;

  function flush() {
    if (buf.length > 0) {
      nodes.push({ type: "text", value: buf });
      buf = "";
    }
  }

  function peek(offset = 0): string {
    return src[i + offset] ?? "";
  }

  function startsWith(s: string): boolean {
    return src.startsWith(s, i);
  }

  function readUntil(close: string): string | null {
    let j = i;
    let result = "";
    while (j < src.length) {
      if (src[j] === "\\" && j + 1 < src.length) {
        result += src[j + 1];
        j += 2;
        continue;
      }
      if (src.startsWith(close, j)) return result;
      result += src[j];
      j++;
    }
    return null;
  }

  function readBracket(): string | null {
    if (src[i] !== "[") return null;
    let depth = 0;
    let j = i;
    while (j < src.length) {
      if (src[j] === "\\" && j + 1 < src.length) { j += 2; continue; }
      if (src[j] === "[") depth++;
      if (src[j] === "]") { depth--; if (depth === 0) return src.slice(i + 1, j); }
      j++;
    }
    return null;
  }

  while (i < src.length) {
    const ch = src[i];

    // ── Escape ──────────────────────────────────────────────────
    if (ch === "\\" && i + 1 < src.length) {
      const next = src[i + 1];
      if (next === "\n") { flush(); nodes.push({ type: "line-break" }); i += 2; continue; }
      if ("\\`*_{}[]()#+-.!~|>".includes(next)) { buf += next; i += 2; continue; }
    }

    // ── Line break (2+ spaces + newline) ────────────────────────
    if (ch === " ") {
      let spaces = 0;
      let j = i;
      while (j < src.length && src[j] === " ") { spaces++; j++; }
      if (spaces >= 2 && src[j] === "\n") { flush(); nodes.push({ type: "line-break" }); i = j + 1; continue; }
    }

    // ── Inline code ─────────────────────────────────────────────
    if (ch === "`") {
      const saved = i; i++;
      const content = readUntil("`");
      if (content !== null) { flush(); i += content.length + 1; nodes.push({ type: "inline-code", value: content }); continue; }
      i = saved;
    }

    // ── Bold-italic ***...*** ───────────────────────────────────
    if (startsWith("***")) {
      const saved = i; i += 3;
      const content = readUntil("***");
      if (content !== null) { flush(); i += content.length + 3; nodes.push({ type: "bold-italic", children: parseInline(content, refs) }); continue; }
      i = saved;
    }

    // ── Bold **...** ────────────────────────────────────────────
    if (startsWith("**")) {
      const saved = i; i += 2;
      const content = readUntil("**");
      if (content !== null) { flush(); i += content.length + 2; nodes.push({ type: "bold", children: parseInline(content, refs) }); continue; }
      i = saved;
    }

    // ── Italic *...* ────────────────────────────────────────────
    if (ch === "*" && peek(1) !== "*") {
      const saved = i; i += 1;
      const content = readUntil("*");
      if (content !== null && content.length > 0) { flush(); i += content.length + 1; nodes.push({ type: "italic", children: parseInline(content, refs) }); continue; }
      i = saved;
    }

    // ── Strikethrough ~~...~~ ───────────────────────────────────
    if (startsWith("~~")) {
      const saved = i; i += 2;
      const content = readUntil("~~");
      if (content !== null) { flush(); i += content.length + 2; nodes.push({ type: "strikethrough", children: parseInline(content, refs) }); continue; }
      i = saved;
    }

    // ── Checkbox [x] / [ ] ──────────────────────────────────────
    if (ch === "[" && (peek(1) === " " || peek(1) === "x" || peek(1) === "X") && peek(2) === "]") {
      flush(); nodes.push({ type: "checkbox", checked: peek(1).toLowerCase() === "x" }); i += 3; continue;
    }

    // ── Angle-bracket link/email: <url> or <email> ──────────────
    if (ch === "<") {
      const saved = i; i++;
      const content = readUntil(">");
      if (content !== null && content.length > 0) {
        flush();
        i += content.length + 1;
        if (/^https?:\/\//.test(content) || /^mailto:/.test(content)) {
          nodes.push({ type: "autolink", href: content });
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content)) {
          nodes.push({ type: "autolink", href: `mailto:${content}` });
        } else if (/^<?\/?[a-zA-Z][a-zA-Z0-9]*[\s>/]/.test(`<${content}>`)) {
          // Inline HTML tag
          nodes.push({ type: "inline-html", content: `<${content}>` });
        } else {
          // Not a recognized pattern, put it back as text
          buf += `<${content}>`;
        }
        continue;
      }
      i = saved;
    }

    // ── Linked image: [![alt](img)](href) ───────────────────────
    if (startsWith("[![")) {
      const rest = src.slice(i);
      const m = rest.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
      if (m) {
        flush();
        nodes.push({ type: "link", href: m[3], children: [{ type: "image", alt: m[1], src: m[2] }] });
        i += m[0].length;
        continue;
      }
    }

    // ── Image: ![alt](src) ──────────────────────────────────────
    if (ch === "!" && peek(1) === "[") {
      const saved = i; i += 2;
      const alt = readUntil("]");
      if (alt !== null) {
        i += alt.length + 1;
        if (src[i] === "(") {
          i++;
          const imgSrc = readUntil(")");
          if (imgSrc !== null) { flush(); i += imgSrc.length + 1; nodes.push({ type: "image", alt, src: imgSrc }); continue; }
        }
      }
      i = saved;
    }

    // ── Link: [text](href) or reference [text][id] or [id] ─────
    if (ch === "[") {
      const saved = i;
      const inner = readBracket();
      if (inner !== null) {
        i += inner.length + 2; // past ]

        // Inline link [text](href)
        if (src[i] === "(") {
          i++;
          const href = readUntil(")");
          if (href !== null) { flush(); i += href.length + 1; nodes.push({ type: "link", href, children: parseInline(inner, refs) }); continue; }
        }

        // Reference link [text][id]
        if (src[i] === "[") {
          const refId = readBracket();
          if (refId !== null) {
            i += refId.length + 2;
            const key = (refId || inner).toLowerCase();
            const ref = refs.get(key);
            if (ref) { flush(); nodes.push({ type: "link", href: ref.href, children: parseInline(inner, refs) }); continue; }
          }
        }

        // Shortcut reference [id]
        const ref = refs.get(inner.toLowerCase());
        if (ref) { flush(); nodes.push({ type: "link", href: ref.href, children: parseInline(inner, refs) }); continue; }
      }
      i = saved;
    }

    // ── Bare autolink: https://... ──────────────────────────────
    if (startsWith("https://") || startsWith("http://")) {
      let j = i;
      while (j < src.length && src[j] !== " " && src[j] !== "\n" && src[j] !== "\t" && src[j] !== "<") j++;
      while (j > i && ".,;:!?)\"']".includes(src[j - 1])) j--;
      if (j > i) { flush(); nodes.push({ type: "autolink", href: src.slice(i, j) }); i = j; continue; }
    }

    buf += ch;
    i++;
  }

  flush();
  return nodes;
}

// ─── Table helpers ──────────────────────────────────────────────────

function parseTableCells(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function parseAlignments(sep: string): TableAlign[] {
  return parseTableCells(sep).map((cell) => {
    const l = cell.startsWith(":");
    const r = cell.endsWith(":");
    if (l && r) return "center";
    if (r) return "right";
    if (l) return "left";
    return "none";
  });
}

// ─── List builder (nested via indent) ───────────────────────────────

interface RawListItem { indent: number; ordered: boolean; content: string }

function buildNestedList(items: RawListItem[], base: number, refs: RefLinkMap): { node: MdNode; consumed: number } {
  const listItems: ListItem[] = [];
  const ordered = items[0].ordered;
  let i = 0;
  while (i < items.length && items[i].indent >= base) {
    if (items[i].indent > base) {
      const sub = buildNestedList(items.slice(i), items[i].indent, refs);
      if (listItems.length > 0) listItems[listItems.length - 1].sublist = sub.node;
      i += sub.consumed;
      continue;
    }
    listItems.push({ children: parseInline(items[i].content, refs), sublist: null });
    i++;
  }
  const node: MdNode = ordered
    ? { type: "ordered-list", items: listItems }
    : { type: "unordered-list", items: listItems };
  return { node, consumed: i };
}

// ─── Block parser ───────────────────────────────────────────────────

export function parse(tokens: BlockToken[], refs: RefLinkMap = new Map()): MdNode {
  const children: MdNode[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    switch (tok.kind) {
      case "heading":
        children.push({ type: "heading", level: tok.level, children: parseInline(tok.content, refs) });
        i++;
        break;
      case "blockquote": {
        const { tokens: innerTokens, refLinks: innerRefs } = tokenizeWithRefs(tok.lines.join("\n"));
        // Merge inner refs into outer refs
        for (const [k, v] of innerRefs) refs.set(k, v);
        const inner = parse(innerTokens, refs);
        const bqChildren = inner.type === "document" ? inner.children : [inner];
        children.push({ type: "blockquote", children: bqChildren });
        i++;
        break;
      }
      case "code-block":
        children.push({ type: "code-block", lang: tok.lang, code: tok.code });
        i++;
        break;
      case "hr":
        children.push({ type: "hr" });
        i++;
        break;
      case "html-block":
        children.push({ type: "html-block", content: tok.content });
        i++;
        break;
      case "list-item": {
        const raw: RawListItem[] = [];
        while (i < tokens.length && tokens[i].kind === "list-item") {
          const lt = tokens[i] as { kind: "list-item"; indent: number; ordered: boolean; content: string };
          raw.push({ indent: lt.indent, ordered: lt.ordered, content: lt.content });
          i++;
        }
        children.push(buildNestedList(raw, raw[0].indent, refs).node);
        break;
      }
      case "table": {
        const headers = parseTableCells(tok.headerLine).map((c) => parseInline(c, refs));
        const alignments = parseAlignments(tok.separatorLine);
        const rows = tok.bodyLines.map((line) => parseTableCells(line).map((c) => parseInline(c, refs)));
        children.push({ type: "table", headers, alignments, rows });
        i++;
        break;
      }
      case "paragraph":
        children.push({ type: "paragraph", children: parseInline(tok.content, refs) });
        i++;
        break;
    }
  }
  return { type: "document", children };
}
