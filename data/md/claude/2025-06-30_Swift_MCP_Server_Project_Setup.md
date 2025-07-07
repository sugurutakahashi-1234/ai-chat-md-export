# Swift MCP Server Project Setup

日付: 2025-06-30

---

## 👤 ユーザー
*2025/6/30 15:32:26*

https://github.com/modelcontextprotocol/swift-sdk を使ってmcpサーバーを作りたい
新規プロジェクトを作成する際にどうすればいいか？

---

## 🤖 アシスタント
*2025/6/30 15:33:04*

Swift SDKを使って新しいMCPサーバープロジェクトを作成する手順を説明します。
```
This block is not supported on your current device yet.
```

Swift SDKを使ってMCPサーバーの新規プロジェクトを作成する手順は以下の通りです：

## 1. 新規Swiftパッケージプロジェクトの作成

```bash
# プロジェクトディレクトリを作成
mkdir my-mcp-server
cd my-mcp-server

# Swift パッケージを初期化
swift package init --type executable
```

## 2. Package.swiftの編集

`Package.swift`ファイルを開いて、MCP SDKの依存関係を追加します：

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyMCPServer",
    platforms: [
        .macOS(.v13)  // macOS 13.0以上が必要
    ],
    dependencies: [
        .package(url: "https://github.com/modelcontextprotocol/swift-sdk.git", from: "0.7.1")
    ],
    targets: [
        .executableTarget(
            name: "MyMCPServer",
            dependencies: [
                .product(name: "MCP", package: "swift-sdk")
            ]
        ),
    ]
)
```

## 3. メインファイルの作成

`Sources/MyMCPServer/main.swift`を編集：

```swift
import MCP
import Foundation

// サーバーの初期化
let server = Server(
    name: "MyMCPServer",
    version: "1.0.0",
    capabilities: .init(
        prompts: .init(),
        resources: .init(subscribe: true),
        tools: .init()
    )
)

// トランスポートの作成
let transport = StdioTransport()

// ツールハンドラーの登録例
server.withMethodHandler(CallToolRequest.self) { params in
    // ツールの実装
    if params.name == "hello" {
        return .init(content: [.text("Hello from Swift MCP Server!")], isError: false)
    }
    
    return .init(content: [.text("Unknown tool")], isError: true)
}

// リソースハンドラーの登録例
server.withMethodHandler(ReadResourceRequest.self) { params in
    // リソースの実装
    let content = [Resource.Content.text("Example resource content")]
    return .init(contents: content)
}

// サーバーの起動
Task {
    do {
        try await server.start(transport: transport)
        print("MCP Server started successfully", to: &standardError)
        
        // サーバーを実行し続ける
        try await Task.sleep(nanoseconds: .max)
    } catch {
        print("Error: \(error)", to: &standardError)
        exit(1)
    }
}

// 標準エラー出力用
var standardError = FileHandle.standardError

extension FileHandle: TextOutputStream {
    public func write(_ string: String) {
        if let data = string.data(using: .utf8) {
            self.write(data)
        }
    }
}

// RunLoopを実行
RunLoop.main.run()
```

## 4. ビルドと実行

```bash
# 依存関係を解決してビルド
swift build

# 実行
./.build/debug/MyMCPServer
```

## 5. MCPクライアントとの統合

サーバーを実際に使用するには、MCPクライアント（例：Claude Desktop）の設定が必要です。`claude_desktop_config.json`に以下のような設定を追加：

```json
{
  "mcpServers": {
    "my-swift-server": {
      "command": "/path/to/.build/debug/MyMCPServer"
    }
  }
}
```

## 必要な環境

- **Swift 6.0以上**（Xcode 16以上）
- **macOS 13.0以上**（他のプラットフォームでも動作可能）

これで基本的なMCPサーバーの土台ができました。ここから必要に応じてツール、リソース、プロンプトなどの機能を追加していくことができます。

---

## 👤 ユーザー
*2025/6/30 15:33:49*

swift package init --type executable これはどういう意味だろうか？

---

## 🤖 アシスタント
*2025/6/30 15:34:07*

`swift package init --type executable` コマンドについて詳しく説明します。

## コマンドの構成要素

### 1. `swift package`
- SwiftのパッケージマネージャーであるSwift Package Manager (SPM)のコマンド
- パッケージの作成、依存関係の管理、ビルドなどを行うツール

### 2. `init`
- 新しいSwiftパッケージを初期化（作成）するサブコマンド
- 現在のディレクトリに必要なファイルとフォルダ構造を生成

### 3. `--type executable`
- パッケージのタイプを指定するオプション
- `executable`は実行可能なプログラム（コマンドラインツールやサーバーなど）を作成することを意味

## パッケージタイプの種類

```bash
# 実行可能ファイル（デフォルト）
swift package init --type executable

