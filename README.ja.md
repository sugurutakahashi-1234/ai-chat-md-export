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

ChatGPTとClaudeのチャット履歴を読みやすいMarkdownファイルに変換

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

## Quick Start

```bash
# 1. ツールをインストール
npm install -g ai-chat-md-export

# 2. ChatGPTまたはClaudeから会話をエクスポート
# → conversations.jsonファイルを取得（下記の「Getting conversations.json」セクション参照）

# 3. Markdownに変換
ai-chat-md-export -i conversations.json
```

これで完了！会話が整理され、検索可能なMarkdownファイルになりました。

### Example Output

上記のコマンドを実行すると、次のようなファイルが生成されます：

```
2025-01-15_Math_Question.md
2025-01-16_Recipe_Help.md
```

各ファイルには、タイムスタンプ、ユーザー/アシスタントマーカー、整形された会話が含まれています。

## What You'll Get

複雑なJSONエクスポートをクリーンで読みやすいMarkdownに変換：

### Input (ChatGPTからのconversations.json)
```json
{
  "title": "Hello World",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": { "role": "user" },
        "content": {
          "parts": ["こんにちは！元気ですか？"]
        }
      }
    },
    "msg-2": {
      "message": {
        "author": { "role": "assistant" },
        "content": {
          "parts": ["こんにちは！元気です、ありがとうございます。今日はどのようなお手伝いができますか？"]
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

こんにちは！元気ですか？

---

## 🤖 Assistant
Date: 2025-01-15 18:00:10 +09:00

こんにちは！元気です、ありがとうございます。今日はどのようなお手伝いができますか？

---
```

✨ **特徴**: クリーンなフォーマット • タイムスタンプ • 視覚的マーカー • コードブロックと書式を保持

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

### 直接ダウンロード (Windows / その他)

ビルド済みバイナリは[リリースページ](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest)から入手できます。

#### Windows
1. [ai-chat-md-export-windows-amd64.zip](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest/download/ai-chat-md-export-windows-amd64.zip)をダウンロード
2. ZIPファイルを展開
3. 展開したフォルダをPATHに追加するか、直接実行:
   ```cmd
   ai-chat-md-export.exe -i conversations.json
   ```

#### macOS / Linux
リリースページから適切な`.tar.gz`ファイルをダウンロードしてください。

## What is ai-chat-md-export?

`ai-chat-md-export`は、ChatGPTやClaudeの会話履歴を整理された読みやすいMarkdownファイルに変換するCLIツールです。

### Key benefits

- **AIチャットの保存**: 削除や消失前に大切な会話を保存
- **読みやすいフォーマット**: どんなMarkdownエディタでも快適に閲覧
- **履歴の検索・整理**: 標準的なツールでチャット履歴を検索・管理
- **共有やバージョン管理**: 必要に応じて会話を共有

## Privacy & Security

### 🔒 Offline-First Design

このツールは**インターネット接続を必要とせず**、お使いのデバイス上でローカルに動作するよう設計されています：

- **ネットワークリクエストなし**: ツール自体は外部APIコールやネットワーク接続を行いません
- **ローカル処理のみ**: すべての変換処理はお使いのマシン上で完結します
- **データ収集なし**: 分析、テレメトリ、トラッキング機能は一切含まれていません
- **データはローカルに保持**: 会話データはローカルファイルシステムからの読み込みと書き込みのみ

