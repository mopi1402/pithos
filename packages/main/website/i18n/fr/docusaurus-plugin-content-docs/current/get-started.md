---
sidebar_label: "Démarrage"
sidebar_position: 1
title: "Démarrage"
description: "Démarrez avec Pithos, la bibliothèque utilitaire TypeScript sans dépendance, en seulement 5 minutes."
---

import { Highlight } from "@site/src/components/shared/Highlight";
import { FeatureSection } from "@site/src/components/shared/FeatureSection";
import { Picture } from "@site/src/components/shared/Picture";
import { InstallTabs } from "@site/src/components/shared/InstallTabs";

# 🚪 Démarrage

**Tout ce que vous devez savoir sur Pithos en 5 minutes.**

Pithos est une bibliothèque utilitaire TypeScript sans aucune dépendance, conçue pour le développement web moderne. Un seul package vous offre la manipulation de données, la validation de schémas et la gestion fonctionnelle des erreurs : le tout tree-shakable et entièrement typé.

## 🖥️ Installation

<InstallTabs />

C'est tout. Zéro dépendance signifie zéro prise de tête.

---

## 🎰 Qu'y a-t-il dans la boîte ?

Pithos est un écosystème utilitaire complet composé de six modules :

| !Module     | Ce qu'il fait                                           |
| ----------- | ------------------------------------------------------- |
| **Arkhe**   | Manipulation de données (tableaux, objets, chaînes, fonctions, ...) |
| **Eidos**   | Design patterns fonctionnels (adapter, proxy, observer, strategy, ...) |
| **Kanon**   | Validation de schémas avec support JIT                  |
| **Zygos**   | Gestion fonctionnelle des erreurs ([Result](/api/zygos/result), [Option](/api/zygos/option), [Either](/api/zygos/either), [Task](/api/zygos/task)) |
| **Sphalma** | Erreurs typées & codes d'erreur intégrés      |
| **Taphos**  | Guide de migration et utilitaires dépréciés avec assistance IDE|

---

## 📎 Comment importer

Pithos utilise des imports granulaires pour un tree-shaking optimal. Importez chaque fonction directement depuis son chemin de module, et votre bundler n'inclura que le code que vous utilisez réellement :

```typescript links="chunk:/api/arkhe/array/chunk,object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
// Utilitaires de tableaux
import { chunk } from "@pithos/core/arkhe/array/chunk";

// Validation
import { object, string, number, optional } from "@pithos/core/kanon";

// Pattern Result
import { ok, err } from "@pithos/core/zygos/result/result";
```

---

## 🃏 Quelques exemples

### Manipulation de données

Les utilitaires Arkhe suivent un pattern cohérent : ils prennent les données en premier argument (data-first) et retournent une nouvelle valeur sans muter l'original (immutable).

Cela les rend sûrs à utiliser dans n'importe quel contexte, par exemple les mises à jour d'état d'un framework frontend ou le traitement côté serveur :

```typescript links="chunk:/api/arkhe/array/chunk,get:/api/arkhe/object/get"
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { get } from "@pithos/core/arkhe/object/get";

// Découper un tableau en morceaux
chunk([1, 2, 3, 4, 5], 2);
// → [[1, 2], [3, 4], [5]]

// Accès imbriqué sécurisé
const user = { profile: { address: { city: "Paris" } } };
get(user, "profile.address.city", "Unknown");
// → "Paris"
```

### Validation

Les schémas Kanon se composent ensemble pour décrire des structures de données complexes. La fonction [`parse`](/api/kanon/core/parse) retourne une union discriminée, donc TypeScript affine automatiquement le type dans chaque branche.
Vous utilisez déjà Zod ? Le wrapper [`asZod`](/api/kanon/helpers/asZod) fournit une API compatible, pour migrer progressivement tout en profitant du tree-shaking de Kanon :

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,parse:/api/kanon/core/parse,asZod:/api/kanon/helpers/asZod"
import { object, string, number, optional, parse } from "@pithos/core/kanon";
import { asZod } from "@pithos/core/kanon/helpers/as-zod";

