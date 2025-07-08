# Swift Date型をCodableに変換

Date: 2023-06-06

---

## 👤 User
*2023-06-06 12:07:52*

Swift でDate型で `2023-05-24T23:02:47.730+09:00` のような表記をするにはどうすればいいか Codable に型を変更したいんだ

---

## 🤖 Assistant
*2023-06-06 12:08:34*

Swiftの `Date`型は日付と時間を格納しますが、その形式は通常はISO 8601です。それはつまり、"2023-05-24T23:02:47.730+09:00"のような形式になります。 

ここでいうと、SwiftでISO 8601形式を使いたい場合、 `ISO8601DateFormatter` クラスを使用します。このクラスはSwiftの `DateFormatter` を拡張したもので、ISO 8601の日付と時刻の形式に対応しています。

以下に、CodableとISO8601形式の日付を使用するSwiftのコード例を示します。

```swift
import Foundation

struct MyData: Codable {
    var date: Date
}

let dateFormatter = ISO8601DateFormatter()
dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

let decoder = JSONDecoder()
decoder.dateDecodingStrategy = .custom { decoder in
    let dateString = try decoder.singleValueContainer().decode(String.self)
    if let date = dateFormatter.date(from: dateString) {
        return date
    }
    throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
}

let encoder = JSONEncoder()
encoder.dateEncodingStrategy = .custom { (date, encoder) in
    let dateString = dateFormatter.string(from: date)
    var container = encoder.singleValueContainer()
    try container.encode(dateString)
}

let jsonString = """
{
    "date": "2023-05-24T23:02:47.730+09:00"
}
"""

let data = jsonString.data(using: .utf8)!

do {
    let decodedData = try decoder.decode(MyData.self, from: data)
    print(decodedData.date)  // Date object

    let encodedData = try encoder.encode(decodedData)
    print(String(data: encodedData, encoding: .utf8)!)  // JSON string
} catch {
    print(error)
}
```

上記のコードでは、 `MyData`構造体に `date`プロパティがあり、それは `Date`型です。そして、カスタムのデコーダーとエンコーダーを作成して、ISO 8601形式の日付を `Date`型に変換したり、 `Date`型をISO 8601形式の文字列に変換したりしています。

ただし、上記のコード例は、日付と時刻が厳密にISO 8601形式に従っている場合にのみ機能します。例えば、秒の部分が2桁だけだった場合や、時差が省略されている場合など、ISO 8601の異なるバリエーションを扱うには、追加のロジックが必要になるかもしれません。

---

## 👤 User
*2023-06-06 12:10:38*

MyData に id: Int と name: String を加えて欲しい。また、他の Date型を使うようなStructについても同じように encode decode するときに一般的に使えるようにしてほしい。できれば、extensionとか使って欲しい

---

## 🤖 Assistant
*2023-06-06 12:11:18*

すべての `Codable` 構造体で日付を同じ方法でエンコードとデコードしたい場合、`JSONEncoder`と`JSONDecoder`の拡張を使うと便利です。以下の例では、`MyData`構造体に `id` と `name` フィールドを追加し、`JSONEncoder`と`JSONDecoder`を拡張して、デフォルトでISO8601形式を使用するようにしています。

```swift
import Foundation

struct MyData: Codable {
    var id: Int
    var name: String
    var date: Date
}

extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        decoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = dateFormatter.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
        }
        return decoder
    }()
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        encoder.dateEncodingStrategy = .custom { (date, encoder) in
            let dateString = dateFormatter.string(from: date)
            var container = encoder.singleValueContainer()
            try container.encode(dateString)
        }
        return encoder
    }()
}

let jsonString = """
{
    "id": 1,
    "name": "example",
    "date": "2023-05-24T23:02:47.730+09:00"
}
"""

let data = jsonString.data(using: .utf8)!

do {
    let decodedData = try JSONDecoder.iso8601.decode(MyData.self, from: data)
    print(decodedData.date)  // Date object

    let encodedData = try JSONEncoder.iso8601.encode(decodedData)
    print(String(data: encodedData, encoding: .utf8)!)  // JSON string
} catch {
    print(error)
}
```

このように、`JSONDecoder.iso8601`と`JSONEncoder.iso8601`を使用することで、すべての構造体でISO 8601形式の日付をエンコードとデコードすることが可能になります。この拡張を使用することで、一貫性を持たせてコードを整理することができます。

---

## 👤 User
*2023-06-06 12:12:46*

ISO8601DateFormatter もextension すればいい感じにまとめたりできないの？

---

## 🤖 Assistant
*2023-06-06 12:13:24*

もちろん、それも可能です。`ISO8601DateFormatter`を拡張して、設定されたオプションを持つ共有のインスタンスを作成することができます。

