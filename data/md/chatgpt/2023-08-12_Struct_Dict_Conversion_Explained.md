# Struct-Dict Conversion Explained

Date: 2023-08-12

---

## 👤 User
*2023-08-12 22:28:53*

zennを使って記事を書いているのだけれども解説が少ないので追記してほしい

---
title: "[Swift] JSONSerialization を使って辞書型に変換すると数値やBool値の型が勝手に変更されてしまう件"
emoji: "🕊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Swift"]
published: true
---

環境: Xcode 14.2

## Struct → Dictionary の変換の記述

```swift
extension Encodable {
    func asDictionary(keyEncodingStrategy: JSONEncoder.KeyEncodingStrategy) throws -> [String: Any] {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = keyEncodingStrategy

        do {
            let data = try encoder.encode(self)
            guard let jsonObject = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                throw EncodingError.invalidValue(self, EncodingError.Context(codingPath: [], debugDescription: "Couldn't convert to [String: Any] dictionary"))
            }
            return jsonObject
        } catch {
            throw error
        }
    }
}
```

## Dictionary -&gt; Struct の変換の記述

```swift
extension Decodable {
    init(from dictionary: [String: Any], keyDecodingStrategy: JSONDecoder.KeyDecodingStrategy) throws {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = keyDecodingStrategy

        let data = try JSONSerialization.data(withJSONObject: dictionary, options: [])
        let decodedObject = try decoder.decode(Self.self, from: data)
        self = decodedObject
    }
}
```

## サンプルの定義

```swift
struct Sample: Codable {
    let sampleInt: Int
    let sampleString: String
    let sampleDouble: Double
    let sampleFloat: Float
    let sampleBool: Bool
    let sampleDate: Date
    let sampleStruct: SampleStruct
    let sampleEnum: SampleEnum
}

struct SampleStruct: Codable {
    let hogeProperty: Int
}

enum SampleEnum: Codable {
    case hogeCase
}
```

## Struct -&gt; Dictionary の変換

```swift
let sample = Sample(sampleInt: 1, sampleString: "a", sampleDouble: 2.0, sampleFloat: 3.0, sampleBool: true, sampleDate: Date(), sampleStruct: SampleStruct(hogeProperty: 4), sampleEnum: .hogeCase)

do {
    let dict1 = try sample.asDictionary(keyEncodingStrategy: .useDefaultKeys)
    let dict2 = try sample.asDictionary(keyEncodingStrategy: .convertToSnakeCase)
    print(dict1)
    print(dict2)
} catch {
    print("\(error)")
}
```

## .useDefaultKeys で変換した Dictionary の出力

```swift:dict1
[
    "sampleInt": 1,
    "sampleString": "a",
    "sampleDouble": 2, // Double(2.0) が勝手に Int(2) に丸め込まれる
    "sampleFloat": 3, // Double(3.0) が勝手に Int(3) に丸め込まれる
    "sampleBool": 1, // Bool(true) が勝手に Int(1) に丸め込まれる
    "sampleDate": 713534174.328627,
    "sampleStruct": [
        "hogeProperty": 4
    ],
    "sampleEnum": [
        "hogeCase": {}
    ]
]
```

## .convertToSnakeCase で変換した Dictionary の出力

```swift:dict2
[
    "sample_int": 1,
    "sample_string": "a",
    "sample_double": 2, // Double(2.0) が勝手に Int(2) に丸め込まれる
    "sample_float": 3, // Double(3.0) が勝手に Int(3) に丸め込まれる
    "sample_bool": 1, // Bool(true) が勝手に Int(1) に丸め込まれる
    "sample_date": 713534174.328627,
    "sample_struct": [
        "hoge_property": 4
    ],
    "sample_enum": [
        "hoge_case": {}
    ]
]
```

## Dictionary -&gt; Struct の変換

```swift
let sample = Sample(sampleInt: 1, sampleString: "a", sampleDouble: 2.0, sampleFloat: 3.0, sampleBool: true, sampleDate: Date(), sampleStruct: SampleStruct(hogeProperty: 4), sampleEnum: .hogeCase)

do {
    let dict1 = try sample.asDictionary(keyEncodingStrategy: .useDefaultKeys)
    let dict2 = try sample.asDictionary(keyEncodingStrategy: .convertToSnakeCase)

    // 以下はどちらも同じ出力になる（ Encodable & Decodable の Struct -> Dictionary -> Struct の変換がうまくいっている）
    print(try Sample(from: dict1, keyDecodingStrategy: .useDefaultKeys))
    print(try Sample(from: dict2, keyDecodingStrategy: .convertFromSnakeCase))
} catch {
    print("\(error)")
}
```

## Dictionary -&gt; Struct の変換（エラーの検証）

