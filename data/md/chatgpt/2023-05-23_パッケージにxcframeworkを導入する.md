# パッケージにxcframeworkを導入する

日付: 2023-05-23

---

## 👤 ユーザー
*2023/5/23 10:08:28*

Pakeage.swift に xcframework 形式のライブラリを導入する方法をおしえてほしい

---

## 🤖 アシスタント
*2023/5/23 10:09:18*

Swift Package Managerは、Xcode 12以降、バイナリディストリビューションをサポートしています。これは、.xcframework形式のライブラリを使用する場合に特に役立ちます。これを行うためには、以下の手順を守る必要があります。

1. まず、バイナリフレームワークをホストする公開可能なURLを用意します。このURLは、.zipファイルを指すものでなければなりません。そして、その.zipファイルには、.xcframeworkファイルが含まれている必要があります。

2. 次に、`Package.swift` ファイルを作成または編集します。Swift tools version 5.3以上を宣言し、パッケージの依存関係にバイナリターゲットを追加します。

具体的な `Package.swift` ファイルの記述例は以下のとおりです：

```swift
// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "YourPackageName",
    products: [
        .library(
            name: "YourLibraryName",
            targets: ["YourLibraryName"]),
    ],
    targets: [
        .binaryTarget(
            name: "YourLibraryName",
            url: "https://your-url.com/your-library.xcframework.zip",
            checksum: "The checksum of the zip file"
        )
    ]
)
```

上記の `YourPackageName`、`YourLibraryName`、`https://your-url.com/your-library.xcframework.zip`、そして `"The checksum of the zip file"` をそれぞれあなたのパッケージ名、ライブラリ名、そしてライブラリのホストされているURL、そして.zipファイルのチェックサムに置き換えます。

チェックサムは、バイナリフレームワークが変更されていないことを確認するために使用されます。チェックサムを生成するには、通常、シェルで次のようなコマンドを実行します：

```shell
swift package compute-checksum your-library.xcframework.zip
```

3. 最後に、あなたのプロジェクトや他のSwiftパッケージからこのパッケージを依存関係として追加します。

以上が、`Package.swift` に .xcframework 形式のライブラリを導入する一般的な方法です。公開されているライブラリのURLとチェックサムを知っていれば、これらの手順に従ってSwiftパッケージに追加することができます。

---

## 👤 ユーザー
*2023/5/23 10:09:37*

zip されていないものをもっているんだけど、zipしたほうがいいの？

---

## 🤖 アシスタント
*2023/5/23 10:09:56*

はい、それは正しいです。Swift Package Managerはバイナリディストリビューションのために.zip形式のファイルを要求します。したがって、.xcframework形式のライブラリをSwift Package Managerで使用するためには、まずそのライブラリを.zipファイルに圧縮する必要があります。

これを行うには、以下のコマンドを使用できます（MacOSでの例）:

```bash
zip -r YourLibrary.xcframework.zip YourLibrary.xcframework
```

上記のコマンドは、`YourLibrary.xcframework`を`YourLibrary.xcframework.zip`という名前の.zipファイルに圧縮します。その後、この.zipファイルをSwift Package ManagerがアクセスできるURLにホストする必要があります。そしてそのURLと.zipファイルのチェックサムを `Package.swift` ファイルに指定します。

---
