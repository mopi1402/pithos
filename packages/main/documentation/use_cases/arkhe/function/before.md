## `before`

### **Limited Retries** for operations 📍

@keywords: retry, limit, attempts, operations, resilience

Limit the number of retry attempts for operations.
Essential for resilient error handling.

```typescript
import { before } from "pithos/arkhe/function/before";

const attemptConnection = async () => {
  const response = await fetch("/api/health");
  if (!response.ok) throw new Error("Connection failed");
  return response.json();
};

// Allow only 3 attempts (calls on 1st, 2nd, 3rd - returns last result after)
const limitedRetry = before(attemptConnection, 4);

async function connectWithRetry() {
  for (let i = 0; i < 5; i++) {
    try {
      const result = await limitedRetry();
      if (result) return result;
    } catch (e) {
      console.log(`Attempt ${i + 1} failed`);
    }
  }
  throw new Error("All retries exhausted");
}
```

### **One-time Initialization** 📍

@keywords: initialization, setup, one-time, singleton, configuration

Ensure initialization code runs only once.
Critical for singleton patterns and setup.

```typescript
import { before } from "pithos/arkhe/function/before";

const initializeApp = () => {
  console.log("Initializing application...");
  // Heavy setup: load config, connect to DB, etc.
  return { initialized: true, timestamp: Date.now() };
};

// Only actually initialize on first call
const safeInit = before(initializeApp, 2);

// First call initializes
const result1 = safeInit(); // Logs "Initializing application..."
console.log(result1); // { initialized: true, timestamp: ... }

// Subsequent calls return the cached result
const result2 = safeInit(); // No log, returns same result
console.log(result1 === result2); // true (same reference)
```

### **Rate Limited Actions** for user interactions

@keywords: rate limit, user actions, clicks, interactions, throttle

Limit how many times a user action can trigger.
Important for preventing spam clicks.

```typescript
import { before } from "pithos/arkhe/function/before";

const submitForm = (data: FormData) => {
  console.log("Submitting form...");
  return fetch("/api/submit", { method: "POST", body: data });
};

// Allow only 1 submission (before 2nd call)
const limitedSubmit = before(submitForm, 2);

// In form handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // Only first click actually submits
  const result = await limitedSubmit(data);
  if (result) {
    console.log("Form submitted successfully");
  } else {
    console.log("Form already submitted");
  }
});
```
