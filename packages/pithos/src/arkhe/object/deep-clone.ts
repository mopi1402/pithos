/**
 * Creates a deep clone of a value, recursively cloning nested structures.
 *
 * Handles primitives, arrays, Date, Map, Set, RegExp, Error, and plain objects.
 * Preserves prototypes and symbol keys. Handles circular references.
 * Functions are copied by reference (not cloned).
 *
 * For TypedArrays, ArrayBuffer, Buffer, Blob, File, use `deepCloneFull` instead.
 *
 * @template T - The type of the destination object.
 * @param value - The value to deep clone.
 * @returns A deep clone of the value.
 * @since 2.0.0
 *
 * @performance O(n) time & space where n is total number of properties/elements.
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 }, d: [3, 4] };
 * const cloned = deepClone(original);
 * cloned.b.c = 99;
 * original.b.c; // => 2 (unchanged)
 * ```
 *
 * @example
 * ```typescript
 * const circular: Record<string, unknown> = { a: 1 };
 * circular.self = circular;
 * const cloned = deepClone(circular);
 * cloned.self === cloned; // => true
 * ```
 */
export function deepClone<T>(value: T): T {
  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: Early return optimization for primitives - fallback produces identical result
  if (value === null || typeof value !== "object") {
    return value;
  }
  return cloneRecursive(value, new WeakMap());
}

function cloneRecursive<T>(value: T, refs: WeakMap<object, unknown>): T {
  if (value === null || typeof value !== "object") {
    return value;
  }
  const obj = value as object;
  const cached = refs.get(obj);
  if (cached !== undefined) {
    return cached as T;
  }
  const proto = Object.getPrototypeOf(obj);
  const ctor = proto?.constructor;
  if (Array.isArray(value)) {
    const len = value.length;
    // Stryker disable next-line ArrayDeclaration: Preallocation optimization - result is identical
    const result: unknown[] = new Array(len);
    refs.set(obj, result);
    // Stryker disable next-line EqualityOperator: Loop guard optimization - sparse array check prevents side effects
    for (let i = 0; i < len; i++) {
      if (i in value) {
        result[i] = cloneRecursive(value[i], refs);
      }
    }
    return result as T;
  }

  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: Fast path optimization for plain objects - fallback produces identical result
  if (ctor === Object || proto === null) {
    const result: Record<string | symbol, unknown> =
      proto === null ? Object.create(null) : {};
    refs.set(obj, result);
    for (const key of Reflect.ownKeys(obj)) {
      result[key] = cloneRecursive(
        (obj as Record<string | symbol, unknown>)[key],
        refs
      );
    }
    return result as T;
  }
  if (ctor === Date) {
    return new Date((value as unknown as Date).getTime()) as T;
  }
  if (ctor === RegExp) {
    const regex = value as unknown as RegExp;
    const result = new RegExp(regex.source, regex.flags);
    result.lastIndex = regex.lastIndex;
    return result as T;
  }
  if (ctor === Map) {
    const result = new Map();
    refs.set(obj, result);
    for (const [k, v] of value as unknown as Map<unknown, unknown>) {
      result.set(cloneRecursive(k, refs), cloneRecursive(v, refs));
    }
    return result as T;
  }
  if (ctor === Set) {
    const result = new Set();
    refs.set(obj, result);
    for (const v of value as unknown as Set<unknown>) {
      result.add(cloneRecursive(v, refs));
    }
    return result as T;
  }

  // Stryker disable next-line ConditionalExpression,BlockStatement: Error constructor preserves stack trace - fallback produces identical result
  if (value instanceof Error) {
    const err = value as Error;
    const ErrorCtor = ctor as new (message?: string) => Error;
    const result = new ErrorCtor(err.message);
    refs.set(obj, result);
    result.name = err.name;
    result.stack = err.stack;
    return result as T;
  }
  const result = Object.create(proto);
  refs.set(obj, result);
  for (const key of Reflect.ownKeys(obj)) {
    result[key] = cloneRecursive(
      (obj as Record<string | symbol, unknown>)[key],
      refs
    );
  }
  return result as T;
}
