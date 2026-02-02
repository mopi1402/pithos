Converts HTML entities back to their corresponding characters.
Inverse of `escape`.
```mermaid
flowchart LR
    A["'&lt;div&gt;'"] --> B["unescape(_)"]
    B --> C["'<div>'"]
```

### Entity Mapping

| Entity | Character |
|--------|-----------|
| `&amp;` | `&` |
| `&lt;` | `<` |
| `&gt;` | `>` |
| `&quot;` | `"` |
| `&#39;` | `'` |

### Use Case

```mermaid
flowchart LR
    A["API response with entities"] --> B["unescape"]
    B --> C["Display text"]
```
