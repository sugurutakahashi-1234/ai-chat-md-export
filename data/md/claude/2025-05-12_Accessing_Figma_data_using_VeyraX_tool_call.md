# Accessing Figma data using VeyraX tool_call

日付: 2025-05-12

---

## 👤 ユーザー
*2025/5/12 14:39:07*

VeyraXでは以下のような導入を進められているが、そもそもVeyraX

npx @veyrax/mcp-cli install figmaapi-4c499d99-a297 vrx-1efbff4094f9d8d402bb151eab4844276daa4486 --client claude

---

## 👤 ユーザー
*2025/5/12 14:33:00*

VeyraXのtool\_callでFigmaを参照して欲しい

---

## 🤖 アシスタント
*2025/5/12 14:33:14*

Figmaを参照するためにVeyraXのtool_callを使いたいということですね。まず、どのようなツールが利用可能か確認してみましょう。
```
This block is not supported on your current device yet.
```



Figmaのツールが利用可能なことが確認できました。ではFigmaのデータを取得するために、tool_callを使用してみましょう。

Figmaファイルを参照するためには、まずファイルキーが必要です。Figmaのファイルキーをお持ちでしたら教えていただけますか？通常、Figmaのリンクは `https://www.figma.com/file/XXXXX/...` のような形式になっており、XXXXXの部分がファイルキーです。

もしファイルキーをお持ちでしたら、以下のような形でFigmaデータを取得できます：

1. ファイルの全体情報を取得: figma_get_file
2. 特定のノード情報を取得: figma_get_file_nodes
3. 画像としてレンダリング: figma_get_images
4. コメントを取得: figma_get_comments

また、特定の要素（コンポーネント、スタイルなど）に関する情報も取得できます。

ご希望の操作内容を教えていただければ、適切なtool_callを実行できます。

---

## 👤 ユーザー
*2025/5/12 14:33:39*

figma\_get\_images

---

## 🤖 アシスタント
*2025/5/12 14:33:56*

Figmaのイメージを取得するために、`figma\_get\_images`メソッドを使用したいですね。このメソッドを使用するには、ファイルキー(fileKey)とノードID(ids)の両方が必要です。

FigmaファイルのファイルキーとノードIDを教えていただけますか？

ファイルキーは通常、Figma URLの一部で次のような形式です:
`https://www.figma.com/file/XXXXX/...` (XXXXXの部分がファイルキー)

ノードIDは特定の要素を指定するためのもので、カンマ区切りのリストとして指定します。通常、ノードIDは元のFigmaファイル内で選択した要素のプロパティパネルで確認できるか、Figma APIを使用している場合は`figma\_get\_file`などで事前に取得することができます。

これらの情報をお持ちでしたら、`tool\_call`を使って`figma\_get\_images`を実行できます。また、画像のスケールや形式（jpg、png、svg、pdf）なども指定できます。

---

## 👤 ユーザー
*2025/5/12 14:34:36*

https://www.figma.com/design/9Y1kGRlyladEXqqXI01cCy/mcp-test?node-id=2005-2&t=V3j4x8UcOGLhzv46-4

---

## 🤖 アシスタント
*2025/5/12 14:35:06*

ありがとうございます。提供いただいたFigmaのURLからファイルキーとノードIDを抽出できました。

ファイルキー: `9Y1kGRlyladEXqqXI01cCy`
ノードID: `2005-2`

これらの情報を使って、Figmaから指定されたノードの画像を取得してみましょう。
```
This block is not supported on your current device yet.
```



申し訳ありません。ツールの呼び出し方に問題があったようです。VeyraXでFigmaツールを使用するための正しい形式で再度試してみましょう。
```
This block is not supported on your current device yet.
```



Figmaデータの取得に成功しました。以下が取得したデータの詳細です：

### ファイル情報
- **ファイル名**: mcp-test
- **最終更新日**: 2025年5月9日
- **サムネイルURL**: 提供されています

### ノード情報 (ID: 2005-2)
- **名前**: iPhone 16 - 1
- **タイプ**: FRAME (フレーム)
- **塗りつぶし**: #FFFFFF (白色)
- **レイアウトモード**: none

