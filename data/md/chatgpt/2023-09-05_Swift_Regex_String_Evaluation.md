# Swift Regex String Evaluation

日付: 2023-09-05

---

## 👤 ユーザー
*2023/09/05 15:01:21*

Swiftで正規表現でそれにあっているかあっていないかの評価をしたいんだけどどうすればできるんだっけ？

---

## 🤖 アシスタント
*2023/09/05 15:01:48*

Swiftで正規表現を用いて文字列がそのパターンに合致するかどうかを評価するには、`NSRegularExpression`クラスを使用します。以下は、このクラスを使用して正規表現に基づいて文字列を評価する方法のサンプルコードです。

```swift
import Foundation

func matchesRegex(_ string: String, pattern: String) -> Bool {
    do {
        let regex = try NSRegularExpression(pattern: pattern)
        let range = NSRange(location: 0, length: string.utf16.count)
        return regex.firstMatch(in: string, options: [], range: range) != nil
    } catch let error {
        print("Invalid regex: \(error.localizedDescription)")
        return false
    }
}

let testString = "hello123"
let pattern = "^[a-zA-Z]+\\d+$"

if matchesRegex(testString, pattern: pattern) {
    print("\(testString) matches the pattern!")
} else {
    print("\(testString) does not match the pattern!")
}
```

このサンプルでは、文字列がアルファベットの後に数字が続くパターン（例: "hello123"）に合致するかどうかを確認します。

`matchesRegex`関数は、文字列と正規表現パターンを受け取り、文字列がそのパターンに合致するかどうかをBool値で返します。正規表現のコンパイルに問題がある場合は、エラーメッセージを出力して`false`を返します。

---

## 👤 ユーザー
*2023/09/05 15:04:44*

Regex というものもあるらしいのだけどそれをつかうとどうなるの？

---

## 🤖 アシスタント
*2023/09/05 15:05:25*

はい、Swiftには`Regex`というものではありませんが、`NSRegularExpression`を簡単に使うためにカスタムの`Regex`クラスや構造体を作成することが一般的です。これにより、よりシンプルでSwiftらしい方法で正規表現を扱うことができます。

以下は、`Regex`というカスタム構造体を作成し、それを使って正規表現に基づいて文字列を評価する方法のサンプルです。

```swift
import Foundation

struct Regex {
    private let regularExpression: NSRegularExpression
    
    init(_ pattern: String) throws {
        try self.regularExpression = NSRegularExpression(pattern: pattern)
    }
    
    func matches(_ string: String) -> Bool {
        let range = NSRange(location: 0, length: string.utf16.count)
        return regularExpression.firstMatch(in: string, options: [], range: range) != nil
    }
}

let testString = "hello123"
let pattern = "^[a-zA-Z]+\\d+$"

do {
    let regex = try Regex(pattern)
    if regex.matches(testString) {
        print("\(testString) matches the pattern!")
    } else {
        print("\(testString) does not match the pattern!")
    }
} catch {
    print("Invalid regex pattern: \(error.localizedDescription)")
}
```

この`Regex`構造体は、`NSRegularExpression`をラップして、よりシンプルに使えるようにしています。正規表現パターンを渡すだけで`Regex`インスタンスを作成し、それを使って文字列がパターンに合致するかどうかを簡単に確認できます。

注意点として、このカスタムの`Regex`構造体は上記のサンプルのためのもので、全ての`NSRegularExpression`の機能をサポートしているわけではありません。必要に応じて、この構造体を拡張して、さらに多くの機能を追加することができます。

---
