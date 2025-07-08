# Swift Package + XCFramework

Date: 2023-05-06

---

## 👤 User
*2023-05-07 01:38:40*

XCFramework を使うと、Swift  Package Managerでいい感じに扱えるようになるって聞いているんだけどどうやればいいのか教えて欲しい

---

## 🤖 Assistant
*2023-05-07 01:40:04*

XCFrameworkをSwift Package Managerで扱うには、次の手順に従ってください。

1. XCFrameworkを作成する:
最初に、XCFrameworkを作成する必要があります。これは、複数のプラットフォーム用にコンパイルされたバイナリを含む単一のバンドルです。以下のコマンドを使用してXCFrameworkを作成できます。

```
xcodebuild -create-xcframework -framework {iOSFramework}.framework -framework {watchOSFramework}.framework -framework {tvOSFramework}.framework -framework {macOSFramework}.framework -output {XCFrameworkName}.xcframework
```

2. Swift Packageを作成する:
次に、Swift Packageを作成します。これは、XCFrameworkとその他のSwiftコードを含むことができます。次のコマンドを実行して、Swift Packageを作成します。

```
swift package init --type library
```

3. Package.swiftを編集する:
`Package.swift`ファイルを開き、`Package`マニフェストを編集して、XCFrameworkを含めます。XCFrameworkのバイナリを提供するリモートURLまたはローカルファイルシステムパスを指定できます。以下は、`Package.swift`ファイルの例です。

```swift
// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "MyPackage",
    platforms: [.iOS(.v13), .macOS(.v10_15), .watchOS(.v6), .tvOS(.v13)],
    products: [
        .library(
            name: "MyPackage",
            targets: ["MyPackage"]),
    ],
    dependencies: [
    ],
    targets: [
        .binaryTarget(
            name: "MyFramework",
            url: "https://example.com/MyFramework.xcframework.zip",
            checksum: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        ),
        .target(
            name: "MyPackage",
            dependencies: ["MyFramework"]),
        .testTarget(
            name: "MyPackageTests",
            dependencies: ["MyPackage"]),
    ]
)
```

4. XCFrameworkをSwift Packageに追加する:
XCFrameworkを含むSwift Packageを完成させるには、`MyFramework.xcframework.zip`をリモートURLまたはローカルファイルシステムに配置して、`Package.swift`にそのURLを追加します。

5. Swift Packageを使用する:
XCFrameworkを含むSwift Packageが完成したら、プロジェクトに追加して使用できます。Xcodeでプロジェクトを開き、`File > Swift Packages > Add Package Dependency...`を選択し、Swift PackageのリポジトリURLを入力します。また、Swift Packageのバージョンルールを設定してインストールします。

これで、XCFrameworkがSwift Package Managerで適切に扱われるようになります。プロジェクトで必要なターゲットに対して、Swift Packageのターゲットを

---

## 👤 User
*2023-05-07 01:40:12*

つづき

---

## 🤖 Assistant
*2023-05-07 01:41:07*

追加して、XCFrameworkを利用できるようになります。以下は、プロジェクトでSwift Packageを使用する方法の例です。

1. ターゲットを選択:
Xcodeでプロジェクトを開き、左側のナビゲーターエリアでプロジェクト名をクリックしてプロジェクト設定にアクセスします。次に、メインターゲットを選択し、`General`タブに移動します。

2. フレームワークを追加:
`Frameworks, Libraries, and Embedded Content`セクションを見つけ、`+`ボタンをクリックして、Swift Packageで提供されるXCFrameworkを選択します。これにより、選択したターゲットにフレームワークが追加されます。

3. インポートと使用:
XCFrameworkを使用したいファイルで、次のようにインポートします。

```swift
import MyFramework
```

これで、XCFramework内のクラス、構造体、関数などにアクセスできるようになります。プロジェクト内で必要に応じてXCFrameworkを使用して、機能を実装してください。

注意: XCFrameworkが他のプラットフォーム用にもコンパイルされている場合、適切なバージョンが自動的に選択されます。そのため、異なるプラットフォーム間でコードの互換性を気にする必要はありません。

これで、XCFrameworkをSwift Package Managerで適切に扱い、プロジェクトに組み込む方法がわかりました。独自のフレームワークを作成して他のプロジェクトで再利用したり、他の開発者と共有したりする際に、この方法が役立ちます。

---

## 👤 User
*2023-05-07 01:41:49*

XCFrameworkはiOS対応のものだけでいいよ

---

## 🤖 Assistant
*2023-05-07 01:43:04*

すみません、了解しました。iOS対応のXCFrameworkだけを作成し、Swift Package Managerで扱う方法を説明します。

1. iOS用のXCFrameworkを作成する:
まず、iOS用のバイナリを含むXCFrameworkを作成します。次のコマンドを使用して、iOS用のXCFrameworkを作成できます。

```
xcodebuild -create-xcframework -framework {iOSFramework}.framework -output {XCFrameworkName}.xcframework
```

2. Swift Packageを作成する:
次に、Swift Packageを作成します。これは、XCFrameworkとその他のSwiftコードを含むことができます。次のコマンドを実行して、Swift Packageを作成します。

```
swift package init --type library
```

3. Package.swiftを編集する:
`Package.swift`ファイルを開き、`Package`マニフェストを編集して、iOS用のXCFrameworkを含めます。XCFrameworkのバイナリを提供するリモートURLまたはローカルファイルシステムパスを指定できます。以下は、`Package.swift`ファイルの例です。

```swift
// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "MyPackage",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "MyPackage",
            targets: ["MyPackage"]),
    ],
    dependencies: [
    ],
    targets: [
        .binaryTarget(
            name: "MyFramework",
            url: "https://example.com/MyFramework.xcframework.zip",
            checksum: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        ),
        .target(
            name: "MyPackage",
            dependencies: ["MyFramework"]),
        .testTarget(
            name: "MyPackageTests",
            dependencies: ["MyPackage"]),
    ]
)
```

4. XCFrameworkをSwift Packageに追加する:
XCFrameworkを含むSwift Packageを完成させるには、`MyFramework.xcframework.zip`をリモートURLまたはローカルファイルシステムに配置して、`Package.swift`にそのURLを追加します。

5. Swift Packageを使用する:
XCFrameworkを含むSwift Packageが完成したら、プロジェクトに追加して使用できます。Xcodeでプロジェクトを開き、`File > Swift Packages > Add Package Dependency...`を選択し、Swift PackageのリポジトリURLを入力します。また、Swift Packageのバージョンルールを設定してインストールします。

これで、iOS用のXCFrameworkがSwift Package Managerで適切に扱われるようになります。プロジェクトで必要なターゲットに対して、Swift Packageのターゲットを追加して、XCFrameworkを使用できるようになります。

---
