# Enum with nested enums

日付: 2023-05-22

---

## 👤 ユーザー
*2023/5/22 18:13:32*

Swift で enum の中に 複数の enum の定義があって、その中のどれかを取得するみたいなコードをかいてほしい

---

## 🤖 アシスタント
*2023/5/22 18:13:57*

Swiftでは、enumの中に別のenumを含め、その内部のenumを取得することが可能です。下記に例を示します。

```swift
enum GrandParentEnum {
    enum ParentEnum {
        case case1
        case case2
    }
    
    enum AnotherParentEnum {
        case caseA
        case caseB
    }
}

// GrandParentEnum内のParentEnumの取得
let enumValue1 = GrandParentEnum.ParentEnum.case1

// GrandParentEnum内のAnotherParentEnumの取得
let enumValue2 = GrandParentEnum.AnotherParentEnum.caseA

// 値の使用
switch enumValue1 {
case .case1:
    print("ParentEnum case1 selected")
case .case2:
    print("ParentEnum case2 selected")
}

switch enumValue2 {
case .caseA:
    print("AnotherParentEnum caseA selected")
case .caseB:
    print("AnotherParentEnum caseB selected")
}
```

この例では、`GrandParentEnum`という大元のenumに`ParentEnum`と`AnotherParentEnum`という2つのenumが定義されています。それぞれのenumから値を取得し、その値をswitch文で処理しています。

---

## 👤 ユーザー
*2023/5/22 18:14:44*

ParentEnum と AnotherParentEnum を同じように扱える型を宣言してつかいたんだけどどうすればいい？

---

## 🤖 アシスタント
*2023/5/22 18:15:43*

Swiftでは、Protocolを使用して異なる型を同じように扱うことができます。これを活用すると、複数のenumを同じように扱える型を宣言することが可能です。

以下に具体的なコードを示します。

```swift
protocol EnumProtocol {
    func description() -> String
}

enum GrandParentEnum {
    enum ParentEnum: EnumProtocol {
        case case1
        case case2
        
        func description() -> String {
            switch self {
            case .case1:
                return "ParentEnum case1"
            case .case2:
                return "ParentEnum case2"
            }
        }
    }
    
    enum AnotherParentEnum: EnumProtocol {
        case caseA
        case caseB
        
        func description() -> String {
            switch self {
            case .caseA:
                return "AnotherParentEnum caseA"
            case .caseB:
                return "AnotherParentEnum caseB"
            }
        }
    }
}

let enumValue1: EnumProtocol = GrandParentEnum.ParentEnum.case1
let enumValue2: EnumProtocol = GrandParentEnum.AnotherParentEnum.caseA

print(enumValue1.description()) // "ParentEnum case1"
print(enumValue2.description()) // "AnotherParentEnum caseA"
```

このコードでは、`EnumProtocol`というProtocolを定義し、`ParentEnum`と`AnotherParentEnum`がそれぞれこのProtocolを採用するようにしました。そして、それぞれのenumの値を`EnumProtocol`型として扱うことで、異なるenumでも同じように扱うことができます。

この例では`description()`メソッドを定義していますが、その他のメソッドやプロパティも同様に定義することが可能です。

---

## 👤 ユーザー
*2023/5/22 18:19:24*

Enum に equalable を適応する

---

## 🤖 アシスタント
*2023/5/22 18:20:13*

Swiftでは、enumにEquatableプロトコルを採用させることで、enumの値の等価性を確認することができます。以下にその一例を示します。

```swift
enum SampleEnum: Equatable {
    case case1
    case case2(data: String)
    case case3(data: Int, otherData: Int)
}

let value1 = SampleEnum.case1
let value2 = SampleEnum.case1

if value1 == value2 {
    print("value1 and value2 are equal")
}

let value3 = SampleEnum.case2(data: "Data")
let value4 = SampleEnum.case2(data: "Data")

if value3 == value4 {
    print("value3 and value4 are equal")
}

let value5 = SampleEnum.case3(data: 1, otherData: 2)
let value6 = SampleEnum.case3(data: 1, otherData: 2)

if value5 == value6 {
    print("value5 and value6 are equal")
}
```

