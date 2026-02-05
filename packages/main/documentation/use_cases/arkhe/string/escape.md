## `escape`

### **Prevent** XSS 📍

@keywords: prevent, XSS, security, escape, HTML, injection

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

@keywords: email, template, HTML, escape, injection, safe

Prevent HTML injection when inserting user-provided data into email templates.

```typescript
const html = `
  <h1>Hello ${escape(userName)}</h1>
  <p>Your message: ${escape(userMessage)}</p>
`;
sendEmail({ to: recipient, html });
```
