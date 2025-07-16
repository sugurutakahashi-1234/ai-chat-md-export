# ai-chat-md-export

[![npm version](https://img.shields.io/npm/v/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![Homebrew](https://img.shields.io/badge/Homebrew-tap-orange.svg)](https://github.com/sugurutakahashi-1234/homebrew-tap)
[![CI](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml)
[![npm Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml)
[![Homebrew Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml)
[![codecov](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export/graph/badge.svg?token=KPN7UZ7ATY)](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![node](https://img.shields.io/node/v/ai-chat-md-export)](https://nodejs.org)
[![npm bundle size](https://img.shields.io/bundlephobia/min/ai-chat-md-export)](https://bundlephobia.com/package/ai-chat-md-export)
[![Types](https://img.shields.io/npm/types/ai-chat-md-export)](https://www.npmjs.com/package/ai-chat-md-export)

Convert ChatGPT and Claude chat history to readable Markdown files

[Japanese](README.ja.md)

## Quick Start

```bash
# 1. Install the tool
npm install -g ai-chat-md-export

# 2. Get your conversations.json file (see Getting conversations.json)
# Export from ChatGPT or Claude

# 3. Convert to Markdown
ai-chat-md-export -i conversations.json
```

That's it! Your conversations are now beautiful Markdown files.

### Example Output

Running the command above will generate files like:

```
2025-01-15_Math_Question.md
2025-01-16_Recipe_Help.md
```

Each file contains a nicely formatted conversation with timestamps, user/assistant markers, and preserved formatting.

## What is ai-chat-md-export?

`ai-chat-md-export` is a command-line tool that converts your AI chat conversations into clean, readable Markdown files. 

### Why use this tool?

- **Preserve your conversations**: Export your valuable AI interactions before they're lost or deleted
- **Better readability**: View conversations in any Markdown reader with proper formatting
- **Easy searching**: Search through your chat history using any text editor or grep
- **Version control**: Track changes and store conversations in Git
- **Share knowledge**: Easily share specific conversations with colleagues

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

| Option                | Short | Description                               | Default           |
| --------------------- | ----- | ----------------------------------------- | ----------------- |
| `--input`             | `-i`  | Input file or directory (required)        | -                 |
| `--output`            | `-o`  | Output directory                          | Current directory |
| `--format`            | `-f`  | Format: `chatgpt`, `claude`, `auto`       | `auto`            |
| `--since`             | -     | Filter from date (YYYY-MM-DD)             | -                 |
| `--until`             | -     | Filter until date (YYYY-MM-DD)            | -                 |
| `--search`            | -     | Search keyword                            | -                 |
| `--filename-encoding` | -     | Filename encoding: `standard`, `preserve` | `standard`        |
| `--quiet`             | `-q`  | Suppress output                           | -                 |
| `--dry-run`           | -     | Preview mode                              | -                 |

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

## Example Output

### Input (ChatGPT JSON):
```json
{
  "title": "Math Question",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": {"role": "user"},
        "content": {"parts": ["What is the square root of 144?"]}
      }
    }
  }
}
```

### Command:
```bash
ai-chat-md-export -i conversations.json
```

### Output (2025-01-15_Math_Question.md):
```markdown
# Math Question
Date: 2025-01-15 09:00:00 +09:00

---

## 👤 User
Date: 2025-01-15 09:00:00 +09:00

What is the square root of 144?

---

## 🤖 Assistant
Date: 2025-01-15 09:00:10 +09:00

The square root of 144 is 12.

---
```

## How it Works

The tool automatically detects whether your input is from ChatGPT or Claude and handles the conversion accordingly. ChatGPT uses a tree-based conversation structure while Claude uses a flat message array, but you don't need to worry about these differences - the tool takes care of everything.

Key features:
- **Auto-detection**: Automatically identifies the format
- **Preserves formatting**: Code blocks, lists, and special characters are maintained
- **Timestamps**: Converts all timestamps to your local timezone
- **Clean output**: Generates readable Markdown with clear message separation

## More Examples

For complete examples with multiple conversations, see the [examples](examples/) directory:

- **ChatGPT**: [Sample conversations](examples/chatgpt/) with multi-turn dialogues
- **Claude**: [Sample conversations](examples/claude/) with various conversation types

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)