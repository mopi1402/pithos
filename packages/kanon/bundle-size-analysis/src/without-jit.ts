// Test sans JIT: Schema utilisateur simple (baseline)
import { string, number, boolean, object, parse } from "@pithos/kanon/v3";

const userSchema = object({
  name: string(),
  age: number(),
  employed: boolean(),
});

export const validateUser = (data: unknown) => {
  return parse(userSchema, data);
};
