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

# 2. conversations.jsonファイルを取得（Getting conversations.json参照）
# ChatGPTまたはClaudeからエクスポート

# 3. Markdownに変換
ai-chat-md-export -i conversations.json
```

これで会話が美しいMarkdownファイルになりました！

### Example Output

上記のコマンドを実行すると、次のようなファイルが生成されます：

```
2025-01-15_数学の質問.md
2025-01-16_レシピのヘルプ.md
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

- **AIチャットの保存**: 削除や消失前に大切な会話をエクスポート
- **読みやすいフォーマット**: どんなMarkdownエディタでも快適に閲覧
- **履歴の検索・整理**: 標準的なツールでチャット履歴を検索・管理
- **共有やバージョン管理**: 必要に応じて会話を共有・Gitで管理

## Privacy & Security

### 🔒 Offline-First Design

このツールは**インターネット接続を必要とせず**、お使いのデバイス上でローカルに動作するよう設計されています：

- **ネットワークリクエストなし**: ツール自体は外部APIコールやネットワーク接続を行いません
- **ローカル処理のみ**: すべての変換処理はお使いのマシン上で完結します
- **データ収集なし**: 分析、テレメトリ、トラッキング機能は一切含まれていません
- **データはローカルに保持**: 会話データはローカルファイルシステムからの読み込みと書き込みのみ

