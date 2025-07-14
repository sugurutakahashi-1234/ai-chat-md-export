# ai-chat-md-export

[![npm version](https://img.shields.io/npm/v/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![Homebrew](https://img.shields.io/badge/Homebrew-tap-orange.svg)](https://github.com/sugurutakahashi-1234/homebrew-tap)
[![CI](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export/graph/badge.svg?token=KPN7UZ7ATY)](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)

ChatGPTとClaudeのチャット履歴をMarkdownに変換

## 機能

- ChatGPTとClaudeのエクスポートデータをMarkdownに変換
- フォーマット自動検出
- 日付（`--since`、`--until`）やキーワード（`--search`）でフィルタ
- ドライランモード（`--dry-run`）

## インストール

### npm

```bash
npm install -g ai-chat-md-export
```

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/ai-chat-md-export
brew install ai-chat-md-export
```

## 使い方

```bash
# conversations.jsonを変換
ai-chat-md-export -i conversations.json

# ディレクトリ内のすべてのJSONファイルを変換
ai-chat-md-export -i exports/ -o output/

# 日付範囲でフィルタ
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# 日付とキーワードでフィルタ
ai-chat-md-export -i data.json --since 2024-01-01 --search "API"

# ファイルを作成せずにプレビュー
ai-chat-md-export -i data.json --dry-run
```

## オプション

| オプション | 短縮形 | 説明 | デフォルト |
|--------|-------|-------------|---------|
| `--input` | `-i` | 入力ファイル・ディレクトリ（必須） | - |
| `--output` | `-o` | 出力ディレクトリ | カレントディレクトリ |
| `--format` | `-f` | フォーマット: `chatgpt`、`claude`、`auto` | `auto` |
| `--since` | - | 開始日（YYYY-MM-DD） | - |
| `--until` | - | 終了日（YYYY-MM-DD） | - |
| `--search` | - | 検索キーワード | - |
| `--filename-encoding` | - | ファイル名エンコーディング: `standard`、`preserve` | `standard` |
| `--quiet` | `-q` | 出力を抑制 | - |
| `--dry-run` | - | プレビューモード | - |

## コントリビューション

[CONTRIBUTING.ja.md](CONTRIBUTING.ja.md)を参照

## ライセンス

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)