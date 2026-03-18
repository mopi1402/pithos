---
title: "Pattern Bridge en TypeScript"
sidebar_label: "Bridge"
description: "Découvrez pourquoi le design pattern Bridge est absorbé par le TypeScript fonctionnel. Séparez abstraction et implémentation avec de simples paramètres de fonction."
keywords:
  - bridge pattern typescript
  - abstraction implementation
  - decoupling
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Pattern Bridge

Séparez ce que quelque chose fait de comment il le fait, pour que les deux puissent évoluer indépendamment.

---

## Le Problème

Vous avez des sources audio (Ode To The Winners, The Epic Hero, Gaia) et des visualiseurs (Nebula, Silk, Smear, Cosmos). Sans Bridge, il faudrait OdeNebula, OdeSilk, OdeSmear, EpicNebula... une explosion de classes.

```typescript
interface AudioSource {
  getFrame(time: number): number[];
}

interface Visualizer {
  render(frame: number[]): void;
}

abstract class MusicPlayer {
  constructor(
    protected source: AudioSource,
    protected visualizer: Visualizer,
  ) {}
  abstract play(): void;
}

class LivePlayer extends MusicPlayer {
  play() {
    const frame = this.source.getFrame(Date.now());
    this.visualizer.render(frame);
  }
}
```

Deux hiérarchies, une classe abstraite, et des sous-classes concrètes. Tout ça pour combiner deux choses qui varient indépendamment.

---

## La Solution

Passez la fonction en paramètre. Les deux axes se composent librement.

```typescript
type AudioFrame = Uint8Array;

type Visualizer = (
  ctx: CanvasRenderingContext2D,
  frame: AudioFrame,
  w: number, h: number,
  accent: string, time: number,
) => void;

function visualize(
  ctx: CanvasRenderingContext2D,
  frame: AudioFrame,
  renderer: Visualizer,
  w: number, h: number,
  accent: string, time: number,
) {
  renderer(ctx, frame, w, h, accent, time);
}

// 3 sources × 5 visualiseurs = 15 combinaisons, zéro couplage
visualize(ctx, frame, nebulaVisualizer, w, h, accent, t);
visualize(ctx, frame, silkVisualizer, w, h, accent, t);
visualize(ctx, frame, cosmosVisualizer, w, h, accent, t);
```

Pas de classes. Pas d'héritage. Juste des fonctions et des données.

:::info Absorbé par le Langage
Cette solution n'utilise pas Pithos. C'est justement le point.

En TypeScript fonctionnel, passer une fonction en paramètre **est** le pattern Bridge. Eidos exporte une fonction `@deprecated` `createBridge()` qui n'existe que pour vous guider ici.
:::

---

## Démo {#live-demo}

Choisissez une source audio et un visualiseur. Les deux axes varient indépendamment : 3 sources × 5 visualiseurs = 15 combinaisons, le tout depuis un seul appel `visualize(frame, renderer)`.

<PatternDemo pattern="bridge" />

---

## API

- [createBridge](/api/eidos/bridge/createBridge) `@deprecated` — passez simplement des fonctions en paramètres

---

<RelatedLinks title="Liens connexes">

- [Eidos : Module Design Patterns](/guide/modules/eidos) Les 23 patterns GoF réimaginés pour le TypeScript fonctionnel
- [Pourquoi la FP plutôt que la POO ?](/guide/modules/eidos#philosophie) La philosophie derrière Eidos : pas de classes, pas d'héritage, juste des fonctions et des types
- [Zygos Result](/api/zygos/result/Result) Encapsulez vos appels bridge dans `Result` pour une gestion d'erreurs typée

</RelatedLinks>
