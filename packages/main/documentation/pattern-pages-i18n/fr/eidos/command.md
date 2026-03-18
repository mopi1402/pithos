---
title: "Pattern Command en TypeScript"
sidebar_label: "Command"
description: "Apprenez à implémenter le design pattern Command en TypeScript fonctionnel. Construisez des systèmes undo/redo avec un historique d'actions."
keywords:
  - command pattern typescript
  - undo redo typescript
  - historique actions
  - opérations réversibles
  - transaction pattern
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Command

Encapsulez une requête sous forme d'objet (ou paire de fonctions), permettant de paramétrer, mettre en file, journaliser et annuler des opérations.

---

## Le Problème

Vous développez un éditeur de texte. Les utilisateurs s'attendent à ce que Ctrl+Z annule. Mais vos opérations sont dispersées :

```typescript
function insertText(doc: Doc, text: string, pos: number) {
  doc.content = doc.content.slice(0, pos) + text + doc.content.slice(pos);
  // Comment annuler ça ?
}

function deleteText(doc: Doc, start: number, end: number) {
  doc.content = doc.content.slice(0, start) + doc.content.slice(end);
  // Qu'est-ce qui a été supprimé ? Impossible d'annuler sans le savoir.
}
```

Les opérations ne savent pas comment s'inverser. L'undo est impossible.

---

## La Solution

Chaque opération est une paire : exécuter et annuler. Empilez-les pour l'historique :

```typescript
import { undoable, createCommandStack } from "@pithos/core/eidos/command/command";

const doc = { content: "Hello" };
const stack = createCommandStack();

// Insérer "World" à la position 5
const pos = 5;
const text = " World";

const insertCmd = undoable(
  () => { doc.content = doc.content.slice(0, pos) + text + doc.content.slice(pos); },
  () => { doc.content = doc.content.slice(0, pos) + doc.content.slice(pos + text.length); }
);

stack.execute(insertCmd);  // doc.content = "Hello World"
stack.undo();              // doc.content = "Hello"
stack.redo();              // doc.content = "Hello World"
```

Chaque opération sait comment s'inverser. Undo/redo complet gratuitement.

### Variante réactive

La version impérative ci-dessus fonctionne très bien avec Vue, Angular et Svelte où la mutation déclenche la réactivité. Pour React et les autres systèmes à état immuable, utilisez la variante réactive où les commandes sont des transformations pures `(state) => state` :

```typescript
import { undoableState, createReactiveCommandStack } from "@pithos/core/eidos/command/command";

interface Doc { content: string }

const stack = createReactiveCommandStack<Doc>({
  initial: { content: "Hello" },
  onChange: setDoc, // React setState, Vue ref, Angular signal...
});

const pos = 5;
const text = " World";

stack.execute(undoableState(
  (doc) => ({ ...doc, content: doc.content.slice(0, pos) + text + doc.content.slice(pos) }),
  (doc) => ({ ...doc, content: doc.content.slice(0, pos) + doc.content.slice(pos + text.length) }),
));
// onChange se déclenche avec { content: "Hello World" }

stack.undo();  // onChange se déclenche avec { content: "Hello" }
stack.redo();  // onChange se déclenche avec { content: "Hello World" }
```

Même pattern, pas de mutation. Le stack gère l'état et notifie votre framework.

---

## Command vs Memento

Les deux patterns permettent l'undo/redo, mais fonctionnent différemment :

- **Command** suit les opérations individuelles et leur inversion. À utiliser quand les opérations sont connues et réversibles.
- **Memento** capture des snapshots complets de l'état. À utiliser quand l'état est complexe ou que les opérations ne sont pas facilement réversibles.

---

## Démo {#live-demo}

<PatternDemo pattern="command" />

---

## Analogie

Un enregistreur de macros dans un tableur. Vous enregistrez une séquence d'actions (commandes), les rejouez sur d'autres données (file), annulez les erreurs (undo), et sauvegardez la macro pour plus tard (sérialisation). Chaque action est une unité discrète et réversible.

---

## Quand l'Utiliser

- Implémenter une fonctionnalité undo/redo
- Mettre des opérations en file pour exécution différée
- Journaliser toutes les opérations pour l'audit
- Supporter un comportement transactionnel (rollback en cas d'échec)

---

## Quand NE PAS l'Utiliser

Si vos opérations ne sont pas réversibles ou que vous avez juste besoin de capturer l'état, envisagez Memento à la place.

---

## API

- [undoable](/api/eidos/command/undoable) — Créer une commande impérative avec des thunks execute et undo
- [createCommandStack](/api/eidos/command/createCommandStack) — Historique de commandes impératif avec undo/redo
- [undoableState](/api/eidos/command/undoableState) — Créer une commande d'état pure `(S) => S`
- [createReactiveCommandStack](/api/eidos/command/createReactiveCommandStack) — Historique de commandes réactif avec état géré et callback `onChange`
- [safeExecute](/api/eidos/command/safeExecute) — (déprécié) Utilisez `Result.fromThrowable` de Zygos à la place

