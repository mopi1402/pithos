---
sidebar_label: "Pithos vs Effect"
sidebar_position: 5
title: "Pithos vs Effect : Écosystème modulaire vs Runtime FP complet"
description: "Pithos vs Effect : alternative légère pour TypeScript. Quand choisir un écosystème modulaire vs un système d'effets complet."
keywords:
  - pithos vs effect
  - alternative effect-ts
  - alternative effect typescript légère
  - pithos effect différence
  - choisir effect ou pithos
  - bibliothèque utilitaire typescript
  - système d'effets typescript
  - bibliothèque typescript légère
  - programmation fonctionnelle typescript
---

import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import KanonVsEffectTable from '@site/src/components/comparisons/kanon/KanonVsEffectTable';

<ArticleSchema
  headline="Pithos vs Effect : Écosystème modulaire vs Runtime FP complet"
  description="Pithos vs Effect : alternative légère pour TypeScript. Quand choisir un écosystème modulaire vs un système d'effets complet."
  datePublished="2026-03-13"
/>

# Pithos vs Effect : des domaines bien distincts

La plupart des projets TypeScript n'ont pas besoin d'un runtime d'effets complet. Si vous cherchez une alternative légère, Pithos pourrait être ce qu'il vous faut. Qu'en-est-t-il de votre projet ?

Pithos et Effect résolvent des problèmes à des échelles différentes : Pithos fournit des utilitaires légers et modulaires pour les cas d'usage courants (80% des projets), tandis qu'Effect est un framework complet pour orchestrer des systèmes complexes (les 20% restants). Si vous vous demandez lequel choisir, Pithos devrait vous suffire dans la plupart des cas !

<a href="https://effect.website" rel="nofollow">Effect</a> est un framework de programmation fonctionnelle complet pour TypeScript, souvent comparé à <a href="https://zio.dev" rel="nofollow">ZIO</a> dans l'écosystème JS. Il fournit un runtime avec injection de dépendances, concurrence structurée, streams, et tout un écosystème de packages plateforme. C'est un engagement architectural puissant, mais qui vient avec une courbe d'apprentissage importante et un poids conceptuel non négligeable.

