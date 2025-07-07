# chat-history-conv

ChatGPTとClaudeのチャット履歴をMarkdownに変換するBun対応CLIツール

## 機能

- ChatGPTとClaudeのエクスポートデータを読み込み
- Markdown形式に変換して保存
- 生データのバックアップ機能
- 単一バイナリとしての配布が可能

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/chat-history-conv.git
cd chat-history-conv

# Bunで依存関係をインストール
bun install

# 単一バイナリをビルド
bun run build
```

## 使い方

### 開発時の実行

```bash
bun run src/cli.ts -i exports/chat_2025-07-07.json --copy-raw
```

### ビルド済みバイナリの実行

```bash
./bin/chat-history-conv -i exports/chat_2025-07-07.json --copy-raw
```

### オプション

- `-i, --input <path>`: 入力ファイルまたはディレクトリのパス（必須）
- `-o, --output <path>`: 出力ディレクトリ（デフォルト: `data/md/`）
- `-f, --format <format>`: 入力形式 (chatgpt, claude, auto)（デフォルト: auto）
- `--copy-raw`: 生データを `data/raw/` にコピー

## ディレクトリ構造

```
chat-history-conv/
├─ src/              # ソースコード
│  ├─ cli.ts        # CLIエントリポイント
│  ├─ loaders/      # 各サービス用ローダー
│  └─ markdown.ts   # Markdown変換
├─ bin/             # ビルド済みバイナリ
└─ data/
   ├─ raw/          # 生データバックアップ
   └─ md/           # 変換済みMarkdown
```

## 開発

```bash
# 型チェック
bun run typecheck

# 開発時実行
bun run dev

# 単一バイナリビルド
bun run build
```
