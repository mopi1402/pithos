## `once` ⭐

### **Initialize resources** only once 📍

@keywords: initialize, once, singleton, setup, resources, idempotent

Ensure initialization code runs only once to prevent duplicate setup.
Essential for resource management and preventing initialization errors.

```typescript
const initApp = once(() => {
  console.log("App initialized");
  // ... setup code
});

initApp(); // "App initialized"
initApp(); // (ignored)
```

### **Create singletons** safely

@keywords: singleton, pattern, instance, state, management, unique

Ensure singleton instances are created only once.
Essential for state management and ensuring single instance patterns.

```typescript
const getDb = once(() => new DatabaseConnection());
const db1 = getDb();
const db2 = getDb(); 

console.log(db1 === db2); // true
```

### **Lazy-initialize** an SDK or API client

@keywords: lazy, initialize, SDK, client, Stripe, Firebase, Analytics, singleton, setup

Initialize a third-party SDK on first use instead of at app startup.
The standard pattern for Stripe, Firebase, Analytics, or any heavy client library.

```typescript
const getStripe = once(() => {
  return loadStripe(process.env.STRIPE_PUBLIC_KEY);
});

const getAnalytics = once(() => {
  return initializeAnalytics({ trackingId: "UA-XXXXX" });
});

// Called from multiple components — SDK loads only on first call
async function handleCheckout() {
  const stripe = await getStripe();
  stripe.redirectToCheckout({ sessionId });
}
```
