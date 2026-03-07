## `guard` 💎

> Cleaner than `try/catch`. Safely executes code and provides a fallback value on failure.

### **Protect** optional operations 📍

@keywords: protect, optional, fallback, error-handling, safety, graceful, observability, browser permissions, PWA

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

@keywords: handle, external, services, failures, resilience, fallback, observability, ci/cd

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

@keywords: manage, features, toggles, experiments, testing, rollout, ci/cd

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
  async () => {
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

@keywords: ensure, consistency, integrity, reliability, defaults, configuration, PWA

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


### **Fallback** to cached data when offline

@keywords: offline, cache, fallback, PWA, network, resilience, loading

Serve cached content when the network request fails in a PWA.
Essential for offline-first applications and progressive web apps.

```typescript
const loadArticle = async (slug: string) => {
  return await guard(
    async () => {
      const response = await fetch(`/api/articles/${slug}`);
      const article = await response.json();
      localStorage.setItem(`article:${slug}`, JSON.stringify(article));
      return article;
    },
    () => {
      const cached = localStorage.getItem(`article:${slug}`);
      return cached ? JSON.parse(cached) : { title: "Offline", body: "Content unavailable." };
    }
  );
};
```

### **Copy** to clipboard with fallback

@keywords: clipboard, copy, fallback, browser, API, design system, browser permissions

Safely use the Clipboard API with a fallback to the legacy execCommand approach.
Essential for "Copy to clipboard" buttons that work across all browsers.

```typescript
const copyToClipboard = async (text: string) => {
  return await guard(
    async () => {
      await navigator.clipboard.writeText(text);
      return true;
    },
    () => {
      // Fallback for older browsers or insecure contexts
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    }
  );
};

copyButton.addEventListener("click", async () => {
  const success = await copyToClipboard(codeBlock.textContent ?? "");
  showToast(success ? "Copied" : "Copy failed");
});
```

### **Read** clipboard content with permission fallback

@keywords: clipboard, read, paste, permission, browser permissions, design system

Safely read clipboard content, falling back gracefully when permission is denied.
Critical for paste-from-clipboard features in editors and form fields.

```typescript
const readClipboard = async () => {
  return await guard(
    async () => {
      const text = await navigator.clipboard.readText();
      return text;
    },
    () => {
      showPastePrompt("Press Ctrl+V to paste");
      return null;
    }
  );
};
```

### **Detect** browser capabilities safely

@keywords: detect, capability, feature, browser, browser permissions, progressive enhancement

Check for browser API support without crashing on unsupported environments.
Critical for progressive enhancement and cross-browser compatibility.

```typescript
const getGeolocation = await guard(
  async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
  },
  () => {
    console.warn("Geolocation unavailable, using default location");
    return { coords: { latitude: 48.8566, longitude: 2.3522 } };
  }
);

renderMap(getGeolocation.coords);
```
