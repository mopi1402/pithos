---
sidebar_label: "Exemple pratique"
sidebar_position: 4
title: "Exemple pratique"
description: "Construisez une fonctionnalité réelle combinant plusieurs modules Pithos pour la manipulation de données type-safe, la validation de schémas et la gestion des erreurs."
slug: practical-example
---

import { DashboardPlayground } from '@site/src/components/playground/DashboardPlayground';
import ModuleName from "@site/src/components/shared/badges/ModuleName";

# 🗜️ Exemple pratique

Construisons quelque chose de concret : 
**charger un tableau de bord utilisateur** depuis une API, valider les données, les transformer et gérer les erreurs proprement.

Cet exemple combine :

- <ModuleName name="Zygos" to="/api/zygos/result/ResultAsync">Opérations asynchrones sûres avec `ResultAsync`</ModuleName>
- <ModuleName name="Kanon" to="/guide/modules/kanon/">Validation de schémas</ModuleName>
- <ModuleName name="Arkhe" to="/guide/modules/arkhe/">Utilitaires de transformation de données</ModuleName>

---

## Le scénario

Vous devez charger les données du tableau de bord d'un utilisateur depuis une API. La réponse peut être malformée, le réseau peut échouer, et vous devez transformer les données brutes avant de les afficher.

**Approche traditionnelle :** try/catch imbriqués, validation manuelle, croiser les doigts.

**Approche Pithos :** composable, type-safe, élégante.

### Étape 1 : Définir vos schémas

D'abord, définissez à quoi ressemblent des données valides avec Kanon :

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,boolean:/api/kanon/schemas/primitives/boolean,array:/api/kanon/schemas/composites/array,optional:/api/kanon/schemas/wrappers/optional,parse:/api/kanon/core/parse"
// src/lib/schemas.ts
import {
  object,
  string,
  number,
  boolean,
  array,
  optional,
  parse,
} from "@pithos/core/kanon";

// Définir la structure attendue de la réponse API
const UserSchema = object({
  id: string(),
  firstName: string(),
  lastName: string(),
  email: string().email(),
  role: string(),
  createdAt: string(),
  preferences: optional(
    object({
      theme: optional(string()),
      language: optional(string()),
      notifications: optional(boolean()),
    })
  ),
});

const PostSchema = object({
  id: string(),
  title: string(),
  content: string(),
  publishedAt: optional(string()),
  status: string(),
});

const DashboardSchema = object({
  user: UserSchema,
  posts: array(PostSchema),
  stats: object({
    totalViews: number(),
    totalLikes: number(),
    totalComments: number(),
  }),
});
```

:::tip Utiliser le style de l'API Zod

Si vous venez de Zod, le shim compatible Zod offre une syntaxe familière avec moins d'imports, au prix de bundles légèrement plus gros :

```typescript
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  // ... même API Zod
});
```

:::

### Étape 2 : Créer des helpers API sûrs

Encapsulez les appels fetch avec Zygos pour une gestion d'erreurs sûre :

```typescript links="ResultAsync:/api/zygos/result/ResultAsync,errAsync:/api/zygos/result/errAsync,okAsync:/api/zygos/result/okAsync"
// src/lib/api.ts
import {
  ResultAsync,
  errAsync,
  okAsync,
} from "@pithos/core/zygos/result/result-async";

// Créer un wrapper fetch sûr
const safeFetch = ResultAsync.fromThrowable(
  fetch,
  (error) => `Erreur réseau : ${error}`
);

// Créer un parser JSON sûr
const safeJson = <T>(response: Response) =>
  ResultAsync.fromThrowable(
    async () => (await response.json()) as T,
    (error) => `Erreur de parsing JSON : ${error}`
  )();
```


### Étape 3 : Ajouter la transformation de données

Utilisez les utilitaires Arkhe pour transformer les données validées :

```typescript links="groupBy:/api/arkhe/array/groupBy,capitalize:/api/arkhe/string/capitalize"
// src/lib/transformers.ts
import { groupBy } from "@pithos/core/arkhe/array/group-by";
import { capitalize } from "@pithos/core/arkhe/string/capitalize";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

type Post = {
  id: string;
  title: string;
  content: string;
  publishedAt?: string;
  status: string;
};