# ライブラリ
swift package init --type library

# タイプを指定しない場合（実行可能ファイルがデフォルト）
swift package init
```

## 生成されるファイル構造

`--type executable`を指定すると、以下のような構造が作成されます：

```
my-mcp-server/
├── Package.swift
├── Sources/
│   └── main.swift      # エントリーポイント（実行可能ファイル用）
└── Tests/
    └── MyMCPServerTests/
        └── MyMCPServerTests.swift
```

もし`--type library`を指定した場合は：

```
my-library/
├── Package.swift
├── Sources/
│   └── MyLibrary/
│       └── MyLibrary.swift    # ライブラリのソースコード
└── Tests/
    └── MyLibraryTests/
        └── MyLibraryTests.swift
```

## 実行可能ファイルとライブラリの違い

### 実行可能ファイル（executable）
- **独立して実行できるプログラム**
- `main.swift`ファイルがエントリーポイント
- コンパイルすると実行バイナリが生成される
- MCPサーバーのような独立したプログラムに適している

### ライブラリ（library）
- **他のプログラムから使用されるコード**
- 単体では実行できない
- 他のパッケージの依存関係として使用される

## MCPサーバーの場合

MCPサーバーは独立して動作するプログラムなので、`--type executable`が適切です。これにより：

1. スタンドアロンで実行可能なサーバープログラムが作成できる
2. `main.swift`にサーバーの起動コードを記述できる
3. ビルド後は`.build/debug/`に実行可能ファイルが生成される

このコマンドを実行すると、MCPサーバー開発に必要な基本的なプロジェクト構造が自動的に用意されます。

---

## 👤 ユーザー
*2025/6/30 15:35:02*

ちなみにサーバーを建てた場合にずっと起動させないといけないのか？

---

## 🤖 アシスタント
*2025/6/30 15:35:27*

MCPサーバーの起動モデルについて説明します。

## MCPサーバーの2つの起動モデル

### 1. **オンデマンド起動（推奨）**
MCPサーバーは通常、**ずっと起動させておく必要はありません**。クライアント（Claude Desktopなど）が必要に応じて自動的に起動・終了します。

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "my-swift-server": {
      "command": "/path/to/.build/debug/MyMCPServer"
    }
  }
}
```

この設定により：
- Claude Desktopを起動すると、MCPサーバーも自動起動
- Claude Desktopを終了すると、MCPサーバーも自動終了
- サーバーはクライアントのライフサイクルに従う

### 2. **常時起動（HTTPトランスポートの場合）**
HTTPトランスポートを使用する場合は、サーバーを常時起動しておく必要があります：

```swift
// HTTPサーバーとして実装する場合
let transport = HTTPServerTransport(port: 8080)
```

## 標準的な使用方法（StdioTransport）

先ほどの例で使用した`StdioTransport`の場合：

```swift
// main.swift の一部
Task {
    do {
        try await server.start(transport: transport)
        // サーバーを実行し続ける
        try await Task.sleep(nanoseconds: .max)
    } catch {
        print("Error: \(error)", to: &standardError)
        exit(1)
    }
}

RunLoop.main.run()
```

このコードは：
1. サーバーを起動
2. クライアントからの接続を待機
3. クライアントが切断したら自動的に終了

## 実際の運用方法

