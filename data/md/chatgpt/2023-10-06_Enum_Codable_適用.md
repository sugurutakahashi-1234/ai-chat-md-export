# Enum Codable 適用

日付: 2023-10-06

---

## 👤 ユーザー
*2023/10/06 16:06:08*

以下の時、VideoExportQualityPresetにUserDefaultsCodableを適応させてほしい

public enum VideoExportQualityPreset {
    case low
    case medium
    case high

    public var name: String {
        switch self {
        case .low:
            AVAssetExportPresetLowQuality
        case .medium:
            AVAssetExportPresetMediumQuality
        case .high:
            AVAssetExportPresetHighestQuality
        }
    }
}

public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

/// 必要に応じて、任意の decoder encoder を設定する場合は protocol の extension によるデフォルト実装を override して、使用してください
public extension UserDefaultsCodable {
    static var decoder: JSONDecoder {
        JSONDecoder()
    }

    static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

---

## 🤖 アシスタント
*2023/10/06 16:06:34*

`VideoExportQualityPreset` enum を `UserDefaultsCodable` に適応させるには、まずその enum が `Codable` である必要があります。enum の値に関連する情報がない場合、Swift は自動的にこの enum を `Codable` にすることができます。しかし、カスタムの encoding/decoding 挙動が必要な場合は、明示的に `Codable` のメソッドを実装する必要があります。

以下の実装では、`VideoExportQualityPreset` を `String` 値として encode/decode します：

```swift
public enum VideoExportQualityPreset: String, UserDefaultsCodable {
    case low
    case medium
    case high

    public var name: String {
        switch self {
        case .low:
            return AVAssetExportPresetLowQuality
        case .medium:
            return AVAssetExportPresetMediumQuality
        case .high:
            return AVAssetExportPresetHighestQuality
        }
    }

    // 既存の UserDefaultsCodable プロトコルの実装をそのまま使用
}

// 以下の protocol とその extension は変更なしです
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
```

この実装により、`VideoExportQualityPreset` は JSON にエンコードされるときに、その raw `String` 値（"low"、"medium"、"high"）に変換され、デコード時にはその raw `String` 値から enum の値に変換されます。

---

## 👤 ユーザー
*2023/10/06 16:07:19*

extension VideoExportQualityPreset: UserDefaultsCodable としたいけどだめなのか？

---

## 🤖 アシスタント
*2023/10/06 16:07:41*

もちろん、それも可能です。`VideoExportQualityPreset` enum に直接 `UserDefaultsCodable` を採用するのではなく、extension を使用して追加することができます。

そのため、以下のように`VideoExportQualityPreset`に対して`UserDefaultsCodable`を適応させることができます：

```swift
public enum VideoExportQualityPreset {
    case low
    case medium
    case high

    public var name: String {
        switch self {
        case .low:
            return AVAssetExportPresetLowQuality
        case .medium:
            return AVAssetExportPresetMediumQuality
        case .high:
            return AVAssetExportPresetHighestQuality
        }
    }
}

extension VideoExportQualityPreset: UserDefaultsCodable {}

// 注意: UserDefaultsCodableがCodableを要求しているため、実際にこのenumがCodableであることをSwiftに示す必要があります。
extension VideoExportQualityPreset: Codable {
    // この場合、特にカスタムのencode/decode処理が必要ないので、このextensionは空のままでも問題ありません。
    // Swiftはこのenumを自動的にCodableに適合させます。
}

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
```

この方法で、enumの定義とCodableやUserDefaultsCodableの適応を分離することができます。

---

## 👤 ユーザー
*2023/10/06 16:07:56*

以下のようなエラーになってしまった

Extension outside of file declaring enum 'VideoExportQualityPreset' prevents automatic synthesis of 'encode(to:)' for protocol 'Encodable'

---

## 🤖 アシスタント
*2023/10/06 16:08:37*

このエラーは、Swiftの自動合成の機能が、enumやstructの定義とは別の場所での`Codable`の採用の場合には働かないことを示しています。これは、extensionで`Codable`を採用した場合、Swiftが自動的にエンコードとデコードの方法を生成できないためです。

解決策としては、enumの定義内で直接`Codable`を採用するか、または`Encodable`と`Decodable`のメソッドを手動で実装するかのどちらかです。

以下は、enumの定義内で`Codable`を採用する方法です：

```swift
public enum VideoExportQualityPreset: UserDefaultsCodable {
    case low
    case medium
    case high

    public var name: String {
        switch self {
        case .low:
            return AVAssetExportPresetLowQuality
        case .medium:
            return AVAssetExportPresetMediumQuality
        case .high:
            return AVAssetExportPresetHighestQuality
        }
    }
}

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
```

もし何らかの理由でenumの定義とは別の場所で`Codable`を採用したい場合、次のように`Encodable`と`Decodable`のメソッドを手動で実装することができます：

```swift
public enum VideoExportQualityPreset {
    case low
    case medium
    case high

    public var name: String {
        switch self {
        case .low:
            return AVAssetExportPresetLowQuality
        case .medium:
            return AVAssetExportPresetMediumQuality
        case .high:
            return AVAssetExportPresetHighestQuality
        }
    }
}

extension VideoExportQualityPreset: UserDefaultsCodable {}

extension VideoExportQualityPreset: Codable {
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let stringValue = try container.decode(String.self)
        
        switch stringValue {
        case "low":
            self = .low
        case "medium":
            self = .medium
        case "high":
            self = .high
        default:
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid value")
        }
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .low:
            try container.encode("low")
        case .medium:
            try container.encode("medium")
        case .high:
            try container.encode("high")
        }
    }
}
```

上記の方法で、エラーを解決することができます。

---

## 👤 ユーザー
*2023/10/06 16:08:39*

Swiftの自動合成の機能が、enumやstructの定義とは別の場所でのCodableの採用の場合には働かないことを示しています。

これはなぜ？

---

## 🤖 アシスタント
*2023/10/06 16:09:07*

Swiftの`Codable`の自動合成は、型の内部の情報に基づいて動作します。具体的には、型が持っているプロパティや値のリストに基づいて、その型のためのエンコードとデコードのロジックが自動的に生成されます。この自動合成のメカニズムは非常に強力であり、多くのケースで手動での`Codable`の実装を不要にしています。

しかし、この自動合成の機能は以下の状況で働くことを前提としています：

1. 型が`Codable`、`Encodable`、または`Decodable`を直接採用していること。
2. その型の定義内で採用していること。

これは設計上の選択であり、型の定義の外部で`Codable`を採用した場合、型の内部の情報にアクセスすることが難しくなる可能性があるからです。具体的には、非公開のプロパティや内部のデータ構造にアクセスするのが難しい、または不可能になることが考えられます。

また、型の定義とは別の場所で`Codable`を採用すると、その型のエンコードやデコードのロジックが分散してしまい、読み手にとってコードの理解が難しくなる可能性があります。

このような理由から、Swiftのコンパイラは型の定義内で`Codable`を採用することを前提として自動合成の機能を提供しています。

---
