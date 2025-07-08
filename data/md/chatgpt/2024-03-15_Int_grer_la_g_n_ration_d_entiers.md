# Intégrer la génération d'entiers

日付: 2024-03-15

---

## 👤 ユーザー
*2024/03/15 14:46:59*

Swiftでこのような形でIntの乱数を生成したい。(1)正の自然数（1,2,3..）。(2)負の整数（-1, -2, -3）、それぞれ、0を含めるかどうかのflagをboolで渡したもの デフォルトは含めることにする。また、(3)整数全体のstatic を記述してほしい。

extension Int {
    public static var random: Int {
        .random(in: 0...10000)
    }
}

---

## 🤖 アシスタント
*2024/03/15 14:47:48*

Swiftで指定された条件に基づいてIntの乱数を生成する方法を提供します。指定された要件は、正の自然数、負の整数（オプションで0を含む）、および整数全体をランダムに生成することです。また、0を含めるかどうかを決定するためのフラグを持つ機能も実装します。以下に、これらの要件を満たすSwiftの拡張機能を示します。

```swift
import Foundation

extension Int {
    /// 乱数を生成するメソッド。正の自然数、負の整数、またはそれらの範囲を指定できます。
    /// - Parameters:
    ///   - includeZero: 0を含めるかどうかのフラグ。デフォルトは`true`。
    ///   - isPositive: 正の数を生成するかどうか。`false`の場合は負の数を生成。デフォルトは`nil`で、整数全体の範囲。
    /// - Returns: 指定された条件に基づく整数。
    public static func random(includeZero: Bool = true, isPositive: Bool? = nil) -> Int {
        let lowerBound: Int
        let upperBound: Int
        
        switch isPositive {
        case .some(true):
            lowerBound = includeZero ? 0 : 1
            upperBound = 10000 // 正の範囲の上限
        case .some(false):
            lowerBound = includeZero ? 0 : -1
            upperBound = -10000 // 負の範囲の下限
        case .none:
            lowerBound = includeZero ? -10000 : -9999
            upperBound = 10000 // 整数全体の範囲
        }
        
        return Int.random(in: lowerBound...upperBound)
    }
}

// 使用例
let positiveRandom = Int.random(isPositive: true) // 正の自然数（0含む）
let negativeRandom = Int.random(includeZero: false, isPositive: false) // 負の整数（0含まず）
let anyRandom = Int.random() // 整数全体（0含む）
```

このコードは、Swiftの`Int`型に`random`メソッドを追加することで、指定された条件に基づく乱数を生成します。`isPositive`パラメータを使用して正の数、負の数、または整数全体から乱数を生成できます。また、`includeZero`フラグで0の含有を制御できます。これにより、様々な条件に基づく乱数の生成が可能になります。

---

## 👤 ユーザー
*2024/03/15 14:48:10*

扱いやすいいように、全部で5パターンあると思うけど、全部staticな変数 var で定義してほしい。

---

## 🤖 アシスタント
*2024/03/15 14:48:47*

Swiftで指定された5パターンの乱数を生成するための`Int`の拡張を、すべて`static`な変数として提供します。これらの変数は、正の自然数、負の整数（0を含む/含まない）、整数全体（0を含む/含まない）、および正の自然数（0を含まない）の5パターンに対応します。

```swift
import Foundation

extension Int {
    /// 正の自然数（0含む）
    public static var positiveWithZero: Int {
        .random(in: 0...10000)
    }
    
    /// 正の自然数（0含まず）
    public static var positiveWithoutZero: Int {
        .random(in: 1...10000)
    }
    
    /// 負の整数（0含む）
    public static var negativeWithZero: Int {
        .random(in: -10000...0)
    }
    
    /// 負の整数（0含まず）
    public static var negativeWithoutZero: Int {
        .random(in: -10000..<0)
    }
    
    /// 整数全体（0含む）
    public static var anyIntegerWithZero: Int {
        .random(in: -10000...10000)
    }
}

// 使用例
let positiveWithZero = Int.positiveWithZero
let positiveWithoutZero = Int.positiveWithoutZero
let negativeWithZero = Int.negativeWithZero
let negativeWithoutZero = Int.negativeWithoutZero
let anyIntegerWithZero = Int.anyIntegerWithZero
```

このコードスニペットでは、`Int`型を拡張して5つの異なる乱数生成パターンをカバーする`static`変数を定義しています。これにより、乱数を直接的かつ便利に取得することが可能になります。各変数は、その名前が示す通りの乱数範囲を生成します。これらの変数を使用することで、特定の範囲の乱数が必要な場合に、簡単かつ直感的にアクセスできます。

---