以下にその実装を示します：

```swift
import Foundation

struct MyData: Codable {
    var id: Int
    var name: String
    var date: Date
}

extension ISO8601DateFormatter {
    static let custom: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
}

extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = ISO8601DateFormatter.custom.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
        }
        return decoder
    }()
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { (date, encoder) in
            let dateString = ISO8601DateFormatter.custom.string(from: date)
            var container = encoder.singleValueContainer()
            try container.encode(dateString)
        }
        return encoder
    }()
}

let jsonString = """
{
    "id": 1,
    "name": "example",
    "date": "2023-05-24T23:02:47.730+09:00"
}
"""

let data = jsonString.data(using: .utf8)!

do {
    let decodedData = try JSONDecoder.iso8601.decode(MyData.self, from: data)
    print(decodedData.date)  // Date object

    let encodedData = try JSONEncoder.iso8601.encode(decodedData)
    print(String(data: encodedData, encoding: .utf8)!)  // JSON string
} catch {
    print(error)
}
```

この実装では、`ISO8601DateFormatter.custom`を通じて、日付の文字列化とパースの共通の設定を再利用できます。これは、DRY（Don't Repeat Yourself）原則に従ってコードの重複を減らすのに役立ちます。

---

## 👤 User
*2023-06-06 12:18:10*

ISO8601DateFormatter.custom の .custom をもっと意味がわかるように変えた方がいいと思った。また、MyData 以外のstructでdate型を使っているものを探して欲しい

---

## 🤖 Assistant
*2023-06-06 12:18:50*

`ISO8601DateFormatter.custom`の`.custom`を、より具体的な意味を持つ名前に変更できます。例えば、`.internetDateTimeWithFractionalSeconds`に変更すると、このフォーマッタがISO 8601形式でインターネット日時と小数秒を扱うことが明確になります。

```swift
extension ISO8601DateFormatter {
    static let internetDateTimeWithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
}
```

そして、`JSONDecoder`と`JSONEncoder`の拡張も以下のように更新します。

```swift
extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
        }
        return decoder
    }()
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { (date, encoder) in
            let dateString = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.string(from: date)
            var container = encoder.singleValueContainer()
            try container.encode(dateString)
        }
        return encoder
    }()
}
```

しかし、私は人工知能であり、直接あなたのコードベースにアクセスする能力はありません。そのため、`Date`型を使っている他の構造体を直接探すことはできません。しかし、あなたがそのような構造体を見つけたときには、同じように、`JSONDecoder.iso8601`と`JSONEncoder.iso8601`を使用してエンコードとデコードを行うことが可能です。

---

## 👤 User
*2023-06-06 12:19:22*

どうして、internetDateTime を使う必要があるんだっけ？

---

## 🤖 Assistant
*2023-06-06 12:19:54*

ISO 8601は日付と時間の表現に関する国際規格で、"2023-05-24T23:02:47.730+09:00"のような形式を定義しています。この形式は、年-月-日T時間:分:秒.小数秒+時差 の形式で表現されます。

この規格はインターネット上で日付と時間を交換するための「インターネット日時」を定義しています。そして、Swiftの`ISO8601DateFormatter`は、このインターネット日時形式をサポートしています。`.withInternetDateTime`オプションを使用すると、このインターネット日時形式を扱うことができます。

さらに、`.withFractionalSeconds`オプションを使用すると、秒の小数部を含む日付と時間を扱うことができます。ISO 8601規格では、秒の小数部はオプションであり、必ずしも必要ではありませんが、より正確な時間を表現するためには有用です。

したがって、`.withInternetDateTime`と`.withFractionalSeconds`の両方のオプションを使用することで、"2023-05-24T23:02:47.730+09:00"のような形式の日付と時間を正確に表現し、解析することが可能になります。

---

## 👤 User
*2023-06-06 12:21:17*

なるほど、extension Formatter にしたほうがいいのか、今のままの ISO8601DateFormatter を拡張した方がいいのかどっちがいいの？

---

## 🤖 Assistant
*2023-06-06 12:21:55*

それは主にあなたがどのようにコードを構成したいか、あるいはあなたのプロジェクトの要件やスタイルガイドによります。

`Formatter`を拡張することで、すべてのフォーマッタ（`DateFormatter`、`NumberFormatter`、`ISO8601DateFormatter`等）に対して共通の関数やプロパティを追加することができます。これは、全てのフォーマッタに共通の振る舞いを追加したい場合に有用です。

一方で、特定のフォーマッタ（この場合は`ISO8601DateFormatter`）を拡張することで、そのフォーマッタに固有の関数やプロパティを追加することができます。これは、特定のフォーマッタに固有の振る舞いを追加したい場合に有用です。

