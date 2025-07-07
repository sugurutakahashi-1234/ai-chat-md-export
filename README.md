# chat-history-conv

ChatGPTとClaudeのチャット履歴をMarkdownに変換するBun対応CLIツール

## 機能

- ChatGPTとClaudeのエクスポートデータを読み込み
- Markdown形式に変換して保存
- 詳細なスキーマ検証とエラーレポート
- 未知のフィールドの検出（形式変更の検知）
- 単一バイナリとしての配布が可能

## セットアップ

### 1. インストール

```bash
# リポジトリをクローン
git clone https://github.com/suguruTakahashi-1234/chat-history-conv.git
cd chat-history-conv

# Bunで依存関係をインストール
bun install
```

### 2. データの準備

エクスポートしたデータを以下の場所に配置：

```
data/raw/
├── chatgpt/
│   └── conversations.json  # ChatGPTからエクスポートしたJSON
└── claude/
    └── conversations.json  # ClaudeからエクスポートしたJSON
```

## 使い方

### 基本的な使い方（推奨）

```bash
# ChatGPTとClaudeの両方を変換
bun run conv:all

# ChatGPTのみ変換
bun run conv:chatgpt

# Claudeのみ変換
bun run conv:claude
```

### 警告付き実行（形式変更の検出）

```bash
# 未知のフィールドやスキーマエラーをログファイルに出力
bun run conv:chatgpt:watch  # → chatgpt-warnings.log
bun run conv:claude:watch    # → claude-warnings.log
```

### カスタムパスでの実行

```bash
# CLIを直接使用
bun run src/cli.ts -i <入力パス> -o <出力パス> --format <形式>

# ビルド済みバイナリを使用
./bin/chat-history-conv -i <入力パス> -o <出力パス>
```

## 出力先

変換されたMarkdownファイルは以下に保存されます：

```
data/md/
├── chatgpt/
│   └── YYYY-MM-DD_タイトル.md
└── claude/
    └── YYYY-MM-DD_タイトル.md
```

## スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `bun run conv:all` | ChatGPTとClaudeの両方を変換 |
| `bun run conv:chatgpt` | ChatGPTデータのみ変換 |
| `bun run conv:claude` | Claudeデータのみ変換 |
| `bun run conv:chatgpt:watch` | ChatGPT変換（警告ログ付き） |
| `bun run conv:claude:watch` | Claude変換（警告ログ付き） |
| `bun run build` | 単一バイナリをビルド |
| `bun run typecheck` | 型チェック |
| `bun run lint` | コードのリント＆修正 |

## ディレクトリ構造

```
chat-history-conv/
├── src/              # ソースコード
│   ├── cli.ts        # CLIエントリポイント
│   ├── loaders/      # 各サービス用ローダー
│   ├── schemas/      # Zodスキーマ定義
│   ├── utils/        # ユーティリティ
│   └── markdown.ts   # Markdown変換
├── bin/              # ビルド済みバイナリ
└── data/
    ├── raw/          # エクスポートした生データを配置
    │   ├── chatgpt/
    │   └── claude/
    └── md/           # 変換済みMarkdown出力先
        ├── chatgpt/
        └── claude/
```

## 開発

```bash
# 型チェック
bun run typecheck

# リント
bun run lint

# フォーマット
bun run format

# ビルド（型チェック付き）
bun run build:all
```

## トラブルシューティング

### エクスポート形式が変更された場合

`conv:*:watch` コマンドを使用すると、未知のフィールドやスキーマエラーが検出されます：

```bash
bun run conv:chatgpt:watch
# chatgpt-warnings.log を確認
```

ログには以下の情報が含まれます：
- 未知のフィールド名
- 型の不一致
- 必須フィールドの欠落

### Claudeのデータ形式について

Claudeは以下の形式をサポート：
- JSON配列形式（新形式）：`sender`フィールドで役割を判定
- JSON配列形式（旧形式）：`role`フィールドで役割を判定
- NDJSON形式（改行区切りJSON）

形式は自動検出されます。最新のClaudeエクスポートでは、メッセージの役割が`sender`フィールド（"human"/"assistant"）で表現されています。