# Awaiting async task

日付: 2023-06-30

---

## 👤 ユーザー
*2023/06/30 19:24:15*

Swiftで以下の hoge 関数に関して print("hoge") することをawait するような処理を書きたい

public func hoge() async {
        let cancelable = analyzeEmotionFinishedPublisher
            .sink { _ in
                print("hoge")
            } receiveValue: { _ in }
    }

---

## 🤖 アシスタント
*2023/06/30 19:25:00*

Swift 5.5 から非同期タスクを扱うための新機能 `async/await` が導入されています。この関数の `hoge()` に `async` がついていますが、この関数内で非同期タスクが完了するのを待つには `await` を使用します。ただし、 `analyzeEmotionFinishedPublisher` という Combine Publisher からの出力を待つことが目的だとすると、 `Task` を使用して非同期タスクをキャンセル可能な形で扱うことができます。それに基づいて、コードを次のように書き換えることができます：

```swift
public func hoge() async {
    let task = Task {
        await analyzeEmotionFinishedPublisher
            .sink { _ in
                print("hoge")
            } receiveValue: { _ in }
    }
    
    // wait for task to finish
    await task.value
}
```

ここで、 `Task` を使用して `analyzeEmotionFinishedPublisher` の出力を待ち、その結果を `await task.value` で取得します。このように、 `Task` と `async/await` を使用して非同期タスクを扱うことができます。

ただし、注意すべき点として、このコードは `analyzeEmotionFinishedPublisher` が何かしらの値を出力するのを待ち、それに基づいて処理を行うものです。これが本当にあなたの意図した動作であるかどうかを確認してください。また、エラーハンドリングの観点からも、 `Task` の結果を取得する際には `try` を使用して適切にエラーハンドリングを行うべきです。

また、このコードは Swift 5.5以降のバージョンで動作します。そのため、適切なバージョンの Swift を使用していることを確認してください。

---

## 👤 ユーザー
*2023/06/30 19:25:59*

ちょっとやりたいことが違くて、このhoge()は.sink { _ in
                print("hoge")
            } のprint("hoge")の処理が終わるまで、処理を終わったことにしたくないんだ。

---

## 🤖 アシスタント
*2023/06/30 19:26:48*

なるほど、理解しました。非同期の処理が終わるまで待ちたい、ということですね。その場合、Swift 5.5以降では、非同期タスクを `async` と `await` を使って待機することができます。CombineフレームワークとAsync/Awaitのブリッジについては、Swift 5.5から`AsyncStream`や`AsyncThrowingStream`が追加されました。これを利用すると、次のように書くことができます：

```swift
import Foundation
import Combine

public func hoge() async throws {
    let publisher = analyzeEmotionFinishedPublisher
    
    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream(Int.self) { continuation in
        let cancellable = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.finish()
                case .failure(let error):
                    continuation.finish(throwing: error)
                }
            } receiveValue: { value in
                continuation.yield(value)
            }
        
        // Store cancellable in continuation
        continuation.onTermination = { @Sendable _ in
            cancellable.cancel()
        }
    }
    
    // Await each element from the stream
    for try await _ in stream {
        print("hoge")
    }
}
```
このコードは`analyzeEmotionFinishedPublisher`の非同期処理が終了するまで待ち、それが終わった後に "hoge" を出力します。これは`AsyncStream`を使用してCombine publisherをAsync/Awaitで利用可能なストリームに変換し、その各要素を非同期に待つことで実現しています。

なお、このコードはエラーハンドリングを含んでおり、非同期処理がエラーをスローした場合はそれを上位へ伝播します。適切なエラーハンドリングを行うために、この関数を呼び出すコードは`try`を使用してエラーを捕捉するか、あるいは`try?`や`try!`を使用してエラーを無視またはアンラップする必要があります。

なお、Swiftの非同期/同期タスクの管理は、言語のバージョンや使用するライブラリによって大きく異なるため、実装の詳細については適切なドキュメンテーションやチュートリアルを参照することをお勧めします。

---

## 👤 ユーザー
*2023/06/30 19:28:35*

receiveValue の値もどうでもよくて、completion にきたということだけでいいんだ。

---

## 🤖 アシスタント
*2023/06/30 19:29:06*

理解しました。`receiveValue` の値には関心がなく、非同期処理が完了するまで待つことが目的であれば、`AsyncStream`を利用するコードを少し修正することで対応できます。その場合、次のように書くことができます：

