---
sidebar_label: "Guide de test"
sidebar_position: 3
title: "Guide de test"
description: "Guide pratique pour tester les utilitaires Pithos : quand utiliser chaque niveau de test, outils, commandes et objectifs de couverture."
keyword_stuffing_ignore:
  - test
---

import { Table } from "@site/src/components/shared/Table";

# 🧪 Guide de test

Ce guide détaille comment tester un utilitaire Pithos : quand utiliser chaque niveau, les outils à disposition, les commandes et les objectifs de couverture.

Pour comprendre la stratégie de test multi-couches et pourquoi elle existe, consultez la page [Stratégie de test](../basics/testing-strategy.md).

---

## Quand utiliser chaque niveau

<Table
  stickyHeader={false}
  columns={[
    {
      key: "situation",
      header: "Situation",
      sticky: true,
      width: "200px",
      minWidth: "200px",
    },
    {
      key: "approach",
      header: "Approche recommandée",
    },
  ]}
  data={[
    {
      situation: "Nouvelle fonction",
      approach: "Commencer par les tests standard, ajouter des property-based pour les invariants",
    },
    {
      situation: "Types union dans l'API",
      approach: "Ajouter des tests `[🎯]` pour chaque branche",
    },
    {
      situation: "Score de mutation < 100%",
      approach: "Ajouter des tests `[👾]` ciblés pour les mutants survivants",
    },
    {
      situation: "Domaine d'entrée complexe",
      approach: "Ajouter des tests `[🎲]` avec les arbitraires appropriés",
    },
    {
      situation: "Rapport de bug",
      approach: "Écrire un test qui échoue d'abord, puis corriger",
    },
  ]}
  keyExtractor={(item) => item.situation}
  allowWrapOnMobile={true}
/>

---

## Outils utilisés dans Pithos

<Table
  stickyHeader={false}
  columns={[
    {
      key: "tool",
      header: "Outil",
      sticky: true,
      width: "25%",
      minWidth: "120px",
      maxWidth: "150px",
    },
    {
      key: "purpose",
      header: "Objectif",
    },
    {
      key: "documentation",
      header: "Documentation",
    },
  ]}
  data={[
    {
      tool: "[Vitest](https://vitest.dev/)",
      purpose: "Exécuteur de tests avec support TypeScript",
      documentation: "[Guide](https://vitest.dev/guide/)",
    },
    {
      tool: "[Stryker](https://stryker-mutator.io/)",
      purpose: "Tests de mutation",
      documentation: "[Docs](https://stryker-mutator.io/docs/)",
    },
    {
      tool: "[fast-check](https://fast-check.dev/)",
      purpose: "Tests property-based",
      documentation: "[Tutoriels](https://fast-check.dev/docs/tutorials/)",
    },
  ]}
  keyExtractor={(item) => item.tool}
/>

---

## Exécuter les tests

Pithos fournit plusieurs commandes de test selon ce que vous voulez vérifier, d'une exécution complète rapide aux tests de mutation ciblés sur un seul fichier :

```bash
# Exécuter tous les tests
pnpm test

# Exécuter les tests avec rapport de couverture
pnpm coverage

# Exécuter les tests de mutation (projet entier)
pnpm test:mutation

# Exécuter les tests de mutation sur un fichier spécifique
pnpm stryker run --mutate 'packages/pithos/src/arkhe/object/evolve.ts'
```

---

## Objectifs de couverture

<Table
  columns={[
    {
      key: "metric",
      header: "Métrique",
      sticky: true,
      width: "30%",
      minWidth: "150px",
      maxWidth: "150px",
      wrap: true,
    },
    {
      key: "target",
      header: "Objectif",
    },
    {
      key: "why",
      header: "Pourquoi",
    },
  ]}
  data={[
    {
      metric: "Couverture de code",
      target: "100%",
      why: "Base : s'assurer que tout le code s'exécute",
    },
    {
      metric: "Score de mutation",
      target: "100%",
      why: "S'assurer que les tests vérifient réellement le comportement",
    },
    {
      metric: "Tests property-based",
      target: "1-5 par fonction",
      why: "Explorer automatiquement les cas limites",
    },
    {
      metric: "Couverture des cas limites",
      target: "Tous les types union + `@note`",
      why: "S'assurer que les contrats d'API sont testés",
    },
  ]}
  keyExtractor={(item) => item.metric}
/>

---

## La philosophie

> _« Un test qui passe quand le code est faux est pire que pas de test du tout : il donne une fausse confiance. »_

Chaque préfixe raconte une histoire :

- **Pas de préfixe** : « C'est le comportement attendu »
- **`[🎯]`** : « Ceci couvre une branche d'API spécifique »
- **`[👾]`** : « Ceci tue un mutant spécifique »
- **`[🎲]`** : « Ceci vérifie qu'un invariant tient pour n'importe quelle entrée »

Quand vous voyez un test qui échoue, le préfixe vous dit immédiatement _pourquoi_ ce test existe et quel type de bug vous avez.
