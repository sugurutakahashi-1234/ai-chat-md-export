# Random Samples Without Repeats

Date: 2023-09-05

---

## 👤 User
*2023-09-06 02:28:02*

以下について、リピートせずに毎回抽選するようにして欲しい

public protocol RandomProvidable: CaseIterable {
    static var random: Self { get }
}

public extension RandomProvidable {
    static var random: Self {
        let all = Array(allCases)
        let index = Int.random(in: 0..&lt;all.count)
        return all[index]
    }
}

public extension Array where Element: RandomProvidable {
    static var randomSamples: [Element] {
        Array(repeating: Element.random, count: 5)
    }

    static func randomSamples(count: Int) -&gt; [Element] {
        Array(repeating: Element.random, count: count)
    }

    static func randomSamples(countRange: ClosedRange&lt;Int&gt; = 0...3, isEmptyAllowed: Bool = false) -&gt; [Element] {
        let adjustedRange = isEmptyAllowed ? countRange : (Swift.max(1, countRange.lowerBound)...countRange.upperBound)
        let count = Int.random(in: adjustedRange)
        return Array(repeating: Element.random, count: count)
    }
}

---

## 🤖 Assistant
*2023-09-06 02:28:53*

上記のコードはランダムなサンプルを取得するためのプロトコルおよび拡張を示していますが、それらのサンプルがリピートしないようにするためのロジックが実装されていません。

以下に、リピートしないようにランダムなサンプルを取得するための実装を提供します。この実装では、取得されたサンプルがリピートしないように、一度選ばれた要素をリストから削除します。

```swift
public protocol RandomProvidable: CaseIterable {
    static var random: Self { get }
}

public extension RandomProvidable {
    static var random: Self {
        let all = Array(allCases)
        let index = Int.random(in: 0..<all.count)
        return all[index]
    }
}

public extension Array where Element: RandomProvidable {
    static var randomSamples: [Element] {
        randomSamples(count: 5)
    }

    static func randomSamples(count: Int) -> [Element] {
        var available = Array(Element.allCases)
        var samples: [Element] = []

        for _ in 0..<count {
            if available.isEmpty {
                break
            }
            let index = Int.random(in: 0..<available.count)
            samples.append(available[index])
            available.remove(at: index)
        }
        
        return samples
    }

    static func randomSamples(countRange: ClosedRange<Int> = 0...3, isEmptyAllowed: Bool = false) -> [Element] {
        let adjustedRange = isEmptyAllowed ? countRange : (Swift.max(1, countRange.lowerBound)...countRange.upperBound)
        let count = Int.random(in: adjustedRange)
        return randomSamples(count: count)
    }
}
```

このコードでは、`randomSamples(count: Int)` メソッドを中心に、既に選択されたサンプルを `available` から削除することでリピートを防ぎます。こちらの実装を使用すると、同じ `RandomProvidable` 要素がリピートしてサンプルに含まれることはなくなります。

---

## 👤 User
*2023-09-06 02:29:41*

もっとシンプルでいいんだけど。

---

## 🤖 Assistant
*2023-09-06 02:30:15*

分かりました。もっとシンプルにリピートしないランダムなサンプルを取得する方法を提供します。

以下の実装では、Arrayの`shuffled()`メソッドを使用してすべての要素をシャッフルし、その後、指定された数の要素をスライスとして取得します。

```swift
public protocol RandomProvidable: CaseIterable {
    static var random: Self { get }
}

public extension RandomProvidable {
    static var random: Self {
        let all = Array(allCases)
        let index = Int.random(in: 0..<all.count)
        return all[index]
    }
}

public extension Array where Element: RandomProvidable {
    static var randomSamples: [Element] {
        randomSamples(count: 5)
    }

    static func randomSamples(count: Int) -> [Element] {
        let shuffled = Array(Element.allCases).shuffled()
        return Array(shuffled.prefix(count))
    }

    static func randomSamples(countRange: ClosedRange<Int> = 0...3, isEmptyAllowed: Bool = false) -> [Element] {
        let adjustedRange = isEmptyAllowed ? countRange : (Swift.max(1, countRange.lowerBound)...countRange.upperBound)
        let count = Int.random(in: adjustedRange)
        return randomSamples(count: count)
    }
}
```

この実装はシンプルで、リピートしないサンプルを取得するための方法を提供します。シャッフルした後に前方からスライスを取るだけで、シンプルに実装できています。

---

## 👤 User
*2023-09-06 02:31:44*

