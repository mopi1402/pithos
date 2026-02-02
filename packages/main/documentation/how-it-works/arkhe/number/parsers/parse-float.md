Parses a string to a float, returning default if invalid.

```mermaid
flowchart LR
    A["parseFloat(value, defaultValue)"] --> B["Number.parseFloat(value)"]
    B --> C{"isNaN or !isFinite?"}
    C -->|"✅"| D["defaultValue"]
    C -->|"❌"| E["parsed number"]
```

### Validation Flow

```mermaid
flowchart TD
    A["Input string"] --> B["Number.parseFloat()"]
    B --> C{"Result is NaN?"}
    C -->|"✅"| F["Return default"]
    C -->|"❌"| D{"Result is Infinity?"}
    D -->|"✅"| F
    D -->|"❌"| E["Return parsed"]
```

### Common Inputs

| Value | Default | Result |
|-------|---------|--------|
| `'42.99'` | `0` | `42.99` |
| `'invalid'` | `0` | `0` |
| `'Infinity'` | `0` | `0` |
| `'NaN'` | `100` | `100` |
| `'3.14abc'` | `0` | `3.14` |
