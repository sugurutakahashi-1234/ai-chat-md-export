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

Convert ChatGPT and Claude chat history to Markdown

[Japanese](README.ja.md)

## Features

- Convert ChatGPT and Claude export data to Markdown
- Auto-detect format
- Filter by date (`--since`, `--until`) or keyword (`--search`)
- Dry-run mode (`--dry-run`)

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

```bash
# Convert conversations.json
ai-chat-md-export -i conversations.json

# Convert all JSON files in a directory
ai-chat-md-export -i exports/ -o output/

# Filter by date range
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# Filter by date and keyword
ai-chat-md-export -i data.json --since 2024-01-01 --search "API"

# Preview without creating files
ai-chat-md-export -i data.json --dry-run
```

## Options

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)