# Convert Double to JST

日付: 2023-06-08

---

## 👤 ユーザー
*2023/06/08 17:36:37*

以下をJSTに変えたい

public extension Double {
    // ex) 1656489212345 -&gt; 2022-06-29T07:53:32.345Z
    var asDateFromMilliseconds: Date {
        Date(timeIntervalSince1970: TimeInterval(self) / 1000)
    }
}

---

## 🤖 アシスタント
*2023/06/08 17:37:03*

あなたがJST (日本標準時) で日付を取得したいということを理解しました。以下にコードを示します。

```swift
import Foundation

public extension Double {
    var asDateFromMilliseconds: Date {
        // Convert to seconds from milliseconds
        let date = Date(timeIntervalSince1970: TimeInterval(self) / 1000)
        
        // Get current user's calendar
        var calendar = Calendar.current
        // Set the calendar timezone to JST
        calendar.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        
        // Get the components of the date
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute, .second, .nanosecond], from: date)
        
        // Return the date in JST
        return calendar.date(from: components)!
    }
}
```

これにより、指定されたDoubleの値を日本標準時の日付に変換することができます。ただし、このコードは元のDateオブジェクトがUTCであることを前提としています。

---

## 👤 ユーザー
*2023/06/08 17:37:20*

端末の設定のタイムゾーンを使って欲しいだけです

---

## 🤖 アシスタント
*2023/06/08 17:37:48*

すみません、誤解が生じました。ユーザーの端末の設定に基づいたタイムゾーンを使用する場合、Swiftにはそのためのビルトインのサポートがあります。以下がそのためのコードです：

```swift
public extension Double {
    // ex) 1656489212345 -> 2022-06-29T07:53:32.345Z in user's local time
    var asDateFromMilliseconds: Date {
        Date(timeIntervalSince1970: TimeInterval(self) / 1000)
    }
}
```

上記のコードは、時間を端末の現在のタイムゾーンに基づいて表示します。言い換えれば、ユーザーが端末の設定でタイムゾーンを変更すれば、このコードはそれに応じて自動的に調整されます。

---

## 👤 ユーザー
*2023/06/08 17:39:28*

ごめんこっちだった、

public extension Date {
    // "2023-06-07T14:46:01.455Z"
    var asISO8601WithFractionalSeconds: String {
        ISO8601Format(Date.ISO8601FormatStyle(includingFractionalSeconds: true))
    }
}

---

## 🤖 アシスタント
*2023/06/08 17:39:52*

あなたが端末の設定に基づいたタイムゾーンを使用してISO8601形式の日付文字列を取得したいということを理解しました。以下のコードはそのためのものです：

```swift
import Foundation

public extension Date {
    // "2023-06-07T14:46:01.455Z" in user's local time
    var asISO8601WithFractionalSeconds: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = TimeZone.current
        return formatter.string(from: self)
    }
}
```

上記のコードは端末のタイムゾーンを考慮して、ISO8601形式の日付文字列を返します。例えば、あなたが日本にいる場合、このコードはJSTに基づいて日付を返します。

---

## 👤 ユーザー
*2023/06/08 17:40:19*

ISO8601DateFormatter() のフォーマッターはアプリで一つに使いまわしたいのだけれどもどうすればいい

---

## 🤖 アシスタント
*2023/06/08 17:41:09*

`ISO8601DateFormatter`はスレッドセーフなので、グローバル変数として一つだけインスタンスを作成し、それを使い回すことができます。以下にそのためのコードを示します：

```swift
import Foundation

let iso8601FormatterWithFractionalSeconds: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    formatter.timeZone = TimeZone.current
    return formatter
}()

public extension Date {
    // "2023-06-07T14:46:01.455Z" in user's local time
    var asISO8601WithFractionalSeconds: String {
        iso8601FormatterWithFractionalSeconds.string(from: self)
    }
}
```

ここで、`iso8601FormatterWithFractionalSeconds`はグローバルスコープに定義されています。そのため、この`Date`拡張以外の場所でも同じフォーマッタを使用できます。

