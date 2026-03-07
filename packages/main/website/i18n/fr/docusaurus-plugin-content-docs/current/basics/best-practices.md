---
sidebar_label: "Bonnes pratiques"
sidebar_position: 4.5
title: "Bonnes pratiques"
description: "Découvrez les bonnes pratiques pour utiliser Pithos : validez les données aux frontières avec Kanon et faites confiance à TypeScript pour votre logique métier."
slug: best-practices
keyword_stuffing_ignore:
  - types
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

# ✅ Bonnes pratiques

Ces pratiques ne sont pas des conventions de style : elles découlent directement du fonctionnement de Pithos. Les respecter, c'est s'assurer que la bibliothèque fonctionne comme prévu.

:::warning[Le contrat Pithos]
Pithos délègue entièrement la vérification des types à TypeScript et ne la duplique pas au runtime.  
C'est pourquoi **valider aux frontières et faire confiance aux types** n'est pas une simple recommandation, c'est une condition pour que tout fonctionne comme prévu.  
Ce principe s'inspire directement de l'approche [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/).
:::

---

## ✍️ Le contrat

### ❌ Validation éparpillée (shotgun parsing)

Sans contrat clair, les vérifications de types se multiplient à chaque étape. Chaque fonction doute de ses entrées, le code se remplit de checks défensifs, et les erreurs peuvent surgir n'importe où.

<ResponsiveMermaid
  desktop={`flowchart LR
    API[API] --> C1{typeof ?}
    C1 --> |ok| T[Traitement]
    C1 --> |ko| E1[❌]
    T --> C2{null ?}
    C2 --> |ok| L[Logique]
    C2 --> |ko| E2[❌]
    L --> C3{valid ?}
    C3 --> |ok| DB[DB]
    C3 --> |ko| E3[❌]

    style C1 fill:#e74c3c,color:#fff
    style C2 fill:#e74c3c,color:#fff
    style C3 fill:#e74c3c,color:#fff
    style E1 fill:#e74c3c,color:#fff
    style E2 fill:#e74c3c,color:#fff
    style E3 fill:#e74c3c,color:#fff
`}
/>

<span style={{color: '#e74c3c'}}>■</span> Erreurs et tests défensifs

### ✅ Parse, don't validate

Avec le contrat Pithos, on valide une seule fois à la frontière. Tout le code en aval fait confiance aux types. Un seul point de contrôle, zéro doute ensuite.

<ResponsiveMermaid
  desktop={`flowchart LR
    API[API] --> K{Kanon parse}
    K --> |❌| E[Erreur claire]
    K --> |✅| TY[Données typées]
    TY --> T[Traitement]
    TY --> L[Logique]
    TY --> DB[DB]

    style K fill:#f39c12,color:#fff
    style TY fill:#2ecc71,color:#fff
    style T fill:#2ecc71,color:#fff
    style L fill:#2ecc71,color:#fff
    style DB fill:#2ecc71,color:#fff
    style E fill:#e74c3c,color:#fff
`}
/>

1. <span style={{color: '#f39c12', fontWeight: 'bold'}}>Frontières</span> = là où les données entrent dans votre système (API, entrées utilisateur, fichiers, localStorage)
2. <span style={{color: '#f39c12', fontWeight: 'bold'}}>Validez une fois</span> à la frontière avec Kanon
3. <span style={{color: '#2ecc71', fontWeight: 'bold'}}>Faites confiance aux types</span> partout ailleurs : pas de vérifications runtime nécessaires

C'est pourquoi les fonctions Pithos ne vérifient pas défensivement les types au runtime. TypeScript a déjà fait ce travail.

:::info[Qu'est-ce qu'une frontière ?]

