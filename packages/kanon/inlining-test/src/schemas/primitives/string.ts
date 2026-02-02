// /schemas/primitives/string.ts
export interface StringSchema {
  type: "string";
  validator: (value: unknown) => true | string;
}

export function createStringSchema(message?: string): StringSchema {
  return {
    type: "string",
    validator: (value: unknown) => {
      if (typeof value === "string") {
        return true;
      }
      return message || "Expected string";
    },
  };
}

export const DEFAULT_STRING_SCHEMA = createStringSchema();




