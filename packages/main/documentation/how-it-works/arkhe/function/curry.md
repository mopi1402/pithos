Transforms a function to accept arguments one at a time (or in groups).
Returns a new function for each argument until all are provided, then executes.
```mermaid
sequenceDiagram
    participant C as Caller
    participant Curry as curry(add)
    
    C->>Curry: curriedAdd(1)
    Note right of Curry: args: [1], need: 3
    Curry-->>C: function
    C->>Curry: (2)
    Note right of Curry: args: [1,2], need: 3
    Curry-->>C: function
    C->>Curry: (3)
    Note right of Curry: args: [1,2,3] ✅
    Curry-->>C: 6 (result)
```

### Multiple Call Styles

```mermaid
flowchart LR
    A["curry(add3)"] --> B["curriedAdd"]
    B --> C1["(1)(2)(3) → 6"]
    B --> C2["(1, 2)(3) → 6"]
    B --> C3["(1)(2, 3) → 6"]
    B --> C4["(1, 2, 3) → 6"]
```

### Partial Application

```mermaid
flowchart LR
    A["curriedAdd(10)"] --> B["add10"]
    B --> C["add10(5)"] --> D["add10_5"]
    D --> E["add10_5(3)"] --> F["18"]
```
