# Swift AsyncStream with upload

日付: 2023-09-27

---

## 👤 ユーザー
*2023/9/27 21:16:11*

以下をSwfitのAsyncStreamに対応してほしい

public func upload(key: String, localUrl: URL) async throws -&gt; AsyncStream&lt;Progress&gt; {
        do {
            LoggerContainer.log(.startUpload(.init(key: key)))
            let uploadTask = Amplify.Storage.uploadFile(key: key, local: localUrl)

            Task {
                for await progress in await uploadTask.progress {
                    LoggerContainer.debugLog("Upload progress: \\(progress.fractionCompleted \* 100)%")
                }
            }

            let result = try await uploadTask.value
            LoggerContainer.log(.endUpload(.init(key: key, result: result)))
            LoggerContainer.debugLog("Completed: \\(result)")
        } catch {
            LoggerContainer.logError("Failed to upload data: \\(error)")
            throw error
        }
    }

---

## 🤖 アシスタント
*2023/9/27 21:17:11*

Swiftの`AsyncStream`を使用して、指定された機能を書き直すことはできます。`AsyncStream`はSwift 5.5以降で使用できます。このクラスを使用することで、あなたは非同期シーケンスの値を生成することができます。

以下は、提供されたコードを`AsyncStream`に書き換える一つの方法です。注意してください、`uploadTask.progress`が`AsyncSequence`である必要があります。そして、`uploadTask.value`も`async`であるべきです。

```swift
public func upload(key: String, localUrl: URL) async throws -> AsyncStream<Progress> {
    AsyncStream<Progress> { continuation in
        Task {
            do {
                LoggerContainer.log(.startUpload(.init(key: key)))
                let uploadTask = Amplify.Storage.uploadFile(key: key, local: localUrl)

                for await progress in uploadTask.progress {
                    LoggerContainer.debugLog("Upload progress: \(progress.fractionCompleted * 100)%")
                    continuation.yield(progress)
                }
                
                let result = try await uploadTask.value
                LoggerContainer.log(.endUpload(.init(key: key, result: result)))
                LoggerContainer.debugLog("Completed: \(result)")
                continuation.finish()
            } catch {
                LoggerContainer.logError("Failed to upload data: \(error)")
                continuation.finish(throwing: error)
            }
        }
    }
}
```

このコードは、`upload`関数が進行状態を持つ`AsyncStream`を返すようにしています。エラーが発生した場合、`continuation.finish(throwing: error)`を使用してストリームにエラーを送信します。`AsyncStream`は呼び出し側で`for await`を使用して処理できます。

このコードは元のコードの意図と一致するように作成されていますが、`uploadTask.progress`と`uploadTask.value`の実装の詳細によっては、適切な調整が必要になるかもしれません。

---

## 👤 ユーザー
*2023/9/27 21:18:55*

Contextual closure type '() async -&gt; Progress?' expects 0 arguments, but 1 was used in closure bodyというエラーになった

---

## 🤖 アシスタント
*2023/9/27 21:20:02*

`AsyncStream`のコンストラクタで使用されるクロージャは、通常は引数を取らないので、エラーメッセージが出ています。しかし、クロージャの中で`continuation.yield(progress)`として、`Progress`型の値をyieldすることができます。

なので、以下のように修正すれば、エラーが解消されるかと思います。ただし、この例では`Progress`はストリームの型であり、`uploadTask.progress`が非同期シーケンスである必要があります。

```swift
public func upload(key: String, localUrl: URL) async throws -> AsyncStream<Progress> {
    return AsyncStream<Progress> { continuation in
        Task.init {
            do {
                LoggerContainer.log(.startUpload(.init(key: key)))
                let uploadTask = Amplify.Storage.uploadFile(key: key, local: localUrl)
                
                for await progress in uploadTask.progress {
                    LoggerContainer.debugLog("Upload progress: \(progress.fractionCompleted * 100)%")
                    continuation.yield(progress) // Here, you yield the progress.
                }
                
                let result = try await uploadTask.value
                LoggerContainer.log(.endUpload(.init(key: key, result: result)))
                LoggerContainer.debugLog("Completed: \(result)")
                continuation.finish()
            } catch {
                LoggerContainer.logError("Failed to upload data: \(error)")
                continuation.finish(throwing: error) // Here, you propagate the error.
            }
        }
    }
}
```

ここで`continuation.yield(progress)`を使用して、非同期で得られた各`progress`をストリームに追加します。そして、全てのprogressがyieldされたら、`continuation.finish()`を呼んでストリームの終了を示します。何らかのエラーが発生した場合は、`continuation.finish(throwing: error)`を使用してエラーを送信します。

注意: 実際の`uploadTask.progress`および`uploadTask.value`の具体的な型やインターフェイスによって、このコードがそのまま動作するか、または少しの調整が必要かもしれません。

---
