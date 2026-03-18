/**
 * Functional Facade Pattern.
 *
 * In OOP, the Facade pattern requires a class that encapsulates multiple
 * subsystems and exposes a simplified interface to clients.
 *
 * In functional TypeScript, this is absorbed by the language:
 * a facade is just a function that orchestrates other functions.
 * No wrapper needed — it's what functions naturally do.
 *
 * This module exists for documentation and discoverability. The function is
 * marked `@deprecated` to guide developers toward idiomatic functional code.
 *
 * @module eidos/facade
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/facade/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * // No import needed — just write a function:
 *
 * // Subsystems (could be from different modules)
 * const validateUser = (data: UserInput) => { ... };
 * const hashPassword = (password: string) => { ... };
 * const saveToDb = (user: User) => { ... };
 * const sendWelcomeEmail = (email: string) => { ... };
 *
 * // Facade: simplified interface hiding the complexity
 * const registerUser = async (data: UserInput) => {
 *   const validated = validateUser(data);
 *   const hashedPassword = await hashPassword(validated.password);
 *   const user = await saveToDb({ ...validated, password: hashedPassword });
 *   await sendWelcomeEmail(user.email);
 *   return user;
 * };
 *
 * // Client only sees registerUser, not the subsystems
 * await registerUser({ name: "Alice", email: "alice@example.com", password: "..." });
 * ```
 *
 * @deprecated **Pattern absorbed by the language.**
 *
 * In functional TypeScript, a facade is just a function that calls other functions.
 * This function is the identity — it exists only so you find this message.
 *
 * Write your facade directly:
 * ```ts
 * const checkout = (cart: Cart, payment: Payment) => {
 *   const validated = validateCart(cart);
 *   const charged = processPayment(payment, validated.total);
 *   const order = createOrder(validated, charged);
 *   sendConfirmation(order);
 *   return order;
 * };
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/facade/ | Full explanation, examples and live demo}
 */
export function createFacade<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  return fn;
}
