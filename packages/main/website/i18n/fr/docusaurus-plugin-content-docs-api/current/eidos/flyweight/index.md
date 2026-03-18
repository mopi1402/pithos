---
title: "Pattern Flyweight en TypeScript"
sidebar_label: "Flyweight"
description: "Apprenez à implémenter le design pattern Flyweight en TypeScript fonctionnel. Partagez les données communes pour réduire l'utilisation mémoire."
keywords:
  - flyweight pattern typescript
  - memory optimization
  - object pooling
  - shared state
  - memoization
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Flyweight

Partagez l'état commun entre de nombreux objets similaires pour minimiser l'utilisation mémoire.

---

## Le Problème

Vous construisez un éditeur de texte. Chaque caractère pourrait être un objet avec police, taille, couleur et position. Un million de caractères = un million d'objets = explosion mémoire.

L'approche naïve :

```typescript
class Character {
  constructor(
    public char: string,
    public font: string,      // "Arial" repeated millions of times
    public size: number,      // 12 repeated millions of times
    public color: string,     // "#000000" repeated millions of times
    public x: number,
    public y: number
  ) {}
}

// Million characters = million copies of "Arial", 12, "#000000"
```

L'état intrinsèque (police, taille, couleur) est dupliqué. Gaspillage massif de mémoire.

---

## La Solution

Partagez l'état intrinsèque. Ne stockez que l'état extrinsèque (position) par instance :

```typescript
import { memoize } from "@pithos/core/arkhe";

// Flyweight factory - returns shared style objects
const getStyle = memoize((font: string, size: number, color: string) => ({
  font,
  size,
  color,
}));

// Characters only store position + reference to shared style
interface Character {
  char: string;
  style: ReturnType<typeof getStyle>;  // shared!
  x: number;
  y: number;
}

// Million characters, but only a few unique styles
const char1: Character = {
  char: "H",
  style: getStyle("Arial", 12, "#000000"),  // shared
  x: 0,
  y: 0,
};

const char2: Character = {
  char: "i",
  style: getStyle("Arial", 12, "#000000"),  // same reference — not a copy
  x: 10,
  y: 0,
};

char1.style === char2.style; // true — same object in memory
```

Les styles sont partagés via memoization. L'utilisation mémoire chute drastiquement.

---

## Démo

Tapez du texte, changez les styles avec les presets, et observez les compteurs. Activez et désactivez le Flyweight — la barre mémoire montre la différence en temps réel.

<PatternDemo pattern="flyweight" />

---

## Analogie

Un fichier de police. Votre ordinateur ne stocke pas une image "A" séparée pour chaque "A" à l'écran. Il stocke un seul glyphe "A" et le réutilise partout, en changeant juste la position et la taille.

---

## Quand l'Utiliser

Si vous créez des milliers d'objets qui partagent la plupart de leurs données (entités de jeu, nœuds DOM, caractères de texte, tuiles de carte), extrayez la partie partagée dans une factory mémoïsée. Plus il y a de doublons, plus le gain est important.

---

## Quand NE PAS l'Utiliser

Si chaque objet est unique sans état partagé, il n'y a rien à mutualiser. Flyweight ajoute un coût de lookup qui ne se justifie que quand de nombreux objets partagent les mêmes données intrinsèques.

---

## En TypeScript Fonctionnel

Flyweight est essentiellement de la memoization. `memoize` d'Arkhe gère le pooling :

```typescript
import { memoize } from "@pithos/core/arkhe";

// Any function that creates objects can become a flyweight factory
const getColor = memoize((r: number, g: number, b: number) => ({ r, g, b }));

// Same arguments = same object
getColor(255, 0, 0) === getColor(255, 0, 0); // true
```

---

## API

- [memoize](/api/arkhe/function/memoize) — Mettre en cache les résultats de fonctions, créant de fait un object pool