```swift
let sample = Sample(sampleInt: 1, sampleString: "a", sampleDouble: 2.0, sampleFloat: 3.0, sampleBool: true, sampleDate: Date(), sampleStruct: SampleStruct(hogeProperty: 4), sampleEnum: .hogeCase)

do {
    let dict1 = try sample.asDictionary(keyEncodingStrategy: .useDefaultKeys)
    let dict2 = try sample.asDictionary(keyEncodingStrategy: .convertToSnakeCase)

    // わざと、asDictionary で指定した KeyDecodingStrategy と異なる値を指定してみる
    print(try Sample(from: dict1, keyDecodingStrategy: .convertFromSnakeCase)) // ← なぜかエラーにならない
    print(try Sample(from: dict2, keyDecodingStrategy: .useDefaultKeys)) // ← エラーになる
} catch {
    print("\(error)")
}
```

## Codable や JSONSerialization を使わないで Dictionary にする方法

```swift
public enum CaseFormat {
    case original
    case snakeCase
}

public protocol ConvertibleToDictionary {
    func asDictionary(caseFormat: CaseFormat) -> [String: Any]
}

public extension ConvertibleToDictionary {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

            switch caseFormat {
            case .original:
                dictionary[keyName] = child.value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = child.value
            }
        }

        return dictionary
    }
}

extension String {
    var toSnakeCase: String {
        let snakeCased = unicodeScalars.reduce("") { result, scalar in
            if CharacterSet.uppercaseLetters.contains(scalar) {
                return "\(result)_\(Character(scalar))"
            } else {
                return result + String(scalar)
            }
        }.lowercased()

        if snakeCased.hasPrefix("_") {
            return String(snakeCased.dropFirst())
        } else {
            return snakeCased
        }
    }
}

let sample = Sample(sampleInt: 1, sampleString: "a", sampleDouble: 2.0, sampleFloat: 3.0, sampleBool: true, sampleDate: Date(), sampleStruct: SampleStruct(hogeProperty: 4), sampleEnum: .hogeCase)

let dict1 = sample.asDictionary(caseFormat: .original)
let dict2 = sample.asDictionary(caseFormat: .snakeCase)

print(dict1)
print(dict2)
```

## .original で変換した Dictionary

```swift:dict1
[
    "sampleInt": 1,
    "sampleString": "a",
    "sampleDouble": 2.0,
    "sampleFloat": 3.0,
    "sampleBool": true,
    "sampleDate": "2023-08-12 12:48:45 +0000",
    "sampleStruct": "SampleStruct(hogeProperty: 4)",
    "sampleEnum": "SampleEnum.hogeCase"
]
```

## .snakeCase で変換した Dictionary

```swift:dict2
[
    "sample_int": 1,
    "sample_string": "a",
    "sample_double": 2.0,
    "sample_float": 3.0,
    "sample_bool": true,
    "sample_date": "2023-08-12 12:48:45 +0000",
    "sample_struct": "SampleStruct(hogeProperty: 4)",
    "sample_enum": "SampleEnum.hogeCase"
]
```

## そもそもなぜこのようなことをやりたいのか？

Protocol Buffers の `google.protobuf.Value` で扱える型 は `NullValue`, `double`, `string`, `bool`, `Struct`, `ListValue` のみで、`map<string, google.protobuf.Value>` に Swift の Struct を辞書型に変換するときに使うことが目的でした。

- https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/struct.proto#L62

そして、以下のような処理を書く際に `JSONSerialization` を使うと型情報が失われているので、思ったような変換をしてくれないということになります。

```swift
import Foundation
import SwiftProtobuf

var toProtoBufValueDictionary: [String: Google_Protobuf_Value] {
    asDictionary(caseFormat: .snakeCase).mapValues { value in
        var protoValue = Google_Protobuf_Value()
        switch value {
        case let intValue as Int:
            protoValue.numberValue = Double(intValue)
        case let doubleValue as Double:
            protoValue.numberValue = doubleValue
        case let floatValue as Float:
            protoValue.numberValue = Double(floatValue)
        case let stringValue as String:
            protoValue.stringValue = stringValue
        case let dateValue as Date:
            protoValue.stringValue = ISO8601DateFormatter.sharedWithFractionalSeconds.string(from: dateValue)
        case let boolValue as Bool:
            protoValue.boolValue = boolValue
        default:
            assertionFailure("Unexpected type encountered while converting to Google_Protobuf_Value")
        }
        return protoValue
    }
}

extension ISO8601DateFormatter {
    static let sharedWithFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}
```

---

## 🤖 Assistant
*2023-08-12 22:29:49*

Swiftのコードとそれに関する説明を提供していただきましたが、確かにこのままでは初見の方は背景や具体的な問題点、そして解決方法の理解が難しいかと思います。

