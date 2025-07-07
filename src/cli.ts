#!/usr/bin/env bun
import { promises as fs } from "node:fs";
import path from "node:path";
import { program } from "commander";
import { z } from "zod";
import { loadChatGPT } from "./loaders/chatgpt.js";
import { loadClaude } from "./loaders/claude.js";
import { loadClaudeJSON } from "./loaders/claude-json.js";
import { convertToMarkdown } from "./markdown.js";

const optionsSchema = z.object({
	input: z.string(),
	output: z.string().optional(),
	format: z.enum(["chatgpt", "claude", "claude-json", "auto"]).default("auto"),
	copyRaw: z.boolean().default(false),
});

type Options = z.infer<typeof optionsSchema>;

async function detectFormat(filePath: string): Promise<"chatgpt" | "claude" | "claude-json"> {
	const content = await fs.readFile(filePath, "utf-8");
	
	// Try parsing as JSON first
	try {
		const data = JSON.parse(content);
		if (Array.isArray(data)) {
			if (data[0]?.mapping) {
				return "chatgpt";
			} else if (data[0]?.chat_messages && data[0]?.uuid) {
				return "claude-json";
			}
		}
	} catch {
		// Not a valid JSON, might be NDJSON
	}
	
	// Try parsing as NDJSON (Claude format)
	const lines = content.trim().split("\n");
	if (lines.length > 0) {
		try {
			const firstLine = JSON.parse(lines[0]);
			if (firstLine.type === "chat" && firstLine.chat_messages) {
				return "claude";
			}
		} catch {
			// Not a valid NDJSON
		}
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
		.option("-f, --format <format>", "入力形式 (chatgpt, claude, claude-json, auto)", "auto")
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

	const format =
		options.format === "auto" ? await detectFormat(filePath) : options.format;

	let conversations;
	if (format === "chatgpt") {
		conversations = await loadChatGPT(filePath);
	} else if (format === "claude") {
		conversations = await loadClaude(filePath);
	} else if (format === "claude-json") {
		conversations = await loadClaudeJSON(filePath);
	} else {
		throw new Error(`サポートされていない形式: ${format}`);
	}

	await fs.mkdir(outputDir, { recursive: true });

	for (const conv of conversations) {
		const markdown = convertToMarkdown(conv);
		const fileName = `${conv.date}_${conv.title.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠]/g, "_")}.md`;
		const outputPath = path.join(outputDir, fileName);

		await fs.writeFile(outputPath, markdown, "utf-8");
		console.log(`  → ${outputPath}`);
	}

	if (options.copyRaw) {
		const formatDir = format === "claude-json" ? "claude" : format;
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
