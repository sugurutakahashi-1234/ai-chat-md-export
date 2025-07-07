# Swift Combine イベント処理

日付: 2023-09-07

---

## 👤 ユーザー
*2023/9/7 10:55:43*

以下のソースコードについて、interactionDataModelSubject をsubscribeして、actionsの条件と一致したときにprintする処理を書いて欲しい。

let interactionDataModelSubject = PassthroughSubject&lt;InteractionDataModel, Never&gt;()
let actions: \[Action\]

public struct InteractionDataModel {
    public let timestampInMilliseconds: Int
    public let eventType: InteractionEventType

    public init(timestampInMilliseconds: Int = Date.asMillisecondsInt, eventType: InteractionEventType) {
        self.timestampInMilliseconds = timestampInMilliseconds
        self.eventType = eventType
    }
}

public enum InteractionEventType {
    case pageShow(InteractionEvent.PageShow)
    case click(InteractionEvent.Click)
    
    public var protoBufValueConvertible: ConvertibleToProtoBufValue {
        switch self {
        case .pageShow(let value):
            return value
        case .click(let value):
            return value
        }
    }
}

public typealias WebInteractionDecodable = Decodable

public enum InteractionEvent {
    public struct PageShow: ConvertibleToProtoBufValue, WebInteractionDecodable {
        private let location: String
        private let title: String
        private let referrer: String
    }

    public struct Click: ConvertibleToProtoBufValue, WebInteractionDecodable {
        private let target: String
        private let left: Double
        private let top: Double
        private let clientLeft: ScreenCoordinateValue
        private let clientTop: ScreenCoordinateValue
    }
}


public protocol ConvertibleToProtoBufValue: SnakeCasedStructNameProvidable, ConvertibleToDictionary {}


public protocol SnakeCasedStructNameProvidable {
    var instanceSnakeCasedStructName: String { get }
}

public extension SnakeCasedStructNameProvidable {
    var instanceSnakeCasedStructName: String {
        String(describing: type(of: self)).toSnakeCase
    }
}

public protocol ConvertibleToDictionary {
    func toDictionary(caseFormat: CaseFormat) -&gt; \[String: Any\]
}

public enum CaseFormat {
    case original
    case snakeCase
}


public extension ConvertibleToDictionary {
    /// 以下の処理は Mirror ではなくて、Codable で書き直すことも検討したのですが、以下の記事のようにやりたいことが達成できなかったので、Mirror 使用している
    // Ref: \[Swift\] JSONSerialization を使って辞書型に変換すると数値や Bool 値の型が勝手に変更されてしまう件 https://zenn.dev/ikuraikura/articles/2023-08-12-dict
    func toDictionary(caseFormat: CaseFormat = .original) -&gt; \[String: Any\] {
        let mirror = Mirror(reflecting: self)
        var dictionary: \[String: Any\] = \[:\]

        mirror.children.forEach { child in
            guard let keyName = child.label else {
                return
            }

            switch caseFormat {
            case .original:
                dictionary\[keyName\] = child.value
            case .snakeCase:
                dictionary\[keyName.toSnakeCase\] = child.value
            }
        }

        return dictionary
    }
}

public extension String {
    /// ex1) "snakeCase" -&gt; "snake\_case"
    /// ex2) "SnakeCase" -&gt; "snake\_case"
    /// ex3) "\_SnakeCase" -&gt; "\_snake\_case"
    /// ex4) "snakeCaseURL0123" -&gt; "snake\_case\_u\_r\_l0123"
    var toSnakeCase: String {
        let snakeCased = unicodeScalars.reduce("") { result, scalar in
            if CharacterSet.uppercaseLetters.contains(scalar) {
                return "\\(result)\_\\(Character(scalar))"
            } else {
                return result + String(scalar)
            }
        }.lowercased()

        if snakeCased.hasPrefix("\_") {
            return String(snakeCased.dropFirst())
        } else {
            return snakeCased
        }
    }
}


public struct Action {
    /// id
    public let id: String

    /// event名。ex) "page\_show"、"click" （スネークケースでも可）
    public let interactionEventName: String

    /// 判定するパラメーター。ex) \["location": "https://example.com/hoge", "referrer": "https://example.com/moge"\], \["target": "svg.icon-login"\]
    public let interactionParameters: Dictionary&lt;String, String&gt;
}

