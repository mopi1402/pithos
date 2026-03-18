export const SAMPLE_MARKDOWN = `[![TypeScript](https://img.shields.io/badge/TypeScript-First-blue.svg)](https://www.typescriptlang.org/) [![Pattern](https://img.shields.io/badge/pattern-Interpreter-f59e0b.svg)]() [![RFC 7763](https://img.shields.io/badge/RFC_7763-Original-34d399.svg)](https://datatracker.ietf.org/doc/html/rfc7763) [![RFC 7764](https://img.shields.io/badge/RFC_7764-GFM_partial-38bdf8.svg)](https://datatracker.ietf.org/doc/html/rfc7764)

# The Interpreter Pattern

> **Define a grammar, build an AST, evaluate it recursively.**
> That's the entire pattern — no classes needed.

The demo you're looking at *is* the pattern in action.
The **left panel** is raw Markdown. The **right panel** is the evaluated output.
Between the two: a ***tokenizer***, a ***parser***, and an ***evaluator***.

---

## How It Works

The pipeline has three stages:

1. **Tokenize** — scan the raw text into block tokens
2. **Parse** — build a tree of typed nodes (the *AST*)
3. **Evaluate** — recursively fold the AST into HTML

In functional TypeScript, this is just:

\`\`\`typescript
type MdNode =
  | { type: "heading"; level: number; children: MdNode[] }
  | { type: "bold"; children: MdNode[] }
  | { type: "text"; value: string }
  // ... 20+ node types

function evalNode(node: MdNode): string {
  switch (node.type) {
    case "heading":
      return \\\`<h\\\${node.level}>\\\${evalChildren(node)}</h\\\${node.level}>\\\`;
    case "bold":
      return \\\`<strong>\\\${evalChildren(node)}</strong>\\\`;
    case "text":
      return escapeHtml(node.value);
  }
}
\`\`\`

> The \`switch\` on a discriminated union **is** the interpreter.
> No visitor, no interface, no \`accept()\` — just pattern matching.

---

## What This Demo Supports

### Headings

Six levels of ATX headings (\`#\` through \`######\`), plus setext style:

Setext H1
=========

Setext H2
---------

### Inline Formatting

| Syntax | Result | AST Node |
|:-------|:------:|:---------|
| \`**bold**\` | **bold** | Bold |
| \`*italic*\` | *italic* | Italic |
| \`***both***\` | ***both*** | BoldItalic |
| \`~~strike~~\` | ~~strike~~ | Strikethrough |
| \`\\\`code\\\`\` | \`code\` | InlineCode |

### Links & Images

- Inline: [Pithos Docs](https://pithos.dev)
- Reference: [the repo][repo]
- Shortcut: [repo]
- Angle-bracket: <https://pithos.dev>
- Email: <hello@pithos.dev>
- Bare URL: https://github.com/mopi1402/pithos

[repo]: https://github.com/mopi1402/pithos "Pithos on GitHub"

### Blockquotes

> Blockquotes can span multiple lines.
> They support **all inline formatting**.
>
> > And they nest — this is a quote inside a quote.

### Code Blocks

Fenced with language hint:

\`\`\`typescript
const { tokens, refLinks } = tokenizeWithRefs(source);
const ast = parse(tokens, refLinks);
\`\`\`

Indented (4 spaces):

    function hello() {
      return "world";
    }

### Lists

Nested unordered:

- The AST is a **discriminated union**
  - Each node carries a \`type\` field
  - The evaluator \`switch\`es on it
- The fold is **recursive**
  - Children are evaluated first
  - Results are joined into the parent

Ordered:

1. Define your grammar as types
2. Write a recursive evaluator
3. That's it — no framework needed

### Task List

- [x] Tokenizer — char-by-char scanner
- [x] Parser — block + inline, nested lists
- [x] Evaluator — recursive fold to HTML
- [ ] Syntax highlighting *(not yet)*

### Inline HTML

<div style="padding:8px 12px;border:1px solid #333;border-radius:6px;color:#a1a1aa;font-size:0.9em;">
  Raw HTML passes through the interpreter untouched.
</div>

### Escaped Characters

Use \\*asterisks\\* literally, or \\[brackets\\] without triggering links.

---

## Why "Absorbed by the Language"?

In OOP, the Interpreter pattern requires an \`Expression\` interface, terminal classes, non-terminal classes, and a context object.

In TypeScript, you just need:

1. A **discriminated union** for the AST
2. A **recursive function** that switches on \`type\`

> The pattern is so natural in functional code that it disappears into the language itself.

This interpreter implements the full **Original Markdown** syntax as defined in [RFC 7763](https://datatracker.ietf.org/doc/html/rfc7763), plus most **GFM extensions** from [RFC 7764](https://datatracker.ietf.org/doc/html/rfc7764) §3.2: ~~strikethrough~~, tables, fenced code blocks, and URL autolinking. Not implemented: syntax highlighting and HTML sanitization.

*Type the left panel. Watch the right panel update. That's the interpreter.*
`;