上記のコードでは、`SampleEnum`というenumがEquatableプロトコルを採用しています。これにより、enumの値が等しいかどうかを`==`演算子で確認できます。各ケースにassociated valueが存在する場合でも、そのassociated valueが全て等しければそのenum値全体が等しいと見なされます。

ただし、注意点として、この等価性比較は、enumのケース自体とそれに紐づいているassociated valueが全て等しい場合に限ります。もしケースは同じでもassociated valueが異なる場合、それらは等しくないと判断されます。

なお、SwiftのenumはデフォルトでEquatableプロトコルを採用しているため、associated valueがないenumについてはEquatableを明示的に採用させなくても等価性の比較が可能です。

---

## 👤 ユーザー
*2023/5/22 18:20:45*

associated value がある enum の Equatable をかいてほしい

---

## 🤖 アシスタント
*2023/5/22 18:21:28*

Swiftではassociated valueがあるenumに対しても、自動的にEquatableプロトコルを採用させることはできません。そのため、手動で等価性の確認を行うための`==`演算子を定義する必要があります。

以下に、associated valueを持つenumに対するEquatableプロトコルの実装を示します。

```swift
enum SampleEnum {
    case case1
    case case2(data: String)
    case case3(data: Int, otherData: Int)
}

extension SampleEnum: Equatable {
    static func ==(lhs: SampleEnum, rhs: SampleEnum) -> Bool {
        switch (lhs, rhs) {
        case (.case1, .case1):
            return true
        case let (.case2(data1), .case2(data2)):
            return data1 == data2
        case let (.case3(data1, otherData1), .case3(data2, otherData2)):
            return data1 == data2 && otherData1 == otherData2
        default:
            return false
        }
    }
}

let value1 = SampleEnum.case2(data: "Data")
let value2 = SampleEnum.case2(data: "Data")

if value1 == value2 {
    print("value1 and value2 are equal")
}

let value3 = SampleEnum.case3(data: 1, otherData: 2)
let value4 = SampleEnum.case3(data: 1, otherData: 2)

if value3 == value4 {
    print("value3 and value4 are equal")
}
```

このコードでは、`SampleEnum`というenumに対してEquatableプロトコルを採用させ、その`==`演算子を自分で定義しています。各ケースのassociated valueの等価性を確認して、全体としてのenumの値の等価性を決定しています。

---

## 👤 ユーザー
*2023/5/22 18:22:35*

Equatable のenumを待ち受けた、Equatable であることを利用した処理を書いて欲しい

---

## 🤖 アシスタント
*2023/5/22 18:23:23*

Equatableプロトコルを採用したenumについて、その等価性を利用した処理の一例として、特定のenum値が配列内に存在するかどうかをチェックする機能を考えてみましょう。

以下にそのような処理を行うSwiftのコードを示します。

```swift
enum SampleEnum: Equatable {
    case case1
    case case2(data: String)
    case case3(data: Int, otherData: Int)
}

extension SampleEnum {
    static func ==(lhs: SampleEnum, rhs: SampleEnum) -> Bool {
        switch (lhs, rhs) {
        case (.case1, .case1):
            return true
        case let (.case2(data1), .case2(data2)):
            return data1 == data2
        case let (.case3(data1, otherData1), .case3(data2, otherData2)):
            return data1 == data2 && otherData1 == otherData2
        default:
            return false
        }
    }
}

let value1 = SampleEnum.case2(data: "Hello")
let value2 = SampleEnum.case3(data: 1, otherData: 2)

var enumArray = [SampleEnum]()
enumArray.append(.case1)
enumArray.append(.case2(data: "Hello"))
enumArray.append(.case3(data: 3, otherData: 4))

if enumArray.contains(value1) {
    print("The array contains value1")
}

if enumArray.contains(value2) {
    print("The array contains value2")
} else {
    print("The array does not contain value2")
}
```

このコードでは、`SampleEnum`というenumに対してEquatableプロトコルを採用させています。そして、特定のenumの値が配列内に存在するかどうかを`contains(_:)`メソッドでチェックしています。

