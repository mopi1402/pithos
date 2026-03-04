---
sidebar_label: "Vue d'ensemble"
sidebar_position: 1
title: "Pithos vs Lodash, Zod & Neverthrow - Vue d'ensemble des comparaisons"
description: "Un guide rapide des modules Pithos : Arkhe (utilitaires), Kanon (validation) et Zygos (gestion d'erreurs) - quand utiliser chacun et comment ils se comparent aux alternatives"
keyword_stuffing_ignore:
  - want
---

import { QuickComparisonTable } from '@site/src/components/comparisons/QuickComparisonTable';
import Muted from '@site/src/components/shared/Muted';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Pithos vs Lodash, Zod & Neverthrow

Pithos est organisé en cinq modules. Chacun résout un problème spécifique avec un impact minimal sur le bundle.

---

## Comparaison rapide

<QuickComparisonTable />

---

## ✅ Quand utiliser chaque module

### <span className="module-name-heading">Arkhe</span> - Fonctions utilitaires

**Utilisez [Arkhe](/guide/modules/arkhe/) quand :**
- Vous voulez des bundles plus petits que Lodash
- Vous développez une application moderne
- Vous voulez une meilleure inférence TypeScript
- La sécurité de la chaîne d'approvisionnement vous importe

<Muted>

Utilisez plutôt Lodash quand :
- Vous avez besoin du support IE11
- Votre codebase l'utilise déjà massivement

</Muted>

:::info Migration
De nombreuses fonctions Lodash ont désormais des équivalents natifs. Consultez [Taphos](/api/taphos) pour savoir quoi remplacer par du JS natif vs Arkhe.
:::

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Kanon</span> - Validation de schémas

**Utilisez [Kanon](/guide/modules/kanon/) quand :**
- Vous voulez des bundles plus petits que Zod
- Vous avez besoin d'une validation type-safe simple sans surcharge
- Vous voulez des validateurs compilés JIT pour des performances maximales
- Vous voulez zéro dépendance
- Vous utilisez déjà Pithos

<Muted>

Utilisez plutôt Zod quand :
- Vous avez besoin de transformations complexes (`.transform()`)
- Vous avez besoin de validation asynchrone
- Vous avez besoin de nombreux validateurs de format intégrés (IP, JWT, CUID, ULID...)
- Vous l'utilisez déjà

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Zygos</span> - Gestion d'erreurs

**Utilisez [Zygos](/guide/modules/zygos/) quand :**
- Vous voulez des bundles plus petits
- Vous avez aussi besoin des monades Option/Either/Task
- Vous utilisez déjà Pithos
- Vous voulez la gestion d'erreurs par générateurs (`safeTry`)
- Vous voulez un remplacement direct de Neverthrow

<Muted>

Utilisez plutôt Neverthrow quand :
- Si Neverthrow est votre seul cas d'usage Pithos, le coût de migration ne se justifie peut-être pas
- Vous voulez l'implémentation "originale"

Utilisez plutôt fp-ts quand :
- Vous voulez de la programmation fonctionnelle complète
- Vous avez besoin des abstractions Functor, Applicative, Monad
- Vous êtes à l'aise avec le style FP Haskell
- Vous avez besoin de `pipe` avec une hiérarchie complète de classes de types

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Sphalma</span> - Fabriques d'erreurs typées

**Utilisez [Sphalma](/guide/modules/sphalma/) quand :**
- Vous avez besoin d'erreurs structurées et typées avec des codes hexadécimaux
- Vous voulez une identification cohérente des erreurs dans votre codebase
- Vous utilisez Zygos et voulez des canaux d'erreurs typés

<Muted>

Sphalma n'a pas de concurrent direct — il comble un vide que la plupart des projets résolvent avec des classes d'erreurs ad-hoc ou de simples chaînes de caractères.

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Taphos</span> - Équivalence native

**Utilisez [Taphos](/guide/modules/taphos/) quand :**
- Vous migrez depuis Lodash
- Vous voulez savoir quelles fonctions Arkhe ont des équivalents natifs
- Vous voulez des conseils de dépréciation avant de supprimer une dépendance

---

## La philosophie Pithos

<details>
<summary>💡 <strong>Pourquoi les kilo-octets comptent</strong> - "c'est juste quelques ko, qui s'en soucie ?"</summary>

Chaque dépendance s'accumule. La validation ajoute 20 ko. Les dates ajoutent 15 ko. Les utilitaires ajoutent 25 ko. L'état ajoute 30 ko... Avant de vous en rendre compte : **500+ ko de JavaScript** que le navigateur doit télécharger, parser et exécuter.

Cela affecte directement l'expérience utilisateur. Chaque kilo-octet supplémentaire de JavaScript augmente le temps de parsing et d'exécution, ce qui peut impacter les [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), en particulier le **LCP** (Largest Contentful Paint) et l'**INP** (Interaction to Next Paint). Sur les appareils mobiles et les connexions lentes, la différence est encore plus notable.

Moins de code signifie aussi une surface d'attaque réduite : moins de lignes à auditer, moins d'endroits où des vulnérabilités peuvent se cacher.

C'est pourquoi chaque module Pithos est conçu pour n'embarquer que ce que vous utilisez réellement.

</details>

Nous n'essayons pas de tout remplacer. Nous essayons de :

1. <span style={{color: '#e67e22', fontWeight: 600}}>**Couvrir 80% des besoins**</span> avec un impact minimal sur le bundle
2. <span style={{color: '#e67e22', fontWeight: 600}}>**Rester compatible**</span> là où ça compte (API Neverthrow, shim Zod)
3. <span style={{color: '#e67e22', fontWeight: 600}}>**Orienter vers le natif**</span> quand JavaScript a rattrapé son retard (Taphos)
4. <span style={{color: '#e67e22', fontWeight: 600}}>**Rester honnête**</span> sur les cas où d'autres libs sont meilleures

Utilisez ce qui fonctionne pour vous. Mélangez si nécessaire.

<RelatedLinks>
- [Arkhe vs Lodash — Comparaison complète](./arkhe/arkhe-vs-lodash.md)
- [Kanon vs Zod — Comparaison complète](./kanon/kanon-vs-zod.md)
- [Zygos vs Neverthrow — Comparaison complète](./zygos/zygos-vs-neverthrow.md)
- [Table d'équivalence — Tous les modules côte à côte](./equivalence-table.md)
- [Reproduire nos données](./reproduce.md)
</RelatedLinks>
