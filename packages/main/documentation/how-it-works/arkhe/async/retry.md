Retries a failed async function with configurable backoff and jitter.
Exponential backoff increases delay between attempts — jitter adds randomness to prevent thundering herd.
```mermaid
sequenceDiagram
    participant R as retry
    participant F as fn()
    
    R->>F: attempt 1
    F-->>R: ❌ error
    Note right of R: ⏳ delay (1000ms)
    R->>F: attempt 2
    F-->>R: ❌ error
    Note right of R: ⏳ delay × backoff (2000ms)
    R->>F: attempt 3
    F-->>R: ✅ success
```

### Exponential Backoff

```mermaid
flowchart LR
    A["❌ Attempt 1"] -->|"1000ms"| B["❌ Attempt 2"]
    B -->|"2000ms"| C["❌ Attempt 3"]
    C -->|"4000ms"| D["✅ Attempt 4"]
```

### Jitter Visualization

Jitter adds randomness to delay to avoid synchronized retries:
```mermaid
flowchart LR
    subgraph "Without Jitter"
        A1["Server 1: 1000ms"] --> B1["1000ms"] --> C1["1000ms"]
        A2["Server 2: 1000ms"] --> B2["1000ms"] --> C2["1000ms"]
    end
```

```mermaid
flowchart LR
    subgraph "With Jitter (0.5)"
        A3["Server 1: 1200ms"] --> B3["1800ms"] --> C3["2100ms"]
        A4["Server 2: 900ms"] --> B4["2200ms"] --> C4["1950ms"]
    end
```

### Until (Error Filter)

The `until` option aborts retry if error is permanent:
```mermaid
flowchart LR
    A["❌ TEMPORARY_ERROR"] -->|"retry"| B["❌ PERMANENT_ERROR"]
    B -->|"until returns false"| C["⛔ abort, throw"]
```
