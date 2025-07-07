# Swift: Accessing Enum RawValue

日付: 2023-07-21

---

## 👤 ユーザー
*2023/7/22 6:04:22*

Swiftでstructの変数にアクセスしたときに、enumだったらrawValueにアクセスするような式ってどうかけばいい？

---

## 🤖 アシスタント
*2023/7/22 6:05:04*

Swiftでstructのプロパティがenum型で、そのenumがRawRepresentableプロトコルに準拠している場合、`rawValue`プロパティを使って原始値にアクセスできます。まず、以下にそのようなenumとstructを定義する方法を示します：

```swift
enum MyEnum: Int {
    case caseOne = 1
    case caseTwo = 2
    case caseThree = 3
}

struct MyStruct {
    var myEnum: MyEnum
}
```

このとき、`MyStruct`のインスタンスから`MyEnum`プロパティの`rawValue`にアクセスするには以下のようにします：

```swift
let myStruct = MyStruct(myEnum: .caseTwo)

let rawValue = myStruct.myEnum.rawValue  // 2
```

`rawValue`を使うと、enumの値そのものではなく、それに関連付けられた原始値（この例では整数）にアクセスすることができます。

また、もしstructのプロパティがenumかどうかを確認するためには、Swiftの型チェック演算子`is`や型キャスト演算子`as?`、`as!`を使います。ただし、Swiftは静的型付け言語であるため、プロパティの型が既知であれば、特定の型について動的にチェックすることはほとんどありません。

---

## 👤 ユーザー
*2023/7/22 6:08:39*

このときに全部rawValueにアクセスしたいんだ

enum TestEnumInt: Int {
    case abc
    case efg
}

enum TestEnumString: String {
    case abc
    case efg
}

struct Test {
    var hoge: Int
    var moge: TestEnumInt
    var fuga: TestEnumString
}

let test: Test = Test(hoge: 100, moge:.efg, fuga: .abc)

print(test.hoge)
print(test.moge)
print(test.fuga)

---

## 🤖 アシスタント
*2023/7/22 6:09:08*

あなたが各プロパティに対して自動的にrawValueにアクセスしたい場合、Swiftではそのようなことは直接サポートされていません。各プロパティにアクセスしてそれぞれの型に応じた処理をすることは、型チェックとダウンキャストを行うことで可能ですが、それには`Mirror`というSwiftのリフレクションAPIを使用します。

ただし、リフレクションは実行時のパフォーマンスに影響を及ぼす可能性があり、Swiftの静的型付けの利点を一部放棄することになるため、注意が必要です。以下に、Mirrorを使用して各プロパティを列挙し、それがenumであるかどうかをチェックし、可能な場合はそのrawValueにアクセスするサンプルコードを示します：

```swift
enum TestEnumInt: Int {
    case abc = 1
    case efg = 2
}

enum TestEnumString: String {
    case abc = "abc"
    case efg = "efg"
}

struct Test {
    var hoge: Int
    var moge: TestEnumInt
    var fuga: TestEnumString
}

let test: Test = Test(hoge: 100, moge:.efg, fuga: .abc)

let mirror = Mirror(reflecting: test)
for child in mirror.children {
    if let enumWithRawValue = child.value as? RawRepresentable {
        print(enumWithRawValue.rawValue)
    } else {
        print(child.value)
    }
}
```

このコードでは、`Mirror(reflecting:)`でTest型のインスタンスのミラーを作成し、その`children`プロパティを列挙しています。各プロパティが`RawRepresentable`プロトコルに準拠している場合、その`rawValue`プロパティにアクセスし、そうでない場合はプロパティの値そのものを出力します。

---

## 👤 ユーザー
*2023/7/22 6:12:11*

以下の  dictionary\[keyName\] = child.value や dictionary\[keyName.toSnakeCase\] = child.value でこのような対応をいれたい

public enum CaseFormat {
    case original
    case snakeCase
}

public protocol DictionaryConvertible {
    func asDictionary(caseFormat: CaseFormat) -&gt; \[String: Any\]
}

