## `ensurePromise` 💎

> Pass a schema and a promise, get a validated `ResultAsync`. The shortest path from `fetch` to typed data.

### **Fetch** and validate in a single call 📍

@keywords: fetch, promise, validate, one-liner, API, endpoint, performance

Replace the `ResultAsync.fromPromise(...).andThen(validate)` boilerplate with one call.
Essential for any endpoint that returns JSON you need to trust.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number, optional } from "@pithos/core/kanon";

const productSchema = object({
  id: string(),
  name: string(),
  price: number(),
  description: optional(string()),
});

const result = ensurePromise(
  productSchema,
  fetch("/api/products/42").then(r => r.json()),
);

result
  .map(product => ({
    ...product,
    priceFormatted: `${product.price.toFixed(2)}`,
  }))
  .match(
    product => console.log(`${product.name}: ${product.priceFormatted}`),
    error => console.error(`Failed: ${error}`),
  );
```

### **Load** remote configuration at startup 📍

@keywords: config, remote, fetch, settings, startup, initialization

Load and validate a remote JSON config file. Fall back to defaults if the shape is wrong.
Perfect for feature flags, A/B testing configs, or any remote settings.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number, boolean, optional } from "@pithos/core/kanon";

const remoteConfigSchema = object({
  featureFlags: object({
    darkMode: boolean(),
    betaAccess: boolean(),
  }),
  apiVersion: string(),
  maxRetries: number(),
  maintenanceMessage: optional(string()),
});

async function loadRemoteConfig() {
  const config = await ensurePromise(
    remoteConfigSchema,
    fetch("/config.json").then(r => r.json()),
  );

  return config.match(
    cfg => cfg,
    error => {
      console.warn(`Remote config invalid (${error}), using defaults`);
      return {
        featureFlags: { darkMode: false, betaAccess: false },
        apiVersion: "v1",
        maxRetries: 3,
        maintenanceMessage: undefined,
      };
    },
  );
}
```

### **Aggregate** errors from parallel API calls

@keywords: parallel, combine, Promise.all, multiple endpoints, aggregate, observability

Fetch and validate multiple endpoints in parallel. Collect all errors instead of failing on the first one.
Essential for dashboard pages that load data from several sources.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number, array } from "@pithos/core/kanon";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const userSchema = object({ id: string(), name: string() });
const statsSchema = object({ views: number(), likes: number() });
const postsSchema = array(object({ id: string(), title: string() }));

function loadDashboard(userId: string) {
  return ResultAsync.combineWithAllErrors([
    ensurePromise(userSchema, fetch(`/api/users/${userId}`).then(r => r.json())),
    ensurePromise(statsSchema, fetch(`/api/stats/${userId}`).then(r => r.json())),
    ensurePromise(postsSchema, fetch(`/api/posts?author=${userId}`).then(r => r.json())),
  ]).map(([user, stats, posts]) => ({
    user,
    stats,
    posts,
  }));
}

// ResultAsync<Dashboard, string[]> - all errors collected if multiple fail
```

### **Upload** a file and validate the server response

@keywords: upload, file, FormData, server response, validate response, payment

Upload a file and validate what the server sends back in one pipeline.
Perfect for file upload flows where the response shape matters.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number } from "@pithos/core/kanon";

const uploadResponseSchema = object({
  fileId: string(),
  url: string(),
  size: number(),
});

function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);

  return ensurePromise(
    uploadResponseSchema,
    fetch("/api/upload", { method: "POST", body }).then(r => r.json()),
  ).map(response => ({
    ...response,
    sizeFormatted: `${(response.size / 1024).toFixed(1)} KB`,
  }));
}

// ResultAsync<{ fileId, url, size, sizeFormatted }, string>
```

### **Load** design system tokens from a remote source

@keywords: design system, tokens, remote, fetch, theme, presets

Fetch and validate design tokens from a remote theme server.
Essential for design systems that load theme configurations dynamically.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number, array } from "@pithos/core/kanon";

const themeTokensSchema = object({
  colors: object({
    primary: string(),
    secondary: string(),
    background: string(),
    text: string(),
  }),
  spacing: object({
    unit: number(),
    scale: array(number()),
  }),
  breakpoints: object({
    sm: number(),
    md: number(),
    lg: number(),
    xl: number(),
  }),
});

function loadTheme(themeId: string) {
  return ensurePromise(
    themeTokensSchema,
    fetch(`/api/themes/${themeId}`).then(r => r.json()),
  ).match(
    tokens => applyThemeTokens(tokens),
    error => {
      console.warn(`Theme ${themeId} invalid: ${error}, using defaults`);
      applyThemeTokens(defaultTokens);
    },
  );
}
```

### **Trust** a GraphQL response

@keywords: graphql, query, API, typed response, validate

GraphQL servers can return unexpected shapes. Validate the response before using it.
Critical for typed frontends that rely on specific response structures.

```typescript
import { ensurePromise } from "@pithos/core/bridges/ensurePromise";
import { string, object, number } from "@pithos/core/kanon";

const gqlResponseSchema = object({
  data: object({
    repository: object({
      name: string(),
      stargazerCount: number(),
      issues: object({
        totalCount: number(),
      }),
    }),
  }),
});

function fetchRepoInfo(owner: string, name: string) {
  const query = `query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) { name stargazerCount issues { totalCount } }
  }`;

  return ensurePromise(
    gqlResponseSchema,
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query, variables: { owner, name } }),
    }).then(r => r.json()),
  ).map(res => res.data.repository);
}

// ResultAsync<{ name, stargazerCount, issues: { totalCount } }, string>
```
