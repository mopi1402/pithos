---
title: "Pattern State en TypeScript"
sidebar_label: "State"
description: "Apprenez à implémenter le design pattern State en TypeScript fonctionnel. Construisez des state machines finies avec des transitions typées."
keywords:
  - state pattern typescript
  - finite state machine
  - state machine typescript
  - typed transitions
  - tennis scoring
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern State

Permet à un objet de modifier son comportement quand son état interne change, comme s'il passait à une implémentation différente.

---

## Le Problème

Vous développez un système de score de tennis pour Roland Garros. Le comptage au tennis est notoirement complexe : 0 → 15 → 30 → 40 → Jeu, mais à 40-40 c'est Deuce, puis Avantage, puis soit Jeu soit retour à Deuce.

L'approche naïve :

```typescript
function scorePoint(server: Score, receiver: Score, whoScored: "server" | "receiver") {
  if (whoScored === "server") {
    if (server === "40" && receiver === "40") {
      return { server: "AD", receiver: "40" };
    } else if (server === "40" && receiver !== "AD") {
      return { server: "Game", receiver };
    } else if (server === "AD") {
      return { server: "Game", receiver: "40" };
    } else if (receiver === "AD") {
      return { server: "40", receiver: "40" }; // back to Deuce
    } else if (server === "0") {
      return { server: "15", receiver };
    } else if (server === "15") {
      return { server: "30", receiver };
    }
    // ... 15 branches de plus pour toutes les combinaisons
  }
  // ... tout dupliquer pour le receveur
}
```

Des conditions imbriquées partout. Facile de rater des cas limites. Aucune garantie d'avoir couvert tous les états.

---

## La Solution

Modélisez chaque combinaison de score comme un état avec des transitions explicites :

```typescript
import { createMachine } from "@pithos/core/eidos/state/state";

// TS infère tous les états et événements — les transitions invalides sont des erreurs de compilation
const tennisGame = createMachine({
  "0-0":   { p1: { to: "15-0" },  p2: { to: "0-15" } },
  "15-0":  { p1: { to: "30-0" },  p2: { to: "15-15" } },
  "0-15":  { p1: { to: "15-15" }, p2: { to: "0-30" } },
  "30-0":  { p1: { to: "40-0" },  p2: { to: "30-15" } },
  // ... toutes les combinaisons de score
  "40-40": { p1: { to: "AD-40" }, p2: { to: "40-AD" } },  // Deuce!
  "AD-40": { p1: { to: "Game-P1" }, p2: { to: "40-40" } }, // Avantage ou retour à Deuce
  "40-AD": { p1: { to: "40-40" }, p2: { to: "Game-P2" } },
  // Simplifié — la démo live utilise "Deuce", "AD-P1", "AD-P2" pour la lisibilité
  "Game-P1": {},  // État terminal
  "Game-P2": {},
}, "0-0");

tennisGame.send("p1"); // "15-0"
tennisGame.send("p1"); // "30-0"
// ... le jeu continue
```

Chaque transition d'état est explicite. La boucle Deuce ↔ Avantage est claire. Les états terminaux n'ont pas de transitions.

---

## Démo {#live-demo}

Marquez des points pour chaque joueur et observez la state machine gérer les transitions Deuce, Avantage et Jeu.

<PatternDemo pattern="state" />

---

## Analogie

Le tableau de score d'un arbitre de tennis. L'arbitre ne pense pas « si le joueur 1 a 40 et le joueur 2 a 30, alors... ». Il sait simplement : depuis ce score, un point pour le joueur 1 mène à tel score. Les règles sont encodées dans les transitions, pas dans de la logique conditionnelle.

---

## Quand l'Utiliser

- Le comportement d'un objet dépend de son état
- Vous avez de la logique conditionnelle complexe basée sur l'état
- Les transitions d'état doivent être explicites et validées
- Construction de workflows, logique de jeu, ou processus multi-étapes

---

## Quand NE PAS l'Utiliser

Si votre état est juste un flag booléen (on/off, activé/désactivé), une state machine ajoute de la cérémonie inutile. Utilisez-la quand vous avez 3+ états avec des règles de transition non triviales.

---

## API

- [createMachine](/api/eidos/state/createMachine) — Créer une state machine finie avec des états et événements typés

