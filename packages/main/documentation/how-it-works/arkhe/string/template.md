Replaces `{key}` placeholders with values from a data object.
Supports nested paths.
```mermaid
flowchart LR
    A["'Hello {name}'"] --> B["template(_, {name: 'World'})"]
    B --> C["'Hello World'"]
```

### Nested Paths

```mermaid
flowchart LR
    A["'{user.name} <{user.email}>'"]
    B["{ user: { name: 'John', email: '...' } }"]
    A --> C["template"]
    B --> C
    C --> D["'John <john@example.com>'"]
```

### Escape Braces

```mermaid
flowchart LR
    A["'Literal: {{escaped}}'"] --> B["template(_, {})"]
    B --> C["'Literal: {escaped}'"]
```

Use `{{` and `}}` for literal braces.

### Missing Keys

```mermaid
flowchart LR
    A["'{missing}'"] --> B["template(_, {})"]
    B --> C["''"]
```

Missing keys become empty strings.