つまり、全てのフォーマッタに対する共通の振る舞いを追加する必要があるのか、それとも特定のフォーマッタに特化した振る舞いを追加する必要があるのかによります。

今回の場合、`.withInternetDateTime`と`.withFractionalSeconds`のようなオプションは`ISO8601DateFormatter`に固有のものなので、`ISO8601DateFormatter`を直接拡張する方が適切な場合が多いでしょう。これにより、これらのオプションを適用したフォーマッタを共有することができます。また、この方法ならば他のフォーマッタに影響を与えずに、特定のフォーマッタの振る舞いをカスタマイズすることができます。

---

## 👤 User
*2023-06-06 12:40:07*

サンプルコードで先にMyDataのstructを生成して、それをjsonエンコードして、またdecodeして出力するようなサンプルコードをみせてほしいい

---

## 🤖 Assistant
*2023-06-06 12:40:44*

もちろんです。以下にそのサンプルコードを示します：

```swift
import Foundation

struct MyData: Codable {
    var id: Int
    var name: String
    var date: Date
}

extension ISO8601DateFormatter {
    static let internetDateTimeWithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
}

extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
        }
        return decoder
    }()
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { (date, encoder) in
            let dateString = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.string(from: date)
            var container = encoder.singleValueContainer()
            try container.encode(dateString)
        }
        return encoder
    }()
}

// Create an instance of MyData
let myData = MyData(id: 1, name: "example", date: Date())

do {
    // Encode MyData instance to JSON
    let encodedData = try JSONEncoder.iso8601.encode(myData)
    print(String(data: encodedData, encoding: .utf8)!)  // JSON string

    // Decode the JSON back to MyData
    let decodedData = try JSONDecoder.iso8601.decode(MyData.self, from: encodedData)
    print(decodedData.date)  // Date object
} catch {
    print(error)
}
```

このコードでは、まず`MyData`のインスタンスを作成します。そのインスタンスは、`JSONEncoder.iso8601`を使用してJSONにエンコードされます。そのエンコードされたJSONは、`JSONDecoder.iso8601`を使用して元の`MyData`オブジェクトに戻されます。それぞれの操作の結果はコンソールに出力されます。

---

## 👤 User
*2023-06-06 12:44:24*

以下のようなDrinkを追加して、MyDataをCodable適応して、teeだったら "Tee", "Coffee" のもじれつにへんかんしてほしい

```swift
enum Drink {
    case tee
    case coffee
}

struct MyData: Codable {
    var id: Int
    var name: String
    var date: Date
    var drink: Drink
}

```

---

## 🤖 Assistant
*2023-06-06 12:45:10*

`Codable`はSwiftの列挙型にも適用できますが、その列挙型が`String`や`Int`のような基本的な型である必要があります。しかし、Swiftの列挙型はそれ自体が`Codable`プロトコルに適合していないため、カスタムのエンコードとデコード戦略を実装する必要があります。

`Drink`列挙型を`Codable`に対応させるためには、以下のように`Drink`列挙型を拡張して`Codable`プロトコルに適合させることができます。

```swift
import Foundation

enum Drink: String, Codable {
    case tee = "Tee"
    case coffee = "Coffee"
}

struct MyData: Codable {
    var id: Int
    var name: String
    var date: Date
    var drink: Drink
}

extension ISO8601DateFormatter {
    static let internetDateTimeWithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
}

extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: decoder.singleValueContainer(), debugDescription: "Invalid date: " + dateString)
        }
        return decoder
    }()
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { (date, encoder) in
            let dateString = ISO8601DateFormatter.internetDateTimeWithFractionalSeconds.string(from: date)
            var container = encoder.singleValueContainer()
            try container.encode(dateString)
        }
        return encoder
    }()
}

// Create an instance of MyData
let myData = MyData(id: 1, name: "example", date: Date(), drink: .coffee)

do {
    // Encode MyData instance to JSON
    let encodedData = try JSONEncoder.iso8601.encode(myData)
    print(String(data: encodedData, encoding: .utf8)!)  // JSON string

    // Decode the JSON back to MyData
    let decodedData = try JSONDecoder.iso8601.decode(MyData.self, from: encodedData)
    print(decodedData.date)  // Date object
    print(decodedData.drink.rawValue)  // Drink name
} catch {
    print(error)
}
```

この例では、列挙型`Drink`に`Codable`を適用し、"tee"と"coffee"の文字列をそれぞれ"Tee"と"Coffee"にマッピングしています。

---

## 👤 User
*2023-06-06 12:46:06*

Drink ni

---
