Updates value at path using updater function (immutable).

```mermaid
flowchart LR
    A["update(object, path, updater)"] --> B["get(object, path)"]
    B --> C["updater(value)"]
    C --> D["set(object, path, newValue)"]
    D --> E["new object"]
```

### Processing Flow

```mermaid
flowchart TD
    A["{a: {b: {c: 3}}}"] --> B["update(obj, 'a.b.c', n => n * 2)"]
    B --> C["get → 3"]
    C --> D["updater(3) → 6"]
    D --> E["set(obj, 'a.b.c', 6)"]
    E --> F["{a: {b: {c: 6}}}"]
```

### Common Inputs

| Object | Path | Updater | Result |
|--------|------|---------|--------|
| `{a: {b: 3}}` | `'a.b'` | `n => n * 2` | `{a: {b: 6}}` |
| `{count: 0}` | `'count'` | `n => n + 1` | `{count: 1}` |

> ⚠️ **Deprecated**: Use `set(obj, path, fn(get(obj, path)))` directly.
