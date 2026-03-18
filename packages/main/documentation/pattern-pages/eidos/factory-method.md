---
title: "Factory Method Pattern in TypeScript"
sidebar_label: "Factory Method"
description: "Learn why the Factory Method design pattern is absorbed by functional TypeScript. Use dependency injection instead."
keywords:
  - factory method typescript
  - dependency injection
  - object creation
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Factory Method Pattern

Define a creation function whose concrete instantiation logic is deferred to the caller.

---

## The Problem

You have a `Document` class that creates pages. Word documents create `WordPage`, PDF documents create `PdfPage`. The OOP approach: an abstract factory method overridden by subclasses.

```typescript
abstract class Document {
  abstract createPage(): Page;

  addPage() {
    const page = this.createPage();
    this.pages.push(page);
  }
}

class WordDocument extends Document {
  createPage() { return new WordPage(); }
}

class PdfDocument extends Document {
  createPage() { return new PdfPage(); }
}
```

Inheritance to swap a single function call. Every new format means a new subclass.

---

## The Solution

Pass the factory as a parameter. That's dependency injection — no inheritance needed.

```typescript
type Page = { type: string; content: string };

// The factory is just a parameter — swap it freely
function addPage(pages: Page[], createPage: () => Page): Page[] {
  return [...pages, createPage()];
}

const wordFactory = (): Page => ({ type: "word", content: "" });
const pdfFactory = (): Page => ({ type: "pdf", content: "" });

let pages: Page[] = [];
pages = addPage(pages, wordFactory);  // [{ type: "word", ... }]
pages = addPage(pages, pdfFactory);   // [{ type: "word", ... }, { type: "pdf", ... }]
```

No inheritance. No abstract classes. Just pass a function.

:::info Absorbed by the Language
This solution doesn't use Pithos. That's the point.

In functional TypeScript, passing a factory function as a parameter **is** the Factory Method pattern. Eidos exports a `@deprecated` `createFactoryMethod()` function that exists only to guide you here.
:::

---

## Live Demo

Pick a format (Word, PDF, HTML, Markdown) and click Add Page. The `addPage` function doesn't know which page type it creates — it just calls the injected factory. Swap the format, same function, different output.

<PatternDemo pattern="factory-method" />

---

## API

- [factoryMethod](/api/eidos/factory-method/factoryMethod) `@deprecated` — use dependency injection instead

---

<RelatedLinks title="Related">

- [Eidos: Design Patterns Module](/guide/modules/eidos) All 23 GoF patterns reimagined for functional TypeScript
- [Why FP over OOP?](/guide/modules/eidos#philosophie) The philosophy behind Eidos: no classes, no inheritance, just functions and types
- [Zygos Result](/api/zygos/result/Result) Wrap factory calls in `Result` for typed error handling

</RelatedLinks>
