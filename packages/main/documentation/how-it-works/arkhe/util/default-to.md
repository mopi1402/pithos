Returns the value if valid, otherwise returns the default value.
Unlike `??`, also handles NaN.
```mermaid
flowchart LR
    A["defaultTo(value, default)"] --> B{"null/undefined/NaN?"}
    B -->|"yes"| C["default"]
    B -->|"no"| D["value"]
```

### Comparison with `??`

| Value | `??` | `defaultTo` |
|-------|------|-------------|
| `1` | `1` | `1` |
| `null` | default | default |
| `undefined` | default | default |
| `NaN` | `NaN` ❌ | default ✅ |

### NaN Handling

```mermaid
flowchart LR
    A["NaN ?? 10"] --> B["NaN ❌"]
    C["defaultTo(NaN, 10)"] --> D["10 ✅"]
```

### Use Case

```mermaid
flowchart LR
    A["parseFloat('invalid')"] --> B["NaN"]
    B --> C["defaultTo(_, 0)"]
    C --> D["0 ✅"]
```
