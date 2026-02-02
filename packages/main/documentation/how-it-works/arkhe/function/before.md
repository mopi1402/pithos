Creates a function that invokes at most `n-1` times.
After `n-1` invocations, subsequent calls return the last result.
```mermaid
sequenceDiagram
    participant C as Caller
    participant B as before(fn, 3)
    participant F as fn()
    
    C->>B: call 1
    Note right of B: count: 1 < 3
    B->>F: execute
    F-->>B: result 1
    B-->>C: result 1
    C->>B: call 2
    Note right of B: count: 2 < 3
    B->>F: execute
    F-->>B: result 2
    B-->>C: result 2
    C->>B: call 3
    Note right of B: count: 3 ≥ 3 🔒
    B-->>C: result 2 (cached)
    C->>B: call 4
    B-->>C: result 2 (cached)
```

### before vs after

| | before(fn, 3) | after(fn, 3) |
|--|---------------|--------------|
| **Call 1** | ✅ executes | ❌ skips |
| **Call 2** | ✅ executes | ❌ skips |
| **Call 3+** | 🔒 cached | ✅ executes |
