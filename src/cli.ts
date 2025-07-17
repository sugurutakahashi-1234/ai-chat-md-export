import { Command } from "commander";
import { processInput } from "./core/processor.js";
import { logger } from "./utils/logger.js";
import { optionsSchema } from "./utils/options.js";
import { VERSION } from "./version.js";

export async function main(): Promise<void> {
  const program = new Command();
  program
    .name("ai-chat-md-export")
    .version(VERSION, "-v, --version")
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
  # Convert a single export file
  $ ai-chat-md-export -i conversations.json

  # Filter by date and search
  $ ai-chat-md-export -i data.json --since 2024-01-01 --search "API"

  # Preview without creating files
  $ ai-chat-md-export -i data.json --dry-run

For more options and detailed documentation:
  https://www.npmjs.com/package/ai-chat-md-export`,
    )
    .exitOverride((err) => {
      if (err.code === "commander.missingMandatoryOptionValue") {
        logger.error("Input file is required.");
        logger.info(
          "\nTry 'ai-chat-md-export --help' for usage information.\n",
        );
        process.exit(1);
      }
      if (err.code === "commander.helpDisplayed") {
        process.exit(0);
      }
      if (err.code === "commander.version") {
        process.exit(0);
      }
      throw err;
    })
    .configureOutput({
      outputError: (str, write) => {
        // Suppress the default commander error output for missing mandatory options
        if (!str.includes("required option")) {
          write(str);
        }
      },
    })
    .parse();

  try {
    const options = optionsSchema.parse(program.opts());
    await processInput(options);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "An unknown error occurred";
    logger.error(errorMessage);
    process.exit(1);
  }
}

// Run main if this is the entry point
if (import.meta.main) {
  main();
}