### 開発時
```bash
# テスト実行（手動で起動）
./.build/debug/MyMCPServer

# Ctrl+C で終了
```

### 本番使用時（Claude Desktop経由）
1. サーバーをビルド
2. `claude_desktop_config.json`に設定を追加
3. **手動でサーバーを起動する必要なし**
4. Claude Desktopが必要に応じて自動管理

## メリット

- **リソース効率的**: 使用時のみ起動
- **管理が簡単**: 手動での起動・終了が不要
- **エラー回復**: クラッシュしても次回使用時に自動再起動

## まとめ

MCPサーバーは：
- **常時起動させる必要はない**
- クライアントが自動的に管理
- StdioTransportを使えば、オンデマンドで起動・終了
- systemdやlaunchdなどのサービス化も不要

これにより、開発も運用も簡単になります。

---

## 👤 ユーザー
*2025/6/30 15:36:17*

これはdockerをホストするような使い方は可能か？mcpもdockerバージョンとcliバージョンがある気がする

---

## 🤖 アシスタント
*2025/6/30 15:37:08*

MCPサーバーのDockerでの運用について説明します。
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

はい、MCPサーバーにはDockerで運用する方法があります。MCPの実装には大きく2つのアプローチがあります：

## 1. **通常のMCPサーバー（Stdioトランスポート）**

Swift SDKで作成したような標準的なMCPサーバーで、クライアントが必要に応じて自動起動・終了します：

```swift
// StdioTransportを使用
let transport = StdioTransport()
```

この場合、Dockerは必要ありません。クライアント（Claude Desktopなど）が直接実行ファイルを起動します。

## 2. **HTTPトランスポートを使用したMCPサーバー**

HTTPベースのMCPサーバーとして実装し、Dockerコンテナで常時稼働させることができます：

### Swift SDKでのHTTP実装

```swift
import MCP

// HTTPトランスポートを使用
let transport = HTTPServerTransport(port: 8080)

let server = Server(
    name: "MyMCPServer",
    version: "1.0.0",
    capabilities: .init(
        prompts: .init(),
        resources: .init(subscribe: true),
        tools: .init()
    )
)

// サーバー起動
try await server.start(transport: transport)
```

### Dockerfile例

```dockerfile
# Swift公式イメージを使用
FROM swift:5.9-jammy as builder

WORKDIR /app
COPY . .

# ビルド
RUN swift build -c release

# 実行用の軽量イメージ
FROM swift:5.9-jammy-slim

WORKDIR /app
COPY --from=builder /app/.build/release/MyMCPServer /app/

EXPOSE 8080

CMD ["./MyMCPServer"]
```

### docker-compose.yml例

```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - LOG_LEVEL=info
```

### クライアント設定（HTTPトランスポート）

```json
{
  "mcpServers": {
    "my-swift-server": {
      "uri": "http://localhost:8080"
    }
  }
}
```

## 比較

| 特徴 | Stdioトランスポート | HTTPトランスポート（Docker） |
|-----|-------------------|--------------------------|
| 起動方法 | クライアントが自動起動 | 常時稼働 |
| リソース使用 | 使用時のみ | 常時消費 |
| 管理 | 不要 | Docker管理必要 |
| スケーラビリティ | 単一インスタンス | 複数クライアント対応可能 |
| ネットワーク | ローカルのみ | リモートアクセス可能 |

## 推奨

- **開発・個人利用**: Stdioトランスポート（Dockerなし）
- **チーム共有・本番環境**: HTTPトランスポート + Docker

MCPサーバーのDockerバージョンは、主にHTTPトランスポートを使用してネットワーク経由でアクセス可能にしたい場合に使用されます。

---

## 👤 ユーザー
*2025/6/30 15:39:05*

よくわかってないのがリモートmcpというものもある気がしていて、それにiOSアプリから接続したい場合はどういった接続方法になるのか。

---

## 🤖 アシスタント
*2025/6/30 15:39:36*

リモートMCPとiOSアプリからの接続について説明します。

## リモートMCPの概念