**C'est une frontière :**
- Réponse d'une API (`fetch`, `axios`, GraphQL...)
- Entrées utilisateur (formulaires, query params, URL)
- Données de stockage (`localStorage`, `sessionStorage`, cookies)
- Lecture de fichiers (JSON, CSV, YAML...)
- Variables d'environnement
- Messages WebSocket / SSE
- Données d'un SDK tiers ou d'une lib externe non typée
- `JSON.parse()` (toujours `unknown`)

**Ce n'est PAS une frontière :**
- Un appel entre deux fonctions internes de votre app
- Des données déjà validées par Kanon en amont
- Le retour d'une fonction que vous avez vous-même typée
- Un state React/Vue/Angular déjà typé
:::

---

## Comment respecter le contrat

### ❌ À ne pas faire

#### Cast de types (`as any`, `as unknown`)

Dès que vous castez, vous brisez la chaîne de confiance.

```typescript
// ❌ Mauvais : Vous venez de dire à TypeScript de se taire
const data = JSON.parse(response) as User;
processUser(data); // TypeScript vous fait confiance... mais devrait-il ?

// ❌ Aussi mauvais : "Je validerai plus tard" (vous ne le ferez pas)
const config = loadConfig() as unknown as AppConfig;
```

> **Le risque** : Les fonctions Pithos supposent des types valides. Si vous passez des données invalides déguisées en `User`, vous obtiendrez des résultats invalides, ou pire, une erreur runtime cryptique trois couches plus loin.

:::info[Besoin de vérifier un type ?]
`as unknown` est souvent utilisé avant une vérification manuelle de type. Pour les cas simples, Arkhe fournit des [guards et predicates](/api/arkhe/#guards) prêts à l'emploi (`isString`, `isNumber`, `isPlainObject`...) qui permettent de valider aux frontières sans schéma Kanon complet, tout en gardant le narrowing TypeScript intact.
:::

<DashedSeparator noMarginBottom />

#### Ignorer les Results

Le `Result` de Zygos existe pour vous forcer à gérer les erreurs. Les ignorer annule tout l'intérêt.

```typescript
// ❌ Mauvais : Échec silencieux
const result = await fetchUser(id);
if (result.isErr()) return; // L'erreur disparaît dans le néant

// ❌ Aussi mauvais : Prétendre que c'est toujours Ok
const user = result.value; // Erreur TypeScript, mais vous pourriez @ts-ignore
```

> **Le problème** : Les erreurs non gérées deviennent des bugs qui apparaissent en production, loin de leur source.

<DashedSeparator noMarginBottom />

#### `@ts-ignore` / `@ts-expect-error`

Ce sont des trappes de secours, pas des solutions.

```typescript
// ❌ Mauvais : Cacher le problème
// @ts-ignore
processUser(maybeUser);
```

Si TypeScript se plaint, il y a généralement une raison. Corrigez le type, car passer le compilateur sous silence est rarement la meilleure chose à faire.

<DashedSeparator noMarginBottom />

#### Annotations de types manuelles sur les valeurs inférées

L'inférence de TypeScript est excellente. La combattre crée une charge de maintenance.

```typescript
// ❌ Inutile : TypeScript sait déjà
const users: User[] = getUsers();
const count: number = users.length;

// ❌ Pire : Maintenant vous devez maintenir ça
const result: Result<User, ApiError> = fetchUser(id);
```

---

### ✅ À faire

#### Valider aux frontières

Utilisez Kanon pour valider les données externes exactement une fois, au point d'entrée. Une fois que les données passent la validation, chaque fonction en aval peut faire confiance aux types sans vérifications runtime supplémentaires. Cela garde votre codebase propre et votre bundle petit :

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,parse:/api/kanon/core/parse"
import { object, string, number, parse } from "@pithos/core/kanon";

const UserSchema = object({
  id: string(),
  name: string(),
  age: number(),
});

// ✅ Bien : Valider à la frontière
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  const result = parse(UserSchema, data);
  if (!result.success) {
    return err(result.error);
  }
  
  return ok(result.data); // Maintenant c'est un vrai User
}

