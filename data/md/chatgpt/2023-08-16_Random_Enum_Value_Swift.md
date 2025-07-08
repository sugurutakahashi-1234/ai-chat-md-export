# Random Enum Value Swift

日付: 2023-08-16

---

## 👤 ユーザー
*2023/08/16 13:26:26*

Swift の enum から randomで値を取得したい場合どうすればいい？

---

## 🤖 アシスタント
*2023/08/16 13:26:53*

Swiftの`enum`からランダムな値を取得するためには、まずその`enum`の全ケースを取得する方法とランダムなインデックスを選択する方法が必要です。Swift 4.2以降、`CaseIterable`というプロトコルが追加され、これを使うと`enum`の全ケースに簡単にアクセスできます。

以下は`enum`からランダムな値を取得する例です：

```swift
enum Fruit: CaseIterable {
    case apple, banana, orange, grape

    static var random: Fruit {
        let allCases = self.allCases
        let randomIndex = Int.random(in: 0..<allCases.count)
        return allCases[randomIndex]
    }
}

let randomFruit = Fruit.random
print(randomFruit) // これでランダムなフルーツが表示されます
```

この例では、`Fruit`という名前の`enum`を定義しています。`CaseIterable`プロトコルを採用して、`allCases`というプロパティを使用して`enum`のすべてのケースを取得できるようにしています。

`random`という静的な計算プロパティを追加して、`allCases`からランダムなインデックスを使用してランダムなケースを取得しています。

このアプローチを使用すると、新しいケースを`enum`に追加しても、その新しいケースもランダムな選択に含まれるようになります。

---

## 👤 ユーザー
*2023/08/16 13:27:19*

これのprotocolを作ってエクステンションで記述できたりしないかな？

---

## 🤖 アシスタント
*2023/08/16 13:27:42*

もちろん、`protocol`とエクステンションを使用してこの機能を汎用的に作成することができます。これにより、任意の`enum`でランダムな値を簡単に取得できるようになります。

以下はその方法の例です：

1. `Randomizable`というプロトコルを定義します。このプロトコルは`CaseIterable`を継承することで、採用する`enum`が`allCases`を持つことを保証します。

2. このプロトコルに対するデフォルト実装をエクステンションを使用して提供します。この実装では、ランダムな`enum`の値を取得する方法を提供します。

```swift
// 1. プロトコルの定義
protocol Randomizable: CaseIterable {}

// 2. デフォルト実装の提供
extension Randomizable {
    static var random: Self {
        let all = Self.allCases
        let index = Int.random(in: 0..<all.count)
        return all[index]
    }
}

// 使用例
enum Fruit: Randomizable {
    case apple, banana, orange, grape
}

let randomFruit = Fruit.random
print(randomFruit) // ランダムなフルーツが表示されます
```

この方法を使用すると、任意の`enum`に`Randomizable`プロトコルを採用するだけで、`random`プロパティを介してランダムな値を取得できるようになります。

---

## 👤 ユーザー
*2023/08/16 13:29:02*

Cannot convert value of type 'Int' to expected argument type 'Self.AllCases.Index'というエラーになった

---

## 🤖 アシスタント
*2023/08/16 13:29:18*

申し訳ございません、そのエラーは`allCases`が`Array`ではなく、`Collection`タイプを返すために発生します。`Collection`のインデックスは必ずしも`Int`であるとは限らないため、この問題が発生します。

この問題を解決するために、`Array`にキャストしてからランダムなインデックスを取得することができます。

以下は修正されたコードの例です：

```swift
protocol Randomizable: CaseIterable {}

extension Randomizable {
    static var random: Self {
        let all = Array(self.allCases)
        let index = Int.random(in: 0..<all.count)
        return all[index]
    }
}

enum Fruit: Randomizable {
    case apple, banana, orange, grape
}

let randomFruit = Fruit.random
print(randomFruit)
```

ここでは、`self.allCases`を明示的に`Array`にキャストしてからインデックスを取得することで、`Int`としてランダムなインデックスを使用できるようにしています。

---

## 👤 ユーザー
*2023/08/16 13:35:14*

任意の数の配列を生成する処理を描く場合

---

## 🤖 アシスタント
*2023/08/16 13:35:41*

任意の数の配列を生成する場合、具体的な要件に応じて方法を調整することができます。以下はいくつかの一般的なシナリオと、それに対するSwiftでの実装例を示しています。

1. **指定された長さのランダムな整数の配列を生成**:

```swift
func generateRandomIntegers(count: Int, range: Range<Int>) -> [Int] {
    return (0..<count).map { _ in Int.random(in: range) }
}

let randomIntegers = generateRandomIntegers(count: 10, range: 1..<100)
print(randomIntegers)
```

この関数は、指定された範囲内のランダムな整数の配列を生成します。

2. **指定された長さのランダムな浮動小数点数の配列を生成**:

