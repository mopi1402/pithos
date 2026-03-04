---
sidebar_position: 3
sidebar_label: "Alchimie des modules"
title: "Alchimie des modules : Les modules Pithos ensemble"
description: "Découvrez comment les modules Pithos se combinent : validation Kanon vers Result Zygos avec ensure(), erreurs typées Sphalma dans les chaînes Result, transformations Arkhe avec validation Kanon."
keywords:
  - synergie modules pithos
  - kanon zygos bridge
  - ensure validation result
  - pipeline validation typescript
  - sphalma zygos intégration
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

# 🪢 Alchimie des modules

Chaque module Pithos résout un problème précis et peut être utilisé de façon autonome. Mais certains se combinent naturellement pour simplifier le code.  
Cette page présente quelques combinaisons et les synergies qui en découlent.

---

## Kanon + Zygos = `ensure()`

La seule fonction bridge dédiée dans Pithos. [`ensure()`](/api/bridges/ensure/) prend un schéma [Kanon](/guide/modules/kanon/) et retourne un [`Result`](/api/zygos/result/) au lieu d'un simple objet `{ success, data }`, pour enchaîner la validation avec tout le reste.

### Bénéfice d'`ensure()`

Le `parse()` de Kanon fonctionne très bien tout seul. Mais dès qu'on chaîne la validation avec d'autres opérations, on finit par écrire des blocs `if/else` impératifs :

```typescript
const parsed = parse(schema, data);
if (!parsed.success) {
  return handleError(parsed.error);
}
const transformed = transform(parsed.data);
// ... encore des if/else pour chaque étape
```

`ensure()` permet de retourner simplement un `Result` :

```typescript links="ensure:/api/bridges/ensure"
import { ensure } from "pithos/bridges/ensure";
import { object, string, number } from "pithos/kanon";

const UserSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
});

ensure(UserSchema, data)
  .map(user => ({ ...user, name: user.name.trim() }))
  .mapErr(error => `Validation échouée : ${error}`);
```

### Déclinaisons

| Fonction | Retourne | Quand l'utiliser |
|----------|----------|------------------|
| `ensure()` | `Result<T, string>` | Validation sync : formulaires, configs, arguments de fonction |
| `ensureAsync()` | `ResultAsync<T, string>` | Chaînes async : quand la donnée est déjà résolue dans un pipeline `ResultAsync` |
| `ensurePromise()` | `ResultAsync<T, string>` | Promise + validation en un coup -> fetch, requêtes DB |

<DashedSeparator noMarginBottom />
<br />

`ensurePromise()` élimine le boilerplate `ResultAsync.fromPromise(...).andThen(...)` :

```typescript links="ensurePromise:/api/bridges/ensurePromise"
import { ensurePromise } from "pithos/bridges/ensurePromise";
import { object, string, number } from "pithos/kanon";

const UserSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
});

// Une ligne : fetch + validation + ResultAsync typé
ensurePromise(UserSchema, fetch("/api/user").then(r => r.json()))
  .map(user => user.name.toUpperCase());
```

---

## Sphalma + Zygos : Erreurs typées dans les chaînes Result

Au lieu de lancer des erreurs, retournez-les comme des valeurs [`Err`](/api/zygos/result/err/) typées. [`CodedError`](/api/sphalma/error-factory/) porte un code hex, un label de type et des détails optionnels. Chaque chemin d'échec est visible dans la signature de la fonction :

```typescript links="createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createUserError = createErrorFactory<0x3001 | 0x3002>("USER_ERROR");

function getUser(id: string): Result<User, CodedError> {
  if (!id) return err(createUserError(0x3001, { reason: "ID vide" }));
  const user = db.find(id);
  if (!user) return err(createUserError(0x3002, { id }));
  return ok(user);
}

// L'appelant gère les deux cas explicitement
getUser("user-123").match(
  user => console.log(user.name),
  error => console.log(error.key) // "USER_ERROR:0x3002"
);
```

Pas de `try/catch`, pas d'erreurs `string` non typées. Le compilateur sait exactement ce qui peut échouer.

---

## Kanon + Sphalma : De la validation aux erreurs domaine

Kanon attrape les données malformées. Sphalma gère les erreurs métier qui surviennent après la validation. Ensemble, ils couvrent tout le spectre d'erreurs :

```typescript links="createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { parse, object, string, number } from "pithos/kanon";
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createOrderError = createErrorFactory<0x4001 | 0x4002>("ORDER_ERROR");

const OrderSchema = object({
  product: string().minLength(1),
  quantity: number().min(1).int(),
});

function createOrder(input: unknown): Result<Order, CodedError | string> {
  // Étape 1 : Kanon valide la forme
  const parsed = parse(OrderSchema, input);
  if (!parsed.success) return err(parsed.error);

  // Étape 2 : Sphalma gère les règles métier
  if (!isInStock(parsed.data.product)) {
    return err(createOrderError(0x4001, { product: parsed.data.product }));
  }

  return ok(saveOrder(parsed.data));
}
```

Kanon dit « ces données sont-elles bien formées ? », Sphalma dit « cette opération est-elle valide ? ».

---

## Arkhe → Taphos : une continuité, pas une synergie

Ce n'est pas une combinaison de deux modules, c'est le cycle de vie naturel d'une fonction. Quand un équivalent natif sort, un utilitaire Arkhe migre vers Taphos où il devient un polyfill deprecated. Votre IDE vous guide vers le remplacement natif, à votre rythme.

Voir la [page Taphos](/guide/modules/taphos/) pour le schéma de migration complet et les exemples de code.

---

## Le pipeline complet

Combinez les quatre modules dans une seule chaîne typée : valider, transformer, gérer les erreurs et propager les échecs structurés :

```typescript links="ensure:/api/bridges/ensure,createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ensure } from "pithos/bridges/ensure";
import { object, string, number } from "pithos/kanon";
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";
import { capitalize, trim } from "pithos/arkhe";

const createApiError = createErrorFactory<0x5001 | 0x5002>("API_ERROR");

const ContactSchema = object({
  name: string().minLength(1),
  email: string().email(),
  age: number().min(18).int(),
});

function processContact(input: unknown): Result<Contact, CodedError | string> {
  return ensure(ContactSchema, input)
    // Transformations Arkhe
    .map(data => ({
      ...data,
      name: capitalize(trim(data.name)),
    }))
    // Validation domaine avec Sphalma
    .andThen(data => {
      if (isBlacklisted(data.email)) {
        return err(createApiError(0x5001, { email: data.email }));
      }
      return ok(data);
    });
}
```

- Kanon valide la forme. 
- Arkhe transforme les données. 
- Zygos enchaîne le tout. 
- Sphalma structure les erreurs.
> Un pipeline, quatre modules, zéro `try/catch`.

---

<RelatedLinks title="Ressources associées">

- [Kanon : Validation de schémas](/guide/modules/kanon/) : Définir des schémas avec Kanon
- [Zygos : Types Result](/guide/modules/zygos/) : Chaîner et gérer les erreurs avec Result
- [Sphalma : Erreurs typées](/guide/modules/sphalma/) : Fabriques d'erreurs structurées
- [Exemple pratique](/guide/basics/practical-example/) : Kanon + Zygos dans un cas d'usage réel

</RelatedLinks>
