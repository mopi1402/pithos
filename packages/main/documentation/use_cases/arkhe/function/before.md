## `before`

### **Limited Retries** for operations 📍

@keywords: retry, limit, attempts, operations, resilience

Limit the number of retry attempts for operations.
Essential for resilient error handling.

```typescript
import { before } from "@pithos/core/arkhe/function/before";

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
import { before } from "@pithos/core/arkhe/function/before";

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

@keywords: rate limit, user actions, clicks, interactions, throttle, performance

Limit how many times a user action can trigger.
Important for preventing spam clicks.

```typescript
import { before } from "@pithos/core/arkhe/function/before";

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

### **Limit** stepper "next" clicks during async validation

@keywords: stepper, next, limit, validation, async, design system

Prevent rapid "Next" clicks in a stepper while async validation is running.
Essential for multi-step forms with server-side validation between steps.

```typescript
const validateAndProceed = before(async (stepIndex: number) => {
  const isValid = await validateStep(stepIndex);
  if (isValid) {
    goToStep(stepIndex + 1);
  }
  return isValid;
}, 2); // Only allow 1 click (before 2nd call)

nextButton.addEventListener("click", () => {
  validateAndProceed(currentStep);
});

// Reset when step changes
const onStepChange = () => {
  // Re-create the limited function for the new step
};
```

### **Limit** tooltip show attempts during rapid hover

@keywords: tooltip, hover, rapid, limit, design system, performance

Prevent tooltip from re-triggering more than N times during rapid mouse movements.
Essential for performance in dense UI layouts with many hoverable elements.

```typescript
const showTooltip = before((target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + 8}px`;
  tooltip.style.left = `${rect.left}px`;
  tooltip.textContent = target.dataset.tooltip ?? "";
  tooltip.hidden = false;
}, 3); // Max 3 tooltip shows before requiring a reset

// Reset on mouse leave
element.addEventListener("mouseleave", () => {
  tooltip.hidden = true;
  showTooltip = before(showTooltipFn, 3); // Reset counter
});
```