---

## 🤖 アシスタント
*2023/9/7 10:56:20*

まず、`interactionDataModelSubject`をsubscribeし、そのデータがactionsの条件に一致するかどうかをチェックする処理を作成します。

以下の手順で実装します：

1. `interactionDataModelSubject`をsubscribeします。
2. subscribeの中で、受信した`InteractionDataModel`がactionsのいずれかの条件に一致するかチェックします。
3. 一致する場合は、printします。

以下が実装例です：

```swift
let cancellable = interactionDataModelSubject.sink { interactionDataModel in
    // interactionDataModelのeventTypeから辞書を取得
    let eventDataDictionary = interactionDataModel.eventType.protoBufValueConvertible.toDictionary(caseFormat: .snakeCase)

    for action in actions {
        // event名が一致するかチェック
        if action.interactionEventName == interactionDataModel.eventType.instanceSnakeCasedStructName || 
           action.interactionEventName == interactionDataModel.eventType.instanceSnakeCasedStructName.toSnakeCase {
            // 全てのparametersがeventDataDictionaryで一致するかチェック
            let doesMatchAllParameters = action.interactionParameters.allSatisfy { key, value in
                return (eventDataDictionary[key] as? String) == value
            }

            if doesMatchAllParameters {
                print("Matched Action ID:", action.id)
            }
        }
    }
}
```

上記のコードでは、まず`interactionDataModelSubject`にsubscribeしています。その中で、`InteractionDataModel`からデータを取得し、それがactionsのどれかと一致するかチェックしています。

なお、この実装は`Combine`フレームワークを使用しており、`cancellable`オブジェクトを保持する必要があります。処理が不要になった際は、このオブジェクトを破棄してください。

---

## 👤 ユーザー
*2023/9/7 10:57:08*

|| 
           action.interactionEventName == interactionDataModel.eventType.instanceSnakeCasedStructName.toSnakeCaseはいらないかも

---

## 🤖 アシスタント
*2023/9/7 10:57:28*

了解しました。`interactionEventName`が直接スネークケースであることを前提として、その部分を取り除きます。

修正したコードは以下のとおりです：

```swift
let cancellable = interactionDataModelSubject.sink { interactionDataModel in
    // interactionDataModelのeventTypeから辞書を取得
    let eventDataDictionary = interactionDataModel.eventType.protoBufValueConvertible.toDictionary(caseFormat: .snakeCase)

    for action in actions {
        // event名が一致するかチェック
        if action.interactionEventName == interactionDataModel.eventType.instanceSnakeCasedStructName {
            // 全てのparametersがeventDataDictionaryで一致するかチェック
            let doesMatchAllParameters = action.interactionParameters.allSatisfy { key, value in
                return (eventDataDictionary[key] as? String) == value
            }

            if doesMatchAllParameters {
                print("Matched Action ID:", action.id)
            }
        }
    }
}
```

`interactionEventName`と`interactionDataModel.eventType.instanceSnakeCasedStructName`が一致する場合のみを考慮しています。

---

## 👤 ユーザー
*2023/9/7 11:11:29*

ちなみに interactionParameters が Dictionary&lt;String, Any&gt; だとどうなる？

---

## 🤖 アシスタント
*2023/9/7 11:12:08*

`interactionParameters` が `Dictionary<String, Any>` の場合、以下の点に注意が必要です：

1. 比較する際に、`eventDataDictionary` から取得する値と型が一致する必要があります。`String` だけでなく、他のデータ型についても考慮する必要があります。
2. `Any` 型は値の種類を示さないので、動的に型をチェックして比較を行う必要があります。

以下は、`interactionParameters` が `Dictionary<String, Any>` である場合の実装例です：

```swift
let cancellable = interactionDataModelSubject.sink { interactionDataModel in
    // interactionDataModelのeventTypeから辞書を取得
    let eventDataDictionary = interactionDataModel.eventType.protoBufValueConvertible.toDictionary(caseFormat: .snakeCase)

    for action in actions {
        // event名が一致するかチェック
        if action.interactionEventName == interactionDataModel.eventType.instanceSnakeCasedStructName {
            // 全てのparametersがeventDataDictionaryで一致するかチェック
            let doesMatchAllParameters = action.interactionParameters.allSatisfy { key, value in
                if let valueAsString = value as? String, let eventDataValue = eventDataDictionary[key] as? String {
                    return valueAsString == eventDataValue
                } else if let valueAsInt = value as? Int, let eventDataValue = eventDataDictionary[key] as? Int {
                    return valueAsInt == eventDataValue
                } // 他のデータ型についても同様に比較を追加する
                return false
            }

            if doesMatchAllParameters {
                print("Matched Action ID:", action.id)
            }
        }
    }
}
```

