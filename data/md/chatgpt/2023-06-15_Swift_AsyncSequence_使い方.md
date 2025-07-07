# Swift AsyncSequence 使い方

日付: 2023-06-15

---

## 👤 ユーザー
*2023/6/15 19:00:25*

SwiftでAsyncSequence の基本的な使い方を教えて欲しい

---

## 🤖 アシスタント
*2023/6/15 19:01:16*

Swift 5.5から`AsyncSequence`が導入されました。これは非同期操作のシーケンスを表すプロトコルで、`for-in`構文を使って非同期に生成された値を反復することができます。

`AsyncSequence`を使う一つの典型的な例は非同期にデータを生成する関数を提供することです。以下にその一つの例を示します：

```swift
struct Counter: AsyncSequence {
    typealias Element = Int
    let howHigh: Int

    struct AsyncIterator: AsyncIteratorProtocol {
        let howHigh: Int
        var current = 1

        mutating func next() async -> Int? {
            // sequenceが終了したらnilを返します
            guard current <= howHigh else { return nil }

            // 現在の値を保持
            let result = current

            // 次の値を準備
            current += 1

            // 現在の値を返す
            return result
        }
    }

    func makeAsyncIterator() -> AsyncIterator {
        return AsyncIterator(howHigh: howHigh)
    }
}
```

この`Counter`という`AsyncSequence`は非同期に数値を生成します。`for-in`を使ってこれらの値を反復処理することができます。以下にその使用例を示します：

```swift
func printCounter() async {
    let counter = Counter(howHigh: 10)
    for await number in counter {
        print(number)
    }
}
```

上記の関数`printCounter()`を呼び出すと、1から10までの数値が非同期に生成され、その都度出力されます。このとき、各数値の生成は非同期に行われるため、それぞれの数値が出力される間には時間が掛かる可能性があります。

このように`AsyncSequence`と`AsyncIteratorProtocol`を用いることで、非同期操作を行いつつシーケンスのデータに順番にアクセスすることが可能になります。

---