public extension DictionaryConvertible {
    // TODO: もしかすると Codable で簡単に書き直せるかもしれない
    func asDictionary(caseFormat: CaseFormat = .original) -&gt; \[String: Any\] {
        let mirror = Mirror(reflecting: self)
        var dictionary: \[String: Any\] = \[:\]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

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

---

## 🤖 アシスタント
*2023/7/22 6:12:31*

あなたがenum型の`RawRepresentable`プロパティのrawValueにアクセスしたい場合、`asDictionary(caseFormat:)`関数を以下のように修正できます：

```swift
public extension DictionaryConvertible {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }
            
            let value: Any
            if let enumWithRawValue = child.value as? RawRepresentable {
                value = enumWithRawValue.rawValue
            } else {
                value = child.value
            }

            switch caseFormat {
            case .original:
                dictionary[keyName] = value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = value
            }
        }

        return dictionary
    }
}
```

このコードでは、`Mirror`を用いてインスタンスの各プロパティを走査し、そのプロパティがenum（具体的には`RawRepresentable`）である場合、その`rawValue`を取得しています。それ以外の場合は、プロパティの値そのものを取得しています。そして、それらの値は指定されたcaseFormatに基づいてdictionaryに保存されます。

なお、Swiftの文字列に対して`toSnakeCase`関数を呼び出すという部分は省略しています。そのような関数はSwiftの標準ライブラリには存在しないため、自分で実装するか、適切なライブラリを見つける必要があります。

---

## 👤 ユーザー
*2023/7/22 7:53:03*

また、RawRepresentable ではなかったら、enum の case 名の String にすることはできない？

---

## 🤖 アシスタント
*2023/7/22 7:53:51*

Swiftには、enum型の値からcase名を直接文字列として取得する標準的な方法がありません。しかし、`CustomStringConvertible`プロトコルを準拠させて`description`プロパティをオーバーライドすることで、それを達成することが可能です。

以下に例を示します:

```swift
enum TestEnumInt: Int, CustomStringConvertible {
    case abc = 1
    case efg = 2

    var description: String {
        switch self {
        case .abc: return "abc"
        case .efg: return "efg"
        }
    }
}

enum TestEnumString: String, CustomStringConvertible {
    case abc = "abc"
    case efg = "efg"

    var description: String {
        switch self {
        case .abc: return "abc"
        case .efg: return "efg"
        }
    }
}

struct Test {
    var hoge: Int
    var moge: TestEnumInt
    var fuga: TestEnumString
}

extension Test: DictionaryConvertible {}

let test: Test = Test(hoge: 100, moge:.efg, fuga: .abc)

let dictionary = test.asDictionary(caseFormat: .original)
print(dictionary)  // ["hoge": 100, "moge": "efg", "fuga": "abc"]
```

ここでは、`TestEnumInt`と`TestEnumString`が`CustomStringConvertible`プロトコルを準拠し、その`description`プロパティをオーバーライドしています。これにより、それぞれのenum型の値の文字列表現が得られます。この文字列表現は、`asDictionary(caseFormat:)`関数内でenum型の値が`CustomStringConvertible`であるかどうかをチェックし、その`description`を取得することで使用されます。

ただし、この方法ではenumの各ケースに対する文字列表現を手動で提供する必要があります。enumのケースが多数存在する場合や、新たなケースが追加される可能性がある場合、この方法はメンテナンスが難しくなる可能性があります。

---

## 👤 ユーザー
*2023/7/22 7:54:19*

enum の場合に String(child.value) みたいなことはできないの？

---

## 🤖 アシスタント
*2023/7/22 7:55:01*

Swiftでは、enumの値を直接Stringに変換すると、結果はenumの名前とそのケースの名前を連結したものになります。例えば、以下のenumがあるとします:

```swift
enum TestEnum: Int {
    case caseOne = 1
    case caseTwo = 2
}
```

このとき、`TestEnum.caseOne`の文字列表現は次のようになります:

```swift
print(String(describing: TestEnum.caseOne))  // "caseOne"
```

しかし、`RawRepresentable`（つまり、enumが原始値を持つ）でないenumに対しては、これを使ってもenumの名前とケースの名前が出力されます。なので、ケース名のみを取得するためには手動で対応を定義する必要があります。

上記のような挙動を利用して、enumのケース名を取得するためには、次のように記述することができます:

```swift
public extension DictionaryConvertible {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }
            
            let value: Any
            if let enumWithRawValue = child.value as? RawRepresentable {
                value = enumWithRawValue.rawValue
            } else {
                value = String(describing: child.value)
            }

            switch caseFormat {
            case .original:
                dictionary[keyName] = value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = value
            }
        }

        return dictionary
    }
}
```

これにより、`RawRepresentable`でないenumの場合には、enumのケース名がdictionaryに保存されます。ただし、この挙動はSwiftのバージョンや実装により変わる可能性があるため、注意が必要です。

---

## 👤 ユーザー
*2023/7/22 7:55:33*

これだとRawRepresentableでなければ全部Srtingになってしまうので、enum だけこうしたい

---

## 🤖 アシスタント
*2023/7/22 7:56:11*

Swiftにはenumの値がenumであることを動的に確認する標準的な方法がありません。しかし、特定のenumが存在することが既知である場合、そのenumを特定のプロトコルに準拠させ、そのプロトコルを使用してenumであるかどうかをチェックすることができます。

以下に、その一例を示します:

```swift
protocol EnumProtocol {}

enum TestEnumInt: Int, EnumProtocol {
    case abc = 1
    case efg = 2
}

enum TestEnumString: String, EnumProtocol {
    case abc = "abc"
    case efg = "efg"
}

struct Test: DictionaryConvertible {
    var hoge: Int
    var moge: TestEnumInt
    var fuga: TestEnumString
}

public extension DictionaryConvertible {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

            let value: Any
            if let enumWithRawValue = child.value as? RawRepresentable {
                value = enumWithRawValue.rawValue
            } else if let enumValue = child.value as? EnumProtocol {
                value = String(describing: enumValue)
            } else {
                value = child.value
            }

            switch caseFormat {
            case .original:
                dictionary[keyName] = value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = value
            }
        }

        return dictionary
    }
}
```

このコードでは、`EnumProtocol`というプロトコルを定義し、enumがこのプロトコルに準拠するようにしています。そして、`asDictionary(caseFormat:)`関数内で、プロパティの値が`EnumProtocol`に準拠しているかどうかをチェックします。これにより、enum型のプロパティを特定し、そのケース名をdictionaryに保存することが可能になります。

---

## 👤 ユーザー
*2023/7/22 7:56:42*

どうにか enum であることを取得する方法はないの？

---

## 🤖 アシスタント
*2023/7/22 7:57:09*

SwiftでEnum型であることを動的に判定する標準的な方法は存在しません。ただし、Swiftの標準ライブラリの一部であるMirror APIを使用してリフレクションを使用することで、Enum型の場合とそれ以外の場合を区別することができます。

ただし、この方法には注意が必要です。具体的には、Mirror APIはSwiftの内部表現に依存しており、これはSwiftのバージョン間で変更される可能性があります。それにもかかわらず、以下にenumと非enumを区別する基本的な方法を示します：

```swift
public extension DictionaryConvertible {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

            let value: Any
            if let enumWithRawValue = child.value as? RawRepresentable {
                value = enumWithRawValue.rawValue
            } else {
                let childMirror = Mirror(reflecting: child.value)
                if childMirror.displayStyle == .enum {
                    value = String(describing: child.value)
                } else {
                    value = child.value
                }
            }

            switch caseFormat {
            case .original:
                dictionary[keyName] = value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = value
            }
        }

        return dictionary
    }
}
```

このコードでは、プロパティがenum型であるかどうかを確認するために、プロパティの値に対して新たなMirrorを作成しています。そのMirrorのdisplayStyleが.enumである場合、その値はenumであると判断します。

この方法を使用すると、RawRepresentableではないenumを特定し、そのcase名をStringとして取得することができます。しかし、これはSwiftの内部表現に依存しているため、全てのenumに対して期待通りに動作するとは限らない点にご注意ください。

---
