// /index.ts - Point d'entrée principal
import { string } from "./schemas/primitives/string-with-constraints.js";

// Test des contraintes
const emailSchema = string().email();
const urlSchema = string().url();
const uuidSchema = string().uuid();
const minLengthSchema = string().minLength(5);
const maxLengthSchema = string().maxLength(10);

// Tests
console.log("=== Test des contraintes ===");

console.log("Email test:");
console.log("Valid:", emailSchema.validator("test@example.com"));
console.log("Invalid:", emailSchema.validator("invalid-email"));

console.log("\nURL test:");
console.log("Valid:", urlSchema.validator("https://example.com"));
console.log("Invalid:", urlSchema.validator("not-a-url"));

console.log("\nUUID test:");
console.log(
  "Valid:",
  uuidSchema.validator("123e4567-e89b-12d3-a456-426614174000")
);
console.log("Invalid:", uuidSchema.validator("not-a-uuid"));

console.log("\nMinLength test:");
console.log("Valid:", minLengthSchema.validator("hello"));
console.log("Invalid:", minLengthSchema.validator("hi"));

console.log("\nMaxLength test:");
console.log("Valid:", maxLengthSchema.validator("short"));
console.log("Invalid:", maxLengthSchema.validator("very-long-string"));

console.log("\n=== Test terminé ===");