リモートMCPは、ネットワーク経由でアクセス可能なMCPサーバーのことです。主に以下の方法で実現されます：

### 1. **HTTPトランスポート（推奨）**

```swift
// サーバー側（リモートで動作）
let transport = HTTPServerTransport(port: 8080)
```

### 2. **SSE（Server-Sent Events）対応**

HTTPトランスポートは、リアルタイム通信のためにSSEをサポートしています。

## iOSアプリからの接続方法

### クライアント実装例

```swift
import MCP
import Foundation

class MCPClientManager {
    private let client: Client
    
    init() {
        self.client = Client(
            name: "MyiOSApp",
            version: "1.0.0"
        )
    }
    
    func connectToRemoteServer() async throws {
        // HTTPトランスポートでリモートサーバーに接続
        let transport = HTTPClientTransport(
            endpoint: URL(string: "https://your-mcp-server.com:8080")!
        )
        
        // 接続
        try await client.connect(transport: transport)
        
        // 初期化
        let result = try await client.initialize()
        print("Connected to MCP server: \(result)")
    }
    
    // ツールの呼び出し
    func callTool(name: String, arguments: [String: Any]) async throws -> (content: [CallToolResult.Content], isError: Bool) {
        return try await client.callTool(name: name, arguments: arguments)
    }
}
```

## アーキテクチャ例

```
┌─────────────┐     HTTPS/WSS     ┌──────────────┐
│  iOS App    │ ←───────────────→ │ MCP Server   │
│             │                    │ (Docker/Cloud)│
└─────────────┘                    └──────────────┘
     ↓                                    ↓
┌─────────────┐                    ┌──────────────┐
│ Swift SDK   │                    │ Resources    │
│ HTTPClient  │                    │ Tools        │
└─────────────┘                    └──────────────┘
```

## セキュリティ考慮事項

### 1. **認証の実装**

```swift
// カスタムトランスポートで認証を追加
class AuthenticatedHTTPTransport: HTTPClientTransport {
    private let apiKey: String
    
    init(endpoint: URL, apiKey: String) {
        self.apiKey = apiKey
        super.init(endpoint: endpoint)
    }
    
    override func makeRequest() -> URLRequest {
        var request = super.makeRequest()
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        return request
    }
}
```

### 2. **TLS/SSL必須**

```swift
// HTTPSエンドポイントを使用
let transport = HTTPClientTransport(
    endpoint: URL(string: "https://your-secure-server.com:443")!
)
```

## 実装パターン

### パターン1: 直接接続

```swift
// iOSアプリ → MCPサーバー
let transport = HTTPClientTransport(
    endpoint: URL(string: "https://mcp.example.com")!
)
```

### パターン2: APIゲートウェイ経由

```swift
// iOSアプリ → APIゲートウェイ → MCPサーバー
let transport = HTTPClientTransport(
    endpoint: URL(string: "https://api.example.com/mcp")!
)
```

## サーバー側の設定例

```swift
// main.swift (サーバー側)
import MCP
import Foundation

let server = Server(
    name: "RemoteMCPServer",
    version: "1.0.0",
    capabilities: .init(
        prompts: .init(),
        resources: .init(subscribe: true),
        tools: .init()
    )
)

// HTTPトランスポートで起動
let transport = HTTPServerTransport(
    port: 8080,
    // CORS設定（必要に応じて）
    corsOrigins: ["https://your-ios-app.com"]
)

// ハンドラー登録
server.withMethodHandler(CallToolRequest.self) { params in
    // ツール実装
    return .init(content: [.text("Response")], isError: false)
}

// サーバー起動
try await server.start(transport: transport)
```

## 注意点

1. **ネットワーク管理**: iOSアプリではネットワーク状態の監視が重要
2. **バックグラウンド処理**: iOS特有の制限を考慮
3. **認証・認可**: セキュアな通信の実装
4. **エラーハンドリング**: ネットワーク切断への対応

リモートMCPは基本的にHTTPトランスポートを使用し、iOSアプリからは通常のHTTP/HTTPSクライアントとして接続します。

---
