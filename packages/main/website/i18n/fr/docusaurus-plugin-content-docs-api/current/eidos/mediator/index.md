---
title: "Pattern Mediator en TypeScript"
sidebar_label: "Mediator"
description: "Apprenez à implémenter le design pattern Mediator en TypeScript fonctionnel. Réduisez le couplage avec un hub de communication central."
keywords:
  - mediator pattern typescript
  - event hub
  - decoupled communication
  - message broker
  - component communication
important: false
hiddenGem: true
sidebar_custom_props:
  important: false
  hiddenGem: true
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Mediator

Définissez un coordinateur central qui gère la communication entre objets pour qu'ils ne se référencent pas directement.

---

## Le Problème

Vous construisez un tableau de bord de vol pour le contrôle aérien. Trois panneaux : liste des vols, météo et état des pistes. Quand la météo passe en "tempête", certains vols doivent être retardés et la piste doit passer en capacité réduite. Quand vous cliquez sur un vol, le panneau météo doit zoomer sur sa destination et le panneau piste doit afficher la porte d'embarquement.

L'approche naïve :

```typescript
function updateWeather(condition: string) {
  weatherPanel.display(condition);
  flightList.delayFlightsFor(condition);   // knows about flightList
  runwayStatus.adjustCapacity(condition);   // knows about runwayStatus
}

function selectFlight(flightId: string) {
  flightList.highlight(flightId);
  weatherPanel.zoomTo(flight.destination);  // knows about weatherPanel
  runwayStatus.showGate(flight.gate);       // knows about runwayStatus
}
```

Chaque panneau connaît tous les autres. Ajouter un quatrième panneau (infos passagers, état du carburant) implique de modifier tous les panneaux existants.

---

## La Solution

Les panneaux ne connaissent que le mediator. Ils émettent des événements, le mediator les route :

```typescript
import { createMediator } from "@pithos/core/eidos/mediator/mediator";

type DashboardEvents = {
  weatherChanged: { condition: string; severity: number };
  flightSelected: { flightId: string; destination: string; gate: string };
  runwayUpdated: { capacity: "full" | "reduced" | "closed" };
};

const dashboard = createMediator<DashboardEvents>();

// Weather panel reacts to flight selection
dashboard.on("flightSelected", ({ destination }) => {
  weatherPanel.zoomTo(destination);
});

// Flight list reacts to weather changes
dashboard.on("weatherChanged", ({ condition, severity }) => {
  if (severity > 7) flightList.delayAll();
  dashboard.emit("runwayUpdated", { capacity: "reduced" });
});

// Runway reacts to weather
dashboard.on("runwayUpdated", ({ capacity }) => {
  runwayStatus.setCapacity(capacity);
});

// Panels emit events without knowing who listens
weatherPanel.onChange = (condition, severity) =>
  dashboard.emit("weatherChanged", { condition, severity });
```

Les panneaux sont découplés. Ajoutez un panneau carburant sans toucher à la météo, aux vols ou aux pistes.

---

## Démo {#live-demo}

Tableau de bord de vol DGAC où les panneaux météo, vols et pistes communiquent exclusivement via un mediator, avec chaque événement visible dans un log en temps réel.

<PatternDemo pattern="mediator" />

---

## Analogie

Une tour de contrôle aérien. Les avions ne communiquent pas directement entre eux : ce serait le chaos. Ils parlent tous à la tour, qui coordonne les décollages, atterrissages et trajectoires de vol. La tour est le mediator.

---

## Quand l'Utiliser

- Plusieurs composants doivent communiquer sans se connaître
- Vous voulez centraliser la logique d'interaction complexe
- Ajouter de nouveaux composants ne doit pas nécessiter de modifier les existants
- Vous avez besoin d'un log de tous les messages inter-composants

---

## Quand NE PAS l'Utiliser

Si deux composants ont une relation parent-enfant simple, des props/callbacks directs sont plus clairs. Ne routez pas tout via un mediator quand un appel de fonction suffit.

---

## API

- [createMediator](/api/eidos/mediator/createMediator) — Créer un hub d'événements typé pour une communication découplée
