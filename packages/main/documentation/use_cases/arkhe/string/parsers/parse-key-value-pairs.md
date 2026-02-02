## `parseKeyValuePairs` 💎

> `URLSearchParams` is limited to URL-encoded `&` pairs. This handles connection strings, cookies, and any custom `key=value` format.

### **Parse** connection strings 📍

@keywords: parse, connection, strings, configuration, database, DSN

Convert `key=value` strings into a configuration object.
Perfect for parsing database connection strings or DSN formats.
```typescript
const connection = parseKeyValuePairs('host=localhost;port=5432;db=myapp', ';');
// { host: 'localhost', port: '5432', db: 'myapp' }
```

### **Parse** query strings

@keywords: parse, query, strings, URL, parameters, SSR

Handle standard URL query formats without using URLSearchParams.
Useful for SSR or environments where URL APIs are unavailable.
```typescript
const params = parseKeyValuePairs('page=1&sort=desc&filter=active', '&');
// { page: '1', sort: 'desc', filter: 'active' }
```

### **Parse** cookie strings

@keywords: parse, cookies, headers, key-value, extraction, HTTP

Extract key-value pairs from cookie headers.
```typescript
const cookies = parseKeyValuePairs('session=abc123; theme=dark; lang=en', '; ');
// { session: 'abc123', theme: 'dark', lang: 'en' }
```
