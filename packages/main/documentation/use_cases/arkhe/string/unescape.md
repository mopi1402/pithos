## `unescape`

### **Decode API responses** for display 📍

@keywords: decode, API, responses, HTML, entities, display

Convert HTML entities from API content back to readable characters.
Essential when displaying user-generated content stored with HTML encoding.

```typescript
unescape("Tom &amp; Jerry");
// => "Tom & Jerry"
```

### **Process CMS content** for rendering 📍

@keywords: CMS, content, rendering, WYSIWYG, editor

Restore original characters from CMS or WYSIWYG editor output.
Critical for headless CMS integrations where content comes pre-escaped.

```typescript
unescape("&lt;p&gt;Welcome!&lt;/p&gt;");
// => "<p>Welcome!</p>"
```

### **Roundtrip with escape** for data integrity

@keywords: roundtrip, escape, integrity, validation, testing

Verify data integrity by ensuring escape/unescape roundtrips preserve content.

```typescript
const original = '<script>alert("XSS")</script>';
unescape(escape(original)) === original; // => true
```
