---
sidebar_label: "Practical Example"
sidebar_position: 4
title: "Practical Example"
description: "Build a real-world feature combining multiple Pithos modules for type-safe data manipulation, schema validation, and error handling."
slug: practical-example
---

import { DashboardPlayground } from '@site/src/components/playground/DashboardPlayground';

# 🗜️ Practical Example

Let's build something real: a **user dashboard loader** that fetches data from an API, validates it, transforms it, and handles errors gracefully.

This example combines:

- **Zygos** → Safe async operations with `ResultAsync`
- **Kanon** → Schema validation
- **Arkhe** → Data transformation utilities

---

## The scenario

You need to load a user's dashboard data from an API. The response might be malformed, the network might fail, and you need to transform the raw data before displaying it.

**Traditional approach:** nested try/catch, manual validation, hope for the best.

**Pithos approach:** composable, type-safe, elegant.

### Step 1: Define your schema

First, define what valid data looks like using Kanon:

```typescript
// src/lib/schemas.ts
import {
  object,
  string,
  number,
  boolean,
  array,
  optional,
  parse,
} from "pithos/kanon";

// Define the expected API response structure
const UserSchema = object({
  id: string(),
  firstName: string(),
  lastName: string(),
  email: string().email(),
  role: string(),
  createdAt: string(),
  preferences: optional(
    object({
      theme: optional(string()),
      language: optional(string()),
      notifications: optional(boolean()),
    })
  ),
});

const PostSchema = object({
  id: string(),
  title: string(),
  content: string(),
  publishedAt: optional(string()),
  status: string(),
});

const DashboardSchema = object({
  user: UserSchema,
  posts: array(PostSchema),
  stats: object({
    totalViews: number(),
    totalLikes: number(),
    totalComments: number(),
  }),
});
```

:::tip Using Zod-like API

If you're coming from Zod, the Zod-compatible shim offers a familiar syntax with fewer imports, at the cost of slightly larger bundles:

```typescript
import { z } from "pithos/kanon/helpers/as-zod.shim";

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  // ... same Zod API
});
```

:::

### Step 2: Create safe API helpers

Wrap fetch operations with Zygos for safe error handling:

```typescript
// src/lib/api.ts
import {
  ResultAsync,
  errAsync,
  okAsync,
} from "pithos/zygos/result/result-async";

// Create a safe fetch wrapper
const safeFetch = ResultAsync.fromThrowable(
  fetch,
  (error) => `Network error: ${error}`
);

// Create a safe JSON parser
const safeJson = <T>(response: Response) =>
  ResultAsync.fromThrowable(
    async () => (await response.json()) as T,
    (error) => `JSON parse error: ${error}`
  )();
```

### Step 3: Add data transformation

Use Arkhe utilities to transform the validated data:

```typescript
// src/lib/transformers.ts
import { groupBy } from "pithos/arkhe/array/group-by";
import { capitalize } from "pithos/arkhe/string/capitalize";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

type Post = {
  id: string;
  title: string;
  content: string;
  publishedAt?: string;
  status: string;
};

// Transform user data for display
function formatUser(user: User) {
  return {
    id: user.id,
    fullName: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
    email: user.email,
    role: capitalize(user.role),
    preferences: user.preferences ?? {
      theme: "light",
      language: "en",
      notifications: true,
    },
  };
}

// Transform posts for the dashboard
function formatPosts(posts: Post[]) {
  const grouped = groupBy(posts, (post) => post.status);

  return {
    published: grouped["published"] ?? [],
    draft: grouped["draft"] ?? [],
    total: posts.length,
  };
}
```

### Step 4: Compose everything together

Now combine all pieces into a single, composable pipeline:

```typescript
// src/lib/api.ts (continued)
type DashboardData = {
  user: ReturnType<typeof formatUser>;
  posts: ReturnType<typeof formatPosts>;
  stats: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
};

function loadDashboard(userId: string): ResultAsync<DashboardData, string> {
  return safeFetch(`/api/dashboard/${userId}`)
    .andThen((response) => {
      if (!response.ok) {
        return errAsync(`HTTP error: ${response.status}`);
      }
      return okAsync(response);
    })
    .andThen((response) => safeJson<unknown>(response))
    .andThen((data) => {
      const result = parse(DashboardSchema, data);

      if (!result.success) {
        return errAsync(`Invalid data: ${result.error}`);
      }

      return okAsync(result.data);
    })
    .map((data) => ({
      user: formatUser(data.user),
      posts: formatPosts(data.posts),
      stats: data.stats,
    }));
}
```

### Step 5: Use it in your app

With the pipeline in place, consuming the result in a component is straightforward: pattern match on success or error and render accordingly:

```typescript
// src/components/Dashboard.tsx
async function initDashboard() {
  const result = await loadDashboard("user-123");

  if (result.isErr()) {
    // Handle error - show message, retry, fallback...
    showError(result.error);
    return;
  }

  // TypeScript knows result.value is DashboardData
  const { user, posts, stats } = result.value;

  renderHeader(user.fullName, user.role);
  renderPostsList(posts.published);
  renderDraftsBadge(posts.draft.length);
  renderStats(stats);
}
```

---

## Live Demo

<DashboardPlayground />

:::info
The demo above is more complete than the code snippets: it's embedded in a React project and includes the user interface.

The complete source code is available on [GitHub](https://github.com/mopi1402/pithos/tree/main/packages/pithos/examples/practical-example).
:::

--- 

## What you've achieved

With minimal code, you have:

✅ **Type-safe API calls** - No more `any` from `response.json()`

✅ **Validated data** - Kanon ensures the API response matches your schema

✅ **Graceful error handling** - Every failure point is captured and typed

✅ **Clean transformations** - Arkhe utilities make data shaping readable

✅ **Composable pipeline** - Easy to add caching, retries, or logging

---

## Compare to traditional code

Without Pithos, this would typically involve:

```typescript
// ❌ The traditional way
async function loadDashboard(userId: string) {
  try {
    const response = await fetch(`/api/dashboard/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json(); // any 😱

    // Manual validation...
    if (!data.user || !data.posts) {
      throw new Error("Invalid data");
    }

    // Manual transformation...
    return {
      user: {
        fullName: data.user.firstName + " " + data.user.lastName,
        // ... more manual work
      },
      // ... more manual work
    };
  } catch (error) {
    console.error(error); // Now what?
    return null; // Caller has to check for null everywhere
  }
}
```

--- 

## Next steps

Now that you've seen how modules work together:

- Explore [Arkhe utilities](/api/arkhe) for more data manipulation
- Learn about [Kanon schemas](/api/kanon) for complex validation
- Master [Zygos patterns](/api/zygos) for advanced error handling
- Browse [Use Cases](/use-cases) for specific problems you're solving
