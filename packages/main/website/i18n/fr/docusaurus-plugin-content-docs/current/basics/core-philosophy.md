---
sidebar_position: 2
title: Philosophie fondamentale
description: "Découvrez la philosophie fondamentale de Pithos : les principes directeurs et les décisions architecturales qui façonnent chaque module de cette bibliothèque utilitaire TypeScript."
slug: core-philosophy
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import MarbleQuote from "@site/src/components/shared/MarbleQuote";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';

# 👁️ Philosophie fondamentale

> **La vision qui guide chaque décision architecturale dans Pithos**

---

## Principe cardinal

<MarbleQuote>Le besoin me guide. La technologie suit.</MarbleQuote>

Tout découle de ce principe. Nous ne choisissons pas une technologie parce qu'elle est tendance, élégante ou impressionnante. Nous la choisissons parce qu'elle répond au besoin.

Et le besoin ultime, c'est **l'utilisateur final**.

Le développeur est **l'artisan**. L'utilisateur est **la raison d'être**. Cette vérité simple guide tous nos choix techniques.

---

## Hiérarchie des priorités

### 1. Expérience utilisateur (UX) - Priorité absolue

L'expérience utilisateur est **toujours** le critère n°1 :

- **Performance** : temps de chargement, réactivité, fluidité
- **Taille du bundle** : moins de Ko = plus de vitesse
- **Time to Interactive** : les utilisateurs doivent pouvoir agir rapidement


> _L'utilisateur final ne devrait jamais se soucier de ce qui se passe sous le capot. Il veut juste que ça marche, vite et bien._

### 2. Expérience développeur (DX) - Priorité secondaire

Maximiser l'expérience utilisateur ne signifie pas pour autant de sacrifier celle du développeur. Au contraire, Pithos essaie de fournir le meilleur des deux mondes :

- API intuitive et cohérente  
- Documentation claire  
- Messages d'erreur explicites  
- Typage TypeScript de qualité 

> _La meilleure API, c'est celle qu'on comprend au premier coup d'œil._

<DashedSeparator noMarginBottom />

#### Distinction cruciale : DX gratuite vs DX payante

| Type de DX                                                    | Coût runtime | Décision              |
| ------------------------------------------------------------- | ------------ | --------------------- |
| **DX gratuite** : types, nommage, design d'API, documentation | 0            | ✅ Toujours bienvenue |
| **DX payante** : abstractions runtime, magie, wrappers        | > 0          | ⚠️ Opt-in uniquement       |

### 3. Pragmatisme - L'art du compromis intelligent

Un certain niveau de pragmatisme guide nos choix :

| !Contexte                                      | Approche                                       |
| ---------------------------------------------- | ---------------------------------------------- |
| **Impact sur le bundle ou les types**           | Prioriser la simplicité, sans compromis        |
| **Là où V8 optimise bien**                      | Compromis intelligent pour améliorer la DX     |
| **Coût négligeable (runtime, bundle, types)**   | Améliorer la DX sans hésiter                   |

En règle générale, lorsqu'un choix n'est pas trop éloigné de notre philosophie, nous préférons laisser le développeur décider. Il aura le libre arbitre sur l'impact sur les performances ou la taille du bundle final.

**Exemple concret : auto-curry**

```typescript
// Auto-curry "magique" (style Remeda)
map(array, fn); // Détecte 2 args → data-first
map(fn); // Détecte 1 arg → retourne une fonction curryfiée
// ⚠️ Coût : détection runtime à chaque appel, wrappers, logique supplémentaire

// Approche Pithos : data-first par défaut
map(array, fn); // Standard, toujours data-first
// Pour la composition, utilisez pipe() avec des appels data-first explicites
pipe(array, arr => map(arr, fn));
// ✅ Coût : 0, pas de détection runtime, parfaitement clair
```

L'auto-curry et sa détection magique du nombre d'arguments à chaque appel sont trop éloignés de la philosophie de Pithos pour en faire le comportement par défaut. Le coût CPU est négligeable, mais les wrappers alourdissent le bundle et complexifient les types.

Le curry classique, en revanche, reste un outil précieux pour la composition fonctionnelle. C'est pourquoi Pithos propose [`curry()`](/api/arkhe/function/curry/) : un compromis opt-in à coût zéro. La fonction curryfiée est créée une seule fois, sans détection runtime.

:::note
Le curry implique naturellement un style data-last, à l'inverse du [data-first qui est la convention Pithos](/guide/contribution/design-principles/data-first-paradigm/). C'est un choix conscient que vous faites quand vous optez pour la composition fonctionnelle.
:::

---

## TypeScript : le meilleur des deux mondes

