/**
 * Creates a deep clone of any JavaScript value, handling all types.
 *
 * Supports all types from `deepClone` plus: TypedArrays, ArrayBuffer,
 * SharedArrayBuffer, DataView, Buffer (Node.js), Blob, File, and boxed primitives.
 * Preserves prototypes and symbol keys. Handles circular references.
 * Functions are copied by reference (not cloned).
 *
 * @template T - The type of the destination object.
 * @param value - The value to clone deeply.
 * @returns A deep clone of the input value.
 * @since 1.1.0
 *
 * @performance O(n) where n is the total number of properties.
 *
 * @example
 * ```typescript
 * const obj = {
 *   date: new Date(),
 *   buffer: new Uint8Array([1, 2, 3]),
 *   nested: { a: 1 }
 * };
 * const cloned = deepCloneFull(obj);
 * cloned.nested.a = 99;
 * obj.nested.a; // => 1 (unchanged)
 * ```
 *
 * @example
 * ```typescript
 * const buffer = new ArrayBuffer(8);
 * const view = new DataView(buffer);
 * view.setInt32(0, 42);
 * const cloned = deepCloneFull(view);
 * ```
 */
export function deepCloneFull<T>(value: T): T {
  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: Early return optimization for primitives - fallback produces identical result
  if (value === null || typeof value !== "object") {
    return value;
  }
  return cloneFullRecursive(value, new WeakMap());
}

function cloneFullRecursive<T>(value: T, refs: WeakMap<object, unknown>): T {
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
    // Stryker disable next-line ArrayDeclaration
    const result: unknown[] = new Array(len);
    refs.set(obj, result);
    // Stryker disable next-line EqualityOperator
    for (let i = 0; i < len; i++) {
      if (i in value) {
        result[i] = cloneFullRecursive(value[i], refs);
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
      result[key] = cloneFullRecursive(
        (obj as Record<string | symbol, unknown>)[key],
        refs
      );
    }
    return result as T;
  }

  if (ctor === ArrayBuffer) {
    const result = (obj as ArrayBuffer).slice(0);
    refs.set(obj, result);
    return result as T;
  }

  // Stryker disable next-line ConditionalExpression,StringLiteral
  if (typeof SharedArrayBuffer !== "undefined" && ctor === SharedArrayBuffer) {
    const result = (obj as SharedArrayBuffer).slice(0);
    refs.set(obj, result);
    return result as T;
  }

  if (ctor === DataView) {
    const view = obj as DataView;
    const clonedBuffer = view.buffer.slice(
      view.byteOffset,
      view.byteOffset + view.byteLength
    );
    const result = new DataView(
      clonedBuffer as ArrayBuffer,
      0,
      view.byteLength
    );
    refs.set(obj, result);
    return result as T;
  }

  // Stryker disable next-line ConditionalExpression,StringLiteral,EqualityOperator,BlockStatement: Feature detection guard for Buffer availability - fallback would create object with Buffer prototype but broken internal slots
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(obj)) {
    const result = Buffer.from(obj);
    refs.set(obj, result);
    return result as T;
  }

  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const typed = obj as Uint8Array;
    const slicedBuffer = typed.buffer.slice(
      typed.byteOffset,
      typed.byteOffset + typed.byteLength
    ) as ArrayBuffer;
    const TypedCtor = ctor as { new(buffer: ArrayBuffer): typeof typed };
    const result = new TypedCtor(slicedBuffer);
    refs.set(obj, result);
    return result as T;
  }

  // Stryker disable next-line ConditionalExpression,StringLiteral,EqualityOperator
  if (typeof Blob !== "undefined" && ctor === Blob) {
    const blob = obj as Blob;
    return new Blob([blob], { type: blob.type }) as T;
  }

  // Stryker disable next-line ConditionalExpression,StringLiteral,EqualityOperator
  if (typeof File !== "undefined" && ctor === File) {
    const file = obj as File;
    return new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    }) as T;
  }

  if (ctor === Boolean) {
    return new Boolean((value as unknown as boolean).valueOf()) as T;
  }
  if (ctor === Number) {
    return new Number((value as unknown as number).valueOf()) as T;
  }
  if (ctor === String) {
    return new String((value as unknown as string).valueOf()) as T;
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
      result.set(cloneFullRecursive(k, refs), cloneFullRecursive(v, refs));
    }
    return result as T;
  }

  if (ctor === Set) {
    const result = new Set();
    refs.set(obj, result);
    for (const v of value as unknown as Set<unknown>) {
      result.add(cloneFullRecursive(v, refs));
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
    result[key] = cloneFullRecursive(
      (obj as Record<string | symbol, unknown>)[key],
      refs
    );
  }
  return result as T;
}
