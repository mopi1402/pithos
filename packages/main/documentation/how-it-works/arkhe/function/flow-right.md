Composes functions right-to-left (mathematical composition).
Also known as `compose` — the rightmost function executes first.

```mermaid
flowchart RL
    E["900"] --> D["square"]
    D --> C["30"] --> B["× 2"]
    B --> A["15"] --> F["+ 10"]
    F --> G["5"]
```

### Step-by-Step

```mermaid
flowchart LR
    I["Input: 5"] --> F1["add10(5) → 15"]
    F1 --> F2["double(15) → 30"]
    F2 --> F3["square(30) → 900"]
    F3 --> R["Result: 900"]
```

### flowRight vs pipe

| | flowRight | pipe |
|--|-----------|------|
| **Direction** | Right → Left | Left → Right |
| **Math notation** | f(g(h(x))) | h then g then f |
| **First executed** | Last argument | First function |

```mermaid
flowchart LR
    P1["5"] --> P2["a"] --> P3["b"] --> P4["c"]
```

```mermaid
flowchart RL
    F1["c"] --> F2["b"] --> F3["a"] --> F4["5"]
```
