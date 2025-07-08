# ランダムな文字列を生成する (Generate Random String)

Date: 2023-05-10

---

## 👤 User
*2023-05-11 01:55:14*

Swiftで適当な文字列を生成する、短いコード

---

## 🤖 Assistant
*2023-05-11 01:55:58*

Swiftでランダムな文字列を生成するための短いコード例を以下に示します。このコードは、英字の中から指定した長さのランダムな文字列を作成します。

```swift
import Foundation

func randomString(length: Int) -> String {
    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return String((0..<length).map { _ in letters.randomElement()! })
}

let randomStr = randomString(length: 10)
print(randomStr)
```

このコードでは、`randomString`関数を定義しています。関数は、指定された`length`の文字列を`letters`からランダムに選んで生成します。最後に、この関数を使って10文字のランダムな文字列を生成し、コンソールに出力しています。

---

## 👤 User
*2023-05-11 01:57:36*

uuidの文字列生成のコードは

---

## 🤖 Assistant
*2023-05-11 01:58:05*

SwiftでUUIDを生成し、それを文字列として取得するコードは以下のとおりです。

```swift
import Foundation

let uuid = UUID()
let uuidString = uuid.uuidString
print(uuidString)
```

このコードでは、`UUID()`を使って新しいUUIDを生成し、`uuidString`プロパティで文字列として取得しています。最後に、生成されたUUID文字列をコンソールに出力しています。

---
