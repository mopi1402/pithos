---
title: "Pattern Factory Method en TypeScript"
sidebar_label: "Factory Method"
description: "Découvrez pourquoi le design pattern Factory Method est absorbé par le TypeScript fonctionnel. Utilisez la dependency injection à la place."
keywords:
  - factory method typescript
  - dependency injection
  - object creation
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Pattern Factory Method

Définissez une fonction de création dont la logique d'instanciation concrète est déférée à l'appelant.

---

## Le Problème

Vous avez une classe `Document` qui crée des pages. Les documents Word créent des `WordPage`, les documents PDF créent des `PdfPage`. L'approche POO : une méthode factory abstraite surchargée par les sous-classes.

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

De l'héritage pour remplacer un seul appel de fonction. Chaque nouveau format implique une nouvelle sous-classe.

---

## La Solution

Passez la factory en paramètre. C'est de la dependency injection — pas besoin d'héritage.

```typescript
type Page = { type: string; content: string };

// La factory est juste un paramètre — échangez-la librement
function addPage(pages: Page[], createPage: () => Page): Page[] {
  return [...pages, createPage()];
}

const wordFactory = (): Page => ({ type: "word", content: "" });
const pdfFactory = (): Page => ({ type: "pdf", content: "" });

let pages: Page[] = [];
pages = addPage(pages, wordFactory);  // [{ type: "word", ... }]
pages = addPage(pages, pdfFactory);   // [{ type: "word", ... }, { type: "pdf", ... }]
```

Pas d'héritage. Pas de classes abstraites. Juste passer une fonction.

:::info Absorbé par le Langage
Cette solution n'utilise pas Pithos. C'est justement le point.

En TypeScript fonctionnel, passer une fonction factory en paramètre **est** le pattern Factory Method. Eidos exporte une fonction `@deprecated` `createFactoryMethod()` qui n'existe que pour vous guider ici.
:::

---

## Démo {#live-demo}

Choisissez un format (Word, PDF, HTML, Markdown) et cliquez sur Add Page. La fonction `addPage` ne sait pas quel type de page elle crée — elle appelle simplement la factory injectée. Changez le format, même fonction, résultat différent.

<PatternDemo pattern="factory-method" />

---

## API

- [factoryMethod](/api/eidos/factory-method/factoryMethod) `@deprecated` — utilisez la dependency injection à la place

---

<RelatedLinks title="Liens connexes">

- [Eidos : Module Design Patterns](/guide/modules/eidos) Les 23 patterns GoF réimaginés pour le TypeScript fonctionnel
- [Pourquoi la FP plutôt que la POO ?](/guide/modules/eidos#philosophie) La philosophie derrière Eidos : pas de classes, pas d'héritage, juste des fonctions et des types
- [Zygos Result](/api/zygos/result/Result) Encapsulez vos appels factory dans `Result` pour une gestion d'erreurs typée

</RelatedLinks>
