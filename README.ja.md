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

## What is ai-chat-md-export?

`ai-chat-md-export`は、AIチャットの会話履歴を整形されたMarkdownファイルに変換するコマンドラインツールです。

### なぜこのツールが必要？

- **会話の保存**: 貴重なAIとのやり取りが失われたり削除される前にエクスポート
- **読みやすさの向上**: 任意のMarkdownリーダーで適切にフォーマットされた会話を閲覧
- **簡単な検索**: テキストエディタやgrepでチャット履歴を検索可能
- **バージョン管理**: Gitで変更を追跡し、会話を保存
- **知識の共有**: 特定の会話を同僚と簡単に共有

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

| オプション            | 短縮 | 説明                                      | デフォルト        |
| --------------------- | ---- | ----------------------------------------- | ----------------- |
| `--input`             | `-i` | 入力ファイルまたはディレクトリ（必須）    | -                 |
| `--output`            | `-o` | 出力ディレクトリ                          | カレントディレクトリ |
| `--format`            | `-f` | フォーマット: `chatgpt`, `claude`, `auto` | `auto`            |
| `--since`             | -    | 開始日でフィルタ (YYYY-MM-DD)             | -                 |
| `--until`             | -    | 終了日でフィルタ (YYYY-MM-DD)             | -                 |
| `--search`            | -    | 検索キーワード                            | -                 |
| `--filename-encoding` | -    | ファイル名エンコーディング: `standard`, `preserve` | `standard` |
| `--quiet`             | `-q` | 出力を抑制                                | -                 |
| `--dry-run`           | -    | プレビューモード                          | -                 |

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

## Example Output

### Input (ChatGPT JSON):
```json
{
  "title": "数学の質問",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": {"role": "user"},
        "content": {"parts": ["144の平方根は？"]}
      }
    }
  }
}
```

### Command:
```bash
ai-chat-md-export -i conversations.json
```

### Output (2025-01-15_数学の質問.md):
```markdown
# 数学の質問
Date: 2025-01-15 09:00:00 +09:00

---

## 👤 User
Date: 2025-01-15 09:00:00 +09:00

144の平方根は？

---

## 🤖 Assistant
Date: 2025-01-15 09:00:10 +09:00

144の平方根は12です。

---
```

## How it Works

このツールは、入力がChatGPTかClaudeかを自動的に検出し、適切に変換を処理します。ChatGPTはツリーベースの会話構造を使用し、Claudeはフラットなメッセージ配列を使用しますが、これらの違いを意識する必要はありません - ツールがすべてを処理します。

主な機能:
- **自動検出**: フォーマットを自動的に識別
- **フォーマット保持**: コードブロック、リスト、特殊文字を維持
- **タイムスタンプ**: すべてのタイムスタンプをローカルタイムゾーンに変換
- **クリーンな出力**: 明確なメッセージ区切りで読みやすいMarkdownを生成

## More Examples

複数の会話を含む完全な例については、[examples](examples/)ディレクトリを参照してください：

- **ChatGPT**: 複数ターンの対話を含む[サンプル会話](examples/chatgpt/)
- **Claude**: 様々な会話タイプの[サンプル会話](examples/claude/)

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)