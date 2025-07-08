# Swift OpenAPI Gen CLI

日付: 2024-05-31

---

## 👤 ユーザー
*2024/05/31 15:09:00*

Swift_Open_API_Gen_CLI_PACKAGE を大文字に

---

## 🤖 アシスタント
*2024/05/31 15:09:07*

以下は、Swift OpenAPI Generator CLI パッケージを大文字に変換したコード例です。

```swift
// Swift OpenAPI Generator CLI パッケージの設定ファイル
import PackageDescription

let package = Package(
    name: "SWIFT_OPEN_API_GEN_CLI_PACKAGE",
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator", from: "0.0.1"),
    ],
    targets: [
        .executableTarget(
            name: "SWIFT_OPEN_API_GEN_CLI_PACKAGE",
            dependencies: [
                .product(name: "SwiftOpenAPIGenerator", package: "swift-openapi-generator")
            ]
        ),
    ]
)
```

パッケージ名とターゲット名を大文字に変更しました。パッケージの設定ファイルである `Package.swift` に上記のように設定してください。

---
