# Swift String to Bool

日付: 2023-09-09

---

## 👤 ユーザー
*2023/9/9 18:11:01*

Swiftで文字列のtrueや1をtrueに変換する方法

---

## 🤖 アシスタント
*2023/9/9 18:11:21*

Swiftで文字列の`"true"`や`"1"`を`Bool`の`true`に変換する方法を示します。以下の関数を使用して変換を試みることができます。

```swift
func stringToBool(_ str: String) -> Bool? {
    switch str.lowercased() {
    case "true", "1":
        return true
    case "false", "0":
        return false
    default:
        return nil
    }
}

if let result = stringToBool("true") {
    print(result)  // true
}

if let result = stringToBool("1") {
    print(result)  // true
}
```

この関数は、文字列が"true"または"1"の場合に`true`を、"false"または"0"の場合に`false`を返します。それ以外の文字列が渡された場合、関数は`nil`を返します。

---

## 👤 ユーザー
*2023/9/9 18:11:42*

Swiftの標準APIで実装されてないのか？

---

## 🤖 アシスタント
*2023/9/9 18:12:06*

申し訳ございません、おっしゃる通り、Swiftの標準APIには文字列をBoolに変換する便利なメソッドがあります。

具体的には、`Bool`のイニシャライザを使用して文字列からBoolへの変換を試みることができます。以下のようになります：

```swift
let trueString = "true"
let falseString = "false"

if let boolValue = Bool(trueString) {
    print(boolValue)  // true
}

if let boolValue = Bool(falseString) {
    print(boolValue)  // false
}
```

ただし、この標準のイニシャライザは`"1"`や`"0"`を`true`や`false`に変換することはできません。そのため、`"1"`や`"0"`のような文字列を考慮に入れる場合は、カスタム関数を使用するか、事前に変換を行う必要があります。

---
