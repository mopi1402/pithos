## `isNull`

### **Detect** explicit absence

@keywords: detect, null, absence, explicit, validation, semantic

Check strictly for `null` values.
Essential for differentiating between "no value" (null) and "not set" (undefined).

```typescript
if (isNull(record.deletedAt)) {
  // Record is active (deletedAt is explicitly null)
}
```
