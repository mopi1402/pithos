---
title: "Pattern Facade en TypeScript"
sidebar_label: "Facade"
description: "Découvrez pourquoi le design pattern Facade est absorbé par le TypeScript fonctionnel. Simplifiez des sous-systèmes complexes avec de simples fonctions."
keywords:
  - facade pattern typescript
  - simplify api
  - wrapper function
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Facade

Fournissez une interface simplifiée unique vers un sous-système complexe.

---

## Le Problème

Vous avez un flux d'inscription utilisateur complexe : valider l'input, hasher le mot de passe, sauvegarder en base, envoyer un email de bienvenue. L'approche naïve disperse tous ces appels à chaque point d'inscription.

```typescript
// Dispersé dans les controllers, routes, tests...
const validated = validateUser(data);
const hashed = await hashPassword(validated.password);
const user = await saveToDb({ ...validated, password: hashed });
await sendWelcomeEmail(user.email);
```

Chaque endroit qui inscrit un utilisateur répète la même séquence. Changer l'ordre ou ajouter une étape ? Il faut traquer chaque site d'appel.

---

## La Solution

Une fonction qui orchestre les sous-systèmes. C'est tout.

```typescript
const validateUser = (data: UserInput) => { /* ... */ };
const hashPassword = (password: string) => { /* ... */ };
const saveToDb = (user: User) => { /* ... */ };
const sendWelcomeEmail = (email: string) => { /* ... */ };

// Facade : une fonction, un seul endroit
async function registerUser(data: UserInput): Promise<User> {
  const validated = validateUser(data);
  const hashed = await hashPassword(validated.password);
  const user = await saveToDb({ ...validated, password: hashed });
  await sendWelcomeEmail(user.email);
  return user;
}

// Le client ne voit que registerUser
await registerUser({ name: "Alice", email: "alice@example.com", password: "..." });
```

Pas besoin de classe. Une fonction qui appelle des fonctions est déjà une facade.

:::info Absorbé par le Langage
Cette solution n'utilise pas Pithos. C'est justement le point.

En TypeScript fonctionnel, toute fonction qui simplifie une opération complexe **est** une facade. Eidos exporte une fonction `@deprecated` `createFacade()` qui n'existe que pour vous guider ici.
:::

---

## Démo {#live-demo}

Tapez un ID utilisateur et cliquez sur Fetch. Basculez entre "Without Facade" (6 étapes s'exécutant visuellement une par une) et "With Facade" (un seul appel `fetchUser(id)`). Même résultat, expérience radicalement différente.

<PatternDemo pattern="facade" />

---

## API

- [facade](/api/eidos/facade/facade) `@deprecated` — écrivez simplement une fonction

---

<RelatedLinks title="Liens connexes">

- [Eidos : Module Design Patterns](/guide/modules/eidos) Les 23 patterns GoF réimaginés pour le TypeScript fonctionnel
- [Pourquoi la FP plutôt que la POO ?](/guide/modules/eidos#philosophie) La philosophie derrière Eidos : pas de classes, pas d'héritage, juste des fonctions et des types
- [Zygos Result](/api/zygos/result/Result) Combinez vos facades avec `Result` pour une gestion d'erreurs typée

</RelatedLinks>