`contains(_:)`メソッドは配列内の要素が引数で与えられた値と等しいものが存在するかどうかを確認します。これは`==`演算子に基づいて等価性が評価されますので、Equatableプロトコルを採用していることが必要です。

---

## 👤 ユーザー
*2023/5/22 18:24:03*

別の enum 同士を同じグループとしてEquatableであつかう方法をおしえてほしい。

---

## 🤖 アシスタント
*2023/5/22 18:25:12*

Swiftでは、異なるenumを同じグループとしてEquatableとして扱うためには、共通のプロトコルを実装する方法が一般的です。

以下に、それぞれ異なるenumを持ちつつ、共通のプロトコルを実装しEquatableとして扱う例を示します。

まず、共通のプロトコルとなる`EnumProtocol`を定義します。このプロトコルはEquatableを継承し、各enumが必要とするメソッドやプロパティを定義します。

```swift
protocol EnumProtocol: Equatable {
    var id: Int { get }
}
```

次に、`EnumProtocol`を採用する2つの異なるenumを定義します。

```swift
enum FirstEnum: Int, EnumProtocol {
    case case1 = 1
    case case2 = 2
    var id: Int {
        return self.rawValue
    }
}

enum SecondEnum: Int, EnumProtocol {
    case caseA = 3
    case caseB = 4
    var id: Int {
        return self.rawValue
    }
}
```

このようにして、FirstEnumとSecondEnumは共にEnumProtocolを採用し、等価性の比較はidプロパティを用いて行うことができます。

```swift
let value1: EnumProtocol = FirstEnum.case1
let value2: EnumProtocol = SecondEnum.caseA

if value1.id == value2.id {
    print("value1 and value2 are equal")
} else {
    print("value1 and value2 are not equal")
}
```

この例では、idという共通のプロパティを基に等価性の判断を行っています。このように、プロトコルを使用することで、異なるenumを同じグループとして扱うことができます。

なお、この例ではenumの値の等価性を比較するためにidという共通のプロパティを使用していますが、具体的な等価性の判断条件は使用する場面に応じて変更することができます。例えば、等価性の判断条件が複数のプロパティにまたがる場合や、一部のケースのみを等価とする場合など、状況に応じて適切な等価性の判断を定義することが可能です。

---

## 👤 ユーザー
*2023/5/22 18:25:52*

EnumProtocol を連想値としてもつ、enum を定義して、それの EnumProtocol の値が一致しているかどうか調べるコードをかいてほしい

---

## 🤖 アシスタント
*2023/5/22 18:26:55*

共通のプロトコル`EnumProtocol`を採用したenumを持つ、新たなenum`WrapperEnum`を定義し、その中の`EnumProtocol`の値が一致しているかどうかを調べるためのコードを以下に示します。

まずは、`EnumProtocol`とそれを採用する`FirstEnum`、`SecondEnum`を定義します。

```swift
protocol EnumProtocol: Equatable {
    var id: Int { get }
}

enum FirstEnum: Int, EnumProtocol {
    case case1 = 1
    case case2 = 2
    var id: Int {
        return self.rawValue
    }
}

enum SecondEnum: Int, EnumProtocol {
    case caseA = 3
    case caseB = 4
    var id: Int {
        return self.rawValue
    }
}
```

次に、`WrapperEnum`を定義し、`EnumProtocol`を連想値として持つようにします。

```swift
enum WrapperEnum {
    case firstCase(value: EnumProtocol)
    case secondCase(value: EnumProtocol)
}
```

そして、`WrapperEnum`にEquatableプロトコルを採用させ、`EnumProtocol`の値の等価性を調べるための`==`演算子を定義します。

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)):
            return value1.id == value2.id
        case let (.secondCase(value1), .secondCase(value2)):
            return value1.id == value2.id
        default:
            return false
        }
    }
}
```

以上の定義に基づいて、以下のように`WrapperEnum`の値の等価性を調べることが可能です。

```swift
let value1 = WrapperEnum.firstCase(value: FirstEnum.case1)
let value2 = WrapperEnum.firstCase(value: SecondEnum.caseA)

