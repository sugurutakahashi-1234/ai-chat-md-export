# Combineでasync throwsを並列実行

日付: 2023-06-29

---

## 👤 ユーザー
*2023/6/29 9:02:44*

SwiftのCombineでmap処理でasync throws関数を呼び出すときに並列で実行したい

---

## 🤖 アシスタント
*2023/6/29 9:03:26*

SwiftのCombineフレームワークでは、非同期処理とエラーハンドリングを組み合わせて非常に柔軟なデータ処理パイプラインを作成することができます。しかし、Combineは基本的に直列の処理を行います。直接的に並列処理をサポートするための機能は提供していません。

そのため、並列に実行したい場合は、一部自分でコードを書いて管理する必要があります。

以下の例では、非同期でエラーをスローする可能性のある関数`asyncThrowsFunction()`をCombineの`flatMap`演算子を用いて並列に実行しています。`flatMap`は各出力に対して非同期の処理を行い、その結果をストリームにフラット化します。並列化を制御するために、`maxPublishers`パラメータを使用しています。

この例では、`DispatchQueue.global().async`を使用して、非同期のタスクをグローバルディスパッチキューにスケジュールし、結果を`Future`として返す関数`asyncToFuture`を作成しています。これにより、非同期のタスクが並列に実行されます。

```swift
import Combine
import Foundation

func asyncThrowsFunction(input: Int) async throws -> String {
    // ここで何らかの非同期操作を行います
}

func asyncToFuture(input: Int) -> Future<String, Error> {
    Future { promise in
        DispatchQueue.global().async {
            do {
                let result = try await asyncThrowsFunction(input: input)
                promise(.success(result))
            } catch {
                promise(.failure(error))
            }
        }
    }
}

let publisher = [1, 2, 3, 4, 5].publisher
publisher
    .flatMap(maxPublishers: .max(2)) { input in
        asyncToFuture(input: input)
    }
    .sink(receiveCompletion: { completion in
        switch completion {
        case .failure(let error):
            print("Error: \(error)")
        case .finished:
            print("Finished")
        }
    }, receiveValue: { value in
        print("Received value: \(value)")
    })
```

このコードは、`asyncThrowsFunction()`を並列に呼び出し、その結果を出力します。最大の並列実行数は`maxPublishers`パラメータで制御します。この例では、最大2つの非同期タスクが同時に実行されます。

ただし、Combineが直接的に並列処理をサポートしていないため、この方法はいくつかの制約があります。たとえば、非同期のタスクがどの順序で完了するかは保証されません。さらに、非同期のタスクが一度にいくつ実行されるかを正

---

## 🤖 アシスタント
*2023/6/29 9:03:48*

確に制御することは困難です。この制約を受け入れるか、または他のツール（例えば、Operation QueuesやGCDなど）を使って並列処理を行うことを検討してください。

---
