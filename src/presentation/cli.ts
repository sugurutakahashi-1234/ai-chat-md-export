import { Command } from "commander";
import { Processor } from "../application/processor.js";
import { createDefaultDependencies } from "../infrastructure/factories/processor-factory.js";
import { optionsSchema } from "../shared/config/options.js";
import { VERSION } from "../shared/constants/version.js";
import { formatErrorWithContext } from "../shared/errors/formatter.js";
import { Logger } from "../shared/utils/logger.js";

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
    .requiredOption(
      "-p, --platform <platform>",
      "Input platform (chatgpt, claude)",
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
        const missingOptions = [];
        const opts = program.opts();
        // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
        if (!opts["input"]) missingOptions.push("input file (-i)");
        // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
        if (!opts["platform"]) missingOptions.push("platform (-p)");

        const logger = new Logger();
        logger.error(`Required options missing: ${missingOptions.join(", ")}`);
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

    // Create processor with dependency injection
    const processor = new Processor(createDefaultDependencies(options));
    await processor.processInput(options);
  } catch (error) {
    const errorMessage = formatErrorWithContext(error);
    const logger = new Logger();
    logger.error(errorMessage);
    process.exit(1);
  }
}

// Run main if this is the entry point
if (import.meta.main) {
  main();
}
