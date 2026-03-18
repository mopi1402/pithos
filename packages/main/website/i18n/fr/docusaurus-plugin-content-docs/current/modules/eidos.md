---
sidebar_position: 4
sidebar_label: "Eidos"
title: "Eidos - Design Patterns GoF en TypeScript Fonctionnel"
description: "Les 23 design patterns du Gang of Four réimaginés pour TypeScript fonctionnel. Pas de classes, pas d'héritage, juste des fonctions, des types et de la composition."
keywords:
  - design patterns typescript
  - functional design patterns
  - gof patterns functional
  - typescript patterns
  - no classes
image: /img/social/eidos-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Eidos"
  description="Les 23 design patterns du Gang of Four réimaginés pour TypeScript fonctionnel. Pas de classes, pas d'héritage, juste des fonctions, des types et de la composition."
  url="https://pithos.dev/guide/modules/eidos"
/>

# 🅴 <ModuleName name="Eidos" />

_εἶδος - "forme, pattern"_

Les 23 design patterns du Gang of Four, réimaginés pour TypeScript fonctionnel. Pas de classes, pas d'héritage, juste des fonctions, des unions discriminées et de la composition.

:::info
Eidos traduit les patterns OOP classiques en code fonctionnel idiomatique. Certains patterns deviennent de simples fonctions. D'autres deviennent des alias de types. Certains sont marqués deprecated car le système de types de TypeScript les rend inutiles. Chaque module documente la version OOP, explique l'équivalent fonctionnel et fournit du code fonctionnel.
:::

---

## Philosophie

Les patterns GoF ont été conçus pour des langages sans fonctions first-class, sans types algébriques, et sans inférence de types puissante. En TypeScript fonctionnel :

- **Strategy** est juste un `Record<string, Function>`
- **Visitor** est juste un `switch` sur une union discriminée
- **Factory Method** est juste de l'injection de dépendances
- **Decorator** est juste de la composition de fonctions

Eidos ne force pas les patterns OOP dans du code fonctionnel. Il montre la façon idiomatique de résoudre les mêmes problèmes. Quand un pattern est absorbé par le langage, on le documente avec une fonction `@deprecated` qui explique quoi faire à la place, le tout directement accessible depuis son IDE.

---

## Catégories de Patterns

### Patterns avec Vraie Valeur Ajoutée

Ces patterns fournissent des fonctions utilitaires que vous pourrez utiliser dans votre code :

| Pattern | Fonctions | Description |
|---------|-----------|-------------|
| **Strategy** | `createStrategies`, `safeStrategy`, `withFallback`, `withValidation` | Algorithmes interchangeables avec lookup typé |
| **Observer** | `createObservable` | Pub/sub avec événements typés |
| **Decorator** | `decorate`, `before`, `after`, `around` | Wrapping et composition de fonctions |
| **Adapter** | `adapt`, `createAdapter` | Transformation de signatures de fonctions |
| **Command** | `undoable`, `createCommandStack`, `undoableState`, `createReactiveCommandStack` | Undo/redo avec historique d'actions |
| **Chain of Responsibility** | `createChain`, `safeChain` | Pipelines de handlers séquentiels |
| **State** | `createMachine` | Machines à états finis |
| **Iterator** | `createIterable`, `lazyRange`, `iterate` | Séquences lazy avec opérateurs |
| **Composite** | `leaf`, `branch`, `fold`, `map`, `flatten`, `find` | Structures arborescentes avec traversée |
| **Abstract Factory** | `createAbstractFactory` | Familles de factories avec lookup typé |
| **Mediator** | `createMediator` | Hub d'événements typé pour communication découplée |
| **Memento** | `createHistory` | Snapshots d'état avec undo/redo |
| **Builder** | `createBuilder`, `createValidatedBuilder` | Builders fluent immutables |
| **Template Method** | `templateWithDefaults` | Squelettes d'algorithmes avec étapes surchargeables |

### Patterns Couverts par Arkhe

Ces patterns sont déjà implémentés dans Arkhe. Eidos les ré-exporte pour la découvrabilité :

| Pattern | Fonctions Arkhe | Description |
|---------|-----------------|-------------|
| **Proxy** | `memoize`, `once`, `throttle`, `debounce`, `lazy`, `guarded` | Interception et cache de fonctions |
| **Prototype** | `deepClone`, `deepCloneFull` | Clonage d'objets |
| **Singleton** | `once` (alias `singleton`) | Création d'instance unique |
| **Flyweight** | `memoize` | Pooling d'objets via cache |

### Patterns Absorbés par le Langage

