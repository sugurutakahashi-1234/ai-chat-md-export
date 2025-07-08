# Latest YouTube Features and Updates for 2025

日付: 2025-05-10

---

## 👤 ユーザー
*2025/05/10 18:32:26*

YouTubeについて調べて欲しい

---

## 🤖 アシスタント
*2025/05/10 18:32:36*

YouTubeについて調べますね。YouTubeに関する情報を収集するために、まずウェブ検索を使ってみましょう。
*[ツール使用: 対応していないブロック]*



それでは、検索結果からYouTubeの最新情報についてまとめました。

## YouTubeの2025年の主な新機能と更新点

### コンテンツ作成機能
YouTubeはクリエイターがより良い動画を作成し、ファンと繋がるための新機能を発表しました。Dream Screenにはより現実的な背景と動画クリップを提供する「Veo」が導入され、「Inspiration Tab」はクリエイターに新しい

---

## 👤 ユーザー
*2025/05/10 18:32:57*

ComposioのMCPを使ってYouTubeでなにができそう？

---

## 🤖 アシスタント
*2025/05/10 18:33:43*

ComposioのMCPを使ってYouTubeでできることについて調べてみましょう。まず、ComposioとMCPについての情報を探します。
*[ツール使用: 対応していないブロック]*



YouTubeの機能に関する情報が見つからなかったので、ComposioのMCPとYouTubeの連携について具体的に検索してみましょう。
*[ツール使用: 対応していないブロック]*



YouTubeとComposio MCPの直接的な連携に関する情報が見つからなかったので、もう少し具体的に検索してみましょう。
*[ツール使用: 対応していないブロック]*



検索結果から、ComposioのMCPとYouTubeの直接的な連携に関する具体的な情報は見つかりませんでした。しかし、Composioが提供する250以上のツールの中にYouTube APIが含まれている可能性はあります。さらに具体的に検索してみましょう。
*[ツール使用: 対応していないブロック]*



大変朗報です！検索結果で、ZubeidHendricksが開発したYouTube MCP Serverというプロジェクトを見つけました。これはYouTube APIのためのModel Context Protocol（MCP）サーバー実装で、AIがYouTubeコンテンツと標準化されたインターフェースを通じて対話できるようにするものです。
*[ツール使用: 対応していないブロック]*



検索をもう一度行い、ZubeidHendricksのYouTube MCP Serverの具体的な機能を詳しく調べてみましょう。
*[ツール使用: 対応していないブロック]*



検索結果に基づき、ComposioのMCPを使ってYouTubeでできることについてまとめました。

## ComposioのMCPを使ってYouTubeでできること

ComposioのModel Context Protocol（MCP）を使うと、AIを通じてYouTube APIと連携できます。具体的には：

1. **ZubeidHendricksのYouTube MCP Server**：
   - 動画の詳細情報（タイトル、説明、再生時間など）の取得
   - 動画のトランスクリプト（字幕）の取得
   - キーワードによる動画検索
   - チャンネル情報の取得
   - チャンネルの動画リスト取得
   - プレイリスト詳細・アイテムの取得
   - 動画管理、Shorts作成、高度な分析が可能

2. **YouTube API連携の利点**：
   - AIからYouTubeへのシームレスなアクセス
   - 自然言語でYouTube操作が可能
   - 複雑なAPIコールを抽象化

3. **設定方法**：
   - YouTube API Keyを取得する必要あり
   - MCPクライアント（Claude、Cursor、Windsurf等）に設定を追加
   - 例：`npx @composio/mcp@latest setup "https://mcp.composio.dev/youtube/XXX" --client cursor`

4. **他の選択肢**：
   - anaisbetts/mcp-youtube
   - instructa/mcp-youtube-music（音楽検索・再生に特化）
   - Apifyの「Youtube Search Api MCP server」

MCPはAIがYouTubeを含む様々なアプリとシームレスに連携するための標準プロトコルです。YouTube APIが提供する機能（動画アップロード、プレイリスト管理など）に、AI経由でアクセスできるようになります。

