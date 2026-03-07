---
sidebar_position: 6
title: Paradigme Data-First vs Data-Last
description: "Pourquoi Pithos utilise le paradigme data-first plutôt que data-last. Comparaison des deux approches avec des exemples TypeScript pratiques et compromis."
keyword_stuffing_ignore:
  - inference
  - methods
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Paradigme Data-First vs Data-Last

## Les deux approches

```typescript
// Data-First (Radash, es-toolkit, Pithos standard)
map(users, (user) => user.name);
filter(numbers, (n) => n > 0);

// Data-Last (Ramda, fp-ts, Remeda pipe)
map((user) => user.name)(users);
filter((n) => n > 0)(numbers);
```

## Choix Pithos : **Data-First par défaut**

(Sauf pour `Zygos` qui utilise des méthodes chaînées)

### Pourquoi Data-First ?

1. **Inférence TypeScript supérieure** : TypeScript déduit facilement le type de l'itérateur (`user` ou `n`) car les données (`users`, `numbers`) sont fournies _avant_. Avec Data-Last, l'inférence est souvent cassée ou nécessite des génériques explicites.
2. **Standard JavaScript** : Toutes les méthodes natives (`Array.map`, `Array.filter`) et modernes (`Promise.then`) mettent les données dans le contexte principal.
3. **Lisibilité directe** : `verbe(sujet, params)` se lit comme une phrase (« Map users to names »).

| Paradigme          | Exemple                                 | Inférence TS            | Usage Pithos          |
| ------------------ | --------------------------------------- | ----------------------- | --------------------- |
| **Data-First**     | `map(items, fn)`                        | ✅ Excellente (Naturelle) | **Standard (Arkhe)** |
| **Data-Last**      | `map(fn)(items)`                        | ⚠️ Souvent complexe      | Non utilisé           |
| **Piping**         | `items.map(fn)`                         | ✅ Excellente            | **Zygos (API fluide)** |

## Mais avec support du piping

Pour la composition fonctionnelle, Pithos supporte aussi le pattern pipe :

```typescript links="pipe:/api/arkhe/function/pipe"
import { pipe } from "@pithos/core/arkhe/function/pipe";
import { map, filter, take } from "@pithos/core/arkhe/array";

// Composition élégante
const result = pipe(
  users,
  (users) => filter(users, (u) => u.active),
  (users) => map(users, (u) => u.name),
  (names) => take(names, 5)
);
```

:::info Décision de conception

Pithos est **data-first uniquement**. Contrairement à l'approche dual-mode de Remeda, nous avons délibérément choisi de ne pas supporter les variantes data-last. Cela garde l'API simple, prévisible et assure une inférence TypeScript optimale.

Pour la composition, utilisez [`pipe()`](/api/arkhe/function/pipe) avec des appels data-first explicites : c'est légèrement plus verbeux mais parfaitement clair.

:::

---

<RelatedLinks>

- [Design d'API](./api-design.md) — Une fonction, une responsabilité
- [TypeScript-First](./typescript-first.md) — Pourquoi l'inférence guide le choix data-first

</RelatedLinks>
