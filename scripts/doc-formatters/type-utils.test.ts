import { describe, it, expect } from "vitest";
import { wrapFullType, looksLikeType } from "./type-utils.js";

describe("wrapFullType", () => {
    it("should wrap simple types in backticks", () => {
        expect(wrapFullType("string")).toBe("`string`");
        expect(wrapFullType("number")).toBe("`number`");
        expect(wrapFullType("boolean")).toBe("`boolean`");
    });

    it("should handle generic types", () => {
        expect(wrapFullType("Promise<T>")).toBe("`Promise<T>`");
        expect(wrapFullType("Array<string>")).toBe("`Array<string>`");
        expect(wrapFullType("Record<string, number>")).toBe(
            "`Record<string, number>`"
        );
    });

    it("should remove escape backslashes", () => {
        expect(wrapFullType("\\[\\]")).toBe("`[]`");
        expect(wrapFullType("\\|")).toBe("`|`");
        expect(wrapFullType("\\<\\>")).toBe("`<>`");
        expect(wrapFullType("\\{\\}")).toBe("`{}`");
    });

    it("should remove markdown italics", () => {
        expect(wrapFullType("*text*")).toBe("`text`");
        expect(wrapFullType("Promise<*T*>")).toBe("`Promise<T>`");
    });

    it("should wrap types with links in HTML code tag with escaped angle brackets", () => {
        // Types with links use <code> with &lt; &gt; for MDX compatibility
        expect(
            wrapFullType(
                "[Arrayable](../../../types/common/arrayable/type-aliases/Arrayable.md)<T>"
            )
        ).toBe("<code>[Arrayable](../../../types/common/arrayable/type-aliases/Arrayable.md)&lt;T&gt;</code>");
    });

    it("should wrap Returns types with links in HTML code tag with escaped angle brackets", () => {
        // Returns with link - uses <code> with HTML entities for MDX
        expect(
            wrapFullType(
                "[`Evolved`](../type-aliases/Evolved.md)\\<`T`, `Tr`\\>"
            )
        ).toBe("<code>[Evolved](../type-aliases/Evolved.md)&lt;T, Tr&gt;</code>");
    });

    it("should wrap type constraints with extends in HTML code tag", () => {
        // Type parameter with extends and link - uses <code> for styling
        expect(
            wrapFullType(
                "`KeySchema` *extends* [`GenericSchema`](../../types/GenericSchema.md)"
            )
        ).toBe("<code>KeySchema extends [GenericSchema](../../types/GenericSchema.md)</code>");

        expect(
            wrapFullType(
                "`T` *extends* [`AnyRecord`](../../../types/object/merge-deep/type-aliases/AnyRecord.md)"
            )
        ).toBe("<code>T extends [AnyRecord](../../../types/object/merge-deep/type-aliases/AnyRecord.md)</code>");
    });

    it("should escape angle brackets but preserve curly braces inside HTML code tag", () => {
        // Type with link - angle brackets escaped, curly braces preserved
        expect(
            wrapFullType(
                "[`Schema`](link.md)\\<`T`\\> & `{ [K in D]: LiteralSchema }`"
            )
        ).toBe("<code>[Schema](link.md)&lt;T&gt; & { [K in D]: LiteralSchema }</code>");
    });

    it("should escape generic type parameters for MDX compatibility", () => {
        // Function type with generics - must escape < and > for MDX
        expect(
            wrapFullType(
                "(a) => [`TaskEither`](./TaskEither.md)\\<`E2`, `B`\\>"
            )
        ).toBe("<code>(a) =&gt; [TaskEither](./TaskEither.md)&lt;E2, B&gt;</code>");
    });

    it("should handle complex types", () => {
        expect(wrapFullType("(a: T, b: U) => R")).toBe("`(a: T, b: U) => R`");
        expect(wrapFullType("Promise<{ [K in keyof T]: Awaited<T[K]> }>")).toBe(
            "`Promise<{ [K in keyof T]: Awaited<T[K]> }>`"
        );
    });

    it("should fix TypeDoc bug: readonly readonly T[][] -> readonly (readonly T[])[]", () => {
        // TypeDoc sometimes generates "readonly readonly T[][]" instead of "readonly (readonly T[])[]"
        expect(wrapFullType("readonly readonly T[][]")).toBe(
            "`readonly (readonly T[])[]`"
        );
        // For Array<T>[][], the first [] is part of the inner type
        expect(wrapFullType("readonly readonly Array<T>[][]")).toBe(
            "`readonly (readonly Array<T>[])[]`"
        );
    });
});

