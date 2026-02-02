Checks if an object has a property as its own (not inherited).
```mermaid
flowchart LR
    A["has(obj, 'a')"] --> B{"hasOwnProperty?"}
    B -->|"✅ own"| C["true"]
    B -->|"❌ inherited"| D["false"]
```

### Own vs Inherited

```mermaid
flowchart LR
    subgraph "Object"
        A["a: 1 (own) ✅"]
        B["b: undefined (own) ✅"]
        C["toString (inherited) ❌"]
    end
```

### Works with Object.create(null)

```mermaid
flowchart LR
    A["Object.create(null)"] --> B["bare object"]
    B --> C["has(bare, 'x')"]
    C --> D["✅ works"]
```

Unlike `obj.hasOwnProperty()`, `has()` works even when the prototype chain is broken.
