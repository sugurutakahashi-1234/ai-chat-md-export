import { describe, expect, it } from "bun:test";
import { z } from "zod";
import { assertType, createTypeGuard } from "../../../src/utils/type-guards.js";

describe("type-guards", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  describe("createTypeGuard", () => {
    it("returns true for valid data", () => {
      const isTestType = createTypeGuard(testSchema);
      const validData = { name: "John", age: 30 };

      expect(isTestType(validData)).toBe(true);
    });

    it("returns false for invalid data", () => {
      const isTestType = createTypeGuard(testSchema);
      const invalidData = { name: "John", age: "thirty" };

      expect(isTestType(invalidData)).toBe(false);
    });

    it("returns false for null", () => {
      const isTestType = createTypeGuard(testSchema);

      expect(isTestType(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      const isTestType = createTypeGuard(testSchema);

      expect(isTestType(undefined)).toBe(false);
    });

    it("works with complex schemas", () => {
      const complexSchema = z.object({
        users: z.array(
          z.object({
            id: z.string(),
            roles: z.array(z.enum(["admin", "user"])),
          }),
        ),
      });
      const isComplexType = createTypeGuard(complexSchema);

      const validData = {
        users: [
          { id: "1", roles: ["admin", "user"] },
          { id: "2", roles: ["user"] },
        ],
      };

      expect(isComplexType(validData)).toBe(true);
      expect(isComplexType({ users: [] })).toBe(true);
      expect(isComplexType({ users: "not an array" })).toBe(false);
    });
  });

  describe("assertType", () => {
    it("returns validated data for valid input", () => {
      const validData = { name: "John", age: 30 };
      const result = assertType(testSchema, validData);

      expect(result).toEqual(validData);
    });

    it("throws error for invalid input", () => {
      const invalidData = { name: "John", age: "thirty" };

      expect(() => assertType(testSchema, invalidData)).toThrow(
        "Type assertion failed:",
      );
    });

    it("throws error with context when provided", () => {
      const invalidData = { name: "John", age: "thirty" };

      expect(() =>
        assertType(testSchema, invalidData, "user validation"),
      ).toThrow("Type assertion failed in user validation:");
    });

    it("throws error for missing required fields", () => {
      const partialData = { name: "John" };

      expect(() => assertType(testSchema, partialData)).toThrow();
    });

    it("works with union types", () => {
      const unionSchema = z.union([
        z.object({ type: z.literal("a"), value: z.string() }),
        z.object({ type: z.literal("b"), value: z.number() }),
      ]);

      const validA = { type: "a" as const, value: "test" };
      const validB = { type: "b" as const, value: 42 };
      const invalid = { type: "c", value: "test" };

      expect(assertType(unionSchema, validA)).toEqual(validA);
      expect(assertType(unionSchema, validB)).toEqual(validB);
      expect(() => assertType(unionSchema, invalid)).toThrow();
    });

    it("provides detailed error messages", () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
      });

      const invalidData = {
        user: {
          name: "Jo",
          email: "not-an-email",
        },
      };

      expect(() => assertType(nestedSchema, invalidData)).toThrow(
        "Type assertion failed:",
      );
    });
  });
});