```swift
import Foundation
import Combine

public func hoge() async throws {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream(Bool.self, bufferingPolicy: .bufferingNewest(1)) { continuation in
        let cancellable = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.yield(true)
                    continuation.finish()
                case .failure(let error):
                    continuation.finish(throwing: error)
                }
            } receiveValue: { _ in }

        // Store cancellable in continuation
        continuation.onTermination = { @Sendable _ in
            cancellable.cancel()
        }
    }

    // Await the completion of the stream
    if try await stream.first(where: { $0 }) != nil {
        print("hoge")
    }
}
```

このコードでは、非同期処理が完了したときに `true` を yield し、その後 `AsyncStream` を終了します。`receiveValue` は無視します。そして、 `stream.first(where: { $0 })` を使用して非同期処理が完了した (`true` を yield した) ことを待ち、それが完了したら "hoge" を出力します。これにより、非同期処理が完了するまで待つことができます。

---

## 👤 ユーザー
*2023/06/30 19:29:34*

throwing するひつようもない。

---

## 🤖 アシスタント
*2023/06/30 19:29:59*

もしエラーの処理が不要で、`analyzeEmotionFinishedPublisher`が完了するのを待つだけで良いのであれば、次のようにコードを書くことができます:

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream(Bool.self, bufferingPolicy: .bufferingNewest(1)) { continuation in
        let cancellable = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.yield(true)
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }

        // Store cancellable in continuation
        continuation.onTermination = { @Sendable _ in
            cancellable.cancel()
        }
    }

    // Await the completion of the stream
    if await stream.first(where: { $0 }) != nil {
        print("hoge")
    }
}
```
このコードは`analyzeEmotionFinishedPublisher`の非同期処理が完了したときだけ"hoge"を出力します。エラーが発生した場合、`AsyncStream`はただ終了します。これにより、非同期タスクが完了するまで待つことができ、エラーハンドリングを省略することができます。

---

## 👤 ユーザー
*2023/06/30 19:30:47*

print("hoge") もしなくてもいいよ

---

## 🤖 アシスタント
*2023/06/30 19:31:08*

すみません、その意図を理解しました。非同期タスクが完了するのを待つだけで、何も出力する必要がないということですね。それなら、以下のようなコードで実現できます。

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream(Bool.self, bufferingPolicy: .bufferingNewest(1)) { continuation in
        let cancellable = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.yield(true)
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }

        // Store cancellable in continuation
        continuation.onTermination = { @Sendable _ in
            cancellable.cancel()
        }
    }

    // Await the completion of the stream
    _ = await stream.first(where: { $0 })
}
```
このコードは `analyzeEmotionFinishedPublisher` からの非同期の処理が完了するのを待つだけで、それ以外の何も行いません。

---

## 👤 ユーザー
*2023/06/30 19:31:38*

以下の処理って必要なの？

continuation.onTermination = { @Sendable _ in
            cancellable.cancel()
        }

---

## 🤖 アシスタント
*2023/06/30 19:32:23*

この行は、`AsyncStream`が終了したとき（つまり、`continuation.finish()`または`continuation.finish(throwing:)`が呼ばれたとき、または`AsyncStream`の生存期間が終了したとき）に呼び出される終了ハンドラを設定しています。この終了ハンドラでは、`Combine`の`Cancellable`（この場合は`cancellable`）をキャンセルしています。

これはメモリリークを防ぐために重要です。もしキャンセルをしないと、`Cancellable`は解放されず、結果としてリソースが解放されない可能性があります。そのため、通常はこのようなキャンセル処理を行います。

ただし、`Combine`の`Publisher`が自動的に完了する（つまり、明示的なキャンセルなしに自動的にリソースを解放する）と確信がある場合は、この終了ハンドラを省略することもできます。しかし、このような挙動は`Publisher`の具体的な実装に依存するため、通常は明示的にキャンセルを行うことが推奨されます。

