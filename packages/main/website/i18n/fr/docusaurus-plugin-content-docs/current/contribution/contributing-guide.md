---
sidebar_position: 6
title: Guide de contribution
description: "Guide pratique pour contribuer du code, de la documentation et des améliorations à Pithos. Couvre la configuration, les tests, le style de code et le workflow de pull request."
---

# 📙 Guide de contribution

Merci de considérer contribuer à Pithos ! Ce guide couvre les aspects pratiques de la contribution de code, documentation et améliorations.

## 🚀 Pour commencer

### Prérequis

- Node.js 18+ (ou dernière LTS)
- pnpm (gestionnaire de paquets)
- Git

### Configuration

```bash
# Cloner le dépôt
git clone https://github.com/your-org/pithos.git
cd pithos

# Installer les dépendances
pnpm install

# Exécuter les tests
pnpm test

# Builder le projet
pnpm build
```

## 📝 Workflow de développement

### 1. Créer une branche

```bash
git checkout -b feature/nom-de-votre-feature
# ou
git checkout -b fix/votre-correction-de-bug
```

### 2. Faire vos modifications

Suivez les [Principes de conception](./design-principles/design-philosophy.md) lors de l'implémentation de fonctionnalités :

- **Performance d'abord** : Mesurez l'impact sur la taille du bundle et le runtime
- **TypeScript-first** : Inférence de types complète, pas de fuites `any`
- **Data-first** : API cohérente à travers tous les utilitaires
- **Immuable par défaut** : Ne mutez pas les entrées
- **Échouer vite, échouer fort** : Erreurs explicites plutôt qu'échecs silencieux

### 3. Écrire les tests

Chaque fonctionnalité ou correction doit inclure des tests :

```typescript
import { describe, it, expect } from "vitest";
import { yourFunction } from "./your-function";

describe("yourFunction", () => {
  it("devrait gérer le cas de base", () => {
    expect(yourFunction(input)).toBe(expected);
  });

  it("devrait throw sur une entrée invalide", () => {
    expect(() => yourFunction(invalid)).toThrow();
  });
});
```

**Exigences de test :**
- Tests unitaires pour toutes les fonctions
- Cas limites couverts
- Cas d'erreur testés
- Tests de performance pour les chemins critiques (si applicable)

### 4. Documenter votre code

Utilisez les commentaires TSDoc pour toutes les API publiques :

```typescript
/**
 * Brève description de ce que fait la fonction.
 *
 * @param input - Description du paramètre
 * @returns Description de la valeur de retour
 *
 * @example
 * ```typescript
 * yourFunction("example");
 * // → sortie attendue
 * ```
 *
 * @throws {Error} Quand l'entrée est invalide
 */
export function yourFunction(input: string): string {
  // Implémentation
}
```

### 5. Exécuter les vérifications de qualité

```bash
# Exécuter les tests
pnpm test

# Vérification des types
pnpm typecheck

# Linting
pnpm lint

# Build pour vérifier qu'il n'y a pas d'erreurs
pnpm build
```

## 🔍 Processus de revue de code

### Ce que nous recherchons

1. **Exactitude** : Est-ce que ça fonctionne comme prévu ?
2. **Performance** : Impact sur la taille du bundle et le runtime
3. **Sécurité des types** : Inférence TypeScript complète
4. **Tests** : Couverture adéquate
5. **Documentation** : Commentaires TSDoc clairs
6. **Cohérence** : Suit les patterns existants

### Délais de revue

- Revue initiale : Sous 1-3 jours
- Revues de suivi : Sous 1-2 jours
- Merge : Après approbation et passage de la CI

## 📦 Directives pour les Pull Requests

### Format du titre de PR

```text
type(scope): brève description

Exemples :
feat(arkhe): ajouter l'utilitaire groupBy
fix(kanon): corriger la regex de validation email
docs(zygos): améliorer les exemples Result
perf(kanon): optimiser la validation d'objets
```

### Template de description de PR

```markdown
## Description
Brève description de ce que fait cette PR.

## Motivation
Pourquoi ce changement est-il nécessaire ?

## Changements
- Liste des changements effectués
- Un autre changement

## Tests
Comment cela a-t-il été testé ?

## Impact sur la performance
- Taille du bundle : +X octets / -X octets / pas de changement
- Runtime : benchmarks si applicable

## Breaking Changes
Listez les breaking changes (si applicable)
```

## 🎯 Domaines de contribution

### Haute priorité

- Améliorations de performance avec benchmarks
- Corrections de bugs avec cas de test
- Améliorations de documentation
- Améliorations de la sécurité des types

### Contributions bienvenues

- Nouveaux utilitaires (avec justification)
- Améliorations de la couverture de tests
- Exemples et cas d'usage
- Ajouts de benchmarks

### À discuter d'abord

- Changements architecturaux majeurs
- Breaking changes
- Nouveaux modules
- Refactorings importants

Ouvrez une issue pour en discuter avant d'implémenter.

## 🧪 Stratégie de test

Voir [Stratégie de test](../basics/testing-strategy.md) pour la philosophie de test détaillée.

**Points clés :**
- Tests unitaires pour toutes les fonctions
- Tests d'intégration pour les flux complexes
- Benchmarks de performance pour les chemins critiques
- Tests de mutation pour le code à haute valeur

## 📊 Benchmarks de performance

Lors de l'ajout ou la modification de code critique pour la performance :

```bash
# Exécuter les benchmarks
cd packages/kanon/benchmarks
pnpm bench

# Comparer avec la baseline
pnpm bench:compare
```

Incluez les résultats de benchmark dans votre PR si la performance est affectée.

## 🐛 Signaler des problèmes

### Rapports de bugs

Incluez :
- Reproduction minimale
- Comportement attendu
- Comportement réel
- Environnement (version Node, OS, etc.)

### Demandes de fonctionnalités

Incluez :
- Description du cas d'usage
- API proposée
- Pourquoi les utilitaires existants ne résolvent pas le problème
- Considérations de performance

## 📚 Contributions à la documentation

Les améliorations de documentation sont toujours les bienvenues :

- Corriger les fautes de frappe ou les explications peu claires
- Ajouter des exemples
- Améliorer la documentation API
- Ajouter des cas d'usage

La documentation se trouve dans :
- Commentaires TSDoc (inline avec le code)
- `packages/main/website/docs/` (docs utilisateur)
- `packages/main/website/docs/400-contribution/` (docs contributeur)

## 🤝 Code de conduite

- Soyez respectueux et constructif
- Concentrez-vous sur le code, pas sur la personne
- Accueillez les nouveaux venus
- Supposez de bonnes intentions

## 💬 Obtenir de l'aide

- Ouvrez une issue pour les questions
- Consultez la documentation existante
- Examinez les PR similaires pour les patterns

---

Merci de contribuer à Pithos ! Chaque contribution, aussi petite soit-elle, aide à rendre la bibliothèque meilleure pour tout le monde.
