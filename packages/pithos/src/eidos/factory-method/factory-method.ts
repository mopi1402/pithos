/**
 * Functional Factory Method Pattern.
 *
 * In OOP, the Factory Method pattern requires an abstract Creator class with
 * an abstract `factoryMethod()`, and concrete subclasses that override it to
 * produce different products. The Creator's business logic calls `factoryMethod()`
 * without knowing which concrete product it will get.
 *
 * In functional TypeScript, this is just dependency injection: pass the factory
 * as a parameter. The pattern is absorbed by the language — no wrapper needed.
 *
 * This module exists for documentation and discoverability. The function is
 * marked `@deprecated` to guide developers toward idiomatic functional code.
 *
 * @module eidos/factory-method
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/factory-method/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * // No import needed — just pass the factory as a parameter:
 * type Product = { operation: () => string };
 *
 * const businessLogic = (createProduct: () => Product) => {
 *   const product = createProduct();
 *   return `Working with ${product.operation()}`;
 * };
 *
 * // Different "concrete creators" are just different factory functions:
 * const createProductA = (): Product => ({ operation: () => "ProductA" });
 * const createProductB = (): Product => ({ operation: () => "ProductB" });
 *
 * businessLogic(createProductA); // "Working with ProductA"
 * businessLogic(createProductB); // "Working with ProductB"
 * ```
 */

/**
 * A Factory is a function that creates a product.
 * This is just a type alias for documentation.
 *
 * @internal Not exported in API docs — use inline `() => T` instead
 * @template T - The product type
 * @since 2.4.0
 */
export type Factory<T> = () => T;

/**
 * A ParameterizedFactory creates products based on input parameters.
 *
 * @internal Not exported in API docs — use inline `(input: In) => T` instead
 * @template In - The input/configuration type
 * @template T - The product type
 * @since 2.4.0
 */
export type ParameterizedFactory<In, T> = (input: In) => T;

/**
 * @deprecated **Pattern absorbed by the language.**
 *
 * In functional TypeScript, the Factory Method is just dependency injection.
 * Pass the factory as a parameter — no wrapper needed.
 *
 * This function is the identity — it exists only so you find this message.
 *
 * Write your code directly:
 * ```ts
 * const process = (createProduct: () => Product) => {
 *   const product = createProduct();
 *   return product.doSomething();
 * };
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/factory-method/ | Full explanation, examples and live demo}
 * @since 2.4.0
 */
export function createFactoryMethod<T>(factory: () => T): () => T {
  return factory;
}
