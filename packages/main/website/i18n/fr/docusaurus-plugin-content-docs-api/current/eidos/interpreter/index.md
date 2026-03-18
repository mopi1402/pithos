---
title: "Pattern Interpreter en TypeScript"
sidebar_label: "Interpreter"
description: "Découvrez pourquoi le design pattern Interpreter est absorbé par le TypeScript fonctionnel. Utilisez les discriminated unions et l'évaluation récursive à la place."
keywords:
  - interpreter pattern typescript
  - dsl typescript
  - ast evaluation
  - markdown interpreter
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Interpreter

Définissez une grammaire sous forme de fonctions composables et évaluez les expressions en parcourant la structure.

---

## Le Problème

Vous devez parser du Markdown en HTML. L'approche naïve : un tas de remplacements regex.

```typescript
function renderMarkdown(source: string): string {
  let html = source;
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  // ... 30 regex de plus, l'ordre compte, des cas limites partout
  return html;
}
```

Ça casse dès que vous avez du formatage imbriqué (`**gras *et italique***`), des blocs de code qui contiennent des `*astérisques*`, ou des liens dans des titres. Chaque nouvelle fonctionnalité ajoute plus de regex, plus de bugs d'ordonnancement, plus de cas limites. Ça ne passe pas à l'échelle.

---

## La Solution

Séparez la grammaire de l'évaluation. Définissez l'AST comme une discriminated union, puis parcourez-le récursivement.

```typescript
// 1. Définir la grammaire comme des types
type MdNode =
  | { type: "document"; children: MdNode[] }
  | { type: "heading"; level: number; children: MdNode[] }
  | { type: "paragraph"; children: MdNode[] }
  | { type: "bold"; children: MdNode[] }
  | { type: "italic"; children: MdNode[] }
  | { type: "code-block"; lang: string; code: string }
  | { type: "text"; value: string }
  // ... autant de types de nœuds que votre grammaire en a besoin

// 2. Évaluer récursivement : un switch, une fonction
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

// 3. Pipeline : source → tokens → AST → HTML
const tokens = tokenize(source);
const ast = parse(tokens);
const html = evalNode(ast);
```

Ajouter un nouveau type de nœud ? Ajoutez un variant à l'union, ajoutez un case au switch. TypeScript détecte les cas manquants à la compilation. L'imbrication fonctionne gratuitement : `evalNode` s'appelle lui-même.

:::info Absorbé par le Langage
Cette solution n'utilise pas Pithos. C'est justement le point.

En TypeScript, les discriminated unions + `switch` **sont** le pattern Interpreter. Eidos exporte une fonction `@deprecated` `interpret()` qui n'existe que pour vous guider ici, tout comme Taphos marque les API natives qui ont remplacé les utilitaires Arkhe.
:::

---

## Démo {#live-demo}

Tapez du Markdown à gauche, voyez le HTML évalué à droite. Basculez sur AST pour voir l'arbre que l'évaluateur parcourt.

<PatternDemo pattern="interpreter" />

---

## Au-delà du Markdown

Le même pattern fonctionne pour n'importe quelle grammaire. Voici un DSL de requêtes :

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

Une discriminated union pour la grammaire. Une fonction récursive pour l'évaluation. C'est tout le pattern.

---

## API

- [interpreter](/api/eidos/interpreter/interpreter) `@deprecated` — utilisez les discriminated unions avec l'évaluation récursive

---

<RelatedLinks title="Liens connexes">

- [Eidos : Module Design Patterns](/guide/modules/eidos) Les 23 patterns GoF réimaginés pour le TypeScript fonctionnel
- [Pourquoi la FP plutôt que la POO ?](/guide/modules/eidos#philosophie) La philosophie derrière Eidos : pas de classes, pas d'héritage, juste des fonctions et des types
- [Zygos Result](/api/zygos/result/Result) Gestion d'erreurs typée pour vos évaluateurs et pipelines

</RelatedLinks>
