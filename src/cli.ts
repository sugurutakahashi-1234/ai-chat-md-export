#!/usr/bin/env bun
import { promises as fs } from "node:fs";
import path from "node:path";
import { program } from "commander";
import { z } from "zod";
import { loadChatGPT } from "./loaders/chatgpt.js";
import { loadClaude } from "./loaders/claude.js";
import { convertToMarkdown } from "./markdown.js";
import type { Conversation } from "./types.js";

const optionsSchema = z.object({
  input: z.string(),
  output: z.string().optional(),
  format: z.enum(["chatgpt", "claude", "auto"]).default("auto"),
  copyRaw: z.boolean().default(false),
});

type Options = z.infer<typeof optionsSchema>;

async function detectFormat(
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

  throw new Error("不明なファイル形式です");
}

async function main() {
  program
    .name("chat-history-conv")
    .description("ChatGPTとClaudeのエクスポートデータをMarkdownに変換します")
    .version("1.0.0")
    .requiredOption(
      "-i, --input <path>",
      "入力ファイルまたはディレクトリのパス",
    )
    .option("-o, --output <path>", "出力ディレクトリ (デフォルト: data/md/)")
    .option(
      "-f, --format <format>",
      "入力形式 (chatgpt, claude, auto)",
      "auto",
    )
    .option("--copy-raw", "生データをdata/raw/にコピー", false)
    .parse();

  const options = optionsSchema.parse(program.opts());

  try {
    await processInput(options);
  } catch (error) {
    console.error("エラー:", error instanceof Error ? error.message : error);
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
    throw new Error("入力パスはファイルまたはディレクトリである必要があります");
  }
}

async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
) {
  console.log(`処理中: ${filePath}`);

  let format: string;
  try {
    format = options.format === "auto" ? await detectFormat(filePath) : options.format;
  } catch (error) {
    throw new Error(
      `ファイル形式の検出に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}\n` +
      `ファイル: ${filePath}`
    );
  }

  let conversations: Conversation[];
  try {
    if (format === "chatgpt") {
      conversations = await loadChatGPT(filePath);
    } else if (format === "claude") {
      conversations = await loadClaude(filePath);
    } else {
      throw new Error(`サポートされていない形式: ${format}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("スキーマ検証エラー")) {
      throw error;
    }
    throw new Error(
      `ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}\n` +
      `ファイル: ${filePath}\n` +
      `形式: ${format}`
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
        `警告: ファイルの書き込みに失敗しました: ${outputPath}\n` +
        `理由: ${error instanceof Error ? error.message : "不明なエラー"}`
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
    console.log(`  → 生データをコピー: ${rawPath}`);
  }
}

async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    const filePath = path.join(dirPath, file);
    await processFile(filePath, outputDir, options);
  }
}

main();
