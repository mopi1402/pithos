---
sidebar_label: "Stratégie de test"
sidebar_position: 5
title: "Stratégie de test"
description: "Explorez la stratégie de test multi-couches de Pithos, incluant les tests standard, de cas limites, de mutation et property-based pour garantir des utilitaires TypeScript fiables."
keyword_stuffing_ignore:
  - test
---

import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { Picture } from "@site/src/components/shared/Picture";
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🛡️ Stratégie de test

Un code couvert à 100% garantit simplement que chaque ligne s'est exécutée au moins une fois, pas que le code est exempt de bugs. Pithos utilise une **stratégie de test multi-couches** où chaque niveau donne l'opportunité de détecter des bugs de différentes natures.

--- 

## Le problème de la couverture seule

Considérons cette simple fonction qui divise deux nombres et retourne le résultat :

```typescript
function divide(a: number, b: number): number {
  return a / b;
}
```

Un seul test suffit pour obtenir une couverture de 100% :

```typescript
it("divise deux nombres", () => {
  expect(divide(10, 2)).toBe(5); // ✅ 100% de couverture
});
```

Mais est-ce que tous les cas à la marge sont parfaitement couverts ?

```typescript
divide(10, 0); // → Infinity
```

Le test passe, la couverture est complète, ce qui renforce le sentiment de confiance et pourtant, la fonction retourne silencieusement `Infinity`. 

> **La couverture vous dit que le code a été exécuté, pas qu'il fonctionne correctement.**

--- 

## Les quatre niveaux

Chaque niveau de test répond à une question différente :



| !Niveau | Préfixe | Question posée | Ce qu'il détecte |
| --- | --- | --- | --- |
| **Standard** | (aucun) | "Chaque ligne s'exécute-t-elle ?" | Code mort, branches oubliées |
| **Cas limite** | `[🎯]` | "Tous les contrats d'API sont-ils testés ?" | Types union non testés, comportements non documentés |
| **Mutation** | `[👾]` | "Si quelqu'un modifie ce code, un test échouera-t-il ?" | Assertions faibles, régressions silencieuses |
| **Property-based** | `[🎲]` | "Ça fonctionne pour _n'importe quelle_ entrée valide ?" | Cas limites : `null`, `""`, `NaN`, tableaux énormes |

:::note
L'ordre n'est pas critique, mais il permet de débusquer les bugs du plus évident au plus fourbe.
:::

---

## Et dans Pithos ?

Pithos applique cette stratégie à chaque utilitaire fourni, avec pour objectif de débusquer jusqu'au bug le plus incongru.

<details>
<summary>Exemple détaillé avec <code>evolve</code></summary>

La fonction [`evolve`](/api/arkhe/object/evolve) applique des fonctions de transformation aux propriétés d'un objet. Par exemple, `evolve({ a: 5 }, { a: x => x * 2 })` retourne `{ a: 10 }`. Voici comment chaque niveau de test contribue :


### Tests standard

Ces tests vérifient le comportement documenté :

```typescript
it("applique les fonctions de transformation aux propriétés", () => {
  const result = evolve({ a: 5, b: 10 }, { a: (x: number) => x * 2 });
  expect(result).toEqual({ a: 10, b: 10 });
});

it("gère les transformations imbriquées", () => {
  const result = evolve(
    { nested: { value: 5 } },
    { nested: { value: (x: number) => x + 1 } }
  );
  expect(result).toEqual({ nested: { value: 6 } });
});

it("préserve les propriétés sans transformation", () => {
  const result = evolve({ a: 1, b: 2 }, {});
  expect(result).toEqual({ a: 1, b: 2 });
});
```

À ce stade, la couverture pourrait être de 100%. Mais les tests sont-ils _solides_ ?

### Tests de cas limites

La fonction `evolve` accepte les transformations soit comme :

- Une **fonction** qui transforme la valeur entière
- Un **objet** de transformations imbriquées

Les deux branches doivent être testées explicitement :

```typescript
it("[🎯] applique une transformation fonction à une valeur objet", () => {
  // Teste la branche "la transformation est une fonction" pour les valeurs objet
  const result = evolve(
    { nested: { value: 5 } },
    { nested: (obj: { value: number }) => ({ value: obj.value * 2 }) }
  );
  expect(result).toEqual({ nested: { value: 10 } });
});
```

### Tests de mutation

[Stryker](https://stryker-mutator.io/) modifie votre code et vérifie si les tests échouent. S'ils n'échouent pas, vous avez un **mutant survivant** : un bug que vos tests manqueraient.

```typescript
// Stryker pourrait changer ceci :
if (transformation === undefined) { ... }
// En ceci :
if (transformation !== undefined) { ... }  // Mutant !
```

Si aucun test n'échoue, il faut ajouter un test ciblé :

```typescript
it("[👾] gère une transformation non définie", () => {
  const result = evolve(
    { nested: { value: 5 }, other: 10 },
    { other: (x: number) => x * 2 }
  );
  // Ce test cible spécifiquement la branche où transformation est undefined
  expect(result).toEqual({ nested: { value: 5 }, other: 20 });
});
```

### Tests property-based

Au lieu de tester des valeurs spécifiques, testez des **invariants** qui doivent tenir pour toutes les entrées :

```typescript
import { it as itProp } from "@fast-check/vitest";
import { safeObject } from "_internal/test/arbitraries";

// Invariant : sans transformations, l'objet est préservé
itProp.prop([safeObject()])(
  "[🎲] préserve l'objet quand pas de transformations",
  (obj) => {
    expect(evolve(obj, {})).toEqual(obj);
  }
);

// Invariant : toutes les clés sont préservées
itProp.prop([safeObject()])("[🎲] préserve toutes les clés", (obj) => {
  const result = evolve(obj, {});
  expect(Object.keys(result).sort()).toEqual(Object.keys(obj).sort());
});

// Indépendance : evolve retourne un nouvel objet
itProp.prop([safeObject()])("[🎲] retourne une nouvelle référence d'objet", (obj) => {
  const result = evolve(obj, {});
  if (Object.keys(obj).length > 0) {
    expect(result).not.toBe(obj);
  }
});
```

Le préfixe `[🎲]` signale : _« Ce test utilise des entrées aléatoires pour vérifier un invariant. »_

</details>

### Le résultat

L'exécution des tests montre tous les niveaux travaillant ensemble :

<Picture src="/img/generated/evolve-tests-output" alt="Sortie Vitest montrant les tests de la fonction evolve de Pithos avec les préfixes de tests unitaires, property et mutation" widths={[400, 800, 1200, 1600]} sizes="100vw" />
<br />
Chaque test a un objectif clair. Pas de redondance, pas de lacunes.

### 100% bullet-proof ?

Cette stratégie minimise les risques, mais aucune suite de tests ne garantit zéro bug. Si vous rencontrez un comportement inattendu, [ouvrez une issue](https://github.com/mopi1402/pithos/issues) — chaque rapport nous aide à renforcer la bibliothèque.

---

:::tip[Vous contribuez à Pithos ?]
Consultez le [Guide de test](../contribution/testing-guide.md) pour savoir quand utiliser chaque niveau, les outils, les commandes et les objectifs de couverture.
:::

---

<RelatedLinks>

- [Guide de test](../contribution/testing-guide.md) — Comment tester un utilitaire Pithos en pratique
- [Gestion des erreurs](../contribution/design-principles/error-handling.md) — Comment Pithos gère les erreurs au niveau de la conception
- [Bonnes pratiques](./best-practices.md) — Valider aux frontières, faire confiance aux types

</RelatedLinks>
