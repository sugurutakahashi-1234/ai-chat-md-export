# Obsidian MCP Integration Guide

日付: 2025-05-16

---

## 👤 ユーザー
*2025/5/16 17:29:19*

obsidian mcp 連携手順

---

## 🤖 アシスタント
*2025/5/16 17:29:41*

ObiridianとModel Context Protocol（MCP）の連携手順について調べてみましょう。情報を収集します。
```
This block is not supported on your current device yet.
```



検索結果に基づいて、ObsidianとModel Context Protocol (MCP)の連携手順をご説明します。

# Obsidian MCP 連携手順

## 前提条件
1. Obsidianがインストールされていること
2. Claude Desktop（または他のMCPクライアント）がインストールされていること
3. Obsidianでは「Local REST API」プラグインがインストールされていること（一部の連携方法で必要）

## 連携方法（主な2つの選択肢）

### 方法1: Smitheryを使用した簡単インストール
これが最も簡単な方法です：

1. ターミナルで以下のコマンドを実行します：
   ```
   npx @smithery/cli install mcp-obsidian --client claude
   ```

2. プロンプトが表示されたら、Obsidianデータベース（Vault）のパスを入力します

3. Claude Desktopが自動的に再起動され、MCPサーバーが接続されます

4. 接続が成功すると、Claudeのインターフェースにハンマーアイコンが表示されます

### 方法2: 手動設定

1. お好みのObsidian MCPサーバー実装を選択します（いくつかのオプションがあります）：
   - StevenStavrakisのobsidian-mcp
   - punkpeyeのmcp-obsidian-1
   - cyanheadsのobsidian-mcp-server
   - その他

2. Claude Desktopの設定ファイルを編集します：
   - 場所: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Claude Desktopメニューからもアクセス可能

3. 設定ファイルに以下の内容を追加します（選択したMCPサーバーによって内容が異なります）：
   ```json
   {
     "mcpServers": {
       "obsidian": {
         "command": "npx",
         "args": ["-y", "obsidian-mcp", "/path/to/your/vault"],
         "env": {
           "OBSIDIAN_VAULT_PATH": "/path/to/your/vault"
         }
       }
     }
   }
   ```

4. `/path/to/your/vault`を実際のObsidian Vaultのパスに置き換えます

5. Claude Desktopを再起動して設定を反映させます

## 使用方法

設定が完了したら、Claudeに以下のようなプロンプトでObsidianの内容を操作できます：

- 「using the mcp-obsidian MCP server, summarise activity in the Journal」
- 「obsidian vaultから[特定のファイル]を検索して」
- 「obsidianのノートを要約して」

## 主な機能

MCPサーバーによって提供される主な機能：

- ノートの読み取り（obsidian_read_notes）
- ノートの検索（obsidian_search_notes）
- ディレクトリ構造の表示（obsidian_read_notes_dir）
- ノートの作成・編集（obsidian_write_note）
- タグ管理
- YAML frontmatterの編集

## 注意事項

- Obsidian vaultのバックアップを事前に取っておくことを強く推奨します
- 初めて使用する際には、読み取り操作から始めて、書き込み操作は慎重に行いましょう
- ファイルシステムMCPサーバーとObsidian MCPサーバーが競合する場合があります。その場合はファイルシステムMCPサーバーを一時的に無効化してみてください

この設定を行うことで、Claude DesktopがあなたのObsidian vaultと連携し、ノートの検索や管理が可能になります。何か具体的な部分についてさらに詳しく知りたい場合は、お知らせください。

---
