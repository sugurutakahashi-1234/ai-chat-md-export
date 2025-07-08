# Combine tryCompactMap データ変換

日付: 2024-03-07

---

## 👤 ユーザー
*2024/03/08 01:20:16*

Swift の Combine での tryCompactMap の実装例

---

## 🤖 アシスタント
*2024/03/08 01:21:10*

`tryCompactMap` は Swift の Combine フレームワークにおいて、エラーを投げる可能性のある変換を行いつつ、`nil` をフィルタリングするオペレータです。このオペレータは、`Publisher` からの値を受け取り、それらを非`nil`の新しい型に変換しようと試みます。変換中にエラーが発生した場合は、そのエラーをダウンストリームに送信します。

以下に、`tryCompactMap` の使用例を示します。この例では、文字列の配列を持つ `Publisher` があり、これらの文字列を整数に変換しようとします。変換できない文字列（つまり、整数に変換できないもの）は無視されます。変換中に特定の条件でエラーを投げる場合も考慮します。

```swift
import Combine
import Foundation

// カスタムエラーを定義
enum ConversionError: Error {
    case customError
}

// 文字列の配列を持つ Publisher を作成
let strings = ["1", "a", "2", "b", "3", "error", "4"]
let stringsPublisher = PassthroughSubject<String, Error>()

// tryCompactMap を使用して文字列を整数に変換
let cancellable = stringsPublisher
    .tryCompactMap { string -> Int? in
        // 特定のエラー条件をシミュレート
        if string == "error" {
            throw ConversionError.customError
        }
        return Int(string)
    }
    .sink(receiveCompletion: { completion in
        switch completion {
        case .finished:
            print("Completed without error.")
        case .failure(let error):
            print("Received error: \(error)")
        }
    }, receiveValue: { value in
        print("Received value: \(value)")
    })

// Publisher に値を送信
strings.forEach { string in
    stringsPublisher.send(string)
}

// Publisher を完了させる
stringsPublisher.send(completion: .finished)

// キャンセル可能なサブスクリプションをキャンセル
cancellable.cancel()
```

このコードは、`stringsPublisher` から文字列を受け取り、それらを整数に変換しようとします。文字列 `"error"` が送信されると、`ConversionError.customError` を投げて、エラーを受信します。変換可能な文字列のみが整数としてダウンストリームに送信され、それ以外の値（この場合は `"a"` と `"b"`）は無視されます。

`tryCompactMap` を使用することで、エラーハンドリングを含む複雑なデータ変換処理をエレガントに実装できます。ただし、エラーを適切に処理するためには、`sink(receiveCompletion:receiveValue:)` でエラーをキャッチし、適切に対応する必要があります。

---

## 👤 ユーザー
*2024/03/08 01:22:16*

throw sota

---
