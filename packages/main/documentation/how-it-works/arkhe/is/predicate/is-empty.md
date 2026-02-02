Checks if a value is empty (arrays, objects, strings, Map, Set).
```mermaid
flowchart LR
    A["isEmpty(value)"] --> B{"type?"}
    B -->|"null/undefined"| C["true"]
    B -->|"array/string"| D{"length === 0?"}
    B -->|"Map/Set"| E{"size === 0?"}
    B -->|"object"| F{"Object.keys().length === 0?"}
    B -->|"primitive"| G["true"]
    D --> H["true/false"]
    E --> H
    F --> H
```

### Examples

| Value | Result |
|-------|--------|
| `[]` | ✅ true |
| `[1, 2]` | ❌ false |
| `{}` | ✅ true |
| `{ a: 1 }` | ❌ false |
| `''` | ✅ true |
| `'abc'` | ❌ false |
| `new Map()` | ✅ true |
| `new Set([1])` | ❌ false |
| `null` | ✅ true |
| `42` | ✅ true (primitives are "empty") |

### Use Case: Form Validation

```mermaid
flowchart LR
    A["formData"] --> B{"isEmpty?"}
    B -->|"✅"| C["show required error"]
    B -->|"❌"| D["proceed"]
```
