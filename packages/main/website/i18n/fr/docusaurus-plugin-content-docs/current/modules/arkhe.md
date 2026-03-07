---
sidebar_position: 1
sidebar_label: "Arkhe"
title: "Arkhe - Alternative moderne à Lodash sans dépendance"
description: "Utilitaires TypeScript modernes pour tableaux, objets, chaînes et fonctions. Tree-shakable, type-safe et sans dépendance. Une alternative légère à Lodash."
keywords:
  - alternative lodash
  - utilitaires typescript
  - tree-shakable
  - sans dépendance
  - utilitaires tableau
  - utilitaires objet
image: /img/social/arkhe-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Arkhe"
  description="Utilitaires TypeScript modernes pour tableaux, objets, chaînes et fonctions. Alternative tree-shakable à Lodash sans dépendance."
  url="https://pithos.dev/guide/modules/arkhe"
/>

# 🅰 <ModuleName name="Arkhe" />

_ἀρχή - « origine »_

Alternative moderne et légère à lodash. Manipulation de données, type guards et utilitaires de fonctions avec un design [TypeScript-first](/guide/contribution/design-principles/typescript-first) et un [tree-shaking optimal](/comparisons/arkhe/bundle-size/).

Arkhe fournit un ensemble soigné de fonctions utilitaires pour le développement TypeScript quotidien. Contrairement à Lodash, chaque fonction est écrite en [TypeScript](https://www.typescriptlang.org/) de A à Z, avec une inférence de types stricte et aucune vérification de types runtime. Les données en entrée sont validées et les erreurs remontent immédiatement ([_fail fast, fail loud_](/guide/contribution/design-principles/error-handling)).  

La bibliothèque est distribuée en [ES modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules) avec des imports granulaires, pour que les bundlers puissent éliminer automatiquement le code inutilisé.

---

## 🃏 Quelques exemples

Chaque import cible une seule fonction pour un tree-shaking optimal. Votre bundler n'inclut que le code que vous utilisez réellement, gardant votre [bundle de production minimal](/comparisons/arkhe/bundle-size/) :

```typescript links="chunk:/api/arkhe/array/chunk,groupBy:/api/arkhe/array/groupBy,get:/api/arkhe/object/get,debounce:/api/arkhe/function/debounce"
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { groupBy } from "@pithos/core/arkhe/array/group-by";
import { get } from "@pithos/core/arkhe/object/get";
import { debounce } from "@pithos/core/arkhe/function/debounce";

const users = [{ name: "Alice", role: "admin" }, { name: "Bob", role: "user" }];

chunk([1, 2, 3, 4, 5], 2);           // [[1, 2], [3, 4], [5]]
groupBy(users, (u) => u.role);       // { admin: [...], user: [...] }
get(users[0], "name", "Anonymous");  // "Alice"
debounce(handleSearch, 300);
```

- [`chunk`](/api/arkhe/array/chunk) découpe un tableau en groupes d'une taille donnée.  
- [`groupBy`](/api/arkhe/array/groupBy) catégorise les éléments par une fonction clé. 
- [`get`](/api/arkhe/object/get) accède en toute sécurité aux propriétés imbriquées avec une valeur par défaut.
- [`debounce`](/api/arkhe/function/debounce) limite la fréquence d'appel d'une fonction, utile pour les champs de recherche ou les handlers de resize

---

## ✅ Quand l'utiliser

Arkhe couvre les besoins les plus courants de manipulation de données dans les projets TypeScript. Que vous transformiez des collections, remodéliez des objets, formatiez des chaînes de caractères ou contrôliez l'exécution de fonctions, Arkhe fournit un utilitaire type-safe et immuable pour le travail :

- **Tableaux** : chunk, groupBy, partition, difference, intersection, orderBy...
- **Objets** : get, set, merge, pick, omit, evolve...
- **Chaînes de caractères** : camelCase, kebabCase, capitalize, template...
- **Fonctions** : debounce, throttle, memoize, pipe, curry...
- **Async** : retry, parallel, defer, sleep...
- **Types** : Nullable, Arrayable, PartialKeys, type guards...

---

## ❌ Quand NE PAS l'utiliser

Arkhe se concentre sur les utilitaires de données à usage général. Pour des besoins spécialisés, d'autres modules Pithos sont plus adaptés :

| Besoin | Utilisez plutôt |
|--------|-----------------|
| Validation de schémas | [Kanon](./kanon.md) |
| Gestion des erreurs (Result/Either) | [Zygos](./zygos.md) |

---

import { InstallTabs } from "@site/src/components/shared/InstallTabs";

## ⛵️ Migrer depuis Lodash

### Étape 1 : Installer Pithos

<InstallTabs />

### Étape 2 : Remplacer les imports progressivement

Pas besoin de tout migrer d'un coup. Remplacez une fonction à la fois :

```typescript links="chunk:/api/arkhe/array/chunk"
// Avant
import { chunk, groupBy } from "lodash-es";

// Après : remplacer une à la fois
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { groupBy } from "lodash-es"; // migrer plus tard
```

### Étape 3 : Consulter la table d'équivalence

Toutes les fonctions Lodash n'ont pas un équivalent Arkhe. Certaines ont des remplacements JavaScript natifs, et certaines sont intentionnellement exclues. Consultez la [table d'équivalence complète](/comparisons/equivalence-table/) pour une correspondance exhaustive.

### Étape 4 : Exécuter vos tests

Arkhe fournit des utilitaires similaires à Lodash mais le comportement peut différer sur certains cas limites :
- **null/undefined** : Arkhe throw sur une entrée invalide, Lodash retourne silencieusement `undefined` ou une valeur par défaut
- **Clonage profond** : les objets complexes (Date, Map, Set, RegExp...) peuvent être gérés différemment
- **Prototypes** : Arkhe ignore `__proto__`, seules les propriétés propres comptent

Pour les fonctions qui ont été remplacées par du JavaScript natif, [Taphos fournit des fonctions dépréciées avec des suggestions IDE](/guide/modules/taphos/) pour une migration en douceur vers leurs équivalents natifs.


---

<RelatedLinks title="Ressources associées">

- [Quand utiliser Arkhe](/comparisons/overview/) — Comparez Arkhe avec les alternatives et trouvez quand c'est le bon choix
- [Taille de bundle & performance d'Arkhe](/comparisons/arkhe/bundle-size/) — Comparaison détaillée de taille de bundle avec Lodash et es-toolkit
- [Référence API Arkhe](/api/arkhe) — Documentation API complète pour tous les utilitaires Arkhe

</RelatedLinks>
