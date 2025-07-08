# Unused Code Detector

Date: 2023-08-21

---

## 👤 User
*2023-08-21 11:39:34*

Swift package manager で入れられるものでSwiftの使われていないコードを発見するライブラリを教えて欲しい。

---

## 🤖 Assistant
*2023-08-21 11:40:15*

Swiftのコード内で使われていない（デッドコード）部分を発見するためのツールやライブラリはいくつかありますが、Swift Package Manager (SPM) で直接インストールできるものもあります。

「Periphery」というツールは、SwiftとObjective-Cのプロジェクトで未使用のコードを検出するためのものです。PeripheryはCLIツールとして提供されていて、CocoaPodsやHomebrew、そしてSwift Package Managerを介してもインストールすることができます。

以下はSwift Package Managerを使用してPeripheryをインストールするための手順です:

1. 新しいディレクトリを作成してその中に移動します。
```bash
mkdir periphery-tool && cd periphery-tool
```

2. Swiftの新しいパッケージを初期化します。
```bash
swift package init --type executable
```

3. `Package.swift` ファイルをエディタで開き、依存関係としてPeripheryを追加します。
```swift
let package = Package(
    name: "periphery-tool",
    dependencies: [
        .package(url: "https://github.com/peripheryapp/periphery", from: "X.X.X")
    ],
    targets: [
        .target(name: "periphery-tool", dependencies: ["Periphery"])
    ]
)
```
ここで `X.X.X` はPeripheryの対象バージョン番号に置き換えてください。

4. 依存関係を解決してビルドします。
```bash
swift build
```

これでPeripheryがインストールされます。その後、適切なコマンドライン引数を使用してPeripheryを実行することで、未使用のコードを検出することができます。

注意: ツールの詳細やオプションは、公式のドキュメントやGitHubのリポジトリを確認してください。

---
