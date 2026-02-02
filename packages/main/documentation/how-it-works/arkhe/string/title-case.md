Converts a string to Title Case.
First letter of each word capitalized.
```mermaid
flowchart LR
    A["'hello world'"] --> B["titleCase(_)"]
    B --> C["'Hello World'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `hello world` | `Hello World` |
| `hello-world` | `Hello-World` |
| `HELLO WORLD` | `Hello World` |
| `café résumé` | `Café Résumé` |

### Process

```mermaid
flowchart LR
    A["'HELLO WORLD'"] --> B["lowercase all"]
    B --> C["'hello world'"]
    C --> D["capitalize after space/-/_"]
    D --> E["'Hello World'"]
```

Supports Unicode characters (accents, etc.).
