import { program } from "commander";
import { processInput } from "./core/processor.js";
import { optionsSchema } from "./utils/options.js";
import { VERSION } from "./version.js";

export async function main(): Promise<void> {
  program
    .name("ai-chat-md-export")
    .version(VERSION)
    .description("Convert ChatGPT and Claude export data to Markdown")
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
    .option(
      "--filename-encoding <encoding>",
      "Filename encoding: standard (default) or preserve",
      "standard",
    )
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
