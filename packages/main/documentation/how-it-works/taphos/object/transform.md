Iterates object properties and accumulates a result.

```mermaid
flowchart LR
    A["transform(object, iteratee, acc)"] --> B["Object.keys()"]
    B --> C["iteratee(acc, value, key)"]
    C --> D["accumulator"]
```

### Processing Flow

```mermaid
flowchart TD
    A["{a: 1, b: 2, c: 1}"] --> B["transform(obj, fn, {})"]
    B --> C["fn(acc, 1, 'a')"]
    C --> D["fn(acc, 2, 'b')"]
    D --> E["fn(acc, 1, 'c')"]
    E --> F["{1: ['a','c'], 2: ['b']}"]
```

### Common Inputs

| Object | Iteratee | Initial | Result |
|--------|----------|---------|--------|
| `{a: 1, b: 2}` | `(r,v,k) => r[v] = k` | `{}` | `{1: 'a', 2: 'b'}` |

> ⚠️ **Deprecated**: Use `Object.entries().reduce()` directly.
