Parses a string to a float with a fallback default value, handling nullish inputs.

```mermaid
flowchart LR
    A["parseFloatDef(value, defaultValue)"] --> B{"value is falsy?"}
    B -->|"✅"| C["defaultValue"]
    B -->|"❌"| D["parseFloat(value, defaultValue)"]
```

### Validation Flow

```mermaid
flowchart TD
    A["Input"] --> B{"null/undefined/empty?"}
    B -->|"✅"| F["Return default"]
    B -->|"❌"| C["parseFloat()"]
    C --> D{"Valid number?"}
    D -->|"✅"| E["Return parsed"]
    D -->|"❌"| F
```

### Common Inputs

| Value | Default | Result |
|-------|---------|--------|
| `'42.99'` | `0` | `42.99` |
| `'invalid'` | `0` | `0` |
| `''` | `10.5` | `10.5` |
| `null` | `1.0` | `1.0` |
| `undefined` | `5` | `5` |