### 子要素
- **名前**: Rectangle 1 (ID: 2005:3)
- **タイプ**: RECTANGLE (長方形)
- **塗りつぶし**: #D9D9D9 (グレー)

このフレームは「iPhone 16 - 1」という名前で、中に「Rectangle 1」という灰色の長方形が含まれているシンプルなデザインです。

このノードの画像をダウンロードして表示したい場合は、`download_figma_images`ツールを使用できます。試してみましょうか？また、他に取得したい特定のノードやデータはありますか？

---

## 👤 ユーザー
*2025/5/12 14:35:16*

download\_figma\_images

---

## 🤖 アシスタント
*2025/5/12 14:35:29*

`download_figma_images`ツールを使って、先ほど取得したFigmaデザインの画像をダウンロードしてみましょう。このツールを使用するには、fileKey、ノードID、保存先のローカルパスが必要です。
```
This block is not supported on your current device yet.
```



素晴らしいです！Figmaの画像のダウンロードに成功しました。

### ダウンロード結果
- **ステータス**: 成功
- **ダウンロードされた画像**: 1枚
- **保存場所**: `/tmp/figma_images/iphone16_frame.png`

「iPhone 16 - 1」フレーム（ノードID: 2005:2）の画像が、指定したディレクトリ `/tmp/figma_images` に「iphone16_frame.png」という名前で保存されました。

このファイルはシステムの一時ディレクトリに保存されているため、必要に応じて他の場所に移動するか、直接アクセスすることができます。

他にもダウンロードしたいノード（例えば先ほど確認した「Rectangle 1」（ノードID: 2005:3）など）や、別の形式（SVGなど）でダウンロードしたいですか？あるいは、他のFigmaファイルやノードについて探索したい内容はありますか？

---

## 👤 ユーザー
*2025/5/12 14:36:22*

出力先は/Users/sugurutakahashi/Desktop/work/aiにしてほしい

---

## 🤖 アシスタント
*2025/5/12 14:36:37*

了解しました。指定された出力先に画像をダウンロードし直します。
```
This block is not supported on your current device yet.
```



素晴らしいです！指定された新しい出力先へのダウンロードが成功しました。

### ダウンロード結果
- **ステータス**: 成功
- **ダウンロードされた画像**: 1枚
- **保存場所**: `/Users/sugurutakahashi/Desktop/work/ai/iphone16_frame.png`

「iPhone 16 - 1」フレーム（ノードID: 2005:2）の画像が、指定したディレクトリ `/Users/sugurutakahashi/Desktop/work/ai` に「iphone16_frame.png」という名前で保存されました。

これで、デスクトップの作業ディレクトリから直接アクセスできるようになりました。他にダウンロードしたいノードや、別の形式で保存したい画像などはありますか？

---

## 👤 ユーザー
*2025/5/12 14:37:25*

tool\_call でできることの一覧を教えて欲しい

---

## 🤖 アシスタント
*2025/5/12 14:38:28*

VeyraXの`tool_call`を使用してできることの一覧を取得しましょう。利用可能なツールの一覧を確認するために`get_tools`を使用します。
```
This block is not supported on your current device yet.
```



現在、利用可能なツールが限られているようです。今のところ、主に以下のツールが使えることがわかりました：

### 現在利用可能なツール
1. **veyrax-auth**
   - `generate_connection_link`: ツールへの接続リンクを生成
   - `get_tools_connection_status`: ツール接続状態を確認

### 接続ツールの確認
ツール接続状態を確認してみましょう：
```
This block is not supported on your current device yet.
```



VeyraXの`tool_call`でできることの一覧を調査した結果、多くの統合ツールが利用可能ですが、現在はどのツールも接続されていない状態です。

### 利用可能なツールカテゴリー
以下のような多様なツールに接続できる可能性があります：

#### 一般的なツール (抜粋)
1. **コラボレーション/ドキュメント管理**
   - Google Drive, Google Docs, Google Sheets
   - Notion, Confluence, Airtable
   - Dropbox, Coda

2. **開発ツール**
   - GitHub, Figma, Vercel
   - Supabase, Replicate, Postman
   - PostgreSQL, Sentry

3. **コミュニケーション**
   - Slack, WhatsApp, Mail
   - Discord (MCP経由)