---

## 👤 ユーザー
*2025/05/10 18:34:06*

YOUTUBE_LIST_CAPTIONとかMCP連携しているはずなんだけど

---

## 🤖 アシスタント
*2025/05/10 18:34:22*

ご指摘ありがとうございます。確かに、`YOUTUBE_LIST_CAPTION_TRACK`という関数が存在しているようですね。検索結果にはこの特定の関数について詳細な情報が含まれていませんでした。このYouTubeキャプション関連の機能について詳しく調べてみましょう。
*[ツール使用: 対応していないブロック]*



確かに、ご指摘の通り`YOUTUBE_LIST_CAPTION_TRACK`機能が存在しています。検索結果から、YouTube動画のキャプション（字幕）に関連するMCP機能について多くの情報が見つかりました。

## YouTubeキャプション関連のMCP機能について

`YOUTUBE_LIST_CAPTION_TRACK`は、YouTube動画のキャプション（字幕）トラックをリスト表示する機能です。これは、Model Context Protocol（MCP）を通じてYouTube Data APIと連携し、以下のような機能を提供します：

1. **キャプション取得機能**：
   - 特定の動画IDに関連付けられたキャプショントラックのリストを取得
   - 異なる言語のキャプションを取得可能
   - 自動生成されたキャプションや手動で追加されたキャプションの取得
   - 特定のキャプショントラックをダウンロード

2. **特化したMCPサーバー実装**：
   - nattyrazの「youtube-mcp」：動画メタデータ、キャプション抽出、マークダウン変換機能
   - kimtaeyoon83の「mcp-server-youtube-transcript」：字幕直接ダウンロード専用サーバー
   - ApifyのYouTube字幕スクレイパーMCPサーバー

3. **応用例**：
   - コンテンツ分析
   - テキスト検索（特定の動画内で言及されたキーワードの検索）
   - 複数言語での字幕取得
   - トランスクリプトのマークダウン形式への変換

これらの機能を使用するには、YouTube API Keyが必要で、使用にはYouTubeのAPI利用規約に従う必要があります。

適切なMCPサーバーを設定すれば、AIからの自然言語指示を通じて、YouTube動画のキャプションを取得・分析することが可能になります。

---

## 👤 ユーザー
*2025/05/10 18:34:39*

https://www.youtube.com/watch?v=MhllIM-P_vsをYOUTUBE_LIST_CAPTION_TRACKやってほしい

---

## 🤖 アシスタント
*2025/05/10 18:34:56*

YouTubeの動画キャプションを取得するリクエストを理解しました。

`YOUTUBE_LIST_CAPTION_TRACK`関数を使って、指定された動画（https://www.youtube.com/watch?v=MhllIM-P_vs）のキャプショントラックを取得してみましょう。
*[ツール使用: 対応していないブロック]*



申し訳ありませんが、YouTubeとの接続がまだ確立されていないようです。エラーメッセージによると「YouTubeアプリへの接続が見つかりません」とあります。

このエラーを解決するためには、まずYouTubeアカウントとの接続認証が必要です。以下の方法を試すことができます：

1. **認証設定の確認**：
   - YouTubeアプリへの接続設定が必要です
   - YouTube API Keyが設定されている必要があります

2. **別の方法を試す**：
   - MCP（Model Context Protocol）を使った方法として、ComposioのYouTube MCPサーバーを使用する選択肢があります
   - 以下のようなコマンドを使用します：
     ```
     npx @composio/mcp@latest setup "https://mcp.composio.dev/youtube/YOUR_TOKEN" --client cursor
     ```

YouTube動画の字幕を取得したい場合は、次のような方法も検討できます：

1. YouTube字幕専用のMCPサーバーの使用
2. 既存のYouTube API KeyでのYouTube Data APIへの直接アクセス

もし今後このようなYouTube関連の機能を使いたい場合は、まず適切な認証設定をする必要があります。YouTubeとの接続を設定したい場合、お手伝いできますのでお知らせください。

---
