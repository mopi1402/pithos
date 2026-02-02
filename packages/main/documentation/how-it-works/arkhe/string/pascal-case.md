Converts a string to PascalCase format.
Each word capitalized, no separators.
```mermaid
flowchart LR
    A["'hello-world'"] --> B["pascalCase(_)"]
    B --> C["'HelloWorld'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `hello-world` | `HelloWorld` |
| `background_color` | `BackgroundColor` |
| `foo bar` | `FooBar` |
| `helloWorld` | `HelloWorld` |

### Relationship with camelCase

```mermaid
flowchart LR
    A["'hello-world'"] --> B["camelCase"]
    B --> C["'helloWorld'"]
    C --> D["capitalize first"]
    D --> E["'HelloWorld'"]
```

PascalCase = camelCase with first letter uppercase.
