# ai-chat-md-export

[![npm version](https://img.shields.io/npm/v/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![Homebrew](https://img.shields.io/badge/Homebrew-tap-orange.svg)](https://github.com/sugurutakahashi-1234/homebrew-tap)
[![CI](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml)
[![npm Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml)
[![Homebrew Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml)
[![codecov](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export/graph/badge.svg?token=KPN7UZ7ATY)](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![npm bundle size](https://img.shields.io/bundlephobia/min/ai-chat-md-export)](https://bundlephobia.com/package/ai-chat-md-export)
[![Types](https://img.shields.io/npm/types/ai-chat-md-export)](https://www.npmjs.com/package/ai-chat-md-export)

Convert ChatGPT and Claude chat history to readable Markdown files

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

## Quick Start

```bash
# 1. Install the tool
npm install -g ai-chat-md-export

# 2. Export your conversations from ChatGPT or Claude
# → Get conversations.json file (see "Getting conversations.json" section below)

# 3. Convert to Markdown
ai-chat-md-export -i conversations.json
```

That's it! Your conversations are now organized, searchable Markdown files.

### Example Output

Running the command above will generate files like:

```
2025-01-15_Math_Question.md
2025-01-16_Recipe_Help.md
```

Each file contains a nicely formatted conversation with timestamps, user/assistant markers, and preserved formatting.

## What You'll Get

Transform complex JSON exports into clean, readable Markdown:

### Input (conversations.json from ChatGPT)
```json
{
  "title": "Hello World",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": { "role": "user" },
        "content": {
          "parts": ["Hello! How are you?"]
        }
      }
    },
    "msg-2": {
      "message": {
        "author": { "role": "assistant" },
        "content": {
          "parts": ["Hi there! I'm doing well, thank you for asking. How can I help you today?"]
        }
      }
    }
  }
}
```

### → Output (2025-01-15_Hello_World.md)
```markdown
# Hello World
Date: 2025-01-15 18:00:00 +09:00

---

## 👤 User
Date: 2025-01-15 18:00:00 +09:00

Hello! How are you?

---

## 🤖 Assistant
Date: 2025-01-15 18:00:10 +09:00

Hi there! I'm doing well, thank you for asking. How can I help you today?

---
```

✨ **Features**: Clean formatting • Timestamps • Visual markers • Preserves code blocks & formatting

## Installation

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/tap
brew install ai-chat-md-export
```

### npm

```bash
npm install -g ai-chat-md-export
```

### Direct Download (Windows / Others)

Pre-built binaries are available on the [releases page](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest).

#### Windows
1. Download [ai-chat-md-export-windows-amd64.zip](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest/download/ai-chat-md-export-windows-amd64.zip)
2. Extract the zip file
3. Add the extracted folder to your PATH, or run directly:
   ```cmd
   ai-chat-md-export.exe -i conversations.json
   ```

#### macOS / Linux
Download the appropriate `.tar.gz` file from the releases page for your platform.

## What is ai-chat-md-export?

`ai-chat-md-export` is a CLI tool that converts your ChatGPT and Claude conversations into organized, readable Markdown files.

### Key benefits

- **Preserve your AI chats** before they're lost or deleted
- **Readable formatting** for easy viewing in any Markdown editor
- **Search and organize** your chat history with standard tools
- **Share or version control** conversations as needed

## Privacy & Security

### 🔒 Offline-First Design

This tool is designed to operate **locally on your device** without requiring internet connectivity:

- **No network requests**: The tool itself does not make any external API calls or network connections
- **Local processing only**: All conversion operations are performed entirely on your machine
- **No data collection**: We don't include any analytics, telemetry, or tracking functionality
- **Your data stays local**: Conversations are read from and written to your local filesystem only

Ideal for organizations and individuals who prioritize data privacy. You can review our [source code](https://github.com/sugurutakahashi-1234/ai-chat-md-export) to verify that the tool contains no network-related code. Note that while our code doesn't make external connections, we cannot guarantee the behavior of all dependencies.

## Usage

```bash
# Basic: Convert conversations.json to Markdown files
ai-chat-md-export -i conversations.json

# Specify output directory
ai-chat-md-export -i conversations.json -o output/

# Filter by date or keyword
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"

# Export as JSON format
ai-chat-md-export -i conversations.json -f json

# Combine all conversations into a single file
ai-chat-md-export -i conversations.json --no-split
```

For more examples, see the [examples](examples/) directory.

## Command-line Options

| Option                           | Description                                                             | Default    |
| -------------------------------- | ----------------------------------------------------------------------- | ---------- |
| `-h, --help`                     | Display help information                                                | -          |
| `-v, --version`                  | Display version number                                                  | -          |
| `-i, --input <path>`             | Input file path (required)                                              | -          |
| `-o, --output <path>`            | Output directory                                                        | `.`        |
| `-f, --format <format>`          | Output format (`markdown`/`json`)                                       | `markdown` |
| `--no-split`                     | Combine all conversations into one file (default: split files)          | -          |
| `--since <date>`                 | Filter from date (YYYY-MM-DD). Filters by conversation start date       | -          |
| `--until <date>`                 | Filter until date (YYYY-MM-DD). Inclusive filtering                     | -          |
| `--search <keyword>`             | Search in conversations. Case-insensitive, searches titles and messages | -          |
| `-p, --platform <platform>`      | Input platform (`chatgpt`/`claude`/`auto`)                              | `auto`     |
| `--filename-encoding <encoding>` | Filename encoding (`standard`/`preserve`)                               | `standard` |
| `-q, --quiet`                    | Suppress progress messages                                              | -          |
| `--dry-run`                      | Preview mode without creating files                                     | -          |

## Getting conversations.json

Both ChatGPT and Claude allow you to export your chat history as a `conversations.json` file. This file contains all your conversations in a structured format that our tool can process.

### Export from ChatGPT (OpenAI)

1. Log in to ChatGPT (https://chat.openai.com)
2. Click your profile picture → Settings
3. Open "Data Controls" from the left menu
4. Click "Export Data" → "Export"
5. Confirm by clicking "Confirm export"
6. Within minutes, you'll receive an email "Your ChatGPT data export is ready"
7. Download `chatgpt-data.zip` from the link (expires in 24 hours)
8. Extract the ZIP file to find `conversations.json` in the root directory

Note: The download link expires after 24 hours, so download promptly.

### Export from Claude (Anthropic)

1. Log in to Claude (https://claude.ai)
2. Click your initials in the bottom left → Settings
3. Open the "Privacy" tab (or "Data management" for enterprise)
4. Click "Export data" and confirm
5. Within minutes, you'll receive an email "Your Claude data export is ready"
6. Download the `claude-export.dms` or ZIP file
7. If you received a `.dms` file, rename it to `.zip` and extract
8. Find `conversations.json` in the root directory


## Troubleshooting

### Large files taking too long to process
For very large conversation histories:
- Use `--since` and `--until` to process specific date ranges
- Process one file at a time if experiencing memory issues
- Use `--search` to extract only relevant conversations

### Character encoding issues
If you see garbled text in your output:
- Ensure your terminal supports UTF-8 encoding
- Check that your `conversations.json` file is properly encoded

For filename encoding issues:
- `--filename-encoding standard` (default): Sanitizes filenames for maximum compatibility across operating systems
- `--filename-encoding preserve`: Keeps original characters from conversation titles, but may cause issues on some systems with special characters

### Missing conversations
If some conversations don't appear in the output:
- Check the export date - only conversations up to the export date are included
- Verify the JSON structure matches ChatGPT or Claude format
- Use `--dry-run` to preview which conversations will be converted

## Roadmap

### ✅ Completed Features

- [x] ChatGPT conversation export support
- [x] Claude conversation export support
- [x] Auto-format detection
- [x] Date range filtering (`--since`, `--until`)
- [x] Keyword search functionality (`--search`)
- [x] Timezone-aware timestamp conversion
- [x] Dry-run mode for preview (`--dry-run`)
- [x] Export to JSON format (`-f json`)
- [x] Combine conversations into single file (`--no-split`)
- [x] npm package distribution
- [x] Homebrew formula support

### 🚧 In Progress

- [ ] **Progress bar** - Visual feedback for long operations

### 📋 Planned Features

- [ ] **Gemini support** - Export conversations from Google Gemini
- [ ] **Export statistics** - Display conversation count, message count, date range

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Contact

If you have any questions or feedback, you can reach me on X/Twitter: [@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)