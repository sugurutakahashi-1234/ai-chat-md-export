# Struct to Dict: Common Protocol

日付: 2023-06-10

---

## 👤 ユーザー
*2023/6/10 12:08:24*

structの変数名と値を辞書型に変換する方法。また、変数名はcamelCaseからsnakecaseに変更して欲しい。これらの処理を共通化したい。（プロトコル定義してもろもろしたい）

---

## 🤖 アシスタント
*2023/6/10 12:09:00*

以下に、Swiftでstructのインスタンス変数を辞書に変換し、その際にキー名をcamelCaseからsnake_caseに変換する実装例を示します。この処理は共通化し、新たなプロトコルを定義することで任意のstructに適用可能です。

まずはじめに、structのプロパティ名と値を取得するためのプロトコルを定義します。さらに、camelCaseからsnake_caseへの変換処理もこのプロトコルに実装します。

```swift
protocol DictionaryConvertible {
    func asDictionary() -> [String: Any]
}

extension DictionaryConvertible {
    func asDictionary() -> [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            dict[camelCaseToSnakeCase(key)] = child.value
        }
        return dict
    }

    private func camelCaseToSnakeCase(_ input: String) -> String {
        var output: String = ""
        for char in input {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}
```

上記のプロトコルを適用することで、任意のstructを辞書に変換できます。以下に実装例を示します。

```swift
struct User: DictionaryConvertible {
    let userName: String
    let userEmail: String
}

let user = User(userName: "testUser", userEmail: "test@example.com")
print(user.asDictionary())
// 出力: ["user_name": "testUser", "user_email": "test@example.com"]
```

この方法であれば、新たに作成するstructに`DictionaryConvertible`プロトコルを適用するだけで、変数名と値の辞書型変換とcamelCaseからsnake_caseへのキー名変換が可能となります。

---

## 👤 ユーザー
*2023/6/10 12:09:55*

User に age: Int など追加して欲しい。また、キャメルケースをスネークケースに変える処理はextension String としてほしい。

---

## 🤖 アシスタント
*2023/6/10 12:10:20*

了解しました。まず、User structに新しいプロパティageを追加します。次に、キャメルケースをスネークケースに変換する処理をStringの拡張として定義します。

```swift
struct User: DictionaryConvertible {
    let userName: String
    let userEmail: String
    let age: Int
}

extension String {
    var snakeCased: String {
        var output: String = ""
        for char in self {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}

protocol DictionaryConvertible {
    func asDictionary() -> [String: Any]
}

extension DictionaryConvertible {
    func asDictionary() -> [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            dict[key.snakeCased] = child.value
        }
        return dict
    }
}
```

このように定義することで、以下のようにUser structのインスタンスを作成し、そのプロパティと値をスネークケースのキーと値を持つ辞書に変換できます。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
print(user.asDictionary())
// 出力: ["user_name": "testUser", "user_email": "test@example.com", "age": 25]
```

---

## 👤 ユーザー
*2023/6/10 12:11:10*

DictionaryConvertible は asDictionary はコンピューテッドプロパティーにして欲しい

---

## 🤖 アシスタント
*2023/6/10 12:11:32*

了解しました。それに合わせて、`DictionaryConvertible`プロトコルの`asDictionary`をコンピューテッドプロパティとして定義します。

以下に修正版を示します。

```swift
struct User: DictionaryConvertible {
    let userName: String
    let userEmail: String
    let age: Int
}

