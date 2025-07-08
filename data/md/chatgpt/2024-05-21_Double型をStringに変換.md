# Double型をStringに変換

Date: 2024-05-21

---

## 👤 User
*2024-05-21 15:24:06*

Swift で Double 型を String に変換するときに 小数点 第 n 位 を指定したい。

---

## 🤖 Assistant
*2024-05-21 15:24:22*

Swiftで`Double`型を`String`に変換する際に、小数点以下の桁数を指定する方法はいくつかあります。以下にその方法を示します。

### 1. `String(format:)` を使用する方法

`String(format:)`を使用して、小数点以下の桁数を指定できます。以下の例では小数点以下2桁を指定しています。

```swift
let doubleValue = 123.456789
let formattedString = String(format: "%.2f", doubleValue)
print(formattedString) // 出力: 123.46
```

`%.2f`の部分で小数点以下の桁数を指定しています。`%.3f`とすれば小数点以下3桁になります。

### 2. `NumberFormatter` を使用する方法

`NumberFormatter`を使用する方法もあります。より柔軟にフォーマットを設定できます。

```swift
let doubleValue = 123.456789
let numberFormatter = NumberFormatter()
numberFormatter.numberStyle = .decimal
numberFormatter.maximumFractionDigits = 2
numberFormatter.minimumFractionDigits = 2

if let formattedString = numberFormatter.string(from: NSNumber(value: doubleValue)) {
    print(formattedString) // 出力: 123.46
}
```

`maximumFractionDigits`と`minimumFractionDigits`で小数点以下の桁数を指定しています。

### 3. 拡張機能を使う方法

より簡単に使えるように拡張機能を定義することもできます。

```swift
extension Double {
    func toString(withDecimalPlaces places: Int) -> String {
        return String(format: "%.\(places)f", self)
    }
}

let doubleValue = 123.456789
let formattedString = doubleValue.toString(withDecimalPlaces: 2)
print(formattedString) // 出力: 123.46
```

このようにしておけば、任意の`Double`型の値に対して簡単に小数点以下の桁数を指定して文字列に変換できます。

これらの方法を使用することで、目的に応じた方法で`Double`型を`String`に変換できます。

---

## 👤 User
*2024-05-21 15:26:44*

NumberFormatter を使う方針で DOuble 型の extension で 小数点第N位まで出力する関数を作成してほしい

---

## 🤖 Assistant
*2024-05-21 15:26:52*

`NumberFormatter`を使用して`Double`型の拡張機能を作成し、小数点以下の桁数を指定して文字列に変換する関数を実装することができます。以下にその例を示します。

```swift
import Foundation

extension Double {
    func toString(withDecimalPlaces places: Int) -> String {
        let numberFormatter = NumberFormatter()
        numberFormatter.numberStyle = .decimal
        numberFormatter.maximumFractionDigits = places
        numberFormatter.minimumFractionDigits = places
        
        return numberFormatter.string(from: NSNumber(value: self)) ?? "\(self)"
    }
}

// 使用例
let doubleValue = 123.456789
let formattedString = doubleValue.toString(withDecimalPlaces: 2)
print(formattedString) // 出力: 123.46
```

この拡張機能では、`NumberFormatter`を使用して小数点以下の桁数を指定しています。`maximumFractionDigits`と`minimumFractionDigits`に同じ値を設定することで、指定した桁数で固定されます。

使用例のように、`toString(withDecimalPlaces:)`メソッドを呼び出す際に、小数点以下の桁数を指定するだけで、フォーマットされた文字列を取得できます。

---
