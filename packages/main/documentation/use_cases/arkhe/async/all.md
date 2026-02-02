## `all` ⭐

**Key advantages over Promise.all():**

- **Object support**: Works with objects of promises, not just arrays
- **Structured results**: Returns results with meaningful keys instead of positional arrays
- **Better semantics**: More intuitive for complex data loading scenarios

### **Load** multiple resources simultaneously 📍

@keywords: load, parallel, concurrent, API, resources, dashboard, performance

Execute multiple API calls in parallel to improve performance and reduce loading times.
Essential for dashboard applications and data-heavy interfaces.

```typescript
// ✅ With all() - Structured and intuitive
const dashboardData = await all({
  user: fetchUser(userId),
  posts: fetchUserPosts(userId),
  notifications: fetchNotifications(userId),
  settings: fetchUserSettings(userId),
});

console.log(dashboardData);
// {
//   user: { id: 1, name: "John", email: "john@example.com" },
//   posts: [{ id: 1, title: "My First Post" }],
//   notifications: [{ id: 1, message: "Welcome!" }],
//   settings: { theme: "dark", notifications: true }
// }

// ❌ With Promise.all() - Positional and less intuitive
const [user, posts, notifications, settings] = await Promise.all([
  fetchUser(userId),
  fetchUserPosts(userId),
  fetchNotifications(userId),
  fetchUserSettings(userId),
]);
// Hard to remember which position corresponds to which data
```

### **Combine** related data arrays

@keywords: combine, merge, arrays, correlation, relationships, datasets

Merge related arrays into paired tuples for coordinated processing and analysis.
Essential for data correlation and maintaining relationships between datasets.

```typescript
// Load related data arrays
const [users, posts, comments] = await all([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
]);

// Process correlated data
const userPostCounts = users.map((user) => ({
  ...user,
  postCount: posts.filter((post) => post.userId === user.id).length,
}));
```

### **Initialize** application state 📍

@keywords: initialize, startup, bootstrap, configuration, setup, application

Load all required data for application initialization in parallel.
Critical for reducing application startup time and improving user experience.

```typescript
// Initialize app with all required data
const appState = await all({
  config: loadAppConfig(),
  user: getCurrentUser(),
  permissions: getUserPermissions(),
  theme: loadTheme(),
  language: loadLanguage(),
});

// App is ready with all data loaded
initializeApp(appState);
```

### **Validate** multiple inputs simultaneously

@keywords: validate, validation, forms, inputs, rules, checks

Check multiple validation rules in parallel for faster form processing.
Essential for complex forms with multiple validation requirements.

```typescript
// Validate form inputs in parallel
const validationResults = await all({
  email: validateEmail(formData.email),
  password: validatePassword(formData.password),
  username: validateUsername(formData.username),
  terms: validateTermsAcceptance(formData.terms),
});

if (Object.values(validationResults).every((result) => result.isValid)) {
  // All validations passed
  submitForm(formData);
}
```

### **Process** batch operations

@keywords: process, batch, operations, parallel, files, bulk

Execute multiple independent operations in parallel for better performance.
Critical for batch processing systems and data pipelines.

```typescript
// Process multiple files in parallel
const processedFiles = await all([
  processImageFile("image1.jpg"),
  processImageFile("image2.jpg"),
  processImageFile("image3.jpg"),
  processImageFile("image4.jpg"),
]);

console.log(`Processed ${processedFiles.length} files successfully`);
```

