Checks if value is a safe integer (exactly representable in IEEE-754).

```mermaid
flowchart LR
    A["isSafeInteger(value)"] --> B["Number.isSafeInteger(value)"]
    B --> C["boolean"]
```

### Safe Integer Range

```mermaid
flowchart TD
    A["Safe Range"] --> B["-(2^53 - 1) to (2^53 - 1)"]
    B --> C["-9007199254740991"]
    B --> D["9007199254740991"]
```

### Common Checks

| Value | Result |
|-------|--------|
| `42` | ✅ true |
| `9007199254740991` | ✅ true (MAX_SAFE_INTEGER) |
| `9007199254740992` | ❌ false |
| `3.14` | ❌ false |
| `Infinity` | ❌ false |

> ⚠️ **Deprecated**: Use `Number.isSafeInteger()` directly.
