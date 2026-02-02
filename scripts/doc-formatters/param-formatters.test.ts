import { describe, it, expect } from "vitest";
import { reformatParameters } from "./param-formatters.js";
import { cleanMarkdown } from "./markdown-cleaners.js";

describe("reformatParameters", () => {
    it("should format simple parameter with type", () => {
        const input = `## Parameters

### param

\`string\`

## Returns`;
        const result = reformatParameters(input);
        expect(result).toContain("### param: `string`");
    });

    it("should format parameter with description and type", () => {
        const input = `## Parameters

### param

The parameter description.

\`number\`

## Returns`;
        const result = reformatParameters(input);
        expect(result).toContain("### param: `number`");
        expect(result).toContain("The parameter description.");
    });

    it("should format Returns section with type before description", () => {
        const input = `## Returns

\`Promise<T>\`

Promise that resolves to the results.

## Since`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Promise<T>`");
        expect(result).toContain("Promise that resolves to the results.");
    });

    it("should format Returns section with description before type (blockquote)", () => {
        const input = `## Returns

Returns the new restricted function.

> (\`b\`, \`a\`, ...\`rest\`): \`R\`

## Since`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `(b, a, ...rest): R`");
        expect(result).toContain("Returns the new restricted function.");
    });

    it("should remove nested Parameters and Returns subsections", () => {
        const input = `## Returns: \`(b, a, ...rest): R\`

Returns the new restricted function.

### Parameters

#### b

\`U\`

#### a

\`T\`

### Returns

\`R\`

## Since`;
        const result = reformatParameters(input);
        expect(result).not.toContain("### Parameters");
        expect(result).not.toContain("### Returns");
        expect(result).toContain("## Returns:");
        expect(result).toContain("## Since");
    });
});

describe("reformatParameters - Real TypeDoc examples from arkhe", () => {
    it("should format chunk() parameters correctly", () => {
        const input = `## Parameters

### input

\`T\`[]

The array to process.

### size

\`number\`

The length of each chunk.

## Returns

\`T\`[][]

Returns the new array of chunks.`;
        const result = reformatParameters(input);
        expect(result).toContain("### input: `T[]`");
        expect(result).toContain("The array to process.");
        expect(result).toContain("### size: `number`");
        expect(result).toContain("## Returns: `T[][]`");
        expect(result).toContain("Returns the new array of chunks.");
    });

    it("should format all() Returns section correctly (type before description)", () => {
        const input = `### Returns

\`Promise\`\<\{ \[K in string \| number \| symbol\]: Awaited\<T\[K\<K\>\]\> \}\>

Promise that resolves to the results.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### Returns: `Promise<{ [K in string | number | symbol]: Awaited<T[K<K>]> }>`"
        );
        expect(result).toContain("Promise that resolves to the results.");
    });

    it("should format flip() Returns section correctly (description before type in blockquote)", () => {
        const input = `## Returns

The flipped function.

> (\`b\`, \`a\`, ...\`rest\`): \`R\`

### Parameters

#### b

\`U\`

#### a

\`T\`

#### rest

...\`Rest\`

### Returns

\`R\``;
        const result = reformatParameters(input);
        expect(result).toContain("The flipped function.");
        expect(result).not.toContain("### Parameters");
        expect(result).not.toContain("### Returns");
        expect(result).toMatch(/##+\s+Returns/);
    });

    it("should format after() Returns section correctly (description before type in blockquote)", () => {
        const input = `## Returns

Returns the new restricted function. Returns \`undefined\` for the first \`n-1\` calls.

> (...\`args\`): \`Return\` \| \`undefined\`

### Parameters

#### args

...\`Args\`

### Returns

\`Return\` \| \`undefined\``;
        const result = reformatParameters(input);
        expect(result).toContain(
            "Returns the new restricted function. Returns `undefined` for the first `n-1` calls."
        );
        expect(result).not.toContain("### Parameters");
        expect(result).not.toContain("### Returns");
        expect(result).toMatch(/##+\s+Returns/);
    });

    it("should format template() parameters with default value correctly", () => {
        const input = `## Parameters

### template

\`string\`

The template string with placeholders in \`{key}\` format.

### data

\`Record\`\<\`string\`, \`unknown\`\> = \`{}\`

The data object containing values to interpolate. Defaults to \`{}\`.`;
        const result = reformatParameters(input);
        expect(result).toContain("### template: `string`");
        expect(result).toContain("### data: `Record<string, unknown> = {}`");
        expect(result).toContain(
            "The template string with placeholders in `{key}` format."
        );
    });

    it("should format groupBy() parameters with complex types correctly", () => {
        const input = `## Parameters

### collection

The collection to iterate over.

\`Record\`\<\`string\`, \`T\`\> | readonly \`T\`[]

### iteratee

(\`value\`, \`key\`, \`collection\`) => \`PropertyKey\`

The iteratee to transform keys.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### collection: `Record<string, T> | readonly T[]`"
        );
        expect(result).toContain(
            "### iteratee: `(value, key, collection) => PropertyKey`"
        );
        expect(result).toContain("The collection to iterate over.");
        expect(result).toContain("The iteratee to transform keys.");
    });

    it("should format flip() parameter with function type correctly", () => {
        const input = `## Parameters

### fn

(\`a\`, \`b\`, ...\`rest\`) => \`R\`

The function to flip`;
        const result = reformatParameters(input);
        expect(result).toContain("### fn: `(a, b, ...rest) => R`");
        expect(result).toContain("The function to flip");
    });

    it("should format after() parameter with function type correctly", () => {
        const input = `## Parameters

### func

(...\`args\`) => \`Return\`

The function to restrict.`;
        const result = reformatParameters(input);
        expect(result).toContain("### func: `(...args) => Return`");
        expect(result).toContain("The function to restrict.");
    });

    it("should handle complete real-world example from chunk()", () => {
        const input = `[**pithos v1.1.0**](../../../README.md)

***

[pithos](../../../README.md) / [array/chunk](../README.md) / chunk

# chunk()

> **chunk**\<\`T\`\>(\`input\`, \`size\`): \`T\`[][]

Creates an array of elements split into groups the length of size.

## Type Parameters

### T

\`T\`

The type of elements in the array.

## Parameters

### input

\`T\`[]

The array to process.

### size

\`number\`

The length of each chunk.

## Returns

\`T\`[][]

Returns the new array of chunks.

## Since

1.1.0`;
        const result = reformatParameters(cleanMarkdown(input));
        expect(result).toContain("### input: `T[]`");
        expect(result).toContain("### size: `number`");
        expect(result).toContain("## Returns: `T[][]`");
        expect(result).toContain("Returns the new array of chunks.");
    });

    it("should handle complete real-world example from all()", () => {
        const input = `### Returns

\`Promise\`\<\{ \[K in string \| number \| symbol\]: Awaited\<T\[K\<K\>\]\> \}\>

Promise that resolves to the results.

### Throws

Rejects if any of the input promises reject.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### Returns: `Promise<{ [K in string | number | symbol]: Awaited<T[K<K>]> }>`"
        );
        expect(result).toContain("Promise that resolves to the results.");
        expect(result).toContain("### Throws");
    });

    it("should format all() complete TypeDoc output correctly", () => {
        const input = `### Parameters

#### promises

\`T\`

Array or object of promises to execute.

### Returns

\`Promise\`\<\{ \[K in string \| number \| symbol\]: Awaited\<T\[K\<K\>\]\> \}\>

Promise that resolves to the results.

### Throws

Rejects if any of the input promises reject.`;
        const result = reformatParameters(input);
        expect(result).toContain("#### promises: `T`");
        expect(result).toContain("Array or object of promises to execute.");
        expect(result).toContain(
            "### Returns: `Promise<{ [K in string | number | symbol]: Awaited<T[K<K>]> }>`"
        );
        expect(result).toContain("Promise that resolves to the results.");
        expect(result).toContain("### Throws");
        expect(result).toContain("Rejects if any of the input promises reject.");
    });

    it("should format differenceBy() iteratee parameter with union type correctly", () => {
        const input = `## Parameters

### iteratee

\`keyof\` \`T\` | (\`item\`: \`T\`) => \`unknown\`

The function invoked per element or property name to compare.`;
        const result = reformatParameters(input);
        expect(result).toContain("### iteratee: `keyof T | (item: T) => unknown`");
        expect(result).toContain(
            "The function invoked per element or property name to compare."
        );
    });

    it("should format differenceWith() comparator parameter with function type correctly", () => {
        const input = `## Parameters

### comparator

(\`a\`: \`T\`, \`b\`: \`T\`) => \`boolean\`

The function invoked per element to determine equality.`;
        const result = reformatParameters(input);
        expect(result).toContain("### comparator: `(a: T, b: T) => boolean`");
        expect(result).toContain(
            "The function invoked per element to determine equality."
        );
    });

    it("should format dropRightWhile() predicate parameter with function type correctly", () => {
        const input = `## Parameters

### predicate

(\`value\`: \`T\`, \`index\`: \`number\`, \`array\`: \`T\`[]) => \`boolean\`

The function invoked per iteration.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### predicate: `(value: T, index: number, array: T[]) => boolean`"
        );
        expect(result).toContain("The function invoked per iteration.");
    });

    it("should format intersectionWith() arrays parameter with nested readonly correctly", () => {
        const input = `## Parameters

### arrays

readonly (readonly \`T\`[])[]

The arrays to intersect.`;
        const result = reformatParameters(input);
        expect(result).toContain("### arrays: `readonly (readonly T[])[]`");
        expect(result).toContain("The arrays to intersect.");
        const typeMatch = result.match(/### arrays: `([^`]+)`/);
        if (typeMatch) {
            const typeStr = typeMatch[1];
            const readonlyInType = (typeStr.match(/readonly/g) || []).length;
            expect(readonlyInType).toBe(2);
        }
    });

    it("should format intersectionWith() arrays parameter with escaped brackets correctly", () => {
        const input = `## Parameters

### arrays

readonly (readonly \`T\`\\[\\])\\[\\]

The arrays to intersect.`;
        const result = reformatParameters(input);
        expect(result).toContain("### arrays: `readonly (readonly T[])[]`");
        expect(result).toContain("The arrays to intersect.");
        const typeMatch = result.match(/### arrays: `([^`]+)`/);
        if (typeMatch) {
            const typeStr = typeMatch[1];
            const readonlyInType = (typeStr.match(/readonly/g) || []).length;
            expect(readonlyInType).toBe(2);
        }
    });

    it("should not duplicate readonly when formatting nested readonly arrays", () => {
        const input = `## Parameters

### arrays

readonly (readonly \`T\`[])[]

The arrays to intersect.`;
        const result = reformatParameters(input);
        const typeMatch = result.match(/### arrays: `([^`]+)`/);
        expect(typeMatch).not.toBeNull();
        if (typeMatch) {
            const typeStr = typeMatch[1];
            expect(typeStr).not.toMatch(/readonly\s+readonly/);
            const readonlyCount = (typeStr.match(/\breadonly\b/g) || []).length;
            expect(readonlyCount).toBe(2);
            expect(typeStr).toBe("readonly (readonly T[])[]");
        }
    });

    it("should format toArray() value parameter with Arrayable type correctly", () => {
        const input = `## Parameters

### value

[Arrayable](../../../types/common/arrayable/type-aliases/Arrayable.md)<\`T\`>

The value to convert to an array.`;
        const result = reformatParameters(input);
        expect(result).toContain("### value: `Arrayable<T>`");
        expect(result).toContain("The value to convert to an array.");
    });

    it("should format partition() predicate parameter with function type correctly", () => {
        const input = `## Parameters

### predicate

(\`value\`: \`T\`, \`index\`: \`number\`, \`array\`: \`T\`[]) => \`boolean\`

The function to test each element.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### predicate: `(value: T, index: number, array: T[]) => boolean`"
        );
        expect(result).toContain("The function to test each element.");
    });

    it("should format partition() Returns section with tuple type correctly", () => {
        const input = `## Returns

[\`T\`[], \`T\`[]]

A tuple containing [truthy elements, falsy elements].`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `[T[], T[]]`");
        expect(result).toContain(
            "A tuple containing [truthy elements, falsy elements]."
        );
    });

    it("should format unzip() type parameter T extends readonly unknown[] correctly", () => {
        const input = `## Type Parameters

### T

\`T\` extends \`readonly\` \`unknown\`[]

The type of the tuple elements.`;
        const result = reformatParameters(input);
        expect(result).toContain("### T: `T extends readonly unknown[]`");
        expect(result).toContain("The type of the tuple elements.");
    });

    it("should format unzip() Returns section with T[number][][] type correctly", () => {
        const input = `## Returns

\`T\`[\`number\`][][]

Returns the new array of regrouped elements.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `T[number][][]`");
        expect(result).toContain("Returns the new array of regrouped elements.");
    });

    it("should format dedupeByKey() fn parameter with Promise return type correctly", () => {
        const input = `## Parameters

### fn

() => \`Promise\`<\`T\`>

The async function to queue.`;
        const result = reformatParameters(input);
        expect(result).toContain("### fn: `() => Promise<T>`");
        expect(result).toContain("The async function to queue.");
    });

    it("should format defer() fn parameter with union return type correctly", () => {
        const input = `## Parameters

### fn

() => \`T\` | \`Promise\`<\`T\`>

The function to defer.`;
        const result = reformatParameters(input);
        expect(result).toContain("### fn: `() => T | Promise<T>`");
        expect(result).toContain("The function to defer.");
    });

    it("should format guard() Returns section with union Promise type correctly", () => {
        const input = `## Returns

\`Promise\`<\`T\` | \`undefined\`>

Promise that resolves to the function result or fallback value.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Promise<T | undefined>`");
        expect(result).toContain(
            "Promise that resolves to the function result or fallback value."
        );
    });

    it("should format retry() options parameter with default value correctly", () => {
        const input = `## Parameters

### options

\`RetryOptions\` = \`{}\`

Retry configuration options. Defaults to \`{ attempts: 3, delay: 1000, backoff: 1, maxDelay: 10000, until: () => true }\`.`;
        const result = reformatParameters(input);
        expect(result).toContain("### options: `RetryOptions = {}`");
        expect(result).toContain("Retry configuration options.");
    });

    it("should format countBy() collection parameter with union type correctly", () => {
        const input = `## Parameters

### collection

\`Record\`<\`string\`, \`T\`> | \`T\`[]

The collection to iterate over.`;
        const result = reformatParameters(input);
        expect(result).toContain("### collection: `Record<string, T> | T[]`");
        expect(result).toContain("The collection to iterate over.");
    });

    it("should format countBy() iteratee parameter with type alias correctly", () => {
        const input = `## Parameters

### iteratee

[CountByIteratee](../../../types/collection/count-by/type-aliases/CountByIteratee.md)<\`T\`>

The iteratee to transform keys.`;
        const result = reformatParameters(input);
        expect(result).toContain("### iteratee: `CountByIteratee<T>`");
        expect(result).toContain("The iteratee to transform keys.");
    });

    it("should format countBy() Returns section with Record type correctly", () => {
        const input = `## Returns

\`Record\`<\`string\`, \`number\`>

Returns the composed aggregate object with counts.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Record<string, number>`");
        expect(result).toContain(
            "Returns the composed aggregate object with counts."
        );
    });

    it("should format findBest() iteratee parameter with function type and generic return correctly", () => {
        const input = `## Parameters

### iteratee

(\`value\`: \`T\`, \`index\`: \`number\`, \`array\`: \`T\`[]) => \`U\`

The iteratee invoked per element to generate the criterion.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### iteratee: `(value: T, index: number, array: T[]) => U`"
        );
        expect(result).toContain(
            "The iteratee invoked per element to generate the criterion."
        );
    });

    it("should format findBest() compareFn parameter with function type correctly", () => {
        const input = `## Parameters

### compareFn

(\`a\`: \`U\`, \`b\`: \`U\`) => \`boolean\`

The comparison function to determine the result.`;
        const result = reformatParameters(input);
        expect(result).toContain("### compareFn: `(a: U, b: U) => boolean`");
        expect(result).toContain(
            "The comparison function to determine the result."
        );
    });

    it("should format findBest() Returns section with union type correctly", () => {
        const input = `## Returns

\`T\` | \`undefined\`

Returns the element that matches the comparison criteria, or \`undefined\` if the array is empty.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `T | undefined`");
        expect(result).toContain(
            "Returns the element that matches the comparison criteria, or `undefined` if the array is empty."
        );
    });

    it("should format groupBy() collection parameter with union type and readonly correctly", () => {
        const input = `## Parameters

### collection

\`Record\`<\`string\`, \`T\`> | readonly \`T\`[]

The collection to iterate over.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### collection: `Record<string, T> | readonly T[]`"
        );
        expect(result).toContain("The collection to iterate over.");
    });

    it("should format groupBy() iteratee parameter with function type and PropertyKey return correctly", () => {
        const input = `## Parameters

### iteratee

(\`value\`, \`key\`, \`collection\`) => \`PropertyKey\`

The iteratee to transform keys.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### iteratee: `(value, key, collection) => PropertyKey`"
        );
        expect(result).toContain("The iteratee to transform keys.");
    });

    it("should format groupBy() Returns section with Record type correctly", () => {
        const input = `## Returns

\`Record\`<\`string\`, \`T\`[]>

Returns the composed aggregate object.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Record<string, T[]>`");
        expect(result).toContain("Returns the composed aggregate object.");
    });

    it("should format keyBy() collection parameter with union type and readonly correctly", () => {
        const input = `## Parameters

### collection

\`Record\`<\`string\`, \`T\`> | readonly \`T\`[]

The collection to iterate over.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### collection: `Record<string, T> | readonly T[]`"
        );
        expect(result).toContain("The collection to iterate over.");
    });

    it("should format keyBy() iteratee parameter with function type and union return correctly", () => {
        const input = `## Parameters

### iteratee

(\`value\`, \`keyOrIndex\`, \`collection\`) => \`string\` | \`number\`

The iteratee to transform keys.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### iteratee: `(value, keyOrIndex, collection) => string | number`"
        );
        expect(result).toContain("The iteratee to transform keys.");
    });

    it("should format keyBy() Returns section with Record type correctly", () => {
        const input = `## Returns

\`Record\`<\`string\`, \`T\`>

Returns the composed aggregate object.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Record<string, T>`");
        expect(result).toContain("Returns the composed aggregate object.");
    });

    it("should format maxBy() collection parameter with union type and readonly correctly", () => {
        const input = `## Parameters

### collection

\`Record\`<\`string\`, \`T\`> | readonly \`T\`[]

The collection to iterate over.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### collection: `Record<string, T> | readonly T[]`"
        );
        expect(result).toContain("The collection to iterate over.");
    });

    it("should format maxBy() iteratee parameter with function type and union return correctly", () => {
        const input = `## Parameters

### iteratee

(\`value\`, \`keyOrIndex\`, \`collection\`) => \`string\` | \`number\`

The iteratee invoked per element.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### iteratee: `(value, keyOrIndex, collection) => string | number`"
        );
        expect(result).toContain("The iteratee invoked per element.");
    });

    it("should format after() type parameter Args extends unknown[] correctly", () => {
        const input = `## Type Parameters

### Args

\`Args\` extends \`unknown\`[]

The argument types of the function.`;
        const result = reformatParameters(input);
        expect(result).toContain("### Args: `Args extends unknown[]`");
        expect(result).toContain("The argument types of the function.");
    });

    it("should format after() type parameter Return correctly", () => {
        const input = `## Type Parameters

### Return

\`Return\`

The return type of the function.`;
        const result = reformatParameters(input);
        expect(result).toContain("### Return: `Return`");
        expect(result).toContain("The return type of the function.");
    });

    it("should format after() n parameter correctly", () => {
        const input = `## Parameters

### n

\`number\`

The number of calls before func is invoked.`;
        const result = reformatParameters(input);
        expect(result).toContain("### n: `number`");
        expect(result).toContain("The number of calls before func is invoked.");
    });

    it("should format after() func parameter with rest parameters correctly", () => {
        const input = `## Parameters

### func

(...\`args\`) => \`Return\`

The function to restrict.`;
        const result = reformatParameters(input);
        expect(result).toContain("### func: `(...args) => Return`");
        expect(result).toContain("The function to restrict.");
    });

    it("should format debounce() type parameter TArgs extends unknown[] correctly", () => {
        const input = `## Type Parameters

### TArgs

\`TArgs\` extends \`unknown\`[]

The argument types of the function.`;
        const result = reformatParameters(input);
        expect(result).toContain("### TArgs: `TArgs extends unknown[]`");
        expect(result).toContain("The argument types of the function.");
    });

    it("should format debounce() type parameter TThis with default value correctly", () => {
        const input = `## Type Parameters

### TThis

\`TThis\` = \`unknown\`

The type of \`this\` context.`;
        const result = reformatParameters(input);
        expect(result).toContain("### TThis: `TThis = unknown`");
        expect(result).toContain("The type of `this` context.");
    });

    it("should format debounce() func parameter with this parameter correctly", () => {
        const input = `## Parameters

### func

(\`this\`, ...\`args\`) => \`R\`

The function to debounce.`;
        const result = reformatParameters(input);
        expect(result).toContain("### func: `(this, ...args) => R`");
        expect(result).toContain("The function to debounce.");
    });

    it("should format debounce() immediate parameter with default value correctly", () => {
        const input = `## Parameters

### immediate

\`boolean\` = \`false\`

If \`true\`, trigger the function on the leading edge instead of the trailing edge. Defaults to \`false\`.`;
        const result = reformatParameters(input);
        expect(result).toContain("### immediate: `boolean = false`");
        expect(result).toContain(
            "If `true`, trigger the function on the leading edge instead of the trailing edge."
        );
    });

    it("should format debounce() Returns section with intersection type correctly", () => {
        const input = `## Returns

(\`this\`, ...\`args\`) => \`void\` & \`object\`

Returns the new debounced function with cancel method.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `(this, ...args) => void & object`");
        expect(result).toContain(
            "Returns the new debounced function with cancel method."
        );
    });

    it("should format flip() type parameter Rest extends unknown[] correctly", () => {
        const input = `## Type Parameters

### Rest

\`Rest\` extends \`unknown\`[]

The rest argument types of the function.`;
        const result = reformatParameters(input);
        expect(result).toContain("### Rest: `Rest extends unknown[]`");
        expect(result).toContain("The rest argument types of the function.");
    });

    it("should format flip() fn parameter with rest parameters correctly", () => {
        const input = `## Parameters

### fn

(\`a\`, \`b\`, ...\`rest\`) => \`R\`

The function to flip.`;
        const result = reformatParameters(input);
        expect(result).toContain("### fn: `(a, b, ...rest) => R`");
        expect(result).toContain("The function to flip.");
    });

    it("should format evolve() type parameter T extends Record<string, unknown> correctly", () => {
        const input = `## Type Parameters

### T

\`T\` extends \`Record\`<\`string\`, \`unknown\`>

The type of the input object.`;
        const result = reformatParameters(input);
        expect(result).toContain("### T: `T extends Record<string, unknown>`");
        expect(result).toContain("The type of the input object.");
    });

    it("should format evolve() type parameter Tr extends Transformations<T> correctly", () => {
        const input = `## Type Parameters

### Tr

\`Tr\` extends [Transformations](../../../types/object/evolve/type-aliases/Transformations.md)<\`T\`>

The type of the output object (inferred from transformations).`;
        const result = reformatParameters(input);
        expect(result).toContain("### Tr: `Tr extends Transformations<T>`");
        expect(result).toContain(
            "The type of the output object (inferred from transformations)."
        );
    });

    it("should format evolve() transformations parameter with generic type correctly", () => {
        const input = `## Parameters

### transformations

\`Tr\`

An object where keys are property names and values are transformation functions.`;
        const result = reformatParameters(input);
        expect(result).toContain("### transformations: `Tr`");
        expect(result).toContain(
            "An object where keys are property names and values are transformation functions."
        );
    });

    it("should format invert() type parameter T with complex extends constraint correctly", () => {
        const input = `## Type Parameters

### T

\`T\` extends \`Record\`<\`string\` | \`number\` | \`symbol\`, \`string\` | \`number\` | \`symbol\`>

The type of the input object.`;
        const result = reformatParameters(input);
        expect(result).toContain(
            "### T: `T extends Record<string | number | symbol, string | number | symbol>`"
        );
        expect(result).toContain("The type of the input object.");
    });

    it("should format invert() Returns section with indexed access types correctly", () => {
        const input = `## Returns

\`Record\`<\`T\`[\`keyof\` \`T\`], \`keyof\` \`T\`>

Returns a new object with keys and values swapped.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `Record<T[keyof T], keyof T>`");
        expect(result).toContain(
            "Returns a new object with keys and values swapped."
        );
    });

    it("should format mergeDeepLeft() type parameter T extends AnyRecord correctly", () => {
        const input = `## Type Parameters

### T

\`T\` extends [AnyRecord](../../../types/object/merge-deep/type-aliases/AnyRecord.md)

The type of the left object.`;
        const result = reformatParameters(input);
        expect(result).toContain("### T: `T extends AnyRecord`");
        expect(result).toContain("The type of the left object.");
    });

    it("should format mergeDeepLeft() type parameter U extends AnyRecord correctly", () => {
        const input = `## Type Parameters

### U

\`U\` extends [AnyRecord](../../../types/object/merge-deep/type-aliases/AnyRecord.md)

The type of the right object.`;
        const result = reformatParameters(input);
        expect(result).toContain("### U: `U extends AnyRecord`");
        expect(result).toContain("The type of the right object.");
    });

    it("should format mergeDeepLeft() Returns section with intersection type correctly", () => {
        const input = `## Returns

\`T\` & \`U\`

A new deeply merged object.`;
        const result = reformatParameters(input);
        expect(result).toContain("## Returns: `T & U`");
        expect(result).toContain("A new deeply merged object.");
    });

    it("should format intersectionBy() iteratee parameter with union type correctly", () => {
        const input = `## Parameters

### iteratee

Property name or function to extract the comparison value from each element.

keyof \`T\` | (\`item\`) => \`unknown\`

## Returns`;
        const result = reformatParameters(input);

        const expectedFormattedHeading =
            "### iteratee: `keyof T | (item) => unknown`";
        expect(result).toContain(expectedFormattedHeading);

        const unformattedPattern =
            "### iteratee\n\nProperty name or function to extract the comparison value from each element.\n\nkeyof";
        expect(result).not.toContain(unformattedPattern);

        const hasTypeOnSeparateLine = /### iteratee\n\n[^\n]+\n\nkeyof/.test(
            result
        );
        expect(hasTypeOnSeparateLine).toBe(false);

        expect(result).toContain(
            "Property name or function to extract the comparison value from each element."
        );

        const headingIndex = result.indexOf(expectedFormattedHeading);
        const descriptionIndex = result.indexOf(
            "Property name or function to extract the comparison value from each element."
        );
        expect(headingIndex).not.toBe(-1);
        expect(descriptionIndex).not.toBe(-1);
        expect(headingIndex).toBeLessThan(descriptionIndex);
    });

    it("should format intersectionBy() iteratee parameter with union type - REAL TypeDoc format (type ends before next section)", () => {
        const input = `## Parameters

### arrays

\`T\`[][]

The arrays to intersect.

### iteratee

Property name or function to extract the comparison value from each element.

keyof \`T\` | (\`item\`) => \`unknown\`

## Returns

\`T\`[]`;
        const result = reformatParameters(input);

        const expectedFormattedHeading =
            "### iteratee: `keyof T | (item) => unknown`";
        expect(result).toContain(expectedFormattedHeading);

        const unformattedBugPattern =
            /### iteratee\n\nProperty name or function to extract the comparison value from each element\.\n\nkeyof/;
        expect(result).not.toMatch(unformattedBugPattern);

        const hasTypeAfterDescription = /### iteratee\n\n[^\n]+\n\nkeyof/.test(
            result
        );
        expect(hasTypeAfterDescription).toBe(false);

        expect(result).toContain(
            "Property name or function to extract the comparison value from each element."
        );

        const headingIndex = result.indexOf(expectedFormattedHeading);
        const descriptionIndex = result.indexOf(
            "Property name or function to extract the comparison value from each element."
        );
        expect(headingIndex).not.toBe(-1);
        expect(descriptionIndex).not.toBe(-1);
        expect(headingIndex).toBeLessThan(descriptionIndex);

        expect(result).toContain("## Returns");
        const returnsIndex = result.indexOf("## Returns");
        expect(returnsIndex).toBeGreaterThan(headingIndex);
    });

    it("should format intersectionBy() iteratee when type comes BEFORE description", () => {
        const input = `## Parameters

### iteratee

\`keyof\` \`T\` | (\`item\`: \`T\`) => \`unknown\`

Property name or function to extract the comparison value from each element.`;
        const result = reformatParameters(input);
        expect(result).toContain("### iteratee: `keyof T | (item: T) => unknown`");
    });

    it("should format intersectionBy() iteratee when description comes BEFORE type", () => {
        const input = `## Parameters

### iteratee

Property name or function to extract the comparison value from each element.

\`keyof\` \`T\` | (\`item\`: \`T\`) => \`unknown\`

`;
        const result = reformatParameters(input);
        expect(result).toContain("### iteratee: `keyof T | (item: T) => unknown`");
        expect(result).toContain(
            "Property name or function to extract the comparison value from each element."
        );
    });
});

describe("reformatParameters - Interface properties (TypeDoc blockquote format)", () => {
    it("should format optional interface property with number type", () => {
        const input = `### attempts?

> \`optional\` **attempts**: \`number\`

Number of retry attempts. Defaults to \`3\`.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### attempts?: `number`");
        expect(result).toContain("Number of retry attempts. Defaults to `3`.");
        expect(result).not.toContain("> `optional`");
        expect(result).not.toContain("**attempts**");
    });

    it("should format required interface property with string type", () => {
        const input = `### name

> **name**: \`string\`

The name property.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### name: `string`");
        expect(result).toContain("The name property.");
        expect(result).not.toContain("> **name**");
    });

    it("should format optional interface method with function type", () => {
        const input = `### until()?

> \`optional\` **until**: (\`error\`) => \`boolean\`

Function to determine if error should trigger retry.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### until()?: `(error) => boolean`");
        expect(result).toContain("Function to determine if error should trigger retry.");
        expect(result).not.toContain("> `optional`");
    });

    it("should format multiple interface properties correctly", () => {
        const input = `### attempts?

> \`optional\` **attempts**: \`number\`

Number of retry attempts.

### delay?

> \`optional\` **delay**: \`number\`

Initial delay between retries.

### name

> **name**: \`string\`

The name.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### attempts?: `number`");
        expect(result).toContain("### delay?: `number`");
        expect(result).toContain("### name: `string`");
        expect(result).not.toContain("> `optional`");
        expect(result).not.toContain("> **name**");
    });

    it("should format RetryOptions interface properties (real-world example)", () => {
        const input = `## Properties

### attempts?

> \`optional\` **attempts**: \`number\`

Number of retry attempts. Defaults to \`3\`.

### delay?

> \`optional\` **delay**: \`number\`

Initial delay between retries in milliseconds. Defaults to \`1000\`.

### backoff?

> \`optional\` **backoff**: \`number\`

Backoff multiplier for delay. Defaults to \`1\` (no backoff).

### maxDelay?

> \`optional\` **maxDelay**: \`number\`

Maximum delay between retries in milliseconds. Defaults to \`10000\`.

### jitter?

> \`optional\` **jitter**: \`number\`

Random jitter factor (0-1) to add variation to delay. Defaults to \`0\`.

### until()?

> \`optional\` **until**: (\`error\`) => \`boolean\`

Function to determine if error should trigger retry. Return \`false\` to abort.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### attempts?: `number`");
        expect(result).toContain("### delay?: `number`");
        expect(result).toContain("### backoff?: `number`");
        expect(result).toContain("### maxDelay?: `number`");
        expect(result).toContain("### jitter?: `number`");
        expect(result).toContain("### until()?: `(error) => boolean`");
        expect(result).not.toContain("> `optional`");
        expect(result).not.toContain("**attempts**");
    });
});

describe("reformatParameters - Readonly properties (const object properties)", () => {
    it("should format readonly property with string literal type and default value", () => {
        const input = `### string

> \`readonly\` **string**: \`"Expected string"\` = \`"Expected string"\`

Error message for string validation.

`;
        const result = reformatParameters(input);
        expect(result).toContain('### string: <code>"Expected string"</code>');
        expect(result).toContain("Error message for string validation.");
        expect(result).not.toContain("> `readonly`");
        expect(result).not.toContain("**string**");
        expect(result).not.toContain('= `"Expected string"`');
    });

    it("should format readonly method with function type", () => {
        const input = `### minLength()

> \`readonly\` **minLength**: (\`min\`) => \`string\`

Function to generate min length error message.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### minLength(): <code>(min) =&gt; string</code>");
        expect(result).toContain("Function to generate min length error message.");
        expect(result).not.toContain("> `readonly`");
        expect(result).not.toContain("**minLength**");
    });

    it("should format readonly property without default value", () => {
        const input = `### number

> \`readonly\` **number**: \`"Expected number"\`

Error message for number validation.

`;
        const result = reformatParameters(input);
        expect(result).toContain('### number: <code>"Expected number"</code>');
        expect(result).toContain("Error message for number validation.");
        expect(result).not.toContain("> `readonly`");
    });

    it("should format multiple readonly properties correctly", () => {
        const input = `### string

> \`readonly\` **string**: \`"Expected string"\` = \`"Expected string"\`

### number

> \`readonly\` **number**: \`"Expected number"\` = \`"Expected number"\`

### minLength()

> \`readonly\` **minLength**: (\`min\`) => \`string\`

### maxLength()

> \`readonly\` **maxLength**: (\`max\`) => \`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain('### string: <code>"Expected string"</code>');
        expect(result).toContain('### number: <code>"Expected number"</code>');
        expect(result).toContain("### minLength(): <code>(min) =&gt; string</code>");
        expect(result).toContain("### maxLength(): <code>(max) =&gt; string</code>");
        expect(result).not.toContain("> `readonly`");
        expect(result).not.toContain("**string**");
        expect(result).not.toContain("**minLength**");
    });

    it("should format ERROR_MESSAGES_COMPOSITION properties (real-world example)", () => {
        const input = `## Type Declaration

### string

> \`readonly\` **string**: \`"Expected string"\` = \`"Expected string"\`

### number

> \`readonly\` **number**: \`"Expected number"\` = \`"Expected number"\`

### boolean

> \`readonly\` **boolean**: \`"Expected boolean"\` = \`"Expected boolean"\`

### minLength()

> \`readonly\` **minLength**: (\`min\`) => \`string\`

#### Parameters

##### min

\`number\`

#### Returns

\`string\`

### maxLength()

> \`readonly\` **maxLength**: (\`max\`) => \`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain('### string: <code>"Expected string"</code>');
        expect(result).toContain('### number: <code>"Expected number"</code>');
        expect(result).toContain('### boolean: <code>"Expected boolean"</code>');
        expect(result).toContain("### minLength(): <code>(min) =&gt; string</code>");
        expect(result).toContain("### maxLength(): <code>(max) =&gt; string</code>");
        expect(result).not.toContain("> `readonly`");
        expect(result).not.toContain('= `"Expected string"`');
    });

    it("should escape special characters in readonly property types", () => {
        const input = `### genericProp

> \`readonly\` **genericProp**: \`Record<string, unknown>\`

Property with generic type.

`;
        const result = reformatParameters(input);
        expect(result).toContain("### genericProp: <code>Record&lt;string, unknown&gt;</code>");
        expect(result).not.toContain("<string, unknown>");
    });
});

describe("reformatParameters - Nested method sections in readonly properties", () => {
    it("should reformat nested Parameters and Returns sections compactly", () => {
        const input = `### minLength()

> \`readonly\` **minLength**: (\`min\`) => \`string\`

#### Parameters

##### min

\`number\`

#### Returns

\`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain("> **min**: `number`");
        expect(result).toContain("> **Returns**: `string`");
        expect(result).not.toContain("#### Parameters");
        expect(result).not.toContain("#### Returns");
        expect(result).not.toContain("##### min");
    });

    it("should handle multiple parameters in nested sections", () => {
        const input = `### literal()

> \`readonly\` **literal**: (\`expected\`, \`actualType\`) => \`string\`

#### Parameters

##### expected

\`unknown\`

##### actualType

\`string\`

#### Returns

\`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain("> **expected**: `unknown`");
        expect(result).toContain("> **actualType**: `string`");
        expect(result).toContain("> **Returns**: `string`");
        expect(result).not.toContain("#### Parameters");
        expect(result).not.toContain("##### expected");
    });

    it("should handle methods without parameters", () => {
        const input = `### coerceNumber

> \`readonly\` **coerceNumber**: \`"Cannot coerce to number"\` = \`"Cannot coerce to number"\`

`;
        const result = reformatParameters(input);
        // Should not add Parameters/Returns sections for non-function properties
        expect(result).not.toContain("> **");
        expect(result).not.toContain("**Returns**:");
    });

    it("should format ERROR_MESSAGES_COMPOSITION methods (real-world example)", () => {
        const input = `### minLength()

> \`readonly\` **minLength**: (\`min\`) => \`string\`

#### Parameters

##### min

\`number\`

#### Returns

\`string\`

### maxLength()

> \`readonly\` **maxLength**: (\`max\`) => \`string\`

#### Parameters

##### max

\`number\`

#### Returns

\`string\`

### pattern()

> \`readonly\` **pattern**: (\`regex\`) => \`string\`

#### Parameters

##### regex

\`RegExp\`

#### Returns

\`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain("> **min**: `number`");
        expect(result).toContain("> **max**: `number`");
        expect(result).toContain("> **regex**: `RegExp`");
        expect(result).toContain("> **Returns**: `string`");
        expect(result).not.toContain("#### Parameters");
        expect(result).not.toContain("#### Returns");
    });

    it("should handle parameters with readonly prefix outside backticks", () => {
        const input = `### enum()

> \`readonly\` **enum**: (\`values\`, \`actualType\`) => \`string\`

#### Parameters

##### values

readonly \`unknown\`[]

##### actualType

\`string\`

#### Returns

\`string\`

`;
        const result = reformatParameters(input);
        expect(result).toContain("> **values**: `readonly unknown[]`");
        expect(result).toContain("> **actualType**: `string`");
        expect(result).toContain("> **Returns**: `string`");
        expect(result).not.toContain("#### Parameters");
        expect(result).not.toContain("##### values");
    });
});

describe("reformatParameters - general parameter sections", () => {
  it("should format regular function parameters with Returns", () => {
    const input = `### function()

#### Parameters

##### schema

\`Schema<T>\`

Schema to validate against.

##### input

\`unknown\`

Value to validate.

#### Returns

\`Result\`

Some description`;

    const expected = `### function()

> **schema**: \`Schema<T>\` - Schema to validate against.<br />
> **input**: \`unknown\` - Value to validate.<br />
> **Returns**: \`Result\`

Some description`;

    const result = reformatParameters(input);
    expect(result).toBe(expected);
  });

  it("should format parameters without descriptions", () => {
    const input = `### function()

#### Parameters

##### schema

\`Schema<T>\`

##### input

\`unknown\`

#### Returns

\`Result\``;

    const expected = `### function()

> **schema**: \`Schema<T>\`<br />
> **input**: \`unknown\`<br />
> **Returns**: \`Result\``;

    const result = reformatParameters(input);
    expect(result).toBe(expected);
  });

  it("should format parameters without Returns section", () => {
    const input = `### function()

#### Parameters

##### schema

\`Schema<T>\`

Schema to validate.

##### input

\`unknown\`

### Next Section`;

    const expected = `### function()

> **schema**: \`Schema<T>\` - Schema to validate.<br />
> **input**: \`unknown\`

### Next Section`;

    const result = reformatParameters(input);
    expect(result).toBe(expected);
  });

  it("should handle multi-line descriptions", () => {
    const input = `### function()

#### Parameters

##### schema

\`Schema<T>\`

Schema to validate against.
This is a longer description.

##### input

\`unknown\`

Value to validate.

#### Returns

\`Result\``;

    const expected = `### function()

> **schema**: \`Schema<T>\` - Schema to validate against.
This is a longer description.<br />
> **input**: \`unknown\` - Value to validate.<br />
> **Returns**: \`Result\``;

    const result = reformatParameters(input);
    expect(result).toBe(expected);
  });

  it("should handle optional parameters with ?", () => {
    const input = `### function()

#### Parameters

##### message?

\`string\`

Custom error message.

#### Returns

\`Schema\``;

    const expected = `### function()

> **message?**: \`string\` - Custom error message.<br />
> **Returns**: \`Schema\``;

    const result = reformatParameters(input);
    expect(result).toBe(expected);
  });

  it("should handle complex types without backticks", () => {
    const input = `### function()

#### Parameters

##### schema

[ObjectSchema](../types/ObjectSchema.md)<T> | [ObjectConstraint](../types/ObjectConstraint.md)<T>

Object schema to make partial.

#### Returns

[PartialSchema](../types/PartialSchema.md)<[ObjectSchema](../types/ObjectSchema.md)<T>>`;

    const result = reformatParameters(input);
    expect(result).toContain("> **schema**: `[ObjectSchema](../types/ObjectSchema.md)<T> | [ObjectConstraint](../types/ObjectConstraint.md)<T>` - Object schema to make partial.<br />");
    expect(result).toContain("> **Returns**: `[PartialSchema](../types/PartialSchema.md)<[ObjectSchema](../types/ObjectSchema.md)<T>>`");
  });
});
