import { Command } from "commander";
import { Processor } from "./core/processing/processor.js";
import { formatErrorWithContext } from "./utils/errors/formatter.js";
import { logger } from "./utils/logger.js";
import { optionsSchema } from "./utils/options.js";
import { VERSION } from "./version.js";

export async function main(): Promise<void> {
  const program = new Command();
  program
    .name("ai-chat-md-export")
    .version(VERSION, "-v, --version")
    .description("Convert ChatGPT and Claude export data to Markdown")
    .requiredOption("-i, --input <path>", "Input file path")
    .option(
      "-o, --output <path>",
      "Output directory (default: current directory)",
    )
    .option(
      "-f, --format <format>",
      "Output format (markdown, json)",
      "markdown",
    )
    .option("--no-split", "Combine all conversations into a single file")
    .option(
      "--since <date>",
      "Include conversations started on or after this date (YYYY-MM-DD)",
    )
    .option(
      "--until <date>",
      "Include conversations started on or before this date (YYYY-MM-DD)",
    )
    .option("--search <keyword>", "Filter conversations containing keyword")
    .option(
      "-p, --platform <platform>",
      "Input platform (chatgpt, claude, auto)",
      "auto",
    )
    .option(
      "--filename-encoding <encoding>",
      "Filename encoding: standard (default) or preserve",
      "standard",
    )
    .option("-q, --quiet", "Suppress progress messages")
    .option("--dry-run", "Show what would be done without writing files")
    .addHelpText(
      "after",
      `\nExample:
  $ ai-chat-md-export -i conversations.json

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

    // Use factory method to create processor with default configuration
    const processor = Processor.create();
    await processor.processInput(options);
  } catch (error) {
    const errorMessage = formatErrorWithContext(error);
    logger.error(errorMessage);
    process.exit(1);
  }
}

// Run main if this is the entry point
if (import.meta.main) {
  main();
}
