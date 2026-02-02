Escapes HTML special characters to their corresponding entities.
Essential for XSS prevention.
```mermaid
flowchart LR
    A["'<div>'"] --> B["escape(_)"]
    B --> C["'&lt;div&gt;'"]
```

### Character Mapping

| Character | Entity |
|-----------|--------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

### XSS Prevention

```mermaid
flowchart LR
    A["'<script>alert(1)</script>'"] --> B["escape"]
    B --> C["'&lt;script&gt;alert(1)&lt;/script&gt;'"]
    C --> D["Safe HTML ✅"]
```

### Roundtrip with unescape

```mermaid
flowchart LR
    A["original"] --> B["escape"]
    B --> C["safe"]
    C --> D["unescape"]
    D --> E["original ✅"]
```
