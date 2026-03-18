---
title: "Visitor Pattern in TypeScript"
sidebar_label: "Visitor"
description: "Learn why the Visitor design pattern is absorbed by functional TypeScript. Use discriminated unions and switch statements instead."
keywords:
  - visitor pattern typescript
  - discriminated union
  - pattern matching
  - double dispatch
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Visitor Pattern

Define new operations on a structure's elements without modifying their types.

---

## The Problem

You're building an email builder. Each block (header, text, image, button, divider) needs multiple renderings: visual preview, HTML export, plain text, accessibility audit. The naive approach: one giant function with nested conditionals for every combination of block type × rendering.

```typescript
function render(block: EmailBlock, format: "html" | "text" | "audit"): string {
  if (format === "html") {
    if (block instanceof HeaderBlock) return `<h1>${block.text}</h1>`;
    if (block instanceof TextBlock) return `<p>${block.content}</p>`;
    if (block instanceof ImageBlock) return `<img src="${block.src}" />`;
    // ... every block × every format
  }
  if (format === "text") {
    if (block instanceof HeaderBlock) return block.text;
    // ... again
  }
  // ... again
}
```

Every new rendering means touching this function. Every new block type means adding cases everywhere. It doesn't scale.

---

## The Solution

Discriminated union + switch. Each "visitor" is just a function. TypeScript narrows the type in each case branch and checks exhaustiveness at compile time.

```typescript
type EmailBlock =
  | { type: "header"; text: string; level: 1 | 2 | 3 }
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt: string }
  | { type: "button"; label: string; url: string }
  | { type: "divider" };

// "Visitor 1": HTML export
const toHtml = (block: EmailBlock): string => {
  switch (block.type) {
    case "header": return `<h${block.level}>${block.text}</h${block.level}>`;
    case "text":   return `<p>${block.content}</p>`;
    case "image":  return `<img src="${block.src}" alt="${block.alt}" />`;
    case "button": return `<a href="${block.url}">${block.label}</a>`;
    case "divider": return `<hr />`;
  }
};

// "Visitor 2": plain text
const toPlainText = (block: EmailBlock): string => {
  switch (block.type) {
    case "header":  return block.text;
    case "text":    return block.content;
    case "image":   return block.alt ? `[Image: ${block.alt}]` : `[Image]`;
    case "button":  return `[${block.label}: ${block.url}]`;
    case "divider": return "---";
  }
};

// Same data, different "visitors"
const blocks: EmailBlock[] = [/* ... */];
blocks.map(toHtml);      // HTML strings
blocks.map(toPlainText); // plain text strings
```

Adding a new rendering? Write a new function. Adding a new block type? Add a variant to the union, TypeScript flags every switch that doesn't handle it.

:::info Absorbed by the Language
This solution doesn't use Pithos. That's the point.

In TypeScript, discriminated unions + `switch` **are** the Visitor pattern. Eidos exports a `@deprecated` `visit()` function that exists only to guide you here.
:::

---

## Live Demo

An email builder with 5 block types. Compose your email, then switch between 4 visitors: Preview (visual rendering), HTML (generated code), Plain Text (buttons become `[Click here: url]`), and Accessibility Audit (flags images without alt text). Same data, different rendering.

<PatternDemo pattern="visitor" />

---

## API

- [visitor](/api/eidos/visitor/visitor) `@deprecated` — use discriminated unions with switch

---

<RelatedLinks title="Related">

- [Eidos: Design Patterns Module](/guide/modules/eidos) All 23 GoF patterns reimagined for functional TypeScript
- [Why FP over OOP?](/guide/modules/eidos#philosophie) The philosophy behind Eidos: no classes, no inheritance, just functions and types
- [Zygos Result](/api/zygos/result/Result) Wrap your switch results in `Result` for typed error handling

</RelatedLinks>