数が足りない場合があるよね？自分が気にしているのはリピート関数を使うとせっかくランダムにしゅとくできるのに同じ値しか出力しなくて、重複してもいいからランダムに取得して欲しいんだ。

---

## 🤖 Assistant
*2023-09-06 02:32:18*

失礼しました、要件を理解しました。リピートを使って同じ値が何度も出力されるのを避け、ただしある数を取得する際に重複を許容してランダムに取得したいということですね。

その場合、次のようにシンプルに実装できます。

```swift
public protocol RandomProvidable: CaseIterable {
    static var random: Self { get }
}

public extension RandomProvidable {
    static var random: Self {
        let all = Array(allCases)
        let index = Int.random(in: 0..<all.count)
        return all[index]
    }
}

public extension Array where Element: RandomProvidable {
    static var randomSamples: [Element] {
        randomSamples(count: 5)
    }

    static func randomSamples(count: Int) -> [Element] {
        return (0..<count).map { _ in Element.random }
    }

    static func randomSamples(countRange: ClosedRange<Int> = 0...3, isEmptyAllowed: Bool = false) -> [Element] {
        let adjustedRange = isEmptyAllowed ? countRange : (Swift.max(1, countRange.lowerBound)...countRange.upperBound)
        let count = Int.random(in: adjustedRange)
        return randomSamples(count: count)
    }
}
```

上記の方法で、`randomSamples(count: Int)` では指定された数だけ `Element.random` を使ってランダムなサンプルを取得します。重複は許容されますが、毎回 `Element.random` が呼ばれるので、連続して同じ値が出力されることは少なくなります。

---

## 👤 User
*2023-09-06 02:33:02*

public extension RandomProvidable {
    static var random: Self {
        let all = Array(allCases)
        let index = Int.random(in: 0..&lt;all.count)
        return all[index]
    }
}

は

public extension RandomProvidable {
    static var random: Self {
        allCases.randomElement()!
    }
}

でもよいか？ 強制アンラップしているけど問題ないか？

---

## 🤖 Assistant
*2023-09-06 02:33:34*

はい、`allCases.randomElement()`を使用する方法も`RandomProvidable`の`random`プロパティを実装するための妥当なアプローチです。このメソッドはコレクションからランダムな要素を返します。コードが少しシンプルになります。

ただし、強制アンラップ(`!`)に関しては注意が必要です。この場合、`allCases`は`CaseIterable`プロトコルに由来しており、通常、`CaseIterable`の実装には最低1つのケースが存在するため、`randomElement()`が`nil`を返すことはありません。したがって、この文脈での強制アンラップは安全だと考えられます。

しかしながら、一般的にSwiftでの強制アンラップは避けるべきです。安全性が確保されている場面であっても、将来の変更や他の開発者がコードを読む際に混乱や誤解を招く可能性があります。

安全性を確保するための方法の一つは、`guard`文や`if let`を使用して`nil`チェックを行い、`nil`の場合は適切なデフォルト値を返す、またはエラーをスローするなどの処理を実装することです。

しかし、この具体的なシナリオでは、強制アンラップが問題を引き起こす可能性は低いと考えられます。

---

## 👤 User
*2023-09-06 02:35:42*

ここでは強制アンラップでいいと思う。完成したコードを教えて欲しい

---

## 🤖 Assistant
*2023-09-06 02:36:10*

了解しました。以下が、強制アンラップを使用してシンプルに実装された`RandomProvidable`プロトコルとその拡張になります。

```swift
public protocol RandomProvidable: CaseIterable {
    static var random: Self { get }
}

public extension RandomProvidable {
    static var random: Self {
        return allCases.randomElement()!
    }
}

public extension Array where Element: RandomProvidable {
    static var randomSamples: [Element] {
        return randomSamples(count: 5)
    }

    static func randomSamples(count: Int) -> [Element] {
        return (0..<count).map { _ in Element.random }
    }

    static func randomSamples(countRange: ClosedRange<Int> = 0...3, isEmptyAllowed: Bool = false) -> [Element] {
        let adjustedRange = isEmptyAllowed ? countRange : (Swift.max(1, countRange.lowerBound)...countRange.upperBound)
        let count = Int.random(in: adjustedRange)
        return randomSamples(count: count)
    }
}
```

上記のコードは、`RandomProvidable`プロトコルを実装している型のケースをランダムに取得するための実装です。さらに、その型のケースを配列としてランダムに取得するための拡張も含まれています。

---