データプライバシーを重視する組織や個人に適しています。[ソースコード](https://github.com/sugurutakahashi-1234/ai-chat-md-export)をご確認いただければ、ネットワーク関連のコードが含まれていないことを検証できます。なお、私たちのコードは外部接続を行いませんが、すべての依存関係の動作を保証することはできません。

## Usage

### Basic usage

```bash
# 単一のconversations.jsonファイルを変換
ai-chat-md-export -i conversations.json

# ディレクトリ内のすべてのJSONファイルを変換
ai-chat-md-export -i exports/ -o output/

# 出力ディレクトリを指定
ai-chat-md-export -i conversations.json -o markdown/
```

### Filtering options

```bash
# 日付範囲でフィルタ
ai-chat-md-export -i conversations.json --since 2024-01-01 --until 2024-12-31

# 特定のキーワードを検索
ai-chat-md-export -i conversations.json --search "API"

# フィルタを組み合わせる
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"
```

### Other options

```bash
# ファイルを作成せずに変換内容をプレビュー
ai-chat-md-export -i conversations.json --dry-run

# 静かなモード（進行状況メッセージを抑制）
ai-chat-md-export -i conversations.json --quiet
```

## Command-line Options

| オプション                       | 説明                                                | デフォルト |
| -------------------------------- | --------------------------------------------------- | ---------- |
| `-i, --input <path>`             | 入力ファイルまたはディレクトリ（必須）              | -          |
| `-o, --output <path>`            | 出力ディレクトリ                                    | `.`        |
| `-f, --format <format>`          | 入力フォーマット（`chatgpt`/`claude`/`auto`）       | `auto`     |
| `--since <date>`                 | 開始日でフィルタ (YYYY-MM-DD)                       | -          |
| `--until <date>`                 | 終了日でフィルタ (YYYY-MM-DD)                       | -          |
| `--search <keyword>`             | 会話内を検索                                        | -          |
| `--filename-encoding <encoding>` | ファイル名エンコーディング（`standard`/`preserve`） | `standard` |
| `-q, --quiet`                    | 進捗メッセージを抑制                                | -          |
| `--dry-run`                      | ファイルを作成せずにプレビュー                      | -          |

## Getting conversations.json

ChatGPTとClaudeはどちらも、チャット履歴を`conversations.json`ファイルとしてエクスポートできます。このファイルには、すべての会話が構造化された形式で含まれており、本ツールで処理できます。

### Export from ChatGPT (OpenAI)

1. ChatGPT (https://chat.openai.com) にログイン
2. 画面右上のプロフィール画像 → Settings を選択
3. 左メニュー Data Controls を開く
4. Export Data → Export をクリック
5. 「Confirm export」で確定
6. 数分後に届くメール "Your ChatGPT data export is ready" のリンクを 24 時間以内に開き、chatgpt-data.zip をダウンロード
7. ZIP を展開すると ルートに conversations.json（全スレッドの生 JSON）が含まれている

注意: ダウンロードリンクは24時間で失効するため、速やかにダウンロードしてください。

### Export from Claude (Anthropic)

1. https://claude.ai にログイン
2. 画面左下のイニシャル → Settings を選択
3. Privacy タブ（エンタープライズの場合は Data management）を開く
4. Export data をクリックし確認
5. 数分後に届くメール "Your Claude data export is ready" から claude-export.dms もしくは ZIP を取得
6. .dms 形式の場合は拡張子を .zip にリネームして展開
7. 展開先ルートに conversations.json が入っている


## How it Works

このツールは、入力がChatGPTかClaudeかを自動的に検出し、適切に変換を処理します。ChatGPTはツリーベースの会話構造を使用し、Claudeはフラットなメッセージ配列を使用しますが、これらの違いを意識する必要はありません - ツールがすべてを処理します。

主な機能:
- **自動検出**: フォーマットを自動的に識別
- **フォーマット保持**: コードブロック、リスト、特殊文字を維持
- **タイムスタンプ**: すべてのタイムスタンプをローカルタイムゾーンに変換
- **クリーンな出力**: 明確なメッセージ区切りで読みやすいMarkdownを生成

## Date Filtering Details

`--since`と`--until`オプションは、会話が**開始された**日付に基づいてフィルタリングします（最終更新日ではありません）：

- **ChatGPT**: エクスポートの`create_time`フィールドを使用
- **Claude**: エクスポートの`created_at`フィールドを使用
- **日付形式**: YYYY-MM-DD（例：2024-01-15）
- **タイムゾーン**: すべての日付はローカルタイムゾーンで解釈されます
- **包括的フィルタリング**: --sinceと--untilの両方の日付は包括的です

例：
```bash
# 2024年の会話
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# 過去30日間の会話（今日が2024-12-15の場合）
ai-chat-md-export -i data.json --since 2024-11-15

# 特定の日の会話のみ
ai-chat-md-export -i data.json --since 2024-06-01 --until 2024-06-01
```

## Search Functionality

`--search`オプションは強力なフィルタリング機能を提供します：

- **大文字小文字を区別しない**: "API"、"api"、"Api"などすべてにマッチ
- **どこでも検索**: 会話タイトルとすべてのメッセージ内容の両方
- **部分一致**: "learn"は"learning"、"machine learning"などにマッチ
- **複数の単語**: 入力されたとおりの正確なフレーズを検索

例：
```bash
# Pythonに関するすべての会話を検索
ai-chat-md-export -i data.json --search "python"

# 特定のエラーメッセージを検索
ai-chat-md-export -i data.json --search "TypeError: cannot read property"

# 日付フィルタリングと組み合わせ
ai-chat-md-export -i data.json --search "docker" --since 2024-01-01
```

## More Examples

複数の会話を含む完全な例については、[examples](examples/)ディレクトリを参照してください：

- **ChatGPT**: 複数ターンの対話を含む[サンプル会話](examples/chatgpt/)
- **Claude**: 様々な会話タイプの[サンプル会話](examples/claude/)

## Troubleshooting

### Large files taking too long to process
このツールはファイルをバッチで処理します。非常に大きな会話履歴の場合：
- `--since` と `--until` を使用して特定の日付範囲を処理
- エクスポートを複数の小さなファイルに分割
- `--search` を使用して関連する会話のみを抽出

### Character encoding issues
出力に文字化けが表示される場合：
- ターミナルがUTF-8エンコーディングをサポートしていることを確認
- `conversations.json` ファイルが適切にエンコードされていることを確認

ファイル名エンコーディングの問題については：
- `--filename-encoding standard`（デフォルト）: オペレーティングシステム間で最大の互換性を持つようにファイル名をサニタイズ
- `--filename-encoding preserve`: 会話タイトルから元の文字を保持しますが、特殊文字を含む場合は一部のシステムで問題が発生する可能性があります

### Missing conversations
一部の会話が出力に表示されない場合：
- エクスポート日を確認 - エクスポート日までの会話のみが含まれます
- JSON構造がChatGPTまたはClaudeの形式と一致することを確認
- `--dry-run` を使用してどの会話が変換されるかをプレビュー

## Roadmap

### ✅ Completed Features

- [x] ChatGPT会話エクスポート対応
- [x] Claude会話エクスポート対応
- [x] 自動フォーマット検出 (`--format auto`)
- [x] 日付範囲フィルタリング (`--since`, `--until`)
- [x] キーワード検索機能 (`--search`)
- [x] タイムゾーン対応のタイムスタンプ変換
- [x] ドライランモード (`--dry-run`)
- [x] npmパッケージ配布
- [x] Homebrewサポート

### 🚧 In Progress

- [ ] **JSON形式へのエクスポート** - 構造化されたJSON出力オプション
- [ ] **プログレスバー** - 長時間処理時の視覚的フィードバック

### 📋 Planned Features

- [ ] **Geminiサポート** - Google Geminiからの会話エクスポート
- [ ] **エクスポート統計** - 会話数、メッセージ数、期間などの表示

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください

## Contact

ご質問やフィードバックがございましたら、X/Twitterでお気軽にご連絡ください: [@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)