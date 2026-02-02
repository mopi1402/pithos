Type guard that checks if a value is a number (excluding NaN).

```mermaid
flowchart LR
    A["isNumber(value)"] --> B{"typeof value === 'number'<br/>AND !isNaN(value)?"}
    B -->|"✅"| C["value is number"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isNumber(value))"
        B["value: number"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `123` | ✅ true |
| `0` | ✅ true |
| `-1.5` | ✅ true |
| `Infinity` | ✅ true |
| `NaN` | ❌ false |
| `'123'` | ❌ false |
| `new Number(123)` | ❌ false (boxed) |

### Note

Unlike `typeof x === 'number'`, this guard excludes `NaN` for safer number handling.
