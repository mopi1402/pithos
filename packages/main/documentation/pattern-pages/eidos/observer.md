---
title: "Observer Pattern in TypeScript"
sidebar_label: "Observer"
description: "Learn how to implement the Observer design pattern in TypeScript with functional programming. Build reactive pub/sub systems with typed events."
keywords:
  - observer pattern typescript
  - pub sub typescript
  - event emitter functional
  - reactive programming
  - typed events
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Observer Pattern

Define a subscription mechanism to notify multiple objects about events that happen to the object they're observing.

---

## The Problem

You're building a stock trading app. When a stock price changes, multiple components need to react: the chart updates, alerts trigger, the portfolio recalculates.

The naive approach:

```typescript
// stock-service.ts — the publisher knows ALL its consumers
import { updateChart } from "./chart";
import { checkAlerts } from "./alerts";
import { recalcPortfolio } from "./portfolio";

function updateStockPrice(stock: Stock, newPrice: number) {
  stock.price = newPrice;
  updateChart(stock);      // tight coupling
  checkAlerts(stock);      // tight coupling
  recalcPortfolio(stock);  // tight coupling
  // ... every new feature = modify this file and add another import
}
```

Every new subscriber = modify the publisher. The publisher must know about every consumer.

---

## The Solution

Publishers don't know their subscribers. They just emit events. Subscribers register independently:

```typescript
import { createObservable } from "@pithos/core/eidos/observer/observer";

type PriceUpdate = { symbol: string; price: number };

const priceChanged = createObservable<PriceUpdate>();

// Chart subscribes
priceChanged.subscribe(({ symbol, price }) => {
  chart.addPoint(symbol, price);
});

// Alert system subscribes (doesn't know about chart)
priceChanged.subscribe(({ symbol, price }) => {
  if (price > thresholds[symbol]) sendAlert(`${symbol} spike!`);
});

// Portfolio subscribes (doesn't know about chart or alerts)
priceChanged.subscribe(({ symbol, price }) => {
  portfolio.recalculate(symbol, price);
});

// Publisher doesn't know who's listening
// TS enforces the payload shape — emit({ symbol: 123 }) is a compile error
priceChanged.notify({ symbol: "AAPL", price: 150 });
```

New subscriber? Just call `.subscribe()`. No publisher changes needed. Three independent systems react to the same event without knowing about each other.

---

## Live Demo

<PatternDemo pattern="observer" />

---

## Real-World Analogy

YouTube subscriptions. You subscribe to a channel, you get notified when they upload. The creator doesn't know how many subscribers will watch. You can unsubscribe anytime. The creator and viewers are completely decoupled.

---

## When to Use It

- Changes in one object should trigger updates in others
- You don't know in advance how many objects need to react
- You want loose coupling between event producers and consumers

---

## When NOT to Use It

If you have a single consumer that always reacts the same way, a direct function call is clearer. Observer adds indirection that's only worth it when subscribers are dynamic or unknown at compile time.

---

## API

- [createObservable](/api/eidos/observer/createObservable) — Create a typed event emitter with `subscribe`, `notify`, `once`, `safeNotify`, `size`, and `clear`
