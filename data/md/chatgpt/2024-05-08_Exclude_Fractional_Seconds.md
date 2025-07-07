# Exclude Fractional Seconds

日付: 2024-05-08

---

## 👤 ユーザー
*2024/5/8 19:44:14*

以下だとFractionalSecondsも含むようになってしまうので含まない形式で出力するようにしたい。


public extension ISO8601DateFormatter {
    static let sharedWithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = \[.withInternetDateTime, .withFractionalSeconds\]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}

---

## 🤖 アシスタント
*2024/5/8 19:44:35*

以下のコードは、`ISO8601DateFormatter`を使用して日付をフォーマットする際に、秒の小数部（Fractional Seconds）を含まないように設定する方法です。`.withFractionalSeconds` オプションを除去しています。

```swift
public extension ISO8601DateFormatter {
    static let shared: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}
```

このコードでは、`ISO8601DateFormatter` の `formatOptions` に `.withInternetDateTime` のみを設定しています。これにより、UTC形式の日付と時刻を出力しますが、秒の小数部は含まれません。また、`TimeZone.current` を使用して、フォーマッターのタイムゾーンを現在のシステムのタイムゾーンに設定しています。

---
