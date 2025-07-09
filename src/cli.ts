import { promises as fs } from "node:fs";
import path from "node:path";
import { program } from "commander";
import { z } from "zod";
import { loadChatGPT } from "./loaders/chatgpt.js";
import { loadClaude } from "./loaders/claude.js";
import { convertToMarkdown } from "./markdown.js";
import type { Conversation } from "./types.js";
import { generateFileName } from "./utils/filename.js";

// Version is hardcoded to avoid runtime file reading issues in compiled binary
const VERSION = "0.1.0";

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
});

export type Options = z.infer<typeof optionsSchema>;

export async function detectFormat(
  filePath: string,
): Promise<"chatgpt" | "claude"> {
  const content = await fs.readFile(filePath, "utf-8");

  // Try parsing as JSON first
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      if (data[0]?.mapping) {
        return "chatgpt";
      } else if (data[0]?.chat_messages && data[0]?.uuid) {
        return "claude";
      }
    }
  } catch {
    // Not a valid JSON
  }

  throw new Error(
    `Cannot detect file format. The file should be either:\n` +
      `- ChatGPT export: JSON array with 'mapping' field\n` +
      `- Claude export: JSON array with 'chat_messages' and 'uuid' fields`,
  );
}

export async function processInput(options: Options): Promise<void> {
  const inputPath = path.resolve(options.input);
  const outputDir = path.resolve(options.output || process.cwd());

  const stat = await fs.stat(inputPath);

  if (stat.isFile()) {
    await processFile(inputPath, outputDir, options);
  } else if (stat.isDirectory()) {
    await processDirectory(inputPath, outputDir, options);
  } else {
    throw new Error(
      `Invalid input path: ${inputPath}\n` +
        `The path must be either:\n` +
        `- A valid JSON file (e.g., conversations.json)\n` +
        `- A directory containing JSON files`,
    );
  }
}

