# Swift JSONデータの表現

Date: 2023-06-26

---

## 👤 User
*2023-06-26 19:49:59*

Swiftで表して欲しい

{
    "title": "Feature list",
    "type": "array",
    "prefixItems": [
        {
            "title": "Feature A",
            "properties": {
                "enabled": {
                    "$ref": "#/$defs/enabledToggle",
                    "default": true
                }
            }
        },
        {
            "title": "Feature B",
            "properties": {
                "enabled": {
                    "description": "If set to null, Feature B
                                    inherits the enabled
                                    value from Feature A",
                    "$ref": "#/$defs/enabledToggle"
                }
            }
        }
    ],
    "$defs": {
        "enabledToggle": {
            "title": "Enabled",
            "description": "Whether the feature is enabled (true),
                            disabled (false), or under
                            automatic control (null)",
            "type": ["boolean", "null"],
            "default": null
        }
    }
}

---

## 🤖 Assistant
*2023-06-26 19:50:56*

このJSONデータは、複数のフィーチャの状態を持つデータ構造を定義しています。これをSwiftで表現すると以下のようになります。

```swift
import Foundation

// 型 'EnabledToggle' を定義します
enum EnabledToggle: Codable {
    case boolean(Bool)
    case null

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let x = try? container.decode(Bool.self) {
            self = .boolean(x)
            return
        }
        if container.decodeNil() {
            self = .null
            return
        }
        throw DecodingError.typeMismatch(EnabledToggle.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for EnabledToggle"))
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .boolean(let x):
            try container.encode(x)
        case .null:
            try container.encodeNil()
        }
    }
}

// 型 'Property' を定義します
struct Property: Codable {
    let enabled: EnabledToggle
}

// 型 'Feature' を定義します
struct Feature: Codable {
    let title: String
    let properties: Property
}

// 'Feature list' を定義します
struct FeatureList: Codable {
    let title: String
    let type: String
    let prefixItems: [Feature]
}

// デフォルト値を与えるための拡張を定義します
extension Property {
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let enabled: EnabledToggle = try container.decodeIfPresent(EnabledToggle.self, forKey: .enabled) ?? .null
        self.init(enabled: enabled)
    }
}

extension Feature {
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let title: String = try container.decode(String.self, forKey: .title)
        let properties: Property = try container.decodeIfPresent(Property.self, forKey: .properties) ?? Property(enabled: .boolean(true))
        self.init(title: title, properties: properties)
    }
}
```

ここでは、`EnabledToggle`型を作成して、JSONスキーマで指定された "boolean"、"null" の型を表現しています。次に、`Property`と`Feature`を定義し、各フィーチャのプロパティを表現します。最後に、`FeatureList`を定義して、フィーチャの配列を含めます。

この実装はデコーダが設定されているため、次のようにしてJSONデータをデコードできます：

```swift
let decoder = JSONDecoder()
let featureList = try decoder.decode(FeatureList.self, from: jsonData)
```

ただし、上記のSwiftコードはあくまで一例で、必要に応じて適宜調整を行うことが可能です。

---
