## `ensure` 💎

> Validate with Kanon, get a Result from Zygos. One call bridges both worlds.

### **Normalize** user input after validation 📍

@keywords: form, validation, normalize, transform, map, mapErr, a11y, security

Validate a form payload and clean up the data in one chain.
Essential for any form handler that needs both validation and normalization.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object } from "@pithos/core/kanon";
import { capitalize } from "@pithos/core/arkhe/string/capitalize";

const contactSchema = object({
  firstName: string(),
  lastName: string(),
  email: string(),
});

function processForm(data: unknown) {
  return ensure(contactSchema, data)
    .map(contact => ({
      ...contact,
      firstName: capitalize(contact.firstName),
      lastName: capitalize(contact.lastName),
      email: contact.email.toLowerCase(),
    }))
    .mapErr(error => `Please fix the form: ${error}`);
}

const result = processForm({ firstName: "john", lastName: "DOE", email: "John@Example.COM" });
// Ok({ firstName: "John", lastName: "Doe", email: "john@example.com" })
```

### **Enforce** a business rule after schema validation 📍

@keywords: andThen, chain, business rule, stock, order, domain logic, payment

Validate the shape first, then apply a domain constraint. The Result chain stays flat, no nested `if/else`.
Perfect for order processing, booking systems, or any domain with conditional rules.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number } from "@pithos/core/kanon";
import { ok, err } from "@pithos/core/zygos/result/result";

const orderSchema = object({
  productId: string(),
  quantity: number(),
});

const inventory: Record<string, number> = { "SKU-001": 5, "SKU-002": 0 };

function placeOrder(data: unknown) {
  return ensure(orderSchema, data)
    .andThen(order => {
      const stock = inventory[order.productId] ?? 0;
      if (order.quantity > stock) {
        return err(`Only ${stock} units left for ${order.productId}`);
      }
      return ok({ ...order, total: order.quantity * 29.99 });
    });
}

placeOrder({ productId: "SKU-001", quantity: 3 });
// Ok({ productId: "SKU-001", quantity: 3, total: 89.97 })

placeOrder({ productId: "SKU-002", quantity: 1 });
// Err("Only 0 units left for SKU-002")
```

### **Branch** explicitly on success or failure

@keywords: match, branching, config, response, pattern

Handle both outcomes in one expression. No forgotten error paths, no unchecked assumptions.
Essential for request handlers that must always return a response.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number, optional } from "@pithos/core/kanon";

const configSchema = object({
  host: string(),
  port: number(),
  debug: optional(string()),
});

function loadConfig(raw: unknown): string {
  return ensure(configSchema, raw)
    .match(
      config => `Server ready at ${config.host}:${config.port}`,
      error => `Invalid config: ${error}`,
    );
}

loadConfig({ host: "localhost", port: 3000 });
// "Server ready at localhost:3000"

loadConfig({ host: "localhost" });
// "Invalid config: ..."
```

### **Fallback** to defaults when validation fails

@keywords: env, environment, startup, config, unwrapOr, fallback, defaults, performance

Validate environment variables at startup and fall back to safe defaults if anything is missing.
Perfect for application bootstrap where crashing is not an option.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number, optional, coerceNumber } from "@pithos/core/kanon";

const envSchema = object({
  DATABASE_URL: string(),
  PORT: coerceNumber(),
  LOG_LEVEL: optional(string()),
});

const config = ensure(envSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
}).unwrapOr({
  DATABASE_URL: "postgres://localhost:5432/dev",
  PORT: 3000,
  LOG_LEVEL: undefined,
});

// config is always defined, even if env vars are missing
console.log(`Connecting to ${config.DATABASE_URL} on port ${config.PORT}`);
```

### **Validate** multiple inputs in parallel

@keywords: combine, multiple, parallel, validation, batch, request

Validate independent inputs and combine the results. If any fails, the first error propagates.
Essential for API handlers that receive headers, body, and params separately.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number } from "@pithos/core/kanon";
import { Result } from "@pithos/core/zygos/result/result";

const headerSchema = object({ authorization: string() });
const bodySchema = object({ title: string(), amount: number() });
const paramsSchema = object({ id: string() });

function handleRequest(headers: unknown, body: unknown, params: unknown) {
  return Result.combine([
    ensure(headerSchema, headers),
    ensure(bodySchema, body),
    ensure(paramsSchema, params),
  ]).map(([auth, payload, route]) => ({
    token: auth.authorization,
    title: payload.title,
    amount: payload.amount,
    id: route.id,
  }));
}

handleRequest(
  { authorization: "Bearer abc" },
  { title: "Invoice", amount: 100 },
  { id: "inv-42" },
);
// Ok({ token: "Bearer abc", title: "Invoice", amount: 100, id: "inv-42" })
```

### **Validate** overlay configuration before opening

@keywords: overlay, config, dialog, modal, validation, design system, a11y

Validate overlay options before creating the overlay to catch misconfigurations early.
Essential for CDK-style overlay services that accept user-provided configuration.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number, boolean, optional } from "@pithos/core/kanon";

const overlayConfigSchema = object({
  width: optional(string()),
  height: optional(string()),
  hasBackdrop: boolean(),
  panelClass: optional(string()),
  minWidth: optional(number()),
  maxWidth: optional(number()),
});

function openOverlay(rawConfig: unknown) {
  return ensure(overlayConfigSchema, rawConfig)
    .map(config => ({
      ...config,
      width: config.width ?? "auto",
      hasBackdrop: config.hasBackdrop ?? true,
    }))
    .match(
      config => overlayService.create(config),
      error => console.error(`Invalid overlay config: ${error}`),
    );
}
```

### **Validate** stepper form data at each step

@keywords: stepper, form, step, validation, wizard, multi-step, design system

Validate the current step's form data before allowing navigation to the next step.
Essential for multi-step wizard components with per-step validation.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, number, optional } from "@pithos/core/kanon";

const stepSchemas = [
  object({ email: string(), password: string() }),
  object({ firstName: string(), lastName: string(), age: optional(number()) }),
  object({ street: string(), city: string(), zip: string() }),
];

function validateStep(stepIndex: number, formData: unknown) {
  const schema = stepSchemas[stepIndex];
  if (!schema) return err("Invalid step index");

  return ensure(schema, formData)
    .match(
      data => { goToStep(stepIndex + 1); return data; },
      error => { showStepErrors(stepIndex, error); return null; },
    );
}

nextButton.addEventListener("click", () => {
  validateStep(currentStep, getFormData(currentStep));
});
```

### **Validate** environment variables at CI startup

@keywords: CI, environment, variables, startup, validation, scripts, ci/cd, security

Validate all required environment variables before a CI pipeline runs.
Essential for catching misconfigured deployments early.

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, optional } from "@pithos/core/kanon";

const envSchema = object({
  DATABASE_URL: string(),
  API_KEY: string(),
  DEPLOY_TARGET: string(),
  SENTRY_DSN: optional(string()),
});

const envResult = ensure(envSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  API_KEY: process.env.API_KEY,
  DEPLOY_TARGET: process.env.DEPLOY_TARGET,
  SENTRY_DSN: process.env.SENTRY_DSN,
});

envResult.match(
  (env) => startPipeline(env),
  (error) => {
    console.error(`CI aborted: missing env vars - ${error}`);
    process.exit(1);
  },
);
```
