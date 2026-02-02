import { describe, it, expect } from "vitest";
import { CodedError, createErrorFactory } from "./error-factory";

describe("CodedError", () => {
  describe("constructor", () => {
    it("creates error with code and type", () => {
      const error = new CodedError(404, "NOT_FOUND");

      expect(error.code).toBe(404);
      expect(error.type).toBe("NOT_FOUND");
      expect(error.message).toBe("[NOT_FOUND:0x194]");
      expect(error.details).toBeUndefined();
    });

    it("creates error with code, type and details", () => {
      const details = { userId: 123, resource: "user" };
      const error = new CodedError(500, "INTERNAL_ERROR", details);

      expect(error.code).toBe(500);
      expect(error.type).toBe("INTERNAL_ERROR");
      expect(error.message).toBe("[INTERNAL_ERROR:0x1f4]");
      expect(error.details).toBe(details);
    });

    it("inherits from Error", () => {
      const error = new CodedError(400, "BAD_REQUEST");

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("CodedError");
      expect(error.stack).toBeDefined();
    });

    it("handles different code types", () => {
      const error1 = new CodedError(0, "ZERO_CODE");
      const error2 = new CodedError(-1, "NEGATIVE_CODE");
      const error3 = new CodedError(999999, "LARGE_CODE");

      expect(error1.code).toBe(0);
      expect(error2.code).toBe(-1);
      expect(error3.code).toBe(999999);
    });

    it("handles different type formats", () => {
      const error1 = new CodedError(100, "SIMPLE_TYPE");
      const error2 = new CodedError(200, "snake_case");
      const error3 = new CodedError(300, "kebab-case");
      const error4 = new CodedError(400, "camelCase");

      expect(error1.type).toBe("SIMPLE_TYPE");
      expect(error2.type).toBe("snake_case");
      expect(error3.type).toBe("kebab-case");
      expect(error4.type).toBe("camelCase");
    });

    it("handles various details types", () => {
      const stringDetails = "error message";
      const numberDetails = 42;
      const booleanDetails = true;
      const nullDetails = null;
      const undefinedDetails = undefined;
      const objectDetails = { key: "value" };
      const arrayDetails = [1, 2, 3];

      expect(new CodedError(1, "TEST", stringDetails).details).toBe(
        stringDetails
      );
      expect(new CodedError(2, "TEST", numberDetails).details).toBe(
        numberDetails
      );
      expect(new CodedError(3, "TEST", booleanDetails).details).toBe(
        booleanDetails
      );
      expect(new CodedError(4, "TEST", nullDetails).details).toBe(nullDetails);
      expect(
        new CodedError(5, "TEST", undefinedDetails).details
      ).toBeUndefined();
      expect(new CodedError(6, "TEST", objectDetails).details).toBe(
        objectDetails
      );
      expect(new CodedError(7, "TEST", arrayDetails).details).toBe(
        arrayDetails
      );
    });
  });

  describe("properties", () => {
    it("has readonly properties", () => {
      const error = new CodedError(404, "NOT_FOUND", { id: 1 });
      expect(error.code).toBe(404);
      expect(error.type).toBe("NOT_FOUND");
      expect(error.details).toEqual({ id: 1 });
    });
  });

  describe("error behavior", () => {
    it("can be thrown and caught", () => {
      const error = new CodedError(404, "NOT_FOUND");

      expect(() => {
        throw error;
      }).toThrow(CodedError);

      try {
        throw error;
      } catch (caught) {
        expect(caught).toBe(error);
        expect(caught).toBeInstanceOf(CodedError);
        expect((caught as CodedError).code).toBe(404);
      }
    });

    it("maintains error chain", () => {
      const originalError = new Error("Original error");
      const codedError = new CodedError(500, "WRAPPER", originalError);

      expect(codedError.details).toBe(originalError);
      expect(codedError.message).toBe("[WRAPPER:0x1f4]");
    });
  });
});

