Truncates string to a maximum length with customizable omission.
```mermaid
flowchart LR
    A["'hi-diddly-ho there, neighborino'"] --> B["truncate(_, {length: 24})"]
    B --> C["'hi-diddly-ho there, n...'"]
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `length` | 30 | Max string length |
| `omission` | `'...'` | Truncation indicator |
| `separator` | — | Break at word boundary |

### Word Boundary

```mermaid
flowchart LR
    A["'hi there neighbor'"] --> B["truncate(_, {separator: ' '})"]
    B --> C["'hi there...'"]
```

Without separator, cuts mid-word. With separator, breaks at last occurrence.

### Custom Omission

```mermaid
flowchart LR
    A["'long text here'"] --> B["truncate(_, {omission: ' [...]'})"]
    B --> C["'long text [...]'"]
```
