# Swift JSONデコード

Date: 2023-07-11

---

## 👤 User
*2023-07-12 08:49:29*

Swiftで以下のようなjsonが来て、

{
  "type": "integer"
}

{
  "type": "integer",
  "le": 10
}

{
  "type": "text"
}

{
  "type": "text",
  "max_length": 300
}

{
  "type": "integer",
  "enum": [1, 2, 3, 4, 5]
}

{
  "type": "array",
  "items": {
    "type": "text",
    "enum": ["ラーメン", "カツ丼", "焼肉"]
  },
  "max_length": 2
}

---

## 🤖 Assistant
*2023-07-12 08:50:01*

SwiftでこれらのJSONを扱うために、Codableというプロトコルを使用します。このプロトコルは、JSONのような形式からSwiftのデータ構造への変換（デコーディング）とその逆の変換（エンコーディング）を可能にします。

まず、それぞれのJSONを表現するためのSwiftのデータ構造を定義します。

```swift
struct IntegerType: Codable {
    let type: String
    let le: Int?
    let enum: [Int]?
}

struct TextType: Codable {
    let type: String
    let maxLength: Int?
    let enum: [String]?
}

struct ArrayType: Codable {
    let type: String
    let items: TextType
    let maxLength: Int?
}
```

これらのデータ構造を使って、JSONをSwiftのデータ構造にデコードするためのコードは以下のようになります。

```swift
let jsonData = /* ここにJSONデータ */
let decoder = JSONDecoder()

do {
    if jsonData.contains("\"type\": \"integer\"") {
        let decodedData = try decoder.decode(IntegerType.self, from: jsonData)
        // ここでデコードされたデータを扱う
    } else if jsonData.contains("\"type\": \"text\"") {
        let decodedData = try decoder.decode(TextType.self, from: jsonData)
        // ここでデコードされたデータを扱う
    } else if jsonData.contains("\"type\": \"array\"") {
        let decodedData = try decoder.decode(ArrayType.self, from: jsonData)
        // ここでデコードされたデータを扱う
    }
} catch {
    print("Error decoding JSON: \(error)")
}
```

上記のコードは、JSONの" type "キーの値に基づいて、適切なSwiftのデータ構造を使用してデータをデコードします。

ただし、このコードは "type" の値が予期された値であることを前提としています。それ以外の値が "type" に設定されている場合、デコードは失敗します。また、このコードは各JSONがそれぞれ異なるデータ構造を持つと想定しています。JSONの形式が異なる場合、新たなSwiftのデータ構造を定義する必要があります。

---
