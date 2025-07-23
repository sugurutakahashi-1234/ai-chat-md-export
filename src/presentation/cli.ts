import { Command } from "commander";
import { Processor } from "../application/processor.js";
import { optionsSchema } from "../domain/config.js";
import { formatErrorWithContext } from "../domain/utils/error.js";
import { VERSION } from "../domain/version.js";
import { createProcessorDependencies } from "./processor-factory.js";

// Commander error codes
const COMMANDER_ERROR_CODES = {
  MissingMandatoryOption: "commander.missingMandatoryOptionValue",
  HelpDisplayed: "commander.helpDisplayed",
  VersionDisplayed: "commander.version",
} as const;

export async function main(): Promise<void> {
  const program = new Command();

  // Note: Commander.js always displays -h, --help option at the end of the options list.
  // This is a framework constraint and cannot be easily changed to display it first.
  program
    .name("ai-chat-md-export")
    .description("Convert ChatGPT and Claude export data to Markdown")
    .version(VERSION, "-v, --version")
    .requiredOption("-i, --input <path>", "Input file path (required)")
    .requiredOption(
      "-p, --platform <platform>",
      "Input platform (chatgpt, claude) (required)",
    )
    .option(
      "-o, --output <path>",
      "Output directory (default: current directory)",
    )
    .option(
      "-f, --format <format>",
      "Output format (markdown, json)",
      "markdown",
    )
    .option("--since <date>", "Filter from date (YYYY-MM-DD)")
    .option("--until <date>", "Filter until date (YYYY-MM-DD)")
    .option("--search <keyword>", "Filter conversations containing keyword")
    .option(
      "--filename-encoding <encoding>",
      "Filename encoding: standard (default) or preserve",
      "standard",
    )
    .option("--no-split", "Combine all conversations into a single file")
    .option("--dry-run", "Show what would be done without writing files")
    .option("-q, --quiet", "Suppress progress messages")
    .addHelpText(
      "after",
      `\nExample:
  $ ai-chat-md-export -i conversations.json -p chatgpt

For more options and detailed documentation:
  https://www.npmjs.com/package/ai-chat-md-export
  `,
    )
    .exitOverride((err) => {
      if (err.code === COMMANDER_ERROR_CODES.MissingMandatoryOption) {
        const missingOptions = [];
        const opts = program.opts();
        // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
        if (!opts["input"]) missingOptions.push("input file (-i)");
        // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
        if (!opts["platform"]) missingOptions.push("platform (-p)");

        // Use standard console methods instead of infrastructure layer Logger
        console.error(
          `Error: Required options missing: ${missingOptions.join(", ")}`,
        );
        console.log(
          "\nTry 'ai-chat-md-export --help' for usage information.\n",
        );
        process.exit(1);
      }
      if (err.code === COMMANDER_ERROR_CODES.HelpDisplayed) {
        process.exit(0);
      }
      if (err.code === COMMANDER_ERROR_CODES.VersionDisplayed) {
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
    const processor = new Processor(createProcessorDependencies(options));
    await processor.executeConversionPipeline(options);
  } catch (error) {
    const errorMessage = formatErrorWithContext(error);
    // Use standard console.error instead of infrastructure layer Logger
    console.error(`Error: ${errorMessage}`);
    process.exit(1);
  }
}

// Run main if this is the entry point
if (import.meta.main) {
  main();
}
