# iOSでUIImageを使用する

Date: 2023-10-23

---

## 👤 User
*2023-10-23 23:29:23*

iOSで動くようにして欲しいNSImageの代わりにUIImageを使うようにして欲しい


import EmotionAnalysisCore
import Foundation
import UIKit

print("start")
let filesDirectoryName = "TestImages"
var currentFileURL = URL(filePath: #file)
currentFileURL.deleteLastPathComponent()
let directoryPath = currentFileURL.appending(path: filesDirectoryName).absoluteString.replacingOccurrences(of: "file://", with: "")
print("directoryPath: \(directoryPath)")
let filesExist = checkIfFilesExist(in: directoryPath)
if !filesExist {
    fatalError("Image files don't exist!")
}

let fileManager = FileManager.default
do {
    let directoryPath = directoryPath
    let directoryNames = try fileManager.contentsOfDirectory(atPath: directoryPath)
    print("directoryNames: \(directoryNames)")
    var resultModels: [ResultModel] = []
    try directoryNames.enumerated().forEach { directoryItem in
        let fileDirectoryPath = directoryPath + "/" + directoryItem.element
        let fileNames = try fileManager.contentsOfDirectory(atPath: fileDirectoryPath)
        
        try fileNames.enumerated().forEach { fileItem in
            let image = NSImage(contentsOf: URL(fileURLWithPath: fileDirectoryPath + "/" + fileItem.element))!
            let results = try EmotionAnalysisCore.shared.predict(imageRequestHandler: ImageParameterType.uiImage(image: image).imageRequestHandler)
            let resultModelItems = results.map {
                ResultModelItem(resultEmotion: $0.emotion.rawValue, resultConfidence: $0.confidence)
            }
            let resultModel = ResultModel(fileName: fileItem.element, emotionKind: directoryItem.element, results: resultModelItems)
            resultModels.append(resultModel)
            print("Directory: \(directoryItem.offset + 1)/\(directoryNames.count), File: \(fileItem.offset + 1)/\(fileNames.count)")
        }
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
*2023-10-23 23:29:57*

このコードは、特定のディレクトリから画像ファイルを読み込み、それぞれの画像に対して感情分析を行い、結果をJSONファイルとして保存するというものです。ただし、このコードはmacOS向けに書かれており、`NSImage`が使用されています。iOSでは`UIImage`を使用する必要があるため、以下のようにコードを変更する必要があります。

```swift
import EmotionAnalysisCore
import Foundation
import UIKit

// ... [前のコードは変わらず]

    try directoryNames.enumerated().forEach { directoryItem in
        let fileDirectoryPath = directoryPath + "/" + directoryItem.element
        let fileNames = try fileManager.contentsOfDirectory(atPath: fileDirectoryPath)

        try fileNames.enumerated().forEach { fileItem in
            // `NSImage`の代わりに`UIImage`を使用する
            guard let image = UIImage(contentsOfFile: fileDirectoryPath + "/" + fileItem.element) else {
                print("Error loading image")
                return
            }
            let results = try EmotionAnalysisCore.shared.predict(imageRequestHandler: ImageParameterType.uiImage(image: image).imageRequestHandler)
            let resultModelItems = results.map {
                ResultModelItem(resultEmotion: $0.emotion.rawValue, resultConfidence: $0.confidence)
            }
            let resultModel = ResultModel(fileName: fileItem.element, emotionKind: directoryItem.element, results: resultModelItems)
            resultModels.append(resultModel)
            print("Directory: \(directoryItem.offset + 1)/\(directoryNames.count), File: \(fileItem.offset + 1)/\(fileNames.count)")
        }
    }

// ... [以降のコードは変わらず]
```

この変更により、macOS専用の`NSImage`の代わりにiOSで使用される`UIImage`を使用して画像を読み込むようになります。また、エラーハンドリングのために、画像の読み込みが失敗した場合の処理も追加しています。それ以外の部分は、元のコードのロジックを維持しています。

---

## 👤 User
*2023-10-23 23:34:30*

以下のエラーが発生した

IOSurface creation failed: e00002be parentID: 0 properties: {
    IOSurfaceAllocSize = 200768;
    IOSurfaceBytesPerElement = 4;
    IOSurfaceBytesPerRow = 896;
    IOSurfaceElementHeight = 1;
    IOSurfaceElementWidth = 1;
    IOSurfaceHeight = 224;
    IOSurfaceName = CoreVideo;
    IOSurfaceOffset = 0;
    IOSurfacePixelFormat = 1111970369;
    IOSurfaceWidth = 224;
} (likely per client IOSurface limit of 16384 reached)

---

## 🤖 Assistant
*2023-10-23 23:35:11*

このエラーメッセージは、iOSデバイスが同時に多くのIOSurfaceオブジェクトを作成しようとしているときに発生することがよくあります。IOSurfaceは、アプリケーション間で画像データを共有するための技術ですが、同時に多くのオブジェクトを作成するとシステムリソースが不足し、このようなエラーが発生することがあります。

解決策として以下の方法が考えられます：

1. **リソースの解放**: エラーが「クライアントのIOSurface上限に達した可能性がある」と述べているため、使用している全ての画像データや他のメモリ集約的リソースが適切に解放されていることを確認してください。特に、大量の画像を扱っている場合や、画像処理のようなメモリ集約的な処理を行っている場合には、不要になったオブジェクトを明示的に解放する必要があります。

2. **バッチ処理**: 画像の処理をバッチに分けることで、一度に処理する画像の数を減らすことができます。これにより、同時に作成されるIOSurfaceの数が減り、このエラーを回避できる可能性があります。

3. **非同期処理の最適化**: もし画像処理などが非同期で行われている場合、同時に多数のタスクが実行されないように処理を調整することが重要です。例えば、DispatchQueueなどを使用して、同時に実行できるタスクの数を制限することができます。

この問題は、アプリケーションの設計や実行されている処理に大きく依存します。従って、具体的な解決策を提案するためには、アプリケーションの全体的な構造や、このエラーが発生するコンテキストをより詳しく理解する必要があります。

---
