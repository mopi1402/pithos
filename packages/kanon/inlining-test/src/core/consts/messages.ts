// /core/consts/messages.ts
export const ERROR_MESSAGES_COMPOSITION = {
  email: "Invalid email format",
  url: "Invalid URL format",
  uuid: "Invalid UUID format",
  minLength: (min: number) => `String must be at least ${min} characters long`,
  maxLength: (max: number) => `String must be at most ${max} characters long`,
} as const;




