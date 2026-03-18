---
title: "Pattern Observer en TypeScript"
sidebar_label: "Observer"
description: "Apprenez à implémenter le design pattern Observer en TypeScript fonctionnel. Construisez des systèmes réactifs pub/sub avec des événements typés."
keywords:
  - observer pattern typescript
  - pub sub typescript
  - event emitter fonctionnel
  - programmation réactive
  - typed events
important: true
hiddenGem: false
sidebar_custom_props:
  important: true
  hiddenGem: false
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Observer

Définissez un mécanisme d'abonnement pour notifier plusieurs objets des événements qui surviennent sur l'objet qu'ils observent.

---

## Le Problème

Vous développez une app de trading. Quand le prix d'une action change, plusieurs composants doivent réagir : le graphique se met à jour, les alertes se déclenchent, le portefeuille se recalcule.

L'approche naïve :

```typescript
// stock-service.ts — le publisher connaît TOUS ses consommateurs
import { updateChart } from "./chart";
import { checkAlerts } from "./alerts";
import { recalcPortfolio } from "./portfolio";

function updateStockPrice(stock: Stock, newPrice: number) {
  stock.price = newPrice;
  updateChart(stock);      // couplage fort
  checkAlerts(stock);      // couplage fort
  recalcPortfolio(stock);  // couplage fort
  // ... chaque nouvelle feature = modifier ce fichier et ajouter un import
}
```

Chaque nouvel abonné = modifier le publisher. Le publisher doit connaître chaque consommateur.

---

## La Solution

Les publishers ne connaissent pas leurs abonnés. Ils émettent juste des événements. Les abonnés s'enregistrent indépendamment :

```typescript
import { createObservable } from "@pithos/core/eidos/observer/observer";

type PriceUpdate = { symbol: string; price: number };

const priceChanged = createObservable<PriceUpdate>();

// Le graphique s'abonne
priceChanged.subscribe(({ symbol, price }) => {
  chart.addPoint(symbol, price);
});

// Le système d'alertes s'abonne (ne connaît pas le graphique)
priceChanged.subscribe(({ symbol, price }) => {
  if (price > thresholds[symbol]) sendAlert(`${symbol} spike!`);
});

// Le portefeuille s'abonne (ne connaît ni le graphique ni les alertes)
priceChanged.subscribe(({ symbol, price }) => {
  portfolio.recalculate(symbol, price);
});

// Le publisher ne sait pas qui écoute
// TS impose la forme du payload — emit({ symbol: 123 }) est une erreur de compilation
priceChanged.notify({ symbol: "AAPL", price: 150 });
```

Nouvel abonné ? Appelez `.subscribe()`. Aucune modification du publisher. Trois systèmes indépendants réagissent au même événement sans se connaître.

---

## Démo {#live-demo}

<PatternDemo pattern="observer" />

---

## Analogie

Les abonnements YouTube. Vous vous abonnez à une chaîne, vous êtes notifié quand elle publie. Le créateur ne sait pas combien d'abonnés vont regarder. Vous pouvez vous désabonner à tout moment. Le créateur et les spectateurs sont complètement découplés.

---

## Quand l'Utiliser

- Des changements dans un objet doivent déclencher des mises à jour dans d'autres
- Vous ne savez pas à l'avance combien d'objets doivent réagir
- Vous voulez un couplage faible entre producteurs et consommateurs d'événements

---

## Quand NE PAS l'Utiliser

Si vous avez un seul consommateur qui réagit toujours de la même façon, un appel de fonction direct est plus clair. Observer ajoute de l'indirection qui ne vaut le coup que quand les abonnés sont dynamiques ou inconnus à la compilation.

---

## API

- [createObservable](/api/eidos/observer/createObservable) — Créer un émetteur d'événements typé avec `subscribe`, `notify`, `once`, `safeNotify`, `size` et `clear`

