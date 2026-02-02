Escapes RegExp special characters in a string.
Makes user input safe for use in regex patterns.
```mermaid
flowchart LR
    A["'$100.00'"] --> B["escapeRegExp(_)"]
    B --> C["'\\$100\\.00'"]
```

### Escaped Characters

```
^ $ \ . * + ? ( ) [ ] { } |
```

### Use Case: Safe Pattern

```mermaid
flowchart LR
    A["userInput: 'hello.*world'"] --> B["escapeRegExp"]
    B --> C["'hello\\.\\*world'"]
    C --> D["new RegExp(_)"]
    D --> E["Matches literal 'hello.*world'"]
```

### Without Escaping

```mermaid
flowchart LR
    A["'hello.*world'"] --> B["new RegExp(_)"]
    B --> C["Matches 'helloXXXworld' ❌"]
```

Without escaping, `.` matches any character and `*` is a quantifier.