以下に、現在の内容を補足する形で追加の解説を行います。

---

## 問題点

SwiftでJSONを扱う場合、`Codable`プロトコルや`JSONSerialization`クラスを利用するのが一般的です。この記事では、`Codable`を使ったStructとDictionaryの相互変換に関する実装を紹介しています。しかし、この変換処理において、以下の問題点が発生します：

1. `JSONSerialization`による変換時、浮動小数点数やBool値の型情報が失われ、整数や別の型として認識されてしまう。
2. `KeyDecodingStrategy`が正しく設定されていない場合、予期せぬエラーが生じる。

## 原因と解決策

1. **型情報の喪失**  
   `JSONSerialization`は、JSONの形式に従ってデータを変換します。そのため、`2.0`などの浮動小数点数が`2`として整数で認識されたり、`true`が`1`として認識されることがあります。  
   **解決策**: `Codable`や`JSONSerialization`を使用せず、独自の変換方法を用いることで、型情報を保持したまま変換を行うことができます。この記事の後半で紹介されている`ConvertibleToDictionary`プロトコルを使用する方法がその一例です。

2. **`KeyDecodingStrategy`の設定ミス**  
   Structのキー名と、変換後のDictionaryのキー名との対応関係が正しくないと、変換時にエラーが発生します。  
   **解決策**: キー名の対応関係を正確に指定することで、エラーを防ぐことができます。特に、`.convertToSnakeCase`や`.convertFromSnakeCase`を使用する場合は、キー名の形式を注意深く確認する必要があります。

## Protocol Buffersとの組み合わせ

最後に、この変換処理がProtocol Buffersの`google.protobuf.Value`との連携のために必要であると説明しています。`google.protobuf.Value`は、限定された型しかサポートしていないため、SwiftのStructをこの形式で扱うためには、型情報を正確に保持しながら変換する必要があります。

---

上記の内容を元に、記事に追記する形で詳細な解説を行うことで、読者により理解しやすい内容となるでしょう。

---

## 👤 User
*2023-08-12 22:30:58*

マークダウンでコピペできるように記載して欲しい

---

## 🤖 Assistant
*2023-08-12 22:32:01*

了解しました！以下に詳細な解説と共にマークダウン形式で記述します。

---

## SwiftでのJSONSerializationと型変更の問題

Swiftで`JSONSerialization`を使って`Struct`を`Dictionary`に変換すると、型情報が完全に保持されず、一部のデータの型が変更されてしまう問題があります。これは`JSONSerialization`の仕様によるもので、特に数値やBool値に関して型変更が発生することがあります。

### 問題の原因

Swiftの`Double`や`Float`の値が整数の場合、`JSONSerialization`はこれを`Int`として認識してしまいます。例えば、`Double(2.0)`や`Float(3.0)`はそれぞれ`Int(2)`や`Int(3)`に変換されます。同様に、`Bool`の`true`や`false`はそれぞれ`Int(1)`や`Int(0)`に変換されることがあります。

### なぜこれが問題なのか？

`JSONSerialization`のこの振る舞いは、データの正確な型情報を維持することが求められる場面では問題となります。例えば、Protocol Buffersの`google.protobuf.Value`のような特定の型を持つデータ構造に変換する際には、正確な型情報が必要です。

### 解決策

Swiftの`Mirror`を使用することで、オブジェクトの型情報を保持したまま`Dictionary`に変換することができます。この方法では、データの型が`JSONSerialization`によって変更されることはありません。

以下は、`Mirror`を使用して`Struct`を`Dictionary`に変換するコードの一例です。

```swift
public enum CaseFormat {
    case original
    case snakeCase
}

public protocol ConvertibleToDictionary {
    func asDictionary(caseFormat: CaseFormat) -> [String: Any]
}

public extension ConvertibleToDictionary {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

            switch caseFormat {
            case .original:
                dictionary[keyName] = child.value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = child.value
            }
        }

        return dictionary
    }
}

extension String {
    var toSnakeCase: String {
        return self.replacingOccurrences(of: "([a-z])([A-Z])", with: "$1_$2", options: .regularExpression, range: self.startIndex..<self.endIndex).lowercased()
    }
}
```

この方法では、データの型が変更されることなく`Dictionary`に変換することができます。さらに、キー名を元の形式またはスネークケースに変換する選択も可能です。

### 結論

`JSONSerialization`はシンプルなJSON変換のためのものであり、すべてのユースケースに適しているわけではありません。特定の型情報を維持したい場合、上記のようなカスタムの変換メソッドを使用することをおすすめします。

---

こちらの説明で、Swiftの`JSONSerialization`に関する型変更の問題と、それを解決するための方法についての理解が深まったことを願っています。

---
