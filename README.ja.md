# ai-chat-md-export

[![npm version](https://badge.fury.io/js/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ChatGPTとClaudeのチャット履歴をMarkdownに変換

## 機能

- ChatGPTとClaudeのエクスポートデータをMarkdownに変換
- フォーマット自動検出
- 日付（`--since`、`--until`）やキーワード（`--search`）でフィルタ
- ドライランモード（`--dry-run`）

## インストール

```bash
npm install -g ai-chat-md-export
```

## 使い方

```bash
# conversations.jsonを変換
ai-chat-md-export -i conversations.json

# 日付とキーワードでフィルタ
ai-chat-md-export -i data.json --since 2024-01-01 --search "API"

# ファイルを作成せずにプレビュー
ai-chat-md-export -i data.json --dry-run
```

## プログラマティックAPI

TypeScript/JavaScriptプロジェクトでライブラリとして使用することもできます：

```typescript
import { 
  loadChatGPT, 
  loadClaude, 
  convertToMarkdown,
  type Conversation 
} from "ai-chat-md-export";

// ChatGPTの会話を読み込んで変換
const conversations = await loadChatGPT("conversations.json");
const markdown = convertToMarkdown(conversations[0]);

// Claudeのデータを処理
const claudeConvs = await loadClaude("claude-export.json");
claudeConvs.forEach(conv => {
  const md = convertToMarkdown(conv);
  console.log(md);
});

// Conversation型を使用
function processConversation(conv: Conversation) {
  console.log(`タイトル: ${conv.title}`);
  console.log(`メッセージ数: ${conv.messages.length}`);
}
```

### オプション

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