Creates a new object excluding properties that satisfy a predicate.

```mermaid
flowchart LR
    A["{ a: 1, b: '2', c: 3 }"] --> B["omitBy(_, v => typeof v === 'number')"]
    B --> C["{ b: '2' }"]
```

### Remove Null Values

```mermaid
flowchart LR
    A["{ a: 1, b: null, c: undefined, d: 4 }"] --> B["omitBy(_, v => v == null)"]
    B --> C["{ a: 1, d: 4 }"]
```

### Remove Empty Strings

```mermaid
flowchart LR
    A["{ name: 'John', email: '', phone: '123' }"] --> B["omitBy(_, v => v === '')"]
    B --> C["{ name: 'John', phone: '123' }"]
```

### pickBy vs omitBy

| | pickBy | omitBy |
|--|--------|--------|
| **Keeps if** | predicate = true | predicate = false |
| **Logic** | Whitelist | Blacklist |