上記のコードでは、`String` と `Int` の比較を示していますが、他のデータ型を考慮する場合は、同様の方法で比較を追加してください。

---

## 👤 ユーザー
*2023/9/7 11:12:37*

Any型とAny型で比較するのって難しいの？

---

## 🤖 アシスタント
*2023/9/7 11:13:26*

`Any`型同士の比較は難しくはありませんが、注意点や特定の制約が存在します。

1. **型安全性**: `Any`型はSwiftの型安全性の利点を放棄しています。したがって、ランタイム時に予期しない型のデータに対して操作を行うとエラーやクラッシュが発生する可能性があります。

2. **等価性の定義**: 基本的な型（例: `Int`, `String`）では、Swiftが`==`演算子を提供していますが、カスタム型やクラスのインスタンスなどで`==`が定義されていない場合、比較するための実装が必要です。

3. **型のキャスト**: 実際のデータ型を知るためには、`Any`型からのキャストが必要です。しかし、キャストは失敗する可能性があります。このため、オプショナルバインディングや`as?`を使用して安全にキャストする必要があります。

`Any`型同士の比較を行う基本的な方法は以下のとおりです：

```swift
func areEqual(_ lhs: Any, _ rhs: Any) -> Bool {
    // メタ型情報を取得
    let lhsType = type(of: lhs)
    let rhsType = type(of: rhs)

    // 型が異なる場合はfalse
    if lhsType != rhsType {
        return false
    }

    // 型ごとの比較を実行
    if let lhs = lhs as? String, let rhs = rhs as? String {
        return lhs == rhs
    } else if let lhs = lhs as? Int, let rhs = rhs as? Int {
        return lhs == rhs
    } else if let lhs = lhs as? Double, let rhs = rhs as? Double {
        return lhs == rhs
    }
    // 他の型についても同様に追加...

    return false
}
```

上記の関数`areEqual`を使用すると、`Any`型の2つの変数の内容が等しいかどうかを簡単にチェックできます。ただし、すべての型についての処理を追加する必要があります。

---

## 👤 ユーザー
*2023/9/7 11:14:20*

おもったんだけど、\[String: Any\] ごと、つまり辞書型ごと比較はできないのかな？

---

## 🤖 アシスタント
*2023/9/7 11:15:06*

はい、Swiftにおいて、辞書`[String: Any]`を直接比較することはできません。しかし、特定のアプローチを利用することで間接的に比較することは可能です。

以下は、辞書`[String: Any]`を比較する方法の一例です：

1. 両方の辞書のキーの集合を比較して、それらが等しいことを確認します。
2. 各キーに対して、辞書から値を取得し、その値が等しいことを確認します。

以下は、このアプローチを実装した例です：

```swift
func dictionariesAreEqual(_ lhs: [String: Any], _ rhs: [String: Any]) -> Bool {
    // キーの集合が等しいかチェック
    guard Set(lhs.keys) == Set(rhs.keys) else { return false }
    
    // 各キーに対して値を比較
    for key in lhs.keys {
        let lhsValue = lhs[key]
        let rhsValue = rhs[key]
        
        if let lhsValue = lhsValue as? String, let rhsValue = rhsValue as? String {
            guard lhsValue == rhsValue else { return false }
        } else if let lhsValue = lhsValue as? Int, let rhsValue = rhsValue as? Int {
            guard lhsValue == rhsValue else { return false }
        } else if let lhsValue = lhsValue as? Double, let rhsValue = rhsValue as? Double {
            guard lhsValue == rhsValue else { return false }
        } // 他の型も同様に追加する
        else {
            // 想定外の型の場合、等しくないとみなす
            return false
        }
    }
    
    // すべてのキーと値のペアが一致した
    return true
}
```

この関数は、2つの辞書が等しい内容を持っているかどうかを確認します。ただし、辞書の値としてサポートする型に対する比較ロジックを追加する必要があります。

---