データプライバシーを重視する組織や個人に適しています。[ソースコード](https://github.com/sugurutakahashi-1234/ai-chat-md-export)をご確認いただければ、ネットワーク関連のコードが含まれていないことを検証できます。なお、私たちのコードは外部接続を行いませんが、すべての依存関係の動作を保証することはできません。

## Usage

```bash
# 基本: conversations.jsonをMarkdownファイルに変換
ai-chat-md-export -i conversations.json

# 出力ディレクトリを指定
ai-chat-md-export -i conversations.json -o output/

# 日付やキーワードでフィルタ
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"

# JSON形式でエクスポート
ai-chat-md-export -i conversations.json -f json

# すべての会話を1つのファイルにまとめる
ai-chat-md-export -i conversations.json --no-split
```

## Command-line Options

| オプション                       | 説明                                                                    | デフォルト |
| -------------------------------- | ----------------------------------------------------------------------- | ---------- |
| `-h, --help`                     | ヘルプ情報を表示                                                        | -          |
| `-v, --version`                  | バージョン番号を表示                                                    | -          |
| `-i, --input <path>`             | 入力ファイルまたはディレクトリパス（必須）                              | -          |
| `-o, --output <path>`            | 出力ディレクトリ                                                        | `.`        |
| `-f, --format <format>`          | 出力フォーマット（`markdown`/`json`）                                   | `markdown` |
| `--no-split`                     | すべての会話を1つのファイルにまとめる（デフォルト：ファイル分割）        | -          |
| `--since <date>`                 | 開始日でフィルタ（YYYY-MM-DD）。会話の開始日でフィルタリング            | -          |
| `--until <date>`                 | 終了日でフィルタ（YYYY-MM-DD）。指定日を含む                            | -          |
| `--search <keyword>`             | 会話内を検索。大文字小文字を区別せず、タイトルとメッセージを検索        | -          |
| `-p, --platform <platform>`      | 入力プラットフォーム（`chatgpt`/`claude`/`auto`）                       | `auto`     |
| `--filename-encoding <encoding>` | ファイル名エンコーディング（`standard`/`preserve`）                     | `standard` |
| `-q, --quiet`                    | 進捗メッセージを抑制                                                    | -          |
| `--dry-run`                      | ファイルを作成せずにプレビューモード                                    | -          |

## Getting conversations.json

ChatGPTとClaudeはどちらも、チャット履歴を`conversations.json`ファイルとしてエクスポートできます。このファイルには、すべての会話が構造化された形式で含まれており、本ツールで処理できます。

### Export from ChatGPT (OpenAI)

1. ChatGPT (https://chat.openai.com) にログイン
2. プロフィール画像をクリック → Settings
3. 左メニューから「Data Controls」を開く
4. 「Export Data」→「Export」をクリック
5. 「Confirm export」をクリックして確認
6. 数分以内に「Your ChatGPT data export is ready」というメールが届きます
7. メールのリンクから`chatgpt-data.zip`をダウンロード（24時間で期限切れ）
8. ZIPファイルを展開すると、ルートディレクトリに`conversations.json`が含まれています

注意：ダウンロードリンクは24時間後に期限切れになるため、速やかにダウンロードしてください。

### Export from Claude (Anthropic)

1. Claude (https://claude.ai) にログイン
2. 左下のイニシャルをクリック → Settings
3. 「Privacy」タブを開く（エンタープライズの場合は「Data management」）
4. 「Export data」をクリックして確認
5. 数分以内に「Your Claude data export is ready」というメールが届きます
6. `claude-export.dms`またはZIPファイルをダウンロード
7. `.dms`ファイルを受け取った場合は、`.zip`にリネームして展開
8. ルートディレクトリに`conversations.json`が含まれています

## Features

- **自動検出**: ChatGPTまたはClaudeの形式を自動的に識別
- **フォーマット保持**: コードブロック、リスト、特殊文字を維持
- **柔軟なフィルタリング**: 日付範囲（`--since`、`--until`）または検索キーワードでフィルタ
- **複数の出力形式**: Markdown（デフォルト）またはJSON
- **カスタマイズ可能な出力**: ファイル分割または1つにまとめる

例については、[examples](examples/)ディレクトリを参照してください。

## Troubleshooting

### Large files taking too long to process
このツールはファイルをバッチで処理します。非常に大きな会話履歴の場合：
- `--since`と`--until`を使用して特定の日付範囲を処理
- エクスポートを複数の小さなファイルに分割
- `--search`を使用して関連する会話のみを抽出

### Character encoding issues
出力に文字化けが表示される場合：
- ターミナルがUTF-8エンコーディングをサポートしていることを確認
- `conversations.json`ファイルが適切にエンコードされていることを確認

ファイル名エンコーディングの問題については：
- `--filename-encoding standard`（デフォルト）：オペレーティングシステム間で最大の互換性を持つようにファイル名をサニタイズ
- `--filename-encoding preserve`：会話タイトルから元の文字を保持しますが、特殊文字を含む場合は一部のシステムで問題が発生する可能性があります

### Missing conversations
一部の会話が出力に表示されない場合：
- エクスポート日を確認 - エクスポート日までの会話のみが含まれます
- JSON構造がChatGPTまたはClaudeの形式と一致することを確認
- `--dry-run`を使用してどの会話が変換されるかをプレビュー

## Roadmap

### ✅ Completed Features

- [x] ChatGPT会話エクスポート対応
- [x] Claude会話エクスポート対応
- [x] 自動フォーマット検出
- [x] 日付範囲フィルタリング（`--since`、`--until`）
- [x] キーワード検索機能（`--search`）
- [x] タイムゾーン対応のタイムスタンプ変換
- [x] ドライランモード（`--dry-run`）
- [x] JSON形式へのエクスポート（`-f json`）
- [x] 会話を1つのファイルにまとめる（`--no-split`）
- [x] npmパッケージ配布
- [x] Homebrewフォーミュラサポート

### 🚧 In Progress

- [ ] **プログレスバー** - 長時間処理時の視覚的フィードバック

### 📋 Planned Features

- [ ] **Geminiサポート** - Google Geminiからの会話エクスポート
- [ ] **エクスポート統計** - 会話数、メッセージ数、日付範囲を表示

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください

## Contact

ご質問やフィードバックがございましたら、X/Twitterでお気軽にご連絡ください: [@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)