## `ensureAsync` 💎

> Like `ensure`, but returns a `ResultAsync`. Slots into any async chain as a validation step.

### **Validate** an API response inside an async pipeline 📍

@keywords: async, pipeline, ResultAsync, andThen, fetch, validation, chain, performance, security

When you already have a `ResultAsync` from a previous operation, `ensureAsync` slots in as a validation step. The pipeline stays flat.
Essential for any fetch-then-validate pattern.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number, array } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const userSchema = object({
  id: string(),
  name: string(),
  score: number(),
});

const leaderboardSchema = array(userSchema);

function fetchLeaderboard(): ResultAsync<{ id: string; name: string; score: number }[], string> {
  return ResultAsync.fromPromise(
    fetch("/api/leaderboard").then(r => r.json()),
    (e) => `Network error: ${e}`,
  )
    .andThen(data => ensureAsync(leaderboardSchema, data))
    .map(users => users.filter(u => u.score > 0));
}

// The entire chain is a single ResultAsync<User[], string>
```

### **Chain** multiple async steps with validation between each 📍

@keywords: workflow, sequential, andThen, multi-step, auth, profile

Authenticate, then fetch a profile, validating each response before moving on. Each step is typed and validated.
Perfect for login flows, onboarding wizards, or any multi-step async workflow.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const tokenSchema = object({ accessToken: string(), expiresIn: number() });
const profileSchema = object({ id: string(), name: string(), email: string() });

function authenticateAndLoadProfile(credentials: unknown) {
  return ResultAsync.fromPromise(
    fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }).then(r => r.json()),
    (e) => `Auth request failed: ${e}`,
  )
    .andThen(data => ensureAsync(tokenSchema, data))
    .andThen(token =>
      ResultAsync.fromPromise(
        fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        }).then(r => r.json()),
        (e) => `Profile request failed: ${e}`,
      ),
    )
    .andThen(data => ensureAsync(profileSchema, data));
}

// ResultAsync<{ id, name, email }, string> - fully typed, fully validated
```

### **Guard** incoming WebSocket messages

@keywords: websocket, message, stream, event, real-time, validate, observability

Validate each incoming message from a WebSocket or event stream independently.
Essential for real-time apps where the server might send unexpected shapes.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number } from "@pithos/core/kanon";

const messageSchema = object({
  type: string(),
  payload: object({ value: number(), timestamp: string() }),
});

function handleMessage(raw: unknown) {
  return ensureAsync(messageSchema, raw)
    .map(msg => ({
      kind: msg.type,
      value: msg.payload.value,
      receivedAt: new Date(msg.payload.timestamp),
    }))
    .mapErr(error => `Malformed message: ${error}`);
}

// ws.onmessage = (event) => {
//   handleMessage(JSON.parse(event.data))
//     .match(
//       msg => processEvent(msg),
//       err => console.warn(err),
//     );
// };
```

### **Secure** database query results

@keywords: database, query, ORM, result, validate, type-safe

Validate data returned by a database query or ORM before using it. Catches shape mismatches even when the DB layer returns `unknown`.
Perfect for any data access layer that needs runtime guarantees.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number, array, optional } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const productSchema = object({
  id: string(),
  name: string(),
  price: number(),
  category: optional(string()),
});

const productsSchema = array(productSchema);

function getProducts(categoryFilter?: string) {
  return ResultAsync.fromPromise(
    db.query("SELECT * FROM products WHERE category = $1", [categoryFilter]),
    (e) => `Query failed: ${e}`,
  )
    .andThen(rows => ensureAsync(productsSchema, rows))
    .map(products => products.sort((a, b) => a.price - b.price));
}

// ResultAsync<Product[], string> - validated and sorted
```

### **Retry** a validated operation on transient failure

@keywords: retry, transient, failure, resilience, orElse, recover, observability

Use `orElse` to retry when the first attempt fails. Both attempts are validated.
Critical for health checks, external API calls, or any operation prone to transient errors.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const healthSchema = object({ status: string(), version: string() });

function checkHealth(url: string) {
  const attempt = () =>
    ResultAsync.fromPromise(
      fetch(url).then(r => r.json()),
      (e) => `Unreachable: ${e}`,
    ).andThen(data => ensureAsync(healthSchema, data));

  return attempt()
    .orElse(() => {
      console.log("First attempt failed, retrying...");
      return attempt();
    });
}

// Tries once, retries on failure, validates both times
checkHealth("https://api.example.com/health");
```

### **Validate** drag-and-drop data transfer payload

@keywords: drag, drop, data transfer, validate, sortable, design system

Validate the data transferred during a drag-and-drop operation before processing.
Essential for CDK-style drag-and-drop that accepts external data.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number, array } from "@pithos/core/kanon";

const dragDataSchema = object({
  type: string(),
  items: array(object({ id: string(), index: number() })),
  sourceContainerId: string(),
});

function handleDrop(rawData: unknown, targetContainerId: string) {
  return ensureAsync(dragDataSchema, rawData)
    .map(data => ({
      ...data,
      targetContainerId,
      movedItems: data.items.map(item => item.id),
    }))
    .match(
      data => commitReorder(data),
      error => console.warn(`Invalid drop data: ${error}`),
    );
}
```

### **Validate** payment webhook payloads

@keywords: payment, webhook, Stripe, validate, security, financial

Validate incoming payment webhook data before processing transactions.
Critical for payment integrations where malformed data could cause financial errors.

```typescript
import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
import { string, object, number, literal, union } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const paymentEventSchema = object({
  id: string(),
  type: union(literal("payment_intent.succeeded"), literal("payment_intent.failed")),
  data: object({
    object: object({
      amount: number(),
      currency: string(),
      customer: string(),
    }),
  }),
});

function handlePaymentWebhook(rawBody: unknown) {
  return ensureAsync(paymentEventSchema, rawBody)
    .map(event => ({
      eventId: event.id,
      amount: event.data.object.amount / 100,
      currency: event.data.object.currency.toUpperCase(),
      customerId: event.data.object.customer,
      succeeded: event.type === "payment_intent.succeeded",
    }))
    .mapErr(error => `Invalid webhook payload: ${error}`);
}
```
