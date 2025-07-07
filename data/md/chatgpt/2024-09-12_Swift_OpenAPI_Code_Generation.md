# Swift OpenAPI Code Generation

日付: 2024-09-12

---

## 👤 ユーザー
*2024/9/12 17:35:00*

swift-openapi-generator で openapi形式のjsonを使ってコード生成する方法

---

## 🤖 アシスタント
*2024/9/12 17:35:33*

`swift-openapi-generator` を使用して OpenAPI 形式の JSON から Swift コードを生成する手順は以下の通りです。

### 1. 前提条件
- macOS 上で `swift-openapi-generator` をインストールしている必要があります。
- OpenAPI 仕様を記述した `openapi.json` ファイルが準備されている必要があります。

### 2. `swift-openapi-generator` のインストール

`swift-openapi-generator` を SwiftPM のプラグインとして利用するには、`Package.swift` に依存関係を追加します。

```swift
// swift-tools-version: 5.7

import PackageDescription

let package = Package(
    name: "MyOpenAPIClient",
    platforms: [.iOS(.v13), .macOS(.v11)],
    dependencies: [
        // swift-openapi-generator を依存関係に追加
        .package(url: "https://github.com/apple/swift-openapi-generator", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "MyOpenAPIClient",
            dependencies: [],
            plugins: [
                // コード生成プラグインを設定
                .plugin(name: "OpenAPIGeneratorPlugin", package: "swift-openapi-generator")
            ]
        )
    ]
)
```

### 3. コード生成の実行

OpenAPI 仕様に基づいて Swift クライアントコードを生成するには、ターミナルで次のコマンドを実行します。

```bash
swift package generate-openapi --input ./path/to/openapi.json --output ./Sources/MyOpenAPIClient
```

- `--input` オプションで OpenAPI 形式の `openapi.json` ファイルのパスを指定します。
- `--output` オプションで生成された Swift ファイルの出力先を指定します。

### 4. 使用方法

生成されたコードは、OpenAPI のエンドポイントに対応する Swift クライアントとして利用できます。生成されたクライアントコードを使って、API リクエストを実行できます。

```swift
import MyOpenAPIClient

let client = APIClient(baseURL: URL(string: "https://api.example.com")!)

Task {
    do {
        let response = try await client.getSomeResource()
        print(response)
    } catch {
        print("Error: \(error)")
    }
}
```

### 5. 追加オプション

- `--strict`: OpenAPI スキーマに対してより厳格な検証を行うオプションです。
- `--loglevel`: ログレベルを指定して、生成時の出力内容を制御できます。 (`error`, `warn`, `info`, `debug` など)

これで、OpenAPI 形式の JSON から Swift クライアントコードを生成する手順は完了です。

---
