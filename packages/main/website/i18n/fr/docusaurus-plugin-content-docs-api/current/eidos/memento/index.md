---
title: "Pattern Memento en TypeScript"
sidebar_label: "Memento"
description: "Apprenez à implémenter le design pattern Memento en TypeScript fonctionnel. Capturez et restaurez l'état d'un objet pour le undo/redo."
keywords:
  - memento pattern typescript
  - state snapshot
  - undo redo state
  - history management
  - state restoration
important: false
hiddenGem: true
sidebar_custom_props:
  important: false
  hiddenGem: true
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Memento

Capturez l'état d'un objet sous forme de snapshot pour pouvoir le restaurer plus tard sans exposer ses détails internes.

---

## Le Problème

Vous construisez un éditeur photo. Les utilisateurs appliquent des filtres : luminosité, contraste, saturation, flou, sépia. Ils veulent annuler, mais pas étape par étape : ils veulent cliquer sur n'importe quel état précédent et y revenir instantanément.

L'approche naïve :

```typescript
let filterHistory: FilterState[] = [];
let currentIndex = 0;

function applyFilter(filter: string, value: number) {
  canvas.apply(filter, value);
  // Manual snapshot management everywhere
  filterHistory = filterHistory.slice(0, currentIndex + 1);
  filterHistory.push(captureState(canvas));
  currentIndex++;
}

function jumpTo(index: number) {
  currentIndex = index;
  canvas.restore(filterHistory[index]); // hope the index is valid
}
```

La logique d'historique est mélangée avec la logique des filtres. Pas de miniatures, pas de métadonnées, pas de sécurité.

---

## La Solution

Séparez la gestion de l'historique de la logique métier. Chaque changement d'état crée un snapshot automatiquement :

```typescript
import { createHistory } from "@pithos/core/eidos/memento/memento";

interface PhotoState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  thumbnail: string; // base64 preview
}

const history = createHistory<PhotoState>({
  brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0,
  thumbnail: captureThumb(canvas),
});

function applyFilter(filter: keyof PhotoState, value: number) {
  const current = history.current();
  const next = { ...current, [filter]: value, thumbnail: captureThumb(canvas) };
  history.push(next);
}

// Jump to any snapshot directly
const snapshots = history.history(); // all snapshots with timestamps
// Click snapshot #3 → undo until we reach it
```

L'historique est automatique. Chaque snapshot inclut une miniature pour la navigation visuelle. Contrairement à Command (qui stocke des opérations nommées comme "augmenter luminosité +10"), Memento stocke l'état visuel complet : ce que vous voyez est ce que vous restaurez.

---

## Démo {#live-demo}

Un éditeur photo où vous appliquez des filtres (luminosité, contraste, saturation, flou, sépia). Chaque changement crée un snapshot avec une miniature. Le panneau Historique vous permet de sauter à n'importe quel état directement, pas étape par étape. Contrairement à Command (opérations nommées), Memento capture des snapshots visuels de l'état complet.

<PatternDemo pattern="memento" />

---

## Analogie

Un point de sauvegarde dans un jeu vidéo. Le jeu capture votre état exact : position, inventaire, santé, progression. Plus tard, vous pouvez restaurer ce moment précis. Le fichier de sauvegarde est le memento.

---

## Quand l'Utiliser

- Implémenter le undo/redo avec des snapshots visuels de l'état
- Créer des points de sauvegarde ou des checkpoints
- L'état est peu coûteux à copier (petits objets, données immuables)
- Les utilisateurs doivent pouvoir sauter à n'importe quel état précédent, pas seulement reculer d'un pas

:::tip Memento vs Command
Les deux supportent le undo/redo. **Memento** stocke des snapshots d'état : idéal quand l'état est petit et que vous voulez un historique visuel. **Command** stocke des actions avec des opérations inverses : idéal quand l'état est volumineux mais les opérations sont réversibles. L'éditeur photo utilise Memento parce que vous voulez voir des miniatures de chaque état, pas une liste de "luminosité +10".
:::

---

## Quand NE PAS l'Utiliser

Si votre état est volumineux (un document complet, une scène 3D complexe), stocker des snapshots à chaque changement coûte cher. Utilisez Command à la place, qui ne stocke que le delta.

---

## API

- [createHistory](/api/eidos/memento/createHistory) — Créer un historique d'état avec support undo/redo
