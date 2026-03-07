## `escape`

### **Prevent** XSS 📍

@keywords: prevent, XSS, security, escape, HTML, injection, a11y, seo

Escape unsafe characters in strings before rendering to HTML.
Critical for security when displaying user-generated content.
```typescript
const safeHtml = escape('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

### **Sanitize** user comments

@keywords: sanitize, comments, user-content, entities, HTML, escape

Escape HTML entities in user-submitted content before display.
```typescript
const comment = escape('I <3 this product & service!');
// 'I &lt;3 this product &amp; service!'
```

### **Escape** user input in HTML email templates

@keywords: email, template, HTML, escape, injection, safe, a11y

Prevent HTML injection when inserting user-provided data into email templates.

```typescript
const html = `
  <h1>Hello ${escape(userName)}</h1>
  <p>Your message: ${escape(userMessage)}</p>
`;
sendEmail({ to: recipient, html });
```

### **Sanitize** chat messages in real-time

@keywords: chat, message, sanitize, real-time, websocket, security, XSS

Escape user messages before rendering in a live chat interface.
Critical for chat apps, comment sections, and any real-time messaging UI.

```typescript
ws.on("message", (raw) => {
  const data = JSON.parse(raw);
  const safeMessage = escape(data.text);

  appendMessage({
    author: escape(data.username),
    content: safeMessage,
    timestamp: data.timestamp,
  });
});
```

### **Escape** dynamic content in SSR templates

@keywords: SSR, template, dynamic, content, server, rendering, seo, security

Prevent XSS when injecting dynamic data into server-rendered HTML.
Essential for SSR frameworks and server-side template engines.

```typescript
const renderProductPage = (product) => `
  <div class="product">
    <h1>${escape(product.name)}</h1>
    <p class="description">${escape(product.description)}</p>
    <span class="price">${escape(String(product.price))}</span>
  </div>
`;
```
