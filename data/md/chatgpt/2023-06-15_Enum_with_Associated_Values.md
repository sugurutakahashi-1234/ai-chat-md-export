# Enum with Associated Values

日付: 2023-06-15

---

## 👤 ユーザー
*2023/6/16 0:05:47*

enumの連想値を持つenumを定義してそれをCaseIterableに適応する方法をおしえてほしい

---

## 🤖 アシスタント
*2023/6/16 0:06:40*

Swiftのenumには連想値という便利な機能があります。しかし、`CaseIterable`を使ってすべてのケースを取得することは、連想値がある場合には直接できません。なぜなら、連想値はenumの定義時には特定できず、実行時にのみ設定できるからです。

ただし、特定の連想値を持つenumのすべてのケースを取得する必要があるなら、それぞれの連想値に対して独自のケースを作成するなど、デザインを少し工夫することで対応することができます。

例えば次のようなenumがあるとします。

```swift
enum Example {
    case one(String)
    case two(Int)
}
```

`CaseIterable`を直接適用することはできません。しかし、連想値を保持しない別のenumを作成し、それを`CaseIterable`に適用することで対応することができます。

```swift
enum ExampleValues: CaseIterable {
    case one
    case two

    // この関数を使って、ExampleValuesのケースに対応するExampleの値を生成します。
    func toExample() -> Example {
        switch self {
        case .one:
            return Example.one("Example")
        case .two:
            return Example.two(2)
        }
    }
}
```

これにより、`ExampleValues`のすべてのケースを取得し、それらを対応する`Example`の値に変換することが可能になります。

```swift
for value in ExampleValues.allCases {
    let example = value.toExample()
    // do something with example
}
```

これが、現時点でのSwiftの制約に対する最もよく使われるワークアラウンドです。

---

## 👤 ユーザー
*2023/6/16 0:06:44*

連想値にCaseIterableが適応されたenumをせっていしてほしいんだ

---

## 🤖 アシスタント
*2023/6/16 0:07:27*

もし、連想値に`CaseIterable`が適用されたenumがある場合、それをenumの連想値として持つことは可能です。しかし、外部のenumが直接`CaseIterable`を適用できるわけではないことに注意してください。

以下に例を示します：

```swift
enum InnerEnum: CaseIterable {
    case case1
    case case2
    case case3
}

enum OuterEnum {
    case caseA(InnerEnum)
    case caseB
}
```

この場合、`InnerEnum`は`CaseIterable`に準拠しているため、そのすべてのケースにアクセスできます。しかし、`OuterEnum`は連想値の違いにより`CaseIterable`に準拠できません。そのため、すべてのケースを取得するためのカスタムメソッドを実装することになります。

以下にその例を示します：

```swift
enum OuterEnum {
    case caseA(InnerEnum)
    case caseB

    static var allCases: [OuterEnum] {
        var cases: [OuterEnum] = []
        for innerCase in InnerEnum.allCases {
            cases.append(OuterEnum.caseA(innerCase))
        }
        cases.append(.caseB)
        return cases
    }
}
```

上記のコードでは、`OuterEnum.allCases`は`OuterEnum`のすべてのケースの配列を返します。これには`caseA`の各`InnerEnum`ケースと`caseB`が含まれます。

---

## 👤 ユーザー
*2023/6/16 0:07:43*

for文ではなくて、forEachをつかってほしい

---

## 🤖 アシスタント
*2023/6/16 0:08:08*

もちろんです、`forEach`を使用して上記の例を改良することができます。

以下にその例を示します：

```swift
enum OuterEnum {
    case caseA(InnerEnum)
    case caseB

    static var allCases: [OuterEnum] {
        var cases: [OuterEnum] = []
        InnerEnum.allCases.forEach { innerCase in
            cases.append(OuterEnum.caseA(innerCase))
        }
        cases.append(.caseB)
        return cases
    }
}
```

このコードでは、`forEach`を使って`InnerEnum.allCases`の各要素に対して操作を行い、それぞれのケースを`OuterEnum.caseA`として`cases`配列に追加しています。最後に、`caseB`を配列に追加します。これで、`OuterEnum.allCases`は`OuterEnum`のすべてのケースの配列を返すようになります。

---

## 👤 ユーザー
*2023/6/16 0:08:46*

caseCが増えた時にallCasesを修正しないとコンパイルが通らないような工夫を入れたい

---

## 🤖 アシスタント
*2023/6/16 0:09:52*

