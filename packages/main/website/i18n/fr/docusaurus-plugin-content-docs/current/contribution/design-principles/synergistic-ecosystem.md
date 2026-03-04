---
sidebar_position: 2
title: Écosystème synergique
description: "Comment les modules Pithos fonctionnent ensemble comme un écosystème synergique. Conventions partagées, API cohérentes et interopérabilité entre Arkhe, Kanon et Zygos."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# L'écosystème synergique

## Le problème

Les développeurs utilisent typiquement des bibliothèques séparées qui n'ont pas été conçues pour fonctionner ensemble :

```typescript
// L'approche fragmentée (avant Pithos)
import { chunk } from "lodash-es"; // Style d'API A, philosophie A
import { z } from "zod"; // Style d'API B, philosophie B
import { Result } from "neverthrow"; // Style d'API C, philosophie C
// 3 équipes différentes, 3 documentations, 3 façons de faire 😕
```

## La vision Pithos

**Une architecture en couches, du plus pur au plus complexe.**

import Mermaid from "@theme/Mermaid";

{(() => {
const styleModule = (name) => `<strong style="color:var(--golden-color); font-family: var(--greek-font), serif; font-weight: 700">${name}</strong>`;

return (
<Mermaid
value={`flowchart TD
WORLD["🌍 MONDE EXTÉRIEUR<br/>(APIs, formulaires, stockage, ...)"]
KANON["📏 ${styleModule("KANON")}<br/>(Frontière)<br/>Validation + Parsing<br/>'Les données sont-elles valides ?'"]
ARKHE["🏛️ ${styleModule("ARKHE")}<br/>(Fondations)<br/>Primitives pures, immuables<br/>Throw en cas de mauvais usage"]
TAPHOS["⚰️ ${styleModule("TAPHOS")}<br/>(Legacy)"]
ZYGOS["⚡ ${styleModule("ZYGOS")}<br/>(Result/Either)"]
SPHALMA["🔧 ${styleModule("SPHALMA")}<br/>(Fabriques d'erreurs)"]

    WORLD --> KANON
    KANON -->|"✅ Données typées et sûres"| ARKHE
    KANON -.->|"déprécié"| TAPHOS
    ARKHE --> ZYGOS
    ZYGOS --> SPHALMA

    classDef legacy fill:#ff000000,stroke:#888888,stroke-width:1px,stroke-dasharray: 5 5
    class TAPHOS legacy

    linkStyle 0 stroke:#888888
    linkStyle 1 stroke:#22c55e,stroke-width:3px
    linkStyle 2 stroke:#888888,stroke-dasharray: 5 5
    linkStyle 3 stroke:#888888
    linkStyle 4 stroke:#ec4899,stroke-width:3px

`}
/>
);
})()}

## Synergies clés

| Combinaison                                                    | Flux                   | Cas d'usage                                                      |
| -------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| <span style={{color: '#22c55e'}}>**Kanon → Arkhe**</span>      | Valider → Transformer  | Une fois validé, Arkhe manipule les données en toute sécurité    |
| <span style={{color: '#ec4899'}}>**Sphalma + Zygos**</span>    | Fabrique d'erreurs → Result | Créer des erreurs typées encapsulées dans un Result           |

## Exemples de synergie

### Création : Erreur applicative personnalisée

Ici, nous créons nos propres erreurs applicatives en utilisant la même infrastructure que Pithos (`Sphalma` + `Zygos`).

```typescript
import { createErrorFactory } from "@sphalma/error-factory";
import { Result, ok, err } from "@zygos/result";
import { validation } from "@kanon/validation";

// 1. Définir les codes (Hex) pour notre App
const AppErrorCodes = {
  INVALID_USER_DATA: 0x9001,
  NETWORK_FAILURE: 0x9002,
} as const;

// 2. Créer la fabrique "App"
const createAppError = createErrorFactory<number>("App");

// 3. Fonction métier avec Synergie (Kanon + Zygos + Sphalma)
function registerUser(data: unknown): Result<User, Error> {
  // Validation (Kanon)
  const schema = validation.object({ username: validation.string() });
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    // Dispatcher une erreur typée (Sphalma) encapsulée dans un Result (Zygos)
    return err(
      createAppError(AppErrorCodes.INVALID_USER_DATA, {
        reasons: parseResult.error.issues,
      })
    );
  }

  // Succès (Zygos)
  return ok({ id: 1, role: "user" });
}
```

## Ce que ça change


| Aspect              | Bibliothèques séparées      | Pithos                |
| ------------------- | --------------------------- | --------------------- |
| **Cohérence API**   | 3+ styles différents        | Style unifié          |
| **Documentation**   | 3+ sources                  | Source unique          |
| **Mises à jour**    | Incompatibilités possibles  | Évolution coordonnée  |
| **Bundle**          | Duplication possible        | Optimisé ensemble     |
| **Courbe d'apprentissage** | Apprendre 3+ libs    | Apprendre une philosophie |

:::important

**L'objectif de Pithos n'est pas de remplacer chaque bibliothèque individuellement.**

C'est de fournir un **écosystème cohérent** où tout est conçu pour fonctionner ensemble.

**Arkhe + Kanon + Zygos = plus que la somme de ses parties.**

:::

## Engagement de synergie

Pour maintenir cette cohérence, chaque nouveau module ou fonction doit :

- [ ] Utiliser les mêmes conventions de nommage
- [ ] Suivre la même philosophie d'erreur (throw vs Result)
- [ ] Être compatible avec les autres modules
- [ ] Partager les mêmes types utilitaires (types Arkhe)
- [ ] Être documenté avec le même standard TSDoc

---

## Règles d'or

4. **Kanon est le GARDIEN** : Il convertit les données inconnues (runtime) en données typées (statique), échouant proprement via `Result` ou `throw` selon le contexte (mais souvent encapsulé).

---

Pour plus de détails sur la philosophie de gestion des erreurs, voir [Gestion des erreurs](./error-handling.md).

---

<RelatedLinks>

- [Philosophie de conception](./design-philosophy.md) — Les principes directeurs de Pithos
- [Comparaison avec les alternatives](./comparison-alternatives.md) — Comment Pithos se compare à Lodash, Remeda et autres

</RelatedLinks>

---