// ✅ Le code en aval fait confiance au type
function processUser(user: User) {
  // Pas besoin de vérifier si user.name existe : Kanon a déjà validé
  return user.name.toUpperCase();
}
```

<DashedSeparator noMarginBottom />

#### Gérer les Results explicitement

Chaque `Result` devrait être géré. Utilisez `match`, `map` ou des vérifications explicites. Le compilateur vous aide ici : si vous oubliez de gérer un cas, TypeScript le signalera. Cela rend la gestion des erreurs visible et intentionnelle plutôt qu'accidentelle :

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ok, err, Result } from "@pithos/core/zygos/result/result";

// ✅ Bien : Gestion explicite avec match
const message = result.match({
  ok: (user) => `Bienvenue, ${user.name} !`,
  err: (error) => `Erreur : ${error.message}`,
});

// ✅ Bien : Transformer le succès, propager les erreurs
const upperName = result.map((user) => user.name.toUpperCase());

// ✅ Bien : Retour anticipé avec intention claire
if (result.isErr()) {
  logger.error("Échec de la récupération de l'utilisateur", result.error);
  return showErrorPage(result.error);
}
const user = result.value; // TypeScript sait que c'est Ok ici
```

<DashedSeparator noMarginBottom />

#### Laisser l'inférence travailler

Faites confiance à TypeScript pour déterminer les types. Ajoutez des annotations uniquement quand c'est nécessaire. Les annotations de types redondantes créent une charge de maintenance et peuvent masquer de vraies erreurs de types quand le code sous-jacent change :

```typescript
// ✅ Bien : L'inférence gère ça
const users = getUsers();
const count = users.length;
const result = fetchUser(id);

// ✅ Bien : Annotation nécessaire pour les paramètres de fonction
function processUser(user: User) { ... }

// ✅ Bien : Annotation nécessaire pour les collections vides
const cache: Map<string, User> = new Map();
```

<DashedSeparator noMarginBottom />

#### Utiliser les types utilitaires d'Arkhe

Arkhe fournit des types utilitaires qui rendent vos intentions claires. Ces types communiquent la forme et les contraintes de vos données au niveau du type, pour que le contrat soit lisible sans lire l'implémentation :

```typescript
import type { Arrayable } from "@pithos/core/arkhe/types/common/arrayable";
import type { Nullish } from "@pithos/core/arkhe/types/common/nullish";
import type { DeepPartial } from "@pithos/core/arkhe/types/utilities/deep-partial";

// ✅ Intention claire : accepte un élément unique ou un tableau
function process(input: Arrayable<User>) {
  const users = Array.isArray(input) ? input : [input];
  // ...
}

// ✅ Intention claire : peut être null ou undefined
function findUser(id: string): Nullish<User> {
  return users.get(id) ?? null;
}

// ✅ Intention claire : partiel à n'importe quelle profondeur
function updateConfig(patch: DeepPartial<Config>) {
  // ...
}
```

---

## 🎁 Le bénéfice

Quand vous suivez le contrat :

- **Pas de vérifications de types runtime** : TypeScript a déjà validé au compile-time
- **Pas de code défensif** : Les fonctions font confiance à leurs entrées
- **Bundles plus petits** : Pas de code de validation runtime éparpillé partout
- **Exécution plus rapide** : Pas de vérifications inutiles sur les chemins critiques
- **Sources d'erreurs claires** : Les erreurs de validation arrivent aux frontières, pas au fond de la logique métier

---

## 🕯️ En savoir plus

- [Philosophie fondamentale](/guide/basics/core-philosophy) : Le « pourquoi » derrière ces pratiques
- [API Kanon](/api/kanon) : Validation de schémas aux frontières
- [API Zygos](/api/zygos) : Pattern Result pour la gestion des erreurs
- [Types Arkhe](/api/arkhe) : Types utilitaires pour un code plus propre
