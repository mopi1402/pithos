Checks if key exists as direct or inherited property.

```mermaid
flowchart LR
    A["hasIn(object, key)"] --> B{"object != null?"}
    B -->|"✅"| C["key in object"]
    B -->|"❌"| D["false"]
```

### Inheritance Check

```mermaid
flowchart TD
    A["{a: 1}"] --> B["hasIn(obj, 'a')"]
    B --> C["✅ true (own)"]
    A --> D["hasIn(obj, 'toString')"]
    D --> E["✅ true (inherited)"]
```

### Common Checks

| Object | Key | Result |
|--------|-----|--------|
| `{a: 1}` | `'a'` | ✅ true |
| `{a: 1}` | `'toString'` | ✅ true (inherited) |
| `{a: 1}` | `'b'` | ❌ false |
| `null` | `'a'` | ❌ false |

> ⚠️ **Deprecated**: Use the `in` operator directly.
