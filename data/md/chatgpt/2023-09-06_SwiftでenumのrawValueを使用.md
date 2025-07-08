# SwiftでenumのrawValueを使用

日付: 2023-09-06

---

## 👤 ユーザー
*2023/09/06 16:37:08*

SwiftでenumのrawValueがある場合はそのrawValueで判定するようにして欲しいんだけどどうすればいいかな

import EmomilCore
import Foundation
import SwiftProtobuf

extension ConvertibleToProtoBufValue {
    var toProtoBufValueDictionary: [String: Google_Protobuf_Value] {
        toDictionary(caseFormat: .snakeCase).mapValues { value in
            var protoValue = Google_Protobuf_Value()
            switch value {
            case let screenCoordinateValue as ScreenCoordinateValue:
                protoValue.numberValue = screenCoordinateValue.pixelSystemValue
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
}

---

## 🤖 アシスタント
*2023/09/06 16:38:04*

Swiftのenumが`rawValue`を持っている場合、その`rawValue`で判定するようにするには、まず該当のenumが`RawRepresentable`を準拠していることを確認してください。

以下の手順に沿ってコードを更新します。

1. Enumが`RawRepresentable`を実装していることを確認。
2. `value`の型が該当のenumの型かどうかを確認。
3. それが該当すれば、enumの`rawValue`を取得し、それを使用して`Google_Protobuf_Value`をセット。

以下は、例として`ScreenCoordinateValue`が`RawRepresentable`を実装していると仮定してコードを更新したものです：

```swift
extension ConvertibleToProtoBufValue {
    var toProtoBufValueDictionary: [String: Google_Protobuf_Value] {
        toDictionary(caseFormat: .snakeCase).mapValues { value in
            var protoValue = Google_Protobuf_Value()
            if let screenCoordinateValue = value as? ScreenCoordinateValue, 
               let rawValue = screenCoordinateValue.rawValue as? Double {
                protoValue.numberValue = rawValue
            } else {
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
            }
            return protoValue
        }
    }
}
```

上記の例では、`ScreenCoordinateValue` enumが`rawValue`を`Double`として持っていると仮定しています。このenumの型と`rawValue`の型に合わせて調整が必要です。

さらに、`ScreenCoordinateValue` enumの実際の定義を提供することで、より正確な解決策を提供できるかもしれません。

---
