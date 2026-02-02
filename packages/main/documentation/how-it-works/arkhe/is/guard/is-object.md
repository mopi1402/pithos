Type guard that checks if a value is an object (not null).

```mermaid
flowchart LR
    A["isObject(value)"] --> B{"typeof value === 'object'<br/>AND value !== null?"}
    B -->|"✅"| C["value is object"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isObject(value))"
        B["value: object"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `{}` | ✅ true |
| `[]` | ✅ true |
| `new Date()` | ✅ true |
| `new Map()` | ✅ true |
| `() => {}` | ❌ false |
| `null` | ❌ false |
| `'string'` | ❌ false |

### vs isPlainObject

```mermaid
flowchart LR
    A["isObject"] --> B["any object (Array, Date, Map...)"]
    C["isPlainObject"] --> D["only {} or Object.create(null)"]
```
