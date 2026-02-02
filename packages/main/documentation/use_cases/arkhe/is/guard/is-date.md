## `isDate`

### **Validate** timestamps

@keywords: validate, date, timestamps, time, formatting, scheduling

Ensure a value is a valid Date object before formatting or comparison.
Essential for time-sensitive logic and scheduling applications.

```typescript
if (isDate(timestamp) && !isNaN(timestamp.getTime())) {
  console.log(timestamp.toISOString());
}
```