const userSchema = object({
  name: string(),
  email: string().email(),
  age: optional(number()),
});

// API Kanon
const result = parse(userSchema, data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// API style Zod
const zSchema = asZod(userSchema);
const zodResult = zSchema.safeParse(data);
if (zodResult.success) {
  console.log(zodResult.data);
} else {
  console.error(zodResult.error.issues);
}
```

### Gestion des erreurs

[`ResultAsync`](/api/zygos/result/ResultAsync) encapsule les opérations basées sur les `Promises` dans le pattern [`Result`](/api/zygos/result).

Au lieu de `try/catch`, vous obtenez une valeur typée qui vous oblige à gérer les deux chemins : succès et échec :

```typescript links="ResultAsync:/api/zygos/result/ResultAsync"
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const safeFetch = ResultAsync.fromThrowable(
  fetch,
  (error) => `Erreur réseau : ${error}`
);

const result = await safeFetch("/api/users/1");

if (result.isOk()) {
  console.log(result.value);
} else {
  console.error(result.error); // Pas besoin de try/catch
}
```

---

## Pourquoi les développeurs l'adorent

<FeatureSection
  image={
    <Picture
      src="/img/generated/quick-start/why-developers-love-it"
      alt="Utilitaires TypeScript sans dépendance, tree-shakable et type-safe"
      displaySize={200}
      sourceWidth={400}
    />
  }
  imagePosition="left"
>

<Highlight>[Inférence TypeScript complète.](/guide/contribution/design-principles/typescript-first)</Highlight> Typez une fois, inférez partout. Pas de génériques manuels, pas de fuites `any`.

<Highlight>[Zéro dépendance.](/guide/basics/installation)</Highlight> Sécurité totale de la chaîne d'approvisionnement. Ce que vous installez est ce que vous obtenez.

<Highlight>[Tree-shakable par conception.](/guide/basics/installation)</Highlight> N'importez que ce que vous utilisez. Votre bundle reste léger.

<Highlight>[JavaScript moderne.](/guide/contribution/design-principles/design-philosophy)</Highlight> ES2020+, sans héritage obsolète.

</FeatureSection>

## Ce que vos utilisateurs y gagnent

<FeatureSection
  image={
    <Picture
      src="/img/generated/quick-start/why-your-users-benefit"
      alt="Avantages de performance : exécution plus rapide, bundles plus petits, fiabilité éprouvée"
      displaySize={200}
      sourceWidth={400}
    />
  }
  imagePosition="right"
>

<Highlight>[~7× plus rapide en moyenne.](/comparisons/overview)</Highlight> Votre application est plus réactive. Les utilisateurs attendent moins, les interactions sont plus fluides.

<Highlight>[~9× plus petit en moyenne.](/comparisons/overview)</Highlight> Les pages chargent vite, même sur des connexions lentes ou des appareils bas de gamme.

<Highlight>[Fiabilité éprouvée.](/guide/basics/testing-strategy)</Highlight> Ça fonctionne, tout simplement. Pas de crashs surprise ni de bugs de cas limites.

<Highlight>[Pas d'erreurs silencieuses.](/guide/contribution/design-principles/error-handling)</Highlight> Les bugs sont détectés avant le déploiement, vos utilisateurs ne rencontrent jamais de comportements inexplicables.

</FeatureSection>

---

## 🕯️ Et ensuite ?

:::info Vous cherchez des cas d'usage ?
Explorez des exemples pratiques et trouvez le bon utilitaire pour vos besoins dans l'[Explorateur de cas d'usage](/use-cases).
:::

- [À propos de Pithos](/guide/basics/about-pithos) - L'histoire et la philosophie derrière le projet
- [Guide d'installation](/guide/basics/installation) - Configuration avancée et paramétrage
- [Exemple pratique](/guide/basics/practical-example) - Construisez quelque chose de concret avec Pithos
