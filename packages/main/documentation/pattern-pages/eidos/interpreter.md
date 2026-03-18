---
title: "Interpreter Pattern in TypeScript"
sidebar_label: "Interpreter"
description: "Learn why the Interpreter design pattern is absorbed by functional TypeScript. Use discriminated unions and recursive evaluation instead."
keywords:
  - interpreter pattern typescript
  - dsl typescript
  - ast evaluation
  - markdown interpreter
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Interpreter Pattern

Define a grammar as composable functions and evaluate expressions by walking the structure.

---

## The Problem

You need to parse Markdown into HTML. The naive approach: a pile of regex replacements.

```typescript
function renderMarkdown(source: string): string {
  let html = source;
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  // ... 30 more regex, order matters, edge cases everywhere
  return html;
}
```

This breaks the moment you have nested formatting (`**bold *and italic***`), code blocks that contain `*asterisks*`, or links inside headings. Each new feature adds more regex, more ordering bugs, more edge cases. It doesn't scale.

---

## The Solution

Separate the grammar from the evaluation. Define the AST as a discriminated union, then fold over it recursively.

```typescript
// 1. Define the grammar as types
type MdNode =
  | { type: "document"; children: MdNode[] }
  | { type: "heading"; level: number; children: MdNode[] }
  | { type: "paragraph"; children: MdNode[] }
  | { type: "bold"; children: MdNode[] }
  | { type: "italic"; children: MdNode[] }
  | { type: "code-block"; lang: string; code: string }
  | { type: "text"; value: string }
  // ... as many node types as your grammar needs

// 2. Evaluate recursively: one switch, one function
function evalNode(node: MdNode): string {
  switch (node.type) {
    case "document":
      return node.children.map(evalNode).join("\n");
    case "heading":
      return `<h${node.level}>${node.children.map(evalNode).join("")}</h${node.level}>`;
    case "paragraph":
      return `<p>${node.children.map(evalNode).join("")}</p>`;
    case "bold":
      return `<strong>${node.children.map(evalNode).join("")}</strong>`;
    case "italic":
      return `<em>${node.children.map(evalNode).join("")}</em>`;
    case "code-block":
      return `<pre><code>${escapeHtml(node.code)}</code></pre>`;
    case "text":
      return escapeHtml(node.value);
  }
}

// 3. Pipeline: source → tokens → AST → HTML
const tokens = tokenize(source);
const ast = parse(tokens);
const html = evalNode(ast);
```

Adding a new node type? Add a variant to the union, add a case to the switch. TypeScript catches missing cases at compile time. Nesting works for free: `evalNode` calls itself.

:::info Absorbed by the Language
This solution doesn't use Pithos. That's the point.

In TypeScript, discriminated unions + `switch` **are** the Interpreter pattern. Eidos exports a `@deprecated` `interpret()` function that exists only to guide you here, just like Taphos marks native APIs that replaced Arkhe utilities.
:::

---

## Live Demo

Type Markdown on the left, see the evaluated HTML on the right. Toggle to AST to see the tree the evaluator folds over.

<PatternDemo pattern="interpreter" />

---

## Beyond Markdown

The same pattern works for any grammar. Here's a query DSL:

```typescript
type Query =
  | { type: "select"; fields: string[] }
  | { type: "where"; source: Query; predicate: (row: Row) => boolean }
  | { type: "limit"; source: Query; count: number };

function execute(query: Query, data: Row[]): Row[] {
  switch (query.type) {
    case "select":
      return data.map(row => pick(row, query.fields));
    case "where":
      return execute(query.source, data).filter(query.predicate);
    case "limit":
      return execute(query.source, data).slice(0, query.count);
  }
}
```

Discriminated union for the grammar. Recursive function for the evaluation. That's the whole pattern.

---

## API

- [interpreter](/api/eidos/interpreter/interpreter) `@deprecated` — use discriminated unions with recursive evaluation

---

<RelatedLinks title="Related">

- [Eidos: Design Patterns Module](/guide/modules/eidos) All 23 GoF patterns reimagined for functional TypeScript
- [Why FP over OOP?](/guide/modules/eidos#philosophie) The philosophy behind Eidos: no classes, no inheritance, just functions and types
- [Zygos Result](/api/zygos/result/Result) Typed error handling for your evaluators and pipelines

</RelatedLinks>