4. **タスク管理**
   - Asana, Trello, Linear, Jira, Todoist

5. **検索/データツール**
   - Google Maps, Tavily, Perplexity, DuckDuckGo
   - Brave, Exa, Browser-use

6. **SNS/メディア**
   - YouTube, X(Twitter), Instagram, LinkedIn, Reddit

#### MCPサーバー (Model Context Protocol)
Figmaに関しては、`figma-api-mcp-server`も利用可能ですが、現在接続されていません。

### Figma接続について
すでにClaudeの内蔵ツール`get_figma_data`と`download_figma_images`を使って正常にFigmaデータを取得できています。これは、VeyraXのツールとは別の仕組みで提供されているものです。

VeyraXでFigmaを使いたい場合は、まず接続設定が必要です。以下のように接続リンクを生成できます：
```
This block is not supported on your current device yet.
```



### まとめ：`tool_call`でできること

1. **認証/ツール管理**
   - ツール接続状態の確認 (`get_tools_connection_status`)
   - 新しいツール接続リンクの生成 (`generate_connection_link`)

2. **ツールを使ったタスク**
   - 70以上のさまざまなツール接続が可能
   - 接続後にそれぞれのツールの機能を利用できる
   
3. **Figma関連**
   - Claudeの内蔵ツールとして：
     - `get_figma_data`: Figmaデータの取得
     - `download_figma_images`: Figma画像のダウンロード
   - VeyraX経由：
     - `figma-api-mcp-server`: 接続後に使用可能（現在未接続）

### Figmaへの接続
上記の接続リンク（`https://www.veyrax.com/user/figma/auth?code=...`）にアクセスすることで、VeyraXの統合システムを通じてFigmaに接続できます。接続後、より多くのFigma API機能が利用可能になるでしょう。

現在の設定でも、`get_figma_data`と`download_figma_images`のツールを使用して基本的なFigmaデータの取得と画像のダウンロードは問題なく行えています。

---

## 🤖 アシスタント
*2025/5/12 14:39:29*

画像から、Figma API MCP (Model Context Protocol) の設定ページを確認できました。このページでは、Figma APIを使用するためのMCPサーバーの設定方法が紹介されています。

このFigma API MCPは以下の特徴があります：
- GitHub: `thirdstrandstudio/mcp-figma`
- スター数: 24
- ライセンス: MIT
- 公開: 約2ヶ月前

このMCPサーバーは、Figma APIを通じてファイル、コンポーネント、コメントなど、Figmaのリソースへのアクセスを提供しています。

### MCPのインストール方法

画面には、Claudeクライアント用のインストールコマンドが表示されています：

```bash
npx @veyrax/mcp-cli install figmaapi-4c499d99-a297 vrx-1efbff4094f9d8d402bb151eab4844276daa4486 --client claude
```

このコマンドを実行することで、FigmaのMCPをClaudeクライアントにインストールできます。

### 利用可能なツール

画面には、Figma APIの利用可能なツールがいくつか表示されています：
1. `figma_get_me` - 現在のユーザー情報を取得
2. `figma_get_file` - キーでFigmaファイルを取得
3. `figma_get_file_nodes` - Figmaファイルから特定のノードを取得
4. `figma_get_images` - Figmaファイルから画像をレンダリング
5. `figma_get_image_fills` - Figmaファイル内の画像塗りつぶしを取得
6. `figma_get_file_versions` - Figmaファイルのバージョン履歴を取得

他にも、合計31のツールが利用可能とのことです。

### 導入方法

このFigma API MCPを使用するには、次の2つの方法があります：

1. **VeyraXプラットフォーム経由**：
   - 前回の会話で見たように、VeyraXの認証ツールを使用して接続する方法

2. **直接インストール**：
   - 表示されているコマンドを使って、直接MCPをインストールする方法
   - これにより、Claudeクライアントから直接Figma APIにアクセスできます

この設定を行うと、すでに使用した`get_figma_data`や`download_figma_images`に加えて、より多くのFigma API機能にアクセスできるようになります。

導入を進めるか、またはすでに使用できているツールで続けるかは、必要な機能によります。現在の機能で十分であれば、追加の設定は不要かもしれません。

