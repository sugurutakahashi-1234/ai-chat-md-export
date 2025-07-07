# Set Date to Twenty Years

日付: 2024-08-15

---

## 👤 ユーザー
*2024/8/15 14:48:02*

@Published var birthDay: Date = Date() を二〇十年前にしたい

---

## 🤖 アシスタント
*2024/8/15 14:48:06*

`@Published var birthDay: Date = Date()` を二十年前の日付に設定したい場合、次のようにできます。

```swift
@Published var birthDay: Date = Calendar.current.date(byAdding: .year, value: -20, to: Date()) ?? Date()
```

このコードでは、現在の日付から20年前の日付を計算して `birthDay` に設定しています。`Calendar.current.date(byAdding:value:to:)` を使用して、指定された年数を引いた日付を取得します。もし計算に失敗した場合には、デフォルトで現在の日付が使われます。

---
