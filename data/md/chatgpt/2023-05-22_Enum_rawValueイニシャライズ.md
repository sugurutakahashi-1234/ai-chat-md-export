# Enum rawValueイニシャライズ

日付: 2023-05-22

---

## 👤 ユーザー
*2023/05/22 15:56:21*

Swift enum rawValue String を使ったイニシャライズ処理の例をおしえてほしい

---

## 🤖 アシスタント
*2023/05/22 15:57:11*

Swiftの列挙型(enum)は個々のケースに対して`rawValue`を持つことができます。この`rawValue`はそのケースが一意に表す値を提供します。`rawValue`を利用することで、具体的な値から対応するenumのケースを作成したり、enumのケースから具体的な値を取得したりすることができます。

以下に`rawValue`を使ったイニシャライズ処理の例を示します。ここでは、文字列を`rawValue`とするenumを定義し、文字列からenumのインスタンスを作成します。

```swift
enum Fruit: String {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

// 文字列からenumを作成する
let fruit = Fruit(rawValue: "Apple")

// rawValueから作成されたenumはOptionalになるので、switch文を使ってunwrapすることができます。
switch fruit {
case .some(.apple):
    print("This is an apple.")
case .some(.banana):
    print("This is a banana.")
case .some(.cherry):
    print("This is a cherry.")
case .none:
    print("No such fruit exists.")
}
```

上記のコードでは、"Apple"という文字列から対応する`Fruit.apple`を作成しています。その後、switch文を用いて作成されたenumを処理しています。

このように、enumの`rawValue`はSwiftのenumが持つ強力な機能の一つです。ある特定の型の値をenumに関連付け、その値からenumのケースを作成したり、enumのケースからその値を取得したりすることが可能になります。

---

## 👤 ユーザー
*2023/05/22 15:58:54*

Fruit の定義にundefinedを追加して、Apple だったらapple、Bananaだったらbanana、Cherryだったらcherry、それ以外だったらundefinedのように変換するイニシャライザをつくってほしい

---

## 🤖 アシスタント
*2023/05/22 15:59:32*

要求された内容に従って、`undefined`のケースを追加し、それ以外の値が渡された場合に`undefined`を返すイニシャライザを作成します。

```swift
enum Fruit: String {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
    case undefined = "Undefined"

    init(type: String) {
        switch type {
        case "Apple":
            self = .apple
        case "Banana":
            self = .banana
        case "Cherry":
            self = .cherry
        default:
            self = .undefined
        }
    }
}

let fruit1 = Fruit(type: "Apple")
print(fruit1.rawValue)  // "Apple"

let fruit2 = Fruit(type: "Banana")
print(fruit2.rawValue)  // "Banana"

let fruit3 = Fruit(type: "Cherry")
print(fruit3.rawValue)  // "Cherry"

let fruit4 = Fruit(type: "Pineapple") 
print(fruit4.rawValue)  // "Undefined"
```

このコードは、引数`type`に渡された文字列に基づいてenumのケースを作成します。"Apple"、"Banana"、"Cherry"のいずれかが渡された場合、対応するケースが作成されます。それ以外の値が渡された場合、`undefined`ケースが作成されます。

以上のように、イニシャライザを使用して、必要に応じて適切なenumのケースを作成することが可能です。

---

## 👤 ユーザー
*2023/05/22 16:00:13*

initのなかのswiftで"Apple"としているところをrawValueなどを使わずに、Stringを取得するコンピューテットプロパティを別に定義してそれをつかうようにしてほしい

---

## 🤖 アシスタント
*2023/05/22 16:00:58*

要求された内容に基づき、`Fruit` enumに対して文字列を取得するためのコンピューテッドプロパティを追加し、イニシャライザ内部でこのプロパティを利用するようにコードを修正します。

```swift
enum Fruit: String {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
    case undefined = "Undefined"

    static var allCasesNames: [String] {
        return [Fruit.apple.rawValue, Fruit.banana.rawValue, Fruit.cherry.rawValue, Fruit.undefined.rawValue]
    }

    init(type: String) {
        if Fruit.allCasesNames.contains(type) {
            self = Fruit(rawValue: type) ?? .undefined
        } else {
            self = .undefined
        }
    }
}

let fruit1 = Fruit(type: "Apple")
print(fruit1.rawValue)  // "Apple"

let fruit2 = Fruit(type: "Banana")
print(fruit2.rawValue)  // "Banana"

let fruit3 = Fruit(type: "Cherry")
print(fruit3.rawValue)  // "Cherry"

let fruit4 = Fruit(type: "Pineapple")
print(fruit4.rawValue)  // "Undefined"
```

