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

ChatGPTとClaudeのチャット履歴を読みやすいMarkdownファイルに変換

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

### 出力例

上記のコマンドを実行すると、次のようなファイルが生成されます：

```
2025-01-15_数学の質問.md
2025-01-16_レシピのヘルプ.md
```

各ファイルには、タイムスタンプ、ユーザー/アシスタントマーカー、整形された会話が含まれています。

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

`ai-chat-md-export`は、AIチャットの会話履歴を整形されたMarkdownファイルに変換するコマンドラインツールです。

### なぜこのツールが必要？

- **会話の保存**: 貴重なAIとのやり取りが失われたり削除される前にエクスポート
- **読みやすさの向上**: 任意のMarkdownリーダーで適切にフォーマットされた会話を閲覧
- **簡単な検索**: テキストエディタやgrepでチャット履歴を検索可能
- **バージョン管理**: Gitで変更を追跡し、会話を保存
- **知識の共有**: 特定の会話を同僚と簡単に共有

### 実際の使用例

- **技術文書化**: 問題解決セッションをドキュメントに変換
- **学習アーカイブ**: AIチュータリングセッションから個人的な知識ベースを構築
- **ブログコンテンツ**: 興味深い議論をブログ記事の下書きに変換
- **チームでの知識共有**: AI支援の調査をチームと共有
- **プロンプトエンジニアリング**: 成功したプロンプトと応答を保存・分析

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

| オプション | 説明 | デフォルト |
| ---------- | ---- | ---------- |
| `-i, --input <path>` | 入力ファイルまたはディレクトリ（必須） | - |
| `-o, --output <path>` | 出力ディレクトリ | `.` |
| `-f, --format <format>` | 入力フォーマット（`chatgpt`/`claude`/`auto`） | `auto` |
| `--since <date>` | 開始日でフィルタ (YYYY-MM-DD) | - |
| `--until <date>` | 終了日でフィルタ (YYYY-MM-DD) | - |
| `--search <keyword>` | 会話内を検索 | - |
| `--filename-encoding <encoding>` | ファイル名エンコーディング（`standard`/`preserve`） | `standard` |
| `-q, --quiet` | 進捗メッセージを抑制 | - |
| `--dry-run` | ファイルを作成せずにプレビュー | - |

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

## 日付フィルタリングの詳細

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

## 検索機能

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

### 大きなファイルの処理に時間がかかる
このツールはファイルをバッチで処理します。非常に大きな会話履歴の場合：
- `--since` と `--until` を使用して特定の日付範囲を処理
- エクスポートを複数の小さなファイルに分割
- `--search` を使用して関連する会話のみを抽出

### 文字エンコーディングの問題
出力に文字化けが表示される場合：
- ターミナルがUTF-8エンコーディングをサポートしていることを確認
- `conversations.json` ファイルが適切にエンコードされていることを確認

ファイル名エンコーディングの問題については：
- `--filename-encoding standard`（デフォルト）: オペレーティングシステム間で最大の互換性を持つようにファイル名をサニタイズ
- `--filename-encoding preserve`: 会話タイトルから元の文字を保持しますが、特殊文字を含む場合は一部のシステムで問題が発生する可能性があります

### 会話が見つからない
一部の会話が出力に表示されない場合：
- エクスポート日を確認 - エクスポート日までの会話のみが含まれます
- JSON構造がChatGPTまたはClaudeの形式と一致することを確認
- `--dry-run` を使用してどの会話が変換されるかをプレビュー

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)