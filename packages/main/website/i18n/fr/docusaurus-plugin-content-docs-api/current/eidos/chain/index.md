---
title: "Pattern Chain of Responsibility en TypeScript"
sidebar_label: "Chain of Responsibility"
description: "Apprenez à implémenter le design pattern Chain of Responsibility en TypeScript fonctionnel. Construisez des pipelines de traitement de requêtes flexibles."
keywords:
  - chain of responsibility typescript
  - middleware pattern
  - pipeline de requêtes
  - chaîne de handlers
  - traitement séquentiel
important: true
hiddenGem: false
sidebar_custom_props:
  important: true
  hiddenGem: false
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { PatternNav } from '@site/src/components/shared/PatternNav';


<PatternNav module="eidos" />

# Pattern Chain of Responsibility

Passez une requête le long d'une chaîne de handlers. Chaque handler décide de traiter la requête ou de la passer au suivant.

---

## Le Problème

Vous développez une API. Chaque requête a besoin d'authentification, validation, rate limiting et logging. Mais tout est mélangé :

```typescript
async function handleRequest(req: Request): Promise<Response> {
  // Auth mélangée
  const user = verifyToken(req.headers.authorization);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Rate limiting mélangé
  if (isRateLimited(user.id)) return new Response("Too many requests", { status: 429 });

  // Validation mélangée
  const body = await req.json();
  if (!isValid(body)) return new Response("Bad request", { status: 400 });

  // Logging mélangé
  console.log(`${req.method} ${req.url} by ${user.id}`);

  // La logique métier enterrée tout en bas
  return processBusinessLogic(body);
}
```

Chaque nouvelle préoccupation = modifier le handler. La logique transversale est emmêlée avec la logique métier.

---

## La Solution

Chaque préoccupation est un middleware. Chaînez-les ensemble, chacun décide de traiter ou passer au suivant :

```typescript
import { createChain } from "@pithos/core/eidos/chain/chain";

const handleRequest = createChain<Request, Response>(
  // Auth : rejeter ou enrichir et passer
  (req, next) => {
    const user = verifyToken(req.headers.authorization);
    if (!user) return new Response("Unauthorized", { status: 401 });
    return next({ ...req, user });
  },
  // Rate limit : rejeter ou passer
  (req, next) => {
    if (isRateLimited(req.user.id)) return new Response("Too Many Requests", { status: 429 });
    return next(req);
  },
  // Validation : rejeter ou passer
  (req, next) => {
    if (!isValid(req.body)) return new Response("Bad Request", { status: 400 });
    return next(req);
  },
  // Logger : observer et toujours passer
  (req, next) => {
    console.log(`${req.method} ${req.url}`);
    return next(req);
  },
);
```

Ajoutez, supprimez ou réordonnez les middlewares sans toucher aux autres. Chaque handler a une responsabilité unique. Ça vous dit quelque chose ? C'est exactement comme ça que fonctionnent Express, Hono et Koa sous le capot.

---

## Démo {#live-demo}

<PatternDemo pattern="chain" />

---

## Analogie

La sécurité à l'aéroport. Votre carte d'embarquement est vérifiée (auth), votre sac passe aux rayons X (validation), vous passez le détecteur de métaux (screening), puis vous êtes autorisé à embarquer. Chaque point de contrôle peut vous arrêter ou vous laisser passer au suivant. Ajouter un nouveau contrôle ne change pas les autres.

---

## Quand l'Utiliser

- Plusieurs handlers peuvent traiter une requête
- Le handler n'est pas connu à l'avance
- Vous voulez ajouter/supprimer des étapes de traitement dynamiquement
- Construction de pipelines middleware (comme Express, Hono, Koa)

---

## Quand NE PAS l'Utiliser

Si votre traitement est toujours la même séquence fixe sans sorties anticipées, une simple composition de fonctions ou un pipe est plus clair. Chain brille quand les handlers peuvent court-circuiter.

---

## API

- [createChain](/api/eidos/chain/createChain) — Construire une chaîne de handlers avec input/output typés
- [safeChain](/api/eidos/chain/safeChain) — Chaîne qui capture les erreurs et retourne un Result