describe("looksLikeType", () => {
    it("should identify simple types", () => {
        expect(looksLikeType("string")).toBe(true);
        expect(looksLikeType("number")).toBe(true);
        expect(looksLikeType("Promise<T>")).toBe(true);
    });

    it("should identify function types", () => {
        expect(looksLikeType("(a, b) => boolean")).toBe(true);
        expect(looksLikeType("() => void")).toBe(true);
    });

    it("should identify types with backticks", () => {
        expect(looksLikeType("`Promise<T>`")).toBe(true);
        expect(looksLikeType("`string`")).toBe(true);
    });

    it("should identify union types", () => {
        expect(looksLikeType("string | number")).toBe(true);
        expect(looksLikeType("T | U")).toBe(true);
    });

    it("should identify generic types", () => {
        expect(looksLikeType("Array<T>")).toBe(true);
        expect(looksLikeType("Promise<Result<T, E>>")).toBe(true);
    });

    it("should not identify descriptions as types", () => {
        expect(looksLikeType("The function returns a value")).toBe(false);
        // Note: Descriptions containing type keywords like "Promise" will match
        // but in practice, reformatParameters uses additional context (length, position, etc.)
        // to distinguish types from descriptions
        expect(
            looksLikeType(
                "This is a very long description that does not contain any type keywords and should not be identified as a type because it is longer than 100 characters and starts with a capital letter"
            )
        ).toBe(false);
    });

    it("should not identify descriptions starting with capital letter as types", () => {
        // Description containing type keywords but starting with capital letter
        // should NOT be identified as a type
        expect(
            looksLikeType(
                "Property path as dot notation string or array of keys (string, number, or symbol)."
            )
        ).toBe(false);

        expect(
            looksLikeType(
                "Schema to validate keys (must be Schema<string>)."
            )
        ).toBe(false);

        expect(
            looksLikeType(
                "Ensure expensive setup runs only once even when triggered from multiple entry points."
            )
        ).toBe(false);
    });

    it("should identify types starting with backticks even if they have capital letters after", () => {
        // Types starting with backticks should be identified even if description follows
        expect(looksLikeType("`string` | `number`")).toBe(true);
        expect(looksLikeType("`Promise<T>`")).toBe(true);
    });

    it("should identify types with keyof", () => {
        expect(looksLikeType("keyof T")).toBe(true);
        expect(looksLikeType("keyof T | (item) => unknown")).toBe(true);
    });

    it("should identify rest parameters", () => {
        expect(looksLikeType("...TArgs")).toBe(true);
        expect(looksLikeType("...Rest")).toBe(true);
    });

    it("should detect keyof T | (item) => unknown as a type from TypeScript source", () => {
        // Test that looksLikeType correctly identifies this union type
        // Starting from the TypeScript source format
        const tsSourceType = "keyof T | ((item: T) => unknown)";
        expect(looksLikeType(tsSourceType)).toBe(true);

        // Test with TypeDoc's formatted version (backticks around each part)
        const typeDocFormatted = "`keyof` `T` | (`item`: `T`) => `unknown`";
        expect(looksLikeType(typeDocFormatted)).toBe(true);

        // Test the actual line that TypeDoc generates (what reformatParameters receives)
        const typeDocLine = "`keyof` `T` | (`item`: `T`) => `unknown`";
        expect(looksLikeType(typeDocLine)).toBe(true);
    });
});