describe("createErrorFactory", () => {
  describe("factory creation", () => {
    it("creates factory function", () => {
      const factory = createErrorFactory("VALIDATION_ERROR");

      expect(typeof factory).toBe("function");
    });

    it("factory returns CodedError instances", () => {
      const factory = createErrorFactory("AUTH_ERROR");
      const error = factory(401);

      expect(error).toBeInstanceOf(CodedError);
      expect(error.code).toBe(401);
      expect(error.type).toBe("AUTH_ERROR");
    });
  });

  describe("factory usage", () => {
    it("creates errors with different codes", () => {
      const factory = createErrorFactory("HTTP_ERROR");

      const error400 = factory(400);
      const error500 = factory(500);

      expect(error400.code).toBe(400);
      expect(error400.type).toBe("HTTP_ERROR");
      expect(error500.code).toBe(500);
      expect(error500.type).toBe("HTTP_ERROR");
    });

    it("creates errors with details", () => {
      const factory = createErrorFactory("VALIDATION_ERROR");
      const details = { field: "email", value: "invalid" };

      const error = factory(422, details);

      expect(error.code).toBe(422);
      expect(error.type).toBe("VALIDATION_ERROR");
      expect(error.details).toBe(details);
    });

    it("creates errors without details", () => {
      const factory = createErrorFactory("SIMPLE_ERROR");

      const error = factory(999);

      expect(error.code).toBe(999);
      expect(error.type).toBe("SIMPLE_ERROR");
      expect(error.details).toBeUndefined();
    });
  });

  describe("multiple factories", () => {
    it("creates independent factories", () => {
      const authFactory = createErrorFactory("AUTH_ERROR");
      const dbFactory = createErrorFactory("DATABASE_ERROR");

      const authError = authFactory(401);
      const dbError = dbFactory(1001);

      expect(authError.type).toBe("AUTH_ERROR");
      expect(authError.code).toBe(401);
      expect(dbError.type).toBe("DATABASE_ERROR");
      expect(dbError.code).toBe(1001);
    });

    it("factories can reuse same codes", () => {
      const factory1 = createErrorFactory("TYPE_1");
      const factory2 = createErrorFactory("TYPE_2");

      const error1 = factory1(100);
      const error2 = factory2(100);

      expect(error1.code).toBe(100);
      expect(error1.type).toBe("TYPE_1");
      expect(error2.code).toBe(100);
      expect(error2.type).toBe("TYPE_2");
    });
  });

  describe("real-world usage", () => {
    it("handles HTTP error factory", () => {
      const httpError = createErrorFactory("HTTP_ERROR");

      const notFound = httpError(404, { path: "/api/users/999" });
      const serverError = httpError(500, { operation: "database_query" });

      expect(notFound.message).toBe("[HTTP_ERROR:0x194]");
      expect(notFound.details).toEqual({ path: "/api/users/999" });
      expect(serverError.message).toBe("[HTTP_ERROR:0x1f4]");
      expect(serverError.details).toEqual({ operation: "database_query" });
    });

    it("handles validation error factory", () => {
      const validationError = createErrorFactory("VALIDATION_ERROR");

      const fieldError = validationError(1001, {
        field: "email",
        message: "Invalid email format",
      });

      expect(fieldError.code).toBe(1001);
      expect(fieldError.type).toBe("VALIDATION_ERROR");
      expect(fieldError.details).toEqual({
        field: "email",
        message: "Invalid email format",
      });
    });

    it("handles business logic error factory", () => {
      const businessError = createErrorFactory("BUSINESS_ERROR");

      const insufficientFunds = businessError(2001, {
        accountId: 123,
        required: 1000,
        available: 500,
      });

      expect(insufficientFunds.code).toBe(2001);
      expect(insufficientFunds.type).toBe("BUSINESS_ERROR");
      expect(insufficientFunds.details).toEqual({
        accountId: 123,
        required: 1000,
        available: 500,
      });
    });
  });
});



