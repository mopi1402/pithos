---
title: "Pattern Proxy en TypeScript"
sidebar_label: "Proxy"
description: "Apprenez à implémenter le design pattern Proxy en TypeScript fonctionnel. Contrôlez l'accès aux fonctions avec du cache, du rate limiting et du fallback."
keywords:
  - proxy pattern typescript
  - llm proxy
  - api caching
  - rate limiting
  - function proxy
  - memoization
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Pattern Proxy

Fournissez un substitut ou un placeholder pour un autre objet afin de contrôler l'accès à celui-ci.

---

## Le Problème

Vous appelez une API LLM depuis votre app. Chaque appel coûte de l'argent et prend du temps. La même question posée deux fois ne devrait pas coûter deux fois. Les utilisateurs spamment le bouton. Et quand le fournisseur principal tombe, votre app plante.

L'approche naïve :

```typescript
async function askLLM(question: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat", {
    method: "POST",
    body: JSON.stringify({ prompt: question }),
  });
  return response.json(); // $0.003 every single time
}

// "What is the capital of France?" asked 10 times = 10 API calls = $0.03
// Provider goes down? App crashes.
// User spams? You burn through your rate limit.
```

Pas de cache. Pas de rate limit. Pas de fallback. Chaque appel frappe l'API, brûle de l'argent et prie pour que le fournisseur reste debout.

---

## La Solution

Enveloppez la fonction avec des couches de proxy. Même interface, trois couches de protection :

```typescript
import { memoize, throttle } from "@pithos/core/arkhe";
import { withFallback } from "@pithos/core/eidos/strategy/strategy";

// 1. Cache: same question = instant response, $0.000
const cachedAsk = memoize(askLLM);

// 2. Rate limit: max 1 call per second
const rateLimitedAsk = throttle(cachedAsk, 1000);

// 3. Fallback: if primary fails, try backup silently
const resilientAsk = withFallback(rateLimitedAsk, askBackupLLM);

// Consumer code is identical — just a function call
const answer = await resilientAsk("What is the capital of France?");
// First call:  1.2s, $0.003 — cache miss
// Second call: 2ms,  $0.000 — cache hit ⚡
```

Trois utilitaires Pithos, trois couches de proxy. Le consommateur ne sait rien du cache, du rate limiting ou du failover.

---

## Démo {#live-demo}

Posez des questions à un LLM simulé et observez le proxy en action : cache hits, rate limits et failover de fournisseur.

<PatternDemo pattern="proxy" />

---

## Analogie

Une carte de crédit est un proxy pour votre compte bancaire. Elle fournit la même interface "payer des choses", mais ajoute du contrôle d'accès (plafond de crédit), du logging (historique des transactions) et peut fonctionner hors ligne (transactions par signature).

---

## Quand l'Utiliser

- Mettre en cache des calculs coûteux ou des appels API
- Limiter le débit d'accès aux services externes
- Ajouter une logique de fallback/retry sans changer le code consommateur
- Ajouter du logging ou des métriques de manière transparente
- Charger des ressources en lazy à la première utilisation

---

## Quand NE PAS l'Utiliser

Si la fonction est peu coûteuse, rapide et fiable, un proxy ajoute de l'overhead sans bénéfice. Ne mettez pas en cache une fonction qui retourne `Date.now()` et n'enveloppez pas un calcul synchrone pur dans un rate limiter.

---

## Variantes de Proxy dans Arkhe

Arkhe fournit plusieurs utilitaires de proxy :

```typescript
import { memoize, once, throttle, debounce, lazy, guarded } from "@pithos/core/arkhe";

// Caching proxy — cache results by arguments
const cached = memoize(expensiveCalculation);

// Single-execution proxy — run only once
const initialize = once(loadConfig);

// Rate-limiting proxies
const throttled = throttle(saveToServer, 1000);  // max once per second
const debounced = debounce(search, 300);         // wait for pause in calls

// Lazy initialization proxy
const config = lazy(() => loadExpensiveConfig());

// Conditional execution proxy
const adminOnly = guarded(deleteUser, (user) => user.isAdmin);
```

---

## API

Ces fonctions viennent d'[Arkhe](/guide/modules/arkhe/) et sont ré-exportées par Eidos :

- [memoize](/api/arkhe/function/memoize) — Mettre en cache les résultats de fonctions
- [once](/api/arkhe/function/once) — Exécuter uniquement au premier appel
- [throttle](/api/arkhe/function/throttle) — Limiter la fréquence d'appel
- [debounce](/api/arkhe/function/debounce) — Retarder jusqu'à l'arrêt des appels
- [lazy](/api/arkhe/function/lazy) — Différer l'initialisation
- [guarded](/api/arkhe/function/guarded) — Exécution conditionnelle
- [withFallback](/api/eidos/strategy/withFallback) — Chaîner une fonction principale avec un backup (depuis [Strategy](/api/eidos/strategy/))
