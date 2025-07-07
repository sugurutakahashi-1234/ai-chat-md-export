# SPMでSwiftFormat追加方法

日付: 2024-10-24

---

## 👤 ユーザー
*2024/10/24 19:09:39*

SPMでnicklockwood/SwiftFormat@0.54.6

---

## 🤖 アシスタント
*2024/10/24 19:09:43*

`nicklockwood/SwiftFormat`をバージョン`0.54.6`としてSwift Package Manager（SPM）でプロジェクトに追加するには、`Package.swift`ファイルに以下のように依存関係を追加します。

```swift
// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "YourProjectName",
    platforms: [
        .iOS(.v13), // 対応するプラットフォームとバージョンを指定
    ],
    dependencies: [
        .package(url: "https://github.com/nicklockwood/SwiftFormat", from: "0.54.6"),
    ],
    targets: [
        .target(
            name: "YourTargetName",
            dependencies: [
                .product(name: "SwiftFormat", package: "SwiftFormat")
            ]
        ),
    ]
)
```

このように設定することで、SPMを通じて`SwiftFormat`をプロジェクトに導入できます。

---
