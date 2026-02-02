Converts a string to CONSTANT_CASE format.
All uppercase, words separated by underscores.
```mermaid
flowchart LR
    A["'helloWorld'"] --> B["constantCase(_)"]
    B --> C["'HELLO_WORLD'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `helloWorld` | `HELLO_WORLD` |
| `background-color` | `BACKGROUND_COLOR` |
| `foo bar` | `FOO_BAR` |
| `parseHTMLString` | `PARSE_HTML_STRING` |

### Use Case: Environment Variables

```mermaid
flowchart LR
    A["config.apiKey"] --> B["constantCase"]
    B --> C["CONFIG_API_KEY"]
```