以下のように終了ハンドラを省略したコードは次のようになります：

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream(Bool.self, bufferingPolicy: .bufferingNewest(1)) { continuation in
        _ = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.yield(true)
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }
    }

    // Await the completion of the stream
    _ = await stream.first(where: { $0 })
}
```
ただし、再度強調しますが、これは`Publisher`が自動的に完了すると確信がある場合のみ安全に行える操作です。

---

## 👤 ユーザー
*2023/06/30 19:33:00*

.bufferingNewest(1) ってなに。また、Boolである必要もなくて Voidではだめなの？

---

## 🤖 アシスタント
*2023/06/30 19:33:38*

`AsyncStream`の`bufferingPolicy`パラメータは、ストリームが値をバッファリングする方法を指定します。`bufferingNewest(1)`は、最新の1つの値だけをバッファリングし、それ以前の値は破棄するというポリシーを指定します。非同期のストリームで新しい値が利用可能になったとき、古い値がまだ読み取られていない場合でも、新しい値で古い値を上書きします。

そして、指摘の通り、ストリームの型を`Bool`から`Void`に変更することも可能です。これは特に値自体に関心がなく、非同期タスクが完了するのを待つだけであれば十分な対応となります。

それに応じてコードは次のようになります：

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream<Void>(bufferingPolicy: .bufferingNewest(1)) { continuation in
        _ = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.yield(())
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }
    }

    // Await the completion of the stream
    _ = await stream.first(where: { _ in true })
}
```
この場合、`continuation.yield(())`で`Void`型の値（つまり何もない）をyieldしています。そして、`stream.first(where: { _ in true })`で非同期タスクが完了するのを待っています。

---

## 👤 ユーザー
*2023/06/30 19:33:57*

continuation.yield(()) も省略できるの？

---

## 🤖 アシスタント
*2023/06/30 19:34:22*

はい、その通りです。 `yield`を呼び出す必要はありません。特に、`yield`はストリームが新しい値を生成したことを通知するために使用されますが、非同期タスクが完了することを待つだけで、特定の値が不要であるならば、この呼び出しは省略することができます。

そのため、コードは以下のようになります：

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream<Void>(bufferingPolicy: .bufferingNewest(1)) { continuation in
        _ = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }
    }

    // Await the completion of the stream
    _ = await stream.first(where: { _ in true })
}
```
上記のコードでは、`.sink`が完了した（`.finished`または`.failure`）ときに、非同期ストリーム`stream`を終了しています。そして、その終了を`await stream.first(where: { _ in true })`で待つだけとなっています。

---

## 👤 ユーザー
*2023/06/30 19:34:42*

first(where: { _ in true } も意味はあるの？

---

## 🤖 アシスタント
*2023/06/30 19:35:19*

`first(where:)`関数は、指定した条件に最初に合致した要素を返します。ただし、あなたのシナリオでは、ストリームが終了するまで待つだけで、特定の要素を見つけることは必要ないと理解しています。

そのため、ここでは `first(where: { _ in true })` は省略し、代わりに `await` を使用してストリームが終了するのを待つことができます。しかし、Swiftの `AsyncStream` にはストリーム全体の終了を待つメソッドがありません。したがって、`first(where:)` や `last(where:)` のようなメソッドを使用してこの動作をエミュレートする必要があります。

そこで、ストリームが完了するまで待つだけであれば、次のようなコードを使用できます:

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Create an AsyncStream from the Combine publisher
    let stream = AsyncStream<Void>(bufferingPolicy: .bufferingNewest(1)) { continuation in
        _ = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.finish()
                case .failure:
                    continuation.finish()
                }
            } receiveValue: { _ in }
    }

    // Await the completion of the stream
    for await _ in stream {}
}
```
上記のコードでは、`for await _ in stream {}` が `AsyncStream` が完了するまで待つためのコードとなります。これは、`AsyncStream` から要素を読み取りつつ、その完了を待つための方法です。このシナリオでは、各要素の値は無視されます（`_`を使用しています）。

---

## 👤 ユーザー
*2023/06/30 19:36:57*

withCheckedContinuation で書き直すとどうなるの？

---

## 🤖 アシスタント
*2023/06/30 19:37:22*

Swift 5.5の非同期タスクAPIには、`Task.withCheckedContinuation`というメソッドがあり、これを利用して非同期タスクが完了するのを待つことができます。このメソッドを使用すると、コードは次のようになります：

```swift
import Foundation
import Combine

public func hoge() async {
    let publisher = analyzeEmotionFinishedPublisher

    // Use Task.withCheckedContinuation to wait for the publisher to finish
    await Task<Void, Never>.withCheckedContinuation { continuation in
        _ = publisher
            .sink { completion in
                switch completion {
                case .finished:
                    continuation.resume()
                case .failure:
                    continuation.resume()
                }
            } receiveValue: { _ in }
    }
}
```

上記のコードでは、`Task.withCheckedContinuation`メソッドを使用して非同期タスクを作成し、それが完了するのを待っています。`.sink`が完了した（`.finished`または`.failure`）ときに、`continuation.resume()`を呼び出して非同期タスクを再開（終了）します。そして、その再開（終了）を `await` で待つだけとなっています。この方法は非同期のAPIを同期的に扱うことを可能にします。

---
