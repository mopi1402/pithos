Parses a string to an integer with a fallback default value, supporting custom radix.

```mermaid
flowchart LR
    A["parseIntDef(value, default, radix)"] --> B{"value is falsy?"}
    B -->|"✅"| C["defaultValue"]
    B -->|"❌"| D["parseInt(value, radix)"]
    D --> E{"isNaN?"}
    E -->|"✅"| C
    E -->|"❌"| F["parsed integer"]
```

### Validation Flow

```mermaid
flowchart TD
    A["Input"] --> B{"null/undefined/empty?"}
    B -->|"✅"| F["Return default"]
    B -->|"❌"| C["parseInt(value, radix)"]
    C --> D{"Result is NaN?"}
    D -->|"✅"| F
    D -->|"❌"| E["Return parsed"]
```

### Common Inputs

| Value | Default | Radix | Result |
|-------|---------|-------|--------|
| `'42'` | `null` | - | `42` |
| `'invalid'` | `0` | - | `0` |
| `'1010'` | `null` | `2` | `10` |
| `'FF'` | `null` | `16` | `255` |
| `null` | `0` | - | `0` |