// Transformer les données utilisateur pour l'affichage
function formatUser(user: User) {
  return {
    id: user.id,
    fullName: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
    email: user.email,
    role: capitalize(user.role),
    preferences: user.preferences ?? {
      theme: "light",
      language: "en",
      notifications: true,
    },
  };
}

// Transformer les articles pour le tableau de bord
function formatPosts(posts: Post[]) {
  const grouped = groupBy(posts, (post) => post.status);

  return {
    published: grouped["published"] ?? [],
    draft: grouped["draft"] ?? [],
    total: posts.length,
  };
}
```

### Étape 4 : Tout composer ensemble

Combinez maintenant toutes les pièces en un seul pipeline composable :

```typescript
// src/lib/api.ts (suite)
type DashboardData = {
  user: ReturnType<typeof formatUser>;
  posts: ReturnType<typeof formatPosts>;
  stats: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
};

function loadDashboard(userId: string): ResultAsync<DashboardData, string> {
  return safeFetch(`/api/dashboard/${userId}`)
    .andThen((response) => {
      if (!response.ok) {
        return errAsync(`Erreur HTTP : ${response.status}`);
      }
      return okAsync(response);
    })
    .andThen((response) => safeJson<unknown>(response))
    .andThen((data) => {
      const result = parse(DashboardSchema, data);

      if (!result.success) {
        return errAsync(`Données invalides : ${result.error}`);
      }

      return okAsync(result.data);
    })
    .map((data) => ({
      user: formatUser(data.user),
      posts: formatPosts(data.posts),
      stats: data.stats,
    }));
}
```

### Étape 5 : L'utiliser dans votre app

Avec le pipeline en place, il ne reste qu'à consommer le résultat : on vérifie succès ou erreur, puis on affiche.

```typescript
// src/components/Dashboard.tsx
async function initDashboard() {
  const result = await loadDashboard("user-123");

  if (result.isErr()) {
    // Gérer l'erreur - afficher un message, réessayer, fallback...
    showError(result.error);
    return;
  }

  // TypeScript sait que result.value est DashboardData
  const { user, posts, stats } = result.value;

  renderHeader(user.fullName, user.role);
  renderPostsList(posts.published);
  renderDraftsBadge(posts.draft.length);
  renderStats(stats);
}
```

---

## Démo interactive

<DashboardPlayground />

:::info
La démo ci-dessus est plus complète que les extraits de code : elle est intégrée dans un projet React et inclut l'interface utilisateur.

Le code source complet est disponible sur [GitHub](https://github.com/mopi1402/pithos/tree/main/packages/pithos/examples/practical-example).
:::

--- 

## Ce que vous venez de construire

Avec un minimum de code, vous avez :

✅ **Appels API type-safe** - `response.json()` ne renvoie plus de `any`

✅ **Données validées** - Kanon s'assure que la réponse API correspond à votre schéma

✅ **Gestion d'erreurs élégante** - Chaque erreur est capturée et typée

✅ **Transformations propres** - les utilitaires Arkhe simplifient la mise en forme

✅ **Pipeline composable** - Facile d'ajouter du cache, des retries ou du logging

---

## Comparer au code traditionnel

Sans Pithos, cela impliquerait typiquement :

```typescript
// ❌ L'approche traditionnelle
async function loadDashboard(userId: string) {
  try {
    const response = await fetch(`/api/dashboard/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json(); // any 😱

    // Validation manuelle...
    if (!data.user || !data.posts) {
      throw new Error("Données invalides");
    }

    // Transformation manuelle...
    return {
      user: {
        fullName: data.user.firstName + " " + data.user.lastName,
        // ... plus de travail manuel
      },
      // ... plus de travail manuel
    };
  } catch (error) {
    console.error(error); // Et maintenant ?
    return null; // L'appelant doit vérifier null partout
  }
}
```

--- 

## Prochaines étapes

Maintenant que vous avez vu comment les modules fonctionnent ensemble :

- Explorez les [utilitaires Arkhe](/api/arkhe) pour plus de manipulation de données
- Apprenez les [schémas Kanon](/api/kanon) pour la validation complexe
- Maîtrisez les [patterns Zygos](/api/zygos) pour la gestion avancée des erreurs
- Parcourez les [cas d'usage](/use-cases) pour des problèmes spécifiques que vous résolvez
