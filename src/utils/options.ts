import { z } from "zod";

export const optionsSchema = z.object({
  input: z.string(),
  output: z.string().optional(),
  format: z.enum(["chatgpt", "claude", "auto"]).default("auto"),
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
  filenameEncoding: z.enum(["standard", "preserve"]).default("standard"),
});

export type Options = z.infer<typeof optionsSchema>;
