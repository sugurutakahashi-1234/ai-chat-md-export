# Swift CI/CD スクリプト

日付: 2024-05-31

---

## 👤 ユーザー
*2024/5/31 13:07:00*

以下のようなコマンドラインを実行するCI/CDパイプラインを作成している。

swift run コマンドで npm の npx のように、依存をすべて解決せずに、"https://github.com/apple/swift-openapi-generator.git", from: "1.2.1" のみをインストールして、実行するような方法はないのか？

swift run --package-path ./OpenApiGenSamplePackage swift-openapi-generator generate ././schema/openapi.yaml --config ././schema/openapi-generator-config.yaml --output-directory ././OpenApiGenSamplePackage/Sources/OpenApiGenSamplePackage

```
// swift-tools-version: 5.10
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "OpenApiGenSamplePackage",
    platforms: [
        .iOS(.v17),
        .macOS(.v14), // use swift-openapi-generator CLI
    ],
    products: [
        .library(name: "OpenApiGenSamplePackage", targets: ["OpenApiGenSamplePackage"]),
    ],
    dependencies: [
        // swift-openapi-generator
        .package(url: "https://github.com/apple/swift-openapi-generator.git", from: "1.2.1"), // CLI Only
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.1"), // Use URLSession
        .package(url: "https://github.com/swift-server/swift-openapi-async-http-client", from: "1.0.0"), // Use AsyncHTTPClient

        // toast
        .package(url: "https://github.com/sanzaru/SimpleToast.git", from: "0.8.1"),
        
        // shimmer animation
        .package(url: "https://github.com/markiv/SwiftUI-Shimmer.git", from: "1.5.0"),
    ],
    targets: [
        .target(
            name: "OpenApiGenSamplePackage",
            dependencies: [
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
                .product(name: "OpenAPIAsyncHTTPClient", package: "swift-openapi-async-http-client"),
                .product(name: "SimpleToast", package: "SimpleToast"),
                .product(name: "Shimmer", package: "SwiftUI-Shimmer"),
            ]
        ),
        .testTarget(
            name: "OpenApiGenSamplePackageTests",
            dependencies: ["OpenApiGenSamplePackage"]
        ),
    ]
)
```

---

## 🤖 アシスタント
*2024/5/31 13:07:19*

`swift run` コマンドで特定のパッケージのみをインストールし実行することは、直接的にはサポートされていません。しかし、以下の方法で実現することができます。

1. **独立したパッケージとしてスクリプトを作成する**:
    - 必要なCLIツールのみを含むシンプルなSwift Packageを作成し、その中で `swift run` を実行するようにする。

2. **シェルスクリプトを使用する**:
    - シェルスクリプトで `swift package` の一時プロジェクトを作成し、その中で必要な依存関係のみをインストールし、コマンドを実行する。

ここでは、シェルスクリプトを使用する方法を示します。

### シェルスクリプトを使用する方法

以下のシェルスクリプトを作成し、必要なパッケージをインストールして実行します。

```bash
#!/bin/bash

# 一時ディレクトリを作成
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# 一時パッケージを作成
cat > Package.swift <<EOL
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "TempPackage",
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator.git", from: "1.2.1"),
    ],
    targets: [
        .executableTarget(
            name: "TempExecutable",
            dependencies: [
                .product(name: "swift-openapi-generator", package: "swift-openapi-generator")
            ]
        )
    ]
)
EOL

# パッケージの依存関係を解決
swift package resolve

# コマンドを実行
swift run --package-path . swift-openapi-generator generate /path/to/schema/openapi.yaml --config /path/to/schema/openapi-generator-config.yaml --output-directory /path/to/output/directory

# 一時ディレクトリを削除
rm -rf $TEMP_DIR
```

このスクリプトは以下の手順を実行します：
1. 一時ディレクトリを作成。
2. 一時的なSwift Packageを作成。
3. 必要な依存関係（この場合、 `swift-openapi-generator` のみ）を `Package.swift` に定義。
4. `swift package resolve` を実行して依存関係を解決。
5. `swift run` コマンドを実行してOpenAPI Generatorを実行。
6. 一時ディレクトリを削除。

このスクリプトを実行することで、依存関係をすべて解決せずに特定の依存関係のみを使用してコマンドを実行することができます。

これをCI/CDパイプラインに組み込むことができます。例えば、GitHub Actionsを使用する場合、次のように設定できます：

```yaml
name: Swift OpenAPI Generator

on: [push]

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Swift
        uses: fwal/setup-swift@v1

      - name: Generate OpenAPI Client
        run: |
          bash ./generate_openapi_client.sh
```

