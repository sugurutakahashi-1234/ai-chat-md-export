# Swift Async @Published Update

Date: 2023-05-22

---

## 👤 User
*2023-05-23 01:07:33*

Swift Async Algorithms を使って、@Published な値を更新するようなコードを書いて欲しい

---

## 🤖 Assistant
*2023-05-23 01:08:52*

Swift 5.5以降で導入された非同期処理を扱う新機能Async/AwaitやSwift 5.6で導入されたAsync Algorithmsを組み合わせて、@Publishedな値を非同期的に更新するコード例を示します。

SwiftUIでよく使われる@Publishedな値は、変更が発生したときに変更通知を発行することが特徴です。以下のコードは、非同期タスクで値を取得して@Publishedプロパティを更新するViewModelを作成するものです。

```swift
import Foundation
import SwiftUI
import SwiftAsyncAlgorithms

// 非同期タスクの結果を表すenum
enum ResultState<T> {
    case idle
    case loading
    case failed(Error)
    case loaded(T)
}

class MyViewModel: ObservableObject {
    @Published var result: ResultState<Int> = .idle

    init() {
        loadData()
    }

    func loadData() async {
        result = .loading
        do {
            // 非同期タスクの実行
            let data = try await AsyncAlgorithms.fetchData()
            result = .loaded(data)
        } catch {
            result = .failed(error)
        }
    }
}

struct AsyncAlgorithms {
    // デモ用の非同期データ取得メソッド
    static func fetchData() async throws -> Int {
        // 擬似的に非同期処理を行うために1秒待機
        await Task.sleep(1_000_000_000) // Sleep for 1 second
        // ランダムな整数を返す
        return Int.random(in: 1...10)
    }
}
```

このコードでは、`MyViewModel`の`loadData`メソッドが非同期タスクを開始し、タスクの結果に基づいて@Publishedプロパティ`result`を更新します。この`result`の更新に応じてUIが再描画されます。

この例では、SwiftAsyncAlgorithmsの代わりに自分で非同期タスクを定義しています。実際のコードでは、SwiftAsyncAlgorithmsの非同期アルゴリズムを利用することも可能です。

---