if value1 == value2 {
    print("value1 and value2 are equal")
} else {
    print("value1 and value2 are not equal")
}
```

この例では、`WrapperEnum`の値の等価性は、その中に含まれる`EnumProtocol`の`id`プロパティの等価性に基づいています。そのため、異なるenumでも`id`プロパティの値が同じであれば、それらの値は等しいと判断されます。

---

## 👤 ユーザー
*2023/5/22 18:27:55*

case case3 と case caseC をふやしてほしい

---

## 🤖 アシスタント
*2023/5/22 18:29:10*

`FirstEnum`と`SecondEnum`に新しいケース`case3`と`caseC`を追加し、`WrapperEnum`が新しいケースを扱うことができるようにするためのコードを以下に示します。

まず、`EnumProtocol`とそれを採用する`FirstEnum`、`SecondEnum`を定義します。`FirstEnum`には`case3`を、`SecondEnum`には`caseC`を追加します。

```swift
protocol EnumProtocol: Equatable {
    var id: Int { get }
}

enum FirstEnum: Int, EnumProtocol {
    case case1 = 1
    case case2 = 2
    case case3 = 3
    var id: Int {
        return self.rawValue
    }
}

enum SecondEnum: Int, EnumProtocol {
    case caseA = 4
    case caseB = 5
    case caseC = 6
    var id: Int {
        return self.rawValue
    }
}
```

次に、`WrapperEnum`を定義し、`EnumProtocol`を連想値として持つようにします。この時、新しいケース`thirdCase`を追加します。

```swift
enum WrapperEnum {
    case firstCase(value: EnumProtocol)
    case secondCase(value: EnumProtocol)
    case thirdCase(value: EnumProtocol)
}
```

そして、`WrapperEnum`にEquatableプロトコルを採用させ、`EnumProtocol`の値の等価性を調べるための`==`演算子を定義します。

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)),
             let (.secondCase(value1), .secondCase(value2)),
             let (.thirdCase(value1), .thirdCase(value2)):
            return value1.id == value2.id
        default:
            return false
        }
    }
}
```

以上の定義に基づいて、以下のように`WrapperEnum`の値の等価性を調べることが可能です。

```swift
let value1 = WrapperEnum.thirdCase(value: FirstEnum.case3)
let value2 = WrapperEnum.thirdCase(value: SecondEnum.caseC)

if value1 == value2 {
    print("value1 and value2 are equal")
} else {
    print("value1 and value2 are not equal")
}
```

この例では、`WrapperEnum`の値の等価性は、その中に含まれる`EnumProtocol`の`id`プロパティの等価性に基づいています。そのため、異なるenumでも`id`プロパティの値が同じであれば、それらの値は等しいと判断されます。

---

## 👤 ユーザー
*2023/5/22 18:29:39*

これさ、EnumProtocol に Equatable を持たせるより、String の RawValue を持つようにして比較した方が簡単に書けない？

---

## 🤖 アシスタント
*2023/5/22 18:30:33*

それは可能です。Enumの連想値としてはなく、それぞれのEnumにStringのRawValueを持たせ、それを使って比較を行う方法もあります。その場合は以下のようにコードを書くことができます：

```swift
enum FirstEnum: String {
    case case1 = "case1"
    case case2 = "case2"
    case case3 = "case3"
}

enum SecondEnum: String {
    case caseA = "caseA"
    case caseB = "caseB"
    case caseC = "case3"  // ここではFirstEnum.case3と同じRawValueを持つようにしています。
}

enum WrapperEnum {
    case firstCase(value: FirstEnum)
    case secondCase(value: SecondEnum)
}

extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.firstCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        }
    }
}

let value1 = WrapperEnum.firstCase(value: .case3)
let value2 = WrapperEnum.secondCase(value: .caseC)

if value1 == value2 {
    print("value1 and value2 are equal")
} else {
    print("value1 and value2 are not equal")
}
```

この例では、`FirstEnum`と`SecondEnum`のそれぞれが`String`のRawValueを持ち、`WrapperEnum`の`Equatable`実装がこれらのRawValueを比較することで、`WrapperEnum`のインスタンスが等しいかどうかを判断します。

