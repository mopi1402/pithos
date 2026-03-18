// ─── AST Node types (discriminated union) ───────────────────────────

export type MdNode =
  | { type: "document"; children: MdNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: MdNode[] }
  | { type: "paragraph"; children: MdNode[] }
  | { type: "blockquote"; children: MdNode[] }
  | { type: "code-block"; lang: string; code: string }
  | { type: "hr" }
  | { type: "unordered-list"; items: ListItem[] }
  | { type: "ordered-list"; items: ListItem[] }
  | { type: "table"; headers: MdNode[][]; alignments: TableAlign[]; rows: MdNode[][][] }
  | { type: "html-block"; content: string }
  | { type: "text"; value: string }
  | { type: "bold"; children: MdNode[] }
  | { type: "italic"; children: MdNode[] }
  | { type: "bold-italic"; children: MdNode[] }
  | { type: "strikethrough"; children: MdNode[] }
  | { type: "inline-code"; value: string }
  | { type: "link"; href: string; children: MdNode[] }
  | { type: "autolink"; href: string }
  | { type: "inline-html"; content: string }
  | { type: "image"; src: string; alt: string }
  | { type: "checkbox"; checked: boolean }
  | { type: "line-break" };

export type ListItem = {
  children: MdNode[];
  sublist: MdNode | null; // nested unordered-list or ordered-list
};

export type TableAlign = "left" | "center" | "right" | "none";

// ─── Block tokens (tokenizer output) ────────────────────────────────

export type BlockToken =
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; content: string }
  | { kind: "blockquote"; lines: string[] }
  | { kind: "code-block"; lang: string; code: string }
  | { kind: "hr" }
  | { kind: "list-item"; indent: number; ordered: boolean; content: string }
  | { kind: "table"; headerLine: string; separatorLine: string; bodyLines: string[] }
  | { kind: "html-block"; content: string }
  | { kind: "paragraph"; content: string };

// ─── Reference link definitions ─────────────────────────────────────

export type RefLinkMap = Map<string, { href: string; title: string }>;
