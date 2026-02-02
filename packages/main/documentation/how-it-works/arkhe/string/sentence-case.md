Converts a string to Sentence case.
First character uppercase, rest lowercase.
```mermaid
flowchart LR
    A["'HELLO WORLD'"] --> B["sentenceCase(_)"]
    B --> C["'Hello world'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `HELLO WORLD` | `Hello world` |
| `hELLO wORLD` | `Hello world` |
| `hello` | `Hello` |

### Process

```mermaid
flowchart LR
    A["Input string"] --> B["Uppercase first char"]
    A --> C["Lowercase rest"]
    B --> D["Concatenate"]
    C --> D
    D --> E["Result"]
```
