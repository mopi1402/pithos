## `sleep`

### **Delay** async execution 📍

@keywords: delay, async, pause, sleep, throttle, polling

Pause async execution for a specific duration.
Essential for throttling, polling intervals, or simulating latency in tests.
```typescript
await sleep(1000); // Wait 1 second
await fetchData();
```

### **Respect** API rate limits

@keywords: respect, rate-limits, throttle, batch, delays, API

Introduce delays between batch operations to avoid hitting rate limits.
```typescript
for (const item of batch) {
  await sendRequest(item);
  await sleep(100); // 100ms between requests
}
```

### **Simulate** network latency

@keywords: simulate, latency, network, testing, development, delays

Add artificial delays in development/testing environments.
```typescript
if (isDev) {
  await sleep(500); // Simulate slow network
}
return mockData;
```