extension String {
    var snakeCased: String {
        var output: String = ""
        for char in self {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}

protocol DictionaryConvertible {
    var dictionary: [String: Any] { get }
}

extension DictionaryConvertible {
    var dictionary: [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            dict[key.snakeCased] = child.value
        }
        return dict
    }
}
```

そして、User structのインスタンスのプロパティと値をスネークケースのキーと値を持つ辞書に変換するには、以下のようにします。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
print(user.dictionary)
// 出力: ["user_name": "testUser", "user_email": "test@example.com", "age": 25]
```

---

## 👤 ユーザー
*2023/6/10 12:12:23*

var asDictionary: \[String: Any\] { get } にしてほしい

---

## 🤖 アシスタント
*2023/6/10 12:12:48*

了解しました。プロトコルの`dictionary`プロパティ名を`asDictionary`に変更します。

以下に修正版を示します。

```swift
struct User: DictionaryConvertible {
    let userName: String
    let userEmail: String
    let age: Int
}

extension String {
    var snakeCased: String {
        var output: String = ""
        for char in self {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}

protocol DictionaryConvertible {
    var asDictionary: [String: Any] { get }
}

extension DictionaryConvertible {
    var asDictionary: [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            dict[key.snakeCased] = child.value
        }
        return dict
    }
}
```

そして、User structのインスタンスのプロパティと値をスネークケースのキーと値を持つ辞書に変換するには、以下のようにします。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
print(user.asDictionary)
// 出力: ["user_name": "testUser", "user_email": "test@example.com", "age": 25]
```

---

## 👤 ユーザー
*2023/6/10 14:40:34*

asDictionary を snakeCaseにするか、そのままにするか、をenumで設定して引数で設定して、変えられるようにしたい

---

## 🤖 アシスタント
*2023/6/10 14:41:13*

それに対応するため、`CaseFormat`というenumを作成し、それを`asDictionary`の引数として与えられるように設定します。ここでは、`CaseFormat` enumは`original`と`snakeCase`の二つの値を持つとします。

以下に修正版を示します。

```swift
struct User: DictionaryConvertible {
    let userName: String
    let userEmail: String
    let age: Int
}

extension String {
    var snakeCased: String {
        var output: String = ""
        for char in self {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}

enum CaseFormat {
    case original
    case snakeCase
}

protocol DictionaryConvertible {
    func asDictionary(format: CaseFormat) -> [String: Any]
}

extension DictionaryConvertible {
    func asDictionary(format: CaseFormat = .original) -> [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            switch format {
            case .original:
                dict[key] = child.value
            case .snakeCase:
                dict[key.snakeCased] = child.value
            }
        }
        return dict
    }
}
```

そして、User structのインスタンスのプロパティと値を、指定したキーケースの辞書に変換するには、以下のようにします。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
print(user.asDictionary(format: .snakeCase))
// 出力: ["user_name": "testUser", "user_email": "test@example.com", "age": 25]

print(user.asDictionary(format: .original))
// 出力: ["userName": "testUser", "userEmail": "test@example.com", "age": 25]
```

これで、`asDictionary`の引数に`CaseFormat` enumを指定して、変換後のキーケースを制御できるようになりました。

---

## 👤 ユーザー
*2023/6/10 14:45:47*

ちなみに以下のようにAWSのAmplifyを使って、ログを送信するのだけれども、nameにStruct名をつかって、propertiesにasDictionaryで生成した辞書型を入れて、BasicAnalyticsEventを作るようなプロトコルを作成して、それをUserに継承させて使用したい

func recordButtonClickedEvent() {
    // カスタムイベントの名前とプロパティを指定
    let eventName = "ButtonClicked"
    let eventProperties: \[String: AnalyticsPropertyValue\] = \[
        "buttonColor": "blue",
        "buttonSize": "large"
    \]

    // BasicAnalyticsEventを作成
    let event = BasicAnalyticsEvent(name: eventName, properties: eventProperties)

    // イベントを記録
    Amplify.Analytics.record(event: event)

    print("ButtonClicked event recorded.")
}

---

## 🤖 アシスタント
*2023/6/10 14:46:36*

ご要望に合わせて、AnalyticsEventRecordableという新しいプロトコルを作成します。このプロトコルは、structの名前を取得し、そのインスタンスのプロパティと値を辞書に変換して、それを使ってBasicAnalyticsEventを作成・記録するメソッドを提供します。

ただし、ここでの実装ではstructの名前を文字列として直接記述しています。Swiftはリフレクション（実行時にオブジェクトの型情報を取得すること）に制限があるため、動的にstructの名前を取得することはできません。

以下に修正版を示します。

```swift
struct User: DictionaryConvertible, AnalyticsEventRecordable {
    let userName: String
    let userEmail: String
    let age: Int
}

extension String {
    var snakeCased: String {
        var output: String = ""
        for char in self {
            if char.isUppercase {
                output += "_"
                output += char.lowercased()
            } else {
                output += String(char)
            }
        }
        return output
    }
}

enum CaseFormat {
    case original
    case snakeCase
}

protocol DictionaryConvertible {
    func asDictionary(format: CaseFormat) -> [String: Any]
}

extension DictionaryConvertible {
    func asDictionary(format: CaseFormat = .original) -> [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            switch format {
            case .original:
                dict[key] = child.value
            case .snakeCase:
                dict[key.snakeCased] = child.value
            }
        }
        return dict
    }
}

protocol AnalyticsEventRecordable {
    func recordEvent()
}

extension AnalyticsEventRecordable where Self: DictionaryConvertible {
    func recordEvent() {
        let eventProperties = asDictionary(format: .snakeCase)
        let eventName = "User"
        let analyticsProperties: [String: AnalyticsPropertyValue] = eventProperties.mapValues { value in
            if let intValue = value as? Int {
                return AnalyticsPropertyValue(intValue)
            } else if let stringValue = value as? String {
                return AnalyticsPropertyValue(stringValue)
            } else {
                // handle other types as needed
                return AnalyticsPropertyValue(stringValue: String(describing: value))
            }
        }

        let event = BasicAnalyticsEvent(name: eventName, properties: analyticsProperties)
        Amplify.Analytics.record(event: event)

        print("\(eventName) event recorded.")
    }
}
```

そして、User structのインスタンスに対してイベントを記録するには、以下のようにします。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
user.recordEvent()
// 出力: User event recorded.
```

ここでは、`AnalyticsPropertyValue`が`Int`や`String`以外の値を受け入れられるかわかりませんが、もし他の型を受け入れる場合は、それに合わせて適切に変換する処理を追加してください。また、`eventName`は

---

## 👤 ユーザー
*2023/6/10 14:46:41*

つづき

---

## 🤖 アシスタント
*2023/6/10 14:47:21*

もし`eventName`が"User"固定ではなく、各structの型名を動的に取得したい場合、Swiftの現行バージョンではその直接的な方法は提供されていません。しかし、ワークアラウンドとして、各structが自身の型名を文字列として提供することを要求する新たなプロトコルを作成することができます。

```swift
protocol TypeNameProvider {
    static var typeName: String { get }
}

extension TypeNameProvider {
    static var typeName: String {
        return String(describing: self)
    }
}

// Make User conform to TypeNameProvider
struct User: DictionaryConvertible, AnalyticsEventRecordable, TypeNameProvider {
    let userName: String
    let userEmail: String
    let age: Int
}

// Modify the AnalyticsEventRecordable to use the typeName
extension AnalyticsEventRecordable where Self: DictionaryConvertible & TypeNameProvider {
    func recordEvent() {
        let eventProperties = asDictionary(format: .snakeCase)
        let eventName = Self.typeName
        let analyticsProperties: [String: AnalyticsPropertyValue] = eventProperties.mapValues { value in
            if let intValue = value as? Int {
                return AnalyticsPropertyValue(intValue)
            } else if let stringValue = value as? String {
                return AnalyticsPropertyValue(stringValue)
            } else {
                // handle other types as needed
                return AnalyticsPropertyValue(stringValue: String(describing: value))
            }
        }

        let event = BasicAnalyticsEvent(name: eventName, properties: analyticsProperties)
        Amplify.Analytics.record(event: event)

        print("\(eventName) event recorded.")
    }
}
```

このようにすることで、User structのインスタンスに対してイベントを記録する際に、イベント名としてUser structの型名を動的に取得して使用できます。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
user.recordEvent()
// 出力: User event recorded.
```

このソリューションはUser型のインスタンスに対して適用され、イベント名は"User"となります。同様の方法で他のstructに対しても適用できます。ただし、それぞれのstructがTypeNameProviderに適合している必要があります。

---

## 👤 ユーザー
*2023/6/10 14:48:56*

AnalyticsEventRecordable は DictionaryConvertible と TypeNameProvider の2つのプロトコルを適応している前提で処理したほうが良い気がするのだけどどう思う？

---

## 🤖 アシスタント
*2023/6/10 14:49:41*

はい、そのご提案は合理的です。`AnalyticsEventRecordable`が`DictionaryConvertible`と`TypeNameProvider`の両方のプロトコルに準拠していることを前提とすれば、より安全なコードを書くことができます。これにより、任意のstructが`AnalyticsEventRecordable`に準拠する場合、それらは自動的に他の2つのプロトコルにも準拠する必要があります。

それを反映させたコードは以下の通りです：

```swift
protocol TypeNameProvider {
    static var typeName: String { get }
}

extension TypeNameProvider {
    static var typeName: String {
        return String(describing: self)
    }
}

protocol DictionaryConvertible {
    func asDictionary(format: CaseFormat) -> [String: Any]
}

extension DictionaryConvertible {
    func asDictionary(format: CaseFormat = .original) -> [String: Any] {
        var dict = [String: Any]()
        let mirror = Mirror(reflecting: self)
        for child in mirror.children {
            guard let key = child.label else { continue }
            switch format {
            case .original:
                dict[key] = child.value
            case .snakeCase:
                dict[key.snakeCased] = child.value
            }
        }
        return dict
    }
}

protocol AnalyticsEventRecordable: TypeNameProvider, DictionaryConvertible {
    func recordEvent()
}

extension AnalyticsEventRecordable {
    func recordEvent() {
        let eventProperties = asDictionary(format: .snakeCase)
        let eventName = Self.typeName
        let analyticsProperties: [String: AnalyticsPropertyValue] = eventProperties.mapValues { value in
            if let intValue = value as? Int {
                return AnalyticsPropertyValue(intValue)
            } else if let stringValue = value as? String {
                return AnalyticsPropertyValue(stringValue)
            } else {
                // handle other types as needed
                return AnalyticsPropertyValue(stringValue: String(describing: value))
            }
        }

        let event = BasicAnalyticsEvent(name: eventName, properties: analyticsProperties)
        Amplify.Analytics.record(event: event)

        print("\(eventName) event recorded.")
    }
}

struct User: AnalyticsEventRecordable {
    let userName: String
    let userEmail: String
    let age: Int
}
```

これで`User` structは`AnalyticsEventRecordable`を準拠しているため、`recordEvent()`を使ってイベントを記録できます。その際、`User` structの型名を動的に取得してイベント名として使用し、またそのインスタンスのプロパティと値をスネークケースのキーと値を持つ辞書に変換します。

```swift
let user = User(userName: "testUser", userEmail: "test@example.com", age: 25)
user.recordEvent()
// 出力: User event recorded.
```

---

## 👤 ユーザー
*2023/6/10 14:51:46*

typeName って実質struct名のことだよね？、structNameとかにしてもいいと思うんだけどどう思うStructNameProviderとか

---
