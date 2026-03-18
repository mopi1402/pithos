---
title: "Pattern Adapter en TypeScript"
sidebar_label: "Adapter"
description: "Apprenez à implémenter le design pattern Adapter en TypeScript fonctionnel. Faites fonctionner ensemble des interfaces incompatibles."
keywords:
  - adapter pattern typescript
  - interface conversion
  - api wrapper
  - legacy integration
  - function signature transformation
important: false
hiddenGem: true
sidebar_custom_props:
  important: false
  hiddenGem: true
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Adapter

Faites fonctionner ensemble des signatures de fonctions incompatibles sans modifier aucun des deux côtés.

---

## Le Problème

Vous construisez une app de cartographie (appelons-la ViaMikeline) qui affiche des points d'intérêt depuis deux sources de données ouvertes. L'API IRVE (bornes de recharge) retourne du JSON plat avec `{ nom_station, consolidated_latitude, consolidated_longitude, puissance_nominale, prise_type_2 }`. L'API stations-service retourne du JSON imbriqué avec `{ geom: { lon, lat }, gazole_prix, sp95_prix, carburants_disponibles }`. Votre carte attend un format unique `{ name, coords: [lat, lng], meta }`.

L'approche naïve :

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

La logique de conversion éparpillée dans l'UI. Ajouter une troisième source implique plus de conditions partout.

---

## La Solution

`adapt(source, mapInput, mapOutput)` enveloppe une fonction en transformant son input avant l'appel et son output après. Chaque API a sa propre fonction de fetch, son format d'URL et sa forme de réponse. `adapt` fait le pont pour que le consommateur voie une signature unique et uniforme : `(bbox: BBox) => Promise<MapFeature[]>`.

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

Les deux fonctions adaptées ont la même signature : `(bbox: BBox) => Promise<MapFeature[]>`. L'API IRVE attend `in_bbox(coordonneesxy, west, south, east, north)` tandis que l'API carburant attend `in_bbox(geom, south, west, north, east)` : ordres de paramètres différents, noms de champs différents, formes de réponse différentes. `adapt` gère les deux côtés : la conversion d'input (BBox → URL) et la conversion d'output (enregistrements bruts → MapFeature). Ajouter une troisième source de données = un nouvel appel `adapt()`, zéro changement en aval.

---

## Démo {#live-demo}

La carte a besoin de `MapFeature[]` à partir d'une `BBox`. Chaque API attend un format d'URL différent : IRVE utilise `in_bbox(coordonneesxy, west, south, east, north)`, carburant utilise `in_bbox(geom, south, west, north, east)`. Elles retournent aussi des formes d'enregistrements différentes. `adapt()` enveloppe chaque fetch brut pour que l'input (BBox → URL) et l'output (JSON brut → MapFeature[]) soient convertis au même endroit. La carte appelle `fetchCharging(bbox)` et `fetchFuel(bbox)` avec la même signature, sans connaître les différences d'API derrière.

:::warning Note de production
Dans une vraie application, ces adapters vivraient dans un service backend qui ingère les données de multiples sources, les normalise via des adapters, et stocke les enregistrements `MapFeature` consolidés en base de données. Le frontend interrogerait une seule API unifiée. Ici, les adapters tournent côté client pour que vous puissiez les voir en action sans infrastructure serveur.
:::

<PatternDemo pattern="adapter" />

---

## Analogie

Un adaptateur de prise pour les voyages internationaux. Votre laptop a une prise US, la prise murale est européenne. L'adaptateur ne change ni l'un ni l'autre. Il les rend juste compatibles.

---

## Quand l'Utiliser

- Intégrer des APIs tierces avec des formats de réponse incompatibles
- Normaliser plusieurs sources de données vers une forme commune
- Envelopper du code legacy avec une interface moderne
- Isoler la logique de conversion en un seul endroit

---

## Quand NE PAS l'Utiliser

Si vous contrôlez les deux côtés de l'interface, faites-les simplement correspondre. Un adapter entre deux APIs que vous possédez est un signe que l'une d'elles devrait changer.

---

## API

- [adapt](/api/eidos/adapter/adapt) — Transformer les arguments d'une fonction avant l'appel
- [createAdapter](/api/eidos/adapter/createAdapter) — Construire des adapters réutilisables pour la conversion d'interfaces

---

:::info Avertissement
ViaMichelin est une marque déposée de Michelin. Elle est mentionnée ici uniquement comme exemple concret à des fins éducatives dans le cadre du fair use nominatif. Ce projet n'est ni affilié, ni approuvé, ni sponsorisé par Michelin ou ViaMichelin de quelque manière que ce soit.
:::
