# SwiftテストコードのNimbleQuick使用

Date: 2023-06-12

---

## 👤 User
*2023-06-12 13:33:14*

Swiftのテストコードで NimbleQuickを使っているのだけれどもdescribe、context、itにどんな記述をすれば以下押してほしい

---

## 🤖 Assistant
*2023-06-12 13:33:52*

Nimble と Quick は Swift のユニットテストのためのフレームワークで、BDD (Behavior-Driven Development) スタイルのテストを書くためのものです。

Quick を使ってテストを書く場合、基本的なスキーマは以下のようになります：

1. `describe`：テストのグループを作成します。テストされるオブジェクトやメソッド、または特定の状況を示します。
2. `context`：特定の状況を表します。これは describe ブロックの中に書きます。これは、オブジェクトが特定の状態にあるときや、特定の条件が満たされたときに何が起こるかを記述するためのものです。
3. `it`：具体的なテストケースを記述します。期待される結果を表現するために "it should" という文言を使うことが一般的です。

例えば、String の `isEmpty` メソッドをテストする場合のテストコードは以下のようになるでしょう：

```swift
import Quick
import Nimble

class StringSpec: QuickSpec {
    override func spec() {
        describe("String") {
            context("when it is empty") {
                it("should return true from isEmpty") {
                    let emptyString = ""
                    expect(emptyString.isEmpty).to(beTrue())
                }
            }
            
            context("when it is not empty") {
                it("should return false from isEmpty") {
                    let nonEmptyString = "Not Empty"
                    expect(nonEmptyString.isEmpty).to(beFalse())
                }
            }
        }
    }
}
```

この例では、「String」を describe で記述し、空の場合と空でない場合の 2 つの context を定義しています。そして、それぞれの context で `isEmpty` の結果が期待通りであることを it でテストしています。

---

## 👤 User
*2023-06-12 13:39:30*

以下のStringのextensionについてテストコードをかいてほしい。他にもextensionはあるのでそれをそうていしてほしい。

```swift
extension String {
    // ex1) "snakeCase" -> "snake_case"
    // ex2) "SnakeCase" -> "_snake_case"
    // ex3) "snakeCaseURL0123" -> "snake_case_u_r_l0123"
    var toSnakeCase: String {
        unicodeScalars.reduce("") { result, scalar in
            if CharacterSet.uppercaseLetters.contains(scalar) {
                return "\(result)_\(Character(scalar))"
            } else {
                return result + String(scalar)
            }
        }.lowercased()
    }
}
```

---

## 🤖 Assistant
*2023-06-12 13:40:03*

あなたの要求に基づいて、以下にテストケースを示します。

```swift
import Quick
import Nimble

class StringExtensionSpec: QuickSpec {
    override func spec() {
        describe("String extension") {
            context("toSnakeCase") {
                it("should convert snakeCase to snake_case") {
                    let input = "snakeCase"
                    let expected = "snake_case"
                    expect(input.toSnakeCase).to(equal(expected))
                }
                
                it("should convert SnakeCase to _snake_case") {
                    let input = "SnakeCase"
                    let expected = "_snake_case"
                    expect(input.toSnakeCase).to(equal(expected))
                }
                
                it("should convert snakeCaseURL0123 to snake_case_u_r_l0123") {
                    let input = "snakeCaseURL0123"
                    let expected = "snake_case_u_r_l0123"
                    expect(input.toSnakeCase).to(equal(expected))
                }

                // Add more it blocks for other test cases...
            }

            // Add more context blocks for other methods in the extension...
        }
    }
}
```

このテストでは、上記の3つの例に対して、それぞれ`toSnakeCase`の機能をテストしています。`input.toSnakeCase`が期待する値（`expected`）と等しいことを検証しています。他のテストケースも同様に追加することができます。

また、この`String`の拡張機能に他のメソッドがある場合、それぞれのメソッドに対して新たな`context`ブロックを`describe`ブロックの中に追加することでテストを行うことができます。

---

## 👤 User
*2023-06-12 13:42:53*

以下のテストコードも書いてほしい

public struct AnalyticsLogEvent {
    public let name: String
    public let properties: [String: Any]?

    public init(name: String, properties: [String: Any]? = nil) {
        self.name = name
        self.properties = properties
    }
}

private extension AnalyticsLogEvent {
    var basicAnalyticsProperties: [String: AnalyticsPropertyValue]? {
        guard let properties else {
            // プロパティを持たない場合もあるので異常系ではない
            return nil
        }
        return properties.mapValues { value in
            switch value {
            case let intValue as Int:
                return intValue
            case let stringValue as String:
                return stringValue
            case let doubleValue as Double:
                return doubleValue
            case let floatValue as Float:
                return Double(floatValue)
            case let boolValue as Bool:
                return boolValue
            case let dateValue as Date:
                // TODO: https://github.com/Viagate/emomil-app-ios/pull/148 がマージされたら以下に修正する
                // return ISO8601DateFormatter.sharedWithFractionalSeconds.string(from: dateValue)
                let dateFormatter = ISO8601DateFormatter()
                return dateFormatter.string(from: dateValue)
            default:
                // ここでエラーになった場合は AnalyticsPropertyValue の型になるように適宜 switch文を修正して下さい
                assertionFailure("Value type not supported: \(type(of: value))")
                return String(describing: value)
            }
        }
    }
}

