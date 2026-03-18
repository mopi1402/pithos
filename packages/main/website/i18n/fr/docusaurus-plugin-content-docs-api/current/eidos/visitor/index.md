---
title: "Pattern Visitor en TypeScript"
sidebar_label: "Visitor"
description: "Découvrez pourquoi le design pattern Visitor est absorbé par le TypeScript fonctionnel. Utilisez les discriminated unions et les switch à la place."
keywords:
  - visitor pattern typescript
  - discriminated union
  - pattern matching
  - double dispatch
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Visitor

Définissez de nouvelles opérations sur les éléments d'une structure sans modifier leurs types.

---

## Le Problème

Vous construisez un éditeur d'emails. Chaque bloc (header, texte, image, bouton, séparateur) nécessite plusieurs rendus : aperçu visuel, export HTML, texte brut, audit d'accessibilité. L'approche naïve : une fonction géante avec des conditions imbriquées pour chaque combinaison type de bloc × rendu.

```typescript
function render(block: EmailBlock, format: "html" | "text" | "audit"): string {
  if (format === "html") {
    if (block instanceof HeaderBlock) return `<h1>${block.text}</h1>`;
    if (block instanceof TextBlock) return `<p>${block.content}</p>`;
    if (block instanceof ImageBlock) return `<img src="${block.src}" />`;
    // ... chaque bloc × chaque format
  }
  if (format === "text") {
    if (block instanceof HeaderBlock) return block.text;
    // ... encore
  }
  // ... encore
}
```

Chaque nouveau rendu oblige à toucher cette fonction. Chaque nouveau type de bloc oblige à ajouter des cas partout. Ça ne passe pas à l'échelle.

---

## La Solution

Discriminated union + switch. Chaque "visitor" est simplement une fonction. TypeScript affine le type dans chaque branche du case et vérifie l'exhaustivité à la compilation.

```typescript
type EmailBlock =
  | { type: "header"; text: string; level: 1 | 2 | 3 }
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt: string }
  | { type: "button"; label: string; url: string }
  | { type: "divider" };

// "Visitor 1" : export HTML
const toHtml = (block: EmailBlock): string => {
  switch (block.type) {
    case "header": return `<h${block.level}>${block.text}</h${block.level}>`;
    case "text":   return `<p>${block.content}</p>`;
    case "image":  return `<img src="${block.src}" alt="${block.alt}" />`;
    case "button": return `<a href="${block.url}">${block.label}</a>`;
    case "divider": return `<hr />`;
  }
};

// "Visitor 2" : texte brut
const toPlainText = (block: EmailBlock): string => {
  switch (block.type) {
    case "header":  return block.text;
    case "text":    return block.content;
    case "image":   return block.alt ? `[Image: ${block.alt}]` : `[Image]`;
    case "button":  return `[${block.label}: ${block.url}]`;
    case "divider": return "---";
  }
};

// Mêmes données, différents "visitors"
const blocks: EmailBlock[] = [/* ... */];
blocks.map(toHtml);      // chaînes HTML
blocks.map(toPlainText); // chaînes texte brut
```

Ajouter un nouveau rendu ? Écrivez une nouvelle fonction. Ajouter un nouveau type de bloc ? Ajoutez un variant à l'union, TypeScript signale chaque switch qui ne le gère pas.

:::info Absorbé par le Langage
Cette solution n'utilise pas Pithos. C'est justement le point.

En TypeScript, les discriminated unions + `switch` **sont** le pattern Visitor. Eidos exporte une fonction `@deprecated` `visit()` qui n'existe que pour vous guider ici.
:::

---

## Démo {#live-demo}

Un éditeur d'emails avec 5 types de blocs. Composez votre email, puis basculez entre 4 visitors : Preview (rendu visuel), HTML (code généré), Plain Text (les boutons deviennent `[Click here: url]`), et Accessibility Audit (signale les images sans texte alt). Mêmes données, rendu différent.

<PatternDemo pattern="visitor" />

---

## API

- [visitor](/api/eidos/visitor/visitor) `@deprecated` — utilisez les discriminated unions avec switch

---

<RelatedLinks title="Liens connexes">

- [Eidos : Module Design Patterns](/guide/modules/eidos) Les 23 patterns GoF réimaginés pour le TypeScript fonctionnel
- [Pourquoi la FP plutôt que la POO ?](/guide/modules/eidos#philosophie) La philosophie derrière Eidos : pas de classes, pas d'héritage, juste des fonctions et des types
- [Zygos Result](/api/zygos/result/Result) Encapsulez vos résultats de switch dans `Result` pour une gestion d'erreurs typée

</RelatedLinks>