ここでは、`allCasesNames`というコンピューテッドプロパティを`Fruit` enumに追加しました。このプロパティは`Fruit`の全ケースの`rawValue`を配列で返します。そして、イニシャライザ内部でこのプロパティを使って`type`が既存の`Fruit`のケースにマッチするかを確認しています。もしマッチすれば、その`rawValue`を持つ`Fruit`を生成し、そうでなければ`undefined`を生成します。

---

## 👤 ユーザー
*2023/05/22 16:01:05*

rawValue を使うのをやめてほしい

---

## 🤖 アシスタント
*2023/05/22 16:01:47*

すみません、`rawValue`の使用を完全に避けたいということであれば、`Fruit`の列挙型を次のように修正することができます。

```swift
enum Fruit {
    case apple
    case banana
    case cherry
    case undefined

    var name: String {
        switch self {
        case .apple:
            return "Apple"
        case .banana:
            return "Banana"
        case .cherry:
            return "Cherry"
        case .undefined:
            return "Undefined"
        }
    }

    static var allNames: [String] {
        return [Fruit.apple.name, Fruit.banana.name, Fruit.cherry.name, Fruit.undefined.name]
    }

    init(type: String) {
        switch type {
        case Fruit.apple.name:
            self = .apple
        case Fruit.banana.name:
            self = .banana
        case Fruit.cherry.name:
            self = .cherry
        default:
            self = .undefined
        }
    }
}

let fruit1 = Fruit(type: "Apple")
print(fruit1.name)  // "Apple"

let fruit2 = Fruit(type: "Banana")
print(fruit2.name)  // "Banana"

let fruit3 = Fruit(type: "Cherry")
print(fruit3.name)  // "Cherry"

let fruit4 = Fruit(type: "Pineapple")
print(fruit4.name)  // "Undefined"
```

ここでは、各ケースの名称を取得するために、`name`というコンピューテッドプロパティを追加しました。そして、そのプロパティを用いてイニシャライザ内で適切なケースを選択します。

---

## 👤 ユーザー
*2023/05/22 16:01:50*

allNames という定義いりますか？

---

## 🤖 アシスタント
*2023/05/22 16:02:32*

申し訳ありません、その通りです。`allNames`はこの場合においては必要ないです。特に`Fruit`列挙型のインスタンスを作成する際に全ての名前を取得するという要件がなければ、このプロパティは不要です。

以下に修正したコードを示します:

```swift
enum Fruit {
    case apple
    case banana
    case cherry
    case undefined

    var name: String {
        switch self {
        case .apple:
            return "Apple"
        case .banana:
            return "Banana"
        case .cherry:
            return "Cherry"
        case .undefined:
            return "Undefined"
        }
    }

    init(type: String) {
        switch type {
        case Fruit.apple.name:
            self = .apple
        case Fruit.banana.name:
            self = .banana
        case Fruit.cherry.name:
            self = .cherry
        default:
            self = .undefined
        }
    }
}

let fruit1 = Fruit(type: "Apple")
print(fruit1.name)  // "Apple"

let fruit2 = Fruit(type: "Banana")
print(fruit2.name)  // "Banana"

let fruit3 = Fruit(type: "Cherry")
print(fruit3.name)  // "Cherry"

let fruit4 = Fruit(type: "Pineapple")
print(fruit4.name)  // "Undefined"
```

このコードでは、初期化子`init(type: String)`が引数の文字列`type`を直接比較し、対応する列挙型の値を割り当てます。それ以外の場合、`undefined`を割り当てます。

---

## 👤 ユーザー
*2023/05/22 16:03:21*

以下で同様の定義を作成してほしい。ただ、nameのStringは小文字でお願い

```
public enum MmotionType {
    case anger
    case contempt
    case disgust
    case fear
    case happy
    case neutral
    case sad
    case surprise
    case undefined
}

---

## 🤖 アシスタント
*2023/05/22 16:04:09*

あなたの要求に応じて、下記のように`MmotionType` enumを定義します。各ケースの`name`は小文字の文字列となります。

```swift
public enum MmotionType {
    case anger
    case contempt
    case disgust
    case fear
    case happy
    case neutral
    case sad
    case surprise
    case undefined

