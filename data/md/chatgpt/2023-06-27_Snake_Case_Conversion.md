# Snake Case Conversion

日付: 2023-06-27

---

## 👤 ユーザー
*2023/6/28 2:28:16*

SwiftでStrringのExtensionでスネークケースに変換する処理を書いて欲しい。

---

## 🤖 アシスタント
*2023/6/28 2:28:53*

以下に、SwiftにおいてStringのExtensionとしてスネークケースへの変換を行う処理を示します。このコードは、大文字が現れるたびにアンダースコアを挿入し、すべての文字を小文字に変換することでスネークケースを生成します。

```swift
extension String {
    var snakeCased: String? {
        let pattern = "(?<=\\w)([A-Z])"

        // Check if the string is in the correct format
        if let regex = try? NSRegularExpression(pattern: pattern, options: []) {
            let range = NSRange(location: 0, length: self.count)
            let snakeCased = regex.stringByReplacingMatches(in: self, options: [], range: range, withTemplate: "_$1")
            return snakeCased.lowercased()
        }
        return nil
    }
}
```

このExtensionを使ってスネークケースに変換するには、次のように行います。

```swift
let myString = "HelloWorld"
print(myString.snakeCased) // Outputs: "hello_world"
```

ここで使用している正規表現`(?<=\\w)([A-Z])`は、大文字の前に小文字または数字がある場所を見つけるために使用されています。この部分は大文字の前にアンダースコアを挿入するのに適しています。そして、`stringByReplacingMatches`関数で大文字の前にアンダースコアを挿入し、全体を小文字に変換しています。

---

## 👤 ユーザー
*2023/6/28 2:29:06*

nilの可能性がない処理がいい

---

## 🤖 アシスタント
*2023/6/28 2:29:38*

承知しました。以下はnilを返さずにスネークケースに変換するStringのExtensionです。

```swift
extension String {
    var snakeCased: String {
        let pattern = "(?<=\\w)([A-Z])"
        let regex = try! NSRegularExpression(pattern: pattern, options: [])
        let range = NSRange(location: 0, length: self.count)
        let snakeCased = regex.stringByReplacingMatches(in: self, options: [], range: range, withTemplate: "_$1")
        return snakeCased.lowercased()
    }
}
```

このExtensionを使ってスネークケースに変換するには、次のように行います。

```swift
let myString = "HelloWorld"
print(myString.snakeCased) // Outputs: "hello_world"
```

ここでも同様の正規表現を用いていますが、NSRegularExpressionの初期化時に例外が投げられる可能性があるため、try!を用いて例外を無視しています。この場合、無効な正規表現パターンを指定した場合にはランタイムエラーが発生します。正規表現のパターンが固定で、有効であることが確定している場合のみこのような処理を行うべきです。

---

## 🤖 アシスタント
*2023/6/28 2:29:55*

何か他にご質問がありましたら、お気軽にどうぞ。

---
