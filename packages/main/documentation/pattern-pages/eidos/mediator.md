---
title: "Mediator Pattern in TypeScript"
sidebar_label: "Mediator"
description: "Learn how to implement the Mediator design pattern in TypeScript with functional programming. Reduce coupling with a central communication hub."
keywords:
  - mediator pattern typescript
  - event hub
  - decoupled communication
  - message broker
  - component communication
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Mediator Pattern

Define a central coordinator that handles communication between objects so they don't reference each other directly.

---

## The Problem

You're building a flight dashboard for air traffic control. Three panels: flight list, weather, and runway status. When the weather changes to "storm", some flights should be delayed and the runway should switch to reduced capacity. When you click a flight, the weather panel should zoom to its destination and the runway panel should show the gate.

The naive approach:

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

Every panel knows about every other panel. Adding a fourth panel (passenger info, fuel status) means modifying all existing panels.

---

## The Solution

Panels only know the mediator. They emit events, the mediator routes them:

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

Panels are decoupled. Add a fuel panel without touching weather, flights, or runway.

---

## Live Demo

DGAC flight dashboard where weather, flights, and runway panels communicate exclusively through a mediator, with every event visible in a live log.

<PatternDemo pattern="mediator" />

---

## Real-World Analogy

An air traffic control tower. Planes don't communicate directly with each other: that would be chaos. They all talk to the tower, which coordinates takeoffs, landings, and flight paths. The tower is the mediator.

---

## When to Use It

- Many components need to communicate but shouldn't know about each other
- You want to centralize complex interaction logic
- Adding new components shouldn't require modifying existing ones
- You need a log of all inter-component messages

---

## When NOT to Use It

If two components have a simple parent-child relationship, direct props/callbacks are clearer. Don't route everything through a mediator when a function call would do.

---

## API

- [createMediator](/api/eidos/mediator/createMediator) — Create a typed event hub for decoupled communication
