---
title: "Pattern Template Method en TypeScript"
sidebar_label: "Template Method"
description: "Apprenez à implémenter le design pattern Template Method en TypeScript fonctionnel. Définissez des squelettes d'algorithmes avec des étapes personnalisables."
keywords:
  - template method typescript
  - algorithm skeleton
  - hook methods
  - customizable steps
  - inversion of control
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Template Method

Définissez le squelette d'un algorithme en déléguant certaines étapes à des sous-classes (ou en FP : à des fonctions injectées).

---

## Le Problème

Vous construisez un générateur de CV. Chaque CV suit la même structure : En-tête → Résumé → Expérience → Compétences → Formation. Mais le CV d'un développeur met en avant TypeScript et le system design, celui d'un designer met en avant Figma et les design systems, et celui d'un manager met en avant le team building et les OKRs.

L'approche naïve :

```typescript
function buildDeveloperResume() {
  return [
    devHeader(),
    devSummary(),
    devExperience(),
    devSkills(),
    devEducation(),
  ];
}

function buildDesignerResume() {
  return [
    designerHeader(),
    designerSummary(),
    designerExperience(),
    designerSkills(),
    designerEducation(),
  ];
}
// Same skeleton repeated for every profile
```

La structure est identique. Seul le contenu de chaque étape change. Ajouter une nouvelle section implique de mettre à jour chaque fonction.

---

## La Solution

Définissez le squelette une seule fois avec des étapes par défaut. Chaque profil ne surcharge que ce qui diffère :

```typescript
import { templateWithDefaults } from "@pithos/core/eidos/template/template";

const buildResume = templateWithDefaults(
  (steps: ResumeSteps) =>
    (): ResumeSection[] => [
      steps.header(),
      steps.summary(),
      steps.experience(),
      steps.skills(),
      steps.education(),
    ],
  DEFAULT_STEPS, // base implementation for all 5 steps
);

// Developer: override 3 steps, keep default header + education
const devResume = buildResume({
  summary: () => ({ title: "Summary", content: ["Full-stack developer with 7+ years..."] }),
  experience: () => ({ title: "Experience", content: ["Senior Engineer — Stripe..."] }),
  skills: () => ({ title: "Skills", content: ["TypeScript · React · Node.js..."] }),
});

// Designer: override all 5 steps (different portfolio link, different education)
const designerResume = buildResume({
  header: () => ({ title: "Alex Johnson", content: ["...", "portfolio.alexj.design"] }),
  summary: () => ({ title: "Summary", content: ["Product designer with 6+ years..."] }),
  experience: () => ({ title: "Experience", content: ["Senior Designer — Figma..."] }),
  skills: () => ({ title: "Skills", content: ["Figma · Design Systems..."] }),
  education: () => ({ title: "Education", content: ["M.F.A. Interaction Design — RISD"] }),
});
```

Le squelette (En-tête → Résumé → Expérience → Compétences → Formation) est défini une seule fois. Chaque profil ne spécifie que ce qui diffère. `templateWithDefaults` fusionne automatiquement les surcharges avec les valeurs par défaut.

---

## Démo {#live-demo}

Basculez entre les profils Développeur, Designer et Manager. Le squelette du template est toujours les mêmes 5 étapes dans le même ordre. Le pipeline d'étapes à gauche montre quelles étapes sont surchargées (ambre) vs celles par défaut (gris). Quand vous changez de profil, les étapes s'exécutent séquentiellement pour montrer le template en action.

<PatternDemo pattern="template" />

---

## Analogie

Un modèle de recette. "Faire une soupe : 1) préparer les ingrédients, 2) faire bouillir l'eau, 3) ajouter les ingrédients, 4) laisser mijoter, 5) servir." Le modèle est le même pour toutes les soupes. Chaque recette de soupe remplit juste quels ingrédients préparer et ajouter.

---

## Quand l'Utiliser

- Plusieurs algorithmes partagent la même structure
- Vous voulez imposer une séquence d'étapes
- Certaines étapes varient tandis que d'autres restent constantes
- Vous avez besoin de valeurs par défaut sensées avec des surcharges sélectives

---

## Quand NE PAS l'Utiliser

Si chaque étape est différente pour chaque variante, il n'y a pas de squelette partagé. Vous avez juste des fonctions différentes. Template Method brille quand la structure est fixe et que seul le contenu varie.

---

## API

- [templateWithDefaults](/api/eidos/template/templateWithDefaults) — Créer des templates d'algorithmes avec des étapes surchargeables
