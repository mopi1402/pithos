import { describe } from "vitest";

// Existing benchmarks
import { primitiveTypesCombinedRealWorldUsage } from "./benchs/primitive_types_combined_real_world_usage";
import { objectsWithConstraintsUserRegistration } from "./benchs/objects_with_constraints_user_registration";
import { stringValidationLongString } from "./benchs/string_validation_long_string";
import { simpleObjectValidation } from "./benchs/simple_object_validation";
import { complexObjectValidation } from "./benchs/complex_object_validation";
import { arrayValidationStrings } from "./benchs/array_validation_strings";
import { arrayValidationLarge } from "./benchs/array_validation_large";
import { errorHandlingStrings } from "./benchs/error_handling_strings";
import { errorHandlingObjects } from "./benchs/error_handling_objects";
import { bulkValidationStrings } from "./benchs/bulk_validation_strings";
import { bulkValidationObjects } from "./benchs/bulk_validation_objects";
import {
  earlyAbortTests,
  earlyAbortWithErrorsTests,
} from "./benchs/early_abort_tests";
import {
  v3NewTypesSimpleTests,
  v3NewTypesConstrainedTests,
  v3NewTypesAppliedTests,
} from "./benchs/v3_new_types_tests";
import {
  pipeCompositionTests,
  pipeWithConstraintsTests,
  pipeWithErrorHandlingTests,
} from "./benchs/pipe_composition_tests";
import {
  transformApproachesTests,
  transformWithConstraintsTests,
} from "./benchs/transform_tests";
import { enumTests } from "./benchs/enum_tests";

// NEW: Optional/Nullable benchmarks
import {
  optionalFieldsTests,
  nullableFieldsTests,
  optionalAndNullableCombinedTests,
} from "./benchs/optional_nullable_fields";

// NEW: String patterns benchmarks
import {
  emailValidationTests,
  urlValidationTests,
  uuidValidationTests,
  regexValidationTests,
  ipValidationTests,
  combinedPatternValidationTests,
} from "./benchs/string_patterns";

// NEW: Union/Discriminated union benchmarks
import {
  discriminatedUnionApiResponseTests,
  discriminatedUnionEventTests,
  simpleUnionTests,
} from "./benchs/union_discriminated";

// NEW: JIT Union benchmarks
import {
  jitUnion2BranchTests,
  jitUnion4BranchTests,
  jitUnion2BranchInvalidTests,
  jitUnion4BranchInvalidTests,
} from "./benchs/union_jit";

// NEW: Coercion benchmarks
import {
  coerceNumberTests,
  coerceBooleanTests,
  coerceDateTests,
  coerceBigIntTests,
  coerceFormDataTests,
  coerceQueryParamsTests,
} from "./benchs/coercion_tests";

// NEW: Partial/Pick/Omit benchmarks
import {
  partialSchemaTests,
  pickSchemaTests,
  omitSchemaTests,
  extendSchemaTests,
  mergeSchemaTests,
  deepPartialTests,
} from "./benchs/partial_pick_omit";

// NEW: Refinement benchmarks
import {
  simpleRefinementTests,
  passwordStrengthRefinementTests,
  objectRefinementTests,
  arrayRefinementTests,
  crossFieldValidationTests,
  conditionalRefinementTests,
} from "./benchs/refinements_custom";

import { parse as parseV3 } from "@kanon/core/parser.js";
import { schemas as schemasDataset } from "./dataset/schemas";
import * as poolHelpers from "./helpers/pool_helpers";
import * as valibot from "valibot";
import * as s from "superstruct";
import { Value } from "@sinclair/typebox/value";