---

## 👤 ユーザー
*2025/5/12 14:43:00*

今Figmaのmcpサーバーの利用として、3つの呼び方の選択肢がある。

1 直接FigmaのMCPをコールする
2 veyrax の MCP 全体の中から Figma のMCPを選んでコールする
3 veyrax で登録したFigmaのMCPをコールする

これらはどれを使うべきか、それぞれ使ったほうがいいシチュエーションはどうなのかを検討して欲しい

設定は以下の通りである

"Framelink Figma MCP": {       "command": "npx",       "args": \[         "-y",         "figma-developer-mcp",         "--figma-api-key=figd\_zwaPN5Uozjg9XxrJMXCRmOdkXbZ7OoHawuBhXxV4",         "--stdio"       \]     },

 "veyrax-mcp": {       "command": "npx",       "args": \[         "-y",         "@smithery/cli@latest",         "run",         "@VeyraX/veyrax-mcp",         "--key",         "4717771e-3f9a-4810-8677-3de61ed626b4",         "--config",         "\\"{\\\\\\"VEYRAX\_API\_KEY\\\\\\":\\\\\\"vrx-1efbff4094f9d8d402bb151eab4844276daa4486\\\\\\"}\\""       \]     },     "veyrax-figmaapi": {       "command": "npx",       "args": \[         "-y",         "@veyrax/mcp-cli",         "deploy",         "--sse",         "https://figmaapi-4c499d99-a297.mcp.veyraxapp.com/sse",         "--header",         "VEYRAX\_API\_KEY:vrx-1efbff4094f9d8d402bb151eab4844276daa4486"       \]     }

---

## 🤖 アシスタント
*2025/5/12 14:43:23*

# Figma MCPサーバー利用方法の比較と選択指針

3つのFigma MCPサーバー呼び出し方法について、それぞれの特徴と最適な使用シナリオを検討します。

## 1. 直接FigmaのMCPをコールする（Framelink Figma MCP）

**設定**:
```json
{
  "command": "npx",
  "args": [
    "-y",
    "figma-developer-mcp",
    "--figma-api-key=figd_zwaPN5Uozjg9XxrJMXCRmOdkXbZ7OoHawuBhXxV4",
    "--stdio"
  ]
}
```

**特徴**:
- Figma API専用のMCPサーバー
- 直接Figma API キーを使用
- 依存関係が少なく、シンプルな構成
- 外部サービス（VeyraX）に依存しない

**最適な使用シナリオ**:
- Figmaのみを使用し、他のサービスとの統合が不要な場合
- ローカル環境やセキュアな環境での利用
- Figma APIへの直接アクセスを必要とする開発プロジェクト
- レイテンシが最小限であることが重要な場合
- 外部サービスへの依存を避けたい場合

## 2. VeyraX MCP全体からFigmaのMCPを選んでコールする（veyrax-mcp）

**設定**:
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@smithery/cli@latest",
    "run",
    "@VeyraX/veyrax-mcp",
    "--key",
    "4717771e-3f9a-4810-8677-3de61ed626b4",
    "--config",
    "\"{\\\"VEYRAX_API_KEY\\\":\\\"vrx-1efbff4094f9d8d402bb151eab4844276daa4486\\\"}\""
  ]
}
```

**特徴**:
- VeyraXのMCPエコシステム全体にアクセス可能
- 多様なサービスを1つのインターフェースで管理
- VeyraXのAPI経由で認証と管理が行われる
- 複数のサービスを横断して利用できる

**最適な使用シナリオ**:
- Figma以外の複数のサービスも使用する予定がある場合
- 統一されたインターフェースでさまざまなサービスを管理したい場合
- サービス間のデータ連携や統合が必要な場合
- VeyraXプラットフォームのその他機能（認証管理、ツール連携など）も活用したい場合
- 将来的に使用するサービスの拡張を予定している場合

## 3. VeyraXで登録したFigmaのMCPをコールする（veyrax-figmaapi）

**設定**:
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@veyrax/mcp-cli",
    "deploy",
    "--sse",
    "https://figmaapi-4c499d99-a297.mcp.veyraxapp.com/sse",
    "--header",
    "VEYRAX_API_KEY:vrx-1efbff4094f9d8d402bb151eab4844276daa4486"
  ]
}
```