ただし、この方式には注意点があります。それぞれのEnumが別々のRawValueを持つことを許すと、同じEnumの別のケースと同じRawValueを持つことが可能になります。これは予期しない結果を引き起こす可能性があるため、注意が必要です。

---

## 👤 ユーザー
*2023/5/22 18:31:13*

であれば、RawValueable で String になるような protocol を継承させればいいのでは？

---

## 🤖 アシスタント
*2023/5/22 18:32:20*

そのアイデアは正確で、共通のプロトコルを実装してその中にString型のRawValueを含めることで、Enum同士の比較をより簡潔に行うことができます。

以下にその例を示します：

まず、`RawValueable`というプロトコルを作成します。これには、String型のRawValueを持つプロパティ`rawValue`を含めます。

```swift
protocol RawValueable {
    var rawValue: String { get }
}
```

次に、各enumがこの`RawValueable`プロトコルを採用するようにします：

```swift
enum FirstEnum: String, RawValueable {
    case case1 = "case1"
    case case2 = "case2"
    case case3 = "case3"
}

enum SecondEnum: String, RawValueable {
    case caseA = "caseA"
    case caseB = "caseB"
    case caseC = "case3"
}
```

そして、`WrapperEnum`を定義します。これには、`RawValueable`を連想値として含めます：

```swift
enum WrapperEnum {
    case firstCase(value: RawValueable)
    case secondCase(value: RawValueable)
}
```

最後に、`WrapperEnum`に`Equatable`プロトコルを採用し、連想値の`rawValue`の比較に基づいてEnumの等価性を判断します：

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.firstCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        }
    }
}
```

以上の定義に基づいて、以下のように`WrapperEnum`の値の等価性を調べることが可能です。

```swift
let value1 = WrapperEnum.firstCase(value: FirstEnum.case3)
let value2 = WrapperEnum.secondCase(value: SecondEnum.caseC)

if value1 == value2 {
    print("value1 and value2 are equal")
} else {
    print("value1 and value2 are not equal")
}
```

このように、`RawValueable`プロトコルを採用することで、Enumが持つRawValueを活用してEnum同士の比較を行うことが可能になります。

---

## 👤 ユーザー
*2023/5/22 18:34:11*

これ ThirdCase が増えたら Equatable  のパターンが爆発的に増えてしまうけどいいほうほうないの？

---

## 🤖 アシスタント
*2023/5/22 18:35:21*

確かに、その懸念は正当です。新しいケースが追加されるたびに、`Equatable` の実装が増えていくとコードが複雑化します。

しかし、ここではプロトコル（`RawValueable`）の`rawValue`プロパティを使って比較しているため、それぞれのケースについて個別に等価性をチェックする必要はありません。連想値の型が`RawValueable`であることが保証されているため、`WrapperEnum`のすべてのケースについて一般的な等価性チェックを書くことができます。

そのため、以下のように`Equatable`の実装をシンプルにすることができます：

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.thirdCase(value1), .thirdCase(value2)):
            return value1.rawValue == value2.rawValue
        default:
            return false
        }
    }
}
```

この実装では、新たなケースが追加されても、それぞれのケースについての等価性チェックは1行だけ追加するだけで済みます。

