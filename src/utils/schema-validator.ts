import { ZodError, z } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data?: T | undefined;
  errors?: ValidationError[] | undefined;
  warnings?: ValidationWarning[] | undefined;
}

export interface ValidationError {
  path: string;
  message: string;
  expected?: string | undefined;
  received?: string | undefined;
}

export interface ValidationWarning {
  message: string;
  unknownFields?: string[] | undefined;
}

export function validateWithDetails<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: { name: string } = { name: "データ" },
): ValidationResult<T> {
  try {
    const result = schema.parse(data);

    // passthroughを使用している場合、未知のフィールドを検出
    const warnings: ValidationWarning[] = [];
    if (typeof data === "object" && data !== null) {
      const unknownFields = detectUnknownFields(schema, data);
      if (unknownFields.length > 0) {
        warnings.push({
          message: `${options.name}に未知のフィールドが含まれています`,
          unknownFields,
        });
      }
    }

    return {
      success: true,
      data: result,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((e) => {
        const baseError: ValidationError = {
          path: e.path.join("."),
          message: e.message,
        };

        // ZodIssueの型によってはexpectedとreceivedが存在しない場合がある
        if ("expected" in e && e.expected !== undefined) {
          baseError.expected = String(e.expected);
        }
        if ("received" in e && e.received !== undefined) {
          baseError.received = String(e.received);
        }

        return baseError;
      });

      return {
        success: false,
        errors,
      };
    }

    throw error;
  }
}

function detectUnknownFields(schema: z.ZodSchema, data: unknown): string[] {
  // この実装は簡略化されています。実際にはより複雑な実装が必要です
  const unknownFields: string[] = [];

  // スキーマがオブジェクトの場合のみチェック
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const knownKeys = Object.keys(shape);

    if (typeof data === "object" && data !== null) {
      for (const key of Object.keys(data as Record<string, unknown>)) {
        if (!knownKeys.includes(key)) {
          unknownFields.push(key);
        }
      }
    }
  }

  return unknownFields;
}

export function formatValidationReport(
  result: ValidationResult<unknown>,
): string {
  const lines: string[] = [];

  if (result.success) {
    lines.push("✅ スキーマ検証成功");

    if (result.warnings && result.warnings.length > 0) {
      lines.push("\n📋 変換時にスキップされたフィールド:");
      for (const warning of result.warnings) {
        if (warning.unknownFields) {
          lines.push(`  - ${warning.unknownFields.join(", ")}`);
          lines.push(
            `    ※ これらのフィールドは変換後のMarkdownには含まれません`,
          );
        }
      }
    }
  } else {
    lines.push("❌ スキーマ検証失敗");

    if (result.errors && result.errors.length > 0) {
      lines.push("\nエラー:");
      for (const error of result.errors) {
        lines.push(`  - パス: ${error.path || "ルート"}`);
        lines.push(`    ${error.message}`);
        if (error.expected) {
          lines.push(`    期待: ${error.expected}`);
        }
        if (error.received) {
          lines.push(`    受信: ${error.received}`);
        }
      }
    }
  }

  return lines.join("\n");
}