SwiftのenumではCaseIterableプロトコルを適用することで全てのケースを列挙することができますが、これは連想値を持つenumに対しては適用できません。これはSwiftの言語設計上の制約です。

しかし、Swiftの静的型検査の特性を利用してコンパイル時にenumのケースが増えた時にエラーを出すような工夫は可能です。それには以下のように全てのケースをチェックするprivateな関数を用意します：

```swift
enum InnerEnum: CaseIterable {
    case case1
    case case2
    case case3
}

enum OuterEnum {
    case caseA(InnerEnum)
    case caseB
    case caseC

    static var allCases: [OuterEnum] {
        var cases: [OuterEnum] = []
        InnerEnum.allCases.forEach { innerCase in
            cases.append(OuterEnum.caseA(innerCase))
        }
        cases.append(.caseB)
        cases.append(.caseC)
        return cases
    }

    private static func checkAllCases(included: OuterEnum) {
        switch included {
        case .caseA(let inner):
            print(inner)
        case .caseB:
            print("caseB")
        case .caseC:
            print("caseC")
        }
    }
}
```

上記のコードでは、全てのケースが`checkAllCases(included:)`関数内のswitch文で網羅されていることを確認しています。これにより、`OuterEnum`に新たなケースを追加しようとすると、そのケースを`checkAllCases(included:)`関数内で処理していないため、コンパイルエラーが発生します。

ただし、これはあくまでケースの網羅性を確認するための工夫であり、直接的には`allCases`の実装を更新することは強制しないため、新たなケースを追加した際には`allCases`の実装も手動で更新する必要があります。

また、このコードでは`checkAllCases(included:)`関数は何も呼び出していませんが、これはダミーの関数であり、その目的は全てのケースを網羅するswitch文を書くことで静的型検査を活用することです。なのでこの関数は実際には呼び出す必要はありません。

---

## 👤 ユーザー
*2023/6/16 0:10:14*

ダミーの関数であることをもっとアピールする方法はないの？

---

## 🤖 アシスタント
*2023/6/16 0:10:55*

確かに、`checkAllCases(included:)`関数がダミーの関数であり、実際には呼び出さないことを明示する方法として、その関数を`@available`アノテーションを使って非推奨にすることができます。これにより、関数が意図的に呼び出されないようにすることができます。

以下にその例を示します。

```swift
enum InnerEnum: CaseIterable {
    case case1
    case case2
    case case3
}

enum OuterEnum {
    case caseA(InnerEnum)
    case caseB
    case caseC

    static var allCases: [OuterEnum] {
        var cases: [OuterEnum] = []
        InnerEnum.allCases.forEach { innerCase in
            cases.append(OuterEnum.caseA(innerCase))
        }
        cases.append(.caseB)
        cases.append(.caseC)
        return cases
    }

    @available(*, deprecated, message: "This function is only used for compile-time checks and should not be called.")
    private static func checkAllCases(included: OuterEnum) {
        switch included {
        case .caseA(let inner):
            print(inner)
        case .caseB:
            print("caseB")
        case .caseC:
            print("caseC")
        }
    }
}
```

このようにすると、`checkAllCases(included:)`関数は非推奨としてマークされ、それが意図的に呼び出されないことが明示されます。呼び出しを試みると、非推奨の警告が表示されます。

---

## 👤 ユーザー
*2023/6/16 0:11:03*

printの処理すらいらないんだけど。

---

## 🤖 アシスタント
*2023/6/16 0:11:37*

全くです。ダミーの関数であれば、ケースを列挙するだけで実際の処理は不要です。そのため、`print`ステートメントを削除しても全く問題ありません。

```swift
enum InnerEnum: CaseIterable {
    case case1
    case case2
    case case3
}

enum OuterEnum {
    case caseA(InnerEnum)
    case caseB
    case caseC

    static var allCases: [OuterEnum] {
        var cases: [OuterEnum] = []
        InnerEnum.allCases.forEach { innerCase in
            cases.append(OuterEnum.caseA(innerCase))
        }
        cases.append(.caseB)
        cases.append(.caseC)
        return cases
    }

    @available(*, deprecated, message: "This function is only used for compile-time checks and should not be called.")
    private static func checkAllCases(included: OuterEnum) {
        switch included {
        case .caseA:
            break
        case .caseB:
            break
        case .caseC:
            break
        }
    }
}
```

これで、全てのケースが`checkAllCases(included:)`関数内で列挙されていることを確認でき、新たなケースを追加するとコンパイルエラーが発生します。同時に、この関数はダミーであり実際には呼び出さないことを明示しています。

---