export async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  if (!options.quiet) {
    console.log(`Processing: ${filePath}`);
  }

  let format: string;
  try {
    format =
      options.format === "auto" ? await detectFormat(filePath) : options.format;
  } catch (error) {
    throw new Error(
      `Failed to detect file format: ${error instanceof Error ? error.message : "Unknown error"}\n` +
        `File: ${filePath}`,
    );
  }

  let conversations: Conversation[];
  try {
    if (format === "chatgpt") {
      conversations = await loadChatGPT(filePath, { quiet: options.quiet });
    } else if (format === "claude") {
      conversations = await loadClaude(filePath, { quiet: options.quiet });
    } else {
      throw new Error(
        `Unsupported format: ${format}\n` +
          `Supported formats are: chatgpt, claude, auto`,
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Schema validation error")
    ) {
      throw error;
    }
    throw new Error(
      `Failed to load file: ${error instanceof Error ? error.message : "Unknown error"}\n` +
        `File: ${filePath}\n` +
        `Format: ${format}`,
    );
  }

  // Apply filters
  let filteredConversations = conversations;
  const originalCount = conversations.length;

  // Filter by date if --since or --until is specified
  if (options.since || options.until) {
    filteredConversations = filteredConversations.filter((conv) => {
      const convDate = conv.date; // Already in YYYY-MM-DD format
      if (options.since && convDate < options.since) return false;
      if (options.until && convDate > options.until) return false;
      return true;
    });
  }

  // Filter by search keyword if --search is specified
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredConversations = filteredConversations.filter((conv) => {
      // Search in title
      if (conv.title.toLowerCase().includes(searchLower)) return true;
      // Search in messages
      return conv.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchLower),
      );
    });
  }

  const filteredCount = filteredConversations.length;
  if ((options.since || options.until || options.search) && !options.quiet) {
    console.log(
      `  Filtered: ${filteredCount} of ${originalCount} conversations`,
    );
    const filters = [];
    if (options.since || options.until) {
      const dateRange = [];
      if (options.since) dateRange.push(`from ${options.since}`);
      if (options.until) dateRange.push(`to ${options.until}`);
      filters.push(`date ${dateRange.join(" ")}`);
    }
    if (options.search) {
      filters.push(`keyword "${options.search}"`);
    }
    if (filters.length > 0) {
      console.log(`  Filters: ${filters.join(", ")}`);
    }
  }

  // Only create output directory if we have files to write
  if (!options.dryRun && filteredConversations.length > 0) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  for (const conv of filteredConversations) {
    const markdown = convertToMarkdown(conv);
    const fileName = generateFileName(conv.date, conv.title);
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, markdown, "utf-8");
      }
      if (!options.quiet) {
        console.log(
          `  → ${options.dryRun ? "[DRY RUN] Would write:" : ""} ${outputPath}`,
        );
      }
    } catch (error) {
      console.error(
        `Warning: Failed to write file: ${outputPath}\n` +
          `Reason: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    if (!options.quiet) {
      console.log(`No JSON files found in directory: ${dirPath}`);
    }
    return;
  }

  if (!options.quiet) {
    console.log(`Found ${jsonFiles.length} JSON file(s) to process\n`);
  }

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    if (!file) continue;
    const filePath = path.join(dirPath, file);
    if (!options.quiet) {
      console.log(`[${i + 1}/${jsonFiles.length}] Processing ${file}...`);
    }
    await processFile(filePath, outputDir, options);
  }

  if (!options.quiet) {
    console.log(`\nCompleted processing ${jsonFiles.length} file(s)`);
  }
}

export async function main(): Promise<void> {
  program
    .name("ai-chat-md-export")
    .description("Convert ChatGPT and Claude export data to Markdown")
    .version(VERSION)
    .requiredOption("-i, --input <path>", "Input file or directory path")
    .option(
      "-o, --output <path>",
      "Output directory (default: current directory)",
    )
    .option(
      "-f, --format <format>",
      "Input format (chatgpt, claude, auto)",
      "auto",
    )
    .option(
      "--since <date>",
      "Include conversations started on or after this date (YYYY-MM-DD)",
    )
    .option(
      "--until <date>",
      "Include conversations started on or before this date (YYYY-MM-DD)",
    )
    .option("-q, --quiet", "Suppress progress messages")
    .option("--dry-run", "Show what would be done without writing files")
    .option("--search <keyword>", "Filter conversations containing keyword")
    .addHelpText(
      "after",
      `\nExamples:
  # Convert a single ChatGPT export file
  $ ai-chat-md-export -i conversations.json

  # Convert all JSON files in a directory
  $ ai-chat-md-export -i exports/ -o output/

  # Specify format explicitly
  $ ai-chat-md-export -i claude_export.json -f claude

  # Filter by date range
  $ ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

  # Filter conversations from a specific date
  $ ai-chat-md-export -i data.json --since 2024-06-01

  # Search for conversations containing a keyword
  $ ai-chat-md-export -i data.json --search "machine learning"

  # Preview what would be done without writing files
  $ ai-chat-md-export -i data.json --dry-run

  # Run silently (only show errors)
  $ ai-chat-md-export -i data.json -o output/ --quiet

  # Combine multiple options
  $ ai-chat-md-export -i data.json --since 2024-01-01 --search "API" --quiet

Note on Date Filtering:
  - Dates refer to when conversations were STARTED, not last updated
  - ChatGPT: Uses 'create_time' field
  - Claude: Uses 'created_at' field
  - Both --since and --until dates are inclusive

Note on Search:
  - Search is case-insensitive
  - Searches in both conversation titles and message contents
  - Partial matches are supported`,
    )
    .parse();

  const options = optionsSchema.parse(program.opts());

  try {
    await processInput(options);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "An unknown error occurred";
    console.error("Error:", errorMessage);
    process.exit(1);
  }
}

// Run main if this is the entry point
if (import.meta.main) {
  main();
}
