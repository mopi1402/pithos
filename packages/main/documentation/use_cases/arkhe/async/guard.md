## `guard` 💎

> Cleaner than `try/catch`. Safely executes code and provides a fallback value on failure.

### **Protect** optional operations 📍

@keywords: protect, optional, fallback, error-handling, safety, graceful

Safely execute operations that might fail without breaking the application flow.
Essential for optional features and graceful degradation.

```typescript
// Safely load optional user preferences
const preferences = await guard(
  async () => {
    return await fetchUserPreferences(userId);
  },
  {
    theme: "light",
    language: "en",
    notifications: true,
  }
);

console.log("User preferences:", preferences);
```

### **Handle** external service failures

@keywords: handle, external, services, failures, resilience, fallback

Provide fallback behavior when external services are unavailable.
Critical for maintaining application functionality during service outages.

```typescript
// Fallback for external weather service
const weatherData = await guard(
  async () => {
    return await fetchWeatherData(location);
  },
  (error) => {
    console.warn("Weather service unavailable:", error);
    return {
      temperature: "N/A",
      condition: "Unknown",
      lastUpdated: new Date(),
    };
  }
);

console.log("Weather information:", weatherData);
```

### **Manage** feature toggles safely

@keywords: manage, features, toggles, experiments, testing, rollout

Execute feature-specific code with safe fallbacks for disabled features.
Essential for A/B testing and gradual feature rollouts.

```typescript
// Safe execution of experimental features
const analyticsData = await guard(
  async () => {
    if (!isFeatureEnabled("advanced-analytics")) {
      throw new Error("Feature disabled");
    }
    return await collectAdvancedAnalytics();
  },
  () => {
    return await collectBasicAnalytics();
  }
);

console.log("Analytics collected:", analyticsData);
```

### **Implement** graceful error handling

@keywords: implement, graceful, errors, recovery, fallback, resilience

Handle errors gracefully with meaningful fallback values.
Essential for user-facing operations and error recovery.

```typescript
// Safe image loading with fallback
const imageData = await guard(
  async () => {
    return await loadUserAvatar(userId);
  },
  (error) => {
    console.warn("Avatar loading failed:", error);
    return {
      url: "/default-avatar.png",
      alt: "Default Avatar",
      isDefault: true,
    };
  }
);

displayAvatar(imageData);
```

### **Ensure** data consistency

@keywords: ensure, consistency, integrity, reliability, defaults, configuration

Maintain data consistency with fallback values when primary sources fail.
Critical for data integrity and application reliability.

```typescript
// Safe configuration loading
const config = await guard(
  async () => {
    return await loadRemoteConfig();
  },
  (error) => {
    console.error("Remote config failed, using defaults:", error);
    return getDefaultConfig();
  }
);

initializeApp(config);
```

