---
title: "Bridge Pattern in TypeScript"
sidebar_label: "Bridge"
description: "Learn why the Bridge design pattern is absorbed by functional TypeScript. Separate abstraction from implementation with simple function parameters."
keywords:
  - bridge pattern typescript
  - abstraction implementation
  - decoupling
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Bridge Pattern

Separate what something does from how it does it, so both can change independently.

---

## The Problem

You have audio sources (Ode To The Winners, The Epic Hero, Gaia) and visualizers (Nebula, Silk, Smear, Cosmos). Without Bridge, you'd need OdeNebula, OdeSilk, OdeSmear, EpicNebula... an explosion of classes.

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

Two hierarchies, an abstract class, and concrete subclasses. All to combine two things that vary independently.

---

## The Solution

Pass the function as a parameter. The two axes compose freely.

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

// 3 sources × 5 visualizers = 15 combinations, zero coupling
visualize(ctx, frame, nebulaVisualizer, w, h, accent, t);
visualize(ctx, frame, silkVisualizer, w, h, accent, t);
visualize(ctx, frame, cosmosVisualizer, w, h, accent, t);
```

No classes. No inheritance. Just functions and data.

:::info Absorbed by the Language
This solution doesn't use Pithos. That's the point.

In functional TypeScript, passing a function as a parameter **is** the Bridge pattern. Eidos exports a `@deprecated` `createBridge()` function that exists only to guide you here.
:::

---

## Live Demo

Pick an audio source and a visualizer. The two axes vary independently: 3 sources × 5 visualizers = 15 combinations, all from one `visualize(frame, renderer)` call.

<PatternDemo pattern="bridge" />

---

## API

- [createBridge](/api/eidos/bridge/createBridge) `@deprecated` — just pass functions as parameters

---

<RelatedLinks title="Related">

- [Eidos: Design Patterns Module](/guide/modules/eidos) All 23 GoF patterns reimagined for functional TypeScript
- [Why FP over OOP?](/guide/modules/eidos#philosophie) The philosophy behind Eidos: no classes, no inheritance, just functions and types
- [Zygos Result](/api/zygos/result/Result) Wrap bridge calls in `Result` for typed error handling

</RelatedLinks>
