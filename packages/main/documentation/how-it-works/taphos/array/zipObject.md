Creates an object from arrays of keys and values.

```mermaid
flowchart LR
    A["zipObject(keys, values)"] --> B["Iterate keys"]
    B --> C["result[key] = values[i]"]
    C --> D["Record<K, V>"]
```

### Processing Flow

```mermaid
flowchart TD
    A["keys: ['a', 'b']"] --> C["Loop with index"]
    B["values: [1, 2]"] --> C
    C --> D["result['a'] = 1"]
    D --> E["result['b'] = 2"]
    E --> F["{a: 1, b: 2}"]
```

### Common Inputs

| Keys | Values | Result |
|------|--------|--------|
| `['a', 'b']` | `[1, 2]` | `{a: 1, b: 2}` |
| `['x', 'y', 'z']` | `[10, 20]` | `{x: 10, y: 20, z: undefined}` |

> ⚠️ **Deprecated**: Use `Object.fromEntries()` with `map()` or `zip()`.
