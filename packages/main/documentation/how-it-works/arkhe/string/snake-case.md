Converts a string to snake_case format.
All lowercase, words separated by underscores.
```mermaid
flowchart LR
    A["'helloWorld'"] --> B["snakeCase(_)"]
    B --> C["'hello_world'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `helloWorld` | `hello_world` |
| `XMLHttpRequest` | `xml_http_request` |
| `hello-world` | `hello_world` |
| `Hello World` | `hello_world` |

### Process

```mermaid
flowchart LR
    A["Input: 'helloWorld'"] --> B["Split on case boundaries"]
    B --> C["['hello', 'World']"]
    C --> D["Lowercase all"]
    D --> E["['hello', 'world']"]
    E --> F["Join with '_'"]
    F --> G["'hello_world'"]
```
