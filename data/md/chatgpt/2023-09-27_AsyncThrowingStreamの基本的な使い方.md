# AsyncThrowingStreamの基本的な使い方

日付: 2023-09-27

---

## 👤 ユーザー
*2023/9/27 21:34:04*

AsyncThrowingStream の使い方教えて欲しい

---

## 🤖 アシスタント
*2023/9/27 21:35:17*

`AsyncThrowingStream`は、Swiftで非同期ストリームを生成するためのクラスです。これにより、ストリーム内の各要素が利用可能になったときに非同期に処理を行えます。以下は、`AsyncThrowingStream`を使用する基本的な方法です。

### 定義
```swift
AsyncThrowingStream<Element, Error>
```

`Element`はストリームから出力される要素の型であり、`Error`はストリームが投げる可能性のあるエラーの型です。

### 使用例

以下は、整数のシーケンスを生成する`AsyncThrowingStream`の例です。

```swift
import Swift

var iterator = (1...5).makeIterator()

let stream = AsyncThrowingStream<Int, Error> { continuation in
    Task {
        while let next = iterator.next() {
            continuation.yield(next)
        }
        continuation.finish()
    }
}

Task {
    do {
        for try await number in stream {
            print("Received number: \(number)")
        }
    } catch {
        print("Error received: \(error)")
    }
}
```

この例では、1から5までの整数を非同期に生成し、その各要素を出力します。ストリームは整数シーケンスの終わりで終了します。

### エラーハンドリング

エラーを投げる場合、以下のように`continuation`の`finish(throwing:)`メソッドを使用できます。

```swift
import Swift

enum StreamError: Error {
    case exampleError
}

let stream = AsyncThrowingStream<Int, Error> { continuation in
    Task {
        continuation.yield(1)
        continuation.yield(2)
        continuation.finish(throwing: StreamError.exampleError)
    }
}

Task {
    do {
        for try await number in stream {
            print("Received number: \(number)")
        }
    } catch {
        print("Error received: \(error)")
    }
}
```

このコードは、`1`と`2`を出力した後に、`StreamError.exampleError`エラーを投げます。

注意：Swiftのバージョンや環境によって、コードが若干異なる可能性がありますので、ご使用の環境に適した書き方を探してみてください。

---
