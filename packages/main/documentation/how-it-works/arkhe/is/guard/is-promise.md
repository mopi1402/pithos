Type guard that checks if a value is a Promise.

```mermaid
flowchart LR
    A["isPromise(value)"] --> B{"value instanceof Promise?"}
    B -->|"✅"| C["value is Promise"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isPromise(value))"
        B["value: Promise<unknown>"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `Promise.resolve(1)` | ✅ true |
| `new Promise(() => {})` | ✅ true |
| `async () => {}` | ❌ false (function) |
| `(async () => {})()` | ✅ true (called) |
| `{ then: () => {} }` | ❌ false (thenable) |

### Note

This checks for native Promise instances. Thenables (objects with `.then()`) are not detected.
