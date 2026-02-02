## `findKey`

### **Find User by Property** 📍

@keywords: find, key, object, search, lookup

Find object key based on a value condition.
Essential for reverse lookups in object maps.

```typescript
import { findKey } from "pithos/arkhe/object/find-key";

const users = {
  user_1: { name: "Alice", active: true },
  user_2: { name: "Bob", active: false },
  user_3: { name: "Charlie", active: true },
};

// Find first active user's key
const activeUserKey = findKey(users, (user) => user.active);
console.log(activeUserKey); // "user_1"

// Find user by name
const bobKey = findKey(users, (user) => user.name === "Bob");
console.log(bobKey); // "user_2"
```

### **Reverse Enum Lookup** 📍

@keywords: enum, reverse lookup, mapping, constants, translation

Find enum key from its value.
Critical for translating values back to identifiers.

```typescript
import { findKey } from "pithos/arkhe/object/find-key";

const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

function getStatusName(code: number): string {
  const name = findKey(HttpStatus, (value) => value === code);
  return name ?? "UNKNOWN";
}

console.log(getStatusName(200)); // "OK"
console.log(getStatusName(404)); // "NOT_FOUND"
console.log(getStatusName(999)); // "UNKNOWN"
```

### **Configuration Validation** finding invalid entries

@keywords: configuration, validation, find, settings, errors

Find the first invalid configuration entry.
Important for debugging configuration issues.

```typescript
import { findKey } from "pithos/arkhe/object/find-key";

interface ConfigValue {
  value: unknown;
  required: boolean;
}

const config: Record<string, ConfigValue> = {
  apiKey: { value: "abc123", required: true },
  timeout: { value: null, required: true },
  debug: { value: false, required: false },
  endpoint: { value: "", required: true },
};

// Find first missing required config
const missingKey = findKey(
  config,
  (entry) => entry.required && (entry.value === null || entry.value === "")
);

if (missingKey) {
  throw new Error(`Missing required configuration: ${missingKey}`);
}
// Throws: "Missing required configuration: timeout"
```
