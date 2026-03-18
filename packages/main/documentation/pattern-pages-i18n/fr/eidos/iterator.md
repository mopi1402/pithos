---
title: "Pattern Iterator en TypeScript"
sidebar_label: "Iterator"
description: "Apprenez à implémenter le design pattern Iterator en TypeScript fonctionnel. Construisez des séquences lazy avec des opérations chaînables."
keywords:
  - iterator pattern typescript
  - évaluation lazy
  - fonctions génératrices
  - iterable typescript
  - opérations sur séquences
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Iterator

Fournissez un moyen d'accéder séquentiellement aux éléments d'une collection sans exposer sa représentation interne.

---

## Le Problème

Vous développez un Pokédex. Les Pokémon viennent de différentes sources : un tableau local pour la Génération 1 (151 entrées), une API paginée pour la base complète (1000+), et un arbre par type (Feu > Salamèche > Reptincel...). Chaque source a une structure différente, mais le consommateur veut juste « donne-moi le prochain Pokémon ».

L'approche naïve :

```typescript
// Du code différent pour chaque source
function showFromArray(pokemon: Pokemon[], index: number) {
  return pokemon[index]; // et si index > length ?
}

function showFromAPI(page: number) {
  const response = await fetch(`/api/pokemon?page=${page}`);
  return response.json(); // forme différente, la logique de pagination fuit
}

function showFromTree(node: TypeNode) {
  // parcours en profondeur ? en largeur ? qui décide ?
  return node.children[0]; // logique complètement différente
}
```

Trois sources, trois stratégies de parcours, trois APIs consommateur. Ajouter une quatrième source = écrire un quatrième chemin consommateur.

---

## La Solution

Wrappez chaque source dans un itérable lazy. Le consommateur appelle `next()` de façon identique pour les trois :

```typescript
import { createIterable, take, toArray } from "@pithos/core/eidos/iterator/iterator";
import { some, none } from "@zygos/option";

// Source 1 : tableau local (fini, 151 entrées)
const gen1 = createIterable(() => {
  let i = 0;
  return () => i < gen1Data.length ? some(gen1Data[i++]) : none;
});

// Source 2 : API paginée (lazy, charge les pages à la demande)
const allPokemon = createIterable(() => {
  let page = 0;
  let items: Pokemon[] = [];
  let index = 0;
  return () => {
    if (index >= items.length) {
      items = fetchPage(page++);
      index = 0;
    }
    return index < items.length ? some(items[index++]) : none;
  };
});

// Source 3 : arbre par type (parcours en profondeur)
const byType = createIterable(() => {
  const stack = [typeTree];
  return () => {
    while (stack.length) {
      const node = stack.pop()!;
      if (node.children) stack.push(...node.children);
      if (node.pokemon) return some(node.pokemon);
    }
    return none;
  };
});

// Le code consommateur est identique pour les trois
for (const pokemon of take(10)(gen1)) {
  display(pokemon);
}
```

Une interface, trois sources. Le consommateur ne sait jamais si les données viennent de la mémoire, d'un appel réseau ou d'un parcours d'arbre.

---

## Démo {#live-demo}

Parcourez un Pokédex avec trois sources interchangeables : un tableau local Génération 1 (151 Pokémon, fini), une API paginée (lazy, infinie), et un arbre par type. Le code consommateur appelle `iterator.next()` de façon identique pour les trois sources.

<PatternDemo pattern="iterator" />

---

## Analogie

Une télécommande TV avec les boutons chaîne haut/bas. Vous n'avez pas besoin de savoir comment les chaînes sont stockées en interne. Vous appuyez juste sur « suivant » pour voir la prochaine. La télécommande est l'iterator : elle fournit un accès séquentiel sans exposer les détails internes du décodeur.

---

## Quand l'Utiliser

- Unifier le parcours de différentes sources de données
- Traiter des datasets volumineux ou infinis de façon lazy (ne charger que le nécessaire)
- Chaîner des transformations qui doivent s'exécuter à la demande
- Masquer les détails d'implémentation de la collection aux consommateurs

---

## Quand NE PAS l'Utiliser

Si toutes vos données tiennent en mémoire et viennent d'un seul tableau, une boucle `for...of` classique est plus simple. Ne wrappez pas un tableau de 10 éléments dans `createIterable` juste pour le pattern.

---

## API

- [createIterable](/api/eidos/iterator/createIterable) — Wrapper un générateur dans un itérable chaînable
- [lazyRange](/api/eidos/iterator/lazyRange) — Créer des plages numériques lazy
- [iterate](/api/eidos/iterator/iterate) — Générer des séquences infinies à partir d'une seed et d'une fonction

