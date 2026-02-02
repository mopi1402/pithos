Converts any value to a number with fallback handling.
```mermaid
flowchart LR
    A["toNumber(value)"] --> B{"type?"}
    B -->|"string"| C["Number(value)"]
    B -->|"boolean"| D["true→1, false→0"]
    B -->|"null/undefined"| E["default (0)"]
    B -->|"symbol"| F["default (0)"]
    B -->|"number"| G["value"]
    B -->|"bigint"| H["Number(value)"]
    C --> I{"NaN?"}
    I -->|"yes"| J["default"]
    I -->|"no"| K["result"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `'42'` | `42` |
| `'3.14'` | `3.14` |
| `'invalid'` | `0` (default) |
| `true` | `1` |
| `false` | `0` |
| `null` | `0` (default) |
| `10n` | `10` |

### Custom Default

```mermaid
flowchart LR
    A["toNumber('invalid', 10)"] --> B{"NaN?"}
    B -->|"yes"| C["10 (custom default)"]
```