[TypeScript](https://www.typescriptlang.org/) est le choix idéal pour Pithos car il incarne parfaitement notre [philosophie TypeScript-first](/guide/contribution/design-principles/typescript-first/) :

- **Améliore la DX** : autocomplétion, refactoring, documentation intégrée
- **Zéro coût runtime** : les types disparaissent à la transpilation
- **Erreurs au build** : on attrape les bugs avant qu'ils n'atteignent l'utilisateur

> _Toute la puissance du typage statique, sans un seul octet supplémentaire dans le bundle._

---

## Compile-Time > Runtime

### Principe fondamental

Tout ce qui **peut** être résolu au compile time **doit** l'être.

| !Moment          | Exemples                                         | Coût                       |
| ---------------- | ------------------------------------------------ | -------------------------- |
| **Compile-time** | Types, inlining, élimination de code mort        | 0 runtime                  |
| **Build-time**   | Tree-shaking, minification, optimisations V8     | 0 runtime                  |
| **Runtime**      | Uniquement l'inévitable                          | Coût accepté si justifié   |

### Ce qui doit être prévisible

- **Validation de structure** → Types TypeScript (compile-time)
- **Transformations connues** → Optimisées par V8 ou le bundler
- **Chemins de code** → Branchement prévisible pour le JIT

### Ce qui reste au runtime (par nécessité)

Certaines choses **ne peuvent pas** être prédites et doivent être gérées au runtime :

- **Validation aux frontières** : données d'API, entrées utilisateur, fichiers
- **Données dynamiques** : réponses serveur, WebSockets, événements
- **Environnement** : feature flags, configuration runtime

> _Pour ces cas, nous acceptons le coût runtime mais l'optimisons autant que possible._

### Pourquoi cette approche ?

<ResponsiveMermaid
  desktop={`flowchart LR
    P[Prévisible] --> CT[Compile-time] --> Z[0 coût runtime] --> MUX[UX maximale]
    U[Imprévisible] --> RT[Runtime] --> MC[Coût minimal] --> PUX[UX préservée]
`}
/>

---

## Nos exigences

Certains compromis sont **non négociables** :
<InvisibleList>
❌ Des bundles abusivement gonflés pour le confort du développeur  
❌ Des abstractions superflues qui alourdissent le runtime  
❌ Sacrifier la performance côté client au profit d'une API plus élégante  
</InvisibleList>

:::warning[Côté serveur (Node.js)]
La performance compte encore plus côté serveur. Des utilitaires comme Arkhe et Kanon peuvent être appelés des milliers de fois par requête. Des fonctions lentes s'accumulent et bloquent l'[event loop](https://nodejs.org/fr/learn/asynchronous-work/event-loop-timers-and-nexttick), pénalisant tous les utilisateurs. C'est pourquoi nous attachons une grande importance à la performance, comme en témoignent les [benchmarks](/comparisons/arkhe/performances/).
:::

---

## En résumé

Toute la philosophie de Pithos se résume à une seule chaîne de priorités. Cette hiérarchie guide chaque décision technique, du design d'API aux optimisations runtime :

```text
UX > DX > Élégance du code
```

> L'utilisateur d'abord. Le développeur ensuite. Le pragmatisme toujours.

---

## Ce que Pithos n'est PAS

Pour éviter les malentendus, soyons parfaitement clairs sur ce que Pithos **n'essaie pas d'être** :

<TableConfig noEllipsis wrapAll columns={{ "Pithos n'est PAS...": { width: "200px", minWidth: "170px" } }}>

| !Pithos n'est PAS...                       | Parce que...                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| **Un clone de lodash**                      | Nous avons utilisé Lodash à ses débuts, mais nous proposons maintenant des utilitaires qui nous semblent plus en phase avec l'évolution du JavaScript moderne |
| **Une bibliothèque "safe" qui ne throw jamais** | Erreurs explicites > échecs silencieux. Masquer les problèmes mène à de plus gros problèmes |
| **Une bibliothèque pour tous les cas d'usage** | La qualité plutôt que la quantité. Chaque ajout doit mériter sa place            |
| **Une bibliothèque défensive**              | Nous faisons confiance à TypeScript au compile-time, pas aux vérifications de types runtime |

</TableConfig>

### Sur les cas limites

Pithos suit une **approche pragmatique** inspirée de la règle des 80/20 :

<InvisibleList>
❌ Nous ne gérons pas tous les cas limites bizarres qui arrivent rarement en pratique  
❌ Nous n'ajoutons pas de vérifications de types runtime (`typeof`, `instanceof`) : TypeScript garantit déjà les types  
✅ Nous validons les **valeurs** (ex. `size > 0`) mais pas les **types** au runtime  
✅ Quand une erreur n'a pas de sens à gérer, nous **throw** au lieu de la masquer silencieusement  
</InvisibleList>

```typescript
// ❌ Style Lodash : silencieux, défensif
_.get(null, "a.b.c"); // → undefined (c'était intentionnel ? 🤷)

// ✅ Style Pithos : explicite, prévisible
get(null, "a.b.c"); // → throws (vous avez passé null, corrigez votre code 🔧)
```

### Sur la compatibilité

Pithos s'éloigne délibérément des contraintes legacy :

- Pas de polyfills pour les navigateurs obsolètes
- Pas de couches de compatibilité pour les anciennes API
- Pas de bloat pour supporter les cas limites d'il y a dix ans

L'objectif est le meilleur équilibre entre les pratiques web modernes et la performance, pas une interchangeabilité parfaite avec lodash.

:::note[Le bon outil pour le bon usage]
Si vous avez besoin d'une compatibilité 100% lodash, <a href="https://es-toolkit.dev/" rel="nofollow">ES Toolkit</a> offre cela.

Pithos rompt délibérément avec les conventions lodash quand le JavaScript moderne offre de meilleurs patterns. Pas d'héritage legacy, pas de chaînes de compatibilité ; juste une [**performance maximale**](/comparisons/arkhe/performances/), des [**bundles minimaux**](/comparisons/arkhe/bundle-size/) et la meilleure solution pour le web d'aujourd'hui.
:::

---

### L'essentiel

> _« Pithos préfère planter bruyamment sur une entrée invalide plutôt que produire silencieusement un résultat erroné. »_

Cette philosophie signifie :

- **Les bugs remontent plus vite** : pas de corruption silencieuse se propageant dans votre app
- **Le debugging est plus facile** : des messages d'erreur clairs pointant vers la source
- **La performance est meilleure** : pas de vérifications défensives inutiles sur les chemins critiques
- **Les bundles sont plus petits** : moins de code = moins d'octets

---

Cette page couvrait le **pourquoi** derrière Pithos. Pour les directives d'implémentation détaillées (gestion des erreurs, conventions d'API, patterns TypeScript), continuez vers [Philosophie de conception](../contribution/design-principles/design-philosophy.md).
