Converts the first character to uppercase and the rest to lowercase.
```mermaid
flowchart LR
    A["'hELLO'"] --> B["capitalize(_)"]
    B --> C["'Hello'"]
```

### Examples

| Input | Output |
|-------|--------|
| `hello` | `Hello` |
| `HELLO` | `Hello` |
| `été` | `Été` |
| `москва` | `Москва` |

### Unicode Support

```mermaid
flowchart LR
    A["'été'"] --> B["capitalize"]
    B --> C["'É' + 'té'"]
    C --> D["'Été'"]
```

Supports Unicode characters (accents, Cyrillic, etc.).
