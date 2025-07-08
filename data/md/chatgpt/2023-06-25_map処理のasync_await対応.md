# map処理のasync/await対応

Date: 2023-06-25

---

## 👤 User
*2023-06-26 08:06:31*

map 処理だとasync/await対応できないので、対応してほしい。

public static func predictWithFaceDetection(sampleBuffer: CMSampleBuffer, timestamp: Double, orientation: EmotionAnalysis.InputOrientation = .portrait) async throws -&gt; [ImageItem] {}

public func analysis() async throws {
        let predictEmotionResults = sampleBufferAndTimestamp.map { sampleBuffer, timestamp -&gt; PredictEmotionResult in
            let imageItem = EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
            return PredictEmotionResult(timestamp: timestamp, imageItem: imageItem)
        }
    }

---

## 🤖 Assistant
*2023-06-26 08:07:09*

あなたが提供したコードの例では、非同期の関数（`EmotionAnalysis.predictWithFaceDetection`）が `map` 関数の中で同期的に呼び出されています。そのため、 `map` 処理は非同期処理に対応していません。

Swift 5.5以降では、非同期の処理を適切にハンドリングするために、 `async/await` パターンが導入されました。このパターンを使用すると、非同期処理を同期的なコードと同じように書くことができます。非同期タスクの結果を直接変数に割り当てることができ、エラーハンドリングも可能です。

あなたのコードをこのパターンに適応させるためには、 `map` ではなく `TaskGroup` を使用します。以下に例を示します：

```swift
public func analysis() async throws {
    var predictEmotionResults: [PredictEmotionResult] = []

    await withTaskGroup(of: PredictEmotionResult.self) { group in
        for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
            group.addTask {
                let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
                return PredictEmotionResult(timestamp: timestamp, imageItem: imageItem)
            }
        }

        for await result in group {
            predictEmotionResults.append(result)
        }
    }
}
```
このコードでは、 `withTaskGroup` を使って各非同期タスクを管理します。タスクグループは、それぞれのタスクが完了するのを待ち、全ての結果を集めることができます。`group.addTask` を使って新しいタスクを追加し、`for await` を使って全てのタスクが完了するのを待ちます。このパターンを使うことで、非同期タスクを並行して実行し、全ての結果を `predictEmotionResults` 配列に集めることができます。

なお、ここで提供されたコードスニペットはあくまで一例であり、エラーハンドリングなどは考慮されていませんので、適宜必要な処理を追加してください。

---

## 👤 User
*2023-06-26 08:07:39*

この処理はひとつひとつEmotionAnalysis.predictWithFaceDetection行う必要がないんだ

---

## 🤖 Assistant
*2023-06-26 08:08:09*

非同期プログラミングでは、あるタスクが完了するのを待つ間に別のタスクを開始することができ、その結果、処理全体の時間を短縮することができます。あなたの場合、`EmotionAnalysis.predictWithFaceDetection`は非同期関数で、それぞれのタスクが独立しているため、複数のタスクを同時に実行することができます。

しかし、もし一度に一つのタスクだけを実行する必要があるとき、または順序が重要である場合には、forループとasync/awaitを使用して、各タスクが順序どおりに完了するようにすることができます。以下にその一例を示します。

```swift
public func analysis() async throws {
    var predictEmotionResults: [PredictEmotionResult] = []
    for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
        let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
        let result = PredictEmotionResult(timestamp: timestamp, imageItem: imageItem)
        predictEmotionResults.append(result)
    }
}
```
このコードでは、各`EmotionAnalysis.predictWithFaceDetection`関数呼び出しの間でawaitを使用しています。これにより、次の呼び出しが行われる前に各呼び出しが完了することを保証します。これにより、タスクが逐次的に実行され、順番に結果が`predictEmotionResults`配列に追加されます。

このパターンは、同時に実行するとリソースの競合や他の問題が生じる可能性があるタスク、または特定の順序で実行する必要があるタスクに適しています。

---

## 👤 User
*2023-06-26 08:08:28*

順序 は別に気していなくて、処理速度を一番気にしている

---

## 🤖 Assistant
*2023-06-26 08:09:00*

あなたが処理速度を最も重視している場合、非同期処理を行うことで、複数の処理を同時に行い全体の速度を向上させることができます。そのため、 `TaskGroup` を使用して複数の非同期タスクを並行して実行することができます。

以下にその一例を示します。

```swift
public func analysis() async throws {
    var predictEmotionResults: [PredictEmotionResult] = []

    await withTaskGroup(of: PredictEmotionResult.self) { group in
        for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
            group.addTask {
                let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
                return PredictEmotionResult(timestamp: timestamp, imageItem: imageItem)
            }
        }

        for await result in group {
            predictEmotionResults.append(result)
        }
    }
}
```

