# VNSequence vs VNImage Handlers

Date: 2023-08-26

---

## 👤 User
*2023-08-26 17:33:58*

VNSequenceRequestHandlerとVNImageRequestHandlerの違いを教えて欲しい

---

## 🤖 Assistant
*2023-08-26 17:34:33*

`VNSequenceRequestHandler` と `VNImageRequestHandler` は、AppleのVisionフレームワークに関連するクラスで、異なる目的のために設計されています。このフレームワークは、画像や動画の分析を容易にするための多くのツールを提供します。

以下は、`VNSequenceRequestHandler` と `VNImageRequestHandler` の主な違いを示しています：

1. **目的**:
   - `VNImageRequestHandler`: これは静止画像の分析を行うためのものです。ある特定の画像に対して1回または複数回のVisionリクエストを実行するために使用します。
   - `VNSequenceRequestHandler`: これはシーケンスの分析を行うためのものです。主に動画やリアルタイムキャプチャストリームの各フレームを分析する際に使用されます。このハンドラは、フレーム間の一貫性や情報の伝達を考慮して処理を行うことができます。

2. **使用シーン**:
   - `VNImageRequestHandler`: 静止画像の認識や分析タスクに使用します。例えば、写真に写っている顔を検出したり、テキストを認識したりする場合などです。
   - `VNSequenceRequestHandler`: 動画のフレームを順番に処理する場合や、リアルタイムのカメラフィードを分析する場合に使用します。顔のトラッキングや物体の追跡など、シーケンス全体での情報の一貫性が必要なタスクに適しています。

3. **持続性**:
   - `VNImageRequestHandler`: 通常、1つの画像の分析が完了するとこのハンドラは破棄されます。
   - `VNSequenceRequestHandler`: シーケンスの分析中は持続的に存在し、複数のフレーム間で情報を維持することができます。

これらのハンドラを選択する際は、あなたのアプリケーションの要件や目的に基づいて適切なものを選択してください。

---

## 👤 User
*2023-08-26 17:39:51*

VNSequenceRequestHandlerとVNRequestを使って、perform(_ requests: [VNRequest]) throwsで処理する処理をサンプルに書いて欲しい

---

## 🤖 Assistant
*2023-08-26 17:40:19*

`VNSequenceRequestHandler` を使用して `VNRequest` を処理するための基本的なサンプルを以下に示します。この例では、リアルタイムの動画フレームからの顔の検出を行うものとしています。

まず、顔の検出リクエストを作成します:

```swift
import Vision

// 顔の検出リクエストを作成
let faceDetectionRequest = VNDetectFaceRectanglesRequest { (request, error) in
    guard let results = request.results as? [VNFaceObservation] else {
        print("顔の検出に失敗しました: \(error?.localizedDescription ?? "未知のエラー")")
        return
    }
    
    for face in results {
        print("Detected face at \(face.boundingBox)")
    }
}
```

次に、このリクエストを `VNSequenceRequestHandler` に渡して処理を行います:

```swift
let requestHandler = VNSequenceRequestHandler()

func processFrame(_ pixelBuffer: CVPixelBuffer) {
    do {
        // リクエストを実行
        try requestHandler.perform([faceDetectionRequest], on: pixelBuffer)
    } catch {
        print("リクエストの実行に失敗しました: \(error.localizedDescription)")
    }
}
```

上記の `processFrame(_:)` メソッドは、リアルタイムの動画フレームを処理するためのものです。このメソッドを動画の各フレームに対して呼び出すことで、顔の検出が行われます。

注意点:
- 上記のコードは、具体的なアプリケーションやフレームワークのセットアップによっては動作しない場合があります。そのため、必要に応じて適切なコンテキストや環境での調整が必要です。
- パフォーマンスのために、リクエストの処理をバックグラウンドスレッドで行うことを検討すると良いでしょう。

---

## 👤 User
*2023-08-26 17:41:14*

processFrame のレスポンス [VNFaceObservation]? とするようにできないのか？あ

---

## 🤖 Assistant
*2023-08-26 17:41:34*

はい、`processFrame` のレスポンスを `[VNFaceObservation]?` とすることは可能です。これを行うためには、`processFrame` メソッドの定義を変更して、リクエストの完了時に結果を返すようにします。

以下は、そのように変更した `processFrame` メソッドのサンプルです:

```swift
import Vision

// 顔の検出リクエストを作成
let faceDetectionRequest = VNDetectFaceRectanglesRequest()

let requestHandler = VNSequenceRequestHandler()

func processFrame(_ pixelBuffer: CVPixelBuffer) -> [VNFaceObservation]? {
    do {
        // リクエストを実行
        try requestHandler.perform([faceDetectionRequest], on: pixelBuffer)
        
        // 結果を取得して返す
        return faceDetectionRequest.results as? [VNFaceObservation]
    } catch {
        print("リクエストの実行に失敗しました: \(error.localizedDescription)")
        return nil
    }
}
```

このようにすると、`processFrame` メソッドを呼び出す際に得られる結果は `[VNFaceObservation]?` 型になります。この結果を使用して、他のコードやUI更新などに応じて適切な処理を行うことができます。

---

## 👤 User
*2023-08-26 17:43:00*

