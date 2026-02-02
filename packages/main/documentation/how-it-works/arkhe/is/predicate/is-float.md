Checks if a value is a float (finite number with decimal part).
```mermaid
flowchart LR
    A["isFloat(value)"] --> B{"typeof === 'number'?"}
    B -->|"❌"| C["false"]
    B -->|"✅"| D{"Number.isFinite?"}
    D -->|"❌"| E["false"]
    D -->|"✅"| F{"!Number.isInteger?"}
    F -->|"✅"| G["true"]
    F -->|"❌"| H["false"]
```

### Examples

| Value | Result | Reason |
|-------|--------|--------|
| `1.5` | ✅ true | Has decimal |
| `1.0` | ❌ false | No decimal part |
| `1` | ❌ false | Integer |
| `Infinity` | ❌ false | Not finite |
| `-Infinity` | ❌ false | Not finite |
| `NaN` | ❌ false | Not finite |
| `'1.5'` | ❌ false | Not a number |

### Float vs Integer

```mermaid
flowchart LR
    subgraph "isFloat"
        A["1.5 ✅"]
        B["3.14 ✅"]
        C["0.001 ✅"]
    end
    subgraph "!isFloat"
        D["1 ❌"]
        E["1.0 ❌"]
        F["100 ❌"]
    end
```
