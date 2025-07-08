# iOS Simulator ローカルファイル参照

Date: 2023-10-23

---

## 👤 User
*2023-10-23 22:48:06*

iOS simulatorからローカルファイルを参照して実行する方法

---

## 🤖 Assistant
*2023-10-23 22:49:07*

iOS Simulatorを使用して開発しているとき、特定のローカルファイルやデータにアクセスする必要がある場合があります。XcodeのiOS Simulatorでこれを行うには、いくつかの手順を実行する必要があります。

1. **ファイルをアプリのプロジェクトに追加**:
   - まず、アプリケーションにローカルファイルを追加します。Xcodeのプロジェクトナビゲータで、ファイルをドラッグしてプロジェクトに追加します。ファイルを追加するときに、"Copy items if needed"をチェックして、ファイルがプロジェクトのディレクトリにコピーされるようにします。

2. **アプリ内でファイルをロード**:
   - Swiftでこれを行うには、例えば、以下のようなコードを使用してファイルへのパスを取得します。
     ```swift
     if let filepath = Bundle.main.path(forResource: "example", ofType: "txt") {
         // filepathを使用してファイルの内容を読み込みます
     } else {
         print("File not found")
     }
     ```
     ここで、`forResource`にはファイル名が、`ofType`にはファイルの拡張子が入ります。

3. **Simulatorでアプリを実行**:
   - 通常どおりSimulatorでアプリをビルドして実行します。ファイルはアプリのバンドル内に含まれるため、アプリケーションコード内で適切に参照されます。

4. **Simulatorでのファイルのブラウジング**:
   - シミュレーターで直接ファイルをブラウズまたは操作する場合、Finderを使用してシミュレーターのファイルシステムにアクセスできます。
     - Finderを開き、メニューバーの「移動」から「フォルダへ移動...」を選択します。
     - 次に、`~/Library/Developer/CoreSimulator/Devices/`に移動します。
     - ここには、利用可能なすべてのシミュレーターインスタンスの一覧が表示されます。各ディレクトリは、シミュレーターのインスタンスに対応しています。適切なデバイスを選択し、「data」フォルダに移動した後、アプリケーションのコンテナを見つけることができます。

5. **Simulatorへのファイルのドラッグ&ドロップ**:
   - iOS Simulatorは、macOSのFinderからファイルやフォルダーをドラッグ&ドロップできます。これを行うと、ドロップされたアイテムがSimulatorのアプリケーションサンドボックスのDocumentsフォルダに追加されます。そして、プログラムからそのパスを取得してアクセスすることができます。

これらの手順を使用すると、iOS Simulatorでローカルファイルを使用してアプリケーションをテストすることができます。ただし、アプリが実際のデバイスで実行されるときにもこれらのファイルにアクセスできるように、適切なファイルパスと管理手法を使用していることを確認してください。

---

## 👤 User
*2023-10-23 22:49:44*

iOS Simulator から macOSのFinderにアクセスしたいんだ

---

## 🤖 Assistant
*2023-10-23 22:50:37*

iOS Simulatorから直接macOSのFinderやその他のシステムファイルにアクセスすることは基本的にはできません。iOS Simulatorは、実際のiOSデバイスのように動作するように設計されており、サンドボックス環境内で実行されるため、ホストシステムのファイルにはアクセスできません。ただし、特定のファイルやデータをSimulatorに転送する方法はいくつかあります。

1. **ドラッグ＆ドロップ**:
   - 最も簡単な方法の1つは、ファイルをiOS Simulatorのウィンドウにドラッグ＆ドロップすることです。これにより、そのファイルはSimulator上のアプリのDocumentsディレクトリにコピーされます。この方法は主にファイルや画像などのメディアコンテンツを迅速に転送するために使用されます。

2. **共有コンテナ**:
   - アプリがApp Groupsを使用している場合、共有コンテナにファイルを配置することができます。これは、異なるアプリ間でファイルを共有する場合や、macOSアプリとiOSアプリ間でデータを共有する際に役立ちます。

