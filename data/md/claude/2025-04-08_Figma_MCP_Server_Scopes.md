# Figma MCP Server Scopes

日付: 2025-04-08

---

## 👤 ユーザー
*2025/4/8 18:31:27*

Figma のMCPサーバーで利用する際のスコープは？

---

## 🤖 アシスタント
*2025/4/8 18:31:40*

This image shows a dialog for creating a new personal access token in Figma. The image is in Japanese, and it's showing the scopes (permissions) that can be granted to the token. The user is asking about what scopes are used for MCP (Multi-Company Platform) server in Figma.

Looking at the image, I can see:
- The title "新規トークンを作成" (Create New Token)
- A text field with "figma-mcp-2025-04-08" entered
- An expiration period of 90 days, with an expiration date of July 7, 2025
- A list of scopes (permissions) that can be granted, all of which currently show "アクセスなし" (No access):
  - コメント (Comments)
  - 現在のユーザー (Current User)
  - 開発リソース (Development Resources)
  - ファイルのコンテンツ (File Contents)
  - ファイルバージョン (File Versions)
  - ライブラリアセット (Library Assets)
  - ライブラリのコンテンツ (Library Contents)
  - プロジェクト (Projects)
  - チームライブラリのコンテンツ (Team Library Contents)
  - Webフック (Webhooks)

The user is asking which scopes should be used for an MCP server in Figma. However, the image itself doesn't specify which scopes are specifically required for MCP. It just shows all possible scopes that could be selected, all currently set to "No access."

I should respond by explaining that the image doesn't explicitly specify which scopes are required for MCP servers, and I would need to provide general information about Figma API scopes and suggest that they may need to consult Figma's documentation for MCP-specific requirements.

画像からは、Figmaの個人アクセストークン作成画面が表示されていますが、特にMCPサーバー用に必要なスコープは明示されていません。現在表示されているすべてのスコープ（コメント、現在のユーザー、開発リソースなど）は「アクセスなし」に設定されています。

Figma MCPの実装に必要なスコープは、具体的な用途によって異なります。一般的に以下のスコープが使用されることがあります：

- ファイルのコンテンツ：デザインデータへのアクセスに必要
- 開発リソース：コードやアセットの抽出に必要
- ライブラリアセット：共有コンポーネントへのアクセスに必要

具体的なMCP実装の要件については、Figmaの公式ドキュメントを参照するか、プロジェクトの要件に基づいて必要なスコープを選択することをお勧めします。

---
