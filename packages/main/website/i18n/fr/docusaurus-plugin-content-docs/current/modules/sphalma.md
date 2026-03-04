---
sidebar_position: 4
sidebar_label: "Sphalma"
title: "Sphalma - Fabriques d'erreurs typées pour TypeScript | Gestion structurée des erreurs"
description: "Créez des erreurs structurées et identifiables avec des codes hexadécimaux pour TypeScript. Fabriques d'erreurs type-safe pour le debugging, le logging et la gestion d'erreurs API."
keywords:
  - gestion erreurs typescript
  - fabrique erreurs typées
  - erreurs structurées
  - codes erreur typescript
  - debugging erreurs
image: /img/social/sphalma-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Sphalma"
  description="Fabriques d'erreurs typées avec codes hexadécimaux pour TypeScript. Créez des erreurs structurées et identifiables pour le debugging, le logging et la gestion d'erreurs API."
  url="https://pithos.dev/guide/modules/sphalma"
/>

# 🆂 <ModuleName name="Sphalma" />

_σφάλμα - « erreur »_

Fabriques d'erreurs typées avec codes hexadécimaux. Créez des erreurs structurées et identifiables pour le debugging et le logging.

Sphalma fournit un moyen systématique de créer et gérer les erreurs applicatives. Au lieu de disperser des `new Error()` dans votre codebase, vous définissez les codes d'erreur en amont et créez des fabriques typées qui produisent des erreurs cohérentes et identifiables. Chaque erreur porte un code numérique, un label de type et des détails optionnels, facilitant le traçage dans les logs et la correspondance avec des messages utilisateur. La classe `CodedError` étend [`Error`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) avec des métadonnées structurées.

---

## 🃏 Quelques exemples

Définissez vos codes d'erreur comme des constantes hexadécimales pour la lisibilité, puis créez une fabrique typée. Chaque erreur produite par la fabrique inclut une clé structurée comme `[Api:0x1001]` instantanément recherchable dans les logs :

```typescript links="createErrorFactory:/api/sphalma/error-factory/createErrorFactory,CodedError:/api/sphalma/error-factory/CodedError"
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";

// Définir les codes d'erreur (hex pour la lisibilité)
const ErrorCodes = {
  NOT_FOUND: 0x1001,
  INVALID_INPUT: 0x1002,
} as const;

// Créer une fabrique typée
const createApiError = createErrorFactory<0x1001 | 0x1002>("Api");

// Lancer des erreurs structurées
throw createApiError(ErrorCodes.NOT_FOUND, { id: "user-123" });
// Error: [Api:0x1001] avec details.id = "user-123"
```

:::tip i18n
Les codes structurés comme `[Api:0x1001]` simplifient l'internationalisation : associez chaque code à un message traduit, et votre gestion d'erreurs reste indépendante de la langue.
:::

---

## CodedError

`CodedError` est la classe d'erreur structurée au cœur de Sphalma. Elle étend le `Error` natif avec un code numérique, un label de type et un objet de détails optionnel. La propriété `key` combine type et code en un identifiant unique pour le filtrage et la recherche :

```typescript links="CodedError:/api/sphalma/error-factory/CodedError"
import { CodedError } from "pithos/sphalma/error-factory";

const error = new CodedError(0x2000, "Semaphore", { count: -1 });

error.code;    // 0x2000 (8192)
error.type;    // "Semaphore"
error.key;     // "Semaphore:0x2000"
error.details; // { count: -1 }
error.message; // "[Semaphore:0x2000]"
```

---

## Convention de codes d'erreur

Pithos utilise un format hexadécimal à 4 chiffres : `0xMFEE`

<div style={{fontFamily: 'var(--ifm-font-family-monospace)', fontSize: '1.1em', lineHeight: '1.8', margin: '1.5em 0', padding: '1em 1.5em', backgroundColor: 'var(--prism-background)', borderRadius: 'var(--ifm-code-border-radius)'}}>
  <code>0x</code>
  <code style={{color: 'var(--prism-keyword)'}}> M</code>
  <code style={{color: 'var(--prism-number)'}}> F</code>
  <code style={{color: 'var(--prism-string)'}}> EE</code>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-number)'}}>&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-string)'}}>&nbsp;&nbsp;└── Erreur (00-FF) → 256 erreurs par fonctionnalité</span>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-number)'}}>&nbsp;&nbsp;└── Fonctionnalité (0-F) → 16 fonctionnalités par module</span>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;└── Module (1-F) → 15 modules</span>
</div>

Les plages de codes sont documentées dans chaque module utilisant Sphalma.

---

## Intégration avec Zygos

Sphalma se combine naturellement avec les types Result de Zygos pour la gestion fonctionnelle des erreurs. Au lieu de lancer des erreurs, retournez-les comme des valeurs `Err` typées. Cela rend chaque chemin d'échec visible dans la signature de la fonction :

```typescript links="createErrorFactory:/api/sphalma/error-factory/createErrorFactory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { createErrorFactory } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createUserError = createErrorFactory<0x3001 | 0x3002>("User");

function getUser(id: string): Result<User, CodedError> {
  if (!id) return err(createUserError(0x3001, { reason: "ID vide" }));
  // ...
  return ok(user);
}
```

---

## ✅ Quand l'utiliser

Sphalma est le plus utile dans les projets où les erreurs doivent être catégorisées, suivies et communiquées à travers les frontières du système :

- **Erreurs de module** → Codes d'erreur cohérents à travers un module
- **Erreurs API** → Le frontend peut mapper les codes vers des messages UI
- **Debugging** → `[Animation:0x1001]` est instantanément identifiable dans les logs

---

## ❌ Quand NE PAS l'utiliser

Pour les cas d'erreur simples ou les patterns de gestion d'erreurs spécialisés, considérez ces alternatives :

| Besoin | Utilisez plutôt |
|--------|-----------------|
| Throw simple | `Error`, `TypeError`, `RangeError` natifs |
| Erreurs de validation | [Kanon](./kanon.md) |
| Flux de gestion d'erreurs | [Zygos](./zygos.md) |

---

## 🪢 Fonctionne bien avec

Voir [Alchimie des modules](/guide/module-alchemy/) pour découvrir comment Sphalma se combine avec Zygos et Kanon dans des pipelines typés.

---

<RelatedLinks title="Ressources associées">

- [Quand utiliser Sphalma](/comparisons/overview/) — Comparez les modules Pithos avec les alternatives et trouvez quand chacun est le bon choix
- [Comparaisons complètes Pithos](/comparisons/overview/) — Comparez les modules Pithos avec les alternatives et trouvez quand chacun est le bon choix
- [Référence API Sphalma](/api/sphalma) — Documentation API complète pour les fabriques d'erreurs et CodedError

</RelatedLinks>
