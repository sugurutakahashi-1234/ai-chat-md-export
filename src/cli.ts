#!/usr/bin/env bun
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { program } from "commander";
import { z } from "zod";
import { loadChatGPT } from "./loaders/chatgpt.js";
import { loadClaude } from "./loaders/claude.js";
import { convertToMarkdown } from "./markdown.js";
import type { Conversation } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  await fs.readFile(path.join(__dirname, "../package.json"), "utf-8"),
);

const optionsSchema = z.object({
  input: z.string(),
  output: z.string().optional(),
  format: z.enum(["chatgpt", "claude", "auto"]).default("auto"),
  copyRaw: z.boolean().default(false),
});

type Options = z.infer<typeof optionsSchema>;

async function detectFormat(filePath: string): Promise<"chatgpt" | "claude"> {
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

async function main() {
  program
    .name("chat-history-conv")
    .description("Convert ChatGPT and Claude export data to Markdown")
    .version(packageJson.version)
    .requiredOption("-i, --input <path>", "Input file or directory path")
    .option("-o, --output <path>", "Output directory (default: data/md/)")
    .option(
      "-f, --format <format>",
      "Input format (chatgpt, claude, auto)",
      "auto",
    )
    .option("--copy-raw", "Copy raw data to data/raw/", false)
    .addHelpText(
      "after",
      `\nExamples:
  # Convert a single ChatGPT export file
  $ chat-history-conv -i conversations.json

  # Convert all JSON files in a directory
  $ chat-history-conv -i exports/ -o output/

  # Specify format explicitly
  $ chat-history-conv -i claude_export.json -f claude

  # Copy raw data while converting
  $ chat-history-conv -i data.json --copy-raw`,
    )
    .parse();

  const options = optionsSchema.parse(program.opts());

  try {
    await processInput(options);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function processInput(options: Options) {
  const inputPath = path.resolve(options.input);
  const outputDir = path.resolve(options.output || "data/md");

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

async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
) {
  console.log(`Processing: ${filePath}`);

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
      conversations = await loadChatGPT(filePath);
    } else if (format === "claude") {
      conversations = await loadClaude(filePath);
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

  await fs.mkdir(outputDir, { recursive: true });

  for (const conv of conversations) {
    const markdown = convertToMarkdown(conv);
    const fileName = `${conv.date}_${conv.title.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠]/g, "_")}.md`;
    const outputPath = path.join(outputDir, fileName);

    try {
      await fs.writeFile(outputPath, markdown, "utf-8");
      console.log(`  → ${outputPath}`);
    } catch (error) {
      console.error(
        `Warning: Failed to write file: ${outputPath}\n` +
          `Reason: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  if (options.copyRaw) {
    const formatDir = format;
    const rawDir = path.join("data/raw", formatDir);
    await fs.mkdir(rawDir, { recursive: true });
    const rawFileName = `${new Date().toISOString().split("T")[0]}_${path.basename(filePath)}`;
    const rawPath = path.join(rawDir, rawFileName);
    await fs.copyFile(filePath, rawPath);
    console.log(`  → Copied raw data: ${rawPath}`);
  }
}

async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.log(`No JSON files found in directory: ${dirPath}`);
    return;
  }

  console.log(`Found ${jsonFiles.length} JSON file(s) to process\n`);

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    if (!file) continue;
    const filePath = path.join(dirPath, file);
    console.log(`[${i + 1}/${jsonFiles.length}] Processing ${file}...`);
    await processFile(filePath, outputDir, options);
  }

  console.log(`\nCompleted processing ${jsonFiles.length} file(s)`);
}

main();
