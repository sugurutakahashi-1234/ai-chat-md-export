# Swift String Arrays

日付: 2023-06-24

---

## 👤 ユーザー
*2023/6/24 12:51:36*

swiftでstringの配列をカンマ繋ぎで連結する方法

---

## 🤖 アシスタント
*2023/6/24 12:51:53*

SwiftでStringの配列をカンマで連結する方法は非常に簡単で、配列の `joined(separator:)` メソッドを使用します。このメソッドは配列の各要素を指定されたセパレータ（この場合はカンマ）で連結します。

以下にその例を示します。

```swift
let array = ["Apple", "Banana", "Cherry"]
let result = array.joined(separator: ",")
print(result)  // "Apple,Banana,Cherry"
```

このコードは、文字列の配列 `array` を取り、それらをカンマで連結します。その結果、出力は "Apple,Banana,Cherry" という単一の文字列になります。

あなたがもしスペースを含むカンマで区切りたいのであれば、セパレータに ", " を使うことができます。

```swift
let array = ["Apple", "Banana", "Cherry"]
let result = array.joined(separator: ", ")
print(result)  // "Apple, Banana, Cherry"
```

この場合、出力は "Apple, Banana, Cherry" となります。

---
