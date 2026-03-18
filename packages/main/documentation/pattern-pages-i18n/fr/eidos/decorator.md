---
title: "Pattern Decorator en TypeScript"
sidebar_label: "Decorator"
description: "Apprenez à implémenter le design pattern Decorator en TypeScript fonctionnel. Ajoutez du comportement aux fonctions sans les modifier."
keywords:
  - decorator pattern typescript
  - composition de fonctions
  - ajout dynamique de comportement
  - wrapper de fonctions
  - middleware pattern
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Decorator

Attachez dynamiquement du comportement supplémentaire à une fonction, sans modifier la fonction originale.

---

## Le Problème

Vous avez une fonction d'analyse de séquences ADN. Maintenant il faut ajouter un filtrage qualité. Puis du cache pour les séquences de référence. Puis de la logique de retry pour les longues séquences. Puis des métriques de temps.

L'approche naïve :

```typescript
async function analyzeSequence(dna: string) {
  console.log(`Analyzing ${dna.length} base pairs`);  // logging mélangé
  const start = Date.now();                            // timing mélangé
  
  if (getQualityScore(dna) < 30) {                    // filtrage mélangé
    throw new Error("Low quality sequence");
  }
  
  const cached = cache.get(dna);                      // cache mélangé
  if (cached) return cached;
  
  try {
    const result = await runAnalysis(dna);
    cache.set(dna, result);
    console.log(`Took ${Date.now() - start}ms`);
    return result;
  } catch (e) {
    // logique de retry mélangée...
  }
}
```

L'analyse principale est enterrée sous les préoccupations transversales. Tester est pénible.

---

## La Solution

Gardez la fonction principale pure. Empilez des decorators qui wrappent chacun le précédent — même signature en entrée, même signature en sortie :

```typescript
import { decorate } from "@pithos/core/eidos/decorator/decorator";

// Fonction principale pure — juste l'analyse
const analyzeSequence = async (dna: string) => runAnalysis(dna);

// Chaque decorator wrappe le précédent, en préservant la signature
const enhanced = decorate(
  analyzeSequence,
  withQualityFilter(30),          // rejeter les séquences de mauvaise qualité
  withCache(new Map()),           // mettre en cache les résultats des séquences connues
  withRetry(3),                   // retry en cas de timeout
  withTiming("analysis"),         // journaliser le temps d'exécution
);

const result = await enhanced("ATCGATCG...");
```

Le consommateur voit la même signature `(dna: string) => Promise<Result>` quel que soit le nombre de couches empilées. C'est l'idée clé : **les decorators sont invisibles pour l'appelant**.

Pour les cas plus simples, utilisez les helpers `before`, `after` et `around` :

```typescript
import { before, after, around } from "@pithos/core/eidos/decorator/decorator";

// before/after pour les effets de bord
const withLogging = before((dna) => console.log(`Analyzing ${dna.length}bp`));
const withMetrics = after((_, result) => metrics.record(result));

// around pour un contrôle total (cache, retry, etc.)
const withCache = (cache: Map<string, Result>) => around((fn, dna) => {
  const cached = cache.get(dna);
  if (cached) return cached;
  const result = fn(dna);
  cache.set(dna, result);
  return result;
});
```

---

## Démo {#live-demo}

<PatternDemo pattern="decorator" />

---

## Analogie

Une commande de café. Commencez par un espresso (le cœur). Ajoutez du lait (decorator). Ajoutez du sucre (decorator). Ajoutez de la crème fouettée (decorator). Chaque ajout wrappe le résultat précédent sans changer la façon dont l'espresso est préparé.

---

## Quand l'Utiliser

- Ajouter du logging, du cache, de la validation, du retry ou du timing à des fonctions existantes
- Vous voulez composer plusieurs comportements indépendants
- Les préoccupations transversales doivent être séparées de la logique métier

---

## Quand NE PAS l'Utiliser

Si vous avez juste besoin d'une amélioration fixe, une simple fonction wrapper suffit. Decorator brille quand vous composez plusieurs comportements indépendants.

---

## API

- [decorate](/api/eidos/decorator/decorate) — Appliquer plusieurs decorators à une fonction
- [before](/api/eidos/decorator/before) — Exécuter du code avant l'exécution de la fonction
- [after](/api/eidos/decorator/after) — Exécuter du code après le retour de la fonction
- [around](/api/eidos/decorator/around) — Wrapper la fonction avec un contrôle total sur l'exécution

