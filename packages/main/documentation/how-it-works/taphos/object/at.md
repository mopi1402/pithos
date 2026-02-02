Creates an array of values at specified paths.

```mermaid
flowchart LR
    A["at(object, paths)"] --> B["paths.map()"]
    B --> C["get(object, path)"]
    C --> D["unknown[]"]
```

### Processing Flow

```mermaid
flowchart TD
    A["{a: [{b: {c: 3}}, 4]}"] --> B["at(obj, ['a[0].b.c', 'a[1]'])"]
    B --> C["get(obj, 'a[0].b.c') → 3"]
    C --> D["get(obj, 'a[1]') → 4"]
    D --> E["[3, 4]"]
```

### Common Inputs

| Object | Paths | Result |
|--------|-------|--------|
| `{a: [{b: {c: 3}}, 4]}` | `['a[0].b.c', 'a[1]']` | `[3, 4]` |
| `{x: 1, y: 2}` | `['x', 'y', 'z']` | `[1, 2, undefined]` |

> ⚠️ **Deprecated**: Use `paths.map(p => get(obj, p))` directly.
