Wraps an async function with error handling and optional fallback.
On success, returns the result. On error, returns the fallback value (or `undefined` if none provided).
```mermaid
flowchart LR
    subgraph Success
        A1["guard(fn)"] --> B1["✅ fn()"]
        B1 --> C1["result"]
    end
```

```mermaid
flowchart LR
    subgraph "Error with Fallback"
        A2["guard(fn, fallback)"] --> B2["❌ fn() throws"]
        B2 --> C2["fallback"]
    end
```

```mermaid
flowchart LR
    subgraph "Error without Fallback"
        A3["guard(fn)"] --> B3["❌ fn() throws"]
        B3 --> C3["undefined"]
    end
```

### Fallback Function

The fallback can be a function that receives the error:
```mermaid
sequenceDiagram
    participant G as guard
    participant F as fn()
    participant FB as fallback(error)
    
    G->>F: execute
    F-->>G: ❌ Error
    G->>FB: fallback(error)
    FB-->>G: ✅ fallback result
```
