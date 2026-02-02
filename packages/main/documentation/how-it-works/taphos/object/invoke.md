Invokes method at path with given arguments.

```mermaid
flowchart LR
    A["invoke(object, path, args)"] --> B["get(object, path)"]
    B --> C{"is function?"}
    C -->|"✅"| D["method(...args)"]
    C -->|"❌"| E["undefined"]
```

### Processing Flow

```mermaid
flowchart TD
    A["{a: {b: {greet: fn}}}"] --> B["invoke(obj, 'a.b.greet', ['World'])"]
    B --> C["get → greet function"]
    C --> D["greet('World')"]
    D --> E["'Hello, World!'"]
```

### Common Inputs

| Object | Path | Args | Result |
|--------|------|------|--------|
| `{greet: n => 'Hi ' + n}` | `'greet'` | `['Bob']` | `'Hi Bob'` |
| `{a: 1}` | `'a'` | `[]` | `undefined` |

> ⚠️ **Deprecated**: Use `get(obj, path)?.(...args)` or optional chaining.