このコードは、非同期に実行できる `EmotionAnalysis.predictWithFaceDetection` を利用して、すべてのサンプルバッファとタイムスタンプのペアに対して非同期に処理を実行します。各タスクは `TaskGroup` に追加され、タスクはそれぞれ並行して実行されます。タスクが完了すると、その結果は `predictEmotionResults` 配列に追加されます。

この方法により、一度に複数のタスクを開始し、それぞれが終了するのを待つことができます。全体の処理速度は大幅に向上するはずです。

ただし、このコードではタスクの完了順は保証されません。それぞれのタスクは独立しており、どのタスクが最初に完了するかはタスクの処理時間に依存します。これが問題になる場合は、適切なソート処理を追加するなどして対応してください。

---

## 👤 User
*2023-06-26 08:10:09*

以下のエラーになった

Invalid conversion from throwing function of type '@Sendable () async throws -&gt; PredictEmotionResult' to non-throwing function type '@Sendable () async -&gt; PredictEmotionResult'

public struct PredictEmotionResult {
    public let id: String = UUID().uuidString
    public let timestamp: Date
    public let imageItem: [ImageItem]

    public init(timestamp: Date, imageItem: [ImageItem]) {
        self.timestamp = timestamp
        self.imageItem = imageItem
    }
}

---

## 🤖 Assistant
*2023-06-26 08:10:40*

エラーメッセージは、非同期タスクがエラーをスローする可能性があるにも関わらず、そのエラーが適切にハンドリングされていないことを示しています。`group.addTask`のクロージャで `try await EmotionAnalysis.predictWithFaceDetection(...)` を呼び出している部分がエラーをスローする可能性があるため、このエラーをハンドリングする必要があります。

この問題を解決するためには、`do-catch` ブロックを使用してエラーをハンドリングします。以下にその一例を示します。

```swift
public func analysis() async throws {
    var predictEmotionResults: [PredictEmotionResult] = []

    await withTaskGroup(of: Result<PredictEmotionResult, Error>.self) { group in
        for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
            group.addTask {
                do {
                    let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
                    return .success(PredictEmotionResult(timestamp: timestamp, imageItem: imageItem))
                } catch {
                    return .failure(error)
                }
            }
        }

        for await result in group {
            switch result {
            case .success(let emotionResult):
                predictEmotionResults.append(emotionResult)
            case .failure(let error):
                // エラーハンドリングを行う
                print("An error occurred: \(error)")
            }
        }
    }
}
```

ここでは、各タスクの結果を `Result` タイプでラップしています。各タスクは成功（`.success`）かエラー（`.failure`）のどちらかを返します。その後、非同期タスクの結果を収集するループ内で、`Result` の値をアンラップしてエラーをハンドリングします。エラーハンドリングの方法は、アプリケーションの要件によります。ここでは、エラーメッセージを単に出力するだけですが、適切なエラーハンドリング処理を実装してください。

---

## 👤 User
*2023-06-26 08:10:56*

何もハンドリングしないで analysis() async throwsにthrowしてしまっていいです。

---

## 🤖 Assistant
*2023-06-26 08:11:24*

理解しました。各タスクがエラーをスローする可能性がある場合、それを直接 `analysis()` 関数に伝播させることも可能です。その場合、 `group.addTask` 内のクロージャはエラーをスローすることができ、それを `analysis()` 関数がハンドリングできます。

以下にその一例を示します。

```swift
public func analysis() async throws {
    var predictEmotionResults: [PredictEmotionResult] = []

    await try withThrowingTaskGroup(of: PredictEmotionResult.self) { group in
        for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
            group.addTask {
                let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
                return PredictEmotionResult(timestamp: timestamp, imageItem: imageItem)
            }
        }

        for try await result in group {
            predictEmotionResults.append(result)
        }
    }
}
```

このコードでは、 `withThrowingTaskGroup` を使用していて、各タスクはエラーをスローすることが可能です。エラーがスローされると、そのエラーは `analysis()` 関数に伝播されます。このため、 `analysis()` 関数はエラーをスローする可能性があることを示す `throws` キーワードが必要です。

このパターンでは、タスクのエラーハンドリングは `analysis()` 関数の呼び出し元に委ねられます。これは、エラーハンドリングが一箇所に集中し、各タスクが独立してエラーをハンドリングしなくても良い場合に便利です。ただし、この方法を使用する場合、 `analysis()` 関数を呼び出すすべてのコードが可能なエラーを適切にハンドリングする必要があります。

---

## 👤 User
*2023-06-26 08:42:43*

async 処理の中で 2つの await 処理を平行に実行するにはどうすればいいの？

