Converts a string to camelCase format.
First word lowercase, subsequent words capitalized, no separators.
```mermaid
flowchart LR
    A["'background-color'"] --> B["camelCase(_)"]
    B --> C["'backgroundColor'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `background-color` | `backgroundColor` |
| `font_size` | `fontSize` |
| `Hello World` | `helloWorld` |
| `PascalCase` | `pascalCase` |
| `HTTPRequest` | `httpRequest` |

### Process

```mermaid
flowchart LR
    A["Input: 'Hello-World'"] --> B["Split on separators"]
    B --> C["['Hello', 'World']"]
    C --> D["Lowercase first word"]
    D --> E["'hello'"]
    C --> F["Capitalize rest"]
    F --> G["'World'"]
    E --> H["Join"]
    G --> H
    H --> I["'helloWorld'"]
```
