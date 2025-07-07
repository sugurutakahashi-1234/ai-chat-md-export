# 省略不可な重複したguard (Unavoidable Duplicate Guard)

日付: 2023-06-18

---

## 👤 ユーザー
*2023/6/19 1:42:48*

guard let tracker else の記述が繰り返しになるので省略できないかな？

---

## 🤖 アシスタント
*2023/6/19 1:43:05*

Swiftでコードを簡素化したい場合、一部の記述を関数化することができます。以下のように、オプショナルバインディング（`guard let`）の部分を関数化し、その関数を必要な場所で呼び出すことができます。

```swift
func unwrapTracker(_ tracker: Tracker?) throws -> Tracker {
    guard let tracker = tracker else {
        throw NSError(domain: "com.yourapp", code: 1, userInfo: [NSLocalizedDescriptionKey: "Tracker is nil"])
    }
    return tracker
}

do {
    let tracker = try unwrapTracker(optionalTracker)
    // trackerを使用するコード
} catch {
    print(error.localizedDescription)
}
```

この関数は`Tracker`のオプショナルインスタンスを受け取り、`nil`でなければその値を返します。`nil`の場合はエラーを投げます。そして、この関数を呼び出す際には`do-catch`文を使用してエラーハンドリングを

---
