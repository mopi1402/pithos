---
sidebar_label: "Taille de bundle"
sidebar_position: 1
title: "Comparaison de taille de bundle Zygos"
description: "Comparez la taille de bundle de Pithos Zygos avec Neverthrow, fp-ts et d'autres bibliothèques Result/Either"
---

import {
  ZygosResultBundleTable,
  ZygosFpBundleTable,
  ZygosCombinedBundleTable,
  ZygosBundleSummary,
  ZygosGeneratedDate,
  ZygosVersionInfo,
} from '@site/src/components/comparisons/zygos/BundleSizeTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Taille de bundle Zygos

Des chiffres réels. Pas de marketing. **Données auto-générées le <ZygosGeneratedDate />.**

## TL;DR

<ZygosBundleSummary />

---

## Pattern Result (vs Neverthrow)

Tailles individuelles des modules, minifiées + gzippées. Zygos est la référence.

<ZygosResultBundleTable />

<DashedSeparator />

Zygos est **100% compatible API** avec Neverthrow, rendant la migration transparente :

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,ResultAsync:/api/zygos/result/ResultAsync"
// Changez ceci :
import { ok, err, Result, ResultAsync } from "neverthrow";

// En ceci :
import { ok, err, Result } from "@pithos/core/zygos/result/result";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

// Votre code fonctionne sans modification
```

---

## Monades FP (vs fp-ts)

<ZygosFpBundleTable />

<DashedSeparator noMarginBottom />

### Différence de philosophie

Alors que fp-ts repose sur `pipe` et des fonctions au niveau module, Zygos utilise une API fluide chaînable qui semble plus naturelle en TypeScript :

```typescript links="ok:/api/zygos/result/ok"
// Style fp-ts
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

pipe(
  E.right(5),
  E.map(x => x * 2),
  E.fold(
    e => `Error: ${e}`,
    a => `Result: ${a}`
  )
);

// Style Zygos
import { ok } from "@pithos/core/zygos/result/result";

ok(5)
  .map(x => x * 2)
  .match(
    a => `Result: ${a}`,
    e => `Error: ${e}`
  );
```

---

## Comparaison combinée

Bundles complets des bibliothèques en important tous les modules.

<ZygosCombinedBundleTable />

---

## Pourquoi cette différence ?

**fp-ts** fournit une boîte à outils complète de programmation fonctionnelle avec les abstractions Functor, Applicative, Monad. Si vous n'avez besoin que de Result/Either pour la gestion d'erreurs, vous embarquez du code inutilisé.

**Neverthrow** est focalisé sur le pattern Result mais a quand même une surcharge due à son implémentation basée sur des classes. Importer n'importe quelle fonction embarque la bibliothèque entière.

**Zygos** est conçu de zéro pour le tree-shaking. Chaque fonction est autonome, donc vous n'embarquez que ce que vous utilisez.

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

## Zéro dépendance

Chaque kilo-octet que vous ajoutez depuis Pithos est du pur code Pithos : il n'y a pas de dépendances transitives et pas de packages cachés tirés dans votre node_modules. Vous pouvez le vérifier vous-même en inspectant l'arbre de dépendances :

```bash
# Arbre de dépendances Pithos
pithos (varies by import)
└── (nothing else)
```

Cela signifie aussi **zéro risque de chaîne d'approvisionnement** venant de packages tiers.

<ZygosVersionInfo />

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Comparaison complète : philosophie, API, migration
- [Kanon — Taille de bundle](../kanon/bundle-size.md) — Comparaison de taille des bibliothèques de validation
- [Arkhe — Taille de bundle](../arkhe/bundle-size.md) — Comparaison de taille des fonctions utilitaires
- [Guide du module Zygos](/guide/modules/zygos/) — Documentation complète du module

</RelatedLinks>
