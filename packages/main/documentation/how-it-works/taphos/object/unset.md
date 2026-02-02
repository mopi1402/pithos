Removes property at path, returning new object (immutable).

```mermaid
flowchart LR
    A["unset(object, path)"] --> B["Clone object"]
    B --> C["Navigate to parent"]
    C --> D["delete property"]
    D --> E["new object"]
```

### Processing Flow

```mermaid
flowchart TD
    A["{a: {b: {c: 3}}}"] --> B["unset(obj, 'a.b.c')"]
    B --> C["structuredClone"]
    C --> D["Navigate to a.b"]
    D --> E["delete c"]
    E --> F["{a: {b: {}}}"]
```

### Common Inputs

| Object | Path | Result |
|--------|------|--------|
| `{a: {b: {c: 3}}}` | `'a.b.c'` | `{a: {b: {}}}` |
| `{x: 1, y: 2}` | `'x'` | `{y: 2}` |

> ⚠️ **Deprecated**: Use destructuring or `omit` for immutable removal.
