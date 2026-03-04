---
sidebar_position: 1
title: À propos de Pithos
slug: about-pithos
description: Pithos est une bibliothèque utilitaire TypeScript moderne et alternative à Lodash, sans dépendance, avec validation de schémas et gestion fonctionnelle des erreurs.
---

import ModuleName from "@site/src/components/shared/badges/ModuleName";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import Emoji from "@site/src/components/shared/Emoji";

# <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.2em'}}><Emoji src="/img/emoji/pithos.webp" alt="Logo Pithos" style={{height: '1.2em'}} /> Pithos</span>

## Pourquoi cette jarre

Pithos est une bibliothèque utilitaire TypeScript moderne qu'on ouvre quand on en a assez de réécrire les mêmes helpers pour la cinquième fois.
Conçue comme une alternative unifiée à Lodash, Zod et Neverthrow avec zéro dépendance, elle centralise tout au même endroit, entièrement typé et rigoureusement testé, pour que vous passiez votre temps à livrer plutôt qu'à chercher.

:::info D'utilitaires à écosystème
Pithos a commencé comme une bibliothèque utilitaire, puis a évolué en un écosystème complet en fusionnant deux projets autonomes : **Kanon** (validation de schémas) et **Zygos** (gestion fonctionnelle des erreurs).

Une philosophie unifiée : **[faire confiance à TypeScript au compile-time, valider aux frontières](/guide/contribution/design-principles/error-handling/)**.
:::

---

## Le constat de départ

- « Où est-ce que j'ai mis cet utilitaire, déjà ? »
- Du code réécrit sans cesse, qui n'est jamais vraiment éprouvé.
- D'excellents snippets éparpillés entre les projets, qui ne s'améliorent jamais.
- Les vulnérabilités croissantes dans la chaîne d'approvisionnement des dépendances externes.

---

## L'espoir dans la jarre
<InvisibleList>
✅ Des utilitaires éprouvés, enfin réunis, qui s'améliorent au fil du temps.  
✅ Des builds légers et prévisibles, libérés de toute dépendance.  
✅ TypeScript qui veille : inférence complète, aucune fuite any.  
✅ Une migration en douceur, grâce à des API déjà connues.  
</InvisibleList>

---

## Le mythe derrière le nom

La « boîte » de Pandore était en réalité une grande jarre : _pithos_ en grec.  
Ce projet embrasse cette histoire : une seule jarre contenant à la fois les problèmes que nous avons rencontrés et les solutions que nous avons conçues pour les résoudre.

---

## Ce que vous y trouverez

- <ModuleName name="Arkhe" to="/guide/modules/arkhe/">Utilitaires de données et types TypeScript fondamentaux (la base).</ModuleName>
- <ModuleName name="Kanon" to="/guide/modules/kanon/">Validation de schémas avec une approche légère, à la Zod.</ModuleName>
- <ModuleName name="Zygos" to="/guide/modules/zygos/">Patterns Result/Either/Option/Task pour des flux sûrs et composables.</ModuleName>
- <ModuleName name="Sphalma" to="/guide/modules/sphalma/">Error factories pour des erreurs typées et cohérentes.</ModuleName>
- <ModuleName name="Taphos" to="/guide/modules/taphos/">Utilitaires dépréciés avec des chemins de migration clairs vers les API modernes/natives.</ModuleName>

---

## Comment s'en servir

- Importez uniquement ce dont vous avez besoin : tout est tree-shakable.
- Mélangez et combinez : validation (Kanon) + flux sûrs (Zygos) + helpers de base (Arkhe).
- Appuyez-vous sur la documentation et les commentaires TSDoc ; chaque fonction est décrite.

---

## Prochaines étapes

- [Démarrage](../get-started.md) — Soyez opérationnel en 5 minutes
- [Installation](./installation.md) — Configuration avancée et paramétrage
- [Bonnes pratiques](./best-practices.md) — Le contrat Pithos : valider aux frontières, faire confiance aux types
- [Exemple pratique](./practical-example.md) — Construisez quelque chose de concret avec Pithos
