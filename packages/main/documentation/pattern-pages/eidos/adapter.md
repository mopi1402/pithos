---
title: "Adapter Pattern in TypeScript"
sidebar_label: "Adapter"
description: "Learn how to implement the Adapter design pattern in TypeScript with functional programming. Make incompatible interfaces work together."
keywords:
  - adapter pattern typescript
  - interface conversion
  - api wrapper
  - legacy integration
  - function signature transformation
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Adapter Pattern

Make incompatible function signatures work together without modifying either side.

---

## The Problem

You're building a map app (let's call it ViaMikeline) that shows points of interest from two open data sources. The IRVE API (EV charging stations) returns flat JSON with `{ nom_station, consolidated_latitude, consolidated_longitude, puissance_nominale, prise_type_2 }`. The fuel station API returns nested JSON with `{ geom: { lon, lat }, gazole_prix, sp95_prix, carburants_disponibles }`. Your map expects a single `{ name, coords: [lat, lng], meta }` format.

The naive approach:

```typescript
function toMapFeature(source: "charging" | "fuel", raw: unknown) {
  if (source === "charging") {
    const s = raw as IRVEStation;
    return { name: s.nom_station, coords: [s.consolidated_latitude, s.consolidated_longitude], meta: { power: s.puissance_nominale } };
  }
  if (source === "fuel") {
    const f = raw as FuelStation;
    return { name: f.adresse, coords: [f.geom.lat, f.geom.lon], meta: { prix: f.gazole_prix } };
  }
}
```

Conversion logic scattered in the UI. Adding a third source means more conditionals everywhere.

---

## The Solution

`adapt(source, mapInput, mapOutput)` wraps a function by transforming its input before calling it and its output after. Each API has its own raw fetch function, URL format, and response shape. `adapt` bridges the gap so the consumer sees a single uniform signature: `(bbox: BBox) => Promise<MapFeature[]>`.

```typescript
import { adapt } from "@pithos/core/eidos/adapter/adapter";

interface MapFeature {
  id: string;
  name: string;
  coords: [number, number];
  meta: Record<string, string | number>;
}

// Raw fetch functions — each returns its own API-specific shape
async function rawFetchCharging(url: string): Promise<IRVEStation[]> { /* ... */ }
async function rawFetchFuel(url: string): Promise<FuelStation[]> { /* ... */ }

// adapt() wraps each raw fetch:
//   mapInput:  BBox → API-specific URL (different query format per API)
//   mapOutput: raw records → MapFeature[] (different field mapping per API)

const fetchChargingPOIs = adapt(
  rawFetchCharging,                              // source: (url: string) => Promise<IRVEStation[]>
  (bbox: BBox): string => {                      // mapInput: BBox → IRVE URL format
    const where = `in_bbox(coordonneesxy, ${bbox.west}, ${bbox.south}, ${bbox.east}, ${bbox.north})`;
    return `https://odre.opendatasoft.com/api/...?where=${where}`;
  },
  async (records): Promise<MapFeature[]> =>      // mapOutput: IRVEStation[] → MapFeature[]
    (await records).map((s) => ({
      id: s.id_station_itinerance,
      name: s.nom_station,
      coords: [s.consolidated_latitude, s.consolidated_longitude],
      meta: { power: `${s.puissance_nominale} kW` },
    })),
);

const fetchFuelPOIs = adapt(
  rawFetchFuel,                                  // source: (url: string) => Promise<FuelStation[]>
  (bbox: BBox): string => {                      // mapInput: BBox → Fuel URL format
    const where = `in_bbox(geom, ${bbox.south}, ${bbox.west}, ${bbox.north}, ${bbox.east})`;
    return `https://data.economie.gouv.fr/api/...?where=${where}`;
  },
  async (records): Promise<MapFeature[]> =>      // mapOutput: FuelStation[] → MapFeature[]
    (await records).map((f) => ({
      id: `fuel-${f.id}`,
      name: `Station ${f.ville ?? "?"}`,
      coords: [f.geom.lat, f.geom.lon],
      meta: { gazole: f.gazole_prix ?? "—" },
    })),
);

// Consumer code — same signature, doesn't know which API is behind
const charging = await fetchChargingPOIs(bbox);  // MapFeature[]
const fuel     = await fetchFuelPOIs(bbox);      // MapFeature[]
```

Both adapted functions have the same signature: `(bbox: BBox) => Promise<MapFeature[]>`. The IRVE API expects `in_bbox(coordonneesxy, west, south, east, north)` while the fuel API expects `in_bbox(geom, south, west, north, east)`: different parameter orders, different field names, different response shapes. `adapt` handles both sides: the input conversion (BBox → URL) and the output conversion (raw records → MapFeature). Adding a third data source means one new `adapt()` call, zero changes downstream.

---

## Live Demo

The map needs `MapFeature[]` from a `BBox`. Each API expects a different URL format: IRVE uses `in_bbox(coordonneesxy, west, south, east, north)`, fuel uses `in_bbox(geom, south, west, north, east)`. They also return different record shapes. `adapt()` wraps each raw fetch so both input (BBox → URL) and output (raw JSON → MapFeature[]) are converted in one place. The map calls `fetchCharging(bbox)` and `fetchFuel(bbox)` with the same signature, unaware of the API differences behind them.

:::warning Production note
In a real application, these adapters would live in a backend service that ingests data from multiple sources, normalizes it through adapters, and stores the consolidated `MapFeature` records in a database. The frontend would query a single unified API. Here, the adapters run client-side so you can see them in action without any server infrastructure.
:::

<PatternDemo pattern="adapter" />

---

## Real-World Analogy

A power adapter for international travel. Your laptop has a US plug, the outlet is European. The adapter doesn't change either. It just makes them compatible.

---

## When to Use It

- Integrate third-party APIs with incompatible response formats
- Normalize multiple data sources to a common shape
- Wrap legacy code with a modern interface
- Isolate conversion logic in one place

---

## When NOT to Use It

If you control both sides of the interface, just make them match. An adapter between two APIs you own is a sign that one of them should change.

---

## API

- [adapt](/api/eidos/adapter/adapt) — Transform function arguments before calling
- [createAdapter](/api/eidos/adapter/createAdapter) — Build reusable adapters for interface conversion

---

:::info Disclaimer
ViaMichelin is a registered trademark of Michelin. It is mentioned here solely as a real-world example for educational purposes under nominative fair use. This project is not affiliated with, endorsed by, or sponsored by Michelin or ViaMichelin in any way.
:::
