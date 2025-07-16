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

[Japanese](README.ja.md)

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

## Installation

### npm

```bash
npm install -g ai-chat-md-export
```

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/ai-chat-md-export
brew install ai-chat-md-export
```

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

### Basic usage

```bash
# Convert a single conversations.json file
ai-chat-md-export -i conversations.json

# Convert all JSON files in a directory
ai-chat-md-export -i exports/ -o output/

# Specify output directory
ai-chat-md-export -i conversations.json -o markdown/
```

### Filtering options

```bash
# Filter by date range
ai-chat-md-export -i conversations.json --since 2024-01-01 --until 2024-12-31

# Search for specific keywords
ai-chat-md-export -i conversations.json --search "API"

# Combine filters
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"
```

### Other options

```bash
# Preview what would be converted without creating files
ai-chat-md-export -i conversations.json --dry-run

# Quiet mode (suppress progress messages)
ai-chat-md-export -i conversations.json --quiet
```

## Command-line Options

| Option                           | Description                               | Default    |
| -------------------------------- | ----------------------------------------- | ---------- |
| `-i, --input <path>`             | Input file or directory path (required)   | -          |
| `-o, --output <path>`            | Output directory                          | `.`        |
| `-f, --format <format>`          | Input format (`chatgpt`/`claude`/`auto`)  | `auto`     |
| `--since <date>`                 | Filter from date (YYYY-MM-DD)             | -          |
| `--until <date>`                 | Filter until date (YYYY-MM-DD)            | -          |
| `--search <keyword>`             | Search in conversations                   | -          |
| `--filename-encoding <encoding>` | Filename encoding (`standard`/`preserve`) | `standard` |
| `-q, --quiet`                    | Suppress progress messages                | -          |
| `--dry-run`                      | Preview mode without creating files       | -          |

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


## How it Works

The tool automatically detects whether your input is from ChatGPT or Claude and handles the conversion accordingly. ChatGPT uses a tree-based conversation structure while Claude uses a flat message array, but you don't need to worry about these differences - the tool takes care of everything.

Key features:
- **Auto-detection**: Automatically identifies the format
- **Preserves formatting**: Code blocks, lists, and special characters are maintained
- **Timestamps**: Converts all timestamps to your local timezone
- **Clean output**: Generates readable Markdown with clear message separation

## Date Filtering Details

The `--since` and `--until` options filter conversations based on when they were **started**, not when they were last updated:

- **ChatGPT**: Uses the `create_time` field from the export
- **Claude**: Uses the `created_at` field from the export
- **Date format**: YYYY-MM-DD (e.g., 2024-01-15)
- **Timezone**: All dates are interpreted in your local timezone
- **Inclusive filtering**: Both --since and --until dates are inclusive

Examples:
```bash
# Conversations from 2024
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# Conversations from the last 30 days (if today is 2024-12-15)
ai-chat-md-export -i data.json --since 2024-11-15

# Only conversations from a specific day
ai-chat-md-export -i data.json --since 2024-06-01 --until 2024-06-01
```

## Search Functionality

The `--search` option provides powerful filtering capabilities:

- **Case-insensitive**: Matches "API", "api", "Api", etc.
- **Searches everywhere**: Both conversation titles and all message contents
- **Partial matching**: "learn" matches "learning", "machine learning", etc.
- **Multiple words**: Searches for the exact phrase as entered

Examples:
```bash
# Find all conversations about Python
ai-chat-md-export -i data.json --search "python"

# Search for a specific error message
ai-chat-md-export -i data.json --search "TypeError: cannot read property"

# Combine with date filtering
ai-chat-md-export -i data.json --search "docker" --since 2024-01-01
```

## More Examples

For complete examples with multiple conversations, see the [examples](examples/) directory:

- **ChatGPT**: [Sample conversations](examples/chatgpt/) with multi-turn dialogues
- **Claude**: [Sample conversations](examples/claude/) with various conversation types

## Troubleshooting

### Large files taking too long to process
The tool processes files in batches. For very large conversation histories:
- Use `--since` and `--until` to process specific date ranges
- Split your export into multiple smaller files
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
- [x] Auto-format detection (`--format auto`)
- [x] Date range filtering (`--since`, `--until`)
- [x] Keyword search functionality (`--search`)
- [x] Timezone-aware timestamp conversion
- [x] Dry-run mode for preview (`--dry-run`)
- [x] npm package distribution
- [x] Homebrew formula support

### 🚧 In Progress

- [ ] **Export to JSON format** - Structured JSON output option
- [ ] **Progress bar** - Visual feedback for long operations

### 📋 Planned Features

- [ ] **Gemini support** - Export conversations from Google Gemini
- [ ] **Export statistics** - Display conversation count, message count, date range

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)