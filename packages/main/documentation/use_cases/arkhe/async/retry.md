## `retry` ⭐

### **Handle** network failures gracefully 📍

@keywords: handle, network, failures, retry, backoff, resilience

Implement robust retry logic for network operations with exponential backoff.
Essential for handling transient network issues and improving reliability.

```typescript
// Retry API calls with exponential backoff
const userData = await retry(
  async () => {
    const response = await fetch("/api/users/123");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },
  {
    attempts: 5,
    delay: 1000,
    backoff: 2,
    maxDelay: 10000,
    until: (error) => error.message.includes("HTTP 5"),
  }
);

console.log("User data loaded:", userData);
```

### **Recover** from temporary service unavailability

@keywords: recover, temporary, outages, resilience, retry, availability

Handle temporary service outages with intelligent retry mechanisms.
Critical for maintaining service availability and user experience.

```typescript
// Retry database operations
const result = await retry(
  async () => {
    return await database.query("SELECT * FROM users WHERE active = ?", [true]);
  },
  {
    attempts: 3,
    delay: 500,
    backoff: 1.5,
    until: (error) => error.code === "CONNECTION_TIMEOUT",
  }
);

console.log(`Found ${result.length} active users`);
```

### **Implement** file upload resilience

@keywords: implement, upload, files, resilience, retry, network

Retry file uploads with progressive delays for better success rates.
Essential for handling large file uploads and network instability.

```typescript
// Retry file upload with custom error handling
const uploadResult = await retry(
  async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  },
  {
    attempts: 4,
    delay: 2000,
    backoff: 2,
    until: (error) => error.message.includes("Upload failed"),
  }
);

console.log("File uploaded successfully:", uploadResult);
```

### **Manage** rate-limited API calls

@keywords: manage, rate-limiting, throttle, backoff, API, retry

Handle API rate limiting with intelligent retry strategies.
Critical for working with external APIs that have rate limits.

```typescript
// Retry with rate limit handling
const apiData = await retry(
  async () => {
    const response = await fetch("/external-api/data");

    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }

    return response.json();
  },
  {
    attempts: 3,
    delay: 5000, // Wait 5 seconds for rate limit reset
    backoff: 1,
    until: (error) => error.message === "RATE_LIMITED",
  }
);

console.log("API data retrieved:", apiData);
```

### **Ensure** critical operations succeed

@keywords: ensure, critical, operations, reliability, payments, transactions

Guarantee execution of critical operations with comprehensive retry logic.
Essential for payment processing, data synchronization, and critical business operations.

```typescript
// Retry critical payment processing
const paymentResult = await retry(
  async () => {
    return await processPayment({
      amount: 100.0,
      currency: "USD",
      paymentMethod: "card",
    });
  },
  {
    attempts: 5,
    delay: 1000,
    backoff: 2,
    maxDelay: 30000,
    until: (error) => error.code !== "INVALID_CARD",
  }
);

console.log("Payment processed:", paymentResult);
```


### **Multi-gateway payment failover** for financial systems

@keywords: payment, gateway, failover, financial, banking, transaction, resilience

Retry payment processing across multiple gateways for maximum success rate.
Critical for fintech applications and e-commerce platforms handling payments.

```typescript
const gateways = ["stripe", "paypal", "adyen"];
let currentGatewayIndex = 0;

const processPaymentWithFailover = await retry(
  async () => {
    const gateway = gateways[currentGatewayIndex];
    
    const result = await paymentAPI.process({
      gateway,
      amount: 150.00,
      currency: "EUR",
      cardToken: encryptedToken,
    });

    if (!result.success && result.error === "GATEWAY_UNAVAILABLE") {
      currentGatewayIndex = (currentGatewayIndex + 1) % gateways.length;
      throw new Error("GATEWAY_DOWN");
    }

    return result;
  },
  {
    attempts: gateways.length * 2,
    delay: 500,
    backoff: 1.5,
    until: (error) => error.message === "GATEWAY_DOWN",
  }
);

console.log("Payment completed via:", gateways[currentGatewayIndex]);
```

