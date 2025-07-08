# Connecting GitHub Copilot with Model Context Protocol in VSCode

日付: 2025-05-20

---

## 👤 ユーザー
*2025/05/20 19:19:46*

VScodeがすごく重くなってしまった

どこの設定を見ればツールの設定をやめられるか？

---

## 👤 ユーザー
*2025/05/20 18:56:02*

GitHub Copilotで mcp 連携したい。VScodede

---

## 🤖 アシスタント
*2025/05/20 18:56:35*

GitHub Copilotと Model Context Protocolを連携させたいとのことですね。VSCodeで設定したいようですね。現状の情報を調べて最新の方法をご案内します。
*[ツール使用: 対応していないブロック]*


*[ツール使用: 対応していないブロック]*



調査結果に基づき、GitHub CopilotでModel Context Protocol (MCP)連携を行う方法について説明します。

## VSCodeでGitHub CopilotとMCPを連携する方法

VSCodeバージョン1.99（2025年3月リリース）以降では、GitHub Copilotのエージェントモードでモデルコンテキストプロトコル（MCP）サポートが導入されました。これによりVSCode上のCopilotが外部ツールやデータソースと連携できるようになりました。

### 前提条件

1. VSCode 1.99以降
2. GitHub Copilotが有効化されている
3. エージェントモードが有効になっている

### MCPサーバーのセットアップ手順

1. **エージェントモードを有効化する**：
   - VSCodeでGitHub Copilotチャットを開く
   - サイドバーのCopilotアイコンをクリックし、エージェントモードを選択

2. **MCPサーバーを追加する方法**：
   - チャットビューのツールアイコン(🔧)をクリック
   - 「Add More Tools...」をクリック
   - 「Add MCP Server」を選択

3. **Anthropic Claudeを利用するには**：
   - NPXパッケージを選択する場合、`@modelcontextprotocol/server-github`などのサーバーパッケージを指定
   - ローカルサーバーとしてAnthropicのClaudeを連携する場合は、Claude Desktopアプリのインストールが推奨

4. **設定ファイルで設定する方法**：
   - プロジェクト固有：プロジェクトルートに`.vscode/mcp.json`ファイルを作成
   - ユーザー全体：ユーザー設定（settings.json）に追加
   - 自動検出：`chat.mcp.discovery.enabled`設定を有効にすると、Claude DesktopのMCPサーバーを自動検出

### 設定例（.vscode/mcp.jsonまたはsettings.json）

```json
{
  "mcpServers": {
    "github-server": {
      "command": "@modelcontextprotocol/server-github",
      "args": [],
      "env": {}
    }
  }
}
```

### Claude MCPサーバーを特別に使いたい場合

Claude 3.7 Sonnet（2025年4月から利用可能）はVS CodeチームがCopilotエージェントモードで推奨するモデルとなっています。これを利用するには：

1. GitHub Copilotの設定で「Claude 3.7 Sonnet」を選択
2. Claude DesktopアプリからMCPサーバーの設定を連携

## 今後の発展

2025年4月から、GitHubはオープンソースのローカルGitHub MCPサーバーを公開しています。これはVSCodeに標準対応しており、設定が簡単になっています。また、ClaudeなどのAIモデルも選択肢に加わり、使いやすくなっています。

この設定を行うことで、GitHub CopilotでMCPを通じてAnthropicのClaudeを含む様々なAIモデルやツールと連携が可能になります。より高度なコーディング支援が実現できるでしょう。

---

## 🤖 アシスタント
*2025/05/20 19:20:02*

VSCodeが重くなってしまう原因として、MCPサーバー（特にZapier MCP）の接続待ちが続いているようですね。ツールの設定を無効化するには以下の方法があります：

### MCPサーバーを停止/無効化する方法

1. **コマンドパレットから停止する**:
   - `Ctrl+Shift+P`（Windowsの場合）または `Cmd+Shift+P`（Macの場合）でコマンドパレットを開く
   - `MCP: List Servers` と入力して実行
   - 表示されるサーバー一覧から「Zapier MCP」を見つけて「Stop」を選択

2. **設定ファイルから削除する**:
   - 画面左側に表示されている `settings.json` ファイルを開く
   - `mcpServers` セクションを探し、「Zapier MCP」の設定を削除または無効化

3. **エージェントモードのツール設定から無効にする**:
   - Copilotのチャットパネルの左上にあるツールアイコン（🔧）をクリック
   - 表示されるツール一覧から「Zapier MCP」のチェックを外す

4. **VSCode全体の設定からMCPを無効にする**:
   - `Ctrl+,`（Windowsの場合）または `Cmd+,`（Macの場合）で設定を開く
   - 検索バーに「mcp」と入力
   - `chat.mcp.enabled` の設定を `false` に変更

### VSCode全体のパフォーマンス改善

重くなっている場合は、以下も試してみてください：

1. **拡張機能の見直し**:
   - `Ctrl+Shift+X` で拡張機能パネルを開く
   - 使用していない拡張機能を一時的に無効化

2. **VSCodeの再起動**:
   - 一度VSCodeを完全に終了して再起動

3. **キャッシュのクリア**:
   - コマンドパレットから `Developer: Reload Window` を実行

画像から判断すると、Zapier MCPサーバーがタイムアウトし続けていることがパフォーマンス低下の原因と思われます。まずはMCPサーバーを停止して、状況が改善するか確認してみてください。

---

## 👤 ユーザー
*2025/05/20 19:22:43*

Macのコマンドで表示してほしい

---

## 🤖 アシスタント
*2025/05/20 19:22:53*

MacでVSCodeのMCP設定を無効化するためのコマンドは以下の通りです：

### MCPサーバーを停止/無効化する方法（Mac向け）

1. **コマンドパレットから停止する**:
   - `Cmd+Shift+P` でコマンドパレットを開く
   - `MCP: List Servers` と入力して実行
   - 表示されるサーバー一覧から「Zapier MCP」を見つけて「Stop」を選択

2. **設定ファイルから削除する**:
   - `Cmd+,` で設定を開く
   - 右上の「{}」アイコンをクリックして`settings.json`を開く
   - `mcpServers` セクションを探し、「Zapier MCP」の設定を削除または無効化

3. **エージェントモードのツール設定から無効にする**:
   - Copilotのチャットパネルの左上にあるツールアイコン（🔧）をクリック
   - 表示されるツール一覧から「Zapier MCP」のチェックを外す

4. **VSCode全体の設定からMCPを無効にする**:
   - `Cmd+,` で設定を開く
   - 検索バーに「mcp」と入力
   - `chat.mcp.enabled` の設定を `false` に変更

### VSCode全体のパフォーマンス改善（Mac向け）

1. **拡張機能の見直し**:
   - `Cmd+Shift+X` で拡張機能パネルを開く
   - 使用していない拡張機能を一時的に無効化

2. **VSCodeの再起動**:
   - `Cmd+Q` でVSCodeを完全に終了して再起動

3. **キャッシュのクリア**:
   - `Cmd+Shift+P` でコマンドパレットを開き、`Developer: Reload Window` を実行

状況によっては、ターミナルからプロセスを確認・終了する方法も効果的です：
```bash
ps aux | grep "Zapier MCP"
kill <プロセスID>
```

これらの方法でZapier MCPサーバーを停止して、VSCodeのパフォーマンスが改善するか確認してみてください。

---