```swift
func generateRandomDoubles(count: Int, range: ClosedRange<Double>) -> [Double] {
    return (0..<count).map { _ in Double.random(in: range) }
}

let randomDoubles = generateRandomDoubles(count: 10, range: 0.0...1.0)
print(randomDoubles)
```

3. **指定された長さの`enum`のランダムな値の配列を生成**:

先ほど定義した`Randomizable`プロトコルを使用します:

```swift
func generateRandomEnumValues<T: Randomizable>(count: Int) -> [T] {
    return (0..<count).map { _ in T.random }
}

enum Fruit: Randomizable {
    case apple, banana, orange, grape
}

let randomFruits = generateRandomEnumValues(count: 5) as [Fruit]
print(randomFruits)
```

上記の例では、指定された`count`の数だけランダムな`enum`の値の配列を生成します。

これらの関数は、さまざまなタイプと要件に応じてカスタマイズと拡張が可能です。

---

## 👤 ユーザー
*2023/08/16 14:00:12*

既存のrandomを維持しながらcountを引数にとって文字列を制限させたい

public extension String {
    static var random: String {
        let length = Int.random(in: 0...300)
        let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        var randomString = ""

        for _ in 0...length {
            let randomValue = Int.random(in: 0...base.count - 1)
            let index: Index = base.index(base.startIndex, offsetBy: randomValue)
            let character: Character = base[index]
            randomString += String(character)
        }
        return randomString
    }
}

---

## 🤖 アシスタント
*2023/08/16 14:00:40*

既存の`random`プロパティを維持しながら、文字列の長さを制限するための新しいメソッドを追加することができます。この新しいメソッドでは`count`を引数として受け取り、それを基にランダムな文字列を生成します。

以下のように実装できます：

```swift
public extension String {
    static var random: String {
        random(ofLength: Int.random(in: 0...300))
    }

    static func random(ofLength length: Int) -> String {
        let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        var randomString = ""

        for _ in 0..<length {
            let randomValue = Int.random(in: 0..<base.count)
            let index: Index = base.index(base.startIndex, offsetBy: randomValue)
            let character: Character = base[index]
            randomString += String(character)
        }
        return randomString
    }
}
```

このように、`random(ofLength:)`メソッドを追加して、任意の長さのランダムな文字列を生成することができます。既存の`random`プロパティも保持されており、0から300の間のランダムな長さの文字列を返すようになっています。

使用例：

```swift
let randomStr = String.random // 0〜300の長さのランダムな文字列
print(randomStr)

let specificLengthStr = String.random(ofLength: 10) // 長さ10のランダムな文字列
print(specificLengthStr)
```

こちらで、要件を満たす形になったかと思います。

---

## 👤 ユーザー
*2023/08/16 14:00:57*

static func random(count: Int)のインターフェースにして欲しい

---

## 🤖 アシスタント
*2023/08/16 14:01:20*

了解しました。指定されたインターフェースに基づいて、`static func random(count: Int)`を追加し、`random`プロパティをその関数を使用する形に変更します。

```swift
public extension String {
    static func random(count: Int? = nil) -> String {
        let length = count ?? Int.random(in: 0...300)
        let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        var randomString = ""

        for _ in 0..<length {
            let randomValue = Int.random(in: 0..<base.count)
            let index: Index = base.index(base.startIndex, offsetBy: randomValue)
            let character: Character = base[index]
            randomString += String(character)
        }
        return randomString
    }
}
```

この方法で、`count`引数を省略して`String.random()`を呼び出すと、0から300の間のランダムな長さの文字列が生成されます。一方、`String.random(count: 10)`のように`count`引数を提供すると、指定された長さのランダムな文字列が生成されます。

使用例：

```swift
let randomStr = String.random() // 0〜300の長さのランダムな文字列
print(randomStr)

let specificLengthStr = String.random(count: 10) // 長さ10のランダムな文字列
print(specificLengthStr)
```

この形になると、インターフェースがシンプルになり、使いやすくなると思います。

---

## 👤 ユーザー
*2023/08/16 14:01:39*

nilを許容したくない。使い分けしたい。

---

## 🤖 アシスタント
*2023/08/16 14:01:58*

了解しました。`nil`を許容せず、使い分けを明確にするため、既存の`random`プロパティと`random(count: Int)`メソッドを分けて実装します。

以下がその実装例です：

```swift
public extension String {
    static var random: String {
        return random(count: Int.random(in: 0...300))
    }

    static func random(count: Int) -> String {
        let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        var randomString = ""

        for _ in 0..<count {
            let randomValue = Int.random(in: 0..<base.count)
            let index: Index = base.index(base.startIndex, offsetBy: randomValue)
            let character: Character = base[index]
            randomString += String(character)
        }
        return randomString
    }
}
```

この方法で、`String.random`プロパティを使用して0〜300の長さのランダムな文字列を取得するか、`String.random(count: 10)`のようにして指定された長さのランダムな文字列を取得することができます。

---
