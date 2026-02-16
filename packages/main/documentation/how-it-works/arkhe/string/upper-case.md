Converts string to space-separated uppercase words.
Splits on case boundaries, underscores, hyphens, and emojis. Supports Unicode.
```mermaid
flowchart LR
    A["'fooBar'"] --> B["upperCase(_)"]
    B --> C["'FOO BAR'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `'--Foo-Bar--'` | `'FOO BAR'` |
| `'fooBar'` | `'FOO BAR'` |
| `'__foo_bar__'` | `'FOO BAR'` |

### Process

```mermaid
flowchart LR
    A["Input string"] --> B["Split uppercase groups"]
    B --> C["Replace _/- with spaces"]
    C --> D["Separate emojis"]
    D --> E["Normalize spaces"]
    E --> F["trim + toUpperCase"]
```
