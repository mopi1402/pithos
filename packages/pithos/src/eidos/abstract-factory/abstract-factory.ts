/**
 * Functional Abstract Factory Pattern.
 *
 * In OOP, the Abstract Factory pattern requires an AbstractFactory interface,
 * concrete factory classes, abstract product interfaces, and concrete product
 * classes — a deep hierarchy just to produce families of related objects.
 * In functional TypeScript, an abstract factory is a function that returns
 * a record of creator functions. Swapping families is just swapping the factory.
 *
 * The core value of the pattern is intra-family consistency: products created
 * by the same family are guaranteed to be compatible and can collaborate.
 * A single `create("variant")` call returns a coherent record where every
 * creator shares the same family context.
 *
 * @module eidos/abstract-factory
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createAbstractFactory } from "@pithos/core/eidos/abstract-factory/abstract-factory";
 *
 * // Products collaborate: renderForm uses both button and input from the
 * // same family, guaranteeing visual consistency.
 * type UIKit = {
 *   button: (label: string) => string;
 *   input: (placeholder: string) => string;
 *   renderForm: (action: string) => string;
 * };
 *
 * const factory = createAbstractFactory<"light" | "dark", UIKit>({
 *   light: () => {
 *     const button = (label: string) => `<button class="light">${label}</button>`;
 *     const input = (ph: string) => `<input class="light" placeholder="${ph}" />`;
 *     return {
 *       button,
 *       input,
 *       renderForm: (action) => `${input(action)}${button("Submit")}`,
 *     };
 *   },
 *   dark: () => {
 *     const button = (label: string) => `<button class="dark">${label}</button>`;
 *     const input = (ph: string) => `<input class="dark" placeholder="${ph}" />`;
 *     return {
 *       button,
 *       input,
 *       renderForm: (action) => `${input(action)}${button("Submit")}`,
 *     };
 *   },
 * });
 *
 * const ui = factory.create("dark");
 * ui.renderForm("search");
 * // `<input class="dark" ...><button class="dark">Submit</button>`
 * ```
 */

import { some, none } from "@zygos/option";
import type { Option } from "@zygos/option";

/**
 * A Factory is a zero-arg function that produces a product record.
 * Each key in the record is a creator function for one product of the family.
 *
 * @template Products - The record of creator functions
 * @since 2.4.0
 */
export type Factory<Products extends Record<string, (...args: never[]) => unknown>> =
  () => Products;

/**
 * Creates an abstract factory from a record of named family factories.
 *
 * Each key is a family name, each value is a factory function that produces
 * the product record for that family. All families must produce the same
 * product shape (same keys, same signatures).
 *
 * The real power is intra-family collaboration: since `create` returns a
 * coherent record, products from the same family can reference each other
 * via closure, guaranteeing compatibility without type gymnastics.
 *
 * @template K - Union of family keys
 * @template Products - The record of creator functions each family produces
 * @param families - Record mapping family keys to factory functions
 * @returns An abstract factory with `create`, `get`, and `keys`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Products that collaborate: encoder uses the separator from its family
 * type Codec = {
 *   encode: (parts: string[]) => string;
 *   decode: (raw: string) => string[];
 * };
 *
 * const codecs = createAbstractFactory<"csv" | "tsv", Codec>({
 *   csv: () => {
 *     const sep = ",";
 *     return {
 *       encode: (parts) => parts.join(sep),
 *       decode: (raw) => raw.split(sep),
 *     };
 *   },
 *   tsv: () => {
 *     const sep = "\t";
 *     return {
 *       encode: (parts) => parts.join(sep),
 *       decode: (raw) => raw.split(sep),
 *     };
 *   },
 * });
 *
 * const csv = codecs.create("csv");
 * csv.decode(csv.encode(["a", "b"])); // ["a", "b"] — round-trip guaranteed
 * ```
 */
export function createAbstractFactory<
  K extends string,
  Products extends Record<string, (...args: never[]) => unknown>,
>(families: Record<K, Factory<Products>>) {
  return {
    /**
     * Create a product family by key. The factory is called each time,
     * producing a fresh product record.
     */
    create: (key: K): Products => families[key](),

    /**
     * Safe lookup for dynamic/runtime keys.
     * Returns `Some(factory)` if the key exists, `None` otherwise.
     */
    get: (key: string): Option<Factory<Products>> => {
      if (key in families) {
        // INTENTIONAL: key validated by `in` check, TS can't narrow string to K
        return some(families[key as K]);
      }
      return none;
    },

    /** Returns all registered family keys. */
    keys: (): K[] => {
      // INTENTIONAL: Object.keys returns string[], but we know they're K
      return Object.keys(families) as K[];
    },
  };
}
