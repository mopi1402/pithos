## `omitBy`

### **Remove Null/Undefined Values** from objects 📍

@keywords: omit, filter, null, undefined, cleanup

Remove null and undefined values from objects.
Essential for cleaning data before API calls.

```typescript
import { omitBy } from "pithos/arkhe/object/omit-by";

const formData = {
  name: "John",
  email: "john@example.com",
  phone: null,
  address: undefined,
  age: 0,
  bio: "",
};

// Remove null and undefined values
const cleanData = omitBy(formData, (value) => value === null || value === undefined);
console.log(cleanData);
// { name: "John", email: "john@example.com", age: 0, bio: "" }

// Note: 0 and "" are preserved (only null/undefined removed)
```

### **Filter Sensitive Data** before logging 📍

@keywords: sensitive, data, filter, logging, security

Remove sensitive fields from objects before logging.
Critical for security compliance.

```typescript
import { omitBy } from "pithos/arkhe/object/omit-by";

const sensitiveKeys = new Set(["password", "token", "secret", "apiKey", "creditCard"]);

function sanitizeForLogging(data: Record<string, unknown>) {
  return omitBy(data, (_, key) => sensitiveKeys.has(key));
}

const userData = {
  id: "123",
  email: "user@example.com",
  password: "secret123",
  token: "jwt-token-here",
  preferences: { theme: "dark" },
};

console.log("User action:", sanitizeForLogging(userData));
// { id: "123", email: "user@example.com", preferences: { theme: "dark" } }
```

### **Remove Empty Values** for query parameters

@keywords: empty, values, query, parameters, URL

Filter out empty values when building query strings.
Important for clean API requests.

```typescript
import { omitBy } from "pithos/arkhe/object/omit-by";

function buildQueryString(params: Record<string, unknown>): string {
  // Remove empty values
  const cleanParams = omitBy(
    params,
    (value) => value === null || value === undefined || value === ""
  );

  return new URLSearchParams(
    Object.entries(cleanParams).map(([k, v]) => [k, String(v)])
  ).toString();
}

const searchParams = {
  query: "typescript",
  page: 1,
  limit: 10,
  category: "",
  author: null,
  sortBy: undefined,
};

const queryString = buildQueryString(searchParams);
console.log(queryString); // "query=typescript&page=1&limit=10"
```