describe("🚀 Kanon vs others:", () => {
  const schemas = schemasDataset;
  console.log("✅ Schemas generated");

  // ===== WARMUP =====
  console.log("🔥 Starting warmup with pooled data...");

  const runWarmup = () => {
    for (let i = 0; i < 1000; i++) {
      parseV3(schemas.kanonV3.string, poolHelpers.getString());
      schemas.zod.string.safeParse(poolHelpers.getString());
      valibot.safeParse(schemas.valibot.string, poolHelpers.getString());
      s.is(poolHelpers.getString(), schemas.superstruct.string);
      schemas.fastestValidator.string(poolHelpers.getString());
      Value.Check(schemas.typebox.string, poolHelpers.getString());
      schemas.ajv.string(poolHelpers.getString());

      parseV3(schemas.kanonV3.number, poolHelpers.getNumber());
      schemas.zod.number.safeParse(poolHelpers.getNumber());
      valibot.safeParse(schemas.valibot.number, poolHelpers.getNumber());
      s.is(poolHelpers.getNumber(), schemas.superstruct.number);
      schemas.fastestValidator.number(poolHelpers.getNumber());
      Value.Check(schemas.typebox.number, poolHelpers.getNumber());
      schemas.ajv.number(poolHelpers.getNumber());

      if (i % 10 === 0) {
        parseV3(schemas.kanonV3.simpleObject, poolHelpers.getSimpleObject());
        schemas.zod.simpleObject.safeParse(poolHelpers.getSimpleObject());
        valibot.safeParse(
          schemas.valibot.simpleObject,
          poolHelpers.getSimpleObject()
        );
        s.is(poolHelpers.getSimpleObject(), schemas.superstruct.simpleObject);
        schemas.fastestValidator.simpleObject(poolHelpers.getSimpleObject());
        Value.Check(
          schemas.typebox.simpleObject,
          poolHelpers.getSimpleObject()
        );
        schemas.ajv.simpleObject(poolHelpers.getSimpleObject());
      }
      parseV3(schemas.kanonV3.string, poolHelpers.getInvalidString());
      schemas.zod.string.safeParse(poolHelpers.getInvalidString());
      valibot.safeParse(schemas.valibot.string, poolHelpers.getInvalidString());
      try {
        s.is(poolHelpers.getInvalidString(), schemas.superstruct.string);
      } catch {
        // Expected error
      }
      schemas.fastestValidator.string(poolHelpers.getInvalidString());
      Value.Check(schemas.typebox.string, poolHelpers.getInvalidString());
      schemas.ajv.string(poolHelpers.getInvalidString());
    }
  };

  runWarmup();
  console.log("✅ Warmup completed");
  console.log("🎬 Starting benchmarks...");

  // =====================================================
  // PRIMITIVES
  // =====================================================

  poolHelpers.runBenchmarkSuite("primitives", primitiveTypesCombinedRealWorldUsage());
  poolHelpers.runBenchmarkSuite("null/undefined/any/unknown", v3NewTypesSimpleTests());
  poolHelpers.runBenchmarkSuite("date/bigint", v3NewTypesConstrainedTests());
  poolHelpers.runBenchmarkSuite("date/bigint + min/max", v3NewTypesAppliedTests());
  poolHelpers.runBenchmarkSuite("enum", enumTests());

  // =====================================================
  // STRINGS
  // =====================================================

  poolHelpers.runBenchmarkSuite("string long (5000 chars)", stringValidationLongString());
  poolHelpers.runBenchmarkSuite("string.email", emailValidationTests());
  poolHelpers.runBenchmarkSuite("string.url", urlValidationTests());
  poolHelpers.runBenchmarkSuite("string.uuid", uuidValidationTests());
  poolHelpers.runBenchmarkSuite("string.regex", regexValidationTests());
  poolHelpers.runBenchmarkSuite("string.ip", ipValidationTests());
  poolHelpers.runBenchmarkSuite("string patterns combined", combinedPatternValidationTests());

  // =====================================================
  // OBJECTS
  // =====================================================

  poolHelpers.runBenchmarkSuite("object simple", simpleObjectValidation());
  poolHelpers.runBenchmarkSuite("object nested", complexObjectValidation());
  poolHelpers.runBenchmarkSuite("object + constraints", objectsWithConstraintsUserRegistration());
  poolHelpers.runBenchmarkSuite("optional fields", optionalFieldsTests());
  poolHelpers.runBenchmarkSuite("nullable fields", nullableFieldsTests());
  poolHelpers.runBenchmarkSuite("nullish fields", optionalAndNullableCombinedTests());

  // =====================================================
  // SCHEMA COMPOSITION
  // =====================================================

  poolHelpers.runBenchmarkSuite("partial", partialSchemaTests());
  poolHelpers.runBenchmarkSuite("deepPartial", deepPartialTests());
  poolHelpers.runBenchmarkSuite("pick", pickSchemaTests());
  poolHelpers.runBenchmarkSuite("omit", omitSchemaTests());
  poolHelpers.runBenchmarkSuite("extend", extendSchemaTests());
  poolHelpers.runBenchmarkSuite("merge", mergeSchemaTests());

  // =====================================================
  // ARRAYS
  // =====================================================

  poolHelpers.runBenchmarkSuite("array<string>", arrayValidationStrings());
  poolHelpers.runBenchmarkSuite("array large (500+)", arrayValidationLarge());

  // =====================================================
  // UNIONS
  // =====================================================

  poolHelpers.runBenchmarkSuite("union simple", simpleUnionTests());
  poolHelpers.runBenchmarkSuite("discriminated union (3)", discriminatedUnionApiResponseTests());
  poolHelpers.runBenchmarkSuite("discriminated union (4)", discriminatedUnionEventTests());
  poolHelpers.runBenchmarkSuite("jit union 2 branches", jitUnion2BranchTests());
  poolHelpers.runBenchmarkSuite("jit union 4 branches", jitUnion4BranchTests());
  poolHelpers.runBenchmarkSuite("jit union 2 invalid", jitUnion2BranchInvalidTests());
  poolHelpers.runBenchmarkSuite("jit union 4 invalid", jitUnion4BranchInvalidTests());

  // =====================================================
  // COERCION
  // =====================================================

  poolHelpers.runBenchmarkSuite("coerce number", coerceNumberTests());
  poolHelpers.runBenchmarkSuite("coerce boolean", coerceBooleanTests());
  poolHelpers.runBenchmarkSuite("coerce date", coerceDateTests());
  poolHelpers.runBenchmarkSuite("coerce bigint", coerceBigIntTests());
  poolHelpers.runBenchmarkSuite("coerce formData", coerceFormDataTests());
  poolHelpers.runBenchmarkSuite("coerce queryParams", coerceQueryParamsTests());

  // =====================================================
  // REFINEMENTS
  // =====================================================

  poolHelpers.runBenchmarkSuite("refine simple", simpleRefinementTests());
  poolHelpers.runBenchmarkSuite("refine chained", passwordStrengthRefinementTests());
  poolHelpers.runBenchmarkSuite("refine object", objectRefinementTests());
  poolHelpers.runBenchmarkSuite("refine array", arrayRefinementTests());
  poolHelpers.runBenchmarkSuite("refine cross-field", crossFieldValidationTests());
  poolHelpers.runBenchmarkSuite("refine conditional", conditionalRefinementTests());

  // =====================================================
  // TRANSFORMS & PIPES
  // =====================================================

  poolHelpers.runBenchmarkSuite("pipe", pipeCompositionTests());
  poolHelpers.runBenchmarkSuite("pipe + constraints", pipeWithConstraintsTests());
  poolHelpers.runBenchmarkSuite("pipe + errors", pipeWithErrorHandlingTests());
  poolHelpers.runBenchmarkSuite("transform", transformApproachesTests());
  poolHelpers.runBenchmarkSuite("transform + constraints", transformWithConstraintsTests());

  // =====================================================
  // ERROR HANDLING
  // =====================================================

  poolHelpers.runBenchmarkSuite("error string", errorHandlingStrings());
  poolHelpers.runBenchmarkSuite("error object", errorHandlingObjects());

  // =====================================================
  // BULK VALIDATION
  // =====================================================

  poolHelpers.runBenchmarkSuite("bulk strings (100)", bulkValidationStrings());
  poolHelpers.runBenchmarkSuite("bulk objects (50)", bulkValidationObjects());
  poolHelpers.runBenchmarkSuite("bulk earlyAbort", earlyAbortTests());
  poolHelpers.runBenchmarkSuite("bulk earlyAbort + errors", earlyAbortWithErrorsTests());
});


