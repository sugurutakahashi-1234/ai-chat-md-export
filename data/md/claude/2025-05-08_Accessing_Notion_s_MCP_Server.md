# Accessing Notion's MCP Server

Date: 2025-05-08

---

## 👤 User
*2025-05-08 18:03:47*

Notion の mcpサーバーにアクセスできる？

---

## 🤖 Assistant
*2025-05-08 18:03:51*

申し訳ありませんが、Notionのmcpサーバーに直接アクセスすることはできません。私はNotionのデータベースやサーバーに直接接続する機能を持っていません。

もし特定のNotionページやデータベースの情報が必要でしたら、そのコンテンツを共有していただくか、質問の内容をもう少し詳しく教えていただけると、お手伝いできるかもしれません。

あるいは、「mcp」が別の意味（例：Minecraft Serverなど）を指しているのであれば、もう少し詳細を教えていただけると助かります。

---

## 👤 User
*2025-05-08 18:04:04*

この設定は間違っているのか？

{
  "mcpServers": {
    "notionApi": {
      "command": "/Users/sugurutakahashi/.local/state/fnm_multishells/16514_1746694346445/bin/npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer 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\", \"Notion-Version\": \"2022-06-28\" }"
      }
    }
  }
}

---

## 🤖 Assistant
*2025-05-08 18:04:16*

この設定を見る限り、Notionの内部APIサーバー（MCP: Model-Controller-Presenter）にアクセスしようとしているようです。設定自体の構文は正しいように見えますが、いくつか気になる点があります：

1. Bearerトークン（`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`）が設定に直接記載されています。これは通常、セキュリティ上の観点から避けるべきです。

2. `@notionhq/notion-mcp-server` というパッケージは公式のNotionパッケージではないように思われます。Notion公式のAPIパッケージは `@notionhq/client` です。

3. 「2022-06-28」というAPIバージョンは古い可能性があります。

この設定が正しいかどうかは、あなたが何を達成しようとしているのかによります。もし公式のNotionの統合を開発しようとしているなら、Notionの公式APIドキュメントに沿って実装するのがベストでしょう。

この設定は独自のサーバープロキシセットアップのように見えますが、これが正確にあなたのユースケースに合っているかを確認することをお勧めします。また、APIキーを設定ファイルに直接記載するのではなく、環境変数などを使用してセキュアに管理することも検討された方が良いでしょう。

---
