# Override UserDefaultsCodable methods.

Date: 2023-06-18

---

## 👤 User
*2023-06-19 00:20:32*

以下をオーバーライドして利用するような記述例
public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

public extension UserDefaultsCodable {
    static var decoder: JSONDecoder {
        JSONDecoder()
    }

    static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

---

## 🤖 Assistant
*2023-06-19 00:21:02*

あなたが望んでいるように、`UserDefaultsCodable` プロトコルを実装し、`encoder` および `decoder` メソッドをオーバーライドする具体的なクラスの例を以下に示します。

```swift
struct CustomDateFormatter {
    static let formatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter
    }()
}

struct User: UserDefaultsCodable {
    let id: String
    let name: String
    let birthDate: Date
}

extension User {
    static var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(CustomDateFormatter.formatter)
        return decoder
    }

    static var encoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .formatted(CustomDateFormatter.formatter)
        return encoder
    }
}
```

ここでは、`User`という構造体が`UserDefaultsCodable`プロトコルを採用しています。そして、デフォルトの `encoder`と `decoder`メソッドをオーバーライドして、日付のエンコードとデコードの戦略をカスタマイズしています。この例では、特定の日付フォーマット（ここでは "yyyy-MM-dd"）を使用するようにエンコーダとデコーダを設定しています。

この設定により、Userの日付フィールドはカスタムフォーマットでエンコードおよびデコードされます。

---

## 👤 User
*2023-06-19 00:21:27*

overrideの修飾子はいらないの？

---

## 🤖 Assistant
*2023-06-19 00:22:10*

Swift言語では、メソッドやプロパティをオーバーライドする際に`override`キーワードを使用しますが、それは親クラスのメソッドやプロパティを子クラスで上書きする場合のみです。

しかし、このケースでは、プロトコルのデフォルト実装を提供しています。そして、このデフォルト実装を特定の型（ここでは`User`型）でカスタマイズ（実質的に"上書き"）しています。プロトコルのメソッドやプロパティのデフォルト実装を提供し、それを型でカスタマイズする場合、`override`キーワードは不要です。したがって、このコードでは`override`キーワードは必要ありません。

以下のコードは正しいSwiftのコードです：

```swift
public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

public extension UserDefaultsCodable {
    static var decoder: JSONDecoder {
        JSONDecoder()
    }

    static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

struct User: UserDefaultsCodable {
    let id: String
    let name: String
    let birthDate: Date
}

extension User {
    static var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(CustomDateFormatter.formatter)
        return decoder
    }

    static var encoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .formatted(CustomDateFormatter.formatter)
        return encoder
    }
}
```

これにより、`User`型は`UserDefaultsCodable`プロトコルのデフォルト実装を提供する`encoder`と`decoder`をカスタマイズしています。この実装では`override`キーワードは不要です。

---
