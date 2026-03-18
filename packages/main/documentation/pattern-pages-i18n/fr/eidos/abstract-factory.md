---
title: "Pattern Abstract Factory en TypeScript"
sidebar_label: "Abstract Factory"
description: "Apprenez à implémenter le design pattern Abstract Factory en TypeScript fonctionnel. Créez des familles d'objets liés sans spécifier leurs types concrets."
keywords:
  - abstract factory typescript
  - factory pattern
  - object families
  - theme factory
  - cross-platform ui
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Abstract Factory

Fournissez un point d'entrée unique pour créer des familles d'objets liés sans coupler au type concret.

---

## Le Problème

Vous construisez un kit UI cross-platform. Chaque plateforme (iOS, Android, Web) a besoin de son propre bouton, input et modal. Mais la logique du formulaire ne devrait pas se soucier de la plateforme sur laquelle elle tourne.

L'approche naïve :

```typescript
function createButton(platform: string, label: string) {
  if (platform === "ios") return { type: "UIButton", label, style: "rounded" };
  if (platform === "android") return { type: "MaterialButton", label, style: "elevated" };
  if (platform === "web") return { type: "button", label, style: "outlined" };
}

function createInput(platform: string, placeholder: string) {
  if (platform === "ios") return { type: "UITextField", placeholder };
  // ... same pattern repeated for every component
}
```

Des vérifications de plateforme dans chaque factory. Facile de mélanger des boutons iOS avec des inputs Android. Ajouter une nouvelle plateforme implique de modifier chaque fonction.

---

## La Solution

Regroupez les factories liées en familles. Choisissez la plateforme une fois, obtenez un kit cohérent :

```typescript
import { createAbstractFactory } from "@pithos/core/eidos/abstract-factory/abstract-factory";

type UIKit = {
  button: (label: string) => UIElement;
  input: (placeholder: string) => UIElement;
  modal: (title: string, content: string) => UIElement;
};

const uiFactory = createAbstractFactory<"ios" | "android" | "web", UIKit>({
  ios: () => ({
    button: (label) => ({ tag: "UIButton", label, radius: 12 }),
    input: (ph) => ({ tag: "UITextField", placeholder: ph, border: "none" }),
    modal: (title, content) => ({ tag: "UIAlert", title, content }),
  }),
  android: () => ({
    button: (label) => ({ tag: "MaterialButton", label, elevation: 4 }),
    input: (ph) => ({ tag: "TextInput", placeholder: ph, underline: true }),
    modal: (title, content) => ({ tag: "AlertDialog", title, content }),
  }),
  web: () => ({
    button: (label) => ({ tag: "button", label, className: "btn" }),
    input: (ph) => ({ tag: "input", placeholder: ph, className: "form-input" }),
    modal: (title, content) => ({ tag: "dialog", title, content }),
  }),
});

// Consumer code: platform-agnostic
const ui = uiFactory.create("ios");
const loginForm = [
  ui.input("Email"),
  ui.input("Password"),
  ui.button("Sign In"),
];
// All components guaranteed to be iOS. Switch to "android" and everything re-skins.
```

Plateforme sélectionnée une seule fois. Tous les composants de la même famille. Aucun mélange possible.

---

## Démo {#live-demo}

Un mini écran de téléphone avec un formulaire. Basculez entre iOS, Android et Web et regardez toute l'interface changer d'un coup : boutons, inputs, modals, navigation. Le code consommateur appelle `factory.createButton()` sans savoir quelle plateforme est active.

<PatternDemo pattern="abstract-factory" />

---

## Analogie

Un magasin de meubles avec des collections de styles : Moderne, Victorien, Art Déco. Quand vous choisissez "Moderne", vous obtenez une chaise moderne, une table moderne, une lampe moderne : tout est conçu pour aller ensemble. On ne mélange pas des chaises Victoriennes avec des tables Art Déco.

---

## Quand l'Utiliser

- Créer des familles d'objets liés qui doivent être utilisés ensemble
- Supporter plusieurs plateformes, thèmes ou configurations
- Assurer la cohérence visuelle/comportementale entre composants liés
- Échanger des familles entières à l'exécution (changement de thème, détection de plateforme)

---

## Quand NE PAS l'Utiliser

Si vous n'avez qu'une seule "famille" ou que vos objets ne sont pas liés, une simple fonction factory suffit. Abstract Factory ajoute une indirection qui ne se justifie que quand vous avez plusieurs familles interchangeables.

---

## API

- [createAbstractFactory](/api/eidos/abstract-factory/createAbstractFactory) — Construire une factory qui produit des familles d'objets liés