    var name: String {
        switch self {
        case .anger:
            return "anger"
        case .contempt:
            return "contempt"
        case .disgust:
            return "disgust"
        case .fear:
            return "fear"
        case .happy:
            return "happy"
        case .neutral:
            return "neutral"
        case .sad:
            return "sad"
        case .surprise:
            return "surprise"
        case .undefined:
            return "undefined"
        }
    }

    init(type: String) {
        switch type {
        case MmotionType.anger.name:
            self = .anger
        case MmotionType.contempt.name:
            self = .contempt
        case MmotionType.disgust.name:
            self = .disgust
        case MmotionType.fear.name:
            self = .fear
        case MmotionType.happy.name:
            self = .happy
        case MmotionType.neutral.name:
            self = .neutral
        case MmotionType.sad.name:
            self = .sad
        case MmotionType.surprise.name:
            self = .surprise
        default:
            self = .undefined
        }
    }
}

let motion1 = MmotionType(type: "anger")
print(motion1.name)  // "anger"

let motion2 = MmotionType(type: "happy")
print(motion2.name)  // "happy"

let motion3 = MmotionType(type: "neutral")
print(motion3.name)  // "neutral"

let motion4 = MmotionType(type: "unknown")
print(motion4.name)  // "undefined"
```

このコードでは、与えられた文字列`type`に対応する`MmotionType`を作成しています。文字列が既存のケースに一致しない場合、`undefined`を返します。

---

## 👤 ユーザー
*2023/05/22 16:07:47*

ちなみに内部でallNameみたいに全caseの文字列を配列で持って、それが一致するcaseをinitで設定するみたいなことはできない？

---

## 🤖 アシスタント
*2023/05/22 16:09:42*

Swiftの列挙型には`CaseIterable`プロトコルというものがあります。これを用いると、全てのケースを簡単に取得することができます。しかし、それは列挙型の各ケースに対して文字列ではなく、それ自体のケースを返します。

ですので、全てのケースの名前を配列で取得し、それをinitで使うというのは直接的にはできません。ただし、列挙型に`name`というコンピューテッドプロパティを定義し、そのプロパティを用いて全ケースの名前を取得することは可能です。

以下に具体的なコードを示します:

```swift
public enum MmotionType: CaseIterable {
    case anger
    case contempt
    case disgust
    case fear
    case happy
    case neutral
    case sad
    case surprise
    case undefined

    var name: String {
        switch self {
        case .anger:
            return "anger"
        case .contempt:
            return "contempt"
        case .disgust:
            return "disgust"
        case .fear:
            return "fear"
        case .happy:
            return "happy"
        case .neutral:
            return "neutral"
        case .sad:
            return "sad"
        case .surprise:
            return "surprise"
        case .undefined:
            return "undefined"
        }
    }

    static var allNames: [String] {
        return MmotionType.allCases.map { $0.name }
    }

    init(type: String) {
        if let match = MmotionType.allCases.first(where: { $0.name == type }) {
            self = match
        } else {
            self = .undefined
        }
    }
}

let motion1 = MmotionType(type: "anger")
print(motion1.name)  // "anger"

let motion2 = MmotionType(type: "happy")
print(motion2.name)  // "happy"

let motion3 = MmotionType(type: "neutral")
print(motion3.name)  // "neutral"

let motion4 = MmotionType(type: "unknown")
print(motion4.name)  // "undefined"
```

このコードでは、全てのケースの名前を配列として取得する`allNames`というコンピューテッドプロパティを追加しています。そして、イニシャライザ内で`allNames`を利用して該当するケースを探し出し、そのケースを初期化に使用しています。それ以外の場合は`undefined`を使用しています。

---

## 👤 ユーザー
*2023/05/22 16:11:27*

以下の処理でundefinedをdropしてmapさせたいんだけど
```
static var allNames: [String] {
        return MmotionType.allCases.map { $0.name }
    }
```

---

## 🤖 アシスタント
*2023/05/22 16:11:44*

ご要望の通り、`undefined`を除外した全てのケースの名前を取得する`allNames`を作成するには、`filter`メソッドを用いて`undefined`を除外し、その後`map`メソッドで名前を取得します。

```swift
static var allNames: [String] {
    return MmotionType.allCases.filter { $0 != .undefined }.map { $0.name }
}
```

このコードでは、まず`filter`メソッドを用いてケースが`undefined`でないものを選択します。その後、`map`メソッドを用いてそれらのケースの名前を取得します。

---