---

## 🤖 Assistant
*2023-06-12 13:43:39*

上記のコードに対して、`basicAnalyticsProperties` メソッドをテストするテストケースを書くことができます。このテストでは、異なる種類の値を `AnalyticsLogEvent` の `properties` にセットし、それぞれが適切にマップされているかを確認します。

```swift
import Quick
import Nimble

class AnalyticsLogEventSpec: QuickSpec {
    override func spec() {
        describe("AnalyticsLogEvent") {
            context("basicAnalyticsProperties") {
                it("should correctly map different types of values") {
                    let intValue: Int = 10
                    let stringValue: String = "test"
                    let doubleValue: Double = 20.0
                    let floatValue: Float = 30.0
                    let boolValue: Bool = true
                    let dateValue: Date = Date()

                    let properties: [String: Any] = [
                        "int": intValue,
                        "string": stringValue,
                        "double": doubleValue,
                        "float": floatValue,
                        "bool": boolValue,
                        "date": dateValue
                    ]

                    let event = AnalyticsLogEvent(name: "testEvent", properties: properties)

                    guard let basicProperties = event.basicAnalyticsProperties else {
                        fail("basicProperties should not be nil")
                        return
                    }

                    expect(basicProperties["int"] as? Int).to(equal(intValue))
                    expect(basicProperties["string"] as? String).to(equal(stringValue))
                    expect(basicProperties["double"] as? Double).to(equal(doubleValue))
                    expect(basicProperties["float"] as? Double).to(equal(Double(floatValue)))
                    expect(basicProperties["bool"] as? Bool).to(equal(boolValue))

                    // You may need to adjust this to match your date format
                    let dateFormatter = ISO8601DateFormatter()
                    let expectedDateString = dateFormatter.string(from: dateValue)
                    expect(basicProperties["date"] as? String).to(equal(expectedDateString))
                }
            }
        }
    }
}
```
このテストでは、異なるタイプの値（`Int`、`String`、`Double`、`Float`、`Bool`、`Date`）を含む `properties` ディクショナリを使用して `AnalyticsLogEvent` インスタンスを初期化します。次に、`basicAnalyticsProperties` から得られた結果が期待通りであることを確認します。期待する値として、各タイプの値をそのまま使い、`Float` は `Double` にキャストし、`Date` は文字列に変換します。

---

## 👤 User
*2023-06-12 13:52:32*

basicAnalyticsProperties' is inaccessible due to 'fileprivate' protection level となってしまったのだけれどもどうすればいい？

---

## 🤖 Assistant
*2023-06-12 13:52:59*

テストを書く際にプライベートなプロパティやメソッドにアクセスする必要がある場合、そのアクセスレベルを適切に調整する必要があります。しかし、これらのメソッドやプロパティが内部的にのみ使用されるためにプライベートに設定されている場合、それらの可視性を変更することは推奨されません。

その代わりに、プライベートメソッドやプロパティのロジックをテストするには、そのロジックを使用する公開メソッドやプロパティをテストすることを検討してください。これにより、あなたのテストは実際に使用されるコードのパスをカバーし、ユニットテストがその目的を達成します。

この場合、`basicAnalyticsProperties`がどのように`AnalyticsLogEvent`内で使用されているかによって対応が変わります。それが他の公開メソッドに影響を与えているなら、それらの公開メソッドのテストを書くことで間接的に`basicAnalyticsProperties`の挙動をテストすることが可能です。

---

## 👤 User
*2023-06-12 13:53:57*

@testable import することでどうにかならないんだっけ？

---

## 🤖 Assistant
*2023-06-12 13:54:22*

`@testable import`ディレクティブを使用すると、モジュール内の`internal`レベルまでのメンバーに対するアクセスが可能となりますが、残念ながら`private`や`fileprivate`レベルのメンバーに対するアクセスは依然として制限されます。

したがって、`@testable import`を使用しても`fileprivate`の`basicAnalyticsProperties`に直接アクセスすることはできません。

ファイルプライベートメソッドをテストするための一つの方法は、そのメソッドを内部（internal）または公開（public）にすることです。ただし、これは適切なアクセス制御を損なう可能性があるため、推奨されません。

最良の解決策は、一部のプライベートメソッドやプロパティのロジックを公開APIを通じてテストすることです。これはユニットテストの目的と一致しています：システムの公開部分が正しく動作することを確認すること。つまり、それらのプライベートな部分はその公開部分を通じて間接的にテストされるべきです。

---
