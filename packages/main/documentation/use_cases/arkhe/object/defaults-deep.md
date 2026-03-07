## `defaultsDeep`

### **Configuration Merging** with nested defaults 📍

@keywords: config, defaults, merge, nested, settings, design system, presets

Merge user configuration with default values recursively.
Essential for application configuration systems.

```typescript
import { defaultsDeep } from "@pithos/core/arkhe/object/defaults-deep";

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

@keywords: theme, customization, partial, overrides, styling, design system, presets

Apply partial theme overrides to default theme.
Critical for customizable UI systems.

```typescript
import { defaultsDeep } from "@pithos/core/arkhe/object/defaults-deep";

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

@keywords: API, request, options, defaults, fetch, payment, PWA

Apply default options to API requests.
Important for consistent API interactions.

```typescript
import { defaultsDeep } from "@pithos/core/arkhe/object/defaults-deep";

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

### **Merge** user presets with base configuration

@keywords: presets, user, base, configuration, merge, customization, design system

Apply user-saved presets on top of a base configuration.
Essential for apps with saveable presets like editors, IDEs, or design tools.

```typescript
const basePreset = {
  editor: { fontSize: 14, tabSize: 2, wordWrap: true },
  terminal: { shell: "/bin/bash", fontSize: 12 },
  theme: { name: "default", colors: { primary: "#007bff", bg: "#fff" } },
};

const userPreset = {
  editor: { fontSize: 16 },
  theme: { colors: { bg: "#1a1a1a" } },
};

const config = defaultsDeep(userPreset, basePreset);
// editor.tabSize = 2 (preserved), editor.fontSize = 16 (overridden)
// theme.colors.primary = "#007bff" (preserved), theme.colors.bg = "#1a1a1a" (overridden)
```

### **Configure** PWA manifest with defaults

@keywords: PWA, manifest, config, defaults, offline, progressive, mobile

Merge partial PWA configuration with required manifest defaults.
Critical for generating valid PWA manifests from minimal user input.

```typescript
const pwaConfig = defaultsDeep(userPwaConfig, {
  name: "My App",
  short_name: "App",
  display: "standalone",
  start_url: "/",
  background_color: "#ffffff",
  theme_color: "#000000",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

writeManifest(pwaConfig);
```
