---
title: "Pattern Singleton en TypeScript"
sidebar_label: "Singleton"
description: "Apprenez à implémenter le design pattern Singleton en TypeScript fonctionnel. Initialisation paresseuse avec once()."
keywords:
  - singleton pattern typescript
  - single instance
  - lazy initialization
  - once function
  - module singleton
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Singleton

Garantissez qu'une valeur n'est créée qu'une seule fois et fournissez un point d'accès partagé.

---

## Le Problème

Vous avez des ressources coûteuses (connexions base de données, clients cache, loggers) qui doivent être initialisées une seule fois et réutilisées partout. L'approche naïve : initialiser au moment de l'import et croiser les doigts.

```typescript
// db.ts
export const db = new DatabaseConnection(); // s'exécute immédiatement à l'import
// Et si la connexion échoue ? Et si personne n'en a besoin tout de suite ?
```

Ou pire, initialiser dans chaque fonction qui en a besoin :

```typescript
function getUser(id: string) {
  const db = new DatabaseConnection(); // nouvelle connexion à chaque appel !
  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);
}
```

L'un gaspille des ressources au démarrage. L'autre en gaspille à chaque appel.

---

## La Solution

Initialisation paresseuse avec `once`. L'instance est créée au premier usage, puis réutilisée :

```typescript
import { once } from "@pithos/core/arkhe";

const getDatabase = once(() => {
  console.log("Connecting...");
  return new DatabaseConnection();
});

// Premier appel : initialise (lent)
const db1 = getDatabase(); // "Connecting..."

// Deuxième appel : même instance (instantané)
const db2 = getDatabase(); // pas de log
db1 === db2; // true
```

Pas de classe, pas de `getInstance()`, pas de constructeur privé. `once` encapsule n'importe quelle fonction et garantit qu'elle ne s'exécute qu'une seule fois. Le résultat est mis en cache et retourné à chaque appel suivant.

---

## Démo {#live-demo}

Trois services : Database, Cache, Logger. Cliquez sur Request pour chacun. Le premier clic est lent (initialisation). Cliquez à nouveau : instantané, même instance. Observez les compteurs : les instances restent basses tandis que les requêtes grimpent.

<PatternDemo pattern="singleton" />

---

## Analogie

Un gouvernement. Un pays a un seul président à la fois. Vous ne créez pas un nouveau président chaque fois que vous avez besoin d'une décision — vous accédez à celui en place. `once` est l'élection : elle ne se produit qu'une fois, et tout le monde obtient le même dirigeant.

---

## Les Modules Sont Déjà des Singletons

Les modules ES sont évalués une seule fois. Chaque import obtient la même référence :

```typescript
// config.ts
export const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000,
};

// Même objet partout
import { config } from "./config"; // même instance
import { config } from "./config"; // même instance
```

Pour des valeurs statiques, aucun pattern nécessaire. `once` apporte de la valeur quand vous avez besoin d'une initialisation paresseuse ou d'un setup asynchrone.

---

## Quand Vous Avez Besoin de Testabilité

Les singletons deviennent problématiques quand ils masquent les dépendances. La solution : les passer explicitement.

```typescript
// Dépendance cachée, difficile à tester
function getUser(id: string) {
  return database.query(`SELECT * FROM users WHERE id = ?`, [id]);
}

// Dépendance explicite, facile à tester
function getUser(db: Database, id: string) {
  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);
}

const mockDb = { query: vi.fn() };
getUser(mockDb, "123");
```

Ce n'est pas "singleton vs DI" : vous pouvez avoir les deux. Un singleton fournit l'instance, la DI la transmet là où elle est nécessaire. Angular utilise l'injection par constructeur. React utilise le contexte. Zustand et Pinia sont simplement importés. Le principe est le même.

---

## Quand l'Utiliser

Un logger global, une config en lecture seule chargée une fois au démarrage, un pool de connexions, ou un accès matériel où il n'y a littéralement qu'une seule ressource. Le pattern fonctionne bien quand l'instance est stateless ou en lecture seule.

---

## Quand NE PAS l'Utiliser

Si la ressource est peu coûteuse à créer ou si vous avez besoin de plusieurs instances pour les tests, passez votre chemin. En abuser mène à un état global caché difficile à raisonner.

:::info Singleton, un anti-pattern ?
L'argument "le singleton est un anti-pattern" vient de la POO, où l'implémentation classique cause de vrais problèmes :

1. **Le constructeur privé** empêche l'héritage et les tests
2. **Le static getInstance()** crée une dépendance globale cachée
3. **L'état mutable exposé via une méthode statique** sans contrôle d'accès
4. **Le couplage fort** à la classe concrète, pas à une interface

En TypeScript fonctionnel, rien de tout ça ne s'applique. Pas de classe, pas de constructeur privé, pas de méthode statique. `once` est simplement une fonction qui met en cache son résultat. L'instance peut être passée via DI pour la testabilité. Les modules ES garantissent déjà une évaluation unique. Les problèmes qui ont fait du Singleton un anti-pattern en Java ou C# n'existent tout simplement pas ici.

Les modules ES, les services Angular, les providers NestJS, les contextes React, le provide/inject de Vue, Redux, Zustand, Pinia : ils reposent tous sur la sémantique du singleton. Le pattern n'est pas mauvais. C'est l'implémentation POO qui l'était.
:::

---

## API

- [once](/api/arkhe/function/once) Initialisation paresseuse, retourne la même valeur aux appels suivants