3. **Finderを使用したファイルの転送**:
   - 特定のファイルをSimulatorに直接配置する必要がある場合、そのデバイスのファイルシステムにアクセスできます。
     - Finderで、`~/Library/Developer/CoreSimulator/Devices/`に移動します。ここには、インストールされているすべてのSimulatorのUUIDがリストされています。
     - 適切なデバイスを見つけるには、それぞれの`device.plist`ファイルを確認する必要があります。
     - 正しいデバイスを見つけたら、`data/Containers/Data/Application/`に進み、特定のアプリのディレクトリを探します（これもUUIDで表示されます）。`Documents`フォルダはここにあります。
     - 必要なファイルをこの`Documents`ディレクトリにドラッグ＆ドロップするか、または必要に応じてサブディレクトリを作成します。

4. **XcodeのProject Navigator**:
   - XcodeのProject Navigatorを使用して、アプリのバンドルリソースに直接ファイルを追加することもできます。ただし、これはアプリが次にビルドされるときにのみ反映されます。

これらの方法を使用すると、iOS Simulatorで動作するアプリが必要なファイルにアクセスできるようになりますが、Simulator自体が直接macOSのファイルシステムにアクセスすることはできません。アプリの開発やテストに必要なファイルやデータは、上記の方法を使用してSimulatorに転送する必要があります。

---

## 👤 User
*2023-10-23 22:50:39*

この処理の#if os(macOS) を取った場合でもiOSで動くようにしたいんだ。

import EmotionAnalysisCore
import Foundation
#if os(macOS)
    import AppKit
#endif