**特徴**:
- VeyraX上に登録済みのFigma専用MCPを直接呼び出す
- VeyraXの認証基盤を利用しながらFigma専用の機能を最大限活用
- VeyraXプラットフォームのセキュリティや管理機能を享受しつつFigmaに特化
- ホスティングされたMCPサーバーを利用（自己ホスティングの必要なし）

**最適な使用シナリオ**:
- FigmaとVeyraXプラットフォームの両方のメリットを活かしたい場合
- 管理されたホスティング環境でFigma APIを利用したい場合
- 特定のFigmaプロジェクトに特化した認証と設定を使いたい場合
- チーム内で特定のFigma設定を共有して使用する場合
- VeyraXの認証システムを活用しつつFigmaに特化したい場合

## 推奨選択指針

以下のフローチャートに従って最適な選択を行うことをお勧めします：

1. **Figmaのみを使用し、外部依存を最小限にしたいか？**
   - はい → **直接FigmaのMCPをコール**（Framelink Figma MCP）

2. **複数のサービスを統合的に管理したいか？**
   - はい → **VeyraX MCP全体を使用**（veyrax-mcp）

3. **VeyraXのプラットフォーム機能を活用しつつ、Figmaに特化した機能が必要か？**
   - はい → **VeyraXで登録したFigmaのMCPをコール**（veyrax-figmaapi）

4. **パフォーマンスとレイテンシが最重要か？**
   - はい → **直接FigmaのMCPをコール**（Framelink Figma MCP）

5. **スケーラビリティと将来的な拡張性が重要か？**
   - はい → **VeyraX MCP全体を使用**（veyrax-mcp）

6. **複数人で統一された環境でFigmaを利用する必要があるか？**
   - はい → **VeyraXで登録したFigmaのMCPをコール**（veyrax-figmaapi）

## 結論

- **シンプルさと直接性** → **Framelink Figma MCP**
- **多様な統合と拡張性** → **veyrax-mcp**
- **Figma特化+VeyraXの管理機能** → **veyrax-figmaapi**

これらの選択肢の中から、プロジェクトの要件や将来的な拡張計画に基づいて最適なものを選択することをお勧めします。複数のサービスを使う予定がない場合は直接Figma MCPを使用し、より広範なエコシステムを活用したい場合はVeyraXを介した方法を検討するとよいでしょう。

---

## 👤 ユーザー
*2025/5/12 14:44:02*

最初に使うべきはどれか？

---

## 🤖 アシスタント
*2025/5/12 14:44:22*

# 最初に使うべきFigma MCPサーバーの選択

初めて使用する場合、**「1. 直接FigmaのMCPをコールする（Framelink Figma MCP）」**が最適です。

## 理由：

1. **シンプルさと直接性**
   - 余計な依存関係や複雑さがなく、直感的に利用できます
   - Figma APIのみに集中でき、学習曲線が緩やかです

2. **トラブルシューティングの容易さ**
   - 直接Figma APIとやり取りするため、問題が発生した場合の原因特定が容易です
   - 中間レイヤーがないため、エラーメッセージがより明確になります

3. **セットアップの簡便さ**
   - 設定がシンプルで、Figma API キーのみで動作します
   - 追加のサービス登録や連携設定が必要ありません

4. **パフォーマンス**
   - 中間サービスを介さないため、レスポンス時間が短くなる可能性が高いです

5. **基本的な理解の構築**
   - FigmaのAPIと直接やり取りすることで、基本的な仕組みを理解できます
   - 後々他の方法に移行する場合でも、この知識が役立ちます

## 設定方法：

```json
{
  "command": "npx",
  "args": [
    "-y",
    "figma-developer-mcp",
    "--figma-api-key=figd_zwaPN5Uozjg9XxrJMXCRmOdkXbZ7OoHawuBhXxV4",
    "--stdio"
  ]
}
```

この方法で基本的な使い方を理解した後、必要に応じて他の方法（VeyraXを介した方法）に拡張していくことが効率的です。特に追加のサービス統合や複雑な機能が必要になった時点で、選択肢2または3に移行することを検討すると良いでしょう。

---
