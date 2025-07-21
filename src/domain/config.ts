import { z } from "zod";

export enum Platform {
  ChatGPT = "chatgpt",
  Claude = "claude",
}

export enum Format {
  Markdown = "markdown",
  Json = "json",
}

export enum FilenameEncoding {
  Standard = "standard",
  Preserve = "preserve",
}

/**
 * Maps Format enum values to their corresponding file extensions
 */
export const FILE_EXTENSIONS = {
  [Format.Markdown]: ".md",
  [Format.Json]: ".json",
} as const;

export const optionsSchema = z.object({
  input: z.string(),
  output: z.string().optional(),
  platform: z.enum(Object.values(Platform) as [Platform, ...Platform[]]),
  since: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  quiet: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  search: z.string().optional(),
  filenameEncoding: z
    .enum(
      Object.values(FilenameEncoding) as [
        FilenameEncoding,
        ...FilenameEncoding[],
      ],
    )
    .default(FilenameEncoding.Standard),
  format: z
    .enum(Object.values(Format) as [Format, ...Format[]])
    .default(Format.Markdown),
  split: z.boolean().default(true),
  batchSize: z.number().positive().int().optional(),
});

export type Options = z.infer<typeof optionsSchema>;