---

## 🤖 Assistant
*2023-06-26 08:43:11*

Swiftにおいて、2つの非同期タスクを平行に実行するには、`async let` を使用します。これにより、非同期タスクを並行して開始し、結果が必要になるまで実行をブロックせずに他のタスクを進めることができます。

以下にその一例を示します。

```swift
func fetchDataFromTwoSources() async throws {
    async let data1 = fetchDataFromSource1()
    async let data2 = fetchDataFromSource2()

    // 共に終了するまで待つ
    let result1 = try await data1
    let result2 = try await data2

    // ここで result1 と result2 を利用できます。
}
```

このコードでは、 `fetchDataFromSource1()` と `fetchDataFromSource2()` という2つの非同期タスクが同時に開始されます。 `async let` を使用することで、これらのタスクが平行に実行され、それぞれの結果を変数 `data1` と `data2` に格納します。

その後、 `await` を使用して結果が利用可能になるまで待機します。これらの `await` は2つのタスクが共に完了するまで待機するため、結果が必要になるまで実行をブロックしません。これにより、非同期タスクを効率的に並行実行することができます。

なお、 `async let` は Swift 5.5 以降で利用可能です。これは非同期タスクの実行を管理するための強力なツールで、効率的な非同期プログラミングを可能にします。

---

## 👤 User
*2023-06-26 08:44:07*

こんな感じで、// 視線分析と// 感情分析を並列で実行したいんだ

public func analyze() async throws {
        // 視線分析
        let emotionDataModels1 = try await analyzeEmotion()
        let emotionDataKey1 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey1, dataModels: emotionDataModels1))
        
        // 感情分析
        let emotionDataModels2 = try await analyzeEmotion()
        let emotionDataKey2 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey2, dataModels: emotionDataModels2))
    }

---

## 🤖 Assistant
*2023-06-26 08:44:37*

非同期タスクを並列に実行するには、Swift 5.5以降の `async let` 機能を使用できます。`analyzeEmotion`と`serializeAndUpload` の2つの操作を並列に実行するためには、以下のように実装できます。

```swift
public func analyze() async throws {
    // 視線分析
    async let task1: Void = {
        let emotionDataModels1 = try await analyzeEmotion()
        let emotionDataKey1 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey1, dataModels: emotionDataModels1))
    }()

    // 感情分析
    async let task2: Void = {
        let emotionDataModels2 = try await analyzeEmotion()
        let emotionDataKey2 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey2, dataModels: emotionDataModels2))
    }()

    // 並列に実行されたタスクが完了するのを待つ
    try await task1
    try await task2
}
```

このコードでは、 `async let` を使用して `task1` と `task2` という2つの非同期タスクを並行に開始します。その後、 `await` を使用して各タスクが完了するのを待ちます。

`async let` は、非同期操作を平行して実行し、必要に応じてその結果を待つことができる強力なツールです。ただし、タスク間で共有リソースの競合が発生する場合や、タスクの実行順序が重要な場合には注意が必要です。

---

## 👤 User
*2023-06-26 08:45:00*

単純なTaskブロックで2つ囲うのはダメなの？

---

## 🤖 Assistant
*2023-06-26 08:45:39*

あなたが意図している "Taskブロック" が Swift の `Task` クラスを用いた非同期処理のことを指していると仮定します。Swiftの並行タスクは通常 `Task.init` で作成します。この方法も非同期タスクを並列に実行することが可能です。以下にその一例を示します。

```swift
public func analyze() async throws {
    // 視線分析
    let task1 = Task {
        let emotionDataModels1 = try await analyzeEmotion()
        let emotionDataKey1 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey1, dataModels: emotionDataModels1))
    }

    // 感情分析
    let task2 = Task {
        let emotionDataModels2 = try await analyzeEmotion()
        let emotionDataKey2 = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey2, dataModels: emotionDataModels2))
    }

    // 並列に実行されたタスクが完了するのを待つ
    try await task1.get()
    try await task2.get()
}
```

このコードでは、 `Task.init` を使用して `task1` と `task2` という2つの非同期タスクを並行に開始します。その後、 `Task.get()` を使用して各タスクが完了するのを待ちます。

ただし、 `Task.init` と `async let` の違いに注意してください。`Task.init` を使用すると、非同期タスクは明示的にキャンセルするまで存続します。これに対して、 `async let` を使用すると、非同期タスクは `async let` を定義したスコープの終了とともに自動的にキャンセルされます。

また、このコードは `Task` を明示的に作成しているため、 `Task` オブジェクトに対して `cancel` メソッドを呼び出すなど、タスクを管理するための追加の機能が提供されます。

---
