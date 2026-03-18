---
title: "Pattern Prototype en TypeScript"
sidebar_label: "Prototype"
description: "Apprenez à implémenter le design pattern Prototype en TypeScript fonctionnel. Clonez des objets sans dépendre de leurs classes."
keywords:
  - prototype pattern typescript
  - object cloning
  - deep clone
  - copy objects
  - immutable updates
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Prototype

Créez de nouveaux objets en copiant un objet existant (le prototype) plutôt qu'en les construisant de zéro.

---

## Le Problème

Vous avez un objet de configuration complexe. Vous avez besoin de variantes, mais le construire de zéro est fastidieux et source d'erreurs.

L'approche naïve :

```typescript
const baseConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "..." } },
  database: { host: "localhost", pool: { min: 5, max: 20 } },
  logging: { level: "info", format: "json" },
};

// Créer une config de test - la copie manuelle est pénible
const testConfig = {
  server: { ...baseConfig.server, port: 3001 },
  database: { ...baseConfig.database, pool: { ...baseConfig.database.pool } },
  logging: { ...baseConfig.logging, level: "debug" },
};
// Oublié de deep-copy ssl ? Maintenant ils partagent le même objet !
```

Le spread superficiel ne fait pas de deep clone. Les objets imbriqués sont partagés. Les mutations fuient.

---

## La Solution

Clonez le prototype, puis modifiez :

```typescript
import { deepClone } from "@pithos/core/arkhe";

const baseConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "..." } },
  database: { host: "localhost", pool: { min: 5, max: 20 } },
  logging: { level: "info", format: "json" },
};

// Deep clone, puis modifiez en toute sécurité
const testConfig = deepClone(baseConfig);
testConfig.server.port = 3001;
testConfig.logging.level = "debug";

// baseConfig est intact - aucune référence partagée
```

Une vraie copie profonde. Modifiez librement sans affecter l'original.

---

## Démo {#live-demo}

Clonez une config, modifiez des champs dans le clone, observez le diff. Basculez entre "Shallow Copy" et "Deep Clone" — la copie superficielle laisse fuiter les mutations vers l'original sur les objets imbriqués. Le deep clone les garde isolés.

<PatternDemo pattern="prototype" />

---

## Analogie

Un modèle de document. Vous n'écrivez pas chaque lettre de zéro — vous copiez un modèle et remplissez les détails. Le modèle est le prototype.

---

## Quand l'Utiliser

Chaque fois que vous avez besoin de variantes d'un objet imbriqué complexe — surcharges de config, fixtures de test, spawn d'entités de jeu, presets de formulaire. Si l'objet a des références imbriquées, `deepClone` garantit l'isolation. Le spread superficiel non.

---

## Quand NE PAS l'Utiliser

Si votre objet est plat (pas d'imbrication), l'opérateur spread `{ ...obj }` est plus simple et plus rapide. Ne faites pas de deep clone quand une copie superficielle suffit.

---

## API

Ces fonctions viennent d'[Arkhe](/guide/modules/arkhe/) et sont ré-exportées par Eidos :

- [deepClone](/api/arkhe/object/deepClone) — Deep clone avec les types courants (objets, tableaux, dates, maps, sets)
- [deepCloneFull](/api/arkhe/object/deepCloneFull) — Deep clone incluant les données binaires (TypedArrays, ArrayBuffer, Blob, File)