ただし、この方法で`ISO8601DateFormatter`を使い回す場合、`TimeZone.current`が設定されたときのタイムゾーンがその後も使われ続ける点に注意が必要です。ユーザーが端末のタイムゾーン設定を変更した場合でも、このフォーマッタのタイムゾーンは変わらないためです。タイムゾーンを動的に更新する必要がある場合は、フォーマッタの生成を適切なタイミングで再度行うなどの対策が必要です。

---

## 👤 ユーザー
*2023/06/08 17:41:40*

ちなみに、extensionとかで記述したほうがいいのかな❓

---

## 🤖 アシスタント
*2023/06/08 17:42:35*

Swiftにおける拡張（extension）は、既存のクラス、構造体、列挙体、またはプロトコル型に新しい機能を追加するための強力な機能です。しかし、グローバルな`ISO8601DateFormatter`インスタンスを作成するのは拡張（extension）よりもグローバルスコープで行うのが適切かと思われます。

しかしながら、フォーマッタを特定の目的で一貫して使用する場合、それを管理するための独自の構造体またはクラスを作成するという選択肢もあります。それによってコードの整理が行いやすくなり、特定の目的に合わせた追加のカスタマイズや機能を提供することが可能になります。以下に例を示します：

```swift
import Foundation

struct DateFormatterManager {
    static let iso8601WithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}

public extension Date {
    // "2023-06-07T14:46:01.455Z" in user's local time
    var asISO8601WithFractionalSeconds: String {
        DateFormatterManager.iso8601WithFractionalSeconds.string(from: self)
    }
}
```

このように、`DateFormatterManager`という新しい構造体を作成し、その中に`ISO8601DateFormatter`のインスタンスを保持することで、特定のフォーマットの日付文字列を生成するための一貫性を保つことができます。

---

## 👤 ユーザー
*2023/06/08 17:44:24*

以下のようにしているのだけど、public extension Formatter は不要かな？

```swift
struct DateFormatterManager {
    static let iso8601WithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}

public extension Formatter {
    static let iso8601withFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = .current
        return formatter
    }()
}

public extension JSONEncoder.DateEncodingStrategy {
    static let iso8601withFractionalSeconds = custom { date, encoder in
        var container = encoder.singleValueContainer()
        let dateString = Formatter.iso8601withFractionalSeconds.string(from: date)
        try container.encode(dateString)
    }
}

public extension JSONDecoder.DateDecodingStrategy {
    static let iso8601withFractionalSeconds = custom { decoder in
        let container = try decoder.singleValueContainer()
        let dateString = try container.decode(String.self)
        guard let date = Formatter.iso8601withFractionalSeconds.date(from: dateString) else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date: \(dateString)")
        }
        return date
    }
}
```

---

## 🤖 アシスタント
*2023/06/08 17:45:08*

あなたが提供したコードでは、`DateFormatterManager`と`Formatter`の両方で同じISO8601フォーマッタを定義しています。もし`DateFormatterManager`を使うなら、`Formatter`の拡張で`iso8601withFractionalSeconds`を再定義する必要はありません。したがって、以下のように修正できます：

```swift
struct DateFormatterManager {
    static let iso8601WithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}

public extension JSONEncoder.DateEncodingStrategy {
    static let iso8601withFractionalSeconds = custom { date, encoder in
        var container = encoder.singleValueContainer()
        let dateString = DateFormatterManager.iso8601WithFractionalSeconds.string(from: date)
        try container.encode(dateString)
    }
}

public extension JSONDecoder.DateDecodingStrategy {
    static let iso8601withFractionalSeconds = custom { decoder in
        let container = try decoder.singleValueContainer()
        let dateString = try container.decode(String.self)
        guard let date = DateFormatterManager.iso8601WithFractionalSeconds.date(from: dateString) else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date: \(dateString)")
        }
        return date
    }
}
```

これで`DateFormatterManager`の中で定義したフォーマッターが全体で共有され、JSONのエンコードとデコードでも利用されます。

---