Pithos est un écosystème modulaire léger. Vous choisissez les modules dont vous avez besoin (utilitaires, validation, gestion d'erreurs) et vous ne livrez que ce que vous utilisez. Pas de runtime, pas de lock-in, pas de paradigme à apprendre. Des APIs familières, zéro configuration, productivité immédiate.

---

## Premier coup d'oeil

| Aspect | Pithos | Effect |
|--------|--------|--------|
| **Philosophie** | Écosystème modulaire | Runtime FP complet |
| **Impact bundle** | Imports par fonction | Imports par module (175+ namespaces) |
| **Courbe d'apprentissage** | Faible : APIs familières (style Lodash, Zod, Neverthrow) | Difficile : nouveau paradigme (effets, layers, fibers) |
| **Gestion d'erreurs** | Result, Either, Option, CodedError | Effect\<A, E, R\>, Cause, Defects |
| **Validation** | Kanon (style Zod, compilation JIT) | Schema (bidirectionnel, basé AST) |
| **Concurrence** | Helpers async légers (retry, parallel, guard) | Fibers, streams, queues, sémaphores, STM |
| **DI** | Aucune (hors périmètre) | Système Context + Layer |
| **Alternative Lodash** | Oui (Arkhe) | Non |
| **Migration vers natif** | Oui (Taphos) | Non |
| **Runtime requis** | Non | Oui |
| **Dépendances** | Zéro | `@standard-schema/spec`, `fast-check` |

---

## Objectifs communs (~25% d'Effect)

Les deux partagent certaines briques de base. Le recouvrement représente environ un quart de ce qu'Effect propose.

### Either & Option

Les deux fournissent des types union discriminés pour succès/échec et présence/absence. L'API de base est similaire. La différence est dans ce que chaque lib met autour : Effect ajoute l'égalité structurelle, le hashing, la syntaxe `gen()`, et l'interface `Pipeable`. Pithos reste sur des objets littéraux simples, sans chaîne de prototypes, sans surcharge conceptuelle.

<DashedSeparator noMarginBottom />

### pipe

Les deux implémentent un `pipe` typé avec surcharges. Effect fournit en plus `dual()` pour que chaque fonction supporte data-first et data-last.

:::info
Pithos utilise le style data-first : la donnée est toujours le premier argument. C'est la convention la plus naturelle en JavaScript, pas besoin de `pipe` pour que le code soit lisible.
:::

<DashedSeparator noMarginBottom />

### Utilitaires Array, String, Object

| Catégorie | Pithos | Effect |
|-----------|--------|--------|
| Array (chunk, zip, groupBy, partition...) | Large couverture (Arkhe) | Couverture essentielle |
| String (conversion de casse, template, truncate...) | Large couverture (Arkhe) | Couverture limitée |
| Object (pick, omit, mapValues, deepClone...) | Large couverture (Arkhe) | Couverture essentielle (Record) |
| Prédicats & guards | Large couverture | Couverture essentielle |

Pithos a une couverture plus large, plus proche de Lodash. Effect couvre l'essentiel mais ce n'est pas son terrain de jeu principal.

<DashedSeparator noMarginBottom />

### Validation

Les deux fournissent de la validation de schéma avec inférence TypeScript :
- Kanon a une ergonomie style Zod avec compilation JIT.
- Effect Schema a plus de fonctionnalités (transformations bidirectionnelles, introspection AST, génération arbitraire) mais avec plus de complexité, un poids bundle plus imposant, et des performances réduites.

Les deux permettent également de composer validation + error handling. Avec Pithos, `ensure()` combine Kanon et Zygos pour retourner un `Result<T, string>`. Avec Effect, `Schema.decode()` retourne directement un `Effect<A, ParseError, R>`. Même concept, approches différentes : Pithos reste sur des valeurs sans runtime, Effect intègre ça dans le type Effect avec tracking de dépendances.

:::info
Le trade-off est clair : Vous pourriez bien vous contenter de Kanon pour une meilleure DX et UX (taille bundle + performances), et vous orienter vers Effect Schema si vous avez besoin de fonctionnalités avancées.
:::

<DashedSeparator noMarginBottom />

### Performances de validation

Sur des scénarios réels, Kanon V3.0 est systématiquement **2x à 6x plus rapide** qu'Effect Schema. L'écart se creuse sur les schémas complexes avec objets imbriqués, tableaux et validation conditionnelle.

<KanonVsEffectTable />

C'est logique : Kanon compile les validateurs en fonctions optimisées, Effect Schema interprète un AST à l'exécution. Effect échange la vitesse brute contre des transformations bidirectionnelles et l'introspection. Si vous en avez besoin, c'est un bon trade-off. Si vous n'en avez pas besoin, c'est du poids mort.

Pour les résultats complets avec toutes les bibliothèques, voir les [benchmarks de performance Kanon](./kanon/performances.md).

---

## Ce qu'Effect fait et que Pithos ne cherche pas à faire

Ce n'est pas une lacune. C'est un périmètre différent.

Effect fournit un ensemble de capacités qui relèvent du framework, pas de l'écosystème utilitaire :

- **Effect\<A, E, R\>** : un type qui encode succès, erreur ET dépendances. Le compilateur suit les prérequis à travers la composition.
- **Layer & Context** : injection de dépendances typée avec composition de services.
- **Fiber & concurrence structurée** : threads légers avec annulation, supervision et gestion des ressources.
- **Stream & Channel** : traitement réactif avec backpressure.
- **STM** : mémoire transactionnelle logicielle pour l'état concurrent.
- **Schedule** : politiques déclaratives de retry et de répétition.
- **Observabilité** : metrics, tracing, logging intégrés.
- **Packages plateforme** : adaptateurs Node, Bun, navigateur avec système de fichiers typé, HTTP, etc.
- **Intégrations first-party** : SQL, RPC, CLI, AI.

Si votre projet a besoin de tout ça, Effect est un choix solide. Pithos ne joue pas sur ce terrain, et c'est intentionnel.

---

## Ce que Pithos fait et qu'Effect ne couvre pas

- **Alternative à Lodash** : Arkhe fournit des utilitaires plus légers et plus performants que lodash. Effect ne joue pas sur ce terrain.
- **Migration vers natif** : Taphos fournit un chemin de migration progressive depuis Lodash jusqu'au natif.
- **Taille du bundle** : Chaque fonction Pithos est importable indépendamment. Vous ne payez que ce que vous utilisez, littéralement.
- **Compatibilité Neverthrow** : Zygos Result est un drop-in 100% compatible avec l'API de Neverthrow. Pas d'équivalent côté Effect.
- **Validation compilée JIT** : Kanon compile les validateurs à l'exécution pour un débit maximal. Effect Schema interprète un AST.
- **Zéro runtime** : Pithos, ce sont des fonctions. Pas de runtime à démarrer, pas de framework à apprendre, pas de mental model à acquérir avant d'être productif.

---

## Quand choisir quoi

**Règle simple** : si vous vous posez la question, commencez par Pithos. Vous saurez très vite si vous avez besoin d'Effect (et ce sera évident - injection de dépendances complexe, concurrence structurée, orchestration de services distribués). Pour tout le reste, Pithos suffit largement.

### Choisissez Pithos si :

- Vous voulez remplacer Lodash, Zod ou Neverthrow par des alternatives plus légères et plus rapides
- La taille du bundle compte (apps web, dashboards, edge functions)
- Vous voulez des APIs familières avec une courbe d'apprentissage quasi nulle
- Vous avez besoin d'utilitaires, de validation ou de gestion d'erreurs, pas d'un système d'effets
- Vous construisez une application ou une bibliothèque et vous n'avez pas envie d'un framework pour vos utils

### Choisissez Effect si :

- Vous construisez des services backend complexes avec beaucoup de dépendances à orchestrer
- Vous avez besoin de concurrence structurée (fibers, annulation, gestion des ressources)
- Vous voulez de l'injection de dépendances typée au niveau framework
- Vous êtes prêt à investir dans un nouveau paradigme, et votre équipe aussi
- Vous avez besoin de l'écosystème complet (SQL, RPC, OpenTelemetry, etc.)

### Les deux :

Pithos n'a pas de runtime et pas d'état global. Rien n'empêche d'utiliser Arkhe pour vos utilitaires et Kanon pour la validation des entrées API, tout en laissant Effect gérer l'orchestration de services. Ils se composent sans friction.

---

<RelatedLinks title="Pour aller plus loin">

- [Benchmarks de performance Kanon](./kanon/performances.md) : résultats complets avec toutes les bibliothèques
- [Zygos vs Neverthrow](./zygos/zygos-vs-neverthrow.md) : comparaison du remplacement drop-in Result
- [Kanon vs Zod](./kanon/kanon-vs-zod.md) : comparaison des bibliothèques de validation
- [Arkhe vs Lodash](./arkhe/arkhe-vs-lodash.md) : comparaison des bibliothèques utilitaires
- [Vue d'ensemble des comparaisons](./overview.md) : quand utiliser chaque module Pithos
- [Table d'équivalence](./equivalence-table.md) : équivalences complètes entre tous les modules

</RelatedLinks>
