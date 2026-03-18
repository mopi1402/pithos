---
title: "Pattern Composite en TypeScript"
sidebar_label: "Composite"
description: "Apprenez à implémenter le design pattern Composite en TypeScript fonctionnel. Construisez des structures arborescentes avec des opérations uniformes."
keywords:
  - composite pattern typescript
  - tree structure
  - recursive data
  - file system tree
  - hierarchical data
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Composite

Composez des objets en structures arborescentes pour représenter des hiérarchies partie-tout. Traitez les objets individuels et les compositions de manière uniforme.

---

## Le Problème

Vous construisez un explorateur de fichiers. Les fichiers ont une taille. Les dossiers contiennent des fichiers et d'autres dossiers. Vous devez afficher la taille totale de n'importe quel dossier, calculée récursivement à partir de son contenu.

L'approche naïve :

```typescript
function getSize(item: File | Folder): number {
  if (item.type === "file") {
    return item.size;
  }
  let total = 0;
  for (const child of item.children) {
    if (child.type === "file") {
      total += child.size;
    } else {
      total += getSize(child); // recursive, but type checks everywhere
    }
  }
  return total;
}
```

Des vérifications de type à chaque niveau. Ajouter une nouvelle opération (compter les fichiers, trouver le plus gros, afficher l'arbre) implique d'écrire une autre fonction récursive avec la même structure if/else.

---

## La Solution

Modélisez l'arbre comme une union discriminée. Utilisez `fold` pour le parcourir uniformément :

```typescript
import { leaf, branch, fold } from "@pithos/core/eidos/composite/composite";

const project = branch({ name: "project", size: 0 }, [
  leaf({ name: "README.md", size: 1024 }),
  branch({ name: "src", size: 0 }, [
    leaf({ name: "index.ts", size: 2048 }),
    leaf({ name: "utils.ts", size: 512 }),
  ]),
  branch({ name: "docs", size: 0 }, [
    leaf({ name: "guide.md", size: 768 }),
  ]),
]);

// Total size: one fold, no type checks
const totalSize = fold(project, {
  leaf: (data) => data.size,
  branch: (_data, childSizes) => childSizes.reduce((a, b) => a + b, 0),
}); // 4352

// File count: same structure, different logic
const fileCount = fold(project, {
  leaf: () => 1,
  branch: (_data, counts) => counts.reduce((a, b) => a + b, 0),
}); // 4
```

Un seul pattern de parcours. Ajoutez de nouvelles opérations sans modifier l'arbre. Les tailles se recalculent automatiquement quand vous ajoutez ou supprimez des nœuds.

---

## Démo {#live-demo}

Un explorateur de fichiers avec des répertoires dépliables. Chaque fichier affiche sa taille, chaque dossier affiche sa taille totale calculée récursivement via `fold`. Ajoutez des fichiers et regardez les tailles se recalculer en remontant l'arbre. Un panneau montre l'opération fold en action.

<PatternDemo pattern="composite" />

---

## Analogie

Un organigramme d'entreprise. Les départements contiennent des équipes, les équipes contiennent des personnes. Quand vous demandez "combien d'employés ?", peu importe si vous interrogez un département, une équipe ou un individu : la question fonctionne de la même manière à chaque niveau.

---

## Quand l'Utiliser

- Représenter des données hiérarchiques (fichiers, organigrammes, composants UI, menus)
- Appliquer des opérations uniformément aux feuilles et aux branches
- Construire des structures récursives avec la sécurité des types
- Besoin de tailles, comptages ou agrégations qui se propagent dans l'arbre

---

## Quand NE PAS l'Utiliser

Si vos données sont plates (une simple liste), ne les forcez pas dans un arbre. Composite ajoute de la complexité qui ne se justifie qu'avec des structures véritablement hiérarchiques.

---

## API

- [leaf](/api/eidos/composite/leaf) — Créer un nœud feuille avec des données
- [branch](/api/eidos/composite/branch) — Créer un nœud branche avec des enfants
- [fold](/api/eidos/composite/fold) — Réduire un arbre à une seule valeur
- [map](/api/eidos/composite/map) — Transformer tous les nœuds d'un arbre
- [flatten](/api/eidos/composite/flatten) — Collecter toutes les valeurs des feuilles
- [find](/api/eidos/composite/find) — Chercher un nœud correspondant à un prédicat
