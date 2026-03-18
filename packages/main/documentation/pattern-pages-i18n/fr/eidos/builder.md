---
title: "Pattern Builder en TypeScript"
sidebar_label: "Builder"
description: "Apprenez à implémenter le design pattern Builder en TypeScript fonctionnel. Construisez des objets complexes étape par étape avec une API fluide."
keywords:
  - builder pattern typescript
  - api fluide
  - construction étape par étape
  - builder immuable
  - chart builder
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Builder

Construisez des objets complexes étape par étape. Le même processus de construction peut créer différentes représentations.

---

## Le Problème

Vous développez une bibliothèque de graphiques. Les graphiques ont plein de paramètres optionnels : type, titre, labels, plusieurs datasets, légende, labels d'axes, lignes de grille.

L'approche naïve :

```typescript
function createChart(
  type: string,
  title?: string,
  labels?: string[],
  data?: number[],
  data2?: number[],
  color?: string,
  color2?: string,
  showLegend?: boolean,
  yAxisLabel?: string
) {
  // 9+ paramètres, la plupart optionnels, l'ordre compte
}

// L'appel est pénible
createChart("bar", "Revenue", months, revenue, expenses, "#3b82f6", "#ef4444", true);
```

Trop de paramètres. Ajouter un second dataset oblige à passer tous les précédents. Facile de se tromper d'ordre.

---

## La Solution

Construisez le graphique étape par étape avec une API fluide :

```typescript
import { createBuilder } from "@pithos/core/eidos/builder/builder";

// TS infère tous les noms d'étapes — les typos sont des erreurs de compilation
const chartBuilder = createBuilder({
  type: "bar",
  title: "",
  labels: [],
  datasets: [],
})
  .step("type", (s, type: "bar" | "line") => ({ ...s, type }))
  .step("title", (s, title: string) => ({ ...s, title }))
  .step("labels", (s, labels: string[]) => ({ ...s, labels }))
  .step("data", (s, data: number[], color: string, label: string) => ({
    ...s,
    datasets: [{ label, data, color }],
  }))
  // Fonctionnalité clé du builder : composer avec l'état précédent
  .step("addDataset", (s, label: string, data: number[], color: string) => ({
    ...s,
    datasets: [...s.datasets, { label, data, color }],
  }))
  .step("legend", (s, show: boolean) => ({ ...s, showLegend: show }))
  .done();

// Fluide, lisible, composable
const chart = chartBuilder()
  .type("bar")
  .title("Monthly Revenue")
  .labels(["Jan", "Feb", "Mar", "Apr", "May", "Jun"])
  .data([120, 340, 220, 510, 480, 390], "#3b82f6", "Revenue")
  .addDataset("Expenses", [80, 150, 120, 200, 180, 160], "#ef4444")
  .legend(true)
  .build();
```

Chaque étape est nommée. L'ordre est flexible. `.addDataset()` compose avec les données précédentes — un simple objet d'options ne pourrait pas faire ça.

---

## Démo {#live-demo}

Activez chaque étape du builder et regardez le graphique se mettre à jour en temps réel. Remarquez comment `.addDataset()` s'empile par-dessus le premier dataset — c'est le builder qui compose l'état en interne.

<PatternDemo pattern="builder" />

---

## Analogie

Commander une pizza personnalisée. Vous commencez par la pâte, ajoutez la sauce, choisissez le fromage, sélectionnez les garnitures. Chaque étape est indépendante. Vous pouvez ajouter les garnitures dans n'importe quel ordre. Le `.build()` final, c'est l'enfourner.

---

## Quand l'Utiliser

- Les objets ont beaucoup de paramètres optionnels
- La construction implique plusieurs étapes qui composent
- Vous voulez une API fluide et lisible
- Le même processus doit créer différentes configurations

---

## Quand NE PAS l'Utiliser

Si votre objet peut être entièrement décrit par un simple objet d'options sans étapes composables, préférez ça. Builder ajoute de la cérémonie qui ne vaut le coup que quand les étapes composent ou que la construction est réellement séquentielle.

---

## API

- [createBuilder](/api/eidos/builder/createBuilder) — Créer un builder fluide immuable
- [createValidatedBuilder](/api/eidos/builder/createValidatedBuilder) — Builder avec validation à chaque étape