Ces patterns sont inutiles en TypeScript fonctionnel. Les fonctions existent uniquement pour la documentation et sont marquées `@deprecated` pour guider vers du code idiomatique :

| Pattern | Pourquoi Absorbé |
|---------|------------------|
| **Bridge** | Un bridge est juste `(impl) => abstraction`, une fonction |
| **Factory Method** | Passez la factory en paramètre (injection de dépendances) |
| **Facade** | Une facade est juste une fonction qui appelle d'autres fonctions |
| **Visitor** | Utilisez `switch` sur une union discriminée |
| **Interpreter** | Unions discriminées + évaluation récursive |

---

## Exemples Rapides

### Strategy : Algorithmes Interchangeables

```typescript
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";

const pricing = createStrategies({
  regular: (price: number) => price,
  vip: (price: number) => price * 0.8,
  premium: (price: number) => price * 0.7,
});

pricing.execute("vip", 100); // 80
```

### State : Machine à États Finis

```typescript
import { createMachine } from "@pithos/core/eidos/state/state";

const light = createMachine({
  green:  { timer: "yellow" },
  yellow: { timer: "red" },
  red:    { timer: "green" },
}, "green");

light.send("timer"); // "yellow"
light.send("timer"); // "red"
```

### Composite : Structures Arborescentes

```typescript
import { leaf, branch, fold } from "@pithos/core/eidos/composite/composite";

const tree = branch({ name: "root", size: 0 }, [
  leaf({ name: "file1.txt", size: 100 }),
  branch({ name: "docs", size: 0 }, [
    leaf({ name: "readme.md", size: 50 }),
  ]),
]);

const totalSize = fold(tree, {
  leaf: (data) => data.size,
  branch: (_, children) => children.reduce((a, b) => a + b, 0),
}); // 150
```

### Mediator : Communication Découplée

```typescript
import { createMediator } from "@pithos/core/eidos/mediator/mediator";

type Events = {
  userLoggedIn: { userId: string };
  orderPlaced: { orderId: string };
};

const mediator = createMediator<Events>();

mediator.on("userLoggedIn", ({ userId }) => {
  console.log(`Welcome ${userId}`);
});

mediator.emit("userLoggedIn", { userId: "alice" });
```

### Builder : Construction Fluent

```typescript
import { createBuilder } from "@pithos/core/eidos/builder/builder";

const queryBuilder = createBuilder({ table: "", where: [] as string[], limit: 100 })
  .step("from", (s, table: string) => ({ ...s, table }))
  .step("where", (s, clause: string) => ({ ...s, where: [...s.where, clause] }))
  .step("limit", (s, n: number) => ({ ...s, limit: n }))
  .done();

const query = queryBuilder()
  .from("users")
  .where("active = true")
  .limit(10)
  .build();
```

---

## Memento vs Command pour Undo/Redo

Les deux patterns supportent undo/redo, mais fonctionnent différemment :

| Approche | Module | Fonctionnement | Quand l'utiliser |
|----------|--------|----------------|------------------|
| **Snapshots d'état** | Memento (`createHistory`) | Stocke des copies de l'état, restaure sur undo | L'état est peu coûteux à copier |
| **Historique d'actions** | Command (`createCommandStack`) | Stocke des paires execute/undo | Vous avez des opérations réversibles |

```typescript
// Memento : stocker des états
const history = createHistory({ count: 0 });
history.push({ count: 1 });
history.undo(); // restaure { count: 0 }

// Command : stocker des actions
const stack = createCommandStack();
stack.execute(undoable(() => count++, () => count--));
stack.undo(); // appelle la fonction undo
```

---

## ✅ Quand Utiliser

Eidos est utile quand :

- Vous venez de l'OOP et voulez comprendre les équivalents fonctionnels
- Vous avez besoin d'un pattern spécifique (machine à états, builder, observer, etc.)
- Vous voulez des implémentations typées et testées plutôt que de les écrire vous-même

---

## ❌ Quand NE PAS Utiliser

| Besoin | Utilisez Plutôt |
|--------|-----------------|
| Transformation de données | [Arkhe](/guide/modules/arkhe/) |
| Gestion d'erreurs | [Zygos](/guide/modules/zygos/) |
| Validation de schémas | [Kanon](/guide/modules/kanon/) |

---

<RelatedLinks title="Ressources Liées">

- [Référence API Eidos](/api/eidos) - Documentation API complète pour tous les patterns
- [Utilitaires Arkhe](/guide/modules/arkhe/) - Utilitaires généraux qui complètent Eidos

</RelatedLinks>
