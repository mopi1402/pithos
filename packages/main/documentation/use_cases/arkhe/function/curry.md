## `curry`

### **Partial Application** for reusable functions 📍

@keywords: curry, partial application, reusable, functional programming, composition

Create reusable partially applied functions.
Essential for functional programming patterns.

```typescript
import { curry } from "pithos/arkhe/function/curry";

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// Apply arguments one at a time
const add5 = curriedAdd(5);
const add5and10 = add5(10);
console.log(add5and10(3)); // 18

// Or apply multiple arguments at once
console.log(curriedAdd(1, 2, 3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

### **Event Handlers** with pre-configured context 📍

@keywords: event handlers, context, configuration, UI, callbacks

Create event handlers with pre-configured parameters.
Critical for UI component callbacks.

```typescript
import { curry } from "pithos/arkhe/function/curry";

const handleClick = (action: string, category: string, event: MouseEvent) => {
  analytics.track({ action, category, x: event.clientX, y: event.clientY });
};

const curriedHandler = curry(handleClick);

// Pre-configure handlers for different buttons
const handleNavClick = curriedHandler("click", "navigation");
const handleFormClick = curriedHandler("click", "form");

// Use in components
navButton.addEventListener("click", handleNavClick);
submitButton.addEventListener("click", handleFormClick);
```

### **API Request** builders

@keywords: API, request, builder, fetch, configuration

Build configurable API request functions.
Important for consistent API interactions.

```typescript
import { curry } from "pithos/arkhe/function/curry";

const fetchResource = async (
  baseUrl: string,
  headers: Record<string, string>,
  endpoint: string
) => {
  const response = await fetch(`${baseUrl}${endpoint}`, { headers });
  return response.json();
};

const curriedFetch = curry(fetchResource);

// Create pre-configured fetchers
const apiClient = curriedFetch("https://api.example.com", {
  Authorization: "Bearer token",
  "Content-Type": "application/json",
});

// Use the configured client
const users = await apiClient("/users");
const posts = await apiClient("/posts");
```