print("start")
let filesDirectoryName = "TestImages"
var currentFileURL = URL(filePath: #file)
currentFileURL.deleteLastPathComponent()
let directoryPath = currentFileURL.appending(path: filesDirectoryName).absoluteString.replacingOccurrences(of: "file://", with: "")
let filesExist = checkIfFilesExist(in: directoryPath)
if !filesExist {
    fatalError("Image files don't exist!")
}

let fileManager = FileManager.default
do {
    let directoryPath = directoryPath
    let directoryNames = try fileManager.contentsOfDirectory(atPath: directoryPath)
    var resultModels: [ResultModel] = []
    try directoryNames.enumerated().forEach { directoryItem in
        let fileDirectoryPath = directoryPath + "/" + directoryItem.element
        let fileNames = try fileManager.contentsOfDirectory(atPath: fileDirectoryPath)

        #if os(macOS)
            try fileNames.enumerated().forEach { fileItem in
                let image = NSImage(contentsOf: URL(fileURLWithPath: fileDirectoryPath + "/" + fileItem.element))!
                let results = try EmotionAnalysisCore.shared.predict(parameter: .uiImage(image: image))
                let resultModelItems = results.map {
                    ResultModelItem(resultEmotion: $0.emotion.rawValue, resultConfidence: $0.confidence)
                }
                let resultModel = ResultModel(fileName: fileItem.element, emotionKind: directoryItem.element, results: resultModelItems)
                resultModels.append(resultModel)
                print("Directory: \(directoryItem.offset + 1)/\(directoryNames.count), File: \(fileItem.offset + 1)/\(fileNames.count)")
            }
        #endif
    }

    let jsonResultPath = currentFileURL.absoluteString.replacingOccurrences(of: "file://", with: "") + "result.json"
    saveJSONToFile(resultModels, filePath: jsonResultPath)
    print("Completed!")
} catch {
    print(error.localizedDescription)
}

private func checkIfFilesExist(in directoryPath: String) -&gt; Bool {
    let fileManager = FileManager.default

    do {
        let fileURLs = try fileManager.contentsOfDirectory(atPath: directoryPath)

        // ディレクトリ内のファイル数が1つ以上ある場合はtrueを返す
        return !fileURLs.isEmpty
    } catch {
        print("Error while checking files: \(error.localizedDescription)")
        return false
    }
}

private func saveJSONToFile(_ data: some Encodable, filePath: String) {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted
    do {
        let jsonData = try encoder.encode(data)
        if let jsonString = String(data: jsonData, encoding: .utf8) {
            try jsonString.write(toFile: filePath, atomically: true, encoding: .utf8)
            print("JSON saved successfully.")
        }
    } catch {
        print("Failed to save JSON:", error.localizedDescription)
    }
}

---

## 🤖 Assistant
*2023-10-23 22:51:29*

コードをiOSで動作するように変更するには、いくつかの修正と更新が必要です。最も重要なのは、`NSImage`の代わりに`UIImage`を使用し、ファイルのパスと取り扱いをiOSに適合させることです。

以下は、提案された変更点です:

1. **`UIImage`のインポート**:
   - `AppKit`の代わりに、iOSでは`UIKit`を使用します。そのため、`NSImage`の代わりに`UIImage`を使用します。

   ```swift
   import UIKit
   ```

2. **`NSImage`から`UIImage`への変更**:
   - `NSImage`はmacOS特有のものであり、iOSでは`UIImage`を使用する必要があります。

   ```swift
   let image = UIImage(contentsOfFile: fileDirectoryPath + "/" + fileItem.element)!
   ```

3. **ファイルパスの取得**:
   - iOSアプリでは、ファイルパスを直接参照するのではなく、アプリのサンドボックス内のディレクトリを使用します。特に、`Bundle.main.path(forResource:ofType:)`や`FileManager`を使用して、`Documents`ディレクトリや`Bundle`内のファイルへのパスを取得する必要があります。

   ```swift
   guard let documentsDirectoryPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else {
       fatalError("No accessible user directories")
   }
   let directoryPath = documentsDirectoryPath + "/" + filesDirectoryName
   ```

   また、これらのファイルやディレクトリをアプリに最初から含める場合は、それらをプロジェクトに追加し、`Bundle.main`を通じてアクセスする必要があります。

4. **JSONの保存**:
   - iOSでは、ファイルを保存する場所は通常、アプリケーションの`Documents`ディレクトリです。`String`の`write(toFile:atomically:encoding:)`はmacOSと同じように動作しますが、ファイルパスはサンドボックス内のものでなければなりません。

   ```swift
   let jsonResultPath = documentsDirectoryPath + "/result.json"
   ```

上記の変更を加えると、コードはiOSデバイスまたはシミュレーターで動作するはずです。ただし、このコードはローカルのファイルシステムに依存していますので、ファイルをアプリのバンドルに追加するか、アプリを使用する前にファイルをアプリの`Documents`ディレクトリに配置する必要があります。これは、Xcodeのプロジェクト設定やアプリの初期設定スクリプトなどで行うことができます。

---

## 👤 User
*2023-10-23 22:56:16*

こうなっていて、executableTarget のEmotionAnalysisValidationで実行する。EmotionAnalysisValidation/main.swiftがあって、EmotionAnalysisValidation/TestImages/以下のフォルダに対して解析を行う

// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

// Ref: https://twitter.com/_maiyama18/status/1631265021857783810
private extension PackageDescription.Target.Dependency {
    /// Same Package module
    static let emotionAnalysisCore: Self = "EmotionAnalysisCore"
    /// For Test
    static let nimble: Self = .product(name: "Nimble", package: "Nimble")
    static let quick: Self = .product(name: "Quick", package: "Quick")
}

let package = Package(
    name: "EmotionAnalysisPackage",
    defaultLocalization: "ja",
    platforms: [.iOS(.v16), .macOS(.v14)],
    products: [
        .library(name: "EmotionAnalysisCore", targets: ["EmotionAnalysisCore"]),
        .library(name: "EmotionAnalysisPresentation", targets: ["EmotionAnalysisPresentation"]),
        .executable(name: "EmotionAnalysisValidation", targets: ["EmotionAnalysisValidation"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Quick/Nimble", from: "11.2.0"),
        .package(url: "https://github.com/Quick/Quick", from: "6.1.0"),
    ],
    targets: [
        .target(
            name: "EmotionAnalysisCore",
            dependencies: [],
            resources: [
                .process("Resources/EmotionAnalysisMlModel.mlpackage"),
            ]
        ),
        .target(
            name: "EmotionAnalysisPresentation",
            dependencies: [
                .emotionAnalysisCore,
            ]
        ),
        .executableTarget(
            name: "EmotionAnalysisValidation",
            dependencies: [
                .emotionAnalysisCore,
            ]
        ),
        .testTarget(
            name: "EmotionAnalysisTests",
            dependencies: [
                .quick,
                .nimble,
            ]
        ),
    ]
)


# EmotionAnalysisPackage

1. このPackageはVisionでの顔検出やcoreMLでの感情分析の処理を、emomil以外のアプリでも展開することを想定して、別のPackageに切り出したものです
2. `EmotionAnalysis`はiOSで使用するもの、`EmotionAnalysisValidation`はMac上で計測結果の調査に使用するCLIツール、`EmotionAnalysisCore`はその両方で利用する共通のModuleで、基本の分析処理はこのモジュールに入っています
  1. `EmotionAnalysisApp`は上記のModuleの機能を検証するDemo/検証用として追加しています
3. Coreの分析処理は以下のフローで実施されています
  1. 画像をinputにVisionFrameworkによる顔検出(検出結果は座標情報)
  2. 1の座標情報をもとに、画像から顔の箇所をcropする
  3. 2の画像を感情分析のinputにできるサイズにリサイズする
  4. 3の画像をinputにCoreMLで感情分析を行う
4. CoreMLの処理では、`EmotionAnalysisMlModel.mlpackage`を利用しています
  1. 上記をprojectに追加すると、`EmotionAnalysisMlModel.swift`が自動で生成されます
  2. 上記の`.mlpackage`が原因でpreviewもできないっぽいです


## EmotionAnalysisValidationの使い方
1. Xcodeで`EmotionAnalysisValidation`のSchemeを選択する
2. [Kaggle](https://www.kaggle.com/datasets/noamsegal/affectnet-training-data)のサイトから素材の画像をダウンロードし、`EmotionAnalysisPackage/Sources/EmotionAnalysisValidation/TestImages/`に配置する
3. デバイスにmacOSを選択し、`run`する

---

## 🤖 Assistant
*2023-10-23 22:57:14*

ご提供いただいた情報に基づくと、`EmotionAnalysisValidation`はmacOS上で動作するCLI（コマンドラインインターフェース）ツールであり、特定のディレクトリ内の画像に対して感情分析を行います。このツールは、iOSではなく、macOS上でのみ動作するように設計されています。しかし、同じコア機能（`EmotionAnalysisCore`）を使用してiOSアプリを作成することは可能です。

ただし、iOSデバイス上でローカルのファイルシステムにアクセスするには、いくつかの追加的な制約があります。iOSアプリはサンドボックス化されており、アプリのディレクトリ以外の場所へのアクセスが制限されています。したがって、`EmotionAnalysisValidation`のコードを直接iOSに移植するのではなく、iOS向けの新しいアプリケーションまたは機能として統合する必要があります。

以下は、iOSアプリでこれを達成するための一般的なステップです：

1. **新しいiOSアプリプロジェクトの作成**:
   - Xcodeで新しいiOSアプリプロジェクトを作成します。このプロジェクトは、UIを持ち、ユーザーが画像を選択して感情分析を実行できるように設計することができます。

2. **`EmotionAnalysisCore`モジュールの統合**:
   - 作成したiOSアプリプロジェクトに`EmotionAnalysisCore`モジュールを統合します。これにより、共有されたコア機能を利用できるようになります。

3. **画像の取得と選択**:
   - iOSアプリでは、ユーザーが直接画像を選択するか、アプリに組み込まれた画像を使用するUIを提供することができます。`UIImagePickerController`を使用して、ユーザーにカメラロールから画像を選択させることが一般的です。

4. **感情分析の実行**:
   - 選択された画像に対して`EmotionAnalysisCore`モジュールを使用して感情分析を実行します。

5. **結果の表示**:
   - 分析結果をユーザーに表示します。これは、テキストまたはグラフィカルな形式で行うことができます。

6. **（オプション）バッチ処理**:
   - もしバッチでの画像処理を行いたい場合、事前にアプリのバンドルに画像を含めるか、あるいはユーザーに複数の画像を一度に選択させることができます。

このプロセスは、`EmotionAnalysisValidation`ツールの直接的な移植ではなく、iOSの環境と制約に適合させた新しいアプリケーションの作成です。`EmotionAnalysisCore`のコア機能はそのまま保持され、iOSアプリのコンテキストで利用されます。

---