なお、この実装では`WrapperEnum`の異なるケース間の等価性は考慮されていません。すなわち、`firstCase`と`secondCase`（または`thirdCase`）が同じ`rawValue`を持つ場合でも、それらは等しくないと判断されます。これは、`WrapperEnum`のケース自体が異なるためです。もしケース自体の違いを無視して`rawValue`だけで等価性を判断したいのであれば、以下のように`WrapperEnum`の`Equatable`を実装することも可能です：

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        return lhs.rawValue == rhs.rawValue
    }
    
    var rawValue: String {
        switch self {
        case let .firstCase(value):
            return value.rawValue
        case let .secondCase(value):
            return value.rawValue
        case let .thirdCase(value):
            return value.rawValue
        }
    }
}
```

この場合、`WrapperEnum`のすべてのケースはその`rawValue`に基づいて等価性を判断します。

---

## 👤 ユーザー
*2023/5/22 18:39:31*

うんこれでよさそうだね
```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        switch (lhs, rhs) {
        case let (.firstCase(value1), .firstCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.secondCase(value1), .secondCase(value2)):
            return value1.rawValue == value2.rawValue
        case let (.thirdCase(value1), .thirdCase(value2)):
            return value1.rawValue == value2.rawValue
        default:
            return false
        }
    }
}
```

---

## 🤖 アシスタント
*2023/5/22 18:40:16*

はい、そのコードは`WrapperEnum`の各ケースに対する等価性を正しく評価できます。連想値の型が`RawValueable`であることを利用しているので、新たなケースを追加する際も等価性チェックのコードは簡潔に保つことができます。

次のステップとしては、新たなケースを`WrapperEnum`に追加する場合、`Equatable`の実装にそのケースに対応する新たな行を追加することを忘れないようにすることが重要です。

また、一部のケースでは、`WrapperEnum`の異なるケース間の等価性（例えば、`firstCase`と`secondCase`が同じ`rawValue`を持つ場合）を考慮したい場合もあるかもしれません。そのような場合は、`WrapperEnum`の等価性を判断する方法を適宜調整する必要があります。

以上で、SwiftのEnumとプロトコルを活用した等価性の判断についての解説を終わります。これがお役に立てれば幸いです。何か他にご質問があればお気軽にどうぞ。

---

## 👤 ユーザー
*2023/5/22 18:41:05*

なるほど、追加忘れの可能性があるのか、以下のコードだと追加忘れはないんだっけ？

```swift
extension WrapperEnum: Equatable {
    static func ==(lhs: WrapperEnum, rhs: WrapperEnum) -> Bool {
        return lhs.rawValue == rhs.rawValue
    }
    
    var rawValue: String {
        switch self {
        case let .firstCase(value):
            return value.rawValue
        case let .secondCase(value):
            return value.rawValue
        case let .thirdCase(value):
            return value.rawValue
        }
    }
}
```

---

## 🤖 アシスタント
*2023/5/22 18:41:48*

そのコードはある程度の追加忘れのリスクを減らすことができます。新たなケースを`WrapperEnum`に追加した場合でも、`rawValue`プロパティのswitch文にそのケースを追加するだけで等価性の判断が可能になります。

ただし、この方法も完全に追加忘れのリスクをなくすわけではありません。新たなケースを`WrapperEnum`に追加した際には、そのケースを`rawValue`プロパティのswitch文に追加することを忘れないようにする必要があります。

さらに、このコードは`WrapperEnum`のケース自体の違いを無視して、その連想値の`rawValue`だけに基づいて等価性を判断します。このため、`WrapperEnum`の異なるケースが同じ`rawValue`を持つ場合でも、それらは等しいと判断されます。これが期待する動作であるかどうかは、アプリケーションの具体的な要件によります。

以上のように、どの方法を選択するかは要件や開発チームの好みによるところが大きいです。それぞれの方法にはそれぞれの利点と欠点があり、それらを考慮して最適な方法を選択することが重要です。

---

## 👤 ユーザー
*2023/5/22 18:42:14*

WrapperEnumに追加した際には、そのケースをrawValueプロパティのswitch文に追加しなかったらビルドは通らないよね

---

## 🤖 アシスタント
*2023/5/22 18:42:49*

はい、その通りです。Swiftは静的型付け言語であり、`switch`文は全ての列挙型のケースを網羅しなければコンパイルエラーとなります。

もし新たなケースを`WrapperEnum`に追加した場合、そのケースを`rawValue`プロパティの`switch`文に追加しないと、コンパイラが`switch`文が全てのケースを網羅していないと判断し、ビルドエラーを出します。つまり、この方法であれば新たなケースを`rawValue`プロパティに追加するのを忘れるリスクをほぼ完全に排除することができます。

なお、Swiftには`default`キーワードもありますが、列挙型の`switch`文には通常使わない方が良いとされています。なぜなら、新たなケースを追加した時に`switch`文がそれを網羅していないことをコンパイラが検出してくれなくなるからです。

---
