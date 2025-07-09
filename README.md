# ai-chat-md-export

[![npm version](https://badge.fury.io/js/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert ChatGPT and Claude chat history to Markdown

[日本語版 README](README.ja.md)

## Features

- Convert ChatGPT and Claude export data to Markdown
- Auto-detect format
- Filter by date (`--since`, `--until`) or keyword (`--search`)
- Dry-run mode (`--dry-run`)

## Installation

```bash
npm install -g ai-chat-md-export
```

## Usage

```bash
# Convert conversations.json
ai-chat-md-export -i conversations.json

# Filter by date and keyword
ai-chat-md-export -i data.json --since 2024-01-01 --search "API"

# Preview without creating files
ai-chat-md-export -i data.json --dry-run
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--input` | `-i` | Input file or directory (required) | - |
| `--output` | `-o` | Output directory | Current directory |
| `--format` | `-f` | Format: `chatgpt`, `claude`, `auto` | `auto` |
| `--since` | - | Filter from date (YYYY-MM-DD) | - |
| `--until` | - | Filter until date (YYYY-MM-DD) | - |
| `--search` | - | Search keyword | - |
| `--filename-encoding` | - | Filename encoding: `unicode`, `url-safe`, `simple` | `unicode` |
| `--quiet` | `-q` | Suppress output | - |
| `--dry-run` | - | Preview mode | - |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)