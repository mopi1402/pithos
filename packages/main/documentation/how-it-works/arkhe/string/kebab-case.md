Converts a string to kebab-case format.
All lowercase, words separated by hyphens.
```mermaid
flowchart LR
    A["'backgroundColor'"] --> B["kebabCase(_)"]
    B --> C["'background-color'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `backgroundColor` | `background-color` |
| `XMLHttpRequest` | `xml-http-request` |
| `hello world` | `hello-world` |
| `foo_bar` | `foo-bar` |

### Process

```mermaid
flowchart LR
    A["Input: 'backgroundColor'"] --> B["Split on case boundaries"]
    B --> C["['background', 'Color']"]
    C --> D["Lowercase all"]
    D --> E["['background', 'color']"]
    E --> F["Join with '-'"]
    F --> G["'background-color'"]
```
