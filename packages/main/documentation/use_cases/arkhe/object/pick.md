## `pick` ⭐

### **Select** specific subsets 📍

@keywords: select, subset, pick, DTO, whitelist, payload

Create a shallow copy containing only the specified keys.
Critical for creating strict DTOs or filtering API payloads.

```typescript
const payload = pick(formData, ['username', 'email']);
```

### **Extract** form subset for validation

@keywords: extract, forms, validation, subset, multi-step, schema

Select only the fields relevant to a specific validation step.
Useful for multi-step forms or partial schema validation.

```typescript
const step1Data = pick(formData, ['firstName', 'lastName', 'email']);
const isValid = validateStep1Schema(step1Data);
```

### **Whitelist** allowed parameters

@keywords: whitelist, security, parameters, mass-assignment, validation, safe

Ensure that only permitted keys are passed to a function or API.
Security critical for preventing mass assignment vulnerabilities.

```typescript
const safeInput = pick(req.body, ['title', 'content', 'authorId']);
db.create(safeInput);
```
