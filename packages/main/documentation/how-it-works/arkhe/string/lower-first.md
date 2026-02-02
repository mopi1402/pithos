Converts only the first character to lowercase.
Rest of the string is preserved unchanged.
```mermaid
flowchart LR
    A["'HELLO'"] --> B["lowerFirst(_)"]
    B --> C["'hELLO'"]
```

### Examples

| Input | Output |
|-------|--------|
| `Hello` | `hello` |
| `HELLO` | `hELLO` |
| `Été` | `été` |

### lowerFirst vs capitalize

| Function | `'HELLO'` |
|----------|-----------|
| `lowerFirst` | `hELLO` |
| `capitalize` | `Hello` |

`lowerFirst` only changes the first character.