この設定により、リポジトリにプッシュされた際にスクリプトが実行され、必要な依存関係のみを使用してOpenAPI Generatorを実行します。

---

## 👤 ユーザー
*2024/5/31 13:11:39*

swift package resolve は特定のディレクトリを指定しなくていいのか？

---

## 🤖 アシスタント
*2024/5/31 13:11:56*

`swift package resolve` コマンドは現在のディレクトリ内の `Package.swift` を見つけて依存関係を解決します。特定のディレクトリを指定する場合は `--package-path` オプションを使用します。

修正したスクリプトは以下のようになります：

```bash
#!/bin/bash

# 一時ディレクトリを作成
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# 一時パッケージを作成
cat > Package.swift <<EOL
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "TempPackage",
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator.git", from: "1.2.1"),
    ],
    targets: [
        .executableTarget(
            name: "TempExecutable",
            dependencies: [
                .product(name: "swift-openapi-generator", package: "swift-openapi-generator")
            ]
        )
    ]
)
EOL

# パッケージの依存関係を解決
swift package resolve --package-path $TEMP_DIR

# コマンドを実行
swift run --package-path $TEMP_DIR swift-openapi-generator generate /path/to/schema/openapi.yaml --config /path/to/schema/openapi-generator-config.yaml --output-directory /path/to/output/directory

# 一時ディレクトリを削除
rm -rf $TEMP_DIR
```

このスクリプトでは、 `swift package resolve` および `swift run` コマンドの両方に `--package-path` オプションを追加して、一時ディレクトリを指定しています。これにより、指定したディレクトリ内の `Package.swift` を使用して依存関係を解決し、実行することができます。

このスクリプトを使用してCI/CDパイプラインで `swift-openapi-generator` のみをインストールして実行することができます。例えば、GitHub Actionsを使用する場合、以下のように設定します：

```yaml
name: Swift OpenAPI Generator

on: [push]

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Swift
        uses: fwal/setup-swift@v1

      - name: Generate OpenAPI Client
        run: |
          bash ./generate_openapi_client.sh
```

この設定により、リポジトリにプッシュされた際にスクリプトが実行され、 `swift-openapi-generator` のみをインストールしてOpenAPI Generatorを実行します。

---

## 👤 ユーザー
*2024/5/31 13:22:47*

独立したパッケージとしてスクリプトを作成する方法を教えてほしい。

---

## 🤖 アシスタント
*2024/5/31 13:23:00*

独立したパッケージとしてスクリプトを作成する方法を紹介します。この方法では、必要なCLIツールのみを含むシンプルなSwift Packageを作成し、その中で `swift run` を実行します。

### ステップ 1: 独立したパッケージを作成する

まず、新しいSwift Packageを作成します。

```bash
swift package init --type executable --name OpenApiGeneratorTool
cd OpenApiGeneratorTool
```

次に、`Package.swift` ファイルを以下のように編集して必要な依存関係を追加します：

```swift
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "OpenApiGeneratorTool",
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator.git", from: "1.2.1"),
    ],
    targets: [
        .executableTarget(
            name: "OpenApiGeneratorTool",
            dependencies: [
                .product(name: "swift-openapi-generator", package: "swift-openapi-generator")
            ]
        ),
    ]
)
```

### ステップ 2: メインスクリプトを作成する

次に、`Sources/OpenApiGeneratorTool/main.swift` ファイルを以下のように編集します：

```swift
import Foundation

let arguments = [
    "swift-openapi-generator",
    "generate",
    "/path/to/schema/openapi.yaml",
    "--config",
    "/path/to/schema/openapi-generator-config.yaml",
    "--output-directory",
    "/path/to/output/directory"
]

let process = Process()
process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
process.arguments = arguments

do {
    try process.run()
    process.waitUntilExit()
} catch {
    print("Failed to run swift-openapi-generator: \(error)")
}
```

### ステップ 3: パッケージを実行する

このパッケージを実行することで、依存関係を解決し、`swift-openapi-generator` を使用して指定されたコマンドを実行します。

```bash
swift run OpenApiGeneratorTool
```

### CI/CDパイプラインへの組み込み

GitHub Actionsを使用して、この独立したパッケージを実行するための設定は以下のようになります：

```yaml
name: Swift OpenAPI Generator

on: [push]

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Swift
        uses: fwal/setup-swift@v1

      - name: Build and Run OpenAPI Generator Tool
        run: |
          cd OpenApiGeneratorTool
          swift build
          swift run OpenApiGeneratorTool
```

この設定により、リポジトリにプッシュされた際に `OpenApiGeneratorTool` パッケージがビルドされ、実行されます。これによって、`swift-openapi-generator` を使用してOpenAPIクライアントが生成されます。

---
