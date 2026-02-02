## `defaultsDeep`

### **Configuration Merging** with nested defaults 📍

@keywords: config, defaults, merge, nested, settings

Merge user configuration with default values recursively.
Essential for application configuration systems.

```typescript
import { defaultsDeep } from "pithos/arkhe/object/defaults-deep";

const defaultConfig = {
  server: {
    port: 3000,
    host: "localhost",
    ssl: { enabled: false, cert: null },
  },
  logging: {
    level: "info",
    format: "json",
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};

const userConfig = {
  server: {
    port: 8080,
    ssl: { enabled: true },
  },
  logging: {
    level: "debug",
  },
};

const config = defaultsDeep(userConfig, defaultConfig);
console.log(config);
// {
//   server: { port: 8080, host: "localhost", ssl: { enabled: true, cert: null } },
//   logging: { level: "debug", format: "json" },
//   cache: { enabled: true, ttl: 3600 }
// }
```

### **Theme Customization** with partial overrides 📍

@keywords: theme, customization, partial, overrides, styling

Apply partial theme overrides to default theme.
Critical for customizable UI systems.

```typescript
import { defaultsDeep } from "pithos/arkhe/object/defaults-deep";

const defaultTheme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    background: "#ffffff",
    text: "#212529",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    fontSize: { base: "16px", heading: "24px" },
  },
};

const darkThemeOverrides = {
  colors: {
    background: "#1a1a1a",
    text: "#f0f0f0",
  },
};

const darkTheme = defaultsDeep(darkThemeOverrides, defaultTheme);
console.log(darkTheme.colors);
// { primary: "#007bff", secondary: "#6c757d", background: "#1a1a1a", text: "#f0f0f0" }
```

### **API Request Options** with defaults

@keywords: API, request, options, defaults, fetch

Apply default options to API requests.
Important for consistent API interactions.

```typescript
import { defaultsDeep } from "pithos/arkhe/object/defaults-deep";

const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  retry: { attempts: 3, delay: 1000 },
};

function createRequest(url: string, options: Partial<typeof defaultOptions> = {}) {
  const finalOptions = defaultsDeep(options, defaultOptions);

  return {
    url,
    ...finalOptions,
  };
}

const request = createRequest("/api/users", {
  headers: { Authorization: "Bearer token" },
  retry: { attempts: 5 },
});

console.log(request.headers);
// { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer token" }
console.log(request.retry);
// { attempts: 5, delay: 1000 }
```
