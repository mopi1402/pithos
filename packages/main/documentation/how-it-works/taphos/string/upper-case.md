Converts string to space-separated uppercase words.
**Deprecated**: Use words + join manually.
```mermaid
flowchart LR
    A["'foo bar'"] --> B["upperCase(_)"]
    B --> C["'FOO BAR'"]
```

### Native Equivalent

```typescript
// ❌ upperCase(str)
// ✅ str.toUpperCase().replace(/[_-]+/g, ' ')
```