これってperform を実行した時点で、resultsに値があるものだとしていいのか？

---

## 🤖 Assistant
*2023-08-26 17:43:24*

はい、`perform`メソッドの実行後には、`VNRequest`の`results`プロパティに結果が格納されています。具体的には、`VNDetectFaceRectanglesRequest`のようなリクエストを実行した場合、`results`プロパティには検出された顔の情報を格納した`VNFaceObservation`の配列が格納されます。

ただし、重要なのは、正常にリクエストが完了した場合のみ`results`に結果が格納される点です。何らかの理由でリクエストの実行に失敗した場合や、検出対象が存在しない場合などは、`results`は空の配列か`nil`となる可能性があります。

そのため、実際に結果を取得する前に、`results`の内容が存在するかどうかを確認することが必要です。上述のサンプルコードの中で、以下の行でその確認を行っています:

```swift
return faceDetectionRequest.results as? [VNFaceObservation]
```

この行では、`results`を`[VNFaceObservation]`型にキャストしようとしています。キャストが成功すれば、それは検出された顔の情報が格納されていることを意味します。キャストが失敗した場合（`nil`を返す場合）、それは結果が存在しないか、予期しない型のデータが格納されていることを示しています。

---

## 👤 User
*2023-08-26 17:43:44*

processFrame がエラーを返すようにして欲しい

---

## 🤖 Assistant
*2023-08-26 17:44:06*

了解しました。`processFrame`を変更して、エラーをthrowするようにします。そのため、Swiftのエラーハンドリングメカニズムを使用します。以下は、そのように変更した`processFrame`メソッドのサンプルです：

まず、カスタムのエラータイプを定義します:

```swift
enum FrameProcessingError: Error {
    case requestFailed(String)
    case noResults
}
```

次に、`processFrame`メソッドを変更します:

```swift
import Vision

let faceDetectionRequest = VNDetectFaceRectanglesRequest()
let requestHandler = VNSequenceRequestHandler()

func processFrame(_ pixelBuffer: CVPixelBuffer) throws -> [VNFaceObservation] {
    // リクエストを実行
    try requestHandler.perform([faceDetectionRequest], on: pixelBuffer)
    
    // 結果を取得
    guard let results = faceDetectionRequest.results as? [VNFaceObservation], !results.isEmpty else {
        throw FrameProcessingError.noResults
    }
    
    return results
}
```

このようにすると、`processFrame`メソッドは以下の場合にエラーをthrowします:

1. リクエストの実行に失敗した場合（`requestHandler.perform`からのエラー）。
2. 結果が存在しない、または予期しない型のデータが格納されている場合。

このメソッドを呼び出す側では、`do-catch`文を使用してエラーハンドリングを行うことができます。

---

## 👤 User
*2023-08-26 17:45:46*

isEmpty のときはエラーにしないで欲しい

---

## 🤖 Assistant
*2023-08-26 17:46:00*

了解しました。`isEmpty`の場合にエラーをスローしないように`processFrame`メソッドを調整します。

以下が修正したメソッドのサンプルです：

```swift
import Vision

let faceDetectionRequest = VNDetectFaceRectanglesRequest()
let requestHandler = VNSequenceRequestHandler()

func processFrame(_ pixelBuffer: CVPixelBuffer) throws -> [VNFaceObservation] {
    // リクエストを実行
    try requestHandler.perform([faceDetectionRequest], on: pixelBuffer)
    
    // 結果を取得
    let results = faceDetectionRequest.results as? [VNFaceObservation] ?? []
    
    return results
}
```

この変更により、結果が空の場合でもエラーはスローされず、空の配列が返されるようになりました。

---

## 👤 User
*2023-08-26 18:08:04*

これってasync/awaitする必要設定ってあるのかな？

---

## 🤖 Assistant
*2023-08-26 18:08:36*

Visionフレームワークの`perform`メソッドは、デフォルトで同期的に実行されます。そのため、`async/await`を直接使用する必要はありません。しかし、iOSやmacOSの新しいバージョンでは`async/await`を活用したい場合や、UIスレッドをブロックせずにバックグラウンドで処理を実行したい場合があるかと思います。

Swift 5.5以降のバージョンで、`async/await`を使用して非同期処理を行いたい場合は、以下のような方法で`async/await`を使って`processFrame`メソッドを変更できます：

```swift
import Vision

let faceDetectionRequest = VNDetectFaceRectanglesRequest()
let requestHandler = VNSequenceRequestHandler()

func processFrame(_ pixelBuffer: CVPixelBuffer) async throws -> [VNFaceObservation] {
    return try await withCheckedThrowingContinuation { continuation in
        DispatchQueue.global().async {
            do {
                try requestHandler.perform([faceDetectionRequest], on: pixelBuffer)
                let results = faceDetectionRequest.results as? [VNFaceObservation] ?? []
                continuation.resume(returning: results)
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }
}
```

上記のコードでは、`withCheckedThrowingContinuation`メソッドを使用して非同期処理を実行しています。このメソッドはSwift 5.5で導入され、非同期の処理を手動で制御する方法を提供しています。

この方法を使用すると、Visionフレームワークの同期的な`perform`メソッドを非同期的に実行することができ、メインスレッドをブロックせずに処理をバックグラウンドで実行することができます。

---
